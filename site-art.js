"use strict";
(function(){
 // Каждая картинка привязана только к одной конкретной методике.
 // Цифра справа - позиция в отдельном атласе 20 проверенных соответствий.
 const methodIndex=new Map([
  ["Опросник Басса - Дарки",0],
  ["Самооценка Дембо - Рубинштейн",1],
  ["Рисунок семьи",2],
  ["Тест школьной тревожности",3],
  ["Лесенка",4],
  ["Оценка школьной мотивации",5],
  ["Корректурная проба Бурдона - Анфимова",6],
  ["Таблицы Шульте",7],
  ["Заучивание 10 слов",8],
  ["Стандартные прогрессивные матрицы Равена",9],
  ["Социометрическое исследование класса",10],
  ["Графический диктант",11],
  ["Последовательные картинки",12],
  ["Кубики Косса",13],
  ["Тест руки (Hand Test)",14],
  ["Методика классификации предметов",15],
  ["Тест зрительно-моторной интеграции Бендер",16],
  ["Шкала самооценки Розенберга (RSES)",17],
  ["Сильные стороны и трудности (SDQ)",18],
  ["Рисуночный тест фрустрации",19]
 ]);
 // Отдельные 19 иллюстраций из второго архива - только для соответствующих пунктов панели.
 const topicIndex=new Map([
  ["Адаптация",0],["Тревожность",1],["Самооценка",2],["Семья",3],
  ["Внимание",4],["СДВГ",5],["Настроение",6],["Агрессия",7],
  ["Общение",8],["Мотивация",9],["Мониторинг риска",10],["ПМПК",11]
 ]);
 const areaIndex=new Map([
  ["preschool",12],["school",13],["adults",14],["special",15],
  ["documents",16],["spt",17],["prevention",18]
 ]);
 function sprite(kind,number){
  const rows=4,cols=5;
  if(number<0||number>=((kind==="method")?20:19))return null;
  const el=document.createElement("span");
  el.className="psy-picture psy-picture-"+kind;
  el.setAttribute("aria-hidden","true");
  el.style.setProperty("--art-x",(number%cols)/(cols-1)*100+"%");
  el.style.setProperty("--art-y",Math.floor(number/cols)/(rows-1)*100+"%");
  return el;
 }
 function drawCards(){
  document.querySelectorAll("#catalog article.method").forEach(card=>{
   if(card.dataset.psyArtReady==="1")return;
   card.dataset.psyArtReady="1";
   const name=card.querySelector("h3")?.textContent?.trim()||"";
   const icon=card.querySelector(".glyph");
   if(!icon)return;
   // Новые миниатюры 61-100 создаются в каталоге до этого скрипта.
   // Не удаляем их и не подменяем старым атласом.
   if(icon.querySelector(".method-art-tile")){
    card.classList.add("psy-has-art");
    card.classList.remove("psy-no-art");
    return;
   }
   const index=methodIndex.get(name);
   if(index===undefined){
    // Карточка без подтвержденного изображения остается без картинки.
    icon.remove();
    card.classList.add("psy-no-art");
    return;
   }
   icon.replaceChildren(sprite("method",index));
   icon.classList.add("psy-art-glyph");
   card.classList.add("psy-has-art");
   card.classList.remove("psy-no-art");
  });
 }
 function drawSidebar(){
  document.querySelectorAll(".sidebar .navgroup[data-view]>.navicon, .sidebar .info-tree [data-view]>.navicon").forEach(icon=>{
   if(icon.dataset.psyArtReady==="1")return;
   const index=areaIndex.get(icon.parentElement.dataset.view);
   if(index===undefined)return;
   icon.replaceChildren(sprite("panel",index));
   icon.classList.add("psy-art-navicon");
   icon.dataset.psyArtReady="1";
  });
  document.querySelectorAll(".sidebar [data-topic]").forEach(btn=>{
   if(btn.dataset.psyArtReady==="1")return;
   btn.dataset.psyArtReady="1";
   const index=topicIndex.get(btn.dataset.topic);
   if(index===undefined)return; // 'Программы': нет отдельного изображения в архиве.
   const icon=document.createElement("span");
   icon.className="psy-art-topic";
   icon.appendChild(sprite("panel",index));
   btn.prepend(icon);
  });
 }
 function draw(){drawSidebar();drawCards();}
 window.PSY_ART={matchingMethods:methodIndex.size,panelPictures:19,decorate:draw};
 draw();
 const list=document.getElementById("catalog"),topics=document.getElementById("topics");
 if(list)new MutationObserver(drawCards).observe(list,{childList:true});
 if(topics)new MutationObserver(drawSidebar).observe(topics,{childList:true});
 if(new URLSearchParams(location.search).get("area")==="spt"){
  const tree=document.getElementById("informationGroup"),button=document.querySelector('[data-section="informationGroup"]');
  if(tree)tree.hidden=false;
  if(button)button.setAttribute("aria-expanded","true");
 }
})();
