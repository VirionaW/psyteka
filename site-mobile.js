"use strict";
(function(){
 const body=document.body;
 if(!body.classList.contains('library-page'))return;
 const menu=document.getElementById('menuBtn');
 const sidebar=document.getElementById('sidebar');
 const backdrop=document.getElementById('mobileBackdrop');
 const closeBtn=document.getElementById('mobileNavClose');
 const modal=document.getElementById('modal');
 const choices=document.querySelectorAll('[data-mobile-area]');
 const isMobile=()=>window.matchMedia('(max-width:820px)').matches;
 let restoreFocus=null;
 function closeNav(){
  sidebar.classList.remove('open');
  body.classList.remove('mobile-nav-open');
  if(backdrop)backdrop.hidden=true;
  menu.setAttribute('aria-expanded','false');
  sidebar.removeAttribute('aria-modal');
  if(restoreFocus&&isMobile()&&document.activeElement===closeBtn){restoreFocus.focus({preventScroll:true})}
  restoreFocus=null;
 }
 function openNav(){
  if(!isMobile())return;
  restoreFocus=document.activeElement;
  sidebar.classList.add('open');
  body.classList.add('mobile-nav-open');
  if(backdrop)backdrop.hidden=false;
  menu.setAttribute('aria-expanded','true');
  sidebar.setAttribute('aria-modal','true');
  if(closeBtn)closeBtn.focus({preventScroll:true});
 }
 menu.onclick=()=>sidebar.classList.contains('open')?closeNav():openNav();
 if(closeBtn)closeBtn.addEventListener('click',closeNav);
 if(backdrop)backdrop.addEventListener('click',closeNav);
 sidebar.addEventListener('click',e=>{
  if(e.target.closest('[data-view],[data-topic]'))closeNav();
 });
 function refreshChoices(){
  choices.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.mobileArea===body.dataset.area)));
 }
 choices.forEach(btn=>btn.addEventListener('click',()=>{
  const area=btn.dataset.mobileArea;
  if(body.dataset.area!==area){
   const target=sidebar.querySelector('[data-view="'+area+'"]');
   if(target)target.click();
  }
  closeNav();
  setTimeout(refreshChoices,35);
  window.scrollTo({top:0,behavior:'instant'});
 }));
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&sidebar.classList.contains('open')){e.preventDefault();closeNav()}
  if(e.key==='Tab'&&sidebar.classList.contains('open')&&isMobile()){
   const focusable=[...sidebar.querySelectorAll('a[href],button:not([disabled]),input:not([disabled])')].filter(el=>!el.closest('[hidden]')&&el.getClientRects().length);
   if(!focusable.length)return;
   const first=focusable[0],last=focusable[focusable.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
 });
 window.addEventListener('resize',()=>{
  if(!isMobile())closeNav();
 },{passive:true});
 if(modal){
  const refreshModal=()=>{
   body.classList.toggle('mobile-modal-open',!modal.hidden&&isMobile());
  };
  new MutationObserver(refreshModal).observe(modal,{attributes:true,attributeFilter:['hidden']});
  window.addEventListener('resize',refreshModal,{passive:true});
  refreshModal();
 }
 const areaObserver=new MutationObserver(refreshChoices);
 areaObserver.observe(body,{attributes:true,attributeFilter:['data-area']});
 refreshChoices();
})();