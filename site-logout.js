"use strict";
/* Общий выход из учетной записи Метоларии.
   Кнопка скрыта, пока Supabase не подтвердил действующую сессию.
   Никакие роли или права не устанавливаются на стороне браузера. */
(function(){
 const controls=Array.from(document.querySelectorAll("[data-psy-logout]"));
 if(!controls.length)return;
 const config=window.PSY_AUTH_CONFIG||{};
 const show=value=>controls.forEach(btn=>{btn.hidden=!value;btn.disabled=false;});
 show(false);
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.url||"")
    || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(config.publishableKey||"")
    || !window.supabase?.createClient)return;
 const client=window.PSY_AUTH_CLIENT||(window.PSY_AUTH_CLIENT=window.supabase.createClient(config.url,config.publishableKey,{
  auth:{flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
 }));
 let leaving=false;
 function forgetNavigation(){
  try{
   sessionStorage.removeItem("psy-intended-destination");
   sessionStorage.removeItem("psy-demo-entry");
  }catch(_){}
 }
 async function logout(){
  if(leaving)return;
  leaving=true;
  controls.forEach(btn=>{btn.disabled=true;btn.setAttribute("aria-busy","true");});
  try{
   // Supabase signOut invalidates the refresh session. No local profile,
   // favorites, diagnostic worksheets or theme preferences are deleted.
   const {error}=await client.auth.signOut();
   if(error)throw error;
   forgetNavigation();
   show(false);
   location.replace("index.html?home=1&entry=1");
  }catch(_){
   leaving=false;
   controls.forEach(btn=>{btn.disabled=false;btn.removeAttribute("aria-busy");});
   window.alert("Не удалось выйти из аккаунта. Проверьте подключение и повторите попытку.");
  }
 }
 for(const btn of controls)btn.addEventListener("click",logout);
 // Initial authentication is verified with the server, not by stored values.
 client.auth.getUser().then(({data,error})=>{
  if(!leaving)show(!error&&!!data?.user&&!data.user.is_anonymous);
 }).catch(()=>show(false));
 client.auth.onAuthStateChange((event,session)=>{
  if(leaving)return;
  if(event==="SIGNED_OUT")show(false);
  else if(event==="SIGNED_IN")show(!!session?.user&&!session.user.is_anonymous);
 });
})();
