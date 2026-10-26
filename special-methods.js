"use strict";
(function(){
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const definitions=[
  {id:"special-gas-01",title:"Шкала достижения индивидуальных целей GAS",group:"Мониторинг",topic:"Достижение целей",
   author:"T. J. Kiresuk, R. E. Sherman (1968)",ageLabel:"3-17 лет, взрослые 18+ – рабочий диапазон применения без возрастных норм",
   ages:["Дошкольники","Школьники","Взрослые"],format:"Метод оценки индивидуальных целей",
   goal:"Согласовать одну наблюдаемую функциональную цель и оценить достигнутый результат по пяти заранее описанным уровням.",
   source:"https://www.kcl.ac.uk/cicelysaunders/resources/toolkits/gas-overview",
   source2:"https://pubmed.ncbi.nlm.nih.gov/24185570/",
   count:"Одна индивидуальная цель, пять уровней",
   indicators:["Функциональная цель и ожидаемый результат","Пять различимых уровней от -2 до +2","Контекст и условия оценки","Достигнутый уровень и подтверждающие наблюдения"],
   guideSteps:[
    "Согласуйте с участником или законным представителем значимую, достижимую цель. Опишите конкретное наблюдаемое действие, а не личностное качество.",
    "Заранее укажите условия и срок оценки. При необходимости предусмотрите доступный способ участия и помощи.",
    "До начала работы письменно опишите все пять различимых уровней результата: -2, -1, 0, +1 и +2. Уровень 0 означает ожидаемый результат.",
    "Проверьте, что уровни описывают один и тот же показатель, логически не пересекаются и не требуют одновременно менять несколько параметров.",
    "После согласованного периода сопоставьте фактическое действие с заранее заданными описаниями, выберите один уровень и запишите наблюдаемое основание.",
    "Сохраняйте первоначальные формулировки для сопоставления. При изменении цели оформляйте новую шкалу, не переписывая ее задним числом."
   ],
   limitations:"Это рабочая форма для одной цели по принципам GAS, а не полная стандартизированная батарея. Здесь намеренно не рассчитываются общий GAS T-балл, нормы, межличностные сравнения и клинические выводы. Для комплексной количественной GAS-оценки нужно отдельно определять число целей, правила взвешивания и процедуру верификации уровней."
  },
  {id:"special-abc-01",title:"ABC-наблюдение: предшествующие события – поведение – последствия",group:"Диагностика и наблюдение",topic:"Поведение",
   author:"Метод ABC-регистрации; единый первоначальный автор не установлен",ageLabel:"3-17 лет, взрослые 18+ – рабочий диапазон применения без возрастных норм",
   ages:["Дошкольники","Школьники","Взрослые"],format:"Структурированное наблюдение",
   goal:"Зарегистрировать наблюдаемые действия вместе с событиями непосредственно перед ними и сразу после них, чтобы изучать повторяющиеся контексты и планировать поддержку.",
   source:"https://spedsupport.tea.texas.gov/resource-library/data-collection-b-c-recording",
   source2:"https://pent.ca.gov/pbis/dc/index.aspx",
   count:"Несколько событий, три обязательных поля каждого",
   indicators:["A – предшествующая ситуация","B – конкретное наблюдаемое действие","C – последовавшая реакция среды","Повторяемость и условия, требующие дополнительного наблюдения"],
   guideSteps:[
    "Заранее определите, какое конкретное и наблюдаемое действие будет регистрироваться. Формулировка должна исключать оценочные ярлыки.",
    "Выберите допустимые ситуации наблюдения. Соблюдайте добровольность, права участника и безопасность; не создавайте намеренно стрессовые ситуации.",
    "При появлении выбранного действия запишите A – что произошло непосредственно перед ним (задание, переход, требование, звук, взаимодействие).",
    "В поле B опишите само действие простыми наблюдаемыми словами, без предполагаемой причины или диагноза.",
    "В поле C укажите, что произошло непосредственно после действия: реакции окружающих, изменение задачи, доступную поддержку и другие события.",
    "Повторите запись в разных допустимых ситуациях и обратите внимание на повторяющиеся последовательности. Гипотезы о функции поведения требуют дополнительной функциональной оценки, а не автоматического вывода из ABC."
   ],
   limitations:"ABC – способ функционального наблюдения, а не самостоятельный диагностический тест. Последовательность A-B-C показывает контекст, но сама по себе не устанавливает функцию, намерение, расстройство или причину поведения. Записи специалиста не должны заменять многоисточниковую оценку и этически обоснованную поддержку."
  }
 ];
 const gasLevels=[["-2","Значительно ниже ожидаемого"],["-1","Ниже ожидаемого"],["0","Ожидаемый результат"],["+1","Выше ожидаемого"],["+2","Значительно выше ожидаемого"]];
 const byId=new Map(definitions.map(m=>[m.id,m]));
 const states=new Map();
 function get(d){
  if(!states.has(d.toolkitId))states.set(d.toolkitId,d.toolkitId==="special-gas-01"?
   {goal:"",context:"",period:"",levels:["","","","",""],selected:"",evidence:""}:
   {context:"",events:[{a:"",b:"",c:""}]});
  return states.get(d.toolkitId);
 }
 function abcEntries(s){return s.events.filter(x=>[x.a,x.b,x.c].some(v=>String(v).trim()));}
 function complete(d){
  const s=get(d);
  if(d.toolkitId==="special-gas-01")return !!(s.goal.trim()&&s.levels.every(x=>x.trim())&&s.selected!==""&&s.evidence.trim());
  const entries=abcEntries(s);return entries.length>0&&entries.every(x=>x.a.trim()&&x.b.trim()&&x.c.trim());
 }
 for(const m of definitions){
  window.PSY_FULL_METHODS[m.title]={
   workflow:"specialToolkit",toolkitId:m.id,author:m.author,age:m.ageLabel,kind:m.format,
   count:m.count,goal:m.goal,indicatorsTitle:"Что фиксируется",indicators:m.indicators,
   source:m.source,calculator:true,interpret:m.limitations,
   scoring:m.id==="special-gas-01"?"Пять заранее определенных порядковых уровней одной цели; без T-балла.":"Описательная регистрация A-B-C без диагностической шкалы."
  };
 }
 function portfolio(d){
  const m=byId.get(d.toolkitId);
  const rows=[["Методика",m.title],["Автор / происхождение",m.author],["Возраст",m.ageLabel],["Вид",m.format],["Объем",m.count]];
  return '<section class="psy-portfolio-reference psy-portfolio-unified">'+
   '<h3>Общие сведения</h3><div class="psy-profile-lines">'+rows.map(([k,v])=>'<div class="psy-profile-row"><strong>'+esc(k)+'</strong><span>'+esc(v)+'</span></div>').join("")+'</div>'+
   '<h3>Цель</h3><p class="psy-profile-description">'+esc(m.goal)+'</p>'+
   '<h3>Показатели и регистрация</h3><div class="psy-profile-indicators">'+m.indicators.map((x,i)=>'<div class="psy-profile-indicator" data-profile-index="'+i+'"><span>'+esc(x)+'</span></div>').join("")+'</div>'+
   '<h3>Первоисточники</h3><p><a href="'+esc(m.source)+'" target="_blank" rel="noopener noreferrer">Методические рекомендации</a></p>'+
   '<p><a href="'+esc(m.source2)+'" target="_blank" rel="noopener noreferrer">Дополнительный источник</a></p>'+
   '<h3>Ограничения</h3><p class="psy-profile-description">'+esc(m.limitations)+'</p></section>';
 }
 function guideContent(m){
  const gas=m.id==="special-gas-01";
  return '<div class="psy-special-guide"><h3>Назначение и возраст</h3><p>'+esc(m.goal)+'</p><p><b>Автор / происхождение:</b> '+esc(m.author)+'</p><p>'+esc(m.ageLabel)+'. Возрастные нормативы для этой рабочей формы не задаются.</p>'+
   '<h3>Условия и материалы</h3><p>Спокойная доступная ситуация, согласованный способ коммуникации, протокол специалиста; без принудительного предъявления или изменения нормативов других тестов.</p>'+
   '<h3>Инструкция участнику</h3><blockquote class="kid-instruction">'+(gas?'Мы выберем важную для вас задачу и заранее договоримся, какие результаты будем замечать. Вы можете предложить свою цель, попросить поддержку или время на ответ.':'Продолжайте заниматься привычным делом. Я буду отмечать условия, которые помогают. Если нужна помощь или пауза, скажите или покажите удобным способом.')+'</blockquote>'+
   '<h3>Порядок проведения</h3><ol>'+m.guideSteps.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol>'+
   (gas?'<h3>Ключ и оценка отдельной цели</h3><div class="special-toolkit-level-list">'+gasLevels.map(([n,v])=>'<p><strong>'+esc(n)+'</strong> – '+esc(v)+'</p>').join("")+'</div><p>Оценка действительна лишь при заранее описанных пяти индивидуальных уровнях и наличии фактического наблюдения. Значение 0 – ожидаемый уровень, а не отсутствие данных.</p>':
   '<h3>Регистрация</h3><p>Для каждого отдельного события последовательно записываются A – предшествующая ситуация, B – наблюдаемое действие, C – последствия. Незаполненная запись не трактуется как отсутствие поведения. Одинаковые наименования полей не являются шкалой баллов.</p>')+
   '<h3>Обработка и интерпретация</h3><p>'+(gas?'Выведите достигнутый уровень для одной цели и соответствующее ему заранее сформулированное описание; не усредняйте результаты и не рассчитывайте T-балл.':'Сопоставляйте словесные записи нескольких наблюдений, отмечайте контекст и проверяемые повторяющиеся последовательности. Не выводите автоматически предполагаемую функцию поведения.')+'</p>'+
   '<h3>Ограничения</h3><p>'+esc(m.limitations)+'</p>'+
   '<h3>Источники</h3><p><a href="'+esc(m.source)+'" target="_blank" rel="noopener noreferrer">Основное описание</a> · <a href="'+esc(m.source2)+'" target="_blank" rel="noopener noreferrer">Дополнительный источник</a></p></div>';
 }
 function instruction(d){const m=byId.get(d.toolkitId);return '<div class="psy-common-guide-head"><h3>Методика / руководство</h3><div class="psy-common-guide-actions"><button class="btn" type="button" data-toolkit-print="guide">Без бланка</button><button class="btn primary" type="button" data-toolkit-print="combined">С бланком</button></div></div>'+guideContent(m);}
 function blank(d,values){
  const m=byId.get(d.toolkitId),gas=d.toolkitId==="special-gas-01";
  if(gas){
   const s=values||{goal:"",context:"",period:"",levels:["","","","",""],selected:"",evidence:""};
   return '<h3>Протокол специалиста – одна цель GAS</h3><p>Согласованная цель: '+(values?esc(s.goal):"____________________________________________________________")+'</p>'+
    '<p>Контекст и условия: '+(values?esc(s.context):"____________________________________________________________")+'</p>'+
    '<p>Дата / период оценки: '+(values?esc(s.period):"____________________________")+'</p>'+
    '<table class="special-toolkit-table"><thead><tr><th>Уровень</th><th>Заранее согласованное описание наблюдаемого результата</th></tr></thead><tbody>'+
    gasLevels.map(([v,label],i)=>'<tr><td><b>'+esc(v)+'</b><span class="special-toolkit-muted">'+esc(label)+'</span></td><td>'+(values?esc(s.levels[i]):'<div class="special-toolkit-write-lines"></div>')+'</td></tr>').join("")+'</tbody></table>'+
    '<p>Выбранный уровень: '+(values?esc(s.selected):"________________")+'</p><p>Фактическое основание: '+(values?esc(s.evidence):"________________________________________________")+'</p>';
  }
  const events=values?abcEntries(values):Array.from({length:4},()=>({a:"",b:"",c:""}));
  return '<h3>Протокол ABC-наблюдения</h3><p>Условия: '+(values?esc(values.context):"_______________________________________________________")+'</p>'+
   '<table class="special-toolkit-table abc"><thead><tr><th>№</th><th>A – до события</th><th>B – наблюдаемое действие</th><th>C – после события</th></tr></thead><tbody>'+
   events.map((e,i)=>'<tr><td>'+(i+1)+'</td>'+["a","b","c"].map(k=>'<td>'+(values?esc(e[k]):'<div class="special-toolkit-write-lines"></div>')+'</td>').join("")+'</tr>').join("")+'</tbody></table>'+
   '<p>Наблюдаемые повторения и дополнительные условия: ___________________________________________</p>';
 }
 function materials(d){return '<div class="psy-common-guide-head"><h3>Протокол специалиста</h3><div class="psy-common-guide-actions"><button class="btn primary" type="button" data-toolkit-print="blank">Посмотреть и распечатать</button></div></div><section class="special-toolkit-blank">'+blank(d,null)+'</section><p class="privacy-inline">Рабочий бланк заполняет специалист. Не вводите ФИО и другие персональные сведения на публичном сайте.</p>';}
 function gasReport(s){
  if(!(s.goal.trim()&&s.levels.every(x=>x.trim())&&s.selected!==""&&s.evidence.trim()))return '<p>Заполните цель, пять индивидуальных описаний, выбранный уровень и наблюдаемое основание. Ноль – допустимый уровень результата, но пустое поле не равно нулю.</p>';
  const idx=gasLevels.findIndex(x=>x[0]===s.selected),info=gasLevels[idx];
  return '<h3>Результат одной индивидуальной цели</h3><p><b>Достигнутый уровень: '+esc(s.selected)+' – '+esc(info[1])+'.</b></p>'+
   '<p><b>Цель:</b> '+esc(s.goal)+'</p><p><b>Описание достигнутого уровня:</b> '+esc(s.levels[idx])+'</p>'+
   '<p><b>Основание:</b> '+esc(s.evidence)+'</p><p>Значение – порядковый результат одной цели, не процент, не норматив и не T-балл.</p>';
 }
 function abcReport(s){
  const entries=abcEntries(s);
  if(!entries.length||!entries.every(x=>x.a.trim()&&x.b.trim()&&x.c.trim()))return '<p>Для результата требуется минимум одно событие с заполненными полями A, B и C. Частично заполненную запись завершите или удалите.</p>';
  return '<h3>Зарегистрированные события: '+entries.length+'</h3>'+
   entries.map((e,i)=>'<p><b>Событие '+(i+1)+':</b> перед действием – '+esc(e.a)+'; действие – '+esc(e.b)+'; после него – '+esc(e.c)+'.</p>').join("")+
   '<p>Повторяющиеся обстоятельства и возможные объяснения обсуждаются специалистом после дополнительных наблюдений; автоматическая функция поведения не определяется.</p>';
 }
 function calculator(d){
  const s=get(d),gas=d.toolkitId==="special-gas-01",done=complete(d);
  const head='<section class="special-toolkit-calc"><div class="special-result-head"><div><h3>Обработка результатов</h3><p>'+(gas?'Один индивидуальный результат по пяти уровням':'Описательная обработка наблюдений A-B-C')+'</p></div><span class="special-status '+(done?'complete':'pending')+'">'+(done?'Данные заполнены':'Требуется заполнение')+'</span></div>';
  const gasForm=gas?'<div class="special-toolkit-fields"><label>Наблюдаемая цель<textarea data-toolkit-field="goal" rows="2" placeholder="Одно конкретное действие, а не диагноз">'+esc(s.goal)+'</textarea></label>'+
   '<label>Условия и способ поддержки<input data-toolkit-field="context" value="'+esc(s.context)+'" placeholder="Без персональных данных"></label>'+
   '<label>Период оценки<input data-toolkit-field="period" value="'+esc(s.period)+'" placeholder="Например, несколько недель"></label></div>'+
   '<h4>Заранее описанные уровни одной цели</h4><div class="special-toolkit-levels">'+gasLevels.map(([n,label],i)=>'<label><strong>'+esc(n)+' – '+esc(label)+'</strong><textarea rows="2" data-toolkit-level="'+i+'" placeholder="Наблюдаемый результат на этом уровне">'+esc(s.levels[i])+'</textarea></label>').join("")+'</div>'+
   '<label class="special-toolkit-outcome">Достигнутый уровень<select data-toolkit-field="selected"><option value="">Еще не оценено</option>'+gasLevels.map(([n,label])=>'<option value="'+n+'" '+(s.selected===n?'selected':'')+'>'+esc(n)+' – '+esc(label)+'</option>').join("")+'</select></label>'+
   '<label class="special-toolkit-outcome">Фактическое наблюдение, подтверждающее выбор<textarea rows="3" data-toolkit-field="evidence" placeholder="Опишите конкретный результат">'+esc(s.evidence)+'</textarea></label>':"";
  const abcForm=gas?'':'<label class="special-toolkit-outcome">Контекст наблюдения (без персональных данных)<textarea rows="2" data-toolkit-field="context" placeholder="Условия и доступная поддержка">'+esc(s.context)+'</textarea></label>'+
   '<div class="special-toolkit-events">'+s.events.map((e,i)=>'<fieldset class="special-toolkit-event"><legend>Событие '+(i+1)+'</legend>'+
   '<label>A – что было непосредственно до действия<textarea rows="2" data-toolkit-event="'+i+'" data-part="a" placeholder="Наблюдаемая ситуация">'+esc(e.a)+'</textarea></label>'+
   '<label>B – само наблюдаемое действие<textarea rows="2" data-toolkit-event="'+i+'" data-part="b" placeholder="Что фактически сделал участник">'+esc(e.b)+'</textarea></label>'+
   '<label>C – что произошло после действия<textarea rows="2" data-toolkit-event="'+i+'" data-part="c" placeholder="Реакции среды и доступная поддержка">'+esc(e.c)+'</textarea></label>'+
   (s.events.length>1?'<button type="button" class="btn" data-toolkit-remove="'+i+'">Удалить событие</button>':"")+'</fieldset>').join("")+'</div>'+
   '<div class="special-toolkit-event-actions"><button class="btn" type="button" id="toolkitAddEvent" '+(s.events.length>=6?'disabled':'')+'>Добавить событие</button></div>';
  return head+(gas?gasForm:abcForm)+
   '<div class="special-summary" id="toolkitSummary">'+(gas?gasReport(s):abcReport(s))+'</div>'+
   '<div class="special-result-actions"><button type="button" class="btn" id="toolkitClear">Очистить записи</button><button type="button" class="btn primary" id="toolkitPrintResult" '+(!done?'disabled':'')+'>Печать результата</button></div></section>';
 }
 function updateFooter(d){
  const b=document.getElementById("specialFooterStatus");if(!b)return;
  const done=complete(d);b.className="psy-special-footer-state "+(done?"complete":"pending");
  b.textContent=done?"Данные заполнены":"Требуется заполнение";
 }
 function bind(d){
  const body=document.getElementById("modalBody");if(!body)return;
  const s=get(d),gas=d.toolkitId==="special-gas-01";
  const update=()=>{
   const done=complete(d),status=body.querySelector(".special-status");
   if(status){status.className="special-status "+(done?"complete":"pending");status.textContent=done?"Данные заполнены":"Требуется заполнение";}
   const result=body.querySelector("#toolkitSummary");if(result)result.innerHTML=gas?gasReport(s):abcReport(s);
   const printButton=body.querySelector("#toolkitPrintResult");if(printButton)printButton.disabled=!done;
   updateFooter(d);
  };
  body.querySelectorAll("[data-toolkit-field]").forEach(el=>el.addEventListener("input",()=>{s[el.dataset.toolkitField]=el.value;update();}));
  body.querySelectorAll("[data-toolkit-level]").forEach(el=>el.addEventListener("input",()=>{s.levels[Number(el.dataset.toolkitLevel)]=el.value;update();}));
  body.querySelectorAll("[data-toolkit-event]").forEach(el=>el.addEventListener("input",()=>{s.events[Number(el.dataset.toolkitEvent)][el.dataset.part]=el.value;update();}));
  const rerender=()=>{body.innerHTML=calculator(d);bind(d);};
  body.querySelector("#toolkitAddEvent")?.addEventListener("click",()=>{if(s.events.length>=6)return;s.events.push({a:"",b:"",c:""});rerender();});
  body.querySelectorAll("[data-toolkit-remove]").forEach(el=>el.addEventListener("click",()=>{if(s.events.length<=1)return;s.events.splice(Number(el.dataset.toolkitRemove),1);rerender();}));
  body.querySelector("#toolkitClear")?.addEventListener("click",()=>{if(!window.confirm("Очистить все введенные данные выбранной методики?"))return;states.delete(d.toolkitId);rerender();});
  body.querySelector("#toolkitPrintResult")?.addEventListener("click",()=>print(d,"result"));
  body.querySelectorAll("[data-toolkit-print]").forEach(el=>el.addEventListener("click",()=>print(d,el.dataset.toolkitPrint)));
 }
 function print(d,mode){
  if(mode==="result"&&!complete(d))return;
  const m=byId.get(d.toolkitId),s=get(d);
  const guide='<section><h2>'+esc(m.title)+'</h2>'+guideContent(m)+'</section>';
  const form='<section class="print-blank">'+blank(d,mode==="result"?s:null)+'</section>';
  const summary=mode==="result"?'<section>'+(d.toolkitId==="special-gas-01"?gasReport(s):abcReport(s))+'</section>':"";
  const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>'+esc(m.title)+'</title>'+
   '<style>@page{size:A4 portrait;margin:16mm}*{box-sizing:border-box}body{font:10.5pt/1.45 Arial,sans-serif;color:#222}h2{font-size:16pt}h3{font-size:12pt;margin:15px 0 7px;break-after:avoid}p,li{overflow-wrap:anywhere}li{margin:5px 0}table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:9pt}th,td{border:1px solid #777;padding:9px;vertical-align:top;overflow-wrap:anywhere}tr{break-inside:avoid}.abc th:first-child,.abc td:first-child{width:7%}.print-blank:not(:first-child){break-before:page}.special-toolkit-write-lines{height:44px}.special-toolkit-muted{display:block;font-size:8pt}.psy-special-guide{max-width:100%}button{display:none}</style></head><body>'+
   (mode==="guide"||mode==="combined"?guide:"")+(mode==="guide"?"":form)+summary+'</body></html>';
  const frame=document.createElement("iframe");frame.title="Печать методики";frame.style.cssText="position:fixed;width:0;height:0;border:0";document.body.appendChild(frame);
  frame.onload=()=>{try{frame.contentWindow.focus();frame.contentWindow.print();}finally{setTimeout(()=>frame.remove(),1800);}};
  frame.srcdoc=html;
 }
 window.PSY_SPECIAL_TOOLKIT={methods:definitions,portfolio,instruction,materials,calculator,updateFooter,bind,print,complete};
})();