"use strict";
/* Корректурная проба Бурдона - Анфимова: рабочая буквенная модификация.
   Одна фиксированная таблица 30x30 используется и для печати, и для расчета.
   Нормативные шкалы НЕ перенесены на измененный стимульный материал. */
(function(){
const TITLE="Корректурная проба Бурдона - Анфимова";
const alphabet=["А","В","Е","И","К","Н","С","Х"];
const target=new Set(["А","К","С"]);
const GRID=[];
let x=0x31415926;
for(let i=0;i<900;i++){
 x^=x<<13;x^=x>>>17;x^=x<<5;
 GRID.push(alphabet[(x>>>24)&7]);
}
const PREFIX=[0];
for(let i=0;i<900;i++)PREFIX.push(PREFIX[i]+(target.has(GRID[i])?1:0));
const SOURCE="https://ddt-msh.edu.yar.ru/4__danilova_e_e__praktikum_po_ped__psihologii.pdf";
const GENERAL="https://psyjournals.ru/nonserialpublications/oecbdcsect2017/oecbdcsect2017.pdf";
const D=window.PSY_FULL_METHODS;
D[TITLE]={
 author:"Б. Бурдон; вариант буквенной корректурной пробы по В. Я. Анфимову",
 age:"Младший школьный возраст и старше; без подтвержденных возрастных норм для данного листа",
 kind:"Диагностическая буквенная проба на внимание",
 count:"30 строк × 30 букв (900 знаков); 5 минут",
 goal:"Наблюдение за темпом, точностью и динамикой зрительного поиска на фиксированной буквенной таблице.",
 instructions:"Предъявите печатный лист с 30 строками по 30 букв. Испытуемый просматривает слева направо строку за строкой, обводит А, вычеркивает С и К. Каждую минуту психолог подает сигнал «Черта!», а испытуемый ставит отметку достигнутого места. Через 5 минут работу останавливают. Для каждой минуты перенесите конечную позицию и количество верно/ошибочно отмеченных знаков.",
 scoring:"Для каждой минуты по фиксированному бланку вычисляется число целевых букв в просмотренном интервале; пропуски = целевые буквы минус верные отметки. Ошибочные отметки регистрируются отдельно. Скорость = просмотренные знаки / 5 минут. Доля верных отметок среди целевых и ошибочно выделенных = правильные / (целевые + ошибочные отметки) × 100%. Это описательные показатели, не нормативные коэффициенты.",
 interpret:"Сопоставляйте поминутную динамику темпа и ошибок с условиями проведения и наблюдением. Нельзя присваивать диагностические уровни или возрастные нормы по самостоятельно сгенерированному листу.",
 warning:"Варианты корректурной пробы различаются стимульными листами, целевыми буквами, временем и формулами. Этот лист 30×30 - новая фиксированная учебно-рабочая модификация, а не стандартизированный авторский бланк. Количественный расчет верен только для приложенного листа. Возрастная нормативная интерпретация отключена.",
 license:"Методическое руководство и фиксированный стимульный лист подготовлены для Метоларии; нет утверждения, что это опубликованный нормативный бланк. Описание практикума по возрастной психологии приведено как методическая основа.",
 source:SOURCE, sourceAlternative:GENERAL,
 guideFile:"downloads/bourdon_anfimov_guide.docx",
 answerFile:"downloads/bourdon_anfimov_student.html",
 workflow:"bourdon30",calculator:true, questions:Array.from({length:5},(_,i)=>"Минута "+(i+1)),
 scaleLabels:["Темп выполнения","Пропуски целевых букв","Ложные отметки","Точность выполнения"]
};
const e=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function inspect(answers){
 if(!Array.isArray(answers)||answers.length<15)return {status:"incomplete"};
 const values=answers.slice(0,15).map(v=>v===""||v===null||v===undefined?NaN:Number(v));
 if(values.some(n=>!Number.isInteger(n)||n<0))return {status:"incomplete"};
 let prev=0,rows=[];
 for(let i=0;i<5;i++){
  const end=values[i*3],correct=values[i*3+1],falseMarks=values[i*3+2];
  if(end<prev||end>900)return {status:"invalid",reason:"Конечная позиция каждой минуты должна возрастать или оставаться прежней, от 0 до 900."};
  const scanned=end-prev,targets=PREFIX[end]-PREFIX[prev];
  if(correct>targets)return {status:"invalid",reason:"За минуту нельзя правильно отметить больше целевых букв, чем имеется в просмотренном участке. Проверьте позицию и подсчет."};
  if(falseMarks>scanned-targets)return {status:"invalid",reason:"Ошибочных отметок больше числа нецелевых букв в просмотренном участке."};
  rows.push({minute:i+1,from:prev,to:end,scanned,targets,correct,missed:targets-correct,falseMarks});
  prev=end;
 }
 if(prev===0)return {status:"invalid",reason:"Не указано ни одного просмотренного символа."};
 const sum=k=>rows.reduce((a,r)=>a+r[k],0),total=sum("scanned"),right=sum("correct"),missed=sum("missed"),wrong=sum("falseMarks"),denom=right+missed+wrong;
 return {status:"complete",scanned:total,correct:right,missed,falseMarks:wrong,minutes:rows,pace:Number((total/5).toFixed(1)),accuracy:denom?Number((right/denom*100).toFixed(1)):null,targets:sum("targets"),max:900};
}
function score(d,a){const x=inspect(a);return x.status==="complete"?x:null}
function docLinks(d){return '<div class="psy-bourdon-links"><a class="btn primary" href="'+e(d.guideFile)+'" download>Методика · Word</a><a class="btn" href="'+e(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Бланк ученика · печать ↗</a><a class="btn" href="'+e(d.source)+'" target="_blank" rel="noopener noreferrer">Методический источник ↗</a></div>';}
function instructions(d){return '<h3>Проведение</h3><p>'+e(d.instructions)+'</p>'+docLinks(d)+'<div class="notice psy-bourdon-alert">'+e(d.warning)+'</div><h3>Как учитывать позиции</h3><p>Нумерация идет от 1 до 900. Если просмотрено 6 полных строк и 5 букв следующей строки, конечная позиция - <strong>185</strong>. Отмечайте позиции в конце каждой минуты, затем считайте верные и ошибочные выделения <em>только в участке этой минуты</em>.</p><h3>Обработка</h3><p>'+e(d.scoring)+'</p>';}
function materials(d){
 const letterRows=Array.from({length:30},(_,i)=>'<div class="psy-bourdon-line"><span>'+(i+1).toString().padStart(2,"0")+'</span><div>'+GRID.slice(i*30,(i+1)*30).map((v,j)=>'<b>'+e(v)+'</b>').join("")+'</div></div>').join("");
 return '<h3>Печатный буквенный лист</h3><div class="notice">Рабочая модификация 30×30. Печатайте бланк без масштабирования; не изменяйте последовательность букв. Для точного подсчета используйте только этот вариант.</div>'+docLinks(d)+'<div class="psy-bourdon-paper"><p>Обвести А, вычеркнуть С и К. Отметка «Черта!» каждую минуту.</p>'+letterRows+'</div><p>Зафиксируйте после каждой минуты номер последнего просмотренного знака, правильные и ошибочные отметки.</p>';
}
function processing(d){
 return '<h3>Проверка по листу 30×30</h3><p>'+e(d.scoring)+'</p>'+
 '<div class="psy-bourdon-key"><div><b>900</b><span>Всего символов</span></div><div><b>'+PREFIX[900]+'</b><span>Целевых А, С, К</span></div><div><b>5</b><span>Одноминутных отрезков</span></div></div>'+
 '<p>Общее число целевых букв определяется автоматически в диапазоне просмотренных знаков, поэтому пропуски не нужно подсчитывать вручную.</p><div class="notice psy-bourdon-alert">'+e(d.warning)+'</div>'+
 '<h3>Первоисточники</h3><p><a href="'+e(d.source)+'" target="_blank" rel="noopener noreferrer">Практикум по педагогической психологии (описание варианта корректурной пробы) ↗</a></p>';
}
function summary(d,answers){
 const val=inspect(answers);
 if(val.status==="incomplete")return '<div class="psy-bourdon-summary"><h3>Профиль результата</h3><p>Для расчета укажите все 15 чисел: конечную позицию, верные и ложные отметки для каждой из пяти минут. Нулевые отметки вводите как 0.</p></div>';
 if(val.status==="invalid")return '<div class="notice psy-bourdon-alert"><strong>Проверьте запись: </strong>'+e(val.reason)+'</div>';
 const item=(title,value,detail)=>'<div class="psy-bourdon-stat"><span>'+e(title)+'</span><strong>'+e(value)+'</strong><small>'+e(detail)+'</small></div>';
 return '<div class="psy-bourdon-summary"><h3>Профиль результата</h3><div class="psy-bourdon-stats">'+item("Просмотрено",val.scanned+" / 900","знаков за 5 минут")+item("Темп",val.pace,"знаков/мин")+item("Верно отмечено",val.correct,"целевых букв")+item("Пропущено",val.missed,"целевых букв")+item("Ложных отметок",val.falseMarks,"нецелевых букв")+item("Описательная точность",val.accuracy===null?"—":val.accuracy+"%","без нормативного уровня")+'</div>'+
 '<h3>Поминутная динамика</h3><div class="psy-bourdon-bars">'+val.minutes.map(v=>'<div><span>'+v.minute+'-я мин.</span><div class="psy-bourdon-track"><i style="width:'+(v.scanned/900*100)+'%"></i></div><strong>'+v.scanned+' зн.</strong><small>'+v.missed+' проп. · '+v.falseMarks+' ложн.</small></div>').join("")+'</div>'+
 '<div class="notice">Эти показатели описывают выполнение конкретного бланка и не являются возрастными нормами или диагнозом.</div></div>';
}
function calculator(d,ctx){
 const persons=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}];
 const p=persons[ctx.rowIndex]||persons[0],a=p.answers||[];
 let html='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа</button></div>'+
 '<div class="notice">Перенесите показатели именно с <a href="'+e(d.answerFile)+'" target="_blank" rel="noopener noreferrer">этого печатного бланка ↗</a>. Для каждой минуты: конечная позиция (от 0 до 900), правильные отметки, ложные отметки. Пропуски подсчитываются автоматически.</div>';
 if(ctx.calcMode==="class")html+='<div class="group-tools"><label>Участник <select id="participantSelect">'+persons.map((r,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+(i+1)+'. '+e(r.name||"Код "+(i+1))+'</option>').join("")+'</select></label><label>Код (без ФИО)<input id="participantName" placeholder="Код" value="'+e(p.name||"")+'"></label><button class="btn" id="addParticipant">Добавить</button></div>';
 html+='<div class="psy-bourdon-inputs">'+Array.from({length:5},(_,i)=>'<div class="psy-bourdon-minute"><h4>'+(i+1)+'-я минута</h4>'+[["Конечная позиция",0],["Правильно отмечено",1],["Ошибочно отмечено",2]].map(([lab,j])=>'<label><span>'+e(lab)+'</span><input inputmode="numeric" type="number" min="0" max="900" step="1" data-bourdon="'+(i*3+j)+'" value="'+e(a[i*3+j]??"")+'" placeholder="0"></label>').join("")+'</div>').join("")+'</div><div id="bourdonSummary">'+summary(d,a)+'</div>';
 html+='<div class="psy-bourdon-actions"><button class="btn" id="resetParticipant">Очистить ответы</button><button class="btn primary" id="bourdonJSON">Индивидуальный результат · JSON</button></div>';
 if(ctx.calcMode==="class")html+='<h3>Групповые результаты</h3><div class="results-table"><table><thead><tr><th>Код</th><th>Знаки</th><th>Верно</th><th>Пропуски</th><th>Ложные</th><th>Точность</th></tr></thead><tbody>'+persons.map((r,i)=>{const z=score(d,r.answers);return '<tr><td>'+e(r.name||"Код "+(i+1))+'</td><td>'+(z?.scanned??"—")+'</td><td>'+(z?.correct??"—")+'</td><td>'+(z?.missed??"—")+'</td><td>'+(z?.falseMarks??"—")+'</td><td>'+(z?.accuracy===null||!z?"—":z.accuracy+"%")+'</td></tr>';}).join("")+'</tbody></table></div><div class="psy-bourdon-actions"><button class="btn primary" id="bourdonCSV">Скачать таблицу группы · CSV</button></div>';
 return html;
}
function save(fname,text,mime){const b=new Blob([text],{type:mime}),url=URL.createObjectURL(b),a=document.createElement("a");a.href=url;a.download=fname;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function bind(d,ctx){
 document.querySelectorAll("[data-bourdon]").forEach(el=>el.addEventListener("input",()=>{
  const n=+el.dataset.bourdon;
  ctx.rows[ctx.rowIndex].answers[n]=el.value===""?"":Number(el.value);
  const root=document.querySelector("#bourdonSummary");if(root)root.innerHTML=summary(d,ctx.rows[ctx.rowIndex].answers);
 }));
 document.querySelector("#bourdonJSON")?.addEventListener("click",()=>{const r=ctx.rows[ctx.rowIndex];const payload={method:TITLE,form:"working-grid-30x30-fixed-2026-10",code:r.name||"",answers:r.answers||[],result:inspect(r.answers||[]),source:d.source,warning:d.warning};save("bourdon_individual.json",JSON.stringify(payload,null,2),"application/json;charset=utf-8");});
 document.querySelector("#bourdonCSV")?.addEventListener("click",()=>{const csv=[["Код","Просмотрено","Правильно","Пропущено","Ложные отметки","Точность %"],...ctx.rows.map((r,i)=>{const z=score(d,r.answers);return [r.name||"Код "+(i+1),z?.scanned??"",z?.correct??"",z?.missed??"",z?.falseMarks??"",z?.accuracy??""];})];save("bourdon_group.csv","\uFEFF"+csv.map(row=>row.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(";")).join("\r\n"),"text/csv;charset=utf-8")});
}
window.PSY_BOURDON={score,inspect,materials,instructions,processing,calculator,bind,grid:GRID.slice(),prefix:PREFIX.slice()};
})();