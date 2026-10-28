"use strict";
(function(){
 const NAME="Тест школьной тревожности";
 const METHOD_NAME="Тест школьной тревожности Филлипса";
 const SOURCE="https://psmetodiki.ru/index.php/mladshie-shkolniki/prochee/253-test-shkolnoj-trevozhnosti-fillipsa";
 const SECOND="https://www.azps.ru/tests/tests_philips.html";
 const YES=[11,20,22,24,25,30,35,36,38,39,41,43,44];
 const KEY=Array.from({length:58},(_,i)=>YES.includes(i+1)?"yes":"no");
 // Cited published edition (Kostina, 2006, via psmetodiki.ru): factor 1 includes 4, not 3.
 const SCALES=[
  {id:"general",name:"Общая тревожность в школе",q:[2,4,7,12,16,21,23,26,28,...Array.from({length:13},(_,i)=>i+46)]},
  {id:"social",name:"Переживание социального стресса",q:[5,10,15,20,24,30,33,36,39,42,44]},
  {id:"achievement",name:"Фрустрация потребности в достижении успеха",q:[1,3,6,11,17,19,25,29,32,35,38,41,43]},
  {id:"expression",name:"Страх самовыражения",q:[27,31,34,37,40,45]},
  {id:"testing",name:"Страх ситуации проверки знаний",q:[2,7,12,16,21,26]},
  {id:"expectations",name:"Страх несоответствия ожиданиям окружающих",q:[3,8,13,17,22]},
  {id:"physio",name:"Низкая физиологическая сопротивляемость стрессу",q:[9,14,18,23,28]},
  {id:"teachers",name:"Проблемы и страхи в отношениях с учителями",q:[2,6,11,32,35,41,44,47]}
 ];
 const NOTE="Использована опубликованная редакция ключа, в которой первый фактор включает вопрос № 4 (а не № 3). В других источниках встречается № 3. Не смешивайте результаты разных редакций; до использования проверьте соответствие списка факторов и полного текста опросника.";
 const WARN="Текст 58 вопросов предоставлен в источнике по ссылке. Локальный бланк содержит только номера и варианты «Да»/«Нет» и предназначен для регистрации ответов при предъявлении полного опросника. Никаких диагнозов или автоматического направления к специалисту по порогам не формируется.";
 const LABELS=["Да","Нет"];
 const DATA={
  author:"Б. Н. Филлипс (B. N. Phillips); используемая русскоязычная публикация по Л. М. Костиной",
  age:"Младший и средний школьный возраст; уточняйте возрастные ограничения применяемой версии",
  kind:"Опросник самоотчета школьника, 58 вопросов, ответы «Да» / «Нет»",
  count:"58 вопросов; общий показатель и 8 факторов тревожности",
  goal:"Выявление тем школьного беспокойства в ситуациях учебы, оценивания, общения со сверстниками и учителями.",
  instructions:"Предъявите полный текст опубликованного опросника из указанного источника и регистрационный лист А4. Ученик отвечает «Да» или «Нет» на все 58 вопросов. До обработки проверьте полноту и соответствие редакции ключа.",
  scoring:"Сравните каждый ответ с ключом: показатель тревожности = количество ответов, НЕ совпадающих с ключом. Общий результат 0–58, проценты = несовпадения / 58 × 100. Для каждого из 8 факторов рассчитайте число несовпадений и процент от количества пунктов этого фактора. Факторы пересекаются; их суммы нельзя складывать для получения общего балла.",
  interpret:"Чем больше несовпадений с ключом, тем более выражены признаки школьного беспокойства по данной версии. В распространенной схеме >50% означает повышенное, >75% — высокое значение, однако возрастные нормы и клиническая диагностическая валидность зависят от версии. Не используйте результаты как диагноз и не делайте выводов по одному опроснику.",
  warning:WARN+" "+NOTE,
  versionNote:NOTE,questions:Array.from({length:58},(_,i)=>"Вопрос "+(i+1)+" (смотрите полный текст источника)"),
  options:LABELS,source:SOURCE,sourceComparison:SECOND,officialBlank:SOURCE,
  guideFile:"downloads/phillips_school_anxiety_guide.docx",
  answerFile:"downloads/phillips_school_anxiety_student.html",
  calculator:true,workflow:"phillips58",
  scales:SCALES,
  sourceDescription:"Л. М. Костина. Методы диагностики тревожности. СПб.: Речь, 2006 — указанная публикация полного текста и ключа; сопоставление со вторым общедоступным источником.",
  license:"Печатный лист Метоларии является самостоятельным регистрационным листом. Для предъявления 58 вопросов используется полный текст по ссылке, а не тематическая реконструкция."
 };
 const D=window.PSY_FULL_METHODS||(window.PSY_FULL_METHODS={});
 D[NAME]=DATA;
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const fmt=n=>Number(n).toFixed(1).replace(".",",");
 const valid=x=>x==="yes"||x==="no";
 const val=(r,i)=>r?.answers?.[i];
 function score(d,answers){
  if(!Array.isArray(answers)||answers.length<58)return null;
  const a=Array.from({length:58},(_,i)=>answers[i]);
  if(a.some(x=>!valid(x)))return null;
  const mismatches=a.map((x,i)=>x!==KEY[i]);
  const total=mismatches.filter(Boolean).length;
  const scales=SCALES.map(s=>{
   const missed=s.q.reduce((sum,n)=>sum+(mismatches[n-1]?1:0),0);
   return {id:s.id,name:s.name,raw:missed,max:s.q.length,percent:missed/s.q.length*100,q:s.q};
  });
  return {raw:total,max:58,percent:total/58*100,scales,complete:true,mismatches,answers:a};
 }
 function count(a){return Array.from({length:58},(_,i)=>a?.[i]).filter(valid).length}
 function links(){return '<div class="psy-ph-links">'+
   '<a class="btn primary" download href="'+DATA.guideFile+'">Руководство · Word</a>'+
   '<a class="btn" target="_blank" rel="noopener noreferrer" href="'+DATA.answerFile+'">Бланк ученика · А4</a>'+
   '<a class="btn" target="_blank" rel="noopener noreferrer" href="'+SOURCE+'">58 вопросов и ключ (источник) ↗</a></div>'}
 function instruction(){
  return '<h3>Инструкция для проведения</h3><ol>'+
   '<li>Откройте <a href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">полный текст 58 вопросов</a> и убедитесь, что используете согласованную редакцию.</li>'+
   '<li>Выдайте ребенку напечатанный лист ответов, где есть номера 1–58 и два варианта «Да» и «Нет». Можно проводить индивидуально или в небольшой группе с учетом возраста и конфиденциальности.</li>'+
   '<li>Объясните, что правильных и неправильных ответов нет. Предложите отвечать самостоятельно и отмечать один вариант на каждый вопрос.</li>'+
   '<li>Соберите и проверьте бланки; в калькуляторе перенесите ответы в том же порядке. Пропуски не приравниваются к «Нет».</li>'+
   '<li>Смотрите общую долю несовпадений и профиль восьми факторов. Интерпретируйте вместе с наблюдением и беседой, не сообщая ребенку формальных ярлыков.</li></ol>'+
   '<h3>Слова для ученика</h3><blockquote class="kid-instruction">Ответь на вопросы о том, как ты чувствуешь себя в школе. У каждого номера выбери «Да», если согласен, или «Нет», если не согласен. Здесь нет хороших и плохих ответов. Старайся отвечать самостоятельно.</blockquote>'+
   '<div class="notice psy-ph-note">'+esc(NOTE)+'</div>'+links();
 }
 function materials(){
  return '<h3>Вопросы и бланк ученика</h3><p>Полный текст содержит 58 вопросов. Чтобы избежать неточной переработки стандартизованного инструмента, в Метоларии вопросы предъявляются по <a href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">документированной редакции источника</a>, а локальный лист предназначен для регистрации ответов по номерам.</p>'+
   '<p>В бланке: код вместо ФИО, класс, дата, 58 строк с выбором «Да» / «Нет» и место для заметок специалиста. При необходимости вопросы читает ведущий, а ученик отмечает ответы.</p>'+
   links()+'<div class="notice psy-ph-note">'+esc(WARN)+'</div>';
 }
 function processing(){
  let html='<h3>Ключ и подсчет</h3><p>«Да» в ключе: <b>'+YES.join(", ")+'</b>. «Нет» в ключе: остальные пункты (1–58).</p>'+
  '<p><b>За каждое несовпадение с ключом начисляется 1 балл</b>. Общая сумма: 0–58. Процент: сумма / 58 × 100. Отдельно вычисляются восемь факторов. Одни пункты входят в несколько факторов, поэтому суммы факторов не складываются.</p>'+
  '<div class="psy-ph-scroll"><table><thead><tr><th>Фактор</th><th>Пункты</th><th>Макс.</th></tr></thead><tbody>'+
  SCALES.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.q.join(", ")+'</td><td>'+s.q.length+'</td></tr>').join("")+'</tbody></table></div>'+
  '<h3>Интерпретация</h3><p>'+esc(DATA.interpret)+'</p>'+
  '<p>Для строгой схемы «больше 50%» граница равна 30 из 58, «больше 75%» — 44 из 58. Ровно 50% не означает «больше 50%». На сайте показываются абсолютные значения и проценты, без автоматического клинического заключения.</p>'+
  '<div class="notice psy-ph-note">'+esc(NOTE)+'</div>'+
  '<p>Источники: <a target="_blank" rel="noopener noreferrer" href="'+SOURCE+'">публикация с полным текстом и ключом ↗</a> · <a target="_blank" rel="noopener noreferrer" href="'+SECOND+'">публикация для сопоставления варианта ↗</a>.</p>';
  return html;
 }
 function report(a,row){
  const n=count(a),z=row?.attendance==="absent"?null:score(DATA,a);
  let html='<section class="psy-ph-result"><div class="psy-ph-progress"><strong>Заполнено '+n+' из 58</strong><div class="psy-ph-track"><span style="width:'+(n/58*100)+'%"></span></div></div>';
  if(row?.attendance==="absent")return '<section class="psy-ph-result"><strong>Отсутствовал – результаты не рассчитываются</strong></section>';
  if(!z)return html+'<p>Для автоматического подсчета требуются ответы на все 58 вопросов. Пустые поля не засчитываются как «Нет».</p></section>';
  html+='<div class="psy-ph-overall"><span>Общий показатель: несовпадения с ключом</span><b>'+z.raw+' / 58</b><strong>'+fmt(z.percent)+'%</strong></div><h3>Восемь факторов школьной тревожности</h3><div class="psy-ph-factors">'+z.scales.map(s=>
   '<div class="psy-ph-factor"><div><span>'+esc(s.name)+'</span><b>'+s.raw+' / '+s.max+' · '+fmt(s.percent)+'%</b></div><div class="psy-ph-track"><span style="width:'+s.percent+'%"></span></div></div>').join("")+'</div>'+
   '<p class="psy-ph-small">Это показатель по опроснику, а не диагноз. Профиль оценивают в контексте беседы и наблюдений. Факторы имеют общие пункты; суммы факторов не складываются.</p></section>';
  return html;
 }
 function table(rows){
  const th=SCALES.map((s,i)=>'<th title="'+esc(s.name)+'">Ф'+(i+1)+'</th>').join("");
  const body=rows.map((r,i)=>{const z=r.attendance==="absent"?null:score(DATA,r.answers);return '<tr><td>'+esc(r.name||"У-"+String(i+1).padStart(2,"0"))+'</td><td>'+(r.attendance==="absent"?"Отсутствовал":z?z.raw+' / 58':'Заполнено '+count(r.answers)+'/58')+'</td><td>'+(z?fmt(z.percent)+'%':'—')+'</td>'+
   SCALES.map((s,k)=>'<td>'+(z?fmt(z.scales[k].percent)+'%':'—')+'</td>').join("")+'</tr>'}).join("");
  return '<div class="psy-ph-scroll"><table><thead><tr><th>Код</th><th>Общий балл</th><th>%</th>'+th+'</tr></thead><tbody>'+body+'</tbody></table></div>'+
  '<p class="psy-ph-small">Ф1–Ф8 — восемь факторов в том же порядке, что в разделе «Обработка». Для неполных форм числовые результаты не рассчитываются.</p>';
 }
 function calculator(d,ctx){
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0];
  const a=Array.isArray(r.answers)?r.answers:[];
  let html='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ученик</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Класс / группа</button></div>'+
   '<div class="notice psy-ph-note">Переносите ответы по полному опроснику из <a href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">этой версии</a>. Не вводите ФИО: используйте условный код.</div>';
  if(ctx.calcMode==="class"){
   html+='<div class="group-tools"><label>Ученик<select id="participantSelect">'+rows.map((x,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(x.name||"У-"+(i+1))+'</option>').join("")+'</select></label><label>Код ребенка<input id="participantName" maxlength="50" value="'+esc(r.name||"")+'" placeholder="У-01"></label><button class="btn" id="addParticipant">Добавить ученика</button></div>';
  }else html+='<label class="psy-ph-code">Код ученика<input id="phSingleCode" maxlength="50" value="'+esc(r.name||"")+'" placeholder="Например, У-01"></label>';
  html+='<h3>Ответы на 58 вопросов</h3><p>Расположение полностью соответствует номерам в источнике. Выберите «Да» или «Нет», оставьте пустым только при пропуске.</p>'+
   '<div class="psy-ph-grid">'+Array.from({length:58},(_,i)=>'<label class="psy-ph-item"><span>Вопрос <b>'+String(i+1).padStart(2,"0")+'</b></span><select data-ph-answer="'+i+'" aria-label="Вопрос '+(i+1)+'"><option value="">— не отмечено —</option><option value="yes" '+(a[i]==="yes"?"selected":"")+'>Да</option><option value="no" '+(a[i]==="no"?"selected":"")+'>Нет</option></select></label>').join("")+'</div>'+
   '<div id="phResults">'+report(a,r)+'</div>'+
   '<div class="psy-ph-actions"><button class="btn" id="phClear">Очистить ответы</button><button class="btn primary" id="phDownloadReport">Скачать индивидуальный протокол</button></div>';
  if(ctx.calcMode==="class")html+='<h3>Результаты класса</h3><div id="phClassResults">'+table(rows)+'</div><div class="psy-ph-actions"><button class="btn" id="phLegacyNext" hidden>Следующий ребенок</button><button class="btn primary" id="phDownloadCsv">Скачать таблицу Excel / CSV</button></div>';
  return html;
 }
 function save(filename,content,type){
  const url=URL.createObjectURL(new Blob([content],{type}));
  const a=document.createElement("a");a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }
 const csvCell=v=>{let s=String(v??"");if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 function csv(data){return "\uFEFF"+data.map(a=>a.map(csvCell).join(";")).join("\r\n")}
 function bind(d,ctx){
  const rows=ctx.rows||[],r=rows[ctx.rowIndex];if(!r)return;
  r.answers ||= [];
  const refresh=()=>{const x=document.getElementById("phResults");if(x)x.innerHTML=report(r.answers,r);
   const g=document.getElementById("phClassResults");if(g)g.innerHTML=table(rows);
  };
  document.getElementById("phSingleCode")?.addEventListener("input",e=>{r.name=e.target.value});
  document.querySelectorAll("[data-ph-answer]").forEach(el=>el.addEventListener("change",()=>{r.answers[Number(el.dataset.phAnswer)]=el.value;refresh();}));
  document.getElementById("phClear")?.addEventListener("click",()=>{
   if(!confirm("Удалить все 58 ответов для выбранного ученика?"))return;
   r.answers=[];document.querySelectorAll("[data-ph-answer]").forEach(el=>el.value="");refresh();
  });
  document.getElementById("phDownloadReport")?.addEventListener("click",()=>{
   const z=r.attendance==="absent"?null:score(d,r.answers);if(!z){alert("Для протокола нужны все 58 ответов присутствующего ученика.");return}
   const body='<h1>Тест школьной тревожности Филлипса</h1><p>Код ученика: '+esc(r.name||"Без персональных данных")+
   '<br>Дата формирования: '+new Date().toLocaleDateString("ru-RU")+'</p><p><b>Общий показатель:</b> '+z.raw+' из 58; '+fmt(z.percent)+'%.</p>'+
   '<table><thead><tr><th>Фактор</th><th>Несовпадений</th><th>Процент</th></tr></thead><tbody>'+
   z.scales.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.raw+' / '+s.max+'</td><td>'+fmt(s.percent)+'%</td></tr>').join("")+'</tbody></table>'+
   '<p class="small">'+esc(NOTE)+'</p><p class="small">'+esc(DATA.interpret)+'</p><p class="small">Источник: '+esc(SOURCE)+'</p>';
   save("Phillips_58_protocol.html",'<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Филлипс · протокол</title><style>@page{size:A4;margin:15mm}body{font:14px/1.55 Arial;color:#24382e;max-width:780px;margin:20px auto}h1{font-size:22px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #9cb5a5;padding:8px;text-align:left}.small{font-size:12px;color:#5f7265}</style></head><body>'+body+'</body></html>',"text/html;charset=utf-8");
  });
  document.getElementById("phDownloadCsv")?.addEventListener("click",()=>{
   const head=["Код","Статус","Заполнено из 58","Всего несовпадений","Всего, %",...SCALES.flatMap((s,i)=>["Ф"+(i+1)+": "+s.name+" (балл)","Ф"+(i+1)+": %"]),...Array.from({length:58},(_,i)=>"Ответ "+(i+1))];
   const out=[head];
   rows.forEach((x,i)=>{const absent=x.attendance==="absent",z=absent?null:score(d,x.answers);out.push([x.name||"У-"+(i+1),absent?"Отсутствовал":z?"Обработан":"Нет полного результата",absent?"":count(x.answers),z?.raw??"",z?fmt(z.percent):"",...SCALES.flatMap((s,k)=>z?[z.scales[k].raw,fmt(z.scales[k].percent)]:["",""]),...Array.from({length:58},(_,k)=>!absent&&valid(x.answers?.[k])?x.answers[k]==="yes"?"Да":"Нет":"")])});
   save("Phillips_school_anxiety_class.csv",csv(out),"text/csv;charset=utf-8");
  });
 }
 window.PSY_PHILLIPS={score,count,instruction,materials,processing,calculator,bind,report,table,key:KEY,scales:SCALES};
})();