"use strict";
(function(){
 const qs=s=>document.querySelector(s),page=document.body.dataset.account,PROFILE="psy-profile-demo",PREF="psy-settings-demo",AVATAR="psy-avatar-demo";
 function read(key){try{return JSON.parse(localStorage.getItem(key)||"{}")||{}}catch(_){return {}}}
 function save(key,data){try{localStorage.setItem(key,JSON.stringify(data));return true}catch(_){return false}}
 const profile=read(PROFILE),preferences=read(PREF);
 const theme=localStorage.getItem("psyteka-theme")||preferences.theme||"light";
 function apply(){document.documentElement.classList.toggle("dark",theme==="dark");document.documentElement.style.fontSize=(Number(preferences.font)||100)+"%";document.documentElement.classList.toggle("reduce-motion",Boolean(preferences.motion))}
 apply();
 function flash(msg){const node=qs("#accountToast");if(node)node.textContent=msg}
 if(page==="profile"){
  const form=qs("#profileForm"),fields={accName:"name",accRole:"role",accRoleOther:"roleOther",accWorkplace:"workplace",accWorkOther:"workOther",accOrganization:"organization",accDirection:"direction",accNote:"note"};
  Object.entries(fields).forEach(([id,key])=>{const el=qs("#"+id);if(!el)return;el.value=profile[key]||(id==="accRole"?"Педагог-психолог":id==="accWorkplace"?"Школа":"")});
  const sync=()=>{qs("#roleExtra").hidden=qs("#accRole").value!=="other";qs("#workExtra").hidden=qs("#accWorkplace").value!=="other"};
  qs("#accRole").addEventListener("change",sync);
  qs("#accWorkplace").addEventListener("change",sync);sync();
  const preview=qs("#avatarPreview"),file=qs("#avatarUpload"),remove=qs("#avatarRemove"),status=qs("#avatarStatus");
  function drawAvatar(){
   const stored=localStorage.getItem(AVATAR)||"";
   const safe=/^data:image\/(?:jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/.test(stored);
   preview.textContent="";
   if(safe){const pic=document.createElement("img");pic.src=stored;pic.alt="Моя фотография";preview.appendChild(pic)}
   else preview.textContent=(qs("#accName").value.trim().charAt(0)||"С").toUpperCase();
   remove.hidden=!safe;
  }
  qs("#accName").addEventListener("input",()=>{if(!localStorage.getItem(AVATAR))drawAvatar()});
  drawAvatar();
  file.addEventListener("change",()=>{
   const imageFile=file.files&&file.files[0];if(!imageFile)return;
   if(!["image/jpeg","image/png","image/webp"].includes(imageFile.type)||imageFile.size>5*1024*1024){status.textContent="Выберите JPG, PNG или WebP размером не более 5 МБ.";file.value="";return}
   const reader=new FileReader();
   reader.onerror=()=>{status.textContent="Не удалось прочитать изображение."};
   reader.onload=()=>{
    const img=new Image();
    img.onerror=()=>{status.textContent="Не удалось открыть изображение."};
    img.onload=()=>{
     try{
      const canvas=document.createElement("canvas");canvas.width=200;canvas.height=200;
      const ctx=canvas.getContext("2d");if(!ctx)throw Error("Canvas недоступен");
      const side=Math.min(img.naturalWidth,img.naturalHeight),x=(img.naturalWidth-side)/2,y=(img.naturalHeight-side)/2;
      ctx.fillStyle="#fff";ctx.fillRect(0,0,200,200);ctx.drawImage(img,x,y,side,side,0,0,200,200);
      const encoded=canvas.toDataURL("image/jpeg",.8);
      localStorage.setItem(AVATAR,encoded);
      status.textContent="Фотография сохранена в браузере.";
      drawAvatar();file.value="";window.dispatchEvent(new Event("psy-profile-change"));
     }catch(_){status.textContent="Браузер не смог сохранить фотографию. Попробуйте другое изображение."}
    };
    img.src=reader.result;
   };
   reader.readAsDataURL(imageFile);
  });
  remove.addEventListener("click",()=>{localStorage.removeItem(AVATAR);file.value="";drawAvatar();window.dispatchEvent(new Event("psy-profile-change"));status.textContent="Фотография удалена."});
  form.addEventListener("submit",e=>{
   e.preventDefault();
   const data={};
   Object.entries(fields).forEach(([id,key])=>{const el=qs("#"+id);data[key]=el?el.value.trim():""});
   flash(save(PROFILE,data)?"Профиль сохранен на этом устройстве.":"Браузер запретил локальное сохранение.");
   drawAvatar();window.dispatchEvent(new Event("psy-profile-change"));
  });
 }else if(page==="settings"){
  const current=localStorage.getItem("psyteka-theme")||preferences.theme||"light";
  qs("#accTheme").value=current;
  qs("#accFont").value=String(preferences.font||100);
  qs("#accMotion").checked=Boolean(preferences.motion);
  qs("#settingsForm").addEventListener("submit",e=>{
   e.preventDefault();
   const next={theme:qs("#accTheme").value,font:qs("#accFont").value,motion:qs("#accMotion").checked};
   if(save(PREF,next)){
    try{localStorage.setItem("psyteka-theme",next.theme)}catch(_){}
    document.documentElement.classList.toggle("dark",next.theme==="dark");
    preferences.font=next.font;preferences.motion=next.motion;applyFont();
    flash("Настройки сохранены.");
   }else flash("Не удалось сохранить настройки.");
  });
  function applyFont(){document.documentElement.style.fontSize=(Number(preferences.font)||100)+"%";document.documentElement.classList.toggle("reduce-motion",!!preferences.motion)}
  const dialog=qs("#confirmReset");
  qs("#resetAccount").onclick=()=>dialog.showModal();
  qs("#cancelReset").onclick=()=>dialog.close();
  qs("#approveReset").onclick=()=>{
   try{localStorage.removeItem(PROFILE);localStorage.removeItem(PREF);localStorage.removeItem(AVATAR)}catch(_){}
   dialog.close();flash("Данные демо-профиля и фотография очищены.");
   qs("#accTheme").value=localStorage.getItem("psyteka-theme")||"light";
   qs("#accFont").value="100";qs("#accMotion").checked=false;
  };
 }
})();