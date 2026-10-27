"use strict";
/* Контекстный вход в автономную библиотеку рисунков без замены портфолио и его вкладок. */
(function(){
  const methods = new Map([
    ["Рисунок семьи","family"],
    ["Кинетический рисунок семьи","kfd"],
    ["Рисунок семьи в концепции Л. Кормана","corman"],
    ["Школа зверей","school-animals"],
    ["Что мне нравится в школе","school-likes"],
    ["Несуществующее животное","fictional-animal"],
    ["Рисунок человека","person"],
    ["Рисунок дерева","tree"],
    ["Дом – дерево – человек","house-tree-person"]
  ]);
  const modal=document.getElementById("modal");
  const title=document.getElementById("modalTitle");
  const body=document.getElementById("modalBody");
  if(!modal||!title||!body)return;
  const box=document.createElement("style");
  box.textContent=".library-page #modal .psy-drawing-portal{border:1px solid #bcd7c5;background:#f3faf5;border-radius:14px;padding:14px 17px;margin:0 0 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.library-page #modal .psy-drawing-portal strong{display:block;color:#244e39;margin-bottom:3px}.library-page #modal .psy-drawing-portal p{font-size:13px;margin:0;color:#597265}.library-page #modal .psy-drawing-portal a{display:inline-flex;align-items:center;justify-content:center;background:#285747;color:#fff;text-decoration:none;border-radius:9px;min-height:42px;padding:9px 13px;font-weight:700;white-space:normal;text-align:center}";
  document.head.appendChild(box);
  function update(){
    if(modal.hidden || !modal.classList.contains("psy-main-tabs"))return;
    const method=methods.get(title.textContent.trim());
    if(!method || document.querySelector('#methodTabs .modal-tab.active')?.dataset.tab!=="overview")return;
    if(body.querySelector(".psy-drawing-portal"))return;
    const panel=document.createElement("aside");
    panel.className="psy-drawing-portal";
    const info=document.createElement("div");
    const heading=document.createElement("strong");
    heading.textContent="Библиотека рисунков";
    const text=document.createElement("p");
    text.textContent="Поиск деталей рисунка, расположение и качественный протокол. Доступно без интернета после сохранения.";
    info.append(heading,text);
    const link=document.createElement("a");
    link.href="drawing-library.html?method="+encodeURIComponent(method);
    link.textContent="Открыть библиотеку рисунков";
    panel.append(info,link);
    body.prepend(panel);
  }
  const observer=new MutationObserver(update);
  observer.observe(body,{childList:true});
  observer.observe(title,{childList:true});
  update();
})();