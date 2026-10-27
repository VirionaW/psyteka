"use strict";
/* Главная Психотеки: авторские иллюстрации сайта вместо iframe и скриншотов.
 * Только главная; библиотека, методики и их материалы не меняются. */
(function(){
 const root=document.getElementById("siteHome");
 if(!root)return;
 const hero=root.querySelector(".psy-library-preview, .psy-showcase-window");
 if(hero){
  hero.outerHTML=`<div class="psy-home-hero-art psy-home-ui" aria-label="Иллюстративный макет каталога Психотеки">
    <div class="psy-demo-window" aria-hidden="true">
      <div class="psy-demo-toolbar"><span class="psy-demo-traffic"><i></i><i></i><i></i></span><span class="psy-demo-browser-caption">Психотека / рабочая библиотека</span><span class="psy-demo-app-status"><i></i> Каталог</span></div>
      <div class="psy-demo-layout">
        <aside class="psy-demo-aside">
          <div class="psy-demo-brand"><span class="psy-demo-brandmark">✳</span><span>Психотека<small>Библиотека методик</small></span></div>
          <div class="psy-demo-aside-title">НАПРАВЛЕНИЯ</div>
          <span class="psy-demo-menu current"><span class="psy-demo-menu-symbol">▤</span> Школа</span>
          <span class="psy-demo-menu"><span class="psy-demo-menu-symbol">✿</span> Детский сад</span>
          <span class="psy-demo-menu"><span class="psy-demo-menu-symbol">◎</span> Взрослые</span>
          <div class="psy-demo-aside-line"></div>
          <div class="psy-demo-aside-title">МАТЕРИАЛЫ</div>
          <span class="psy-demo-menu"><span class="psy-demo-menu-symbol">▧</span> Документация</span>
        </aside>
        <div class="psy-demo-content">
          <div class="psy-demo-search"><svg viewBox="0 0 24 24" fill="none"><circle cx="10.7" cy="10.7" r="5.8" stroke="currentColor" stroke-width="2"/><path d="m15 15 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Поиск по методикам и авторам</span><span class="psy-demo-search-key">⌕</span></div>
          <div class="psy-demo-intro"><span>Школьные материалы</span><span>Подборка методик</span></div>
          <div class="psy-demo-pills"><span>Внимание</span><span>Мышление</span><span>Мотивация</span></div>
          <div class="psy-demo-method-row">
            <div class="psy-demo-method-glyph schulte"><svg viewBox="0 0 48 48" fill="none"><rect x="7" y="6" width="31" height="35" rx="4" stroke="currentColor" stroke-width="2"/><path d="M14 16h8m5 0h5M14 23h18M14 30h13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="34" cy="36" r="8" fill="#f8dfba" stroke="#ba956b" stroke-width="2"/><path d="M34 31v5l3 2" stroke="#866b48" stroke-width="2" stroke-linecap="round"/></svg></div>
            <div class="psy-demo-method-copy"><strong>Таблицы Шульте</strong><small>Исследование внимания</small><span>От 6 лет · Рабочий протокол</span></div>
            <span class="psy-demo-method-arrow">↗</span>
          </div>
          <div class="psy-demo-method-row">
            <div class="psy-demo-method-glyph family"><svg viewBox="0 0 48 48" fill="none"><path d="M6 22 24 8l18 14v18H6z" stroke="currentColor" stroke-width="2" fill="#fcf4e8"/><circle cx="18" cy="27" r="4" fill="#a0bfd0"/><circle cx="30" cy="27" r="4" fill="#deb1ae"/><path d="M11 39c0-6 3-9 7-9s7 3 7 9m-1 0c0-6 3-9 7-9s7 3 7 9" stroke="#6d9a85" stroke-width="2" stroke-linecap="round"/></svg></div>
            <div class="psy-demo-method-copy"><strong>Рисунок семьи</strong><small>Рисуночная методика</small><span>Инструкция · Бланк</span></div>
            <span class="psy-demo-method-arrow">↗</span>
          </div>
          <div class="psy-demo-foot"><span class="psy-demo-mini-dot"></span> Описания, бланки и обработка – в одном месте</div>
        </div>
      </div>
    </div>
    <div class="psy-demo-float" aria-hidden="true"><span class="psy-demo-float-icon">✓</span><span><strong>Продумано для практики</strong><small>От поиска до рабочего бланка</small></span></div>
  </div>`;
 }
 const inside=root.querySelector("#inside .psy-preview-wrap");
 if(inside){
  inside.classList.add("psy-home-gallery");
  inside.innerHTML=`<div class="psy-gallery-heading">
    <div class="psy-gallery-heading-copy"><div class="kicker">Внутри Психотеки</div><h2>Все под рукой для работы психолога</h2><p>Каталог для быстрого выбора, методические руководства и рабочие инструменты. Каждая задача – со своим удобным форматом.</p></div>
    <a class="site-btn small psy-gallery-action" href="library.html?area=school">Перейти в библиотеку <span aria-hidden="true">↗</span></a>
   </div>
   <div class="psy-gallery-grid psy-interface-gallery">
    <a class="psy-demo-gallery-card" href="library.html?area=school" aria-label="Открыть каталог школьных методик">
     <div class="psy-demo-gallery-visual psy-demo-gallery-search" aria-hidden="true">
      <div class="psy-demo-gallery-window">
       <div class="psy-demo-gallery-bar"><i></i><i></i><i></i><span>Каталог методик</span></div>
       <div class="psy-demo-gallery-input"><span>⌕</span><span>Найти методику...</span></div>
       <div class="psy-demo-gallery-tags"><i>Внимание</i><i>Мышление</i><i>Память</i></div>
       <div class="psy-demo-gallery-result"><b class="psy-demo-gallery-mini-icon">▦</b><span><strong>Таблицы Шульте</strong><small>Возраст · Инструкция · Бланк</small></span><em>↗</em></div>
       <div class="psy-demo-gallery-result"><b class="psy-demo-gallery-mini-icon">◇</b><span><strong>Простые аналогии</strong><small>Мышление · Методика</small></span><em>↗</em></div>
      </div>
     </div>
     <div class="psy-gallery-meta"><div><span class="psy-gallery-category">БЫСТРЫЙ ПОИСК</span><h3>Каталог методик</h3><p>Фильтры, возраст и авторы</p></div><span class="psy-gallery-link-mark" aria-hidden="true">↗</span></div>
    </a>
    <a class="psy-demo-gallery-card" href="cognitive-kit.html?method=schulte" aria-label="Открыть портфолио методики">
     <div class="psy-demo-gallery-visual psy-demo-gallery-portfolio" aria-hidden="true">
      <div class="psy-demo-gallery-sheet">
       <div class="psy-demo-gallery-sheet-top"><span>ПОРТФОЛИО МЕТОДИКИ</span><span>✳</span></div>
       <strong>Таблицы Шульте</strong>
       <div class="psy-demo-gallery-sheet-tab"><i>Портфолио</i><i>Руководство</i><i>Бланк</i></div>
       <div class="psy-demo-gallery-sheet-line"><span>Цель</span><b>Оценка внимания</b></div>
       <div class="psy-demo-gallery-sheet-line"><span>Материалы</span><b>Таблицы, протокол</b></div>
       <div class="psy-demo-gallery-sheet-line"><span>Инструкция</span><b>В руководстве</b></div>
       <div class="psy-demo-gallery-sheet-footer"><span>Методика и бланки</span><em>↗</em></div>
      </div>
     </div>
     <div class="psy-gallery-meta"><div><span class="psy-gallery-category">МЕТОДИЧЕСКАЯ ЧАСТЬ</span><h3>Портфолио</h3><p>Цель, инструкция и материалы</p></div><span class="psy-gallery-link-mark" aria-hidden="true">↗</span></div>
    </a>
    <a class="psy-demo-gallery-card" href="library.html?area=preschool" aria-label="Открыть библиотеку дошкольных методик">
     <div class="psy-demo-gallery-visual psy-demo-gallery-preschool" aria-hidden="true">
      <div class="psy-demo-gallery-activity">
       <div class="psy-demo-gallery-activity-top"><span>ДЕТСКИЙ САД</span><span class="psy-demo-gallery-bubble">✿</span></div>
       <div class="psy-demo-gallery-activity-title">Наблюдение и развитие</div>
       <div class="psy-demo-gallery-activity-grid">
        <div><span class="psy-demo-activity-icon">♡</span><strong>Адаптация</strong><small>Наблюдение</small></div>
        <div><span class="psy-demo-activity-icon">◎</span><strong>Развитие</strong><small>Диагностика</small></div>
        <div><span class="psy-demo-activity-icon">✳</span><strong>Игра</strong><small>Задания</small></div>
       </div>
       <div class="psy-demo-gallery-activity-foot">Материалы для дошкольников <span>↗</span></div>
      </div>
     </div>
     <div class="psy-gallery-meta"><div><span class="psy-gallery-category">ДЕТСКИЙ САД</span><h3>Дошкольные материалы</h3><p>Наблюдения, беседы, задания</p></div><span class="psy-gallery-link-mark" aria-hidden="true">↗</span></div>
    </a>
   </div>`;
 }
 const kits=root.querySelector("#ready-kits");
 if(kits){
  kits.classList.add("psy-featured-methods");
  kits.innerHTML=`<div class="psy-kits-heading"><div><div class="kicker">Методические комплекты</div><h2>С чего можно начать</h2><p>Несколько примеров материалов для знакомства с Психотекой. Остальные находятся в каталоге.</p></div>
   <a class="site-btn small" href="library.html?area=school">Все методики <span aria-hidden="true">↗</span></a></div>
   <div class="psy-kits-grid">
    <a class="psy-kit-card" href="cognitive-kit.html?method=schulte"><span class="psy-kit-picture psy-kit-attention psy-kit-approved-art" data-psy-kit-art="schulte" aria-hidden="true"></span><span class="psy-kit-copy"><small>ВНИМАНИЕ</small><strong>Таблицы Шульте</strong><span>Таблицы и регистрация времени выполнения</span></span><span class="psy-kit-link" aria-hidden="true">↗</span></a>
    <a class="psy-kit-card" href="family-kit.html?method=drawing"><span class="psy-kit-picture psy-kit-family psy-kit-approved-art" data-psy-kit-art="family" aria-hidden="true"></span><span class="psy-kit-copy"><small>СЕМЬЯ</small><strong>Рисунок семьи</strong><span>Рисунок, беседа и запись наблюдений</span></span><span class="psy-kit-link" aria-hidden="true">↗</span></a>
    <a class="psy-kit-card" href="adaptation-drawing.html?method=animals"><span class="psy-kit-picture psy-kit-adaptation psy-kit-approved-art" data-psy-kit-art="animals" aria-hidden="true"></span><span class="psy-kit-copy"><small>АДАПТАЦИЯ</small><strong>Школа зверей</strong><span>Рисуночная методика и протокол беседы</span></span><span class="psy-kit-link" aria-hidden="true">↗</span></a>
   </div>`;
 }
 const stylesheet=document.createElement("link");
 stylesheet.rel="stylesheet";
 stylesheet.href="site-home-design.css?v=20261027correct-icons1";
 document.head.appendChild(stylesheet);
 const polish=document.createElement("link");
 polish.rel="stylesheet";
 polish.href="site-home-polish.css?v=20261027polish1";
 document.head.appendChild(polish);
 const finalSkin=document.createElement("link");
 finalSkin.rel="stylesheet";
 finalSkin.href="site-home-final.css?v=20261027final3";
 document.head.appendChild(finalSkin);
})();
