"use strict";
(function(){
 const NAME="Краткий опросник PHQ-4";
 const ORIGINAL="https://scholar.harvard.edu/files/bettina.hoeppner/files/phq-4.pdf";
 const NINDS="https://cde-fe.ninds.nih.gov/ninds/noc-report/F2495/Patient%20Health%20Questionnaire%20-%204%20%28PHQ-4%29";
 const RUSRESEARCH="https://publications.hse.ru/articles/938267647";
 const YOUTH="https://pubmed.ncbi.nlm.nih.gov/41564945/";
 const GUIDE="downloads/phq4_method_guide.docx",SHEET="downloads/phq4_student_register.html";
 // The original Harvard form orders Anxiety (1,2) then Depression (3,4).
 const TOPICS=["Нервозность, тревога или внутреннее напряжение","Трудности остановить или контролировать беспокойство","Подавленность, плохое настроение, чувство безнадежности","Снижение интереса или удовольствия"];
 const CHOICES=[["0","Совсем не беспокоило"],["1","Несколько дней"],["2","Больше половины дней"],["3","Почти каждый день"]];
 const NOTE="Тематические подписи в калькуляторе и на локальном регистрационном листе - НЕ самостоятельная стандартизованная русская редакция четырех утверждений. Для обследования предъявляйте проверенный текст (оригинальный PDF). Адаптация PHQ-4 в России исследована на взрослых 18-60 лет; применять взрослые пороги к школьникам без соответствующей возрастной валидации нельзя.";
 const d={
 author:"К. Кронке (K. Kroenke), Р. Л. Спитцер (R. L. Spitzer), Дж. Б. Уильямс (J. B. W. Williams), Б. Леве (B. Löwe), 2009",
 age:"Основная русскоязычная валидация: взрослые 18-60 лет. Исследования подростковых версий имеются, но нет основания переносить взрослые русские нормы на школьников.",
 kind:"Краткий скрининг эмоционального неблагополучия, самоотчет",
 count:"4 пункта, 4 варианта (0-3); две подшкалы по 2 пункта",
 goal:"Предварительная оценка частоты тревожных и депрессивных проявлений за последние две недели.",
 instructions:"Предъявите исходный полный текст PHQ-4 либо официально подтвержденную русскую адаптацию. Участник отмечает частоту проявлений за последние две недели: 0 - совсем нет, 1 - несколько дней, 2 - больше половины дней, 3 - почти каждый день. Вводите четыре ответа строго по нумерации выбранной публикации: здесь пункты 1-2 относятся к тревоге, а 3-4 - к снижению настроения.",
 scoring:"Общий балл = сумма пунктов 1-4 (0-12). Подшкала тревоги (GAD-2) = 1+2 (0-6), подшкала сниженного настроения (PHQ-2) = 3+4 (0-6). При полностью заполненных ответах в литературе для взрослых приводятся описательные уровни общего балла: 0-2 минимальный, 3-5 слабый, 6-8 умеренный, 9-12 выраженный; ориентир отдельной подшкалы от 3 баллов. Эти категории не выдаются за детские нормы или диагноз.",
 interpret:"Высокий общий балл означает более частое упоминание проблем за последние две недели. В шкале отсутствует пункт о самоповреждении; низкий балл не исключает риска и не заменяет индивидуальную беседу. Скрининг не является диагнозом. При интерпретации подростков необходимы возрастная и языковая валидизация, сведения из других источников и профессиональная оценка.",
 warning:NOTE,questions:TOPICS,
 options:CHOICES.map(c=>c[0]+" - "+c[1]),
 source:ORIGINAL,officialBlank:ORIGINAL,guideFile:"downloads/phq4_guide.html",guideWithBlankFile:"downloads/phq4_guide_with_blank.html",answerFile:SHEET,answerWordFile:"downloads/phq4_answers.docx",
 sourceScoring:NINDS,sourceRussianStudy:RUSRESEARCH,youthResearch:YOUTH,
 calculator:true,workflow:"phq4",
 license:"Локальные регистрационные материалы содержат только тематические ориентиры и не воспроизводят авторские утверждения как самостоятельный перевод. Ссылка на англоязычную полную форму обязательна."
 };
 (window.PSY_FULL_METHODS||(window.PSY_FULL_METHODS={}))[NAME]=d;
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const ok=v=>(typeof v==="number"&&Number.isInteger(v)&&v>=0&&v<=3)||(typeof v==="string"&&/^[0-3]$/.test(v));
 const filled=a=>Array.from({length:4},(_,i)=>a?.[i]).filter(ok).length;
 function score(d,answers){
  const a=Array.isArray(answers)?answers:[];
  const anxiety=ok(a[0])&&ok(a[1])?Number(a[0])+Number(a[1]):null;
  const mood=ok(a[2])&&ok(a[3])?Number(a[2])+Number(a[3]):null;
  const total=anxiety===null||mood===null?null:anxiety+mood;
  return {anxiety,mood,total,max:12,complete:total!==null,filled:filled(a)};
 }
 function introLinks(){return '<div class="psy-phq-links">'+
  '<a class="btn primary" href="'+GUIDE+'" download>Методика и ключ · Word</a>'+
  '<a class="btn" href="'+SHEET+'" target="_blank" rel="noopener noreferrer">Бланк ученика · А4</a>'+
  '<a class="btn" href="'+ORIGINAL+'" target="_blank" rel="noopener noreferrer">Полная исходная форма · PDF ↗</a>'+
  '<a class="btn" href="'+RUSRESEARCH+'" target="_blank" rel="noopener noreferrer">Русская адаптация: исследование ↗</a></div>';}
 function instruction(){
  return '<div class="psy-common-guide-head"><h3>Методика и руководство</h3><div class="psy-common-guide-actions"><a class="btn" href="downloads/phq4_guide.html" target="_blank" rel="noopener noreferrer">Без бланка</a><a class="btn primary" href="downloads/phq4_guide_with_blank.html" target="_blank" rel="noopener noreferrer">С бланком</a></div></div>'+'<h3>Назначение и границы применения</h3><p>PHQ-4 - краткий скрининговый инструмент с двумя двухпунктовыми подшкалами. Для работы в школе важны возраст и язык: русскоязычная валидация 2024 года охватывала взрослых, а не школьников.</p>'+
  '<ol><li>Предъявите <a href="'+ORIGINAL+'" target="_blank" rel="noopener noreferrer">полный исходный опросник</a> или документированную подходящую адаптацию.</li>'+
  '<li>Предложите оценить <b>последние две недели</b>, отметив один ответ 0-3 на каждый пункт.</li>'+
  '<li>В этой реализации порядок исходного Harvard PDF: пункты 1-2 (тревога), 3-4 (снижение настроения). Если ваш бланк меняет порядок, предварительно сопоставьте номера.</li>'+
  '<li>Внесите четыре ответа по номерам. Общий балл появится только для полностью заполненного опросника. Отдельная полная подшкала может быть рассчитана при пропусках в другой.</li>'+
  '<li>Используйте результат как основание для профессионального уточнения, но не как диагноз и не как оценку безопасности ребенка.</li></ol>'+
  '<h3>Инструкция участнику</h3><blockquote class="kid-instruction">Отметь, как часто за последние две недели тебя беспокоило то, о чем говорится в каждом из четырех утверждений исходного бланка. Выбери один вариант от 0 до 3. Правильных или неправильных ответов нет.</blockquote>'+
  '<div class="notice psy-phq-note">'+esc(NOTE)+'</div>';
 }
 function materials(){
  return '<div class="psy-common-guide-head"><h3>Лист ответов</h3><div class="psy-common-guide-actions"><a class="btn" href="downloads/phq4_student_register.html" target="_blank" rel="noopener noreferrer">Посмотреть и распечатать</a><a class="btn primary" href="downloads/phq4_answers.docx" download>Скачать Word</a></div></div>'+'<h3>Материалы</h3><p>Регистрационный бланк А4 содержит четыре номера и шкалу 0-3. Для фактического обследования требуется <a href="'+ORIGINAL+'" target="_blank" rel="noopener noreferrer">полный авторский текст четырех пунктов</a>.</p>'+
  '<p>Русскоязычные ориентиры в Психотеке только помогают специалисту перенести ответы:</p><ol>'+TOPICS.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ol>'+
  '<p>Сверяйте порядок двух субшкал, так как в разных публикациях четыре пункта бывают расположены по-разному.</p>';
 }
 function processing(){
  return '<h3>Ключ PHQ-4</h3><table><thead><tr><th>Показатель</th><th>Номера</th><th>Диапазон</th></tr></thead><tbody>'+
  '<tr><td>Тревожные проявления (GAD-2)</td><td>1 + 2</td><td>0-6</td></tr>'+
  '<tr><td>Снижение настроения (PHQ-2)</td><td>3 + 4</td><td>0-6</td></tr>'+
  '<tr><td>Общий PHQ-4</td><td>1 + 2 + 3 + 4</td><td>0-12</td></tr></tbody></table>'+
  '<p>Значения ответов: '+CHOICES.map(c=>c.join(" - ")).join("; ")+'. Обратных пунктов нет.</p>'+
  '<h3>Интерпретация</h3><p>'+esc(d.scoring)+'</p>'+
  '<p>Для общей шкалы взрослые описательные интервалы: 0-2, 3-5, 6-8, 9-12. В Психотеке намеренно не выводятся автоматические возрастные ярлыки, диагнозы и сигналы риска для школьников.</p>'+
  '<div class="notice psy-phq-note">'+esc(NOTE)+'</div>'+
  '<p><a href="'+NINDS+'" target="_blank" rel="noopener noreferrer">NINDS - ключ и шкалы ↗</a> · <a href="'+YOUTH+'" target="_blank" rel="noopener noreferrer">Исследование среди детей и подростков (2026) ↗</a></p>';
 }
 const fmt=x=>x===null?"–":String(x);
 function results(a){
  const s=score(d,a),num=s.filled;
  let out='<section class="psy-phq-result"><h3>Обработка результатов</h3><span class="psy-data-state '+(s.complete?'is-ready':'is-waiting')+'" role="status">'+(s.complete?'Данные заполнены':'Данные не заполнены')+'</span><p>Заполнено <b>'+num+' из 4</b></p><div class="psy-phq-track"><span style="width:'+(25*num)+'%"></span></div>'+
  '<div class="psy-phq-stats"><div><small>Тревожность (1-2)</small><b>'+fmt(s.anxiety)+' / 6</b></div>'+
  '<div><small>Снижение настроения (3-4)</small><b>'+fmt(s.mood)+' / 6</b></div>'+
  '<div><small>Общий PHQ-4</small><b>'+fmt(s.total)+' / 12</b></div></div>';
  if(!s.complete)out+='<p class="psy-phq-muted">Общий индекс рассчитывается при всех четырех ответах. Каждая подшкала рассчитывается только при двух заполненных входящих в нее пунктах.</p>';
  else out+='<p class="psy-phq-muted">Балл отражает частоту симптомов по ответам участника. Для школьников нет автоматической диагностической или нормативной категории.</p>';
  return out+'</section>';
 }
 function groupTable(rows){
  return '<div class="psy-phq-scroll"><table><thead><tr><th>Код</th><th>Ответов</th><th>Тревога 0-6</th><th>Настроение 0-6</th><th>Всего 0-12</th></tr></thead><tbody>'+
  rows.map((r,i)=>{const s=score(d,r.answers);return '<tr><td>'+esc(r.name||"У-"+String(i+1).padStart(2,"0"))+'</td><td>'+s.filled+'/4</td><td>'+fmt(s.anxiety)+'</td><td>'+fmt(s.mood)+'</td><td>'+fmt(s.total)+'</td></tr>'}).join("")+
  '</tbody></table></div><p class="psy-phq-muted">Неполные подшкалы и общие итоги не рассчитываются. Данные вводятся только по условным кодам.</p>';
 }
 function calculator(d,ctx){
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],a=r.answers||[];
  let out='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ученик</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Класс / группа</button></div>'+
  '<div class="notice psy-phq-note">Сначала предъявите исходные четыре утверждения. Порядок этого калькулятора: 1-2 тревога, 3-4 настроение. Не записывайте ФИО.</div>';
  if(ctx.calcMode==="class")out+='<div class="group-tools"><label>Ученик<select id="participantSelect">'+rows.map((v,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(v.name||"У-"+(i+1))+'</option>').join("")+'</select></label><label>Код<input id="participantName" maxlength="40" placeholder="У-01" value="'+esc(r.name||"")+'"></label><button class="btn" id="addParticipant">Добавить ученика</button></div>';
  else out+='<label class="psy-phq-code">Условный код<input id="phq4SingleCode" maxlength="40" placeholder="Например, У-01" value="'+esc(r.name||"")+'"></label>';
  out+='<div class="psy-phq-grid">'+TOPICS.map((t,i)=>'<label class="psy-phq-item"><span><b>'+(i+1)+'.</b> '+esc(t)+'</span><select data-phq4-answer="'+i+'" aria-label="PHQ-4, пункт '+(i+1)+'"><option value="">– не отмечено –</option>'+
  CHOICES.map(([v,text])=>'<option value="'+v+'" '+(ok(a[i])&&Number(a[i])===Number(v)?"selected":"")+'>'+v+' - '+esc(text)+'</option>').join("")+'</select></label>').join("")+'</div>'+
  '<div id="phq4Results">'+results(a)+'</div><div class="psy-phq-actions"><button class="btn" id="phq4Clear">Очистить ответы</button><button class="btn primary" id="phq4Report">Скачать протокол</button></div>';
  if(ctx.calcMode==="class")out+='<h3>Сводка по классу</h3><div id="phq4Class">'+groupTable(rows)+'</div><div class="psy-phq-actions"><button class="btn" id="nextParticipant">Следующий ученик</button><button class="btn primary" id="phq4Csv">Скачать CSV для Excel</button></div>';
  return out;
 }
 function save(name,content,type){
  const url=URL.createObjectURL(new Blob([content],{type})),el=document.createElement("a");el.href=url;el.download=name;el.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }
 function csvCell(x){let s=String(x??"");if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
 function csv(rows){return "\uFEFF"+rows.map(a=>a.map(csvCell).join(";")).join("\r\n");}
 function bind(d,ctx){
  const rows=ctx.rows||[],r=rows[ctx.rowIndex];if(!r)return;r.answers||=[];
  const refresh=()=>{const el=document.getElementById("phq4Results");if(el)el.innerHTML=results(r.answers);const g=document.getElementById("phq4Class");if(g)g.innerHTML=groupTable(rows)};
  document.getElementById("phq4SingleCode")?.addEventListener("input",e=>r.name=e.target.value);
  document.querySelectorAll("[data-phq4-answer]").forEach(el=>el.addEventListener("change",()=>{r.answers[Number(el.dataset.phq4Answer)]=el.value===""?"":Number(el.value);refresh()}));
  document.getElementById("phq4Clear")?.addEventListener("click",()=>{if(!confirm("Удалить ответы выбранного ученика?"))return;r.answers=[];document.querySelectorAll("[data-phq4-answer]").forEach(el=>el.value="");refresh()});
  document.getElementById("phq4Report")?.addEventListener("click",()=>{
   const s=score(d,r.answers);if(!s.complete){alert("Для индивидуального протокола заполните все четыре пункта.");return}
   const body='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>PHQ-4 - протокол</title><style>@page{size:A4;margin:17mm}body{max-width:780px;margin:25px auto;font:14px/1.6 Arial;color:#233e31}h1{font-size:24px;color:#265d41}table{border-collapse:collapse;width:100%}td,th{border:1px solid #a2b9ab;text-align:left;padding:10px}.note{font-size:12px;color:#536e5d}</style></head><body><h1>PHQ-4 · индивидуальный протокол</h1><p>Код: '+esc(r.name||"не указан")+'<br>Дата: '+new Date().toLocaleDateString("ru-RU")+'<br>Период: последние две недели.</p>'+
   '<table><thead><tr><th>Показатель</th><th>Результат</th></tr></thead><tbody><tr><td>Тревожные проявления (GAD-2)</td><td>'+s.anxiety+' / 6</td></tr><tr><td>Снижение настроения (PHQ-2)</td><td>'+s.mood+' / 6</td></tr><tr><td>Всего PHQ-4</td><td>'+s.total+' / 12</td></tr></tbody></table>'+
   '<p class="note">'+esc(NOTE)+'</p><p class="note">'+esc(d.interpret)+'</p><p class="note">Источник: '+esc(ORIGINAL)+'</p></body></html>';
   save("PHQ4_individual_report.html",body,"text/html;charset=utf-8");
  });
  document.getElementById("phq4Csv")?.addEventListener("click",()=>{
   const data=[["Код","Заполнено из 4","Тревога 0-6","Настроение 0-6","Общий PHQ-4 0-12","Пункт 1","Пункт 2","Пункт 3","Пункт 4"]];
   rows.forEach((v,i)=>{const s=score(d,v.answers);data.push([v.name||"У-"+(i+1),s.filled,s.anxiety??"",s.mood??"",s.total??"",...Array.from({length:4},(_,j)=>ok(v.answers?.[j])?Number(v.answers[j]):"")])});
   save("PHQ4_group.csv",csv(data),"text/csv;charset=utf-8");
  });
 }
 window.PSY_PHQ4={score,filled,calculator,bind,instruction,materials,processing,results,groupTable,topics:TOPICS,choices:CHOICES};
})();