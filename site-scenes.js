"use strict";
(function(){
 /* Six original illustrations from the supplied block archive. The original
    opaque atlas is separated into transparent layers in the visitor's browser.
    No pictures from the diagnostic-card or sidebar collections are used. */
 const ATLAS="assets/psyteka-banner-illustrations.webp?v=20261025j";
 const names=["special","preschool","school","prevention","adults","documents"];
 const focus={
  school:{x:334,y:30,w:109,h:119,pivot:"83% 19%",kind:"spark"},
  preschool:{x:268,y:43,w:174,h:177,pivot:"74% 29%",kind:"spark"},
  special:{x:316,y:153,w:36,h:43,pivot:"73% 38%",kind:"gesture"},
  prevention:{x:180,y:27,w:106,h:143,pivot:"51% 22%",kind:"glow"},
  adults:{x:190,y:48,w:100,h:110,pivot:"51% 27%",kind:"speak"},
  documents:{x:302,y:79,w:116,h:149,pivot:"79% 26%",kind:"check"}
 };
 const sceneData=new Map();
 const page=document.body;
 let latestArea=page.dataset.area||"school";
 function removeMatte(image,type){
  const w=image.width,h=image.height;
  const c=document.createElement("canvas");c.width=w;c.height=h;
  const cx=c.getContext("2d",{willReadFrequently:true});
  cx.drawImage(image,0,0);
  const im=cx.getImageData(0,0,w,h),d=im.data,n=w*h;
  const visited=new Uint8Array(n),queue=new Int32Array(n);
  let tail=0,head=0;
  // Edge-connected light matte only: retain white pages and papers inside the drawings.
  function soft(i){const a=i*4,r=d[a],g=d[a+1],b=d[a+2];return r>233&&g>236&&b>230&&Math.max(r,g,b)-Math.min(r,g,b)<32}
  function push(i){if(i<0||i>=n||visited[i]||!soft(i))return;visited[i]=1;queue[tail++]=i}
  for(let x=0;x<w;x++){push(x);push((h-1)*w+x)}
  for(let y=0;y<h;y++){push(y*w);push(y*w+w-1)}
  while(head<tail){
   const i=queue[head++],x=i%w;
   if(x>0)push(i-1);
   if(x<w-1)push(i+1);
   if(i>=w)push(i-w);
   if(i<n-w)push(i+w);
  }
  // Papers and clipboards often have open pale edges. Keep their interiors,
  // even when the near-white matte flood would otherwise enter the page.
  const protectedShapes={
   school:[[[344,165],[434,182],[411,295],[323,265]]],
   documents:[
    [[268,110],[415,116],[398,285],[258,258]],
    [[119,114],[257,90],[286,211],[152,251]],
    [[237,287],[349,254],[405,355],[269,393]]
   ]
  };
  const polys=protectedShapes[type]||[];
  function inside(x,y,poly){
   let yes=false;
   for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const ax=poly[i][0]*w/460,ay=poly[i][1]*h/460;
    const bx=poly[j][0]*w/460,by=poly[j][1]*h/460;
    if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)yes=!yes;
   }
   return yes;
  }
  for(const poly of polys){
   const minX=Math.max(0,Math.floor(Math.min(...poly.map(p=>p[0]))*w/460));
   const maxX=Math.min(w-1,Math.ceil(Math.max(...poly.map(p=>p[0]))*w/460));
   const minY=Math.max(0,Math.floor(Math.min(...poly.map(p=>p[1]))*h/460));
   const maxY=Math.min(h-1,Math.ceil(Math.max(...poly.map(p=>p[1]))*h/460));
   for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
    if(inside(x+.5,y+.5,poly))visited[y*w+x]=0;
   }
  }
  for(let i=0;i<n;i++)if(visited[i])d[i*4+3]=0;
  // Anti-aliased edge pixels have the old pale matte mixed into their color.
  // Remove this fringe only adjacent to the flooded background.
  for(let i=0;i<n;i++){
   if(visited[i])continue;
   const x=i%w,y=(i/w)|0;
   if(!((x>0&&visited[i-1])||(x<w-1&&visited[i+1])||(y>0&&visited[i-w])||(y<h-1&&visited[i+w])))continue;
   const a=i*4;
   const diff=Math.max(Math.abs(d[a]-249),Math.abs(d[a+1]-252),Math.abs(d[a+2]-248));
   if(diff>=76)continue;
   const opacity=Math.max(.18,Math.min(1,(diff-10)/66));
   if(opacity>=1)continue;
   for(let k=0;k<3;k++){
    const matte=[249,252,248][k];
    d[a+k]=Math.max(0,Math.min(255,Math.round((d[a+k]-matte*(1-opacity))/opacity)));
   }
   d[a+3]=Math.round(255*opacity);
  }
  cx.putImageData(im,0,0);
  return c;
 }
 function prepareCell(atlas,col,row,cellW,cellH,type){
  const crop=document.createElement("canvas");crop.width=cellW;crop.height=cellH;
  crop.getContext("2d").drawImage(atlas,col*cellW,row*cellH,cellW,cellH,0,0,cellW,cellH);
  const transparent=removeMatte(crop,type);
  const part=focus[type];
  const base=document.createElement("canvas"),detail=document.createElement("canvas");
  base.width=detail.width=cellW;base.height=detail.height=cellH;
  const bc=base.getContext("2d"),dc=detail.getContext("2d");
  bc.drawImage(transparent,0,0);
  if(part){
   // Feathered elliptical cutout: a page, a star, a hand or a speech bubble moves,
   // never the complete illustration or its frame.
   const mask=document.createElement("canvas");mask.width=cellW;mask.height=cellH;
   const mc=mask.getContext("2d");
   mc.save();mc.beginPath();
   mc.ellipse(part.x+part.w/2,part.y+part.h/2,part.w/2,part.h/2,0,0,Math.PI*2);
   mc.fillStyle="#fff";mc.fill();mc.restore();
   dc.drawImage(transparent,0,0);
   dc.globalCompositeOperation="destination-in";dc.drawImage(mask,0,0);
   bc.globalCompositeOperation="destination-out";bc.drawImage(mask,0,0);
  }
  return {base:base.toDataURL("image/webp",.91),detail:part?detail.toDataURL("image/webp",.94):null,part};
 }
 function constructScene(name,extra){
  const el=document.createElement("div");
  el.className="psy-scene psy-scene-"+name+(extra?" "+extra:"");
  el.dataset.scene=name;el.setAttribute("aria-hidden","true");
  const item=sceneData.get(name);
  if(!item)return el;
  const body=document.createElement("img");body.className="psy-scene-base";body.alt="";body.decoding="async";body.src=item.base;
  el.appendChild(body);
  if(item.detail){
   const detail=document.createElement("img");detail.className="psy-scene-moving psy-scene-"+item.part.kind;
   detail.alt="";detail.decoding="async";detail.src=item.detail;
   detail.style.transformOrigin=item.part.pivot;el.appendChild(detail);
  }
  return el;
 }
 function setLibraryScene(){
  const box=document.querySelector(".library-page .hero-art");
  if(!box||!sceneData.size)return;
  const name=names.includes(page.dataset.area)?page.dataset.area:"school";
  if(box.dataset.scene===name)return;
  box.dataset.scene=name;
  box.replaceChildren(constructScene(name,"psy-scene-in-banner"));
  box.classList.add("psy-scene-ready");
 }
 function decorateHome(){
  if(!sceneData.size)return;
  const gallery=document.querySelector(".psy-hero-showcase");
  if(gallery&&!gallery.dataset.sceneReady){
   gallery.dataset.sceneReady="1";
   gallery.classList.add("psy-showcase-with-scenes");
   gallery.replaceChildren(
    constructScene("school","psy-home-scene psy-home-main"),
    constructScene("preschool","psy-home-scene psy-home-preschool"),
    constructScene("documents","psy-home-scene psy-home-documents")
   );
  }
  document.querySelectorAll(".section-card[href*='area=']").forEach(card=>{
   if(card.dataset.sceneReady)return;
   const match=card.getAttribute("href").match(/area=([a-z]+)/);
   const name=match&&match[1];
   if(!sceneData.has(name))return;
   card.dataset.sceneReady="1";card.classList.add("psy-section-with-scene");
   const old=card.querySelector(".section-icon");
   if(old)old.setAttribute("aria-hidden","true");
   card.appendChild(constructScene(name,"psy-card-scene"));
  });
  const info=document.querySelector("#about .site-columns");
  if(info&&!info.dataset.sceneReady){
   info.dataset.sceneReady="1";
   const deco=["school","adults","prevention"];
   info.querySelectorAll("article").forEach((card,i)=>{
    const spot=document.createElement("div");spot.className="psy-editorial-image";
    spot.appendChild(constructScene(deco[i]||"documents","psy-editorial-scene"));
    card.insertBefore(spot,card.firstChild);
   });
  }
 }
 function populate(){
  setLibraryScene();decorateHome();
  if(page.classList.contains("library-page")){
   new MutationObserver(()=>{if(page.dataset.area!==latestArea){latestArea=page.dataset.area;setLibraryScene()}})
    .observe(page,{attributes:true,attributeFilter:["data-area"]});
  }
 }
 const atlas=new Image();atlas.decoding="async";
 atlas.onload=()=>{
  try{
   const cw=atlas.naturalWidth/3,ch=atlas.naturalHeight/2;
   if(!Number.isInteger(cw)||!Number.isInteger(ch))return;
   names.forEach((name,i)=>sceneData.set(name,prepareCell(atlas,i%3,Math.floor(i/3),cw,ch,name)));
   populate();
  }catch(err){/* CSS sprite fallback remains readable if a browser blocks canvas. */}
 };
 atlas.src=ATLAS;
})();