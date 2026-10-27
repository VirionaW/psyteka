"use strict";
(function(){
 const host=document.getElementById('catalog');if(!host)return;
 let uid=null;
 Promise.resolve(window.PSY_IDENTITY?.ready).then(()=>{uid=window.PSY_IDENTITY?.user?.id||null;enhance()});
 const key=()=>uid?'psy-collections-v1:'+uid:null;
 function read(){try{return JSON.parse(localStorage.getItem(key()))||{favorites:[],folders:[]}}catch(_){return {favorites:[],folders:[]}}}
 function save(d){if(key())localStorage.setItem(key(),JSON.stringify(d))}
 function enhance(){
  for(const card of host.querySelectorAll('article.method')){
   if(card.querySelector('.psy-save-method'))continue;
   const name=card.querySelector('h3')?.textContent?.trim(), actions=card.querySelector('.actions');
   if(!name||!actions)continue;
   const button=document.createElement('button');button.type='button';button.className='btn psy-save-method';button.textContent=uid&&read().favorites.includes(name)?'★ В избранном':'☆ В избранное';
   button.addEventListener('click',()=>{
    if(!uid){alert('Войдите в аккаунт, чтобы сохранить методику.');return}
    const d=read();d.favorites=Array.isArray(d.favorites)?d.favorites:[];
    d.favorites=d.favorites.includes(name)?d.favorites.filter(x=>x!==name):[...d.favorites,name];save(d);
    button.textContent=d.favorites.includes(name)?'★ В избранном':'☆ В избранное';
   });
   actions.append(button);
   const select=document.createElement('select');select.className='psy-save-method';select.setAttribute('aria-label','Добавить методику в папку');
   const option=document.createElement('option');option.value='';option.textContent='В папку...';select.append(option);
   if(uid){for(const folder of (read().folders||[])){const op=document.createElement('option');op.value=folder.id;op.textContent=folder.name;select.append(op)}}
   select.addEventListener('change',()=>{
    if(!uid){alert('Войдите в аккаунт, чтобы пользоваться папками.');select.value='';return}
    const d=read();const folder=(d.folders||[]).find(x=>x.id===select.value);if(folder){folder.methods=folder.methods||[];if(!folder.methods.includes(name))folder.methods.push(name);save(d);select.value='';select.title='Методика сохранена в папке'}
   });actions.append(select);
  }
 }
 new MutationObserver(()=>enhance()).observe(host,{childList:true});
 enhance();
})();
