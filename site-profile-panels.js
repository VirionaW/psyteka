"use strict";
/* Вкладки личного кабинета: без скролла к секциям и без пересоздания форм.
   Заполненные, но не сохраненные поля остаются в DOM при смене вкладок. */
(function(){
 const root=document.querySelector('body[data-account="profile"] .psy-studio-grid');
 if(!root)return;
 const nav=root.querySelector(".psy-studio-side-nav");
 const tabs=Array.from(nav?.querySelectorAll("[data-psy-tab]")||[]);
 const main=root.querySelector(".psy-studio-left");
 const folders=root.querySelector("#psyCollectionsArea");
 const panes={
  information:document.getElementById("psyInfo"),
  security:document.getElementById("psySecurity"),
  settings:document.getElementById("psyStudioSettings"),
  subscription:document.getElementById("psyStudioSubscription")
 };
 if(!nav||!main||!folders||tabs.length!==5||Object.values(panes).some(v=>!v))return;
 const hashes={information:"psyInfo",security:"psySecurity",folders:"psyCollections",settings:"psyStudioSettings",subscription:"psyStudioSubscription"};
 const fromHash=()=>{
  const hash=decodeURIComponent(location.hash.slice(1));
  return Object.keys(hashes).find(k=>hash===hashes[k]||(k==="folders"&&hash==="psyCollectionsArea"))||"information";
 };
 function switchPane(name,options={}){
  if(!tabs.some(t=>t.dataset.psyTab===name))name="information";
  root.dataset.activePanel=name;
  for(const [key,pane] of Object.entries(panes))pane.hidden=key!==name;
  main.hidden=name==="folders";
  folders.classList.toggle("psy-collections-focus",name==="folders");
  tabs.forEach(tab=>{
   const active=tab.dataset.psyTab===name;
   tab.setAttribute("aria-selected",String(active));
   tab.tabIndex=active?0:-1;
  });
  if(name==="settings")syncSettings();
  if(options.updateHash!==false){
   history.replaceState(history.state,"",location.pathname+location.search+"#"+hashes[name]);
  }
  if(options.focus)tabs.find(t=>t.dataset.psyTab===name)?.focus({preventScroll:true});
  if(options.scroll!==false&&root.getBoundingClientRect().top<80){
   root.scrollIntoView({block:"start",behavior:"auto"});
  }
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener("click",()=>switchPane(tab.dataset.psyTab));
  tab.addEventListener("keydown",event=>{
   let index=null;
   if(event.key==="ArrowDown"||event.key==="ArrowRight")index=(i+1)%tabs.length;
   if(event.key==="ArrowUp"||event.key==="ArrowLeft")index=(i+tabs.length-1)%tabs.length;
   if(event.key==="Home")index=0;
   if(event.key==="End")index=tabs.length-1;
   if(index!==null){event.preventDefault();switchPane(tabs[index].dataset.psyTab,{focus:true});}
  });
 });
 window.addEventListener("hashchange",()=>switchPane(fromHash(),{updateHash:false}));
 const form=document.getElementById("psyStudioSettingsForm");
 const theme=document.getElementById("psyStudioTheme");
 const font=document.getElementById("psyStudioFont");
 const motion=document.getElementById("psyStudioMotion");
 const status=document.getElementById("psyStudioSettingsStatus");
 const prefKey="psy-settings-demo";
 function readPreferences(){
  try{const v=JSON.parse(localStorage.getItem(prefKey)||"{}");return v&&typeof v==="object"?v:{}}catch(_){return {}}
 }
 function syncSettings(){
  const p=readPreferences();
  theme.value=document.documentElement.classList.contains("dark")?"dark":"light";
  font.value=["100","110","120"].includes(String(p.font))?String(p.font):"100";
  motion.checked=Boolean(p.motion);
 }
 form?.addEventListener("submit",event=>{
  event.preventDefault();
  const old=readPreferences();
  const next={
   ...old,theme:theme.value,font:font.value,motion:motion.checked
  };
  try{
   localStorage.setItem(prefKey,JSON.stringify(next));
   if(document.documentElement.classList.contains("dark")!==(next.theme==="dark")){
    const button=document.querySelector(".site-theme-btn");
    if(button)button.click();
    else{
     document.documentElement.classList.toggle("dark",next.theme==="dark");
     localStorage.setItem("psyteka-theme",next.theme);
    }
   }else{
    localStorage.setItem("psyteka-theme",next.theme);
   }
   document.documentElement.style.fontSize=next.font+"%";
   document.documentElement.classList.toggle("reduce-motion",next.motion);
   status.textContent="Настройки сохранены.";
  }catch(_){status.textContent="Не удалось сохранить настройки на устройстве.";}
 });
 syncSettings();
 switchPane(fromHash(),{updateHash:false,scroll:false});
})();
