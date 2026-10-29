"use strict";
/* Главная Метоларии: авторские иллюстрации сайта вместо iframe и скриншотов.
 * Только главная; библиотека, методики и их материалы не меняются. */
(function(){
 const root=document.getElementById("siteHome");
 if(!root)return;
 const hero=root.querySelector(".psy-library-preview, .psy-showcase-window");
 if(hero){
  // A faithful, static visual excerpt of existing Psyteka UI, not a screenshot or a claimed live session.
  hero.outerHTML=`<div class="psy-home-hero-art psy-home-ui psy-auth-hero" aria-label="Пример интерфейса Метоларии на основе существующих карточек методик">
    <div class="psy-demo-window">
      <div class="psy-demo-toolbar"><span class="psy-demo-traffic" aria-hidden="true"><i></i><i></i><i></i></span><span class="psy-demo-browser-caption"><span class="psy-brand-name-first">Мето</span><span class="psy-brand-name-last">лария</span> · Методическая библиотека</span></div>
      <div class="psy-demo-layout">
        <aside class="psy-demo-aside">
          <div class="psy-demo-brand"><span class="psy-demo-brandmark"><svg class="psy-demo-brand-real" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 597 603" aria-hidden="true" focusable="false"><path fill="#28534A" d="M564,420 521,420 469,428 435,439 396,459 365,483 342,509 321,545 311,578 321,562 343,538 363,522 394,504 434,489 462,482 543,471 548,466 557,448 563,430Z"/><path fill="#28534A" d="M38,420 44,446 51,461 59,471 140,482 175,491 208,504 230,516 258,537 277,557 291,578 289,567 279,541 262,512 238,484 206,459 172,441 124,426 80,420Z"/><path fill="#28534A" d="M320,279 280,281 280,506 294,532 301,555 309,529 322,506 322,281Z"/><path fill="#28534A" d="M480,226 444,226 430,229 410,239 399,250 389,273 388,343 382,368 372,386 358,400 339,409 338,415 365,414 389,408 409,397 424,383 436,364 442,345 443,281 447,259 457,241 470,230Z"/><path fill="#28534A" d="M123,226 135,232 145,241 155,259 158,271 159,340 164,359 174,378 189,394 213,408 237,414 264,415 264,409 254,406 243,399 230,386 218,364 214,345 213,274 210,263 203,250 189,237 169,228 158,226Z"/><path fill="#28534A" d="M301,103 299,121 294,137 283,156 271,167 256,175 242,179 228,180 244,182 262,188 282,203 294,223 301,255 307,225 319,204 331,193 342,187 373,180 355,178 341,173 328,165 318,155 305,129Z"/><path fill="#28534A" d="M418,46 375,29 339,21 285,19 254,23 211,35 167,55 133,77 106,100 81,128 59,161 42,198 30,241 26,273 28,323 36,358 51,396 53,398 99,401 84,371 72,335 67,301 69,257 77,222 95,181 113,154 140,125 165,105 184,93 214,78 239,69 278,61 317,60 362,68 394,80Z"/><path fill="#B7A893" d="M573,491 471,502 442,508 413,517 383,531 358,548 334,572 322,591 352,575 380,566 410,562 487,563 517,556 537,545 556,527 571,501Z"/><path fill="#B7A893" d="M29,491 30,499 37,514 50,532 66,546 90,558 115,563 189,562 223,566 253,576 279,590 267,571 246,550 217,530 189,517 164,509 125,501Z"/><path fill="#B7A893" d="M451,67 429,99 457,120 481,144 499,168 520,209 533,258 535,293 531,328 519,368 503,399 549,398 558,380 567,354 575,310 574,257 564,210 545,165 520,127 504,108 484,89 457,68Z"/></svg></span><span><span class="psy-auth-brandname">Мето<b>лария</b></span><small>Методическая библиотека</small></span></div>
          <div class="psy-demo-aside-title">МАТЕРИАЛЫ</div>
          <span class="psy-demo-menu current">Школа</span>
          <span class="psy-demo-menu">Детский сад</span>
          <span class="psy-demo-menu">Взрослые</span>
          <span class="psy-demo-menu">ОВЗ и инвалидность</span>
          <span class="psy-demo-menu">ПМПК</span>
          <span class="psy-demo-menu">Профилактика</span>
          <span class="psy-demo-menu">Документация</span>
        </aside>
        <div class="psy-demo-content">
          <div class="psy-demo-search"><svg viewBox="0 0 24 24" fill="none"><circle cx="10.7" cy="10.7" r="5.8" stroke="currentColor" stroke-width="2"/><path d="m15 15 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Название методики, автор, направление...</span></div>
          <div class="psy-demo-intro"><span>Школьные материалы</span></div>
          <div class="psy-auth-method-row">
            <span class="psy-auth-method-pic psy-auth-mspss" aria-hidden="true"></span>
            <span class="psy-auth-method-description"><strong>Шкала воспринимаемой социальной поддержки (MSPSS)</strong><small>Г. Зимет, Н. Далем, С. Зимет, Г. Фарли (1988)</small><span class="psy-auth-method-badges"><i>Опросник</i><i>12 утверждений</i></span><span class="psy-auth-method-detail">Поддержка семьи, друзей и близких</span></span>
          </div>
          <div class="psy-auth-method-row">
            <span class="psy-auth-method-pic psy-auth-gad" aria-hidden="true"></span>
            <span class="psy-auth-method-description"><strong>GAD-7 – краткая шкала тревожных симптомов</strong><small>Краткий скрининг тревожных симптомов</small><span class="psy-auth-method-badges"><i>Опросник</i><i>7 вопросов</i></span></span>
          </div>
        </div>
      </div>
    </div>
    <div class="psy-demo-float" aria-hidden="true"><span class="psy-demo-float-icon">✓</span><span><strong>Материалы в одном месте</strong><small>Каталог, портфолио и бланки</small></span></div>
   </div>`;
 }
 const inside=root.querySelector("#inside .psy-preview-wrap");
 if(inside){
  inside.classList.add("psy-home-gallery");
  inside.innerHTML=`<div class="psy-gallery-heading">
     <div class="psy-gallery-heading-copy"><div class="kicker">Внутри Метоларии</div><h2>Все под рукой для работы психолога</h2><p>Четыре части рабочего комплекта на примере одной существующей методики – шкалы воспринимаемой социальной поддержки (MSPSS).</p></div>
     <a class="site-btn small psy-gallery-action" href="library.html?area=school">Перейти в библиотеку <span aria-hidden="true">↗</span></a>
   </div>
   <div class="psy-gallery-grid psy-auth-gallery">
    <a class="psy-auth-preview-card" href="library.html?area=school" aria-label="Открыть каталог с методикой MSPSS">
     <div class="psy-auth-preview-visual psy-auth-preview-catalog" aria-hidden="true">
      <div class="psy-auth-mini-screen">
       <div class="psy-auth-mini-title">Школьные материалы</div>
       <div class="psy-auth-mini-search">⌕ Название методики, автор...</div>
       <div class="psy-auth-mini-catalog-item"><span class="psy-auth-method-pic psy-auth-mspss"></span><span><b>Шкала воспринимаемой социальной поддержки (MSPSS)</b><small>Г. Зимет, Н. Далем, С. Зимет, Г. Фарли (1988)</small><em>Опросник · 12 утверждений</em></span></div>
       <div class="psy-auth-mini-catalog-item"><span class="psy-auth-method-pic psy-auth-gad"></span><span><b>GAD-7 – краткая шкала тревожных симптомов</b><small>Краткий скрининг симптомов тревоги</small></span></div>
      </div>
     </div><div class="psy-gallery-meta"><div><span class="psy-gallery-category">ПОИСК</span><h3>Каталог методик</h3><p>Карточка и основные сведения</p></div><span class="psy-gallery-link-mark" aria-hidden="true">↗</span></div>
    </a>
    <a class="psy-auth-preview-card" href="library.html?area=school" aria-label="Открыть библиотеку и портфолио MSPSS">
     <div class="psy-auth-preview-visual psy-auth-preview-portfolio" aria-hidden="true">
      <div class="psy-auth-mini-screen">
       <div class="psy-auth-mini-method-heading">Шкала воспринимаемой социальной поддержки (MSPSS)</div>
       <div class="psy-auth-mini-tabs"><span class="selected">Портфолио</span><span>Методика / руководство</span><span>Бланк</span></div>
       <div class="psy-auth-mini-heading">Общие сведения</div>
       <div class="psy-auth-mini-row"><b>Методика</b><span>MSPSS</span></div>
       <div class="psy-auth-mini-row"><b>Автор</b><span>Г. Зимет и соавторы (1988)</span></div>
       <div class="psy-auth-mini-row"><b>Вид</b><span>Опросник</span></div>
       <div class="psy-auth-mini-row"><b>Заданий</b><span>12 утверждений</span></div>
       <div class="psy-auth-mini-heading">Цель методики</div>
       <p class="psy-auth-mini-purpose">Оценка воспринимаемой социальной поддержки</p>
      </div>
     </div><div class="psy-gallery-meta"><div><span class="psy-gallery-category">СВЕДЕНИЯ</span><h3>Портфолио</h3><p>Цель, авторы и особенности</p></div><span class="psy-gallery-link-mark" aria-hidden="true">↗</span></div>
    </a>
    <a class="psy-auth-preview-card" href="library.html?area=school" aria-label="Открыть библиотеку и обработку данных MSPSS">
     <div class="psy-auth-preview-visual psy-auth-preview-processing" aria-hidden="true">
      <div class="psy-auth-mini-screen">
       <div class="psy-auth-mini-method-heading">Шкала воспринимаемой социальной поддержки (MSPSS)</div>
       <div class="psy-auth-mini-tabs"><span>Портфолио</span><span>Методика / руководство</span><span>Бланк</span></div>
       <div class="psy-auth-mini-modes"><span class="selected">Один участник</span><span>Группа / класс</span></div>
       <div class="psy-auth-mini-field">Фамилия и имя <span>Введите ФИО</span></div>
       <div class="psy-auth-mini-question answered"><span>1. Поддержка значимого человека в трудной ситуации</span><b>2</b></div>
       <div class="psy-auth-mini-question"><span>2. Возможность делиться переживаниями</span><b>1-7</b></div>
       <div class="psy-auth-mini-question"><span>3. Готовность семьи помочь</span><b>1-7</b></div>
      </div>
     </div><div class="psy-gallery-meta"><div><span class="psy-gallery-category">РЕЗУЛЬТАТ</span><h3>Обработка данных</h3><p>Один участник или группа</p></div><span class="psy-gallery-link-mark" aria-hidden="true">↗</span></div>
    </a>
    <a class="psy-auth-preview-card" href="library.html?area=school" aria-label="Открыть библиотеку и бланк MSPSS">
     <div class="psy-auth-preview-visual psy-auth-preview-blank" aria-hidden="true">
      <div class="psy-auth-mini-screen">
       <div class="psy-auth-mini-method-heading">Шкала воспринимаемой социальной поддержки (MSPSS)</div>
       <div class="psy-auth-mini-tabs"><span>Портфолио</span><span>Методика / руководство</span><span class="selected">Бланк</span></div>
       <div class="psy-auth-mini-heading">Бланк ученика</div>
       <p class="psy-auth-mini-instruction">Прочитай предложения. Выбери цифру от 1 до 7.</p>
       <div class="psy-auth-mini-scale"><span>1<br>Совсем не согласен</span><span>4<br>Ни согласен, ни не согласен</span><span>7<br>Полностью согласен</span></div>
       <table class="psy-auth-mini-blank-table"><thead><tr><th>№</th><th>Утверждение</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr></thead><tbody><tr><td>1</td><td>Когда мне нужна помощь...</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>2</td><td>Есть особенный для меня человек...</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>
      </div>
     </div><div class="psy-gallery-meta"><div><span class="psy-gallery-category">ПЕЧАТЬ</span><h3>Бланк ученика</h3><p>Инструкция и шкала ответов</p></div><span class="psy-gallery-link-mark" aria-hidden="true">↗</span></div>
    </a>
   </div>
   <p class="psy-auth-gallery-note">Это статические фрагменты оформления существующей методики MSPSS, а не отдельные интерактивные формы. Полные материалы открываются в библиотеке.</p>`;
 }
 const kits=root.querySelector("#ready-kits");
 if(kits){
  kits.classList.add("psy-featured-methods");
  kits.innerHTML=`<div class="psy-kits-heading"><div><div class="kicker">Методические комплекты</div><h2>С чего можно начать</h2><p>Несколько примеров материалов для знакомства с Метоларией. Остальные находятся в каталоге.</p></div>
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
 polish.href="site-home-polish.css?v=20261029missionnatural3";
 document.head.appendChild(polish);
 const finalSkin=document.createElement("link");
 finalSkin.rel="stylesheet";
 finalSkin.href="site-home-final.css?v=20261027final3";
 document.head.appendChild(finalSkin);
 const authentic=document.createElement("link");
 authentic.rel="stylesheet";
 authentic.href="site-home-authentic.css?v=20261027authentic1";
 document.head.appendChild(authentic);
 const decoration=document.createElement("link");
 decoration.rel="stylesheet";
 decoration.href="site-home-decoration.css?v=20261027decor2";
 document.head.appendChild(decoration);
 const seamless=document.createElement("link");
 seamless.rel="stylesheet";
 seamless.href="site-home-seamless.css?v=20261027seamless1";
 document.head.appendChild(seamless);
 const editorial=document.createElement("link");
 editorial.rel="stylesheet";
 editorial.href="site-home-editorial-rail.css?v=20261027editorial2";
 document.head.appendChild(editorial);
})();
