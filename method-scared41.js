"use strict";
(function(){
 const NAME="SCARED";
 const CHILD="https://ncpal.org/sites/default/files/2025-03/SCARED-Ages8-18-Child-Screening-English.pdf";
 const PARENT="https://ncpal.org/sites/default/files/2025-03/SCARED-Ages8-18-Parent-Screening-English.pdf";
 const SCORING="https://med.stanford.edu/content/dam/sm/ppc/documents/Mental_Health/SCARED-child_English.pdf";
 const GUIDE="downloads/scared41_method_guide.docx";
 const CHILD_REG="downloads/scared41_child_register.html";
 const PARENT_REG="downloads/scared41_parent_register.html";
 const SCALES=[
   {id:"panic",name:"Панические и соматические проявления",q:[1,6,9,12,15,18,19,22,24,27,30,34,38],cutoff:7},
   {id:"general",name:"Генерализованная тревога",q:[5,7,14,21,23,28,33,35,37],cutoff:9},
   {id:"separation",name:"Тревога разлуки",q:[4,8,13,16,20,25,29,31],cutoff:5},
   {id:"social",name:"Социальная тревога",q:[3,10,26,32,39,40,41],cutoff:8},
   {id:"school",name:"Избегание школы",q:[2,11,17,36],cutoff:3}
 ];
 const NOTE="В этой версии сайта нет утверждений в самодельном русском переводе. Для обследования нужны полные официальные формы SCARED на английском языке или отдельно подтвержденная русскоязычная адаптация. Локальные листы — регистрация ответов по номерам, а не самостоятельный перевод опросника. Оригинальные пороги служат ориентиром скрининга и не являются диагнозом или нормами для непроверенной языковой версии.";
 const D={
  author:"Б. Бирмахер и соавторы (B. Birmaher, S. Khetarpal, M. Cully, D. Brent, S. McKenzie; University of Pittsburgh)",
  age:"8–18 лет; для 8–11 лет рекомендуется помощь взрослого при понимании вопросов",
  kind:"Скрининговый опросник тревожных переживаний, отдельные детская и родительская версии",
  count:"41 пункт × 2 информанта, пять шкал",
  goal:"Скрининг признаков тревожности у детей и подростков с оценкой панических/соматических, генерализованных, сепарационных, социальных и школьных проявлений.",
  instructions:"Предъявите полную детскую (самоотчет) или родительскую (оценка ребенка) форму SCARED-41. Оцениваются последние 3 месяца. На каждый из 41 пунктов выбрать одно значение: 0 — никогда или почти никогда, 1 — иногда, 2 — часто. Укажите соответствующего информанта и перенесите ответы строго по номерам. Родитель и ребенок заполняют независимые формы.",
  scoring:"Все 41 ответа (0, 1, 2) суммируются без обратных пунктов, диапазон 0–82. Панические/соматические: 1,6,9,12,15,18,19,22,24,27,30,34,38 (0–26); генерализованная: 5,7,14,21,23,28,33,35,37 (0–18); разлуки: 4,8,13,16,20,25,29,31 (0–16); социальная: 3,10,26,32,39,40,41 (0–14); школьное избегание: 2,11,17,36 (0–8). Пункты не пересекаются; суммы пяти шкал равны общему баллу. Пропуски исключают расчет.",
  interpret:"При подсчете по оригиналу общий ориентир скрининга ≥25 баллов; пороги пяти шкал 7, 9, 5, 8, 3 балла соответственно. Это пороги настороженности в источнике, не диагноз и не универсальные возрастные нормы. Данные ребенка и родителя следует рассматривать отдельно; расхождения требуют контекстного уточнения.",
  warning:NOTE,
  questions:Array.from({length:41},(_,i)=>"Пункт "+(i+1)+" оригинальной формы"),options:["0 — не соответствует / почти никогда","1 — иногда","2 — часто"],
  source:CHILD,officialBlank:CHILD,childPDF:CHILD,parentPDF:PARENT,scoringPDF:SCORING,
  guideFile:GUIDE,answerFile:CHILD_REG,childFile:CHILD_REG,parentFile:PARENT_REG,calculator:true,
  scales:SCALES,workflow:"scared41",
  sourceDescription:"NC-PAL (Duke Health): полные SCARED Ages 8–18, child/parent, с разрешения B. Birmaher; Stanford Medicine: scoring aide.",
  license:"Локальные бланки только регистрируют номера и числовые ответы, оригинальные английские формы доступны в NC-PAL без изменений."
 };
 (window.PSY_FULL_METHODS||(window.PSY_FULL_METHODS={}))[NAME]=D;
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const roleText=r=>r==="parent"?"Родитель":"Ребенок";
 const valid=v=>v===0||v===1||v===2||v==="0"||v==="1"||v==="2";
 const form=(r,role)=>r?.scaredForms?.[role]||[];
 function score(d,answers){
  if(!Array.isArray(answers)||answers.length<41)return null;
  const a=Array.from({length:41},(_,i)=>answers[i]);
  if(a.some(v=>!valid(v)))return null;
  const v=a.map(Number);
  const scales=SCALES.map(s=>({id:s.id,name:s.name,raw:s.q.reduce((n,i)=>n+v[i-1],0),max:s.q.length*2,cutoff:s.cutoff,items:s.q}));
  return {complete:true,raw:v.reduce((n,x)=>n+x,0),max:82,scales,answers:v};
 }
 function filled(a){return Array.from({length:41},(_,i)=>a?.[i]).filter(valid).length;}
 function links(){return '<div class="psy-sc-links"><a class="btn primary" download href="'+GUIDE+'">Руководство · Word</a>'+
 '<a class="btn" href="'+CHILD_REG+'" target="_blank" rel="noopener noreferrer">Бланк ребенка · А4</a>'+
 '<a class="btn" href="'+PARENT_REG+'" target="_blank" rel="noopener noreferrer">Бланк родителя · А4</a>'+
 '<a class="btn" href="'+CHILD+'" target="_blank" rel="noopener noreferrer">Оригинал ребенку · PDF ↗</a>'+
 '<a class="btn" href="'+PARENT+'" target="_blank" rel="noopener noreferrer">Оригинал родителю · PDF ↗</a></div>';}
 function instruction(){return '<h3>Подготовка и проведение</h3><ol>'+
 '<li>Выберите соответствующую полную версию: <a target="_blank" rel="noopener noreferrer" href="'+CHILD+'">для ребенка (PDF)</a> или <a target="_blank" rel="noopener noreferrer" href="'+PARENT+'">для родителя (PDF)</a>; уточните возраст и понятность языка.</li>'+
 '<li>Попросите оценить последние 3 месяца. Ответы по каждому из 41 пунктов: 0 — никогда/почти никогда, 1 — иногда, 2 — часто.</li>'+
 '<li>Детская и родительская формы заполняются независимо. Для детей 8–11 лет специалист может объяснять непонятные формулировки, не предлагая ответ.</li>'+
 '<li>В Психотеке укажите условный код и переключайте вкладку информанта для ввода ответов в порядке 1–41.</li>'+
 '<li>После ввода всех пунктов просмотрите общую сумму и пять независимых шкал; сопоставляйте ответы информантов без механического усреднения.</li></ol>'+
 '<h3>Нейтральная инструкция ребенку</h3><blockquote class="kid-instruction">Отметь, насколько каждое утверждение подходит тебе за последние три месяца. Выбери для каждого один ответ: 0, 1 или 2. Здесь нет правильных и неправильных ответов.</blockquote>'+
 '<div class="notice psy-sc-warning">'+esc(NOTE)+'</div>'+links();}
 function materials(){return '<h3>Материалы для обследования</h3><p>Используйте полный официальный текст SCARED-41, а для записи ответов — отдельные формы ребенка и родителя. Печатные листы Психотеки имеют 41 строку и не содержат нового перевода утверждений.</p>'+
 links()+'<p>После заполнения перенесите только числовые ответы строго по порядку пунктов оригинала. Не объединяйте данные двух информантов в один набор.</p>'+
 '<div class="notice psy-sc-warning">'+esc(NOTE)+'</div>';}
 function processing(){return '<h3>Официальный ключ подсчета</h3><p>Каждый ответ равен 0, 1 или 2 баллам. Обратных пунктов нет. <b>Общая сумма: 0–82</b>. Пять шкал образуют разбиение всех 41 пунктов.</p>'+
 '<div class="psy-sc-scroll"><table><thead><tr><th>Шкала</th><th>Номера пунктов</th><th>Диапазон</th><th>Ориентир источника</th></tr></thead><tbody>'+
 SCALES.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.q.join(", ")+'</td><td>0–'+s.q.length*2+'</td><td>≥'+s.cutoff+'</td></tr>').join("")+
 '</tbody></table></div><h3>Интерпретация</h3><p>В опубликованном руководстве для общей суммы указан ориентир ≥25 баллов, для пяти шкал — пороги, приведенные в таблице. Это только показатели скрининга, а не диагноз. Их применимость зависит от популяции и языка формы. В этой версии сайта классификация не рассчитывается автоматически.</p>'+
 '<p>Баллы ребенка и родителя рассчитываются отдельно, даже если оба бланка заполнены для одного кода. Пустой пункт не считается нулем.</p>'+
 '<div class="notice psy-sc-warning">'+esc(NOTE)+'</div><p>Источник: <a href="'+SCORING+'" target="_blank" rel="noopener noreferrer">Stanford Medicine, Scoring Aide ↗</a>.</p>';}
 function results(a,role){
  const z=score(D,a),n=filled(a);
  let h='<section class="psy-sc-results"><h3>Результат: '+esc(roleText(role))+'</h3><p>Заполнено <b>'+n+' из 41</b></p><div class="psy-sc-track"><span style="width:'+(n/41*100)+'%"></span></div>';
  if(!z)return h+'<p class="psy-sc-muted">Для подсчета заполните все пункты. 0 — полноценный ответ, пустое поле — пропуск.</p></section>';
  return h+'<div class="psy-sc-total"><span>Общая сумма</span><b>'+z.raw+' / 82</b><span>Скрининговый ориентир источника: ≥25 (не диагноз)</span></div>'+
  '<div class="psy-sc-factors">'+z.scales.map(s=>'<div class="psy-sc-factor"><div><span>'+esc(s.name)+'</span><b>'+s.raw+' / '+s.max+'</b></div><div class="psy-sc-track"><span style="width:'+(s.raw/s.max*100)+'%"></span></div><small>Ориентир из оригинала: ≥'+s.cutoff+'</small></div>').join("")+'</div>'+
  '<p class="psy-sc-muted">Результат отражает выбранного информанта. Не используйте баллы как клинический диагноз или универсальные нормы для непроверенной русскоязычной версии.</p></section>';
 }
 function groupTable(rows){
  const headers=SCALES.map((s,i)=>'<th title="'+esc(s.name)+'">Ш'+(i+1)+'</th>').join("");
  const lines=rows.flatMap((r,i)=>["child","parent"].map(role=>{
    const a=form(r,role),z=score(D,a);
    return '<tr><td>'+esc(r.name||"У-"+String(i+1).padStart(2,"0"))+'</td><td>'+esc(roleText(role))+'</td><td>'+(z?z.raw+'/82':'Заполнено '+filled(a)+'/41')+'</td>'+
      SCALES.map((s,j)=>'<td>'+(z?z.scales[j].raw:'—')+'</td>').join("")+'</tr>';
  })).join("");
  return '<div class="psy-sc-scroll"><table><thead><tr><th>Код</th><th>Форма</th><th>Общий балл</th>'+headers+'</tr></thead><tbody>'+lines+'</tbody></table></div>'+
   '<p class="psy-sc-muted">Ш1 — паническая/соматическая; Ш2 — генерализованная; Ш3 — разлуки; Ш4 — социальная; Ш5 — школьное избегание. Неполные бланки без сумм.</p>';
 }
 function calculator(d,ctx){
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0];
  const role=r.scaredRater==="parent"?"parent":"child",a=form(r,role);
  let h='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ребенок</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Класс / группа</button></div>'+
  '<div class="notice psy-sc-warning">Используйте полный авторский бланк на английском языке или проверенный перевод. Введите ответы только по номерам, без ФИО. Результаты не отправляются на сервер.</div>';
  if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Ученик<select id="participantSelect">'+rows.map((x,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(x.name||"У-"+(i+1))+'</option>').join("")+'</select></label><label>Код<input id="participantName" maxlength="50" value="'+esc(r.name||"")+'" placeholder="У-01"></label><button class="btn" id="addParticipant">Добавить ученика</button></div>';
  else h+='<label class="psy-sc-code">Условный код<input id="scaredSingleCode" maxlength="50" value="'+esc(r.name||"")+'" placeholder="Например, У-01"></label>';
  h+='<div class="psy-sc-role"><label>Заполненный бланк<select id="scaredRater"><option value="child" '+(role==="child"?"selected":"")+'>Ребенок</option><option value="parent" '+(role==="parent"?"selected":"")+'>Родитель</option></select></label><span>Оба бланка хранятся независимо до закрытия страницы.</span></div>'+
  '<div class="psy-sc-grid">'+Array.from({length:41},(_,i)=>'<label class="psy-sc-item"><span>Пункт <b>'+String(i+1).padStart(2,"0")+'</b></span><select data-scared-answer="'+i+'" aria-label="'+roleText(role)+', пункт '+(i+1)+'"><option value="">— не заполнен —</option>'+
  [0,1,2].map(v=>'<option value="'+v+'" '+(valid(a[i])&&Number(a[i])===v?"selected":"")+'>'+v+'</option>').join("")+'</select></label>').join("")+'</div>'+
  '<div id="scaredResults">'+results(a,role)+'</div>'+
  '<div class="psy-sc-actions"><button class="btn" id="scaredClear">Очистить '+(role==="child"?"детский":"родительский")+' бланк</button><button class="btn primary" id="scaredReport">Скачать индивидуальный протокол</button></div>';
  if(ctx.calcMode==="class")h+='<h3>Сводка класса</h3><div id="scaredGroup">'+groupTable(rows)+'</div><div class="psy-sc-actions"><button class="btn" id="nextParticipant">Следующий ученик</button><button class="btn primary" id="scaredCsv">Скачать CSV для Excel</button></div>';
  return h;
 }
 function save(name,body,type){const url=URL.createObjectURL(new Blob([body],{type})),el=document.createElement("a");el.href=url;el.download=name;el.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
 function csvCell(x){let s=String(x??"");if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
 function csv(rows){return "\uFEFF"+rows.map(x=>x.map(csvCell).join(";")).join("\r\n")}
 function bind(d,ctx){
  const rows=ctx.rows||[],r=rows[ctx.rowIndex];if(!r)return;
  r.scaredForms||={child:[],parent:[]};let role=r.scaredRater==="parent"?"parent":"child";
  r.scaredForms[role]||=[];
  const refresh=()=>{const el=document.getElementById("scaredResults");if(el)el.innerHTML=results(form(r,role),role);const group=document.getElementById("scaredGroup");if(group)group.innerHTML=groupTable(rows)};
  document.getElementById("scaredSingleCode")?.addEventListener("input",e=>{r.name=e.target.value});
  document.getElementById("scaredRater")?.addEventListener("change",e=>{
   role=e.target.value==="parent"?"parent":"child";r.scaredRater=role;r.scaredForms[role]||=[];
   const a=form(r,role);
   document.querySelectorAll("[data-scared-answer]").forEach(el=>{const v=a[Number(el.dataset.scaredAnswer)];el.value=valid(v)?String(v):"";el.setAttribute("aria-label",roleText(role)+", пункт "+(Number(el.dataset.scaredAnswer)+1))});
   const b=document.getElementById("scaredClear");if(b)b.textContent="Очистить "+(role==="child"?"детский":"родительский")+" бланк";
   refresh();
  });
  document.querySelectorAll("[data-scared-answer]").forEach(el=>el.addEventListener("change",()=>{r.scaredForms[role][Number(el.dataset.scaredAnswer)]=el.value===""?"":Number(el.value);refresh()}));
  document.getElementById("scaredClear")?.addEventListener("click",()=>{
   if(!confirm("Очистить выбранную форму: "+roleText(role)+"?"))return;
   r.scaredForms[role]=[];document.querySelectorAll("[data-scared-answer]").forEach(el=>el.value="");refresh();
  });
  document.getElementById("scaredReport")?.addEventListener("click",()=>{
   const z=score(d,form(r,role));if(!z){alert("Заполните все 41 пункта выбранной формы.");return;}
   const table='<table><thead><tr><th>Шкала</th><th>Сумма</th><th>Ориентир первоисточника</th></tr></thead><tbody>'+
    z.scales.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.raw+' / '+s.max+'</td><td>≥'+s.cutoff+'</td></tr>').join("")+'</tbody></table>';
   const body='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>SCARED-41, протокол</title><style>@page{size:A4;margin:14mm}body{font:14px/1.5 Arial;color:#253c30;max-width:850px;margin:22px auto}h1{font-size:21px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #abc0ae;text-align:left;padding:8px}.small{font-size:12px;color:#546b5d}</style></head><body><h1>SCARED-41 — индивидуальный протокол</h1><p>Код: '+esc(r.name||"не указан")+'<br>Информант: '+esc(roleText(role))+'<br>Дата: '+new Date().toLocaleDateString("ru-RU")+'</p><h2>Общая сумма: '+z.raw+' / 82</h2>'+table+
   '<p class="small">'+esc(NOTE)+'</p><p class="small">Форма: '+esc(role==="child"?CHILD:PARENT)+'</p></body></html>';
   save("SCARED41_"+role+"_protocol.html",body,"text/html;charset=utf-8");
  });
  document.getElementById("scaredCsv")?.addEventListener("click",()=>{
   const header=["Код","Информант","Заполнено из 41","Общая сумма",...SCALES.map(s=>s.name),...Array.from({length:41},(_,i)=>"Пункт "+(i+1))];
   const out=[header];
   rows.forEach((x,i)=>["child","parent"].forEach(which=>{const a=form(x,which),z=score(d,a);out.push([x.name||"У-"+(i+1),roleText(which),filled(a),z?.raw??"",...SCALES.map((s,k)=>z?z.scales[k].raw:""),...Array.from({length:41},(_,j)=>valid(a[j])?Number(a[j]):"")]);}));
   save("SCARED41_group.csv",csv(out),"text/csv;charset=utf-8");
  });
 }
 window.PSY_SCARED41={score,filled,form,instruction,materials,processing,calculator,bind,results,groupTable,scales:SCALES};
})();