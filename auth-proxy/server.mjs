import express from 'express';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

// Unprivileged relay. Never put a service_role or secret key on this server.
// No user e-mails, JWTs, OTPs, request bodies or response bodies are logged.
const upstreamAddress = process.env.SUPABASE_UPSTREAM_URL || 'https://uwouubzabqpuujuovala.supabase.co';
const upstream = new URL(upstreamAddress);
if (upstream.protocol !== 'https:' || !/^[a-z0-9-]+\.supabase\.co$/i.test(upstream.hostname) ||
    upstream.pathname !== '/' || upstream.search || upstream.hash) {
  throw new Error('SUPABASE_UPSTREAM_URL must be an HTTPS Supabase project origin');
}
const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || 'https://metolaria.ru,https://www.metolaria.ru')
    .split(',').map(s => s.trim()).filter(Boolean)
);
for (const value of allowedOrigins) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.origin !== value || url.username || url.password) {
    throw new Error('ALLOWED_ORIGINS must contain HTTPS origins only');
  }
}

const app = express();
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});
app.get('/healthz', (_req, res) => res.status(200).json({ status: 'ok' }));
app.get('/upstream-health', async (_req, res) => {
  try {
    const response = await fetch(new URL('/auth/v1/health', upstream), {
      method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(7000)
    });
    // A 401 without an API key proves the remote gateway responded.
    res.status(response.status < 500 ? 200 : 503)
      .json({ upstream: response.status < 500 ? 'reachable' : 'error' });
  } catch {
    res.status(503).json({ upstream: 'unreachable' });
  }
});

function permittedPath(path) {
  return ['/auth/v1', '/rest/v1', '/functions/v1', '/storage/v1']
    .some(prefix => path === prefix || path.startsWith(prefix + '/'));
}
const requestHeaders = new Set([
  'accept', 'authorization', 'apikey', 'content-type', 'x-client-info',
  'prefer', 'range', 'content-range', 'accept-profile', 'content-profile',
  'if-match', 'if-none-match', 'x-supabase-api-version'
]);
const responseHeaders = new Set([
  'content-type', 'cache-control', 'etag', 'last-modified', 'content-range',
  'accept-ranges', 'location', 'www-authenticate', 'x-supabase-api-version',
  'sb-gateway-version', 'sb-request-id', 'retry-after'
]);

app.use((req, res, next) => {
  // Browser CORS restriction, not an identity boundary. Supabase JWT/RLS remains authoritative.
  const origin = req.headers.origin;
  if (!origin || !allowedOrigins.has(origin)) {
    return res.status(403).json({ error: 'origin_not_allowed' });
  }
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', [...requestHeaders].join(', '));
  res.setHeader('Access-Control-Expose-Headers', 'content-range, etag, location, retry-after, sb-request-id');
  res.setHeader('Access-Control-Max-Age', '600');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

app.use(express.raw({ type: () => true, limit: '8mb' }));
app.use(async (req, res) => {
  const incoming = req.originalUrl;
  const pathname = incoming.split('?')[0];
  if (!pathname.startsWith('/') || !permittedPath(pathname)) {
    return res.status(404).json({ error: 'route_not_found' });
  }
  if (!['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  // The hostname is fixed by configuration, never determined from user input.
  const target = new URL(upstream.origin + incoming);
  if (target.origin !== upstream.origin) {
    return res.status(400).json({ error: 'invalid_path' });
  }
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (requestHeaders.has(key) && typeof value === 'string') headers.set(key, value);
  }
  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body;
  try {
    const response = await fetch(target, {
      method: req.method, headers, body, redirect: 'manual',
      signal: AbortSignal.timeout(28000)
    });
    res.status(response.status);
    for (const [key, value] of response.headers) {
      if (!responseHeaders.has(key)) continue;
      if (key === 'location') {
        const redirect = new URL(value, upstream);
        if (redirect.origin === upstream.origin) {
          res.setHeader('Location', redirect.pathname + redirect.search + redirect.hash);
        } else if (allowedOrigins.has(redirect.origin)) {
          res.setHeader('Location', redirect.href);
        }
      } else res.setHeader(key, value);
    }
    // Node fetch decompresses bodies; forwarding Content-Length/Encoding would be incorrect.
    if (req.method === 'HEAD' || !response.body) return res.end();
    await pipeline(Readable.fromWeb(response.body), res);
  } catch (error) {
    if (res.headersSent) return res.destroy();
    const timeout = error?.name === 'TimeoutError';
    res.status(timeout ? 504 : 502)
      .json({ error: timeout ? 'upstream_timeout' : 'upstream_unavailable' });
  }
});
app.use((error, _req, res, _next) => {
  if (res.headersSent) return res.end();
  res.status(error?.type === 'entity.too.large' ? 413 : 400)
    .json({ error: 'invalid_request' });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => console.info('Metolaria gateway listening'));
