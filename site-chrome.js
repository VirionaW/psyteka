"use strict";
(function(){
 const doc=document,root=doc.documentElement,themeKey="psyteka-theme";
 function getTheme(){try{return localStorage.getItem(themeKey)==="dark"?"dark":"light"}catch(_){return "light"}}
 function buttonState(){
  const dark=root.classList.contains("dark");
  doc.querySelectorAll(".site-theme-btn").forEach(btn=>{
   btn.setAttribute("aria-pressed",String(dark));
   btn.setAttribute("aria-label",dark?"Включить светлую тему":"Включить темную тему");
   const icon=btn.querySelector(".site-theme-icon"),label=btn.querySelector(".site-theme-label");
   if(icon)icon.textContent=dark?"☀":"☾";
   if(label)label.textContent=dark?"Светлая тема":"Темная тема";
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
  const identity=window.PSY_IDENTITY;
  const update=state=>{
   const key=state?.avatarKey?.(),pkey=state?.profileKey?.();
   let raw="",name="С";
   try{
    if(key)raw=localStorage.getItem(key)||"";
    if(pkey){const p=JSON.parse(localStorage.getItem(pkey)||"{}");
      name=(p.name||"Специалист").trim().charAt(0).toUpperCase()||"С";}
   }catch(_){}
   const valid=/^data:image\/(?:jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/.test(raw);
   doc.querySelectorAll('a.round-link[href="profile.html"],a.header-avatar[href="profile.html"]').forEach(link=>{
    link.replaceChildren();link.classList.toggle("has-photo",Boolean(key&&valid));
    if(key&&valid){const img=doc.createElement("img");img.src=raw;img.alt="";img.className="psy-user-image";link.appendChild(img);}
    else link.textContent=name;
   });
  };
  if(identity)identity.ready.then(update).catch(()=>update(null));
  else update(null);
 }
 avatar();
 window.addEventListener("psy-profile-change",avatar);
 window.addEventListener("storage",e=>{
  if(e.key===themeKey)applyTheme(getTheme(),false);
  const id=window.PSY_IDENTITY;
  if(id&&(e.key===id.avatarKey()||e.key===id.profileKey()))avatar();
 });
})();