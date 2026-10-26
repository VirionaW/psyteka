"use strict";
(function(){
 const SOURCE_MITTENS="https://psyjournals.ru/journals/bppe/archive/2015_n2/Doronina";
 const SOURCE_SECRET="https://psylist.net/praktikum/00422-htm";
 const catalog=[
  {id:"preschool-tsukerman-mittens",verified:true,verifiedKey:"mittens",group:"Диагностика",topic:"Общение",title:"Рукавички",author:"Г. А. Цукерман",age:"6,5-7",format:"Парная рисуночная методика",goal:"Оценка согласования действий и сотрудничества двух детей при создании одинакового узора на рукавичках.",source:SOURCE_MITTENS},
  {id:"preschool-repina-secret",verified:true,verifiedKey:"secret",group:"Диагностика",topic:"Общение",title:"Секрет (Подарок)",author:"Т. А. Репина; модификация Т. В. Антоновой",age:"5-6",format:"Социометрическая игровая методика",goal:"Изучение избирательных отношений и предпочтений сверстников в дошкольной группе через три конфиденциальных выбора.",source:SOURCE_SECRET}
 ];
 const state=new Map(),$=s=>document.querySelector(s);
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const lookup=d=>catalog.find(m=>m.id===d.preschoolId);
 const isMit=d=>d.verifiedKey==="mittens";
 const defaultMit=()=>({similarity:"",agreement:"",control:"",help:"",emotion:"",level:"",note:""});
 const defaultSecret=()=>({size:0,rows:[],note:"",remarks:""});
 const get=d=>{if(!state.has(d.preschoolId))state.set(d.preschoolId,isMit(d)?defaultMit():defaultSecret());return state.get(d.preschoolId)};
 const mittensIndicators=["Сходство узоров на рукавичках","Предварительная договоренность","Взаимный контроль при выполнении","Взаимопомощь","Эмоциональный характер сотрудничества"];
 const secretIndicators=["Первый, второй, третий положительный выбор","Число полученных выборов каждым участником","Взаимность положительных выборов","Мотивы выбора и высказывания ребенка","Участие детей и наличие отказов"];
 function profile(d){
  const m=lookup(d);if(!m)return "";
  const rows=[["Методика",m.title],["Автор",m.author],["Возраст",m.age+" лет"],["Форма",isMit(d)?"Наблюдение за парной работой":"Индивидуальная игра в группе"],["Материалы",isMit(d)?"Два силуэта рукавичек и одинаковые карандаши":"Три картинки или открытки для каждого участника"],["Оценивание",isMit(d)?"Три описательных уровня":"Подсчет полученных выборов и качественный анализ"]];
  const goal=m.goal;const indicators=isMit(d)?mittensIndicators:secretIndicators;
  return '<section class="psy-portfolio-reference psy-portfolio-unified"><h3>Общие сведения</h3><div class="psy-profile-lines">'+rows.map(([a,b])=>'<div class="psy-profile-row"><strong>'+esc(a)+'</strong><span>'+esc(b)+'</span></div>').join("")+'</div><h3>Цель</h3><p class="psy-profile-description">'+esc(goal)+'</p><h3>Критерии и показатели</h3><div class="psy-profile-indicators">'+indicators.map(t=>'<div class="psy-profile-indicator"><span>'+esc(t)+'</span></div>').join("")+'</div><h3>Первоисточник</h3><p class="psy-profile-source"><a target="_blank" rel="noopener noreferrer" href="'+esc(m.source)+'">Открыть методическое описание</a></p></section>';
 }
 function mittenGuide(){
  return '<h3>Цель и участники</h3><p>Определить, как два ребенка 6,5-7 лет согласуют действия, договариваются, взаимно контролируют выполнение и помогают друг другу.</p>'+
   '<h3>Подготовка</h3><p>Посадите двух детей рядом. Каждому выдайте отдельный чистый силуэт рукавички (левую и правую) и одинаковый набор цветных карандашей. Узоры должны быть придуманы самими детьми, готовый образец не требуется.</p>'+
   '<h3>Инструкция детям</h3><blockquote class="kid-instruction">Перед вами две рукавички. Украсьте их так, чтобы получилась пара, то есть чтобы узоры были одинаковыми. Сначала договоритесь, какой будет узор, а потом рисуйте.</blockquote>'+
   '<h3>Проведение</h3><ol><li>Передайте детям бланки и карандаши; сообщите инструкцию без навязывания узора.</li><li>Во время самостоятельной совместной работы наблюдайте за обсуждением, координацией действий, взаимопомощью и эмоциональной реакцией.</li><li>После завершения сравните оба рисунка и зафиксируйте совпадение узоров с учетом процесса сотрудничества.</li><li>Отдельно запишите замечания специалиста и ситуации, в которых требовалась помощь взрослого.</li></ol>'+
   '<h3>Критерии регистрации</h3><p>Сходство изображений; способность договориться; взаимная проверка и координация действий; взаимопомощь; позитивное, нейтральное или напряженное отношение к совместной работе.</p>'+
   '<h3>Оценка результата</h3><p><b>Высокий уровень:</b> рукавички одинаковы или очень похожи, дети обсуждают вариант, приходят к согласию и соотносят действия с общим замыслом.</p><p><b>Средний уровень:</b> совпадают отдельные элементы или цвета, но заметны различия.</p><p><b>Низкий уровень:</b> узоры значительно различаются либо сходства нет, дети не приходят к договоренности и действуют разобщенно.</p>'+
   '<p>Специалист выбирает уровень после наблюдения; приложение не присваивает его автоматически по искусственному числовому ключу.</p>'+
   '<h3>Ограничения</h3><p>Описательный уровень относится к выполнению данного задания парой, а не к личности каждого ребенка и не является клиническим диагнозом. Учитывайте владение карандашом, особенности коммуникации, доступность задания и контекст.</p>'+
   '<h3>Источник</h3><p>Г. А. Цукерман, задание «Рукавички». Методическое описание приведено в статье И. Н. Дорониной, «Вестник практической психологии образования», 2015, т. 12, № 2.</p>';
 }
 function secretGuide(){
  return '<h3>Цель и возраст</h3><p>Изучение выборов и отношений между сверстниками в дошкольной группе. Данный комплект ориентирован на вариант для 5-6 лет (Т. А. Репина, модификация Т. В. Антоновой).</p>'+
   '<h3>Подготовка и условия</h3><p>Проводите индивидуально в спокойном помещении без других детей. Заранее подготовьте для каждого ребенка три небольшие картинки или открытки, список участников, место для конфиденциальной записи выборов. Все дети группы по возможности участвуют, но принуждать нельзя.</p>'+
   '<h3>Инструкция ребенку</h3><blockquote class="kid-instruction">Сегодня у нас игра с подарками. У тебя есть три картинки. Подумай, кому из детей вашей группы ты хотел бы их подарить. Каждому можно подарить только одну. Выбери сначала ту картинку, которая нравится тебе больше всего, и скажи, кому ты хотел бы ее подарить и почему.</blockquote>'+
   '<h3>Порядок проведения</h3><ol><li>По одному пригласите ребенка для индивидуального выбора. Объясните добровольность участия.</li><li>Запишите первый выбор и основание, затем второй и третий. Один и тот же ребенок не может получить более одного подарка от одного участника.</li><li>Зафиксируйте комментарии о выборе и ожидании ответного подарка, если ребенок готов обсуждать; от личных вопросов можно отказаться.</li><li>Не раскрывайте сделанные выборы сверстникам и не обсуждайте их публично.</li><li>По завершении организуйте получение подарков так, чтобы никто не был публично выделен отсутствием подарка; дополнительные подарки взрослого не включайте в диагностический подсчет.</li></ol>'+
   '<h3>Регистрация и подсчет</h3><p>Для каждого участника фиксируются три направленных положительных выбора в порядке 1, 2, 3. Подсчет – число выборов, полученных от других участников; можно дополнительно учитывать взаимность и охват группы. Каждому участнику в расчете присваивается только обезличенный код.</p>'+
   '<h3>Интерпретация</h3><p>Смотрите на распределение выборов и взаимность, учитывая размер группы, число неучаствовавших и особенности отношений. По одному тесту нельзя объявлять ребенка отвергаемым, изолированным или ставить психиатрический диагноз. Категории социометрического статуса не присваиваются автоматически из-за зависимости от варианта, численности и полноты исследования.</p>'+
   '<h3>Ограничения и конфиденциальность</h3><p>Данные предназначены только для специалиста. Не загружайте фамилии и имена в публичную форму, не публикуйте матрицу и не передавайте выборы другим семьям. Встроенный подсчет работает только локально в открытой вкладке; при обновлении данные будут утрачены.</p>'+
   '<h3>Источник</h3><p>Т. А. Репина, «Секрет» («Подарок»), вариант Т. В. Антоновой; описание процедуры и материалов в методических публикациях по дошкольной социометрии.</p>';
 }
 const guideTitle='<div class="psy-common-guide-head"><h3>Методика / руководство</h3><div class="psy-common-guide-actions"><button class="btn" type="button" data-psy-verified-print="guide">Без бланка</button><button class="btn primary" type="button" data-psy-verified-print="combined">С бланком</button></div></div>';
 const instruction=d=>guideTitle+'<div class="psy-preschool-guide">'+(isMit(d)?mittenGuide():secretGuide())+'</div>';
 // Own-drawn outline: blank printable aid, not a replacement for copyrighted picture sets.
 function mittenSvg(isRight){
  return '<svg viewBox="0 0 320 400" width="100%" height="360" role="img" aria-label="'+(isRight?'Правая рукавичка':'Левая рукавичка')+' – пустой контур" xmlns="http://www.w3.org/2000/svg"><path transform="'+(isRight?'translate(320 0) scale(-1 1)':'')+'" d="M88 354 L76 198 Q68 170 78 155 Q89 140 103 158 L120 191 L117 91 Q117 63 136 62 Q154 62 155 88 L159 56 Q163 31 183 38 Q199 43 198 64 L199 87 Q207 68 224 78 Q240 88 237 105 L235 146 Q250 132 264 147 Q275 164 264 189 L244 250 Q225 305 221 354 Z" fill="#fff" stroke="#345b4b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path transform="'+(isRight?'translate(320 0) scale(-1 1)':'')+'" d="M88 335 Q153 328 223 336" fill="none" stroke="#345b4b" stroke-width="3"/></svg>';
 }
 const printMitten=(right)=>'<section class="pv-sheet pv-mitten-sheet"><p class="pv-child-note">Укрась свою рукавичку. Договорись с партнером, чтобы узор получился одинаковым.</p>'+mittenSvg(right)+'</section>';
 const materialMit='<h3>Рабочий бланк ребенка</h3><p>Для пары печатаются два отдельных силуэта (левая и правая рукавички). Каждый ребенок получает только свой лист; оба пользуются одинаковым набором карандашей.</p><div class="pv-preview-mittens"><div>'+mittenSvg(false)+'</div><div>'+mittenSvg(true)+'</div></div><button type="button" class="btn primary" data-psy-verified-print="blank">Распечатать бланки А4</button><h3>Протокол специалиста</h3><p>Дата _________ Пара (коды участников) ____________________</p><p>Сходство узоров / предварительная договоренность / взаимный контроль / помощь / отношение к совместной работе: _____________________________________________</p><p>Итоговый уровень определяется специалистом после наблюдения по описанным критериям.</p>';
 const materialSecret='<h3>Протокол специалиста</h3><p>Для каждого ребенка используется отдельный лист. Записывайте три выбора в порядке предпочтения и короткие мотивы. Схема предназначена для специалистов, не для предъявления группе.</p><table class="preschool-table"><thead><tr><th>Очередность</th><th>Код выбранного ребенка</th><th>Причина выбора (записывает взрослый)</th></tr></thead><tbody>'+[1,2,3].map(i=>'<tr><td>'+i+'</td><td>________________</td><td>________________________</td></tr>').join("")+'</tbody></table><p>Высказывания ребенка и условия проведения: __________________________________________</p><button type="button" class="btn primary" data-psy-verified-print="blank">Распечатать протокол А4</button><p class="privacy-inline">Реальные картинки и открытки подготовьте отдельно. Протокол содержит только записи специалиста.</p>';
 const materials=d=>isMit(d)?materialMit:materialSecret;
 const fieldsMit=[
  ["similarity","Сходство двух узоров",[["","Нет ответа"],["equal","Одинаковые или очень похожие"],["part","Совпадают отдельные элементы"],["different","Сходства мало или нет"]]],
  ["agreement","Согласование замысла",[["","Нет ответа"],["yes","Договорились совместно"],["partial","Частичная договоренность"],["no","Не договорились"]]],
  ["control","Взаимный контроль",[["","Нет ответа"],["yes","Наблюдался"],["no","Не наблюдался"]]],
  ["help","Взаимопомощь",[["","Нет ответа"],["yes","Наблюдалась"],["no","Не наблюдалась"]]],
  ["emotion","Эмоциональный характер работы",[["","Нет ответа"],["positive","Позитивный"],["neutral","Нейтральный"],["negative","Напряженный"]]],
  ["level","Уровень по заключению специалиста",[["","Нет ответа"],["high","Высокий"],["medium","Средний"],["low","Низкий"]]]
 ];
 function mitReady(d){const a=get(d);return fieldsMit.every(([k])=>a[k])&&(a.level!=="high"||(a.similarity==="equal"&&a.agreement==="yes"))&&(a.level!=="low"||(a.similarity==="different"&&a.agreement==="no"))}
 function mitSummary(d){
  if(!mitReady(d))return '<p>Заполните все критерии и выберите экспертный уровень по руководству. Для высокого уровня необходимы близкие узоры и согласование, для низкого – выраженные различия и отсутствие договоренности. Пустые наблюдения не считаются отрицательными.</p>';
  const a=get(d),label=(k,v)=>fieldsMit.find(x=>x[0]===k)?.[2].find(x=>x[0]===v)?.[1]||v;
  return '<h3>Описание выполнения</h3><p>'+fieldsMit.map(([key,name])=>'<b>'+esc(name)+':</b> '+esc(label(key,a[key]))).join(". ")+'</p><p><b>Комментарий:</b> '+esc(a.note||"не указан")+'</p><p>Уровень является профессиональной оценкой наблюдавшегося сотрудничества, а не автоматическим баллом.</p>';
 }
 function mitCalc(d){
  const a=get(d),ready=mitReady(d);
  return '<section class="pv-calc"><div class="preschool-results-head"><h3>Обработка результатов</h3><span class="preschool-status '+(ready?"complete":"pending")+'" id="pvStatus">'+(ready?"Данные заполнены":"Требуется заполнение")+'</span></div><p>Отмечайте только наблюдаемые признаки. Итоговый качественный уровень выберите по критериям руководства.</p>'+
   '<div class="preschool-answer-list">'+fieldsMit.map(([key,label,opts])=>'<label class="preschool-answer"><span>'+esc(label)+'</span><select data-pv-mit="'+key+'">'+opts.map(([v,n])=>'<option value="'+v+'"'+(a[key]===v?" selected":"")+'>'+esc(n)+'</option>').join("")+'</select></label>').join("")+'</div>'+
   '<label class="preschool-note-label">Контекст и помощь (без имен)<textarea rows="3" id="pvNote">'+esc(a.note)+'</textarea></label><div class="preschool-summary" id="pvSummary">'+mitSummary(d)+'</div><div class="preschool-result-actions"><button class="btn" type="button" data-pv-reset>Очистить</button><button class="btn primary" data-psy-verified-print="result" '+(!ready?"disabled":"")+'>Печать результата</button></div></section>';
 }
 const codesFor=n=>Array.from({length:n},(_,i)=>"У"+String(i+1).padStart(2,"0"));
 const completeRow=(r,code,codes)=>r.status==="refused"||r.status==="done"&&r.choices.every(v=>v&&v!==code&&codes.includes(v))&&new Set(r.choices).size===3;
 function secretValidation(d){
  const s=get(d),codes=codesFor(s.size);
  return {ready:s.size>=4&&s.size<=40&&s.rows.length===s.size&&s.rows.every((r,i)=>completeRow(r,codes[i],codes)),codes};
 }
 function counts(d){
  const s=get(d),codes=codesFor(s.size),received=Object.fromEntries(codes.map(c=>[c,0])),rank=Object.fromEntries(codes.map(c=>[c,[0,0,0]]));
  let completed=0,refused=0;const arrows=[];
  s.rows.forEach((r,i)=>{if(r.status==="refused"){refused++;return}if(!completeRow(r,codes[i],codes))return;completed++;r.choices.forEach((c,k)=>{received[c]++;rank[c][k]++;arrows.push(codes[i]+"->"+c)})});
  const edges=new Set(arrows);const reciprocal=arrows.filter(edge=>{const [a,b]=edge.split("->");return edges.has(b+"->"+a)}).length/2;
  return {received,rank,completed,refused,mutual:reciprocal,codes};
 }
 function secretResults(d){
  const v=secretValidation(d);
  if(!v.ready)return '<p>Для корректной таблицы завершите протокол каждого участника. Выберите три разных кода или явный отказ, если ребенок не пожелал участвовать.</p>';
  const s=counts(d);
  return '<h3>Сводка выборов</h3><p>Участников: '+s.codes.length+'. Сделали три выбора: '+s.completed+'. Отказались: '+s.refused+'. Взаимных пар положительных выборов: '+s.mutual+'.</p>'+
   '<table class="preschool-table"><thead><tr><th>Код</th><th>Всего получено</th><th>1-й выбор</th><th>2-й выбор</th><th>3-й выбор</th></tr></thead><tbody>'+s.codes.map(c=>'<tr><td>'+c+'</td><td>'+s.received[c]+'</td><td>'+s.rank[c][0]+'</td><td>'+s.rank[c][1]+'</td><td>'+s.rank[c][2]+'</td></tr>').join("")+'</tbody></table><p>Число выборов – описательная мера внутри группы; автоматических ярлыков «отвержен» и «звезда» приложение не присваивает.</p>';
 }
 function secretCalc(d){
  const s=get(d),v=secretValidation(d);
  let rows=s.size?'<div class="pv-secret-rows">'+s.rows.map((r,i)=>{
   const code=v.codes[i],opts=Array.from(v.codes).filter(x=>x!==code);
   return '<div class="pv-secret-row"><strong>'+code+'</strong><select data-pv-secret-status="'+i+'" aria-label="Статус участника '+code+'"><option value="">Не заполнено</option><option value="done" '+(r.status==="done"?"selected":"")+'>Три выбора</option><option value="refused" '+(r.status==="refused"?"selected":"")+'>Не участвовал / отказ</option></select>'+[0,1,2].map(k=>'<select aria-label="Выбор '+(k+1)+' участника '+code+'" data-pv-secret-choice="'+i+'-'+k+'" '+(r.status!=="done"?"disabled":"")+'><option value="">'+(k+1)+'-й выбор</option>'+opts.map(t=>'<option value="'+t+'" '+(r.choices[k]===t?"selected":"")+'>'+t+'</option>').join("")+'</select>').join("")+'</div>';
  }).join("")+'</div>':"";
  return '<section class="pv-calc"><div class="preschool-results-head"><h3>Обработка результатов группы</h3><span class="preschool-status '+(v.ready?"complete":"pending")+'" id="pvStatus">'+(v.ready?"Данные заполнены":"Требуется заполнение")+'</span></div>'+
   '<p>Используйте только условные коды У01, У02 и далее, без имен, фамилий или других идентификаторов. Ответы остаются в открытой вкладке и не отправляются на сервер.</p>'+
   '<div class="pv-secret-setup"><label>Число детей в группе (4-40) <input type="number" id="pvGroupSize" min="4" max="40" step="1" value="'+(s.size||"")+'" placeholder="Например, 8"></label><button class="btn" type="button" id="pvSetGroup">Сформировать протокол</button></div>'+
   (s.size?'<p>Для каждого кода запишите три разных выбора. При отказе укажите это явно; не заменяйте отсутствие данных нулем.</p>'+rows:"")+
   '<label class="preschool-note-label">Общие замечания по процедуре (без имен)<textarea id="pvNote" rows="3">'+esc(s.note)+'</textarea></label>'+
   '<div class="preschool-summary" id="pvSummary">'+secretResults(d)+'</div><div class="preschool-result-actions"><button class="btn" type="button" data-pv-reset>Очистить</button><button class="btn primary" data-psy-verified-print="result" '+(!v.ready?"disabled":"")+'>Печать результатов</button></div></section>';
 }
 const calculator=d=>isMit(d)?mitCalc(d):secretCalc(d);
 const ready=d=>isMit(d)?mitReady(d):secretValidation(d).ready;
 function updateFooter(d){
  const node=$("#preschoolFooterStatus");if(!node)return;
  const ok=ready(d);node.className="psy-preschool-footer-state "+(ok?"complete":"pending");node.textContent=ok?"Данные заполнены":"Требуется заполнение";
 }
 function bind(d){
  const body=$("#modalBody");if(!body)return;
  const rerender=()=>{body.innerHTML=calculator(d);bind(d);updateFooter(d)};
  const update=()=>{const ok=ready(d),badge=body.querySelector("#pvStatus"),result=body.querySelector("#pvSummary"),report=body.querySelector('[data-psy-verified-print="result"]');if(badge){badge.className="preschool-status "+(ok?"complete":"pending");badge.textContent=ok?"Данные заполнены":"Требуется заполнение"}if(result)result.innerHTML=isMit(d)?mitSummary(d):secretResults(d);if(report)report.disabled=!ok;updateFooter(d)};
  body.querySelectorAll("[data-psy-verified-print]").forEach(b=>b.addEventListener("click",()=>print(d,b.dataset.psyVerifiedPrint)));
  body.querySelector("[data-pv-reset]")?.addEventListener("click",()=>{if(!confirm("Удалить введенные наблюдения и результаты этой методики?"))return;state.delete(d.preschoolId);rerender()});
  body.querySelector("#pvNote")?.addEventListener("input",e=>{get(d).note=e.target.value});
  if(isMit(d)){
   body.querySelectorAll("[data-pv-mit]").forEach(b=>b.addEventListener("change",()=>{get(d)[b.dataset.pvMit]=b.value;update()}));return;
  }
  body.querySelector("#pvSetGroup")?.addEventListener("click",()=>{
   const n=Number(body.querySelector("#pvGroupSize")?.value);
   if(!Number.isInteger(n)||n<4||n>40){alert("Укажите целое число участников от 4 до 40.");return;}
   const s=get(d);
   if(s.size!==n&&s.rows.some(r=>r.status||r.choices.some(Boolean))&&!confirm("Изменение численности сбросит сделанные выборы. Продолжить?"))return;
   if(s.size===n&&s.rows.length===n){rerender();return;}
   s.size=n;s.rows=Array.from({length:n},()=>({status:"",choices:["","",""]}));rerender();
  });
  body.querySelectorAll("[data-pv-secret-status]").forEach(el=>el.addEventListener("change",()=>{
   const r=get(d).rows[Number(el.dataset.pvSecretStatus)];r.status=el.value;
   if(el.value!=="done")r.choices=["","",""];
   rerender();
  }));
  body.querySelectorAll("[data-pv-secret-choice]").forEach(el=>el.addEventListener("change",()=>{
   const [i,k]=el.dataset.pvSecretChoice.split("-").map(Number);get(d).rows[i].choices[k]=el.value;update();
  }));
 }
 function printBlankSecret(){return '<section class="pv-sheet"><h2>Протокол специалиста «Секрет»</h2><p>Дата _______ Группа _______ Код участника _______</p><table><thead><tr><th>Очередность</th><th>Код выбранного ребенка</th><th>Причина выбора</th></tr></thead><tbody>'+[1,2,3].map(x=>'<tr><td>'+x+'</td><td>_________________</td><td>________________________________</td></tr>').join("")+'</tbody></table><p>Ожидание ответного подарка / слова ребенка: _____________________________________</p><p>Особенности проведения и дополнительные наблюдения: ____________________________</p><p>Заполняет специалист. Не предъявлять результаты детям и родителям других детей.</p></section>'}
 function print(d,mode){
  if(mode==="result"&&!ready(d))return;
  const m=lookup(d);
  const guide='<section class="pv-sheet"><h2>'+esc(m.title)+'</h2><p>Автор: '+esc(m.author)+'. Возраст: '+esc(m.age)+' лет.</p>'+(isMit(d)?mittenGuide():secretGuide())+'</section>';
  const blank=isMit(d)?printMitten(false)+printMitten(true)+ '<section class="pv-sheet"><h2>Протокол специалиста</h2><p>Дата _______ Коды пары ____________</p>'+mittensIndicators.map(x=>'<p>'+esc(x)+': __________________________________________</p>').join("")+'<p>Заключение специалиста: __________________________________________</p></section>':printBlankSecret();
  const printResult='<section class="pv-sheet"><h2>Результат методики «'+esc(m.title)+'»</h2>'+(isMit(d)?mitSummary(d):secretResults(d))+'<p>Контекст: '+esc(get(d).note||"не указан")+'</p><p>Внутренняя документация специалиста. Конфиденциально.</p></section>';
  const body=mode==="guide"?guide:mode==="combined"?guide+blank:mode==="blank"?blank:printResult;
  const css='@page{size:A4 portrait;margin:16mm}*{box-sizing:border-box}body{color:#111;background:#fff;font:11pt/1.4 Arial,sans-serif}h2{font-size:16pt}h3{font-size:12pt;margin:14px 0 6px}p,li{margin:6px 0}ol,ul{padding-left:22px}table{border-collapse:collapse;width:100%;table-layout:fixed}td,th{border:1px solid #555;padding:9px 6px;font-size:10pt;overflow-wrap:anywhere}th:first-child{width:30%}.pv-sheet:not(:first-child){break-before:page;page-break-before:always}.pv-mitten-sheet{min-height:225mm;text-align:center;display:flex;flex-direction:column;justify-content:flex-start}.pv-mitten-sheet svg{display:block;margin:25mm auto 0;max-width:125mm;height:135mm}.pv-child-note{font-size:12pt;max-width:140mm;margin:0 auto}blockquote{border-left:2px solid #888;margin:12px 0;padding:8px 15px}tr{break-inside:avoid}';
  const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>'+esc(m.title)+'</title><style>'+css+'</style></head><body>'+body+'</body></html>';
  const frame=document.createElement("iframe");frame.title="Печать "+m.title;frame.style.cssText="position:fixed;left:-9999px;width:1px;height:1px;border:0";document.body.appendChild(frame);
  frame.onload=()=>{try{frame.contentWindow.focus();frame.contentWindow.print()}finally{setTimeout(()=>frame.remove(),2000)}};
  frame.srcdoc=html;
 }
 window.PSY_PRESCHOOL_VERIFIED={catalog,profile,instruction,materials,calculator,bind,updateFooter,print,
  // Pure helpers for deterministic functional checks.
  validateSecretRows:(rows)=>{const codes=codesFor(rows.length);return rows.every((r,i)=>completeRow(r,codes[i],codes));},
  secretTally:(rows)=>{const codes=codesFor(rows.length),v=Object.fromEntries(codes.map(c=>[c,0]));rows.forEach((r,i)=>{if(completeRow(r,codes[i],codes)&&r.status==="done")r.choices.forEach(c=>v[c]++)});return v;}
 };
})();