"use strict";
(function(){
 const NAME="Тест школьной тревожности";
 const METHOD_NAME="Тест школьной тревожности Филлипса";
 const SOURCE="https://psmetodiki.ru/index.php/mladshie-shkolniki/prochee/253-test-shkolnoj-trevozhnosti-fillipsa";
 const SECOND="https://www.azps.ru/tests/tests_philips.html";
 const PUBLIC_58=SOURCE;
 const STUDENT_INSTRUCTION="Тебе предложат 58 вопросов о том, как ты чувствуешь себя в школе. Отвечай на каждый вопрос «Да», если согласен, или «Нет», если не согласен. Отвечай искренне, долго не раздумывай. Здесь нет правильных и неправильных ответов.";
 const YES=[11,20,22,24,25,30,35,36,38,39,41,43,44];
 const KEY=Array.from({length:58},(_,i)=>YES.includes(i+1)?"yes":"no");
 // Cited published edition (Kostina, 2006, via psmetodiki.ru): factor 1 includes 4, not 3.
 const SCALES=[
  {id:"general",name:"Общая тревожность в школе",q:[2,4,7,12,16,21,23,26,28,...Array.from({length:13},(_,i)=>i+46)]},
  {id:"social",name:"Переживание социального стресса",q:[5,10,15,20,24,30,33,36,39,42,44]},
  {id:"achievement",name:"Фрустрация потребности в достижении успеха",q:[1,3,6,11,17,19,25,29,32,35,38,41,43]},
  {id:"expression",name:"Страх самовыражения",q:[27,31,34,37,40,45]},
  {id:"testing",name:"Страх ситуации проверки знаний",q:[2,7,12,16,21,26]},
  {id:"expectations",name:"Страх несоответствия ожиданиям окружающих",q:[3,8,13,17,22]},
  {id:"physio",name:"Низкая физиологическая сопротивляемость стрессу",q:[9,14,18,23,28]},
  {id:"teachers",name:"Проблемы и страхи в отношениях с учителями",q:[2,6,11,32,35,41,44,47]}
 ];
 const NOTE="Третий фактор (фрустрация потребности в достижении успеха) рассчитан по 13 пунктам, включая вопрос № 1. В PDF Н. Ф. Гребень (2007) в перечне пропущен № 1, хотя указан итог 13; полный перечень сверён с опубликованными ключами Филлипса.";
 const WARN="Лист ответов содержит 58 номеров и варианты «Да» / «Нет». Вопросы предъявляются по проверенной публикации исходного опросника или по опубликованному администрацией правомерному экземпляру.";
 // Do not replace copyrighted source questions with fabricated short topic labels.
 /* Смысловые вопросные ориентиры для переноса ответов из подлинного бланка.
    Формулировки сокращены и не заменяют исходную редакцию опросника. */
 const TOPICS=["Сложно ли тебе учиться наравне с остальными в классе?","Волнуешься ли ты, когда учитель собирается проверить знания?","Трудно ли выполнять задания именно так, как требует учитель?","Снится ли тебе, что учитель злится из-за невыученного урока?","Бывало ли, что кто-то из одноклассников ударял тебя?","Хочется ли тебе, чтобы учитель объяснял новый материал медленнее?","Сильно ли ты волнуешься, отвечая на уроке или выполняя задание?","Боишься ли ты ошибиться, когда высказываешься в классе?","Начинают ли у тебя дрожать колени перед ответом?","Смеются ли над тобой одноклассники во время игр?","Сильно ли ты волнуешься перед началом выполнения задания?","Переживаешь ли ты, что тебя могут оставить на второй год?","Избегаешь ли игр, в которых тебя могут не выбрать?","Бывает ли, что тебя всего трясет, когда вызывают отвечать?","Кажется ли тебе, что одноклассники не хотят делать то, что хочешь ты?","Сильно ли ты волнуешься перед началом выполнения задания?","Трудно ли получать оценки, которых ожидают родители?","Боишься ли ты почувствовать себя плохо во время урока?","Опасаешься ли ты насмешек одноклассников из-за ошибки?","Чувствуешь ли ты себя похожим на остальных ребят в классе?","Беспокоишься ли ты после задания, хорошо ли его выполнил?","Уверен ли ты на уроке, что хорошо запомнил материал?","Снится ли тебе, что в школе не получается ответить учителю?","Считаешь ли ты, что одноклассники относятся к тебе дружелюбно?","Стараешься ли ты больше, если работу сравнят с работами других?","Хотелось бы тебе меньше волноваться, когда тебя спрашивают?","Боишься ли ты вступать в спор?","Учащается ли у тебя сердцебиение перед проверкой готовности к уроку?","Бывает ли, что друзья считают хорошие оценки попыткой понравиться учителю?","Комфортно ли тебе среди ребят, которых особенно уважают в классе?","Говорят ли одноклассники слова, которые тебя обижают?","Кажется ли тебе, что неуспевающих учеников перестают уважать?","Чувствуешь ли ты, что многие одноклассники тебя не замечают?","Боишься ли ты выглядеть смешно перед другими?","Доволен ли ты отношением к тебе других учеников?","Участвует ли твоя мама в школьных мероприятиях, как другие родители?","Беспокоило ли тебя мнение окружающих о тебе?","Надеешься ли ты в будущем учиться лучше, чем сейчас?","Считаешь ли ты, что одет в школу не хуже сверстников?","Думаешь ли во время ответа, что о тебе подумают другие?","Кажется ли тебе, что способным ученикам разрешено больше остальных?","Злятся ли одноклассники, когда у тебя что-то получается лучше?","Доволен ли ты тем, как к тебе относятся одноклассники?","Хорошо ли ты чувствуешь себя наедине с учителем?","Высмеивают ли другие ребята твою внешность или поведение?","Думаешь ли ты, что больше других тревожишься из-за школы?","Хочется ли тебе плакать, когда не получается ответить?","Волнуешься ли ты вечером из-за того, что ждет завтра в школе?","Забываешь ли ты знакомый материал во время трудного задания?","Дрожит ли у тебя рука, когда работаешь над заданием?","Нервничаешь ли ты, услышав, что учитель даст задание классу?","Пугает ли тебя проверка знаний в школе?","Боишься ли ты не справиться с заданием, которое объявил учитель?","Кажется ли тебе, что одноклассники умеют то, чего не умеешь ты?","Кажется ли тебе, что другие лучше понимают объяснение учителя?","Опасаешься ли ты по дороге в школу неожиданной проверочной работы?","Кажется ли тебе обычно, что ты плохо выполняешь задания?","Дрожит ли твоя рука, когда отвечаешь у доски?"];
 const LABELS=["Да","Нет"];
 const DATA={
  author:"Б. Н. Филлипс (B. N. Phillips); используемая русскоязычная публикация по Л. М. Костиной",
  age:"Младший и средний школьный возраст; ориентировочно 7-14 лет, в PDF точные границы не приведены", 
  kind:"Опросник самоотчета школьника, 58 вопросов, ответы «Да» / «Нет»",
  count:"58 вопросов; общий показатель и 8 факторов тревожности",
  goal:"Выявление тем школьного беспокойства в ситуациях учебы, оценивания, общения со сверстниками и учителями.",
  instructions:STUDENT_INSTRUCTION,
  scoring:"Сравните каждый ответ с ключом: показатель тревожности = количество ответов, НЕ совпадающих с ключом. Общий результат 0–58, проценты = несовпадения / 58 × 100. Для каждого из 8 факторов рассчитайте число несовпадений и процент от количества пунктов этого фактора. Факторы пересекаются; их суммы нельзя складывать для получения общего балла.",
  interpret:"Чем больше несовпадений с ключом, тем более выражены признаки школьного беспокойства по данной версии. В распространенной схеме >50% означает повышенное, >75% — высокое значение, однако возрастные нормы и клиническая диагностическая валидность зависят от версии. Не используйте результаты как диагноз и не делайте выводов по одному опроснику.",
  warning:WARN+" "+NOTE,
  versionNote:NOTE,questions:[],
  options:LABELS,source:SOURCE,sourceComparison:SECOND,officialBlank:SOURCE,
  guideFile:"phillips-print.html?kind=guide",
  answerFile:"phillips-print.html?kind=blank",
  calculator:true,workflow:"phillips58",
  scales:SCALES,
  sourceDescription:"Пользовательский PDF: Н. Ф. Гребень (сост.). Психологические тесты для профессионалов. Минск, 2007, с. 1-5 фрагмента. Третий фактор дополнен вопросом № 1 до 13 пунктов после сверки с опубликованными ключами Филлипса.",
  license:"Печатный лист Метоларии является самостоятельным регистрационным листом. Для предъявления 58 вопросов используется полный текст по ссылке, а не тематическая реконструкция."
 };
 const D=window.PSY_FULL_METHODS||(window.PSY_FULL_METHODS={});
 D[NAME]=DATA;
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const fmt=n=>Number(n).toFixed(1).replace(".",",");
 const level=p=>p>75?"Высокий показатель по ключу":p>50?"Повышенный показатель по ключу":"50% или меньше";
 const valid=x=>x==="yes"||x==="no";
 const val=(r,i)=>r?.answers?.[i];
 function score(d,answers){
  if(!Array.isArray(answers)||answers.length<58)return null;
  const a=Array.from({length:58},(_,i)=>answers[i]);
  if(a.some(x=>!valid(x)))return null;
  const mismatches=a.map((x,i)=>x!==KEY[i]);
  const total=mismatches.filter(Boolean).length;
  const scales=SCALES.map(s=>{
   const missed=s.q.reduce((sum,n)=>sum+(mismatches[n-1]?1:0),0);
   return {id:s.id,name:s.name,raw:missed,max:s.q.length,percent:missed/s.q.length*100,q:s.q};
  });
  return {raw:total,max:58,percent:total/58*100,scales,complete:true,mismatches,answers:a};
 }
 function count(a){return Array.from({length:58},(_,i)=>a?.[i]).filter(valid).length}
 function links(){
  return '<div class="psy-ph-links"><a class="btn primary" href="phillips-print.html" target="_blank" rel="noopener noreferrer">Посмотреть и распечатать</a></div>';
 }
 function instruction(){
  return '<h3>Инструкция для чтения ученику</h3>'+
   '<blockquote class="kid-instruction">'+esc(STUDENT_INSTRUCTION)+'</blockquote>'+
   '<h3>Порядок проведения</h3><ol>'+
   '<li>Откройте полный опросник из проверенного источника. Он содержит 58 вопросов с ответами «Да» или «Нет».</li>'+
   '<li>Предъявляйте подлинные вопросы в исходном порядке, устно или письменно.</li>'+
   '<li>Ученик отмечает ровно один вариант для каждого номера.</li>'+
   '<li>При переносе в обработку сохраняйте номера и ответы. Пропуск не равен «Нет».</li></ol>'+
   links();
 }
 function materials(){
  return '<h3>Бланк ученика</h3>'+
   '<blockquote class="kid-instruction">'+esc(STUDENT_INSTRUCTION)+'</blockquote>'+
   '<p>Бланк для регистрации ответов по 58 пунктам: в каждом пункте сначала «Да», затем «Нет». Подлинный текст вопросов предъявляется по опубликованному источнику, а не по кратким темам.</p>'+
   links();
 }
 function processing(){
  let html='<h3>Ключ и подсчет</h3><p>«Да» в ключе: <b>'+YES.join(", ")+'</b>. «Нет» в ключе: остальные пункты (1–58).</p>'+
  '<p><b>За каждое несовпадение с ключом начисляется 1 балл</b>. Общая сумма: 0–58. Процент: сумма / 58 × 100. Отдельно вычисляются восемь факторов. Одни пункты входят в несколько факторов, поэтому суммы факторов не складываются.</p>'+
  '<div class="psy-ph-scroll"><table><thead><tr><th>Фактор</th><th>Пункты</th><th>Макс.</th></tr></thead><tbody>'+
  SCALES.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.q.join(", ")+'</td><td>'+s.q.length+'</td></tr>').join("")+'</tbody></table></div>'+
  '<h3>Интерпретация</h3><p>'+esc(DATA.interpret)+'</p>'+
  '<p>Для строгой схемы «больше 50%» граница равна 30 из 58, «больше 75%» — 44 из 58. Ровно 50% не означает «больше 50%». На сайте показываются абсолютные значения и проценты, без автоматического клинического заключения.</p>'+
  '<div class="notice psy-ph-note">'+esc(NOTE)+'</div>'+
  '<p>Источники: <a target="_blank" rel="noopener noreferrer" href="'+SOURCE+'">публикация с полным ключом Ф3 ↗</a> · <a target="_blank" rel="noopener noreferrer" href="'+SECOND+'">дополнительная сверка ключа ↗</a>.</p>';
  return html;
 }
 function report(a,row){
  const n=count(a),z=row?.attendance==="absent"?null:score(DATA,a);
  let html='<section class="psy-ph-result"><div class="psy-ph-progress"><strong>Заполнено '+n+' из 58</strong><div class="psy-ph-track"><span style="width:'+(n/58*100)+'%"></span></div></div>';
  if(row?.attendance==="absent")return '<section class="psy-ph-result"><strong>Отсутствовал – результаты не рассчитываются</strong></section>';
  if(!z)return html+'<p>Для автоматического подсчета требуются ответы на все 58 вопросов. Пустые поля не засчитываются как «Нет».</p></section>';
  html+='<div class="psy-ph-overall"><span>Общий показатель: несовпадения с ключом</span><b>'+z.raw+' / 58</b><strong>'+fmt(z.percent)+'%</strong><em>'+level(z.percent)+'</em></div><h3>Восемь факторов школьной тревожности</h3><div class="psy-ph-factors">'+z.scales.map(s=>
   '<div class="psy-ph-factor"><div><span>'+esc(s.name)+'</span><b>'+s.raw+' / '+s.max+' · '+fmt(s.percent)+'%</b></div><small>'+level(s.percent)+'</small><div class="psy-ph-track"><span style="width:'+s.percent+'%"></span></div></div>').join("")+'</div>'+
   '<p class="psy-ph-small">Это показатель по опроснику, а не диагноз. Профиль оценивают в контексте беседы и наблюдений. Факторы имеют общие пункты; суммы факторов не складываются.</p></section>';
  return html;
 }
 function table(rows){
  const head=SCALES.map(scale=>'<th scope="col">'+esc(scale.name+", %")+'</th>').join("");
  const body=rows.filter(r=>r.name?.trim()||count(r.answers)).map((r,i)=>{
   const z=r.attendance==="absent"?null:score(DATA,r.answers);
   return '<tr><td class="psy-ph-number">'+(i+1)+'</td><td class="psy-ph-name">'+esc(r.name||"У-"+String(i+1).padStart(2,"0"))+'</td>'+
    SCALES.map((scale,k)=>{
     if(!z)return '<td class="psy-ph-score"></td>';
     const p=z.scales[k].percent;
     return '<td class="psy-ph-score"><span class="psy-ph-score-mark psy-ph-tone-'+(p>75?"high":p>50?"raised":"ordinary")+'">'+Math.round(p)+'</span></td>';
    }).join("")+'</tr>';
  }).join("");
  return '<div class="psy-ph-scroll psy-ph-class-results"><table><thead><tr><th scope="col">№</th><th scope="col">Участник</th>'+head+'</tr></thead><tbody>'+body+'</tbody></table></div>';
 }
 function calculator(d,ctx){
  const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0];
  const a=Array.isArray(r.answers)?r.answers:[];
  let html='<div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one">Один ученик</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class">Класс / группа</button></div>'+
   '<div class="notice psy-ph-note">Переносите ответы по полному опроснику из <a href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">этой версии</a>. Не вводите ФИО: используйте условный код.</div>';
  if(ctx.calcMode==="class"){
   html+='<div class="group-tools"><label>Ученик<select id="participantSelect">'+rows.map((x,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+esc(x.name||"У-"+(i+1))+'</option>').join("")+'</select></label><label>Код ребенка<input id="participantName" maxlength="50" value="'+esc(r.name||"")+'" placeholder="У-01"></label><button class="btn" id="addParticipant">Добавить ученика</button></div>';
  }else html+='<label class="psy-ph-code">Код ученика<input id="phSingleCode" maxlength="50" value="'+esc(r.name||"")+'" placeholder="Например, У-01"></label>';
  html+='<h3>Ответы на 58 вопросов</h3><p>Перенесите ответы из полного опросника: 1 – Да, 0 – Нет. Не используйте краткие темы вместо вопросов.</p>'+
   '<p class="psy-ph-small"><a href="'+PUBLIC_58+'" target="_blank" rel="noopener noreferrer">Открыть подлинный текст всех 58 вопросов</a>. Здесь вводятся только ответы по номерам.</p>'+
   '<div class="psy-ph-grid">'+Array.from({length:58},(_,i)=>
    '<label class="psy-ph-item"><span><b>'+String(i+1).padStart(2,"0")+'.</b> Вопрос '+(i+1)+'</span>'+
    '<input type="text" inputmode="numeric" autocomplete="off" maxlength="1" pattern="[01]" placeholder="0/1" data-ph-answer="'+i+'" aria-label="Вопрос '+(i+1)+': 1 – Да, 0 – Нет" value="'+(a[i]==="yes"?"1":a[i]==="no"?"0":"")+'"></label>').join("")+'</div>'+

   '<div id="phResults">'+report(a,r)+'</div>'+
   '<div class="psy-ph-actions"><button class="btn" id="phClear">Очистить ответы</button><button class="btn primary" id="phDownloadReport">Скачать индивидуальный протокол</button></div>';
  if(ctx.calcMode==="class")html+='<h3>Результаты класса</h3><div id="phClassResults">'+table(rows)+'</div><div class="psy-ph-actions"><button class="btn" id="phLegacyNext" hidden>Следующий ребенок</button><button class="btn primary" id="phDownloadCsv">Скачать таблицу Excel / CSV</button></div>';
  return html;
 }
 function save(filename,content,type){
  const url=URL.createObjectURL(new Blob([content],{type}));
  const a=document.createElement("a");a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }
 const csvCell=v=>{let s=String(v??"");if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 function csv(data){return "\uFEFF"+data.map(a=>a.map(csvCell).join(";")).join("\r\n")}
 function bind(d,ctx){
  const rows=ctx.rows||[],r=rows[ctx.rowIndex];if(!r)return;
  r.answers ||= [];
  const refresh=()=>{const x=document.getElementById("phResults");if(x)x.innerHTML=report(r.answers,r);
   const g=document.getElementById("phClassResults");if(g)g.innerHTML=table(rows);
  };
  document.getElementById("phSingleCode")?.addEventListener("input",e=>{r.name=e.target.value});
  document.querySelectorAll("[data-ph-answer]").forEach(el=>el.addEventListener("change",()=>{const v=el.value.trim();r.answers[Number(el.dataset.phAnswer)]=v==="1"?"yes":v==="0"?"no":"";refresh();}));
  document.getElementById("phClear")?.addEventListener("click",()=>{
   if(!confirm("Удалить все 58 ответов для выбранного ученика?"))return;
   r.answers=[];document.querySelectorAll("[data-ph-answer]").forEach(el=>el.value="");refresh();
  });
  document.getElementById("phDownloadReport")?.addEventListener("click",()=>{
   const z=r.attendance==="absent"?null:score(d,r.answers);if(!z){alert("Для протокола нужны все 58 ответов присутствующего ученика.");return}
   const body='<h1>Тест школьной тревожности Филлипса</h1><p>Обработка по ключу Филлипса: третий фактор – 13 пунктов (включая № 1)</p><p>Код ученика: '+esc(r.name||"Без персональных данных")+
   '<br>Дата формирования: '+new Date().toLocaleDateString("ru-RU")+'</p><p><b>Общий показатель:</b> '+z.raw+' из 58; '+fmt(z.percent)+'%.</p>'+
   '<table><thead><tr><th>Фактор</th><th>Несовпадений</th><th>Процент</th></tr></thead><tbody>'+
   z.scales.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.raw+' / '+s.max+'</td><td>'+fmt(s.percent)+'%</td></tr>').join("")+'</tbody></table>'+
   '<p class="small">'+esc(NOTE)+'</p><p class="small">'+esc(DATA.interpret)+'</p><p class="small">Источник: '+esc(SOURCE)+'</p>';
   save("Phillips_58_protocol.html",'<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Филлипс · протокол</title><style>@page{size:A4;margin:15mm}body{font:14px/1.55 Arial;color:#24382e;max-width:780px;margin:20px auto}h1{font-size:22px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #9cb5a5;padding:8px;text-align:left}.small{font-size:12px;color:#5f7265}</style></head><body>'+body+'</body></html>',"text/html;charset=utf-8");
  });
  document.getElementById("phDownloadCsv")?.addEventListener("click",()=>{
   const head=["№","Участник",...SCALES.map(scale=>scale.name+", %")];
   const out=[head];
   rows.filter(r=>r.name?.trim()||count(r.answers)).forEach((x,i)=>{
    const z=x.attendance==="absent"?null:score(d,x.answers);
    out.push([i+1,x.name||"У-"+String(i+1).padStart(2,"0"),...SCALES.map((s,k)=>z?Math.round(z.scales[k].percent):"")]);
   });
   save("Phillips_school_anxiety_class.csv",csv(out),"text/csv;charset=utf-8");
  });
 }
 window.PSY_PHILLIPS={score,count,instruction,materials,processing,calculator,bind,report,table,topics:TOPICS,key:KEY,scales:SCALES,studentInstruction:STUDENT_INSTRUCTION,fullQuestionnaireUrl:PUBLIC_58};
})();