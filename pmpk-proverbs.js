"use strict";
/* Классическая качественная проба понимания переносного смысла пословиц.
   Предъявляются общеупотребимые народные пословицы, не оригинальная стандартизированная батарея. */
(function(){
const NAME="Толкование пословиц (качественная проба)";
const ID="pmpk-proverbs-meaning-11-18";
const SOURCE="https://www.psychiatry.ru/lib/1/book/87/chapter/3";
const OTHER="https://azps.ru/tests/tests3_tolkovanie.html";
const phrases=[
 "Не все то золото, что блестит.","Семь раз отмерь, один раз отрежь.","Тише едешь – дальше будешь.",
 "Куй железо, пока горячо.","Что посеешь, то и пожнешь.","Делу время, потехе час.",
 "Цыплят по осени считают.","Без труда не вытащишь и рыбку из пруда.","Не в свои сани не садись.","Под лежачий камень вода не течет."
];
const esc=x=>String(x??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const blank=()=>({age:"",responses:phrases.map(()=>({status:"",meaning:"",reason:""})),summary:"",notes:""});
let info=blank(),overlay=null,tab="portfolio",prior=null;
function ready(d=info){return Number.isInteger(+d.age)&&+d.age>=11&&+d.age<=18&&d.age!==""&&!!d.summary.trim()&&d.responses.length===phrases.length&&
 d.responses.every(r=>r.status==="skip"?!!r.reason.trim():["transfer","literal","situational","other"].includes(r.status)&&!!r.meaning.trim());}
function opt(items,value){return '<option value="">Выберите</option>'+items.map(([k,n])=>'<option value="'+esc(k)+'"'+(k===value?" selected":"")+'>'+esc(n)+'</option>').join("")}
const codes=[["transfer","Обобщенный переносный смысл"],["literal","Только буквальный смысл"],["situational","Частный пример без обобщения"],["other","Иное объяснение"],["skip","Не предъявлялось"]];
function portfolio(){return '<section class="pmpk-method-box"><h3>Общие сведения</h3><div class="pmpk-method-facts">'+[
 ["Проба",NAME],["Традиция","Исследование понимания пословиц и метафор в клинической патопсихологии"],
 ["Возраст","11-18 лет в школьном маршруте"],["Материал","10 народных пословиц, качественная регистрация"],["Оценка","Характер объяснения и обобщения без нормативных баллов"]
 ].map(([a,b])=>'<div><small>'+esc(a)+'</small><strong>'+esc(b)+'</strong></div>').join("")+'</div></section>'+
 '<section class="pmpk-method-box"><h3>Цель</h3><p>Выявить особенности понимания переносного смысла, абстрагирования, целенаправленности и связности объяснений.</p>'+
 '<p>Метод толкования пословиц описан в клинической патопсихологии. Представлена открытая рабочая серия общенародных пословиц Метоларии. Она не является стандартизированным авторским вариантом Б. В. Зейгарник с подбором фраз и не имеет возрастных количественных норм.</p>'+
 '<p><a href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">Клиническая патопсихология – описание приема</a> · <a href="'+OTHER+'" target="_blank" rel="noopener noreferrer">Описание процедуры и примеры пословиц</a></p></section>'}
function guide(){return '<section class="pmpk-method-box"><div class="pmpk-toolbar"><h3>Методика / руководство</h3><div class="pmpk-actions">'+
 '<button type="button" class="pmpk-mini" data-proverbs-action="print-guide">Без бланка</button><button type="button" class="pmpk-action primary" data-proverbs-action="print-combined">С бланком</button></div></div>'+
 '<h4>Цель</h4><p>Качественное исследование понимания переносного смысла народных пословиц.</p>'+
 '<h4>Инструкция ребенку</h4><blockquote>Я буду называть пословицы. Объясни, что каждая пословица означает, какую общую мысль она выражает.</blockquote>'+
 '<h4>Проведение</h4><ol><li>По одной предъявлять пословицы с отдельного списка специалиста или читать с листа.</li><li>Дословно записывать объяснение и примеры. Не подсказывать правильную идею.</li><li>При необходимости задавать нейтральное уточнение о смысле высказывания, помечать помощь.</li><li>Отличать понимание общего смысла от буквального пересказа и от частного жизненного примера без обобщения.</li><li>Зафиксировать влияние речевых трудностей и знания самого выражения.</li></ol>'+
 '<h4>Качественные критерии</h4><p>Для каждой пословицы отметьте одну из категорий: обобщенный переносный смысл, буквальная трактовка, ситуативный пример без обобщения, иное объяснение, либо не предъявлялось. Слова ребенка записываются дословно; категории – рабочая схема регистрации Метоларии, а не валидизированная шкала.</p>'+
 '<h4>Интерпретация</h4><p>Общая оценка строится по содержанию ответов, их устойчивости, самокоррекции и контексту. Из этой серии нельзя рассчитывать IQ, возрастной норматив или диагноз.</p></section>'}
function blankTab(){return '<section class="pmpk-method-box"><div class="pmpk-toolbar"><h3>Бланки А4</h3><div class="pmpk-actions"><button type="button" class="pmpk-mini" data-proverbs-action="print-child">Лист ребенка</button><button type="button" class="pmpk-mini" data-proverbs-action="print-blank">Протокол специалиста</button><button type="button" class="pmpk-action primary" data-proverbs-action="word-blank">Word</button></div></div><p>Лист ребенка содержит только пословицы. В протоколе специалиста предусмотрены пустые поля для дословных ответов и наблюдений; готовые толкования на бланке не печатаются.</p></section>'}
function processing(){return '<section class="pmpk-method-box"><h3>Обработка результатов</h3><p class="pmpk-note">Только качественная регистрация. Пустое поле не означает отсутствие понимания.</p>'+
 '<label class="pmpk-method-blockfield">Возраст *<select data-proverbs-age>'+opt(Array.from({length:8},(_,i)=>[String(i+11),String(i+11)+" лет"]),info.age)+'</select></label>'+
 '<div class="pmpk-method-grid">'+phrases.map((text,i)=>{const r=info.responses[i];return '<section class="pmpk-method-answer"><h4>'+(i+1)+'. '+esc(text)+'</h4>'+
 '<label>Характер ответа *<select data-proverbs-status="'+i+'">'+opt(codes,r.status)+'</select></label>'+
 (r.status==="skip"?'<label>Причина пропуска *<input data-proverbs-reason="'+i+'" value="'+esc(r.reason)+'"></label>':
 '<label>Дословный ответ *<textarea rows="2" data-proverbs-meaning="'+i+'">'+esc(r.meaning)+'</textarea></label>')+'</section>'}).join("")+'</div>'+
 '<label class="pmpk-method-blockfield">Общее качественное заключение *<textarea rows="4" data-proverbs-summary>'+esc(info.summary)+'</textarea></label></section>'}
function bodyPrint(kind){
 const header='<h1>'+esc(NAME)+'</h1><p>Возраст 11-18 лет. Рабочая серия общеупотребимых народных пословиц, регистрация Метоларии.</p>';
 const child=header+'<h2>Пословицы</h2><ol>'+phrases.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol>';
 const blank=header+'<h2>Протокол специалиста</h2><p>Код ____ Возраст ____ Дата ____</p>'+
 '<table><tr><th>Пословица</th><th>Дословный ответ</th><th>Наблюдения / помощь</th></tr>'+
 phrases.map(x=>'<tr><td>'+esc(x)+'</td><td>________________________</td><td>___________________</td></tr>').join("")+'</table>'+
 '<p>Обобщенный вывод: ______________________________________________</p>';
 const guide=header+'<h2>Цель</h2><p>Описание понимания переносного смысла и характера обобщений.</p>'+
 '<h2>Инструкция</h2><p>Объясни, что означает каждая пословица, какую общую мысль она передает.</p>'+
 '<h2>Проведение</h2><p>Предъявлять по одной из отдельного списка, записывать слова ребенка. При необходимости задавать нейтральный вопрос, фиксировать помощь.</p>'+
 '<h2>Качественный ключ</h2><p>Отличать переносный смысл, буквальное понимание, частный жизненный пример и иное объяснение. Общий нормативный балл не рассчитывается.</p><p>Источник: '+SOURCE+'</p>';
 if(kind==="guide")return guide;
 if(kind==="combined")return guide+'<div class="new-page"></div>'+blank;
 if(kind==="blank")return blank;
 if(kind==="child")return child;
 return header+'<h2>Качественный отчет</h2><p>Возраст: '+esc(info.age)+' лет.</p>'+
 info.responses.map((r,i)=>'<p>'+(i+1)+'. '+esc(phrases[i])+' – '+esc(r.status)+': '+esc(r.status==="skip"?r.reason:r.meaning)+'</p>').join("")+
 '<p>Вывод: '+esc(info.summary)+'</p><p>Без автоматических возрастных нормативов.</p>';
}
function print(kind){if(kind==="report"&&!ready())return;const page='<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>@page{size:A4;margin:17mm}body{font:10pt/1.5 Arial,sans-serif}h1{font-size:17pt}li{margin:6pt 0}table{border-collapse:collapse;width:100%}td,th{border:1px solid #777;padding:9px;text-align:left}tr{break-inside:avoid}.new-page{break-before:page;page-break-before:always}</style></head><body>'+bodyPrint(kind)+'</body></html>';const w=window.open("","_blank");if(!w){window.alert("Разрешите окно печати");return}w.document.open();w.document.write(page);w.document.close();w.focus();w.setTimeout(()=>w.print(),150)}
function word(kind){if(kind==="report"&&!ready())return;const lines=kind==="blank"?[NAME,"Протокол 11-18 лет",...phrases.map((x,i)=>(i+1)+". "+x+" Ответ: _____________"),"Качественное заключение: _______"]:
 [NAME,"Возраст: "+info.age+" лет",...info.responses.map((r,i)=>(i+1)+". "+phrases[i]+" – "+(r.status==="skip"?r.reason:r.meaning)+" ("+r.status+")"),"Вывод: "+info.summary];
 window.PSY_PMPK_SOURCED?.downloadLines?.(ID+"-"+kind,lines)}
function draw(){if(!overlay)return;const ok=ready();overlay.innerHTML='<section class="pmpk-method-shell" role="dialog" aria-modal="true" aria-labelledby="proverbsTitle"><header class="pmpk-method-header"><div><p class="pmpk-method-overline">Школа · 11-18 лет · словесное мышление</p><h2 id="proverbsTitle">'+esc(NAME)+'</h2></div><button type="button" class="pmpk-method-close" aria-label="Закрыть" data-proverbs-action="close">×</button></header>'+
 '<div class="pmpk-method-tabs" role="tablist">'+[["portfolio","Портфолио"],["guide","Методика / руководство"],["blank","Бланк"]].map(([k,v])=>'<button type="button" role="tab" data-proverbs-tab="'+k+'" aria-selected="'+(k===tab)+'">'+v+'</button>').join("")+'</div><div class="pmpk-method-content">'+(tab==="portfolio"?portfolio():tab==="guide"?guide():tab==="blank"?blankTab():processing())+'</div>'+
 '<footer class="pmpk-method-footer"><span data-proverbs-ready class="pmpk-status '+(ok?"is-done":"")+'">'+(ok?"Обработка заполнена":"Обработка не заполнена")+'</span>'+
 (tab==="processing"?'<div class="pmpk-method-right"><button type="button" class="pmpk-mini" data-proverbs-action="back">К портфолио</button><button type="button" class="pmpk-mini" data-proverbs-action="print-report" '+(!ok?"disabled":"")+'>Печать отчета</button><button type="button" class="pmpk-action primary" data-proverbs-action="word-report" '+(!ok?"disabled":"")+'>Word отчет</button></div>':
 '<button type="button" class="pmpk-action primary" data-proverbs-action="processing" style="margin-left:auto">Обработка результатов</button>')+'</footer></section>'}
function open(){if(overlay)return true;prior=document.activeElement;overlay=document.createElement("div");overlay.className="pmpk-method-overlay";document.body.appendChild(overlay);document.body.classList.add("pmpk-method-open");draw();document.addEventListener("keydown",escKey);overlay.querySelector('[data-proverbs-action="close"]')?.focus();return true}
function close(){if(!overlay)return;overlay.remove();overlay=null;document.body.classList.remove("pmpk-method-open");document.removeEventListener("keydown",escKey);if(prior?.isConnected)prior.focus()}
function escKey(e){if(e.key==="Escape"){e.preventDefault();close();return}if(e.key==="Tab"&&overlay){const items=[...overlay.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]')].filter(x=>x.getClientRects().length);if(items.length){const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}}
function update(){if(!overlay)return;const ok=ready(),stat=overlay.querySelector("[data-proverbs-ready]");if(stat){stat.textContent=ok?"Обработка заполнена":"Обработка не заполнена";stat.classList.toggle("is-done",ok)}overlay.querySelectorAll('[data-proverbs-action="print-report"],[data-proverbs-action="word-report"]').forEach(b=>b.disabled=!ok)}
function change(e){if(!overlay||!overlay.contains(e.target))return;const x=e.target;
 if(x.dataset.proverbsAge!==undefined){info.age=x.value;update();return}
 if(x.dataset.proverbsSummary!==undefined){info.summary=x.value;update();return}
 for(const [key,k]of [["proverbsMeaning","meaning"],["proverbsReason","reason"],["proverbsStatus","status"]]){
  if(x.dataset[key]!==undefined){const i=Number(x.dataset[key]);if(i<0||i>=phrases.length)return;info.responses[i][k]=x.value;if(k==="status")draw();else update();return}
 }
}
document.addEventListener("input",change);document.addEventListener("change",change);
document.addEventListener("click",e=>{if(!overlay||!overlay.contains(e.target))return;const b=e.target.closest("button");if(!b)return;
 if(b.dataset.proverbsTab){tab=b.dataset.proverbsTab;draw();return}
 const a=b.dataset.proverbsAction;if(a==="close")close();else if(a==="back"){tab="portfolio";draw()}else if(a==="processing"){tab="processing";draw()}else if(a.startsWith("print-"))print(a.slice(6));else if(a.startsWith("word-"))word(a.slice(5));
});
if(window.PSY_CATALOG&&!window.PSY_CATALOG.some(x=>x.name===NAME))window.PSY_CATALOG.push({id:ID,name:NAME,theme:"Мышление",author:"Классическая патопсихологическая проба; подбор народных пословиц Метоларии",age:"11-18 лет",format:"Словесная качественная проба",goal:"Понимание переносного смысла и обобщений.",source:SOURCE});
window.PSY_PMPK_PROVERBS={name:NAME,open,has:n=>n===NAME,test:{phrases:phrases.length,ready,initial:blank}};
})();
