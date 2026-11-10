"use strict";
(function(){
 const B=window.MetolariaDrawingSmartBridge,root=document.querySelector("main > .intro");
 if(!B||!root)return;
 const section=document.createElement("section");section.className="panel smart-panel";section.setAttribute("aria-labelledby","smartTitle");
 section.innerHTML="\n<div class=\"smart-head\">\n <div><span class=\"smart-kicker\">Интерактивная библиотека рисунков</span><h2 id=\"smartTitle\">Опишите рисунок обычными словами</h2>\n <p>Пишите целыми предложениями. Над желтым словом появляется пульсирующий значок – нажмите и выберите уточнение. Интерпретация появится под описанием.</p></div>\n <div class=\"smart-legend\"><span><i class=\"smart-dot smart-dot-green\"></i>Уточнено</span><span><i class=\"smart-dot smart-dot-amber\"></i>Нужно уточнить</span><span><i class=\"smart-dot smart-dot-red\"></i>Нет в словаре</span></div>\n</div>\n<div class=\"smart-cols\">\n <div class=\"smart-workarea\"><div class=\"smart-fieldtitle\" id=\"smartEditorLabel\">Описание рисунка</div>\n  <div id=\"smartEditor\" class=\"smart-editor\" contenteditable=\"true\" role=\"textbox\" aria-labelledby=\"smartEditorLabel\" aria-multiline=\"true\" spellcheck=\"false\" data-placeholder=\"Например: Ребенок нарисовал большое дерево слева, без корней. Рядом солнце, а под деревом трава.\"></div>\n  <div class=\"smart-actions\"><button type=\"button\" class=\"smart-try\" id=\"smartExample\">Попробовать пример</button><button type=\"button\" id=\"smartClear\">Очистить</button><a href=\"#recordList\">Перейти к протоколу ↓</a></div>\n  <p id=\"smartStatus\" class=\"smart-status\" role=\"status\" aria-live=\"polite\">Распознавание выполняется на устройстве – текст не отправляется на сервер.</p>\n </div>\n <div class=\"smart-analysis\"><h3>Интерпретация рисунка</h3><div id=\"smartPreview\" class=\"smart-preview-content\" aria-live=\"polite\"><p class=\"smart-missing\">Опишите рисунок, чтобы получить связный текст анализа.</p></div><p class=\"smart-hint\">Справочные значения требуют проверки в беседе и не являются самостоятельным диагностическим критерием.</p></div>\n</div>";(document.querySelector(".drawing-search-stage")||root).insertAdjacentElement("afterend",section);
 const editor=document.getElementById("smartEditor"),out=document.getElementById("smartPreview"),status=document.getElementById("smartStatus");
 const pop=document.createElement("div");pop.className="smart-popover";pop.hidden=true;pop.setAttribute("role","dialog");pop.setAttribute("aria-label","Уточнения признака");document.body.append(pop);
 const help=document.createElement("section");help.className="smart-guidance";help.setAttribute("aria-label","Вопросы и дополнения");
 help.innerHTML='<div class="smart-guide-heading"><div><h3>Вопросы к рисунку</h3><p>Можно выбрать ответы здесь или нажать на выделенное слово в тексте.</p></div></div>'+
  '<div id="smartQuestionList" class="smart-questions" aria-live="polite"></div>'+
  '<label class="smart-comment-label" for="smartComment">Дополнительные наблюдения специалиста</label>'+
  '<textarea id="smartComment" class="smart-comment" rows="3" maxlength="6000" placeholder="Допишите важные детали своими словами. Текст сразу появится в интерпретации и сохранится в протоколе."></textarea>';
 editor.closest(".smart-workarea").append(help);
 const questionList=document.getElementById("smartQuestionList"),comment=document.getElementById("smartComment");
 const conclusion=document.getElementById("conclusion");
 if(conclusion)comment.value=conclusion.value||"";
 comment.addEventListener("input",()=>{
  if(conclusion){conclusion.value=comment.value;conclusion.dispatchEvent(new Event("input",{bubbles:true}))}
  renderInterpretation();
 });
 if(conclusion)conclusion.addEventListener("input",()=>{
  if(comment.value!==conclusion.value){comment.value=conclusion.value;renderInterpretation()}
 });
 const clean=s=>String(s||"").toLocaleLowerCase("ru-RU").replace(/ё/g,"е").replace(/\s+/g," ").trim();
 const inflect=s=>{let x=clean(s);if(x.length<4)return x;const y=x.replace(/(иями|ьями|ьях|ья|ями|ами|его|ого|ему|ому|ыми|ими|ых|их|ую|юю|ая|яя|ое|ее|ые|ие|ый|ий|ой|ов|ев|ей|ам|ям|ах|ях|ом|ем|ою|ею|а|я|ы|и|о|е|у|ю|ь)$/,"");return y.length>=3?y:x};
 const stop=new Set("него нее них самого самого же где-то где-либо несколько много ребенок ребёнок нарисовал нарисовала нарисовали рисунок рисунке бумаге листе лист листа это этот эта такое такие был была были здесь там тут уже просто рядом а и но он она они его ее их у в во на под над без с со возле около есть нет не по от про для же или что где как когда потом при этом очень немного много сильно как-то очень видно виден видна изображен изображено изображены цвета цвет цветом красками краской нарисована нарисован нарисовали посмотрите который которая которых который похожа похоже похож сам сама сами все всё".split(" ").map(clean));
 const exact=new Map(),stems=new Map();
 // Dictionary aliases are not interchangeable objects (dinosaur != dragon).
 const unsafeAliases=new Set(["динозавр","ящер","змей"]);
 const nounExceptions=new Set(["динозавр"]);

 function put(map,k,e,rank){if(k.length<3)return;let a=map.get(k);if(!a){a=[];map.set(k,a)}if(!a.some(x=>x.e.id===e.id))a.push({e,rank})}
 B.entries.forEach(e=>{
  if(e.category==="Цвет"||!e.name)return;
  const name=clean(e.name);put(exact,name,e,15);put(stems,name.split(" ").map(inflect).join(" "),e,9);
  // Long composite entries often list generic modifiers as aliases;
  // matching those fragments as whole objects creates false positives.
  if(e.name.split(/\s+/).length<=2&&e.name.length<=35&&
     !["Действие","Выражение"].includes(e.category)){
   String(e.aliases||"").split(/[\s,;|/]+/).map(clean)
    .filter(x=>x.length>=4&&!unsafeAliases.has(x)&&!/(ый|ий|ой|ая|яя|ое|ее|ые|ие|ыми|ими|ого|ему|овать|аться|ится|ились|ают|ала|али|ает|ать|ить|еть)$/.test(x))
    .forEach(alias=>{put(exact,alias,e,5);put(stems,inflect(alias),e,3)});
  }
 });
 const resolved=new Map();
 function ambiguousOptions(str){
  const w=clean(str),forms=[
   [/^зам(ок|ка|ку|ке|ком|ки|ков|кам|ками|ках)$/,"Королевский замок|Замок-крепость|Дверной замок|Замок"],
   [/^цвет(ы|ов|ам|ами|ах)$/,"Полевые цветы|Засохшие цветы|Букет цветов|Корзина цветов|Цветок"],
   [/^букет(а|у|ом|ы|ов|ами|ах)?$/,"Букет цветов|Корзина цветов|Засохшие цветы"],
   [/^пол(е|я|ю|ем|ях|ями|ей)$/,"Поле|Поле цветов"]];
  const f=forms.find(x=>x[0].test(w));
  return f?f[1].split("|").map(name=>B.entries.find(e=>clean(e.name)===clean(name))).filter(Boolean):[];
 }
 const ordinaryWords=new Set("желала желал хотела хотел выйти войти зайти прийти уйти погулять гулять погуляла гуляла пошла пришла пришел пришли пришло произошло случилось случилась случился случиться случается получилось проснулась проснулся сорвала сорвал сорвали срывала срывал посетила посетить посетил увидела увидел решила решил захотела захотел потом однажды наконец обратно вернулась вернулся оказалась оказался стала стало просто совсем чтобы потому очень через этого эту такой такие вместе прежде тогда затем".split(" "));
 function unknownNoun(w){
  const v=w.str;
  if(v.length<4||stop.has(v)||ordinaryWords.has(v)||numberFor(v)!==null)return false;
  if(/(овать|оваться|аться|яться|иться|ться|ить|еть|ать|ять|ыть|йти|шла|шли|шел|шло|лось|лась|лся|лись|ила|или|али|ала|ало|ело|ели|яла|яли|ает|яют|ают|утся|ется|ится|ятся|ешь|ишь|ете|ите|ют|ут|ят|ат|ял|яли|ал|ала|али|ел|ела|ели|ол|ола|оли|ул|ула|ули|ыл|ыла|ыли|ет|ит)$/.test(v))return false;
  if(/(ого|ему|ому|ыми|ими|овых|евых|ых|их|ый|ий|ой|ая|яя|ое|ее|ые|ие|ую|юю|ым|им|ом|ем|енький|енькая|енькие)$/.test(v))return false;
  return true;
 }
 function lookup(str){
  const v=clean(str);
  const direct=exact.get(v)||[];
  if(direct.length)return direct.slice().sort((a,b)=>b.rank+4*Number(b.e.methods.includes(B.getMethod()))-a.rank-4*Number(a.e.methods.includes(B.getMethod())))[0].e;
  // Exact names take priority; short ambiguous stems never match a different noun.
  if(nounExceptions.has(v))return null;
  const mapped=(stems.get(v.split(" ").map(inflect).join(" "))||[])
    .filter(x=>clean(x.e.name).length>3&&(x.rank>=9||x.rank===3&&v.length>=5));
  return mapped.slice().sort((a,b)=>b.rank+4*Number(b.e.methods.includes(B.getMethod()))-a.rank-4*Number(a.e.methods.includes(B.getMethod())))[0]?.e||null;
 }
 const positions={слева:"left",справа:"right",посередине:"center",вверху:"top",сверху:"top",снизу:"bottom",внизу:"bottom",влево:"left",вправо:"right"};
 const sizes=[[/^(больш|крупн|огромн|гигантск)/,"large"],[/^(маленьк|небольш|крошечн|мелк)/,"small"],[/^средн/,"medium"]];
 const shades={красн:"red",оранжев:"orange",желт:"yellow",зелен:"green",голуб:"cyan",син:"blue",фиолет:"purple",розов:"pink",коричнев:"brown",черн:"black",сер:"gray",бел:"white"};
 const parts=[[/^корн/,"roots","count"],[/^лист/,"leaves","feature"],[/^лап/,"paws","count"],[/^зуб/,"teeth","feature"],[/^клык/,"fangs","feature"],[/^рог/,"horns","feature"],[/^крыл/,"wings","feature"],[/^когт/,"claws","feature"],[/^крон/,"crown","feature"],[/^хвост/,"tail","note"],[/^окн/,"windows","count"],[/^двер/,"doors","count"],[/^ветв|^ветк/,"branches","feature"]];
 const shadesOfTone=[[/^бледн/,"Какая бледность изображена?",[["Слабо закрашено","Отмечено слабое закрашивание."],["Светлый оттенок","Выбран очень светлый оттенок."],["Не помню","Особенность не уточнена."]]],[/^ярк/,"Как проявляется яркость?",[["Насыщенный цвет","Цвет объекта насыщенный."],["Контраст","Объект выделен контрастом."],["Не помню","Особенность не уточнена."]]],[/^темн/,"Что кажется темным?",[["Темная окраска","Объект выполнен темными оттенками."],["Штриховка","Показана плотная штриховка."],["Тень","В изображении есть тень."]]]];
 const wordsRx=/[А-Яа-яЁёA-Za-z]+(?:-[А-Яа-яЁёA-Za-z]+)*|\d{1,5}/g;
 const numbers=new Map(Object.entries({
  один:1,одна:1,одно:1,одного:1,одну:1,два:2,две:2,три:3,
  четыре:4,пять:5,шесть:6,семь:7,восемь:8,девять:9,десять:10,
  одиннадцать:11,двенадцать:12,тринадцать:13,четырнадцать:14,
  пятнадцать:15,шестнадцать:16,семнадцать:17,восемнадцать:18,
  девятнадцать:19,двадцать:20
 }));
 function numberFor(word){return /^\d{1,5}$/.test(word)&&Number(word)<=9999?Number(word):numbers.get(word)||null}

 let raw="",marks=[],objects=[],timer=0,composition=false,lastMethod=B.getMethod(),openKey=null,phase="root";
 const chosen=new Map(),answered=new Set();
 function tokens(str){return [...str.matchAll(wordsRx)].slice(0,280).map((m,i)=>({raw:m[0],str:clean(m[0]),root:inflect(m[0]),start:m.index,end:m.index+m[0].length,i}))}
 function detect(str){
  const ws=tokens(str),used=new Set(),all=[],base=[];
  const occupied=(i,n)=>Array.from({length:n},(_,j)=>used.has(i+j)).some(Boolean);
  function mark(i,n,kind,extra={}){
   const start=ws[i].start,end=ws[i+n-1].end;all.push({kind,start,end,raw:str.slice(start,end),...extra});
   for(let k=i;k<i+n;k++)used.add(k);
  }
  // Quantified parts: "четыре листика", "4 лапы".
  for(let i=0;i+1<ws.length;i++){
   if(occupied(i,2))continue;
   const count=numberFor(ws[i].str);
   if(count===null)continue;
   const part=parts.find(x=>x[0].test(ws[i+1].root));
   if(!part||str.slice(ws[i].end,ws[i+1].start).trim())continue;
   mark(i,2,"quantity",{part:part[1],count,mode:part[2]});
  }
  // Negated structural details take priority over bare noun recognition.
  for(let i=0;i+1<ws.length;i++){
   if(occupied(i,2)||ws[i].str!=="без"||str.slice(ws[i].end,ws[i+1].start).trim())continue;
   const rule=parts.find(x=>x[0].test(ws[i+1].root));
   if(rule)mark(i,2,"absence",{part:rule[1],mode:rule[2]});
  }
  for(let i=0;i<ws.length;i++){
   if(used.has(i))continue;
   const w=ws[i];
   if(w.str==="в"&&i+1<ws.length&&["центре","середине"].includes(ws[i+1].str)){mark(i,2,"position",{guess:"center"});continue}
   if(w.str==="по"&&i+1<ws.length&&ws[i+1].str==="центру"){mark(i,2,"position",{guess:"center"});continue}
   if(positions[w.str]){mark(i,1,"position",{guess:positions[w.str]});continue}
   const s=sizes.find(x=>x[0].test(w.root));if(s){mark(i,1,"size",{guess:s[1]});continue}
   const color=Object.entries(shades).find(([k])=>w.root.startsWith(k));
   if(color){mark(i,1,"color",{guess:color[1]});continue}
   if(/^(разноцветн|многоцветн)/.test(w.root)){mark(i,1,"multicolor");continue}
   if(/^коротк/.test(w.root)){mark(i,1,"tailLength",{guess:"short-tail"});continue}
   if(/^длинн/.test(w.root)){mark(i,1,"tailLength",{guess:"long-tail"});continue}
   const t=shadesOfTone.find(x=>x[0].test(w.root));if(t){mark(i,1,"tone",{question:t[1],answers:t[2]});continue}
  }
  for(let i=0;i<ws.length;i++){
   // "Ребенок нарисовал" names the author; "ребенок стоит" may name a drawn character.
   if(used.has(i)||stop.has(ws[i].str)&&!["ребенок","ребёнок"].includes(ws[i].str))continue;
   if(["ребенок","ребёнок"].includes(ws[i].str)&&/^(нарисова|изобраз|рисова)/.test(ws[i+1]?.str||""))continue;
   for(let n=3;n>=1;n--){
    if(i+n>ws.length||occupied(i,n))continue;
    const txt=str.slice(ws[i].start,ws[i+n-1].end);
    if(n>1&&/[^ \tА-Яа-яЁёA-Za-z-]/.test(txt))continue;
    const options=n===1?ambiguousOptions(txt):[];
    const ckey=options.length>1?ws[i].str+":"+ws.slice(0,i).filter(w=>w.str===ws[i].str).length:"";
    const entry=ckey?(options.find(x=>x.id===resolved.get(ckey))||options[0]):lookup(txt);
    if(entry){mark(i,n,"object",{entry,choiceKey:ckey,needsChoice:!!(ckey&&!resolved.has(ckey)),options});base.push(all[all.length-1]);i+=n-1;break}
   }
  }
  // A body part belongs to the nearest matching element when a related object is present.
  base.slice().forEach(m=>{
   const part=parts.find(x=>x[0].test(inflect(m.raw)));if(!part)return;
   const possible=base.filter(x=>x!==m&&Math.abs(x.start-m.start)<110 &&
    (["build","condition","environment","graphics"].some(type=>B.features(x.entry.id,type).some(f=>f.id===part[1]||part[1]==="tail"&&["short-tail","long-tail"].includes(f.id)))||B.counts(x.entry.id).some(c=>c.id===part[1])));
   if(!possible.length)return;
   m.kind="feature";m.part=part[1];m.mode=part[2];
   m.target=possible.sort((a,b)=>Math.abs(a.start-m.start)-Math.abs(b.start-m.start))[0];
   base.splice(base.indexOf(m),1);
  });
  base.sort((a,b)=>a.start-b.start);
   base.forEach(m=>{const i=ws.findIndex(w=>w.start===m.start);
    if(i>0&&numberFor(ws[i-1].str)!==null&&!str.slice(ws[i-1].end,m.start).trim())
     m.objectCount=numberFor(ws[i-1].str);
   });
  // A repeated inflected noun in a prepositional reference (e.g. "под деревом")
  // points to the same drawing element, not a second tree.
  const firstById=new Map();
  base.slice().forEach(m=>{
   const prior=firstById.get(m.entry.id);
   const preceding=clean(str.slice(Math.max(0,m.start-28),m.start)).split(/\s+/).slice(-2).join(" ");
   const reference=/(?:^|\s)(под|над|перед|около|возле|рядом|за|у|на|по|к|с|со|в)$/.test(preceding);
   if(prior&&reference&&m.start-prior.start<220){
    m.kind="reference";m.target=prior;base.splice(base.indexOf(m),1);
   }else firstById.set(m.entry.id,m);
  });
  const ordinal=new Map();
  base.forEach(x=>{const n=ordinal.get(x.entry.id)||0;ordinal.set(x.entry.id,n+1);x.key=x.choiceKey?"object:choice:"+x.choiceKey:"object:"+x.entry.id+":"+n;x.owner=x.key});
  // Red means absent in this catalogue, not a spelling error.
  ws.forEach(w=>{
   if(used.has(w.i)||!unknownNoun(w))return;
   if(/(овала|овали|овал|илась|ились|ился|ается|яется|ется|ится|утся|ются|ает|яют|ают|ать|ить|еть|яла|ыло|али|ало|ила|или|ал|ала|ело|ели|ют|ет|ит|ат|ят)$/.test(w.str))return;
   if(/(ого|ему|ому|ыми|ими|овых|евых|ых|их|ый|ий|ой|ая|яя|ое|ее|ые|ие|ую|юю|ым|им|ом|ем|енький|енькая)$/.test(w.str))return;
   if(["где-то","какого-то","каждого","каждый","вроде"].includes(w.str))return;
   all.push({kind:"unknown",start:w.start,end:w.end,raw:w.raw,key:"unknown:"+w.i});
  });
  all.filter(x=>x.kind!=="object"&&x.kind!=="unknown").forEach(x=>{
   // Size and color adjectives usually describe the next noun, not the
   // preceding object ("под деревом зеленая трава").
   const ahead=base.filter(y=>y.start>=x.end&&y.start-x.end<=42&&
    !/[.!?,;:\n]/.test(str.slice(x.end,y.start)));
   const preferAhead=["size","color","tone"].includes(x.kind)||
    x.kind==="position"&&(x.start===0||/[.!?]\s*$/.test(str.slice(Math.max(0,x.start-3),x.start)));
   const distance=y=>Math.abs(y.start-x.start);
   const sameClause=base.filter(y=>{
    const low=Math.min(x.end,y.end),high=Math.max(x.start,y.start);
    const between=str.slice(low,high);
    if(/[.!?;:\n]/.test(between)||x.kind==="position"&&/,/.test(between))return false;
    return !all.some(m=>m.kind==="unknown"&&m.start>=low&&m.end<=high);
   });
   const closest=sameClause.map(y=>({y,d:distance(y)})).sort((a,b)=>a.d-b.d)[0];
   const aheadInClause=ahead.find(y=>sameClause.includes(y));
   const target=x.target||(preferAhead&&aheadInClause?aheadInClause:closest?.y);
   x.owner=target?.key||null;
   const n=all.filter(y=>y.kind===x.kind&&y.raw===x.raw&&y.start<x.start).length;
   x.key="modifier:"+x.kind+":"+clean(x.raw)+":"+n;
  });

  return {marks:all.sort((a,b)=>a.start-b.start),objects:base.slice(0,40)};
 }
 function getText(){
  const copy=editor.cloneNode(true);
  copy.querySelectorAll(".smart-ping").forEach(x=>x.remove());
  return String(copy.innerText||copy.textContent||"").replace(/\r/g,"").replace(/\u00a0/g," ").slice(0,5000);
 }
 function caret(){
  const sel=getSelection();if(!sel?.rangeCount||!editor.contains(sel.anchorNode))return null;
  const r=sel.getRangeAt(0).cloneRange();
  try{r.selectNodeContents(editor);r.setEnd(sel.anchorNode,sel.anchorOffset);
   const f=r.cloneContents();f.querySelectorAll?.(".smart-ping").forEach(x=>x.remove());return f.textContent.length}
  catch(_){return null}
 }
 function restore(pos){
  if(pos===null)return;
  const walker=document.createTreeWalker(editor,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.parentElement?.closest(".smart-ping")?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
  let n,last=null,left=pos;const sel=getSelection(),r=document.createRange();
  while((n=walker.nextNode())){last=n;if(left<=n.length){r.setStart(n,left);r.collapse(true);sel.removeAllRanges();sel.addRange(r);return}left-=n.length}
  if(last){r.setStart(last,last.length);r.collapse(true);sel.removeAllRanges();sel.addRange(r)}
 }
 function drawMarks(){
  const pos=caret(),frag=document.createDocumentFragment();let previous=0;
  marks.forEach(m=>{
   if(m.start<previous||m.end>raw.length||m.kind!=="unknown"&&!m.owner)return;
   frag.append(document.createTextNode(raw.slice(previous,m.start)));
   const span=document.createElement("span");
   // Unambiguous, directly stated attributes are already recognized;
   // only elements and genuinely uncertain descriptions prompt for clarification.
   const clear=["position","size","color","feature","tailLength","reference"].includes(m.kind)||
     m.kind==="quantity"&&/(?:^|[\s,.;:])(у каждого|у каждой|на каждом|на каждой)(?:[\s,.;:]|$)/i.test(raw.slice(m.end,m.end+42));
   const done=clear||answered.has(m.key)||(m.kind==="object"&&!m.needsChoice)||(m.kind==="object"&&chosen.get(m.key)?.confirmed);
   span.className="smart-mark smart-"+(m.kind==="unknown"?"red":done?"green":"amber");
   span.dataset.smartKey=m.key;
   span.title=m.kind==="unknown"?"Слово отсутствует в библиотеке. Можно описать его вручную.":"Нажмите для уточнения";
   if(m.kind!=="unknown"&&!done){
    const ping=document.createElement("span");ping.className="smart-ping";
    ping.textContent="?";ping.setAttribute("role","button");ping.setAttribute("tabindex","0");
    ping.setAttribute("aria-label","Уточнить "+m.raw);ping.setAttribute("contenteditable","false");
    span.append(ping);
   }
   span.append(document.createTextNode(raw.slice(m.start,m.end)));frag.append(span);previous=m.end;
  });
  frag.append(document.createTextNode(raw.slice(previous)));
  if(!raw)editor.replaceChildren();
  else editor.replaceChildren(frag);
  restore(pos);
 }
 function ownerOf(m){return objects.find(o=>o.key===m.owner)||null}
 function answerFor(o){if(!o)return null;if(!chosen.has(o.key))chosen.set(o.key,{confirmed:false,position:"",size:"",colors:[],features:[],counts:{},notes:[],quantityUnknown:false});return chosen.get(o.key)}
 function countQuestion(name){
  const names={
   "ландыш":"ландышей","ландыши":"ландышей","полевые цветы":"полевых цветов",
   "засохшие цветы":"засохших цветов","букет цветов":"букетов цветов",
   "корзина цветов":"корзин цветов","цветок":"цветов",
   "принцесса":"принцесс","королевский замок":"королевских замков",
   "дверной замок":"дверных замков","замок-крепость":"замков-крепостей",
   "поле цветов":"полей цветов","поле":"полей","дракон":"драконов",
   "дерево":"деревьев","человек":"людей","дом":"домов"
  };
  return "Сколько "+(names[clean(name)]||"таких объектов")+" изображено?";
 }
 function renderInterpretation(){
  const rows=objects.filter(o=>!o.needsChoice).map(o=>{
   const a=answerFor(o);
   const item={key:o.key,elementId:o.entry.id,position:a.position||"unknown",size:a.size,
    colors:a.colors.slice(),features:a.features.slice(),counts:{...a.counts},note:a.notes.join("; ")};
   if(!a.quantityUnknown&&Number.isInteger(o.objectCount)&&o.objectCount>=1)item.counts.objects=o.objectCount;
   if(a.quantityUnknown){delete item.counts.objects;item.note+=(item.note?"; ":"")+"Количество объектов определить невозможно"}
   marks.filter(m=>m.owner===o.key&&m.kind!=="object").forEach(m=>{
    if(m.kind==="position"&&item.position==="unknown")item.position=m.guess;
    if(m.kind==="quantity"){
     if(B.counts(o.entry.id).some(c=>c.id===m.part))item.counts[m.part]=m.count;
     else item.note+=(item.note?"; ":"")+m.raw;
     if(!answered.has(m.key)&&!/(?:^|[\s,.;:])(у каждого|у каждой|на каждом|на каждой)(?:[\s,.;:]|$)/i.test(raw.slice(m.end,m.end+42)))
      item.note+=(item.note?"; ":"")+"Не уточнено, "+m.raw+" указаны на одном или всех объектах";
    }
    if(m.kind==="size"&&!item.size){
     const part=marks.find(z=>z.kind==="feature"&&z.owner===o.key&&z.start>=m.end&&z.start-m.end<5);
     const person=/принцесс|принц|девоч|мальчик|ребен|человек|геро|фе[яи]/i.test(o.entry.name);
     if(part)item.note+=(item.note?"; ":"")+"Деталь: "+m.raw+" "+part.raw;
     else if(person)item.note+=(item.note?"; ":"")+"В рассказе персонаж назван "+m.raw.toLowerCase()+"; размер изображения не указан";
     else item.size=m.guess;
    }
    if(m.kind==="color"&&!item.colors.length)item.colors=[m.guess];
    if(m.kind==="feature"&&!answered.has(m.key)){
     if(m.mode==="note")item.note+=(item.note?"; ":"")+"Деталь изображения: "+m.raw;
     else if(!item.features.includes(m.part))item.features.push(m.part);
    }
    if(m.kind==="tailLength"&&!answered.has(m.key)&&!item.features.includes(m.guess))item.features.push(m.guess);
    if(m.kind==="multicolor"&&!answered.has(m.key))item.note+=(item.note?"; ":"")+"Несколько цветов; оттенки не указаны";
    if(m.kind==="absence"&&!answered.has(m.key)){
     if(["roots","paws","windows","doors"].includes(m.part))item.counts[m.part]=0;
     else if(m.part==="leaves"&&!item.features.includes("no-leaves"))item.features.push("no-leaves");
     else item.note+=(item.note?"; ":"")+"Не изображено: "+m.raw;
    }
    if(m.kind==="tone"&&!answered.has(m.key))item.note+=(item.note?"; ":"")+"В описании: "+m.raw;
   });
   return item;
  });
  const synthesis=B.apply(rows),output=[];
  function block(title,text,cssClass){
   if(!String(text||"").trim())return;
   const section=document.createElement("section");
   section.className=cssClass||"smart-narrative";
   const h=document.createElement("h4");h.textContent=title;
   const p=document.createElement("p");p.textContent=text;
   section.append(h,p);output.push(section);
  }
  function button(label,callback,klass){
   const b=document.createElement("button");b.type="button";b.className=klass||"smart-inline-choice";b.textContent=label;b.onclick=callback;
   return b;
  }
  function ask(card,text,opts,onChoice,hint){
   const wrap=document.createElement("div");wrap.className="smart-inline-question";
   const h=document.createElement("p");h.className="smart-inline-question-title";h.textContent=text;wrap.append(h);
   const grid=document.createElement("div");grid.className="smart-inline-choices";
   opts.forEach(x=>grid.append(button(x.label,()=>onChoice(x.id))));
   wrap.append(grid);
   if(hint){const p=document.createElement("p");p.className="smart-inline-hint";p.textContent=hint;wrap.append(p)}
   card.append(wrap);
  }
  if(objects.length){
   if(raw.trim())block("Сюжет со слов специалиста",raw.trim(),"smart-story");
   objects.slice(0,25).forEach(o=>{
    const a=answerFor(o),r=rows.find(x=>x.key===o.key),card=document.createElement("section");
    card.className="smart-meaning";
    const head=document.createElement("div");head.className="smart-object-head";
    const h=document.createElement("h4");h.textContent=o.needsChoice?"Уточните: «"+o.raw+"»":o.entry.name;
    head.append(h);
    if(!o.needsChoice){
     const edit=button("✎",()=>show(o,"root"),"smart-edit-icon");
     edit.title="Изменить признаки";edit.setAttribute("aria-label","Изменить признаки "+o.entry.name);head.append(edit);
    }
    card.append(head);
    if(o.needsChoice){
     ask(card,"Какой именно объект изображен?",o.options.map(x=>({id:x.id,label:x.name})),
      id=>pick(o,"disambiguate",id));
     output.push(card);return;
    }
    const lines=[];
    if(r.position!=="unknown")lines.push("Расположение: "+(B.positions.find(p=>p.id===r.position)?.label||r.position));
    if(Number.isInteger(r.counts.objects))lines.push("Количество объектов: "+r.counts.objects);
    if(r.size)lines.push("Размер на листе: "+(B.sizes.find(x=>x.id===r.size)?.label||r.size));
    if(r.colors.length)lines.push("Цвета: "+r.colors.map(x=>B.colors.find(c=>c.id===x)?.label||x).join(", "));
    const f=["build","condition","environment","graphics"].flatMap(tab=>B.features(o.entry.id,tab)).filter(x=>r.features.includes(x.id));
    if(f.length)lines.push("Отмеченные детали: "+[...new Set(f.map(x=>x.label))].join(", "));
    const counts=Object.entries(r.counts).filter(([k])=>k!=="objects");
    if(counts.length)lines.push("Детали по количеству: "+counts.map(([k,v])=>(B.counts(o.entry.id).find(x=>x.id===k)?.label||k)+" – "+v).join(", "));
    if(r.note)lines.push(r.note);
    const p=document.createElement("p");p.className="smart-object-facts";
    p.textContent=lines.length?lines.join(". ")+".":"Элемент распознан; характеристики изображения пока не уточнены.";
    card.append(p);
    const hasPosition=r.position!=="unknown";
    const hasCountAlready=Number.isInteger(r.counts.objects)||a.quantityUnknown;
    if(!hasPosition||!hasCountAlready){
     const reminder=document.createElement("p");
     reminder.className="smart-clarify-prompt";
     reminder.textContent="Дополните описание рисунка или выберите ответы на вопросы ниже.";
     card.append(reminder);
    }
    if(hasPosition){
     const row=document.createElement("div");row.className="smart-saved-answer";
     row.append(document.createTextNode("Место на рисунке: "+(B.positions.find(x=>x.id===r.position)?.label||r.position)));
     const edit=button("✎",()=>{a.editPosition=!a.editPosition;renderInterpretation()},"smart-edit-icon");
     edit.title="Изменить расположение";edit.setAttribute("aria-label","Изменить расположение");row.append(edit);card.append(row);
    }
    if(!hasPosition||a.editPosition){
     ask(card,/^ландыш(и|ей|ами|ах)$/i.test(clean(o.raw))?"Где изображены ландыши?":"Где на рисунке расположен объект «"+o.entry.name+"»?",B.positions.map(x=>({id:x.id,label:x.label})),
      id=>{a.position=id;a.editPosition=false;renderInterpretation();drawMarks()});
    }
    const known=Number.isInteger(r.counts.objects)||a.quantityUnknown;
    if(known){
     const row=document.createElement("div");row.className="smart-saved-answer";
     row.append(document.createTextNode("Количество: "+(a.quantityUnknown?"невозможно определить":r.counts.objects)));
     const edit=button("✎",()=>{a.editQuantity=!a.editQuantity;renderInterpretation()},"smart-edit-icon");
     edit.title="Изменить количество";edit.setAttribute("aria-label","Изменить количество");row.append(edit);card.append(row);
    }
    if(!known||a.editQuantity){
     const options=Array.from({length:9},(_,i)=>({id:String(i+1),label:String(i+1)}));
     options.push({id:"unknown",label:"Невозможно определить"});
     ask(card,countQuestion(o.entry.name),options,id=>{
      if(id==="unknown"){a.quantityUnknown=true;delete a.counts.objects}
      else {a.quantityUnknown=false;a.counts.objects=Number(id)}
      a.editQuantity=false;renderInterpretation();drawMarks();
     },"Если их больше девяти, напишите точное число в описании, например «26 ландышей».");
    }
    output.push(card);
   });
   (synthesis.sections||[]).filter(x=>!["Наблюдаемые особенности","Краткий результат"].includes(x.title)).forEach(x=>block(x.title,x.text));
  }else{
   const p=document.createElement("p");p.className="smart-missing";p.textContent=raw.trim()?"Объекты пока не распознаны. Напишите название того, что изображено.":"Опишите рисунок целым предложением.";output.push(p);
  }
  const unknown=[...new Set(marks.filter(m=>m.kind==="unknown").map(m=>m.raw.toLowerCase()))];
  if(unknown.length){const p=document.createElement("p");p.className="smart-unknown-summary";p.textContent="Нет в библиотеке: "+unknown.slice(0,12).join(", ")+". Не подменяйте их другими объектами.";output.push(p)}
  if(comment.value.trim())block("Наблюдения специалиста",comment.value.trim(),"smart-custom-analysis");
  out.replaceChildren(...output);
  const pending=objects.filter(o=>o.needsChoice).length;
  status.textContent=objects.length?"Распознано элементов: "+objects.length+(pending?". Требуют уточнения: "+pending:"")+". Протокол обновляется автоматически.":"Обработка выполняется на устройстве.";
  renderQuestions();
 }
 function renderQuestions(){
  questionList.replaceChildren();
  const requests=[];
  const offer=(m,stage,question)=>{
   if(!m||requests.some(x=>x.m.key===m.key&&x.stage===stage)||requests.length>=7)return;
   requests.push({m,stage,question});
  };
  marks.forEach(m=>{
   if(!m.owner)return;
   if(m.kind==="quantity"&&!/(?:^|[\s,.;:])(у каждого|у каждой|на каждом|на каждой)(?:[\s,.;:]|$)/i.test(raw.slice(m.end,m.end+42))&&!answered.has(m.key))
    offer(m,"quantity","«"+m.raw+"» – для каждого или всего?");
   if(m.kind==="absence"&&!answered.has(m.key))
    offer(m,"absence","«"+m.raw+"» – не нарисованы или скрыты?");
   if(m.kind==="tone"&&!answered.has(m.key))offer(m,"tone",m.question||"Уточнить: "+m.raw);
   if(m.kind==="multicolor"&&!answered.has(m.key))offer(m,"multicolor","Какие цвета у «"+(ownerOf(m)?.entry.name||m.raw)+"»?");
  });
  objects.forEach(o=>{
   const a=answerFor(o);
   if(a?.confirmed)return;
   if(!marks.some(m=>m.owner===o.key&&m.kind==="position")&&!a?.position)
    offer(o,"position","Где находится «"+o.entry.name+"»?");
   if(!marks.some(m=>m.owner===o.key&&m.kind==="color")&&!a?.colors.length)
    offer(o,"color","Каким цветом нарисован «"+o.entry.name+"»?");
   if(!marks.some(m=>m.owner===o.key&&m.kind==="size")&&!a?.size)
    offer(o,"size","Какого размера «"+o.entry.name+"»?");
  });
  if(!requests.length){
   const p=document.createElement("p");p.className="smart-guide-empty";
   p.textContent=raw.trim()?"Можно продолжать описание или дописать собственные наблюдения ниже.":"Вопросы появятся, когда вы начнете описывать рисунок.";
   questionList.append(p);
   return;
  }
  requests.forEach(({m,stage,question})=>{
   const item=document.createElement("div");item.className="smart-question";
   const b=document.createElement("button");b.type="button";b.className="smart-question-trigger";
   b.setAttribute("aria-expanded","false");b.textContent=question+"  ⌄";
   const options=document.createElement("div");options.className="smart-question-options";options.hidden=true;
   b.onclick=()=>{
    options.hidden=!options.hidden;b.setAttribute("aria-expanded",String(!options.hidden));
    if(options.hidden)return;
    const data=popupOptions(m,stage);
    options.replaceChildren();
    data.items.forEach(x=>{
     const choice=document.createElement("button");choice.className="smart-question-answer";choice.type="button";
     choice.textContent=x.label;choice.title=x.hint||x.label;
     choice.dataset.picked=String(!!x.selected);
     choice.onclick=()=>pick(m,stage,x.id);
     options.append(choice);
    });
    if(!data.items.length)options.textContent="В этой методике нет готовых вариантов. Можно описать деталь ниже своими словами.";
   };
   item.append(b,options);questionList.append(item);
  });
 }
 function close(){pop.hidden=true;openKey=null;phase="root"}
 function analyze(){if(composition)return;close();raw=getText();const x=detect(raw);marks=x.marks;objects=x.objects;
  const valid=new Set(objects.map(o=>o.key));for(const k of chosen.keys())if(!valid.has(k))chosen.delete(k);
  drawMarks();renderInterpretation();
 }
 function delay(){clearTimeout(timer);timer=setTimeout(analyze,200)}
 function popupOptions(m,stage){
  const o=m.kind==="object"?m:ownerOf(m),a=answerFor(o),name=o?.entry.name||m.raw;
  if(stage==="root")return {title:"Что уточнить у «"+name+"»?",items:[
   ["position","↗ Расположение","Где на листе?"],["count","123 Количество","1-9 или другое число в описании"],["size","▢ Размер","Какой размер?"],["color","◉ Цвет","Можно выбрать несколько"],
   ["build","✳ Строение","Что изображено?"],["condition","◡ Состояние","Как выглядит или действует?"],["environment","⌂ Окружение","Что рядом?"],["graphics","〰 Линии","Особенности исполнения"],["done","✓ Достаточно","Уточнения завершены"]
  ].map(x=>({id:x[0],label:x[1],hint:x[2]}))};
  if(stage==="disambiguate")return {title:"Что означает «"+m.raw+"»?",items:(m.options||[]).map(x=>({id:x.id,label:x.name,hint:x.meaning}))};
   if(stage==="count")return {title:countQuestion(name),items:Array.from({length:9},(_,i)=>({id:String(i+1),label:String(i+1)})).concat([{id:"unknown",label:"Невозможно определить",hint:"Число больше девяти напишите в описании, например 26 ландышей"}])};
   if(stage==="position")return {title:"Где расположен «"+name+"»?",items:B.positions.map(x=>({id:x.id,label:x.label,hint:x.meaning,selected:x.id===a?.position}))};
  if(stage==="size")return {title:"Какого размера «"+name+"»?",items:B.sizes.map(x=>({id:x.id,label:x.label,hint:x.meaning,selected:x.id===a?.size}))};
  if(stage==="color"||stage==="multicolor")return {title:"Какие цвета у «"+name+"»?",items:B.colors.map(x=>({id:x.id,label:"● "+x.label,hint:x.meaning,selected:a?.colors.includes(x.id)}))};
  if(stage==="tailLength")return {title:"Какой хвост изображен?",items:[
   {id:"short-tail",label:"Короткий хвост",hint:"Деталь силуэта персонажа"},
   {id:"long-tail",label:"Длинный хвост",hint:"Деталь силуэта персонажа"},
   {id:"unknown",label:"Не могу уточнить",hint:"Оставить вопрос открытым"}
  ]};
  if(["build","condition","environment","graphics"].includes(stage))
   return {title:({build:"Какие части видны?",condition:"Как выглядит или действует?",environment:"Что изображено рядом?",graphics:"Как выполнены линии?"})[stage],
    items:B.features(o?.entry.id,stage).slice(0,45).map(x=>({id:x.id,label:x.label,hint:x.meaning,selected:a?.features.includes(x.id)}))};
  if(stage==="quantity")return {title:"Как учитывать «"+m.raw+"»?",items:[
   {id:"each",label:"На каждом объекте",hint:"Указанное число относится к каждому"},
   {id:"total",label:"Всего на рисунке",hint:"Общее количество деталей"},
   {id:"unsure",label:"Не могу уточнить",hint:"Количество указано, охват не определен"}
  ]};
  if(stage==="absence")return {title:"Что означает «"+m.raw+"»?",items:[{id:"absent",label:"Не изображены",hint:"Количество – 0"},{id:"hidden",label:"Скрыты другой деталью",hint:"Нельзя однозначно определить"},{id:"unknown",label:"Не помню",hint:"Оставить вопрос открытым"}]};
  if(stage==="feature")return {title:"Уточните деталь «"+m.raw+"»",items:[{id:"visible",label:"Деталь изображена"},{id:"unknown",label:"Не помню"}]};
  if(stage==="tone")return {title:m.question,items:m.answers.map((x,i)=>({id:String(i),label:x[0],hint:x[1]}))};
  return {title:"Что уточнить?",items:[]};
 }
 function positionPopup(anchor){
  const r=anchor.getBoundingClientRect(),width=Math.min(440,innerWidth-24);
  pop.hidden=false;pop.style.width=width+"px";
  const h=pop.getBoundingClientRect().height;
  pop.style.left=Math.max(12,Math.min(innerWidth-width-12,r.left+r.width/2-width/2))+"px";
  const above=r.top-h-12;
  pop.style.top=(above>=10?above:Math.max(10,Math.min(innerHeight-h-8,r.bottom+12)))+"px";
 }
 function show(m,step){
  if(m.kind==="unknown")return;
  openKey=m.key;phase=step;const data=popupOptions(m,step);
  const head=document.createElement("div");head.className="smart-pop-head";
  const h=document.createElement("h3");h.textContent=data.title;
  const cross=document.createElement("button");cross.type="button";cross.className="smart-pop-close";cross.textContent="×";cross.setAttribute("aria-label","Закрыть варианты");cross.onclick=close;head.append(h,cross);
  const sub=document.createElement("p");sub.className="smart-pop-sub";sub.textContent="Выберите подходящий ответ. Он сразу появится в интерпретации.";
  const grid=document.createElement("div");grid.className="smart-pop-options";
  data.items.forEach(x=>{
   const b=document.createElement("button");b.type="button";b.className="smart-pop-option";b.dataset.picked=String(!!x.selected);
   const span=document.createElement("span");span.textContent=x.label;b.append(span);
   if(x.hint){const small=document.createElement("small");small.textContent=String(x.hint).slice(0,110);b.append(small)}
   b.onclick=()=>pick(m,step,x.id);grid.append(b);
  });
  const footer=document.createElement("div");footer.className="smart-pop-footer";
  if(step!=="root"){
   const back=document.createElement("button");back.className="smart-pop-back";back.textContent="← Другие вопросы";back.onclick=()=>show(m,"root");footer.append(back);
  }else{const hint=document.createElement("span");hint.className="smart-hint";hint.textContent="Ответы можно исправить";footer.append(hint)}
  const finish=document.createElement("button");finish.className="smart-pop-done";finish.textContent="Готово ✓";
  finish.onclick=()=>{answered.add(m.key);const o=m.kind==="object"?m:ownerOf(m);if(o)answerFor(o).confirmed=true;close();drawMarks();renderInterpretation()};
  finish.hidden=step==="disambiguate";footer.append(finish);pop.replaceChildren(head,sub,grid,footer);
  const anchor=[...editor.querySelectorAll("[data-smart-key]")].find(x=>x.dataset.smartKey===m.key);
  if(anchor)positionPopup(anchor);
 }
 function pick(m,step,id){
  if(step==="root"){
   if(id==="done"){answered.add(m.key);answerFor(m).confirmed=true;close();drawMarks();renderInterpretation();return}
   show(m,id);return;
  }
  const o=m.kind==="object"?m:ownerOf(m),a=answerFor(o);
  if(!a){close();return}
  if(step==="disambiguate"){
   if(!m.choiceKey||!(m.options||[]).some(x=>x.id===id))return;
   resolved.set(m.choiceKey,id);a.confirmed=true;close();analyze();return;
  }
  if(step==="count"){
   if(id==="unknown"){delete a.counts.objects;a.quantityUnknown=true}
   else if(/^[1-9]$/.test(id)){a.counts.objects=Number(id);a.quantityUnknown=false}
   else return;
  }
  if(step==="position")a.position=id;
  else if(step==="size")a.size=id;
  else if(step==="color"||step==="multicolor")a.colors=a.colors.includes(id)?a.colors.filter(x=>x!==id):[...a.colors,id];
  else if(step==="quantity"){
   a.counts[m.part]=m.count;
   if(id==="each")a.notes.push("На каждом "+o.entry.name.toLowerCase()+" отмечено "+m.count+" "+m.raw.replace(/^\S+\s+/,""));
   else if(id==="total")a.notes.push("Всего изображено "+m.count+" "+m.raw.replace(/^\S+\s+/,""));
   else a.notes.push("Количество "+m.count+" указано, но охват не уточнен");
  }
  else if(step==="tailLength"){
   a.features=a.features.filter(x=>!["short-tail","long-tail"].includes(x));
   if(id!=="unknown")a.features.push(id);
   else a.notes.push("Длина хвоста не уточнена.");
  }
  else if(["build","condition","environment","graphics"].includes(step))a.features=a.features.includes(id)?a.features.filter(x=>x!==id):[...a.features,id];
  else if(step==="absence"){
   if(id==="absent"&&["roots","paws","windows","doors"].includes(m.part))a.counts[m.part]=0;
   else if(id==="absent"&&m.part==="leaves")a.features.push("no-leaves");
   else a.notes.push(id==="hidden"?"Элемент может быть закрыт: "+m.raw:"Деталь не уточнена: "+m.raw);
  }else if(step==="feature"){
   if(id==="visible"&&m.mode==="note")a.notes.push("Изображена деталь: "+m.raw);
   else if(id==="visible"&&!a.features.includes(m.part))a.features.push(m.part);
   else a.notes.push("Не уточнено: "+m.raw);
  }else if(step==="tone"){
   const choice=m.answers[Number(id)];if(choice)a.notes.push(choice[1]);
  }
  a.confirmed=true;answered.add(m.key);
  if(["color","multicolor","build","condition","environment","graphics"].includes(step)){
   drawMarks();renderInterpretation();show(m,step);return;
  }
  close();drawMarks();renderInterpretation();
 }
 function insertText(text){
  const sel=getSelection();if(!sel?.rangeCount||!editor.contains(sel.anchorNode))return;
  const r=sel.getRangeAt(0);r.deleteContents();const n=document.createTextNode(text);r.insertNode(n);
  r.setStart(n,n.length);r.collapse(true);sel.removeAllRanges();sel.addRange(r);delay();
 }
 editor.addEventListener("beforeinput",e=>{if(e.inputType==="insertParagraph"||e.inputType==="insertLineBreak"){e.preventDefault();insertText("\n")}});
 editor.addEventListener("paste",e=>{e.preventDefault();insertText(e.clipboardData?.getData("text/plain")||"")});
 editor.addEventListener("compositionstart",()=>{composition=true});
 editor.addEventListener("compositionend",()=>{composition=false;delay()});
 editor.addEventListener("input",delay);
 editor.addEventListener("click",e=>{
  const w=e.target.closest("[data-smart-key]"),m=marks.find(x=>x.key===w?.dataset.smartKey);
  if(m&&m.kind!=="unknown"){
   const target=m.kind==="reference"?ownerOf(m):m;
   if(target)show(target,target.kind==="object"?(target.needsChoice?"disambiguate":"root"):target.kind);
  }
 });
 editor.addEventListener("keydown",e=>{
  if((e.key==="Enter"||e.key===" ")&&e.target.closest?.(".smart-ping")){
   e.preventDefault();const w=e.target.closest("[data-smart-key]"),m=marks.find(x=>x.key===w?.dataset.smartKey);
   if(m)show(m,m.kind==="object"?(m.needsChoice?"disambiguate":"root"):m.kind);
  }
 });
 document.addEventListener("pointerdown",e=>{if(!pop.hidden&&!pop.contains(e.target)&&!e.target.closest?.("[data-smart-key]"))close()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!pop.hidden){e.preventDefault();close()}});
 window.addEventListener("resize",()=>{if(openKey){const m=marks.find(x=>x.key===openKey);if(m)show(m,phase)}});
 function setText(text){
  editor.textContent=String(text||"").slice(0,5000);
  if(conclusion)comment.value=conclusion.value||"";
  chosen.clear();answered.clear();resolved.clear();analyze();
 }
 document.getElementById("smartExample").onclick=()=>{
  if(raw.trim()&&!confirm("Заменить описание примером? Вручную добавленные записи останутся."))return;
  setText("Ребенок нарисовал большое дерево слева, без корней. Справа желтое солнце. Под деревом зеленая трава.");
 };
 document.getElementById("smartClear").onclick=()=>{
  if(raw.trim()&&!confirm("Очистить описание? Вручную добавленные записи останутся."))return;
  setText("");
 };
 document.getElementById("method").addEventListener("change",()=>{
  const m=B.getMethod();if(lastMethod!==m){lastMethod=m;chosen.clear();answered.clear();resolved.clear();analyze()}
 });
 window.MetolariaDrawingSmartText={
 getText,setText,clear:()=>setText(""),refresh:analyze,
 getState:()=>({version:1,choices:[...resolved.entries()].slice(0,100),answers:[...chosen.entries()].slice(0,60),answered:[...answered].slice(0,150)}),
 setState(data){
  if(!data||data.version!==1)return;
  resolved.clear();chosen.clear();answered.clear();
  if(Array.isArray(data.choices))data.choices.slice(0,100).forEach(x=>{if(Array.isArray(x)&&typeof x[0]==="string"&&typeof x[1]==="string"&&B.entries.some(e=>e.id===x[1]))resolved.set(x[0].slice(0,100),x[1])});
  if(Array.isArray(data.answers))data.answers.slice(0,60).forEach(x=>{if(Array.isArray(x)&&typeof x[0]==="string"&&x[1]&&typeof x[1]==="object")chosen.set(x[0],Object.assign({confirmed:false,position:"",size:"",colors:[],features:[],counts:{},notes:[],quantityUnknown:false},x[1]))});
  if(Array.isArray(data.answered))data.answered.slice(0,150).forEach(x=>{if(typeof x==="string")answered.add(x)});
  analyze();
 }
};
 analyze();
})();