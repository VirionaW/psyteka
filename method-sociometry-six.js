"use strict";
/* Six editable criteria: three positive, three negative. Records live in the method's existing
   account-scoped assessment rows, not in localStorage or a separate public store. */
(function(){
 const NAME="Социометрическое исследование класса";
 const D=window.PSY_FULL_METHODS?.[NAME],api=window.PSY_NEW_METHODS;
 if(!D||!api)return;
 const previous={calculator:api.calculator,bind:api.bind,materials:api.materials,
  instruction:api.instruction,processing:api.processing};
 const NONE="__none__";
 const OLD_DEFAULT=[
  "С кем ты хотел(а) бы сидеть за одной партой?",
  "Кого ты выбрал(а) бы в команду для школьного проекта?",
  "С кем ты хотел(а) бы работать в паре на уроке?",
  "С кем ты хотел(а) бы выполнять общее творческое задание?",
  "Кого ты пригласил(а) бы в команду для школьного мероприятия?",
  "С кем ты хотел(а) бы вместе готовить выступление?"
 ];
 const DEFAULT=[
  "С кем ты хотел бы сидеть за одной партой?",
  "Кого выбрал бы в команду для школьного проекта?",
  "С кем хотел бы проводить свободное время после уроков?",
  "С кем ты меньше всего хотел бы сидеть за одной партой?",
  "Кого меньше всего хотел бы выбирать в команду для школьного проекта?",
  "С кем меньше всего хотел бы проводить свободное время после уроков?"
 ];
 const PROTOCOL="sociometry-positive-negative-six-v1";
 const isNegative=q=>q>=3;
 const EQUAL=(a,b)=>String(a??"").trim()===String(b??"").trim();
 function ensureProtocol(rows){
  if(!Array.isArray(rows))return;
  rows.forEach(row=>{
   if(!row||!String(row.name||"").trim()||row.socioProtocolVersion===PROTOCOL)return;
   const previousQuestions=Array.isArray(row.socioQuestions)&&row.socioQuestions.length===6
    ?row.socioQuestions.map(String):OLD_DEFAULT.slice();
   const intended=previousQuestions.every((q,i)=>EQUAL(q,DEFAULT[i]));
   const previousChoices=Array.isArray(row.socioChoices)?row.socioChoices.map(a=>Array.isArray(a)?a.slice():[]):[];
   const changed=previousChoices.slice(2,6).some(a=>a.some(Boolean));
   if(!intended&&changed&&!row.socioLegacyArchive){
    // Save ALL prior responses and wording, including the first two questions,
    // before clearing answers that refer to DIFFERENT situations.
    row.socioLegacyArchive={questions:previousQuestions.slice(),choices:previousChoices.map(a=>a.slice())};
   }
   if(!intended&&changed){
    if(!Array.isArray(row.socioChoices))row.socioChoices=[];
    for(let q=2;q<6;q++)row.socioChoices[q]=["","",""];
   }
   row.socioQuestions=DEFAULT.slice();
   row.socioProtocolVersion=PROTOCOL;
  });
 }

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
 const absent=row=>row?.socioAbsent===true;
 const reviewPending=row=>row?.socioReview?.status==="needs-review";
 const excluded=row=>absent(row)||reviewPending(row);
 const questions=rows=>{
  ensureProtocol(rows);
  const stored=rows?.find(r=>r.socioProtocolVersion===PROTOCOL&&Array.isArray(r.socioQuestions)&&r.socioQuestions.length===6)?.socioQuestions;
  return stored?stored.map((q,i)=>String(q??DEFAULT[i]).slice(0,220)):DEFAULT.slice();
 };
 const setQuestions=(rows,next)=>rows.forEach(r=>{r.socioQuestions=next.slice();});
 const picks=(r,q)=>Array.isArray(r.socioChoices?.[q])
  ?[0,1,2].map(i=>String(r.socioChoices[q][i]||"")):["","",""];
 const putPick=(r,q,i,value)=>{
  if(!Array.isArray(r.socioChoices))r.socioChoices=[];
  const values=picks(r,q);values[i]=value;r.socioChoices[q]=values;
 };
 function observedPicks(row,q,ids){
  const values=picks(row,q),selected=values.filter(v=>v&&v!==NONE);
  if(selected.some(v=>v===row.socioId||!ids.has(v)))return null;
  if(new Set(selected).size!==selected.length)return null;
  return {selected,started:values.some(Boolean),complete:values.every(Boolean)};
 }
 function validPicks(row,q,ids){
  const entry=observedPicks(row,q,ids);
  return entry?.complete?entry.selected:null;
 }
 function analyze(rows){
  ensureProtocol(rows);ensureIds(rows);
  const people=members(rows),ids=new Set(people.map(r=>r.socioId));
  const excludedIds=new Set(people.filter(excluded).map(p=>p.socioId));
  const absentIds=new Set(people.filter(absent).map(p=>p.socioId));
  const reviewIds=new Set(people.filter(p=>reviewPending(p)&&!absent(p)).map(p=>p.socioId));
  const eligible=people.length-excludedIds.size;
  const result=questions(rows).map((question,q)=>{
   const answers=new Map(),incoming=new Map(people.map(p=>[p.socioId,0]));
   const mutual=new Map(people.map(p=>[p.socioId,0]));
   const completeIds=new Set(),partialIds=new Set();
   let total=0,pairs=0;
   for(const r of people){
    if(excluded(r))continue;
    const entry=observedPicks(r,q,ids);
    if(!entry?.started)continue;
    // Every recorded valid nomination counts, even when only 1–2 of 3 fields
    // were entered. Completeness is tracked separately from nominations.
    answers.set(r.socioId,new Set(entry.selected));
    (entry.complete?completeIds:partialIds).add(r.socioId);
    for(const id of entry.selected){incoming.set(id,incoming.get(id)+1);total++;}
   }
   for(const [from,chosen] of answers)for(const to of chosen){
    if(from<to&&answers.get(to)?.has(from)){
     pairs++;mutual.set(from,mutual.get(from)+1);mutual.set(to,mutual.get(to)+1);
    }
   }
   return {question,negative:isNegative(q),answered:completeIds.size,responded:answers.size,partial:partialIds.size,
    completeIds,partialIds,total,pairs,incoming,mutual,edges:answers,eligible,excludedIds,absentIds,reviewIds};
  });
  return {people,result,eligible,excludedIds,absentIds,reviewIds};
 }
 const responseName=(id,people)=>id===NONE?"Никто":(people.find(p=>p.socioId===id)?.name||"");
 function repetition(row){
  const groups=new Map();
  for(let i=0;i<3;i++){
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
   (repeats>=3?"Одни и те же ученики выбраны в "+repeats+" положительных вопросах. Можно уточнить, различал ли ребенок предложенные ситуации.":"")+'</p>'+
   '<div id="psySocReviewFields" class="psy-socio-review-fields" '+(!status?"hidden":"")+'>'+
   '<label>Причина уточнения<select id="psySocReviewReason"><option value="same" '+(reason==="same"?"selected":"")+'>Повторяющиеся выборы</option>'+
   '<option value="instruction" '+(reason==="instruction"?"selected":"")+'>Неясно понимание вопросов</option>'+
   '<option value="other" '+(reason==="other"?"selected":"")+'>Другое наблюдение психолога</option></select></label>'+
   '<label>Статус<select id="psySocReviewStatus"><option value="needs-review" '+(status==="needs-review"?"selected":"")+'>Требует уточнения</option>'+
   '<option value="resolved" '+(status==="resolved"?"selected":"")+'>Уточнено</option></select></label>'+
   '<label class="psy-socio-review-note">Комментарий специалиста<textarea id="psySocReviewNote" maxlength="1000" rows="2" placeholder="Например: обсудить, чем отличаются работа в паре и проект">'+esc(note)+'</textarea></label></div>'+
   '<p class="psy-socio-note">'+(status==="needs-review"?
    "Ответы этого ученика временно исключены из расчётов. При статусе «Уточнено» они автоматически вернутся в анализ.":
    "Статус «Требует уточнения» исключает ответы из расчётов, не удаляя их. «Уточнено» возвращает данные в анализ.")+'</p>'+
   '<details class="psy-socio-concern"><summary>Отдельные сведения о травле (не по социометрии)</summary>'+
   '<p class="psy-socio-note">Заполняется психологом только при наличии наблюдений или сообщений. Положительные выборы не определяют, кто является инициатором травли.</p>'+
   '<div class="psy-socio-concern-fields">'+
   '<label>Состояние проверки<select id="psySocConcernStatus">'+
   '<option value="" '+(!row.socioPeerConcern?.status?"selected":"")+'>Нет записи</option>'+
   '<option value="signal" '+(row.socioPeerConcern?.status==="signal"?"selected":"")+'>Есть сообщение – требует проверки</option>'+
   '<option value="verified" '+(row.socioPeerConcern?.status==="verified"?"selected":"")+'>Эпизод подтверждён отдельно</option></select></label>'+
   '<label>Роль в сообщении<select id="psySocConcernRole">'+
   '<option value="">Не установлена</option>'+
   '<option value="affected" '+(row.socioPeerConcern?.role==="affected"?"selected":"")+'>Пострадавший</option>'+
   '<option value="initiator" '+(row.socioPeerConcern?.role==="initiator"?"selected":"")+'>Предполагаемый инициатор</option>'+
   '<option value="witness" '+(row.socioPeerConcern?.role==="witness"?"selected":"")+'>Свидетель</option></select></label>'+
   '<label class="psy-socio-concern-comment">Факты / источник информации<textarea id="psySocConcernNote" maxlength="1200" rows="2" placeholder="Запишите наблюдение или источник сообщения">'+esc(row.socioPeerConcern?.note||"")+'</textarea></label></div></details></section>';
 }
 function resultHTML(ctx){
  const {people,result,eligible,excludedIds,absentIds,reviewIds}=analyze(ctx.rows);
  if(!people.length)return '<p>Добавьте список класса, чтобы начать обследование.</p>';
  const answered=result.reduce((sum,r)=>sum+r.answered,0);
  const partial=result.reduce((sum,r)=>sum+r.partial,0);
  const selected=Math.max(0,Math.min(5,viewCriterion)),s=result[selected];
  const perQuestion='<div class="psy-socio-summary-scroll"><table><thead><tr><th>№</th><th>Вопрос</th><th>Полностью</th><th>Частично</th><th>Учтено выборов</th><th>Взаимных пар</th></tr></thead><tbody>'+
   result.map((v,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(v.question||"Вопрос не указан")+'</td><td>'+
    v.answered+' из '+eligible+'</td><td>'+v.partial+'</td><td>'+v.total+'</td><td>'+v.pairs+'</td></tr>').join("")+'</tbody></table></div>';
  const details='<label class="psy-socio-detail-choice">Выбранный вопрос для анализа <select id="psySocCriterion">'+
   result.map((r,i)=>'<option value="'+i+'" '+(i===selected?"selected":"")+'>'+(i+1)+'. '+esc(r.question||"Без формулировки")+'</option>').join("")+'</select></label>'+
   '';
  return '<div class="psy-new-metrics"><span>Участников в классе <b>'+people.length+'</b></span>'+
   '<span>Полностью заполнено <b>'+answered+' из '+(eligible*6)+'</b></span>'+
   (partial?'<span>Частично (выборы учтены) <b>'+partial+'</b></span>':'')+
   (absentIds.size?'<span>Отсутствовали <b>'+absentIds.size+'</b></span>':'')+
   (reviewIds.size?'<span>На уточнении <b>'+reviewIds.size+'</b></span>':'')+
   '<span>Взаимных пар по выбранному вопросу <b>'+s.pairs+'</b></span></div>'+
   perQuestion+details+(api.sociometryReport?.render({people,result,selected,activeId:ctx.rows[ctx.rowIndex]?.socioId})||'')+
   '<p class="psy-socio-note">Каждый введённый действительный выбор учитывается, даже если остальные поля вопроса пустые. Частичные анкеты выделены отдельно. Отсутствовавшие и находящиеся на уточнении исключены как респонденты; выборы других детей в их адрес сохраняются.</p>';
 }
 function blank(){
  const q=questions(currentRows);
  return '<section class="psy-new-print psy-socio-print"><h3>Лист ответов ученика</h3>'+
   '<p>Условный код: __________________ Класс: __________ Дата: __________</p>'+
   '<p>В каждом вопросе можно назвать до трех одноклассников, не выбирая себя. Если выбирать некого, напиши «Никто». Можно указать меньше трех человек.</p>'+
   q.map((text,i)=>'<div class="psy-socio-print-q"><strong>'+(i+1)+'. '+esc(text)+'</strong>'+
    '<p><small>'+(isNegative(i)?"Отрицательный выбор":"Положительный выбор")+'</small></p>'+
    '<p>1. __________________________________________</p><p>2. __________________________________________</p><p>3. __________________________________________</p></div>').join("")+
   '<p class="psy-new-micro">Ответы собираются индивидуально. Не показывайте выборы другим ученикам.</p></section>';
 }
 function calculator(d,ctx){
  if(d.methodType!=="sociometry")return previous.calculator(d,ctx);
  currentRows=ctx.rows;ensureProtocol(ctx.rows);ensureIds(ctx.rows);
  if(ctx.calcMode!=="class"){
   return '<section class="psy-new-work psy-socio"><h3>Социометрия класса</h3>'+
    '<p>Выберите режим «Группа / класс», чтобы один раз внести список учащихся и затем заполнять шесть вопросов для каждого ребенка.</p>'+
    '<div class="calc-mode"><button type="button" class="btn primary" data-cmode="class">Группа / класс</button></div></section>';
  }
  const people=members(ctx.rows),r=ctx.rows[ctx.rowIndex]||ctx.rows[0],q=questions(ctx.rows);
  const active=people.some(x=>x.socioId===r?.socioId);
  const isAbsent=!!r&&absent(r);
  const count=active?q.filter((_,i)=>validPicks(r,i,new Set(people.map(p=>p.socioId)))!==null).length:0;
  const questionCards=active?q.map((question,i)=>{
   const selected=picks(r,i),chosen=new Set(selected.filter(v=>v!==NONE));
   return '<section class="psy-socio-question '+(isNegative(i)?"is-negative":"is-positive")+
    '"><div class="psy-socio-question-heading"><span class="psy-socio-number">'+(i+1)+'</span>'+
    '<h4 data-socio-title="'+i+'">'+esc(question||"Укажите текст вопроса")+
     ' <small class="psy-socio-question-type">'+(isNegative(i)?"Отрицательный выбор":"Положительный выбор")+'</small></h4>'+
    '<span class="psy-socio-question-status '+(validPicks(r,i,new Set(people.map(p=>p.socioId)))!==null?"is-ready":"is-pending")+'" data-socio-status="'+i+'">'+
     (validPicks(r,i,new Set(people.map(p=>p.socioId)))!==null?"Заполнено":selected.some(Boolean)?"Частично":"Не заполнено")+'</span></div>'+
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
   '<p>Вопросы 1–3 – положительные выборы, 4–6 – отрицательные. Введите имя или выберите из списка. «Никто» всегда доступен. После выбора курсор переходит к следующему полю.</p></div>'+
   '<div class="psy-socio-roster"><div class="psy-socio-roster-head"><strong>Список класса</strong><span>'+people.length+' учеников</span></div>'+
   '<details class="psy-socio-add" '+(!people.length?"open":"")+'><summary>Добавить учеников списком</summary>'+
   '<p class="psy-socio-note">Вставьте список из журнала – по одному имени или условному коду в строке. Повторы не добавляются.</p>'+
   '<textarea id="psySocAddNames" rows="4" placeholder="Ученик 01&#10;Ученик 02&#10;Ученик 03"></textarea>'+
   '<div class="class-actions"><button type="button" class="btn primary" id="psySocAdd">Добавить в класс</button></div></details>'+
   '<div id="psySocRosterMessage" role="status" class="psy-socio-message"></div>'+
   (people.length?'<div class="psy-socio-student-picker"><label>Выбранный ученик<select id="psySocPerson">'+
    ctx.rows.map((person,i)=>person.name?.trim()?'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(person.name)+
     (absent(person)?" – отсутствовал":reviewPending(person)?" – уточнение":"")+'</option>':"").join("")+
    '</select></label><button type="button" class="btn" id="psySocNext">Следующий ученик</button></div>'+
    (active?'<label class="psy-socio-rename">Имя или код ученика<input id="psySocRename" maxlength="120" value="'+esc(r.name)+'"></label>':""):"")+
   '</div>'+
   (active?'<div class="psy-socio-attendance"><button type="button" id="psySocAbsent" class="psy-socio-absence-button '+(isAbsent?"is-absent":"")+
     '" aria-pressed="'+isAbsent+'">'+(isAbsent?"Вернуть к обследованию":"Отметить: отсутствовал")+'</button>'+
     '<span>'+(isAbsent?"Анкета не учитывается, введённые ранее ответы сохранены.":"Если ребёнка не было, отметьте его отсутствие. Пустой бланк сам по себе не означает отсутствие.")+'</span></div>':"")+
   (people.some(p=>p.socioLegacyArchive?.choices?.slice(2).some(x=>x?.some(Boolean)))?
   '<details class="psy-socio-legacy" open><summary>Восстановление ответов из прежней анкеты (3–6)</summary>'+
   '<p><strong>Архив сохранён.</strong> При исправлении вопросов прежние ответы 3–6 были исключены из подсчётов. Если вы действительно вводили отрицательные ответы по вопросам 4–6, восстановите их без повторного ввода детей.</p>'+
   '<div class="psy-socio-restore-stats">'+
    [2,3,4,5].map(q=>'<span>Вопрос '+(q+1)+': <strong>'+
      people.reduce((n,p)=>n+(p.socioLegacyArchive?.choices?.[q]||[]).filter(v=>v&&v!==NONE).length,0)+
      '</strong> выборов в архиве</span>').join("")+'</div>'+
   '<div class="class-actions">'+
   '<button type="button" class="btn primary" id="psySocRestoreNegative">Восстановить ответы 4–6 как отрицательные</button>'+
   '<button type="button" class="btn" id="psySocRestoreThird">Восстановить ответы 3</button>'+
   '<button type="button" class="btn" id="psySocLegacyCSV">Скачать архив CSV</button></div>'+
   '<p>Восстанавливаются только пустые ответы; уже заполненные новые ответы не перезаписываются. Исходный архив остаётся нетронутым. Перед восстановлением подтвердите, что в архиве записаны ответы именно на эти вопросы.</p></details>':"")+
   '<details class="psy-socio-custom"><summary>Изменить формулировки 6 вопросов</summary>'+
   '<p class="psy-socio-note">Это редактируемые вопросы, а не стандартизованный авторский опросник. При изменении вопроса с уже введенными ответами программа предложит очистить только этот вопрос – остальные пять сохранятся.</p>'+
   q.map((question,i)=>'<label><span>Вопрос '+(i+1)+'</span><input type="text" maxlength="220" data-socio-edit="'+i+'" value="'+esc(question)+'"></label>').join("")+'</details>'+
   (active&&!isAbsent?'<div class="psy-socio-progress"><strong>'+esc(r.name)+'</strong><span id="psySocProgress">'+count+' из 6 вопросов заполнено</span></div>'+
    '<div class="psy-socio-questions">'+questionCards+'</div>'+reviewMarkup(r):
    active?'<div class="psy-socio-absent-panel"><strong>Отсутствовал на обследовании</strong><p>Ответы не вводятся, показатели не рассчитываются. Запись можно изменить кнопкой выше.</p></div>':
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
    el.textContent=ready?"Заполнено":person&&picks(person,Number(el.dataset.socioStatus)).some(Boolean)?"Частично":"Не заполнено";
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
  document.getElementById("psySocAbsent")?.addEventListener("click",()=>{
   const row=rows[ctx.rowIndex];
   row.socioAbsent=!absent(row);
   window.dispatchEvent(new Event("psy-assessment-dirty"));
   ctx.onSelect?.(ctx.rowIndex);
  });
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
  const focusAnswer=(question,slot)=>{
   const input=document.getElementById("psySocInput"+question+"_"+slot);
   if(!input)return;
   input.scrollIntoView?.({behavior:"smooth",block:"center"});
   input.focus({preventScroll:true});
  };
  const advanceAfter=(row,question,slot)=>{
   if(absent(row))return;
   const current=picks(row,question);
   let nextSlot=-1;
   for(let i=slot+1;i<3;i++)if(!current[i]){nextSlot=i;break;}
   if(nextSlot<0)for(let i=0;i<3;i++)if(!current[i]){nextSlot=i;break;}
   if(nextSlot>=0){focusAnswer(question,nextSlot);return;}
   for(let offset=1;offset<=5;offset++){
    const next=(question+offset)%6,empty=picks(row,next).findIndex(v=>!v);
    if(empty>=0){focusAnswer(next,empty);return;}
   }
   const ids=new Set(members(rows).map(p=>p.socioId));
   if(!questions(rows).every((_,q)=>validPicks(row,q,ids)!==null))return;
   const next=rows.findIndex((r,i)=>i>ctx.rowIndex&&String(r.name||"").trim()&&!absent(r));
   if(next>=0){
    ctx.onSelect?.(next);
    focusAnswer(0,0);
   }else{
    message("Все шесть вопросов заполнены. Это последний ученик.");
    document.getElementById("psySocFlag")?.focus?.();
   }
  };
  document.querySelectorAll("[data-socio-fill]").forEach(btn=>btn.addEventListener("click",()=>{
   const row=rows[ctx.rowIndex],index=Number(btn.dataset.socioFill);
   picks(row,index).forEach((v,i)=>{if(!v)putPick(row,index,i,NONE);});
   refresh();advanceAfter(row,index,2);
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
   if(id===NONE)for(let i=slot+1;i<3;i++)if(!picks(row,q)[i]){
    putPick(row,q,i,NONE);
    const later=document.getElementById("psySocInput"+q+"_"+i);
    if(later){later.value="Никто";later.dataset.selected=NONE;}
   }
   const input=combo.querySelector(".psy-socio-typeahead"),found=members(rows).find(p=>p.socioId===id);
   input.value=id===NONE?"Никто":found?.name||"";input.dataset.selected=id;
   closeCombo(combo);refresh();advanceAfter(row,q,slot);
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
    else{input.focus({preventScroll:true});drawOptions(combo,"");}
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
   updateReview(has?{status:"",reason:"",note:""}:{status:"needs-review"});
   ctx.onSelect?.(ctx.rowIndex);
  });
  document.getElementById("psySocReviewReason")?.addEventListener("change",e=>updateReview({reason:e.target.value}));
  document.getElementById("psySocReviewStatus")?.addEventListener("change",e=>{
   updateReview({status:e.target.value});ctx.onSelect?.(ctx.rowIndex);
  });
  document.getElementById("psySocReviewNote")?.addEventListener("input",e=>updateReview({note:e.target.value.slice(0,1000)}));
  const concern=patch=>{
   const row=rows[ctx.rowIndex],prev=row.socioPeerConcern||{};
   row.socioPeerConcern={...prev,...patch};
   window.dispatchEvent(new Event("psy-assessment-dirty"));
  };
  document.getElementById("psySocConcernStatus")?.addEventListener("change",e=>concern(
   e.target.value?{status:e.target.value}:{status:"",role:"",note:""}
  ));
  document.getElementById("psySocConcernRole")?.addEventListener("change",e=>concern({role:e.target.value}));
  document.getElementById("psySocConcernNote")?.addEventListener("input",e=>concern({note:e.target.value.slice(0,1200)}));
  const updateRepetition=()=>{
   const count=repetition(rows[ctx.rowIndex]),hint=document.getElementById("psySocRepeatedHint");
   if(!hint)return;
   hint.hidden=count<3;
   hint.textContent=count>=3?"Одни и те же ученики выбраны в "+count+" положительных вопросах. Можно уточнить, различал ли ребенок предложенные ситуации.":"";
  };
  document.getElementById("psySocSave")?.addEventListener("click",()=>ctx.onSave?.());
  const restoreLegacy=(indexes)=>{
   const people=members(rows);
   const archived=people.filter(r=>indexes.some(q=>(r.socioLegacyArchive?.choices?.[q]||[]).some(Boolean)));
   if(!archived.length){message("В архиве нет ответов на выбранные вопросы.");return;}
   const label=indexes.map(q=>q+1).join(", ");
   const questionText=indexes.map(q=>(q+1)+". "+questions(rows)[q]).join("\n");
   if(!confirm("Восстановить ответы по вопросам "+label+"?\n"+
     questionText+"\n\nПодтвердите, что эти ответы действительно были собраны на указанные вопросы. "+
     "Текущие заполненные поля заменяться НЕ будут, архив сохранится."))return;
   let restored=0,skipped=0;
   for(const row of people)for(const q of indexes){
    const source=row.socioLegacyArchive?.choices?.[q];
    if(!Array.isArray(source)||!source.some(Boolean))continue;
    const target=picks(row,q);
    if(target.some(Boolean)){skipped++;continue;}
    if(!Array.isArray(row.socioChoices))row.socioChoices=[];
    row.socioChoices[q]=[0,1,2].map(i=>String(source[i]||""));
    if(!row.socioRestoreLog)row.socioRestoreLog={};
    row.socioRestoreLog[q]={restoredFromArchive:true};
    restored++;
   }
   if(restored){
    window.dispatchEvent(new Event("psy-assessment-dirty"));
    ctx.onSelect?.(ctx.rowIndex);
    message("Восстановлено "+restored+" ответов по вопросам "+label+
     (skipped?". Заполненные новые ответы сохранены: "+skipped+".":"")+
     " Проверьте таблицу и сохраните обследование в профиль.");
   }else message("Ничего не перезаписано: соответствующие новые ответы уже заполнены.");
  };
  document.getElementById("psySocRestoreNegative")?.addEventListener("click",()=>restoreLegacy([3,4,5]));
  document.getElementById("psySocRestoreThird")?.addEventListener("click",()=>restoreLegacy([2]));
  document.getElementById("psySocLegacyCSV")?.addEventListener("click",()=>{
   const people=members(rows);
   const out=[["Ученик","Прежний номер вопроса","Прежняя формулировка","1 выбор","2 выбор","3 выбор"]];
   for(const r of people){
    const a=r.socioLegacyArchive;
    if(!a)continue;
    for(let q=2;q<6;q++){
     const vals=a.choices?.[q]||[];
     if(!vals.some(Boolean))continue;
     out.push([r.name,q+1,a.questions?.[q]||OLD_DEFAULT[q],
      ...[0,1,2].map(i=>responseName(vals[i]||"",people))]);
    }
   }
   download("Метолария_социометрия_архив_прежних_вопросов.csv",out);
  });
  document.getElementById("psySocRaw")?.addEventListener("click",()=>{
   const people=members(rows),q=questions(rows),ids=new Set(people.map(r=>r.socioId));
   const out=[["Ученик","Вопрос","Тип выбора","Формулировка","1 выбор","2 выбор","3 выбор","Статус ввода","Учет в расчете"]];
   people.forEach(r=>q.forEach((question,i)=>{
    out.push([r.name,i+1,isNegative(i)?"Отрицательный":"Положительный",question,...picks(r,i).map(id=>responseName(id,people)),
     validPicks(r,i,ids)!==null?"Заполнен":picks(r,i).some(Boolean)?"Частично":"Не заполнен",
     absent(r)?"Не участвовал":reviewPending(r)?"Исключено – требует уточнения":"Введённые выборы учитываются"]);
   }));
   download("Метолария_социометрия_ответы.csv",out);
  });
  document.getElementById("psySocSummary")?.addEventListener("click",()=>{
   const {people,result}=analyze(rows);
   const out=[["Вопрос","Тип выбора","Формулировка","Ученик","Входящие выборы","Взаимные выборы",
    "Полных анкет","Частичных анкет","Взаимных пар","Учёт ученика"]];
   result.forEach((s,i)=>people.forEach(p=>out.push([i+1,isNegative(i)?"Отрицательный":"Положительный",s.question,p.name,
    excluded(p)?"":s.incoming.get(p.socioId),excluded(p)?"":s.mutual.get(p.socioId),
    s.answered,s.partial,s.pairs,
    absent(p)?"Не участвовал":reviewPending(p)?"Исключено – требует уточнения":"Введённые выборы учитываются"])));
   download("Метолария_социометрия_сводка.csv",out);
  });
 }
 D.author="Социометрический подход Я. Л. Морено; редактируемая групповая форма Метоларии";
 D.kind="Групповая социометрическая процедура";
 D.count="6 вопросов: 3 положительных и 3 отрицательных, до 3 выборов в каждом";
 D.goal="Изучение положительных и отрицательных выборов одноклассников в учебной и внеучебной деятельности.";
 D.instructions="Для каждого вопроса выбери до трех одноклассников. Можно выбрать меньше трех человек или никого. Не выбирай себя и не повторяй одно имя в рамках вопроса.";
 D.scoring="Вопросы 1–3 – входящие положительные выборы (LP), вопросы 4–6 – входящие отрицательные выборы (LM). Выборы учитываются раздельно по каждому вопросу, включая частично заполненные; SP = LP - LM, SI = LP + LM как описательные суммы. Отсутствующие и находящиеся на уточнении не являются респондентами. Старые ответы на прежние вопросы 3–6 архивируются, а не приписываются новым формулировкам.";
 D.interpret="Категории по положительным выборам применяются только к вопросам 1–3 при достаточном числе анкет. Отрицательные выборы по вопросам 4–6 показываются отдельно и не повышают положительную популярность. Сведения о непринятии или возможной травле требуют дополнительной проверки.";
 D.warning="Рабочая форма с тремя положительными и тремя отрицательными критериями. Не является подтверждённым дословным авторским бланком. Отрицательные выборы не являются доказательством травли; результаты конфиденциальны.";
 D.version="SOCIOMETRY-POS-NEG-6-2026";
 D.guideFile=null;D.answerFile=null;
 D.indicators=["Положительные выборы (вопросы 1–3)","Отрицательные выборы (вопросы 4–6)",
 "SP – баланс выборов","SI – заметность через выборы",
 "Взаимные положительные и отрицательные выборы","Отсутствовавшие и незавершённые анкеты"];
 api.calculator=calculator;
 api.bind=bind;
 api.materials=function(d,blankFlag){return d.methodType==="sociometry"?blank():previous.materials(d,blankFlag);};
 api.instruction=function(d){
  if(d.methodType!=="sociometry")return previous.instruction(d);
  return '<h3>Инструкция для ученика</h3><blockquote class="kid-instruction">'+esc(d.instructions)+'</blockquote>'+
   '<h3>Порядок проведения</h3><ol><li>Подготовьте единый список класса с условными кодами или именами.</li>'+
   '<li>Вопросы 1–3 – положительные, 4–6 – отрицательные. Прочитайте их дословно из бланка.</li>'+
   '<li>Каждому ученику предложите от 0 до 3 выборов для каждого вопроса, без самовыбора и повторов.</li>'+
   '<li>Собирайте ответы индивидуально. Не считайте пропущенные ответы выбором «Никто».</li>'+
   '<li>В обработке выберите класс, затем ученика, заполните все три поля для каждого вопроса.</li></ol>'+
   '<p class="notice">'+esc(d.warning)+'</p>';
 };
 api.processing=function(d){
  if(d.methodType!=="sociometry")return previous.processing(d);
  return '<h3>Обработка результатов</h3><p>'+esc(d.scoring)+'</p>'+
   '<p>«Никто» фиксирует осознанное отсутствие выбора на конкретной позиции. Незаполненное поле означает, что ответ еще не внесен. Самовыбор и повтор одного ученика в рамках вопроса исключаются.</p>'+
   '<p>Имя выбранного ученика можно ввести через поиск или выбрать из списка. «Никто» остается доступным независимо от текста поиска. Отметка «Требует уточнения» не означает ложь, но временно исключает ответы этого ученика из расчётов.</p>'+
   '<p>Отсутствие отмечается вручную; пустой бланк не считается отсутствием. Категории «звезда», «предпочитаемый», «принимаемый», «изолированный» возможны только по положительным вопросам 1–3. По отрицательным вопросам 4–6 считаются отрицательные номинации отдельно.</p>'+
   '<p>«Изолированный» означает отсутствие положительных выборов, а не доказанное отвержение. Буллинг и роль ребёнка в нём по этим вопросам определить нельзя: для наблюдений предусмотрена отдельная запись специалиста.</p>'+
   '<p class="notice">'+esc(d.warning)+'</p>';
 };
})();
