"use strict";
(function(){
 const DAYS=30,MAX_AGE=DAYS*24*60*60*1000;
 async function keepSession(client,user){
  if(!user||user.is_anonymous)return false;
  const signIn=Date.parse(user.last_sign_in_at||"");
  // A server-provided sign-in date avoids resetting the clock on each refresh.
  const key="psy-login-age-v1:"+user.id;
  let local=NaN;
  try{local=Number(localStorage.getItem(key))}catch(_){}
  if(Number.isFinite(signIn)&&signIn>Date.now()+300000)return false;
  if(Number.isFinite(signIn)&&signIn>0){
   if(!Number.isFinite(local)||local<=0||signIn>local+60000)
    try{localStorage.setItem(key,String(signIn))}catch(_){}
  }else if(!Number.isFinite(local)||local<=0){
   local=Date.now();
   try{localStorage.setItem(key,String(local))}catch(_){}
  }
  const started=Number.isFinite(signIn)&&signIn>0?signIn:local;
  if(Date.now()-started>MAX_AGE){
   try{await client.auth.signOut({scope:"local"})}catch(_){}
   return false;
  }
  return true;
 }
 async function secondFactorNeeded(client){
  const {data,error}=await client.auth.mfa.getAuthenticatorAssuranceLevel();
  if(error)throw error;
  return data?.nextLevel==="aal2"&&data.currentLevel!=="aal2";
 }
 function challengeUrl(next){
  let url;
  try{url=new URL(next||location.pathname+location.search,location.href)}
  catch(_){url=new URL("profile.html",location.href)}
  if(url.origin!==location.origin)url=new URL("profile.html",location.href);
  return "account-security.html?challenge=1&next="+encodeURIComponent(url.pathname+url.search+url.hash);
 }
 window.PSY_AUTH_PROTECTION={keepSession,secondFactorNeeded,challengeUrl,DAYS};
})();