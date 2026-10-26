"use strict";
/* Лесенка В.Г.Щур. Семь ступенек, 1 внизу и 7 наверху.
   Не объединять результаты с ключом «1 наверху» или 5-ступенчатым вариантом. */
(function(){
const NAME="Лесенка";
const SOURCE="https://a2b2.ru/storage/files/methodologicals/63791/76363_Metodika_Lesenka_V.G.%20Shchur.pdf";
const SECONDARY="https://38.dou.spb.ru/attachments/article/136/%D0%9F%D0%A0%D0%98%D0%9B%D0%9E%D0%96%D0%95%D0%9D%D0%98%D0%95%202%20%D0%A0%D1%83%D0%BA%D0%B0%20%D0%BE%D0%B1%20%D1%80%D1%83%D0%BA%D1%83.%20%D0%94%D0%B8%D0%B0%D0%B3%D0%BD%D0%BE%D1%81%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D0%BC%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%B0%D0%BB%D1%8B.pdf";
const FIELDS=[
 ["self","Куда ребенок ставит себя","Обязательная запись"],
 ["wish","Каким хотел бы быть","Дополнительно"],
 ["mother","Как оценила бы мама","Предположение ребенка"],
 ["father","Как оценил бы папа","Предположение ребенка"],
 ["teacher","Как оценил бы педагог","Предположение ребенка"]
];
const WARN="Методика «Лесенка» опубликована в нескольких редакциях: встречаются 5 и 7 ступенек, нумерация как сверху вниз, так и снизу вверх, разные правила интерпретации. Здесь выбран семиступенчатый рабочий бланк: 1 – самая нижняя, 7 – самая верхняя. Выбор ступеньки и слова ребенка сохраняются без автоматического диагноза и нормативного уровня. Используйте один и тот же бланк и ключ для всех участников.";
const D=window.PSY_FULL_METHODS;
const d=D[NAME]||{};
Object.assign(d,{
 author:"В. Г. Щур",
 age:"5-10 лет; семиступенчатая редакция, 1 – нижняя, 7 – верхняя",
 kind:"Проективная графическая диагностическая беседа",
 count:"1 лесенка из 7 ступенек + вопросы и беседа",
 goal:"Изучение представлений ребенка о себе и о том, как его, по его мнению, оценивают близкие взрослые.",
 instructions:"Покажите ребенку лесенку из семи ступеней. Объясните, что сверху находятся самые «хорошие» дети, снизу – те, которые оцениваются ниже, а на средней ступени – «ни хорошие, ни плохие». Попросите выбрать ступеньку для себя и объяснить почему. Затем при необходимости уточните желаемое положение, предполагаемую оценку мамы, папы и педагога. Не оценивайте ответ ребенка во время процедуры.",
 scoring:"Запишите названную ребенком ступеньку для самого себя (1-7), желаемую ступеньку и предполагаемые оценки взрослых (если они названы). Сопоставляйте выбор с объяснением. Разницу между позициями вычисляйте арифметически, но не интерпретируйте как нормативный балл. Обязателен только первый выбор ребенка.",
 interpret:"Положение ребенка на лесенке отражает его ответ в данной ситуации, но само по себе не подтверждает завышенную, адекватную или заниженную самооценку. Анализируйте возраст, объяснение, эмоциональный тон, колебания и контекст отношений. Ответы о взрослых – представления ребенка, а не фактические оценки взрослых.",
 warning:WARN,
 source:SOURCE,officialBlank:SOURCE,sourceAdditional:SECONDARY,
 guideFile:"downloads/shchur_ladder_guide.html",guideWithBlankFile:"downloads/shchur_ladder_guide_with_blank.html",guideWordFile:"downloads/shchur_ladder_guide.docx",
 answerFile:"downloads/shchur_ladder_student.html",
 workflow:"ladder7",graphic:"ladder",calculator:true,
 questions:FIELDS.map(x=>x[1]),scaleLabels:["Позиция собственного Я","Желаемый образ Я","Предполагаемая оценка взрослых","Причины выбора и отношение к нему"],
 sourceVersion:"7 ступенек; 1 – нижняя; 7 – верхняя; качественная интерпретация"
});
D[NAME]=d;
const esc=t=>String(t??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const allowed=x=>x!==undefined&&x!==null&&x!==""&&Number.isInteger(Number(x))&&Number(x)>=1&&Number(x)<=7;
function scan(answers){
 const self=answers?.[0];
 if(!allowed(self))return null;
 const values=Array.from({length:5},(_,i)=>allowed(answers?.[i])?Number(answers[i]):null);
 const rel={};
 FIELDS.slice(1).forEach((f,i)=>{rel[f[0]]=values[i+1]===null?null:values[i+1]-values[0];});
 return {raw:values[0],max:7,steps:values,relative:rel,answered:values.filter(x=>x!==null).length,
   caption:"Положение на выбранной лесенке, без нормативного диагноза"};
}
function stepsSVG(mode="preview"){
 const shape=Array.from({length:7},(_,i)=>{const n=i+1,x=26+i*73,y=300-i*35;
  return '<rect x="'+x+'" y="'+y+'" width="72" height="'+(350-y)+'" rx="3" fill="'+(i%2===0?"#e6f2e7":"#d2e6d9")+'" stroke="#62977c" stroke-width="2"/>'+
   '<path d="M'+x+' '+y+'H'+(x+72)+'" stroke="#225e45" stroke-width="4" stroke-linecap="round"/>'+
   '<text x="'+(x+36)+'" y="'+(y+25)+'" font-family="Arial,sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#1e5f45">'+n+'</text>';
 }).join("");
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 555 395" role="img" aria-label="Семь ступенек от 1 внизу до 7 наверху"><rect width="555" height="395" rx="14" fill="#fcfefa"/>'+
 '<text x="16" y="378" font-family="Arial,sans-serif" font-size="14" fill="#517f68">1 – нижняя ступень</text>'+
 '<text x="537" y="31" font-family="Arial,sans-serif" font-size="14" text-anchor="end" fill="#517f68">7 – верхняя</text>'+
 shape+'</svg>';
}
function links(d){
 return '<div class="psy-ladder-links">'+
 '<a class="btn primary" href="'+esc(d.guideFile)+'" download>Методика и протокол · Word</a>'+
 '<a class="btn" href="'+esc(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Бланк ребенка · А4 ↗</a>'+
 '<a class="btn" href="'+esc(d.source)+'" target="_blank" rel="noopener noreferrer">Опубликованное руководство · PDF ↗</a></div>';
}
function instruction(d){
 return '<div class="psy-common-guide-head"><h3>Методика и руководство</h3><div class="psy-common-guide-actions"><a class="btn" href="downloads/shchur_ladder_guide.html" target="_blank" rel="noopener noreferrer">Без бланка</a><a class="btn primary" href="downloads/shchur_ladder_guide_with_blank.html" target="_blank" rel="noopener noreferrer">С бланком</a></div></div><h3>Проведение</h3><p>'+esc(d.instructions)+'</p>'+
 '<h3>Порядок беседы</h3><ol><li>Убедитесь, что ребенку понятны семь ступенек и их значение.</li>'+
 '<li>Попросите поставить себя на одну из ступенек и объяснить свой выбор.</li>'+
 '<li>По выбранному руководству задайте дополнительные вопросы: каким хотел бы быть, куда поставили бы мама, папа, педагог.</li>'+
 '<li>Дословно запишите объяснения и отметьте необходимость помощи и колебания.</li>'+
 '<li>Не объявляйте ребенку «уровень самооценки» по одному выбору.</li></ol>'+
 '<div class="notice psy-ladder-warning">'+esc(d.warning)+'</div>';
}
function materials(d){
 return '<div class="psy-common-guide-head"><h3>Стимульный бланк с лесенкой</h3><div class="psy-common-guide-actions"><a class="btn primary" href="'+esc(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Посмотреть и распечатать</a></div></div><h3>Стимульный бланк ученика</h3>'+
 '<div class="notice">Семь ступенек. Нумерация на рабочем бланке снизу вверх. Ребенок отмечает собственную ступень и отвечает на вопросы в беседе, психолог записывает их в протокол.</div>'+
 '<div class="psy-ladder-paper">'+stepsSVG()+'</div>'+
 '<p>Для печати открывайте отдельный бланк А4. Обозначение выбранной ступени оставьте свободным: ребенок может нарисовать кружок или поставить фигурку.</p>';
}
function processing(d){
 return '<h3>Качественная обработка</h3><p>'+esc(d.scoring)+'</p>'+
 '<div class="psy-ladder-facts"><div><b>1–7</b><span>выбор ребенка</span></div><div><b>0–4</b><span>дополнительных ответов</span></div><div><b>Разница</b><span>позиция взрослого − своя</span></div></div>'+
 '<h3>Что обязательно зафиксировать</h3><p>Ступеньку, слова ребенка о своем выборе, уверенность или колебания, реакцию на вопросы и вид оказанной помощи. Предполагаемая оценка взрослых – лишь мнение ребенка.</p>'+
 '<div class="notice psy-ladder-warning">'+esc(d.warning)+'</div>';
}
function summary(a,notes){
 const z=scan(a);
 if(!z)return '<div class="psy-ladder-result"><h3>Результат</h3><span class="psy-data-state is-waiting" role="status">Данные не заполнены</span><p>Выберите, куда ребенок поставил себя. Дополнительные ответы можно оставить пустыми.</p></div>';
 const cells=FIELDS.map((f,i)=>'<div class="psy-ladder-stat"><span>'+esc(f[1])+'</span><strong>'+(z.steps[i]??"–")+(z.steps[i]!==null?' / 7':'')+'</strong>'+(i>0&&z.steps[i]!==null?'<small>К своей: '+(z.relative[f[0]]>=0?'+':'')+z.relative[f[0]]+'</small>':'')+'</div>').join("");
 const isComplete=Boolean(notes?.explanation?.trim());return '<div class="psy-ladder-result"><h3>Регистрация ответов</h3><span class="psy-data-state '+(isComplete?'is-ready':'is-waiting')+'" role="status">'+(isComplete?'Данные заполнены':'Не записано объяснение выбора')+'</span><div class="psy-ladder-stats">'+cells+'</div>'+
 '<p><strong>Объяснение ребенка:</strong> '+esc(notes?.explanation?.trim()||"Не записано")+'</p>'+
 '<div class="notice">Это описание ответов на конкретном бланке, а не психологический диагноз. Дополнительные беседы и наблюдения необходимы.</div></div>';
}
function calculator(d,ctx){
 const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],answers=r.answers||[],note=r.ladderNotes||{};
 let h='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ребенок</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа по кодам</button></div>'+
 '<div class="notice">Записывайте ступени по бланку: <strong>1 – нижняя, 7 – верхняя</strong>. Первый выбор обязателен. Дополнительные вопросы и предполагаемые оценки взрослых можно оставить без ответа.</div>';
 if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Участник<select id="participantSelect">'+rows.map((p,i)=>'<option value="'+i+'" '+(ctx.rowIndex===i?"selected":"")+'>'+(i+1)+'. '+esc(p.name||"Ученик "+(i+1))+'</option>').join("")+'</select></label><label>Код участника<input id="participantName" value="'+esc(r.name||"")+'" placeholder="Без ФИО"></label><button class="btn" id="addParticipant">Добавить</button></div>';
 h+='<div class="psy-ladder-selector">'+stepsSVG()+'</div><div class="psy-ladder-selects">'+FIELDS.map(([code,label,note],i)=>'<label class="psy-ladder-choice"><strong>'+esc(label)+'</strong><small>'+esc(note)+'</small><select data-ladder="'+i+'"><option value="">– Не указано –</option>'+[1,2,3,4,5,6,7].map(v=>'<option value="'+v+'" '+(String(answers[i])===String(v)?"selected":"")+'>'+v+'-я ступень</option>').join("")+'</select></label>').join("")+'</div>';
 h+='<h3>Беседа с ребенком</h3><div class="psy-ladder-notes">'+
 '<label>Дословное объяснение выбора<textarea data-ladder-text="explanation" rows="3" placeholder="Почему выбрана эта ступень">'+esc(note.explanation||"")+'</textarea></label>'+
 '<label>Колебания, эмоции, уточнения<textarea data-ladder-text="observations" rows="3" placeholder="Запись наблюдений психолога">'+esc(note.observations||"")+'</textarea></label>'+
 '<label>Оказанная помощь<select data-ladder-text="help">'+["Не требовалась","Повтор инструкции","Уточняющий вопрос","Затруднение, не завершено"].map(t=>'<option '+(note.help===t?"selected":"")+'>'+t+'</option>').join("")+'</select></label></div>';
 h+='<div id="ladderResult">'+summary(answers,note)+'</div><div class="psy-ladder-actions"><button class="btn" id="resetParticipant">Очистить запись</button><button class="btn primary" id="ladderJSON">Скачать индивидуальный протокол JSON</button></div>';
 if(ctx.calcMode==="class")h+='<h3>Сводка по группе</h3><div class="results-table"><table><thead><tr><th>Код</th><th>Сам</th><th>Желаемое</th><th>Мама</th><th>Папа</th><th>Педагог</th></tr></thead><tbody>'+rows.map((p,i)=>{const v=scan(p.answers);return '<tr><td>'+esc(p.name||"Ученик "+(i+1))+'</td>'+Array.from({length:5},(_,k)=>'<td>'+(v?.steps[k]??"–")+'</td>').join("")+'</tr>'}).join("")+'</tbody></table></div><div class="psy-ladder-actions"><button class="btn primary" id="ladderCSV">Скачать CSV группы</button></div>';
 return h;
}
function quoteCSV(v){let t=String(v??"");if(/^\s*[=+\-@]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"';}
function download(n,content,mime){const blob=new Blob([content],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function bind(d,ctx){
 const row=ctx.rows[ctx.rowIndex];row.ladderNotes||={};
 const update=()=>{const el=document.querySelector("#ladderResult");if(el)el.innerHTML=summary(row.answers,row.ladderNotes);};
 document.querySelectorAll("[data-ladder]").forEach(el=>el.addEventListener("change",()=>{row.answers[Number(el.dataset.ladder)]=el.value===""?"":Number(el.value);update();}));
 document.querySelectorAll("[data-ladder-text]").forEach(el=>el.addEventListener(el.tagName==="TEXTAREA"?"input":"change",()=>{row.ladderNotes[el.dataset.ladderText]=el.value;update();}));
 document.querySelector("#ladderJSON")?.addEventListener("click",()=>download("shchur_ladder_protocol.json",JSON.stringify({method:NAME,version:d.sourceVersion,code:row.name||"",answers:row.answers||[],explanation:row.ladderNotes||{},result:scan(row.answers),warning:d.warning},null,2),"application/json;charset=utf-8"));
 document.querySelector("#ladderCSV")?.addEventListener("click",()=>{const grid=[["Код","Сам","Желаемое","Мама (мнение ребенка)","Папа (мнение ребенка)","Педагог (мнение ребенка)"],...ctx.rows.map((p,i)=>[p.name||"Ученик "+(i+1),...Array.from({length:5},(_,k)=>allowed(p.answers?.[k])?p.answers[k]:"")])];download("shchur_ladder_group.csv","\uFEFF"+grid.map(x=>x.map(quoteCSV).join(";")).join("\r\n"),"text/csv;charset=utf-8");});
}
window.PSY_LADDER={scan,stepsSVG,instruction,materials,processing,calculator,bind};
})();