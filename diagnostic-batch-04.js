"use strict";
/* Проверенные ключи PHQ-4 и GAD-7. Пункты здесь - краткие тематические
   подписи для переноса ответов с официального бланка, НЕ перевод анкеты. */
(function(){
const D=window.PSY_FULL_METHODS;
const GAD="GAD-7 - краткая шкала тревожных симптомов",PHQ="Краткий опросник PHQ-4";
const RESPONSE=["Ни разу","Несколько дней","Более половины дней","Почти каждый день"];
D[GAD]={
 author:"Р. Л. Спитцер, К. Кренке, Дж. Уильямс, Б. Леве (2006)",
 age:"Взрослые, 18+; применение у детей требует отдельной валидизации",
 kind:"Скрининговый опросник тревожных симптомов",
 count:"7 пунктов",
 goal:"Скрининг выраженности тревожных симптомов за последние две недели; не самостоятельный диагноз.",
 instructions:"Возьмите утвержденный русскоязычный бланк GAD-7 и отметьте для каждого из семи пунктов частоту проявлений за последние 14 дней. На сайте перенесите ответы в соответствующие строки.",
 questions:["Нервозность и напряжение","Трудность управлять волнением","Беспокойство по разным поводам","Трудно расслабиться","Беспокойная двигательная активность","Раздражительность","Опасение плохого события"],
 options:RESPONSE,
 scoring:"Каждый из семи ответов: от 0 до 3. Итог 0-21. Пропуски не заменяются нулем. Ориентиры для взрослых: 0-4, 5-9, 10-14, 15-21. Сумма 10+ - повод для дополнительной оценки специалистом.",
 interpret:"Более высокий балл соответствует большей выраженности симптомов. Категории предназначены для скрининга у взрослых; не являются диагнозом и не применяются автоматически к школьникам.",
 license:"Русскоязычный GAD-7 (Russian for Russia) опубликован с разрешением воспроизведения. Встроенные названия пунктов сокращены и служат только для ввода данных; для обследования используйте оригинальный PDF.",
 source:"https://www.nih.gov/node/19876",
 officialBlank:"https://projectteachny.org/app/uploads/2022/07/GAD7_Russian-for-Russia.pdf",
 sourceScoring:"https://site.thoracic.org/assemblies/pr/outcome-measures/anxiety-and-depression-outcome-measures",
 workflow:"diagnostic04",screenType:"gad7",calculator:true,
 scaleLabels:["Тревожные симптомы"]
};
D[PHQ]={
 author:"К. Кренке, Р. Спитцер, Дж. Уильямс, Б. Леве (2009); российская адаптация А. Золотаревой и соавт. (2024)",
 age:"Взрослые, 18-60 лет - возраст исследованной русской адаптации",
 kind:"Ультракраткий скрининговый опросник",
 count:"4 пункта, 2 подшкалы",
 goal:"Краткий скрининг тревожных и депрессивных симптомов за последние две недели.",
 instructions:"Проведите PHQ-4 по проверенному бланку выбранной языковой версии. Для четырех пунктов выберите частоту от 0 до 3. В Психотеку перенесите полученные ответы по порядку.",
 questions:["Нервозность и тревога","Беспокойство, которое трудно остановить","Снижение интереса и удовольствия","Подавленность и безнадежность"],
 options:RESPONSE,
 scoring:"Каждый пункт: 0-3. Всего: 0-12. Пункты 1-2: GAD-2 (0-6), пункты 3-4: PHQ-2 (0-6). Уровни общего показателя: 0-2, 3-5, 6-8, 9-12; значение 3 и выше на подшкале - скрининговый сигнал. Пропуски не приравниваются к нулю.",
 interpret:"Положительный скрининг означает необходимость дальнейшей оценки, но не подтверждает тревожное или депрессивное расстройство. Пороги и клиническое применение требуют учета конкретной русскоязычной адаптации.",
 license:"Названия четырех строк приведены как краткие смысловые подписи к переносу ответов, не как стандартизированный перевод. Для обследования используйте опубликованный русскоязычный вариант выбранной адаптации.",
 source:"https://publications.hse.ru/articles/938267647",
 officialBlank:"https://www.nih.gov/node/21506",
 sourceScoring:"https://www.oecd.org/en/publications/oecd-guidelines-on-measuring-subjective-well-being-2025-update_9203632a-en/full-report/core-and-extended-survey-modules_37f842ef.html",
 workflow:"diagnostic04",screenType:"phq4",calculator:true,
 scaleLabels:["GAD-2: тревожные симптомы","PHQ-2: депрессивные симптомы"]
};
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function score(d,answers){
 const n=d.questions.length;
 if(!Array.isArray(answers)||answers.length<n)return null;
 const items=answers.slice(0,n).map(x=>x===""||x===null||x===undefined?NaN:Number(x));
 if(items.some(x=>!Number.isInteger(x)||x<0||x>3))return null;
 const raw=items.reduce((a,b)=>a+b,0),max=n*3;
 const band=d.screenType==="gad7"?(raw<=4?"Минимальные симптомы":raw<=9?"Легкая выраженность":raw<=14?"Умеренная выраженность":"Высокая выраженность"):(raw<=2?"Минимальная":raw<=5?"Легкая":raw<=8?"Умеренная":"Высокая");
 const subscales=d.screenType==="phq4"?[
  {name:"Тревожные симптомы (GAD-2)",raw:items[0]+items[1],max:6},
  {name:"Депрессивные симптомы (PHQ-2)",raw:items[2]+items[3],max:6}
 ]:[];
 return {raw,max,band,subscales,answered:n,caption:"Скрининговый показатель, не диагноз"};
}
function materials(d,blank){
 const source='<p><a class="btn" href="'+esc(d.officialBlank)+'" target="_blank" rel="noopener noreferrer">Открыть проверенный бланк ↗</a></p>';
 const note='<div class="notice"><strong>Для проведения используйте документ первоисточника.</strong> Эта таблица - вспомогательный лист регистрации ответов, а не утвержденный перевод пунктов. Номера и порядок соответствуют выбранной версии.</div>';
 const head='<h3>Бланк регистрации ответов · '+esc(d.screenType.toUpperCase())+'</h3><p>Период: последние две недели. Код участника: _____________ Дата: _____________</p>';
 const rows=d.questions.map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(q)+'</td><td style="text-align:center">□ 0 &nbsp; □ 1 &nbsp; □ 2 &nbsp; □ 3</td></tr>').join("");
 return head+note+source+'<p><strong>Ответы:</strong> 0 - ни разу; 1 - несколько дней; 2 - более половины дней; 3 - почти каждый день.</p><table class="questions-table psy04-sheet"><thead><tr><th>№</th><th>Краткая метка пункта</th><th>Ответ</th></tr></thead><tbody>'+rows+'</tbody></table><p class="privacy-inline">Полный текст пунктов смотрите в исходном бланке. Не выдавайте эту регистрационную таблицу за стандартизированную анкету.</p>';
}
function processing(d){
 const extra=d.screenType==="phq4"?'<p>Отдельно рассчитываются GAD-2 (пункты 1-2) и PHQ-2 (пункты 3-4) по 0-6 баллов. От 3 баллов на любой из этих подшкал - повод для более подробного скрининга и профессиональной оценки, а не установленный диагноз.</p>':
 '<p>У взрослых сумма 5, 10 и 15 разделяет ориентировочную выраженность тревожных симптомов. При 10 баллах и более показана дополнительная оценка специалистом.</p>';
 return '<h3>Подсчет результатов</h3><p>'+esc(d.scoring)+'</p>'+extra+
 '<h3>Ограничения</h3><div class="notice">'+esc(d.interpret)+'</div>'+
 '<h3>Проверяемые документы</h3><p><a href="'+esc(d.sourceScoring)+'" target="_blank" rel="noopener noreferrer">Схема подсчета ↗</a></p>';
}
function scoreView(d,a){
 const n=d.questions.length;
 const done=Array.from({length:n},(_,i)=>a?.[i]).filter(v=>v!==null&&v!==undefined&&v!==""&&Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<=3).length;
 const result=score(d,a);
 let s='<section class="psy04-result"><div class="psy04-progress"><strong>Заполнено '+done+' из '+n+'</strong><div class="psy04-track"><span style="width:'+(done/n*100)+'%"></span></div></div>';
 if(!result)return s+'<p>Подсчет станет доступен после заполнения всех '+n+' пунктов. Пропуски не считаются нулевыми ответами.</p></section>';
 s+='<div class="psy04-score"><div><strong>Общая сумма</strong><b>'+result.raw+' из '+result.max+'</b></div><div class="psy04-track"><span style="width:'+(result.raw/result.max*100)+'%"></span></div><p>'+esc(result.band)+' выраженность по исходной шкале (ориентир для взрослых).</p></div>';
 for(const sub of result.subscales){
  s+='<div class="psy04-sub"><strong>'+esc(sub.name)+'</strong><b>'+sub.raw+' / '+sub.max+'</b><div class="psy04-track"><span style="width:'+(sub.raw/sub.max*100)+'%"></span></div><p>'+(sub.raw>=3?'Скрининговый сигнал для дальнейшей оценки.':'Ниже опубликованного скринингового порога.')+'</p></div>';
 }
 s+='<div class="notice">Это результат скрининга, не диагноз. При выраженных жалобах специалист оценивает ситуацию независимо от набранной суммы.</div></section>';
 return s;
}
function calculator(d,ctx){
 const rows=ctx.rows.length?ctx.rows:[{name:"",answers:[]}];const row=rows[ctx.rowIndex]||rows[0];const answers=row.answers||[];
 const n=d.questions.length;
 let s='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
 s+='<div class="notice">Переносите ответы с <a target="_blank" rel="noopener noreferrer" href="'+esc(d.officialBlank)+'">официального бланка ↗</a>. Сокращенные подписи ниже служат только для ввода баллов. Данные обрабатываются на этом устройстве без отправки на сервер.</div>';
 if(ctx.calcMode==="class")s+='<div class="group-tools"><label>Участник<select id="participantSelect">'+rows.map((r,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?'selected':'')+'>'+(i+1)+'. '+esc(r.name||'Участник '+(i+1))+'</option>').join("")+'</select></label><label>Имя или код<input id="participantName" value="'+esc(row.name||"")+'" placeholder="Необязательно"></label><button class="btn" id="addParticipant">Добавить</button></div>';
 s+='<h3>Перенос ответов</h3><div class="psy04-grid">'+d.questions.map((q,i)=>'<label class="psy04-item"><span><b>'+(i+1)+'.</b> '+esc(q)+'</span><select class="psy04-answer" data-i="'+i+'" aria-label="Ответ на пункт '+(i+1)+'"><option value="">- Не заполнено -</option>'+RESPONSE.map((text,n)=>'<option value="'+n+'" '+(String(answers[i])===String(n)?'selected':'')+'>'+n+' - '+esc(text)+'</option>').join("")+'</select></label>').join("")+'</div>';
 s+='<div id="psy04Result">'+scoreView(d,answers)+'</div>';
 s+='<div class="psy04-tools"><button class="btn" id="resetParticipant">Очистить ответы участника</button><button class="btn primary" data-psy04-download>Скачать результат JSON</button></div>';
 if(ctx.calcMode==="class")s+='<h3>Результаты группы</h3><div class="results-table"><table><thead><tr><th>Код участника</th><th>Сумма</th>'+(d.screenType==="phq4"?'<th>GAD-2</th><th>PHQ-2</th>':"")+'</tr></thead><tbody>'+rows.map((r,i)=>{const z=score(d,r.answers);return '<tr><td>'+esc(r.name||'Участник '+(i+1))+'</td><td>'+(z?z.raw:"-")+'</td>'+(d.screenType==="phq4"?'<td>'+(z?z.subscales[0].raw:"-")+'</td><td>'+(z?z.subscales[1].raw:"-")+'</td>':"")+'</tr>'}).join("")+'</tbody></table></div><div class="psy04-tools"><button class="btn primary" data-psy04-export>Скачать результаты группы CSV</button></div>';
 return s;
}
function download(name,text,type){
 const b=new Blob([text],{type}),url=URL.createObjectURL(b),a=document.createElement("a");
 a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),300);
}
function bind(d,ctx){
 document.querySelectorAll(".psy04-answer").forEach(el=>el.addEventListener("change",()=>{
  ctx.rows[ctx.rowIndex].answers[+el.dataset.i]=el.value;
  const result=document.querySelector("#psy04Result");if(result)result.innerHTML=scoreView(d,ctx.rows[ctx.rowIndex].answers);
 }));
 document.querySelector("[data-psy04-download]")?.addEventListener("click",()=>{
  const r=ctx.rows[ctx.rowIndex],payload={method:d.screenType,version:"проверенный ключ, 2026-10-25",code:r.name||"",responses:r.answers||[],result:score(d,r.answers||[]),source:d.sourceScoring};
  download(d.screenType+"_rezultat.json",JSON.stringify(payload,null,2),"application/json;charset=utf-8");
 });
 document.querySelector("[data-psy04-export]")?.addEventListener("click",()=>{
  const header=["Код","Сумма",...(d.screenType==="phq4"?["GAD-2","PHQ-2"]:[])];
  const all=[header,...ctx.rows.map((r,i)=>{const z=score(d,r.answers);return [r.name||"Участник "+(i+1),z?.raw??"",...(d.screenType==="phq4"?[z?.subscales[0].raw??"",z?.subscales[1].raw??""]:[])];})];
  const csv="\uFEFF"+all.map(row=>row.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(";")).join("\r\n");
  download(d.screenType+"_gruppa.csv",csv,"text/csv;charset=utf-8");
 });
}
window.PSY_DIAG04={score,materials,processing,calculator,bind};
})();