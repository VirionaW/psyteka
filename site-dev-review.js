"use strict";
/* Admin-only task board for annotations; no direct GitHub token in browser. */
(async function(){
 const id=window.PSY_IDENTITY,$=n=>document.getElementById(n);
 const gate=$("psyDevReviewGate"),main=$("psyDevReviewMain"),list=$("psyDevReviewList");
 const filter=$("psyDevReviewStatus"),refreshBtn=$("psyDevReviewRefresh"),count=$("psyDevReviewCount");
 if(!id?.client){gate.textContent="Сервис авторизации недоступен.";return}
 try{await id.ready}catch(_){}
 if(!id.user?.email_confirmed_at||!["owner","shadow","moderator"].includes(id.role)){
  gate.textContent="Журнал доступен только администрации Метоларии.";return;
 }
 gate.hidden=true;main.hidden=false;
 const client=id.client;
 const e=(t,c,text)=>{const node=document.createElement(t);if(c)node.className=c;if(text!==undefined)node.textContent=text;return node};
 const labels={new:"Новое",progress:"В работе",done:"Исправлено"};
 const formatDate=value=>new Intl.DateTimeFormat("ru-RU",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value));
 async function copy(text){
  try{await navigator.clipboard.writeText(text)}
  catch(_){window.prompt("Скопируй сообщение:",text)}
 }
 let loading=false,lastLoaded=0;
 async function load(){
  if(loading||document.hidden)return;
  loading=true;refreshBtn.disabled=true;count.textContent="Обновляем...";
  try{
   let query=client.from("psy_dev_annotations").select("id,page_path,selector,element_tag,element_label,method_id,tab_name,viewport,note,status,resolution,screenshot_path,created_at,updated_at")
    .order("id",{ascending:false}).limit(150);
   if(filter.value!=="all")query=query.eq("status",filter.value);
   const {data,error}=await query;
   if(error)throw error;
   list.replaceChildren();
   count.textContent=(data||[]).length+" задач";
   if(!data?.length){
    list.append(e("p","psy-dev-review-empty","В этом разделе еще нет замечаний."));
   }
   for(const item of data||[])renderRow(item);
   lastLoaded=Date.now();
  }catch(err){
   count.textContent="Ошибка загрузки";
   list.replaceChildren(e("p","psy-dev-review-error","Не удалось загрузить задачи: "+(err?.message||"нет подключения")));
  }finally{loading=false;refreshBtn.disabled=false}
 }
 function renderRow(row){
  const article=e("article","psy-dev-review-item");
  article.id="psyDevTask"+row.id;
  const heading=e("div","psy-dev-review-heading");
  heading.append(e("strong",null,"MT-"+row.id));
  const date=e("span",null,formatDate(row.created_at));
  const badge=e("span","psy-dev-review-badge is-"+row.status,labels[row.status]||row.status);
  heading.append(badge,date);
  const desc=e("p","psy-dev-review-note",row.note);
  const locationText=e("p","psy-dev-review-location",row.page_path+" · "+(row.method_id||row.tab_name||row.element_tag));
  const sel=e("code",null,row.selector);
  const action=e("div","psy-dev-review-actions");
  const locationUrl=new URL(row.page_path,location.origin);
  locationUrl.searchParams.set("psyDevIssue",row.id);
  const link=e("a",null,"Показать на сайте");
  link.href=locationUrl.href;link.target="_blank";link.rel="noopener noreferrer";
  const copyButton=e("button",null,"Передать Артему");
  copyButton.type="button";
  copyButton.addEventListener("click",async()=>{
   await copy("Артем, исправь замечание Метоларии MT-"+row.id+" в Supabase (таблица psy_dev_annotations). Проверь страницу и выбранный элемент. После исправления сообщи результат.");
   copyButton.textContent="Номер скопирован";
  });
  const sLabel=e("label","psy-dev-review-status-label","Статус");
  const s=e("select");
  for(const [key,value] of Object.entries(labels)){
   const o=e("option",null,value);o.value=key;s.append(o);
  }
  s.value=row.status;
  sLabel.append(s);
  const reply=e("textarea","psy-dev-review-resolution");
  reply.rows=2;reply.maxLength=1500;reply.placeholder="Что изменили (необязательно)";
  reply.value=row.resolution||"";
  const save=e("button","psy-dev-review-save","Сохранить статус");
  save.type="button";
  const message=e("p","psy-dev-review-message");message.setAttribute("role","status");
  save.addEventListener("click",async()=>{
   save.disabled=true;message.textContent="Сохраняем...";
   const {error}=await client.from("psy_dev_annotations").update({status:s.value,resolution:reply.value.trim(),updated_at:new Date().toISOString()}).eq("id",row.id);
   if(error){message.textContent="Не удалось сохранить: "+error.message}
   else{badge.textContent=labels[s.value];badge.className="psy-dev-review-badge is-"+s.value;message.textContent="Сохранено"}
   save.disabled=false;
  });
  action.append(link,copyButton);
  if(row.screenshot_path){
   const shot=e("button",null,"Посмотреть скриншот");
   shot.type="button";
   shot.addEventListener("click",async()=>{
    shot.disabled=true;
    try{
     const {data,error}=await client.storage.from("psy-dev-attachments").createSignedUrl(row.screenshot_path,180);
     if(error)throw error;
     window.open(data.signedUrl,"_blank","noopener,noreferrer");
    }catch(_){message.textContent="Не удалось открыть приватный снимок."}
    finally{shot.disabled=false}
   });
   action.append(shot);
  }
  const options=e("div","psy-dev-review-state");
  options.append(sLabel,reply,save);
  article.append(heading,desc,locationText,sel,action,options,message);
  list.append(article);
 }
 filter.addEventListener("change",()=>void load());
 refreshBtn.addEventListener("click",()=>void load());
 document.addEventListener("visibilitychange",()=>{if(!document.hidden&&Date.now()-lastLoaded>12000)void load()});
 setInterval(()=>{if(!document.hidden&&Date.now()-lastLoaded>20000)void load()},20000);
 void load();
})();
