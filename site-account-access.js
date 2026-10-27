"use strict";
/* Verified account role on profile. UI only; all moderator changes are still
   authorized on the server in manage-user-roles Edge Function. */
(async function(){
 const root=document.getElementById("psyAccountAccess");
 if(!root)return;
 const hint=document.getElementById("psyAccountHint");
 const email=document.getElementById("psyAccountEmail");
 const roleBadge=document.getElementById("psyRoleBadge");
 const manage=document.getElementById("psyOwnerManage");
 const security=document.getElementById("psyOwnerSecurity");
 const ownerNote=document.getElementById("psyAccountOwnerHint");
 const login=document.getElementById("psyAccountLogin");
 const signOut=document.getElementById("psyAccountSignOut");
 const config=window.PSY_AUTH_CONFIG||{};
 login.href=config.registrationEnabled===true?"index.html?home=1&entry=1":"register.html?test=1";
 login.textContent=config.registrationEnabled===true?"Войти или зарегистрироваться":"Проверить вход по почте";
 function message(t){hint.textContent=t;}
 function hidePrivate(){
  manage.hidden=true;security.hidden=true;ownerNote.hidden=true;email.hidden=true;roleBadge.hidden=true;signOut.hidden=true;login.hidden=false;
 }
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.url||"")||
    !/^sb_publishable_[A-Za-z0-9_-]+$/.test(config.publishableKey||"")||
    !window.supabase?.createClient){
  hidePrivate();message("Аккаунт временно недоступен.");return;
 }
 const client=window.supabase.createClient(config.url,config.publishableKey,{
  auth:{flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
 });
 try{
  const {data,error}=await client.auth.getUser();
  const user=data?.user;
  if(error||!user||user.is_anonymous||!user.email_confirmed_at){
   hidePrivate();message("Чтобы управлять аккаунтом и модераторами, войдите с подтвержденной почтой.");return;
  }
  const {data:roleData,error:roleError}=await client.from("psy_account_roles")
    .select("role").eq("user_id",user.id).maybeSingle();
  if(roleError)throw roleError;
  const role=["owner","shadow","moderator"].includes(roleData?.role)?roleData.role:"participant";
  email.textContent=user.email||"Почта подтверждена";email.hidden=false;
  roleBadge.textContent=role==="owner"?"👑 Владелец":role==="shadow"?"Тень":role==="moderator"?"Модератор":"Участник";
  roleBadge.className="psy-role-badge "+role;roleBadge.hidden=false;
  login.hidden=true;signOut.hidden=false;
  if(role==="owner"||role==="shadow"){
   manage.hidden=false;security.hidden=false;ownerNote.hidden=false;
   message("Вы вошли как Владелец. Здесь можно открыть управление пользователями и назначать модераторов.");
  }else if(role==="moderator"){
   message("Вы вошли как Модератор. Назначение других модераторов доступно только Владельцу.");
  }else{
   message("Вы вошли как Участник. Личные папки и избранное будут подключены отдельно.");
  }
  signOut.addEventListener("click",async()=>{
   signOut.disabled=true;
   try{
    const {error:logoutError}=await client.auth.signOut();
    if(logoutError)throw logoutError;
    hidePrivate();message("Вы вышли из аккаунта.");
    try{sessionStorage.removeItem("psy-intended-destination");sessionStorage.removeItem("psy-demo-entry");}catch(_){}
    location.replace("index.html?home=1&entry=1");
    // Сбрасываем номер телефона в интерфейсе без изменения данных в Supabase.
    const phone=document.getElementById("profilePhone"),save=document.getElementById("savePhoneBtn");
    if(phone){phone.value="";phone.disabled=true;}
    if(save)save.disabled=true;
    const phoneStatus=document.getElementById("phoneStatus");
    if(phoneStatus)phoneStatus.textContent="Чтобы открыть номер, войдите в аккаунт.";
   }catch(_){message("Не удалось выйти из аккаунта. Попробуйте еще раз.");}
   finally{signOut.disabled=false;}
  });
 }catch(_){
  hidePrivate();message("Не удалось проверить роль аккаунта. Повторите попытку позже.");
 }
})();
