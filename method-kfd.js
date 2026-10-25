"use strict";
(function(){
 const NAME="Кинетический рисунок семьи";
 const SOURCE="https://www.routledge.com/Action-Styles-And-Symbols-In-Kinetic-Family-Drawings-Kfd/Burns-Kaufman/p/book/9781138172081";
 const SOURCE_RU="https://elib.kspu.ru/get/38907";
 const FIELDS=[
 ["people","Состав рисунка","Кто изображен и как обозначен ребенок; уточнение без догадок"],
 ["actions","Действия и взаимодействия","Что делает каждый, какие действия общие и какие индивидуальные"],
 ["figures","Особенности отдельных фигур","Размеры, детали, последовательность рисования — только описание"],
 ["composition","Композиция и пространственные отношения","Расположение, расстояния, перегородки, центральные и краевые позиции"],
 ["symbols","Предметы и символы","Какие предметы нарисованы, как сам ребенок объясняет их роль"],
 ["sequence","Ход выполнения","Последовательность, паузы, самокоррекция, просьбы о помощи"],
 ["quotes","Дословный рассказ ребенка","Кто где находится, что делает, как описывает события"],
 ["questions","Дополнительные вопросы","Что важно уточнить и чем проверить наблюдения"]
 ];
 const WARN="В авторской книге Бернса и Кауфмана представлены подробные подходы к анализу действий, стиля и символов. Данный электронный протокол — рабочая форма качественной регистрации, а не авторский стандартизированный ключ. По отдельному признаку рисунка нельзя делать вывод о конфликте, насилии, травме или диагнозе. Сохраняйте рисунок отдельно и учитывайте слова ребенка, возраст и контекст.";
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const d=window.PSY_FULL_METHODS[NAME]||{};
 Object.assign(d,{
  author:"Роберт К. Бернс (R. C. Burns), С. Гарвард Кауфман (S. H. Kaufman)",
  age:"Дети, способные выполнить рисунок и рассказать о нем; интерпретация учитывает возраст",
  kind:"Проективная рисуночная диагностическая беседа",
  count:"1 свободный рисунок семьи в действии + беседа",
  goal:"Качественно исследовать субъективное представление ребенка о семье, действиях и взаимодействиях ее членов.",
  instructions:"Дайте белый лист А4, простой карандаш и ластик (цветные карандаши — по условиям принятой версии). Скажите: «Нарисуй всю свою семью, включая себя, так, чтобы каждый был занят каким-нибудь делом». Не подсказывайте состав семьи или конкретные действия. После рисунка попросите назвать каждого человека и объяснить, кто что делает.",
  scoring:"Единой автоматической балльной оценки данного рабочего протокола нет. Психолог описывает присутствующих людей, действия, взаимодействие, композицию, особенности фигур, предметы и объяснения ребенка. Отдельно фиксируются ход выполнения, паузы, исправления и вопросы. Количество фигур — описательная запись, не нормативная шкала.",
  interpret:"Избегайте жестких правил вида «маленькая фигура означает страх». Значение деталей обсуждается с ребенком и сопоставляется с контекстом, наблюдением и другими данными. Самостоятельный рисунок не подтверждает диагноз или семейное неблагополучие.",
  warning:WARN,source:SOURCE,sourceAdditional:SOURCE_RU,officialBlank:SOURCE,
  guideFile:"downloads/kfd_burns_kaufman_guide.docx",
  answerFile:"downloads/kfd_burns_kaufman_student.html",
  workflow:"kfdBurns72",graphic:"drawing",calculator:true,
  questions:["Кто изображен на рисунке?","Чем занят каждый член семьи?","Что происходит между людьми?","Почему выбраны эти места, действия и предметы?"],
  scaleLabels:["Состав семьи","Действия и взаимодействия","Фигуры и композиция","Предметы и символы","Пояснения ребенка"]
 });
 window.PSY_FULL_METHODS[NAME]=d;
 const isCount=v=>v!==""&&v!=null&&Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<=30;
 function score(d,a){const n=isCount(a?.[0])?Number(a[0]):null;const self=["yes","no","unknown"].includes(a?.[1])?a[1]:null;return n===null&&self===null?null:{status:"descriptive",peopleDrawn:n,selfDrawn:self,caption:"Описательный протокол без психометрических баллов"};}
 function links(d){return '<div class="psy-kfd-links"><a class="btn primary" href="'+esc(d.guideFile)+'" download>Руководство и протокол · Word</a><a class="btn" href="'+esc(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Чистый бланк рисунка · А4 ↗</a><a class="btn" href="'+esc(d.source)+'" target="_blank" rel="noopener noreferrer">Книга авторов ↗</a></div>';}
 function instruction(d){return '<h3>Как проводить</h3><p>'+esc(d.instructions)+'</p>'+links(d)+
 '<h3>После рисунка</h3><ol>'+d.questions.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol>'+
 '<p>Сохраните исходный лист. Последовательность рисования, спонтанные слова и реакцию на задания записывайте во время обследования. Не исправляйте рисунок ребенка и не выдавайте интерпретацию сразу.</p>'+
 '<div class="notice psy-kfd-alert">'+esc(d.warning)+'</div>';}
 function materials(d){return '<h3>Чистый бланк для рисунка</h3><div class="notice">Бланк А4 содержит большое свободное пространство, без готовых людей, объектов или подсказок. Задание психолог произносит вслух.</div>'+
 links(d)+'<div class="psy-kfd-preview"><div></div><span>Свободное поле листа А4</span></div>'+
 '<p>Время, порядок появления деталей и объяснения фиксируются отдельно в протоколе психолога.</p>';}
 function processing(d){return '<h3>Направления качественного анализа</h3><div class="psy-kfd-criteria">'+FIELDS.slice(0,6).map(([key,label,hint])=>'<div><strong>'+esc(label)+'</strong><span>'+esc(hint)+'</span></div>').join("")+'</div>'+
 '<p>'+esc(d.scoring)+'</p><div class="notice psy-kfd-alert">'+esc(d.warning)+'</div>'+links(d);}
 function report(d,a,n){const s=score(d,a),count=FIELDS.filter(([key])=>String(n?.[key]||"").trim().length>0).length;
   return '<section class="psy-kfd-report"><h3>Сводка наблюдений</h3><div class="psy-kfd-summary"><div><span>Изображено фигур</span><strong>'+(s?.peopleDrawn??"—")+'</strong></div><div><span>Фигура ребенка</span><strong>'+({yes:"Есть",no:"Не нарисована",unknown:"Требует уточнения"}[s?.selfDrawn]||"—")+'</strong></div><div><span>Качественные записи</span><strong>'+count+' / '+FIELDS.length+'</strong></div></div>'+
   '<div class="notice">Число фигур и описанные признаки не переводятся в уровень благополучия или диагноз. Для заключения нужен анализ оригинального рисунка и беседы.</div></section>';}
 function calculator(d,ctx){
   const people=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],p=people[ctx.rowIndex]||people[0],a=p.answers||[],notes=p.kfdNotes||{};
   let h='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ребенок</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа по кодам</button></div>'+
   '<div class="notice">Это структурированный <strong>качественный протокол</strong>, а не подсчет нормативных баллов. Оригинал рисунка храните отдельно. Избегайте ФИО в электронных записях.</div>';
   if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Участник<select id="participantSelect">'+people.map((q,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?'selected':'')+'>'+(i+1)+'. '+esc(q.name||"Код "+(i+1))+'</option>').join("")+'</select></label><label>Код<input id="participantName" value="'+esc(p.name||"")+'" placeholder="Код без ФИО"></label><button class="btn" id="addParticipant">Добавить</button></div>';
   h+='<div class="psy-kfd-counts"><label>Число изображенных людей<input type="number" inputmode="numeric" min="0" max="30" step="1" data-kfd-count value="'+esc(a[0]??"")+'" placeholder="Если известно"></label>'+
   '<label>Ребенок нарисовал себя<select data-kfd-self><option value="">— Не отмечено —</option>'+[["yes","Да"],["no","Нет"],["unknown","Неясно"]].map(([k,v])=>'<option value="'+k+'" '+(a[1]===k?'selected':'')+'>'+v+'</option>').join("")+'</select></label></div>';
   h+='<div class="psy-kfd-notes">'+FIELDS.map(([key,title,hint])=>'<label><strong>'+esc(title)+'</strong><small>'+esc(hint)+'</small><textarea rows="3" data-kfd-note="'+key+'" placeholder="Запишите факты и точные слова">'+esc(notes[key]||"")+'</textarea></label>').join("")+'</div>';
   h+='<div id="kfdReport">'+report(d,a,notes)+'</div><div class="psy-kfd-actions"><button class="btn" id="resetParticipant">Очистить запись</button><button class="btn primary" id="kfdJSON">Скачать протокол JSON</button></div>';
   if(ctx.calcMode==="class")h+='<h3>Сводка по группе</h3><p>В групповую выгрузку не включаются дословные высказывания и личные подробности.</p><div class="results-table"><table><thead><tr><th>Код</th><th>Фигур</th><th>Фигура себя</th><th>Записано наблюдений</th></tr></thead><tbody>'+people.map((q,i)=>{const x=score(d,q.answers),n=q.kfdNotes||{};return '<tr><td>'+esc(q.name||"Код "+(i+1))+'</td><td>'+(x?.peopleDrawn??"—")+'</td><td>'+esc(x?.selfDrawn??"—")+'</td><td>'+FIELDS.filter(([key])=>String(n[key]||"").trim()).length+'</td></tr>'}).join("")+'</tbody></table></div><div class="psy-kfd-actions"><button class="btn primary" id="kfdCSV">Экспорт CSV по группе</button></div>';
   return h;
 }
 function csv(t){let s=String(t??"");if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
 function download(name,txt,mime){const b=new Blob([txt],{type:mime}),url=URL.createObjectURL(b),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1250);}
 function bind(d,ctx){
   const r=ctx.rows[ctx.rowIndex];r.kfdNotes||={};
   const refresh=()=>{const box=document.getElementById("kfdReport");if(box)box.innerHTML=report(d,r.answers,r.kfdNotes);};
   document.querySelector("[data-kfd-count]")?.addEventListener("input",function(){r.answers[0]=this.value===""?"":Number(this.value);refresh()});
   document.querySelector("[data-kfd-self]")?.addEventListener("change",function(){r.answers[1]=this.value;refresh()});
   document.querySelectorAll("[data-kfd-note]").forEach(el=>el.addEventListener("input",()=>{r.kfdNotes[el.dataset.kfdNote]=el.value;refresh()}));
   document.getElementById("kfdJSON")?.addEventListener("click",()=>download("kfd_psychologist_protocol.json",JSON.stringify({method:NAME,version:"Burns & Kaufman kinetic drawing, descriptive working protocol",code:r.name||"",indicators:r.answers||[],observations:r.kfdNotes||{},summary:score(d,r.answers),warning:d.warning},null,2),"application/json;charset=utf-8"));
   document.getElementById("kfdCSV")?.addEventListener("click",()=>{const table=[["Код","Количество фигур","Ребенок изображен","Количество текстовых наблюдений"],...ctx.rows.map((q,i)=>{const s=score(d,q.answers),n=q.kfdNotes||{};return [q.name||"Код "+(i+1),s?.peopleDrawn??"",s?.selfDrawn??"",FIELDS.filter(([key])=>String(n[key]||"").trim()).length]})];download("kfd_group.csv","\uFEFF"+table.map(r=>r.map(csv).join(";")).join("\r\n"),"text/csv;charset=utf-8")});
 }
 window.PSY_KFD={fields:FIELDS,score,instruction,materials,processing,calculator,bind};
})();