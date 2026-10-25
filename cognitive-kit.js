"use strict";
(function(){
 const $=id=>document.getElementById(id);
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const TABLES=[
 [12,1,16,23,15,24,8,3,13,21,17,18,22,11,7,9,6,25,2,20,4,19,5,10,14],
 [7,21,4,17,25,6,3,15,22,16,20,18,5,12,9,24,8,11,14,13,1,2,19,10,23],
 [20,7,8,21,16,25,19,2,6,22,14,13,15,3,5,9,24,23,12,1,4,17,11,18,10],
 [4,21,2,19,24,5,20,3,25,9,10,16,11,7,15,17,13,14,1,6,12,18,22,23,8],
 [12,4,25,2,1,10,5,9,20,18,3,21,16,11,22,23,8,7,24,19,15,13,6,17,14]
 ];
 const WORDS=["лес","хлеб","окно","стул","вода","брат","конь","гриб","игла","мед"];
 const STAGES=["1","2","3","4","5","Отср."];
 if(TABLES.length!==5||TABLES.some(t=>t.length!==25||new Set(t).size!==25||t.some(x=>x<1||x>25)))throw Error("Ошибка исходных таблиц");
 function schulteStats(rows){
  const completed=[],problems=[];
  rows.forEach((r,i)=>{
   const time=String(r.time).trim(),errors=String(r.errors).trim(),note=String(r.note||"").trim();
   if(!time&&!errors){if(note)problems.push("Таблица "+(i+1)+": указано наблюдение, но нет времени и ошибок.");return}
   const t=Number(time),e=Number(errors);
   if(!time||!errors||!Number.isFinite(t)||t<=0||t>1800||!Number.isInteger(e)||e<0||e>25){
    problems.push("Таблица "+(i+1)+": введите время от 0,1 до 1800 секунд и число ошибок 0-25.");return
   }
   completed.push({table:i+1,time:t,errors:e,note});
  });
  if(problems.length)return {error:problems.join(" ")};
  if(!completed.length)return {error:"Заполните время и ошибки хотя бы одной проведенной таблицы."};
  const total=completed.reduce((a,r)=>a+r.time,0);
  const mean=total/completed.length;
  const mistakes=completed.reduce((a,r)=>a+r.errors,0);
  const first=completed.find(x=>x.table===1),last=completed.find(x=>x.table===5);
  return {completed,total,mean,mistakes,difference:first&&last?last.time-first.time:null,full:completed.length===5};
 }
 function memoryStats(stages,delay){
  const out=[];
  for(let i=0;i<6;i++){
   const stage=stages[i]||{},words=stage.words||[];
   const valid=words.filter(n=>Number.isInteger(n)&&n>=0&&n<10);
   if(new Set(valid).size!==valid.length)return {error:"Этап "+STAGES[i]+": одно слово отмечено несколько раз."};
   if(!stage.done&&valid.length)return {error:"Этап "+STAGES[i]+": есть отметки слов, но этап не отмечен как проведенный."};
   if(stage.done)out.push({step:i+1,count:valid.length});
  }
  if(!out.length)return {error:"Отметьте проведенные этапы и воспроизведенные слова."};
  const delayed=out.some(x=>x.step===6);
  const minutes=String(delay).trim(),min=Number(minutes);
  if(delayed&&(!minutes||!Number.isInteger(min)||min<1||min>240))return {error:"Укажите фактическую отсрочку от 1 до 240 минут."};
  if(!delayed&&minutes)return {error:"Время отсрочки введено, но отсроченная проба не отмечена как проведенная."};
  const learning=out.filter(x=>x.step<=5);
  const sum=learning.reduce((a,r)=>a+r.count,0);
  return {stages:out,learning,delayed,minutes:delayed?min:null,mean:learning.length?sum/learning.length:null,full:learning.length===5&&delayed};
 }
 window.PSY_COGNITIVE_TOOLS={TABLES,WORDS,STAGES,schulteStats,memoryStats};
 let method="schulte",tableNum=0;
 function choose(name){method=name==="memory"?"memory":"schulte";$("ckSchulte").hidden=method!=="schulte";$("ckMemory").hidden=method!=="memory";document.querySelectorAll("[data-ck-method]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.ckMethod===method)));try{const u=new URL(location.href);u.searchParams.set("method",method);history.replaceState(null,"",u)}catch(_){}}
 document.querySelectorAll("[data-ck-method]").forEach(b=>b.addEventListener("click",()=>choose(b.dataset.ckMethod)));
 function drawTable(){const matrix=$("ckSchulteMatrix");matrix.innerHTML=TABLES[tableNum].map(x=>"<span>"+x+"</span>").join("");$("ckSchultePager").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(Number(b.dataset.table)===tableNum)))}
 $("ckSchultePager").innerHTML=TABLES.map((_,i)=>'<button type="button" data-table="'+i+'" aria-pressed="'+String(i===0)+'">Таблица '+(i+1)+'</button>').join("");
 $("ckSchultePager").querySelectorAll("button").forEach(b=>b.onclick=()=>{tableNum=Number(b.dataset.table);drawTable()});drawTable();
 $("ckSchulteRows").innerHTML=TABLES.map((_,i)=>'<tr><td>'+(i+1)+'</td><td><input type="number" inputmode="decimal" min="0.1" max="1800" step="0.1" aria-label="Время таблицы '+(i+1)+' в секундах" placeholder="Сек."></td><td><input type="number" inputmode="numeric" min="0" max="25" step="1" aria-label="Ошибки таблицы '+(i+1)+'" placeholder="0"></td><td><input type="text" maxlength="80" aria-label="Наблюдение к таблице '+(i+1)+'" placeholder="Необязательно"></td></tr>').join("");
 const sRows=[...$("ckSchulteRows").querySelectorAll("tr")];
 function readSchulte(){return sRows.map(tr=>{const vals=[...tr.querySelectorAll("input")].map(input=>input.value.trim());return {time:vals[0],errors:vals[1],note:vals[2]}})}
 function showStat(name,value){return '<div class="ck-stat"><b>'+esc(value)+'</b><span>'+esc(name)+'</span></div>'}
 function fmt(x){return Number(x).toFixed(1).replace(".",",")}
 $("ckSchulteCalc").onclick=()=>{
  const r=schulteStats(readSchulte()),target=$("ckSchulteResult");
  if(r.error){target.textContent=r.error;return}
  const stats=[
   showStat("Таблиц проведено",r.completed.length+" / 5"),
   showStat("Среднее время (сек.)",fmt(r.mean)),
   showStat("Ошибок всего",r.mistakes),
   showStat("Время серии (сек.)",fmt(r.total)),
   showStat("Таблица 5 минус таблица 1 (сек.)",r.difference===null?"–":(r.difference>=0?"+":"")+fmt(r.difference))
  ].join("");
  const rows=r.completed.map(o=>"<tr><td>"+o.table+"</td><td>"+fmt(o.time)+"</td><td>"+o.errors+"</td><td>"+esc(o.note)+"</td></tr>").join("");
  target.innerHTML='<h4>Сводка по таблицам Шульте</h4><div class="ck-stats">'+stats+'</div><div class="ck-scroll"><table class="ck-record"><thead><tr><th>№</th><th>Сек.</th><th>Ошибки</th><th>Наблюдение</th></tr></thead><tbody>'+rows+'</tbody></table></div><p>'+(r.full?"Проведена вся серия из пяти таблиц.":"Это частичный протокол: среднее рассчитано только для заполненных таблиц.")+' Изменение времени описывает динамику в данной серии, но не является автоматической мерой утомляемости или клиническим уровнем.</p><button type="button" id="ckCopySchulte" class="ck-copy">Скопировать обезличенную сводку</button>';
  $("ckCopySchulte").onclick=()=>copy("Шульте. Проведено "+r.completed.length+"/5, среднее "+fmt(r.mean)+" с, ошибок "+r.mistakes+". "+r.completed.map(v=>"№"+v.table+": "+fmt(v.time)+" с, "+v.errors+" ошибок").join("; ")+". Без нормативной классификации.");
 };
 $("ckSchulteReset").onclick=()=>{sRows.forEach(r=>r.querySelectorAll("input").forEach(i=>i.value=""));$("ckSchulteResult").innerHTML=""};
 // Этап «проведен» нужен, чтобы отсутствие отметок не превращалось в нулевую память.
 $("ckMemoryRows").innerHTML=WORDS.map((word,i)=>'<tr data-word="'+i+'"><td>'+esc(word)+'</td>'+STAGES.map((step,j)=>'<td><input type="checkbox" data-stage="'+j+'" aria-label="'+esc(word)+', этап '+step+'"></td>').join("")+"</tr>").join("")+'<tr class="ck-stage-done"><td>Этап проведен</td>'+STAGES.map((s,i)=>'<td><input type="checkbox" class="ck-done" data-done="'+i+'" aria-label="Этап '+s+' проведен"></td>').join("")+"</tr>";
 function readMemory(){
  return STAGES.map((_,i)=>({done:$("ckMemoryRows").querySelector('[data-done="'+i+'"]').checked,words:[...$("ckMemoryRows").querySelectorAll('[data-stage="'+i+'"]:checked')].map(x=>Number(x.closest("tr").dataset.word))}));
 }
 function curveSVG(items){
  const x=step=>50+(step-1)*105,y=count=>183-count*14;
  const points=items.filter(p=>p.step<=5);
  const plotted=points.map(p=>x(p.step)+","+y(p.count)).join(" ");
  const chart='<svg class="ck-mini-chart" viewBox="0 0 655 225" role="img" aria-label="Кривая: правильные слова по проведенным этапам"><path class="axis" d="M50 15v169h575"/>'+[0,5,10].map(n=>'<path class="axis" d="M45 '+y(n)+'h580" stroke-dasharray="2 5"/><text x="25" y="'+(y(n)+4)+'">'+n+'</text>').join("")+(points.length>1?'<polyline class="line" points="'+plotted+'"/>':'')+items.map(p=>'<circle cx="'+x(p.step)+'" cy="'+y(p.count)+'" r="5"/><text x="'+(x(p.step)-8)+'" y="'+(y(p.count)-11)+'">'+p.count+'</text>').join("")+STAGES.map((s,i)=>'<text x="'+(x(i+1)-17)+'" y="210">'+(i===5?"Отср.":s)+'</text>').join("")+'</svg>';
  return chart;
 }
 $("ckMemoryCalc").onclick=()=>{
  const r=memoryStats(readMemory(),$("ckDelay").value),target=$("ckMemoryResult");if(r.error){target.textContent=r.error;return}
  const stats=[showStat("Этапов проведено",r.stages.length+" / 6"),showStat("Среднее из проведенных 1-5",r.mean===null?"–":fmt(r.mean)),showStat("После отсрочки",r.delayed?r.stages.find(x=>x.step===6).count+" из 10":"не проведено")].join("");
  const list=r.stages.map(x=>"<tr><td>"+esc(STAGES[x.step-1])+"</td><td>"+x.count+" из 10</td></tr>").join("");
  const observations=$("ckExtra").value.trim();
  target.innerHTML='<h4>Кривая воспроизведения</h4><div class="ck-stats">'+stats+'</div>'+curveSVG(r.stages)+'<div class="ck-scroll"><table class="ck-record"><thead><tr><th>Этап</th><th>Верных слов</th></tr></thead><tbody>'+list+'</tbody></table></div>'+(r.delayed?'<p>Фактическая отсрочка: '+r.minutes+' мин.</p>':'')+(observations?'<p><b>Посторонние включения и повторы:</b> '+esc(observations)+'</p>':'')+'<p>'+(r.full?"Шесть этапов зафиксированы.":"Часть этапов не отмечена как проведенная; это не нулевые результаты.")+' Используйте описательную динамику, ошибки и наблюдение. Универсальные нормативные пороги для этого рабочего списка не применяются.</p><button type="button" id="ckCopyMemory" class="ck-copy">Скопировать обезличенную сводку</button>';
  $("ckCopyMemory").onclick=()=>copy("Заучивание 10 слов. "+r.stages.map(x=>STAGES[x.step-1]+": "+x.count+"/10").join("; ")+(r.delayed?"; отсрочка "+r.minutes+" мин.":"")+(observations?"; наблюдения: "+observations:"")+". Без нормативной классификации.");
 };
 $("ckMemoryReset").onclick=()=>{$("ckMemoryRows").querySelectorAll('input[type="checkbox"]').forEach(c=>c.checked=false);$("ckDelay").value="";$("ckExtra").value="";$("ckMemoryResult").innerHTML=""};
 function copy(text){if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).catch(()=>fallback(text))}else fallback(text)}
 function fallback(t){const ta=document.createElement("textarea");ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand("copy")}catch(_){}ta.remove()}
 // Печатные варианты: пять оригинальных матриц и один протокол памяти.
 function printableSchulte(){return '<h1>Таблицы Шульте · рабочий комплект</h1>'+TABLES.map((matrix,i)=>'<section class="ck-paper-card"><h2>Таблица '+(i+1)+'</h2><p class="ck-print-hint">По порядку найдите числа от 1 до 25. Время: ________ сек. Ошибки: ________</p><div class="ck-paper-matrix">'+matrix.map(n=>'<span>'+n+'</span>').join("")+'</div></section>').join("")}
 function printableMemory(){return '<h1>Заучивание 10 слов · протокол психолога</h1><p>Рабочий список из архива. Не показывайте участнику. Код ________  Дата ________  Отсрочка ________ минут.</p><table><thead><tr><th>Слово</th>'+STAGES.map(s=>'<th>'+s+'</th>').join("")+'</tr></thead><tbody>'+WORDS.map(w=>'<tr><td>'+esc(w)+'</td>'+STAGES.map(()=>'<td>□</td>').join("")+'</tr>').join("")+'<tr><td>Верно</td>'+STAGES.map(()=>'<td>_____</td>').join("")+'</tr><tr><td>Привнесения и повторы</td>'+STAGES.map(()=>'<td>_____</td>').join("")+'</tr></tbody></table><p>Наблюдения: __________________________________________________________________________________</p><p class="ck-print-hint">Без нормативных порогов. Протокол должен сохраняться конфиденциально.</p>'}
 document.querySelectorAll("[data-ck-print]").forEach(b=>b.onclick=()=>{
  const box=$("ckPrint");box.innerHTML=b.dataset.ckPrint==="memory"?printableMemory():printableSchulte();box.hidden=false;box.setAttribute("aria-hidden","false");
  const after=()=>{box.hidden=true;box.setAttribute("aria-hidden","true");window.removeEventListener("afterprint",after)};
  window.addEventListener("afterprint",after);window.print();
 });
 // Минимальный полноценный DOCX без сервера: ZIP с Office Open XML.
 function xesc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]))}
 function p(text,heading){return '<w:p><w:pPr><w:spacing w:after="85"/></w:pPr><w:r><w:rPr>'+(heading?'<w:b/><w:sz w:val="28"/>':'<w:sz w:val="19"/>')+'</w:rPr><w:t xml:space="preserve">'+xesc(text)+'</w:t></w:r></w:p>'}
 function wtable(rows){
  const n=rows[0].length,width=Math.max(900,Math.floor(9750/n));
  return '<w:tbl><w:tblPr><w:tblW w:w="9750" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="6"/><w:bottom w:val="single" w:sz="6"/><w:left w:val="single" w:sz="6"/><w:right w:val="single" w:sz="6"/><w:insideH w:val="single" w:sz="6"/><w:insideV w:val="single" w:sz="6"/></w:tblBorders></w:tblPr>'+rows.map(row=>'<w:tr>'+row.map(v=>'<w:tc><w:tcPr><w:tcW w:w="'+width+'" w:type="dxa"/></w:tcPr>'+p(String(v))+'</w:tc>').join("")+'</w:tr>').join("")+'</w:tbl>';
 }
 function pageBreak(){return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'}
 function buildDoc(type){
  let parts="";
  if(type==="memory"){
   parts=p("Заучивание 10 слов – рабочий протокол",true)+p("Основа: А. Р. Лурия. Список из архива «Психотеки» не нормирован.")+p("Код участника ____________  Дата ____________  Отсрочка ______ минут")+p("Психолог читает одинаковый список слов 5 раз, отмечает воспроизведенные слова, затем проводит отсроченную пробу.")+wtable([["Слово",...STAGES],...WORDS.map(w=>[w,...STAGES.map(()=>"□")]),["Верно",...STAGES.map(()=>"____")],["Привнесения",...STAGES.map(()=>"____")]])+p("Наблюдения: __________________________________________________________");
  }else{
   parts=p("Таблицы Шульте – рабочий комплект",true)+p("Пять исходных рабочих матриц «Психотеки». Каждая содержит числа 1-25. Записывайте время и ошибки отдельно.");
   TABLES.forEach((nums,i)=>{
    if(i)parts+=pageBreak();
    parts+=p("Таблица "+(i+1),true)+p("Код ________  Время ______ сек.  Ошибки ______")+wtable(Array.from({length:5},(_,r)=>nums.slice(r*5,r*5+5).map(String)))+p("Наблюдения: _______________________________________________");
   });
  }
  const ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
  const rel='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
  const xml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+parts+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850"/></w:sectPr></w:body></w:document>';
  const te=new TextEncoder(),chunks=[],center=[];let offset=0,centerSize=0;
  function crc(buf){let c=0xffffffff;for(const v of buf){c^=v;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^0xffffffff)>>>0}
  for(const [filename,text] of [["[Content_Types].xml",ct],["_rels/.rels",rel],["word/document.xml",xml]]){
   const name=te.encode(filename),data=te.encode(text),sum=crc(data),loc=new Uint8Array(30+name.length),dv=new DataView(loc.buffer);
   dv.setUint32(0,0x04034b50,true);dv.setUint16(4,20,true);dv.setUint16(6,0x800,true);dv.setUint32(14,sum,true);dv.setUint32(18,data.length,true);dv.setUint32(22,data.length,true);dv.setUint16(26,name.length,true);loc.set(name,30);chunks.push(loc,data);
   const cd=new Uint8Array(46+name.length),cv=new DataView(cd.buffer);
   cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0x800,true);cv.setUint32(16,sum,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);cv.setUint16(28,name.length,true);cv.setUint32(42,offset,true);cd.set(name,46);center.push(cd);offset+=loc.length+data.length;centerSize+=cd.length;
  }
  const end=new Uint8Array(22),ev=new DataView(end.buffer);ev.setUint32(0,0x06054b50,true);ev.setUint16(8,3,true);ev.setUint16(10,3,true);ev.setUint32(12,centerSize,true);ev.setUint32(16,offset,true);
  return new Blob([...chunks,...center,end],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
 }
 function download(blob,filename){const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
 document.querySelectorAll("[data-ck-word]").forEach(b=>b.onclick=()=>{const type=b.dataset.ckWord;download(buildDoc(type),type==="memory"?"psyteka_luria_10_words.docx":"psyteka_schulte_5_tables.docx")});
 choose(new URLSearchParams(location.search).get("method"));
})();