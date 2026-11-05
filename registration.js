"use strict";
(function(){
 const config=window.PSY_AUTH_CONFIG||{};
 const form=document.getElementById("authEmailForm");
 const codeForm=document.getElementById("authCodeForm");
 const emailField=document.getElementById("authEmail");
 const codeField=document.getElementById("authCode");
 const status=document.getElementById("authStatus");
 // A limited SMTP smoke test is permitted for previously registered accounts only.
 // This is not a public signup bypass: shouldCreateUser=false in test mode.
 const emailTestMode=config.registrationEnabled!==true&&
  location.pathname.endsWith("/register.html")&&
  new URLSearchParams(location.search).get("test")==="1";
 const ready=Boolean(/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.url||"")&&
  /^sb_publishable_[A-Za-z0-9_-]+$/.test(config.publishableKey||"")&&
  (config.registrationEnabled===true||emailTestMode)&&window.supabase?.createClient);
 function message(text,error=false){status.textContent=text;status.classList.toggle("error",error)}
 const authError=(ex,stage)=>window.PSY_AUTH_PROTECTION?.describeError?.(ex,stage)||{id:"AUTH-UNKNOWN",text:"Не удалось выполнить запрос (Код: AUTH-UNKNOWN)",maybeSent:false};
 const withTimeout=(request,ms)=>new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>{const e=new Error("Время ожидания истекло");e.name="PsyAuthTimeoutError";reject(e)},ms);
  Promise.resolve(request).then(v=>{clearTimeout(timeout);resolve(v)},e=>{clearTimeout(timeout);reject(e)});
 });
 const send=document.getElementById("authSend"),verify=document.getElementById("authVerify");
 const disabledNote=document.getElementById("authNotConfigured");
 let client=null;
 if(!ready){
  disabledNote.hidden=false;emailField.disabled=true;send.disabled=true;
  message("Отправка писем будет доступна после настройки почтового сервиса и подтверждения ссылок для входа.");
  return;
 }
 if(emailTestMode){
  disabledNote.hidden=false;
  disabledNote.textContent="Проверка почты для уже созданного аккаунта. Новые пользователи здесь пока не регистрируются.";
  const title=document.getElementById("authTitle");if(title)title.textContent="Проверить письмо для входа";
  const disclaimer=document.querySelector(".auth-disclaimer");
  if(disclaimer)disclaimer.textContent="Тестовая отправка письма не активирует подписку и не запускает пробный период.";
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
  const manager=document.getElementById("authManageLink");
  if(manager){
   manager.hidden=true;
   client.from("psy_account_roles").select("role")
    .eq("user_id",user.id).maybeSingle()
    .then(({data,error})=>{if(!error&&data?.role==="owner")manager.hidden=false;})
    .catch(()=>{manager.hidden=true;});
  }
 }
 async function sessionCheck(){
  try{
   const {data,error}=await withTimeout(client.auth.getUser(),10000);
   if(!error&&data?.user)signedIn(data.user);
  }catch(err){message(authError(err,"access").text,true)}
 }
 client.auth.onAuthStateChange((event,session)=>{
  if(event==="SIGNED_IN"&&session?.user)signedIn(session.user);
  if(event==="SIGNED_OUT"){panel.hidden=true;form.hidden=false;codeForm.hidden=true;const manager=document.getElementById("authManageLink");if(manager)manager.hidden=true;message("Вы вышли из аккаунта.")}
 });
 sessionCheck();
 form.addEventListener("submit",async e=>{
  e.preventDefault();
  const value=emailField.value.trim().toLowerCase();
  if(!emailField.checkValidity()||!value){message("Укажите корректную электронную почту.",true);return}
  if(Date.now()-lastSendAt<60000){message("Повторное письмо можно запросить через минуту.",true);return}
  send.disabled=true;message("Запрашиваем письмо для входа...");
  try{
   const {error}=await withTimeout(client.auth.signInWithOtp({
    email:value,
    options:{shouldCreateUser:!emailTestMode,emailRedirectTo:location.origin+location.pathname}
   }),20000);
   if(error)throw error;
   email=value;lastSendAt=Date.now();form.hidden=true;codeForm.hidden=false;
   message("Письмо запрошено. Откройте ссылку из письма или введите код, если он указан.");
  }catch(err){
   const issue=authError(err,"send");
   if(issue.maybeSent){
    email=value;lastSendAt=Date.now();
    form.hidden=true;codeForm.hidden=false;
    message(issue.text+" Если письмо придет, введите код. Иначе повторите запрос позднее.",true);
   }else{
    message(issue.text,true);
    if(issue.id==="AUTH-LIMIT")lastSendAt=Date.now();
   }
  }
  finally{send.disabled=false}
 });
 codeForm.addEventListener("submit",async e=>{
  e.preventDefault();
  const token=codeField.value.trim();
  if(!/^\d{6,8}$/.test(token)){message("Введите числовой код из письма.",true);return}
  verify.disabled=true;message("Проверяем код...");
  try{
   const {data,error}=await withTimeout(client.auth.verifyOtp({email,token,type:"email"}),20000);
   if(error)throw error;
   if(data?.user)signedIn(data.user);
   else message("Проверьте письмо и попробуйте еще раз.");
  }catch(err){message(authError(err,"verify").text,true)}
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
