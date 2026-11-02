"use strict";
/* Inline entry points visible only after a verified owner role.
   Text writes are also protected by server-side RLS. */
(async function(){
 const identity=window.PSY_IDENTITY;
 if(!identity?.client)return;
 await identity.ready;
 if(!identity.user?.email_confirmed_at||identity.role!=="owner")return;
 const client=identity.client;
 const editable=[
  ["home:hero:lead",".hero-copy > p"],
  ["home:sections:lead","#sections .section-head > p"],
  ["home:inside:heading","#inside .psy-preview-wrap > div:first-child h2"],
  ["home:inside:lead","#inside .psy-preview-wrap > div:first-child p"],
  ["home:mission:heading","#about .psy-mission-copy > h2"],
  ["home:mission:lead","#about .psy-mission-copy > p.large-text"]
 ];
 const $=(tag,cls,txt)=>{
  const n=document.createElement(tag);
  if(cls)n.className=cls;
  if(txt!==undefined)n.textContent=txt;
  return n;
 };
 const dialog=$("dialog","psy-inline-dialog");
 const title=$("h2",null,"Исправить текст");
 const note=$("p",null,"Изменение сохраняется в истории и появится у всех посетителей.");
 const text=$("textarea");text.rows=7;text.maxLength=5000;text.setAttribute("aria-label","Редактируемый текст");
 const message=$("p","psy-inline-status");
 message.setAttribute("role","status");message.setAttribute("aria-live","polite");
 const actions=$("div","psy-inline-actions");
 const cancel=$("button",null,"Отмена");cancel.type="button";
 const save=$("button","psy-inline-save","Сохранить");save.type="button";
 const history=$("a",null,"История версий");history.href="owner-editor.html";
 actions.append(cancel,save,history);
 dialog.append(title,note,text,message,actions);
 document.body.append(dialog);
 let chosen=null,working=false;
 function close(){if(dialog.open)dialog.close();chosen=null}
 cancel.addEventListener("click",close);
 dialog.addEventListener("cancel",e=>{e.preventDefault();close()});
 function open(key,el){
  if(!key||!el)return;
  chosen=key;
  title.textContent="Редактировать текст";
  text.value=el.textContent.trim();
  message.textContent="";
  history.href="owner-editor.html?field="+encodeURIComponent(key);
  if(key.startsWith("method:")){
   const m=key.match(/^method:([^:]+):(summary|goal)$/);
   if(m)history.href="owner-editor.html?method_id="+encodeURIComponent(decodeURIComponent(m[1]))+"&field="+m[2];
  }
  if(!dialog.open)dialog.showModal();
  text.focus();
 }
 save.addEventListener("click",async()=>{
  if(!chosen||working)return;
  const value=text.value.trim();
  if(!value||value.length>5000){message.textContent="Введите текст длиной до 5000 символов.";return}
  working=true;save.disabled=true;cancel.disabled=true;message.textContent="Сохраняем...";
  try{
   const {error}=await client.from("psy_site_content_versions")
    .insert({content_key:chosen,content_value:value});
   if(error)throw error;
   message.textContent="Сохранено.";
   close();
   if(window.PSY_CONTENT_OVERRIDES?.load)await window.PSY_CONTENT_OVERRIDES.load();
   else location.reload();
  }catch(e){message.textContent="Не удалось сохранить: "+(e?.message||"Ошибка подключения")}
  finally{save.disabled=false;cancel.disabled=false;working=false}
 });
 function attach(el,key){
  if(!el||el.dataset.psyOwnerEditable)return;
  el.dataset.psyOwnerEditable=key;
  const button=$("button","psy-inline-edit","✎ Редактировать");
  button.type="button";
  button.setAttribute("aria-label","Изменить этот текст");
  button.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();open(key,el)});
  // Use a sibling so the original source-text element remains unchanged.
  el.insertAdjacentElement("afterend",button);
 }
 for(const [key,selector] of editable)attach(document.querySelector(selector),key);
 const catalog=document.getElementById("catalog");
 if(catalog){
  function decorate(){
   for(const button of catalog.querySelectorAll('button[data-open]')){
    const m=(window.PSY_CATALOG||[]).find(x=>String(x.id)===button.dataset.open);
    if(!m)continue;
    const card=button.closest("article.method");
    if(!card||card.dataset.psyOwnerMethod)return;
    card.dataset.psyOwnerMethod="true";
    const summary=card.querySelector(".method-card-summary");
    const edit=$("button","psy-inline-edit","✎ Исправить описание");
    edit.type="button";
    edit.addEventListener("click",event=>{
     event.preventDefault();event.stopPropagation();
     open("method:"+encodeURIComponent(String(m.id))+":summary",summary);
    });
    card.querySelector(".actions")?.append(edit);
   }
  }
  decorate();
  // Existing search/filter re-renders cards from data; attach just to newly
  // inserted cards, never to inputs or saved diagnostic worksheets.
  const observer=new MutationObserver(()=>decorate());
  observer.observe(catalog,{childList:true});
 }
})();
