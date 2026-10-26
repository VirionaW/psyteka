"use strict";
/* Обучающий эксперимент А. Я. Ивановой: два набора 24+24 фигур по опубликованному описанию.
   Новая геометрическая печать Психотеки, нормативные уровни не переносятся. */
(function(){
const NAME="Обучающий эксперимент А. Я. Ивановой (классификация фигур)";
const ID="pmpk-ivanova-learning-7-9";
const SOURCE="https://lektsii.org/3-751.html";
const ARTICLE="https://psyjournals.ru/journals/chp/archive/2011_n2/44482";
const PRIMARY=["#cf302a","#e4c832","#41965a"].flatMap(color=>["square","circle","triangle","diamond"].flatMap(shape=>[false,true].map(small=>({color,shape,small}))));
const TRANSFER=["#cf302a","#e4c832","#41965a","#277ac3"].flatMap(color=>["square","circle","pentagon"].flatMap(shape=>[false,true].map(small=>({color,shape,small}))));
const ESC=x=>String(x??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const labels=["Группировка по цвету","Группировка по форме","Группировка по величине"];
const transferOptions=[["full-verbal","Полный перенос, словесно 3 признака",0],["partial-verbal","Частичный перенос, словесно 2 признака",1],["full-actions","Полный перенос в действиях, без словесного обобщения",2],["partial-actions","Частичный перенос в действиях",3],["absent","Перенос отсутствует",4]];
const initial=()=>({age:"",orientation:"",lessons:["","",""],inertia:["","",""],speech:["","",""],seconds:["","","",""],transfer:"",notes:"",code:""});
let state=initial(),overlay=null,tab="portfolio",before=null;
const goodInt=(x,min,max)=>String(x).trim()!==""&&/^\d+$/.test(String(x))&&Number(x)>=min&&Number(x)<=max;
function ready(s=state){
 return ["7","8","9"].includes(s.age)&&["active","passive"].includes(s.orientation)&&
 [s.lessons,s.inertia].every(a=>a.length===3&&a.every(v=>goodInt(v,0,24)))&&
 s.speech.length===3&&s.speech.every(v=>v==="yes"||v==="no")&&
 s.seconds.length===4&&s.seconds.every(v=>goodInt(v,1,3600))&&transferOptions.some(x=>x[0]===s.transfer)&&!!s.notes.trim();
}
function scoring(s=state){
 if(!ready(s))return null;
 const orient=s.orientation==="active"?0:1;
 const lesson=s.lessons.reduce((n,x)=>n+Number(x),0);
 const inertia=s.inertia.reduce((n,x)=>n+Number(x),0);
 const missingSpeech=s.speech.filter(x=>x==="no").length;
 const transfer=transferOptions.find(x=>x[0]===s.transfer)[2];
 return {orient,lesson,inertia,missingSpeech,transfer,total:orient+lesson+inertia+missingSpeech+transfer};
}
function options(items,v){return '<option value="">Выберите</option>'+items.map(([key,label])=>'<option value="'+ESC(key)+'"'+(v===key?" selected":"")+'>'+ESC(label)+'</option>').join("")}
function cardSvg(f){
 const specs={circle:[75,50],square:[70,46.67],triangle:[70,46.67],diamond:[70,41.67],pentagon:[70,46.67]};
 const size=specs[f.shape][f.small?1:0],mid=50,lo=mid-size/2,hi=mid+size/2;
 const square='<rect x="'+lo+'" y="'+lo+'" width="'+size+'" height="'+size+'"/>';
 const circle='<circle cx="50" cy="50" r="'+size/2+'"/>';
 const triangle='<polygon points="50,'+lo+' '+lo+','+hi+' '+hi+','+hi+'"/>';
 const diamond='<polygon points="50,'+lo+' '+lo+',50 50,'+hi+' '+hi+',50"/>';
 const pentagon=(()=>{const pts=Array.from({length:5},(_,i)=>{const a=-Math.PI/2+i*2*Math.PI/5;return [mid+Math.cos(a)*size/2,mid+Math.sin(a)*size/2].map(v=>v.toFixed(2)).join(",")});return '<polygon points="'+pts.join(" ")+'"/>'})();
 return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;width:100%;height:100%"><g fill="'+f.color+'" stroke="#454545" stroke-width=".6">'+({square,circle,triangle,diamond,pentagon}[f.shape])+'</g></svg>';
}
function cardsHTML(transfer=false,forPrint=false){
 const arr=transfer?TRANSFER:PRIMARY,css="ivanova-cards "+(transfer?"ivanova-transfer":"ivanova-primary"),batch=transfer?12:6;
 const one=(pieces,offset)=>'<div class="'+css+'">'+pieces.map((f,i)=>'<div class="ivanova-figure" title="Фигура '+(offset+i+1)+'">'+cardSvg(f)+'</div>').join("")+'</div>';
 if(!forPrint)return one(arr,0);
 const parts=[];for(let i=0;i<arr.length;i+=batch)parts.push('<section class="ivanova-page">'+one(arr.slice(i,i+batch),i)+'</section>');
 return parts.join("");
}
function profile(){return '<section class="pmpk-method-box"><h3>Общие сведения</h3><div class="pmpk-method-facts">'+[
 ["Методика",NAME],["Автор","А. Я. Иванова, 1976"],["Возраст","7-9 лет (исследовательская редакция)"],
 ["Основной набор","24 фигуры: 3 цвета, 4 формы, 2 величины"],["Перенос","24 фигуры: 4 цвета, 3 формы, 2 величины"],["Тип","Обучающий эксперимент / исследование обучаемости"]].map(([a,b])=>'<div><small>'+ESC(a)+'</small><strong>'+ESC(b)+'</strong></div>').join("")+'</div></section>'+
 '<section class="pmpk-method-box"><h3>Цель</h3><p>Изучение самостоятельного выделения признаков, восприимчивости к дозированной помощи и переноса способа группировки на новый материал.</p><h3>Оценка</h3><p>Система показателей опубликована А. Я. Ивановой: ориентировка, число обучающих подсказок, инертность, словесное обобщение и характер переноса. Рабочая печать геометрических фигур подготовлена Психотекой и не является коммерческим оригинальным комплектом. Поэтому числовой показатель показывается вместе с составляющими, без диагностических уровней и порогов.</p>'+
 '<p><a href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">Описание редакции Ивановой, 1976</a> · <a href="'+ARTICLE+'" target="_blank" rel="noopener noreferrer">Исследовательский разбор методики</a></p></section>';
}
function guide(){return '<section class="pmpk-method-box"><div class="pmpk-toolbar"><h3>Методика / руководство</h3><div class="pmpk-actions">'+
 '<button type="button" class="pmpk-mini" data-ivanova-action="print-guide">Без бланка</button><button type="button" class="pmpk-action primary" data-ivanova-action="print-combined">С бланком</button></div></div>'+
 '<h4>Цель</h4><p>Оценка обучаемости посредством самостоятельной классификации и переноса после строго дозированных подсказок.</p>'+
 '<h4>Материалы</h4><p>Основной набор: 24 отдельные карточки 6x8 см, 3 цвета x 4 формы x 2 размера. Второй набор: 24 карточки 6x6 см, 4 цвета x 3 формы x 2 размера. Нужна также оригинальная ориентировочная доска 40x40 см, секундомер и лист регистрации.</p>'+
 '<p class="pmpk-note">Карточки Психотеки – вновь сверстанные комбинации по опубликованному описанию, не сертифицированная идентичная копия оригинального коммерческого набора.</p>'+
 '<h4>Инструкция ребенку</h4><blockquote>Рассмотри фигурки. Разложи те, которые подходят друг к другу. После этого попробуй разложить их по-другому.</blockquote><p class="pmpk-note">Рабочая реплика сокращена. Для дословного проведения применяйте полную последовательность инструкций из первоисточника.</p>'+
 '<h4>Процедура</h4><ol><li>Дать на 30 секунд ориентировочную доску, без дополнительных подсказок.</li><li>Предложить основную классификацию по цвету, затем по форме, затем по размеру (порядок первых двух может меняться при самостоятельном решении).</li><li>В каждой задаче после 30 секунд без самостоятельного решения предоставить дозированные уроки: показать различие двух карточек, затем сходство с третьей, затем принцип группировки.</li><li>При необходимости продолжать уроки с интервалом 30 секунд, фиксируя каждый, инертность и число подсказок.</li><li>После каждой классификации записать словесное объяснение ребенка.</li><li>Предъявить новый комплект из 24 фигур и исследовать самостоятельный перенос без обучения.</li></ol>'+
 '<h4>Ключ / расчет</h4><p>ПО = ОР + ВП + ЛП. ОР: активная ориентировка 0, пассивная 1. ВП: 1 за каждый урок и 1 за каждое проявление инертности. ЛП: по 1 за отсутствие словесного объяснения в каждой основной задаче плюс категория переноса: полный словесный 0, частичный словесный 1, полный практический 2, частичный практический 3, отсутствует 4.</p>'+
 '<h4>Интерпретация</h4><p>Описывается структура помощи и возможность переноса. Не использовать произвольные пороги для постановки диагноза и не переносить нормы коммерческой версии на рабочие карточки Психотеки.</p><p><a href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">Первоисточник процедуры и ключа</a></p></section>';
}
function blank(){return '<section class="pmpk-method-box"><div class="pmpk-toolbar"><div><h3>Бланк и стимулы</h3><p class="pmpk-note">Рабочий протокол – специалисту. Геометрические карточки распечатываются отдельно для физической работы с ребенком.</p></div><div class="pmpk-actions">'+
 '<button type="button" class="pmpk-mini" data-ivanova-action="print-blank">Печать протокола</button><button type="button" class="pmpk-mini" data-ivanova-action="print-primary">24 карточки: основной набор</button><button type="button" class="pmpk-mini" data-ivanova-action="print-transfer">24 карточки: перенос</button><button type="button" class="pmpk-action primary" data-ivanova-action="docx-blank">Word протокол</button></div></div>'+
 '<div class="pmpk-method-box"><h4>Основной набор – просмотр</h4>'+cardsHTML(false)+'</div><div class="pmpk-method-box"><h4>Набор для переноса – просмотр</h4>'+cardsHTML(true)+'</div>'+
 '<p class="pmpk-note">Экранный просмотр предназначен только для подготовки материала. Рекомендуется распечатать и вырезать карточки, проверить реальные размеры. Ориентировочная доска 40x40 см по оригинальному описанию изготавливается отдельно.</p></section>';
}
function processing(){const result=scoring();return '<section class="pmpk-method-box"><h3>Обработка результатов обучающего эксперимента</h3><p class="pmpk-note">Введите зарегистрированные уроки, инертность и объяснение каждой группировки. Пустой ответ – не ноль.</p>'+
 '<div class="pmpk-method-fields"><label>Возраст *<select data-ivanova-field="age">'+options([["7","7 лет"],["8","8 лет"],["9","9 лет"]],state.age)+'</select></label><label>Ориентировка *<select data-ivanova-field="orientation">'+options([["active","Активная (0)"],["passive","Пассивная (1)"]],state.orientation)+'</select></label></div>'+
 '<div class="pmpk-method-grid">'+labels.map((label,i)=>'<section class="pmpk-method-answer"><h4>'+(i+1)+'. '+ESC(label)+'</h4><label>Число уроков-подсказок *<input type="number" min="0" max="24" step="1" data-ivanova-series="lessons" data-ivanova-index="'+i+'" value="'+ESC(state.lessons[i])+'"></label>'+
 '<label>Проявления инертности *<input type="number" min="0" max="24" step="1" data-ivanova-series="inertia" data-ivanova-index="'+i+'" value="'+ESC(state.inertia[i])+'"></label>'+
 '<label>Самостоятельное словесное обобщение *<select data-ivanova-series="speech" data-ivanova-index="'+i+'">'+options([["yes","Есть (0)"],["no","Нет (1)"]],state.speech[i])+'</select></label>'+
 '<label>Время, секунд *<input type="number" min="1" max="3600" data-ivanova-series="seconds" data-ivanova-index="'+i+'" value="'+ESC(state.seconds[i])+'"></label></section>').join("")+'</div>'+
 '<div class="pmpk-method-fields"><label>Логический перенос *<select data-ivanova-field="transfer">'+options(transferOptions,state.transfer)+'</select></label>'+
 '<label>Время переноса, секунд *<input type="number" min="1" max="3600" data-ivanova-series="seconds" data-ivanova-index="3" value="'+ESC(state.seconds[3])+'"></label></div>'+
 '<label class="pmpk-method-blockfield">Действия, высказывания ребенка и контекст помощи *<textarea rows="4" data-ivanova-field="notes">'+ESC(state.notes)+'</textarea></label>'+
 '<div data-ivanova-result>'+resultHTML()+'</div></section>';
}
function resultHTML(){const s=scoring();return s?'<section class="pmpk-sourced-result"><h3>Показатель обучаемости: '+s.total+'</h3><p>ОР: '+s.orient+'; уроки: '+s.lesson+'; инертность: '+s.inertia+'; отсутствие словесных формулировок: '+s.missingSpeech+'; перенос: '+s.transfer+'.</p><p>Без нормативного уровня для собственной верстки стимулов.</p></section>':
 '<p class="pmpk-note">Регистрация не завершена. Для правильного итога заполните все обязательные поля.</p>'}
function formPrint(){return '<h1>Обучающий эксперимент А. Я. Ивановой</h1><p>Протокол специалиста · 7-9 лет, рабочая регистрация Психотеки</p><p>Код: ___________ Дата: ___________ Возраст: ___________</p>'+
 '<table><tr><th>Задача</th><th>Время</th><th>Уроки</th><th>Инертность</th><th>Словесный отчет</th></tr>'+labels.map(t=>'<tr><td>'+ESC(t)+'</td><td>_____</td><td>_____</td><td>_____</td><td>_____</td></tr>').join("")+
 '<tr><td>Перенос</td><td>_____</td><td colspan="3">Вид переноса: ___________________</td></tr></table><p>Дословные наблюдения / помощь: ______________________________________________________</p><p>ОР __ + ВП __ + ЛП __ = ПО __</p>'}
function guidePrint(){return '<h1>'+ESC(NAME)+'</h1><p>А. Я. Иванова, 1976; 7-9 лет.</p><h2>Цель</h2><p>Изучение обучаемости, дозированной помощи и переноса.</p>'+
 '<h2>Инструкция</h2><p>Разложи фигурки, подходящие друг к другу; затем попробуй другой способ.</p><h2>Процедура</h2><p>30 секунд ориентировки на доску; последовательная классификация по цвету, форме, величине; помощь каждые 30 секунд по источнику; словесные отчеты после каждой задачи; затем самостоятельный перенос на новом наборе.</p>'+
 '<h2>Ключ</h2><p>ПО=ОР+ВП+ЛП; ОР 0/1; ВП – уроки и инертность; ЛП – отсутствующие объяснения и категория переноса 0-4. Возрастные уровни не используются с новой версткой.</p><p>Источник: '+SOURCE+'</p>'}
function print(kind){
 if(kind==="report"&&!scoring())return;
 let body=kind==="guide"?guidePrint():kind==="combined"?guidePrint()+'<div class="pagebreak"></div>'+formPrint():
 kind==="blank"?formPrint():kind==="primary"||kind==="transfer"?
 '<h1>'+ESC(NAME)+'</h1><p>'+(kind==="primary"?"Основной набор · карточки 6x8 см":"Набор для переноса · карточки 6x6 см")+'. Вырезать по границе.</p>'+cardsHTML(kind==="transfer",true):
 '<h1>Результат</h1><p>Возраст: '+ESC(state.age)+' лет. ПО: '+scoring().total+'</p>'+[scoring().orient,scoring().lesson,scoring().inertia,scoring().missingSpeech,scoring().transfer].map((x,i)=>'<p>'+["ОР","Уроки","Инертность","Нет формулировок","Перенос"][i]+': '+x+'</p>').join("")+'<p>'+ESC(state.notes)+'</p>';
 const css='@page{size:A4;margin:12mm}body{font:10pt/1.42 Arial,sans-serif;color:#222}h1{font-size:16pt}.pagebreak{break-before:page;page-break-before:always}table{width:100%;border-collapse:collapse}th,td{border:1px solid #777;padding:7px}tr{break-inside:avoid}'+
 '.ivanova-page:not(:last-child){break-after:page;page-break-after:always}.ivanova-cards{display:grid;gap:0}.ivanova-primary{grid-template-columns:repeat(2,60mm)}.ivanova-transfer{grid-template-columns:repeat(3,60mm)}'+
 '.ivanova-figure{border:1px dashed #999;display:flex;align-items:center;justify-content:center;break-inside:avoid;page-break-inside:avoid}.ivanova-primary .ivanova-figure{width:60mm;height:80mm}.ivanova-transfer .ivanova-figure{width:60mm;height:60mm}'+
 '.ivanova-figure svg{width:100%;height:100%}';
 const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>'+css+'</style></head><body>'+body+'</body></html>';
 const w=window.open("","_blank");if(!w){window.alert("Разрешите окно печати");return}w.document.open();w.document.write(html);w.document.close();w.focus();w.setTimeout(()=>w.print(),200);
}
function word(kind){if(kind==="report"&&!scoring())return;
 const lines=kind==="blank"?[NAME,"Протокол 7-9 лет, А. Я. Иванова",...labels.map(x=>x+": время____ уроки____ инертность____ словесно____"),"Перенос: ______ Время: ______","ОР__ + ВП__ + ЛП__ = ПО__","Наблюдения: ______"]:
 [NAME,"Возраст: "+state.age+" лет","ОР: "+scoring().orient,"Подсказки: "+scoring().lesson,"Инертность: "+scoring().inertia,"Пропущенные объяснения: "+scoring().missingSpeech,"Перенос: "+scoring().transfer,"ПО: "+scoring().total,"Наблюдения: "+state.notes,"Нормативный уровень не определяется."];
 window.PSY_PMPK_SOURCED?.downloadLines?.(ID+"-"+kind,lines);
}
function draw(){if(!overlay)return;const ok=ready();overlay.innerHTML='<section class="pmpk-method-shell" role="dialog" aria-modal="true" aria-labelledby="ivanovaTitle">'+
 '<header class="pmpk-method-header"><div><p class="pmpk-method-overline">Школа · 7-9 лет · обучаемость</p><h2 id="ivanovaTitle">'+ESC(NAME)+'</h2></div><button type="button" class="pmpk-method-close" aria-label="Закрыть" data-ivanova-action="close">×</button></header>'+
 '<div class="pmpk-method-tabs" role="tablist">'+[["portfolio","Портфолио"],["guide","Методика / руководство"],["blank","Бланк"]].map(([key,text])=>'<button type="button" role="tab" data-ivanova-tab="'+key+'" aria-selected="'+(key===tab)+'">'+text+'</button>').join("")+'</div>'+
 '<div class="pmpk-method-content">'+(tab==="portfolio"?profile():tab==="guide"?guide():tab==="blank"?blank():processing())+'</div>'+
 '<footer class="pmpk-method-footer"><span data-ivanova-status class="pmpk-status '+(ok?"is-done":"")+'">'+(ok?"Обработка заполнена":"Обработка не заполнена")+'</span>'+
 (tab==="processing"?'<div class="pmpk-method-right"><button type="button" class="pmpk-mini" data-ivanova-action="back">К портфолио</button><button type="button" class="pmpk-mini" data-ivanova-action="print-report" '+(!ok?"disabled":"")+'>Печать отчета</button><button type="button" class="pmpk-action primary" data-ivanova-action="docx-report" '+(!ok?"disabled":"")+'>Скачать отчет Word</button></div>':
 '<button type="button" class="pmpk-action primary" data-ivanova-action="processing" style="margin-left:auto">Обработка результатов</button>')+'</footer></section>'}
function open(){if(overlay)return true;before=document.activeElement;overlay=document.createElement("div");overlay.className="pmpk-method-overlay";document.body.appendChild(overlay);document.body.classList.add("pmpk-method-open");tab="portfolio";draw();document.addEventListener("keydown",escKey);overlay.querySelector('[data-ivanova-action="close"]')?.focus();return true}
function close(){if(!overlay)return;overlay.remove();overlay=null;document.body.classList.remove("pmpk-method-open");document.removeEventListener("keydown",escKey);if(before?.isConnected)before.focus()}
function escKey(e){if(e.key==="Escape"){e.preventDefault();close();return}if(e.key==="Tab"&&overlay){const items=[...overlay.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]')].filter(x=>x.getClientRects().length);if(items.length){const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}}
function update(){if(!overlay)return;const ok=ready(),status=overlay.querySelector("[data-ivanova-status]");if(status){status.textContent=ok?"Обработка заполнена":"Обработка не заполнена";status.classList.toggle("is-done",ok)}
 overlay.querySelectorAll('[data-ivanova-action="print-report"],[data-ivanova-action="docx-report"]').forEach(b=>b.disabled=!ok);const res=overlay.querySelector("[data-ivanova-result]");if(res)res.innerHTML=resultHTML()}
function input(e){if(!overlay||!overlay.contains(e.target))return;const x=e.target;if(x.dataset.ivanovaField){state[x.dataset.ivanovaField]=x.value;update();return}if(x.dataset.ivanovaSeries){const key=x.dataset.ivanovaSeries,i=+x.dataset.ivanovaIndex;if(Array.isArray(state[key])&&i>=0&&i<state[key].length){state[key][i]=x.value;update()}}}
document.addEventListener("input",input);document.addEventListener("change",input);
document.addEventListener("click",e=>{if(!overlay||!overlay.contains(e.target))return;const b=e.target.closest("button");if(!b)return;
 if(b.dataset.ivanovaTab){tab=b.dataset.ivanovaTab;draw();return}
 const a=b.dataset.ivanovaAction;if(a==="close")close();else if(a==="back"){tab="portfolio";draw()}else if(a==="processing"){tab="processing";draw()}else if(a.startsWith("print-"))print(a.slice(6));else if(a.startsWith("docx-"))word(a.slice(5));
});
if(window.PSY_CATALOG&&!window.PSY_CATALOG.some(x=>x.name===NAME))window.PSY_CATALOG.push({id:ID,name:NAME,author:"А. Я. Иванова, 1976",age:"7-9 лет",theme:"Мышление",format:"Обучающий эксперимент",goal:"Классификация 24+24 фигур, дозированная помощь и перенос.",source:SOURCE});
window.PSY_PMPK_IVANOVA={name:NAME,id:ID,open,has:name=>name===NAME,test:{primary:PRIMARY.length,transfer:TRANSFER.length,ready,scoring,initial}};
})();
