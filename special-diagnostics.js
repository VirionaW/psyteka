"use strict";
(function(){
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const pdf="https://www.mchatscreen.com/wp-content/uploads/2019/12/M-CHAT-R_F_Russian_v3.pdf";
 const sdqForms="https://www.sdqinfo.org/py/sdqinfo/b3.py?language=Russian";
 const sdqRules="https://www.sdqinfo.org/py/sdqinfo/c0.py";
 const definitions=[
  {
   id:"special-mchat-rf-ru-v3",title:"M-CHAT-R/F – скрининг риска РАС, русская версия 3",
   author:"D. L. Robins, D. Fein, M. Barton (2009); русский перевод Е. Морозовой",
   group:"Диагностика и наблюдение",topic:"Ранний скрининг РАС",
   ages:["Дошкольники"],ageLabel:"16-30 месяцев · родительская форма · русская версия 3",
   format:"Двухэтапный скрининговый опросник",goal:"Выявление риска РАС у детей раннего возраста с последующим уточняющим интервью при промежуточном риске.",
   source:pdf,original:"https://www.mchatscreen.com/",scoring:"https://www.mchatscreen.com/mchat-rf/scoring/",
   authorship:"© 2009 Robins, Fein & Barton. Официальная русская версия 3, перевод Елизаветы Морозовой.",
   variants:[{id:"ru-v3",label:"Русская версия 3, родители, 16-30 месяцев",age:"16-30 месяцев",url:pdf}],
   indicators:["20 пунктов первой стадии (родительский отчет)","Сумма по опубликованному ключу","Дополнительное интервью для промежуточного результата","Решение о дальнейшем обследовании, но не диагноз"],
   steps:[
    "Убедитесь, что возраст ребенка соответствует официальной редакции: 16-30 месяцев. Респондент – родитель или другой близкий взрослый, знакомый с повседневным поведением ребенка.",
    "Предложите родителю полностью заполнить официальный русскоязычный бланк M-CHAT-R. Не пропускайте пункты и не меняйте порядок вопросов.",
    "Подсчитайте первую стадию по оригинальному ключу из файла разработчиков. Для всех пунктов, кроме 2, 5, 12, риск отмечается ответом «Нет»; для пунктов 2, 5, 12 – ответом «Да».",
    "Для первой стадии оцените категорию: 0-2 – низкий риск; 3-7 – промежуточный, требуется последующее интервью; 8-20 – высокий, предусмотрено направление на диагностическое обследование без обязательного промежуточного интервью.",
    "Если первая стадия дала 3-7, специалист проводит именно опубликованное последующее интервью M-CHAT-R/F по пунктам, вызвавшим риск. После интервью 0-1 – отрицательный результат, 2 и больше – положительный.",
    "Сохраните оригинальные ответы и протокол специалиста вне публичного сайта. Отрицательный результат не исключает нарушений при наличии иных признаков, положительный не является диагнозом РАС."
   ],
   interpretation:"Скрининг риска, а не постановка диагноза. Высокий риск или положительное последующее интервью – основание для направления к профильным специалистам. При низком результате до 24 месяцев источник рекомендует повторное заполнение после достижения 24 месяцев. Выбор помощи не должен откладываться при явных трудностях развития.",
   limitations:"Опросник защищен авторским правом. Электронное воспроизведение пунктов, формы, ключа или программного опросника для других пользователей требует разрешения правообладателей. Поэтому Психотека предоставляет прямую ссылку на оригинал, а не копирует вопросы или электронный калькулятор."
  },
  {
   id:"special-sdq-ru",title:"SDQ – Сильные стороны и трудности (официальные русские формы)",
   author:"R. Goodman (1997); официальный русский перевод на sdqinfo.org",
   group:"Диагностика и наблюдение",topic:"Эмоциональная и поведенческая сфера",
   ages:["Дошкольники","Школьники"],ageLabel:"2-4, 4-17 и 11-17 лет · отдельные формы по информанту",
   format:"Опросник для родителей, педагогов и самоотчета",
   goal:"Оценка эмоциональных и поведенческих трудностей, отношений со сверстниками и просоциального поведения по соответствующей опубликованной форме SDQ.",
   source:sdqForms,original:"https://sdqinfo.org/",scoring:sdqRules,
   authorship:"Robert Goodman; правообладатель Youthinmind. Русские формы и сведения о переводе опубликованы на официальном сайте SDQ.",
   variants:[
    {id:"brief-p-t4-17",label:"Односторонняя форма, родители или педагоги, 4-17 лет",age:"4-17 лет",url:sdqForms},
    {id:"brief-s11-17",label:"Односторонний самоотчет, 11-17 лет",age:"11-17 лет",url:sdqForms},
    {id:"p2-4",label:"Родители, 2-4 года · версия с дополнительным блоком",age:"2-4 года",url:sdqForms},
    {id:"t2-4",label:"Педагоги, 2-4 года · версия с дополнительным блоком",age:"2-4 года",url:sdqForms},
    {id:"p4-17",label:"Родители, 4-17 лет · версия с дополнительным блоком",age:"4-17 лет",url:sdqForms},
    {id:"t4-17",label:"Педагоги, 4-17 лет · версия с дополнительным блоком",age:"4-17 лет",url:sdqForms},
    {id:"s11-17",label:"Самоотчет, 11-17 лет · версия с дополнительным блоком",age:"11-17 лет",url:sdqForms},
    {id:"followup-p4-17",label:"Повторное наблюдение (follow-up), родители, 4-17 лет",age:"4-17 лет",url:sdqForms},
    {id:"followup-t4-17",label:"Повторное наблюдение (follow-up), педагоги, 4-17 лет",age:"4-17 лет",url:sdqForms},
    {id:"followup-s11-17",label:"Повторный самоотчет (follow-up), 11-17 лет",age:"11-17 лет",url:sdqForms}
   ],
   indicators:["Эмоциональные симптомы","Поведенческие трудности","Гиперактивность / невнимательность","Отношения со сверстниками","Просоциальное поведение"],
   steps:[
    "До начала определите возраст и информанта: для 2-4 лет – родитель или педагог; для 4-17 лет – родитель или педагог; для 11-17 лет есть отдельный самоотчет. Отдельно представлены односторонние, полные и повторные (follow-up) редакции.",
    "Откройте официальную русскоязычную страницу SDQ, выберите соответствующую возрастную и информантную форму. Не переносите ответы из одной формы в другую.",
    "Передайте полный оригинальный бумажный опросник нужному информанту, не изменяя формулировки, порядок и состав пунктов.",
    "Подсчитайте результат только по правилам конкретной редакции; для дошкольной формы, школьной формы и разных информантов различаются инструкции и допустимые интерпретации.",
    "Для электронного подсчета используйте официальный сервис правообладателя либо получите разрешение на электронную реализацию; Психотека не содержит собственной электронной формы SDQ.",
    "Интерпретируйте показатели в контексте наблюдения, сведений от разных информантов и особенностей ребенка. Один профиль SDQ не устанавливает клинический диагноз."
   ],
   interpretation:"В опубликованных формах используются пять содержательных шкал; четыре шкалы трудностей могут образовывать общий показатель трудностей, просоциальное поведение учитывается отдельно. Пороговые значения, обратные пункты, правила пропусков и дополнительные вопросы берутся из официальной схемы конкретной возрастной и информантной редакции.",
   limitations:"SDQ защищен авторским правом Youthinmind. Правообладатель прямо запрещает создание и распространение электронных анкет и автоматического подсчета без разрешения. В Психотеке находятся только сведения о редакциях, профессиональное описание и ссылки на официальные материалы. Здесь нельзя использовать возрастные нормы от другой версии."
  }
 ];
 const byId=new Map(definitions.map(m=>[m.id,m]));
 const selection=new Map(definitions.map(m=>[m.id,m.variants[0].id]));
 function chosen(m){return m.variants.find(v=>v.id===selection.get(m.id))||m.variants[0];}
 for(const m of definitions){
  if(window.PSY_FULL_METHODS[m.title])throw Error("Дублирующее диагностическое название: "+m.title);
  window.PSY_FULL_METHODS[m.title]={
   workflow:"specialSource",sourceId:m.id,author:m.author,age:m.ageLabel,kind:m.format,
   goal:m.goal,indicatorsTitle:"Оцениваемые показатели",indicators:m.indicators,
   count:m.id==="special-mchat-rf-ru-v3"?"20 пунктов первой стадии + интервью":"25 пунктов на форму, 5 шкал",
   calculator:false,source:m.source,interpret:m.interpretation
  };
 }
 const link=(url,label)=>'<a class="btn primary" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+'</a>';
 function portfolio(d){
  const m=byId.get(d.sourceId);
  return '<section class="psy-portfolio-reference psy-portfolio-unified">'+
   '<h3>Общие сведения</h3><div class="psy-profile-lines">'+[
    ["Название",m.title],["Автор и редакция",m.author],["Подтвержденный возраст",m.ageLabel],
    ["Тип",m.format],["Авторские права и перевод",m.authorship]
   ].map(([a,b])=>'<div class="psy-profile-row"><strong>'+esc(a)+'</strong><span>'+esc(b)+'</span></div>').join("")+'</div>'+
   '<h3>Цель</h3><p class="psy-profile-description">'+esc(m.goal)+'</p>'+
   '<h3>Показатели</h3><div class="psy-profile-indicators">'+m.indicators.map(v=>'<div class="psy-profile-indicator"><span>'+esc(v)+'</span></div>').join("")+'</div>'+
   '<h3>Опубликованные редакции</h3><div class="psy-special-versions">'+m.variants.map(v=>'<p>'+esc(v.label)+'</p>').join("")+'</div>'+
   '<h3>Первоисточник и ограничения</h3><p>'+link(m.original,"Официальный сайт метода")+'</p><p>'+esc(m.limitations)+'</p></section>';
 }
 function guideContent(m){
  return '<section class="psy-special-guide"><h3>Методика и происхождение</h3><p>'+esc(m.title)+'. '+esc(m.authorship)+'</p>'+
   '<h3>Цель и возраст</h3><p>'+esc(m.goal)+'</p><p>'+esc(m.ageLabel)+'</p>'+
   '<h3>Инструкция обследуемому / родителю</h3><p>Дословная инструкция содержится в официальном авторском бланке выбранной редакции. Для сохранения авторского текста и порядка пунктов ее следует читать или предъявлять непосредственно по оригинальному документу без изменений. Отдельная придуманная инструкция в Психотеке не используется.</p>'+
   '<h3>Подготовка и материалы</h3><p>Полный опубликованный бумажный опросник соответствующей редакции, официальное руководство и бланк регистрации для специалиста. Уточните доступный способ ответа; любое изменение стандартизированной процедуры фиксируйте отдельно и не переносите на него нормы без подтвержденной валидизации.</p>'+
   '<h3>Процедура</h3><ol>'+m.steps.map(v=>'<li>'+esc(v)+'</li>').join("")+'</ol>'+
   '<h3>Ключ и правила обработки</h3><p>'+(m.id==="special-mchat-rf-ru-v3"?
    'По русской версии 3 риск отмечается ответом «Да» только для пунктов 2, 5 и 12; для прочих пунктов риск отмечается ответом «Нет». 0-2 – низкий, 3-7 – промежуточный с дополнительным интервью, 8-20 – высокий риск. Для дополнительного интервью порог положительного результата – 2 и более. Полная процедура подсчета находится в официальном документе.':
    'Оценки, обратные пункты, обработка пропусков и нормы различаются по возрастной и информантной редакции. Для корректного результата используйте официальный подсчет Youthinmind; собственная электронная анкета или калькулятор SDQ на сайте не создается.')+'</p>'+
   '<h3>Интерпретация</h3><p>'+esc(m.interpretation)+'</p>'+
   '<h3>Ограничения и лицензия</h3><p>'+esc(m.limitations)+'</p>'+
   '<h3>Оригинальная редакция</h3><p>'+link(m.source,"Открыть официальный материал")+'</p></section>';
 }
 function instruction(d){
  const m=byId.get(d.sourceId);
  return '<div class="psy-common-guide-head"><h3>Методика / руководство</h3><div class="psy-common-guide-actions">'+
   '<button type="button" class="btn" data-source-print="guide">Без бланка</button>'+
   '<button type="button" class="btn primary" data-source-print="combined" title="Открывает авторский бланк отдельно">С бланком</button></div></div>'+guideContent(m);
 }
 function materials(d){
  const m=byId.get(d.sourceId),v=chosen(m);
  return '<div class="psy-common-guide-head"><h3>Оригинальный бланк</h3></div>'+
   '<p>Выберите опубликованную редакцию. Ссылка ведет к документу правообладателя или на его официальную страницу с формами. Вариант «С бланком» открывает оригинал отдельно от руководства.</p>'+
   (m.variants.length>1?
    '<label class="psy-special-source-choice">Возраст и информант<select data-source-variant="'+esc(m.id)+'">'+
    m.variants.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===v.id?'selected':'')+'>'+esc(x.label)+'</option>').join("")+'</select></label>':
    '<p><b>Форма:</b> '+esc(v.label)+'</p>')+
   '<p class="psy-special-source-current" id="sourceCurrent">Выбрано: '+esc(v.label)+'</p>'+
   '<p>'+link(v.url,"Открыть официальный бланк")+'</p>'+
   '<p>Для бумажной работы распечатайте документ из официального источника без исправления авторского текста и указаний об авторских правах.</p>';
 }
 function calculator(d){
  const m=byId.get(d.sourceId);
  return '<section class="psy-special-calc"><h3>Обработка по оригинальной редакции</h3>'+
   '<p>Для данного защищенного опросника не предусмотрена самостоятельная электронная анкета или автоматический расчет на Психотеке.</p>'+
   '<p>'+esc(m.interpretation)+'</p><p>'+esc(m.limitations)+'</p>'+
   '<p>'+link(m.scoring,"Открыть официальные правила обработки")+'</p>'+
   '<p>'+link(m.source,"Открыть исходный бланк")+'</p></section>';
 }
 function complete(){return false;}
 function updateFooter(){
  const badge=document.getElementById("specialFooterStatus");
  if(!badge)return;
  badge.className="psy-special-footer-state external";
  badge.textContent="Подсчет по первоисточнику";
 }
 function bind(d){
  const body=document.getElementById("modalBody");if(!body)return;
  const m=byId.get(d.sourceId);
  body.querySelectorAll("[data-source-variant]").forEach(el=>el.addEventListener("change",()=>{
   const v=m.variants.find(x=>x.id===el.value);if(!v)return;
   selection.set(m.id,v.id);
   const line=body.querySelector("#sourceCurrent");if(line)line.textContent="Выбрано: "+v.label;
   const a=body.querySelector('a[href^="https://"]');if(a)a.href=v.url;
  }));
  body.querySelectorAll("[data-source-print]").forEach(el=>el.addEventListener("click",()=>print(d,el.dataset.sourcePrint)));
 }
 function print(d,mode){
  const m=byId.get(d.sourceId);
  if(mode==="blank"||mode==="combined"||mode==="result"){
   window.open((mode==="result"?m.scoring:chosen(m).url),"_blank","noopener,noreferrer");
   return;
  }
  const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>'+esc(m.title)+
   '</title><style>@page{size:A4 portrait;margin:16mm}body{font:11pt/1.4 Arial,sans-serif;color:#222}h2{font-size:17pt}h3{font-size:12pt;margin-top:16px;break-after:avoid}li{margin:6px 0}p{overflow-wrap:anywhere}a{color:inherit;text-decoration:underline}.btn{font-weight:700}</style></head><body><h2>'+esc(m.title)+'</h2>'+
   guideContent(m)+'<p><b>Оригинальный бланк печатается только из официального источника, отдельно от этого руководства.</b></p></body></html>';
  const frame=document.createElement("iframe");frame.style.cssText="position:fixed;width:0;height:0;border:0";frame.title="Печать методического руководства";document.body.appendChild(frame);
  frame.onload=()=>{try{frame.contentWindow.focus();frame.contentWindow.print();}finally{setTimeout(()=>frame.remove(),1800);}};
  frame.srcdoc=html;
 }
 const original=window.PSY_SPECIAL_TOOLKIT;
 if(!original)throw Error("Модуль ОВЗ не найден");
 const api={methods:definitions,portfolio,instruction,materials,calculator,complete,updateFooter,bind,print};
 for(const k of ["portfolio","instruction","materials","calculator","complete","updateFooter","bind","print"]){
  const old=original[k];
  original[k]=function(d,...args){return byId.has(d?.sourceId)?api[k](d,...args):old(d,...args);};
 }
 original.methods.push(...definitions);
 window.PSY_SPECIAL_EVIDENCE=api;
})();