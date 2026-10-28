"use strict";
(function(){
 const NAME="Опросник социально-эмоциональных навыков";
 const SRC="https://casel.org/what-is-sel/";
 const GUIDE="downloads/sel_skills_working_guide.docx";
 const STUDENT_WORD="downloads/sel_skills_student_blank.docx";
 const BLANK="downloads/sel_skills_student_blank.html";
 const SPECIALIST="downloads/sel_skills_specialist_protocol.html";
 const SCALES=[
  {id:"awareness",name:"Осознание себя",short:"Распознавание своих эмоций",items:[1,6,11,16]},
  {id:"regulation",name:"Саморегуляция",short:"Регулирование эмоций и поведения",items:[2,7,12,17]},
  {id:"empathy",name:"Социальная чуткость",short:"Понимание чувств других",items:[3,8,13,18]},
  {id:"communication",name:"Навыки общения",short:"Общение и сотрудничество",items:[4,9,14,19]},
  {id:"decision",name:"Ответственные решения",short:"Выбор с учетом последствий",items:[5,10,15,20]}
 ];
 const ITEMS=[
  "Я замечаю, когда у меня меняется настроение.",
  "Когда я злюсь, мне удается остановиться, прежде чем что-то сказать или сделать.",
  "Я замечаю, когда человеку рядом со мной неловко или грустно.",
  "Я могу спокойно объяснить другому человеку, что мне нужно.",
  "Перед сложным выбором я думаю о возможных последствиях.",
  "Обычно я понимаю, что именно меня расстроило.",
  "Если задание не получается, я пробую успокоиться и продолжить.",
  "Я стараюсь понять чужую точку зрения, даже если не согласен с ней.",
  "Во время совместной работы я могу договариваться о том, кто что делает.",
  "Я учитываю, может ли мой поступок задеть других людей.",
  "Я могу назвать свои сильные стороны.",
  "Когда переживания мешают мне учиться, я могу попросить о помощи.",
  "Если кто-то выглядит расстроенным, я могу спросить, нужна ли помощь.",
  "Я могу выслушать человека до конца, не перебивая.",
  "Во время спора я стараюсь найти безопасное и уважительное решение.",
  "Я понимаю, как мои чувства влияют на мои поступки.",
  "После неудачи я могу придумать маленький следующий шаг.",
  "Я стараюсь учитывать чувства людей, чей опыт отличается от моего.",
  "Если я не согласен с другим человеком, могу сказать об этом уважительно.",
  "При решении проблемы я стараюсь рассмотреть больше одного варианта."
 ];
 const WARN="Авторский рабочий опросник Метоларии (2026), созданный с опорой на пять направлений рамки CASEL. Это НЕ официальная шкала CASEL и НЕ стандартизированный психодиагностический тест. Для него не установлены возрастные нормы, надежность, валидность и диагностические пороги. Ответы отражают самооценку школьника и не позволяют делать вывод о клиническом состоянии или устойчивом уровне навыков.";
 const E=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const D={
  author:"Редакционная рабочая форма Метоларии, 2026; направления по рамке CASEL",
  age:"Ориентировочно 10-17 лет, при понимании текста; возрастная валидизация отсутствует",
  kind:"Авторский опросник самооценки навыков (не стандартизирован)",
  count:"20 утверждений, 5 направлений, ответы 0-3",
  goal:"Структурировать беседу с учеником о том, как он замечает эмоции, справляется с ними, понимает других, общается и принимает решения.",
  instructions:"Вспомни последние две недели. Прочитай каждое утверждение и отметь, как часто это обычно происходило: 0 - никогда, 1 - редко, 2 - часто, 3 - почти всегда. Здесь нет правильных или неправильных ответов. Можно пропустить вопрос или отказаться отвечать.",
  questions:ITEMS,options:["Никогда","Редко","Часто","Почти всегда"],
  scoring:"Каждый ответ оценивается от 0 до 3 без обратного кодирования. По 4 пункта на каждое направление: 1,6,11,16; 2,7,12,17; 3,8,13,18; 4,9,14,19; 5,10,15,20. Сумма по направлению 0-12. Общая сумма 0-60, среднее по всем пунктам 0-3. При любом пропуске количественный подсчет для участника не выводится; ноль является полноценным ответом, а не пропуском.",
  interpret:"Чем выше сумма, тем чаще участник сообщает о соответствующих действиях за последние две недели. Не используйте проценты, уровни нормы, клинические выводы или межличностное ранжирование. Обсудите конкретные примеры, сопоставьте с наблюдением и условиями класса. Следите за эффектом социальной желательности.",
  warning:WARN,source:SRC,guideFile:GUIDE,answerFile:BLANK,studentWordFile:STUDENT_WORD,specialistFile:SPECIALIST,
  workflow:"selwork2026",calculator:true,formVersion:"SEL-WORK-20-2026-v1",
  scales:SCALES,indicators:SCALES.map(x=>x.name)
 };
 (window.PSY_FULL_METHODS||(window.PSY_FULL_METHODS={}))[NAME]=D;
 const valid=x=>x!==""&&x!==null&&x!==undefined&&Number.isInteger(Number(x))&&Number(x)>=0&&Number(x)<=3;
 function score(data,a){
  if(!Array.isArray(a)||a.length<20||Array.from({length:20},(_,i)=>a[i]).some(x=>!valid(x)))return null;
  const n=a.slice(0,20).map(Number),total=n.reduce((sum,x)=>sum+x,0);
  const scales=SCALES.map(s=>({id:s.id,name:s.name,items:s.items,raw:s.items.reduce((sum,i)=>sum+n[i-1],0),max:12}));
  return {raw:total,max:60,mean:total/20,scales,answers:n,complete:true,caption:"Описательная сумма ответов"};
 }
 function done(a){return Array.from({length:20},(_,i)=>a?.[i]).filter(valid).length}
 function links(){
  return '<div class="psy-sel-links"><a class="btn primary" href="'+GUIDE+'" download>Методика и ключ · Word</a><a class="btn" href="'+STUDENT_WORD+'" download>Бланк ученика · Word</a><a class="btn" href="'+BLANK+'" target="_blank" rel="noopener noreferrer">Бланк ученика · А4</a><a class="btn" href="'+SPECIALIST+'" target="_blank" rel="noopener noreferrer">Протокол психолога · А4</a><a class="btn" href="'+SRC+'" target="_blank" rel="noopener noreferrer">Рамка CASEL · источник</a></div>';
 }
 function instruction(){
  return '<h3>О проведении</h3><div class="notice psy-sel-caution">'+E(WARN)+'</div><p>'+E(D.instructions)+'</p><p>Ориентировочное время: 7-10 минут. Индивидуально или в группе при обеспечении добровольности, спокойной обстановки и конфиденциальности.</p>'+
  '<h3>Порядок для специалиста</h3><ol><li>Объясните ученику цель: понять его собственные впечатления, а не поставить отметку.</li><li>Предъявите одинаковую инструкцию и 20 утверждений в оригинальной последовательности этого комплекта.</li><li>Разрешите не отвечать; не подсказывайте социально одобряемые ответы.</li><li>Уточните непонятные слова без изменения смысла; отметьте обстоятельства процедуры.</li><li>Введите ответы в калькулятор. При пропусках расчет блокируется, не заполняйте их за ученика.</li><li>Обсудите примеры и возможные условия, в которых навык легче или сложнее проявляется.</li></ol>'+
  '<h3>Этические ограничения</h3><p>Не используйте для отбора, оценки личности, дисциплинарных решений или публичного сравнения школьников. На демонстрационном сайте вводите коды без фамилий.</p>'+links();
 }
 function materials(){
  return '<h3>Бланк самооценки, 20 утверждений</h3><div class="notice psy-sel-caution">Рабочий авторский инструмент без норм. Участник может пропустить пункт; тогда полный расчет не выполняется.</div>'+
   '<p><b>Ответы:</b> 0 - никогда; 1 - редко; 2 - часто; 3 - почти всегда.</p>'+
   '<div class="psy-sel-scroll"><table class="psy-sel-table"><thead><tr><th>№</th><th>Утверждение</th><th>0</th><th>1</th><th>2</th><th>3</th></tr></thead><tbody>'+
   ITEMS.map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+E(q)+'</td><td>□</td><td>□</td><td>□</td><td>□</td></tr>').join("")+'</tbody></table></div>'+links();
 }
 function processing(){
  return '<h3>Ключ обработки</h3><p>'+E(D.scoring)+'</p>'+
   '<table class="psy-sel-key"><thead><tr><th>Направление</th><th>Пункты</th><th>Диапазон</th></tr></thead><tbody>'+
   SCALES.map(s=>'<tr><td>'+E(s.name)+'</td><td>'+s.items.join(", ")+'</td><td>0-12</td></tr>').join("")+
   '<tr><td><b>Общая сумма</b></td><td>1-20</td><td>0-60</td></tr></tbody></table>'+
   '<h3>Интерпретация</h3><p>'+E(D.interpret)+'</p><div class="notice psy-sel-caution">'+E(WARN)+'</div>'+links();
 }
 function mini(a){const result=score(D,a),count=done(a);
  if(!result)return '<div class="psy-sel-result"><b>Заполнено '+count+' из 20.</b><div class="psy-sel-meter"><span style="width:'+(count*5)+'%"></span></div><p>При пропусках суммы не рассчитываются. Ответ 0 не считается пропуском.</p></div>';
  return '<div class="psy-sel-result"><h3>Описательный результат</h3><div class="psy-sel-total"><b>'+result.raw+' / 60</b><span>Общая сумма; среднее '+result.mean.toFixed(2)+' / 3</span></div>'+
  '<div class="psy-sel-scale-list">'+result.scales.map(s=>'<div class="psy-sel-scale"><div><strong>'+E(s.name)+'</strong><b>'+s.raw+' / 12</b></div><div class="psy-sel-meter"><span style="width:'+(s.raw*100/12)+'%"></span></div></div>').join("")+
  '</div><p class="psy-sel-small">Это самооценка за последние две недели, без возрастных норм, категорий риска и диагноза.</p></div>';
 }
 const safeCsv=x=>{let t=String(x??"");if(/^\s*[=+\-@]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"'};
 const csv=data=>"\uFEFF"+data.map(row=>row.map(safeCsv).join(";")).join("\r\n");
 const download=(name,data,mime)=>{const u=URL.createObjectURL(new Blob([data],{type:mime})),a=document.createElement("a");a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};
 const code=(r,i)=>r.name||"У-"+String(i+1).padStart(2,"0");
 function group(rows){
  return '<div class="psy-sel-group"><h3>Групповой протокол</h3><div class="psy-sel-scroll"><table><thead><tr><th>Код</th><th>Ответов</th><th>Сумма</th>'+
   SCALES.map(s=>'<th>'+E(s.name)+'</th>').join("")+'</tr></thead><tbody>'+
   rows.map((r,i)=>{const z=score(D,r.answers);return '<tr><td>'+E(code(r,i))+'</td><td>'+done(r.answers)+'/20</td><td>'+(z?z.raw:"—")+'</td>'+
    SCALES.map(s=>'<td>'+(z?z.scales.find(x=>x.id===s.id).raw:"—")+'</td>').join("")+'</tr>'}).join("")+
   '</tbody></table></div><p class="psy-sel-small">Пропуски обозначаются прочерком: неполные анкеты не оцениваются количественно. Статистическое усреднение по классу намеренно не выводится.</p></div>';
 }
 function calculator(d,ctx){
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],p=rows[ctx.rowIndex]||rows[0],ans=p.answers||[];
  let h='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ученик</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Весь класс</button></div>'+
    '<div class="notice psy-sel-caution">Авторский рабочий опросник, не стандартизированный тест. Перенесите реальные ответы из бланка без догадок. Используйте код вместо ФИО.</div>';
  if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Участник<select id="participantSelect">'+rows.map((r,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+E(code(r,i))+'</option>').join("")+'</select></label><label>Код<input id="participantName" maxlength="40" value="'+E(p.name||"")+'" placeholder="У-01, не ФИО"></label><button class="btn" id="addParticipant">Добавить</button></div>';
  else h+='<label class="psy-sel-code">Код ученика (необязательно)<input id="selSingleCode" maxlength="40" value="'+E(p.name||"")+'" placeholder="Без имени"></label>';
  h+='<p class="psy-sel-small">0 - никогда; 1 - редко; 2 - часто; 3 - почти всегда. Незаполненный ответ оставляйте пустым.</p>'+
    '<div class="psy-sel-grid">'+ITEMS.map((q,i)=>'<label class="psy-sel-question"><span><b>'+(i+1)+'.</b> '+E(q)+'</span><select data-sel-answer="'+i+'" aria-label="Ответ на утверждение '+(i+1)+'"><option value="">Не заполнено</option>'+
    Array.from({length:4},(_,v)=>'<option value="'+v+'" '+(String(ans[i])===String(v)?"selected":"")+'>'+v+' · '+E(D.options[v])+'</option>').join("")+'</select></label>').join("")+'</div>';
  h+='<div id="selResult">'+mini(ans)+'</div><div class="psy-sel-actions"><button class="btn" id="resetParticipant">Очистить ответы</button><button class="btn primary" id="selIndividualExport">Скачать протокол ученика · HTML</button></div>';
  if(ctx.calcMode==="class")h+='<div id="selGroup">'+group(rows)+'</div><div class="psy-sel-actions"><button class="btn" id="nextParticipant">Следующий ученик</button><button class="btn primary" id="selCSV">Скачать таблицу класса · CSV</button></div>';
  return h;
 }
 function bind(d,ctx){
  const rows=ctx.rows||[],row=rows[ctx.rowIndex];if(!row)return;
  document.getElementById("selSingleCode")?.addEventListener("input",e=>{row.name=e.target.value});
  document.querySelectorAll("[data-sel-answer]").forEach(el=>el.addEventListener("change",()=>{
   row.answers[Number(el.dataset.selAnswer)]=el.value===""?"":Number(el.value);
   const result=document.getElementById("selResult");if(result)result.innerHTML=mini(row.answers);
   const g=document.getElementById("selGroup");if(g)g.innerHTML=group(rows);
  }));
  document.getElementById("selIndividualExport")?.addEventListener("click",()=>{
   const z=score(d,row.answers);if(!z){alert("Сначала внесите все 20 ответов; пропуски не заменяются нулем.");return;}
   const out='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Протокол SEL</title><style>@page{size:A4;margin:14mm}body{font:14px/1.5 Arial,sans-serif;color:#25372d;max-width:820px;margin:25px auto}table{border-collapse:collapse;width:100%}td,th{border:1px solid #a6b8ac;padding:7px;text-align:left}p{line-height:1.5}</style></head><body><h1>Опросник социально-эмоциональных навыков</h1><p>Авторская рабочая форма Метоларии, SEL-WORK-20-2026-v1. Не стандартизировано.</p><p>Код: '+E(row.name||"не указан")+'; дата выгрузки: '+new Date().toLocaleDateString("ru-RU")+'</p><p>Общая сумма: <b>'+z.raw+' / 60</b>; среднее: <b>'+z.mean.toFixed(2)+' / 3</b>.</p><h2>Направления</h2><table><tr><th>Направление</th><th>Пункты</th><th>Сумма</th></tr>'+
   z.scales.map(s=>'<tr><td>'+E(s.name)+'</td><td>'+s.items.join(", ")+'</td><td>'+s.raw+' / 12</td></tr>').join("")+'</table><h2>Ответы</h2><table><tr><th>№</th><th>Утверждение</th><th>Ответ</th></tr>'+
   ITEMS.map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+E(q)+'</td><td>'+z.answers[i]+'</td></tr>').join("")+'</table><p><b>Ограничения:</b> '+E(WARN)+'</p></body></html>';
   download("SEL_протокол_ученика.html",out,"text/html;charset=utf-8");
  });
  document.getElementById("selCSV")?.addEventListener("click",()=>{
   const table=[["Код","Полных ответов","Общая сумма 0-60",...SCALES.map(s=>s.name+" 0-12"),...ITEMS.map((_,i)=>"Пункт "+(i+1))],
   ...rows.map((r,i)=>{const z=score(d,r.answers);return [code(r,i),done(r.answers),z?z.raw:"",...SCALES.map(s=>z?z.scales.find(x=>x.id===s.id).raw:""),...Array.from({length:20},(_,j)=>valid(r.answers?.[j])?Number(r.answers[j]):"")];})];
   download("SEL_результаты_класса.csv",csv(table),"text/csv;charset=utf-8");
  });
 }
 window.PSY_SEL_SKILLS={score,done,instruction,materials,processing,calculator,bind,items:ITEMS,scales:SCALES};
})();