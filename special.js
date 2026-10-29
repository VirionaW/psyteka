"use strict";
(function(){
 const root=document.getElementById("specialView");
 const tree=document.getElementById("specialTree");
 if(!root||!tree)return;
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 // Каталог состоит только из опубликованных методических подходов.
 const data=(window.PSY_SPECIAL_TOOLKIT?.methods||[]).slice();
 // В ОВЗ метод SCARED представлен ссылкой на его уже существующее общее портфолио.
 // Не создаем копию вопросов, регистра, ключа или обработчика.
 const scared=window.PSY_FULL_METHODS?.["SCARED"];
 const sourceScared=window.PSY_CATALOG?.find(m=>m?.name==="SCARED");
 if(scared?.workflow==="scared41"&&sourceScared?.id&&window.PSY_SCARED41){
  data.push({
   id:sourceScared.id,title:"SCARED",author:scared.author,
   group:"Диагностика и наблюдение",topic:"Тревожность",
   ages:["Школьники"],ageLabel:"8-18 лет · детская и родительская версии",
   format:"Скрининговый опросник",count:"41 вопрос",goal:scared.goal
  });
 }
 const byId=new Map(data.map(m=>[m.id,m]));
 const groups=["Диагностика и наблюдение","Мониторинг"];
 const chevron='<span class="nav-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path class="chevron-right" d="m9 6 6 6-6 6"></path><path class="chevron-down" d="m6 9 6 6 6-6"></path></svg></span>';
 tree.innerHTML='<button class="topic-btn topic-all" type="button" data-special-all>Все материалы</button>'+groups.map((g,i)=>{
  const topics=[...new Set(data.filter(m=>m.group===g).map(m=>m.topic))];
  return '<button class="section-toggle" type="button" data-special-toggle="specialGroup'+i+'" aria-controls="specialGroup'+i+'" aria-expanded="'+(i===0)+'">'+esc(g)+chevron+'</button>'+
   '<div class="nested special-tree-nested" id="specialGroup'+i+'" '+(i===0?"":"hidden")+'><button class="topic-btn" type="button" data-special-group="'+esc(g)+'" data-special-topic="">Все материалы раздела</button>'+
   topics.map(t=>'<button class="topic-btn" type="button" data-special-group="'+esc(g)+'" data-special-topic="'+esc(t)+'">'+esc(t)+'</button>').join("")+'</div>';
 }).join("");
 let group="",topic="",query="",phase="";
 function cards(){
  const matches=data.filter(m=>(!group||m.group===group)&&(!topic||m.topic===topic)&&(!phase||m.ages.includes(phase))&&(!query||[m.title,m.topic,m.group,m.goal,m.format].join(" ").toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru"))));
  root.querySelector("#specialHeading").textContent=topic||group||"Материалы по ОВЗ и инвалидности";
  root.querySelector("#specialCount").textContent="Найдено: "+matches.length;
  root.querySelector("#specialCards").innerHTML=matches.map(m=>{
   const pic=typeof iconSvg==="function"?iconSvg(m.group==="Коррекционно-развивающая работа"?"Программы":m.topic==="Эмоциональная сфера"?"Настроение":m.topic==="Саморегуляция"?"Внимание":m.topic==="Коммуникация"?"Общение":"Адаптация"):"";
   return '<article class="method special-method" data-kind="'+(m.group==="Диагностика и наблюдение"?"scale":"other")+'"><div class="head"><div class="glyph" aria-hidden="true">'+pic+'</div><div><h3>'+esc(m.title)+'</h3><p class="method-card-author">'+esc(m.author||'Метолария')+'</p></div></div>'+
   '<div class="tags"><span class="tag">'+esc(m.format)+'</span><span class="tag">'+esc(m.ageLabel)+'</span></div><p class="method-card-summary">'+esc(m.goal)+'</p>'+
   '<div class="actions"><button type="button" class="btn primary" data-special-open="'+esc(m.id)+'">Открыть методику</button></div></article>';
  }).join("")||'<p class="special-empty">По выбранным параметрам материалов нет. Измените направление или возрастную группу.</p>';
  tree.querySelectorAll("[data-special-group]").forEach(b=>b.classList.toggle("active",!!group&&b.dataset.specialGroup===group&&b.dataset.specialTopic===topic));
  tree.querySelector("[data-special-all]")?.classList.toggle("active",!group&&!topic);
 }
 function choose(g,t){group=g;topic=t;query="";root.querySelector("#specialSearch").value="";if(typeof selectView==="function")selectView("special");cards();root.scrollIntoView({block:"start"});}
 tree.addEventListener("click",e=>{
  const toggle=e.target.closest("[data-special-toggle]");
  if(toggle){const child=document.getElementById(toggle.dataset.specialToggle);if(child){child.hidden=!child.hidden;toggle.setAttribute("aria-expanded",String(!child.hidden));}return;}
  if(e.target.closest("[data-special-all]")){choose("","");return;}
  const b=e.target.closest("[data-special-group]");if(b)choose(b.dataset.specialGroup,b.dataset.specialTopic||"");
 });
 root.innerHTML='<div class="filters special-filters"><label class="search-wrap"><span aria-hidden="true">⌕</span><input id="specialSearch" type="search" placeholder="Название, направление, потребность..." aria-label="Поиск по материалам ОВЗ"></label><label class="special-age-field"><span class="visually-hidden">Возрастная группа</span><select id="specialAge" aria-label="Возрастная группа"><option value="">Все возрастные группы</option><option>Дошкольники</option><option>Школьники</option><option>Взрослые</option></select></label></div><div class="subbar special-subbar"><h2 id="specialHeading">Материалы по ОВЗ и инвалидности</h2><span id="specialCount"></span></div><div class="special-cards catalog" id="specialCards"></div>';
 root.querySelector("#specialSearch").addEventListener("input",e=>{query=e.target.value;cards();});
 root.querySelector("#specialAge").addEventListener("change",e=>{phase=e.target.value;cards();});
 root.addEventListener("click",e=>{
  const b=e.target.closest("[data-special-open]");if(!b)return;
  const m=byId.get(b.dataset.specialOpen);if(!m||typeof window.openMethod!=="function")return;
  window.openMethod({id:m.id,name:m.title,theme:m.topic,author:m.author||"Метолария",format:m.format,age:m.ageLabel,goal:m.goal});
 });
 if(document.body.dataset.area==="special"){tree.hidden=false;document.querySelector('[data-view="special"]')?.setAttribute("aria-expanded","true");}
 cards();
})();