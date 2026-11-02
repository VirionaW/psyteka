"use strict";
/* Administrative uploads: PDF/DOCX only, public published materials,
   never student answers, test keys or diagnostic calculations. */
(function(){
 const BUCKET="psy-method-assets",MAX=10*1024*1024;
 const identity=window.PSY_IDENTITY,client=identity?.client||window.PSY_AUTH_CLIENT;
 const ADMIN=new Set(["owner","shadow","moderator"]);
 const kinds={guide:"Методика / руководство",blank:"Бланк",questionnaire:"Полный опросник"};
 const escape=s=>String(s||"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
 let rev=0;
 function linkFor(row){
  if(!row?.file_path||!(/^[a-zA-Z0-9/_-]+\.(pdf|docx)$/.test(row.file_path)))return "";
  return client?.storage.from(BUCKET).getPublicUrl(row.file_path).data?.publicUrl||"";
 }
 const methodId=m=>String(m?.id||"");
 async function mount(method,tab,body){
  if(!client||!method||!["instruction","materials"].includes(tab)||!body)return;
  const id=methodId(method),ticket=++rev;
  const wrap=document.createElement("section");
  wrap.className="psy-admin-method-assets";wrap.setAttribute("aria-label","Дополнительные материалы");
  wrap.innerHTML='<div class="psy-method-assets-heading"><h3>Дополнительные материалы</h3><p>Файлы, опубликованные администрацией, доступны вместе с обычными материалами методики.</p></div><div class="psy-method-assets-links" role="status">Загружаем файлы...</div>';
  body.append(wrap);
  const items=wrap.querySelector(".psy-method-assets-links");
  const show=async()=>{
   const {data,error}=await client.from("psy_method_asset_live")
     .select("kind,file_path,file_name,created_at").eq("method_id",id);
   if(ticket!==rev||!wrap.isConnected)return;
   items.replaceChildren();
   if(error){items.textContent="Не удалось получить дополнительные материалы.";return}
   if(!data?.length){items.textContent="Дополнительные материалы еще не загружены.";return}
   for(const kind of ["guide","blank","questionnaire"]){
    const entry=data.find(x=>x.kind===kind);if(!entry)continue;
    const href=linkFor(entry);if(!href)continue;
    const link=document.createElement("a");
    link.href=href;link.target="_blank";link.rel="noopener noreferrer";
    link.className="btn";
    link.textContent=kinds[kind]+" · "+entry.file_name;
    items.append(link);
   }
  };
  await show();
  await Promise.resolve(identity?.ready);
  if(ticket!==rev||!wrap.isConnected)return;
  if(!identity?.user?.email_confirmed_at||!ADMIN.has(identity.role))return;
  const details=document.createElement("details");
  details.className="psy-method-admin-upload";
  details.innerHTML='<summary>Загрузить свой бланк или методику</summary>'+
   '<form><label>Назначение файла<select name="kind"><option value="blank">Бланк</option><option value="guide">Методика / руководство</option><option value="questionnaire">Полный опросник</option></select></label>'+
   '<label>Файл PDF или Word (до 10 МБ)<input type="file" name="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required></label>'+
   '<p class="psy-method-asset-warning">Публикуйте только материалы, которые имеете право распространять. Не загружайте заполненные бланки и данные учеников.</p>'+
   '<button class="btn primary" type="submit">Загрузить и опубликовать</button>'+
   '<p class="psy-method-upload-status" role="status" aria-live="polite"></p></form>';
  wrap.append(details);
  const form=details.querySelector("form"),status=details.querySelector(".psy-method-upload-status");
  form.addEventListener("submit",async e=>{
   e.preventDefault();
   if(!identity?.user||!ADMIN.has(identity.role))return;
   const file=form.elements.file.files?.[0],kind=form.elements.kind.value;
   const ext=(file?.name||"").split(".").pop().toLowerCase();
   if(!file||!kinds[kind]||!["pdf","docx"].includes(ext)||file.size<=0||file.size>MAX){
    status.textContent="Выберите PDF или DOCX размером до 10 МБ.";return;
   }
   const type=ext==="pdf"?"application/pdf":"application/vnd.openxmlformats-officedocument.wordprocessingml.document";
   if(file.type&&file.type!==type&&file.type!=="application/octet-stream"){
    status.textContent="Тип файла не совпадает с его расширением.";return;
   }
   const btn=form.querySelector("button[type=submit]");btn.disabled=true;
   status.textContent="Загружаем файл...";
   const path="phillips58/"+kind+"/"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,11)+"."+ext;
   try{
    const {error:uploadError}=await client.storage.from(BUCKET).upload(path,file,{
     cacheControl:"3600",upsert:false,contentType:type
    });
    if(uploadError)throw uploadError;
    const {error:writeError}=await client.from("psy_method_asset_versions")
     .insert({method_id:id,kind,file_path:path,file_name:file.name.slice(0,250)});
    if(writeError)throw writeError;
    status.textContent="Опубликовано. Материал появился в списке и доступен для просмотра.";
    form.elements.file.value="";
    const {data}=await client.from("psy_method_asset_live").select("kind,file_path,file_name,created_at").eq("method_id",id);
    items.replaceChildren();
    for(const kind of ["guide","blank","questionnaire"]){
     const entry=data?.find(x=>x.kind===kind),href=linkFor(entry);
     if(!href)continue;
     const link=document.createElement("a");
     link.href=href;link.target="_blank";link.rel="noopener noreferrer";link.className="btn";
     link.textContent=kinds[kind]+" · "+entry.file_name;
     items.append(link);
    }
   }catch(err){status.textContent="Не удалось опубликовать: "+(err?.message||"ошибка соединения")}
   finally{btn.disabled=false}
  });
 }
 window.PSY_METHOD_ASSETS={mount};
})();
