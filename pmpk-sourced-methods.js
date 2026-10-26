"use strict";
/* Психотека. Описанные в литературе методики ПМПК с разными комплектами
   ребенка и специалиста. Без домысливания стимулов или нормативных таблиц. */
(function(){
const PICT="Пиктограмма (А. Р. Лурия, модификация Е. И. Изотовой)";
const COMP="Сравнение понятий (С. Я. Рубинштейн)";
const PICT_SOURCE="https://psyjournals.ru/journals/psyedu/archive/2025_n3/Izotova_Molchanova_et_al";
const COMP_SOURCE="https://ppms22.ru/upload/medialibrary/32d/odnrdo6cb0g7atnt8p4t7ttufna79sll/11.-Myshlenie_Sravnenie-ponyatiy-S.-YA.-Rubinshteyn.pdf";
const words=["веселый праздник","тяжелая работа","вкусный ужин","развитие","строгая воспитательница","теплый ветер","слепой мальчик","обман","болезнь","расставание","страх","веселая компания"];
const pairs=[
["Утро","вечер"],["Яблоко","вишня"],["Корова","лошадь"],["Лев","собака"],["Летчик","танкист"],
["Ворона","воробей"],["Лыжи","коньки"],["Молоко","вода"],["Трамвай","автобус"],["Золото","серебро"],
["Река","озеро"],["Сани","телега"],["Велосипед","мотоцикл"],["Воробей","курица"],["Собака","кошка"],
["Дуб","береза"],["Ворона","рыба"],["Сказка","песня"],["Лев","тигр"],["Картина","портрет"],
["Поезд","самолет"],["Лошадь","всадник"],["Обман","ошибка"],["Кошка","яблоко"],["Ботинок","карандаш"],["Голод","жажда"]
];
const definitions={
 [PICT]:{id:"pmpk-pictogram-izotova-6-7",age:"6-7 лет",domain:"Память и мышление",area:"preschool",
 author:"А. Р. Лурия, модификация Е. И. Изотовой (2025)",source:PICT_SOURCE,
 goal:"Исследование опосредованного запоминания, способа кодирования и организации рисунков.",
 note:"Только опубликованная 12-стимульная модификация Е. И. Изотовой (2025), а не любая «Пиктограмма» Лурии."},
 [COMP]:{id:"pmpk-compare-rubinstein-11-18",age:"11-18 лет в маршруте ПМПК; нормативный возраст в источнике не установлен",domain:"Мышление",area:"school",
 author:"С. Я. Рубинштейн; опубликованный перечень из «Альманаха психологических тестов» (1995)",source:COMP_SOURCE,
 goal:"Качественное исследование операций сравнения, анализа, синтеза и абстрагирования.",
 note:"26 пар из опубликованной редакции. Количественные возрастные нормы для данной серии не приведены."}
};
const esc=x=>String(x??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const methods=Object.keys(definitions);let current="",tab="portfolio",overlay=null,prevFocus=null;
const data={};
function initial(n){return n===PICT?{age:"",delay:"",sourceComplete:"",recall:Array(12).fill(""),explain:Array(12).fill(""),notes:"",regulation:"",form:"",comment:""}:
 {rows:pairs.map(()=>({status:"",same:"",different:"",note:""})),summary:"",notes:""}}
function state(){return data[current]||(data[current]=initial(current))}
function ready(n=current,d=data[n]||initial(n)){
 if(n===PICT)return (d.age==="6"||d.age==="7")&&(d.sourceComplete==="yes"||d.sourceComplete==="no")&&d.recall.length===12&&d.recall.every(x=>x==="yes"||x==="no")&&Number.isInteger(+d.delay)&&+d.delay>=20&&+d.delay<=240&&d.delay!==""&&!!d.notes.trim();
 return d.rows.length===26&&d.rows.every(x=>x.status==="skip"&&!!x.note.trim()||x.status==="done"&&!!x.same.trim()&&!!x.different.trim())&&d.rows.some(x=>x.status==="done")&&!!d.summary.trim();
}
function outcome(d=state()){
 if(!ready(PICT,d))return null;
 const score=d.recall.filter(x=>x==="yes").length;
 return {score,category:d.sourceComplete==="no"?"Сравнение с опубликованными диапазонами не выполняется: оригинальные условия не подтверждены.":d.age==="6"?(score<=4?"Ниже межквартильного диапазона":score<=9?"В межквартильном диапазоне":"Выше межквартильного диапазона"):
 (score<=7?"Ниже межквартильного диапазона":score<=11?"В межквартильном диапазоне":"Выше межквартильного диапазона")};
}
function selectOpt(key,val,label){return '<option value="'+esc(key)+'"'+(key===val?' selected':'')+'>'+esc(label)+'</option>'}
function opt(items,value){return '<option value="">Выберите</option>'+items.map(v=>selectOpt(v[0],value,v[1])).join("")}
const parts={
 intro:()=>'<div class="pmpk-method-box"><h3>Общие сведения</h3><div class="pmpk-method-facts">'+[
 ["Методика",current],["Автор и редакция",definitions[current].author],["Возраст",definitions[current].age],["Назначение",definitions[current].domain],["Материалы",current===PICT?"12 слов, лист A4, карандаши":"26 пар понятий, регистрационный протокол"]
 ].map(([l,v])=>'<div><small>'+esc(l)+'</small><strong>'+esc(v)+'</strong></div>').join("")+'</div></div>'+
 '<div class="pmpk-method-box"><h3>Цель</h3><p>'+esc(definitions[current].goal)+'</p><p>'+esc(definitions[current].note)+'</p><p><a href="'+definitions[current].source+'" target="_blank" rel="noopener noreferrer">Открыть опубликованный источник</a></p></div>'+
 '<div class="pmpk-method-box"><h3>Что оценивает специалист</h3><p>'+(current===PICT?
 'Точность отсроченного воспроизведения, связь рисунка со словом, образная или знаковая форма кодирования, организация листа, использование помощи.':'Содержательность признаков сходства и различия, последовательность рассуждений, обоснованность обобщений, реакции на подсказки.')+'</p><p>Автоматический диагноз не формируется. Записи специалиста не передаются на сервер.</p></div>',
 guide:()=>'<div class="pmpk-method-box"><div class="pmpk-toolbar"><h3>Методика / руководство</h3><div class="pmpk-actions"><button type="button" class="pmpk-mini" data-sourced-action="print-guide">Без бланка</button><button type="button" class="pmpk-action primary" data-sourced-action="print-combined">С бланком</button></div></div>'+
 (current===PICT?
 '<h4>Цель</h4><p>Проверить опосредованное запоминание 12 слов и словосочетаний посредством рисунков.</p><h4>Инструкция ребенку</h4><blockquote>Сейчас я буду называть слова. К каждому нарисуй что-нибудь, что поможет его вспомнить. Все 12 рисунков размести на одной стороне листа.</blockquote><p class="pmpk-note">Эта инструкция сокращена. Для сопоставления с опубликованными диапазонами обязательно применять полный текст приложения А, включая порядок стимулов, инструкцию и отсрочку. Иначе результат остается описательным.</p><h4>Проведение</h4><ol><li>Дать лист А4, карандаши и ластик.</li><li>Последовательно прочитать все 12 стимулов из отдельного протокола специалиста.</li><li>После каждого рисунка спросить, что изображено и как это связано со словом. Ответ записать.</li><li>Отложить рисунок. Не менее чем через 20 минут вернуться к нему без повторного чтения слов.</li><li>Попросить вспомнить ранее названные слова, записать ответы дословно.</li></ol><h4>Подсчет</h4><p>За правильно воспроизведенное слово – 1 балл, иначе – 0. Сумма 0-12 после заполнения всех 12 полей и указания реального интервала отсрочки.</p><h4>Опубликованная интерпретация</h4><p>6 лет: 0-4 ниже межквартильного диапазона, 5-9 внутри, 10-12 выше. 7 лет: 0-7 ниже, 8-11 внутри, 12 выше. Это выборочные межквартильные ориентиры исследования при соблюдении полного опубликованного протокола, а не диагноз. Дополнительные шкалы оригинальности и регуляции автоматически не подсчитываются, поскольку требуют отдельного кодирования рисунков по первоисточнику.</p>':
 '<h4>Цель</h4><p>Выделение существенных признаков сходства и различия словесных понятий.</p><h4>Инструкция ребенку</h4><blockquote>Я назову два понятия. Сначала скажи, чем они похожи, а потом чем отличаются.</blockquote><p class="pmpk-note">Последовательность и два вопроса соответствуют опубликованному описанию; формулировка сокращена для рабочего маршрута.</p><h4>Проведение</h4><ol><li>По одному предъявлять 26 пар понятий в опубликованном порядке из протокола специалиста.</li><li>Выслушать и записать полный ответ на сходство, затем различие.</li><li>Первые примеры можно пояснить без раскрытия правильных ответов остальных пар.</li><li>Не подсказывать решения. Отмечать конкретность, существенность признаков и случаи логически несопоставимых пар.</li><li>Если часть пар не предъявлялась, явно отметить пропуски в обработке, не заменять их нулями.</li></ol><h4>Критерии интерпретации</h4><p>Описывайте качество сходств и различий, опору на существенные признаки, гибкость обобщений, случаи ситуативных объяснений. Не рассчитывайте придуманный IQ, уровень или средний балл: опубликованный текст дает качественный анализ без стандартизированных возрастных норм.</p>')+
 '<p><a href="'+definitions[current].source+'" target="_blank" rel="noopener noreferrer">Методика и проверяемая редакция</a></p><p class="pmpk-note">Статья 2025 года – Изотова Е. И., Молчанова Г. В., Авдулова Т. П., Хузеева Г. Р. Материал CC BY-NC 4.0. Не делайте клинических выводов по отдельному рисунку.</p></div>',
 blank:()=>'<div class="pmpk-method-box"><div class="pmpk-toolbar"><div><h3>Бланк</h3><p class="pmpk-note">'+(current===PICT?'Пустой лист для рисунков ребенку и отдельная регистрация специалиста.':'Все пары в отдельном протоколе специалиста.')+'</p></div><div class="pmpk-actions"><button type="button" class="pmpk-mini" data-sourced-action="print-child">Бланк ребенка · А4</button><button type="button" class="pmpk-mini" data-sourced-action="print-stimuli">Протокол специалиста · А4</button><button type="button" class="pmpk-action primary" data-sourced-action="word-blank">Word</button></div></div>'+
 (current===PICT?'<div class="pmpk-method-box"><h4>Лист ребенка</h4><div class="pmpk-pict-empty"></div><p class="pmpk-note">Лист остается свободным – рисунки ребенок размещает самостоятельно. Точные стимулы ему не печатаются.</p></div>':
 '<p>Пары для предъявления и ответы записываются только специалистом. Для ребенка отдельного бланка с правильными ответами не предусмотрено.</p>')+'</div>',
 process:()=>current===PICT?pictureProcessing():comparisonProcessing()
};
function pictResultMarkup(d){
 const o=outcome(d),filled=d.recall.filter(Boolean).length;
 return o?'<section class="pmpk-sourced-result"><h3>Опосредованное запоминание: '+o.score+' / 12</h3><p>'+esc(o.category)+' для детей '+d.age+' лет. Возрастные диапазоны сопоставимы только по полному оригинальному протоколу.</p></section>':
 '<p class="pmpk-note">Заполнено '+filled+' из 12. Пустой ответ не является нулем.</p>';
}
function pictureProcessing(){const d=state(),o=outcome(d),filled=d.recall.filter(Boolean).length;
 return '<div class="pmpk-method-box"><h3>Обработка результатов: 12 стимулов</h3><p class="pmpk-note">Статус станет зеленым только после внесения возраста, отсрочки от 20 минут, ответов по всем 12 словам и описания наблюдений.</p>'+
 '<div class="pmpk-method-fields"><label>Возраст *<select data-sourced-field="age">'+opt([["6","6 лет"],["7","7 лет"]],d.age)+'</select></label><label>Полная процедура приложения А соблюдена? *<select data-sourced-field="sourceComplete">'+opt([["yes","Да, строго по первоисточнику"],["no","Нет, условия изменены или не подтверждены"]],d.sourceComplete)+'</select></label><label>Фактический интервал отсрочки, минут *<input type="number" min="20" max="240" step="1" data-sourced-field="delay" value="'+esc(d.delay)+'"></label></div>'+
 '<table class="pmpk-method-table"><thead><tr><th>№ / слово</th><th>Отсроченное воспроизведение</th><th>Что нарисовано / объяснение</th></tr></thead><tbody>'+words.map((word,i)=>'<tr><td>'+(i+1)+'. '+esc(word)+'</td><td><select aria-label="Слово '+(i+1)+'" data-sourced-recall="'+i+'">'+opt([["yes","Вспомнил"],["no","Не вспомнил"]],d.recall[i])+'</select></td><td><input aria-label="Описание рисунка '+(i+1)+'" data-sourced-explain="'+i+'" value="'+esc(d.explain[i])+'" placeholder="Фактический ответ"></td></tr>').join("")+'</tbody></table>'+
 '<label class="pmpk-method-blockfield">Наблюдения специалиста *<textarea rows="3" data-sourced-field="notes" placeholder="Характер кодирования, помощь, реакции">'+esc(d.notes)+'</textarea></label>'+
 '<div data-sourced-result>'+pictResultMarkup(d)+'</div>'+'</div>';
}
function comparisonProcessing(){const d=state(),complete=d.rows.filter(r=>r.status==="done"&&r.same.trim()&&r.different.trim()).length;
return '<div class="pmpk-method-box"><h3>Обработка: 26 пар понятий</h3><p class="pmpk-note">Ответы фиксируются дословно. Если пара не предъявлялась, выберите «Не проводилась»; пустое поле не равно ошибке.</p>'+
 '<div class="pmpk-method-grid">'+pairs.map(([x,y],i)=>{const r=d.rows[i];
 return '<section class="pmpk-method-answer"><h4>'+(i+1)+'. '+esc(x)+' – '+esc(y)+'</h4><label>Предъявление<select data-sourced-row="'+i+'" data-sourced-prop="status">'+opt([["done","Проводилась"],["skip","Не проводилась"]],r.status)+'</select></label>'+
 (r.status==="done"?'<label>Сходство *<input data-sourced-row="'+i+'" data-sourced-prop="same" value="'+esc(r.same)+'"></label><label>Различие *<input data-sourced-row="'+i+'" data-sourced-prop="different" value="'+esc(r.different)+'"></label>':r.status==="skip"?'<label>Причина непредъявления *<input data-sourced-row="'+i+'" data-sourced-prop="note" value="'+esc(r.note)+'"></label>':'')+
 '</section>'}).join("")+'</div>'+
 '<p class="pmpk-note" data-sourced-counter>Полные ответы зафиксированы для '+complete+' из 26 пар. Методика не имеет автоматического правильного/неправильного балла.</p>'+
 '<label class="pmpk-method-blockfield">Качественное заключение по предъявленным парам *<textarea data-sourced-field="summary" rows="4" placeholder="Какие существенные признаки были выделены, какие способы решения и помощь наблюдались">'+esc(d.summary)+'</textarea></label></div>';
}
function printContent(type){
 const n=current,d=state(),m=definitions[n];
 const title='<h1>'+esc(n)+'</h1><p>Автор/версия: '+esc(m.author)+'</p><p>Возраст: '+esc(m.age)+'</p>';
 const guide=title+'<h2>Цель</h2><p>'+esc(m.goal)+'</p>'+
 (n===PICT?
 '<h2>Инструкция ребенку</h2><p>Нарисуй к каждому названному слову рисунок, который поможет потом вспомнить эти слова. Все двенадцать рисунков размести на одной стороне листа.</p><h2>Проведение</h2><ol><li>Подготовить лист А4 и карандаши.</li><li>Зачитывать 12 слов только с отдельного стимульного листа специалиста.</li><li>После каждого рисунка записать его связь со словом и объяснение ребенка.</li><li>Отложить рисунки минимум на 20 минут, затем попросить назвать исходные слова и зафиксировать воспроизведение.</li></ol><h2>Ключ и интерпретация</h2><p>За каждое верно названное слово – 1 балл, сумма 0-12. В 6 лет: 0-4 ниже межквартильного диапазона, 5-9 внутри, 10-12 выше; в 7 лет: 0-7 ниже, 8-11 внутри, 12 выше. Другие качественные шкалы автоматически не рассчитываются.</p>':
 '<h2>Инструкция ребенку</h2><p>Для каждой пары слов сначала назови сходства, затем различия.</p><h2>Проведение</h2><ol><li>Предъявлять по порядку 26 пар из отдельного листа специалиста.</li><li>Полностью записывать ответы о сходстве и различии.</li><li>Отмечать помощь и непредъявленные пары.</li></ol><h2>Интерпретация</h2><p>Описывать существенность признаков, конкретность или отвлеченность сравнения, логичность и связность рассуждения. Возрастных балльных нормативов данной серии нет.</p>')+
 '<p>Источник: '+esc(m.source)+'</p>';
 const child=n===PICT?'<section class="child"><h2>Лист ребенка для рисунков</h2><div class="empty"></div></section>':'<section class="child"><h2>Свободный лист ребенка</h2><div class="empty"></div></section>';
 const stimuli=title+'<h2>Рабочий протокол специалиста</h2><p>Код ребенка __________ Дата __________ </p>'+
 (n===PICT?'<table><thead><tr><th>№</th><th>Стимул</th><th>Связь рисунка со словом</th><th>Воспроизвел (да/нет)</th></tr></thead><tbody>'+words.map((x,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(x)+'</td><td>____________________</td><td>_________</td></tr>').join("")+'</tbody></table><p>Фактическая отсрочка: ______ минут (не менее 20)</p>':
 '<table><thead><tr><th>№</th><th>Пара</th><th>Сходство</th><th>Различие</th></tr></thead><tbody>'+pairs.map(([x,y],i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(x)+' – '+esc(y)+'</td><td>__________</td><td>__________</td></tr>').join("")+'</tbody></table>')+
 '<p>Качественные наблюдения: ________________________________________</p>';
 const report=title+'<h2>Регистрация результатов</h2>'+
 (n===PICT?'<p>Возраст: '+esc(d.age)+'. Интервал: '+esc(d.delay)+' мин. Результат: '+(outcome(d)?.score??"___")+'/12. '+esc(outcome(d)?.category||"")+'</p><p>Наблюдения: '+esc(d.notes)+'</p>':
 '<p>Проведено пар: '+d.rows.filter(r=>r.status==="done").length+'. Качественный вывод: '+esc(d.summary)+'</p>'+
 d.rows.map((r,i)=>r.status==="done"?'<p>'+(i+1)+'. '+esc(pairs[i][0])+' – '+esc(pairs[i][1])+': сходство – '+esc(r.same)+'; различие – '+esc(r.different)+'</p>':"").join(""))+
 '<p>Без автоматических диагнозов или переносимых нормативов.</p>';
 if(type==="guide")return guide;
 if(type==="combined")return guide+'<div class="pagebreak"></div>'+child;
 if(type==="child")return child;
 if(type==="stimuli")return stimuli;
 return report;
}
function print(type){
 if(type==="report"&&!ready())return;
 const h='<!doctype html><html lang="ru"><head><meta charset="UTF-8"><style>@page{size:A4;margin:16mm}body{font:10pt/1.45 Arial,sans-serif;color:#202e2b}h1{font-size:18pt}h2{font-size:14pt}table{width:100%;border-collapse:collapse;font-size:9pt}td,th{padding:6px;border:1px solid #777;text-align:left;vertical-align:top}tr{break-inside:avoid}.pagebreak{break-before:page;page-break-before:always}.empty{height:220mm;border:1px solid #ddd;margin-top:8mm}.child{break-inside:avoid}</style></head><body>'+printContent(type)+'</body></html>';
 const w=window.open("","_blank");if(!w){window.alert("Разрешите окно печати.");return}w.document.open();w.document.write(h);w.document.close();w.focus();w.setTimeout(()=>w.print(),150);
}
function utf8(s){return new TextEncoder().encode(s)}
function pack(files){
 const u16=n=>[n&255,(n>>>8)&255],u32=n=>[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];let pos=0;const locals=[],centers=[];
 const crc=bytes=>{let v=0xffffffff;for(let b of bytes){v^=b;for(let i=0;i<8;i++)v=(v>>>1)^((v&1)?0xedb88320:0)}return(v^0xffffffff)>>>0};
 for(const [name,data]of Object.entries(files)){const a=utf8(name),b=utf8(data),s=crc(b);
  const lh=Uint8Array.from([...u32(0x04034b50),...u16(20),...u16(0x800),...u16(0),0,0,0,0,...u32(s),...u32(b.length),...u32(b.length),...u16(a.length),0,0,...a]);
  locals.push(lh,b);centers.push(Uint8Array.from([...u32(0x02014b50),...u16(20),...u16(20),...u16(0x800),0,0,0,0,0,0,...u32(s),...u32(b.length),...u32(b.length),...u16(a.length),0,0,0,0,0,0,0,0,0,0,...u32(pos),...a]));
  pos+=lh.length+b.length;
 }
 const total=centers.reduce((n,a)=>n+a.length,0);
 return new Blob([...locals,...centers,Uint8Array.from([...u32(0x06054b50),0,0,0,0,...u16(centers.length),...u16(centers.length),...u32(total),...u32(pos),0,0])],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
}
function word(type){
 if(type==="report"&&!ready())return;
 const text=type==="blank"?[current,"Бланк специалиста","Возраст ______; дата ______; код ______",...(current===PICT?words.map((x,i)=>(i+1)+". "+x+" / рисунок ______ / ответ ______"):pairs.map(([x,y],i)=>(i+1)+". "+x+" – "+y+" / сходство ______ / различие ______"))]:
 [current,definitions[current].author,definitions[current].age,
 ...(current===PICT?["Возраст: "+state().age,"Отсрочка: "+state().delay+" минут","Полный протокол: "+(state().sourceComplete==="yes"?"подтвержден":"не подтвержден"),"Вспомнил: "+(outcome()?.score??"не заполнено")+" из 12","Заключение: "+(outcome()?.category||""),"Наблюдения: "+state().notes]:
 ["Зарегистрировано: "+state().rows.filter(x=>x.status==="done").length+" пар",...state().rows.map((x,i)=>x.status==="done"?(i+1)+". "+pairs[i][0]+" – "+pairs[i][1]+": сходство: "+x.same+"; различие: "+x.different:"Не предъявлено: "+pairs[i][0]+" – "+pairs[i][1]+"; причина: "+x.note),"Качественное заключение: "+state().summary])];
 const xml=s=>esc(s).replace(/&#39;/g,"&apos;");
 const doc='<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+
 text.map(x=>'<w:p><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/></w:rPr><w:t xml:space="preserve">'+xml(x)+'</w:t></w:r></w:p>').join("")+
 '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:left="900" w:right="900" w:bottom="850"/></w:sectPr></w:body></w:document>';
 const contents='<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
 const rels='<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
 const url=URL.createObjectURL(pack({"[Content_Types].xml":contents,"_rels/.rels":rels,"word/document.xml":doc}));
 const a=document.createElement("a");a.href=url;a.download=definitions[current].id+"-"+type+".docx";document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),60000);
}
function draw(){
 if(!overlay)return;
 const ok=ready();
 overlay.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="sourcedMethodTitle" class="pmpk-method-shell">'+
 '<header class="pmpk-method-header"><div><p class="pmpk-method-overline">'+(current===PICT?"Детский сад · 6-7 лет":"Школа · 11-18 лет")+'</p><h2 id="sourcedMethodTitle">'+esc(current)+'</h2></div><button type="button" class="pmpk-method-close" data-sourced-action="close" aria-label="Закрыть">×</button></header>'+
 '<nav class="pmpk-method-tabs" role="tablist">'+[["portfolio","Портфолио"],["guide","Методика / руководство"],["blank","Бланк"]].map(([id,t])=>'<button type="button" role="tab" data-sourced-tab="'+id+'" aria-selected="'+(tab===id)+'">'+t+'</button>').join("")+'</nav>'+
 '<div class="pmpk-method-content">'+(tab==="portfolio"?parts.intro():tab==="guide"?parts.guide():tab==="blank"?parts.blank():parts.process())+'</div>'+
 '<footer class="pmpk-method-footer"><span class="pmpk-status '+(ok?"is-done":"")+'" data-sourced-status>'+(!ok?"Обработка не заполнена":"Обработка заполнена")+'</span>'+
 (tab==="processing"?'<div class="pmpk-method-right"><button type="button" class="pmpk-mini" data-sourced-action="back">К портфолио</button><button type="button" class="pmpk-mini" data-sourced-action="print-report" '+(!ok?"disabled":"")+'>Печать отчета</button><button type="button" class="pmpk-action primary" data-sourced-action="word-report" '+(!ok?"disabled":"")+'>Word отчет</button></div>':
 '<button type="button" class="pmpk-action primary" data-sourced-action="processing" style="margin-left:auto">Обработка результатов</button>')+'</footer></section>';
}
function open(name){
 if(!definitions[name])return false;if(overlay)close();
 current=name;tab="portfolio";prevFocus=document.activeElement;overlay=document.createElement("div");overlay.className="pmpk-method-overlay";document.body.appendChild(overlay);document.body.classList.add("pmpk-method-open");draw();document.addEventListener("keydown",keys);overlay.querySelector('[data-sourced-action="close"]')?.focus();return true;
}
function close(){if(!overlay)return;overlay.remove();overlay=null;current="";document.body.classList.remove("pmpk-method-open");document.removeEventListener("keydown",keys);if(prevFocus?.isConnected)prevFocus.focus()}
function keys(e){if(e.key==="Escape"){e.preventDefault();close()}else if(e.key==="Tab"&&overlay){const a=[...overlay.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]')].filter(x=>x.getClientRects().length);if(!a.length)return;if(e.shiftKey&&document.activeElement===a[0]){e.preventDefault();a.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===a.at(-1)){e.preventDefault();a[0].focus()}}}
function refreshStatus(){if(!overlay)return;const ok=ready();const el=overlay.querySelector("[data-sourced-status]");if(el){el.classList.toggle("is-done",ok);el.textContent=ok?"Обработка заполнена":"Обработка не заполнена"}overlay.querySelectorAll('[data-sourced-action="print-report"],[data-sourced-action="word-report"]').forEach(b=>b.disabled=!ok);const out=overlay.querySelector("[data-sourced-result]");if(out)out.innerHTML=pictResultMarkup(state());const counter=overlay.querySelector("[data-sourced-counter]");if(counter)counter.textContent="Полные ответы зафиксированы для "+state().rows.filter(r=>r.status==="done"&&r.same.trim()&&r.different.trim()).length+" из 26 пар."}
function change(e){if(!overlay||!overlay.contains(e.target))return;
 const x=e.target,d=state(),key=x.dataset.sourcedField;
 if(key){d[key]=x.value;refreshStatus();return}
 if(x.dataset.sourcedRecall!==undefined){d.recall[+x.dataset.sourcedRecall]=x.value;refreshStatus();return}
 if(x.dataset.sourcedExplain!==undefined){d.explain[+x.dataset.sourcedExplain]=x.value;refreshStatus();return}
 if(x.dataset.sourcedRow!==undefined){const r=d.rows[+x.dataset.sourcedRow],prop=x.dataset.sourcedProp;if(!r||!["status","same","different","note"].includes(prop))return;r[prop]=x.value;if(prop==="status"){const pane=overlay.querySelector(".pmpk-method-content"),scroll=pane?.scrollTop||0;draw();const n=overlay.querySelector(".pmpk-method-content");if(n)n.scrollTop=scroll}else refreshStatus()}
}
document.addEventListener("input",change);document.addEventListener("change",change);
document.addEventListener("click",e=>{if(!overlay||!overlay.contains(e.target))return;const b=e.target.closest("button");if(!b)return;
 if(b.dataset.sourcedTab){tab=b.dataset.sourcedTab;draw();return}
 const command=b.dataset.sourcedAction;
 if(command==="close")close();else if(command==="processing"){tab="processing";draw()}else if(command==="back"){tab="portfolio";draw()}
 else if(command==="print-guide")print("guide");else if(command==="print-combined")print("combined");
 else if(command==="print-child")print("child");else if(command==="print-stimuli")print("stimuli");
 else if(command==="print-report")print("report");else if(command==="word-blank")word("blank");else if(command==="word-report")word("report");
});
function downloadLines(id,lines){
 const xml=x=>esc(x).replace(/&#39;/g,"&apos;");
 const documentXml='<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+
 lines.map(t=>'<w:p><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/></w:rPr><w:t xml:space="preserve">'+xml(t)+'</w:t></w:r></w:p>').join("")+
 '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:left="900" w:right="900" w:bottom="850"/></w:sectPr></w:body></w:document>';
 const types='<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
 const rels='<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
 const blob=pack({"[Content_Types].xml":types,"_rels/.rels":rels,"word/document.xml":documentXml});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=id+".docx";document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),60000);
 return true;
}
function addToCatalog(){
 if(!window.PSY_CATALOG?.some(m=>m.name===COMP))window.PSY_CATALOG.push({id:definitions[COMP].id,name:COMP,author:"С. Я. Рубинштейн",age:"11-18 лет",theme:"Мышление",format:"Словесно-логическая проба",goal:definitions[COMP].goal,source:COMP_SOURCE});
}
function preschoolCatalog(){return [{id:definitions[PICT].id,existing:PICT,title:PICT,group:"Диагностика",topic:"Память",author:definitions[PICT].author,age:"6-7",format:"Диагностика опосредованной памяти",goal:definitions[PICT].goal,verified:true,source:PICT_SOURCE}]}
addToCatalog();
window.PSY_PMPK_SOURCED={definitions,has:name=>!!definitions[name],open,downloadLines,preschool:preschoolCatalog(),test:{ready:(n,d)=>ready(n,d),outcome,words:words.slice(),pairCount:pairs.length,initial}};
})();
