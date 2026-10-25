"use strict";
(function(){
 // 60 illustrations of methods + 19 illustrations of sidebar sections.
 // Each picture shows only the illustrated portion of the supplied original PNG.
 const index=new Map([
  ["Опросник Басса - Дарки",2],
  ["Самооценка Дембо - Рубинштейн",3],
  ["Рисунок семьи",5],
  ["Тест школьной тревожности",8],
  ["Лесенка",11],
  ["Оценка школьной мотивации",12],
  ["Корректурная проба Бурдона - Анфимова",14],
  ["Таблицы Шульте",15],
  ["Заучивание 10 слов",17],
  ["Стандартные прогрессивные матрицы Равена",18],
  ["Социометрическое исследование класса",19],
  ["Графический диктант",23],
  ["Последовательные картинки",24],
  ["Исключение четвертого лишнего (словесный вариант)",25],
  ["Кубики Косса",28],
  ["Тест руки (Hand Test)",29],
  ["Методика классификации предметов",33],
  ["Классификация предметов (словесный вариант)",33],
  ["Тест зрительно-моторной интеграции Бендер",39],
  ["Шкала самооценки Розенберга (RSES)",52],
  ["Сильные стороны и трудности (SDQ)",53],
  ["Рисуночный тест фрустрации",56],
  ["Методика незаконченных предложений",57]
 ]);
 const side=new Map([
  ["Адаптация",0],["Тревожность",1],["Самооценка",2],["Семья",3],
  ["Внимание",4],["СДВГ",5],["Настроение",6],["Агрессия",7],
  ["Общение",8],["Мотивация",9],["Мониторинг риска",10],["ПМПК",11],
  ["Детский сад",12],["Школа",13],["Взрослые",14],["ОВЗ и инвалидность",15],
  ["Документация",16],["СПТ",17],["Профилактика и просвещение",18]
 ]);
 const fallback=new Map([
  ["Адаптация",0],["Тревожность",1],["Самооценка",2],["Семья",3],
  ["Внимание",4],["СДВГ",5],["Настроение",6],["Агрессия",7],
  ["Общение",8],["Мотивация",9],["Мониторинг риска",10],["ПМПК",11],["Программы",18]
 ]);
 function cell(n){
  const x=n%10,y=Math.floor(n/10);
  if(n<0||n>=79)throw Error("Asset index out of range");
  const span=document.createElement("span");
  span.className="psy-sprite";
  span.setAttribute("aria-hidden","true");
  span.style.setProperty("--sprite-x",(x/9*100).toFixed(5)+"%");
  span.style.setProperty("--sprite-y",(y/7*100).toFixed(5)+"%");
  return span;
 }
 const viewIndex={preschool:12,school:13,adults:14,special:15,documents:16,spt:17,prevention:18};
 function sideIcon(view){const v=viewIndex[view];return typeof v==="number"?v+60:null}
 function decorateSidebar(){
  document.querySelectorAll(".sidebar [data-view] .navicon").forEach(node=>{
   if(node.dataset.psyImage)return;
   const v=sideIcon(node.parentElement.dataset.view);
   if(v==null)return;
   node.textContent="";
   node.appendChild(cell(v));
   node.dataset.psyImage=String(v);
  });
  document.querySelectorAll(".sidebar [data-topic]").forEach(btn=>{
   if(btn.dataset.psyImage)return;
   const v=fallback.get(btn.dataset.topic);
   if(v==null)return;
   const icon=document.createElement("span");
   icon.className="psy-topic-icon";
   icon.appendChild(cell(v+60));
   btn.prepend(icon);
   btn.dataset.psyImage=String(v+60);
  });
 }
 function decorateCards(){
  document.querySelectorAll("#catalog article.method").forEach(card=>{
   if(card.dataset.psyImage)return;
   const name=card.querySelector("h3")?.textContent?.trim()||"";
   const icon=card.querySelector(".glyph");
   if(!icon)return;
   const item=(window.PSY_CATALOG||[]).find(m=>m.name===name);
   const direct=index.get(name);
   const general=fallback.get(item?.theme);
   const position=typeof direct==="number"?direct-1:typeof general==="number"?general+60:null;
   if(position==null)return;
   card.dataset.psyImage=String(position);
   card.dataset.psyImageSource=typeof direct==="number"?"method":"section";
   icon.textContent="";
   icon.classList.add("psy-illustrated");
   icon.appendChild(cell(position));
  });
 }
 window.PSY_ART={matchingMethods:index.size,panelPictures:19,totalPictures:79,decorate:()=>{decorateSidebar();decorateCards()}};
 decorateSidebar();
 decorateCards();
 const catalog=document.getElementById("catalog");
 if(catalog)new MutationObserver(decorateCards).observe(catalog,{childList:true});
})();
