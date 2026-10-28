"use strict";
(function(){
 const orig=window.PSY_SEMESTER_2026, norms=window.PSY_CDI_NORMS_2026;
 if(!orig||!norms)return;
 const esc=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
 const current=d=>d?.id==="cdi-27";
 const d=window.PSY_FULL_METHODS?.["Опросник детской депрессии М. Ковач (CDI)"];
 if(d){
  d.age="7-17 лет (27-пунктная версия предоставленного PDF)";
  d.indicators=["Общий сырой балл 0-54","Т-балл с учетом возраста и пола по таблице PDF","Сопоставление Т-балла с интервалами источника","Пункт 9 – отдельное наблюдение за безопасностью"];
  d.sourceDescription="Предоставленный пользователем PDF «Опросник детской депрессии», 8 страниц. Нормативная таблица – страницы 6-8.";
  d.scoring="Сумма закодированных ответов на 27 пунктов (0, 1 или 2), диапазон 0-54. Для Т-балла укажите пол и возраст 7-17 лет. Таблица в PDF имеет несогласованность для мальчиков 7-12 лет при сумме 27-28, поэтому результат не подменяется догадкой.";
  d.interpret="Основной показатель – общий балл. Интервалы Т-баллов берутся из предоставленной таблицы и описывают отклонение от среднего, но не являются диагнозом.";
 }
 const existing=orig.calculator, oldBind=orig.bind, oldInstructions=orig.instruction, oldProcessing=orig.processing, oldMaterials=orig.materials, oldCsv=orig.csv;
 const norm=(raw,r)=>norms.norm(raw,r.ageYears,r.sex);
 const score=(r)=>r?.attendance==="absent"?null:orig.score(d,r?.answers||[],r);
 function diagnosis(r){
  const z=score(r);if(r?.attendance==="absent")return '<div class="psy-semester-status is-skipped">Отсутствовал – результат не рассчитывается</div>';
  if(!z)return '<div class="psy-semester-status is-pending">Заполнено '+orig.count(orig.methods[0],r.answers||[])+' из 27</div><p>Все 27 ответов нужны для подсчета. Незаполненный пункт не равен 0.</p>';
  const n=norm(z.raw,r),pct=Math.round(z.raw/54*100),suicidality=Number(r.answers[8])>=1;
  return '<div class="psy-semester-status is-complete">Обработка готова</div>'+
   '<div class="psy-cdi-overall"><div><span>Сырой балл</span><strong>'+z.raw+' / 54</strong></div><div><span>Т-балл</span><strong>'+(n.status==="ok"?n.t:"–")+'</strong></div></div>'+
   '<div class="psy-cdi-scale"><span style="width:'+pct+'%"></span></div>'+
   '<p class="psy-cdi-context">'+esc(n.status==="ok"?n.level:n.message)+'</p>'+
   (suicidality?'<div class="psy-cdi-safety">По пункту 9 выбран ответ о мыслях о самоубийстве. Необходима безотлагательная индивидуальная оценка безопасности – независимо от общей суммы.</div>':'')+
   '<p class="psy-semester-muted">Баллы и категория не заменяют клиническую оценку. Для сравнения нужны нормы именно этой версии.</p>';
 }
 function classTable(rows){
  return '<div class="psy-semester-table"><table><thead><tr><th>Ученик</th><th>Статус</th><th>Сырой</th><th>Т-балл</th></tr></thead><tbody>'+
   rows.map((r,i)=>{const z=score(r),n=z?norm(z.raw,r):null;return '<tr><td>'+esc(r.name||"У-"+(i+1))+'</td><td>'+esc(r.attendance==="absent"?"Отсутствовал":z?"Обработан":"Не заполнено")+'</td><td>'+(z?z.raw+" / 54":"–")+'</td><td>'+(n?.status==="ok"?n.t:"–")+'</td></tr>'}).join("")+'</tbody></table></div>';
 }
 function calculator(data,ctx){
  if(!current(data))return existing(data,ctx);
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],a=r.answers||[];
  let h='<section class="psy-semester psy-cdi-ui"><div class="calc-mode"><button type="button" class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button type="button" class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
  if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Ученик <select id="participantSelect">'+rows.map((u,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(u.name||"У-"+(i+1))+'</option>').join("")+'</select></label><label>Условный код<input type="text" id="participantName" maxlength="40" value="'+esc(r.name||"")+'" placeholder="У-01"></label><button type="button" class="btn" id="addParticipant">Добавить</button></div>';
  else h+='<p class="psy-semester-muted">Ответы обрабатываются только в вашем браузере. Для класса используйте условные коды, а не персональные данные.</p>';
  h+='<p class="psy-cdi-note"><b>Версия из предоставленного PDF.</b> Вносите балл <b>0, 1 или 2</b>, напечатанный рядом с выбранным ребенком утверждением. Номер строки ответа сам по себе не равен баллу.</p>';
  h+='<div class="psy-cdi-demographics"><label>Возраст ребенка, полных лет<select id="cdiAge"><option value="">Выберите возраст</option>'+Array.from({length:11},(_,i)=>i+7).map(n=>'<option value="'+n+'" '+(Number(r.ageYears)===n?"selected":"")+'>'+n+'</option>').join("")+'</select></label><label>Пол для таблицы Т-баллов<select id="cdiSex"><option value="">Выберите</option><option value="m" '+(r.sex==="m"?"selected":"")+'>Мальчик</option><option value="f" '+(r.sex==="f"?"selected":"")+'>Девочка</option></select></label></div>';
  h+='<div class="psy-semester-grid">'+norms.items.map((title,i)=>'<label class="psy-semester-item"><span><b>'+(i+1)+'.</b> '+esc(title)+'</span><input type="text" inputmode="numeric" maxlength="1" autocomplete="off" data-sanswer="'+i+'" aria-label="Баллы по пункту '+(i+1)+'" placeholder="0-2" value="'+esc(a[i]??"")+'"></label>').join("")+'</div>';
  h+='<div id="semesterResult">'+diagnosis(r)+'</div><div class="psy-semester-actions"><button type="button" class="btn" id="semesterClear">Очистить ответы</button><button type="button" class="btn primary" id="semesterExport" '+(score(r)?"":"disabled")+'>Скачать протокол</button></div>';
  if(ctx.calcMode==="class")h+='<h3>Результаты класса</h3><div id="semesterGroup">'+classTable(rows)+'</div><div class="psy-semester-actions"><button type="button" class="btn primary" id="semesterCSV">Скачать CSV класса</button></div>';
  return h+'</section>';
 }
 function download(name,body,mime){const url=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 function makeCsv(rows){
  const vals=[["Условный код","Статус","Возраст","Пол","Сырой балл","Т-балл",...Array.from({length:27},(_,i)=>"Пункт "+(i+1))],...rows.map((r,i)=>{const z=score(r),n=z?norm(z.raw,r):null;return [r.name||"У-"+(i+1),r.attendance==="absent"?"Отсутствовал":z?"Обработан":"Не заполнено",r.ageYears??"",r.sex==="m"?"Мальчик":r.sex==="f"?"Девочка":"",z?.raw??"",n?.t??"",...Array.from({length:27},(_,j)=>r.attendance==="absent"?"":r.answers?.[j]??"")]})];
  const cell=x=>{let s=String(x??"");if(/^\s*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};return "\uFEFF"+vals.map(r=>r.map(cell).join(";")).join("\r\n");
 }
 function bind(data,ctx){
  if(!current(data))return oldBind(data,ctx);
  const r=ctx.rows[ctx.rowIndex];if(!r)return;r.answers ||= [];
  const update=()=>{
   const e=document.getElementById("semesterResult");if(e)e.innerHTML=diagnosis(r);
   const g=document.getElementById("semesterGroup");if(g)g.innerHTML=classTable(ctx.rows);
   const ex=document.getElementById("semesterExport");if(ex)ex.disabled=!score(r);
   orig.syncFooter(data,ctx.rows,ctx.rowIndex);
  };
  document.querySelectorAll("[data-sanswer]").forEach(el=>el.addEventListener("change",()=>{r.answers[Number(el.dataset.sanswer)]=/^[012]$/.test(el.value)?Number(el.value):null;update()}));
  document.getElementById("cdiAge")?.addEventListener("change",e=>{r.ageYears=e.target.value?Number(e.target.value):null;update()});
  document.getElementById("cdiSex")?.addEventListener("change",e=>{r.sex=e.target.value;update()});
  document.getElementById("semesterClear")?.addEventListener("click",()=>{if(r.answers.some(x=>x!==null&&x!==undefined&&x!=="")&&!confirm("Очистить ответы ученика?"))return;r.answers=[];ctx.rerender?.()});
  document.getElementById("semesterExport")?.addEventListener("click",()=>{
   const z=score(r);if(!z)return;const n=norm(z.raw,r);
   const text=["Опросник детской депрессии М. Ковач (CDI, 27 пунктов)","Условный код: "+(r.name||"не задан"),"Возраст: "+(r.ageYears??"не указан"),"Сырой балл: "+z.raw+" / 54","Т-балл: "+(n.t??"нет в таблице"),n.message,"Пункт 9: "+r.answers[8]+" (требует отдельной проверки при 1 или 2)","Основа: PDF, предоставленный пользователем. Не является диагнозом."].join("\n");
   const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>@page{size:A4;margin:16mm}body{font:12pt/1.5 Arial;white-space:pre-wrap;color:#23382f}</style></head><body>'+esc(text)+'</body></html>';
   download("Metolaria_CDI_27_protocol.html",html,"text/html;charset=utf-8");
  });
  document.getElementById("semesterCSV")?.addEventListener("click",()=>download("Metolaria_CDI_27_class.csv",makeCsv(ctx.rows),"text/csv;charset=utf-8"));
 }
 orig.calculator=calculator;orig.bind=bind;
 orig.csv=(data,rows)=>current(data)?makeCsv(rows):oldCsv(data,rows);
 orig.processing=data=>current(data)?'<h3>Обработка по предоставленному PDF</h3><p>Сложите 27 уже закодированных ответов (0-2), максимальная сумма 54. Для Т-балла укажите пол и полный возраст в годах. Таблица 7-12 и 13-17 лет представлена на страницах 6-8 PDF.</p><p>Т-баллы: 45-55 – средний интервал; 56-60 – чуть выше; 61-65 – выше; 66-70 – значительно выше; свыше 70 – группа риска согласно таблице источника. Это не диагноз.</p><p>На страницах 6-8 PDF для мальчиков 7-12 лет сырым 27 и 28 соответствуют Т-баллы 73 и 72 соответственно (обратный порядок). Из-за внутренней несогласованности программа не рассчитывает эти два значения.</p><p>Положительный ответ на пункт 9 требует отдельного внимания специалиста независимо от общего результата.</p>':oldProcessing(data);
 orig.instruction=data=>current(data)?'<h3>Цель</h3><p>Оценка выраженности депрессивных симптомов у детей 7-17 лет.</p><h3>Инструкция</h3><p>Предъявите оригинальный бланк из загруженного PDF, поясните выбор одного из трех утверждений в каждом пункте. Оценка касается последних двух недель. Для младших детей при необходимости зачитывают инструкцию и пункты.</p><h3>Ключ и нормы</h3><p>Напротив каждого утверждения в PDF указан балл 0, 1 или 2. Сложите все 27 баллов. Для Т-баллов используется таблица по возрасту и полу, страницы 6-8. Пункт 27 в представленном тексте требует сверки с исходным изданием, поскольку его формулировки выглядят несогласованными.</p><p>Форма опубликована в пользовательском PDF. Для распространения полного текста необходимо отдельно проверить авторские права.</p>':oldInstructions(data);
 orig.materials=data=>current(data)?'<h3>Лист регистрации ответов</h3><p>В бланке из предоставленного PDF есть полный текст утверждений и баллы рядом с каждым вариантом. Обязательно проверяйте, что переносите в калькулятор именно цифру выбранного утверждения, а не его порядковый номер.</p><p>На странице обработки указаны тематики всех 27 пунктов, но не перепечатан защищенный полный текст опросника.</p><p>Для печати собственного регистрационного листа используйте кнопку «Распечатать А4».</p>':oldMaterials(data);
 window.PSY_CDI_2026={norm,diagnosis,makeCsv,calculator};
})();