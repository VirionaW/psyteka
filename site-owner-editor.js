"use strict";
/* Owner UI. All writes are independently enforced by Supabase RLS.
   Editing content never edits diagnostic algorithms or saved assessments. */
(async function(){
 const root=document.getElementById("ownerEditorRoot");
 const gate=document.getElementById("ownerEditorGate");
 if(!root||!gate)return;
 const $=id=>document.getElementById(id);
 const modeHome=$("ownerEditHome"),modeMethod=$("ownerEditMethod"),methodGroup=$("ownerEditMethodGroup");
 const methodSelect=$("ownerEditMethodSelect"),methodSearch=$("ownerEditSearch");
 const field=$("ownerEditField"),textarea=$("ownerEditText"),count=$("ownerEditCount");
 const status=$("ownerEditStatus"),save=$("ownerEditSave"),original=$("ownerEditOriginal");
 const history=$("ownerEditHistory"),issueStatus=$("ownerIssueStatus"),issues=$("ownerIssuesList");
 const issueForm=$("ownerIssueForm");
 const homeFields=[
  ["home:hero:lead","Главная – описание под названием",".hero-copy > p"],
  ["home:sections:lead","Направления – вводный текст","#sections .section-head > p"],
  ["home:inside:heading","Внутри библиотеки – заголовок","#inside .psy-preview-wrap > div:first-child h2"],
  ["home:inside:lead","Внутри библиотеки – описание","#inside .psy-preview-wrap > div:first-child p"],
  ["home:mission:heading","О проекте – заголовок","#about .psy-mission-copy > h2"],
  ["home:mission:lead","О проекте – описание","#about .psy-mission-copy > p.large-text"]
 ];
 const catalog=(window.PSY_CATALOG||[]).filter(x=>x?.id&&x?.name).slice().sort((a,b)=>a.name.localeCompare(b.name,"ru"));
 const methodsById=new Map(catalog.map(m=>[String(m.id),m]));
 const identity=window.PSY_IDENTITY;
 const client=identity?.client||window.PSY_AUTH_CLIENT;
 const values=new Map(),baseHome=new Map();
 let mode="home",activeKey="",loading=false,saving=false;
 const tell=(element,value,error=false)=>{
  element.textContent=value;element.classList.toggle("is-error",error);
 };
 const when=value=>{
  const date=new Date(value);
  return Number.isNaN(date.getTime())?"Без даты":
   new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(date);
 };
 function node(tag,txt,cls){
  const el=document.createElement(tag);
  if(txt!==undefined)el.textContent=txt;
  if(cls)el.className=cls;
  return el;
 }
 const methodKey=(m,f)=>"method:"+encodeURIComponent(String(m.id))+":"+f;
 const methodFields=[["name","Название на карточке и в портфолио"],["author","Автор"],["type","Вид методики"],["age","Возраст на карточке и в портфолио"],["count","Количество вопросов / заданий"],["summary","Краткое описание на карточке"],["goal","Цель в портфолио"],["indicators","Показатели в портфолио (каждый с новой строки)"]];
 async function fetchHomeSources(){
  try{
   const response=await fetch("index.html",{cache:"no-store"});
   if(!response.ok)throw Error("home unavailable");
   const documentSource=new DOMParser().parseFromString(await response.text(),"text/html");
   for(const [key,,selector] of homeFields){
    const value=documentSource.querySelector(selector)?.textContent?.trim();
    if(value)baseHome.set(key,value);
   }
  }catch(_){/* Current source text remains unavailable until the site responds. */}
 }
 function baseValue(){
  if(mode==="home")return baseHome.get(activeKey)||"";
  const method=methodsById.get(methodSelect.value);
  if(!method)return "";
  const extra=window.PSY_FULL_METHODS?.[method.name]||{};
  const profile=window.PSY_PORTFOLIO_EDITS?.[method.name]||{};
  const card=window.PSY_SCHOOL_CARDS?.compose?.(method,extra,profile,window.PSY_GUIDE_STANDARD)||{};
  switch(field.value){
   case "name":return method.name;
   case "author":return String(card.author||profile.author||extra.author||method.author||"");
   case "type":return String(card.type||profile.kind||extra.kind||method.format||"");
   case "age":return String(card.age||profile.age||extra.age||method.age||"");
   case "count":return String(card.quantity||profile.count||extra.count||method.count||"");
   case "summary":return String(card.summary||method.summary||method.goal||"");
   case "goal":return String(profile.goal||extra.goal||method.goal||"");
   case "indicators":return Array.isArray(profile.indicators)?profile.indicators.join("\n"):
    Array.isArray(extra.scales)?extra.scales.map(x=>typeof x==="string"?x:x.name||"").filter(Boolean).join("\n"):"";
   default:return "";
  }
 }
 function resetFieldOptions(){
  field.replaceChildren();
  if(mode==="home"){
   homeFields.forEach(([key,label])=>{
    const option=node("option",label);option.value=key;field.append(option);
   });
  }else{
   for(const [key,label] of methodFields){
    const option=node("option",label);option.value=key;field.append(option);
   }
  }
 }
 function currentKey(){
  if(mode==="home")return field.value;
  const method=methodsById.get(methodSelect.value);
  return method?methodKey(method,field.value):"";
 }
 function fillMethods(){
  const query=methodSearch.value.trim().toLocaleLowerCase("ru");
  const selected=methodSelect.value;
  methodSelect.replaceChildren();
  const filtered=catalog.filter(m=>(m.name+" "+m.id).toLocaleLowerCase("ru").includes(query));
  for(const m of filtered){
   const option=node("option",m.name);option.value=String(m.id);methodSelect.append(option);
  }
  if(filtered.some(m=>String(m.id)===selected))methodSelect.value=selected;
 }
 function updateCount(){count.textContent=textarea.value.length+" / 5000";}
 async function selectContent(){
  activeKey=currentKey();
  const present=values.get(activeKey);
  textarea.disabled=!activeKey;
  textarea.value=present===undefined?baseValue():present;
  save.disabled=!activeKey;
  original.disabled=!activeKey;
  updateCount();
  tell(status,activeKey?"":"Выберите методику.");
  await loadHistory();
 }
 async function switchMode(to){
  mode=to;modeHome.setAttribute("aria-pressed",String(to==="home"));
  modeMethod.setAttribute("aria-pressed",String(to==="method"));
  methodGroup.hidden=to!=="method";
  resetFieldOptions();
  await selectContent();
 }
 async function fetchValues(){
  const {data,error}=await client.from("psy_site_content_live").select("content_key,content_value");
  if(error)throw error;
  values.clear();
  for(const row of data||[])if(row.content_value!==null)values.set(row.content_key,row.content_value);
 }
 async function publish(value,question){
  if(!activeKey||saving)return false;
  if(question&&!window.confirm(question))return false;
  saving=true;save.disabled=true;original.disabled=true;tell(status,"Сохраняем...");
  try{
   const current=activeKey;
   const {error}=await client.from("psy_site_content_versions")
    .insert({content_key:current,content_value:value}).select("id").single();
   if(error)throw error;
   if(value===null)values.delete(current);else values.set(current,value);
   // Source text changes are a new version, never a destructive rewrite.
   if(current===activeKey){
    textarea.value=value===null?baseValue():value;
    updateCount();
   }
   tell(status,"Опубликовано. Изменение сохранено в истории версий.");
   await loadHistory();
   return true;
  }catch(err){
   tell(status,"Не удалось сохранить: "+(err?.message||"Ошибка соединения"),true);return false;
  }finally{saving=false;save.disabled=false;original.disabled=false}
 }
 async function loadHistory(){
  history.replaceChildren();
  if(!activeKey)return;
  const key=activeKey;
  const {data,error}=await client.from("psy_site_content_versions")
   .select("id,created_at,content_value").eq("content_key",key).order("id",{ascending:false}).limit(30);
  if(key!==activeKey)return;
  if(error){history.append(node("p","Не удалось загрузить историю изменений.","psy-editor-description"));return}
  if(!data?.length){history.append(node("p","Вы еще не изменяли этот текст.","psy-editor-description"));return}
  for(const row of data){
   const item=node("div",undefined,"psy-editor-version");
   const main=node("div",undefined,"psy-editor-version-info");
   const label=node("strong",when(row.created_at));
   const preview=node("p",row.content_value===null?"Возврат к исходному тексту":String(row.content_value).slice(0,160));
   main.append(label,preview);
   const restore=node("button","Вернуть");restore.type="button";
   restore.addEventListener("click",()=>void publish(row.content_value,
    "Восстановить выбранную версию текста? Это действие тоже появится в истории."));
   item.append(main,restore);history.append(item);
  }
 }
 async function loadIssues(){
  const {data,error}=await client.from("psy_owner_issues")
   .select("issue_id,title,details,status,created_at").order("created_at",{ascending:false}).limit(100);
  issues.replaceChildren();
  if(error){issues.append(node("p","Не удалось загрузить замечания.","psy-editor-description"));return}
  if(!data?.length){issues.append(node("p","Замечаний пока нет.","psy-editor-description"));return}
  for(const entry of data){
   const card=node("article",undefined,"psy-editor-issue"+(entry.status==="resolved"?" is-resolved":""));
   const head=node("div",undefined,"psy-editor-issue-head");
   head.append(node("strong",entry.title));
   head.append(node("span",entry.status==="resolved"?"Исправлено":"Открыто","psy-editor-issue-state"));
   const details=node("p",entry.details||"Без описания");
   const foot=node("div",undefined,"psy-editor-issue-foot");
   foot.append(node("span",when(entry.created_at)));
   const toggle=node("button",entry.status==="resolved"?"Открыть снова":"Отметить исправленным");
   toggle.type="button";
   toggle.addEventListener("click",async()=>{
    toggle.disabled=true;
    const next=entry.status==="resolved"?"open":"resolved";
    const {error:updateError}=await client.from("psy_owner_issues")
      .update({status:next,updated_at:new Date().toISOString()}).eq("issue_id",entry.issue_id);
    if(updateError){tell(issueStatus,"Не удалось обновить замечание.",true);toggle.disabled=false;return}
    tell(issueStatus,"Статус замечания обновлен.");await loadIssues();
   });
   foot.append(toggle);card.append(head,details,foot);issues.append(card);
  }
 }
 issueForm.addEventListener("submit",async event=>{
  event.preventDefault();
  const title=$("ownerIssueTitle").value.trim(),details=$("ownerIssueDetails").value.trim();
  if(title.length<3||title.length>180||details.length>4000)return;
  const btn=issueForm.querySelector('[type="submit"]');btn.disabled=true;
  const {error}=await client.from("psy_owner_issues").insert({title,details});
  btn.disabled=false;
  if(error){tell(issueStatus,"Не удалось добавить замечание. "+error.message,true);return}
  issueForm.reset();tell(issueStatus,"Замечание добавлено.");await loadIssues();
 });
 modeHome.addEventListener("click",()=>void switchMode("home"));
 modeMethod.addEventListener("click",()=>void switchMode("method"));
 methodSearch.addEventListener("input",()=>{fillMethods();void selectContent()});
 methodSelect.addEventListener("change",()=>void selectContent());
 field.addEventListener("change",()=>void selectContent());
 textarea.addEventListener("input",updateCount);
 save.addEventListener("click",()=>{
  const v=textarea.value.trim();
  if(!v){tell(status,"Введите текст или нажмите «Вернуть исходный текст».",true);return}
  if(v.length>5000){tell(status,"Слишком длинный текст.",true);return}
  void publish(v);
 });
 original.addEventListener("click",()=>{
  if(!baseValue()){tell(status,"Исходный текст недоступен. Восстановление пока невозможно.",true);return}
  void publish(null,"Убрать редакторскую правку и показать исходный текст сайта?");
 });
 try{
  if(!client)throw Error("Сервис аккаунтов недоступен");
  await Promise.resolve(identity?.ready);
  const {data,error}=await client.auth.getUser();
  const user=data?.user;
  if(error||!user||user.is_anonymous||!user.email_confirmed_at)throw Error("Войдите в подтвержденный аккаунт владельца.");
  const policy=window.PSY_AUTH_PROTECTION;
  if(policy&&!(await policy.keepSession(client,user)))throw Error("Войдите в аккаунт повторно.");
  if(policy&&await policy.secondFactorNeeded(client)){
   location.replace(policy.challengeUrl("owner-editor.html"));return;
  }
  const {data:roleData,error:roleError}=await client.from("psy_account_roles")
   .select("role").eq("user_id",user.id).maybeSingle();
  if(roleError)throw roleError;
  if(!["owner","shadow","moderator"].includes(roleData?.role))throw Error("Редактор доступен только администрации.");
  root.hidden=false;gate.hidden=true;
  fillMethods();
  await Promise.all([fetchHomeSources(),fetchValues()]);
  await switchMode("home");
  await loadIssues();
  const params=new URL(location.href).searchParams;
  const requested=params.get("field");
  const requestedMethod=params.get("method_id");
  if(requestedMethod&&methodsById.has(requestedMethod)){
   await switchMode("method");
   methodSelect.value=requestedMethod;
   if(methodFields.some(([key])=>key===requested))field.value=requested;
   await selectContent();
  }else if(requested&&homeFields.some(row=>row[0]===requested)){
   field.value=requested;await selectContent();
  }
 }catch(err){gate.textContent="Не удалось открыть редактор: "+(err?.message||"Ошибка подключения");}
})();
