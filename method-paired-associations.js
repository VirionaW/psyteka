"use strict";
(function(){
const NAME="Парные ассоциации (смысловая и механическая память)";
const GROUPS=[
 {code:"related",title:"Смысловые пары",description:"Связанные по смыслу слова",items:[["ключ","замок"],["письмо","конверт"],["сосна","иголка"],["часы","время"],["пчела","мёд"],["поезд","рельсы"],["дождь","зонт"],["музыка","нота"],["снег","снеговик"],["корабль","якорь"]]},
 {code:"unrelated",title:"Несвязанные пары",description:"Слова без очевидной смысловой связи",items:[["зеркало","ракета"],["носок","облако"],["кнопка","лиса"],["груша","лестница"],["ручей","шкаф"],["обруч","морковь"],["заяц","фонарь"],["вилка","остров"],["перо","трактор"],["банан","телефон"]]}
];
const E=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function outcomes(answers){return GROUPS.map(g=>{let correct=0,wrong=0,missing=0;g.items.forEach((_,i)=>{const a=answers?.[g.code+"-"+i];if(a===1)correct++;else if(a===0)wrong++;else missing++});return {code:g.code,title:g.title,correct,wrong,missing,total:g.items.length,complete:missing===0};});}
const D=window.PSY_FULL_METHODS||{};
D[NAME]={
 author:"Классическая проба парных ассоциаций · стимульные ряды Психотеки",
 age:"Ориентировочно с 9 лет",
 kind:"Диагностическая проба на ассоциативную вербальную память",
 count:"20 пар слов · 2 серии",
 goal:"Исследование воспроизведения связанных и несвязанных пар слов: смысловая и механическая память.",
 instructions:"Я прочитаю пары слов. Постарайся запомнить, какое второе слово было рядом с первым. Затем я буду называть только первое слово, а ты скажешь второе. Не подбирай новое подходящее слово — вспомни именно то, которое прозвучало.",
 questions:GROUPS.flatMap(g=>g.items.map(x=>x[0])),options:[],
 scoring:"За каждую точно воспроизведённую пару ставится 1, иначе 0. По каждой серии подсчитывается число точных ответов из 10, только если все 10 предъявлены и оценены. Пустые, непроведённые ответы не приравниваются к ошибкам. Семантический синоним — не точное воспроизведение; запишите дословный ответ для качественного анализа.",
 interpret:"Сравнение двух серий носит описательный характер: на результат влияют лексика, слух, темп, внимание и интерференция между сериями. Не переносите нормативы опубликованных методик на этот новый словесный набор. Ни один итог сам по себе не является диагнозом.",
 source:"https://library.mededtech.ru/rest/documents/Bleikher_patopsik/?anchor=paragraph_gn2j66",
 sourceScoring:"https://iee.unn.ru/wp-content/uploads/sites/9/2018/03/Muhina-T.G.-Psihologiya-i-pedagogika-.pdf",
 license:"Метод парных ассоциаций — классическая экспериментальная процедура. Все 20 пар составлены для Психотеки; возрастная стандартизация, нормы и опубликованные пороги к этой редакции отсутствуют.",
 workflow:"pairedAssoc20",calculator:true,
 guideFile:"downloads/paired_associations_guide.html",answerFile:"downloads/paired_associations_blank.html",processingFile:"downloads/paired_associations_scoring.html",stimulusFile:"downloads/paired_associations_examiner.html",
 indicators:["Точное воспроизведение смысловых пар (из 10)","Точное воспроизведение несвязанных пар (из 10)","Ошибки замены / смысловые ответы","Условия предъявления и стратегии запоминания"]
};
function instruction(d){
const key='<table class="questions-table"><thead><tr><th>№</th><th>Первое слово</th><th>Второе слово (ключ)</th></tr></thead><tbody>'+
 GROUPS.map(g=>'<tr><th colspan="3">'+E(g.title)+'</th></tr>'+g.items.map((p,i)=>'<tr><td>'+(i+1)+'</td><td>'+E(p[0])+'</td><td><b>'+E(p[1])+'</b></td></tr>').join("")).join("")+'</tbody></table>';
return '<section class="psy-mspss-section psy-mspss-manual">'+
 '<div class="psy-mspss-manual-bar"><div><h3>Методика и руководство</h3><p>Материал для специалиста: обе серии, ключ и правила обработки.</p></div><div class="psy-mspss-manual-actions"><a class="btn primary" href="'+E(d.guideFile)+'" target="_blank" rel="noopener noreferrer">Посмотреть и распечатать ↗</a></div></div>'+
 '<h3>Цель</h3><p>'+E(d.goal)+'</p>'+
 '<h3>Описание методики</h3><p>Классическая проба парных ассоциаций исследует точное воспроизведение второго слова по первому. Предлагаются две серии по 10 пар — связанных и не связанных по смыслу. Предъявление слуховое, по одной серии за раз. Стимульные ряды составлены для Психотеки, без стандартизированных нормативов.</p>'+
 '<h3>Инструкция для ребёнка</h3><div class="psy-mspss-script">«'+E(d.instructions)+'»</div>'+
 '<h3>Порядок проведения</h3><ol><li>Индивидуально проверьте понимание слов и слуховое восприятие. Подготовьте бланк для записи дословных ответов.</li><li>Прочитайте 10 смысловых пар с одинаковым интервалом около 3–5 секунд. Не показывайте слова на бумаге.</li><li>После короткой паузы (около 10 секунд) произносите только первые слова в исходном порядке, фиксируя точные ответы. Не называйте верное слово и не подсказывайте.</li><li>Аналогично проведите вторую серию из 10 несвязанных пар. Отметьте перерыв, отвлечения и утомление.</li><li>Запишите смысловые замены, пропуски, стратегии запоминания и любую помощь отдельно от результата.</li></ol>'+
 '<h3>Ключ и стимульные пары психолога</h3><p>Это ответы только для специалиста: при обследовании ребёнок не должен видеть таблицу.</p>'+key+
 '<h3>Подсчёт</h3><p>'+E(d.scoring)+'</p><p>По каждой серии отдельно: максимум 10 точных воспроизведений. Если часть слов не была предъявлена или результат неизвестен, итог серии не рассчитывается. Пример: 7 точных ответов из 10 предъявленных — 7/10.</p>'+
 '<h3>Интерпретация</h3><p>'+E(d.interpret)+'</p>'+
 '<h3>Ограничения</h3><p>Списки и порядок слов разработаны для Психотеки; это качественная диагностическая проба, а не нормативная версия опубликованной шкалы. Оценивайте влияние понимания слов, слуха, внимания и условий обследования. Не делайте диагноз по одному результату.</p>'+
 '</section>';
}
function materials(d){
return '<section class="psy-mspss-section psy-mspss-student">'+
 '<div class="psy-mspss-blank-head"><div><h3>Бланк ученика</h3><p>Протокол записи второго слова; стимулы специалиста и ключ сюда не включены.</p></div><a class="btn primary psy-mspss-view" href="'+E(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Посмотреть и распечатать ↗</a></div>'+
 '<p><strong>Инструкция.</strong> '+E(d.instructions)+'</p>'+
 '<div class="psy-mspss-blank-scroll">'+GROUPS.map(g=>'<h3>'+E(g.title)+'</h3><table class="psy-mspss-blank-table"><thead><tr><th>№</th><th>Первое слово</th><th>Ответ участника</th></tr></thead><tbody>'+g.items.map((p,i)=>'<tr><td>'+(i+1)+'</td><td>'+E(p[0])+'</td><td>_____________________</td></tr>').join("")+'</tbody></table>').join("")+'</div>'+
 '</section>';
}
function processing(d){return '<h3>Правила подсчёта</h3><p>'+E(d.scoring)+'</p><table class="questions-table"><thead><tr><th>Серия</th><th>Точных ответов</th><th>Всего</th></tr></thead><tbody><tr><td>Смысловые пары</td><td>____</td><td>10</td></tr><tr><td>Несвязанные пары</td><td>____</td><td>10</td></tr></tbody></table><p>Пример: после всех предъявленных смысловых пар 7 слов были воспроизведены точно, 3 ошибочно → 7 из 10. Если какое-либо слово не предъявлялось или результат неизвестен, итог серии не рассчитывается.</p><p>'+E(d.interpret)+'</p><a href="'+d.processingFile+'" target="_blank" rel="noopener noreferrer">Обработка А4</a>';}
function summary(raw){let s=outcomes(raw);return '<h3>Описательные результаты</h3>'+s.map(g=>'<p><b>'+E(g.title)+':</b> '+(g.complete?g.correct+' из '+g.total+' точных ответов':'неполный протокол: '+(g.correct+g.wrong)+' из '+g.total+' оценены; точных среди оценённых '+g.correct)+'.</p>').join('')+(s.every(g=>g.complete)?'<p>Разница между сериями (смысловые минус несвязанные): '+(s[0].correct-s[1].correct)+' ответов. Описательная разница, не нормативный индекс.</p>':'<p>Сопоставление полных итогов будет доступно после заполнения обеих серий.</p>')+'<p class="notice">Внешних норм к данным словам нет. Отмечайте точное воспроизведение и особенности ошибок.</p>';}
function calculator(d,ctx){const row=ctx.rows[ctx.rowIndex]||{},raw=row.pairedAnswers||{},notes=row.pairedNotes||{};return '<h3>Протокол психолога</h3><p>Вносите точный ответ и отмечайте результат: «верно», «неверно» или «не предъявлялось». Слова для запоминания показаны ниже только специалисту.</p>'+GROUPS.map(g=>'<h3>'+E(g.title)+'</h3><table class="questions-table"><thead><tr><th>Стимул → целевое слово</th><th>Ответ участника</th><th>Оценка</th></tr></thead><tbody>'+g.items.map((pair,i)=>{let id=g.code+"-"+i,mark=raw[id];return '<tr><td>'+E(pair.join(" → "))+'</td><td><input data-paired-note="'+id+'" value="'+E(notes[id]||"")+'" placeholder="Дословно" style="max-width:180px"></td><td><select data-paired-mark="'+id+'"><option value="">Не оценено</option><option value="1"'+(mark===1?' selected':'')+'>Верно</option><option value="0"'+(mark===0?' selected':'')+'>Неверно</option></select></td></tr>'}).join("")+'</tbody></table>').join('')+'<section id="pairedSummary" aria-live="polite">'+summary(raw)+'</section>';}
function bind(d,ctx){const row=ctx.rows[ctx.rowIndex];if(!row)return;row.pairedAnswers??={};row.pairedNotes??={};document.querySelectorAll("[data-paired-mark]").forEach(el=>el.addEventListener("change",()=>{row.pairedAnswers[el.dataset.pairedMark]=el.value===""?null:Number(el.value);document.getElementById("pairedSummary").innerHTML=summary(row.pairedAnswers)}));document.querySelectorAll("[data-paired-note]").forEach(el=>el.addEventListener("input",()=>{row.pairedNotes[el.dataset.pairedNote]=el.value}));}
window.PSY_PAIRED_ASSOC={GROUPS,outcomes,instruction,materials,processing,calculator,bind};
})();