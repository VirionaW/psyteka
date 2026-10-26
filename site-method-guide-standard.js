"use strict";
/* ТЗ 05 – evidence-based version chooser and four-part methodology checklist.
   A missing source is NOT an invitation to invent questions, norm tables or words to read aloud. */
(function(){
 const records={
  "Лесенка":{
   age:"5-10 лет (семь ступенек, выбранная опубликованная редакция)",
   ages:[{id:"ladder7",label:"5-10 лет · семь ступенек (1 внизу, 7 наверху)",age:"5-10 лет",status:"ready",source:"https://www.art-talant.org/publikacii/65410-komplekt-elektronnyh-testov-kak-sredstvo-formirovaniya-adekvatnoy-samoocenki-rezulytatov-uchebnoy-deyatelynosti-obuchayuschihsya-3-klassa"}],
   spoken:"Посмотри на лесенку. На верхних ступеньках стоят дети, которые считают себя хорошими. На нижних – те, кто думает о себе плохо. Посередине стоят те, кто не считает себя ни хорошим, ни плохим. Покажи, куда бы ты поставил себя. Почему ты выбрал эту ступеньку?",
   spokenNote:"Рабочая формулировка по семиступенчатому варианту. Перед стандартизированным обследованием сверяйте с текстом выбранного источника."
  },
  "Самооценка Дембо – Рубинштейн":{
   age:"10-17 лет (выбранная модификация А. М. Прихожан)",
   spoken:"Перед тобой семь линий. Каждая показывает одно качество. Самая нижняя точка – самый низкий уровень, верхняя – самый высокий. Отметь чертой, как ты оцениваешь себя сейчас, а крестиком – каким хотел бы быть. Сначала попробуем на шкале «Здоровье».",
   spokenNote:"Рабочая инструкция к размещенному комплекту из семи линий. Печатать без подгонки масштаба."
  },
  "SCARED":{
   age:"8-18 лет (отдельные детская и родительская формы)",
   ages:[
    {id:"child",label:"8-18 лет · самоотчет ребенка",age:"8-18 лет",status:"ready",source:"https://ncpal.org/sites/default/files/2025-03/SCARED-Ages8-18-Child-Screening-English.pdf"},
    {id:"parent",label:"8-18 лет · родительская форма",age:"8-18 лет",status:"ready",source:"https://ncpal.org/sites/default/files/2025-03/SCARED-Ages8-18-Parent-Screening-English.pdf"}
   ],
   spoken:"Прочитай каждое утверждение в полной форме опросника и отметь, как часто это происходило с тобой за последние три месяца. Если смысл какого-то утверждения непонятен, скажи мне.",
   spokenNote:"При родительской форме инструкция адресуется родителю, а не ребенку. Обработка информантов – раздельно."
  },
  "Сильные стороны и трудности (SDQ)":{
   age:"2-4 / 4-10 / 11-17 лет / 18+ – выберите официальную форму",
   ages:[
    {id:"p24",label:"2-4 года · родители или воспитатели",age:"2-4 года",status:"source",source:"https://www.sdqinfo.org/py/sdqinfo/b3.py?language=Englishqz%28USA%29"},
    {id:"p410",label:"4-10 лет · родители или педагоги",age:"4-10 лет",status:"source",source:"https://www.sdqinfo.org/py/sdqinfo/b3.py?language=Englishqz%28USA%29"},
    {id:"p1117",label:"11-17 лет · родители или педагоги",age:"11-17 лет",status:"source",source:"https://www.sdqinfo.org/py/sdqinfo/b3.py?language=Englishqz%28USA%29"},
    {id:"s1117",label:"11-17 лет · самоотчет подростка",age:"11-17 лет",status:"source",source:"https://www.sdqinfo.org/py/sdqinfo/b3.py?language=Englishqz%28USA%29"},
    {id:"s18",label:"18 лет и старше · самоотчет взрослого",age:"18 лет и старше",status:"source",source:"https://www.sdqinfo.org/py/sdqinfo/b3.py?language=Englishqz%28USA%29"}
   ]
  },
  "Краткий опросник настроения (SMFQ)":{age:"6-17 лет (детский самоотчет; проверка понимания пунктов)"},
  "Vanderbilt Assessment Scales":{age:"6-12 лет (NICHQ, формы первоначальной оценки)"},
  "RCADS-47":{age:"8-18 лет (формы по выбранной редакции; комплект не подтвержден)"},
  "PHQ-A - опросник депрессивных симптомов подростков":{age:"12-17 лет (комплект не подтвержден)"},
  "Школа зверей":{age:"6-8 лет (проверить границы используемой редакции)"},
  "Что мне нравится в школе":{age:"6-10 лет (выбранный рисунок; без возрастных норм)"},
  "Оценка школьной мотивации":{age:"7-10 лет (опросник Н. Г. Лускановой)"},
  "Самооценка Дембо – Рубинштейн":{age:"10-17 лет (модификация А. М. Прихожан)"}
 };
 records["Самооценка Дембо – Рубинштейн"].spoken="Перед тобой семь линий. Каждая показывает одно качество. Самая нижняя точка – самый низкий уровень, верхняя – самый высокий. Отметь чертой, как ты оцениваешь себя сейчас, а крестиком – каким хотел бы быть. Сначала попробуем на шкале «Здоровье».";
 records["Самооценка Дембо – Рубинштейн"].spokenNote="Рабочая инструкция к размещенному комплекту. Печатать без подгонки масштаба.";
 const selected={};
 const escape=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
 const ageClaim=(age)=>{
  const a=String(age||"");
  if(!a||/зависит|уточня|проверя|ориентиров|школьный возраст|от \d+ лет|подростки и взрослые|старший дошкольный|дошкольного и младшего|взрослые и дети|по выбранной версии/i.test(a))return "";
  if(/\d+\s*[-–]\s*\d+\s*лет|\d+\s*[-–]\s*\d+\s*года|18\+|18 лет и старше|от \d+ до \d+/i.test(a))return a.replaceAll("—","–");
  return "";
 };
 function data(name){return records[name]||{};}
 function choice(name){const r=data(name);return r.ages?.find(x=>x.id===selected[name])||r.ages?.[0]||null;}
 function age(name,d,m){
  const r=data(name),v=choice(name);
  if(v)return v.age+" – "+v.label.split(" · ").slice(1).join(" · ");
  if(r.age)return r.age;
  const candidate=ageClaim(d?.age||m?.age);
  return candidate||"Возрастная редакция не подтверждена – требуется проверенный источник";
 }
 function versions(name){
  const r=data(name),v=choice(name);
  if(!r.ages?.length)return "";
  const options=r.ages.map(x=>'<option value="'+escape(x.id)+'"'+(v?.id===x.id?' selected':'')+'>'+escape(x.label)+'</option>').join("");
  return '<section class="psy-guide-versions"><h3>Возрастная версия и форма</h3>'+
   '<label>Выберите вариант обследования<select data-psy-age-version="'+escape(name)+'">'+options+'</select></label>'+
   '<p>Выбрано: <strong>'+escape(v.label)+'</strong></p>'+
   (v.source?'<p><a href="'+escape(v.source)+'" target="_blank" rel="noopener noreferrer">Документ выбранной версии ↗</a></p>':'')+
   (v.status==='source'?'<p class="psy-guide-verify">На сайте пока есть только ссылка на официальный комплект. Бланк и автоматический подсчет этой версии в Психотеке не проверены и не предоставляются.</p>':'')+
   '</section>';
 }
 function supplement(name,d,m,existing){
  const r=data(name),text=String(existing||"");
  const hasData=!!d;
  const fields=[
   ["Цель методики",d?.goal||"Цель конкретной редакции не подтверждена."],
   ["Инструкция обследуемому – текст для чтения",r.spoken||(hasData?"Дословный текст для чтения не подтвержден. Используйте оригинальный бланк или проверенное руководство конкретной редакции. Описание процедуры ниже предназначено психологу.":"Для этой записи нет подтвержденной инструкции обследуемому. Используйте первоисточник, а не придумывайте текст.")],
   ["Ключ и правила обработки",d?.scoring||"Ключ и правила подсчета этой редакции не проверены. Автоматический результат недоступен."],
   ["Интерпретация и ограничения",d?.interpret||"Интерпретация для выбранной редакции не подтверждена. Не делайте диагностических выводов по карточке."]
  ];
  const seen=plain=>new RegExp("<h[2-4][^>]*>\\s*"+plain,"i").test(text);
  // Specialized method tabs retain their original rich content. Provide required sections once in the
  // common standard header, rather than forcing changes to protected stimulus/calculator logic.
  const html=fields.map(([label,value],i)=>{
   if(i!==1&&seen(i===0?"Цель":i===2?"Ключ":"Интерпретация"))return "";
   const warn=!(i===1?r.spoken:hasData&&d?.[["goal","instructions","scoring","interpret"][i]])||i===1&&!r.spoken;
   return '<section class="psy-guide-check'+(warn?' needs-source':'')+'"><h3>'+escape(label)+'</h3>'+
    (i===1&&r.spoken?'<blockquote class="psy-guide-spoken">'+escape(value)+'</blockquote>':'<p>'+escape(value)+'</p>')+
    (i===1&&r.spokenNote?'<p class="psy-guide-note">'+escape(r.spokenNote)+'</p>':'')+
    '</section>';
  }).join("");
  return '<div class="psy-guide-audit"><p class="psy-guide-age"><strong>Возраст выбранной редакции:</strong> '+escape(age(name,d,m))+'</p>'+
   versions(name)+html+'</div>'+text;
 }
 function bind(reopen){document.querySelectorAll('[data-psy-age-version]').forEach(el=>el.addEventListener('change',()=>{
   const name=el.getAttribute('data-psy-age-version'),r=data(name);
   if(r.ages?.some(x=>x.id===el.value)){selected[name]=el.value;if(typeof reopen==='function')reopen();}
 }));}
 window.PSY_GUIDE_STANDARD={data,age,choice,versions,supplement,bind,records};
})();
