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
 function applyPortfolioDOM(m,body){
  if(!m||!body)return;
  const modal=document.getElementById("modal");
  const heading=modal?.querySelector("#modalTitle");
  if(heading){const cardTitle=window.PSY_SCHOOL_CARDS?.compose?.(m,window.PSY_FULL_METHODS?.[m.name],window.PSY_PORTFOLIO_EDITS?.[m.name]||{},window.PSY_GUIDE_STANDARD)?.title||m.name;heading.textContent=display(m,"name",cardTitle);}
  const edits=["name","author","type","age","count","goal","indicators"]
   .filter(key=>get(m,key)!==null);
  if(!edits.length)return;
  const labels={name:/^(Методика|Программа|Материал)$/i,author:/^(Автор|Разработчик|Составитель)$/i,
   type:/^Вид$/i,age:/^(Возраст|Целевая аудитория)$/i,count:/^Количество вопросов \/ заданий$/i};
  const rows=Array.from(body.querySelectorAll(".psy-profile-row"));
  for(const row of rows){
   const label=row.querySelector("strong")?.textContent?.trim()||"";
   const span=row.querySelector("span");
   if(!span)continue;
   for(const [field,pattern] of Object.entries(labels)){
    if(pattern.test(label)&&get(m,field)!==null)span.textContent=get(m,field);
   }
  }
  const goal=body.querySelector(".psy-profile-description");
  if(goal&&get(m,"goal")!==null)goal.textContent=get(m,"goal");
  const indicatorsBox=body.querySelector(".psy-profile-indicators");
  if(indicatorsBox&&get(m,"indicators")!==null){
   indicatorsBox.replaceChildren();
   for(const indicator of indicators(m,[])){
    const item=document.createElement("div");item.className="psy-profile-indicator";
    const span=document.createElement("span");span.textContent=indicator;
    item.append(span);indicatorsBox.append(item);
   }
  }
  // Some specialized portfolios render custom markup instead of the common rows.
  // Show one authoritative summary of corrections rather than rewriting their
  // scripts, stimulus material or scoring implementation.
  if(!rows.length){
   const shown=edits.filter(x=>x!=="name"&&x!=="indicators");
   if(shown.length){
    let panel=body.querySelector(".psy-owner-published-fields");
    if(!panel){
     panel=document.createElement("section");panel.className="psy-owner-published-fields";
     body.prepend(panel);
    }
    panel.replaceChildren();
    const h=document.createElement("h3");h.textContent="Обновленные сведения";panel.append(h);
    const captions={author:"Автор",type:"Вид",age:"Возраст",count:"Количество заданий",goal:"Цель"};
    for(const field of shown){
     const p=document.createElement("p");
     const bold=document.createElement("strong");bold.textContent=captions[field]+": ";
     p.append(bold,document.createTextNode(get(m,field)));panel.append(p);
    }
   }
  }
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
     if(value!==null)result[source]=key==="summary"?value.slice(0,150):value;
    }
    return result;
   };
   wrapped.__psyContentWrapped=true;
   composer.compose=wrapped;
  }
  if(typeof window.PSY_RENDER_CATALOG==="function")window.PSY_RENDER_CATALOG();
  window.PSY_REFRESH_METHOD_OVERVIEW?.();
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
 window.PSY_CONTENT_OVERRIDES={load,apply,get,display,indicators,methodKey,applyPortfolioDOM,get failed(){return loadFailed}};
 void load();
})();
