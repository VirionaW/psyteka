"use strict";
/* Persistent public copy only: never change method IDs, question arrays,
   scoring keys, age-version routing or saved assessment snapshots. */
(function(){
 const home={
  "home:hero:lead":".hero-copy > p",
  "home:sections:lead":"#sections .section-head > p",
  "home:inside:heading":"#inside .psy-preview-wrap > div:first-child h2",
  "home:inside:lead":"#inside .psy-preview-wrap > div:first-child p",
  "home:mission:heading":"#about .psy-mission-copy > h2",
  "home:mission:lead":"#about .psy-mission-copy > p.large-text"
 };
 const methodFields=new Set(["name","author","type","age","count","summary","goal","indicators"]);
 const originalHome=new Map();
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
 function methodKey(m,field){
  if(!m||!methodFields.has(field))return "";
  return "method:"+encodeURIComponent(String(m.id||""))+":"+field;
 }
 function get(m,field){
  const key=methodKey(m,field);
  return key&&applied.has(key)?applied.get(key):null;
 }
 function display(m,field,fallback){
  return get(m,field)??fallback??"";
 }
 function indicators(m,fallback){
  const changed=get(m,"indicators");
  return changed===null?fallback:String(changed).split(/\r?\n/).map(x=>x.trim()).filter(Boolean).slice(0,30);
 }
 function apply(){
  for(const [key,selector] of Object.entries(home)){
   const el=document.querySelector(selector);
   if(!el)continue;
   if(!originalHome.has(key))originalHome.set(key,el.textContent);
   el.textContent=applied.has(key)?applied.get(key):originalHome.get(key);
  }
  // The common card composer is also used by the main library experience.
  // Its source metadata stays untouched; we override presentation fields
  // after source calculations so it never changes diagnostic decisions.
  const composer=window.PSY_SCHOOL_CARDS;
  if(composer?.compose&&!composer.compose.__psyContentWrapped){
   const original=composer.compose;
   const wrapped=function(m,...args){
    const result=original.call(this,m,...args)||{};
    for(const [key,source] of [["author","author"],["type","type"],["age","age"],["count","quantity"],["summary","summary"]]){
     const value=get(m,key);
     if(value!==null)result[source]=value;
    }
    return result;
   };
   wrapped.__psyContentWrapped=true;
   composer.compose=wrapped;
  }
  if(typeof window.PSY_RENDER_CATALOG==="function")window.PSY_RENDER_CATALOG();
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
  }catch(_){loadFailed=true;/* Original copy remains available if cloud is offline. */}
 }
 window.PSY_CONTENT_OVERRIDES={load,apply,get,display,indicators,methodKey,get failed(){return loadFailed}};
 void load();
})();
