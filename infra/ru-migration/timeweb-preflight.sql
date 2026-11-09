-- Метолария: проверка целевой PostgreSQL без изменения данных.
-- Запускать только после создания тестовой базы через psql в защищенной среде.
-- Не передавать пароль, строку подключения и результаты, содержащие секреты, в чат.
SELECT
  current_setting('server_version_num')::integer AS postgres_version_num,
  current_user AS connected_as,
  current_database() AS database_name,
  r.rolsuper AS is_superuser,
  r.rolcreaterole AS can_create_role,
  r.rolcreatedb AS can_create_db,
  has_database_privilege(current_user, current_database(), 'CREATE') AS can_create_objects
FROM pg_roles r WHERE r.rolname = current_user;
SELECT e.name AS required_extension,
       ae.name IS NOT NULL AS installable
FROM (VALUES ('pgcrypto'), ('uuid-ossp'), ('supabase_vault')) AS e(name)
LEFT JOIN pg_available_extensions AS ae ON ae.name = e.name
ORDER BY e.name;
-- Проверка не является разрешением на установку полного Supabase.
-- Без нужных привилегий и расширений импорт auth/RLS/Vault несовместим.
