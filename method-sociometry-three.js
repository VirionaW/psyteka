"use strict";
/* Three positive nominations; user-supplied questionnaire, separate class bank. */
(function(){
 const api=window.PSY_NEW_METHODS,v=window.PSY_SOCIO_VARIANTS;
 if(!api||!v)return;
 const ID="positive3",NONE="__none__";
 const Q=[
  "Если вашу группу будут расформировывать, с кем бы ты хотел продолжить совместно учиться в новом коллективе?",
  "Кого бы ты из класса пригласил на свой день рождения?",
  "С кем из своего класса ты пошел бы в многодневный туристический поход?"
 ];
 const short=["Совместная учеба","День рождения","Туристический поход"];
 const original={activate:v.activate,get:v.getVariant,set:v.setVariant,controls:v.controls,details:v.details,calculator:api.calculator,bind:api.bind,materials:api.materials,instruction:api.instruction,processing:api.processing,score:api.score};
 let selected=original.get();
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const dirty=()=>window.dispatchEvent(new Event("psy-assessment-dirty"));
 const people=rows=>(rows||[]).filter(r=>String(r?.name||"").trim());
 const absent=r=>r?.socioThreeAbsent===true;
 const isThree=d=>d?.methodType==="sociometry"&&selected===ID;
 const ensureIds=rows=>{let changed=false;people(rows).forEach(r=>{if(!r.socioId){r.socioId=globalThis.crypto?.randomUUID?.()||"s3-"+Date.now()+"-"+Math.random().toString(36).slice(2);changed=true}});if(changed)dirty()};
 v.activate=rows=>{if((rows||[]).some(r=>r?.socioVariant===ID))return selected=ID;return selected=original.activate(rows)};
 v.getVariant=()=>selected;
 v.setVariant=(next,rows)=>{if(next===ID){selected=ID;(rows||[]).forEach(r=>{if(r&&typeof r==="object")r.socioVariant=ID});dirty()}else{original.set(next,rows);selected=original.get()}};
 v.controls=()=>{
  let h=original.controls();
  if(selected===ID)h=h.replace(/ is-selected/g,"").replace(/aria-pressed="true"/g,'aria-pressed="false"');
  const btn='<button type="button" class="psy-socio-version-option '+(selected===ID?"is-selected":"")+'" data-socio-variant="'+ID+'" aria-pressed="'+(selected===ID)+'">Социометрия: учеба, день рождения, поход (3)</button>';
  return h.replace('</div><p>',btn+'</div><p>');
 };
 v.details=d=>selected===ID?{...d,author:"Автор исходного бланка не указан",kind:"Групповая социометрическая анкета",count:"3 положительных вопроса",goal:"Изучение предпочтений одноклассников в учебной и неформальной сферах.",instructions:"Назови одноклассников, которых выбрал бы в каждой ситуации. Не выбирай себя. Можно указать, что не выбираешь никого.",scoring:"Подсчет полученных выборов по каждому вопросу и их суммы. Один человек учитывается не более одного раза в одном вопросе.",interpret:"Число выборов отражает предпочтения в трех предложенных ситуациях. Нормативы и статусные пороги исходного бланка не предоставлены.",warning:"Ответы конфиденциальны.",version:"SOCIO-POSITIVE-THREE",indicators:["Полученные выборы по 3 вопросам","Сумма полученных выборов","Полнота ответов"]}:original.details(d);
 const values=(r,q)=>Array.isArray(r?.socioThreeAnswers?.[q])?r.socioThreeAnswers[q].map(x=>String(x||"")):[];
 function picks(r,q,ids){const a=values(r,q);return a[0]===NONE?[]:[...new Set(a.filter(x=>x&&x!==NONE&&x!==r.socioId&&ids.has(x)))]}
 const answered=(r,q,ids)=>!absent(r)&&(values(r,q)[0]===NONE||picks(r,q,ids).length>0);
 const done=(r,ids)=>Q.filter((_,q)=>answered(r,q,ids)).length;
 function tally(rows){
  const roster=people(rows),ids=new Set(roster.map(r=>r.socioId)),counts=new Map(roster.map(r=>[r.socioId,[0,0,0]]));
  roster.filter(r=>!absent(r)).forEach(r=>Q.forEach((_,q)=>picks(r,q,ids).forEach(id=>counts.get(id)[q]++)));
  return {roster,ids,counts,complete:roster.filter(r=>!absent(r)&&done(r,ids)===3).length,active:roster.filter(r=>!absent(r)).length};
 }
 function table(rows){
  const {roster,ids,counts,complete,active}=tally(rows);
  return '<section class="psy-socio-results"><h3>Результаты класса</h3><p>Полностью заполнено: '+complete+' из '+active+' участвующих. Числа отражают внесенные ответы, включая частично заполненные анкеты.</p><div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th>№</th><th>Ученик</th>'+short.map(x=>'<th>'+esc(x)+'</th>').join("")+'<th>Всего выборов</th><th>Ответы</th></tr></thead><tbody>'+roster.map((r,i)=>{const a=counts.get(r.socioId);return '<tr><td>'+(i+1)+'</td><td>'+esc(r.name)+'</td>'+a.map(x=>'<td>'+x+'</td>').join("")+'<td><b>'+a.reduce((x,y)=>x+y,0)+'</b></td><td>'+(absent(r)?"Отсутствовал":done(r,ids)+"/3")+'</td></tr>'}).join("")+'</tbody></table></div><p class="psy-socio-note">Полученные выборы отсутствовавших учеников учитываются, их исходящие ответы – нет.</p><div class="class-actions"><button type="button" class="btn" id="psyThreeCSV">Скачать ответы CSV</button><button type="button" class="btn" id="psyThreeResultsCSV">Скачать таблицу CSV</button><button type="button" class="btn primary psy-socio-save" id="psyThreeSave">Сохранить</button></div></section>';
 }
 function calculator(d,ctx){
  if(ctx.calcMode!=="class")return '<section class="psy-new-work psy-socio"><h3>Социометрия – 3 вопроса</h3><p>Ввод проводится для класса.</p><button type="button" class="btn primary" data-cmode="class">Группа / класс</button></section>';
  ensureIds(ctx.rows);
  const roster=people(ctx.rows),ids=new Set(roster.map(r=>r.socioId)),r=ctx.rows[ctx.rowIndex],active=roster.includes(r);
  const options=ctx.rows.map((p,i)=>roster.includes(p)?'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(p.name)+(absent(p)?" (отсутствовал)":"")+'</option>':"").join("");
  const cards=active&&!absent(r)?Q.map((q,i)=>{
   const a=values(r,i),n=Math.min(Math.max(0,roster.length-1),Math.max(3,a.length)),slots=Math.max(1,n);
   const fields=Array.from({length:slots},(_,j)=>{
    const opts='<option value="">Не указан</option>'+(j===0?'<option value="'+NONE+'" '+(a[0]===NONE?"selected":"")+'>Никого</option>':"")+roster.filter(p=>p!==r).map(p=>'<option value="'+esc(p.socioId)+'" '+(a[j]===p.socioId?"selected":"")+'>'+esc(p.name)+'</option>').join("");
    return '<label class="psy-vika-pick">'+(j+1)+' выбор<select data-three-q="'+i+'" data-three-slot="'+j+'" '+(a[0]===NONE&&j>0?"disabled":"")+'>'+opts+'</select></label>';
   }).join("");
   return '<article class="psy-socio-question is-positive"><div class="psy-socio-question-heading"><span class="psy-socio-number">'+(i+1)+'</span><h4>'+esc(q)+'</h4><span class="psy-socio-question-status">'+(answered(r,i,ids)?"Ответ внесен":"Не заполнено")+'</span></div><div class="psy-vika-picks">'+fields+'</div>'+(a[0]!==NONE&&slots<roster.length-1?'<button type="button" class="btn" data-three-add="'+i+'">Добавить выбор</button>':"")+'</article>';
  }).join(""):"";
  return '<section class="psy-new-work psy-socio psy-socio-vika"><div class="psy-socio-intro"><h3>Социометрия – 3 вопроса</h3><p>Выберите одноклассников из списка. По умолчанию три поля, при необходимости можно добавить еще. Пустое поле не равно ответу «Никого».</p></div><div class="psy-socio-roster"><div class="psy-socio-roster-head"><strong>Состав класса</strong><span>'+roster.length+' учеников</span></div><details class="psy-socio-add" '+(!roster.length?"open":"")+'><summary>Добавить учеников списком</summary><textarea id="psyThreeNames" rows="4" placeholder="Ученик 01&#10;Ученик 02"></textarea><div class="class-actions"><button type="button" class="btn primary" id="psyThreeAdd">Добавить в класс</button></div></details><div id="psyThreeMessage" role="status" class="psy-socio-message"></div>'+(roster.length?'<div class="psy-socio-student-picker"><label>Выбранный ученик<select id="psyThreePerson">'+options+'</select></label></div>':"")+'</div>'+(active?'<div class="psy-vika-student-head"><div><strong>'+esc(r.name)+'</strong><span>'+done(r,ids)+' из 3 вопросов заполнено</span></div><button type="button" class="btn" id="psyThreeAbsent">'+(absent(r)?"Вернуть к обследованию":"Отметить: отсутствовал")+'</button></div>':"")+(cards?'<div class="psy-socio-questions">'+cards+'</div>':active?'<p>Ученик отсутствовал. Его ответы не удалены.</p>':'<p>Добавьте состав класса.</p>')+(active?'<div class="class-actions"><label>Выбрать ученика<select id="psyThreeBottom">'+options+'</select></label><button type="button" class="btn primary" id="psyThreeNext">Следующий ученик</button></div>':"")+table(ctx.rows)+'</section>';
 }
 function csv(rows,results){
  const {roster,ids,counts}=tally(rows),byId=new Map(roster.map(p=>[p.socioId,p.name]));
  const lines=results?[["Ученик",...short,"Всего выборов","Ответы"],...roster.map(r=>{const a=counts.get(r.socioId);return [r.name,...a,a.reduce((x,y)=>x+y,0),absent(r)?"Отсутствовал":done(r,ids)+"/3"]})]:[["Ученик","Статус","Вопрос","Выборы"],...roster.flatMap(r=>Q.map((q,i)=>[r.name,absent(r)?"Отсутствовал":answered(r,i,ids)?"Ответ внесен":"Не заполнено",q,values(r,i)[0]===NONE?"Никого":picks(r,i,ids).map(id=>byId.get(id)).join("; ")]))];
  const safe=x=>{let t=String(x??"");if(/^\s*[=+@-]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"'};
  return "\uFEFF"+lines.map(r=>r.map(safe).join(";")).join("\r\n");
 }
 function download(rows,result){const a=document.createElement("a"),url=URL.createObjectURL(new Blob([csv(rows,result)],{type:"text/csv;charset=utf-8"}));a.href=url;a.download="Метолария_социометрия_3_"+(result?"результаты":"ответы")+".csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)}
 function bind(d,ctx){
  if(ctx.calcMode!=="class")return;
  const row=ctx.rows[ctx.rowIndex],on=(id,event,fn)=>document.getElementById(id)?.addEventListener(event,fn),rerender=()=>{dirty();ctx.onSelect?.(ctx.rowIndex)},msg=t=>{const el=document.getElementById("psyThreeMessage");if(el)el.textContent=t};
  on("psyThreeAdd","click",()=>{const names=(document.getElementById("psyThreeNames")?.value||"").split(/[\r\n;]+/).map(x=>x.trim()).filter(Boolean);if(names.length)ctx.onBulkAdd?.(names)});
  ["psyThreePerson","psyThreeBottom"].forEach(id=>on(id,"change",e=>ctx.onSelect?.(Number(e.target.value))));
  on("psyThreeNext","click",()=>{for(let k=1;k<=ctx.rows.length;k++){const i=(ctx.rowIndex+k)%ctx.rows.length,p=ctx.rows[i];if(p?.name?.trim()&&!absent(p)){ctx.onSelect?.(i);break}}});
  on("psyThreeAbsent","click",()=>{if(row){row.socioThreeAbsent=!absent(row);rerender()}});
  const put=(q,a)=>{if(!Array.isArray(row.socioThreeAnswers))row.socioThreeAnswers=[];row.socioThreeAnswers[q]=a;rerender()};
  document.querySelectorAll("[data-three-add]").forEach(b=>b.addEventListener("click",()=>{if(!row||absent(row))return;const q=Number(b.dataset.threeAdd),a=values(row,q);while(a.length<3)a.push("");if(a.length<people(ctx.rows).length-1){a.push("");put(q,a)}}));
  document.querySelectorAll("[data-three-q]").forEach(el=>el.addEventListener("change",()=>{
   if(!row||absent(row))return;
   const q=Number(el.dataset.threeQ),slot=Number(el.dataset.threeSlot),a=values(row,q),x=el.value;
   if(x&&x!==NONE&&(x===row.socioId||!people(ctx.rows).some(p=>p.socioId===x)||a.some((id,i)=>i!==slot&&id===x))){msg("Нельзя выбирать себя или повторять одного ученика в одном вопросе.");el.value=a[slot]||"";return}
   if(slot===0&&x===NONE){put(q,[NONE]);return}
   if(a[0]===NONE)a[0]="";
   while(a.length<=slot)a.push("");a[slot]=x;put(q,a);
  }));
  on("psyThreeCSV","click",()=>download(ctx.rows,false));on("psyThreeResultsCSV","click",()=>download(ctx.rows,true));on("psyThreeSave","click",()=>ctx.onSave?.());
 }
 function blank(){return '<section class="psy-new-print psy-socio-print"><h3>Социометрия – 3 вопроса</h3><p>Класс: __________ Дата: __________ Имя или код: __________</p><p>Не выбирай себя. Укажи одноклассников или напиши «Никого».</p>'+Q.map((q,i)=>'<div class="psy-socio-print-q"><strong>'+(i+1)+'. '+esc(q)+'</strong><p>1. __________________________</p><p>2. __________________________</p><p>3. __________________________</p><p>Другие: __________________________</p></div>').join("")+'</section>'}
 api.calculator=(d,ctx)=>isThree(d)?calculator(d,ctx):original.calculator(d,ctx);
 api.bind=(d,ctx)=>isThree(d)?bind(d,ctx):original.bind(d,ctx);
 api.materials=(d,...a)=>isThree(d)?blank():original.materials(d,...a);
 api.instruction=(d,...a)=>isThree(d)?'<h3>Инструкция</h3><p>Не выбирай себя. Ответы конфиденциальны.</p><ol>'+Q.map(q=>'<li>'+esc(q)+'</li>').join("")+'</ol><p>Подсчитываются полученные выборы по каждому вопросу и их сумма.</p>':original.instruction(d,...a);
 api.processing=(d,...a)=>isThree(d)?'<h3>Обработка</h3><p>Полученные выборы подсчитываются отдельно по каждому вопросу. Сумма – количество номинаций во всех трех ситуациях.</p>':original.processing(d,...a);
 api.score=(d,...a)=>isThree(d)?null:original.score?.(d,...a);
 window.PSY_SOCIO_THREE={questions:Q.slice(),tally,csv,version:ID};
})();