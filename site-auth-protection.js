"use strict";
(function(){
 const DAYS=30,MAX_AGE=DAYS*24*60*60*1000;
 async function keepSession(client,user){
  if(!user||user.is_anonymous)return false;
  const signIn=Date.parse(user.last_sign_in_at||"");
  // A server-provided sign-in date avoids resetting the clock on each refresh.
  const key="psy-login-age-v1:"+user.id;
  let local=NaN;
  try{local=Number(localStorage.getItem(key))}catch(_){}
  if(Number.isFinite(signIn)&&signIn>Date.now()+300000)return false;
  if(Number.isFinite(signIn)&&signIn>0){
   if(!Number.isFinite(local)||local<=0||signIn>local+60000)
    try{localStorage.setItem(key,String(signIn))}catch(_){}
  }else if(!Number.isFinite(local)||local<=0){
   local=Date.now();
   try{localStorage.setItem(key,String(local))}catch(_){}
  }
  const started=Number.isFinite(signIn)&&signIn>0?signIn:local;
  if(Date.now()-started>MAX_AGE){
   try{await client.auth.signOut({scope:"local"})}catch(_){}
   return false;
  }
  return true;
 }
 async function secondFactorNeeded(client){
  const {data,error}=await client.auth.mfa.getAuthenticatorAssuranceLevel();
  if(error)throw error;
  return data?.nextLevel==="aal2"&&data.currentLevel!=="aal2";
 }
 function challengeUrl(next){
  let url;
  try{url=new URL(next||location.pathname+location.search,location.href)}
  catch(_){url=new URL("profile.html",location.href)}
  if(url.origin!==location.origin)url=new URL("profile.html",location.href);
  return "account-security.html?challenge=1&next="+encodeURIComponent(url.pathname+url.search+url.hash);
 }

 // Diagnostics are classified locally; never echo raw errors or private details.
 function describeError(ex,stage="send"){
  const name=String(ex?.name||"").toLowerCase();
  const code=String(ex?.code||"").toLowerCase();
  const msg=String(ex?.message||"").toLowerCase().slice(0,400);
  const status=Number(ex?.status)||0;
  const phase=String(ex?.authStage||stage);
  const result=(id,message,maybeSent=false)=>({
   id,maybeSent,
   text:message+" (Код: "+id+(status>=400&&status<=599?", HTTP "+status:"")+")"
  });
  if(typeof navigator!=="undefined"&&navigator.onLine===false)
   return result("AUTH-OFFLINE","Нет подключения к интернету. Проверьте мобильную сеть или Wi-Fi.");
  if(name==="psyauthtimeouterror"||code==="client_timeout"){
   const timeoutMessages={
    session:["AUTH-SESSION-TIMEOUT","Не удалось вовремя получить текущую сессию из сервера авторизации."],
    identity:["AUTH-USER-TIMEOUT","Сервер не успел подтвердить учетную запись."],
    permissions:["AUTH-PERMISSIONS-TIMEOUT","Не удалось вовремя загрузить роль и права доступа из базы."],
    mfa:["AUTH-MFA-TIMEOUT","Не удалось вовремя проверить второй фактор защиты."],
    verify:["AUTH-VERIFY-TIMEOUT","Сервер не ответил вовремя при проверке введенного кода. Не запрашивайте новый код сразу."],
    access:["AUTH-CHECK-TIMEOUT","Не удалось вовремя завершить проверку аккаунта и прав доступа."]
   };
   if(phase==="send")return result("AUTH-TIMEOUT","Сервер не ответил вовремя на запрос кода. Запрос мог пройти, поэтому сначала проверьте почту.",true);
   const [id,message]=timeoutMessages[phase]||timeoutMessages.access;
   return result(id,message+" Сессия и сохраненные обследования не удалены.");
  }
  if(status===429||/rate.?limit|too.?many|over_email_send_rate_limit|over_request_rate_limit|security purposes.*seconds/.test(code+" "+msg))
   return result("AUTH-LIMIT","Слишком много запросов. Подождите и попробуйте снова, не запрашивая коды подряд.");
  if(phase==="send"&&(/email_address_invalid|invalid_email|validation_failed/.test(code)||status===422))
   return result("AUTH-EMAIL","Адрес почты не принят. Проверьте написание адреса.");
  if(phase==="send"&&/email_send_failed|smtp|email_provider_disabled|mailer_error/.test(code+" "+msg))
   return result("AUTH-MAIL","Сервис не смог отправить письмо. Возможен сбой почтовой службы.");
  if(phase==="verify"&&(/otp_expired|otp_disabled|invalid_otp|token_expired|otp/.test(code)||status===400))
   return result("AUTH-CODE","Код неверный, уже использован или срок его действия истек. Запросите новый код.");
  if(status===401||status===403||/invalid_credentials|session_not_found|jwt_expired/.test(code))
   return result("AUTH-ACCESS","Не удалось подтвердить доступ. Попробуйте повторить вход.");
  if(status>=500&&status<=599)
   return result("AUTH-SERVER","Сервис авторизации или базы ответил с серверной ошибкой. Попробуйте позднее.");
  if(/authretryablefetcherror|typeerror|aborterror/.test(name)||
     /failed to fetch|networkerror|network request failed|load failed|fetch failed|network.*error|connection.*failed|fetch_error/.test(code+" "+msg)){
   const networkMessages={
    session:["AUTH-SESSION-NET","Не удалось получить текущую сессию. Проверьте соединение с сервером авторизации."],
    identity:["AUTH-USER-NET","Не удалось подтвердить учетную запись через сервер авторизации."],
    permissions:["AUTH-PERMISSIONS-NET","Не удалось загрузить роль и права доступа из базы данных."],
    mfa:["AUTH-MFA-NET","Не удалось связаться с сервисом проверки второго фактора."],
    verify:["AUTH-VERIFY-NET","Не удалось получить ответ при проверке кода. Сначала повторите проверку входа, не запрашивая новый код."],
    access:["AUTH-CHECK-NET","Не удалось завершить проверку аккаунта и прав доступа."]
   };
   if(phase==="send")return result("AUTH-NET","Не удалось отправить запрос к серверу входа. Возможна проблема мобильной сети, DNS или маршрута к серверу.",true);
   const [id,message]=networkMessages[phase]||networkMessages.access;
   return result(id,message+" Проверьте мобильную сеть, DNS и доступность сервера.");
  }
  if(phase==="verify")return result("AUTH-VERIFY","Не удалось проверить код. Повторите попытку.");
  if(phase==="access")return result("AUTH-CHECK","Не удалось проверить аккаунт. Сохраненная сессия не удалена.");
  if(status>=400&&status<500)
   return result("AUTH-REQUEST","Сервис отклонил запрос. Проверьте данные и попробуйте снова.");
  return result("AUTH-UNKNOWN","Причину ошибки определить не удалось. Повторите попытку.");
 }

 window.PSY_AUTH_PROTECTION={keepSession,secondFactorNeeded,challengeUrl,describeError,DAYS};
})();