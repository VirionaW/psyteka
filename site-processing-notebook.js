"use strict";
/* Book-index tabs for the account's saved results of the currently opened method.
   The tabs live beside (not inside) the processing modal. No pupil data is stored here. */
(function(){
 const modal=document.getElementById("modal");
 if(!modal)return;
 const notebook=document.createElement("aside");
 notebook.className="psy-result-notebook";
 notebook.hidden=true;
 notebook.setAttribute("aria-label","Сохраненные результаты этой методики");
 const heading=document.createElement("div");
 heading.className="psy-result-notebook-head";
 const back=document.createElement("button");
 back.type="button";
 back.className="psy-result-notebook-back";
 back.textContent="← Чистый бланк";
 back.hidden=true;
 back.setAttribute("aria-label","Вернуться к чистому бланку обработки");
 const title=document.createElement("strong");
 title.textContent="Мои результаты";
 const sub=document.createElement("span");
 sub.className="psy-result-notebook-sub";
 heading.append(title,sub);
 const list=document.createElement("nav");
 list.className="psy-result-notebook-tabs";
 list.setAttribute("aria-label","Переключить сохраненный результат");
 const message=document.createElement("p");
 message.className="psy-result-notebook-empty";
 notebook.append(heading,list,message);
 document.body.append(notebook);
 // Put the return button in the top of the portfolio/processing window, not
 // in the left gutter where the tabs may be partially off-screen.
 const modalHead=modal.querySelector(".modalhead");
 if(modalHead)modalHead.insertBefore(back,modal.querySelector("#closeModal")||null);
 else heading.prepend(back);

 let records=[],cachedMethod="",loadPromise=null,requestId=0,loading=false,error="";
 const getState=()=>window.PSY_PROCESSING_NOTEBOOK?.getState?.()||null;
 back.addEventListener("click",()=>{
  const controller=window.PSY_PROCESSING_NOTEBOOK;
  if(!controller?.openBlank)return;
  const changed=controller.openBlank();
  if(changed)render();
 });
 function position(){
  if(notebook.hidden||modal.hidden)return;
  const rect=modal.getBoundingClientRect();
  const width=notebook.getBoundingClientRect().width;
  notebook.style.left=Math.max(4,Math.round(rect.left-width+1))+"px";
  notebook.style.top=Math.round(rect.top+Math.min(127,Math.max(74,rect.height*.13)))+"px";
  notebook.style.maxHeight=Math.max(145,Math.floor(rect.height-155))+"px";
 }
 function render(){
  const state=getState();
  const visible=!!state?.visible&&(state.tab==="score"||state.tab==="processing");
  if(!visible){notebook.hidden=true;back.hidden=true;modal.classList.remove("psy-notebook-open");return}
  modal.classList.add("psy-notebook-open");
  notebook.hidden=false;
  back.hidden=false;
  sub.textContent=state.mode==="class"?"Групповые":"Индивидуальные";
  list.replaceChildren();
  message.hidden=true;
  const shown=records.filter(x=>x.calcMode===state.mode)
   .sort((a,b)=>String(a.title||"").localeCompare(String(b.title||""),"ru"));
  if(loading){message.textContent="Загружаем записи…";message.hidden=false}
  else if(error){message.textContent=error;message.hidden=false}
  else if(!shown.length){message.textContent="Пока нет сохраненных результатов";message.hidden=false}
  shown.forEach((item,index)=>{
   const b=document.createElement("button");
   b.type="button";
   b.className="psy-result-notebook-tab";
   b.dataset.index=String(index%6);
   b.title=item.title||"Сохраненный результат";
   b.setAttribute("aria-label","Открыть результат: "+(item.title||"Без названия"));
   b.setAttribute("aria-current",String(state.assessmentId===item.id));
   if(state.assessmentId===item.id)b.classList.add("is-current");
   const text=document.createElement("span");
   text.className="psy-result-notebook-title";
   text.textContent=item.title||"Без названия";
   const time=document.createElement("small");
   time.textContent=item.updated_at?new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"short"}).format(new Date(item.updated_at)):"";
   b.append(text,time);
   b.addEventListener("click",async()=>{
    if(getState()?.assessmentId===item.id)return;
    b.disabled=true;
    try{
     const ok=await window.PSY_PROCESSING_NOTEBOOK.openSaved(item.id);
     if(ok)render();
    }catch(e){message.textContent="Не удалось открыть: "+(e?.message||"ошибка загрузки");message.hidden=false}
    finally{b.disabled=false}
   });
   list.append(b);
  });
  requestAnimationFrame(position);
 }
 async function refresh(force){
  const state=getState();
  if(!state?.methodName)return;
  if(!force&&cachedMethod===state.methodName){render();return}
  const target=state.methodName,seq=++requestId;
  cachedMethod=target;records=[];loading=true;error="";render();
  try{
   const cloud=window.PSY_CLOUD;
   if(!cloud){error="Для записей нужен вход в профиль";return}
   const result=await cloud.listAssessments({methodName:target});
   if(seq!==requestId)return;
   records=Array.isArray(result)?result:[];error="";
  }catch(e){if(seq===requestId)error=/Войдите/i.test(e?.message||"")?"Войдите в профиль, чтобы увидеть записи":"Не удалось загрузить записи"}
  finally{if(seq===requestId){loading=false;render()}}
 }
 window.addEventListener("psy-processing-view-change",()=>{
  const state=getState();
  if(!state?.visible||!["score","processing"].includes(state.tab)){render();return}
  refresh(false);
 });
 window.addEventListener("psy-assessment-saved",()=>{cachedMethod="";refresh(true)});
 window.addEventListener("resize",()=>requestAnimationFrame(position),{passive:true});
 try{new ResizeObserver(()=>requestAnimationFrame(position)).observe(modal)}catch(_){}
 const oldModalHidden=()=>{if(modal.hidden)render()};
 new MutationObserver(oldModalHidden).observe(modal,{attributes:true,attributeFilter:["hidden"]});
})();
