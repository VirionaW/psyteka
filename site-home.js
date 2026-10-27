"use strict";
/* Главная Психотеки открыта без кода тестера.
   Вход и выбор ознакомительного доступа – отдельное окно перед библиотекой. */
(function(){
 const home=document.getElementById("siteHome");
 if(!home)return;
 home.hidden=false;
 document.title="Психотека – методики и материалы";
 const top=document.getElementById("backTop");
 if(top){
  const update=()=>top.classList.toggle("visible",window.scrollY>480);
  document.addEventListener("scroll",update,{passive:true});
  top.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
  update();
 }
 // The authenticated avatar is rendered centrally by site-chrome.js.
})();
