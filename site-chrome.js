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
   if(icon){if(icon.tagName?.toLowerCase()==="svg")icon.innerHTML=dark?'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>':'<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13z"/>';else icon.textContent=dark?"☀":"☾";}
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

/* Shared footer feedback and true-centered round close controls. */
(function(){
 function mount(){
  const footer=document.querySelector('footer.psy-account-footer, footer.site-footer, footer.footer, footer');
  if(footer&&!footer.querySelector('.psy-footer-feedback')){
   const block=document.createElement('div');
   block.className='psy-footer-feedback';
   const link=document.createElement('a');
   link.href='suggest-method.html';
   link.textContent='Предложить методику / Сообщить об ошибке';
   block.appendChild(link);
   footer.appendChild(block);
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);
 else mount();
 const style=document.createElement('style');
 style.textContent=`
 .psy-footer-feedback{width:100%;margin-top:12px;padding-top:17px;border-top:1px solid currentColor;text-align:left}
 .psy-footer-feedback a{display:inline-flex;align-items:center;justify-content:center;text-align:center;padding:10px 15px;border:1px solid currentColor;border-radius:12px;color:inherit;font-weight:700;text-decoration:none;font-size:14px;line-height:1.35}
 .psy-footer-feedback a:hover{text-decoration:underline}
 body[data-account] .site-header a.psy-nav-library-highlight{background:#245b46!important;border-color:#245b46!important;color:#fff!important;box-shadow:0 3px 11px rgba(20,57,39,.16)}
 .modalhead>#closeModal,.modalhead>button.close,.psy-folder-dialog .psy-folder-dialog-close,.psy-folder-close,button[aria-label="Закрыть"][class*="round"],button[aria-label="Закрыть"][class*="close"],.psy-modal-close,.modal-close{
  display:inline-flex!important;align-items:center!important;justify-content:center!important;place-items:center!important;
  padding:0!important;text-align:center!important;line-height:1!important;text-indent:0!important;
 }
 .modalhead>#closeModal,.modalhead>button.close{font-size:22px!important}
 .psy-folder-dialog-x,.psy-entry-x,.psy-folder-dialog .psy-folder-dialog-x,.psy-star-remove,.psy-favorite-remove,[class*="remove-favorite"],[class*="favorite-remove"]{display:inline-flex!important;align-items:center!important;justify-content:center!important;padding:0!important;line-height:1!important;text-align:center!important;}
 `;
 document.head.appendChild(style);
})();

/* Centered SVG close icon. No font glyphs or pseudo-element crosses. */
(function(){
 const selector='button#closeModal, button.psy-folder-dialog-x, button.psy-entry-x, button.psy-folder-close, button.psy-modal-close, button.modal-close, button.psy-star-remove, button.psy-favorite-remove, button[class*="favorite-remove"], button[class*="remove-favorite"]';
 const css=document.createElement('style');
 css.textContent=`
 button.psy-svg-close{
  display:inline-flex!important;align-items:center!important;justify-content:center!important;
  padding:0!important;text-align:center!important;line-height:1!important;font-size:0!important;
  text-indent:0!important;position:relative!important;
 }
 button.psy-svg-close::before,button.psy-svg-close::after{content:none!important;display:none!important;background:none!important}
 button.psy-svg-close>svg.psy-close-icon{
  display:block!important;position:static!important;inset:auto!important;
  margin:0!important;padding:0!important;transform:none!important;rotate:none!important;
  width:16px!important;height:16px!important;min-width:16px!important;min-height:16px!important;
  color:inherit!important;fill:none!important;stroke:currentColor!important;
  stroke-width:1.8!important;stroke-linecap:round!important;pointer-events:none!important;
 }
 `;
 document.head.appendChild(css);
 function fix(root){
  const buttons=[];
  if(root.nodeType===1&&root.matches?.(selector))buttons.push(root);
  root.querySelectorAll?.(selector).forEach(b=>buttons.push(b));
  for(const b of buttons){
   if(b.classList.contains('psy-svg-close'))continue;
   // Do not replace meaningful text such as "Удалить" with a close symbol.
   const glyph=b.textContent.trim();
   if(!['×','✕','✖','x','X',''].includes(glyph)&&b.id!=='closeModal')continue;
   b.classList.add('psy-svg-close');
   b.replaceChildren();
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
   svg.setAttribute('viewBox','0 0 24 24');
   svg.setAttribute('aria-hidden','true');
   svg.classList.add('psy-close-icon');
   const path=document.createElementNS('http://www.w3.org/2000/svg','path');
   path.setAttribute('d','M6 6 L18 18 M18 6 L6 18');
   svg.append(path);b.append(svg);
   if(!b.hasAttribute('aria-label'))b.setAttribute('aria-label','Закрыть');
  }
 }
 function ready(){
  fix(document);
  const observer=new MutationObserver(records=>{
   for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1)fix(node);
  });
  observer.observe(document.body,{childList:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});
 else ready();
})();
