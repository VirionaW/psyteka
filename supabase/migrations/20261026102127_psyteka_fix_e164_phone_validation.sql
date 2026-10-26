-- Avoid ambiguous regex backslash escaping by using a literal plus character class.
alter table public.psy_user_profiles drop constraint if exists psy_user_profiles_phone_e164_check;
alter table public.psy_user_profiles add constraint psy_user_profiles_phone_e164_check
 check (phone_e164 is null or phone_e164 ~ '^[+][1-9][0-9]{6,14}$');
