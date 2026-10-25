"use strict";
(function(){
 const name="Оценка школьной мотивации";
 const QUESTIONS=[
  {topic:"Отношение к школе",options:["Не очень","Нравится","Не нравится"],key:[1,3,0]},
  {topic:"Желание идти в школу утром",options:["Чаще хочется остаться дома","Бывает по-разному","Иду с радостью"],key:[0,1,3]},
  {topic:"Посещение школы в необязательный день",options:["Не знаю","Остался бы дома","Пошел бы в школу"],key:[1,0,3]},
  {topic:"Отмена уроков",options:["Не нравится","Бывает по-разному","Нравится"],key:[3,1,0]},
  {topic:"Домашние задания",options:["Хотел бы без домашних заданий","Не хотел бы","Не знаю"],key:[0,3,1]},
  {topic:"Только перемены вместо уроков",options:["Не знаю","Не хотел бы","Хотел бы"],key:[1,3,0]},
  {topic:"Рассказы родителям о школе",options:["Часто","Редко","Не рассказываю"],key:[3,1,0]},
  {topic:"Желание менее строгого учителя",options:["Точно не знаю","Хотел бы","Не хотел бы"],key:[1,0,3]},
  {topic:"Друзья в классе",options:["Мало","Много","Нет друзей"],key:[1,3,0]},
  {topic:"Отношение к одноклассникам",options:["Нравятся","Не очень","Не нравятся"],key:[3,1,0]}
 ];
 const PDF="https://uvarsch.ucoz.ru/PSIH_SLUGB/diagnostika_shkolnoj_motivacii.pdf";
 const OTHER="https://cppisp33.ru/files/bazaigr/metodika_n.g.luskanova.pdf";
 const DOCX="downloads/luskanova_method_guide.docx";
 const BLANK="downloads/luskanova_answer_sheet.html";
 const D=window.PSY_FULL_METHODS;
 D[name]={
  author:"Н. Г. Лусканова",
  age:"7-10 лет · младшие школьники",
  kind:"Опросник / анкета",
  count:"10 вопросов · 3 варианта ответа",
  goal:"Оценка эмоционального отношения ребенка к школе, учебной активности и выраженности школьной мотивации.",
  instructions:"Предъявите ребенку десять вопросов в том же порядке, что и в выбранной редакции первоисточника. К каждому прочитайте три варианта ответа. Попросите выбрать один. Не подсказывайте и не оценивайте выбор. Если читать самостоятельно трудно, психолог читает вопросы вслух, сохраняя формулировки и порядок.",
  questions:QUESTIONS.map(q=>q.topic),
  options:["Вариант 1","Вариант 2","Вариант 3"],
  scoring:"Сумма баллов по десяти ответам, от 0 до 30. Ключ указан для конкретной редакции: [1,3,0];[0,1,3];[1,0,3];[3,1,0];[0,3,1];[1,3,0];[3,1,0];[1,0,3];[1,3,0];[3,1,0]. Пропущенные вопросы не заменять нулями.",
  interpret:"25-30 - высокая мотивация; 20-24 - хорошая; 15-19 - положительное отношение к школе, преимущественно через внеучебные стороны; 10-14 - сниженная; 0-9 - очень низкая мотивация по опубликованной схеме. Показатель описательный, не диагноз.",
  source:PDF,
  officialBlank:PDF,
  sourceScoring:PDF,
  sourceAlternative:OTHER,
  license:"Встроенные названия пунктов - сокращенные рабочие метки, не полный оригинальный опросник. Полный текст проведения находится в PDF первоисточника. Локальный Word - авторское руководство и формы протокола, а не замена оригинальной анкеты.",
  warning:"В опубликованных редакциях расходится ключ третьего ответа на вопрос 6: в выбранном PDF - 0 баллов, в другом ведомственном PDF - 1 балл. Перед проведением не смешивайте бланки и ключи. Встроенный подсчет использует выбранную редакцию [1,3,0].",
  calculator:true,workflow:"luskanova",
  scaleLabels:["Сумма школьной мотивации"],
  items:QUESTIONS,
  guideFile:DOCX,answerFile:BLANK,
  formVersion:"10 вопросов, ключ №6: 1/3/0"
 };
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function score(d,a){
  if(!Array.isArray(a)||a.length!==10)return null;
  const choices=a.map(v=>v===""||v===null||v===undefined?NaN:Number(v));
  if(choices.some(v=>!Number.isInteger(v)||v<0||v>2))return null;
  const points=choices.map((v,i)=>d.items[i].key[v]);
  const raw=points.reduce((x,y)=>x+y,0);
  const band=raw>=25?"Высокая школьная мотивация":raw>=20?"Хорошая школьная мотивация":raw>=15?"Положительное отношение к школе, преимущественно внеучебное":raw>=10?"Сниженная школьная мотивация":"Очень низкая школьная мотивация";
  return {raw,max:30,band,points,choices,caption:"Школьная мотивация по выбранной редакции"};
 }
 function links(d){return '<div class="psy-lus-doclinks">'+
  '<a class="btn primary" href="'+esc(d.guideFile)+'" download>Скачать методику · Word</a>'+
  '<a class="btn" href="'+esc(d.answerFile)+'" download>Скачать бланк для ученика</a>'+
  '<a class="btn" href="'+esc(d.officialBlank)+'" target="_blank" rel="noopener noreferrer">Оригинальная анкета · PDF ↗</a></div>';}
 function instruction(d){
  return '<h3>Проведение</h3><p>'+esc(d.instructions)+'</p>'+
    links(d)+
    '<h3>Фиксация ответов</h3><p>Напротив номера вопроса укажите <strong>номер выбранного ответа: 1, 2 или 3</strong>. Порядок вариантов важен: он совпадает только с выбранным опубликованным бланком.</p>'+
    '<h3>Контроль редакции</h3><div class="notice psy-lus-warning">'+esc(d.warning)+'</div>'+
    '<p>Период обследования и условия проведения фиксируются психологом. При работе с классом лучше использовать коды, а не открытый список ФИО.</p>';
 }
 function materials(d){
  const rows=d.items.map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(q.topic)+'</td><td>□ 1 &nbsp; □ 2 &nbsp; □ 3</td></tr>').join("");
  return '<h3>Бланк ученика / лист ответов</h3><p>Код участника: _______________ &nbsp; Класс: ______ &nbsp; Дата: ___________</p>'+
   '<div class="notice">Этот бланк предназначен для ответов на вопросы из оригинальной анкеты. Краткие названия тем ниже помогают психологу проверить номера и не заменяют полные формулировки вопросов.</div>'+
   '<table class="questions-table psy-lus-answers"><thead><tr><th>№</th><th>Тема</th><th>Отметьте вариант</th></tr></thead><tbody>'+rows+'</tbody></table>'+
   links(d)+'<div class="psy-lus-tools"><button class="btn" type="button" id="lusPrintBlank">Распечатать бланк</button></div>';
 }
 function processing(d){
  return '<h3>Проверенный ключ выбранной версии</h3>'+
  '<table class="questions-table psy-lus-key"><thead><tr><th>№</th><th>Ответ 1</th><th>Ответ 2</th><th>Ответ 3</th></tr></thead><tbody>'+
  d.items.map((q,i)=>'<tr><td>'+(i+1)+'</td>'+q.key.map(n=>'<td>'+n+'</td>').join("")+'</tr>').join("")+'</tbody></table>'+
  '<h3>Оценка суммарного результата</h3><div class="psy-lus-bands">'+[
  ["25-30","Высокая"],["20-24","Хорошая"],["15-19","Положительное отношение, внеучебные стороны"],["10-14","Сниженная"],["0-9","Очень низкая"]
  ].map(([range,title])=>'<div><b>'+range+'</b><span>'+title+'</span></div>').join("")+'</div>'+
  '<div class="notice psy-lus-warning">'+esc(d.warning)+'</div>'+
  '<p>Интерпретация описывает ответы конкретного ребенка и не заменяет беседу, наблюдение и анализ школьной ситуации.</p>'+
  links(d);
 }
 function result(d,a){
  const done=Array.from({length:10},(_,i)=>a?.[i]).filter(x=>x!==""&&x!==null&&x!==undefined&&[0,1,2].includes(Number(x))).length;
  const z=score(d,a);
  let h='<div class="psy-lus-result"><p><strong>Заполнено: '+done+' из 10</strong></p><div class="psy-lus-bar"><i style="width:'+done*10+'%"></i></div>';
  if(!z)return h+'<p>Для подсчета необходимы все 10 ответов. Пропуски не считаются нулем.</p></div>';
  h+='<div class="psy-lus-total"><div><strong>Общий результат</strong><b>'+z.raw+' / 30</b></div><div class="psy-lus-bar"><i style="width:'+(z.raw/30*100)+'%"></i></div><p>'+esc(z.band)+'</p></div>';
  h+='<p class="psy-lus-method-note">Результат анкеты не является диагнозом. Учитывайте беседу с ребенком, наблюдения и школьные обстоятельства.</p></div>';
  return h;
 }
 function calculator(d,ctx){
  const all=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}];
  const row=all[ctx.rowIndex]||all[0],a=row.answers||[];
  let h='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ученик</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Целый класс</button></div>'+
  '<div class="notice">Переносите ответы <strong>1, 2 или 3</strong> из <a href="'+esc(d.officialBlank)+'" target="_blank" rel="noopener noreferrer">полного бланка выбранной редакции ↗</a>. Номера ответов нельзя менять местами. Персональные сведения не отправляются на сервер.</div>';
  if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Ученик <select id="participantSelect">'+all.map((p,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?'selected':'')+'>'+esc((i+1)+". "+(p.name||"Ученик "+(i+1)))+'</option>').join("")+'</select></label><label>Код (необязательно)<input id="participantName" placeholder="Код ученика" value="'+esc(row.name||"")+'"></label><button class="btn" id="addParticipant">Добавить</button></div>';
  h+='<div class="psy-lus-inputs">'+d.items.map((q,i)=>'<label><span><b>'+(i+1)+'.</b> '+esc(q.topic)+'</span><select data-lus-answer="'+i+'" aria-label="Вопрос '+(i+1)+'"><option value="">- не выбран -</option>'+q.options.map((s,n)=>'<option value="'+n+'" '+(String(a[i])===String(n)?'selected':'')+'>'+(n+1)+'. '+esc(s)+'</option>').join("")+'</select></label>').join("")+'</div>';
  h+='<div id="lusResult">'+result(d,a)+'</div><div class="psy-lus-tools"><button class="btn" id="resetParticipant">Очистить ответы ученика</button><button class="btn primary" id="lusExportIndividual">Скачать индивидуальный результат</button></div>';
  if(ctx.calcMode==="class")h+='<h3>Результаты класса</h3><div class="results-table"><table><thead><tr><th>Код</th><th>Баллы</th><th>Описательная категория</th></tr></thead><tbody>'+all.map((p,i)=>{const z=score(d,p.answers);return '<tr><td>'+esc(p.name||"Ученик "+(i+1))+'</td><td>'+(z?z.raw:"-")+'</td><td>'+esc(z?.band||"Не заполнено")+'</td></tr>'}).join("")+'</tbody></table></div><div class="psy-lus-tools"><button class="btn" id="lusExportClass">Скачать таблицу класса CSV</button></div>';
  return h;
 }
 function dl(fname,s,mime){const b=new Blob([s],{type:mime}),url=URL.createObjectURL(b),link=document.createElement("a");link.href=url;link.download=fname;link.click();setTimeout(()=>URL.revokeObjectURL(url),2000)}
 function bind(d,ctx){
  document.querySelectorAll("[data-lus-answer]").forEach(sel=>sel.addEventListener("change",()=>{
   ctx.rows[ctx.rowIndex].answers[+sel.dataset.lusAnswer]=sel.value===""?"":Number(sel.value);
   const root=document.getElementById("lusResult");
   if(root)root.innerHTML=result(d,ctx.rows[ctx.rowIndex].answers);
  }));
  document.getElementById("lusExportIndividual")?.addEventListener("click",()=>{
   const row=ctx.rows[ctx.rowIndex];
   dl("luskanova_rezultat.json",JSON.stringify({method:name,version:d.formVersion,code:row.name||"",answers:row.answers||[],result:score(d,row.answers||[]),source:d.source,warning:d.warning},null,2),"application/json;charset=utf-8");
  });
  document.getElementById("lusExportClass")?.addEventListener("click",()=>{
   const grid=[["Код участника","Баллы","Описание"],...ctx.rows.map((r,i)=>{const z=score(d,r.answers);return [r.name||"Ученик "+(i+1),z?.raw??"",z?.band??"Не заполнено"]})];
   const csv="\uFEFF"+grid.map(cols=>cols.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(";")).join("\r\n");
   dl("luskanova_klass.csv",csv,"text/csv;charset=utf-8");
  });
  document.getElementById("lusPrintBlank")?.addEventListener("click",()=>window.open(d.answerFile,"_blank","noopener"));
 }
 window.PSY_LUSKANOVA={score,instruction,materials,processing,calculator,bind};
})();
