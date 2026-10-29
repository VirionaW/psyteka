"use strict";
(() => {
 const name="Домики О. А. Ореховой";
 window.PSY_FULL_METHODS[name]=Object.assign(window.PSY_FULL_METHODS[name]||{},{
   id:"orekhova-houses-eight",workflow:"orekhovaHouses8",
   author:"О. А. Орехова",age:"Старший дошкольный и младший школьный возраст",
   kind:"Проективная методика",count:"3 задания: 8 прямоугольников и 20 домиков",
   goal:"Диагностика эмоциональной сферы ребенка в части высших эмоций социального генеза, личностных предпочтений и деятельностных ориентаций.",
   instructions:"Сегодня мы будем заниматься раскрашиванием. В первом задании раскрасьте дорожку из восьми прямоугольников в порядке предпочтения цветов, откладывая каждый использованный карандаш. Во втором задании раскрасьте домики чувств. В третьем задании раскрасьте домики школьных ситуаций и придумайте, кто живет в десятом домике.",
   calculator:true,printFormat:"A4",
   source:"https://elib.kspu.ru/get/174453"
 });
 const house=i=>'<div class="or-house"><svg viewBox="0 0 100 95" role="img" aria-label="Домик '+i+'">'+
   '<path d="M5 42L39 13L57 27V14H68V36L85 42H5Z" fill="#ffffff" stroke="#343d35" stroke-width="2.1" stroke-linejoin="round"/>'+
   '<path d="M15 42H76V87H15Z" fill="#ffffff" stroke="#343d35" stroke-width="2.1"/>'+
   '<path d="M33 62H53V87H33Z" fill="none" stroke="#343d35" stroke-width="2.1"/></svg><span>'+i+'</span></div>';
 const blank=()=>{
  const one='<section class="or-print-section"><h3>1 задание</h3><div class="or-print-rectangles">'+Array.from({length:8},(_,i)=>'<div><span>'+(i+1)+'</span></div>').join("")+'</div></section>';
  const two=[2,3].map(step=>'<section class="or-print-section"><h3>'+step+' задание</h3><div class="or-print-houses">'+Array.from({length:10},(_,i)=>house(i+1)).join("")+'</div></section>').join("");
  return '<div class="or-print-form"><h3>Бланк к методике «Домики» О. А. Ореховой</h3><p>Фамилия, имя: _____________________________________________________________</p><p>Класс: __________ Возраст: __________ Дата: __________</p>'+one+two+'<p class="or-last-house-line">В последнем домике живет ______________________________________________________</p></div>';
 };
 const instructions=[
  "Сегодня мы будем заниматься раскрашиванием. Найдите в своем листочке задание № 1. Это дорожка из восьми прямоугольников. Выберите тот карандаш, который вам приятен больше всего, и раскрасьте первый прямоугольник. Отложите этот карандаш в сторону. Посмотрите на оставшиеся карандаши. Какой из них вам больше нравится? Раскрасьте им второй прямоугольник. Отложите карандаш в сторону. И так далее.",
  "Найдите задание № 2. Перед вами домики, их целая улица. В них живут наши чувства. Я буду называть чувства, а вы подберите к ним подходящий цвет и раскрасьте. Карандаши откладывать не надо. Можно раскрашивать тем цветом, который, по-вашему, подходит.",
  "Найдите задание № 3. В этих домиках мы делаем что-то особенное, и жильцы в них необычные. В первом домике живет твоя душа. Какой цвет ей подходит? Раскрасьте. В десятом домике придумайте сами, кто живет и что делает. Когда закончите раскрашивать, расскажите мне, кто там живет и что он делает."
 ];
 const EMOTIONS=["Счастье","Горе","Справедливость","Обида","Дружба","Ссора","Доброта","Злоба","Скука","Восхищение"];
 const SITUATIONS=["Душа ребенка","Настроение по дороге в школу","На уроке чтения","На уроке письма","На уроке математики","Разговор с учителем","Общение с одноклассниками","Когда находится дома","Когда делает уроки","Свободный домик"];
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 function guide(){
  return '<div class="psy-common-guide-head"><h3>Методика и руководство</h3><div class="psy-common-guide-actions"><button type="button" class="btn" data-generic-print="guide">Без бланка</button><button type="button" class="btn primary" data-generic-print="combined">С бланком</button></div></div>'+
   '<h3>Цель</h3><p>Диагностика эмоциональной сферы ребенка в части высших эмоций социального генеза, личностных предпочтений и деятельностных ориентаций.</p>'+
   '<h3>Возраст и форма</h3><p>Старший дошкольный и младший школьный возраст. Индивидуально либо в малых группах. Продолжительность – около 20 минут.</p>'+
   '<h3>Материалы</h3><p>Бланк с 8 прямоугольниками и 20 домиками. Восемь одинаковых карандашей: синий, красный, желтый, зеленый, фиолетовый, серый, коричневый, черный.</p>'+
   '<h3>Задание 1 – цветовая дорожка</h3><blockquote class="kid-instruction">'+esc(instructions[0])+'</blockquote>'+
   '<h3>Задание 2 – домики чувств</h3><blockquote class="kid-instruction">'+esc(instructions[1])+'</blockquote><p>Порядок предъявления: '+EMOTIONS.map((x,i)=>(i+1)+'. '+x).join('; ')+'.</p>'+
   '<h3>Задание 3 – домики ситуаций</h3><blockquote class="kid-instruction">'+esc(instructions[2])+'</blockquote><p>Порядок домиков: '+SITUATIONS.map((x,i)=>(i+1)+'. '+x).join('; ')+'. В последнем домике специалист записывает ответ ребенка о том, кто там живет и что делает.</p>'+
   '<h3>Обработка</h3><p><strong>ВК</strong> = (18 - место красного цвета - место синего цвета) / (18 - место синего цвета - место зеленого цвета). Места цветов считаются от 1 до 8.</p>'+
   '<p><strong>СО</strong> – сумма абсолютных разностей между местами цветов ребенка и аутогенной нормой 34251607: красный, желтый, зеленый, фиолетовый, синий, коричневый, серый, черный.</p>'+
   '<h3>Интерпретация ВК</h3><p>0-0,50 – хроническое переутомление; 0,51-0,91 – компенсируемая усталость; 0,92-1,90 – оптимальная работоспособность; свыше 2,00 – перевозбуждение. Значение 2,00 в представленном описании отдельно не определено.</p>'+
   '<h3>Интерпретация СО</h3><p>Менее 10 – преобладание положительных эмоций; 10-18 – эмоциональное состояние в норме; больше 20 – преобладание отрицательных эмоций. Значение 20 в представленном описании не отнесено к уровню.</p>'+
   '<h3>Качественный анализ</h3><p>Сравните парные чувства: счастье/горе, справедливость/обида, дружба/ссора, доброта/злоба, скука/восхищение. Затем сопоставьте цвета школьных ситуаций с выбранными цветами эмоций. Проективный результат не является самостоятельным диагнозом и требует беседы.</p>';
 }
 function materials(){return '<h3>Бланк</h3><p>Бланк ребенка для печати. Названия эмоций и интерпретация здесь не указаны.</p><div class="or-portfolio-preview">'+blank()+'</div>';}
 function print(mode){
  const htmlGuide='<h1>Проективная методика «Домики» О. А. Ореховой</h1>'+guide().replace(/<div class="psy-common-guide-head">[\s\S]*?<\/div><\/div>/,'');
  const contents=mode==="guide"?htmlGuide:mode==="blank"?blank():htmlGuide+'<div style="break-before:page"></div>'+blank();
  const w=window.open("","_blank");if(!w){window.alert("Разрешите всплывающее окно для печати.");return;}
  w.document.write('<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Домики Ореховой · А4</title><style>@page{size:A4;margin:12mm}body{font:10.5pt/1.4 Arial;color:#1d2d21}h1{font-size:15pt}h3{font-size:12pt}p,li{font-size:10pt}.psy-common-guide-head{display:none}.or-print-form>h3{text-align:center}.or-print-form{width:100%}.or-print-section{margin:16mm 0 18mm;break-inside:avoid}.or-print-section h3{text-align:center;margin:0 0 10mm}.or-print-rectangles{display:grid;grid-template-columns:repeat(8,1fr);gap:0;margin-bottom:10mm}.or-print-rectangles>div{position:relative;height:15mm;border:1px solid #333;border-right:0}.or-print-rectangles>div:last-child{border-right:1px solid #333}.or-print-rectangles span{position:absolute;top:16mm;left:0;right:0;text-align:center;font-weight:bold}.or-print-houses{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:0;justify-items:center}.or-house{width:100%;text-align:center}.or-house svg{display:block;width:100%;height:auto}.or-house span{font-weight:bold;font-size:9pt}.or-last-house-line{margin-top:13mm}</style></head><body>'+contents+'</body></html>');
  w.document.close();w.focus();w.print();
 }
 window.PSY_OREKHOVA_PORTFOLIO={guide,materials,print};
})();
