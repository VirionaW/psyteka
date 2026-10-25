"use strict";
(function(){
const NAME="Методика классификации предметов";
const SOURCE="https://psyjournals.ru/journals/psyedu/archive/2025_n4/Boryakova_Fedorov";
const CONTEXT="https://www.psychiatry.ru/lib/1/book/87/chapter/3";
const LABELS=["Птицы","Рыбы","Посуда","Мебель"];
const SECOND=["живое","неживое"];
const MAP={"Птицы":"живое","Рыбы":"живое","Посуда":"неживое","Мебель":"неживое"};
const NOTES=[
["explain","Как ребенок назвал четыре группы","Обобщающие слова, дословные пояснения"],
["strategy","Стратегия классификации","По существенному признаку, ситуативно, по внешнему сходству, другой принцип"],
["stage2","Объяснение объединения в две группы","Что объединяет птиц и рыб, посуду и мебель"],
["help","Потребовалась ли организующая помощь","Что сделал психолог, как ребенок отреагировал"],
["changes","Исправления, перестановки, сомнения","Самокоррекция и устойчивость выбранного принципа"],
["identification","Неузнанные или неверно названные картинки","Что именно вызвало трудность распознавания"],
["other","Дополнительные наблюдения","Темп, внимание, мотивация, эмоциональная реакция"]
];
const CAUTION="Используется авторский набор Психотеки из 16 оригинальных векторных карточек, иллюстрирующий задание IV публикации Н. Ю. Боряковой и В. В. Федорова (2025). Он НЕ тождественен оригинальным стимульным картинкам исследования, классическому набору С. Я. Рубинштейн (~70 карточек) или «Детской предметной классификации» Н. Я. и М. М. Семаго. Опубликованные станайны и возрастные нормы перенести на эту версию нельзя. Согласованность распределения с четырьмя предметными группами — описательная проверка, не диагностический индекс интеллекта.";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cards=()=>window.PSY_OBJECT_CARDS.items;
const cardSvg=item=>window.PSY_OBJECT_CARDS.svg(item);
const d=window.PSY_FULL_METHODS[NAME]||{};
Object.assign(d,{
 author:"Предметная классификация: С. Я. Рубинштейн, Б. В. Зейгарник; краткий вариант по заданию У. В. Ульенковой в модификации Н. Ю. Боряковой",
 age:"Проба в выбранной схеме рассчитана преимущественно на 6–7 лет; нормативы к новому набору карточек не применяются",
 kind:"Предметная диагностическая проба мышления",
 count:"16 предметных картинок (4 группы по 4), затем объединение четырёх групп в две",
 goal:"Качественное наблюдение за предметным обобщением, выбором категорий, объяснениями и потребностью в организующей помощи.",
 instructions:"Вырежьте 16 карточек из трех листов А4. Разложите перед ребёнком вперемешку лицевой стороной вверх. Спросите, знакомы ли ему предметы. Предложите разложить на четыре группы так, чтобы вещи в каждой подходили друг другу и их можно было назвать одним словом. Попросите объяснить четыре группировки. При затруднении можно предъявить один пример для продолжения, обязательно отметив помощь. Затем попросите объединить полученные четыре группы в две большие — по принципу «живое/неживое», не называя эти слова вместо ребенка. Запишите его объяснение.",
 scoring:"В протоколе отметьте для каждой из 16 карточек ту группу, куда её реально поместил ребёнок, и для каждой из четырёх сформированных групп — более широкое объединение. При полностью выполненном первом этапе можно посчитать число совпадений с четырьмя предметными группами (0–16); для второго — совпадения с разделением на живое и неживое (0–4). Это технические числа, не опубликованная шкала. Обязательно фиксируйте объяснения и помощь.",
 interpret:"Признаки классификации, стратегия, спонтанность, переименования, объяснения, помощь и распознавание изображений важнее одного технического количества совпадений. Опубликованные нормы комплексной методики на этот самостоятельный набор переносить нельзя.",
 warning:CAUTION,source:SOURCE,sourceContext:CONTEXT,officialBlank:SOURCE,
 guideFile:"downloads/object_classification_guide.docx",
 answerFile:"downloads/object_classification_16_cards.html",
 workflow:"objectClass16",calculator:true,graphic:"cards",
 scaleLabels:["Классификация 16 карточек на четыре группы","Объединение четырех групп в две","Объяснения и организующая помощь","Характер стратегии и самокоррекция"],
 questions:["Разложи по четырем группам","Объясни, как назвал группы","Объедини в две более общие группы","Объясни второе объединение"]
});
window.PSY_FULL_METHODS[NAME]=d;
const groupSet=new Set([...LABELS,"Другое"]);
const stage2Set=new Set([...SECOND,"Другое"]);
function score(d,a){
 const entries=cards().map((it,i)=>groupSet.has(a?.[i])?a[i]:null);
 const stage2=LABELS.map((category,i)=>stage2Set.has(a?.[16+i])?a[16+i]:null);
 const placed=entries.filter(Boolean).length,matched=entries.filter((v,i)=>v===cards()[i].group).length;
 const merged=stage2.filter(Boolean).length,mergeMatched=stage2.filter((v,i)=>v===MAP[LABELS[i]]).length;
 if(!placed&&!merged)return null;
 return {mode:"descriptive",stage1:{placed,matched,complete:placed===16},
  stage2:{placed:merged,matched:mergeMatched,complete:merged===4},
  categories:entries,mergedGroups:stage2,caption:"Технические совпадения с выбранным набором, без стандартизированной шкалы"};
}
function links(d){return '<div class="psy-objects-links"><a class="btn primary" href="'+esc(d.guideFile)+'" download>Руководство и протокол · Word</a><a class="btn" href="'+esc(d.answerFile)+'" target="_blank" rel="noopener noreferrer">16 карточек · 3 листа А4 ↗</a><a class="btn" href="'+esc(d.source)+'" target="_blank" rel="noopener noreferrer">Исследование и инструкция ↗</a></div>';}
function instruction(d){return '<h3>Проведение</h3><p>'+esc(d.instructions)+'</p>'+links(d)+
'<h3>Этапы</h3><ol><li>Подготовьте 16 вырезанных карточек, проверьте узнавание изображений.</li><li>Предложите распределить все картинки по четырем группам. Записывайте их реальные составы, названия и объяснения.</li><li>Если потребуется, предложите образец для одной группы. Важно записать, какая помощь оказана.</li><li>Предложите объединить четыре группы в две более общие, и попросите объяснить принцип.</li></ol>'+
'<div class="notice psy-objects-warning">'+esc(d.warning)+'</div>';}
function materials(d){return '<h3>Стимульные карточки</h3><p>Три печатных листа А4 с 16 карточками единого стиля. На карточке для ребёнка нет названия и категории: только рисунок и код.</p>'+links(d)+
'<div class="psy-objects-preview">'+cards().map(it=>'<div class="psy-objects-card"><small>'+it.id+'</small>'+cardSvg(it)+'</div>').join("")+'</div>'+
'<p>На карточках используются вновь созданные иллюстрации Психотеки. Они не заменяют стандартизированный первичный стимульный комплект.</p>';}
function processing(d){return '<h3>Правила обработки</h3><p>'+esc(d.scoring)+'</p>'+
'<div class="psy-objects-legend"><div><b>16</b><span>карточек в 4 группах</span></div><div><b>4</b><span>категории второго этапа</span></div><div><b>Нет нормы</b><span>только описательное совпадение</span></div></div>'+
'<h3>Необходимо отметить</h3><p>Обобщающие слова ребёнка, его фактические раскладки, ошибки узнавания, уровень самостоятельности и изменения стратегии. Отсутствие записи не равно ошибке.</p>'+
'<div class="notice psy-objects-warning">'+esc(d.warning)+'</div>'+links(d);}
function report(a,n){
 const s=score(d,a),written=NOTES.filter(([k])=>String(n?.[k]||"").trim()).length;
 return '<section class="psy-objects-results"><h3>Сводка регистрации</h3>'+
 (s?'<div class="psy-objects-stats"><div><span>Этап 1: заполнено</span><strong>'+s.stage1.placed+' / 16</strong></div><div><span>Совпало по предметным категориям</span><strong>'+(s.stage1.complete?s.stage1.matched+' / 16':"не завершено")+'</strong></div><div><span>Этап 2: заполнено</span><strong>'+s.stage2.placed+' / 4</strong></div><div><span>Совпало живое / неживое</span><strong>'+(s.stage2.complete?s.stage2.matched+' / 4':"не завершено")+'</strong></div></div>':
 '<p>Карточки ещё не зарегистрированы. Пустые позиции не считаются ошибками.</p>')+
 '<p>Заполнено качественных наблюдений: <strong>'+written+' из '+NOTES.length+'</strong>.</p>'+
 '<div class="notice">Не применяйте статистические нормы опубликованной методики к данному набору векторных карточек.</div></section>';
}
function groupRows(rows){
 return rows.map((r,i)=>{const s=score(d,r.answers),n=r.objectClassNotes||{};return '<tr><td>'+esc(r.name||"Код "+(i+1))+'</td><td>'+(s?.stage1.placed??0)+'/16</td><td>'+(s?.stage1.complete?s.stage1.matched+"/16":"—")+'</td><td>'+(s?.stage2.placed??0)+'/4</td><td>'+(s?.stage2.complete?s.stage2.matched+"/4":"—")+'</td><td>'+NOTES.filter(([k])=>String(n[k]||"").trim()).length+'</td></tr>'}).join("");
}
function calculator(d,ctx){
 const all=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=all[ctx.rowIndex]||all[0],a=r.answers||[],notes=r.objectClassNotes||{};
 let html='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ребёнок</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа по кодам</button></div>'+
 '<div class="notice">Отмечайте фактический выбор ребёнка без подсказок. Визуальные категории показаны психологу, а ребёнку предъявляются только напечатанные карточки без названий.</div>';
 if(ctx.calcMode==="class")html+='<div class="group-tools"><label>Участник<select id="participantSelect">'+all.map((p,i)=>'<option value="'+i+'" '+(ctx.rowIndex===i?"selected":"")+'>'+(i+1)+'. '+esc(p.name||"Код "+(i+1))+'</option>').join("")+'</select></label><label>Код<input id="participantName" value="'+esc(r.name||"")+'" placeholder="Без ФИО"></label><button class="btn" id="addParticipant">Добавить</button></div>';
 html+='<h3>Этап 1 · 16 карточек в четыре группы</h3><div class="psy-objects-register">'+cards().map((it,i)=>'<label class="psy-objects-register-item"><div class="psy-objects-register-art">'+cardSvg(it)+'</div><span>'+it.id+'</span><select data-obj-card="'+i+'" aria-label="Группа карточки '+it.id+'"><option value="">— Не распределено —</option>'+[...LABELS,"Другое"].map(g=>'<option value="'+g+'" '+(a[i]===g?"selected":"")+'>'+esc(g)+'</option>').join("")+'</select></label>').join("")+'</div>';
 html+='<h3>Этап 2 · четыре группы объединяются в две</h3><p>Запишите, к какой широкой группе ребёнок отнёс каждую ранее сформированную предметную категорию. «Другое» означает иную классификацию и должно быть пояснено.</p><div class="psy-objects-second">'+LABELS.map((name,i)=>'<label><strong>'+name+'</strong><select data-obj-second="'+i+'"><option value="">— Не объединено —</option>'+[...SECOND,"Другое"].map(g=>'<option value="'+g+'" '+(a[16+i]===g?"selected":"")+'>'+esc(g)+'</option>').join("")+'</select></label>').join("")+'</div>';
 html+='<h3>Наблюдения специалиста</h3><div class="psy-objects-notes">'+NOTES.map(([key,label,hint])=>'<label><strong>'+esc(label)+'</strong><small>'+esc(hint)+'</small><textarea rows="3" data-obj-note="'+key+'" placeholder="Дословная запись или наблюдение">'+esc(notes[key]||"")+'</textarea></label>').join("")+'</div>';
 html+='<div id="objectsResult">'+report(a,notes)+'</div><div class="psy-objects-actions"><button class="btn" id="resetParticipant">Очистить запись</button><button class="btn primary" id="objectJSON">Скачать индивидуальный протокол JSON</button></div>';
 if(ctx.calcMode==="class")html+='<h3>Сводка группы</h3><p>В CSV и групповой таблице нет личных объяснений детей.</p><div class="results-table"><table><thead><tr><th>Код</th><th>Распределено</th><th>Совпало</th><th>Этап 2</th><th>Совпало</th><th>Записей</th></tr></thead><tbody id="objectsGroupRows">'+groupRows(all)+'</tbody></table></div><div class="psy-objects-actions"><button class="btn primary" id="objectCSV">Скачать сводку CSV</button></div>';
 return html;
}
function csv(x){let s=String(x??"");if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
function dl(name,txt,mime){const blob=new Blob([txt],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function bind(d,ctx){
 const r=ctx.rows[ctx.rowIndex];r.objectClassNotes||={};
 const redraw=()=>{const box=document.getElementById("objectsResult");if(box)box.innerHTML=report(r.answers,r.objectClassNotes);const grp=document.getElementById("objectsGroupRows");if(grp)grp.innerHTML=groupRows(ctx.rows);};
 document.querySelectorAll("[data-obj-card]").forEach(el=>el.addEventListener("change",()=>{r.answers[Number(el.dataset.objCard)]=el.value;redraw();}));
 document.querySelectorAll("[data-obj-second]").forEach(el=>el.addEventListener("change",()=>{r.answers[16+Number(el.dataset.objSecond)]=el.value;redraw();}));
 document.querySelectorAll("[data-obj-note]").forEach(el=>el.addEventListener("input",()=>{r.objectClassNotes[el.dataset.objNote]=el.value;redraw();}));
 document.getElementById("objectJSON")?.addEventListener("click",()=>dl("object_classification_protocol.json",JSON.stringify({method:NAME,version:"working 16 SVG-card variant / 4-to-2 grouping",code:r.name||"",cards:cards().map((it,i)=>({id:it.id,name:it.name,assigned:r.answers?.[i]||null})),largeGroups:LABELS.map((g,i)=>({name:g,assigned:r.answers?.[16+i]||null})),notes:r.objectClassNotes,result:score(d,r.answers),warning:d.warning},null,2),"application/json;charset=utf-8"));
 document.getElementById("objectCSV")?.addEventListener("click",()=>{const result=[["Код","Этап 1: распределено","Этап 1: совпало","Этап 2: распределено","Этап 2: совпало","Записей"],...ctx.rows.map((p,i)=>{const z=score(d,p.answers),notes=p.objectClassNotes||{};return[p.name||"Код "+(i+1),z?.stage1.placed??0,z?.stage1.complete?z.stage1.matched:"",z?.stage2.placed??0,z?.stage2.complete?z.stage2.matched:"",NOTES.filter(([k])=>String(notes[k]||"").trim()).length]})];dl("object_classification_group.csv","\uFEFF"+result.map(row=>row.map(csv).join(";")).join("\r\n"),"text/csv;charset=utf-8");});
}
window.PSY_OBJECT_CLASSIFY={score,instruction,materials,processing,calculator,bind,notes:NOTES,categories:LABELS};
})();