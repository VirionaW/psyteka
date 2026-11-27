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
 const padded=(r,q)=>{const a=values(r,q);return Array.from({length:Math.max(3,a.length)},(_,j)=>a[j]||(a.length===1&&a[0]===NONE?NONE:""))};
 const norm=x=>String(x??"").normalize("NFKC").toLocaleLowerCase("ru").replace(/\u0451/g,"е").trim();
 const candidates=(roster,r,q,slot,term)=>{
  const t=norm(term),used=new Set(values(r,q).filter((x,j)=>j!==slot&&x!==NONE));
  return [{id:NONE,text:"Никто",number:0},...roster.map((p,i)=>({id:p.socioId,text:p.name,number:i+1,p})).filter(o=>o.p!==r&&!used.has(o.id)&&(!t||norm(o.text).includes(t)||String(o.number).startsWith(t)))];
 };
 const resolve=(options,term)=>{
  const t=norm(term);if(!t)return null;
  if(["0","никто","никого"].includes(t))return options[0];
  const pupils=options.filter(o=>o.id!==NONE),exact=pupils.filter(o=>norm(o.text)===t);
  if(exact.length===1)return exact[0];
  const numbered=pupils.find(o=>String(o.number)===t);if(numbered)return numbered;
  return pupils.length===1?pupils[0]:null;
 };
 let pendingFocus=null;
 function picks(r,q,ids){const a=values(r,q);return [...new Set(a.filter(x=>x&&x!==NONE&&x!==r.socioId&&ids.has(x)))]}
 const answered=(r,q,ids)=>!absent(r)&&(values(r,q).includes(NONE)||picks(r,q,ids).length>0);
 const done=(r,ids)=>Q.filter((_,q)=>!absent(r)&&padded(r,q).every(id=>id===NONE||Boolean(id&&id!==r.socioId&&ids.has(id)))).length;
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
  const options=ctx.rows.map((p,i)=>roster.includes(p)?'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+(roster.indexOf(p)+1)+'. '+esc(p.name)+(absent(p)?" (отсутствовал)":"")+'</option>':"").join("");
  const cards=active&&!absent(r)?Q.map((q,i)=>{
   const a=padded(r,i),slots=a.length;
   const fields=a.map((val,j)=>{
    const inputId="psyThreeInput"+i+"_"+j,optionId="psyThreeOptions"+i+"_"+j;
    const display=val===NONE?"Никто":roster.find(p=>p.socioId===val)?.name||"";
    return '<div class="psy-socio-pick"><label for="'+inputId+'">'+(j+1)+' выбор</label><div class="psy-socio-combo" data-three-q="'+i+'" data-three-slot="'+j+'"><input id="'+inputId+'" class="psy-socio-typeahead" type="text" autocomplete="off" spellcheck="false" maxlength="120" placeholder="Имя или номер" value="'+esc(display)+'" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="'+optionId+'" data-selected="'+esc(val)+'"><button type="button" class="psy-socio-drop" aria-label="Показать список учеников"><span aria-hidden="true">⌄</span></button><div id="'+optionId+'" class="psy-socio-options" role="listbox" hidden></div></div><button type="button" class="psy-socio-pick-clear" data-three-clear="'+i+':'+j+'">Очистить выбор</button></div>';
   }).join("");
   return '<section class="psy-socio-question is-positive"><div class="psy-socio-question-heading"><span class="psy-socio-number">'+(i+1)+'</span><h4>'+esc(q)+'<small class="psy-socio-question-type">Положительный выбор</small></h4><span class="psy-socio-question-status '+(a.every(Boolean)?"is-ready":"is-pending")+'">'+(a.every(Boolean)?"Заполнено":a.some(Boolean)?"Частично":"Не заполнено")+'</span></div><div class="psy-socio-picks">'+fields+'</div><div class="psy-socio-question-bottom"><button type="button" class="psy-socio-none-fill" data-three-fill="'+i+'">Остальные – никто</button>'+(slots<roster.length-1?'<button type="button" class="btn" data-three-add="'+i+'">Добавить выбор</button>':"")+'<button type="button" class="btn" data-three-nextq="'+i+'">'+(i<2?"Следующий вопрос":"К следующему ученику")+'</button></div></section>';
  }).join(""):"";
  return '<section class="psy-new-work psy-socio psy-socio-vika"><div class="psy-socio-intro"><h3>Социометрия – 3 вопроса</h3><p>Введите имя или номер ученика из списка и нажмите Enter. 0 или «Никто» заполняет оставшиеся пустые поля этого вопроса. После последнего выбора курсор переходит к следующему вопросу.</p></div><div class="psy-socio-roster"><div class="psy-socio-roster-head"><strong>Состав класса</strong><span>'+roster.length+' учеников</span></div><details class="psy-socio-add" '+(!roster.length?"open":"")+'><summary>Добавить учеников списком</summary><textarea id="psyThreeNames" rows="4" placeholder="Ученик 01&#10;Ученик 02"></textarea><div class="class-actions"><button type="button" class="btn primary" id="psyThreeAdd">Добавить в класс</button></div></details><div id="psyThreeMessage" role="status" class="psy-socio-message"></div>'+(roster.length?'<div class="psy-socio-student-picker"><label>Выбранный ученик<select id="psyThreePerson">'+options+'</select></label></div>':"")+'</div>'+(active?'<div class="psy-vika-student-head"><div><strong>'+esc(r.name)+'</strong><span>'+done(r,ids)+' из 3 вопросов заполнено</span></div><button type="button" class="btn" id="psyThreeAbsent">'+(absent(r)?"Вернуть к обследованию":"Отметить: отсутствовал")+'</button></div>':"")+(cards?'<div class="psy-socio-questions">'+cards+'</div>':active?'<p>Ученик отсутствовал. Его ответы не удалены.</p>':'<p>Добавьте состав класса.</p>')+(active?'<div class="class-actions"><label>Выбрать ученика<select id="psyThreeBottom">'+options+'</select></label><button type="button" class="btn primary" id="psyThreeNext">Следующий ученик</button></div>':"")+table(ctx.rows)+'</section>';
 }
 function csv(rows,results){
  const {roster,ids,counts}=tally(rows),byId=new Map(roster.map(p=>[p.socioId,p.name]));
  const lines=results?[["Ученик",...short,"Всего выборов","Ответы"],...roster.map(r=>{const a=counts.get(r.socioId);return [r.name,...a,a.reduce((x,y)=>x+y,0),absent(r)?"Отсутствовал":done(r,ids)+"/3"]})]:[["Ученик","Статус","Вопрос","Выборы"],...roster.flatMap(r=>Q.map((q,i)=>[r.name,absent(r)?"Отсутствовал":answered(r,i,ids)?"Ответ внесен":"Не заполнено",q,picks(r,i,ids).length?picks(r,i,ids).map(id=>byId.get(id)).join("; "):values(r,i).includes(NONE)?"Никто":""]))];
  const safe=x=>{let t=String(x??"");if(/^\s*[=+@-]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"'};
  return "\uFEFF"+lines.map(r=>r.map(safe).join(";")).join("\r\n");
 }
 function download(rows,result){const a=document.createElement("a"),url=URL.createObjectURL(new Blob([csv(rows,result)],{type:"text/csv;charset=utf-8"}));a.href=url;a.download="Метолария_социометрия_3_"+(result?"результаты":"ответы")+".csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)}
 function bind(d,ctx){
  if(ctx.calcMode!=="class")return;
  const row=ctx.rows[ctx.rowIndex],on=(id,event,fn)=>document.getElementById(id)?.addEventListener(event,fn),rerender=()=>{dirty();ctx.onSelect?.(ctx.rowIndex)},msg=t=>{const el=document.getElementById("psyThreeMessage");if(el)el.textContent=t};
  on("psyThreeAdd","click",()=>{const names=(document.getElementById("psyThreeNames")?.value||"").split(/[\r\n;]+/).map(x=>x.trim()).filter(Boolean);if(names.length)ctx.onBulkAdd?.(names)});
  ["psyThreePerson","psyThreeBottom"].forEach(id=>on(id,"change",e=>{const i=Number(e.target.value);if(!absent(ctx.rows[i]))pendingFocus={q:0,j:Math.max(0,padded(ctx.rows[i],0).findIndex(x=>!x))};ctx.onSelect?.(i)}));
  const roster=()=>people(ctx.rows);
  const focus=(q,j)=>{const input=document.getElementById("psyThreeInput"+q+"_"+j);if(input){input.scrollIntoView?.({block:"center"});input.focus({preventScroll:true});input.select?.()}};
  const focusNextButton=()=>document.getElementById("psyThreeNext")?.focus({preventScroll:false});
  const firstEmpty=(q)=>Math.max(0,padded(row,q).findIndex(x=>!x));
  const nextPupil=()=>{for(let k=1;k<ctx.rows.length;k++){const i=(ctx.rowIndex+k)%ctx.rows.length,p=ctx.rows[i];if(p?.name?.trim()&&!absent(p)){pendingFocus={q:0,j:Math.max(0,padded(p,0).findIndex(x=>!x))};ctx.onSelect?.(i);return}}msg("Других присутствующих учеников нет.")};
  on("psyThreeNext","click",nextPupil);
  on("psyThreeAbsent","click",()=>{if(row){row.socioThreeAbsent=!absent(row);rerender()}});
  const put=(q,a,where)=>{if(!Array.isArray(row.socioThreeAnswers))row.socioThreeAnswers=[];row.socioThreeAnswers[q]=a;pendingFocus=where||null;rerender()};
  const advance=(q,j,a)=>{
   for(let k=j+1;k<a.length;k++)if(!a[k])return {q,j:k};
   for(let k=0;k<a.length;k++)if(!a[k])return {q,j:k};
   for(let offset=1;offset<3;offset++){const n=(q+offset)%3,empty=padded(row,n).findIndex(x=>!x);if(empty>=0)return {q:n,j:empty}}
   return {next:true};
  };
  document.querySelectorAll("[data-three-add]").forEach(b=>b.addEventListener("click",()=>{if(!row||absent(row))return;const q=Number(b.dataset.threeAdd),a=padded(row,q);if(a.length<roster().length-1){a.push("");put(q,a,{q,j:a.length-1})}}));
  document.querySelectorAll("[data-three-fill]").forEach(b=>b.addEventListener("click",()=>{if(!row||absent(row))return;const q=Number(b.dataset.threeFill),a=padded(row,q).map(x=>x||NONE);put(q,a,advance(q,a.length-1,a))}));
  document.querySelectorAll("[data-three-nextq]").forEach(b=>b.addEventListener("click",()=>{const q=Number(b.dataset.threeNextq);if(q<2)focus(q+1,firstEmpty(q+1));else nextPupil()}));
  document.querySelectorAll("[data-three-clear]").forEach(b=>b.addEventListener("click",()=>{if(!row||absent(row))return;const [q,j]=b.dataset.threeClear.split(":").map(Number),a=padded(row,q);a[j]="";put(q,a,{q,j})}));
  const combos=[...document.querySelectorAll(".psy-socio-combo[data-three-q]")];
  const close=c=>{c.querySelector(".psy-socio-options").hidden=true;c.querySelector("input").setAttribute("aria-expanded","false");c.classList.remove("is-open")};
  combos.forEach(c=>{
   const input=c.querySelector("input"),panel=c.querySelector(".psy-socio-options"),q=Number(c.dataset.threeQ),j=Number(c.dataset.threeSlot);
   let highlighted=-1;
   const options=term=>candidates(roster(),row,q,j,term);
   const commit=id=>{
    if(!row||absent(row)||!options("").some(o=>o.id===id))return;
    const a=padded(row,q),replacing=Boolean(a[j])&&a[j]!==NONE;a[j]=id;
    if(id===NONE)for(let k=j+1;k<a.length;k++)if(!a[k])a[k]=NONE;
    put(q,a,replacing?{q,j}:advance(q,j,a));
   };
   const draw=term=>{
    combos.forEach(x=>{if(x!==c)close(x)});panel.replaceChildren();highlighted=-1;
    const opts=options(term);
    opts.forEach(o=>{const b=document.createElement("button");b.type="button";b.className="psy-socio-option"+(o.id===NONE?" is-nobody":"");b.setAttribute("role","option");b.textContent=o.id===NONE?"Никто (0)":o.number+". "+o.text;b.dataset.threeId=o.id;b.addEventListener("mousedown",e=>e.preventDefault());b.addEventListener("click",()=>commit(o.id));panel.append(b)});
    panel.hidden=false;input.setAttribute("aria-expanded","true");c.classList.add("is-open");
   };
   input.addEventListener("focus",()=>{input.select();draw("")});
   input.addEventListener("input",()=>draw(input.value));
   input.addEventListener("blur",()=>{const id=padded(row,q)[j];input.value=id===NONE?"Никто":roster().find(p=>p.socioId===id)?.name||"";close(c)});
   c.querySelector(".psy-socio-drop").addEventListener("click",()=>{if(panel.hidden){input.focus();draw("")}else close(c)});
   input.addEventListener("keydown",e=>{
    if(e.key==="Escape"){close(c);return}
    if(e.key==="ArrowDown"||e.key==="ArrowUp"){
     e.preventDefault();if(panel.hidden)draw(input.value);
     const bs=[...panel.querySelectorAll("button")];if(!bs.length)return;
     highlighted=(highlighted<0?(e.key==="ArrowDown"?0:bs.length-1):(highlighted+(e.key==="ArrowDown"?1:-1)+bs.length)%bs.length);
     bs.forEach((b,k)=>{b.setAttribute("aria-selected",String(k===highlighted));b.style.outline=k===highlighted?"2px solid currentColor":""});bs[highlighted].scrollIntoView?.({block:"nearest"});return;
    }
    if(e.key==="Enter"||e.key==="Tab"&&input.value.trim()&&input.value!== (input.dataset.selected===NONE?"Никто":roster().find(p=>p.socioId===input.dataset.selected)?.name||"")){
     e.preventDefault();const bs=[...panel.querySelectorAll("button")],choice=highlighted>=0&&!panel.hidden?{id:bs[highlighted]?.dataset.threeId}:resolve(options(input.value),input.value);
     if(choice?.id){commit(choice.id)}else{msg("Уточните имя или номер ученика либо введите 0 – Никто.");draw(input.value)}
    }
   });
  });
  if(pendingFocus){const p=pendingFocus;pendingFocus=null;requestAnimationFrame(()=>p.next?focusNextButton():focus(p.q,p.j))}
  on("psyThreeCSV","click",()=>download(ctx.rows,false));on("psyThreeResultsCSV","click",()=>download(ctx.rows,true));on("psyThreeSave","click",()=>ctx.onSave?.());
 }
 function blank(){return '<section class="psy-new-print psy-socio-print"><h3>Социометрия – 3 вопроса</h3><p>Класс: __________ Дата: __________ Имя или код: __________</p><p>Не выбирай себя. Укажи одноклассников или напиши «Никто».</p>'+Q.map((q,i)=>'<div class="psy-socio-print-q"><strong>'+(i+1)+'. '+esc(q)+'</strong><p>1. __________________________</p><p>2. __________________________</p><p>3. __________________________</p><p>Другие: __________________________</p></div>').join("")+'</section>'}
 api.calculator=(d,ctx)=>isThree(d)?calculator(d,ctx):original.calculator(d,ctx);
 api.bind=(d,ctx)=>isThree(d)?bind(d,ctx):original.bind(d,ctx);
 api.materials=(d,...a)=>isThree(d)?blank():original.materials(d,...a);
 api.instruction=(d,...a)=>isThree(d)?'<h3>Инструкция</h3><p>Не выбирай себя. Ответы конфиденциальны.</p><ol>'+Q.map(q=>'<li>'+esc(q)+'</li>').join("")+'</ol><p>Подсчитываются полученные выборы по каждому вопросу и их сумма.</p>':original.instruction(d,...a);
 api.processing=(d,...a)=>isThree(d)?'<h3>Обработка</h3><p>Полученные выборы подсчитываются отдельно по каждому вопросу. Сумма – количество номинаций во всех трех ситуациях.</p>':original.processing(d,...a);
 api.score=(d,...a)=>isThree(d)?null:original.score?.(d,...a);
 window.PSY_SOCIO_THREE={questions:Q.slice(),tally,csv,version:ID,candidates,resolve,padded};
})();