"use strict";
/* Published professional handouts. Never reads or modifies assessments. */
(function(){
 const BUCKET="psy-method-assets",MAX=10*1024*1024;
 const kinds={guide:"Без бланка",combined:"С бланком",blank:"Чистый бланк",questionnaire:"Подлинный текст вопросов"};
 const order=["guide","combined","blank","questionnaire"];
 const ADMIN=new Set(["owner","shadow","moderator"]);
 const acceptable=/^[a-zA-Z0-9/_-]+\.(pdf|docx)$/;
 const identity=window.PSY_IDENTITY;
 const client=identity?.client||window.PSY_AUTH_CLIENT||null;
 const validMethodId=id=>typeof id==="string"&&id.length>0&&id.length<=100;
 function assetUrl(row){
  if(!row?.file_path||!acceptable.test(row.file_path))return "";
  return client?.storage.from(BUCKET).getPublicUrl(row.file_path)?.data?.publicUrl||"";
 }
 async function load(methodId){
  if(!client||!validMethodId(methodId))return [];
  const {data,error}=await client.from("psy_method_asset_live")
   .select("kind,file_path,file_name,created_at").eq("method_id",methodId);
  if(error)throw error;
  return (data||[]).filter(entry=>order.includes(entry.kind)&&assetUrl(entry));
 }
 function printMount({methodId,root,onUpdate}){
  if(!root||!validMethodId(methodId))return;
  root.hidden=true;
  const area=document.createElement("section");
  area.className="psy-print-published";
  area.setAttribute("aria-label","Опубликованные материалы");
  const heading=document.createElement("h2");heading.textContent="Материалы для печати";
  const links=document.createElement("div");links.className="psy-print-published-links";
  const info=document.createElement("p");info.className="psy-print-file-notice";
  area.append(heading,links,info);root.append(area);
  let current=[];
  const refresh=async()=>{
   try{
    current=await load(methodId);
    links.replaceChildren();
    if(current.length){
     root.hidden=false;
     heading.hidden=false;
     for(const kind of order){
      const entry=current.find(x=>x.kind===kind);
      if(!entry)continue;
      const a=document.createElement("a");
      a.href=assetUrl(entry);a.target="_blank";a.rel="noopener noreferrer";
      a.className="psy-print-published-link";
      a.textContent=kinds[kind]+" · открыть файл";
      a.title=entry.file_name||"Открыть опубликованный материал";
      links.append(a);
     }
     info.textContent="Опубликованные документы открываются отдельно. Для PDF используйте печать из просмотрщика.";
    }else{
     root.hidden=true;heading.hidden=true;info.hidden=true;
    }
    onUpdate?.(current);
   }catch(_){
    info.hidden=false;info.textContent="Не удалось загрузить опубликованные материалы.";
   }
  };
  void refresh();
  Promise.resolve(identity?.ready).then(()=>{
   if(!area.isConnected||!identity?.user?.email_confirmed_at||!ADMIN.has(identity.role))return;
   root.hidden=false;heading.hidden=false;
   const details=document.createElement("details");details.className="psy-print-admin-upload";
   const summary=document.createElement("summary");summary.textContent="Администрирование · загрузить материалы";
   const form=document.createElement("form");
   form.innerHTML='<label>Вариант материала<select name="kind">'+
    order.map(k=>'<option value="'+k+'">'+kinds[k]+'</option>').join("")+
    '</select></label>'+
    '<label>Файл PDF или DOCX до 10 МБ<input type="file" name="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required></label>'+
    '<p class="psy-print-warning">Размещайте только материалы, которые вправе распространять. Не загружайте заполненные ответы и персональные данные детей.</p>'+
    '<button class="psy-print-action" type="submit">Опубликовать файл</button>';
   const status=document.createElement("p");status.className="psy-print-upload-status";
   status.setAttribute("role","status");status.setAttribute("aria-live","polite");
   form.append(status);details.append(summary,form);area.append(details);
   form.addEventListener("submit",async event=>{
    event.preventDefault();
    const file=form.elements.file.files?.[0],kind=form.elements.kind.value;
    const ext=file?.name?.split(".").pop()?.toLowerCase();
    const mime=ext==="pdf"?"application/pdf":"application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if(!file||!order.includes(kind)||!["pdf","docx"].includes(ext)||file.size<1||file.size>MAX){
     status.textContent="Выберите корректный PDF или DOCX размером до 10 МБ.";return;
    }
    if(file.type&&file.type!==mime&&file.type!=="application/octet-stream"){
     status.textContent="Тип файла не соответствует расширению.";return;
    }
    const button=form.querySelector('button[type="submit"]');button.disabled=true;
    status.textContent="Публикуем...";
    const path="phillips58/"+kind+"/"+Date.now().toString(36)+"-"+crypto.randomUUID().replace(/-/g,"").slice(0,14)+"."+ext;
    try{
     const {error:up}=await client.storage.from(BUCKET).upload(path,file,{upsert:false,contentType:mime});
     if(up)throw up;
     const {error:ins}=await client.from("psy_method_asset_versions")
      .insert({method_id:methodId,kind,file_path:path,file_name:file.name.slice(0,250)});
     if(ins)throw ins;
     form.reset();status.textContent="Файл опубликован для всех пользователей.";
     await refresh();
    }catch(e){status.textContent="Ошибка публикации: "+(e?.message||"Повторите попытку.")}
    finally{button.disabled=false;}
   });
  });
 }
 window.PSY_METHOD_ASSETS={printMount};
})();
