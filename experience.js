
"use strict";
const DETAILS=window.PSY_FULL_METHODS||{};
let methodNow=null, tabNow="overview", calcMode="one", rowIndex=0;
let rows=[{name:"",answers:[]}];
const categoryIcons={
"Тревожность":'<path d="M8 18c-2-6 3-10 8-9 5-5 13 0 12 5 9 1 11 16-1 17H11C1 31 0 21 8 18z"/><path d="M13 22h3m3 0h3"/>',
"Адаптация":'<path d="M6 20 20 8l14 12v15H6z"/><path d="M16 35V24h8v11"/>',
"Самооценка":'<circle cx="20" cy="20" r="14"/><path d="M14 17v2m12-2v2M13 25q7 7 14 0"/>',
"Настроение":'<path d="M20 6c8 0 14 6 14 14s-6 14-14 14S6 28 6 20 12 6 20 6z"/><path d="M14 17v2m12-2v2m-12 8h12"/>',
"Семья":'<circle cx="12" cy="14" r="5"/><circle cx="28" cy="14" r="5"/><circle cx="20" cy="25" r="4"/><path d="M3 33v-6q1-8 9-8m25 14v-6q-1-8-9-8m-15 16v-3q0-8 7-8t7 8v3"/>',
"Внимание":'<circle cx="20" cy="20" r="15"/><circle cx="20" cy="20" r="8"/><circle cx="20" cy="20" r="2"/>',
"СДВГ":'<circle cx="17" cy="11" r="4"/><path d="M17 16v9m0-5-10 7m10-5 10 4m-10-1-5 11m5-11 7 11m3-27q9 4 0 9m5 3q7 4-1 8"/>',
"Агрессия":'<path d="m20 4 5 11 11 5-11 5-5 11-5-11-11-5 11-5z"/>',
"Общение":'<path d="M5 9h21v16H14l-7 6v-6H5z"/><path d="M22 14h13v16h-8l-5 5v-5"/>',
"Мотивация":'<path d="M18 4 10 22h10l-2 14 14-20H21z"/>',
"Мониторинг риска":'<path d="M20 5 33 11v10q0 10-13 15Q7 31 7 21V11z"/><path d="m13 20 5 5 10-11"/>',
"ПМПК":'<rect x="6" y="16" width="9" height="19" rx="2"/><rect x="16" y="5" width="9" height="30" rx="2"/><rect x="26" y="11" width="9" height="24" rx="2"/>',
"Программы":'<path d="M7 6h21v29H7z"/><path d="M13 13h9m-9 7h9m-9 7h7"/>'
};
function iconSvg(theme){return '<svg viewBox="0 0 40 40" role="img" aria-label="'+escapeHTML(theme)+'" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'+(categoryIcons[theme]||categoryIcons["ПМПК"])+'</svg>'}
function render(){
 const filtered=C.filter(m=>{const hay=[m.name,m.author,m.theme,m.goal].join(" ").toLowerCase();return (!state.topic||m.theme===state.topic)&&(!state.category||m.theme===state.category)&&(!state.query||hay.includes(state.query.toLowerCase()))&&(!state.format||(state.format==="Проективная"?m.format.includes("Проективная"):state.format==="Проба"?m.format.includes("проба"):state.format==="Программа"?m.format==="Программа":m.format==="Опросник"))});
 $("#resultCount").textContent="Найдено: "+filtered.length;
 $("#listHeading").textContent=state.topic||"Школьные материалы";
 $("#catalog").innerHTML=filtered.map(m=>{
 const d=DETAILS[m.name], tag=d?'Материал для просмотра':'Портфолио и источник',age=d?.age||m.age;
 return '<article class="method"><div class="head"><div class="glyph">'+iconSvg(m.theme)+'</div><div><h3>'+escapeHTML(m.name)+'</h3><small>'+escapeHTML(d?.author||m.author)+'</small></div></div><div class="tags"><span class="tag">'+escapeHTML(m.theme)+'</span><span class="tag">'+escapeHTML(age)+'</span></div><p>'+escapeHTML(d?.goal||m.goal)+'</p><div class="actions"><button class="btn primary" data-open="'+escapeHTML(m.id)+'">'+(d?'Посмотреть методику':'Портфолио')+'</button>'+(d?.calculator?'<button class="btn" data-score="'+escapeHTML(m.id)+'">Подсчет</button>':'')+'</div><div class="card-availability">'+escapeHTML(tag)+'</div></article>';
 }).join("") || '<p>Не найдено материалов по выбранным параметрам.</p>';
 document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openMethod(C.find(m=>m.id===b.dataset.open)));
 document.querySelectorAll('[data-score]').forEach(b=>b.onclick=()=>{openMethod(C.find(m=>m.id===b.dataset.score));setTab("score")});
}
function setTab(name){
 tabNow=name;
 document.querySelectorAll(".modal-tab").forEach(x=>{x.classList.toggle("active",x.dataset.tab===name);x.setAttribute("aria-selected",String(x.dataset.tab===name))});
 const body=$("#modalBody");
 if(!methodNow){return}
 body.innerHTML=name==="overview"?viewOverview(methodNow):
 name==="instruction"?viewInstruction(methodNow):
 name==="materials"?viewMaterials(methodNow):
 name==="processing"?viewProcessing(methodNow):viewCalculator(methodNow);
 body.scrollTop=0;
 bindControls();
}
function viewOverview(m){
 const d=DETAILS[m.name];
 if(!d) return '<div class="portfolio-note"><h3>Портфолио методики</h3><p>Название: <strong>'+escapeHTML(m.name)+'</strong></p><p>Автор: '+escapeHTML(m.author)+'</p><p>Возраст: '+escapeHTML(m.age)+'</p><p>Назначение: '+escapeHTML(m.goal)+'</p><div class="notice">Оригинальные задания и ключи этой методики не опубликованы здесь. Для проведения необходима корректная версия из первоисточника. Описание не заменяет тест.</div></div>';
 return '<div class="method-facts"><span><b>Автор</b>'+escapeHTML(d.author)+'</span><span><b>Возраст</b>'+escapeHTML(d.age)+'</span><span><b>Объем</b>'+escapeHTML(d.count)+'</span><span><b>Вид</b>'+escapeHTML(d.kind)+'</span></div><h3>Цель методики</h3><p>'+escapeHTML(d.goal)+'</p><h3>Что исследует</h3><div class="notice">'+escapeHTML(d.interpret)+'</div><h3>Происхождение и условия</h3><p>'+escapeHTML(d.license||'Профессиональная проба: интерпретация по выбранному руководству, без самодельных возрастных норм.')+'</p>';
}
function viewInstruction(m){
 const d=DETAILS[m.name];
 if(!d)return viewOverview(m);
 return '<h3>Инструкция для участника</h3><blockquote class="kid-instruction">'+escapeHTML(d.instructions)+'</blockquote><h3>Порядок проведения для психолога</h3><ol><li>Проверьте соответствие возраста и цели.</li><li>Объясните добровольность и порядок работы.</li><li>Предъявите стимульный материал без подсказок.</li><li>Зафиксируйте ответы, длительность и существенные наблюдения.</li><li>Проводите интерпретацию в пределах применимых методических норм.</li></ol>';
}
function ladderSvg(){let s='<svg width="500" height="250" viewBox="0 0 500 250" aria-label="Лестница из семи ступеней"><path d="M16 224 H485" stroke="#42765c" stroke-width="3"/>';for(let i=0;i<7;i++){let h=23*(i+1);s+='<rect x="'+(50+i*59)+'" y="'+(224-h)+'" width="56" height="'+h+'" fill="'+(i%2?'#b4dbb9':'#d8ecd7')+'" stroke="#41795c" stroke-width="2"/><text x="'+(77+i*59)+'" y="'+(216-h)+'" text-anchor="middle" font-size="15" fill="#28553f">'+(i+1)+'</text>'}return s+'</svg>'}
const schulteNumbers=[4,17,9,22,1,13,6,25,12,19,24,15,2,7,11,8,20,14,5,23,3,18,10,21,16];
function materials(m,blank){
 const d=DETAILS[m.name];
 if(!d)return '<p>Полный материал доступен только у правообладателя.</p>';
 if(d.graphic==='ladder')return '<div class="stimulus-paper"><h3>Задание</h3>'+ladderSvg()+'</div>';
 if(d.graphic==='schulte')return '<div class="stimulus-paper"><h3>Найди числа от 1 до 25 по порядку</h3><div class="schulte-grid">'+schulteNumbers.map(n=>'<div>'+n+'</div>').join('')+'</div></div>';
 if(d.graphic==='drawing')return '<div class="stimulus-paper drawing"><div class="drawing-instruction">'+escapeHTML(d.instructions)+'</div><div class="drawing-space"></div></div>';
 if(Array.isArray(d.questions)&&d.questions.length){
  return '<div class="blank-instruction">'+escapeHTML(d.instructions)+'</div><div class="scale-options">'+d.options.map((x,i)=>'<span><b>'+i+'</b> '+escapeHTML(x)+'</span>').join('')+'</div><table class="questions-table"><thead><tr><th>№</th><th>Утверждение</th><th>Ответ</th></tr></thead><tbody>'+d.questions.map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+escapeHTML(q)+'</td><td class="blank-cell">'+(blank?'_____':d.options.map((_,k)=>k).join(' / '))+'</td></tr>').join('')+'</tbody></table>';
 }
 return '<ul>'+d.questions.map(q=>'<li>'+escapeHTML(q)+'</li>').join('')+'</ul>';
}
function viewMaterials(m){
 const d=DETAILS[m.name];if(!d)return viewOverview(m);
 return '<h3>Стимульный материал и бланк</h3>'+materials(m,false)+(d.questions?.length && d.graphic ? '<h3>Вопросы для беседы</h3><ol>'+d.questions.map(q=>'<li>'+escapeHTML(q)+'</li>').join('')+'</ol>':"");
}
function viewProcessing(m){
 const d=DETAILS[m.name];if(!d)return viewOverview(m);
 return '<h3>Подсчет / фиксация</h3><p>'+escapeHTML(d.scoring)+'</p><h3>Интерпретация</h3><p>'+escapeHTML(d.interpret)+'</p>'+(d.source?'<p>Источник: <a target="_blank" rel="noopener noreferrer" href="'+escapeHTML(d.source)+'">'+escapeHTML(d.source)+'</a></p>':'');
}
function getScores(d,answers){
 const n=d.questions.length;if(answers.length<n || answers.some((v,i)=>i<n && (v==null || v==="")))return null;
 const nums=answers.slice(0,n).map(Number);
 if(d.reversed) nums.forEach((v,i)=>{if(d.reversed.includes(i))nums[i]=(d.options.length-1)-v});
 const raw=nums.reduce((a,b)=>a+b,0);
 if(d.options.length===6) return {raw,index:raw*4,max:25,caption:'Индекс благополучия 0-100'};
 return {raw,index:null,max:n*(d.options.length-1),caption:'Сырая сумма'};
}
function viewCalculator(m){
 const d=DETAILS[m.name];
 if(!d?.calculator)return '<p>У этой методики нет онлайн-подсчета. Используйте качественное наблюдение и руководство выбранной версии.</p>';
 if(!rows.length) rows=[{name:"",answers:[]}]; if(rowIndex>=rows.length)rowIndex=0;
 const r=rows[rowIndex],count=d.questions.length;
 let head='<div class="calc-mode"><button class="btn '+(calcMode==='one'?'primary':'')+'" data-cmode="one">Один участник</button><button class="btn '+(calcMode==='class'?'primary':'')+'" data-cmode="class">Группа / класс</button></div>';
 if(calcMode==='class')head+='<div class="group-tools"><label>Участник <select id="participantSelect">'+rows.map((x,i)=>'<option value="'+i+'" '+(i===rowIndex?'selected':'')+'>'+(i+1)+'. '+escapeHTML(x.name||'Участник '+(i+1))+'</option>').join('')+'</select></label><label>Имя (необязательно)<input id="participantName" placeholder="Имя или номер" value="'+escapeHTML(r.name)+'"></label><button class="btn" id="addParticipant">Добавить</button></div><div class="privacy-inline">ФИО не отправляются на сервер и не сохраняются автоматически. При закрытии страницы несохраненные результаты будут потеряны.</div>';
 else head+='<div class="privacy-inline">Подсчет выполняется в браузере. Ответы не отправляются на сервер и не сохраняются между сеансами.</div>';
 const answered=r.answers.filter(x=>x!==''&&x!=null).length;
 let qhtml='<div class="answer-progress"><b>'+answered+' из '+count+'</b><span>Заполнено</span><button class="btn btn-small" id="jumpMissing">К пропуску</button></div><div class="answer-progress-track"><span style="width:'+(100*answered/count)+'%"></span></div><div class="answer-grid">'+d.questions.map((q,i)=>'<label class="answer-card '+(r.answers[i]==null||r.answers[i]===''?'missing':'done')+'" data-q="'+i+'"><strong>'+(i+1)+'. '+escapeHTML(q)+'</strong><input class="answer-input" type="text" inputmode="numeric" maxlength="1" aria-label="Ответ на вопрос '+(i+1)+'" data-n="'+i+'" value="'+escapeHTML(r.answers[i]??'')+'" placeholder="0-'+(d.options.length-1)+'"></label>').join('')+'</div>';
 const result=getScores(d,r.answers);
 let results='<div class="score-section" id="scoreSection"><h3>Результат</h3>';
 if(!result)results+='<p>Заполни все ответы, чтобы увидеть баллы. Незаполненные поля подсвечены.</p>';
 else{let pct=100*result.raw/result.max;results+='<div class="score-bar-line"><b>'+result.raw+' из '+result.max+'</b><div class="visual-scale"><span style="width:'+pct+'%"></span></div><p>'+escapeHTML(result.caption)+(result.index==null?'':' · '+result.index+' из 100')+'</p></div><div class="notice">'+escapeHTML(d.interpret)+'</div>';}
 results+='</div>';
 if(calcMode==='class'){
 results+='<div class="class-actions"><button class="btn primary" id="nextParticipant">Следующий участник</button><button class="btn" id="exportGroup">Скачать CSV для Excel</button></div><h3>Результаты группы</h3><div class="results-table"><table><thead><tr><th>Участник</th><th>Сумма</th>'+(d.options.length===6?'<th>Индекс</th>':'')+'</tr></thead><tbody>'+rows.map((x,i)=>{const z=getScores(d,x.answers);return '<tr><td>'+escapeHTML(x.name||'Участник '+(i+1))+'</td><td>'+(z?z.raw:'–')+'</td>'+(d.options.length===6?'<td>'+(z?z.index:'–')+'</td>':'')+'</tr>'}).join('')+'</tbody></table></div>';
 }
 return head+'<div class="notice">Ответы вводятся цифрами от 0 до '+(d.options.length-1)+'. После ввода курсор переходит к следующему полю.</div>'+qhtml+results+'<div class="class-actions"><button class="btn" id="resetParticipant">Сбросить ответы участника</button></div>';
}
function bindControls(){
 const d=DETAILS[methodNow.name];
 document.querySelectorAll('[data-cmode]').forEach(b=>b.onclick=()=>{calcMode=b.dataset.cmode;rowIndex=0;rows=[{name:"",answers:[]}];setTab("score")});
 $("#participantSelect")?.addEventListener('change',e=>{rowIndex=+e.target.value;setTab("score")});
 $("#participantName")?.addEventListener('input',e=>{rows[rowIndex].name=e.target.value;const sel=$("#participantSelect");sel.options[rowIndex].text=(rowIndex+1)+'. '+(e.target.value||'Участник '+(rowIndex+1))});
 $("#addParticipant")?.addEventListener('click',()=>{rows.push({name:"",answers:[]});rowIndex=rows.length-1;setTab("score")});
 document.querySelectorAll('.answer-input').forEach(inp=>{inp.addEventListener('input',e=>{
   let val=e.target.value.replace(/[^0-9]/g,'');
   if(val!==''&&Number(val)>=d.options.length)val='';
   e.target.value=val;rows[rowIndex].answers[+inp.dataset.n]=val;
   const inputs=[...document.querySelectorAll('.answer-input')];if(val&&+inp.dataset.n<inputs.length-1)inputs[+inp.dataset.n+1].focus();
   // Update live outcome without recreating input focus.
   const all=rows[rowIndex].answers,n=d.questions.length;const done=all.filter(x=>x!==''&&x!=null).length;
   const ap=$('.answer-progress b'),progress=$('.answer-progress-track span');if(ap)ap.textContent=done+' из '+n;if(progress)progress.style.width=(100*done/n)+'%';
   inp.closest('.answer-card')?.classList.toggle('missing',!val);
   const rr=getScores(d,all),sec=$('#scoreSection'); if(sec)sec.innerHTML=rr?'<h3>Результат</h3><div class="score-bar-line"><b>'+rr.raw+' из '+rr.max+'</b><div class="visual-scale"><span style="width:'+(100*rr.raw/rr.max)+'%"></span></div><p>'+escapeHTML(rr.caption)+(rr.index==null?'':' · '+rr.index+' из 100')+'</p></div><div class="notice">'+escapeHTML(d.interpret)+'</div>':'<h3>Результат</h3><p>Заполни все ответы, чтобы увидеть баллы.</p>';
   if(calcMode==='class') updateGroupTable(d);
 })});
 $("#jumpMissing")?.addEventListener('click',()=>{let input=[...document.querySelectorAll('.answer-input')].find(x=>!x.value);(input||document.querySelector('.answer-input'))?.focus()});
 $("#nextParticipant")?.addEventListener('click',()=>{if(rowIndex>=rows.length-1)rows.push({name:"",answers:[]});rowIndex++;setTab("score");$('.answer-input')?.focus()});
 $("#resetParticipant")?.addEventListener('click',()=>{if(confirm('Очистить ответы выбранного участника?')){rows[rowIndex].answers=[];setTab('score')}});
 $("#exportGroup")?.addEventListener('click',()=>exportGroup(d));
}
function updateGroupTable(d){
 const table=$('.results-table tbody');if(!table)return;
 table.innerHTML=rows.map((x,i)=>{const z=getScores(d,x.answers);return '<tr><td>'+escapeHTML(x.name||'Участник '+(i+1))+'</td><td>'+(z?z.raw:'–')+'</td>'+(d.options.length===6?'<td>'+(z?z.index:'–')+'</td>':'')+'</tr>'}).join('');
}
function exportGroup(d){
 const safe=s=>{let x=String(s||'');if(/^[\s]*[=+\-@]/.test(x))x="'"+x;return '"'+x.replace(/"/g,'""')+'"'};
 let data=[['Участник','Сырая сумма',...(d.options.length===6?['Индекс']:[])]];
 rows.forEach((r,i)=>{let z=getScores(d,r.answers);data.push([r.name||'Участник '+(i+1),z?.raw??'',...(d.options.length===6?[z?.index??'']:[])])});
 const csv='\uFEFF'+data.map(row=>row.map(safe).join(';')).join('\r\n');
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Психотека_результаты.csv';a.click();URL.revokeObjectURL(url);
}
function makePrintPage(d,blank){
 const h='<html lang="ru"><head><meta charset="utf-8"><title>Психотека - '+escapeHTML(methodNow.name)+'</title><style>@page{size:A4;margin:13mm}body{font:11pt/1.35 Arial,sans-serif;color:#22372d}h1{font-size:18pt}h2{font-size:13pt}p{margin:7px 0}table{border-collapse:collapse;width:100%;table-layout:fixed}td,th{border:1px solid #789c87;padding:6px;vertical-align:top;font-size:10pt;overflow-wrap:break-word}tr{break-inside:avoid;page-break-inside:avoid}.questions-table td:first-child{width:38px}.questions-table td:last-child{width:75px}.stimulus-paper svg{max-width:100%;height:auto}.drawing-space{border:1px solid #abc5b3;height:570px}.schulte-grid{display:grid;grid-template-columns:repeat(5,1fr);max-width:430px;margin:25px auto}.schulte-grid div{border:1px solid #698f76;text-align:center;font-size:22pt;padding:15px}.scale-options{margin:15px 0;display:flex;flex-wrap:wrap;gap:9px}.scale-options span{border:1px solid #b8cfbe;padding:8px}.drawing-instruction{margin:15px 0}.blank-instruction{margin:15px 0}button{display:none}</style></head><body>';
 const base=blank?'<p>Фамилия, имя: ________________________________ Дата: ____________</p>':'<h1>'+escapeHTML(methodNow.name)+'</h1><p>'+escapeHTML(d.author)+' · '+escapeHTML(d.age)+'</p><h2>Цель</h2><p>'+escapeHTML(d.goal)+'</p><h2>Инструкция участнику</h2><p>'+escapeHTML(d.instructions)+'</p>';
 return h+base+(blank?materials(methodNow,true):'<h2>Задания и стимулы</h2>'+materials(methodNow,false)+'<h2>Обработка</h2><p>'+escapeHTML(d.scoring)+'</p><h2>Интерпретация</h2><p>'+escapeHTML(d.interpret)+'</p>')+'</body></html>';
}
function printMaterial(blank){
 const d=DETAILS[methodNow?.name];if(!d)return;
 const html=makePrintPage(d,blank);
 let f=document.getElementById('psyPrint');if(f)f.remove();
 f=document.createElement('iframe');f.id='psyPrint';f.title='Печать материала';f.style='position:fixed;right:0;bottom:0;width:0;height:0;border:0';document.body.appendChild(f);
 f.onload=()=>{try{f.contentWindow.focus();f.contentWindow.print()}catch(e){alert('В этом браузере печать недоступна.')}};
 f.contentDocument.open();f.contentDocument.write(html);f.contentDocument.close();
}
function saveMethodHTML(){
 const d=DETAILS[methodNow?.name];if(!d)return;
 const data='<!doctype html>'+makePrintPage(d,false),url=URL.createObjectURL(new Blob([data],{type:'text/html;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download=methodNow.name.replace(/[\\/:*?"<>|]+/g,'_')+'.html';a.click();URL.revokeObjectURL(url);
}
function openMethod(m){
 if(!m)return;
 methodNow=m;tabNow='overview';calcMode='one';rows=[{name:"",answers:[]}];rowIndex=0;
 const d=DETAILS[m.name];$('#modalTitle').textContent=m.name;$('#modalAuthor').textContent=d?.author||m.author;
 $('#modalBody').innerHTML='';
 const header=$('#modal').querySelector('.modalhead');
 let old=$('#methodTabs');if(old)old.remove();
 const tabs=d?[['overview','Описание'],['instruction','Инструкция'],['materials','Методика и бланк'],['processing','Обработка'],...(d.calculator?[['score','Подсчет']]:[])]:[['overview','Портфолио']];
 header.insertAdjacentHTML('afterend','<nav class="method-tabs" id="methodTabs">'+tabs.map(([key,title])=>'<button class="modal-tab" data-tab="'+key+'">'+title+'</button>').join('')+'</nav>');
 document.querySelectorAll('.modal-tab').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
 const footer=$('#modal').querySelector('.modalfoot');
 footer.innerHTML='<div class="actions" id="methodButtons">'+(d?'<button class="btn" id="printFull">Распечатать всю методику</button><button class="btn" id="printBlank">Бланк для ребенка</button><button class="btn" id="saveMethod">Скачать методику</button>':'')+'</div><div class="actions"><button class="btn" id="closeFooter">Закрыть</button>'+(m.source||d?.source?'<a class="btn primary" target="_blank" rel="noopener noreferrer" href="'+escapeHTML(d?.source||m.source)+'">Первоисточник ↗</a>':'')+'</div>';
 $('#closeFooter').onclick=closeModal;
 if(d){$('#printFull').onclick=()=>printMaterial(false);$('#printBlank').onclick=()=>printMaterial(true);$('#saveMethod').onclick=saveMethodHTML;}
 $('#modal').hidden=false;$('#shade').hidden=false;setTab('overview');
}
window.openMethod=openMethod;
render();
