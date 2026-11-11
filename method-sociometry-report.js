"use strict";
/* Метолария. Descriptive sociometry: only actual positive nominations.
   No status thresholds or negative nominations are inferred. */
(function(){
 const api=window.PSY_NEW_METHODS;
 if(!api)return;
 const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 let selectedChild="",onlyMutual=false;
 const T=x=>Number.isInteger(x)?String(x):"";
 const csv=rows=>"\uFEFF"+rows.map(row=>row.map(cell=>{
  let v=String(cell??"");if(/^\s*[=+\-@]/.test(v))v="'"+v;
  return '"'+v.replace(/"/g,'""')+'"';
 }).join(";")).join("\r\n");
 function download(name,rows){
  const blob=new Blob([csv(rows)],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.download=name;a.href=url;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1200);
 }
 const clean=(p,s)=>{
  const own=s.edges.get(p.socioId);
  const received=s.incoming.get(p.socioId)||0;
  const reciprocal=s.mutual.get(p.socioId)||0;
  return {own,received,reciprocal,answered:own!==undefined};
 };
 function observation(p,s,n){
  const d=clean(p,s);
  if(s.answered===0)return "Нет завершенных анкет. Оценить полученные выборы пока нельзя.";
  let narrative="";
  if(d.received) narrative="Получено "+d.received+" положительных выборов, взаимных связей – "+d.reciprocal+".";
  else narrative="Среди "+s.answered+" завершенных анкет положительных выборов не получено.";
  if(!d.answered)narrative+=" Собственная анкета не завершена.";
  if(s.answered<n)narrative+=" Данные предварительные.";
  return narrative;
 }
 const review=p=>{
  const v=p.socioReview||{};
  const status=v.status==="needs-review"?"Требует уточнения":v.status==="resolved"?"Уточнено":"";
  if(!status)return {status:"",reason:"",note:""};
  const reason=v.reason==="same"?"Повторяющиеся выборы":
   v.reason==="instruction"?"Уточнение инструкции":v.reason==="other"?"Наблюдение психолога":"";
  return {status,reason,note:String(v.note||"").slice(0,1000)};
 };
 const reviewLabel=p=>{
  const v=review(p);
  return v.status?(v.status+(v.reason?" · "+v.reason:"")+(v.note?" · "+v.note:"")):"Не отмечено";
 };
 const code=(p,i)=>String(i+1).padStart(2,"0");
 function matrix(people,s){
  const head='<thead><tr><th scope="col">Кто выбирает</th>'+
   people.map((p,i)=>'<th scope="col" title="'+E(p.name)+'">'+code(p,i)+'</th>').join("")+
   '<th scope="col">Сделано</th></tr></thead>';
  const body=people.map((p,i)=>{
   const selected=s.edges.get(p.socioId);
   const cells=people.map((other,j)=>{
    if(i===j)return '<td class="psy-socio-matrix-self" title="Самовыбор запрещен">×</td>';
    if(!selected)return '<td class="psy-socio-matrix-missing" title="Анкета не завершена">…</td>';
    if(!selected.has(other.socioId))return '<td class="psy-socio-matrix-blank" title="Выбор отсутствует">·</td>';
    const mutual=s.edges.get(other.socioId)?.has(p.socioId);
    return '<td class="'+(mutual?"psy-socio-matrix-mutual":"psy-socio-matrix-oneway")+
     '" title="'+E(p.name)+" → "+E(other.name)+(mutual?" (взаимно)":"")+'">'+(mutual?"↔":"→")+'</td>';
   }).join("");
   return '<tr><th scope="row">'+code(p,i)+'. '+E(p.name)+'</th>'+cells+
    '<td class="psy-socio-matrix-total">'+(selected?selected.size:"–")+'</td></tr>';
  }).join("");
  const footer='<tfoot><tr><th scope="row">Получено</th>'+
   people.map(p=>'<td>'+(s.answered?T(s.incoming.get(p.socioId)):"–")+'</td>').join("")+
   '<td>'+s.total+'</td></tr></tfoot>';
  return '<div class="psy-socio-matrix-scroll"><table class="psy-socio-matrix">'+head+'<tbody>'+body+'</tbody>'+footer+'</table></div>'+
   '<p class="psy-socio-legend"><span class="psy-socio-legend-pair">↔ взаимный выбор</span><span>→ односторонний выбор</span>'+
   '<span>· нет выбора</span><span>… анкета не завершена</span></p>';
 }
 const short=(s,max=17)=>{const v=String(s||"").trim();return v.length>max?v.slice(0,max-1)+"…":v;};
 function sociogram(people,s){
  if(!s.answered)return '<p class="psy-socio-empty">Схема появится, когда будет заполнена хотя бы одна анкета по вопросу.</p>';
  if(people.length>40)return '<p class="psy-socio-empty">Для групп более 40 учеников связи удобнее изучать в социоматрице: крупная схема становится нечитаемой.</p>';
  const n=people.length,cx=420,cy=268,rx=355,ry=203,points=new Map();
  people.forEach((p,i)=>{
   const angle=-Math.PI/2+2*Math.PI*i/Math.max(1,n);
   points.set(p.socioId,{x:cx+rx*Math.cos(angle),y:cy+ry*Math.sin(angle),i});
  });
  const links=[];
  for(const [from,ids] of s.edges)for(const to of ids){
   const mutual=!!s.edges.get(to)?.has(from);
   if(mutual&&from>to)continue;
   if(onlyMutual&&!mutual)continue;
   const a=points.get(from),b=points.get(to);
   if(!a||!b)continue;
   const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy);
   if(!length)continue;
   const ux=dx/length,uy=dy/length;
   const x1=a.x+ux*23,y1=a.y+uy*23,x2=b.x-ux*23,y2=b.y-uy*23;
   const vals=[x1,y1,x2,y2].map(v=>v.toFixed(1));
   links.push('<path d="M'+vals[0]+' '+vals[1]+' L'+vals[2]+' '+vals[3]+'" class="'+
    (mutual?"psy-socio-edge-mutual":"psy-socio-edge-directed")+'"'+
    (mutual?' marker-start="url(#psySocReciprocal)" marker-end="url(#psySocReciprocal)"':' marker-end="url(#psySocArrow)"')+'/>');
  }
  const circles=people.map((p,i)=>{
   const pt=points.get(p.socioId),inCount=s.incoming.get(p.socioId)||0;
   return '<g class="psy-socio-node"><title>'+E(p.name)+': получено '+inCount+' выборов</title>'+
    '<circle cx="'+pt.x.toFixed(1)+'" cy="'+pt.y.toFixed(1)+'" r="20"/>'+
    '<text x="'+pt.x.toFixed(1)+'" y="'+(pt.y+4.5).toFixed(1)+'" text-anchor="middle">'+(i+1)+'</text></g>';
  }).join("");
  return '<div class="psy-socio-network-plot"><svg viewBox="0 0 840 536" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Схема положительных выборов учеников по текущему вопросу">'+
   '<defs><marker id="psySocArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth"><path d="M0 0 L7 3.5 L0 7 Z" fill="#a98355"/></marker>'+
   '<marker id="psySocReciprocal" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse" markerUnits="strokeWidth"><path d="M0 0 L7 3.5 L0 7 Z" fill="#32806e"/></marker></defs>'+
   '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" class="psy-socio-orbit"/>'+
   links.join("")+circles+'</svg></div>'+
   '<div class="psy-socio-map-key">'+people.map((p,i)=>'<span><b>'+(i+1)+'</b>'+E(short(p.name,28))+'</span>').join("")+'</div>';
 }
 function individual(people,result){
  const target=people.find(p=>p.socioId===selectedChild)||people[0];
  if(!target)return "";
  selectedChild=target.socioId;
  return '<div class="psy-socio-individual"><div class="psy-socio-section-heading"><div><h4>Карточка ученика</h4>'+
   '<p>Фактические выборы по всем шести вопросам</p></div><label>Ученик <select id="psySocAnalysedPerson">'+
   people.map(p=>'<option value="'+E(p.socioId)+'" '+(p.socioId===target.socioId?"selected":"")+'>'+E(p.name)+'</option>').join("")+
   '</select></label></div>'+
   '<div class="psy-socio-summary-scroll"><table class="psy-socio-person-table"><thead><tr><th>Вопрос</th><th>Сделал</th><th>Получил</th><th>Взаимно</th><th>Интерпретация данных</th></tr></thead><tbody>'+
   result.map((s,i)=>{
    const d=clean(target,s);
    return '<tr><td><strong>'+(i+1)+'.</strong> '+E(s.question)+'</td>'+
     '<td>'+(d.answered?d.own.size:"–")+'</td><td>'+(s.answered?d.received:"–")+'</td>'+
     '<td>'+(s.answered?d.reciprocal:"–")+'</td><td>'+E(observation(target,s,people.length))+'</td></tr>';
   }).join("")+'</tbody></table></div>'+
   '<p class="psy-socio-note"><strong>Отметка психолога:</strong> '+E(reviewLabel(target))+'</p>'+
   '<p class="psy-socio-note">Результаты разных критериев нельзя суммировать в единый «рейтинг» ребенка. Полученные выборы описывают только указанные ситуации.</p></div>';
 }
 function table(people,s){
  const header='<thead><tr><th>Ученик</th><th>Сделал</th><th>Получил</th><th>Взаимно</th><th>Анкета</th><th>Отметка психолога</th><th>Фактический анализ</th></tr></thead>';
  const body=people.map(p=>{
   const d=clean(p,s);
   return '<tr><th scope="row">'+E(p.name)+'</th>'+
    '<td>'+(d.answered?d.own.size:"–")+'</td>'+
    '<td>'+(s.answered?d.received:"–")+'</td>'+
    '<td>'+(s.answered?d.reciprocal:"–")+'</td>'+
    '<td><span class="psy-socio-answer-status '+(d.answered?"is-ready":"is-pending")+'">'+
     (d.answered?"Заполнена":"Не завершена")+'</span></td>'+
    '<td class="psy-socio-review-cell '+(review(p).status==="Требует уточнения"?"is-flagged":"")+'">'+E(reviewLabel(p))+'</td>'+
    '<td class="psy-socio-observation">'+E(observation(p,s,people.length))+'</td></tr>';
  }).join("");
  return '<div class="psy-socio-summary-scroll"><table class="psy-socio-children-table">'+header+'<tbody>'+body+'</tbody></table></div>';
 }
 function render({people,result,selected,activeId}){
  if(!selectedChild&&activeId)selectedChild=activeId;
  if(!people.length)return "";
  const s=result[selected]||result[0];
  const incomplete=s.answered<people.length;
  const reached=people.filter(p=>(s.incoming.get(p.socioId)||0)>0).length;
  const description=s.answered
   ?"По "+s.answered+" завершенным анкетам зарегистрировано "+s.total+
    " положительных выборов и "+s.pairs+" взаимных пар. Хотя бы один выбор получили "+reached+
    " из "+people.length+" учеников."+
    (incomplete?" Данные предварительные: не все анкеты заполнены.":"")
   :"Пока нет завершенных анкет по этому вопросу. Количественный анализ не проводится.";
  return '<div class="psy-socio-analytics"><p class="psy-socio-class-reading">'+E(description)+'</p><div class="psy-socio-section-heading"><div>'+
   '<h4>Анализ каждого ученика</h4><p>'+E(s.question)+'</p></div>'+
   '<span class="psy-socio-coverage '+(incomplete?"is-pending":"is-ready")+'">'+
    (incomplete?"Предварительно":"Все анкеты завершены")+' · '+s.answered+' из '+people.length+'</span></div>'+
   (s.answered?table(people,s):'<p class="psy-socio-empty">По этому вопросу пока нет завершенных анкет. Показатели учеников не рассчитаны.</p>')+
   individual(people,result)+
   '<section class="psy-socio-visual"><div class="psy-socio-section-heading"><div>'+
   '<h4>Социограмма</h4><p>Линии показывают только реальные выборы по выбранному вопросу</p></div>'+
   '<label class="psy-socio-filter"><input type="checkbox" id="psySocMutualOnly" '+(onlyMutual?"checked":"")+'><span>Только взаимные</span></label></div>'+
   sociogram(people,s)+
   '<p class="psy-socio-legend"><span>Зеленые стрелки с двух сторон – взаимный выбор</span><span>Коричневые – односторонний</span></p></section>'+
   '<details class="psy-socio-matrix-panel"><summary><span>Социоматрица</span><small>Показать таблицу всех связей</small></summary>'+
   '<p class="psy-socio-note">Строка – кто выбирает, столбец – кого выбрали. Данные указаны только по завершенным анкетам.</p>'+
   matrix(people,s)+'</details>'+
   '<div class="class-actions psy-socio-report-actions"><button type="button" class="btn" id="psySocAnalysisCSV">Скачать таблицу анализа детей</button>'+
   '<button type="button" class="btn" id="psySocMatrixCSV">Скачать социоматрицу</button>'+
   '<button type="button" class="btn" id="psySocPrintAnalysis">Посмотреть и распечатать А4</button></div>'+
   '<p class="psy-socio-note">Нет ответов ≠ «Никто». Ноль входящих выборов не является доказательством непринятия или отвержения ребенка. Данные детей доступны только специалисту с правом доступа к обследованию.</p></div>';
 }
 function prepareCSV(people,result){
  const rows=[["Ученик","Вопрос","Критерий","Сделал выборов","Получил выборов","Взаимных связей","Собственная анкета","Завершено анкет класса","Анализ","Отметка психолога","Причина","Комментарий"]];
  result.forEach((s,i)=>people.forEach(p=>{
   const d=clean(p,s);
   rows.push([p.name,i+1,s.question,d.answered?d.own.size:"",s.answered?d.received:"",s.answered?d.reciprocal:"",
    d.answered?"Заполнена":"Не завершена",s.answered+" из "+people.length,observation(p,s,people.length),review(p).status,review(p).reason,review(p).note]);
  }));
  return rows;
 }
 function prepareMatrix(people,s){
  return [["Кто выбирает / кого выбрали",...people.map(p=>p.name),"Сделано выборов"],...people.map(p=>{
   const chosen=s.edges.get(p.socioId);
   return [p.name,...people.map(other=>{
    if(p.socioId===other.socioId)return "×";
    if(!chosen)return "Анкета не завершена";
    if(!chosen.has(other.socioId))return "";
    return s.edges.get(other.socioId)?.has(p.socioId)?"Взаимно":"Выбран";
   }),chosen?chosen.size:""];
  }),["Получено выборов",...people.map(p=>s.answered?s.incoming.get(p.socioId):""),s.answered?s.total:""]];
 }
 function printView(people,result,selected){
  const s=result[selected],ids=people.map(p=>p.socioId);
  const content='<h1>Социометрия класса – аналитический отчет</h1>'+
    '<p class="note">Рабочая форма с шестью редактируемыми положительными критериями. Данные конфиденциальны.</p>'+
    '<h2>Полнота обследования</h2><table><thead><tr><th>№</th><th>Критерий</th><th>Завершено анкет</th><th>Положительных выборов</th><th>Взаимных пар</th></tr></thead><tbody>'+
    result.map((r,i)=>'<tr><td>'+(i+1)+'</td><td>'+E(r.question)+'</td><td>'+r.answered+' из '+people.length+'</td><td>'+r.total+'</td><td>'+r.pairs+'</td></tr>').join("")+'</tbody></table>'+
    '<h2>Анализ учеников – вопрос '+(selected+1)+'</h2><p>'+E(s.question)+'</p>'+table(people,s)+
    '<h2>Социоматрица – вопрос '+(selected+1)+'</h2>'+matrix(people,s)+
    '<h2>Индивидуальные показатели по шести вопросам</h2>'+
    people.map(p=>'<section class="person"><h3>'+E(p.name)+'</h3><p class="note">Отметка психолога: '+E(reviewLabel(p))+'</p><table><thead><tr><th>Вопрос</th><th>Сделал</th><th>Получил</th><th>Взаимно</th><th>Описание</th></tr></thead><tbody>'+
      result.map((r,i)=>{const d=clean(p,r);return '<tr><td>'+(i+1)+'</td><td>'+(d.answered?d.own.size:"–")+'</td><td>'+(r.answered?d.received:"–")+'</td><td>'+(r.answered?d.reciprocal:"–")+'</td><td>'+E(observation(p,r,people.length))+'</td></tr>';}).join("")+
     '</tbody></table></section>').join("")+
    '<p class="note">Заключения носят описательный характер. При неполном участии показатели предварительны. Отсутствие положительных выборов нельзя трактовать как отвержение. Суммарная оценка по шести разным критериям не рассчитывается.</p>';
  const css='@page{size:A4;margin:13mm}*{box-sizing:border-box}body{font:10pt/1.4 Arial,sans-serif;color:#263a30;padding:4mm}h1{font-size:17pt}h2{font-size:12pt;margin:16px 0 7px}h3{font-size:11pt;margin:13px 0 6px}p{margin:5px 0 10px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #b5c8ba;padding:4px 5px;text-align:left;vertical-align:top;font-size:8.2pt;overflow-wrap:anywhere}tr{break-inside:avoid}.psy-socio-matrix-scroll,.psy-socio-summary-scroll{overflow:visible!important}.psy-socio-matrix{width:100%;table-layout:fixed}.psy-socio-matrix th,.psy-socio-matrix td{font-size:7pt;padding:2px;text-align:center}.psy-socio-matrix th:first-child{width:22%;text-align:left}.note,.psy-socio-note,.psy-socio-legend{font-size:8pt;color:#536457}.person{break-inside:avoid}@media print{button{display:none}}button{margin-top:18px;padding:10px 18px;border:1px solid #8cae91;border-radius:9px;cursor:pointer;background:#eaf3eb;color:#254934;font:inherit}';
  const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Метолария – отчет по социометрии</title><style>'+css+'</style></head><body>'+content+
    '<p><button onclick="window.print()">Печать</button></p></body></html>';
  const preview=window.open("","_blank");
  if(preview){
   preview.document.open();
   preview.document.write(html);
   preview.document.close();
   preview.focus();
  }else{
   const blob=new Blob([html],{type:"text/html;charset=utf-8"}),url=URL.createObjectURL(blob);
   const a=document.createElement("a");a.href=url;a.download="Метолария_социометрия_отчет_A4.html";
   document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
 }
 function bind(ctx,refresh,selected){
  const {people,result}=ctx, s=result[selected];
  document.getElementById("psySocAnalysedPerson")?.addEventListener("change",e=>{
   selectedChild=e.target.value;refresh();
  });
  document.getElementById("psySocMutualOnly")?.addEventListener("change",e=>{
   onlyMutual=!!e.target.checked;refresh();
  });
  document.getElementById("psySocAnalysisCSV")?.addEventListener("click",()=>download("Метолария_социометрия_анализ_детей.csv",prepareCSV(people,result)));
  document.getElementById("psySocMatrixCSV")?.addEventListener("click",()=>download("Метолария_социометрия_матрица.csv",prepareMatrix(people,s)));
  document.getElementById("psySocPrintAnalysis")?.addEventListener("click",()=>printView(people,result,selected));
 }
 api.sociometryReport={render,bind,prepareCSV,prepareMatrix,observation,matrix,sociogram,
  select:id=>{if(id)selectedChild=id;}};
})();