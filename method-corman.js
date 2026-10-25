"use strict";
/* Рисунок семьи: вариант Л. Кормана, воображаемая семья.
   Рабочий протокол Психотеки, не нормативный оригинальный ключ. */
(function(){
 const NAME="Рисунок семьи в концепции Л. Кормана";
 const SOURCE="https://msupsyj.ru/articles/article/3584/";
 const HIST="https://doi.org/10.1177/070674376400900508";
 const FIELDS=[
  ["members","Состав нарисованной семьи","Кого ребенок называет и кого считает семьей на этом рисунке"],
  ["story","Сюжет и обстановка","Что происходит на рисунке и где находятся персонажи"],
  ["composition","Композиция и расположение","Соседство, расстояния, размеры, фигуры и пространство листа"],
  ["graphic","Графические особенности","Линии, детали, цвет, пропорции, исправления — только описание"],
  ["imagined","Реальная или воображаемая семья","Что ребенок говорит о сходстве изображенного с реальной семьей"],
  ["sequence","Ход рисования","Порядок, паузы, сомнения, обращения за помощью"],
  ["quotes","Слова ребенка","Дословные пояснения о персонажах и их отношениях"],
  ["followup","Вопросы для уточнения","Что важно проверить беседой и другими методами"]
 ];
 const CAUTION="Описания «Рисунка семьи» часто объединяют разные процедуры. У Л. Кормана исходное задание — нарисовать семью, какой ребенок ее представляет; оно отличается от просьбы нарисовать собственную семью и от кинетического рисунка Бернса–Кауфмана. Комплект Психотеки — качественный протокол, не авторский стандартизированный ключ. Размеры, отсутствие персонажа, цвета и другие отдельные признаки не доказывают травму, семейный конфликт или диагноз.";
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const d=window.PSY_FULL_METHODS[NAME]||{};
 Object.assign(d,{
  author:"Луи Корман (Louis Corman)",
  age:"Преимущественно старший дошкольный и младший школьный возраст; интерпретация индивидуальна",
  kind:"Проективная рисуночная диагностическая беседа",
  count:"1 свободный рисунок воображаемой семьи + беседа",
  goal:"Качественно описать представления ребенка о семье и о взаимоотношениях персонажей выбранного им изображения.",
  instructions:"На чистом листе А4 предложите: «Нарисуй семью так, как ты себе её представляешь. Если хочешь, добавь детали». Не требуйте изображать именно собственную семью и не задавайте, кто обязан быть на рисунке. После завершения попросите рассказать, кто нарисован и что происходит, и уточните, реальная это или воображаемая семья.",
  scoring:"Числового диагностического ключа в данном рабочем комплекте нет. Фиксируются состав и описание фигур, сюжет, композиция, графические особенности, порядок рисования и дословные слова ребенка. Количество фигур можно записать только как наблюдаемый факт, без перевода в баллы или возрастной норматив.",
  interpret:"Различайте изображение семьи как представляемого образа и буквальное описание реальной семьи. Интерпретируйте наблюдения только после уточнений у ребенка и сопоставления с контекстом. Отдельные признаки рисунка не являются клиническими симптомами.",
  warning:CAUTION,source:SOURCE,officialBlank:SOURCE,sourceHistorical:HIST,
  guideFile:"downloads/corman_family_drawing_guide.docx",
  answerFile:"downloads/corman_family_drawing_student.html",
  workflow:"cormanFamily",graphic:"drawing",calculator:true,
  questions:["Кого ты нарисовал?","Что происходит в этой семье?","Это знакомая или придуманная семья?","Что ты хотел показать этим рисунком?"],
  scaleLabels:["Состав и сюжет","Композиция и графические детали","Представляемая семья","Объяснения ребенка"]
 });
 window.PSY_FULL_METHODS[NAME]=d;
 const isCount=x=>x!==""&&x!=null&&Number.isInteger(Number(x))&&Number(x)>=0&&Number(x)<=30;
 function score(d,a){const count=isCount(a?.[0])?Number(a[0]):null,kind=["imagined","real","mixed","unclear"].includes(a?.[1])?a[1]:null;return count===null&&kind===null?null:{status:"descriptive",figures:count,familyKind:kind,caption:"Описание рисунка, без диагностического балла"};}
 function links(d){return '<div class="psy-corman-links"><a class="btn primary" download href="'+esc(d.guideFile)+'">Руководство и протокол · Word</a><a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(d.answerFile)+'">Чистый бланк · А4 ↗</a><a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(d.source)+'">Описание варианта Кормана ↗</a></div>';}
 function instruction(d){return '<h3>Процедура</h3><p>'+esc(d.instructions)+'</p>'+links(d)+'<h3>Беседа после рисунка</h3><ol>'+d.questions.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ol>'+
  '<p>Не называйте этот вариант «кинетическим рисунком семьи»: здесь нет требования показать каждого за отдельным делом. Сохраняйте оригинальный рисунок отдельно.</p><div class="notice psy-corman-warn">'+esc(d.warning)+'</div>';}
 function materials(d){return '<h3>Бланк рисунка</h3><div class="notice">Большое чистое поле А4 — без готовых человечков, сюжетов и символов. Ребенок рисует семью, как он ее представляет; готовые образы не навязываются.</div>'+links(d)+
 '<div class="psy-corman-paper"><span>Свободное поле для рисунка</span></div><p>Полное руководство и запись наблюдений — в отдельном Word-файле.</p>';}
 function processing(d){return '<h3>Разделы качественного протокола</h3><div class="psy-corman-criteria">'+FIELDS.slice(0,6).map(([k,t,h])=>'<div><strong>'+esc(t)+'</strong><span>'+esc(h)+'</span></div>').join("")+'</div>'+
 '<p>'+esc(d.scoring)+'</p><div class="notice psy-corman-warn">'+esc(d.warning)+'</div>'+links(d);}
 function report(a,n){const s=score(d,a),notes=n||{},observations=FIELDS.filter(([k])=>String(notes[k]||"").trim()).length;
  return '<section class="psy-corman-report"><h3>Сводка записи</h3><div class="psy-corman-stats"><div><span>Изображено фигур</span><strong>'+(s?.figures??"—")+'</strong></div><div><span>Тип семьи со слов ребенка</span><strong>'+({real:"Знакомая / реальная",imagined:"Воображаемая",mixed:"Смешанная",unclear:"Не уточнено"}[s?.familyKind]||"—")+'</strong></div><div><span>Записей</span><strong>'+observations+' / '+FIELDS.length+'</strong></div></div>'+
  '<div class="notice">Данные описательные. Нельзя диагностировать семейное неблагополучие по сумме графических признаков.</div></section>';}
 function calculator(d,ctx){
  const people=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=people[ctx.rowIndex]||people[0],a=r.answers||[],n=r.cormanNotes||{};
  let h='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ребенок</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Группа по кодам</button></div>'+
   '<div class="notice">Это качественная беседа по рисунку, а не автоматическая диагностика семьи. Записывайте факты и дословные слова. Рисунок храните отдельно.</div>';
  if(ctx.calcMode==="class")h+='<div class="group-tools"><label>Участник<select id="participantSelect">'+people.map((p,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+(i+1)+'. '+esc(p.name||"Код "+(i+1))+'</option>').join("")+'</select></label><label>Код<input id="participantName" value="'+esc(r.name||"")+'" placeholder="Без ФИО"></label><button class="btn" id="addParticipant">Добавить</button></div>';
  h+='<div class="psy-corman-counts"><label>Сколько фигур нарисовано<input type="number" step="1" min="0" max="30" data-corman-count value="'+esc(a[0]??"")+'" placeholder="Если известно"></label><label>Тип семьи — ответ ребенка<select data-corman-kind><option value="">— Не указано —</option>'+[["real","Знакомая / реальная"],["imagined","Воображаемая"],["mixed","Смешанная"],["unclear","Ребенок не уточнил"]].map(([v,t])=>'<option value="'+v+'" '+(a[1]===v?"selected":"")+'>'+t+'</option>').join("")+'</select></label></div>';
  h+='<div class="psy-corman-notes">'+FIELDS.map(([key,title,tip])=>'<label><strong>'+esc(title)+'</strong><small>'+esc(tip)+'</small><textarea data-corman-note="'+key+'" rows="3" placeholder="Наблюдения или слова ребенка">'+esc(n[key]||"")+'</textarea></label>').join("")+'</div>';
  h+='<div id="cormanReport">'+report(a,n)+'</div><div class="psy-corman-actions"><button class="btn" id="resetParticipant">Очистить запись</button><button class="btn primary" id="cormanJSON">Скачать индивидуальный протокол JSON</button></div>';
  if(ctx.calcMode==="class")h+='<h3>Сводка группы</h3><p>Дословные пояснения не включаются в групповой CSV.</p><div class="results-table"><table><thead><tr><th>Код</th><th>Фигуры</th><th>Тип семьи</th><th>Записей</th></tr></thead><tbody>'+people.map((p,i)=>{const z=score(d,p.answers),notes=p.cormanNotes||{};return '<tr><td>'+esc(p.name||"Код "+(i+1))+'</td><td>'+(z?.figures??"—")+'</td><td>'+esc(z?.familyKind??"—")+'</td><td>'+FIELDS.filter(([key])=>String(notes[key]||"").trim()).length+'</td></tr>'}).join("")+'</tbody></table></div><div class="psy-corman-actions"><button class="btn primary" id="cormanCSV">Экспорт группы CSV</button></div>';
  return h;
 }
 function csv(t){let x=String(t??"");if(/^\s*[=+\-@]/.test(x))x="'"+x;return '"'+x.replace(/"/g,'""')+'"';}
 function download(filename,text,mime){const b=new Blob([text],{type:mime}),url=URL.createObjectURL(b),link=document.createElement("a");link.href=url;link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),1200);}
 function bind(d,ctx){const r=ctx.rows[ctx.rowIndex];r.cormanNotes||={};const update=()=>{const x=document.getElementById("cormanReport");if(x)x.innerHTML=report(r.answers,r.cormanNotes);};
  document.querySelector("[data-corman-count]")?.addEventListener("input",function(){r.answers[0]=this.value===""?"":Number(this.value);update();});
  document.querySelector("[data-corman-kind]")?.addEventListener("change",function(){r.answers[1]=this.value;update();});
  document.querySelectorAll("[data-corman-note]").forEach(el=>el.addEventListener("input",()=>{r.cormanNotes[el.dataset.cormanNote]=el.value;update();}));
  document.getElementById("cormanJSON")?.addEventListener("click",()=>download("corman_family_individual.json",JSON.stringify({method:NAME,version:"Corman imagined family drawing",code:r.name||"",answers:r.answers||[],observations:r.cormanNotes||{},summary:score(d,r.answers),warning:d.warning},null,2),"application/json;charset=utf-8"));
  document.getElementById("cormanCSV")?.addEventListener("click",()=>{const rows=[["Код","Число фигур","Семья","Записей"],...ctx.rows.map((p,i)=>{const z=score(d,p.answers),n=p.cormanNotes||{};return[p.name||"Код "+(i+1),z?.figures??"",z?.familyKind??"",FIELDS.filter(([key])=>String(n[key]||"").trim()).length]})];download("corman_family_group.csv","\uFEFF"+rows.map(row=>row.map(csv).join(";")).join("\r\n"),"text/csv;charset=utf-8");});
 }
 window.PSY_CORMAN={fields:FIELDS,score,instruction,materials,processing,calculator,bind};
})();