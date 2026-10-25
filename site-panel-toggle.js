"use strict";
(function(){
 const body=document.body;
 const sidebar=document.getElementById("sidebar");
 const collapse=document.getElementById("desktopSidebarToggle");
 const expand=document.getElementById("desktopSidebarOpen");
 if(!sidebar||!collapse||!expand)return;
 const KEY="psyteka-sidebar-collapsed",desktop=()=>matchMedia("(min-width:821px)").matches;
 let collapsed=false;
 try{collapsed=localStorage.getItem(KEY)==="1"}catch(_){}
 function render(){
  const hidden=collapsed&&desktop();
  body.classList.toggle("sidebar-collapsed",hidden);
  expand.setAttribute("aria-expanded",String(!hidden));
  collapse.setAttribute("aria-expanded",String(!hidden));
  expand.hidden=!hidden;collapse.hidden=hidden;
  sidebar.setAttribute("aria-hidden",String(hidden));
  if("inert" in sidebar)sidebar.inert=hidden;
 }
 collapse.addEventListener("click",()=>{if(!desktop())return;collapsed=true;render();try{localStorage.setItem(KEY,"1")}catch(_){}expand.focus()});
 expand.addEventListener("click",()=>{if(!desktop())return;collapsed=false;render();try{localStorage.setItem(KEY,"0")}catch(_){}collapse.focus()});
 window.addEventListener("resize",render,{passive:true});
 render();
})();