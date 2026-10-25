"use strict";
(function(){
 const D=window.PSY_FULL_METHODS;if(!D)return;
 const S="Социометрическое исследование класса";
 const C="Классификация предметов (словесный вариант)";
 const E=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const dl=(filename,data,type)=>{
  const blob=new Blob([data],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 const csv=rows=>"\uFEFF"+rows.map(row=>row.map(cell=>{
  let val=String(cell??"");if(/^[\s]*[=+\-@]/.test(val))val="'"+val;
  return '"'+val.replace(/"/g,'""')+'"';
 }).join(";")).join("\r\n");
 const SG="Это конфиденциальная положительная социометрическая процедура по одному критерию, а не стандартизированная шкала. Не публикуйте индивидуальные показатели и не приписывайте детям статусы.";
 const CG="Это редакционный набор слов Психотеки, а не стандартная версия классической методики. Его результаты описательны; возрастные нормы и диагностические пороги не установлены.";
 D[S]={
  author:"Я. Л. Морено - методологическая традиция; рабочий бланк Психотеки",
  age:"Ориентировочно с 9 лет при понимании критерия выбора; решение специалиста",
  kind:"Групповая социометрическая процедура",
  count:"Один положительный критерий, 0-3 выбора",
  goal:"Исследование структуры предпочитаемых партнеров для учебного проекта в конкретном классе на момент проведения.",
  instructions:"Представь, что класс делает совместный учебный проект. Запиши коды до трех одноклассников, с которыми ты хотел(а) бы работать в одной команде. Не выбирай себя и не повторяй коды. Можно выбрать меньше трех или не отвечать.",
  scoring:"Подсчет входящих положительных выборов, взаимных пар, числа полученных анкет и фактически поданных выборов. Одна взаимная пара учитывается один раз.",
  interpret:"Результаты зависят от критерия, состава и текущей ситуации. Отсутствие выборов не следует приравнивать к отвержению. Использование сведений требует конфиденциальности.",
  warning:SG,source:"https://www.britannica.com/science/sociometry",workflow:"fresh06",methodType:"sociometry",calculator:true,
  version:"SOCIOMETRY-POSITIVE-3-2026",guideFile:"downloads/class_sociometry_guide.docx",
  answerFile:"downloads/class_sociometry_blank.html",
  indicators:["Входящие положительные выборы","Взаимные пары","Доля заполненных анкет","Число поданных выборов"],
  questions:[]
 };
 const categories=[{id:"fruit",label:"Фрукты"},{id:"animal",label:"Животные"},{id:"tool",label:"Инструменты"},{id:"vehicle",label:"Транспорт"},{id:"clothes",label:"Одежда"}];
 // Original mixed order, versioned: four items per expected group.
 const items=[
  ["Автобус","vehicle"],["Груша","fruit"],["Шапка","clothes"],["Лиса","animal"],["Пила","tool"],
  ["Платье","clothes"],["Самолет","vehicle"],["Яблоко","fruit"],["Волк","animal"],["Молоток","tool"],
  ["Корабль","vehicle"],["Слива","fruit"],["Рубашка","clothes"],["Медведь","animal"],["Топор","tool"],
  ["Апельсин","fruit"],["Поезд","vehicle"],["Заяц","animal"],["Пальто","clothes"],["Отвертка","tool"]
 ];
 D[C]={
  author:"Классическая традиция задач на обобщение и классификацию; авторский словесный стимульный набор Психотеки",
  age:"Ориентировочно 7-11 лет, с учетом словаря и учебных возможностей",
  kind:"Словесная диагностическая проба",
  count:"20 слов для распределения по 5 группам",
  goal:"Качественное наблюдение за выделением родовых признаков, называнием обобщающих понятий и объяснением оснований классификации.",
  instructions:"Перед тобой 20 слов. Раздели их на пять групп так, чтобы в каждой было по четыре слова. Напиши рядом с каждым словом номер своей группы, затем придумай названия групп и объясни, почему слова подходят друг к другу.",
  scoring:"Для каждого слова фиксируется самостоятельное соответствие ожидаемому родовому признаку, иной обоснованный вариант, выполнение с помощью, несоответствие или отсутствие ответа. Счет правильных совпадений 0-20 описывает только данную авторскую подборку.",
  interpret:"Не присваивайте уровень интеллектуального развития по сумме этой пробы. При ином обоснованном принципе группировки зафиксируйте дословное объяснение ребенка.",
  warning:CG,source:"https://psyjournals.ru/journals/psyedu/archive/2025_n4/Boryakova_Fedorov",workflow:"fresh06",methodType:"classification",calculator:true,
  version:"VERBAL-CLASS-20-2026",guideFile:"downloads/verbal_classification_guide.docx",
  answerFile:"downloads/verbal_classification_blank.html",
  indicators:["Верное родовое обобщение","Альтернативные основания классификации","Обращение за помощью","Полнота выполнения"],
  questions:[]
 };
 function socBlank(){
  return '<section class="psy-new-print"><h3>Социометрия · бланк ученика</h3>'+
   '<p>Код: ______________ Класс: __________ Дата: __________</p><p>'+E(D[S].instructions)+'</p>'+
   '<div class="psy-new-soc-lines"><p>Первый код: _______________________</p><p>Второй код: _______________________</p><p>Третий код: _______________________</p></div>'+
   '<p class="psy-new-micro">Ответы конфиденциальны. Не пишите фамилии и не показывайте выборы другим детям.</p></section>';
 }
 function classBlank(){
  return '<section class="psy-new-print"><h3>Классификация слов · бланк ученика</h3>'+
  '<p>Код ученика: ____________ Класс: _______ Дата: __________</p>'+
  '<p>'+E(D[C].instructions)+'</p>'+
  '<table class="psy-class-worksheet"><thead><tr><th>№</th><th>Слово</th><th>Номер группы</th></tr></thead><tbody>'+
  items.map(([word],i)=>'<tr><td>'+(i+1)+'</td><td>'+E(word)+'</td><td>_________</td></tr>').join("")+'</tbody></table>'+
  '<p><b>Названия пяти групп</b></p>'+
  [1,2,3,4,5].map(i=>'<p>Группа '+i+': __________________________________________________</p>').join("")+
  '<p>Объясни, почему ты объединил(а) эти слова: __________________________________________________</p>'+
  '<p>____________________________________________________________________________</p>'+
  '<p class="psy-new-micro">Материал Психотеки VERBAL-CLASS-20-2026, не стандартизированная версия.</p></section>';
 }
 function materials(d){return d.methodType==="sociometry"?socBlank():classBlank();}
 function instruction(d){
  if(d.methodType==="sociometry")return '<h3>Инструкция ученику</h3><blockquote class="kid-instruction">'+E(d.instructions)+'</blockquote>'+
   '<h3>Порядок для психолога</h3><ol><li>Обеспечьте необходимые основания, добровольность и конфиденциальность.</li><li>Присвойте нейтральные коды каждому участнику и выдайте доступный список кодов.</li><li>Один раз предъявите единый положительный критерий о совместном учебном проекте.</li><li>Разрешите 0-3 выбора. Собирайте ответы индивидуально и без обсуждения.</li><li>Внесите состав группы и анкеты в калькулятор; отдельно укажите неответивших и отсутствующих.</li></ol><p class="notice">'+E(d.warning)+'</p>';
  return '<h3>Инструкция ученику</h3><blockquote class="kid-instruction">'+E(d.instructions)+'</blockquote>'+
   '<h3>Проведение психологом</h3><ol><li>Проверьте, что все 20 слов понятны, но не предлагайте родовые категории.</li><li>Предъявите задание на листе без разделения слов по группам.</li><li>Попросите ребенка распределить слова на пять групп, назвать группы и объяснить принцип.</li><li>Записывайте дословно объяснения, ошибки, подсказки и исправления.</li><li>Не отвергайте альтернативный логичный способ группировки без обсуждения.</li></ol><p class="notice">'+E(d.warning)+'</p>';
 }
 function processing(d){
  if(d.methodType==="sociometry")return '<h3>Порядок подсчета</h3><p>'+E(d.scoring)+'</p>'+
   '<p>Для каждой строки вводите: код_ответившего; код_выбора1; код_выбора2; код_выбора3. Допускается меньше трех выборов. Не допускаются самовыбор и повтор кода. Отсутствующая анкета не интерпретируется как отрицательный выбор.</p>'+
   '<p class="notice">'+E(d.warning)+'</p>';
  return '<h3>Ключ и обработка</h3><p>'+E(d.scoring)+'</p>'+
   '<p><b>Ожидаемые родовые категории (для психолога):</b> '+categories.map(x=>E(x.label)).join("; ")+'. В каждой категории по четыре слова. Данный ключ проверяет только заданную редакционную группировку.</p>'+
   '<p>«Иной обоснованный вариант» и «С помощью» подсчитываются раздельно, не превращаются автоматически в ошибки. Пропущенные позиции не приравниваются к нулю при оценке полноты.</p>'+
   '<p class="notice">'+E(d.warning)+'</p>';
 }
 const socio={members:"",entries:"",last:null};
 function parseSocial(){
  const members=socio.members.split(/[\n,;]+/).map(x=>x.trim()).filter(Boolean);
  const set=new Set(members);
  if(members.length<4||members.length>50||set.size!==members.length)return {error:"Нужны от 4 до 50 разных кодов участников, по одному в строке."};
  const lines=socio.entries.split(/\r?\n/).filter(x=>x.trim()),respondents=new Set(),edges=new Map();
  const errors=[];
  lines.forEach((line,i)=>{
   const cells=line.split(";").map(x=>x.trim());
   if(cells.length<1||cells.length>4){errors.push("Строка "+(i+1)+": не более 3 выборов.");return;}
   const person=cells.shift(),choices=cells.filter(Boolean);
   if(!set.has(person)){errors.push("Строка "+(i+1)+": неизвестный отвечающий.");return;}
   if(respondents.has(person)){errors.push("Строка "+(i+1)+": повторная анкета.");return;}
   if(choices.some(x=>!set.has(x))){errors.push("Строка "+(i+1)+": неизвестный выбранный код.");return;}
   if(choices.includes(person)||new Set(choices).size!==choices.length){errors.push("Строка "+(i+1)+": самовыбор или повтор выбора.");return;}
   respondents.add(person);edges.set(person,new Set(choices));
  });
  if(errors.length)return {error:errors.slice(0,5).join(" ")};
  if(!respondents.size)return {error:"Введите хотя бы одну анкету."};
  const incoming=new Map(members.map(x=>[x,0])),mutual=new Map(members.map(x=>[x,0]));
  let count=0,pairs=0;
  for(const [person,picks] of edges)for(const pick of picks){count++;incoming.set(pick,incoming.get(pick)+1);}
  for(const [person,picks] of edges)for(const pick of picks)if(person<pick&&edges.get(pick)?.has(person)){
   pairs++;mutual.set(person,mutual.get(person)+1);mutual.set(pick,mutual.get(pick)+1);
  }
  return {members,respondents:respondents.size,count,pairs,
   rows:members.map(m=>[m,incoming.get(m),mutual.get(m),edges.has(m)?"Анкета получена":"Нет анкеты"])};
 }
 function socialResult(z){
  if(z.error)return '<p class="psy-new-error" role="alert">'+E(z.error)+'</p>';
  return '<div class="psy-new-metrics"><span>Участников <b>'+z.members.length+'</b></span><span>Анкет <b>'+z.respondents+'</b></span><span>Положительных выборов <b>'+z.count+'</b></span><span>Взаимных пар <b>'+z.pairs+'</b></span></div>'+
   '<div class="results-table"><table><thead><tr><th>Код</th><th>Входящие выборы</th><th>Взаимные связи</th><th>Анкета</th></tr></thead><tbody>'+
   z.rows.map(r=>'<tr>'+r.map(v=>'<td>'+E(v)+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>'+
   '<p class="privacy-inline">Таблица конфиденциальна. По одному критерию нельзя диагностировать статус ребенка.</p>';
 }
 function socialCalc(){
  return '<div class="psy-new-work"><h3>Обработка социометрии</h3>'+
   '<p>Используйте коды вместо имен. Данные хранятся только до закрытия вкладки.</p>'+
   '<label class="psy-new-textarea">Список участников (один код в строке)<textarea id="psySocMembers" rows="7" placeholder="А01&#10;А02&#10;А03&#10;А04">'+E(socio.members)+'</textarea></label>'+
   '<label class="psy-new-textarea">Анкеты (отвечающий;выбор1;выбор2;выбор3)<textarea id="psySocEntries" rows="8" placeholder="А01;А02;А03;А04&#10;А02;А01;А03;А04">'+E(socio.entries)+'</textarea></label>'+
   '<div class="class-actions"><button class="btn primary" id="psySocCalculate">Рассчитать</button><button class="btn" id="psySocDownload">Скачать CSV</button><button class="btn" id="psySocClear">Очистить</button></div>'+
   '<div id="psySocResult">'+(socio.last?socialResult(socio.last):'<p>Заполните список кодов и строки анкет, затем нажмите «Рассчитать».</p>')+'</div>'+
   '<p class="notice">'+E(D[S].warning)+'</p></div>';
 }
 const statuses=[["","Не оценено"],["alt","Иное обоснованное"],["help","С помощью"],["wrong","Не соответствует"]];
 function classifyScore(a){
  const values=items.map((_,i)=>String(a?.[i]??""));
  const valid=new Set([...categories.map(c=>c.id),"alt","help","wrong",""]);
  if(values.some(v=>!valid.has(v)))return null;
  const done=values.filter(Boolean).length,matched=values.filter((v,i)=>v===items[i][1]).length,
   alt=values.filter(v=>v==="alt").length,help=values.filter(v=>v==="help").length,
   wrong=values.filter((v,i)=>v==="wrong"||categories.some(c=>c.id===v)&&v!==items[i][1]).length;
  return {done,matched,alt,help,wrong,missing:items.length-done};
 }
 function score(d,a){return d.methodType==="classification"?classifyScore(a):null;}
 function classResult(a){
  const r=classifyScore(a);
  if(!r)return '<p class="psy-new-error">Ошибочные коды категории, проверьте входные данные.</p>';
  return '<div class="psy-new-metrics"><span>Рассмотрено слов <b>'+r.done+' / 20</b></span><span>Совпадения с ключом <b>'+r.matched+'</b></span><span>Иное обоснованное <b>'+r.alt+'</b></span><span>С помощью <b>'+r.help+'</b></span><span>Несоответствия <b>'+r.wrong+'</b></span><span>Без ответа <b>'+r.missing+'</b></span></div>'+
   '<p class="privacy-inline">Это только количественная сводка наблюдения на авторском наборе, не возрастной нормативный показатель.</p>';
 }
 function classCalc(d,ctx){
  const r=ctx.rows[ctx.rowIndex];r.answers ||= [];
  let html='<div class="psy-new-work"><div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ученик</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
  if(ctx.calcMode==="class")html+='<div class="group-tools"><label>Ученик<select id="participantSelect">'+ctx.rows.map((x,i)=>'<option value="'+i+'" '+(ctx.rowIndex===i?"selected":"")+'>'+E(x.name||"Участник "+(i+1))+'</option>').join("")+'</select></label><label>Код ученика<input id="participantName" value="'+E(r.name||"")+'" placeholder="№ 01"></label><button class="btn" id="addParticipant">Добавить</button></div>';
  html+='<p>Психолог отмечает соответствие каждого слова после обсуждения объяснений ребенка. Категории ниже являются ключом только этой рабочей версии.</p>'+
   '<div class="psy-class-list">'+items.map(([word,expected],i)=>{
    let opts='<option value="">- Не оценено -</option>';
    opts+=categories.map(c=>'<option value="'+c.id+'" '+(String(r.answers[i]??"")===c.id?"selected":"")+'>'+E(c.label)+'</option>').join("");
    opts+=statuses.slice(1).map(([v,label])=>'<option value="'+v+'" '+(String(r.answers[i]??"")===v?"selected":"")+'>'+E(label)+'</option>').join("");
    return '<label class="psy-class-item"><span><b>'+(i+1)+'.</b> '+E(word)+' <small>ожид.: '+E(categories.find(c=>c.id===expected).label)+'</small></span><select data-psy-class="'+i+'" aria-label="Слово '+(i+1)+'">'+opts+'</select></label>';
   }).join("")+'</div><div id="psyClassResult">'+classResult(r.answers)+'</div>'+
   '<div class="class-actions"><button class="btn" id="resetParticipant">Очистить ответы</button><button class="btn" id="psyClassSave">Скачать индивидуальный CSV</button></div>';
  if(ctx.calcMode==="class")html+='<div class="class-actions"><button class="btn" id="nextParticipant">Следующий участник</button><button class="btn" id="psyClassGroup">Скачать группу CSV</button></div>'+
   '<div class="results-table"><table><thead><tr><th>Код</th><th>Рассмотрено</th><th>Совпадения</th><th>Альтернативы</th><th>С помощью</th></tr></thead><tbody>'+
   ctx.rows.map((x,i)=>{const z=classifyScore(x.answers);return '<tr><td>'+E(x.name||"№ "+(i+1))+'</td><td>'+(z?.done??"-")+'</td><td>'+(z?.matched??"-")+'</td><td>'+(z?.alt??"-")+'</td><td>'+(z?.help??"-")+'</td></tr>';}).join("")+'</tbody></table></div>';
  return html+'<p class="notice">'+E(d.warning)+'</p></div>';
 }
 function calculator(d,ctx){return d.methodType==="sociometry"?socialCalc():classCalc(d,ctx);}
 function bind(d,ctx){
  if(d.methodType==="classification"){
   const row=ctx.rows[ctx.rowIndex];row.answers ||= [];
   document.querySelectorAll("[data-psy-class]").forEach(el=>el.addEventListener("change",()=>{
    row.answers[Number(el.dataset.psyClass)]=el.value;
    const target=document.getElementById("psyClassResult");if(target)target.innerHTML=classResult(row.answers);
   }));
   document.getElementById("psyClassSave")?.addEventListener("click",()=>{
    const z=classifyScore(row.answers);
    dl("verbal_classification_result.csv",csv([["Код",...items.map((x,i)=>(i+1)+". "+x[0]),"Рассмотрено","Совпадения","Иное обоснованное","С помощью","Не соответствует","Нет ответа"],[row.name||"Ученик",...items.map((_,i)=>row.answers[i]||""),z.done,z.matched,z.alt,z.help,z.wrong,z.missing]]),"text/csv;charset=utf-8");
   });
   document.getElementById("psyClassGroup")?.addEventListener("click",()=>{
    const rows=[["Код","Рассмотрено","Совпадения","Иное обоснованное","С помощью","Несоответствия","Без ответа"]];
    ctx.rows.forEach((x,i)=>{const z=classifyScore(x.answers);rows.push([x.name||"№ "+(i+1),z.done,z.matched,z.alt,z.help,z.wrong,z.missing]);});
    dl("verbal_classification_group.csv",csv(rows),"text/csv;charset=utf-8");
   });
   return;
  }
  const m=document.getElementById("psySocMembers"),t=document.getElementById("psySocEntries");
  const sync=()=>{socio.members=m.value;socio.entries=t.value;socio.last=null;};
  m.addEventListener("input",sync);t.addEventListener("input",sync);
  document.getElementById("psySocCalculate")?.addEventListener("click",()=>{
   sync();socio.last=parseSocial();document.getElementById("psySocResult").innerHTML=socialResult(socio.last);
  });
  document.getElementById("psySocDownload")?.addEventListener("click",()=>{
   sync();const z=parseSocial();socio.last=z;
   if(z.error){document.getElementById("psySocResult").innerHTML=socialResult(z);return;}
   dl("sociometry_summary.csv",csv([["Код","Входящие положительные выборы","Взаимные связи","Анкета"],...z.rows]),"text/csv;charset=utf-8");
  });
  document.getElementById("psySocClear")?.addEventListener("click",()=>{
   if(!confirm("Очистить ответы и список участников?"))return;
   socio.members="";socio.entries="";socio.last=null;m.value="";t.value="";document.getElementById("psySocResult").textContent="Сведения очищены.";
  });
 }
 window.PSY_NEW_METHODS={score,materials,instruction,processing,calculator,bind};
})();