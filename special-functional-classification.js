"use strict";
(function(){
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const levels=["I","II","III","IV","V"];
 const records=[
  {
   id:"special-macs-2006",title:"MACS – классификация ручных навыков при ДЦП",
   author:"A.-C. Eliasson, L. Krumlinde-Sundholm, B. Rösblad, E. Beckung, M. Arner, A.-M. Öhrvall, P. Rosenbaum (2006)",
   group:"Диагностика и наблюдение",topic:"Ручная функция при ДЦП",
   ages:["Дошкольники","Школьники"],ageLabel:"4-18 лет, дети с ДЦП; одна основная опубликованная редакция",
   ageMin:4,ageMax:18,format:"Функциональная классификация, пять уровней",
   goal:"Классифицировать привычные способы обращения ребенка с предметами в повседневной жизни, а не максимальную ловкость в специальном задании.",
   source:"https://www.macs.nu/files/MACS_English_2010.pdf",
   article:"https://pubmed.ncbi.nlm.nih.gov/16780622/",
   variants:[{id:"macs-original",label:"MACS, авторская английская форма, 4-18 лет",url:"https://www.macs.nu/files/MACS_English_2010.pdf"}],
   criteria:["Типичные действия с предметами при игре, приеме пищи, одевании и занятиях","Нужная помощь и изменение среды","Согласованные сведения от взрослого, знающего ребенка","Выбор одного авторского уровня I-V"],
   steps:[
    "Убедитесь в подтвержденной области применения: дети с ДЦП 4-18 лет. Для детей младше 4 лет нужна отдельная Mini-MACS.",
    "Вместе с родителями и педагогами опишите, как ребенок обычно обращается с предметами по возрасту в привычных домашних и образовательных ситуациях.",
    "Не проводите единичную пробу на максимальную способность как замену наблюдения и не оценивайте каждую руку отдельной шкалой MACS.",
    "Откройте оригинальный буклет MACS и сопоставьте повседневные навыки с полными описаниями пяти уровней и различиями между соседними уровнями.",
    "Отметьте выбранный уровень I-V и конкретный пример повседневной деятельности, который подтверждает выбранную классификацию.",
    "Сохраните ссылку на использованную версию; при расхождении мнений разных информантов обсудите фактические условия, не усредняйте уровни."
   ],
   interpret:"MACS имеет пять порядковых уровней I-V. Разница между соседними уровнями не равна интервалу баллов. Уровень описывает привычную самостоятельность при использовании предметов; не является диагнозом, IQ, оценкой отдельной руки или доказательством эффективности коррекции.",
   limits:"Применять только для классификации мануальных навыков при ДЦП в указанной возрастной группе. Опубликованная англоязычная форма используется как первоисточник; утвержденная русская версия этого буклета здесь не заявляется. Не вводить самодельные числовые нормы."
  },
  {
   id:"special-mini-macs",title:"Mini-MACS – ручные навыки детей раннего возраста с ДЦП",
   author:"A.-C. Eliasson, A. Ullenhag, U. Wahlström, L. Krumlinde-Sundholm (2017)",
   group:"Диагностика и наблюдение",topic:"Ручная функция при ДЦП",
   ages:["Дошкольники"],ageLabel:"1-4 года, дети с ДЦП или признаками ДЦП; отдельная ранняя форма",
   ageMin:1,ageMax:4,format:"Функциональная классификация раннего возраста, пять уровней",
   goal:"Описать привычные навыки обращения с предметами и игрушками у маленьких детей с ДЦП с учетом обычной помощи.",
   source:"https://macs.nu/files/Mini-MACS_English_2016.pdf",
   article:"https://pubmed.ncbi.nlm.nih.gov/27273427/",
   variants:[{id:"mini-original",label:"Mini-MACS, авторская английская форма, 1-4 года",url:"https://macs.nu/files/Mini-MACS_English_2016.pdf"}],
   criteria:["Обращение с возрастными игрушками и предметами","Самостоятельность и помощь в привычных ситуациях","Оценка целостной деятельности обеими руками","Один порядковый уровень Mini-MACS I-V"],
   steps:[
    "Убедитесь, что ребенок относится к возрастной группе 1-4 года и есть ДЦП или соответствующие признаки. Для старших детей применяют основной MACS.",
    "Обсудите с хорошо знакомым взрослым привычные действия ребенка с игрушками, предметами для приема пищи и одевания.",
    "Оценивайте типичную самостоятельную деятельность в повседневной среде, а не лучшее выполнение тестового задания.",
    "Откройте оригинальную Mini-MACS и прочитайте описания всех пяти уровней с различиями соседних уровней.",
    "Зафиксируйте выбранный уровень I-V, возрастную группу и пример наблюдаемого действия с указанием нужной помощи.",
    "Не применяйте порядковый уровень как чувствительный показатель изменений после занятия или лечения; при необходимости используйте отдельные оценочные инструменты."
   ],
   interpret:"Mini-MACS – пять порядковых уровней описания привычной ручной функции маленьких детей. Это отдельная классификация, не набор баллов и не укороченный ключ взрослой MACS. Уровень не является нормой развития или самостоятельным заключением о тяжести ДЦП.",
   limits:"Возрастная форма 1-4 года относится к детям с ДЦП или признаками ДЦП. На сайте используется исходное англоязычное руководство, без заявления об официальной русской адаптации и без переноса уровней из другой редакции."
  },
  {
   id:"special-cfcs-2011",title:"CFCS – классификация функциональной коммуникации при ДЦП",
   author:"M. J. C. Hidecker, N. Paneth, P. Rosenbaum и соавторы (2011)",
   group:"Диагностика и наблюдение",topic:"Коммуникация при ДЦП",
   ages:["Дошкольники","Школьники","Взрослые"],
   ageLabel:"Дети, подростки и взрослые с ДЦП; единый классификатор без возрастных тестовых норм",
   ageMin:null,ageMax:null,format:"Функциональная классификация коммуникации, пять уровней",
   goal:"Описать привычную эффективность передачи и понимания сообщений в общении со знакомыми и незнакомыми партнерами.",
   source:"https://cfcs.us/wp-content/uploads/2018/11/CFCS_English_CP.pdf",
   article:"https://pubmed.ncbi.nlm.nih.gov/21707596/",
   variants:[{id:"cfcs-original",label:"CFCS, авторская англоязычная форма (2011)",url:"https://cfcs.us/wp-content/uploads/2018/11/CFCS_English_CP.pdf"},
             {id:"cfcs-ru-guidelines",label:"Русское описание CFCS в клинических рекомендациях Минздрава",url:"https://www.consultant.ru/document/cons_doc_LAW_519128/8f748e771b6a10b8bef983739810f5aa9d988b3e/"}],
   criteria:["Передача сообщения и понимание полученного","Успешность и скорость общения","Партнеры: знакомые и незнакомые","Доступные средства коммуникации, включая альтернативные"],
   steps:[
    "Уточните, что метод используется для описания функциональной коммуникации человека с ДЦП, а не для диагностики аутизма или оценки интеллекта.",
    "Соберите сведения о привычном общении дома, в образовательном учреждении и в сообществе. При возможности включите самого человека.",
    "Учитывайте как устные, так и альтернативные способы общения: жесты, карточки, коммуникаторы и устройства с синтезом речи.",
    "Сопоставьте обычную эффективность отправки и получения сообщений, скорость обмена и успешность общения с привычными и незнакомыми людьми.",
    "Откройте оригинальную CFCS и выберите один из пяти уровней по полным авторским определениям; при необходимости обратитесь к русскому клиническому описанию.",
    "Запишите выбранный уровень I-V и конкретные условия общения, а также источники сведений. Не пытайтесь вычислять средний уровень между разными участниками."
   ],
   interpret:"CFCS классифицирует эффективность повседневной коммуникации на пять порядковых уровней I-V по роли отправителя/получателя, темпу и знакомству партнера. Учитываются средства альтернативной коммуникации. Уровень не оценивает IQ, причину трудностей или точную степень развития речи.",
   limits:"CFCS опубликована и валидизирована для функциональной коммуникации людей с ДЦП. Полные определения надо смотреть в первоисточнике; русское описание в клинических рекомендациях помогает ориентироваться, но не является самостоятельно заявленной валидизированной русской тестовой адаптацией."
  }
 ];
 const methods=new Map(records.map(m=>[m.id,m])),selected=new Map(records.map(m=>[m.id,m.variants[0].id])),states=new Map();
 const get=m=>{if(!states.has(m.id))states.set(m.id,{age:"",level:"",context:"",example:"",confirmed:false});return states.get(m.id);};
 const chosen=m=>m.variants.find(v=>v.id===selected.get(m.id))||m.variants[0];
 const ageValid=(m,s)=>{
  if(m.ageMin===null)return true;
  if(!/^\d+$/.test(String(s.age).trim()))return false;
  const n=Number(s.age);return n>=m.ageMin&&n<=m.ageMax;
 };
 const valid=(m,s)=>ageValid(m,s)&&levels.includes(s.level)&&s.context.trim().length>0&&s.example.trim().length>0&&s.confirmed;
 const report=(m,s)=>{
  if(!valid(m,s))return '<p>Для регистрации укажите применимый возраст, подтвержденный оригиналом уровень, условия и пример наблюдения; подтвердите сверку с авторской редакцией. Пустое поле не приравнивается к уровню V.</p>';
  return '<h3>Зарегистрированная классификация</h3><p><b>'+esc(m.title)+'</b></p>'+
   '<p>Выбранный по оригиналу уровень: <strong>'+esc(s.level)+'</strong></p>'+
   (m.ageMin!==null?'<p>Возраст: '+esc(s.age)+' полных лет.</p>':'')+
   '<p>Условия и информанты: '+esc(s.context)+'</p><p>Подтверждающее наблюдение: '+esc(s.example)+'</p>'+
   '<p>'+esc(m.interpret)+'</p><p>Это запись выбранного авторского уровня, не автоматическое диагностическое заключение.</p>';
 };
 const link=(url,label)=>'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer" class="btn primary">'+esc(label)+'</a>';
 function portfolio(d){
  const m=methods.get(d.functionalId);return '<section class="psy-portfolio-reference psy-portfolio-unified">'+
   '<h3>Общие сведения</h3><div class="psy-profile-lines">'+[
    ["Название",m.title],["Оригинальные авторы",m.author],["Возрастная редакция",m.ageLabel],["Тип",m.format],
    ["Число уровней","Пять уровней I-V (порядковая классификация)"]
   ].map(([a,b])=>'<div class="psy-profile-row"><strong>'+esc(a)+'</strong><span>'+esc(b)+'</span></div>').join("")+'</div>'+
   '<h3>Цель</h3><p class="psy-profile-description">'+esc(m.goal)+'</p>'+
   '<h3>Области наблюдения</h3><div class="psy-profile-indicators">'+m.criteria.map(v=>'<div class="psy-profile-indicator"><span>'+esc(v)+'</span></div>').join("")+'</div>'+
   '<h3>Подтвержденные формы и источники</h3>'+m.variants.map(v=>'<p>'+esc(v.label)+'</p>').join("")+
   '<p>'+link(m.source,"Открыть оригинальную методику")+'</p><p>'+link(m.article,"Научная публикация")+'</p>'+
   '<h3>Ограничения</h3><p>'+esc(m.limits)+'</p></section>';
 }
 function guide(m){
  return '<section class="psy-special-guide"><h3>Цель и возрастная редакция</h3><p>'+esc(m.goal)+'</p><p>'+esc(m.ageLabel)+'</p>'+
   '<h3>Авторы и первоисточник</h3><p>'+esc(m.author)+'</p>'+
   '<h3>Материалы и подготовка</h3><p>Полный авторский классификатор из официального источника, сведения о привычной деятельности из нескольких ситуаций, беседа с человеком или знакомым информантом. Новых стимулов и тестовых заданий не требуется.</p>'+
   '<h3>Инструкция обследуемому</h3><p>Дословной стандартизированной инструкции в виде задания обследуемому у этих классификационных систем нет. Специалист знакомится с авторским руководством и собирает сведения о привычном функционировании. Не предъявляйте самодельный тест.</p>'+
   '<h3>Порядок проведения</h3><ol>'+m.steps.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol>'+
   '<h3>Ключ и регистрация</h3><p>Выберите один уровень I-V строго по полному описанию и разграничениям между соседними уровнями в оригинале. Коды I-V – порядковые категории; числового суммирования, среднего балла или норм возрастного теста нет. Регистрация в Метоларии сохраняется только в памяти открытой страницы.</p>'+
   '<h3>Интерпретация</h3><p>'+esc(m.interpret)+'</p><h3>Ограничения</h3><p>'+esc(m.limits)+'</p>'+
   '<h3>Подтвержденный источник</h3><p>'+link(m.source,"Оригинальное описание уровней")+'</p></section>';
 }
 function instruction(d){
  const m=methods.get(d.functionalId);return '<div class="psy-common-guide-head"><h3>Методика / руководство</h3>'+
   '<div class="psy-common-guide-actions"><button type="button" class="btn" data-functional-print="guide">Без бланка</button>'+
   '<button type="button" class="btn primary" data-functional-print="combined">С бланком</button></div></div>'+guide(m);
 }
 function blank(m,s){
  return '<div class="psy-functional-blank"><h3>Протокол специалиста</h3><p><b>'+esc(m.title)+'</b></p>'+
   '<p>Редакция: '+esc(chosen(m).label)+'</p>'+
   '<p>Возраст (полных лет): '+(s?esc(s.age):"________________________")+'</p>'+
   '<p>Условия и информанты: '+(s?esc(s.context):"____________________________________________________________")+'</p>'+
   '<p>Выбранный по оригиналу уровень: '+(s?esc(s.level):"I / II / III / IV / V (подчеркнуть)")+'</p>'+
   '<p>Пример повседневного действия или общения: '+(s?esc(s.example):"____________________________________________________________")+'</p>'+
   '<p>Первичное описание уровня проверено по авторскому буклету: '+(s?"Да":"________")+'</p>'+
   '<p>Данный протокол только регистрирует выбранную классификацию. Все определения уровней приведены в оригинальном документе автора.</p></div>';
 }
 function materials(d){
  const m=methods.get(d.functionalId);
  return '<div class="psy-common-guide-head"><h3>Бланк специалиста</h3><div class="psy-common-guide-actions"><button type="button" class="btn primary" data-functional-print="blank">Распечатать А4</button></div></div>'+
   '<p>Полные пять описаний уровней и критерии выбора находятся в авторском документе: '+link(m.source,"Открыть оригинал")+'</p>'+
   (m.variants.length>1?'<label class="psy-special-source-choice">Подтвержденная версия<select data-functional-version="'+esc(m.id)+'">'+m.variants.map(v=>'<option value="'+esc(v.id)+'" '+(chosen(m).id===v.id?"selected":"")+'>'+esc(v.label)+'</option>').join("")+'</select></label>':"")+
   '<div class="psy-special-versions" id="functionalSourceLink"><p>'+link(chosen(m).url,"Открыть выбранную редакцию")+'</p></div>'+
   blank(m,null);
 }
 function calculator(d){
  const m=methods.get(d.functionalId),s=get(m),done=valid(m,s);
  const age=m.ageMin!==null?'<label>Возраст в полных годах ('+m.ageMin+'-'+m.ageMax+')<input type="number" min="'+m.ageMin+'" max="'+m.ageMax+'" step="1" data-functional-field="age" value="'+esc(s.age)+'"></label>':'';
  return '<section class="special-toolkit-calc"><div class="special-result-head"><div><h3>Регистрация уровня по оригиналу</h3><p>Классификация I-V без балльного подсчета</p></div><span class="special-status '+(done?'complete':'pending')+'">'+(done?'Данные заполнены':'Требуется заполнение')+'</span></div>'+
   '<div class="special-toolkit-fields">'+age+
   '<label>Условия и информанты<textarea rows="2" data-functional-field="context" placeholder="Ситуации и источники информации, без персональных данных">'+esc(s.context)+'</textarea></label>'+
   '<label>Уровень, выбранный по оригинальному классификатору<select data-functional-field="level"><option value="">Еще не определен</option>'+
   levels.map(v=>'<option value="'+v+'" '+(s.level===v?"selected":"")+'>'+v+'</option>').join("")+'</select></label>'+
   '<label>Пример повседневного функционирования<textarea rows="3" data-functional-field="example" placeholder="Наблюдаемые действия и условия помощи">'+esc(s.example)+'</textarea></label>'+
   '<label class="psy-functional-confirm"><input type="checkbox" data-functional-field="confirmed" '+(s.confirmed?"checked":"")+'><span>Я сравнил наблюдения с полным авторским описанием уровней I-V</span></label></div>'+
   '<p>'+link(chosen(m).url,"Проверить описания уровней")+'</p>'+
   '<div class="special-summary" id="functionalSummary">'+report(m,s)+'</div>'+
   '<div class="special-result-actions"><button class="btn" type="button" id="functionalClear">Очистить данные</button>'+
   '<button class="btn primary" type="button" id="functionalPrintResult" '+(done?"":"disabled")+'>Печать результата</button></div></section>';
 }
 function complete(d){const m=methods.get(d.functionalId);return valid(m,get(m));}
 function updateFooter(d){
  const e=document.getElementById("specialFooterStatus");if(!e)return;
  const done=complete(d);e.className="psy-special-footer-state "+(done?"complete":"pending");e.textContent=done?"Данные заполнены":"Требуется заполнение";
 }
 function bind(d){
  const m=methods.get(d.functionalId),s=get(m),body=document.getElementById("modalBody");if(!body)return;
  const refresh=()=>{
   const done=valid(m,s),flag=body.querySelector(".special-status");
   if(flag){flag.className="special-status "+(done?"complete":"pending");flag.textContent=done?"Данные заполнены":"Требуется заполнение";}
   const result=body.querySelector("#functionalSummary");if(result)result.innerHTML=report(m,s);
   const button=body.querySelector("#functionalPrintResult");if(button)button.disabled=!done;updateFooter(d);
  };
  body.querySelectorAll("[data-functional-field]").forEach(el=>{
   const fn=()=>{s[el.dataset.functionalField]=el.type==="checkbox"?el.checked:el.value;refresh();};
   el.addEventListener(el.type==="checkbox"||el.tagName==="SELECT"?"change":"input",fn);
  });
  body.querySelectorAll("[data-functional-version]").forEach(el=>el.addEventListener("change",()=>{
   const next=m.variants.find(v=>v.id===el.value);if(!next)return;selected.set(m.id,next.id);
   const div=body.querySelector("#functionalSourceLink");if(div)div.innerHTML='<p>'+link(next.url,"Открыть выбранную редакцию")+'</p>';
  }));
  body.querySelectorAll("[data-functional-print]").forEach(el=>el.addEventListener("click",()=>print(d,el.dataset.functionalPrint)));
  body.querySelector("#functionalPrintResult")?.addEventListener("click",()=>print(d,"result"));
  body.querySelector("#functionalClear")?.addEventListener("click",()=>{
   if(!window.confirm("Удалить введенные данные этой классификации?"))return;
   states.delete(m.id);body.innerHTML=calculator(d);bind(d);updateFooter(d);
  });
 }
 function print(d,mode){
  const m=methods.get(d.functionalId),s=get(m);if(mode==="result"&&!valid(m,s))return;
  const guideHTML='<section><h2>'+esc(m.title)+'</h2>'+guide(m)+'</section>';
  const form='<section class="print-blank">'+blank(m,mode==="result"?s:null)+'</section>';
  const outcome=mode==="result"?'<section>'+report(m,s)+'</section>':"";
  const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>'+esc(m.title)+'</title>'+
   '<style>@page{size:A4 portrait;margin:16mm}*{box-sizing:border-box}body{font:10.5pt/1.44 Arial,sans-serif;color:#202020}h2{font-size:16pt}h3{font-size:11.5pt;break-after:avoid}p,li{overflow-wrap:anywhere}li{margin:5px 0}a{color:#222}.print-blank:not(:first-child){break-before:page}button{display:none}</style></head><body>'+
   (mode==="guide"||mode==="combined"?guideHTML:"")+(mode==="guide"?"":form)+outcome+'</body></html>';
  const frame=document.createElement("iframe");frame.style.cssText="position:fixed;width:0;height:0;border:0";frame.title="Печать протокола классификации";document.body.appendChild(frame);
  frame.onload=()=>{try{frame.contentWindow.focus();frame.contentWindow.print();}finally{setTimeout(()=>frame.remove(),1800);}};
  frame.srcdoc=html;
 }
 for(const m of records){
  if(window.PSY_FULL_METHODS[m.title])throw Error("Повторная запись методики: "+m.title);
  window.PSY_FULL_METHODS[m.title]={workflow:"specialToolkit",functionalId:m.id,
   author:m.author,age:m.ageLabel,kind:m.format,goal:m.goal,
   count:"Пять порядковых уровней I-V",calculator:true,indicators:m.criteria,
   indicatorsTitle:"Наблюдаемая функция",source:m.source,interpret:m.interpret};
 }
 const kit=window.PSY_SPECIAL_TOOLKIT;if(!kit)throw Error("Не найден общий модуль ОВЗ");
 const api={methods:records,portfolio,instruction,materials,calculator,complete,updateFooter,bind,print};
 for(const key of ["portfolio","instruction","materials","calculator","complete","updateFooter","bind","print"]){
  const prev=kit[key];kit[key]=function(d,...args){return methods.has(d?.functionalId)?api[key](d,...args):prev(d,...args);};
 }
 kit.methods.push(...records);
 window.PSY_SPECIAL_FUNCTIONAL=api;
})();