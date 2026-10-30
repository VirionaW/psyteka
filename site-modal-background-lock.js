"use strict";
/* Lock only the background document while the method portfolio is open.
   The fixed dialog's own .modalbody remains scrollable. */
(function(){
 const modal=document.getElementById("modal");
 if(!modal)return;
 const sync=()=>document.documentElement.classList.toggle("psy-method-modal-open",!modal.hidden);
 const observer=new MutationObserver(sync);
 observer.observe(modal,{attributes:true,attributeFilter:["hidden"]});
 sync();
 window.addEventListener("pagehide",()=>document.documentElement.classList.remove("psy-method-modal-open"));
 window.addEventListener("pageshow",sync);
})();
