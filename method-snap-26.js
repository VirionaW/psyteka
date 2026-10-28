"use strict";
(function(){
 const NAME="SNAP-IV-26";
 const ORIGINAL="https://capp.ucsf.edu/sites/g/files/tkssra5836/f/SNAP-IV-26-item-Teacher-and-Parent-rating-scale.pdf";
 const RULES="https://caddra.ca/pdfs/downloads/SNAP_IV_Instructions.pdf";
 const GUIDE="downloads/snap_iv_26_guide.docx";
 const PARENT="downloads/snap_iv_parent_register.html";
 const TEACHER="downloads/snap_iv_teacher_register.html";
 const TOPICS=[
 "Ошибки из-за невнимательности","Сложность удержания внимания","Кажется, что не слушает обращенную речь",
 "Не доводит задания до конца","Трудности организации занятий","Избегание длительных умственных усилий",
 "Потеря необходимых вещей","Отвлечение на внешние стимулы","Забывчивость в повседневных делах",
 "Суетливые движения и ерзание","Покидает место, когда нужно сидеть","Бегает или залезает куда-то не к месту",
 "Трудно играть и заниматься тихо","Постоянная двигательная активность","Чрезмерная разговорчивость",
 "Отвечает, не дослушав вопрос","Сложно дождаться очереди","Вмешивается в разговоры и занятия других",
 "Частая потеря самообладания","Споры со взрослыми","Несоблюдение просьб и правил",
 "Действия, намеренно раздражающие других","Перекладывание вины за свои ошибки","Повышенная обидчивость и раздражимость",
 "Злость и недовольство","Мстительное поведение"
 ];
 const SCALES=[{id:"attention",name:"Невнимательность",from:0,to:9,max:27},
 {id:"activity",name:"Гиперактивность / импульсивность",from:9,to:18,max:27},
 {id:"opposition",name:"Оппозиционное поведение",from:18,to:26,max:24}];
 const raterName=r=>r==="teacher"?"Педагог":"Родитель";
 const d={
  author:"Дж. М. Свенсон, М. Нолан, У. Пелхэм (J. M. Swanson, M. Nolan, W. Pelham); SNAP-IV",
  age:"Дети и подростки школьного возраста; применять с учетом возраста и валидности языковой версии",
  kind:"Опросник наблюдения, формы родителей и педагогов",count:"26 пунктов, 2 формы, 3 подшкалы",
  goal:"Структурированная оценка наблюдаемых признаков невнимательности, гиперактивности / импульсивности и оппозиционного поведения в разных ситуациях.",
  instructions:"Используйте исходную форму SNAP-IV-26 (английский язык) либо проверенную русскоязычную адаптацию. Родитель и педагог заполняют отдельные бланки независимо друг от друга. Для каждого из 26 пунктов отметьте частоту или выраженность проявлений от 0 до 3, затем перенесите ответы в Метоларию по номерам.",
  questions:TOPICS,options:["0 - совсем нет","1 - немного","2 - заметно","3 - сильно выражено"],
  scoring:"Пункты 1-9 - невнимательность (сумма 0-27; среднее сумма/9); 10-18 - гиперактивность/импульсивность (0-27; сумма/9); 19-26 - оппозиционное поведение (0-24; сумма/8). Каждый ответ от 0 до 3. Для каждой формы расчёт возможен только при всех 26 ответах. Отсутствующий ответ не равен 0. Общая сумма 0-78 отображается как дополнительный описательный показатель, не клинический индекс.",
  interpret:"Высокие значения означают более частое проявление оцениваемого поведения по мнению данного наблюдателя. Шкала является скрининговым средством, а не основанием для диагноза СДВГ, оппозиционно-вызывающего расстройства или заключения о поведении. Сведения от родителей и педагога анализируются раздельно, с учетом разных ситуаций, возраста, языка и источника норм.",
  warning:"На сайте - рабочие тематические подписи, а не перевод оригинальных 26 утверждений. Для обследования предъявляйте оригинальный бланк или валидизированный перевод. В разных руководствах встречаются разные пороги; здесь автоматических диагнозов и универсальных категорий нет.",
  source:ORIGINAL,sourceScoring:RULES,officialBlank:ORIGINAL,
  guideFile:GUIDE,answerFile:PARENT,parentFile:PARENT,teacherFile:TEACHER,
  scales:SCALES,calculator:true,workflow:"snap26",
  license:"Исходный английский бланк Swanson опубликован Университетом Калифорнии в Сан-Франциско. Печатные локальные листы Метоларии являются регистрационными протоколами по номерам, а не заменой оригинального текста."
 };
 (window.PSY_FULL_METHODS||(window.PSY_FULL_METHODS={}))[NAME]=d;
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const valid=v=>v!==""&&v!==null&&v!==undefined&&Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<=3;
 const answersOf=(row,rater)=>row?.snapForms?.[rater]||[];
 const variantOf=row=>row?.snapRater==="teacher"?"teacher":"parent";
 const fmt=x=>x.toFixed(2).replace(".",",");
 function score(data,answers){
  if(!Array.isArray(answers)||answers.length<26)return null;
  const a=Array.from({length:26},(_,i)=>valid(answers[i])?Number(answers[i]):NaN);
  if(a.some(v=>!Number.isInteger(v)))return null;
  const scales=SCALES.map(s=>{const raw=a.slice(s.from,s.to).reduce((x,y)=>x+y,0);
    return {id:s.id,name:s.name,raw,max:s.max,mean:raw/(s.to-s.from),items:s.to-s.from};});
  return {raw:a.reduce((x,y)=>x+y,0),max:78,scales,answers:a,complete:true};
 }
 function count(a){return Array.from({length:26},(_,i)=>a?.[i]).filter(valid).length}
 function links(){
  return '<div class="psy-snap-links">'+
   '<a class="btn primary" download href="'+GUIDE+'">Методика и ключ · Word</a>'+
   '<a class="btn" target="_blank" rel="noopener" href="'+PARENT+'">Бланк родителей · А4</a>'+
   '<a class="btn" target="_blank" rel="noopener" href="'+TEACHER+'">Бланк педагога · А4</a>'+
   '<a class="btn" target="_blank" rel="noopener noreferrer" href="'+ORIGINAL+'">Оригинал 26 пунктов · PDF ↗</a></div>';
 }
 function instruction(){
  return '<h3>Порядок работы</h3><ol>'+
   '<li>Выберите проверенную версию SNAP-IV-26, подходящую возрасту и языку обследуемой семьи.</li>'+
   '<li>Предоставьте родителю и педагогу отдельные копии оригинального опросника. Каждый заполняет его самостоятельно по своим наблюдениям, без согласования ответов.</li>'+
   '<li>Каждый из 26 ответов оценивается 0, 1, 2 или 3. Обязательно сохраняйте порядок пунктов; при пропусках числовые результаты не рассчитываются.</li>'+
   '<li>В Метоларии укажите код ребенка и переключайте «Родитель» / «Педагог»: их ответы сохраняются отдельно в рамках открытой страницы.</li>'+
   '<li>Проанализируйте три подшкалы и различия контекстов. Не ставьте диагноз по результату опросника.</li></ol>'+
   '<h3>Инструкция для оценивающего взрослого</h3><blockquote class="kid-instruction">Отметьте для каждого из 26 утверждений бланка, насколько оно соответствует вашим наблюдениям за поведением ребенка. Выберите один вариант от 0 до 3. Не обсуждайте ответы с другими оценивающими.</blockquote>'+links()+
   '<div class="notice psy-snap-warning">'+esc(d.warning)+'</div>';
 }
 function materials(){
  const rows=TOPICS.map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(q)+'</td><td>□ 0 &nbsp; □ 1 &nbsp; □ 2 &nbsp; □ 3</td></tr>').join("");
  return '<h3>Регистрация ответов по оригинальным пунктам</h3><p>Родительская и педагогическая формы разделены. Тематические подписи приведены только для ориентации специалиста; непосредственное предъявление проводят по проверенному полному опроснику.</p>'+
   '<div class="notice">Печатайте нужную форму А4. Для каждого ребенка ведите отдельные бланки родителя и педагога.</div>'+
   '<table class="questions-table psy-snap-table"><thead><tr><th>№</th><th>Тема пункта (не авторский перевод)</th><th>Выбранный ответ</th></tr></thead><tbody>'+rows+'</tbody></table>'+links();
 }
 function processing(){
  return '<h3>Ключ SNAP-IV-26</h3><p>'+esc(d.scoring)+'</p>'+
  '<table class="questions-table"><thead><tr><th>Подшкала</th><th>Пункты</th><th>Сумма</th><th>Средний балл</th></tr></thead><tbody>'+
  SCALES.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+(s.from+1)+'-'+s.to+'</td><td>0-'+s.max+'</td><td>Сумма / '+(s.to-s.from)+'</td></tr>').join("")+'</tbody></table>'+
  '<p>Ответы родителей и педагога <strong>не суммируются и не усредняются друг с другом</strong>. Общая сумма 0-78 не имеет самостоятельного универсального диагностического порога.</p>'+
  '<h3>Интерпретация</h3><p>'+esc(d.interpret)+'</p>'+
  '<div class="notice psy-snap-warning">'+esc(d.warning)+'</div>'+
  '<p><a href="'+ORIGINAL+'" target="_blank" rel="noopener noreferrer">Оригинальный бланк Swanson и схема из UCSF ↗</a> · <a href="'+RULES+'" target="_blank" rel="noopener noreferrer">CADDRA: расчет среднего балла ↗</a></p>';
 }
 function result(a,label){
  const z=score(d,a),n=count(a);
  let out='<section class="psy-snap-result"><h3>Результат: '+esc(label)+'</h3><p>Заполнено <b>'+n+' из 26</b></p><div class="psy-snap-track"><span style="width:'+(100*n/26)+'%"></span></div>';
  if(!z)return out+'<p class="psy-snap-small">Чтобы посчитать показатели, перенесите все 26 ответов. Значение 0 - заполненный ответ, пустое поле - нет ответа.</p></section>';
  out+='<div class="psy-snap-statgrid">'+z.scales.map(s=>'<div><small>'+esc(s.name)+'</small><b>'+s.raw+' / '+s.max+'</b><span>Среднее '+fmt(s.mean)+' / 3</span><div class="psy-snap-track"><span style="width:'+(s.raw/s.max*100)+'%"></span></div></div>').join("")+'</div>'+
  '<p>Дополнительная сумма по всем 26 пунктам: <b>'+z.raw+' из 78</b>.</p><p class="psy-snap-small">Баллы описывают сообщения конкретного наблюдателя, а не диагноз. Не используйте эти значения для автоматической классификации детей.</p></section>';
  return out;
 }
 function formTable(rows){
  const scoreCol=(r,t,i)=>{const z=score(d,answersOf(r,t));return z?z.scales.map(s=>fmt(s.mean)).join(" / "):count(answersOf(r,t))+"/26"};
  return '<div class="psy-snap-scroll"><table><thead><tr><th>Код</th><th>Родитель: средние Н / Г / О</th><th>Педагог: средние Н / Г / О</th></tr></thead><tbody>'+
   rows.map((r,i)=>'<tr><td>'+esc(r.name||"У-"+String(i+1).padStart(2,"0"))+'</td><td>'+scoreCol(r,"parent",i)+'</td><td>'+scoreCol(r,"teacher",i)+'</td></tr>').join("")+'</tbody></table></div>'+
  '<p class="psy-snap-small">Н - невнимательность; Г - гиперактивность / импульсивность; О - оппозиционное поведение. Неполные формы показывают число внесенных ответов и не получают баллы.</p>';
 }
 function calculator(data,ctx){
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],role=variantOf(r),a=answersOf(r,role);
  let html='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ребенок</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>'+
  '<div class="notice psy-snap-warning">Подсчет ведется отдельно для родителя и педагога. Вводите только условные коды. Данные не отправляются на сервер и не сохраняются после закрытия страницы.</div>';
  if(ctx.calcMode==="class")html+='<div class="group-tools"><label>Ученик<select id="participantSelect">'+rows.map((x,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(x.name||"У-"+(i+1))+'</option>').join("")+'</select></label><label>Код ребенка<input id="participantName" maxlength="40" value="'+esc(r.name||"")+'" placeholder="У-01, без ФИО"></label><button class="btn" id="addParticipant">Добавить ученика</button></div>';
  else html+='<label class="psy-snap-code">Код ребенка (необязательно)<input id="snapSingleCode" maxlength="40" value="'+esc(r.name||"")+'" placeholder="Без ФИО"></label>';
  html+='<div class="psy-snap-role"><label>Кто заполнил бланк?<select id="snapRater"><option value="parent" '+(role==="parent"?"selected":"")+'>Родитель</option><option value="teacher" '+(role==="teacher"?"selected":"")+'>Педагог</option></select></label><p>У одного ребенка сохраняются две независимые формы.</p></div>'+
  '<div class="psy-snap-grid">'+TOPICS.map((q,i)=>'<label class="psy-snap-item"><span><b>'+(i+1)+'.</b> '+esc(q)+'</span><select data-snap-answer="'+i+'" aria-label="'+esc(raterName(role))+' - ответ на пункт '+(i+1)+'"><option value="">— не заполнено —</option>'+
  [0,1,2,3].map(v=>'<option value="'+v+'" '+(a[i]!==""&&a[i]!=null&&Number(a[i])===v?"selected":"")+'>'+v+'</option>').join("")+'</select></label>').join("")+'</div>'+
  '<div id="snapScore">'+result(a,raterName(role))+'</div>'+
  '<div class="psy-snap-actions"><button class="btn" id="snapClear">Очистить '+(role==="parent"?"родительскую":"педагогическую")+' форму</button><button class="btn primary" id="snapReport">Скачать индивидуальный протокол</button></div>';
  if(ctx.calcMode==="class")html+='<h3>Сводка по классу</h3><div id="snapGroup">'+formTable(rows)+'</div><div class="psy-snap-actions"><button class="btn" id="nextParticipant">Следующий ребенок</button><button class="btn primary" id="snapCSV">Скачать CSV обеих форм</button></div>';
  return html;
 }
 function save(name,content,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
 function cell(x){let s=String(x??"");if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
 function csv(data){return "\uFEFF"+data.map(row=>row.map(cell).join(";")).join("\r\n")}
 function bind(data,ctx){
  const rows=ctx.rows||[],r=rows[ctx.rowIndex];if(!r)return;
  let role=variantOf(r);
  r.snapForms ||= {parent:[],teacher:[]};r.snapForms[role] ||= [];
  const refresh=()=>{const s=document.getElementById("snapScore");if(s)s.innerHTML=result(answersOf(r,role),raterName(role));const g=document.getElementById("snapGroup");if(g)g.innerHTML=formTable(rows)};
  document.getElementById("snapSingleCode")?.addEventListener("input",e=>{r.name=e.target.value});
  document.getElementById("snapRater")?.addEventListener("change",e=>{
    role=e.target.value==="teacher"?"teacher":"parent";r.snapRater=role;r.snapForms[role] ||= [];
    const a=answersOf(r,role);
    document.querySelectorAll("[data-snap-answer]").forEach(el=>{const v=a[Number(el.dataset.snapAnswer)];el.value=valid(v)?String(v):"";el.setAttribute("aria-label",raterName(role)+" - ответ на пункт "+(Number(el.dataset.snapAnswer)+1))});
    const b=document.getElementById("snapClear");if(b)b.textContent="Очистить "+(role==="parent"?"родительскую":"педагогическую")+" форму";
    refresh();
  });
  document.querySelectorAll("[data-snap-answer]").forEach(el=>el.addEventListener("change",()=>{
    r.snapForms[role][Number(el.dataset.snapAnswer)]=el.value===""?"":Number(el.value);refresh();
  }));
  document.getElementById("snapClear")?.addEventListener("click",()=>{
   if(!confirm("Очистить только выбранный бланк - "+raterName(role)+"?"))return;
   r.snapForms[role]=[];document.querySelectorAll("[data-snap-answer]").forEach(el=>el.value="");refresh();
  });
  document.getElementById("snapReport")?.addEventListener("click",()=>{
   const z=score(data,answersOf(r,role));if(!z){alert("Заполните все 26 пунктов выбранной формы.");return}
   const t='<table><thead><tr><th>Шкала</th><th>Сумма</th><th>Среднее</th></tr></thead><tbody>'+
   z.scales.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.raw+' / '+s.max+'</td><td>'+fmt(s.mean)+' / 3</td></tr>').join("")+'</tbody></table>';
   const h='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>SNAP-IV-26 · протокол</title><style>@page{size:A4;margin:15mm}body{font:14px/1.55 Arial,sans-serif;color:#22382c;max-width:820px;margin:25px auto}h1{font-size:22px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #a7c3b0;padding:9px;text-align:left}.note{font-size:12px;color:#586b5d}</style></head><body><h1>SNAP-IV-26 · индивидуальный протокол</h1><p>Код ребенка: '+esc(r.name||"Без персональных данных")+'<br>Оценивающий: '+esc(raterName(role))+'<br>Дата формирования: '+new Date().toLocaleDateString("ru-RU")+'</p>'+t+
   '<p>Дополнительная сумма: '+z.raw+' из 78.</p><p class="note">'+esc(d.interpret)+'</p><p class="note">Тематические метки в калькуляторе не заменяют исходный текст. Источник: '+esc(ORIGINAL)+'</p></body></html>';
   save("SNAP_IV_"+role+"_protocol.html",h,"text/html;charset=utf-8");
  });
  document.getElementById("snapCSV")?.addEventListener("click",()=>{
   const out=[["Код","Оценивающий","Ответов из 26","Невнимательность сумма","Невнимательность среднее","Гиперактивность сумма","Гиперактивность среднее","Оппозиционное поведение сумма","Оппозиционное поведение среднее","Всего 0-78",...Array.from({length:26},(_,i)=>"Пункт "+(i+1))]];
   rows.forEach((x,i)=>["parent","teacher"].forEach(t=>{const a=answersOf(x,t),z=score(data,a);
    out.push([x.name||"У-"+(i+1),raterName(t),count(a),...(z?z.scales.flatMap(q=>[q.raw,fmt(q.mean)]):["","","","","",""]),z?z.raw:"",...Array.from({length:26},(_,k)=>valid(a[k])?Number(a[k]):"")]);
   }));
   save("SNAP_IV_26_group.csv",csv(out),"text/csv;charset=utf-8");
  });
 }
 window.PSY_SNAP26={score,count,links,instruction,materials,processing,calculator,bind,answersOf,formTable};
})();