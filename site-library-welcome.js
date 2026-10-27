"use strict";
(function(){
 const params=new URLSearchParams(location.search);
 // Explicit directions and direct links must keep their existing behavior.
 if(params.has('area')||params.has('method')||params.has('topic')||location.hash)return;
 const main=document.querySelector('main.main');
 if(!main)return;
 const hero=main.querySelector('.hero');
 // Keep the unselected landing separate from any default school banner, including
 // later async scripts that update the hero or switch a view.
 document.documentElement.classList.add('psy-library-choose-only');
 const views=['schoolView','preschoolView','specialView','pmpkView','resourceView'];
 const panel=document.createElement('section');
 panel.className='psy-direction-welcome';panel.id='psyDirectionWelcome';
 panel.setAttribute('aria-label','Выберите направление библиотеки');
 panel.innerHTML='<div class="psy-welcome-content"><svg class="psy-welcome-arrow" viewBox="0 0 210 135" aria-hidden="true"><path d="M187 110 C128 121 88 102 62 57 C53 41 37 32 18 31 M18 31 L47 18 M18 31 L33 58"/></svg><h2>Выберите направление</h2><p>Откройте нужный раздел в панели слева – здесь появятся методики и материалы для вашей работы.</p></div>';
 (hero||main.firstElementChild)?.insertAdjacentElement('afterend',panel);
 let activated=false;
 function welcome(){
  if(activated)return;
  views.forEach(id=>{const el=document.getElementById(id);if(el)el.hidden=true});
  if(hero)hero.hidden=true;
  document.querySelectorAll('[data-view].area-current,[data-view].active').forEach(el=>el.classList.remove('area-current','active'));
  ['schoolTree','preschoolTree','specialTree'].forEach(id=>{const tree=document.getElementById(id);if(tree)tree.hidden=true});
  document.querySelectorAll('[data-view][aria-expanded]').forEach(el=>el.setAttribute('aria-expanded','false'));
  document.body.dataset.area='welcome';
 }
 welcome();
 function activate(){if(activated)return;activated=true;document.documentElement.classList.remove('psy-library-choose-only');panel.hidden=true;if(hero)hero.hidden=false}
 document.querySelectorAll('[data-view],[data-topic],[data-preschool-topic],[data-mobile-area],#showAllMaterials').forEach(el=>el.addEventListener('click',activate,{capture:true}));
 // A deep link added later by client-side navigation also clears the welcome state.
 window.addEventListener('popstate',()=>{if(new URLSearchParams(location.search).has('area'))activate()});
})();
