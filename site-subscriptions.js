"use strict";
/* Subscription catalog: trial is one-time per Supabase user. No paid checkout. */
(function(){
 const status=document.getElementById("psySubsStatus");
 const card=document.getElementById("psyTrialPlan");
 const start=document.getElementById("psyTrialActivate");
 const identity=window.PSY_IDENTITY;
 if(!status||!card||!start)return;
 const {client}=identity||{};
 const privileged=["owner","shadow","moderator"];
 let user=null,role="participant",busy=false,interval=null;
 const say=(message,type="info")=>{
  status.textContent=message;
  status.dataset.status=type;
 };
 const hideTrial=()=>{card.hidden=true;start.disabled=true;};
 const showTrial=(label)=>{
  card.hidden=false;start.disabled=false;start.textContent=label;
 };
 const countTime=(end)=>{
  const remaining=Math.max(0,end-Date.now());
  if(!remaining)return "";
  const s=Math.ceil(remaining/1000),d=Math.floor(s/86400),
   h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60);
  return (d?d+" д. ":"")+String(h).padStart(2,"0")+" ч. "+String(m).padStart(2,"0")+" мин.";
 };
 function displayExisting(row){
  hideTrial();
  if(interval!==null){clearInterval(interval);interval=null;}
  const deadline=Date.parse(row.expires_at||"");
  if(!Number.isFinite(deadline)){
   say("Пробный период уже активировался ранее. Для уточнения срока обратитесь в поддержку.");
   return;
  }
  const render=()=>{
   const remain=countTime(deadline);
   if(remain){
    say("Пробный доступ действует. Осталось: "+remain+" Окончание: "+new Intl.DateTimeFormat("ru-RU",{dateStyle:"medium",timeStyle:"short"}).format(new Date(deadline))+".");
   }else{
    say("Пробный доступ на 2 дня завершился. Повторное подключение бесплатного периода недоступно.");
    if(interval!==null){clearInterval(interval);interval=null;}
   }
  };
  render();
  if(deadline>Date.now())interval=setInterval(render,30000);
 }
 async function fetchRole(id){
  const {data,error}=await client.from("psy_account_roles")
   .select("role").eq("user_id",id).maybeSingle();
  if(error)throw error;
  return data?.role||"participant";
 }
 async function fetchTrial(id){
  const {data,error}=await client.from("psy_trial_access")
   .select("started_at,expires_at").eq("user_id",id).maybeSingle();
  if(error)throw error;
  return data;
 }
 async function refresh(){
  hideTrial();
  if(!client){
   say("Проверка пробного доступа временно недоступна. Платная оплата не подключена.","error");
   return;
  }
  try{
   const {data,error}=await client.auth.getUser();
   if(error)throw error;
   user=data?.user&&!data.user.is_anonymous?data.user:null;
   if(!user){
    role="participant";
    say("Вы можете посмотреть все тарифы. Для активации бесплатных 2 дней войдите в аккаунт.");
    showTrial("Войти и начать 2 дня");
    return;
   }
   role=await fetchRole(user.id);
   if(privileged.includes(role)){
    say(role==="shadow"?"У вас постоянный доступ «Тень». Пробный период не требуется.":"У вашей административной роли доступ к библиотеке не зависит от пробного периода.");
    return;
   }
   const row=await fetchTrial(user.id);
   if(row){displayExisting(row);return;}
   if(!user.email_confirmed_at){
    say("Сначала подтвердите электронную почту, чтобы активировать бесплатные 48 часов.");
    showTrial("Подтвердить почту и войти");
    return;
   }
   say("Бесплатный пробный доступ еще не использован. Доступно однократное включение на 48 часов.");
   showTrial("Активировать бесплатные 2 дня");
  }catch(_){
   hideTrial();
   say("Не удалось проверить срок пробного доступа. Обновите страницу позднее. Повторный старт не выполняется без проверки.","error");
  }
 }
 start.addEventListener("click",async()=>{
  if(busy)return;
  if(!client||!user||!user.email_confirmed_at){
   location.assign("index.html?home=1&entry=1");
   return;
  }
  busy=true;start.disabled=true;
  try{
   // Check access again immediately before insert. The database's unique
   // user_id and RLS policies enforce one-time activation, even across tabs.
   role=await fetchRole(user.id);
   if(privileged.includes(role)){hideTrial();say("У команды Психотеки постоянный доступ. Пробный период не нужен.");return;}
   const old=await fetchTrial(user.id);
   if(old){displayExisting(old);return;}
   if(!window.confirm("Активировать пробные 48 часов сейчас? Отсчет начнется сразу и продлить его нельзя.")){return;}
   const {error}=await client.from("psy_trial_access").insert({user_id:user.id});
   // Re-read even after a uniqueness conflict, if another tab activated it.
   const row=await fetchTrial(user.id);
   if(row){displayExisting(row);return;}
   if(error)throw error;
   throw Error("Activation not confirmed");
  }catch(_){
   hideTrial();
   say("Не удалось подтвердить активацию. Доступ не считается включенным без ответа сервера. Обновите страницу и проверьте статус.","error");
  }finally{
   busy=false;
   if(!card.hidden)start.disabled=false;
  }
 });
 window.addEventListener("pagehide",()=>{if(interval!==null)clearInterval(interval)},{once:true});
 refresh();
})();