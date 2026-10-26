# Психотека: телефон и защита аккаунтов – 26.10.2026

## Применено

- В Supabase `public.psy_user_profiles.phone_e164` – необязательный личный телефон. Допустимые номера международного формата E.164, например `+79991234567`, без кода подтверждения и без включенного SMS. Пустой номер = NULL.
- Миграции проекта: [20261026102045](../../supabase/migrations/20261026102045_psyteka_optional_private_profile_phone.sql), [20261026102127](../../supabase/migrations/20261026102127_psyteka_fix_e164_phone_validation.sql).
- В форме [профиля](../../profile.html) отдельная карточка телефона. Скрипт [profile-phone.js](../../profile-phone.js) читает и сохраняет номер **только в Supabase** после проверки `getUser` и подтвержденной почты. Не хранит номер в demo localStorage, не выводит чужие номера. Неотправленный номер не сохраняется.
- RLS для `psy_user_profiles` уже ограничивает SELECT/INSERT/UPDATE/DELETE `user_id = auth.uid()`; в `psy_account_roles` нет клиентского INSERT/UPDATE/DELETE. Модератор не получает права читать чужой профиль.
- Страницы [регистрации](../../register.html) и [управления](../../manage-users.html) используют браузерную CSP (в `meta http-equiv`) и `Referrer-Policy` для запрета произвольных внешних скриптов/источников. В регистрации убран inline CSS; браузерные политики действуют только на эти две страницы, не на весь сайт.
- Email Auth пока не запущен: `auth-config.js.registrationEnabled=false`, пока не настроены SMTP и допустимые redirect URL. Поэтому новый телефон остается выключенным до подтвержденного входа.

## Что осталось для полной защиты

1. **Реальные HTTP-заголовки Render Static Site**: Render Dashboard -> Психотека -> Settings -> Headers. Рекомендуемые правила для `/*`:
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
   - `X-Frame-Options: SAMEORIGIN` (НЕ DENY на всех страницах: главная содержит собственные iframe-предпросмотры библиотеки).
   - Для `/register.html`, `/manage-users.html` можно назначить `X-Frame-Options: DENY`, если правило пути переопределяет `/*`.
   - `Content-Security-Policy` заголовком только после проверки всех страницы сайта: текущая библиотека использует многочисленные inline-скрипты и встроенные фреймы. Некорректная глобальная CSP нарушит интерфейс.
   - Не используйте `Cache-Control: immutable` для HTML и JS без хешированных имен файлов.
2. **Защита от ботов:** настроить Cloudflare Turnstile/hCaptcha через Supabase Dashboard -> Authentication -> Bot and Abuse Protection. Нужен публичный site key для формы и секретный ключ **только** в защищенных настройках Supabase. Поддержка CAPTCHA на сервере не включена до настройки обоих ключей.
3. **Почта:** настроить внешний SMTP, Site URL и redirect URL, проверить email-OTP и доставку. Только потом включить регистрацию.
4. **Защита Владельца:** после входа подключить TOTP-MFA (приложение-аутентификатор) и для опасных действий требовать `aal2`. Пока MFA не настроена и не проверена на двух аккаунтах.
5. **Защита платных/закрытых методик:** текущий `site-access.js` с тестовым кодом выполняется в браузере и НЕ защищает исходники публичных файлов. Для настоящего ограничения потребуется серверная проверка JWT перед отдачей материалов, защищенное хранилище или приватный backend. Не считать внешний экран с кодом защиты авторского контента.
6. Добавить политику конфиденциальности, порядок удаления аккаунта и данных, срок хранения и согласие на обработку. Не хранить ФИО детей и результаты диагностики в этой таблице.

## Проверено

- SQL: ограничение формата Е.164 принимает `+4915112345678`, отклоняет формат без `+` и слишком короткие номера.
- Supabase: таблицы с RLS, `get_advisors(security)` – 0 замечаний (это не полноценный пентест).
- В новых клиентских файлах нет секретного service_role; для Supabase используется только публичный publishable API key.
- Регистрация не обещается пользователям до рабочего SMTP и проверенных redirect URL.

Официальные справки: https://render.com/docs/static-site-headers
https://supabase.com/docs/guides/auth/auth-captcha
https://supabase.com/docs/guides/auth/auth-mfa
https://supabase.com/docs/guides/auth/auth-smtp
