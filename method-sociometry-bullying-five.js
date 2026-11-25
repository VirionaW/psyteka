"use strict";
/* Метолария. Пятиблочная SNA-анкета из методических рекомендаций
   ФГБУ МП МЦ "Роспатриотцентр" (2026). Хранение отдельно от старой
   шестиблочной формы. Номинации отражают восприятие, не доказанные роли. */
(function () {
  const api = window.PSY_NEW_METHODS, versions = window.PSY_SOCIO_VARIANTS;
  if (!api || !versions) return;
  const FIVE = "bullying-sna-five", NONE = "__none__";
  const orig = {
    activate: versions.activate, setVariant: versions.setVariant,
    getVariant: versions.getVariant, controls: versions.controls, details: versions.details,
    calculator: api.calculator, bind: api.bind, materials: api.materials,
    instruction: api.instruction, processing: api.processing, score: api.score
  };
  const Q = [
    {title:"С кем из класса ты чаще всего общаешься, сидишь рядом или дружишь?",
     sub:"Назови от 2 до 5 одноклассников.", max:5, type:"Положительная связь"},
    {title:"С кем из класса тебе некомфортно находиться в одной группе на уроке или в совместном деле?",
     sub:"Назови до 3 одноклассников (вопрос можно оставить без ответа).", max:3, type:"Отрицательная связь", optional:true},
    {title:"Кто в классе чаще всего задирает, обижает или унижает других?",
     sub:"Назови до 3 одноклассников.", max:3, type:"Номинация возможного обидчика"},
    {title:"Кого в классе чаще всего обижают?",
     sub:"Назови до 3 одноклассников.", max:3, type:"Номинация возможного пострадавшего"},
    {title:"Кто в классе заступается за тех, кого обижают?",
     sub:"Назови до 3 одноклассников.", max:3, type:"Номинация защитника"}
  ];
  const E = value => String(value ?? "").replace(/[&<>"']/g, c =>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm = value => String(value || "").normalize("NFKC").trim().toLocaleLowerCase("ru").replace(/\u0451/g,"е");
  const roster = rows => (rows || []).filter(p => String(p?.name || "").trim());
  const absent = p => p?.bullyFiveAbsent === true;
  const changed = () => window.dispatchEvent(new Event("psy-assessment-dirty"));
  const uid = () => globalThis.crypto?.randomUUID?.() ||
    "b5-" + Date.now() + "-" + Math.random().toString(36).slice(2);
  const ensureIds = rows => {
    let touched = false;
    roster(rows).forEach(p => {
      if (!p.socioId) { p.socioId = uid(); touched = true; }
    });
    if (touched) changed();
  };
  const record = (p, i) => {
    const entry = p?.bullyFiveResponses?.[i] || {};
    return {status:String(entry.status || ""), picks:Array.isArray(entry.picks) ? entry.picks.map(String).slice(0,Q[i].max) : []};
  };
  const cleanPicks = (person,i,ids) => {
    const a = record(person,i);
    if (a.status !== "answered") return [];
    return [...new Set(a.picks.filter(id => id && id !== person.socioId && ids.has(id)))].slice(0,Q[i].max);
  };
  const setRecord = (person,i,status,picks) => {
    if (!Array.isArray(person.bullyFiveResponses)) person.bullyFiveResponses = [];
    person.bullyFiveResponses[i] = {status,picks:picks.slice(0,Q[i].max)};
    changed();
  };
  let selected = orig.getVariant(),bullyFiveOutsideBound=false;
  versions.activate = rows => {
    if ((rows || []).some(r => r?.socioVariant === FIVE)) {
      selected = FIVE; return selected;
    }
    selected = orig.activate(rows);
    return selected;
  };
  versions.getVariant = () => selected;
  versions.setVariant = (next,rows) => {
    if (next === FIVE) {
      selected = FIVE;
      (rows || []).forEach(row => { if (row && typeof row === "object") row.socioVariant = FIVE; });
      changed();
    } else {
      orig.setVariant(next,rows);
      selected = orig.getVariant();
    }
  };
  const titleVariant = v => v === versions.PRIMARY ? "Социометрия: положительные и отрицательные выборы (6)" :
    v === versions.VARIANT ? "Прежняя форма отношений и поддержки (6)" :
    v === "vika6" ? "Социометрия Вики (6)" : "Профилактика буллинга: SNA (5)";
  versions.controls = () => '<section class="psy-socio-version-picker" aria-label="Варианты социометрии">' +
    '<div><strong>Выберите вариант</strong><small>Каждый вариант хранит свои ответы отдельно</small></div>' +
    '<div class="psy-socio-version-options">' +
    [versions.PRIMARY,FIVE,"vika6",versions.VARIANT].map(value =>
      '<button type="button" class="psy-socio-version-option ' + (selected === value ? "is-selected" : "") +
      '" data-socio-variant="' + value + '" aria-pressed="' + (selected === value) + '">' +
      E(titleVariant(value)) + '</button>').join("") + '</div>' +
    '<p>' + (selected === FIVE
      ? 'Анкетирование SNA из методических рекомендаций 2026 года: 5 вопросов и необязательный открытый ответ. Существующие обследования других вариантов не изменяются.'
      : 'Выбранный вариант используется для текущего обследования; при смене формы ее ответы не переносятся в другие формы.') +
    '</p></section>';
  versions.details = d => selected === FIVE ? {...d,
    author:'ФГБУ МП МЦ «Роспатриотцентр» (методические рекомендации, 2026)',
    kind:'Групповой опрос, сетевой анализ (SNA)',
    count:'5 вопросов с номинациями и 1 необязательный открытый',
    goal:'Описательный анализ положительных и отрицательных связей и номинаций участников ситуаций травли в классе.',
    instructions:'Ответь на вопросы, указывая коды одноклассников. Не называй самого себя. Второй вопрос разрешено пропустить.',
    scoring:'LP – входящие позитивные выборы, LM – негативные. SP = LP - LM, SI = LP + LM. Вопросы 3-5 учитываются раздельно. Плотность = число позитивных связей / (N × (N-1)); взаимность = доля ответных позитивных выборов. Это описательные показатели, а не подтверждение буллинга.',
    interpret:'Номинации учеников отражают их восприятие. Для выводов необходима проверка наблюдениями и беседами.',
    warning:'Сетевой анализ не подтверждает травлю и не устанавливает виновность конкретного ребенка. Имена и ответы конфиденциальны.',
    version:'BULLYING-SNA-FIVE-2026',
    indicators:['LP, LM, SP, SI','Плотность и взаимность позитивных связей','Номинации по вопросам 3-5','Полнота анкет и открытые комментарии']
  } : orig.details(d);
  const isFive = d => d?.methodType === "sociometry" && selected === FIVE;

  /* Brandes, directed unweighted positive-choice graph; normalized to percentages. */
  function centrality(ids,edges) {
    const scores = new Map(ids.map(id => [id,0]));
    for (const source of ids) {
      const order = [], pred = new Map(ids.map(id => [id,[]]));
      const sigma = new Map(ids.map(id => [id,0])), dist = new Map(ids.map(id => [id,-1]));
      sigma.set(source,1); dist.set(source,0);
      const queue = [source];
      for (let a=0;a<queue.length;a++) {
        const v = queue[a]; order.push(v);
        for (const w of edges.get(v) || []) {
          if (dist.get(w) < 0) { dist.set(w,dist.get(v)+1); queue.push(w); }
          if (dist.get(w) === dist.get(v)+1) {
            sigma.set(w,sigma.get(w)+sigma.get(v));
            pred.get(w).push(v);
          }
        }
      }
      const delta = new Map(ids.map(id => [id,0]));
      while (order.length) {
        const w = order.pop();
        for (const v of pred.get(w)) if (sigma.get(w)) {
          delta.set(v,delta.get(v)+(sigma.get(v)/sigma.get(w))*(1+delta.get(w)));
        }
        if (w !== source) scores.set(w,scores.get(w)+delta.get(w));
      }
    }
    const denom = (ids.length-1)*(ids.length-2);
    return new Map(ids.map(id => [id,denom>0?100*scores.get(id)/denom:0]));
  }
  function analyze(rows) {
    ensureIds(rows);
    const people = roster(rows), ids = new Set(people.map(p => p.socioId)), n = people.length;
    const eligible = people.filter(p => !absent(p));
    const stats = Q.map((q,i) => {
      const incoming = new Map(people.map(p => [p.socioId,0]));
      const edges = new Map(people.map(p => [p.socioId,new Set()]));
      let completed=0, partial=0, skipped=0, nominations=0;
      for (const person of eligible) {
        const a = record(person,i), picks = cleanPicks(person,i,ids);
        if (a.status === "skip" && q.optional) { skipped++; completed++; continue; }
        if (a.status === "none") { completed++; continue; }
        if (!picks.length) continue;
        if (i===0 && picks.length<2) partial++;
        else completed++;
        for (const id of picks) {
          edges.get(person.socioId).add(id);
          incoming.set(id,incoming.get(id)+1);
          nominations++;
        }
      }
      return {incoming,edges,completed,partial,skipped,nominations};
    });
    const positive = stats[0].edges;
    let mutualPairs=0;
    for (const [from,set] of positive) for (const to of set)
      if (from<to && positive.get(to)?.has(from)) mutualPairs++;
    const between = centrality([...ids],positive);
    const measures = new Map(people.map(p => {
      const counts = stats.map(s => s.incoming.get(p.socioId)||0);
      return [p.socioId,{lp:counts[0],lm:counts[1],sp:counts[0]-counts[1],
        si:counts[0]+counts[1],ag:counts[2],vi:counts[3],def:counts[4],
        betweenness:between.get(p.socioId)||0}];
    }));
    const density = n>1?100*stats[0].nominations/(n*(n-1)):null;
    const reciprocity = stats[0].nominations?100*2*mutualPairs/stats[0].nominations:null;
    return {people,eligible,stats,measures,density,reciprocity,mutualPairs,n};
  }
  const integer = value => String(Number(value)||0);
  const percent = value => value == null ? "Нет данных" : value.toFixed(1).replace(".",",") + "%";
  const names = (a,key,max=5) => a.people.map(p => ({p,value:a.measures.get(p.socioId)?.[key]||0}))
    .filter(x => x.value>0).sort((x,y)=>y.value-x.value||x.p.name.localeCompare(y.p.name,"ru"))
    .slice(0,max).map(x => E(x.p.name)+" ("+integer(x.value)+")").join(", ") || "номинации не внесены";

  function sociogram(a) {
    const n=a.people.length;
    if(n<2) return '<p>Для построения социограммы нужно не менее двух учеников.</p>';
    const W=840,H=560,cx=W/2,cy=H/2,r=Math.min(234,Math.max(125,150+n*4));
    const positions=new Map(a.people.map((p,i)=>{
      const angle=-Math.PI/2+2*Math.PI*i/n;
      return [p.socioId,{x:cx+Math.cos(angle)*r,y:cy+Math.sin(angle)*r}];
    }));
    const links=(q,stroke,dashed)=>Array.from(a.stats[q].edges).flatMap(([from,targets])=>
      [...targets].map(to=>{
        const v=positions.get(from),w=positions.get(to);
        if(!v||!w)return "";
        const dx=w.x-v.x,dy=w.y-v.y,len=Math.hypot(dx,dy)||1;
        const start=19,end=24;
        const x1=v.x+dx*start/len,y1=v.y+dy*start/len;
        const x2=w.x-dx*end/len,y2=w.y-dy*end/len;
        return '<line x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+
          '" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" stroke="'+stroke+
          '" stroke-width="1.6" opacity=".44" '+(dashed?'stroke-dasharray="6 4" ':'')+
          'marker-end="url(#psyB5Arrow'+q+')" />';
      }).join(""));
    const nodes=a.people.map((p,i)=>{
      const pos=positions.get(p.socioId),label=String(i+1).padStart(2,"0");
      return '<g><title>'+E(p.name)+'</title><circle cx="'+pos.x.toFixed(1)+
        '" cy="'+pos.y.toFixed(1)+'" r="19" fill="#f7fbf8" stroke="#537a62" stroke-width="2"/>'+
        '<text x="'+pos.x.toFixed(1)+'" y="'+(pos.y+4.5).toFixed(1)+
        '" font-size="12" font-weight="700" text-anchor="middle" fill="#2c4b39">'+label+'</text></g>';
    }).join("");
    const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+
      '" role="img" aria-label="Социограмма: направленные положительные и отрицательные выборы">' +
      '<defs><marker id="psyB5Arrow0" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#3f79a6"/></marker>'+
      '<marker id="psyB5Arrow1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#c45e61"/></marker></defs>'+
      links(0,"#3f79a6",false)+links(1,"#c45e61",true)+nodes+'</svg>';
    return '<details class="psy-b5-graph"><summary>Социограмма: связи класса</summary>'+
      '<p>Синие сплошные стрелки – позитивные выборы (Q1); красные пунктирные – негативные (Q2). Направление стрелки показывает, кто кого назвал. Цвет узлов не означает роль в травле.</p>'+
      '<div class="psy-b5-graph-figure">'+svg+'</div>'+
      '<div class="psy-b5-graph-legend">'+a.people.map((p,i)=>
        '<span><strong>'+String(i+1).padStart(2,"0")+'</strong> – '+E(p.name)+'</span>').join("")+'</div>'+
      '</details>';
  }

  function table(a) {
    return '<div class="psy-b5-table-wrap"><table class="psy-b5-table"><thead><tr>' +
      ['Ученик','LP','LM','SP','SI','Q3','Q4','Q5','Посредничество','Анкета'].map(x => '<th>'+x+'</th>').join("") +
      '</tr></thead><tbody>' + a.people.map(p => {
        const m=a.measures.get(p.socioId), done=Q.filter((_,i)=>{
          const r=record(p,i); return r.status==="none" || (i===1 && r.status==="skip") ||
            (r.status==="answered" && (i!==0 || cleanPicks(p,i,new Set(a.people.map(x=>x.socioId))).length>=2));
        }).length;
        return '<tr><th>'+E(p.name)+'</th>' +
          [m.lp,m.lm,m.sp,m.si,m.ag,m.vi,m.def].map(x=>'<td>'+integer(x)+'</td>').join("")+
          '<td>'+percent(m.betweenness)+'</td><td>'+(absent(p)?"Отсутствовал":done+"/5")+'</td></tr>';
      }).join("") + '</tbody></table></div>';
  }
  function report(a) {
    if (!a.n) return '<p>Сначала внесите список класса.</p>';
    const ready=a.eligible.filter(p => Q.every((_,i)=>{
      const r=record(p,i);
      return r.status==="none" || (i===1&&r.status==="skip") ||
        (r.status==="answered" && (i!==0 || cleanPicks(p,i,new Set(a.people.map(x=>x.socioId))).length>=2));
    })).length;
    return '<div class="psy-b5-report">' +
      '<p>Учеников: <strong>'+a.n+'</strong>. Участвовали: <strong>'+a.eligible.length+
      '</strong>. Полностью заполненных анкет: <strong>'+ready+'</strong>.</p>' +
      '<div class="psy-b5-metrics">' +
      [['Положительных номинаций',a.stats[0].nominations],['Отрицательных номинаций',a.stats[1].nominations],
       ['Плотность позитивной сети',percent(a.density)],['Взаимность позитивных выборов',percent(a.reciprocity)]]
        .map(([label,value])=>'<div><small>'+label+'</small><strong>'+value+'</strong></div>').join("") + '</div>' +
      '<h4>Сводная таблица по ученикам</h4>'+table(a)+sociogram(a)+
      '<h4>Номинации по вопросам 3-5</h4>' +
      '<p><strong>Кого называли среди обижающих других (Q3):</strong> '+names(a,"ag")+'.</p>' +
      '<p><strong>Кого называли среди тех, кого обижают (Q4):</strong> '+names(a,"vi")+'.</p>' +
      '<p><strong>Кого называли заступающимися (Q5):</strong> '+names(a,"def")+'.</p>' +
      '<h4>Полнота ответов</h4><div class="psy-b5-coverage">' +
      a.stats.map((s,i)=>'<div><strong>Вопрос '+(i+1)+'</strong><span>Заполнено '+s.completed+
      ', частично '+s.partial+(i===1?", пропущено по выбору "+s.skipped:"")+
      ' из '+a.eligible.length+'</span></div>').join("")+'</div>' +
      (a.n<15?'<p class="psy-b5-caution">В небольшом классе показатели статуса и центральности следует интерпретировать особенно осторожно.</p>':"")+
      '<p class="psy-b5-caution">Q3-Q5 отражают мнения одноклассников, а не подтвержденные факты травли и не установленные роли. Проверяйте сведения наблюдениями и беседами; не оглашайте персональные номинации классу.</p>' +
      '</div>';
  }
  function field(p,i,j,people) {
    const r=record(p,i),chosen=r.picks[j]||"";
    const shown=r.status==="none"||chosen===NONE?"Никто":people.find(x=>x.socioId===chosen)?.name||"";
    const inputId="psyB5Input"+i+"_"+j,optionsId="psyB5Options"+i+"_"+j;
    return '<div class="psy-socio-pick psy-b5-choice"><label for="'+inputId+'">'+(j+1)+' выбор</label>'+
      '<div class="psy-socio-combo psy-b5-combo" data-b5-q="'+i+'" data-b5-slot="'+j+'">'+
      '<input id="'+inputId+'" class="psy-socio-typeahead psy-b5-typeahead" type="text" autocomplete="off" spellcheck="false" maxlength="120"'+
      ' placeholder="Написать или выбрать" value="'+E(shown)+'" role="combobox" aria-autocomplete="list"'+
      ' aria-expanded="false" aria-controls="'+optionsId+'" aria-label="Вопрос '+(i+1)+', выбор '+(j+1)+'"'+
      ' data-selected="'+E(r.status==="none"?NONE:chosen)+'">'+
      '<button type="button" class="psy-socio-drop psy-b5-drop" aria-label="Показать список учеников" title="Выбрать ученика">'+
      '<span aria-hidden="true">⌄</span></button>'+
      '<div id="'+optionsId+'" class="psy-socio-options psy-b5-options" role="listbox" hidden></div>'+
      '</div></div>';
  }
  function calculator(d,ctx) {
    if (ctx.calcMode!=="class") return '<div class="psy-b5"><h3>Профилактика буллинга: SNA-анкетирование</h3>' +
      '<p>Перейдите в режим «Группа / класс», чтобы внести список учеников и ответы.</p>' +
      '<div class="calc-mode"><button class="btn primary" type="button" data-cmode="class">Группа / класс</button></div></div>';
    const a=analyze(ctx.rows),p=ctx.rows[ctx.rowIndex],people=a.people,active=people.includes(p);
    const list=ctx.rows.map((x,i)=>x.name?.trim()?'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+E(x.name)+'</option>':"").join("");
    const cards=active&&!absent(p)?Q.map((q,i)=>{
      const r=record(p,i);
      return '<article class="psy-b5-question"><div class="psy-b5-qhead"><span class="psy-b5-num">'+(i+1)+'</span><div><h4>'+E(q.title)+'</h4><p>'+E(q.sub)+'</p><small>'+E(q.type)+'</small></div></div>' +
        '<div class="psy-b5-choices">' + Array.from({length:q.max},(_,j)=>field(p,i,j,people)).join("")+'</div>'+
        '<div class="psy-b5-question-bottom">'+
        (q.optional?'<button class="psy-b5-skip" type="button" data-b5-skip="'+i+'">'+
          (r.status==="skip"?"Пропущено":"Пропустить вопрос")+'</button>':"")+
        '<button class="psy-b5-clear" type="button" data-b5-clear="'+i+'">Очистить ответ</button></div>'+
        (i===0&&r.status==="answered"&&cleanPicks(p,i,new Set(people.map(x=>x.socioId))).length===1?
        '<p class="psy-b5-tip">Указан 1 одноклассник. По инструкции желательно назвать 2-5; ответ сохранен как частичный.</p>':"")+
        '</article>';
    }).join(""):"";
    return '<section class="psy-b5"><div class="psy-b5-intro"><h3>Профилактика буллинга: SNA-анкетирование</h3>' +
      '<p>Пять вопросов из методических рекомендаций 2026 года. Внесите список класса. В каждом поле пишите ФИО или выбирайте из списка, где «Никто» всегда первым. Enter подтверждает выбор. Вопрос 2 можно пропустить.</p></div>' +
      '<section class="psy-b5-roster"><div class="psy-socio-roster-head"><strong>Список класса</strong><span>'+people.length+' учеников</span></div>' +
      '<div class="psy-b5-roster-import"><label for="psyB5Names"><strong>Сначала добавьте список класса</strong></label>' +
      '<p class="psy-socio-note">Вставьте или напечатайте ФИО с клавиатуры, по одному ученику на строку. Можно вставить столбец из Excel. Уже внесенные ответы не удаляются.</p>' +
      '<textarea rows="5" id="psyB5Names" placeholder="Иванова Анна&#10;Петров Борис&#10;Сидорова Мария"></textarea>' +
      '<button class="btn primary" type="button" id="psyB5Add">Добавить список класса</button></div>' +
      
      '<div role="status" id="psyB5Message" class="psy-socio-message"></div>' +
      (people.length?'<div class="psy-b5-person"><label>Ученик<select id="psyB5Person">'+list+'</select></label>' +
        '<button class="btn" type="button" id="psyB5Next">Следующий ученик</button></div>':"")+'</section>' +
      (active?'<div class="psy-b5-person-head"><strong>'+E(p.name)+'</strong>' +
        '<button class="btn" type="button" id="psyB5Absent">'+(absent(p)?"Вернуть к обследованию":"Отметить: отсутствовал")+'</button></div>':"") +
      (active&&!absent(p)?'<div class="psy-b5-questions">'+cards+'</div>' +
        '<label class="psy-b5-open"><strong>Дополнительный вопрос (необязательно)</strong>' +
        '<span>Что бы ты хотел(а) изменить в отношениях в классе?</span>' +
        '<textarea id="psyB5Open" rows="3" maxlength="3000" placeholder="Свободный ответ ученика">'+E(p.bullyFiveOpenAnswer||"")+'</textarea></label>':
        active?'<p>Ученик отмечен как отсутствовавший. Его прежние ответы сохранены.</p>':
        '<p>Добавьте состав класса, чтобы приступить к вводу ответов.</p>') +
      '<section class="psy-b5-results"><h3>Результаты класса</h3>'+report(a) +
      '<div class="psy-b5-actions"><button class="btn" type="button" id="psyB5Raw">Скачать ответы CSV</button>' +
      '<button class="btn" type="button" id="psyB5Print">Отчет для печати</button>' +
      '<button class="btn primary" type="button" id="psyB5Save">Сохранить в профиль</button></div></section>' +
      '<p class="psy-socio-note">Сохраняйте обследование в закрытом профиле. Персональные результаты не предназначены для учеников или публичной публикации.</p></section>';
  }
  const nameOf = (id,people) => people.find(p=>p.socioId===id)?.name || "";
  const safeCSV = value => {
    let s=String(value ?? "");
    if (/^\s*[=+\-@]/.test(s)) s="'"+s;
    return '"'+s.replace(/"/g,'""')+'"';
  };
  function exportRows(a) {
    const out=[["Ученик / код","Участие","Вопрос","Тип","Формулировка","Ответ","1 выбор","2 выбор","3 выбор","4 выбор","5 выбор","Открытый ответ"]];
    a.people.forEach(p=>Q.forEach((q,i)=>{
      const r=record(p,i),picks=r.picks.map(id=>nameOf(id,a.people));
      out.push([p.name,absent(p)?"Отсутствовал":"Участвовал",i+1,q.type,q.title,
        r.status==="none"?"Никого":r.status==="skip"?"Пропущено":r.status==="answered"?"Внесены выборы":"Не заполнено",
        ...Array.from({length:5},(_,j)=>picks[j]||""),
        i===0?String(p.bullyFiveOpenAnswer||""):""]);
    }));
    return out;
  }
  function downloadCSV(name,rows) {
    const csv="\uFEFF"+rows.map(row=>row.map(safeCSV).join(";")).join("\r\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob),link=document.createElement("a");
    link.href=url;link.download=name;document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1200);
  }
  function printReport(a) {
    const notes=a.people.filter(p=>String(p.bullyFiveOpenAnswer||"").trim()).map(p=>
      '<p><strong>'+E(p.name)+':</strong> '+E(p.bullyFiveOpenAnswer)+'</p>').join("");
    const body='<h1>SNA-анкетирование: отношения и профилактика буллинга</h1>'+
      '<p>Рабочий конфиденциальный документ специалиста. Источник: методические рекомендации ФГБУ МП МЦ «Роспатриотцентр», 2026.</p>'+
      report(a)+(notes?'<h3>Открытые ответы учеников</h3>'+notes:"")+
      '<h3>Пояснения</h3><p>LP – положительные, LM – отрицательные входящие номинации; SP = LP - LM; SI = LP + LM. Q3-Q5 – отдельные номинации, а не диагностически установленные роли.</p>';
    const style='@page{size:A4 landscape;margin:12mm}body{font:10pt/1.45 Arial,sans-serif;color:#263c31}h1{font-size:16pt}h3,h4{margin:15px 0 7px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #abbab0;padding:4px;font-size:8pt;text-align:left}.psy-b5-metrics{display:flex;gap:16px;flex-wrap:wrap}.psy-b5-metrics>div{padding:5px;border:1px solid #ddd}.psy-b5-metrics small,.psy-b5-metrics strong{display:block}.psy-b5-table-wrap{overflow:visible}.psy-b5-caution{font-size:9pt}.psy-b5-coverage>div{display:flex;gap:10px}.psy-b5-coverage span{margin-left:4px}@media print{button{display:none}}';
    const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>SNA: отчет по классу</title><style>'+style+
      '</style></head><body>'+body+'<p><button onclick="window.print()">Печать</button></p></body></html>';
    const popup=window.open("","_blank");
    if (popup) { popup.document.open(); popup.document.write(html); popup.document.close(); popup.focus(); }
    else {
      const url=URL.createObjectURL(new Blob([html],{type:"text/html;charset=utf-8"}));
      const link=document.createElement("a");link.href=url;link.download="Метолария_буллинг_SNA_отчет.html";
      document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
    }
  }
  function bind(d,ctx) {
    if (ctx.calcMode!=="class") return;
    const current=()=>ctx.rows[ctx.rowIndex];
    const rerender=()=>ctx.onSelect?.(ctx.rowIndex);
    const message=s=>{ const el=document.getElementById("psyB5Message"); if (el) el.textContent=s; };
    if(!roster(ctx.rows).length)document.getElementById("psyB5Names")?.focus({preventScroll:true});
    document.getElementById("psyB5Person")?.addEventListener("change", e=>ctx.onSelect?.(Number(e.target.value)));
    document.getElementById("psyB5Next")?.addEventListener("click", ()=>ctx.onNext?.());
    document.getElementById("psyB5Add")?.addEventListener("click", ()=>{
      const names=(document.getElementById("psyB5Names")?.value||"").split(/\r?\n|;/)
        .map(s=>s.trim().replace(/^\d+[.)]\s*/,"").slice(0,120)).filter(Boolean);
      const existing=new Set(roster(ctx.rows).map(p=>norm(p.name)));
      const added=names.filter(s=>{const key=norm(s);if(existing.has(key))return false;existing.add(key);return true;});
      if (!added.length) {message("Введите новые имена или коды учеников.");return;}
      ctx.onBulkAdd?.(added);
    });
    document.getElementById("psyB5Absent")?.addEventListener("click",()=>{
      if(!current())return;
      current().bullyFiveAbsent=!absent(current());
      changed();rerender();
    });
    document.querySelectorAll("[data-b5-skip]").forEach(button=>button.addEventListener("click",()=>{
      const p=current(),q=Number(button.dataset.b5Skip);
      if(!p||q!==1)return;
      setRecord(p,q,"skip",[]);
      advanceQuestion(q);
    }));
    document.querySelectorAll("[data-b5-clear]").forEach(button=>button.addEventListener("click",()=>{
      const p=current();if(!p)return;
      setRecord(p,Number(button.dataset.b5Clear),"",[]);
      rerender();
    }));
    const combos=[...document.querySelectorAll(".psy-b5-combo")];
    const people=roster(ctx.rows);
    const advanceQuestion=q=>{
      // Finish this question only. Never auto-switch to the next pupil.
      const target=document.getElementById(q<Q.length-1?
        "psyB5Input"+(q+1)+"_0":"psyB5Open");
      if(!target)return;
      target.focus({preventScroll:true});
      target.scrollIntoView?.({behavior:"smooth",block:"center"});
    };
    const close=combo=>{
      const panel=combo.querySelector(".psy-b5-options"),input=combo.querySelector(".psy-b5-typeahead");
      if(panel)panel.hidden=true;
      if(input)input.setAttribute("aria-expanded","false");
      combo.classList.remove("is-open");
    };
    const closeOther=keep=>combos.forEach(c=>{if(c!==keep)close(c);});
    const restore=combo=>{
      const p=current(),q=Number(combo.dataset.b5Q),slot=Number(combo.dataset.b5Slot);
      const r=record(p,q),id=r.picks[slot]||"";
      const input=combo.querySelector(".psy-b5-typeahead");
      input.value=r.status==="none"||id===NONE?"Никто":
        people.find(x=>x.socioId===id)?.name||"";
      input.dataset.selected=r.status==="none"?NONE:id;
    };
    const candidates=(combo,term)=>{
      const p=current(),q=Number(combo.dataset.b5Q),slot=Number(combo.dataset.b5Slot);
      if(!p)return [];
      const used=new Set(record(p,q).picks.filter((id,k)=>id&&id!==NONE&&k!==slot));
      return [{id:NONE,text:"Никто"},...people.filter(x=>x.socioId!==p.socioId&&
        !used.has(x.socioId)&&norm(x.name).includes(norm(term))
      ).map(x=>({id:x.socioId,text:x.name}))];
    };
    const commit=(combo,id)=>{
      const p=current(),q=Number(combo.dataset.b5Q),slot=Number(combo.dataset.b5Slot);
      if(!p||!candidates(combo,"").some(x=>x.id===id)){
        message("Такого выбора нет в списке класса.");return;
      }
      const before=record(p,q),wasFilled=before.status==="none"||Boolean(before.picks[slot]);
      const picks=before.status==="answered"?before.picks.slice():[];
      while(picks.length<Q[q].max)picks.push("");
      if(id===NONE){
        // A "Nobody" after a named pupil ends the nominations, not the
        // entire question; all earlier real choices remain unchanged.
        const earlier=picks.slice(0,slot).filter(v=>v&&v!==NONE);
        if(!earlier.length)setRecord(p,q,"none",[]);
        else{
          for(let k=slot;k<Q[q].max;k++)picks[k]=NONE;
          setRecord(p,q,"answered",picks);
        }
      }else{
        if(picks.some((value,k)=>k!==slot&&value===id)){
          message("Этот ученик уже указан в вопросе.");return;
        }
        for(let k=0;k<slot;k++)if(picks[k]===NONE)picks[k]="";
        picks[slot]=id;
        setRecord(p,q,"answered",picks);
      }
      const input=combo.querySelector(".psy-b5-typeahead");
      // A change to "Nobody" can clear or reopen other slots of this
      // question. Refresh every visible input without rebuilding the page.
      combos.filter(c=>Number(c.dataset.b5Q)===q).forEach(restore);
      close(combo);
      message(id===NONE?"Выбрано «Никто».":"Выбор записан.");
      // A "Nobody" or a confirmed final slot completes the current
      // question. Move to the next question, never to another child.
      if(id===NONE||slot===Q[q].max-1){
        advanceQuestion(q);
      }else if(!wasFilled){
        const next=document.getElementById("psyB5Input"+q+"_"+(slot+1));
        if(next){next.focus({preventScroll:true});next.select?.();}
      }
    };
    const draw=(combo,term)=>{
      closeOther(combo);
      const panel=combo.querySelector(".psy-b5-options"),input=combo.querySelector(".psy-b5-typeahead");
      const found=candidates(combo,term);
      panel.replaceChildren();
      found.forEach(choice=>{
        const button=document.createElement("button");
        button.type="button";button.className="psy-socio-option";
        button.textContent=choice.text;button.dataset.b5Option=choice.id;
        button.setAttribute("role","option");
        button.setAttribute("aria-selected",String(choice.id===input.dataset.selected));
        if(choice.id===NONE)button.classList.add("is-nobody");
        button.addEventListener("mousedown",e=>e.preventDefault());
        button.addEventListener("click",()=>commit(combo,choice.id));
        button.addEventListener("keydown",e=>{
          if(e.key==="Escape"){e.preventDefault();input.focus({preventScroll:true});close(combo);}
          if(e.key!=="ArrowDown"&&e.key!=="ArrowUp")return;
          e.preventDefault();
          const opts=[...panel.querySelectorAll(".psy-socio-option")],i=opts.indexOf(button);
          opts[(i+(e.key==="ArrowDown"?1:-1)+opts.length)%opts.length]?.focus();
        });
        panel.append(button);
      });
      if(found.length===1&&norm(term)&&!["никто","никого"].includes(norm(term))){
        const hint=document.createElement("p");hint.className="psy-socio-no-matches";
        hint.textContent="Совпадений нет. Проверьте имя в списке класса.";panel.append(hint);
      }
      panel.hidden=false;input.setAttribute("aria-expanded","true");combo.classList.add("is-open");
    };
    combos.forEach(combo=>{
      const input=combo.querySelector(".psy-b5-typeahead"),arrow=combo.querySelector(".psy-b5-drop");
      input.addEventListener("focus",()=>draw(combo,norm(input.value)==="никто"?"":input.value));
      input.addEventListener("input",()=>draw(combo,input.value));
      input.addEventListener("keydown",e=>{
        if(e.key==="Escape"){e.preventDefault();restore(combo);close(combo);return;}
        if(e.key==="ArrowDown"||e.key==="ArrowUp"){
          e.preventDefault();
          if(combo.querySelector(".psy-b5-options").hidden)draw(combo,input.value);
          const opts=[...combo.querySelectorAll(".psy-socio-option")];
          const first=e.key==="ArrowUp"?opts.length-1:(input.value.trim()&&opts.length>1?1:0);
          opts[first]?.focus();return;
        }
        if(e.key==="Enter"){
          e.preventDefault();const term=norm(input.value),found=candidates(combo,input.value);
          let chosen=found.find(x=>norm(x.text)===term);
          if(!chosen&&term){
            const real=found.filter(x=>x.id!==NONE);
            if(real.length===1)chosen=real[0];
          }
          if(term==="никого")chosen={id:NONE};
          if(chosen)commit(combo,chosen.id);
          else{message("Уточните ФИО или выберите «Никто».");draw(combo,input.value);}
        }
      });
      input.addEventListener("blur",e=>{
        if(e.relatedTarget?.closest?.(".psy-b5-combo")===combo)return;
        restore(combo);close(combo);
      });
      arrow.addEventListener("click",()=>{
        const open=!combo.querySelector(".psy-b5-options").hidden;
        if(open){close(combo);return;}
        input.focus({preventScroll:true});draw(combo,"");
      });
      combo.addEventListener("focusout",e=>{
        if(!combo.contains(e.relatedTarget)){restore(combo);close(combo);}
      });
    });
    if(!bullyFiveOutsideBound){
      bullyFiveOutsideBound=true;
      document.addEventListener("pointerdown",e=>{
        if(e.target.closest?.(".psy-b5-combo"))return;
        document.querySelectorAll(".psy-b5-combo.is-open").forEach(combo=>{
          const panel=combo.querySelector(".psy-b5-options"),input=combo.querySelector(".psy-b5-typeahead");
          if(panel)panel.hidden=true;
          if(input)input.setAttribute("aria-expanded","false");
          combo.classList.remove("is-open");
        });
      });
    }
    document.getElementById("psyB5Open")?.addEventListener("input",e=>{
      if(!current())return;
      current().bullyFiveOpenAnswer=e.target.value.slice(0,3000);
      changed();
    });
    document.getElementById("psyB5Save")?.addEventListener("click",()=>ctx.onSave?.());
    document.getElementById("psyB5Raw")?.addEventListener("click",()=>downloadCSV(
      "Метолария_профилактика_буллинга_SNA_5_ответы.csv",exportRows(analyze(ctx.rows))));
    document.getElementById("psyB5Print")?.addEventListener("click",()=>printReport(analyze(ctx.rows)));
  }
  function blank() {
    return '<section class="psy-new-print psy-b5-print"><h3>Анкета о взаимоотношениях в классе</h3>'+
      '<p>Код ученика: ___________ Класс: __________ Дата: __________</p>'+
      '<p>Указывай только коды одноклассников. Не выбирай себя. Ответы не обсуждай с другими. Вопрос 2 можно пропустить.</p>'+
      Q.map((q,i)=>'<div class="psy-b5-print-q"><strong>'+(i+1)+'. '+E(q.title)+'</strong><p>'+E(q.sub)+'</p>'+
        Array.from({length:q.max},(_,j)=>'<p>'+(j+1)+'. _______________________</p>').join("")+'</div>').join("")+
      '<p><strong>Необязательно:</strong> Что бы ты хотел(а) изменить в отношениях в классе?</p>'+
      '<p>_______________________________________________________________________</p></section>';
  }
  api.calculator=(d,ctx)=>isFive(d)?calculator(d,ctx):orig.calculator(d,ctx);
  api.bind=(d,ctx)=>isFive(d)?bind(d,ctx):orig.bind(d,ctx);
  api.materials=(d,flag)=>isFive(d)?blank():orig.materials(d,flag);
  api.instruction=d=>isFive(d)
    ? '<h3>Порядок проведения</h3><p>Подготовьте закрытый список кодов класса, получите необходимые согласия и обеспечьте конфиденциальность ответов. Опрос проводится индивидуально для каждого ребенка, без обсуждения ответов с одноклассниками. На бумажном бланке указываются коды.</p>'+
      '<h3>Вопросы анкеты</h3><ol>'+Q.map(q=>'<li>'+E(q.title)+' '+E(q.sub)+'</li>').join("")+'</ol>'+
      '<p>Дополнительный открытый вопрос необязателен: «Что бы ты хотел(а) изменить в отношениях в классе?»</p>'
    : orig.instruction(d);
  api.processing=d=>isFive(d)
    ? '<h3>Обработка ответов</h3><p>LP – количество входящих положительных номинаций Q1; LM – отрицательных номинаций Q2. SP = LP - LM, SI = LP + LM. Номинации по вопросам Q3-Q5 подсчитываются отдельно. Плотность позитивной сети = число позитивных связей / (N × (N-1)). Взаимность – доля позитивных номинаций, получивших ответный выбор. Посредничество рассчитывается в направленном позитивном графе.</p>'+
      '<p>Пустое поле не приравнивается к выбору «Никого». Второй вопрос разрешено пропустить. Один положительный выбор в Q1 сохраняется, но помечается как частичное заполнение.</p>'+
      '<p>Все характеристики описательные. Номинации Q3-Q5 сами по себе не подтверждают, кто является обидчиком, пострадавшим или защитником. При малой выборке и неполных анкетах оценки особенно ограничены.</p>'
    : orig.processing(d);
  api.score=(d,...args)=>isFive(d)?null:orig.score?.(d,...args);
  window.PSY_SOCIO_BULLY_FIVE={version:FIVE,questions:Q.map(q=>q.title),analyze,exportRows};
})();