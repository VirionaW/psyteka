"use strict";
(function(){
 const approved=new Map([
  ["SCARED",0],
  ["Социально-психологическая адаптация",1],
  ["Краткий опросник настроения (SMFQ)",2],
  ["Индекс хорошего самочувствия WHO-5",3],
  ["RCADS-47",4],
  ["Опросник взаимодействия родитель - ребенок (ВРР)",5],
  ["Школьный тест умственного развития (ШТУР)",6],
  ["Заучивание 10 слов",7]
 ]);
 const catalog=document.getElementById("catalog");
 if(!catalog)return;
 function draw(){
  for(const card of catalog.querySelectorAll("article.method")){
   const name=card.querySelector("h3")?.textContent?.trim()||"";
   const pos=approved.get(name);
   if(pos===undefined)continue;
   const head=card.querySelector(".head");
   if(!head)continue;
   let glyph=head.querySelector(".glyph");
   if(!glyph){
    // site-art.js sometimes removes an unmatched icon before this approved override runs.
    glyph=document.createElement("div");
    glyph.className="glyph";
    glyph.setAttribute("aria-hidden","true");
    head.prepend(glyph);
   }
   if(glyph.querySelector(".psy-approved-eight"))continue;
   const picture=document.createElement("span");
   picture.className="psy-approved-eight";
   picture.setAttribute("role","img");
   picture.setAttribute("aria-label","Иллюстрация к "+name);
   picture.style.backgroundPosition=((pos%4)/3*100)+"% "+Math.floor(pos/4)*100+"%";
   glyph.replaceChildren(picture);
   glyph.classList.remove("psy-art-glyph");
   glyph.classList.add("psy-approved-eight-glyph");
   card.classList.add("psy-has-art");
   card.classList.remove("psy-no-art");
  }
 }
 draw();
 new MutationObserver(draw).observe(catalog,{childList:true});
})();
