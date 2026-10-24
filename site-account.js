"use strict";
(function(){
 const qs=s=>document.querySelector(s),page=document.body.dataset.account,PROFILE='psy-profile-demo',PREF='psy-settings-demo';
 function read(key){try{return JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{return {}}}
 function set(key,v){try{localStorage.setItem(key,JSON.stringify(v));return true}catch{return false}}
 const profile=read(PROFILE),settings=read(PREF);
 function apply(){document.documentElement.classList.toggle('dark',settings.theme==='dark');document.documentElement.style.fontSize=(Number(settings.font)||100)+'%';document.documentElement.classList.toggle('reduce-motion',Boolean(settings.motion))}
 apply();
 function flash(msg){const node=qs('#accountToast');if(node)node.textContent=msg}
 if(page==='profile'){
  const f=qs('#profileForm');qs('#accName').value=profile.name||'';qs('#accRole').value=profile.role||'Педагог-психолог';qs('#accRoleOther').value=profile.roleOther||'';qs('#accWorkplace').value=profile.workplace||'Школа';qs('#accWorkOther').value=profile.workOther||'';qs('#accDirection').value=profile.direction||'';qs('#accNote').value=profile.note||'';
  const sync=()=>{qs('#roleExtra').hidden=qs('#accRole').value!=='other';qs('#workExtra').hidden=qs('#accWorkplace').value!=='other'};
  qs('#accRole').addEventListener('change',sync);qs('#accWorkplace').addEventListener('change',sync);sync();
  f.addEventListener('submit',e=>{e.preventDefault();const data={name:qs('#accName').value.trim(),role:qs('#accRole').value,roleOther:qs('#accRoleOther').value.trim(),workplace:qs('#accWorkplace').value,workOther:qs('#accWorkOther').value.trim(),direction:qs('#accDirection').value.trim(),note:qs('#accNote').value.trim()};flash(set(PROFILE,data)?'Профиль сохранен на этом устройстве.':'Браузер запретил локальное сохранение.')});
 }else if(page==='settings'){
  qs('#accTheme').value=settings.theme||'light';qs('#accFont').value=String(settings.font||100);qs('#accMotion').checked=Boolean(settings.motion);
  qs('#settingsForm').addEventListener('submit',e=>{e.preventDefault();const data={theme:qs('#accTheme').value,font:qs('#accFont').value,motion:qs('#accMotion').checked};if(set(PREF,data)){try{localStorage.setItem('psyteka-theme',data.theme)}catch{}settings.theme=data.theme;settings.font=data.font;settings.motion=data.motion;apply();flash('Настройки сохранены.')}else flash('Не удалось сохранить настройки.')});
  const dialog=qs('#confirmReset');qs('#resetAccount').onclick=()=>dialog.showModal();qs('#cancelReset').onclick=()=>dialog.close();qs('#approveReset').onclick=()=>{try{localStorage.removeItem(PROFILE);localStorage.removeItem(PREF)}catch{}dialog.close();flash('Данные демо-профиля очищены.');qs('#accTheme').value='light';qs('#accFont').value='100';qs('#accMotion').checked=false};
 }
})();