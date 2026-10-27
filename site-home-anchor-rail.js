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
