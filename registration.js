"use strict";
(function(){
 const config=window.PSY_AUTH_CONFIG||{};
 const form=document.getElementById("authEmailForm");
 const codeForm=document.getElementById("authCodeForm");
 const emailField=document.getElementById("authEmail");
 const codeField=document.getElementById("authCode");
 const status=document.getElementById("authStatus");
 const ready=Boolean(/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.url||"")&&/^sb_publishable_[A-Za-z0-9_-]+$/.test(config.publishableKey||"")&&window.supabase?.createClient);
 function message(text,error=false){status.textContent=text;status.classList.toggle("error",error)}
 const send=document.getElementById("authSend"),verify=document.getElementById("authVerify");
 const disabledNote=document.getElementById("authNotConfigured");
 let client=null;
 if(!ready){
  disabledNote.hidden=false;emailField.disabled=true;send.disabled=true;
  message("Отправка писем будет доступна после подключения базы аккаунтов.");
  return;
 }
 client=window.supabase.createClient(config.url,config.publishableKey,{
  auth:{flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
 });
 let email="",lastSendAt=0;
 const panel=document.getElementById("authSignedIn"),emailLabel=document.getElementById("authEmailLabel");
 function signedIn(user){
  form.hidden=true;codeForm.hidden=true;panel.hidden=false;
  emailLabel.textContent=user.email||"Почта подтверждена";
  message("Электронная почта подтверждена. Вход выполнен.");
 }
 async function sessionCheck(){
  try{
   const {data,error}=await client.auth.getUser();
   if(!error&&data?.user)signedIn(data.user);
  }catch(_){message("Пока не удалось проверить текущий сеанс.",true)}
 }
 client.auth.onAuthStateChange((event,session)=>{
  if(event==="SIGNED_IN"&&session?.user)signedIn(session.user);
  if(event==="SIGNED_OUT"){panel.hidden=true;form.hidden=false;codeForm.hidden=true;message("Вы вышли из аккаунта.")}
 });
 sessionCheck();
 form.addEventListener("submit",async e=>{
  e.preventDefault();
  const value=emailField.value.trim().toLowerCase();
  if(!emailField.checkValidity()||!value){message("Укажите корректную электронную почту.",true);return}
  if(Date.now()-lastSendAt<60000){message("Повторное письмо можно запросить через минуту.",true);return}
  send.disabled=true;message("Запрашиваем письмо для входа...");
  try{
   const {error}=await client.auth.signInWithOtp({
    email:value,
    options:{shouldCreateUser:true,emailRedirectTo:location.origin+location.pathname}
   });
   if(error)throw error;
   email=value;lastSendAt=Date.now();form.hidden=true;codeForm.hidden=false;
   message("Письмо запрошено. Откройте ссылку из письма или введите код, если он указан.");
  }catch(err){message("Не удалось отправить письмо: "+String(err.message||"Ошибка сервиса"),true)}
  finally{send.disabled=false}
 });
 codeForm.addEventListener("submit",async e=>{
  e.preventDefault();
  const token=codeField.value.trim();
  if(!/^\d{6,8}$/.test(token)){message("Введите числовой код из письма.",true);return}
  verify.disabled=true;message("Проверяем код...");
  try{
   const {data,error}=await client.auth.verifyOtp({email,token,type:"email"});
   if(error)throw error;
   if(data?.user)signedIn(data.user);
   else message("Проверьте письмо и попробуйте еще раз.");
  }catch(err){message("Код не подошел или срок его действия истек.",true)}
  finally{verify.disabled=false}
 });
 document.getElementById("authAgain").addEventListener("click",()=>{
  codeForm.hidden=true;form.hidden=false;codeField.value="";message("");
 });
 document.getElementById("authSignOut").addEventListener("click",async()=>{
  const {error}=await client.auth.signOut();
  if(error)message("Не удалось выйти из аккаунта. Повторите попытку.",true);
 });
})();
