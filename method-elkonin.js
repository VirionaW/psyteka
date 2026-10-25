"use strict";
(function(){
const NAME="Графический диктант";
const REF="https://grafdiktant.ru/metodika-elkonina/";
const REF_PDF="https://grafdiktant.ru/wp-content/uploads/2019/11/metodika_ehlkonina.pdf";
const STAGES=[
 {name:"Тренировочный",start:5,moves:["↓1","→1","↑1","→1","↓1","→1","↑1","→1","↓1"],training:true},
 {name:"Узор 2",start:14,moves:["↑1","→1","↑1","→1","↓1","→1","↓1","→1","↑1","→1","↑1","→1"]},
 {name:"Узор 3",start:23,moves:["↑3","→1","↓2","→1","↑2","→1","↓3","→1","↑2","→1","↓2","→1","↑3"]},
 {name:"Узор 4",start:34,moves:["→3","↑1","←1","↑2","→3","↓2","←1","↓1","→3","↑1","←1","↑2"]}
];
const LABELS={ "↑":"вверх","↓":"вниз","←":"влево","→":"вправо"};
const WARNING="У методики существуют варианты диктовки, оформления бланков и нормативной интерпретации. Комплект использует четыре узора и подсчет 0-16 из указанного источника. Диапазоны уровней приводятся как ориентиры опубликованной версии, а не как универсальные возрастные нормы; обследование и выставление 0-4 баллов требует оценки специалиста.";
const d=window.PSY_FULL_METHODS[NAME]||{};
Object.assign(d,{
 author:"Д. Б. Эльконин",
 age:"Старший дошкольный и младший школьный возраст (по выбранной версии)",
 kind:"Графическая диагностическая проба",
 count:"4 узора: 1 тренировочный + 3 основных",
 goal:"Проверка умения внимательно следовать устной инструкции, ориентироваться на листе в клетку и самостоятельно продолжать закономерность.",
 instructions:"Предъявите лист с четырьмя стартовыми точками на клетчатом поле. Поясните стороны «вверх», «вниз», «вправо», «влево». Диктуйте каждый шаг с паузой; после завершения диктовки предложите ребенку самостоятельно продолжать узор. Первый узор тренировочный и не оценивается.",
 scoring:"Шесть экспертных оценок: под диктовку и самостоятельное продолжение узоров 2-4 (каждая от 0 до 4). Для каждого вида работы сумма = минимум из трех + максимум из трех, промежуточная оценка не учитывается. Общая сумма = сумма двух частей (0-16).",
 interpret:"По выбранному опубликованному варианту: 0-3 низкий; 4-6 ниже среднего; 7-10 средний; 11-13 выше среднего; 14-16 высокий показатель выполнения. Это ориентиры исполнения конкретной версии, не диагноз.",
 warning:WARNING,
 source:REF,
 sourcePDF:REF_PDF,
 guideFile:"downloads/elkonin_graphic_dictation_guide.docx",
 answerFile:"downloads/elkonin_graphic_dictation_student.html",
 sourceVersion:"Четыре узора; оценивание 0-4 за диктовку и продолжение; итог 0-16.",
 license:"Word содержит отдельное руководство психолога, буквальный порядок направлений и рабочий протокол. Печатный бланк с клетками и точками подготовлен Психотекой для этой процедуры.",
 scaleLabels:["Выполнение по инструкции","Самостоятельное продолжение узора"],
 calculator:true,
 graphic:"dictation",
 workflow:"elkonin4",
 patterns:STAGES.map((p,i)=>({title:i===0?"Узор 1 · тренировочный":p.name,training:!!p.training,moves:p.moves}))
});
window.PSY_FULL_METHODS[NAME]=d;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function level(n){return n<=3?"Низкий":n<=6?"Ниже среднего":n<=10?"Средний":n<=13?"Выше среднего":"Высокий";}
function score(answers){
 if(!Array.isArray(answers)||answers.length<6)return null;
 const a=answers.slice(0,6).map(v=>v===null||v===undefined||v===""?NaN:Number(v));
 if(a.some(v=>!Number.isInteger(v)||v<0||v>4))return null;
 const d=[a[0],a[2],a[4]],s=[a[1],a[3],a[5]];
 const dictated=Math.min(...d)+Math.max(...d);
 const self=Math.min(...s)+Math.max(...s);
 const raw=dictated+self;
 return {raw,max:16,dictated,self,level:level(raw),scores:a,caption:"Выполнение графического диктанта"};
}
function links(d){return '<div class="psy-elkonin-links"><a class="btn primary" href="'+esc(d.guideFile)+'" download>Методика и протокол · Word</a><a class="btn" href="'+esc(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Бланк ученика · A4 ↗</a><a class="btn" href="'+esc(d.sourcePDF)+'" target="_blank" rel="noopener noreferrer">Первоисточник PDF ↗</a></div>';}
function fullCommands(){
 return STAGES.map((p,i)=>'<section class="psy-elkonin-command"><h4>'+esc(i===0?"Узор 1 (тренировочный)":p.name)+'</h4><p>'+p.moves.map(t=>'<span>'+t.slice(1)+' '+LABELS[t[0]]+'</span>').join(' → ')+'</p></section>').join("");
}
function instruction(d){return '<h3>Инструкция психологу</h3><p>'+esc(d.instructions)+'</p>'+links(d)+'<h3>Последовательности команд</h3>'+fullCommands()+'<p>В тренировочном задании можно проверить понимание инструкции. Для трех оцениваемых узоров помогать воспроизвести линии нельзя. Между командами выдерживайте паузы, после каждой диктовки дайте время на продолжение.</p><div class="notice psy-elkonin-alert">'+esc(d.warning)+'</div>';}
function gridSVG(){let s='<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Клетчатый лист с четырьмя точками для графического диктанта" viewBox="0 0 720 780" preserveAspectRatio="xMidYMid meet">';
 s+='<rect x="0" y="0" width="720" height="780" fill="#fff"/>';
 for(let x=0;x<=720;x+=20)s+='<path d="M'+x+' 0V780" stroke="#bed5c6" stroke-width="0.8"/>';
 for(let y=0;y<=780;y+=20)s+='<path d="M0 '+y+'H720" stroke="#bed5c6" stroke-width="0.8"/>';
 STAGES.forEach((p,i)=>s+='<circle cx="80" cy="'+(p.start*20)+'" r="4.8" fill="#1c4032"/><text x="8" y="'+(p.start*20-12)+'" fill="#477a5d" font-size="12" font-family="Arial">'+(i+1)+'</text>');
 return s+'</svg>';}
function materials(d){return '<h3>Бланк ученика</h3><div class="notice">Начало каждого узора отмечено точкой. Четыре точки расположены одна под другой на клетчатом поле. <strong>Команды не должны быть напечатаны на листе ребенка.</strong></div>'+links(d)+'<div class="psy-elkonin-student">'+gridSVG()+'</div><p>На одном листе — четыре узора; первый тренировочный, основные 2-4. Печатайте без подгонки масштаба, лучше из отдельного файла A4.</p>';}
function processing(d){return '<h3>Правила оценивания</h3><p>Тренировочный узор не оценивается. У основных узоров две независимые оценки: диктовка и продолжение.</p>'+
 '<div class="psy-elkonin-rubric">'+[[4,"Точное воспроизведение"],[3,"Ошибка в одной линии"],[2,"Несколько ошибок"],[1,"Сходство отдельных элементов"],[0,"Сходство отсутствует"]].map(([n,l])=>'<div><b>'+n+'</b><span>'+esc(l)+'</span></div>').join('')+'</div>'+
 '<p><strong>Подсчет:</strong> минимум + максимум по трем диктовкам (0-8) и минимум + максимум по трем продолжениям (0-8). Сумма 0-16.</p>'+
 '<p><strong>Ориентиры выбранной версии:</strong> 0-3 — низкий, 4-6 — ниже среднего, 7-10 — средний, 11-13 — выше среднего, 14-16 — высокий. Это показатели исполнения пробы, не диагноз.</p>'+
 '<div class="notice psy-elkonin-alert">'+esc(d.warning)+'</div>'+links(d);}
function outcome(answers){
 const done=Array.from({length:6},(_,i)=>answers?.[i]).filter(v=>v!==""&&v!==undefined&&v!==null&&Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<=4).length;
 const z=score(answers);
 let h='<div class="psy-elkonin-outcome"><div class="psy-elkonin-progress"><strong>Оценено '+done+' из 6</strong><div class="psy-elkonin-track"><i style="width:'+(done/6*100)+'%"></i></div></div>';
 if(!z)return h+'<p>Для результата нужны шесть оценок (0-4): диктовка и продолжение для каждого из трех основных узоров. Пропуски не считаются нулем.</p></div>';
 return h+'<div class="psy-elkonin-score"><div><span>Итоговый показатель</span><b>'+z.raw+' / 16</b></div><div class="psy-elkonin-track"><i style="width:'+(z.raw/16*100)+'%"></i></div><p>'+z.level+' показатель выполнения (ориентир выбранной версии)</p></div>'+
 '<div class="psy-elkonin-components"><div><span>Работа по диктовке</span><strong>'+z.dictated+' / 8</strong></div><div><span>Самостоятельное продолжение</span><strong>'+z.self+' / 8</strong></div></div><div class="notice">Результат не заменяет наблюдение психолога и не является диагнозом.</div></div>';
}
function calculator(d,ctx){
 const people=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=people[ctx.rowIndex]||people[0],a=r.answers||[];
 let h='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ребенок</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Целый класс</button></div>';
 h+='<div class="notice">После проверки бумажной работы внесите шесть экспертных оценок. Первый узор тренировочный и <strong>не входит в сумму</strong>. Данные не отправляются на сервер.</div>';
 if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Участник<select id="participantSelect">'+people.map((q,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+(i+1)+'. '+esc(q.name||"Код "+(i+1))+'</option>').join("")+'</select></label><label>Имя или код<input id="participantName" value="'+esc(r.name||"")+'" placeholder="Лучше код"></label><button class="btn" id="addParticipant">Добавить</button></div>';
 h+='<div class="psy-elkonin-marks">'+Array.from({length:3},(_,i)=>'<div class="psy-elkonin-mark"><h4>Узор '+(i+2)+'</h4>'+["По диктовке","Продолжение самостоятельно"].map((label,j)=>'<label>'+esc(label)+'<select data-elkonin="'+(i*2+j)+'" aria-label="Узор '+(i+2)+', '+label+'"><option value="">— Не оценено —</option>'+[0,1,2,3,4].map(v=>'<option value="'+v+'" '+(String(a[i*2+j])===String(v)?"selected":"")+'>'+v+' — '+esc(["нет сходства","отдельные элементы","несколько ошибок","одна ошибка","точно"][v])+'</option>').join("")+'</select></label>').join("")+'</div>').join("")+'</div>';
 h+='<div id="elkoninOutcome">'+outcome(a)+'</div><div class="psy-elkonin-actions"><button class="btn" id="resetParticipant">Очистить оценки</button><button class="btn primary" id="elkoninJSON">Скачать индивидуальный результат</button></div>';
 if(ctx.calcMode==="class")h+='<h3>Результаты класса</h3><div class="results-table"><table><thead><tr><th>Код</th><th>Диктовка</th><th>Продолжение</th><th>Итог / 16</th></tr></thead><tbody>'+people.map((p,i)=>{const z=score(p.answers);return '<tr><td>'+esc(p.name||"Код "+(i+1))+'</td><td>'+(z?.dictated??"—")+'</td><td>'+(z?.self??"—")+'</td><td>'+(z?.raw??"—")+'</td></tr>'}).join("")+'</tbody></table></div><div class="psy-elkonin-actions"><button class="btn primary" id="elkoninCSV">Скачать таблицу класса CSV</button></div>';
 return h;
}
function csvSafe(v){let t=String(v??"");if(/^\s*[=+\-@]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"';}
function download(name,text,type){const b=new Blob([text],{type}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1500);}
function bind(d,ctx){
 document.querySelectorAll("[data-elkonin]").forEach(sel=>sel.addEventListener("change",()=>{ctx.rows[ctx.rowIndex].answers[+sel.dataset.elkonin]=sel.value===""?"":Number(sel.value);const box=document.querySelector("#elkoninOutcome");if(box)box.innerHTML=outcome(ctx.rows[ctx.rowIndex].answers);}));
 document.querySelector("#elkoninJSON")?.addEventListener("click",()=>{const r=ctx.rows[ctx.rowIndex];download("elkonin_graphic_dictation_result.json",JSON.stringify({method:NAME,version:d.sourceVersion,code:r.name||"",scores:r.answers||[],result:score(r.answers),source:d.source,warning:d.warning},null,2),"application/json;charset=utf-8");});
 document.querySelector("#elkoninCSV")?.addEventListener("click",()=>{const rows=[["Код","Диктовка 0-8","Продолжение 0-8","Итог 0-16"],...ctx.rows.map((r,i)=>{const z=score(r.answers);return [r.name||"Код "+(i+1),z?.dictated??"",z?.self??"",z?.raw??""]})];download("elkonin_graphic_dictation_class.csv","\uFEFF"+rows.map(r=>r.map(csvSafe).join(";")).join("\r\n"),"text/csv;charset=utf-8");});
}
window.PSY_ELKONIN={score,level,gridSVG,stages:STAGES,instruction,materials,processing,calculator,bind};
})();