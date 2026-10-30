"use strict";
/* Public landing -> email OTP signup/signin -> 48h trial -> library.
 * Registration is live. No automatic charges or test-mode bypass.
 * Static files are not protected DRM; private storage required for paid access.
 */
(function(){
 const root=document.getElementById("siteHome");if(!root)return;
 const conf=window.PSY_AUTH_CONFIG||{};
 const authEnabled=conf.registrationEnabled===true;
 const valid=!!(/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(conf.url||"")&&
  /^sb_publishable_[A-Za-z0-9_-]+$/.test(conf.publishableKey||"")&&window.supabase?.createClient);
 // Reuse the identity client's auth session and browser lock rather than
 // creating another competing Supabase client on the same landing page.
 const client=valid?(window.PSY_IDENTITY?.client||window.PSY_AUTH_CLIENT||(window.PSY_AUTH_CLIENT=window.supabase.createClient(conf.url,conf.publishableKey,{
  auth:{flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
 }))):null;
 let destination="library.html",currentUser=null,role="participant",trial=null,paid=null,requestAt=0,timer=null,lastFocus=null,opening=false,ownerNeedsMfa=false,sendingEmail=false;
 const html=`<dialog id="psyEntryDialog" aria-labelledby="psyEntryTitle" aria-modal="true">
 <div class="psy-entry-inner">
  <div class="psy-entry-top"><div><p class="psy-entry-eyebrow"><span class="psy-brand-name-first">Мето</span><span class="psy-brand-name-last">лария</span> · личный доступ</p><h2 id="psyEntryTitle">Войти в Метоларию</h2></div>
   <button type="button" class="psy-entry-x" id="psyEntryClose" aria-label="Закрыть окно">×</button></div>
  <p class="psy-entry-lead" id="psyEntryLead">Войдите или зарегистрируйтесь по электронной почте. Пришлем одноразовый код, пароль не нужен.</p>
  <div class="psy-entry-step" id="psyEntryEmail">
   <form class="psy-entry-form" id="psyEntryEmailForm" novalidate>
    <label for="psyEntryMail">Электронная почта</label><input id="psyEntryMail" type="email" autocomplete="email" placeholder="name@example.com" maxlength="254" required>
    <button type="submit" class="psy-entry-btn" id="psyEntrySend">Получить код на почту</button>
   </form>
   <p class="psy-entry-notice" id="psyEntrySetup" hidden>Не удалось подключить сервис входа. Обновите страницу или попробуйте позже.</p>
   <p class="psy-entry-foot">Вход доступен новым и зарегистрированным участникам. Не вводите данные детей.</p>
  </div>
  <div class="psy-entry-step" id="psyEntryCode" hidden>
   <p class="psy-entry-lead" id="psyEntryCodeMessage" role="status" aria-live="polite">Отправляем код...</p>
   <p class="psy-entry-email" id="psyEntryCodeAddress"></p>
   <form class="psy-entry-form" id="psyEntryCodeForm">
    <label for="psyEntryToken">Код из письма</label><input id="psyEntryToken" type="text" autocomplete="one-time-code" inputmode="numeric" pattern="[0-9]*" maxlength="8">
    <button type="submit" class="psy-entry-btn" id="psyEntryVerify">Подтвердить код</button>
   </form>
   <div class="psy-entry-code-actions">
    <button type="button" class="psy-entry-btn light" id="psyEntryResend">Отправить код повторно</button>
    <button type="button" class="psy-entry-btn light" id="psyEntryAgain">Изменить почту</button>
   </div>
  </div>
  <div class="psy-entry-step" id="psyEntryPlans" hidden>
   <p class="psy-entry-lead" id="psyEntryWelcome">Почта подтверждена. Выберите, как начать работу с методиками.</p>
   <article class="psy-entry-choice">
    <strong>Пробный доступ · 2 дня</strong>
    <p>48 часов знакомства с библиотекой после активации. Банковская карта не нужна, никаких автоматических списаний.</p>
    <div class="psy-entry-cost">0 ₽</div>
    <button type="button" class="psy-entry-btn" id="psyEntryStart">Начать бесплатные 2 дня</button>
   </article>
   <div class="psy-entry-secondary-choice">Три платных тарифа пока готовятся. <a href="subscriptions.html">Посмотреть варианты подписки</a>. Оплата еще не подключена.</div>
  </div>
  <div class="psy-entry-step" id="psyEntryAccess" hidden>
   <p class="psy-entry-lead" id="psyEntryAccessText">Ваш доступ активен.</p>
   <div class="psy-entry-choice">
    <strong id="psyEntryAccessName">Бесплатный пробный доступ</strong>
    <p id="psyEntryTimeCaption">Осталось до окончания пробного периода:</p>
    <div class="psy-entry-clock" id="psyEntryClock" aria-live="off">48:00:00</div>
   </div>
   <div class="psy-entry-actions"><button class="psy-entry-btn" id="psyEntryGo" type="button">Открыть библиотеку</button><button class="psy-entry-btn secondary" id="psyEntrySignOut" type="button">Выйти из аккаунта</button></div>
  </div>
  <div class="psy-entry-step" id="psyEntryExpired" hidden>
   <p class="psy-entry-lead">Ваш пробный доступ на 2 дня завершился.</p>
   <div class="psy-entry-choice"><strong>Посмотрите будущие тарифы</strong><p>Есть три планируемых платных варианта. Покупка еще не подключена, списаний не будет.</p><p><a href="subscriptions.html">Описание подписок и условий</a></p></div>
   <div class="psy-entry-actions"><button class="psy-entry-btn secondary" type="button" id="psyEntryExpiredClose">Вернуться на главную</button></div>
  </div>
  <p class="psy-entry-error" id="psyEntryError" role="status" aria-live="polite" hidden></p>
 </div></dialog>`;
 document.body.insertAdjacentHTML("beforeend",html);
 const el=id=>document.getElementById(id);
 const dialog=el("psyEntryDialog");
 const checkStatus=document.createElement("div");
 checkStatus.id="psyEntryNavStatus";
 checkStatus.className="psy-entry-nav-status";
 checkStatus.setAttribute("role","status");
 checkStatus.setAttribute("aria-live","polite");
 checkStatus.textContent="Проверяю доступ к библиотеке...";
 checkStatus.hidden=true;
 document.body.append(checkStatus);
 const withTimeout=(promise,ms=10000)=>new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(new Error("Проверка доступа занимает слишком много времени. Повторите попытку.")),ms);
  Promise.resolve(promise).then(value=>{clearTimeout(timeout);resolve(value)},err=>{clearTimeout(timeout);reject(err)});
 });
 const steps=["psyEntryEmail","psyEntryCode","psyEntryPlans","psyEntryAccess","psyEntryExpired"];
 function step(id){for(const s of steps)el(s).hidden=s!==id;el("psyEntryError").hidden=true}
 function error(text){const e=el("psyEntryError");e.textContent=text;e.hidden=!text}
 function hourText(milliseconds){
  const seconds=Math.max(0,Math.floor(milliseconds/1000)),days=Math.floor(seconds/86400),
   hrs=Math.floor(seconds%86400/3600),mins=Math.floor(seconds%3600/60),secs=seconds%60;
  return (days?days+" д. ":"")+String(hrs).padStart(2,"0")+":"+String(mins).padStart(2,"0")+":"+String(secs).padStart(2,"0");
 }
 function ticker(){
  if(!trial||["owner","shadow","moderator"].includes(role))return;
  const left=new Date(trial.expires_at).getTime()-Date.now();
  const value=hourText(left);
  el("psyEntryClock").textContent=value;
  const pill=el("psyHomeTrial");
  if(pill){pill.hidden=false;pill.textContent=left>0?"Пробный доступ: "+value:"Пробный доступ завершен";}
  if(left<=0){clearInterval(timer);timer=null;el("psyEntryGo").disabled=true;step("psyEntryExpired")}
 }
 function clock(){if(timer)clearInterval(timer);ticker();timer=setInterval(ticker,1000)}
 function validTarget(href){
  try{const u=new URL(href,location.href);return u.origin===location.origin&&
   /\/(?:library|cognitive-kit|family-kit|selfesteem-kit|adaptation-drawing)\.html$/.test(u.pathname)
   ?u.pathname.slice(u.pathname.lastIndexOf("/")+1)+u.search+u.hash:null;}catch(_){return null}
 }
 function hasActiveAccess(){
  if(!currentUser)return false;
  if(["owner","shadow","moderator"].includes(role))return true;
  if(paid?.expires_at&&new Date(paid.expires_at).getTime()>Date.now())return true;
  return !!(trial?.expires_at&&new Date(trial.expires_at).getTime()>Date.now());
 }
 function setDestination(href){destination=validTarget(href)||"library.html";
  try{sessionStorage.setItem("psy-intended-destination",destination)}catch(_){}}
 function show(){
  const pill=el("psyHomeTrial");
  if(pill&&trial&&!["owner","shadow","moderator"].includes(role)&&new Date(trial.expires_at)>new Date())pill.hidden=false;
  if(!dialog.open){lastFocus=document.activeElement;dialog.showModal()}
 }
 function close(){if(dialog.open)dialog.close()}
 dialog.addEventListener("close",()=>{if(lastFocus?.focus)lastFocus.focus()});
 el("psyEntryClose").addEventListener("click",close);
 el("psyEntryExpiredClose").addEventListener("click",close);
 dialog.addEventListener("click",e=>{if(e.target===dialog)close()});
 function noSignup(){
  step("psyEntryEmail");el("psyEntryMail").disabled=true;
  el("psyEntrySend").disabled=true;el("psyEntrySetup").hidden=false;
 }
 async function load({direct=false}={}){
  if(opening)return;opening=true;
  checkStatus.hidden=!direct;
  // Keep the existing entitlement check, but give clear click feedback and
  // recover if the network or session API never answers.
  if(!authEnabled||!client){noSignup();show();checkStatus.hidden=true;opening=false;return}
  // On a new hostname, open the email form without waiting for a remote
  // session check when the browser has no stored Supabase session.
  let hasCachedSession=true;
  try{
   const ref=new URL(conf.url).hostname.split(".")[0];
   hasCachedSession=!!localStorage.getItem("sb-"+ref+"-auth-token");
  }catch(_){}
  if(!hasCachedSession){
   currentUser=null;role="participant";trial=null;paid=null;
   const pendingEmail=el("psyEntryCode").dataset.email;
   if(pendingEmail&&requestAt&&Date.now()-requestAt<600000)step("psyEntryCode");
   else step("psyEntryEmail");
   show();checkStatus.hidden=true;opening=false;return;
  }
  // A cached session is checked silently. Do not flash a sign-in dialog
  // only to close it once the verified user is redirected to the library.
  try{
   // An empty local session is enough to offer sign-in immediately. The
   // server-side account and entitlement checks remain mandatory for access.
   const {data:cached,error:sessionError}=await withTimeout(client.auth.getSession(),6500);
   if(sessionError||!cached?.session?.user){
    currentUser=null;
    const pendingEmail=el("psyEntryCode").dataset.email;
    // Keep the OTP input available when the person reopens the dialog
    // after requesting a code (the mail may arrive after a delay).
    if(pendingEmail&&requestAt&&Date.now()-requestAt<600000)step("psyEntryCode");
    else step("psyEntryEmail");
    show();return;
   }
   const {data,error:authError}=await withTimeout(client.auth.getUser(),8500);
   if(authError||!data?.user||data.user.is_anonymous){
    currentUser=null;
    if(el("psyEntryCode").dataset.email&&requestAt&&Date.now()-requestAt<600000)step("psyEntryCode");
    else step("psyEntryEmail");
    show();return;
   }
   currentUser=data.user;
   const [r,t,p]=await withTimeout(Promise.all([
    client.from("psy_account_roles").select("role").eq("user_id",currentUser.id).maybeSingle(),
    client.from("psy_trial_access").select("started_at,expires_at").eq("user_id",currentUser.id).maybeSingle(),
    client.from("psy_paid_access").select("plan,expires_at").eq("user_id",currentUser.id).maybeSingle()
   ]));
   if(r.error||t.error||p.error)throw new Error("Не удалось проверить права доступа.");
   role=r.data?.role||"participant";trial=t.data||null;paid=p.data||null;
   if(["owner","shadow","moderator"].includes(role)){
    if(timer){clearInterval(timer);timer=null;}
    const trialPill=el("psyHomeTrial");if(trialPill)trialPill.hidden=true;
    step("psyEntryAccess");el("psyEntryAccessName").textContent=role==="owner"?"Доступ владельца":role==="shadow"?"Резервный доступ «Тень»":"Доступ модератора";
    el("psyEntryTimeCaption").textContent="Для команды проекта пробный период не требуется.";
    el("psyEntryClock").textContent="Без ограничения";el("psyEntryGo").disabled=false;
    ownerNeedsMfa=false;
    if(role==="owner"||role==="shadow"){
     const {data:aal,error:aalError}=await withTimeout(client.auth.mfa.getAuthenticatorAssuranceLevel());
     if(aalError||aal?.currentLevel!=="aal2"){
      ownerNeedsMfa=true;
      el("psyEntryAccessName").textContent=role==="shadow"?"Резервный доступ «Тень»":"Доступ владельца";
      el("psyEntryTimeCaption").textContent="Для управления пользователями понадобится второй фактор. Библиотеку можно открыть сейчас.";
      el("psyEntryClock").textContent="MFA для управления";
      el("psyEntryGo").textContent="Открыть библиотеку";
     }else el("psyEntryGo").textContent="Открыть библиотеку";
    }else el("psyEntryGo").textContent="Открыть библиотеку";
   }else if(paid?.expires_at&&new Date(paid.expires_at).getTime()>Date.now()){
    if(timer){clearInterval(timer);timer=null;}
    const trialPill=el("psyHomeTrial");if(trialPill)trialPill.hidden=true;
    step("psyEntryAccess");
    el("psyEntryAccessName").textContent=paid.plan==="organization"?"Организация":"Специалист";
    el("psyEntryTimeCaption").textContent="Оплаченный доступ действует до:";
    el("psyEntryClock").textContent=new Intl.DateTimeFormat("ru-RU",{dateStyle:"medium",timeStyle:"short"}).format(new Date(paid.expires_at));
    el("psyEntryGo").textContent="Открыть библиотеку";
    el("psyEntryGo").disabled=false;
   }else if(trial){
    if(new Date(trial.expires_at).getTime()>Date.now()){
     step("psyEntryAccess");el("psyEntryAccessName").textContent="Бесплатный пробный доступ";
     el("psyEntryTimeCaption").textContent="Осталось до окончания пробного периода:";
     el("psyEntryGo").disabled=false;clock();
    }else step("psyEntryExpired");
   }else step("psyEntryPlans");
   if(direct&&hasActiveAccess()){
    close();
    location.assign(destination);
    return;
   }
   show();
  }catch(ex){step("psyEntryEmail");show();error("Не удалось связаться с сервисом авторизации или проверить доступ. Вход пока не подтвержден. Проверьте соединение и повторите попытку.")}
  finally{opening=false;checkStatus.hidden=true}
 }
 const badge=document.createElement("span");badge.id="psyHomeTrial";badge.className="psy-entry-pill";badge.hidden=true;
 const homeNav=root.querySelector(".site-header nav");if(homeNav)homeNav.prepend(badge);
 document.addEventListener("click",e=>{
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest?.("a[href]");if(!a||a.target==="_blank"||a.hasAttribute("download"))return;
  const to=validTarget(a.getAttribute("href"));if(!to)return;
  e.preventDefault();setDestination(to);load({direct:true});
 },true);
 el("psyEntryAgain").addEventListener("click",()=>{
  el("psyEntryMail").value=el("psyEntryCode").dataset.email||el("psyEntryMail").value;
  step("psyEntryEmail");error("");el("psyEntryMail").focus();
 });
 const emailInput=el("psyEntryMail"),emailButton=el("psyEntrySend");
 const codeInput=el("psyEntryToken"),verifyButton=el("psyEntryVerify");
 const codeMessage=el("psyEntryCodeMessage"),codeAddress=el("psyEntryCodeAddress");
 const resendButton=el("psyEntryResend");
 async function sendEmailCode(email){
  if(sendingEmail)return;
  if(!authEnabled||!client){error("Сервис входа временно недоступен.");return;}
  if(Date.now()-requestAt<60000){
   error("Новый запрос можно отправить через "+Math.ceil((60000-(Date.now()-requestAt))/1000)+" сек.");
   return;
  }
  sendingEmail=true;requestAt=Date.now();error("");
  emailButton.disabled=true;resendButton.disabled=true;
  el("psyEntryCode").dataset.email=email;
  codeAddress.textContent=email;
  codeMessage.textContent="Отправляем одноразовый код на почту...";
  codeInput.value="";codeInput.disabled=true;verifyButton.disabled=true;
  step("psyEntryCode");show();
  try{
   const {error:mailError}=await withTimeout(client.auth.signInWithOtp({
    email,options:{shouldCreateUser:true,emailRedirectTo:new URL("index.html?home=1&entry=1",location.href).href}
   }),20000);
   if(mailError)throw mailError;
   codeInput.disabled=false;verifyButton.disabled=false;
   codeMessage.textContent="Запрос принят. Проверьте входящие и папку «Спам». Если письмо не появится, отправьте код повторно через минуту.";
   codeInput.focus();
  }catch(ex){
   requestAt=0;
   step("psyEntryEmail");
   error("Не удалось отправить запрос на код. Проверьте подключение к сервису авторизации. "+(ex?.message&&/too many|rate limit|лимит/i.test(ex.message)?String(ex.message):"Если без VPN вход не работает, проблема может быть в связи с зарубежным сервером."));
  }finally{
   sendingEmail=false;emailButton.disabled=false;resendButton.disabled=false;
  }
 }
 el("psyEntryEmailForm").addEventListener("submit",event=>{
  event.preventDefault();
  const email=emailInput.value.trim().toLowerCase();
  if(!emailInput.checkValidity()){
   error("Укажите действующий адрес почты.");
   emailInput.focus();return;
  }
  void sendEmailCode(email);
 });
 resendButton.addEventListener("click",()=>{
  const email=el("psyEntryCode").dataset.email||emailInput.value.trim().toLowerCase();
  if(email)void sendEmailCode(email);
 });
 el("psyEntryCodeForm").addEventListener("submit",async e=>{
  e.preventDefault();if(!client)return;
  const email=el("psyEntryCode").dataset.email||el("psyEntryMail").value.trim();
  const token=el("psyEntryToken").value.trim();
  if(!/^\d{6,8}$/.test(token)){error("Введите числовой код из письма.");return}
  const button=el("psyEntryVerify");button.disabled=true;error("");
  try{
   const {error:verifyError}=await withTimeout(client.auth.verifyOtp({email,token,type:"email"}),20000);
   if(verifyError)throw verifyError;
   await load();
  }catch(ex){error("Код не подошел, истек или проверка недоступна. "+String(ex?.message||"Повторите попытку."))}
  finally{button.disabled=false}
 });
 el("psyEntryStart").addEventListener("click",async()=>{
  if(!client||!currentUser)return;
  const b=el("psyEntryStart");b.disabled=true;error("");
  try{
   const {error:insertError}=await client.from("psy_trial_access").insert({user_id:currentUser.id});
   if(insertError&&insertError.code!=="23505")throw insertError;
   const {data, error:readError}=await client.from("psy_trial_access")
     .select("started_at,expires_at").eq("user_id",currentUser.id).single();
   if(readError||!data)throw new Error("Не удалось проверить активацию.");
   trial=data;
   if(new Date(trial.expires_at).getTime()>Date.now()){
    step("psyEntryAccess");el("psyEntryGo").disabled=false;clock();
   }else step("psyEntryExpired");
  }catch(_){error("Не удалось начать пробный период. Повторите попытку.")}
  finally{b.disabled=false}
 });
 el("psyEntryGo").addEventListener("click",()=>{
  // Opening the library needs a valid account, not admin step-up MFA.
  // Administrative operations continue to require AAL2 on the server.
  const paidValid=paid?.expires_at&&new Date(paid.expires_at).getTime()>Date.now();
  if(!["owner","shadow","moderator"].includes(role)&&!paidValid&&(!trial||new Date(trial.expires_at).getTime()<=Date.now())){
   error("Пробный доступ завершен.");return;
  }
  location.assign(destination);
 });
 el("psyEntrySignOut").addEventListener("click",async()=>{
  if(!client)return;
  const {error:signError}=await client.auth.signOut();
  if(signError){error("Не удалось выйти. Повторите попытку.");return}
  currentUser=null;trial=null;paid=null;role="participant";ownerNeedsMfa=false;if(timer)clearInterval(timer);
  el("psyHomeTrial").hidden=true;step("psyEntryEmail");
 });
 if(authEnabled&&client){
  client.auth.getUser().then(async ({data, error:authError})=>{
   if(authError||!data?.user)return;
   const {data:roleResult,error:roleError}=await client.from("psy_account_roles")
      .select("role").eq("user_id",data.user.id).maybeSingle();
   if(roleError||["owner","shadow","moderator"].includes(roleResult?.role))return;
   const {data:access,error:readError}=await client.from("psy_trial_access")
      .select("started_at,expires_at").eq("user_id",data.user.id).maybeSingle();
   if(!readError&&access&&new Date(access.expires_at).getTime()>Date.now()){
    role=roleResult?.role||"participant";trial=access;clock();
   }
  }).catch(()=>{});
 }
 try{
  const params=new URLSearchParams(location.search);
  if(params.has("entry")||params.get("access")==="1"){
   const from=sessionStorage.getItem("psy-intended-destination");
   setDestination(from||"library.html");
   load({direct:true});
  }
 }catch(_){}
})();
