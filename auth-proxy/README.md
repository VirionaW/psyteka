# Metolaria API gateway – isolated trial deployment

This is a small Node.js / Express relay to the current Supabase project.
**It does not migrate user accounts, saved child assessments, or the database.**
The live HTML/CSS/JS application and the `main` branch are untouched.

## Deploy on Timeweb App Platform

1. Create a NEW App Platform application, select **Express / Node.js 24**, region **Moscow**.
2. Repository: `VirionaW/psyteka`; branch: **`metolaria-auth-proxy`**.
3. In **Advanced settings**, set **Project directory** to **`auth-proxy`**.
4. Start command: `npm start`; health-check path: `/healthz`.
5. A 1 CPU / 2 GB RAM plan is sufficient for an initial small-scale test.
6. Optional application variables (not secrets):
   * `SUPABASE_UPSTREAM_URL=https://uwouubzabqpuujuovala.supabase.co`
   * `ALLOWED_ORIGINS=https://metolaria.ru,https://www.metolaria.ru`
7. Validate `/healthz` and `/upstream-health` on the issued Timeweb HTTPS domain.
8. From a Russian mobile network, verify access to those endpoints BEFORE any
   changes to the site's Supabase configuration.
9. A SEPARATE reviewed frontend change is then required for CSP, URL validation,
   Auth and data SDK calls, and rollback. Do not switch the website until end-to-end
   login and saved-assessment tests have passed.

## Security

* Only fixed Supabase API routes are proxied (Auth, REST, Functions, Storage).
* No service-role/secret keys, OTPs, email addresses, JWTs, or assessment
  contents are logged or stored by this application.
* Requests without an allowed browser Origin are rejected. This is not a
  security boundary – real access still relies on Supabase Auth and RLS.
* HTTP only: Realtime WebSockets are NOT supported. Confirm they are not used
  before switching the full Supabase client URL.
* OTP magic links might still point to the Supabase domain; numeric-code login
  and email-link login must be tested separately.
* Supabase might rate-limit callers sharing the gateway's outgoing IP. Monitor
  OTP sending before expanding beyond the test accounts.
* Personal data will still be transmitted to an EU Supabase database. A Russian
  gateway does NOT satisfy Russian data-localization requirements by itself.
* No guarantee that gateway routing eliminates the carrier-specific timeout.

Run `npm test` to verify JavaScript syntax. No real authentication requests
should be sent during deployment tests with child records.
