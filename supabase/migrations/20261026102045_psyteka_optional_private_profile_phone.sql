-- Historical mirror of migration applied to project uwouubzabqpuujuovala.
-- A later migration corrects the pattern below; keep both for audit/history.
alter table public.psy_user_profiles
 add column if not exists phone_e164 text
 constraint psy_user_profiles_phone_e164_check check (
   phone_e164 is null or phone_e164 ~ '^\\+[1-9][0-9]{6,14}$'
 );
comment on column public.psy_user_profiles.phone_e164
 is 'Необязательный контакт владельца профиля в формате E.164; не подтверждает владение номером, не используется для входа или SMS.';
