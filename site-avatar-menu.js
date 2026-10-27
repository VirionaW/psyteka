"use strict";
(function(){
 const identity=window.PSY_IDENTITY;
 if(!identity)return;
 const entries=[...document.querySelectorAll('a.round-link[href="profile.html"],a.header-avatar[href="profile.html"]')]
  .filter(a=>a.closest("header")||a.closest(".topbar"));
 const current=entries[0];
 if(!current)return;
 // All menu roles come from the signed-in user's RLS-protected row.
 const menu=document.createElement("div");
 menu.id="psyAvatarMenu";
 menu.className="psy-avatar-dropdown";
 menu.hidden=true;
 menu.setAttribute("role","menu");
 menu.setAttribute("aria-label","Меню аккаунта");
 current.setAttribute("aria-haspopup","menu");
 current.setAttribute("aria-controls","psyAvatarMenu");
 current.setAttribute("aria-expanded","false");
 const add=(label,url,action)=>{
  const item=document.createElement(action?"button":"a");
  item.className="psy-avatar-menu-item"+(label==="Выйти из аккаунта"?" psy-avatar-menu-exit":"");
  item.textContent=label;
  item.setAttribute("role","menuitem");
  if(action){item.type="button";item.addEventListener("click",action);}
  else item.href=url;
  menu.appendChild(item);
  return item;
 };
 const close=()=>{menu.hidden=true;current.setAttribute("aria-expanded","false");};
 const toggle=()=>{menu.hidden=!menu.hidden;current.setAttribute("aria-expanded",String(!menu.hidden));};
 current.parentElement.appendChild(menu);
 current.addEventListener("click",e=>{e.preventDefault();toggle();});
 current.addEventListener("keydown",e=>{if(e.key==="ArrowDown"){e.preventDefault();menu.hidden=false;current.setAttribute("aria-expanded","true");menu.querySelector("a,button")?.focus();}});
 document.addEventListener("click",e=>{if(!menu.contains(e.target)&&!current.contains(e.target))close();});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){close();current.focus();}});
 async function leave(switching){
  if(!identity.client)return;
  if(switching&&!window.confirm("Смена аккаунта завершит текущий вход. Для другого аккаунта понадобится отдельный код подтверждения. Продолжить?"))return;
  close();
  try{
   const {error}=await identity.client.auth.signOut();
   if(error)throw error;
   try{sessionStorage.removeItem("psy-intended-destination");sessionStorage.removeItem("psy-demo-entry");}catch(_){}
   // Switching requires a new independent OTP login. No administrator can
   // impersonate another account, and no access tokens are shared or cached.
   location.assign("index.html?home=1&entry=1"+(switching?"&switch=1":""));
  }catch(_){window.alert("Не удалось завершить сеанс. Попробуйте еще раз.");}
 }
 identity.ready.then(state=>{
  menu.replaceChildren();
  if(!state.user){
   add("Войти в аккаунт","index.html?home=1&entry=1");
   add("Подписка","subscriptions.html");
   return;
  }
  add("Профиль","profile.html");
  add("Настройки","settings.html");
  add("Подписка","subscriptions.html");
  if(state.role==="owner"||state.role==="shadow")add("Управление","manage-users.html");
  if(["owner","shadow","moderator"].includes(state.role))
   add("Сменить аккаунт",null,()=>leave(true));
  add("Выйти из аккаунта",null,()=>leave(false));
 }).catch(()=>{menu.replaceChildren();add("Войти в аккаунт","index.html?home=1&entry=1");add("Подписка","subscriptions.html");});
})();
