"use strict";
/* Six editable positive-choice criteria. Records live in the method's existing
   account-scoped assessment rows, not in localStorage or a separate public store. */
(function(){
 const NAME="Социометрическое исследование класса";
 const D=window.PSY_FULL_METHODS?.[NAME],api=window.PSY_NEW_METHODS;
 if(!D||!api)return;
 const previous={calculator:api.calculator,bind:api.bind,materials:api.materials,
  instruction:api.instruction,processing:api.processing};
 const NONE="__none__";
 const DEFAULT=[
  "С кем ты хотел(а) бы сидеть за одной партой?",
  "Кого ты выбрал(а) бы в команду для школьного проекта?",
  "С кем ты хотел(а) бы работать в паре на уроке?",
  "С кем ты хотел(а) бы выполнять общее творческое задание?",
  "Кого ты пригласил(а) бы в команду для школьного мероприятия?",
  "С кем ты хотел(а) бы вместе готовить выступление?"
 ];
 let currentRows=null,viewCriterion=0,outsideComboListenerAdded=false;
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const csv=rows=>"\uFEFF"+rows.map(row=>row.map(cell=>{
  let value=String(cell??"");
  if(/^\s*[=+\-@]/.test(value))value="'"+value;
  return '"'+value.replace(/"/g,'""')+'"';
 }).join(";")).join("\r\n");
 const download=(name,rows)=>{
  const blob=new Blob([csv(rows)],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 const initial=()=>({name:"",answers:[]});
 const randomId=()=>typeof crypto!=="undefined"&&typeof crypto.randomUUID==="function"
  ?crypto.randomUUID():"socio-"+Math.random().toString(36).slice(2)+"-"+Date.now();
 const ensureIds=rows=>rows.forEach(r=>{if(String(r.name||"").trim()&&!r.socioId)r.socioId=randomId();});
 const members=rows=>rows.filter(r=>String(r.name||"").trim());
 const questions=rows=>{
  const stored=rows?.find(r=>Array.isArray(r.socioQuestions)&&r.socioQuestions.length===6)?.socioQuestions;
  return stored?stored.map((q,i)=>String(q??DEFAULT[i]).slice(0,220)):DEFAULT.slice();
 };
 const setQuestions=(rows,next)=>rows.forEach(r=>{r.socioQuestions=next.slice();});
 const picks=(r,q)=>Array.isArray(r.socioChoices?.[q])
  ?[0,1,2].map(i=>String(r.socioChoices[q][i]||"")):["","",""];
 const putPick=(r,q,i,value)=>{
  if(!Array.isArray(r.socioChoices))r.socioChoices=[];
  const values=picks(r,q);values[i]=value;r.socioChoices[q]=values;
 };
 function validPicks(row,q,ids){
  const values=picks(row,q);
  if(values.some(v=>!v))return null;
  const selected=values.filter(v=>v!==NONE);
  if(selected.some(v=>v===row.socioId||!ids.has(v)))return null;
  return new Set(selected).size===selected.length?selected:null;
 }
 function analyze(rows){
  ensureIds(rows);
  const people=members(rows),ids=new Set(people.map(r=>r.socioId));
  const result=questions(rows).map((question,q)=>{
   const answers=new Map(),incoming=new Map(people.map(p=>[p.socioId,0]));
   const mutual=new Map(people.map(p=>[p.socioId,0]));
   let total=0,pairs=0;
   for(const r of people){
    const selected=validPicks(r,q,ids);
    if(selected===null)continue;
    answers.set(r.socioId,new Set(selected));
    for(const id of selected){incoming.set(id,incoming.get(id)+1);total++;}
   }
   for(const [from,chosen] of answers)for(const to of chosen){
    if(from<to&&answers.get(to)?.has(from)){
     pairs++;mutual.set(from,mutual.get(from)+1);mutual.set(to,mutual.get(to)+1);
    }
   }
   return {question,answered:answers.size,total,pairs,incoming,mutual,edges:answers};
  });
  return {people,result};
 }
 const responseName=(id,people)=>id===NONE?"Никто":(people.find(p=>p.socioId===id)?.name||"");
 function repetition(row){
  const groups=new Map();
  for(let i=0;i<6;i++){
   const values=picks(row,i);
   if(values.some(v=>!v))continue;
   const ids=values.filter(v=>v!==NONE).sort();
   if(!ids.length)continue;
   const key=ids.join("|"),found=groups.get(key)||{count:0,ids};
   found.count++;groups.set(key,found);
  }
  return [...groups.values()].sort((a,b)=>b.count-a.count)[0]?.count||0;
 }
 function reviewMarkup(row){
  const status=row.socioReview?.status||"",reason=row.socioReview?.reason||"same",note=row.socioReview?.note||"";
  const repeats=repetition(row);
  return '<section class="psy-socio-review" aria-label="Заметки психолога о достоверности ответов">'+
   '<div class="psy-socio-review-head"><div><strong>Проверка ответов</strong><p>Повторение одних и тех же друзей – не доказательство неправды.</p></div>'+
   '<button type="button" id="psySocFlag" class="psy-socio-review-button '+(status?"is-flagged":"")+'" aria-pressed="'+(!!status)+'">'+
   (status?"Снять отметку":"Требует уточнения")+'</button></div>'+
   '<p id="psySocRepeatedHint" class="psy-socio-review-hint" '+(repeats<3?"hidden":"")+'>'+
   (repeats>=3?"Одни и те же ученики выбраны в "+repeats+" вопросах. Можно уточнить, различал ли ребенок предложенные ситуации.":"")+'</p>'+
   '<div id="psySocReviewFields" class="psy-socio-review-fields" '+(!status?"hidden":"")+'>'+
   '<label>Причина уточнения<select id="psySocReviewReason"><option value="same" '+(reason==="same"?"selected":"")+'>Повторяющиеся выборы</option>'+
   '<option value="instruction" '+(reason==="instruction"?"selected":"")+'>Неясно понимание вопросов</option>'+
   '<option value="other" '+(reason==="other"?"selected":"")+'>Другое наблюдение психолога</option></select></label>'+
   '<label>Статус<select id="psySocReviewStatus"><option value="needs-review" '+(status==="needs-review"?"selected":"")+'>Требует уточнения</option>'+
   '<option value="resolved" '+(status==="resolved"?"selected":"")+'>Уточнено</option></select></label>'+
   '<label class="psy-socio-review-note">Комментарий специалиста<textarea id="psySocReviewNote" maxlength="1000" rows="2" placeholder="Например: обсудить, чем отличаются работа в паре и проект">'+esc(note)+'</textarea></label></div>'+
   '<p class="psy-socio-note">Отметка не влияет на подсчет выборов и видна только в результатах специалиста.</p></section>';
 }
 function resultHTML(ctx){
  const {people,result}=analyze(ctx.rows);
  if(!people.length)return '<p>Добавьте список класса, чтобы начать обследование.</p>';
  const answered=people.reduce((sum,r)=>sum+result.filter((_,q)=>validPicks(r,q,new Set(people.map(p=>p.socioId)))!==null).length,0);
  const selected=Math.max(0,Math.min(5,viewCriterion)),s=result[selected];
  const perQuestion='<div class="psy-socio-summary-scroll"><table><thead><tr><th>№</th><th>Вопрос</th><th>Заполнено анкет</th><th>Выборов</th><th>Взаимных пар</th></tr></thead><tbody>'+
   result.map((v,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(v.question||"Вопрос не указан")+'</td><td>'+v.answered+' из '+people.length+'</td><td>'+v.total+'</td><td>'+v.pairs+'</td></tr>').join("")+'</tbody></table></div>';
  const details='<label class="psy-socio-detail-choice">Выбранный вопрос для анализа <select id="psySocCriterion">'+
   result.map((r,i)=>'<option value="'+i+'" '+(i===selected?"selected":"")+'>'+(i+1)+'. '+esc(r.question||"Без формулировки")+'</option>').join("")+'</select></label>'+
   '';
  return '<div class="psy-new-metrics"><span>Участников в классе <b>'+people.length+'</b></span>'+
   '<span>Ответов по вопросам <b>'+answered+' из '+(people.length*6)+'</b></span>'+
   '<span>Взаимных пар по выбранному вопросу <b>'+s.pairs+'</b></span></div>'+
   perQuestion+details+(api.sociometryReport?.render({people,result,selected,activeId:ctx.rows[ctx.rowIndex]?.socioId})||'')+
   '<p class="psy-socio-note">Подсчитываются только полностью заполненные ответы по конкретному вопросу. Вариант «Никто» – явный ответ, пустое поле – незавершенный ввод. Отсутствие входящих выборов не означает отвержения ребенка.</p>';
 }
 function blank(){
  const q=questions(currentRows);
  return '<section class="psy-new-print psy-socio-print"><h3>Лист ответов ученика</h3>'+
   '<p>Условный код: __________________ Класс: __________ Дата: __________</p>'+
   '<p>В каждом вопросе можно назвать до трех одноклассников, не выбирая себя. Если выбирать некого, напиши «Никто». Можно указать меньше трех человек.</p>'+
   q.map((text,i)=>'<div class="psy-socio-print-q"><strong>'+(i+1)+'. '+esc(text)+'</strong>'+
    '<p>1. __________________________________________</p><p>2. __________________________________________</p><p>3. __________________________________________</p></div>').join("")+
   '<p class="psy-new-micro">Ответы собираются индивидуально. Не показывайте выборы другим ученикам.</p></section>';
 }
 function calculator(d,ctx){
  if(d.methodType!=="sociometry")return previous.calculator(d,ctx);
  currentRows=ctx.rows;ensureIds(ctx.rows);
  if(ctx.calcMode!=="class"){
   return '<section class="psy-new-work psy-socio"><h3>Социометрия класса</h3>'+
    '<p>Выберите режим «Группа / класс», чтобы один раз внести список учащихся и затем заполнять шесть вопросов для каждого ребенка.</p>'+
    '<div class="calc-mode"><button type="button" class="btn primary" data-cmode="class">Группа / класс</button></div></section>';
  }
  const people=members(ctx.rows),r=ctx.rows[ctx.rowIndex]||ctx.rows[0],q=questions(ctx.rows);
  const active=people.some(x=>x.socioId===r?.socioId);
  const count=active?q.filter((_,i)=>validPicks(r,i,new Set(people.map(p=>p.socioId)))!==null).length:0;
  const questionCards=active?q.map((question,i)=>{
   const selected=picks(r,i),chosen=new Set(selected.filter(v=>v!==NONE));
   return '<section class="psy-socio-question"><div class="psy-socio-question-heading"><span class="psy-socio-number">'+(i+1)+'</span>'+
    '<h4 data-socio-title="'+i+'">'+esc(question||"Укажите текст вопроса")+'</h4>'+
    '<span class="psy-socio-question-status '+(validPicks(r,i,new Set(people.map(p=>p.socioId)))!==null?"is-ready":"is-pending")+'" data-socio-status="'+i+'">'+(validPicks(r,i,new Set(people.map(p=>p.socioId)))!==null?"Заполнено":"Не заполнено")+'</span></div>'+
    '<div class="psy-socio-picks">'+[0,1,2].map(k=>{
     const val=selected[k];
     const inputId='psySocInput'+i+'_'+k,optionId='psySocOptions'+i+'_'+k;
     const display=val===NONE?"Никто":(people.find(p=>p.socioId===val)?.name||"");
     return '<div class="psy-socio-pick"><label for="'+inputId+'">'+(k+1)+' выбор</label>'+
      '<div class="psy-socio-combo" data-socio-question="'+i+'" data-socio-slot="'+k+'">'+
      '<input id="'+inputId+'" class="psy-socio-typeahead" type="text" autocomplete="off" spellcheck="false" maxlength="120"'+
      ' placeholder="Написать или выбрать" value="'+esc(display)+'" role="combobox" aria-autocomplete="list"'+
      ' aria-expanded="false" aria-controls="'+optionId+'" aria-label="Вопрос '+(i+1)+', выбор '+(k+1)+'"'+
      ' data-selected="'+esc(val)+'">'+
      '<button type="button" class="psy-socio-drop" aria-label="Показать список учеников" title="Выбрать ученика"><span aria-hidden="true">⌄</span></button>'+
      '<div id="'+optionId+'" class="psy-socio-options" role="listbox" hidden></div></div></div>';
    }).join("")+'</div><div class="psy-socio-question-bottom"><button type="button" class="psy-socio-none-fill" data-socio-fill="'+i+'">Остальные – никто</button><span>Если выборов меньше трех, остальные поля можно заполнить вариантом «Никто».</span></div></section>';
  }).join(""):"";
  return '<section class="psy-new-work psy-socio"><div class="psy-socio-intro"><h3>Социометрия класса</h3>'+
   '<p>Шесть положительных вопросов. На каждый – три выбора из своего класса или «Никто». Ответы сохраняются в обследовании и учитываются отдельно по каждому вопросу.</p></div>'+
   '<div class="psy-socio-roster"><div class="psy-socio-roster-head"><strong>Список класса</strong><span>'+people.length+' учеников</span></div>'+
   '<details class="psy-socio-add" '+(!people.length?"open":"")+'><summary>Добавить учеников списком</summary>'+
   '<p class="psy-socio-note">Вставьте список из журнала – по одному имени или условному коду в строке. Повторы не добавляются.</p>'+
   '<textarea id="psySocAddNames" rows="4" placeholder="Ученик 01&#10;Ученик 02&#10;Ученик 03"></textarea>'+
   '<div class="class-actions"><button type="button" class="btn primary" id="psySocAdd">Добавить в класс</button></div></details>'+
   '<div id="psySocRosterMessage" role="status" class="psy-socio-message"></div>'+
   (people.length?'<div class="psy-socio-student-picker"><label>Выбранный ученик<select id="psySocPerson">'+
    ctx.rows.map((person,i)=>person.name?.trim()?'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(person.name)+'</option>':"").join("")+
    '</select></label><button type="button" class="btn" id="psySocNext">Следующий ученик</button></div>'+
    (active?'<label class="psy-socio-rename">Имя или код ученика<input id="psySocRename" maxlength="120" value="'+esc(r.name)+'"></label>':""):"")+
   '</div>'+
   '<details class="psy-socio-custom"><summary>Изменить формулировки 6 вопросов</summary>'+
   '<p class="psy-socio-note">Это редактируемые вопросы, а не стандартизованный авторский опросник. При изменении вопроса с уже введенными ответами программа предложит очистить только этот вопрос – остальные пять сохранятся.</p>'+
   q.map((question,i)=>'<label><span>Вопрос '+(i+1)+'</span><input type="text" maxlength="220" data-socio-edit="'+i+'" value="'+esc(question)+'"></label>').join("")+'</details>'+
   (active?'<div class="psy-socio-progress"><strong>'+esc(r.name)+'</strong><span id="psySocProgress">'+count+' из 6 вопросов заполнено</span></div>'+
    '<div class="psy-socio-questions">'+questionCards+'</div>'+reviewMarkup(r):
    '<p class="psy-socio-note">Добавьте учеников, затем выберите ребенка из списка.</p>')+
   '<div class="psy-socio-results"><h3>Сводка по классу</h3><div id="psySocResult">'+resultHTML(ctx)+'</div>'+
   '<div class="class-actions"><button type="button" class="btn" id="psySocRaw">Скачать ответы CSV</button>'+
   '<button type="button" class="btn" id="psySocSummary">Скачать сводку CSV</button><button type="button" class="btn primary psy-socio-save" id="psySocSave">Сохранить результат в профиль</button></div></div>'+
   '<p class="psy-socio-note">Данные учеников конфиденциальны. Для их хранения и последующего открытия используйте сохранение обследования в профиле. Не публикуйте результаты отдельного ребенка.</p></section>';
 }
 function bind(d,ctx){
  if(d.methodType!=="sociometry")return previous.bind(d,ctx);
  if(ctx.calcMode!=="class")return;
  const rows=ctx.rows;
  const message=s=>{const target=document.getElementById("psySocRosterMessage");if(target)target.textContent=s;};
  const refresh=()=>{
   const target=document.getElementById("psySocResult");
   if(target){target.innerHTML=resultHTML(ctx);bindDetails();}
   const people=members(rows),person=rows[ctx.rowIndex],ids=new Set(people.map(p=>p.socioId));
   const progress=document.getElementById("psySocProgress");
   if(progress&&person)progress.textContent=questions(rows).filter((_,i)=>validPicks(person,i,ids)!==null).length+" из 6 вопросов заполнено";
   document.querySelectorAll("[data-socio-status]").forEach(el=>{
    const ready=!!person&&validPicks(person,Number(el.dataset.socioStatus),ids)!==null;
    el.textContent=ready?"Заполнено":"Не заполнено";
    el.classList.toggle("is-ready",ready);el.classList.toggle("is-pending",!ready);
   });
   if(typeof updateRepetition==='function')updateRepetition();
  };
  function bindDetails(){
   document.getElementById("psySocCriterion")?.addEventListener("change",e=>{
    viewCriterion=Number(e.target.value)||0;refresh();
   });
   const {people,result}=analyze(ctx.rows);
   if(people.length)api.sociometryReport?.bind({people,result},refresh,Math.max(0,Math.min(5,viewCriterion)));
  }
  bindDetails();
  document.getElementById("psySocAdd")?.addEventListener("click",()=>{
   const text=document.getElementById("psySocAddNames")?.value||"";
   const names=[...new Set(text.split(/\r?\n|;/).map(n=>n.trim()).filter(Boolean))];
   if(!names.length){message("Добавьте хотя бы одного ученика.");return;}
   const known=new Set(members(rows).map(r=>r.name.trim().toLocaleLowerCase("ru")));
   const newNames=names.filter(n=>{const key=n.toLocaleLowerCase("ru");if(known.has(key))return false;known.add(key);return true;});
   if(!newNames.length){message("Эти ученики уже есть в списке.");return;}
   ctx.onBulkAdd?.(newNames.map(n=>n.slice(0,120)));
  });
  document.getElementById("psySocPerson")?.addEventListener("change",e=>{const i=Number(e.target.value);api.sociometryReport?.select?.(rows[i]?.socioId);ctx.onSelect?.(i);});
  document.getElementById("psySocNext")?.addEventListener("click",()=>ctx.onNext?.());
  document.getElementById("psySocRename")?.addEventListener("change",e=>{
   const name=e.target.value.trim();
   if(!name){e.target.value=rows[ctx.rowIndex].name;message("Имя или код не может быть пустым.");return;}
   if(rows.some((r,i)=>i!==ctx.rowIndex&&String(r.name||"").trim().toLocaleLowerCase("ru")===name.toLocaleLowerCase("ru"))){
    e.target.value=rows[ctx.rowIndex].name;message("Этот ученик уже есть в списке.");return;
   }
   rows[ctx.rowIndex].name=name;ctx.onSelect?.(ctx.rowIndex);
  });
  document.querySelectorAll("[data-socio-edit]").forEach(el=>el.addEventListener("change",()=>{
   const q=questions(rows),index=Number(el.dataset.socioEdit);
   const next=el.value.trim().slice(0,220),old=q[index];
   if(!next){el.value=old;message("Вопрос не может быть пустым.");return;}
   if(next===old)return;
   const answered=rows.some(r=>r.socioChoices?.[index]?.some(v=>v&&v!==""));
   if(answered&&!confirm("По этому вопросу уже есть ответы. Изменить формулировку и очистить только ответы по этому вопросу? Остальные пять вопросов сохранятся.")){
    el.value=old;return;
   }
   if(answered)rows.forEach(r=>{if(Array.isArray(r.socioChoices))r.socioChoices[index]=["","",""];});
   q[index]=next;setQuestions(rows,q);
   ctx.onSelect?.(ctx.rowIndex);
  }));
  document.querySelectorAll("[data-socio-fill]").forEach(btn=>btn.addEventListener("click",()=>{
   const row=rows[ctx.rowIndex],index=Number(btn.dataset.socioFill);
   picks(row,index).forEach((v,i)=>{if(!v)putPick(row,index,i,NONE);});
   ctx.onSelect?.(ctx.rowIndex);
  }));
  const normalize=x=>String(x||"").normalize("NFKC").toLocaleLowerCase("ru").replace(/ё/g,"е").trim();
  const allCombos=[...document.querySelectorAll(".psy-socio-combo")];
  const getCandidates=(combo,term)=>{
   const row=rows[ctx.rowIndex],q=Number(combo.dataset.socioQuestion),slot=Number(combo.dataset.socioSlot);
   const current=picks(row,q)[slot],used=new Set(picks(row,q).filter((v,i)=>i!==slot&&v&&v!==NONE));
   const matches=members(rows).filter(p=>p.socioId!==row.socioId&&!used.has(p.socioId)&&
    normalize(p.name).includes(normalize(term))).map(p=>({id:p.socioId,text:p.name}));
   return [{id:NONE,text:"Никто"},...matches];
  };
  const closeCombo=combo=>{
   const panel=combo.querySelector(".psy-socio-options"),input=combo.querySelector(".psy-socio-typeahead");
   panel.hidden=true;input.setAttribute("aria-expanded","false");
   combo.classList.remove("is-open");
  };
  const closeOther=keep=>allCombos.forEach(c=>{if(c!==keep)closeCombo(c)});
  const commit=(combo,id)=>{
   const row=rows[ctx.rowIndex],q=Number(combo.dataset.socioQuestion),slot=Number(combo.dataset.socioSlot);
   const allowed=getCandidates(combo,"").some(p=>p.id===id);
   if(!allowed){message("Этот ученик уже выбран или недоступен.");return;}
   putPick(row,q,slot,id);
   const input=combo.querySelector(".psy-socio-typeahead"),found=members(rows).find(p=>p.socioId===id);
   input.value=id===NONE?"Никто":found?.name||"";input.dataset.selected=id;
   closeCombo(combo);refresh();
   combo.querySelector(".psy-socio-drop")?.focus();
  };
  const drawOptions=(combo,term)=>{
   closeOther(combo);
   const panel=combo.querySelector(".psy-socio-options"),input=combo.querySelector(".psy-socio-typeahead");
   const options=getCandidates(combo,term);
   panel.replaceChildren();
   options.forEach((option,i)=>{
    const b=document.createElement("button");b.type="button";b.className="psy-socio-option";
    b.setAttribute("role","option");b.dataset.socioOption=option.id;
    b.textContent=option.text;if(option.id===NONE)b.classList.add("is-nobody");
    b.setAttribute("aria-selected",String(option.id===input.dataset.selected));
    b.addEventListener("mousedown",e=>e.preventDefault());
    b.addEventListener("click",()=>commit(combo,option.id));
    panel.append(b);
   });
   if(options.length===1&&normalize(term)&&normalize(term)!=="никто"){
    const hint=document.createElement("p");hint.className="psy-socio-no-matches";
    hint.textContent="Совпадений нет. Проверьте написание имени в списке класса.";
    panel.append(hint);
   }
   panel.hidden=false;input.setAttribute("aria-expanded","true");
   combo.classList.add("is-open");
   return options;
  };
  allCombos.forEach(combo=>{
   const input=combo.querySelector(".psy-socio-typeahead"),drop=combo.querySelector(".psy-socio-drop");
   input.addEventListener("focus",()=>drawOptions(combo,input.value===("Никто")?"":input.value));
   input.addEventListener("input",()=>{
    const row=rows[ctx.rowIndex],q=Number(combo.dataset.socioQuestion),slot=Number(combo.dataset.socioSlot);
    const current=picks(row,q)[slot];
    const shown=current===NONE?"Никто":(members(rows).find(p=>p.socioId===current)?.name||"");
    if(input.value!==shown&&current){putPick(row,q,slot,"");input.dataset.selected="";refresh();}
    drawOptions(combo,input.value);
   });
   input.addEventListener("keydown",e=>{
    if(e.key==="Escape"){closeCombo(combo);return;}
    if(e.key==="ArrowDown"||e.key==="ArrowUp"){
     e.preventDefault();
     if(combo.querySelector(".psy-socio-options").hidden)drawOptions(combo,input.value);
     const opts=[...combo.querySelectorAll(".psy-socio-option")];
     if(!opts.length)return;
     const cur=opts.indexOf(document.activeElement),step=e.key==="ArrowDown"?1:-1;
     const first=step>0&&input.value.trim()&&opts.length>1?1:(step<0?opts.length-1:0);
     opts[cur<0?first:(cur+step+opts.length)%opts.length].focus();return;
    }
    if(e.key==="Enter"){
     if(combo.querySelector(".psy-socio-options").hidden)drawOptions(combo,input.value);
     const match=getCandidates(combo,input.value);
     const exact=match.find(v=>normalize(v.text)===normalize(input.value));
     const pupil=match.find(v=>v.id!==NONE);
     const chosen=exact||pupil;
     if(chosen){e.preventDefault();commit(combo,chosen.id);}
     else{e.preventDefault();message("Выберите ученика из списка или вариант «Никто».");}
    }
   });
   drop.addEventListener("click",()=>{
    const open=!combo.querySelector(".psy-socio-options").hidden;
    if(open){closeCombo(combo);drop.focus({preventScroll:true});}
    else{drawOptions(combo,"");input.focus({preventScroll:true});}
   });
  });
  if(!outsideComboListenerAdded){
   outsideComboListenerAdded=true;
   document.addEventListener("pointerdown",e=>{
    if(e.target.closest?.(".psy-socio-combo"))return;
    document.querySelectorAll(".psy-socio-combo.is-open").forEach(combo=>{
     const panel=combo.querySelector(".psy-socio-options"),input=combo.querySelector(".psy-socio-typeahead");
     if(panel)panel.hidden=true;
     if(input)input.setAttribute("aria-expanded","false");
     combo.classList.remove("is-open");
    });
   });
  }
  const currentReview=()=>rows[ctx.rowIndex].socioReview||{};
  const updateReview=(patch)=>{
   const row=rows[ctx.rowIndex];row.socioReview={...currentReview(),...patch};
   window.dispatchEvent(new Event("psy-assessment-dirty"));
  };
  document.getElementById("psySocFlag")?.addEventListener("click",()=>{
   const row=rows[ctx.rowIndex],has=!!row.socioReview?.status;
   updateReview({status:has?"":"needs-review"});
   ctx.onSelect?.(ctx.rowIndex);
  });
  document.getElementById("psySocReviewReason")?.addEventListener("change",e=>updateReview({reason:e.target.value}));
  document.getElementById("psySocReviewStatus")?.addEventListener("change",e=>{
   updateReview({status:e.target.value});ctx.onSelect?.(ctx.rowIndex);
  });
  document.getElementById("psySocReviewNote")?.addEventListener("input",e=>updateReview({note:e.target.value.slice(0,1000)}));
  const updateRepetition=()=>{
   const count=repetition(rows[ctx.rowIndex]),hint=document.getElementById("psySocRepeatedHint");
   if(!hint)return;
   hint.hidden=count<3;
   hint.textContent=count>=3?"Одни и те же ученики выбраны в "+count+" вопросах. Можно уточнить, различал ли ребенок предложенные ситуации.":"";
  };
  document.getElementById("psySocSave")?.addEventListener("click",()=>ctx.onSave?.());
  document.getElementById("psySocRaw")?.addEventListener("click",()=>{
   const people=members(rows),q=questions(rows),ids=new Set(people.map(r=>r.socioId));
   const out=[["Ученик","Вопрос","Формулировка","1 выбор","2 выбор","3 выбор","Статус"]];
   people.forEach(r=>q.forEach((question,i)=>{
    out.push([r.name,i+1,question,...picks(r,i).map(id=>responseName(id,people)),
     validPicks(r,i,ids)!==null?"Заполнен":"Не завершен"]);
   }));
   download("Метолария_социометрия_ответы.csv",out);
  });
  document.getElementById("psySocSummary")?.addEventListener("click",()=>{
   const {people,result}=analyze(rows);
   const out=[["Вопрос","Формулировка","Ученик","Входящие выборы","Взаимные выборы","Заполнено анкет","Взаимных пар"]];
   result.forEach((s,i)=>people.forEach(p=>out.push([i+1,s.question,p.name,
    s.incoming.get(p.socioId),s.mutual.get(p.socioId),s.answered,s.pairs])));
   download("Метолария_социометрия_сводка.csv",out);
  });
 }
 D.author="Социометрический подход Я. Л. Морено; редактируемая групповая форма Метоларии";
 D.kind="Групповая социометрическая процедура";
 D.count="6 редактируемых вопросов, до 3 выборов в каждом";
 D.goal="Изучение предпочитаемых партнеров по шести положительным критериям взаимодействия в классе.";
 D.instructions="Для каждого вопроса выбери до трех одноклассников. Можно выбрать меньше трех человек или никого. Не выбирай себя и не повторяй одно имя в рамках вопроса.";
 D.scoring="Входящие положительные выборы и взаимные пары подсчитываются отдельно по каждому вопросу. Пустой ответ не равен выбору «Никто». В подсчет включаются только завершенные ответы по конкретному вопросу.";
 D.interpret="Ответы показывают предпочтения в конкретных ситуациях, а не постоянный статус ученика. Отсутствие входящих выборов не равнозначно отвержению.";
 D.warning="Конфиденциальная процедура с шестью редактируемыми положительными критериями. Это не стандартизованная нормативная шкала. Не публикуйте результаты детей и не приписывайте им диагностические статусы.";
 D.version="SOCIOMETRY-CUSTOM-SIX-2026";
 D.guideFile=null;D.answerFile=null;
 D.indicators=["Входящие положительные выборы по каждому вопросу","Взаимные пары по каждому вопросу","Доля завершенных ответов"];
 api.calculator=calculator;
 api.bind=bind;
 api.materials=function(d,blankFlag){return d.methodType==="sociometry"?blank():previous.materials(d,blankFlag);};
 api.instruction=function(d){
  if(d.methodType!=="sociometry")return previous.instruction(d);
  return '<h3>Инструкция для ученика</h3><blockquote class="kid-instruction">'+esc(d.instructions)+'</blockquote>'+
   '<h3>Порядок проведения</h3><ol><li>Подготовьте единый список класса с условными кодами или именами.</li>'+
   '<li>При необходимости измените формулировки шести положительных вопросов до сбора ответов.</li>'+
   '<li>Каждому ученику предложите от 0 до 3 выборов для каждого вопроса, без самовыбора и повторов.</li>'+
   '<li>Собирайте ответы индивидуально. Не считайте пропущенные ответы выбором «Никто».</li>'+
   '<li>В обработке выберите класс, затем ученика, заполните все три поля для каждого вопроса.</li></ol>'+
   '<p class="notice">'+esc(d.warning)+'</p>';
 };
 api.processing=function(d){
  if(d.methodType!=="sociometry")return previous.processing(d);
  return '<h3>Обработка результатов</h3><p>'+esc(d.scoring)+'</p>'+
   '<p>«Никто» фиксирует осознанное отсутствие выбора на конкретной позиции. Незаполненное поле означает, что ответ еще не внесен. Самовыбор и повтор одного ученика в рамках вопроса исключаются.</p>'+
   '<p>Разные критерии не складываются в общий показатель популярности. Для каждого вопроса формируется собственная таблица и отдельная сводка.</p>'+
   '<p class="notice">'+esc(d.warning)+'</p>';
 };
})();
