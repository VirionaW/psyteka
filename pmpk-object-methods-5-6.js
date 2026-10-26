"use strict";
/* Источниковые предметные пробы из обследования шестого года жизни под ред. Е. А. Стребелевой.
   Бланк специалиста и интерфейс Психотеки, без самостоятельных нормативов. */
(function(){
const BASE="https://www.pedlib.ru/Books/3/0496/3_0496-243.shtml";
const PAGE2="https://www.pedlib.ru/Books/3/0496/3_0496-244.shtml";
const PAGE3="https://www.pedlib.ru/Books/3/0496/3_0496-245.shtml";
const PAGE4="https://www.pedlib.ru/Books/3/0496/3_0496-246.shtml";
const M={
 row:{name:"Включение в ряд (по материалам Е. А. Стребелевой)",id:"pmpk-row-matryoshka-5-6",theme:"Мышление",goal:"Ориентировка в величине и восстановление упорядоченного ряда.",
 material:"Шестиместная матрешка (все шесть вложенных фигур), экран для скрытия одной фигуры.",
 child:"Поставь эту матрешку туда, где ее место среди остальных.",
 procedure:[
  "Разобрать шестиместную матрешку на глазах у ребенка и показать попарное собирание.",
  "Выстроить все шесть фигур по величине на равных расстояниях.",
  "За экраном убрать одну фигуру и выровнять промежутки.",
  "Предложить ребенку самостоятельно вставить фигуру в подходящее место, не подсказывая направление изменения размеров.",
  "Повторить с двумя или тремя фигурами по одной, записывая самостоятельность, примеривание и исправления."
 ],key:"Правильно – вставить фигуру в соответствующее ее величине место. Учитываются самостоятельные попытки, примеривание, реакция на помощь. Единого возрастного балла у этой регистрационной формы нет.",
 signals:["Самостоятельное место в ряду","Примеривание и самокоррекция","Принятие подсказки и последующий перенос"],
 source:BASE
 },
 ladder:{name:"Конструирование лесенки из палочек (по материалам Е. А. Стребелевой)",id:"pmpk-stick-ladder-5-6",theme:"Мышление",goal:"Конструктивный праксис: воспроизведение пространственного образца по памяти и при оказании помощи.",
 material:"20 одинаковых по цвету плоских палочек и экран. Образец специалиста – конструкция «лесенка» из 8 палочек.",
 child:"Посмотри внимательно на лесенку и запомни, как она устроена. Теперь сделай такую же.",
 procedure:[
  "Из восьми палочек перед ребенком построить образец «лесенки».",
  "Дать время рассмотреть и запомнить конструкцию, закрыть образец экраном.",
  "Попросить ребенка построить такую же из собственных палочек.",
  "При затруднении вновь показать построение и предложить воспроизведение после закрытия образца.",
  "Если и после обучения трудно, разрешить выполнение при открытом образце, отметив вид помощи."
 ],key:"Отмечается совпадение общей конструкции и взаимного расположения палочек, самостоятельность, выполнение после показа или по открытому образцу. Суммарный нормативный балл не рассчитывается.",
 signals:["Воспроизведение по памяти","Воспроизведение после обучения","Выполнение по открытому образцу"],
 source:PAGE2
 },
 count:{name:"Счет палочек за экраном (по материалам Е. А. Стребелевой)",id:"pmpk-hidden-sticks-5-6",theme:"Мышление",goal:"Количественные представления, удержание преобразований количества и счетные действия по представлению.",
 material:"15 одноцветных плоских палочек, экран; для словесной задачи палочки можно использовать как наглядную опору.",
 child:"Сначала возьми пять палочек и запомни, сколько их. Я спрячу их и покажу, сколько убираю или добавляю. Скажи, сколько остается за экраном.",
 procedure:[
  "Положить 15 палочек; попросить ребенка взять пять и назвать количество.",
  "Спрятать пять палочек за экраном, на виду убрать три, попросить определить остаток.",
  "Затем показать две палочки и прибавить их за экран к оставшимся двум, попросить определить итог.",
  "Если эти действия доступны, предложить словесную задачу: четыре карандаша, два красных, остальные синие. Сколько синих?",
  "При затруднении уменьшить число палочек и выполнить открытый показ, а затем снова зарегистрировать самостоятельность."
 ],key:"Для указанной числовой серии: после 5 - 3 остается 2, после 2 + 2 получается 4; в задаче о карандашах ответ 2. Это фактические решения действий, не шкала интеллекта. Записывайте ошибки и помощь.",
 signals:["5 - 3 = 2","2 + 2 = 4","4 карандаша, 2 красных – 2 синих"],
 source:PAGE3
 }
};
const TYPE={row:"Предметная проба",ladder:"Конструктивная проба",count:"Счет по представлению"};
const esc=x=>String(x??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
let active="",tab="portfolio",overlay=null,previous=null;
const sessions={};
function init(id){return {age:"",status:"",help:"",observations:"",answers:M[id].signals.map(()=>""),context:""}}
function data(){return sessions[active]||(sessions[active]=init(active))}
function ready(id=active,d=sessions[id]||init(id)){
 return (d.age==="5"||d.age==="6")&&["done","notdone","skip"].includes(d.status)&&!!d.help&&!!d.observations.trim()&&
 (d.status==="skip"||d.answers.length===M[id].signals.length&&d.answers.every(s=>["yes","no","na"].includes(s)));
}
function opt(items,v){return '<option value="">Выберите</option>'+items.map(([a,b])=>'<option value="'+esc(a)+'"'+(v===a?" selected":"")+'>'+esc(b)+'</option>').join("")}
function profile(){const m=M[active];return '<section class="pmpk-method-box"><h3>Общие сведения</h3><div class="pmpk-method-facts">'+[
 ["Методика",m.name],["Издание","Дети-сироты: консультирование и диагностика развития / под ред. Е. А. Стребелевой (1998)"],
 ["Возраст","5-6 лет, обследование шестого года жизни"],["Форма",TYPE[active]],["Материал",m.material]
 ].map(([k,v])=>'<div><small>'+esc(k)+'</small><strong>'+esc(v)+'</strong></div>').join("")+'</div></section>'+
 '<section class="pmpk-method-box"><h3>Цель</h3><p>'+esc(m.goal)+'</p><h3>Наблюдаемые показатели</h3><ul>'+m.signals.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>'+
 '<p>Одна предметная проба не заменяет комплексного обследования. Процедура из опубликованного сборника, протокол и поля обработки составлены Психотекой. Нормативные диагностические уровни не рассчитываются.</p>'+
 '<p><a href="'+m.source+'" target="_blank" rel="noopener noreferrer">Описание задания в первоисточнике</a></p></section>';
}
function guide(){const m=M[active];return '<section class="pmpk-method-box"><div class="pmpk-toolbar"><h3>Методика / руководство</h3><div class="pmpk-actions">'+
 '<button type="button" class="pmpk-mini" data-object56-action="print-guide">Без бланка</button>'+
 '<button type="button" class="pmpk-action primary" data-object56-action="print-combined">С бланком</button></div></div>'+
 '<h4>Цель</h4><p>'+esc(m.goal)+'</p><h4>Материалы</h4><p>'+esc(m.material)+'</p>'+
 '<h4>Инструкция ребенку</h4><blockquote>'+esc(m.child)+'</blockquote><p class="pmpk-note">Смысл инструкции сохранен в рабочей формулировке; для буквального авторского предъявления используйте текст источника.</p>'+
 '<h4>Проведение</h4><ol>'+m.procedure.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol>'+
 '<h4>Критерии регистрации / ключ</h4><p>'+esc(m.key)+'</p>'+
 '<h4>Интерпретация</h4><p>Сопоставляйте самостоятельное решение, способ исправления ошибок, возможность действовать по образцу и после помощи. Не переводите итог одной пробы в возрастной балл или диагноз.</p>'+
 '<p><a href="'+m.source+'" target="_blank" rel="noopener noreferrer">Авторское описание</a></p></section>';
}
function blank(){const m=M[active];return '<section class="pmpk-method-box"><div class="pmpk-toolbar"><div><h3>Протокол специалиста</h3><p class="pmpk-note">Физические стимулы подготавливаются отдельно. Этот лист предназначен только специалисту.</p></div><div class="pmpk-actions">'+
 '<button type="button" class="pmpk-mini" data-object56-action="print-blank">Печать А4</button>'+
 '<button type="button" class="pmpk-action primary" data-object56-action="docx-blank">Скачать Word</button></div></div>'+
 '<p>Дата _____________ Код обследуемого _____________ Возраст ________</p><table class="pmpk-method-table"><thead><tr><th>Показатель</th><th>Регистрация</th></tr></thead><tbody>'+
 m.signals.map(x=>'<tr><td>'+esc(x)+'</td><td>______________________________</td></tr>').join("")+
 '<tr><td>Помощь / способ действий</td><td>______________________________</td></tr><tr><td>Наблюдения</td><td>______________________________</td></tr></tbody></table></section>';
}
function processing(){const m=M[active],d=data();return '<section class="pmpk-method-box"><h3>Обработка результатов</h3><p class="pmpk-note">Все обязательные поля должны быть заполнены. Не проводилось – отдельное состояние, не ноль.</p>'+
 '<div class="pmpk-method-fields"><label>Возраст *<select data-object56-field="age">'+opt([["5","5 лет"],["6","6 лет"]],d.age)+'</select></label>'+
 '<label>Статус предъявления *<select data-object56-field="status">'+opt([["done","Проведено"],["notdone","Не удалось выполнить"],["skip","Не проводилось"]],d.status)+'</select></label>'+
 '<label>Условия / помощь *<select data-object56-field="help">'+opt([["none","Самостоятельно"],["repeat","Повтор инструкции"],["model","Образец / показ"],["joint","Совместные действия"],["other","Иные условия, описаны ниже"]],d.help)+'</select></label></div>'+
 (d.status==="skip"?"":'<div class="pmpk-method-grid">'+m.signals.map((x,i)=>'<label class="pmpk-method-answer">'+esc(x)+'<select data-object56-answer="'+i+'">'+opt([["yes","Наблюдалось / правильно"],["no","Не наблюдалось / неверно"],["na","Не предъявлялось, указать причину"]],d.answers[i])+'</select></label>').join("")+'</div>')+
 '<label class="pmpk-method-blockfield">Качественные наблюдения / причины *<textarea rows="4" data-object56-field="observations">'+esc(d.observations)+'</textarea></label>'+
 (ready()?'<div class="pmpk-sourced-result"><h3>Регистрация заполнена</h3><p>Указаны самостоятельность, способы действия и помощь. Автоматические диагнозы и возрастные шкалы не используются.</p></div>':
 '<p class="pmpk-note">Для завершения заполните все обязательные данные по фактическому предъявлению.</p>')+'</section>';
}
function printBody(kind){const m=M[active],d=data();const heading='<h1>'+esc(m.name)+'</h1><p>Возраст: 5-6 лет. Издание под ред. Е. А. Стребелевой (1998). Протокол Психотеки.</p>';
 const guide=heading+'<h2>Цель</h2><p>'+esc(m.goal)+'</p><h2>Материалы</h2><p>'+esc(m.material)+'</p>'+
 '<h2>Инструкция ребенку</h2><p>'+esc(m.child)+'</p><h2>Процедура</h2><ol>'+m.procedure.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol>'+
 '<h2>Критерии и интерпретация</h2><p>'+esc(m.key)+'</p><p>Источник: '+esc(m.source)+'</p>';
 const b=heading+'<h2>Протокол специалиста</h2><p>Возраст ______ Дата ______ Код ______</p><table><tr><th>Показатель</th><th>Результат</th></tr>'+
 m.signals.map(x=>'<tr><td>'+esc(x)+'</td><td>________________________</td></tr>').join("")+
 '<tr><td>Помощь</td><td>________________________</td></tr><tr><td>Наблюдения</td><td>________________________</td></tr></table>';
 const report=heading+'<h2>Качественное наблюдение</h2><p>Возраст: '+esc(d.age)+' лет. Статус: '+esc(d.status)+'. Помощь: '+esc(d.help)+'.</p>'+
 m.signals.map((x,i)=>'<p>'+esc(x)+': '+esc(d.answers[i])+'</p>').join("")+'<p>'+esc(d.observations)+'</p><p>Без возрастного нормативного балла.</p>';
 return kind==="guide"?guide:kind==="combined"?guide+'<div class="page-break"></div>'+b:kind==="blank"?b:report;
}
function print(kind){if(kind==="report"&&!ready())return;const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>@page{size:A4;margin:17mm}body{font:11pt/1.45 Arial,sans-serif;color:#182525}table{width:100%;border-collapse:collapse}th,td{border:1px solid #888;padding:9px;text-align:left}tr{break-inside:avoid}h1{font-size:17pt}.page-break{break-before:page;page-break-before:always}</style></head><body>'+printBody(kind)+'</body></html>';const w=window.open("","_blank");if(!w){window.alert("Разрешите открытие окна печати");return}w.document.open();w.document.write(html);w.document.close();w.focus();w.setTimeout(()=>w.print(),200)}
function word(kind){if(kind==="report"&&!ready())return;const m=M[active],d=data();const lines=kind==="blank"?[m.name,"Протокол специалиста; 5-6 лет",...m.signals.map(x=>x+": ______________"),"Помощь: ____________","Наблюдения: __________"]:
 [m.name,"Возраст: "+d.age+" лет","Статус: "+d.status,"Помощь: "+d.help,...m.signals.map((x,i)=>x+": "+d.answers[i]),"Наблюдения: "+d.observations,"Описательная регистрация без диагностических нормативов."];
 window.PSY_PMPK_SOURCED?.downloadLines?.(m.id+"-"+kind,lines);
}
function draw(){if(!overlay)return;const ok=ready();overlay.innerHTML='<section class="pmpk-method-shell" role="dialog" aria-modal="true" aria-labelledby="object56Title">'+
 '<header class="pmpk-method-header"><div><p class="pmpk-method-overline">Детский сад · 5-6 лет · предметная проба</p><h2 id="object56Title">'+esc(M[active].name)+'</h2></div><button type="button" class="pmpk-method-close" aria-label="Закрыть" data-object56-action="close">×</button></header>'+
 '<div class="pmpk-method-tabs" role="tablist">'+[["portfolio","Портфолио"],["guide","Методика / руководство"],["blank","Бланк"]].map(([key,label])=>'<button type="button" role="tab" data-object56-tab="'+key+'" aria-selected="'+(tab===key)+'">'+label+'</button>').join("")+'</div>'+
 '<div class="pmpk-method-content">'+(tab==="portfolio"?profile():tab==="guide"?guide():tab==="blank"?blank():processing())+'</div>'+
 '<footer class="pmpk-method-footer"><span class="pmpk-status '+(ok?"is-done":"")+'" data-object56-status>'+ (ok?"Обработка заполнена":"Обработка не заполнена")+'</span>'+
 (tab==="processing"?'<div class="pmpk-method-right"><button type="button" class="pmpk-mini" data-object56-action="back">К портфолио</button><button type="button" class="pmpk-mini" data-object56-action="print-report" '+(!ok?"disabled":"")+'>Печать отчета</button><button type="button" class="pmpk-action primary" data-object56-action="docx-report" '+(!ok?"disabled":"")+'>Скачать отчет Word</button></div>':
 '<button type="button" class="pmpk-action primary" data-object56-action="processing" style="margin-left:auto">Обработка результатов</button>')+'</footer></section>'}
function open(id){if(!M[id])return false;if(overlay)close();previous=document.activeElement;active=id;tab="portfolio";overlay=document.createElement("div");overlay.className="pmpk-method-overlay";document.body.appendChild(overlay);document.body.classList.add("pmpk-method-open");draw();document.addEventListener("keydown",onKey);overlay.querySelector('[data-object56-action="close"]')?.focus();return true}
function close(){if(!overlay)return;overlay.remove();overlay=null;active="";document.body.classList.remove("pmpk-method-open");document.removeEventListener("keydown",onKey);if(previous?.isConnected)previous.focus()}
function onKey(e){if(e.key==="Escape"){e.preventDefault();close()}}
function update(){if(!overlay)return;const ok=ready();const b=overlay.querySelector("[data-object56-status]");if(b){b.textContent=ok?"Обработка заполнена":"Обработка не заполнена";b.classList.toggle("is-done",ok)}overlay.querySelectorAll('[data-object56-action="print-report"],[data-object56-action="docx-report"]').forEach(x=>x.disabled=!ok)}
function change(e){if(!overlay||!overlay.contains(e.target))return;const x=e.target,d=data();
 if(x.dataset.object56Field){const k=x.dataset.object56Field;d[k]=x.value;if(k==="status"){draw();return}update();return}
 if(x.dataset.object56Answer!==undefined){const i=Number(x.dataset.object56Answer);if(i>=0&&i<d.answers.length)d.answers[i]=x.value;update()}
}
document.addEventListener("input",change);document.addEventListener("change",change);
document.addEventListener("click",e=>{if(!overlay||!overlay.contains(e.target))return;const b=e.target.closest("button");if(!b)return;
 if(b.dataset.object56Tab){tab=b.dataset.object56Tab;draw();return}
 const a=b.dataset.object56Action;if(a==="close")close();else if(a==="back"){tab="portfolio";draw()}else if(a==="processing"){tab="processing";draw()}
 else if(a.startsWith("print-"))print(a.slice(6));else if(a.startsWith("docx-"))word(a.slice(5));
});
if(window.PSY_CATALOG){for(const [id,m]of Object.entries(M)){if(!window.PSY_CATALOG.some(x=>x.name===m.name))window.PSY_CATALOG.push({id:m.id,name:m.name,theme:m.theme,author:"Издание под ред. Е. А. Стребелевой, 1998",age:"5-6 лет",format:TYPE[id],goal:m.goal,source:m.source})}}
window.PSY_PMPK_OBJECT56={has:id=>!!M[id],open,catalog:Object.entries(M).map(([id,m])=>({id:m.id,title:m.name,group:"Диагностика",topic:m.theme,age:"5-6",goal:m.goal,format:TYPE[id],author:"Издание под ред. Е. А. Стребелевой, 1998",existing:m.name,verified:true,object56Id:id})),
 test:{ready:(id,d)=>ready(id,d),init,ids:Object.keys(M)}};
})();
