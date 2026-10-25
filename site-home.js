"use strict";
(function(){
 const gate=document.getElementById("testerGate"),site=document.getElementById("siteHome"),form=document.getElementById("gateForm");
 const KEY="psy-public-preview-access",PERIOD=12*60*60*1000;
 const code=document.getElementById("testerCode"),error=document.getElementById("gateError");
 function hasAccess(){try{const v=JSON.parse(localStorage.getItem(KEY)||"null");return!!(v&&typeof v.until==="number"&&v.until>Date.now())}catch(_){return false}}
 function openHome(){try{sessionStorage.setItem("psy-entry-completed","1")}catch(_){}gate.hidden=true;site.hidden=false;document.title="Психотека — методики и материалы";window.scrollTo({top:0,behavior:"instant"});}
 const query=new URLSearchParams(window.location.search);
 const granted=hasAccess();
 // По обычной внешней ссылке сначала всегда открывается экран разработки.
 // Переход назад из библиотеки использует ?home=1 и не заставляет повторять код.
 if(granted&&query.get("home")==="1"){openHome()}
 else if(granted){
  code.hidden=true;code.required=false;
  const label=document.querySelector('label[for="testerCode"]');
  if(label)label.hidden=true;
  const note=document.getElementById("accessRecognized");
  if(note)note.hidden=false;
  form.querySelector('button[type="submit"]').textContent="Перейти на главную →";
 }
 form.addEventListener("submit",event=>{
  event.preventDefault();
  if(!hasAccess()){
   if(code.value.trim().toUpperCase()!=="PSY-2026"){
    error.textContent="Код не подошёл. Проверь написание.";code.focus();return;
   }
   try{localStorage.setItem(KEY,JSON.stringify({until:Date.now()+PERIOD}))}catch(_){}
  }
  error.textContent="";
  openHome();
 });
 const top=document.getElementById("backTop");
 if(top){
  const update=()=>top.classList.toggle("visible",window.scrollY>480);
  document.addEventListener("scroll",update,{passive:true});
  top.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
  update();
 }
 try{const p=JSON.parse(localStorage.getItem("psy-profile-demo")||"{}");const avatar=document.getElementById("homeAvatar");if(avatar)avatar.textContent=(p.name||"Специалист").trim().charAt(0).toUpperCase()||"С"}catch(_){}
})();