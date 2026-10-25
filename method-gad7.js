"use strict";
(function(){
 const NAME="GAD-7 - краткая шкала тревожных симптомов";
 const SOURCE="https://bazanpa.ru/minzdrav-rossii-klinicheskie-rekomendatsii-ot01012024-h6495421/";
 const ORIGINAL="https://www.phqscreeners.com/select-screener";
 const VALIDATION="https://doi.org/10.17759/cpp.2023310402";
 const YOUTH="https://pubmed.ncbi.nlm.nih.gov/29069107/";
 const GUIDE="downloads/gad7_method_guide.docx", BLANK="downloads/gad7_student_a4.html";
 const ITEMS=[
  "Чувство нервозности, тревоги или внутреннего напряжения",
  "Трудности с тем, чтобы перестать волноваться или управлять тревожными мыслями",
  "Слишком частое беспокойство о различных событиях и обстоятельствах",
  "Сложно расслабиться, даже когда есть возможность",
  "Неусидчивость, из-за которой трудно оставаться на месте",
  "Легко возникает раздражение или досада",
  "Страх, что может случиться что-то плохое"
 ];
 const OPTIONS=["Совсем не беспокоило","Несколько дней","Более половины дней","Почти каждый день"];
 const EFFECT=["Совсем не затрудняло","Несколько затрудняло","Сильно затрудняло","Очень сильно затрудняло"];
 const WARNING="Фразы вопросов в Психотеке — самостоятельные рабочие русские формулировки смысловых пунктов GAD-7, а не подтверждённый текст русской адаптации. Для стандартизированного обследования используйте проверенную русскоязычную версию (Минздрав РФ, приложение Г2) или официальный бланк издателя. Пороговые категории первоначально разработаны для взрослых и не являются российскими возрастными нормами для школьников.";
 const d={
   author:"Р. Л. Спитцер, К. Кронке, Дж. Б. Уильямс, Б. Лёве (R. L. Spitzer, K. Kroenke, J. B. W. Williams, B. Löwe), 2006",
   age:"Для самоотчёта старших школьников и подростков — при проверенной возрастной и языковой версии. Первичные нормативные интервалы получены для взрослых; для младших школьников без отдельной валидации не использовать как возрастную норму.",
   kind:"Скрининговый самоотчёт тревожных симптомов, 7 пунктов, ответы 0–3",
   count:"7 пунктов (0–21 балл); отдельно необязательный вопрос о влиянии на повседневную жизнь",
   goal:"Предварительная оценка выраженности тревожных симптомов за последние две недели в рамках профессионального обследования.",
   instructions:"Предъявите полный проверенный текст GAD-7. Ученик оценивает, как часто его беспокоили семь описанных проявлений за последние две недели: 0 — совсем нет, 1 — несколько дней, 2 — больше половины дней, 3 — почти каждый день. Ответы 1–7 суммируются. Дополнительный вопрос о затруднениях не включается в сумму.",
   scoring:"Все семь пунктов являются прямыми. Сумма GAD-7 = ответы на пункты 1–7, диапазон 0–21. Пустой ответ не равен нулю; показатель не рассчитывается, если есть хотя бы один пропуск или недопустимое значение. Контроль: семь нулей = 0; семь троек = 21; 3+2+1+0+3+2+1 = 12. Оригинальные описательные диапазоны 0–4, 5–9, 10–14, 15–21 относятся к опубликованным выборкам; на сайте не используются для автоматической диагностики несовершеннолетних.",
   interpret:"Большая сумма отражает более частые тревожные проявления за последние две недели. Описательные диапазоны взрослых: 0–4 минимальные, 5–9 слабые, 10–14 умеренные, 15–21 выраженные. Шкала не ставит диагноз генерализованного тревожного расстройства. Данные о влиянии на повседневную жизнь и индивидуальная беседа особенно важны независимо от итоговой суммы; при обследовании детей требуются подходящие возрастные нормы.",
   warning:WARNING,
   questions:ITEMS,options:OPTIONS.map((s,i)=>i+" — "+s),
   source:SOURCE,officialBlank:SOURCE,sourceOriginal:ORIGINAL,sourceValidation:VALIDATION,
   guideFile:GUIDE,answerFile:BLANK,
   calculator:true,workflow:"gad7",
   license:"Разработчики GAD-7 и Pfizer разрешают воспроизведение, перевод и распространение без отдельного разрешения. Рабочие русские формулировки Психотеки не маркируются как стандартизированная версия."
 };
 (window.PSY_FULL_METHODS||(window.PSY_FULL_METHODS={}))[NAME]=d;
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const valid=x=>x===0||x===1||x===2||x===3||x==="0"||x==="1"||x==="2"||x==="3";
 const validImpact=x=>x===0||x===1||x===2||x===3||x==="0"||x==="1"||x==="2"||x==="3";
 const count=a=>Array.from({length:7},(_,i)=>a?.[i]).filter(valid).length;
 function score(d,a){
  if(!Array.isArray(a)||a.length<7)return null;
  const v=Array.from({length:7},(_,i)=>a[i]);
  if(v.some(x=>!valid(x)))return null;
  const values=v.map(Number),total=values.reduce((s,x)=>s+x,0);
  return {raw:total,max:21,complete:true,answers:values};
 }
 function links(){
   return '<div class="psy-gad-links">'+
    '<a class="btn primary" href="'+GUIDE+'" download>Методика и ключ · Word</a>'+
    '<a class="btn" href="'+BLANK+'" target="_blank" rel="noopener noreferrer">Бланк ученика · А4</a>'+
    '<a class="btn" href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">Полный текст: ГТР-7, приложение Г2 ↗</a>'+
    '<a class="btn" href="'+ORIGINAL+'" target="_blank" rel="noopener noreferrer">Бланки издателя ↗</a></div>';
 }
 function instruction(){
  return '<h3>Порядок проведения</h3><ol>'+
   '<li>Подберите и предъявите документированную русскую возрастную версию либо исходный GAD-7. <a href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">Полный русский текст и ключ</a> опубликованы в приложении Г2 к клиническим рекомендациям.</li>'+
   '<li>Уточните период <b>последние две недели</b>. Для каждого из семи пунктов отметьте число от 0 до 3.</li>'+
   '<li>Ученик заполняет бланк самостоятельно. Содержание симптомов и его возрастная пригодность должны быть понятны участнику; помощь взрослого — без подсказки ответа.</li>'+
   '<li>Дополнительный вопрос о том, насколько переживания затрудняли учёбу, общение и повседневные дела, регистрируется отдельно и не суммируется с семью ответами.</li>'+
   '<li>Проверьте все семь значений перед расчётом. Результат используйте как материал профессионального обследования, не как готовый диагноз.</li></ol>'+
   '<h3>Инструкция для ученика</h3><blockquote class="kid-instruction">Отметь, как часто за последние две недели тебя беспокоили описанные состояния. Возле каждого пункта выбери один ответ: 0, 1, 2 или 3. Правильных и неправильных ответов нет.</blockquote>'+
   '<div class="notice psy-gad-note">'+esc(WARNING)+'</div>'+links();
 }
 function materials(){
  return '<h3>Бланк ученика</h3><p>Регистрационный бланк А4 содержит семь пронумерованных пунктов с четырьмя вариантами ответов (0–3). Для стандартизированного обследования используйте русскую публикацию полного исходного текста из приложения Г2.</p>'+
    '<div class="psy-gad-itemlist">'+ITEMS.map((s,i)=>'<div><b>'+(i+1)+'.</b> '+esc(s)+'</div>').join("")+'</div>'+
    '<p>Дополнительный вопрос о влиянии на повседневную жизнь предназначен для заметки психолога и не влияет на итог 0–21.</p>'+
    '<div class="notice psy-gad-note">'+esc(WARNING)+'</div>'+links();
 }
 function processing(){
  return '<h3>Ключ и формула</h3><p>Каждый ответ — 0, 1, 2 или 3. Семь ответов суммируются без обратной кодировки. <b>Сумма 0–21.</b> Все семь значений обязательны.</p>'+
  '<table class="questions-table"><thead><tr><th>Ответ</th><th>Баллы</th></tr></thead><tbody>'+
  OPTIONS.map((s,i)=>'<tr><td>'+esc(s)+'</td><td>'+i+'</td></tr>').join("")+'</tbody></table>'+
  '<h3>Опубликованные ориентиры для взрослых</h3>'+
  '<table class="questions-table"><thead><tr><th>Баллы</th><th>Описательная категория в руководствах</th></tr></thead><tbody><tr><td>0–4</td><td>Минимальные проявления</td></tr><tr><td>5–9</td><td>Слабые проявления</td></tr><tr><td>10–14</td><td>Умеренные проявления</td></tr><tr><td>15–21</td><td>Выраженные проявления</td></tr></tbody></table>'+
  '<p>Это взрослые описательные диапазоны, <strong>не автоматическая классификация детей</strong>. На сайте выводятся только ответы, баллы и дополнительная оценка затруднений. Значения являются скрининговыми, не диагнозом.</p>'+
  '<p><b>Пример:</b> 3+2+1+0+3+2+1 = 12 баллов.</p>'+
  '<div class="notice psy-gad-note">'+esc(WARNING)+'</div>'+
  '<p>Источники: <a href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">Минздрав РФ, ГТР-7 ↗</a>; <a href="'+VALIDATION+'" target="_blank" rel="noopener noreferrer">русскоязычная адаптация (2023) ↗</a>; <a href="'+YOUTH+'" target="_blank" rel="noopener noreferrer">валидация у подростков ↗</a>.</p>';
 }
 function result(a,impact){
  const z=score(d,a),n=count(a),f=validImpact(impact)?EFFECT[Number(impact)]:"не указано";
  return '<section class="psy-gad-result"><h3>Результаты GAD-7</h3><p>Заполнено <b>'+n+' из 7</b> пунктов</p><div class="psy-gad-bar"><span style="width:'+(n/7*100)+'%"></span></div>'+
   (z?'<div class="psy-gad-main"><small>Сумма по семи ответам</small><strong>'+z.raw+' <span>/ 21</span></strong><div class="psy-gad-bar"><span style="width:'+(z.raw/21*100)+'%"></span></div></div>':'<p class="psy-gad-muted">Для получения суммы необходимо заполнить все семь ответов. Пустой ответ не равен 0.</p>')+
   '<p class="psy-gad-muted">Затруднения в повседневной жизни: <b>'+esc(f)+'</b> (отдельно, вне суммы).</p>'+
   '<p class="psy-gad-muted">Для несовершеннолетних автоматические диагностические и возрастные категории не применяются.</p></section>';
 }
 function summary(rows){
  return '<div class="psy-gad-scroll"><table><thead><tr><th>Код ученика</th><th>Ответов</th><th>Сумма 0–21</th><th>Влияние на жизнь</th></tr></thead><tbody>'+
   rows.map((r,i)=>{const z=score(d,r.answers),impact=validImpact(r.gadImpact)?EFFECT[Number(r.gadImpact)]:"—";return '<tr><td>'+esc(r.name||"У-"+String(i+1).padStart(2,"0"))+'</td><td>'+count(r.answers)+'/7</td><td>'+(z?z.raw:'—')+'</td><td>'+esc(impact)+'</td></tr>'}).join("")+'</tbody></table></div>';
 }
 function calculator(d,ctx){
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],a=r.answers||[];
  let html='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ученик</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Класс / группа</button></div>'+
  '<div class="notice psy-gad-note">Используйте подтверждённую русскоязычную версию GAD-7 из первоисточника. Вносите только условные коды, не ФИО.</div>';
  if(ctx.calcMode==="class")html+='<div class="group-tools"><label>Ученик<select id="participantSelect">'+rows.map((x,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(x.name||"У-"+(i+1))+'</option>').join("")+'</select></label><label>Код<input id="participantName" maxlength="40" value="'+esc(r.name||"")+'" placeholder="У-01"></label><button class="btn" id="addParticipant">Добавить ученика</button></div>';
  else html+='<label class="psy-gad-code">Условный код<input id="gadSingleCode" maxlength="40" value="'+esc(r.name||"")+'" placeholder="Например, У-01"></label>';
  html+='<div class="psy-gad-grid">'+ITEMS.map((text,i)=>'<label class="psy-gad-item"><span><b>'+(i+1)+'.</b> '+esc(text)+'</span><select data-gad-answer="'+i+'" aria-label="GAD-7, пункт '+(i+1)+'"><option value="">— ответа нет —</option>'+
   OPTIONS.map((option,v)=>'<option value="'+v+'" '+(valid(a[i])&&Number(a[i])===v?"selected":"")+'>'+v+' — '+esc(option)+'</option>').join("")+'</select></label>').join("")+'</div>'+
   '<label class="psy-gad-impact">Дополнительно: насколько тревога затрудняла повседневные дела?<select id="gadImpact"><option value="">— не указано —</option>'+
   EFFECT.map((v,i)=>'<option value="'+i+'" '+(validImpact(r.gadImpact)&&Number(r.gadImpact)===i?"selected":"")+'>'+esc(v)+'</option>').join("")+'</select></label>'+
   '<div id="gadResult">'+result(a,r.gadImpact)+'</div>'+
   '<div class="psy-gad-tools"><button class="btn" id="gadClear">Очистить ответы</button><button class="btn primary" id="gadProtocol">Скачать индивидуальный протокол</button></div>';
  if(ctx.calcMode==="class")html+='<h3>Сводная таблица класса</h3><div id="gadSummary">'+summary(rows)+'</div><div class="psy-gad-tools"><button class="btn" id="nextParticipant">Следующий ученик</button><button class="btn primary" id="gadCsv">Скачать CSV для Excel</button></div>';
  return html;
 }
 function save(name,body,type){const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
 const csvCell=t=>{let s=String(t??"");if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
 const csv=rows=>"\uFEFF"+rows.map(row=>row.map(csvCell).join(";")).join("\r\n");
 function bind(d,ctx){
  const rows=ctx.rows||[],r=rows[ctx.rowIndex];if(!r)return;r.answers||=[];
  const refresh=()=>{const area=document.getElementById("gadResult");if(area)area.innerHTML=result(r.answers,r.gadImpact);const group=document.getElementById("gadSummary");if(group)group.innerHTML=summary(rows)};
  document.getElementById("gadSingleCode")?.addEventListener("input",e=>{r.name=e.target.value});
  document.querySelectorAll("[data-gad-answer]").forEach(el=>el.addEventListener("change",()=>{r.answers[Number(el.dataset.gadAnswer)]=el.value===""?"":Number(el.value);refresh()}));
  document.getElementById("gadImpact")?.addEventListener("change",e=>{r.gadImpact=e.target.value===""?"":Number(e.target.value);refresh()});
  document.getElementById("gadClear")?.addEventListener("click",()=>{if(!confirm("Очистить ответы и дополнительное значение этого ученика?"))return;r.answers=[];r.gadImpact="";document.querySelectorAll("[data-gad-answer]").forEach(x=>x.value="");const imp=document.getElementById("gadImpact");if(imp)imp.value="";refresh()});
  document.getElementById("gadProtocol")?.addEventListener("click",()=>{
   const z=score(d,r.answers);if(!z){alert("Для протокола нужны ответы на все семь пунктов.");return}
   const impact=validImpact(r.gadImpact)?EFFECT[Number(r.gadImpact)]:"не указано";
   const page='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>GAD-7 · протокол</title><style>@page{size:A4;margin:15mm}body{font:14px/1.6 Arial;color:#253e2e;max-width:800px;margin:24px auto}h1{font-size:22px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #a6bea8;padding:8px;text-align:left}.fine{color:#536c5a;font-size:12px}</style></head><body>'+
    '<h1>GAD-7 · индивидуальный протокол</h1><p>Код: '+esc(r.name||"не указан")+'<br>Дата: '+new Date().toLocaleDateString("ru-RU")+'<br>Период: последние две недели.</p>'+
    '<h2>Общая сумма: '+z.raw+' / 21</h2><table><thead><tr><th>Пункт</th><th>Ответ 0–3</th></tr></thead><tbody>'+
    z.answers.map((v,i)=>'<tr><td>'+(i+1)+'</td><td>'+v+'</td></tr>').join("")+'</tbody></table>'+
    '<p>Дополнительное влияние на повседневную жизнь: '+esc(impact)+'.</p><p class="fine">'+esc(WARNING)+'</p><p class="fine">'+esc(d.interpret)+'</p>'+
    '<p class="fine">Источник полного текста: '+esc(SOURCE)+'</p></body></html>';
   save("GAD7_individual_protocol.html",page,"text/html;charset=utf-8");
  });
  document.getElementById("gadCsv")?.addEventListener("click",()=>{
   const out=[["Код","Заполнено из 7","GAD-7 0–21","Влияние на жизнь",...Array.from({length:7},(_,i)=>"Ответ "+(i+1))]];
   rows.forEach((r,i)=>{const z=score(d,r.answers);out.push([r.name||"У-"+(i+1),count(r.answers),z?.raw??"",validImpact(r.gadImpact)?EFFECT[Number(r.gadImpact)]:"",...Array.from({length:7},(_,j)=>valid(r.answers?.[j])?Number(r.answers[j]):"")])});
   save("GAD7_group.csv",csv(out),"text/csv;charset=utf-8");
  });
 }
 window.PSY_GAD7={score,count,valid,instruction,materials,processing,calculator,bind,result,summary,items:ITEMS};
})();