"use strict";
/* ПМПК – два самостоятельных профессиональных рабочих комплекта для 7-11 лет.
   Авторская серия, не стандартизированная батарея. Данные только в памяти страницы. */
(function(){
 const METHODS={
  thinking:{
   title:"Исключение лишнего и простая аналогия",
   code:"pmpk-thinking-7-11",task:0,kind:"Словесно-логическая диагностическая проба",
   goal:"Качественное наблюдение операций обобщения, классификации и установления простых смысловых отношений.",
   duration:"Ориентировочно 6-8 минут",
   instruction:"Я прочитаю несколько заданий. Сначала нужно найти слово, которое не подходит к остальным, и объяснить свой выбор. Потом мы закончим пары слов. Если трудно, скажи мне об этом.",
   procedure:[
    "Установить контакт и убедиться, что ребенок понимает устную инструкцию. Допустимо заменить устное предъявление крупным шрифтом с фиксацией изменения условий.",
    "Провести одно тренировочное обсуждение принципа исключения по отдельному примеру, не раскрывая ответы основной серии.",
    "Предъявить последовательно четыре ряда на исключение и четыре словесные аналогии. Регистрировать дословный ответ, объяснение, самостоятельность и помощь.",
    "Если ребенок затрудняется, сначала повторить инструкцию, затем дать нейтральный вопрос об основании выбора. Записать каждую подсказку.",
    "Не оценивать нестандартный, но логично обоснованный ответ автоматически как ошибку. Завершить при выраженном утомлении."
   ],
   items:[
    {group:"Исключение лишнего",prompt:"Липа, дуб, береза, ложка",key:"ложка",basis:"Три дерева и предмет посуды."},
    {group:"Исключение лишнего",prompt:"Поезд, автобус, трамвай, груша",key:"груша",basis:"Три вида транспорта и плод."},
    {group:"Исключение лишнего",prompt:"Стол, шкаф, стул, снег",key:"снег",basis:"Три предмета мебели и явление природы."},
    {group:"Исключение лишнего",prompt:"Воробей, синица, голубь, лейка",key:"лейка",basis:"Три птицы и предмет."},
    {group:"Простая аналогия",prompt:"Собака – щенок; кошка – ?",key:"котенок",basis:"Взрослое животное и его детеныш."},
    {group:"Простая аналогия",prompt:"Книга – читать; музыку – ?",key:"слушать",basis:"Предмет или явление и действие."},
    {group:"Простая аналогия",prompt:"Ножницы – резать; карандаш – ?",key:"писать / рисовать",basis:"Инструмент и его обычное применение."},
    {group:"Простая аналогия",prompt:"Высокий – низкий; широкий – ?",key:"узкий",basis:"Смысловая противоположность."}
   ]
  },
  memory:{
   title:"Запоминание шести слов",
   code:"pmpk-memory-7-11",task:1,kind:"Рабочая проба слухоречевого запоминания",
   goal:"Качественное описание первичного запоминания, динамики воспроизведения, привнесений и отсроченного удержания.",
   duration:"Начальные предъявления 4-6 минут; отсроченная проба – в конце обследования",
   instruction:"Сейчас я назову несколько слов. Слушай внимательно. Когда закончу, назови все слова, которые запомнишь, в любом порядке. Если не помнишь, можно так и сказать.",
   procedure:[
    "Проводить индивидуально, без показа списка ребенку. Не смешивать эту авторскую серию с протоколом «10 слов» А.Р. Лурии.",
    "Назвать шесть слов ровным темпом с паузой около секунды. После окончания предложить свободное воспроизведение. Слова не подсказывать.",
    "При необходимости повторить тот же список второй и третий раз, обязательно фиксируя число проведенных предъявлений и ответы отдельно.",
    "Ближе к окончанию обследования, после других заданий, по возможности попросить назвать ранее предъявленные слова без повторного чтения. Записать фактическую длительность паузы.",
    "Отметить порядок ответов, повторы, привнесенные слова, самокоррекцию, обращения за помощью, утомляемость. Не использовать опубликованные нормы других наборов слов."
   ],
   words:["лампа","сад","вода","ключ","чашка","дерево"]
  }
 };
 const ROUNDS=[["first","1-е предъявление"],["second","2-е предъявление"],["third","3-е предъявление"],["delayed","Отсроченное воспроизведение"]];
 const HELP=["Без помощи","Повторение инструкции","Словесная подсказка","Показ образца","Пошаговая помощь","Помощь не принята"];
 const RESULTS=["Самостоятельно","С помощью","Не выполнил"];
 const ESC=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const store={};let current=null,tab="portfolio",overlay=null,previousFocus=null;
 function fresh(kind){return {code:"",date:new Date().toISOString().slice(0,10),help:"",notes:"",answers:Array(8).fill(""),literal:Array(8).fill(""),rounds:{first:"done",second:"",third:"",delayed:""},rows:{first:Array(6).fill(""),second:Array(6).fill(""),third:Array(6).fill(""),delayed:Array(6).fill("")},delay:"",intrusions:""}}
 function state(){return store[current.code]||(store[current.code]=fresh(current.code))}
 function complete(){
  const d=state();
  if(!d.help||!d.notes.trim())return false;
  if(current.code===METHODS.thinking.code)return d.answers.every(x=>RESULTS.includes(x))&&!(d.answers.includes("С помощью")&&d.help==="Без помощи");
  return ROUNDS.every(([k],i)=>{
   const mode=d.rounds[k];
   if(i===0&&mode!=="done")return false;
   if(i>0&&mode!=="done"&&mode!=="skip")return false;
   if(mode==="done"&&!d.rows[k].every(x=>x==="yes"||x==="no"))return false;
   if(k==="delayed"&&mode==="done"&&!(d.delay.trim()!==""&&Number.isFinite(Number(d.delay))&&Number(d.delay)>0&&Number(d.delay)<=240))return false;
   return true;
  });
 }
 function count(){return current.code===METHODS.thinking.code?state().answers.filter(x=>x!=="").length:
  ROUNDS.reduce((a,[k])=>a+(state().rounds[k]==="skip"?6:state().rounds[k]==="done"?state().rows[k].filter(Boolean).length:0),0)}
 function outer(){
  const ready=complete(),d=state();
  return '<div class="pmpk-method-shell" role="dialog" aria-modal="true" aria-labelledby="pmpkMethodTitle"><div class="pmpk-method-header"><div><p class="pmpk-method-overline">ПМПК · '+ESC(current.kind)+' · 7-11 лет</p><h2 id="pmpkMethodTitle">'+ESC(current.title)+'</h2></div><button type="button" class="pmpk-method-close" data-m-action="close" aria-label="Закрыть">×</button></div>'+
  '<div class="pmpk-method-tabs" role="tablist" aria-label="Разделы методики">'+
  [["portfolio","Портфолио"],["guide","Методика / руководство"],["blank","Бланк"]].map(([id,title])=>'<button type="button" role="tab" data-m-tab="'+id+'" aria-selected="'+(tab===id)+'">'+title+'</button>').join("")+'</div>'+
  '<div class="pmpk-method-content">'+(tab==="portfolio"?portfolio():tab==="guide"?guide():tab==="blank"?blank():processing())+'</div>'+
  '<div class="pmpk-method-footer">'+(tab==="processing"?
  '<button type="button" class="pmpk-mini" data-m-action="back">К портфолио</button><div class="pmpk-method-right"><span class="pmpk-status '+(ready?"is-done":"")+'" data-m-progress>'+(ready?"Заполнено":"Не заполнено")+'</span><button type="button" class="pmpk-mini" data-m-action="print-report" '+(!ready?"disabled":"")+'>Распечатать отчет</button><button type="button" class="pmpk-action primary" data-m-action="word-report" '+(!ready?"disabled":"")+'>Скачать отчет Word</button><button type="button" class="pmpk-action primary" data-m-action="transfer" '+(!ready?"disabled":"")+'>В общий протокол</button><button type="button" class="pmpk-action danger" data-m-action="reset">Очистить ответы</button></div>':
  '<span class="pmpk-status '+(ready?"is-done":"")+'" data-m-progress>'+(ready?"Обработка заполнена":"Обработка не заполнена")+'</span><button type="button" class="pmpk-action primary pmpk-method-processing" data-m-action="process">Обработка результатов</button>')+'</div></div>';
 }
 function portfolio(){
  return '<div class="pmpk-method-box"><h3>Общие сведения</h3><div class="pmpk-method-facts">'+
   [["Методика",current.title],["Автор / версия","Психотека · авторская рабочая серия, 2026"],["Возраст","7-11 лет"],["Вид",current.kind],["Задания",current.code===METHODS.thinking.code?"8 заданий: 4 исключения, 4 аналогии":"6 слов, до 3 предъявлений и необязательная отсрочка"],["Время",current.duration]].map(([k,v])=>'<div><small>'+ESC(k)+'</small><strong>'+ESC(v)+'</strong></div>').join("")+'</div></div>'+
   '<div class="pmpk-method-box"><h3>Цель методики</h3><p>'+ESC(current.goal)+'</p></div>'+
   '<div class="pmpk-method-box"><h3>Показатели</h3><p>'+(current.code===METHODS.thinking.code?
    "Характер обобщений, смысловое объяснение выбора, установление отношений, самостоятельность, виды помощи и самокоррекция.":
    "Воспроизведение по предъявлениям, привнесения, повторы, динамика без нормативного сравнения, фактическая длительность отсрочки.")+'</p></div>'+
   '<div class="pmpk-method-box"><h3>Методические основания и ограничения</h3><p>Содержание заданий разработано Психотекой для качественного обследования. Это не стандартизированный тест: возрастные нормы, шкалы IQ и диагнозы по результату не предусмотрены. Не переносите нормы других методик на эту серию.</p><p>Общие направления обследования описаны в методических рекомендациях Минобрнауки России от 23.05.2016 № ВК-1074/07. Это не первоисточник конкретной авторской серии.</p></div>';
 }
 function guide(){
  const guideText='<div class="pmpk-method-box"><div class="pmpk-toolbar"><h3>Методика и руководство</h3><div class="pmpk-actions"><button type="button" class="pmpk-mini" data-m-action="print-guide">Без бланка</button><button type="button" class="pmpk-action primary" data-m-action="print-guide-blank">С бланком</button></div></div>'+
   '<h4>Условия и материалы</h4><p>Тихое помещение, понятная инструкция, протокол специалиста. Если условия предъявления изменены, это отмечается. '+ESC(current.duration)+'.</p>'+
   '<h4>Инструкция ребенку</h4><blockquote>'+ESC(current.instruction)+'</blockquote>'+
   '<h4>Порядок проведения</h4><ol>'+current.procedure.map(x=>'<li>'+ESC(x)+'</li>').join("")+'</ol>'+
   '<h4>Регистрация и обработка</h4><p>'+(current.code===METHODS.thinking.code?
   'Зарегистрировать выполнение каждого из 8 заданий: самостоятельно, с помощью или не выполнено; записать дословные ответы и помощь. Можно подсчитать частоту наблюдаемых вариантов без диагностического порога.':
   'Зарегистрировать каждое воспроизведенное слово отдельно для каждого проведенного предъявления. Если слово не вспомнили, выбрать «Не воспроизведено»; пустое значение означает отсутствие регистрации. Отсроченное воспроизведение только при фактическом проведении.')+'</p>'+
   '<h4>Ограничения</h4><p>Результат описательный и зависит от языка, условий проведения, состояния ребенка и используемой помощи. Не вычислять нормативный уровень.</p></div>';
  if(current.code!==METHODS.thinking.code)return guideText;
  return guideText+'<div class="pmpk-method-box"><h3>Ключ и ориентиры качественной проверки</h3><p>Ожидаемый ответ не отменяет смыслового анализа обоснования. Аргументированное другое решение записывается отдельно.</p><table class="pmpk-method-table"><thead><tr><th>№</th><th>Ожидаемый ответ</th><th>Основание</th></tr></thead><tbody>'+
   current.items.map((x,i)=>'<tr><td>'+(i+1)+'</td><td>'+ESC(x.key)+'</td><td>'+ESC(x.basis)+'</td></tr>').join("")+'</tbody></table></div>';
 }
 function expertBlank(){
  if(current.code===METHODS.thinking.code){
   return '<p>Задания зачитывает специалист. Тренировочный ряд: стол, стул, шкаф, яблоко. Тренировочные ответы в итог не входят.</p><table class="pmpk-method-table"><thead><tr><th>№</th><th>Задание для предъявления</th><th>Ответ и объяснение ребенка</th><th>Помощь</th></tr></thead><tbody>'+
   current.items.map((x,i)=>'<tr><td>'+(i+1)+'</td><td>'+ESC(x.prompt)+'</td><td class="pmpk-blank-writing"></td><td class="pmpk-blank-writing"></td></tr>').join("")+'</tbody></table>';
  }
  return '<p>Шесть слов специалист произносит по порядку: <strong>'+current.words.map(ESC).join(" · ")+'</strong>. Ребенку протокол не выдавать.</p><table class="pmpk-method-table"><thead><tr><th>Слово</th>'+ROUNDS.map(([k,l])=>'<th>'+ESC(l)+'</th>').join("")+'</tr></thead><tbody>'+
  current.words.map(w=>'<tr><th>'+ESC(w)+'</th>'+ROUNDS.map(()=>'<td class="pmpk-blank-writing"></td>').join("")+'</tr>').join("")+
  '</tbody></table><p>Фактическая отсрочка: __________ мин.</p><p>Привнесения, повторы: __________________________________________________</p>';
 }
 function blank(){
  return '<div class="pmpk-method-box"><div class="pmpk-toolbar"><div><h3>Протокол специалиста</h3><p class="pmpk-note">Заполняется психологом. Не выдавать ребенку. Ключ и диагностические выводы в рабочем листе отсутствуют.</p></div><div class="pmpk-actions"><button type="button" class="pmpk-action primary" data-m-action="print-blank">Посмотреть и распечатать</button><button type="button" class="pmpk-mini" data-m-action="word-blank">Скачать Word</button></div></div>'+
  '<div class="pmpk-method-line"><span>Код / имя __________________________</span><span>Дата _______________</span></div>'+expertBlank()+
  '<p>Общее наблюдение, утомление, характер помощи: ________________________________________</p></div>';
 }
 function processing(){
  const d=state();
  const intro='<div class="pmpk-method-box"><h3>Обработка результатов</h3><p class="pmpk-note">Данные остаются только в открытой странице. Пустой ответ не считается ошибкой или нулем. Для отчета необходимы записи всех проведенных заданий и заключение психолога.</p>'+
   '<div class="pmpk-method-fields"><label>Имя или код обследуемого (по желанию)<input data-m-field="code" autocomplete="off" value="'+ESC(d.code)+'"></label><label>Дата обследования<input type="date" data-m-field="date" value="'+ESC(d.date)+'"></label></div></div>';
  let rows="";
  if(current.code===METHODS.thinking.code){
   rows='<div class="pmpk-method-box"><h3>Результаты 8 заданий</h3><div class="pmpk-method-grid">'+current.items.map((x,i)=>'<div class="pmpk-method-answer"><p><strong>'+(i+1)+'. '+ESC(x.group)+'</strong></p><p>'+ESC(x.prompt)+'</p><label>Результат *<select data-m-thinking="'+i+'"><option value="">Выберите</option>'+RESULTS.map(a=>'<option '+(d.answers[i]===a?"selected":"")+'>'+a+'</option>').join("")+'</select></label><label>Фактический ответ, объяснение<input data-m-literal="'+i+'" value="'+ESC(d.literal[i])+'" placeholder="Запишите ответ ребенка"></label></div>').join("")+'</div></div>';
  }else{
   rows='<div class="pmpk-method-box"><h3>Воспроизведение шести слов</h3><p class="pmpk-note">«Не проводилось» выбирается сознательно; отсутствие ответа остается незаполненным. Первое предъявление обязательно.</p>'+
   ROUNDS.map(([k,title],index)=>{
    const mode=d.rounds[k];
    return '<section class="pmpk-method-round"><div class="pmpk-method-round-head"><h4>'+ESC(title)+'</h4>'+(index===0?'<span>Обязательное</span>':'<label>Проведение <select data-m-round="'+k+'"><option value="">Выберите</option><option value="done" '+(mode==="done"?"selected":"")+'>Проводилось</option><option value="skip" '+(mode==="skip"?"selected":"")+'>Не проводилось</option></select></label>')+'</div>'+
    (mode==="done"?'<div class="pmpk-method-grid">'+current.words.map((word,i)=>'<label class="pmpk-method-answer">'+ESC(word)+'<select data-m-word="'+k+':'+i+'"><option value="">Выберите</option><option value="yes" '+(d.rows[k][i]==="yes"?"selected":"")+'>Воспроизведено</option><option value="no" '+(d.rows[k][i]==="no"?"selected":"")+'>Не воспроизведено</option></select></label>').join("")+'</div>':'')+
    (k==="delayed"&&mode==="done"?'<label class="pmpk-method-delay">Фактическая отсрочка в минутах *<input type="number" min="0.1" max="240" step="0.1" data-m-field="delay" value="'+ESC(d.delay)+'"></label>':'')+
    (mode==="done"&&d.rows[k].every(x=>x==="yes"||x==="no")?'<p class="pmpk-note">Воспроизведено '+d.rows[k].filter(x=>x==="yes").length+' из 6 слов (без нормативной оценки).</p>':'')+'</section>';
   }).join("")+
   '<label class="pmpk-method-blockfield">Привнесения и повторы<textarea rows="2" data-m-field="intrusions">'+ESC(d.intrusions)+'</textarea></label></div>';
  }
  return intro+rows+'<div class="pmpk-method-box"><div class="pmpk-method-fields"><label>Помощь при проведении *<select data-m-field="help"><option value="">Выберите</option>'+HELP.map(x=>'<option '+(d.help===x?"selected":"")+'>'+x+'</option>').join("")+'</select></label></div>'+
   '<label class="pmpk-method-blockfield">Качественное наблюдение и заключение специалиста *<textarea data-m-field="notes" rows="4" placeholder="Запишите реальные наблюдения, ошибки, самокоррекцию, влияние помощи">'+ESC(d.notes)+'</textarea></label><p class="pmpk-note">Автоматический диагноз или возрастной уровень не формируется.</p></div>';
 }
 function draw(keepScroll){
  if(!overlay)return;
  const scroll=overlay.querySelector(".pmpk-method-content"),old=keepScroll&&scroll?scroll.scrollTop:0;
  overlay.innerHTML=outer();
  const newScroll=overlay.querySelector(".pmpk-method-content");if(newScroll)newScroll.scrollTop=old;
 }
 function indicators(){
  if(!overlay)return;
  const done=complete();
  overlay.querySelectorAll("[data-m-progress]").forEach(x=>{x.textContent=done?(tab==="processing"?"Заполнено":"Обработка заполнена"):(tab==="processing"?"Заполнено "+count()+"; требуется полный протокол":"Обработка не заполнена");x.classList.toggle("is-done",done)});
  overlay.querySelectorAll('[data-m-action="print-report"],[data-m-action="word-report"],[data-m-action="transfer"]').forEach(x=>x.disabled=!done);
 }
 function close(){
  if(!overlay)return;
  overlay.remove();overlay=null;current=null;document.body.classList.remove("pmpk-method-open");
  document.removeEventListener("keydown",keyListener);
  if(previousFocus&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});
 }
 function keyListener(e){
  if(!overlay)return;
  if(e.key==="Escape"){e.preventDefault();close();return}
  if(e.key==="Tab"){const els=[...overlay.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]')].filter(x=>x.getClientRects().length);if(!els.length)return;const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
 }
 function open(id){
  if(!METHODS[id]&&id!=="thinking"&&id!=="memory")return;
  if(overlay)close();
  current=METHODS[id];if(!current)return;
  tab="portfolio";previousFocus=document.activeElement;
  overlay=document.createElement("div");overlay.className="pmpk-method-overlay";overlay.setAttribute("role","presentation");
  document.body.appendChild(overlay);document.body.classList.add("pmpk-method-open");
  draw(false);document.addEventListener("keydown",keyListener);
  const b=overlay.querySelector('[data-m-action="close"]');if(b)b.focus({preventScroll:true});
 }
 function recordLines(){
  const d=state();
  const lines=[current.title,"Возраст: 7-11 лет","Имя / код: "+(d.code||"не указан"),"Дата: "+(d.date||"не указана"),"Рабочая серия Психотеки – без нормативных возрастных уровней",""];
  if(current.code===METHODS.thinking.code)current.items.forEach((item,i)=>{
   lines.push((i+1)+". "+item.prompt);lines.push("Регистрация: "+(d.answers[i]||"не заполнено")+". Ответ: "+(d.literal[i]||"не записан"));
  });
  else ROUNDS.forEach(([k,title])=>{
   lines.push(title+": "+(d.rounds[k]==="skip"?"не проводилось":d.rounds[k]==="done"?current.words.filter((w,i)=>d.rows[k][i]==="yes").join(", "):"не заполнено"));
   if(d.rounds[k]==="done")lines.push("Количество воспроизведенных слов: "+d.rows[k].filter(x=>x==="yes").length+" из 6");
   if(k==="delayed"&&d.rounds[k]==="done")lines.push("Фактическая задержка: "+d.delay+" мин");
  });
  if(current.code===METHODS.memory.code)lines.push("Привнесения, повторы: "+(d.intrusions||"не отмечены"));
  lines.push("Помощь: "+(d.help||"не указана"),"Качественное описание: "+(d.notes||"не заполнено"),"Диагностические уровни и клинический диагноз не рассчитываются.");
  return lines;
 }
 function guideHTML(){
  const key=current.code===METHODS.thinking.code?'<h2>Ориентиры качественной проверки</h2><table><thead><tr><th>№</th><th>Ожидаемый ответ</th><th>Обоснование</th></tr></thead><tbody>'+current.items.map((x,i)=>'<tr><td>'+(i+1)+'</td><td>'+ESC(x.key)+'</td><td>'+ESC(x.basis)+'</td></tr>').join("")+'</tbody></table>':'';
  return '<h1>'+ESC(current.title)+'</h1><p>Психотека · Рабочая диагностическая проба, 7-11 лет. Время: '+ESC(current.duration)+'.</p><h2>Цель</h2><p>'+ESC(current.goal)+'</p><h2>Условия проведения</h2><p>Индивидуально, в спокойной обстановке. Ответы регистрирует специалист; фиксировать помощь, утомление и изменения инструкции.</p><h2>Инструкция ребенку</h2><p>'+ESC(current.instruction)+'</p><h2>Порядок проведения</h2><ol>'+current.procedure.map(x=>'<li>'+ESC(x)+'</li>').join("")+'</ol><h2>Обработка</h2><p>Фиксировать выполнение и фактические ответы, не приравнивать отсутствие регистрации к ошибке и не применять нормы других тестов.</p>'+key+'<h2>Ограничения</h2><p>Нестандартизированная авторская рабочая серия; количественные нормативы и диагнозы не предусмотрены.</p>';
 }
 function blankHTML(){
  return '<h1>Протокол специалиста</h1><p>'+ESC(current.title)+' · 7-11 лет. Бланк не выдается ребенку.</p><p>Имя / код: ______________________ Дата: ____________</p>'+expertBlank()+'<p>Наблюдения: ___________________________________________________________________</p><p>Вид помощи: _____________________</p>';
 }
 function printDocument(type){
  if(type==="report"&&!complete())return;
  const body=type==="guide"?guideHTML():type==="guide-blank"?guideHTML()+'<div class="page-break"></div>'+blankHTML():type==="blank"?blankHTML():'<h1>Отчет обследования</h1>'+recordLines().map(s=>'<p>'+ESC(s)+'</p>').join("");
  const page='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>'+ESC(current.title)+'</title><style>@page{size:A4;margin:17mm 16mm}body{font:11pt/1.5 Arial,sans-serif;color:#243029}h1{font-size:18pt}h2{font-size:13pt;margin-top:15pt}p{margin:6pt 0}table{border-collapse:collapse;width:100%;table-layout:fixed}td,th{border:1px solid #9ba4a0;padding:8pt;text-align:left;vertical-align:top;font-size:9.5pt;overflow-wrap:break-word}th{background:#edf2ef}.pmpk-blank-writing{height:45pt}.page-break{break-before:page;page-break-before:always}tr{break-inside:avoid}h1,h2{break-after:avoid}ol{padding-left:20pt}li{margin-bottom:6pt}</style></head><body>'+body+'</body></html>';
  const win=window.open("","_blank");if(!win){window.alert("Разрешите браузеру открыть окно печати.");return}
  win.document.open();win.document.write(page);win.document.close();win.focus();win.setTimeout(()=>win.print(),350);
 }
 function xml(s){return ESC(s).replace(/&#39;/g,"&apos;")}
 function wp(s){return '<w:p><w:pPr><w:spacing w:after="100"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="21"/></w:rPr><w:t xml:space="preserve">'+xml(s)+'</w:t></w:r></w:p>'}
 function wt(rows){
  return '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="5"/><w:left w:val="single" w:sz="5"/><w:bottom w:val="single" w:sz="5"/><w:right w:val="single" w:sz="5"/><w:insideH w:val="single" w:sz="5"/><w:insideV w:val="single" w:sz="5"/></w:tblBorders></w:tblPr>'+rows.map(r=>'<w:tr>'+r.map(s=>'<w:tc><w:tcPr><w:tcW w:w="2200" w:type="dxa"/></w:tcPr>'+wp(s)+'</w:tc>').join("")+'</w:tr>').join("")+'</w:tbl>';
 }
 function docxXML(type){
  let body=wp(current.title)+wp("Психотека · 7-11 лет · рабочая диагностическая проба");
  if(type==="blank"){
   body+=wp("ПРОТОКОЛ СПЕЦИАЛИСТА. Имя / код: _____________  Дата: _____________");
   if(current.code===METHODS.thinking.code)body+=wt([["№","Стимул для предъявления","Ответ ребенка","Помощь"],...current.items.map((x,i)=>[String(i+1),x.prompt,"___________________","____________"])]);
   else {body+=wp("Специалист зачитывает: "+current.words.join(", "));body+=wt([["Слово","1-е","2-е","3-е","Отсроченно"],...current.words.map(x=>[x,"","", "", ""])]);body+=wp("Фактическая отсрочка: _________ минут. Привнесения и повторы: ___________________");}
   body+=wp("Наблюдения / помощь: __________________________________________________");
  }else body+=recordLines().map(wp).join("");
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850"/></w:sectPr></w:body></w:document>';
 }
 function zip(entries){
  const enc=new TextEncoder(), local=[],central=[];let offset=0;
  const u16=n=>[n&255,(n>>>8)&255],u32=n=>[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];
  function crc(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^0xffffffff)>>>0}
  for(const [name,value] of Object.entries(entries)){
   const path=enc.encode(name),bytes=enc.encode(value),sum=crc(bytes);
   const h=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0x800),...u16(0),...u16(0),...u16(0),...u32(sum),...u32(bytes.length),...u32(bytes.length),...u16(path.length),...u16(0),...path]);
   local.push(h,bytes);
   central.push(new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0x800),...u16(0),...u16(0),...u16(0),...u32(sum),...u32(bytes.length),...u32(bytes.length),...u16(path.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...path]));
   offset+=h.length+bytes.length;
  }
  const size=central.reduce((sum,x)=>sum+x.length,0);
  return new Blob([...local,...central,new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(central.length),...u16(central.length),...u32(size),...u32(offset),...u16(0)])],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
 }
 function wordDownload(type){
  if(type==="report"&&!complete())return;
  const names={"[Content_Types].xml":'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',"_rels/.rels":'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',"word/document.xml":docxXML(type)};
  const url=URL.createObjectURL(zip(names)),a=document.createElement("a");a.href=url;a.download=current.code+"-"+(type==="blank"?"protocol":"report")+".docx";document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),60000);
 }
 function transfer(){
  if(!complete())return;
  const d=state(),first=RESULTS[0];
  let result="С помощью",description="";
  if(current.code===METHODS.thinking.code){
   const yes=d.answers.filter(x=>x==="Самостоятельно").length,assisted=d.answers.filter(x=>x==="С помощью").length,errors=d.answers.filter(x=>x==="Не выполнил").length;
   result=yes+assisted===0?"Не выполнил":assisted===0&&d.help==="Без помощи"?"Самостоятельно":"С помощью";
   description="Исключение лишнего и простые аналогии: самостоятельно – "+yes+", с помощью – "+assisted+", не выполнено – "+errors+". "+
    current.items.map((x,i)=>"№ "+(i+1)+": "+d.answers[i]+(d.literal[i]?" (ответ: "+d.literal[i]+")":"")).join("; ")+".";
  }else{
   const used=ROUNDS.filter(([k])=>d.rounds[k]==="done");
   const total=used.reduce((n,[k])=>n+d.rows[k].filter(x=>x==="yes").length,0);
   result=total===0?"Не выполнил":d.help==="Без помощи"?"Самостоятельно":"С помощью";
   description="Запоминание шести слов: "+ROUNDS.map(([k,label])=>label+" – "+(d.rounds[k]==="skip"?"не проводилось":d.rows[k].filter(x=>x==="yes").length+" из 6")).join("; ")+
    (d.rounds.delayed==="done"?" (отсрочка "+d.delay+" мин)":"")+". Привнесения / повторы: "+(d.intrusions||"не отмечены")+".";
  }
  const bridge=window.PSY_PMPK_BRIDGE;
  if(bridge&&bridge.getAge()===2){if(bridge.transfer(current.task,{result,help:d.help,notes:description+" Наблюдения специалиста: "+d.notes}))close()}
  else window.alert("Для переноса в общий протокол сначала выберите возраст 7-11 лет.");
 }
 function takeValue(el){
  const d=state();
  if(el.dataset.mField){const key=el.dataset.mField;if(key==="delay"&&el.value!==""&&(+el.value<=0||+el.value>240||!Number.isFinite(+el.value))){el.setCustomValidity("Укажите время от 0,1 до 240 минут.");return}el.setCustomValidity("");d[key]=el.value}
  else if(el.dataset.mThinking!==undefined)d.answers[+el.dataset.mThinking]=el.value;
  else if(el.dataset.mLiteral!==undefined)d.literal[+el.dataset.mLiteral]=el.value;
  else if(el.dataset.mRound){d.rounds[el.dataset.mRound]=el.value;d.rows[el.dataset.mRound]=Array(6).fill("");if(el.dataset.mRound==="delayed")d.delay="";draw(true);return}
  else if(el.dataset.mWord){const [k,idx]=el.dataset.mWord.split(":");d.rows[k][+idx]=el.value}
  indicators();
 }
 function onClick(e){
  if(e.target===overlay){close();return}
  const b=e.target.closest("button");if(!b||!overlay.contains(b))return;
  if(b.dataset.mTab){tab=b.dataset.mTab;draw(false);return}
  const action=b.dataset.mAction;
  if(action==="close")close();
  else if(action==="process"){tab="processing";draw(false)}
  else if(action==="back"){tab="portfolio";draw(false)}
  else if(action==="print-guide")printDocument("guide");
  else if(action==="print-guide-blank")printDocument("guide-blank");
  else if(action==="print-blank")printDocument("blank");
  else if(action==="word-blank")wordDownload("blank");
  else if(action==="print-report")printDocument("report");
  else if(action==="word-report")wordDownload("report");
  else if(action==="transfer")transfer();
  else if(action==="reset"&&window.confirm("Очистить все ответы этой методики?")){store[current.code]=fresh(current.code);draw(false)}
 }
 document.addEventListener("click",e=>{
  const button=e.target.closest('[data-open-pmpk-method]');
  if(button)open(button.dataset.openPmpkMethod);
 });
 document.addEventListener("input",e=>{if(overlay&&overlay.contains(e.target)&&e.target.matches('[data-m-field],[data-m-thinking],[data-m-literal],[data-m-round],[data-m-word]'))takeValue(e.target)});
 document.addEventListener("change",e=>{if(overlay&&overlay.contains(e.target)&&e.target.matches('[data-m-field],[data-m-thinking],[data-m-literal],[data-m-round],[data-m-word]'))takeValue(e.target)});
 document.addEventListener("click",e=>{if(overlay&&overlay.contains(e.target))onClick(e)});
 window.PSY_PMPK_METHODS={open,info:{thinking:METHODS.thinking.code,memory:METHODS.memory.code},test:{getState:()=>current?JSON.parse(JSON.stringify(state())):null,isComplete:()=>current?complete():false}};
})();