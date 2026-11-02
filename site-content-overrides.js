"use strict";
/* Public text-only overrides. Version records are immutable and RLS-protected.
   Do not patch keys, scores, stimuli, instructions or user assessments. */
(function(){
 const home={
  "home:hero:lead":".hero-copy > p",
  "home:sections:lead":"#sections .section-head > p",
  "home:inside:heading":"#inside .psy-preview-wrap > div:first-child h2",
  "home:inside:lead":"#inside .psy-preview-wrap > div:first-child p",
  "home:mission:heading":"#about .psy-mission-copy > h2",
  "home:mission:lead":"#about .psy-mission-copy > p.large-text"
 };
 function getClient(){
  const cfg=window.PSY_AUTH_CONFIG||{};
  if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(cfg.url||"")||
   !/^sb_publishable_[A-Za-z0-9_-]+$/.test(cfg.publishableKey||"")||
   !window.supabase?.createClient)return null;
  return window.PSY_AUTH_CLIENT||(window.PSY_AUTH_CLIENT=window.supabase.createClient(cfg.url,cfg.publishableKey,{
   auth:{flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
  }));
 }
 let applied=new Map(),loadFailed=false;
 function apply(){
  for(const [key,selector] of Object.entries(home)){
   if(!applied.has(key))continue;
   const el=document.querySelector(selector);
   if(el)el.textContent=applied.get(key);
  }
  const catalog=window.PSY_CATALOG;
  if(Array.isArray(catalog)){
   for(const m of catalog){
    const id=encodeURIComponent(String(m.id||""));
    const summary=applied.get("method:"+id+":summary");
    const goal=applied.get("method:"+id+":goal");
    if(summary!==undefined)m.summary=summary;
    if(goal!==undefined)m.goal=goal;
   }
  }
  if(Array.isArray(catalog)&&window.PSY_SCHOOL_CARDS?.compose&&!window.PSY_SCHOOL_CARDS.compose.__psyContentWrapped){
   const original=window.PSY_SCHOOL_CARDS.compose;
   const wrapped=function(m,...args){
    const result=original.call(this,m,...args)||{};
    const summary=applied.get("method:"+encodeURIComponent(String(m.id||""))+":summary");
    if(summary!==undefined)result.summary=summary;
    return result;
   };
   wrapped.__psyContentWrapped=true;
   window.PSY_SCHOOL_CARDS.compose=wrapped;
  }
  // An asynchronous fetch can finish after the library's first render.
  if(applied.size&&typeof window.PSY_RENDER_CATALOG==="function")window.PSY_RENDER_CATALOG();
 }
 async function load(){
  const client=getClient();
  if(!client)return;
  try{
   const {data,error}=await client.from("psy_site_content_live").select("content_key,content_value");
   if(error)throw error;
   applied=new Map((data||[]).filter(x=>x.content_value!==null&&typeof x.content_value==="string")
    .map(x=>[x.content_key,x.content_value]));
   loadFailed=false;apply();
  }catch(_){loadFailed=true;/* Keep original site copy on network failures. */}
 }
 window.PSY_CONTENT_OVERRIDES={load,apply,get failed(){return loadFailed}};
 void load();
})();
