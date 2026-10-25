"use strict";
(function(){
 const TITLE="Краткий опросник настроения (SMFQ)";
 const FORM_URL="https://www.seattlechildrens.org/globalassets/documents/healthcare-professionals/pal/ratings/smfq-rating-scale.pdf";
 const DUKE_URL="https://psychiatry.duke.edu/research/research-programs-areas/assessment-intervention/developmental-epidemiology-instruments-0";
 const TOPICS=[
 "Подавленное настроение","Потеря интереса и удовольствия","Утомляемость и пассивность",
 "Беспокойство и неусидчивость","Негативная оценка себя","Плач и эмоциональные реакции",
 "Трудности мышления и концентрации","Неприязнь к самому себе",
 "Представление о себе как о плохом человеке","Одиночество",
 "Ощущение отсутствия любви и принятия","Сравнение себя с другими детьми",
 "Переживание собственных ошибок"
 ];
 const WARNING="Оригинальная форма на английском языке. Для использования русскоязычных форм необходимо установить авторство перевода и возрастную валидизацию. Универсальный диагностический порог разработчиками не установлен; в отдельных руководствах используется порог 8, но переносить его на непроверенный перевод нельзя.";
 const D=window.PSY_FULL_METHODS;
 D[TITLE]={
  author:"А. Анголд, Э. Дж. Костелло и соавторы (A. Angold, E. J. Costello et al.)",
  age:"6-17 лет; для самостоятельного заполнения ориентируйтесь на способность читать и понимать пункты",
  kind:"Скрининговый опросник настроения, детская самооценка",
  count:"13 пунктов, 3 варианта ответа",
  goal:"Краткий скрининг переживаний и симптомов сниженного настроения за последние две недели.",
  instructions:"Используйте исходный детский бланк SMFQ (Child Self-Report) из источника. Предъявите все 13 пунктов на английском языке или при наличии проверенной адаптации. На каждый пункт требуется один ответ: Not true (0), Sometimes (1), True (2). Вводите результаты строго в порядке авторского бланка.",
  scoring:"Сумма 13 ответов по 0-2 балла; итог 0-26. Пропуски и значения вне диапазона исключают расчет. Для детской и родительской версий подсчет и интерпретация ведутся раздельно.",
  interpret:"Сумма описывает выраженность отмеченных симптомов за две недели. Чем она выше, тем больше отмеченных признаков. Диагноз и нормативная классификация по одной сумме не устанавливаются. При жалобах и неблагополучии необходима профессиональная оценка независимо от числа баллов.",
  warning:WARNING,
  source:DUKE_URL,
  sourceScoring:"https://www.seattlechildrens.org/globalassets/documents/healthcare-professionals/pal/ratings/smfq-rating-scale.pdf",
  officialBlank:FORM_URL,
  guideFile:"downloads/smfq_child_method_guide.docx",
  answerFile:"downloads/smfq_child_answer_sheet.html",
  sourceDescription:"Duke University, оригинальная детская форма SMFQ; Seattle Children's, бланк и расчет",
  license:"Оригинальная форма доступна на сайте разработчиков для применения специалистами; вспомогательный бланк регистрации и краткие тематические подписи не заменяют оригинальный текст.",
  questions:TOPICS,options:["Не соответствует","Иногда соответствует","Соответствует"],
  workflow:"smfq",calculator:true,scaleLabels:["Сумма симптомов настроения"],
  formVersion:"SMFQ Child Self-Report, English original, 13 items"
 };
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function score(d,a){
  if(!Array.isArray(a)||a.length!==13)return null;
  const values=a.map(v=>v===""||v===null||v===undefined?NaN:Number(v));
  if(values.some(v=>!Number.isInteger(v)||v<0||v>2))return null;
  return {raw:values.reduce((x,y)=>x+y,0),max:26,complete:true,caption:"Сумма по 13 пунктам",answers:values};
 }
 function doclinks(d){
  return '<div class="psy-smfq-links">'+
    '<a class="btn primary" download href="'+esc(d.guideFile)+'">Методика и руководство · Word</a>'+
    '<a class="btn" download href="'+esc(d.answerFile)+'">Скачать бланк ответов</a>'+
    '<a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(d.officialBlank)+'">Оригинальная форма · PDF ↗</a></div>';
 }
 function instruction(d){
  return '<h3>Проведение</h3><p>'+esc(d.instructions)+'</p>'+doclinks(d)+
  '<h3>Условия применения</h3><p>Используется детская форма самоотчета. Родительская форма отличается формулировками, ответы двух форм нельзя смешивать. Период - две последние недели.</p>'+
  '<h3>Обработка</h3><p>'+esc(d.scoring)+'</p>'+
  '<div class="notice psy-smfq-warning">'+esc(d.warning)+'</div>'+
  '<p>Результаты чувствительны. Рекомендуется вводить код участника и ограничивать доступ к полученным файлам.</p>';
 }
 function materials(d){
  const entries=d.questions.map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(q)+'</td><td>□ 0 &nbsp; □ 1 &nbsp; □ 2</td></tr>').join("");
  return '<h3>Бланк регистрации ответов · детская форма</h3>'+
  '<div class="notice">Это регистрационный лист, а не авторский перевод анкеты. Ребенку предъявляют 13 оригинальных утверждений из детского PDF; здесь психолог отмечает выбранные числа.</div>'+
  '<p>Код участника: ___________ &nbsp; Возраст: _____ &nbsp; Дата: __________</p>'+
  '<table class="questions-table psy-smfq-table"><thead><tr><th>№</th><th>Тема пункта для регистрации</th><th>Ответ</th></tr></thead><tbody>'+entries+'</tbody></table>'+
  '<p>0 - Not true; 1 - Sometimes; 2 - True.</p>'+doclinks(d);
 }
 function processing(d){
  return '<h3>Схема подсчета</h3><p>'+esc(d.scoring)+'</p>'+
   '<div class="psy-smfq-key"><span>0 = Not true</span><span>1 = Sometimes</span><span>2 = True</span></div>'+
   '<h3>Результаты</h3><p>Показываются только сумма из 26 и степень заполненности. Обозначения «норма», «патология» и диагнозы автоматически не выводятся.</p>'+
   '<div class="notice psy-smfq-warning">'+esc(d.warning)+'</div>'+
   '<p><a href="'+esc(d.source)+'" target="_blank" rel="noopener noreferrer">Разработчик и условия использования ↗</a></p>'+
   '<p><a href="'+esc(d.sourceScoring)+'" target="_blank" rel="noopener noreferrer">Исходный бланк и опубликованная схема подсчета ↗</a></p>';
 }
 function resultHtml(d,answers){
  const done=Array.from({length:13},(_,i)=>answers?.[i]).filter(v=>v!==""&&v!==null&&v!==undefined&&[0,1,2].includes(Number(v))).length;
  const out=score(d,answers);
  let html='<div class="psy-smfq-result"><strong>Заполнено '+done+' из 13</strong><div class="psy-smfq-track"><span style="width:'+(done/13*100)+'%"></span></div>';
  if(!out)return html+'<p>Сумма появится после внесения всех 13 ответов. Пропуски не равны нулю.</p></div>';
  return html+'<div class="psy-smfq-total"><strong>Суммарный показатель</strong><b>'+out.raw+' / 26</b><div class="psy-smfq-track"><span style="width:'+(out.raw/26*100)+'%"></span></div></div><p>Число показывает сумму отмеченных симптомов за две недели, без диагностического ярлыка.</p></div>';
 }
 function calculator(d,ctx){
  const all=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}];
  const row=all[ctx.rowIndex]||all[0];const a=row.answers||[];
  let h='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа (по кодам)</button></div>';
  h+='<div class="notice">Перенесите 13 ответов из <a href="'+esc(d.officialBlank)+'" target="_blank" rel="noopener noreferrer">детской формы SMFQ ↗</a>. Здесь тематические подсказки, не самостоятельный перевод. Результаты не отправляются на сервер.</div>';
  if(ctx.calcMode==="class"){
   h+='<div class="group-tools"><label>Код участника<select id="participantSelect">'+all.map((r,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?'selected':'')+'>'+(i+1)+'. '+esc(r.name||"Код "+(i+1))+'</option>').join("")+'</select></label><label>Код (без ФИО)<input id="participantName" value="'+esc(row.name||"")+'" placeholder="Код ученика"></label><button class="btn" id="addParticipant">Добавить</button></div>';
  }
  h+='<div class="psy-smfq-grid">'+d.questions.map((q,i)=>'<label class="psy-smfq-item"><span><b>'+(i+1)+'.</b> '+esc(q)+'</span><select data-smfq="'+i+'" aria-label="Пункт '+(i+1)+'"><option value="">- не заполнено -</option>'+d.options.map((v,n)=>'<option value="'+n+'" '+(String(a[i])===String(n)?'selected':'')+'>'+n+' - '+esc(v)+'</option>').join("")+'</select></label>').join("")+'</div>';
  h+='<div id="smfqResult">'+resultHtml(d,a)+'</div><div class="psy-smfq-tools"><button class="btn" id="resetParticipant">Очистить ответы</button><button class="btn primary" id="smfqSave">Скачать индивидуальный результат JSON</button></div>';
  if(ctx.calcMode==="class")h+='<h3>Результаты группы</h3><p>В таблице используются только коды. Это не рейтинг и не распределение детей по диагнозам.</p><div class="results-table"><table><thead><tr><th>Код</th><th>Сумма / 26</th><th>Заполнено</th></tr></thead><tbody>'+all.map((r,i)=>{const x=score(d,r.answers);const done=(r.answers||[]).filter(v=>v!==""&&v!=null).length;return '<tr><td>'+esc(r.name||"Код "+(i+1))+'</td><td>'+(x?x.raw:"-")+'</td><td>'+done+'/13</td></tr>'}).join("")+'</tbody></table></div><div class="psy-smfq-tools"><button class="btn" id="smfqCSV">Скачать CSV группы</button></div>';
  return h;
 }
 function download(name,text,type){
  const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function bind(d,ctx){
  document.querySelectorAll("[data-smfq]").forEach(el=>el.addEventListener("change",()=>{
   ctx.rows[ctx.rowIndex].answers[+el.dataset.smfq]=el.value===""?"":Number(el.value);
   const out=document.querySelector("#smfqResult");if(out)out.innerHTML=resultHtml(d,ctx.rows[ctx.rowIndex].answers);
  }));
  document.querySelector("#smfqSave")?.addEventListener("click",()=>{
   const r=ctx.rows[ctx.rowIndex];const payload={method:TITLE,version:d.formVersion,code:r.name||"",answers:r.answers||[],score:score(d,r.answers||[]),source:d.sourceScoring,warning:d.warning};
   download("SMFQ_child_result.json",JSON.stringify(payload,null,2),"application/json;charset=utf-8");
  });
  document.querySelector("#smfqCSV")?.addEventListener("click",()=>{
   const rows=[["Код","Сумма","Заполнено"],...ctx.rows.map((r,i)=>{const x=score(d,r.answers);return [r.name||"Код "+(i+1),x?.raw??"",(r.answers||[]).filter(v=>v!==""&&v!=null).length];})];
   download("SMFQ_group.csv","\uFEFF"+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(";")).join("\r\n"),"text/csv;charset=utf-8");
  });
 }
 window.PSY_SMFQ={score,materials,instruction,processing,calculator,bind};
})();