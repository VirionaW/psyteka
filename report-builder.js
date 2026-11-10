"use strict";
(function(){
 const $=id=>document.getElementById(id);
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const cleanName=s=>String(s||"Объединенные результаты").replace(/[<>:"/\\|?*\u0000-\u001f]/g," ").replace(/\s+/g," ").trim().slice(0,110)||"Объединенные результаты";
 const key=s=>String(s||"").trim().replace(/\s+/g," ").toLocaleLowerCase("ru-RU");
 const bytes=new TextEncoder();
 const state={id:null,columns:[{id:"participant",name:"Участник",visible:true}],rows:[],sources:[],summary:""};
 let list=[],identity=window.PSY_IDENTITY,cloud=window.PSY_CLOUD,user=null,dirty=false,renderDelay=0;
 function notify(s,error=false){$("rbStatus").textContent=s;$("rbStatus").dataset.error=String(error)}
 function getDoc(){return {columns:state.columns,rows:state.rows,summary:$("rbSummary").value,sources:state.sources}}
 function setDoc(data,id=null){if(!data||!Array.isArray(data.columns)||!Array.isArray(data.rows))throw Error("Некорректный формат документа");state.id=id;state.columns=data.columns.filter(x=>x&&typeof x.id==="string").slice(0,50).map(x=>({id:x.id,name:String(x.name||"Показатель").slice(0,120),visible:x.visible!==false}));state.rows=data.rows.slice(0,500).map(r=>Object.fromEntries(Object.entries(r||{}).map(([k,v])=>[k,String(v??"").slice(0,800)])));state.sources=Array.isArray(data.sources)?data.sources.slice(0,20):[];$("rbSummary").value=String(data.summary||"").slice(0,60000);render();dirty=false}
 function metricValue(value){if(value===null||value===undefined||value==="")return "";if(typeof value==="number")return Number.isFinite(value)?String(Math.round(value*10)/10):"";if(typeof value==="string"||typeof value==="boolean")return String(value);return ""}
 const PH_SCALES=["Общая тревожность в школе","Социальный стресс","Фрустрация потребности в успехе","Страх самовыражения","Страх ситуации проверки знаний","Страх не соответствовать ожиданиям","Низкая физиологическая сопротивляемость стрессу","Проблемы и страхи в отношениях с учителями"];
 function metrics(source){
  const scores=source.snapshot?.scoreArchive?.results||[];
  const objects=scores.filter(z=>z&&typeof z==="object");
  if(!objects.length)return [{label:"Сохраненный расчет",read:()=>""}];
  const first=objects[0],title=source.method_name||"Методика";
  if(/Филлипс/i.test(title)&&"percent" in first){
   return [{label:"Общая тревожность, %",read:z=>metricValue(z?.percent)},...PH_SCALES.map((scale,i)=>({label:scale+", %",read:z=>metricValue(z?.scales?.[i]?.percent)}))];
  }
  if(/Ковач|CDI/i.test(title))return [{label:"Суммарный сырой балл",read:z=>metricValue(z?.raw)}];
  const candidates=[["percent","Показатель, %"],["raw","Сумма баллов"],["index","Индекс"],["total","Общий показатель"],["score","Оценка"],["caption","Интерпретация"],["level","Уровень"]];
  const fields=candidates.filter(([k])=>objects.some(x=>["number","string"].includes(typeof x[k])));
  if(fields.length)return fields.map(([k,label])=>({label,read:z=>metricValue(z?.[k])}));
  return [{label:"Расчет",read:z=>z?JSON.stringify(z).slice(0,200):""}];
 }
 function build(sources){
  const columns=[{id:"participant",name:"Участник",visible:true}];
  const rows=[],seen=new Map(),notMatched=[];
  sources.forEach((source,si)=>{
   const items=source.snapshot?.rows||[],scores=source.snapshot?.scoreArchive?.results||[];
   const fields=metrics(source).slice(0,12);
   fields.forEach((f,fi)=>columns.push({id:"m"+si+"_"+fi,name:(source.method_name||"Методика")+" – "+f.label,visible:fi===0}));
   const counts=new Map();
   items.forEach(row=>{const v=key(row?.name);if(v)counts.set(v,(counts.get(v)||0)+1)});
   items.forEach((person,pi)=>{
    const label=String(person?.name||"").trim(),id=key(label),safe=!!id&&counts.get(id)===1;
    const rowKey=safe?id:null;
    let target=safe?seen.get(rowKey):null;
    if(!target){
     target={participant:label||"Участник без кода ("+(si+1)+"."+ (pi+1)+")"};
     rows.push(target);
     if(safe)seen.set(rowKey,target);
     else notMatched.push((label||"Без кода")+" ("+source.title+")");
    }
    fields.forEach((f,fi)=>{const value=f.read(scores[pi]);target["m"+si+"_"+fi]=value;});
   });
  });
  const related=sources.map(x=>x.title+" – "+x.method_name);
  const summary="Объединены сохранения: "+related.join("; ")+".\nВ общей таблице "+rows.length+" строк участников. Значения приведены по расчетам, зафиксированным при сохранении соответствующих методик.\n\nАнализ результатов:\n\nРекомендации:";
  setDoc({columns,rows,summary,sources:sources.map(x=>({id:x.id,title:x.title,method_name:x.method_name}))});
  if(notMatched.length)notify("Таблица собрана. Проверьте совпадение кодов: "+notMatched.length+" записей с повторяющимися либо пустыми кодами оставлены отдельными строками.");
  else notify("Одна общая таблица готова. Колонки и текст можно менять перед скачиванием.");
 }
 const render=()=>{
  const div=$("rbColumns");div.replaceChildren();
  state.columns.forEach((col,i)=>{
   const label=document.createElement("label");label.className="rb-col-switch";
   const check=document.createElement("input");check.type="checkbox";check.checked=col.visible;
   check.disabled=i===0;check.onchange=()=>{col.visible=check.checked;renderTable();preview();dirty=true};
   const span=document.createElement("span");span.textContent=col.name.slice(0,60);label.append(check,span);div.append(label);
  });
  renderTable();preview();
 };
 function renderTable(){
  const visible=state.columns.filter(c=>c.visible);
  const table=document.createElement("table");table.className="rb-table";
  const head=document.createElement("thead"),headrow=document.createElement("tr");
  visible.forEach((c)=>{
   const th=document.createElement("th"),input=document.createElement("input");input.value=c.name;input.setAttribute("aria-label","Название колонки");input.maxLength=120;
   input.oninput=()=>{c.name=input.value;dirty=true;previewLater();};
   th.append(input);headrow.append(th);
  });
  const actionTh=document.createElement("th");actionTh.textContent="Строки";headrow.append(actionTh);head.append(headrow);table.append(head);
  const body=document.createElement("tbody");
  state.rows.forEach((r,i)=>{
   const tr=document.createElement("tr");
   visible.forEach(c=>{
    const td=document.createElement("td"),input=document.createElement("input");input.value=r[c.id]||"";
    input.setAttribute("aria-label",c.name+", строка "+(i+1));input.maxLength=800;
    input.oninput=()=>{r[c.id]=input.value;dirty=true;previewLater()};
    td.append(input);tr.append(td);
   });
   const op=document.createElement("td");op.className="rb-cell-ops";
   for(const [label,action,title] of [["+ ↑","before","Добавить строку выше"],["+ ↓","after","Добавить строку ниже"],["×","remove","Удалить строку"]]){
    const btn=document.createElement("button");btn.type="button";btn.className="rb-small";btn.textContent=label;btn.title=title;
    btn.onclick=()=>{if(action==="remove"){if(!confirm("Удалить строку из итогового документа? Исходные результаты не изменятся."))return;state.rows.splice(i,1)}else state.rows.splice(i+(action==="after"?1:0),0,{participant:""});dirty=true;renderTable();preview()};
    op.append(btn);
   }
   tr.append(op);body.append(tr);
  });
  table.append(body);$("rbTable").replaceChildren(table);
 }
 function previewLater(){clearTimeout(renderDelay);renderDelay=setTimeout(preview,180)}
 function preview(){
  const host=$("rbPreview");
  const visible=state.columns.filter(c=>c.visible);
  const cells=state.rows.map((r,i)=>"<tr>"+visible.map(c=>"<td>"+esc(r[c.id]??"")+"</td>").join("")+"</tr>").join("");
  host.innerHTML="<h2>"+esc($("rbTitle").value)+"</h2>"+(visible.length?'<table><thead><tr>'+visible.map(c=>"<th>"+esc(c.name)+"</th>").join("")+"</tr></thead><tbody>"+cells+"</tbody></table>":"")+
   "<h2>Аналитическая справка</h2><p>"+esc($("rbSummary").value)+"</p>";
 }
 async function loadList(){
  if(!cloud){notify("Данные пока недоступны.",true);return}
  $("rbSources").textContent="Загрузка…";
  try{
   list=await cloud.listAssessments();$("rbSources").replaceChildren();
   if(!list.length)$("rbSources").textContent="Сохранений пока нет. Создайте их в библиотеке.";
   list.forEach(item=>{
    const label=document.createElement("label");label.className="rb-source";
    const cb=document.createElement("input");cb.type="checkbox";cb.value=item.id;cb.setAttribute("data-source",item.id);
    const meta=document.createElement("span"),h=document.createElement("strong"),sub=document.createElement("small");
    h.textContent=item.title;sub.textContent=item.method_name+" · "+new Date(item.updated_at).toLocaleDateString("ru-RU");
    meta.append(h,sub);label.append(cb,meta);$("rbSources").append(label);
   });
  }catch(e){$("rbSources").textContent="Не удалось получить сохранения. "+e.message}
 }
 async function loadDrafts(){
  const select=$("rbSavedDrafts");select.replaceChildren(new Option("Выберите черновик",""));
  try{
   const {data,error}=await identity.client.from("psy_report_documents").select("id,title,updated_at").eq("user_id",user.id).order("updated_at",{ascending:false}).limit(100);
   if(error)throw error;
   (data||[]).forEach(d=>select.add(new Option(d.title+" · "+new Date(d.updated_at).toLocaleDateString("ru-RU"),d.id)));
  }catch(e){notify("Черновики пока недоступны: "+e.message,true)}
 }
 async function getSources(){
  const ids=[...document.querySelectorAll("#rbSources input[data-source]:checked")].map(x=>x.value);
  if(ids.length<2){notify("Выберите минимум два сохраненных обследования.",true);return}
  if(dirty&&!confirm("Собрать новую таблицу? Несохраненные правки итогового документа будут заменены."))return;
  notify("Получаем выбранные сохранения…");
  try{const data=await Promise.all(ids.map(id=>cloud.getAssessment(id)));build(data);$("rbTitle").value=(data[0].title||"Объединенные результаты").replace(/\s+(Филлипс|Ковач|CDI).*$/i,"")+" – общие результаты";preview()}catch(e){notify("Не удалось собрать результаты: "+e.message,true)}
 }
 function xml(s){return String(s??"").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,"").replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&apos;"}[c]))}
 const le16=n=>[n&255,(n>>>8)&255],le32=n=>[...le16(n),...le16(n>>>16)];
 const crcTable=Array.from({length:256},(_,i)=>{let c=i;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0});
 function crc32(b){let c=0xffffffff;for(const n of b)c=crcTable[(c^n)&255]^(c>>>8);return(c^0xffffffff)>>>0}
 function zip(files){
  const pieces=[],central=[];let offset=0;
  files.forEach(([name,body])=>{
   const n=bytes.encode(name),b=typeof body==="string"?bytes.encode(body):body,crc=crc32(b);
   const local=new Uint8Array([...le32(0x04034b50),...le16(20),...le16(0),...le16(0),...le16(0),...le16(0),...le32(crc),...le32(b.length),...le32(b.length),...le16(n.length),...le16(0),...n]);
   pieces.push(local,b);
   central.push(new Uint8Array([...le32(0x02014b50),...le16(20),...le16(20),...le16(0),...le16(0),...le16(0),...le16(0),...le32(crc),...le32(b.length),...le32(b.length),...le16(n.length),...le16(0),...le16(0),...le16(0),...le16(0),...le32(0),...le32(offset),...n]));
   offset+=local.length+b.length;
  });
  const start=offset;central.forEach(v=>{pieces.push(v);offset+=v.length});
  pieces.push(new Uint8Array([...le32(0x06054b50),...le16(0),...le16(0),...le16(files.length),...le16(files.length),...le32(offset-start),...le32(start),...le16(0)]));
  return new Blob(pieces,{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
 }
 function docx(){
  const cols=state.columns.filter(c=>c.visible);if(!cols.length||!state.rows.length)throw Error("Добавьте хотя бы одну строку.");
  const wide=cols.length>5,width=wide?16838:11906,height=wide?11906:16838,margins=900;
  const cw=Math.max(450,Math.floor((width-margins*2)/cols.length));
  const p=(s,bold=false)=>'<w:p><w:pPr><w:spacing w:after="110"/></w:pPr><w:r>'+(bold?'<w:rPr><w:b/></w:rPr>':"")+'<w:t xml:space="preserve">'+xml(s)+'</w:t></w:r></w:p>';
  const tc=(s,head=false)=>'<w:tc><w:tcPr><w:tcW w:w="'+cw+'" w:type="dxa"/></w:tcPr>'+p(s,head)+'</w:tc>';
  const tr=(row,head=false)=>'<w:tr><w:trPr><w:cantSplit/>'+(head?'<w:tblHeader/>':"")+'</w:trPr>'+row.map(x=>tc(x,head)).join("")+'</w:tr>';
  const table='<w:tbl><w:tblPr><w:tblW w:type="auto" w:w="0"/><w:tblBorders>'+["top","left","bottom","right","insideH","insideV"].map(side=>'<w:'+side+' w:val="single" w:sz="4" w:color="777777"/>').join("")+'</w:tblBorders></w:tblPr><w:tblGrid>'+cols.map(()=>'<w:gridCol w:w="'+cw+'"/>').join("")+'</w:tblGrid>'+tr(cols.map(x=>x.name),true)+state.rows.map(r=>tr(cols.map(x=>r[x.id]??""))).join("")+'</w:tbl>';
  const summary=$("rbSummary").value.split(/\n+/).map(x=>p(x)).join("");
  const body=p($("rbTitle").value,true)+table+p("Аналитическая справка",true)+summary;
  const document='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+'<w:sectPr><w:pgSz w:w="'+width+'" w:h="'+height+'"'+(wide?' w:orient="landscape"':"")+'/><w:pgMar w:top="'+margins+'" w:bottom="'+margins+'" w:left="'+margins+'" w:right="'+margins+'"/></w:sectPr></w:body></w:document>';
  return zip([
   ["[Content_Types].xml",'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
   ["_rels/.rels",'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
   ["word/document.xml",document]
  ]);
 }
 function download(blob,name){const u=URL.createObjectURL(blob),a=document.createElement("a");a.download=name;a.href=u;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),6000)}
 async function saveDraft(){
  if(!user){notify("Войдите в аккаунт.",true);return}
  if(!state.rows.length){notify("Сначала создайте таблицу.",true);return}
  const title=cleanName($("rbTitle").value);const body=getDoc();
  try{
   const payload={user_id:user.id,title,body,updated_at:new Date().toISOString()};
   if(state.id)payload.id=state.id;
   const {data,error}=await identity.client.from("psy_report_documents").upsert(payload,{onConflict:"id"}).select("id").single();
   if(error)throw error;state.id=data.id;dirty=false;notify("Черновик сохранен в вашем аккаунте.");await loadDrafts();$("rbSavedDrafts").value=data.id;
  }catch(e){notify("Не удалось сохранить черновик: "+e.message,true)}
 }
 async function openDraft(){
  const id=$("rbSavedDrafts").value;if(!id)return;
  if(dirty&&!confirm("Открыть черновик и заменить несохраненные правки?"))return;
  try{
   const {data,error}=await identity.client.from("psy_report_documents").select("id,title,body").eq("id",id).eq("user_id",user.id).single();
   if(error)throw error;$("rbTitle").value=data.title;setDoc(data.body,data.id);notify("Черновик открыт.");
  }catch(e){notify("Ошибка открытия черновика: "+e.message,true)}
 }
 async function deleteDraft(){
  const id=$("rbSavedDrafts").value;if(!id||!confirm("Удалить сохраненный итоговый документ? Исходные обследования не затронуты."))return;
  try{const {error}=await identity.client.from("psy_report_documents").delete().eq("user_id",user.id).eq("id",id);if(error)throw error;if(id===state.id)state.id=null;await loadDrafts();notify("Черновик удален. Исходные результаты сохранены.")}catch(e){notify(e.message,true)}
 }
 function init(){
  $("rbBuild").onclick=getSources;$("rbRefresh").onclick=loadList;
  $("rbAddColumn").onclick=()=>{const label=prompt("Название новой колонки","Примечание");if(label===null)return;const id="custom_"+Date.now()+"_"+Math.floor(Math.random()*10000);state.columns.push({id,name:label.slice(0,120)||"Примечание",visible:true});dirty=true;render()};
  $("rbAddRow").onclick=()=>{state.rows.push({participant:""});dirty=true;render()};
  $("rbRemoveRow").onclick=()=>{if(state.rows.length&&confirm("Удалить последнюю строку из итогового документа?")){state.rows.pop();dirty=true;render()}};
  $("rbSummary").oninput=()=>{state.summary=$("rbSummary").value;dirty=true;previewLater()};
  $("rbTitle").oninput=()=>{dirty=true;previewLater()};
  $("rbDownload").onclick=()=>{try{download(docx(),cleanName($("rbTitle").value)+".docx");notify("Word-файл подготовлен к скачиванию.")}catch(e){notify("Не удалось создать Word: "+e.message,true)}};
  $("rbPrint").onclick=()=>{preview();window.print()};
  $("rbSaveDraft").onclick=saveDraft;$("rbOpenDraft").onclick=openDraft;$("rbDeleteDraft").onclick=deleteDraft;
  render();
  Promise.resolve(identity?.ready).then(async()=>{
   user=identity?.user&&!identity.user.is_anonymous?identity.user:null;
   await cloud?.ready;
   if(!user){notify("Для работы с сохраненными обследованиями войдите в личный аккаунт.",true);$("rbSources").innerHTML='<a href="/?entry=1">Войти в аккаунт</a>';return}
   await Promise.all([loadList(),loadDrafts()]);
   if(new URLSearchParams(location.search).get("assessment")){$("rbSources").querySelectorAll("input[data-source]").forEach(x=>{if(x.value===new URLSearchParams(location.search).get("assessment"))x.checked=true})}
  }).catch(e=>notify("Ошибка авторизации: "+e.message,true));
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
