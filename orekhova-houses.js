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
 const PAIRS=[["Счастье – горе",0,1],["Справедливость – обида",2,3],["Дружба – ссора",4,5],["Доброта – злоба",6,7],["Скука – восхищение",8,9]];
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
 const complete=s=>!!s&&s.name.trim().length>0&&Number.isInteger(s.age)&&s.age>=5&&s.age<=12&&s.ranking.length===8&&s.ranking.every(Boolean)&&new Set(s.ranking).size===8&&s.emotions.every(Boolean)&&s.situations.every(Boolean)&&s.description.trim().length>0;
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
 function renderPeople(){
  $("people").innerHTML=state.students.map((s,i)=>'<button class="person'+(i===state.selected?' selected':'')+(complete(s)&&validGroup()?' done':'')+'" data-person="'+i+'" type="button" aria-pressed="'+(i===state.selected)+'"><span class="mark"></span>'+esc(s.name)+' · '+s.age+' лет</button>').join("");
  $("workArea").hidden=!current();
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
  // Roof with chimney, rectangular walls and a doorway, matching the provided answer form.
  const c=color(chosen),fill=c?c.hex:"#ffffff";
  const stroke="#34463d",doorStroke=c&&["black","brown","purple","blue","red","green"].includes(chosen)?"#ffffff":"#34463d";
  return '<svg class="house-shape" viewBox="0 0 124 122" role="img" aria-label="Закрашиваемый домик '+number+'">'+
   '<path d="M7 52L47 17L70 34V18H82V44L111 52H7Z" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2.8" stroke-linejoin="round"/>'+
   '<path d="M19 52H99V113H19Z" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2.8"/>'+
   '<path d="M46 80H71V113H46Z" fill="none" stroke="'+doorStroke+'" stroke-width="2.6"/>'+
   '<circle cx="66" cy="98" r="2.2" fill="'+doorStroke+'"/></svg>';
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
   $(target).innerHTML=labels.map((label,i)=>'<div class="paint-house-wrap"><button type="button" class="paint-house'+(arr[i]?' filled':'')+'" data-paint-stage="'+stage+'" data-index="'+i+'" aria-label="Домик '+(i+1)+': '+esc(label)+', '+colorName(arr[i])+'" title="'+esc(label)+'">'+houseSvg(i+1,arr[i])+'<span class="house-index">Домик '+(i+1)+'</span></button><span class="house-caption">'+esc(label)+'</span><span class="house-chosen">'+(arr[i]?esc(colorName(arr[i])):'Не закрашен')+'</span></div>').join("");
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
 function resultHtml(s){
  const c=calculate(s);
  if(!complete(s)||!validGroup()||!c)return '<h2>Результаты</h2><div class="report-empty">Заполните восемь цветов дорожки, все 10 чувств, 10 ситуаций и описание десятого домика. Для группового режима укажите класс или группу.</div>';
  const v=classifyVK(c.vk),co=classifyCO(c.co);
  const notes=observations(s);
  return '<h2>Результаты: '+esc(s.name)+'</h2><div class="report-grid">'+
   '<div class="metric"><div class="metric-title">Вегетативный коэффициент (ВК)</div><strong class="metric-number number-'+v.level+'">'+c.vk.toFixed(2).replace(".",",")+'</strong><p>'+esc(v.text)+'</p></div>'+
   '<div class="metric"><div class="metric-title">Суммарное отклонение (СО)</div><strong class="metric-number number-'+co.level+'">'+c.co+'</strong><p>'+esc(co.text)+'</p></div></div>'+
   '<h3>Качественные наблюдения</h3>'+(notes.length?'<ul class="notes">'+notes.map(n=>'<li>'+esc(n)+'</li>').join("")+'</ul>':'<p class="muted">Выраженных совпадений в парах чувств и коричневого/черного в ситуациях не обнаружено. Оцените полный рисунок и беседу.</p>')+
   '<p class="muted">Интерпретация описывает особенности цветового выбора и не заменяет психологическое заключение.</p>'+
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
  if(s){$("currentName").textContent=s.name+" · "+s.age+" лет";renderRanking();renderColorRows();$("report").innerHTML=resultHtml(s);}
  renderGroup();
  if(s)renderWizard();
 }
 function addStudent(){
  const name=$("newName").value.trim().replace(/\s+/g," ");
  const age=Number($("newAge").value);
  if(!name){setError("Введите фамилию и имя ребенка.");$("newName").focus();return;}
  if(!$("newAge").value||!Number.isInteger(age)||age<5||age>12){setError("Укажите возраст от 5 до 12 лет.");$("newAge").focus();return;}
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
  const s=current(),c=calculate(s),v=classifyVK(c.vk),co=classifyCO(c.co);
  let b=wp("Метолария. Методика «Домики» О. А. Ореховой")+wp("Участник: "+s.name+" · "+s.age+" лет")+
  wp("ВК: "+c.vk.toFixed(2).replace(".",",")+" – "+v.text,colorHex(v.level))+wp("СО: "+c.co+" – "+co.text,colorHex(co.level))+
  wp("Задание 1. Дорожка: "+s.ranking.map(colorName).join(", "))+wp("Задание 2. Домики чувств");
  EMOTIONS.forEach((x,i)=>b+=wp((i+1)+". "+x+": "+colorName(s.emotions[i])));
  b+=wp("Задание 3. Домики ситуаций");
  SITUATIONS.forEach((x,i)=>b+=wp((i+1)+". "+x+": "+colorName(s.situations[i])));
  b+=wp("Домик 10: "+s.description)+wp("Качественные наблюдения");
  const notes=observations(s);notes.forEach(n=>b+=wp("• "+n));
  return b+wp("Методика проективная. Оценка требует беседы и других данных. Цвет сам по себе не является диагнозом.");
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
 themeText();render();
 // Exact scoring fixtures: reference sequence CO=0, reverse sequence CO=32.
 const reference=emptyStudent("Проверка",7);reference.ranking=[...NORM];const reverse=emptyStudent("Проверка",7);reverse.ranking=[...NORM].reverse();
 if(calculate(reference).co!==0||calculate(reverse).co!==32)throw new Error("Неверный расчет СО");
 window.PSY_OREKHOVA_TEST={calculate,classificationVK:classifyVK,classificationCO:classifyCO,norm:NORM.slice()};
})();
