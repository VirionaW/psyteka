"use strict";
/* Показываем перенесенные специализированные программы в разделе ОВЗ.
 * Источники и портфолио берутся из исходной записи каталога.
 */
(function(){
 const root=document.getElementById("specialView");
 const programs=window.PSY_SPECIAL_CATALOG||[];
 if(!root||!Array.isArray(programs)||programs.length===0)return;
 const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
 })[c]);
 const section=document.createElement("section");
 section.className="psy-special-programs";
 section.id="specialProgramCatalog";
 section.setAttribute("aria-labelledby","specialProgramsHeading");
 const names={
  "Ступени развития":{age:"5-9 классы",purpose:"Коррекционные занятия для обучающихся с ЗПР"},
  "Сенсорная интеграция для обучающихся с РАС и ТМНР":{
   age:"Школьники; возрастную версию уточнять по программе",
   purpose:"Коррекционно-развивающая программа по сенсорной интеграции для РАС и ТМНР"
  }
 };
 const renderCard=m=>{
  const meta=names[m.name]||{};
  const source=/^https:\/\//i.test(m.source||"")?m.source:"";
  const action=source?'<a class="btn" href="'+escapeHTML(source)+'" target="_blank" rel="noopener noreferrer">Первоисточник</a>':"";
  return '<article class="psy-special-program-card"><h3>'+escapeHTML(m.name)+'</h3>'+
   '<p>'+escapeHTML(m.author||"Автор не установлен")+'</p>'+
   '<p class="psy-special-program-purpose">'+escapeHTML(meta.purpose||m.goal)+'</p>'+
   '<p><b>Группа:</b> '+escapeHTML(meta.age||"Уточнить возрастную редакцию")+'</p>'+
   '<div class="actions"><button type="button" class="btn primary" data-psy-program-open="'+escapeHTML(m.id)+'">Открыть портфолио</button>'+action+'</div></article>';
 };
 section.innerHTML='<h2 id="specialProgramsHeading">Специализированные коррекционные программы</h2>'+
  '<p>Программы, предназначенные для конкретных категорий ОВЗ. Полные тексты и возрастные условия сверяйте с указанным первоисточником.</p>'+
  '<div class="psy-special-program-list">'+programs.map(renderCard).join("")+'</div>';
 root.appendChild(section);
 const search=root.querySelector("#specialSearch");
 const age=root.querySelector("#specialAge");
 const update=()=>{
  const q=(search?.value||"").trim().toLocaleLowerCase("ru");
  const currentAge=age?.value||"";
  let visible=0;
  section.querySelectorAll(".psy-special-program-card").forEach((card,i)=>{
   const m=programs[i];
   const text=[m.name,m.author,m.goal,names[m.name]?.purpose].join(" ").toLocaleLowerCase("ru");
   const show=(!q||text.includes(q))&&(!currentAge||currentAge==="Школьники");
   card.hidden=!show;
   if(show)visible++;
  });
  section.hidden=visible===0;
 };
 search?.addEventListener("input",update);
 age?.addEventListener("change",update);
 section.addEventListener("click",e=>{
  const btn=e.target.closest("[data-psy-program-open]");
  if(!btn)return;
  const m=programs.find(item=>item.id===btn.dataset.psyProgramOpen);
  if(m&&typeof window.openMethod==="function")window.openMethod(m);
 });
 update();
})();
