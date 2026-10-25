"use strict";
/* Batch 03: finish EXISTING source-backed diagnostic cards. No new catalog entries. */
(function(){
const D=window.PSY_FULL_METHODS;
const r=D["Шкала самооценки Розенберга (RSES)"];
if(!r)throw new Error("Missing existing Rosenberg card");
Object.assign(r,{
 workflow:"diagnostic03",
 diagnosticType:"rses",
 age:"Подростки (ориентировочно от 12 лет) и взрослые; проверяйте пригодность русской версии",
 source:"https://socy.umd.edu/about-us/using-rosenberg-self-esteem-scale",
 officialBlank:"https://socy.umd.edu/about-us/using-rosenberg-self-esteem-scale",
 sourceScoring:"https://socy.umd.edu/about-us/using-rosenberg-self-esteem-scale",
 license:"Шкала Розенберга (10 пунктов) находится в общественном достоянии; Университет Мэриленда прямо разрешает переводы. Представленный русский рабочий перевод не имеет подтвержденных возрастных норм.",
 interpret:"От 0 до 30 баллов, чем больше, тем выше общая самооценка по данной схеме ключа. Универсальных точек разделения низкой и высокой самооценки Университет Мэриленда не утверждает. Нельзя по одному результату диагностировать расстройство или присваивать «уровень» без норм конкретной популяции.",
 scope:"Общее отношение к себе (без фиксированного временного периода)"
});
const parent={
 id:"parent",name:"Форма для родителей – первичная (2002)",
 count:55,performanceStart:48,performanceEnd:55,
 groups:[
 {id:"inattention",name:"Невнимательность",start:1,end:9,cutoff:6},
 {id:"hyperactivity",name:"Гиперактивность / импульсивность",start:10,end:18,cutoff:6},
 {id:"oppositional",name:"Оппозиционное поведение",start:19,end:26,cutoff:4},
 {id:"conduct",name:"Нарушения поведения",start:27,end:40,cutoff:3},
 {id:"anxiety",name:"Тревога / депрессивные проявления",start:41,end:47,cutoff:3}
 ]};
const teacher={
 id:"teacher",name:"Форма для учителя – первичная (2002)",
 count:43,performanceStart:36,performanceEnd:43,
 groups:[
 {id:"inattention",name:"Невнимательность",start:1,end:9,cutoff:6},
 {id:"hyperactivity",name:"Гиперактивность / импульсивность",start:10,end:18,cutoff:6},
 {id:"oppositional",name:"Оппозиционные / поведенческие проявления",start:19,end:28,cutoff:3},
 {id:"anxiety",name:"Тревога / депрессивные проявления",start:29,end:35,cutoff:3}
 ]};
D["Vanderbilt Assessment Scales"]={
 author:"NICHQ / American Academy of Pediatrics; на основе шкал M. L. Wolraich",
 age:"6-12 лет; версия NICHQ (первое издание 2002 года)",
 kind:"Рейтинговая шкала для родителей и учителей",
 count:"55 пунктов для родителей или 43 пункта для учителей (первичные формы)",
 goal:"Скрининг симптомов невнимательности, гиперактивности, сопутствующих проявлений и трудностей функционирования по данным взрослых, которые наблюдают ребенка.",
 instructions:"Заполните официальную форму NICHQ для родителя либо учителя. При оценке симптомов выберите 0 – никогда, 1 – иногда, 2 – часто, 3 – очень часто. Для показателей функционирования используйте отдельную шкалу от 1 до 5.",
 questions:Array.from({length:55},(_,i)=>"Пункт "+(i+1)+" официальной родительской формы"),
 options:["0 – никогда","1 – иногда","2 – часто","3 – очень часто"],
 scoring:"Для каждой симптомной группы подсчитайте ответы 2 или 3. Учитывайте минимум один показатель функционирования 4 или 5. Для невнимательности и гиперактивности порог – 6 из 9 симптомов. Для других групп ключ зависит от формы, указан в официальном руководстве NICHQ. Сумма ответов по вопросам 1-18 используется как дополнительный количественный показатель (0-54).",
 interpret:"Сайт показывает число выраженных симптомов, трудности функционирования и совпадение с правилами скрининга NICHQ 2002. Это не диагноз СДВГ либо иных расстройств. Для оценки необходимы сведения родителей и учителей, клиническое интервью и оценка контекста. Не переносите ключи первого издания на другие версии.",
 source:"https://nichq.org/downloadable/nichq-vanderbilt-assessment-scales/",
 officialBlank:"https://nichq.org/wp-content/uploads/2024/09/NICHQ-Vanderbilt-Assessment-Scales.pdf",
 sourceScoring:"https://nichq.org/wp-content/uploads/2024/09/NICHQ-Vanderbilt-Assessment-Scales.pdf#page=10",
 license:"©2002 American Academy of Pediatrics и NICHQ. Оригинальный PDF бесплатно опубликован NICHQ; полный текст пунктов не копируется на «Психотеку». Используйте оригинал из источника, с указанием авторства. Встроена обработка только первичных форм, не follow-up.",
 originalLanguage:"Оригинал: английский. Русский стандартизированный бланк здесь не предоставляется.",
 scope:"Родители: за последние 6 месяцев. Учитель: с начала учебного года (с указанием срока наблюдения).",
 variants:[parent,teacher],
 category:"school",workflow:"diagnostic03",diagnosticType:"vanderbilt",calculator:true
};
})();