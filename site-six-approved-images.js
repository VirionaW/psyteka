"use strict";
/* Exactly six owner-approved illustrations, captured from the confirmed artwork.
   Data is local, optimized WebP, not external hotlinks or generated placeholders. */
(function(){
 const pictures=window.PSY_NEW_SIX_IMAGE_DATA||{};
 const catalog=document.getElementById("catalog");
 if(!catalog)return;
 function render(){
  for(const card of catalog.querySelectorAll("article.method")){
   const title=card.querySelector("h3")?.textContent?.replace(/\\s+/g," ").trim();
   const encoded=title&&Object.prototype.hasOwnProperty.call(pictures,title)?pictures[title]:null;
   if(!encoded)continue;
   const head=card.querySelector(".head");
   if(!head)continue;
   let glyph=head.querySelector(".glyph");
   if(!glyph){
    glyph=document.createElement("div");
    glyph.className="glyph";
    head.prepend(glyph);
   }
   const current=glyph.querySelector("img.psy-six-approved");
   if(current&&current.dataset.methodTitle===title)continue;
   const img=document.createElement("img");
   img.className="method-art-personal psy-six-approved";
   img.dataset.methodTitle=title;
   img.setAttribute("alt","");
   img.setAttribute("aria-hidden","true");
   img.width=144;
   img.height=144;
   img.decoding="async";
   img.src="data:image/webp;base64,"+encoded;
   glyph.replaceChildren(img);
   glyph.classList.add("psy-six-approved-glyph");
   glyph.classList.remove("psy-art-glyph");
   card.classList.add("psy-has-art");
   card.classList.remove("psy-no-art");
  }
 }
 render();
 new MutationObserver(render).observe(catalog,{childList:true});
})();