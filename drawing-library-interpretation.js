/* Метолария: локальный синтез качественного протокола рисунка. Без сети и внешнего ИИ. */
(function(root){
"use strict";
const METHOD = {
 "fictional-animal":{focus:"В центре обсуждения – придуманный персонаж: его возможности, ограничения, способы движения, защиты и отношения с окружением.",question:"Что это за существо, где оно живет, чего хочет, кого опасается и кто ему помогает?",step:"Попросить ребенка рассказать историю персонажа, включая трудности, помощь и завершение событий."},
 "family":{focus:"Для рисунка семьи значимы прежде всего состав изображенной группы, взаимодействия и рассказ ребенка о каждом участнике.",question:"Кто здесь изображен, кто с кем общается, кого не видно и почему?",step:"Сопоставить рисунок с рассказом ребенка о реальном составе семьи и обычных совместных занятиях."},
 "kfd":{focus:"Для кинетического рисунка семьи важен не только состав фигур, но и показанные действия и распределение ролей.",question:"Что делает каждый член семьи, кто кому помогает и что происходит после этой сцены?",step:"Уточнить у ребенка действия и отношения персонажей, не подменяя их трактовками расположения фигур."},
 "corman":{focus:"При анализе рисунка семьи по Л. Корману необходимо учитывать, какую именно семью просили изобразить и каким получился рассказ.",question:"Это настоящая или придуманная семья? Кто в ней главный герой и как связаны остальные?",step:"Зафиксировать дословные пояснения к составу семьи, ее отношениям и условиям выполнения задания."},
 "school-animals":{focus:"В «Школе зверей» первостепенны школьный сюжет, роли животных и описание ситуаций общения и учебы.",question:"Кто из животных ученик, кто учитель, чем они заняты, кому здесь спокойно или трудно?",step:"Соотнести объяснения школьного сюжета с наблюдениями за школьным самочувствием и общением ребенка."},
 "school-likes":{focus:"В рисунке о школе важно, какие школьные занятия и отношения ребенок выбрал для изображения.",question:"Что здесь нравится больше всего, кто участвует и какие моменты школьной жизни не попали на рисунок?",step:"Уточнить у ребенка, что именно приносит ему удовольствие в школе и в каких ситуациях это происходит."},
 "tree":{focus:"Для рисунка дерева описывают строение, опору, окружение и авторский рассказ без приписывания деталям фиксированного значения.",question:"Что это за дерево, сколько ему лет, что с ним происходит и в чем оно нуждается?",step:"Сравнить детали дерева с выбранным сюжетом, сезоном и объяснениями ребенка."},
 "house-tree-person":{focus:"В методике «Дом – дерево – человек» следует рассматривать каждый объект отдельно и только затем их совместное размещение.",question:"Кто живет в доме, что происходит рядом с деревом и кем является человек?",step:"Уточнить рассказ о доме, дереве и человеке по отдельности, а затем об их возможной связи."},
 "person":{focus:"При описании человека отмечаются части тела, пропорции, поза и рассказ об изображенном персонаже.",question:"Кто этот человек, что он делает, какое у него настроение и что произойдет дальше?",step:"Сопоставить графические детали и позу с авторским описанием изображенного человека."},
 "free":{focus:"В свободном рисунке основой анализа остается выбранная тема, сюжет и авторское объяснение деталей.",question:"Что на рисунке самое важное и какую историю он рассказывает?",step:"Предложить ребенку назвать рисунок и пояснить значимые для него детали."}
};
const pos={"left":"слева","right":"справа","center":"в центре","top":"сверху","bottom":"снизу","whole":"по всему листу","top-left":"слева сверху","top-right":"справа сверху","bottom-left":"слева снизу","bottom-right":"справа снизу"};
const size={"small":"маленький размер","medium":"средний размер","large":"крупный размер"};
const colors={"red":"красный","orange":"оранжевый","yellow":"желтый","green":"зеленый","cyan":"голубой","blue":"синий","purple":"фиолетовый","pink":"розовый","brown":"коричневый","black":"черный","gray":"серый","white":"белый"};
const DEFENSE=["fangs","saber","teeth","claws","horns","spikes","scales","attacking","barrier","shield","armor","sharp-teeth","weapons"];
const VULNERABLE=["injured","blood","bandage","wounded","crying","tears","scars","broken","damaged","isolated","alone"];
const CONTACT=["touch","contact","holding-hands","hug","together","helping","playing","person-near","animal-near","group"];
const SEPARATION=["apart","barrier","alone","isolated","far","no-contact"];
const MOTION=["running","flying","jumping","moving","walking","flow","wings","tail-up"];
const COLOR_WARM=["yellow","orange","red","pink"];
const COLOR_COOL=["blue","cyan","purple","green"];
const cap=s=>String(s||"").replace(/\s+/g," ").trim();
const uniq=a=>Array.from(new Set(a));
function countWord(n,one,two,many){return n%10===1&&n%100!==11?one:(n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?two:many)}
function compactList(items,limit){const visible=items.slice(0,limit||10);return visible.join(", ")+(items.length>visible.length?" и еще "+(items.length-visible.length):"")}
function detailsFor(x){
 const omitted=new Set(x.excluded||[]);
 const feats=Array.isArray(x.features)?x.features.filter(f=>!omitted.has("feature:"+f)):[];
 const choices=uniq((Array.isArray(x.colors)?x.colors:[x.color]).filter(c=>colors[c]&&!omitted.has("color:"+c)));
 const counts=Object.entries(x.counts||{}).filter(([key,value])=>!omitted.has("count:"+key)&&Number.isInteger(Number(value))&&Number(value)>=0);
 const position=omitted.has("position")?"":(pos[x.position]||"");
 const sizeName=omitted.has("size")?"":(size[x.size]||"");
 const note=omitted.has("note")?"":String(x.note||"").trim();
 return {...x, features:feats, colorKeys:choices, countDetails:counts, positionLabel:position, sizeLabel:sizeName, noteText:note,
  featureLabels:x.featureLabels||{},countLabels:x.countLabels||{}};
}
function featureSummary(x){
 return uniq(x.features.map(id=>cap(x.featureLabels[id]||"")).filter(Boolean));
}
function build(input){
 const rows=(Array.isArray(input.items)?input.items:[]).filter(x=>x&&x.name).map(detailsFor);
 const age=Number(input.age),hasAge=Number.isInteger(age)&&age>=3&&age<=99;
 const target=METHOD[input.method]||METHOD.free;
 if(!rows.length)return {hasContent:false,text:"",sections:[]};
 const allF=uniq(rows.flatMap(x=>x.features));
 const colorsUsed=uniq(rows.flatMap(x=>x.colorKeys));
 const placement=rows.filter(x=>x.positionLabel);
 const sizes=rows.filter(x=>x.sizeLabel);
 const notes=rows.filter(x=>x.noteText);
 const sections=[];
 const labels=rows.map(x=>cap(x.name));
 const first=compactList(labels,8);
 let intro="В протоколе зафиксировано "+rows.length+" "+countWord(rows.length,"элемент","элемента","элементов")+" рисунка: "+first+".";
 if(hasAge)intro+=" Возраст обследуемого – "+age+" "+countWord(age,"год","года","лет")+".";
 intro+=" "+target.focus;
 sections.push({title:"Краткий результат",text:intro});
 const observations=rows.map((x,i)=>{
  const parts=[];
  if(x.positionLabel)parts.push("расположение "+x.positionLabel);
  if(x.sizeLabel)parts.push(x.sizeLabel);
  if(x.colorKeys.length)parts.push("цвет: "+x.colorKeys.map(k=>colors[k]).join(", "));
  const f=featureSummary(x);if(f.length)parts.push("детали: "+compactList(f,12));
  if(x.countDetails.length)parts.push("количество: "+compactList(x.countDetails.map(([k,v])=>(x.countLabels[k]||k)+" – "+v),7));
  const observation=parts.length?parts.join("; "):"дополнительные признаки не указаны";
  return (i+1)+". "+x.name+": "+observation+"."+(x.noteText?" Пояснение специалиста: "+x.noteText.replace(/\s+/g," ").slice(0,600)+".":"");
 });
 sections.push({title:"Наблюдаемые особенности",text:observations.join("\n")});
 const synth=[];
 if(sizes.length>1){
  const large=sizes.filter(x=>x.size==="large").map(x=>x.name),small=sizes.filter(x=>x.size==="small").map(x=>x.name);
  if(large.length&&small.length)synth.push("По размеру выделяются "+compactList(uniq(large),5)+"; меньшими изображены "+compactList(uniq(small),5)+". Такой контраст помогает выделить композиционный центр, но сам по себе не задает эмоциональную оценку персонажей.");
 }
 if(placement.length>1){
  const left=placement.filter(x=>x.position==="left"||x.position.endsWith("-left"));
  const right=placement.filter(x=>x.position==="right"||x.position.endsWith("-right"));
  if(left.length&&right.length)synth.push("Объекты распределены по разным сторонам листа: слева – "+compactList(left.map(x=>x.name),4)+", справа – "+compactList(right.map(x=>x.name),4)+". Уточнения требует связь этих частей композиции в авторском сюжете.");
 }
 if(allF.some(x=>DEFENSE.includes(x))&&allF.some(x=>VULNERABLE.includes(x))){
  synth.push("В изображении сочетаются признаки возможной защиты или угрозы и уязвимости персонажа. Важно выяснить, кто в истории опасен, кому требуется помощь и чем заканчивается ситуация; отдельные клыки, ранения или шипы не описывают характер ребенка.");
 }else if(allF.some(x=>DEFENSE.includes(x))){
  synth.push("В рисунке выделены защитные или острые детали. Их функция может быть видовой особенностью, украшением, защитой либо нападением – это можно выяснить только из объяснения ребенка.");
 }else if(allF.some(x=>VULNERABLE.includes(x))){
  synth.push("В рисунке есть детали, связанные с травмой, повреждением или переживанием персонажа. Следует выяснить, что произошло в истории и как герой справляется с ситуацией.");
 }
 if(allF.some(x=>CONTACT.includes(x))&&allF.some(x=>SEPARATION.includes(x)))synth.push("Одновременно отмечены признаки контакта и разделения персонажей. Возможно, они относятся к разным участникам или моментам сюжета; необходимо уточнить это в беседе.");
 else if(allF.some(x=>CONTACT.includes(x)))synth.push("Показаны детали взаимодействия или присутствия других персонажей. Для анализа отношений необходимо уточнить, кто инициирует контакт и как участники оценивают происходящее.");
 else if(allF.some(x=>SEPARATION.includes(x)))synth.push("Есть композиционное отделение персонажей или преграда. Это повод спросить о расстоянии и отношениях в сюжете, а не основание считать ребенка изолированным.");
 if(allF.some(x=>MOTION.includes(x)))synth.push("Отмечены признаки движения или активности; необходимо уточнить направление, цель движения и возможные препятствия по версии автора.");
 const warm=colorsUsed.some(k=>COLOR_WARM.includes(k)),cool=colorsUsed.some(k=>COLOR_COOL.includes(k));
 if(warm&&cool)synth.push("В палитре одновременно используются теплые и холодные цвета. Их смысл определяется объектом, материалом и намерением автора, а не универсальной шкалой эмоционального состояния.");
 else if(colorsUsed.length===1)synth.push("Зафиксирован один цвет ("+colors[colorsUsed[0]]+"). Уместно уточнить доступность карандашей и предпочтения ребенка до обсуждения эмоционального значения цвета.");
 else if(colorsUsed.length>1)synth.push("В рисунке использованы разные цвета ("+compactList(colorsUsed.map(k=>colors[k]),7)+"). Важнее установить, какие цвета ребенок выбирал для конкретных объектов и почему.");
 if(!synth.length)synth.push("Достоверно описать можно выбранные объекты, их место и детали. Для связного вывода пока недостаточно сведений о сюжете и авторском значении признаков.");
 sections.push({title:"Сопоставление признаков",text:synth.slice(0,5).join("\n")});
 let why=target.question;
 if(notes.length)why+=" Сопоставить ответы с зафиксированными пояснениями, не заменяя одно другим.";
 if(allF.some(x=>DEFENSE.includes(x)))why+=" Как персонаж использует острые или защитные части?";
 if(allF.some(x=>VULNERABLE.includes(x)))why+=" Что случилось с пострадавшим персонажем и кто ему помогает?";
 if(!colorsUsed.length)why+=" Какие материалы и цвета были доступны?";
 if(hasAge&&age<=6)why+=" Для дошкольника предпочтительны короткие открытые вопросы и просьба показать действие на рисунке.";
 else if(hasAge&&age>=12)why+=" Подростку полезно дать возможность самостоятельно определить смысл необычных деталей, не навязывая готовые символические трактовки.";
 else if(hasAge)why+=" Уточняющие вопросы лучше задавать по одному, сохраняя формулировки ответов ребенка.";
 sections.push({title:"Вопросы для уточняющей беседы",text:why});
 let step=target.step;
 if((input.context||"").trim())step+=" Учесть обстоятельства обследования, указанные в протоколе.";
 else step+=" Зафиксировать условия рисования: инструкцию, доступные материалы, подсказки и реакцию ребенка на задание.";
 step+=" Для итоговой профессиональной оценки сопоставить рассказ с наблюдением, особенностями выполнения и данными других методов; не выводить личностные качества из одного графического признака.";
 sections.push({title:"Практический вывод для специалиста",text:step});
 return {hasContent:true,sections:sections,text:sections.map(s=>s.title+"\n"+s.text).join("\n\n")};
}
root.MetolariaDrawingSynthesis={build:build};
})(typeof window!=="undefined"?window:globalThis);
