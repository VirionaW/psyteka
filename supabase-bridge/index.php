<?php
declare(strict_types=1);
/*
 * Метолария: ограниченный HTTPS-шлюз для браузерного Supabase API.
 * Не содержит секретов и не заменяет Supabase Auth/RLS.
 * Запускать только на сервере metolaria.ru с HTTPS и работающим cURL.
 * Прежде чем включать переключатель в auth-config.js, проверить /__health.
 */
ini_set('display_errors', '0');
header('Cache-Control: private, no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

$upstream = 'https://uwouubzabqpuujuovala.supabase.co';
$prefix = '/supabase-bridge';
$requestUri = (string) ($_SERVER['REQUEST_URI'] ?? '');
$path = (string) parse_url($requestUri, PHP_URL_PATH);
$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

function bridgeReply(int $code, string $message): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['message' => $message], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
if (!extension_loaded('curl')) {
    bridgeReply(503, 'Шлюз временно недоступен.');
}
if ($path === $prefix . '/__health') {
    if ($method !== 'GET' && $method !== 'HEAD') bridgeReply(405, 'Метод не поддерживается.');
    $check = curl_init($upstream . '/auth/v1/health');
    curl_setopt_array($check, [
        CURLOPT_NOBODY => true, CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_TIMEOUT => 9,
        CURLOPT_SSL_VERIFYPEER => true, CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_FOLLOWLOCATION => false
    ]);
    curl_exec($check);
    $reachable = curl_errno($check) === 0 && curl_getinfo($check, CURLINFO_HTTP_CODE) >= 100;
    curl_close($check);
    http_response_code($reachable ? 200 : 503);
    header('Content-Type: application/json; charset=utf-8');
    if ($method !== 'HEAD') echo json_encode(['bridge' => 'metolaria', 'upstream_reachable' => $reachable]);
    exit;
}
if (!str_starts_with($path, $prefix . '/')) bridgeReply(404, 'Не найдено.');
$targetPath = substr($path, strlen($prefix));
if (strlen($targetPath) > 2048 || str_contains($targetPath, '..') ||
    !preg_match('~^/(auth|rest|storage|functions|graphql)/v1(?:/|$)~D', $targetPath)) {
    bridgeReply(404, 'Недоступный путь API.');
}
if (!in_array($method, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'], true)) {
    bridgeReply(405, 'Метод не поддерживается.');
}
$query = parse_url($requestUri, PHP_URL_QUERY);
if (!is_string($query)) $query = '';
if (strlen($query) > 4096) bridgeReply(414, 'Слишком длинный запрос.');
$body = '';
if (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
    if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 2500000) bridgeReply(413, 'Превышен размер запроса.');
    $body = file_get_contents('php://input', false, null, 0, 2500001);
    if (!is_string($body) || strlen($body) > 2500000) bridgeReply(413, 'Превышен размер запроса.');
}
$received = function_exists('getallheaders') ? getallheaders() : [];
if (!is_array($received)) $received = [];
$forwardable = [
    'apikey' => true, 'authorization' => true, 'accept' => true,
    'content-type' => true, 'x-client-info' => true,
    'x-supabase-api-version' => true,
    'accept-profile' => true, 'content-profile' => true,
    'prefer' => true, 'range' => true, 'if-none-match' => true
];
$headers = ['Expect:'];
foreach ($received as $name => $value) {
    $lower = strtolower((string) $name);
    if (!isset($forwardable[$lower]) || !is_string($value) || str_contains($value, "\r") || str_contains($value, "\n")) continue;
    $headers[] = $name . ': ' . $value;
}
if (!preg_grep('/^authorization:/i', $headers)) {
    $auth = (string) ($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    if ($auth !== '' && !str_contains($auth, "\r") && !str_contains($auth, "\n")) $headers[] = 'Authorization: ' . $auth;
}
if (!preg_grep('/^content-type:/i', $headers) && isset($_SERVER['CONTENT_TYPE'])) {
    $headers[] = 'Content-Type: ' . (string) $_SERVER['CONTENT_TYPE'];
}
$replyHeaders = [];
$ch = curl_init($upstream . $targetPath . ($query === '' ? '' : '?' . $query));
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true, CURLOPT_CUSTOMREQUEST => $method,
    CURLOPT_HTTPHEADER => $headers, CURLOPT_CONNECTTIMEOUT => 7, CURLOPT_TIMEOUT => 25,
    CURLOPT_SSL_VERIFYPEER => true, CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_HEADERFUNCTION => function ($handle, $line) use (&$replyHeaders) {
        if (preg_match('/^(content-type|content-range|etag|retry-after|x-ratelimit-limit|x-ratelimit-remaining):\s*(.+)\r?\n$/i', $line, $m)) {
            $replyHeaders[strtolower($m[1])] = trim($m[2]);
        }
        return strlen($line);
    }
]);
if (in_array($method, ['POST', 'PUT', 'PATCH'], true)) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
if ($method === 'HEAD') curl_setopt($ch, CURLOPT_NOBODY, true);
$response = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$failed = $response === false || curl_errno($ch) !== 0 || $status < 100;
curl_close($ch);
if ($failed) bridgeReply(502, 'Нет связи с сервисом аккаунтов. Повторите запрос позднее.');
http_response_code($status);
foreach ($replyHeaders as $key => $value) header($key . ': ' . $value);
if (!isset($replyHeaders['content-type'])) header('Content-Type: application/json; charset=utf-8');
if ($method !== 'HEAD') echo $response;
