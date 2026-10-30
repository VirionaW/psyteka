"use strict";
(() => {
 const COLORS=[
  {id:"blue",name:"Синий",hex:"#235eaf"}, {id:"red",name:"Красный",hex:"#d9403b"},
  {id:"yellow",name:"Желтый",hex:"#f0c51b"}, {id:"green",name:"Зеленый",hex:"#208452"},
  {id:"purple",name:"Фиолетовый",hex:"#8754af"}, {id:"gray",name:"Серый",hex:"#929292"},
  {id:"brown",name:"Коричневый",hex:"#855635"}, {id:"black",name:"Черный",hex:"#272727"}
 ];
 // Aутогенная норма 34251607 (номера теста Люшера 0-7).
 const NORM=["red","yellow","green","purple","blue","brown","gray","black"];
 const EMOTIONS=["Счастье","Горе","Справедливость","Обида","Дружба","Ссора","Доброта","Злоба","Скука","Восхищение"];
 const SITUATIONS=["Твоя душа","Настроение по дороге в школу","Настроение на уроке чтения","Настроение на уроке письма","Настроение на уроке математики","Настроение при разговоре с учителем","Настроение при общении с одноклассниками","Настроение дома","Настроение во время домашних заданий","Свободный домик – ситуация ребенка"];
 const PAIRS=[
  ["Счастье – горе",0,1,"Базовый комфорт"],
  ["Справедливость – обида",2,3,"Личностный рост"],
  ["Дружба – ссора",4,5,"Межличностное взаимодействие"],
  ["Доброта – злоба",6,7,"Потенциальная агрессия"],
  ["Скука – восхищение",8,9,"Познание"]
 ];
 const FEELING_HELP=[
  "Когда весело, все получается и ребенок этим доволен.",
  "Когда произошло что-то плохое, человек расстроен.",
  "Когда все по правилам, поровну и по-честному.",
  "Когда незаслуженно обидели, обманули или что-то забрали.",
  "Когда друзья помогают, поддерживают и защищают.",
  "Когда ругаются или перестают дружить.",
  "Когда жалеют другого и делают ему хорошее.",
  "Когда обижают или делают другим плохо.",
  "Когда нечем заняться, ничего не интересно.",
  "Когда испытывают радость от чего-то очень красивого."
 ];
 const SITUATION_HELP=[
  "Эмоциональное отношение ребенка к себе, своему внутреннему состоянию.",
  "Настрой по дороге в школу, ожидание школьного дня.",
  "Переживания ребенка на уроке чтения.",
  "Переживания ребенка на уроке письма.",
  "Переживания ребенка на уроке математики.",
  "Переживания в контакте и общении с учителем.",
  "Эмоциональное отношение к общению с одноклассниками.",
  "Настроение в домашней обстановке.",
  "Переживания, связанные с выполнением домашних заданий.",
  "Собственный образ и сюжет ребенка: важно дословное объяснение."
 ];

 const $=id=>document.getElementById(id);
 const state={mode:"one",students:[],selected:0,groupName:"",clipboard:null,step:1,activeColor:"blue"};
 const esc=s=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 const color=id=>COLORS.find(c=>c.id===id);
 const colorName=id=>color(id)?.name||"Не выбран";
 const choice=(c,selected,opts={})=>'<button type="button" class="color-option'+(selected===c.id?' selected':'')+'" data-color="'+c.id+'"'+(opts.stage?' data-stage="'+opts.stage+'" data-index="'+opts.index+'"':'')+' title="'+c.name+'" aria-label="'+c.name+'" aria-pressed="'+(selected===c.id)+'"'+(opts.disabled?' disabled':'')+'><span class="swatch" style="background:'+c.hex+'"></span>'+(opts.short?'':'<span>'+c.name+'</span>')+'</button>';
 const house=(num)=>'<div class="house"><span>'+num+'</span></div>';
 const blank=()=>'<div class="blank-preview"><div class="blank-head">Фамилия, имя _________________________________________ &nbsp; Класс __________ &nbsp; Дата __________</div><h3>Задание 1</h3><div class="blank-ranks">'+Array.from({length:8},(_,i)=>'<div>'+(i+1)+'</div>').join("")+'</div><h3>Задание 2</h3><div class="houses-grid">'+Array.from({length:10},(_,i)=>house(i+1)).join("")+'</div><h3>Задание 3</h3><div class="houses-grid">'+Array.from({length:10},(_,i)=>house(i+1)).join("")+'</div><p>Домик 10: _______________________________________________________________________</p></div>';
 const current=()=>state.students[state.selected]||null;
 const emptyStudent=(name,age)=>({name,age,ranking:Array(8).fill(null),emotions:Array(10).fill(null),situations:Array(10).fill(null),description:""});
 const complete=s=>!!s&&s.name.trim().length>0&&((Number.isInteger(s.age)&&s.age>=3&&s.age<=18)||!!state.groupName.trim())&&s.ranking.length===8&&s.ranking.every(Boolean)&&new Set(s.ranking).size===8&&s.emotions.every(Boolean)&&s.situations.every(Boolean)&&s.description.trim().length>0;
 const validGroup=()=>state.mode!=="group"||state.groupName.trim().length>0;
 function calculate(s){
  if(!s||s.ranking.length!==8||!s.ranking.every(Boolean)||new Set(s.ranking).size!==8)return null;
  const pos=id=>s.ranking.indexOf(id)+1;
  const vk=(18-pos("red")-pos("blue"))/(18-pos("blue")-pos("green"));
  const co=NORM.reduce((sum,id,i)=>sum+Math.abs(pos(id)-(i+1)),0);
  return {vk,co};
 }
 function classifyVK(n){const rounded=Math.round(n*100)/100;
  return rounded<=.50?{text:"Хроническое переутомление, истощение, низкая работоспособность",level:"red"}:rounded<=.91?{text:"Компенсируемое состояние усталости",level:"yellow"}:rounded<=1.90?{text:"Оптимальная работоспособность",level:"green"}:rounded>2?{text:"Перевозбуждение",level:"red"}:{text:"Для ВК от 1,91 до 2,00 категория в руководстве не указана",level:"neutral"};
 }
 function classifyCO(n){
  return n<10?{text:"Преобладание положительных эмоций",level:"green"}:n<=18?{text:"Эмоциональный фон в обычном диапазоне",level:"yellow"}:n===20?{text:"Пограничное значение без категории в источнике",level:"neutral"}:{text:"Преобладание отрицательных эмоций",level:"red"};
 }
 function observations(s){
  const out=[];
  for(const [label,a,b] of PAIRS)if(s.emotions[a]===s.emotions[b])out.push('Одинаковый цвет в паре «'+label+'» – уточните различение этих чувств в беседе.');
  const dark=SITUATIONS.map((v,i)=>["brown","black"].includes(s.situations[i])?v:null).filter(Boolean);
  if(dark.length)out.push('Коричневый или черный в ситуациях: '+dark.join(", ")+'. Уточните переживания ребенка.');
  const same=SITUATIONS.map((v,i)=>{const indexes=s.emotions.map((x,k)=>x===v?EMOTIONS[k]:null).filter(Boolean);return indexes.length?'«'+SITUATIONS[i]+'» – '+indexes.join(", "):null;}).filter(Boolean);
  if(same.length)out.push("Совпадения цветов ситуаций и чувств: "+same.join("; ")+".");
  return out;
 }
 function progress(s){return s.ranking.filter(Boolean).length+s.emotions.filter(Boolean).length+s.situations.filter(Boolean).length+(s.description.trim()?1:0);}
 function setError(text){$("formError").textContent=text||"";}
 function status(){
  const s=current();const done=!!s&&complete(s)&&validGroup();
  if($("tabStatus"))$("tabStatus").className="status-dot "+(done?"ready":"pending");
  if(s){$("studentProgress").textContent=done?"Данные заполнены · результат рассчитан":(progress(s)+"/29 · данные заполнены частично");$("studentProgress").className="completion "+(done?"ready":"pending");}
 }
 function renderInitialPreview(){
  $("previewRectangles").innerHTML=Array.from({length:8},(_,i)=>
   '<div class="overview-rect" aria-label="Прямоугольник '+(i+1)+'"><span>'+(i+1)+'</span></div>').join("");
  for(const id of ["previewEmotions","previewSituations"]){
   $(id).innerHTML=Array.from({length:10},(_,i)=>
    '<div class="overview-house">'+houseSvg(i+1,null)+'<span>'+(i+1)+'</span></div>').join("");
  }
 }
 function renderPeople(){
  $("people").innerHTML=state.students.map((s,i)=>'<button class="person'+(i===state.selected?' selected':'')+(complete(s)&&validGroup()?' done':'')+'" data-person="'+i+'" type="button" aria-pressed="'+(i===state.selected)+'"><span class="mark"></span>'+esc(s.name)+(s.age?' · '+s.age+' лет':state.groupName.trim()?' · '+esc(state.groupName):'')+'</button>').join("");
  $("workArea").hidden=!current();
  $("sheetPreview").hidden=!!current();
  $("groupReport").hidden=state.mode!=="group"||state.students.length===0||state.step!==4;
  status();
 }
 function rankReady(s){return !!s&&s.ranking.length===8&&s.ranking.every(Boolean)&&new Set(s.ranking).size===8;}
 function stageReady(s,n){
  if(!s)return false;
  if(n===1)return rankReady(s);
  if(n===2)return s.emotions.every(Boolean);
  if(n===3)return s.situations.every(Boolean)&&!!s.description.trim()&&validGroup();
  return complete(s)&&validGroup();
 }
 function houseSvg(number,chosen){
  // Two symmetric roof slopes with a chimney that interrupts the right slope.
  // The body, roof and chimney share the chosen paint color.
  const c=color(chosen),fill=c?c.hex:"#ffffff",outline="#34463d";
  const dark=c&&["black","brown","purple","blue","red","green"].includes(chosen);
  const door=dark?"#ffffff":"#34463d";
  return '<svg class="house-shape" viewBox="0 0 124 122" role="img" aria-label="Домик '+number+'">'+
   '<path d="M6 52 L62 8 L80 22 V8 H91 V31 L118 52 Z" fill="'+fill+'" stroke="'+outline+'" stroke-width="2.6" stroke-linejoin="round"/>'+
   '<path d="M21 52 H103 V114 H21 Z" fill="'+fill+'" stroke="'+outline+'" stroke-width="2.6"/>'+
   '<path d="M51 83 H73 V114 H51 Z" fill="none" stroke="'+door+'" stroke-width="2.4"/>'+
   '<circle cx="67" cy="99" r="1.8" fill="'+door+'"/></svg>';
 }
 function renderRanking(){
  const s=current();if(!s)return;
  $("ranking").innerHTML=Array.from({length:8},(_,i)=>{
   const c=color(s.ranking[i]),isSelected=!!c&&c.id===state.activeColor;
   return '<button type="button" class="paint-rect'+(c?' filled':'')+(isSelected?' paint-selected':'')+'" data-rect-index="'+i+'" aria-label="Прямоугольник '+(i+1)+', '+(c?c.name:'не закрашен')+'" title="'+(c?c.name:'Выберите цвет и нажмите')+'" style="'+(c?'--paint-fill:'+c.hex+';':'')+'"><span class="rect-surface" aria-hidden="true"></span><span class="rect-position">'+(i+1)+'</span><span class="rect-color-name">'+(c?c.name:'Не закрашен')+'</span></button>';
  }).join("");
  $("rankPalette").innerHTML=COLORS.map(c=>choice(c,state.activeColor)).join("");
  $("activeColorText").innerHTML='<span class="swatch" style="background:'+color(state.activeColor).hex+'"></span><span>'+color(state.activeColor).name+'</span>';
 }
 function renderColorRows(){
  const s=current();if(!s)return;
  for(const [target,arr,labels,stage] of [["emotionRows",s.emotions,EMOTIONS,"emotions"],["situationRows",s.situations,SITUATIONS,"situations"]]){
   $(target).innerHTML=labels.map((label,i)=>'<div class="paint-house-wrap"><button type="button" class="paint-house'+(arr[i]?' filled':'')+'" data-paint-stage="'+stage+'" data-index="'+i+'" aria-label="Домик '+(i+1)+': '+esc(label)+', '+colorName(arr[i])+'" title="'+esc(label)+'">'+houseSvg(i+1,arr[i])+'<span class="house-index">Домик '+(i+1)+'</span></button><span class="house-caption">'+esc(label)+'</span><span class="house-chosen">'+(arr[i]?esc(colorName(arr[i])):'Не закрашен')+'</span><span class="house-help">'+esc(stage==="emotions"?FEELING_HELP[i]:SITUATION_HELP[i])+'</span></div>').join("");
  }
  $("tenDescription").value=s.description;
 }
 function renderWizard(){
  const s=current(),n=state.step;
  document.querySelectorAll(".worksheet-step").forEach(x=>x.classList.toggle("current",Number(x.dataset.step)===n));
  document.querySelectorAll(".wizard-step").forEach(x=>{
   const step=Number(x.dataset.workstep);
   x.classList.toggle("current",step===n);
   x.classList.toggle("completed",step<n&&stageReady(s,step));
   x.disabled=step>1&&!Array.from({length:step-1},(_,i)=>stageReady(s,i+1)).every(Boolean);
   x.setAttribute("aria-current",step===n?"step":"false");
  });
  $("palettePanel").hidden=n===4;
  $("prevStep").hidden=n===1;
  $("nextStep").hidden=n===4;
  const ready=stageReady(s,n);
  $("nextStep").disabled=!ready;
  $("nextStep").textContent=n===3?"Показать результаты":"Следующий этап";
  if(n===1)$("stepHint").textContent="Закрашено "+s.ranking.filter(Boolean).length+" из 8 прямоугольников";
  else if(n===2)$("stepHint").textContent="Закрашено "+s.emotions.filter(Boolean).length+" из 10 домиков";
  else if(n===3)$("stepHint").textContent="Закрашено "+s.situations.filter(Boolean).length+" из 10 домиков"+(s.description.trim()?" · Последний домик описан":" · Запиши ответ о последнем домике");
  else $("stepHint").textContent="Обработка завершена";
  $("groupReport").hidden=state.mode!=="group"||state.students.length===0||n!==4;
 }
 function setStep(value){
  const n=Math.max(1,Math.min(4,value));
  const s=current();if(!s)return;
  if(n>1&&!Array.from({length:n-1},(_,i)=>stageReady(s,i+1)).every(Boolean))return;
  state.step=n;render();
  document.querySelector(".wizard-steps")?.scrollIntoView({behavior:"smooth",block:"start"});
 }
 function analysisDetails(s){
  const position=id=>s.ranking.indexOf(id)+1;
  const makeColor=id=>({id,colorName:colorName(id),hex:color(id)?.hex||"#ffffff",position:position(id)});
  const feelings=EMOTIONS.map((name,i)=>({
   index:i+1,name,explanation:FEELING_HELP[i],...makeColor(s.emotions[i])
  }));
  const situations=SITUATIONS.map((name,i)=>{
   const id=s.situations[i];
   const related=feelings.filter(f=>f.id===id).map(f=>f.name);
   return {index:i+1,name,explanation:SITUATION_HELP[i],related,dark:["brown","black"].includes(id),...makeColor(id)};
  });
  const pairs=PAIRS.map(([name,a,b,block])=>{
   const first=feelings[a],second=feelings[b];
   return {name,block,first,second,same:first.id===second.id,distance:Math.abs(first.position-second.position)};
  });
  const chains=COLORS.map(c=>{
   const em=feelings.filter(f=>f.id===c.id).map(f=>f.name);
   const sit=situations.filter(f=>f.id===c.id).map(f=>f.name);
   return {id:c.id,name:c.name,hex:c.hex,rank:position(c.id),em,sit,total:em.length+sit.length};
  }).filter(x=>x.total>=2);
  return {feelings,situations,pairs,chains};
 }
 function reportColor(item){
  return '<span class="analysis-color"><span class="analysis-color-swatch" style="background:'+item.hex+'"></span><strong>'+esc(item.colorName||item.name)+'</strong><span>· место '+item.position+' из 8</span></span>';
 }
 function renderDetailReport(s){
  const d=analysisDetails(s);
  const road='<div class="analysis-road">'+s.ranking.map((id,i)=>'<div class="analysis-road-item"><span class="analysis-road-swatch" style="background:'+color(id).hex+'"></span><b>'+(i+1)+'</b><small>'+esc(colorName(id))+'</small></div>').join("")+'</div>';
  const pairCards=d.pairs.map(p=>
   '<article class="analysis-pair"><h4>'+esc(p.name)+'</h4><p class="analysis-domain">Сфера: '+esc(p.block)+'</p>'+
   '<p>'+esc(p.first.name)+': '+reportColor(p.first)+'</p><p>'+esc(p.second.name)+': '+reportColor(p.second)+'</p>'+
   '<p class="analysis-interpretation">'+(p.same?
   'Чувства получили одинаковый цвет. В руководстве это рассматривается как повод проверить, различает ли ребенок противоположные переживания.':
   'Цвета разные; расстояние между выбранными цветами в дорожке – '+p.distance+' '+(p.distance===1?'место':p.distance<5?'места':'мест')+'. Руководство предлагает учитывать эту дистанцию, не задавая числового порога.')+'</p></article>'
  ).join("");
  const emotionCards=d.feelings.map(item=>
   '<article class="analysis-house-card"><div class="analysis-house-icon">'+houseSvg(item.index,item.id)+'</div><div class="analysis-house-content"><h4>Домик '+item.index+' · '+esc(item.name)+'</h4>'+
   reportColor(item)+'<p>'+esc(item.explanation)+'</p></div></article>').join("");
  const situationCards=d.situations.map(item=>
   '<article class="analysis-house-card"><div class="analysis-house-icon">'+houseSvg(item.index,item.id)+'</div><div class="analysis-house-content"><h4>Домик '+item.index+' · '+esc(item.name)+'</h4>'+
   reportColor(item)+'<p>'+esc(item.explanation)+'</p>'+
   '<p><strong>Совпадения с чувствами:</strong> '+esc(item.related.length?item.related.join(", "):"не выявлены")+'.</p>'+
   (item.dark?'<p class="analysis-attention">Коричневый или черный цвет: по руководству эту сферу следует дополнительно обсудить с ребенком, не делая вывода по одному цвету.</p>':'')+
   (item.index===10?'<p><strong>Слова ребенка:</strong> '+esc(s.description)+'</p>':'')+'</div></article>').join("");
  const chains=d.chains.length?'<ul class="analysis-chains">'+d.chains.map(group=>
   '<li>'+reportColor({name:group.name,hex:group.hex,position:group.rank})+
   '<div>Чувства: '+esc(group.em.length?group.em.join(", "):"нет совпадений")+'.</div><div>Ситуации: '+esc(group.sit.length?group.sit.join(", "):"нет совпадений")+'.</div></li>').join("")+'</ul>':
   '<p class="muted">Повторяющихся цветовых ассоциаций не выявлено.</p>';
  const caution=d.situations.filter(x=>x.dark);
  return '<section class="analysis-section"><h3>1. Цветовая дорожка – как ребенок предпочел цвета</h3>'+
   '<p class="muted">Номер 1 – первый выбранный цвет, номер 8 – последний. Позиция цвета помогает сопоставить эмоциональные и школьные домики с личными предпочтениями. Это не самостоятельная оценка эмоции.</p>'+road+'</section>'+
   '<section class="analysis-section"><h3>2. Социальные эмоции – все 10 домиков</h3>'+
   '<p class="muted">Ниже указан каждый домик, его цвет, место цвета в дорожке и смысл чувства из инструкции. В методике сравнивают пять пар противоположных переживаний.</p>'+
   '<div class="analysis-houses">'+emotionCards+'</div>'+
   '<h4>Пять пар и соответствующие сферы</h4><div class="analysis-pairs">'+pairCards+'</div></section>'+
   '<section class="analysis-section"><h3>3. Школьные и личные ситуации – все 10 домиков</h3>'+
   '<p class="muted">Здесь отражено эмоциональное отношение ребенка к себе, школе, учителю, одноклассникам и учебным занятиям. Указаны совпадения цветов с домиками чувств.</p>'+
   '<div class="analysis-houses">'+situationCards+'</div></section>'+
   '<section class="analysis-section"><h3>4. Совпадающие цвета – цепочки ассоциаций</h3>'+
   '<p class="muted">Одинаковый цвет соединяет разные чувства и ситуации. Руководство предлагает смотреть на такие цепочки совместно, например «школа – счастье – восхищение» или «домашние задания – горе – скука».</p>'+chains+'</section>'+
   '<section class="analysis-section"><h3>5. Что уточнить в беседе</h3>'+
   (caution.length?'<p>Коричневый или черный цвет отмечен в '+caution.length+' '+(caution.length===1?'ситуации':caution.length<5?'ситуациях':'ситуациях')+': '+esc(caution.map(x=>x.name).join("; "))+'. По руководству это повод внимательнее обсудить эти переживания.</p>':'<p>Коричневый и черный цвета не выбраны для школьных ситуаций; оценка этих сфер опирается на остальные совпадения цветов и их места в дорожке.</p>')+
   '<p><strong>О десятом домике ребенок сказал:</strong> '+esc(s.description)+'</p>'+
   '<p class="muted">Отношение к школе по этой методике может описываться как положительное, амбивалентное или отрицательное, но итоговую категорию определяет психолог по целому протоколу и беседе. Для комплексной оценки адаптации нужны также данные учителя, родителей и другие наблюдения.</p></section>';
 }

 // Narrative decisions use the color order and cross-task associations documented by Orekhova.
 // The provided manual DOES NOT define distinct personality traits for all 56 ordered color pairs.
 // Every ordered pair is supported without attributing undocumented symbolic meaning to colors.
 function narrativeReport(s){
  if(!s||!calculate(s)||!s.emotions.every(Boolean)||!s.situations.every(Boolean))return [];
  const score=calculate(s);
  const positions=Object.fromEntries(s.ranking.map((id,i)=>[id,i+1]));
  const main=new Set(["blue","green","red","yellow"]);
  const negative=new Set(["brown","black"]);
  const f=s.emotions;
  const sit=s.situations;
  const plus=[0,2,4,6,9],minus=[1,3,5,7,8];
  const feelingsBy=id=>EMOTIONS.filter((x,i)=>f[i]===id);
  const situationsBy=id=>SITUATIONS.filter((x,i)=>sit[i]===id);
  const chooseList=arr=>arr.length===1?arr[0]:arr.length===2?arr.join(" и "):arr.slice(0,-1).join(", ")+" и "+arr[arr.length-1];
  const colorAcc=id=>({red:"красного",yellow:"желтого",green:"зеленого",blue:"синего",purple:"фиолетового",brown:"коричневого",gray:"серого",black:"черного"})[id];
  const inColor=id=>({red:"красным",yellow:"желтым",green:"зеленым",blue:"синим",purple:"фиолетовым",brown:"коричневым",gray:"серым",black:"черным"})[id];
  const descFirst={red:"красный",yellow:"желтый",green:"зеленый",blue:"синий",purple:"фиолетовый",brown:"коричневый",gray:"серый",black:"черный"};
  const first=s.ranking[0],second=s.ranking[1],third=s.ranking[2],last=s.ranking[7];
  const p={};
  p.header="Психологический вывод по методике «Домики» О. А. Ореховой";
  const lead="На первом месте в цветовой дорожке расположен "+descFirst[first]+", на втором – "+descFirst[second]+", на третьем – "+descFirst[third]+". Последним выбран "+descFirst[last]+" цвет.";
  let pair;
  if(main.has(first)&&main.has(second))
   pair="Оба ведущих цвета относятся к основным. Их соседство в начале дорожки показывает, что именно эта пара является наиболее предпочтительной в индивидуальном порядке ребенка.";
  else if(!main.has(first)&&!main.has(second))
   pair="Первые два места заняли неосновные цвета. При дальнейшем анализе особенно важно проверить, каким цветам ребенок сопоставил положительные и отрицательные чувства и какие основные цвета оказались ближе к концу дорожки.";
  else if(main.has(first))
   pair="Основной цвет стоит первым, а неосновной – сразу за ним. Такой порядок показывает сочетание разных групп цветов среди наиболее предпочитаемых; его значение уточняется через домики чувств и школьных ситуаций.";
  else
   pair="Неосновной цвет стоит первым, а основной – сразу за ним. Для оценки эмоциональной направленности здесь особенно значимы последующие ассоциации с конкретными чувствами и школьными ситуациями.";
  const topAssoc=[first,second].map((id,index)=>{
   const emo=feelingsBy(id),school=situationsBy(id);
   const part=[];
   if(emo.length)part.push("в домиках чувств «"+chooseList(emo)+"»");
   if(school.length)part.push("в ситуациях «"+chooseList(school)+"»");
   return part.length?"Цвет, занявший "+(index===0?"первое":"второе")+" место ("+descFirst[id]+"), ребенок также использовал "+chooseList(part)+".":"Цвет, занявший "+(index===0?"первое":"второе")+" место ("+descFirst[id]+"), в домиках чувств и ситуаций повторно не использован.";
  }).join(" ");
  const mainAtEnd=s.ranking.slice(4).filter(x=>main.has(x));
  const inversion=mainAtEnd.length>=3?"Три или четыре основных цвета находятся во второй половине дорожки: "+chooseList(mainAtEnd.map(x=>descFirst[x]))+". В руководстве такая инверсия рассматривается вместе с особенностями различения социальных эмоций.":mainAtEnd.length===2?"Во второй половине дорожки оказались два основных цвета; при сопоставлении с домиками важно учитывать не только цвет, но и его место.":"Большинство основных цветов находится в первой половине дорожки.";
  p.ranking=lead+" "+pair+" "+topAssoc+" "+inversion;
  const vk=classifyVK(score.vk),co=classifyCO(score.co);
  const vkMean=vk.level==="green"?"По ВК отмечается оптимальный уровень работоспособности: энергозатраты в рамках описанного руководством диапазона.":vk.text==="Перевозбуждение"?"ВК указывает на перевозбуждение и возможное напряжение энергетических ресурсов.":vk.text.startsWith("Компенсируемое")?"ВК соответствует компенсируемой усталости: поддержание деятельности может требовать периодического снижения нагрузки.":vk.level==="red"?"ВК относится к зоне выраженного переутомления и снижения работоспособности.":"Данное значение ВК находится на границе диапазонов, для которой в предоставленном руководстве нет отдельного уровня.";
  const coMean=co.level==="green"?"Низкое суммарное отклонение соответствует преобладанию положительного эмоционального фона.":co.level==="yellow"?"Суммарное отклонение находится в диапазоне обычного эмоционального фона: возможны и положительные, и отрицательные переживания.":co.level==="red"?"Высокое суммарное отклонение соответствует преобладанию отрицательных эмоций и неблагоприятных переживаний.":"Значение СО = 20 не отнесено к отдельному уровню в предоставленном руководстве; необходимо рассматривать полный профиль ответов.";
  p.indices="Вегетативный коэффициент составляет "+score.vk.toFixed(2).replace(".",",")+", суммарное отклонение от аутогенной нормы – "+score.co+". "+vkMean+" "+coMean;
  const blocks=PAIRS.map(([name,a,b,domain])=>{
   const same=f[a]===f[b],d=Math.abs(positions[f[a]]-positions[f[b]]);
   let sentence="В сфере «"+domain.toLowerCase()+"» («"+name+"») ребенок выбрал "+inColor(f[a])+" для «"+EMOTIONS[a].toLowerCase()+"» и "+inColor(f[b])+" для «"+EMOTIONS[b].toLowerCase()+"». ";
   if(same)sentence+="Противоположные чувства объединены одним цветом; это указывает на слабую цветовую дифференциацию именно данной пары.";
   else if(d>=4)sentence+="Цвета находятся далеко друг от друга в дорожке (разница "+d+" позиций); противопоставление чувств выражено в системе его собственных цветовых предпочтений.";
   else if(d===1)sentence+="Хотя использованы разные цвета, в дорожке они расположены рядом. Различение по цвету есть, но контраст предпочтений невелик.";
   else sentence+="Чувства обозначены разными цветами, расстояние между ними в дорожке – "+d+" позиции. Различение этой пары прослеживается.";
   return {domain,name,same,d,text:sentence};
  });
  const sameBlocks=blocks.filter(x=>x.same);
  const weak=blocks.filter(x=>x.same||x.d===1);
  const moreMainPositive=plus.filter(i=>main.has(f[i])).length;
  const darkNegative=minus.filter(i=>negative.has(f[i])).length;
  const nonstandard=plus.filter(i=>negative.has(f[i])).map(i=>EMOTIONS[i]);
  p.emotions="В задании социальных эмоций "+(sameBlocks.length?
   "одинаковый цвет встречается в "+sameBlocks.length+" из пяти пар противоположных чувств: "+chooseList(sameBlocks.map(x=>"«"+x.name+"»"))+". Такое совпадение показывает, какие смысловые противопоставления ребенок выделил недостаточно четко.":
   "все пять пар противоположных чувств обозначены разными цветами. Это показывает наличие цветового различения положительных и отрицательных переживаний по всем исследованным блокам.")+
   " Основные цвета использованы для "+moreMainPositive+" из пяти положительных чувств, а коричневый или черный – для "+darkNegative+" из пяти отрицательных. "+
   (nonstandard.length?"Коричневый или черный также связан с положительными чувствами: "+chooseList(nonstandard)+". Это делает распределение эмоций менее однозначным.":"Коричневый и черный не используются для пяти положительных чувств.")+
   (weak.length&&!sameBlocks.length?" Наиболее близко друг к другу в дорожке расположены цвета в парах "+chooseList(weak.map(x=>"«"+x.name+"»"))+".":"");
  p.emotionBlocks=blocks;
  const indexMatches=i=>{
   const id=sit[i];
   const positive=plus.filter(j=>f[j]===id).map(j=>EMOTIONS[j]);
   const adverse=minus.filter(j=>f[j]===id).map(j=>EMOTIONS[j]);
   const rank=positions[id];
   const parts=[];
   if(positive.length&&!adverse.length)parts.push("совпадает с положительными чувствами («"+chooseList(positive)+"»)");
   else if(adverse.length&&!positive.length)parts.push("совпадает с отрицательными чувствами («"+chooseList(adverse)+"»)");
   else if(positive.length&&adverse.length)parts.push("связан как с положительными («"+chooseList(positive)+"»), так и с отрицательными («"+chooseList(adverse)+"») чувствами");
   else parts.push("не повторяет цвета, выбранные для перечисленных чувств");
   if(negative.has(id))parts.push("использован коричневый или черный цвет");
   parts.push("в дорожке этот цвет занимает "+rank+" место");
   return {id,index:i,name:SITUATIONS[i],positive,adverse,rank,dark:negative.has(id),text:"Домик «"+SITUATIONS[i]+"» закрашен "+inColor(id)+": "+parts.join("; ")+". "};
  };
  const mapped=SITUATIONS.map((_,i)=>indexMatches(i));
  const schoolIndices=[1,2,3,4,5,6,8];
  const school=schoolIndices.map(i=>mapped[i]);
  const exclusivePositive=school.filter(x=>x.positive.length&&!x.adverse.length);
  const exclusiveAdverse=school.filter(x=>x.adverse.length&&!x.positive.length);
  const mixed=school.filter(x=>x.positive.length&&x.adverse.length);
  const darkSchool=school.filter(x=>x.dark);
  const schoolLead=exclusivePositive.length>=4&&exclusiveAdverse.length<=1&&darkSchool.length<=1?
   "В школьных ситуациях заметно преобладание связей с положительными чувствами.":
   (exclusiveAdverse.length>=3||darkSchool.length>=3)?
   "В школьных ситуациях отчетливо представлены связи с неприятными переживаниями и/или коричневым и черным цветами.":
   "Эмоциональная картина школьной жизни неоднородна: рядом встречаются нейтральные, приятные и потенциально напряженные цветовые связи.";
  const examples=[];
  if(exclusivePositive.length)examples.push("положительные совпадения отмечены для "+chooseList(exclusivePositive.map(x=>"«"+x.name+"»")));
  if(exclusiveAdverse.length)examples.push("с отрицательными чувствами связаны "+chooseList(exclusiveAdverse.map(x=>"«"+x.name+"»")));
  if(mixed.length)examples.push("смешанные связи обнаружены для "+chooseList(mixed.map(x=>"«"+x.name+"»")));
  if(darkSchool.length)examples.push("коричневый и черный использованы в "+chooseList(darkSchool.map(x=>"«"+x.name+"»")));
  p.school=schoolLead+" Среди семи школьных ситуаций "+exclusivePositive.length+" совпали только с положительными чувствами, "+exclusiveAdverse.length+" – только с отрицательными, "+mixed.length+" – с обеими группами. "+(examples.length?"В частности, "+examples.join("; ")+".":"Явных повторов цветов между школьными ситуациями и домиками чувств не обнаружено.");
  const specific=[0,5,6,7,8].map(i=>mapped[i]);
  p.relationships=specific.map(x=>x.text).join(" ");
  p.schoolBlocks=school.map(x=>x.text);
  p.free="Собственный сюжет десятого домика: «"+s.description.trim().replace(/[.!?]+$/,"")+"». Выбранный для него цвет – "+descFirst[sit[9]]+", этот цвет занимает в дорожке позицию № "+positions[sit[9]]+".";
  let synthesis;
  if(co.level==="red"&&(exclusiveAdverse.length+darkSchool.length>=3))
   synthesis="Повышенный показатель СО сочетается с заметными признаками эмоциональной напряженности в школьных ассоциациях. В первую очередь стоит уточнить переживания, обозначенные темными цветами или совпавшие с неприятными чувствами.";
  else if(co.level==="green"&&(exclusiveAdverse.length>=2||darkSchool.length>=2))
   synthesis="По суммарному отклонению преобладает положительный эмоциональный фон, однако часть школьных домиков связана с отрицательными чувствами либо окрашена коричневым или черным. Это расхождение показывает, что отдельные школьные ситуации воспринимаются менее благоприятно, чем общий эмоциональный фон.";
  else if(co.level==="red"&&exclusivePositive.length>=4&&darkSchool.length<=1)
   synthesis="При высоком СО некоторые школьные ситуации одновременно имеют выраженные связи с положительными чувствами. Общий отрицательный фон не означает одинакового отношения ко всем сторонам школьной жизни; здесь выделяются относительно благоприятные ситуации.";
  else if(co.level==="green"&&exclusivePositive.length>=3&&darkSchool.length===0)
   synthesis="Положительный общий эмоциональный фон согласуется с преобладанием приятных связей в школьных домиках. Наиболее благоприятно обозначены те ситуации, для которых выбран цвет положительных чувств.";
  else if(co.level==="yellow"&&mixed.length+exclusiveAdverse.length>0)
   synthesis="При обычном общем эмоциональном фоне есть отдельные ситуации, вызывающие разнонаправленные ассоциации. Наиболее информативны конкретные различия между домиками учителя, одноклассников и учебных занятий.";
  else
   synthesis="Общий показатель эмоционального фона и цвета отдельных школьных ситуаций дают "+(co.level==="green"?"в целом более благоприятную":co.level==="red"?"более напряженную":"смешанную")+" картину, которую следует уточнять по содержанию совпадений чувств и школьных домиков.";
  const priority=[...school].filter(x=>x.dark||x.adverse.length).sort((a,b)=>(+b.dark+ b.adverse.length)-(+a.dark+a.adverse.length)).slice(0,3);
  if(priority.length)synthesis+=" Для дальнейшего обсуждения особенно важны "+chooseList(priority.map(x=>"«"+x.name+"»"))+".";
  else synthesis+=" При уточнении полезно сопоставить отношение ребенка к себе, учителю, одноклассникам и учебным действиям.";
  p.synthesis=synthesis;
  p.paragraphs=[
    ["Цветовая дорожка",p.ranking],
    ["Энергетический и эмоциональный показатели",p.indices],
    ["Социальные эмоции",p.emotions],
    ["Отношение к школе",p.school],
    ["Личностные и отдельные школьные отношения",p.relationships],
    ["Десятый домик",p.free],
    ["Итоговый анализ",p.synthesis]
  ];
  return p;
 }
 function resultHtml(s){
  const c=calculate(s);
  if(!complete(s)||!validGroup()||!c)return '<h2>Результаты</h2><div class="report-empty">Для расчета заполните все 8 прямоугольников, 20 домиков и описание последнего домика. Для группы укажите класс.</div>';
  const result=window.PSY_OREKHOVA_WORK_REPORT.build(s,c,state.groupName);
  return '<h2>Результаты: '+esc(s.name)+'</h2>'+
   '<h3 class="work-results-heading">Краткие результаты</h3>'+
   '<div class="work-short">'+result.short.map(x=>
    '<article class="work-short-item"><span>'+esc(x.label)+'</span><strong class="number-'+x.tone+'">'+esc(x.value)+'</strong></article>').join("")+'</div>'+
   '<section class="work-interpretation"><h3>Анализ результатов</h3>'+
    result.sections.map(([heading,body])=>'<div class="work-paragraph"><h4>'+esc(heading)+'</h4><p>'+esc(body)+'</p></div>').join("")+
   '</section>'+
   '<section class="work-actions"><h3>На что обратить внимание психологу</h3><ol>'+result.actions.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol></section>'+
   '<details class="report-expanded"><summary>Полный протокол: 20 домиков, цвета и пять пар эмоций</summary><div class="report-expanded-inner">'+renderDetailReport(s)+'</div></details>'+
   '<div class="report-actions"><button type="button" class="primary" id="downloadOne">Скачать Word</button><button type="button" class="light-button" id="printOne">Распечатать результаты</button></div>';
 }
 function renderGroup(){
  if(state.mode!=="group"||!state.students.length)return;
  const rows=state.students.map(s=>({s,ready:complete(s)&&validGroup(),calc:calculate(s)}));
  const completed=rows.filter(r=>r.ready);
  const counts={co:{green:0,yellow:0,red:0,neutral:0},vk:{green:0,yellow:0,red:0,neutral:0}};
  completed.forEach(r=>{counts.co[classifyCO(r.calc.co).level]++;counts.vk[classifyVK(r.calc.vk).level]++;});
  $("groupReport").innerHTML='<h2>Сводные результаты · '+esc(state.groupName.trim()||"Группа не указана")+'</h2><p class="muted">Заполнено: '+completed.length+' из '+state.students.length+'. Проценты считаются только среди полностью заполненных протоколов.</p>'+
  '<table class="group-table"><thead><tr><th>Участник</th><th>ВК</th><th>СО</th><th>Состояние</th></tr></thead><tbody>'+
  rows.map(r=>{if(!r.ready)return '<tr><td>'+esc(r.s.name)+'</td><td>–</td><td>–</td><td>Данные не заполнены</td></tr>';const vk=classifyVK(r.calc.vk),co=classifyCO(r.calc.co);return '<tr><td>'+esc(r.s.name)+'</td><td><strong class="number-'+vk.level+'">'+r.calc.vk.toFixed(2).replace(".",",")+'</strong></td><td><strong class="number-'+co.level+'">'+r.calc.co+'</strong></td><td>'+esc(co.text)+'</td></tr>';}).join("")+'</tbody></table>'+
  (completed.length?'<h3>Распределение уровней СО</h3><div class="summary-pills">'+[["green","Положительный фон"],["yellow","Обычный фон"],["red","Отрицательный фон"],["neutral","Без категории"]].map(([lev,label])=>'<div>'+label+': <strong class="number-'+lev+'">'+counts.co[lev]+' ('+Math.round(100*counts.co[lev]/completed.length)+'%)</strong></div>').join("")+'</div>':'')+
  '<div class="report-actions"><button class="primary" type="button" id="downloadGroup"'+(!completed.length?' disabled':'')+'>Скачать сводный Word</button><button class="light-button" type="button" id="printGroup"'+(!completed.length?' disabled':'')+'>Распечатать сводку</button></div>';
 }
 function render(){
  const s=current();
  renderPeople();
  if(s){$("currentName").textContent=s.name+(s.age?" · "+s.age+" лет":state.groupName.trim()?" · "+state.groupName:"");renderRanking();renderColorRows();$("report").innerHTML=resultHtml(s);}
  renderGroup();
  if(s)renderWizard();
 }
 function addStudent(){
  const name=$("newName").value.trim().replace(/\s+/g," ");
  const age=$("newAge").value.trim()?Number($("newAge").value):null;
  if(!name){setError("Введите фамилию и имя ребенка.");$("newName").focus();return;}
  if(age!==null&&(!Number.isInteger(age)||age<3||age>18)){setError("Укажите возраст в полных годах.");$("newAge").focus();return;}
  if(age===null&&!state.groupName.trim()){setError("Укажите возраст или класс / группу.");$("newAge").focus();return;}
  if(state.mode==="group"&&!state.groupName.trim()){setError("Для группового режима укажите класс или группу.");$("groupName").focus();return;}
  state.students.push(emptyStudent(name,age));state.selected=state.students.length-1;state.step=1;
  $("newName").value="";$("newAge").value="";setError("");render();
 }
 function printDocument(kind){
  const s=current();
  let contents="";
  const guide=$("guide")?.querySelector(".panel")?.innerHTML||"";
  if(kind==="blank")contents='<section class="print-page">'+blank()+'</section>';
  else if(kind==="guide")contents='<section class="print-page"><h1>Методика «Домики» О. А. Ореховой</h1>'+guide+'</section>';
  else if(kind==="combined")contents='<section class="print-page"><h1>Методика «Домики» О. А. Ореховой</h1>'+guide+'</section><section class="print-page">'+blank()+'</section>';
  else if(kind==="one"&&s&&complete(s)&&validGroup())contents='<section class="print-page">'+$("report").innerHTML.replace(/<div class="report-actions">[\s\S]*?<\/div>/,"")+'</section>';
  else if(kind==="group")contents='<section class="print-page">'+$("groupReport").innerHTML.replace(/<div class="report-actions">[\s\S]*?<\/div>/,"")+'</section>';
  if(!contents)return;
  $("printRoot").innerHTML=contents;window.print();
 }
 const xml=s=>esc(s).replace(/&#39;/g,"&apos;").replace(/&quot;/g,"&quot;");
 const wp=(text,hex)=>'<w:p><w:r>'+(hex?'<w:rPr><w:color w:val="'+hex+'"/><w:b/></w:rPr>':'')+'<w:t xml:space="preserve">'+xml(text)+'</w:t></w:r></w:p>';
 const wcell=(text,hex)=>'<w:tc><w:tcPr><w:tcW w:w="2200" w:type="dxa"/></w:tcPr>'+wp(text,hex)+'</w:tc>';
 const wrow=(cells)=>'<w:tr>'+cells.map(c=>wcell(c.text,c.color)).join("")+'</w:tr>';
 function documentXml(body){return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850"/></w:sectPr></w:body></w:document>';}
 function colorHex(level){return ({green:"208549",yellow:"ad7617",red:"b03235",neutral:"34483d"})[level];}
 function docxBody(kind){
  if(kind==="group"){
   const rows=state.students.filter(s=>complete(s)&&validGroup());
   let b=wp("Метолария. Методика «Домики» О. А. Ореховой")+wp("Класс / группа: "+state.groupName)+wp("Заполнено: "+rows.length+" из "+state.students.length)+
   '<w:tbl><w:tblPr><w:tblBorders><w:bottom w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>'+wrow(["Участник","ВК","СО","Эмоциональный фон"].map(text=>({text})));
   for(const s of rows){const c=calculate(s);b+=wrow([{text:s.name},{text:c.vk.toFixed(2).replace(".",","),color:colorHex(classifyVK(c.vk).level)},{text:String(c.co),color:colorHex(classifyCO(c.co).level)},{text:classifyCO(c.co).text}]);}
   return b+'</w:tbl>'+wp("Проценты и выводы требуют профессиональной интерпретации. Незаполненные протоколы не учитываются.");
  }
  const s=current(),c=calculate(s);
  const result=window.PSY_OREKHOVA_WORK_REPORT.build(s,c,state.groupName);
  let b=wp("Метолария. Методика «Домики» О. А. Ореховой")+
    wp("Участник: "+s.name+(s.age?" · "+s.age+" лет":"")+(state.groupName?" · "+state.groupName:""))+
    wp("КРАТКИЕ РЕЗУЛЬТАТЫ");
  result.short.forEach(item=>b+=wp(item.label+": "+item.value,colorHex(item.tone)));
  b+=wp("АНАЛИЗ РЕЗУЛЬТАТОВ");
  result.sections.forEach(([head,body])=>{b+=wp(head)+wp(body);});
  b+=wp("НА ЧТО ОБРАТИТЬ ВНИМАНИЕ ПСИХОЛОГУ");
  result.actions.forEach((item,i)=>b+=wp((i+1)+". "+item));
  b+=wp("ПРОТОКОЛ: ЦВЕТОВАЯ ДОРОЖКА");
  s.ranking.forEach((id,i)=>b+=wp((i+1)+". "+colorName(id)));
  b+=wp("ПРОТОКОЛ: СОЦИАЛЬНЫЕ ЭМОЦИИ");
  EMOTIONS.forEach((name,i)=>b+=wp((i+1)+". "+name+": "+colorName(s.emotions[i])));
  b+=wp("ПРОТОКОЛ: ШКОЛЬНЫЕ И ЛИЧНЫЕ СИТУАЦИИ");
  SITUATIONS.forEach((name,i)=>b+=wp((i+1)+". "+name+": "+colorName(s.situations[i])));
  b+=wp("Слова ребенка о последнем домике: "+s.description);
  return b;
 }
 // Simple ZIP writer (stored files) for a real, offline-generated DOCX.
 function crc32(data){let crc=0xFFFFFFFF;for(const byte of data){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xEDB88320:0);}return (crc^0xFFFFFFFF)>>>0;}
 const u16=n=>[n&255,(n>>>8)&255],u32=n=>[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];
 function zip(files){
  const te=new TextEncoder(),locals=[],central=[];let offset=0;
  for(const [filename,contents] of files){
   const name=te.encode(filename),data=te.encode(contents),crc=crc32(data);
   const header=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(data.length),...u32(data.length),...u16(name.length),...u16(0),...name]);
   locals.push(header,data);
   central.push(new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(data.length),...u32(data.length),...u16(name.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...name]));
   offset+=header.length+data.length;
  }
  const centralSize=central.reduce((n,a)=>n+a.length,0);
  const end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(centralSize),...u32(offset),...u16(0)]);
  return new Blob([...locals,...central,end],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
 }
 function downloadWord(kind){
  if(kind==="one"&&(!current()||!complete(current())||!validGroup()))return;
  if(kind==="group"&&(!validGroup()||!state.students.some(complete)))return;
  const files=[
   ["[Content_Types].xml",'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
   ["_rels/.rels",'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
   ["word/document.xml",documentXml(docxBody(kind))]
  ];
  const blob=zip(files),url=URL.createObjectURL(blob);
  const link=document.createElement("a");link.href=url;link.download=(kind==="one"?current().name:"Домики_сводная_таблица").replace(/[\\/:*?"<>|]/g,"_")+"_Орехова.docx";
  document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }

 document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>{
  state.mode=b.dataset.mode;document.querySelectorAll("[data-mode]").forEach(x=>x.classList.toggle("active",x===b));setError("");render();
 }));
 $("groupName").addEventListener("input",e=>{state.groupName=e.target.value;status();renderGroup();if(current())renderWizard();});
 $("startColoring").addEventListener("click",()=>{
  $("newName").scrollIntoView({behavior:"smooth",block:"center"});
  $("newName").focus({preventScroll:true});
 });
 $("addStudent").addEventListener("click",addStudent);
 $("newName").addEventListener("keydown",e=>{if(e.key==="Enter")addStudent();});
 $("newAge").addEventListener("keydown",e=>{if(e.key==="Enter")addStudent();});
 $("people").addEventListener("click",e=>{const b=e.target.closest("[data-person]");if(!b)return;state.selected=Number(b.dataset.person);state.step=1;render();});
 $("rankPalette").addEventListener("click",e=>{const b=e.target.closest("[data-color]");if(!b||!current())return;state.activeColor=b.dataset.color;render();});
 $("ranking").addEventListener("click",e=>{
  const b=e.target.closest("[data-rect-index]"),s=current();if(!b||!s)return;
  const index=Number(b.dataset.rectIndex),chosen=state.activeColor;
  const prev=s.ranking.indexOf(chosen);
  if(prev!==-1&&prev!==index)s.ranking[prev]=null;
  s.ranking[index]=chosen;
  const next=COLORS.find(c=>!s.ranking.includes(c.id));if(next)state.activeColor=next.id;
  render();
 });
 for(const stage of ["emotions","situations"]){
  $(stage==="emotions"?"emotionRows":"situationRows").addEventListener("click",e=>{
   const b=e.target.closest("[data-paint-stage]"),s=current();if(!b||!s)return;
   const idx=Number(b.dataset.index);if(!Number.isInteger(idx)||idx<0||idx>=10)return;
   s[stage][idx]=state.activeColor;render();
  });
 }
 $("prevStep").addEventListener("click",()=>setStep(state.step-1));
 $("nextStep").addEventListener("click",()=>setStep(state.step+1));
 document.querySelectorAll("[data-workstep]").forEach(b=>b.addEventListener("click",()=>setStep(Number(b.dataset.workstep))));
 $("resetRanking").addEventListener("click",()=>{const s=current();if(s){s.ranking=Array(8).fill(null);render();}});

 $("tenDescription").addEventListener("input",e=>{const s=current();if(s){s.description=e.target.value;status();$("report").innerHTML=resultHtml(s);renderGroup();renderWizard();}});
 $("copyAnswers").addEventListener("click",()=>{const s=current();if(!s)return;state.clipboard={ranking:[...s.ranking],emotions:[...s.emotions],situations:[...s.situations],description:s.description};$("copyAnswers").textContent="Ответы скопированы";});
 $("pasteAnswers").addEventListener("click",()=>{const s=current(),c=state.clipboard;if(!s||!c)return;s.ranking=[...c.ranking];s.emotions=[...c.emotions];s.situations=[...c.situations];s.description=c.description;render();});
 $("removeStudent").addEventListener("click",()=>{const s=current();if(!s||!window.confirm("Удалить участника «"+s.name+"» и его ответы?"))return;state.students.splice(state.selected,1);state.selected=Math.max(0,Math.min(state.selected,state.students.length-1));state.step=1;render();});
 $("report").addEventListener("click",e=>{if(e.target.closest("#downloadOne"))downloadWord("one");if(e.target.closest("#printOne"))printDocument("one");});
 $("groupReport").addEventListener("click",e=>{if(e.target.closest("#downloadGroup"))downloadWord("group");if(e.target.closest("#printGroup"))printDocument("group");});
 const themeKey="metolaria-color-scheme";
 try{if(localStorage.getItem(themeKey)==="dark")document.documentElement.classList.add("dark");}catch(_){}
 function themeText(){$("toggleTheme").textContent=document.documentElement.classList.contains("dark")?"Светлая тема":"Темная тема";}
 $("toggleTheme").addEventListener("click",()=>{document.documentElement.classList.toggle("dark");try{localStorage.setItem(themeKey,document.documentElement.classList.contains("dark")?"dark":"light");}catch(_){}themeText();});
 themeText();renderInitialPreview();render();
 // Exact scoring fixtures: reference sequence CO=0, reverse sequence CO=32.
 const reference=emptyStudent("Проверка",7);reference.ranking=[...NORM];const reverse=emptyStudent("Проверка",7);reverse.ranking=[...NORM].reverse();
 if(calculate(reference).co!==0||calculate(reverse).co!==32)throw new Error("Неверный расчет СО");
 window.PSY_OREKHOVA_TEST={calculate,classificationVK:classifyVK,classificationCO:classifyCO,norm:NORM.slice()};
})();
