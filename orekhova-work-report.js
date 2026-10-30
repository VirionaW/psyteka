"use strict";
(function(){
 const COLORS={blue:"синий",red:"красный",yellow:"желтый",green:"зеленый",purple:"фиолетовый",gray:"серый",brown:"коричневый",black:"черный"};
 const BASIC=new Set(["blue","red","yellow","green"]),DARK=new Set(["brown","black"]);
 const EM=["Счастье","Горе","Справедливость","Обида","Дружба","Ссора","Доброта","Злоба","Скука","Восхищение"];
 const SIT=["Отношение к себе","Дорога в школу","Чтение","Письмо","Математика","Учитель","Одноклассники","Дома","Домашние задания","Десятый домик"];
 const GROUPS=[["Базовый комфорт",0,1],["Личностный рост",2,3],["Общение",4,5],["Потенциальная агрессия",6,7],["Познание",8,9]];
 const POS=[0,2,4,6,9],NEG=[1,3,5,7,8],SCHOOL=[1,2,3,4,5,6,8];
 const ASK=[
  "Уточнить эмоциональное отношение к себе, реакцию на ошибки, критику и успех.",
  "Выяснить, как ребенок собирается в школу утром, что беспокоит до начала уроков.",
  "Обсудить чтение: понимание заданий, ответы вслух, напряжение при ошибках.",
  "Обсудить письмо: утомление руки, объем работы, страх исправлений, темп.",
  "Проверить, что именно вызывает напряжение на математике: трудность, темп или оценивание.",
  "Уточнить отношение к учителю: замечания, просьбы о помощи, ожидания и страх ошибки.",
  "Спросить о друзьях, ссорах, одиночестве; дополнить наблюдением на переменах.",
  "Сопоставить настроение дома и в школе, возможность отдыхать, семейную нагрузку.",
  "Уточнить длительность и самостоятельность домашних заданий, конфликты вокруг них.",
  "Попросить описать, почему именно этот сюжет и этот цвет были выбраны."
 ];
 const list=values=>values.length===0?"не выявлены":values.length===1?values[0]:values.length===2?values.join(" и "):values.slice(0,-1).join(", ")+" и "+values.at(-1);
 const quote=x=>"«"+x+"»";
 function build(s,score,group){
  const p=id=>s.ranking.indexOf(id)+1;
  const v=score.vk,co=score.co;
  const vk=v<=.5?{status:"Хроническое переутомление",tone:"red",guide:"энергетический показатель в неблагоприятном диапазоне"}:v<=.91?{status:"Компенсируемая усталость",tone:"yellow",guide:"работоспособность поддерживается ценой периодического снижения активности"}:v<=1.9?{status:"Оптимальная работоспособность",tone:"green",guide:"энергетический показатель в оптимальном диапазоне"}:v>2?{status:"Перевозбуждение",tone:"red",guide:"возможна перегрузка темпом деятельности"}:{status:"Между опубликованными порогами",tone:"neutral",guide:"для этого значения в шкале нет отдельной категории"};
  const emotional=co<10?{status:"Преобладают положительные эмоции",tone:"green"}:co<=18?{status:"Обычный эмоциональный фон",tone:"yellow"}:co===20?{status:"Значение 20 без категории",tone:"neutral"}:{status:"Преобладают отрицательные эмоции",tone:"red"};
  const pairs=GROUPS.map(([domain,a,b])=>({domain,a,b,same:s.emotions[a]===s.emotions[b],distance:Math.abs(p(s.emotions[a])-p(s.emotions[b]))}));
  const same=pairs.filter(x=>x.same);
  const plus=POS.filter(i=>BASIC.has(s.emotions[i])).length,minus=NEG.filter(i=>DARK.has(s.emotions[i])).length;
  const unusual=POS.filter(i=>DARK.has(s.emotions[i]));
  const regions=SIT.map((name,i)=>{
   const id=s.situations[i],good=POS.filter(k=>s.emotions[k]===id).map(k=>EM[k]),bad=NEG.filter(k=>s.emotions[k]===id).map(k=>EM[k]);
   const dark=DARK.has(id),low=p(id)>=7;
   const marker=good.length&&!bad.length&&!dark?"positive":bad.length&&!good.length?"adverse":good.length&&bad.length?"mixed":dark?"adverse":"unclear";
   const points=(bad.length?3:0)+(dark?2:0)+(low?1:0)+(marker==="mixed"?1:0);
   return {i,name,id,color:COLORS[id],place:p(id),good,bad,dark,low,marker,points};
  });
  const school=SCHOOL.map(i=>regions[i]);
  const strong=school.filter(x=>x.marker==="positive"&&!x.low);
  const risk=school.filter(x=>x.marker==="adverse"||x.dark);
  const mixed=school.filter(x=>x.marker==="mixed");
  const severe=[...school].filter(x=>x.points>=2).sort((a,b)=>b.points-a.points||a.i-b.i);
  const schoolStatus=risk.length>=3?"Преимущественно напряженные ассоциации":strong.length>=4&&!risk.length?"Преимущественно благоприятные ассоциации":"Неоднородное отношение";
  const schoolTone=risk.length>=3?"red":strong.length>=4&&!risk.length?"green":"yellow";
  const grade=String(group||"").trim(),firstGrade=/^1[а-яa-z]?$/i.test(grade);
  let ageLabel,ageExplanation,ageAction;
  if(!Number.isInteger(s.age)){
   ageLabel="Возраст не указан";
   ageExplanation="Возраст ребенка не указан. В руководстве отсутствуют отдельные числовые нормы ВК и СО по годам жизни; доступна оценка по общим порогам методики.";
   ageAction="Уточнить возраст и класс, чтобы не смешивать реальные школьные переживания с ожиданиями от школы.";
  }else if(s.age<4||s.age>12){
   ageLabel="Вне типичного возрастного диапазона";
   ageExplanation="Возраст "+s.age+" лет. Данная версия применяется прежде всего у старших дошкольников и младших школьников. Интерпретация адаптации первоклассников не переносится автоматически на этот возраст; возрастных порогов для "+s.age+" лет источник не дает.";
   ageAction="Подобрать дополнительные материалы для соответствующего возраста и уточнить применимость используемой редакции.";
  }else if(s.age<=6&&!firstGrade){
   ageLabel="Дошкольный возраст";
   ageExplanation="Возраст "+s.age+" лет. Если ребенок еще не посещает школу, домики учителя, учебных предметов и домашней работы описывают представления о школе, а не пережитый учебный опыт. ВК и СО оцениваются по общим границам метода, не по отдельной возрастной норме.";
   ageAction="Уточнить, бывал ли ребенок в школе и понимает ли названия уроков и социальных чувств.";
  }else if(s.age<=8||firstGrade){
   ageLabel="Этап школьной адаптации";
   ageExplanation="Возраст "+s.age+" лет. Для начала школьного обучения особенно важны дорога в школу, контакт с учителем, одноклассники и усталость к концу дня. Пороги ВК и СО приводятся для методики в целом; отдельная таблица нормы именно для "+s.age+" лет не опубликована.";
   ageAction="Сопоставить ответы с наблюдениями в классе, утренним самочувствием и изменением утомления в течение дня.";
  }else if(s.age<=10){
   ageLabel="Младший школьный возраст";
   ageExplanation="Возраст "+s.age+" лет. Полезнее искать конкретные трудности по предметам, со сверстниками и при выполнении заданий, чем автоматически оценивать первоклассную адаптацию. Возрастной нормы ВК и СО именно для "+s.age+" лет нет.";
   ageAction="Проверить, проявляются ли указанные трудности только на конкретных уроках и в каких учебных условиях.";
  }else{
   ageLabel="Старший край ориентировочного диапазона";
   ageExplanation="Возраст "+s.age+" лет. Учебный опыт отличается от адаптации первоклассника, на которую ориентировано описание. Шкалы ВК и СО применены как общие методические ориентиры без отдельной возрастной нормы.";
   ageAction="Дополнить исследование методиками, соответствующими возрасту, и оценить конкретные школьные отношения.";
  }
  const describe=x=>{
   let text=quote(x.name)+" – "+x.color+" (место "+x.place+" в дорожке)";
   const associations=[];
   if(x.good.length)associations.push("совпадение с "+list(x.good.map(quote)));
   if(x.bad.length)associations.push("совпадение с "+list(x.bad.map(quote)));
   if(x.dark)associations.push("коричневый или черный");
   if(x.low)associations.push("цвет на последних позициях");
   return text+(associations.length?": "+associations.join("; "):": нет прямого совпадения с домиками чувств");
  };
  const lead="ВК "+v.toFixed(2).replace(".",",")+" – "+vk.status.toLowerCase()+"; СО "+co+" – "+emotional.status.toLowerCase()+". "+
   "Первые цвета дорожки: "+list(s.ranking.slice(0,2).map(x=>COLORS[x]))+". "+
   (s.ranking.slice(5).some(x=>BASIC.has(x))?"Основные цвета есть среди трех последних – проверена связь с эмоциональными домиками.":"Основные цвета не сконцентрированы на последних трех местах.");
  const semantic=same.length?
   "Одинаковый цвет использован в "+same.length+" из пяти противоположных пар: "+list(same.map(x=>quote(x.domain)+" ("+EM[x.a]+" – "+EM[x.b]+")"))+
   ". Для этих пар важно проверить, различает ли ребенок смысл двух противоположных чувств.":
   "Все пять пар противоположных чувств получили разные цвета; прямых совпадений противоположных эмоций нет.";
  const semantic2=" Основные цвета использованы для "+plus+" из пяти положительных чувств; коричневый или черный – для "+minus+" из пяти отрицательных."+
   (unusual.length?" Нетипично для схемы методики темные цвета получили положительные чувства: "+list(unusual.map(i=>quote(EM[i])))+".":"");
  const atSchool=severe.length?
   "Приоритетные школьные ситуации: "+severe.slice(0,4).map(describe).join(". ")+".":"В семи школьных ситуациях нет сильных отрицательных совпадений с домиками чувств.";
  const resources=strong.length?
   " Относительно благоприятные связи: "+strong.slice(0,3).map(describe).join(". ")+".":"";
  const ambivalence=mixed.length?" Смешанные связи (тот же цвет для приятных и неприятных чувств) отмечены в "+list(mixed.map(x=>quote(x.name)))+".":"";
  const self=regions[0],home=regions[7],free=regions[9];
  const personal="Себя ребенок обозначил так: "+describe(self)+". Домашнюю обстановку – "+describe(home)+". "+
   (self.marker==="adverse"||self.dark?"Отношение к себе требует отдельного обсуждения; ":"")+
   (home.marker==="adverse"||home.dark?"домашние переживания также заслуживают уточнения; ":"")+
   "десятый домик: «"+s.description.trim().replace(/[.!?]+$/,"")+"»; выбран "+free.color+" цвет, позиция "+free.place+".";
  const concerns=[];
  const add=(key,text,level)=>{if(!concerns.some(x=>x.key===key))concerns.push({key,text,level})};
  if(vk.tone==="red")add("energy",v>2?"Проверить признаки перегрузки и чрезмерно высокого темпа: сон, паузы, занятость после школы.":"Уточнить утомление на уроках, отдых, сон и объем нагрузки; обсудить возможность восстановительных пауз.",5);
  else if(vk.tone==="yellow")add("energy","Понаблюдать, в какие часы падает работоспособность, и обсудить с педагогом чередование нагрузки и отдыха.",3);
  if(emotional.tone==="red")add("mood","Провести индивидуальную беседу об источниках неприятных переживаний, сопоставить ответы с данными родителей и учителя.",5);
  if(same.length)same.slice(0,2).forEach(x=>add("pair"+x.domain,"Проверить различение эмоций "+quote(EM[x.a])+" и "+quote(EM[x.b])+": попросить привести примеры из собственной жизни.",4));
  severe.slice(0,3).forEach(x=>add("school"+x.i,ASK[x.i],4+x.points));
  if(self.marker==="adverse"||self.dark)add("self",ASK[0],5);
  if(home.marker==="adverse"||home.dark)add("home",ASK[7],4);
  if(s.age<=6&&!firstGrade||!Number.isInteger(s.age)||s.age>10)add("age",ageAction,3);
  if(!concerns.length)add("monitor","Сопоставить благоприятные цветовые связи с повседневным поведением, отметить ситуации, в которых ребенок чувствует себя уверенно.",1);
  concerns.sort((a,b)=>b.level-a.level||a.key.localeCompare(b.key,"ru"));
  const actions=concerns.slice(0,5).map(x=>x.text);
  const strengths=[];
  if(vk.tone==="green")strengths.push("работоспособность в оптимальном диапазоне");
  if(emotional.tone==="green")strengths.push("положительный общий эмоциональный фон");
  if(!same.length)strengths.push("пять пар противоположных чувств раскрашены по-разному");
  if(strong.length)strengths.push("благоприятные совпадения для "+list(strong.slice(0,2).map(x=>quote(x.name))));
  const status=emotional.tone==="red"||risk.length>=3||same.length>=3?"Требует повышенного внимания":emotional.tone==="yellow"||severe.length||same.length?"Имеются отдельные зоны внимания":"Преимущественно благоприятные показатели по методике";
  return {
   short:[
    {label:"Энергетический баланс (ВК)",value:v.toFixed(2).replace(".",",")+" · "+vk.status,tone:vk.tone},
    {label:"Эмоциональный фон (СО)",value:co+" · "+emotional.status,tone:emotional.tone},
    {label:"Различение социальных эмоций",value:same.length?same.length+" совпавших пар из 5":"5 разных пар из 5",tone:same.length>=2?"red":same.length?"yellow":"green"},
    {label:"Школьные ситуации",value:schoolStatus,tone:risk.length>=3?"red":strong.length>=4&&!risk.length?"green":"yellow"},
    {label:"Возрастной контекст",value:ageLabel,tone:"neutral"}
   ],
   sections:[
    ["Основные результаты",lead],
    ["Социальные эмоции",semantic+semantic2],
    ["Школьные ситуации: приоритеты и опора",schoolStatus+". "+atSchool+resources+ambivalence],
    ["Отношение к себе и дому",personal],
    ["Оценка с учетом возраста",ageExplanation],
    ["Рабочее заключение",status+". "+
      (strengths.length?"Ресурсы: "+list(strengths)+". ":"")+
      (severe.length?"Проверить прежде всего "+list(severe.slice(0,3).map(x=>quote(x.name)))+". ":"")+
      "Дальнейшая работа строится по указанным ниже наблюдаемым ситуациям."]
   ],
   actions,ageStatus:ageLabel,schoolStatus,status
  };
 }
 window.PSY_OREKHOVA_WORK_REPORT={build};
})();
