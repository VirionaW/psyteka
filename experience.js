
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
"СДВГ":'<circle cx="17" cy="11" r="4"/><path d="M17 16v9m0-5-10 7m10-5 10 4m-10-1-5 11m5-11 7 11m3-27q9 4 0 9m5 3q7 4-1 8"/>',
"Агрессия":'<path d="m20 4 5 11 11 5-11 5-5 11-5-11-11-5 11-5z"/>',
"Общение":'<path d="M5 9h21v16H14l-7 6v-6H5z"/><path d="M22 14h13v16h-8l-5 5v-5"/>',
"Мотивация":'<path d="M18 4 10 22h10l-2 14 14-20H21z"/>',
"Мониторинг риска":'<path d="M20 5 33 11v10q0 10-13 15Q7 31 7 21V11z"/><path d="m13 20 5 5 10-11"/>',
"ПМПК":'<rect x="6" y="16" width="9" height="19" rx="2"/><rect x="16" y="5" width="9" height="30" rx="2"/><rect x="26" y="11" width="9" height="24" rx="2"/>',
"Программы":'<path d="M7 6h21v29H7z"/><path d="M13 13h9m-9 7h9m-9 7h7"/>'
};
const METHOD_ART_INDEX=new Map(["Школа зверей","Что мне нравится в школе","Дерево (Человечки на дереве)","Шкала личностной тревожности","GAD-7 - краткая шкала тревожных симптомов","Coopersmith Self-Esteem Inventory","PHQ-9 - опросник депрессивных симптомов","SNAP-IV-26","Кинетический рисунок семьи","Опросник родительского отношения","Шкала явной тревожности для детей (CMAS)","Краткий опросник настроения (SMFQ)","CES-DC","Опросник готовности подростков к самостоятельной жизни","Шкала воспринимаемой социальной поддержки (MSPSS)","Опросник социально-эмоциональных навыков","Исследование мотивационной сферы","Показатели школьной дезадаптации","Опросник «Субъектная позиция»","Групповой интеллектуальный тест (ГИТ)","SCARED","RCADS-47","Индекс хорошего самочувствия WHO-5","Семейная социограмма","Опросник взаимодействия родитель - ребенок (ВРР)","Школьный тест умственного развития (ШТУР)","Социально-психологическая адаптация","Vanderbilt Assessment Scales","МД-решетка Шмальта","Опросник ролей в ситуации школьного буллинга"].map((n,i)=>[n,i]));
function artForMethod(m){const i=METHOD_ART_INDEX.get(m.name);if(i===undefined)return iconSvg(m.theme);const x=i%8/7*100,y=Math.floor(i/8)/4*100;return '<span class="method-art-tile" role="img" aria-label="Иллюстрация к '+escapeHTML(m.name)+'" style="background-position:'+x.toFixed(4)+'% '+y.toFixed(4)+'%"></span>'}
function iconSvg(theme){return '<svg viewBox="0 0 40 40" role="img" aria-label="'+escapeHTML(theme)+'" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'+(categoryIcons[theme]||categoryIcons["ПМПК"])+'</svg>'}
function render(){
 const filtered=C.filter(m=>{const hay=[m.name,m.author,m.theme,m.goal].join(" ").toLowerCase();return (!state.topic||m.theme===state.topic)&&(!state.category||m.theme===state.category)&&(!state.query||hay.includes(state.query.toLowerCase()))&&(!state.format||(state.format==="Проективная"?/проективн|рисуночн/i.test(m.format):state.format==="Проба"?/проба|графическ|табличн/i.test(m.format):state.format==="Программа"?m.format==="Программа":m.format==="Опросник"))});
 $("#resultCount").textContent="Найдено: "+filtered.length;
 $("#listHeading").textContent=state.topic||"Школьные материалы";
 $("#catalog").innerHTML=filtered.map(m=>{
 const d=DETAILS[m.name],age=d?.age||m.age;
 const description=m.summary||d?.goal||m.goal||'Описание методики';
 const kind=d?.workflow==='diagnostic03'?'scale':d?.special==='memory10'?'memory':d?.special==='odd4'?'cognitive':(d?.graphic==='drawing'||d?.graphic==='sociogram')?'drawing':(d?.graphic==='dictation'||d?.graphic==='schulte'||d?.graphic==='dembo'||d?.graphic==='ladder')?'graphic':(d?.calculator?'scale':'other');
 const author=(d?.author||m.author||'');
 const credited=author&&!/сведения об авторе уточняются/i.test(author)?'<p class="method-card-author">'+escapeHTML(author)+'</p>':'<p class="method-card-author">Автор не установлен</p>';
 const count=d?.count||m.count;
 const countTag=count?'<span class="tag">'+escapeHTML(count)+'</span>':'';
 return '<article class="method" data-kind="'+kind+'"><div class="head"><div class="glyph">'+artForMethod(m)+'</div><div><h3>'+escapeHTML(m.name)+'</h3>'+credited+'</div></div><div class="tags"><span class="tag">'+escapeHTML(m.format)+'</span><span class="tag">'+escapeHTML(age)+'</span>'+countTag+'</div><p class="method-card-summary">'+escapeHTML(description)+'</p><div class="actions"><button class="btn primary" data-open="'+escapeHTML(m.id)+'">Открыть методику</button>'+(d?.calculator?'<button class="btn" data-score="'+escapeHTML(m.id)+'">Обработка</button>':'')+'</div></article>';
 }).join("") || '<p>Не найдено материалов по выбранным параметрам.</p>';
 document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openMethod(C.find(m=>m.id===b.dataset.open)));
 document.querySelectorAll('[data-score]').forEach(b=>b.onclick=()=>{openMethod(C.find(m=>m.id===b.dataset.score));setTab("score")});
}
function setTab(name){
 tabNow=name;
 document.querySelectorAll(".modal-tab").forEach(x=>{x.classList.toggle("active",x.dataset.tab===name);x.setAttribute("aria-selected",String(x.dataset.tab===name))});
 const body=$("#modalBody");
 if(!methodNow){return}
 body.innerHTML=name==="overview"?viewOverview(methodNow):
 name==="instruction"?viewInstruction(methodNow):
 name==="materials"?viewMaterials(methodNow):
 name==="processing"?viewProcessing(methodNow):viewCalculator(methodNow);
 body.scrollTop=0;
 const bottom=$("#bottomProcessing");
 if(bottom){
  const insideProcessing=name==="score"||name==="processing";
  bottom.textContent=insideProcessing?"← Вернуться к портфолио":"Обработка результатов →";
  bottom.classList.toggle("primary",!insideProcessing);
 }
 bindControls();
}

const PORTFOLIO_FIELDS={
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
function viewOverview(m){
 const d=DETAILS[m.name]||{};
 const name=m.name;
 const author=d.author||m.author||"";
 const verifiedAuthor=author&&!/сведения об авторе уточняются/i.test(author)?author:"Не указан в проверенном источнике";
 const age=d.age||m.age||"Не уточнен";
 const kind=d.kind||m.format||"Не уточнен";
 const count=d.count||m.count||"Не уточнено";
 const description=d.goal||m.summary||m.goal||"Описание уточняется по первоисточнику.";
 const source=d.source||m.source||"";
 const fields=[["Методика",name],["Автор",verifiedAuthor],["Возраст",age],["Вид",kind],["Количество вопросов / заданий",count]];
 const fieldHtml=fields.map(([label,value])=>'<div class="psy-profile-row"><strong>'+escapeHTML(label)+'</strong><span>'+escapeHTML(value)+'</span></div>').join("");
 const indicators=portfolioIndicators(m,d);
 const indicatorHtml=indicators.items.length?'<div class="psy-profile-indicators">'+indicators.items.map((t,i)=>'<div class="psy-profile-indicator"><span class="psy-indicator-number" aria-hidden="true">'+(i+1)+'</span><span>'+escapeHTML(t)+'</span></div>').join("")+'</div>':'<p class="psy-profile-muted">Перечень шкал для этой редакции пока не подтвержден.</p>';
 const sourceHtml=source?'<a href="'+escapeHTML(source)+'" target="_blank" rel="noopener noreferrer">Открыть первоисточник ↗</a>':'<span class="psy-profile-muted">Проверенная ссылка на первоисточник пока не добавлена.</span>';
 return '<section class="psy-portfolio-reference"><h3>Общие сведения</h3><div class="psy-profile-lines">'+fieldHtml+'</div><h3>'+escapeHTML(indicators.title)+'</h3>'+indicatorHtml+'<h3>Краткое описание</h3><p class="psy-profile-description">'+escapeHTML(description)+'</p>'+(d.warning?'<div class="notice psy-lus-warning">'+escapeHTML(d.warning)+'</div>':'')+'<h3>Первоисточник</h3><p class="psy-profile-source">'+sourceHtml+'</p></section>';
}
function viewInstruction(m){
 const d=DETAILS[m.name];
 if(d?.workflow==='dembo7')return window.PSY_DEMBO.instruction(d);
 if(d?.workflow==='elkonin4')return window.PSY_ELKONIN.instruction(d);
 if(d?.workflow==='storycards')return window.PSY_STORYCARDS.instruction(d);
 if(d?.workflow==='bourdon30')return window.PSY_BOURDON.instructions(d);
 if(d?.workflow==='selwork2026')return window.PSY_SEL_SKILLS.instruction(d);
  if(d?.workflow==='mspss')return window.PSY_MSPSS.instruction(d);
 if(d?.workflow==='phillips58')return window.PSY_PHILLIPS.instruction(d);
 if(d?.workflow==='snap26')return window.PSY_SNAP26.instruction(d);
  if(d?.workflow==='smfq')return window.PSY_SMFQ.instruction(d);
 if(d?.workflow==='luskanova')return window.PSY_LUSKANOVA.instruction(d);
 if(d?.workflow==='fresh06')return window.PSY_NEW_METHODS.instruction(d);
  if(!d)return '<div class="notice">Полный текст руководства для данной версии пока не подтвержден. Используйте проверенный первоисточник, а не описание карточки вместо инструкции.</div>';
 return '<h3>Инструкция для участника</h3><blockquote class="kid-instruction">'+escapeHTML(d.instructions)+'</blockquote><h3>Порядок проведения для психолога</h3><ol><li>Проверьте соответствие возраста и цели.</li><li>Объясните добровольность и порядок работы.</li><li>Предъявите стимульный материал без подсказок.</li><li>Зафиксируйте ответы, длительность и существенные наблюдения.</li><li>Проводите интерпретацию в пределах применимых методических норм.</li></ol>'+(d.graphic==='dictation'?dictationCommands(d):'')+(d.special?window.PSY_BATCH02.extraInstructions(d):'')+(d.workflow==='diagnostic'?window.PSY_DIAGNOSTICS.instructions(d):'')+(d.workflow==='diagnostic03'?window.PSY_DIAG03.instructions(d):'');
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
 const d=DETAILS[m.name];
 if(!d)return '<p>Полный материал доступен только у правообладателя.</p>';
 if(d.special)return window.PSY_BATCH02.materials(d,blank);
 if(d.workflow==='dembo7')return window.PSY_DEMBO.materials(d);
 if(d.workflow==='elkonin4')return window.PSY_ELKONIN.materials(d);
 if(d.workflow==='storycards')return window.PSY_STORYCARDS.materials(d);
 if(d.workflow==='bourdon30')return window.PSY_BOURDON.materials(d);
 if(d.workflow==='selwork2026')return window.PSY_SEL_SKILLS.materials(d);
  if(d.workflow==='mspss')return window.PSY_MSPSS.materials(d);
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
 const d=DETAILS[m.name];if(d?.workflow==='dembo7')return window.PSY_DEMBO.materials(d);
 if(d?.workflow==='elkonin4')return window.PSY_ELKONIN.materials(d);
 if(d?.workflow==='storycards')return window.PSY_STORYCARDS.materials(d);
 if(d?.workflow==='bourdon30')return window.PSY_BOURDON.materials(d);
 if(d?.workflow==='selwork2026')return window.PSY_SEL_SKILLS.materials(d);
  if(d?.workflow==='mspss')return window.PSY_MSPSS.materials(d);
 if(d?.workflow==='phillips58')return window.PSY_PHILLIPS.materials(d);
 if(d?.workflow==='snap26')return window.PSY_SNAP26.materials(d);
  if(d?.workflow==='smfq')return window.PSY_SMFQ.materials(d);
 if(d?.workflow==='luskanova')return window.PSY_LUSKANOVA.materials(d);
 if(d?.workflow==='fresh06')return window.PSY_NEW_METHODS.materials(d,false);
  if(!d)return '<div class="notice">Проверенный авторский бланк этой методики пока не добавлен. Применять карточку как готовую форму нельзя.</div>';
 return '<h3>Стимульный материал и бланк</h3>'+materials(m,false)+(d.questions?.length && d.graphic ? '<h3>Протокол беседы</h3><table class="questions-table"><thead><tr><th>№</th><th>Вопрос психолога</th><th>Ответ / наблюдение</th></tr></thead><tbody>'+d.questions.map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+escapeHTML(q)+'</td><td>________________</td></tr>').join('')+'</tbody></table>':"");
}
function viewProcessing(m){
 const d=DETAILS[m.name];if(!d)return '<div class="notice">Подтвержденный ключ и обработка выбранной версии пока не добавлены. Диагностические результаты здесь не рассчитываются.</div>';
 if(d.workflow==='dembo7')return window.PSY_DEMBO.processing(d);
 if(d.workflow==='elkonin4')return window.PSY_ELKONIN.processing(d);
 if(d.workflow==='storycards')return window.PSY_STORYCARDS.processing(d);
 if(d.workflow==='bourdon30')return window.PSY_BOURDON.processing(d);
 if(d.workflow==='selwork2026')return window.PSY_SEL_SKILLS.processing(d);
  if(d.workflow==='mspss')return window.PSY_MSPSS.processing(d);
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
 if(d.workflow==='dembo7')return window.PSY_DEMBO.score(d,answers);
 if(d.workflow==='elkonin4')return window.PSY_ELKONIN.score(answers);
 if(d.workflow==='storycards')return window.PSY_STORYCARDS.score(d,answers);
 if(d.workflow==='bourdon30')return window.PSY_BOURDON.score(d,answers);
 if(d.workflow==='selwork2026')return window.PSY_SEL_SKILLS.score(d,answers);
  if(d.workflow==='mspss')return window.PSY_MSPSS.score(d,answers);
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
 const d=DETAILS[m.name];
 if(d?.workflow==='dembo7')return window.PSY_DEMBO.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='elkonin4')return window.PSY_ELKONIN.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='storycards')return window.PSY_STORYCARDS.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='bourdon30')return window.PSY_BOURDON.calculator(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='selwork2026')return window.PSY_SEL_SKILLS.calculator(d,{rows,rowIndex,calcMode});
  if(d?.workflow==='mspss')return window.PSY_MSPSS.calculator(d,{rows,rowIndex,calcMode});
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
 const d=DETAILS[methodNow.name];
 if(d?.workflow==='dembo7')window.PSY_DEMBO.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='elkonin4')window.PSY_ELKONIN.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='storycards')window.PSY_STORYCARDS.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='bourdon30')window.PSY_BOURDON.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='selwork2026')window.PSY_SEL_SKILLS.bind(d,{rows,rowIndex,calcMode});
  if(d?.workflow==='mspss')window.PSY_MSPSS.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='phillips58')window.PSY_PHILLIPS.bind(d,{rows,rowIndex,calcMode});
 if(d?.workflow==='snap26')window.PSY_SNAP26.bind(d,{rows,rowIndex,calcMode});
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
 $("#resetParticipant")?.addEventListener('click',()=>{if(confirm('Очистить ответы выбранного участника?')){const current=rows[rowIndex];current.answers=[];if(d.workflow==='storycards')current.storyDetails=[{},{}];if(d.workflow==='diagnostic03'&&d.diagnosticType==='vanderbilt'){current.answerSets ||= {};current.answerSets[current.variant||'parent']=current.answers;}setTab('score')}});
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
function makePrintPage(d,blank){
 const h='<html lang="ru"><head><meta charset="utf-8"><title>Психотека - '+escapeHTML(methodNow.name)+'</title><style>@page{size:A4;margin:13mm}body{font:11pt/1.35 Arial,sans-serif;color:#22372d}h1{font-size:18pt}h2{font-size:13pt}p{margin:7px 0}table{border-collapse:collapse;width:100%;table-layout:fixed}td,th{border:1px solid #789c87;padding:6px;vertical-align:top;font-size:10pt;overflow-wrap:break-word}tr{break-inside:avoid;page-break-inside:avoid}.questions-table td:first-child{width:38px}.questions-table td:last-child{width:75px}.stimulus-paper svg{max-width:100%;height:auto}.drawing-space{border:1px solid #abc5b3;height:570px}.dictation-grid{break-inside:avoid;margin:5px 0}.dictation-grid svg{width:100%;height:132px}.dictation-grid h4{margin:0}.dictation-script{margin:8px 0;break-inside:avoid}.schulte-grid{display:grid;grid-template-columns:repeat(5,1fr);max-width:430px;margin:25px auto}.schulte-grid div{border:1px solid #698f76;text-align:center;font-size:22pt;padding:15px}.scale-options{margin:15px 0;display:flex;flex-wrap:wrap;gap:9px}.scale-options span{border:1px solid #b8cfbe;padding:8px}.drawing-instruction{margin:15px 0}.blank-instruction{margin:15px 0}button{display:none}'+(d.special?window.PSY_BATCH02.printCSS:'')+'</style></head><body>';
 const base=blank?'<p>Фамилия, имя: ________________________________ Дата: ____________</p>':'<h1>'+escapeHTML(methodNow.name)+'</h1><p>'+escapeHTML(d.author)+' · '+escapeHTML(d.age)+'</p><h2>Цель</h2><p>'+escapeHTML(d.goal)+'</p><h2>Инструкция участнику</h2><p>'+escapeHTML(d.instructions)+'</p>'+(d.special?window.PSY_BATCH02.extraInstructions(d):'');
 return h+base+(blank?materials(methodNow,true):'<h2>Задания и стимулы</h2>'+materials(methodNow,false)+(d.graphic==='dictation'?dictationCommands(d):'')+(d.graphic==='drawing'&&d.questions?.length?'<h2>Протокол беседы</h2><ol>'+d.questions.map(q=>'<li>'+escapeHTML(q)+' – ________________________________</li>').join('')+'</ol>':'')+'<h2>Обработка</h2><p>'+escapeHTML(d.scoring)+'</p><h2>Интерпретация</h2><p>'+escapeHTML(d.interpret)+'</p>')+(d.workflow==='diagnostic'?'<h2>Оригинальный бланк</h2><p><a href="'+escapeHTML(d.officialBlank)+'">'+escapeHTML(d.officialBlank)+'</a></p><p>'+escapeHTML(d.license)+'</p>':'')+'</body></html>';
}
function printMaterial(blank){
 const d=DETAILS[methodNow?.name];if(!d)return;
 const html=makePrintPage(d,blank);
 let f=document.getElementById('psyPrint');if(f)f.remove();
 f=document.createElement('iframe');f.id='psyPrint';f.title='Печать материала';f.style='position:fixed;right:0;bottom:0;width:0;height:0;border:0';document.body.appendChild(f);
 f.onload=()=>{try{f.contentWindow.focus();f.contentWindow.print()}catch(e){alert('В этом браузере печать недоступна.')}};
 f.contentDocument.open();f.contentDocument.write(html);f.contentDocument.close();
}
function saveMethodHTML(){
 const d=DETAILS[methodNow?.name];if(!d)return;
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
 const tabs=[['overview','Портфолио'],['instruction','Методика / руководство'],['materials','Бланк']];
 header.insertAdjacentHTML('afterend','<nav class="method-tabs" id="methodTabs">'+tabs.map(([key,title])=>'<button class="modal-tab" data-tab="'+key+'">'+title+'</button>').join('')+'</nav>');
 document.querySelectorAll('.modal-tab').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
 const footer=$('#modal').querySelector('.modalfoot');
 footer.innerHTML='<div class="actions" id="methodButtons">'+((['luskanova','smfq','bourdon30','mspss','storycards','elkonin4','snap26','dembo7','selwork2026','phillips58'].includes(d?.workflow))?'<a class="btn" href="'+escapeHTML(d.guideFile)+'" download>Методика · Word</a>'+(d.workflow==='selwork2026'?'<a class="btn" href="'+escapeHTML(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Бланк ученика · А4</a><a class="btn" href="'+escapeHTML(d.studentWordFile)+'" download>Бланк ученика · Word</a><a class="btn" href="'+escapeHTML(d.specialistFile)+'" target="_blank" rel="noopener noreferrer">Протокол психолога · А4</a>':d.workflow==='mspss'?'<a class="btn" href="'+escapeHTML(d.studentFile)+'" target="_blank" rel="noopener noreferrer">Бланк ученика · А4</a><a class="btn" href="'+escapeHTML(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Регистрация ответов</a>':(d.workflow==='phillips58'?'<a class="btn" href="'+escapeHTML(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Бланк ученика · А4</a>':'<a class="btn" href="'+escapeHTML(d.answerFile)+'" download>Бланк</a>')+(d?.workflow==='snap26'?'<a class="btn" href="'+escapeHTML(d.teacherFile)+'" target="_blank" rel="noopener">Бланк педагога · А4</a>':''))+(d.workflow==='selwork2026'?'<a class="btn" href="'+escapeHTML(d.source)+'" target="_blank" rel="noopener noreferrer">Рамка CASEL ↗</a>':'<a class="btn" href="'+escapeHTML(d.officialBlank)+'" target="_blank" rel="noopener noreferrer">'+(d.workflow==='phillips58'?'Текст 58 вопросов и ключ ↗':'Первоисточник PDF ↗')+'</a>'):d?(d.workflow==='fresh06'?'<a class="btn" href="'+escapeHTML(d.guideFile)+'" download>Методика · Word</a><a class="btn" href="'+escapeHTML(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Бланк · А4</a>':'')+'<button class="btn" id="printFull">Распечатать всю методику</button><button class="btn" id="printBlank">'+(d.workflow==='diagnostic'||d.workflow==='diagnostic03'&&d.diagnosticType==='vanderbilt'?'Оригинальный бланк PDF':d.special==='memory10'?'Протокол для психолога':'Бланк для ребенка')+'</button><button class="btn" id="saveMethod">Скачать методику</button>'+(d.workflow==='diagnostic03'&&d.diagnosticType==='rses'?'<button class="btn" id="saveBlank">Скачать бланк</button>':'')+'':'')+'</div><div class="actions psy-footer-main"><button class="btn psy-footer-close" id="closeFooter">Закрыть</button>'+(d?'<button class="btn primary psy-bottom-processing" id="bottomProcessing">Обработка результатов →</button>':'')+'</div>';
 if(d?.workflow==='storycards'){const link=[...footer.querySelectorAll('a')].find(a=>a.textContent.includes('Первоисточник'));if(link){link.href=d.source;link.textContent='Описание процедуры PDF ↗';}}
 $('#closeFooter').onclick=closeModal; if(d)$('#bottomProcessing').onclick=()=>setTab(tabNow==='score'||tabNow==='processing'?'overview':d.calculator?'score':'processing');
 if(d&&!['luskanova','smfq','bourdon30','mspss','storycards','elkonin4','snap26','dembo7','selwork2026','phillips58'].includes(d.workflow)){$('#printFull').onclick=()=>printMaterial(false);$('#printBlank').onclick=()=>{if(d.workflow==='diagnostic'||d.workflow==='diagnostic03'&&d.diagnosticType==='vanderbilt'){window.open(d.officialBlank,'_blank','noopener,noreferrer')}else printMaterial(true)};$('#saveMethod').onclick=saveMethodHTML;if(d.workflow==='diagnostic03'&&d.diagnosticType==='rses')$('#saveBlank').onclick=()=>window.PSY_DIAG03.saveBlank(d);}
 $('#modal').hidden=false;$('#shade').hidden=false;setTab('overview');
}
window.openMethod=openMethod;
render();
