"use strict";
(function(){
 const NAME="Шкала воспринимаемой социальной поддержки (MSPSS)";
 const SOURCE="https://gzimet.wixsite.com/mspss";
 const PDF="https://12fab08f-d2d3-ce70-6d1a-9d3fa0d8a67b.filesusr.com/ugd/5119f9_2f88fadcd382463daf5821e8af94a865.pdf";
 const GUIDE="downloads/mspss_method_guide.docx",BLANK="downloads/mspss_answer_sheet.html",STUDENT="downloads/mspss_student_working_ru.html",METHOD_PAGE="downloads/mspss_method.html",METHOD_WITH_BLANK="downloads/mspss_method_with_blank.html",STUDENT_WORD="downloads/mspss_student_sheet.docx";
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
  interpret:"Ориентиры разработчика по среднему баллу: 1,0-2,9 - низкая воспринимаемая поддержка; 3,0-5,0 - умеренная; 5,1-7,0 - высокая. Это предложенные категории, а не возрастные или популяционные нормы; необходимо учитывать возраст, язык и социальный контекст.",
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
 const PUPIL_INSTRUCTION="Прочитай предложения. Подумай, насколько ты согласен с каждым из них. Для каждого предложения выбери одну цифру от 1 до 7 и впиши ее в подходящую клетку. Здесь нет правильных и неправильных ответов.";
 const STUDENT_ITEMS=["Когда мне нужна помощь, рядом есть особенный для меня человек.","Есть особенный для меня человек, с которым я могу разделить радость и печаль.","Моя семья действительно старается помогать мне.","Я получаю от семьи эмоциональную помощь и поддержку, в которой нуждаюсь.","В моей жизни есть особенный человек, который по-настоящему меня утешает.","Мои друзья действительно стараются мне помочь.","Когда что-то идет не так, я могу рассчитывать на друзей.","Я могу обсуждать свои проблемы с семьей.","У меня есть друзья, с которыми можно делиться радостью и печалью.","В моей жизни есть особенный человек, которому небезразличны мои чувства.","Члены моей семьи готовы помогать мне принимать решения.","Я могу рассказывать друзьям о своих проблемах."];
 function instruction(){
  return '<section class="psy-mspss-section psy-mspss-manual">'+
   '<div class="psy-mspss-manual-bar"><div><h3>Методика и руководство</h3></div><div class="psy-mspss-manual-actions"><a class="btn" href="'+METHOD_PAGE+'" target="_blank" rel="noopener noreferrer">Без бланка ↗</a><a class="btn primary" href="'+METHOD_WITH_BLANK+'" target="_blank" rel="noopener noreferrer">С бланком ↗</a></div></div>'+
   '<h3>Цель</h3><p>'+esc(d.goal)+'</p>'+
   '<h3>Описание методики</h3><p>Методика включает 12 утверждений и три шкалы: поддержка семьи, друзей и значимого человека. Участник выбирает степень согласия с каждым утверждением по семибалльной шкале.</p>'+
   '<h3>Порядок проведения</h3><ol><li>Подготовьте бланк и обеспечьте спокойную обстановку.</li><li>Прочитайте инструкцию и предложите ученику заполнить бланк самостоятельно.</li><li>Перенесите 12 ответов в обработку в исходном порядке. Не подсказывайте ответы.</li></ol>'+
   '<h3>Инструкция для чтения ученику</h3><div class="psy-mspss-script">«'+esc(PUPIL_INSTRUCTION)+'»</div>'+
   '<h3>Утверждения</h3><ol class="psy-mspss-statements">'+STUDENT_ITEMS.map(q=>'<li>'+esc(q)+'</li>').join("")+'</ol>'+
   '<h3>Ключ и подсчет</h3><div class="psy-mspss-key-wrap"><table class="psy-mspss-key"><thead><tr><th>Шкала</th><th>Пункты</th><th>Расчет</th></tr></thead><tbody>'+
   SUB.map(o=>'<tr><td>'+esc(o.name)+'</td><td>'+o.items.join(", ")+'</td><td>Сумма / 4</td></tr>').join("")+
   '<tr><td>Общий показатель</td><td>Все 12</td><td>Сумма / 12</td></tr></tbody></table></div>'+
   '<p>Ответы оцениваются от 1 до 7. Обратных пунктов нет. Если пропущен хотя бы один ответ, полный расчет не выполняется.</p>'+
   '<h3>Интерпретация</h3><p>'+esc(d.interpret)+'</p><p>Для рабочего русского перевода не установлены собственные возрастные нормы и диагностические пороги. Интерпретация требует учета контекста и профессионального суждения.</p>'+
   '</section>';
 }
 function materials(){
  return '<section class="psy-mspss-section psy-mspss-student">'+
   '<div class="psy-mspss-blank-head"><div><h3>Бланк ученика</h3><p>Анкета для самостоятельного заполнения.</p></div><a class="btn primary psy-mspss-view" href="'+STUDENT+'" target="_blank" rel="noopener noreferrer">Посмотреть и распечатать ↗</a></div>'+
   '<p><strong>Инструкция.</strong> '+esc(PUPIL_INSTRUCTION)+'</p>'+
   '<div class="psy-mspss-rating">'+["Совсем не согласен","Не согласен","Скорее не согласен","Ни согласен, ни не согласен","Скорее согласен","Согласен","Полностью согласен"].map((o,i)=>'<div><strong>'+(i+1)+'</strong><span>'+o+'</span></div>').join("")+'</div>'+
   '<div class="psy-mspss-blank-scroll"><table class="psy-mspss-blank-table"><thead><tr><th>№</th><th>Утверждение</th>'+
   Array.from({length:7},(_,j)=>'<th>'+(j+1)+'</th>').join("")+'</tr></thead><tbody>'+
   STUDENT_ITEMS.map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(q)+'</td>'+Array.from({length:7},()=>'<td class="psy-mspss-answer-cell"></td>').join("")+'</tr>').join("")+
   '</tbody></table></div></section>';
 }
 function processing(){return '<p>'+esc(d.scoring)+'</p>';}
 const category=x=>{const r=Math.round(x*10)/10;return r<=2.9?"Низкая":r<=5?"Умеренная":"Высокая";};
 function result(answers){
  const n=done(answers),z=score(d,answers);
  if(!z)return '<div class="psy-mspss-result"><h3>Заполнено '+n+' из 12</h3><div class="psy-mspss-track"><span style="width:'+(100*n/12)+'%"></span></div><p>Расчет появится после ввода всех двенадцати ответов от 1 до 7. Пропуск нельзя считать нулем.</p></div>';
  return '<div class="psy-mspss-result"><h3>Средняя воспринимаемая поддержка</h3><strong class="psy-mspss-mean">'+z.mean.toFixed(2)+' <small>/ 7</small></strong><p>Ориентир: <b>'+category(z.mean).toLowerCase()+' воспринимаемая поддержка</b>. Сумма '+z.raw+' из 84. Показатели ниже - средние баллы по четырем вопросам каждой подшкалы.</p>'+
  '<div class="psy-mspss-scales">'+z.subscales.map(s=>'<div><b>'+esc(s.name)+'</b><strong>'+s.mean.toFixed(2)+' / 7</strong><div class="psy-mspss-track"><span style="width:'+(s.mean/7*100)+'%"></span></div></div>').join("")+'</div><p class="psy-mspss-small">'+esc(d.interpret)+'</p></div>';
 }
 const alphabet=(rows)=>rows.slice().sort((a,b)=>(a.name||"").localeCompare(b.name||"","ru",{sensitivity:"base"}));
 function group(rows){
  const ordered=alphabet(rows);
  return '<section class="psy-mspss-group"><h3>Сводная ведомость класса</h3><div class="psy-mspss-scroll"><table><thead><tr><th>ФИО</th><th>Общий / 7</th><th>Семья</th><th>Друзья</th><th>Значимый человек</th><th>Ответов</th></tr></thead><tbody>'+
  ordered.map((r,i)=>{const z=score(d,r.answers);const v=id=>z?z.subscales.find(s=>s.id===id).mean.toFixed(2):"—";return '<tr><td>'+esc(r.name||"Участник "+(i+1))+'</td><td>'+(z?z.mean.toFixed(2):"—")+'</td><td>'+v("family")+'</td><td>'+v("friends")+'</td><td>'+v("other")+'</td><td>'+done(r.answers)+'/12</td></tr>'}).join("")+
  '</tbody></table></div><div class="psy-mspss-actions"><button type="button" class="btn" id="mspssCSV">Скачать ведомость класса · CSV</button></div></section>';
 }
 function calculator(data,ctx){
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],a=r.answers||[];
  let h='<section class="psy-mspss-calculator"><div class="calc-mode psy-mspss-modes"><button type="button" class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button type="button" class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
  if(ctx.calcMode==="class"){
   h+='<div class="psy-mspss-workspace"><aside class="psy-mspss-sidebar"><h3>Список учащихся</h3><p>Введите ФИО по одному в строке.</p>'+
      '<label class="psy-mspss-label" for="mspssBulkNames">Добавить участников</label><textarea id="mspssBulkNames" rows="5" placeholder="Иванов Иван&#10;Петрова Мария"></textarea>'+
      '<button type="button" class="btn primary psy-mspss-add" id="mspssAddNames">Добавить в список</button>'+
      '<button type="button" class="btn psy-mspss-sort" id="mspssSort">По алфавиту А - Я</button>'+
      '<div class="psy-mspss-person-list">'+rows.map((u,i)=>'<button type="button" class="psy-mspss-person '+(i===ctx.rowIndex?"active":"")+'" data-mspss-person="'+i+'"><span>'+esc(u.name||"Новый участник "+(i+1))+'</span><small>'+done(u.answers)+'/12</small></button>').join("")+'</div>'+
      '</aside><div class="psy-mspss-entry">';
  }else h+='<div class="psy-mspss-entry">';
  h+='<label class="psy-mspss-name-field" for="mspssCurrentName"><span>Фамилия и имя</span><input id="mspssCurrentName" type="text" autocomplete="off" maxlength="120" value="'+esc(r.name||"")+'" placeholder="Введите ФИО"></label>'+
    '<p class="psy-mspss-progress" id="mspssProgress">Заполнено '+done(a)+' из 12</p>'+
    '<div class="psy-mspss-grid">'+TOPICS.map((q,i)=>'<label class="psy-mspss-item '+(a[i]!==""&&a[i]!=null&&Number(a[i])>=1&&Number(a[i])<=7?"is-complete":"is-missing")+'"><span><b>'+(i+1)+'.</b> '+esc(q)+'</span><input class="psy-mspss-score-input" type="text" inputmode="numeric" autocomplete="off" maxlength="1" data-mspss="'+i+'" aria-label="Ответ на пункт '+(i+1)+'" placeholder="1-7" value="'+esc(a[i]??"")+'"></label>').join("")+'</div>';
  if(ctx.calcMode==="class")h+='<div class="psy-mspss-after-questions"><button type="button" class="btn primary" id="mspssNext">Следующий участник →</button></div>';
  h+='<div id="mspssResult">'+result(a)+'</div></div>';
  if(ctx.calcMode==="class")h+='</div>'+group(rows);
  h+='</section>';
  return h;
 }
 function download(name,text,type){
  const u=URL.createObjectURL(new Blob([text],{type})),a=document.createElement("a");a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);
 }
 const csvCell=v=>{let s=String(v??"");if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
 function csv(rows){return "\uFEFF"+rows.map(r=>r.map(csvCell).join(";")).join("\r\n")}

 function openReport(person){
  const z=score(d,person?.answers);
  if(!z)return false;
  window.PSY_MSPSS.pendingReport={
    name:String(person.name||"ФИО не указано").slice(0,120),
    date:new Date().toLocaleDateString("ru-RU"),
    raw:z.raw,overall:z.mean,
    subscales:z.subscales.map(x=>({name:x.name,mean:x.mean,raw:x.raw})),
    answers:z.answers,questions:STUDENT_ITEMS,interpret:d.interpret
  };
  const popup=window.open("downloads/mspss_report.html","_blank");
  if(!popup){alert("Разрешите открытие новой вкладки для просмотра отчета.");return false;}
  return true;
 }
 function bind(data,ctx){
  const rows=ctx.rows||[],r=rows[ctx.rowIndex];if(!r)return;
  const updateFooter=()=>{
    const btn=document.getElementById("mspssReportBottom");
    if(btn){const complete=!!score(data,r.answers);btn.disabled=!complete;btn.classList.toggle("psy-mspss-waiting",!complete);}
  };
  const refresh=()=>{
    const out=document.getElementById("mspssResult");if(out)out.innerHTML=result(r.answers);
    const g=document.getElementById("mspssGroup");if(g){g.innerHTML=group(rows);document.getElementById("mspssCSV")?.addEventListener("click",downloadCsv);}
    const progress=document.getElementById("mspssProgress");if(progress)progress.textContent="Заполнено "+done(r.answers)+" из 12";
    const status=document.querySelector(".psy-mspss-person.active small");if(status)status.textContent=done(r.answers)+"/12";
    updateFooter();
  };
  document.getElementById("mspssCurrentName")?.addEventListener("input",e=>{
    r.name=e.target.value;
    const selected=document.querySelector(".psy-mspss-person.active span");if(selected)selected.textContent=r.name||"Участник";
  });
  document.querySelectorAll("[data-mspss-person]").forEach(el=>{
    el.addEventListener("click",()=>ctx.onSelect?.(Number(el.dataset.mspssPerson)));
  });
  document.getElementById("mspssAddNames")?.addEventListener("click",()=>{
    const box=document.getElementById("mspssBulkNames");
    const names=(box?.value||"").split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean);
    if(names.length)ctx.onBulkAdd?.(names);else box?.focus();
  });
  document.getElementById("mspssSort")?.addEventListener("click",()=>ctx.onSort?.());
  document.getElementById("mspssNext")?.addEventListener("click",()=>ctx.onNext?.());
  const inputs=[...document.querySelectorAll("input[data-mspss]")];
  inputs.forEach((el,i)=>{
    el.addEventListener("input",()=>{
      const v=el.value.replace(/[^1-7]/g,"").slice(0,1);
      el.value=v;r.answers[Number(el.dataset.mspss)]=v?Number(v):"";
      el.closest(".psy-mspss-item")?.classList.toggle("is-complete",!!v);
      el.closest(".psy-mspss-item")?.classList.toggle("is-missing",!v);
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
  function downloadCsv(){
    const ordered=alphabet(rows);
    const table=[["ФИО","Общий показатель","Значимый человек","Семья","Друзья","Ответов"],...ordered.map((p,i)=>{
      const z=score(data,p.answers);
      return [p.name||"Участник "+(i+1),z?z.mean.toFixed(2):"",...SUB.map(x=>z?z.subscales.find(y=>y.id===x.id).mean.toFixed(2):""),done(p.answers)];
    })];
    download("MSPSS_ведомость_класса.csv",csv(table),"text/csv;charset=utf-8");
  }
  document.getElementById("mspssCSV")?.addEventListener("click",downloadCsv);
  updateFooter();
 }
 window.PSY_MSPSS={score,done,instruction,materials,processing,calculator,bind,openReport,pendingReport:null};
})();