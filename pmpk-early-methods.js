"use strict";
/* ПМПК. Две предметные пробы 3-5 лет по изданию под ред. Е. А. Стребелевой.
   Только описательная регистрация. Физический комплект специалист готовит самостоятельно. */
(function(){
 const SOURCE="https://www.pedlib.ru/Books/3/0496/3_0496-234.shtml";
 const LIST="https://base.garant.ru/71462034/38d0e20d10a9099ed1e190abf152a12a/";
 const METHODS={
  forms:{
   title:"Коробка форм («Почтовый ящик»)",
   id:"pmpk-forms-strebeleva-3-5",
   age:"3-5 лет, варианты 3-4 и 4-5 лет",
   domain:3,goal:"Описать соотнесение предмета и отверстия по форме, действия примеривания, зрительного анализа и принятие помощи.",
   material:"Предметный комплект: коробка с 4 отверстиями разной формы для 3-4 лет или 5 отверстиями для 4-5 лет; в исходном описании – 8 объемных фигур, соответствующих отверстиям. Не заменяйте комплект картинкой.",
   child:"Перед тобой фигурки и коробка. Попробуй опустить каждую фигурку в подходящее окошко.",
   steps:["Показать все вкладыши и коробку. Убедиться, что ребенок видит материал и может им манипулировать.","Предложить самостоятельно подобрать отверстия для всех форм, не показывая правильных отверстий заранее.","Зарегистрировать каждую удачную попытку, способы ориентировки, время, отказ от ошибочного действия и исправления.","При затруднении сначала повторить инструкцию, затем по необходимости продемонстрировать способ примеривания на дополнительном образце. Отметить помощь отдельно.","Указать влияние ограничений моторики и сенсорного восприятия. Остановить пробу при выраженном утомлении."],
   key:"Критерий фактического выполнения – каждая из 8 фигур помещена в подходящее отверстие. Число успехов 0-8 носит описательный характер. Опубликованная экспертная шкала 1-4 балла оценивает способ действия, а не сумму фигур."
  },
  pyramid:{
   title:"Разборка и складывание пирамидки",
   id:"pmpk-pyramid-strebeleva-3-5",
   age:"3-5 лет, варианты 3-4 и 4-5 лет",
   domain:3,goal:"Исследовать ориентировку на величину, последовательное предметное действие и использование помощи.",
   material:"Пирамидка из колец одного набора: 4 кольца для 3-4 лет либо 6 колец для 4-5 лет. Подготовить ровный стержень.",
   child:"Посмотри на пирамидку. Сними колечки, а потом собери ее снова, чтобы получилось так, как было.",
   steps:["Предъявить собранную пирамидку выбранного размера. Обеспечить возможность рассмотреть порядок колец.","Предложить ребенку разобрать пирамидку и собрать ее самостоятельно; не переставлять кольца за него.","Наблюдать выбор последовательности размеров, примеривание, удержание цели и способ действия.","Если ребенок не приступает или явно затрудняется, предоставить дозированную помощь с фиксацией вида подсказки.","При оценке отдельно отметить тонкую моторику, зрение, понимание инструкции и отказ/утомление."],
   key:"Критерий результата – кольца надеты от большего у основания к меньшему наверху. Число верно расположенных колец – техническое описание. Опубликованная шкала 1-4 балла учитывает самостоятельность и эффект обучения."
  }
 };
 const ESC=s=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 const versions=[{label:"3-4 года",count:{forms:8,pyramid:4},openings:4},{label:"4-5 лет",count:{forms:8,pyramid:6},openings:5}];
 const RUBRIC={forms:["1 – не принял задачу и не перешел к адекватным действиям после обучения","2 – действовал хаотично, после обучения способ не улучшился","3 – после помощи перешел от перебора к целенаправленным пробам либо зрительному сравнению","4 – самостоятельно использовал целенаправленные пробы"],pyramid:["1 – не понял задачу, действовал неадекватно","2 – нанизывал без учета величины даже после помощи","3 – сначала не учитывал величину, после обучения собрал правильно","4 – самостоятельно собрал пирамидку с учетом величины"]};
 const choices={mode:["Выполнено самостоятельно","Выполнено с помощью","Не удалось выполнить","Не проводилось"],strategy:["Зрительное соотнесение","Примеривание","Перебор вариантов","Хаотические действия","Не наблюдалось"],help:["Не требовалась","Повтор инструкции","Словесная подсказка","Показ образца","Совместные действия"]};
 const sessions={};let active="",activeTask=0,tab="portfolio",el=null,focusBefore=null;
 function blankState(){return {version:"",code:"",date:new Date().toISOString().slice(0,10),mode:"",strategy:"",help:"",count:"",rubric:"",notes:"",reason:""}}
 function current(){return sessions[active]||(sessions[active]=blankState())}
 function method(){return METHODS[active]}
 function expected(){const n=Number(current().version);return Number.isInteger(n)&&n>=0&&n<=1?versions[n].count[active]:0}
 function ready(){const d=current(),n=expected();return !!n&&d.mode!==""&&(d.mode==="Не проводилось"?!!d.reason.trim():d.count!==""&&Number.isInteger(+d.count)&&+d.count>=0&&+d.count<=n&&!!d.strategy&&!!d.help&&!!d.notes.trim()&&/^[1-4]$/.test(d.rubric))}
 function chooseOptions(options,value){return '<option value="">Выберите</option>'+options.map(x=>'<option value="'+ESC(x)+'"'+(value===x?" selected":"")+'>'+ESC(x)+'</option>').join("")}
 function overview(){const m=method();return '<div class="pmpk-method-box"><h3>Общие сведения</h3><div class="pmpk-method-facts">'+[
 ["Методика",m.title],["Основание","Диагностический набор в издании под ред. Е. А. Стребелевой, 1998"],["Возраст",m.age],["Варианты",active==="forms"?"3-4 года: 4 отверстия и 8 фигур; 4-5 лет: 5 отверстий и 8 фигур":"3-4 года: 4 кольца; 4-5 лет: 6 колец"],["Тип","Предметная диагностическая проба"]].map(([k,v])=>'<div><small>'+ESC(k)+'</small><strong>'+ESC(v)+'</strong></div>').join("")+'</div></div>'+
 '<div class="pmpk-method-box"><h3>Цель</h3><p>'+ESC(m.goal)+'</p></div>'+
 '<div class="pmpk-method-box"><h3>Ограничения и интерпретация</h3><p>Настоящая предметная проба из опубликованного перечня, но бланк регистрации создан Психотекой. Без первоисточника конкретной редакции не используются нормы, диагнозы и уровни развития. Не сравнивайте количество выполненных элементов с возрастной нормой другого издания.</p><p>Не заменяйте реальные вкладыши, кольца и геометрию изображением на экране. Потребность в помощи и моторные ограничения обязательны для качественного описания.</p><p><a href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">Варианты 3-4 и 4-5 лет – издание под редакцией Е. А. Стребелевой</a> · <a href="'+LIST+'" target="_blank" rel="noopener noreferrer">Приложение 8 к рекомендациям ПМПК</a></p></div>';
 }
 function guide(){const m=method();return '<div class="pmpk-method-box"><div class="pmpk-toolbar"><h3>Методика / руководство</h3><div class="pmpk-actions"><button type="button" class="pmpk-mini" data-early-action="print-guide">Без бланка</button><button type="button" class="pmpk-action primary" data-early-action="print-both">С бланком</button></div></div><h4>Цель</h4><p>'+ESC(m.goal)+'</p><h4>Материалы</h4><p>'+ESC(m.material)+'</p><h4>Инструкция ребенку</h4><blockquote>'+ESC(m.child)+'</blockquote><p class="pmpk-note">Эта фраза – рабочая адаптация инструкции для данного протокола. Для неизмененного авторского предъявления необходимо пользоваться оригинальным руководством.</p><h4>Проведение</h4><ol>'+m.steps.map(x=>'<li>'+ESC(x)+'</li>').join("")+'</ol><h4>Критерии регистрации</h4><p>'+ESC(m.key)+'</p><h4>Шкала из опубликованной редакции: 1-4 балла</h4><ol>'+RUBRIC[active].map(x=>'<li>'+ESC(x)+'</li>').join("")+'</ol><h4>Интерпретация</h4><p>Описывайте способ самостоятельного решения, характер ошибок и действие подсказки. Итоги без нормативного сравнения по всей возрастной группе 3-5 лет.</p></div>';
 }
 function protocolText(){
  const d=current(),m=method(),rows=[];
  rows.push(m.title,"Возрастная версия: "+(versions[d.version]?.label||"не выбрана"),"Код: "+(d.code||"_________"),"Дата: "+d.date,
    "Набор: "+(active==="forms"?(versions[Number(d.version)]?.openings||"___")+" отверстий; "+(expected()||"___")+" фигур":(expected()||"___")+" колец"),"Выполнение: "+(d.mode||"_________"),"Способ: "+(d.strategy||"_________"),"Помощь: "+(d.help||"_________"),
    "Верно выполнено: "+(d.count===""?"_________":d.count)+" из "+(expected()||"___"),"Качественный балл 1-4: "+(d.rubric||"_________"),"Причина пропуска: "+(d.reason||"_________"),
    "Качественные наблюдения: "+(d.notes||"______________________________________"),
    "Результат не является нормативным диагностическим баллом.");
  return rows;
 }
 function blank(){return '<div class="pmpk-method-box"><div class="pmpk-toolbar"><div><h3>Бланк специалиста</h3><p class="pmpk-note">Физический диагностический материал готовится отдельно; ребенок не получает лист с регистрацией.</p></div><div class="pmpk-actions"><button type="button" class="pmpk-mini" data-early-action="print-blank">Печать А4</button><button type="button" class="pmpk-action primary" data-early-action="docx-blank">Скачать Word</button></div></div>'+
 '<p>Код ребенка ____________________  Дата __________  Возрастная версия: 3-4 / 4-5 лет</p>'+
 '<table class="pmpk-method-table"><thead><tr><th>Показатель</th><th>Регистрация</th></tr></thead><tbody>'+
 [["Состав набора",active==="forms"?"4/5 отверстий и 8 фигур":"4/6 колец"],["Правильные действия","_________ элементов"],["Качественный балл","1 / 2 / 3 / 4"],["Способ выполнения","Зрительное соотнесение / примеривание / перебор / другое"],["Вид помощи","_________________________________"],["Ошибки и самокоррекция","_________________________________"],["Причины затруднений","_________________________________"],["Качественное заключение","_________________________________"]].map(([l,r])=>'<tr><th>'+ESC(l)+'</th><td>'+ESC(r)+'</td></tr>').join("")+'</tbody></table></div>';
 }
 function processing(){
 const d=current(),m=method(),n=expected(),skip=d.mode==="Не проводилось";
 return '<div class="pmpk-method-box"><h3>Обработка результатов</h3><p class="pmpk-note">Введите только наблюдаемые факты. Пустое значение не равно нулю. Сохранение и передача данных на сервер не выполняются.</p>'+
 '<div class="pmpk-method-fields"><label>Возрастная версия *<select data-early-field="version"><option value="">Выберите</option>'+versions.map((v,i)=>'<option value="'+i+'"'+(d.version===String(i)?" selected":"")+'>'+v.label+'</option>').join("")+'</select></label><label>Дата<input type="date" data-early-field="date" value="'+ESC(d.date)+'"></label></div>'+
 '<label class="pmpk-method-blockfield">Код участника (необязательно)<input data-early-field="code" value="'+ESC(d.code)+'" placeholder="Например, П-01"></label>'+
 '<div class="pmpk-method-fields"><label>Выполнение *<select data-early-field="mode">'+chooseOptions(choices.mode,d.mode)+'</select></label>'+
 (!skip?'<label>Способ выполнения *<select data-early-field="strategy">'+chooseOptions(choices.strategy,d.strategy)+'</select></label>':"")+'</div>'+
 (skip?'<label class="pmpk-method-blockfield">Почему не проводилось? *<textarea rows="2" data-early-field="reason">'+ESC(d.reason)+'</textarea></label>':
 '<div class="pmpk-method-fields"><label>'+(active==="forms"?"Успешно размещенных фигур из 8 *":"Правильно расположенных колец *")+(n?'<input type="number" min="0" max="'+n+'" step="1" data-early-field="count" value="'+ESC(d.count)+'">':'<input disabled placeholder="Сначала выберите возрастную версию">')+'</label><label>Вид помощи *<select data-early-field="help">'+chooseOptions(choices.help,d.help)+'</select></label></div><label class="pmpk-method-blockfield">Ответы, ошибки, стратегия, влияние помощи *<textarea rows="4" data-early-field="notes">'+ESC(d.notes)+'</textarea></label>')+
 '<label class="pmpk-method-blockfield">Качественный балл по критериям 1-4 *<select data-early-field="rubric"><option value="">Выберите</option>'+RUBRIC[active].map((x,i)=>'<option value="'+(i+1)+'"'+(d.rubric===String(i+1)?" selected":"")+' title="'+ESC(x)+'">'+ESC(x)+'</option>').join("")+'</select></label><p class="pmpk-note">Оценка правильности: '+ESC(m.key)+'</p></div>';
 }
 function draw(preserve){if(!el)return;const old=preserve?el.querySelector(".pmpk-method-content")?.scrollTop||0:0,ok=ready();
  el.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="earlyMethodTitle" class="pmpk-method-shell">'+
  '<header class="pmpk-method-header"><div><p class="pmpk-method-overline">ПМПК · предметная диагностика · 3-5 лет</p><h2 id="earlyMethodTitle">'+ESC(method().title)+'</h2></div><button type="button" class="pmpk-method-close" data-early-action="close" aria-label="Закрыть">×</button></header>'+
  '<div class="pmpk-method-tabs" role="tablist">'+[["portfolio","Портфолио"],["guide","Методика / руководство"],["blank","Бланк"]].map(([id,l])=>'<button type="button" role="tab" data-early-tab="'+id+'" aria-selected="'+(tab===id)+'">'+l+'</button>').join("")+'</div>'+
  '<div class="pmpk-method-content">'+(tab==="portfolio"?overview():tab==="guide"?guide():tab==="blank"?blank():processing())+'</div>'+
  '<footer class="pmpk-method-footer"><span data-early-status class="pmpk-status '+(ok?"is-done":"")+'">'+(ok?"Обработка заполнена":"Обработка не заполнена")+'</span>'+
  (tab==="processing"?'<div class="pmpk-method-right"><button class="pmpk-mini" type="button" data-early-action="back">К портфолио</button><button class="pmpk-mini" type="button" data-early-action="print-report" '+(!ok?"disabled":"")+'>Печать отчета</button><button class="pmpk-action primary" type="button" data-early-action="docx-report" '+(!ok?"disabled":"")+'>Скачать отчет Word</button><button class="pmpk-action primary" type="button" data-early-action="transfer" '+(!ok?"disabled":"")+'>В общий протокол</button></div>':
  '<button type="button" class="pmpk-action primary" data-early-action="processing" style="margin-left:auto">Обработка результатов</button>')+'</footer></section>';
  const pane=el.querySelector(".pmpk-method-content");if(pane)pane.scrollTop=old;
 }
 function close(){if(!el)return;el.remove();el=null;active="";activeTask=0;document.body.classList.remove("pmpk-method-open");document.removeEventListener("keydown",onKey);if(focusBefore?.isConnected)focusBefore.focus?.()}
 function onKey(e){if(e.key==="Escape"){e.preventDefault();close();return}if(e.key==="Tab"&&el){const controls=[...el.querySelectorAll("button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]")].filter(x=>x.getClientRects().length);
  if(controls.length){const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}}
 function open(id,task){if(!METHODS[id])return false;if(el)close();active=id;activeTask=Number.isInteger(task)&&task>=0&&task<7?task:METHODS[id].domain;tab="portfolio";focusBefore=document.activeElement;el=document.createElement("div");el.className="pmpk-method-overlay";document.body.appendChild(el);document.body.classList.add("pmpk-method-open");draw(false);document.addEventListener("keydown",onKey);el.querySelector('[data-early-action="close"]')?.focus?.();return true}
 function print(type){
  if(type==="report"&&!ready())return;
  let content=type==="guide"?guideHTML():type==="guide-blank"?guideHTML()+'<div class="page-break"></div>'+blankHTML():type==="blank"?blankHTML():'<h1>Отчет специалиста</h1>'+protocolText().map(x=>'<p>'+ESC(x)+'</p>').join("");
  const html='<!doctype html><html lang="ru"><head><meta charset="UTF-8"><title>'+ESC(method().title)+'</title><style>@page{size:A4;margin:18mm 17mm}body{font:11pt/1.5 Arial,sans-serif;color:#293331}h1{font-size:17pt}h2{font-size:13pt}p{margin:6pt 0}li{margin:6pt 0}th,td{border:1px solid #abb2ae;padding:8pt;text-align:left}table{border-collapse:collapse;width:100%}.page-break{page-break-before:always;break-before:page}</style></head><body>'+content+'</body></html>';
  const w=window.open("","_blank");if(!w){window.alert("Разрешите открытие окна печати.");return}w.document.open();w.document.write(html);w.document.close();w.focus();w.setTimeout(()=>w.print(),200);
 }
 function guideHTML(){const m=method();return '<h1>'+ESC(m.title)+'</h1><p>Варианты 3-4 года / 4-5 лет. Основание: издание под редакцией Е. А. Стребелевой (1998).</p><h2>Цель</h2><p>'+ESC(m.goal)+'</p><h2>Материалы</h2><p>'+ESC(m.material)+'</p><h2>Инструкция ребенку</h2><p>'+ESC(m.child)+'</p><h2>Процедура</h2><ol>'+m.steps.map(x=>'<li>'+ESC(x)+'</li>').join("")+'</ol><h2>Регистрация и интерпретация</h2><p>'+ESC(m.key)+'</p><h2>Критерии экспертной шкалы 1-4</h2><ol>'+RUBRIC[active].map(x=>'<li>'+ESC(x)+'</li>').join("")+'</ol><p>Не переводить результат одной пробы в возрастную норму, интеллект или диагноз.</p><p>Источник: '+SOURCE+'</p>'}
 function blankHTML(){return '<h1>Протокол специалиста</h1><p>'+ESC(method().title)+'</p><p>Код ______ Дата ______ Возраст: 3-4 / 4-5 лет. Комплект: '+(active==="forms"?"4/5 отверстий и 8 объемных фигур":"4/6 колец")+'</p><table><tr><th>Показатель</th><th>Наблюдение</th></tr>'+["Способ действия","Правильно выполнено","Качественный балл 1-4","Пробы и ошибки","Помощь","Самокоррекция","Поведение и утомление","Заключение"].map(x=>'<tr><td>'+x+'</td><td>________________________________________</td></tr>').join("")+'</table>'}
 function transfer(){
  if(!ready())return;
  const d=current(),bridge=window.PSY_PMPK_BRIDGE;
  if(!bridge||bridge.getAge()!==0){window.alert("Для переноса откройте возрастную группу 3-5 лет в ПМПК.");return}
  if(d.mode==="Не проводилось"){window.alert("Пропуск задания следует отметить в общем протоколе с причиной.");return}
  const result=d.mode==="Не удалось выполнить"?"Не выполнил":d.mode==="Выполнено самостоятельно"&&d.help==="Не требовалась"?"Самостоятельно":"С помощью";
  const help=d.help==="Не требовалась"?"Без помощи":d.help==="Повтор инструкции"?"Повторение инструкции":d.help==="Словесная подсказка"?"Словесная подсказка":d.help==="Показ образца"?"Показ образца":"Пошаговая помощь";
  const notes="Методика: "+method().title+". Возрастная версия: "+versions[Number(d.version)].label+
   ". Элементов выполнено: "+d.count+" из "+expected()+". Способ: "+d.strategy+
   ". Качественный балл 1-4: "+d.rubric+". Наблюдения: "+d.notes;
  if(bridge.transfer(activeTask,{result,help,notes,sourceId:active})){close()}
  else window.alert("Сначала выберите эту методику в соответствующем задании ПМПК.");
 }
 function escXml(x){return ESC(x).replace(/&#39;/g,"&apos;")}
 function xmlP(x){return '<w:p><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">'+escXml(x)+'</w:t></w:r></w:p>'}
 function zip(values){
  const enc=new TextEncoder(),local=[],central=[],u16=n=>[n&255,(n>>>8)&255],u32=n=>[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];let offset=0;
  function crc(bytes){let n=0xffffffff;for(let b of bytes){n^=b;for(let j=0;j<8;j++)n=(n>>>1)^((n&1)?0xedb88320:0)}return(n^0xffffffff)>>>0}
  for(const [path,data]of Object.entries(values)){
   const p=enc.encode(path),b=enc.encode(data),sum=crc(b);
   let header=Uint8Array.from([...u32(0x04034b50),...u16(20),...u16(0x800),...u16(0),0,0,0,0,...u32(sum),...u32(b.length),...u32(b.length),...u16(p.length),0,0,...p]);
   local.push(header,b);
   central.push(Uint8Array.from([...u32(0x02014b50),...u16(20),...u16(20),...u16(0x800),0,0,0,0,0,0,...u32(sum),...u32(b.length),...u32(b.length),...u16(p.length),0,0,0,0,0,0,0,0,0,0,...u32(offset),...p]));
   offset+=header.length+b.length;
  }
  const sum=central.reduce((n,x)=>n+x.length,0);
  return new Blob([...local,...central,Uint8Array.from([...u32(0x06054b50),0,0,0,0,...u16(central.length),...u16(central.length),...u32(sum),...u32(offset),0,0])],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
 }
 function docx(type){
  if(type==="report"&&!ready())return;
  const lines=type==="report"?protocolText():["Бланк специалиста",method().title,"Возраст 3-4 / 4-5 лет","Код _________   Дата _________","Число элементов: ________","Способ действия: __________________","Правильные элементы: _____________","Качественный балл 1-4: __________","Виды помощи: _____________________","Ошибки и самокоррекция: __________","Качественное заключение: _________"];
  const doc='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+lines.map(xmlP).join("")+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="900" w:left="900" w:right="900" w:bottom="900"/></w:sectPr></w:body></w:document>';
  const entries={"[Content_Types].xml":'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',"_rels/.rels":'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',"word/document.xml":doc};
  const url=URL.createObjectURL(zip(entries)),link=document.createElement("a");link.href=url;link.download=method().id+"-"+type+".docx";document.body.appendChild(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),60000);
 }
 document.addEventListener("click",e=>{const b=e.target.closest("[data-open-pmpk-early]");if(b){open(b.dataset.openPmpkEarly);return}if(!el||!el.contains(e.target))return;
  if(e.target===el){close();return}const cmd=e.target.closest("button");if(!cmd)return;
  if(cmd.dataset.earlyTab){tab=cmd.dataset.earlyTab;draw(false);return}
  switch(cmd.dataset.earlyAction){
   case "close":close();break;case "processing":tab="processing";draw(false);break;case "back":tab="portfolio";draw(false);break;
   case "print-guide":print("guide");break;case "print-both":print("guide-blank");break;case "print-blank":print("blank");break;case "docx-blank":docx("blank");break;
   case "print-report":print("report");break;case "docx-report":docx("report");break;case "transfer":transfer();break;
  }
 });
 function change(e){if(!el||!el.contains(e.target)||!e.target.matches("[data-early-field]"))return;let key=e.target.dataset.earlyField;
  if(key==="version"){const previous=current().version;if(previous!==e.target.value){const keep={code:current().code,date:current().date};sessions[active]={...blankState(),...keep,version:e.target.value};draw(true)}return}
  current()[key]=e.target.value;const stat=el.querySelector("[data-early-status]");if(stat){let ok=ready();stat.textContent=ok?"Обработка заполнена":"Обработка не заполнена";stat.classList.toggle("is-done",ok)}
  el.querySelectorAll('[data-early-action="print-report"],[data-early-action="docx-report"],[data-early-action="transfer"]').forEach(b=>b.disabled=!ready());
 }
 document.addEventListener("input",change);document.addEventListener("change",change);
 window.PSY_PMPK_EARLY={open,has:id=>!!METHODS[id],test:{current:()=>active?{...current()}:null,ready:()=>active?ready():false,counts:versions.map(v=>v.count)}};
})();
