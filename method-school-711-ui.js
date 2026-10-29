"use strict";
/* Source-aligned classroom screens for Eysenck (40), Lazarus (50), Razuvaeva (29).
   Self-report scores are descriptive, never an automatic suicide risk classification. */
(function(){
const m=window.PSY_SEMESTER_2026,base=window.PSY_MATCH_MSPSS,items=window.PSY_SCHOOL_711_ITEMS;
if(!m||!base||!items)return;
const ids=["eysenck-40","lazarus-wcq50","razuvaeva-osr29"];
const supports=d=>!!d&&ids.includes(d.id);
const cfg=d=>m.methods.find(x=>x.id===d.id);
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const size=d=>cfg(d).n,limit=d=>cfg(d).max;
const present=(d,r)=>Array.from({length:size(d)},(_,i)=>r?.answers?.[i]).filter(v=>v!==null&&v!==undefined&&v!==""&&/^[0-9]$/.test(String(v))&&Number(v)<=limit(d)).length;
const scored=(d,r)=>r?.attendance!=="absent"&&present(d,r)===size(d)?m.score(d,r.answers,r):null;
const topic=(d,i,r)=>d.id==="eysenck-40"&&r?.eysenckVersion==="block"?"Вопрос "+(i+1):items[d.id][i];
const opts=d=>d.id==="eysenck-40"?"0 – не подходит · 1 – бывает иногда · 2 – бывает часто":d.id==="lazarus-wcq50"?"0 – никогда · 1 – редко · 2 – иногда · 3 – часто":"0 – Нет · 1 – Да";
const tone=(d,s)=>d.id==="razuvaeva-osr29"?"neutral":d.id==="eysenck-40"?(s.raw<=7?"low":s.raw<=14?"middle":"high"):(s.percent<=33?"low":s.percent<=66?"middle":"high");
const label=(d,s)=>d.id==="razuvaeva-osr29"?"Без автоматического диагностического уровня":d.id==="eysenck-40"?(s.raw<=7?"Низкий уровень":s.raw<=14?"Средний уровень":"Высокий уровень"):(s.percent<=33?"До 33% максимума":s.percent<=66?"34-66% максимума":"Свыше 66% максимума");
const num=(d,s)=>d.id==="razuvaeva-osr29"?s.adjusted.toFixed(1).replace(".",","):String(s.raw);
const maximum=(d,s)=>d.id==="razuvaeva-osr29"?(s.max*s.factor).toFixed(1).replace(".",","):String(s.max);
function result(d,r){
 if(r?.attendance==="absent")return '<section class="psy-711-result">Участник отсутствовал. Результаты не рассчитываются.</section>';
 const z=scored(d,r);if(!z)return '<section class="psy-711-result">Заполнено '+present(d,r)+' из '+size(d)+'. Для подсчета нужны все ответы.</section>';
 return '<section class="psy-711-result"><h3>Результаты участника</h3><div class="psy-711-scale-grid">'+z.scales.map(s=>
 '<div class="psy-711-scale psy-711-'+tone(d,s)+'"><b>'+esc(s.name)+'</b><strong>'+num(d,s)+' / '+maximum(d,s)+'</strong><span>'+esc(d.id==="razuvaeva-osr29"?"Коэффициент "+s.factor:label(d,s))+'</span>'+
 '<div class="psy-711-track"><span style="width:'+s.percent+'%"></span></div></div>').join("")+'</div>'+
 (d.id==="razuvaeva-osr29"?'<p class="psy-711-safety">Показатели факторов не определяют вероятность суицида и не исключают опасности. При признаках угрозы необходима очная профессиональная оценка безопасности.</p>':
 '<p class="psy-mspss-small">'+(d.id==="eysenck-40"?"Диапазоны по каждой шкале: 0-7, 8-14, 15-20.":"Проценты показывают долю от максимума шкалы, а не возрастные нормативы или Т-баллы.")+'</p>')+'</section>';
}
function group(d,rows){
 const keys=(cfg(d).versions?.[0]?.scales||cfg(d).scales);
 return '<section class="psy-mspss-group psy-711-group"><h3>Результаты класса</h3><div class="psy-mspss-scroll"><table><thead><tr><th>№</th><th>Участник</th>'+keys.map(s=>'<th>'+esc(s.name)+'</th>').join("")+'</tr></thead><tbody>'+
 rows.filter(r=>r.name?.trim()||present(d,r)).map((r,i)=>{const z=scored(d,r);return '<tr><td>'+(i+1)+'</td><td>'+esc(r.name||"У-"+(i+1))+'</td>'+keys.map((s,j)=>{const v=z?.scales?.[j];return '<td class="'+(v?"psy-711-"+tone(d,v):"")+'">'+(v?num(d,v):"–")+'</td>'}).join("")+'</tr>'}).join("")+
 '</tbody></table></div>'+(d.id==="razuvaeva-osr29"?'<p class="psy-mspss-small">Категория суицидального риска автоматически не присваивается.</p>':"")+'</section>';
}
function calculator(d,ctx){
 const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],answers=r.answers||[],grade=rows.find(x=>Number(x.schoolGrade)>=7&&Number(x.schoolGrade)<=11)?.schoolGrade;
 let out='<section class="psy-mspss-calculator psy-711-calculator"><div class="calc-mode psy-mspss-modes"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
 if(ctx.calcMode==="class"){
 out+='<div class="psy-mspss-workspace"><aside class="psy-mspss-sidebar"><h3>Список учащихся</h3><label class="psy-cp-class-label">Класс<select id="school711Grade"><option value="">Не выбран</option>'+
 [7,8,9,10,11].map(g=>'<option value="'+g+'" '+(Number(grade)===g?"selected":"")+'>'+g+' класс</option>').join("")+'</select></label>'+
 '<label class="psy-mspss-label">Добавить участников</label><textarea id="school711Bulk" rows="5" placeholder="Ученик 01&#10;Ученик 02"></textarea>'+
 '<button type="button" class="btn primary psy-mspss-add" id="school711Add">Добавить в список</button><button type="button" class="btn psy-mspss-sort" id="school711Sort">По алфавиту А - Я</button><div class="psy-mspss-person-list">'+
 rows.map((x,i)=>'<div class="psy-mspss-person-row"><button type="button" class="psy-mspss-person '+(ctx.rowIndex===i?"active":"")+'" data-711-person="'+i+'"><span>'+esc(x.name||"Участник "+(i+1))+'</span><small>'+(x.attendance==="absent"?"Отсутствовал":present(d,x)+"/"+size(d))+'</small></button>'+
 '<button type="button" class="psy-mspss-delete-person" title="Удалить участника" data-711-delete="'+i+'">×</button></div>').join("")+'</div></aside><div class="psy-mspss-entry">';
 }else out+='<div class="psy-mspss-entry">';
 out+='<label class="psy-mspss-name-field">Участник<input id="school711Name" type="text" value="'+esc(r.name||"")+'" placeholder="Имя или код"></label>';
 if(d.id==="eysenck-40")out+='<label class="psy-711-version">Редакция опросника<select id="school711Version">'+
 '<option value="interleaved" '+(r.eysenckVersion!=="block"?"selected":"")+'>Версия 2 – чередование шкал (твой бланк)</option>'+
 '<option value="block" '+(r.eysenckVersion==="block"?"selected":"")+'>Версия 1 – шкалы по блокам</option></select></label>';
 out+='<p class="psy-711-answer-key">'+esc(opts(d))+'</p><p class="psy-mspss-progress" id="school711Progress">Заполнено '+present(d,r)+' из '+size(d)+'</p>'+
 '<div class="psy-mspss-grid psy-711-grid">'+items[d.id].map((question,i)=>{const v=answers[i],filled=v!==null&&v!==undefined&&v!==""&&/^[0-9]$/.test(String(v))&&Number(v)<=limit(d);return '<label class="psy-mspss-item '+(filled?"is-complete":"is-missing")+'"><span><b>'+(i+1)+'.</b> '+esc(topic(d,i,r))+'</span>'+
 '<input type="text" inputmode="numeric" maxlength="1" autocomplete="off" data-711-answer="'+i+'" data-cp-answer="'+i+'" class="psy-mspss-score-input psy-711-input" value="'+(filled?v:"")+'" placeholder="0-'+limit(d)+'" '+(r.attendance==="absent"?"disabled":"")+'></label>'}).join("")+'</div>';
 if(ctx.calcMode==="class")out+='<div class="psy-711-advance"><button type="button" class="btn" id="school711Absent">'+(r.attendance==="absent"?"Вернуть в присутствующие":"Отсутствовал – следующий")+'</button><button type="button" class="btn primary" id="school711Next">Следующий участник →</button></div>';
 out+='<div id="school711Result">'+result(d,r)+'</div></div>';
 if(ctx.calcMode==="class")out+='</div><div id="school711Group">'+group(d,rows)+'</div>';
 return out+'</section>';
}
function guide(d){
 const mtd=cfg(d),sc=mtd.versions?.[0]?.scales||mtd.scales;
 const ins=d.id==="eysenck-40"?"Если состояние бывает часто – выбери 2, если редко – 1, если не подходит – 0.":
 d.id==="lazarus-wcq50"?"Вспомни трудную ситуацию и укажи, как часто ты действовал каждым способом: никогда, редко, иногда или часто.":
 "Прочитай утверждения. Если согласен – отметь «Да», если не согласен – «Нет».";
 return '<section class="psy-mspss-manual psy-711-manual"><h3>Цель</h3><p>'+esc(mtd.goal)+'</p><h3>Инструкция обследуемому</h3><div class="psy-mspss-script">'+esc(ins)+'</div><h3>Обработка</h3><p>'+esc(mtd.scoring)+'</p>'+
 '<h3>Шкалы</h3><div class="psy-mspss-key-wrap"><table class="psy-mspss-key"><thead><tr><th>Шкала</th><th>Пункты</th>'+(d.id==="razuvaeva-osr29"?"<th>Коэффициент</th>":"")+'</tr></thead><tbody>'+
 sc.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.q.join(", ")+'</td>'+(d.id==="razuvaeva-osr29"?'<td>'+s.factor+'</td>':"")+'</tr>').join("")+'</tbody></table></div>'+
 (d.id==="razuvaeva-osr29"?'<p class="psy-711-safety">При возможной угрозе безопасности требуется очная профессиональная оценка. Баллы опросника не заменяют ее.</p>':"")+
 '<div class="psy-mspss-manual-actions"><button type="button" class="btn" data-711-print="guide">Без бланка</button><button type="button" class="btn primary" data-711-print="combined">С бланком</button></div></section>';
}
function sheet(d){
 return '<section class="psy-mspss-student psy-711-student"><div class="psy-mspss-blank-head"><div><h3>Бланк ученика</h3><p>Формулировки утверждений и графа ответа</p></div><button type="button" class="btn primary" data-711-print="blank">Посмотреть и распечатать</button></div><p>'+esc(opts(d))+'</p>'+
 '<div class="psy-mspss-blank-scroll"><table class="psy-mspss-blank-table psy-711-sheet"><thead><tr><th>№</th><th>Утверждение</th><th>Ответ</th></tr></thead><tbody>'+
 items[d.id].map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(q)+'</td><td></td></tr>').join("")+'</tbody></table></div></section>';
}
function printable(d,mode){
 const md=cfg(d),b='<section class="'+(mode==="combined"?"newpage":"")+'"><h1>'+esc(md.name)+'</h1><p>Участник: ________________________ Класс: ______ Дата: ____________</p>'+
 '<p>'+esc(opts(d))+'</p><table><thead><tr><th>№</th><th>Утверждение</th><th>Ответ</th></tr></thead><tbody>'+
 items[d.id].map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(q)+'</td><td></td></tr>').join("")+'</tbody></table></section>';
 const g='<h1>'+esc(md.name)+'</h1><h2>Цель</h2><p>'+esc(md.goal)+'</p><h2>Инструкция</h2><p>'+esc(md.instruction)+'</p><h2>Подсчет</h2><p>'+esc(md.scoring)+'</p>';
 return '<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>'+esc(md.name)+'</title><style>@page{size:A4;margin:14mm}body{font:10pt/1.4 Arial}table{width:100%;border-collapse:collapse}td,th{border:1px solid #9bb2a5;padding:5px;vertical-align:top}td:first-child{width:35px}td:last-child{width:70px}tr{break-inside:avoid}.newpage{break-before:page}</style></head><body>'+(mode==="blank"?b:g)+(mode==="combined"?b:"")+'</body></html>';
}
function bind(d,ctx){
 document.querySelectorAll("[data-711-print]").forEach(el=>el.addEventListener("click",()=>{const output=printable(d,el.dataset["711Print"]),url=URL.createObjectURL(new Blob([output],{type:"text/html;charset=utf-8"})),a=document.createElement("a");a.href=url;a.download="Metolaria_"+d.id+"_blank.html";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}));
 if(ctx.tab!=="score")return;
 const r=ctx.rows[ctx.rowIndex];if(!r)return;r.answers ||= [];
 const update=()=>{
  const p=document.getElementById("school711Progress");if(p)p.textContent="Заполнено "+present(d,r)+" из "+size(d);
  const res=document.getElementById("school711Result");if(res)res.innerHTML=result(d,r);
  const gr=document.getElementById("school711Group");if(gr)gr.innerHTML=group(d,ctx.rows);
  const button=document.getElementById("cpReportBottom");if(button){const eligible=ctx.calcMode==="class"?ctx.rows.some(x=>scored(d,x)):!!scored(d,r);button.disabled=!eligible;button.classList.toggle("psy-mspss-waiting",!eligible)}
  const label=document.querySelector(".psy-mspss-person.active small");if(label)label.textContent=r.attendance==="absent"?"Отсутствовал":present(d,r)+"/"+size(d);
 };
 document.getElementById("school711Name")?.addEventListener("input",e=>{r.name=e.target.value;const x=document.querySelector(".psy-mspss-person.active span");if(x)x.textContent=r.name});
 document.getElementById("school711Grade")?.addEventListener("change",e=>{ctx.rows.forEach(x=>x.schoolGrade=e.target.value?Number(e.target.value):null);ctx.onRender?.()});
 document.getElementById("school711Version")?.addEventListener("change",e=>{
  if((r.eysenckVersion||"interleaved")===e.target.value)return;
  if(present(d,r)&&!confirm("Редакции имеют другой порядок вопросов. Очистить ответы и сменить?")){e.target.value=r.eysenckVersion||"interleaved";return}
  r.eysenckVersion=e.target.value;r.answers=[];ctx.onRender?.();
 });
 document.getElementById("school711Add")?.addEventListener("click",()=>{const names=(document.getElementById("school711Bulk")?.value||"").split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean);if(names.length)ctx.onBulkAdd?.(names)});
 document.getElementById("school711Sort")?.addEventListener("click",()=>ctx.onSort?.((document.getElementById("school711Bulk")?.value||"").split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean)));
 document.querySelectorAll("[data-711-person]").forEach(el=>el.addEventListener("click",()=>ctx.onSelect?.(+el.dataset["711Person"])));
 document.querySelectorAll("[data-711-delete]").forEach(el=>el.addEventListener("click",()=>{if(confirm("Удалить участника с ответами?"))ctx.onDelete?.(+el.dataset["711Delete"])}));
 document.getElementById("school711Next")?.addEventListener("click",()=>ctx.onNext?.());
 document.getElementById("school711Absent")?.addEventListener("click",()=>{
  if(r.attendance==="absent"){r.attendance="present";ctx.onRender?.();return}
  if(present(d,r)&&!confirm("Исключить введенные ответы отсутствующего из подсчета?"))return;
  r.attendance="absent";ctx.onAbsentNext?.();
 });
 const fields=[...document.querySelectorAll("input[data-711-answer]")];
 const next=i=>{if(fields[i+1])fields[i+1].focus();else document.getElementById("school711Next")?.focus()};
 const set=(input,value)=>{if(value!==""&&(!/^[0-9]$/.test(value)||+value>limit(d)))return false;
  const i=+input.dataset["711Answer"];r.answers[i]=value===""?null:+value;input.value=value;const card=input.closest(".psy-mspss-item");
  card?.classList.toggle("is-complete",value!=="");card?.classList.toggle("is-missing",value==="");update();return true};
 fields.forEach((x,i)=>{x.addEventListener("input",()=>{const value=x.value.replace(/[^0-9]/g,"").slice(-1);if(set(x,value)&&value!=="")next(i)});
  x.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){e.preventDefault();next(i)}else if((e.key==="ArrowLeft"||e.key==="Backspace"&&!x.value)&&i>0){e.preventDefault();fields[i-1].focus()}});
  x.addEventListener("focus",()=>x.select());
  x.addEventListener("paste",e=>{const v=e.clipboardData?.getData("text")?.replace(/[\s,;]/g,"")||"";if(!v||![...v].every(a=>+a<=limit(d)))return;e.preventDefault();[...v].forEach((a,j)=>{if(fields[i+j])set(fields[i+j],a)});fields[Math.min(fields.length-1,i+v.length)]?.focus()});
 });
 update();
}

function csv(d,rows){
 const head=["№","Участник",...(cfg(d).scales||cfg(d).versions?.[0]?.scales||[]).map(s=>s.name)];
 const cell=v=>{let x=String(v??"");if(/^\s*[=+@-]/.test(x))x="'"+x;return '"'+x.replace(/"/g,'""')+'"'};
 const lines=[head,...rows.map((r,i)=>[i+1,r.name||"У-"+(i+1),...(scored(d,r)?.scales||head.slice(2).map(()=>null)).map(s=>s?num(d,s):"")])];
 return "\uFEFF"+lines.map(row=>row.map(cell).join(";")).join("\r\n");
}
/* Create a real OOXML Word file without remote services. */
function report(d,rows,mode,index){
 const people=(mode==="class"?rows:[rows[index]]).filter(Boolean);if(!people.length)return false;
 if(mode!=="class"&&!scored(d,people[0]))return false;
 const x=s=>String(s??"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F<>&"']/g,ch=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&apos;"}[ch]||""));
 const para=s=>'<w:p><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">'+x(s)+'</w:t></w:r></w:p>';
 const cel=(s,color,head)=>'<w:tc><w:tcPr><w:tcW w:w="auto" w:type="auto"/>'+(color?'<w:shd w:val="clear" w:color="auto" w:fill="'+color+'"/>':"")+'</w:tcPr><w:p><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="18"/>'+(head?"<w:b/>":"")+'</w:rPr><w:t xml:space="preserve">'+x(s)+'</w:t></w:r></w:p></w:tc>';
 const table=(matrix,fill=[])=>'<w:tbl><w:tblPr><w:tblBorders>'+["top","bottom","left","right","insideH","insideV"].map(k=>'<w:'+k+' w:val="single" w:sz="4"/>').join("")+'</w:tblBorders></w:tblPr>'+
 matrix.map((row,i)=>'<w:tr>'+row.map((v,j)=>cel(v,fill[i-1]?.[j],i===0)).join("")+'</w:tr>').join("")+'</w:tbl>';
 const scales=cfg(d).scales||cfg(d).versions?.[0]?.scales||[],rowsData=[],fill=[];
 for(let i=0;i<people.length;i++){
  const row=people[i],z=scored(d,row);
  rowsData.push([String(i+1),row.name||"У-"+(i+1),...scales.map((s,j)=>z?num(d,z.scales[j]):"–")]);
  fill.push([null,null,...scales.map((s,j)=>{const factor=z?.scales?.[j];if(!factor)return null;const kind=tone(d,factor);return kind==="high"?"F9DDCA":kind==="middle"?"FFF0CF":kind==="low"?"E4F1FB":"EAF1F4"})]);
 }
 let body=para(cfg(d).name)+para(mode==="class"?"Результаты класса":"Результат участника")+para("Дата: "+new Date().toLocaleDateString("ru-RU"));
 body+=table([["№","Участник",...scales.map(s=>s.name)],...rowsData],fill);
 if(d.id==="eysenck-40")body+=para("Интервалы каждой шкалы:")+table([["Баллы","Уровень"],["0-7","Низкий"],["8-14","Средний"],["15-20","Высокий"]],[["E4F1FB","E4F1FB"],["FFF0CF","FFF0CF"],["F9DDCA","F9DDCA"]]);
 else if(d.id==="lazarus-wcq50")body+=para("Числа – сырые баллы по каждой копинг-стратегии, не клинические пороги.");
 else body+=para("Факторы представлены с коэффициентами. Это не расчет вероятности суицида; при необходимости нужна очная оценка безопасности.");
 const documentXml='<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+
 '<w:sectPr><w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="680" w:bottom="680" w:left="680" w:right="680"/></w:sectPr></w:body></w:document>';
 const contentTypes='<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
 const rel='<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
 const encoder=new TextEncoder(),tab=new Uint32Array(256);
 for(let i=0;i<256;i++){let z=i;for(let j=0;j<8;j++)z=z&1?0xedb88320^(z>>>1):z>>>1;tab[i]=z>>>0}
 const crc=bytes=>{let z=0xffffffff;for(const b of bytes)z=tab[(z^b)&255]^(z>>>8);return(z^0xffffffff)>>>0};
 const u16=(b,i,v)=>{b[i]=v&255;b[i+1]=v>>>8&255},u32=(b,i,v)=>{u16(b,i,v);u16(b,i+2,v>>>16)};
 const join=arr=>{const b=new Uint8Array(arr.reduce((n,x)=>n+x.length,0));let i=0;for(const x of arr){b.set(x,i);i+=x.length}return b};
 const local=[],central=[];let offset=0;
 for(const [name,xml] of [["[Content_Types].xml",contentTypes],["_rels/.rels",rel],["word/document.xml",documentXml]]){
  const nameBytes=encoder.encode(name),bytes=encoder.encode(xml),hash=crc(bytes),header=new Uint8Array(30+nameBytes.length),dir=new Uint8Array(46+nameBytes.length);
  u32(header,0,0x04034b50);u16(header,4,20);u32(header,14,hash);u32(header,18,bytes.length);u32(header,22,bytes.length);u16(header,26,nameBytes.length);header.set(nameBytes,30);
  u32(dir,0,0x02014b50);u16(dir,4,20);u16(dir,6,20);u32(dir,16,hash);u32(dir,20,bytes.length);u32(dir,24,bytes.length);u16(dir,28,nameBytes.length);u32(dir,42,offset);dir.set(nameBytes,46);
  local.push(header,bytes);central.push(dir);offset+=header.length+bytes.length;
 }
 const directory=join(central),end=new Uint8Array(22);u32(end,0,0x06054b50);u16(end,8,central.length);u16(end,10,central.length);u32(end,12,directory.length);u32(end,16,offset);
 const archive=join([...local,directory,end]),url=URL.createObjectURL(new Blob([archive],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"}));
 const a=document.createElement("a");a.href=url;a.download="Metolaria_"+d.id+(mode==="class"?"_class":"_participant")+"_results.docx";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return true;
}
const old={supports:base.supports,scoring:base.scoring,done:base.done,bind:base.bind,group:base.group,report:base.report,csv:base.csv,calculator:m.calculator,instruction:m.instruction,materials:m.materials,printPage:m.printPage};
base.supports=d=>supports(d)||old.supports(d);
base.scoring=(d,r)=>supports(d)?scored(d,r):old.scoring(d,r);
base.done=(d,a)=>supports(d)?present(d,{answers:a}):old.done(d,a);
base.bind=(d,ctx)=>supports(d)?bind(d,ctx):old.bind(d,ctx);
base.group=(d,rows)=>supports(d)?group(d,rows):old.group(d,rows);
base.report=(d,rows,mode,index)=>supports(d)?report(d,rows,mode,index):old.report(d,rows,mode,index);
base.csv=(d,rows)=>supports(d)?csv(d,rows):old.csv(d,rows);
m.calculator=(d,ctx)=>supports(d)?calculator(d,ctx):old.calculator(d,ctx);
m.instruction=d=>supports(d)?guide(d):old.instruction(d);
m.materials=d=>supports(d)?sheet(d):old.materials(d);
m.printPage=(d,blank,combined)=>supports(d)?printable(d,combined?"combined":blank?"blank":"guide"):old.printPage(d,blank,combined);
window.PSY_SCHOOL_711_UI={supports,scored,present,result,group,calculator,guide,sheet,printable,csv,report};
})();
