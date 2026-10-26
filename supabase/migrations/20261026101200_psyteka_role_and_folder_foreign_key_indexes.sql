-- Mirrored from live migration 20261026101200. Do not reapply to same database.
create index if not exists psy_account_roles_granter_idx on public.psy_account_roles(granted_by);
create index if not exists psy_folder_items_folder_owner_idx on public.psy_folder_items(folder_id,user_id);
create index if not exists psy_folder_items_owner_method_idx on public.psy_folder_items(user_id,method_id);
