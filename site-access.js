"use strict";
/* Entry coordinator, not a DRM layer. Static files remain public.
   Real subscriptions later require a server-mediated file store. */
(function(){
 const root=document.documentElement;
 const publicPages=new Set(["about.html","guide.html","profile.html","settings.html"]);
 if(publicPages.has(location.pathname.split("/").pop())){root.classList.add("psy-access-ok");return}
 const config=window.PSY_AUTH_CONFIG||{};
 const enabled=config.registrationEnabled===true;
 // The landing page shows non-interactive real catalog previews in iframes.
 if(window.self!==window.top){root.classList.add("psy-access-ok");return}
 function goHome(){
  try{
   const destination=location.pathname.slice(location.pathname.lastIndexOf("/")+1)+location.search+location.hash;
   sessionStorage.setItem("psy-intended-destination",destination);
  }catch(_){}
  location.replace("index.html?home=1&entry=1");
 }
 function pill(text,clockEnd,role="participant"){
  document.addEventListener("DOMContentLoaded",()=>{
   const bar=document.querySelector(".topbar");if(!bar)return;
   // Полный отсчет уже показан под шапкой библиотеки.
   if(clockEnd&&document.getElementById("psyTrialStrip"))return;
   const old=bar.querySelector("#psyLibraryTrial");if(old)old.remove();
   const item=document.createElement("span");item.id="psyLibraryTrial";item.className="psy-entry-pill";item.dataset.role=role;
   const anchor=bar.querySelector(".header-avatar");bar.insertBefore(item,anchor||null);
   if(!clockEnd){item.textContent=text;return;}
   const update=()=>{
    const left=new Date(clockEnd).getTime()-Date.now();
    if(left<=0){item.textContent="Пробный период завершен";clearInterval(interval);return}
    const s=Math.floor(left/1000),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60);
    item.textContent="Пробный доступ: "+(d?d+" д. ":"")+String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");
   };
   let interval=null;update();if(new Date(clockEnd).getTime()>Date.now())interval=setInterval(update,30000);
  });
 }
 if(!enabled){
  let demo=false;
  try{demo=sessionStorage.getItem("psy-demo-entry")==="1"}catch(_){}
  if(demo){root.classList.add("psy-access-ok");pill("Демоверсия");return}
  goHome();return;
 }
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.url||"")||
    !/^sb_publishable_[A-Za-z0-9_-]+$/.test(config.publishableKey||"")||
    !window.supabase?.createClient){goHome();return}
 const client=window.PSY_AUTH_CLIENT||(window.PSY_AUTH_CLIENT=window.supabase.createClient(config.url,config.publishableKey,{
  auth:{flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
 }));
 function temporaryFailure(){
  // A network/authorization-service outage is not a sign-out: never discard
  // the refresh session or pretend access was denied.
  const renderError=()=>{
   const css=document.createElement("style");
   css.textContent="html.psy-access-retry body{visibility:visible!important}html.psy-access-retry body > :not(#psyAccessRetryMessage){display:none!important}";
   document.head.append(css);
   const screen=document.createElement("main");
   screen.id="psyAccessRetryMessage";
   screen.setAttribute("role","alert");
   screen.style.cssText="min-height:100vh;display:grid;place-content:center;gap:16px;max-width:520px;margin:auto;padding:30px;text-align:center;font:16px/1.5 system-ui,sans-serif;color:#214537";
   const heading=document.createElement("h1");heading.textContent="Не удалось проверить доступ";heading.style.fontSize="24px";
   const info=document.createElement("p");info.textContent="Связь с сервисом аккаунтов временно недоступна. Вход не сброшен. Попробуйте еще раз.";
   const retry=document.createElement("button");retry.type="button";retry.textContent="Повторить проверку";retry.style.cssText="padding:13px 18px;border:0;border-radius:12px;background:#257854;color:#fff;cursor:pointer;font:700 15px system-ui";
   retry.addEventListener("click",()=>location.reload());
   screen.append(heading,info,retry);document.body.append(screen);
   root.classList.add("psy-access-retry");
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",renderError,{once:true});
  else renderError();
 }
 (async()=>{
  try{
   const {data,error}=await client.auth.getUser();
   if(error){temporaryFailure();return}
   if(!data?.user||data.user.is_anonymous){goHome();return}
   const uid=data.user.id;
   const [r,t,p]=await Promise.all([
    client.from("psy_account_roles").select("role").eq("user_id",uid).maybeSingle(),
    client.from("psy_trial_access").select("expires_at").eq("user_id",uid).maybeSingle(),
    client.from("psy_paid_access").select("plan,expires_at").eq("user_id",uid).maybeSingle()
   ]);
   if(r.error||t.error||p.error){temporaryFailure();return}
   if(["owner","shadow","moderator"].includes(r.data?.role)){
    // Reading the library is not an administrative action.
    // The management page and server-side role changes still require AAL2.
    root.classList.add("psy-access-ok");
    pill(r.data.role==="owner"?"Владелец":r.data.role==="shadow"?"Тень":"Модератор",null,r.data.role);return;
   }
   // Only server-confirmed and unexpired paid grants count as access.
   if(p.data?.expires_at&&new Date(p.data.expires_at).getTime()>Date.now()){
    root.classList.add("psy-access-ok");
    pill("Оплаченная подписка",null,"paid");return;
   }
   if(!t.data?.expires_at||new Date(t.data.expires_at).getTime()<=Date.now()){goHome();return}
   root.classList.add("psy-access-ok");pill("Пробный доступ",t.data.expires_at);
  }catch(_){temporaryFailure()}
 })();
})();
