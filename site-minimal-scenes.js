"use strict";
(function(){
 const hero=document.querySelector(".library-page .hero-art");
 if(!hero)return;
 const sections={school:"school",preschool:"preschool",adults:"adults",special:"special",prevention:"prevention",documents:"documents"};
 const image=document.createElement("img");
 image.alt="";image.setAttribute("aria-hidden","true");
 image.className="psy-minimal-figure";
 image.decoding="async";
 hero.replaceChildren(image);
 hero.classList.add("psy-minimal-host");
 let current="";
 function update(){
  const next=sections[document.body.dataset.area]||"";
  if(next===current)return;
  current=next;
  hero.hidden=!next;
  if(next)image.src="assets/scene-"+next+".svg";
 }
 update();
 const observer=new MutationObserver(update);
 observer.observe(document.body,{attributes:true,attributeFilter:["data-area"]});
})();
