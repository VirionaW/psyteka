"use strict";
(async function(){
 const config=window.PSY_AUTH_CONFIG||{};
 const status=document.getElementById("usersStatus");
 const panel=document.getElementById("usersPanel");
 const list=document.getElementById("usersList");
 const search=document.getElementById("usersSearch");
 const previous=document.getElementById("usersPrevious");
 const next=document.getElementById("usersNext");
 const pageLabel=document.getElementById("usersPageLabel");
 let client=null,page=1,lastPage=1,users=[],ownerId="",busy=false;
 function say(text,error=false){
  status.textContent=text;status.classList.toggle("error",error);
 }
 function element(tag,className,text){
  const el=document.createElement(tag);
  if(className)el.className=className;
  if(text!==undefined)el.textContent=text;
  return el;
 }
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.url||"")||
     !/^sb_publishable_[A-Za-z0-9_-]+$/.test(config.publishableKey||"")||
     !window.supabase?.createClient){
  say("Регистрация еще не подключена. Панель владельца станет доступной после настройки базы аккаунтов.");
  return;
 }
 client=window.supabase.createClient(config.url,config.publishableKey,{auth:{
  flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:true
 }});
 try{
  const {data:userData,error:userError}=await client.auth.getUser();
  if(userError||!userData?.user){say("Сначала войдите в личный аккаунт.");return;}
  ownerId=userData.user.id;
  const {data:roleData,error:roleError}=await client.from("psy_account_roles")
   .select("role").eq("user_id",ownerId).maybeSingle();
  if(roleError){say("Не удалось подтвердить полномочия.",true);return;}
  if(roleData?.role!=="owner"&&roleData?.role!=="shadow"){say("Управление доступно Владельцу и Тени.",true);return;}
  // The Edge Function independently verifies the JWT assurance level.
  // Do not expose a list of email addresses to an aal1 owner session.
  const {data:aal,error:aalError}=await client.auth.mfa.getAuthenticatorAssuranceLevel();
  if(aalError || aal?.currentLevel!=="aal2"){
   document.getElementById("usersMfaRequired").hidden=false;
   say("Для управления участниками необходимо подтвердить защиту «Вендиго».");
   return;
  }
  panel.hidden=false;
  say(roleData.role==="shadow"?"Вы вошли как Тень. Защита подтверждена.":"Вы вошли как Владелец. Защита подтверждена.");
 }catch(_){say("Не удалось проверить аккаунт.",true);return;}

 async function call(body){
  const {data,error}=await client.functions.invoke("manage-user-roles",{body});
  if(error)throw new Error("Ошибка запроса к серверу. Проверьте подключение.");
  if(data?.error)throw new Error(data.error);
  return data;
 }
 function draw(){
  list.replaceChildren();
  const q=search.value.trim().toLocaleLowerCase("ru");
  const shown=users.filter(u=>String(u.email).toLocaleLowerCase("ru").includes(q));
  if(!shown.length)list.appendChild(element("div","psy-empty","На этой странице пользователи не найдены."));
  for(const user of shown){
   const row=element("article","psy-users-row");
   const main=element("div","psy-user-main");
   main.appendChild(element("div","psy-user-mail",user.email||"Адрес не указан"));
   main.appendChild(element("small","psy-user-status",user.confirmed?"Почта подтверждена":"Почта не подтверждена"));
   const actions=element("div","psy-user-controls");
   if(user.role==="owner"||user.id===ownerId){
    actions.appendChild(element("span","psy-user-role","Владелец"));
   }else{
    const select=element("select");
    select.setAttribute("aria-label","Роль пользователя "+(user.email||""));
    const opts=[["participant","Участник"],["moderator","Модератор"]];
    for(const [value,label] of opts){
     const option=element("option","",label);option.value=value;option.selected=user.role===value;
     select.appendChild(option);
    }
    const save=element("button","", "Сохранить роль");
    save.type="button";save.disabled=!user.confirmed;
    save.addEventListener("click",async()=>{
     if(busy)return;
     const role=select.value;
     if(role===user.role){say("Роль уже сохранена.");return;}
     if(!window.confirm((role==="moderator"?"Назначить модератором: ":"Снять права модератора: ")+(user.email||"") +"?"))return;
     busy=true;save.disabled=true;say("Сохраняем изменение роли...");
     try{
      const result=await call({action:"set",userId:user.id,role});
      if(result?.ok){user.role=role;say("Роль пользователя изменена.");draw();}
      else say("Не удалось сохранить роль.",true);
     }catch(err){say(err.message||"Не удалось изменить роль.",true)}
     finally{busy=false;save.disabled=false;}
    });
    actions.append(select,save);
   }
   row.append(main,actions);list.appendChild(row);
  }
  previous.disabled=busy||page<=1;
  next.disabled=busy||page>=lastPage;
  pageLabel.textContent="Страница "+page+(lastPage>1?" из "+lastPage:"");
 }
 async function load(targetPage){
  if(busy)return;
  busy=true;previous.disabled=true;next.disabled=true;
  say("Загружаем список участников...");
  try{
   const data=await call({action:"list",page:targetPage});
   users=Array.isArray(data?.users)?data.users:[];
   page=targetPage;
   lastPage=Math.max(1,Number(data?.totalPages)||1);
   say("Права участников доступны только Владельцу и Тени после подтверждения защиты.");
  }catch(e){say(e.message||"Не удалось загрузить список участников.",true)}
  finally{busy=false;draw();}
 }
 search.addEventListener("input",draw);
 previous.addEventListener("click",()=>load(page-1));
 next.addEventListener("click",()=>load(page+1));
 document.getElementById("usersRefresh").addEventListener("click",()=>load(page));
 await load(1);
})();
