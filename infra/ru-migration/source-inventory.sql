-- Чтение только счетчиков и структуры исходного проекта.
-- НЕ выгружает почту, пользователей поименно или ответы детей.
SELECT
 (SELECT count(*) FROM auth.users) AS users,
 (SELECT count(*) FROM auth.identities) AS identities,
 (SELECT count(*) FROM auth.mfa_factors WHERE status='verified') AS mfa_factors,
 (SELECT count(*) FROM public.psy_saved_assessments) AS assessments,
 (SELECT count(*) FROM public.psy_assessment_drafts) AS drafts,
 (SELECT count(*) FROM public.psy_user_collections) AS collections,
 (SELECT count(*) FROM public.psy_account_roles) AS account_roles,
 (SELECT count(*) FROM public.psy_portfolio_layout_versions) AS portfolio_versions,
 (SELECT count(*) FROM public.psy_site_content_versions) AS site_content_versions,
 (SELECT count(*) FROM storage.objects) AS objects;
SELECT
 (SELECT count(*) FROM public.psy_saved_assessments a
 LEFT JOIN auth.users u ON u.id = a.user_id WHERE u.id IS NULL) AS orphan_assessments,
 (SELECT count(*) FROM public.psy_assessment_drafts d
 LEFT JOIN auth.users u ON u.id = d.user_id WHERE u.id IS NULL) AS orphan_drafts;
SELECT schemaname, tablename, rowsecurity
FROM pg_tables WHERE schemaname='public' ORDER BY tablename;
SELECT extname, extversion FROM pg_extension ORDER BY extname;
