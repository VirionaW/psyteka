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
 function calculator(d,ctx){
   const people=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],row=people[ctx.rowIndex]||people[0],a=row.answers||[];
   let h='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
   h+='<div class="notice">После обследования внесите время выполнения каждой таблицы (секунды). Количество ошибок не входит в формулу ЭР, но сохраняется отдельно. 0 ошибок запишите цифрой 0. Персональные данные не отправляются на сервер.</div>';
   if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Участник<select id="participantSelect">'+people.map((p,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+(i+1)+'. '+esc(p.name||"Код "+(i+1))+'</option>').join("")+'</select></label><label>Код<input id="participantName" value="'+esc(row.name||"")+'" placeholder="Без ФИО"></label><button class="btn" id="addParticipant">Добавить</button></div>';
   h+='<div class="psy-schulte-inputs">'+MATRIX.map((_,i)=>'<section class="psy-schulte-entry"><h4>Таблица '+(i+1)+'</h4><div class="psy-schulte-entry-fields"><label>Время, сек.<input data-schulte="'+(i*2)+'" type="number" inputmode="decimal" min="0.1" max="3600" step="0.1" value="'+esc(a[i*2]??"")+'" placeholder="Напр. 45.5"></label><label>Ошибок<input data-schulte="'+(i*2+1)+'" type="number" inputmode="numeric" min="0" max="999" step="1" value="'+esc(a[i*2+1]??"")+'" placeholder="0"></label></div></section>').join("")+'</div>';
   h+='<div id="schulteResult">'+visual(d,a)+'</div><div class="psy-schulte-actions"><button class="btn" id="resetParticipant">Очистить ответы</button><button class="btn primary" id="schulteIndividual">Скачать протокол JSON</button></div>';
   if(ctx.calcMode==="class")h+='<h3>Сводка по группе</h3><div class="results-table"><table><thead><tr><th>Код</th><th>ЭР, сек.</th><th>ВР</th><th>ПУ</th><th>Ошибок</th></tr></thead><tbody>'+people.map((p,i)=>{const z=score(d,p.answers);return '<tr><td>'+esc(p.name||"Код "+(i+1))+'</td><td>'+(z?.mean??"—")+'</td><td>'+(z?.vr??"—")+'</td><td>'+(z?.pu??"—")+'</td><td>'+(z?.errorsTotal??"—")+'</td></tr>'}).join("")+'</tbody></table></div><div class="psy-schulte-actions"><button class="btn primary" id="schulteCSV">Скачать таблицу класса CSV</button></div>';
   return h;
 }
 function csvSafe(s){let t=String(s??"");if(/^\s*[=+\-@]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"';}
 function download(n,content,mime){const blob=new Blob([content],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function bind(d,ctx){
   document.querySelectorAll("[data-schulte]").forEach(el=>el.addEventListener("input",()=>{
    ctx.rows[ctx.rowIndex].answers[Number(el.dataset.schulte)]=el.value===""?"":Number(el.value);
    const box=document.getElementById("schulteResult");if(box)box.innerHTML=visual(d,ctx.rows[ctx.rowIndex].answers);
   }));
   document.querySelector("#schulteIndividual")?.addEventListener("click",()=>{const r=ctx.rows[ctx.rowIndex];download("schulte_individual.json",JSON.stringify({method:NAME,version:"Five tables, 1-25",code:r.name||"",answers:r.answers||[],result:score(d,r.answers),source:d.source,warning:d.warning},null,2),"application/json;charset=utf-8");});
   document.querySelector("#schulteCSV")?.addEventListener("click",()=>{const tab=[["Код","ЭР","ВР","ПУ","Ошибок"],...ctx.rows.map((r,i)=>{const z=score(d,r.answers);return [r.name||"Код "+(i+1),z?.mean??"",z?.vr??"",z?.pu??"",z?.errorsTotal??""];})];download("schulte_class.csv","\uFEFF"+tab.map(row=>row.map(csvSafe).join(";")).join("\r\n"),"text/csv;charset=utf-8");});
 }
 window.PSY_SCHULTE={tables:MATRIX.map(x=>x.slice()),score,tableHTML,instruction,materials,processing,calculator,bind};
})();