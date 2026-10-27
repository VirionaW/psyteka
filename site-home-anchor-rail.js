"use strict";
/* Accessible slim navigation for the Psyteka home page. No tracking or external libraries. */
(function () {
  const root = document.getElementById("siteHome");
  if (!root) return;
  const nav = root.querySelector(".psy-anchor-rail");
  if (!nav) return;
  const targets = Array.from(nav.querySelectorAll("a[data-psy-anchor]"))
    .map(link => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter(item => item.section);
  if (!targets.length) return;

  let scheduled = false;
  function markCurrent() {
    scheduled = false;
    const line = Math.min(window.innerHeight * .35, 215);
    let current = targets[0];
    for (const item of targets) {
      if (item.section.getBoundingClientRect().top <= line) current = item;
    }
    for (const item of targets) {
      if (item === current) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    }
  }

  window.addEventListener("scroll", function () {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(markCurrent);
  }, { passive: true });
  window.addEventListener("resize", markCurrent, { passive: true });
  markCurrent();
})();


/* На узком экране вместо скрытой боковой полоски – кнопка «Разделы».
   Действующие ссылки и подсветка текущего раздела остаются прежними. */
(function () {
  const root=document.getElementById("siteHome");
  const nav=root && root.querySelector(".psy-anchor-rail");
  if(!nav || nav.querySelector(".psy-rail-toggle"))return;
  const list=document.createElement("div");
  list.className="psy-rail-links";
  list.id="psyHomeRailLinks";
  Array.from(nav.children).forEach(child=>{
    if(!child.classList.contains("psy-rail-leaf"))list.appendChild(child);
  });
  nav.appendChild(list);

  const button=document.createElement("button");
  button.type="button";
  button.className="psy-rail-toggle";
  button.setAttribute("aria-controls",list.id);
  button.setAttribute("aria-expanded","false");
  button.setAttribute("aria-label","Открыть навигацию по разделам главной");
  button.innerHTML='<span class="psy-rail-toggle-icon" aria-hidden="true">☷</span><span>Разделы</span>';
  nav.insertBefore(button,nav.firstChild);
  nav.dataset.open="false";

  function toggle(open){
    nav.dataset.open=open?"true":"false";
    button.setAttribute("aria-expanded",String(open));
    button.setAttribute("aria-label",open?"Закрыть навигацию по разделам":"Открыть навигацию по разделам главной");
  }
  button.addEventListener("click",()=>toggle(nav.dataset.open!=="true"));
  list.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>toggle(false)));
  document.addEventListener("pointerdown",event=>{
    if(nav.dataset.open==="true" && !nav.contains(event.target))toggle(false);
  });
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape" && nav.dataset.open==="true"){
      toggle(false);
      button.focus();
    }
  });
  window.addEventListener("resize",()=>{
    if(window.innerWidth>920 && nav.dataset.open==="true")toggle(false);
  },{passive:true});

  const style=document.createElement("link");
  style.rel="stylesheet";
  style.href="site-home-mobile-rail.css?v=20261027mobile1";
  document.head.appendChild(style);
})();
