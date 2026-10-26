"use strict";
(function(){
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const source="https://iris.peabody.vanderbilt.edu/case-study/measuring-behavior/";
 const source2="https://iris.peabody.vanderbilt.edu/activity/behavior-assessment-frequency-and-interval-recording/";
 const source3="https://iris.peabody.vanderbilt.edu/mcontent/cs_parent/measuring-behavior/";
 const commonAge="3-17 лет и взрослые от 18 лет – рабочее наблюдение без возрастных нормативов";
 const commonAges=["Дошкольники","Школьники","Взрослые"];
 const methods=[
  {id:"special-frequency-01",title:"Частотная регистрация событий (event recording)",group:"Мониторинг",topic:"Динамика поведения",
   author:"Систематическое прямое наблюдение; методическое описание IRIS Center, Vanderbilt University",
   ageLabel:commonAge,ages:commonAges,format:"Количественное наблюдение",count:"Одна целевая реакция, 1-8 периодов",
   goal:"Описать число четко определенных наблюдаемых событий и рассчитать частоту за сопоставимую единицу времени.",
   indicators:["Операциональное описание одного события","Количество событий в каждом периоде","Длительность действительного наблюдения","Суммарное число событий и частота за минуту"],
   limitation:"Подходит только для достаточно различимых кратких событий с ясным началом и окончанием. Не подменяет анализ длительности, состояния или причины поведения; нулевая частота не означает отсутствие проблемы. Сравнение сессий требует учета контекста и доступности ситуации. Возрастных нормативов и диагностических порогов нет.",
   guide:[
    "Опишите целевое действие так, чтобы два независимых наблюдателя могли отличить его начало и окончание.",
    "Укажите наблюдаемую ситуацию и длительность каждого периода; не создавайте нагрузку специально ради регистрации.",
    "За каждое отдельное событие сделайте отметку на листе специалиста. Если наблюдение прерывалось, не включайте время, когда событие нельзя было видеть.",
    "После наблюдения запишите целое число событий и фактическую длительность в минутах для каждого периода. Ноль допустим лишь при действительно проведенном наблюдении.",
    "Для каждого периода найдите частоту: число событий / минуты наблюдения. Для общей частоты сложите все события и все минуты, затем разделите суммы. Не усредняйте частоты разных по продолжительности сессий арифметически.",
    "Сопоставляйте периоды только после анализа различий обстановки, видов помощи и возможностей участника."
   ]},
  {id:"special-interval-01",title:"Интервальная регистрация поведения (partial / whole interval)",group:"Мониторинг",topic:"Интервальное наблюдение",
   author:"Систематическое прямое наблюдение; методическое описание IRIS Center, Vanderbilt University",
   ageLabel:commonAge,ages:commonAges,format:"Интервальное наблюдение",count:"Одна реакция, интервалы одинаковой длительности",
   goal:"Определить долю интервалов с заранее определенным наблюдаемым действием при регистрации целого или частичного интервала.",
   indicators:["Определение целевой реакции","Режим partial-interval или whole-interval","Длина и число равных интервалов","Число интервалов с действием и их процент"],
   limitation:"Partial-interval фиксирует хотя бы один момент действия и может завышать оценку длительности. Whole-interval требует присутствия действия на протяжении всего интервала и может занижать ее. Процент интервалов не равен точной доле времени поведения и не является частотой событий. Режим, размер интервала и условия должны быть сохранены при сравнении.",
   guide:[
    "Опишите конкретное наблюдаемое действие, исключив оценочные характеристики личности.",
    "Заранее выберите только один режим на сеанс: partial-interval – действие наблюдалось в любой момент интервала; whole-interval – действие продолжалось весь интервал.",
    "Определите одинаковую продолжительность интервалов и обеспечьте отдельный внешний сигнал времени. Встроенного автоматического таймера эта форма не содержит.",
    "В каждом интервале сделайте отметку «Да» или «Нет» по правилам выбранного режима. Если нет надежного наблюдения, оставьте его пустым и проведите наблюдение повторно.",
    "Подсчитайте число интервалов с «Да», разделите на общее число заполненных запланированных интервалов и умножьте на 100. Завершенным считается только протокол без пропусков.",
    "При сопоставлении наблюдений всегда проверяйте совпадение режима, длительности интервалов, ситуации и доступной поддержки. Не трактуйте процент как процент времени или вероятность диагноза."
   ]}
 ];
 const lookup=new Map(methods.map(m=>[m.id,m]));
 const states=new Map();
 function state(d){
  if(!states.has(d.toolkitId))states.set(d.toolkitId,d.toolkitId==="special-frequency-01"?
   {target:"",context:"",sessions:[{duration:"",count:""}]}:
   {target:"",context:"",mode:"partial",seconds:"",intervals:Array(10).fill("")});
  return states.get(d.toolkitId);
 }
 function decimal(v){if(!/^\d+(?:[.,]\d+)?$/.test(String(v).trim()))return NaN;return Number(String(v).replace(",","."));}
 function validCount(v){const n=decimal(v);return String(v).trim()!==""&&Number.isSafeInteger(n)&&n>=0&&n<=100000;}
 function validDuration(v){const n=decimal(v);return Number.isFinite(n)&&n>0&&n<=720;}
 function validSeconds(v){const n=decimal(v);return Number.isSafeInteger(n)&&n>=1&&n<=3600;}
 function isFrequency(d){return d.toolkitId==="special-frequency-01";}
 function frequencyData(s){
  const rows=s.sessions.filter(v=>String(v.duration).trim()!==""||String(v.count).trim()!=="");
  const valid=!!s.target.trim()&&rows.length>0&&rows.every(v=>validDuration(v.duration)&&validCount(v.count));
  if(!valid)return {valid:false};
  const totalCount=rows.reduce((a,v)=>a+decimal(v.count),0),totalMinutes=rows.reduce((a,v)=>a+decimal(v.duration),0);
  return {valid:true,rows,totalCount,totalMinutes,perMinute:totalCount/totalMinutes};
 }
 function intervalData(s){
  const valid=!!s.target.trim()&&validSeconds(s.seconds)&&["partial","whole"].includes(s.mode)&&s.intervals.length>=5&&s.intervals.every(v=>v==="yes"||v==="no");
  if(!valid)return {valid:false};
  const yes=s.intervals.filter(v=>v==="yes").length;
  return {valid:true,yes,total:s.intervals.length,percentage:100*yes/s.intervals.length};
 }
 function result(d){const s=state(d);return isFrequency(d)?frequencyData(s):intervalData(s);}
 function complete(d){return result(d).valid;}
 function num(n){return new Intl.NumberFormat("ru-RU",{maximumFractionDigits:2}).format(n);}
 function portfolio(d){
  const m=lookup.get(d.toolkitId),props=[["Название",m.title],["Источник методики",m.author],["Возраст",m.ageLabel],["Тип",m.format],["Объем",m.count]];
  return '<section class="psy-portfolio-reference psy-portfolio-unified"><h3>Общие сведения</h3><div class="psy-profile-lines">'+props.map(([a,b])=>'<div class="psy-profile-row"><strong>'+esc(a)+'</strong><span>'+esc(b)+'</span></div>').join("")+'</div>'+
   '<h3>Цель</h3><p class="psy-profile-description">'+esc(m.goal)+'</p>'+
   '<h3>Исследуемые показатели</h3><div class="psy-profile-indicators">'+m.indicators.map(v=>'<div class="psy-profile-indicator"><span>'+esc(v)+'</span></div>').join("")+'</div>'+
   '<h3>Методические источники</h3><p><a href="'+source+'" target="_blank" rel="noopener noreferrer">IRIS Center – Measuring Behavior</a></p><p><a href="'+source2+'" target="_blank" rel="noopener noreferrer">IRIS Center – Frequency and Interval Recording</a></p>'+
   '<h3>Интерпретация и ограничения</h3><p class="psy-profile-description">'+esc(m.limitation)+'</p><p>Это процедура систематического наблюдения, не стандартизированный психологический тест с возрастными нормами.</p></section>';
 }
 function guideContent(m){
  const f=m.id==="special-frequency-01";
  return '<section class="psy-special-guide"><h3>Назначение и авторство</h3><p>'+esc(m.goal)+'</p><p>'+esc(m.author)+'</p>'+
   '<h3>Возраст и условия</h3><p>'+esc(m.ageLabel)+'. Наблюдение организует подготовленный специалист. Применяйте доступный и безопасный способ коммуникации.</p>'+
   '<h3>Материалы</h3><p>Бланк специалиста, часы или таймер для регистрации времени, средство для отметок, описание целевого действия. Отдельного стимульного комплекта для предъявления участнику нет.</p>'+
   '<h3>Инструкция участнику</h3><p>Обязательной дословной тестовой инструкции не предусмотрено: это наблюдение за естественной деятельностью. При необходимости нейтрально объясните участнику цель встречи и право обратиться за помощью или паузой.</p>'+
   '<h3>Порядок работы</h3><ol>'+m.guide.map(a=>'<li>'+esc(a)+'</li>').join("")+'</ol>'+
   '<h3>Ключ и обработка</h3><p>'+(f?
    'Отдельный период: частота = число событий / фактические минуты наблюдения. Общая частота = сумма числа событий / сумма фактических минут. Пример: 6 событий за 12 минут дают 0,5 события в минуту. Ноль событий при заполненном времени – допустимый результат.':
    '«Да» – выполнение критерия выбранного режима, «Нет» – невыполнение. Доля интервалов с действием = число «Да» / число интервалов × 100%. Пример: 3 из 10 интервалов = 30%. Это не эквивалентно точной продолжительности действия.')+'</p>'+
   '<h3>Интерпретация</h3><p>'+esc(m.limitation)+'</p>'+
   '<h3>Источники</h3><p><a href="'+source+'" target="_blank" rel="noopener noreferrer">IRIS Center, Vanderbilt University</a> · <a href="'+source3+'" target="_blank" rel="noopener noreferrer">Measuring Behavior – практические примеры</a></p></section>';
 }
 function instruction(d){
  const m=lookup.get(d.toolkitId);
  return '<div class="psy-common-guide-head"><h3>Методика / руководство</h3><div class="psy-common-guide-actions"><button type="button" class="btn" data-measure-print="guide">Без бланка</button><button type="button" class="btn primary" data-measure-print="combined">С бланком</button></div></div>'+guideContent(m);
 }
 function form(d,withValues){
  const f=isFrequency(d),s=state(d),res=withValues?result(d):null;
  const meta='<h3>Протокол специалиста</h3><p><b>Метод:</b> '+esc(lookup.get(d.toolkitId).title)+'</p>'+
   '<p><b>Определение действия:</b> '+(withValues?esc(s.target):"____________________________________________________________")+'</p>'+
   '<p><b>Ситуация / условия:</b> '+(withValues?esc(s.context):"____________________________________________________________")+'</p>';
  if(f){
   const rows=withValues?res.rows:Array.from({length:5},()=>({duration:"",count:""}));
   return meta+'<table class="special-toolkit-table special-measure-table"><thead><tr><th>Период</th><th>Продолжительность, мин</th><th>Число событий</th><th>Частота в минуту</th></tr></thead><tbody>'+
    rows.map((r,i)=>'<tr><td>'+(i+1)+'</td><td>'+(withValues?esc(r.duration):"________________")+'</td><td>'+(withValues?esc(r.count):"________________")+'</td><td>'+(withValues?num(decimal(r.count)/decimal(r.duration)):"________________")+'</td></tr>').join("")+'</tbody></table>'+
    '<p><b>Итого:</b> '+(withValues?esc(String(res.totalCount))+" событий / "+num(res.totalMinutes)+" мин":"____________________________")+'</p>'+
    '<p><b>Частота:</b> '+(withValues?num(res.perMinute)+" события в минуту":"_______________________")+'</p>';
  }
  const entries=withValues?s.intervals:Array(10).fill("");
  return meta+'<p><b>Режим:</b> '+(withValues?(s.mode==="partial"?"Partial-interval":"Whole-interval"):"Partial / Whole (выбрать)")+'</p>'+
   '<p><b>Продолжительность интервала:</b> '+(withValues?esc(s.seconds):"____________")+' секунд</p>'+
   '<table class="special-toolkit-table special-measure-table"><thead><tr><th>Интервал</th><th>Отметка («Да» / «Нет»)</th><th>Интервал</th><th>Отметка</th></tr></thead><tbody>'+
   Array.from({length:Math.ceil(entries.length/2)},(_,i)=>{
    const j=i+Math.ceil(entries.length/2);
    const val=n=>n<entries.length?'<td>'+(n+1)+'</td><td>'+(withValues?(entries[n]==="yes"?"Да":"Нет"):"________________")+'</td>':'<td></td><td></td>';
    return '<tr>'+val(i)+val(j)+'</tr>';
   }).join("")+'</tbody></table>'+
   '<p><b>Интервалы с действием:</b> '+(withValues?res.yes+" из "+res.total:"_______________")+'</p>'+
   '<p><b>Доля:</b> '+(withValues?num(res.percentage)+"%":"_______________")+'</p>';
 }
 function materials(d){return '<div class="psy-common-guide-head"><h3>Протокол специалиста</h3><div class="psy-common-guide-actions"><button type="button" class="btn primary" data-measure-print="blank">Посмотреть и распечатать</button></div></div><div class="special-toolkit-blank">'+form(d,false)+'</div><p class="privacy-inline">Рабочий протокол заполняет специалист. Не вводите ФИО и другие персональные данные на публичном сайте.</p>';}
 function outcome(d){
  const r=result(d),m=lookup.get(d.toolkitId);
  if(!r.valid)return '<p>Заполните определение наблюдаемого действия и все обязательные поля каждого периода. Пустое поле нельзя считать нулем или отметкой «Нет».</p>';
  if(isFrequency(d))return '<h3>Результат регистрации</h3><p><b>Всего событий:</b> '+r.totalCount+'.</p><p><b>Время наблюдения:</b> '+num(r.totalMinutes)+' мин.</p><p><b>Средняя частота:</b> '+num(r.perMinute)+' события в минуту.</p>'+
   '<p>Частота отражает наблюдаемый счет в конкретных условиях, без нормативной оценки и диагноза.</p>';
  return '<h3>Результат интервального наблюдения</h3><p><b>Режим:</b> '+(state(d).mode==="partial"?"Partial-interval":"Whole-interval")+'.</p><p><b>Отмечено «Да»:</b> '+r.yes+' из '+r.total+' интервалов.</p><p><b>Доля интервалов:</b> '+num(r.percentage)+'%.</p>'+
   '<p>Процент интервалов не равен точной доле времени поведения. '+esc(m.limitation)+'</p>';
 }
 function calculator(d){
  const s=state(d),f=isFrequency(d),done=complete(d);
  const header='<section class="special-toolkit-calc"><div class="special-result-head"><div><h3>Обработка результатов</h3><p>'+(f?'Число событий и частота за минуту':'Доля интервалов с действием')+'</p></div><span class="special-status '+(done?'complete':'pending')+'">'+(done?'Данные заполнены':'Требуется заполнение')+'</span></div>';
  const common='<div class="special-toolkit-fields"><label>Операциональное определение наблюдаемого действия<textarea rows="2" data-measure-field="target" placeholder="Что именно фиксируем, с ясным началом и окончанием">'+esc(s.target)+'</textarea></label>'+
   '<label>Условия наблюдения, без персональных данных<textarea rows="2" data-measure-field="context" placeholder="Коротко опишите ситуацию">'+esc(s.context)+'</textarea></label></div>';
  const freq='<div class="special-measure-sessions">'+(f?s.sessions.map((row,i)=>'<fieldset class="special-toolkit-event"><legend>Период '+(i+1)+'</legend>'+
   '<div class="special-measure-line"><label>Время наблюдения, мин<input type="text" inputmode="decimal" data-measure-session="'+i+'" data-measure-part="duration" placeholder="Например, 15" value="'+esc(row.duration)+'"></label>'+
   '<label>Число событий<input type="number" min="0" max="100000" step="1" data-measure-session="'+i+'" data-measure-part="count" placeholder="0 тоже результат" value="'+esc(row.count)+'"></label></div>'+
   (s.sessions.length>1?'<button type="button" class="btn" data-measure-delete="'+i+'">Удалить период</button>':'')+'</fieldset>').join(""):'')+'</div>'+
   '<div class="special-toolkit-event-actions"><button class="btn" type="button" id="measureAddSession" '+(!f||s.sessions.length>=8?'disabled':'')+'>Добавить период</button></div>';
  const interval='<div class="special-toolkit-fields">'+(!f?'<label>Режим регистрации<select data-measure-field="mode"><option value="partial" '+(s.mode==="partial"?'selected':'')+'>Partial – действие хотя бы часть интервала</option><option value="whole" '+(s.mode==="whole"?'selected':'')+'>Whole – действие весь интервал</option></select></label>'+
   '<label>Длина одного интервала, секунд<input type="number" step="1" min="1" max="3600" data-measure-field="seconds" placeholder="Укажите секунды" value="'+esc(s.seconds)+'"></label></div>'+
   '<div class="special-measure-interval-list">'+s.intervals.map((v,i)=>'<label class="special-measure-interval"><span>Интервал '+(i+1)+'</span><select data-measure-interval="'+i+'" aria-label="Интервал '+(i+1)+'"><option value="">Нет отметки</option><option value="yes" '+(v==="yes"?'selected':'')+'>Да</option><option value="no" '+(v==="no"?'selected':'')+'>Нет</option></select></label>').join("")+'</div>'+
   '<div class="special-toolkit-event-actions"><button type="button" class="btn" id="measureLess" '+(s.intervals.length<=5?'disabled':'')+'>Убрать 5 интервалов</button><button type="button" class="btn" id="measureMore" '+(s.intervals.length>=30?'disabled':'')+'>Добавить 5 интервалов</button></div>':'');
  return header+common+(f?freq:interval)+'<div class="special-summary" id="measureSummary">'+outcome(d)+'</div>'+
   '<div class="special-result-actions"><button type="button" class="btn" id="measureClear">Очистить данные</button><button type="button" class="btn primary" id="measureReport" '+(done?'':'disabled')+'>Печать результата</button></div></section>';
 }
 function updateFooter(d){
  const b=document.getElementById("specialFooterStatus");if(!b)return;const ok=complete(d);b.className="psy-special-footer-state "+(ok?"complete":"pending");b.textContent=ok?"Данные заполнены":"Требуется заполнение";
 }
 function bind(d){
  const body=document.getElementById("modalBody");if(!body)return;
  const s=state(d),f=isFrequency(d);
  const refresh=()=>{const done=complete(d),flag=body.querySelector(".special-status");if(flag){flag.className="special-status "+(done?"complete":"pending");flag.textContent=done?"Данные заполнены":"Требуется заполнение";}
   const out=body.querySelector("#measureSummary");if(out)out.innerHTML=outcome(d);
   const print=body.querySelector("#measureReport");if(print)print.disabled=!done;updateFooter(d);};
  const rerender=()=>{body.innerHTML=calculator(d);bind(d);};
  body.querySelectorAll("[data-measure-field]").forEach(x=>x.addEventListener("input",()=>{s[x.dataset.measureField]=x.value;refresh();}));
  body.querySelectorAll("[data-measure-session]").forEach(x=>x.addEventListener("input",()=>{s.sessions[Number(x.dataset.measureSession)][x.dataset.measurePart]=x.value;refresh();}));
  body.querySelectorAll("[data-measure-interval]").forEach(x=>x.addEventListener("change",()=>{s.intervals[Number(x.dataset.measureInterval)]=x.value;refresh();}));
  body.querySelector("#measureAddSession")?.addEventListener("click",()=>{if(s.sessions.length>=8)return;s.sessions.push({duration:"",count:""});rerender();});
  body.querySelectorAll("[data-measure-delete]").forEach(x=>x.addEventListener("click",()=>{if(s.sessions.length<=1)return;s.sessions.splice(Number(x.dataset.measureDelete),1);rerender();}));
  body.querySelector("#measureMore")?.addEventListener("click",()=>{if(s.intervals.length>25)return;s.intervals.push(...Array(5).fill(""));rerender();});
  body.querySelector("#measureLess")?.addEventListener("click",()=>{if(s.intervals.length<=5)return;if(s.intervals.slice(-5).some(x=>x!=="")&&!window.confirm("Удалить последние 5 заполненных отметок?"))return;s.intervals.splice(-5,5);rerender();});
  body.querySelector("#measureClear")?.addEventListener("click",()=>{if(!window.confirm("Очистить все данные этой методики?"))return;states.delete(d.toolkitId);rerender();});
  body.querySelector("#measureReport")?.addEventListener("click",()=>print(d,"result"));
  body.querySelectorAll("[data-measure-print]").forEach(x=>x.addEventListener("click",()=>print(d,x.dataset.measurePrint)));
 }
 function print(d,mode){
  if(mode==="result"&&!complete(d))return;
  const m=lookup.get(d.toolkitId);
  const guide='<section><h2>'+esc(m.title)+'</h2>'+guideContent(m)+'</section>';
  const blank='<section class="print-blank">'+form(d,mode==="result")+'</section>';
  const report=mode==="result"?'<section>'+outcome(d)+'</section>':"";
  const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>'+esc(m.title)+'</title><style>'+
   '@page{size:A4 portrait;margin:16mm}*{box-sizing:border-box}body{font:10.5pt/1.42 Arial,sans-serif;color:#222}h2{font-size:16pt}h3{font-size:11.5pt;break-after:avoid}p,li{overflow-wrap:anywhere}li{margin:5px 0}table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:9pt}th,td{border:1px solid #777;padding:8px;vertical-align:top;overflow-wrap:anywhere}tr{break-inside:avoid}.print-blank:not(:first-child){break-before:page}button{display:none}</style></head><body>'+
   (mode==="guide"||mode==="combined"?guide:"")+(mode==="guide"?"":blank)+report+'</body></html>';
  const frame=document.createElement("iframe");frame.title="Печать метода наблюдения";frame.style.cssText="position:fixed;width:0;height:0;border:0";document.body.appendChild(frame);
  frame.onload=()=>{try{frame.contentWindow.focus();frame.contentWindow.print();}finally{setTimeout(()=>frame.remove(),1800);}};
  frame.srcdoc=html;
 }
 for(const m of methods)window.PSY_FULL_METHODS[m.title]={
  workflow:"specialToolkit",toolkitId:m.id,author:m.author,age:m.ageLabel,kind:m.format,count:m.count,
  goal:m.goal,indicatorsTitle:"Показатели наблюдения",indicators:m.indicators,calculator:true,interpret:m.limitation,
  scoring:m.id==="special-frequency-01"?"Количество событий / время наблюдения (в минутах)":
   "Число интервалов с действием / общее число интервалов × 100% (без нормативов).",source
 };
 const api={methods,portfolio,instruction,materials,calculator,updateFooter,bind,print,complete};
 const shared=window.PSY_SPECIAL_TOOLKIT;
 if(!shared)throw Error("Основной модуль ОВЗ не подключен");
 for(const method of ["portfolio","instruction","materials","calculator","updateFooter","bind","print","complete"]){
  const previous=shared[method];
  shared[method]=function(d,...args){return lookup.has(d?.toolkitId)?api[method](d,...args):previous(d,...args);};
 }
 shared.methods.push(...methods);
 window.PSY_SPECIAL_MEASURE=api;
})();