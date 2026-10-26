"use strict";
(function(){
const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const config=[
 {id:"teique-asf-penkina-2023",name:"TEIQue-ASF – эмоциональный интеллект подростков",author:"К. В. Петридес, А. Фернхем; адаптация Е. Н. Пенкиной, О. А. Шамшиковой (2023)",age:"13-17 лет",kind:"Опросник эмоционального интеллекта",count:"30 утверждений",goal:"Оценка эмоционального интеллекта как личностной черты у подростков.",source:"https://doi.org/10.21603/sibscript-2023-25-2-169-182",forms:[{label:"TEIQue-ASF, русская подростковая версия, 13-17 лет",url:"https://psytests.org/eq/teiquea.html"}],instructions:"Выберите один вариант ответа на каждое утверждение по авторской инструкции опубликованной русской формы. Не подсказывайте и не оценивайте ответы.",procedure:"Используйте русскую подростковую форму именно Пенкиной и Шамшиковой; взрослая TEIQue-SF не является заменой. Организуйте индивидуальное заполнение и проверьте полноту ответов.",scoring:"У краткой формы основной интерпретируемый показатель – общий уровень эмоционального интеллекта как черты. Без сверенного списка обратных пунктов, авторского кодирования и норм вычисление не выполняется.",interpret:"Опросник описывает личностные самооценки, а не способность правильно решать эмоциональные задачи. Данные нельзя подменять результатами взрослой версии. Интерпретировать по руководству именно выбранной русской формы.",indicators:["Общий показатель эмоционального интеллекта как черты"],questionsCount:30},
 {id:"urs-odintsova-2024",name:"Шкала реагирования на неопределенность (URS)",author:"М. А. Одинцова, Н. П. Радчикова, М. Г. Сорокова (2024)",age:"12-18 лет",kind:"Самоотчетный опросник",count:"25 утверждений · 3 шкалы",goal:"Определение эмоциональной и когнитивной реакции подростков на неопределенность и готовности к переменам.",source:"https://psyjournals.ru/journals/cpse/archive/2024_n2/Odintsova_Radchikova_Sorokova",forms:[{label:"Российская адаптация, подростки 12-18 лет",url:"https://psyjournals.ru/journals/cpse/archive/2024_n2/Odintsova_Radchikova_Sorokova"}],instructions:"Пожалуйста, выбери тот вариант ответа, который больше всего подходит для тебя, когда ты сталкиваешься с ситуацией неопределенности.",procedure:"Используйте 25 утверждений из приложения 1 к статье. Подросток отмечает один ответ по пятибалльной шкале: никогда – 1, редко – 2, иногда – 3, часто – 4, всегда – 5. Не включайте предварительную анкету о стрессовой ситуации в общую шкалу URS.",scoring:"Сложите ответы 1-11 для эмоциональной реакции, 12-17 для когнитивной реакции, 18-25 для готовности к переменам. Обратных пунктов в опубликованном ключе нет. Диапазоны сумм: 11-55; 6-30; 8-40. Пустые значения не равны нулю.",interpret:"Высокий балл по каждой шкале означает большую выраженность именно названного способа реагирования. Суммы трех шкал не образуют отдельную опубликованную норму. По одному результату диагноз не ставится, универсальные клинические пороги не заданы.",indicators:["Эмоциональная реакция на неопределенность","Когнитивная реакция на неопределенность","Готовность к переменам и неопределенности"],questionsCount:25,scaleMin:1,scaleMax:5,scales:[{title:"Эмоциональная реакция на неопределенность",indices:[1,2,3,4,5,6,7,8,9,10,11]},{title:"Когнитивная реакция на неопределенность",indices:[12,13,14,15,16,17]},{title:"Готовность к переменам и неопределенности",indices:[18,19,20,21,22,23,24,25]}]},
 {id:"professional-attitudes-2025",name:"Профессиональные установки подростков – модификация 2025",author:"А. Д. Андреева, А. Г. Лисичкина, Л. А. Бегунова (2025); основа И. М. Кондакова",age:"16-22 года · старшеклассники и студенты СПО в апробации",kind:"Опросник профессионального самоопределения",count:"24 утверждения · 2 шкалы",goal:"Оценка уверенности в профессиональном будущем и нерешительности при выборе профессии.",source:"https://psyjournals.ru/journals/psyedu/archive/2025_n1/Andreeva_Lisichkina_Begunova",forms:[{label:"Модификация 2025 года, 24 пункта",url:"https://psyjournals.ru/journals/psyedu/archive/2025_n1/Andreeva_Lisichkina_Begunova"}],instructions:"Прочитай внимательно каждое предложение и выбери одну из шести цифр справа в зависимости от того, насколько оно соответствует твоим мыслям и чувствам. Цифра 1 означает полное несогласие, цифра 6 – полное согласие. Здесь нет правильных и неправильных ответов.",procedure:"Предъявляйте полный бланк из приложения к публикации 2025 года. Ученик выбирает одну цифру от 1 до 6 для каждого из 24 пунктов. Не используйте ключ оригинальной методики Кондакова 1989 года для модификации 2025 года.",scoring:"Суммируйте ответы на пункты 2,3,5,6,8,9,10,13,14,16,18,19,20,21,23,24 по шкале уверенности; на 1,4,7,11,12,15,17,22 – по шкале нерешительности. Публикация указывает прямое суммирование баллов от 1 до 6, без обратного пересчета. Уверенность: 53 и меньше – низкий показатель, 54-66 – средний, 67 и выше – высокий. Нерешительность: 12 и меньше – низкий, 13-19 – средний, 20 и выше – высокий.",interpret:"Два независимых показателя помогают обсуждать психологическую готовность к профессиональному выбору. Нормативные границы взяты из приложения статьи 2025 года и относятся к данной редакции. Не используйте баллы в качестве диагноза или единственного основания профориентационного решения.",indicators:["Уверенность в будущем выборе","Нерешительность в выборе профессии"],questionsCount:24,scaleMin:1,scaleMax:6,scales:[{title:"Уверенность в будущем выборе",indices:[2,3,5,6,8,9,10,13,14,16,18,19,20,21,23,24],bands:[53,66]},{title:"Нерешительность в выборе профессии",indices:[1,4,7,11,12,15,17,22],bands:[12,19]}]},
 {id:"orel-kulikova-sel-2018",name:"Оценка социально-эмоциональных навыков в начальной школе – Орел, Куликова",author:"Е. А. Орел, А. А. Куликова (2018)",age:"3 класс · апробация на младших школьниках",kind:"Мониторинговый опросник",count:"27 утверждений · 3 шкалы",goal:"Мониторинг навыков достижения целей, работы с другими и управления эмоциями у младших школьников.",source:"https://psyjournals.ru/journals/jmfp/archive/2018_n3/Orel_Kulkova",forms:[{label:"Авторский опросник для начальной школы (2018)",url:"https://psytests.org/school/osenn.html"}],instructions:"Оцени, насколько ты согласен с каждым утверждением, выбирая один из пяти вариантов ответа. Нет правильных или неправильных ответов.",procedure:"Предъявляйте полные 27 утверждений опубликованной формы. По данным валидизационной статьи обследовались ученики третьих классов, поэтому возраст указан как проверенная школьная группа, а не произвольный диапазон.",scoring:"Опубликованы три шкалы: достижение целей (8 пунктов, 1 обратный), работа с другими (11 пунктов, 2 обратных), управление эмоциями (8 пунктов, 1 обратный). Пока не сверено соответствие конкретного бланка полному порядку 27 пунктов и четырем обратным пунктам, баллы не рассчитываются.",interpret:"Результаты предназначены прежде всего для мониторинга развития навыков и групповой обратной связи. Нельзя смешивать с авторской рабочей формой Психотеки из 20 утверждений или с версией для основной школы из 76 пунктов.",indicators:["Достижение целей","Работа с другими","Управление эмоциями"],questionsCount:27},
 {id:"morosanova-ssp-family",name:"Стиль саморегуляции поведения – В. И. Моросанова",author:"В. И. Моросанова; ССПМ-2020 – В. И. Моросанова, Н. Г. Кондратюк",age:"С 14 лет для классической формы; версия 2020 – изучалась на выборках от 16 лет",kind:"Многошкальный опросник",count:"Возрастные и авторские редакции",goal:"Оценка осознанной саморегуляции и индивидуального профиля ее регуляторных процессов.",source:"https://psytests.org/emvol/sspm.html",forms:[{label:"ССПМ (1998/2004), от 14 лет",url:"https://psytests.org/emvol/sspm.html"},{label:"ССПМ-2011",url:"https://psytests.org/emvol/sspm11.html"},{label:"ССПМ-2013, экспресс-форма",url:"https://psytests.org/emvol/sspm13.html"},{label:"ССПМ-2020, переработанная форма",url:"https://psytests.org/emvol/sspm20.html"}],instructions:"Прочитайте инструкцию конкретного выбранного авторского бланка и последовательно отметьте подходящие ответы. Не смешивайте редакции опросника.",procedure:"До проведения выберите одну редакцию. Полные и короткие версии различаются числом утверждений, типом ответа и ключами. Данные вносятся только в бланк выбранной формы.",scoring:"Алгоритмы ССПМ, ССПМ-2011, ССПМ-2013 и ССПМ-2020 различаются. Для корректной обработки необходим полный проверенный ключ именно выбранной редакции; взаимозаменяемого общего ключа нет.",interpret:"Профиль описывает процессы планирования, моделирования, программирования, оценки результатов и регуляторно-личностные свойства в зависимости от редакции. Числовое сравнение разных форм недопустимо.",indicators:["Планирование","Моделирование","Программирование","Оценивание результатов","Регуляторно-личностные свойства"]},
 {id:"lukyanova-kalinina-motivation-2004",name:"Изучение мотивации обучения – М. И. Лукьянова, Н. В. Калинина",author:"М. И. Лукьянова, Н. В. Калинина (2004)",age:"1, 4-5, 7, 9, 11 классы · отдельные формы",kind:"Возрастные опросники учебной мотивации",count:"5 возрастных анкет",goal:"Изучение учебных мотивов, целеполагания и отношения к обучению с учетом возрастного этапа.",source:"https://psytests.org/emvol/mimo11.html",forms:[{label:"1 класс",url:"https://psytests.org/emvol/mimo1.html"},{label:"Переход 4-5 класс",url:"https://psytests.org/emvol/mimo5.html"},{label:"7 класс",url:"https://psytests.org/emvol/mimo7.html"},{label:"9 класс",url:"https://psytests.org/emvol/mimo9.html"},{label:"11 класс",url:"https://psytests.org/emvol/mimo11.html"}],instructions:"Внимательно прочитай неоконченные предложения и варианты к ним. Отмечай ответы строго по инструкции выбранной возрастной анкеты.",procedure:"Для 1-го класса, перехода из 4-го в 5-й, 7-го, 9-го и 11-го классов предусмотрены разные анкеты. Выберите возрастную форму до предъявления. Не используйте вопросы старших классов для младших школьников.",scoring:"Структура и обработка отличаются между возрастными формами. Для 7-го класса и старше описаны личностный смысл обучения, целеполагание, типы и реализация учебных мотивов. До сверки полных ключей каждой версии автоматическую сумму не выводить.",interpret:"Интерпретируйте мотивацию в возрастном и образовательном контексте, не сопоставляя напрямую суммы от разных анкет. Опросник Лукьяновой и Калининой не равен анкете школьной мотивации Н. Г. Лускановой.",indicators:["Личностный смысл обучения","Целеполагание","Мотивы обучения","Реализация мотивов в поведении"]}
];
const teique=config.find(x=>x.id==="teique-asf-penkina-2023");teique.responseMax=7;teique.responseMin=1;teique.responseCount=30;teique.answerLabels=["Категорически не согласен","Не согласен","Скорее не согласен","Не уверен","Скорее согласен","Согласен","Полностью согласен"];teique.instructions="Пожалуйста, ответьте, выбрав тот ответ, который лучше всего показывает, насколько вы согласны или не согласны с каждым предложением ниже. Работайте быстро, но внимательно. Нет правильных или неправильных ответов.";teique.scoring="Для TEIQue-ASF ответы от 1 до 7. Обратные пункты и нормы должны соответствовать подростковой русской версии Пенкиной и Шамшиковой, а не взрослой TEIQue-SF. До сверки полного ключа автоматические тестовые баллы не выводятся.";
const orel=config.find(x=>x.id==="orel-kulikova-sel-2018");orel.responseMax=5;orel.responseMin=1;orel.responseCount=27;orel.answerLabels=["Совершенно не согласен","Не согласен","Затрудняюсь ответить","Согласен","Совершенно согласен"];orel.age="3 класс · средний возраст участников исследования 9 лет";orel.scoring="В исследовании три шкалы: 8 пунктов достижения цели (1 обратный), 11 пунктов работы с другими (2 обратных), 8 пунктов управления эмоциями (1 обратный). В статье нет полной номерной таблицы соответствия 27 утверждений шкалам. Поэтому надежный количественный подсчет без отдельного опубликованного ключа невозможен.";
const urs=config.find(x=>x.id==="urs-odintsova-2024");urs.answerLabels=["Никогда","Редко","Иногда","Часто","Всегда"];
const prof=config.find(x=>x.id==="professional-attitudes-2025");prof.answerLabels=["Совершенно не соответствует","Скорее не соответствует","Не вполне соответствует","Отчасти соответствует","В большей степени соответствует","Полностью соответствует"];prof.instructions="Прочти внимательно каждое предложение и обведи кружком одну из шести цифр справа, насколько оно соответствует твоим мыслям и чувствам. Цифра 1 означает, что утверждение совершенно тебе не соответствует, цифра 6 – что оно соответствует тебе в полной мере. Нет правильных или неправильных ответов.";
const moros=config.find(x=>x.id==="morosanova-ssp-family");moros.forms[3].label="ССПМ-2020 · 28 пунктов, 7 шкал, ответы 1-5";moros.age="Классическая ССПМ – от 14 лет; у остальных редакций собственные возрастные ограничения";
moros.ssp2020Scales=[
 {title:"Планирование целей",indices:[-1,8,-15,22]},
 {title:"Моделирование значимых условий",indices:[-4,10,-18,-24]},
 {title:"Программирование действий",indices:[2,-11,16,26]},
 {title:"Оценивание результатов",indices:[3,9,-17,-23]},
 {title:"Гибкость",indices:[5,12,19,25]},
 {title:"Надежность",indices:[-6,-13,-20,-27]},
 {title:"Настойчивость",indices:[7,14,21,28]}
];
moros.scoring="Только для ССПМ-2020: 28 ответов по 5-балльной шкале, семь показателей по четыре пункта. Обратные пункты: 1, 4, 6, 11, 13, 15, 17, 18, 20, 23, 24, 27. Для них балл = 6 минус выбранный ответ. Общий уровень саморегуляции = сумма всех семи шкал. Нормативные пороги здесь не назначаются. Остальные редакции 1998/2004, 2011 и 2013 рассчитываются только по своим авторским ключам.";
moros.interpret="По ССПМ-2020 показываются сырые результаты по семи шкалам (4-20 баллов) и общий показатель (28-140 баллов), без вымышленных порогов низкого или высокого уровня. Для других редакций онлайн-расчет недоступен.";
const luk=config.find(x=>x.id==="lukyanova-kalinina-motivation-2004");luk.instructions="Внимательно прочитай начало каждого предложения и предложенные варианты. Выбери столько ответов, сколько требует инструкция именно твоей возрастной анкеты. В некоторых версиях нужно выбрать два варианта.";
const D=window.PSY_FULL_METHODS||(window.PSY_FULL_METHODS={});
config.forEach(p=>{const c={...p,workflow:"verifiedSix",calculator:true,questions:Array.from({length:p.questionsCount||0},(_,i)=>"Пункт "+(i+1)),options:Array.from({length:p.scaleMax||0},(_,i)=>String(i+1)),verifiedCopyright:"Тексты оригинальных утверждений доступны в публикациях. Психотека не перепечатывает защищенный бланк в регистрационной форме."};D[p.name]=c;});
const a=(url,label)=>'<a href="'+escape(url)+'" target="_blank" rel="noopener noreferrer">'+escape(label)+'</a>';
function variants(d){return '<div class="psy-six-versions"><h3>Версии и оригинальные материалы</h3><ul>'+d.forms.map(f=>'<li>'+a(f.url,f.label)+'</li>').join("")+'</ul></div>';}
function instruction(d){return '<section class="psy-six-guide"><h3>Цель</h3><p>'+escape(d.goal)+'</p><h3>Инструкция обследуемому</h3><blockquote class="kid-instruction">'+escape(d.instructions)+'</blockquote><h3>Порядок проведения для психолога</h3><p>'+escape(d.procedure)+'</p><h3>Ключ и обработка</h3><p>'+escape(d.scoring)+'</p><h3>Интерпретация и ограничения</h3><p>'+escape(d.interpret)+'</p>'+variants(d)+'<p class="privacy-inline">Полный оригинальный опросник предъявляется по опубликованному источнику, регистрационный лист не заменяет текст утверждений.</p></section>';}
function materials(d){
 const count=d.questionsCount||0, min=d.scaleMin||d.responseMin||1,max=d.scaleMax||d.responseMax||0;
 const hasSheet=Boolean(count&&max);
 const half=Math.ceil(count/2);
 const legend=hasSheet?'<p class="psy-six-scale-legend">'+Array.from({length:max},(_,i)=>'<span><strong>'+(i+1)+'</strong> '+escape(d.answerLabels?.[i]||"Вариант "+(i+1))+'</span>').join(" · ")+'</p>':"";
 const grid=hasSheet?'<div class="psy-six-sheet"><h3>Лист регистрации ответов · А4</h3><p>Код участника: __________________　Дата: _______________</p><p>Перенос ответов выполняйте из оригинального бланка без изменения номера пункта. Этот регистрационный лист не заменяет текст методики.</p>'+legend+
 '<table class="questions-table"><thead><tr><th>№</th><th>Ответ ('+min+'-'+max+')</th><th>№</th><th>Ответ ('+min+'-'+max+')</th></tr></thead><tbody>'+Array.from({length:half},(_,i)=>'<tr><td>'+(i+1)+'</td><td class="blank-cell"></td><td>'+(i+half<count?i+half+1:"")+'</td><td class="blank-cell"></td></tr>').join("")+'</tbody></table></div>':
 '<p>Для выполнения используйте исходный бланк конкретной возрастной или авторской версии. Печатный лист другой редакции не заменяет оригинал.</p>';
 return '<section class="psy-six-materials"><p>Оригинальный источник: '+a(d.forms[0].url,"Открыть опубликованную форму")+'</p>'+grid+variants(d)+'</section>';
}
function results(d,answers,version){
 if(d.id==="morosanova-ssp-family"){
  if(String(version)!=="3"||!Array.isArray(answers))return null;
  const a=Array.from({length:28},(_,i)=>answers[i]);
  if(a.some(v=>v==null||v===""||!Number.isInteger(Number(v))||Number(v)<1||Number(v)>5))return null;
  const scales=d.ssp2020Scales.map(sc=>{
   const raw=sc.indices.reduce((sum,key)=>{
    const value=Number(a[Math.abs(key)-1]);return sum+(key<0?6-value:value);
   },0);
   return {title:sc.title,raw,min:4,max:20,band:null};
  });
  return [...scales,{title:"Общий уровень саморегуляции",raw:scales.reduce((acc,x)=>acc+x.raw,0),min:28,max:140,band:null}];
 }
 if(!d.scaleMax||!Array.isArray(answers))return null;
 const a=Array.from({length:d.questionsCount},(_,i)=>answers[i]);
 if(a.some(v=>v==null||v===""||!Number.isInteger(Number(v))||Number(v)<d.scaleMin||Number(v)>d.scaleMax))return null;
 return d.scales.map(sc=>{
  const raw=sc.indices.reduce((sum,key)=>sum+Number(a[key-1]),0);
  return {title:sc.title,raw,min:sc.indices.length*d.scaleMin,max:sc.indices.length*d.scaleMax,band:sc.bands?(raw<=sc.bands[0]?"Низкий":raw<=sc.bands[1]?"Средний":"Высокий"):null};
 });
}
function score(d,answers,version){
 const scales=results(d,answers,version);
 return scales?{raw:scales.map(x=>x.raw).join(" / "),max:"По шкалам",caption:scales.map(x=>x.title+": "+x.raw).join("; "),scales}:null;
}
function status(r,d){return !!results(d,r.answers,r.sixVersion);}
function summary(d,r){const res=results(d,r.answers,r.sixVersion);if(!d.scaleMax&&!(d.id==="morosanova-ssp-family"&&String(r.sixVersion)==="3"))return '<p>Регистрируйте наблюдения без расчета тестовых баллов. Официальный подсчет производится по опубликованному руководству выбранной редакции.</p>';return res?'<div class="psy-six-results">'+res.map(x=>'<div><strong>'+escape(x.title)+'</strong><span>'+x.raw+' ('+x.min+'-'+x.max+')'+(x.band?' · '+x.band:'')+'</span></div>').join("")+'</div>':'<p>До заполнения всех '+(d.id==="morosanova-ssp-family"?28:d.questionsCount)+' ответов итог не рассчитывается.</p>';}
function table(d,rows){return '<h3>Сводная таблица группы</h3><div class="results-table"><table><thead><tr><th>Код</th><th>Полнота</th><th>Результат</th></tr></thead><tbody>'+rows.map((r,i)=>{const res=results(d,r.answers,r.sixVersion);return '<tr><td>'+escape(r.name||"Участник "+(i+1))+'</td><td>'+(status(r,d)?"Заполнено":"Нет полного результата")+'</td><td>'+escape(res?res.map(x=>x.raw).join(" / "):"–")+'</td></tr>'}).join("")+'</tbody></table></div>';}
function calculator(d,ctx){
 const rows=ctx.rows?.length?ctx.rows:[{name:"",answers:[]}],r=rows[ctx.rowIndex]||rows[0],done=status(r,d);
 let html='<section class="psy-six-calc" data-six-id="'+escape(d.id)+'"><div class="calc-mode"><button class="btn '+(ctx.calcMode==="one"?"primary":"")+'" data-cmode="one" type="button">Один участник</button><button class="btn '+(ctx.calcMode==="class"?"primary":"")+'" data-cmode="class" type="button">Группа / класс</button></div>';
 if(ctx.calcMode==="class")html+='<div class="group-tools"><label>Участник <select id="participantSelect">'+rows.map((x,i)=>'<option value="'+i+'" '+(i===ctx.rowIndex?"selected":"")+'>'+escape((i+1)+". "+(x.name||"Участник"))+'</option>').join("")+'</select></label><button class="btn" type="button" id="addParticipant">Добавить участника</button></div>';
 html+='<label class="psy-six-label">Код участника (без ФИО)<input id="participantName" type="text" maxlength="50" value="'+escape(r.name||"")+'" placeholder="Например, 7А-01"></label>';
 if(d.forms.length>1){
  const sel=r.sixVersion??"";
  html+='<label class="psy-six-label">Авторская или возрастная редакция<select data-six-version aria-label="Редакция опросника"><option value="">Выберите редакцию</option>'+d.forms.map((f,i)=>'<option value="'+i+'" '+(String(sel)===String(i)?"selected":"")+'>'+escape(f.label)+'</option>').join("")+'</select></label><p id="sixVersionLink">'+(sel!==""&&d.forms[Number(sel)]?a(d.forms[Number(sel)].url,"Открыть оригинальный бланк выбранной редакции"):"Выберите нужную редакцию до проведения.")+'</p>';
 }else html+='<p>Источник ответов: '+a(d.forms[0].url,"Оригинальный бланк методики")+'</p>';
 const qCount=d.questionsCount||0,ansMax=d.scaleMax||d.responseMax||0;
 if(qCount&&ansMax){
   html+='<p class="privacy-inline">Внесите ответы строго по номерам из оригинальной формы. Незаполненное поле не считается нулевым ответом.</p><div class="psy-six-answer-grid">'+Array.from({length:qCount},(_,i)=>{
    const scored=!!d.scaleMax,values=scored?r.answers:r.sixAnswers;
    const v=values?.[i];
    return '<label><span>Пункт '+(i+1)+'</span><select '+(scored?'data-six-answer':'data-six-unverified')+'="'+i+'" aria-label="Ответ на пункт '+(i+1)+'"><option value="">–</option>'+Array.from({length:ansMax},(_,n)=>'<option value="'+(n+1)+'" '+(String(v??"")===String(n+1)?"selected":"")+'>'+(n+1)+'</option>').join("")+'</select></label>';
   }).join("")+'</div>';
 }
 if(!d.scaleMax)html+='<p class="privacy-inline">Ответы можно зарегистрировать, но тестовый балл здесь не рассчитывается до проверки авторского ключа. Никаких условных уровней не выводится.</p>';
 html+='<label class="psy-six-label">Наблюдения специалиста<textarea rows="4" data-six-notes placeholder="Особенности проведения, реакции, пояснения">'+escape(r.sixProtocol||"")+'</textarea></label>';
 html+='<div class="psy-six-state '+(d.scaleMax?(done?"ready":"pending"):"neutral")+'" id="sixStatus">'+(d.scaleMax?(done?"Результат рассчитан":"Требуется заполнение"):"Протокол наблюдения")+'</div><div id="sixSummary">'+summary(d,r)+'</div>';
 html+='<div class="actions"><button type="button" class="btn primary" data-six-report '+(d.scaleMax&&!done?'disabled title="Заполните все обязательные ответы"':'')+'>Скачать протокол · А4</button><button type="button" class="btn" data-six-clear>Очистить ответы</button></div>';
 if(ctx.calcMode==="class")html+='<div id="sixClass">'+table(d,rows)+'</div><button type="button" class="btn" data-six-csv>Экспорт класса · CSV</button>';
 return html+'</section>';
}
function save(filename,contents,mime){const url=URL.createObjectURL(new Blob([contents],{type:mime})),node=document.createElement("a");node.href=url;node.download=filename;document.body.appendChild(node);node.click();node.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function printable(d,r){
 const res=results(d,r.answers,r.sixVersion),selected=d.forms[Number(r.sixVersion)]||d.forms[0];
 const rows=res?res.map(x=>'<tr><td>'+escape(x.title)+'</td><td>'+x.raw+'</td><td>'+(x.band?escape(x.band):"Без нормативной категории")+'</td></tr>').join(""):"";
 const score=res?'<h2>Обработка</h2><table><thead><tr><th>Шкала</th><th>Баллы</th><th>Уровень</th></tr></thead><tbody>'+rows+'</tbody></table>':'<h2>Обработка</h2><p>Количественный результат не вычислялся по данной редакции.</p>';
 const list=d.responseCount?'<h2>Зарегистрированные ответы</h2><p>'+Array.from({length:d.responseCount},(_,i)=>(i+1)+": "+(r.sixAnswers?.[i]||"–")).map(escape).join(" · ")+'</p>':"";
 const body='<h1>'+escape(d.name)+'</h1><p>'+escape(d.author)+'</p><p><b>Код участника:</b> '+escape(r.name||"Без персональных данных")+'</p><p><b>Редакция:</b> '+escape(selected.label)+'</p>'+score+list+'<h2>Наблюдения</h2><p>'+escape(r.sixProtocol||"Не записаны")+'</p><h2>Интерпретация и ограничения</h2><p>'+escape(d.interpret)+'</p><p>Первоисточник: '+a(d.source,"Научная публикация")+'</p>';
 return '<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Протокол · '+escape(d.name)+'</title><style>@page{size:A4;margin:15mm}body{font:11pt/1.5 Arial;color:#244536}h1{font-size:17pt}h2{font-size:13pt;margin-top:16pt}p{overflow-wrap:anywhere}table{border-collapse:collapse;width:100%}th,td{padding:7pt;border:1px solid #b2c6bb;text-align:left}tr{break-inside:avoid}</style></head><body>'+body+'</body></html>';
}
function csv(d,rows){
 const safe=x=>{const s=String(x??"");return '"'+(/^[\s]*[=+\-@]/.test(s)?"'"+s:s).replace(/"/g,'""')+'"';};
 const head=["Код участника","Редакция","Состояние",...(d.scales||[]).map(x=>x.title),"Ответы без расчета","Наблюдения"];
 const body=rows.map((r,i)=>{const scores=results(d,r.answers,r.sixVersion),selected=d.forms[Number(r.sixVersion)]||d.forms[0];return [r.name||"Участник "+(i+1),selected.label,scores?"Рассчитано":"Нет количественной обработки",...(d.scales||[]).map((_,j)=>scores?scores[j].raw:""),(r.sixAnswers||[]).join("|"),r.sixProtocol||""];});
 return "\uFEFF"+[head,...body].map(row=>row.map(safe).join(";")).join("\r\n");
}
function bind(d,ctx){
 const rows=ctx.rows,r=rows?.[ctx.rowIndex],root=document.querySelector(".psy-six-calc");if(!r||!root)return;
 const update=()=>{
  const ok=status(r,d),badge=root.querySelector("#sixStatus"),report=root.querySelector("[data-six-report]");
  if(badge){badge.className="psy-six-state "+(d.scaleMax?(ok?"ready":"pending"):"neutral");badge.textContent=d.scaleMax?(ok?"Результат рассчитан":"Требуется заполнение"):"Протокол наблюдения";}
  if(report&&d.scaleMax)report.disabled=!ok;
  const result=root.querySelector("#sixSummary");if(result)result.innerHTML=summary(d,r);
  const group=root.querySelector("#sixClass");if(group)group.innerHTML=table(d,rows);
 };
 root.querySelectorAll("[data-six-answer]").forEach(sel=>sel.addEventListener("change",()=>{
  r.answers ||= [];r.answers[Number(sel.dataset.sixAnswer)]=sel.value;update();
 }));
 root.querySelectorAll("[data-six-unverified]").forEach(sel=>sel.addEventListener("change",()=>{
  r.sixAnswers ||= [];r.sixAnswers[Number(sel.dataset.sixUnverified)]=sel.value;update();
 }));
 root.querySelector("[data-six-version]")?.addEventListener("change",e=>{
  r.sixVersion=e.target.value;
  const target=root.querySelector("#sixVersionLink"),v=r.sixVersion;
  if(target)target.innerHTML=v!==""&&d.forms[Number(v)]?a(d.forms[Number(v)].url,"Открыть оригинальный бланк выбранной редакции"):"Выберите нужную редакцию до проведения.";
  update();
 });
 root.querySelector("[data-six-notes]")?.addEventListener("input",e=>{r.sixProtocol=e.target.value;update();});
 root.querySelector("[data-six-report]")?.addEventListener("click",()=>{
  if(d.scaleMax&&!status(r,d))return;
  save("psyteka_"+d.id+"_protocol.html",printable(d,r),"text/html;charset=utf-8");
 });
 root.querySelector("[data-six-clear]")?.addEventListener("click",()=>{
  if(!confirm("Очистить ответы участника?"))return;
  r.answers=[];r.sixAnswers=[];r.sixVersion="";r.sixProtocol="";
  root.querySelectorAll("[data-six-answer],[data-six-unverified],[data-six-version]").forEach(el=>el.value="");
  const nt=root.querySelector("[data-six-notes]");if(nt)nt.value="";
  const linkNode=root.querySelector("#sixVersionLink");if(linkNode)linkNode.textContent="Выберите нужную редакцию до проведения.";
  update();
 });
 root.querySelector("[data-six-csv]")?.addEventListener("click",()=>save("psyteka_"+d.id+"_group.csv",csv(d,rows),"text/csv;charset=utf-8"));
 update();
}
function printPage(d,blank,combined,row){
 const css='@page{size:A4 portrait;margin:15mm}*{box-sizing:border-box}body{font:10.5pt/1.45 Arial,sans-serif;color:#243a30}h1{font-size:18pt;margin:0 0 10pt}h2{font-size:13pt;margin:15pt 0 7pt}p{margin:7pt 0}table{width:100%;border-collapse:collapse;table-layout:fixed}th,td{border:1px solid #9db5a7;padding:6pt;font-size:9pt;overflow-wrap:anywhere}tr{break-inside:avoid}.blank-cell{height:25pt}.psy-six-print-break{break-before:page;page-break-before:always}.psy-six-versions ul{padding-left:18pt}li{margin-bottom:5pt}.psy-six-scale-legend{font-size:9pt}.psy-six-sheet p{font-size:9pt}a{color:#225c47;text-decoration:underline}.print-source{font-size:9pt}h3{font-size:11pt;margin:9pt 0 4pt}blockquote{margin:7pt 0 9pt;padding:6pt 9pt;border-left:3pt solid #9fc6b4}';
 const source='<p class="print-source">Источник: '+a(d.source,"Научная публикация")+'</p>';
 const chosen=d.forms[Number(row?.sixVersion)]||d.forms[0];
 const guide='<article><h1>'+escape(d.name)+'</h1><p>'+escape(d.author)+'</p><p>Возраст: '+escape(d.age)+'</p><p>Редакция: '+escape(chosen.label)+'</p><h2>Цель</h2><p>'+escape(d.goal)+'</p><h2>Инструкция обследуемому</h2><blockquote>'+escape(d.instructions)+'</blockquote><h2>Порядок проведения</h2><p>'+escape(d.procedure)+'</p><h2>Ключ и правила подсчета</h2><p>'+escape(d.scoring)+'</p><h2>Интерпретация и ограничения</h2><p>'+escape(d.interpret)+'</p>'+source+'</article>';
 const sheet=(d.scaleMax||d.responseMax)?materials(d):'<section><h2>Оригинальный бланк выбранной редакции</h2><p>'+a(chosen.url,"Открыть проверенную форму")+'</p></section>';
 const title='<html lang="ru"><head><meta charset="utf-8"><title>'+escape(d.name)+' · А4</title><style>'+css+'</style></head><body>';
 return '<!doctype html>'+title+(blank?sheet:guide)+(combined?'<div class="psy-six-print-break">'+sheet+'</div>':"")+'</body></html>';
}

window.PSY_REQUESTED_SIX={config,results,score,instruction,materials,processing,calculator,bind,printPage};
})();