/* Метолария. Связная интерпретация рисунка без внешних запросов.
 * Отчет разделяет наблюдения, сочетания признаков, вопросы и действия специалиста.
 * Не использует недоказанные баллы, нормы или автоматические личностные ярлыки.
 */
(function(root){
"use strict";
const METHODS={
 "fictional-animal":{
  focus:"Особое внимание – устройству персонажа, его действиям и отношениям с другими героями.",
  question:"Как зовут это существо, что оно умеет и чем занимается?",
  action:"Уточнить назначение необычных частей тела, условия жизни и отношения персонажа с окружением."
 },
 "family":{
  focus:"Основные темы – состав изображенной семьи, близость фигур и показанные отношения.",
  question:"Кто здесь изображен и что происходит между членами семьи?",
  action:"Уточнить состав семьи, роли и реальные взаимодействия со слов ребенка; отдельно отметить, кого он решил не изображать и как это объяснил."
 },
 "kfd":{
  focus:"Основные темы – действия членов семьи и их участие в общей сцене.",
  question:"Что делает каждый человек и кто с кем взаимодействует?",
  action:"Зафиксировать действия каждого персонажа и объяснения ребенка, особенно если участники действуют отдельно."
 },
 "corman":{
  focus:"Основные темы – состав изображенной семьи и описание отношений между ее участниками.",
  question:"Это настоящая или выдуманная семья? Кто здесь кому кем приходится?",
  action:"Уточнить, какую семью изобразил ребенок, затем проверить по его рассказу роли и связи персонажей."
 },
 "school-animals":{
  focus:"Основные темы – школьные роли, учебные ситуации и общение персонажей.",
  question:"Кто здесь ученик и учитель, что происходит в школе зверей?",
  action:"Сопоставить описанный школьный эпизод с конкретными ситуациями обучения и общения, о которых рассказывает ребенок."
 },
 "school-likes":{
  focus:"Основная тема – выбранные ребенком положительные или значимые школьные события.",
  question:"Что именно в этой школьной ситуации нравится тебе больше всего?",
  action:"Выделить конкретные занятия и отношения, которые ребенок считает значимыми, и уточнить, как часто они встречаются в школе."
 },
 "tree":{
  focus:"Основные темы – строение дерева, его состояние, окружение и объяснение этих деталей.",
  question:"Что это за дерево и что с ним сейчас происходит?",
  action:"Уточнить возраст и состояние дерева в истории, назначение деталей и условия, в которых оно растет."
 },
 "house-tree-person":{
  focus:"Основные темы – особенности дома, дерева и человека, а также их взаимное расположение.",
  question:"Кто живет в доме, кто этот человек и что происходит рядом с деревом?",
  action:"Сначала уточнить историю каждого объекта по отдельности, затем попросить объяснить их связь."
 },
 "person":{
  focus:"Основные темы – фигура человека, его поза, детали и изображенное действие.",
  question:"Кто это, что он делает и что чувствует в этой ситуации?",
  action:"Уточнить действие, позу и отдельные детали фигуры через рассказ ребенка; отметить условия выполнения рисунка."
 },
 "free":{
  focus:"Основные темы – выбранный сюжет, его участники и важные для автора детали.",
  question:"Что здесь происходит и какая часть рисунка самая важная?",
  action:"Предложить название рисунка и попросить объяснить основные события и отношения объектов."
 }
};
const pos={left:"слева",right:"справа",center:"в центре",top:"сверху",bottom:"снизу",whole:"по всему листу","top-left":"вверху слева","top-right":"вверху справа","bottom-left":"внизу слева","bottom-right":"внизу справа"};
const sizes={small:"маленький",medium:"средний",large:"крупный"};
const colors={red:"красный",orange:"оранжевый",yellow:"желтый",green:"зеленый",cyan:"голубой",blue:"синий",purple:"фиолетовый",pink:"розовый",brown:"коричневый",black:"черный",gray:"серый",white:"белый"};
const GROUPS={
 sharp:["fangs","saber","teeth","claws","horns","spikes","attacking","barrier","shield","armor","sharp-teeth","weapons"],
 damage:["injured","blood","bandage","wounded","crying","tears","scars","broken","damaged"],
 connection:["touch","contact","holding-hands","hug","together","helping","playing","person-near","animal-near","group"],
 separation:["apart","barrier","alone","isolated","far","no-contact"],
 motion:["running","flying","jumping","moving","walking","flow","wings","tail-up"],
 support:["ground","air","no-paws"]
};
const clean=s=>String(s==null?"":s).replace(/\s+/g," ").trim();
const unique=a=>Array.from(new Set(a));
const word=(n,one,two,many)=>n%10===1&&n%100!==11?one:(n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?two:many);
const short=(xs,max)=>xs.slice(0,max).join(", ")+(xs.length>max?" и еще "+(xs.length-max):"");
function row(x){
 const omitted=new Set(Array.isArray(x.excluded)?x.excluded:[]);
 const features=unique((Array.isArray(x.features)?x.features:[]).filter(v=>typeof v==="string"&&!omitted.has("feature:"+v)));
 const colorKeys=unique((Array.isArray(x.colors)?x.colors:[x.color]).filter(c=>colors[c]&&!omitted.has("color:"+c)));
 const counts=Object.entries(x.counts||{}).filter(([k,v])=>!omitted.has("count:"+k)&&v!==null&&v!==""&&Number.isInteger(Number(v))&&Number(v)>=0);
 const featureLabels=x.featureLabels||{},countLabels=x.countLabels||{};
 return {
  name:clean(x.name),position:omitted.has("position")?"":x.position,positionLabel:omitted.has("position")?"":pos[x.position]||"",
  size:omitted.has("size")?"":x.size,sizeLabel:omitted.has("size")?"":sizes[x.size]||"",
  features,colorKeys,counts,featureLabels,countLabels,note:omitted.has("note")?"":clean(x.note).slice(0,500)
 };
}
function labels(x,keys){return unique(keys.map(k=>clean(x.featureLabels[k])).filter(Boolean))}
function group(x,type){return x.features.filter(k=>GROUPS[type].includes(k))}
function mentioned(x){return "«"+x.name+"»"}
function countSummary(x){return x.counts.map(([k,v])=>(clean(x.countLabels[k])||"Количество")+" – "+v)}
function combine(input){
 const rows=(Array.isArray(input.items)?input.items:[]).filter(x=>x&&clean(x.name)).map(row);
 if(!rows.length)return {hasContent:false,text:"",sections:[]};
 const age=input.age===null||input.age===""?null:Number(input.age);
 const hasAge=Number.isInteger(age)&&age>=3&&age<=99;
 const profile=METHODS[input.method]||METHODS.free;
 const sections=[];
 const count=rows.length;
 let main="Отмечен"+(count>1?"ы "+count+" "+word(count,"элемент","элемента","элементов"):" один элемент")+" рисунка: "+short(rows.map(x=>x.name),8)+".";
 const notable=rows.find(x=>x.size==="large")||rows.find(x=>x.position==="center"||x.position==="whole")||rows.find(x=>x.features.length>=2);
 if(notable){
  const attrs=[notable.sizeLabel,notable.positionLabel,labels(notable,notable.features).slice(0,2).join(", ")].filter(Boolean);
  if(attrs.length)main+=" Выделяется "+mentioned(notable)+": "+attrs.join("; ")+".";
 }
 if(hasAge)main+=" Возраст обследуемого – "+age+" "+word(age,"год","года","лет")+".";
 sections.push({title:"Краткий результат",text:main});
 const observations=rows.map((x,i)=>{
  const specifics=[];
  if(x.positionLabel)specifics.push(x.positionLabel);
  if(x.sizeLabel)specifics.push(x.sizeLabel+" по размеру");
  if(x.colorKeys.length)specifics.push("цвета: "+x.colorKeys.map(k=>colors[k]).join(", "));
  const names=labels(x,x.features);
  if(names.length)specifics.push("детали: "+short(names,9));
  const amounts=countSummary(x);
  if(amounts.length)specifics.push(short(amounts,6));
  if(x.note)specifics.push("замечание: "+x.note);
  return (i+1)+". "+x.name+" – "+(specifics.length?specifics.join("; "):"дополнительные признаки не отмечены")+".";
 });
 sections.push({title:"Наблюдаемые особенности",text:observations.join("\n")});
 const interpretation=[];
 const sharp=rows.filter(x=>group(x,"sharp").length),damage=rows.filter(x=>group(x,"damage").length);
 const related=sharp.find(x=>damage.includes(x));
 if(related){
  const sharpDetails=short(labels(related,group(related,"sharp")),3)||"острые детали";
  const damageDetails=short(labels(related,group(related,"damage")),3)||"повреждение";
  interpretation.push("В изображении "+mentioned(related)+" одновременно выделены "+sharpDetails+" и "+damageDetails+". Это сочетание задает сюжетный вопрос: защищается ли персонаж, угрожает кому-то или сам нуждается в помощи. Необходимо узнать, как ребенок объясняет обе детали.");
 }else if(sharp.length&&damage.length){
  interpretation.push("В изображении "+mentioned(sharp[0])+" выделены "+(short(labels(sharp[0],group(sharp[0],"sharp")),3)||"острые детали")+", а в изображении "+mentioned(damage[0])+" – "+(short(labels(damage[0],group(damage[0],"damage")),3)||"повреждение")+". Стоит уточнить, связаны ли эти персонажи одним событием и кто какую роль выполняет.");
 }else if(sharp.length){
  const x=sharp[0];
  interpretation.push("В изображении "+mentioned(x)+" отмечены "+(short(labels(x,group(x,"sharp")),3)||"острые детали")+". По рассказу ребенка следует уточнить их назначение: внешняя особенность, защита или действие против другого героя.");
 }else if(damage.length){
  const x=damage[0];interpretation.push("В изображении "+mentioned(x)+" изображены "+(short(labels(x,group(x,"damage")),3)||"следы повреждения")+". Для понимания сцены важно установить причину, последствия и наличие помощи в истории.");
 }
 const contact=rows.filter(x=>group(x,"connection").length),separation=rows.filter(x=>group(x,"separation").length);
 if(contact.length&&separation.length){
  if(contact.some(x=>separation.includes(x))){
   const x=contact.find(y=>separation.includes(y));
   interpretation.push("Для "+mentioned(x)+" отмечены и признаки взаимодействия, и признаки отделения. Нужно уточнить, с кем именно связан каждый признак и какие события изображены.");
  }else interpretation.push("Для персонажа "+mentioned(contact[0])+" показан контакт, а "+mentioned(separation[0])+" расположен отдельно или отделен преградой. Это может относиться к разным отношениям в сюжете; важно выяснить, как ребенок описывает участников.");
 }else if(separation.length){
  interpretation.push(mentioned(separation[0])+" отделен от других объектов или персонажей. Уточнить, связано ли это с сюжетом, расположением сцены или отношениями героев.");
 }else if(contact.length){
  interpretation.push("Для персонажа "+mentioned(contact[0])+" показан контакт или присутствие других участников. Уточнить, кто взаимодействует, что они делают вместе и как завершается эпизод.");
 }
 const sizeBig=rows.filter(x=>x.size==="large"),sizeSmall=rows.filter(x=>x.size==="small");
 if(sizeBig.length&&sizeSmall.length)interpretation.push("Размеры заметно различаются: "+mentioned(sizeBig[0])+" занимает больше места на листе, чем "+mentioned(sizeSmall[0])+". Стоит уточнить, связано ли это с ролью в сюжете, расстоянием или замыслом автора.");
 const left=rows.filter(x=>x.position==="left"||x.position&&x.position.endsWith("-left"));
 const right=rows.filter(x=>x.position==="right"||x.position&&x.position.endsWith("-right"));
 if(left.length&&right.length)interpretation.push("На противоположных сторонах листа расположены "+mentioned(left[0])+" и "+mentioned(right[0])+". В беседе стоит уточнить, связаны ли они между собой и как организовано пространство рисунка.");
 const moved=rows.find(x=>group(x,"motion").length);
 if(moved&&!related)interpretation.push("Для "+mentioned(moved)+" показано движение ("+(short(labels(moved,group(moved,"motion")),2)||"активность")+"). Нужно уточнить, куда и зачем направляется герой.");
 const supported=rows.find(x=>group(x,"support").length);
 if(supported&&!moved){
  interpretation.push("В изображении "+mentioned(supported)+" отдельно отмечен способ опоры или положение относительно земли. Уточнить, стоит ли персонаж, движется, летит или находится в условном пространстве.");
 }
 const distinctColors=rows.filter(x=>x.colorKeys.length);
 if(distinctColors.length>=2){
  const x=distinctColors[0],y=distinctColors[1];
  const a=x.colorKeys.map(k=>colors[k]).join(", "),b=y.colorKeys.map(k=>colors[k]).join(", ");
  if(a!==b&&!interpretation.some(s=>s.includes("цвет")))
   interpretation.push("Цвета объектов различаются: "+mentioned(x)+" – "+a+"; "+mentioned(y)+" – "+b+". Для анализа выбора важно уточнить, связаны ли цвета с реальными свойствами объектов или авторским замыслом.");
 }
 if(!interpretation.length){
  const x=rows.find(y=>y.colorKeys.length>1);
  if(x)interpretation.push("При изображении "+mentioned(x)+" использовано несколько цветов: "+x.colorKeys.map(k=>colors[k]).join(", ")+". Уточнить, какие части окрашены каждым цветом и почему.");
  else interpretation.push("По "+mentioned(rows[0])+" пока недостаточно характеристик для сопоставления деталей. Уточните, что изображено и как этот объект участвует в сюжете.");
 }
 sections.push({title:"Анализ сочетаний",text:interpretation.slice(0,4).join("\n\n")});
 const questions=[];
 if(related)questions.push("Что случилось с персонажем "+mentioned(related)+" и для чего ему детали "+(labels(related,group(related,"sharp")).length?"«"+short(labels(related,group(related,"sharp")),1)+"»":"внешности")+"?");
 else if(sharp.length)questions.push("Какую роль у персонажа "+mentioned(sharp[0])+" играют детали "+(labels(sharp[0],group(sharp[0],"sharp")).length?"«"+short(labels(sharp[0],group(sharp[0],"sharp")),2)+"»":"его внешности")+"?");
 else if(damage.length)questions.push("Что случилось с персонажем "+mentioned(damage[0])+" и что будет дальше?");
 if(contact.length&&separation.length)questions.push("Кто здесь с кем общается, а кто находится отдельно? Почему?");
 else if(separation.length)questions.push("Почему персонаж "+mentioned(separation[0])+" находится отдельно от остальных?");
 if(sizeBig.length&&sizeSmall.length)questions.push("Почему "+mentioned(sizeBig[0])+" занимает больше места на листе, чем "+mentioned(sizeSmall[0])+"?");
 if(!questions.length)questions.push(profile.question);
 else if(questions.length<3)questions.push(profile.question);
 if(questions.length<3&&left.length&&right.length)questions.push("Как связаны объекты "+mentioned(left[0])+" и "+mentioned(right[0])+"?");
 sections.push({title:"Вопросы ребенку",text:unique(questions).slice(0,3).map((q,i)=>(i+1)+". "+q).join("\n")});
 const actions=[profile.action];
 if(related)actions.push("Отдельно записать объяснение деталей "+(short(labels(related,group(related,"sharp")),2)||"острых частей")+" и "+(short(labels(related,group(related,"damage")),2)||"повреждения")+" на изображении "+mentioned(related)+".");
 else if(sharp.length||damage.length)actions.push("Выяснить функцию необычных деталей в истории и зафиксировать ответ ребенка дословно.");
 if(contact.length||separation.length)actions.push("Зафиксировать со слов ребенка, кто с кем связан и какое действие происходит между персонажами.");
 else if(sizeBig.length&&sizeSmall.length)actions.push("Проверить объяснение различий в размерах через рассказ о героях и расстоянии между ними.");
 if(hasAge&&age<=6)actions.push("С учетом возраста задавать по одному короткому вопросу, предлагая ребенку показать ответ на рисунке.");
 if(!(input.context||"").trim())actions.push("Отметить, какие материалы были доступны и выполнялся ли рисунок самостоятельно.");
 sections.push({title:"Практический вывод",text:unique(actions).slice(0,3).join(" ")});
 return {hasContent:true,sections,text:sections.map(s=>s.title+"\n"+s.text).join("\n\n")};
}
root.MetolariaDrawingSynthesis={build:combine};
})(typeof window!=="undefined"?window:globalThis);
