"use strict";
/* Дембо - Рубинштейн, адаптация А. М. Прихожан.
   7 линий по 100 мм, здоровье тренировочная, средние по оставшимся 6. */
(function(){
 const NAME="Самооценка Дембо - Рубинштейн";
 const SOURCE="https://psylist.net/praktikum/15-htm";
 const PDF="https://iro23.ru/wp-content/uploads/2024/01/141_%E2%84%9618.pdf";
 const LABELS=["Здоровье (тренировочная)","Ум, способности","Характер","Авторитет у сверстников","Умелые руки","Внешность","Уверенность в себе"];
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const WARNING="В публикациях встречаются варианты названий шкал и способы суммирования (среднее арифметическое или медиана), а приводимые нормы относятся к определенным возрастным выборкам. Здесь выбран вариант А. М. Прихожан: семь линий по 100 мм, «Здоровье» — тренировочная, основная обработка по шести шкалам. Возрастные уровни автоматически не присваиваются.";
 const d=window.PSY_FULL_METHODS[NAME]||{};
 Object.assign(d,{
  author:"Т. В. Дембо, С. Я. Рубинштейн; модификация А. М. Прихожан",
  age:"Подростки; нормативные ориентиры выбранных публикаций относятся преимущественно к 7-10 классам",
  kind:"Графическая диагностическая методика",
  count:"7 вертикальных шкал по 100 мм, по 2 отметки",
  goal:"Изучение актуальной самооценки, уровня притязаний и расхождения между ними в шести личностных сферах.",
  instructions:"На семи вертикальных шкалах поставьте черту (—) в точке, соответствующей тому, как вы оцениваете качество у себя сейчас, затем крестик (×) на желаемом уровне. Нижний конец каждой линии — 0, верхний — 100. Начните со шкалы «Здоровье», чтобы проверить понимание задания. Не показывайте ребенку результаты подсчета заранее.",
  scoring:"Для каждой шкалы: самооценка = мм от нижней границы до черты, уровень притязаний = мм до крестика, расхождение = притязания − самооценка. Основные сводные показатели — средние арифметические по шести шкалам, исключая тренировочное «Здоровье». Дополнительно показывается медиана для сопоставления редакций.",
  interpret:"Используйте профиль шести шкал, средние показатели и качественное объяснение ребенка. Отрицательное расхождение означает, что отмеченный желаемый уровень ниже текущего. Автоматическая постановка диагноза, риск-категории и универсальные возрастные нормативы не предусмотрены.",
  warning:WARNING,source:SOURCE,sourcePDF:PDF,officialBlank:PDF,
  guideFile:"downloads/dembo_prikhozhan_guide.docx",
  answerFile:"downloads/dembo_prikhozhan_student.html",
  workflow:"dembo7",graphic:"dembo",calculator:true,
  scales:LABELS.map((name,i)=>({name,training:i===0})),
  questions:LABELS,
  scaleLabels:["Самооценка","Уровень притязаний","Расхождение"],
  version:"Модификация А. М. Прихожан, 7 линий по 100 мм"
 });
 window.PSY_FULL_METHODS[NAME]=d;
 const isValid=v=>v!==""&&v!==null&&v!==undefined&&Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<=100;
 const round=x=>Math.round(x*10)/10;
 const avg=a=>round(a.reduce((x,y)=>x+y,0)/a.length);
 function median(a){const x=[...a].sort((a,b)=>a-b),n=x.length;return round((x[(n-1)>>1]+x[n>>1])/2);}
 function inspect(a){
  if(!Array.isArray(a))return {status:"incomplete",complete:0};
  const complete=Array.from({length:7},(_,i)=>isValid(a[i*2])&&isValid(a[i*2+1])).filter(Boolean).length;
  if(complete<7)return {status:"incomplete",complete};
  const rows=LABELS.map((name,i)=>{
   const esteem=Number(a[2*i]),aspiration=Number(a[2*i+1]);
   return {name,training:i===0,esteem,aspiration,gap:aspiration-esteem};
  });
  const main=rows.slice(1);
  return {status:"complete",rows,
    mean:{esteem:avg(main.map(x=>x.esteem)),aspiration:avg(main.map(x=>x.aspiration)),gap:avg(main.map(x=>x.gap))},
    median:{esteem:median(main.map(x=>x.esteem)),aspiration:median(main.map(x=>x.aspiration)),gap:median(main.map(x=>x.gap))},
    complete:7,range:"0-100",caption:"Средние показатели шести оцениваемых шкал"};
 }
 function score(d,answers){const o=inspect(answers);return o.status==="complete"?o:null;}
 function links(d){return '<div class="psy-dembo-links"><a class="btn primary" href="'+esc(d.guideFile)+'" download>Методика и протокол · Word</a><a class="btn" href="'+esc(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Бланк ученика · A4 ↗</a><a class="btn" href="'+esc(d.source)+'" target="_blank" rel="noopener noreferrer">Методический источник ↗</a></div>';}
 function instruction(d){
  return '<h3>Проведение</h3><p>'+esc(d.instructions)+'</p>'+links(d)+
  '<h3>Семь шкал</h3><ol>'+LABELS.map((s,i)=>'<li>'+esc(s)+(i===0?' — тренировочная, не входит в средние':'')+'</li>').join("")+'</ol>'+
  '<h3>Измерение</h3><p>Распечатайте бланк с сохранением масштаба 100%. Измеряйте от нижней границы каждой вертикальной линии: черта «—» = текущая самооценка, крестик «×» = желаемый уровень. Полученные миллиметры затем перенесите в обработчик.</p>'+
  '<div class="notice psy-dembo-warning">'+esc(d.warning)+'</div>';
 }
 function scaleSVG(demo=false){
  const yTop=14,yBottom=114,items=LABELS.map((name,i)=>{
   const x=20+i*26;
   return '<g><path d="M'+x+' '+yTop+'V'+yBottom+'" stroke="#234d3b" stroke-width="0.5"/>'+
     '<path d="M'+(x-3)+' '+yTop+'h6M'+(x-3)+' '+yBottom+'h6" stroke="#234d3b" stroke-width="0.7"/>'+
     '<circle cx="'+x+'" cy="64" r=".55" fill="#92a99a"/>'+
     '<text x="'+x+'" y="125" fill="#365946" font-size="3.35" text-anchor="middle">'+(i+1)+'</text></g>';
  }).join("");
  return '<svg class="psy-dembo-preview" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 196 145" role="img" aria-label="Семь вертикальных линий, шкала 0-100">'+
     '<rect x="0" y="0" width="196" height="145" fill="white"/><text x="5" y="11" font-size="4" fill="#577969">100</text><text x="7" y="117" font-size="4" fill="#577969">0</text>'+items+'</svg>';
 }
 function materials(d){
  return '<h3>Печатный бланк с семью шкалами</h3><div class="notice">Семь вертикальных линий длиной 100 мм. На листе отметьте текущую самооценку чертой «—» и уровень притязаний крестиком «×». Первая шкала тренировочная.</div>'+links(d)+
     '<div class="psy-dembo-paper">'+scaleSVG()+'</div><p>Для точного измерения в миллиметрах используйте файл A4, а не экранный предварительный просмотр.</p>';
 }
 function processing(d){
  return '<h3>Показатели и ключ</h3><p>'+esc(d.scoring)+'</p>'+
  '<div class="psy-dembo-formula"><div><b>Самооценка</b><span>0-100 мм до «—»</span></div><div><b>Притязания</b><span>0-100 мм до «×»</span></div><div><b>Разница</b><span>Притязания − самооценка</span></div></div>'+
  '<p>Обработке подлежат шесть шкал со 2-й по 7-ю. Здоровье — упражнение для понимания отметок. Среднее арифметическое — основной количественный показатель этой редакции; медиана выводится только дополнительно.</p>'+
  '<h3>Ограничения</h3><div class="notice psy-dembo-warning">'+esc(d.warning)+'</div>'+
  '<p><a href="'+esc(d.source)+'" target="_blank" rel="noopener noreferrer">Описание модификации и обработки ↗</a></p>'+links(d);
 }
 const bars=(row)=>'<div class="psy-dembo-bar-line"><span class="psy-dembo-actual" style="width:'+row.esteem+'%" aria-label="Самооценка '+row.esteem+'"></span><span class="psy-dembo-want" style="left:'+row.aspiration+'%" title="Притязания '+row.aspiration+'"></span></div>';
 function result(answers){
  const o=inspect(answers),partial='<div class="psy-dembo-result">';
  if(o.status!=="complete")return partial+'<h3>Результаты</h3><p>Заполнено '+o.complete+' из 7 шкал. Для расчета заполните обе отметки каждой шкалы; пропуски не считаются нулями.</p></div>';
  let html=partial+'<h3>Результаты по шести шкалам</h3><div class="psy-dembo-stats">'+[
   ["Средняя самооценка",o.mean.esteem],["Средние притязания",o.mean.aspiration],["Средняя разница",o.mean.gap]
  ].map(([name,value])=>'<div><span>'+esc(name)+'</span><strong>'+value+'</strong></div>').join("")+'</div>';
  html+='<p class="psy-dembo-hint">Заливка — самооценка, вертикальная отметка — притязания. Первая шкала «Здоровье» показана отдельно как тренировочная.</p>';
  html+='<div class="psy-dembo-chart">'+o.rows.map((r,i)=>'<div class="psy-dembo-bar-row"><span>'+esc(r.name)+'</span>'+bars(r)+'<strong>'+r.esteem+' / '+r.aspiration+'</strong><small>'+(r.gap>0?'+':'')+r.gap+'</small></div>').join("")+'</div>';
  html+='<p><strong>Дополнительная медиана по 6 шкалам:</strong> самооценка '+o.median.esteem+', притязания '+o.median.aspiration+', разница '+o.median.gap+'.</p>'+
    '<div class="notice">Вывод описательный. Не назначайте уровни или диагноз по этим значениям вне применимой нормативной выборки.</div></div>';
  return html;
 }
 function calculator(d,ctx){
  const persons=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=persons[ctx.rowIndex]||persons[0],a=r.answers||[];
  let html='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ученик</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Весь класс</button></div>'+
  '<div class="notice">После заполнения бумажного бланка измерьте отметки линейкой снизу в миллиметрах (0-100). Введите отдельно текущую оценку и желаемую. <strong>«Здоровье» — тренировочная шкала.</strong></div>';
  if(ctx.calcMode==="class")html+='<div class="group-tools"><label>Ученик <select id="participantSelect">'+persons.map((p,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?'selected':'')+'>'+(i+1)+'. '+esc(p.name||"Код "+(i+1))+'</option>').join("")+'</select></label><label>Код ученика <input id="participantName" value="'+esc(r.name||"")+'" placeholder="Желательно без ФИО"></label><button class="btn" id="addParticipant">Добавить</button></div>';
  html+='<div class="psy-dembo-inputs">'+LABELS.map((name,i)=>'<section class="psy-dembo-field"><div class="psy-dembo-field-title"><h4>'+(i+1)+'. '+esc(name)+'</h4>'+(i===0?'<span>Тренировка</span>':'')+'</div><div class="psy-dembo-pair"><label>Самооценка (—), мм<input type="number" inputmode="numeric" step="1" min="0" max="100" data-dembo="'+(i*2)+'" value="'+esc(a[i*2]??"")+'" placeholder="0-100"></label><label>Притязания (×), мм<input type="number" inputmode="numeric" step="1" min="0" max="100" data-dembo="'+(i*2+1)+'" value="'+esc(a[i*2+1]??"")+'" placeholder="0-100"></label></div></section>').join("")+'</div>';
  html+='<div id="demboResult">'+result(a)+'</div><div class="psy-dembo-actions"><button class="btn" id="resetParticipant">Очистить отметки</button><button class="btn primary" id="demboJSON">Скачать индивидуальный результат</button></div>';
  if(ctx.calcMode==="class")html+='<h3>Обработка класса</h3><div class="results-table"><table><thead><tr><th>Код</th><th>Самооценка (ср.)</th><th>Притязания (ср.)</th><th>Разница (ср.)</th></tr></thead><tbody>'+persons.map((p,i)=>{const z=score(d,p.answers);return '<tr><td>'+esc(p.name||"Код "+(i+1))+'</td><td>'+(z?.mean.esteem??"—")+'</td><td>'+(z?.mean.aspiration??"—")+'</td><td>'+(z?.mean.gap??"—")+'</td></tr>'}).join("")+'</tbody></table></div><div class="psy-dembo-actions"><button class="btn primary" id="demboCSV">Скачать CSV класса</button></div>';
  return html;
 }
 function csvCell(x){let t=String(x??"");if(/^\s*[=+\-@]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"';}
 function download(name,value,mime){const blob=new Blob([value],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);}
 function bind(d,ctx){
  document.querySelectorAll("[data-dembo]").forEach(el=>el.addEventListener("input",()=>{
   ctx.rows[ctx.rowIndex].answers[+el.dataset.dembo]=el.value===""?"":Number(el.value);
   const resultNode=document.querySelector("#demboResult");if(resultNode)resultNode.innerHTML=result(ctx.rows[ctx.rowIndex].answers);
  }));
  document.querySelector("#demboJSON")?.addEventListener("click",()=>{
    const r=ctx.rows[ctx.rowIndex];download("dembo_prikhozhan_result.json",JSON.stringify({method:NAME,version:d.version,code:r.name||"",measurements:r.answers||[],summary:score(d,r.answers),source:d.source,warning:d.warning},null,2),"application/json;charset=utf-8");
  });
  document.querySelector("#demboCSV")?.addEventListener("click",()=>{
   const rows=[["Код","Самооценка (среднее)","Притязания (среднее)","Разница (среднее)","Самооценка (медиана)","Притязания (медиана)"],...ctx.rows.map((r,i)=>{const z=score(d,r.answers);return [r.name||"Код "+(i+1),z?.mean.esteem??"",z?.mean.aspiration??"",z?.mean.gap??"",z?.median.esteem??"",z?.median.aspiration??""];})];
   download("dembo_prikhozhan_class.csv","\uFEFF"+rows.map(r=>r.map(csvCell).join(";")).join("\r\n"),"text/csv;charset=utf-8");
  });
 }
 window.PSY_DEMBO={labels:LABELS,inspect,score,scaleSVG,instruction,materials,processing,calculator,bind};
})();