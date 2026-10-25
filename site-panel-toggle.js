"use strict";
(function(){
 const body=document.body,btn=document.getElementById("desktopSidebarToggle"),sidebar=document.getElementById("sidebar");
 if(!body.classList.contains("library-page")||!btn||!sidebar)return;
 const KEY="psyteka-sidebar-collapsed";
 const isDesktop=()=>window.matchMedia("(min-width:821px)").matches;
 function update(collapsed){
  body.classList.toggle("sidebar-collapsed",collapsed);
  btn.setAttribute("aria-expanded",String(!collapsed));
  btn.setAttribute("aria-label",collapsed?"Показать боковую панель":"Скрыть боковую панель");
  btn.title=collapsed?"Показать боковую панель":"Скрыть боковую панель";
  const label=btn.querySelector(".desktop-sidebar-toggle-label"),icon=btn.querySelector(".desktop-sidebar-toggle-icon");
  if(label)label.textContent=collapsed?"Показать меню":"Скрыть меню";
  if(icon)icon.textContent=collapsed?"☰":"◧";
  sidebar.setAttribute("aria-hidden",String(collapsed&&isDesktop()));
  if("inert" in sidebar)sidebar.inert=collapsed&&isDesktop();
 }
 let collapsed=false;
 try{collapsed=localStorage.getItem(KEY)==="1"}catch(_){}
 update(collapsed);
 btn.addEventListener("click",()=>{
  if(!isDesktop())return;
  collapsed=!collapsed;
  update(collapsed);
  try{localStorage.setItem(KEY,collapsed?"1":"0")}catch(_){}
 });
 window.addEventListener("resize",()=>update(collapsed),{passive:true});
})();