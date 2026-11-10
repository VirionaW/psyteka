"use strict";
(function(){
 const $=id=>document.getElementById(id),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const SLEEP="https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep";
 const MEMORY="https://beta.nih.gov/commonfund/science-highlights/exploring-dreams-memory";
 const WHO="https://www.who.int/en/news-room/fact-sheets/detail/depression";
 const DEPRESSION="https://www.nimh.nih.gov/health/publications/depression";
 const BIPOLAR="https://www.nimh.nih.gov/health/publications/bipolar-disorder";
 const BIGFIVE="https://dictionary.apa.org/big-five-personality-model";
 const PTSD="https://www.nimh.nih.gov/health/publications/post-traumatic-stress-disorder-ptsd";
 const GAD="https://www.nimh.nih.gov/health/publications/generalized-anxiety-disorder-gad";
 const dreams=[
 ["Вода","Среда и природные образы","Какая это была вода – спокойная, бурная, теплая или холодная? Что человек чувствовал рядом с ней?","Вода сама по себе не означает определенное состояние. Обсуждайте ее свойства, личный опыт и связанные события."],
 ["Дом","Пространства","Знаком ли дом человеку? Было ли в нем безопасно или тревожно?","Дом может напоминать реальное место, прошлые события или привычное пространство; фиксируйте личные ассоциации."],
 ["Комната","Пространства","Как выглядела комната, был ли выход, кто находился рядом?","Важнее ощущение приватности, защищенности или тесноты, чем универсальное «значение комнаты»."],
 ["Дверь","Пространства","Была ли дверь открыта, заперта, знакома? Что происходило перед ней?","Выясняйте реальную тему перехода, выбора или ограничения, только если она отзывается самому человеку."],
 ["Лестница","Движение","Куда вела лестница, легко ли было подниматься или спускаться?","Учитывайте усилие и эмоции; выводы о статусе или успехе нельзя делать по одному образу."],
 ["Падение","Движение","Было ли чувство опасности, потери опоры или неожиданности? Как сон закончился?","Сон может пересекаться с ощущениями тела при засыпании; он не предсказывает неудачи."],
 ["Полет","Движение","Какими были чувства – радость, страх, контроль? Где происходил полет?","Эмоциональная окраска важнее распространенных символических толкований свободы."],
 ["Погоня","Ситуации","Кто или что преследовало? Удавалось ли убежать? Есть ли похожие переживания наяву?","Обратите внимание на субъективную тревогу и повторяемость, но не приписывайте скрытую угрозу автоматически."],
 ["Опоздание","Ситуации","Куда человек опаздывал? Насколько важно это событие лично ему?","Уместно обсудить текущую нагрузку и ожидания, без утверждения о конкретном психологическом расстройстве."],
 ["Экзамен","Ситуации","Что оценивали и кто наблюдал? Какие эмоции запомнились?","Ситуации проверки могут отражать знакомые воспоминания или актуальные переживания."],
 ["Школа","Места","Реальная ли это школа, какой возраст переживался во сне?","Школа может быть следом памяти; для интерпретации нужна история человека."],
 ["Поезд","Транспорт","Куда двигался поезд, удалось ли попасть внутрь и управлять поездкой?","Не связывайте транспорт с фиксированным жизненным сценарием."],
 ["Мост","Пространства","Насколько устойчивым казался мост? Хотелось ли перейти?","Может вызывать индивидуальные ассоциации с маршрутом, риском или воспоминаниями."],
 ["Лес","Среда и природные образы","Какие звуки, свет и ощущения сопровождали пребывание в лесу?","Отмечайте, был ли лес местом отдыха, опасности, поиска или знакомым воспоминанием."],
 ["Гора","Среда и природные образы","Нужно было подниматься? Чувствовались ли высота, красота, усталость?","Усилие и пространственное восприятие могут быть предметом разговора, но не готовым выводом."],
 ["Огонь","Среда и природные образы","Огонь согревал или угрожал? Удавалось ли управлять им?","Не приписывайте образу универсальные эмоции; контекст принципиален."],
 ["Дождь","Среда и природные образы","Какая была погода, чего хотелось во время дождя?","Вспомните реальные погодные впечатления, эмоции и события."],
 ["Животное","Персонажи","Знакомое ли животное, что оно делало и как человек реагировал?","Животное может быть образом питомца, воспоминанием, фантазией; вид сам по себе не определяет смысл."],
 ["Ребенок","Персонажи","Кто это был, знаком ли ребенок, какие чувства сопровождали контакт?","Не делайте выводов о родительстве или детских переживаниях только по образу."],
 ["Незнакомец","Персонажи","Как вел себя человек, напоминал ли кого-то, какая была дистанция?","Сначала выясняйте личные впечатления, а не предполагаемую «скрытую часть личности»."],
 ["Смерть","Ситуации","Был ли сон пугающим? Связан ли он с реальной утратой или тревожной новостью?","Сновидение о смерти не является предсказанием; обсуждайте переживание без внушения угрозы."],
 ["Потеря","Ситуации","Что исчезло и почему это было важно? Удалось ли найти?","Значение потери зависит от конкретного объекта, жизненных событий и реакций."],
 ["Зубы","Тело и ощущения","Была ли боль, неприятные ощущения, воспоминания о стоматологе?","Нельзя делать вывод о заболевании или утрате по образу зубов; возможны реальные телесные впечатления."],
 ["Темнота","Среда и природные образы","Что было видно, удавалось ли ориентироваться, был ли источник света?","Одна и та же темнота может переживаться как отдых или страх; уточните контекст."],
 ["Зеркало","Предметы","Что отражалось и как человек реагировал на изображение?","Не делайте вывод о самооценке без беседы и других данных."],
 ["Телефон","Предметы","Кому хотелось позвонить? Получалось ли связаться?","Современные привычки общения и недавние ситуации нередко входят в содержание снов."],
 ["Кошмар","Типы сновидений","Повторяется ли сон, нарушает ли сон и самочувствие, есть ли связь с трудными событиями?","При частых тяжелых кошмарах и нарушении сна стоит оценивать потребность в профессиональной помощи."]
 ].map(([title,category,questions,context],i)=>({id:"dream-"+i,type:"dreams",title,category,questions,context,body:[context,"Психолог может исследовать личное значение образа, эмоции и связь с конкретным жизненным опытом. Один мотив не служит диагностическим признаком."],source:SLEEP}));
 const lectures=[
 ["Большая пятерка: пять черт личности","Личность",["Модель описывает устойчивые индивидуальные различия по пяти измерениям: открытость опыту, добросовестность, экстраверсия, доброжелательность и нейротизм (эмоциональная нестабильность). Это континуумы, а не пять взаимоисключающих типов людей.","Один и тот же человек может проявлять черты по-разному в зависимости от ситуации. В практической работе важно учитывать контекст, возраст, источник сведений и ограничения конкретного опросника.","Высокая или низкая выраженность черты сама по себе не означает психическое расстройство."],BIGFIVE],
 ["Темперамент и характер","Личность",["Темпераментом обычно называют индивидуальные особенности эмоциональной реактивности и саморегуляции. Характер описывает более широкий набор привычных способов взаимодействия, отношения к себе и другим.","Классические схемы четырех темпераментов можно обсуждать как историю психологии, но не заменять ими современные измерения индивидуальных различий. Устойчивые черты не следует объявлять пожизненными ярлыками."],BIGFIVE],
 ["Личностные черты и расстройство личности","Личность",["Выраженные особенности личности и расстройство личности – не одно и то же. Клиническая оценка рассматривает устойчивость паттернов, их влияние на функционирование и отношения, длительность и контекст.","В диагностике нельзя делать заключение по одной анкете, впечатлению или бытовому описанию. Классификация и критерии зависят от применяемой версии МКБ или другого официального руководства."],"https://icd.who.int/browse/2025-01/mms/ru"],
 ["Депрессивный эпизод","Эмоциональные расстройства",["Депрессивный эпизод включает сниженное настроение и/или утрату интереса и удовольствия в сочетании с другими симптомами. Важны длительность, выраженность и влияние на повседневное функционирование.","Возможны нарушения сна, аппетита, концентрации, чувство вины и упадок сил. У детей вместо выраженной печали может преобладать раздражительность. Отдельное повышение по опроснику не равняется клиническому диагнозу."],WHO],
 ["Варианты депрессивных расстройств","Эмоциональные расстройства",["Клинические описания различают отдельные и повторные депрессивные эпизоды. Продолжительные депрессивные симптомы могут обсуждаться в рамках стойкого депрессивного расстройства (дистимии).","Есть сезонные закономерности и депрессия в перинатальный период. Тяжесть и течение определяются специалистом на основе клинической оценки, а не только суммой баллов."],DEPRESSION],
 ["Биполярное расстройство и депрессия","Эмоциональные расстройства",["Биполярное расстройство включает эпизоды депрессии и эпизоды мании либо гипомании. Повышенная активность и уменьшенная потребность во сне в период мании существенно отличаются от кратковременного хорошего настроения.","При сборе анамнеза важно выяснять не только депрессивные, но и противоположные по полюсу эпизоды. Нельзя отождествлять биполярное расстройство с бытовыми «перепадами настроения»."],BIPOLAR],
 ["Тревога и тревожные расстройства","Эмоциональные расстройства",["Тревога может быть обычной реакцией на неопределенность и угрозу. При тревожных расстройствах интенсивность, длительность и нарушение функционирования выходят за рамки ситуативной реакции.","В обследовании учитывают избегающее поведение, телесные симптомы, характер беспокойства, источники поддержки и возраст. Данные шкал служат основанием для уточняющей беседы, а не самостоятельной постановки диагноза."],GAD],
 ["Стресс и копинг","Саморегуляция",["Стрессовая реакция связана с оценкой требований ситуации и доступных ресурсов. Способы совладания (копинг) включают действия по изменению обстоятельств и регуляции эмоциональных реакций.","Эффективность стратегии зависит от контролируемости ситуации, последствий, гибкости выбора и контекста. Ни одну стратегию нельзя оценивать как хорошую или плохую без обстоятельств."],"https://dictionary.apa.org/coping"],
 ["Психологическая травма и ПТСР","Саморегуляция",["После травматического события возможны навязчивые воспоминания, избегание напоминаний, изменения возбуждения и настроения. Не у каждого пережившего травму развивается ПТСР.","Оценка требует соблюдения безопасности, уважения к темпу человека и анализа длительности симптомов и нарушения функционирования. Не следует принуждать к подробному воспроизведению травмирующего события."],PTSD],
 ["Защитные механизмы","Личность",["Защитные механизмы – теоретические описания способов, которыми психика может снижать внутреннее напряжение и конфликт. В разных психологических школах трактовки различаются.","Не следует называть конкретную защиту по одному жесту, рисунку или сну. Предположение проверяется в контексте переживаний и взаимодействия, а не объявляется фактом."],"https://dictionary.apa.org/defense-mechanism"],
 ["Сон и сновидения","Сон",["Сон включает стадии NREM и REM. Яркие сновидения часто возникают во время REM, хотя переживания сновидений возможны и вне нее.","В исследованиях обсуждается связь сновидений с памятью и эмоциональным опытом; единого подтвержденного «словаря символов» не существует. При анализе важнее личные ассоциации, события и эмоциональный тон сна."],SLEEP],
 ["Психологическая адаптация школьника","Развитие и образование",["Адаптация включает освоение школьных требований, отношений со сверстниками и взрослыми, самоорганизацию и эмоциональное благополучие.","Филлипс и Ковач могут предоставить сведения о тревожности и депрессивных симптомах, но не измеряют школьную адаптацию целиком. В общей справке полезно сопоставлять их результаты с наблюдением, посещаемостью, учебной ситуацией и беседой."],"https://www.nimh.nih.gov/health/publications/depression"],
 ["Эмоциональная саморегуляция","Саморегуляция",["Саморегуляция включает распознавание состояния, выбор стратегии и корректировку поведения с учетом целей и обстоятельств.","При работе с детьми следует рассматривать возрастные возможности, доступность поддержки взрослого и среду; трудности не сводятся к «недостатку силы воли»."],"https://dictionary.apa.org/emotional-regulation"],
 ["Панические атаки и паническое расстройство","Эмоциональные расстройства",["Паническая атака – эпизод резкого страха или дискомфорта с телесными и когнитивными проявлениями. Отдельная паническая атака не равнозначна паническому расстройству.","При оценке важны повторяемость, ожидание новых атак, изменения поведения и исключение иных причин симптомов."],"https://www.nimh.nih.gov/health/publications/panic-disorder-when-fear-overwhelms"]
 ].map(([title,category,body,source],i)=>({id:"lecture-"+i,type:"lectures",title,category,body,source}));
 const glossary=[
 ["Анедония","Снижение или утрата способности получать удовольствие от ранее приятных занятий.","Эмоциональная сфера"],
 ["Адаптация","Процесс приспособления к новым требованиям, условиям и социальным отношениям.","Развитие"],
 ["Тревожность","Склонность переживать тревогу и ожидать возможные угрозы; отличается от конкретного эпизода тревоги.","Эмоциональная сфера"],
 ["Копинг","Когнитивные и поведенческие способы совладания со стрессовыми требованиями.","Саморегуляция"],
 ["Дистимия","Употребляемое название длительного депрессивного расстройства в определенных диагностических системах.","Эмоциональная сфера"],
 ["Гипомания","Эпизод повышения настроения или раздражительности и активности, менее тяжелый, чем мания, но имеющий клиническое значение.","Эмоциональная сфера"],
 ["Психологическая диагностика","Сбор и анализ сведений о психологических особенностях с использованием обоснованных методов и профессиональной интерпретации.","Методы"],
 ["Валидность","Степень обоснованности выводов, которые делают на основе результатов измерения.","Методы"],
 ["Надежность","Воспроизводимость и точность результатов измерения в рамках выбранной процедуры.","Методы"],
 ["Норма","Опорное распределение результатов в определенной выборке и при определенной версии методики.","Методы"],
 ["Скрининг","Первичное выявление признаков возможного риска для решения о необходимости дальнейшей оценки.","Методы"],
 ["Коморбидность","Сосуществование двух или более состояний или расстройств у одного человека.","Клинические понятия"],
 ["Черта личности","Относительно устойчивая индивидуальная особенность поведения, переживаний и способов взаимодействия.","Личность"],
 ["Эмоциональная регуляция","Процессы влияния на возникновение, интенсивность и выражение эмоциональных состояний.","Саморегуляция"],
 ["ПТСР","Посттравматическое стрессовое расстройство; состояние, связанное с определенной совокупностью симптомов после травмирующих событий.","Клинические понятия"],
 ["REM-сон","Стадия сна с быстрыми движениями глаз; часто сопровождается яркими сновидениями.","Сон"],
 ["NREM-сон","Стадии сна без быстрых движений глаз, включающие более глубокие фазы сна.","Сон"],
 ["Гипнагогические образы","Образы и переживания на границе бодрствования и засыпания.","Сон"],
 ["Ассоциации","Связи между образами, мыслями, эмоциями и воспоминаниями, которые человек описывает в личном опыте.","Методы"],
 ["Когнитивное искажение","Устойчивый или ситуативный способ интерпретации информации, который может вести к ошибочным выводам.","Саморегуляция"]
 ].map(([title,description,category],i)=>({id:"glossary-"+i,type:"glossary",title,category,body:[description],source:null}));
 const items=[...dreams,...lectures,...glossary],byId=new Map(items.map(x=>[x.id,x]));
 const selected=new Set(),favoritesKey="psy-additional-fav-v1";
 let favorites=new Set(),tab="dreams",active=null,noteId=null,identity=window.PSY_IDENTITY;
 const message=(s,error=false)=>{$("addNoteStatus").textContent=s;$("addNoteStatus").dataset.error=String(error)};
 try{favorites=new Set(JSON.parse(localStorage.getItem(favoritesKey)||"[]"))}catch(_){}
 function saveFavorites(){try{localStorage.setItem(favoritesKey,JSON.stringify([...favorites]))}catch(_){}}
 function switchTab(next){
  tab=next;
  const isDreams=tab==="dreams";
  const headline=isDreams?"Библиотека снов":tab==="lectures"?"Психологические лекции":tab==="glossary"?"Справочник психолога":"Избранное";
  const lead=isDreams?"Образы, сюжеты и детали сновидений. Поиск по библиотеке и личный протокол сна.":"Материалы о личности, депрессии, тревоге, психических расстройствах, развитии и других темах.";
  $("addMainTitle").textContent=headline;
  $("addMainLead").textContent=tab==="glossary"?"Понятия и определения для профессиональной работы.":tab==="favorites"?"Избранные материалы из библиотеки снов, лекций и справочника.":lead;
  document.title=headline+" – Метолария";document.querySelectorAll("[data-tab]").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.tab===tab)));
  $("addListTitle").textContent=({dreams:"Образы сновидений",lectures:"Психологические лекции",glossary:"Психологический справочник",favorites:"Избранные материалы"})[tab];
  $("addNotebook").hidden=tab!=="dreams";
  active=null;list();
 }
 function list(){
  const query=$("addSearch").value.trim().toLocaleLowerCase("ru-RU");
  const found=items.filter(x=>(tab==="favorites"?favorites.has(x.id):x.type===tab) &&
    (!query||[x.title,x.category,...(x.body||[]),x.questions||""].join(" ").toLocaleLowerCase("ru-RU").includes(query)));
  $("addList").replaceChildren();
  if(!found.length)$("addList").textContent="Ничего не найдено.";
  found.forEach(item=>{
   const b=document.createElement("button");b.className="add-item";b.type="button";
   b.setAttribute("aria-pressed",String(item.id===active));
   const s=document.createElement("span"),strong=document.createElement("strong"),small=document.createElement("small");
   strong.textContent=item.title;small.textContent=item.category;
   s.append(strong,small);const star=document.createElement("i");star.textContent=favorites.has(item.id)?"★":"☆";star.setAttribute("aria-hidden","true");
   b.append(s,star);b.onclick=()=>{active=item.id;article(item);list()};$("addList").append(b);
  });
 }
 function article(item){
  const place=$("addArticle");place.replaceChildren();
  const title=document.createElement("h2");title.textContent=item.title;const info=document.createElement("div");info.className="add-meta";info.textContent=item.category;
  place.append(title,info);
  (item.body||[]).forEach(str=>{const p=document.createElement("p");p.textContent=str;place.append(p)});
  if(item.type==="dreams"){
   const question=document.createElement("h3");question.textContent="Что обсудить";const p=document.createElement("p");p.textContent=item.questions;place.append(question,p);
  }
  const buttons=document.createElement("div");buttons.className="add-row";const star=document.createElement("button");star.className="add-btn";star.textContent=favorites.has(item.id)?"★ В избранном":"☆ В избранное";
  star.onclick=()=>{favorites.has(item.id)?favorites.delete(item.id):favorites.add(item.id);saveFavorites();article(item);list()};buttons.append(star);
  if(item.type==="dreams"){
   const pick=document.createElement("button");pick.className="add-btn add-primary";pick.textContent=selected.has(item.id)?"Убрать из протокола":"Добавить в протокол";
   pick.onclick=()=>{selected.has(item.id)?selected.delete(item.id):selected.add(item.id);article(item);renderPicked()};buttons.append(pick);
  }else if(item.type==="lectures"){
   const print=document.createElement("button");print.className="add-btn";print.textContent="Печать материала";print.onclick=()=>window.print();buttons.append(print);
  }
  place.append(buttons);
  if(item.source){
   const source=document.createElement("p");source.className="add-source";source.textContent="Источник и дальнейшее чтение: ";
   const a=document.createElement("a");a.href=item.source;a.textContent=new URL(item.source).hostname;a.target="_blank";a.rel="noopener noreferrer";source.append(a);place.append(source);
  }
  if(item.type==="dreams"){const note=document.createElement("p");note.className="add-hint";note.textContent="Нет универсальных значений сновидений: описание отражает вопросы для беседы, а не готовую интерпретацию личности.";place.append(note)}
 }
 function renderPicked(){
  const host=$("addSelected");host.replaceChildren();
  if(!selected.size){host.textContent="Вы пока не выбрали образы.";return}
  [...selected].forEach(id=>{const entry=byId.get(id);if(!entry)return;const btn=document.createElement("button");btn.className="add-chip";btn.type="button";btn.textContent=entry.title+" ×";btn.title="Убрать образ";btn.onclick=()=>{selected.delete(id);renderPicked();if(active)article(byId.get(active))};host.append(btn)});
 }
 function questions(){
  const root=$("addQuestions");root.replaceChildren();
  const title=document.createElement("h3");title.textContent="Вопросы для обсуждения";root.append(title);
  const general=["Какие чувства сопровождали сон и менялись ли они?","Какие образы или события запомнились больше всего?","Связывает ли сам человек сон с какими-то событиями, впечатлениями или переживаниями?"];
  [...new Set([...general,...[...selected].map(id=>byId.get(id)?.questions).filter(Boolean)])].forEach(q=>{const p=document.createElement("p");p.textContent="• "+q;root.append(p)});
  message("Вопросы составлены. Содержание сна не анализируется автоматически и никуда не отправляется.");
 }
 function noteObj(){return {title:$("addNoteTitle").value.trim().slice(0,120),narrative:$("addNoteText").value,context:$("addNoteContext").value,symbols:[...selected].map(id=>byId.get(id)?.title).filter(Boolean)}}
 function resetNote(){
  noteId=null;$("addNoteTitle").value="Описание сновидения";$("addNoteText").value="";$("addNoteContext").value="";
  selected.clear();renderPicked();$("addQuestions").replaceChildren();message("Новая запись. Предыдущие личные сохранения не изменены.");
 }
 async function readyUser(){await identity?.ready;const u=identity?.user;if(!u||u.is_anonymous||!identity?.client)throw Error("Войдите в аккаунт для личного сохранения.");return u}
 async function savedList(){
  const select=$("addSavedNotes");select.replaceChildren(new Option("Выберите запись",""));
  try{const user=await readyUser();
   const {data,error}=await identity.client.from("psy_dream_notes").select("id,title,updated_at").eq("user_id",user.id).order("updated_at",{ascending:false}).limit(100);
   if(error)throw error;(data||[]).forEach(x=>select.add(new Option(x.title+" · "+new Date(x.updated_at).toLocaleDateString("ru-RU"),x.id)));
  }catch(_){/* No personal data shown while signed out. */}
 }
 async function saveNote(){
  try{const u=await readyUser(),d=noteObj();if(!d.title||(!d.narrative.trim()&&!d.context.trim()))throw Error("Укажите название и описание или контекст сна.");
   const payload={user_id:u.id,...d,updated_at:new Date().toISOString()};if(noteId)payload.id=noteId;
   const {data,error}=await identity.client.from("psy_dream_notes").upsert(payload,{onConflict:"id"}).select("id").single();
   if(error)throw error;noteId=data.id;await savedList();$("addSavedNotes").value=noteId;message("Запись сохранена только в вашем аккаунте.");
  }catch(e){message("Не удалось сохранить: "+e.message,true)}
 }
 async function openNote(){
  const id=$("addSavedNotes").value;if(!id)return;
  try{const u=await readyUser();const {data,error}=await identity.client.from("psy_dream_notes")
   .select("id,title,narrative,context,symbols").eq("id",id).eq("user_id",u.id).single();
   if(error)throw error;noteId=id;$("addNoteTitle").value=data.title;$("addNoteText").value=data.narrative;$("addNoteContext").value=data.context;
   selected.clear();(data.symbols||[]).forEach(name=>{const match=dreams.find(x=>x.title===name);if(match)selected.add(match.id)});renderPicked();message("Запись открыта для редактирования.");
  }catch(e){message("Не удалось открыть: "+e.message,true)}
 }
 async function deleteNote(){
  const id=$("addSavedNotes").value;if(!id||!confirm("Удалить личную запись о сне? Это действие нельзя отменить."))return;
  try{const u=await readyUser();const {error}=await identity.client.from("psy_dream_notes").delete().eq("id",id).eq("user_id",u.id);
   if(error)throw error;resetNote();await savedList();message("Запись удалена.");
  }catch(e){message("Не удалось удалить: "+e.message,true)}
 }
 function exportNote(){
  const d=noteObj();const lines=["МЕТОЛАРИЯ · ПРОТОКОЛ СНОВИДЕНИЯ",d.title,"","ОБРАЗЫ:",d.symbols.join(", ")||"Не выбраны","","ОПИСАНИЕ СНА:",d.narrative,"","КОНТЕКСТ И АССОЦИАЦИИ:",d.context,"","ВОПРОСЫ ДЛЯ ОБСУЖДЕНИЯ:",...new Set([...selected].map(id=>byId.get(id)?.questions).filter(Boolean)),"","Выводы делаются только с учетом беседы и контекста."].join("\r\n");
  const blob=new Blob(["\uFEFF"+lines],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=(d.title||"Сновидение").replace(/[\\/:*?"<>|\u0000-\u001f]/g," ").slice(0,110)+".txt";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
 }
 function init(){
  document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{
   switchTab(b.dataset.tab);
   if(b.dataset.tab==="dreams"||b.dataset.tab==="lectures")
    history.pushState(history.state,"","/additional/"+b.dataset.tab);
  });
  $("addSearch").oninput=list;
  $("addCompose").onclick=questions;$("addSaveNote").onclick=saveNote;$("addExportNote").onclick=exportNote;
  $("addClearNote").onclick=()=>{if(confirm("Очистить текущую форму? Личные сохранения в кабинете останутся."))resetNote()};
  $("addOpenNote").onclick=openNote;$("addDeleteNote").onclick=deleteNote;
  const route=/^\/additional\/(dreams|lectures)\/?$/.exec(location.pathname);
  const start=route?.[1]||new URLSearchParams(location.search).get("section");
  switchTab(["dreams","lectures","glossary","favorites"].includes(start)?start:"dreams");
  article(tab==="dreams"?dreams[0]:tab==="lectures"?lectures[0]:glossary[0]);
  active=(tab==="dreams"?dreams[0]:tab==="lectures"?lectures[0]:glossary[0]).id;list();
  renderPicked();savedList();
  window.addEventListener("popstate",()=>{
   const route=/^\/additional\/(dreams|lectures)\/?$/.exec(location.pathname);
   const next=route?.[1]||new URLSearchParams(location.search).get("section")||"dreams";
   switchTab(["dreams","lectures","glossary","favorites"].includes(next)?next:"dreams");
   const entry=tab==="dreams"?dreams[0]:tab==="lectures"?lectures[0]:tab==="glossary"?glossary[0]:dreams[0];
   active=entry.id;article(entry);list();
  });
  if("serviceWorker" in navigator&&location.pathname.startsWith("/additional"))
   navigator.serviceWorker.register("/additional-sw.js",{scope:"/additional/"}).catch(()=>{});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
