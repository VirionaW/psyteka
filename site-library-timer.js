"use strict";
/* Компактный таймер двухдневного доступа в верхней части библиотеки.
   Источник срока – только psy_trial_access.expires_at из Supabase.
   Таймер информирует; серверные сроки и права он не изменяет. */
(function(){
 const strip=document.getElementById("psyTrialStrip");
 const value=document.getElementById("psyTrialRemaining");
 const until=document.getElementById("psyTrialDeadline");
 if(!strip||!value||!until)return;
 strip.hidden=true;
 const conf=window.PSY_AUTH_CONFIG||{};
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(conf.url||"")||
    !/^sb_publishable_[a-zA-Z0-9_-]+$/.test(conf.publishableKey||"")||
    !window.supabase?.createClient)return;
 const client=window.supabase.createClient(conf.url,conf.publishableKey,{
  auth:{flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
 });
 let interval=null,stop=false;
 function clear(){if(interval!==null){clearInterval(interval);interval=null;}}
 function display(expiry){
  const stamp=Date.parse(expiry||"");
  if(!Number.isFinite(stamp)){strip.hidden=true;return;}
  until.dateTime=new Date(stamp).toISOString();
  until.textContent=new Intl.DateTimeFormat("ru-RU",{
   day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"
  }).format(new Date(stamp));
  strip.hidden=false;
  clear();
  function tick(){
   const remaining=Math.max(0,stamp-Date.now());
   if(!remaining){
    value.textContent="Пробный период завершен";
    strip.classList.add("is-expired");
    clear();
    return;
   }
   strip.classList.remove("is-expired");
   const total=Math.ceil(remaining/1000);
   const day=Math.floor(total/86400);
   const hour=Math.floor((total%86400)/3600);
   const minute=Math.floor((total%3600)/60);
   const second=total%60;
   value.textContent=(day?day+" д. ":"")+[hour,minute,second].map(n=>String(n).padStart(2,"0")).join(":");
  }
  tick();if(stamp>Date.now())interval=setInterval(tick,1000);
 }
 async function refresh(){
  try{
   const {data,error}=await client.auth.getUser();
   if(error||!data?.user||data.user.is_anonymous||stop)return;
   // Accounts with privileged roles are not trial accounts. A historical
   // trial row may exist, but its expiry must never display a countdown.
   const {data:role,error:roleError}=await client.from("psy_account_roles")
     .select("role").eq("user_id",data.user.id).maybeSingle();
   if(roleError||stop){clear();strip.hidden=true;return;}
   if(["owner","shadow","moderator"].includes(role?.role)){
    clear();strip.hidden=true;return;
   }
   const {data:paid,error:paidError}=await client.from("psy_paid_access")
     .select("expires_at").eq("user_id",data.user.id).maybeSingle();
   if(paidError||stop){clear();strip.hidden=true;return;}
   if(paid?.expires_at&&new Date(paid.expires_at).getTime()>Date.now()){
    clear();strip.hidden=true;return;
   }
   const {data:trial,error:readError}=await client.from("psy_trial_access")
     .select("expires_at").eq("user_id",data.user.id).maybeSingle();
   if(readError||stop){clear();strip.hidden=true;return;}
   if(trial?.expires_at)display(trial.expires_at);
   else {clear();strip.hidden=true;}
  }catch(_){strip.hidden=true}
 }
 client.auth.onAuthStateChange((event)=>{
  if(event==="SIGNED_OUT"){
   stop=true;clear();strip.hidden=true;
  }
 });
 window.addEventListener("pagehide",clear,{once:true});
 refresh();
})();
