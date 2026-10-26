# Психотека: состояние регистрации и ролей – 26.10.2026

## Уже настроено в Supabase

- Проект **Psyteka** в организации Psyteka, регион `eu-central-1`, Ref: `uwouubzabqpuujuovala`.
- Согласованная стоимость нового проекта: **$0/месяц**. Ограничения бесплатного тарифа действуют.
- Применена миграция `20261026100943_psyteka_initial_accounts_roles_favorites` (копия: [SQL](../../supabase/migrations/20261026100943_psyteka_initial_accounts_roles_favorites.sql)).
- Применена миграция индексов `20261026101200_psyteka_role_and_folder_foreign_key_indexes` (копия: [SQL](../../supabase/migrations/20261026101200_psyteka_role_and_folder_foreign_key_indexes.sql)).
- Таблицы `psy_account_roles`, `psy_user_profiles`, `psy_favorite_methods`, `psy_method_folders`, `psy_folder_items`; на всех включен RLS.
- В таблице ролей клиент `authenticated` имеет только SELECT своей строки через RLS. Ни участник, ни модератор не могут самостоятельно менять роли.
- Серверная функция `manage-user-roles` развернута, проверка JWT включена; каждый запрос перепроверяет подтвержденного пользователя и наличие роли `owner`.
- Проверка безопасности Supabase после создания таблиц: 0 замечаний. Контрольные SQL-запросы подтвердили клиентские запреты INSERT/UPDATE ролей.
- На 26.10.2026: 1 подтвержденный аккаунт, 1 владелец (owner), 0 модераторов. Роль owner назначена через доверенный SQL после сверки email с аккаунтом владельца организации. Это не включает публичную регистрацию: SMTP и Auth redirect пока требуют настройки.

## Уже настроено в GitHub

- Страница регистрации `register.html`, `registration.js`, `registration.css` и панель `manage-users.html` подготовлены.
- `auth-config.js` содержит **только публичные** URL и publishable key проекта; никакой секретный ключ на фронтенд не передавался.
- В `auth-config.js` оставлено **`registrationEnabled: false`**. Форма входа преднамеренно неактивна до настройки email и callback URL. В общий публичный сайт ссылка не добавлена.
- Старые демо-профиль и код доступа к библиотеке не изменены; синхронизации профиля с БД пока нет.

## Что требуется для запуска для людей

1. В Supabase Dashboard -> Authentication -> URL Configuration:
   - **Site URL**: `https://psyteka.onrender.com`
   - **Redirect URL**: `https://psyteka.onrender.com/register.html`
2. Проверить Email Provider в Authentication -> Providers. Для входа по OTP настроить шаблон Magic Link / OTP на `{{ .Token }}`, если нужен числовой код, или сохранить magic link с работающим URL redirect.
3. **Важно:** встроенный SMTP Supabase умеет отправлять письма только заранее разрешенным адресам участников команды проекта и имеет сильные ограничения. Для регистрации подруг и обычных участников нужен **свой SMTP** (Authentication -> SMTP Settings). Бесплатный тариф проекта сам по себе не гарантирует бесплатную массовую отправку писем. **Не приглашать подруг в команду Supabase для обхода email-ограничения**: команда Supabase и роль модератора Психотеки – разные вещи.
4. После настройки почты проверить email и ссылку/код на тестовом аккаунте и при успехе включить `registrationEnabled: true`.
5. Зарегистрировать аккаунт фактического владельца и подтвердить адрес. Установить `owner` только после проверки `auth.users.id` доверенным SQL, не по введенному пользователем email или metadata; у владельца только одна строка с ролью owner.
6. Проверить роль владельца, назначение и снятие модератора, отказ в доступе участникам, отзыв роли, выход и два независимых аккаунта для проверки RLS.
7. После тестов добавить вход в навигацию Психотеки и опубликовать на Render. Не объявлять живую регистрацию до завершения этой проверки.

Панель модератора пока не редактирует методики: для редактирования потребуется отдельный защищенный API и журнал изменений. Избранное и папки имеют готовые таблицы, но интерфейс и синхронизация еще не подключены.

## Ссылки на настройки проекта

- [Проект Supabase](https://supabase.com/dashboard/project/uwouubzabqpuujuovala)
- [URL Configuration](https://supabase.com/dashboard/project/uwouubzabqpuujuovala/auth/url-configuration)
- [SMTP Settings](https://supabase.com/dashboard/project/uwouubzabqpuujuovala/auth/smtp)
- [Email Templates](https://supabase.com/dashboard/project/uwouubzabqpuujuovala/auth/templates)

## Документация безопасности

- https://supabase.com/docs/guides/auth/auth-email-passwordless
- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/api/custom-claims-and-role-based-access-control-rbac
