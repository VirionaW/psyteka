"use strict";
/* Account's real Supabase Auth sessions. No local fake device history,
   no IP addresses and no access tokens written to the DOM. */
(function(){
 const root=document.getElementById("psyDeviceSessions");
 if(!root)return;
 const list=document.getElementById("psyDeviceList");
 const message=document.getElementById("psyDevicesStatus");
 const refreshButton=document.getElementById("psyDevicesRefresh");
 const othersButton=document.getElementById("psyOtherSessionsExit");
 const currentLogout=document.getElementById("psyAccountSignOut");
 const config=window.PSY_AUTH_CONFIG||{};
 const identity=window.PSY_IDENTITY;
 const client=identity?.client||window.PSY_AUTH_CLIENT;
 let loadedAt=0,busy=false;
 const make=(tag,klass,text)=>{
  const node=document.createElement(tag);
  if(klass)node.className=klass;
  if(text!==undefined)node.textContent=text;
  return node;
 };
 const say=(value,isError=false)=>{
  message.textContent=value||"";
  message.dataset.error=isError?"1":"0";
 };
 function deviceFromAgent(source){
  const ua=String(source||"").slice(0,400);
  const os=/iPad/i.test(ua)?"iPad":/iPhone|iPod/i.test(ua)?"iPhone":
    /Android/i.test(ua)?"Android":/Windows/i.test(ua)?"Windows":
    /CrOS/i.test(ua)?"ChromeOS":/Macintosh|Mac OS X/i.test(ua)?"macOS":
    /Linux/i.test(ua)?"Linux":"Неизвестное устройство";
  const browser=/YaBrowser\//i.test(ua)?"Яндекс Браузер":
    /EdgA?\//i.test(ua)?"Microsoft Edge":
    /OPR\/|Opera/i.test(ua)?"Opera":
    /SamsungBrowser\//i.test(ua)?"Samsung Internet":
    /Firefox\/|FxiOS\//i.test(ua)?"Firefox":
    /CriOS\/|Chrome\//i.test(ua)?"Google Chrome":
    /Safari\//i.test(ua)?"Safari":
    "Браузер не определен";
  const phone=/Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  return {name:os,browser,icon:phone?"phone":"computer"};
 }
 const dateText=value=>{
  if(!value)return "Не указано";
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return "Не указано";
  return new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(date);
 };
 function showGuest(){
  root.hidden=true;list.replaceChildren();othersButton.hidden=true;
 }
 function render(entries){
  list.replaceChildren();
  const items=Array.isArray(entries)?entries.slice(0,30):[];
  items.sort((a,b)=>Number(Boolean(b.is_current))-Number(Boolean(a.is_current))||
    Date.parse(b.signed_in_at||0)-Date.parse(a.signed_in_at||0));
  let currentFound=false;
  for(const row of items){
   const info=deviceFromAgent(row.device_user_agent);
   const card=make("article","psy-device-row"+(row.is_current?" is-current":""));
   const visual=make("span","psy-device-icon "+info.icon,info.icon==="phone"?"▯":"▣");
   visual.setAttribute("aria-hidden","true");
   const detail=make("div","psy-device-info");
   const heading=make("div","psy-device-heading");
   heading.append(make("strong",null,info.name+" · "+info.browser));
   if(row.is_current){
    currentFound=true;
    heading.append(make("span","psy-device-current","Это устройство"));
   }
   const login=make("p",null,"Вход: "+dateText(row.signed_in_at));
   detail.append(heading,login);
   if(row.refreshed_at){
    const update=make("p","psy-device-secondary","Сессия обновлена: "+dateText(row.refreshed_at));
    detail.append(update);
   }
   card.append(visual,detail);
   if(row.is_current&&currentLogout){
    currentLogout.textContent="Выйти";
    currentLogout.title="Выйти только с этого устройства";
    currentLogout.classList.add("psy-device-signout");
    card.append(currentLogout);
   }
   list.append(card);
  }
  if(!items.length){
   list.append(make("p","psy-device-empty","Сведения об активных входах отсутствуют."));
  }
  othersButton.hidden=items.filter(x=>!x.is_current).length===0;
  othersButton.disabled=false;
  if(!currentFound&&currentLogout&&!currentLogout.isConnected){
   document.getElementById("psyAccountAccess")?.querySelector(".psy-access-actions")?.append(currentLogout);
  }
  say(items.length?"Показано активных сеансов: "+items.length+".":"");
 }
 async function load(force=false){
  if(busy||!client)return;
  if(!force&&Date.now()-loadedAt<20000)return;
  busy=true;refreshButton.disabled=true;othersButton.disabled=true;
  say("Загружаем устройства...");
  try{
   await Promise.resolve(identity?.ready);
   const {data:account,error:authError}=await client.auth.getUser();
   if(authError||!account?.user||account.user.is_anonymous){showGuest();return}
   const policy=window.PSY_AUTH_PROTECTION;
   if(policy&&!(await policy.keepSession(client,account.user))){showGuest();return}
   if(policy&&await policy.secondFactorNeeded(client)){
    showGuest();return;
   }
   const {data,error}=await client.rpc("psy_list_my_sessions");
   if(error)throw error;
   root.hidden=false;
   render(data);
   loadedAt=Date.now();
  }catch(_){
   root.hidden=false;
   say("Не удалось загрузить сведения об устройствах. Повторите проверку.",true);
  }finally{
   busy=false;refreshButton.disabled=false;
   if(!othersButton.hidden)othersButton.disabled=false;
  }
 }
 refreshButton.addEventListener("click",()=>void load(true));
 othersButton.addEventListener("click",async()=>{
  if(busy||othersButton.hidden)return;
  if(!window.confirm("Выйти из аккаунта на всех остальных устройствах? На этом устройстве вход останется."))return;
  busy=true;othersButton.disabled=true;refreshButton.disabled=true;
  say("Завершаем другие сеансы...");
  try{
   const {error}=await client.auth.signOut({scope:"others"});
   if(error)throw error;
   loadedAt=0;
   say("Другие сеансы завершены. Уже выданные токены могут действовать до окончания своего короткого срока.");
  }catch(_){say("Не удалось завершить другие сеансы. Повторите попытку.",true)}
  finally{busy=false;othersButton.disabled=false;refreshButton.disabled=false}
  if(loadedAt===0)void load(true);
 });
 const securityTab=document.getElementById("psyTabSecurity");
 securityTab?.addEventListener("click",()=>void load());
 window.addEventListener("hashchange",()=>{
  if(location.hash==="#psySecurity")void load();
 });
 if(location.hash==="#psySecurity")void load();
 window.addEventListener("focus",()=>{
  if(!document.getElementById("psySecurity")?.hidden&&Date.now()-loadedAt>60000)void load();
 });
})();
