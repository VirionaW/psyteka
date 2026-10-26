"use strict";
(function(){
const NAME="Простые аналогии (словесно-логическое мышление)";
const TASKS=[
 ["Птица : гнездо = пчела : ?",["цветок","улей","крыло","луг"],1,"место обитания"],
 ["Художник : кисть = плотник : ?",["молоток","картина","рама","краска"],0,"профессия — инструмент"],
 ["Холодный : горячий = высокий : ?",["длинный","ровный","низкий","большой"],2,"противоположные признаки"],
 ["Дерево : лес = звезда : ?",["телескоп","вечер","планета","созвездие"],3,"элемент — совокупность"],
 ["Молоток : забивать = ножницы : ?",["шить","резать","складывать","красить"],1,"предмет — действие"],
 ["Книга : страница = поезд : ?",["станция","дорога","вагон","билет"],2,"целое — составная часть"],
 ["Молоко : корова = шерсть : ?",["овца","поле","шарф","нитка"],0,"продукт — источник"],
 ["Утро : вечер = начало : ?",["день","путь","середина","конец"],3,"противоположные по смыслу понятия"],
 ["Цветок : лепесток = дерево : ?",["лес","ветка","земля","сад"],1,"целое — его элемент"],
 ["Сапог : нога = перчатка : ?",["рука","шея","ступня","плечо"],0,"предмет одежды — часть тела"],
 ["Учитель : школа = врач : ?",["лекарство","палата","больница","термометр"],2,"профессия — место работы"],
 ["Рыба : вода = верблюд : ?",["остров","зоопарк","река","пустыня"],3,"животное — типичная среда обитания"]
].map(([question,options,key,relation],i)=>({id:i+1,question,options,key,relation}));
const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const CH=["А","Б","В","Г"];
function score(answers){const selected=TASKS.map((t,i)=>Number.isInteger(answers?.[i])&&answers[i]>=0&&answers[i]<=3?answers[i]:null);let correct=0,filled=0;const byType={};TASKS.forEach((t,i)=>{const k=selected[i];byType[t.relation]??={correct:0,total:0};if(k!==null){filled++;byType[t.relation].total++;if(k===t.key){correct++;byType[t.relation].correct++;}}});return {correct,filled,complete:filled===TASKS.length,byType,selected};}
window.PSY_FULL_METHODS[NAME]={
author:"Классическая проба словесных аналогий · задания Психотеки",
age:"Ориентировочно с 10 лет",
kind:"Диагностическая проба на словесно-логические отношения",
count:"12 заданий",
goal:"Исследование словесно-логического мышления: установление отношений и подбор аналогий между понятиями.",
instructions:"В левой паре два слова связаны между собой. Выбери слово справа, которое так же связано с третьим словом. В каждом задании один наиболее подходящий ответ. Не угадывай по похожести звучания.",
questions:TASKS.map(x=>x.question),options:CH,
scoring:"Каждое правильное решение — 1 балл по авторскому ключу; неправильное — 0. При неполном заполнении итог из 12 не рассчитывается. Отдельно фиксируются выбранные ответы, виды отношений, пояснения, самокоррекция, помощь и время, если его отмечали.",
interpret:"Итог 0–12 (только если ответили на все задания) описывает число верно решённых задач этого набора. Не сопоставлять с нормативными уровнями опубликованных версий «Простых аналогий»: вопросы и сложность здесь иные.",
source:"https://psy.wikireading.ru/7528",
license:"Общая схема классической пробы подтверждена опубликованными методическими пособиями. Все 12 вопросов и ключ составлены Психотекой заново; это не стандартизированная адаптация и не авторская норма.",
workflow:"simpleAnalogies12",calculator:true,
guideFile:"downloads/analogies_guide.html",answerFile:"downloads/analogies_blank.html",processingFile:"downloads/analogies_scoring.html",stimulusFile:"downloads/analogies_examiners_key.html",
indicators:["Аналогии на противоположность","Связи целого и части","Род деятельности и орудия","Связь источника и продукта","Обоснование и самокоррекция"]
};
function instruction(d){
const key='<table class="questions-table"><thead><tr><th>№</th><th>Правильный ответ</th><th>Отношение</th></tr></thead><tbody>'+
 TASKS.map(t=>'<tr><td>'+t.id+'</td><td><b>'+CH[t.key]+') '+E(t.options[t.key])+'</b></td><td>'+E(t.relation)+'</td></tr>').join("")+'</tbody></table>';
const tasks=TASKS.map(t=>'<div class="question"><p><strong>'+t.id+'. '+E(t.question)+'</strong></p><p>'+t.options.map((o,i)=>CH[i]+') '+E(o)).join(' · ')+'</p></div>').join("");
return '<section class="psy-mspss-section psy-mspss-manual">'+
 '<div class="psy-mspss-manual-bar"><div><h3>Методика и руководство</h3><p>Полный набор заданий, ключ, обработка и интерпретация.</p></div><div class="psy-mspss-manual-actions"><a class="btn primary" href="'+E(d.guideFile)+'?v=20261026complete2" target="_blank" rel="noopener noreferrer">Посмотреть и распечатать ↗</a></div></div>'+
 '<h3>Цель</h3><p>'+E(d.goal)+'</p>'+
 '<h3>Описание методики</h3><p>Классическая проба на установление словесных отношений и перенос аналогии: 12 заданий, в каждом четыре варианта. Задания Психотеки составлены самостоятельно и не имеют возрастных нормативов.</p>'+
 '<h3>Инструкция ребёнку</h3><div class="psy-mspss-script">«'+E(d.instructions)+'»</div>'+
 '<h3>Порядок проведения</h3><ol><li>Покажите тренировочную пару: «кошка : котёнок = собака : щенок»; тренировочный ответ не оценивается.</li><li>Предъявляйте 12 заданий по порядку; ребёнок выбирает один ответ А, Б, В или Г. При трудностях чтения зачитывайте без подсказок.</li><li>Запишите ответы, объяснения, ошибки и помощь. Не раскрывайте ключ во время проведения.</li><li>При неполном протоколе оставьте пропуск, не считайте его ошибкой.</li></ol>'+
 '<h3>Задания методики</h3>'+tasks+
 '<h3>Ключ</h3>'+key+
 '<h3>Подсчёт</h3><p>'+E(d.scoring)+'</p><p>Полные 12 ответов: 0–12 правильных. Если есть пропуск, итоговый балл не рассчитывается. Пример: при 12 ответах и 9 верных — 9 из 12.</p>'+
 '<h3>Интерпретация</h3><p>'+E(d.interpret)+'</p><p>Оцените типы ошибок, пояснения ребёнка и самостоятельность рассуждений. Диагноз и возрастные категории по данной редакции не устанавливаются.</p>'+
 '</section>';
}
function materials(d){
return '<section class="psy-mspss-section psy-mspss-student">'+
 '<div class="psy-mspss-blank-head"><div><h3>Бланк ученика</h3><p>12 заданий с вариантами ответов.</p></div><a class="btn primary psy-mspss-view" href="'+E(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Посмотреть и распечатать ↗</a></div>'+
 '<p><strong>Инструкция.</strong> '+E(d.instructions)+'</p>'+
 '<div class="psy-mspss-blank-scroll">'+TASKS.map(t=>'<div class="question"><p><strong>'+t.id+'. '+E(t.question)+'</strong></p><p>'+t.options.map((o,i)=>CH[i]+') '+E(o)).join(' · ')+'</p></div>').join("")+'</div>'+
 '</section>';
}
function processing(d){return '<h3>Ключ и подсчёт</h3><p>'+E(d.scoring)+'</p><table class="questions-table"><thead><tr><th>№</th><th>Верный ответ</th><th>Вид отношения</th></tr></thead><tbody>'+TASKS.map(t=>'<tr><td>'+t.id+'</td><td>'+CH[t.key]+') '+E(t.options[t.key])+'</td><td>'+E(t.relation)+'</td></tr>').join('')+'</tbody></table><p>'+E(d.interpret)+'</p><p>Пример: 12 предъявлено, 9 верных → 9 из 12; 11 предъявлено, 9 верных → итог не вычислять.</p><a href="'+d.processingFile+'" target="_blank" rel="noopener noreferrer">Лист обработки А4</a>';}
function report(a){const s=score(a);return '<h3>Результат</h3><p>Заполнено: <b>'+s.filled+' из '+TASKS.length+'</b>. Правильных среди заполненных: '+s.correct+'.</p><p><b>Итог:</b> '+(s.complete?s.correct+' из '+TASKS.length:'не рассчитывается: остались пропуски')+'</p><p>Анализ отношений: '+Object.entries(s.byType).map(([k,v])=>E(k)+' — '+v.correct+'/'+v.total+' выполненных').join('; ')+'.</p><div class="notice">Это качественный показатель на материалах Психотеки, не возрастная нормативная оценка.</div>';}
function calculator(d,ctx){const r=ctx.rows[ctx.rowIndex]||{answers:[]},a=r.answers||[];return '<h3>Интерактивная проверка 12 аналогий</h3><p>Внесите буквы ответов обследуемого. Не заполняйте пропущенный ответ нулём.</p>'+TASKS.map((t,i)=>'<label style="display:block;margin:12px 0"><b>'+t.id+'. '+E(t.question)+'</b><select data-analogy="'+i+'" style="display:block;min-width:220px;max-width:100%;margin-top:5px"><option value="">Нет ответа</option>'+t.options.map((v,j)=>'<option value="'+j+'"'+(a[i]===j?' selected':'')+'>'+CH[j]+') '+E(v)+'</option>').join('')+'</select></label>').join('')+'<section id="analogyResult" aria-live="polite">'+report(a)+'</section>';}
function bind(d,ctx){const r=ctx.rows[ctx.rowIndex];if(!r)return;r.answers??=[];document.querySelectorAll("[data-analogy]").forEach(e=>e.addEventListener("change",()=>{r.answers[+e.dataset.analogy]=e.value===""?null:Number(e.value);document.getElementById("analogyResult").innerHTML=report(r.answers)}));}
window.PSY_ANALOGIES={TASKS,score,instruction,materials,processing,calculator,bind};
})();