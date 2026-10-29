"use strict";
(function(){
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const supported=d=>d?.workflow==="semester2026"||d?.workflow==="phillips58";
 function limits(d){return d.workflow==="phillips58"?{max:1,count:58}:{max:d.options.length-1,count:d.questions.length}}
 const answered=(a,max)=>Array.isArray(a)?a.filter(v=>v!==null&&v!==undefined&&v!==""&&(max===1?["yes","no",0,1,"0","1"].includes(v):!Number.isNaN(Number(v))&&Number(v)>=0&&Number(v)<=max)).length:0;
 function enhance(d,ctx){
  if(!supported(d)||ctx.tab!=="score")return;
  const grid=document.querySelector(d.workflow==="phillips58"?".psy-ph-grid":".psy-semester-grid");
  if(!grid)return;
  const max=limits(d).max;
  grid.insertAdjacentHTML("beforebegin",'<p class="psy-entry-keyboard-hint">Быстрый ввод с клавиатуры: <kbd>0</kbd>-<kbd>'+max+'</kbd>'+(d.workflow==="phillips58"?" (0 – Нет, 1 – Да)":"")+'; ответ сразу переводит к следующему вопросу. <kbd>Backspace</kbd> очищает ответ; <kbd>←</kbd> / <kbd>→</kbd> перемещают между вопросами. Можно вставить последовательность цифр.</p>');
  if(d.workflow==="phillips58"){
   const footer=document.querySelector("#modal .psy-standard-footer");
   if(footer&&!document.getElementById("psyEntryFooter")){footer.classList.add("psy-semester-footer");footer.insertAdjacentHTML("afterbegin",'<span class="psy-semester-status is-pending" id="psyEntryFooter">Ответы не заполнены полностью</span>');}
  }
  if(ctx.calcMode!=="class")return;
  const r=ctx.rows[ctx.rowIndex],status=r?.attendance==="absent";
  const target=document.querySelector(".group-tools")||grid;
  const current=ctx.rowIndex+1,all=ctx.rows.length,ready=ctx.rows.filter(x=>x.attendance!=="absent").length;
  const html='<section class="psy-entry-roster" aria-label="Учет учеников">'+
   '<div class="psy-entry-roster-head"><strong>Ученик '+current+' из '+all+'</strong><span>Присутствуют: '+ready+' · Отсутствуют: '+(all-ready)+'</span></div>'+
   '<div class="psy-entry-roster-actions">'+
   '<button type="button" class="btn" id="psyPreviousChild">← Предыдущий</button>'+
   '<button type="button" class="btn" id="psyNextChild">Следующий присутствующий →</button>'+
   '<button type="button" class="btn" id="psySkipChild">Пропустить сейчас →</button>'+
   '<button type="button" class="btn '+(status?"primary":"")+'" id="psyAbsentChild" aria-pressed="'+status+'">'+(status?"Вернуть в список присутствующих":"Отсутствовал – следующий")+'</button>'+
   '</div>'+
   (status?'<p class="psy-entry-absent-notice">Ученик отмечен отсутствующим. Результат не вычисляется и не включается в сводный отчет.</p>':
           '<p class="psy-entry-presence">Для отсутствующего нажми «Отсутствовал – следующий». Он останется в списке, но не попадет в результаты. «Пропустить сейчас» не меняет статус.</p>')+
   '<details class="psy-entry-bulk"><summary>Добавить список учеников</summary><label>Условные коды, каждый с новой строки<textarea id="psyRosterCodes" rows="4" placeholder="У-01&#10;У-02&#10;У-03" maxlength="15000"></textarea></label><button type="button" class="btn" id="psyRosterAdd">Добавить в класс</button><p>Не вводите ФИО. Список хранится только в открытом сеансе, скачайте CSV до закрытия страницы.</p></details>'+
   '<div class="psy-entry-roster-msg" id="psyRosterMessage" role="status" aria-live="polite"></div>'+
   '</section>';
  target.insertAdjacentHTML("afterend",html);
  const roster=document.querySelector(".psy-entry-roster");
  if(roster&&grid.parentNode&&document.createElement){
   const layout=document.createElement("div");layout.className="psy-class-scoring-layout";
   grid.parentNode.insertBefore(layout,grid);layout.appendChild(roster);layout.appendChild(grid);
  }
  const select=document.getElementById("participantSelect");
  if(select)Array.from(select.options).forEach((o,i)=>{if(ctx.rows[i]?.attendance==="absent")o.textContent+=" (отсутствует)"});
  if(status){grid.querySelectorAll("select, input").forEach(e=>e.disabled=true);grid.classList.add("psy-entry-disabled");}
 }
 function syncFooter(d,ctx){
  const indicator=document.getElementById("psyEntryFooter");if(!indicator)return;
  const r=ctx.rows?.[ctx.rowIndex]||{answers:[]},absent=r.attendance==="absent";
  const ready=!absent&&!!window.PSY_PHILLIPS?.score(d,r.answers);
  indicator.classList.toggle("is-complete",ready);
  indicator.classList.toggle("is-skipped",absent);
  indicator.classList.toggle("is-pending",!absent&&!ready);
  indicator.textContent=absent?"Отсутствовал":ready?"Обработка готова":"Ответы не заполнены полностью";
 }
 function bind(d,ctx){
  if(!supported(d)||ctx.tab!=="score")return;
  const {max,count}=limits(d),selector=d.workflow==="phillips58"?"[data-ph-answer]":"[data-sanswer]";
  const fields=[...document.querySelectorAll(selector)];
  const row=ctx.rows[ctx.rowIndex];
  const absent=row?.attendance==="absent";
  const setField=(field,value)=>{
   if(!field||field.disabled)return;
   field.value=value;
   field.dispatchEvent(new Event("change",{bubbles:true}));
  };
  const focusIndex=index=>{if(index>=0&&index<fields.length&&!fields[index].disabled){fields[index].focus();}};
  const firstMissing=()=>fields.findIndex(x=>x.value==="");
  fields.forEach((el,i)=>{
   el.addEventListener("keydown",e=>{
    if(e.altKey||e.ctrlKey||e.metaKey||e.isComposing)return;
    if(e.key.length===1&&/^[0-9]$/.test(e.key)){
     e.preventDefault();
     if(Number(e.key)>max)return;
     const answer=e.key;
     setField(el,answer);
     if(i<fields.length-1)focusIndex(i+1);
     else document.getElementById("psyNextChild")?.focus();
    }else if(e.key==="Backspace"||e.key==="Delete"){
     e.preventDefault();
     if(el.value!=="")setField(el,"");
     else focusIndex(i-1);
    }else if(e.key==="ArrowRight"||e.key==="Enter"){
     e.preventDefault();focusIndex(i+1);
    }else if(e.key==="ArrowLeft"){e.preventDefault();focusIndex(i-1);}
   });
   el.addEventListener("paste",e=>{
    const pasted=e.clipboardData?.getData("text")||"";
    if(!pasted||!/^[0-9\s,;]+$/.test(pasted))return;
    const numbers=pasted.replace(/[\s,;]/g,"").split("");
    if(numbers.some(n=>Number(n)>max))return;
    e.preventDefault();
    numbers.forEach((v,k)=>{const index=i+k;if(index>=count)return;setField(fields[index],v)});
    focusIndex(Math.min(i+numbers.length,count-1));
   });
  });
  if(d.workflow==="phillips58"){
   fields.forEach(el=>el.addEventListener("change",()=>syncFooter(d,ctx)));
   document.getElementById("phClear")?.addEventListener("click",()=>syncFooter(d,ctx));
   syncFooter(d,ctx);
  }
  if(ctx.calcMode!=="class")return;
  const message=s=>{const el=document.getElementById("psyRosterMessage");if(el)el.textContent=s;};
  const navigate=(direction,includeAbsent)=>{
   let target=ctx.rowIndex+direction;
   while(target>=0&&target<ctx.rows.length&&(!includeAbsent&&ctx.rows[target]?.attendance==="absent"))target+=direction;
   if(target<0||target>=ctx.rows.length){message(direction>0?"Дальше присутствующих учеников нет. Можно выбрать любого из списка или добавить новые коды.":"Это первый подходящий ученик.");return false;}
   ctx.selectRow(target);
   return true;
  };
  document.getElementById("psyPreviousChild")?.addEventListener("click",()=>navigate(-1,false));
  document.getElementById("psyNextChild")?.addEventListener("click",()=>navigate(1,false));
  document.getElementById("psySkipChild")?.addEventListener("click",()=>navigate(1,true));
  document.getElementById("psyAbsentChild")?.addEventListener("click",()=>{
   if(!row)return;
   if(row.attendance==="absent"){row.attendance="present";ctx.rerender();return;}
   if(answered(row.answers,max)>0&&!confirm("У этого ученика уже есть ответы. Сохранить их, но исключить из обработки как отсутствующего?"))return;
   row.attendance="absent";
   if(!navigate(1,false))ctx.rerender();
  });
  document.getElementById("psyRosterAdd")?.addEventListener("click",()=>{
   const input=document.getElementById("psyRosterCodes");
   const proposed=(input?.value||"").split(/[\n;,]+/).map(x=>x.trim()).filter(Boolean);
   if(!proposed.length){message("Добавь хотя бы один условный код.");return;}
   if(proposed.length>300||proposed.some(s=>s.length>40)){message("Не более 300 кодов длиной до 40 символов за раз.");return;}
   const existing=new Set(ctx.rows.map(r=>(r.name||"").toLocaleLowerCase("ru")));
   let added=0;
   let emptyFirst=ctx.rows.length===1&&!ctx.rows[0].name?.trim()&&
      ctx.rows[0].attendance!=="absent"&&answered(ctx.rows[0].answers,max)===0;
   let firstIndex=-1;
   for(const code of proposed){
    if(existing.has(code.toLocaleLowerCase("ru")))continue;
    existing.add(code.toLocaleLowerCase("ru"));
    if(emptyFirst){ctx.rows[0].name=code;ctx.rows[0].attendance="present";emptyFirst=false;if(firstIndex<0)firstIndex=0;}
    else{ctx.rows.push({name:code,answers:[],attendance:"present"});if(firstIndex<0)firstIndex=ctx.rows.length-1;}
    added++;
   }
   if(!added){message("Такие коды уже есть в списке.");return;}
   ctx.selectRow(firstIndex);
  });
 }
 window.PSY_CLASS_ENTRY_2026={enhance,bind};
})();
/* CDI form and T-scores bundled here to avoid Timeweb HTML fallback on a missing script path. */
"use strict";
(function(){
 const orig=window.PSY_SEMESTER_2026, norms=window.PSY_CDI_NORMS_2026;
 if(!orig||!norms)return;
 const esc=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
 const current=d=>d?.id==="cdi-27";
 const d=window.PSY_FULL_METHODS?.["Опросник детской депрессии М. Ковач (CDI)"];
 if(d){
  d.age="7-17 лет (27-пунктная версия предоставленного PDF)";
  d.indicators=[]; // CDI is scored as one total scale; do not invent subscales.
  d.sourceDescription="Предоставленный пользователем PDF «Опросник детской депрессии», 8 страниц. Нормативная таблица – страницы 6-8.";
  d.scoring="Сумма закодированных ответов на 27 пунктов (0, 1 или 2), диапазон 0-54. Для Т-балла укажите пол и возраст 7-17 лет. Таблица в PDF имеет несогласованность для мальчиков 7-12 лет при сумме 27-28, поэтому результат не подменяется догадкой.";
  d.interpret="Основной показатель – общий балл. Интервалы Т-баллов берутся из предоставленной таблицы и описывают отклонение от среднего, но не являются диагнозом.";
 }
 const existing=orig.calculator, oldBind=orig.bind, oldInstructions=orig.instruction, oldProcessing=orig.processing, oldMaterials=orig.materials, oldCsv=orig.csv;
 const norm=(raw,r)=>norms.norm(raw,r.ageYears,r.sex);
 const score=(r)=>r?.attendance==="absent"?null:orig.score(d,r?.answers||[],r);
 function diagnosis(r){
  const z=score(r);if(r?.attendance==="absent")return '<div class="psy-semester-status is-skipped">Отсутствовал – результат не рассчитывается</div>';
  if(!z)return '<div class="psy-semester-status is-pending">Заполнено '+orig.count(orig.methods[0],r.answers||[])+' из 27</div><p>Все 27 ответов нужны для подсчета. Незаполненный пункт не равен 0.</p>';
  const n=norm(z.raw,r),pct=Math.round(z.raw/54*100);
  return '<div class="psy-semester-status is-complete">Обработка готова</div>'+
   '<div class="psy-cdi-overall"><div><span>Сырой балл</span><strong>'+z.raw+' / 54</strong></div><div><span>Т-балл</span><strong>'+(n.status==="ok"?n.t:"–")+'</strong></div></div>'+
   '<div class="psy-cdi-scale"><span style="width:'+pct+'%"></span></div>'+
   '<p class="psy-cdi-context">'+esc(n.status==="ok"?n.level:n.message)+'</p>'+
   '<p class="psy-mspss-small">Пункт 9 необходимо сверять по исходному тексту: цифровой балл не определяет наличие суицидальных мыслей.</p>'+
   '<p class="psy-semester-muted">Баллы и категория не заменяют клиническую оценку. Для сравнения нужны нормы именно этой версии.</p>';
 }
 function classTable(rows){
  return '<div class="psy-semester-table"><table><thead><tr><th>Ученик</th><th>Статус</th><th>Сырой</th><th>Т-балл</th></tr></thead><tbody>'+
   rows.map((r,i)=>{const z=score(r),n=z?norm(z.raw,r):null;return '<tr><td>'+esc(r.name||"У-"+(i+1))+'</td><td>'+esc(r.attendance==="absent"?"Отсутствовал":z?"Обработан":"Не заполнено")+'</td><td>'+(z?z.raw+" / 54":"–")+'</td><td>'+(n?.status==="ok"?n.t:"–")+'</td></tr>'}).join("")+'</tbody></table></div>';
 }
 function calculator(data,ctx){
  if(!current(data))return existing(data,ctx);
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],a=r.answers||[];
  let h='<section class="psy-semester psy-cdi-ui"><div class="calc-mode"><button type="button" class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button type="button" class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
  if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Ученик <select id="participantSelect">'+rows.map((u,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(u.name||"У-"+(i+1))+'</option>').join("")+'</select></label><label>Условный код<input type="text" id="participantName" maxlength="40" value="'+esc(r.name||"")+'" placeholder="У-01"></label><button type="button" class="btn" id="addParticipant">Добавить</button></div>';
  else h+='<p class="psy-semester-muted">Ответы обрабатываются только в вашем браузере. Для класса используйте условные коды, а не персональные данные.</p>';
  h+='<p class="psy-cdi-note"><b>Версия из предоставленного PDF.</b> Вносите балл <b>0, 1 или 2</b>, напечатанный рядом с выбранным ребенком утверждением. Номер строки ответа сам по себе не равен баллу.</p>';
  h+='<div class="psy-cdi-demographics"><label>Возраст ребенка, полных лет<select id="cdiAge"><option value="">Выберите возраст</option>'+Array.from({length:11},(_,i)=>i+7).map(n=>'<option value="'+n+'" '+(Number(r.ageYears)===n?"selected":"")+'>'+n+'</option>').join("")+'</select></label><label>Пол для таблицы Т-баллов<select id="cdiSex"><option value="">Выберите</option><option value="m" '+(r.sex==="m"?"selected":"")+'>Мальчик</option><option value="f" '+(r.sex==="f"?"selected":"")+'>Девочка</option></select></label></div>';
  h+='<div class="psy-semester-grid">'+norms.items.map((title,i)=>'<label class="psy-semester-item"><span><b>'+(i+1)+'.</b> '+esc(title)+'</span><input type="text" inputmode="numeric" maxlength="1" autocomplete="off" data-sanswer="'+i+'" aria-label="Баллы по пункту '+(i+1)+'" placeholder="0-2" value="'+esc(a[i]??"")+'"></label>').join("")+'</div>';
  h+='<div id="semesterResult">'+diagnosis(r)+'</div><div class="psy-semester-actions"><button type="button" class="btn" id="semesterClear">Очистить ответы</button><button type="button" class="btn primary" id="semesterExport" '+(score(r)?"":"disabled")+'>Скачать протокол</button></div>';
  if(ctx.calcMode==="class")h+='<h3>Результаты класса</h3><div id="semesterGroup">'+classTable(rows)+'</div><div class="psy-semester-actions"><button type="button" class="btn primary" id="semesterCSV">Скачать CSV класса</button></div>';
  return h+'</section>';
 }
 function download(name,body,mime){const url=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 function makeCsv(rows){
  const vals=[["Условный код","Статус","Возраст","Пол","Сырой балл","Т-балл",...Array.from({length:27},(_,i)=>"Пункт "+(i+1))],...rows.map((r,i)=>{const z=score(r),n=z?norm(z.raw,r):null;return [r.name||"У-"+(i+1),r.attendance==="absent"?"Отсутствовал":z?"Обработан":"Не заполнено",r.ageYears??"",r.sex==="m"?"Мальчик":r.sex==="f"?"Девочка":"",z?.raw??"",n?.t??"",...Array.from({length:27},(_,j)=>r.attendance==="absent"?"":r.answers?.[j]??"")]})];
  const cell=x=>{let s=String(x??"");if(/^\s*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};return "\uFEFF"+vals.map(r=>r.map(cell).join(";")).join("\r\n");
 }
 function bind(data,ctx){
  if(!current(data))return oldBind(data,ctx);
  const r=ctx.rows[ctx.rowIndex];if(!r)return;r.answers ||= [];
  const update=()=>{
   const e=document.getElementById("semesterResult");if(e)e.innerHTML=diagnosis(r);
   const g=document.getElementById("semesterGroup");if(g)g.innerHTML=classTable(ctx.rows);
   const ex=document.getElementById("semesterExport");if(ex)ex.disabled=!score(r);
   orig.syncFooter(data,ctx.rows,ctx.rowIndex);
  };
  document.querySelectorAll("[data-sanswer]").forEach(el=>el.addEventListener("change",()=>{r.answers[Number(el.dataset.sanswer)]=/^[012]$/.test(el.value)?Number(el.value):null;update()}));
  document.getElementById("cdiAge")?.addEventListener("change",e=>{r.ageYears=e.target.value?Number(e.target.value):null;update()});
  document.getElementById("cdiSex")?.addEventListener("change",e=>{r.sex=e.target.value;update()});
  document.getElementById("semesterClear")?.addEventListener("click",()=>{if(r.answers.some(x=>x!==null&&x!==undefined&&x!=="")&&!confirm("Очистить ответы ученика?"))return;r.answers=[];ctx.rerender?.()});
  document.getElementById("semesterExport")?.addEventListener("click",()=>{
   const z=score(r);if(!z)return;const n=norm(z.raw,r);
   const text=["Опросник детской депрессии М. Ковач (CDI, 27 пунктов)","Условный код: "+(r.name||"не задан"),"Возраст: "+(r.ageYears??"не указан"),"Сырой балл: "+z.raw+" / 54","Т-балл: "+(n.t??"нет в таблице"),n.message,"Пункт 9: "+r.answers[8]+" (оценить выбранное утверждение по оригинальному тексту; балл не означает конкретный ответ)","Основа: PDF, предоставленный пользователем. Не является диагнозом."].join("\n");
   const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>@page{size:A4;margin:16mm}body{font:12pt/1.5 Arial;white-space:pre-wrap;color:#23382f}</style></head><body>'+esc(text)+'</body></html>';
   download("Metolaria_CDI_27_protocol.html",html,"text/html;charset=utf-8");
  });
  document.getElementById("semesterCSV")?.addEventListener("click",()=>download("Metolaria_CDI_27_class.csv",makeCsv(ctx.rows),"text/csv;charset=utf-8"));
 }
 orig.calculator=calculator;orig.bind=bind;
 orig.csv=(data,rows)=>current(data)?makeCsv(rows):oldCsv(data,rows);
 orig.processing=data=>current(data)?'<h3>Обработка по предоставленному PDF</h3><p>Сложите 27 уже закодированных ответов (0-2), максимальная сумма 54. Для Т-балла укажите пол и полный возраст в годах. Таблица 7-12 и 13-17 лет представлена на страницах 6-8 PDF.</p><p>Т-баллы: 45-55 – средний интервал; 56-60 – чуть выше; 61-65 – выше; 66-70 – значительно выше; свыше 70 – группа риска согласно таблице источника. Это не диагноз.</p><p>На страницах 6-8 PDF для мальчиков 7-12 лет сырым 27 и 28 соответствуют Т-баллы 73 и 72 соответственно (обратный порядок). Из-за внутренней несогласованности программа не рассчитывает эти два значения.</p><p>Положительный ответ на пункт 9 требует отдельного внимания специалиста независимо от общего результата.</p>':oldProcessing(data);
 orig.instruction=data=>current(data)?'<h3>Цель</h3><p>Оценка выраженности депрессивных симптомов у детей 7-17 лет.</p><h3>Инструкция</h3><p>Предъявите оригинальный бланк из загруженного PDF, поясните выбор одного из трех утверждений в каждом пункте. Оценка касается последних двух недель. Для младших детей при необходимости зачитывают инструкцию и пункты.</p><h3>Ключ и нормы</h3><p>Напротив каждого утверждения в PDF указан балл 0, 1 или 2. Сложите все 27 баллов. Для Т-баллов используется таблица по возрасту и полу, страницы 6-8. Пункт 27 в представленном тексте требует сверки с исходным изданием, поскольку его формулировки выглядят несогласованными.</p><p>Форма опубликована в пользовательском PDF. Для распространения полного текста необходимо отдельно проверить авторские права.</p>':oldInstructions(data);
 orig.materials=data=>current(data)?'<h3>Лист регистрации ответов</h3><p>В бланке из предоставленного PDF есть полный текст утверждений и баллы рядом с каждым вариантом. Обязательно проверяйте, что переносите в калькулятор именно цифру выбранного утверждения, а не его порядковый номер.</p><p>На странице обработки указаны тематики всех 27 пунктов, но не перепечатан защищенный полный текст опросника.</p><p>Для печати собственного регистрационного листа используйте кнопку «Распечатать А4».</p>':oldMaterials(data);
 window.PSY_CDI_2026={norm,diagnosis,makeCsv,calculator};
})();
/* Bundled MSPSS-matched CDI and Phillips assessment UI */
"use strict";
(function(){
 const semester=window.PSY_SEMESTER_2026,phillips=window.PSY_PHILLIPS,norms=window.PSY_CDI_NORMS_2026;
 if(!semester||!phillips||!norms)return;
 const old={cdiCalc:semester.calculator,cdiGuide:semester.instruction,cdiBlank:semester.materials,phCalc:phillips.calculator,phGuide:phillips.instruction,phBlank:phillips.materials};
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const type=d=>d?.id==="cdi-27"?"cdi":d?.workflow==="phillips58"?"ph":null;
 const max=d=>type(d)==="cdi"?2:1;
 const size=d=>type(d)==="cdi"?27:58;
 const subjects=d=>type(d)==="cdi"?Array(27).fill("Балл по ключу оригинального бланка"):phillips.topics;
 const status=r=>r?.attendance==="absent"?"Отсутствовал":"Присутствует";
 const valid=(v,d)=>type(d)==="cdi"?[0,1,2,"0","1","2"].includes(v):v==="yes"||v==="no";
 function done(d,answers){return Array.from({length:size(d)},(_,i)=>answers?.[i]).filter(v=>valid(v,d)).length;}
 function scoring(d,r){if(!r||r.attendance==="absent")return null;return type(d)==="cdi"?semester.score(d,r.answers||[],r):phillips.score(d,r.answers||[]);}
 function value(d,raw){return type(d)==="ph"?(raw==="yes"?"1":raw==="no"?"0":""):valid(raw,d)?String(raw):"";}
 function interpretation(p){return p>75?"Высокий показатель":p>50?"Повышенный показатель":"Не превышает 50%";}
 function progress(n,total){return '<div class="psy-mspss-track"><span style="width:'+Math.max(0,Math.min(100,n/total*100))+'%"></span></div>';}
 function palette(i){return ["psy-cp-purple","psy-cp-green","psy-cp-blue"][i%3];}
 function result(d,r){
  const n=done(d,r?.answers||[]),total=size(d),z=scoring(d,r);
  if(r?.attendance==="absent")return '<section class="psy-mspss-result psy-cp-absent"><h3>Ученик отсутствовал</h3><p>Ответы сохранены, но результаты не рассчитываются и не входят в сводку класса.</p></section>';
  if(!z)return '<section class="psy-mspss-result"><h3>Заполнено '+n+' из '+total+'</h3>'+progress(n,total)+'<p>После ввода всех ответов появится автоматическая обработка. Пропуск не равен нулевому баллу.</p></section>';
  if(type(d)==="cdi"){
   const t=norms.norm(z.raw,r.ageYears,r.sex);
   return '<section class="psy-mspss-result psy-cdi-single-result"><h3>Общий результат CDI</h3>'+
    '<strong class="psy-mspss-mean">'+z.raw+' <small>/ 54</small></strong>'+
    progress(z.raw,54)+
    '<p><b>Т-балл:</b> '+(t.status==="ok"?'<strong>'+t.t+'</strong> – '+esc(t.level):'не рассчитан – '+esc(t.message))+'</p>'+
    '<p class="psy-mspss-small">Это одна суммарная шкала из 27 пунктов, отдельных баллов по «настроению», «самооценке» и другим областям здесь нет. Результат не является диагнозом.</p>'+
    '<p class="psy-mspss-small">Пункт 9 нужно просматривать по оригинальному тексту отдельно: цифровой код сам по себе не подтверждает и не исключает суицидальные мысли. При их наличии необходима очная оценка безопасности.</p></section>';
  }
  const scaleHtml=z.scales.map((s,i)=>'<div class="'+palette(i)+'"><b>'+esc(s.name)+'</b><strong>'+s.raw+' / '+s.max+' · '+s.percent.toFixed(1)+'%</strong>'+
   progress(s.raw,s.max)+'<small>'+esc(interpretation(s.percent))+'</small></div>').join("");
  return '<section class="psy-mspss-result"><h3>Общая школьная тревожность</h3>'+
   '<strong class="psy-mspss-mean">'+z.raw+' <small>/ 58</small></strong>'+
   '<p>Несовпадения с ключом: <b>'+z.percent.toFixed(1)+'%</b>. Уровень по ключу: <b>'+esc(interpretation(z.percent).toLowerCase())+'</b>.</p>'+
   '<div class="psy-mspss-scales psy-cp-scales">'+scaleHtml+'</div>'+
   '<p class="psy-mspss-small">Восемь факторов пересекаются по пунктам; суммы факторов не складывают. Третий фактор включает 13 вопросов, в том числе № 1.</p></section>';
 }
 const alpha=rows=>rows.slice().sort((a,b)=>(a.name||"").localeCompare(b.name||"","ru",{sensitivity:"base"}));
 const gradeAge=g=>Number.isInteger(Number(g))&&Number(g)>=1&&Number(g)<=11?Number(g)+6:null;
 const classGrade=rows=>rows.find(r=>Number.isInteger(Number(r.schoolGrade))&&Number(r.schoolGrade)>=1&&Number(r.schoolGrade)<=11)?.schoolGrade||null;
 function cdiClassRow(d,r,i){
  const z=scoring(d,r);
  const t=z?norms.norm(z.raw,r.ageYears,r.sex):null;
  return {
   no:i+1,
   name:r.name||"У-"+String(i+1).padStart(2,"0"),
   t:t?.status==="ok"?t.t:"–",
   level:t?.status==="ok"?t.level:"–"
  };
 }
 // Справка: проценты относятся к доле детей в группе, а не к индивидуальным баллам.
 function phillipsStats(d,rows){
  const scores=rows.map(r=>scoring(d,r)).filter(Boolean),total=scores.length;
  const categories=[{name:"Общий показатель (58 вопросов)",values:scores.map(z=>z.percent)},
    ...phillips.scales.map((scale,i)=>({name:scale.name,values:scores.map(z=>z.scales[i].percent)}))];
  return {total,rows:categories.map(item=>{
   const ordinary=item.values.filter(p=>p<=50).length;
   const raised=item.values.filter(p=>p>50&&p<=75).length;
   const high=item.values.filter(p=>p>75).length;
   return {name:item.name,ordinary,raised,high};
  })};
 }
 const classPercent=(count,total)=>total?Math.round(100*count/total)+"%":"0%";
 const phillipsColor=p=>p>75?"high":p>50?"raised":"ordinary";
 const countByLevel=(count,total)=>count+" ("+classPercent(count,total)+")";
 function phillipsClassReference(d,rows){
  const stats=phillipsStats(d,rows);
  if(!stats.total)return '<section class="psy-ph-class-reference"><h3>Справка по классу</h3><p>Для сводки нужно заполнить хотя бы одну анкету полностью.</p></section>';
  const body=stats.rows.map(x=>'<tr><th scope="row">'+esc(x.name)+'</th><td>'+countByLevel(x.ordinary,stats.total)+'</td><td>'+countByLevel(x.raised,stats.total)+'</td><td>'+countByLevel(x.high,stats.total)+'</td></tr>').join("");
  return '<section class="psy-ph-class-reference"><h3>Справка по классу</h3><p>Полностью обработано: <b>'+stats.total+'</b> из '+rows.filter(r=>r.name?.trim()||done(d,r.answers)).length+' участников. В ячейках – число детей и их доля от обработанных анкет.</p>'+
   '<div class="psy-mspss-scroll"><table><thead><tr><th>Показатель</th><th>Не превышает 50%</th><th>Повышенный: свыше 50% до 75%</th><th>Высокий: свыше 75%</th></tr></thead><tbody>'+body+'</tbody></table></div>'+
   '<p class="psy-mspss-small">Это группы по порогам методики Филлипса, а не клинические диагнозы. Отсутствующие и неполные анкеты не учитываются.</p></section>';
 }

 function group(d,rows){
  const ordered=rows.filter(r=>r.name?.trim()||done(d,r.answers));
  const isCDI=type(d)==="cdi";
  if(isCDI){
   const body=ordered.map((r,i)=>{
    const x=cdiClassRow(d,r,i);
    const tone=x.t==="–"?"":x.t>=66?"psy-cdi-tone-high":x.t>=56?"psy-cdi-tone-raised":x.t>=45?"psy-cdi-tone-average":"psy-cdi-tone-low";
    return '<tr><td>'+x.no+'</td><td>'+esc(x.name)+'</td><td class="psy-cdi-tvalue '+tone+'">'+x.t+'</td><td class="psy-cdi-interpretation '+tone+'">'+esc(x.level)+'</td></tr>';
   }).join("");
   return '<section class="psy-mspss-group psy-cdi-class-results"><h3>Результаты класса</h3>'+
    '<div class="psy-mspss-scroll"><table><thead><tr><th>№</th><th>Участник</th><th>Т-балл</th><th>Интерпретация</th></tr></thead><tbody>'+body+'</tbody></table></div></section>';
  }
  const head=phillips.scales.map(scale=>'<th scope="col">'+esc(scale.name+", %")+'</th>').join("");
  const body=ordered.map((r,i)=>{
   const z=scoring(d,r);
   return '<tr><td class="psy-ph-number">'+(i+1)+'</td><td class="psy-ph-name">'+esc(r.name||"У-"+String(i+1).padStart(2,"0"))+'</td>'+
    phillips.scales.map((scale,j)=>{
     if(!z)return '<td class="psy-ph-score"></td>';
     const percent=z.scales[j].percent;
     return '<td class="psy-ph-score psy-ph-tone-'+phillipsColor(percent)+'">'+Math.round(percent)+'</td>';
    }).join("")+'</tr>';
  }).join("");
  return '<section class="psy-mspss-group psy-ph-class-results"><h3>Результаты класса</h3><div class="psy-mspss-scroll"><table><thead><tr><th scope="col">№</th><th scope="col">Участник</th>'+head+'</tr></thead><tbody>'+body+'</tbody></table></div></section>'+phillipsClassReference(d,rows);
 }
 function calculator(d,ctx){
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],a=r.answers||[],n=done(d,a),total=size(d);
  let h='<section class="psy-mspss-calculator psy-cp-calculator"><div class="calc-mode psy-mspss-modes">'+
   '<button type="button" class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button>'+
   '<button type="button" class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
  if(ctx.calcMode==="class"){
   h+='<div class="psy-mspss-workspace"><aside class="psy-mspss-sidebar"><h3>Список учащихся</h3>'+
    (type(d)==="cdi"?'<label class="psy-cp-class-label" for="cpSchoolGrade">Класс<select id="cpSchoolGrade"><option value="">Выбрать класс</option>'+Array.from({length:11},(_,i)=>i+1).map(g=>'<option value="'+g+'" '+(Number(classGrade(rows))===g?"selected":"")+'>'+g+' класс</option>').join("")+'</select><small>Возраст подставится автоматически, его можно уточнить.</small></label>':'')+
    '<p>Добавьте учеников по одному с новой строки. Для конфиденциальности можно использовать условные коды.</p>'+
    '<label class="psy-mspss-label" for="cpBulkNames">Добавить участников</label><textarea id="cpBulkNames" rows="5" placeholder="Ученик 01&#10;Ученик 02"></textarea>'+
    '<button type="button" class="btn primary psy-mspss-add" id="cpAddNames">Добавить в список</button>'+
    '<button type="button" class="btn psy-mspss-sort" id="cpSort">По алфавиту А - Я</button>'+
    '<div class="psy-mspss-person-list">'+rows.map((u,i)=>(u.name?.trim()||done(d,u.answers))?
      '<div class="psy-mspss-person-row '+(type(d)==="cdi"?(u.sex==="f"?"psy-cp-girl":u.sex==="m"?"psy-cp-boy":""):"")+'"><button type="button" class="psy-mspss-person '+(i===ctx.rowIndex?"active":"")+'" data-cp-person="'+i+'"><span>'+esc(u.name||"Участник "+(i+1))+'</span><small>'+(u.attendance==="absent"?"Отсутствует":done(d,u.answers)+"/"+total)+'</small></button>'+
      '<button type="button" class="psy-mspss-delete-person" title="Удалить ученика" aria-label="Удалить '+esc(u.name||"ученика")+'" data-cp-delete="'+i+'">×</button></div>':"").join("")+'</div>'+
    '<button type="button" class="btn psy-mspss-delete-all" id="cpDeleteAll">Удалить всех участников</button></aside><div class="psy-mspss-entry">';
  }else h+='<div class="psy-mspss-entry">';
  h+='<label class="psy-mspss-name-field" for="cpCurrentName"><span>Фамилия и имя / условный код</span><input type="text" id="cpCurrentName" maxlength="120" autocomplete="off" value="'+esc(r.name||"")+'" placeholder="Введите имя или код"></label>';
  if(type(d)==="cdi"&&ctx.calcMode==="class")h+='<div class="psy-cp-current '+(r.sex==="f"?"psy-cp-girl":r.sex==="m"?"psy-cp-boy":"")+'"><span>'+(ctx.rowIndex+1)+' / '+rows.length+'</span><b>'+esc(r.name||"Участник "+(ctx.rowIndex+1))+'</b></div>';
  if(type(d)==="cdi")h+='<div class="psy-cp-demographics"><label>Возраст<select id="cpAge"><option value="">Не выбран</option>'+Array.from({length:11},(_,i)=>i+7).map(age=>'<option value="'+age+'" '+(r.ageYears===age?"selected":"")+'>'+age+'</option>').join("")+'</select></label><div class="psy-cp-sex-field"><span>Пол для Т-балла</span><div class="psy-cp-sex-buttons" role="group" aria-label="Пол ребенка"><button type="button" class="btn psy-cp-sex-btn '+(r.sex==="f"?"is-selected":"")+'" data-cp-sex="f" aria-pressed="'+(r.sex==="f")+'">Девочка</button><button type="button" class="btn psy-cp-sex-btn '+(r.sex==="m"?"is-selected":"")+'" data-cp-sex="m" aria-pressed="'+(r.sex==="m")+'">Мальчик</button></div></div></div>';
  if(type(d)==="cdi")h+='<div class="psy-cdi-student-note psy-cdi-specialist-note"><strong>Только для психолога – ввод баллов</strong><p>Ребенок выбирает ОДНО из трех утверждений в оригинальном опроснике, а не цифру. Здесь вводятся баллы <b>0, 1 или 2</b>, соответствующие выбранному тексту по ключу. Порядок утверждений может отличаться от порядка баллов.</p></div>';
  h+='<p class="psy-mspss-progress" id="cpProgress">Заполнено '+n+' из '+total+'</p>';
  if(r.attendance==="absent")h+='<p class="psy-cp-absence">Ученик отмечен отсутствующим. Ввод заблокирован до возвращения в список присутствующих.</p>';
  h+='<div class="psy-mspss-grid psy-cp-grid">'+subjects(d).map((topic,i)=>{
   const answer=value(d,a[i]),complete=answer!=="";
   return '<label class="psy-mspss-item '+(complete?"is-complete":"is-missing")+'"><span><b>'+(i+1)+'.</b> '+esc(topic)+'</span>'+
    '<input class="psy-mspss-score-input psy-cp-answer" data-cp-answer="'+i+'" type="text" inputmode="numeric" autocomplete="off" maxlength="1" placeholder="'+(type(d)==="cdi"?"0-2":"0-1")+'" aria-label="Пункт '+(i+1)+' – балл" value="'+esc(answer)+'" '+(r.attendance==="absent"?"disabled":"")+'></label>';
  }).join("")+'</div>';
  if(ctx.calcMode==="class"){
   const nextAvailable=(start)=>{for(let step=1;step<rows.length;step++){const j=(start+step)%rows.length;if(rows[j].attendance!=="absent")return j;}return -1;};
   const nextIndex=nextAvailable(ctx.rowIndex);
   const chooser=type(d)==="ph"?'<label class="psy-ph-bottom-chooser" for="cpBottomPerson">Участник <select id="cpBottomPerson" aria-label="Перейти к участнику">'+rows.map((person,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc((i+1)+". "+(person.name||"Участник "+(i+1))+(person.attendance==="absent"?" (отсутствует)":""))+'</option>').join("")+'</select></label>':'';
   h+='<div class="psy-mspss-after-questions psy-cp-next-actions '+(type(d)==="ph"?"psy-ph-bottom-nav":"")+'">'+chooser+
    '<button type="button" class="btn" id="cpAbsent">'+(r.attendance==="absent"?"Вернуть в список присутствующих":"Отсутствовал – следующий")+'</button>'+
    '<button type="button" class="btn primary" id="cpNext" '+(nextIndex<0?"disabled":"")+' >'+(type(d)==="ph"&&nextIndex>=0?"Следующий: "+esc(rows[nextIndex].name||"Участник "+(nextIndex+1))+" →":"Следующий участник →")+'</button></div>';
  }
  h+='<div id="cpResult">'+result(d,r)+'</div></div>';
  if(ctx.calcMode==="class")h+='</div><div id="cpGroup">'+group(d,rows)+'</div>';
  return h+'</section>';
 }
 function instruction(d){
  const isCDI=type(d)==="cdi";
  const intro=isCDI?"Опросник содержит 27 наборов из трех утверждений. Ребенок выбирает одно утверждение, соответствующее его состоянию за последние две недели. Порядок утверждений не всегда совпадает с порядком баллов.":"Опросник включает 58 вопросов о переживаниях в школе. На каждый вопрос нужно ответить «Да» или «Нет».";
  const key=isCDI?"27 выбранных кодов 0-2 суммируются (0-54). Т-балл рассчитывается по возрастным и половым нормативным таблицам, если значение для такой суммы присутствует в нормах.":"За каждый ответ, не совпавший с ключом, начисляется 1 балл; максимум 58. Восемь факторов определяются по соответствующим номерам. В обработке выделяются восемь факторов школьной тревожности.";
  const pupil=isCDI?"Прочитай по три утверждения в каждом пункте и отметь то, которое лучше всего описывает твое самочувствие за последние две недели. Здесь нет правильных и неправильных ответов.":"Прочитай вопросы о том, как ты чувствуешь себя в школе. Для каждого вопроса выбери «Да» или «Нет». Здесь нет правильных и неправильных ответов.";
  return '<section class="psy-mspss-section psy-mspss-manual"><div class="psy-mspss-manual-bar"><h3>Методика и руководство</h3><div class="psy-mspss-manual-actions"><button class="btn" type="button" data-cp-print="guide">Без бланка</button><button class="btn primary" type="button" data-cp-print="combined">С бланком</button></div></div>'+
   '<h3>Цель</h3><p>'+esc(d.goal)+'</p><h3>Описание методики</h3><p>'+esc(intro)+'</p>'+
   '<h3>Порядок проведения</h3><ol><li>Подготовьте бланк из проверенной версии и обеспечьте спокойную обстановку.</li><li>Прочитайте инструкцию участнику. Не подсказывайте ответы.</li><li>Перенесите ответы в обработку по тем же номерам, затем проверьте полноту и итог.</li></ol>'+
   '<h3>Инструкция для чтения ученику</h3><div class="psy-mspss-script">'+esc(pupil)+'</div>'+
   '<h3>Ключ и подсчет</h3><p>'+esc(key)+'</p>'+
   (isCDI?'<h3>Интерпретация</h3><p>Основной показатель – общий сырой балл. Перевод в Т-балл доступен только для сочетаний возраста, пола и суммы, приведенных в нормативных таблицах. Пункт 9 требует отдельной оценки безопасности, если выбранное утверждение указывает на суицидальные мысли.</p>':
    '<h3>Восемь факторов</h3><div class="psy-mspss-key-wrap"><table class="psy-mspss-key"><thead><tr><th>Фактор</th><th>Пункты</th><th>Максимум</th></tr></thead><tbody>'+phillips.scales.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.q.join(", ")+'</td><td>'+s.q.length+'</td></tr>').join("")+'</tbody></table></div><h3>Интерпретация</h3><p>Свыше 50% несовпадений – повышенный, свыше 75% – высокий показатель по данной редакции. Это не диагноз.</p>')+
   '<p class="psy-mspss-small">Для проведения используйте инструкцию и бланк данной методики.</p></section>';
 }
 function materials(d){
  const isCDI=type(d)==="cdi";
  if(isCDI){
   const rows=norms.statements||[];
   return '<section class="psy-mspss-section psy-mspss-student"><div class="psy-mspss-blank-head"><div>'+
    '<h3>Бланк ученика</h3><p>27 групп утверждений из предоставленного PDF.</p></div>'+
    '<button class="btn primary psy-mspss-view" type="button" data-cp-print="blank">Посмотреть и распечатать</button></div>'+
    '<div class="psy-cdi-student-note"><strong>Инструкция ученику</strong><p>В каждом пункте прочитай три утверждения. Выбери одно, которое лучше всего описывает, как ты чувствовал себя за последние две недели. В колонке «Выбор» запиши 1, 2 или 3 – номер выбранного утверждения. Здесь нет правильных и неправильных ответов.</p></div>'+
    '<div class="psy-mspss-blank-scroll"><table class="psy-mspss-blank-table psy-cdi-student-table psy-cdi-statement-table">'+
    '<thead><tr><th>№</th><th>Утверждения</th><th>Выбор (1, 2 или 3)</th></tr></thead><tbody>'+
    rows.map((group,i)=>'<tr><td>'+(i+1)+'</td><td><div class="psy-cdi-statement-list">'+group.map((entry,j)=>'<p><b>'+(j+1)+'.</b> '+esc(entry[0])+'</p>').join("")+'</div></td><td class="psy-cdi-choose-cell"></td></tr>').join("")+
    '</tbody></table></div><p class="psy-mspss-small">Цифры 1, 2, 3 обозначают порядок утверждений, а не диагностические баллы. Баллы психолог определяет по ключу. Формулировки перенесены из загруженного PDF без редакторской замены спорных мест в пунктах 3 и 27.</p></section>';
  }
  const options=["Нет","Да"];
  return '<section class="psy-mspss-section psy-mspss-student"><div class="psy-mspss-blank-head"><div><h3>Лист ответов ученика</h3><p>Используйте вместе с полным текстом 58 вопросов.</p></div><button class="btn primary psy-mspss-view" type="button" data-cp-print="blank">Посмотреть и распечатать</button></div>'+
   '<p><strong>Инструкция:</strong> прочитай каждый вопрос в полном опроснике и отметь «Да» или «Нет».</p>'+
   '<div class="psy-mspss-blank-scroll"><table class="psy-mspss-blank-table"><thead><tr><th>№</th><th>Тема пункта</th>'+options.map(x=>'<th>'+esc(x)+'</th>').join("")+'</tr></thead><tbody>'+
   subjects(d).map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(q)+'</td>'+options.map(()=>'<td class="psy-mspss-answer-cell"></td>').join("")+'</tr>').join("")+'</tbody></table></div>'+
   '<p class="psy-mspss-small">Краткая тема не заменяет текст вопроса. Для обследования используйте полную проверенную редакцию.</p></section>';
 }
 function printable(d,mode){
  const isCDI=type(d)==="cdi";
  const source=isCDI?"Опросник CDI, 27 пунктов":"Тест школьной тревожности Филлипса, 58 вопросов";
  const guide='<article><h1>'+esc(isCDI?"Опросник детской депрессии М. Ковач (CDI)":"Тест школьной тревожности Филлипса")+'</h1><p>'+esc(source)+'</p><h2>Цель</h2><p>'+esc(d.goal)+'</p><h2>Порядок проведения</h2><p>'+esc(d.instructions)+'</p><h2>Ключ</h2><p>'+esc(d.scoring)+'</p><h2>Интерпретация</h2><p>'+esc(d.interpret)+'</p></article>';
  const note=isCDI?
   'Прочитай три утверждения в каждой строке. В колонке «Выбор» запиши номер одного утверждения: 1, 2 или 3. Они не равны баллам.':
   'Прочитай вопрос в исходном тексте и отметь «Да» или «Нет».';
  const table=isCDI?
   '<table><thead><tr><th>№</th><th>Утверждения</th><th>Выбор (1/2/3)</th></tr></thead><tbody>'+
   norms.statements.map((group,i)=>'<tr><td>'+(i+1)+'</td><td class="statement">'+group.map((entry,j)=>'<p>'+(j+1)+'. '+esc(entry[0])+'</p>').join("")+'</td><td class="blank">&nbsp;</td></tr>').join("")+'</tbody></table>':
   '<table><thead><tr><th>№</th><th>Краткая тема</th><th>Да / Нет</th></tr></thead><tbody>'+
   subjects(d).map((name,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(name)+'</td><td class="blank">&nbsp;</td></tr>').join("")+'</tbody></table>';
  const blank='<article class="'+(mode==="combined"?"newpage":"")+'"><h1>Бланк ученика</h1><p>Фамилия, имя: ____________________________  Дата: _______________</p>'+
   '<p><b>Инструкция:</b> '+esc(note)+'</p>'+table+'</article>';
  return '<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Бланк Метоларии</title><style>@page{size:A4;margin:13mm}body{font:10.2pt/1.4 Arial;color:#183b2d}h1{font-size:17pt}h2{font-size:13pt}table{border-collapse:collapse;width:100%;table-layout:fixed}td,th{border:1px solid #a6bbaf;padding:6px;font-size:9.5pt;text-align:left;vertical-align:top}th:first-child,td:first-child{width:34px;text-align:center}th:last-child,td:last-child{width:90px;text-align:center}.statement p{margin:2px 0 5px}.blank{min-height:65px}tr{break-inside:avoid}.newpage{break-before:page}</style></head><body>'+(mode==="blank"?blank:guide)+(mode==="combined"?blank:"")+'</body></html>';
 }
 function report(d,rows,mode,index){
  if(mode!=="class"&&!scoring(d,rows[index]))return false;
  return wordDocument(d,rows,mode,index);
 }
 function save(name,body,mime){
  const uri=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement("a");a.href=uri;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(uri),1000);return true;
 }
 /* Build a real offline OOXML .docx (ZIP stored entries), without CDN or remote upload. */
 function wordDocument(d,rows,mode,index){
  const people=(mode==="class"?(type(d)==="cdi"?rows:rows.filter(r=>r.name?.trim()||done(d,r.answers))):[rows[index]]).filter(Boolean);
  const isCDI=type(d)==="cdi";
  if(!people.length)return false;
  const xmlEscape=s=>String(s??"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"").replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&apos;"}[c]));
  const run=(s,bold=false)=>'<w:r>'+(bold?'<w:rPr><w:b/></w:rPr>':'')+'<w:t xml:space="preserve">'+xmlEscape(s)+'</w:t></w:r>';
  const para=(s,kind="")=>'<w:p>'+(kind==="head"?'<w:pPr><w:pStyle w:val="Heading1"/></w:pPr>':kind==="sub"?'<w:pPr><w:pStyle w:val="Heading2"/></w:pPr>':'')+run(s,kind!=="")+'</w:p>';
  const cell=(s)=>'<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>'+para(s)+'</w:tc>';
  // Separate Word formatting for Phillips only; CDI and individual reports are untouched.
  const phCell=(s,header,left,width,percent)=>{
   const fill=Number.isFinite(percent)?(percent>75?"FBE0E0":percent>50?"FFF0C9":"E2F3E8"):null;
   const tcPr='<w:tcPr><w:tcW w:w="'+width+'" w:type="dxa"/><w:vAlign w:val="center"/>'+
    (fill?'<w:shd w:val="clear" w:color="auto" w:fill="'+fill+'"/>':"")+'</w:tcPr>';
   const rPr='<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>'+
    '<w:sz w:val="22"/><w:szCs w:val="22"/>'+(header?"<w:b/>":"")+'</w:rPr>';
   return '<w:tc>'+tcPr+'<w:p><w:pPr><w:jc w:val="'+(left?"left":"center")+'"/><w:spacing w:after="0"/></w:pPr>'+
    '<w:r>'+rPr+'<w:t xml:space="preserve">'+xmlEscape(s)+'</w:t></w:r></w:p></w:tc>';
  };
  const table=(head,body,format="",percentRows=[])=>{
   const widths=!isCDI&&mode==="class"&&head.length===10?[550,2200,...Array(8).fill(1620)]:!isCDI&&mode==="class"&&head.length===4&&head[0]==="Показатель"?[5000,3450,3700,3450]:head.map(()=>1200);
   const all=[head,...body];return '<w:tbl><w:tblPr><w:tblW w:w="'+widths.reduce((a,b)=>a+b,0)+'" w:type="dxa"/>'+
    (format?'<w:tblLayout w:type="fixed"/>':"")+
    '<w:tblBorders><w:top w:val="single" w:sz="5"/><w:left w:val="single" w:sz="5"/><w:bottom w:val="single" w:sz="5"/><w:right w:val="single" w:sz="5"/><w:insideH w:val="single" w:sz="5"/><w:insideV w:val="single" w:sz="5"/></w:tblBorders></w:tblPr>'+
     '<w:tblGrid>'+widths.map(w=>'<w:gridCol w:w="'+w+'"/>').join("")+'</w:tblGrid>'+
     all.map((row,i)=>'<w:tr>'+(format&&i===0?'<w:trPr><w:tblHeader w:val="true"/></w:trPr>':"")+
      row.map((text,j)=>format?phCell(text,i===0,format==="scores"?j===1:j===0,widths[j],
       format==="scores"&&i>0&&j>=2?percentRows[i-1]?.[j-2]:null):cell(text)).join("")+'</w:tr>').join("")+'</w:tbl>';
  };
  const title=isCDI?"Опросник детской депрессии М. Ковач (CDI)":"Тест школьной тревожности Филлипса";
  const describe=r=>{
   const z=scoring(d,r);
   if(r.attendance==="absent")return "Отсутствовал";
   if(!z)return "Не завершено ("+done(d,r.answers)+" из "+size(d)+")";
   return "Обработан";
  };
  let body=para(title,"head")+para("Метолария · "+(mode==="class"?"Отчет группы / класса":"Индивидуальный отчет")+" · "+new Date().toLocaleDateString("ru-RU"));
  body+=para("Сводные результаты","sub");
  const columns=isCDI?["№","Участник","Т-балл","Интерпретация"]:mode==="class"?["№","Участник",...phillips.scales.map(s=>s.name+", %")]:["Участник","Статус","Общий / 58","Процент"];
  const summary=people.map((r,i)=>{
   const z=scoring(d,r),n=isCDI&&z?norms.norm(z.raw,r.ageYears,r.sex):null;
   const base=[r.name||"У-"+String(i+1).padStart(2,"0"),describe(r)];
   return isCDI?Object.values(cdiClassRow(d,r,i)).map(String):mode==="class"?
      [String(i+1),r.name||"У-"+String(i+1).padStart(2,"0"),...phillips.scales.map((s,j)=>z?Math.round(z.scales[j].percent):"")]:
      [...base,z?.raw??"–",z?z.percent.toFixed(1)+"%":"–"];
  });
  body+=table(columns,summary,!isCDI&&mode==="class"?"scores":"",!isCDI&&mode==="class"?people.map(r=>scoring(d,r)?.scales.map(s=>s.percent)||[]):[]);
  if(mode==="class"&&!isCDI){
   const stats=phillipsStats(d,people);
   body+='<w:p><w:pPr><w:pageBreakBefore/></w:pPr>'+run("Справка по классу",true)+'</w:p>'+para("Полностью обработано: "+stats.total+" из "+people.length+". Число детей и доля от обработанных анкет.");
   if(stats.total)body+=table(["Показатель","Не превышает 50%","Повышенный >50-75%","Высокий >75%"],
    stats.rows.map(x=>[x.name,countByLevel(x.ordinary,stats.total),countByLevel(x.raised,stats.total),countByLevel(x.high,stats.total)]),"reference");
   body+=para("Пороги отражают показатели по методике Филлипса, а не клинические диагнозы.");
  }
  if(!isCDI&&mode!=="class")for(let i=0;i<people.length;i++){
   const r=people[i],z=scoring(d,r),n=isCDI&&z?norms.norm(z.raw,r.ageYears,r.sex):null;
   if(i>0)body+='<w:p><w:pPr><w:pageBreakBefore/></w:pPr></w:p>';
   body+=para("Результат: "+(r.name||"У-"+(i+1)),"sub")+para("Статус: "+describe(r));
   if(isCDI){
    body+=para("Возраст: "+(r.ageYears??"не указан")+" лет; пол: "+(r.sex==="f"?"девочка":r.sex==="m"?"мальчик":"не указан"));
    body+=para("Общий сырой балл: "+(z?z.raw+" из 54":"не рассчитан"));
    body+=para("Т-балл: "+(n?.t??"не рассчитан"));
    if(n)body+=para(n.status==="ok"?n.level:n.message);
    body+=para("Ответы по пунктам (закодированные баллы; при отсутствии ребенка исключены)","sub");
    body+=table(["Пункт","Балл"],Array.from({length:27},(_,j)=>[String(j+1),r.attendance==="absent"?"–":valid(r.answers?.[j],d)?String(r.answers[j]):"–"]));
   }else{
    body+=para("Общий показатель: "+(z?z.raw+" из 58, "+z.percent.toFixed(1)+"%":"не рассчитан"));
    if(z)body+=table(["Фактор","Число несовпадений","Процент"],z.scales.map(s=>[s.name,String(s.raw)+" из "+s.max,s.percent.toFixed(1)+"%"]));
   }
  }
  if(!isCDI&&mode!=="class")body+=para("Результаты не являются диагнозом. Необследованные и отсутствующие дети не включены в сводный расчет.");
  const doc='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
   '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+
   '<w:sectPr>'+(mode==="class"&&!isCDI?'<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="550" w:bottom="550" w:left="550" w:right="550"/>':'<w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:bottom="850" w:left="850" w:right="850"/>')+'</w:sectPr></w:body></w:document>';
  const types='<?xml version="1.0" encoding="UTF-8"?>'+
   '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
  const rels='<?xml version="1.0" encoding="UTF-8"?>'+
   '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
  const textEnc=new TextEncoder(),crcTable=new Uint32Array(256);
  for(let n=0;n<256;n++){let z=n;for(let k=0;k<8;k++)z=(z&1)?0xedb88320^(z>>>1):z>>>1;crcTable[n]=z>>>0;}
  const crc32=buf=>{let crc=0xffffffff;for(const b of buf)crc=crcTable[(crc^b)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;};
  const u16=(a,v,o)=>{a[o]=v&255;a[o+1]=(v>>>8)&255;};
  const u32=(a,v,o)=>{u16(a,v,o);u16(a,v>>>16,o+2);};
  const join=parts=>{const n=parts.reduce((a,x)=>a+x.length,0),out=new Uint8Array(n);let pos=0;for(const x of parts){out.set(x,pos);pos+=x.length;}return out;};
  let offset=0;const locals=[],centers=[];
  for(const [name,xml] of [["[Content_Types].xml",types],["_rels/.rels",rels],["word/document.xml",doc]]){
   const nameBytes=textEnc.encode(name),data=textEnc.encode(xml),crc=crc32(data);
   const local=new Uint8Array(30+nameBytes.length);u32(local,0x04034b50,0);u16(local,20,4);u16(local,0,6);u16(local,0,8);u32(local,crc,14);
   u32(local,data.length,18);u32(local,data.length,22);u16(local,nameBytes.length,26);local.set(nameBytes,30);
   locals.push(local,data);
   const center=new Uint8Array(46+nameBytes.length);u32(center,0x02014b50,0);u16(center,20,4);u16(center,20,6);u32(center,crc,16);
   u32(center,data.length,20);u32(center,data.length,24);u16(center,nameBytes.length,28);u32(center,offset,42);center.set(nameBytes,46);
   centers.push(center);offset+=local.length+data.length;
  }
  const central=join(centers),end=new Uint8Array(22);u32(end,0x06054b50,0);u16(end,centers.length,8);u16(end,centers.length,10);u32(end,central.length,12);u32(end,offset,16);
  const zip=join([...locals,central,end]);
  return save("Metolaria_"+(isCDI?"CDI":"Phillips")+(mode==="class"?"_class":"_participant")+"_results.docx",zip,"application/vnd.openxmlformats-officedocument.wordprocessingml.document");
 }

 function csv(d,rows){
  if(type(d)==="cdi"){
   const header=["№","Участник","Т-балл","Интерпретация"];
   const data=rows.filter(r=>r.name?.trim()||done(d,r.answers)).map((r,i)=>{
    const v=cdiClassRow(d,r,i);
    return [v.no,v.name,v.t,v.level];
   });
   const escapeCSV=x=>'"'+String(x??"").replace(/"/g,'""')+'"';
   return "\uFEFF"+[header,...data].map(row=>row.map(escapeCSV).join(";")).join("\r\n");
  }
  const head=["№","Участник",...phillips.scales.map(scale=>scale.name+", %")];
  const data=rows.filter(r=>r.name?.trim()||done(d,r.answers)).map((r,i)=>{
   const z=scoring(d,r);
   return [i+1,r.name||"У-"+String(i+1).padStart(2,"0"),...phillips.scales.map((scale,j)=>z?Math.round(z.scales[j].percent):"")];
  });
  const cell=v=>{let s=String(v??"");if(/^\s*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
  return "\uFEFF"+[head,...data].map(row=>row.map(cell).join(";")).join("\r\n");
 }
 function bind(d,ctx){
  document.querySelectorAll("[data-cp-print]").forEach(btn=>btn.addEventListener("click",()=>save("Metolaria_"+type(d)+"_"+btn.dataset.cpPrint+".html",printable(d,btn.dataset.cpPrint),"text/html;charset=utf-8")));
  if(ctx.tab!=="score")return;
  const rows=ctx.rows,r=rows[ctx.rowIndex];if(!r)return;r.answers ||= [];
  const update=()=>{
   const n=done(d,r.answers),progress=document.getElementById("cpProgress");if(progress)progress.textContent="Заполнено "+n+" из "+size(d);
   const res=document.getElementById("cpResult");if(res)res.innerHTML=result(d,r);
   const groupEl=document.getElementById("cpGroup");if(groupEl)groupEl.innerHTML=group(d,rows);
   const active=document.querySelector(".psy-mspss-person.active small");if(active)active.textContent=r.attendance==="absent"?"Отсутствует":n+"/"+size(d);
   const btn=document.getElementById("cpReportBottom");if(btn){const eligible=ctx.calcMode==="class"?rows.some(x=>!!scoring(d,x)):!!scoring(d,r);btn.disabled=!eligible;btn.classList.toggle("psy-mspss-waiting",!eligible);}
  };
  document.getElementById("cpCurrentName")?.addEventListener("input",e=>{
   r.name=e.target.value;const active=document.querySelector(".psy-mspss-person.active span");if(active)active.textContent=r.name||"Участник";
   const option=document.querySelector('#cpBottomPerson option:checked');if(option)option.textContent=(ctx.rowIndex+1)+". "+(r.name||"Участник "+(ctx.rowIndex+1));
  });
  document.getElementById("cpAge")?.addEventListener("change",e=>{
   r.ageManual=!!e.target.value;
   r.ageYears=e.target.value?Number(e.target.value):gradeAge(classGrade(rows));
   update();
  });
  document.getElementById("cpSchoolGrade")?.addEventListener("change",e=>{
   const grade=e.target.value?Number(e.target.value):null;
   const age=gradeAge(grade);
   rows.forEach(person=>{
    person.schoolGrade=grade;
    if(!person.ageManual)person.ageYears=age;
   });
   ctx.onRender?.();
  });
  document.querySelectorAll("[data-cp-sex]").forEach(btn=>btn.addEventListener("click",()=>{
   r.sex=btn.dataset.cpSex;
   document.querySelectorAll("[data-cp-sex]").forEach(b=>{
    const active=b.dataset.cpSex===r.sex;b.classList.toggle("is-selected",active);b.setAttribute("aria-pressed",String(active));
   });
   update();
   if(ctx.calcMode==="class"&&type(d)==="cdi")ctx.onGenderAssigned?.();
  }));
  document.querySelectorAll("[data-cp-person]").forEach(btn=>btn.addEventListener("click",()=>ctx.onSelect?.(Number(btn.dataset.cpPerson))));
  document.getElementById("cpBottomPerson")?.addEventListener("change",e=>ctx.onSelect?.(Number(e.target.value)));
  document.getElementById("cpAddNames")?.addEventListener("click",()=>{const t=document.getElementById("cpBulkNames"),names=(t?.value||"").split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean);if(names.length)ctx.onBulkAdd?.(names);else t?.focus();});
  document.getElementById("cpSort")?.addEventListener("click",()=>{const t=document.getElementById("cpBulkNames"),names=(t?.value||"").split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean);ctx.onSort?.(names);});
  document.querySelectorAll("[data-cp-delete]").forEach(btn=>btn.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();const i=Number(btn.dataset.cpDelete);if(confirm("Удалить ученика "+(rows[i]?.name||"") +" вместе с его ответами?"))ctx.onDelete?.(i)}));
  document.getElementById("cpDeleteAll")?.addEventListener("click",()=>{if(confirm("Удалить весь список и введенные ответы?"))ctx.onDeleteAll?.()});
  document.getElementById("cpAbsent")?.addEventListener("click",()=>{
   if(r.attendance==="absent"){r.attendance="present";ctx.onRender?.();return;}
   if(done(d,r.answers)>0&&!confirm("У ученика есть ответы. Отметить отсутствующим, сохранив ответы, но исключив их из подсчета?"))return;
   r.attendance="absent";(ctx.onAbsentNext||ctx.onRender)?.();
  });
  document.getElementById("cpNext")?.addEventListener("click",()=>ctx.onNext?.());
  const inputs=[...document.querySelectorAll("input[data-cp-answer]")];
  const next=(i)=>{for(let j=i+1;j<inputs.length;j++)if(!inputs[j].disabled){inputs[j].focus();return;}document.getElementById("cpNext")?.focus();};
  function setInput(field,val){const i=Number(field.dataset.cpAnswer);if(val!==""&&![...Array(max(d)+1)].some((_,n)=>String(n)===val))return;field.value=val;
   r.answers[i]=val===""?null:type(d)==="cdi"?Number(val):val==="1"?"yes":"no";
   const card=field.closest(".psy-mspss-item");card?.classList.toggle("is-complete",val!=="");card?.classList.toggle("is-missing",val==="");update();
  }
  inputs.forEach((field,i)=>{
   field.addEventListener("input",()=>{const v=field.value.replace(/[^0-9]/g,"").slice(-1);if(v!==""&&Number(v)>max(d)){setInput(field,"");return;}setInput(field,v);if(v!=="")next(i);});
   field.addEventListener("keydown",e=>{
    if(e.key==="Backspace"&&!field.value&&i>0){e.preventDefault();inputs[i-1].focus();inputs[i-1].select();}
    else if(e.key==="ArrowRight"){e.preventDefault();next(i);}
    else if(e.key==="ArrowLeft"&&i>0){e.preventDefault();inputs[i-1].focus();}
   });
   field.addEventListener("paste",e=>{
    const text=e.clipboardData?.getData("text")||"";if(!/^[0-9\s,;]+$/.test(text))return;
    const nums=text.replace(/[\s,;]/g,"").split("");if(!nums.length||nums.some(v=>Number(v)>max(d)))return;
    e.preventDefault();nums.forEach((v,j)=>{if(inputs[i+j]&&!inputs[i+j].disabled)setInput(inputs[i+j],v)});
    if(inputs[Math.min(inputs.length-1,i+nums.length)])inputs[Math.min(inputs.length-1,i+nums.length)].focus();
   });
   field.addEventListener("focus",()=>field.select());
  });
  update();
 }
 semester.calculator=(d,ctx)=>type(d)==="cdi"?calculator(d,ctx):old.cdiCalc(d,ctx);
 semester.instruction=d=>type(d)==="cdi"?instruction(d):old.cdiGuide(d);
 semester.materials=d=>type(d)==="cdi"?materials(d):old.cdiBlank(d);
 phillips.calculator=(d,ctx)=>type(d)==="ph"?calculator(d,ctx):old.phCalc(d,ctx);
 phillips.instruction=d=>type(d)==="ph"?instruction(d):old.phGuide(d);
 phillips.materials=d=>type(d)==="ph"?materials(d):old.phBlank(d);
 window.PSY_MATCH_MSPSS={supports:d=>!!type(d),calculator,bind,scoring,done,group,result,csv,report,printable};
})();