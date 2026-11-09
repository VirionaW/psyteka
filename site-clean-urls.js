"use strict";
/* Canonical public URLs; do not modify downloads or external links. */
(function(){
 const pages=new Set(["about","account-security","adaptation-drawing","cognitive-kit","connection-check","dev-review","diagnostics-batch-k6-brs","drawing-library","family-kit","guide","library","luscher-tests","manage-users","media-check","method-kit","orekhova-houses","owner-editor","owner-mfa","phillips-print","profile","register","selfesteem-kit","settings","subscriptions","suggest-method","testing"]);
 const areas=new Set(["school","preschool","adults","special","documents","spt","prevention","information","pmpk"]);
 function clean(raw){
  if(!raw||/^(?:mailto:|tel:|javascript:|data:|blob:)/i.test(raw))return null;
  if(raw[0]==="#")return /^\/library(?:\/[^/]+)?\/?$/.test(location.pathname)?location.pathname+location.search+raw:null;
  let u;try{u=new URL(raw,document.baseURI)}catch(_){return null}
  if(u.origin!==location.origin)return null;
  if(u.pathname==="/index.html")u.pathname="/";
  else if(u.pathname==="/library"||u.pathname==="/library.html"){
   const area=u.searchParams.get("area");u.pathname=areas.has(area)?"/library/"+area:"/library";
   if(areas.has(area))u.searchParams.delete("area");
  }else{
   const m=/^\/([a-z0-9_-]+)\.html$/i.exec(u.pathname);
   if(!m||!pages.has(m[1]))return null;
   u.pathname="/"+m[1];
  }
  return u.pathname+u.search+u.hash;
 }
 function fix(a){const old=a.getAttribute("href"),next=clean(old);if(next&&next!==old)a.setAttribute("href",next)}
 function fixTree(n){if(n.nodeType!==1&&n.nodeType!==9)return;if(n.nodeType===1&&n.matches?.("a[href]"))fix(n);n.querySelectorAll?.("a[href]").forEach(fix)}
 // Hide .html in the address bar after navigating through the HTML entry file.
 // Keep authentication callback paths unchanged until the separate auth migration.
 const leaf=/^\/([a-z0-9_-]+)\.html$/i.exec(location.pathname);
 if(leaf&&pages.has(leaf[1])&&!new Set(['register','account-security','owner-mfa']).has(leaf[1])){
  const next=clean(location.pathname+location.search+location.hash);
  if(next&&next!==location.pathname+location.search+location.hash)
   history.replaceState(history.state,'',next);
 }
 function start(){
  fixTree(document);
  document.addEventListener("click",e=>{const a=e.target.closest?.("a[href]");if(a)fix(a)},true);
  new MutationObserver(records=>{for(const r of records)for(const n of r.addedNodes)fixTree(n)}).observe(document.body,{childList:true,subtree:true});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
