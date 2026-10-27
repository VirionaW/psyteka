"use strict";
/* Главная Психотеки: авторские иллюстрации сайта вместо iframe и скриншотов.
 * Только главная; библиотека, методики и их материалы не меняются. */
(function(){
 const root=document.getElementById("siteHome");
 if(!root)return;
 const hero=root.querySelector(".psy-library-preview, .psy-showcase-window");
 if(hero){
  hero.outerHTML=`<div class="psy-home-hero-art" aria-label="Иллюстрация рабочего пространства психолога и материалов библиотеки">
    <div class="psy-hero-illustration" aria-hidden="true">
      <img src="assets/psyteka-banner-school-approved.webp" width="800" height="520" alt="" fetchpriority="high">
    </div>
    <div class="psy-visual-topline" aria-hidden="true"><span class="psy-visual-mark"><img src="brand-mark.svg" alt="" width="24" height="24"></span><span><strong>Психотека</strong><small>Библиотека психолога</small></span><span class="psy-visual-dot"></span></div>
    <div class="psy-hero-floating" aria-hidden="true">
      <div class="psy-hero-floating-mark"><svg viewBox="0 0 32 32" fill="none"><path d="M7 9h18M7 16h18M7 23h12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="23" r="4" fill="#edc78c"/></svg></div>
      <div><strong>Все для работы</strong><span>Методики · бланки · протоколы</span></div>
      <svg class="psy-visual-check" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" fill="#e5f3e7"/><path d="m8 14 4 4 8-9" stroke="#2f805c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
  </div>`;
 }
 const inside=root.querySelector("#inside .psy-preview-wrap");
 if(inside){
  inside.classList.add("psy-home-gallery");
  inside.innerHTML=`<div class="psy-gallery-heading">
    <div class="psy-gallery-heading-copy"><div class="kicker">Внутри Психотеки</div><h2>Все под рукой для работы психолога</h2><p>Удобный каталог, понятные методические описания и материалы для разных возрастов – в едином рабочем пространстве.</p></div>
    <a class="site-btn small psy-gallery-action" href="library.html?area=school">Перейти в библиотеку <span aria-hidden="true">↗</span></a>
   </div>
   <div class="psy-gallery-grid">
    <a class="psy-gallery-card psy-gallery-school" href="library.html?area=school" aria-label="Открыть каталог школьных методик">
     <div class="psy-gallery-visual">
      <div class="psy-gallery-art-sheen" aria-hidden="true"></div>
      <span class="psy-gallery-sticker" aria-hidden="true">01 <span>Каталог</span></span>
      <span class="psy-gallery-visual-corner" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M11 16h26M11 24h19M11 32h14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="33" cy="31" r="7" stroke="currentColor" stroke-width="2.6"/><path d="m38 36 5 5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></span>
     </div>
     <div class="psy-gallery-meta"><div><span class="psy-gallery-category">ШКОЛА</span><h3>Подбор методик</h3><p>Темы, возраст, авторы и цель исследования</p></div><span class="psy-gallery-link-mark" aria-hidden="true">↗</span></div>
    </a>
    <a class="psy-gallery-card psy-gallery-docs" href="library.html?area=school" aria-label="Открыть методические руководства в библиотеке">
     <div class="psy-gallery-visual">
      <div class="psy-gallery-art-sheen" aria-hidden="true"></div>
      <span class="psy-gallery-sticker" aria-hidden="true">02 <span>Руководства</span></span>
      <span class="psy-gallery-visual-corner" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M12 8h20l6 7v25H12z" stroke="currentColor" stroke-width="2.7" stroke-linejoin="round"/><path d="M32 8v8h6M18 23h14M18 29h14M18 35h9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></span>
     </div>
     <div class="psy-gallery-meta"><div><span class="psy-gallery-category">МАТЕРИАЛЫ</span><h3>Портфолио и бланки</h3><p>Инструкции, формы и рабочие протоколы</p></div><span class="psy-gallery-link-mark" aria-hidden="true">↗</span></div>
    </a>
    <a class="psy-gallery-card psy-gallery-preschool" href="library.html?area=preschool" aria-label="Открыть методики для детского сада">
     <div class="psy-gallery-visual">
      <div class="psy-gallery-art-sheen" aria-hidden="true"></div>
      <span class="psy-gallery-sticker" aria-hidden="true">03 <span>Дошкольники</span></span>
      <span class="psy-gallery-visual-corner" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><circle cx="16" cy="19" r="6" stroke="currentColor" stroke-width="2.6"/><circle cx="32" cy="19" r="6" stroke="currentColor" stroke-width="2.6"/><path d="M5 38c0-9 4-13 11-13s11 4 11 13M21 38c0-9 4-13 11-13s11 4 11 13" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></span>
     </div>
     <div class="psy-gallery-meta"><div><span class="psy-gallery-category">ДЕТСКИЙ САД</span><h3>Развитие и адаптация</h3><p>Наблюдение, беседы и игровые задания</p></div><span class="psy-gallery-link-mark" aria-hidden="true">↗</span></div>
    </a>
   </div>`;
 }
 const kits=root.querySelector("#ready-kits");
 if(kits){
  kits.classList.add("psy-featured-methods");
  kits.innerHTML=`<div class="psy-kits-heading"><div><div class="kicker">Методические комплекты</div><h2>С чего можно начать</h2><p>Несколько примеров материалов для знакомства с Психотекой. Остальные находятся в каталоге.</p></div>
   <a class="site-btn small" href="library.html?area=school">Все методики <span aria-hidden="true">↗</span></a></div>
   <div class="psy-kits-grid">
    <a class="psy-kit-card" href="cognitive-kit.html?method=schulte"><span class="psy-kit-picture psy-kit-attention" psy-kit-approved-art" data-psy-kit-art="schulte" aria-hidden="true"></span><span class="psy-kit-copy"><small>ВНИМАНИЕ</small><strong>Таблицы Шульте</strong><span>Таблицы и регистрация времени выполнения</span></span><span class="psy-kit-link" aria-hidden="true">↗</span></a>
    <a class="psy-kit-card" href="family-kit.html?method=drawing"><span class="psy-kit-picture psy-kit-family" psy-kit-approved-art" data-psy-kit-art="family" aria-hidden="true"></span><span class="psy-kit-copy"><small>СЕМЬЯ</small><strong>Рисунок семьи</strong><span>Рисунок, беседа и запись наблюдений</span></span><span class="psy-kit-link" aria-hidden="true">↗</span></a>
    <a class="psy-kit-card" href="adaptation-drawing.html?method=animals"><span class="psy-kit-picture psy-kit-adaptation" psy-kit-approved-art" data-psy-kit-art="animals" aria-hidden="true"></span><span class="psy-kit-copy"><small>АДАПТАЦИЯ</small><strong>Школа зверей</strong><span>Рисуночная методика и протокол беседы</span></span><span class="psy-kit-link" aria-hidden="true">↗</span></a>
   </div>`;
 }
 const stylesheet=document.createElement("link");
 stylesheet.rel="stylesheet";
 stylesheet.href="site-home-design.css?v=20261027correct-icons1";
 document.head.appendChild(stylesheet);
})();
