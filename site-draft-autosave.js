"use strict";
/* Account-only draft sync. Never overwrite a newer draft by merely opening a
   historical saved assessment. Keep restoration deliberate and verifiable. */
(function(){
 const modal=document.getElementById("modal");
 if(!modal)return;
 const queue=new Map(),saved=new Map(),prompted=new Set();
 let timer=null,checking=null;
 const bridge=()=>window.PSY_DRAFT_BRIDGE;
 const state=()=>window.PSY_PROCESSING_NOTEBOOK?.getState?.();
 const isEditable=()=>{const s=state();return s?.visible&&["score","processing"].includes(s.tab);};
 function status(message,failed){
  if(modal.hidden)return;
  let n=modal.querySelector("#psyDraftStatus");
  if(!n){n=document.createElement("small");n.id="psyDraftStatus";n.setAttribute("role","status");
   n.style.cssText="display:inline-block;padding:4px 7px;font:12px/1.4 system-ui;max-width:460px";
   (modal.querySelector("#modalAuthor")||modal.querySelector(".modalhead"))?.append(n);
  }
  n.textContent=message;n.style.color=failed?"#a04424":"#557460";
 }
 function filled(s){return (s?.rows||[]).some(r=>
  String(r.name||"").trim()||
  Array.isArray(r.answers)&&r.answers.some(v=>v!==""&&v!=null)||
  Object.keys(r).some(k=>!["name","answers","ageYears","sex","schoolGrade","ageManual","attendance"].includes(k)&&r[k]!=null&&JSON.stringify(r[k])!=="{}"))}
 function take(){try{const d=bridge()?.get?.();return d&&filled(d.snapshot)?d:null}catch(_){return null}}
 const keyOf=d=>d.methodName+"::"+d.snapshot.calcMode;
 // Supabase stores jsonb and may reorder object keys. Compare values, not key order.
 const canonical=value=>Array.isArray(value)?value.map(canonical):
  value&&typeof value==="object"?Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])])):value;
 const equalRows=(a,b)=>JSON.stringify(canonical(a?.rows||[]))===JSON.stringify(canonical(b?.rows||[]));
 function recoveryControl(){
  let button=modal.querySelector("#psyDraftRecover");
  if(!button){
   button=document.createElement("button");button.type="button";button.id="psyDraftRecover";
   button.textContent="Открыть черновик";
   button.style.cssText="display:none;margin:4px 8px 4px 0;border:1px solid #a4c5ae;background:transparent;color:inherit;border-radius:8px;padding:7px 10px;font:600 12px system-ui;cursor:pointer";
   button.onclick=async()=>{
    const s=state(),cloud=window.PSY_CLOUD;
    if(!s?.methodName||!cloud?.getDraft)return;
    button.disabled=true;
    try{
     const draft=await cloud.getDraft(s.methodName,s.mode);
     if(!draft){status("Для этого режима сохранённый черновик не найден.",true);return;}
     const current=bridge()?.get?.()?.snapshot;
     if(equalRows(current,draft.snapshot)){
      status("Черновик уже открыт. Все ответы совпадают с облачной копией.",false);return;
     }
     const title=s.assessmentId?"Сейчас открыт ранее сохранённый результат.":"В текущем окне могут быть несохранённые изменения.";
     if(!confirm(title+"\n\nОткрыть облачный черновик? Текущие данные на экране будут заменены. "+
      "Сохранённое обследование в профиле при этом НЕ удалится и НЕ изменится."))return;
     if(bridge()?.restore?.({methodName:s.methodName,snapshot:draft.snapshot})){
      saved.set(keyOf({methodName:s.methodName,snapshot:draft.snapshot}),JSON.stringify(draft.snapshot));
      status("Облачный черновик открыт. Проверьте ответы и сохраните результат в профиль.",false);
     }
    }catch(e){status("Не удалось открыть черновик: "+String(e?.message||"ошибка подключения"),true)}
    finally{button.disabled=false;}
   };
   (modal.querySelector("#modalAuthor")||modal.querySelector(".modalhead"))?.append(button);
  }
  return button;
 }
 async function showRecovery(){
  const s=state(),cloud=window.PSY_CLOUD;
  const btn=recoveryControl();
  btn.style.display="none";
  if(!isEditable()||!cloud?.getDraft)return;
  const key=s.methodName+"::"+s.mode;
  if(checking===key)return;
  checking=key;
  try{
   const draft=await cloud.getDraft(s.methodName,s.mode);
   if(state()?.methodName!==s.methodName||state()?.mode!==s.mode)return;
   if(draft&&!equalRows(bridge()?.get?.()?.snapshot,draft.snapshot)){
    btn.style.display="";
    btn.title="Посмотреть автосохранённую копию обследования в профиле. Заменяет текущий экран только с подтверждением.";
   }
  }catch(_){}
  finally{checking=null}
 }
 function flush(){
  clearTimeout(timer);timer=null;
  const s=state();
  if(!isEditable())return;
  // Opening/clicking an older saved result must NEVER replace a newer cloud draft.
  if(s?.assessmentId)return;
  const draft=take(),cloud=window.PSY_CLOUD;
  if(!draft||!cloud?.upsertDraft)return;
  const key=keyOf(draft),raw=JSON.stringify(draft.snapshot);
  if(saved.get(key)===raw)return;
  const next=(queue.get(key)||Promise.resolve()).catch(()=>{}).then(async()=>{
   await cloud.upsertDraft(draft);
   // Round-trip verification: do not claim that data are saved if reading them
   // back fails or the stored answers don't match the submitted snapshot.
   if(cloud.getDraft){
    const check=await cloud.getDraft(draft.methodName,draft.snapshot.calcMode);
    if(!check||!equalRows(check.snapshot,draft.snapshot))throw Error("Контрольная проверка данных в облаке не прошла");
   }
   saved.set(key,raw);
   if(state()?.methodName===draft.methodName&&state()?.mode===draft.snapshot.calcMode){
    status("Черновик сохранён в профиле и проверен · "+new Date().toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"}),false);
   }
   window.dispatchEvent(new Event("psy-draft-saved"));
  }).catch(e=>{
   if(state()?.methodName===draft.methodName)
    status("Черновик НЕ подтверждён в облаке: "+String(e?.message||"ошибка")+". Сохраните результат вручную.",true);
  });
  queue.set(key,next);
 }
 function schedule(){
  if(!isEditable()||state()?.assessmentId)return;
  clearTimeout(timer);timer=setTimeout(flush,850);
 }
 async function restore(){
  const s=state(),cloud=window.PSY_CLOUD;
  if(!isEditable()||!cloud?.getDraft)return;
  // Show a manual recovery path even when the pupil roster is already populated
  // or the user is viewing an older explicitly saved assessment.
  void showRecovery();
  if(s.assessmentId)return;
  const current=bridge()?.get?.()?.snapshot;
  if(filled(current))return;
  const q=new URLSearchParams(location.search);
  const forced=q.get("method")===s.methodName&&["one","class"].includes(q.get("draft"));
  const mode=forced?q.get("draft"):s.mode,key=s.methodName+"::"+mode;
  if(prompted.has(key))return;prompted.add(key);
  try{
   const draft=await cloud.getDraft(s.methodName,mode);
   if(!draft||state()?.methodName!==s.methodName||state()?.assessmentId)return;
   if(filled(bridge()?.get?.()?.snapshot))return;
   if(forced||confirm("Восстановить автосохранённый черновик из профиля?")){
    if(bridge()?.restore?.({methodName:s.methodName,snapshot:draft.snapshot})){
     saved.set(key,JSON.stringify(draft.snapshot));
     status("Черновик восстановлен из профиля.",false);
    }
   }
  }catch(_){}
 }
 document.addEventListener("input",e=>{if(e.target?.closest?.("#modal"))schedule()},true);
 document.addEventListener("change",e=>{if(e.target?.closest?.("#modal"))setTimeout(schedule,0)},true);
 document.addEventListener("click",e=>{
  if(e.target?.closest?.("#modal button"))setTimeout(schedule,0);
 },true);
 window.addEventListener("psy-processing-view-change",()=>{setTimeout(restore,0)});
 window.addEventListener("psy-assessment-dirty",schedule);
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")flush()});
 window.addEventListener("pagehide",flush);
 window.PSY_DRAFTS={flush,restore,showRecovery};
})();