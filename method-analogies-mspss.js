"use strict";
(function(){
 const api=window.PSY_ANALOGIES;
 if(!api||!window.PSY_REVIEWED_WORKSHEETS)return;
 const OPTIONS=["А","Б","В","Г"];
 const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const prepared=a=>api.score(Array.isArray(a)?a:[]);
 const count=a=>prepared(a).filled;
 const valid=a=>prepared(a).complete;
 const alphabet=rows=>rows.slice().sort((a,b)=>(a.name||"").localeCompare(b.name||"","ru",{sensitivity:"base"}));
 function result(a){
   const z=prepared(a);
   if(!z.complete){
     return '<section class="psy-analogy-summary" aria-live="polite"><h3>Результат</h3><p>Заполнено '+z.filled+' из 12. Верных среди заполненных: '+z.correct+'.</p><p>Итоговый балл будет рассчитан после заполнения всех 12 заданий. Пропуск не является ошибкой.</p></section>';
   }
   const groups=Object.entries(z.byType).filter(([,v])=>v.total>0);
   return '<section class="psy-analogy-summary" aria-live="polite"><h3>Результат</h3><strong>'+z.correct+' / 12</strong>'+
   '<p>Верных ответов: '+z.correct+' из 12. Результат относится только к данному набору заданий.</p>'+
   '<h4>Анализ смысловых связей</h4><ul>'+groups.map(([name,x])=>'<li>'+E(name)+': '+x.correct+' из '+x.total+'</li>').join("")+'</ul>'+
   '<p>Не переносите возрастные нормы других вариантов пробы на этот набор.</p></section>';
 }
 function groupResult(rows){
   const selected=alphabet(rows).filter(x=>x.name?.trim()||count(x.answers));
   return '<section class="psy-analogy-summary"><h3>Результаты класса</h3><div class="psy-mspss-scroll"><table><thead><tr><th>Фамилия и имя</th><th>Заполнено</th><th>Верных ответов</th></tr></thead><tbody>'+
     selected.map(x=>{const z=prepared(x.answers);return '<tr><td>'+E(x.name||"Без имени")+'</td><td>'+z.filled+'/12</td><td>'+(z.complete?z.correct+'/12':"Не завершено")+'</td></tr>';}).join("")+
   '</tbody></table></div><p>Не завершенные протоколы не получают итоговый балл.</p></section>';
 }
 function calculator(d,ctx){
   const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],idx=Math.max(0,Math.min(ctx.rowIndex,rows.length-1));
   const r=rows[idx]||rows[0],a=r.answers||[];
   let h='<section class="psy-mspss-calculator psy-analogies-calculator"><div class="calc-mode psy-mspss-modes"><button type="button" class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button type="button" class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
   if(ctx.calcMode==="class"){
     h+='<div class="psy-mspss-workspace"><aside class="psy-mspss-sidebar"><h3>Список учащихся</h3><p>ФИО каждого участника - с новой строки.</p>'+
       '<label for="anaBulkNames">Добавить участников</label><textarea id="anaBulkNames" rows="5" placeholder="Иванов Иван&#10;Петрова Мария"></textarea>'+
       '<button type="button" class="btn primary" id="anaAddNames">Добавить в список</button>'+
       '<button type="button" class="btn" id="anaSort">По алфавиту А - Я</button>'+
       '<div class="psy-mspss-person-list">'+rows.map((u,i)=>(u.name?.trim()||count(u.answers))?'<div class="psy-mspss-person-row"><button type="button" class="psy-mspss-person '+(idx===i?"active":"")+'" data-ana-person="'+i+'"><span>'+E(u.name||"Без имени")+'</span><small>'+count(u.answers)+'/12</small></button><button type="button" class="psy-mspss-delete-person" aria-label="Удалить участника" data-ana-delete="'+i+'">×</button></div>':"").join("")+'</div>'+
       '<button type="button" class="btn" id="anaDeleteAll">Удалить всех участников</button></aside><div class="psy-mspss-entry">';
   }else h+='<div class="psy-mspss-entry">';
   h+='<label class="psy-mspss-name-field" for="anaName"><span>Фамилия и имя</span><input id="anaName" maxlength="120" autocomplete="off" value="'+E(r.name||"")+'" placeholder="Введите ФИО"></label>'+
      '<p class="psy-mspss-progress" id="anaProgress">Заполнено '+count(a)+' из 12</p>'+
      '<p>Введите букву выбранного ответа: А, Б, В или Г. Можно использовать латинские A, B, V, G.</p>'+
      '<div class="psy-mspss-grid psy-analogies-entry-grid">'+api.TASKS.map((t,i)=>{
       const v=Number.isInteger(a[i])&&a[i]>=0&&a[i]<4?a[i]:null;
       return '<label class="psy-analogy-card '+(v!==null?"is-complete":"is-missing")+'"><span class="psy-analogy-question">'+t.id+'. '+E(t.question)+'</span>'+
        '<span class="psy-analogy-choices">'+t.options.map((opt,j)=>OPTIONS[j]+') '+E(opt)).join(' / ')+'</span>'+
        '<input class="psy-analogy-letter" data-ana-input="'+i+'" type="text" maxlength="1" autocomplete="off" aria-label="Ответ к заданию '+t.id+'" placeholder="А-Г" value="'+(v!==null?OPTIONS[v]:"")+'"></label>';
      }).join("")+'</div>';
   if(ctx.calcMode==="class")h+='<div class="psy-mspss-after-questions"><button type="button" class="btn primary" id="anaNext" '+(idx===rows.length-1?"disabled":"")+'>Следующий участник</button></div>';
   h+='<div id="anaResult">'+result(a)+'</div></div>';
   if(ctx.calcMode==="class")h+='</div><div id="anaClassResult">'+groupResult(rows)+'</div>';
   return h+'</section>';
 }
 function parse(value){
  const v=String(value||"").trim().toUpperCase(),dict={"А":0,"A":0,"Б":1,"B":1,"В":2,"V":2,"Г":3,"G":3};
  return Object.prototype.hasOwnProperty.call(dict,v)?dict[v]:null;
 }
 function download(name,html){
   const blob=new Blob([html],{type:"text/html;charset=utf-8"}),url=URL.createObjectURL(blob);
   const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function report(ctx){
  const rows=ctx.rows||[],current=rows[ctx.rowIndex]||{};
  const ordered=ctx.calcMode==="class"?alphabet(rows).filter(x=>x.name?.trim()||count(x.answers)):[current];
  if(!ordered.some(x=>valid(x.answers)))return false;
  const docs=ordered.map(r=>window.PSY_REVIEWED_WORKSHEETS.worksheet({type:"analogies",name:"Простые аналогии"},r,api));
  if(docs.length===1){download("analogies_participant.html",docs[0]);return true}
  const bodies=docs.map(x=>x.match(/<body>([\s\S]*?)<\/body>/)?.[1]||"").join('<div style="break-before:page"></div>');
  const paper='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Простые аналогии - отчет класса</title><style>@page{size:A4;margin:12mm}body{font:10pt Arial}table{width:100%;border-collapse:collapse}th,td{border:1px solid #bbb;padding:5px}tr{break-inside:avoid}@media print{.tools{display:none}}</style></head><body>'+bodies+'</body></html>';
  download("analogies_class.html",paper);return true;
 }
 function bind(d,ctx){
   const rows=ctx.rows||[],r=rows[ctx.rowIndex];if(!r)return;
   if(!Array.isArray(r.answers))r.answers=[];
   const footer=()=>{const btn=document.getElementById("anaReportBottom");if(btn){btn.disabled=ctx.calcMode==="class"?!rows.some(x=>valid(x.answers)):!valid(r.answers);btn.textContent=ctx.calcMode==="class"?"Скачать отчет класса":"Скачать отчет участника";}};
   const refresh=()=>{const progress=document.getElementById("anaProgress");if(progress)progress.textContent="Заполнено "+count(r.answers)+" из 12";
     const out=document.getElementById("anaResult");if(out)out.innerHTML=result(r.answers);
     const group=document.getElementById("anaClassResult");if(group)group.innerHTML=groupResult(rows);
     const person=document.querySelector(".psy-mspss-person.active small");if(person)person.textContent=count(r.answers)+"/12";
     footer();
   };
   document.getElementById("anaName")?.addEventListener("input",ev=>{r.name=ev.target.value;const span=document.querySelector(".psy-mspss-person.active span");if(span)span.textContent=r.name||"Без имени";footer()});
   const inputs=[...document.querySelectorAll("[data-ana-input]")];
   inputs.forEach((el,i)=>{el.addEventListener("input",()=>{
      const value=parse(el.value);
      r.answers[+el.dataset.anaInput]=value;
      el.value=value===null?"":OPTIONS[value];
      el.closest(".psy-analogy-card")?.classList.toggle("is-complete",value!==null);
      el.closest(".psy-analogy-card")?.classList.toggle("is-missing",value===null);
      refresh();
      if(value!==null&&i<inputs.length-1)inputs[i+1].focus();
   });
   el.addEventListener("keydown",ev=>{if(ev.key==="Backspace"&&!el.value&&i>0){ev.preventDefault();inputs[i-1].focus()}});
   });
   document.querySelectorAll("[data-ana-person]").forEach(el=>el.addEventListener("click",()=>ctx.onSelect?.(+el.dataset.anaPerson)));
   document.getElementById("anaAddNames")?.addEventListener("click",()=>{
      const names=(document.getElementById("anaBulkNames")?.value||"").split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean);
      if(names.length)ctx.onBulkAdd?.(names);
   });
   document.getElementById("anaSort")?.addEventListener("click",()=>ctx.onSort?.((document.getElementById("anaBulkNames")?.value||"").split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean)));
   document.querySelectorAll("[data-ana-delete]").forEach(el=>el.addEventListener("click",ev=>{ev.preventDefault();if(confirm("Удалить участника и его ответы?"))ctx.onDelete?.(+el.dataset.anaDelete)}));
   document.getElementById("anaDeleteAll")?.addEventListener("click",()=>{if(confirm("Удалить всех участников и их ответы?"))ctx.onDeleteAll?.()});
   document.getElementById("anaNext")?.addEventListener("click",()=>ctx.onNext?.());
   document.getElementById("anaReportBottom")?.addEventListener("click",()=>report(ctx));
   document.getElementById("anaResetBottom")?.addEventListener("click",()=>{if(confirm("Очистить ответы выбранного участника?")){r.answers=[];refresh();inputs.forEach(x=>{x.value="";x.closest(".psy-analogy-card")?.classList.remove("is-complete");x.closest(".psy-analogy-card")?.classList.add("is-missing")});}});
   footer();
 }
 api.calculator=calculator;api.bind=bind;
 api.report=report;api.count=count;api.valid=valid;api.parse=parse;
})();