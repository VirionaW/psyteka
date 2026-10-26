"use strict";
(function(){
const NAME="Простые аналогии (словесно-логическое мышление)";
const TASKS=[
 ["Птица : гнездо = пчела : ?",["цветок","улей","крыло","луг"],1,"место обитания"],
 ["Художник : кисть = плотник : ?",["молоток","картина","рама","краска"],0,"профессия - инструмент"],
 ["Холодный : горячий = высокий : ?",["длинный","ровный","низкий","большой"],2,"противоположные признаки"],
 ["Дерево : лес = звезда : ?",["телескоп","вечер","планета","созвездие"],3,"элемент - совокупность"],
 ["Молоток : забивать = ножницы : ?",["шить","резать","складывать","красить"],1,"предмет - действие"],
 ["Книга : страница = поезд : ?",["станция","дорога","вагон","билет"],2,"целое - составная часть"],
 ["Молоко : корова = шерсть : ?",["овца","поле","шарф","нитка"],0,"продукт - источник"],
 ["Утро : вечер = начало : ?",["день","путь","середина","конец"],3,"противоположные по смыслу понятия"],
 ["Цветок : лепесток = дерево : ?",["лес","ветка","земля","сад"],1,"целое - его элемент"],
 ["Сапог : нога = перчатка : ?",["рука","шея","ступня","плечо"],0,"предмет одежды - часть тела"],
 ["Учитель : школа = врач : ?",["лекарство","палата","больница","термометр"],2,"профессия - место работы"],
 ["Рыба : вода = верблюд : ?",["остров","зоопарк","река","пустыня"],3,"животное - типичная среда обитания"]
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
scoring:"Каждое правильное решение - 1 балл по авторскому ключу; неправильное - 0. При неполном заполнении итог из 12 не рассчитывается. Отдельно фиксируются выбранные ответы, виды отношений, пояснения, самокоррекция, помощь и время, если его отмечали.",
interpret:"Итог 0 - 12 (только если ответили на все задания) описывает число верно решенных задач этого набора. Не сопоставлять с нормативными уровнями опубликованных версий «Простых аналогий»: вопросы и сложность здесь иные.",
source:"https://psy.wikireading.ru/7528",
license:"Общая схема классической пробы подтверждена опубликованными методическими пособиями. Все 12 вопросов и ключ составлены Психотекой заново; это не стандартизированная адаптация и не авторская норма.",
workflow:"simpleAnalogies12",calculator:true,
guideFile:"downloads/analogies_guide.html",guideWithBlankFile:"downloads/analogies_with_blank.html",answerFile:"downloads/analogies_blank.html",processingFile:"downloads/analogies_scoring.html",stimulusFile:"downloads/analogies_examiners_key.html",
indicators:["Аналогии на противоположность","Связи целого и части","Род деятельности и орудия","Связь источника и продукта","Обоснование и самокоррекция"]
};
function instruction(d){
 const key='<div class="psy-analogies-key-grid" role="list" aria-label="Ключ простых аналогий">'+
 TASKS.map(t=>'<div class="psy-analogies-key-cell" role="listitem"><span class="psy-analogies-key-num">№ '+t.id+'</span><strong class="psy-analogies-key-letter">'+CH[t.key]+'</strong><span class="psy-analogies-key-relation">'+E(t.relation)+'</span></div>').join("")+'</div>';
 const html='<section class="psy-mspss-section psy-mspss-manual">'+
 '<div class="psy-mspss-manual-bar"><div><h3>Методика и руководство</h3></div><div class="psy-mspss-manual-actions"><a class="btn" href="'+E(d.guideFile)+'?v=20261026separate1" target="_blank" rel="noopener noreferrer">Без бланка ↗</a><a class="btn primary" href="'+E(d.guideWithBlankFile)+'?v=20261026separate1" target="_blank" rel="noopener noreferrer">С бланком ↗</a></div></div>'+
 '<h3>Цель</h3><p>'+E(d.goal)+'</p>'+
 '<h3>Описание методики</h3><p>Словесно-логическая диагностическая проба из 12 заданий, каждое с четырьмя вариантами ответа. Участник выявляет отношение между двумя словами и переносит его на другую пару. Рабочая серия составлена для Психотеки без возрастных нормативов.</p>'+
 '<h3>Порядок проведения</h3><ol><li>Объясните принцип аналогии на отдельном простом примере, не входящем в диагностический набор. Ответ на тренировку не учитывается.</li><li>Предложите 12 заданий по порядку. Участник выбирает один из вариантов А, Б, В или Г.</li><li>При затруднениях чтения специалист может произнести задание без подсказки правильного ответа.</li><li>Фиксируйте выбранные варианты, обоснования, помощь и самокоррекцию. Отсутствующие ответы оставляйте пропущенными.</li></ol>'+
 '<h3>Инструкция для участника</h3><div class="psy-mspss-script">«'+E(d.instructions)+'»</div>'+
 '<h3>Ключ</h3><p>Правильные буквы ответов приводятся без самих заданий и вариантов. Стимульный материал находится в бланке, а не в руководстве.</p>'+key+
 '<h3>Подсчет</h3><p>Каждый правильный вариант - 1 балл; неверный ответ - 0 баллов. Полная сумма от 0 до 12 рассчитывается только при ответах на все двенадцать заданий. Пропуски не заменяются нулями.</p>'+
 '<h3>Интерпретация</h3><p>'+E(d.interpret)+'</p><p>Отмечайте типы смысловых отношений, характер ошибок, пояснения и самостоятельность решения. Нормативные уровни опубликованных версий не используются.</p>'+
 '</section>';
 return html;
}
function materials(d){
return '<section class="psy-mspss-section psy-mspss-student">'+
 '<div class="psy-mspss-blank-head"><div><h3>Бланк ученика</h3><p>12 заданий с вариантами ответов.</p></div><a class="btn primary psy-mspss-view" href="'+E(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Посмотреть и распечатать ↗</a></div>'+
 '<p><strong>Инструкция.</strong> '+E(d.instructions)+'</p>'+
 '<div class="psy-mspss-blank-scroll">'+TASKS.map(t=>'<div class="question"><p><strong>'+t.id+'. '+E(t.question)+'</strong></p><p>'+t.options.map((o,i)=>CH[i]+') '+E(o)).join(' · ')+'</p></div>').join("")+'</div>'+
 '</section>';
}
function processing(d){return '<h3>Ключ и подсчет</h3><p>'+E(d.scoring)+'</p><table class="questions-table"><thead><tr><th>№</th><th>Верный ответ</th><th>Вид отношения</th></tr></thead><tbody>'+TASKS.map(t=>'<tr><td>'+t.id+'</td><td>'+CH[t.key]+') '+E(t.options[t.key])+'</td><td>'+E(t.relation)+'</td></tr>').join('')+'</tbody></table><p>'+E(d.interpret)+'</p><p>Пример: 12 предъявлено, 9 верных → 9 из 12; 11 предъявлено, 9 верных → итог не вычислять.</p><a href="'+d.processingFile+'" target="_blank" rel="noopener noreferrer">Лист обработки А4</a>';}
function report(a){const s=score(a);return '<h3>Результат</h3><p>Заполнено: <b>'+s.filled+' из '+TASKS.length+'</b>. Правильных среди заполненных: '+s.correct+'.</p><p><b>Итог:</b> '+(s.complete?s.correct+' из '+TASKS.length:'не рассчитывается: остались пропуски')+'</p><p>Анализ отношений: '+Object.entries(s.byType).map(([k,v])=>E(k)+' - '+v.correct+'/'+v.total+' выполненных').join('; ')+'.</p><div class="notice">Это качественный показатель на материалах Психотеки, не возрастная нормативная оценка.</div>';}
function calculator(d,ctx){const r=ctx.rows[ctx.rowIndex]||{answers:[]},a=r.answers||[];return '<h3>Интерактивная проверка 12 аналогий</h3><p>Внесите буквы ответов обследуемого. Не заполняйте пропущенный ответ нулем.</p>'+TASKS.map((t,i)=>'<label style="display:block;margin:12px 0"><b>'+t.id+'. '+E(t.question)+'</b><select data-analogy="'+i+'" style="display:block;min-width:220px;max-width:100%;margin-top:5px"><option value="">Нет ответа</option>'+t.options.map((v,j)=>'<option value="'+j+'"'+(a[i]===j?' selected':'')+'>'+CH[j]+') '+E(v)+'</option>').join('')+'</select></label>').join('')+'<section id="analogyResult" aria-live="polite">'+report(a)+'</section>';}
function bind(d,ctx){const r=ctx.rows[ctx.rowIndex];if(!r)return;r.answers??=[];document.querySelectorAll("[data-analogy]").forEach(e=>e.addEventListener("change",()=>{r.answers[+e.dataset.analogy]=e.value===""?null:Number(e.value);document.getElementById("analogyResult").innerHTML=report(r.answers)}));}
window.PSY_ANALOGIES={TASKS,score,instruction,materials,processing,calculator,bind};
})();