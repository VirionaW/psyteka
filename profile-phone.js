"use strict";
/* Optional private contact phone.
   Never store a number in localStorage, logs or unverified user metadata.
   Only read/write it from the logged-in owner's RLS-protected profile row. */
(async function(){
 const input=document.getElementById("profilePhone");
 const button=document.getElementById("savePhoneBtn");
 const form=document.getElementById("phoneForm");
 const status=document.getElementById("phoneStatus");
 if(!input||!button||!form||!status)return;
 function note(message,error=false){
  status.textContent=message;
  status.style.color=error?"#b45542":"";
 }
 const settings=window.PSY_AUTH_CONFIG||{};
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(settings.url||"")||
   !/^sb_publishable_[A-Za-z0-9_-]+$/.test(settings.publishableKey||"")||
   !window.supabase?.createClient){
  note("Контактный номер станет доступен после подключения аккаунтов.");
  return;
 }
 const client=window.supabase.createClient(settings.url,settings.publishableKey,{
  auth:{flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
 });
 let user=null,existing=false,busy=false;
 try{
  const {data,error}=await client.auth.getUser();
  if(error||!data?.user||data.user.is_anonymous||!data.user.email_confirmed_at){
   note("Чтобы сохранить номер в личном кабинете, сначала подтвердите электронную почту и войдите в аккаунт.");
   return;
  }
  user=data.user;
  const read=await client.from("psy_user_profiles")
    .select("user_id,phone_e164").eq("user_id",user.id).maybeSingle();
  if(read.error)throw read.error;
  existing=!!read.data;
  input.value=read.data?.phone_e164||"";
  input.disabled=false;
  button.disabled=false;
  note("Номер необязателен. Другие пользователи и модераторы не могут его просматривать.");
 }catch(_){
  note("Не удалось безопасно открыть телефон профиля. Повторите попытку позже.",true);
  return;
 }
 form.addEventListener("submit",async event=>{
  event.preventDefault();
  if(!user||busy)return;
  let value=input.value.trim().replace(/[\s()\-]/g,"");
  if(value&&!/^\+[1-9]\d{6,14}$/.test(value)){
   note("Введите номер с кодом страны, например +79991234567, или оставьте поле пустым.",true);
   input.focus();
   return;
  }
  busy=true;button.disabled=true;note("Сохраняем номер в защищенном профиле...");
  try{
   const payload={phone_e164:value||null};
   let result;
   if(existing){
    result=await client.from("psy_user_profiles").update(payload)
      .eq("user_id",user.id).select("user_id").single();
   }else{
    result=await client.from("psy_user_profiles")
      .insert({user_id:user.id,...payload}).select("user_id").single();
   }
   if(result.error)throw result.error;
   existing=true;
   input.value=value;
   note(value?"Номер сохранен в вашем аккаунте.":"Контактный номер удален из профиля.");
  }catch(_){
   note("Не удалось сохранить номер. Проверьте вход и повторите попытку.",true);
  }finally{busy=false;button.disabled=false;}
 });
})();
