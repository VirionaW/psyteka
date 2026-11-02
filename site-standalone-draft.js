"use strict";
(function(){
 const app=window.PSY_STANDALONE_DRAFT,api=window.PSY_CLOUD;
 if(!app||!api?.upsertDraft||!app.name||!app.get||!app.restore)return;
 let timer=null,pending=Promise.resolve(),last="",restoring=false;
 const param=new URLSearchParams(location.search);
 const force=param.has("draft");
 function notice(msg,failed){
  let n=document.getElementById("psyStandaloneDraftNotice");
  if(!n){n=document.createElement("p");n.id="psyStandaloneDraftNotice";n.setAttribute("role","status");
   n.style.cssText="font:13px/1.45 system-ui;padding:6px 12px;margin:10px auto;max-width:660px;text-align:center";
   document.body.prepend(n)}
  n.textContent=msg;n.style.color=failed?"#a64425":"#41755a";
 }
 function snapshot(){
  const data=app.get();
  return {calcMode:"one",rowIndex:0,rows:[{name:"Рабочий протокол",answers:[],payload:data}]};
 }
 function hasResults(data){
  if(!data)return false;
  return Array.isArray(data.students)?data.students.length>0:
    Array.isArray(data.people)?data.people.length>0||Object.values(data.byVariant||{}).some(x=>x.people?.length):false;
 }
 function flush(){
  clearTimeout(timer);timer=null;
  const state=app.get();
  if(!hasResults(state))return;
  const snap=snapshot(),raw=JSON.stringify(snap);
  if(raw===last)return;
  pending=pending.catch(()=>{}).then(()=>api.upsertDraft({methodName:app.name,snapshot:snap})).then(()=>{
   last=raw;notice("Черновик сохранен в профиле",false);
  }).catch(()=>notice("Автосохранение недоступно. Проверьте вход в аккаунт.",true));
 }
 function schedule(){clearTimeout(timer);timer=setTimeout(flush,950)}
 async function restore(){
  if(restoring)return;restoring=true;
  try{
   await api.ready;
   const item=await api.getDraft(app.name,"one");
   const old=item?.snapshot?.rows?.[0]?.payload;
   if(!hasResults(old))return;
   if(hasResults(app.get())&&!force)return;
   if(force||confirm("Найден сохраненный черновик. Восстановить его из профиля?")){
    app.restore(old);last=JSON.stringify(item.snapshot);
    notice("Черновик восстановлен из профиля",false);
   }
  }catch(_){}
  finally{restoring=false}
 }
 document.addEventListener("input",schedule,true);
 document.addEventListener("change",e=>setTimeout(schedule,0),true);
 document.addEventListener("click",e=>{if(e.target?.closest?.("button"))setTimeout(schedule,0)},true);
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")flush()});
 window.addEventListener("pagehide",flush);
 void restore();
 window.PSY_STANDALONE_AUTOSAVE={flush,restore};
})();