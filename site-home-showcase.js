
"use strict";
/* Визуальные фрагменты реальной библиотеки вместо декоративных списков.
   Только главная страница; карточки методик и их файлы не меняются. */
(function(){
 const root=document.getElementById("siteHome");
 if(!root)return;
 const oldHero=root.querySelector(".psy-library-preview");
 if(oldHero){
  oldHero.outerHTML=`<div class="psy-showcase-window">
   <div class="psy-showcase-head"><span class="psy-showcase-dots" aria-hidden="true"><i></i><i></i><i></i></span><strong>Библиотека изнутри</strong><span>Реальный интерфейс</span></div>
   <div class="psy-frame-window" aria-label="Фрагмент школьного каталога">
    <iframe loading="lazy" data-psy-library-preview="school" title="Карточки школьных методик" src="library.html?area=school" tabindex="-1" aria-hidden="true"></iframe>
   </div>
   <div class="psy-showcase-bottom"><span>Карточки методик и их авторы</span><a href="library.html?area=school">Открыть каталог ↗</a></div>
  </div>`;
 }
 const oldInside=root.querySelector("#inside .psy-preview-wrap");
 if(oldInside){
  oldInside.classList.add("psy-screens-section");
  oldInside.innerHTML=`<div class="psy-preview-intro">
    <div class="kicker">Библиотека в работе</div>
    <h2>Посмотрите на настоящие экраны</h2>
    <p>Каталог, портфолио и дошкольные материалы. Здесь показаны реальные страницы сайта, а не нарисованные макеты.</p>
    <a class="site-btn small" href="library.html?area=school">Перейти в библиотеку →</a>
   </div>
   <div class="psy-preview-screens">
    <article class="psy-screen-card">
     <div class="psy-screen-canvas"><iframe loading="lazy" data-psy-library-preview="school" src="library.html?area=school" title="Каталог школьных методик" tabindex="-1" aria-hidden="true"></iframe></div>
     <div class="psy-screen-meta"><div><strong>Каталог методик</strong><span>Темы, карточки, авторы</span></div><a href="library.html?area=school" aria-label="Открыть школьный каталог">↗</a></div>
    </article>
    <article class="psy-screen-card">
     <div class="psy-screen-canvas"><iframe loading="lazy" data-psy-library-preview="portfolio" src="library.html?area=school" title="Портфолио таблиц Шульте" tabindex="-1" aria-hidden="true"></iframe></div>
     <div class="psy-screen-meta"><div><strong>Портфолио</strong><span>Назначение, возраст, руководство</span></div><a href="library.html?area=school" aria-label="Открыть портфолио">↗</a></div>
    </article>
    <article class="psy-screen-card">
     <div class="psy-screen-canvas"><iframe loading="lazy" data-psy-library-preview="preschool" src="library.html?area=preschool" title="Каталог детского сада" tabindex="-1" aria-hidden="true"></iframe></div>
     <div class="psy-screen-meta"><div><strong>Детский сад</strong><span>Наблюдение и игровая диагностика</span></div><a href="library.html?area=preschool" aria-label="Открыть детский сад">↗</a></div>
    </article>
   </div>`;
 }
 const style=document.createElement("link");
 style.rel="stylesheet";style.href="site-home-showcase.css?v=20261026showcase4";
 document.head.appendChild(style);
 // Удаляем декоративные списки и включаем наглядные фрагменты настоящих страниц.
 const frames=[...root.querySelectorAll("iframe[data-psy-library-preview]")];
 function align(frame){
  let doc,win;try{win=frame.contentWindow;doc=frame.contentDocument}catch(_){return}
  if(!win||!doc)return;
  const area=frame.dataset.psyLibraryPreview;
  if(area==="portfolio"){
   const method=(win.PSY_CATALOG||[]).find(m=>m.name==="Таблицы Шульте");
   if(method&&typeof win.openMethod==="function")win.openMethod(method);
   win.scrollTo({top:0,behavior:"instant"});
   return;
  }
  const target=area==="preschool"?
   doc.querySelector("#preschoolView .subbar, #preschoolView .preschool-subbar, #preschoolView"):
   doc.querySelector("#schoolView .subbar, #schoolView .catalog, #schoolView");
  if(!target)return;
  const scroll=()=>{const y=target.getBoundingClientRect().top+(win.scrollY||0);win.scrollTo({top:Math.max(0,y-25),behavior:"instant"});};
  scroll();win.requestAnimationFrame(scroll);
 }
 frames.forEach(frame=>frame.addEventListener("load",()=>align(frame)));
})();
