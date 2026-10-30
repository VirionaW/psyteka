/* Shared analytical signatures: optional author names are user-provided, never inferred. */
(function(){
 "use strict";
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const xml=x=>String(x??"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F<>&"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]||""));
 const date=rows=>String(rows.analyticDate||"").trim()||new Date().toLocaleDateString("ru-RU");
 const names=rows=>[["Педагог-психолог",rows.analyticPsych1],["Педагог-психолог",rows.analyticPsych2],["Классный руководитель",rows.analyticClassTeacher]];
 const label=(k,title,value,placeholder)=>'<label>'+title+'<input type="text" maxlength="200" autocomplete="off" data-analytic-field="'+k+'" value="'+esc(value||"")+'" placeholder="'+placeholder+'"></label>';
 function fields(rows){return '<details class="psy-cp-analytic-meta"><summary>Данные для аналитической справки (необязательно)</summary>'+
  label("analyticSchool","Учреждение",rows.analyticSchool,"Название учреждения")+
  label("analyticClass","Обозначение класса",rows.analyticClass,"Например, 5.4")+
  label("analyticDate","Дата справки",rows.analyticDate,"ДД.ММ.ГГГГ (по умолчанию сегодня)")+
  label("analyticPsych1","Педагог-психолог 1",rows.analyticPsych1,"Фамилия И. О.")+
  label("analyticPsych2","Педагог-психолог 2",rows.analyticPsych2,"Фамилия И. О.")+
  label("analyticClassTeacher","Классный руководитель",rows.analyticClassTeacher,"Фамилия И. О.")+
  '</details>';}
 function html(rows){
  return '<div class="psy-analytic-signatures"><p class="psy-analytic-date">'+esc(date(rows))+'</p>'+
   names(rows).map(([role,name])=>'<div class="psy-analytic-signature"><span>'+esc(role)+'</span><span>'+esc(name||"________________")+'</span></div>').join("")+
   '<p class="psy-analytic-confidentiality">С результатами диагностики ознакомлен(а). Обязуюсь сохранять конфиденциальность полученной информации.</p></div>';
 }
 const p=(s,align="left",tab=false)=>{
  const ppr='<w:pPr><w:jc w:val="'+align+'"/><w:spacing w:before="100" w:after="180"/>'+
   (tab?'<w:tabs><w:tab w:val="right" w:pos="9600"/></w:tabs>':"")+'</w:pPr>';
  const run=v=>'<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="28"/></w:rPr><w:t xml:space="preserve">'+xml(v)+'</w:t></w:r>';
  return '<w:p>'+ppr+(tab&&Array.isArray(s)?run(s[0])+'<w:r><w:tab/></w:r>'+run(s[1]):run(s))+'</w:p>';
 };
 function word(rows){return p(date(rows))+names(rows).map(([role,name])=>p([role,name||"________________"],"left",true)).join("")+
  p("С результатами диагностики ознакомлен(а). Обязуюсь сохранять конфиденциальность полученной информации.","center");}
 function bind(rows,refresh){
  document.querySelectorAll("[data-analytic-field]").forEach(input=>input.addEventListener("input",e=>{
   rows[input.dataset.analyticField]=e.target.value;refresh?.();
  }));
 }
 window.PSY_ANALYTIC_SIGNATURES={fields,html,word,bind,date};
})();
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
  d.indicators=["Общий показатель депрессии",...norms.scales.map(scale=>scale.name)];
  d.sourceDescription="Предоставленный пользователем PDF «Опросник детской депрессии», 8 страниц. Нормативная таблица – страницы 6-8.";
  d.scoring="Общий сырой балл – сумма 27 ответов (0-54). Пять шкал рассчитываются по своим пунктам. Общий и шкальные сырые результаты переводятся в Т-баллы по таблицам возраста и пола; пустые клетки не экстраполируются.";
  d.interpret="Основной показатель – общий Т-балл, дополнительно пять Т-баллов: негативное настроение, межличностные проблемы, неэффективность, ангедония, негативная самооценка. Интерпретация по полным нормативным интервалам, а не по сырым баллам. Не является диагнозом.";
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
 const subjects=d=>type(d)==="cdi"?Array(27).fill("Ответ по выбранной форме"):phillips.topics;
 /* The original uploaded 27-item handout supplies statement positions and their
    actual 0-2 codes. Do not conflate position with raw score or apply this key
    to another edition/CDI 2. Internally persist ONLY normalized 0-2 scores. */
 const cdiLetters=["А","Б","В"];
 const cdiEntryModes=["score","position","letter"];
 const cdiEntryMode=r=>cdiEntryModes.includes(r?.cdiInputMode)?r.cdiInputMode:"score";
 const cdiKeyValid=Array.isArray(norms?.statements)&&norms.statements.length===27&&
  norms.statements.every(group=>Array.isArray(group)&&group.length===3&&
    group.every(x=>Array.isArray(x)&&Number.isInteger(x[1])&&x[1]>=0&&x[1]<=2)&&
    group.map(x=>x[1]).slice().sort((a,b)=>a-b).join(",")==="0,1,2");
 const cdiEntryHint=(mode,i)=>{
  if(!cdiKeyValid||mode==="score")return "";
  const key=norms.statements[i].map((x,j)=>(mode==="letter"?cdiLetters[j]:String(j+1))+" = "+x[1]).join(" · ");
  return "Пункт "+(i+1)+": "+key+" баллов (порядок из предоставленного PDF)";
 };
 const cdiDecode=(mode,i,token)=>{
  const input=String(token??"").trim().toUpperCase();
  if(!input)return null;
  if(mode==="score")return /^[012]$/.test(input)?Number(input):null;
  if(!cdiKeyValid||i<0||i>=27)return null;
  let p=-1;
  if(mode==="position"&&/^[123]$/.test(input))p=Number(input)-1;
  if(mode==="letter")p=cdiLetters.indexOf(input);
  return p>=0?norms.statements[i][p][1]:null;
 };
 const cdiEncode=(mode,i,score)=>{
  if(![0,1,2,"0","1","2"].includes(score))return "";
  if(mode==="score")return String(score);
  if(!cdiKeyValid||i<0||i>=27)return "";
  const j=norms.statements[i].findIndex(x=>x[1]===Number(score));
  return j<0?"":mode==="letter"?cdiLetters[j]:String(j+1);
 };
 const status=r=>r?.attendance==="absent"?"Отсутствовал":"Присутствует";
 const valid=(v,d)=>type(d)==="cdi"?[0,1,2,"0","1","2"].includes(v):v==="yes"||v==="no";
 function done(d,answers){return Array.from({length:size(d)},(_,i)=>answers?.[i]).filter(v=>valid(v,d)).length;}
 function scoring(d,r){if(!r||r.attendance==="absent")return null;return type(d)==="cdi"?semester.score(d,r.answers||[],r):phillips.score(d,r.answers||[]);}
 function value(d,raw){return type(d)==="ph"?(raw==="yes"?"1":raw==="no"?"0":""):valid(raw,d)?String(raw):"";}
 function interpretation(p){return p>75?"Высокий показатель":p>50?"Повышенный показатель":"Не превышает 50%";}
 function progress(n,total){return '<div class="psy-mspss-track"><span style="width:'+Math.max(0,Math.min(100,n/total*100))+'%"></span></div>';}
 function palette(i){return ["psy-cp-purple","psy-cp-green","psy-cp-blue"][i%3];}
 /* CDI: numeric result uses the nearest defined source value when missing.
    The simplified presentation bands are a display choice, not a clinical diagnosis. */
 const cdiUsable=v=>v&&(v.status==="ok"||v.status==="approximate")&&Number.isInteger(v.t);
 const cdiNumber=v=>cdiUsable(v)?v.t:"";
 const cdiTone=t=>Number.isInteger(t)?(t<=39?"low":t<=60?"medium":"high"):"";
 const cdiLevel=t=>Number.isInteger(t)?(t<=39?"Низкий":t<=60?"Средний":"Высокий"):"";
 const cdiHighlight=v=>Number.isInteger(v)?'<span class="psy-cdi-score-mark psy-cdi-mark-'+cdiTone(v)+'">'+v+'</span>':"";
 const cdiLegendHTML='<div class="psy-cdi-legend"><h4>Расшифровка результатов</h4>'+
  '<div><span class="psy-cdi-score-mark psy-cdi-mark-low">0-39</span> – низкий уровень</div>'+
  '<div><span class="psy-cdi-score-mark psy-cdi-mark-medium">40-60</span> – средний уровень</div>'+
  '<div><span class="psy-cdi-score-mark psy-cdi-mark-high">61-100</span> – высокий уровень</div></div>';
 function result(d,r){
  const n=done(d,r?.answers||[]),total=size(d),z=scoring(d,r);
  if(r?.attendance==="absent")return '<section class="psy-mspss-result psy-cp-absent"><h3>Ученик отсутствовал</h3><p>Ответы сохранены, но результаты не рассчитываются и не входят в сводку класса.</p></section>';
  if(!z)return '<section class="psy-mspss-result"><h3>Заполнено '+n+' из '+total+'</h3>'+progress(n,total)+'<p>После ввода всех ответов появится автоматическая обработка. Пропуск не равен нулевому баллу.</p></section>';
  if(type(d)==="cdi"){
   const t=norms.norm(z.raw,r.ageYears,r.sex),scales=norms.scaleScores(r.answers);
   const scoreCards=scales.map(x=>{
    const v=norms.scaleNorm(x.id,x.raw,r.ageYears,r.sex);
    return '<div class="psy-cdi-factor"><b>'+esc(x.name)+'</b>'+
     '<strong>'+ (cdiUsable(v)?cdiHighlight(v.t):"Нет результата")+'</strong>'+
     '<small>Сырой балл: '+x.raw+' из '+x.max+'</small>'+
     '<small>'+ (cdiUsable(v)?cdiLevel(v.t):"Нет нормативных данных")+'</small></div>';
   }).join("");
   return '<section class="psy-mspss-result psy-cdi-single-result"><h3>Общий показатель депрессии</h3>'+
    '<strong class="psy-cdi-total-t">'+(cdiUsable(t)?cdiHighlight(t.t):"Нет результата")+'</strong>'+
    '<p class="psy-cdi-individual-interpretation">'+(cdiUsable(t)?cdiLevel(t.t):"Не удалось рассчитать результат")+'</p>'+
    '<p class="psy-mspss-small">Сумма ответов: '+z.raw+' из 54 сырых баллов.</p>'+
    '<h4>Пять шкал Ковач</h4><div class="psy-cdi-factor-grid">'+scoreCards+'</div>'+
    cdiLegendHTML+
    '<p class="psy-mspss-small">Пункт 9 необходимо проверить по выбранному утверждению отдельно. При указании на суицидальные мысли нужна очная оценка безопасности. Результат не является диагнозом.</p></section>';
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
 const cdiRoster=rows=>rows.some(x=>!!x?.name?.trim());
 const cdiAgeReady=(r,rows,mode)=>!!(gradeAge(mode==="class"?classGrade(rows):r?.schoolGrade)||(Number.isInteger(Number(r?.ageYears))&&Number(r?.ageYears)>=7&&Number(r?.ageYears)<=17));
 const cdiContextReady=(d,r,rows,mode)=>type(d)!=="cdi"||((mode!=="class"||cdiRoster(rows))&&cdiAgeReady(r,rows,mode)&&r?.attendance!=="absent");
 const cdiReady=(d,r,rows,mode)=>!!r?.name?.trim()&&r?.attendance!=="absent"&&cdiContextReady(d,r,rows,mode)&&(type(d)!=="cdi"||["m","f"].includes(r?.sex));
 function cdiClassRow(d,r,i){
  const z=scoring(d,r),overall=z?norms.norm(z.raw,r.ageYears,r.sex):null;
  const scales=z?norms.scaleScores(r.answers):null;
  const values=[overall,...(scales?scales.map(x=>norms.scaleNorm(x.id,x.raw,r.ageYears,r.sex)):norms.scales.map(()=>null))];
  return {no:i+1,name:r.name||"У-"+String(i+1).padStart(2,"0"),values:values.map(v=>cdiNumber(v))};
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

 // Group narrative from completed forms; omitted or absent forms do not count.
 function analyticSummary(d,rows){
  const roster=rows.filter(r=>r?.name?.trim()||done(d,r?.answers)).length;
  const people=rows.filter(r=>!!scoring(d,r)),n=people.length;
  if(!n)return null;
  const grade=classGrade(rows),institution=String(rows.analyticSchool||"").trim(),classLabel=String(rows.analyticClass||"").trim(),L=[
   {kind:"title",text:"Аналитическая справка"},
   {kind:"subtitle",text:"По методике "+(type(d)==="cdi"?"«Опросник детской депрессии (М. Ковач, CDI)»":"«Тест школьной тревожности Филлипса»")},
   {kind:"meta",text:classLabel?"Класс: "+classLabel:grade?"Класс: "+grade:"Класс не указан"},
   {kind:"body",text:"В обследовании приняли участие "+n+" из "+roster+" учащихся ("+classPercent(n,roster)+")."}
  ];
  if(institution)L.unshift({kind:"institution",text:institution});
  if(type(d)==="cdi"){
   const boys=people.filter(r=>r.sex==="m").length,girls=people.filter(r=>r.sex==="f").length;
   if(boys+girls)L.push({kind:"body",text:"Из обследованных: "+boys+" мальчиков ("+classPercent(boys,n)+") и "+girls+" девочек ("+classPercent(girls,n)+")."+(boys+girls<n?" Пол указан у "+(boys+girls)+" участников.":"")});
   const vals=people.map(r=>{const z=scoring(d,r),t=norms.norm(z.raw,r.ageYears,r.sex);return cdiUsable(t)?t.t:null}).filter(Number.isInteger);
   if(vals.length<n)L.push({kind:"body",text:"В анализ по уровням включено "+vals.length+" из "+n+" завершенных анкет (для остальных нормативный показатель не рассчитан)."});
   if(!vals.length)L.push({kind:"body",text:"Распределение по уровням не рассчитано: отсутствуют нормативные результаты."});
   else{
    L.push({kind:"body",text:"По общему показателю выраженности депрессивных симптомов:"});
    const g=[
     ["Низкий уровень (0-39)",vals.filter(v=>v<=39).length,"По суммарному показателю выраженные признаки депрессивного состояния не выявлены; учитываются индивидуальные особенности ребенка."],
     ["Средний уровень (40-60)",vals.filter(v=>v>=40&&v<=60).length,"Показатель находится в среднем диапазоне; эмоциональное состояние может зависеть от ситуации и текущих трудностей."],
     ["Высокий уровень (61 и выше)",vals.filter(v=>v>=61).length,"Повышенная выраженность симптомов может сопровождаться сниженным настроением и трудностями в общении; рекомендуется подробная индивидуальная оценка."]
    ];
    g.forEach(x=>L.push({kind:"level",text:x[0]+" – "+x[1]+" чел. ("+classPercent(x[1],vals.length)+"). "+x[2]}));
   }
  }else{
   const stats=phillipsStats(d,people),overall=stats.rows[0];
   L.push({kind:"body",text:"По общей школьной тревожности: не превышает 50% – "+countByLevel(overall.ordinary,n)+"; повышенная (свыше 50% до 75%) – "+countByLevel(overall.raised,n)+"; высокая (свыше 75%) – "+countByLevel(overall.high,n)+"."});
   const factors=stats.rows.slice(1).filter(x=>x.raised+x.high>0).sort((a,b)=>(b.raised+b.high)-(a.raised+a.high));
   if(factors.length){
    L.push({kind:"body",text:"Повышенные и высокие показатели по факторам:"});
    factors.slice(0,3).forEach(x=>L.push({kind:"factor",text:x.name+": повышенный – "+countByLevel(x.raised,n)+", высокий – "+countByLevel(x.high,n)+"."}));
    if(factors.length>3)L.push({kind:"body",text:"Приведены три наиболее распространенных фактора; остальные показатели доступны в таблице результатов класса."});
   }else L.push({kind:"body",text:"По восьми факторам повышенных и высоких показателей не выявлено."});
  }
  return {lines:L,n,roster};
 }
 function analyticPreview(d,rows){
  const a=analyticSummary(d,rows);
  return a?'<section class="psy-cp-analytic-preview"><h3>Аналитическая справка</h3>'+
   a.lines.filter(x=>x.kind!=="title").map(x=>'<p class="psy-cp-analytic-'+x.kind+'">'+esc(x.text)+'</p>').join("")+window.PSY_ANALYTIC_SIGNATURES.html(rows)+'</section>':"";
 }

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
   const head=norms.scales.map(x=>'<th scope="col">'+esc(x.name)+'</th>').join("");
   const body=ordered.map((r,i)=>{
    const item=cdiClassRow(d,r,i);
    return '<tr><td>'+(i+1)+'</td><td class="psy-cdi-name">'+esc(item.name)+'</td>'+
      item.values.map(v=>'<td class="psy-cdi-tvalue">'+cdiHighlight(v)+'</td>').join("")+'</tr>';
   }).join("");
   return '<section class="psy-mspss-group psy-cdi-class-results"><h3>Результаты класса</h3>'+
    '<div class="psy-mspss-scroll"><table><thead><tr><th scope="col">№</th><th scope="col">Участник</th><th scope="col">Общий показатель депрессии</th>'+head+
    '</tr></thead><tbody>'+body+'</tbody></table></div>'+cdiLegendHTML+analyticPreview(d,rows)+'</section>';
  }
  const head=phillips.scales.map(scale=>'<th scope="col">'+esc(scale.name+", %")+'</th>').join("");
  const body=ordered.map((r,i)=>{
   const z=scoring(d,r);
   return '<tr><td class="psy-ph-number">'+(i+1)+'</td><td class="psy-ph-name">'+esc(r.name||"У-"+String(i+1).padStart(2,"0"))+'</td>'+
    phillips.scales.map((scale,j)=>{
     if(!z)return '<td class="psy-ph-score"></td>';
     const percent=z.scales[j].percent;
     return '<td class="psy-ph-score"><span class="psy-ph-score-mark psy-ph-tone-'+phillipsColor(percent)+'">'+Math.round(percent)+'</span></td>';
    }).join("")+'</tr>';
  }).join("");
  return '<section class="psy-mspss-group psy-ph-class-results"><h3>Результаты класса</h3><div class="psy-mspss-scroll"><table><thead><tr><th scope="col">№</th><th scope="col">Участник</th>'+head+'</tr></thead><tbody>'+body+'</tbody></table></div></section>'+analyticPreview(d,rows);
 }
 function calculator(d,ctx){
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],a=r.answers||[],n=done(d,a),total=size(d),canAnswer=cdiReady(d,r,rows,ctx.calcMode),hasRoster=cdiRoster(rows),cdiClass=type(d)==="cdi"&&ctx.calcMode==="class",allowDetails=ctx.calcMode!=="class"||hasRoster,allowGender=allowDetails&&cdiContextReady(d,r,rows,ctx.calcMode);
  let h='<section class="psy-mspss-calculator psy-cp-calculator"><div class="calc-mode psy-mspss-modes">'+
   '<button type="button" class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button>'+
   '<button type="button" class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
  if(ctx.calcMode==="class"){
   h+='<div class="psy-mspss-workspace"><aside class="psy-mspss-sidebar"><h3>Список учащихся</h3>'+
    '<label class="psy-mspss-label" for="cpBulkNames">Участники (по одному в строке)</label><textarea id="cpBulkNames" rows="10" placeholder="Иванов Иван&#10;Петрова Анна&#10;Сидоров Алексей"></textarea>'+
    '<button type="button" class="btn primary psy-mspss-add" id="cpAddNames">Добавить в список</button>'+
    '<button type="button" class="btn psy-mspss-sort" id="cpSort" '+(!allowDetails?"disabled":"")+' >По алфавиту А - Я</button>'+
    '<div class="psy-mspss-person-list">'+rows.map((u,i)=>(u.name?.trim()||done(d,u.answers))?
      '<div class="psy-mspss-person-row '+(type(d)==="cdi"?(u.sex==="f"?"psy-cp-girl":u.sex==="m"?"psy-cp-boy":""):"")+'"><button type="button" class="psy-mspss-person '+(i===ctx.rowIndex?"active":"")+'" data-cp-person="'+i+'"><span>'+esc(u.name||"Участник "+(i+1))+'</span><small>'+(u.attendance==="absent"?"Отсутствует":done(d,u.answers)+"/"+total)+'</small></button>'+
      '<button type="button" class="psy-mspss-delete-person" title="Удалить ученика" aria-label="Удалить '+esc(u.name||"ученика")+'" data-cp-delete="'+i+'">×</button></div>':"").join("")+'</div>'+
    '<button type="button" class="btn psy-mspss-delete-all" id="cpDeleteAll" '+(!allowDetails?"disabled":"")+' >Удалить всех участников</button>'+
    window.PSY_ANALYTIC_SIGNATURES.fields(rows)+'</aside><div class="psy-mspss-entry">';
  }else h+='<div class="psy-mspss-entry">';
  if(ctx.calcMode==="class"&&!hasRoster){
   h+='<div class="psy-cp-empty-state"><h3>Добавьте участников</h3><p>Введите имена или коды слева, каждый с новой строки, и нажмите «Добавить в список».</p></div></div></div></section>';
   return h;
  }
  if(type(d)==="cdi"&&ctx.calcMode==="class")h+='<div class="psy-cp-current '+(r.sex==="f"?"psy-cp-girl":r.sex==="m"?"psy-cp-boy":"")+'"><span>'+(ctx.rowIndex+1)+' / '+rows.length+'</span><b>Сейчас: '+esc(r.name||"Участник "+(ctx.rowIndex+1))+'</b></div>';
  if(type(d)==="cdi"&&rows.genderNote&&ctx.calcMode==="class")h+='<p class="psy-cp-gender-feedback" role="status">'+esc(rows.genderNote)+'</p>';
  h+='<label class="psy-mspss-name-field" for="cpCurrentName"><span>Участник</span><input type="text" id="cpCurrentName" maxlength="120" autocomplete="off" value="'+esc(r.name||"")+'" placeholder="Имя или условный код"></label>';
  if(type(d)==="cdi"){
   const chosenClass=Number(ctx.calcMode==="class"?classGrade(rows):r.schoolGrade);
   h+='<div class="psy-cp-age-class"><label for="cpAge">Возраст<select id="cpAge"><option value="">Выбрать возраст</option>'+Array.from({length:11},(_,i)=>i+7).map(age=>'<option value="'+age+'" '+(Number(r.ageYears)===age?"selected":"")+'>'+age+' лет</option>').join("")+'</select></label>'+
    '<span class="psy-cp-or" aria-hidden="true">или</span>'+
    '<label for="cpSchoolGrade">Класс<select id="cpSchoolGrade"><option value="">Выбрать класс</option>'+Array.from({length:11},(_,i)=>i+1).map(g=>'<option value="'+g+'" '+(chosenClass===g?"selected":"")+'>'+g+' класс</option>').join("")+'</select></label></div>'+
    '<div class="psy-cp-sex-field"><span>Пол</span><div class="psy-cp-sex-buttons" role="group" aria-label="Пол ребенка">'+
    '<button type="button" '+(!allowGender?"disabled ":"")+'class="btn psy-cp-sex-btn '+(r.sex==="f"?"is-selected":"")+'" data-cp-sex="f" aria-pressed="'+(r.sex==="f")+'">Девочка</button>'+
    '<button type="button" '+(!allowGender?"disabled ":"")+'class="btn psy-cp-sex-btn '+(r.sex==="m"?"is-selected":"")+'" data-cp-sex="m" aria-pressed="'+(r.sex==="m")+'">Мальчик</button></div></div>';
  }
  if(type(d)==="cdi"){
   const entryMode=cdiEntryMode(r);
   h+='<div class="psy-cdi-entry-mode"><label for="cpCdiInputMode">Формат ответов<select id="cpCdiInputMode">'+
    '<option value="score" '+(entryMode==="score"?"selected":"")+'>Баллы 0-2</option>'+
    '<option value="position" '+(entryMode==="position"?"selected":"")+(cdiKeyValid?"":" disabled")+'>Номера утверждений 1-3 (бланк PDF)</option>'+
    '<option value="letter" '+(entryMode==="letter"?"selected":"")+(cdiKeyValid?"":" disabled")+'>Буквы А, Б, В (бланк PDF)</option>'+
    '</select></label>'+
    '<small>'+(entryMode==="score"?"Вводятся уже подсчитанные баллы по ключу.":cdiKeyValid?"Буквы и номера пересчитываются по ключу каждого пункта; они не равны баллам.":"Для этого формата нет проверенного ключа.")+
    ' Используйте порядок утверждений именно из предоставленного 27-пунктного PDF.</small></div>';
  }
  if(type(d)==="cdi")h+='<details class="psy-cdi-student-note psy-cdi-specialist-note"><summary>Как вводить баллы</summary><p>Вводите 0, 1 или 2 по ключу оригинального опросника, а не номер выбранного утверждения.</p></details>';
  if(!canAnswer)h+='<p class="psy-cdi-lock-note" id="cdiLockNote" '+(canAnswer?'hidden':'')+'>'+
   (!r.name?.trim()?"Сначала укажите участника.":type(d)==="cdi"&&!cdiAgeReady(r,rows,ctx.calcMode)?"Выберите возраст или класс.":"Выберите пол ребенка.")+'</p>';
  h+='<p class="psy-mspss-progress" id="cpProgress">Заполнено '+n+' из '+total+'</p>';
  if(r.attendance==="absent")h+='<p class="psy-cp-absence">Ученик отмечен отсутствующим. Ввод заблокирован до возвращения в список присутствующих.</p>';
  h+='<div class="psy-mspss-grid psy-cp-grid">'+subjects(d).map((topic,i)=>{
   const answer=type(d)==="cdi"?cdiEncode(cdiEntryMode(r),i,a[i]):value(d,a[i]),complete=answer!=="";
   return '<label class="psy-mspss-item '+(complete?"is-complete":"is-missing")+'"><span><b>'+(i+1)+'.</b> '+esc(topic)+'</span>'+
    '<input class="psy-mspss-score-input psy-cp-answer" data-cp-answer="'+i+'" type="text" inputmode="'+(type(d)==="cdi"&&cdiEntryMode(r)==="letter"?"text":"numeric")+'" autocomplete="off" maxlength="1" placeholder="'+(type(d)==="cdi"?(cdiEntryMode(r)==="letter"?"А/Б/В":cdiEntryMode(r)==="position"?"1-3":"0-2"):"0-1")+'" aria-label="Пункт '+(i+1)+' – '+(type(d)==="cdi"?"ответ":"балл")+'"'+(type(d)==="cdi"&&cdiEntryMode(r)!=="score"?' title="'+esc(cdiEntryHint(cdiEntryMode(r),i))+'"':"")+' value="'+esc(answer)+'" '+(!canAnswer?"disabled":"")+'></label>';
  }).join("")+'</div>';
  if(ctx.calcMode==="class"){
   const nextAvailable=(start)=>{for(let step=1;step<rows.length;step++){const j=(start+step)%rows.length;if(rows[j].attendance!=="absent")return j;}return -1;};
   const nextIndex=nextAvailable(ctx.rowIndex);
   const chooser='<label class="psy-ph-bottom-chooser" for="cpBottomPerson">Выбрать ученика <select id="cpBottomPerson" aria-label="Перейти к участнику">'+rows.map((person,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc((i+1)+". "+(person.name||"Участник "+(i+1))+(person.attendance==="absent"?" (отсутствует)":""))+'</option>').join("")+'</select></label>';
   h+='<div class="psy-mspss-after-questions psy-cp-next-actions psy-ph-bottom-nav">'+chooser+
    '<button type="button" class="btn" id="cpAbsent" '+(!allowDetails?"disabled":"")+' >'+(r.attendance==="absent"?"Вернуть в список присутствующих":"Отсутствовал – следующий")+'</button>'+
    '<button type="button" class="btn primary" id="cpNext" '+(nextIndex<0||!allowDetails?"disabled":"")+' >'+(nextIndex>=0?"Следующий: "+esc(rows[nextIndex].name||"Участник "+(nextIndex+1))+" →":"Следующий участник →")+'</button></div>';
  }
  h+='<div id="cpResult">'+result(d,r)+'</div></div>';
  if(ctx.calcMode==="class")h+='</div><div id="cpGroup">'+group(d,rows)+'</div>';
  return h+'</section>';
 }
 function instruction(d){
  const isCDI=type(d)==="cdi";
  const intro=isCDI?"Опросник содержит 27 наборов из трех утверждений. Ребенок выбирает одно утверждение, соответствующее его состоянию за последние две недели. Порядок утверждений не всегда совпадает с порядком баллов.":"Опросник включает 58 вопросов о переживаниях в школе. На каждый вопрос нужно ответить «Да» или «Нет».";
  const key=isCDI?"В обработке можно выбрать способ ввода: готовые баллы 0-2, номера выбранных утверждений 1-3 либо буквы А, Б, В. Для букв и номеров используется порядок утверждений из предоставленного 27-пунктного PDF: правильный балл определяется отдельно по ключу каждого вопроса. Другие редакции требуют другого проверенного ключа. Сложите 27 баллов 0-2 (общий сырой балл 0-54) и отдельно суммы по пяти шкалам. Переведите каждый результат в Т-балл по таблице соответствующей шкалы с учетом пола и возраста (7-12 или 13-17 лет). При отсутствии точного значения Т-балл определяется ориентировочно по ближайшему сырому значению, со знаком ≈.":"За каждый ответ, не совпавший с ключом, начисляется 1 балл; максимум 58. Восемь факторов определяются по соответствующим номерам. В обработке выделяются восемь факторов школьной тревожности.";
  const pupil=isCDI?"Прочитай по три утверждения в каждом пункте и отметь то, которое лучше всего описывает твое самочувствие за последние две недели. Здесь нет правильных и неправильных ответов.":"Прочитай вопросы о том, как ты чувствуешь себя в школе. Для каждого вопроса выбери «Да» или «Нет». Здесь нет правильных и неправильных ответов.";
  return '<section class="psy-mspss-section psy-mspss-manual"><div class="psy-mspss-manual-bar"><h3>Методика и руководство</h3><div class="psy-mspss-manual-actions"><button class="btn" type="button" data-cp-print="guide">Без бланка</button><button class="btn primary" type="button" data-cp-print="combined">С бланком</button></div></div>'+
   '<h3>Цель</h3><p>'+esc(d.goal)+'</p><h3>Описание методики</h3><p>'+esc(intro)+'</p>'+
   '<h3>Порядок проведения</h3><ol><li>Подготовьте бланк из проверенной версии и обеспечьте спокойную обстановку.</li><li>Прочитайте инструкцию участнику. Не подсказывайте ответы.</li><li>Перенесите ответы в обработку по тем же номерам, затем проверьте полноту и итог.</li></ol>'+
   '<h3>Инструкция для чтения ученику</h3><div class="psy-mspss-script">'+esc(pupil)+'</div>'+
   '<h3>Ключ и подсчет</h3><p>'+esc(key)+'</p>'+
   (isCDI?'<h3>Пять шкал CDI</h3><div class="psy-mspss-key-wrap"><table class="psy-mspss-key"><thead><tr><th>Шкала</th><th>Пункты</th><th>Максимальный сырой балл</th></tr></thead><tbody>'+norms.scales.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+x.q.join(", ")+'</td><td>'+(x.q.length*2)+'</td></tr>').join("")+'</tbody></table></div><h3>Интерпретация Т-баллов</h3><p>Т-баллы 45-55 – средний уровень, 56-60 – чуть выше среднего, 61-65 – выше среднего, 66-70 – значительно выше, свыше 70 – очень значительно выше среднего. Каждый фактор переводится по своей нормативной таблице с учетом возраста и пола. Пункт 9 требует отдельной оценки безопасности, если выбранное утверждение указывает на суицидальные мысли.</p>':
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
  if(mode==="analysis")return !!analyticSummary(d,rows)&&wordDocument(d,rows,mode,index);
  if(mode!=="class"&&!scoring(d,rows[index]))return false;
  return wordDocument(d,rows,mode,index);
 }
 function save(name,body,mime){
  const uri=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement("a");a.href=uri;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(uri),1000);return true;
 }
 /* Build a real offline OOXML .docx (ZIP stored entries), without CDN or remote upload. */
 function wordDocument(d,rows,mode,index){
  const people=((mode==="class"||mode==="analysis")?(type(d)==="cdi"?rows:rows.filter(r=>r.name?.trim()||done(d,r.answers))):[rows[index]]).filter(Boolean);
  const isCDI=type(d)==="cdi";
  if(!people.length)return false;
  const xmlEscape=s=>String(s??"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"").replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&apos;"}[c]));
  const run=(s,bold=false)=>'<w:r>'+(bold?'<w:rPr><w:b/></w:rPr>':'')+'<w:t xml:space="preserve">'+xmlEscape(s)+'</w:t></w:r>';
  const para=(s,kind="")=>'<w:p>'+(kind==="head"?'<w:pPr><w:pStyle w:val="Heading1"/></w:pPr>':kind==="sub"?'<w:pPr><w:pStyle w:val="Heading2"/></w:pPr>':'')+run(s,kind!=="")+'</w:p>';
  const cell=(s)=>'<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>'+para(s)+'</w:tc>';
  /* CDI text-only highlighted score. No whole-cell color fill. */
  const cdiLegend=[
   {min:61,range:"61-100",level:"Высокий",fill:"FF6868"},
   {min:40,range:"40-60",level:"Средний",fill:"FFF14D"},
   {min:0,range:"0-39",level:"Низкий",fill:"4BE878"}
  ];
  const cdiWordBand=t=>Number.isInteger(t)?cdiLegend.find(x=>t>=x.min):null;
  const cdiWordCell=(v,header,left,width,band)=>{
   const tcPr='<w:tcPr><w:tcW w:w="'+width+'" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>';
   const rPr='<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>'+
    '<w:sz w:val="20"/><w:szCs w:val="20"/>'+(header||band?"<w:b/>":"")+
    (band?'<w:shd w:val="clear" w:color="auto" w:fill="'+band.fill+'"/><w:color w:val="111111"/>':"")+'</w:rPr>';
   return '<w:tc>'+tcPr+'<w:p><w:pPr><w:jc w:val="'+(left?"left":"center")+
    '"/><w:spacing w:before="60" w:after="60"/></w:pPr><w:r>'+rPr+
    '<w:t xml:space="preserve">'+xmlEscape(v)+'</w:t></w:r></w:p></w:tc>';
  };
  // Separate Word formatting for Phillips only; CDI and individual reports are untouched.
  const phCell=(s,header,left,width,percent)=>{
   // Highlight only the number's text run, never the entire table cell.
   // Use the unrounded percentage to assign the level at 50/75 boundaries.
   const fill=Number.isFinite(percent)&&s!==""?(percent>75?"FF6868":percent>50?"FFF14D":"4BE878"):null;
   const tcPr='<w:tcPr><w:tcW w:w="'+width+'" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>';
   const rPr='<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>'+
    '<w:sz w:val="20"/><w:szCs w:val="20"/>'+(header||fill?"<w:b/>":"")+
    (fill?'<w:shd w:val="clear" w:color="auto" w:fill="'+fill+'"/><w:color w:val="111111"/>':"")+'</w:rPr>';
   return '<w:tc>'+tcPr+'<w:p><w:pPr><w:jc w:val="'+(left?"left":"center")+'"/><w:spacing w:after="0"/></w:pPr>'+
    '<w:r>'+rPr+'<w:t xml:space="preserve">'+xmlEscape(s)+'</w:t></w:r></w:p></w:tc>';
  };
  const table=(head,body,format="",percentRows=[])=>{
   const widths=format==="cdi"?[500,2100,...Array(head.length-2).fill(Math.floor(7700/(head.length-2)))]:format==="cdi-legend"?[2600,7500]:format==="scores"?[500,2100,...Array(head.length-2).fill(Math.floor(7700/(head.length-2)))]:format==="reference"?[4000,2100,2100,2100]:head.length===4?[2200,3000,2500,2500]:head.map(()=>1200);
   const all=[head,...body];return '<w:tbl><w:tblPr><w:tblW w:w="'+widths.reduce((a,b)=>a+b,0)+'" w:type="dxa"/>'+
    (format?'<w:tblLayout w:type="fixed"/>':"")+
    '<w:tblBorders><w:top w:val="single" w:sz="5"/><w:left w:val="single" w:sz="5"/><w:bottom w:val="single" w:sz="5"/><w:right w:val="single" w:sz="5"/><w:insideH w:val="single" w:sz="5"/><w:insideV w:val="single" w:sz="5"/></w:tblBorders></w:tblPr>'+
     '<w:tblGrid>'+widths.map(w=>'<w:gridCol w:w="'+w+'"/>').join("")+'</w:tblGrid>'+
     // The first row is a column heading only once. Word must not repeat it
     // automatically when this same table flows onto another page.
     all.map((row,i)=>'<w:tr>'+
      row.map((text,j)=>format==="cdi"||format==="cdi-legend"?
       cdiWordCell(text,i===0,format==="cdi"?j===1:j===1,widths[j],
        i>0?(format==="cdi"&&j>=2&&j<=7?cdiWordBand(percentRows[i-1]?.[j-2]):format==="cdi-legend"&&j===0?cdiWordBand(percentRows[i-1]):null):null):
       format?phCell(text,i===0,format==="scores"?j===1:j===0,widths[j],
        format==="scores"&&i>0&&j>=2?percentRows[i-1]?.[j-2]:null):cell(text)).join("")+'</w:tr>').join("")+'</w:tbl>';
  };
  const title=isCDI?"Опросник детской депрессии М. Ковач (CDI)":"Тест школьной тревожности Филлипса";
  const describe=r=>{
   const z=scoring(d,r);
   if(r.attendance==="absent")return "Отсутствовал";
   if(!z)return "Не завершено ("+done(d,r.answers)+" из "+size(d)+")";
   return "Обработан";
  };
  const analytical=mode==="analysis"?analyticSummary(d,rows):null;
  const analysisPara=x=>{
   const head=x.kind==="title"||x.kind==="subtitle"||x.kind==="institution",strong=x.kind==="level";
   const fontSize=x.kind==="title"?32:x.kind==="subtitle"?27:x.kind==="institution"?26:x.kind==="meta"?24:28;
   return '<w:p><w:pPr><w:jc w:val="'+(head?"center":x.kind==="meta"?"left":"both")+
    '"/><w:spacing w:after="150" w:line="335" w:lineRule="auto"/>'+
    (x.kind==="factor"?'<w:ind w:left="280"/>':"")+'</w:pPr><w:r><w:rPr>'+
    '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>'+
    '<w:sz w:val="'+fontSize+'"/><w:szCs w:val="'+fontSize+'"/>'+(head||strong?"<w:b/>":"")+
    '</w:rPr><w:t xml:space="preserve">'+xmlEscape(x.text)+'</w:t></w:r></w:p>';
  };
  let body=analytical?analytical.lines.map(analysisPara).join("")+window.PSY_ANALYTIC_SIGNATURES.word(rows):
   para(title,"head")+para("Метолария · "+(mode==="class"?"Отчет группы / класса":"Индивидуальный отчет")+" · "+new Date().toLocaleDateString("ru-RU"));
  if(!analytical){
  body+=para("Сводные результаты","sub");
  const columns=isCDI?["№","Участник","Общий показатель депрессии",...norms.scales.map(x=>x.name)]:mode==="class"?["№","Участник",...phillips.scales.map(s=>s.name+", %")]:["Участник","Статус","Общий / 58","Процент"];
  const summary=people.map((r,i)=>{
   const z=scoring(d,r),n=isCDI&&z?norms.norm(z.raw,r.ageYears,r.sex):null;
   const base=[r.name||"У-"+String(i+1).padStart(2,"0"),describe(r)];
   return isCDI?(()=>{const x=cdiClassRow(d,r,i);return [String(x.no),x.name,...x.values]})():mode==="class"?
      [String(i+1),r.name||"У-"+String(i+1).padStart(2,"0"),...phillips.scales.map((s,j)=>z?Math.round(z.scales[j].percent):"")]:
      [...base,z?.raw??"–",z?z.percent.toFixed(1)+"%":"–"];
  });
  // On portrait A4 the complete CDI/Phillips matrix is too wide. Keep every
  // factor, but print the results as two readable tables with repeated names.
  if(isCDI||mode==="class"){
   const valueRows=isCDI?people.map(r=>{
    const z=scoring(d,r),n=z?norms.norm(z.raw,r.ageYears,r.sex):null;
    const factors=z?norms.scaleScores(r.answers).map(x=>{
     const v=norms.scaleNorm(x.id,x.raw,r.ageYears,r.sex);
     return cdiUsable(v)?v.t:null;
    }):norms.scales.map(()=>null);
    return [cdiUsable(n)?n.t:null,...factors];
   }):people.map(r=>scoring(d,r)?.scales.map(s=>s.percent)||[]);
   const breaks=isCDI?[[0,1,2],[3,4,5]]:[[0,1,2,3],[4,5,6,7]];
   breaks.forEach((part,i)=>{
    body+=para(isCDI?(i===0?"Общий показатель и шкалы 1-2":"Шкалы 3-5")
     :(i===0?"Факторы 1-4":"Факторы 5-8"),"sub");
    const subsetColumns=[columns[0],columns[1],...part.map(j=>columns[j+2])];
    const subsetRows=summary.map(row=>[row[0],row[1],...part.map(j=>row[j+2])]);
    const subsetMarks=valueRows.map(row=>part.map(j=>row[j]));
    body+=table(subsetColumns,subsetRows,isCDI?"cdi":"scores",subsetMarks);
   });
  }else{
   body+=table(columns,summary);
  }
  if(isCDI){
   body+=para("Расшифровка результатов","sub");
   body+=table(["Баллы","Уровень"],cdiLegend.slice().reverse().map(x=>[x.range,x.level]),
    "cdi-legend",cdiLegend.slice().reverse().map(x=>x.min));
  }
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
  }
  const doc='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
   '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+
   '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:bottom="850" w:left="700" w:right="700"/></w:sectPr></w:body></w:document>';
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
  return save(mode==="analysis"?"Metolaria_"+(isCDI?"CDI":"Phillips")+"_analiticheskaya_spravka.docx":"Metolaria_"+(isCDI?"CDI":"Phillips")+(mode==="class"?"_class":"_participant")+"_results.docx",zip,"application/vnd.openxmlformats-officedocument.wordprocessingml.document");
 }

 function csv(d,rows){
  if(type(d)==="cdi"){
   const header=["№","Участник","Общий показатель депрессии",...norms.scales.map(x=>x.name)];
   const data=rows.filter(r=>r.name?.trim()||done(d,r.answers)).map((r,i)=>{
    const v=cdiClassRow(d,r,i);
    return [v.no,v.name,...v.values];
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
   const canAnswer=cdiReady(d,r,rows,ctx.calcMode),lock=document.getElementById("cdiLockNote");
   if(lock){lock.hidden=canAnswer;if(!canAnswer)lock.textContent=ctx.calcMode==="class"&&!cdiRoster(rows)?"Сначала добавьте хотя бы одного участника в список.":!r.name?.trim()?"Сначала укажите участника.":!cdiContextReady(d,r,rows,ctx.calcMode)?"Сначала выберите класс или возраст ребенка.":"Выберите пол ребенка, чтобы открыть ввод ответов.";}
   document.querySelectorAll("[data-cp-sex]").forEach(btn=>{btn.disabled=!cdiContextReady(d,r,rows,ctx.calcMode);});
   document.querySelectorAll("input[data-cp-answer]").forEach(input=>{input.disabled=!canAnswer;input.title=canAnswer?"":"Выберите класс и пол до ввода ответов";});
   const res=document.getElementById("cpResult");if(res)res.innerHTML=result(d,r);
   const groupEl=document.getElementById("cpGroup");if(groupEl)groupEl.innerHTML=group(d,rows);
   const active=document.querySelector(".psy-mspss-person.active small");if(active)active.textContent=r.attendance==="absent"?"Отсутствует":n+"/"+size(d);
   const btn=document.getElementById("cpReportBottom");if(btn){const eligible=ctx.calcMode==="class"?rows.some(x=>!!scoring(d,x)):!!scoring(d,r);btn.disabled=!eligible;btn.classList.toggle("psy-mspss-waiting",!eligible);}
    const analyticBtn=document.getElementById("cpAnalyticBottom");if(analyticBtn){const eligible=!!analyticSummary(d,rows);analyticBtn.disabled=!eligible;analyticBtn.classList.toggle("psy-mspss-waiting",!eligible);}
  };
  window.PSY_ANALYTIC_SIGNATURES.bind(rows,()=>{const g=document.getElementById("cpGroup");if(g)g.innerHTML=group(d,rows);});
  document.getElementById("cpCurrentName")?.addEventListener("input",e=>{
   r.name=e.target.value;const active=document.querySelector(".psy-mspss-person.active span");if(active)active.textContent=r.name||"Участник";
   const option=document.querySelector('#cpBottomPerson option:checked');if(option)option.textContent=(ctx.rowIndex+1)+". "+(r.name||"Участник "+(ctx.rowIndex+1));
  });
  document.getElementById("cpCurrentName")?.addEventListener("change",()=>ctx.onRender?.());
  document.getElementById("cpAge")?.addEventListener("change",e=>{
   r.ageManual=!!e.target.value;
   r.ageYears=e.target.value?Number(e.target.value):gradeAge(classGrade(rows));
   update();
  });
  document.getElementById("cpSchoolGrade")?.addEventListener("change",e=>{
   const grade=e.target.value?Number(e.target.value):null;
   const age=gradeAge(grade);
   (ctx.calcMode==="class"?rows:[r]).forEach(person=>{
    person.schoolGrade=grade;
    if(!person.ageManual)person.ageYears=age;
   });
   ctx.onRender?.();
  });
  document.querySelectorAll("[data-cp-sex]").forEach(btn=>btn.addEventListener("click",()=>{
   if(type(d)==="cdi"&&!cdiContextReady(d,r,rows,ctx.calcMode))return;
   const firstAssignment=!["m","f"].includes(r.sex);
   r.sex=btn.dataset.cpSex;
   document.querySelectorAll("[data-cp-sex]").forEach(b=>{
    const active=b.dataset.cpSex===r.sex;b.classList.toggle("is-selected",active);b.setAttribute("aria-pressed",String(active));
   });
   update();
   if(type(d)==="cdi"&&ctx.calcMode==="class"&&firstAssignment){ctx.onGenderAssigned?.();return;}
   if(type(d)==="cdi"&&cdiReady(d,r,rows,ctx.calcMode))document.querySelector("input[data-cp-answer]:not(:disabled)")?.focus();
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
  document.getElementById("cpCdiInputMode")?.addEventListener("change",e=>{
   const mode=e.target.value;
   if(!cdiEntryModes.includes(mode)||(mode!=="score"&&!cdiKeyValid))return;
   r.cdiInputMode=mode; r.cdiInputModeInherited=false; // Only visible form changes.
   if(ctx.calcMode==="class")rows.forEach(person=>{
    if(person!==r&&(!person.cdiInputMode||person.cdiInputModeInherited)){
     person.cdiInputMode=mode;person.cdiInputModeInherited=true;
    }
   });
   ctx.onRender?.();
  });
  const inputs=[...document.querySelectorAll("input[data-cp-answer]")];
  const next=(i)=>{for(let j=i+1;j<inputs.length;j++)if(!inputs[j].disabled){inputs[j].focus();return;}document.getElementById("cpNext")?.focus();};
  function setInput(field,val){
   if(!cdiReady(d,r,rows,ctx.calcMode))return false;
   const i=Number(field.dataset.cpAnswer),mode=type(d)==="cdi"?cdiEntryMode(r):"score";
   const normalized=String(val).trim().toUpperCase();
   const points=type(d)==="cdi"?cdiDecode(mode,i,normalized):null;
   if(normalized!==""&&(type(d)==="cdi"?points===null:!["0","1"].includes(normalized)))return false;
   field.value=normalized;
   r.answers[i]=normalized===""?null:type(d)==="cdi"?points:normalized==="1"?"yes":"no";
   const card=field.closest(".psy-mspss-item");card?.classList.toggle("is-complete",normalized!=="");card?.classList.toggle("is-missing",normalized==="");update();
   return true;
  }
  inputs.forEach((field,i)=>{
   field.addEventListener("input",()=>{
    const mode=type(d)==="cdi"?cdiEntryMode(r):"score";
    const v=mode==="letter"?field.value.toUpperCase().replace(/[^АБВ]/g,"").slice(-1):
      field.value.replace(/[^0-9]/g,"").slice(-1);
    if(v!==""&&type(d)==="cdi"&&cdiDecode(mode,i,v)===null){setInput(field,"");return;}
    if(!setInput(field,v)){setInput(field,"");return;}
    if(v!=="")next(i);
   });
   field.addEventListener("keydown",e=>{
    if(e.key==="Backspace"&&!field.value&&i>0){e.preventDefault();inputs[i-1].focus();inputs[i-1].select();}
    else if(e.key==="ArrowRight"){e.preventDefault();next(i);}
    else if(e.key==="ArrowLeft"&&i>0){e.preventDefault();inputs[i-1].focus();}
   });
   field.addEventListener("paste",e=>{
    const mode=type(d)==="cdi"?cdiEntryMode(r):"score";
    const text=(e.clipboardData?.getData("text")||"").toUpperCase();
    const pattern=mode==="letter"?/^[АБВ\s,;]+$/:mode==="position"?/^[123\s,;]+$/:type(d)==="cdi"?/^[012\s,;]+$/:/^[01\s,;]+$/;
    if(!pattern.test(text))return;
    const tokens=text.replace(/[\s,;]/g,"").split("");
    if(!tokens.length||tokens.some((v,j)=>i+j>=inputs.length||(type(d)==="cdi"?cdiDecode(mode,i+j,v)===null:!["0","1"].includes(v))))return;
    e.preventDefault();
    tokens.forEach((v,j)=>{if(inputs[i+j]&&!inputs[i+j].disabled)setInput(inputs[i+j],v)});
    inputs[Math.min(inputs.length-1,i+tokens.length)]?.focus();
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
"use strict";
/* Source-aligned classroom screens for Eysenck (40), Lazarus (50), Razuvaeva (29).
   Self-report scores are descriptive, never an automatic suicide risk classification. */
(function(){
const m=window.PSY_SEMESTER_2026,base=window.PSY_MATCH_MSPSS,items=window.PSY_SCHOOL_711_ITEMS;
if(!m||!base||!items)return;
const ids=["eysenck-40","lazarus-wcq50","razuvaeva-osr29"];
const supports=d=>!!d&&ids.includes(d.id);
const cfg=d=>m.methods.find(x=>x.id===d.id);
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const size=d=>cfg(d).n,limit=d=>cfg(d).max;
const present=(d,r)=>Array.from({length:size(d)},(_,i)=>r?.answers?.[i]).filter(v=>v!==null&&v!==undefined&&v!==""&&/^[0-9]$/.test(String(v))&&Number(v)<=limit(d)).length;
const scored=(d,r)=>r?.attendance!=="absent"&&present(d,r)===size(d)?m.score(d,r.answers,r):null;
const roster=rows=>rows.some(x=>!!x?.name?.trim());
const gradeOf=rows=>Number(rows.find(x=>Number(x.schoolGrade)>=7&&Number(x.schoolGrade)<=11)?.schoolGrade||0);
const ageOk=(d,r,rows,mode)=>{
 if(d.id!=="lazarus-wcq50")return mode==="class"?gradeOf(rows)>=7:Number(r?.schoolGrade)>=7;
 // A school grade does not prove a pupil's exact age. Ask for it per pupil.
 const age=r?.ageYears===null||r?.ageYears===undefined||r?.ageYears===""?null:Number(r.ageYears);
 return age!==null&&Number.isInteger(age)&&age>=14&&age<=90;
};
const ready=(d,r,rows,mode)=>!!r?.name?.trim()&&r.attendance!=="absent"&&(mode!=="class"||roster(rows))&&ageOk(d,r,rows,mode)&&(d.id!=="lazarus-wcq50"||["f","m"].includes(r.sex));
const topic=(d,i,r)=>d.id==="eysenck-40"&&r?.eysenckVersion==="block"?"Вопрос "+(i+1):items[d.id][i];
const opts=d=>d.id==="eysenck-40"?"0 – не подходит · 1 – бывает иногда · 2 – бывает часто":d.id==="lazarus-wcq50"?"0 – никогда · 1 – редко · 2 – иногда · 3 – часто":"0 – Нет · 1 – Да";
const childOpts=d=>d.id==="razuvaeva-osr29"?"Для каждого утверждения отметь «Да» или «Нет».":opts(d);
const tone=(d,s)=>d.id==="eysenck-40"?(s.raw<=7?"low":s.raw<=14?"middle":"high"):
 d.id==="lazarus-wcq50"?(s.tScore===null?"neutral":s.tScore<40?"low":s.tScore<=60?"middle":"high"):
 (s.percent<=33?"low":s.percent<=66?"middle":"high");
const label=(d,s)=>d.id==="razuvaeva-osr29"?"Без автоматического диагностического уровня":d.id==="eysenck-40"?(s.raw<=7?"Низкий уровень":s.raw<=14?"Средний уровень":"Высокий уровень"):(s.percent<=33?"До 33% максимума":s.percent<=66?"34-66% максимума":"Свыше 66% максимума");
const num=(d,s)=>d.id==="razuvaeva-osr29"?s.adjusted.toFixed(1).replace(".",","):d.id==="lazarus-wcq50"&&s.tScore!==null?String(s.tScore):String(s.raw);
const razKey=(d,r)=>d.id==="razuvaeva-osr29"?(r?.razuvaevaKey==="method-six"?"Б":"А"):"";
const razLabel=(d,r)=>razKey(d,r)?"Ключ "+razKey(d,r):"";
const maximum=(d,s)=>d.id==="razuvaeva-osr29"?(s.max*s.factor).toFixed(1).replace(".",","):String(s.max);
function result(d,r){
 if(r?.attendance==="absent")return '<section class="psy-711-result">Участник отсутствовал. Результаты не рассчитываются.</section>';
 const z=scored(d,r);if(!z)return '<section class="psy-711-result">Заполнено '+present(d,r)+' из '+size(d)+'. Для подсчета нужны все ответы.</section>';
 return '<section class="psy-711-result"><h3>Результаты участника'+(d.id==="razuvaeva-osr29"?" · "+razLabel(d,r):"")+'</h3><div class="psy-711-scale-grid">'+z.scales.map(s=>
 '<div class="psy-711-scale psy-711-'+tone(d,s)+'"><b>'+esc(s.name)+'</b><strong>'+(d.id==="lazarus-wcq50"&&s.tScore!==null?num(d,s)+" Т-балл":num(d,s)+' / '+maximum(d,s))+'</strong><span>'+
 esc(d.id==="razuvaeva-osr29"?"Коэффициент "+s.factor:
 d.id==="lazarus-wcq50"?(s.tScore!==null?"Сырой: "+s.raw+" / "+s.max+" · "+window.PSY_WCQ_NORMS_2026.level(s.tScore):"Сырой: "+s.raw+" / "+s.max+" · нормативный Т-балл недоступен"):label(d,s))+'</span>'+
 '<div class="psy-711-track"><span style="width:'+(d.id==="lazarus-wcq50"&&s.tScore!==null?Math.max(0,Math.min(100,s.tScore/90*100)):s.percent)+'%"></span></div></div>').join("")+'</div>'+
 (d.id==="razuvaeva-osr29"?'<p class="psy-711-safety">Показатели факторов не определяют вероятность суицида и не исключают опасности. При признаках угрозы необходима очная профессиональная оценка безопасности.</p>':
 '<p class="psy-mspss-small">'+(d.id==="eysenck-40"?"Диапазоны по каждой шкале: 0-7, 8-14, 15-20.":"Проценты показывают долю от максимума шкалы, а не возрастные нормативы или Т-баллы.")+'</p>')+'</section>';
}

function analytical711(d,rows){
 const total=rows.filter(r=>r?.name?.trim()||present(d,r)).length;
 const people=rows.filter(r=>!!scored(d,r)),n=people.length;
 if(!n)return null;
 // Different published keys must never be pooled into one classroom average.
 if(d.id==="razuvaeva-osr29"&&new Set(people.map(r=>razKey(d,r))).size>1)return null;
 const grade=people.find(r=>Number(r.schoolGrade)>=7&&Number(r.schoolGrade)<=11)?.schoolGrade,klass=String(rows.analyticClass||"").trim();
 const lines=[
  {kind:"title",text:"Аналитическая справка"},
  {kind:"subtitle",text:"По методике «"+cfg(d).name+"»"},
  {kind:"meta",text:klass?"Класс: "+klass:grade?"Класс: "+grade:"Класс не указан"},
  {kind:"body",text:"В обследовании приняли участие "+n+" из "+total+" учащихся ("+Math.round(100*n/total)+"%)."}
 ];
 if(rows.analyticSchool?.trim())lines.unshift({kind:"institution",text:String(rows.analyticSchool).trim()});
 const share=x=>x+" чел. ("+Math.round(100*x/n)+"%)";
 const scores=people.map(r=>scored(d,r));
 const names=scores[0].scales;
 if(d.id==="eysenck-40"){
  lines.push({kind:"body",text:"Распределение результатов по четырем шкалам самооценки психических состояний:"});
  names.forEach((factor,i)=>{
   const vals=scores.map(x=>x.scales[i].raw);
   const low=vals.filter(v=>v<=7).length,mid=vals.filter(v=>v>=8&&v<=14).length,high=vals.filter(v=>v>=15).length;
   lines.push({kind:"factor",text:factor.name+": низкий – "+share(low)+", средний – "+share(mid)+", высокий – "+share(high)+"."});
  });
  lines.push({kind:"body",text:"Уровни отражают выраженность соответствующих состояний по используемым границам методики и не являются диагнозом."});
 }else{
  const allNormed=d.id==="lazarus-wcq50"&&scores.every(x=>x.scales.every(v=>v.tScore!==null));
  const factors=names.map((factor,i)=>({name:factor.name,mean:scores.reduce((acc,x)=>acc+(allNormed?x.scales[i].tScore:(x.scales[i]?.percent||0)),0)/n})).sort((a,b)=>b.mean-a.mean);
  lines.push({kind:"body",text:d.id==="lazarus-wcq50"?
   (allNormed?"Средние стандартизированные Т-баллы по возрастно-половым нормам 14-60 лет:":"Не все участники имеют подходящие возрастно-половые нормы; приведена средняя доля максимума каждой шкалы:"):
   "Групповые средние значения наиболее выраженных факторов (в процентах от максимума шкалы):"});
  factors.slice(0,4).forEach(x=>lines.push({kind:"factor",text:x.name+" – "+Math.round(x.mean)+(allNormed?" Т-баллов":"%")+"."}));
  lines.push({kind:"body",text:d.id==="lazarus-wcq50"?
   (allNormed?"По таблицам Вассермана и соавт. (2009): Т менее 40 – редкое, от 40 до 60 – умеренное, свыше 60 – выраженное использование. Это не клинический диагноз.":"Проценты представлены только описательно, не как возрастные нормы. Для нормативных Т-баллов укажите возраст 14-60 лет и пол каждого участника."):
   "Факторные баллы не определяют вероятность суицида. Автоматическая категория риска не присваивается; при подозрении на угрозу необходима очная оценка безопасности."});
 }
 return {lines,n,total};
}
function analytical711Preview(d,rows){
 const summary=analytical711(d,rows);
 return summary?'<section class="psy-cp-analytic-preview psy-711-analytic"><h3>Аналитическая справка</h3>'+
  summary.lines.filter(x=>x.kind!=="title").map(x=>'<p class="psy-cp-analytic-'+x.kind+'">'+esc(x.text)+'</p>').join("")+
  window.PSY_ANALYTIC_SIGNATURES.html(rows)+'</section>':"";
}
function group(d,rows){
 const keys=(cfg(d).versions?.[0]?.scales||cfg(d).scales);
 return '<section class="psy-mspss-group psy-711-group psy-711-'+d.id+'"><h3>Результаты класса</h3><div class="psy-mspss-scroll"><table><thead><tr><th>№</th><th>Участник</th>'+keys.map(s=>'<th>'+esc(s.name)+'</th>').join("")+'</tr></thead><tbody>'+
 rows.filter(r=>r.name?.trim()||present(d,r)).map((r,i)=>{const z=scored(d,r);return '<tr><td>'+(i+1)+'</td><td>'+esc(r.name||"У-"+(i+1))+(d.id==="razuvaeva-osr29"?'<small style="display:block;font-size:11px">'+razLabel(d,r)+'</small>':"")+'</td>'+keys.map((s,j)=>{const v=z?.scales?.[j];return '<td class="psy-711-score-cell">'+(v?'<span class="psy-711-number psy-711-'+tone(d,v)+'">'+num(d,v)+'</span>'+(d.id==="lazarus-wcq50"?'<small style="display:block;font-size:11px">Сырой '+v.raw+'/'+v.max+'</small>':""):"")+'</td>'}).join("")+'</tr>'}).join("")+
 '</tbody></table></div>'+(d.id==="razuvaeva-osr29"?'<p class="psy-mspss-small">Цвет чисел обозначает только долю максимума по выбранному ключу, а не уровень суицидального риска. Категория риска автоматически не присваивается.'+
 (new Set(rows.filter(r=>!!scored(d,r)).map(r=>razKey(d,r))).size>1?' В группе выбраны разные ключи (А и Б). Приведите участников к одному ключу, иначе аналитическая справка не формируется.':'')+'</p>':d.id==="lazarus-wcq50"?'<p class="psy-mspss-small">Основные числа – стандартизированные Т-баллы (для возраста 14-60 лет при указанном поле), ниже – сырые баллы. Если возрастная норма недоступна, показан только сырой балл. Т менее 40 – редкое, 40-60 – умеренное, выше 60 – выраженное использование стратегии.</p>':"")+analytical711Preview(d,rows)+'</section>';
}
function calculator(d,ctx){
 const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],answers=r.answers||[],grade=gradeOf(rows),hasRoster=roster(rows),locked=!ready(d,r,rows,ctx.calcMode);
 let out='<section class="psy-mspss-calculator psy-711-calculator psy-711-'+d.id+'"><div class="calc-mode psy-mspss-modes"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
 if(ctx.calcMode==="class"){
 out+='<div class="psy-mspss-workspace"><aside class="psy-mspss-sidebar"><h3>Список учащихся</h3><label class="psy-cp-class-label">Класс<select id="school711Grade" '+(!hasRoster?"disabled":"")+'><option value="">Не выбран</option>'+
 [7,8,9,10,11].map(g=>'<option value="'+g+'" '+(Number(grade)===g?"selected":"")+'>'+g+' класс</option>').join("")+'</select></label>'+
 window.PSY_ANALYTIC_SIGNATURES.fields(rows)+
 '<label class="psy-mspss-label">Добавить участников</label><textarea id="school711Bulk" rows="5" placeholder="Ученик 01&#10;Ученик 02"></textarea>'+
 '<button type="button" class="btn primary psy-mspss-add" id="school711Add">Добавить в список</button><button type="button" class="btn psy-mspss-sort" id="school711Sort">По алфавиту А - Я</button><div class="psy-mspss-person-list">'+
 rows.map((x,i)=>'<div class="psy-mspss-person-row '+(x.sex==="f"?"psy-cp-girl":x.sex==="m"?"psy-cp-boy":"")+'"><button type="button" class="psy-mspss-person '+(ctx.rowIndex===i?"active":"")+'" data-711-person="'+i+'"><span>'+esc(x.name||"Участник "+(i+1))+'</span><small>'+(x.attendance==="absent"?"Отсутствовал":present(d,x)+"/"+size(d))+'</small></button>'+
 '<button type="button" class="psy-mspss-delete-person" title="Удалить участника" data-711-delete="'+i+'">×</button></div>').join("")+'</div></aside><div class="psy-mspss-entry">';
 }else out+='<div class="psy-mspss-entry">';
 out+='<label class="psy-mspss-name-field">Участник<input id="school711Name" type="text" value="'+esc(r.name||"")+'" placeholder="Имя или код"></label>';
 if(ctx.calcMode==="class")out+='<div class="psy-cp-current '+(r.sex==="f"?"psy-cp-girl":r.sex==="m"?"psy-cp-boy":"")+'"><span>'+(ctx.rowIndex+1)+' / '+rows.length+'</span><b>Сейчас: '+esc(r.name||"Участник "+(ctx.rowIndex+1))+'</b></div>';
 if(rows.genderNote&&ctx.calcMode==="class")out+='<p class="psy-cp-gender-feedback" role="status">'+esc(rows.genderNote)+'</p>';
 if(ctx.calcMode!=="class")out+='<label class="psy-cp-class-label">Класс<select id="school711Grade"><option value="">Не выбран</option>'+[7,8,9,10,11].map(g=>'<option value="'+g+'" '+(Number(r.schoolGrade)===g?"selected":"")+'>'+g+' класс</option>').join("")+'</select></label>';
 if(d.id==="lazarus-wcq50")out+='<div class="psy-cp-demographics"><label>Возраст (полных лет)<input id="school711Age" type="number" min="14" max="90" step="1" value="'+(Number(r.ageYears)>=14&&Number(r.ageYears)<=90?Number(r.ageYears):"")+'" placeholder="14-90"></label><div class="psy-cp-sex-field"><span>Пол участника</span><div class="psy-cp-sex-buttons" role="group" aria-label="Пол"><button type="button" class="btn psy-cp-sex-btn '+(r.sex==="f"?"is-selected":"")+'" data-711-sex="f" aria-pressed="'+(r.sex==="f")+'" '+(!hasRoster||!ageOk(d,r,rows,ctx.calcMode)?"disabled":"")+'>Девочка / женщина</button><button type="button" class="btn psy-cp-sex-btn '+(r.sex==="m"?"is-selected":"")+'" data-711-sex="m" aria-pressed="'+(r.sex==="m")+'" '+(!hasRoster||!ageOk(d,r,rows,ctx.calcMode)?"disabled":"")+'>Мальчик / мужчина</button></div></div></div>';
 if(d.id==="lazarus-wcq50")out+='<p class="psy-mspss-small">Возраст указывайте для каждого участника отдельно: класс не заменяет фактический возраст. Т-баллы доступны по нормам для 14-60 лет.</p>';
 if(locked)out+='<p class="psy-cdi-lock-note">'+(ctx.calcMode==="class"&&!hasRoster?"Сначала добавьте хотя бы одного участника.":!r.name?.trim()?"Сначала укажите участника.":!ageOk(d,r,rows,ctx.calcMode)?(d.id==="lazarus-wcq50"?"Укажите возраст участника (14-90 лет).":"Выберите класс перед вводом ответов."):"Укажите пол участника.")+'</p>';
 if(d.id==="razuvaeva-osr29")out+='<label class="psy-711-version">Ключ обработки<select id="school711RazKey">'+
 '<option value="kmc-seven" '+(r.razuvaevaKey!=="method-six"?"selected":"")+'>Ключ А – КМЦ (7 пунктов)</option>'+
 '<option value="method-six" '+(r.razuvaevaKey==="method-six"?"selected":"")+'>Ключ Б – методические материалы (6 пунктов)</option></select></label>'+
 '<p class="psy-mspss-small">Опубликованные ключи расходятся по пунктам 17 и 21. Ключ А сохраняет прежний расчет и выдает до 7,0 по социальному пессимизму. Ключ Б – до 6,0. Для всех участников одного обследования используйте одинаковый ключ.</p>';
 if(d.id==="eysenck-40")out+='<label class="psy-711-version">Редакция опросника<select id="school711Version">'+
 '<option value="interleaved" '+(r.eysenckVersion!=="block"?"selected":"")+'>Версия 2 – чередование шкал (твой бланк)</option>'+
 '<option value="block" '+(r.eysenckVersion==="block"?"selected":"")+'>Версия 1 – шкалы по блокам</option></select></label>';
 out+='<p class="psy-711-answer-key">'+esc(opts(d))+'</p><p class="psy-mspss-progress" id="school711Progress">Заполнено '+present(d,r)+' из '+size(d)+'</p>'+
 '<div class="psy-mspss-grid psy-711-grid">'+items[d.id].map((question,i)=>{const v=answers[i],filled=v!==null&&v!==undefined&&v!==""&&/^[0-9]$/.test(String(v))&&Number(v)<=limit(d);return '<label class="psy-mspss-item '+(filled?"is-complete":"is-missing")+'"><span><b>'+(i+1)+'.</b> '+esc(topic(d,i,r))+'</span>'+
 '<input type="text" inputmode="numeric" maxlength="1" autocomplete="off" data-711-answer="'+i+'" data-cp-answer="'+i+'" class="psy-mspss-score-input psy-711-input" value="'+(filled?v:"")+'" placeholder="0-'+limit(d)+'" '+(locked?"disabled":"")+'></label>'}).join("")+'</div>';
 if(ctx.calcMode==="class")out+='<div class="psy-711-advance"><button type="button" class="btn" id="school711Absent" '+(!hasRoster?"disabled":"")+' >'+(r.attendance==="absent"?"Вернуть в присутствующие":"Отсутствовал – следующий")+'</button><button type="button" class="btn primary" id="school711Next" '+(!hasRoster?"disabled":"")+' >Следующий участник →</button></div>';
 out+='<div id="school711Result">'+result(d,r)+'</div></div>';
 if(ctx.calcMode==="class")out+='</div><div id="school711Group">'+group(d,rows)+'</div>';
 return out+'</section>';
}
function guide(d){
 const mtd=cfg(d),sc=mtd.versions?.[0]?.scales||mtd.scales;
 const ins=d.id==="eysenck-40"?"Если состояние бывает часто – выбери 2, если редко – 1, если не подходит – 0.":
 d.id==="lazarus-wcq50"?"Вспомни трудную ситуацию и укажи, как часто ты действовал каждым способом: никогда, редко, иногда или часто.":
 "Прочитай утверждения. Если согласен – отметь «Да», если не согласен – «Нет».";
 return '<section class="psy-mspss-manual psy-711-manual"><h3>Цель</h3><p>'+esc(mtd.goal)+'</p><h3>Инструкция обследуемому</h3><div class="psy-mspss-script">'+esc(ins)+'</div><h3>Обработка</h3><p>'+esc(mtd.scoring)+'</p>'+
 '<h3>Шкалы</h3><div class="psy-mspss-key-wrap"><table class="psy-mspss-key"><thead><tr><th>Шкала</th><th>Пункты</th>'+(d.id==="razuvaeva-osr29"?"<th>Коэффициент</th>":"")+'</tr></thead><tbody>'+
 sc.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.q.join(", ")+'</td>'+(d.id==="razuvaeva-osr29"?'<td>'+s.factor+'</td>':"")+'</tr>').join("")+'</tbody></table></div>'+
 (d.id==="razuvaeva-osr29"?'<h3>Другой опубликованный ключ – Б</h3><p>Сохраняется тот же бланк из 29 вопросов, но меняются номера трех шкал. Для сопоставления выбирайте ключ по пособию, которым пользуетесь.</p><div class="psy-mspss-key-wrap"><table class="psy-mspss-key"><thead><tr><th>Шкала</th><th>Пункты (ключ Б)</th></tr></thead><tbody>'+
 [["Несостоятельность","2, 3, 6, 7, 21"],["Социальный пессимизм","5, 11, 13, 15, 22, 25"],["Антисуицидальный фактор","17, 19"]].map(row=>'<tr><td>'+row[0]+'</td><td>'+row[1]+'</td></tr>').join("")+'</tbody></table></div><p><a href="https://infourok.ru/o-provedenii-socialno-psihologicheskogo-testirovaniya-obuchayushihsya-8-9-klassov-5680637.html" target="_blank" rel="noopener noreferrer">Опубликованный альтернативный ключ</a></p>':"")+
 (d.id==="razuvaeva-osr29"?'<p class="psy-711-safety">При возможной угрозе безопасности требуется очная профессиональная оценка. Баллы опросника не заменяют ее.</p>':"")+
 '<div class="psy-mspss-manual-actions"><button type="button" class="btn" data-711-print="guide">Без бланка</button><button type="button" class="btn primary" data-711-print="combined">С бланком</button></div></section>';
}
function sheet(d){
 return '<section class="psy-mspss-student psy-711-student"><div class="psy-mspss-blank-head"><div><h3>Бланк ученика</h3><p>'+(d.id==="eysenck-40"?"Редакция 2 – чередование шкал. Для версии 1 нужен отдельный бланк.":"Формулировки утверждений и графа ответа")+'</p></div><button type="button" class="btn primary" data-711-print="blank">Посмотреть и распечатать</button></div>'+(d.id==="lazarus-wcq50"?"<p><b>Оказавшись в трудной ситуации, я...</b></p>":"")+'<p>'+esc(childOpts(d))+'</p>'+
 '<div class="psy-mspss-blank-scroll"><table class="psy-mspss-blank-table psy-711-sheet"><thead><tr><th>№</th><th>Утверждение</th><th>Ответ</th></tr></thead><tbody>'+
 items[d.id].map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(q)+'</td><td></td></tr>').join("")+'</tbody></table></div></section>';
}
function printable(d,mode){
 const md=cfg(d),b='<section class="'+(mode==="combined"?"newpage":"")+'"><h1>'+esc(md.name)+'</h1>'+(d.id==="eysenck-40"?"<p>Бланк версии 2</p>":"")+ '<p>Участник: ________________________ Класс: ______ Дата: ____________</p>'+
 '<p>'+(d.id==="lazarus-wcq50"?"Оказавшись в трудной ситуации, я...":"")+'</p><p>'+esc(childOpts(d))+'</p><table><thead><tr><th>№</th><th>Утверждение</th><th>Ответ</th></tr></thead><tbody>'+
 items[d.id].map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(q)+'</td><td></td></tr>').join("")+'</tbody></table></section>';
 const g='<h1>'+esc(md.name)+'</h1><h2>Цель</h2><p>'+esc(md.goal)+'</p><h2>Инструкция</h2><p>'+esc(md.instruction)+'</p><h2>Подсчет</h2><p>'+esc(md.scoring)+'</p><h2>Интерпретация</h2><p>'+esc(md.interpret)+'</p>';
 return '<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>'+esc(md.name)+'</title><style>@page{size:A4;margin:14mm}body{font:10pt/1.4 Arial}table{width:100%;border-collapse:collapse}td,th{border:1px solid #9bb2a5;padding:5px;vertical-align:top}td:first-child{width:35px}td:last-child{width:70px}tr{break-inside:avoid}.newpage{break-before:page}</style></head><body>'+(mode==="blank"?b:g)+(mode==="combined"?b:"")+'</body></html>';
}
function bind(d,ctx){
 document.querySelectorAll("[data-711-print]").forEach(el=>el.addEventListener("click",()=>{const output=printable(d,el.dataset["711Print"]),url=URL.createObjectURL(new Blob([output],{type:"text/html;charset=utf-8"})),tab=window.open(url,"_blank");if(!tab){const a=document.createElement("a");a.href=url;a.download="Metolaria_"+d.id+"_blank.html";a.click()}setTimeout(()=>URL.revokeObjectURL(url),60000)}));
 if(ctx.tab!=="score")return;
 const r=ctx.rows[ctx.rowIndex];if(!r)return;r.answers ||= [];
 const update=()=>{
  const p=document.getElementById("school711Progress");if(p)p.textContent="Заполнено "+present(d,r)+" из "+size(d);
  const res=document.getElementById("school711Result");if(res)res.innerHTML=result(d,r);
  const gr=document.getElementById("school711Group");if(gr)gr.innerHTML=group(d,ctx.rows);
  const button=document.getElementById("cpReportBottom");if(button){const eligible=ctx.calcMode==="class"?ctx.rows.some(x=>scored(d,x)):!!scored(d,r);button.disabled=!eligible;button.classList.toggle("psy-mspss-waiting",!eligible)}
   const analytic=document.getElementById("cpAnalyticBottom");if(analytic){const eligible=!!analytical711(d,ctx.rows);analytic.disabled=!eligible;analytic.classList.toggle("psy-mspss-waiting",!eligible);}
  const label=document.querySelector(".psy-mspss-person.active small");if(label)label.textContent=r.attendance==="absent"?"Отсутствовал":present(d,r)+"/"+size(d);
 };
 window.PSY_ANALYTIC_SIGNATURES.bind(ctx.rows,()=>{const area=document.getElementById("school711Group");if(area)area.innerHTML=group(d,ctx.rows);});
 document.getElementById("school711Name")?.addEventListener("input",e=>{r.name=e.target.value;const x=document.querySelector(".psy-mspss-person.active span");if(x)x.textContent=r.name;});
 document.getElementById("school711Name")?.addEventListener("change",()=>ctx.onRender?.());
 document.getElementById("school711Grade")?.addEventListener("change",e=>{const grade=e.target.value?Number(e.target.value):null;(ctx.calcMode==="class"?ctx.rows:[r]).forEach(x=>{x.schoolGrade=grade;});ctx.onRender?.()});
 document.getElementById("school711Age")?.addEventListener("change",e=>{const v=e.target.value.trim()===""?null:Number(e.target.value);r.ageYears=v!==null&&Number.isInteger(v)&&v>=14&&v<=90?v:null;ctx.onRender?.()});
 document.querySelectorAll("[data-711-sex]").forEach(btn=>btn.addEventListener("click",()=>{
  if(!r.name?.trim()||!ageOk(d,r,ctx.rows,ctx.calcMode))return;
  const initial=!["f","m"].includes(r.sex);
  r.sex=btn.dataset["711Sex"];
  if(ctx.calcMode==="class"&&initial&&ctx.onGenderAssigned){ctx.onGenderAssigned();return;}
  ctx.onRender?.();
 }));
 document.getElementById("school711RazKey")?.addEventListener("change",e=>{
  if(d.id!=="razuvaeva-osr29")return;
  const next=e.target.value==="method-six"?"method-six":"kmc-seven";
  if(r.razuvaevaKey===next)return;
  r.razuvaevaKey=next;ctx.onRender?.();
 });
 document.getElementById("school711Version")?.addEventListener("change",e=>{
  if((r.eysenckVersion||"interleaved")===e.target.value)return;
  if(present(d,r)&&!confirm("Редакции имеют другой порядок вопросов. Очистить ответы и сменить?")){e.target.value=r.eysenckVersion||"interleaved";return}
  r.eysenckVersion=e.target.value;r.answers=[];ctx.onRender?.();
 });
 document.getElementById("school711Add")?.addEventListener("click",()=>{const names=(document.getElementById("school711Bulk")?.value||"").split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean);if(names.length)ctx.onBulkAdd?.(names)});
 document.getElementById("school711Sort")?.addEventListener("click",()=>ctx.onSort?.((document.getElementById("school711Bulk")?.value||"").split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean)));
 document.querySelectorAll("[data-711-person]").forEach(el=>el.addEventListener("click",()=>ctx.onSelect?.(+el.dataset["711Person"])));
 document.querySelectorAll("[data-711-delete]").forEach(el=>el.addEventListener("click",()=>{if(confirm("Удалить участника с ответами?"))ctx.onDelete?.(+el.dataset["711Delete"])}));
 document.getElementById("school711Next")?.addEventListener("click",()=>ctx.onNext?.());
 document.getElementById("school711Absent")?.addEventListener("click",()=>{
  if(r.attendance==="absent"){r.attendance="present";ctx.onRender?.();return}
  if(present(d,r)&&!confirm("Исключить введенные ответы отсутствующего из подсчета?"))return;
  r.attendance="absent";ctx.onAbsentNext?.();
 });
 const fields=[...document.querySelectorAll("input[data-711-answer]")];
 const next=i=>{if(fields[i+1])fields[i+1].focus();else document.getElementById("school711Next")?.focus()};
 const set=(input,value)=>{if(!ready(d,r,ctx.rows,ctx.calcMode))return false;if(value!==""&&(!/^[0-9]$/.test(value)||+value>limit(d))){input.value=r.answers[+input.dataset["711Answer"]]??"";return false;}
  const i=+input.dataset["711Answer"];r.answers[i]=value===""?null:+value;input.value=value;const card=input.closest(".psy-mspss-item");
  card?.classList.toggle("is-complete",value!=="");card?.classList.toggle("is-missing",value==="");update();return true};
 fields.forEach((x,i)=>{x.addEventListener("input",()=>{const value=x.value.replace(/[^0-9]/g,"").slice(-1);if(set(x,value)&&value!=="")next(i)});
  x.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){e.preventDefault();next(i)}else if((e.key==="ArrowLeft"||e.key==="Backspace"&&!x.value)&&i>0){e.preventDefault();fields[i-1].focus()}});
  x.addEventListener("focus",()=>x.select());
  x.addEventListener("paste",e=>{const v=e.clipboardData?.getData("text")?.replace(/[\s,;]/g,"")||"";if(!v||![...v].every(a=>+a<=limit(d)))return;e.preventDefault();[...v].forEach((a,j)=>{if(fields[i+j])set(fields[i+j],a)});fields[Math.min(fields.length-1,i+v.length)]?.focus()});
 });
 update();
}

function csv(d,rows){
 const isWCQ=d.id==="lazarus-wcq50",scales=(cfg(d).scales||cfg(d).versions?.[0]?.scales||[]);
 const head=["№","Участник",...scales.flatMap(s=>isWCQ?[s.name+" (Т-балл)",s.name+" (сырой)"]:[s.name])];
 const cell=v=>{let x=String(v??"");if(/^\s*[=+@-]/.test(x))x="'"+x;return '"'+x.replace(/"/g,'""')+'"'};
 const lines=[head,...rows.map((r,i)=>{const scores=scored(d,r)?.scales||scales.map(()=>null);
  return [i+1,(r.name||"У-"+(i+1))+(d.id==="razuvaeva-osr29"?" ["+razLabel(d,r)+"]":""),...scores.flatMap(s=>isWCQ?[s?.tScore??"",s?.raw??""]:[s?num(d,s):""])];
 })];
 return "\uFEFF"+lines.map(row=>row.map(cell).join(";")).join("\r\n");
}
/* Create a real OOXML Word file without remote services. */
function report(d,rows,mode,index){
 const people=((mode==="class"||mode==="analysis")?rows:[rows[index]]).filter(Boolean);if(!people.length)return false;
 if(mode==="analysis"){if(!analytical711(d,rows))return false;}
 else if(mode!=="class"&&!scored(d,people[0]))return false;
 const x=s=>String(s??"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F<>&"']/g,ch=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&apos;"}[ch]||""));
 const para=s=>'<w:p><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">'+x(s)+'</w:t></w:r></w:p>';
 const cel=(v,color,head)=>'<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/>'+(head||color?"<w:b/>":"")+(color?'<w:shd w:val="clear" w:color="auto" w:fill="'+color+'"/><w:color w:val="111111"/>':"")+'</w:rPr><w:t xml:space="preserve">'+x(v)+'</w:t></w:r></w:p></w:tc>';
 const table=(matrix,fill=[])=>'<w:tbl><w:tblPr><w:tblBorders>'+["top","bottom","left","right","insideH","insideV"].map(k=>'<w:'+k+' w:val="single" w:sz="4"/>').join("")+'</w:tblBorders></w:tblPr>'+
 matrix.map((row,i)=>'<w:tr>'+row.map((v,j)=>cel(v,fill[i-1]?.[j],i===0)).join("")+'</w:tr>').join("")+'</w:tbl>';
 const scales=cfg(d).scales||cfg(d).versions?.[0]?.scales||[],rowsData=[],fill=[];
 for(let i=0;i<people.length;i++){
  const row=people[i],z=scored(d,row);
  rowsData.push([String(i+1),(row.name||"У-"+(i+1))+(d.id==="razuvaeva-osr29"?" ["+razLabel(d,row)+"]":""),...scales.map((s,j)=>{
   const v=z?.scales?.[j];if(!v)return "";
   return d.id==="lazarus-wcq50"?(v.tScore===null?"Сырой "+v.raw:"Т "+v.tScore+" (сырой "+v.raw+")"):num(d,v);
  })]);
  fill.push([null,null,...scales.map((s,j)=>{const factor=z?.scales?.[j];if(!factor)return null;
   if(d.id==="lazarus-wcq50"&&factor.tScore===null)return null;
   const kind=tone(d,factor);return kind==="high"?"FF6868":kind==="middle"?"FFF14D":"4BE878"})]);
 }
 const grade=people.find(r=>Number(r.schoolGrade)>=7&&Number(r.schoolGrade)<=11)?.schoolGrade;
 const analytic=mode==="analysis"?analytical711(d,rows):null;
 const analyticPara=v=>{
  const head=["title","subtitle","institution"].includes(v.kind);
  return '<w:p><w:pPr><w:jc w:val="'+(head?"center":v.kind==="meta"?"left":"both")+'"/>'+
   '<w:spacing w:after="155" w:line="335" w:lineRule="auto"/></w:pPr><w:r>'+
   '<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>'+
   '<w:sz w:val="'+(v.kind==="title"?32:28)+'"/>'+(head?"<w:b/>":"")+'</w:rPr>'+
   '<w:t xml:space="preserve">'+x(v.text)+'</w:t></w:r></w:p>';
 };
 let body;
 if(analytic)body=analytic.lines.map(analyticPara).join("")+window.PSY_ANALYTIC_SIGNATURES.word(rows);
 else{
  body=para(cfg(d).name)+para(mode==="class"?"Результаты "+(grade?grade+" класса":"класса"):"Результат участника")+para("Дата: "+new Date().toLocaleDateString("ru-RU"));
  body+=table([["№","Участник",...scales.map(s=>s.name)],...rowsData],fill);
  if(d.id==="eysenck-40")body+=para("Интервалы каждой шкалы:")+table([["Баллы","Уровень"],["0-7","Низкий"],["8-14","Средний"],["15-20","Высокий"]],[["E4F1FB","E4F1FB"],["FFF0CF","FFF0CF"],["F9DEDC","F9DEDC"]]);
  else if(d.id==="lazarus-wcq50")body+=para("Т – стандартные Т-баллы по таблицам Вассермана и соавт. (2009), с учетом пола и возраста 14-60 лет. В скобках – сырые баллы. Т<40 – редкое, 40-60 – умеренное, Т>60 – выраженное использование стратегии. Если нормы отсутствуют, показан только сырой балл.");
  else body+=para("Факторы представлены с коэффициентами. Это не расчет вероятности суицида; при необходимости нужна очная оценка безопасности.");
 }
 const documentXml='<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+
 '<w:sectPr>'+(analytic?'<w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:bottom="850" w:left="850" w:right="850"/>':'<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="680" w:bottom="680" w:left="680" w:right="680"/>')+'</w:sectPr></w:body></w:document>';
 const contentTypes='<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
 const rel='<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
 const encoder=new TextEncoder(),tab=new Uint32Array(256);
 for(let i=0;i<256;i++){let z=i;for(let j=0;j<8;j++)z=z&1?0xedb88320^(z>>>1):z>>>1;tab[i]=z>>>0}
 const crc=bytes=>{let z=0xffffffff;for(const b of bytes)z=tab[(z^b)&255]^(z>>>8);return(z^0xffffffff)>>>0};
 const u16=(b,i,v)=>{b[i]=v&255;b[i+1]=v>>>8&255},u32=(b,i,v)=>{u16(b,i,v);u16(b,i+2,v>>>16)};
 const join=arr=>{const b=new Uint8Array(arr.reduce((n,x)=>n+x.length,0));let i=0;for(const x of arr){b.set(x,i);i+=x.length}return b};
 const local=[],central=[];let offset=0;
 for(const [name,xml] of [["[Content_Types].xml",contentTypes],["_rels/.rels",rel],["word/document.xml",documentXml]]){
  const nameBytes=encoder.encode(name),bytes=encoder.encode(xml),hash=crc(bytes),header=new Uint8Array(30+nameBytes.length),dir=new Uint8Array(46+nameBytes.length);
  u32(header,0,0x04034b50);u16(header,4,20);u32(header,14,hash);u32(header,18,bytes.length);u32(header,22,bytes.length);u16(header,26,nameBytes.length);header.set(nameBytes,30);
  u32(dir,0,0x02014b50);u16(dir,4,20);u16(dir,6,20);u32(dir,16,hash);u32(dir,20,bytes.length);u32(dir,24,bytes.length);u16(dir,28,nameBytes.length);u32(dir,42,offset);dir.set(nameBytes,46);
  local.push(header,bytes);central.push(dir);offset+=header.length+bytes.length;
 }
 const directory=join(central),end=new Uint8Array(22);u32(end,0,0x06054b50);u16(end,8,central.length);u16(end,10,central.length);u32(end,12,directory.length);u32(end,16,offset);
 const archive=join([...local,directory,end]),url=URL.createObjectURL(new Blob([archive],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"}));
 const a=document.createElement("a");a.href=url;a.download=mode==="analysis"?"Metolaria_"+d.id+"_analiticheskaya_spravka.docx":"Metolaria_"+d.id+(mode==="class"?"_class":"_participant")+"_results.docx";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return true;
}
const old={supports:base.supports,scoring:base.scoring,done:base.done,bind:base.bind,group:base.group,report:base.report,csv:base.csv,calculator:m.calculator,instruction:m.instruction,materials:m.materials,printPage:m.printPage};
base.supports=d=>supports(d)||old.supports(d);
base.scoring=(d,r)=>supports(d)?scored(d,r):old.scoring(d,r);
base.done=(d,a)=>supports(d)?present(d,{answers:a}):old.done(d,a);
base.bind=(d,ctx)=>supports(d)?bind(d,ctx):old.bind(d,ctx);
base.group=(d,rows)=>supports(d)?group(d,rows):old.group(d,rows);
base.report=(d,rows,mode,index)=>supports(d)?report(d,rows,mode,index):old.report(d,rows,mode,index);
base.csv=(d,rows)=>supports(d)?csv(d,rows):old.csv(d,rows);
m.calculator=(d,ctx)=>supports(d)?calculator(d,ctx):old.calculator(d,ctx);
m.instruction=d=>supports(d)?guide(d):old.instruction(d);
m.materials=d=>supports(d)?sheet(d):old.materials(d);
m.printPage=(d,blank,combined)=>supports(d)?printable(d,combined?"combined":blank?"blank":"guide"):old.printPage(d,blank,combined);
window.PSY_SCHOOL_711_UI={supports,scored,present,result,group,calculator,guide,sheet,printable,csv,report};
})();
