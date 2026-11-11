"use strict";
/* Метолария: отдельная рабочая форма по структуре 5 вопросов пользовательского отчета 6.2.
   НЕ является дословным воспроизведением неизвестного первоисточника.
   Индивидуальные данные живут только в строках текущего обследования в существующем
   механизме сохранения пользователя. Никаких тестовых/реальных детских данных. */
(function(){
 const api=window.PSY_NEW_METHODS,D=window.PSY_FULL_METHODS,C=window.PSY_CATALOG;
 if(!api||!D||!Array.isArray(C))return;
 const NAME="Социометрия и профилактика буллинга (5 вопросов)";
 const KIND="bullying-sociometry";
 const previous={calculator:api.calculator,bind:api.bind,materials:api.materials,
  instruction:api.instruction,processing:api.processing,score:api.score};
 const Q=[
  {short:"Положительные связи",label:"С кем из класса ты дружишь или чаще всего общаешься?",
   sub:"Назови 2-5 одноклассников. Если назван один, выбор учитывается, но полнота требует уточнения.",max:5,kind:"LP"},
  {short:"Отрицательные связи",label:"С кем из класса тебе некомфортно работать вместе?",
   sub:"Не более 3 имен. Этот вопрос можно пропустить.",max:3,kind:"LM",optional:true},
  {short:"Возможный инициатор",label:"Кого в классе чаще называют зачинщиком агрессивных действий?",
   sub:"Не более 3 имен. Ответ отражает восприятие ученика, а не доказанный факт.",max:3,kind:"AGR"},
  {short:"Кого чаще обижают",label:"Кого из одноклассников, по твоему мнению, чаще обижают?",
   sub:"Не более 3 имен. Результат – сигнал для проверки, а не подтверждение травли.",max:3,kind:"VICTIM"},
  {short:"Защитники",label:"Кто из класса чаще вступается за тех, кого обижают?",
   sub:"Не более 3 имен.",max:3,kind:"DEF"}
 ];
 const E=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const norm=x=>String(x||"").normalize("NFKC").toLocaleLowerCase("ru").replace(/ё/g,"е").trim();
 const uid=()=>typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():"bully-"+Math.random().toString(36).slice(2)+"-"+Date.now();
 const ID_NONE="__none__",ID_UNKNOWN="__unknown__",ID_SKIP="__skip__";
 const rowsOf=rows=>(rows||[]).filter(p=>String(p.name||"").trim());
 const absent=p=>p?.bullyAbsent===true;
 const review=p=>p?.bullyReview?.status==="needs-review";
 const excluded=p=>absent(p)||review(p);
 const ensure=rows=>rowsOf(rows).forEach(p=>{if(!p.bullyId)p.bullyId=uid();});
 const record=(row,i)=>({
  status:row.bullyResponses?.[i]?.status||"",
  picks:Array.isArray(row.bullyResponses?.[i]?.picks)?row.bullyResponses[i].picks.map(String):[]
 });
 const setRecord=(row,i,data)=>{
  if(!Array.isArray(row.bullyResponses))row.bullyResponses=[];
  row.bullyResponses[i]={status:data.status||"",picks:Array.isArray(data.picks)?data.picks.slice(0,Q[i].max):[]};
 };
 const noNom=["none","unknown","skip"];
 const nominating=(data,me,ids,max)=>{
  if(data.status!=="answered")return [];
  const names=(data.picks||[]).filter(Boolean);
  const valid=names.filter(x=>x!==me&&ids.has(x));
  return [...new Set(valid)].slice(0,max);
 };
 function analyze(rows){
  ensure(rows);
  const people=rowsOf(rows),ids=new Set(people.map(p=>p.bullyId)),
        eligible=people.filter(p=>!excluded(p)),n=people.length;
  const results=Q.map((q,i)=>{
   const incoming=new Map(people.map(p=>[p.bullyId,0]));
   const edges=new Map(),responded=new Set(),partial=new Set(),unknown=new Set(),skipped=new Set();
   let nominations=0;
   for(const p of eligible){
    const a=record(p,i);
    if(a.status==="skip"){skipped.add(p.bullyId);continue;}
    if(a.status==="unknown"||a.status==="none"){
     responded.add(p.bullyId);
     if(a.status==="unknown")unknown.add(p.bullyId);
     edges.set(p.bullyId,new Set());continue;
    }
    const chosen=nominating(a,p.bullyId,ids,q.max);
    if(!chosen.length)continue;
    edges.set(p.bullyId,new Set(chosen));responded.add(p.bullyId);
    if(i===0&&chosen.length<2)partial.add(p.bullyId);
    for(const picked of chosen){incoming.set(picked,incoming.get(picked)+1);nominations++;}
   }
   return {question:q,edges,incoming,responded,partial,unknown,skipped,nominations,
     eligible:eligible.length};
  });
  const byId=new Map(people.map(p=>[p.bullyId,p]));
  const metrics=new Map(people.map(p=>{
   const [lp,lm,ag,vi,df]=results.map(r=>r.incoming.get(p.bullyId)||0);
   return [p.bullyId,{lp,lm,sp:lp-lm,si:lp+lm,ag,vi,df,excluded:excluded(p)}];
  }));
  let mutualPairs=0;
  for(const [from,toSet]of results[0].edges)for(const to of toSet)
   if(from<to&&results[0].edges.get(to)?.has(from))mutualPairs++;
  const LP=results[0].nominations,LM=results[1].nominations;
  const density=n>1?100*LP/(n*(n-1)):null;
  const reciprocity=LP?200*mutualPairs/LP:null;
  const negativeRatio=LP?100*LM/LP:null;
  const covered=results[0].responded.size;
  const coverage=eligible.length?100*covered/eligible.length:0;
  const ranked=(key)=>people.filter(p=>!excluded(p)).map(p=>({p,m:metrics.get(p.bullyId)}))
   .filter(x=>x.m[key]>0).sort((a,b)=>b.m[key]-a.m[key]||a.p.name.localeCompare(b.p.name,"ru"));
  const acc=ranked("ag"),vics=ranked("vi"),defs=ranked("df");
  // Five descriptive checks based on the supplied example; not a validated diagnostic index.
  const minimum=Math.max(5,Math.ceil(eligible.length*.75));
  const positiveReady=eligible.length>=5&&results[0].responded.size>=minimum;
  const negativeReady=eligible.length>=5&&results[1].responded.size+results[1].skipped.size>=minimum;
  const initiatorReady=eligible.length>=5&&results[2].responded.size>=minimum;
  const victimReady=eligible.length>=5&&results[3].responded.size>=minimum;
  const flags=[
   {label:"Одновременно часто называемые в положительных связях и возможными инициаторами",
    ready:positiveReady&&initiatorReady,
    triggered:people.some(p=>!excluded(p)&&metrics.get(p.bullyId).lp>=3&&metrics.get(p.bullyId).ag>=3)},
   {label:"Повторяющиеся номинации возможных пострадавших (не менее 3)",
    ready:victimReady,triggered:vics.some(x=>x.m.vi>=3)},
   {label:"Ученики с отрицательным балансом позитивных и негативных выборов",
    ready:positiveReady&&negativeReady,
    triggered:people.some(p=>!excluded(p)&&metrics.get(p.bullyId).sp<=-2)},
   {label:"Плотность положительных связей ниже 20%",
    ready:positiveReady,triggered:density!=null&&density<20},
   {label:"Отрицательных номинаций более 30% от положительных",
    ready:positiveReady&&negativeReady&&LP>0,triggered:negativeRatio!=null&&negativeRatio>30}
  ];
  const enough=flags.every(f=>f.ready);
  return {people,byId,eligible:eligible.length,results,metrics,n,LP,LM,density,reciprocity,
    negativeRatio,mutualPairs,coverage,ranked,flags,enough,acc,vics,defs,
    absent:people.filter(absent),pending:people.filter(p=>review(p)&&!absent(p))};
 }
 function profile(m,mean){
  // Transparent working grouping, not clinical diagnosis or source-standardized norm.
  if(m.sp<=-2&&m.lm>=2)return {type:"negative",name:"Отрицательный баланс"};
  if(m.lp>=3&&m.lm>=2)return {type:"mixed",name:"Смешанные номинации"};
  if(m.lp>=4&&m.sp>=3)return {type:"positive",name:"Выраженные положительные связи"};
  if(m.lp===0&&m.lm===0)return {type:"limited",name:"Без входящих выборов"};
  return {type:"neutral",name:"Без выраженной категории"};
 }
 const count=x=>Number(x||0).toLocaleString("ru-RU");
 const pct=v=>v===null?"–":v.toFixed(1).replace(".",",")+"%";
 const rowNote=(p,m)=>{
  if(absent(p))return "Отсутствовал – нет собственной анкеты";
  if(review(p))return "Требует уточнения – собственная анкета не учитывается";
  const a=Q.map((_,i)=>record(p,i));
  const answered=a.filter(x=>["answered","none","unknown"].includes(x.status)).length;
  if(!answered)return "Собственная анкета не заполнена";
  const issues=[];
  if(a[0].status==="answered"&&a[0].picks.length<2)issues.push("в Q1 меньше 2 имен");
  if(a[1].status==="skip")issues.push("Q2 пропущен (допустимо)");
  return "Ответы по "+answered+" из 5 вопросов"+(issues.length?" · "+issues.join("; "):"");
 };
 const tag=(p,m)=>excluded(p)?'<span class="psy-bully-tag excluded">'+(absent(p)?"Отсутствовал":"На уточнении")+'</span>':
  '<span class="psy-bully-tag '+profile(m).type+'">'+E(profile(m).name)+'</span>';
 const blankCell=(p,val)=>excluded(p)?"–":String(val);
 function heading(){
  return '<header class="psy-bully-head"><div><span class="psy-bully-eyebrow">МЕЖЛИЧНОСТНЫЕ ОТНОШЕНИЯ</span>'+
   '<h3>Социометрия и профилактика буллинга</h3>'+
   '<p>Пять типов номинаций – анализ по реальным ответам, без автоматических обвинений детей.</p></div></header>';
 }
 function rosterView(ctx){
  const people=rowsOf(ctx.rows),p=ctx.rows[ctx.rowIndex],active=!!p?.name?.trim();
  const current=people.findIndex(x=>x.bullyId===p?.bullyId);
  const selected=active?people.find(x=>x.bullyId===p.bullyId):null;
  const completed=selected?Q.filter((_,i)=>["answered","none","unknown","skip"].includes(record(selected,i).status)).length:0;
  return '<div class="psy-bully-roster"><div class="psy-bully-roster-head"><label>Текущий ученик<select id="psyBullyPerson">'+
   ctx.rows.map((person,i)=>person.name?.trim()?'<option value="'+i+'" '+(ctx.rowIndex===i?"selected":"")+'>'+E(person.name)+
    (absent(person)?" · отсутствовал":review(person)?" · уточнить":"")+'</option>':"").join("")+
   '</select></label><div class="psy-bully-counter">'+(selected?E(selected.name)+" · "+completed+" / 5 вопросов":"Список класса пока пуст")+'</div></div>'+
   '<details class="psy-bully-add"><summary>Добавить учеников в список класса</summary>'+
   '<p>Имена через новую строку. Уже внесенные дети и ответы не удаляются.</p>'+
   '<textarea id="psyBullyRoster" rows="5" placeholder="Фамилия Имя&#10;Фамилия Имя"></textarea>'+
   '<div class="psy-bully-actions"><button type="button" class="btn" id="psyBullyAdd">Добавить в класс</button></div></details>'+
   '<div class="psy-bully-presence">'+
   '<button class="psy-bully-toggle '+(absent(selected)?"on":"")+'" type="button" id="psyBullyAbsent" '+(!active?"disabled":"")+'>'+
   (absent(selected)?"Вернуть к обследованию":"Отметить: отсутствовал")+'</button>'+
   '<button class="psy-bully-toggle '+(review(selected)?"on":"")+'" type="button" id="psyBullyReview" '+(!active?"disabled":"")+'>'+
   (review(selected)?"Снять отметку «Уточнить»":"Требует уточнения")+'</button>'+
   '</div>'+
   (review(selected)?'<label class="psy-bully-review-note">Причина уточнения <textarea id="psyBullyReviewNote" rows="2" maxlength="1000" placeholder="Что требуется проверить">'+E(selected.bullyReview?.note||"")+'</textarea></label>':"")+
   '<p class="psy-bully-micro">'+(absent(selected)?
    "Отсутствие отмечено отдельно, исходящие ответы исключены из подсчетов, данные сохранены.":
    review(selected)?"Анкета исключена из подсчета до снятия отметки. Ответы сохранены.":
    "Отсутствие или уточнение нужно отметить явно. Пустые ответы не считаются отсутствием.")+'</p></div>';
 }
 function questionView(p){
  if(!p?.name?.trim())return '<div class="psy-bully-empty">Добавьте имена учеников, чтобы вводить ответы.</div>';
  if(absent(p))return '<div class="psy-bully-empty">Этот ученик отмечен как отсутствовавший. Ввод анкеты приостановлен.</div>';
  return '<section class="psy-bully-questions"><div class="psy-bully-questions-title"><h4>Ответы ученика</h4>'+
   '<p>Выбирайте имена из подсказок или печатайте. «Никто» всегда сверху. После выбора курсор переходит к следующему полю.</p></div>'+
   Q.map((q,i)=>{
    const a=record(p,i),status=a.status;
    const made=status==="none"?"Никто":status==="unknown"?"Не знаю":status==="skip"?"Пропущен":a.picks.length?E(a.picks.length+" имен"):"Не заполнено";
    return '<article class="psy-bully-question"><div class="psy-bully-qtop"><span class="psy-bully-qnum">'+(i+1)+'</span>'+
     '<div><h5>'+E(q.label)+'</h5><p>'+E(q.sub)+'</p></div>'+
     '<span class="psy-bully-qstatus '+(status?"ready":"missing")+'">'+made+'</span></div>'+
     '<div class="psy-bully-picks">'+Array.from({length:q.max},(_,j)=>{
      const value=a.picks[j]||"",current=rowsOf(currentRows).find(r=>r.bullyId===value);
      return '<div class="psy-bully-pick"><label for="psyBullyInput'+i+'_'+j+'">'+(j+1)+' выбор</label>'+
       '<div class="psy-bully-combo" data-q="'+i+'" data-slot="'+j+'">'+
       '<input id="psyBullyInput'+i+'_'+j+'" class="psy-bully-search" type="text" autocomplete="off" maxlength="120"'+
       ' placeholder="Написать или выбрать" value="'+E(current?.name||"")+'" data-value="'+E(value)+'" role="combobox" aria-expanded="false"/>'+
       '<button type="button" class="psy-bully-arrow" aria-label="Показать учеников">⌄</button>'+
       '<div class="psy-bully-options" hidden></div></div></div>';
     }).join("")+'</div>'+
     '<div class="psy-bully-qbuttons">'+
     '<button type="button" class="psy-bully-muted" data-bully-answer="'+i+'" data-state="none">Никто</button>'+
     '<button type="button" class="psy-bully-muted" data-bully-answer="'+i+'" data-state="unknown">Не знаю</button>'+
     (q.optional?'<button type="button" class="psy-bully-muted" data-bully-answer="'+i+'" data-state="skip">Пропустить вопрос</button>':"")+
     '<button type="button" class="psy-bully-complete" data-bully-finish="'+i+'">Следующий вопрос</button>'+
     '<button type="button" class="psy-bully-clear" data-bully-clear="'+i+'">Очистить</button>'+
     '</div></article>';
   }).join("")+
   '<div class="psy-bully-actions"><button type="button" class="btn" id="psyBullyNext">Следующий ученик</button></div></section>';
 }
 function overview(a){
  const items=[
   ["Учеников",a.n],["Анкет с Q1",a.results[0].responded.size],["Отсутствовали",a.absent.length],
   ["На уточнении",a.pending.length],["LP – позитивных",a.LP],["LM – негативных",a.LM]
  ];
  const row=a.people.map(p=>({p,m:a.metrics.get(p.bullyId)}));
  const names=(key,label,limit=5)=>{
   const selected=a.ranked(key).slice(0,limit);
   return '<section class="psy-bully-finding"><h5>'+label+'</h5>'+
    (selected.length?'<ol>'+selected.map(({p,m})=>'<li><strong>'+E(p.name)+'</strong><span>'+m[key]+' ном.</span></li>').join("")+'</ol>':
    '<p>Номинаций пока нет</p>')+'</section>';
  };
  const info='<div class="psy-bully-stats">'+items.map(([k,v])=>'<span><b>'+count(v)+'</b><small>'+k+'</small></span>').join("")+'</div>'+
   '<div class="psy-bully-stats more"><span><b>'+pct(a.density)+'</b><small>Плотность позитивных связей (LP / n×(n-1))</small></span>'+
   '<span><b>'+pct(a.reciprocity)+'</b><small>Доля взаимных позитивных номинаций</small></span>'+
   '<span><b>'+pct(a.negativeRatio)+'</b><small>LM / LP</small></span>'+
   '<span><b>'+pct(a.coverage)+'</b><small>Охват ответами по Q1</small></span></div>';
  const table='<div class="psy-bully-table-scroll"><table class="psy-bully-results"><thead><tr>'+
   '<th>Ученик</th><th>Бланк</th><th>LP</th><th>LM</th><th>SP</th><th>SI</th>'+
   '<th>Агр. Q3</th><th>Жертва Q4</th><th>Защ. Q5</th><th>Профиль по числам</th><th>Уточнение</th>'+
   '</tr></thead><tbody>'+row.map(({p,m})=>{
    const incoming=excluded(p)?Array(7).fill("–"):[m.lp,m.lm,m.sp,m.si,m.ag,m.vi,m.df];
    const status=absent(p)?"Отсутствовал":review(p)?"На уточнении":rowNote(p,m);
    return '<tr'+(excluded(p)?' class="is-excluded"':"")+'><th scope="row">'+E(p.name)+'</th>'+
     '<td>'+E(status)+'</td>'+incoming.map((v,i)=>'<td class="'+(typeof v==="number"&&i>=4&&v>=3?"psy-bully-signal":"")+
      '">'+v+'</td>').join("")+
     '<td>'+tag(p,m)+'</td><td>'+(!excluded(p)&&m.vi>=3?"Проверить ситуацию безопасности":
      !excluded(p)&&m.ag>=3?"Проверить содержание сообщений":
      !excluded(p)&&m.sp<=-2?"Уточнить отношения":"–")+'</td></tr>';
   }).join("")+'</tbody></table></div>';
  const quality='<div class="psy-bully-quality">'+
   (a.absent.length?'<p><strong>Отсутствовали:</strong> '+a.absent.map(p=>E(p.name)).join(", ")+'.</p>':"")+
   (a.pending.length?'<p><strong>На уточнении:</strong> '+a.pending.map(p=>E(p.name)).join(", ")+'.</p>':"")+
   Q.map((q,i)=>{const res=a.results[i],missing=a.eligible-res.responded.size-res.skipped.size;
    return '<p><b>Q'+(i+1)+':</b> заполнено '+res.responded.size+' из '+a.eligible+
     (res.skipped.size?'; пропущено по инструкции '+res.skipped.size:"")+
     (missing>0?'; без ответа '+missing:"")+
     (res.partial.size?'; меньше 2 имен '+res.partial.size:"")+'.</p>';
   }).join("")+'</div>';
  const flagCount=a.flags.filter(x=>x.ready&&x.triggered).length;
  const risk='<section class="psy-bully-risk"><h4>Ориентировочные сигналы для проверки</h4>'+
   '<p>Пороговые 20% плотности и 30% соотношения из представленного отчета. Остальные сигналы – рабочие наблюдения. Это не диагностический индекс буллинга.</p>'+
   '<ul>'+a.flags.map(f=>'<li><span class="'+(f.ready&&f.triggered?"active":"")+'">'+
    (!f.ready?"Недостаточно ответов":f.triggered?"Отмечен":"Не отмечен")+'</span> '+
     E(f.label)+'</li>').join("")+'</ul>'+
   '<p><strong>'+(a.enough?flagCount+' из 5 сигналов по рабочему правилу.':'Данных пока недостаточно для итоговой оценки сигналов.')+
   '</strong> Наличие сигналов означает необходимость проверки, а не доказанную травлю.</p></section>';
  const recommendations=[
   a.vics.length?'Индивидуально уточнить безопасность и ситуацию с учениками, которых чаще называли в Q4: '+
    a.vics.slice(0,4).map(x=>x.p.name+' ('+x.m.vi+')').join(", ")+'.':"",
   a.acc.length?'В конфиденциальной беседе и наблюдении проверить содержание номинаций Q3: '+
    a.acc.slice(0,4).map(x=>x.p.name+' ('+x.m.ag+')').join(", ")+'.':"",
   a.defs.length?'Уточнить конструктивное поведение возможных защитников: '+
    a.defs.slice(0,3).map(x=>x.p.name+' ('+x.m.df+')').join(", ")+'.':"",
   'Сверить состав класса, незаполненные анкеты и наблюдения педагога. Не предъявлять результаты с именами учащимся.'
  ].filter(Boolean);
  return '<section class="psy-bully-report" id="psyBullyReport"><div class="psy-bully-section-title"><h4>Анализ класса</h4>'+
   '<p>Только внесенные ответы; без подставленных или демонстрационных результатов.</p></div>'+
   info+'<h4>Количественные показатели по детям</h4>'+table+
   '<p class="psy-bully-note">LP – положительные выборы; LM – отрицательные; SP = LP - LM; SI = LP + LM. «Агр.», «Жертва», «Защ.» – номинации, а не установленная роль в травле. Дети без собственной анкеты могут получать номинации, но отсутствие не равно нулю.</p>'+
   '<div class="psy-bully-findings">'+names("lp","Положительные выборы (Q1)")+
    names("vi","Кого называли пострадавшим (Q4)")+
    names("ag","Кого называли инициатором (Q3)")+
    names("df","Кого называли защитником (Q5)")+'</div>'+
   '<details class="psy-bully-details" open><summary>Полнота и качество анкет</summary>'+quality+'</details>'+
   risk+'<section class="psy-bully-recs"><h4>Что проверить психологу</h4>'+
   '<ol>'+recommendations.map(x=>'<li>'+E(x)+'</li>').join("")+'</ol></section>'+
   '<div class="psy-bully-actions"><button class="btn" type="button" id="psyBullyCSV">Скачать таблицу CSV</button>'+
   '<button class="btn" type="button" id="psyBullyRawCSV">Скачать ответы CSV</button>'+
   '<button class="btn" type="button" id="psyBullyPrint">Посмотреть и распечатать А4</button>'+
   '<button class="btn" type="button" id="psyBullySave">Сохранить результат в профиль</button></div>'+
   '<p class="psy-bully-note">Конфиденциальный отчет специалиста. Не показывайте персональные номинации классу. Номинации о травле необходимо проверять в беседах и наблюдениях.</p></section>';
 }
 let currentRows=null;
 function calculator(d,ctx){
  if(d.methodType!==KIND)return previous.calculator(d,ctx);
  currentRows=ctx.rows;ensure(ctx.rows);
  if(ctx.calcMode!=="class")return '<section class="psy-bully"><h3>Групповая социометрия</h3>'+
   '<p>Выберите режим «Группа / класс», чтобы внести состав класса и ответы по пяти вопросам.</p>'+
   '<button type="button" class="btn primary" data-cmode="class">Группа / класс</button></section>';
  return '<section class="psy-bully">'+heading()+rosterView(ctx)+
   questionView(ctx.rows[ctx.rowIndex])+overview(analyze(ctx.rows))+'</section>';
 }
 const csvText=rows=>"\uFEFF"+rows.map(row=>row.map(value=>{
  let s=String(value??"");if(/^\s*[=+\-@]/.test(s))s="'"+s;
  return '"'+s.replace(/"/g,'""')+'"';
 }).join(";")).join("\r\n");
 function download(name,rows){
  const blob=new Blob([csvText(rows)],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
 }
 function mainRows(a){
  return [["Ученик","Статус бланка","LP","LM","SP","SI","Q3 предполагаемый инициатор",
   "Q4 предполагаемый пострадавший","Q5 защитник","Описание профиля","Ответ по Q1"],
   ...a.people.map(p=>{
    const m=a.metrics.get(p.bullyId),no=excluded(p);
    return [p.name,absent(p)?"Отсутствовал":review(p)?"На уточнении":rowNote(p,m),
     ...(no?Array(7).fill(""):[m.lp,m.lm,m.sp,m.si,m.ag,m.vi,m.df]),
     no?"Без расчета":profile(m).name,record(p,0).status];
   })];
 }
 function rawRows(a){
  const header=["Ученик","Статус анкеты","Вопрос","Критерий","Ответ","Выбранные ученики","Число выборов"];
  return [header,...a.people.flatMap(p=>Q.map((q,i)=>{
   const r=record(p,i),list=r.picks.map(id=>a.byId.get(id)?.name).filter(Boolean);
   const value=r.status==="none"?"Никто":r.status==="unknown"?"Не знаю":r.status==="skip"?"Пропущен":
    r.status==="answered"?"Имена выбраны":"Не заполнено";
   return [p.name,absent(p)?"Отсутствовал":review(p)?"На уточнении":"Учитывается",
    i+1,q.short,value,list.join("; "),list.length];
  }))];
 }
 function printView(a){
  const describe=(key,max=6)=>a.ranked(key).slice(0,max).map(({p,m})=>E(p.name)+" ("+m[key]+")").join("; ")||"не зафиксированы";
  const negative=a.people.filter(p=>!excluded(p)&&a.metrics.get(p.bullyId).sp<=-2)
   .map(p=>E(p.name)+" ("+a.metrics.get(p.bullyId).sp+")").join("; ")||"не выделены";
  const mixed=a.people.filter(p=>!excluded(p)&&a.metrics.get(p.bullyId).lp>=3&&a.metrics.get(p.bullyId).lm>=2)
   .map(p=>E(p.name)+" (LP "+a.metrics.get(p.bullyId).lp+", LM "+a.metrics.get(p.bullyId).lm+")").join("; ")||"не выделены";
  const headline='<h1>Аналитический отчет по межличностным отношениям и профилактике буллинга</h1>'+
   '<p>Для служебного пользования. Персональные данные несовершеннолетних.</p>'+
   '<p>В анализе '+a.n+' учащихся; по Q1 ответили '+a.results[0].responded.size+
    ' из '+a.eligible+' учитываемых; отсутствовали '+a.absent.length+'; на уточнении '+a.pending.length+'.</p>'+
   '<h2>Основные показатели</h2><p>LP = '+a.LP+', LM = '+a.LM+', плотность позитивных связей '+pct(a.density)+
    ', доля взаимных положительных номинаций '+pct(a.reciprocity)+
    ', соотношение LM/LP '+pct(a.negativeRatio)+'.</p>'+
   '<h2>Таблица учеников</h2>'+
   '<table><thead><tr>'+mainRows(a)[0].slice(0,10).map(t=>'<th>'+E(t)+'</th>').join("")+'</tr></thead><tbody>'+
   mainRows(a).slice(1).map(r=>'<tr>'+r.slice(0,10).map(v=>'<td>'+E(v)+'</td>').join("")+'</tr>').join("")+
   '</tbody></table>'+
   '<h2>Полнота анкет</h2>'+Q.map((q,i)=>'<p>Q'+(i+1)+' '+E(q.short)+
    ': ответили '+a.results[i].responded.size+' из '+a.eligible+
    ', пропущено '+a.results[i].skipped.size+'.</p>').join("")+
   '<h2>Основные наблюдения</h2>'+
   '<p><b>Чаще выбирали положительно:</b> '+describe("lp")+'.</p>'+
   '<p><b>Чаще называли возможными инициаторами:</b> '+describe("ag")+'. Это сведения одноклассников, не обвинение.</p>'+
   '<p><b>Чаще называли среди тех, кого обижают:</b> '+describe("vi")+'. Нужна проверка безопасности.</p>'+
   '<p><b>Чаще называли защитниками:</b> '+describe("df")+'.</p>'+
   '<p><b>Выраженный отрицательный баланс:</b> '+negative+'.</p>'+
   '<p><b>Сочетание позитивных и негативных выборов:</b> '+mixed+'.</p>'+
   '<h2>Сигналы к проверке</h2><ul>'+a.flags.map(f=>'<li>'+E(f.label)+
    ': '+(!f.ready?"недостаточно ответов":f.triggered?"отмечен":"не отмечен")+'</li>').join("")+'</ul>'+
   '<h2>Рекомендуемые действия</h2><ol>'+
   (a.vics.length?'<li>Индивидуально проверить безопасность и ситуацию: '+describe("vi",4)+'.</li>':"")+
   (a.acc.length?'<li>Уточнить содержание сообщений о возможной агрессии: '+describe("ag",4)+'.</li>':"")+
   (a.defs.length?'<li>В беседе уточнить возможности поддержки со стороны названных защитников: '+describe("df",4)+'.</li>':"")+
   '<li>Сверить состав класса и пропуски, обсудить ситуацию с классным руководителем, провести наблюдение на уроках и переменах.</li></ol>'+
   '<p>Ответы детей отражают восприятие одноклассников. Проверка фактов травли требует индивидуальных бесед, наблюдения и сверки с педагогами. Отчет не устанавливает роли агрессора или жертвы.</p>';
  const css='@page{size:A4 landscape;margin:12mm}body{font:10pt/1.45 Arial,sans-serif;color:#283d30}h1{font-size:16pt}h2{font-size:12pt;margin-top:18px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #a8b7ad;padding:4px 5px;font-size:7.7pt;text-align:left;vertical-align:top}thead{display:table-header-group}tr{page-break-inside:avoid}p{margin:8px 0}@media print{button{display:none}}button{padding:10px;border:1px solid #67917b;border-radius:7px;margin-top:20px;background:#eef8ee;cursor:pointer}';
  const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Метолария – анализ межличностных отношений</title><style>'+
   css+'</style></head><body>'+headline+'<button onclick="window.print()">Печать</button></body></html>';
  const w=window.open("","_blank");
  if(w){w.document.open();w.document.write(html);w.document.close();w.focus();}
  else{const blob=new Blob([html],{type:"text/html;charset=utf-8"}),url=URL.createObjectURL(blob);
   const a=document.createElement("a");a.href=url;a.download="Метолария_аналитический_отчет.html";
   document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);}
 }
 function bind(d,ctx){
  if(d.methodType!==KIND)return previous.bind(d,ctx);
  if(ctx.calcMode!=="class")return;
  const rows=ctx.rows,person=()=>rows[ctx.rowIndex],refresh=()=>ctx.onSelect?.(ctx.rowIndex);
  const focus=(q,i)=>{
   const input=document.getElementById("psyBullyInput"+q+"_"+i);
   if(input){input.scrollIntoView?.({block:"center",behavior:"smooth"});input.focus({preventScroll:true});}
  };
  const nextQuestion=q=>{
   if(q<4){focus(q+1,0);}
   else {
    const next=rows.findIndex((p,i)=>i>ctx.rowIndex&&p.name?.trim()&&!absent(p));
    if(next>=0){ctx.onSelect?.(next);focus(0,0);}
    else{const t=document.getElementById("psyBullyNotice");if(t)t.textContent="Последний ученик в списке.";}
   }
  };
  document.getElementById("psyBullyPerson")?.addEventListener("change",e=>ctx.onSelect?.(Number(e.target.value)));
  document.getElementById("psyBullyAdd")?.addEventListener("click",()=>{
   const raw=document.getElementById("psyBullyRoster")?.value||"";
   const names=[...new Set(raw.split(/[\n;]+/).map(s=>s.trim()).filter(Boolean))];
   if(!names.length)return;
   ctx.onBulkAdd?.(names);
  });
  document.getElementById("psyBullyNext")?.addEventListener("click",()=>{
   const next=rows.findIndex((p,i)=>i>ctx.rowIndex&&p.name?.trim()&&!absent(p));
   if(next>=0)ctx.onSelect?.(next);
  });
  document.getElementById("psyBullyAbsent")?.addEventListener("click",()=>{
   if(!person())return;person().bullyAbsent=!absent(person());refresh();
  });
  document.getElementById("psyBullyReview")?.addEventListener("click",()=>{
   if(!person())return;
   person().bullyReview=review(person())?{status:"",note:""}:{...person().bullyReview,status:"needs-review"};
   refresh();
  });
  document.getElementById("psyBullyReviewNote")?.addEventListener("input",e=>{
   if(person())person().bullyReview={...person().bullyReview,status:"needs-review",note:e.target.value.slice(0,1000)};
  });
  document.querySelectorAll("[data-bully-answer]").forEach(btn=>btn.addEventListener("click",()=>{
   const q=Number(btn.dataset.bullyAnswer),status=btn.dataset.state;
   setRecord(person(),q,{status,picks:[]});refresh();nextQuestion(q);
  }));
  document.querySelectorAll("[data-bully-clear]").forEach(btn=>btn.addEventListener("click",()=>{
   const q=Number(btn.dataset.bullyClear);setRecord(person(),q,{status:"",picks:[]});refresh();focus(q,0);
  }));
  document.querySelectorAll("[data-bully-finish]").forEach(btn=>btn.addEventListener("click",()=>{
   const q=Number(btn.dataset.bullyFinish);
   // Explicit finish is equivalent to retaining current valid names; no names -> "Не знаю".
   const r=record(person(),q);
   if(r.picks.length||r.status){if(r.picks.length)setRecord(person(),q,{status:"answered",picks:r.picks});refresh();nextQuestion(q);}
   else{setRecord(person(),q,{status:"unknown",picks:[]});refresh();nextQuestion(q);}
  }));
  const combos=[...document.querySelectorAll(".psy-bully-combo")];
  const close=combo=>{const panel=combo.querySelector(".psy-bully-options"),input=combo.querySelector(".psy-bully-search");
   if(panel)panel.hidden=true;if(input)input.setAttribute("aria-expanded","false");};
  const candidates=(combo,term)=>{
   const q=Number(combo.dataset.q),slot=Number(combo.dataset.slot),r=record(person(),q);
   const used=new Set(r.picks.filter((v,i)=>v&&i!==slot));
   return rowsOf(rows).filter(p=>p.bullyId!==person()?.bullyId&&!used.has(p.bullyId)&&norm(p.name).includes(norm(term)));
  };
  const commit=(combo,id)=>{
   const q=Number(combo.dataset.q),slot=Number(combo.dataset.slot),r=record(person(),q);
   if(id===ID_NONE||id===ID_UNKNOWN||id===ID_SKIP){
    setRecord(person(),q,{status:id===ID_NONE?"none":id===ID_UNKNOWN?"unknown":"skip",picks:[]});
    refresh();nextQuestion(q);return;
   }
   if(!candidates(combo,"").some(p=>p.bullyId===id))return;
   const picks=r.picks.slice();
   while(picks.length<=slot)picks.push("");
   picks[slot]=id;
   setRecord(person(),q,{status:"answered",picks:picks.filter(Boolean)});
   const nextSlot=picks.filter(Boolean).length;
   refresh();if(nextSlot<Q[q].max)focus(q,nextSlot);else nextQuestion(q);
  };
  combos.forEach(combo=>{
   const input=combo.querySelector(".psy-bully-search"),drop=combo.querySelector(".psy-bully-arrow");
   const show=term=>{
    combos.forEach(c=>{if(c!==combo)close(c);});
    const box=combo.querySelector(".psy-bully-options");
    box.replaceChildren();
    const opts=[{id:ID_NONE,name:"Никто"},{id:ID_UNKNOWN,name:"Не знаю"},
      ...(Q[Number(combo.dataset.q)].optional?[{id:ID_SKIP,name:"Пропустить вопрос"}]:[]),
      ...candidates(combo,term).map(p=>({id:p.bullyId,name:p.name}))];
    opts.forEach(opt=>{
     const b=document.createElement("button");b.type="button";b.textContent=opt.name;
     b.className="psy-bully-option"+(opt.id.startsWith("__")?" is-special":"");
     b.addEventListener("mousedown",e=>e.preventDefault());
     b.addEventListener("click",()=>commit(combo,opt.id));box.append(b);
    });
    if(!candidates(combo,term).length&&term){const p=document.createElement("p");p.textContent="Имен с таким написанием нет.";p.className="psy-bully-nomatch";box.append(p);}
    box.hidden=false;input.setAttribute("aria-expanded","true");
   };
   input.addEventListener("focus",()=>show(""));
   input.addEventListener("input",()=>show(input.value));
   input.addEventListener("keydown",e=>{
    if(e.key==="Escape"){close(combo);return;}
    if(e.key==="Enter"){e.preventDefault();
     const exact=candidates(combo,input.value).find(p=>norm(p.name)===norm(input.value));
     const first=exact||candidates(combo,input.value)[0];
     if(first)commit(combo,first.bullyId);else if(norm(input.value)==="никто")commit(combo,ID_NONE);
    }
   });
   drop.addEventListener("click",()=>{if(!combo.querySelector(".psy-bully-options").hidden){close(combo);drop.focus();}
    else{input.focus();show("");}});
  });
  bindReport();
  function bindReport(){
   const a=analyze(rows);
   document.getElementById("psyBullyCSV")?.addEventListener("click",()=>download("Метолария_социометрия_буллинг_анализ.csv",mainRows(a)));
   document.getElementById("psyBullyRawCSV")?.addEventListener("click",()=>download("Метолария_социометрия_буллинг_ответы.csv",rawRows(a)));
   document.getElementById("psyBullyPrint")?.addEventListener("click",()=>printView(a));
   document.getElementById("psyBullySave")?.addEventListener("click",()=>ctx.onSave?.());
  }
 }
 function blank(){
  return '<section class="psy-bully-print"><h3>Лист ответов</h3><p>Класс: ______  Дата: ______  Код участника: ______</p>'+
   '<p>Заполни ответы самостоятельно, не обсуждая их с одноклассниками. Можно написать «Никто» или «Не знаю».</p>'+
   Q.map((q,i)=>'<div class="psy-bully-blank-q"><b>'+(i+1)+'. '+E(q.label)+'</b>'+
    '<p>'+E(q.sub)+'</p>'+Array.from({length:q.max},(_,n)=>'<p>'+(n+1)+'. ________________________________________________</p>').join("")+
    '</div>').join("")+'<p>Ответы конфиденциальны.</p></section>';
 }
 function instruction(){
  return '<h3>Инструкция обследуемому</h3><p>Ответь на пять вопросов о взаимоотношениях в классе. Не выбирай себя. Никому не показывай свои ответы. Если не знаешь, так и напиши. Второй вопрос можно пропустить.</p>'+
   '<h3>Состав пяти вопросов</h3><ol>'+Q.map(q=>'<li><b>'+E(q.label)+'</b> – '+E(q.sub)+'</li>').join("")+'</ol>'+
   '<h3>Порядок для специалиста</h3><p>Обеспечьте конфиденциальность, используйте полный список класса. Отмечайте отсутствующих отдельно. Не приравнивайте пропуск к ответу «Никто».</p>'+
   '<p><strong>Версия:</strong> редакционная рабочая форма по структуре пяти вопросов аналитического отчета 6.2. Дословный авторский бланк первоисточника не подтвержден. Не выдавайте эти формулировки за цитату из методических рекомендаций.</p>';
 }
 function processing(){
  return '<h3>Обработка данных</h3><p>LP – число полученных положительных номинаций Q1; LM – отрицательных Q2; SP = LP - LM; SI = LP + LM. Q3, Q4 и Q5 считаются раздельно.</p>'+
   '<p>Плотность позитивных связей = LP / (n × (n-1)), где n – число учеников в списке класса. Доля взаимных номинаций = 2 × число взаимных пар / LP; отношение негативных и позитивных = LM / LP.</p>'+
   '<p>Анкеты отсутствовавших и учащихся «на уточнении» исключаются как источники номинаций, но имена остаются в классе. Выборы других учащихся в их адрес сохраняются. Лимит Q1 – 5 имен, Q2-Q5 – 3, Q2 необязателен.</p>'+
   '<p>Редакционные профили в таблице – не стандартизированные статусы. Рабочие границы: отрицательный баланс – SP до -2 при LM от 2; смешанный профиль – LP от 3 и LM от 2; выраженные положительные связи – LP от 4 и SP от 3. При прочих значениях категория не выделяется.</p>'+
   '<p>Пороговые сигналы из представленного отчета носят ориентировочный характер. Профили и номинации возможных агрессоров/жертв не являются выводами о фактах травли.</p>';
 }
 D[NAME]={
  author:"Редакционная рабочая форма Метоларии по образцу пяти вопросов из аналитического отчета",
  age:"Школьные классы при понимании вопросов; решение о применении – за специалистом",
  kind:"Групповое анкетирование о межличностных отношениях",
  count:"5 вопросов: положительные и отрицательные связи, возможные инициаторы, пострадавшие, защитники",
  goal:"Предварительное изучение позитивных и негативных номинаций, сообщений о травле и ресурсов поддержки класса.",
  instructions:"Ответь на пять вопросов о взаимоотношениях в классе. Не выбирай себя. Второй вопрос можно пропустить.",
  scoring:"LP, LM, SP, SI; отдельные номинации Q3-Q5; взаимность и плотность положительных связей; описательные сигналы для проверки.",
  interpret:"Номинации отражают восприятие одноклассников, а не подтвержденные действия или роли. Ведите беседы и наблюдения для проверки.",
  warning:"Для служебного пользования. Персональные данные несовершеннолетних. Формулировки вопросов – редакционная рабочая версия, не подтвержденная как дословный авторский первоисточник.",
  workflow:"fresh06",methodType:KIND,calculator:true,version:"BULLY-FIVE-WORKING-2026",
  indicators:["LP/LM/SP/SI","Номинации возможных инициаторов, пострадавших и защитников",
   "Плотность и взаимность положительных связей","Охват и полнота анкет","Ориентировочные сигналы для проверки"],
  questions:[]
 };
 if(!C.some(x=>x.name===NAME))C.push({
  id:"bullying-sociometry-five",name:NAME,theme:"Мониторинг риска",
  author:"Рабочая форма Метоларии по структуре пяти вопросов",
  age:"Школьные классы",format:"Групповое анкетирование",count:"5 вопросов",
  goal:"Выборы одноклассников, межличностные отношения и предварительные сигналы о возможной травле."
 });
 api.calculator=(d,ctx)=>d?.methodType===KIND?calculator(d,ctx):previous.calculator(d,ctx);
 api.bind=(d,ctx)=>d?.methodType===KIND?bind(d,ctx):previous.bind(d,ctx);
 api.materials=(d,flag)=>d?.methodType===KIND?blank():previous.materials(d,flag);
 api.instruction=d=>d?.methodType===KIND?instruction():previous.instruction(d);
 api.processing=d=>d?.methodType===KIND?processing():previous.processing(d);
 api.score=(d,...rest)=>d?.methodType===KIND?null:previous.score?.(d,...rest);
 window.PSY_BULLY_SOCIO={analyze,profile,Q,mainRows,rawRows,name:NAME};
})();