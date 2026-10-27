"use strict";
(function(){
 const icons={
  moon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.7A8.7 8.7 0 0 1 8.3 3.8 8.8 8.8 0 1 0 20.2 15.7Z"/></svg>',
  sun:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
 };
 function updateTheme(){
  document.querySelectorAll('.site-theme-icon').forEach(el=>{el.innerHTML=icons[document.documentElement.classList.contains('dark')?'sun':'moon'];});
 }
 document.querySelectorAll('.site-theme-btn').forEach(b=>b.addEventListener('click',()=>queueMicrotask(updateTheme)));
 new MutationObserver(updateTheme).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 updateTheme();
 if(!document.body.matches('[data-account="profile"]'))return;
 const root=document.querySelector('.site-account');if(!root)return;
 const identity=window.PSY_IDENTITY;
 let userID=null;
 const key=()=>userID?'psy-collections-v1:'+userID:null;
 const blank=()=>({favorites:[],folders:[]});
 function read(){try{return JSON.parse(localStorage.getItem(key()))||blank()}catch(_){return blank()}}
 function store(data){if(key())localStorage.setItem(key(),JSON.stringify(data))}
 const section=document.createElement('section');section.className='psy-collections-card';section.id='psyCollections';
 section.innerHTML='<h2>Избранные методики и мои папки</h2><p>Сохраняйте нужные методики и объединяйте их в личные подборки. Подборки доступны только на этом устройстве в вашем аккаунте.</p><div class="psy-folder-form"><input id="psyFolderName" placeholder="Название новой папки" maxlength="60" aria-label="Название папки"><button type="button" id="psyFolderCreate">Создать папку</button></div><p id="psyCollectionNotice" role="status"></p><h3>Избранное</h3><ul class="psy-collection-list" id="psyFavorites"></ul><h3>Мои папки</h3><ul class="psy-collection-list" id="psyFolders"></ul>';
 const form=document.getElementById('profileForm');form?.insertAdjacentElement('afterend',section);
 const fav=section.querySelector('#psyFavorites'),folders=section.querySelector('#psyFolders'),notice=section.querySelector('#psyCollectionNotice');
 function methodLink(name){const a=document.createElement('a');a.href='library.html?area=school&method='+encodeURIComponent(name);a.textContent=name;return a}
 function itemRemove(label,fn){const b=document.createElement('button');b.type='button';b.className='psy-remove';b.textContent=label;b.addEventListener('click',fn);return b}
 function render(){
  fav.replaceChildren();folders.replaceChildren();
  if(!userID){notice.textContent='Войдите в аккаунт, чтобы сохранять подборки.';return}
  notice.textContent='';
  const data=read();
  for(const name of data.favorites){const li=document.createElement('li');li.append(methodLink(name),itemRemove('Убрать',()=>{data.favorites=data.favorites.filter(x=>x!==name);store(data);render()}));fav.append(li)}
  if(!data.favorites.length){const li=document.createElement('li');li.textContent='Пока нет избранных методик.';fav.append(li)}
  for(const folder of data.folders){const li=document.createElement('li');const title=document.createElement('strong');title.textContent=folder.name;li.append(title,itemRemove('Удалить папку',()=>{if(!confirm('Удалить папку и ссылки на методики в ней?'))return;data.folders=data.folders.filter(x=>x.id!==folder.id);store(data);render()}));const ul=document.createElement('ul');for(const name of folder.methods){const x=document.createElement('li');x.append(methodLink(name),' ',itemRemove('Убрать',()=>{folder.methods=folder.methods.filter(z=>z!==name);store(data);render()}));ul.append(x)}li.append(ul);if(!folder.methods.length){const msg=document.createElement('p');msg.textContent='Папка пустая. Добавляйте методики из библиотеки.';li.append(msg)}folders.append(li)}
  if(!data.folders.length){const li=document.createElement('li');li.textContent='Создайте первую папку.';folders.append(li)}
 }
 section.querySelector('#psyFolderCreate').addEventListener('click',()=>{
  if(!userID){notice.textContent='Сначала войдите в аккаунт.';return}
  const input=section.querySelector('#psyFolderName'),name=input.value.trim();if(!name)return;
  const d=read();if(d.folders.some(x=>x.name.toLowerCase()===name.toLowerCase())){notice.textContent='Такая папка уже есть.';return}
  d.folders.push({id:String(Date.now())+'-'+Math.random().toString(36).slice(2,7),name,methods:[]});store(d);input.value='';render()
 });
 Promise.resolve(identity?.ready).then(()=>{userID=identity?.user?.id||null;render()});render();
})();
