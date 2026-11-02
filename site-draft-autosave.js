"use strict";
(function(){
 const modal=document.getElementById("modal");
 if(!modal)return;
 const queue=new Map(),saved=new Map(),prompted=new Set();
 let timer=null;
 const bridge=()=>window.PSY_DRAFT_BRIDGE;
 function status(message,failed){
  if(modal.hidden)return;
  let n=modal.querySelector("#psyDraftStatus");
  if(!n){n=document.createElement("small");n.id="psyDraftStatus";n.setAttribute("role","status");
   n.style.cssText="display:inline-block;padding:4px 7px;font:12px/1.3 system-ui";
   modal.querySelector(".modalhead")?.append(n);
  }
  n.textContent=message;n.style.color=failed?"#a04424":"#557460";
 }
 function filled(s){return (s?.rows||[]).some(r=>String(r.name||"").trim()||Array.isArray(r.answers)&&r.answers.some(v=>v!==""&&v!=null)||Object.keys(r).some(k=>!["name","answers","ageYears","sex","schoolGrade","ageManual","attendance"].includes(k)&&r[k]!=null&&JSON.stringify(r[k])!=="{}"))}
 function take(){try{let d=bridge()?.get?.();return d&&filled(d.snapshot)?d:null}catch(_){return null}}
 function flush(){
  clearTimeout(timer);timer=null;
  const draft=take(),cloud=window.PSY_CLOUD;
  if(!draft||!cloud?.upsertDraft)return;
  const key=draft.methodName+"::"+draft.snapshot.calcMode,raw=JSON.stringify(draft.snapshot);
  if(saved.get(key)===raw)return;
  const next=(queue.get(key)||Promise.resolve()).catch(()=>{}).then(()=>cloud.upsertDraft(draft)).then(()=>{
    saved.set(key,raw);
   if(bridge()?.get?.()?.methodName===draft.methodName)status("Черновик сохранен в профиле",false);
   window.dispatchEvent(new Event("psy-draft-saved"));
  }).catch(()=>{
   if(bridge()?.get?.()?.methodName===draft.methodName)
    status("Не удалось сохранить черновик. Сохраните результат вручную.",true);
  });
  queue.set(key,next);
 }
 function schedule(){if(modal.hidden)return;clearTimeout(timer);timer=setTimeout(flush,800)}
 async function restore(){
  const state=window.PSY_PROCESSING_NOTEBOOK?.getState?.(),cloud=window.PSY_CLOUD;
  if(!state?.visible||!["score","processing"].includes(state.tab)||state.assessmentId||!cloud?.getDraft)return;
  if(filled(bridge()?.get?.()?.snapshot))return;
  const q=new URLSearchParams(location.search),forced=q.get("method")===state.methodName&&["one","class"].includes(q.get("draft"));
  const mode=forced?q.get("draft"):state.mode,key=state.methodName+"::"+mode;
  if(prompted.has(key))return;prompted.add(key);
  try{
   const draft=await cloud.getDraft(state.methodName,mode);
   if(!draft||window.PSY_PROCESSING_NOTEBOOK?.getState?.()?.methodName!==state.methodName)return;
   if(filled(bridge()?.get?.()?.snapshot))return;
   if(forced||confirm("Восстановить автосохраненный черновик из профиля?"))
    bridge()?.restore?.({methodName:state.methodName,snapshot:draft.snapshot});
  }catch(_){}
 }
 document.addEventListener("input",e=>{if(e.target?.closest?.("#modal"))schedule()},true);
 document.addEventListener("change",e=>{if(e.target?.closest?.("#modal"))setTimeout(schedule,0)},true);
 document.addEventListener("click",e=>{if(e.target?.closest?.("#modal button"))setTimeout(schedule,0)},true);
 window.addEventListener("psy-processing-view-change",()=>{setTimeout(restore,0)});
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")flush()});
 window.addEventListener("pagehide",flush);
 window.PSY_DRAFTS={flush,restore};
})();