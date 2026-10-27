"use strict";
(function(){
 const host=document.getElementById('catalog'),modal=document.getElementById('modal');
 if(!host)return;
 let uid=null, active=null;
 const key=()=>uid?'psy-collections-v1:'+uid:null;
 const read=()=>{try{const d=JSON.parse(localStorage.getItem(key()));return {favorites:Array.isArray(d?.favorites)?d.favorites:[],folders:Array.isArray(d?.folders)?d.folders:[]}}catch(_){return {favorites:[],folders:[]}}};
 const save=d=>{if(key())localStorage.setItem(key(),JSON.stringify(d))};
 const star='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.7 2.85 5.88 6.48.94-4.69 4.57 1.11 6.45L12 17.5l-5.75 3.04 1.1-6.45-4.68-4.57 6.48-.94L12 2.7Z"/></svg>';
 let pop=document.createElement('div');pop.className='psy-star-pop';pop.hidden=true;pop.setAttribute('role','dialog');pop.setAttribute('aria-label','Сохранить методику');document.body.append(pop);
 function close(){pop.hidden=true;active=null}
 function open(name,button){
  if(!uid){pop.replaceChildren();const p=document.createElement('p');p.textContent='Войдите в аккаунт, чтобы сохранять методики.';const a=document.createElement('a');a.href='profile.html';a.textContent='Перейти в профиль';pop.append(p,a);place(button);return}
  active={name,button};const d=read();pop.replaceChildren();
  const h=document.createElement('strong');h.textContent='Сохранить методику';pop.append(h);
  const label=document.createElement('label');label.className='psy-star-option';const cb=document.createElement('input');cb.type='checkbox';cb.checked=d.favorites.includes(name);
  cb.addEventListener('change',()=>{const v=read();v.favorites=cb.checked?[...new Set([...v.favorites,name])]:v.favorites.filter(x=>x!==name);save(v);updateStars()});label.append(cb,document.createTextNode(' Избранное'));pop.append(label);
  const sub=document.createElement('div');sub.className='psy-star-sub';sub.textContent='Добавить в папки';pop.append(sub);
  if(!d.folders.length){const p=document.createElement('p');p.textContent='Папок пока нет. Создайте первую ниже.';pop.append(p)}
  for(const folder of d.folders){const row=document.createElement('label');row.className='psy-star-option';const ck=document.createElement('input');ck.type='checkbox';ck.checked=(folder.methods||[]).includes(name);ck.addEventListener('change',()=>{const v=read(),f=v.folders.find(x=>x.id===folder.id);if(!f)return;f.methods=f.methods||[];f.methods=ck.checked?[...new Set([...f.methods,name])]:f.methods.filter(x=>x!==name);save(v);updateStars()});row.append(ck,document.createTextNode(' '+folder.name));pop.append(row)}
  const create=document.createElement('button');create.type='button';create.className='psy-star-create';create.textContent='+ Новая папка';create.onclick=()=>{const nameNew=prompt('Название новой папки');if(!nameNew?.trim())return;const v=read(),clean=nameNew.trim().slice(0,60);if(!v.folders.some(x=>x.name.toLowerCase()===clean.toLowerCase())){v.folders.push({id:String(Date.now()),name:clean,methods:[name]});save(v)}open(name,button)};pop.append(create);
  place(button);
 }
 function place(button){pop.hidden=false;const rect=button.getBoundingClientRect(),w=288;pop.style.left=Math.max(10,Math.min(window.innerWidth-w-10,rect.right-w))+'px';pop.style.top=Math.min(window.innerHeight-35,rect.bottom+9)+'px'}
 function make(name,mode){const btn=document.createElement('button');btn.type='button';btn.className='psy-star-trigger '+mode;btn.innerHTML=star;btn.title='Избранное и папки';btn.setAttribute('aria-label','Сохранить «'+name+'» в избранное или папку');btn.onclick=e=>{e.stopPropagation();if(!pop.hidden&&active?.button===btn)close();else open(name,btn)};return btn}
 function updateStars(){document.querySelectorAll('.psy-star-trigger').forEach(b=>{const n=b.dataset.method;const d=read();b.classList.toggle('is-saved',d.favorites.includes(n)||d.folders.some(f=>(f.methods||[]).includes(n)))})}
 function enhance(){for(const card of host.querySelectorAll('article.method')){const name=card.querySelector('h3')?.textContent?.trim();if(!name||card.querySelector('.psy-star-trigger'))continue;card.querySelectorAll('.psy-save-method').forEach(x=>x.remove());let b=make(name,'card-star');b.dataset.method=name;card.append(b)}updateStars()}
 function modalStar(){if(!modal||modal.hidden)return;const header=modal.querySelector('.modalhead');if(!header)return;const name=document.getElementById('modalTitle')?.textContent?.trim();if(!name)return;const old=header.querySelector('.psy-star-trigger');if(old&&old.dataset.method===name)return;old?.remove();const b=make(name,'modal-star');b.dataset.method=name;header.insertBefore(b,document.getElementById('closeModal'));updateStars()}
 new MutationObserver(enhance).observe(host,{childList:true});
 if(modal)new MutationObserver(modalStar).observe(modal,{attributes:true,attributeFilter:['hidden'],childList:true,subtree:false});
 document.addEventListener('click',e=>{if(!pop.contains(e.target)&&!e.target.closest('.psy-star-trigger'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 window.addEventListener('resize',close);
 Promise.resolve(window.PSY_IDENTITY?.ready).then(()=>{uid=window.PSY_IDENTITY?.user?.id||null;enhance();modalStar()});enhance();modalStar();
})();
