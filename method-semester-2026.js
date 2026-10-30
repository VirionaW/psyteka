"use strict";
(function(){
/* School semester 2026: version-bound registration and scoring. Never infer a diagnosis from screening scores. */
const EYSENCK_FIRST="https://azps.ru/tests/tests_eysenck_so.html";
const EYSENCK_SECOND="https://chain-ddt.dou.tomsk.ru/wp-content/uploads/2025/04/Diagnostika-suitsidalnogo-povedeniya-podrostkov-modifikatsiya-Ajzenka.pdf";
const WCQ_SOURCE="https://nevapmsc.ru/wp-content/uploads/rmoppmk51.pdf";
const RAZ_SOURCE="https://kmc23.ru/press-center/psihologicheskaya-kopilka/903";
const RAZ_ALT_SOURCE="https://infourok.ru/o-provedenii-socialno-psihologicheskogo-testirovaniya-obuchayushihsya-8-9-klassov-5680637.html";
const CDI_SOURCE="https://mhpssknowledgehub.sph.cuny.edu/measures/childrens-depression-inventory-cdi/";
const CDI_RIGHTS="https://storefront.mhs.com/collections/cdi-2";
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const labels=["Тревожность","Фрустрация","Агрессивность","Ригидность"];
const eScale=(offset,first)=>Array.from({length:10},(_,i)=>first?i+offset+1:i*4+offset+1);
const groups=(names,arrays)=>names.map((name,i)=>({name,q:arrays[i],factor:1}));
const methods=[
 {id:"cdi-27",name:"Опросник детской депрессии М. Ковач (CDI)",author:"М. Ковач (Maria Kovacs), оригинальная CDI, 27 пунктов",age:"7-17 лет для оригинальной формы CDI; применимость русской версии уточняется",theme:"Настроение",n:27,max:2,source:CDI_SOURCE,
  goal:"Оценка выраженности депрессивных симптомов по оригинальной CDI (27 пунктов). Не смешивать с CDI 2 (28 пунктов).",
  instruction:"Предъявите подлинный лицензированный бланк оригинальной CDI. В калькулятор внесите коды выраженности симптома 0, 1 или 2 по ключу именно этого бланка. Порядок вариантов ответа в отдельных пунктах отличается от порядка кодов.",
  scoring:"Оригинальная CDI: сумма 27 закодированных пунктов (0-2 балла каждый), итог 0-54. Для автоматической обработки нужны все 27 кодов. Обратное расположение фраз в бланке учитывается при кодировании по оригинальному ключу, а не при суммировании.",
  interpret:"Только сырой балл 0-54. Без подтвержденной языковой и возрастной нормировки порог и диагностическая категория не рассчитываются. Клиническое заключение и оценка безопасности требуют отдельного обследования.",
  notice:"CDI и CDI 2 – разные формы. Полные стандартизованные тексты и ключи защищены правами правообладателя MHS. Калькулятор не является официальной автоматизированной системой MHS. Нужен законно полученный бланк с ключом.",rights:CDI_RIGHTS},
 {id:"eysenck-40",name:"Самооценка психических состояний Г. Айзенка",author:"Г. Айзенк; редакция для подростков М. В. Хайкиной указана в программе обследования",age:"7-11 классы по программе школьного обследования",theme:"Самооценка",n:40,max:2,source:EYSENCK_SECOND,
  goal:"Четыре показателя: тревожность, фрустрация, агрессивность и ригидность. Доступны две разные последовательности пунктов.",
  instruction:"Выберите ту редакцию, которая совпадает с бумажным бланком. Для каждого из 40 пунктов укажите частоту состояния: 2 – часто, 1 – редко, 0 – не наблюдается.",
  scoring:"Каждая из четырех шкал содержит 10 пунктов. В первой версии шкалы сгруппированы по десяткам; во второй, выбранной по умолчанию, пункты чередуются через каждые четыре номера. Сумма каждой шкалы 0-20; общего диагностического балла нет.",
  interpret:"Чем выше показатель, тем больше отмеченных состояний в соответствующей шкале. Распространенные интервалы 0-7, 8-14, 15-20 нельзя автоматически считать школьными нормами или клиническим диагнозом.",
  notice:"Ваш вариант – версия 2, в которой первые четыре пункта относятся к четырем разным шкалам. Нельзя применять к ней ключ 1-10, 11-20, 21-30, 31-40. Из-за различий между опубликованными бланками сверяйте редакцию по первому утверждению и порядку номеров.",
  versions:[{id:"interleaved",title:"Версия 2 – твой бланк (по очереди: 1, 5, 9...)",
    source:EYSENCK_SECOND,scales:groups(labels,Array.from({length:4},(_,i)=>eScale(i,false)))},
   {id:"block",title:"Версия 1 – по блокам (1-10, 11-20...)",source:EYSENCK_FIRST,
    scales:groups(labels,Array.from({length:4},(_,i)=>eScale(i*10,true)))}]},
 {id:"lazarus-wcq50",name:"Способы совладающего поведения Р. Лазаруса (WCQ)",author:"Р. Лазарус, С. Фолкман; русскоязычные адаптации Т. Л. Крюковой и Л. И. Вассермана и соавт.",age:"7-11 классы по программе обследования; нормативы адаптации требуют отдельного подтверждения",theme:"Адаптация",n:50,max:3,source:WCQ_SOURCE,
  goal:"Изучение восьми стратегий совладания со стрессом по 50-пунктной версии WCQ.",
  instruction:"Предъявите проверенный полный текст конкретной 50-пунктной русскоязычной версии WCQ. Внесите ответы по номерам: 0 – никогда, 1 – редко, 2 – иногда, 3 – часто. Не смешивайте порядок вопросов разных адаптаций.",
  scoring:"Каждый ответ 0-3. По ключу подсчитывается сумма для восьми шкал. Для адаптации Вассермана и соавт. (2009) сырой балл переводится по опубликованной нормативной таблице в Т-балл отдельно для мужчин и женщин возрастных групп 14-20, 21-30, 31-45, 46-60 лет. Вне этих групп указываются только сырые баллы.",
  interpret:"Восемь шкал отражают способы совладания. Для подтвержденных Т-баллов: менее 40 – редкое использование, 40-60 – умеренное, более 60 – выраженное. Т-баллы не являются клиническим диагнозом. При отсутствии применимых возрастно-половых норм показываются сырые баллы без нормативной категории.",
  notice:"Ключ относится к 50-пунктной адаптации НИПНИ им. Бехтерева. Таблицы Т-баллов: Вассерман и соавт., 2009, приложение 2, для пола и возрастов 14-60 лет. Фактический возраст каждого участника вводится отдельно от класса; после 60 лет нормативный показатель не выводится. Не смешивайте редакции и ключи. Полные авторские стимулы здесь не перепечатаны.",
  scales:groups(["Конфронтация","Дистанцирование","Самоконтроль","Поиск социальной поддержки","Принятие ответственности","Бегство-избегание","Планирование решения проблемы","Положительная переоценка"],
   [[2,3,13,21,26,37],[8,9,11,16,32,35],[6,10,27,34,44,49,50],[4,14,17,24,33,36],[5,19,22,42],[7,12,25,31,38,41,46,47],[1,20,30,39,40,43],[15,18,23,28,29,45,48]])},
 {id:"razuvaeva-osr29",name:"Опросник суицидального риска (Шмелев – Разуваева)",author:"А. Г. Шмелев (1992); модификация Т. Н. Разуваевой (1993)",age:"7-11 классы по программе обследования; проводит подготовленный специалист",theme:"Мониторинг риска",n:29,max:1,source:RAZ_SOURCE,
  goal:"Регистрация выраженности отдельных факторов риска и защитного фактора по 29-пунктной модификации. Не служит оценкой вероятности суицида.",
  instruction:"Обследование проводит подготовленный специалист с предусмотренным порядком действий по безопасности. По каждому пункту исходной 29-пунктной формы фиксируйте согласие (1) или несогласие (0).",
  scoring:"По каждой из девяти шкал подсчитываются ответы «да» в соответствующих пунктах и умножаются на опубликованный коэффициент. Показатели шкал не суммируются в общий риск. Отсутствующие ответы нельзя считать отрицательными.",
  interpret:"Только отдельные описательные показатели. Ни один суммарный балл или сочетание баллов не исключает опасности и не заменяет непосредственной оценки суицидальных мыслей, намерений, плана, средств и доступности помощи.",
  notice:"В опубликованных ключах есть существенные различия. Ключ А (методический центр) учитывает семь пунктов социального пессимизма, хотя в той же таблице указан максимум 6. Ключ Б (другие методические материалы) учитывает шесть пунктов и иначе распределяет № 17 и № 21. Выбирайте ключ по конкретному проверенному пособию, не смешивайте при сравнении детей. Общая автоматическая категория суицидального риска не выводится; требуется очная профессиональная оценка безопасности.",
  scales:[
   {name:"Демонстративность",q:[12,14,20,22,27],factor:1.2},
   {name:"Аффективность",q:[1,10,20,23,28,29],factor:1.1},
   {name:"Уникальность",q:[1,12,14,22,27],factor:1.2},
   {name:"Несостоятельность",q:[2,3,6,7,17],factor:1.5},
   {name:"Социальный пессимизм",q:[5,11,13,15,17,22,25],factor:1},
   {name:"Слом культурных барьеров",q:[8,9,18],factor:2.3},
   {name:"Максимализм",q:[4,16],factor:3.2},
   {name:"Временная перспектива",q:[2,3,12,24,26,27],factor:1.1},
   {name:"Антисуицидальный фактор",q:[19,21],factor:3.2}
  ],
  keyVariants:[
   {id:"kmc-seven",title:"Ключ А – КМЦ (7 пунктов социального пессимизма)",source:RAZ_SOURCE},
   {id:"method-six",title:"Ключ Б – методические материалы (6 пунктов)",source:RAZ_ALT_SOURCE,
    changes:{
     "Несостоятельность":[2,3,6,7,21],
     "Социальный пессимизм":[5,11,13,15,22,25],
     "Антисуицидальный фактор":[17,19]
    }}
  ]}
];
const byId=Object.fromEntries(methods.map(m=>[m.id,m]));
const dbase=window.PSY_FULL_METHODS||(window.PSY_FULL_METHODS={});
methods.forEach(m=>{
 const d={id:m.id,author:m.author,age:m.age,kind:"Опросник",count:m.n+" пунктов",goal:m.goal,
   instructions:m.instruction,scoring:m.scoring,interpret:m.interpret,warning:m.notice,
   questions:Array.from({length:m.n},(_,i)=>"Пункт "+(i+1)),
   options:Array.from({length:m.max+1},(_,i)=>String(i)),source:m.source,calculator:true,
   workflow:"semester2026"};
 if(["eysenck-40","lazarus-wcq50","razuvaeva-osr29"].includes(m.id))d.indicators=(m.versions?.[0]?.scales||m.scales).map(s=>s.name);
 dbase[m.name]=d;
});
function cfg(d){return byId[d?.id]}
function getVersion(m,row){return m.versions?.find(v=>v.id===row?.eysenckVersion)||m.versions?.[0]}
function getRazKey(m,row){return m.keyVariants?.find(v=>v.id===row?.razuvaevaKey)||m.keyVariants?.[0]}
function effectiveScales(m,row){
 if(m.id==="razuvaeva-osr29"){
  const changes=getRazKey(m,row)?.changes||{};
  return m.scales.map(s=>changes[s.name]?{...s,q:changes[s.name]}:s);
 }
 return getVersion(m,row)?.scales||m.scales||[];
}
function complete(m,a){return Array.isArray(a)&&Array.from({length:m.n},(_,i)=>a[i]).every(v=>(typeof v==="number"&&Number.isInteger(v)&&v>=0&&v<=m.max)||(typeof v==="string"&&/^\d$/.test(v)&&+v<=m.max))}
function count(m,a){return Array.from({length:m.n},(_,i)=>a?.[i]).filter(v=>(typeof v==="number"&&Number.isInteger(v)&&v>=0&&v<=m.max)||(typeof v==="string"&&/^\d$/.test(v)&&+v<=m.max)).length}
function score(d,a,row){
 const m=cfg(d);if(!m||row?.attendance==="absent"||!complete(m,a))return null;
 const answers=Array.from({length:m.n},(_,i)=>Number(a[i]));
 if(m.id==="cdi-27")return {raw:answers.reduce((x,y)=>x+y,0),max:54,complete:true,answers};
 const scales=effectiveScales(m,row).map((s,index)=>{
  const raw=s.q.reduce((sum,n)=>sum+answers[n-1],0),max=s.q.length*m.max,factor=s.factor||1;
  const tScore=m.id==="lazarus-wcq50"?(window.PSY_WCQ_NORMS_2026?.tScore(index,raw,row?.ageYears,row?.sex)??null):null;
  return {name:s.name,raw,max,factor,adjusted:Math.round(raw*factor*100)/100,percent:raw/max*100,tScore,q:s.q};
 });
 return {complete:true,scales,answers,raw:null};
}
function link(url,title){return '<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(title)+'</a>'}
function intro(m){return '<div class="notice psy-semester-note">'+esc(m.notice)+'</div><p>Подлинный текст и редакция: '+link(m.source,"Открыть опубликованный источник")+(m.rights?' · '+link(m.rights,"Правообладатель"):'')+(m.id==="lazarus-wcq50"?' · '+link(window.PSY_WCQ_NORMS_2026?.source||"https://lektsia.com/14x819f.html","Таблица перевода в Т-баллы"):"")+(m.id==="razuvaeva-osr29"?' · '+link(RAZ_ALT_SOURCE,"Альтернативная опубликованная таблица ключей"):"")+'</p>'}
function instruction(d){const m=cfg(d);if(!m)return "";
 return '<h3>Цель</h3><p>'+esc(m.goal)+'</p><h3>Инструкция для специалиста</h3><p>'+esc(m.instruction)+'</p>'+
 '<h3>Инструкция для участника</h3><blockquote class="kid-instruction">Внимательно прочитай утверждения на выданном бланке и выбери один ответ для каждого номера. Здесь нет правильных или неправильных ответов. Если формулировка непонятна, обратись к специалисту.</blockquote>'+
 '<h3>Обработка и ограничения</h3><p>'+esc(m.scoring)+'</p><p>'+esc(m.interpret)+'</p>'+intro(m);
}
function materials(d){const m=cfg(d);if(!m)return "";
 let html='<h3>Регистрационный бланк</h3><p>На листе А4 номера пунктов и места для ответов. Оригинальные утверждения предъявляются только по соответствующей проверенной форме: '+link(m.source,"источник формы")+'.</p>';
 if(m.versions)html+='<p>По умолчанию выбрана <b>версия 2</b>, как на твоем бланке. Версия 1 имеет другой порядок утверждений.</p><p>Версия 1: '+link(EYSENCK_FIRST,"посмотреть")+'; версия 2: '+link(EYSENCK_SECOND,"посмотреть")+'.</p>';
 html+='<div class="psy-semester-table"><table><thead><tr><th>Пункт</th><th>Варианты ответа</th></tr></thead><tbody>'+
 Array.from({length:m.n},(_,i)=>'<tr><td>'+(i+1)+'</td><td>'+Array.from({length:m.max+1},(_,j)=>String(j)).join(" / ")+'</td></tr>').join("")+'</tbody></table></div>'+intro(m);
 return html;
}
function processing(d){const m=cfg(d);if(!m)return "";
 let html='<h3>Подсчет</h3><p>'+esc(m.scoring)+'</p>';
 if(m.versions)html+=m.versions.map(v=>'<h4>'+esc(v.title)+'</h4>'+scaleTable(v.scales)).join("");
 else if(m.keyVariants)html+=m.keyVariants.map(v=>'<h4>'+esc(v.title)+'</h4>'+scaleTable(effectiveScales(m,{razuvaevaKey:v.id}))+'<p>Источник: '+link(v.source,"Публикация ключа")+'</p>').join("");
 else if(m.scales)html+=scaleTable(m.scales);
 else html+='<p><b>Сумма закодированных ответов 0-2; максимум 54.</b> Исходные ответы должны быть закодированы по точному официальному ключу 27-пунктной формы, без автоматической подмены редакции.</p>';
 return html+'<h3>Интерпретация</h3><p>'+esc(m.interpret)+'</p>'+intro(m);
}
function scaleTable(scales){return '<div class="psy-semester-table"><table><thead><tr><th>Шкала</th><th>Номера пунктов</th><th>Коэффициент</th></tr></thead><tbody>'+
 scales.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.q.join(", ")+'</td><td>'+(s.factor||1).toString().replace(".",",")+'</td></tr>').join("")+'</tbody></table></div>'}
function scoreTone(m,s){
 if(m.id!=="eysenck-40")return "is-neutral";
 return s.raw<=7?"is-low":s.raw<=14?"is-medium":"is-high";
}
function scoreDescription(m,s){
 if(m.id==="eysenck-40")return s.raw<=7?"Низкая выраженность":s.raw<=14?"Средняя выраженность":"Высокая выраженность";
 if(m.id==="lazarus-wcq50")return s.tScore===null?"Сырой балл; возрастно-половая норма недоступна":window.PSY_WCQ_NORMS_2026.level(s.tScore)+" (Т-балл)";
 return "Факторный показатель, не категория риска";
}
function resultTable(m,z){
 return '<div class="psy-semester-table psy-semester-result-table"><table><thead><tr><th>Шкала</th><th>Баллы</th><th>Интерпретация показателя</th></tr></thead><tbody>'+
 z.scales.map(s=>'<tr><td><b>'+esc(s.name)+'</b></td><td><span class="psy-semester-score '+scoreTone(m,s)+'">'+(m.id==="razuvaeva-osr29"?s.adjusted.toFixed(2).replace(".",","):m.id==="lazarus-wcq50"&&s.tScore!==null?s.tScore:s.raw)+'</span><span class="psy-semester-denom">'+(m.id==="razuvaeva-osr29"?" (сырой: "+s.raw+" / "+s.max+")":m.id==="lazarus-wcq50"&&s.tScore!==null?" Т-балл (сырой: "+s.raw+" / "+s.max+")":" / "+s.max)+'</span></td><td>'+esc(scoreDescription(m,s))+'</td></tr>').join("")+'</tbody></table></div>';
}
function result(d,row){const m=cfg(d),n=count(m,row.answers),z=score(d,row.answers,row);
 if(row.attendance==="absent")return '<div class="psy-semester-status is-skipped">Отсутствовал – результаты не рассчитываются</div>';
 let html='<div class="psy-semester-status '+(z?"is-complete":"is-pending")+'">'+(z?"Заполнено – обработано":"Заполнено "+n+" из "+m.n+" – расчет не готов")+'</div>';
 if(!z)return html+'<p class="psy-semester-muted">Все '+m.n+' ответов обязательны. Пустое поле не равно нулю. После удаления ответа прежние итоги скрываются.</p>';
 if(m.id==="cdi-27")return html+'<div class="psy-semester-total">Сырой балл: <strong>'+z.raw+' / 54</strong></div><p>'+esc(m.interpret)+'</p>';
 return html+resultTable(m,z)+'<p class="psy-semester-muted">'+esc(m.interpret)+'</p>';
}
function groupResult(d,rows){const m=cfg(d);
 return '<div class="psy-semester-table"><table><thead><tr><th>Код</th><th>Статус</th><th>Полнота</th><th>Результаты</th></tr></thead><tbody>'+
 rows.map((r,i)=>{const z=score(d,r.answers,r),absent=r.attendance==="absent";return '<tr><td>'+esc(r.name||"У-"+String(i+1).padStart(2,"0"))+'</td><td>'+(absent?"Отсутствовал":z?"Обработан":"Нет полного результата")+'</td><td>'+(absent?"–":count(m,r.answers)+' / '+m.n)+'</td><td>'+(absent?"Исключен из результатов":z?(m.id==="cdi-27"?z.raw+" / 54":z.scales.map(s=>esc(s.name)+": "+(m.id==="razuvaeva-osr29"?s.adjusted:s.raw)).join("; ")):"Не рассчитано")+'</td></tr>'}).join("")+'</tbody></table></div>';
}
const EYSENCK_BLOCK_40=["Не чувствую в себе уверенности.","Часто краснею из-за пустяков.","Мой сон беспокоен.","Легко впадаю в уныние.","Беспокоюсь о воображаемых неприятностях.","Меня пугают трудности.","Люблю копаться в своих недостатках.","Меня легко убедить.","Я мнительный.","Я с трудом переношу время ожидания.","Нередко мне кажутся безвыходными положения, из которых всегда можно найти выход.","Неприятности меня сильно расстраивают, я падаю духом.","При больших неприятностях я склонен без достаточных оснований винить себя.","Несчастья и неудачи ничему меня не учат.","Я часто отказываюсь от борьбы, считая ее бесплодной.","Я нередко чувствую себя беззащитным.","Иногда у меня бывает состояние отчаяния.","Я чувствую растерянность перед трудностями.","В трудные минуты жизни я иногда веду себя по-детски, хочу, чтобы меня пожалели.","Считаю недостатки своего характера неисправимыми.","Оставляю за собой последнее слово.","В разговоре нередко перебиваю собеседника.","Меня легко рассердить.","Люблю делать замечания другим.","Хочу быть авторитетом для других.","Не довольствуюсь малым, хочу большего.","Когда разгневаюсь, плохо себя сдерживаю.","Предпочитаю лучше руководить, чем подчиняться.","У меня резкая, грубоватая жестикуляция.","Я мстителен.","Мне трудно менять привычки.","Мне нелегко переключать внимание.","Очень настороженно отношусь ко всему новому.","Меня трудно переубедить.","Нередко у меня не выходит из головы мысль, от которой следовало бы освободиться.","Нелегко сближаюсь с людьми.","Меня расстраивают даже незначительные нарушения плана.","Нередко я проявляю упрямство.","Неохотно иду на риск.","Резко переживаю отклонения от принятого мною режима дня."];
function calculator(d,ctx){const m=cfg(d),rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],a=r.answers||[];
 let html='<section class="psy-semester"><div class="calc-mode"><button type="button" class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button type="button" class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
 if(ctx.calcMode==="class")html+='<div class="group-tools"><label>Участник <select id="participantSelect">'+rows.map((x,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(x.name||"У-"+(i+1))+'</option>').join("")+'</select></label><label>Условный код<input id="participantName" maxlength="40" value="'+esc(r.name||"")+'" placeholder="У-01"></label><button type="button" class="btn" id="addParticipant">Добавить</button></div>';
 else html+='<p class="psy-semester-muted">Используйте условные коды вместо персональных данных. Ответы обрабатываются в браузере и не отправляются на сервер.</p>';
 if(m.versions)html+='<label class="psy-semester-version">Редакция опросника<select id="semesterVersion">'+m.versions.map(v=>'<option value="'+esc(v.id)+'" '+(getVersion(m,r)?.id===v.id?"selected":"")+'>'+esc(v.title)+'</option>').join("")+'</select></label>';
 html+='<p>'+link(getVersion(m,r)?.source||m.source,"Открыть форму с полными утверждениями")+'</p>'+
 '<div class="psy-semester-grid">'+Array.from({length:m.n},(_,i)=>
 '<label class="psy-semester-item"><span><b>'+(i+1)+'.</b> '+(m.id==="eysenck-40"?esc((getVersion(m,r)?.id==="block"?EYSENCK_BLOCK_40:window.PSY_SCHOOL_711_ITEMS?.["eysenck-40"])?.[i]||"Пункт "+(i+1)):"Пункт "+(i+1))+'</span><select data-sanswer="'+i+'" aria-label="Ответ на пункт '+(i+1)+'"><option value="">Нет ответа</option>'+Array.from({length:m.max+1},(_,v)=>'<option value="'+v+'" '+(String(a[i])===String(v)?"selected":"")+'>'+v+(m.id==="razuvaeva-osr29"?(v?" – Да":" – Нет"):"")+'</option>').join("")+'</select></label>').join("")+'</div>'+
 '<div id="semesterResult">'+result(d,r)+'</div><div class="psy-semester-actions"><button type="button" class="btn" id="semesterClear">Очистить ответы</button><button type="button" class="btn primary" id="semesterExport" '+(score(d,r.answers,r)?"":"disabled")+'>Скачать протокол</button></div>';
 if(ctx.calcMode==="class")html+='<h3>Результаты группы</h3><div id="semesterGroup">'+groupResult(d,rows)+'</div><div class="psy-semester-actions"><button type="button" class="btn" id="semesterLegacyNext" hidden>Следующий участник</button><button type="button" class="btn primary" id="semesterCSV">Скачать CSV класса</button></div>';
 return html+'</section>';
}
const csvCell=v=>{let t=String(v??"");if(/^\s*[=+@-]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"'};
function save(filename,body,type){const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement("a");a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function csv(d,rows){const m=cfg(d),head=["Условный код","Статус","Версия","Заполнено",...(m.id==="cdi-27"?["Сырой балл"]:effectiveScales(m,rows[0]).map(s=>s.name)),...Array.from({length:m.n},(_,i)=>"Пункт "+(i+1))];
 const data=[head,...rows.map((r,i)=>{const z=score(d,r.answers,r);const values=z?(z.scales?z.scales.map(s=>m.id==="razuvaeva-osr29"?s.adjusted:s.raw):[z.raw]):Array.from({length:m.id==="cdi-27"?1:effectiveScales(m,r).length},()=>"");return [r.name||"У-"+(i+1),r.attendance==="absent"?"Отсутствовал":z?"Обработан":"Нет полного результата",m.versions?getVersion(m,r)?.title||"":"",r.attendance==="absent"?"":count(m,r.answers),...values,...Array.from({length:m.n},(_,k)=>r.attendance==="absent"?"":r.answers?.[k]??"")];})];
 return "\uFEFF"+data.map(row=>row.map(csvCell).join(";")).join("\r\n")}
function printPage(d,blank,combined){const m=cfg(d);
 const css='@page{size:A4;margin:15mm}body{font:10.5pt/1.45 Arial;color:#24362e}h1{font-size:17pt}h2{font-size:12pt;margin:18px 0 7px}table{border-collapse:collapse;width:100%;font-size:9pt}th,td{padding:5px;border:1px solid #9cb2a7;text-align:left}tr{break-inside:avoid}.student.separate{break-before:page}';
 const head='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>'+esc(m.name)+'</title><style>'+css+'</style></head><body>';
 const guide='<section><h1>'+esc(m.name)+'</h1><p>'+esc(m.author)+'</p><h2>Цель</h2><p>'+esc(m.goal)+'</p><h2>Инструкция</h2><p>'+esc(m.instruction)+'</p><h2>Обработка</h2><p>'+esc(m.scoring)+'</p><h2>Интерпретация и ограничения</h2><p>'+esc(m.interpret)+'</p><p>Источник: '+esc(m.source)+'</p></section>';
 const sheet='<section class="student '+(combined?"separate":"")+'"><h1>Лист ответов</h1><p>Код участника: ___________________ Дата: _______________</p><p>Редакция опросника: _____________________________________</p><table><thead><tr><th>№</th><th>Ответ (0-'+m.max+')</th><th>№</th><th>Ответ (0-'+m.max+')</th></tr></thead><tbody>'+Array.from({length:Math.ceil(m.n/2)},(_,i)=>'<tr><td>'+(i+1)+'</td><td>________</td><td>'+(i+1+Math.ceil(m.n/2)<=m.n?i+1+Math.ceil(m.n/2):"")+'</td><td>________</td></tr>').join("")+'</tbody></table></section>';
 return head+(blank?sheet:guide)+(combined?sheet:"")+'</body></html>';
}
function bind(d,ctx){const m=cfg(d),r=ctx.rows?.[ctx.rowIndex];if(!m||!r)return;r.answers||=[];
 const refresh=()=>{const a=document.getElementById("semesterResult");if(a)a.innerHTML=result(d,r);const b=document.getElementById("semesterGroup");if(b)b.innerHTML=groupResult(d,ctx.rows);const exp=document.getElementById("semesterExport");if(exp)exp.disabled=!score(d,r.answers,r);syncFooter(d,ctx.rows,ctx.rowIndex)};
 document.querySelectorAll("[data-sanswer]").forEach(el=>el.addEventListener("change",()=>{const n=+el.dataset.sanswer;r.answers[n]=el.value===""?null:+el.value;refresh()}));
 document.getElementById("semesterVersion")?.addEventListener("change",el=>{const newVersion=el.target.value;if(getVersion(m,r)?.id===newVersion)return;
   if(count(m,r.answers)>0&&!confirm("При смене редакции ответы будут очищены, так как ключ и порядок утверждений различаются. Продолжить?")){el.target.value=getVersion(m,r)?.id;return;}
   r.eysenckVersion=newVersion;r.answers=[];ctx.rerender?.();
 });
 document.getElementById("semesterClear")?.addEventListener("click",()=>{if(count(m,r.answers)&&!confirm("Очистить ответы текущего участника?"))return;r.answers=[];ctx.rerender?.()});
 document.getElementById("semesterExport")?.addEventListener("click",()=>{const z=score(d,r.answers,r);if(!z)return;const report='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Протокол</title><style>@page{size:A4;margin:16mm}body{font:11pt/1.5 Arial;color:#1b3329}h1{font-size:17pt}table{border-collapse:collapse;width:100%;margin:16px 0}th,td{border:1px solid #9eb4a6;padding:9px;text-align:left}th{background:#e8f0eb}.psy-semester-score{font-weight:700;padding:5px 9px;display:inline-block;border-radius:7px;color:#26362c;border:1px solid #b2c4b8}.psy-semester-score.is-low{background:#dcefe3;color:#145632}.psy-semester-score.is-medium{background:#ffe8ba;color:#744408}.psy-semester-score.is-high{background:#8d2026;color:#fff}.psy-semester-score.is-neutral{background:#e8edf1;color:#223b4d}.psy-semester-denom{color:#43594d}tr{break-inside:avoid}p{overflow-wrap:anywhere}</style></head><body><h1>'+esc(m.name)+'</h1><p><b>Условный код:</b> '+esc(r.name||"не указан")+'</p>'+(m.versions?'<p><b>Редакция:</b> '+esc(getVersion(m,r).title)+'</p>':'')+'<p><b>Заполнено:</b> '+m.n+' / '+m.n+'</p>'+(z.scales?resultTable(m,z):'<p><b>Сырой балл:</b> '+z.raw+' / 54</p>')+'<h2>Интерпретация и ограничения</h2><p>'+esc(m.interpret)+'</p><p>'+esc(m.notice)+'</p><p><b>Источник:</b> '+esc(getVersion(m,r)?.source||m.source)+'</p></body></html>';
   save("Metolaria_"+m.id+"_protocol.html",report,"text/html;charset=utf-8");
 });
 document.getElementById("semesterCSV")?.addEventListener("click",()=>save("Metolaria_"+m.id+"_class.csv",csv(d,ctx.rows),"text/csv;charset=utf-8"));
}
function syncFooter(d,rows,rowIndex){const indicator=document.getElementById("semesterFooterStatus");if(!indicator)return;const r=rows?.[rowIndex]||{answers:[]};const ready=!!score(d,r.answers,r);indicator.classList.toggle("is-complete",ready);indicator.classList.toggle("is-pending",!ready);indicator.classList.toggle("is-skipped",r.attendance==="absent");indicator.textContent=r.attendance==="absent"?"Отсутствовал":ready?"Обработка готова":"Ответы не заполнены полностью";}
window.PSY_SEMESTER_2026={methods,score,count,instruction,materials,processing,calculator,bind,printPage,csv,syncFooter};
})();
/* Source-specific item sequence: user-provided 'Вопросы_7-11_классы_печать.pdf', pages 1-2. */
window.PSY_SCHOOL_711_ITEMS={"eysenck-40":["Часто я не уверен в своих силах.","Нередко мне кажется безысходным положение, из которого можно найти выход.","Я часто оставляю за собой последнее слово.","Мне трудно менять свои привычки.","Я часто из-за пустяков краснею.","Неприятности меня сильно расстраивают и я падаю духом.","Нередко в разговоре я перебиваю собеседника.","Я с трудом переключаюсь с одного дела на другое.","Я часто просыпаюсь ночью.","При крупных неприятностях я всегда обвиняю себя.","Меня легко рассердить.","Я очень осторожен по отношению перемен в моей жизни.","Я легко впадаю в уныние.","Несчастия и неудачи ничему меня не учат.","Мне приходится часто делать замечания другим.","В споре меня трудно переубедить.","Меня волнуют даже воображаемые неудачи.","Я часто отказываюсь от борьбы, считая ее бесполезной.","Я хочу быть авторитетом для окружающих.","Нередко у меня не выходят из головы мысли, от которых следовало бы избавиться.","Меня пугают трудности, с которыми мне приходится встречаться в жизни.","Нередко я чувствую себя беззащитным.","В любом деле я не довольствуюсь малым, я хочу добиться максимум успеха.","Я легко сближаюсь с людьми.","Я часто копаюсь в своих недостатках.","Иногда у меня бывают состояния отчаяния.","Мне трудно сдерживать себя, когда я сержусь.","Я сильно переживаю если в моей жизни что-то меняется.","Меня легко убедить.","Я чувствую растерянность, если у меня возникают трудности.","Предпочитаю руководить, а не подчиняться.","Нередко я проявляю упрямство.","Меня беспокоит состояние моего здоровья.","В трудные минуты я иногда веду себя по-детски.","У меня резкая, грубоватая жестикуляция.","Я неохотно иду на риск.","Я с трудом переношу время ожидания.","Я думаю, что никогда не смогу исправить свои недостатки.","Я мстителен.","Меня расстраивают даже незначительные нарушения моих планов."],"lazarus-wcq50":["сосредотачивался на том, что мне нужно было делать дальше – на следующем шаге","начинал что-то делать, зная, что это все равно не будет работать, главное – делать хоть что-нибудь","пытался склонить вышестоящих к тому, чтобы они изменили свое мнение","говорил с другими, чтобы больше узнать о ситуации","критиковал и укорял себя","пытался не сжигать за собой мосты, оставляя все, как оно есть","надеялся на чудо","смирялся с судьбой: бывает, что мне не везет","вел себя, как будто ничего не произошло","старался не показывать своих чувств","пытался увидеть в ситуации что-то положительное","спал больше обычного","срывал свою досаду на тех, кто навлек на меня проблемы","искал сочувствия и понимания у кого-нибудь","во мне возникла потребность выразить себя творчески","пытался забыть все это","обращался за помощью к специалистам","менялся или рос как личность в положительную сторону","извинялся или старался все загладить","составлял план действии","старался дать какой-то выход своим чувствам","понимал, что сам вызвал эту проблему","набирался опыта в этой ситуации","говорил с кем-либо, кто мог конкретно помочь в этой ситуации","пытался улучшить свое самочувствие едой, выпивкой, курением или лекарствами","рисковал напропалую","старался действовать не слишком поспешно, доверяясь первому порыву","находил новую веру во что-то","вновь открывал для себя что-то важное","что-то менял так, что все улаживалось","в целом избегал общения с людьми","не допускал это до себя, стараясь об этом особенно не задумываться","спрашивал совета у родственника или друга, которых уважал","старался, чтобы другие не узнали, как плохо обстоят дела","отказывался воспринимать это слишком серьезно","говорил о том, что я чувствую","стоял на своем и боролся за то, чего хотел","вымещал это на других людях","пользовался прошлым опытом – мне приходилось уже попадать в такие ситуации","знал, что надо делать и удваивал свои усилия, чтобы все наладить","отказывался верить, что это действительно произошло","я давал обещание, что в следующий раз все будет по-другому","находил пару других способов решения проблемы","старался, что мои эмоции не слишком мешали мне в других делах","что-то менял в себе","хотел, чтобы все это скорее как-то образовалось или кончилось","представлял себе, фантазировал, как все это могло бы обернуться","молился","прокручивал в уме, что мне сказать или сделать","думал о том, как бы в данной ситуации действовал человек, которым я восхищаюсь и старался подражать ему"],"razuvaeva-osr29":["Вы все чувствуете острее, чем большинство людей","Вас часто одолевают мрачные мысли","Теперь Вы уже не надеетесь добиться желаемого положения в жизни","В случае неудачи Вам трудно начать новое дело","Вам определенно не везет в жизни","Учиться Вам стало труднее, чем раньше","Большинство людей довольны жизнью больше, чем Вы","Вы считаете, что смерть является искуплением грехов","Только зрелый человек может принять решение уйти из жизни","Временами у Вас бывают приступы неудержимого смеха или плача","Обычно Вы осторожны с людьми, которые относятся к Вам дружелюбнее, чем Вы ожидали","Вы считаете себя обреченным человеком","Мало кто искренне пытается помочь другим, если это связано с неудобствами","Вам кажется, что Вас никто не понимает","Человек, который вводит других в соблазн, оставляя без присмотра ценное имущество, виноват примерно столько же, сколько и тот, кто это имущество похищает","В Вашей жизни не было таких неудач, когда казалось, что все кончено","Обычно Вы удовлетворены своей судьбой","Вы считаете, что всегда нужно вовремя поставить точку","В Вашей жизни есть люди, привязанность к которым может очень повлиять на Ваши решения и даже изменить их","Когда Вас обижают, Вы стремитесь во что бы то ни стало доказать обидчику, что он поступил несправедливо","Часто Вы так переживаете, что это мешает Вам говорить","Вам часто кажется, что обстоятельства, в которых Вы оказались, отличаются особой несправедливостью","Иногда Вам кажется, что Вы вдруг сделали что-то скверное или даже хуже","Будущее представляется Вам довольно беспросветным","Большинство людей способны добиваться выгоды не совсем честным путем","Будущее слишком расплывчато, чтобы строить серьезные планы","Мало кому в жизни пришлось испытать то, что пережили недавно Вы","Вы склонны так остро переживать неприятности, что не можете выкинуть мысли об этом из головы","Часто Вы действуете необдуманно, повинуясь первому порыву"]};
