"use strict";
(function(){
 const list=document.getElementById("psyResultsList");if(!list)return;
 const cloud=window.PSY_CLOUD;
 function text(node,value){node.textContent=value}
 const make=(tag,klass)=>{const n=document.createElement(tag);if(klass)n.className=klass;return n};
 async function refresh(){
  if(!cloud){text(list,"Облачное хранилище недоступно.");return}
  text(list,"Загрузка сохраненных обследований…");
  try{
   const [data,drafts]=await Promise.all([cloud.listAssessments(),cloud.listDrafts()]);
   list.replaceChildren();
   if(!data.length&&!drafts.length){text(list,"Сохраненных результатов пока нет. Начните обработку методики – черновик автоматически появится здесь.");return}
   if(drafts.length){
    const head=make("h3");text(head,"Автосохраненные черновики");list.append(head);
    for(const draft of drafts){
     const row=make("div","psy-saved-entry"),desc=make("div","psy-saved-info"),
      title=make("strong"),meta=make("span"),actions=make("div","psy-saved-actions");
     text(title,draft.method_name);text(meta,(draft.calc_mode==="class"?"Группа / класс":"Один участник")+" · "+new Date(draft.updated_at).toLocaleString("ru-RU"));
     desc.append(title,meta);
     const open=make("a","site-btn");
     open.href="library.html?area=school&method="+encodeURIComponent(draft.method_name)+"&draft="+encodeURIComponent(draft.calc_mode);
     text(open,"Продолжить");
     const del=make("button","psy-saved-delete");del.type="button";text(del,"Удалить черновик");
     del.onclick=async()=>{
      if(!confirm("Удалить черновик? Именные сохраненные результаты не затронуты."))return;
      del.disabled=true;
      try{await cloud.deleteDraft(draft.method_name,draft.calc_mode);await refresh()}
      catch(e){alert("Не удалось удалить черновик: "+e.message);del.disabled=false}
     };
     actions.append(open,del);row.append(desc,actions);list.append(row);
    }
   }
   if(data.length){const head=make("h3");text(head,"Сохраненные результаты");list.append(head)}
   for(const item of data){
    const row=make("div","psy-saved-entry"),desc=make("div","psy-saved-info"),title=make("strong"),meta=make("span"),actions=make("div","psy-saved-actions");
    text(title,item.title);text(meta,item.method_name+" · "+new Date(item.updated_at).toLocaleDateString("ru-RU"));
    desc.append(title,meta);
    const open=make("a","site-btn");open.href="library.html?area=school&method="+encodeURIComponent(item.method_name)+"&assessment="+encodeURIComponent(item.id);text(open,"Открыть");
    const del=make("button","psy-saved-delete");del.type="button";text(del,"Удалить");
    del.onclick=async()=>{
     if(!confirm("Удалить сохраненное обследование «"+item.title+"»? Это действие нельзя отменить."))return;
     del.disabled=true;try{await cloud.deleteAssessment(item.id);await refresh()}catch(e){alert("Не удалось удалить: "+e.message);del.disabled=false}
    };
    actions.append(open,del);row.append(desc,actions);list.append(row);
   }
  }catch(e){text(list,"Не удалось загрузить результаты. "+e.message)}
 }
 Promise.resolve(cloud?.ready).then(refresh);
 window.addEventListener("focus",()=>{if(!document.getElementById("psySavedResults")?.hidden)refresh()});
})();
