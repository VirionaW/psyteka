"use strict";
/* Визуальная редактура портфолио. Только отображение: не трогаем инструкции,
 * ключи, ответы учеников, вкладки и рабочие кнопки обработки.
 * Серверная защита сохранения: RLS проверяет роли owner/shadow/moderator. */
(function(){
 const SCHEMA=1,ROLES=new Set(["owner","shadow","moderator"]);
 const identity=window.PSY_IDENTITY;
 const client=identity?.client||window.PSY_AUTH_CLIENT;
 const cache=new Map();
 let administrator=false,ready=false,active=null,editor=null,revision=0;
 const blank=()=>({version:SCHEMA,order:[],text:{},custom:[],styles:{}});
 const clone=x=>JSON.parse(JSON.stringify(x));
 const dom=(tag,cls,text)=>{
  const el=document.createElement(tag);
  if(cls)el.className=cls;
  if(text!==undefined)el.textContent=text;
  return el;
 };
 const status=(msg,error=false)=>{
  if(!editor)return;
  editor.info.textContent=msg;
  editor.info.classList.toggle("is-error",error);
 };
 const validLink=value=>{
  const raw=String(value||"").trim();
  if(!raw||raw.length>500)return "";
  try{
   const url=new URL(raw,location.href);
   if(url.protocol!=="https:"&&!(url.protocol==="http:"&&url.origin===location.origin))return "";
   if(raw.startsWith("//")||/^[\s]*javascript:/i.test(raw))return "";
   return url.href;
  }catch(_){return "";}
 };
 function normalized(data){
  const out=blank();
  if(!data||data.version!==1)return out;
  if(Array.isArray(data.order))out.order=[...new Set(data.order.filter(x=>typeof x==="string"&&/^(b[0-9]{1,3}|c[a-z0-9]{3,16})$/.test(x)))].slice(0,80);
  if(data.text&&typeof data.text==="object"&&!Array.isArray(data.text)){
   for(const [id,value] of Object.entries(data.text)){
    if(/^t[0-9]{1,4}$/.test(id)&&typeof value==="string"&&value.length<=2500)out.text[id]=value;
   }
  }
  if(data.styles&&typeof data.styles==="object"&&!Array.isArray(data.styles)){
   for(const [id,style] of Object.entries(data.styles)){
    if(!/^(b[0-9]{1,3}|c[a-z0-9]{3,16})$/.test(id)||!style||typeof style!=="object")continue;
    out.styles[id]={
     align:["left","center","right"].includes(style.align)?style.align:"left",
     width:["100","75","50"].includes(String(style.width))?String(style.width):"100",
     x:Number.isFinite(Number(style.x))?Math.max(-120,Math.min(120,Math.round(Number(style.x)))):0,
     y:Number.isFinite(Number(style.y))?Math.max(-120,Math.min(120,Math.round(Number(style.y)))):0
    };
   }
  }
  if(Array.isArray(data.custom)){
   for(const entry of data.custom.slice(0,25)){
    if(!entry||!/^c[a-z0-9]{3,16}$/.test(String(entry.id||"")))continue;
    if(!["text","button"].includes(entry.type))continue;
    const text=String(entry.text||"").trim().slice(0,1200);
    if(!text)continue;
    const href=entry.type==="button"?validLink(entry.href):"";
    if(entry.type==="button"&&!href)continue;
    if(out.custom.some(x=>x.id===entry.id))continue;
    out.custom.push({id:entry.id,type:entry.type,text,href});
   }
  }
  return out;
 }
 const methodId=m=>String(m?.id||"");
 function isOverview(){
  return !!document.getElementById("modal")&&!document.getElementById("modal").hidden&&
   !!document.querySelector('#methodTabs button[data-tab="overview"].active');
 }
 function findRoot(body){
  return body.querySelector(".psy-portfolio-unified")||
   body.querySelector(".psy-portfolio-reference")||body;
 }
 function plainTargets(root){
  const all=Array.from(root.querySelectorAll("h2,h3,h4,p,strong,span"));
  return all.filter(el=>!el.closest("a,button,label,select,textarea,input,script,style,.psy-v-custom,.psy-owner-published-fields,.psy-visual-toolbar")&&
   !el.querySelector("a,button,input,select,textarea")&&
   el.children.length===0&&el.textContent.trim().length>0);
 }
 function baseElements(root){
  return Array.from(root.children).filter(x=>!x.classList.contains("psy-visual-toolbar")&&
   !x.classList.contains("psy-v-custom")&&!x.classList.contains("psy-visual-add-button"));
 }
 function prepare(context){
  if(context.prepared)return;
  context.prepared=true;
  context.native=baseElements(context.root);
  context.native.forEach((el,i)=>el.dataset.psyVisualBlock="b"+i);
  const targets=plainTargets(context.root);
  context.targets=targets;
  targets.forEach((el,i)=>el.dataset.psyVisualText="t"+i);
 }
 function createCustom(entry){
  const wrapper=dom("div","psy-v-custom psy-v-block");
  wrapper.dataset.psyVisualBlock=entry.id;
  if(entry.type==="button"){
   const a=dom("a","psy-visual-user-button",entry.text);
   a.href=validLink(entry.href)||"library.html";
   a.rel="noopener noreferrer";
   if(new URL(a.href).origin!==location.origin)a.target="_blank";
   wrapper.append(a);
  }else{
   const text=dom("p","psy-visual-user-text",entry.text);wrapper.append(text);
  }
  return wrapper;
 }
 function decorateLayout(context,data){
  const root=context.root;
  // Rebuild only custom blocks; native source markup remains untouched.
  root.querySelectorAll(":scope > .psy-v-custom").forEach(el=>el.remove());
  root.classList.add("psy-v-layout");
  const blocks=new Map(context.native.map(el=>[el.dataset.psyVisualBlock,el]));
  for(const entry of data.custom){
   const node=createCustom(entry);
   blocks.set(entry.id,node);
  }
  for(const [id,node] of blocks){
   const style=data.styles[id]||{align:"left",width:"100"};
   node.style.setProperty("--psy-v-width",style.width+"%");
   node.style.setProperty("--psy-v-x",(style.x||0)+"px");
   node.style.setProperty("--psy-v-y",(style.y||0)+"px");
   node.classList.toggle("psy-v-align-center",style.align==="center");
   node.classList.toggle("psy-v-align-right",style.align==="right");
   node.classList.toggle("psy-v-align-left",style.align==="left");
   node.classList.add("psy-v-layout-block");
   if(context.editing)node.classList.add("psy-v-block");
  }
  const orderedIds=[...data.order.filter(id=>blocks.has(id)),...Array.from(blocks.keys()).filter(id=>!data.order.includes(id))];
  const fragment=document.createDocumentFragment();
  for(const id of orderedIds)fragment.append(blocks.get(id));
  root.append(fragment);
  for(const el of context.targets){
   const key=el.dataset.psyVisualText;
   if(!key)continue;
   if(!context.originalText)context.originalText=new Map();
   if(!context.originalText.has(key))context.originalText.set(key,el.textContent);
   el.textContent=Object.prototype.hasOwnProperty.call(data.text,key)?
    data.text[key]:context.originalText.get(key);
  }
 }
 async function getLayout(id){
  if(cache.has(id))return cache.get(id);
  if(!client)return blank();
  const {data,error}=await client.from("psy_portfolio_layout_live")
   .select("layout").eq("method_id",id).maybeSingle();
  if(error)throw error;
  const result=normalized(data?.layout);
  cache.set(id,result);return result;
 }
 function cleanup(){
  if(!editor)return;
  const context=editor.context;
  context.editing=false;
  context.controller.abort();
  document.getElementById("modal")?.classList.remove("psy-v-edit-mode");
  context.root.classList.remove("psy-visual-editing");
  context.root.querySelectorAll(".psy-v-drag-handle").forEach(el=>el.remove());
  context.root.querySelectorAll(".psy-v-block").forEach(el=>{
   el.classList.remove("psy-v-block","psy-v-selected");
   el.draggable=false;
  });
  context.root.querySelectorAll("[data-psy-visual-text]").forEach(el=>el.classList.remove("psy-v-text-hover"));
  editor.panel.remove();
  editor=null;
 }
 function canLeave(){
  if(!editor)return true;
  if(editor.dirty&&!window.confirm("Есть неопубликованные изменения. Закрыть редактор без сохранения?"))return false;
  leave(false);return true;
 }
 function leave(restore){
  const context=editor?.context;
  cleanup();
  if(restore&&context) {
   // Rebuild original method tab so even a cancelled drag leaves no
   // speculative DOM or stale text; stored layouts are applied again.
   window.PSY_REFRESH_METHOD_OVERVIEW?.();
  }
 }
 function currentIds(context){
  return Array.from(context.root.children).map(x=>x.dataset.psyVisualBlock).filter(Boolean);
 }
 function updateSelection(){
  if(!editor)return;
  const {panel,selection,selectedBlock,selectedText,draft}=editor;
  panel.querySelectorAll("[data-action='up'],[data-action='down'],[data-action='remove'],[data-action='align-left'],[data-action='align-center'],[data-action='align-right'],[data-action='width-100'],[data-action='width-75'],[data-action='width-50'],[data-action='nudge-left'],[data-action='nudge-right'],[data-action='nudge-up'],[data-action='nudge-down']")
   .forEach(b=>b.disabled=!selectedBlock);
  panel.querySelectorAll("[data-action='remove']").forEach(b=>b.disabled=!selectedBlock||!selectedBlock.dataset.psyVisualBlock.startsWith("c"));
  const label=panel.querySelector("#psyVSelected");
  label.textContent=selectedText?"Выбран текст":selectedBlock?"Выбран блок: "+selectedBlock.dataset.psyVisualBlock:"Нажмите на элемент портфолио, чтобы выбрать";
  selection.hidden=!selectedText;
  if(selectedText){
   editor.input.value=selectedText.textContent;
   editor.input.placeholder="Введите текст";
   const id=selectedText.dataset.psyVisualText;
   const count=String(editor.input.value.length);
   panel.querySelector("#psyVTextCount").textContent=count+" / 2500";
  }
  editor.linkGroup.hidden=!selectedBlock||!selectedBlock.dataset.psyVisualBlock.startsWith("c");
  const id=selectedBlock?.dataset.psyVisualBlock;
  const custom=draft.custom.find(x=>x.id===id);
  editor.linkInput.hidden=custom?.type!=="button";
  if(custom){
   editor.linkCaption.value=custom.text;
   editor.linkInput.value=custom.href||"";
  }
  editor.context.root.querySelectorAll(".psy-v-selected").forEach(el=>el.classList.remove("psy-v-selected"));
  selectedBlock?.classList.add("psy-v-selected");
 }
 function markDirty(){
  if(!editor)return;
  editor.dirty=true;
  status("Не сохранено. Нажмите «Опубликовать», чтобы изменения увидели остальные.");
 }
 function choose(el){
  if(!editor)return;
  const {context}=editor;
  const nativeText=el.closest("[data-psy-visual-text]");
  const block=el.closest("[data-psy-visual-block]");
  if(block&&!context.root.contains(block))return;
  editor.selectedBlock=block;
  editor.selectedText=nativeText&&context.root.contains(nativeText)?nativeText:null;
  updateSelection();
 }
 function applyDraft(){
  if(!editor)return;
  const context=editor.context;
  decorateLayout(context,editor.draft);
  attachHandles(context);
  const id=editor.selectedBlock?.dataset.psyVisualBlock;
  if(id)editor.selectedBlock=context.root.querySelector('[data-psy-visual-block="'+id+'"]');
  updateSelection();
 }
 function attachHandles(context){
  const blocks=Array.from(context.root.children).filter(el=>el.dataset.psyVisualBlock);
  for(const block of blocks){
   block.classList.add("psy-v-block");
   block.draggable=true;
   if(!block.querySelector(":scope > .psy-v-drag-handle")){
    const handle=dom("button","psy-v-drag-handle","⠿");
    handle.type="button";handle.title="Выбрать блок для перемещения";
    handle.setAttribute("aria-label","Выбрать блок для перемещения");
    handle.addEventListener("click",ev=>{ev.preventDefault();ev.stopPropagation();choose(block)});
    block.prepend(handle);
   }
  }
 }
 async function publish(data,restore=false){
  if(!editor||editor.busy)return;
  const {context}=editor;
  const safe=normalized(data);
  if(JSON.stringify(safe).length>28000){status("Слишком большой макет. Уберите часть элементов.",true);return}
  editor.busy=true;
  const publishButton=editor.panel.querySelector('[data-action="publish"]');
  publishButton.disabled=true;status("Сохраняем макет...");
  try{
   const {error}=await client.from("psy_portfolio_layout_versions")
    .insert({method_id:methodId(context.method),layout:safe});
   if(error)throw error;
   cache.set(methodId(context.method),safe);
   status(restore?"Предыдущая версия восстановлена.":"Опубликовано. Макет сохранен в истории.");
   leave(false);
   window.PSY_REFRESH_METHOD_OVERVIEW?.();
  }catch(err){
   publishButton.disabled=false;
   status("Не удалось сохранить: "+(err?.message||"Ошибка соединения"),true);
   editor.busy=false;
  }
 }
 async function loadHistory(){
  if(!editor)return;
  const {context,history}=editor;
  history.replaceChildren(dom("p",null,"Загружаем историю..."));
  const {data,error}=await client.from("psy_portfolio_layout_versions")
   .select("id,created_at,layout").eq("method_id",methodId(context.method)).order("id",{ascending:false}).limit(15);
  if(!editor||editor.context!==context)return;
  history.replaceChildren();
  if(error){history.append(dom("p",null,"Не удалось получить версии."));return}
  if(!data?.length){history.append(dom("p",null,"Опубликованных изменений пока нет."));return}
  for(const v of data){
   const line=dom("div","psy-v-history-row");
   const date=new Date(v.created_at);
   const label=dom("span",null,Number.isNaN(date.getTime())?"Версия "+v.id:
    new Intl.DateTimeFormat("ru-RU",{dateStyle:"short",timeStyle:"short"}).format(date));
   const btn=dom("button",null,"Вернуть");
   btn.type="button";btn.title="Опубликовать эту версию повторно";
   btn.addEventListener("click",()=>{
    if(window.confirm("Восстановить выбранную версию макета? Текущая версия останется в истории."))void publish(v.layout,true);
   });
   line.append(label,btn);history.append(line);
  }
 }
 function start(context){
  if(!administrator||!isOverview())return;
  cleanup();
  context.editing=true;
  context.controller=new AbortController();
  const draft=normalized(context.saved);
  const panel=dom("aside","psy-v-panel");
  panel.setAttribute("aria-label","Панель визуального редактирования");
  const head=dom("div","psy-v-panel-heading");
  head.append(dom("strong",null,"Редактор портфолио"),dom("span",null,"Режим предпросмотра"));
  const close=dom("button","psy-v-panel-close","×");close.type="button";close.setAttribute("aria-label","Отменить редактирование");head.append(close);
  const selection=dom("div","psy-v-selection");
  const textLabel=dom("label",null,"Текст выбранного элемента");
  const input=dom("textarea");input.rows=3;input.maxLength=2500;
  const counter=dom("small",null,"0 / 2500");counter.id="psyVTextCount";
  textLabel.append(input,counter);selection.append(textLabel);
  const linkGroup=dom("div","psy-v-link-fields");
  const linkCaption=dom("input");linkCaption.maxLength=1200;linkCaption.placeholder="Надпись элемента";
  const linkInput=dom("input");linkInput.placeholder="https://... или /страница.html";linkInput.maxLength=500;
  const linkLabel=dom("label",null,"Текст добавленного элемента");linkLabel.append(linkCaption);
  const urlLabel=dom("label",null,"Адрес ссылки");urlLabel.append(linkInput);
  linkGroup.append(linkLabel,urlLabel);
  const selected=dom("p","psy-v-selected-label","Выберите элемент портфолио");selected.id="psyVSelected";
  const toolbar=dom("div","psy-v-tool-grid");
  const buttons=[
   ["add-text","＋ Текст"],["add-button","＋ Кнопка"],
   ["up","↑ Выше"],["down","↓ Ниже"],
   ["align-left","⇤ Слева"],["align-center","↔ По центру"],["align-right","⇥ Справа"],
   ["width-100","100%"],["width-75","75%"],["width-50","50%"],
   ["nudge-left","← 8 px"],["nudge-right","8 px →"],
   ["nudge-up","↑ 8 px"],["nudge-down","8 px ↓"],
   ["remove","Удалить блок"],["reset","Исходный макет"]
  ];
  for(const [action,label] of buttons){
   const b=dom("button",null,label);b.type="button";b.dataset.action=action;toolbar.append(b);
  }
  const info=dom("p","psy-v-info");info.setAttribute("role","status");info.setAttribute("aria-live","polite");
  const actions=dom("div","psy-v-bottom");
  const publishButton=dom("button","psy-v-primary","Опубликовать");publishButton.type="button";publishButton.dataset.action="publish";
  const cancel=dom("button",null,"Отмена");cancel.type="button";cancel.dataset.action="cancel";
  actions.append(publishButton,cancel);
  const historyTitle=dom("h3",null,"История оформления");
  const history=dom("div","psy-v-history");
  panel.append(head,selected,selection,linkGroup,toolbar,info,actions,historyTitle,history);
  document.getElementById("modal").append(panel);
  document.getElementById("modal").classList.add("psy-v-edit-mode");
  editor={context,panel,selection,input,linkGroup,linkCaption,linkInput,history,
   selectedBlock:null,selectedText:null,draft,info,busy:false,dirty:false};
  context.root.classList.add("psy-visual-editing");
  attachHandles(context);
  close.addEventListener("click",()=>leave(true));
  cancel.addEventListener("click",()=>leave(true));
  input.addEventListener("input",()=>{
   if(!editor?.selectedText)return;
   const el=editor.selectedText,id=el.dataset.psyVisualText;
   const next=input.value.slice(0,2500);
   editor.draft.text[id]=next;el.textContent=next;
   counter.textContent=next.length+" / 2500";
   markDirty();
  });
  linkCaption.addEventListener("input",()=>{
   const item=editor?.draft.custom.find(x=>x.id===editor.selectedBlock?.dataset.psyVisualBlock);
   if(!item)return;
   item.text=linkCaption.value.slice(0,1200);
   const node=editor.selectedBlock.querySelector("a,p");
   if(node)node.textContent=item.text;
   markDirty();
  });
  linkInput.addEventListener("change",()=>{
   const item=editor?.draft.custom.find(x=>x.id===editor.selectedBlock?.dataset.psyVisualBlock);
   if(!item||item.type!=="button")return;
   const link=validLink(linkInput.value);
   if(!link){status("Разрешены только безопасные ссылки HTTPS или страницы Метоларии.",true);return}
   item.href=link;editor.selectedBlock.querySelector("a").href=link;markDirty();
  });
  toolbar.addEventListener("click",e=>{
   const action=e.target.closest("button[data-action]")?.dataset.action;
   if(!action||!editor)return;
   const selectedBlock=editor.selectedBlock;
   const id=selectedBlock?.dataset.psyVisualBlock;
   if(action==="add-text"||action==="add-button"){
    if(editor.draft.custom.length>=25){status("Допускается не более 25 добавленных блоков.",true);return}
    const fresh="c"+Math.random().toString(36).slice(2,11);
    const entry={id:fresh,type:action==="add-text"?"text":"button",
     text:action==="add-text"?"Новый текст":"Новая кнопка",
     href:action==="add-button"?location.origin+"/library.html":""};
    editor.draft.custom.push(entry);
    editor.draft.order=currentIds(context).concat(entry.id);
    applyDraft();
    editor.selectedBlock=context.root.querySelector('[data-psy-visual-block="'+entry.id+'"]');
    editor.selectedText=null;updateSelection();markDirty();
    return;
   }
   if(action==="reset"){
    if(!window.confirm("Сбросить оформление к исходному виду? После публикации его можно восстановить из истории."))return;
    editor.draft=blank();applyDraft();markDirty();return;
   }
   if(!id)return;
   if(action==="remove"){
    editor.draft.custom=editor.draft.custom.filter(x=>x.id!==id);
    editor.draft.order=currentIds(context).filter(x=>x!==id);
    editor.selectedBlock=null;applyDraft();markDirty();return;
   }
   if(action==="up"||action==="down"){
    const order=currentIds(context);
    const at=order.indexOf(id),other=at+(action==="up"?-1:1);
    if(at<0||other<0||other>=order.length)return;
    [order[at],order[other]]=[order[other],order[at]];
    editor.draft.order=order;applyDraft();markDirty();return;
   }
   if(action.startsWith("align-")||action.startsWith("width-")||action.startsWith("nudge-")){
    const style=editor.draft.styles[id]||{align:"left",width:"100",x:0,y:0};
    if(action.startsWith("align-"))style.align=action.replace("align-","");
    else if(action.startsWith("width-"))style.width=action.replace("width-","");
    else{
     const direction=action.replace("nudge-","");
     const axis=direction==="left"||direction==="right"?"x":"y";
     const sign=direction==="left"||direction==="up"?-1:1;
     style[axis]=Math.max(-120,Math.min(120,(style[axis]||0)+sign*8));
    }
    editor.draft.styles[id]=style;applyDraft();markDirty();
   }
  });
  panel.addEventListener("click",e=>{
   const action=e.target.closest("button[data-action]")?.dataset.action;
   if(action==="publish")void publish({...editor.draft,order:currentIds(context)});
   if(action==="cancel")leave(true);
  });
  // Selection through the actual portfolio, including native text.
  const selectClick=e=>{
   if(!editor||editor.context!==context)return;
   if(e.target.closest("a,button")&&!e.target.closest(".psy-v-drag-handle"))e.preventDefault();
   choose(e.target);
  };
  context.root.addEventListener("click",selectClick,{signal:context.controller.signal});
  context.root.addEventListener("dragstart",e=>{
   const block=e.target.closest("[data-psy-visual-block]");
   if(!block)return;
   e.dataTransfer?.setData("text/plain",block.dataset.psyVisualBlock);
   if(e.dataTransfer)e.dataTransfer.effectAllowed="move";
  },{signal:context.controller.signal});
  context.root.addEventListener("dragover",e=>{
   if(e.target.closest("[data-psy-visual-block]"))e.preventDefault();
  },{signal:context.controller.signal});
  context.root.addEventListener("drop",e=>{
   const target=e.target.closest("[data-psy-visual-block]");
   const from=e.dataTransfer?.getData("text/plain");
   if(!target||!from||target.dataset.psyVisualBlock===from)return;
   e.preventDefault();
   const order=currentIds(context),old=order.indexOf(from),next=order.indexOf(target.dataset.psyVisualBlock);
   if(old<0||next<0)return;
   order.splice(old,1);order.splice(next,0,from);
   editor.draft.order=order;applyDraft();markDirty();
  },{signal:context.controller.signal});
  updateSelection();
  status("Выберите текст для правки, перетащите блок мышью или используйте стрелки. Рабочие кнопки обработки защищены.");
  void loadHistory();
 }
 async function onRender(method,body){
  if(!method||!body)return;
  const id=methodId(method);
  if(!id||!isOverview())return;
  if(editor){editor.context.controller.abort();cleanup();}
  const token=++revision;
  const context={method,body,root:findRoot(body),saved:blank(),controller:new AbortController(),editing:false};
  active=context;
  prepare(context);
  try{
   const saved=await getLayout(id);
   if(token!==revision||active!==context||!isOverview()||!body.isConnected)return;
   context.saved=clone(saved);
   decorateLayout(context,context.saved);
  }catch(_){
   if(token!==revision||active!==context||!body.isConnected)return;
   // Keep the original published portfolio if layouts cannot be loaded.
  }
  try{await Promise.resolve(identity?.ready)}catch(_){}
  if(!administrator||token!==revision||!isOverview()||!body.isConnected)return;
  const bar=dom("div","psy-visual-toolbar");
  const b=dom("button","psy-visual-entry","✎ Редактировать");
  b.type="button";b.setAttribute("aria-label","Открыть визуальный редактор портфолио");
  const note=dom("span",null,"Текст · блоки · кнопки");
  bar.append(b,note);body.prepend(bar);
  b.addEventListener("click",()=>start(context));
 }
 if(identity?.ready){
  Promise.resolve(identity.ready).then(()=>{
   administrator=!!identity.user?.email_confirmed_at&&ROLES.has(identity.role);
   ready=true;
  }).catch(()=>{ready=true});
 }
 window.PSY_PORTFOLIO_VISUAL={onRender,canLeave,canEdit:()=>administrator,reset:()=>{cache.clear()}};
})();
