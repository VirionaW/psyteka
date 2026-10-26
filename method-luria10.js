"use strict";
/* А. Р. Лурия: пять чтений + отсроченное воспроизведение.
   Стимулы взяты из приложения 3 диссертации С. А. Налькина (2021).
   Основной текст той же работы содержит «огонь» вместо «окно»:
   это отмечено как разночтение редакций; нельзя их смешивать. */
(function(){
const NAME="Заучивание 10 слов";
const WORDS=["лес","хлеб","окно","стул","вода","брат","конь","гриб","игла","мед"];
const SOURCE="https://www.almazovcentre.ru/wp-content/uploads/%D0%94%D0%B8%D1%81%D1%81%D0%B5%D1%80%D1%82%D0%B0%D1%86%D0%B8%D1%8F-%D0%9D%D0%B0%D0%BB%D1%8C%D0%BA%D0%B8%D0%BD-%D0%A1.%D0%90.1.pdf";
const SECOND="https://www.mediasphera.ru/issues/khirurgiya-zhurnal-im-n-i-pirogova/2013/2/030023-12072013215";
const TRIALS=["1-е предъявление","2-е предъявление","3-е предъявление","4-е предъявление","5-е предъявление","Через 60 минут"];
const CAUTION="Методика имеет разные списки слов и количество предъявлений. В приложении 3 выбранного опубликованного источника указано «окно», тогда как в тексте того же исследования встречается «огонь». В нашем комплекте используются строго 10 слов приложения 3 и пять предъявлений. Отсроченная проба – через 60 минут без повторного чтения. Возрастные нормы и диагностические категории не переносятся из иных редакций.";
const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const truth=v=>v===1||v==="1"||v===true;
const all=(a,t)=>WORDS.map((w,j)=>truth(a?.[t*10+j]));
const completed=(a,t)=>truth(a?.[60+t]);
const num=(a,t)=>all(a,t).filter(Boolean).length;
function score(d,a){
 if(!Array.isArray(a)||Array.from({length:5},(_,i)=>completed(a,i)).some(x=>!x))return null;
 const trials=Array.from({length:5},(_,i)=>num(a,i));
 const delayed=completed(a,5)?num(a,5):null;
 const sum=trials.reduce((s,n)=>s+n,0);
 const peak=Math.max(...trials);
 return {trials,delayed,first:trials[0],fifth:trials[4],gain:trials[4]-trials[0],peak,mean:Math.round(sum/5*10)/10,
  change:trials.slice(1).map((n,i)=>n-trials[i]),curve:"Кол-во правильных слов в каждой из пяти проб",caption:"Слухоречевая память: 5 проб + отсроченный результат",status:delayed===null?"immediate":"complete"};
}
const D=window.PSY_FULL_METHODS;const d=D[NAME]||{};
Object.assign(d,{
 author:"А. Р. Лурия",age:"Дети от 7 лет и взрослые",
 kind:"Диагностическая проба слухоречевой памяти",
 count:"10 слов × 5 предъявлений + отсроченная проба через 60 минут",
 goal:"Описать объем непосредственного воспроизведения, динамику запоминания и сохранение слов после отсрочки.",
 instructions:"Специалист зачитывает один и тот же список из 10 слов четко и ровно, через 1–2 секунды между словами. После каждой из пяти проб участник называет все, что запомнил, в любом порядке. Специалист отмечает каждое верно названное слово один раз за пробу, а посторонние слова и повторы регистрирует отдельно. Через 60 минут испытуемый воспроизводит список без повторного предъявления.",
 scoring:"В каждой пробе подсчитываются уникальные слова из исходного списка (от 0 до 10), пять итогов образуют кривую заучивания. Отдельно указываются количество слов после первой и пятой проб, максимальное количество и отсроченное воспроизведение через 60 минут. Повторы и «лишние» слова записываются как качественные ошибки и не прибавляются к количеству правильных.",
 interpret:"Сначала фиксируют число верно воспроизведенных слов по каждой из пяти проб и форму кривой. Сравнивают первую и пятую пробы, отмечают прирост или снижение, максимальный результат, устойчивость запоминания и колебания между пробами. Затем отдельно сравнивают число слов в отсроченной пробе с пятой пробой с учетом фактической длительности интервала. Повторы и посторонние слова описывают качественно, не прибавляя к правильным. На результат влияют понимание инструкции, внимание, слух, утомление и условия обследования. Без нормативов именно этой возрастной редакции нельзя присваивать уровень памяти или ставить диагноз.",
 source:SOURCE,officialBlank:SOURCE,sourceAlternative:SECOND,
 warning:CAUTION,guideFile:"downloads/luria_10_words_guide_print.html",stimulusFile:"downloads/luria_10_words_stimuli.html",
 answerFile:"downloads/luria_10_words_psychologist.html",workflow:"luria10x5",special:"memory10",calculator:true,
 words:WORDS.slice(),scaleLabels:["Непосредственное воспроизведение","Кривая заучивания (5 предъявлений)","Отсроченное воспроизведение (60 минут)","Посторонние слова и повторы"],
 questions:TRIALS.slice()
});
D[NAME]=d;
function instruction(d){
 return '<div class="psy-luria-section-head"><h3>Методика и руководство</h3><div class="psy-luria-print-links"><a class="btn" href="'+escape(d.guideFile)+'?with_protocol=0&amp;v=20261026clean" target="_blank" rel="noopener noreferrer">Без бланка</a><a class="btn primary" href="'+escape(d.guideFile)+'?with_protocol=1&amp;v=20261026clean" target="_blank" rel="noopener noreferrer">С бланком</a></div></div>'+
 '<h3>Назначение и условия</h3><p>'+escape(d.goal)+'</p><p>Провести в спокойном помещении. Подготовить стимулы специалиста и лист регистрации. Слова предъявляют только на слух, не показывая их участнику.</p>'+
 '<h3>Инструкция участнику</h3><p>«Сейчас я зачитаю 10 слов. Внимательно слушайте и запоминайте. Когда закончу, назовите столько слов, сколько вспомните, в любом порядке».</p>'+
 '<h3>Проведение</h3><ol><li>Четко прочитать список из 10 слов в установленном порядке с интервалами 1-2 секунды.</li><li>Записать, какие слова воспроизведены. Повторные и посторонние слова отмечать отдельно.</li><li>Повторить тот же список еще четыре раза, регистрируя ответы после каждого предъявления.</li><li>Примерно через 60 минут попросить вспомнить слова без нового чтения. Зафиксировать фактический интервал.</li></ol>'+
 '<h3>Подсчет</h3><p>'+escape(d.scoring)+'</p>'+
 '<h3>Как анализировать результаты</h3>'+
 '<ol class="psy-luria-interpret"><li><strong>Начальная проба.</strong> Зафиксировать количество воспроизведенных слов после первого чтения. Это исходная точка, но не самостоятельный показатель уровня памяти.</li>'+
 '<li><strong>Динамика пяти проб.</strong> Записать последовательность результатов, сравнить первое и пятое предъявления, найти максимум. Отметить устойчивый рост, плато, снижение или колебания. Разность между пятой и первой пробой описывает изменение, а не нормативную оценку.</li>'+
 '<li><strong>Отсроченная проба.</strong> Сопоставить ее с пятой пробой и указать фактический интервал. Разность показывает, сколько слов воспроизведено после паузы по сравнению с последним чтением; без подходящих нормативов она не переводится в диагностический уровень.</li>'+
 '<li><strong>Качественные особенности.</strong> Отдельно описать посторонние слова, повторения, самокоррекцию, признаки отвлечения и утомления. Они не увеличивают число правильных ответов.</li>'+
 '<li><strong>Контекст.</strong> Учитывать возраст, понимание инструкции, слух, речевые особенности и условия обследования. Делать вывод только вместе с другими данными обследования.</li></ol>'+
 '<p class="psy-luria-example"><strong>Пример описания:</strong> 3, 5, 6, 6, 8 слов в пяти пробах; через 60 минут – 5 слов. Наблюдается увеличение числа слов к пятой пробе на 5 и уменьшение отсроченного воспроизведения на 3 по сравнению с пятой. Это описание, а не «низкий» или «высокий» уровень.</p>'+
 '<p class="psy-luria-limits">Возрастные нормативы и диагностические пороги для примененного списка не устанавливаются автоматически.</p>';
}
function grid(){
 const names=["1-я проба","2-я проба","3-я проба","4-я проба","5-я проба","Отсрочка"];
 return '<div class="psy-luria-grid-wrap"><table class="psy-luria-grid"><colgroup><col class="psy-luria-first-col">'+WORDS.map(()=>'<col>').join('')+'<col class="psy-luria-last-col"></colgroup>'+
 '<thead><tr><th scope="col">Проба</th>'+WORDS.map((_,i)=>'<th scope="col">'+(i+1)+'</th>').join('')+'<th scope="col">Итог</th></tr></thead>'+
 '<tbody>'+names.map(name=>'<tr><th scope="row">'+escape(name)+'</th>'+WORDS.map(()=>'<td></td>').join('')+'<td></td></tr>').join('')+'</tbody></table></div>';
}
function materials(d){
 return '<div class="psy-luria-section-head"><h3>Лист регистрации специалиста</h3><div class="psy-luria-print-links">'+
 '<a class="btn" href="'+escape(d.answerFile)+'?v=20261026clean" target="_blank" rel="noopener noreferrer">Посмотреть и распечатать</a>'+
 '<a class="btn primary" href="downloads/luria_10_words_protocol.docx" download>Скачать Word</a></div></div>'+
 '<p>Нейтральный регистрационный лист с кодом участника: заголовок диагностической методики, правильные ответы и слова-стимулы на нем не печатаются. Колонки 1-10 соответствуют порядку слов отдельного стимульного листа. Заполняет только специалист.</p>'+
 grid()+'<p>Посторонние слова, повторы и фактическое время отсрочки регистрируются отдельно в печатном листе.</p>'+
 '<p class="psy-luria-stimulus-link"><a href="'+escape(d.stimulusFile)+'" target="_blank" rel="noopener noreferrer">Стимулы для чтения специалистом</a></p>';
}
function processing(d){return '<h3>Правила подсчета</h3><p>'+escape(d.scoring)+'</p><p>'+escape(d.interpret)+'</p>';}
function ready(a){return Array.isArray(a)&&Array.from({length:6},(_,i)=>completed(a,i)).every(Boolean);}
function validDelay(v){return /^\d{1,3}$/.test(String(v??''))&&Number(v)>0&&Number(v)<=240;}
function results(a,delay){
 const done=Array.from({length:6},(_,i)=>completed(a,i)).filter(Boolean).length;
 const ok=ready(a)&&validDelay(delay),res=score(d,a);
 let h='<section class="psy-luria-results"><div class="psy-luria-result-head"><h3>Профиль запоминания</h3><span class="psy-luria-status '+(ok?'is-ready':'is-waiting')+'" role="status">'+(ok?'Данные заполнены':'Требуется заполнение')+'</span></div>';
 if(!res)return h+'<p>Завершено '+done+' из 6 проб. Для расчета нужны пять предъявлений, для окончательного отчета также отсроченное воспроизведение и фактическое время отсрочки. Завершенная проба с нулем правильных слов отличается от непроведенной.</p></section>';
 const stats=[["1-я проба",res.first],["5-я проба",res.fifth],["Лучший результат",res.peak],["Среднее за 5 проб",res.mean],["Разность 5-й и 1-й",res.gain],["Отсроченная проба",res.delayed??"–"]];
 h+='<div class="psy-luria-stats">'+stats.map(([l,v])=>'<div><span>'+escape(l)+'</span><strong>'+escape(v)+'</strong></div>').join("")+'</div>';
 h+='<h4>Кривая по пяти предъявлениям</h4><div class="psy-luria-bars">'+res.trials.map((v,i)=>'<div><span>'+(i+1)+'</span><div class="psy-luria-track"><i style="width:'+(v*10)+'%"></i></div><b>'+v+' / 10</b></div>').join("")+'</div>';
 if(!ok)h+='<p><strong>Предварительный расчет.</strong> Для итогового отчета отметьте отсроченную пробу и фактическое время в минутах.</p>';
 if(ok&&Number(delay)!==60)h+='<p class="notice">Фактическая отсрочка составляет '+escape(delay)+' минут вместо 60. Это отклонение от выбранного протокола; результат интерпретируйте с учетом обстоятельств.</p>';
 h+='<div class="notice">Результаты описательные: возрастные уровни и диагнозы автоматически не назначаются.</div></section>';
 return h;
}
function calculator(d,ctx){
 const rs=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rs[ctx.rowIndex]||rs[0],a=r.answers||[],notes=r.luriaNotes||[];
 let h='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>'+
 '<div class="notice">Внесите услышанные ответы после предъявления слов. Ставьте галочку «Проба завершена», даже если воспроизведено 0 слов. <strong>Шестая строка – только через 60 минут, без повторного чтения.</strong></div>';
 if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Участник<select id="participantSelect">'+rs.map((u,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+(i+1)+'. '+escape(u.name||"Код "+(i+1))+'</option>').join("")+'</select></label><label>Код, не ФИО<input id="participantName" value="'+escape(r.name||"")+'" placeholder="Код"></label><button class="btn" id="addParticipant">Добавить</button></div>';
 h+='<div class="psy-luria-meta-inputs"><label>Дата обследования<input type="date" data-luria-date value="'+escape(r.luriaDate||"")+'"></label><label>Фактическое время отсрочки, минут<input type="number" min="1" max="240" step="1" data-luria-delay value="'+escape(r.luriaDelay||"")+'" placeholder="60"></label></div><div class="psy-luria-trials">';
 TRIALS.forEach((label,t)=>{
  h+='<section class="psy-luria-trial"><div class="psy-luria-trial-head"><h4>'+escape(label)+'</h4><label><input type="checkbox" data-luria-done="'+t+'" '+(completed(a,t)?'checked':'')+'> Проба завершена</label></div>'+
  '<div class="psy-luria-choices">'+WORDS.map((word,j)=>'<label><input type="checkbox" data-luria-word="'+(t*10+j)+'" '+(truth(a[t*10+j])?'checked':'')+'> '+escape(word)+'</label>').join("")+'</div>'+
  '<div class="psy-luria-notes"><label>«Лишние» слова / повторы<textarea data-luria-note="'+t+'" rows="2" placeholder="Посторонние слова и повторы отдельно">'+escape(notes[t]?.extra||"")+'</textarea></label></div></section>';
 });
 h+='</div><div id="luriaResult">'+results(a,r.luriaDelay)+'</div>';
 if(ctx.calcMode==="class")h+='<h3>Сводка участников</h3><div class="results-table"><table id="luriaGroupSummary"><thead><tr><th>Код</th><th>1-я</th><th>5-я</th><th>Пик</th><th>Отсрочка</th></tr></thead><tbody>'+rs.map((u,i)=>{let z=score(d,u.answers);return '<tr><td>'+escape(u.name||"Код "+(i+1))+'</td><td>'+(z?.first??"–")+'</td><td>'+(z?.fifth??"–")+'</td><td>'+(z?.peak??"–")+'</td><td>'+(z?.delayed??"–")+'</td></tr>';}).join("")+'</tbody></table></div>';
 return h;
}
function csv(x){let t=String(x??"");if(/^\s*[=+\-@]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"';}
function download(name,value,type){const blob=new Blob([value],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1250);}
function bind(d,ctx){
 const row=ctx.rows[ctx.rowIndex];row.luriaNotes||=[];
 const refresh=()=>{const target=document.getElementById("luriaResult");if(target)target.innerHTML=results(row.answers,row.luriaDelay);const tbody=document.querySelector('#luriaGroupSummary tbody');if(tbody)tbody.innerHTML=ctx.rows.map((u,i)=>{const z=score(d,u.answers);return '<tr><td>'+escape(u.name||'Код '+(i+1))+'</td><td>'+(z?.first??'–')+'</td><td>'+(z?.fifth??'–')+'</td><td>'+(z?.peak??'–')+'</td><td>'+(z?.delayed??'–')+'</td></tr>';}).join('');ctx.onChange?.();};
 document.querySelectorAll("[data-luria-word]").forEach(x=>x.addEventListener("change",()=>{row.answers[Number(x.dataset.luriaWord)]=x.checked?1:0;refresh();}));
 document.querySelectorAll("[data-luria-done]").forEach(x=>x.addEventListener("change",()=>{row.answers[60+Number(x.dataset.luriaDone)]=x.checked?1:0;refresh();}));
 document.querySelector('[data-luria-date]')?.addEventListener('change',e=>{row.luriaDate=e.target.value;});
 document.querySelector('[data-luria-delay]')?.addEventListener('input',e=>{row.luriaDelay=e.target.value;refresh();});
 document.querySelectorAll("[data-luria-note]").forEach(x=>x.addEventListener("input",()=>{const i=Number(x.dataset.luriaNote);row.luriaNotes[i] ||= {};row.luriaNotes[i].extra=x.value;}));

}

function report(d,records,mode,index){
 const selected=mode==="class"?records:[records[index]];
 if(!selected.length||selected.some(r=>!ready(r.answers)||!validDelay(r.luriaDelay)))return false;
 const rows=selected.map((r,i)=>{
  const z=score(d,r.answers),code=escape(r.name||"Код "+(i+1)),date=escape(r.luriaDate||"Не указана");
  const minutes=/^\d{1,3}$/.test(String(r.luriaDelay||""))&&Number(r.luriaDelay)>0?escape(r.luriaDelay)+" мин":"Не указано";
  const trace=z.trials.map((v,t)=>'<tr><td>'+(t+1)+'-я проба</td><td>'+v+' / 10</td><td>'+WORDS.filter((word,j)=>truth(r.answers[t*10+j])).map(escape).join(", ")+'</td><td>'+escape((r.luriaNotes||[])[t]?.extra||"–")+'</td></tr>').join("");
  const delay='<tr><td>Отсрочка ('+minutes+')</td><td>'+z.delayed+' / 10</td><td>'+WORDS.filter((word,j)=>truth(r.answers[50+j])).map(escape).join(", ")+'</td><td>'+escape((r.luriaNotes||[])[5]?.extra||"–")+'</td></tr>';
  return '<section class="person"><h2>Участник: '+code+'</h2><p>Первое предъявление: <b>'+z.first+'</b>. Пятое: <b>'+z.fifth+'</b>. Лучший результат: <b>'+z.peak+'</b>. Среднее пяти проб: <b>'+z.mean+'</b>. Отсроченная проба: <b>'+z.delayed+'</b>.</p>'+
   '<p>Дата обследования: '+date+'. Фактический интервал отсрочки: '+minutes+'.</p><table><thead><tr><th>Проба</th><th>Верные слова</th><th>Отмеченные слова</th><th>Повторы и посторонние слова</th></tr></thead><tbody>'+trace+delay+'</tbody></table></section>';
 }).join("");
 const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Заучивание 10 слов – отчет</title>'+
 '<style>@page{size:A4;margin:16mm}body{font:11pt/1.4 Arial,sans-serif;color:#27372d;max-width:850px;margin:auto;padding:20px}h1{font-size:19pt;color:#21674a}h2{font-size:14pt;color:#21674a}table{border-collapse:collapse;width:100%;table-layout:fixed}th,td{border:1px solid #9bafa2;padding:7px;text-align:left;overflow-wrap:anywhere}th:first-child{width:20%}th:nth-child(2){width:14%}th:nth-child(3){width:34%}.person{break-inside:avoid;margin:22px 0}.notice{padding:10px;background:#f1f6f2}.printbtn{padding:10px;background:#18794e;color:white;border:0}@media print{body{padding:0;max-width:none}.printbtn{display:none}.person{break-inside:auto}.person:not(:first-of-type){break-before:page}}</style></head><body>'+
 '<h1>Заучивание 10 слов – '+escape(d.author)+'</h1><p>Редакция: приложение 3, С. А. Налькин, 2021. Пять предъявлений, планируемая отсрочка 60 минут (фактическая указана отдельно).</p>'+
 '<p class="notice">Описательные результаты, не клинический диагноз и не оценка по возрастной норме. Указанное время отсрочки является временем протокола, фактический интервал следует фиксировать отдельно.</p>'+rows+
 '<p>Источник: '+escape(d.source)+'</p><button class="printbtn" onclick="window.print()">Распечатать / сохранить PDF</button></body></html>';
 download(mode==="class"?"luria_10_words_group_report.html":"luria_10_words_report.html",html,"text/html;charset=utf-8");return true;
}
function status(records,mode,index){
 const selected=mode==="class"?records:[records[index]];
 return selected.length>0&&selected.every(r=>ready(r.answers)&&validDelay(r.luriaDelay));
}
window.PSY_LURIA={words:WORDS.slice(),trials:TRIALS.slice(),score,completed,ready,status,report,grid,instruction,materials,processing,calculator,bind};
})();