"use strict";
(function(){
 const semester=window.PSY_SEMESTER_2026,phillips=window.PSY_PHILLIPS,norms=window.PSY_CDI_NORMS_2026;
 if(!semester||!phillips||!norms)return;
 const old={cdiCalc:semester.calculator,cdiGuide:semester.instruction,cdiBlank:semester.materials,phCalc:phillips.calculator,phGuide:phillips.instruction,phBlank:phillips.materials};
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const type=d=>d?.id==="cdi-27"?"cdi":d?.workflow==="phillips58"?"ph":null;
 const max=d=>type(d)==="cdi"?2:1;
 const size=d=>type(d)==="cdi"?27:58;
 const subjects=d=>type(d)==="cdi"?norms.items:phillips.topics;
 const status=r=>r?.attendance==="absent"?"Отсутствовал":"Присутствует";
 const valid=(v,d)=>type(d)==="cdi"?[0,1,2,"0","1","2"].includes(v):v==="yes"||v==="no";
 function done(d,answers){return Array.from({length:size(d)},(_,i)=>answers?.[i]).filter(v=>valid(v,d)).length;}
 function scoring(d,r){if(!r||r.attendance==="absent")return null;return type(d)==="cdi"?semester.score(d,r.answers||[],r):phillips.score(d,r.answers||[]);}
 function value(d,raw){return type(d)==="ph"?(raw==="yes"?"1":raw==="no"?"0":""):valid(raw,d)?String(raw):"";}
 function interpretation(p){return p>75?"Высокий показатель":p>50?"Повышенный показатель":"Не превышает 50%";}
 function progress(n,total){return '<div class="psy-mspss-track"><span style="width:'+Math.max(0,Math.min(100,n/total*100))+'%"></span></div>';}
 function palette(i){return ["psy-cp-purple","psy-cp-green","psy-cp-blue"][i%3];}
 function result(d,r){
  const n=done(d,r?.answers||[]),total=size(d),z=scoring(d,r);
  if(r?.attendance==="absent")return '<section class="psy-mspss-result psy-cp-absent"><h3>Ученик отсутствовал</h3><p>Ответы сохранены, но результаты не рассчитываются и не входят в сводку класса.</p></section>';
  if(!z)return '<section class="psy-mspss-result"><h3>Заполнено '+n+' из '+total+'</h3>'+progress(n,total)+'<p>После ввода всех ответов появится автоматическая обработка. Пропуск не равен нулевому баллу.</p></section>';
  if(type(d)==="cdi"){
   const t=norms.norm(z.raw,r.ageYears,r.sex),tValue=t.status==="ok"?String(t.t):"–";
   return '<section class="psy-mspss-result"><h3>Общий показатель депрессивных симптомов</h3>'+
    '<strong class="psy-mspss-mean">'+z.raw+' <small>/ 54</small></strong>'+
    '<p>Сумма 27 кодов из выбранных утверждений. Для расчета Т-балла используются возраст и пол из таблицы PDF.</p>'+
    '<div class="psy-mspss-scales psy-cp-scales">'+
     '<div class="'+palette(0)+'"><b>Общий сырой балл</b><strong>'+z.raw+' / 54</strong>'+progress(z.raw,54)+'</div>'+
     '<div class="'+palette(1)+'"><b>Т-балл по таблице PDF</b><strong>'+tValue+'</strong><p>'+esc(t.status==="ok"?t.level:t.message)+'</p></div>'+
     '<div class="'+palette(2)+'"><b>Проверка полноты</b><strong>27 / 27</strong>'+progress(27,27)+'</div></div>'+
    (Number(r.answers[8])>=1?'<div class="psy-cp-alert">В пункте 9 выбран ответ о суицидальных мыслях. Нужна безотлагательная личная оценка безопасности независимо от общего результата.</div>':"")+
    '<p class="psy-mspss-small">Основной показатель CDI – общая сумма. Отдельные симптомные области не выдаются за нормированные подшкалы. Показатель не является диагнозом.</p></section>';
  }
  const scaleHtml=z.scales.map((s,i)=>'<div class="'+palette(i)+'"><b>'+esc(s.name)+'</b><strong>'+s.raw+' / '+s.max+' · '+s.percent.toFixed(1)+'%</strong>'+
   progress(s.raw,s.max)+'<small>'+esc(interpretation(s.percent))+'</small></div>').join("");
  return '<section class="psy-mspss-result"><h3>Общая школьная тревожность</h3>'+
   '<strong class="psy-mspss-mean">'+z.raw+' <small>/ 58</small></strong>'+
   '<p>Несовпадения с ключом: <b>'+z.percent.toFixed(1)+'%</b>. Ориентир из предоставленного PDF: <b>'+esc(interpretation(z.percent).toLowerCase())+'</b>.</p>'+
   '<div class="psy-mspss-scales psy-cp-scales">'+scaleHtml+'</div>'+
   '<p class="psy-mspss-small">Восемь факторов пересекаются по пунктам; суммы факторов не складывают. В третьем факторе по PDF Гребень (2007) перечислено 12 номеров.</p></section>';
 }
 const alpha=rows=>rows.slice().sort((a,b)=>(a.name||"").localeCompare(b.name||"","ru",{sensitivity:"base"}));
 function group(d,rows){
  const ordered=alpha(rows).filter(r=>r.name?.trim()||done(d,r.answers));
  const isCDI=type(d)==="cdi";
  const head=isCDI?'<th>Сырой / 54</th><th>Т-балл</th>':'<th>Общий / 58</th><th>%</th>'+phillips.scales.map((s,i)=>'<th title="'+esc(s.name)+'">Ф'+(i+1)+'</th>').join("");
  const body=ordered.map((r,i)=>{
   const z=scoring(d,r),n=done(d,r.answers),t=isCDI&&z?norms.norm(z.raw,r.ageYears,r.sex):null;
   const cols=isCDI?'<td>'+(z?z.raw:"–")+'</td><td>'+(t?.t??"–")+'</td>':
    '<td>'+(z?z.raw:"–")+'</td><td>'+(z?z.percent.toFixed(1)+"%":"–")+'</td>'+phillips.scales.map((s,j)=>'<td>'+(z?z.scales[j].percent.toFixed(1)+"%":"–")+'</td>').join("");
   return '<tr><td>'+esc(r.name||"У-"+(i+1))+'</td><td>'+(r.attendance==="absent"?"Отсутствовал":z?"Обработан":"Заполнено "+n+" / "+size(d))+'</td>'+cols+'</tr>';
  }).join("");
  let extra="";
  if(!isCDI){
   const ok=ordered.map(r=>scoring(d,r)).filter(Boolean);
   extra=ok.length?'<h3>Сводные показатели класса</h3><p>Полностью обработано '+ok.length+' анкет. Отсутствующие и неполные анкеты исключены.</p><div class="psy-mspss-scroll"><table><thead><tr><th>Фактор</th><th>Выше 50%</th><th>Выше 75%</th></tr></thead><tbody>'+phillips.scales.map((s,i)=>'<tr><td>'+esc(s.name)+'</td><td>'+ok.filter(z=>z.scales[i].percent>50).length+'</td><td>'+ok.filter(z=>z.scales[i].percent>75).length+'</td></tr>').join("")+'</tbody></table></div>':"";
  }
  return '<section class="psy-mspss-group"><h3>Результаты класса</h3><div class="psy-mspss-scroll"><table><thead><tr><th>Ученик</th><th>Статус</th>'+head+'</tr></thead><tbody>'+body+'</tbody></table></div>'+
   '<p class="psy-mspss-small">Отсутствующие и неполные результаты не используются в статистике класса.</p>'+extra+'</section>';
 }
 function calculator(d,ctx){
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],a=r.answers||[],n=done(d,a),total=size(d);
  let h='<section class="psy-mspss-calculator psy-cp-calculator"><div class="calc-mode psy-mspss-modes">'+
   '<button type="button" class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button>'+
   '<button type="button" class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа / класс</button></div>';
  if(ctx.calcMode==="class"){
   h+='<div class="psy-mspss-workspace"><aside class="psy-mspss-sidebar"><h3>Список учащихся</h3><p>Добавьте учеников по одному с новой строки. Для конфиденциальности можно использовать условные коды.</p>'+
    '<label class="psy-mspss-label" for="cpBulkNames">Добавить участников</label><textarea id="cpBulkNames" rows="5" placeholder="Ученик 01&#10;Ученик 02"></textarea>'+
    '<button type="button" class="btn primary psy-mspss-add" id="cpAddNames">Добавить в список</button>'+
    '<button type="button" class="btn psy-mspss-sort" id="cpSort">По алфавиту А - Я</button>'+
    '<div class="psy-mspss-person-list">'+rows.map((u,i)=>(u.name?.trim()||done(d,u.answers))?
      '<div class="psy-mspss-person-row"><button type="button" class="psy-mspss-person '+(i===ctx.rowIndex?"active":"")+'" data-cp-person="'+i+'"><span>'+esc(u.name||"Участник "+(i+1))+'</span><small>'+(u.attendance==="absent"?"Отсутствует":done(d,u.answers)+"/"+total)+'</small></button>'+
      '<button type="button" class="psy-mspss-delete-person" title="Удалить ученика" aria-label="Удалить '+esc(u.name||"ученика")+'" data-cp-delete="'+i+'">×</button></div>':"").join("")+'</div>'+
    '<button type="button" class="btn psy-mspss-delete-all" id="cpDeleteAll">Удалить всех участников</button></aside><div class="psy-mspss-entry">';
  }else h+='<div class="psy-mspss-entry">';
  h+='<label class="psy-mspss-name-field" for="cpCurrentName"><span>Фамилия и имя / условный код</span><input type="text" id="cpCurrentName" maxlength="120" autocomplete="off" value="'+esc(r.name||"")+'" placeholder="Введите имя или код"></label>';
  if(type(d)==="cdi")h+='<div class="psy-cp-demographics"><label>Возраст, полных лет<select id="cpAge"><option value="">Не выбран</option>'+Array.from({length:11},(_,i)=>i+7).map(age=>'<option value="'+age+'" '+(r.ageYears===age?"selected":"")+'>'+age+'</option>').join("")+'</select></label><label>Пол для Т-баллов<select id="cpSex"><option value="">Не выбран</option><option value="m" '+(r.sex==="m"?"selected":"")+'>Мальчик</option><option value="f" '+(r.sex==="f"?"selected":"")+'>Девочка</option></select></label></div>';
  h+='<p class="psy-mspss-progress" id="cpProgress">Заполнено '+n+' из '+total+'</p>';
  if(r.attendance==="absent")h+='<p class="psy-cp-absence">Ученик отмечен отсутствующим. Ввод заблокирован до возвращения в список присутствующих.</p>';
  h+='<div class="psy-mspss-grid psy-cp-grid">'+subjects(d).map((topic,i)=>{
   const answer=value(d,a[i]),complete=answer!=="";
   return '<label class="psy-mspss-item '+(complete?"is-complete":"is-missing")+'"><span><b>'+(i+1)+'.</b> '+esc(topic)+'</span>'+
    '<input class="psy-mspss-score-input psy-cp-answer" data-cp-answer="'+i+'" type="text" inputmode="numeric" autocomplete="off" maxlength="1" placeholder="'+(type(d)==="cdi"?"0-2":"0-1")+'" aria-label="Пункт '+(i+1)+' – балл" value="'+esc(answer)+'" '+(r.attendance==="absent"?"disabled":"")+'></label>';
  }).join("")+'</div>';
  if(ctx.calcMode==="class")h+='<div class="psy-mspss-after-questions psy-cp-next-actions"><button type="button" class="btn" id="cpAbsent">'+(r.attendance==="absent"?"Вернуть в список присутствующих":"Отсутствовал – следующий")+'</button><button type="button" class="btn primary" id="cpNext" '+(rows.slice(ctx.rowIndex+1).some(x=>x.attendance!=="absent")?"":"disabled")+' >Следующий участник →</button></div>';
  h+='<div id="cpResult">'+result(d,r)+'</div></div>';
  if(ctx.calcMode==="class")h+='</div><div id="cpGroup">'+group(d,rows)+'</div>';
  return h+'</section>';
 }
 function instruction(d){
  const isCDI=type(d)==="cdi";
  const intro=isCDI?"Опросник содержит 27 наборов из трех утверждений. Ребенок выбирает одно утверждение, соответствующее его состоянию за последние две недели. Баллы ответов в PDF могут идти не по порядку.":"Опросник из предоставленного PDF включает 58 вопросов о школе с ответами «Да» или «Нет».";
  const key=isCDI?"27 выбранных кодов 0-2 суммируются (0-54). Т-балл определяется по возрасту 7-12 или 13-17 лет и полу по таблице PDF. В таблице имеются пропуски и ошибка для мальчиков 7-12 лет при сырых 27-28.":"За каждый ответ, не совпавший с ключом, начисляется 1 балл; максимум 58. Восемь факторов определяются по соответствующим номерам. В PDF Гребень (2007) третий фактор содержит 12 перечисленных номеров, а не ошибочно напечатанные 13.";
  const pupil=isCDI?"Прочитай по три утверждения в каждом пункте и отметь то, которое лучше всего описывает твое самочувствие за последние две недели. Здесь нет правильных и неправильных ответов.":"Прочитай вопросы о том, как ты чувствуешь себя в школе. Для каждого вопроса выбери «Да» или «Нет». Здесь нет правильных и неправильных ответов.";
  return '<section class="psy-mspss-section psy-mspss-manual"><div class="psy-mspss-manual-bar"><h3>Методика и руководство</h3><div class="psy-mspss-manual-actions"><button class="btn" type="button" data-cp-print="guide">Без бланка</button><button class="btn primary" type="button" data-cp-print="combined">С бланком</button></div></div>'+
   '<h3>Цель</h3><p>'+esc(d.goal)+'</p><h3>Описание методики</h3><p>'+esc(intro)+'</p>'+
   '<h3>Порядок проведения</h3><ol><li>Подготовьте бланк из проверенной версии и обеспечьте спокойную обстановку.</li><li>Прочитайте инструкцию участнику. Не подсказывайте ответы.</li><li>Перенесите ответы в обработку по тем же номерам, затем проверьте полноту и итог.</li></ol>'+
   '<h3>Инструкция для чтения ученику</h3><div class="psy-mspss-script">'+esc(pupil)+'</div>'+
   '<h3>Ключ и подсчет</h3><p>'+esc(key)+'</p>'+
   (isCDI?'<h3>Интерпретация</h3><p>Основной показатель – общий сырой балл. Перевод в Т-балл доступен только для сочетаний возраста, пола и суммы, приведенных в таблице PDF. Пункт 9 требует отдельной оценки безопасности при положительном ответе.</p>':
    '<h3>Восемь факторов</h3><div class="psy-mspss-key-wrap"><table class="psy-mspss-key"><thead><tr><th>Фактор</th><th>Пункты</th><th>Максимум</th></tr></thead><tbody>'+phillips.scales.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.q.join(", ")+'</td><td>'+s.q.length+'</td></tr>').join("")+'</tbody></table></div><h3>Интерпретация</h3><p>Свыше 50% несовпадений – повышенный, свыше 75% – высокий показатель по данной редакции. Это не диагноз.</p>')+
   '<p class="psy-mspss-small">Печатный текст полного опросника берется из предоставленного PDF. Данный онлайн-комплект представляет регистрационный бланк и расчет, а не новую авторскую редакцию стимулов.</p></section>';
 }
 function materials(d){
  const isCDI=type(d)==="cdi",options=isCDI?["0","1","2"]:["Нет","Да"];
  return '<section class="psy-mspss-section psy-mspss-student"><div class="psy-mspss-blank-head"><div><h3>Бланк ученика</h3><p>Регистрация ответов по исходным номерам вопросов.</p></div><button class="btn primary psy-mspss-view" type="button" data-cp-print="blank">Посмотреть и распечатать</button></div>'+
   '<p><strong>Инструкция.</strong> '+(isCDI?"Выбери одно из трех утверждений в каждом пункте бланка PDF. Записывается балл 0, 1 или 2, указанный возле выбранного текста.":"Для каждого вопроса оригинального PDF отметь «Да» или «Нет».")+'</p>'+
   '<div class="psy-mspss-rating">'+options.map((o,i)=>'<div><strong>'+i+'</strong><span>'+(isCDI?"Балл "+o:o)+'</span></div>').join("")+'</div>'+
   '<div class="psy-mspss-blank-scroll"><table class="psy-mspss-blank-table"><thead><tr><th>№</th><th>Тема пункта</th>'+options.map(x=>'<th>'+esc(x)+'</th>').join("")+'</tr></thead><tbody>'+
   subjects(d).map((q,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(q)+'</td>'+options.map(()=>'<td class="psy-mspss-answer-cell"></td>').join("")+'</tr>').join("")+'</tbody></table></div>'+
   '<p class="psy-mspss-small">Для стандартизованного обследования используйте полный текст оригинального PDF. Здесь представлены только краткие темы для регистрации ответов.</p></section>';
 }
 function printable(d,mode){
  const source=type(d)==="cdi"?"Предоставленный 8-страничный PDF CDI, 27 пунктов":"Предоставленный PDF Гребень (2007), 58 пунктов";
  const guide='<article><h1>'+esc(d.id==="cdi-27"?"Опросник детской депрессии М. Ковач (CDI)":"Тест школьной тревожности Филлипса")+'</h1><p>'+esc(source)+'</p><h2>Цель</h2><p>'+esc(d.goal)+'</p><h2>Порядок проведения</h2><p>'+esc(d.instructions)+'</p><h2>Ключ</h2><p>'+esc(d.scoring)+'</p><h2>Интерпретация</h2><p>'+esc(d.interpret)+'</p></article>';
  const opts=type(d)==="cdi"?"0 / 1 / 2":"Нет / Да";
  const blank='<article class="newpage"><h1>Бланк регистрации ответов</h1><p>Участник: ____________________________  Дата: _______________</p><p>Проверенная редакция: '+esc(source)+'</p><table><thead><tr><th>№</th><th>Тема</th><th>Ответ ('+opts+')</th></tr></thead><tbody>'+subjects(d).map((s,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(s)+'</td><td>__________</td></tr>').join("")+'</tbody></table></article>';
  return '<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Материалы Метоларии</title><style>@page{size:A4;margin:14mm}body{font:11pt/1.5 Arial;color:#1e3e2e}h1{font-size:18pt}h2{font-size:13pt}table{border-collapse:collapse;width:100%}td,th{border:1px solid #8ba892;padding:6px;font-size:9pt;text-align:left}tr{break-inside:avoid}.newpage{break-before:page}</style></head><body>'+(mode==="blank"?blank:guide)+(mode==="combined"?blank:"")+'</body></html>';
 }
 function report(d,rows,mode,index){
  const selected=mode==="class"?alpha(rows).filter(r=>r.name?.trim()||done(d,r.answers)):[rows[index]];
  if(mode!=="class"&&!scoring(d,selected[0]))return false;
  const head=type(d)==="cdi"?"<th>Сырой / 54</th><th>Т-балл</th>":"<th>Общий / 58</th><th>Процент</th>"+phillips.scales.map((s,i)=>"<th>Ф"+(i+1)+"</th>").join("");
  const entries=selected.map((r,i)=>{const z=scoring(d,r),t=z&&type(d)==="cdi"?norms.norm(z.raw,r.ageYears,r.sex):null;return '<tr><td>'+esc(r.name||"У-"+(i+1))+'</td><td>'+(r.attendance==="absent"?"Отсутствовал":z?"Обработан":"Неполная анкета")+'</td>'+(type(d)==="cdi"?'<td>'+(z?z.raw:"–")+'</td><td>'+(t?.t??"–")+'</td>':'<td>'+(z?z.raw:"–")+'</td><td>'+(z?z.percent.toFixed(1)+"%":"–")+'</td>'+phillips.scales.map((s,j)=>'<td>'+(z?z.scales[j].percent.toFixed(1)+"%":"–")+'</td>').join(""))+'</tr>'}).join("");
  const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Отчет Метоларии</title><style>@page{size:A4 landscape;margin:13mm}body{font:11pt Arial;color:#1c392b}h1{font-size:18pt}table{border-collapse:collapse;width:100%;font-size:9pt}td,th{border:1px solid #abc1b4;padding:7px;text-align:left}thead{background:#e8f3ec}p{line-height:1.5}</style></head><body><h1>'+esc(type(d)==="cdi"?"Опросник детской депрессии М. Ковач (CDI)":"Тест школьной тревожности Филлипса")+'</h1><p>Дата: '+new Date().toLocaleDateString("ru-RU")+' · '+(mode==="class"?"Отчет класса":"Индивидуальный отчет")+'</p><table><thead><tr><th>Ученик</th><th>Статус</th>'+head+'</tr></thead><tbody>'+entries+'</tbody></table><p>Результаты не являются диагнозом. Отсутствующие и неполные анкеты исключены из подсчета.</p></body></html>';
  return save("Metolaria_"+(type(d)==="cdi"?"CDI":"Phillips")+(mode==="class"?"_class":"_participant")+"_report.html",html,"text/html;charset=utf-8");
 }
 function save(name,body,mime){
  const uri=URL.createObjectURL(new Blob([body],{type:mime})),a=document.createElement("a");a.href=uri;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(uri),1000);return true;
 }
 function csv(d,rows){
  const head=["Ученик","Статус",...(type(d)==="cdi"?["Возраст","Пол","Сырой балл","Т-балл"]:["Общий балл","%",...phillips.scales.map(x=>x.name)]),...Array.from({length:size(d)},(_,i)=>"Пункт "+(i+1))];
  const records=[head,...alpha(rows).map((r,i)=>{const z=scoring(d,r),t=z&&type(d)==="cdi"?norms.norm(z.raw,r.ageYears,r.sex):null;
   const extras=type(d)==="cdi"?[r.ageYears??"",r.sex||"",z?.raw??"",t?.t??""]:[z?.raw??"",z?.percent.toFixed(1)??"",...phillips.scales.map((s,j)=>z?.scales[j].percent.toFixed(1)??"")];
   return [r.name||"У-"+(i+1),status(r),...extras,...Array.from({length:size(d)},(_,i)=>r.attendance==="absent"?"":value(d,r.answers?.[i]))];
  })];
  const cell=v=>{let s=String(v??"");if(/^\s*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
  return "\uFEFF"+records.map(row=>row.map(cell).join(";")).join("\r\n");
 }
 function bind(d,ctx){
  document.querySelectorAll("[data-cp-print]").forEach(btn=>btn.addEventListener("click",()=>save("Metolaria_"+type(d)+"_"+btn.dataset.cpPrint+".html",printable(d,btn.dataset.cpPrint),"text/html;charset=utf-8")));
  if(ctx.tab!=="score")return;
  const rows=ctx.rows,r=rows[ctx.rowIndex];if(!r)return;r.answers ||= [];
  const update=()=>{
   const n=done(d,r.answers),progress=document.getElementById("cpProgress");if(progress)progress.textContent="Заполнено "+n+" из "+size(d);
   const res=document.getElementById("cpResult");if(res)res.innerHTML=result(d,r);
   const groupEl=document.getElementById("cpGroup");if(groupEl)groupEl.innerHTML=group(d,rows);
   const active=document.querySelector(".psy-mspss-person.active small");if(active)active.textContent=r.attendance==="absent"?"Отсутствует":n+"/"+size(d);
   const btn=document.getElementById("cpReportBottom");if(btn){const eligible=ctx.calcMode==="class"?rows.some(x=>!!scoring(d,x)):!!scoring(d,r);btn.disabled=!eligible;btn.classList.toggle("psy-mspss-waiting",!eligible);}
  };
  document.getElementById("cpCurrentName")?.addEventListener("input",e=>{
   r.name=e.target.value;const active=document.querySelector(".psy-mspss-person.active span");if(active)active.textContent=r.name||"Участник";
  });
  document.getElementById("cpAge")?.addEventListener("change",e=>{r.ageYears=e.target.value?Number(e.target.value):null;update()});
  document.getElementById("cpSex")?.addEventListener("change",e=>{r.sex=e.target.value;update()});
  document.querySelectorAll("[data-cp-person]").forEach(btn=>btn.addEventListener("click",()=>ctx.onSelect?.(Number(btn.dataset.cpPerson))));
  document.getElementById("cpAddNames")?.addEventListener("click",()=>{const t=document.getElementById("cpBulkNames"),names=(t?.value||"").split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean);if(names.length)ctx.onBulkAdd?.(names);else t?.focus();});
  document.getElementById("cpSort")?.addEventListener("click",()=>{const t=document.getElementById("cpBulkNames"),names=(t?.value||"").split(/[\r\n]+/).map(x=>x.trim()).filter(Boolean);ctx.onSort?.(names);});
  document.querySelectorAll("[data-cp-delete]").forEach(btn=>btn.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();const i=Number(btn.dataset.cpDelete);if(confirm("Удалить ученика "+(rows[i]?.name||"") +" вместе с его ответами?"))ctx.onDelete?.(i)}));
  document.getElementById("cpDeleteAll")?.addEventListener("click",()=>{if(confirm("Удалить весь список и введенные ответы?"))ctx.onDeleteAll?.()});
  document.getElementById("cpAbsent")?.addEventListener("click",()=>{
   if(r.attendance==="absent"){r.attendance="present";ctx.onRender?.();return;}
   if(done(d,r.answers)>0&&!confirm("У ученика есть ответы. Отметить отсутствующим, сохранив ответы, но исключив их из подсчета?"))return;
   r.attendance="absent";(ctx.onAbsentNext||ctx.onRender)?.();
  });
  document.getElementById("cpNext")?.addEventListener("click",()=>ctx.onNext?.());
  const inputs=[...document.querySelectorAll("input[data-cp-answer]")];
  const next=(i)=>{for(let j=i+1;j<inputs.length;j++)if(!inputs[j].disabled){inputs[j].focus();return;}document.getElementById("cpNext")?.focus();};
  function setInput(field,val){const i=Number(field.dataset.cpAnswer);if(val!==""&&![...Array(max(d)+1)].some((_,n)=>String(n)===val))return;field.value=val;
   r.answers[i]=val===""?null:type(d)==="cdi"?Number(val):val==="1"?"yes":"no";
   const card=field.closest(".psy-mspss-item");card?.classList.toggle("is-complete",val!=="");card?.classList.toggle("is-missing",val==="");update();
  }
  inputs.forEach((field,i)=>{
   field.addEventListener("input",()=>{const v=field.value.replace(/[^0-9]/g,"").slice(-1);if(v!==""&&Number(v)>max(d)){field.value="";return;}setInput(field,v);if(v!=="")next(i);});
   field.addEventListener("keydown",e=>{
    if(e.key==="Backspace"&&!field.value&&i>0){e.preventDefault();inputs[i-1].focus();inputs[i-1].select();}
    else if(e.key==="ArrowRight"){e.preventDefault();next(i);}
    else if(e.key==="ArrowLeft"&&i>0){e.preventDefault();inputs[i-1].focus();}
   });
   field.addEventListener("paste",e=>{
    const text=e.clipboardData?.getData("text")||"";if(!/^[0-9\s,;]+$/.test(text))return;
    const nums=text.replace(/[\s,;]/g,"").split("");if(!nums.length||nums.some(v=>Number(v)>max(d)))return;
    e.preventDefault();nums.forEach((v,j)=>{if(inputs[i+j]&&!inputs[i+j].disabled)setInput(inputs[i+j],v)});
    if(inputs[Math.min(inputs.length-1,i+nums.length)])inputs[Math.min(inputs.length-1,i+nums.length)].focus();
   });
   field.addEventListener("focus",()=>field.select());
  });
  update();
 }
 semester.calculator=(d,ctx)=>type(d)==="cdi"?calculator(d,ctx):old.cdiCalc(d,ctx);
 semester.instruction=d=>type(d)==="cdi"?instruction(d):old.cdiGuide(d);
 semester.materials=d=>type(d)==="cdi"?materials(d):old.cdiBlank(d);
 phillips.calculator=(d,ctx)=>type(d)==="ph"?calculator(d,ctx):old.phCalc(d,ctx);
 phillips.instruction=d=>type(d)==="ph"?instruction(d):old.phGuide(d);
 phillips.materials=d=>type(d)==="ph"?materials(d):old.phBlank(d);
 window.PSY_MATCH_MSPSS={supports:d=>!!type(d),calculator,bind,scoring,done,group,result,csv,report,printable};
})();