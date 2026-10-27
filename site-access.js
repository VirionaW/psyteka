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
 const client=window.supabase.createClient(config.url,config.publishableKey,{
  auth:{flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
 });
 (async()=>{
  try{
   const {data,error}=await client.auth.getUser();
   if(error||!data?.user||data.user.is_anonymous){goHome();return}
   const uid=data.user.id;
   const [r,t]=await Promise.all([
    client.from("psy_account_roles").select("role").eq("user_id",uid).maybeSingle(),
    client.from("psy_trial_access").select("expires_at").eq("user_id",uid).maybeSingle()
   ]);
   if(r.error||t.error){goHome();return}
   if(["owner","shadow","moderator"].includes(r.data?.role)){
    if(r.data.role==="owner"||r.data.role==="shadow"){
     const {data:level,error:aalError}=await client.auth.mfa.getAuthenticatorAssuranceLevel();
     if(aalError||level?.currentLevel!=="aal2"){
      try{sessionStorage.setItem("psy-intended-destination",location.pathname.split("/").pop()+location.search+location.hash)}catch(_){}
      location.replace("owner-mfa.html");return;
     }
    }
    root.classList.add("psy-access-ok");
    pill(r.data.role==="owner"?"Владелец":r.data.role==="shadow"?"Тень":"Модератор",null,r.data.role);return;
   }
   if(!t.data?.expires_at||new Date(t.data.expires_at).getTime()<=Date.now()){goHome();return}
   root.classList.add("psy-access-ok");pill("Пробный доступ",t.data.expires_at);
  }catch(_){goHome()}
 })();
})();
