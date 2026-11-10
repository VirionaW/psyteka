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
     const standalone=draft.method_name==="Домики Ореховой (рабочий протокол)"?"orekhova-houses.html"
       :draft.method_name==="Тест Люшера (рабочий протокол)"?"luscher-tests.html":null;
     open.href=standalone?standalone+"?draft=one":
       "library.html?area=school&method="+encodeURIComponent(draft.method_name)+"&draft="+encodeURIComponent(draft.calc_mode);
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
    const preview=make("button","site-btn");preview.type="button";text(preview,"Просмотреть");
    preview.onclick=async()=>{
     preview.disabled=true;
     try{
      const saved=await cloud.getAssessment(item.id);
      const dialog=make("dialog","psy-assessment-preview");
      dialog.style.cssText="width:min(800px,96vw);max-height:88vh;overflow:auto;border:1px solid #a9c4b5;border-radius:16px;padding:23px;background:var(--card,#fff);color:var(--ink,#233a2f)";
      const heading=make("h2");text(heading,saved.title);
      const subtitle=make("p");text(subtitle,saved.method_name+" · "+(saved.snapshot.calcMode==="class"?"Группа / класс":"Индивидуальная обработка"));
      const hint=make("p");text(hint,"Архив ответов, сохраненный независимо от изменений каталога. Для интерпретации используйте версию методики, по которой проводилось обследование.");
      dialog.append(heading,subtitle,hint);
      saved.snapshot.rows.forEach((record,index)=>{
       const section=make("section"),head=make("h3"),body=make("pre");
       text(head,record.name||"Участник "+(index+1));
       body.style.cssText="white-space:pre-wrap;overflow-wrap:anywhere;max-width:100%;padding:12px;border:1px solid #d8e5db;border-radius:10px";
       const answers=Array.isArray(record.answers)?record.answers.map((v,i)=>v!==""&&v!=null?(i+1)+": "+String(v):null).filter(Boolean):[];
       const meta=Object.fromEntries(Object.entries(record).filter(([k])=>k!=="name"&&k!=="answers"));
       const storedScore=saved.snapshot.scoreArchive?.results?.[index];
       const scoreLabel=storedScore?"\nЗафиксированный при сохранении расчет: "+JSON.stringify(storedScore,null,2):"";
       text(body,(answers.length?"Ответы: "+answers.join("; "):"Ответы не заполнены")+
        scoreLabel+(Object.keys(meta).length?"\nДополнительные данные: "+JSON.stringify(meta,null,2):""));
       section.append(head,body);dialog.append(section);
      });
      const close=make("button","site-btn");close.type="button";text(close,"Закрыть");
      close.onclick=()=>dialog.close();
      dialog.append(close);document.body.append(dialog);
      dialog.addEventListener("close",()=>dialog.remove(),{once:true});
      dialog.showModal();
     }catch(e){alert("Не удалось открыть архив: "+e.message)}
     finally{preview.disabled=false}
    };
    const del=make("button","psy-saved-delete");del.type="button";text(del,"Удалить");
    del.onclick=async()=>{
     if(!confirm("Удалить сохраненное обследование «"+item.title+"»? Это действие нельзя отменить."))return;
     del.disabled=true;try{await cloud.deleteAssessment(item.id);await refresh()}catch(e){alert("Не удалось удалить: "+e.message);del.disabled=false}
    };
    const merge=make("a","site-btn");
    merge.href="/report-builder?assessment="+encodeURIComponent(item.id);
    text(merge,"В общий документ");
    actions.append(open,merge,preview,del);row.append(desc,actions);list.append(row);
   }
  }catch(e){text(list,"Не удалось загрузить результаты. "+e.message)}
 }
 Promise.resolve(cloud?.ready).then(refresh);
 window.addEventListener("focus",()=>{if(!document.getElementById("psySavedResults")?.hidden)refresh()});
})();
