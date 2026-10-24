"use strict";
(function(){
 const $=id=>document.getElementById(id);
 const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
 const labels=['Здоровье','Ум и способности','Характер','Авторитет у сверстников','Умение многое делать руками','Внешность','Уверенность в себе'];
 let method='ladder',mark='self',marks={self:null,adult:null,wish:null};
 function currentTab(v){method=v==='dembo'?'dembo':'ladder';$('skLadder').hidden=method!=='ladder';$('skDembo').hidden=method!=='dembo';document.querySelectorAll('[data-sk-method]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.skMethod===method)));try{const u=new URL(location.href);u.searchParams.set('method',method);history.replaceState(null,'',u)}catch(_){}}
 document.querySelectorAll('[data-sk-method]').forEach(b=>b.onclick=()=>currentTab(b.dataset.skMethod));
 const ladder=$('skLadderGraph');
 function drawLadder(){
  ladder.innerHTML=Array.from({length:7},(_,i)=>{
   const n=i+1,dots=Object.entries(marks).filter(([,v])=>v===n).map(([k])=>'<i class="sk-'+k+'" aria-hidden="true"></i>').join('');
   return '<button type="button" data-level="'+n+'" style="height:'+(22+n*11)+'%" aria-label="Ступенька '+n+'" aria-pressed="'+String(marks[mark]===n)+'">'+n+'<span class="mark-legend">'+dots+'</span></button>';
  }).join('');
  ladder.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{marks[mark]=Number(b.dataset.level);drawLadder();$('skLadderResult').innerHTML=''});
 }
 drawLadder();
 document.querySelectorAll('[data-sk-mark]').forEach(b=>b.onclick=()=>{mark=b.dataset.skMark;document.querySelectorAll('[data-sk-mark]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));drawLadder()});
 $('skLadderResultBtn').onclick=()=>{
  if(marks.self==null){$('skLadderResult').textContent='Сначала отметьте позицию, выбранную самим ребенком.';return}
  const value=k=>marks[k]==null?'Не отмечено':marks[k]+' из 7';
  const note=$('skLadderNote').value.trim();
  $('skLadderResult').innerHTML='<h4>Протокол отметок · «Лесенка»</h4><div class="sk-result-grid"><div><b>'+value('self')+'</b><span>Свой выбор</span></div><div><b>'+value('adult')+'</b><span>Как, по мнению ребенка, его оценил бы взрослый</span></div><div><b>'+value('wish')+'</b><span>Желаемая позиция</span></div></div>'+(note?'<p><b>Сопровождающая беседа</b></p><p>'+escapeHTML(note)+'</p>':'')+'<p>Это фиксация высказываний ребенка. Диагностические уровни здесь не присваиваются: необходимы выбранная версия методики и контекст беседы.</p><button type="button" class="sk-inline-copy">Скопировать обезличенный протокол</button>';
  $('skLadderResult').querySelector('.sk-inline-copy').onclick=()=>copyText('Лесенка: выбор '+value('self')+'; мнение о взрослом '+value('adult')+'; желаемая позиция '+value('wish')+(note?'; наблюдения: '+note:'')+'. Пороговая интерпретация не выполнялась.');
 };
 $('skLadderClear').onclick=()=>{marks={self:null,adult:null,wish:null};$('skLadderNote').value='';$('skLadderResult').innerHTML='';drawLadder()};
 const table=$('skDemboRows');
 table.innerHTML=labels.map((name,i)=>'<tr data-scale="'+i+'"><td>'+escapeHTML(name)+(i===0?' <small>(тренировочная)</small>':'')+'</td><td><input inputmode="numeric" type="number" min="0" max="100" step="1" aria-label="Сейчас: '+escapeHTML(name)+'" placeholder="0–100"></td><td><input inputmode="numeric" type="number" min="0" max="100" step="1" aria-label="Хочу: '+escapeHTML(name)+'" placeholder="0–100"></td><td class="sk-difference">—</td></tr>').join('');
 function readScales(){
  return [...table.querySelectorAll('tr')].map((tr,i)=>{
   const inputs=[...tr.querySelectorAll('input')];
   const vals=inputs.map(x=>x.value.trim());
   if(vals.every(x=>x===''))return {index:i,name:labels[i],now:null,want:null,delta:null};
   if(vals.some(x=>x===''))return {index:i,name:labels[i],invalid:'Для обеих отметок нужны числа'};
   const nums=vals.map(Number);
   if(nums.some(x=>!Number.isInteger(x)||x<0||x>100))return {index:i,name:labels[i],invalid:'Значения должны быть от 0 до 100'};
   return {index:i,name:labels[i],now:nums[0],want:nums[1],delta:nums[1]-nums[0]};
  });
 }
 table.addEventListener('input',()=>{
  const rows=readScales();
  [...table.querySelectorAll('tr')].forEach((tr,i)=>{const r=rows[i];tr.querySelector('.sk-difference').textContent=r.invalid?'Проверьте':'—';if(r.delta!==null&&r.delta!==undefined)tr.querySelector('.sk-difference').textContent=(r.delta>=0?'+':'')+r.delta});
  $('skDemboResult').innerHTML='';
 });
 $('skDemboResultBtn').onclick=()=>{
  const vals=readScales();
  const invalid=vals.find(x=>x.invalid);
  if(invalid){$('skDemboResult').textContent='Шкала «'+invalid.name+'»: '+invalid.invalid+'.';return}
  const completed=vals.filter(x=>x.now!==null);
  if(!completed.length){$('skDemboResult').textContent='Введите хотя бы одну заполненную шкалу.';return}
  const analytical=completed.filter(x=>x.index!==0);
  const avg=k=>analytical.length?(analytical.reduce((sum,r)=>sum+r[k],0)/analytical.length).toFixed(1).replace('.',','):'—';
  const all=analytical.length===6;
  const summary='<h4>Сырые показатели</h4><div class="sk-result-grid"><div><b>'+analytical.length+' / 6</b><span>Заполнено основных шкал (без «Здоровья»)</span></div><div><b>'+avg('now')+'</b><span>Средняя самооценка (мм)</span></div><div><b>'+avg('want')+'</b><span>Средний уровень притязаний (мм)</span></div><div><b>'+avg('delta')+'</b><span>Средняя разница (мм)</span></div></div>';
  const rows=completed.map(r=>'<tr><td>'+escapeHTML(r.name)+'</td><td>'+r.now+'</td><td>'+r.want+'</td><td>'+(r.delta>=0?'+':'')+r.delta+'</td></tr>').join('');
  $('skDemboResult').innerHTML=summary+'<div class="sk-tablebox"><table class="sk-table"><thead><tr><th>Шкала</th><th>Сейчас</th><th>Хочу</th><th>Разница</th></tr></thead><tbody>'+rows+'</tbody></table></div><p>'+(all?'Заполнены все шесть основных шкал.':'Профиль частичный: средние рассчитаны только по введенным основным шкалам.')+' Уровни «низкий», «норма», «высокий» не присваиваются без подтвержденных возрастных нормативов выбранной версии.</p><button type="button" class="sk-inline-copy">Скопировать сводку</button>';
  $('skDemboResult').querySelector('.sk-inline-copy').onclick=()=>copyText('Дембо — Рубинштейн. '+completed.map(r=>r.name+': сейчас '+r.now+', хочу '+r.want+', разница '+r.delta).join('; ')+'. Основных шкал: '+analytical.length+'/6. Средние сырые: '+avg('now')+' / '+avg('want')+' / '+avg('delta')+'. Без нормативной интерпретации.');
 };
 $('skDemboClear').onclick=()=>{table.querySelectorAll('input').forEach(x=>x.value='');table.querySelectorAll('.sk-difference').forEach(x=>x.textContent='—');$('skDemboResult').innerHTML=''};
 function copyText(text){
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).catch(()=>fallbackCopy(text));return}
  fallbackCopy(text);
 }
 function fallbackCopy(text){const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(_){}t.remove()}
 const ladderPaper=()=>'<h1>«Лесенка» · бланк</h1><p>Код участника: __________  Возраст: _____  Дата: __________</p><p>Покажи, где ты поставил(а) бы себя на лесенке. Психолог записывает пояснения отдельно.</p><div class="sk-paper-ladder">'+Array.from({length:7},(_,i)=>'<div class="sk-paper-step" style="height:'+(15+(i+1)*12)+'%">'+(i+1)+'</div>').join('')+'</div><h2>Протокол беседы для психолога</h2><p>На какую ступеньку поставил себя: _______</p><p>Куда, по мнению ребенка, поставил бы его взрослый: _______</p><p>Желаемая позиция (если спрашивали): _______</p><p>Почему ребенок сделал такой выбор:</p><div class="sk-paper-line"></div><div class="sk-paper-line"></div><p class="sk-paper-note">Рабочий бланк «Психотеки». Нумерация: 1 — нижняя, 7 — верхняя. Уровни не определяются автоматически.</p>';
 const demboPaper=()=>'<h1>Дембо — Рубинштейн · рабочий бланк</h1><p>Код участника: __________  Возраст: _____  Дата: __________</p><p>На каждой шкале короткой чертой отметь, как оцениваешь себя сейчас, знаком × — желаемый уровень. Верх — 100, низ — 0.</p><div class="sk-paper-lines">'+labels.map(x=>'<div class="sk-paper-item"><div class="sk-paper-stick"></div><span class="sk-paper-label">'+escapeHTML(x)+'</span></div>').join('')+'</div><p class="sk-paper-note">Семь линий по 100 мм при печати A4 100% без подгонки. Первая шкала «Здоровье» может использоваться как тренировочная.</p>';
 document.querySelectorAll('[data-sk-print]').forEach(b=>b.onclick=()=>{
  const box=$('skPrint');box.innerHTML=b.dataset.skPrint==='dembo'?demboPaper():ladderPaper();
  box.hidden=false;box.setAttribute('aria-hidden','false');
  const done=()=>{box.hidden=true;box.setAttribute('aria-hidden','true');window.removeEventListener('afterprint',done)};
  window.addEventListener('afterprint',done);window.print();
 });
 // Готовый Word OOXML; работает автономно, без сервера и внешних библиотек.
 const xesc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 function paragraph(text,bold=false){return '<w:p><w:pPr><w:spacing w:after="90"/></w:pPr><w:r><w:rPr><w:sz w:val="'+(bold?28:20)+'"/>'+(bold?'<w:b/>':'')+'</w:rPr><w:t xml:space="preserve">'+xesc(text)+'</w:t></w:r></w:p>'}
 function wTable(labs){
  const head='<w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:insideV w:val="single" w:sz="5" w:color="CCCCCC"/><w:insideH w:val="single" w:sz="5" w:color="CCCCCC"/></w:tblBorders></w:tblPr>';
  const row=values=>'<w:tr>'+values.map(v=>'<w:tc><w:tcPr><w:tcW w:w="2200" w:type="dxa"/></w:tcPr>'+paragraph(v)+'</w:tc>').join('')+'</w:tr>';
  return '<w:tbl>'+head+row(['Шкала','Сейчас (мм)','Хочу (мм)','Разница'])+labs.map(l=>row([l,'______','______','______'])).join('')+'</w:tbl>';
 }
 function makeWord(name,body){
  const ctype='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
  const rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
  const doc='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:right="950" w:bottom="850" w:left="950"/></w:sectPr></w:body></w:document>';
  const te=new TextEncoder(),parts=[],centers=[];let offset=0,centerLen=0;
  function crc(b){let v=0xffffffff;for(const x of b){v^=x;for(let i=0;i<8;i++)v=(v>>>1)^((v&1)?0xedb88320:0)}return(v^0xffffffff)>>>0}
  for(const [path,text] of [['[Content_Types].xml',ctype],['_rels/.rels',rels],['word/document.xml',doc]]){
   const n=te.encode(path),val=te.encode(text),sum=crc(val),local=new Uint8Array(30+n.length),lh=new DataView(local.buffer);
   lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint16(6,0x800,true);lh.setUint32(14,sum,true);lh.setUint32(18,val.length,true);lh.setUint32(22,val.length,true);lh.setUint16(26,n.length,true);local.set(n,30);parts.push(local,val);
   const ci=new Uint8Array(46+n.length),ch=new DataView(ci.buffer);ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);ch.setUint16(8,0x800,true);ch.setUint32(16,sum,true);ch.setUint32(20,val.length,true);ch.setUint32(24,val.length,true);ch.setUint16(28,n.length,true);ch.setUint32(42,offset,true);ci.set(n,46);centers.push(ci);centerLen+=ci.length;offset+=local.length+val.length;
  }
  const end=new Uint8Array(22),d=new DataView(end.buffer);d.setUint32(0,0x06054b50,true);d.setUint16(8,centers.length,true);d.setUint16(10,centers.length,true);d.setUint32(12,centerLen,true);d.setUint32(16,offset,true);
  const blob=new Blob([...parts,...centers,end],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.download=name+'.docx';a.href=url;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
 }
 document.querySelectorAll('[data-sk-word]').forEach(b=>b.onclick=()=>{
  const ladder=b.dataset.skWord==='ladder';
  if(ladder)makeWord('psyteka_lesenka_rabochiy_protokol',paragraph('Лесенка · рабочий протокол',true)+paragraph('В. Г. Щур. Рисунок с 7 ступенями распечатайте кнопкой «Распечатать бланк» на сайте.')+paragraph('Код _______ Возраст _______ Дата _______')+paragraph('Ступенька ребенка _______ / 7; как оценил бы взрослый (со слов ребенка) _______ / 7; желаемая _______ / 7')+paragraph('Аргументация и наблюдения:')+paragraph('____________________________________________________________')+paragraph('____________________________________________________________')+paragraph('____________________________________________________________')+paragraph('Показатели качественные. Интерпретируйте по проверенному руководству выбранной версии.'));
  else makeWord('psyteka_dembo_protokol',paragraph('Дембо — Рубинштейн · рабочий протокол',true)+paragraph('Модификация А. М. Прихожан. Для графического бланка с линиями по 100 мм используйте «Распечатать семь шкал» на сайте.')+paragraph('Код _________ Возраст _________ Дата __________')+paragraph('Для каждой шкалы: текущая оценка, притязания и разность; первая шкала «Здоровье» может быть тренировочной.')+wTable(labels)+paragraph('Наблюдения: _______________________________________________________')+paragraph('Не присваивайте возрастные нормативные категории без руководства выбранной версии.'));
 });
 currentTab(new URLSearchParams(location.search).get('method'));
})();