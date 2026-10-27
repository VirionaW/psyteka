"use strict";
/* Личный кабинет: интерактивное избранное и папки (сохранение прежнего формата).
   Все данные локальны для вошедшего аккаунта; библиотеки и методики не меняем. */
(function(){
 const icons={
  moon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.7A8.7 8.7 0 0 1 8.3 3.8 8.8 8.8 0 1 0 20.2 15.7Z"/></svg>',
  sun:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
 };
 function updateTheme(){
  document.querySelectorAll(".site-theme-icon").forEach(el=>{
   if(el.tagName.toLowerCase()!=="svg")el.innerHTML=icons[document.documentElement.classList.contains("dark")?"sun":"moon"];
  });
 }
 document.querySelectorAll(".site-theme-btn").forEach(b=>b.addEventListener("click",()=>queueMicrotask(updateTheme)));
 new MutationObserver(updateTheme).observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
 updateTheme();
 if(!document.body.matches('[data-account="profile"]'))return;
 const section=document.getElementById("psyCollections");
 if(!section)return;
 const identity=window.PSY_IDENTITY;
 let userID=null,selectedId=null;
 const key=()=>userID?"psy-collections-v1:"+userID:null;
 const blank=()=>({favorites:[],folders:[]});
 // Единая палитра с библиотекой: здесь названия, в хранилище шестнадцатеричный цвет.
 const colorNames={sage:"Шалфей",lilac:"Лаванда",amber:"Песок",rose:"Роза",sky:"Небо",clay:"Терракота"};
 const colorHex={sage:"#4b997b",lilac:"#8c76cf",amber:"#d5a151",rose:"#d77b8c",sky:"#7299c7",clay:"#b78262"};
 const validColor=value=>{
  if(Object.prototype.hasOwnProperty.call(colorHex,value))return value;
  return Object.keys(colorHex).find(name=>colorHex[name]===String(value).toLowerCase())||"sage";
 };
 const colorValue=name=>colorHex[validColor(name)];
 function read(){
  if(!key())return blank();
  try{
   const raw=JSON.parse(localStorage.getItem(key())||"{}");
   return {
    favorites:Array.isArray(raw.favorites)?raw.favorites.filter(x=>typeof x==="string"):[],
    folders:Array.isArray(raw.folders)?raw.folders.filter(f=>f&&typeof f.id==="string"&&typeof f.name==="string").map(f=>({
     ...f,id:f.id,name:f.name,color:f.color||colorHex.sage,description:typeof f.description==="string"?f.description:"",methods:Array.isArray(f.methods)?f.methods.filter(x=>typeof x==="string"):[]
    })):[]
   };
  }catch(_){return blank()}
 }
 function store(data){
  try{if(!key())return false;localStorage.setItem(key(),JSON.stringify(data));return true;}catch(_){return false}
 }
 section.innerHTML=`
  <div class="psy-collection-overview" id="psyCollectionOverview">
   <div class="psy-collection-topline"><span id="psyFolderCount" class="psy-collection-count">0 папок</span></div>
   <h2>Ваши подборки</h2>
   <p class="psy-collection-lead">Свои папки для важных методик. Перелистывайте колесом мыши, стрелками или касанием, открывайте любую папку.</p>
   <form class="psy-folder-form" id="psyFolderForm">
    <input id="psyFolderName" name="folder" placeholder="Название папки" maxlength="60" aria-label="Название новой папки" required>
    <button type="submit">+ Создать</button>
    <fieldset class="psy-folder-palette" id="psyFolderPalette"><legend>Цвет новой папки</legend><div class="psy-folder-palette-options"></div></fieldset>
   </form>
   <div class="psy-folder-search-box">
    <label for="psyFolderSearch">Поиск по папкам и их содержимому</label>
    <input type="search" id="psyFolderSearch" placeholder="Название папки или методики" autocomplete="off">
    <span id="psyFolderSearchCount" role="status" aria-live="polite"></span>
   </div>
   <div class="psy-collection-tools"><h3>Папки</h3><div class="psy-collection-arrows">
    <button type="button" class="psy-scroll-arrow" id="psyFolderPrev" aria-label="Предыдущие папки">‹</button>
    <button type="button" class="psy-scroll-arrow" id="psyFolderNext" aria-label="Следующие папки">›</button>
   </div></div>
   <div class="psy-folder-wheel" id="psyFolders" aria-label="Лента папок" tabindex="0"></div>
   <div class="psy-favorites-wrap">
    <div class="psy-favorites-head"><h3>♡ Избранные методики</h3><span id="psyFavoriteCount">0</span></div>
    <ul id="psyFavorites" class="psy-favorites-list"></ul>
   </div>
  </div>
  <div class="psy-folder-detail" id="psyFolderDetail" hidden>
   <button type="button" class="psy-folder-back" id="psyFolderBack">← Все папки</button>
   <span class="psy-collection-kicker">ЛИЧНАЯ ПОДБОРКА</span>
   <div class="psy-folder-detail-icon" aria-hidden="true"><span class="psy-folder-icon"></span></div>
   <h3 id="psyFolderDetailName" tabindex="-1"></h3>
   <p id="psyFolderDetailDescription" hidden></p>
   <p id="psyFolderDetailCount"></p>
   <fieldset class="psy-folder-palette psy-folder-palette-edit" id="psyFolderPaletteEdit"><legend>Цвет этой папки</legend><div class="psy-folder-palette-options"></div></fieldset>
   <div class="psy-folder-search-box psy-folder-search-inside">
    <label for="psyFolderMethodSearch">Поиск методики в папке</label>
    <input id="psyFolderMethodSearch" type="search" placeholder="Найти в этой папке" autocomplete="off">
   </div>
   <ul id="psyFolderMethods" class="psy-folder-detail-list"></ul>
   <form class="psy-add-favorite" id="psyFolderAddForm">
    <label for="psyFolderFavoriteSelect">Добавить из избранного:</label>
    <select id="psyFolderFavoriteSelect" aria-label="Выберите избранную методику"></select>
    <button type="submit">Добавить</button>
   </form>
   <div class="psy-folder-detail-actions">
    <button type="button" id="psyFolderDelete" class="psy-folder-delete">Удалить папку</button>
    <a class="psy-studio-small-link" href="library.html">Найти методики ↗</a>
   </div>
  </div>
  <p class="psy-collection-notice" id="psyCollectionNotice" role="status" aria-live="polite"></p>
  <dialog id="psyDeleteFolderDialog" class="psy-folder-delete-dialog" aria-labelledby="psyDeleteFolderTitle" aria-describedby="psyDeleteFolderHelp">
   <div class="psy-folder-delete-inner">
    <div class="psy-folder-delete-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M3.5 6h17M9 6V4.5h6V6m-9.5 0 1 13.5c.1 1 1 1.5 2 1.5h7c1 0 1.9-.5 2-1.5L18.5 6M10 10v7m4-7v7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    <h2 id="psyDeleteFolderTitle">Удалить папку?</h2>
    <p class="psy-folder-delete-description">Папка <strong id="psyDeleteFolderName"></strong> и ссылки на методики внутри нее будут удалены.</p>
    <p class="psy-folder-delete-help" id="psyDeleteFolderHelp">Методики в библиотеке и ваше избранное сохранятся.</p>
    <div class="psy-folder-delete-actions">
     <button type="button" id="psyDeleteFolderCancel" class="psy-folder-delete-cancel">Отмена</button>
     <button type="button" id="psyDeleteFolderConfirm" class="psy-folder-delete-confirm">Удалить папку</button>
    </div>
   </div>
  </dialog>`;
 const q=s=>section.querySelector(s);
 const overview=q("#psyCollectionOverview"),detail=q("#psyFolderDetail"),wheel=q("#psyFolders"),fav=q("#psyFavorites"),notice=q("#psyCollectionNotice");
 const prev=q("#psyFolderPrev"),next=q("#psyFolderNext");
 const say=message=>{notice.textContent=message||"";};
 function setupPalette(container,name){
  for(const [color,label] of Object.entries(colorNames)){
   const wrapper=document.createElement("label");wrapper.className="psy-folder-color-choice";wrapper.title=label;
   const input=document.createElement("input");input.type="radio";input.name=name;input.value=color;
   input.setAttribute("aria-label",label);
   if(color==="sage")input.checked=true;
   const dot=document.createElement("span");dot.className="psy-folder-color-swatch";dot.dataset.color=color;
   dot.setAttribute("aria-hidden","true");
   wrapper.append(input,dot);container.append(wrapper);
  }
 }
 setupPalette(q("#psyFolderPalette .psy-folder-palette-options"),"psyFolderColorNew");
 setupPalette(q("#psyFolderPaletteEdit .psy-folder-palette-options"),"psyFolderColorEdit");
 const selectedColor=name=>q('input[name="'+name+'"]:checked')?.value||"sage";
 const foldedText=t=>t.toLocaleLowerCase("ru").trim();
 const methodNoun=n=>n%10===1&&n%100!==11?"методика":n%10>=2&&n%10<=4&&!(n%100>=12&&n%100<=14)?"методики":"методик";
 const openLink=name=>{
  const a=document.createElement("a");
  a.href="library.html?area=school&method="+encodeURIComponent(name);
  a.textContent=name;
  a.title="Найти методику в библиотеке";
  return a;
 };
 const removeButton=(label,action)=>{
  const b=document.createElement("button");b.type="button";b.className="psy-mini-remove";b.textContent=label;b.addEventListener("click",action);return b;
 };
 function updateArrows(){
  const max=Math.max(0,wheel.scrollWidth-wheel.clientWidth);
  prev.disabled=wheel.scrollLeft<3||max<3;
  next.disabled=wheel.scrollLeft>max-3||max<3;
 }
 function paintFolders(data){
  const priorScroll=wheel.scrollLeft;
  const search=foldedText(q("#psyFolderSearch").value);
  const matching=data.folders.filter(f=>!search||foldedText(f.name).includes(search)||f.methods.some(m=>foldedText(m).includes(search)));
  wheel.replaceChildren();
  q("#psyFolderSearchCount").textContent=search?"Найдено папок: "+matching.length:"";
  q("#psyFolderCount").textContent=data.folders.length+" "+(data.folders.length%10===1&&data.folders.length%100!==11?"папка":data.folders.length%10>=2&&data.folders.length%10<=4&&!(data.folders.length%100>=12&&data.folders.length%100<=14)?"папки":"папок");
  if(!matching.length){
   const empty=document.createElement("div");empty.className="psy-folder-empty";
   empty.innerHTML=data.folders.length?"<strong>Совпадений нет</strong><span>Попробуйте другой запрос</span>":"<strong>Здесь появятся ваши папки</strong><span>Создайте первую подборку для методик</span>";
   wheel.appendChild(empty);
  }
  for(const folder of matching){
   const b=document.createElement("button");b.type="button";b.className="psy-folder-tile";b.dataset.folderId=folder.id;b.dataset.folderColor=validColor(folder.color);
   b.setAttribute("aria-label","Открыть папку "+folder.name);
   const icon=document.createElement("span");icon.className="psy-folder-icon";icon.setAttribute("aria-hidden","true");
   const arrow=document.createElement("span");arrow.className="psy-folder-chevron";arrow.textContent="↗";arrow.setAttribute("aria-hidden","true");
   const name=document.createElement("span");name.className="psy-folder-title";name.textContent=folder.name;
   const count=document.createElement("span");count.className="psy-folder-meta";count.textContent=folder.methods.length+" "+methodNoun(folder.methods.length);
   b.append(icon,arrow,name,count);
   b.addEventListener("click",()=>{selectedId=folder.id;q("#psyFolderMethodSearch").value="";render();q("#psyFolderDetailName").focus();});
   wheel.appendChild(b);
  }
  if(search)wheel.scrollLeft=0;
  else wheel.scrollLeft=priorScroll;
  window.requestAnimationFrame(updateArrows);
 }
 function paintFavorites(data){
  fav.replaceChildren();q("#psyFavoriteCount").textContent=String(data.favorites.length);
  if(!data.favorites.length){
   const li=document.createElement("li");li.textContent="Пока пусто. Добавляйте методики в избранное из библиотеки.";
   li.className="psy-collection-empty-note";fav.appendChild(li);return;
  }
  for(const name of data.favorites){
   const li=document.createElement("li");
   li.append(openLink(name),removeButton("Убрать",()=>{
    const d=read();d.favorites=d.favorites.filter(x=>x!==name);
    if(store(d)){say("Методика убрана из избранного.");render();}else say("Не удалось сохранить изменение.");
   }));fav.append(li);
  }
 }
 function paintDetail(data,folder){
  if(!folder){selectedId=null;overview.hidden=false;detail.hidden=true;return;}
  overview.hidden=true;detail.hidden=false;
  q("#psyFolderDetailName").textContent=folder.name;
  const description=q("#psyFolderDetailDescription");
  description.textContent=folder.description||"";
  description.hidden=!folder.description;
  detail.dataset.folderColor=validColor(folder.color);
  q('input[name="psyFolderColorEdit"][value="'+validColor(folder.color)+'"]').checked=true;
  q("#psyFolderDetailCount").textContent=folder.methods.length?"Методик в подборке: "+folder.methods.length:"Папка пока пустая. Добавьте методики из избранного.";
  const list=q("#psyFolderMethods");list.replaceChildren();
  const methodSearch=foldedText(q("#psyFolderMethodSearch").value);
  const visibleMethods=folder.methods.filter(name=>!methodSearch||foldedText(name).includes(methodSearch));
  if(!visibleMethods.length){
   const empty=document.createElement("li");empty.className="psy-collection-empty-note";
   empty.textContent=methodSearch?"По запросу ничего не найдено.":"В папке пока нет методик.";
   list.append(empty);
  }
  for(const name of visibleMethods){
   const li=document.createElement("li");
   li.append(openLink(name),removeButton("Убрать",()=>{
    const d=read(),f=d.folders.find(x=>x.id===selectedId);if(!f)return;
    f.methods=f.methods.filter(x=>x!==name);
    if(store(d)){say("Методика убрана из папки.");render();}else say("Не удалось сохранить изменение.");
   }));list.append(li);
  }
  const select=q("#psyFolderFavoriteSelect");select.replaceChildren();
  const available=data.favorites.filter(name=>!folder.methods.includes(name));
  if(!available.length){
   const opt=document.createElement("option");opt.textContent="Нет новых избранных методик";opt.value="";select.append(opt);
  }else{
   for(const name of available){const opt=document.createElement("option");opt.textContent=name;opt.value=name;select.append(opt);}
  }
  select.disabled=!available.length;q("#psyFolderAddForm button").disabled=!available.length;
 }
 function render(){
  if(!userID){
   overview.hidden=false;detail.hidden=true;wheel.replaceChildren();fav.replaceChildren();
   say("Для сохранения папок войдите в свой аккаунт.");
   q("#psyFolderForm button").disabled=true;q("#psyFolderName").disabled=true;
   updateArrows();return;
  }
  q("#psyFolderForm button").disabled=false;q("#psyFolderName").disabled=false;
  if(notice.textContent==="Для сохранения папок войдите в свой аккаунт.")say("");
  const data=read();
  paintFolders(data);paintFavorites(data);
  const folder=data.folders.find(x=>x.id===selectedId);
  paintDetail(data,folder);
 }
 q("#psyFolderForm").addEventListener("submit",event=>{
  event.preventDefault();if(!userID){say("Войдите в аккаунт.");return;}
  const input=q("#psyFolderName"),name=input.value.trim();if(!name)return;
  const d=read();
  if(d.folders.some(x=>x.name.toLocaleLowerCase("ru")===name.toLocaleLowerCase("ru"))){say("Папка с таким названием уже есть.");return;}
  d.folders.push({id:String(Date.now())+"-"+Math.random().toString(36).slice(2,9),name,color:colorValue(selectedColor("psyFolderColorNew")),description:"",methods:[]});
  if(!store(d)){say("Не удалось сохранить папку в браузере.");return;}
  input.value="";q("#psyFolderSearch").value="";say("Папка создана.");render();
  wheel.scrollTo({left:wheel.scrollWidth,behavior:document.documentElement.classList.contains("reduce-motion")?"auto":"smooth"});
 });
 q("#psyFolderSearch").addEventListener("input",()=>{if(!userID)return;paintFolders(read());});
 q("#psyFolderMethodSearch").addEventListener("input",()=>{if(selectedId&&userID)paintDetail(read(),read().folders.find(f=>f.id===selectedId));});
 q("#psyFolderPaletteEdit").addEventListener("change",event=>{
  if(!event.target.matches('input[name="psyFolderColorEdit"]')||!selectedId||!userID)return;
  const d=read(),folder=d.folders.find(f=>f.id===selectedId);
  if(!folder)return;
  folder.color=colorValue(event.target.value);
  if(store(d)){say("Цвет папки сохранен.");render();}else say("Не удалось сохранить цвет.");
 });
 q("#psyFolderBack").addEventListener("click",()=>{const old=selectedId;selectedId=null;render();wheel.querySelectorAll("[data-folder-id]").forEach(el=>{if(el.dataset.folderId===old)el.focus();});});
 const deleteDialog=q("#psyDeleteFolderDialog");
 const deleteTrigger=q("#psyFolderDelete");
 let folderPendingDeletion=null;
 deleteTrigger.addEventListener("click",()=>{
  const target=read().folders.find(f=>f.id===selectedId);
  if(!target)return;
  folderPendingDeletion=target.id;
  q("#psyDeleteFolderName").textContent="«"+target.name+"»";
  deleteDialog.showModal();
  q("#psyDeleteFolderCancel").focus();
 });
 q("#psyDeleteFolderCancel").addEventListener("click",()=>deleteDialog.close("cancel"));
 q("#psyDeleteFolderConfirm").addEventListener("click",()=>{
  if(!folderPendingDeletion)return;
  const data=read(),target=data.folders.find(f=>f.id===folderPendingDeletion);
  if(!target){deleteDialog.close("cancel");say("Папка уже недоступна.");return;}
  data.folders=data.folders.filter(f=>f.id!==folderPendingDeletion);
  if(!store(data)){say("Не удалось удалить папку.");return;}
  deleteDialog.close("deleted");
  selectedId=null;
  q("#psyFolderMethodSearch").value="";
  say("Папка удалена. Избранное сохранено.");
  render();
  q("#psyFolderName").focus({preventScroll:true});
 });
 deleteDialog.addEventListener("close",()=>{folderPendingDeletion=null;});
 deleteDialog.addEventListener("click",event=>{
  if(event.target===deleteDialog)deleteDialog.close("cancel");
 });
 q("#psyFolderAddForm").addEventListener("submit",event=>{
  event.preventDefault();const name=q("#psyFolderFavoriteSelect").value;if(!name)return;
  const d=read(),f=d.folders.find(x=>x.id===selectedId);
  if(!f||!d.favorites.includes(name))return;
  if(!f.methods.includes(name))f.methods.push(name);
  if(store(d)){say("Добавлено в папку.");render();}else say("Не удалось сохранить изменение.");
 });
 const scroll=dir=>wheel.scrollBy({left:dir*Math.max(215,wheel.clientWidth*.68),behavior:document.documentElement.classList.contains("reduce-motion")?"auto":"smooth"});
 prev.addEventListener("click",()=>scroll(-1));next.addEventListener("click",()=>scroll(1));
 wheel.addEventListener("scroll",updateArrows,{passive:true});
 wheel.addEventListener("wheel",e=>{
  if(!userID||wheel.scrollWidth<=wheel.clientWidth+2||e.ctrlKey)return;
  const movement=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
  const max=wheel.scrollWidth-wheel.clientWidth;
  if((movement>0&&wheel.scrollLeft>=max-2)||(movement<0&&wheel.scrollLeft<=2))return;
  e.preventDefault();wheel.scrollLeft+=movement;
 },{passive:false});
 window.addEventListener("resize",updateArrows,{passive:true});
 window.addEventListener("storage",e=>{if(e.key===key())render();});
 Promise.resolve(identity?.ready).then(()=>{userID=identity?.user?.id||null;render();}).catch(()=>render());
 render();
})();
