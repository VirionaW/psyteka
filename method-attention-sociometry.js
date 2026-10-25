"use strict";
(function(){
 const D=window.PSY_FULL_METHODS;
 if(!D)return;
 const A="Корректурная проба Бурдона - Анфимова", S="Социометрическое исследование класса";
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const download=(filename,data,type)=>{
  const b=new Blob([data],{type}),u=URL.createObjectURL(b),a=document.createElement("a");
  a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);
 };
 const csv=rows=>"\uFEFF"+rows.map(r=>r.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(";")).join("\r\n");
 // Fixed, versioned stimulus generated once from a deterministic seed.
 // Not an original standardized Bourdon-Anfimov form; norms are not interchangeable.
 const alphabet="АВЕКМНОРСТХ";
 let seed=20261025;
 const grid=Array.from({length:30},()=>{
  let row="";
  for(let c=0;c<40;c++){seed=(Math.imul(1664525,seed)+1013904223)>>>0;row+=alphabet[seed%alphabet.length];}
  return row;
 });
 const all=grid.join(""),target="Е",capacity=all.length;
 const prefix=new Uint16Array(capacity+1);
 for(let i=0;i<capacity;i++)prefix[i+1]=prefix[i]+(all[i]===target?1:0);
 const WARN_A="Здесь используется собственный фиксированный буквенный бланк Психотеки (версия BA-1200-2026), а не стандартизированная авторская форма. Подсчет описательный; нельзя переносить возрастные нормы других бланков, времен и правил проведения.";
 const WARN_S="Это рабочая положительная социометрическая процедура по одному критерию, а не стандартизированная шкала. Выборы конфиденциальны; нельзя публично показывать индивидуальные показатели или называть детей отвергнутыми, популярными и т. п.";
 D[A]={
  author:"Б. Бурдон; Я. А. Анфимов - традиция корректурных проб. Стимульный бланк Психотеки",
  age:"Школьники, уверенно различающие печатные буквы; возрастные нормы для этой формы отсутствуют",
  kind:"Буквенная корректурная проба",
  count:"30 строк по 40 знаков (1200 символов); 3 минуты",
  goal:"Описательная оценка темпа зрительного поиска и точности выделения заданной буквы в условиях ограниченного времени.",
  instructions:"Просматривай буквы по строкам слева направо, сверху вниз. Зачеркивай только букву Е. Работай точно и по возможности быстро. Каждую минуту по команде психолога поставь вертикальную черту после последней просмотренной буквы; продолжай до команды «Стоп».",
  scoring:"Ввести N - число просмотренных знаков до последнего достигнутого символа (0-1200), P - пропущенные буквы Е в просмотренной части, F - ошибочно зачеркнутые другие буквы. Точное число предъявленных букв Е вычисляется по фиксированному ключу. Верно найдено = Е до N минус P; ошибок = P+F; скорость = N/3 знака в минуту. Пропуски и лишние отметки считаются раздельно.",
  interpret:"Показатели описывают выполнение этой конкретной задачи, а не уровень интеллекта, диагноз или нормативную категорию. Интерпретируйте вместе с наблюдением и условиями проведения.",
  warning:WARN_A,source:"https://psma.ru/index.php?cf_id=24&link_id=244&option=com_mtree&task=att_download",
  methodType:"attention",workflow:"fresh06",calculator:true,
  version:"BA-1200-2026",guideFile:"downloads/attention_bourdon_guide.docx",
  answerFile:"downloads/attention_bourdon_blank.html",
  indicators:["Количество просмотренных знаков","Верно найденные и пропущенные цели","Лишние зачеркивания","Темп просмотра"]
 };
 D[S]={
  author:"Я. Л. Морено - основатель социометрии; учебная рабочая процедура Психотеки",
  age:"Ориентировочно с 9 лет, когда дети понимают критерий выбора; применение определяется специалистом",
  kind:"Социометрическая процедура с положительным выбором",
  count:"Один критерий; до 3 положительных выборов",
  goal:"Исследование структуры предпочтений партнеров для совместной учебной деятельности в одном классе.",
  instructions:"Представь, что вы готовите совместный учебный проект. Запиши коды трех одноклассников, с которыми ты хотел(а) бы работать в одной команде. Не выбирай себя и не повторяй один и тот же код. Можно выбрать меньше трех человек или не отвечать.",
  scoring:"По полученным анкетам для каждого кода подсчитываются входящие положительные выборы; взаимной парой считается ситуация A выбрал B и B выбрал A. Рассчитывается число заполненных анкет и фактически поданных выборов. Индивидуальные пороги и статусы детей не присваиваются.",
  interpret:"Результаты служат конфиденциальному планированию работы с классом с учетом добровольности, присутствия и понятности критерия. Одна процедура не определяет устойчивых отношений или положения ребенка.",
  warning:WARN_S,source:"https://www.britannica.com/science/sociometry",
  methodType:"sociometry",workflow:"fresh06",calculator:true,
  version:"SOCIOMETRY-POSITIVE-3-2026",guideFile:"downloads/class_sociometry_guide.docx",
  answerFile:"downloads/class_sociometry_blank.html",
  indicators:["Число полученных положительных выборов","Взаимные пары","Охват анкетирования","Отсутствующие и неответившие"]
 };
 function attentionScore(answers){
  const a=Array.isArray(answers)?answers:[];
  if(a.length<3||a.slice(0,3).some(v=>v==null||String(v).trim()===""||!/^\d+$/.test(String(v))))return null;
  const [n,miss,falsePos]=a.slice(0,3).map(Number);
  if(!Number.isSafeInteger(n)||n>capacity||miss>prefix[n]||falsePos>n-prefix[n])return null;
  const goals=prefix[n],correct=goals-miss,errors=miss+falsePos;
  return {raw:n,max:capacity,caption:"Просмотрено знаков",targets:goals,correct,miss,falsePos,errors,
   pace:Number((n/3).toFixed(1)),accuracy:n?Number(((n-errors)/n*100).toFixed(1)):null};
 }
 function score(d,answers){return d.methodType==="attention"?attentionScore(answers):null;}
 function materialAttention(){
  return '<section class="psy-new-print"><h3>Бурдон - Анфимов · рабочий бланк BA-1200-2026</h3>'+
   '<p>Код ученика: __________ Класс: _______ Дата: __________ Время: 3 минуты</p>'+
   '<p><b>Задание:</b> зачеркивать только <b>Е</b>. Каждую минуту по сигналу отметить чертой место остановки.</p>'+
   '<div class="psy-new-letters">'+grid.map((line,i)=>'<div><small>'+(i+1<10?'0':'')+(i+1)+'</small><span>'+esc(line)+'</span></div>').join("")+'</div>'+
   '<p class="psy-new-micro">Бланк Психотеки, собственная буквенная последовательность. Нормы других редакций неприменимы. До печати установите масштаб 100% и бумагу А4.</p></section>';
 }
 function materialSocial(){
  return '<section class="psy-new-print"><h3>Социометрия · бланк ученика</h3>'+
  '<p>Код ученика: ____________ Класс: ________ Дата: __________</p>'+
  '<p>Представь, что вы готовите совместный учебный проект. С кем из одноклассников ты хотел(а) бы оказаться в одной команде? Впиши до трех кодов из списка, который дал психолог. Не выбирай себя и не повторяй коды.</p>'+
  '<div class="psy-new-soc-lines"><p>1. Код: __________________________</p><p>2. Код: __________________________</p><p>3. Код: __________________________</p></div>'+
  '<p>Можно выбрать одного, двух, трех человек или оставить ответы пустыми. Это не оценка твоих одноклассников.</p>'+
  '<p class="psy-new-micro">Заполненный лист видит только специалист. Не подписывайте его полным именем и не обсуждайте чужие ответы.</p></section>';
 }
 function materials(d){return d.methodType==="attention"?materialAttention():materialSocial();}
 function instruction(d){
  if(d.methodType==="attention")return '<h3>Инструкция для ученика</h3><blockquote class="kid-instruction">'+esc(d.instructions)+'</blockquote>'+
   '<h3>Проведение для психолога</h3><ol><li>Распечатайте один и тот же бланк BA-1200-2026 без изменения масштаба и состава букв.</li><li>Проведите краткую тренировку вне основного материала, убедитесь, что буква Е узнается.</li><li>Запустите 3 минуты; на отметках 60 и 120 секунд произнесите «Черта», не останавливая работу.</li><li>Через 180 секунд скажите «Стоп», отметьте последнюю достигнутую позицию.</li><li>Сосчитайте N, P и F в просмотренной части, перенесите в калькулятор. В протоколе зафиксируйте особенности поведения и соблюдение условий.</li></ol>'+
   '<p class="notice">'+esc(d.warning)+'</p>';
  return '<h3>Инструкция ученику</h3><blockquote class="kid-instruction">'+esc(d.instructions)+'</blockquote>'+
   '<h3>Проведение для психолога</h3><ol><li>Получите необходимые основания для проведения, объясните добровольность и конфиденциальность.</li><li>Выдайте каждому участнику уникальный нейтральный код и общий список кодов учеников класса; исключите отсутствующих, если это предусмотрено организацией процедуры.</li><li>Предъявите всем один и тот же положительный критерий о совместном учебном проекте.</li><li>Принимайте 0-3 уникальных выбора без давления; не проводите публичный сбор ответов.</li><li>Для расчета введите коды всех включенных учеников и строки ответов. Интерпретируйте только как снимок предпочтений по конкретному критерию.</li></ol>'+
   '<p class="notice">'+esc(d.warning)+'</p>';
 }
 function processing(d){
  if(d.methodType==="attention")return '<h3>Обработка буквенной пробы</h3><p>'+esc(d.scoring)+'</p>'+
   '<p>Ошибки включают пропущенные буквы Е и лишние зачеркивания. Дополнительно показана доля безошибочно обработанных знаков: 100 × (N - P - F) / N (авторский описательный показатель для этой формы; не клинический коэффициент).</p>'+
   '<p>Если ребенок не успел просмотреть весь бланк, буквы ниже точки остановки <b>не являются пропущенными целями</b>. При N=0 доля точности не рассчитывается.</p>'+
   '<p class="notice">'+esc(d.warning)+'</p>';
  return '<h3>Обработка социометрии</h3><p>'+esc(d.scoring)+'</p>'+
   '<p>Коды в списке класса уникальны. Каждая строка ответа: <b>код отвечающего; первый выбор; второй выбор; третий выбор</b>. Допускаются 0-3 выбора и незаполненные поля. Запрещены самовыбор, повторы и неизвестные коды.</p>'+
   '<p>Число входящих выборов = число других участников, которые указали данный код. Взаимная пара = два противоположных выбора между двумя кодами. Взаимная связь учитывается как пара один раз.</p>'+
   '<p class="notice">'+esc(d.warning)+'</p>';
 }
 function attentResult(d,a){
  const z=attentionScore(a);
  if(!z)return '<p class="psy-new-error">Введите три целых неотрицательных числа: N от 0 до '+capacity+', пропуски не больше количества буквы Е в просмотренной части, лишние зачеркивания не больше числа остальных букв. Пустые значения не равны нулю.</p>';
  return '<div class="psy-new-metrics"><span>Просмотрено <b>'+z.raw+' / '+capacity+'</b></span><span>Букв Е до отметки <b>'+z.targets+'</b></span><span>Правильно найдено <b>'+z.correct+'</b></span><span>Пропуски Е <b>'+z.miss+'</b></span><span>Лишние зачеркивания <b>'+z.falsePos+'</b></span><span>Всего ошибок <b>'+z.errors+'</b></span><span>Темп <b>'+z.pace+' зн./мин</b></span><span>Безошибочная доля <b>'+(z.accuracy===null?"не рассчитывается":z.accuracy+" %")+'</b></span></div>'+
  '<p class="privacy-inline">Это описательные показатели конкретной формы, без возрастной классификации.</p>';
 }
 function attentCalc(d,ctx){
  const r=ctx.rows[ctx.rowIndex];r.answers ||= [];
  const fields=[["Просмотрено знаков N (0-1200)","N","0"],["Пропущено букв Е, P","Пропуски","1"],["Лишних зачеркиваний, F","Ошибки","2"]];
  let h='<div class="psy-new-work"><div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ученик</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
  if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Участник<select id="participantSelect">'+ctx.rows.map((x,i)=>'<option value="'+i+'" '+(ctx.rowIndex===i?"selected":"")+'>'+esc(x.name||"Участник "+(i+1))+'</option>').join("")+'</select></label><label>Код ученика<input id="participantName" value="'+esc(r.name||"")+'" placeholder="№ 01"></label><button class="btn" id="addParticipant">Добавить</button></div>';
  h+='<p>Считайте ошибки только в просмотренной части листа. Не завершенные поля не получают автоматических нулей.</p><div class="psy-new-fields">'+fields.map(f=>'<label>'+f[0]+'<input type="number" inputmode="numeric" min="0" step="1" max="1200" data-psy-att="'+f[2]+'" value="'+esc(r.answers[Number(f[2])]??"")+'" placeholder="Введите число"></label>').join("")+'</div><div id="psyAttResult">'+attentResult(d,r.answers)+'</div>'+
    '<div class="class-actions"><button class="btn" id="resetParticipant">Очистить значения</button><button class="btn" id="psyAttSave">Скачать результат CSV</button></div>';
  if(ctx.calcMode==="class")h+='<div class="class-actions"><button class="btn" id="nextParticipant">Следующий участник</button><button class="btn" id="psyAttGroup">Скачать группу CSV</button></div><div class="results-table"><table><thead><tr><th>Код</th><th>N</th><th>Пропуски</th><th>Лишние</th><th>Ошибки</th><th>Зн./мин</th></tr></thead><tbody>'+ctx.rows.map((x,i)=>{const v=attentionScore(x.answers);return '<tr><td>'+esc(x.name||"№ "+(i+1))+'</td><td>'+(v?v.raw:"-")+'</td><td>'+(v?v.miss:"-")+'</td><td>'+(v?v.falsePos:"-")+'</td><td>'+(v?v.errors:"-")+'</td><td>'+(v?v.pace:"-")+'</td></tr>';}).join("")+'</tbody></table></div>';
  return h+'<p class="privacy-inline">Коды и результаты остаются в памяти вкладки. При скачивании CSV файл сохраняется на вашем устройстве.</p></div>';
 }
 // State is session-only. Never persisted to server, cookies or localStorage.
 const socio={members:"",entries:"",last:null};
 function parseSocial(){
  const members=socio.members.split(/[\n,;]+/).map(x=>x.trim()).filter(Boolean);
  const seen=new Set(members);
  if(members.length<4||members.length>50||seen.size!==members.length)return {error:"Введите от 4 до 50 разных кодов участников (по одному в строке)."};
  const lines=socio.entries.split(/\r?\n/).filter(x=>x.trim());
  const edges=new Map(),respondents=new Set(),errors=[];
  for(let n=0;n<lines.length;n++){
   const cells=lines[n].split(";").map(x=>x.trim());
   if(cells.length<1||cells.length>4){errors.push("Строка "+(n+1)+": допустимы код участника и максимум 3 выбора.");continue;}
   const person=cells.shift(),choices=cells.filter(Boolean);
   if(!seen.has(person)){errors.push("Строка "+(n+1)+": код отвечающего отсутствует в списке.");continue;}
   if(respondents.has(person)){errors.push("Строка "+(n+1)+": повторена анкета участника.");continue;}
   if(choices.some(x=>!seen.has(x))){errors.push("Строка "+(n+1)+": неизвестный код выбора.");continue;}
   if(choices.includes(person)){errors.push("Строка "+(n+1)+": выбор самого себя.");continue;}
   if(new Set(choices).size!==choices.length){errors.push("Строка "+(n+1)+": повторные выборы.");continue;}
   respondents.add(person);edges.set(person,new Set(choices));
  }
  if(errors.length)return {error:errors.slice(0,6).join(" ")};
  if(!respondents.size)return {error:"Введите хотя бы одну завершенную строку ответов."};
  const incoming=new Map(members.map(m=>[m,0])),mutual=new Map(members.map(m=>[m,0]));
  let choicesCount=0,pairs=0;
  for(const [person,choices] of edges)for(const pick of choices){incoming.set(pick,incoming.get(pick)+1);choicesCount++;}
  for(const [person,choices] of edges)for(const pick of choices){
   if(person<pick&&edges.get(pick)?.has(person)){pairs++;mutual.set(person,mutual.get(person)+1);mutual.set(pick,mutual.get(pick)+1);}
  }
  return {members,edges,respondents:respondents.size,choicesCount,pairs,incoming,mutual,
   rows:members.map(m=>[m,incoming.get(m),mutual.get(m),edges.has(m)?"Анкета получена":"Нет анкеты"])};
 }
 function socialResult(z){
  if(z.error)return '<p class="psy-new-error" role="alert">'+esc(z.error)+'</p>';
  return '<div class="psy-new-metrics"><span>Кодов в классе <b>'+z.members.length+'</b></span><span>Получено анкет <b>'+z.respondents+'</b></span><span>Всего положительных выборов <b>'+z.choicesCount+'</b></span><span>Взаимных пар <b>'+z.pairs+'</b></span></div>'+
  '<div class="results-table"><table><thead><tr><th>Код</th><th>Входящие выборы</th><th>Взаимные связи</th><th>Анкета</th></tr></thead><tbody>'+
  z.rows.map(r=>'<tr>'+r.map(x=>'<td>'+esc(x)+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>'+
  '<p class="privacy-inline">Не публикуйте таблицу детям или родителям. Нулевые входящие выборы нельзя автоматически интерпретировать как отвержение.</p>';
 }
 function socialCalc(){
  return '<div class="psy-new-work"><h3>Обработка класса по положительному критерию</h3>'+
   '<p>Используйте только коды. Вводите информацию локально, не на общей доске.</p>'+
   '<label class="psy-new-textarea">Список участников (один код в строке)<textarea rows="7" id="psySocMembers" placeholder="A01&#10;A02&#10;A03&#10;A04">'+esc(socio.members)+'</textarea></label>'+
   '<label class="psy-new-textarea">Анкеты (код отвечающего; выбор 1; выбор 2; выбор 3)<textarea rows="8" id="psySocEntries" placeholder="A01;A02;A03;A04&#10;A02;A01;A04;A03">'+esc(socio.entries)+'</textarea></label>'+
   '<div class="class-actions"><button class="btn primary" id="psySocCalculate">Рассчитать</button><button class="btn" id="psySocDownload">Скачать сводку CSV</button><button class="btn" id="psySocClear">Очистить</button></div>'+
   '<div id="psySocResult">'+(socio.last?socialResult(socio.last):'<p>Внесите состав класса и ответы, затем нажмите «Рассчитать».</p>')+'</div>'+
   '<p class="notice">'+esc(D[S].warning)+'</p></div>';
 }
 function calculator(d,ctx){return d.methodType==="attention"?attentCalc(d,ctx):socialCalc();}
 function bind(d,ctx){
  if(d.methodType==="attention"){
   const r=ctx.rows[ctx.rowIndex];r.answers ||= [];
   document.querySelectorAll("[data-psy-att]").forEach(el=>el.addEventListener("input",()=>{
    r.answers[Number(el.dataset.psyAtt)]=el.value;
    const out=document.getElementById("psyAttResult");if(out)out.innerHTML=attentResult(d,r.answers);
   }));
   document.getElementById("psyAttSave")?.addEventListener("click",()=>{
    const z=attentionScore(r.answers);
    if(!z){alert("Сначала введите корректные показатели.");return;}
    download("bourdon_result.csv",csv([["Код","Просмотрено N","Целевых букв","Верно","Пропуски","Лишние","Всего ошибок","Темп","Безошибочная доля %"],[r.name||"Участник",z.raw,z.targets,z.correct,z.miss,z.falsePos,z.errors,z.pace,z.accuracy??""]]),"text/csv;charset=utf-8");
   });
   document.getElementById("psyAttGroup")?.addEventListener("click",()=>{
    const rows=[["Код","N","Целей","Верно","Пропуски","Лишние","Ошибки","Темп, зн./мин","Безошибочная доля %","Статус"]];
    ctx.rows.forEach((x,i)=>{const z=attentionScore(x.answers);rows.push([x.name||"Участник "+(i+1),z?.raw??"",z?.targets??"",z?.correct??"",z?.miss??"",z?.falsePos??"",z?.errors??"",z?.pace??"",z?.accuracy??"",z?"Полный":"Не заполнено"]);});
    download("bourdon_group.csv",csv(rows),"text/csv;charset=utf-8");
   });
   return;
  }
  const m=document.getElementById("psySocMembers"),t=document.getElementById("psySocEntries");
  const sync=()=>{socio.members=m.value;socio.entries=t.value;socio.last=null;};
  m?.addEventListener("input",sync);t?.addEventListener("input",sync);
  document.getElementById("psySocCalculate")?.addEventListener("click",()=>{
   sync();socio.last=parseSocial();document.getElementById("psySocResult").innerHTML=socialResult(socio.last);
  });
  document.getElementById("psySocDownload")?.addEventListener("click",()=>{
   sync();const z=parseSocial();
   if(z.error){document.getElementById("psySocResult").innerHTML=socialResult(z);return;}
   socio.last=z;
   download("sociometry_summary.csv",csv([["Код","Входящие положительные выборы","Взаимные связи","Анкета"],...z.rows]),"text/csv;charset=utf-8");
  });
  document.getElementById("psySocClear")?.addEventListener("click",()=>{
   if(!confirm("Очистить все локальные сведения об опросе?"))return;
   socio.members="";socio.entries="";socio.last=null;m.value="";t.value="";document.getElementById("psySocResult").textContent="Сведения очищены.";
  });
 }
 window.PSY_NEW_METHODS={score,materials,instruction,processing,calculator,bind,
  getGrid:()=>grid.slice(),getTargetPrefix:n=>prefix[n]};
})();