"use strict";
/* Метолария. Descriptive sociometry: only actual positive nominations.
   No status thresholds or negative nominations are inferred. */
(function(){
 const api=window.PSY_NEW_METHODS;
 if(!api)return;
 const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 let selectedChild="",onlyMutual=false;
 const T=x=>Number.isInteger(x)?String(x):"";
 const csv=rows=>"\uFEFF"+rows.map(row=>row.map(cell=>{
  let v=String(cell??"");if(/^\s*[=+\-@]/.test(v))v="'"+v;
  return '"'+v.replace(/"/g,'""')+'"';
 }).join(";")).join("\r\n");
 function download(name,rows){
  const blob=new Blob([csv(rows)],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.download=name;a.href=url;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1200);
 }
 const absent=p=>p?.socioAbsent===true;
 const reviewing=p=>p?.socioReview?.status==="needs-review";
 const excluded=p=>absent(p)||reviewing(p);
 const clean=(p,s)=>{
  const unavailable=excluded(p);
  const own=unavailable?undefined:s.edges.get(p.socioId);
  const received=unavailable?null:(s.incoming.get(p.socioId)||0);
  const reciprocal=unavailable?null:(s.mutual.get(p.socioId)||0);
  const answered=own!==undefined;
  const complete=answered&&(s.completeIds?.has(p.socioId)??true);
  const partial=answered&&!complete;
  return {own,received,reciprocal,answered,complete,partial,
   excluded:unavailable,absent:absent(p),review:reviewing(p)};
 };
 // These four positive-choice categories are the Kolominsky thresholds;
 // they do not measure hostility, rejection, bullying or diagnoses.
 const categories=[
  {key:"star",name:"Звёзды",short:"Звезда",range:"5 и более выборов"},
  {key:"preferred",name:"Предпочитаемые",short:"Предпочитаемый",range:"3–4 выбора"},
  {key:"accepted",name:"Принимаемые",short:"Принимаемый",range:"1–2 выбора"},
  {key:"isolated",name:"Изолированные",short:"Изолированный",range:"0 выборов"}
 ];
 const coverageEnough=s=>s.answered>=5&&(s.eligible||0)>0&&s.answered/(s.eligible||1)>=0.75;
 const statusFor=(p,s)=>{
  if(absent(p))return {key:"absent",name:"Отсутствовал",count:null};
  if(reviewing(p))return {key:"review",name:"На уточнении",count:null};
  // Receiving selections does not require one's own questionnaire.
  const count=s.incoming.get(p.socioId)||0;
  if(s.negative)return {key:"negative",name:count+" отрицательных выборов",count};
  const provisional=!coverageEnough(s);
  if(count===0&&provisional)return {key:"pending",name:"0 положительных (пока)",count};
  const group=count>=5?categories[0]:count>=3?categories[1]:count>=1?categories[2]:categories[3];
  return {key:group.key,name:group.short+(provisional?" (предв.)":""),count,provisional};
 };
 function observation(p,s,n){
  const d=clean(p,s),status=statusFor(p,s);
  if(status.key==="absent")return "Отсутствовал на обследовании. Индивидуальные показатели не рассчитываются.";
  if(status.key==="review")return "Анкета временно исключена до уточнения.";
  const own=d.complete?"Анкета заполнена.":d.partial?"Собственная анкета частично заполнена.":
    "Собственная анкета ещё не заполнена.";
  if(s.negative)return "Получено "+d.received+" отрицательных выборов, взаимных – "+d.reciprocal+
   ". Это предпочтения одноклассников, а не доказательство травли. "+own;
  const votes=d.received+" положительных выборов, "+d.reciprocal+" взаимных связей.";
  if(status.key==="pending")return votes+" Недостаточно данных для вывода об изоляции. "+own;
  return votes+" "+status.name+" по данному положительному вопросу. "+own;
 }
 const concernLabel=p=>{
  const v=p.socioPeerConcern||{};
  if(!v.status)return "";
  const state=v.status==="verified"?"Эпизод подтверждён отдельно":"Сигнал проверяется";
  const role=v.role==="affected"?"пострадавший":v.role==="initiator"?"предполагаемый инициатор":
   v.role==="witness"?"свидетель":"роль не установлена";
  return state+" · "+role+(v.note?" · "+String(v.note).slice(0,1200):"");
 };
 const review=p=>{
  const v=p.socioReview||{};
  const status=v.status==="needs-review"?"Требует уточнения":v.status==="resolved"?"Уточнено":"";
  if(!status)return {status:"",reason:"",note:""};
  const reason=v.reason==="same"?"Повторяющиеся выборы":
   v.reason==="instruction"?"Уточнение инструкции":v.reason==="other"?"Наблюдение психолога":"";
  return {status,reason,note:String(v.note||"").slice(0,1000)};
 };
 const reviewLabel=p=>{
  const v=review(p);
  return v.status?(v.status+(v.reason?" · "+v.reason:"")+(v.note?" · "+v.note:"")):"Не отмечено";
 };
 const code=(p,i)=>String(i+1).padStart(2,"0");
 function matrix(people,s){
  const head='<thead><tr><th scope="col">Кто выбирает</th>'+
   people.map((p,i)=>'<th scope="col" title="'+E(p.name)+'">'+code(p,i)+'</th>').join("")+
   '<th scope="col">Сделано</th></tr></thead>';
  const body=people.map((p,i)=>{
   const disabled=excluded(p),selected=s.edges.get(p.socioId),wasAbsent=absent(p);
   const cells=people.map((other,j)=>{
    if(i===j)return '<td class="psy-socio-matrix-self" title="Самовыбор запрещен">×</td>';
    if(disabled)return '<td class="psy-socio-matrix-missing" title="'+(wasAbsent?"Отсутствовал":"На уточнении")+'">'+(wasAbsent?"О":"⏸")+'</td>';
    if(!selected)return '<td class="psy-socio-matrix-missing" title="Анкета не завершена">…</td>';
    if(!selected.has(other.socioId))return '<td class="psy-socio-matrix-blank" title="Выбор отсутствует">·</td>';
    const mutual=s.edges.get(other.socioId)?.has(p.socioId);
    return '<td class="'+(mutual?"psy-socio-matrix-mutual":"psy-socio-matrix-oneway")+
     '" title="'+E(p.name)+" → "+E(other.name)+(mutual?" (взаимно)":"")+'">'+(mutual?"↔":"→")+'</td>';
   }).join("");
   return '<tr><th scope="row">'+code(p,i)+'. '+E(p.name)+'</th>'+cells+
    '<td class="psy-socio-matrix-total">'+(wasAbsent?"О":disabled?"⏸":selected?
       selected.size+(s.partialIds?.has(p.socioId)?"*":""):"–")+'</td></tr>';
  }).join("");
  const footer='<tfoot><tr><th scope="row">Получено</th>'+
   people.map(p=>'<td>'+(absent(p)?"О":reviewing(p)?"⏸":(s.responded??s.answered)?T(s.incoming.get(p.socioId)):"–")+'</td>').join("")+
   '<td>'+s.total+'</td></tr></tfoot>';
  return '<div class="psy-socio-matrix-scroll"><table class="psy-socio-matrix">'+head+'<tbody>'+body+'</tbody>'+footer+'</table></div>'+
   '<p class="psy-socio-legend"><span class="psy-socio-legend-pair">↔ взаимный выбор</span><span>→ односторонний выбор</span>'+
   '<span>· нет выбора</span><span>… ответа нет</span><span>* ответ частичный</span><span>⏸ на уточнении</span><span>О отсутствовал</span></p>';
 }
 const short=(s,max=17)=>{const v=String(s||"").trim();return v.length>max?v.slice(0,max-1)+"…":v;};
 function sociogram(people,s){
  const target=people.find(p=>p.socioId===selectedChild)||people[0];
  if(!target)return '<p class="psy-socio-empty">Учеников пока нет.</p>';
  const status=statusFor(target,s);
  if(status.key==="absent")return '<p class="psy-socio-empty">Ученик отсутствовал. Личные связи не строятся, анкета не заполнялась.</p>';
  if(status.key==="review")return '<p class="psy-socio-empty">Анкета ученика исключена до уточнения. Связи не отображаются.</p>';
  if(!(s.responded??s.answered))return '<p class="psy-socio-empty">По этому вопросу пока нет учтённых ответов.</p>';
  const myChoices=s.edges.get(target.socioId)||new Set();
  const incoming=people.filter(p=>s.edges.get(p.socioId)?.has(target.socioId));
  const outgoing=people.filter(p=>myChoices.has(p.socioId));
  const mutual=new Set(incoming.filter(p=>myChoices.has(p.socioId)).map(p=>p.socioId));
  const incomingShown=onlyMutual?incoming.filter(p=>mutual.has(p.socioId)):incoming;
  const outgoingShown=onlyMutual?outgoing.filter(p=>mutual.has(p.socioId)):outgoing;
  const peers=(arr,dir)=>arr.length?
   '<ul class="psy-socio-focus-list">'+arr.map(p=>
    '<li><button type="button" data-socio-focus-id="'+E(p.socioId)+'">'+E(p.name)+'</button>'+
    (mutual.has(p.socioId)?'<small class="is-reciprocal">↔ взаимно</small>':'<small>'+
      (dir==="incoming"?"→ к ученику":"→ от ученика")+'</small>')+'</li>'
   ).join("")+'</ul>':
   '<p class="psy-socio-focus-empty">По выбранному фильтру связей нет</p>';
  return '<div class="psy-socio-focus-map">'+
   '<div class="psy-socio-focus-side"><h5>'+(s.negative?"Кто указал его отрицательно":"Кто его выбрал")+
     ' <b>'+incomingShown.length+'</b></h5>'+peers(incomingShown,"incoming")+'</div>'+
   '<div class="psy-socio-focus-center"><span class="psy-socio-focus-kicker">Ребёнок в центре</span>'+
   '<strong>'+E(target.name)+'</strong><span class="psy-socio-focus-status">'+E(status.name)+'</span>'+
   '<p>'+E(s.question)+'</p>'+
   '<div><b>'+myChoices.size+'</b><small>сделано</small><b>'+incoming.length+'</b><small>получено</small>'+
   '<b>'+mutual.size+'</b><small>взаимно</small></div>'+
   '</div>'+
   '<div class="psy-socio-focus-side"><h5>'+(s.negative?"Кого он указал отрицательно":"Кого он выбрал")+
     ' <b>'+outgoingShown.length+'</b></h5>'+peers(outgoingShown,"outgoing")+'</div></div>'+
   '<p class="psy-socio-legend">Показаны '+(s.negative?"отрицательные":"положительные")+
    ' номинации выбранного ученика. Взаимность означает выбор в обе стороны по одному критерию, а не дружбу или травлю.</p>';
 }
 function statusGroups(people,s){
  if(s.negative){
   const rank=people.filter(p=>!excluded(p)).map(p=>({p,count:s.incoming.get(p.socioId)||0}))
    .sort((a,b)=>b.count-a.count||a.p.name.localeCompare(b.p.name,"ru"));
   return '<section class="psy-socio-status-board is-negative"><div class="psy-socio-section-heading"><div>'+
    '<h4>Отрицательные выборы по этому вопросу</h4><p>Сколько раз ученика называли в ответе «меньше всего хотел бы»</p></div></div>'+
    '<div class="psy-socio-negative-list">'+rank.map(({p,count})=>'<button type="button" data-socio-focus-id="'+E(p.socioId)+'">'+
     E(p.name)+' <strong>'+count+'</strong></button>').join("")+'</div>'+
    '<p class="psy-socio-note">Отрицательные выборы не дают статусов «Звезда» или «Предпочитаемый». Номинации требуют осторожного обсуждения; сами по себе они не устанавливают травлю.</p></section>';
  }
  const groups=categories.map(c=>({...c,people:people.filter(p=>statusFor(p,s).key===c.key)}));
  const pending=people.filter(p=>!categories.some(c=>c.key===statusFor(p,s).key));
  const makeCard=c=>'<section class="psy-socio-status-group is-'+c.key+'"><div><strong>'+E(c.name)+'</strong>'+
   '<span>'+c.people.length+'</span></div><small>'+E(c.range)+'</small>'+
   (c.people.length?'<ul>'+c.people.map(p=>'<li><button type="button" data-socio-focus-id="'+E(p.socioId)+'">'+
    E(p.name)+'</button></li>').join("")+'</ul>':'<p>Нет учеников</p>')+'</section>';
  return '<section class="psy-socio-status-board"><div class="psy-socio-section-heading"><div>'+
   '<h4>Категории по положительному вопросу</h4>'+
   '<p>«Звезда» – 5 и более, «Предпочитаемый» – 3–4 выбора в одном положительном вопросе</p></div></div>'+
   '<div class="psy-socio-status-groups">'+groups.map(makeCard).join("")+
    (pending.length?'<section class="psy-socio-status-group is-other"><div><strong>Без категории</strong><span>'+
     pending.length+'</span></div><ul>'+pending.map(p=>'<li><button type="button" data-socio-focus-id="'+
      E(p.socioId)+'">'+E(p.name)+'</button> – '+E(statusFor(p,s).name)+'</li>').join("")+
    '</ul></section>':"")+'</div>'+
   '<p class="psy-socio-note">Категории относятся только к положительным вопросам 1–3. При неполном охвате результаты предварительны, а нулевой выбор не считается подтверждённой изоляцией. <a href="https://psyjournals.ru/journals/sociosphera/archive/2010_n2/35334" target="_blank" rel="noopener noreferrer">Основание категорий</a>.</p></section>';
 }
 function sixStats(person,result){
  if(excluded(person))return {excluded:true,counts:[],positive:null,negative:null,sp:null,si:null,
   uniquePos:null,uniqueNeg:null,posCriteria:null,negCriteria:null,starCriteria:null};
  const counts=result.map(r=>r.incoming.get(person.socioId)||0);
  const groupUnique=(start,end)=>{
   const ids=new Set();
   result.slice(start,end).forEach(r=>r.edges.forEach((chosen,from)=>{
    if(chosen.has(person.socioId))ids.add(from);
   }));
   return ids.size;
  };
  const positive=counts.slice(0,3).reduce((a,b)=>a+b,0);
  const negative=counts.slice(3,6).reduce((a,b)=>a+b,0);
  return {excluded:false,counts,positive,negative,sp:positive-negative,si:positive+negative,
   uniquePos:groupUnique(0,3),uniqueNeg:groupUnique(3,6),
   posCriteria:counts.slice(0,3).filter(v=>v>0).length,
   negCriteria:counts.slice(3,6).filter(v=>v>0).length,
   starCriteria:result.slice(0,3).filter(r=>statusFor(person,r).key==="star").length};
 }
 function overviewSix(people,result,forPrint=false){
  const ordered=people.map(person=>({person,stats:sixStats(person,result)}))
   .sort((a,b)=>Number(a.stats.excluded)-Number(b.stats.excluded)||
    (b.stats.positive||0)-(a.stats.positive||0)||
    a.person.name.localeCompare(b.person.name,"ru"));
  return '<section class="psy-socio-six-overview"><div class="psy-socio-section-heading"><div>'+
   '<h4>Итог по 6 вопросам: положительные и отрицательные отдельно</h4>'+
   '<p>LP – полученные положительные номинации (1–3), LM – отрицательные (4–6); SP = LP − LM, SI = LP + LM</p></div></div>'+
   '<div class="psy-socio-summary-scroll"><table class="psy-socio-six-table"><thead><tr>'+
   '<th>Ученик</th><th>LP (1–3)</th><th>LM (4–6)</th><th>SP</th><th>SI</th>'+
   '<th>Разных: + / −</th><th>«Звезда» по 1–3</th>'+
   (forPrint?'<th>По вопросам 1–3 / 4–6</th>':
    result.map((_,i)=>'<th class="'+(i>=3?"is-negative":"is-positive")+'">'+
     (i>=3?"− ":"+ ")+'В'+(i+1)+'</th>').join(""))+'</tr></thead><tbody>'+
   ordered.map(({person,stats})=>'<tr><th scope="row"><button type="button" class="psy-socio-name-link" data-socio-focus-id="'+
    E(person.socioId)+'">'+E(person.name)+'</button></th>'+
    (stats.excluded?'<td colspan="'+(forPrint?7:12)+'">'+(absent(person)?"Отсутствовал":"На уточнении")+
      ' – показатели не рассчитываются</td>':
     '<td class="psy-socio-six-main">'+stats.positive+'</td><td class="psy-socio-six-negative">'+stats.negative+
     '</td><td>'+stats.sp+'</td><td>'+stats.si+'</td>'+
     '<td>'+stats.uniquePos+' / '+stats.uniqueNeg+'</td><td>'+stats.starCriteria+'</td>'+
     (forPrint?'<td>'+stats.counts.slice(0,3).join(" / ")+' | '+stats.counts.slice(3).join(" / ")+'</td>':
      stats.counts.map((n,i)=>'<td>'+(i<3&&n>=5?'<strong class="psy-socio-count-star">★ '+n+'</strong>':n)+'</td>').join("")))+
   '</tr>').join("")+'</tbody></table></div>'+
   '<p class="psy-socio-note">LP, LM, SP и SI – описательные показатели полученных выборов, не диагнозы и не нормативный общий статус. Отрицательные ответы никогда не увеличивают положительную популярность.</p></section>';
 }
 function individual(people,result){
  const target=people.find(p=>p.socioId===selectedChild)||people[0];
  if(!target)return "";
  selectedChild=target.socioId;
  const isAbsent=absent(target),six=sixStats(target,result);
  return '<div class="psy-socio-individual"><div class="psy-socio-section-heading"><div><h4>Карточка ученика</h4>'+
   '<p>Положительные и отрицательные выборы по каждому из шести вопросов</p></div><label>Ученик <select id="psySocAnalysedPerson">'+
   people.map(p=>'<option value="'+E(p.socioId)+'" '+(p.socioId===target.socioId?"selected":"")+'>'+E(p.name)+
    (absent(p)?" – отсутствовал":"")+'</option>').join("")+
   '</select></label></div>'+
   (isAbsent?'<p class="psy-socio-empty">Отсутствовал на обследовании. Все шесть результатов пустые, статус не присваивается.</p>':"")+
   (!six.excluded?'<div class="psy-socio-person-six"><span><b>'+six.positive+'</b><small>положительных (LP)</small></span>'+
     '<span><b>'+six.negative+'</b><small>отрицательных (LM)</small></span>'+
     '<span><b>'+six.sp+'</b><small>баланс (SP)</small></span>'+
     '<span><b>'+six.si+'</b><small>заметность (SI)</small></span></div>':"")+
   '<div class="psy-socio-summary-scroll"><table class="psy-socio-person-table"><thead><tr><th>Вопрос</th><th>Сделал</th><th>Получил</th><th>Взаимно</th><th>Статус</th><th>Конкретный вывод</th></tr></thead><tbody>'+
   result.map((s,i)=>{
    const d=clean(target,s),st=statusFor(target,s);
    return '<tr><td><strong>'+(i+1)+'.</strong> '+E(s.question)+'</td>'+
     '<td>'+(d.answered?d.own.size:"–")+'</td><td>'+(d.excluded?"–":(s.responded??s.answered)?d.received:"–")+'</td>'+
     '<td>'+(d.excluded?"–":(s.responded??s.answered)?d.reciprocal:"–")+'</td>'+
     '<td><span class="psy-socio-status-badge is-'+st.key+'">'+E(st.name)+'</span></td>'+
     '<td>'+E(observation(target,s,people.length))+'</td></tr>';
   }).join("")+'</tbody></table></div>'+
   (review(target).status?'<p class="psy-socio-note"><strong>Уточнение:</strong> '+E(reviewLabel(target))+'</p>':"")+
   (concernLabel(target)?'<p class="psy-socio-concern-record"><strong>Отдельные сведения о травле:</strong> '+E(concernLabel(target))+'</p>':"")+
   '</div>';
 }
 function table(people,s){
  const header='<thead><tr><th>Ученик</th><th>Сделал</th><th>Получил</th><th>Взаимно</th><th>Показатель по критерию</th><th>Анкета</th><th>Сведения о травле</th><th>Конкретный анализ</th></tr></thead>';
  const body=people.map(p=>{
   const d=clean(p,s),st=statusFor(p,s);
   const attendance=st.key==="absent"?"Отсутствовал":st.key==="review"?"На уточнении":d.complete?"Заполнена":d.partial?"Частично":"Не заполнена";
   return '<tr><th scope="row"><button type="button" class="psy-socio-name-link" data-socio-focus-id="'+E(p.socioId)+'">'+E(p.name)+'</button></th>'+
    '<td>'+(d.answered?d.own.size:"–")+'</td>'+
    '<td>'+(d.excluded?"–":(s.responded??s.answered)?d.received:"–")+'</td>'+
    '<td>'+(d.excluded?"–":(s.responded??s.answered)?d.reciprocal:"–")+'</td>'+
    '<td><span class="psy-socio-status-badge is-'+st.key+'">'+E(st.name)+'</span></td>'+
    '<td><span class="psy-socio-answer-status '+(d.complete?"is-ready":"is-pending")+'">'+attendance+'</span></td>'+
    '<td class="psy-socio-concern-cell">'+(concernLabel(p)?'<span title="'+E(concernLabel(p))+'">'+
      E(concernLabel(p).slice(0,115))+(concernLabel(p).length>115?"…":"")+'</span>':"–")+'</td>'+
    '<td class="psy-socio-observation">'+E(observation(p,s,people.length))+'</td></tr>';
  }).join("");
  return '<div class="psy-socio-summary-scroll"><table class="psy-socio-children-table">'+header+'<tbody>'+body+'</tbody></table></div>';
 }
 function render({people,result,selected,activeId}){
  if(!selectedChild&&activeId)selectedChild=activeId;
  if(!people.length)return "";
  const s=result[selected]||result[0],eligible=s.eligible??people.filter(p=>!excluded(p)).length;
  const absentees=people.filter(absent),onReview=people.filter(p=>reviewing(p)&&!absent(p));
  const noResponses=people.filter(p=>!excluded(p)&&!s.edges.has(p.socioId));
  const partials=people.filter(p=>!excluded(p)&&s.partialIds?.has(p.socioId));
  const reached=people.filter(p=>!excluded(p)&&(s.incoming.get(p.socioId)||0)>0).length;
  const classStats='<div class="psy-socio-facts">'+
   '<span><strong>'+s.answered+' / '+eligible+'</strong><small>полностью заполнено</small></span>'+
   '<span><strong>'+s.total+'</strong><small>'+(s.negative?"отрицательных":"положительных")+' выборов</small></span>'+
   '<span><strong>'+s.pairs+'</strong><small>взаимных пар</small></span>'+
   '<span><strong>'+reached+'</strong><small>детей получили '+(s.negative?"отрицательные":"положительные")+' выборы</small></span></div>';
  const lists='<div class="psy-socio-roster-notices">'+
   (absentees.length?'<p><strong>Отсутствовали ('+absentees.length+'):</strong> '+absentees.map(p=>E(p.name)).join(", ")+
     ' – результаты пустые, статус не присваивается.</p>':"")+
   (onReview.length?'<p><strong>На уточнении ('+onReview.length+'):</strong> '+onReview.map(p=>E(p.name)).join(", ")+
     ' – анкеты временно исключены.</p>':"")+
   (partials.length?'<p><strong>Заполнено частично ('+partials.length+'):</strong> '+
    partials.map(p=>E(p.name)).join(", ")+'. Все введённые выборы учтены.</p>':"")+
   (noResponses.length?'<p><strong>Не ответили на вопрос ('+noResponses.length+'):</strong> '+
    noResponses.map(p=>E(p.name)).join(", ")+'.</p>':"")+'</div>';
  return '<div class="psy-socio-analytics">'+classStats+lists+
   overviewSix(people,result)+
   '<p class="psy-socio-criterion-warning"><strong>Вопрос № '+(selected+1)+' – '+
    (s.negative?"отрицательный":"положительный")+' выбор:</strong> '+
    E(s.question)+(s.negative?" Отрицательные выборы не дают статусов «Звезда» и «Предпочитаемый».":
    " Категории положительных выборов относятся только к этому вопросу.")+'</p>'+
   statusGroups(people,s)+
   '<div class="psy-socio-section-heading"><div><h4>Таблица детей · вопрос № '+(selected+1)+'</h4><p>'+E(s.question)+'</p></div>'+
   '<span class="psy-socio-coverage '+(s.answered<eligible?"is-pending":"is-ready")+'">'+
   (s.answered<eligible?"Данные предварительные":"Все учтённые анкеты завершены")+'</span></div>'+
   table(people,s)+
   '<section class="psy-socio-visual"><div class="psy-socio-section-heading"><div>'+
   '<h4>Схема '+(s.negative?"отрицательных":"положительных")+' связей одного ребёнка</h4>'+
   '<p>Только связи выбранного ученика, без пересекающихся стрелок</p></div>'+
   '<label class="psy-socio-filter"><input type="checkbox" id="psySocMutualOnly" '+(onlyMutual?"checked":"")+'><span>Только взаимные</span></label></div>'+
   sociogram(people,s)+'</section>'+
   individual(people,result)+
   '<details class="psy-socio-matrix-panel"><summary><span>Полная социоматрица</span><small>Показать все связи в таблице</small></summary>'+
   '<p class="psy-socio-note">Строка – кто '+(s.negative?"указал отрицательный выбор":"выбирает положительно")+
    ', столбец – кого указали. Отсутствующие и находящиеся на уточнении не считаются респондентами.</p>'+
   matrix(people,s)+'</details>'+
   '<div class="class-actions psy-socio-report-actions"><button type="button" class="btn" id="psySocAnalysisCSV">Скачать таблицу анализа детей</button>'+
   '<button type="button" class="btn" id="psySocMatrixCSV">Скачать социоматрицу</button>'+
   '<button type="button" class="btn" id="psySocPrintAnalysis">Посмотреть и распечатать А4</button></div>'+
   '<p class="psy-socio-note">Отрицательные выборы показывают избегаемые ситуации, а не доказанную травлю. Нельзя автоматически присваивать ярлыки «изгой», «отверженный» или «буллер».</p></div>';
 }
 function prepareCSV(people,result){
  const rows=[["Ученик","Вопрос","Тип критерия","Формулировка","Сделал выборов",
   "Получил выборов","Взаимных связей","Показатель по вопросу","Анкета",
   "Полностью заполнено анкет класса","Наблюдение",
   "Отметка психолога","Причина","Комментарий","Сведения о травле (отдельные наблюдения)",
   "LP по вопросам 1–3","LM по вопросам 4–6","SP (LP–LM)","SI (LP+LM)",
   "Разных положительных респондентов","Разных отрицательных респондентов",
   "Положительных вопросов со статусом «Звезда»"]];
  result.forEach((r,i)=>people.forEach(p=>{
   const d=clean(p,r),status=statusFor(p,r),six=sixStats(p,result);
   rows.push([p.name,i+1,r.negative?"Отрицательный":"Положительный",r.question,
    d.answered?d.own.size:"",
    d.excluded?"":(r.responded??r.answered)?d.received:"",
    d.excluded?"":(r.responded??r.answered)?d.reciprocal:"",status.name,
    absent(p)?"Отсутствовал":reviewing(p)?"На уточнении":d.complete?"Заполнена":d.partial?"Частично":"Не заполнена",
    r.answered+" из "+(r.eligible??people.length),observation(p,r,people.length),
    review(p).status,review(p).reason,review(p).note,concernLabel(p),
    six.excluded?"":six.positive,six.excluded?"":six.negative,
    six.excluded?"":six.sp,six.excluded?"":six.si,
    six.excluded?"":six.uniquePos,six.excluded?"":six.uniqueNeg,
    six.excluded?"":six.starCriteria]);
  }));
  return rows;
 }
 function prepareMatrix(people,s){
  return [[(s.negative?"Отрицательные выборы / кого указали":"Положительные выборы / кого выбрали"),...people.map(p=>p.name),"Сделано выборов"],...people.map(p=>{
   const chosen=s.edges.get(p.socioId),isAbsent=absent(p),isReview=reviewing(p);
   return [p.name,...people.map(other=>{
    if(p.socioId===other.socioId)return "×";
    if(isAbsent)return "Отсутствовал";
    if(isReview)return "На уточнении";
    if(!chosen)return "Анкета не завершена";
    if(!chosen.has(other.socioId))return "";
    return s.edges.get(other.socioId)?.has(p.socioId)?"Взаимно":s.negative?"Отрицательно":"Выбран";
   }),isAbsent?"Отсутствовал":isReview?"На уточнении":chosen?
    chosen.size+(s.partialIds?.has(p.socioId)?" (частично)":""):""];
  }),["Получено выборов",...people.map(p=>excluded(p)?"":(s.responded??s.answered)?s.incoming.get(p.socioId):""),
   (s.responded??s.answered)?s.total:""]];
 }
 function printView(people,result,selected){
  const s=result[selected];
  const absentees=people.filter(absent),reviews=people.filter(p=>reviewing(p)&&!absent(p));
  const content='<h1>Социометрия класса – аналитический отчет</h1>'+
    '<p class="note">Вопросы 1–3 – положительные, 4–6 – отрицательные. Данные конфиденциальны.</p>'+
    '<h2>Полнота обследования</h2><table><thead><tr><th>№</th><th>Тип</th><th>Вопрос</th><th>Завершено анкет</th><th>Получено выборов</th><th>Взаимных пар</th></tr></thead><tbody>'+
    result.map((r,i)=>'<tr><td>'+(i+1)+'</td><td>'+(r.negative?"Отрицательный":"Положительный")+
      '</td><td>'+E(r.question)+'</td><td>'+r.answered+' из '+(r.eligible??people.length)+
      (r.partial?" (частично: "+r.partial+")":"")+'</td><td>'+r.total+'</td><td>'+r.pairs+'</td></tr>').join("")+'</tbody></table>'+
    '<h2>LP, LM, SP и SI – раздельный итог по шести вопросам</h2>'+overviewSix(people,result,true)+
    '<h2>Посещаемость и достоверность</h2>'+
    '<p>Отсутствовали: '+(absentees.length?absentees.map(p=>E(p.name)).join(", "):"нет")+
    '. На уточнении: '+(reviews.length?reviews.map(p=>E(p.name)).join(", "):"нет")+'.</p>'+
    '<h2>Показатели по вопросу '+(selected+1)+'</h2><p>'+(s.negative?"Отрицательный":"Положительный")+
      ' выбор: '+E(s.question)+'</p>'+table(people,s)+
    '<h2>Социоматрица – вопрос '+(selected+1)+'</h2>'+
    (people.length<=16?matrix(people,s):'<p class="note">Для '+people.length+
     ' учеников социоматрица шире листа A4. Полная таблица доступна кнопкой «Скачать социоматрицу» в Метоларии.</p>')+
    '<h2>Индивидуальные показатели по шести вопросам</h2>'+
    people.map(p=>'<section class="person"><h3>'+E(p.name)+'</h3>'+
     (absent(p)?'<p class="note">Отсутствовал на обследовании – результаты не заполнены.</p>':"")+
     (review(p).status?'<p class="note">Отметка психолога: '+E(reviewLabel(p))+'</p>':"")+
     (concernLabel(p)?'<p class="note">Отдельные сведения о травле: '+E(concernLabel(p))+'</p>':"")+
     '<table><thead><tr><th>Вопрос</th><th>Сделал</th><th>Получил</th><th>Взаимно</th><th>Категория</th><th>Описание</th></tr></thead><tbody>'+
      result.map((r,i)=>{const d=clean(p,r);return '<tr><td>'+(i+1)+'</td><td>'+(d.answered?d.own.size:"–")+'</td><td>'+
       (d.excluded?"–":(r.responded??r.answered)?d.received:"–")+'</td><td>'+
       (d.excluded?"–":(r.responded??r.answered)?d.reciprocal:"–")+'</td><td>'+E(statusFor(p,r).name)+'</td><td>'+
       E(observation(p,r,people.length))+'</td></tr>';}).join("")+
     '</tbody></table></section>').join("")+
    '<p class="note">Категории «Звезда» (5+), «Предпочитаемый» (3–4) и другие относятся только к положительным вопросам 1–3, при достаточной полноте ответов. Номинации вопросов 4–6 являются отрицательными и не засчитываются как популярность. LP, LM, SP и SI – описательные величины. Наличие отрицательных выборов не доказывает травлю.</p>';
  const css='@page{size:A4;margin:13mm}*{box-sizing:border-box}body{font:10pt/1.4 Arial,sans-serif;color:#263a30;padding:4mm}h1{font-size:17pt}h2{font-size:12pt;margin:16px 0 7px}h3{font-size:11pt;margin:13px 0 6px}p{margin:5px 0 10px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #b5c8ba;padding:4px 5px;text-align:left;vertical-align:top;font-size:8.2pt;overflow-wrap:anywhere}tr{break-inside:avoid}.psy-socio-matrix-scroll,.psy-socio-summary-scroll{overflow:visible!important}.psy-socio-matrix{width:100%;table-layout:fixed}.psy-socio-matrix th,.psy-socio-matrix td{font-size:7pt;padding:2px;text-align:center}.psy-socio-matrix th:first-child{width:22%;text-align:left}.note,.psy-socio-note,.psy-socio-legend{font-size:8pt;color:#536457}.person{break-inside:avoid}button.psy-socio-name-link{border:0;background:transparent;padding:0;margin:0;font:inherit;color:inherit;font-weight:bold;text-align:left}.psy-socio-answer-status,.psy-socio-status-badge{white-space:normal}.psy-socio-concern-cell{font-size:8pt}@media print{body>p>button{display:none}}body>p>button{margin-top:18px;padding:10px 18px;border:1px solid #8cae91;border-radius:9px;cursor:pointer;background:#eaf3eb;color:#254934;font:inherit}';
  const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Метолария – отчет по социометрии</title><style>'+css+'</style></head><body>'+content+
    '<p><button onclick="window.print()">Печать</button></p></body></html>';
  const preview=window.open("","_blank");
  if(preview){
   preview.document.open();
   preview.document.write(html);
   preview.document.close();
   preview.focus();
  }else{
   const blob=new Blob([html],{type:"text/html;charset=utf-8"}),url=URL.createObjectURL(blob);
   const a=document.createElement("a");a.href=url;a.download="Метолария_социометрия_отчет_A4.html";
   document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
 }
 function bind(ctx,refresh,selected){
  const {people,result}=ctx, s=result[selected];
  document.getElementById("psySocAnalysedPerson")?.addEventListener("change",e=>{
   selectedChild=e.target.value;refresh();
  });
  document.getElementById("psySocMutualOnly")?.addEventListener("change",e=>{
   onlyMutual=!!e.target.checked;refresh();
  });
  document.querySelectorAll("[data-socio-focus-id]").forEach(btn=>btn.addEventListener("click",()=>{
   if(!people.some(p=>p.socioId===btn.dataset.socioFocusId))return;
   selectedChild=btn.dataset.socioFocusId;
   refresh();
  }));
  document.getElementById("psySocAnalysisCSV")?.addEventListener("click",()=>download("Метолария_социометрия_анализ_детей.csv",prepareCSV(people,result)));
  document.getElementById("psySocMatrixCSV")?.addEventListener("click",()=>download("Метолария_социометрия_матрица.csv",prepareMatrix(people,s)));
  document.getElementById("psySocPrintAnalysis")?.addEventListener("click",()=>printView(people,result,selected));
 }
 api.sociometryReport={render,bind,prepareCSV,prepareMatrix,observation,matrix,sociogram,
  statusFor,statusGroups,coverageEnough,
  select:id=>{if(id)selectedChild=id;}};
})();