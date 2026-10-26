# Психотека – настройка реальных писем регистрации

Статус: **готовы шаблоны и клиентский ввод одноразового кода, SMTP еще НЕ подключен**. В `auth-config.js` значение `registrationEnabled: false` сохраняется до успешного теста.

## Какой адрес нужен после входа

Supabase Dashboard:
https://supabase.com/dashboard/project/uwouubzabqpuujuovala/auth/url-configuration

- **Site URL**: `https://psyteka.onrender.com`
- **Redirect URL**: `https://psyteka.onrender.com/index.html?home=1&entry=1`
- Дополнительный **Redirect URL** для резервной страницы: `https://psyteka.onrender.com/register.html`

Сохранить. Для регистрации на главной используется **первый redirect**, а не /register.html. Использовать только HTTPS.

## Шаблоны русских писем

Supabase Dashboard:
https://supabase.com/dashboard/project/uwouubzabqpuujuovala/auth/templates

- **Magic Link / OTP**: тема `Психотека – код для входа`, содержимое из [magic-link.html](../../supabase/email-templates/magic-link.html).
- **Confirm sign up**: тема `Психотека – подтвердите почту`, содержимое из [confirmation.html](../../supabase/email-templates/confirmation.html).
- В обоих шаблонах присутствует **`{{ .Token }}`**, а не `{{ .ConfirmationURL }}`. Это означает ввод числового одноразового кода в окне Психотеки. Код генерирует и проверяет Supabase, в исходниках его нет. Не менять оба шаблона на постоянный код и не отключать подтверждение адреса.
- Для приглашений через панель Auth Users отдельно оставить штатный шаблон Invite, не смешивать с Magic Link.

## SMTP – нужен выбор отправителя и его учетные данные

Supabase Dashboard:
https://supabase.com/dashboard/project/uwouubzabqpuujuovala/auth/smtp

Встроенный SMTP Supabase отправляет только разрешенным адресам команды проекта, ограничение **2 письма/час**. Для посторонних зарегистрироваться через почту без custom SMTP нельзя.

**Вариант 1 – для пробного запуска на небольшой аудитории, без новой подписки:** отдельная учетная запись Gmail, 2-Step Verification и Google App Password.

- Host: `smtp.gmail.com`
- Port: `587` (TLS / STARTTLS)
- Username: полный адрес **отдельного** Gmail аккаунта
- Password: Google **App Password**, не обычный пароль
- Sender name: `Психотека`
- Sender email: тот же адрес Gmail
- 2FA включена, пароль приложения создавать только в учетной записи Google, а вводить **только в настройках SMTP Supabase**: https://myaccount.google.com/apppasswords
- Не использовать личную/административную почту владельца как массовый адрес отправителя. Поставщик может ограничивать частоту или блокировать массовые письма. Для публичного запуска Gmail не лучший вариант.

**Вариант 2 – для публичной регистрации с собственным доменом:** Resend, тариф Free ($0, до 3000 писем/месяц и 100 в день на дату проверки). Требует домен с доступом к DNS для проверки SPF/DKIM/DMARC (домен `onrender.com` не принадлежит проекту, его DNS не управляется владельцем). Создать почтовый аккаунт/домен и настроить собственную отправку. SMTP-данные Resend получать в своем личном кабинете.

Нельзя записывать SMTP пароль в HTML/JS, GitHub, публичные переменные окружения или чат. Не предоставлять модераторам доступ к настройкам Supabase.

## Проверка до включения регистрации

1. В Supabase **Sign In / Providers** убедиться, что Email включен, а email confirmation не выключено.
2. Включить SMTP; сохранить пароль только в защищенных настройках панели Supabase.
3. Отправить одно письмо на свой подтвержденный адрес; проверить получение в «Входящих» и «Спам». Не рассылать массово до теста.
4. Пройти вход как зарегистрированный владелец, проверить отправку одноразового кода, `verifyOtp`, роль owner и панель управления.
5. Пройти регистрацию со **второго независимого адреса**. Убедиться, что новая роль participant и нельзя себя повысить.
6. Проверить, что повторные OTP работают с лимитами, а пробный период остается одноразовым на 48 часов.
7. После этих тестов установить `registrationEnabled: true` в `auth-config.js` и опубликовать на Render. На этом шаге кнопка «Посмотреть тестовую библиотеку» отключится, но **статические файлы методик по-прежнему будут доступны по прямым ссылкам** – до продажи необходимо закрытое хранилище.

**Почему настройки не сделаны автоматически:** доступный Supabase connector дает доступ к проектам, SQL и Edge Functions, но не имеет действия для изменения hosted Auth URL/SMTP. Настройки почтового провайдера требуют учетных данных, которых нет и не должно быть в GitHub или в чате.

## Источники

- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/auth/auth-email-passwordless
- https://supabase.com/docs/guides/auth/auth-email-templates
- https://supabase.com/docs/reference/javascript/auth-verifyotp
- https://supabase.com/kb/troubleshooting/using-google-smtp-with-supabase-custom-smtp-ZZzU4Y
- https://support.google.com/accounts/answer/185833
- https://resend.com/pricing
