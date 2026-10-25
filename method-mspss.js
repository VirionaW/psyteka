"use strict";
(function(){
 const NAME="Шкала воспринимаемой социальной поддержки (MSPSS)";
 const SOURCE="https://gzimet.wixsite.com/mspss";
 const PDF="https://12fab08f-d2d3-ce70-6d1a-9d3fa0d8a67b.filesusr.com/ugd/5119f9_2f88fadcd382463daf5821e8af94a865.pdf";
 const GUIDE="downloads/mspss_method_guide.docx",BLANK="downloads/mspss_answer_sheet.html",STUDENT="downloads/mspss_student_working_ru.html";
 const TOPICS=["Поддержка значимого человека в трудной ситуации","Возможность делиться переживаниями со значимым человеком","Готовность семьи помочь","Эмоциональная поддержка семьи","Значимый человек как источник утешения","Готовность друзей помочь","Возможность рассчитывать на друзей при трудностях","Обсуждение проблем с семьей","Возможность делиться радостью и печалью с друзьями","Внимание значимого человека к переживаниям","Помощь семьи в принятии решений","Обсуждение проблем с друзьями"];
 const SUB=[{id:"other",name:"Значимый человек",items:[1,2,5,10]},{id:"family",name:"Семья",items:[3,4,8,11]},{id:"friends",name:"Друзья",items:[6,7,9,12]}];
 const d={
  author:"Г. Д. Зимет, Н. Далем, С. Зимет, Г. Фарли (G. D. Zimet et al., 1988)",
  age:"Подростки примерно от 12 лет и взрослые; выбор возрастной и языковой версии уточнить",
  kind:"Опросник воспринимаемой социальной поддержки",
  count:"12 пунктов, 3 подшкалы, ответы от 1 до 7",
  goal:"Определение субъективной оценки доступности поддержки со стороны семьи, друзей и значимого человека.",
  instructions:"Предъявите официальную форму MSPSS из источника автора. По каждому из 12 утверждений испытуемый выбирает один ответ от 1 (Very strongly disagree) до 7 (Very strongly agree). Перенесите числа на сайт строго по номерам оригинала.",
  questions:TOPICS,
  options:["Очень сильно не согласен","Сильно не согласен","Скорее не согласен","Нейтрально","Скорее согласен","Сильно согласен","Очень сильно согласен"],
  scoring:"Подшкалы: значимый человек 1,2,5,10; семья 3,4,8,11; друзья 6,7,9,12. Для каждой подшкалы сумма четырех ответов делится на 4; общий показатель - сумма 12 ответов, деленная на 12. Диапазон средних значений 1-7. Пропуски и ответы вне 1-7 исключают расчет; обратных пунктов нет.",
  interpret:"Выше балл - сильнее субъективно воспринимаемая поддержка. Авторы не установили универсальных популяционных норм: автоматические категории «низкая/средняя/высокая», диагнозы или клинические пороги не выдаются. При интерпретации учитывайте возраст, языковую версию и контекст.",
  warning:"Русские названия пунктов на сайте - только тематические метки, НЕ стандартизированный перевод анкеты. Для обследования используйте проверенную языковую версию оригинального MSPSS. Возрастные и культурные нормы по одной английской форме не переносятся на всех школьников.",
  source:SOURCE,sourceScoring:PDF,officialBlank:PDF,
  guideFile:GUIDE,answerFile:BLANK,studentFile:STUDENT,workflow:"mspss",calculator:true,scales:SUB,
  license:"Разработчик Г. Зимет разрешает бесплатное использование MSPSS с указанием исходной публикации. В Психотеке размещены авторские служебные метки для регистрации и расчета, а исходный английский бланк доступен по ссылке разработчика."
 };
 (window.PSY_FULL_METHODS||(window.PSY_FULL_METHODS={}))[NAME]=d;
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const missing=v=>v===""||v==null;
 const clean=a=>Array.isArray(a)&&a.length>=12?Array.from({length:12},(_,i)=>missing(a[i])?NaN:Number(a[i])):null;
 function score(data,answers){
  const a=clean(answers);if(!a||a.some(v=>!Number.isInteger(v)||v<1||v>7))return null;
  const sum=a.reduce((p,v)=>p+v,0),subscales=SUB.map(s=>{
   const raw=s.items.reduce((p,i)=>p+a[i-1],0);return {id:s.id,name:s.name,items:s.items,raw,mean:raw/4};
  });
  return {raw:sum,max:84,mean:sum/12,subscales,answers:a,complete:true,caption:"Средняя оценка поддержки (1-7)"};
 }
 function done(answers){return Array.from({length:12},(_,i)=>answers?.[i]).filter(v=>v!==""&&v!=null&&Number.isInteger(Number(v))&&Number(v)>=1&&Number(v)<=7).length}
 function links(){return '<div class="psy-mspss-links"><a class="btn primary" download href="'+GUIDE+'">Методика и руководство · Word</a><a class="btn" href="'+STUDENT+'" target="_blank" rel="noopener noreferrer">Бланк ученика · русский рабочий перевод, А4</a><a class="btn" href="'+BLANK+'" target="_blank" rel="noopener noreferrer">Лист регистрации ответов · А4</a><a class="btn" href="'+PDF+'" target="_blank" rel="noopener noreferrer">Официальный английский бланк · PDF</a></div>'}
 function instruction(){
  return '<h3>Проведение</h3><p>'+esc(d.instructions)+'</p>'+links()+
  '<h3>Для специалиста</h3><ol><li>Проверьте язык, возраст и условия добровольного участия. Рабочий русский перевод на отдельном ученическом бланке не прошел полноценную русскоязычную школьную валидизацию.</li><li>Используйте именно 12 пунктов оригинальной версии MSPSS, без самодельной замены формулировок тематическими названиями.</li><li>На каждый вопрос выбирается значение от 1 до 7; 0 не используется.</li><li>В калькуляторе перенесите цифры по порядку исходного бланка. Система автоматически определит средний показатель и три подшкалы.</li><li>Используйте выводы только в сочетании с беседой, наблюдением и другой информацией.</li></ol>'+
  '<div class="notice psy-mspss-warning">'+esc(d.warning)+'</div><h3>Конфиденциальность</h3><p>Не вносите ФИО детей: работайте с условными кодами. Данные обрабатываются в браузере и не сохраняются на сервере Психотеки.</p>';
 }
 function materials(){
  return '<h3>Материалы MSPSS · 12 пунктов</h3><div class="notice">Ниже дан регистрационный лист для психолога, а не самостоятельная стандартизированная анкета. Полный ученический бланк на русском языке находится по отдельной ссылке и прямо обозначен как рабочий, невалидизированный перевод. Для психодиагностической интерпретации используйте подходящую проверенную языковую версию.</div>'+
  '<p>Код: ____________________ &nbsp; Дата: ____________ &nbsp; Версия / язык: ____________</p>'+
  '<table class="questions-table psy-mspss-table"><thead><tr><th>№</th><th>Тема пункта (не перевод)</th><th>Ответ 1-7</th></tr></thead><tbody>'+
  TOPICS.map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(q)+'</td><td>□ 1 □ 2 □ 3 □ 4 □ 5 □ 6 □ 7</td></tr>').join("")+'</tbody></table>'+links();
 }
 function processing(){
  return '<h3>Ключ и подсчет</h3><p>'+esc(d.scoring)+'</p><table class="questions-table psy-mspss-key"><thead><tr><th>Шкала</th><th>Пункты</th><th>Формула</th></tr></thead><tbody>'+
  SUB.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.items.join(", ")+'</td><td>Сумма / 4</td></tr>').join("")+
  '<tr><td>Общая поддержка</td><td>1-12</td><td>Сумма / 12</td></tr></tbody></table><h3>Интерпретация</h3><p>'+esc(d.interpret)+'</p>'+
  '<div class="notice psy-mspss-warning">'+esc(d.warning)+'</div><p><a href="'+PDF+'" target="_blank" rel="noopener noreferrer">Оригинальный бланк и рекомендации автора ↗</a></p>';
 }
 function result(answers){
  const n=done(answers),z=score(d,answers);
  if(!z)return '<div class="psy-mspss-result"><h3>Заполнено '+n+' из 12</h3><div class="psy-mspss-track"><span style="width:'+(100*n/12)+'%"></span></div><p>Расчет появится после ввода всех двенадцати ответов от 1 до 7. Пропуск нельзя считать нулем.</p></div>';
  return '<div class="psy-mspss-result"><h3>Средняя воспринимаемая поддержка</h3><strong class="psy-mspss-mean">'+z.mean.toFixed(2)+' <small>/ 7</small></strong><p>Сумма '+z.raw+' из 84. Показатели ниже - средние баллы по четырем вопросам каждой подшкалы.</p>'+
  '<div class="psy-mspss-scales">'+z.subscales.map(s=>'<div><b>'+esc(s.name)+'</b><strong>'+s.mean.toFixed(2)+' / 7</strong><div class="psy-mspss-track"><span style="width:'+(s.mean/7*100)+'%"></span></div></div>').join("")+'</div><p class="psy-mspss-small">'+esc(d.interpret)+'</p></div>';
 }
 function group(rows){
  return '<div class="psy-mspss-group"><h3>Результаты группы</h3><div class="psy-mspss-scroll"><table><thead><tr><th>Код</th><th>Общий / 7</th><th>Семья</th><th>Друзья</th><th>Значимый человек</th><th>Ответов</th></tr></thead><tbody>'+
  rows.map((r,i)=>{const z=score(d,r.answers);const by=id=>z?z.subscales.find(s=>s.id===id).mean.toFixed(2):"—";return '<tr><td>'+esc(r.name||"У-"+String(i+1).padStart(2,"0"))+'</td><td>'+(z?z.mean.toFixed(2):"—")+'</td><td>'+by("family")+'</td><td>'+by("friends")+'</td><td>'+by("other")+'</td><td>'+done(r.answers)+'/12</td></tr>'}).join("")+
  '</tbody></table></div><p class="psy-mspss-small">Таблица не присваивает участникам диагнозы или уровни нормы.</p></div>';
 }
 function calculator(data,ctx){
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],a=r.answers||[];
  let html='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>'+
  '<div class="notice psy-mspss-warning">Введите числа из оригинального бланка на английском или из проверенной переводной формы. Нельзя заменять пункты тематическими описаниями. 0 не является ответом MSPSS.</div>';
  if(ctx.calcMode==="class")html+='<div class="group-tools"><label>Участник<select id="participantSelect">'+rows.map((x,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(x.name||"У-"+String(i+1).padStart(2,"0"))+'</option>').join("")+'</select></label><label>Код<input id="participantName" maxlength="40" value="'+esc(r.name||"")+'" placeholder="У-01 (без ФИО)"></label><button class="btn" id="addParticipant">Добавить</button></div>';
  else html+='<label class="psy-mspss-code">Код (необязательно)<input id="mspssSingleCode" maxlength="40" value="'+esc(r.name||"")+'" placeholder="Без ФИО"></label>';
  html+='<p class="psy-mspss-small">Заполнено '+done(a)+' из 12. Ответы не сохраняются между посещениями.</p>'+
  '<div class="psy-mspss-grid">'+TOPICS.map((q,i)=>'<label class="psy-mspss-item"><span><b>'+(i+1)+'.</b> '+esc(q)+'</span><select data-mspss="'+i+'" aria-label="Ответ на пункт '+(i+1)+'"><option value="">— не заполнено —</option>'+
  Array.from({length:7},(_,j)=>'<option value="'+(j+1)+'" '+(String(a[i])===String(j+1)?"selected":"")+'>'+(j+1)+'</option>').join("")+'</select></label>').join("")+'</div>'+
  '<div id="mspssResult">'+result(a)+'</div><div class="psy-mspss-actions"><button class="btn" id="resetParticipant">Очистить ответы</button><button class="btn primary" id="mspssSave">Скачать отчет участника (HTML)</button></div>';
  if(ctx.calcMode==="class")html+='<div id="mspssGroup">'+group(rows)+'</div><div class="psy-mspss-actions"><button class="btn" id="nextParticipant">Следующий участник</button><button class="btn primary" id="mspssCSV">Скачать группу CSV</button></div>';
  return html;
 }
 function download(name,text,type){
  const u=URL.createObjectURL(new Blob([text],{type})),a=document.createElement("a");a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);
 }
 const csvCell=v=>{let s=String(v??"");if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
 function csv(rows){return "\uFEFF"+rows.map(r=>r.map(csvCell).join(";")).join("\r\n")}
 function bind(data,ctx){
  const rows=ctx.rows||[],r=rows[ctx.rowIndex];if(!r)return;
  document.getElementById("mspssSingleCode")?.addEventListener("input",e=>{r.name=e.target.value});
  document.querySelectorAll("[data-mspss]").forEach(el=>el.addEventListener("change",()=>{
   r.answers[Number(el.dataset.mspss)]=el.value===""?"":Number(el.value);
   const out=document.getElementById("mspssResult");if(out)out.innerHTML=result(r.answers);
   const g=document.getElementById("mspssGroup");if(g)g.innerHTML=group(rows);
  }));
  document.getElementById("mspssSave")?.addEventListener("click",()=>{
   const z=score(data,r.answers);
   if(!z){alert("Для отчета нужно заполнить все 12 ответов.");return}
   const code=esc(r.name||"Без персональных данных");
   const body='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>MSPSS - результат</title><style>@page{size:A4;margin:15mm}body{font:14px/1.6 Arial,sans-serif;color:#233b2d;max-width:800px;margin:25px auto}h1{font-size:23px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #adc6b1;padding:10px;text-align:left}.muted{font-size:12px;color:#607464}</style></head><body><h1>MSPSS · Индивидуальный протокол</h1><p>Код: '+code+'</p><p>Дата: '+new Date().toLocaleDateString("ru-RU")+'</p><p>Средний общий показатель: <b>'+z.mean.toFixed(2)+' / 7</b></p><table><tr><th>Источник поддержки</th><th>Средний показатель</th></tr>'+z.subscales.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.mean.toFixed(2)+' / 7</td></tr>').join("")+'</table><p>'+esc(d.interpret)+'</p><p class="muted">Источник: '+esc(PDF)+' · Учитывайте возраст и использованный язык формы. Не диагноз.</p></body></html>';
   download("MSPSS_результат.html",body,"text/html;charset=utf-8");
  });
  document.getElementById("mspssCSV")?.addEventListener("click",()=>{
   const table=[["Код","Всего 1-7","Значимый человек","Семья","Друзья","Ответов"],...rows.map((x,i)=>{const z=score(data,x.answers);return [x.name||"У-"+(i+1),z?z.mean.toFixed(2):"",...SUB.map(s=>z?z.subscales.find(y=>y.id===s.id).mean.toFixed(2):""),done(x.answers)];})];
   download("MSPSS_группа.csv",csv(table),"text/csv;charset=utf-8");
  });
 }
 window.PSY_MSPSS={score,done,links,instruction,materials,processing,calculator,bind};
})();