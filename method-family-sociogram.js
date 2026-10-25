"use strict";
/* Семейная социограмма: рисуночная диагностическая беседа.
   Исходный стимул: круг 110 мм. Результаты — описательные, без диагностических баллов. */
(function(){
 const NAME="Семейная социограмма";
 const SRC="https://psylist.net/promet/00003-htm";
 const BOOK="https://bookap.info/othosheniy/yustitskis_psihologiya_i_psihoterapiya_semi4_e_izdanie_2009/bypage/292";
 const WARN="В публикациях встречаются атрибуции Э. Г. Эйдемиллеру и О. В. Черемисину (раннее описание) либо Э. Г. Эйдемиллеру и В. В. Юстицкису (книжные издания). Методика проективная и качественная: нет универсального диагностического балла, возрастного порога или основания устанавливать семейный конфликт по одному расположению кружков.";
 const FIELDS=[
  ["who","Кого изобразил участник","Перечень обозначенных фигур и подписей (без обязательных ФИО)"],
  ["sizes","Размеры кружков","Наблюдаемые различия величин, без готовых психологических выводов"],
  ["positions","Расположение относительно друг друга","Где изображено «Я», кто рядом, где пересечения"],
  ["distance","Расстояния и соприкосновения","Близко/далеко на рисунке; описание без диагноза"],
  ["quotes","Дословные пояснения","Как участник объяснил выбор участников и мест"],
  ["other","Особенности проведения","Колебания, изменения, уточнения, помощь"],
  ["hypotheses","Рабочие гипотезы психолога","Только для дальнейшей проверки, не итоговый диагноз"],
  ["next","Что следует уточнить","Вопросы для последующей беседы"]
 ];
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const D=window.PSY_FULL_METHODS;
 D[NAME]={
  author:"Э. Г. Эйдемиллер, О. В. Черемисин; также публикуется с В. В. Юстицкисом",
  age:"Дети, умеющие понять инструкцию и обозначить семью кружками, подростки и взрослые; возрастные нормы не заданы",
  kind:"Проективная рисуночная диагностическая беседа",
  count:"1 круг диаметром 110 мм; 4 критерия качественного анализа",
  goal:"Выявление субъективного представления о составе семьи, своем положении и психологической дистанции в семейных отношениях.",
  instructions:"Испытуемому дают лист А4 с кругом диаметром 110 мм. Предлагают изобразить себя и членов своей семьи отдельными кружочками внутри большого круга и подписать их. Затем психолог спрашивает, кто нарисован, почему участники расположены именно так, кого участник считает частью семьи. При обследовании нескольких членов семьи задание выполняется каждым независимо.",
  scoring:"Наблюдают число изображенных членов семьи, величину кружков, положение относительно друг друга и дистанции. Записывают подписи, объяснения, изменения и помощь. При наличии двух количеств можно описательно показать разницу: изображено минус названо в беседе; это не тестовый балл. Автоматический нормативный индекс не вычисляется.",
  interpret:"Любой признак рисунка — повод для уточняющего разговора, не доказательство отвержения, конфликта, неблагополучия или диагноза. Рассматривайте объяснения испытуемого, реальные обстоятельства, культурный контекст и другие методы.",
  warning:WARN,source:SRC,sourceBook:BOOK,officialBlank:SRC,
  guideFile:"downloads/family_sociogram_guide.docx",
  answerFile:"downloads/family_sociogram_student.html",
  workflow:"familySocio110",graphic:"sociogram",calculator:true,
  scaleLabels:["Число изображенных членов семьи","Размеры кружков","Взаимное расположение","Дистанция и соприкосновения","Объяснения испытуемого"],
  questions:["Кого вы изобразили?","Почему кружки именно здесь?","Все ли члены семьи обозначены?","Как вы объясняете размеры и близость фигур?"]
 };
 function circleSvg(){
  return '<svg role="img" aria-label="Пустой круг для семейной социограммы" viewBox="0 0 460 460" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="460" fill="#fff"/><circle cx="230" cy="230" r="210" fill="#fff" stroke="#234e38" stroke-width="2.5"/></svg>';
 }
 function links(d){return '<div class="psy-socio-links"><a class="btn primary" href="'+esc(d.guideFile)+'" download>Руководство Word</a><a class="btn" href="'+esc(d.answerFile)+'" target="_blank" rel="noopener noreferrer">Бланк А4 · круг 110 мм ↗</a><a class="btn" href="'+esc(d.source)+'" target="_blank" rel="noopener noreferrer">Методическое описание ↗</a></div>';}
 function instruction(d){
  return '<h3>Проведение</h3><p>'+esc(d.instructions)+'</p>'+links(d)+
   '<h3>Вопросы после рисунка</h3><ol>'+d.questions.map(q=>'<li>'+esc(q)+'</li>').join("")+'</ol>'+
   '<h3>Важно</h3><p>На чистом бланке напечатан только большой круг диаметром 110 мм и поле кода. Не добавляйте готовые образцы расположения членов семьи, чтобы не подсказывать ответ.</p>'+
   '<div class="notice psy-socio-warning">'+esc(d.warning)+'</div>';
 }
 function materials(d){
  return '<h3>Бланк для ребенка или взрослого</h3><p>Один чистый круг диаметром 110 мм на листе А4. Внешний круг обозначает пространство семьи; участник самостоятельно рисует внутренние кружки и подписи.</p>'+links(d)+
   '<div class="psy-socio-paper">'+circleSvg()+'</div><p class="psy-socio-muted">Масштаб предварительного просмотра на экране может отличаться. Точный диаметр 110 мм задан в печатном файле.</p>';
 }
 function processing(d){
  return '<h3>Критерии качественной оценки</h3><div class="psy-socio-criteria">'+
   [["Количество","Кто изображен, кто не изображен, кого участник называет членом семьи"],["Размеры","Относительная величина внутренних кружков"],["Положение","Центр, периферия, расположение относительно фигуры «Я»"],["Дистанции","Близость, касания, пересечения кружков"]].map(([k,v])=>'<div><b>'+k+'</b><span>'+v+'</span></div>').join("")+'</div>'+
   '<p>Никакой из этих признаков по отдельности не доказывает проблем в семье. Важно уточнить значение элементов рисунка у самого испытуемого и зафиксировать дословные объяснения.</p>'+
   '<div class="notice psy-socio-warning">'+esc(d.warning)+'</div>'+links(d);
 }
 const val=v=>v===""||v===null||v===undefined?null:(Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<=30?Number(v):null);
 function score(d,answers){
  const included=val(answers?.[0]),reported=val(answers?.[1]),self=String(answers?.[2]??"");
  if(included===null&&reported===null&&!["yes","no","unknown"].includes(self))return null;
  return {status:"descriptive",included,reported,self:self||null,
   difference:included!==null&&reported!==null?included-reported:null,
   caption:"Регистрация особенностей рисунка, без диагностического уровня"};
 }
 function summary(d,a,notes){
  const s=score(d,a),note=notes||{};
  const observed=FIELDS.filter(([k])=>String(note[k]||"").trim()).length;
  if(!s&&observed===0)return '<div class="psy-socio-result"><h3>Протокол</h3><p>Запишите наблюдаемые особенности и объяснение участника. Числа необязательны; рисунок обязательно сохраняют отдельно.</p></div>';
  let h='<div class="psy-socio-result"><h3>Качественный протокол</h3><div class="psy-socio-summary">'+
    '<div><span>Кружков на рисунке</span><strong>'+(s?.included??"—")+'</strong></div>'+
    '<div><span>Названо членов семьи</span><strong>'+(s?.reported??"—")+'</strong></div>'+
    '<div><span>Фигура себя</span><strong>'+({yes:"Есть",no:"Не обозначена",unknown:"Не уточнено"}[s?.self]||"—")+'</strong></div></div>';
  if(s?.difference!==null&&s?.difference!==undefined)h+='<p>Разница между количеством кружков и названных членов семьи: <strong>'+(s.difference>0?'+':'')+s.difference+'</strong>. Это только сопоставление наблюдений, не индекс семейного неблагополучия.</p>';
  h+='<p><strong>Заполнено качественных полей:</strong> '+observed+' из '+FIELDS.length+'.</p>'+
    '<div class="notice">Заключение психолог формирует после беседы и сопоставления с другими данными. По положению или размеру одного кружка диагноз не устанавливается.</div></div>';
  return h;
 }
 function calculator(d,ctx){
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],a=r.answers||[],notes=r.socioNotes||{};
  let html='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один участник</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Несколько участников</button></div>'+
    '<div class="notice">Это качественная проективная методика. Введите только наблюдаемые факты и дословные слова участника. Не делайте вывод о конфликте из одного признака. Избегайте ФИО ребенка и членов его семьи.</div>';
  if(ctx.calcMode==="class")html+='<div class="group-tools"><label>Код участника<select id="participantSelect">'+rows.map((p,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+(i+1)+'. '+esc(p.name||"Код "+(i+1))+'</option>').join("")+'</select></label><label>Код вместо имени<input id="participantName" value="'+esc(r.name||"")+'" placeholder="Код"></label><button class="btn" id="addParticipant">Добавить</button></div>';
  html+='<div class="psy-socio-quant">'+
   '<label>Кружков изображено<input data-socio-number="0" type="number" min="0" max="30" step="1" value="'+esc(a[0]??"")+'" placeholder="Если известно"></label>'+
   '<label>Членов семьи названо<input data-socio-number="1" type="number" min="0" max="30" step="1" value="'+esc(a[1]??"")+'" placeholder="Если известно"></label>'+
   '<label>Изображена собственная фигура<select data-socio-self><option value="">— Не уточнено —</option>'+
   [["yes","Да"],["no","Нет"],["unknown","Неоднозначно"]].map(([v,t])=>'<option value="'+v+'" '+(a[2]===v?"selected":"")+'>'+t+'</option>').join("")+'</select></label></div>';
  html+='<div class="psy-socio-notes">'+FIELDS.map(([key,title,hint])=>'<label><strong>'+esc(title)+'</strong><small>'+esc(hint)+'</small><textarea rows="3" data-socio-note="'+esc(key)+'" placeholder="Запишите наблюдение или пояснение">'+esc(notes[key]||"")+'</textarea></label>').join("")+'</div>';
  html+='<div id="socioResult">'+summary(d,a,notes)+'</div><div class="psy-socio-actions"><button class="btn" id="resetParticipant">Очистить запись</button><button class="btn primary" id="socioJSON">Скачать индивидуальный протокол JSON</button></div>';
  if(ctx.calcMode==="class")html+='<h3>Сводка по кодам</h3><p>В CSV выводятся только количественные описательные поля — без чувствительных записей беседы.</p><div class="results-table"><table><thead><tr><th>Код</th><th>Кружков</th><th>Названо</th><th>Фигура «Я»</th><th>Записей</th></tr></thead><tbody>'+rows.map((person,i)=>{const sc=score(d,person.answers),nt=person.socioNotes||{};return '<tr><td>'+esc(person.name||"Код "+(i+1))+'</td><td>'+(sc?.included??"—")+'</td><td>'+(sc?.reported??"—")+'</td><td>'+esc(sc?.self||"—")+'</td><td>'+FIELDS.filter(([k])=>String(nt[k]||"").trim()).length+'</td></tr>'}).join("")+'</tbody></table></div><div class="psy-socio-actions"><button class="btn primary" id="socioCSV">Скачать сводку группы CSV</button></div>';
  return html;
 }
 function csv(v){let s=String(v??"");if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
 function save(name,content,mime){const blob=new Blob([content],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);}
 function bind(d,ctx){
  const r=ctx.rows[ctx.rowIndex];r.socioNotes||={};
  const refresh=()=>{const output=document.getElementById("socioResult");if(output)output.innerHTML=summary(d,r.answers,r.socioNotes);};
  document.querySelectorAll("[data-socio-number]").forEach(el=>el.addEventListener("input",()=>{r.answers[Number(el.dataset.socioNumber)]=el.value===""?"":Number(el.value);refresh();}));
  document.querySelector("[data-socio-self]")?.addEventListener("change",function(){r.answers[2]=this.value;refresh();});
  document.querySelectorAll("[data-socio-note]").forEach(el=>el.addEventListener("input",()=>{r.socioNotes[el.dataset.socioNote]=el.value;refresh();}));
  document.getElementById("socioJSON")?.addEventListener("click",()=>save("family_sociogram_protocol.json",JSON.stringify({method:NAME,version:"A4 Ø110 mm / descriptive",code:r.name||"",counts:r.answers||[],observations:r.socioNotes||{},summary:score(d,r.answers),warning:d.warning},null,2),"application/json;charset=utf-8"));
  document.getElementById("socioCSV")?.addEventListener("click",()=>{const table=[["Код","Кружков","Названо членов семьи","Фигура себя","Качественных записей"],...ctx.rows.map((person,i)=>{const z=score(d,person.answers),notes=person.socioNotes||{};return [person.name||"Код "+(i+1),z?.included??"",z?.reported??"",z?.self??"",FIELDS.filter(([k])=>String(notes[k]||"").trim()).length];})];save("family_sociogram_group.csv","\uFEFF"+table.map(x=>x.map(csv).join(";")).join("\r\n"),"text/csv;charset=utf-8");});
 }
 window.PSY_FAMILY_SOCIO={score,circleSvg,fields:FIELDS,summary,instruction,materials,processing,calculator,bind};
})();