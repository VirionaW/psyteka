"use strict";
(function(){
 const doc=document,root=doc.documentElement,themeKey="psyteka-theme",avatarKey="psy-avatar-demo";
 function getTheme(){try{return localStorage.getItem(themeKey)==="dark"?"dark":"light"}catch(_){return "light"}}
 function buttonState(){
  const dark=root.classList.contains("dark");
  doc.querySelectorAll(".site-theme-btn").forEach(btn=>{
   btn.setAttribute("aria-pressed",String(dark));
   btn.setAttribute("aria-label",dark?"Включить светлую тему":"Включить тёмную тему");
   const icon=btn.querySelector(".site-theme-icon"),label=btn.querySelector(".site-theme-label");
   if(icon)icon.textContent=dark?"☀":"☾";
   if(label)label.textContent=dark?"Светлая тема":"Тёмная тема";
  });
  const meta=doc.querySelector('meta[name="theme-color"]');
  if(meta)meta.content=dark?"#152826":"#28534a";
 }
 function applyTheme(mode,save){
  root.classList.toggle("dark",mode==="dark");
  if(save){
   try{
    localStorage.setItem(themeKey,mode);
    const settings=JSON.parse(localStorage.getItem("psy-settings-demo")||"{}");
    settings.theme=mode;
    localStorage.setItem("psy-settings-demo",JSON.stringify(settings));
   }catch(_){}
  }
  buttonState();
 }
 applyTheme(getTheme(),false);
 doc.querySelectorAll(".site-theme-btn").forEach(btn=>btn.addEventListener("click",()=>applyTheme(root.classList.contains("dark")?"light":"dark",true)));
 // Оставляем переключатель библиотеки синхронным с общей настройкой.
 const librarySwitch=doc.getElementById("themeBtn");
 if(librarySwitch)librarySwitch.addEventListener("click",()=>{try{
  const mode=root.classList.contains("dark")?"dark":"light";
  const prefs=JSON.parse(localStorage.getItem("psy-settings-demo")||"{}");
  prefs.theme=mode;localStorage.setItem("psy-settings-demo",JSON.stringify(prefs));
 }catch(_){}},false);
 function avatar(){
  let raw="";
  try{raw=localStorage.getItem(avatarKey)||""}catch(_){}
  const valid=/^data:image\/(?:jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/.test(raw);
  let name="С";
  try{const p=JSON.parse(localStorage.getItem("psy-profile-demo")||"{}");name=(p.name||"Специалист").trim().charAt(0).toUpperCase()||"С"}catch(_){}
  doc.querySelectorAll('a.round-link[href="profile.html"],a.header-avatar[href="profile.html"]').forEach(link=>{
   link.textContent="";
   link.classList.toggle("has-photo",valid);
   if(valid){const img=doc.createElement("img");img.src=raw;img.alt="";img.className="psy-user-image";link.appendChild(img)}
   else link.textContent=name;
  });
 }
 avatar();
 window.addEventListener("psy-profile-change",avatar);
 window.addEventListener("storage",e=>{if(e.key===themeKey)applyTheme(getTheme(),false);if(e.key===avatarKey||e.key==="psy-profile-demo")avatar()});
})();