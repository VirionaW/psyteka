"use strict";
(function(){
 const tabs=[...document.querySelectorAll("[data-ad-tab]")];
 const names={animals:"Школа зверей",likes:"Что мне нравится в школе"};
 const fields={
  animals:[["who","Выбранный персонаж"],["story","Сюжет рисунка"],["feeling","Эмоции и помощь"],["quotes","Дословные ответы"],["facts","Наблюдаемые факты"],["next","Что уточнить"]],
  likes:[["story","Сюжет рисунка"],["likes","Что нравится и почему"],["difficult","Трудности"],["quotes","Дословные ответы"],["facts","Наблюдаемые факты"],["next","Что уточнить"]]
 };
 function modeFromUrl(){return new URLSearchParams(location.search).get("method")==="likes"?"likes":"animals"}
 function choose(mode){
  document.querySelectorAll("[data-ad-section]").forEach(el=>el.hidden=el.dataset.adSection!==mode);
  tabs.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.adTab===mode)));
  try{const url=new URL(location.href);url.searchParams.set("method",mode);history.replaceState(null,"",url)}catch(_){}
  document.title=names[mode]+" | Психотека";
 }
 tabs.forEach(btn=>btn.addEventListener("click",()=>choose(btn.dataset.adTab)));
 function report(type){
  const f=document.getElementById(type+"Form");
  let lines=[names[type]+" - качественный протокол",""];
  lines.push("Код участника: "+(f.elements.code.value.trim()||"________"));
  lines.push("Дата: "+(f.elements.date.value||"________"),"");
  for(const [key,label] of fields[type])lines.push(label+":\n"+(f.elements[key].value.trim()||"Не заполнено"),"");
  lines.push("Отдельные признаки рисунка не позволяют делать диагностические заключения. Требуется беседа и сопоставление с другими данными.");
  return lines.join("\n");
 }
 document.querySelectorAll("[data-ad-print]").forEach(b=>b.addEventListener("click",()=>{
  const type=b.dataset.adPrint;
  document.getElementById("adPrintTitle").textContent=names[type];
  document.getElementById("adPrint").setAttribute("aria-hidden","false");
  document.body.dataset.adPrinting=type;
  window.print();
 }));
 document.querySelectorAll("[data-ad-copy]").forEach(b=>b.addEventListener("click",async()=>{
  const type=b.dataset.adCopy,feedback=document.getElementById(type+"Feedback");
  try{await navigator.clipboard.writeText(report(type));feedback.textContent="Запись скопирована."}
  catch(_){feedback.textContent="Не удалось скопировать. Проверьте разрешение браузера."}
 }));
 document.querySelectorAll(".ad-form").forEach(f=>f.addEventListener("reset",()=>{
  const feedback=f.querySelector(".ad-feedback");
  if(feedback)feedback.textContent="Форма очищена.";
 }));
 choose(modeFromUrl());
 window.addEventListener("popstate",()=>choose(modeFromUrl()));
})();