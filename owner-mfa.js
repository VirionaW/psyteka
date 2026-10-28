"use strict";
/* Owner-only TOTP setup and step-up. Never log or persist TOTP secrets/codes.
   The authorization for assigning moderators is enforced separately by Edge Function. */
(async function(){
 const node=id=>document.getElementById(id);
 const status=node("psyMfaStatus");
 const start=node("psyMfaStart"),scan=node("psyMfaScan"),challenge=node("psyMfaChallenge"),
   ready=node("psyMfaReady"),guest=node("psyMfaGuest");
 const config=window.PSY_AUTH_CONFIG||{};
 // Restore an intended on-site library page after security verification.
 try{
  const wanted=sessionStorage.getItem("psy-intended-destination");
  const url=new URL(wanted||"library.html",location.href);
  if(url.origin===location.origin&&
    /\/(?:library|cognitive-kit|family-kit|selfesteem-kit|adaptation-drawing)\.html$/.test(url.pathname)){
   node("psyMfaLibrary").href=url.pathname+url.search+url.hash;
  }
 }catch(_){}
 function note(text,error=false){status.textContent=text;status.classList.toggle("psy-error",error)}
 function display(which){for(const n of [start,scan,challenge,ready,guest])n.hidden=n!==which;}
 function cleanSecret(){
  node("psyMfaQr").removeAttribute("src");
  node("psyMfaSecret").textContent="";
  node("psyMfaEnrollCode").value="";
 }
 function validCode(input){
  return /^[0-9]{6}$/.test(input.trim())?input.trim():null;
 }
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.url||"")||
  !/^sb_publishable_[A-Za-z0-9_-]+$/.test(config.publishableKey||"")||
  !window.supabase?.createClient){display(guest);note("Сервис защиты временно недоступен.",true);return;}
 const client=window.supabase.createClient(config.url,config.publishableKey,{
  auth:{flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
 });
 let pending=null,primaryFactor=null,verifiedCount=0,busy=false;
 function pendingState(value){
  pending=value;
  node("psyMfaStartBtn").disabled=Boolean(value)||busy;
 }
 async function requireOwner(){
  const {data,error}=await client.auth.getUser();
  if(error||!data?.user||data.user.is_anonymous)return false;
  const {data:role,error:roleError}=await client.from("psy_account_roles")
    .select("role").eq("user_id",data.user.id).maybeSingle();
  if(roleError)throw roleError;
  return role?.role==="owner"||role?.role==="shadow";
 }
 async function refresh(){
  const {data:factors,error:fError}=await client.auth.mfa.listFactors();
  if(fError)throw fError;
  const verified=(factors?.totp||[]).filter(f=>f.status==="verified"||!f.status);
  verifiedCount=verified.length;
  primaryFactor=verified[0]||null;
  const {data:aal,error:aError}=await client.auth.mfa.getAuthenticatorAssuranceLevel();
  if(aError)throw aError;
  if(primaryFactor&&aal?.currentLevel==="aal2"){
   display(ready);
   node("psyMfaFactorCount").textContent=verifiedCount===1?
    "Подключен один аутентификатор. Добавьте резервный на другом устройстве.":
    "Подключено аутентификаторов: "+verifiedCount+".";
   note("Дополнительный код подтвержден. Административные действия доступны.");
  }else if(primaryFactor){
   display(challenge);
   note("Защита уже включена. Для текущего входа нужен код из приложения.");
  }else{
   display(start);
   note("Защита еще не подключена. Подключите приложение-аутентификатор.");
  }
 }
 try{
  const isOwner=await requireOwner();
  if(!isOwner){display(guest);note("Настроить «Вендиго» может Владелец или Тень после входа в подтвержденный аккаунт.",true);return;}
  await refresh();
 }catch(_){display(guest);note("Не удалось проверить аккаунт. Попробуйте обновить страницу.",true);return;}

 async function enroll(friendlyName){
  if(busy||pending)return;
  busy=true;
  const button=node("psyMfaStartBtn");button.disabled=true;
  note("Создаем защищенный QR-код...");
  try{
   const {data,error}=await client.auth.mfa.enroll({factorType:"totp",friendlyName});
   if(error||!data?.id||!data?.totp?.qr_code)throw error||new Error("Нет QR-кода");
   // Supabase returns an SVG data URL or raw SVG. Render without any network request.
   const qr=data.totp.qr_code;
   if(/^data:image\/svg\+xml[;,]/i.test(qr)){node("psyMfaQr").src=qr;}
   else if(qr.trim().startsWith("<svg")){node("psyMfaQr").src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(qr);}
   else throw new Error("Неподдерживаемый формат QR-кода");
   node("psyMfaSecret").textContent=data.totp.secret||"";
   pendingState(data.id);
   display(scan);
   note("Отсканируйте QR-код и подтвердите первые шесть цифр из приложения.");
  }catch(_){note("Не удалось подключить аутентификатор. Проверьте настройки MFA Supabase.",true);}
  finally{busy=false;button.disabled=false;}
 }
 node("psyMfaStartBtn").addEventListener("click",()=>enroll("Метолария – Вендиго"));
 node("psyMfaBackup").addEventListener("click",()=>enroll("Метолария – резервный фактор"));
 node("psyMfaEnrollForm").addEventListener("submit",async event=>{
  event.preventDefault();if(!pending||busy)return;
  const code=validCode(node("psyMfaEnrollCode").value);
  if(!code){note("Введите шесть цифр из приложения.",true);return;}
  busy=true;node("psyMfaEnrollForm").querySelector("button").disabled=true;
  try{
   const {error}=await client.auth.mfa.challengeAndVerify({factorId:pending,code});
   if(error)throw error;
   pendingState(null);cleanSecret();
   await refresh();
  }catch(_){note("Код не подтвержден. Проверьте время на телефоне и попробуйте снова.",true);}
  finally{busy=false;node("psyMfaEnrollForm").querySelector("button").disabled=false;}
 });
 node("psyMfaCancel").addEventListener("click",async()=>{
  if(busy||!pending)return;
  busy=true;node("psyMfaCancel").disabled=true;
  try{
   const {error}=await client.auth.mfa.unenroll({factorId:pending});
   if(error)throw error;
   pendingState(null);cleanSecret();await refresh();
  }catch(_){note("Не удалось отменить настройку. Обновите страницу.",true);}
  finally{busy=false;node("psyMfaCancel").disabled=false;}
 });
 node("psyMfaChallengeForm").addEventListener("submit",async event=>{
  event.preventDefault();if(!primaryFactor||busy)return;
  const code=validCode(node("psyMfaChallengeCode").value);
  if(!code){note("Введите шестизначный код из приложения.",true);return}
  busy=true;node("psyMfaChallengeForm").querySelector("button").disabled=true;
  try{
   const {error}=await client.auth.mfa.challengeAndVerify({factorId:primaryFactor.id,code});
   if(error)throw error;
   node("psyMfaChallengeCode").value="";
   await refresh();
  }catch(_){note("Не удалось подтвердить код. Повторите попытку.",true);}
  finally{busy=false;node("psyMfaChallengeForm").querySelector("button").disabled=false;}
 });
})();
