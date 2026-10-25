"use strict";
/* А. Р. Лурия: пять чтений + отсроченное воспроизведение.
   Стимулы взяты из приложения 3 диссертации С. А. Налькина (2021).
   Основной текст той же работы содержит «огонь» вместо «окно»:
   это отмечено как разночтение редакций; нельзя их смешивать. */
(function(){
const NAME="Заучивание 10 слов";
const WORDS=["лес","хлеб","окно","стул","вода","брат","конь","гриб","игла","мёд"];
const SOURCE="https://www.almazovcentre.ru/wp-content/uploads/%D0%94%D0%B8%D1%81%D1%81%D0%95%D0%A0%D0%A2%D0%90%D0%A6%D0%98%D0%AF-%D0%9D%D0%B0%D0%BB%D0%AC%D0%9A%D0%98%D0%9D-%D0%A1.%D0%90.1.pdf";
const SECOND="https://www.mediasphera.ru/issues/khirurgiya-zhurnal-im-n-i-pirogova/2013/2/030023-12072013215";
const TRIALS=["1-е предъявление","2-е предъявление","3-е предъявление","4-е предъявление","5-е предъявление","Через 60 минут"];
const CAUTION="Методика имеет разные списки слов и количество предъявлений. В приложении 3 выбранного опубликованного источника указано «окно», тогда как в тексте того же исследования встречается «огонь». В нашем комплекте используются строго 10 слов приложения 3 и пять предъявлений. Отсроченная проба — через 60 минут без повторного чтения. Возрастные нормы и диагностические категории не переносятся из иных редакций.";
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
 author:"А. Р. Лурия",age:"Школьники и взрослые; для нормативной оценки необходима возрастная редакция",
 kind:"Диагностическая проба слухоречевой памяти",
 count:"10 слов × 5 предъявлений + отсроченная проба через 60 минут",
 goal:"Описать объем непосредственного воспроизведения, динамику запоминания и сохранение слов после отсрочки.",
 instructions:"Специалист зачитывает один и тот же список из 10 слов четко и ровно, через 1–2 секунды между словами. После каждой из пяти проб участник называет все, что запомнил, в любом порядке. Специалист отмечает каждое верно названное слово один раз за пробу, а посторонние слова и повторы регистрирует отдельно. Через 60 минут испытуемый воспроизводит список без повторного предъявления.",
 scoring:"В каждой пробе подсчитываются уникальные слова из исходного списка (от 0 до 10), пять итогов образуют кривую заучивания. Отдельно указываются количество слов после первой и пятой проб, максимальное количество и отсроченное воспроизведение через 60 минут. Повторы и «лишние» слова записываются как качественные ошибки и не прибавляются к количеству правильных.",
 interpret:"Оценка описательная: изменение по пяти пробам, сохранение материала через час, посторонние слова, повторы, поведение. Отсрочка не должна выдаваться за выполненную без отметки специалиста. Нормативные ярлыки и клинический диагноз по одной пробе не ставятся.",
 source:SOURCE,officialBlank:SOURCE,sourceAlternative:SECOND,
 warning:CAUTION,guideFile:"downloads/luria_10_words_guide.docx",
 answerFile:"downloads/luria_10_words_psychologist.html",workflow:"luria10x5",special:"memory10",calculator:true,
 words:WORDS.slice(),scaleLabels:["Непосредственное воспроизведение","Кривая заучивания (5 предъявлений)","Отсроченное воспроизведение (60 минут)","Посторонние слова и повторы"],
 questions:TRIALS.slice()
});
D[NAME]=d;
function sourceLinks(d){return '<div class="psy-luria-links"><a class="btn primary" href="'+escape(d.guideFile)+'" download>Методика и протокол · Word</a><a class="btn" href="'+escape(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Бланк психолога · А4 ↗</a><a class="btn" href="'+escape(d.sourceAlternative)+'" target="_blank" rel="noopener noreferrer">Описание процедуры ↗</a></div>';}
function instruction(d){
 return '<h3>Инструкция и порядок проведения</h3><p>'+escape(d.instructions)+'</p>'+sourceLinks(d)+
 '<h3>Список для чтения специалистом</h3><div class="psy-luria-words">'+WORDS.map((w,i)=>'<span><b>'+(i+1)+'</b> '+escape(w)+'</span>').join("")+'</div>'+
 '<p><strong>Произнесите:</strong> «Я прочту несколько слов. После того как я закончу, повтори столько слов, сколько сможешь, в любом порядке». Далее используйте тот же порядок 5 раз, записывая ответы в отдельную строку каждого предъявления.</p>'+
 '<p>При отсроченной пробе через 60 минут слова повторно не читайте. Фиксируйте реальное время отсрочки в бумажном протоколе.</p>'+
 '<div class="notice psy-luria-caution">'+escape(d.warning)+'</div>';
}
function grid(d,preview=false){
 let html='<div class="psy-luria-grid-wrap"><table class="psy-luria-grid"><thead><tr><th>Проба</th>'+WORDS.map(w=>'<th>'+escape(w)+'</th>').join("")+'<th>Итог</th></tr></thead><tbody>';
 html+=TRIALS.map((label,i)=>'<tr><th>'+escape(label)+'</th>'+WORDS.map(()=>'<td>□</td>').join("")+'<td>—</td></tr>').join("")+'</tbody></table></div>';return html;
}
function materials(d){return '<h3>Бланк психолога</h3><div class="notice">Вместо бланка для чтения ребенком используется таблица регистрации. Слова предъявляются <strong>только на слух</strong>; участнику эту таблицу не показывают.</div>'+sourceLinks(d)+grid(d)+'<p>В печатном бланке дополнительно предусмотрены строки для посторонних слов, повторов и времени отсроченного воспроизведения.</p>';}
function processing(d){return '<h3>Обработка</h3><p>'+escape(d.scoring)+'</p><div class="psy-luria-concepts"><div><strong>0–10</strong><small>Уникальных правильных слов в одной пробе</small></div><div><strong>5</strong><small>Последовательных предъявлений</small></div><div><strong>60 мин</strong><small>Отсрочка без повторного чтения</small></div></div>'+
 '<p>В электронной форме нужно отметить, какие именно слова названы, и завершение каждой из пяти проб. Важная проверка: <b>0 названных слов</b> и <b>не проведенная проба</b> — разные ситуации.</p>'+
 '<div class="notice psy-luria-caution">'+escape(d.warning)+'</div>'+sourceLinks(d);}
function results(a){
 let done=Array.from({length:5},(_,i)=>completed(a,i)).filter(Boolean).length;
 const res=score(d,a);let h='<section class="psy-luria-results"><h3>Профиль запоминания</h3>';
 if(!res)return h+'<p>Проведено '+done+' из 5 обязательных проб. Отмечайте флажок «Проба завершена» в каждой строке, даже если не названо ни одного слова.</p></section>';
 const stats=[["1-я проба",res.first],["5-я проба",res.fifth],["Лучший результат",res.peak],["Среднее за 5 проб",res.mean],["Изменение 5-я − 1-я",res.gain],["Через 60 минут",res.delayed??"—"]];
 h+='<div class="psy-luria-stats">'+stats.map(([l,v])=>'<div><span>'+escape(l)+'</span><strong>'+v+'</strong></div>').join("")+'</div>';
 h+='<h4>Кривая по пяти предъявлениям</h4><div class="psy-luria-bars">'+res.trials.map((v,i)=>'<div><span>'+(i+1)+'</span><div class="psy-luria-track"><i style="width:'+(v*10)+'%"></i></div><b>'+v+' / 10</b></div>').join("")+'</div>';
 if(res.delayed===null)h+='<p><strong>Отсроченная проба не проведена или не отмечена.</strong> Это не нулевой результат.</p>';
 h+='<div class="notice">Описательная кривая; нормативные возрастные уровни автоматически не назначаются.</div></section>';return h;
}
function calculator(d,ctx){
 const rs=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rs[ctx.rowIndex]||rs[0],a=r.answers||[],notes=r.luriaNotes||[];
 let h='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа по кодам</button></div>'+
 '<div class="notice">Внесите услышанные ответы после предъявления слов. Ставьте галочку «Проба завершена», даже если воспроизведено 0 слов. <strong>Шестая строка — только через 60 минут, без повторного чтения.</strong></div>';
 if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Участник<select id="participantSelect">'+rs.map((u,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+(i+1)+'. '+escape(u.name||"Код "+(i+1))+'</option>').join("")+'</select></label><label>Код, не ФИО<input id="participantName" value="'+escape(r.name||"")+'" placeholder="Код"></label><button class="btn" id="addParticipant">Добавить</button></div>';
 h+='<div class="psy-luria-trials">';
 TRIALS.forEach((label,t)=>{
  h+='<section class="psy-luria-trial"><div class="psy-luria-trial-head"><h4>'+escape(label)+'</h4><label><input type="checkbox" data-luria-done="'+t+'" '+(completed(a,t)?'checked':'')+'> Проба завершена</label></div>'+
  '<div class="psy-luria-choices">'+WORDS.map((word,j)=>'<label><input type="checkbox" data-luria-word="'+(t*10+j)+'" '+(truth(a[t*10+j])?'checked':'')+'> '+escape(word)+'</label>').join("")+'</div>'+
  '<div class="psy-luria-notes"><label>«Лишние» слова / повторы<textarea data-luria-note="'+t+'" rows="2" placeholder="Посторонние слова и повторы отдельно">'+escape(notes[t]?.extra||"")+'</textarea></label></div></section>';
 });
 h+='</div><div id="luriaResult">'+results(a)+'</div>'+
 '<div class="psy-luria-actions"><button class="btn" id="resetParticipant">Очистить запись</button><button class="btn primary" id="luriaJSON">Скачать индивидуальный протокол JSON</button></div>';
 if(ctx.calcMode==="class")h+='<h3>Сводка участников</h3><div class="results-table"><table><thead><tr><th>Код</th><th>1-я</th><th>5-я</th><th>Пик</th><th>Через 60 мин</th></tr></thead><tbody>'+rs.map((u,i)=>{let z=score(d,u.answers);return '<tr><td>'+escape(u.name||"Код "+(i+1))+'</td><td>'+(z?.first??"—")+'</td><td>'+(z?.fifth??"—")+'</td><td>'+(z?.peak??"—")+'</td><td>'+(z?.delayed??"—")+'</td></tr>';}).join("")+'</tbody></table></div><div class="psy-luria-actions"><button class="btn primary" id="luriaCSV">Скачать CSV группы</button></div>';
 return h;
}
function csv(x){let t=String(x??"");if(/^\s*[=+\-@]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"';}
function download(name,value,type){const blob=new Blob([value],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1250);}
function bind(d,ctx){
 const row=ctx.rows[ctx.rowIndex];row.luriaNotes||=[];
 const refresh=()=>{const target=document.getElementById("luriaResult");if(target)target.innerHTML=results(row.answers);};
 document.querySelectorAll("[data-luria-word]").forEach(x=>x.addEventListener("change",()=>{row.answers[Number(x.dataset.luriaWord)]=x.checked?1:0;refresh();}));
 document.querySelectorAll("[data-luria-done]").forEach(x=>x.addEventListener("change",()=>{row.answers[60+Number(x.dataset.luriaDone)]=x.checked?1:0;refresh();}));
 document.querySelectorAll("[data-luria-note]").forEach(x=>x.addEventListener("input",()=>{const i=Number(x.dataset.luriaNote);row.luriaNotes[i] ||= {};row.luriaNotes[i].extra=x.value;}));
 document.getElementById("luriaJSON")?.addEventListener("click",()=>download("luria_10words_protocol.json",JSON.stringify({method:NAME,version:"10 words appendix 3, 5 exposures + 60 min",code:row.name||"",words:WORDS,answers:row.answers||[],errors:row.luriaNotes||[],result:score(d,row.answers),source:d.source,warning:d.warning},null,2),"application/json;charset=utf-8"));
 document.getElementById("luriaCSV")?.addEventListener("click",()=>{const data=[["Код","1","2","3","4","5","Через 60 мин","Пик"],...ctx.rows.map((p,i)=>{const z=score(d,p.answers);return [p.name||"Код "+(i+1),...(z?.trials||["","","","",""]),z?.delayed??"",z?.peak??""];})];download("luria_10words_group.csv","\uFEFF"+data.map(r=>r.map(csv).join(";")).join("\r\n"),"text/csv;charset=utf-8");});
}
window.PSY_LURIA={words:WORDS.slice(),trials:TRIALS.slice(),score,completed,grid,instruction,materials,processing,calculator,bind};
})();