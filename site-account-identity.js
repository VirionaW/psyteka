"use strict";
// Identity and locally scoped profile data. Never reuse a pre-login demo avatar.
(function(){
 const cfg=window.PSY_AUTH_CONFIG||{};
 const valid=/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(cfg.url||"")
  &&/^sb_publishable_[a-zA-Z0-9_-]+$/.test(cfg.publishableKey||"")
  &&!!window.supabase?.createClient;
 const client=valid?(window.PSY_AUTH_CLIENT||(window.PSY_AUTH_CLIENT=window.supabase.createClient(cfg.url,cfg.publishableKey,{
  auth:{flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
 }))):null;
 const state={user:null,role:"participant",client};
 const prefix=(field)=>state.user?.id?"psy-"+field+"-v2:"+state.user.id:null;
 state.profileKey=()=>prefix("profile");
 state.avatarKey=()=>prefix("avatar");
 state.ready=(async()=>{
  if(!client)return state;
  try{
   const {data,error}=await client.auth.getUser();
   if(error||!data?.user||data.user.is_anonymous)return state;
   state.user=data.user;
   const {data:role,error:readError}=await client.from("psy_account_roles")
    .select("role").eq("user_id",state.user.id).maybeSingle();
   if(!readError&&["owner","shadow","moderator"].includes(role?.role))state.role=role.role;
  }catch(_){}
  return state;
 })();
 window.PSY_IDENTITY=state;
})();
