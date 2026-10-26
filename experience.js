
"use strict";
const DETAILS=window.PSY_FULL_METHODS||{};
let methodNow=null, tabNow="overview", calcMode="one", rowIndex=0;
let rows=[{name:"",answers:[]}];
let modeSnapshots={one:[{name:"",answers:[]}],class:[{name:"",answers:[]}]};
let modeIndices={one:0,class:0};
const methodSessions={};
const categoryIcons={
"Тревожность":'<path d="M8 18c-2-6 3-10 8-9 5-5 13 0 12 5 9 1 11 16-1 17H11C1 31 0 21 8 18z"/><path d="M13 22h3m3 0h3"/>',
"Адаптация":'<path d="M6 20 20 8l14 12v15H6z"/><path d="M16 35V24h8v11"/>',
"Самооценка":'<circle cx="20" cy="20" r="14"/><path d="M14 17v2m12-2v2M13 25q7 7 14 0"/>',
"Настроение":'<path d="M20 6c8 0 14 6 14 14s-6 14-14 14S6 28 6 20 12 6 20 6z"/><path d="M14 17v2m12-2v2m-12 8h12"/>',
"Семья":'<circle cx="12" cy="14" r="5"/><circle cx="28" cy="14" r="5"/><circle cx="20" cy="25" r="4"/><path d="M3 33v-6q1-8 9-8m25 14v-6q-1-8-9-8m-15 16v-3q0-8 7-8t7 8v3"/>',
"Внимание":'<circle cx="20" cy="20" r="15"/><circle cx="20" cy="20" r="8"/><circle cx="20" cy="20" r="2"/>',
"Память":'<rect x="7" y="7" width="25" height="27" rx="3"/><path d="M13 14h13M13 21h13M13 28h9"/>',
"Мышление":'<circle cx="12" cy="15" r="5"/><circle cx="28" cy="15" r="5"/><circle cx="20" cy="30" r="5"/><path d="M16 18l3 7m5-7-3 7M17 15h6"/>',
"Нейропсихология":'<path d="M20 7q-13-6-14 8v10q0 8 13 8M20 7q13-6 14 8v10q0 8-13 8M20 7v26M10 17h8M22 23h9"/>',
"СДВГ":'<circle cx="17" cy="11" r="4"/><path d="M17 16v9m0-5-10 7m10-5 10 4m-10-1-5 11m5-11 7 11m3-27q9 4 0 9m5 3q7 4-1 8"/>',
"Агрессия":'<path d="m20 4 5 11 11 5-11 5-5 11-5-11-11-5 11-5z"/>',
"Общение":'<path d="M5 9h21v16H14l-7 6v-6H5z"/><path d="M22 14h13v16h-8l-5 5v-5"/>',
"Мотивация":'<path d="M18 4 10 22h10l-2 14 14-20H21z"/>',
"Мониторинг риска":'<path d="M20 5 33 11v10q0 10-13 15Q7 31 7 21V11z"/><path d="m13 20 5 5 10-11"/>',
"ПМПК":'<rect x="6" y="16" width="9" height="19" rx="2"/><rect x="16" y="5" width="9" height="30" rx="2"/><rect x="26" y="11" width="9" height="24" rx="2"/>',
"Программы":'<path d="M7 6h21v29H7z"/><path d="M13 13h9m-9 7h9m-9 7h7"/>'
};
const METHOD_ART_APPROVED_1120=new Map([["ADHD Rating Scale-5",0],["BRIEF-2",1],["Buss-Perry Aggression Questionnaire",2],["Методика диагностики склонности к отклоняющемуся поведению",3],["Опросник агрессии детей и подростков (BPAQ, адаптация)",4],["Рисунок семьи в концепции Л. Кормана",5],["PARI",6],["Методика незаконченных предложений",7],["Тест цветовых отношений",8],["Опросник ролей жертвы и агрессора в ситуации буллинга",9]]);
const METHOD_ART_USER=new Map([["Школьная тревожность",1],["Изучение мотивации обучения",2],["Проективная методика школьной тревожности",3],["Piers-Harris Children Self-Concept Scale",4],["Косвенное измерение системы самооценок (КИСС)",5],["PHQ-A - опросник депрессивных симптомов подростков",6],["Reynolds Adolescent Depression Scale (RADS-2)",7],["Краткий опросник PHQ-4",8],["Опросник суицидальных рисков",9],["Conners Rating Scales",10]]);
const METHOD_ART_INDEX=new Map(["Школа зверей","Что мне нравится в школе","Дерево (Человечки на дереве)","Шкала личностной тревожности","GAD-7 - краткая шкала тревожных симптомов","Coopersmith Self-Esteem Inventory","PHQ-9 - опросник депрессивных симптомов","SNAP-IV-26","Кинетический рисунок семьи","Опросник родительского отношения","Шкала явной тревожности для детей (CMAS)","Краткий опросник настроения (SMFQ)","CES-DC","Опросник готовности подростков к самостоятельной жизни","Шкала воспринимаемой социальной поддержки (MSPSS)","Опросник социально-эмоциональных навыков","Исследование мотивационной сферы","Показатели школьной дезадаптации","Опросник «Субъектная позиция»","Групповой интеллектуальный тест (ГИТ)","SCARED","RCADS-47","Индекс хорошего самочувствия WHO-5","Семейная социограмма","Опросник взаимодействия родитель - ребенок (ВРР)","Школьный тест умственного развития (ШТУР)","Социально-психологическая адаптация","Vanderbilt Assessment Scales","МД-решетка Шмальта","Опросник ролей в ситуации школьного буллинга"].map((n,i)=>[n,i]));
function artForMethod(m){
if(m.name==="Простые аналогии (словесно-логическое мышление)"||m.name==="Парные ассоциации (смысловая и механическая память)"){
 const analog=m.name.startsWith("Простые");
 return '<svg class="psy-peer-illustration" viewBox="0 0 100 100" role="img" aria-label="'+(analog?'Связанные логические пары':'Связанные пары слов')+'" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="98" height="98" rx="20" fill="#f6faf7" stroke="#b5d9cf"/>'+
 (analog?'<path d="M26 27L48 27M52 70L76 70M26 27L27 69M72 27L74 69" stroke="#8db8ad" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 4"/><path d="M40 48h20m-7-7 7 7-7 7" fill="none" stroke="#5d9ba0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="23" cy="27" r="12" fill="#f1c965"/><circle cx="74" cy="27" r="12" fill="#8cbcca"/><circle cx="26" cy="71" r="12" fill="#8fcbad"/><circle cx="74" cy="71" r="12" fill="#d0a4d9"/><circle cx="23" cy="27" r="4" fill="#fff"/><circle cx="74" cy="27" r="4" fill="#fff"/><circle cx="26" cy="71" r="4" fill="#fff"/><circle cx="74" cy="71" r="4" fill="#fff"/>':'<path d="M25 27Q47 8 70 28M26 69Q49 88 75 68M23 29Q11 50 24 69M74 30Q89 48 74 70" fill="none" stroke="#8dbcb2" stroke-width="3" stroke-dasharray="4 4" stroke-linecap="round"/><rect x="10" y="18" width="29" height="25" rx="10" fill="#eac96b"/><rect x="60" y="18" width="29" height="25" rx="10" fill="#95c3d0"/><rect x="10" y="58" width="29" height="25" rx="10" fill="#a1d3bc"/><rect x="60" y="58" width="29" height="25" rx="10" fill="#c9acd5"/><path d="M18 30h13M68 30h13M18 70h13M68 70h13" stroke="white" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="50" r="10" fill="#f8faf9" stroke="#7bab9a" stroke-width="2"/><path d="m46 50 3 3 6-6" fill="none" stroke="#508e6c" stroke-width="2.4" stroke-linecap="round"/>')+'</svg>';
}
const verified=METHOD_ART_APPROVED_1120.get(m.name);if(verified!==undefined){const x=(verified%5)/4*100;const y=Math.floor(verified/5)*100;return '<span class="method-art-tile psy-new-batch-1120" role="img" aria-label="Иллюстрация к '+escapeHTML(m.name)+'" style="background-position:'+x.toFixed(4)+'% '+y.toFixed(4)+'%"></span>'}const uploaded=METHOD_ART_USER.get(m.name);if(uploaded!==undefined){const file='assets/psyteka-custom-'+String(uploaded).padStart(2,'0')+'.webp?v=20261025userart1';return '<img class="method-art-personal" src="'+file+'" alt="Иллюстрация к '+escapeHTML(m.name)+'" loading="lazy" decoding="async">'}const i=METHOD_ART_INDEX.get(m.name);if(i===undefined)return iconSvg(m.theme);const x=i%8/7*100,y=Math.floor(i/8)/4*100;return '<span class="method-art-tile" role="img" aria-label="Иллюстрация к '+escapeHTML(m.name)+'" style="background-position:'+x.toFixed(4)+'% '+y.toFixed(4)+'%"></span>'}
function iconSvg(theme){return '<svg viewBox="0 0 40 40" role="img" aria-label="'+escapeHTML(theme)+'" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'+(categoryIcons[theme]||categoryIcons["ПМПК"])+'</svg>'}
function render(){
 const filtered=C.filter(m=>{const hay=[m.name,m.author,m.theme,m.goal].join(" ").toLowerCase();return (!state.topic||m.theme===state.topic)&&(!state.category||m.theme===state.category)&&(!state.query||hay.includes(state.query.toLowerCase()))&&(!state.format||(state.format==="Проективная"?/проективн|рисуночн/i.test(m.format):state.format==="Проба"?/проба|графическ|табличн/i.test(m.format):state.format==="Программа"?m.format==="Программа":m.format==="Опросник"))});
 $("#resultCount").textContent="Найдено: "+filtered.length;
 $("#listHeading").textContent=state.topic||"Школьные материалы";
 $("#catalog").innerHTML=filtered.map(m=>{
 const d=DETAILS[m.name],age=d?.age||m.age;
 const description=profileGoal(m,d,window.PSY_PORTFOLIO_EDITS?.[m.name]||{})||m.summary||m.goal||'';
 const kind=d?.workflow==='diagnostic03'?'scale':d?.special==='memory10'?'memory':d?.special==='odd4'?'cognitive':(d?.graphic==='drawing'||d?.graphic==='sociogram')?'drawing':(d?.graphic==='dictation'||d?.graphic==='schulte'||d?.graphic==='dembo'||d?.graphic==='ladder')?'graphic':(d?.calculator?'scale':'other');
 const author=(d?.author||m.author||'');
 const matchMSPSS=['simpleAnalogies12','pairedAssoc20','schulte5'].includes(d?.workflow);
 const credited=author&&!/сведения об авторе уточняются/i.test(author)?'<p class="method-card-author">'+escapeHTML(author)+'</p>':'<p class="method-card-author">Автор не установлен</p>';
 const count=d?.count||m.count;
 const countTag=count?'<span class="tag">'+escapeHTML(count)+'</span>':'';
 return '<article class="method'+(matchMSPSS?' psy-mspss-card':'')+'" data-kind="'+kind+'"><div class="head"><div class="glyph">'+artForMethod(m)+'</div><div><h3>'+escapeHTML(m.name)+'</h3>'+credited+'</div></div><div class="tags"><span class="tag">'+escapeHTML(m.format)+'</span><span class="tag">'+escapeHTML(age)+'</span>'+countTag+'</div><p class="method-card-summary">'+escapeHTML(description)+'</p><div class="actions"><button class="btn primary" data-open="'+escapeHTML(m.id)+'">Открыть методику</button>'+(d?.calculator?'<button class="btn" data-score="'+escapeHTML(m.id)+'">Обработка</button>':'')+(!matchMSPSS&&d?.answerFile&&d?.processingFile?'<a class="btn" href="'+escapeHTML(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Бланк А4</a>':'')+'</div></article>';
 }).join("") || '<p>Не найдено материалов по выбранным параметрам.</p>';
 document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openMethod(C.find(m=>m.id===b.dataset.open)));
 document.querySelectorAll('[data-score]').forEach(b=>b.onclick=()=>{openMethod(C.find(m=>m.id===b.dataset.score));setTab("score")});
}
function enhanceMethodView(tab,html){
 const d=DETAILS[methodNow?.name];
 if(!d||typeof html!=='string')return html;
 if(tab==='instruction'&&!html.includes('Без бланка')&&!html.includes('С бланком')){
  const hasWrittenGuide=!!(d.instructions||d.guideFile||d.goal);
  if(hasWrittenGuide){
   const directGuide=typeof d.guideFile==='string'&&d.guideFile.startsWith('downloads/')&&d.guideFile.endsWith('.html');
   const directCombined=typeof d.guideWithBlankFile==='string'&&d.guideWithBlankFile.startsWith('downloads/')&&d.guideWithBlankFile.endsWith('.html');
   const buttons='<div class="psy-common-guide-head"><h3>Методика и руководство</h3><div class="psy-common-guide-actions">'+
    (directGuide?'<a class="btn" href="'+escapeHTML(d.guideFile)+'" target="_blank" rel="noopener noreferrer">Без бланка</a>':
     '<button type="button" class="btn" data-generic-print="guide">Без бланка</button>')+
    (directCombined?'<a class="btn primary" href="'+escapeHTML(d.guideWithBlankFile)+'" target="_blank" rel="noopener noreferrer">С бланком</a>':
      d.answerFile||d.studentFile||d.childFile||d.questions?.length||d.graphic?
      '<button type="button" class="btn primary" data-generic-print="combined">С бланком</button>':'')+
    '</div></div>';
   return buttons+html;
  }
 }
 if(tab==='materials'){
  const file=d.answerFile||d.studentFile||d.childFile||d.specialistFile;
  const containsFileLinks=html.includes('Посмотреть и распечатать')||html.includes('Скачать Word');
  if(!containsFileLinks){
   const controls='<div class="psy-common-guide-head"><h3>Бланк</h3><div class="psy-common-guide-actions">'+
    (typeof file==='string'&&/^downloads\/[a-z0-9_.-]+$/i.test(file)?
      '<a class="btn primary" href="'+escapeHTML(file)+'" target="_blank" rel="noopener noreferrer">Открыть бланк</a>':
      '<button class="btn primary" type="button" data-generic-print="blank">Распечатать А4</button>')+
    '</div></div>';
   return controls+html;
  }
 }
 return html;
}
function setTab(name){
 tabNow=name;
 document.querySelectorAll(".modal-tab").forEach(x=>{x.classList.toggle("active",x.dataset.tab===name);x.setAttribute("aria-selected",String(x.dataset.tab===name))});
 const body=$("#modalBody");
 const mainTab=['overview','instruction','materials'].includes(name);
 document.getElementById('modal')?.classList.toggle('psy-main-tabs',mainTab);
 if(!methodNow){return}
 body.innerHTML=name==="overview"?viewOverview(methodNow):
 name==="instruction"?viewInstruction(methodNow):
 name==="materials"?viewMaterials(methodNow):
 name==="processing"?viewProcessing(methodNow):viewCalculator(methodNow);
 if(name==='instruction'||name==='materials')body.innerHTML=enhanceMethodView(name,body.innerHTML);
 body.scrollTop=0;
 const bottom=$("#bottomProcessing");
 if(bottom){
  const insideProcessing=name==="score"||name==="processing";
  bottom.textContent=insideProcessing?"← Вернуться к портфолио":"Обработка результатов →";
  bottom.classList.toggle("primary",!insideProcessing||methodNow&&['mspss','simpleAnalogies12','pairedAssoc20'].includes(DETAILS[methodNow.name]?.workflow));
  const right=document.querySelector('#modal .psy-mspss-footer-right');if(right)right.hidden=!insideProcessing;
  const reset=document.getElementById('mspssResetBottom');if(reset)reset.hidden=!insideProcessing;
   const back=document.getElementById('mspssBack');if(back)back.hidden=!insideProcessing;
   const report=document.getElementById('mspssReportBottom');if(report){
    report.hidden=!insideProcessing;
    const d=DETAILS[methodNow.name];
    const eligible=calcMode==='class'
      ?rows.some(p=>p.name?.trim()||window.PSY_MSPSS.score(d,p.answers))
      :!!window.PSY_MSPSS.score(d,rows[rowIndex]?.answers);
    report.disabled=!insideProcessing||!eligible;
    report.textContent=calcMode==='class'?'Скачать отчет класса':'Скачать отчет участника';
    report.classList.toggle('psy-mspss-waiting',!eligible);
   }
   if(methodNow&&DETAILS[methodNow.name]?.workflow==='mspss')bottom.hidden=insideProcessing;
   if(methodNow&&DETAILS[methodNow.name]?.workflow==='simpleAnalogies12'){
     bottom.hidden=insideProcessing;
     const back=document.getElementById('anaBack');if(back)back.hidden=!insideProcessing;
     const report=document.getElementById('anaReportBottom');if(report){report.hidden=!insideProcessing;report.disabled=calcMode==='class'?!rows.some(r=>window.PSY_ANALOGIES.valid(r.answers)):!window.PSY_ANALOGIES.valid(rows[rowIndex]?.answers);report.textContent=calcMode==='class'?'Скачать отчет класса':'Скачать отчет участника';}
     const reset=document.getElementById('anaResetBottom');if(reset)reset.hidden=!insideProcessing;
   }
   if(methodNow&&DETAILS[methodNow.name]?.workflow==='luria10x5'){
    bottom.hidden=insideProcessing;
    const back=document.getElementById('luriaBack');if(back)back.hidden=!insideProcessing;
    const controls=['luriaReportBottom','luriaResetBottom','luriaFooterStatus'];controls.forEach(id=>{const el=document.getElementById(id);if(el)el.hidden=!insideProcessing;});
   }
   if(methodNow&&DETAILS[methodNow.name]?.workflow==='schulte5'){
    bottom.hidden=insideProcessing;
    const back=document.getElementById('schulteBack');if(back)back.hidden=!insideProcessing;
    const report=document.getElementById('schulteReportBottom');if(report){
     report.hidden=!insideProcessing;
     report.textContent=calcMode==='class'?'Скачать отчёт класса':'Скачать отчёт участника';
     report.disabled=calcMode==='class'?!rows.some(p=>window.PSY_SCHULTE.score(DETAILS[methodNow.name],p.answers)):!window.PSY_SCHULTE.score(DETAILS[methodNow.name],rows[rowIndex]?.answers);
    }
    const reset=document.getElementById('schulteResetBottom');if(reset)reset.hidden=!insideProcessing;
   }
 }
 bindControls();
 document.querySelectorAll('[data-generic-print]').forEach(button=>button.addEventListener('click',()=>printMaterial(button.dataset.genericPrint)));
 updateLuriaFooter();
}

function updateLuriaFooter(){
 if(!methodNow||DETAILS[methodNow.name]?.workflow!=='luria10x5')return;
 const ok=window.PSY_LURIA.status(rows,calcMode,rowIndex);
 const badge=document.getElementById('luriaFooterStatus');
 if(badge){badge.classList.toggle('is-ready',ok);badge.classList.toggle('is-waiting',!ok);badge.textContent=ok?'Данные заполнены':'Требуется заполнение';}
 const button=document.getElementById('luriaReportBottom');if(button){button.disabled=!ok;button.textContent=calcMode==='class'?'Скачать отчет группы':'Скачать отчет участника';}
}

const PORTFOLIO_FIELDS={
 "Методика классификации предметов":{title:"Наблюдаемые показатели",items:["Распределение 16 предметных карточек","Группировка в четыре категории","Объединение категорий в две","Объяснения и помощь специалиста"]},
 "Что мне нравится в школе":{title:"Показатели и наблюдения",items:["Соответствие школьной теме","Категория сюжета (0/10/20/30)","Цвет, детали и композиция","Объяснения ребенка"]},
 "Рисунок семьи в концепции Л. Кормана":{title:"Качественные направления",items:["Состав и сюжет изображения","Композиция и графические особенности","Представляемая семья","Объяснения ребенка"]},
 "Кинетический рисунок семьи":{title:"Области качественного анализа",items:["Состав семьи и отдельные фигуры","Действия и взаимодействия","Композиция и стиль","Предметы и символы","Объяснения и ход рисунка"]},
 "Заучивание 10 слов":{title:"Показатели памяти",items:["Первая и пятая пробы","Кривая запоминания по пяти пробам","Отсроченное воспроизведение через 60 минут","Посторонние слова и повторы"]},
 "Семейная социограмма":{title:"Критерии качественного наблюдения",items:["Состав изображенной семьи","Размеры кружков","Взаимное расположение","Дистанция между ними","Дословные пояснения"]},
 "Таблицы Шульте":{title:"Показатели внимания",items:["Время пяти таблиц","Эффективность работы (ЭР)","Врабатываемость (ВР)","Психическая устойчивость (ПУ)","Ошибки и динамика"]},
 "Лесенка":{title:"Области наблюдения",items:["Самооценка ребенка","Желаемый образ Я","Представление об оценках взрослых","Объяснения выбора и реакция"]},
 "Самооценка Дембо - Рубинштейн":{title:"Шкалы и показатели",items:["Самооценка по 6 шкалам","Уровень притязаний по 6 шкалам","Расхождение между ними"]},
 "Графический диктант":{title:"Шкалы и показатели",items:["Выполнение по диктовке","Самостоятельное продолжение","Суммарный показатель 0-16"]},
 "Последовательные картинки":{title:"Что оценивает специалист",items:["Установление последовательности","Причинно-следственные связи","Связность рассказа","Самостоятельность и помощь"]},
 "Корректурная проба Бурдона - Анфимова":{title:"Показатели внимания",items:["Темп выполнения","Пропуски целевых букв","Ошибочные отметки","Поминутная динамика"]},
 "Краткий опросник настроения (SMFQ)":{title:"Основной показатель",items:["Суммарная выраженность симптомов за две недели (13 пунктов)"]},
 "Оценка школьной мотивации":{title:"Основной показатель",items:["Уровень школьной мотивации · 10 вопросов"]},
 "GAD-7 - краткая шкала тревожных симптомов":{title:"Основной показатель",items:["Выраженность тревожных симптомов (7 пунктов)"]},
 "Краткий опросник PHQ-4":{title:"Шкалы и показатели",items:["Тревожные симптомы (GAD-2)","Депрессивные симптомы (PHQ-2)","Общий показатель дистресса"]},
 "Шкала личностной тревожности":{title:"Шкалы тревожности",items:["Школьная","Самооценочная","Межличностная","Магическая"]},
 "Шкала самооценки Розенберга (RSES)":{title:"Основной показатель",items:["Общая самооценка"]},
 "Школа зверей":{title:"Области беседы",items:["Представления о школе","Персонажи и их взаимодействие","Объяснение рисунка ребенком"]},
 "Что мне нравится в школе":{title:"Области беседы",items:["Значимые школьные ситуации","Отношение к изображенному","Слова ребенка о рисунке"]},
 "Дерево (Человечки на дереве)":{title:"Области беседы",items:["Выбранная фигура","Объяснение выбора","Переживания и контекст ситуации"]},
 "Рисунок семьи":{title:"Области наблюдения",items:["Сюжет и состав изображения","Пояснения ребенка","Взаимодействие персонажей"]},
 "Кинетический рисунок семьи":{title:"Области наблюдения",items:["Действия членов семьи","Сюжет взаимодействия","Пояснения ребенка"]},
 "Семейная социограмма":{title:"Области беседы",items:["Расположение членов семьи","Объяснение размеров и расстояний","Субъективное восприятие отношений"]},
 "Шкала воспринимаемой социальной поддержки (MSPSS)":{title:"Шкалы поддержки",items:["Семья","Друзья","Значимый другой"]},
 "Сильные стороны и трудности (SDQ)":{title:"Шкалы",items:["Эмоциональные симптомы","Проблемы поведения","Гиперактивность / невнимательность","Отношения со сверстниками","Просоциальное поведение"]},
 "SNAP-IV-26":{title:"Шкалы наблюдения",items:["Невнимательность","Гиперактивность / импульсивность","Оппозиционное поведение"]},
 "Заучивание 10 слов":{title:"Показатели",items:["Непосредственное воспроизведение","Динамика пяти предъявлений","Отсроченное воспроизведение","Ошибки и повторы"]},
 "Таблицы Шульте":{title:"Показатели",items:["Время выполнения","Ошибки","Динамика по таблицам"]},
 "Лесенка":{title:"Показатели беседы",items:["Положение себя на ступени","Обоснование выбора","Предполагаемая оценка взрослых"]},
 "Самооценка Дембо - Рубинштейн":{title:"Показатели",items:["Самооценка","Уровень притязаний","Расхождение между показателями"]},
 "Социометрическое исследование класса":{title:"Показатели",items:["Полученные выборы","Взаимные выборы","Матрица взаимоотношений"]},
 "Тест школьной тревожности":{title:"Факторы тревожности",items:["Общая тревожность в школе","Социальный стресс","Фрустрация потребности в успехе","Страх самовыражения","Страх проверки знаний","Страх не соответствовать ожиданиям","Низкая физиологическая сопротивляемость стрессу","Проблемы и страхи в отношениях с учителями"]},
 "Индекс хорошего самочувствия WHO-5":{title:"Основной показатель",items:["Субъективное психологическое благополучие"]}
};
function portfolioIndicators(m,d){
 const manual=PORTFOLIO_FIELDS[m.name];
 if(Array.isArray(d?.scales)&&d.scales.length){
  const names=d.scales.map(x=>typeof x==="string"?x:x?.name).filter(x=>typeof x==="string"&&x.trim());
  if(names.length)return {title:manual?.title||"Шкалы и показатели",items:names};
 }
 if(manual)return manual;
 if(Array.isArray(d?.indicators)&&d.indicators.length)return {title:'Показатели',items:d.indicators};
 if(Array.isArray(d?.groups)&&d.groups.length){
  const names=d.groups.map(x=>x?.name||x).filter(x=>typeof x==="string"&&x.trim());
  if(names.length)return {title:"Шкалы и показатели",items:names};
 }
 if(d?.graphic==="drawing"||/рисуночн/i.test(m.format||""))return {title:"Области наблюдения",items:["Содержание изображения","Объяснения ребенка","Контекст проведения"]};
 if(d?.graphic==="dictation")return {title:"Показатели",items:["Выполнение по инструкции","Самостоятельное продолжение","Ошибки"]};
 return {title:"Шкалы и показатели",items:[]};
}
function profileText(value){
 return String(value??"").replace(/[Ёё]/g,"е").replace(/[—–]/g,"-").replace(/\s+/g," ").trim();
}
function profileGoal(m,d,o){
 if(o.goal)return o.goal;
 if(d?.goal)return d.goal;
 const catalogGoal=m.goal||"";
 if(catalogGoal&&!/^(Изучение направления:|Коррекционная или профилактическая работа|Оценка отдельных познавательных функций)/i.test(catalogGoal))return catalogGoal;
 return m.summary||"";
}
function viewOverview(m){
 const d=DETAILS[m.name]||{},o=window.PSY_PORTFOLIO_EDITS?.[m.name]||{};
 const author=profileText(o.author||d.author||m.author||"");
 const verifiedAuthor=author&&!/сведения об авторе уточняются/i.test(author)?author:"Автор не установлен";
 const age=profileText(o.age||d.age||m.age||"");
 const kind=profileText(o.kind||d.kind||m.format||"");
 const count=profileText(o.count||d.count||m.count||"");
 const name=profileText(m.name);
 const isProgram=m.theme==="Программы";
 const isRegister=isProgram&&/реестр/i.test(kind);
 const fields=[
   [isRegister?"Материал":isProgram?"Программа":"Методика",name],
   [isRegister?"Составитель":isProgram?"Разработчик":"Автор",verifiedAuthor],
   [isProgram?"Целевая аудитория":"Возраст",age],
   ["Вид",kind]
 ];
 if(count&&count!=="Не уточнено")fields.push(["Количество вопросов / заданий",count]);
 const fieldHtml=fields.filter(([,v])=>!!v).map(([label,value])=>'<div class="psy-profile-row"><strong>'+escapeHTML(label)+'</strong><span>'+escapeHTML(value)+'</span></div>').join("");
 const description=profileText(profileGoal(m,d,o));
 const indicators=portfolioIndicators(m,d);
 const rawIndicators=Array.isArray(o.indicators)?o.indicators:indicators.items;
 const items=[...new Set((rawIndicators||[]).map(profileText).filter(Boolean))];
 const indicatorHtml=items.length?'<h3>'+escapeHTML(profileText(o.indicatorsTitle||indicators.title||"Шкалы и показатели"))+'</h3><div class="psy-profile-indicators">'+items.map((t,i)=>'<div class="psy-profile-indicator" data-profile-index="'+i+'"><span>'+escapeHTML(t)+'</span></div>').join("")+'</div>':"";
 const goalHtml=description?'<h3>'+(m.theme==="Программы"?"Цель программы":d.goal||o.goal?"Цель методики":"Назначение материала")+'</h3><p class="psy-profile-description">'+escapeHTML(description)+'</p>':"";
 const source=profileText(o.source||d.source||m.source||"");
 const sourceHtml=/^https?:\/\/[^\s]+$/i.test(source)?'<h3>Первоисточник</h3><p class="psy-profile-source"><a href="'+escapeHTML(source)+'" target="_blank" rel="noopener noreferrer">Открыть первоисточник ↗</a></p>':"";
 const packLinks='';
 return '<section class="psy-portfolio-reference psy-portfolio-unified"><h3>Общие сведения</h3><div class="psy-profile-lines">'+fieldHtml+'</div>'+goalHtml+indicatorHtml+sourceHtml+packLinks+'</section>';
}

function viewInstruction(m){
 if(DETAILS[m.name]?.workflow==='simpleAnalogies12')return window.PSY_ANALOGIES.instruction(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='pairedAssoc20')return window.PSY_PAIRED_ASSOC.instruction(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='digitSpanPsy')return window.PSY_DIGIT_SPAN.instruction(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='dynamicPraxisLuria')return window.PSY_DYNAMIC_PRAXIS.instruction(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='colorRelations8')return window.PSY_COLOR_RELATIONS.instruction(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='independentLiving12')return window.PSY_INDEPENDENT_LIVING.instruction(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='motivationInterview')return window.PSY_MOTIVATION_INTERVIEW.instruction(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='schoolAdaptObserve')return window.PSY_SCHOOL_ADAPT.instruction(DETAILS[m.name]);
 const d=DETAILS[m.name];
 if(d?.workflow==='objectClass16')return window.PSY_OBJECT_CLASSIFY.instruction(d);
 if(d?.workflow==='schoolDrawingL')return window.PSY_SCHOOL_DRAWING.instruction(d);
 if(d?.workflow==='cormanFamily')return window.PSY_CORMAN.instruction(d);
 if(d?.workflow==='kfdBurns72')return window.PSY_KFD.instruction(d);
 if(d?.workflow==='luria10x5')return window.PSY_LURIA.instruction(d);
 if(d?.workflow==='familySocio110')return window.PSY_FAMILY_SOCIO.instruction(d);
 if(d?.workflow==='schulte5')return window.PSY_SCHULTE.instruction(d);
 if(d?.workflow==='ladder7')return window.PSY_LADDER.instruction(d);
 if(d?.workflow==='dembo7')return window.PSY_DEMBO.instruction(d);
 if(d?.workflow==='elkonin4')return window.PSY_ELKONIN.instruction(d);
 if(d?.workflow==='storycards')return window.PSY_STORYCARDS.instruction(d);
 if(d?.workflow==='bourdon30')return window.PSY_BOURDON.instructions(d);
 if(d?.workflow==='selwork2026')return window.PSY_SEL_SKILLS.instruction(d);
  if(d?.workflow==='mspss')return window.PSY_MSPSS.instruction(d);
 if(d?.workflow==='gad7')return window.PSY_GAD7.instruction(d);
 if(d?.workflow==='odd4verbal')return window.PSY_ODD4.instruction(d);
 if(d?.workflow==='phq4')return window.PSY_PHQ4.instruction(d);
 if(d?.workflow==='who5')return window.PSY_WHO5.instruction(d);
 if(d?.workflow==='scared41')return window.PSY_SCARED41.instruction(d);
 if(d?.workflow==='phillips58')return window.PSY_PHILLIPS.instruction(d);
 if(d?.workflow==='snap26')return window.PSY_SNAP26.instruction(d);
  if(d?.workflow==='smfq')return window.PSY_SMFQ.instruction(d);
 if(d?.workflow==='luskanova')return window.PSY_LUSKANOVA.instruction(d);
 if(d?.workflow==='fresh06')return window.PSY_NEW_METHODS.instruction(d);
  if(!d)return '<div class="notice">Полный текст руководства для данной версии пока не подтвержден. Используйте проверенный первоисточник, а не описание карточки вместо инструкции.</div>';
 return '<div class="psy-common-guide-head"><h3>Методика и руководство</h3><div class="psy-common-guide-actions"><button type="button" class="btn" data-generic-print="guide">Без бланка</button><button type="button" class="btn primary" data-generic-print="combined">С бланком</button></div></div>'+'<h3>Инструкция для участника</h3><blockquote class="kid-instruction">'+escapeHTML(d.instructions)+'</blockquote><h3>Порядок проведения для психолога</h3><ol><li>Проверьте соответствие возраста и цели.</li><li>Объясните добровольность и порядок работы.</li><li>Предъявите стимульный материал без подсказок.</li><li>Зафиксируйте ответы, длительность и существенные наблюдения.</li><li>Проводите интерпретацию в пределах применимых методических норм.</li></ol>'+(d.graphic==='dictation'?dictationCommands(d):'')+(d.special?window.PSY_BATCH02.extraInstructions(d):'')+(d.workflow==='diagnostic'?window.PSY_DIAGNOSTICS.instructions(d):'')+(d.workflow==='diagnostic03'?window.PSY_DIAG03.instructions(d):'');
}
function ladderSvg(){let s='<svg width="500" height="250" viewBox="0 0 500 250" aria-label="Лестница из семи ступеней"><path d="M16 224 H485" stroke="#42765c" stroke-width="3"/>';for(let i=0;i<7;i++){let h=23*(i+1);s+='<rect x="'+(50+i*59)+'" y="'+(224-h)+'" width="56" height="'+h+'" fill="'+(i%2?'#b4dbb9':'#d8ecd7')+'" stroke="#41795c" stroke-width="2"/><text x="'+(77+i*59)+'" y="'+(216-h)+'" text-anchor="middle" font-size="15" fill="#28553f">'+(i+1)+'</text>'}return s+'</svg>'}
const schulteNumbers=[4,17,9,22,1,13,6,25,12,19,24,15,2,7,11,8,20,14,5,23,3,18,10,21,16];

function demboSvg(){const labels=["Здоровье","Ум","Характер","Авторитет","Умения","Внешность","Уверенность"];let q='<svg viewBox="0 0 770 390" role="img" aria-label="Семь шкал самооценки">';labels.forEach((name,i)=>{let x=60+i*105;q+='<line x1="'+x+'" y1="42" x2="'+x+'" y2="310" stroke="#3b7657" stroke-width="3"/><path d="M'+(x-7)+' 42h14 M'+(x-7)+' 310h14" stroke="#3b7657" stroke-width="2"/><text x="'+x+'" y="338" fill="#305b44" font-size="14" text-anchor="middle">'+name+'</text>';});return q+'</svg>'}
function sociogramSvg(){return '<svg viewBox="0 0 510 470" role="img" aria-label="Пустой круг для семейной социограммы"><circle cx="255" cy="235" r="196" fill="none" stroke="#4c8c6a" stroke-width="3"/></svg>'}


function dictationCommands(d){
 const names={'↑':'вверх','↓':'вниз','←':'влево','→':'вправо'};
 const txt=m=>m.slice(1)+' '+names[m[0]];
 return '<h3>Маршрут диктовки · только для психолога</h3><p>Первый узор тренировочный. Диктуйте по одной команде с паузами; затем дайте около 1-2 минут на самостоятельное продолжение. Для трех следующих узоров не исправляйте линии во время выполнения.</p>'+
 d.patterns.map(p=>'<div class="dictation-script"><h4>'+escapeHTML(p.title)+'</h4><p>'+p.moves.map(x=>escapeHTML(txt(x))).join(' → ')+'</p></div>').join('');
}
function dictationGridSvg(i){
 return '<svg viewBox="0 0 760 148" role="img" aria-label="Пустой лист в клетку, стартовая точка"><defs><pattern id="psygrid'+i+'" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" fill="none" stroke="#cad8d3" stroke-width="1"/></pattern></defs><rect x="10" y="4" width="738" height="140" fill="url(#psygrid'+i+')" stroke="#b9cdc4"/><circle cx="64" cy="94" r="5" fill="#192f2b"/></svg>';
}
function dictationPaper(d){
 return '<div class="stimulus-paper dictation-paper"><p>Проводите линию от точки, слушая команды. После диктовки продолжайте узор сами.</p>'+d.patterns.map((p,i)=>'<section class="dictation-grid"><h4>Узор '+(i+1)+(i===0?' · тренировка':'')+'</h4>'+dictationGridSvg(i)+'</section>').join('')+'</div>';
}
function dictationLevel(n){
 return n<=3?'Низкий':n<=6?'Ниже среднего':n<=10?'Средний':n<=13?'Выше среднего':'Высокий';
}
function viewDictationCalculator(d){
 if(!rows.length)rows=[{name:"",answers:[]}];
 if(rowIndex>=rows.length)rowIndex=0;
 const r=rows[rowIndex];
 let h='<div class="calc-mode"><button class="btn '+(calcMode==='one'?'primary':'')+'" data-cmode="one">Один участник</button><button class="btn '+(calcMode==='class'?'primary':'')+'" data-cmode="class">Группа / класс</button></div>';
 if(calcMode==='class')h+='<div class="group-tools"><label>Участник <select id="participantSelect">'+rows.map((x,i)=>'<option value="'+i+'" '+(i===rowIndex?'selected':'')+'>'+(i+1)+'. '+escapeHTML(x.name||'Участник '+(i+1))+'</option>').join('')+'</select></label><label>Имя или код <input id="participantName" value="'+escapeHTML(r.name)+'" placeholder="Необязательно"></label><button class="btn" id="addParticipant">Добавить</button></div>';
 h+='<p class="privacy-inline">Оценки вносятся вручную специалистом после проверки бумажного бланка. Данные остаются в этом браузере до закрытия страницы и не отправляются на сервер.</p>';
 h+='<div class="dictation-score-grid"><div><b>Узор</b><b>Под диктовку</b><b>Самостоятельно</b></div>';
 for(let j=0;j<3;j++){
  h+='<div><strong>Узор '+(j+2)+'</strong>';
  for(let k=0;k<2;k++){
   const idx=j*2+k,v=r.answers[idx];
   h+='<select class="dict-score-select" data-dict-n="'+idx+'" aria-label="Узор '+(j+2)+', '+(k===0?'диктовка':'самостоятельное продолжение')+'"><option value="">–</option>'+[0,1,2,3,4].map(n=>'<option value="'+n+'" '+(String(v)===String(n)?'selected':'')+'>'+n+'</option>').join('')+'</select>';
  }
  h+='</div>';
 }
 h+='</div>';
 const z=getScores(d,r.answers);
 h+='<div class="score-section"><h3>Итог обработки</h3>'+(z?'<b class="dictation-total">'+z.raw+' / 16</b><p>Уровень по указанной схеме: <strong>'+dictationLevel(z.raw)+'</strong></p><p>Вычисление: (минимум + максимум трех оценок диктовки) + (минимум + максимум трех оценок продолжения).</p>':'<p>Укажите все шесть оценок от 0 до 4 – три за работу по инструкции и три за самостоятельное продолжение.</p>')+'<p class="privacy-inline">Показатель выполнения пробы не является диагнозом и не заменяет комплексного обследования.</p></div>';
 if(calcMode==='class')h+='<div class="class-actions"><button class="btn primary" id="nextParticipant">Следующий участник</button><button class="btn" id="exportGroup">Скачать CSV для Excel</button></div><h3>Результаты группы</h3><div class="results-table"><table><thead><tr><th>Участник</th><th>Итог / 16</th></tr></thead><tbody>'+rows.map((x,i)=>{const z=getScores(d,x.answers);return '<tr><td>'+escapeHTML(x.name||'Участник '+(i+1))+'</td><td>'+(z?z.raw+' · '+dictationLevel(z.raw):'–')+'</td></tr>'}).join('')+'</tbody></table></div>';
 return h+'<div class="class-actions"><button class="btn" id="resetParticipant">Очистить оценки участника</button></div>';
}

function materials(m,blank){
 if(['digitSpanPsy','dynamicPraxisLuria'].includes(DETAILS[m.name]?.workflow))return window[DETAILS[m.name].workflow==='digitSpanPsy'?'PSY_DIGIT_SPAN':'PSY_DYNAMIC_PRAXIS'].materials(DETAILS[m.name]);
 const d=DETAILS[m.name];
 if(d?.workflow==='objectClass16')return window.PSY_OBJECT_CLASSIFY.materials(d);
 if(d?.workflow==='schoolDrawingL')return window.PSY_SCHOOL_DRAWING.materials(d);
 if(d?.workflow==='cormanFamily')return window.PSY_CORMAN.materials(d);
 if(d?.workflow==='kfdBurns72')return window.PSY_KFD.materials(d);
 if(d?.workflow==='luria10x5')return window.PSY_LURIA.materials(d);
 if(d?.workflow==='familySocio110')return window.PSY_FAMILY_SOCIO.materials(d);
 if(d?.workflow==='schulte5')return window.PSY_SCHULTE.materials(d);
 if(!d)return '<p>Полный материал доступен только у правообладателя.</p>';
 if(d.special)return window.PSY_BATCH02.materials(d,blank);
 if(d.workflow==='ladder7')return window.PSY_LADDER.materials(d);
 if(d.workflow==='dembo7')return window.PSY_DEMBO.materials(d);
 if(d.workflow==='elkonin4')return window.PSY_ELKONIN.materials(d);
 if(d.workflow==='storycards')return window.PSY_STORYCARDS.materials(d);
 if(d.workflow==='bourdon30')return window.PSY_BOURDON.materials(d);
 if(d.workflow==='selwork2026')return window.PSY_SEL_SKILLS.materials(d);
  if(d.workflow==='mspss')return window.PSY_MSPSS.materials(d);
 if(d.workflow==='gad7')return window.PSY_GAD7.materials(d);
 if(d.workflow==='odd4verbal')return window.PSY_ODD4.materials(d);
 if(d.workflow==='phq4')return window.PSY_PHQ4.materials(d);
 if(d.workflow==='who5')return window.PSY_WHO5.materials(d);
 if(d.workflow==='scared41')return window.PSY_SCARED41.materials(d);
 if(d.workflow==='phillips58')return window.PSY_PHILLIPS.materials(d);
 if(d.workflow==='snap26')return window.PSY_SNAP26.materials(d);
  if(d.workflow==='smfq')return window.PSY_SMFQ.materials(d);
 if(d.workflow==='luskanova')return window.PSY_LUSKANOVA.materials(d);
 if(d.workflow==='fresh06')return window.PSY_NEW_METHODS.materials(d,blank);
  if(d.workflow==='diagnostic04')return window.PSY_DIAG04.materials(d,blank);
  if(d.workflow==='diagnostic')return window.PSY_DIAGNOSTICS.materials(d,blank);
 if(d.workflow==='diagnostic03')return window.PSY_DIAG03.materials(d,blank);
 if(d.graphic==='dembo')return '<div class="stimulus-paper"><h3>Отметь свое нынешнее и желаемое положение</h3>'+demboSvg()+'</div>';
 if(d.graphic==='sociogram')return '<div class="stimulus-paper"><h3>Размести членов семьи внутри круга</h3>'+sociogramSvg()+'</div>';
 if(d.graphic==='ladder')return '<div class="stimulus-paper"><h3>Задание</h3>'+ladderSvg()+'</div>';
 if(d.graphic==='dictation')return dictationPaper(d);
 if(d.graphic==='schulte')return '<div class="stimulus-paper"><h3>Найди числа от 1 до 25 по порядку</h3><div class="schulte-grid">'+schulteNumbers.map(n=>'<div>'+n+'</div>').join('')+'</div></div>';
 if(d.graphic==='drawing')return '<div class="stimulus-paper drawing"><div class="drawing-instruction">'+escapeHTML(d.instructions)+'</div><div class="drawing-space"></div></div>';
 if(Array.isArray(d.questions)&&d.questions.length){
  return '<div class="blank-instruction">'+escapeHTML(d.instructions)+'</div><div class="scale-options">'+d.options.map((x,i)=>'<span><b>'+i+'</b> '+escapeHTML(x)+'</span>').join('')+'</div><table class="questions-table"><thead><tr><th>№</th><th>Утверждение</th><th>Ответ</th></tr></thead><tbody>'+d.questions.map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+escapeHTML(q)+'</td><td class="blank-cell">'+(blank?'_____':d.options.map((_,k)=>k).join(' / '))+'</td></tr>').join('')+'</tbody></table>';
 }
 return '<ul>'+d.questions.map(q=>'<li>'+escapeHTML(q)+'</li>').join('')+'</ul>';
}
function viewMaterials(m){
 if(DETAILS[m.name]?.workflow==='simpleAnalogies12')return window.PSY_ANALOGIES.materials(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='pairedAssoc20')return window.PSY_PAIRED_ASSOC.materials(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='digitSpanPsy')return window.PSY_DIGIT_SPAN.materials(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='dynamicPraxisLuria')return window.PSY_DYNAMIC_PRAXIS.materials(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='colorRelations8')return window.PSY_COLOR_RELATIONS.materials(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='independentLiving12')return window.PSY_INDEPENDENT_LIVING.materials(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='motivationInterview')return window.PSY_MOTIVATION_INTERVIEW.materials(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='schoolAdaptObserve')return window.PSY_SCHOOL_ADAPT.materials(DETAILS[m.name]);
 const d=DETAILS[m.name];if(d?.workflow==='objectClass16')return window.PSY_OBJECT_CLASSIFY.materials(d);if(d?.workflow==='schoolDrawingL')return window.PSY_SCHOOL_DRAWING.materials(d);if(d?.workflow==='cormanFamily')return window.PSY_CORMAN.materials(d);if(d?.workflow==='kfdBurns72')return window.PSY_KFD.materials(d);if(d?.workflow==='luria10x5')return window.PSY_LURIA.materials(d);if(d?.workflow==='familySocio110')return window.PSY_FAMILY_SOCIO.materials(d);if(d?.workflow==='schulte5')return window.PSY_SCHULTE.materials(d);if(d?.workflow==='ladder7')return window.PSY_LADDER.materials(d);
 if(d?.workflow==='dembo7')return window.PSY_DEMBO.materials(d);
 if(d?.workflow==='elkonin4')return window.PSY_ELKONIN.materials(d);
 if(d?.workflow==='storycards')return window.PSY_STORYCARDS.materials(d);
 if(d?.workflow==='bourdon30')return window.PSY_BOURDON.materials(d);
 if(d?.workflow==='selwork2026')return window.PSY_SEL_SKILLS.materials(d);
  if(d?.workflow==='mspss')return window.PSY_MSPSS.materials(d);
 if(d?.workflow==='gad7')return window.PSY_GAD7.materials(d);
 if(d?.workflow==='odd4verbal')return window.PSY_ODD4.materials(d);
 if(d?.workflow==='phq4')return window.PSY_PHQ4.materials(d);
 if(d?.workflow==='who5')return window.PSY_WHO5.materials(d);
 if(d?.workflow==='scared41')return window.PSY_SCARED41.materials(d);
 if(d?.workflow==='phillips58')return window.PSY_PHILLIPS.materials(d);
 if(d?.workflow==='snap26')return window.PSY_SNAP26.materials(d);
  if(d?.workflow==='smfq')return window.PSY_SMFQ.materials(d);
 if(d?.workflow==='luskanova')return window.PSY_LUSKANOVA.materials(d);
 if(d?.workflow==='fresh06')return window.PSY_NEW_METHODS.materials(d,false);
  if(!d)return '<div class="notice">Проверенный авторский бланк этой методики пока не добавлен. Применять карточку как готовую форму нельзя.</div>';
 return '<h3>Стимульный материал и бланк</h3>'+materials(m,false)+(d.questions?.length && d.graphic ? '<h3>Протокол беседы</h3><table class="questions-table"><thead><tr><th>№</th><th>Вопрос психолога</th><th>Ответ / наблюдение</th></tr></thead><tbody>'+d.questions.map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+escapeHTML(q)+'</td><td>________________</td></tr>').join('')+'</tbody></table>':"");
}
function viewProcessing(m){
 if(DETAILS[m.name]?.workflow==='simpleAnalogies12')return window.PSY_ANALOGIES.processing(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='pairedAssoc20')return window.PSY_PAIRED_ASSOC.processing(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='digitSpanPsy')return window.PSY_DIGIT_SPAN.processing(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='dynamicPraxisLuria')return window.PSY_DYNAMIC_PRAXIS.processing(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='colorRelations8')return window.PSY_COLOR_RELATIONS.processing(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='independentLiving12')return window.PSY_INDEPENDENT_LIVING.processing(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='motivationInterview')return window.PSY_MOTIVATION_INTERVIEW.processing(DETAILS[m.name]);
 if(DETAILS[m.name]?.workflow==='schoolAdaptObserve')return window.PSY_SCHOOL_ADAPT.processing(DETAILS[m.name]);
 const d=DETAILS[m.name];if(d?.workflow==='objectClass16')return window.PSY_OBJECT_CLASSIFY.processing(d);if(d?.workflow==='schoolDrawingL')return window.PSY_SCHOOL_DRAWING.processing(d);if(d?.workflow==='cormanFamily')return window.PSY_CORMAN.processing(d);if(d?.workflow==='kfdBurns72')return window.PSY_KFD.processing(d);if(d?.workflow==='luria10x5')return window.PSY_LURIA.processing(d);if(d?.workflow==='familySocio110')return window.PSY_FAMILY_SOCIO.processing(d);if(d?.workflow==='schulte5')return window.PSY_SCHULTE.processing(d);if(!d)return '<div class="notice">Подтвержденный ключ и обработка выбранной версии пока не добавлены. Диагностические результаты здесь не рассчитываются.</div>';
 if(d.workflow==='ladder7')return window.PSY_LADDER.processing(d);
 if(d.workflow==='dembo7')return window.PSY_DEMBO.processing(d);
 if(d.workflow==='elkonin4')return window.PSY_ELKONIN.processing(d);
 if(d.workflow==='storycards')return window.PSY_STORYCARDS.processing(d);
 if(d.workflow==='bourdon30')return window.PSY_BOURDON.processing(d);
 if(d.workflow==='selwork2026')return window.PSY_SEL_SKILLS.processing(d);
  if(d.workflow==='mspss')return window.PSY_MSPSS.processing(d);
 if(d.workflow==='gad7')return window.PSY_GAD7.processing(d);
 if(d.workflow==='odd4verbal')return window.PSY_ODD4.processing(d);
 if(d.workflow==='phq4')return window.PSY_PHQ4.processing(d);
 if(d.workflow==='who5')return window.PSY_WHO5.processing(d);
 if(d.workflow==='scared41')return window.PSY_SCARED41.processing(d);
 if(d.workflow==='phillips58')return window.PSY_PHILLIPS.processing(d);
 if(d.workflow==='snap26')return window.PSY_SNAP26.processing(d);
  if(d.workflow==='smfq')return window.PSY_SMFQ.processing(d);
 if(d.workflow==='luskanova')return window.PSY_LUSKANOVA.processing(d);
 if(d.workflow==='fresh06')return window.PSY_NEW_METHODS.processing(d);
  if(d.workflow==='diagnostic04')return window.PSY_DIAG04.processing(d);
  if(d.workflow==='diagnostic')return window.PSY_DIAGNOSTICS.processing(d);
 if(d.workflow==='diagnostic03')return window.PSY_DIAG03.processing(d);
 return '<h3>Подсчет / фиксация</h3><p>'+escapeHTML(d.scoring)+'</p><h3>Интерпретация</h3><p>'+escapeHTML(d.interpret)+'</p>'+(d.source?'<p>Источник: <a target="_blank" rel="noopener noreferrer" href="'+escapeHTML(d.source)+'">'+escapeHTML(d.source)+'</a></p>':'');
}
function getScores(d,answers){
 if(d?.workflow==='objectClass16')return window.PSY_OBJECT_CLASSIFY.score(d,answers);
 if(d?.workflow==='schoolDrawingL')return window.PSY_SCHOOL_DRAWING.score(d,answers);
 if(d?.workflow==='cormanFamily')return window.PSY_CORMAN.score(d,answers);
 if(d?.workflow==='kfdBurns72')return window.PSY_KFD.score(d,answers);
 if(d?.workflow==='luria10x5')return window.PSY_LURIA.score(d,answers);
 if(d?.workflow==='familySocio110')return window.PSY_FAMILY_SOCIO.score(d,answers);
 if(d?.workflow==='schulte5')return window.PSY_SCHULTE.score(d,answers);
 if(d.workflow==='ladder7')return window.PSY_LADDER.scan(answers);
 if(d.workflow==='dembo7')return window.PSY_DEMBO.score(d,answers);
 if(d.workflow==='elkonin4')return window.PSY_ELKONIN.score(answers);
 if(d.workflow==='storycards')return window.PSY_STORYCARDS.score(d,answers);
 if(d.workflow==='bourdon30')return window.PSY_BOURDON.score(d,answers);
 if(d.workflow==='selwork2026')return window.PSY_SEL_SKILLS.score(d,answers);
  if(d.workflow==='mspss')return window.PSY_MSPSS.score(d,answers);
 if(d.workflow==='gad7')return window.PSY_GAD7.score(d,answers);
 if(d.workflow==='odd4verbal')return window.PSY_ODD4.score(d,answers);
 if(d.workflow==='phq4')return window.PSY_PHQ4.score(d,answers);
 if(d.workflow==='who5')return window.PSY_WHO5.score(d,answers);
 if(d.workflow==='scared41')return window.PSY_SCARED41.score(d,answers);
 if(d.workflow==='phillips58')return window.PSY_PHILLIPS.score(d,answers);
 if(d.workflow==='snap26')return window.PSY_SNAP26.score(d,answers);
  if(d.workflow==='smfq')return window.PSY_SMFQ.score(d,answers);
 if(d.workflow==='luskanova')return window.PSY_LUSKANOVA.score(d,answers);
 if(d.workflow==='fresh06')return window.PSY_NEW_METHODS.score(d,answers);
  if(d.workflow==='diagnostic04')return window.PSY_DIAG04.score(d,answers);
  if(d.workflow==='diagnostic03')return window.PSY_DIAG03.score(d,{answers});
 if(d.workflow==='diagnostic')return window.PSY_DIAGNOSTICS.score(d,answers);
 if(d.special)return window.PSY_BATCH02.score(d,answers);
 if(d.graphic==='dictation'){
  if(!Array.isArray(answers)||Array.from({length:6},(_,i)=>answers[i]).some(v=>v==null||v===''||![0,1,2,3,4].includes(Number(v))))return null;
  const x=answers.slice(0,6).map(Number);
  const a=[x[0],x[2],x[4]],b=[x[1],x[3],x[5]];
  return {raw:Math.min(...a)+Math.max(...a)+Math.min(...b)+Math.max(...b),index:null,max:16,caption:'Суммарный балл'};
 }
 const n=d.questions.length;if(answers.length<n || answers.some((v,i)=>i<n && (v==null || v==="")))return null;
 const nums=answers.slice(0,n).map(Number);
 if(d.reversed) nums.forEach((v,i)=>{if(d.reversed.includes(i))nums[i]=(d.options.length-1)-v});
 const raw=nums.reduce((a,b)=>a+b,0);
 if(d.options.length===6) return {raw,index:raw*4,max:25,caption:'Индекс благополучия 0-100'};
 return {raw,index:null,max:n*(d.options.length-1),caption:'Сырая сумма'};
}
function viewCalculator(m){
 if(DETAILS[m.name]?.workflow==='simpleAnalogies12')return window.PSY_ANALOGIES.calculator(DETAILS[m.name],{rows,rowIndex,calcMode});
 if(DETAILS[m.name]?.workflow==='pairedAssoc20')return window.PSY_PAIRED_ASSOC.calculator(DETAILS[m.name],{rows,rowIndex,calcMode});
 if(DETAILS[m.name]?.workflow==='digitSpanPsy')return window.PSY_DIGIT_SPAN.calculator(DETAILS[m.name],{rows,rowIndex,calcMode});
 if(DETAILS[m.name]?.workflow==='dynamicPraxisLuria')return window.PSY_DYNAMIC_PRAXIS.calculator(DETAILS[m.name],{rows,rowIndex,calcMode});
 if(DETAILS[m.name]?.workflow==='colorRelations8')return window.PSY_COLOR_RELATIONS.calculator(DETAILS[m.name],{rows,rowIndex,calcMode});
 if(DETAILS[m.name]?.workflow==='independentLiving12')return window.PSY_INDEPENDENT_LIVING.calculator(DETAILS[m.name],{rows,rowIndex,calcMode});
 if(DETAILS[m.name]?.workflow==='motivationInterview')return window.PSY_MOTIVATION_INTERVIEW.calculator(DETAILS[m.name],{rows,rowIndex,calcMode});
 if(DETAILS[m.name]?.workflow==='schoolAdaptObserve')return window.PSY_SCHOOL_ADAPT.calculator(DETAILS[m.name],{rows,rowIndex,calcMode});
 const d=DETAILS[m.name];
 if(d?.workflow==='objectClass16')return window.PSY_OBJECT_CLASSIFY.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='schoolDrawingL')return window.PSY_SCHOOL_DRAWING.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='cormanFamily')return window.PSY_CORMAN.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='kfdBurns72')return window.PSY_KFD.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='luria10x5')return window.PSY_LURIA.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='familySocio110')return window.PSY_FAMILY_SOCIO.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='schulte5')return window.PSY_SCHULTE.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='ladder7')return window.PSY_LADDER.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='dembo7')return window.PSY_DEMBO.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='elkonin4')return window.PSY_ELKONIN.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='storycards')return window.PSY_STORYCARDS.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='bourdon30')return window.PSY_BOURDON.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='selwork2026')return window.PSY_SEL_SKILLS.calculator(d,{rows,rowIndex,calcMode});
  if(d?.workflow==='mspss')return window.PSY_MSPSS.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='gad7')return window.PSY_GAD7.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='odd4verbal')return window.PSY_ODD4.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='phq4')return window.PSY_PHQ4.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='who5')return window.PSY_WHO5.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='scared41')return window.PSY_SCARED41.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='phillips58')return window.PSY_PHILLIPS.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='snap26')return window.PSY_SNAP26.calculator(d,{rows,rowIndex,calcMode});
  if(d?.workflow==='smfq')return window.PSY_SMFQ.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='luskanova')return window.PSY_LUSKANOVA.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='fresh06')return window.PSY_NEW_METHODS.calculator(d,{rows,rowIndex,calcMode});
  if(d?.workflow==='diagnostic04')return window.PSY_DIAG04.calculator(d,{rows,rowIndex,calcMode});
  if(d?.workflow==='diagnostic03')return window.PSY_DIAG03.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='diagnostic')return window.PSY_DIAGNOSTICS.calculator(d,{rows,rowIndex,calcMode});
 if(d?.special)return window.PSY_BATCH02.calculator(d,{rows,rowIndex,calcMode,getScores});
 if(d?.graphic==='dictation')return viewDictationCalculator(d);
 if(!d?.calculator)return '<p>У этой методики нет онлайн-подсчета. Используйте качественное наблюдение и руководство выбранной версии.</p>';
 if(!rows.length) rows=[{name:"",answers:[]}]; if(rowIndex>=rows.length)rowIndex=0;
 const r=rows[rowIndex],count=d.questions.length;
 let head='<div class="calc-mode"><button class="btn '+(calcMode==='one'?'primary':'')+'" data-cmode="one">Один участник</button><button class="btn '+(calcMode==='class'?'primary':'')+'" data-cmode="class">Группа / класс</button></div>';
 if(calcMode==='class')head+='<div class="group-tools"><label>Участник <select id="participantSelect">'+rows.map((x,i)=>'<option value="'+i+'" '+(i===rowIndex?'selected':'')+'>'+(i+1)+'. '+escapeHTML(x.name||'Участник '+(i+1))+'</option>').join('')+'</select></label><label>Имя (необязательно)<input id="participantName" placeholder="Имя или номер" value="'+escapeHTML(r.name)+'"></label><button class="btn" id="addParticipant">Добавить</button></div><div class="privacy-inline">ФИО не отправляются на сервер и не сохраняются автоматически. При закрытии страницы несохраненные результаты будут потеряны.</div>';
 else head+='<div class="privacy-inline">Подсчет выполняется в браузере. Ответы не отправляются на сервер и не сохраняются между сеансами.</div>';
 const answered=r.answers.filter(x=>x!==''&&x!=null).length;
 let qhtml='<div class="answer-progress"><b>'+answered+' из '+count+'</b><span>Заполнено</span><button class="btn btn-small" id="jumpMissing">К пропуску</button></div><div class="answer-progress-track"><span style="width:'+(100*answered/count)+'%"></span></div><div class="answer-grid">'+d.questions.map((q,i)=>'<label class="answer-card '+(r.answers[i]==null||r.answers[i]===''?'missing':'done')+'" data-q="'+i+'"><strong>'+(i+1)+'. '+escapeHTML(q)+'</strong><input class="answer-input" type="text" inputmode="numeric" maxlength="1" aria-label="Ответ на вопрос '+(i+1)+'" data-n="'+i+'" value="'+escapeHTML(r.answers[i]??'')+'" placeholder="0-'+(d.options.length-1)+'"></label>').join('')+'</div>';
 const result=getScores(d,r.answers);
 let results='<div class="score-section" id="scoreSection"><h3>Результат</h3>';
 if(!result)results+='<p>Заполни все ответы, чтобы увидеть баллы. Незаполненные поля подсвечены.</p>';
 else{let pct=100*result.raw/result.max;results+='<div class="score-bar-line"><b>'+result.raw+' из '+result.max+'</b><div class="visual-scale"><span style="width:'+pct+'%"></span></div><p>'+escapeHTML(result.caption)+(result.index==null?'':' · '+result.index+' из 100')+'</p></div><div class="notice">'+escapeHTML(d.interpret)+'</div>';}
 results+='</div>';
 if(calcMode==='class'){
 results+='<div class="class-actions"><button class="btn primary" id="nextParticipant">Следующий участник</button><button class="btn" id="exportGroup">Скачать CSV для Excel</button></div><h3>Результаты группы</h3><div class="results-table"><table><thead><tr><th>Участник</th><th>Сумма</th>'+(d.options.length===6?'<th>Индекс</th>':'')+'</tr></thead><tbody>'+rows.map((x,i)=>{const z=getScores(d,x.answers);return '<tr><td>'+escapeHTML(x.name||'Участник '+(i+1))+'</td><td>'+(z?z.raw:'–')+'</td>'+(d.options.length===6?'<td>'+(z?z.index:'–')+'</td>':'')+'</tr>'}).join('')+'</tbody></table></div>';
 }
 return head+'<div class="notice">Ответы вводятся цифрами от 0 до '+(d.options.length-1)+'. После ввода курсор переходит к следующему полю.</div>'+qhtml+results+'<div class="class-actions"><button class="btn" id="resetParticipant">Сбросить ответы участника</button></div>';
}
function bindControls(){
 if(DETAILS[methodNow.name]?.workflow==='simpleAnalogies12')window.PSY_ANALOGIES.bind(DETAILS[methodNow.name],{rows,rowIndex,calcMode,
 onSelect:i=>{rowIndex=i;modeIndices.class=i;setTab('score');},
 onBulkAdd:names=>{
   if(rows.length===1&&!rows[0].name?.trim()&&!window.PSY_ANALOGIES.count(rows[0].answers))rows.splice(0,1);
   let first=-1;
   for(const name of names)if(!rows.some(r=>r.name?.trim().toLocaleLowerCase('ru')===name.trim().toLocaleLowerCase('ru'))){if(first<0)first=rows.length;rows.push({name:name.trim(),answers:[]});}
   if(!rows.length)rows.push({name:'',answers:[]});
   rowIndex=first>=0?first:Math.max(0,rows.length-1);modeIndices.class=rowIndex;setTab('score');
 },
 onSort:names=>{
   if(names?.length){if(rows.length===1&&!rows[0].name?.trim()&&!window.PSY_ANALOGIES.count(rows[0].answers))rows.splice(0,1);
     for(const name of names)if(name&&!rows.some(r=>r.name?.trim().toLocaleLowerCase('ru')===name.trim().toLocaleLowerCase('ru')))rows.push({name:name.trim(),answers:[]});}
   if(!rows.length)rows.push({name:'',answers:[]});
   const current=rows[rowIndex];rows.sort((a,b)=>(a.name||'').localeCompare(b.name||'','ru',{sensitivity:'base'}));
   rowIndex=names?.length?0:Math.max(0,rows.indexOf(current));modeIndices.class=rowIndex;setTab('score');
 },
 onDelete:i=>{rows.splice(i,1);if(!rows.length)rows.push({name:'',answers:[]});rowIndex=Math.min(rowIndex,rows.length-1);modeIndices.class=rowIndex;setTab('score');},
 onDeleteAll:()=>{rows.splice(0,rows.length,{name:'',answers:[]});rowIndex=0;modeIndices.class=0;setTab('score');},
 onNext:()=>{if(rowIndex>=rows.length-1)return;rowIndex++;modeIndices.class=rowIndex;setTab('score');}
});
 if(DETAILS[methodNow.name]?.workflow==='pairedAssoc20')window.PSY_PAIRED_ASSOC.bind(DETAILS[methodNow.name],{rows,rowIndex,calcMode});
 if(DETAILS[methodNow.name]?.workflow==='digitSpanPsy')window.PSY_DIGIT_SPAN.bind(DETAILS[methodNow.name],{rows,rowIndex,calcMode});
 if(DETAILS[methodNow.name]?.workflow==='dynamicPraxisLuria')window.PSY_DYNAMIC_PRAXIS.bind(DETAILS[methodNow.name],{rows,rowIndex,calcMode});
 if(DETAILS[methodNow.name]?.workflow==='colorRelations8')window.PSY_COLOR_RELATIONS.bind(DETAILS[methodNow.name],{rows,rowIndex,calcMode});
 if(DETAILS[methodNow.name]?.workflow==='independentLiving12')window.PSY_INDEPENDENT_LIVING.bind(DETAILS[methodNow.name],{rows,rowIndex,calcMode});
 if(DETAILS[methodNow.name]?.workflow==='motivationInterview')window.PSY_MOTIVATION_INTERVIEW.bind(DETAILS[methodNow.name],{rows,rowIndex,calcMode});
 if(DETAILS[methodNow.name]?.workflow==='schoolAdaptObserve')window.PSY_SCHOOL_ADAPT.bind(DETAILS[methodNow.name],{rows,rowIndex,calcMode});
 const d=DETAILS[methodNow.name];
 if(d?.workflow==='objectClass16')window.PSY_OBJECT_CLASSIFY.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='schoolDrawingL')window.PSY_SCHOOL_DRAWING.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='cormanFamily')window.PSY_CORMAN.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='kfdBurns72')window.PSY_KFD.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='luria10x5')window.PSY_LURIA.bind(d,{rows,rowIndex,calcMode,onChange:updateLuriaFooter});
 if(d?.workflow==='familySocio110')window.PSY_FAMILY_SOCIO.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='schulte5')window.PSY_SCHULTE.bind(d,{rows,rowIndex,calcMode,
   onSelect:i=>{rowIndex=i;modeIndices.class=i;setTab('score');},
   onBulkAdd:names=>{
    if(rows.length===1&&!rows[0].name?.trim()&&!window.PSY_SCHULTE.done(rows[0].answers))rows.splice(0,1);
    let first=-1;
    for(const name of names){
     if(!rows.some(x=>x.name?.trim().toLocaleLowerCase('ru')===name.trim().toLocaleLowerCase('ru'))){
      if(first<0)first=rows.length;
      rows.push({name:name.trim(),answers:[]});
     }
    }
    if(!rows.length)rows.push({name:'',answers:[]});
    rowIndex=first>=0?first:Math.max(0,rows.length-1);
    modeIndices.class=rowIndex;setTab('score');
   },
   onSort:names=>{
    if(names?.length){
     if(rows.length===1&&!rows[0].name?.trim()&&!window.PSY_SCHULTE.done(rows[0].answers))rows.splice(0,1);
     for(const name of names)if(!rows.some(x=>x.name?.trim().toLocaleLowerCase('ru')===name.trim().toLocaleLowerCase('ru')))rows.push({name:name.trim(),answers:[]});
    }
    if(!rows.length)rows.push({name:'',answers:[]});
    const current=rows[rowIndex];
    rows.sort((a,b)=>(a.name||'').localeCompare(b.name||'','ru',{sensitivity:'base'}));
    rowIndex=names?.length?0:Math.max(0,rows.indexOf(current));
    modeIndices.class=rowIndex;setTab('score');
   },
   onDelete:i=>{
    rows.splice(i,1);if(!rows.length)rows.push({name:'',answers:[]});
    rowIndex=Math.max(0,Math.min(rowIndex>i?rowIndex-1:rowIndex,rows.length-1));
    modeIndices.class=rowIndex;setTab('score');
   },
   onDeleteAll:()=>{rows.splice(0,rows.length,{name:'',answers:[]});rowIndex=0;modeIndices.class=0;setTab('score');},
   onNext:()=>{if(rowIndex>=rows.length-1)return;rowIndex++;modeIndices.class=rowIndex;setTab('score');}
  });
 if(d?.workflow==='ladder7')window.PSY_LADDER.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='dembo7')window.PSY_DEMBO.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='elkonin4')window.PSY_ELKONIN.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='storycards')window.PSY_STORYCARDS.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='bourdon30')window.PSY_BOURDON.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='selwork2026')window.PSY_SEL_SKILLS.bind(d,{rows,rowIndex,calcMode});
  if(d?.workflow==='mspss')window.PSY_MSPSS.bind(d,{rows,rowIndex,calcMode,
    onSelect:i=>{rowIndex=i;modeIndices.class=i;setTab('score');document.querySelector('input[data-mspss="0"]')?.focus();},
    onBulkAdd:names=>{
      if(!names?.length)return;
      if(rows.length===1&&!rows[0].name?.trim()&&!window.PSY_MSPSS.done(rows[0].answers))rows.splice(0,1);
      let first=-1;
      for(const name of names){
       if(!rows.some(x=>x.name?.trim().toLocaleLowerCase('ru')===name.trim().toLocaleLowerCase('ru'))){if(first<0)first=rows.length;rows.push({name:name.trim(),answers:[]});}
      }
      if(!rows.length)rows.push({name:'',answers:[]});
      rowIndex=first>=0?first:Math.max(0,rows.length-1);modeIndices.class=rowIndex;setTab('score');
    },
    onSort:names=>{
      if(names?.length){
       if(rows.length===1&&!rows[0].name?.trim()&&!window.PSY_MSPSS.done(rows[0].answers))rows.splice(0,1);
       for(const name of names){if(!rows.some(x=>x.name?.trim().toLocaleLowerCase('ru')===name.trim().toLocaleLowerCase('ru')))rows.push({name:name.trim(),answers:[]});}
      }
      if(!rows.length)rows.push({name:'',answers:[]});
      const current=rows[rowIndex];
      rows.sort((a,b)=>(a.name||'').localeCompare(b.name||'','ru',{sensitivity:'base'}));
      rowIndex=names?.length?0:Math.max(0,rows.indexOf(current));modeIndices.class=rowIndex;setTab('score');
    },
    onDelete:i=>{
      rows.splice(i,1);
      if(!rows.length)rows.push({name:'',answers:[]});
      rowIndex=Math.max(0,Math.min(rowIndex>i?rowIndex-1:rowIndex,rows.length-1));
      modeIndices.class=rowIndex;setTab('score');
    },
    onDeleteAll:()=>{rows.splice(0,rows.length,{name:'',answers:[]});rowIndex=0;modeIndices.class=0;setTab('score');},
    onNext:()=>{if(rowIndex>=rows.length-1)return;rowIndex++;modeIndices.class=rowIndex;setTab('score');document.querySelector('input[data-mspss="0"]')?.focus();}
  });
  if(d?.workflow==='smfq')window.PSY_SMFQ.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='luskanova')window.PSY_LUSKANOVA.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='fresh06')window.PSY_NEW_METHODS.bind(d,{rows,rowIndex,calcMode});
  if(d?.workflow==='diagnostic04')window.PSY_DIAG04.bind(d,{rows,rowIndex,calcMode});
  if(d?.workflow==='diagnostic03')window.PSY_DIAG03.bind(d,{rows,rowIndex,calcMode},()=>setTab('score'));
 if(d?.workflow==='diagnostic')window.PSY_DIAGNOSTICS.bind(d,{rows,rowIndex,calcMode});
 if(d?.special)window.PSY_BATCH02.bind(d,{rows,rowIndex,calcMode,getScores});
 document.querySelectorAll('.dict-score-select').forEach(el=>el.addEventListener('change',()=>{rows[rowIndex].answers[+el.dataset.dictN]=el.value;setTab('score')}));

 document.querySelectorAll('[data-cmode]').forEach(b=>b.onclick=()=>{
 modeSnapshots[calcMode]=rows;modeIndices[calcMode]=rowIndex;
 calcMode=b.dataset.cmode;rows=modeSnapshots[calcMode];rowIndex=modeIndices[calcMode]||0;setTab("score");
});
 $("#participantSelect")?.addEventListener('change',e=>{rowIndex=+e.target.value;setTab("score")});
 $("#participantName")?.addEventListener('input',e=>{rows[rowIndex].name=e.target.value;const sel=$("#participantSelect");sel.options[rowIndex].text=(rowIndex+1)+'. '+(e.target.value||'Участник '+(rowIndex+1))});
 $("#addParticipant")?.addEventListener('click',()=>{rows.push({name:"",answers:[]});rowIndex=rows.length-1;setTab("score")});
 document.querySelectorAll('.answer-input').forEach(inp=>{inp.addEventListener('input',e=>{
   let val=e.target.value.replace(/[^0-9]/g,'');
   if(val!==''&&Number(val)>=d.options.length)val='';
   e.target.value=val;rows[rowIndex].answers[+inp.dataset.n]=val;
   const inputs=[...document.querySelectorAll('.answer-input')];if(val&&+inp.dataset.n<inputs.length-1)inputs[+inp.dataset.n+1].focus();
   // Update live outcome without recreating input focus.
   const all=rows[rowIndex].answers,n=d.questions.length;const done=all.filter(x=>x!==''&&x!=null).length;
   const ap=$('.answer-progress b'),progress=$('.answer-progress-track span');if(ap)ap.textContent=done+' из '+n;if(progress)progress.style.width=(100*done/n)+'%';
   inp.closest('.answer-card')?.classList.toggle('missing',!val);
   const rr=getScores(d,all),sec=$('#scoreSection'); if(sec)sec.innerHTML=rr?'<h3>Результат</h3><div class="score-bar-line"><b>'+rr.raw+' из '+rr.max+'</b><div class="visual-scale"><span style="width:'+(100*rr.raw/rr.max)+'%"></span></div><p>'+escapeHTML(rr.caption)+(rr.index==null?'':' · '+rr.index+' из 100')+'</p></div><div class="notice">'+escapeHTML(d.interpret)+'</div>':'<h3>Результат</h3><p>Заполни все ответы, чтобы увидеть баллы.</p>';
   if(calcMode==='class') updateGroupTable(d);
 })});
 $("#jumpMissing")?.addEventListener('click',()=>{let input=[...document.querySelectorAll('.answer-input')].find(x=>!x.value);(input||document.querySelector('.answer-input'))?.focus()});
 $("#nextParticipant")?.addEventListener('click',()=>{if(rowIndex>=rows.length-1)rows.push({name:"",answers:[]});rowIndex++;setTab("score");$('.answer-input')?.focus()});
 $("#resetParticipant")?.addEventListener('click',()=>{if(confirm('Очистить ответы выбранного участника?')){const current=rows[rowIndex];current.answers=[];if(d.workflow==='storycards')current.storyDetails=[{},{}];if(d.workflow==='ladder7')current.ladderNotes={};if(d.workflow==='familySocio110')current.socioNotes={};if(d.workflow==='luria10x5')current.luriaNotes=[];if(d.workflow==='kfdBurns72')current.kfdNotes={};if(d.workflow==='cormanFamily')current.cormanNotes={};if(d.workflow==='schoolDrawingL')current.schoolDrawingNotes={};if(d.workflow==='objectClass16')current.objectClassNotes={};if(d.workflow==='diagnostic03'&&d.diagnosticType==='vanderbilt'){current.answerSets ||= {};current.answerSets[current.variant||'parent']=current.answers;}setTab('score')}});
 $("#exportGroup")?.addEventListener('click',()=>exportGroup(d));
}
function updateGroupTable(d){
 const table=$('.results-table tbody');if(!table)return;
 if(d.graphic==='dictation'){table.innerHTML=rows.map((x,i)=>{const z=getScores(d,x.answers);return '<tr><td>'+escapeHTML(x.name||'Участник '+(i+1))+'</td><td>'+(z?z.raw:'–')+'</td></tr>'}).join('');return;}

 table.innerHTML=rows.map((x,i)=>{const z=getScores(d,x.answers);return '<tr><td>'+escapeHTML(x.name||'Участник '+(i+1))+'</td><td>'+(z?z.raw:'–')+'</td>'+(d.options.length===6?'<td>'+(z?z.index:'–')+'</td>':'')+'</tr>'}).join('');
}
function exportGroup(d){
 if(d.workflow==='diagnostic03'){window.PSY_DIAG03.download(window.PSY_DIAG03.csv(d,rows),(d.diagnosticType==='rses'?'RSES':'Vanderbilt')+'_класс.csv','text/csv;charset=utf-8');return;}
 if(d.workflow==='diagnostic'){window.PSY_DIAGNOSTICS.download(window.PSY_DIAGNOSTICS.csv(d,rows),(d.scales?'SCARED':'WHO5')+'_класс.csv','text/csv;charset=utf-8');return;}
 if(d.special)return window.PSY_BATCH02.exportGroup(d,rows);
 const safe=s=>{let x=String(s||'');if(/^[\s]*[=+\-@]/.test(x))x="'"+x;return '"'+x.replace(/"/g,'""')+'"'};
 if(d.graphic==='dictation'){
  const head=['Участник','Узор 2 диктовка','Узор 2 самостоятельно','Узор 3 диктовка','Узор 3 самостоятельно','Узор 4 диктовка','Узор 4 самостоятельно','Итог /16'];
  const data=[head,...rows.map((x,i)=>[x.name||'Участник '+(i+1),...Array.from({length:6},(_,k)=>x.answers[k]??''),getScores(d,x.answers)?.raw??''])];
  const blob=new Blob(['\uFEFF'+data.map(row=>row.map(safe).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Психотека_Графический_диктант.csv';a.click();URL.revokeObjectURL(url);return;
 }
 let data=[['Участник','Сырая сумма',...(d.options.length===6?['Индекс']:[])]];
 rows.forEach((r,i)=>{let z=getScores(d,r.answers);data.push([r.name||'Участник '+(i+1),z?.raw??'',...(d.options.length===6?[z?.index??'']:[])])});
 const csv='\uFEFF'+data.map(row=>row.map(safe).join(';')).join('\r\n');
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Психотека_результаты.csv';a.click();URL.revokeObjectURL(url);
}
function makePrintPage(d,blank,combined=false){
 const css='@page{size:A4 portrait;margin:15mm}*{box-sizing:border-box}body{font:11pt/1.45 Arial,sans-serif;color:#233a2f}h1{font-size:19pt;margin:0 0 9px}h2{font-size:13pt;margin:20px 0 7px}p{margin:8px 0}table{border-collapse:collapse;width:100%;table-layout:fixed}td,th{border:1px solid #8da998;padding:7px;vertical-align:top;font-size:9pt;overflow-wrap:anywhere}tr{break-inside:avoid}svg{max-width:100%;height:auto}.drawing-space{min-height:500px;border:1px solid #9eb9a7}.print-student{break-before:page;page-break-before:always}.print-note{font-size:9pt;color:#526b5d}button,.actions,.toolbar,.print-links{display:none!important}';
 const head='<html lang="ru"><head><meta charset="utf-8"><title>'+escapeHTML(methodNow?.name||'Материалы специалиста')+'</title><style>'+css+'</style></head><body>';
 const instruction=String(d.instructions||'');
 const guide='<article><h1>'+escapeHTML(methodNow?.name||'Методика')+'</h1>'+
  '<p>'+escapeHTML(d.author||'')+'</p>'+
  (d.age?'<p>Возраст: '+escapeHTML(d.age)+'</p>':'')+
  (d.goal?'<h2>Цель</h2><p>'+escapeHTML(d.goal)+'</p>':'')+
  (instruction?'<h2>Инструкция</h2><p>'+escapeHTML(instruction)+'</p>':'')+
  (d.scoring?'<h2>Правила регистрации и подсчета</h2><p>'+escapeHTML(d.scoring)+'</p>':'')+
  (d.interpret?'<h2>Интерпретация и ограничения</h2><p>'+escapeHTML(d.interpret)+'</p>':'')+
  '<p class="print-note">Предъявляемые стимульные материалы в самостоятельное руководство не включены.</p></article>';
 const blankHtml='<section class="print-student">'+materials(methodNow,true)+'</section>';
 return head+(blank?blankHtml:guide)+(combined?blankHtml:'')+'</body></html>';
}
function printMaterial(blank){
 const d=DETAILS[methodNow?.name];if(!d)return;
 if(['colorRelations8','digitSpanPsy','dynamicPraxisLuria','simpleAnalogies12','pairedAssoc20'].includes(d.workflow)){window.open(blank?d.answerFile:d.guideFile,'_blank','noopener');return;}
 const html=makePrintPage(d,blank===true||blank==='blank',blank==='combined');
 let f=document.getElementById('psyPrint');if(f)f.remove();
 f=document.createElement('iframe');f.id='psyPrint';f.title='Печать материала';f.style='position:fixed;right:0;bottom:0;width:0;height:0;border:0';document.body.appendChild(f);
 f.onload=()=>{try{f.contentWindow.focus();f.contentWindow.print()}catch(e){alert('В этом браузере печать недоступна.')}};
 f.contentDocument.open();f.contentDocument.write(html);f.contentDocument.close();
}
function saveMethodHTML(){
 const d=DETAILS[methodNow?.name];if(!d)return;
 if(['colorRelations8','digitSpanPsy','dynamicPraxisLuria','simpleAnalogies12','pairedAssoc20'].includes(d.workflow)){window.open(d.guideFile,'_blank','noopener');return;}
 const data='<!doctype html>'+makePrintPage(d,false),url=URL.createObjectURL(new Blob([data],{type:'text/html;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download=methodNow.name.replace(/[\\/:*?"<>|]+/g,'_')+'.html';a.click();URL.revokeObjectURL(url);
}
function openMethod(m){
 if(!m)return;
 if(methodNow?.name){methodSessions[methodNow.name]={rows,modeSnapshots,modeIndices,calcMode,rowIndex}};
 methodNow=m;tabNow='overview';
 const saved=methodSessions[m.name];
 calcMode=saved?.calcMode||'one';
 modeSnapshots=saved?.modeSnapshots||{one:[{name:"",answers:[]}],class:[{name:"",answers:[]}]};
 modeIndices=saved?.modeIndices||{one:0,class:0};
 rows=saved?.rows||modeSnapshots[calcMode];rowIndex=saved?.rowIndex||0;
 const d=DETAILS[m.name];$('#modalTitle').textContent=m.name;$('#modalAuthor').textContent='Сведения о методике';
 $('#modalBody').innerHTML='';
 const header=$('#modal').querySelector('.modalhead');
 let old=$('#methodTabs');if(old)old.remove();
 const mspssPilot=d?.workflow==='mspss';
 const schultePilot=d?.workflow==='schulte5';
 const luriaPilot=d?.workflow==='luria10x5';
 const analogyPilot=d?.workflow==='simpleAnalogies12';
 $('#modal').classList.toggle('psy-schulte-example',schultePilot);
 $('#modal').classList.toggle('psy-luria-mode',luriaPilot);
 const matchMSPSS=['simpleAnalogies12','pairedAssoc20'].includes(d?.workflow);
 $('#modal').classList.toggle('psy-mspss-example',mspssPilot||matchMSPSS);
 const tabs=[['overview','Портфолио'],['instruction','Методика / руководство'],['materials','Бланк']];
 // MSPSS: processing is reached using the original green bottom action.
 header.insertAdjacentHTML('afterend','<nav class="method-tabs" id="methodTabs">'+tabs.map(([key,title])=>'<button class="modal-tab" data-tab="'+key+'">'+title+'</button>').join('')+'</nav>');
 document.querySelectorAll('.modal-tab').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
 const footer=$('#modal').querySelector('.modalfoot');
 footer.hidden=!d;
 footer.innerHTML=luriaPilot?'<div class="psy-luria-footer"><button type="button" class="btn primary psy-bottom-processing" id="bottomProcessing">Обработка результатов</button><button type="button" class="btn" id="luriaBack" hidden>Вернуться к портфолио</button><div class="psy-luria-footer-right"><span class="psy-luria-status is-waiting" id="luriaFooterStatus" hidden>Требуется заполнение</span><button type="button" class="btn" id="luriaReportBottom" disabled hidden>Скачать отчет участника</button><button type="button" class="btn" id="luriaResetBottom" hidden>Очистить ответы</button></div></div>':analogyPilot?'<div class="psy-analogies-footer"><button type="button" class="btn primary psy-bottom-processing" id="bottomProcessing">Обработка результатов</button><button type="button" class="btn psy-analogies-back" id="anaBack" hidden>Вернуться к портфолио</button><div class="psy-analogies-footer-right"><button type="button" class="btn psy-analogies-report" id="anaReportBottom" disabled hidden>Скачать отчет участника</button><button type="button" class="btn psy-analogies-reset" id="anaResetBottom" hidden>Очистить ответы</button></div></div>':schultePilot?'<div class="psy-schulte-footer"><button type="button" class="btn primary psy-bottom-processing" id="bottomProcessing">Обработка результатов →</button><button type="button" class="btn psy-schulte-back" id="schulteBack" hidden>← Вернуться к портфолио</button><div class="psy-schulte-footer-right"><button type="button" class="btn psy-schulte-report" id="schulteReportBottom" disabled hidden>Скачать отчёт участника</button><button type="button" class="btn psy-schulte-reset" id="schulteResetBottom" hidden>Очистить ответы</button></div></div>':matchMSPSS?'<div class="psy-mspss-footer"><button class="btn primary psy-bottom-processing" id="bottomProcessing">Обработка результатов →</button></div>':mspssPilot?'<div class="psy-mspss-footer"><button class="btn primary psy-bottom-processing" id="bottomProcessing">Обработка результатов →</button><button class="btn psy-mspss-return" id="mspssBack" hidden>← Вернуться к портфолио</button><div class="psy-mspss-footer-right"><button class="btn psy-mspss-report" id="mspssReportBottom" disabled hidden>Скачать отчет участника</button><button class="btn psy-mspss-reset" id="mspssResetBottom" hidden>Очистить ответы</button></div></div>':'<div class="psy-standard-footer">'+(d?'<button type="button" class="btn primary psy-bottom-processing" id="bottomProcessing">Обработка результатов</button>':'')+'</div>';
 // Schulte has exactly one primary action in the overview.
 // Anchor it to the right edge of the modal footer, independently of flex/grid
 // styles that may have been introduced by shared modal themes.
 if(schultePilot){
  footer.style.setProperty('position','relative','important');
  footer.style.setProperty('width','100%','important');
  const action=footer.querySelector('#bottomProcessing');
  if(action){
   for(const [property,value] of [
    ['position','absolute'],['right','24px'],['left','auto'],['top','auto'],
    ['bottom','10px'],['margin-left','0'],['margin-right','0'],
    ['transform','none']
   ])action.style.setProperty(property,value,'important');
  }
 }
 if(d?.guideFile&&d?.answerFile&&d?.processingFile){const buttons=footer.querySelector('#methodButtons');if(buttons)buttons.insertAdjacentHTML('afterbegin','<a class="btn" href="'+escapeHTML(d.guideFile)+'" target="_blank" rel="noopener noreferrer">Руководство А4</a><a class="btn" href="'+escapeHTML(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Бланк А4</a><a class="btn" href="'+escapeHTML(d.processingFile)+'" target="_blank" rel="noopener noreferrer">Обработка А4</a>'+(d.stimulusFile?'<a class="btn" href="'+escapeHTML(d.stimulusFile)+'" target="_blank" rel="noopener noreferrer">Стимулы А4</a>':''));}
 if(d?.workflow==='storycards'||d?.workflow==='ladder7'||d?.workflow==='schulte5'||d?.workflow==='familySocio110'||d?.workflow==='luria10x5'){const link=[...footer.querySelectorAll('a')].find(a=>a.textContent.includes('Первоисточник'));if(link||d?.workflow==='kfdBurns72'){link.href=d.source;link.textContent=d.workflow==='ladder7'?'Опубликованное руководство PDF ↗':'Методическое описание ↗';}}
 if(d)$('#bottomProcessing').onclick=()=>setTab(tabNow==='score'||tabNow==='processing'?'overview':d.calculator?'score':'processing');
 if(analogyPilot){$('#anaBack').onclick=()=>setTab('overview');}
 if(luriaPilot){
  $('#luriaBack').onclick=()=>setTab('overview');
  $('#luriaReportBottom').onclick=()=>window.PSY_LURIA.report(d,rows,calcMode,rowIndex);
  $('#luriaResetBottom').onclick=()=>{if(!confirm('Очистить результаты выбранного участника?'))return;rows[rowIndex].answers=[];rows[rowIndex].luriaNotes=[];setTab('score');};
 }
 if(schultePilot){
  $('#schulteBack').onclick=()=>setTab('overview');
  $('#schulteReportBottom').onclick=()=>window.PSY_SCHULTE.report(d,rows,calcMode,rowIndex);
  $('#schulteResetBottom').onclick=()=>{if(!confirm('Очистить результаты выбранного участника?'))return;rows[rowIndex].answers=[];setTab('score');};
 }
 if(mspssPilot){$('#mspssBack').onclick=()=>setTab('overview');$('#mspssReportBottom').onclick=()=>calcMode==='class'?window.PSY_MSPSS.openClassReport(rows):window.PSY_MSPSS.openReport(rows[rowIndex]);$('#mspssResetBottom').onclick=()=>{if(!confirm('Очистить ответы выбранного участника?'))return;rows[rowIndex].answers=[];setTab('score');document.querySelector('input[data-mspss]')?.focus();};}

 $('#modal').hidden=false;$('#shade').hidden=false;setTab('overview');
}
window.openMethod=openMethod;
render();
