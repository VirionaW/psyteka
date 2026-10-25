"use strict";
/* Обработка диагностик для существующих карточек SCARED и WHO-5. Данные – только в памяти браузера. */
(function(){
 const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const isWho=d=>d?.name==="Индекс хорошего самочувствия WHO-5"||d?.questions?.length===5&&d?.scoringMax===25;
 const valid=(d,answers)=>Array.isArray(answers)&&answers.length>=d.questions.length&&
  d.questions.every((_,i)=>answers[i]!==null&&answers[i]!==undefined&&answers[i]!==""&&
  /^\d$/.test(String(answers[i]))&&Number(answers[i])>=0&&Number(answers[i])<d.options.length);
 const count=(d,a)=>d.questions.reduce((n,_,i)=>n+(a&&a[i]!==undefined&&a[i]!==null&&a[i]!==""&&
 /^\d$/.test(String(a[i]))&&Number(a[i])<d.options.length?1:0),0);
 function score(d,a){
  if(!valid(d,a))return null;
  const numbers=d.questions.map((_,i)=>Number(a[i]));
  const raw=numbers.reduce((x,y)=>x+y,0);
  if(isWho(d))return {type:"who5",raw,index:raw*4,max:25,caption:"Индекс благополучия (0-100)",threshold:raw*4<50,
   summary:raw*4<50?"Показатель ниже 50: рекомендована дальнейшая профессиональная оценка благополучия.":"По предлагаемому порогу ниже 50 скрининговый сигнал не выявлен; это не исключает трудностей."};
  const scales=d.scales.map(s=>({...s,raw:s.items.reduce((n,i)=>n+numbers[i-1],0)}));
  return {type:"scared",raw,max:82,index:null,scales,threshold:raw>=25,caption:"Суммарная выраженность тревожных симптомов",
   summary:raw>=25?"Сумма ≥25: положительный скрининг; необходима дальнейшая профессиональная оценка.":"Сумма ниже 25: общий порог не достигнут. Изучите подшкалы и беседу; отсутствие порога не исключает проблемы."};
 }
 function intro(d){
  return '<div class="diagnostic-intro"><p><strong>Период:</strong> '+escape(d.scope)+'. <strong>Версия:</strong> '+escape(d.originalLanguage)+
  '</p><p>Сначала проведите бумажную методику, затем перенесите ответы по порядку. При пропуске хотя бы одного ответа результат не рассчитывается.</p>'+
  '<a class="btn primary" href="'+escape(d.officialBlank)+'" rel="noopener noreferrer" target="_blank">Открыть официальный бланк PDF ↗</a>'+
  '<p class="privacy-inline">PDF открывается у первоисточника. Психотека не отправляет ответы на сервер и не сохраняет их автоматически. Используйте код участника, не ФИО.</p></div>';
 }
 function materials(d,blank){
  if(isWho(d)){
   const h='<div class="diag-sheet"><h3>WHO-5 · бланк для участника</h3><p>За последние две недели отметьте один ответ напротив каждого утверждения.</p>'+
   '<p class="diag-options">'+d.options.map((v,i)=>i+' – '+escape(v)).join(' · ')+'</p>';
   return h+'<table class="diag-questions-table"><thead><tr><th>№</th><th>Утверждение</th><th>Ответ 0-5</th></tr></thead><tbody>'+
    d.questions.map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+escape(q)+'</td><td>'+(blank?'______':'0 / 1 / 2 / 3 / 4 / 5')+'</td></tr>').join('')+
    '</tbody></table><p class="diag-attribution">© WHO, WHO-5, 2024 · CC BY-NC-SA 3.0 IGO · Русская форма (1999). Сверяйтесь с официальным PDF ВОЗ.</p></div>';
  }
  return '<div class="diag-sheet"><h3>SCARED · дополнительный лист для переноса ответов</h3>'+
   '<p class="notice">Это НЕ оригинальная анкета, а технический лист ответов. Для проведения используйте неизмененный официальный PDF SCARED на английском языке.</p>'+
   '<p>0 – неверно / почти никогда; 1 – иногда; 2 – часто / очень верно.</p><div class="diag-answer-cells">'+
   d.questions.map((_,i)=>'<span><b>'+(i+1)+'.</b> ○ 0 &nbsp; ○ 1 &nbsp; ○ 2</span>').join('')+'</div>'+
   '<p class="diag-attribution">Birmaher et al., SCARED, детская версия. Оригинал предоставлен на NC-PAL с разрешения разработчика.</p></div>';
 }
 function instructions(d){
  return '<h3>Проведение для психолога</h3><ol>'+
  (isWho(d)?'<li>Используйте официальный русский бланк ВОЗ; участник оценивает последние две недели.</li><li>Пять ответов оцениваются 0-5 без обратного ключа.</li><li>Перенесите пять цифр в форму обработки и проверьте полноту.</li><li>Индекс равен сумме ×4. При значении ниже 50 обсудите необходимость дальнейшей оценки.</li>':
   '<li>Скачайте оригинальную детскую форму SCARED на английском языке. Не заменяйте ее самодельным переводом.</li><li>Ребенок оценивает самочувствие за три месяца; детям 8-11 лет обеспечьте помощь в понимании формулировок без наведения на ответ.</li><li>Перенесите 41 ответ 0-2 в том же порядке, что в PDF.</li><li>Обработайте общий балл и пять подшкал. При положительном скрининге проведите дальнейшую квалифицированную оценку.</li>')+
  '</ol><p class="notice">Скрининговый порог нельзя интерпретировать как диагноз. Уточняйте ограничения языка, возрастной версии и условий обследования.</p>';
 }
 function processing(d){
  return '<h3>Ключ и интерпретация</h3><p>'+escape(d.scoring)+'</p><p>'+escape(d.interpret)+'</p>'+
  (!isWho(d)?'<h3>Подшкалы SCARED</h3><table class="diag-questions-table"><thead><tr><th>Шкала</th><th>Пункты (нумерация оригинала)</th><th>Порог</th></tr></thead><tbody>'+
   d.scales.map(s=>'<tr><td>'+escape(s.name)+'</td><td>'+s.items.join(', ')+'</td><td>≥ '+s.cutoff+'</td></tr>').join('')+'</tbody></table>':'')+
  '<p><a href="'+escape(d.sourceScoring)+'" target="_blank" rel="noopener noreferrer">Первоисточник ключа и рекомендаций ↗</a></p>';
 }
 function results(d,a){
  const n=count(d,a),z=score(d,a);
  if(!z)return '<section class="diag-output" id="diagOutput"><h3>Результат</h3><p>Заполнено '+n+' из '+d.questions.length+'. Введите все ответы для обработки. Отсутствующий ответ нельзя считать нулем.</p><div class="diag-progress"><span style="width:'+(100*n/d.questions.length)+'%"></span></div></section>';
  let body='<section class="diag-output" id="diagOutput"><h3>Результат</h3><div class="diag-headline">'+
   '<strong>'+z.raw+' / '+z.max+'</strong>'+(isWho(d)?'<span>WHO-5: <b>'+z.index+' / 100</b></span>':'<span>Полный опросник · 41 из 41</span>')+'</div>'+
   '<p class="diag-interpret">'+escape(z.summary)+'</p>';
  if(z.scales)body+='<h4>Подшкалы</h4><div class="diag-scales">'+z.scales.map(x=>
   '<div><div><b>'+escape(x.name)+'</b><span>'+x.raw+' / '+(x.items.length*2)+' · порог '+x.cutoff+(x.raw>=x.cutoff?' · достигнут':' · не достигнут')+'</span></div><div class="diag-scale-bar"><span style="width:'+(x.raw/(x.items.length*2)*100)+'%"></span></div></div>').join('')+'</div>';
  body+='<p class="privacy-inline">Результат служит основанием для обсуждения и дальнейшего обследования, не для постановки диагноза. Интерпретация применима только к указанной версии.</p></section>';
  return body;
 }
 function groupTools(ctx){
  const {rows,rowIndex,calcMode}=ctx;
  return '<div class="calc-mode"><button class="btn '+(calcMode==='one'?'primary':'')+'" data-cmode="one">Один ребенок</button><button class="btn '+(calcMode==='class'?'primary':'')+'" data-cmode="class">Группа / класс</button></div>'+
  (calcMode==="class"?'<div class="group-tools"><label>Участник<select id="participantSelect">'+rows.map((r,i)=>'<option value="'+i+'" '+(i===rowIndex?'selected':'')+'>'+(i+1)+'. '+escape(r.name||"Участник "+(i+1))+'</option>').join('')+'</select></label>'+
  '<label>Код участника<input id="participantName" value="'+escape(rows[rowIndex].name||"")+'" placeholder="Например, У-01"></label>'+
  '<button class="btn" id="addParticipant">Добавить</button></div>':'<div class="diag-code"><label>Код участника (необязательно)<input id="diagSingleCode" placeholder="Например, У-01" value="'+escape(rows[rowIndex].name||"")+'"></label></div>');
 }
 function calc(d,ctx){
  const r=ctx.rows[ctx.rowIndex];
  const options=d.options,progress=count(d,r.answers||[]);
  let out='<section class="diag-calculator">'+intro(d)+groupTools(ctx)+
   '<h3>Перенос ответов</h3><p class="privacy-inline">Для каждого номера выберите цифру с официального бланка. <strong>0 – это заполненный ответ.</strong></p>'+
   '<div class="diag-progress"><span style="width:'+(progress/d.questions.length*100)+'%"></span></div>'+
   '<div class="diag-input-grid">';
  d.questions.forEach((q,i)=>{
   out+='<label class="diag-item"><span><b>'+(i+1)+'.</b> '+(isWho(d)?escape(q):'Ответ на пункт '+(i+1))+'</span>'+
   '<select data-diag-index="'+i+'" aria-label="Ответ на пункт '+(i+1)+'"><option value="">– не заполнено –</option>'+
   options.map((o,v)=>'<option value="'+v+'" '+(String(r.answers?.[i])===String(v)?'selected':'')+'>'+v+(isWho(d)?' – '+escape(o):'')+'</option>').join('')+
   '</select></label>';
  });
  out+='</div><div id="diagResultArea">'+results(d,r.answers||[])+'</div>'+
   '<div class="class-actions diag-actions"><button class="btn primary" data-diag-save="report" '+(!score(d,r.answers||[])?'disabled':'')+'>Скачать результат (HTML)</button>'+
   '<button class="btn" data-diag-save="print" '+(!score(d,r.answers||[])?'disabled':'')+'>Печать / сохранить PDF</button>'+
   '<button class="btn" data-diag-save="csv" '+(!score(d,r.answers||[])?'disabled':'')+'>Скачать ответы CSV</button>'+
   '<button class="btn" id="resetParticipant">Очистить ответы</button></div>';
  if(ctx.calcMode==="class")out+='<div class="class-actions"><button class="btn" id="nextParticipant">Следующий участник</button><button class="btn" id="exportGroup">Скачать результаты класса CSV</button></div>'+
    '<h3>Сводная таблица группы</h3><div class="results-table" id="diagGroupResults">'+groupTable(d,ctx.rows)+'</div>';
  return out+'</section>';
 }
 function groupTable(d,rows){
  const headers=isWho(d)?["Участник","Сумма /25","Индекс /100","Скрининг ниже 50"]:["Участник","Сумма /82",...d.scales.map(x=>x.name),"Порог 25"];
  return '<table><thead><tr>'+headers.map(x=>'<th>'+escape(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.map((r,i)=>{
   const z=score(d,r.answers||[]),arr=isWho(d)?[z?.raw??'–',z?.index??'–',z?z.threshold?'Да':'Нет':'–']:
     [z?.raw??'–',...d.scales.map(s=>z?z.scales.find(x=>x.id===s.id).raw:'–'),z?z.threshold?'Достигнут':'Не достигнут':'–'];
   return '<tr><td>'+escape(r.name||"Участник "+(i+1))+'</td>'+arr.map(x=>'<td>'+escape(x)+'</td>').join('')+'</tr>';
  }).join('')+'</tbody></table>';
 }
 function csv(d,rows,detailed){
  const header=["Участник","Методика",...d.questions.map((_,i)=>"Пункт "+(i+1)),"Всего","Индекс WHO-5",
    ...(isWho(d)?[]:d.scales.map(x=>x.name)),"Интерпретация"];
  const lines=[header,...rows.map((r,i)=>{
   const z=score(d,r.answers||[]);
   const label=r.name||"Участник "+(i+1);
   return [label,isWho(d)?"WHO-5":"SCARED",...d.questions.map((_,j)=>r.answers?.[j]??''),z?.raw??'',z?.index??'',
    ...(!isWho(d)?d.scales.map(x=>z?z.scales.find(y=>y.id===x.id).raw:''):[]),
    z?.summary??'Не все ответы заполнены'];
  })];
  const safe=v=>{let x=String(v??'');if(/^\s*[=+\-@]/.test(x))x="'"+x;return '"'+x.replace(/"/g,'""')+'"';};
  return "\uFEFF"+lines.map(r=>r.map(safe).join(';')).join("\r\n");
 }
 function download(contents,filename,mime){
  const blob=new Blob([contents],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function reportDoc(d,row){
  const z=score(d,row.answers||[]);if(!z)return null;
  const date=new Date().toLocaleDateString("ru-RU"),code=row.name||"Без персональных данных";
  let table="<table><thead><tr><th>Показатель</th><th>Результат</th></tr></thead><tbody>"+
   "<tr><td>Методика</td><td>"+escape(isWho(d)?"WHO-5":"SCARED, детская версия")+"</td></tr>"+
   "<tr><td>Код участника</td><td>"+escape(code)+"</td></tr>"+
   "<tr><td>Дата формирования</td><td>"+escape(date)+"</td></tr>"+
   "<tr><td>Общий балл</td><td>"+z.raw+" / "+z.max+"</td></tr>"+
   (isWho(d)?"<tr><td>Индекс WHO-5</td><td>"+z.index+" / 100</td></tr>":
    z.scales.map(x=>"<tr><td>"+escape(x.name)+"</td><td>"+x.raw+" из "+(x.items.length*2)+"; порог "+x.cutoff+"</td></tr>").join(""))+
   "</tbody></table>";
  let answerTable='<h2>Введенные ответы</h2><table><thead><tr><th>Пункт</th><th>Балл</th></tr></thead><tbody>'+
   d.questions.map((_,i)=>'<tr><td>'+(i+1)+'</td><td>'+escape(row.answers[i])+'</td></tr>').join('')+'</tbody></table>';
  return '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Психотека · Результат '+escape(d===null?'':(isWho(d)?"WHO-5":"SCARED"))+'</title>'+
   '<style>@page{size:A4;margin:16mm}body{font:15px/1.5 Arial,sans-serif;max-width:850px;margin:auto;color:#253c32;padding:22px}h1{color:#176042}h2{margin-top:30px;font-size:18px}table{border-collapse:collapse;width:100%;margin:12px 0}td,th{border:1px solid #afc9b5;padding:7px;text-align:left}thead{background:#e8f3ea}.note{background:#edf5ef;padding:13px;border-left:4px solid #227855;margin:20px 0}.muted{color:#526b5e;font-size:13px}tr{break-inside:avoid}@media print{body{padding:0}}</style></head><body>'+
   '<h1>Психотека · Протокол диагностики</h1><p class="muted">Результат психологического скрининга · '+escape(d.scope)+'</p>'+table+
   '<h2>Интерпретация</h2><p class="note">'+escape(z.summary)+'</p><p>'+escape(d.interpret)+'</p>'+
   '<p class="muted">Данный документ не подтверждает диагноз; вывод специалиста строится на комплексном обследовании.</p>'+
   answerTable+'<h2>Источник и версия</h2><p><a href="'+escape(d.source)+'">'+escape(d.source)+'</a></p>'+
   '<p class="muted">'+escape(d.originalLanguage)+' '+escape(d.license)+'</p></body></html>';
 }
 function printReport(html){
  let frame=document.getElementById("psyResultPrint");if(frame)frame.remove();
  frame=document.createElement('iframe');frame.id="psyResultPrint";frame.title="Печать диагностического результата";
  frame.style="position:fixed;bottom:0;right:0;width:0;height:0;border:0";document.body.appendChild(frame);
  frame.onload=()=>{try{frame.contentWindow.focus();frame.contentWindow.print();}catch(err){alert("Не удалось открыть диалог печати.")}};
  frame.contentDocument.open();frame.contentDocument.write(html);frame.contentDocument.close();
 }
 function bind(d,ctx){
  const getRow=()=>ctx.rows[ctx.rowIndex];
  const repaint=()=>{
   const row=getRow(),area=document.getElementById("diagResultArea");
   if(area)area.innerHTML=results(d,row.answers||[]);
   const n=count(d,row.answers||[]),prog=document.querySelector(".diag-calculator > .diag-progress span");
   if(prog)prog.style.width=(100*n/d.questions.length)+"%";
   const complete=!!score(d,row.answers||[]);
   document.querySelectorAll("[data-diag-save]").forEach(b=>b.disabled=!complete);
   const group=document.getElementById("diagGroupResults");if(group)group.innerHTML=groupTable(d,ctx.rows);
  };
  document.querySelectorAll("[data-diag-index]").forEach(input=>input.addEventListener("change",()=>{
   const i=Number(input.dataset.diagIndex);getRow().answers ||= [];getRow().answers[i]=input.value;repaint();
  }));
  document.getElementById("diagSingleCode")?.addEventListener("input",ev=>{getRow().name=ev.target.value});
  document.querySelectorAll("[data-diag-save]").forEach(b=>b.onclick=()=>{
   const r=getRow(),z=score(d,r.answers||[]);if(!z)return;
   const mode=b.dataset.diagSave,stem=(isWho(d)?"WHO5":"SCARED")+"_"+new Date().toISOString().slice(0,10);
   if(mode==="csv"){download(csv(d,[r],true),stem+"_ответы.csv","text/csv;charset=utf-8");return;}
   const report=reportDoc(d,r);
   if(mode==="report")download(report,stem+"_результат.html","text/html;charset=utf-8");
   else if(mode==="print")printReport(report);
  });
 }
 window.PSY_DIAGNOSTICS={valid,count,score,intro,materials,instructions,processing,results,calculator:calc,groupTable,csv,bind,
  reportDoc,download,printReport};
})();