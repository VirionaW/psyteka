"use strict";
(function(){
 const NAME="Исключение четвертого лишнего (словесный вариант)";
 const TASKS=[
  {words:["яблоко","груша","слива","огурец"],odd:4,why:"Три фрукта; огурец — овощ в бытовой учебной классификации"},
  {words:["стол","стул","шкаф","чайник"],odd:4,why:"Три предмета мебели; чайник — посуда"},
  {words:["воробей","голубь","ласточка","бабочка"],odd:4,why:"Три птицы; бабочка — насекомое"},
  {words:["январь","март","сентябрь","среда"],odd:4,why:"Три месяца; среда — день недели"},
  {words:["карандаш","ручка","фломастер","ластик"],odd:4,why:"Три принадлежности для письма или рисования; ластик предназначен для стирания"},
  {words:["треугольник","квадрат","прямоугольник","шар"],odd:4,why:"Три плоские геометрические фигуры; шар — объемное тело"},
  {words:["сосна","ель","пихта","береза"],odd:4,why:"Три хвойных дерева; береза — лиственное"},
  {words:["сапоги","ботинки","кроссовки","перчатки"],odd:4,why:"Три вида обуви; перчатки надевают на руки"},
  {words:["автобус","трамвай","троллейбус","самолет"],odd:4,why:"Три вида наземного общественного транспорта; самолет — воздушный транспорт"},
  {words:["линейка","рулетка","сантиметровая лента","термометр"],odd:4,why:"Три прибора для измерения длины; термометр измеряет температуру"},
  {words:["медведь","волк","лиса","ворона"],odd:4,why:"Три млекопитающих; ворона — птица"},
  {words:["слушать","слышать","различать звуки","рассматривать"],odd:4,why:"Первые три связаны со слуховым восприятием; рассматривать — со зрением"}
 ];
 const NOTE="Учебно-диагностический словесный набор составлен Метоларией, а не является стандартизованной авторской методикой. Ответы ребенка анализирует специалист. Пояснение важнее механического выбора: альтернативное исключение может быть логически обоснованным. Баллы 0–24 — локальная описательная шкала выполнения, без возрастных нормативов и диагноза.";
 const D={
 author:"Рабочий стимульный материал и алгоритм регистрации — Метолария; тип задания — «исключение четвертого лишнего», широко используемая психологическая диагностическая проба",
 age:"Ориентировочно младший школьный возраст (2–5 классы); подбирать с учетом словаря и образовательного опыта",
 kind:"Вербальная классификационная проба; экспертная оценка ответа",
 count:"12 заданий по четыре слова; выбор лишнего и словесное объяснение",
 goal:"Оценка способа категоризации, выделения существенного общего признака, речевого обобщения и объяснения выбора",
 instructions:"Последовательно предъявите 12 наборов из четырех слов. Попросите определить лишнее слово и объяснить почему. Фиксируйте выбор, ответ дословно, наличие помощи, альтернативные обоснования. Оценивайте каждое задание экспертно 0, 1 или 2 балла; не опирайтесь только на правильность выбора.",
 scoring:"2 балла — обоснованное выделение общего категориального признака трех слов и исключение четвертого; логически состоятельная альтернативная классификация тоже может получить 2. 1 балл — выбор без достаточного объяснения, частичное или ситуативное обобщение, обоснование с подсказкой. 0 баллов — отсутствие ответа либо нерелевантная классификация. Сумма 0–24; пропуски не считаются нулем и блокируют общий результат.",
 interpret:"Число баллов — описательный итог конкретных заданий. Возрастных стандартных порогов и автоматической диагностики не предусмотрено. Для заключения требуется качественный анализ объяснений, помощь специалиста, речевой опыт, особенности понимания инструкции.",
 warning:NOTE,questions:TASKS.map(t=>t.words.join(" · ")),items:TASKS,
 options:["0 — ответ отсутствует / не обоснован","1 — частичный ответ / с подсказкой","2 — логическое обобщение и объяснение"],
 guideFile:"downloads/fourth_odd_verbal_guide.docx",answerFile:"downloads/fourth_odd_verbal_student.html",
 source:"https://psyjournals.ru/",officialBlank:"downloads/fourth_odd_verbal_student.html",
 workflow:"odd4verbal",calculator:true,license:"Все 12 словесных заданий, бланк и балльный протокол подготовлены Метоларией как самостоятельный набор; стандартизованные возрастные нормы не заявляются."
 };
 (window.PSY_FULL_METHODS||(window.PSY_FULL_METHODS={}))[NAME]=D;
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const valid=v=>(typeof v==="number"&&Number.isInteger(v)&&v>=0&&v<=2)||(typeof v==="string"&&/^[0-2]$/.test(v));
 function score(d,a){if(!Array.isArray(a)||a.length<12||Array.from({length:12},(_,i)=>a[i]).some(v=>!valid(v)))return null;const values=a.slice(0,12).map(Number);return {raw:values.reduce((n,v)=>n+v,0),max:24,complete:true,answers:values};}
 const filled=a=>Array.from({length:12},(_,i)=>a?.[i]).filter(valid).length;
 const links=()=>'<div class="odd4-links"><a class="btn primary" href="'+D.guideFile+'" download>Методика · Word</a><a class="btn" href="'+D.answerFile+'" target="_blank" rel="noopener noreferrer">Бланк ученика · А4</a></div>';
 function instruction(){return '<h3>Проведение</h3><ol><li>Проверяйте понимание слов. Предъявляйте задания в порядке 1–12, не подсказывайте обобщающий признак.</li><li>На каждом шаге спросите: «Какое слово лишнее? Почему?».</li><li>Зафиксируйте названное слово и дословное объяснение. Если ответ неоднозначен, задайте нейтральный вопрос на уточнение.</li><li>Проводите качественную оценку 0–2 по объяснению, а не автоматическую проверку совпадения с ключом.</li><li>Итог трактуйте описательно с учетом словарного запаса и объема помощи.</li></ol><blockquote class="kid-instruction">В каждой строке четыре слова. Выбери одно, которое, по твоему мнению, не подходит к остальным, и объясни почему. Иногда можно придумать разные хорошие объяснения.</blockquote><div class="notice odd4-note">'+esc(NOTE)+'</div>'+links();}
 function materials(){return '<h3>Стимульные слова и лист ответов</h3><p>Материал содержит 12 самостоятельных авторских заданий Метоларии. На ученическом листе предусмотрено место для ответа и объяснения.</p><div class="odd4-sheet">'+TASKS.map((t,i)=>'<div><b>'+(i+1)+'.</b> '+t.words.map(esc).join(' · ')+'</div>').join('')+'</div>'+links();}
 function processing(){return '<h3>Экспертная шкала</h3><p><b>2</b> — категория и исключение обоснованы, включая разумную альтернативную классификацию. <b>1</b> — выбор без объяснения, с помощью или частичный признак. <b>0</b> — нет ответа или обоснование не относится к словам. Один пропуск блокирует общий итог, но заполненные строки сохраняются.</p><h3>Ориентировочные авторские варианты</h3><p>Это не единственно правильные варианты. Оценивайте содержание ответа, а не номер «лишнего».</p><div class="odd4-table"><table><thead><tr><th>№</th><th>Один из возможных ответов</th><th>Объяснение</th></tr></thead><tbody>'+TASKS.map((t,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(t.words[t.odd-1])+'</td><td>'+esc(t.why)+'</td></tr>').join('')+'</tbody></table></div><div class="notice odd4-note">'+esc(NOTE)+'</div>';}
 function results(r){const z=score(D,r.answers),n=filled(r.answers);return '<section class="odd4-result"><h3>Экспертная обработка</h3><p>Оценено <b>'+n+' из 12</b> заданий</p>'+(z?'<strong>'+z.raw+' / 24</strong><p>Баллы показывают качество выполнения этого набора; возрастные категории не присваиваются.</p>':'<p>Для общего итога требуется оценка всех 12 объяснений. Пропуск не равен 0.</p>')+'</section>';}
 function summary(rows){return '<div class="odd4-table"><table><thead><tr><th>Код</th><th>Проверено</th><th>Сумма</th></tr></thead><tbody>'+rows.map((r,i)=>{const z=score(D,r.answers);return '<tr><td>'+esc(r.name||"У-"+(i+1))+'</td><td>'+filled(r.answers)+'/12</td><td>'+(z?z.raw+' / 24':'—')+'</td></tr>'}).join('')+'</tbody></table></div>';}
 function calculator(d,ctx){const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],a=r.answers||[];
 let h='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ученик</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Класс / группа</button></div>';
 if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Ученик<select id="participantSelect">'+rows.map((x,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(x.name||"У-"+(i+1))+'</option>').join('')+'</select></label><label>Код<input id="participantName" value="'+esc(r.name||"")+'" maxlength="40"></label><button class="btn" id="addParticipant">Добавить</button></div>';
 else h+='<label class="odd4-code">Код ученика<input id="odd4Code" value="'+esc(r.name||"")+'" placeholder="У-01" maxlength="40"></label>';
 h+='<div class="notice odd4-note">Баллы экспертные: сначала заслушайте объяснение ребенка, затем выставьте 0, 1 или 2. Логичные альтернативные решения допускаются.</div><div class="odd4-grid">'+TASKS.map((t,i)=>'<label class="odd4-item"><span><b>'+(i+1)+'.</b> '+t.words.map(esc).join(' · ')+'</span><select data-odd4-answer="'+i+'"><option value="">— не оценено —</option>'+[0,1,2].map(v=>'<option value="'+v+'" '+(valid(a[i])&&Number(a[i])===v?"selected":"")+'>'+v+' балл'+(v===1?'':'а')+'</option>').join('')+'</select></label>').join('')+'</div><div id="odd4Results">'+results(r)+'</div><div class="odd4-actions"><button class="btn" id="odd4Clear">Очистить</button><button class="btn primary" id="odd4Report">Скачать протокол</button></div>';
 if(ctx.calcMode==="class")h+='<h3>Результаты класса</h3><div id="odd4Group">'+summary(rows)+'</div><div class="odd4-actions"><button class="btn" id="nextParticipant">Следующий</button><button class="btn primary" id="odd4Csv">CSV для Excel</button></div>';
 return h;}
 function save(name,content,type){const u=URL.createObjectURL(new Blob([content],{type})),x=document.createElement('a');x.href=u;x.download=name;x.click();setTimeout(()=>URL.revokeObjectURL(u),1200);}
 function csvCell(x){let s=String(x??'');if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
 function bind(d,ctx){const rows=ctx.rows||[],r=rows[ctx.rowIndex];if(!r)return;r.answers||=[];
 const refresh=()=>{const a=document.getElementById("odd4Results");if(a)a.innerHTML=results(r);const b=document.getElementById("odd4Group");if(b)b.innerHTML=summary(rows)};
 document.getElementById("odd4Code")?.addEventListener("input",e=>r.name=e.target.value);
 document.querySelectorAll("[data-odd4-answer]").forEach(el=>el.addEventListener('change',()=>{r.answers[Number(el.dataset.odd4Answer)]=el.value===''?'':Number(el.value);refresh()}));
 document.getElementById("odd4Clear")?.addEventListener('click',()=>{if(!confirm('Очистить оценки?'))return;r.answers=[];document.querySelectorAll("[data-odd4-answer]").forEach(el=>el.value='');refresh()});
 document.getElementById("odd4Report")?.addEventListener('click',()=>{const z=score(d,r.answers);if(!z){alert('Нужно оценить все 12 заданий.');return}
 const content='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Протокол · четвертый лишний</title><style>@page{size:A4;margin:15mm}body{font:13px Arial;color:#263d31}td,th{border:1px solid #acc3b4;padding:9px}table{border-collapse:collapse;width:100%}</style></head><body><h1>Исключение четвертого лишнего · словесный вариант</h1><p>Условный код: '+esc(r.name||'не указан')+'</p><p>Результат: '+z.raw+' / 24 (описательная оценка без нормативов).</p><table><thead><tr><th>Задание</th><th>Баллы</th></tr></thead><tbody>'+z.answers.map((n,i)=>'<tr><td>'+(i+1)+'</td><td>'+n+'</td></tr>').join('')+'</tbody></table><p>'+esc(NOTE)+'</p></body></html>';
 save('fourth_odd_protocol.html',content,'text/html;charset=utf-8')});
 document.getElementById('odd4Csv')?.addEventListener('click',()=>{const out=[['Код','Оценено','Сумма 0–24',...Array.from({length:12},(_,i)=>'Задание '+(i+1))]];
 rows.forEach((x,i)=>{const z=score(d,x.answers);out.push([x.name||'У-'+(i+1),filled(x.answers),z?.raw??'',...Array.from({length:12},(_,j)=>valid(x.answers?.[j])?Number(x.answers[j]):'')])});
 save('fourth_odd_class.csv','\uFEFF'+out.map(row=>row.map(csvCell).join(';')).join('\r\n'),'text/csv;charset=utf-8')});
 }
 window.PSY_ODD4={score,filled,instruction,materials,processing,calculator,bind,results,tasks:TASKS};
})();