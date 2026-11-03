"use strict";
/* Owner can edit visible guide/blank copy without touching test definitions,
   assessment snapshots, scoring keys, or question ordering. */
(function(){
 const client=window.PSY_IDENTITY?.client||window.PSY_AUTH_CLIENT;
 const identity=window.PSY_IDENTITY;
 const ADMIN=new Set(["owner","shadow","moderator"]);
 let activeAction=null;
 const keyFor=(m,tab,index)=>"method:"+encodeURIComponent(String(m.id))+":tab_"+tab+"_"+index;
 const editable=body=>Array.from(body.querySelectorAll("h2,h3,h4,p,blockquote,li,th,td"))
  .filter(el=>!el.closest(".psy-admin-tab-toolbar,.psy-method-admin-upload,.psy-print-published")
     &&!el.querySelector("h2,h3,h4,p,blockquote,li,th,td,button,input,select,textarea,a")
     &&!el.closest("button,a,[contenteditable]")&&el.textContent.trim().length>0)
  .slice(0,250);
 function el(tag,cls,text){const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x}
 async function mount(method,tab,body){
  if(!client||!method?.id||!["instruction","materials"].includes(tab)||!body)return;
  const ticket=Math.random().toString(36).slice(2);
  body.dataset.psyTabTicket=ticket;
  const nodes=editable(body),prefix="method:"+encodeURIComponent(String(method.id))+":tab_"+tab+"_";
  let published=new Map();
  try{
   const {data,error}=await client.from("psy_site_content_live")
    .select("content_key,content_value").like("content_key",prefix+"%");
   if(error)throw error;
   if(body.dataset.psyTabTicket!==ticket)return;
   published=new Map((data||[]).map(x=>[x.content_key,x.content_value]));
  }catch(_){if(body.dataset.psyTabTicket!==ticket)return;}
  nodes.forEach((node,index)=>{
   const key=keyFor(method,tab,index),saved=published.get(key);
   if(typeof saved==="string"&&saved.length&&node.isConnected)node.textContent=saved;
  });
  await Promise.resolve(identity?.ready);
  if(body.dataset.psyTabTicket!==ticket||!body.isConnected
    ||!identity?.user?.email_confirmed_at||!ADMIN.has(identity.role))return;
  activeAction=()=>{
   const dialog=el("dialog","psy-admin-tab-dialog");
   const form=el("form");form.method="dialog";
   const heading=el("h2",null,tab==="instruction"?"Редактор руководства":"Редактор бланка");
   const note=el("p","psy-admin-tab-note","Изменяется только опубликованный текст. Ключи, расчеты и сохраненные ответы учеников остаются без изменений.");
   const label=el("label",null,"Выберите фрагмент текста");
   const selection=el("select");selection.setAttribute("aria-label","Фрагмент для редактирования");
   nodes.forEach((node,i)=>{
    const option=el("option",null,(i+1)+". "+node.textContent.trim().slice(0,100));option.value=String(i);selection.append(option);
   });
   label.append(selection);
   const valueLabel=el("label",null,"Текст");const textarea=el("textarea");
   textarea.rows=8;textarea.maxLength=5000;valueLabel.append(textarea);
   const info=el("p","psy-admin-tab-note");info.setAttribute("role","status");
   const actions=el("div","psy-admin-tab-actions");
   const cancel=el("button",null,"Отмена");cancel.type="button";
   const save=el("button","psy-admin-tab-save","Опубликовать");save.type="button";
   actions.append(cancel,save);
   form.append(heading,note,label,valueLabel,info,actions);dialog.append(form);document.body.append(dialog);
   const setItem=()=>{const idx=Number(selection.value)||0;textarea.value=nodes[idx]?.textContent||"";info.textContent=""};
   setItem();selection.addEventListener("change",setItem);
   const close=()=>{dialog.close();dialog.remove()};
   cancel.addEventListener("click",close);
   dialog.addEventListener("cancel",e=>{e.preventDefault();close()});
   save.addEventListener("click",async()=>{
    const index=Number(selection.value)||0,content=textarea.value.trim();
    if(!content||content.length>5000){info.textContent="Введите текст от 1 до 5000 символов.";return}
    save.disabled=true;info.textContent="Публикуем...";
    try{
     const {error}=await client.from("psy_site_content_versions")
      .insert({content_key:keyFor(method,tab,index),content_value:content});
     if(error)throw error;
     if(nodes[index]?.isConnected)nodes[index].textContent=content;
     info.textContent="Опубликовано для посетителей.";
     close();
    }catch(e){info.textContent="Не удалось сохранить: "+(e?.message||"Ошибка соединения");save.disabled=false;}
   });
   dialog.showModal();
  };
  window.PSY_PORTFOLIO_VISUAL?.syncHeader?.();
 }
 window.PSY_METHOD_TAB_EDITOR={
  mount,
  open:()=>activeAction?.(),
  canOpen:()=>!!activeAction,
  reset:()=>{activeAction=null}
 };
})();
