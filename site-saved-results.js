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
   const data=await cloud.listAssessments();list.replaceChildren();
   if(!data.length){text(list,"Сохраненных результатов пока нет. Откройте методику, заполните обработку и нажмите «Сохранить результат».");return}
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
