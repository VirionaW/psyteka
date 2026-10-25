"use strict";
/* Н. Г. Лусканова: «Что мне нравится в школе».
   Рисуночный модуль, отличный от анкеты из 10 вопросов.
   Основа: авторская публикация «Школьный психолог», 9/2001.
*/
(function(){
 const NAME="Что мне нравится в школе";
 const SOURCE="https://psy.1sept.ru/article.php?ID=200100907";
 const RUBRIC=[
  {id:"study",score:30,label:"Учебная ситуация",example:"Урок, работа у доски, решение задания"},
  {id:"school",score:20,label:"Школьная, но неучебная ситуация",example:"Здание школы, коридор, перемена, портфель"},
  {id:"play",score:10,label:"Игровая ситуация в школе",example:"Игры, игрушки, игровая комната, качели"},
  {id:"offtopic",score:0,label:"Не соответствует школьной теме",example:"Рисунок не связан со школой после уточнения"}
 ];
 const FIELDS=[
  ["depicted","Что изображено","Дословное описание сюжета ребенком"],
  ["why","Почему это нравится","Причины выбора сюжета со слов ребенка"],
  ["understood","Понимание инструкции","Правильно ли понято задание и требовалось ли уточнение"],
  ["layout","Размеры и расположение","Наблюдаемая композиция без психологического ярлыка"],
  ["colors","Цветовое решение","Какие цвета использованы; без трактовки одной краски как симптома"],
  ["dynamics","Динамика сюжета","Наличие действия и движения на рисунке"],
  ["finish","Завершенность и детали","Законченность, исправления, особенности изображения"],
  ["followup","Что уточнить дальше","Рабочие вопросы специалиста для беседы"]
 ];
 const WARNING="Это схема оценки рисунка 0/10/20/30, а не анкета Н. Г. Лускановой на 10 вопросов с уровнями 0–30. Пороговые уровни 25–30, 20–24 и т. д. относятся к анкете и НЕ присваиваются отдельному рисунку. Категорию сюжета выбирает психолог только после беседы. Сама по себе категория не является диагнозом, а несоответствие теме может быть связано с непониманием инструкции.";
 const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const old=window.PSY_FULL_METHODS[NAME]||{};
 Object.assign(old,{
  author:"Н. Г. Лусканова",
  age:"Учащиеся начальных классов, преимущественно 1–4 классы",
  kind:"Проективная рисуночная методика",
  count:"1 тематический рисунок + беседа; 4 категории сюжетов",
  goal:"Изучение привлекательных для ребенка сторон школьной жизни и особенностей отношения к школе по рисунку и беседе.",
  instructions:"Предложите: «Нарисуй, что тебе больше всего нравится в школе. Рисуй, как умеешь; оценок за рисунок не будет». Выдайте чистый лист и карандаши. Не предлагайте ребенку готовый сюжет. После окончания выясните, что изображено и почему он выбрал именно это.",
  scoring:"Психолог относит сюжет после уточняющей беседы к одной категории опубликованной схемы: учебная ситуация — 30, школьная внеучебная — 20, игровая в школе — 10, несоответствие теме — 0. Если сюжет неясен или задание не завершено, оценка не рассчитывается. Учитываются также семь качественных признаков рисунка.",
  interpret:"Балльная категория отражает выбранную сюжетную характеристику. Не переносите на отдельный рисунок пятиуровневые пороги, которые опубликованы для другой части методики — анкеты из десяти вопросов. Уточните понимание инструкции, слова ребенка и другие наблюдения перед выводом.",
  source:SOURCE,officialBlank:SOURCE,
  warning:WARNING,sourceScoring:SOURCE,
  guideFile:"downloads/luskanova_favorite_school_guide.docx",
  answerFile:"downloads/luskanova_favorite_school_student.html",
  workflow:"schoolDrawingL",graphic:"drawing",calculator:true,
  questions:["Что изображено?","Почему выбрано именно это?","Что больше всего нравится в школе?","Все ли понятно в задании?"],
  scaleLabels:["Учебная ситуация — 30","Школьная внеучебная — 20","Игровая в школе — 10","Несоответствие теме — 0"]
 });
 window.PSY_FULL_METHODS[NAME]=old;
 function score(d,a){
   const category=a?.[0],r=RUBRIC.find(x=>x.id===category);
   return r?{raw:r.score,max:30,category:r.id,label:r.label,caption:"Баллы за сюжет рисунка по авторской схеме, не уровень школьной мотивации"}:null;
 }
 function links(d){
  return '<div class="psy-school-draw-links"><a class="btn primary" href="'+esc(d.guideFile)+'" download>Руководство и протокол · Word</a>'+
   '<a class="btn" href="'+esc(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Бланк рисунка · А4 ↗</a>'+
   '<a class="btn" href="'+esc(d.source)+'" target="_blank" rel="noopener noreferrer">Статья Н. Г. Лускановой ↗</a></div>';
 }
 function instruction(d){
  return '<h3>Процедура</h3><p>'+esc(d.instructions)+'</p>'+links(d)+
   '<h3>Беседа после рисунка</h3><ol>'+d.questions.map(q=>'<li>'+esc(q)+'</li>').join("")+'</ol>'+
   '<p>Отмечайте соответствие теме, сюжет, размеры и детали, цвет, динамику, аккуратность и завершенность. Не подсказывайте содержание во время работы.</p>'+
   '<div class="notice psy-school-draw-warn">'+esc(d.warning)+'</div>';
 }
 function materials(d){
  return '<h3>Чистый лист для ребенка</h3><p>Для рисунка нужен лист А4 без готовых иллюстраций. Инструкцию лучше произнести вслух. Внутри страницы нет ответов и критериев оценки.</p>'+
   links(d)+'<div class="psy-school-draw-paper"><span>Свободное поле для рисунка</span></div>';
 }
 function processing(d){
  return '<h3>Четыре категории сюжета</h3><div class="psy-school-draw-rubric">'+RUBRIC.map(r=>'<div><b>'+r.score+'</b><strong>'+esc(r.label)+'</strong><span>'+esc(r.example)+'</span></div>').join("")+'</div>'+
   '<p><strong>Правило:</strong> ноль ставится только при установленном несоответствии теме; отсутствие рисунка или незавершенная беседа не является нулем. Категорию после беседы выбирает психолог.</p>'+
   '<div class="notice psy-school-draw-warn">'+esc(d.warning)+'</div>'+links(d);
 }
 function summary(d,a,notes){
  const s=score(d,a),num=FIELDS.filter(([key])=>String(notes?.[key]||"").trim()).length;
  return '<div class="psy-school-draw-result"><h3>Сводка обследования</h3>'+
   (s?'<div class="psy-school-draw-score"><strong>'+s.raw+' / 30</strong><span>'+esc(s.label)+'</span></div>':
       '<p>Сюжет пока не классифицирован. Балл не выставлен — это не нулевой результат.</p>')+
   '<p>Заполнено пояснений и наблюдений: <strong>'+num+' из '+FIELDS.length+'</strong>.</p>'+
   '<div class="notice">Результат одного рисунка описателен, не дает самостоятельной клинической оценки или универсального уровня адаптации.</div></div>';
 }
 function calculator(d,ctx){
  const persons=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],p=persons[ctx.rowIndex]||persons[0],a=p.answers||[],n=p.schoolDrawingNotes||{};
  let html='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ребенок</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Класс по кодам</button></div>'+
   '<div class="notice">Посмотрите оригинал рисунка и уточните его сюжет у ребенка. Категория — выбор специалиста. Пустая классификация означает «пока нет результата», а не 0 баллов.</div>';
  if(ctx.calcMode==="class")html+='<div class="group-tools"><label>Участник<select id="participantSelect">'+persons.map((r,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?'selected':'')+'>'+(i+1)+'. '+esc(r.name||"Код "+(i+1))+'</option>').join("")+'</select></label><label>Код вместо ФИО<input id="participantName" value="'+esc(p.name||"")+'" placeholder="Код"></label><button class="btn" id="addParticipant">Добавить</button></div>';
  html+='<label class="psy-school-draw-category"><strong>Классификация сюжета после беседы</strong><select data-school-draw-category><option value="">— Не оценен / требуется уточнение —</option>'+
   RUBRIC.map(r=>'<option value="'+r.id+'" '+(a[0]===r.id?'selected':'')+'>'+r.score+' — '+esc(r.label)+'</option>').join("")+'</select></label>'+
   '<div class="psy-school-draw-notes">'+FIELDS.map(([key,label,hint])=>'<label><strong>'+esc(label)+'</strong><small>'+esc(hint)+'</small><textarea data-school-draw-note="'+key+'" rows="3" placeholder="Слова ребенка или наблюдение">'+esc(n[key]||"")+'</textarea></label>').join("")+'</div>'+
   '<div id="schoolDrawingResult">'+summary(d,a,n)+'</div><div class="psy-school-draw-actions"><button class="btn" id="resetParticipant">Очистить запись</button><button class="btn primary" id="schoolDrawingJSON">Скачать индивидуальный протокол JSON</button></div>';
  if(ctx.calcMode==="class")html+='<h3>Обработка класса</h3><p>В сводную таблицу и CSV личные пояснения ребенка не включаются.</p><div class="results-table"><table><thead><tr><th>Код</th><th>Сюжет</th><th>Баллы</th><th>Записей</th></tr></thead><tbody>'+
   persons.map((r,i)=>{const s=score(d,r.answers),notes=r.schoolDrawingNotes||{};return '<tr><td>'+esc(r.name||"Код "+(i+1))+'</td><td>'+esc(s?.label??"Не оценен")+'</td><td>'+(s?.raw??"—")+'</td><td>'+FIELDS.filter(([k])=>String(notes[k]||"").trim()).length+'</td></tr>'}).join("")+'</tbody></table></div>'+
   '<div class="psy-school-draw-actions"><button class="btn primary" id="schoolDrawingCSV">Скачать CSV класса</button></div>';
  return html;
 }
 function cell(v){let t=String(v??"");if(/^\s*[=+\-@]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"';}
 function dl(name,t,mime){const b=new Blob([t],{type:mime}),url=URL.createObjectURL(b),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);}
 function bind(d,ctx){
  const p=ctx.rows[ctx.rowIndex];p.schoolDrawingNotes||={};
  const refresh=()=>{const el=document.getElementById("schoolDrawingResult");if(el)el.innerHTML=summary(d,p.answers,p.schoolDrawingNotes);};
  document.querySelector("[data-school-draw-category]")?.addEventListener("change",function(){p.answers[0]=this.value;refresh();});
  document.querySelectorAll("[data-school-draw-note]").forEach(el=>el.addEventListener("input",()=>{p.schoolDrawingNotes[el.dataset.schoolDrawNote]=el.value;refresh();}));
  document.getElementById("schoolDrawingJSON")?.addEventListener("click",()=>dl("luskanova_school_drawing_protocol.json",JSON.stringify({method:NAME,version:"drawings, Luskanova 2001",code:p.name||"",category:p.answers?.[0]||"",result:score(d,p.answers),notes:p.schoolDrawingNotes,warning:d.warning,source:d.source},null,2),"application/json;charset=utf-8"));
  document.getElementById("schoolDrawingCSV")?.addEventListener("click",()=>{const rows=[["Код","Категория","Балл","Число текстовых записей"],...ctx.rows.map((r,i)=>{const v=score(d,r.answers),n=r.schoolDrawingNotes||{};return[r.name||"Код "+(i+1),v?.label??"",v?.raw??"",FIELDS.filter(([k])=>String(n[k]||"").trim()).length]})];dl("luskanova_school_drawing_class.csv","\uFEFF"+rows.map(r=>r.map(cell).join(";")).join("\r\n"),"text/csv;charset=utf-8");});
 }
 window.PSY_SCHOOL_DRAWING={rubric:RUBRIC.map(r=>({...r})),fields:FIELDS,score,instruction,materials,processing,calculator,bind};
})();