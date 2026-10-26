"use strict";
/* Таблицы Шульте: воспроизведены 5 матриц 5x5 опубликованного комплекта.
   Среднее время / T1 / T4 строго по опубликованному протоколу. */
(function(){
 const NAME="Таблицы Шульте";
 const SOURCE="https://ppms22.ru/upload/medialibrary/2e7/knrjcfebjyc0ek8u3gjdv18auw6wszpt/1.-Vnimanie_Tablitsy-SHulte.pdf";
 const MATRIX=[
 [14,9,2,21,13,22,7,16,5,10,4,25,11,18,3,20,6,23,8,19,15,24,1,17,12],
 [2,13,1,8,20,17,6,25,7,11,22,18,3,15,19,10,5,12,24,16,14,23,4,9,21],
 [21,11,1,19,24,2,20,18,5,10,4,13,25,16,7,17,6,14,9,12,22,3,8,15,23],
 [5,21,23,4,25,11,2,7,13,20,24,17,19,6,18,9,1,12,8,14,16,10,3,15,22],
 [3,17,21,8,4,10,6,15,25,13,24,20,1,9,22,19,12,7,14,16,2,18,23,11,5]
 ];
 const NOTICE="Используется один конкретный опубликованный набор из пяти таблиц. Возрастные границы и уровни в разных источниках различаются; без точного совпадения возраста, формы предъявления и нормативного руководства их нельзя автоматически переносить. ЭР, ВР и ПУ — описательные показатели, не самостоятельный диагноз.";
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const round=x=>Math.round(x*100)/100;
 const D=window.PSY_FULL_METHODS,d=D[NAME]||{};
 Object.assign(d,{
  author:"В. Шульте (Walter Schulte)",
  age:"От 7 лет",
  kind:"Табличная диагностическая проба внимания",
  count:"5 таблиц × 25 чисел; 5 измерений времени",
  goal:"Описание темпа зрительного поиска, распределения внимания и динамики времени выполнения пяти таблиц.",
  instructions:"Предъявляйте пять таблиц 5×5 последовательно, по одной. Испытуемый показывает и вслух называет числа от 1 до 25 по возрастанию как можно быстрее и без ошибок. В начале каждой таблицы запускается секундомер, по окончании числа 25 время останавливается. Запишите T1–T5 в секундах и отдельно число отмеченных ошибок; при ошибке не давайте нормативную подсказку.",
  scoring:"ЭР = (Т1 + Т2 + Т3 + Т4 + Т5) / 5, секунд; ВР = Т1 / ЭР; ПУ = Т4 / ЭР. Дополнительно показываются разница Т5 − Т1 и количество ошибок. Ошибки не вычитаются из времени и не переводятся в баллы без отдельного правила. Незаполненное время не заменяется нулем.",
  interpret:"Пять значений времени оцениваются в динамике, вместе с ошибками и условиями проведения. ЭР, ВР, ПУ описывают данную процедуру. Возрастные уровни и выводы о нарушении внимания по одним этим числам автоматически не формируются.",
  warning:NOTICE,source:SOURCE,officialBlank:SOURCE,
  guideFile:"downloads/schulte_method_guide.docx",
  answerFile:"downloads/schulte_5_tables_student.html",
  workflow:"schulte5",graphic:"schulte",calculator:true,
  tables:MATRIX.map((numbers,i)=>({name:"Таблица "+(i+1),numbers:numbers.slice()})),
  scaleLabels:["Эффективность работы (ЭР, сек.)","Врабатываемость (ВР = Т1/ЭР)","Психическая устойчивость (ПУ = Т4/ЭР)","Ошибки и динамика времен"],
  questions:["Таблица 1","Таблица 2","Таблица 3","Таблица 4","Таблица 5"]
 });
 D[NAME]=d;
 function score(d,answers){
   if(!Array.isArray(answers))return null;
   const seconds=Array.from({length:5},(_,i)=>answers[i*2]);
   if(seconds.some(v=>v===""||v==null||!Number.isFinite(Number(v))||Number(v)<=0||Number(v)>3600))return null;
   const times=seconds.map(Number);
   const mean=times.reduce((a,b)=>a+b,0)/5;
   const errors=Array.from({length:5},(_,i)=>answers[i*2+1]);
   const validError=v=>v!==""&&v!=null&&Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<=999;
   const errorVals=errors.map(v=>validError(v)?Number(v):null);
   const errorsComplete=errorVals.every(v=>v!==null);
   return {
    mean:round(mean),vr:round(times[0]/mean),pu:round(times[3]/mean),
    delta:round(times[4]-times[0]),times:times.slice(),
    errors:errorVals,errorsComplete,errorsTotal:errorsComplete?errorVals.reduce((a,b)=>a+b,0):null,
    raw:round(mean),max:null,caption:"Среднее время пяти таблиц, секунды",
    sourceFormula:"ЭР=ΣT/5, ВР=T1/ЭР, ПУ=T4/ЭР"
   };
 }
 function tableHTML(i,forPrint=false){
   return '<div class="psy-schulte-item"><h4>Таблица '+(i+1)+'</h4><div class="psy-schulte-grid" aria-label="Таблица Шульте '+(i+1)+'">'+MATRIX[i].map(n=>'<span>'+n+'</span>').join("")+'</div></div>';
 }

 function topBar(title,href,label){
  return '<div class="psy-schulte-document-head"><h3>'+esc(title)+'</h3><a class="btn primary" href="'+esc(href)+'" target="_blank" rel="noopener noreferrer">'+esc(label||"Посмотреть и распечатать ↗")+'</a></div>';
 }
 function instruction(d){
  return '<section class="psy-schulte-manual">'+
   topBar("Методика и руководство",d.guideFile,"Открыть руководство · Word ↗")+
   '<h3>Цель</h3><p>'+esc(d.goal)+'</p>'+
   '<h3>Описание методики</h3><p>Пять таблиц размером 5 × 5 содержат числа от 1 до 25 в разном порядке. Участник последовательно находит числа по возрастанию. Специалист измеряет время выполнения каждой таблицы и фиксирует ошибки.</p>'+
   '<h3>Что подготовить</h3><p>Пять отдельных таблиц А4, секундомер и протокол для записи времени и ошибок. Предъявляйте только одну таблицу за раз.</p>'+
   '<h3>Порядок проведения</h3><ol><li>Объясните задание и убедитесь, что участник различает числа от 1 до 25.</li><li>Предъявите первую таблицу, запустите секундомер и предложите последовательно показать и назвать числа.</li><li>На числе 25 остановите секундомер, запишите время и ошибки.</li><li>Повторите процедуру со второй, третьей, четвёртой и пятой таблицами, фиксируя результаты отдельно.</li></ol>'+
   '<h3>Инструкция участнику</h3><div class="psy-schulte-script">«Сейчас ты увидишь таблицу с числами. Найди, покажи и называй числа от 1 до 25 по порядку. Старайся делать это быстро и без ошибок. Начинай по моей команде».</div>'+
   '<h3>Ключ и подсчёт</h3><div class="psy-schulte-key"><table><thead><tr><th>Показатель</th><th>Расчёт</th></tr></thead><tbody>'+
   '<tr><td>Эффективность работы (ЭР)</td><td>(T1 + T2 + T3 + T4 + T5) / 5, сек.</td></tr>'+
   '<tr><td>Врабатываемость (ВР)</td><td>T1 / ЭР</td></tr>'+
   '<tr><td>Психическая устойчивость (ПУ)</td><td>T4 / ЭР</td></tr>'+
   '</tbody></table></div><p>Т1–Т5 — время выполнения каждой таблицы в секундах. Ошибки фиксируются отдельно и не вычитаются из времени. При отсутствии любого из пяти измерений итог не рассчитывается.</p>'+
   '<h3>Интерпретация</h3><p>'+esc(d.interpret)+'</p>'+
   '</section>';
 }
 function materials(d){
  return '<section class="psy-schulte-blank">'+topBar("Бланк ученика — таблицы Шульте",d.answerFile)+
   '<p>Пять таблиц, на каждой числа от 1 до 25. Для проведения распечатайте каждую таблицу на отдельном листе А4.</p>'+
   '<div class="psy-schulte-all">'+MATRIX.map((_,i)=>tableHTML(i)).join("")+'</div></section>';
 }
 function processing(d){return '<h3>Обработка результатов</h3><p>'+esc(d.scoring)+'</p><h3>Интерпретация</h3><p>'+esc(d.interpret)+'</p>';}
 function visual(d,answers){
   const validCount=Array.from({length:5},(_,i)=>answers?.[i*2]).filter(v=>v!==""&&v!=null&&Number.isFinite(Number(v))&&Number(v)>0&&Number(v)<=3600).length;
   let h='<section class="psy-schulte-results"><h3>Результаты</h3>';
   const res=score(d,answers);
   if(!res)return h+'<p>Введено '+validCount+' из 5 времен. Для расчета ЭР, ВР и ПУ нужны все пять результатов в секундах. Ошибки регистрируются отдельно.</p></section>';
   const cells=[["ЭР, сек.",res.mean],["ВР",res.vr],["ПУ",res.pu],["Т5 − Т1, сек.",res.delta]];
   h+='<div class="psy-schulte-stats">'+cells.map(([label,val])=>'<div><span>'+esc(label)+'</span><strong>'+val+'</strong></div>').join("")+'</div>';
   h+='<h4>Динамика по таблицам</h4><div class="psy-schulte-bars">'+res.times.map((t,i)=>'<div><span>Т'+(i+1)+'</span><div class="psy-schulte-track"><i style="width:'+Math.max(2,Math.round(t/Math.max(...res.times)*100))+'%"></i></div><strong>'+t+' сек.</strong><small>'+(res.errors[i]==null?'ошибки не указаны':res.errors[i]+' ошиб.')+'</small></div>').join("")+'</div>';
   h+='<p><strong>Ошибки:</strong> '+(res.errorsComplete?'всего '+res.errorsTotal:'заполнены не для всех таблиц; сумма не рассчитывается')+'.</p>'+
   '<div class="notice">Показатели являются описательными. Не используйте автоматически возрастные нормы из другой редакции теста.</div></section>';return h;
 }

 function done(answers){return Array.from({length:5},(_,i)=>answers?.[i*2]).filter(v=>v!==""&&v!=null&&Number.isFinite(Number(v))&&Number(v)>0&&Number(v)<=3600).length;}
 const sorted=rows=>rows.slice().sort((a,b)=>(a.name||"").localeCompare(b.name||"","ru",{sensitivity:"base"}));
 function group(rows){
  const people=sorted(rows).filter(x=>x.name?.trim()||done(x.answers));
  return '<section class="psy-schulte-group"><h3>Результаты класса</h3><div class="psy-schulte-group-scroll"><table><thead><tr><th>Участник</th><th>ЭР, сек.</th><th>ВР</th><th>ПУ</th><th>Ошибки</th></tr></thead><tbody>'+
   people.map(x=>{const z=score(d,x.answers);return '<tr><td>'+esc(x.name||"Без имени")+'</td><td>'+(z?z.mean:"—")+'</td><td>'+(z?z.vr:"—")+'</td><td>'+(z?z.pu:"—")+'</td><td>'+(z?(z.errorsTotal??"Не указаны"):"—")+'</td></tr>';}).join("")+
   '</tbody></table></div></section>';
 }
 function calculator(d,ctx){
  const people=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],row=people[ctx.rowIndex]||people[0],a=row.answers||[];
  let h='<section class="psy-schulte-calculator"><div class="psy-schulte-modes"><button type="button" class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button type="button" class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
  if(ctx.calcMode==="class"){
   h+='<div class="psy-schulte-workspace"><aside class="psy-schulte-sidebar"><h3>Список учащихся</h3><p>Каждое имя — с новой строки.</p>'+
     '<label class="psy-schulte-label" for="schulteBulkNames">Добавить участников</label><textarea id="schulteBulkNames" rows="5" placeholder="Иванов Иван&#10;Петрова Мария"></textarea>'+
     '<button type="button" class="btn primary" id="schulteAddNames">Добавить в список</button>'+
     '<button type="button" class="btn" id="schulteSort">По алфавиту А – Я</button>'+
     '<div class="psy-schulte-person-list">'+people.map((p,i)=>(p.name?.trim()||done(p.answers))?
      '<div class="psy-schulte-person-row"><button type="button" class="psy-schulte-person '+(i===ctx.rowIndex?"active":"")+'" data-schulte-person="'+i+'"><span>'+esc(p.name||"Участник без имени")+'</span><small>'+done(p.answers)+'/5</small></button><button type="button" class="psy-schulte-person-delete" data-schulte-delete="'+i+'" aria-label="Удалить участника '+esc(p.name||"")+'">×</button></div>':"").join("")+'</div>'+
     '<button type="button" class="btn psy-schulte-delete-all" id="schulteDeleteAll">Удалить всех участников</button></aside><div class="psy-schulte-entry-main">';
  }else h+='<div class="psy-schulte-entry-main">';
  h+='<label class="psy-schulte-name"><span>Фамилия и имя</span><input id="schulteCurrentName" autocomplete="off" maxlength="120" placeholder="Введите ФИО" value="'+esc(row.name||"")+'"></label>'+
   '<p class="psy-schulte-progress" id="schulteProgress">Заполнено '+done(a)+' из 5 таблиц</p>'+
   '<div class="psy-schulte-inputs">'+MATRIX.map((_,i)=>'<section class="psy-schulte-entry"><h4>Таблица '+(i+1)+'</h4><div class="psy-schulte-entry-fields"><label>Время, сек.<input data-schulte="'+(i*2)+'" type="number" inputmode="decimal" min="0.1" max="3600" step="any" value="'+esc(a[i*2]??"")+'" placeholder="Например, 45.5"></label><label>Ошибок<input data-schulte="'+(i*2+1)+'" type="number" inputmode="numeric" min="0" max="999" step="1" value="'+esc(a[i*2+1]??"")+'" placeholder="0"></label></div></section>').join("")+'</div>';
  if(ctx.calcMode==="class")h+='<div class="psy-schulte-next"><button type="button" class="btn primary" id="schulteNext" '+(ctx.rowIndex>=people.length-1?"disabled":"")+'>Следующий участник →</button></div>';
  h+='<div id="schulteResult">'+visual(d,a)+'</div></div>';
  if(ctx.calcMode==="class")h+='</div><div id="schulteGroup">'+group(people)+'</div>';
  return h+'</section>';
 }
 function csvSafe(s){let t=String(s??"");if(/^\s*[=+\-@]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"';}
 function download(n,content,mime){const blob=new Blob([content],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

 function report(d,rows,calcMode,rowIndex){
  const list=calcMode==="class"?sorted(rows).filter(x=>score(d,x.answers)):rows.slice(rowIndex,rowIndex+1).filter(x=>score(d,x.answers));
  if(!list.length)return false;
  const records=list.map(x=>{const z=score(d,x.answers);return '<tr><td>'+esc(x.name||"Участник")+'</td><td>'+z.mean+'</td><td>'+z.vr+'</td><td>'+z.pu+'</td><td>'+(z.errorsTotal??"Не указано")+'</td><td>'+z.times.join(" / ")+'</td></tr>';}).join("");
  const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Таблицы Шульте — отчёт</title>'+
   '<style>body{font:16px/1.55 Arial,sans-serif;color:#183d30;max-width:1100px;margin:32px auto;padding:0 24px}h1{font-size:24px}table{border-collapse:collapse;width:100%;margin:25px 0}th,td{border:1px solid #afc7ba;text-align:left;padding:10px}th{background:#e9f2ec}.note{font-size:13px;color:#526358}@media print{body{margin:0}table{font-size:12px}}</style></head><body>'+
   '<h1>Таблицы Шульте — '+(calcMode==="class"?"отчёт класса":"отчёт участника")+'</h1><p>Дата: '+new Date().toLocaleDateString("ru-RU")+'</p>'+
   '<table><thead><tr><th>Участник</th><th>ЭР, сек.</th><th>ВР</th><th>ПУ</th><th>Ошибки</th><th>T1–T5, сек.</th></tr></thead><tbody>'+records+'</tbody></table>'+
   '<p class="note">'+esc(d.interpret)+'</p><p class="note">Результат носит описательный характер. Не является диагнозом.</p></body></html>';
  download(calcMode==="class"?"Таблицы_Шульте_класс.html":"Таблицы_Шульте_участник.html",html,"text/html;charset=utf-8");
  return true;
 }
 function bind(d,ctx){
  const rows=ctx.rows||[],person=rows[ctx.rowIndex];if(!person)return;
  const refresh=()=>{
   const out=document.getElementById("schulteResult");if(out)out.innerHTML=visual(d,person.answers);
   const summary=document.getElementById("schulteGroup");if(summary)summary.innerHTML=group(rows);
   const progress=document.getElementById("schulteProgress");if(progress)progress.textContent="Заполнено "+done(person.answers)+" из 5 таблиц";
   const status=document.querySelector(".psy-schulte-person.active small");if(status)status.textContent=done(person.answers)+"/5";
   const downloadBtn=document.getElementById("schulteReportBottom");if(downloadBtn)downloadBtn.disabled=!(ctx.calcMode==="class"?rows.some(x=>score(d,x.answers)):score(d,person.answers));
  };
  document.querySelectorAll("[data-schulte]").forEach(el=>el.addEventListener("input",()=>{
   person.answers[Number(el.dataset.schulte)]=el.value===""?"":Number(el.value);
   refresh();
  }));
  document.getElementById("schulteCurrentName")?.addEventListener("input",e=>{
   person.name=e.target.value;
   const selected=document.querySelector(".psy-schulte-person.active span");if(selected)selected.textContent=person.name||"Участник";
   refresh();
  });
  document.querySelectorAll("[data-schulte-person]").forEach(el=>el.addEventListener("click",()=>ctx.onSelect?.(Number(el.dataset.schultePerson))));
  document.querySelectorAll("[data-schulte-delete]").forEach(el=>el.addEventListener("click",()=>{if(confirm("Удалить участника из списка?"))ctx.onDelete?.(Number(el.dataset.schulteDelete));}));
  document.getElementById("schulteAddNames")?.addEventListener("click",()=>{
   const box=document.getElementById("schulteBulkNames");const names=(box?.value||"").split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean);
   if(names.length)ctx.onBulkAdd?.(names);else box?.focus();
  });
  document.getElementById("schulteSort")?.addEventListener("click",()=>{
   const box=document.getElementById("schulteBulkNames");const names=(box?.value||"").split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean);
   ctx.onSort?.(names);
  });
  document.getElementById("schulteDeleteAll")?.addEventListener("click",()=>{
   if(confirm("Удалить всех участников и результаты?"))ctx.onDeleteAll?.();
  });
  document.getElementById("schulteNext")?.addEventListener("click",()=>ctx.onNext?.());
 }
 window.PSY_SCHULTE={tables:MATRIX.map(x=>x.slice()),score,done,report,tableHTML,instruction,materials,processing,calculator,bind};
})();