"use strict";
/* Library entry vs reload: save the actual on-screen state only for reloading this tab.
   A fresh visit from the home page always shows the direction chooser. */
(function(){
 const KEY="psy-library-page-state-v3";
 const allowed=new Set(["school","preschool","adults","special","documents","spt","prevention","information","pmpk"]);
 const sidebar=document.getElementById("sidebar");
 const main=document.querySelector("main.main");
 function capture(){
  try{
   const route=new URLSearchParams(location.search).get("area");
   const visible=document.body.dataset.area;
   const area=allowed.has(route)?route:allowed.has(visible)?visible:null;
   const state=window.PSY_LIBRARY_CARD_STATE||{};
   const school={};
   for(const k of ["topic","query","category","format"]){
    school[k]=typeof state[k]==="string"?state[k]:"";
   }
   const expanded=Array.from(document.querySelectorAll("button[aria-controls][aria-expanded]"))
    .map(b=>({id:b.id||null,view:b.dataset.view||null,section:b.dataset.section||null,
     controls:b.getAttribute("aria-controls"),open:b.getAttribute("aria-expanded")==="true"}))
    .filter(x=>x.controls);
   sessionStorage.setItem(KEY,JSON.stringify({
    area,school,expanded,
    windowY:Math.max(0,window.scrollY||document.documentElement.scrollTop||0),
    mainY:Math.max(0,main?.scrollTop||0),
    sidebarY:Math.max(0,sidebar?.scrollTop||0)
   }));
  }catch(_){}
 }
 window.addEventListener("pagehide",capture);
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")capture()});
 if(!window.PSY_LIBRARY_RELOAD||!window.PSY_LIBRARY_SNAPSHOT)return;
 const saved=window.PSY_LIBRARY_SNAPSHOT;
 try{history.scrollRestoration="manual"}catch(_){}
 function restore(){
  // Keep the direction, navigation tree and nested subtopics exactly as they were.
  for(const item of saved.expanded||[]){
   if(!item.controls)continue;
   const b=Array.from(document.querySelectorAll("button[aria-controls]"))
    .find(el=>el.getAttribute("aria-controls")===item.controls &&
      (!item.view||el.dataset.view===item.view));
   const content=document.getElementById(item.controls);
   if(!b||!content)continue;
   b.setAttribute("aria-expanded",String(!!item.open));
   content.hidden=!item.open;
  }
  if(typeof saved.sidebarY==="number"&&sidebar)sidebar.scrollTop=saved.sidebarY;
  if(typeof saved.mainY==="number"&&main)main.scrollTop=saved.mainY;
  if(typeof saved.windowY==="number")window.scrollTo({top:Math.max(0,saved.windowY),behavior:"instant"});
 }
 const schedule=()=>{
  requestAnimationFrame(()=>requestAnimationFrame(restore));
  setTimeout(restore,180);
  setTimeout(restore,650);
 };
 if(document.readyState==="complete")schedule();
 else window.addEventListener("load",schedule,{once:true});
})();
