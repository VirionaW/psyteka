"use strict";
/* Existing diagnostic cards: Rosenberg RSES and Vanderbilt initial NICHQ 2002. */
(function(){
 const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const isR=d=>d?.diagnosticType==="rses";
 const vOf=(d,r)=>d.variants.find(v=>v.id===(r?.variant||"parent"))||d.variants[0];
 const validN=(v,max,min=0)=>v!==""&&v!==null&&v!==undefined&&/^\d$/.test(String(v))&&Number(v)>=min&&Number(v)<=max;
 function required(d,r){
  const v=isR(d)?null:vOf(d,r);
  return isR(d)?{count:10,performanceStart:null,variant:null}:{count:v.count,performanceStart:v.performanceStart,variant:v};
 }
 function completion(d,r){
  const cfg=required(d,r),a=r?.answers||[];
  return Array.from({length:cfg.count},(_,i)=>
   validN(a[i],isR(d)?3:(i+1>=cfg.performanceStart?5:3),isR(d)?0:(i+1>=cfg.performanceStart?1:0))
   ).filter(Boolean).length;
 }
 function score(d,r){
  const a=r?.answers||[],cfg=required(d,r);
  if(completion(d,r)!==cfg.count)return null;
  if(isR(d)){
   const reversed=new Set([2,4,7,8,9]),parts=Array.from({length:10},(_,i)=>
    reversed.has(i)?3-Number(a[i]):Number(a[i]));
   const raw=parts.reduce((x,y)=>x+y,0);
   return {type:"rses",raw,max:30,parts,summary:"Сумма отражает положение на континууме общей самооценки (0–30). Универсальные границы «высокой» и «низкой» самооценки не установлены; интерпретация требует контекста и возрастных норм выбранной адаптации."};
  }
  const v=cfg.variant,p=v.performanceStart-1, symptomScore=a.slice(0,18).reduce((x,y)=>x+Number(y),0);
  const perf=a.slice(p,v.count).map(Number),perfPositive=perf.filter(x=>x>=4).length, avg=perf.reduce((x,y)=>x+y,0)/perf.length;
  const groups=v.groups.map(g=>{
   const responses=a.slice(g.start-1,g.end),positive=responses.filter(x=>Number(x)>=2).length;
   return {...g,positive,total:responses.length,metSymptoms:positive>=g.cutoff,screenPositive:positive>=g.cutoff&&perfPositive>0};
  });
  return {type:"vanderbilt",variant:v.id,variantName:v.name,max:v.count,raw:symptomScore,
   symptomTotal:symptomScore,groups,perfPositive,averagePerformance:avg,impairment:perfPositive>0,
   summary:"Расчёт по скрининговой схеме первого издания NICHQ (2002). Совпадение с порогом НЕ означает диагноз. Для диагностики СДВГ нужны информация из нескольких условий, клиническая оценка и анализ функциональных нарушений."};
 }
 function codeControls(ctx){
  return '<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ребёнок</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Класс / группа</button></div>'+
  (ctx.calcMode==="class"?'<div class="group-tools"><label>Участник<select id="participantSelect">'+ctx.rows.map((r,i)=>'<option value="'+i+'" '+(ctx.rowIndex===i?'selected':'')+'>'+(i+1)+'. '+E(r.name||"Участник "+(i+1))+'</option>').join('')+'</select></label><label>Код участника<input id="participantName" value="'+E(ctx.rows[ctx.rowIndex].name||"")+'" placeholder="Например, №12"></label><button class="btn" id="addParticipant">Добавить</button></div>':
   '<div class="diag03-code"><label>Код участника (без ФИО)<input id="diag03Code" placeholder="Например, №12" value="'+E(ctx.rows[ctx.rowIndex].name||"")+'"></label></div>');
 }
 function intro(d){
  const extra=isR(d)?'<p>Русская рабочая версия. Возрастные нормы и отсечки без отдельной валидизации не применяются.</p>':
  '<p>Обрабатываются исключительно <b>первичные</b> формы для родителей и учителя из первого издания 2002 года. Последующие издания и формы follow-up имеют иные структуры.</p>';
  return '<div class="diagnostic-intro"><p><b>Процедура:</b> '+E(d.scope)+'</p>'+extra+
   '<a class="btn primary" href="'+E(d.officialBlank)+'" target="_blank" rel="noopener noreferrer">'+(isR(d)?"Первоисточник шкалы ↗":"Официальный PDF NICHQ ↗")+'</a>'+
   '<p class="privacy-inline">Ввод результатов производится локально в браузере. Сайт не отправляет ответы на сервер. Для сохранения отчёта используйте скачивание; после закрытия вкладки данные могут потеряться.</p></div>';
 }
 function instructions(d){
  return isR(d)?
    '<h3>Порядок проведения</h3><ol><li>Выдайте ребёнку бланк 10 утверждений или прочитайте их в рамках допустимой процедуры.</li><li>Предложите отметить степень согласия по четырём вариантам ответа.</li><li>Перенесите все 10 ответов в обработку: 0 — «совсем не согласен», 3 — «полностью согласен».</li><li>Автоматический подсчёт изменяет знак пяти отрицательных утверждений (3, 5, 8, 9, 10).</li><li>Обсудите результат как описательный показатель, без самодельных уровней.</li></ol><p class="notice">Русский перевод — рабочая версия, а не подтверждённая стандартизация.</p>':
    '<h3>Порядок проведения</h3><ol><li>Скачайте оригинальный 10-страничный PDF NICHQ и распечатайте страницы 1–2 для родителей или 3–4 для учителя.</li><li>Родитель оценивает поведение за 6 месяцев, учитель — с начала учебного года; укажите длительность наблюдения.</li><li>Для пунктов симптомов используйте 0–3, а для раздела функционирования 1–5. Шкалы не взаимозаменяемы.</li><li>Выберите ту форму, с которой реально перенесли ответы. Не объединяйте ответы родителей и учителя в один бланк.</li><li>Подсчёт показывает скрининговые признаки, не медицинский диагноз; сопоставьте информацию из нескольких источников.</li></ol>';
 }
 function materials(d){
  if(!isR(d))return '<div class="diag-sheet"><h3>Оригинальный бланк Vanderbilt</h3><p>Для достоверного проведения обязательно используйте неизменённую официальную форму NICHQ.</p><p><a href="'+E(d.officialBlank)+'" target="_blank" rel="noopener noreferrer" class="btn primary">Открыть PDF: родитель и учитель ↗</a></p><p>Страницы 1–2 — первая родительская форма (55 пунктов), 3–4 — первая форма учителя (43 пункта). Последующие страницы PDF — формы для наблюдения в динамике, для которых в этой карточке обработка не реализована.</p><p class="diag-attribution">'+E(d.license)+'</p></div>';
  return '<div class="diag-sheet"><h3>Шкала самооценки Розенберга</h3><p>Код участника: ____________ Класс/возраст: ______ Дата: ____________</p><p>'+E(d.instructions)+'</p>'+
   '<p class="diag-options">'+d.options.map((x,i)=>i+' — '+E(x)).join(' · ')+'</p><table class="diag-questions-table"><thead><tr><th>№</th><th>Утверждение</th><th>Ответ</th></tr></thead><tbody>'+
   d.questions.map((x,i)=>'<tr><td>'+(i+1)+'</td><td>'+E(x)+'</td><td>□ 0 &nbsp; □ 1 &nbsp; □ 2 &nbsp; □ 3</td></tr>').join('')+
   '</tbody></table><p class="diag-attribution">М. Розенберг · общественное достояние · рабочий русский перевод (без подтверждённых возрастных нормативов)</p></div>';
 }
 function processing(d){
  const extra=isR(d)?'<p>Ключ: 0–3 для прямых пунктов 1, 2, 4, 6, 7; для 3, 5, 8, 9, 10 — 3 минус выбранный ответ. Итог — сумма 10 оценок.</p>':
   '<p>«Выраженный симптом» — ответ 2 или 3. «Нарушение функционирования» — хотя бы один ответ 4 или 5 в разделе Performance. Правило скрининга требует <b>обоих</b> признаков. Баллы первой и последующих редакций шкал могут отличаться.</p><table class="diag-questions-table"><thead><tr><th>Подшкала</th><th>Родители</th><th>Учитель</th></tr></thead><tbody><tr><td>Невнимательность</td><td>1–9, ≥6</td><td>1–9, ≥6</td></tr><tr><td>Гиперактивность</td><td>10–18, ≥6</td><td>10–18, ≥6</td></tr><tr><td>Оппозиционное поведение</td><td>19–26, ≥4</td><td>19–28, ≥3</td></tr><tr><td>Нарушения поведения</td><td>27–40, ≥3</td><td>Включено в шкалу 19–28</td></tr><tr><td>Тревога/депрессия</td><td>41–47, ≥3</td><td>29–35, ≥3</td></tr><tr><td>Функционирование</td><td>48–55, хотя бы один ≥4</td><td>36–43, хотя бы один ≥4</td></tr></tbody></table>';
  return '<h3>Ключ обработки</h3><p>'+E(d.scoring)+'</p>'+extra+'<h3>Интерпретация и ограничения</h3><p>'+E(d.interpret)+'</p><p><a href="'+E(d.sourceScoring||d.source)+'" target="_blank" rel="noopener noreferrer">Проверить первоисточник обработки ↗</a></p>';
 }
 function outcome(d,r){
  const z=score(d,r),n=completion(d,r),req=required(d,r);
  if(!z)return '<div class="diag03-result"><h3>Результат</h3><p>Перенесено '+n+' из '+req.count+' ответов. Незавершённый бланк не получает балл и заключение. Ответ 0 считается заполненным, пропуск — нет.</p><div class="diag-progress"><span style="width:'+(100*n/req.count)+'%"></span></div></div>';
  if(isR(d))return '<div class="diag03-result"><h3>Результат</h3><strong class="diag03-value">'+z.raw+' / 30</strong><p>'+E(z.summary)+'</p><p class="privacy-inline">Не используйте фиксированные категории «низкий / средний / высокий» без возрастных норм конкретной русскоязычной адаптации.</p></div>';
  const byId=id=>z.groups.find(g=>g.id===id);
  const attention=byId("inattention").screenPositive, hyper=byId("hyperactivity").screenPositive;
  const combined=attention&&hyper;
  return '<div class="diag03-result"><h3>Результат · '+E(z.variantName)+'</h3><p><strong>Сумма 18 основных симптомов: '+z.symptomTotal+' / 54.</strong> Средняя оценка функционирования: '+z.averagePerformance.toFixed(2)+' / 5.</p>'+
   '<p>Показателей затруднений функционирования (4–5): <b>'+z.perfPositive+' / 8</b>.</p>'+
   '<table class="diag-questions-table"><thead><tr><th>Область</th><th>Выраженных ответов</th><th>Порог с учётом функционирования</th></tr></thead><tbody>'+
   z.groups.map(g=>'<tr><td>'+E(g.name)+'</td><td>'+g.positive+' / '+g.total+' (порог '+g.cutoff+')</td><td>'+(g.screenPositive?'Достигнут':'Не достигнут')+'</td></tr>').join('')+
   '</tbody></table>'+
   '<p><b>Одновременное превышение порогов невнимательности и гиперактивности:</b> '+(combined?'Да':'Нет')+'. Это не диагноз СДВГ.</p>'+
   '<p class="privacy-inline">'+E(z.summary)+'</p></div>';
 }
 function opts(min,max,val){
  let o='<option value="">— не заполнено —</option>';
  for(let i=min;i<=max;i++)o+='<option value="'+i+'" '+(String(val)===String(i)?'selected':'')+'>'+i+'</option>';
  return o;
 }
 function answerPanel(d,r){
  if(isR(d))return '<div class="diag03-answer-grid">'+d.questions.map((q,i)=>
   '<label class="diag03-item"><span><b>'+(i+1)+'.</b> '+E(q)+'</span><select data-d3-item="'+i+'" aria-label="Ответ '+(i+1)+'">'+opts(0,3,r.answers?.[i])+'</select></label>').join('')+'</div>';
  const v=vOf(d,r),perf=v.performanceStart;
  const groups=[...v.groups,{name:"Функционирование (другая шкала ответов)",start:perf,end:v.count}];
  return groups.map(group=>'<section class="diag03-section"><h4>'+E(group.name)+' · вопросы '+group.start+'–'+group.end+'</h4>'+
   '<div class="diag03-answer-grid">'+Array.from({length:group.end-group.start+1},(_,j)=>{
    const no=group.start+j,min=no>=perf?1:0,max=no>=perf?5:3;
    return '<label class="diag03-item"><span><b>№ '+no+'</b> '+(no>=perf?'Функционирование (1–5)':'Симптом (0–3)')+'</span><select data-d3-item="'+(no-1)+'" aria-label="Ответ '+no+'">'+opts(min,max,r.answers?.[no-1])+'</select></label>';
   }).join('')+'</div></section>').join('');
 }
 function classTable(d,rows){
  const headers=isR(d)?["Участник","Баллы / 30","Статус"]:["Участник","Форма","Невним. / 9","Гиперакт. / 9","Проблемы функционир.","Совместный скрининг"];
  let body=rows.map((r,i)=>{
   const z=score(d,r),label=E(r.name||"Участник "+(i+1));
   if(isR(d))return '<tr><td>'+label+'</td><td>'+(z?z.raw:'—')+'</td><td>'+(z?'Выполнено':'Не завершено')+'</td></tr>';
   const gr=id=>z?.groups.find(g=>g.id===id);
   return '<tr><td>'+label+'</td><td>'+E(vOf(d,r).id==="parent"?"Родитель":"Учитель")+'</td><td>'+(gr("inattention")?.positive??'—')+'</td><td>'+(gr("hyperactivity")?.positive??'—')+'</td><td>'+(z?.perfPositive??'—')+'</td><td>'+(z?(gr("inattention").screenPositive&&gr("hyperactivity").screenPositive?'Оба порога':'Нет'):'—')+'</td></tr>';
  }).join('');
  return '<table><thead><tr>'+headers.map(x=>'<th>'+E(x)+'</th>').join('')+'</tr></thead><tbody>'+body+'</tbody></table>';
 }
 function calc(d,ctx){
  const r=ctx.rows[ctx.rowIndex],cfg=required(d,r),z=score(d,r);
  const variantSwitch=isR(d)?'':
   '<div class="diag03-variant"><label>Оригинальная форма для обработки<select id="diag03Variant">'+d.variants.map(v=>
    '<option value="'+E(v.id)+'" '+(cfg.variant.id===v.id?'selected':'')+'>'+E(v.name)+'</option>').join('')+'</select></label>'+
    '<p class="privacy-inline">При переключении формы ответы не смешиваются: для родителя и учителя хранятся отдельные наборы до закрытия вкладки.</p></div>';
  return '<div class="diag03-workflow">'+intro(d)+codeControls(ctx)+variantSwitch+
   '<h3>Шаг 1 · Перенесите ответы с бланка</h3><p class="privacy-inline">Заполнено '+completion(d,r)+' из '+cfg.count+'. Чтобы заполнить ноль, выберите «0», а не «—».</p>'+
   answerPanel(d,r)+'<div id="diag03Result">'+outcome(d,r)+'</div>'+
   '<div class="class-actions diag03-actions">'+
   '<button class="btn primary" data-d3-save="html" '+(!z?'disabled':'')+'>Скачать результат</button>'+
   '<button class="btn" data-d3-save="print" '+(!z?'disabled':'')+'>Печать / PDF</button>'+
   '<button class="btn" data-d3-save="csv" '+(!z?'disabled':'')+'>Ответы CSV</button>'+
   '<button class="btn" id="resetParticipant">Очистить ответы</button></div>'+
   (ctx.calcMode==="class"?'<div class="class-actions"><button class="btn primary" id="nextParticipant">Следующий участник</button><button class="btn" id="exportGroup">Скачать группу CSV</button></div><h3>Сводная таблица группы</h3><div class="results-table" id="diag03Group">'+classTable(d,ctx.rows)+'</div>':'')+
   '</div>';
 }
 function csv(d,rows){
  const max=isR(d)?10:55;
  const header=['Код участника','Методика','Форма',...Array.from({length:max},(_,i)=>'Пункт '+(i+1)), 'Завершено','Показатель',
   ...(!isR(d)?['Невнимательность','Гиперактивность','Проблемы функционирования','Средняя оценка функционирования','Скрининговые области']:[])];
  const data=[header,...rows.map((r,i)=>{
   const z=score(d,r),v=isR(d)?null:vOf(d,r);
   const g=id=>z?.groups.find(x=>x.id===id);
   return [r.name||'Участник '+(i+1),isR(d)?'RSES':'Vanderbilt 2002',v?.id||'—',
    ...Array.from({length:max},(_,j)=>j<(v?.count||10)?(r.answers?.[j]??''):''),
    z?'Да':'Нет',z?.raw??'',
    ...(!isR(d)?[g('inattention')?.positive??'',g('hyperactivity')?.positive??'',
      z?.perfPositive??'',z?z.averagePerformance.toFixed(2):'',
      z?z.groups.filter(x=>x.screenPositive).map(x=>x.name).join('; '):'']:[])
   ];
  })];
  const safe=x=>{let s=String(x??'');if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
  return '\uFEFF'+data.map(row=>row.map(safe).join(';')).join('\r\n');
 }
 function reportDoc(d,r){
  const z=score(d,r);if(!z)return null;
  const name=E(r.name||"Участник (без ФИО)"),date=new Date().toLocaleDateString("ru-RU");
  const v=isR(d)?null:vOf(d,r);
  const summary=isR(d)?'<tr><td>Сумма</td><td>'+z.raw+' / 30</td></tr>':
   '<tr><td>Форма</td><td>'+E(v.name)+'</td></tr>'+
   '<tr><td>Сумма 18 основных пунктов</td><td>'+z.symptomTotal+' / 54</td></tr>'+
   '<tr><td>Средняя оценка функционирования</td><td>'+z.averagePerformance.toFixed(2)+' / 5</td></tr>'+
   '<tr><td>Показателей функционирования 4–5</td><td>'+z.perfPositive+' / 8</td></tr>'+
   z.groups.map(x=>'<tr><td>'+E(x.name)+'</td><td>'+x.positive+' / '+x.total+
    ' · порог '+x.cutoff+' · '+(x.screenPositive?'достигнут':'не достигнут')+'</td></tr>').join('');
  const rawRows=(r.answers||[]).slice(0,v?.count||10);
  return '<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Психотека · результат '+E(isR(d)?'RSES':'Vanderbilt')+'</title>'+
   '<style>@page{size:A4;margin:15mm}body{font:14px/1.5 Arial,sans-serif;color:#253b32;max-width:850px;margin:auto;padding:25px}h1{font-size:22px;color:#216546}h2{font-size:17px;margin-top:28px}table{border-collapse:collapse;width:100%;margin:10px 0}th,td{border:1px solid #aecab6;padding:8px;text-align:left}thead{background:#e6f1e9}.note{padding:13px;background:#e6f1e9;border-left:4px solid #267751}tr{break-inside:avoid}@media print{body{padding:0}}</style></head><body>'+
   '<h1>Психотека · Протокол диагностики</h1><p><strong>'+E(isR(d)?'Шкала самооценки Розенберга (RSES)':'NICHQ Vanderbilt Assessment Scales (первичные формы 2002)')+'</strong></p>'+
   '<p>Код участника: '+name+' · Дата формирования: '+E(date)+'</p>'+
   '<h2>Подсчёт</h2><table><thead><tr><th>Показатель</th><th>Результат</th></tr></thead><tbody>'+summary+'</tbody></table>'+
   '<h2>Интерпретация</h2><p class="note">'+E(z.summary)+'</p><p>'+E(d.interpret)+'</p>'+
   '<h2>Ответы участника</h2><table><thead><tr><th>№ пункта</th><th>Ответ</th></tr></thead><tbody>'+
   rawRows.map((x,i)=>'<tr><td>'+(i+1)+'</td><td>'+E(x)+'</td></tr>').join('')+'</tbody></table>'+
   '<h2>Источник и версия</h2><p><a href="'+E(d.source)+'">'+E(d.source)+'</a></p><p>'+E(d.license)+'</p>'+
   '<p><em>Результат не является диагнозом и требует профессиональной интерпретации.</em></p></body></html>';
 }
 function download(source,filename,type){
  const blob=new Blob([source],{type:type||"text/html;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function printHTML(source){
  let f=document.getElementById("psyDiag03Print");if(f)f.remove();
  f=document.createElement("iframe");f.id="psyDiag03Print";f.title="Протокол диагностики";
  f.style="position:fixed;right:0;bottom:0;width:0;height:0;border:0";document.body.appendChild(f);
  f.onload=()=>{try{f.contentWindow.focus();f.contentWindow.print()}catch(e){alert("Печать недоступна в этом браузере.")}};
  f.contentDocument.open();f.contentDocument.write(source);f.contentDocument.close();
 }
 function saveBlank(d){
  if(!isR(d)){window.open(d.officialBlank,"_blank","noopener,noreferrer");return;}
  const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>RSES · бланк</title>'+
   '<style>@page{size:A4;margin:14mm}body{font:14px/1.55 Arial;color:#234036;max-width:790px;margin:auto}h1{font-size:22px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #a6bdaa;padding:9px;text-align:left}tr{break-inside:avoid}.diag-sheet{padding:5px}.diag-attribution{margin-top:20px;font-size:12px}</style></head><body><h1>Психотека · Бланк RSES</h1>'+
   materials(d)+'</body></html>';
  download(html,'Психотека_RSES_бланк.html');
 }
 function bind(d,ctx,redraw){
  const r=ctx.rows[ctx.rowIndex];
  document.querySelectorAll('[data-d3-item]').forEach(el=>el.addEventListener('change',()=>{
   r.answers ||= [];
   r.answers[+el.dataset.d3Item]=el.value;
   const result=document.getElementById('diag03Result');if(result)result.innerHTML=outcome(d,r);
   const enabled=!!score(d,r);
   document.querySelectorAll('[data-d3-save]').forEach(b=>b.disabled=!enabled);
   const summary=document.getElementById("diag03Group");if(summary)summary.innerHTML=classTable(d,ctx.rows);
  }));
  document.getElementById('diag03Code')?.addEventListener('input',e=>{r.name=e.target.value});
  document.getElementById('diag03Variant')?.addEventListener('change',e=>{
   r.answerSets ||= {};
   r.answerSets[r.variant||"parent"]=r.answers||[];
   r.variant=e.target.value;
   r.answers=r.answerSets[r.variant]||[];
   redraw();
  });
  document.querySelectorAll('[data-d3-save]').forEach(b=>b.addEventListener('click',()=>{
   if(!score(d,r))return;
   const id=isR(d)?'RSES':'Vanderbilt',today=new Date().toISOString().slice(0,10);
   if(b.dataset.d3Save==="csv")download(csv(d,[r]),id+'_'+today+'_ответы.csv',"text/csv;charset=utf-8");
   else if(b.dataset.d3Save==="html")download(reportDoc(d,r),id+'_'+today+'_результат.html');
   else if(b.dataset.d3Save==="print")printHTML(reportDoc(d,r));
  }));
 }
 window.PSY_DIAG03={score,completion,intro,instructions,materials,processing,calculator:calc,groupTable:classTable,csv,reportDoc,
   bind,download,printHTML,saveBlank};
})();