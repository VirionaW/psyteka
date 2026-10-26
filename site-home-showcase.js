"use strict";
/* Фрагменты настоящей библиотеки на главной странице.
 * Кадры загружаются лениво, без сторонних сервисов и фальшивых скриншотов.
 * Встраиваемые страницы остаются локальными – ссылки ведут в саму библиотеку.
 */
(function(){
 const root=document.getElementById("siteHome");
 if(!root)return;
 const frames=[...root.querySelectorAll("iframe[data-psy-library-preview]")];
 if(!frames.length)return;
 function frameView(frame){
  let doc,win;
  try{win=frame.contentWindow;doc=frame.contentDocument}catch(_){return}
  if(!win||!doc)return;
  const area=frame.dataset.psyLibraryPreview||"school";
  let target;
  if(area==="preschool")target=doc.querySelector("#preschoolView .subbar, #preschoolView .preschool-subbar, #preschoolView");
  else target=doc.querySelector("#schoolView .subbar, #schoolView .catalog, #schoolView");
  // Вставленный фрагмент начинается с карточек, а не с огромного баннера.
  const scroll=()=>{
   if(!target)return;
   const y=target.getBoundingClientRect().top+(win.scrollY||0);
   win.scrollTo({top:Math.max(0,y-22),behavior:"instant"});
  };
  scroll();
  // Скрипты разделов обновляют интерфейс синхронно; один дополнительный кадр
  // устраняет смещение при появлении карточек после загрузки.
  win.requestAnimationFrame(scroll);
 }
 frames.forEach(frame=>frame.addEventListener("load",()=>frameView(frame)));
})();
