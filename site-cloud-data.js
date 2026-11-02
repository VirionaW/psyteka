"use strict";
/* Account-scoped sync. Never put pupil assessments in localStorage. */
(function(){
 const identity=window.PSY_IDENTITY;
 let user=null,client=null,queue=Promise.resolve(),loading=true,dirtyPending=false;
 const blank=()=>({favorites:[],folders:[]});
 const key=()=>user?"psy-collections-v1:"+user.id:null;
 const pendingKey=()=>user?"psy-collections-pending-v1:"+user.id:null;
 const isPending=()=>{try{return !!(pendingKey()&&localStorage.getItem(pendingKey()))}catch(_){return false}};
 const setPending=flag=>{try{if(!pendingKey())return;if(flag)localStorage.setItem(pendingKey(),"1");else localStorage.removeItem(pendingKey())}catch(_){}};
 const mergeUnsent=(cloud,local)=>{
  const cloudData=normalize(cloud),localData=normalize(local),folders=cloudData.folders.slice();
  for(const f of localData.folders){
   const old=folders.find(x=>x.id===f.id);
   if(old){old.methods=[...new Set([...old.methods,...f.methods])];old.name=f.name;old.color=f.color;old.description=f.description}
   else folders.push(f);
  }
  return normalize({favorites:[...new Set([...cloudData.favorites,...localData.favorites])],folders});
 };
 const normalize=d=>({
  favorites:Array.isArray(d?.favorites)?[...new Set(d.favorites.filter(x=>typeof x==="string").map(x=>x.slice(0,220)))]:[],
  folders:Array.isArray(d?.folders)?d.folders.filter(f=>f&&typeof f.name==="string").map(f=>({
   id:String(f.id||""),name:f.name.slice(0,80),color:String(f.color||"#4b997b"),
   description:String(f.description||"").slice(0,250),
   methods:Array.isArray(f.methods)?[...new Set(f.methods.filter(x=>typeof x==="string"))]:[]
  })):[]
 });
 function readLocal(){try{return normalize(JSON.parse(localStorage.getItem(key())||"null"))}catch(_){return blank()}}
 function putLocal(data){try{if(key())localStorage.setItem(key(),JSON.stringify(normalize(data)))}catch(_){}}
 function message(value){
  window.dispatchEvent(new CustomEvent("psy-cloud-state",{detail:{message:value}}));
  if(!document.body)return;
  let node=document.getElementById("psyCloudNotice");
  if(!node){node=document.createElement("div");node.id="psyCloudNotice";node.className="psy-cloud-notice";node.setAttribute("role","alert");document.body.append(node)}
  node.textContent=value;node.hidden=false;
 }
 const ready=Promise.resolve(identity?.ready).then(async()=>{
  user=identity?.user||null;client=identity?.client||null;
  if(!user||!client){loading=false;return false}
  dirtyPending=dirtyPending||isPending();
  const {data,error}=await client.from("psy_user_collections").select("data").eq("user_id",user.id).maybeSingle();
  if(error){message("Избранное не синхронизировано: "+error.message);loading=false;return false}
  if(data?.data){
   if(dirtyPending){
    const recovered=mergeUnsent(data.data,readLocal());
    const write=await client.from("psy_user_collections").upsert({user_id:user.id,data:recovered,updated_at:new Date().toISOString()});
    if(write.error)message("Подборки остались на этом устройстве, облачное восстановление не выполнено: "+write.error.message);
    else{putLocal(recovered);dirtyPending=false;setPending(false)}
   }else putLocal(data.data);
  }else{
   const local=readLocal();
   if(local.favorites.length||local.folders.length){
    const write=await client.from("psy_user_collections").upsert({user_id:user.id,data:local,updated_at:new Date().toISOString()});
    if(write.error){dirtyPending=true;setPending(true);message("Не удалось перенести подборки на сервер: "+write.error.message)}
    else{dirtyPending=false;setPending(false)}
   }
  }
  loading=false;
  window.dispatchEvent(new CustomEvent("psy-collections-synced"));
  return true;
 }).catch(e=>{loading=false;message("Ошибка облачного подключения: "+e.message);return false});
 const saveCollections=d=>{
  const copy=normalize(d);
  dirtyPending=true;putLocal(copy);setPending(true);
  queue=queue.catch(()=>{}).then(async()=>{
   await ready;
   if(!client||!user)throw Error("Для синхронизации нужен вход в аккаунт");
   const {error}=await client.from("psy_user_collections").upsert({user_id:user.id,data:copy,updated_at:new Date().toISOString()});
   if(error)throw error;
   dirtyPending=false;setPending(false);putLocal(copy);
   window.dispatchEvent(new CustomEvent("psy-collections-synced"));
  }).catch(e=>{message("Папки сохранены на этом устройстве, но облачная синхронизация не удалась: "+e.message);throw e});
  return queue;
 };
 function validSnapshot(snapshot){
  if(!snapshot||!["one","class"].includes(snapshot.calcMode))throw Error("Неверный режим");
  if(!Array.isArray(snapshot.rows)||snapshot.rows.length>300)throw Error("В одном сохранении допускается не более 300 участников");
  // Preserve workflow-specific notes, answer sets and variants. The previous
  // reducer discarded these fields when saving, losing diagnostic data.
  const serialized=JSON.stringify(snapshot.rows);
  if(!serialized||serialized.length>850000)throw Error("Слишком большой объем результатов");
  const rows=JSON.parse(serialized).map(r=>{
   if(!r||typeof r!=="object"||Array.isArray(r))throw Error("Неверная запись участника");
   r.name=String(r.name||"").slice(0,120);
   r.answers=Array.isArray(r.answers)?r.answers.slice(0,500):[];
   return r;
  });
  // Keep a read-only record of the calculation at save time, independent
  // of later changes to keys, norms or method rendering.
  let scoreArchive=null;
  if(snapshot.scoreArchive&&typeof snapshot.scoreArchive==="object"){
   const raw=JSON.stringify(snapshot.scoreArchive);
   if(raw.length<=100000)scoreArchive=JSON.parse(raw);
  }
  return {calcMode:snapshot.calcMode,rows,rowIndex:Math.min(rows.length-1,Math.max(0,Number(snapshot.rowIndex)||0)),
   ...(scoreArchive?{scoreArchive}:{})};
 }
 async function saveAssessment({id=null,title,methodName,snapshot}){
  await ready;
  if(!user||!client)throw Error("Войдите в аккаунт");
  title=String(title||"").trim().slice(0,120);methodName=String(methodName||"").trim().slice(0,220);
  if(!title||!methodName)throw Error("Укажите название обследования");
  const payload={user_id:user.id,title,method_name:methodName,snapshot:validSnapshot(snapshot),updated_at:new Date().toISOString()};
  if(id)payload.id=id;
  const {data,error}=await client.from("psy_saved_assessments").upsert(payload).select("id,title").single();
  if(error)throw error;
  return data;
 }
 async function listAssessments(options){
  await ready;if(!client||!user)throw Error("Войдите в аккаунт");
  const methodName=typeof options?.methodName==="string"?options.methodName.trim().slice(0,220):"";
  let q=client.from("psy_saved_assessments")
   .select(methodName?"id,title,method_name,updated_at,created_at,snapshot":"id,title,method_name,updated_at,created_at")
   .eq("user_id",user.id);
  if(methodName)q=q.eq("method_name",methodName);
  const {data,error}=await q.order("updated_at",{ascending:false}).limit(methodName?150:150);
  if(error)throw error;
  // Notebook needs the mode only. Never put pupils' answers in the list.
  return methodName?(data||[]).map(x=>({id:x.id,title:x.title,method_name:x.method_name,
   updated_at:x.updated_at,created_at:x.created_at,calcMode:x.snapshot?.calcMode==="class"?"class":"one"})):data||[];
 }
 async function getAssessment(id){
  await ready;if(!client||!user)throw Error("Войдите в аккаунт");
  if(!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(String(id)))throw Error("Неверный идентификатор");
  const {data,error}=await client.from("psy_saved_assessments").select("id,title,method_name,snapshot").eq("user_id",user.id).eq("id",id).single();
  if(error)throw error;return {...data,snapshot:validSnapshot(data.snapshot)};
 }
 async function deleteAssessment(id){
  await ready;if(!client||!user)throw Error("Войдите в аккаунт");
  const {error}=await client.from("psy_saved_assessments").delete().eq("user_id",user.id).eq("id",id);
  if(error)throw error;
 }
 // Drafts are independent of manually saved assessments. Autosave cannot
 // overwrite or delete a named result, even if the method changes later.
 async function upsertDraft({methodName,snapshot}){
  await ready;
  if(!client||!user)throw Error("Войдите в аккаунт");
  methodName=String(methodName||"").trim().slice(0,220);
  if(!methodName)throw Error("Не выбрана методика");
  const safe=validSnapshot(snapshot);
  const {error}=await client.from("psy_assessment_drafts").upsert({
   user_id:user.id,method_name:methodName,calc_mode:safe.calcMode,
   snapshot:safe,updated_at:new Date().toISOString()
  },{onConflict:"user_id,method_name,calc_mode"});
  if(error)throw error;
 }
 async function listDrafts(){
  await ready;if(!client||!user)throw Error("Войдите в аккаунт");
  const {data,error}=await client.from("psy_assessment_drafts")
   .select("method_name,calc_mode,updated_at").eq("user_id",user.id)
   .order("updated_at",{ascending:false}).limit(250);
  if(error)throw error;return data||[];
 }
 async function getDraft(methodName,mode){
  await ready;if(!client||!user)throw Error("Войдите в аккаунт");
  if(!["one","class"].includes(mode))throw Error("Неверный режим");
  const {data,error}=await client.from("psy_assessment_drafts")
   .select("method_name,calc_mode,snapshot,updated_at").eq("user_id",user.id)
   .eq("method_name",String(methodName||"")).eq("calc_mode",mode).maybeSingle();
  if(error)throw error;return data?{...data,snapshot:validSnapshot(data.snapshot)}:null;
 }
 async function deleteDraft(methodName,mode){
  await ready;if(!client||!user)throw Error("Войдите в аккаунт");
  if(!["one","class"].includes(mode))throw Error("Неверный режим");
  const {error}=await client.from("psy_assessment_drafts").delete()
   .eq("user_id",user.id).eq("method_name",String(methodName||"")).eq("calc_mode",mode);
  if(error)throw error;
 }
 window.PSY_CLOUD={ready,saveCollections,saveAssessment,listAssessments,getAssessment,deleteAssessment,
  upsertDraft,listDrafts,getDraft,deleteDraft,readCollections:readLocal,isReady:()=>!loading};
})();