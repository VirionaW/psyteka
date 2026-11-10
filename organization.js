"use strict";
(function(){
 const $=id=>document.getElementById(id),identity=window.PSY_IDENTITY,cloud=window.PSY_CLOUD;
 let client=null,user=null,org=null,memberRole="member";
 const status=(s,error=false)=>{$("orgStatus").textContent=s;$("orgStatus").dataset.error=String(error)};
 function item(title,desc,buttons=[]){
  const el=document.createElement("div");el.className="org-item";const main=document.createElement("div"),strong=document.createElement("strong"),small=document.createElement("small");
  strong.textContent=title;small.textContent=desc;main.append(strong,small);el.append(main);
  if(buttons.length){const ops=document.createElement("div");ops.className="org-item-actions";buttons.forEach(o=>ops.append(o));el.append(ops)}
  return el;
 }
 function btn(label,onClick){const b=document.createElement("button");b.className="org-btn";b.type="button";b.textContent=label;b.onclick=onClick;return b}
 async function rpc(name,args){const {data,error}=await client.rpc(name,args);if(error)throw error;return data}
 async function findOrg(){
  const {data,error}=await client.from("psy_organization_members").select("organization_id,member_role").eq("user_id",user.id).limit(20);
  if(error)throw error;
  if(!data?.length){org=null;$("orgSetup").hidden=false;$("orgWork").hidden=true;
   const token=new URLSearchParams(location.search).get("invite");
   if(token)$("orgInviteCode").value=token;
   status("Можно создать организацию или присоединиться по приглашению.");return}
  const choice=data[0];memberRole=choice.member_role;
  const result=await client.from("psy_organizations").select("id,name,owner_id").eq("id",choice.organization_id).single();
  if(result.error)throw result.error;
  org=result.data;$("orgSetup").hidden=true;$("orgWork").hidden=false;
  $("orgName").textContent=org.name;$("orgRole").textContent=memberRole==="owner"?"Руководитель":"Сотрудник";
  $("orgInvitePanel").hidden=memberRole!=="owner";$("orgLeave").hidden=memberRole==="owner";
  $("orgCombine").href="/report-builder?organization="+encodeURIComponent(org.id);
  $("orgNewDoc").href=$("orgCombine").href;
  status("Кабинет организации открыт. Личные обследования не передаются автоматически.");
  await Promise.all([loadMembers(),loadOwn(),loadShares(),loadDocs()]);
 }
 async function loadMembers(){
  const list=$("orgMembers");
  const {data,error}=await client.from("psy_organization_members").select("organization_id,user_id,member_role,joined_at").eq("organization_id",org.id).order("joined_at");
  if(error)throw error;list.replaceChildren();
  $("orgPlaceCount").textContent=(data?.length||0)+" из 3 мест занято";
  (data||[]).forEach(m=>{
   const self=m.user_id===user.id;
   const actions=[];
   if(memberRole==="owner"&&m.member_role!=="owner")actions.push(btn("Исключить",async()=>{
    if(!confirm("Удалить доступ сотрудника к общим результатам и документам?"))return;
    try{const {error}=await client.from("psy_organization_members").delete().eq("organization_id",org.id).eq("user_id",m.user_id);if(error)throw error;await loadMembers();status("Доступ сотрудника отозван.")}catch(e){status(e.message,true)}
   }));
   list.append(item(m.member_role==="owner"?"Руководитель":self?"Вы":"Сотрудник "+m.user_id.slice(0,8), "Присоединился: "+new Date(m.joined_at).toLocaleDateString("ru-RU"),actions));
  });
 }
 async function loadOwn(){
  const select=$("orgOwnAssessments");select.replaceChildren(new Option("Выберите сохранение",""));
  try{const data=await cloud.listAssessments();data.forEach(x=>select.add(new Option(x.title+" · "+x.method_name,x.id)))}catch(e){status("Не удалось загрузить личные сохранения: "+e.message,true)}
 }
 async function loadShares(){
  const list=$("orgShares"),{data,error}=await client.from("psy_organization_shares").select("id,title,method_name,shared_by,shared_at").eq("organization_id",org.id).order("shared_at",{ascending:false}).limit(100);
  if(error)throw error;list.replaceChildren();
  if(!data.length){list.textContent="Общих результатов пока нет. Добавьте конкретное обследование из личных сохранений.";return}
  data.forEach(x=>{
   const actions=[btn("Просмотреть",()=>previewShare(x))];
   if(x.shared_by===user.id||memberRole==="owner")actions.push(btn("Убрать из общего доступа",async()=>{
    if(!confirm("Убрать этот результат из общего доступа? Личное сохранение останется."))return;
    try{const {error}=await client.from("psy_organization_shares").delete().eq("id",x.id);if(error)throw error;await loadShares();status("Общий доступ отозван.")}catch(e){status(e.message,true)}
   }));
   list.append(item(x.title,x.method_name+" · добавлено "+new Date(x.shared_at).toLocaleDateString("ru-RU"),actions));
  });
 }
 async function previewShare(x){
  try{
   const {data,error}=await client.from("psy_organization_shares").select("title,method_name,snapshot").eq("organization_id",org.id).eq("id",x.id).single();if(error)throw error;
   $("orgPreviewTitle").textContent=data.title+" · "+data.method_name;
   const box=$("orgPreviewBody");box.replaceChildren();
   const p=document.createElement("p");p.textContent="Зафиксированные при сохранении результаты. Расчеты не пересчитываются и не изменяются.";box.append(p);
   (data.snapshot?.rows||[]).forEach((r,i)=>{
    const title=document.createElement("h3"),score=document.createElement("pre");
    title.textContent=r.name||"Участник "+(i+1);
    const z=data.snapshot?.scoreArchive?.results?.[i];
    score.textContent=z?JSON.stringify(z,null,2):"В сохранении нет зафиксированного расчета";
    box.append(title,score);
   });
   $("orgPreview").showModal();
  }catch(e){status("Не удалось открыть общий результат: "+e.message,true)}
 }
 async function loadDocs(){
  const list=$("orgDocuments"),{data,error}=await client.from("psy_organization_documents").select("id,title,updated_at,revision").eq("organization_id",org.id).order("updated_at",{ascending:false}).limit(100);
  if(error)throw error;list.replaceChildren();
  if(!data.length){list.textContent="Пока нет совместных документов. Создайте первый отчет.";return}
  data.forEach(x=>list.append(item(x.title,"Редакция "+x.revision+" · "+new Date(x.updated_at).toLocaleString("ru-RU"),
   [(()=>{const a=document.createElement("a");a.className="org-btn";a.textContent="Редактировать";a.href="/report-builder?organization="+org.id+"&teamdoc="+x.id;return a})()])));
 }
 async function init(){
  $("orgCreateForm").onsubmit=async e=>{e.preventDefault();try{const name=$("orgCreateName").value.trim();await rpc("psy_create_organization",{_name:name});await findOrg()}catch(err){status("Не удалось создать кабинет: "+err.message,true)}};
  $("orgJoinForm").onsubmit=async e=>{e.preventDefault();try{
   const code=$("orgInviteCode").value.trim();if(!/^[a-f0-9-]{36}$/i.test(code))throw Error("Проверьте код приглашения");
   await rpc("psy_join_organization",{_code:code});history.replaceState(null,"","/organization");await findOrg();
  }catch(err){status("Не удалось присоединиться: "+err.message,true)}};
  $("orgMakeInvite").onclick=async()=>{if(!org)return;try{
   const code=await rpc("psy_create_organization_invite",{_org:org.id});
   $("orgInviteURL").value=location.origin+"/organization?invite="+code;
   $("orgInviteLink").hidden=false;status("Приглашение создано на 24 часа. Отправьте ссылку сотруднику лично.");
  }catch(e){status(e.message,true)}};
  $("orgCopyInvite").onclick=async()=>{try{await navigator.clipboard.writeText($("orgInviteURL").value);status("Ссылка приглашения скопирована.")}catch(e){$("orgInviteURL").select();status("Скопируйте выделенную ссылку вручную.")}};
  $("orgShare").onclick=async()=>{const id=$("orgOwnAssessments").value;if(!id){status("Выберите конкретное сохранение.",true);return}
   if(!confirm("Передать выбранный результат коллегам организации? Коллеги смогут прочитать сохраненные данные этого обследования."))return;
   try{await rpc("psy_share_organization_assessment",{_org:org.id,_assessment:id});await loadShares();status("Результат добавлен в общий кабинет.")}catch(e){status(e.message,true)}};
  $("orgLeave").onclick=async()=>{if(!confirm("Покинуть организацию? Общие данные больше не будут вам доступны."))return;
   try{const {error}=await client.from("psy_organization_members").delete().eq("organization_id",org.id).eq("user_id",user.id);if(error)throw error;await findOrg()}catch(e){status(e.message,true)}};
  $("orgPreviewClose").onclick=()=>$("orgPreview").close();
  try{
   await identity?.ready;user=identity?.user&&!identity.user.is_anonymous?identity.user:null;
   if(!user){status("Войдите в личный аккаунт для организации совместной работы.",true);$("orgSetup").hidden=false;$("orgSetup").innerHTML='<div class="org-card org-card-wide"><a class="org-btn org-primary" href="/?entry=1">Войти в Метоларию</a></div>';return}
   client=identity.client;await cloud?.ready;await findOrg();
  }catch(e){status("Не удалось открыть кабинет: "+e.message,true)}
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
