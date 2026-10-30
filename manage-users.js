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
 const mfaPanel=document.getElementById("usersMfaRequired");
 let client=null,page=1,lastPage=1,users=[],ownerId="",busy=false,searchMode=false,requestSeq=0;
 function say(text,error=false){
  status.textContent=text;status.classList.toggle("error",error);
 }
 function requireMfa(){
  // AAL2 can lapse after the page was opened. Hide sensitive controls
  // rather than leave an apparently usable search with an error banner.
  ++requestSeq;busy=false;users=[];searchMode=false;
  panel.hidden=true;mfaPanel.hidden=false;list.replaceChildren();
  say("Для поиска аккаунтов и назначения модератора подтвердите защиту «Вендиго».");
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
  // The browser's local AAL can be stale immediately after MFA or
  // navigation. Ask the server to validate the *actual* authorization token
  // before exposing any directory entries. list() is AAL2-protected there.
  mfaPanel.hidden=true;panel.hidden=true;
  say("Проверяем защиту на сервере...");
 }catch(_){say("Не удалось проверить аккаунт.",true);return;}

 async function call(body){
  // Never trust a browser-only MFA flag for account administration. The
  // Edge Function authorizes every request, including list and search.
  // Retry once with a newly refreshed session token if the old JWT has an
  // outdated AAL claim after returning from the second-factor page.
  for(let attempt=0;attempt<2;attempt++){
   const {data,error}=await client.functions.invoke("manage-user-roles",{body});
   let reason="",code="";
   if(error){
    reason="Ошибка обращения к серверу. Проверьте подключение.";
    try{
     const details=await error.context?.json?.();
     if(typeof details?.error==="string")reason=details.error;
     if(typeof details?.code==="string")code=details.code;
    }catch(_){}
    if(!code&&error.context?.status===401)code="not_signed_in";
   }else if(data?.error){
    reason=String(data.error);code=String(data.code||"");
   }else return data;
   const mfaRequired=code==="mfa_required"||/подтвердите код|второй фактор/i.test(reason);
   if(mfaRequired&&attempt===0){
    try{
     const {data:refresh,error:refreshError}=await client.auth.refreshSession();
     if(!refreshError&&refresh?.session)continue;
    }catch(_){}
   }
   if(mfaRequired)requireMfa();
   const issue=new Error(reason||"Не удалось проверить доступ к управлению.");
   issue.code=mfaRequired?"mfa_required":code;
   throw issue;
  }
  throw new Error("Не удалось подтвердить доступ к управлению.");
 }
 function draw(){
  list.replaceChildren();
  const q=search.value.trim().toLocaleLowerCase("ru");
  const shown=searchMode?users:users.filter(u=>String(u.email).toLocaleLowerCase("ru").includes(q));
  if(!shown.length)list.appendChild(element("div","psy-empty",searchMode?"Аккаунт по указанной почте не найден. Проверьте адрес и подтверждение регистрации.":"На этой странице пользователи не найдены."));
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
  previous.disabled=busy||searchMode||page<=1;
  next.disabled=busy||searchMode||page>=lastPage;
  pageLabel.textContent=searchMode?"Результат поиска":"Страница "+page+(lastPage>1?" из "+lastPage:"");
 }
 async function load(targetPage){
  if(busy&&!searchMode)return;
  const sequence=++requestSeq;searchMode=false;
  busy=true;previous.disabled=true;next.disabled=true;
  say("Загружаем список участников...");
  try{
   const data=await call({action:"list",page:targetPage});
   if(sequence!==requestSeq)return;
   users=Array.isArray(data?.users)?data.users:[];
   // Reveal the moderator directory only after the protected server
   // endpoint successfully authorizes this request.
   mfaPanel.hidden=true;panel.hidden=false;
   page=targetPage;
   lastPage=Math.max(1,Number(data?.totalPages)||1);
   say("Права участников доступны только Владельцу и Тени после подтверждения защиты.");
  }catch(e){if(sequence===requestSeq&&e.code!=="mfa_required")say(e.message||"Не удалось загрузить список участников.",true)}
  finally{if(sequence===requestSeq){busy=false;draw();}}
 }
 async function findByEmail(email){
  const sequence=++requestSeq;
  searchMode=true;busy=true;previous.disabled=true;next.disabled=true;
  say("Ищем зарегистрированный аккаунт...");
  try{
   const data=await call({action:"find",email});
   if(sequence!==requestSeq)return;
   users=Array.isArray(data?.users)?data.users:[];
   page=1;lastPage=1;
   say(users.length?"Аккаунт найден. Выберите роль и сохраните изменение.":"Такой подтвержденный или неподтвержденный аккаунт не найден.");
  }catch(e){if(sequence===requestSeq&&e.code!=="mfa_required"){users=[];say(e.message||"Поиск временно недоступен.",true)}}
  finally{if(sequence===requestSeq){busy=false;draw();}}
 }
 search.addEventListener("input",()=>{
  const email=search.value.trim().toLowerCase();
  if(!email){void load(1);return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
   ++requestSeq;searchMode=true;users=[];busy=false;draw();
   say("Введите полный адрес электронной почты для поиска по всем аккаунтам.");
   return;
  }
  void findByEmail(email);
 });
 previous.addEventListener("click",()=>load(page-1));
 next.addEventListener("click",()=>load(page+1));
 document.getElementById("usersRefresh").addEventListener("click",()=>search.value.trim()?findByEmail(search.value.trim().toLowerCase()):load(page));
 await load(1);
})();
