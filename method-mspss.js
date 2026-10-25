"use strict";
(function(){
 const NAME="Шкала воспринимаемой социальной поддержки (MSPSS)";
 const SOURCE="https://gzimet.wixsite.com/mspss";
 const PDF="https://12fab08f-d2d3-ce70-6d1a-9d3fa0d8a67b.filesusr.com/ugd/5119f9_2f88fadcd382463daf5821e8af94a865.pdf";
 const GUIDE="downloads/mspss_method_guide.docx",BLANK="downloads/mspss_answer_sheet.html",STUDENT="downloads/mspss_student_working_ru.html",METHOD_PAGE="downloads/mspss_method.html",STUDENT_WORD="downloads/mspss_student_sheet.docx";
 const TOPICS=["Поддержка значимого человека в трудной ситуации","Возможность делиться переживаниями со значимым человеком","Готовность семьи помочь","Эмоциональная поддержка семьи","Значимый человек как источник утешения","Готовность друзей помочь","Возможность рассчитывать на друзей при трудностях","Обсуждение проблем с семьей","Возможность делиться радостью и печалью с друзьями","Внимание значимого человека к переживаниям","Помощь семьи в принятии решений","Обсуждение проблем с друзьями"];
 const SUB=[{id:"other",name:"Значимый человек",items:[1,2,5,10]},{id:"family",name:"Семья",items:[3,4,8,11]},{id:"friends",name:"Друзья",items:[6,7,9,12]}];
 const d={
  author:"Г. Зимет, Н. Далем, С. Зимет, Г. Фарли (1988)",
  age:"Подростки и взрослые",
  kind:"Опросник",
  count:"12 утверждений",
  goal:"Оценка субъективно воспринимаемой социальной поддержки с выделением трех ее источников: семьи, друзей и значимого человека.",
  instructions:"Попросите ученика внимательно прочитать двенадцать утверждений о поддержке и выбрать для каждого степень согласия по семибалльной шкале. Ответы заносятся в протокол в исходном порядке.",
  questions:TOPICS,
  options:["Очень сильно не согласен","Сильно не согласен","Скорее не согласен","Нейтрально","Скорее согласен","Сильно согласен","Очень сильно согласен"],
  scoring:"Подшкалы: значимый человек 1,2,5,10; семья 3,4,8,11; друзья 6,7,9,12. Для каждой подшкалы сумма четырех ответов делится на 4; общий показатель - сумма 12 ответов, деленная на 12. Диапазон средних значений 1-7. Пропуски и ответы вне 1-7 исключают расчет; обратных пунктов нет.",
  interpret:"Более высокий средний балл соответствует более высокой субъективной оценке доступности социальной поддержки. Три подшкалы позволяют описать вклад разных источников поддержки. При интерпретации учитываются возраст, условия обследования и социальный контекст.",
  source:SOURCE,sourceScoring:PDF,officialBlank:PDF,
  guideFile:GUIDE,answerFile:BLANK,studentFile:STUDENT,studentWordFile:STUDENT_WORD,methodPage:METHOD_PAGE,workflow:"mspss",calculator:true,scales:SUB,
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
 const STUDENT_ITEMS=["Когда мне нужна помощь, рядом есть особенный для меня человек.","Есть особенный для меня человек, с которым я могу разделить радость и печаль.","Моя семья действительно старается помогать мне.","Я получаю от семьи эмоциональную помощь и поддержку, в которой нуждаюсь.","В моей жизни есть особенный человек, который по-настоящему меня утешает.","Мои друзья действительно стараются мне помочь.","Когда что-то идет не так, я могу рассчитывать на друзей.","Я могу обсуждать свои проблемы с семьей.","У меня есть друзья, с которыми можно делиться радостью и печалью.","В моей жизни есть особенный человек, которому небезразличны мои чувства.","Члены моей семьи готовы помогать мне принимать решения.","Я могу рассказывать друзьям о своих проблемах."];
 function instruction(){
  return '<section class="psy-mspss-section psy-mspss-document">'+
  '<h3>Методика и руководство</h3>'+
  '<p>Полный методический документ содержит цель обследования, инструкцию для чтения ученику, стимульный материал, порядок проведения, ключ, обработку и интерпретацию результатов.</p>'+
  '<div class="psy-mspss-doc-preview"><strong>Шкала воспринимаемой социальной поддержки</strong><span>Автор: '+esc(d.author)+'</span><span>Назначение: '+esc(d.goal)+'</span><span>Объем: 12 утверждений, 3 шкалы</span></div>'+
  '<a class="btn primary psy-mspss-view" href="'+METHOD_PAGE+'" target="_blank" rel="noopener noreferrer">Посмотреть и распечатать ↗</a>'+
  '</section>';
 }
 function materials(){
  return '<section class="psy-mspss-section psy-mspss-student">'+
   '<div class="psy-mspss-blank-head"><div><h3>Бланк ученика</h3><p class="psy-mspss-small">Отдельный документ для предъявления участнику.</p></div>'+
   '<a class="btn primary psy-mspss-view" href="'+STUDENT+'" target="_blank" rel="noopener noreferrer">Посмотреть и распечатать ↗</a></div>'+
   '<p><strong>Инструкция ученику:</strong> Прочитай каждое предложение. Подумай, согласен ли ты с ним. Выбери одну цифру от 1 до 7 и отметь кружок под ней.</p>'+
   '<div class="psy-mspss-rating">'+d.options.map((o,i)=>'<div><strong>'+(i+1)+'</strong><span>'+esc(o)+'</span></div>').join("")+'</div>'+
   '<div class="psy-mspss-blank-scroll"><table class="psy-mspss-blank-table"><thead><tr><th>№</th><th>Утверждение</th>'+
   Array.from({length:7},(_,j)=>'<th>'+(j+1)+'</th>').join("")+'</tr></thead><tbody>'+
   STUDENT_ITEMS.map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(q)+'</td>'+Array.from({length:7},()=>'<td aria-hidden="true">○</td>').join("")+'</tr>').join("")+
   '</tbody></table></div></section>';
 }
 function processing(){
  return '<section class="psy-mspss-section"><h3>Ключ</h3><p>'+esc(d.scoring)+'</p></section>';
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
  '<p class="psy-mspss-small">Перенесите ответы из заполненного бланка по порядку пунктов и используйте условный код участника.</p>';
  if(ctx.calcMode==="class")html+='<div class="group-tools"><label>Участник<select id="participantSelect">'+rows.map((x,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(x.name||"У-"+String(i+1).padStart(2,"0"))+'</option>').join("")+'</select></label><label>Код<input id="participantName" maxlength="40" value="'+esc(r.name||"")+'" placeholder="У-01 (без ФИО)"></label><button class="btn" id="addParticipant">Добавить</button></div>';
  else html+='<label class="psy-mspss-code">Код (необязательно)<input id="mspssSingleCode" maxlength="40" value="'+esc(r.name||"")+'" placeholder="Без ФИО"></label>';
  html+='<p class="psy-mspss-small">Заполнено '+done(a)+' из 12.</p>'+
  '<div class="psy-mspss-grid">'+TOPICS.map((q,i)=>'<label class="psy-mspss-item"><span><b>'+(i+1)+'.</b> '+esc(q)+'</span><input class="psy-mspss-score-input" type="text" inputmode="numeric" autocomplete="off" maxlength="1" data-mspss="'+i+'" aria-label="Ответ на пункт '+(i+1)+' (цифра от 1 до 7)" placeholder="1-7" value="'+esc(a[i]??"")+'"></label>').join("")+'</div>'+
  '<div id="mspssResult">'+result(a)+'</div><div class="psy-mspss-actions"><button class="btn primary" id="mspssSave">Скачать отчет участника (HTML)</button></div>';
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
  const inputs=[...document.querySelectorAll("input[data-mspss]")];
  const refresh=()=>{const out=document.getElementById("mspssResult");if(out)out.innerHTML=result(r.answers);const g=document.getElementById("mspssGroup");if(g)g.innerHTML=group(rows);};
  inputs.forEach((el,i)=>{
   el.addEventListener("input",()=>{
    const v=el.value.replace(/[^1-7]/g,"").slice(0,1);
    el.value=v;r.answers[Number(el.dataset.mspss)]=v?Number(v):"";
    el.classList.toggle("psy-mspss-invalid",false);
    refresh();
    if(v&&i<inputs.length-1)inputs[i+1].focus();
   });
   el.addEventListener("keydown",ev=>{
    if(ev.key==="Backspace"&&!el.value&&i>0){ev.preventDefault();inputs[i-1].focus();inputs[i-1].select();}
    if(ev.key==="ArrowRight"&&i<inputs.length-1){ev.preventDefault();inputs[i+1].focus();}
    if(ev.key==="ArrowLeft"&&i>0){ev.preventDefault();inputs[i-1].focus();}
   });
   el.addEventListener("focus",()=>el.select());
  });
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
 window.PSY_MSPSS={score,done,instruction,materials,processing,calculator,bind};
})();