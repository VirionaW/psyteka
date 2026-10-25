"use strict";
(function(){
 const NAME="Индекс хорошего самочувствия WHO-5";
 const WHO="https://www.who.int/ru/publications/m/item/WHO-UCN-MSD-MHE-2024.01";
 const RUS="https://cdn.who.int/media/docs/default-source/mental-health/who-5_russian.pdf?sfvrsn=ed43f352_11";
 const REVIEW="https://www.oecd.org/en/publications/how-to-make-societies-thrive-coordinating-approaches-to-promote-well-being-and-mental-health_fc6b9844-en/full-report/component-2.html";
 const GUIDE="downloads/who5_method_guide.docx";
 const BLANK="downloads/who5_student_register.html";
 const TOPICS=[
   "Хорошее настроение и бодрость",
   "Спокойствие и расслабленность",
   "Активность и энергичность",
   "Ощущение отдыха после сна",
   "Интерес к повседневной жизни"
 ];
 const OPTIONS=[
  {v:5,text:"Все время"},{v:4,text:"Большую часть времени"},
  {v:3,text:"Более половины времени"},{v:2,text:"Менее половины времени"},
  {v:1,text:"Некоторое время"},{v:0,text:"Никогда"}
 ];
 const NOTE="ВВОЗ опубликована русская форма WHO-5, которую можно использовать без самостоятельного перевода. ВОЗ уточняет, что перевод был подготовлен до передачи авторских прав в 2024 г., и не гарантирует его точность: при расхождениях решающее значение имеет английский оригинал. В этой карточке тематические подписи не заменяют текст пяти утверждений: предъявляйте полный официальный PDF.";
 const AGE="Преимущественно подростки и взрослые; для младших школьников применять только с учетом возрастной и языковой пригодности конкретной версии.";
 const d={
  author:"Первоначальная разработка: Пер Бех (Per Bech) и Psychiatric Research Unit, WHO Collaborating Centre for Mental Health; права на WHO-5 переданы ВОЗ в 2024 г.",
  age:AGE,
  kind:"Краткий самоотчет о положительном психологическом благополучии",
  count:"5 утверждений, 6 вариантов ответа (0–5), 1 суммарный индекс",
  goal:"Оценка субъективного самочувствия и положительного эмоционального благополучия за последние две недели.",
  instructions:"Предъявите полный официальный русскоязычный бланк WHO-5 или подходящую проверенную версию. Участник оценивает пять утверждений за последние две недели по шестиступенчатой шкале от 5 («все время») до 0 («никогда»). Перенесите ответы строго по порядку пунктов. Не заменяйте отсутствующие ответы нулем.",
  scoring:"Каждый из пяти прямых пунктов оценивается от 0 до 5 без обратного пересчета. Сырой балл = сумма ответов, диапазон 0–25. Индекс WHO-5 = сырой балл × 4, диапазон 0–100. Чем выше балл, тем выше субъективное благополучие. Один пропуск или ответ вне диапазона 0–5 делает полный индекс нерассчитываемым.",
  interpret:"Чем выше показатель WHO-5, тем больше положительных переживаний отмечено за последние две недели. Низкие значения могут быть поводом для бережной беседы и дополнительной оценки ситуации, но не равнозначны диагнозу. Пороги, описанные в литературе для взрослых и отдельных выборок, нельзя механически переносить на школьников; автоматический диагноз и категоризация по порогам отключены.",
  warning:NOTE,
  questions:TOPICS,
  options:OPTIONS.map(x=>x.v+" — "+x.text),
  source:WHO,officialBlank:RUS,officialPDF:RUS,
  sourceScoring:REVIEW,guideFile:GUIDE,answerFile:BLANK,
  calculator:true,workflow:"who5",
  license:"Используйте официальный PDF ВОЗ без изменений; оригинальная публикация 2024 года распространяется по CC BY-NC-SA 3.0 IGO. Локальный лист Психотеки только регистрирует ответы по номерам."
 };
 (window.PSY_FULL_METHODS||(window.PSY_FULL_METHODS={}))[NAME]=d;
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function valid(v){return (typeof v==="number"&&Number.isInteger(v)&&v>=0&&v<=5)||(typeof v==="string"&&/^[0-5]$/.test(v));}
 function score(data,answers){
  if(!Array.isArray(answers)||answers.length<5)return null;
  const five=Array.from({length:5},(_,i)=>answers[i]);
  if(five.some(x=>!valid(x)))return null;
  const raw=five.reduce((n,x)=>n+Number(x),0);
  return {complete:true,raw,max:25,index:raw*4,indexMax:100,answers:five.map(Number)};
 }
 const filled=a=>Array.from({length:5},(_,i)=>a?.[i]).filter(valid).length;
 function links(){return '<div class="psy-who-links">'+
  '<a class="btn primary" href="'+GUIDE+'" download>Методика и ключ · Word</a>'+
  '<a class="btn" href="'+BLANK+'" target="_blank" rel="noopener noreferrer">Бланк ученика · А4</a>'+
  '<a class="btn" href="'+RUS+'" target="_blank" rel="noopener noreferrer">Полная русская форма ВОЗ · PDF ↗</a>'+
  '<a class="btn" href="'+WHO+'" target="_blank" rel="noopener noreferrer">Карточка ВОЗ · источник ↗</a></div>';}
 function instruction(){
  return '<h3>Подготовка</h3><p>WHO-5 предназначен для оценки положительного субъективного благополучия. Для работы со школьниками оцените возрастную пригодность выбранной формы и необходимое согласие. Бланк самозаполнения индивидуален; в демонстрационной системе используйте коды, не ФИО.</p>'+
  '<h3>Порядок проведения</h3><ol>'+
  '<li>Откройте <a href="'+RUS+'" target="_blank" rel="noopener noreferrer">официальную русскую форму ВОЗ</a> и предложите участнику все пять утверждений в исходном порядке.</li>'+
  '<li>Попросите оценить самочувствие за <b>последние две недели</b>, выбрав один из вариантов от 5 («все время») до 0 («никогда»).</li>'+
  '<li>При необходимости дайте регистрационный лист А4, но текст вопросов предъявляйте по полному документу ВОЗ.</li>'+
  '<li>После завершения перенесите ответы по номерам в калькулятор. При пропуске хотя бы одного ответа результат не рассчитывается.</li>'+
  '<li>Сохраните индивидуальный протокол либо сводную таблицу класса. Обсуждайте результат конфиденциально, не превращая индекс в диагноз.</li></ol>'+
  '<h3>Инструкция ученику</h3><blockquote class="kid-instruction">Прочитай пять утверждений о своем самочувствии за последние две недели. Для каждого выбери одно число от 0 до 5, которое подходит тебе лучше всего. Здесь нет правильных или неправильных ответов.</blockquote>'+
  '<div class="notice psy-who-note">'+esc(NOTE)+'</div>'+links();
 }
 function materials(){
  return '<h3>Бланк ученика и исходные утверждения</h3><p><b>Полный официальный текст пяти утверждений</b> находится в <a href="'+RUS+'" target="_blank" rel="noopener noreferrer">русском PDF ВОЗ</a>. В Психотеке представлен отдельный регистрационный лист: пять строк, шесть вариантов ответов и место для кода обследуемого.</p>'+
  '<p>Тематические ориентиры пунктов (не заменяют исходных формулировок):</p><ol>'+TOPICS.map(q=>'<li>'+esc(q)+'</li>').join("")+'</ol>'+
  '<p>При регистрации важно сохранить исходный порядок вопросов, направление шкалы и период «последние две недели».</p>'+links();
 }
 function processing(){
  return '<h3>Ключ и подсчет WHO-5</h3><p>'+esc(d.scoring)+'</p>'+
  '<div class="psy-who-scale">'+OPTIONS.map(x=>'<span><b>'+x.v+'</b> '+esc(x.text)+'</span>').join("")+'</div>'+
  '<h3>Контрольные примеры</h3><table><thead><tr><th>Пять ответов</th><th>Сырой балл</th><th>Индекс WHO-5</th></tr></thead><tbody>'+
  '<tr><td>0, 0, 0, 0, 0</td><td>0 / 25</td><td>0 / 100</td></tr>'+
  '<tr><td>3, 4, 2, 1, 5</td><td>15 / 25</td><td>60 / 100</td></tr>'+
  '<tr><td>5, 5, 5, 5, 5</td><td>25 / 25</td><td>100 / 100</td></tr></tbody></table>'+
  '<h3>Интерпретация</h3><p>'+esc(d.interpret)+'</p>'+
  '<p>Для сравнения результатов повторных обследований используйте одинаковую языковую редакцию и условия проведения. Если используется неофициальная адаптация, обозначьте это в документах.</p>'+
  '<div class="notice psy-who-note">'+esc(NOTE)+'</div>'+
  '<p><a target="_blank" rel="noopener noreferrer" href="'+WHO+'">Публикация ВОЗ ↗</a> · <a href="'+REVIEW+'" target="_blank" rel="noopener noreferrer">Пример правил подсчета, OECD ↗</a></p>';
 }
 function result(a){
  const z=score(d,a),n=filled(a);
  let h='<section class="psy-who-result"><h3>Результат WHO-5</h3><p>Отмечено <b>'+n+' из 5</b> пунктов</p>'+
   '<div class="psy-who-track"><span style="width:'+(n*20)+'%"></span></div>';
  if(!z)return h+'<p class="psy-who-muted">Для получения индекса заполните все пять пунктов. Пустое поле не равно ответу 0.</p></section>';
  return h+'<div class="psy-who-score"><div><small>Сырой балл</small><strong>'+z.raw+' <span>/ 25</span></strong></div><div><small>Индекс WHO-5</small><strong>'+z.index+' <span>/ 100</span></strong></div></div>'+
    '<div class="psy-who-track psy-who-scoretrack"><span style="width:'+z.index+'%"></span></div>'+
    '<p class="psy-who-muted">Больший индекс соответствует лучшему самочувствию. Балл описывает последние две недели, без автоматического диагноза или нормативного ярлыка.</p></section>';
 }
 function table(rows){
  return '<div class="psy-who-scroll"><table><thead><tr><th>Код ученика</th><th>Заполнено</th><th>Сырой балл</th><th>WHO-5 (0–100)</th></tr></thead><tbody>'+
  rows.map((r,i)=>{const z=score(d,r.answers);return '<tr><td>'+esc(r.name||"У-"+String(i+1).padStart(2,"0"))+'</td><td>'+filled(r.answers)+'/5</td><td>'+(z?z.raw+'/25':'—')+'</td><td>'+(z?z.index:'—')+'</td></tr>'}).join("")+
  '</tbody></table></div><p class="psy-who-muted">Пустые ответы не засчитываются как 0 и не участвуют в расчетах; экспорт включает только условные коды.</p>';
 }
 function calculator(data,ctx){
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],a=r.answers||[];
  let h='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ученик</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Класс / группа</button></div>'+
  '<div class="notice psy-who-note">Вводите данные по полному официальному русскому бланку WHO-5. Используйте коды вместо ФИО. Для расчета данные остаются в браузере.</div>';
  if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Ученик<select id="participantSelect">'+rows.map((x,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(x.name||"У-"+(i+1))+'</option>').join("")+'</select></label><label>Код<input id="participantName" maxlength="40" value="'+esc(r.name||"")+'" placeholder="У-01"></label><button class="btn" id="addParticipant">Добавить ученика</button></div>';
  else h+='<label class="psy-who-code">Условный код ученика<input id="who5SingleCode" maxlength="40" value="'+esc(r.name||"")+'" placeholder="Например, У-01"></label>';
  h+='<div class="psy-who-grid">'+TOPICS.map((topic,i)=>'<label class="psy-who-item"><span><b>'+(i+1)+'.</b> '+esc(topic)+'</span><select data-who5-answer="'+i+'" aria-label="Пункт '+(i+1)+' WHO-5"><option value="">— ответ не отмечен —</option>'+
  OPTIONS.map(opt=>'<option value="'+opt.v+'" '+(valid(a[i])&&Number(a[i])===opt.v?"selected":"")+'>'+opt.v+' — '+esc(opt.text)+'</option>').join("")+'</select></label>').join("")+'</div>'+
  '<div id="who5Result">'+result(a)+'</div><div class="psy-who-actions"><button class="btn" id="who5Clear">Очистить пять ответов</button><button class="btn primary" id="who5Report">Скачать индивидуальный протокол</button></div>';
  if(ctx.calcMode==="class")h+='<h3>Сводка класса</h3><div id="who5Group">'+table(rows)+'</div>'+
   '<div class="psy-who-actions"><button class="btn" id="nextParticipant">Следующий ученик</button><button class="btn primary" id="who5Export">Скачать CSV для Excel</button></div>';
  return h;
 }
 function save(name,content,type){
  const u=URL.createObjectURL(new Blob([content],{type})),a=document.createElement("a");a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1500);
 }
 function csvCell(t){let s=String(t??"");if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
 function csv(rows){return "\uFEFF"+rows.map(row=>row.map(csvCell).join(";")).join("\r\n");}
 function bind(data,ctx){
  const rows=ctx.rows||[],r=rows[ctx.rowIndex];if(!r)return;r.answers ||= [];
  const refresh=()=>{const x=document.getElementById("who5Result");if(x)x.innerHTML=result(r.answers);const g=document.getElementById("who5Group");if(g)g.innerHTML=table(rows);};
  document.getElementById("who5SingleCode")?.addEventListener("input",e=>{r.name=e.target.value});
  document.querySelectorAll("[data-who5-answer]").forEach(el=>el.addEventListener("change",()=>{r.answers[Number(el.dataset.who5Answer)]=el.value===""?"":Number(el.value);refresh()}));
  document.getElementById("who5Clear")?.addEventListener("click",()=>{if(!confirm("Очистить все пять ответов этого ученика?"))return;r.answers=[];document.querySelectorAll("[data-who5-answer]").forEach(el=>el.value="");refresh()});
  document.getElementById("who5Report")?.addEventListener("click",()=>{
   const z=score(data,r.answers);if(!z){alert("Для индивидуального протокола требуются все пять ответов.");return}
   const body='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>WHO-5 · протокол</title><style>@page{size:A4;margin:16mm}body{font:14px/1.6 Arial,sans-serif;color:#263b31;max-width:750px;margin:25px auto}h1{font-size:23px;color:#265942}.score{font-size:22px;font-weight:700;margin:16px 0}td,th{padding:9px;border:1px solid #9db6a7;text-align:left}table{border-collapse:collapse;width:100%}.small{font-size:12px;color:#66766b}</style></head><body><h1>WHO-5 · индивидуальный протокол</h1><p>Код ученика: '+esc(r.name||"не указан")+'<br>Дата формирования: '+new Date().toLocaleDateString("ru-RU")+'<br>Период вопросов: последние две недели.</p><div class="score">Индекс WHO-5: '+z.index+' из 100</div><p>Сырой балл: '+z.raw+' из 25.</p><table><thead><tr><th>Пункт</th><th>Ответ 0–5</th></tr></thead><tbody>'+z.answers.map((v,i)=>'<tr><td>'+String(i+1)+'</td><td>'+v+'</td></tr>').join("")+'</tbody></table>'+
   '<p class="small">'+esc(data.interpret)+'</p><p class="small">Официальный русский источник: '+esc(RUS)+'</p><p class="small">'+esc(NOTE)+'</p></body></html>';
   save("WHO5_individual_protocol.html",body,"text/html;charset=utf-8");
  });
  document.getElementById("who5Export")?.addEventListener("click",()=>{
   const out=[["Код","Заполнено из 5","Сырой балл 0–25","Индекс WHO-5 0–100","Пункт 1","Пункт 2","Пункт 3","Пункт 4","Пункт 5"]];
   rows.forEach((r,i)=>{const z=score(data,r.answers);out.push([r.name||"У-"+(i+1),filled(r.answers),z?.raw??"",z?.index??"",...Array.from({length:5},(_,j)=>valid(r.answers?.[j])?Number(r.answers[j]):"")])});
   save("WHO5_group.csv",csv(out),"text/csv;charset=utf-8");
  });
 }
 window.PSY_WHO5={score,filled,instruction,materials,processing,calculator,bind,result,table,topics:TOPICS,options:OPTIONS};
})();