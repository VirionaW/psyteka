"use strict";
/* Temporary admin-only development annotation tool.
   No page content, input values, child records or auth tokens are transmitted.
   A site annotation is NOT an automatic command to the ChatGPT conversation. */
(async function(){
 const identity=window.PSY_IDENTITY;
 if(!identity?.client)return;
 try{await identity.ready}catch(_){return}
 if(!identity.user?.email_confirmed_at||!["owner","shadow","moderator"].includes(identity.role))return;
 const client=identity.client,FLAG="psy-dev-mark-mode-v1";
 const escCSS=value=>window.CSS?.escape?CSS.escape(value):String(value).replace(/[^a-zA-Z0-9_-]/g,"\\$&");
 const el=(tag,cl,content)=>{
  const e=document.createElement(tag);
  if(cl)e.className=cl;
  if(content!==undefined)e.textContent=content;
  return e;
 };
 const app=el("div","psy-dev-widget");
 app.id="psyDevWidget";app.dataset.psyDevUi="true";
 const toolbar=el("div","psy-dev-toolbar");
 const main=el("button","psy-dev-mode","Показать Артему");
 const chooseBtn=el("button","psy-dev-pick","Выделить элемент");
 const list=el("a","psy-dev-tasks","Задачи");
 list.href="dev-review.html";list.target="_blank";list.rel="noopener noreferrer";
 const hint=el("p","psy-dev-hint");
 const panel=el("section","psy-dev-panel");
 panel.hidden=true;
 panel.setAttribute("aria-label","Отправить замечание о выбранном элементе");
 const title=el("h3",null,"Что здесь изменить?");
 const subtitle=el("p","psy-dev-target");
 const selectedHeader=el("div","psy-dev-selection-heading");
 const selectedCount=el("strong",null,"Выбранные элементы: 0");
 const addMore=el("button","psy-dev-add-more","＋ Добавить элемент");
 const clearAll=el("button","psy-dev-clear-all","Очистить");
 addMore.type="button";clearAll.type="button";
 selectedHeader.append(selectedCount,addMore,clearAll);
 const selectedList=el("div","psy-dev-selection-list");
 selectedList.setAttribute("aria-live","polite");
 const noteLabel=el("label",null,"Комментарий для Артема");
 const note=el("textarea");
 note.rows=4;note.maxLength=3000;note.placeholder="Например: перемести эту кнопку вправо и не изменяй другие блоки";
 noteLabel.append(note);
 const screenshotLabel=el("label","psy-dev-file", "Скриншот (необязательно, PNG / JPG / WebP до 3 МБ)");
 const screenshot=el("input");
 screenshot.type="file";screenshot.accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp";
 screenshotLabel.append(screenshot);
 const warning=el("p","psy-dev-privacy","Не отправляй сюда заполненные бланки, ФИО и результаты детей. Снимок доступен только администрации.");
 const status=el("p","psy-dev-status");status.setAttribute("role","status");status.setAttribute("aria-live","polite");
 const actions=el("div","psy-dev-panel-actions");
 const submit=el("button","psy-dev-send","Сохранить замечание");
 const cancel=el("button","psy-dev-cancel","Отмена");
 const copy=el("button","psy-dev-copy","Скопировать задачу для Артема");
 copy.hidden=true;
 const removeTask=el("button","psy-dev-delete-task","Удалить задачу");
 removeTask.type="button";removeTask.hidden=true;
 actions.append(submit,cancel,copy,removeTask);
 panel.append(title,subtitle,selectedHeader,selectedList,noteLabel,screenshotLabel,warning,status,actions);
 toolbar.append(main,chooseBtn,list);
 app.append(toolbar,hint,panel);
 document.body.append(app);
 const highlight=el("div","psy-dev-outline");
 highlight.hidden=true;highlight.dataset.psyDevUi="true";
 document.body.append(highlight);
 let enabled=false,picking=false,locationInfo=null,latestId=null,latestScreenshotPath=null,submitting=false;
 const selectedTargets=[];
 const overlays=[highlight];
 let drawing=false;
 function setStatus(t,error=false){status.textContent=t;status.classList.toggle("is-error",error)}
 const modal=document.getElementById("modal");
 function allowedTarget(node){
  if(!(node instanceof Element))return null;
  if(node.closest("[data-psy-dev-ui],#psy-preview-gate,script,style"))return null;
  const picked=node.closest("button,a,h1,h2,h3,h4,p,td,th,label,section,article,div,span,img,svg")||node;
  if(picked===document.documentElement||picked===document.body)return null;
  return picked;
 }
 function selectorFor(element){
  if(element.id&&element.id.length<80)return "#"+escCSS(element.id);
  const parts=[];
  for(let node=element;node&&node!==document.body&&parts.length<7;node=node.parentElement){
   let part=node.tagName.toLowerCase();
   if(node.id&&node.id.length<80){parts.unshift("#"+escCSS(node.id));break}
   const classes=Array.from(node.classList)
    .filter(s=>/^[a-zA-Z][a-zA-Z0-9_-]{2,48}$/.test(s)&&!/^is-|^active$|^selected$|^psy-v-|^psy-dev-/.test(s)).slice(0,2);
   if(classes.length)part+="."+classes.map(escCSS).join(".");
   const siblings=node.parentElement?Array.from(node.parentElement.children).filter(s=>s.tagName===node.tagName):[];
   if(siblings.length>1)part+=":nth-of-type("+(siblings.indexOf(node)+1)+")";
   parts.unshift(part);
  }
  return parts.join(" > ").slice(0,600);
 }
 function showHighlights(){
  const active=enabled&&selectedTargets.length>0;
  while(overlays.length<selectedTargets.length){
   const frame=el("div","psy-dev-outline");frame.dataset.psyDevUi="true";
   document.body.append(frame);overlays.push(frame);
  }
  for(let i=0;i<overlays.length;i++){
   const frame=overlays[i],node=selectedTargets[i]?.element;
   if(!active||!node?.isConnected){frame.hidden=true;continue}
   const r=node.getBoundingClientRect();
   if(r.width<=0||r.height<=0){frame.hidden=true;continue}
   Object.assign(frame.style,{
    left:Math.round(r.left)+"px",top:Math.round(r.top)+"px",
    width:Math.round(r.width)+"px",height:Math.round(r.height)+"px"
   });
   frame.hidden=false;
  }
 }
 function scheduleHighlights(){
  if(drawing)return;
  drawing=true;
  requestAnimationFrame(()=>{drawing=false;showHighlights()});
 }
 function syncLocation(){
  const first=selectedTargets[0];
  if(!first){locationInfo=null;return}
  locationInfo={
   page_path:location.pathname.slice(0,350),selector:first.selector,
   element_tag:first.tag,element_label:first.label,
   method_id:first.method_id,tab_name:first.tab_name,
   viewport:{width:innerWidth,height:innerHeight,...first.rect}
  };
 }
 function updateSelectedList(){
  selectedList.replaceChildren();
  selectedCount.textContent="Выбранные элементы: "+selectedTargets.length+" / 15";
  addMore.disabled=selectedTargets.length>=15;
  for(let i=0;i<selectedTargets.length;i++){
   const info=selectedTargets[i];
   const row=el("div","psy-dev-selected-row");
   const name=el("span",null,(i+1)+". "+info.tag+" · "+info.selector.slice(0,80));
   name.title=info.selector;
   const remove=el("button","psy-dev-remove-selected","×");
   remove.type="button";remove.setAttribute("aria-label","Убрать элемент "+(i+1)+" из выбора");
   remove.addEventListener("click",()=>{
    selectedTargets.splice(i,1);
    if(!selectedTargets.length){panel.hidden=true;locationInfo=null;copy.hidden=true}
    else{subTitle();}
    syncLocation();latestId=null;latestScreenshotPath=null;
    removeTask.hidden=true;copy.hidden=true;submit.disabled=false;
    updateSelectedList();showHighlights();
   });
   row.append(name,remove);selectedList.append(row);
  }
  clearAll.disabled=!selectedTargets.length;
  showHighlights();
 }
 function subTitle(){
  const first=selectedTargets[0];
  subtitle.textContent=first?
   selectedTargets.length===1?"Элемент: "+first.tag+" · "+first.selector.slice(0,140):
   "Общее замечание для "+selectedTargets.length+" выбранных элементов":"";
 }
 function stopPick(){
  picking=false;document.body.classList.remove("psy-dev-picking");
  chooseBtn.textContent="Выделить элемент";
  addMore.textContent="＋ Добавить элемент";
  subTitle();showHighlights();
  hint.textContent=enabled?"Рамки закреплены за выбранными элементами. Для объединения нажми «Добавить элемент».":"";
 }
 function startPick(additive=false){
  if(!enabled)return;
  if(!additive){selectedTargets.length=0;locationInfo=null;panel.hidden=true;latestId=null;latestScreenshotPath=null;
   removeTask.hidden=true;copy.hidden=true;submit.disabled=false;note.value="";screenshot.value="";setStatus("")}
  if(selectedTargets.length>=15)return;
  latestId=null;latestScreenshotPath=null;removeTask.hidden=true;
  copy.hidden=true;submit.disabled=false;
  picking=true;chooseBtn.textContent="Отменить выбор";
  addMore.textContent="Отменить выбор";
  document.body.classList.add("psy-dev-picking");
  hint.textContent=selectedTargets.length?
   "Нажми на следующий элемент. Shift + щелчок позволяет выбирать несколько подряд. Esc – отмена выбора.":
   "Нажми на нужный элемент. Рамка закрепится после щелчка. Esc – отмена.";
  updateSelectedList();
 }
 function setMode(on){
  enabled=on;
  app.classList.toggle("psy-dev-enabled",on);
  main.setAttribute("aria-pressed",String(on));
  main.textContent=on?"Режим включен · Выключить":"Показать Артему";
  chooseBtn.hidden=!on;list.hidden=!on;
  if(!on){stopPick();panel.hidden=true;selectedTargets.length=0;latestId=null;latestScreenshotPath=null;locationInfo=null;removeTask.hidden=true;
   updateSelectedList()}
  hint.textContent=on?"Нажми «Выделить элемент», затем выбери место на странице.":"";
  try{localStorage.setItem(FLAG,on?"on":"off")}catch(_){}
 }
 setMode((()=>{try{return localStorage.getItem(FLAG)==="on"}catch(_){return false}})());
 main.addEventListener("click",()=>setMode(!enabled));
 chooseBtn.addEventListener("click",()=>picking?stopPick():startPick(false));
 addMore.addEventListener("click",()=>picking?stopPick():startPick(true));
 clearAll.addEventListener("click",()=>{
  if(submitting)return;
  selectedTargets.length=0;locationInfo=null;panel.hidden=true;stopPick();updateSelectedList();
 });
 window.addEventListener("scroll",scheduleHighlights,{capture:true,passive:true});
 window.addEventListener("resize",scheduleHighlights,{passive:true});
 document.addEventListener("click",event=>{
  if(!picking)return;
  const target=allowedTarget(event.target);
  if(!target)return;
  event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
  const locator=selectorFor(target);
  if(!locator)return;
  if(!selectedTargets.some(x=>x.selector===locator)){
   if(selectedTargets.length>=15){stopPick();setStatus("Можно объединить не более 15 элементов.",true);return}
   const tab=document.querySelector("#methodTabs [data-tab].active")?.dataset.tab||"";
   const methodId=modal&&!modal.hidden?String(window.PSY_ACTIVE_METHOD_ID||""):"";
   const r=target.getBoundingClientRect();
   const entry={
    element:target,selector:locator,tag:target.tagName.toLowerCase(),
    label:String(target.getAttribute("aria-label")||target.getAttribute("title")||target.tagName).slice(0,180),
    method_id:methodId.slice(0,180),tab_name:tab.slice(0,55),
    rect:{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}
   };
   selectedTargets.push(entry);
   syncLocation();
  }
  if(!event.shiftKey)stopPick();
  updateSelectedList();
  panel.hidden=false;
  if(!note.value.trim())note.focus();
  setStatus("");
 },true);
 document.addEventListener("keydown",event=>{
  if(event.key==="Escape"&&picking)stopPick();
 });
 cancel.addEventListener("click",()=>{
  panel.hidden=true;selectedTargets.length=0;locationInfo=null;latestId=null;latestScreenshotPath=null;
  removeTask.hidden=true;stopPick();updateSelectedList();
 });
 async function clip(t){
  try{await navigator.clipboard.writeText(t);return true}
  catch(_){window.prompt("Скопируй текст:",t);return false}
 }
 copy.addEventListener("click",async()=>{
  if(latestId===null)return;
  const q="Артем, исправь замечание Метоларии MT-"+latestId+" (таблица psy_dev_annotations). Страница: "+locationInfo.page_path+". Элементы: "+selectedTargets.map(x=>x.selector).join("; ")+". Задача: "+note.value.trim()+". После исправления сообщи результат.";
  await clip(q);
  setStatus("Номер задачи скопирован. Отправь его мне в чат.");
 });
 removeTask.addEventListener("click",async()=>{
  if(submitting||latestId===null)return;
  const taskId=latestId;
  if(!window.confirm("Удалить замечание MT-"+taskId+" без восстановления?"))return;
  submitting=true;removeTask.disabled=true;setStatus("Удаляем задачу...");
  try{
   const {data,error}=await client.from("psy_dev_annotations").delete()
    .eq("id",taskId).select("id").single();
   if(error||!data)throw error||Error("Не удалось найти задачу");
   if(latestScreenshotPath)await client.storage.from("psy-dev-attachments").remove([latestScreenshotPath]);
   latestId=null;latestScreenshotPath=null;copy.hidden=true;removeTask.hidden=true;
   submit.disabled=false;setStatus("Задача удалена. Можно сохранить новое замечание.");
  }catch(err){setStatus("Не удалось удалить: "+(err?.message||"Нет подключения"),true)}
  finally{submitting=false;removeTask.disabled=false}
 });
 submit.addEventListener("click",async()=>{
  if(submitting||!locationInfo||!selectedTargets.length)return;
  const message=note.value.trim(),file=screenshot.files?.[0];
  if(message.length<3){setStatus("Напиши, что нужно изменить.",true);note.focus();return}
  if(file&&(!(["image/png","image/jpeg","image/webp"].includes(file.type))||file.size>3145728)){
   setStatus("Снимок должен быть PNG, JPG или WebP до 3 МБ.",true);return;
  }
  submitting=true;submit.disabled=true;setStatus("Сохраняем...");
  try{
   const {data,error}=await client.from("psy_dev_annotations")
    .insert({...locationInfo,
     targets:selectedTargets.map(({selector,tag,label,method_id,tab_name,rect})=>({
      selector,tag,label,method_id,tab_name,rect
     })),
     note:message}).select("id").single();
   if(error)throw error;
   latestId=data.id;
   let fileIssue=false;
   if(file){
    const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";
    const token=window.crypto?.randomUUID?.().replaceAll("-","")||Math.random().toString(36).slice(2,14);
    const path="dev/"+latestId+"/"+token+"."+ext;
    const uploaded=await client.storage.from("psy-dev-attachments").upload(path,file,
      {upsert:false,contentType:file.type,cacheControl:"0"});
    if(uploaded.error)fileIssue=true;
    else{
     const linked=await client.from("psy_dev_annotations").update({
      screenshot_path:path,updated_at:new Date().toISOString()
     }).eq("id",latestId);
     if(linked.error)fileIssue=true;
     else latestScreenshotPath=path;
    }
   }
   copy.hidden=false;removeTask.hidden=false;submit.disabled=true;
   setStatus("Задача MT-"+latestId+" сохранена"+(fileIssue?", но снимок прикрепить не удалось":"")+
    ". Нажми «Скопировать задачу для Артема» и отправь мне в чат.",fileIssue);
  }catch(err){setStatus("Не удалось сохранить: "+(err?.message||"Проблема соединения"),true)}
  finally{submitting=false;if(latestId===null)submit.disabled=false}
 });
 const params=new URLSearchParams(location.search),targetId=params.get("psyDevIssue");
 if(targetId&&/^\d{1,15}$/.test(targetId)){
  try{
   const {data}=await client.from("psy_dev_annotations").select("page_path,selector,targets,method_id,tab_name").eq("id",targetId).maybeSingle();
   if(data&&data.page_path===location.pathname){
    if(data.method_id&&typeof window.openMethod==="function"){
     const method=(window.PSY_CATALOG||[]).find(m=>String(m.id)===data.method_id);
     if(method)window.openMethod(method);
    }
    if(data.tab_name)document.querySelector('#methodTabs [data-tab="'+data.tab_name+'"]')?.click();
    const locate=()=>{
     const selectors=(Array.isArray(data.targets)&&data.targets.length?
      data.targets.map(x=>x?.selector):[data.selector]).filter(x=>typeof x==="string");
     const found=[];
     for(const selector of selectors){
      try{
       const target=document.querySelector(selector);
       if(target&&!found.includes(target))found.push(target);
      }catch(_){}
     }
     if(!found.length)return false;
     found[0].scrollIntoView({behavior:"smooth",block:"center"});
     for(const target of found){
      target.classList.add("psy-dev-located");
      setTimeout(()=>target.classList.remove("psy-dev-located"),6000);
     }
     return true;
    };
    if(!locate())setTimeout(locate,650);
   }
  }catch(_){}
 }
})();
