"use strict";
(function(){
const configs=[
 {name:"Простые аналогии (словесно-логическое мышление)",api:"PSY_ANALOGIES",count:12,type:"analogies",mode:"Данные одной пробы"},
 {name:"Парные ассоциации (смысловая и механическая память)",api:"PSY_PAIRED_ASSOC",count:20,type:"paired",mode:"Две серии пар"}
];
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fixFormula=v=>/^\s*[=+\-@]/.test(String(v??""))?"'"+String(v):String(v??"");
const csvCell=v=>'"'+fixFormula(v).replace(/"/g,'""')+'"';
const csv=rows=>"\uFEFF"+rows.map(r=>r.map(csvCell).join(";")).join("\r\n");
function save(filename,data,mime){
 const url=URL.createObjectURL(new Blob([data],{type:mime}));
 const a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function normWord(v){return String(v??"").trim().toLocaleLowerCase("ru").replace(/\u0451/g,"е").replace(/^[.,;:!?\s“”«»"'()\- - ]+|[.,;:!?\s“”«»"'()\- - ]+$/g,"");}
function stats(cfg,row){
 if(cfg.type==="analogies"){const z=window.PSY_ANALOGIES.score(row?.answers||[]);return {filled:z.filled,complete:z.complete,raw:z.correct,formatted:z.complete?z.correct+"/12":"Неполный",details:["Решено: "+z.filled+"/12","Верных среди предъявленных: "+z.correct]};}
 const z=window.PSY_PAIRED_ASSOC.outcomes(row?.pairedAnswers||{});
 return {filled:z.reduce((a,b)=>a+b.correct+b.wrong,0),complete:z.every(x=>x.complete),raw:z.map(x=>x.correct),
 formatted:z.map(x=>x.complete?x.correct+"/10":" - ").join(" / "),
 details:z.map(x=>x.title+": "+(x.complete?x.correct+"/10":x.correct+" верных, оценено "+(x.correct+x.wrong)+"/10"))};
}
function classTable(cfg,rows){
 return '<h3>Сводная таблица группы</h3><div class="results-table"><table class="questions-table"><thead><tr><th>Участник</th><th>Заполнено</th><th>Результат</th></tr></thead><tbody>'+rows.map((row,i)=>{const z=stats(cfg,row);return '<tr><td>'+esc(row.name||"Участник "+(i+1))+'</td><td>'+z.filled+'/'+cfg.count+'</td><td>'+esc(z.formatted)+'</td></tr>';}).join("")+'</tbody></table></div><p>Неполные протоколы показаны без итогового тестового балла. Возрастные нормы к рабочему набору не применяются.</p>';
}
function worksheet(cfg,row,api){
 const date=new Date().toLocaleDateString("ru-RU"),s=stats(cfg,row),name=esc(row?.name||"Код не указан");
 const items=cfg.type==="analogies"
 ?api.TASKS.map((t,i)=>{const x=row?.answers?.[i],valid=Number.isInteger(x)&&x>=0&&x<4;return ["№ "+t.id+": "+t.question,valid?"АБВГ"[x]+") "+t.options[x]:"Не указан","АБВГ"[t.key]+") "+t.options[t.key],valid?(x===t.key?"Верно":"Неверно"):"Не оценено",String(row?.analogyNotes?.[i]||"")];})
 :api.GROUPS.flatMap((g)=>g.items.map((p,i)=>{const id=g.code+"-"+i,mark=row?.pairedAnswers?.[id];return [g.title+" №"+(i+1)+": "+p[0],String(row?.pairedNotes?.[id]??""),p[1],mark===1?"Верно":mark===0?"Неверно":"Не оценено",""]; }));
 const trs=items.map(t=>'<tr>'+t.map(v=>'<td>'+esc(v)+'</td>').join("")+'</tr>').join("");
 const report='<h1>'+esc(cfg.name)+'</h1><p><b>Код участника:</b> '+name+' · '+date+'</p><p><b>Статус:</b> '+esc(s.complete?s.formatted:"Неполное обследование")+'</p><p>'+s.details.map(esc).join(" · ")+'</p><table><thead><tr><th>Задание</th><th>Ответ</th><th>Эталон</th><th>Оценка</th><th>Замечание</th></tr></thead><tbody>'+trs+'</tbody></table><h3>Качественные наблюдения</h3><p>'+esc(row?.psyNotes||"Не записаны")+'</p><p><b>Ограничение:</b> оригинальные задания Психотеки; без возрастных норм и клинических порогов. Итог не является диагнозом.</p>';
 return '<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>'+esc(cfg.name)+' · протокол</title><style>@page{size:A4;margin:13mm}body{font:11pt/1.4 Arial,sans-serif;color:#234034}h1{font-size:17pt}h3{font-size:12pt}table{width:100%;border-collapse:collapse}th,td{border:1px solid #9caf9f;padding:6px;font-size:9pt;vertical-align:top;word-break:break-word}tr{break-inside:avoid}th{background:#eaf1e9}.tools{margin:20px 0}@media print{.tools{display:none}} </style></head><body><div class="tools"><button type="button" onclick="print()">Распечатать А4</button></div>'+report+'</body></html>';
}
function groupCsv(cfg,rows){
 const header=cfg.type==="analogies"?["Код участника","Заполнено","Верных ответов (только полный)","Примечания"]:["Код участника","Оценено","Смысловые (полная серия)","Несвязанные (полная серия)","Примечания"];
 return csv([header,...rows.map((row,i)=>{const z=stats(cfg,row),base=[row.name||"Участник "+(i+1),z.filled];
 return cfg.type==="analogies"?[...base,z.complete?z.raw:"",row.psyNotes||""]:[...base,...window.PSY_PAIRED_ASSOC.outcomes(row.pairedAnswers||{}).map(x=>x.complete?x.correct:""),row.psyNotes||""];})]);
}
function improve(cfg){
 const api=window[cfg.api];if(!api)return;
 const origCalc=api.calculator.bind(api),origBind=api.bind.bind(api);
 api.calculator=(d,ctx)=>{
 const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],index=Math.max(0,Math.min(ctx.rowIndex,rows.length-1));
 const person=rows[index]||{name:"",answers:[]};
 let h='<section class="psy-reviewed-method"><div class="calc-mode"><button type="button" class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button type="button" class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
 if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Участник <select id="participantSelect">'+rows.map((r,i)=>'<option value="'+i+'" '+(index===i?"selected":"")+'>'+esc((i+1)+". "+(r.name||"Участник "+(i+1)))+'</option>').join("")+'</select></label><button type="button" class="btn" id="addParticipant">Добавить участника</button></div>';
 h+='<label style="display:block;margin:12px 0">Код участника (без персональных данных)<input type="text" id="participantName" maxlength="120" value="'+esc(person.name||"")+'" style="display:block;max-width:360px;width:100%" placeholder="Например, 7А-01"></label>';
 h+=origCalc(d,ctx);
 if(cfg.type==="analogies"){h+='<label style="display:block;margin:14px 0">Пояснения и ошибки<textarea data-reviewed-notes="analogies" rows="3" style="width:100%" placeholder="Сведения о ходе решения">'+esc(person.psyNotes||"")+'</textarea></label>';}
 else h+='<label style="display:block;margin:14px 0">Ход запоминания, помощь и наблюдения<textarea data-reviewed-notes="paired" rows="3" style="width:100%">'+esc(person.psyNotes||"")+'</textarea></label>';
 h+='<div class="actions"><button type="button" class="btn primary" id="reviewDownload">Скачать отч\u0451т участника · А4</button><button type="button" class="btn" id="reviewReset">Очистить протокол участника</button></div>';
 if(ctx.calcMode==="class")h+='<section id="reviewedClass">'+classTable(cfg,rows)+'</section><div class="actions"><button type="button" class="btn" id="reviewExportCsv">Скачать таблицу класса · CSV</button><button type="button" class="btn" id="reviewExportClass">Скачать отч\u0451т класса · А4</button></div>';
 return h+'</section>';
 };
 api.bind=(d,ctx)=>{
 const rows=ctx.rows||[],person=rows[ctx.rowIndex];if(!person)return;
 origBind(d,ctx);
 const updateGroup=()=>{const el=document.getElementById("reviewedClass");if(el)el.innerHTML=classTable(cfg,rows);};
 document.getElementById("participantName")?.addEventListener("input",e=>{person.name=e.target.value;updateGroup()});
 document.querySelector("[data-reviewed-notes]")?.addEventListener("input",el=>{person.psyNotes=el.target.value;});
 if(cfg.type==="paired"){
  person.pairedAnswers??={};person.pairedNotes??={};
  for(const g of api.GROUPS){g.items.forEach((pair,i)=>{
    const id=g.code+"-"+i,word=document.querySelector('[data-paired-note="'+id+'"]'),mark=document.querySelector('[data-paired-mark="'+id+'"]');
    const apply=()=>{const txt=word?.value.trim()||"",grade=txt?Number(normWord(txt)===normWord(pair[1])):null;person.pairedAnswers[id]=grade;if(mark)mark.value=grade===null?"":String(grade);const target=document.getElementById("pairedSummary");if(target)target.innerHTML=(api.outcomes(person.pairedAnswers).map(z=>'<p><b>'+esc(z.title)+'</b>: '+(z.complete?z.correct+"/10":"Оценено "+(z.correct+z.wrong)+"/10")+'</p>').join(""))+'<p>Проверка дословного воспроизведения; пропуски сохраняются.</p>';updateGroup();};
    if(word?.value.trim() && person.pairedAnswers[id]!==Number(normWord(word.value)===normWord(pair[1])))apply();
    else if(mark?.value==="1"&&!word?.value.trim()){person.pairedAnswers[id]=null;mark.value="";}
    word?.addEventListener("input",apply);
    mark?.addEventListener("change",()=>{if(word?.value.trim()){apply();return;}if(mark?.value==="1"){mark.value="";person.pairedAnswers[id]=null;const out=document.getElementById("pairedSummary");if(out)out.innerHTML=api.outcomes(person.pairedAnswers).map(z=>"<p><b>"+esc(z.title)+"</b>: "+(z.complete?z.correct+"/10":"Оценено "+(z.correct+z.wrong)+"/10")+"</p>").join("");}updateGroup();});
  });}
 }else document.querySelectorAll("[data-analogy]").forEach(x=>x.addEventListener("change",updateGroup));
 const downloadHtml=(filename,body)=>save(filename,body,"text/html;charset=utf-8");
 document.getElementById("reviewDownload")?.addEventListener("click",()=>downloadHtml(cfg.type+"_participant.html",worksheet(cfg,person,api)));
 document.getElementById("reviewExportCsv")?.addEventListener("click",()=>save(cfg.type+"_class.csv",groupCsv(cfg,rows),"text/csv;charset=utf-8"));
 document.getElementById("reviewExportClass")?.addEventListener("click",()=>{const sheets=rows.map(p=>worksheet(cfg,p,api).match(/<body>([\s\S]*?)<\/body>/)?.[1]||"").join('<div style="break-before:page"></div>');downloadHtml(cfg.type+"_class.html",'<!doctype html><html lang="ru"><meta charset="utf-8"><title>Протокол класса</title><style>@page{size:A4;margin:13mm}body{font:10pt Arial}table{border-collapse:collapse;width:100%}td,th{border:1px solid #bbb;padding:5px}tr{break-inside:avoid}@media print{.tools{display:none}}</style><body>'+sheets+'</body></html>');});
 document.getElementById("reviewReset")?.addEventListener("click",()=>{if(!confirm("Очистить ответы выбранного участника?"))return;
 if(cfg.type==="analogies"){person.answers=[];person.psyNotes="";}
 else {person.pairedAnswers={};person.pairedNotes={};person.psyNotes="";}
 document.querySelector('.modal-tab[data-tab="score"]')?.click();});
 };
}
configs.forEach(improve);
window.PSY_REVIEWED_WORKSHEETS={stats,groupCsv,normWord,worksheet};
})();