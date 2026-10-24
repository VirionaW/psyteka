"use strict";
(function(){
 const gate=document.getElementById('testerGate'), site=document.getElementById('siteHome'),form=document.getElementById('gateForm');
 const KEY='psy-public-preview-access';const PERIOD=12*60*60*1000;
 function hasAccess(){try{const value=JSON.parse(localStorage.getItem(KEY)||'null');return value&&typeof value.until==='number'&&value.until>Date.now()}catch{return false}}
 function open(){gate.hidden=true;site.hidden=false;document.title='Психотека - пространство психолога'}
 if(hasAccess())open();
 form.addEventListener('submit',e=>{e.preventDefault();let code=document.getElementById('testerCode').value.trim().toUpperCase();if(code!=='PSY-2026'){document.getElementById('gateError').textContent='Код не подошел. Проверьте написание.';return}try{localStorage.setItem(KEY,JSON.stringify({until:Date.now()+PERIOD}))}catch{}document.getElementById('gateError').textContent='';open()});
 const b=document.getElementById('backTop');
 function update(){if(b)b.classList.toggle('visible',window.scrollY>480)}document.addEventListener('scroll',update,{passive:true});update();
 if(b)b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
 try{const p=JSON.parse(localStorage.getItem('psy-profile-demo')||'{}');const a=document.getElementById('homeAvatar');if(a)a.textContent=(p.name||'Специалист').trim().slice(0,1).toUpperCase()||'С'}catch{}
})();