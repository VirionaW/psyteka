"use strict";
/* Owner-only navigation affordance. Authoritative permission check remains in
   Supabase Edge Function; merely hiding a link is never a security control. */
(async function(){
 const link=document.getElementById("psyOwnerNav");
 if(!link)return;
 link.hidden=true;
 const config=window.PSY_AUTH_CONFIG||{};
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.url||"")||
  !/^sb_publishable_[A-Za-z0-9_-]+$/.test(config.publishableKey||"")||
  !window.supabase?.createClient)return;
 try{
  // Reuse the identity client instead of starting a third concurrent auth
  // client and another competing /user request on the same browser storage.
  const identity=window.PSY_IDENTITY;
  if(identity?.client&&identity.ready){
   await identity.ready;
   if(identity.user?.email_confirmed_at&&["owner","shadow"].includes(identity.role))link.hidden=false;
   return;
  }
  const client=window.supabase.createClient(config.url,config.publishableKey,{
   auth:{flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
  });
  const {data,error}=await client.auth.getUser();
  if(error||!data?.user||data.user.is_anonymous||!data.user.email_confirmed_at)return;
  const {data:permissions,error:readError}=await client.from("psy_account_roles")
   .select("role").eq("user_id",data.user.id).maybeSingle();
  if(!readError&&["owner","shadow"].includes(permissions?.role))link.hidden=false;
 }catch(_){link.hidden=true}
})();
