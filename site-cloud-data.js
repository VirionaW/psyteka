"use strict";
/* Account-scoped sync. Never put pupil assessments in localStorage. */
(function(){
 const identity=window.PSY_IDENTITY;
 let user=null,client=null,queue=Promise.resolve(),loading=true,dirtyPending=false;
 const blank=()=>({favorites:[],folders:[]});
 const key=()=>user?"psy-collections-v1:"+user.id:null;
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
  const {data,error}=await client.from("psy_user_collections").select("data").eq("user_id",user.id).maybeSingle();
  if(error){message("Избранное не синхронизировано: "+error.message);loading=false;return false}
  if(data?.data){if(!dirtyPending)putLocal(data.data)}else{
   const local=readLocal();
   if(local.favorites.length||local.folders.length){
    const write=await client.from("psy_user_collections").upsert({user_id:user.id,data:local,updated_at:new Date().toISOString()});
    if(write.error)message("Не удалось перенести подборки на сервер: "+write.error.message);
   }
  }
  loading=false;
  window.dispatchEvent(new CustomEvent("psy-collections-synced"));
  return true;
 }).catch(e=>{loading=false;message("Ошибка облачного подключения: "+e.message);return false});
 const saveCollections=d=>{
  const copy=normalize(d);
  dirtyPending=true;putLocal(copy);
  queue=queue.catch(()=>{}).then(async()=>{
   await ready;
   if(!client||!user)throw Error("Для синхронизации нужен вход в аккаунт");
   const {error}=await client.from("psy_user_collections").upsert({user_id:user.id,data:copy,updated_at:new Date().toISOString()});
   if(error)throw error;
   dirtyPending=false;putLocal(copy);
   window.dispatchEvent(new CustomEvent("psy-collections-synced"));
  }).catch(e=>{message("Папки сохранены на этом устройстве, но облачная синхронизация не удалась: "+e.message);throw e});
  return queue;
 };
 function validSnapshot(snapshot){
  if(!snapshot||!["one","class"].includes(snapshot.calcMode))throw Error("Неверный режим");
  if(!Array.isArray(snapshot.rows)||snapshot.rows.length>300)throw Error("В одном сохранении допускается не более 300 участников");
  const rows=snapshot.rows.map(r=>({
   name:String(r.name||"").slice(0,120),
   answers:Array.isArray(r.answers)?r.answers.slice(0,100):[],
   ageYears:Number.isInteger(r.ageYears)?r.ageYears:null,
   sex:r.sex==="m"||r.sex==="f"?r.sex:null,
   schoolGrade:Number.isInteger(r.schoolGrade)?r.schoolGrade:null,
   ageManual:r.ageManual===true,
   attendance:r.attendance==="absent"?"absent":"present"
  }));
  return {calcMode:snapshot.calcMode,rows,rowIndex:Math.min(rows.length-1,Math.max(0,Number(snapshot.rowIndex)||0))};
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
 async function listAssessments(){
  await ready;if(!client||!user)throw Error("Войдите в аккаунт");
  const {data,error}=await client.from("psy_saved_assessments").select("id,title,method_name,updated_at,created_at").eq("user_id",user.id).order("updated_at",{ascending:false}).limit(150);
  if(error)throw error;return data||[];
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
 window.PSY_CLOUD={ready,saveCollections,saveAssessment,listAssessments,getAssessment,deleteAssessment,readCollections:readLocal,isReady:()=>!loading};
})();