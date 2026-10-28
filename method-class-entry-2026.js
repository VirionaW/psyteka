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
  d.indicators=["Общий сырой балл 0-54","Т-балл с учетом возраста и пола по таблице PDF","Сопоставление Т-балла с интервалами источника","Пункт 9 – отдельное наблюдение за безопасностью"];
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
  const n=norm(z.raw,r),pct=Math.round(z.raw/54*100),suicidality=Number(r.answers[8])>=1;
  return '<div class="psy-semester-status is-complete">Обработка готова</div>'+
   '<div class="psy-cdi-overall"><div><span>Сырой балл</span><strong>'+z.raw+' / 54</strong></div><div><span>Т-балл</span><strong>'+(n.status==="ok"?n.t:"–")+'</strong></div></div>'+
   '<div class="psy-cdi-scale"><span style="width:'+pct+'%"></span></div>'+
   '<p class="psy-cdi-context">'+esc(n.status==="ok"?n.level:n.message)+'</p>'+
   (suicidality?'<div class="psy-cdi-safety">По пункту 9 выбран ответ о мыслях о самоубийстве. Необходима безотлагательная индивидуальная оценка безопасности – независимо от общей суммы.</div>':'')+
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
   const text=["Опросник детской депрессии М. Ковач (CDI, 27 пунктов)","Условный код: "+(r.name||"не задан"),"Возраст: "+(r.ageYears??"не указан"),"Сырой балл: "+z.raw+" / 54","Т-балл: "+(n.t??"нет в таблице"),n.message,"Пункт 9: "+r.answers[8]+" (требует отдельной проверки при 1 или 2)","Основа: PDF, предоставленный пользователем. Не является диагнозом."].join("\n");
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