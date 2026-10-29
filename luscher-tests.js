"use strict";
(()=>{
const $=id=>document.getElementById(id);
const COLORS=[
 {id:"0",name:"Серый",hex:"#979797"},{id:"1",name:"Синий",hex:"#24518e"},
 {id:"2",name:"Зеленый",hex:"#1d7860"},{id:"3",name:"Красный",hex:"#d4433c"},
 {id:"4",name:"Желтый",hex:"#eac821"},{id:"5",name:"Фиолетовый",hex:"#8451a4"},
 {id:"6",name:"Коричневый",hex:"#865a3c"},{id:"7",name:"Черный",hex:"#292929"}
];
const MAP=Object.fromEntries(COLORS.map(c=>[c.id,c]));
const VERSIONS={
 eight:{title:"Восьмицветовой тест Люшера",description:"Восемь цветов, два отдельных предъявления. После второго выбора – позиционный протокол и сопоставление."},
 single:{title:"Цветовой тест – один выбор",description:"Один восьмицветный ряд. Записываются позиции и порядок цветовых предпочтений."},
 conflict:{title:"Анализ конфликтов Люшера",description:"Два восьмицветных ряда с отдельным сопоставлением предпочитаемых и отвергаемых цветов. Анализ основан на позициях, а не на воспроизведении защищенных авторских таблиц."},
 full:{title:"Полный клинический тест Люшера",description:"Протокол семи таблиц. Заполняется по оригинальному комплекту карточек, без подмены авторских цветовых стимулов."},
 figures:{title:"Тест фигур Люшера",description:"Ручная регистрация выбора фигур по оригинальному комплекту и текста наблюдений."}
};
const FULL_TABLES=[
 ["Серая таблица","Пять ахроматических цветов: запишите порядок и коды из оригинального руководства."],
 ["Восьмицветная таблица","Запишите последовательность кодов восьми цветов."],
 ["Четыре основных цвета","Запишите выборы по парам или итоговый протокол по используемой редакции."],
 ["Таблица синей гаммы","Запишите выборы и коды из комплекта."],
 ["Таблица зеленой гаммы","Запишите выборы и коды из комплекта."],
 ["Таблица красной гаммы","Запишите выборы и коды из комплекта."],
 ["Таблица желтой гаммы","Запишите выборы и коды из комплекта."]
];
const FIGURE_FIELDS=[
 ["Понравившиеся фигуры № 1 и № 2","Номера или обозначения двух выбранных фигур из оригинального комплекта."],
 ["Непонравившиеся фигуры № 1 и № 2","Номера или обозначения двух отвергнутых фигур."],
 ["Цветовые выборы","Запишите кодовую последовательность цветовой части, если она проводилась."],
 ["Дополнительные наблюдения","Записи психолога по ходу обследования."]
];
const KEY="metolaria_luscher_session_20261029";
const initial=()=>({variant:null,mode:"one",group:"",people:[],index:0,byVariant:{},chooser:false});
let state=initial();
try{const saved=JSON.parse(sessionStorage.getItem(KEY)||"null");if(saved&&VERSIONS[saved.variant]&&Array.isArray(saved.people))state={...initial(),...saved};}catch(_){}
const escapeHTML=t=>String(t??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const person=()=>state.people[state.index]||null;
const save=()=>{try{sessionStorage.setItem(KEY,JSON.stringify(state));}catch(_){}};
const color=id=>MAP[id]||{name:"Неизвестен",hex:"#fff"};
const name=id=>color(id).name;
const isManual=()=>["full","figures"].includes(state.variant);
const isDouble=()=>["eight","conflict"].includes(state.variant);
const completed=s=>!!s&&(isManual()?Object.values(s.manual||{}).some(x=>String(x).trim()):s.first?.length===8&&(!isDouble()||s.second?.length===8));
const safeValue=v=>escapeHTML(v).replace(/\n/g,"<br>");
const positions=row=>Object.fromEntries(row.map((c,i)=>[c,i+1]));
function setError(message){$("peopleError").textContent=message||"";}
function renderPeople(){
 $("people").innerHTML=state.people.map((p,i)=>'<button type="button" class="person-tag'+(i===state.index?' selected':'')+(completed(p)?' ready':'')+'" data-person="'+i+'">'+escapeHTML(p.name)+(p.age?' · '+p.age+' лет':'')+'</button>').join("");
 $("workBody").hidden=!person();$("groupSummary").hidden=state.mode!=="group"||state.people.length===0;
 if(state.mode==="group"&&state.people.length)renderGroup();
}
function selectVariant(key){
 if(!VERSIONS[key])return;
 if(state.variant!==key){if(state.variant)state.byVariant[state.variant]={people:state.people,index:state.index};const saved=state.byVariant[key]||{people:[],index:0};state.variant=key;state.people=saved.people;state.index=saved.index;}state.chooser=false;
 $("versionScreen").hidden=true;$("workspace").hidden=false;
 $("versionTitle").textContent=VERSIONS[key].title;$("versionDescription").textContent=VERSIONS[key].description;
 document.querySelectorAll("[data-mode]").forEach(el=>el.classList.toggle("active",el.dataset.mode===state.mode));
 $("groupName").value=state.group;save();render();
}
function newPerson(){
 const name=$("personName").value.trim().replace(/\s+/g," "),ageText=$("personAge").value.trim(),age=ageText?Number(ageText):null;
 state.group=$("groupName").value.trim();
 if(!name){setError("Введите фамилию и имя участника.");$("personName").focus();return;}
 if(age!==null&&(!Number.isInteger(age)||age<3||age>100)){setError("Укажите возраст в полных годах.");$("personAge").focus();return;}
 if(!state.group&&age===null){setError("Укажите возраст или класс / группу.");return;}
 if(state.mode==="group"&&!state.group){setError("Для группы укажите класс или группу.");return;}
 state.people.push({name,age,first:[],second:[],pass:0,manual:{},showReport:false});
 state.index=state.people.length-1;$("personName").value="";$("personAge").value="";setError("");save();render();
}
function rankHTML(row){
 return row.map((id,i)=>'<span><i style="background:'+color(id).hex+'"></i>'+(i+1)+'. '+name(id)+'</span>').join("");
}
function renderChoice(){
 const p=person(),pass=p.pass||0,row=pass===0?p.first:p.second;
 $("choiceStage").hidden=false;$("manualStage").hidden=true;$("reportStage").hidden=true;
 $("stageTitle").textContent="Выбор цветов";
 $("stageHelp").textContent=isDouble()?"Выбор "+(pass+1)+" из 2. Отмечайте наиболее приятный из оставшихся цветов.":"Один выбор из восьми цветов.";
 $("choiceTitle").textContent="Цветовой ряд · выбор "+(pass+1);
 $("choiceTip").textContent=pass===0?"По очереди выбирайте наиболее приятный сейчас цвет, не связывая его с одеждой или любимым предметом.":"Выбирайте заново, не пытаясь повторить или намеренно изменить предыдущий порядок.";
 $("chosenStrip").innerHTML=Array.from({length:8},(_,i)=>'<div class="selected-slot">'+(row[i]?'<i style="background:'+color(row[i]).hex+'"></i><strong>'+(i+1)+'. '+name(row[i])+'</strong>':'Место '+(i+1))+'</div>').join("");
 $("colorGrid").innerHTML=COLORS.map(c=>'<button type="button" data-color="'+c.id+'" class="color-card" '+(row.includes(c.id)?'disabled':'')+'><span class="color-surface" style="background:'+c.hex+'"></span><span>'+c.name+'</span></button>').join("");
 $("choiceCount").textContent="Выбрано: "+row.length+" из 8";$("goNext").disabled=row.length!==8;
 $("goNext").textContent=isDouble()&&pass===0?"Перейти ко второму выбору":"Показать результаты";
 $("personStatus").textContent="Заполнено: "+(p.first.length+(isDouble()?p.second.length:0))+" из "+(isDouble()?16:8)+" цветовых позиций";
}
function manualFields(){
 const p=person(),fields=state.variant==="full"?FULL_TABLES:FIGURE_FIELDS;
 $("manualTitle").textContent=state.variant==="full"?"Регистрация полного протокола":"Регистрация фигур";
 $("manualIntro").textContent=state.variant==="full"?
 "Ниже семь таблиц. Вводите коды/ответы так, как они записаны на бланке используемой редакции.":
 "Используйте обозначения фигур из оригинального набора. Эта страница сохраняет выборы, не воспроизводя сами защищенные изображения.";
 $("manualFields").innerHTML=fields.map(([title,hint],i)=>'<div class="manual-row"><label for="field'+i+'">'+(i+1)+'. '+escapeHTML(title)+'<small>'+escapeHTML(hint)+'</small></label><textarea id="field'+i+'" data-field="'+i+'" rows="3">'+escapeHTML(p.manual[i]||"")+'</textarea></div>').join("");
 $("personStatus").textContent="Заполнено разделов: "+Object.values(p.manual).filter(x=>String(x).trim()).length+" из "+fields.length;
 $("choiceStage").hidden=true;$("manualStage").hidden=false;$("reportStage").hidden=true;
 $("stageTitle").textContent=state.variant==="full"?"Семь таблиц":"Фигуры";
 $("stageHelp").textContent="Заполните записи с оригинального бланка.";
}
function analyze(p){
 const first=p.first||[],second=p.second||[],selected=second.length===8?second:first;
 const p2=positions(selected),main=new Set(["1","2","3","4"]),aux=new Set(["0","5","6","7"]);
 const groups=[["Выраженное предпочтение",selected.slice(0,2),"++"],["Умеренное предпочтение",selected.slice(2,4),"××"],["Нейтральная зона",selected.slice(4,6),"=="],["Последние позиции",selected.slice(6),"--"]];
 const texts=[];
 texts.push("В цветовой дорожке на первых двух местах расположены "+selected.slice(0,2).map(name).join(" и ")+", последними выбраны "+selected.slice(-2).map(name).join(" и ")+".");
 const mainStart=selected.slice(0,4).filter(c=>main.has(c)).length;
 texts.push("В первой половине ряда находятся "+mainStart+" из четырех основных цветов. Во второй половине – "+(4-mainStart)+".");
 const extraFront=selected.slice(0,2).filter(c=>aux.has(c));
 if(extraFront.length)texts.push("Среди первых двух находятся дополнительные цвета: "+extraFront.map(name).join(", ")+".");
 const mainEnd=selected.slice(6).filter(c=>main.has(c));
 if(mainEnd.length)texts.push("Среди последних двух находятся основные цвета: "+mainEnd.map(name).join(", ")+".");
 const shifts=first.length===8&&second.length===8?COLORS.map(c=>({
 id:c.id,name:c.name,from:first.indexOf(c.id)+1,to:second.indexOf(c.id)+1,delta:(second.indexOf(c.id)-first.indexOf(c.id))
 })).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta)):[];
 if(shifts.length){
 const most=shifts.filter(x=>Math.abs(x.delta)>0).slice(0,3);
 texts.push(most.length?"Между первым и вторым проходами наиболее заметно переместились "+most.map(x=>x.name+" ("+x.from+" → "+x.to+")").join("; ")+".":"При повторном предъявлении весь порядок цветов сохранился.");
 }
 return {selected,groups,shifts,texts,p2};
}

const COLOR_THEMES={
 "0":{gen:"серого",trait:"психологической дистанции и стремления ограничить внешние воздействия",front:"временной потребностью отгородиться от лишних воздействий",back:"готовностью включаться во взаимодействие без акцента на дистанцировании"},
 "1":{gen:"синего",trait:"спокойствия, эмоциональной близости и устойчивости",front:"потребностью в спокойствии, устойчивости отношений и предсказуемой обстановке",back:"отодвиганием потребности в покое и эмоциональной близости"},
 "2":{gen:"зеленого",trait:"самоутверждения, настойчивости и самоконтроля",front:"значимостью самостоятельности, удержания позиции и контроля над обстоятельствами",back:"возможным напряжением вокруг самоутверждения и удержания собственной позиции"},
 "3":{gen:"красного",trait:"активности, энергии и достижения результата",front:"ориентацией на активные действия, инициативу и получение результата",back:"снижением привлекательности интенсивной деятельности или соперничества"},
 "4":{gen:"желтого",trait:"надежд, перспектив и открытости изменениям",front:"ожиданием новых возможностей, перемен и положительной перспективы",back:"сдержанностью в отношении перемен или неопределенного будущего"},
 "5":{gen:"фиолетового",trait:"впечатлительности, эмоционального отклика и сближения",front:"значимостью эмоционального впечатления и личной вовлеченности",back:"меньшей привлекательностью эмоционально насыщенных впечатлений"},
 "6":{gen:"коричневого",trait:"телесного комфорта, покоя и повседневных потребностей",front:"актуальностью физического удобства, отдыха и повседневного благополучия",back:"отодвиганием на второй план темы телесного комфорта"},
 "7":{gen:"черного",trait:"отрицания, протеста и дистанции от ограничений",front:"значимостью сопротивления внешнему давлению и нежеланием мириться с ограничениями",back:"меньшей привлекательностью протеста или полного отрицания"}
};
const PAIR_THEMES={
 "1,2":"устойчивость, эмоциональную определенность и настойчивое сохранение собственной позиции",
 "1,3":"сочетание потребности в спокойствии с готовностью действовать и добиваться результата",
 "1,4":"сочетание потребности в надежной опоре и интереса к новым перспективам",
 "2,3":"самостоятельность, волевое усилие и стремление влиять на ход событий",
 "2,4":"сочетание настойчивости и стремления к обновлению, где важно согласование контроля с ожиданием перемен",
 "3,4":"направленность на активные действия, взаимодействие и будущие возможности"
};
function buildInterpretation(p){
 const a=analyze(p),r=a.selected,first=r[0],second=r[1],last=r[7],penultimate=r[6];
 const firstPass=p.first||[],secondPass=p.second||[],hasSecond=secondPass.length===8;
 const keys=[first,second].sort().join(",");
 const main=new Set(["1","2","3","4"]),aux=new Set(["0","5","6","7"]);
 const mainTop=r.slice(0,4).filter(x=>main.has(x));
 const mainLast=r.slice(5).filter(x=>main.has(x));
 const auxFirst=r.slice(0,2).filter(x=>aux.has(x));
 const topNames=r.slice(0,2).map(name).join(" – ");
 const endNames=r.slice(6,8).map(name).join(" – ");
 const changes=a.shifts.filter(x=>x.delta!==0), stable=a.shifts.filter(x=>x.delta===0);
 const forward=changes.filter(x=>x.delta<0),backward=changes.filter(x=>x.delta>0);
 const largest=changes.slice(0,2);
 const passName=hasSecond?"второго выбора":"единственного выбора";
 const pairMeaning=PAIR_THEMES[keys];
 const paragraphs=[];
 // Meanings here are interpretive associations used by the Lüscher system, NOT empirically
 // established personality labels. Do not fabricate copyrighted 56-pair diagnostic keys.
 let t="В ряду "+passName+" ведущим стал "+name(first).toLowerCase()+" цвет, затем выбран "+name(second).toLowerCase()+". В символике Люшера первое предпочтение связывается с "+COLOR_THEMES[first].trait+", второе – с "+COLOR_THEMES[second].trait+". ";
 if(pairMeaning)t+="В сочетании эти две темы образуют акцент на "+pairMeaning+". Поскольку "+name(first).toLowerCase()+" стоит первым, именно его смысл выступает ведущим, а "+name(second).toLowerCase()+" дополняет направление выбора.";
 else t+="Такое сочетание показывает соседство двух разных смысловых тем, причем ведущая тема – "+COLOR_THEMES[first].front+", а вторая добавляет мотив "+COLOR_THEMES[second].trait+".";
 paragraphs.push(["Ведущие предпочтения",t]);
 t="На третьем и четвертом местах находятся "+r.slice(2,4).map(name).join(" и ")+". Эти цвета образуют зону дополнительного предпочтения: "+COLOR_THEMES[r[2]].trait+" и "+COLOR_THEMES[r[3]].trait+". ";
 t+="Из четырех основных цветов "+mainTop.length+" расположены в первой половине ряда. ";
 if(mainTop.length>=3)t+="Основные мотивы покоя, самостоятельности, действия и перспектив в этой конфигурации в целом доступны как предпочитаемые направления.";
 else if(mainTop.length===2)t+="Предпочтения распределились между основными и дополнительными цветовыми темами, без явного преобладания одной группы.";
 else t+="Основные цвета преимущественно смещены во вторую половину ряда, тогда как ведущие позиции заняты дополнительными цветами.";
 paragraphs.push(["Дополнительные предпочтения",t]);
 t="На последних двух местах находятся "+name(penultimate).toLowerCase()+" и "+name(last).toLowerCase()+". Согласно позиционной схеме это зона наименьшего предпочтения. ";
 t+="В символическом прочтении отнесение "+COLOR_THEMES[penultimate].gen+" к последним позициям может означать "+COLOR_THEMES[penultimate].back+", а "+COLOR_THEMES[last].gen+" – "+COLOR_THEMES[last].back+". ";
 if(mainLast.length)t+="На позициях 6-8 также находятся основные цвета: "+mainLast.map(name).join(", ")+". При интерпретации это выделяет соответствующие потребности как менее актуальные или потенциально напряженные в конкретной ситуации выбора.";
 else t+="Все основные цвета находятся не ниже пятой позиции, поэтому в последних трех местах представлены только дополнительные цветовые темы.";
 paragraphs.push(["Наименее предпочитаемые цвета",t]);
 if(hasSecond){
  t="Первый и повторный выборы "+(changes.length===0?"полностью совпали. Порядок всех восьми цветов остался прежним.":changes.length<=3?"изменились незначительно: переместились "+changes.length+" цвета.":"заметно различаются: свои позиции изменили "+changes.length+" из восьми цветов.")+" ";
  if(largest.length)t+="Наибольшие изменения: "+largest.map(x=>name(x.id).toLowerCase()+" с "+x.from+" на "+x.to+" место").join("; ")+". ";
  if(stable.length)t+="Без перемещения остались "+stable.map(x=>name(x.id).toLowerCase()).join(", ")+". ";
  if(forward.length&&backward.length)t+="Часть цветов стала более предпочитаемой, а часть отодвинулась к концу; это показывает перестройку акцентов при повторном предъявлении.";
  else if(changes.length===0)t+="Это свидетельствует об устойчивости самого порядка выбора на двух предъявлениях.";
  paragraphs.push(["Изменения между двумя выборами",t]);
 }
 const hot=auxFirst.length>0, rejected=mainLast.length>0;
 t="В целом профиль отличает ведущая пара «"+topNames+"» и отнесение «"+endNames+"» к наименее предпочитаемым. ";
 if(hot&&rejected)t+="Дополнительные цвета в начале и основные цвета ближе к концу формируют контрастную структуру предпочтений: при обсуждении результата стоит учитывать, почему темы "+auxFirst.map(x=>COLOR_THEMES[x].trait).join(" и ")+" стали наиболее актуальны.";
 else if(hot)t+="Особенность выбора – присутствие дополнительных цветов в ведущей паре, что смещает акцент с четырех базовых потребностей на индивидуально значимые темы.";
 else if(rejected)t+="Ведущая пара относится к основным цветам, однако один или несколько основных цветов оказались среди последних трех позиций: такая неоднородность важнее, чем оценка любого одного цвета.";
 else t+="Четыре основных цвета располагаются до последних трех позиций, а в ведущей паре нет дополнительных; профиль в целом ориентирован на базовые тематические предпочтения.";
 t+=" Это индивидуальный порядок цветовых предпочтений на момент обследования, а не прямое измерение постоянных черт личности.";
 paragraphs.push(["Обобщенный анализ",t]);
 const summary=[
  {label:"Ведущая пара (++):",value:topNames,detail:hasSecond?"по второму выбору":"по первому выбору"},
  {label:"Последняя пара (--):",value:endNames,detail:"наименее предпочитаемые"},
  {label:"Основные цвета в позициях 1-4:",value:mainTop.length+" из 4",detail:mainTop.map(name).join(", ")||"отсутствуют"},
  {label:hasSecond?"Изменения при повторе:":"Формат:",value:hasSecond?changes.length+" из 8":"1 выбор",detail:hasSecond?(largest.length?largest.map(x=>name(x.id)+" "+x.from+" → "+x.to).join("; "):"Порядок полностью совпал"):"Без повторного предъявления"}
 ];
 return {summary,paragraphs,selected:r,groups:a.groups,changes:a.shifts};
}
function manualSummary(p){
 const fields=state.variant==="full"?FULL_TABLES:FIGURE_FIELDS;
 const done=fields.map(([title],i)=>({title,i,text:String(p.manual?.[i]||"").trim()})).filter(x=>x.text);
 const missing=fields.filter((x,i)=>!String(p.manual?.[i]||"").trim()).map(x=>x[0]);
 const intro=state.variant==="full"?"Зарегистрированы ответы по "+done.length+" из семи таблиц полного варианта. "+
  (done.length?"Заполнены разделы: "+done.map(x=>x.title).join(", ")+". ":"")+
  (missing.length?"Остались незаполненными: "+missing.join(", ")+". ":"")+
  "Доступные записи позволяют сохранить последовательность предъявления, но без официального ключа конкретной редакции из них нельзя вычислить клинические показатели.":
  "Зарегистрированы ответы по "+done.length+" из четырех разделов теста фигур. "+
  (done.length?"Заполнены: "+done.map(x=>x.title).join(", ")+". ":"")+
  (missing.length?"Пока не внесены: "+missing.join(", ")+". ":"")+
  "Можно сопоставить обозначения предпочитаемых и отвергнутых фигур по оригинальному протоколу; значения геометрических стимулов по одному номеру здесь не реконструируются.";
 return {done,missing,intro,fields};
}

function analysisHTML(p){
 if(isManual()){
  const a=manualSummary(p),defs=a.fields;
  return '<section class="brief-results"><h3>Краткие результаты</h3><div class="brief-grid">'+
    '<article class="brief-result"><span>Вариант</span><strong>'+escapeHTML(VERSIONS[state.variant].title)+'</strong></article>'+
    '<article class="brief-result"><span>Заполнено разделов</span><strong>'+a.done.length+' из '+defs.length+'</strong></article>'+
   '</div></section>'+
   '<section class="individual-analysis"><h3>Анализ протокола</h3><p>'+escapeHTML(a.intro)+'</p></section>'+
   '<details class="protocol-details"><summary>Показать все зарегистрированные ответы</summary><div class="protocol-inner">'+
    defs.map(([title],i)=>'<div class="analysis-block"><h3>'+(i+1)+'. '+escapeHTML(title)+'</h3><p>'+(p.manual[i]?safeValue(p.manual[i]):"Не заполнено")+'</p></div>').join("")+
   '</div></details>';
 }
 const a=analyze(p),report=buildInterpretation(p);
 const row=(items,title)=>'<div class="analysis-block"><h3>'+title+'</h3><div class="result-ordered">'+rankHTML(items)+'</div></div>';
 let h='<section class="brief-results"><h3>Краткие результаты</h3><div class="brief-grid">'+
  report.summary.map(x=>'<article class="brief-result"><span>'+escapeHTML(x.label)+'</span><strong>'+escapeHTML(x.value)+'</strong><small>'+escapeHTML(x.detail)+'</small></article>').join("")+
  '</div></section>';
 h+='<section class="individual-analysis"><h3>Индивидуальный анализ</h3>'+
  report.paragraphs.map(([heading,body])=>'<div class="analysis-paragraph"><h4>'+escapeHTML(heading)+'</h4><p>'+escapeHTML(body)+'</p></div>').join("")+
  '</section>';
 h+='<details class="protocol-details"><summary>Подробный протокол: все позиции и цветовые пары</summary><div class="protocol-inner">';
 if(p.first.length===8)h+=row(p.first,"Первый выбор");
 if(p.second.length===8)h+=row(p.second,"Повторный выбор");
 h+='<div class="analysis-block"><h3>Позиционные группы '+(p.second.length===8?"второго":"первого")+' выбора</h3><div class="analysis-grid">'+a.groups.map(g=>'<article class="analysis-tile"><strong>'+escapeHTML(g[0])+' · '+g[2]+'</strong><p>'+g[1].map(name).join(" – ")+'</p></article>').join("")+'</div></div>';
 if(a.shifts.length)h+='<div class="analysis-block"><h3>Изменения между двумя выборами</h3><table><thead><tr><th>Цвет</th><th>Первый</th><th>Второй</th><th>Изменение</th></tr></thead><tbody>'+a.shifts.map(x=>'<tr><td>'+x.name+'</td><td>'+x.from+'</td><td>'+x.to+'</td><td>'+ (x.delta===0?"0":(x.delta>0?"+":"")+x.delta)+'</td></tr>').join("")+'</tbody></table></div>';
 if(state.variant==="conflict")h+='<div class="analysis-block"><h3>Особенности позиционного распределения</h3><p>'+ (a.selected.slice(0,2).some(x=>["0","6","7"].includes(x))?"Среди двух ведущих цветов представлены серый, коричневый или черный.":"Серый, коричневый и черный не входят в ведущую пару.")+' '+(a.selected.slice(6).some(x=>["1","2","3","4"].includes(x))?"Один или несколько основных цветов находятся в последней паре.":"Основные цвета не попали в последнюю пару.")+'</p></div>';
 h+='</div></details>';
 return h;
}
function printOrExport(){
 const p=person();if(!p)return [];
 const lines=[VERSIONS[state.variant].title,"Участник: "+p.name+(p.age?", "+p.age+" лет":"")+(state.group?", "+state.group:"")];
 if(!isManual()){
  const report=buildInterpretation(p),a=analyze(p);
  lines.push("КРАТКИЕ РЕЗУЛЬТАТЫ");
  report.summary.forEach(x=>lines.push(x.label+" "+x.value+". "+x.detail));
  lines.push("ИНДИВИДУАЛЬНЫЙ АНАЛИЗ");
  report.paragraphs.forEach(([heading,body])=>lines.push(heading+": "+body));
  lines.push("ПОЛНЫЙ ПРОТОКОЛ");
  if(p.first.length)lines.push("Первый выбор: "+p.first.map(name).join(", "));
  if(p.second.length)lines.push("Второй выбор: "+p.second.map(name).join(", "));
  a.groups.forEach(g=>lines.push(g[0]+" ("+g[2]+"): "+g[1].map(name).join(", ")));
  if(a.shifts.length)lines.push(...a.shifts.map(x=>x.name+": "+x.from+" → "+x.to));
 }else{
  const a=manualSummary(p);
  lines.push("КРАТКИЕ РЕЗУЛЬТАТЫ","Заполнено разделов: "+a.done.length+" из "+a.fields.length,"АНАЛИЗ ПРОТОКОЛА",a.intro,"ЗАПИСАННЫЕ ОТВЕТЫ");
  a.fields.forEach(([label],i)=>lines.push(label+": "+(p.manual[i]||"Не заполнено")));
 }
 return lines;
}
function showReport(){
 const p=person();if(!p||!completed(p))return;
 p.showReport=true;$("choiceStage").hidden=true;$("manualStage").hidden=true;$("reportStage").hidden=false;
 $("stageTitle").textContent="Результаты";$("stageHelp").textContent="Протокол выбранной версии.";
 $("reportContent").innerHTML=analysisHTML(p);
 $("personStatus").textContent="Результаты заполнены";
 save();
}
function renderGroup(){
 $("groupSummary").hidden=state.mode!=="group"||!state.people.length;if($("groupSummary").hidden)return;
 $("groupSummary").innerHTML='<h2>Сводка по участникам</h2><p class="muted">Группа: '+escapeHTML(state.group||"не указана")+'. Протоколы показываются отдельно для каждого человека.</p><table><thead><tr><th>Участник</th><th>Вариант</th><th>Заполнение</th><th>Ведущие цвета</th></tr></thead><tbody>'+state.people.map(p=>'<tr><td>'+escapeHTML(p.name)+'</td><td>'+escapeHTML(VERSIONS[state.variant].title)+'</td><td>'+(completed(p)?"Заполнено":"В работе")+'</td><td>'+(p.second.length?p.second:p.first).slice(0,2).map(name).join(", ")+'</td></tr>').join("")+'</tbody></table>';
}
function render(){
 if(!state.variant)return;
 $("versionScreen").hidden=true;$("workspace").hidden=false;
 $("versionTitle").textContent=VERSIONS[state.variant].title;$("versionDescription").textContent=VERSIONS[state.variant].description;
 $("groupName").value=state.group;document.querySelectorAll("[data-mode]").forEach(x=>x.classList.toggle("active",x.dataset.mode===state.mode));
 renderPeople();
 const p=person();if(!p)return;
 $("personTitle").textContent=p.name+(p.age?" · "+p.age+" лет":"");
 if(p.showReport&&completed(p))showReport();else if(isManual())manualFields();else renderChoice();
}
function next(){
 const p=person();if(!p)return;
 const row=p.pass===0?p.first:p.second;
 if(row.length!==8)return;
 if(isDouble()&&p.pass===0){p.pass=1;save();render();return;}
 showReport();
}
function reset(){
 const p=person();if(!p)return;
 if(p.pass===0)p.first=[];else p.second=[];
 p.showReport=false;save();render();
}
function edit(){
 const p=person();if(!p)return;p.showReport=false;save();render();
}
function createZip(files){
 const enc=new TextEncoder(),u16=n=>[n&255,n>>>8&255],u32=n=>[n&255,n>>>8&255,n>>>16&255,n>>>24&255];
 const crc=data=>{let c=0xffffffff;for(const b of data){c^=b;for(let i=0;i<8;i++)c=c>>>1^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;};
 let offset=0;const bodies=[],center=[];
 for(const [filename,content] of files){
  const name=enc.encode(filename),data=enc.encode(content),check=crc(data);
  const head=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(2048),...u16(0),...u16(0),...u16(0),...u32(check),...u32(data.length),...u32(data.length),...u16(name.length),...u16(0),...name]);
  bodies.push(head,data);
  center.push(new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(2048),...u16(0),...u16(0),...u16(0),...u32(check),...u32(data.length),...u32(data.length),...u16(name.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...name]));
  offset+=head.length+data.length;
 }
 const length=center.reduce((x,a)=>x+a.length,0),end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(length),...u32(offset),...u16(0)]);
 return new Blob([...bodies,...center,end],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
}
function downloadWord(){
 const p=person();if(!p||!completed(p))return;
 const esc=t=>String(t).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
 const body=printOrExport().map(t=>'<w:p><w:r><w:t xml:space="preserve">'+esc(t)+'</w:t></w:r></w:p>').join("");
 const doc='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/></w:sectPr></w:body></w:document>';
 const files=[
  ["[Content_Types].xml",'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
  ["_rels/.rels",'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
  ["word/document.xml",doc]
 ];
 const url=URL.createObjectURL(createZip(files)),link=document.createElement("a");
 link.href=url;link.download=("Люшер_"+p.name+"_"+state.variant).replace(/[\\/:*?"<>|]/g,"_")+".docx";
 document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
document.querySelectorAll("[data-version]").forEach(b=>b.addEventListener("click",()=>selectVariant(b.dataset.version)));
document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>{state.mode=b.dataset.mode;save();render();}));
$("backVersions").addEventListener("click",()=>{state.chooser=true;save();$("workspace").hidden=true;$("versionScreen").hidden=false;});
$("groupName").addEventListener("input",e=>{state.group=e.target.value;save();});
$("addPerson").addEventListener("click",newPerson);
$("personAge").addEventListener("keydown",e=>{if(e.key==="Enter")newPerson();});
$("people").addEventListener("click",e=>{const b=e.target.closest("[data-person]");if(!b)return;state.index=Number(b.dataset.person);save();render();});
$("removePerson").addEventListener("click",()=>{const p=person();if(!p||!confirm("Удалить участника «"+p.name+"» и его результаты?"))return;state.people.splice(state.index,1);state.index=Math.max(0,Math.min(state.index,state.people.length-1));save();render();});
$("colorGrid").addEventListener("click",e=>{const b=e.target.closest("[data-color]"),p=person();if(!b||!p)return;const row=p.pass===0?p.first:p.second;if(row.includes(b.dataset.color)||row.length>=8)return;row.push(b.dataset.color);save();renderChoice();});
$("goNext").addEventListener("click",next);
$("resetChoice").addEventListener("click",reset);
$("manualFields").addEventListener("input",e=>{const el=e.target.closest("[data-field]"),p=person();if(!el||!p)return;p.manual[el.dataset.field]=el.value;save();$("personStatus").textContent="Заполнено разделов: "+Object.values(p.manual).filter(Boolean).length;});
$("saveManual").addEventListener("click",()=>{if(!completed(person())){setError("Заполните хотя бы одну таблицу.");return;}showReport();});
$("editResponses").addEventListener("click",edit);
$("word").addEventListener("click",downloadWord);
$("print").addEventListener("click",()=>{const p=person();if(!p)return;$("printRoot").innerHTML='<div class="print-sheet"><h2>Тест Люшера · '+escapeHTML(VERSIONS[state.variant].title)+'</h2><p>'+escapeHTML(p.name)+'</p>'+analysisHTML(p)+'</div>';window.print();});
$("theme").addEventListener("click",()=>{document.documentElement.classList.toggle("dark");const dark=document.documentElement.classList.contains("dark");$("theme").textContent=dark?"Светлая тема":"Темная тема";try{sessionStorage.setItem("metolaria_luscher_dark",dark?"1":"0");}catch(_){};});
try{if(sessionStorage.getItem("metolaria_luscher_dark")==="1"){document.documentElement.classList.add("dark");$("theme").textContent="Светлая тема";}}catch(_){}
if(state.variant&&!state.chooser)render();
window.PSY_LUSCHER_TEST={analyze,versions:VERSIONS,colors:COLORS};
})();