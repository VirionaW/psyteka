"use strict";
(function(){
 const $=id=>document.getElementById(id);
 const esc=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
 const definitions={
 drawing:{title:"Рисунок семьи",prompt:"Нарисуй, пожалуйста, свою семью.",fields:[["who","Кто изображен на рисунке?"],["doing","Что делают персонажи?"],["support","Как ребенок описывает общение и поддержку?"],["quotes","Дословные пояснения ребенка"],["facts","Наблюдаемые факты"],["hypotheses","Рабочие гипотезы (не диагноз)"],["next","Что уточнить в дальнейшем"]]},
 sociogram:{title:"Семейная социограмма",prompt:"Нарисуй внутри большого круга себя и членов семьи в виде кружков.",fields:[["who","Кого участник изобразил внутри круга?"],["distance","Кто оказался ближе и дальше?"],["positions","Относительные размеры и расположение кружков"],["quotes","Дословные пояснения участника"],["facts","Наблюдаемые факты"],["hypotheses","Рабочие гипотезы (не диагноз)"],["next","Что уточнить в дальнейшем"]]}
 };
 function activate(name){
  const mode=name==="sociogram"?"sociogram":"drawing";
  $("familyDrawing").hidden=mode!=="drawing";
  $("familySociogram").hidden=mode!=="sociogram";
  document.querySelectorAll("[data-family-tab]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.familyTab===mode)));
  try{const url=new URL(location.href);url.searchParams.set("method",mode);history.replaceState(null,"",url)}catch(_){}
 }
 document.querySelectorAll("[data-family-tab]").forEach(b=>b.addEventListener("click",()=>activate(b.dataset.familyTab)));
 function fieldData(name){
  const form=$((name==="sociogram"?"sociogram":"drawing")+"Form");
  return definitions[name].fields.map(([id,label])=>({id,label,value:form.querySelector('[name="'+id+'"]').value.trim()}));
 }
 function protocol(name){
  return ["ПСИХОТЕКА — КАЧЕСТВЕННЫЙ ПРОТОКОЛ",definitions[name].title,"Рабочая версия. Без ФИО и автоматической диагностики.","",...fieldData(name).flatMap(({label,value})=>[label+":",value||"Не заполнено",""]),"Не интерпретировать отдельные элементы рисунка как диагноз. Дополнительная беседа и проверка гипотез обязательны."].join("\n");
 }
 function feedback(name,msg){const p=document.querySelector('[data-feedback="'+name+'"]');if(p)p.textContent=msg}
 function fallbackCopy(txt){const t=document.createElement("textarea");t.value=txt;document.body.appendChild(t);t.select();let ok=false;try{ok=document.execCommand("copy")}catch(_){}t.remove();return ok}
 async function copyText(text){if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return true}return fallbackCopy(text)}
 document.querySelectorAll("[data-copy-protocol]").forEach(btn=>btn.addEventListener("click",async()=>{
  const name=btn.dataset.copyProtocol;try{feedback(name,(await copyText(protocol(name)))?"Обезличенный протокол скопирован.":"Не удалось скопировать. Используйте скачивание.")}catch(_){feedback(name,"Не удалось скопировать. Используйте скачивание.")}
 }));
 function download(blob,filename){const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
 document.querySelectorAll("[data-download-note]").forEach(btn=>btn.addEventListener("click",()=>{
  const name=btn.dataset.downloadNote,blob=new Blob(["\ufeff",protocol(name)],{type:"text/plain;charset=utf-8"});
  download(blob,name==="drawing"?"psyteka_risunok_semi_protokol.txt":"psyteka_semeinaya_sotsiogramma_protokol.txt");
  feedback(name,"Текстовый протокол подготовлен для скачивания.");
 }));
 document.querySelectorAll("[data-clear-form]").forEach(btn=>btn.addEventListener("click",()=>{
  const name=btn.dataset.clearForm;
  if(!window.confirm("Очистить все поля текущего протокола? Это действие нельзя отменить."))return;
  $(name+"Form").querySelectorAll("textarea").forEach(el=>el.value="");feedback(name,"Протокол очищен.");
 }));
 const region=$("familyPrint");
 function printContent(kind,mode){
  const cfg=definitions[kind];
  if(mode==="blank"){
   return kind==="sociogram"?
    '<div class="fp-sheet"><h1>Семейная социограмма — бланк</h1><p>Код участника ___________ Дата ___________</p><p>'+esc(cfg.prompt)+'</p><div class="fp-circle" aria-label="Пустой круг диаметром 110 мм"></div><div class="fp-footer">Круг диаметром 110 мм при печати в масштабе 100%. Используйте указанные условия предъявления.</div></div>':
    '<div class="fp-sheet"><h1>Рисунок семьи — бланк</h1><p>Код участника ___________ Дата ___________</p><p>'+esc(cfg.prompt)+'</p><div class="fp-drawing"></div><div class="fp-footer">Рисунок сопровождается беседой. Поле остается пустым — ничего не навязывается.</div></div>';
  }
  return '<div class="fp-sheet"><h1>'+esc(cfg.title)+' — протокол</h1><p>Код участника ___________ Возраст ______ Дата ___________</p>'+cfg.fields.map(([,label])=>'<div class="fp-prompt">'+esc(label)+'</div><div class="fp-line"></div>').join("")+'<p class="fp-footer">Качественная фиксация, без нормативных оценок. Наблюдения отдельно от гипотез.</p></div>';
 }
 function printNow(kind,mode){
  region.innerHTML=printContent(kind,mode);
  region.hidden=false;region.setAttribute("aria-hidden","false");
  const done=()=>{region.hidden=true;region.setAttribute("aria-hidden","true");window.removeEventListener("afterprint",done)};
  window.addEventListener("afterprint",done);
  window.print();
 }
 document.querySelectorAll("[data-print-kind]").forEach(b=>b.addEventListener("click",()=>printNow(b.dataset.printKind,"blank")));
 document.querySelectorAll("[data-print-protocol]").forEach(b=>b.addEventListener("click",()=>printNow(b.dataset.printProtocol,"protocol")));
 activate(new URLSearchParams(location.search).get("method"));
})();
