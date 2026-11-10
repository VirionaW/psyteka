"use strict";
(function(){
 const $=id=>document.getElementById(id),identity=window.PSY_IDENTITY,cloud=window.PSY_CLOUD;
 let client=null,user=null,org=null,memberRole="member";
 let folders=[],selectedFolder="all",sharedItems=[],teamDocuments=[];
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
  await loadFolders();
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

 function selected(item){
  return selectedFolder==="all"||selectedFolder==="none"&&!item.folder_id||selectedFolder===item.folder_id;
 }
 function showFolders(){
  const host=$("orgFolders");host.replaceChildren();
  const makeButton=(label,value,color)=>{
   const el=document.createElement("div");el.className="org-folder";el.dataset.selected=String(selectedFolder===value);
   const dot=document.createElement("span");dot.className="org-folder-dot";dot.style.setProperty("--folder-color",color||"#d9e4d9");
   const button=btn(label,()=>{selectedFolder=value;showFolders();renderShares();renderDocuments()});
   button.className="org-folder-main";button.setAttribute("aria-pressed",String(selectedFolder===value));
   el.append(dot,button);host.append(el);
   return el;
  };
  makeButton("Все материалы","all","#a5c1b0");
  makeButton("Без папки","none","#e7dcc2");
  folders.forEach(f=>{
   const count=sharedItems.filter(x=>x.folder_id===f.id).length+teamDocuments.filter(x=>x.folder_id===f.id).length;
   const el=makeButton(f.name+" · "+count,f.id,f.color);
   const edit=btn("Изменить",()=>openFolderDialog(f));edit.className="org-folder-small";edit.title="Переименовать и изменить папку";
   const del=btn("×",()=>deleteFolder(f));del.className="org-folder-small";del.title="Удалить только папку, сохранив документы";
   el.append(edit,del);
  });
 }
 async function loadFolders(){
  const {data,error}=await client.from("psy_organization_folders")
   .select("id,name,color,description,created_at").eq("organization_id",org.id).order("created_at");
  if(error)throw error;folders=data||[];
  if(selectedFolder!=="all"&&selectedFolder!=="none"&&!folders.some(f=>f.id===selectedFolder))selectedFolder="all";
  showFolders();
 }
 function openFolderDialog(folder=null){
  $("orgFolderDialog").dataset.editId=folder?.id||"";
  $("orgFolderDialogTitle").textContent=folder?"Изменить папку":"Новая папка";
  $("orgFolderName").value=folder?.name||"";
  $("orgFolderDescription").value=folder?.description||"";
  $("orgFolderColor").value=folder?.color||"#78a88b";
  $("orgFolderDialog").showModal();
 }
 async function saveFolder(e){
  e.preventDefault();
  if(!org)return;
  const name=$("orgFolderName").value.trim(),description=$("orgFolderDescription").value.trim();
  const color=$("orgFolderColor").value;
  if(!name){status("Укажите название папки.",true);return}
  const id=$("orgFolderDialog").dataset.editId;
  $("orgFolderSave").disabled=true;
  try{
   if(id){
    const {data,error}=await client.from("psy_organization_folders")
     .update({name,description,color}).eq("organization_id",org.id).eq("id",id).select("id").single();
    if(error||!data)throw error||Error("Папка не найдена");
   }else{
    const {data,error}=await client.from("psy_organization_folders")
     .insert({organization_id:org.id,created_by:user.id,name,description,color}).select("id").single();
    if(error||!data)throw error||Error("Папка не создана");
    selectedFolder=data.id;
   }
   $("orgFolderDialog").close();await loadFolders();
   renderShares();renderDocuments();status(id?"Папка обновлена.":"Папка создана.");
  }catch(e){status("Не удалось сохранить папку: "+e.message,true)}
  finally{$("orgFolderSave").disabled=false}
 }
 async function deleteFolder(folder){
  if(!confirm("Удалить папку «"+folder.name+"»? Документы и общие результаты останутся в разделе «Без папки»."))return;
  try{
   const {error}=await client.from("psy_organization_folders").delete().eq("id",folder.id).eq("organization_id",org.id);
   if(error)throw error;
   selectedFolder="all";
   await loadFolders();await Promise.all([loadShares(),loadDocs()]);
   status("Папка удалена. Все документы и результаты сохранены.");
  }catch(e){status("Не удалось удалить папку: "+e.message,true)}
 }
 function folderSelect(record,kind){
  const wrapper=document.createElement("label");wrapper.className="org-folder-label";wrapper.textContent="Папка: ";
  const select=document.createElement("select");select.className="org-folder-picker";select.setAttribute("aria-label","Папка для "+record.title);
  select.add(new Option("Без папки",""));
  folders.forEach(f=>select.add(new Option(f.name,f.id)));
  select.value=record.folder_id||"";
  select.onchange=async()=>{
   select.disabled=true;
   try{
    const table=kind==="share"?"psy_organization_shares":"psy_organization_documents";
    const payload={folder_id:select.value||null};
    if(kind==="document")payload.revision=record.revision+1;
    let q=client.from(table).update(payload).eq("id",record.id).eq("organization_id",org.id);
    if(kind==="document")q=q.eq("revision",record.revision);
    const {data,error}=await q.select("id");
    if(error)throw error;
    if(!data?.length)throw Error("Документ уже изменен коллегой. Обновите список.");
    await Promise.all([loadShares(),loadDocs()]);
    status("Материал перемещен в папку.");
   }catch(e){status("Не удалось переместить материал: "+e.message,true);select.value=record.folder_id||""}
   finally{select.disabled=false}
  };
  wrapper.append(select);return wrapper;
 }

 async function loadShares(){
  const {data,error}=await client.from("psy_organization_shares")
   .select("id,title,method_name,shared_by,shared_at,folder_id")
   .eq("organization_id",org.id).order("shared_at",{ascending:false}).limit(150);
  if(error)throw error;
  sharedItems=data||[];renderShares();showFolders();
 }
 function renderShares(){
  const list=$("orgShares");list.replaceChildren();
  const visible=sharedItems.filter(selected);
  if(!visible.length){
   list.textContent=sharedItems.length?"В выбранной папке нет общих результатов.":"Общих результатов пока нет. Добавьте конкретное обследование из личных сохранений.";
   return;
  }
  visible.forEach(x=>{
   const actions=[folderSelect(x,"share"),btn("Просмотреть",()=>previewShare(x))];
   if(x.shared_by===user.id||memberRole==="owner")actions.push(btn("Убрать из общего доступа",async()=>{
    if(!confirm("Убрать этот результат из общего доступа? Личное сохранение останется."))return;
    try{
     const {error}=await client.from("psy_organization_shares").delete().eq("organization_id",org.id).eq("id",x.id);
     if(error)throw error;
     await loadShares();status("Общий доступ отозван.");
    }catch(e){status(e.message,true)}
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
  const {data,error}=await client.from("psy_organization_documents")
   .select("id,title,updated_at,revision,folder_id")
   .eq("organization_id",org.id).order("updated_at",{ascending:false}).limit(150);
  if(error)throw error;teamDocuments=data||[];renderDocuments();showFolders();
 }
 function renderDocuments(){
  const list=$("orgDocuments");list.replaceChildren();
  const visible=teamDocuments.filter(selected);
  if(!visible.length){
   list.textContent=teamDocuments.length?"В выбранной папке нет совместных отчетов.":"Пока нет совместных документов. Создайте первый отчет.";
   return;
  }
  visible.forEach(x=>{
   const a=document.createElement("a");a.className="org-btn";a.textContent="Редактировать";
   a.href="/report-builder?organization="+encodeURIComponent(org.id)+"&teamdoc="+encodeURIComponent(x.id);
   list.append(item(x.title,"Редакция "+x.revision+" · "+new Date(x.updated_at).toLocaleString("ru-RU"),
    [folderSelect(x,"document"),a]));
  });
 }
 async function init(){
  $("orgAddFolder").onclick=()=>openFolderDialog();
  $("orgFolderCancel").onclick=()=>$("orgFolderDialog").close();
  $("orgFolderForm").onsubmit=saveFolder;
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
