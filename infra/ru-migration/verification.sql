-- Безопасная проверка количества и целостности данных.
-- Выполнять на исходной и восстановленной БД; сравнить вывод.
-- Содержимое ответов детей и личные данные пользователей НЕ выводятся.
SELECT
 (SELECT count(*) FROM auth.users) AS auth_users,
 (SELECT count(*) FROM auth.identities) AS auth_identities,
 (SELECT count(*) FROM auth.mfa_factors WHERE status = 'verified') AS verified_mfa_factors,
 (SELECT count(*) FROM public.psy_account_roles) AS account_roles,
 (SELECT count(*) FROM public.psy_saved_assessments) AS saved_assessments,
 (SELECT count(*) FROM public.psy_assessment_drafts) AS assessment_drafts,
 (SELECT count(*) FROM public.psy_user_collections) AS user_collections,
 (SELECT count(*) FROM public.psy_trial_access) AS trial_access,
 (SELECT count(*) FROM public.psy_paid_access) AS paid_access,
 (SELECT count(*) FROM public.psy_portfolio_layout_versions) AS portfolio_layout_versions,
 (SELECT count(*) FROM public.psy_site_content_versions) AS site_content_versions,
 (SELECT count(*) FROM storage.objects) AS storage_objects;

SELECT
 (SELECT count(*) FROM public.psy_saved_assessments s
  LEFT JOIN auth.users u ON u.id = s.user_id WHERE u.id IS NULL) AS orphan_saved_assessments,
 (SELECT count(*) FROM public.psy_assessment_drafts d
  LEFT JOIN auth.users u ON u.id = d.user_id WHERE u.id IS NULL) AS orphan_assessment_drafts;

-- После импорта дополнительно проверять все RLS-политики, триггеры,
-- ограничения и индексы, версии PostgreSQL и установленные расширения.
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
