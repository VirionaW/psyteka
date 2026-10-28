"use strict";
(function(){
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const supported=d=>d?.workflow==="semester2026"||d?.workflow==="phillips58";
 function limits(d){return d.workflow==="phillips58"?{max:1,count:58}:{max:d.options.length-1,count:d.questions.length}}
 const answered=(a,max)=>Array.isArray(a)?a.filter(v=>v!==null&&v!==undefined&&v!==""&&(max===1?["yes","no",0,1,"0","1"].includes(v):!Number.isNaN(Number(v))&&Number(v)>=0&&Number(v)<=max)).length:0;
 function enhance(d,ctx){
  if(!supported(d)||ctx.tab!=="score")return;
  const grid=document.querySelector(d.workflow==="phillips58"?".psy-ph-grid":".psy-semester-grid");
  if(!grid)return;
  const max=limits(d).max;
  grid.insertAdjacentHTML("beforebegin",'<p class="psy-entry-keyboard-hint">Быстрый ввод с клавиатуры: <kbd>0</kbd>-<kbd>'+max+'</kbd>'+(d.workflow==="phillips58"?" (0 – Нет, 1 – Да)":"")+'; ответ сразу переводит к следующему вопросу. <kbd>Backspace</kbd> очищает ответ; <kbd>←</kbd> / <kbd>→</kbd> перемещают между вопросами. Можно вставить последовательность цифр.</p>');
  if(d.workflow==="phillips58"){
   const footer=document.querySelector("#modal .psy-standard-footer");
   if(footer){footer.classList.add("psy-semester-footer");footer.insertAdjacentHTML("afterbegin",'<span class="psy-semester-status is-pending" id="psyEntryFooter">Ответы не заполнены полностью</span>');}
  }
  if(ctx.calcMode!=="class")return;
  const r=ctx.rows[ctx.rowIndex],status=r?.attendance==="absent";
  const target=document.querySelector(".group-tools")||grid;
  const current=ctx.rowIndex+1,all=ctx.rows.length,ready=ctx.rows.filter(x=>x.attendance!=="absent").length;
  const html='<section class="psy-entry-roster" aria-label="Учет учеников">'+
   '<div class="psy-entry-roster-head"><strong>Ученик '+current+' из '+all+'</strong><span>Присутствуют: '+ready+' · Отсутствуют: '+(all-ready)+'</span></div>'+
   '<div class="psy-entry-roster-actions">'+
   '<button type="button" class="btn" id="psyPreviousChild">← Предыдущий</button>'+
   '<button type="button" class="btn" id="psyNextChild">Следующий присутствующий →</button>'+
   '<button type="button" class="btn" id="psySkipChild">Пропустить сейчас →</button>'+
   '<button type="button" class="btn '+(status?"primary":"")+'" id="psyAbsentChild" aria-pressed="'+status+'">'+(status?"Вернуть в список присутствующих":"Отсутствовал – следующий")+'</button>'+
   '</div>'+
   (status?'<p class="psy-entry-absent-notice">Ученик отмечен отсутствующим. Результат не вычисляется и не включается в сводный отчет.</p>':
           '<p class="psy-entry-presence">Для отсутствующего нажми «Отсутствовал – следующий». Он останется в списке, но не попадет в результаты. «Пропустить сейчас» не меняет статус.</p>')+
   '<details class="psy-entry-bulk"><summary>Добавить список учеников</summary><label>Условные коды, каждый с новой строки<textarea id="psyRosterCodes" rows="4" placeholder="У-01&#10;У-02&#10;У-03" maxlength="15000"></textarea></label><button type="button" class="btn" id="psyRosterAdd">Добавить в класс</button><p>Не вводите ФИО. Список хранится только в открытом сеансе, скачайте CSV до закрытия страницы.</p></details>'+
   '<div class="psy-entry-roster-msg" id="psyRosterMessage" role="status" aria-live="polite"></div>'+
   '</section>';
  target.insertAdjacentHTML("afterend",html);
  const select=document.getElementById("participantSelect");
  if(select)Array.from(select.options).forEach((o,i)=>{if(ctx.rows[i]?.attendance==="absent")o.textContent+=" (отсутствует)"});
  if(status){grid.querySelectorAll("select, input").forEach(e=>e.disabled=true);grid.classList.add("psy-entry-disabled");}
 }
 function syncFooter(d,ctx){
  const indicator=document.getElementById("psyEntryFooter");if(!indicator)return;
  const r=ctx.rows?.[ctx.rowIndex]||{answers:[]},absent=r.attendance==="absent";
  const ready=!absent&&!!window.PSY_PHILLIPS?.score(d,r.answers);
  indicator.classList.toggle("is-complete",ready);
  indicator.classList.toggle("is-skipped",absent);
  indicator.classList.toggle("is-pending",!absent&&!ready);
  indicator.textContent=absent?"Отсутствовал":ready?"Обработка готова":"Ответы не заполнены полностью";
 }
 function bind(d,ctx){
  if(!supported(d)||ctx.tab!=="score")return;
  const {max,count}=limits(d),selector=d.workflow==="phillips58"?"[data-ph-answer]":"[data-sanswer]";
  const fields=[...document.querySelectorAll(selector)];
  const row=ctx.rows[ctx.rowIndex];
  const absent=row?.attendance==="absent";
  const setField=(field,value)=>{
   if(!field||field.disabled)return;
   field.value=value;
   field.dispatchEvent(new Event("change",{bubbles:true}));
  };
  const focusIndex=index=>{if(index>=0&&index<fields.length&&!fields[index].disabled){fields[index].focus();}};
  const firstMissing=()=>fields.findIndex(x=>x.value==="");
  fields.forEach((el,i)=>{
   el.addEventListener("keydown",e=>{
    if(e.altKey||e.ctrlKey||e.metaKey||e.isComposing)return;
    if(e.key.length===1&&/^[0-9]$/.test(e.key)){
     e.preventDefault();
     if(Number(e.key)>max)return;
     const answer=e.key;
     setField(el,answer);
     if(i<fields.length-1)focusIndex(i+1);
     else document.getElementById("psyNextChild")?.focus();
    }else if(e.key==="Backspace"||e.key==="Delete"){
     e.preventDefault();
     if(el.value!=="")setField(el,"");
     else focusIndex(i-1);
    }else if(e.key==="ArrowRight"||e.key==="Enter"){
     e.preventDefault();focusIndex(i+1);
    }else if(e.key==="ArrowLeft"){e.preventDefault();focusIndex(i-1);}
   });
   el.addEventListener("paste",e=>{
    const pasted=e.clipboardData?.getData("text")||"";
    if(!pasted||!/^[0-9\s,;]+$/.test(pasted))return;
    const numbers=pasted.replace(/[\s,;]/g,"").split("");
    if(numbers.some(n=>Number(n)>max))return;
    e.preventDefault();
    numbers.forEach((v,k)=>{const index=i+k;if(index>=count)return;setField(fields[index],v)});
    focusIndex(Math.min(i+numbers.length,count-1));
   });
  });
  if(d.workflow==="phillips58"){
   fields.forEach(el=>el.addEventListener("change",()=>syncFooter(d,ctx)));
   document.getElementById("phClear")?.addEventListener("click",()=>syncFooter(d,ctx));
   syncFooter(d,ctx);
  }
  if(ctx.calcMode!=="class")return;
  const message=s=>{const el=document.getElementById("psyRosterMessage");if(el)el.textContent=s;};
  const navigate=(direction,includeAbsent)=>{
   let target=ctx.rowIndex+direction;
   while(target>=0&&target<ctx.rows.length&&(!includeAbsent&&ctx.rows[target]?.attendance==="absent"))target+=direction;
   if(target<0||target>=ctx.rows.length){message(direction>0?"Дальше присутствующих учеников нет. Можно выбрать любого из списка или добавить новые коды.":"Это первый подходящий ученик.");return false;}
   ctx.selectRow(target);
   return true;
  };
  document.getElementById("psyPreviousChild")?.addEventListener("click",()=>navigate(-1,false));
  document.getElementById("psyNextChild")?.addEventListener("click",()=>navigate(1,false));
  document.getElementById("psySkipChild")?.addEventListener("click",()=>navigate(1,true));
  document.getElementById("psyAbsentChild")?.addEventListener("click",()=>{
   if(!row)return;
   if(row.attendance==="absent"){row.attendance="present";ctx.rerender();return;}
   if(answered(row.answers,max)>0&&!confirm("У этого ученика уже есть ответы. Сохранить их, но исключить из обработки как отсутствующего?"))return;
   row.attendance="absent";
   if(!navigate(1,false))ctx.rerender();
  });
  document.getElementById("psyRosterAdd")?.addEventListener("click",()=>{
   const input=document.getElementById("psyRosterCodes");
   const proposed=(input?.value||"").split(/[\n;,]+/).map(x=>x.trim()).filter(Boolean);
   if(!proposed.length){message("Добавь хотя бы один условный код.");return;}
   if(proposed.length>300||proposed.some(s=>s.length>40)){message("Не более 300 кодов длиной до 40 символов за раз.");return;}
   const existing=new Set(ctx.rows.map(r=>(r.name||"").toLocaleLowerCase("ru")));
   let added=0;
   let emptyFirst=ctx.rows.length===1&&!ctx.rows[0].name?.trim()&&
      ctx.rows[0].attendance!=="absent"&&answered(ctx.rows[0].answers,max)===0;
   let firstIndex=-1;
   for(const code of proposed){
    if(existing.has(code.toLocaleLowerCase("ru")))continue;
    existing.add(code.toLocaleLowerCase("ru"));
    if(emptyFirst){ctx.rows[0].name=code;ctx.rows[0].attendance="present";emptyFirst=false;if(firstIndex<0)firstIndex=0;}
    else{ctx.rows.push({name:code,answers:[],attendance:"present"});if(firstIndex<0)firstIndex=ctx.rows.length-1;}
    added++;
   }
   if(!added){message("Такие коды уже есть в списке.");return;}
   ctx.selectRow(firstIndex);
  });
 }
 window.PSY_CLASS_ENTRY_2026={enhance,bind};
})();