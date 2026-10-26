"use strict";
(function(){
  // These exact titles correspond to the first ten newly commissioned illustrations.
  const artwork=new Map([
  [
    "Методика незаконченных предложений мотивационной индукции",
    0
  ],
  [
    "Повторение цифровых рядов (прямой и обратный порядок)",
    1
  ],
  [
    "Парные ассоциации (смысловая и механическая память)",
    2
  ],
  [
    "Простые аналогии (словесно-логическое мышление)",
    3
  ],
  [
    "Проба на динамический праксис «Кулак – ребро – ладонь»",
    4
  ],
  [
    "Классификация предметов (словесный вариант)",
    5
  ],
  [
    "Исключение четвертого лишнего (словесный вариант)",
    6
  ],
  [
    "Ценностные приоритеты в твоей жизни",
    7
  ],
  [
    "Все дело в тебе",
    8
  ],
  [
    "Проживание-преодоление подростком кризисной психотравмирующей ситуации",
    9
  ]
]);
  const catalog=document.getElementById("catalog");
  if(!catalog)return;
  function draw(){
    for(const card of catalog.querySelectorAll("article.method")){
      const name=card.querySelector("h3")?.textContent?.trim()||"";
      const idx=artwork.get(name);
      if(idx===undefined)continue;
      const head=card.querySelector(".head");
      if(!head)continue;
      let glyph=head.querySelector(".glyph");
      if(!glyph){
        glyph=document.createElement("div");
        glyph.className="glyph";
        head.prepend(glyph);
      }
      if(glyph.querySelector(".psy-next-ten-image"))continue;
      const image=document.createElement("span");
      image.className="psy-next-ten-image";
      image.setAttribute("role","img");
      image.setAttribute("aria-label","Иллюстрация к "+name);
      image.style.backgroundPosition=((idx%5)/4*100)+"% "+Math.floor(idx/5)*100+"%";
      glyph.replaceChildren(image);
      glyph.classList.remove("psy-art-glyph");
      glyph.classList.add("psy-next-ten-glyph");
      card.classList.add("psy-has-art");
      card.classList.remove("psy-no-art");
    }
  }
  draw();
  new MutationObserver(draw).observe(catalog,{childList:true});
})();
