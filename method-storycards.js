"use strict";
(function(){
 const NAME="Последовательные картинки",ABC=["A","B","C","D"];
 const SERIES=[{name:"Серия 1",title:"Как вырос цветок",mix:[2,0,3,1],key:["B","D","A","C"]},{name:"Серия 2",title:"Бумажный самолетик",mix:[3,1,0,2],key:["C","B","D","A"]}];
 const SOURCE="https://iro86.ru/images/documents/CPMPK/Pakety/Paket_2_dlya_psihologa.pdf";
 const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const pot='<path d="M85 100H155L145 147H95Z" fill="#d99f73" stroke="#90684c" stroke-width="3"/><ellipse cx="120" cy="102" rx="35" ry="7" fill="#7c5942"/>';
 const stem='<path d="M120 104V66" stroke="#398552" stroke-width="5" stroke-linecap="round"/><path d="M120 91Q92 69 90 95Q110 104 120 91M121 80Q147 61 154 83Q137 100 121 80" fill="#71b777" stroke="#398552" stroke-width="2"/>';
 const desk='<rect x="7" y="129" width="226" height="14" rx="5" fill="#aa886c"/>';
 function draw(story,stage){
  let art="";
  if(story===0){
    art=pot;
    if(stage===0)art+='<ellipse cx="120" cy="75" rx="9" ry="7" fill="#97704b"/><path d="M121 90V98" stroke="#72975f" stroke-width="2" stroke-dasharray="3 3"/><path d="M57 58Q76 44 90 70" fill="none" stroke="#d89a7e" stroke-width="12" stroke-linecap="round"/>';
    if(stage===1)art+='<path d="M35 60H83V88Q60 96 35 88Z" fill="#8dbad0" stroke="#4a8da9" stroke-width="3"/><path d="M78 69Q107 67 119 82" fill="none" stroke="#4a8da9" stroke-width="5"/><path d="M113 88l-5 12M128 86l-5 12M142 90l-5 12" stroke="#4a9fca" stroke-width="4" stroke-linecap="round"/>';
    if(stage===2)art+=stem;
    if(stage===3)art+=stem+'<circle cx="120" cy="50" r="23" fill="#f0c65e" stroke="#dc9d43" stroke-width="3"/><circle cx="120" cy="50" r="11" fill="#bd7a41"/>';
  }else{
    if(stage===0)art=desk+'<rect x="73" y="31" width="96" height="96" rx="2" fill="white" stroke="#8ca9aa" stroke-width="3"/><path d="M92 68h60M92 84h60" stroke="#d9e7e8" stroke-width="3"/>';
    if(stage===1)art=desk+'<path d="M74 99L124 35 161 121Z" fill="#fdfefb" stroke="#8ea8a5" stroke-width="3"/><path d="M124 35V121" stroke="#8ea8a5" stroke-width="3"/><path d="M52 81q11-15 25-1M179 82q-14-15-25-1" fill="none" stroke="#d69d76" stroke-width="13" stroke-linecap="round"/>';
    if(stage===2)art=desk+'<path d="M36 111L189 53 117 123 106 93Z" fill="#fefefa" stroke="#6c93a3" stroke-width="3"/><path d="M106 93L189 53 117 123" fill="#d6e9ed" stroke="#6c93a3" stroke-width="2"/>';
    if(stage===3)art='<path d="M39 47q24-29 51-4M163 33q25-24 49 1" fill="none" stroke="#d9eaee" stroke-width="8" stroke-linecap="round"/><path d="M42 118L191 48 121 122 106 90Z" fill="#fff" stroke="#6997a9" stroke-width="3"/><path d="M106 90L191 48 121 122" fill="#d1e7ec" stroke="#6997a9" stroke-width="2"/><path d="M56 143l-18 10M76 148l-14 12" stroke="#94c3cf" stroke-width="5" stroke-linecap="round"/>';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 240 170" aria-label="Сюжетная картинка"><rect width="240" height="170" rx="13" fill="#f0f6ee"/><rect y="122" width="240" height="48" fill="#e7efdd"/>'+art+'</svg>';
 }
 function gallery(i){
   return '<div class="psy-story-gallery">'+SERIES[i].mix.map((stage,j)=>'<div class="psy-story-card"><b>'+ABC[j]+'</b>'+draw(i,stage)+'</div>').join("")+'</div>';
 }
 const METHOD={
 author:"А. Н. Бернштейн (основополагающий подход); новые стимульные серии - Психотека",
 age:"От 5 лет ориентировочно, нормативная валидизация этих серий отсутствует",
 kind:"Наглядно-образная диагностическая проба",
 count:"2 серии по 4 картинки + устный рассказ",
 goal:"Изучение последовательности событий, причинно-следственных связей и способности составить связный рассказ.",
 instructions:"Предъявите четыре отдельных кадра в перемешанном порядке. Попросите расположить их от начала к завершению истории и рассказать, что произошло. Запишите первый самостоятельный порядок. Помощь оказывают и записывают только после первой попытки.",
 scoring:"Для двух оригинальных серий Психотеки сравнивается порядок карточек с авторским решением. Подсчитываются правильные позиции и соседние переходы, отдельно фиксируются рассказ, помощь и время. Это не возрастные стандартизированные баллы.",
 interpret:"Оценивайте связность рассказа, причинно-следственные объяснения, помощь и самокоррекцию; допускайте логически обоснованные альтернативы. По одной пробе диагноз не ставится.",
 warning:"Сюжетные иллюстрации созданы для Психотеки и не являются стандартизированными карточками Бернштейна, Забрамной или Семаго. Автоматические показатели описывают совпадение с подготовленным сюжетом, без возрастных норм.",
 source:SOURCE,
 guideFile:"downloads/sequential_pictures_guide.docx",
 answerFile:"downloads/sequential_pictures_cards.html",
 workflow:"storycards",calculator:true,
 scaleLabels:["Установление последовательности","Причинно-следственные связи","Связность рассказа","Самостоятельность"],
 questions:["Серия 1","Серия 2"],series:SERIES
 };
 window.PSY_FULL_METHODS[NAME]=METHOD;
 function inspect(a){
  const value=Array.from({length:8},(_,i)=>String(a?.[i]??"").toUpperCase());
  return SERIES.map((s,i)=>{
    const o=value.slice(i*4,i*4+4);
    if(o.some(x=>!ABC.includes(x)))return {status:"incomplete",order:o};
    if(new Set(o).size!==4)return {status:"invalid",order:o};
    const positions=o.filter((x,j)=>x===s.key[j]).length;
    const transitions=o.slice(0,3).filter((x,j)=>s.key.indexOf(x)+1===s.key.indexOf(o[j+1])).length;
    return {status:"complete",order:o,positions,transitions,maxPositions:4,maxTransitions:3,reference:s.key.slice()};
  });
 }
 function score(d,a){
   const results=inspect(a);
   return results.every(x=>x.status==="complete")?{series:results,positions:results.reduce((v,r)=>v+r.positions,0),transitions:results.reduce((v,r)=>v+r.transitions,0),maxPositions:8,maxTransitions:6}:null;
 }
 window.PSY_STORYCARDS={draw,gallery,series:SERIES,inspect,score,escape};
})();