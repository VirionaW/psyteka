"use strict";
(function(){
const NAME="Социометрическое исследование класса";
const SOURCE="https://pmc.ncbi.nlm.nih.gov/articles/PMC2812902/";
const SOURCE2="https://pmc.ncbi.nlm.nih.gov/articles/PMC5651999/";
const GUIDE="downloads/sociometry_method_guide.docx";
const BLANK="downloads/sociometry_student_sheet.html";
const d={
 author:"Дж. Л. Морено - основоположник социометрии; рабочий вариант Психотеки",
 age:"Школьники (ориентировочно с 8 лет); критерий и инструкция адаптируются к возрасту",
 kind:"Социометрическое исследование с положительными номинациями",
 count:"1 вопрос, до 3 выборов; обследование группы",
 goal:"Изучить предпочтения школьников при выборе партнеров для совместного учебного задания, увидеть полученные и взаимные выборы для планирования безопасной групповой работы.",
 instructions:"Представь, что скоро будет небольшое совместное учебное задание. С кем из учеников своего класса ты хотел бы работать в одной команде? Можешь выбрать до трех одноклассников, а можешь не выбирать никого. Запиши только свой ответ, не советуйся с другими.",
 questions:["Кого ты выбрал бы для совместной работы в команде?"],
 options:["Первый выбор","Второй выбор","Третий выбор"],
 scoring:"Для каждого участника подсчитывается число полученных положительных выборов (входящие связи), число сделанных выборов и число взаимных выборов. Матрица направленных связей строится только по явно отмеченным полученным бланкам. Самовыбор и повтор одного адресата не допускаются. Не полученные бланки не считаются нулевыми ответами.",
 interpret:"Эти данные относятся к одной задаче и одной ситуации в данном классе; они не являются рейтингом ценности детей. Отсутствие полученных выборов не доказывает изоляцию или неблагополучие. Классификация на «звезд», «изгоев» и «отвергаемых» по одному позитивному вопросу не производится.",
 warning:"Рабочая позитивная версия социометрии, а не стандартизированная шкала статуса. Сведения о конкретных детях конфиденциальны: используйте коды, собирайте согласие и не демонстрируйте результаты классу.",
 source:SOURCE,sourceScoring:SOURCE2,guideFile:GUIDE,answerFile:BLANK,
 workflow:"sociometry",calculator:true,scaleLabels:["Полученные выборы","Взаимные выборы","Матрица взаимоотношений"]
};
(window.PSY_FULL_METHODS||(window.PSY_FULL_METHODS={}))[NAME]=d;
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeCode=(r,i)=>String(r&&r.name||"У-"+String(i+1).padStart(2,"0")).trim().slice(0,36);
function links(){
 return '<div class="psy-soc-links"><a class="btn primary" href="'+GUIDE+'" download>Методика и руководство · Word</a><a class="btn" href="'+BLANK+'" target="_blank" rel="noopener">Бланк ученика · печать А4</a><a class="btn" href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">Исследование методологии ↗</a></div>';
}
function instruction(){
 return '<h3>Подготовка и проведение</h3><ol><li>Определите группу и конкретный критерий: совместная учебная работа, а не общая симпатия.</li><li>Обеспечьте добровольность участия, необходимое согласие и приватность ответов. Не спрашивайте отрицательные выборы в этом варианте.</li><li>Выдайте каждому отдельный бланк. Участник может указать от нуля до трех одноклассников; себя выбирать нельзя.</li><li>Перенесите состав класса как коды. По каждому полученному бланку откройте код ответившего, отметьте «Бланк получен» и выберите адресатов.</li><li>Проверьте совпадения кодов и пропуски. Сформируйте матрицу, сводную таблицу и отчет. Не публикуйте индивидуальные итоги в классе.</li></ol>'+
 '<div class="notice psy-soc-warning">'+esc(d.warning)+'</div><h3>Инструкция для школьника</h3><blockquote class="kid-instruction">'+esc(d.instructions)+'</blockquote>'+links()+
 '<h3>На что обращать внимание</h3><p>Критерий номинации должен оставаться одинаковым для всего класса. Отсутствие ответа и выбор «никого» - разные ситуации. Нельзя автоматически переносить результаты одного задания на дружбу, травлю или клиническую оценку.</p>';
}
function materials(){
 return '<h3>Бланк выбора партнера для учебной работы</h3><div class="notice">Имена одноклассников вписываются на бумаге. При вводе в Психотеку психолог заменяет их кодами. Готовый лист рассчитан на А4.</div>'+
 '<div class="psy-soc-paper"><p>Код участника: ____________________ &nbsp;&nbsp; Класс: __________ &nbsp;&nbsp; Дата: __________</p><p><b>Вопрос.</b> '+esc(d.questions[0])+'</p><p>Выбери до трех одноклассников. Можно оставить некоторые строки пустыми.</p>'+
 '<p>1. ______________________________________________________</p><p>2. ______________________________________________________</p><p>3. ______________________________________________________</p><p class="psy-soc-small">Ответ известен только специалисту. Не советуйся с одноклассниками. Ты можешь отказаться от участия.</p></div>'+links();
}
function processing(){
 return '<h3>Алгоритм обработки</h3><ol><li>Проверьте, что коды участников уникальны, ответы перенесены в нужную строку.</li><li>Самовыборы и повторяющиеся адресаты не учитываются. В приложении такой выбор не разрешается.</li><li>Подсчитайте направленные выборы i → j: каждый выбранный адресат получает один входящий выбор.</li><li>Взаимный выбор образуется, когда i → j и j → i. Число взаимных партнеров считается для каждого участника, число пар - один раз.</li><li>Отчитайте число полученных анкет отдельно от общего числа учеников. Неответивших не считайте сделавшими ноль выборов.</li></ol>'+
 '<h3>Ограничения выводов</h3><p>'+esc(d.interpret)+'</p><p>Ограничение тремя выборами, участие не всего класса и различия критерия влияют на результат. Для научных категорий статуса требуются иные процедуры и обоснованные правила расчета.</p><p><a href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">О процедуре номинаций и ее ограничениях ↗</a> · <a href="'+SOURCE2+'" target="_blank" rel="noopener noreferrer">О схемах обработки номинаций ↗</a></p>';
}
function analyze(rows){
 const n=rows.length,received=Array(n).fill(0),sent=Array(n).fill(0),mutual=Array(n).fill(0),arcs=Array.from({length:n},()=>Array(n).fill(0));
 const errors=[],codes=rows.map(safeCode),seenCodes=new Set();
 codes.forEach((code,i)=>{if(seenCodes.has(code))errors.push("Совпадают коды: "+code+".");seenCodes.add(code)});
 let questionnaires=0;
 rows.forEach((r,i)=>{
  if(r.responded!==true)return;
  questionnaires++;
  const local=new Set();
  (r.answers||[]).slice(0,3).forEach(value=>{
   if(value===""||value===null||value===undefined)return;
   const j=Number(value);
   if(!Number.isInteger(j)||j<0||j>=n||j===i||local.has(j)){errors.push("Ошибка выбора в бланке "+codes[i]+".");return}
   local.add(j);arcs[i][j]=1;sent[i]++;received[j]++;
  });
 });
 let mutualPairs=0,edges=0;
 for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(arcs[i][j]){
  edges++;
  if(i<j&&arcs[j][i]){mutualPairs++;mutual[i]++;mutual[j]++}
 }
 return {n,codes,questionnaires,received,sent,mutual,mutualPairs,edges,arcs,errors};
}
function matrix(z){
 if(z.n>45)return '<p>Матрица более 45 участников скачивается в CSV, чтобы таблица не перегружала экран.</p>';
 return '<div class="psy-soc-matrix-wrap"><table class="psy-soc-matrix"><thead><tr><th>От / к</th>'+z.codes.map(c=>'<th>'+esc(c)+'</th>').join('')+'</tr></thead><tbody>'+
 z.codes.map((c,i)=>'<tr><th>'+esc(c)+'</th>'+z.arcs[i].map((v,j)=>'<td class="'+(i===j?'diagonal':v&&z.arcs[j][i]?'mutual':v?'positive':'')+'">'+(i===j?'×':v?'1':'·')+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><p class="psy-soc-small">1 - направленный выбор, выделенная ячейка - взаимный выбор, × - самовыбор исключен.</p>';
}
function summary(z){
 let out='<section class="psy-soc-summary"><h3>Обработка группы</h3><div class="psy-soc-stats"><div><strong>'+z.n+'</strong><span>Учеников в списке</span></div><div><strong>'+z.questionnaires+'</strong><span>Получено бланков</span></div><div><strong>'+z.edges+'</strong><span>Направленных выборов</span></div><div><strong>'+z.mutualPairs+'</strong><span>Взаимных пар</span></div></div>';
 if(z.n<2)out+='<p>Добавьте хотя бы двух участников. Для обработки реального класса желательно внести полный состав группы.</p>';
 if(z.errors.length)out+='<div class="notice psy-soc-warning"><b>Проверить данные:</b> '+esc(z.errors.join(" "))+'</div>';
 if(z.questionnaires<z.n)out+='<p class="psy-soc-small">Нет бланков: '+(z.n-z.questionnaires)+' из '+z.n+'. Эти строки не считаются ответами «никого».</p>';
 out+='<h4>Сводка по кодам</h4><div class="psy-soc-matrix-wrap"><table class="psy-soc-table"><thead><tr><th>Код</th><th>Бланк</th><th>Получено выборов</th><th>Сделано</th><th>Взаимных партнеров</th></tr></thead><tbody>'+
 z.codes.map((c,i)=>'<tr><td>'+esc(c)+'</td><td>'+(z.questionnaires&&z.n?"":"")+(z._rows?.[i]?.responded===true?"Да":"Нет")+'</td><td>'+z.received[i]+'</td><td>'+(z._rows?.[i]?.responded===true?z.sent[i]:"-")+'</td><td>'+z.mutual[i]+'</td></tr>').join('')+'</tbody></table></div><h4>Матрица направленных выборов</h4>'+matrix(z)+'<p class="psy-soc-small">'+esc(d.interpret)+'</p></section>';
 return out;
}
function current(rows){const z=analyze(rows);z._rows=rows;return z}
function calculator(data,ctx){
 const rows=ctx.rows||[],selected=Math.min(Math.max(ctx.rowIndex||0,0),Math.max(rows.length-1,0));
 const row=rows[selected]||{name:"",answers:[]},n=rows.length;
 let html='<div class="notice psy-soc-warning">Только положительные выборы для совместной работы. Вводите коды, а не ФИО. Все данные находятся в текущей вкладке браузера и не отправляются на сервер.</div>'+
 '<div class="psy-soc-manage"><label>Текущий участник<select id="participantSelect">'+rows.map((r,i)=>'<option value="'+i+'" '+(i===selected?'selected':'')+'>'+esc(safeCode(r,i))+'</option>').join('')+'</select></label>'+
 '<label>Код участника<input id="participantName" maxlength="36" value="'+esc(row.name||"")+'" placeholder="'+esc(safeCode(row,selected))+'"></label>'+
 '<button class="btn" id="addParticipant">Добавить ученика</button></div><details class="psy-soc-bulk"><summary>Быстро добавить список кодов класса</summary><p>Укажите коды участников, по одному на строке. Можно использовать У-01, У-02 и так далее. ФИО здесь не требуются.</p><textarea id="socioBulkCodes" rows="5" placeholder="У-01&#10;У-02&#10;У-03"></textarea><button class="btn" id="socioBulkAdd">Добавить коды из списка</button></details>'+ 
 '<p class="psy-soc-small">Добавьте полный список класса. Для каждого полученного бланка установите отметку ниже; если бланка нет, оставьте ее снятой.</p>';
 if(n){
  html+='<div class="psy-soc-editor"><label class="psy-soc-toggle"><input type="checkbox" id="socioResponded" '+(row.responded===true?'checked':'')+'> Бланк этого ученика получен</label>'+
  '<h4>Кого выбрал '+esc(safeCode(row,selected))+'?</h4><div class="psy-soc-choices">'+Array.from({length:3},(_,k)=>
  '<label>Выбор '+(k+1)+'<select data-socio-choice="'+k+'" '+(row.responded===true?'':'disabled')+'><option value="">- нет выбора -</option>'+
  rows.map((r,i)=>i===selected?'':'<option data-peer-index="'+i+'" value="'+i+'" '+(String((row.answers||[])[k])===String(i)?'selected':'')+'>'+esc(safeCode(r,i))+'</option>').join('')+'</select></label>').join('')+'</div>'+
  '<div class="psy-soc-buttons"><button class="btn" id="socioClear">Очистить этот бланк</button><span id="socioAlert" aria-live="polite"></span></div></div>';
 }
 html+='<div class="psy-soc-buttons"><button class="btn primary" id="socioReport">Скачать отчет группы (HTML)</button><button class="btn" id="socioCSV">Скачать сводку CSV</button><button class="btn" id="socioMatrix">Скачать матрицу CSV</button></div><div id="socioSummary">'+summary(current(rows))+'</div>';
 return html;
}
function csvCell(v){let s=String(v==null?"":v);if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
function csv(rows){return "\uFEFF"+rows.map(r=>r.map(csvCell).join(";")).join("\r\n")}
function download(file,text,type){const blob=new Blob([text],{type}),u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=file;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function bind(data,ctx){
 const rows=ctx.rows||[],selected=ctx.rowIndex||0,row=rows[selected];
 if(!row)return;
 const refresh=()=>{const el=document.getElementById("socioSummary");if(el)el.innerHTML=summary(current(rows))};
 document.getElementById("socioBulkAdd")?.addEventListener("click",()=>{
  const raw=document.getElementById("socioBulkCodes")?.value||"";
  const codes=raw.split(/[\n,;]+/).map(x=>x.trim()).filter(Boolean);
  if(!codes.length)return;
  const currentCodes=new Set(rows.map((r,i)=>safeCode(r,i)));
  if(rows.length===1&&!rows[0].name&&!rows[0].responded&&!rows[0].answers?.length){rows.splice(0,1);currentCodes.clear()}
  let added=0;
  for(const c of codes){const code=c.slice(0,36);if(currentCodes.has(code))continue;rows.push({name:code,answers:[],responded:false});currentCodes.add(code);added++}
  if(!added){alert("Новых кодов нет. Проверьте совпадения.");return}
  document.getElementById("participantSelect")?.dispatchEvent(new Event("change",{bubbles:true}));
 });
 const alertEl=document.getElementById("socioAlert");
 document.getElementById("socioResponded")?.addEventListener("change",e=>{
  row.responded=!!e.target.checked;
  document.querySelectorAll("[data-socio-choice]").forEach(x=>x.disabled=!row.responded);
  if(!row.responded)row.answers=[];
  if(!row.responded)document.querySelectorAll("[data-socio-choice]").forEach(x=>x.value="");
  refresh();
 });
 document.querySelectorAll("[data-socio-choice]").forEach(el=>el.addEventListener("change",()=>{
  const j=el.value===""?"":Number(el.value),slot=Number(el.dataset.socioChoice);
  if(j!==""&&Object.values(row.answers||[]).some((v,k)=>k!==slot&&Number(v)===j&&v!=="")){
   el.value="";if(alertEl)alertEl.textContent="Этот код уже выбран в другом поле.";return;
  }
  if(!Array.isArray(row.answers))row.answers=[];
  row.answers[slot]=j;if(alertEl)alertEl.textContent="";refresh();
 }));
 document.getElementById("participantName")?.addEventListener("input",e=>{
  const code=esc(e.target.value||safeCode(row,selected));
  document.querySelectorAll("option[data-peer-index='"+selected+"']").forEach(x=>x.innerHTML=code);
  refresh();
 });
 document.getElementById("socioClear")?.addEventListener("click",()=>{
  if(!confirm("Очистить ответы этого участника?"))return;
  row.answers=[];row.responded=false;
  document.getElementById("socioResponded").checked=false;
  document.querySelectorAll("[data-socio-choice]").forEach(x=>{x.value="";x.disabled=true});refresh();
 });
 document.getElementById("socioCSV")?.addEventListener("click",()=>{
  const z=current(rows);if(z.errors.length){alert("Исправьте повторяющиеся коды и ошибки выборов.");return}download("Социометрия_сводка.csv",csv([["Код","Бланк получен","Получено выборов","Сделано выборов","Взаимных партнеров"],...z.codes.map((c,i)=>[c,rows[i].responded===true?"Да":"Нет",z.received[i],rows[i].responded===true?z.sent[i]:"",z.mutual[i]])]),"text/csv;charset=utf-8");
 });
 document.getElementById("socioMatrix")?.addEventListener("click",()=>{
  const z=current(rows);if(z.errors.length){alert("Исправьте повторяющиеся коды и ошибки выборов.");return}download("Социометрия_матрица.csv",csv([["От / к",...z.codes],...z.codes.map((c,i)=>[c,...z.arcs[i].map((v,j)=>i===j?"":v)])]),"text/csv;charset=utf-8");
 });
 document.getElementById("socioReport")?.addEventListener("click",()=>{
  const z=current(rows);if(z.errors.length){alert("Исправьте ошибки кодов и выборов перед выгрузкой.");return}
  const doc='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Социометрия - отчет</title><style>@page{size:A4;margin:13mm}body{font:13px/1.5 Arial,sans-serif;color:#203d30;margin:20px}h1{font-size:20px}table{border-collapse:collapse;width:100%;font-size:10px}th,td{border:1px solid #aec6b6;padding:4px;text-align:center}th:first-child,td:first-child{text-align:left}tr{break-inside:avoid}.psy-soc-stats{display:flex;gap:20px}.psy-soc-stats div{padding:9px;border:1px solid #ddd}.psy-soc-stats strong{display:block;font-size:22px}.psy-soc-matrix-wrap{overflow-wrap:anywhere}.psy-soc-matrix th,.psy-soc-matrix td{padding:2px}.psy-soc-small{font-size:11px}h4{margin-bottom:7px}</style></head><body><h1>Психотека · Социометрия класса</h1><p>Положительные выборы партнеров для учебной работы. Дата: '+new Date().toLocaleDateString("ru-RU")+'. Конфиденциальный материал специалиста.</p>'+summary(z)+'<p>Источник: '+esc(SOURCE)+'</p></body></html>';
  download("Социометрия_отчет.html",doc,"text/html;charset=utf-8");
 });
}
window.PSY_SOCIO={instruction,materials,processing,calculator,bind,analyze,summary,links};
})();