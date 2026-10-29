"use strict";
(() => {
 const name="Домики О. А. Ореховой";
 window.PSY_FULL_METHODS=window.PSY_FULL_METHODS||{};
 window.PSY_FULL_METHODS[name]={
   id:"orekhova-houses-eight", workflow:"orekhovaHouses8", author:"О. А. Орехова",
   age:"5-12 лет",kind:"Цветоассоциативная методика",count:"3 задания, 8 цветов",
   goal:"Диагностика эмоциональной сферы ребенка: цветовые предпочтения, социальные эмоции и отношение к школьным ситуациям.",
   instructions:"Раскрась цветовую дорожку, выбирая цвета по порядку предпочтения. Затем раскрась домики чувств и школьных ситуаций. Для последнего домика придумай свою ситуацию и расскажи о ней специалисту.",
   source:"https://elib.kspu.ru/get/174453", calculator:true,
   printFormat:"A4"
 };
 const escaping=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const house=i=>'<svg viewBox="0 0 92 96" role="img" aria-label="Домик '+i+'" width="82" height="84"><path d="M8 41L46 9 84 41" fill="none" stroke="#40584b" stroke-width="2.3"/><path d="M17 35L46 11 75 35V87H17Z" fill="white" stroke="#40584b" stroke-width="2"/><text x="46" y="67" font-size="15" text-anchor="middle" fill="#40584b">'+i+'</text></svg>';
 const blank=()=>{
   const rows='<section class="or-print-section"><h3>Задание 1</h3><div class="or-print-rectangles">'+Array.from({length:8},(_,i)=>'<div>'+(i+1)+'</div>').join("")+'</div></section>'+
   [2,3].map(step=>'<section class="or-print-section"><h3>Задание '+step+'</h3><div class="or-print-houses">'+Array.from({length:10},(_,i)=>house(i+1)).join("")+'</div></section>').join("");
   return '<div class="or-print-form"><p>Фамилия, имя: ____________________________________ Класс: __________ Дата: __________</p>'+rows+'<p>Последний домик: ______________________________________________________________________</p></div>';
 };
 function guide(){
  return '<div class="psy-common-guide-head"><h3>Методика и руководство</h3><div class="psy-common-guide-actions"><button type="button" class="btn" data-generic-print="guide">Без бланка</button><button type="button" class="btn primary" data-generic-print="combined">С бланком</button></div></div>'+
   '<h3>Цель</h3><p>Изучение эмоциональной сферы ребенка, отношений и ценностных ориентаций с помощью цветовых ассоциаций.</p>'+
   '<h3>Материалы</h3><p>Бланк с 8 прямоугольниками и 20 домиками; 8 карандашей: синий, зеленый, красный, желтый, фиолетовый, коричневый, серый, черный.</p>'+
   '<h3>Инструкция для ребенка</h3><blockquote class="kid-instruction">Сначала выбери наиболее приятный цвет и раскрась им первый прямоугольник. Отложи карандаш. Из оставшихся выбери самый приятный и раскрась второй прямоугольник. Продолжай до последнего прямоугольника.</blockquote>'+
   '<h3>Ход проведения</h3><ol>'+
   '<li>Раскрасить 8 прямоугольников по порядку предпочтения без повторов.</li>'+
   '<li>Раскрасить домики чувств: счастье, горе, справедливость, обида, дружба, ссора, доброта, злоба, скука, восхищение. Повторы цветов разрешены.</li>'+
   '<li>Раскрасить 10 домиков школьных ситуаций: я сам, дорога в школу, чтение, письмо, математика, учитель, одноклассники, дом, домашние задания и придуманная ребенком ситуация. После десятого домика записать объяснение ребенка.</li></ol>'+
   '<h3>Ключ и обработка</h3><p>Места цветов в первой дорожке нумеруются от 1 до 8. ВК = (18 - место красного - место синего) / (18 - место синего - место зеленого). СО = сумма абсолютных отклонений мест цветов от аутогенной последовательности: красный, желтый, зеленый, фиолетовый, синий, коричневый, серый, черный.</p>'+
   '<h3>Интерпретация</h3><p>ВК: 0-0,50 – выраженная усталость; 0,51-0,91 – компенсируемая усталость; 0,92-2,00 – оптимальная работоспособность. СО: менее 10 – положительный эмоциональный фон; 10-18 – обычный; более 20 – отрицательный. СО = 20 и ВК свыше 2,00 оставлены без автоматической категории.</p>'+
   '<p>Сопоставляйте цвета в противоположных парах эмоций и в школьных ситуациях. Цветовое совпадение само по себе не устанавливает диагноз, необходима беседа.</p>'+
   '<p>Основание: <a target="_blank" rel="noopener noreferrer" href="https://elib.kspu.ru/get/174453">публикация методических материалов</a>. Для иной редакции не переносите автоматически правила обработки.</p>';
 }
 function materials(){
  return '<h3>Бланк ребенка</h3><p>Бланк для печати А4. Названия эмоций и ключ не печатаются на детском листе.</p><div class="or-portfolio-preview">'+blank()+'</div>';
 }
 function print(mode){
  const printed=(mode==="guide"?'<h1>Методика «Домики» О. А. Ореховой</h1>'+guide().replace(/<div class="psy-common-guide-head">[\s\S]*?<\/div><\/div>/,''):mode==="blank"?blank():'<h1>Методика «Домики» О. А. Ореховой</h1>'+guide().replace(/<div class="psy-common-guide-head">[\s\S]*?<\/div><\/div>/,'')+'<div style="break-before:page"></div>'+blank());
  const win=window.open("","_blank");
  if(!win){window.alert("Разрешите всплывающее окно для печати.");return;}
  win.document.write('<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Домики Ореховой · А4</title><style>@page{size:A4;margin:13mm}body{font:11pt/1.4 Arial;color:#192c20}.or-print-form{max-width:180mm}.or-print-form p{font-size:10pt}.or-print-section{margin:8mm 0 10mm}.or-print-section h3{margin:0 0 4mm}.or-print-rectangles{display:grid;grid-template-columns:repeat(8,1fr);gap:3mm}.or-print-rectangles>div{height:13mm;border:1px solid #333;text-align:center}.or-print-houses{display:grid;grid-template-columns:repeat(5,1fr);gap:5mm;justify-items:center}.or-print-houses svg{width:25mm;height:27mm}blockquote{margin:2mm 0;padding:2mm 6mm;border-left:2px solid #555}h1{font-size:16pt}h3{font-size:12pt}p,li{font-size:10pt}a{color:#222}.psy-common-guide-head{display:none}</style></head><body>'+printed+'</body></html>');
  win.document.close();win.focus();win.print();
 }
 window.PSY_OREKHOVA_PORTFOLIO={guide,materials,print};
})();
