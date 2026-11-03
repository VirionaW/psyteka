"use strict";
/* Edit public presentation metadata. Owner role is validated by Supabase RLS.
   Changing a label never rewrites method IDs, tests, keys or saved results. */
(async function(){
 const identity=window.PSY_IDENTITY;
 if(!identity?.client)return;
 await identity.ready;
 if(!identity.user?.email_confirmed_at||!["owner","shadow","moderator"].includes(identity.role))return;
 const client=identity.client;
 const editable=[
  ["home:hero:lead",".hero-copy > p"],
  ["home:sections:lead","#sections .section-head > p"],
  ["home:inside:heading","#inside .psy-preview-wrap > div:first-child h2"],
  ["home:inside:lead","#inside .psy-preview-wrap > div:first-child p"],
  ["home:mission:heading","#about .psy-mission-copy > h2"],
  ["home:mission:lead","#about .psy-mission-copy > p.large-text"]
 ];
 const fields=[
  ["name","Название методики"],["author","Автор"],["type","Вид методики"],
  ["age","Возраст"],["count","Количество заданий"],["summary","Описание на карточке"],
  ["goal","Цель в портфолио"],["indicators","Показатели портфолио"]
 ];
 const catalog=window.PSY_CATALOG||[];
 const $=(tag,cls,txt)=>{
  const n=document.createElement(tag);
  if(cls)n.className=cls;
  if(txt!==undefined)n.textContent=txt;
  return n;
 };
 const dialog=$("dialog","psy-inline-dialog");
 const title=$("h2",null,"Редактировать карточку");
 const note=$("p",null,"Исправление появится на карточке и в портфолио. Подсчеты и бланки не меняются.");
 const label=$("label",null,"Поле карточки или портфолио");
 const select=$("select","psy-inline-select");
 const text=$("textarea");text.rows=7;text.maxLength=5000;text.setAttribute("aria-label","Редактируемый текст");
 label.append(select);
 const message=$("p","psy-inline-status");
 message.setAttribute("role","status");message.setAttribute("aria-live","polite");
 const actions=$("div","psy-inline-actions");
 const cancel=$("button",null,"Отмена");cancel.type="button";
 const save=$("button","psy-inline-save","Сохранить");save.type="button";
 const history=$("a",null,"История версий");history.href="owner-editor.html";
 actions.append(cancel,save,history);
 dialog.append(title,note,label,text,message,actions);
 document.body.append(dialog);
 let chosen=null,method=null,working=false;
 const methodKey=(m,f)=>"method:"+encodeURIComponent(String(m.id))+":"+f;
 function baseValue(m,f){
  const d=window.PSY_FULL_METHODS?.[m.name]||{};
  const o=window.PSY_PORTFOLIO_EDITS?.[m.name]||{};
  const v=window.PSY_SCHOOL_CARDS?.compose?.(m,d,o,window.PSY_GUIDE_STANDARD)||{};
  if(f==="name")return m.name;
  if(f==="author")return v.author||o.author||d.author||m.author||"";
  if(f==="type")return v.type||o.kind||d.kind||m.format||"";
  if(f==="age")return v.age||o.age||d.age||m.age||"";
  if(f==="count")return v.quantity||o.count||d.count||m.count||"";
  if(f==="summary")return v.summary||m.summary||m.goal||"";
  if(f==="goal")return o.goal||d.goal||m.goal||"";
  if(f==="indicators")return Array.isArray(o.indicators)?o.indicators.join("\n"):"";
  return "";
 }
 function updateField(){
  if(!method)return;
  chosen=methodKey(method,select.value);
  text.value=window.PSY_CONTENT_OVERRIDES?.get?.(method,select.value)??baseValue(method,select.value);
  if(select.value==="indicators")text.placeholder="Каждый показатель с новой строки";
  else text.placeholder="Текст, который увидят посетители";
  history.href="owner-editor.html?method_id="+encodeURIComponent(String(method.id))+"&field="+encodeURIComponent(select.value);
  message.textContent="";
 }
 function close(){if(dialog.open)dialog.close();chosen=null;method=null}
 cancel.addEventListener("click",close);
 dialog.addEventListener("cancel",e=>{e.preventDefault();close()});
 select.addEventListener("change",updateField);
 function openHome(key,el){
  if(!key||!el)return;
  method=null;chosen=key;
  title.textContent="Редактировать текст";
  note.textContent="Изменение сохраняется в истории и появится у всех посетителей.";
  label.hidden=true;
  text.value=el.textContent.trim();
  history.href="owner-editor.html?field="+encodeURIComponent(key);
  message.textContent="";
  if(!dialog.open)dialog.showModal();
  text.focus();
 }
 function openMethod(m,field){
  if(!m)return;
  method=m;chosen=null;
  title.textContent="Редактировать карточку и портфолио";
  note.textContent="Вид, возраст, количество заданий и другие подписи обновятся для всех. Ключи, вопросы и возрастные версии обработки останутся прежними.";
  label.hidden=false;
  select.replaceChildren();
  for(const [key,caption] of fields){
   const option=$("option",null,caption);option.value=key;select.append(option);
  }
  select.value=fields.some(([k])=>k===field)?field:"type";
  updateField();
  if(!dialog.open)dialog.showModal();
  select.focus();
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
   if(window.PSY_CONTENT_OVERRIDES?.load){
    await window.PSY_CONTENT_OVERRIDES.load();
    window.PSY_REFRESH_METHOD_OVERVIEW?.();
   }else location.reload();
  }catch(e){message.textContent="Не удалось сохранить: "+(e?.message||"Ошибка подключения")}
  finally{save.disabled=false;cancel.disabled=false;working=false}
 });
 function attachHome(el,key){
  if(!el||el.dataset.psyOwnerEditable)return;
  el.dataset.psyOwnerEditable=key;
  const button=$("button","psy-inline-edit","✎ Редактировать");
  button.type="button";
  button.setAttribute("aria-label","Изменить этот текст");
  button.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();openHome(key,el)});
  el.insertAdjacentElement("afterend",button);
 }
 for(const [key,selector] of editable)attachHome(document.querySelector(selector),key);
 function findMethod(){
  const id=window.PSY_ACTIVE_METHOD_ID;
  const byId=catalog.find(m=>String(m.id)===String(id));
  if(byId)return byId;
  const displayed=document.getElementById("modalTitle")?.textContent?.trim();
  return catalog.find(m=>m.name===displayed||
   window.PSY_CONTENT_OVERRIDES?.display?.(m,"name",m.name)===displayed);
 }

})();
