"use strict";
(function(){
 const e=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const stages=["1-е чтение","2-е чтение","3-е чтение","4-е чтение","5-е чтение","Отсрочено"];
 const statuses=[
  ["","Не оценено"],["independent","Самостоятельно обосновано"],
  ["assisted","С помощью специалиста"],["alternative","Иное обоснованное решение"],
  ["unclear","Обоснование не получено"]
 ];
 const groupButtons=(ctx)=>'<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>'+
 (ctx.calcMode==="class"?'<div class="group-tools"><label>Участник<select id="participantSelect">'+ctx.rows.map((r,i)=>'<option value="'+i+'" '+(ctx.rowIndex===i?'selected':'')+'>'+e(r.name||'Участник '+(i+1))+'</option>').join('')+'</select></label><label>Код участника<input id="participantName" placeholder="Например, № 01" value="'+e(ctx.rows[ctx.rowIndex].name)+'"></label><button class="btn" id="addParticipant">Добавить</button></div>':'')+
 '<p class="privacy-inline">Обработка выполняется в браузере без отправки на сервер. Для работы с несовершеннолетними используйте коды, а не ФИО. Несохраненные данные пропадут при закрытии страницы.</p>';
 function memoryScore(answers){
  if(!Array.isArray(answers))answers=[];
  const series=stages.map((_,t)=>answers[60+t]==="1"?Array.from({length:10},(_,i)=>answers[t*10+i]==="1"?1:0).reduce((a,b)=>a+b,0):null);
  return {type:"memory10",series,completed:series.filter(n=>n!==null).length,raw:series[4],delayed:series[5],max:10,caption:"Слова из 10",index:null};
 }
 function oddScore(answers){
  if(!Array.isArray(answers))answers=[];
  const counts={independent:0,assisted:0,alternative:0,unclear:0,missing:0};
  for(let i=1;i<12;i++){const v=answers[i]||"";if(Object.hasOwn(counts,v))counts[v]++;else counts.missing++;}
  return {type:"odd4",counts,completed:11-counts.missing,raw:counts.independent,max:11,index:null,caption:"Описание способа решения (не нормативный балл)"};
 }
 function score(d,answers){return d.special==="memory10"?memoryScore(answers):oddScore(answers);}
 function memorySheet(d){
  return '<div class="stimulus-paper"><p class="material-warning"><strong>Только для психолога.</strong> Слова произносятся вслух. Не показывайте этот список участнику.</p><table class="word-matrix"><thead><tr><th>Слово</th>'+stages.map((x,i)=>'<th>'+(i+1)+'</th>').join('')+'</tr></thead><tbody>'+
  d.words.map(w=>'<tr><th>'+e(w)+'</th>'+stages.map(()=>'<td></td>').join('')+'</tr>').join('')+
  '<tr><th>Верно слов</th>'+stages.map(()=>'<td>___</td>').join('')+'</tr></tbody></table>'+
  '<p>Дополнительные / повторенные слова: ______________________________________________________</p>'+
  '<p>Время отсрочки: ______ минут. Наблюдения: _________________________________________________</p></div>';
 }
 function oddSheet(d){
  return '<div class="stimulus-paper odd-sheet"><p class="material-warning">В каждой строке найдите одно лишнее слово и объясните, что объединяет остальные.</p>'+
  d.samples.map((x,i)=>'<div class="odd-print-item"><strong>'+(i+1)+'.'+(i===0?' Тренировка.':'')+'</strong><span class="odd-words">'+x.words.map(y=>e(y)).join(' · ')+'</span><div class="odd-write-line">Лишнее: ______________ Общее: ______________ Почему: _______________________</div></div>').join('')+'</div>';
 }
 function materials(d){return d.special==="memory10"?memorySheet(d):oddSheet(d);}
 function extraInstructions(d){
  if(d.special==="memory10")return '<h3>Протокол проведения для специалиста</h3><ol><li>Прочитайте десять слов один раз, спокойно, с одинаковой интонацией.</li><li>Зафиксируйте все слова, повторенные после чтения, включая посторонние и повторы.</li><li>Повторите тот же список еще четыре раза, после каждого чтения фиксируйте ответ.</li><li>После интервала (в этой рабочей версии – около часа) без повторного зачитывания запросите отсроченное воспроизведение; запишите фактическую длительность паузы.</li><li>Сравните количества и качественные особенности ошибок; не присваивайте диагноз по графику.</li></ol><p class="notice">Рабочий набор из 10 слов в этом интерфейсе – демонстрационный. Не переносите на него без проверки нормы иной версии.</p>';
  return '<h3>Протокол проведения для специалиста</h3><ol><li>Серия 1 – тренировочная, объясните на ней принцип задания.</li><li>Серии 2–12 предъявляйте по одной, без подсказок, если это позволяет возраст и состояние.</li><li>Записывайте исключенное слово, обобщающее понятие и объяснение дословно.</li><li>Если потребовалась помощь, отдельно отметьте ее содержание.</li><li>Возможен обоснованный альтернативный способ классификации; его нельзя автоматически считать ошибкой.</li></ol><h3>Ориентиры для беседы со специалистом</h3><div class="odd-guide">'+d.samples.map((s,i)=>'<p>'+(i+1)+'. '+e(s.extra)+' – пример основания: '+e(s.group)+'.</p>').join('')+'</div><p class="notice">Это оригинальные демонстрационные серии «Психотеки», а не стандартизированный комплект тестовых карточек.</p>';
 }
 function memoryFeedback(d,ctx){
  const row=ctx.rows[ctx.rowIndex],z=score(d,row.answers);
  const vals=z.series.map((v,i)=>'<div><span>'+e(stages[i])+'</span><b>'+(v===null?'Не завершено':v+' / 10')+'</b></div>').join('');
  return '<h3>Кривая воспроизведения</h3><div class="memory-stages">'+vals+'</div><p>Этапов завершено: '+z.completed+' из 6. Отсроченный результат считается отдельно.</p>'+
   '<div class="memory-bars">'+z.series.map((v,i)=>'<div><small>'+e(i===5?'Отср.':String(i+1))+'</small><div class="memory-track"><span style="width:'+((v??0)*10)+'%"></span></div><b>'+(v===null?'–':v)+'</b></div>').join('')+'</div>'+
   '<p class="privacy-inline">Ни один балл не означает диагноз. Важны ошибки, порядок и условия выполнения.</p>';
 }
 function oddFeedback(d,ctx){
  const z=score(d,ctx.rows[ctx.rowIndex].answers),c=z.counts;
  return '<h3>Описательные результаты</h3><p>Рассмотрено серий: '+z.completed+' из 11. Тренировочная серия не учитывается.</p><div class="odd-results"><span>Самостоятельно обосновано <b>'+c.independent+'</b></span><span>С помощью <b>'+c.assisted+'</b></span><span>Альтернативное обоснование <b>'+c.alternative+'</b></span><span>Без обоснования <b>'+c.unclear+'</b></span></div><p class="privacy-inline">Это сводка наблюдений, а не шкала психического развития или возрастная норма.</p>';
 }
 function feedback(d,ctx){return d.special==="memory10"?memoryFeedback(d,ctx):oddFeedback(d,ctx);}
 function memoryCalculator(d,ctx){
  const a=ctx.rows[ctx.rowIndex].answers;
  let out='<div class="memory-scroll"><table class="word-matrix memory-entry"><thead><tr><th>Слово</th>'+stages.map((v,i)=>'<th title="'+e(v)+'">'+(i<5?i+1:'Отср.')+'</th>').join('')+'</tr></thead><tbody>';
  for(let i=0;i<10;i++){
   out+='<tr><th>'+e(d.words[i])+'</th>';
   for(let j=0;j<6;j++)out+='<td><input class="memory-check" type="checkbox" data-memory-idx="'+(j*10+i)+'" aria-label="'+e(d.words[i])+', '+e(stages[j])+'" '+(a[j*10+i]==="1"?'checked':'')+'></td>';
   out+='</tr>';
  }
  out+='<tr><th>Этап закончен</th>'+stages.map((st,i)=>'<td><input type="checkbox" class="memory-done" data-memory-stage="'+i+'" aria-label="Завершен этап '+e(st)+'" '+(a[60+i]==="1"?'checked':'')+'></td>').join('')+'</tr></tbody></table></div>';
  out+='<p class="privacy-inline">Поставьте галочку напротив воспроизведенных слов. После окончания каждого предъявления отметьте «Этап закончен», даже если не названо ни одного слова. Отсроченное воспроизведение – отдельный этап.</p>';
  ctx.rows[ctx.rowIndex].intrusions ||= [];
  out+='<h3>Ошибки и посторонние слова</h3><div class="memory-intrusions">'+stages.map((st,i)=>'<label>'+e(st)+'<input data-memory-note="'+i+'" value="'+e(ctx.rows[ctx.rowIndex].intrusions[i]||'')+'" placeholder="Повторы, лишние слова или наблюдения"></label>').join('')+'</div>';
  return out;
 }
 function oddCalculator(d,ctx){
  const r=ctx.rows[ctx.rowIndex];r.excluded ||= [];r.generalizations ||= [];r.rationales ||= [];
  return '<p class="privacy-inline">Записывайте ответы так, как они прозвучали. В поле «Оценка» выбирайте способ решения, учитывая объяснение, а не только совпадение с одним из вариантов.</p>'+
  d.samples.map((s,i)=>{
   if(i===0)return '<div class="odd-entry"><h4>1. Тренировочная серия</h4><p>'+s.words.map(e).join(' · ')+'</p><small>В расчет 11 рабочих серий не входит.</small></div>';
   return '<div class="odd-entry"><h4>'+(i+1)+'. '+s.words.map(e).join(' · ')+'</h4>'+
    '<div class="odd-entry-fields"><label>Исключено<select data-odd-excluded="'+i+'"><option value="">Не указано</option>'+s.words.map(w=>'<option value="'+e(w)+'" '+(r.excluded[i]===w?'selected':'')+'>'+e(w)+'</option>').join('')+'</select></label>'+
    '<label>Обобщающее понятие<input data-odd-general="'+i+'" value="'+e(r.generalizations[i]||'')+'" placeholder="Как названы остальные три"></label></div>'+
    '<label>Дословное объяснение и помощь<textarea rows="2" data-odd-reason="'+i+'" placeholder="Ответ ребенка, подсказки, замечания">'+e(r.rationales[i]||'')+'</textarea></label>'+
    '<label>Оценка способа решения<select data-odd-status="'+i+'">'+statuses.map(([key,label])=>'<option value="'+key+'" '+(r.answers[i]===key?'selected':'')+'>'+label+'</option>').join('')+'</select></label></div>';
  }).join('');
 }
 function groupTable(d,ctx){
  if(ctx.calcMode!=="class")return "";
  const header=d.special==="memory10"?['Участник',...stages]:['Участник','Самостоятельно','С помощью','Иное обосновано','Без обоснования','Оценено'];
  const cells=ctx.rows.map((r,i)=>{
   const z=score(d,r.answers);
   const values=d.special==="memory10"?z.series.map(n=>n===null?'–':String(n)):[z.counts.independent,z.counts.assisted,z.counts.alternative,z.counts.unclear,z.completed];
   return '<tr><td>'+e(r.name||'Участник '+(i+1))+'</td>'+values.map(n=>'<td>'+e(n)+'</td>').join('')+'</tr>';
  }).join('');
  return '<div class="class-actions"><button class="btn primary" id="nextParticipant">Следующий участник</button><button class="btn" id="exportGroup">Скачать CSV</button></div><h3>Группа</h3><div class="results-table"><table><thead><tr>'+header.map(x=>'<th>'+e(x)+'</th>').join('')+'</tr></thead><tbody>'+cells+'</tbody></table></div>';
 }
 function calculator(d,ctx){
  if(!ctx.rows.length)ctx.rows.push({name:"",answers:[]});
  const local={...ctx,rowIndex:Math.min(ctx.rowIndex,ctx.rows.length-1)};
  const r=ctx.rows[local.rowIndex];r.answers ||= [];
  return groupButtons(local)+(d.special==="memory10"?memoryCalculator(d,local):oddCalculator(d,local))+
   '<section class="special-score-feedback" aria-live="polite">'+feedback(d,local)+'</section>'+
   groupTable(d,local)+
   '<div class="class-actions"><button class="btn" id="resetParticipant">Очистить ответы участника</button></div>';
 }
 function bind(d,ctx){
  const r=ctx.rows[ctx.rowIndex];
  const refresh=()=>{
   const el=document.querySelector('.special-score-feedback');if(el)el.innerHTML=feedback(d,ctx);
   const tbody=document.querySelector('.results-table tbody');
   if(tbody&&ctx.calcMode==="class"){const wrap=document.createElement('div');wrap.innerHTML=groupTable(d,ctx);const newBody=wrap.querySelector('tbody');if(newBody)tbody.innerHTML=newBody.innerHTML;}
  };
  document.querySelectorAll('[data-memory-idx]').forEach(input=>input.addEventListener('change',()=>{r.answers[+input.dataset.memoryIdx]=input.checked?"1":"";refresh()}));
  document.querySelectorAll('[data-memory-stage]').forEach(input=>input.addEventListener('change',()=>{r.answers[60+Number(input.dataset.memoryStage)]=input.checked?"1":"";refresh()}));
  document.querySelectorAll('[data-memory-note]').forEach(input=>input.addEventListener('input',()=>{r.intrusions ||= [];r.intrusions[+input.dataset.memoryNote]=input.value}));
  const controls=[['[data-odd-excluded]','excluded','oddExcluded'],['[data-odd-general]','generalizations','oddGeneral'],['[data-odd-reason]','rationales','oddReason']];
  for(const [selector,field,data] of controls)document.querySelectorAll(selector).forEach(input=>input.addEventListener('input',()=>{r[field] ||= [];r[field][+input.dataset[data]]=input.value}));
  document.querySelectorAll('[data-odd-status]').forEach(input=>input.addEventListener('change',()=>{r.answers[+input.dataset.oddStatus]=input.value;refresh()}));
 }
 function exportGroup(d,rows){
  const safe=x=>{let s=String(x??"");if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
  let output;
  if(d.special==="memory10"){
   output=[["Участник",...stages,...stages.map(x=>"Дополнительно: "+x)],...rows.map((r,i)=>[r.name||"Участник "+(i+1),...score(d,r.answers).series.map(n=>n===null?"":n),...stages.map((_,k)=>r.intrusions?.[k]||"")])];
  }else{
   const hdr=["Участник","Самостоятельно","С помощью","Альтернативное обоснование","Без обоснования","Оценено"];
   for(let i=1;i<12;i++)hdr.push("№"+(i+1)+": исключено","№"+(i+1)+": обобщение","№"+(i+1)+": объяснение","№"+(i+1)+": оценка");
   output=[hdr,...rows.map((r,i)=>{
    const z=score(d,r.answers);
    const a=[r.name||"Участник "+(i+1),z.counts.independent,z.counts.assisted,z.counts.alternative,z.counts.unclear,z.completed];
    for(let k=1;k<12;k++)a.push(r.excluded?.[k]||"",r.generalizations?.[k]||"",r.rationales?.[k]||"",r.answers?.[k]||"");
    return a;
   })];
  }
  const csv="\uFEFF"+output.map(row=>row.map(safe).join(";")).join("\r\n");
  const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
  const a=document.createElement('a');a.href=url;a.download=d.special==="memory10"?"Психотека_10_слов.csv":"Психотека_4_лишний.csv";a.click();URL.revokeObjectURL(url);
 }
 const printCSS='.word-matrix{border-collapse:collapse;width:100%;table-layout:fixed}.word-matrix th,.word-matrix td{border:1px solid #8fa99c;padding:6px;text-align:center}.word-matrix th:first-child{width:110px;text-align:left}.material-warning{margin:8px 0 14px}.odd-print-item{border:1px solid #a8bdaf;padding:8px;margin:8px 0;break-inside:avoid}.odd-words{margin-left:10px}.odd-write-line{margin-top:8px;font-size:9pt}.stimulus-paper{border:0!important;padding:0!important}.memory-intrusions{display:none}';
 window.PSY_BATCH02={score,materials,extraInstructions,calculator,bind,exportGroup,groupTable,printCSS};
})();