"use strict";
(function(){
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const matrix="https://www.communicationmatrix.org/";
 const matrixGuide="https://www.communicationmatrix.org/Matrix/Pages/UsingTheMatrix";
 const matrixResearch="https://www.communicationmatrix.org/Matrix/Pages/ResearchBasis";
 const gmfcs="https://canchild.ca/resources/42-gmfcs-e-r/";
 const gmfcsRussian="https://canchild.ca/system/tenon/assets/attachments/000/000/077/original/GMFCS-ER_Translation-Russian.pdf";
 const cars="https://www.pearsonassessments.com/store/en/usd/p/100000164.html";
 const vineland="https://www.pearsonassessments.com/store/en/usd/p/100001622.html";
 const records=[
  {
   id:"special-communication-matrix",title:"Communication Matrix – Матрица коммуникации",
   author:"Charity Rowland, Ph.D.; Oregon Health & Science University (первая версия 1990, переработка 2004)",
   group:"Диагностика и наблюдение",topic:"Альтернативная коммуникация",ages:["Дошкольники","Школьники","Взрослые"],
   ageLabel:"Все возрасты – при ранних стадиях развития коммуникации; возрастных нормативов нет",
   format:"Оценка функциональной коммуникации",goal:"Определить доступные способы выражения потребностей, намерений и сообщений у людей на ранних стадиях коммуникации.",
   source:matrix,original:matrix,scoring:matrixGuide,
   authorship:"Charity Rowland. Оригинальный сервис Communication Matrix, OHSU; русская онлайн-версия предоставляется самим сервисом.",
   variants:[
    {id:"matrix-online-ru",label:"Официальная онлайн-оценка – русский язык, все возрасты",age:"Любой возраст при раннем уровне коммуникации",url:matrix}
   ],
   indicators:["Функциональные коммуникативные намерения","Семь описанных уровней развития коммуникации","Вокальные и невокальные способы выражения","Освоенные и формирующиеся навыки"],
   steps:[
    "Проверьте, что цель исследования – ранние стадии коммуникации, а не измерение нормативного речевого интеллекта по возрасту.",
    "Откройте официальный сайт Communication Matrix, зарегистрируйтесь и выберите русский язык в интерфейсе.",
    "Заполните авторскую онлайн-матрицу на основании повседневных наблюдений и сведений человека или близких, не изменяя систему вопросов.",
    "При описании учитывайте альтернативную и дополнительную коммуникацию: жесты, взгляд, изображения, устройства, предметные символы и другие доступные средства.",
    "Просмотрите построенный авторским сервисом профиль освоенных и формирующихся способов коммуникации на семи уровнях.",
    "Выберите функциональные цели поддержки из официальных рекомендаций; для сравнения динамики проведите повторную оценку в том же сервисе."
   ],
   interpretation:"Семь уровней описывают переход от донамеренного поведения к языковому общению. Профиль отражает имеющиеся и формирующиеся навыки. Не превращайте уровень в возрастной диагноз и не рассчитывайте свои баллы вместо алгоритма авторского сервиса.",
   limitations:"Полный опросник, профиль и расчет принадлежат оригинальной Communication Matrix. Онлайн-доступ для ограниченного числа обследований бесплатный; при частом применении действуют условия и оплата сервиса. Не собирайте персональные данные в Психотеке; для работы используйте оригинальный сервис.",
   extra:matrixResearch
  },
  {
   id:"special-gmfcs-er",title:"GMFCS-E&R – система классификации больших моторных функций при ДЦП",
   author:"R. Palisano, P. Rosenbaum, D. Bartlett, M. Livingston (2007); русский перевод Н. Люкшиной (2012)",
   group:"Диагностика и наблюдение",topic:"Двигательная функция",ages:["Дошкольники","Школьники"],
   ageLabel:"До 2 лет; 2-4; 4-6; 6-12; 12-18 лет – пять отдельных возрастных описаний",
   format:"Классификация двигательных возможностей",goal:"Классифицировать привычную двигательную активность и мобильность детей и подростков с церебральным параличом по возрастной редакции GMFCS-E&R.",
   source:gmfcs,original:gmfcsRussian,scoring:gmfcs,
   authorship:"CanChild, McMaster University, GMFCS-E&R (2007); русская версия размещена на CanChild, перевод Н. Люкшиной (2012).",
   variants:[
    {id:"under2",label:"Дети младше 2 лет",age:"Младше 2 лет",url:gmfcs},
    {id:"2-4",label:"От 2 до неполных 4 лет",age:"2-4 года",url:gmfcs},
    {id:"4-6",label:"От 4 до неполных 6 лет",age:"4-6 лет",url:gmfcs},
    {id:"6-12",label:"От 6 до неполных 12 лет",age:"6-12 лет",url:gmfcs},
    {id:"12-18",label:"От 12 до 18 лет",age:"12-18 лет",url:gmfcs}
   ],
   indicators:["Текущие самостоятельные движения","Положение сидя и перемещение","Потребность во вспомогательных средствах","Один из пяти порядковых уровней GMFCS"],
   steps:[
    "Убедитесь, что используете классификацию именно для детей и подростков с ДЦП, а не как тест общего интеллектуального развития.",
    "Выберите в оригинальном переводе возрастную группу ребенка. Для недоношенных детей младше 2 лет авторский документ учитывает скорректированный возраст.",
    "Соберите сведения о привычной самостоятельной мобильности дома, в образовательной среде и вне ее. Не оценивайте только лучшее возможное выполнение разового упражнения.",
    "На официальной странице CanChild откройте перевод «GMFCS-E&R (Russian)» и прочитайте полные описания уровней I-V и их попарные различия для выбранного возраста.",
    "Определите уровень, который лучше всего описывает типичную повседневную двигательную функцию при актуальных условиях и средствах помощи.",
    "Запишите уровень, возрастную группу, условия передвижения и использованную редакцию. Не рассчитывайте средний балл уровней и не используйте классификацию как прогноз."
   ],
   interpretation:"GMFCS I-V – порядковые категории, а не интервальные баллы. Для интерпретации обязательны полные функциональные описания каждого уровня и возрастной группы из оригинальной русской версии; расстояния между категориями не равны.",
   limitations:"Метод является классификацией функционирования при ДЦП и не заменяет психологическую диагностику, медицинское обследование или оценку познавательных возможностей. Официальные определения уровней не воспроизводятся здесь вместо авторского документа.",
   extra:"https://canchild.ca/resources/42-gmfcs-e-r/"
  },
  {
   id:"special-cars2",title:"CARS-2 – шкала оценки проявлений аутизма, 2-я редакция",
   author:"E. Schopler, M. E. Van Bourgondien, G. J. Wellman, S. R. Love (2010)",
   group:"Диагностика и наблюдение",topic:"Оценка проявлений РАС",ages:["Дошкольники","Школьники","Взрослые"],
   ageLabel:"От 2 лет – ST; от 6 лет – HF для свободно говорящих людей с IQ выше 80; QPC – без балльной шкалы",
   format:"Лицензируемая рейтинговая шкала",goal:"Систематическая оценка выраженности связанных с аутизмом поведенческих характеристик подготовленным специалистом.",
   source:cars,original:cars,scoring:cars,
   authorship:"CARS-2, Pearson / Western Psychological Services, 2010; руководство и формы распространяются издателем.",
   variants:[
    {id:"cars-st",label:"CARS2-ST – стандартная форма, от 2 лет; особенно для детей младше 6 лет и при трудностях общения",age:"От 2 лет",url:cars},
    {id:"cars-hf",label:"CARS2-HF – свободная речь, от 6 лет, IQ выше 80",age:"От 6 лет, IQ выше 80",url:cars},
    {id:"cars-qpc",label:"CARS2-QPC – опросник родителя / опекуна, без подсчета",age:"В составе оценки CARS2",url:cars}
   ],
   indicators:["Взаимодействие и социально-эмоциональные проявления","Коммуникация и поведение","Сенсорные реакции и изменения активности","Клиническое наблюдение по выбранной авторской форме"],
   steps:[
    "Проверьте квалификацию специалиста и наличие лицензированного оригинального комплекта CARS-2.",
    "Выберите форму CARS2-ST либо CARS2-HF по опубликованным критериям издателя. Родительский CARS2-QPC используется для сбора сведений, но сам не дает балльного результата.",
    "Проведите наблюдение и соберите доступные сведения в порядке, установленном авторским руководством выбранной формы.",
    "Заполните приобретенный оригинальный рейтинговый бланк и выполните подсчет по руководству издателя. Не переносите ключ от ST на HF и наоборот.",
    "Интерпретируйте результат совместно с данными развития, коммуникации, семьи и других специалистов, а не по единственной шкале."
   ],
   interpretation:"Оценка по CARS2-ST и CARS2-HF проводится только в рамках соответствующего лицензированного руководства. Родительский CARS2-QPC не имеет самостоятельного итогового балла. Использовать пороги или нормы из другой редакции нельзя.",
   limitations:"Издатель распространяет бланки и руководство на лицензируемых условиях. Психотека не воспроизводит защищенные 15 пунктов, полные шкалы оценивания, авторские нормы или калькулятор без лицензии. Официальная русская адаптация для указанных форм не подтверждена.",
   extra:"https://www.nzcer.org.nz/pts/childhood-autism-rating-scale-cars?language=en"
  },
  {
   id:"special-vineland3",title:"Vineland-3 – шкалы адаптивного поведения, 3-я редакция",
   author:"S. S. Sparrow, D. V. Cicchetti, C. A. Saulnier (2016)",
   group:"Диагностика и наблюдение",topic:"Адаптивное поведение",ages:["Дошкольники","Школьники","Взрослые"],
   ageLabel:"Интервью и форма родителей: 0-90 лет; форма педагога: 3-21 год",
   format:"Стандартизированная оценка адаптивного поведения",goal:"Оценка повседневных адаптивных навыков по интервью либо информантным формам официальной Vineland-3.",
   source:vineland,original:vineland,scoring:vineland,
   authorship:"Sparrow, Cicchetti, Saulnier. Pearson, 2016. Англоязычная Vineland-3; русская нормативная адаптация здесь не заявляется.",
   variants:[
    {id:"interview-full",label:"Интервью – полная форма, 0-90 лет",age:"0-90 лет",url:vineland},
    {id:"interview-domain",label:"Интервью – сокращенная форма по доменам, 0-90 лет",age:"0-90 лет",url:vineland},
    {id:"parent-full",label:"Родитель / ухаживающий – полная форма, 0-90 лет",age:"0-90 лет",url:vineland},
    {id:"parent-domain",label:"Родитель / ухаживающий – сокращенная форма по доменам, 0-90 лет",age:"0-90 лет",url:vineland},
    {id:"teacher-full",label:"Педагог – полная форма, 3-21 год",age:"3-21 год",url:vineland},
    {id:"teacher-domain",label:"Педагог – сокращенная форма по доменам, 3-21 год",age:"3-21 год",url:vineland}
   ],
   indicators:["Коммуникация","Навыки повседневной жизни","Социализация","Дополнительные домены согласно выбранной редакции"],
   steps:[
    "Уточните цель оценки адаптивных навыков и язык, на котором проводится обследование; не выдавайте англоязычные нормы за проверенные русскоязычные.",
    "Выберите подходящего информанта и опубликованную форму: интервью, родительскую или педагогическую, полную или по доменам.",
    "Получите лицензионные материалы Pearson и проведите обследование по соответствующему руководству и правилам квалификации.",
    "Регистрируйте реальные повседневные навыки, подтвержденные сведениями подходящего информанта, а не только возможности при специально организованной помощи.",
    "Вычисляйте стандартизированные показатели с разрешенными материалами Pearson и соответствующим руководством или сервисом Q-global.",
    "Обсудите профиль сильных сторон и областей помощи с учетом данных других методов. Не объединяйте ответы от разных форм в один профиль без правил издателя."
   ],
   interpretation:"Официальные стандартизированные показатели Vineland-3 зависят от версии, возраста и информанта. Нельзя самостоятельно вводить нормы или пересчитывать результаты с неофициальной русской адаптацией.",
   limitations:"Vineland-3 – профессиональная лицензируемая методика Pearson. Не допускается выдавать Психотеку за издателя теста, перепечатывать защищенные пункты, формы, нормы или выполнять неразрешенный расчет. Для России официальная русская нормативная редакция этой версии не подтверждена.",
   extra:"https://www.pearsonassessments.com/en-us/Store/Professional-Assessments/Behavior/Vineland-Adaptive-Behavior-Scales-%7C-Third-Edition/p/100001622?format=TEST_FORMS_REPORTS"
  }
 ];
 const map=new Map(records.map(m=>[m.id,m]));
 const selected=new Map(records.map(m=>[m.id,m.variants[0].id]));
 const current=m=>m.variants.find(v=>v.id===selected.get(m.id))||m.variants[0];
 for(const m of records){
  if(window.PSY_FULL_METHODS[m.title])throw Error("Повторное название методики: "+m.title);
  window.PSY_FULL_METHODS[m.title]={workflow:"specialToolkit",sourceId:m.id,author:m.author,age:m.ageLabel,kind:m.format,
   goal:m.goal,count:m.variants.length+" опубликованных вариантов",indicators:m.indicators,source:m.source,
   calculator:false,interpret:m.interpretation};
 }
 const a=(href,label)=>'<a class="btn primary" target="_blank" rel="noopener noreferrer" href="'+esc(href)+'">'+esc(label)+'</a>';
 function portfolio(d){
  const m=map.get(d.sourceId),rows=[["Методика",m.title],["Оригинальные авторы",m.author],["Возраст и версии",m.ageLabel],
   ["Тип",m.format],["Происхождение",m.authorship]];
  return '<section class="psy-portfolio-reference psy-portfolio-unified">'+
   '<h3>Общие сведения</h3><div class="psy-profile-lines">'+rows.map(([x,y])=>'<div class="psy-profile-row"><strong>'+esc(x)+'</strong><span>'+esc(y)+'</span></div>').join("")+'</div>'+
   '<h3>Цель</h3><p class="psy-profile-description">'+esc(m.goal)+'</p>'+
   '<h3>Исследуемые характеристики</h3><div class="psy-profile-indicators">'+m.indicators.map(x=>'<div class="psy-profile-indicator"><span>'+esc(x)+'</span></div>').join("")+'</div>'+
   '<h3>Опубликованные версии</h3><div class="psy-special-versions">'+m.variants.map(v=>'<p>'+esc(v.label)+'</p>').join("")+'</div>'+
   '<h3>Первоисточник</h3><p>'+a(m.source,"Официальное описание")+'</p>'+(m.extra&&m.extra!==m.source?'<p>'+a(m.extra,"Методическое основание")+'</p>':'')+
   '<h3>Интерпретация и ограничения</h3><p>'+esc(m.interpretation)+'</p><p>'+esc(m.limitations)+'</p></section>';
 }
 function content(m){
  return '<section class="psy-special-guide"><h3>Авторы и редакция</h3><p>'+esc(m.authorship)+'</p>'+
   '<h3>Цель и возраст</h3><p>'+esc(m.goal)+'</p><p>'+esc(m.ageLabel)+'</p>'+
   '<h3>Материалы и подготовка</h3><p>Оригинальная форма выбранной редакции и официальная инструкция. Перед началом проверьте доступность языка, информанта и необходимых средств коммуникации, а также условия использования правообладателя.</p>'+
   '<h3>Инструкция обследуемому или информанту</h3><p>Точное предъявление, порядок вопросов и необходимые разъяснения берите из официальной формы либо авторского руководства. У этих методов нет единого универсального текста для всех указанных возрастов и вариантов; Психотека не подменяет его самостоятельно написанной инструкцией.</p>'+
   '<h3>Порядок проведения</h3><ol>'+m.steps.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol>'+
   '<h3>Ключ и качественные критерии</h3><p>'+esc(m.interpretation)+'</p>'+
   '<h3>Обработка и ограничения</h3><p>'+esc(m.limitations)+'</p>'+
   '<h3>Официальное руководство или материал</h3><p>'+a(m.scoring,"Открыть правила")+'</p></section>';
 }
 function instruction(d){
  const m=map.get(d.sourceId);
  return '<div class="psy-common-guide-head"><h3>Методика / руководство</h3><div class="psy-common-guide-actions">'+
   '<button type="button" class="btn" data-sourced-print="guide">Без бланка</button>'+
   '<button type="button" class="btn primary" data-sourced-print="combined" title="Открывает отдельную официальную форму">С бланком</button></div></div>'+content(m);
 }
 function materials(d){
  const m=map.get(d.sourceId),v=current(m);
  return '<div class="psy-common-guide-head"><h3>Официальный бланк или сервис</h3></div>'+
   '<p>Выберите опубликованную возрастную или информантную форму. Оригинал или страница загрузки открываются отдельно на сайте правообладателя; пункты теста не заменяются текстом Психотеки.</p>'+
   (m.variants.length>1?'<label class="psy-special-source-choice">Версия<select data-sourced-variant="'+esc(m.id)+'">'+
    m.variants.map(v=>'<option value="'+esc(v.id)+'" '+(current(m).id===v.id?'selected':'')+'>'+esc(v.label)+'</option>').join("")+'</select></label>':
    '<p><b>Форма:</b> '+esc(v.label)+'</p>')+
   '<p id="sourcedSelected">Выбрано: '+esc(v.label)+'</p>'+
   '<p id="sourcedOriginal">'+a(v.url,"Открыть официальный материал выбранной версии")+'</p>'+
   '<p>'+esc(m.limitations)+'</p>';
 }
 function calculator(d){
  const m=map.get(d.sourceId);
  return '<section class="psy-special-calc"><h3>Обработка по первоисточнику</h3>'+
   '<p>Указанная методика не имеет собственной электронной тестовой формы или автоматического подсчета на Психотеке. Оценку проводят по полной опубликованной версии.</p>'+
   '<p><b>Критерии:</b> '+esc(m.interpretation)+'</p>'+
   '<p><b>Ограничения:</b> '+esc(m.limitations)+'</p>'+
   '<p>'+a(m.scoring,"Официальные инструкции и обработка")+'</p></section>';
 }
 function complete(){return false;}
 function updateFooter(){
  const el=document.getElementById("specialFooterStatus");if(!el)return;
  el.className="psy-special-footer-state external";el.textContent="Оценка по первоисточнику";
 }
 function bind(d){
  const body=document.getElementById("modalBody");if(!body)return;
  const m=map.get(d.sourceId);
  body.querySelectorAll("[data-sourced-variant]").forEach(el=>el.addEventListener("change",()=>{
   const v=m.variants.find(q=>q.id===el.value);if(!v)return;
   selected.set(m.id,v.id);
   const line=body.querySelector("#sourcedSelected");if(line)line.textContent="Выбрано: "+v.label;
   const holder=body.querySelector("#sourcedOriginal");
   if(holder)holder.innerHTML=a(v.url,"Открыть официальный материал выбранной версии");
  }));
  body.querySelectorAll("[data-sourced-print]").forEach(el=>el.addEventListener("click",()=>print(d,el.dataset.sourcedPrint)));
 }
 function print(d,mode){
  const m=map.get(d.sourceId);
  if(mode==="blank"||mode==="combined"||mode==="result"){
   window.open(mode==="result"?m.scoring:current(m).url,"_blank","noopener,noreferrer");return;
  }
  const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>'+esc(m.title)+'</title>'+
   '<style>@page{size:A4 portrait;margin:16mm}body{font:11pt/1.42 Arial,sans-serif;color:#222}h2{font-size:16pt}h3{font-size:11pt;break-after:avoid;margin-top:15px}p,li{overflow-wrap:anywhere}li{margin:6px 0}.btn{font-weight:700}</style></head><body>'+
   '<h2>'+esc(m.title)+'</h2>'+content(m)+'<p>Оригинальный бланк или сервис доступен отдельно у правообладателя. Он не включен в печать руководства.</p></body></html>';
  const frame=document.createElement("iframe");frame.title="Печать методического руководства";
  frame.style.cssText="position:fixed;width:0;height:0;border:0";document.body.appendChild(frame);
  frame.onload=()=>{try{frame.contentWindow.focus();frame.contentWindow.print();}finally{setTimeout(()=>frame.remove(),1800);}};
  frame.srcdoc=html;
 }
 const kit=window.PSY_SPECIAL_TOOLKIT;
 if(!kit)throw Error("Общий каталог методик ОВЗ не подключен");
 const api={methods:records,portfolio,instruction,materials,calculator,complete,updateFooter,bind,print};
 for(const method of ["portfolio","instruction","materials","calculator","complete","updateFooter","bind","print"]){
  const previous=kit[method];
  kit[method]=function(d,...rest){return map.has(d?.sourceId)?api[method](d,...rest):previous(d,...rest);};
 }
 kit.methods.push(...records);
 window.PSY_SPECIAL_SOURCED=api;
})();