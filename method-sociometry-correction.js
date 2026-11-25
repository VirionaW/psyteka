"use strict";
/* Метолария: безопасное исправление имен и очистка анкеты выбранного ученика
   в любом варианте социометрии. Не удалять список класса или чужие ответы. */
(function(){
 const api=window.PSY_NEW_METHODS;
 if(!api)return;
 const previous={calculator:api.calculator,bind:api.bind};
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const variant=()=>window.PSY_SOCIO_VARIANTS?.getVariant?.()||"positive6";
 const isSociometry=d=>d?.methodType==="sociometry";
 const mark=()=>window.dispatchEvent(new Event("psy-assessment-dirty"));
 const normal=x=>String(x??"").normalize("NFKC").toLocaleLowerCase("ru").replace(/\u0451/g,"е").trim();
 const spec=()=>{
  const v=variant();
  if(v==="relations6")return {field:"bullyResponses",label:"отношения и поддержка (6 вопросов)"};
  if(v==="vika6")return {field:"socioVikaAnswers",label:"социометрия Вики (6 вопросов)"};
  if(v==="bullying-sna-five")return {field:"bullyFiveResponses",label:"профилактика буллинга SNA (5 вопросов)",open:"bullyFiveOpenAnswer"};
  return {field:"socioChoices",label:"обычная социометрия (6 вопросов)"};
 };
 const valuesPresent=entry=>{
  if(Array.isArray(entry))return entry.some(valuesPresent);
  if(entry&&typeof entry==="object")
   return Object.values(entry).some(valuesPresent);
  return entry!==""&&entry!==null&&entry!==undefined&&entry!==false;
 };
 function controls(ctx){
  const row=ctx.rows?.[ctx.rowIndex];
  if(!row||!String(row.name||"").trim())return "";
  const s=spec(),has=valuesPresent(row[s.field])||(s.open&&String(row[s.open]||"").trim());
  return '<div class="psy-socio-correction" aria-label="Исправление данных ученика">'+
   '<div class="psy-socio-correction-title"><strong>Исправить данные выбранного ученика</strong>'+
   '<small>'+esc(s.label)+'</small></div>'+
   '<div class="psy-socio-correction-actions">'+
   '<label for="psySocCorrectionName">Имя или код ученика'+
   '<input type="text" id="psySocCorrectionName" maxlength="120" value="'+esc(row.name)+'" autocomplete="off"></label>'+
   '<button class="btn" type="button" id="psySocCorrectionRename">Сохранить имя</button>'+
   '<button class="btn psy-socio-correction-clear" type="button" id="psySocCorrectionClear"'+(!has?' disabled':'')+
   '>Очистить анкету ученика</button></div>'+
   '<p id="psySocCorrectionMessage" role="status" class="psy-socio-correction-message">'+
   'Имя можно исправить без удаления ответов. Очистка удалит только ответы этого ученика в выбранном варианте.</p>'+
   '</div>';
 }
 api.calculator=(d,ctx)=>{
  const html=previous.calculator(d,ctx);
  if(!isSociometry(d)||ctx?.calcMode!=="class"||typeof html!=="string")return html;
  const panel=controls(ctx);
  if(!panel)return html;
  // Put the same correction controls near the top for all four variants.
  const head=html.match(/^<section\b[^>]*>/);
  if(!head)return panel+html;
  return html.slice(0,head[0].length)+panel+html.slice(head[0].length);
 };
 api.bind=(d,ctx)=>{
  previous.bind(d,ctx);
  if(!isSociometry(d)||ctx?.calcMode!=="class")return;
  const row=ctx.rows?.[ctx.rowIndex], index=ctx.rowIndex;
  if(!row?.name?.trim())return;
  const input=document.getElementById("psySocCorrectionName");
  const status=document.getElementById("psySocCorrectionMessage");
  const note=text=>{if(status)status.textContent=text;};
  const saveName=()=>{
   const desired=String(input?.value||"").trim().slice(0,120);
   if(!desired){note("Имя или код не может быть пустым.");if(input)input.value=row.name;return;}
   if(ctx.rows.some((p,i)=>i!==index&&normal(p?.name)===normal(desired))){
    note("Такой ученик уже есть в классе. Укажите другое имя или код.");if(input)input.value=row.name;return;
   }
   if(desired===row.name){note("Имя уже сохранено.");return;}
   row.name=desired;
   mark();
   ctx.onSelect?.(index);
  };
  document.getElementById("psySocCorrectionRename")?.addEventListener("click",saveName);
  input?.addEventListener("keydown",e=>{
   if(e.key==="Enter"){e.preventDefault();saveName();}
  });
  document.getElementById("psySocCorrectionClear")?.addEventListener("click",()=>{
   const s=spec(),now=ctx.rows[index];
   if(now!==row){note("Выбранный ученик изменился. Откройте его анкету заново.");return;}
   if(!valuesPresent(row[s.field])&&!(s.open&&String(row[s.open]||"").trim())){
    note("У этого ученика еще нет ответов для очистки.");return;
   }
   if(!window.confirm('Очистить ответы ученика «'+row.name+'» в варианте «'+s.label+
    '»? Имена учеников, ответы одноклассников и другие варианты социометрии останутся без изменений.'))return;
   row[s.field]=[];
   if(s.open)row[s.open]="";
   mark();
   ctx.onSelect?.(index);
  });
 };
 window.PSY_SOCIO_CORRECTION={variant:variant};
})();