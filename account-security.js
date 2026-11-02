"use strict";
(async function(){
 const $=id=>document.getElementById(id),msg=$("accountMfaMessage");
 const ids=["accountMfaGuest","accountMfaStart","accountMfaEnroll","accountMfaChallenge","accountMfaReady"];
 const show=id=>{ids.forEach(k=>$(k).hidden=k!==id)};
 const note=s=>{msg.textContent=s};
 const cfg=window.PSY_AUTH_CONFIG||{};
 if(!window.supabase?.createClient||!cfg.url||!cfg.publishableKey){show("accountMfaGuest");note("Сервис авторизации недоступен");return}
 const client=window.PSY_AUTH_CLIENT||(window.PSY_AUTH_CLIENT=window.supabase.createClient(cfg.url,cfg.publishableKey,{
  auth:{flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
 }));
 let pending=null,primary=null,busy=false;
 const valid=v=>/^\d{6}$/.test(String(v||"").trim());
 function safeNext(){
  try{
   const q=new URLSearchParams(location.search),v=q.get("next")||"profile.html";
   const url=new URL(v,location.href);
   return url.origin===location.origin&&!url.pathname.endsWith("account-security.html")
      ?url.pathname+url.search+url.hash:"profile.html";
  }catch(_){return "profile.html"}
 }
 $("accountMfaContinue").href=safeNext();
 async function refresh(){
  const {data:person,error:userError}=await client.auth.getUser();
  if(userError||!person?.user||person.user.is_anonymous||
    (window.PSY_AUTH_PROTECTION&&!(await window.PSY_AUTH_PROTECTION.keepSession(client,person.user)))){
   show("accountMfaGuest");note("Войдите по электронной почте");return;
  }
  const [list,aal]=await Promise.all([client.auth.mfa.listFactors(),client.auth.mfa.getAuthenticatorAssuranceLevel()]);
  if(list.error||aal.error)throw list.error||aal.error;
  const factors=(list.data?.totp||[]).filter(f=>f.status==="verified");
  primary=factors[0]||null;
  if(primary&&aal.data?.currentLevel!=="aal2"){show("accountMfaChallenge");note("Подтвердите второй фактор");return}
  if(primary){show("accountMfaReady");note("Ваш аккаунт защищен. Подключено аутентификаторов: "+factors.length);return}
  show("accountMfaStart");note("QR-защита еще не подключена");
 }
 async function enroll(){
  if(busy)return;busy=true;note("Создаем QR-код...");
  try{
   const {data,error}=await client.auth.mfa.enroll({factorType:"totp",friendlyName:"Метолария – аутентификатор"});
   if(error||!data?.id||!data.totp?.qr_code)throw error||Error("QR-код недоступен");
   pending=data.id;const qr=data.totp.qr_code;
   if(/^data:image\/svg\+xml[;,]/i.test(qr))$("accountMfaQr").src=qr;
   else if(qr.trim().startsWith("<svg"))$("accountMfaQr").src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(qr);
   else throw Error("Неподдерживаемый QR-код");
   $("accountMfaSecret").textContent=data.totp.secret||"";
   $("accountMfaEnrollCode").value="";show("accountMfaEnroll");
   note("Сканируйте QR-код и введите шесть цифр");
  }catch(e){note("Не удалось подключить защиту: "+(e.message||"Ошибка"));await refresh().catch(()=>{})}
  finally{busy=false}
 }
 async function verify(factor,code){
  if(busy||!factor||!valid(code))return;
  busy=true;note("Проверяем код...");
  try{
   const {error}=await client.auth.mfa.challengeAndVerify({factorId:factor,code:String(code).trim()});
   if(error)throw error;
   pending=null;$("accountMfaSecret").textContent="";$("accountMfaQr").removeAttribute("src");
   await refresh();
  }catch(e){note("Неверный или устаревший код. Попробуйте еще раз.")}
  finally{busy=false}
 }
 $("accountMfaStartBtn").addEventListener("click",enroll);
 $("accountMfaBackup").addEventListener("click",enroll);
 $("accountMfaEnrollForm").addEventListener("submit",e=>{
  e.preventDefault();void verify(pending,$("accountMfaEnrollCode").value)
 });
 $("accountMfaChallengeForm").addEventListener("submit",e=>{
  e.preventDefault();void verify(primary?.id,$("accountMfaChallengeCode").value)
 });
 $("accountMfaCancel").addEventListener("click",async()=>{
  if(!pending||busy)return;
  busy=true;
  try{await client.auth.mfa.unenroll({factorId:pending})}
  finally{busy=false;pending=null;$("accountMfaSecret").textContent="";$("accountMfaQr").removeAttribute("src");await refresh().catch(()=>{})}
 });
 try{await refresh()}catch(_){show("accountMfaGuest");note("Проверка защиты временно недоступна. Повторите попытку позже.")}
})();