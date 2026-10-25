"use strict";
(function(){
 const $=id=>document.getElementById(id);
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const MATRIX=[
 'ККИРНИОНАСВСИКНКОКОНАОСАЕХОСЕКМАКИОС',
 'КНМНАОАМККТЕМРТМРОМОТИНРМККМНАКМЕКИИ',
 'ВАНООМЕТОАМРЕАИТТВТЕНКМКАХСХСРСВОЕТН',
 'ЕИХКСРРХАМИВРХОИКАИОЕТНХЕНХВРТИНЕНХМ',
 'АТОТАСХАВТРАКСНОАКОИОВХКВКНВВНМЕЕКОН',
 'ИМОМВЕВИМКВЕВСНААОТЕРТИМТИРРАНРИАКМС',
 'РМКРОКМТАТАКТСИВХСХХНОАИОНИКХНЕНРНОР',
 'ТООВХЕОВНОТКНХХМКААЕХРСТМЕМРСКНСМКХВ',
 'МСССВОТРНВАОАСОНХИРВКИКВКАООВЕСХКРСВ',
 'ВММТОННТВВСРХХЕИТАЕСХХРСВХРМОМИККИСК',
 'ОТВХИИИКВЕТАРККМЕИЕХРМСНМКТКИХСИККИК',
 'МААВРСТСАНОНААИСКОКОАМТКХРТЕАРВМММХВ',
 'ИЕИТКВИЕОРОРАНОКНОЕОЕКИВИВМХКХМАМАКО',
 'РРТКЕОИАОЕЕИММХНИЕТНВИАТАТНРСХРОКМВИ',
 'ЕАИАЕХЕЕНЕСТКТХТВОХЕХИКЕНСТНМРРМХВРВ',
 'ИКТНООРМОХНОСВЕХСАХВСВОВНХЕЕВМСАРИХЕ',
 'АЕАСКВКОКЕНСМАВКХИАНСТРАМХИТХНКИТЕСМ',
 'МТРМТЕНКЕАСНОИМХКООНММСНТКВТОТСМТННА',
 'МККСВХВОВАНРНОХЕСМННМИМХМСТЕМИХИРМВХ',
 'ВНСЕТАИТТРОЕТИККТТТНКИВСИИТКСРЕВМЕХМ',
 'ХРИННТИИИМАТЕИИТСОИМЕАЕЕАХРИКМХКНРИС',
 'ОТСММВИАОВВРОМЕИТХСРМВТОКВВСХНАМСРМС',
 'ЕРВНЕАТВРХАМККЕТАТКННИАААСЕКИАНССММС',
 'СЕХВАТРОХАЕМКАОКРТАЕРЕМСВРОККККВТРКР',
 'АВИНСЕММВЕРСКТКОТОККЕРАВСМКТМАЕТОХИМ',
 'РООИРИННКХКВКИЕКТМВЕМОАРКХТИЕСОТАОВХ',
 'КННРРСИТОРАСТМВВОКАСЕХКССНИМРАЕСНЕХИ',
 'ХСКЕСТХЕМВВОХНЕВККВАКВХИХЕОХСНЕВРИАВ'
 ];
 const line=MATRIX.join('');
 if(MATRIX.length!==28||MATRIX.some(x=>x.length!==36)||line.length!==1008||[...line].filter(x=>x==='К'||x==='Р').length!==179)throw Error("Некорректная версия матрицы Бурдона");
 const isTarget=c=>c==='К'||c==='Р';
 const configs={project:'С кем ты хотел(а) бы работать над общим учебным проектом?',desk:'С кем ты хотел(а) бы сидеть за одним столом при совместной работе?'};
 const codePattern=/^[\p{L}\p{N}_-]{1,16}$/u;
 let active='sociometry',codes=[],selections={project:{},desk:{}},socioResult=null,bourdonResult=null;
 function message(id,txt){$(id).textContent=txt}
 function switchTab(name){
  active=name==='bourdon'?'bourdon':'sociometry';
  $('kitSociometry').hidden=active!=='sociometry';$('kitBourdon').hidden=active!=='bourdon';
  document.querySelectorAll('[data-kit-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.kitTab===active)));
  try{const u=new URL(location.href);u.searchParams.set('method',active);history.replaceState(null,'',u)}catch(_){}
 }
 document.querySelectorAll('[data-kit-tab]').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.kitTab)));
 // --- СОЦИОМЕТРИЯ ---
 function parseChoices(raw){return raw.trim()?raw.trim().split(/[,;\s]+/).filter(Boolean):[]}
 function getRowValues(){
  if(!codes.length)return;
  const criterion=$('socioCriterion').value;
  document.querySelectorAll('#socioEntry tr[data-code]').forEach(tr=>{
   const key=tr.dataset.code;
   selections[criterion][key]={received:tr.querySelector('input[type=checkbox]').checked,choices:tr.querySelector('input[type=text]').value.trim()};
  });
 }
 function drawRows(){
  const criterion=$('socioCriterion').value;
  if(!codes.length){$('socioEntry').innerHTML='';$('socioSummary').innerHTML='';return}
  const rows=codes.map(code=>{
   const a=selections[criterion][code]||{received:false,choices:''};
   return '<tr data-code="'+esc(code)+'"><td><strong>'+esc(code)+'</strong></td><td><input type="checkbox" aria-label="Анкета получена: '+esc(code)+'" '+(a.received?'checked':'')+'></td><td><input type="text" aria-label="Выбранные коды: '+esc(code)+'" value="'+esc(a.choices)+'" placeholder="У02, У04"></td></tr>'
  }).join('');
  $('socioEntry').innerHTML='<div class="kit-scroller"><table class="kit-table"><thead><tr><th>Код</th><th>Анкета получена</th><th>Выборы (до 3)</th></tr></thead><tbody>'+rows+'</tbody></table></div><div class="kit-hint">Отдельно от анкеты фиксируются отсутствие участника и отказ от ответа. Пустой список выборов при полученной анкете допустим.</div><button type="button" class="kit-btn" id="socioCalculate">Подсчитать класс</button>';
  $('socioEntry').querySelectorAll('input').forEach(inp=>inp.addEventListener('change',getRowValues));
  $('socioEntry').querySelectorAll('input[type=text]').forEach(inp=>inp.addEventListener('input',getRowValues));
  $('socioCalculate').onclick=calculateSociometry;
  $('socioSummary').innerHTML='';
 }
 $('socioCreate').onclick=()=>{
  getRowValues();
  const incoming=$('socioRoster').value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  if(incoming.length<3||incoming.length>45){message('socioValidation','Введите от 3 до 45 кодов, каждый с новой строки.');return}
  if(incoming.some(x=>!codePattern.test(x))){message('socioValidation','Коды могут содержать только буквы, цифры, дефис и нижнее подчеркивание; не более 16 символов. Без ФИО.');return}
  if(new Set(incoming.map(x=>x.toLocaleLowerCase('ru'))).size!==incoming.length){message('socioValidation','Коды участников должны быть уникальны.');return}
  codes=incoming;
  for(const criterion of Object.keys(selections)){
   const old=selections[criterion];
   selections[criterion]=Object.fromEntries(codes.map(x=>[x,old[x]||{received:false,choices:''}]));
  }
  message('socioValidation','Создан протокол на '+codes.length+' кодов. Заполните сведения из полученных анкет.');
  drawRows();
 };
 $('socioCriterion').onchange=()=>{message('socioValidation','');drawRows()};
 function calculateSociometry(){
  getRowValues();
  if(!codes.length)return;
  const criterion=$('socioCriterion').value,answers=selections[criterion],lookup=new Map(codes.map(x=>[x.toLocaleLowerCase('ru'),x]));
  const map={},received=[],outgoing={},incoming=Object.fromEntries(codes.map(x=>[x,0]));
  for(const code of codes){
   const a=answers[code]||{received:false,choices:''};
   if(!a.received){if(a.choices.trim()){message('socioValidation','У '+code+' введены выборы, но анкета не отмечена как полученная.');return}outgoing[code]=[];continue}
   received.push(code);
   const raw=parseChoices(a.choices);
   if(raw.length>3){message('socioValidation','Код '+code+': разрешено не более трех выборов.');return}
   const norm=raw.map(x=>lookup.get(x.toLocaleLowerCase('ru')));
   if(norm.some(x=>!x)){message('socioValidation','Код '+code+': один или несколько выбранных кодов отсутствуют в списке.');return}
   if(norm.includes(code)||new Set(norm).size!==norm.length){message('socioValidation','Код '+code+': нельзя выбрать себя или повторить один код.');return}
   outgoing[code]=norm;
   norm.forEach(to=>incoming[to]++);
  }
  const pairs=[];let edges=0;
  for(const code of received)for(const to of outgoing[code]){edges++;if(code<to&&outgoing[to]?.includes(code))pairs.push([code,to])}
  const coverage=(received.length/codes.length*100);
  const mutual=edges?Math.round((2*pairs.length/edges)*1000)/10:null;
  message('socioValidation','');
  socioResult={codes:[...codes],criterion,received:[...received],incoming,outgoing,pairs,edges,coverage,mutual};
  const stats=[
   ['Всего в списке',codes.length],
   ['Анкет получено',received.length+' ('+coverage.toFixed(1)+'%)'],
   ['Направленных выборов',edges],
   ['Взаимных пар',pairs.length],
   ['Доля взаимных связей',mutual===null?'–':mutual+'%']
  ].map(([t,v])=>'<div><b>'+esc(v)+'</b><span>'+esc(t)+'</span></div>').join('');
  const rows=codes.map(code=>'<tr><td>'+esc(code)+'</td><td>'+((answers[code]||{}).received?'Да':'Нет')+'</td><td>'+incoming[code]+'</td><td>'+outgoing[code].length+'</td></tr>').join('');
  $('socioSummary').innerHTML='<section class="kit-results"><h4>Обезличенная сводка</h4><p>Критерий: '+esc(configs[criterion])+'</p><div class="kit-stats">'+stats+'</div><div class="kit-scroller"><table class="kit-table"><thead><tr><th>Код</th><th>Анкета</th><th>Получено</th><th>Сделано</th></tr></thead><tbody>'+rows+'</tbody></table></div><p>Полученные показатели описательные. Нет универсальных возрастных порогов или статусов детей. Неполный охват учитывайте отдельно.</p><button type="button" class="kit-btn kit-btn-outline" id="socioCsv">Скачать сводку CSV</button></section>';
  $('socioCsv').onclick=()=>{
   const lines=[['Критерий',configs[criterion]],['Всего',codes.length],['Анкет',received.length],['Покрытие',coverage.toFixed(1)+'%'],['Взаимных пар',pairs.length],['Доля взаимных связей',mutual===null?'':mutual+'%'],[],['Код','Анкета','Получено','Сделано'],...codes.map(code=>[code,answers[code].received?'Да':'Нет',incoming[code],outgoing[code].length])];
   const csv='\ufeff'+lines.map(row=>row.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');
   download(new Blob([csv],{type:'text/csv;charset=utf-8'}),'psyteka_sociometry_anonymous.csv');
  };
 };
 // --- БУРДОН ---
 $('bourdonMatrix').innerHTML=MATRIX.map(x=>'<div>'+esc([...x].join(' '))+'</div>').join('');
 $('bourdonTable').querySelector('tbody').innerHTML=Array.from({length:5},(_,i)=>'<tr><td><b>'+(i+1)+'</b></td><td><input type="number" min="0" max="1008" step="1" aria-label="Позиция после минуты '+(i+1)+'" placeholder="0…1008"></td><td><input type="number" min="0" step="1" aria-label="Пропуски за минуту '+(i+1)+'" placeholder="0"></td><td><input type="number" min="0" step="1" aria-label="Лишние отметки за минуту '+(i+1)+'" placeholder="0"></td></tr>').join('');
 function calculateBourdon(){
  const rows=[...$('bourdonTable').querySelectorAll('tbody tr')].map(tr=>[...tr.querySelectorAll('input')].map(input=>input.value.trim()));
  if(rows.some(a=>a.some(x=>x===''))){message('bourdonValidation','Заполните все позиции и ошибки по пяти минутам. Нулевые ошибки вводите числом 0.');return}
  const parsed=rows.map(row=>row.map(Number));
  if(parsed.some(a=>a.some(x=>!Number.isInteger(x)||x<0))){message('bourdonValidation','Все значения должны быть целыми неотрицательными числами.');return}
  let prev=0,correct=0,targetSum=0,miss=0,falseMarks=0,viewed=0;
  const stats=[];
  for(let i=0;i<5;i++){
   const [end,m,f]=parsed[i];
   if(end>1008||end<prev){message('bourdonValidation','Минута '+(i+1)+': позиции должны возрастать и не превышать 1008.');return}
   const size=end-prev,part=line.slice(prev,end),targets=[...part].filter(isTarget).length,other=size-targets;
   if(m>targets||f>other){message('bourdonValidation','Минута '+(i+1)+': число пропусков или лишних отметок больше допустимого на этом участке.');return}
   stats.push({minute:i+1,end,size,targets,miss:m,falseMarks:f,correct:targets-m});
   viewed+=size;targetSum+=targets;correct+=targets-m;miss+=m;falseMarks+=f;prev=end;
  }
  const den=correct+miss+falseMarks,accuracy=den?correct/den:null;
  const effective=accuracy===null?null:viewed*accuracy;
  const format=v=>v===null?'не определено':v.toFixed(3).replace('.',',');
  bourdonResult={stats,viewed,targetSum,correct,miss,falseMarks,accuracy,effective};
  message('bourdonValidation','Проверка диапазонов пройдена. Расчет относится только к данной матрице.');
  const rs=stats.map(r=>'<tr><td>'+r.minute+'</td><td>'+r.size+'</td><td>'+r.targets+'</td><td>'+r.correct+'</td><td>'+r.miss+'</td><td>'+r.falseMarks+'</td></tr>').join('');
  $('bourdonResults').innerHTML='<section class="kit-results"><h4>Описательная сводка</h4><div class="kit-stats">'+[
   ['Просмотрено',viewed+' из 1008'],
   ['Целевых в просмотренном',targetSum],
   ['Правильно отмечено',correct],
   ['Пропущено',miss],
   ['Лишних отметок',falseMarks],
   ['Точность A',format(accuracy)],
   ['Продуктивность E',format(effective)]
  ].map(([t,v])=>'<div><b>'+esc(v)+'</b><span>'+esc(t)+'</span></div>').join('')+'</div><div class="kit-scroller"><table class="kit-table"><thead><tr><th>Минута</th><th>Просмотрено</th><th>Целевых</th><th>Правильных</th><th>Пропусков</th><th>Лишних</th></tr></thead><tbody>'+rs+'</tbody></table></div><p>A = правильно отмечено / (правильно + пропуски + лишние отметки). E = просмотрено × A. Это рабочие показатели архива, а не стандартизированные нормы. Для другого стимульного материала не использовать.</p></section>';
 }
 $('bourdonCalculate').onclick=calculateBourdon;
 // --- ПЕЧАТЬ ---
 function socBlankHTML(){
  return '<h1>Социометрия · рабочий лист участника</h1><p class="kit-print-note">Не вписывайте фамилии в электронную форму. Бумажные ответы хранятся у специалиста.</p><p>Код участника ________________ Класс _________ Дата ___________</p><p>Отметь до трех разных одноклассников по каждому вопросу. Можно выбрать меньше трех. Себя выбирать нельзя. Ответы увидит только специалист.</p>'+Object.values(configs).map((q,i)=>'<div class="kit-print-section"><b>'+(i+1)+'. '+esc(q)+'</b><div class="kit-blank-line"></div><div class="kit-blank-line"></div><div class="kit-blank-line"></div></div>').join('');
 }
 function bourBlankHTML(){
  return '<h1>Корректурная проба · рабочая матрица</h1><p class="kit-print-note">Бурдон – Анфимов · вариант «Психотеки» · 28 × 36, поиск К и Р · 5 минут</p><p>Код участника _____________________ Дата __________________</p><p>Просматривай буквы слева направо, по строкам. Зачеркивай К и Р. По команде «Черта» отмечай место просмотра.</p><div class="kit-paper-matrix">'+MATRIX.map(x=>esc([...x].join(' '))).join('\n')+'</div><p>Отметки по минутам: 1 ______ 2 ______ 3 ______ 4 ______ 5 ______</p>';
 }
 document.querySelectorAll('[data-kit-print]').forEach(b=>b.onclick=()=>{
  const region=$('kitPrintRegion');
  region.innerHTML=b.dataset.kitPrint==='bourdon'?bourBlankHTML():socBlankHTML();
  region.hidden=false;region.setAttribute('aria-hidden','false');
  const reset=()=>{region.hidden=true;region.setAttribute('aria-hidden','true');window.removeEventListener('afterprint',reset)};
  window.addEventListener('afterprint',reset);
  window.print();
 });
 // --- НАСТОЯЩИЙ DOCX: небольшой OOXML ZIP без внешних библиотек и серверов ---
 function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
 const xesc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 function xmlP(line,type){
  const props=type==='title'?'<w:rPr><w:b/><w:sz w:val="34"/></w:rPr>':type==='matrix'?'<w:rPr><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/><w:sz w:val="16"/></w:rPr>':'<w:rPr><w:sz w:val="20"/></w:rPr>';
  return '<w:p><w:pPr><w:spacing w:after="75" w:line="235" w:lineRule="auto"/></w:pPr><w:r>'+props+'<w:t xml:space="preserve">'+xesc(line)+'</w:t></w:r></w:p>';
 }
 function zipStored(files){
  const te=new TextEncoder(),pieces=[],central=[];let offset=0,centralSize=0;
  function u16(view,pos,n){view.setUint16(pos,n,true)}
  function u32(view,pos,n){view.setUint32(pos,n>>>0,true)}
  function crc32(bytes){let crc=0xFFFFFFFF;for(const b of bytes){crc^=b;for(let j=0;j<8;j++)crc=(crc>>>1)^((crc&1)?0xEDB88320:0)}return(crc^0xFFFFFFFF)>>>0}
  for(const file of files){
   const name=te.encode(file.name),content=te.encode(file.data),crc=crc32(content);
   const l=new Uint8Array(30+name.length),v=new DataView(l.buffer);
   u32(v,0,0x04034b50);u16(v,4,20);u16(v,6,0x800);u16(v,8,0);u16(v,10,0);u16(v,12,0);u32(v,14,crc);u32(v,18,content.length);u32(v,22,content.length);u16(v,26,name.length);u16(v,28,0);l.set(name,30);
   pieces.push(l,content);
   const c=new Uint8Array(46+name.length),w=new DataView(c.buffer);
   u32(w,0,0x02014b50);u16(w,4,20);u16(w,6,20);u16(w,8,0x800);u16(w,10,0);u16(w,12,0);u16(w,14,0);u32(w,16,crc);u32(w,20,content.length);u32(w,24,content.length);u16(w,28,name.length);u16(w,30,0);u16(w,32,0);u16(w,34,0);u16(w,36,0);u32(w,38,0);u32(w,42,offset);c.set(name,46);
   central.push(c);centralSize+=c.length;offset+=l.length+content.length;
  }
  const end=new Uint8Array(22),view=new DataView(end.buffer);
  u32(view,0,0x06054b50);u16(view,4,0);u16(view,6,0);u16(view,8,files.length);u16(view,10,files.length);u32(view,12,centralSize);u32(view,16,offset);u16(view,20,0);
  return new Blob([...pieces,...central,end],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
 }
 function asDocx(lines){
  const contentType='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
  const rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
  const documentXML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+lines.map(([text,type])=>xmlP(text,type)).join('')+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850" w:header="360" w:footer="360" w:gutter="0"/></w:sectPr></w:body></w:document>';
  return zipStored([{name:'[Content_Types].xml',data:contentType},{name:'_rels/.rels',data:rels},{name:'word/document.xml',data:documentXML}]);
 }
 document.querySelectorAll('[data-kit-docx]').forEach(b=>b.onclick=()=>{
  const sociometry=b.dataset.kitDocx==='sociometry';
  const lines=sociometry?[
   ['Социометрия – лист участника','title'],
   ['Рабочая процедура по принципу Дж. Л. Морено. Материал не является стандартизированной анкетой.','body'],
   ['Код участника ____________________  Класс ________  Дата __________','body'],
   ['Отметь до трех разных одноклассников на каждый вопрос. Можно указать меньше трех. Себя выбирать нельзя. Ответы увидит только специалист.','body'],
   ...Object.values(configs).flatMap((q,i)=>[['','body'],[(i+1)+'. '+q,'body'],['1. _________________________________________________________','body'],['2. _________________________________________________________','body'],['3. _________________________________________________________','body']]),
   ['','body'],['Бумажные ответы хранить конфиденциально. Не сообщать детям индивидуальные ранги.','body']
  ]:[
   ['Корректурная проба Бурдона – Анфимова','title'],
   ['Рабочая матрица Психотеки (28 × 36 знаков, 1008 символов). Без переноса возрастных норм.','body'],
   ['Код участника ____________________________ Дата ______________','body'],
   ['Построчно слева направо зачеркивай все К и Р. По команде «Черта» отмечай место просмотра. Продолжительность – 5 минут.','body'],
   ...MATRIX.map(s=>[[...s].join(' '),'matrix']),
   ['Отметки по минутам: 1 ____ 2 ____ 3 ____ 4 ____ 5 ____','body']
  ];
  download(asDocx(lines),sociometry?'psyteka_sociometry_blank.docx':'psyteka_bourdon_matrix.docx');
 });
 const query=new URLSearchParams(location.search).get('method');
 switchTab(query==='bourdon'?'bourdon':'sociometry');
})();
