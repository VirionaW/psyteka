"use strict";
/* Temporary preview UI gate. It does NOT protect static files or public GitHub content. */
(function(){
 const root=document.documentElement,key="psyteka-preview-until",hours=8*3600000;
 const hash="61777fdc8c4db3b89f88833deaa6302e80f8fd255107e48ddc7d3d6b4d65c781";
 let active=false;
 try{const until=Number(localStorage.getItem(key)||0);active=until>Date.now()&&until<=Date.now()+hours;if(!active)localStorage.removeItem(key)}catch(_){}
 if(active){root.classList.add("psy-gate-open");return;}
 function gate(){
  if(document.getElementById("psy-preview-gate"))return;
  const node=document.createElement("div");node.id="psy-preview-gate";node.setAttribute("role","main");
  node.innerHTML=[
   '<section class="psy-gate-card" aria-labelledby="psyGateTitle">',
   '<div class="psy-gate-mark"><img src="brand-mark.svg" alt="" width="58" height="58"></div>',
   '<p class="psy-gate-brand"><span class="psy-brand-name-first">Мето</span><span class="psy-brand-name-last">лария</span></p><span class="psy-gate-eyebrow">Закрытая версия сайта</span>',
   '<h1 id="psyGateTitle">Доступ по коду</h1>',
   '<p class="psy-gate-description">Введите код, чтобы открыть Метоларию. Сейчас сайт доступен только участникам тестирования.</p>',
   '<form id="psyGateForm" novalidate><label for="psyGateCode">Код доступа</label><div class="psy-gate-input">',
   '<input id="psyGateCode" type="password" autocomplete="off" spellcheck="false" autocapitalize="none" maxlength="64" placeholder="Введите код" required>',
   '<button class="psy-gate-reveal" id="psyGateReveal" type="button" aria-label="Показать код" aria-pressed="false">Показать</button></div>',
   '<p id="psyGateError" class="psy-gate-error" role="status" aria-live="polite"></p>',
   '<button type="submit" id="psyGateSubmit" class="psy-gate-submit">Войти в Метоларию</button></form>',
   '<p class="psy-gate-note">Если у вас нет кода, обратитесь к владельцу проекта.</p></section>'
  ].join("");
  document.body.appendChild(node);
  const form=node.querySelector("#psyGateForm"),input=node.querySelector("#psyGateCode"),
        toggle=node.querySelector("#psyGateReveal"),button=node.querySelector("#psyGateSubmit"),
        error=node.querySelector("#psyGateError");
  let failures=0,busy=false;
  toggle.onclick=()=>{
   const shown=input.type==="text";input.type=shown?"password":"text";
   toggle.textContent=shown?"Показать":"Скрыть";
   toggle.setAttribute("aria-pressed",String(!shown));toggle.setAttribute("aria-label",shown?"Показать код":"Скрыть код");input.focus();
  };
  input.oninput=()=>{error.textContent=""};
  form.addEventListener("submit",async ev=>{
   ev.preventDefault();if(busy)return;
   const value=input.value.trim();if(!value){error.textContent="Введите код доступа.";input.focus();return}
   busy=true;button.disabled=true;
   try{
    if(!window.crypto?.subtle||!window.TextEncoder)throw Error("HTTPS");
    const bytes=new TextEncoder().encode(value);
    const result=new Uint8Array(await window.crypto.subtle.digest("SHA-256",bytes));
    const digest=Array.from(result,b=>b.toString(16).padStart(2,"0")).join("");
    if(digest!==hash){
     failures++;input.value="";
     error.textContent=failures>=5?"Код не подошел. Попробуйте еще раз позднее.":"Неверный код. Проверьте написание.";
     if(failures>=5)setTimeout(()=>{failures=0;button.disabled=false;error.textContent=""},30000);
     else input.focus();
     return;
    }
    try{localStorage.setItem(key,String(Date.now()+hours))}catch(_){}
    root.classList.add("psy-gate-open");node.remove();
   }catch(_){error.textContent="Не удалось проверить код. Откройте сайт по HTTPS."}
   finally{busy=false;if(failures<5)button.disabled=false}
  });
  input.focus();
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",gate,{once:true});else gate();
})();
