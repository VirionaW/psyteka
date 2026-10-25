"use strict";
(function(){
 const names={drawing:"Рисунок семьи",sociogram:"Семейная социограмма"};
 const fields={
  drawing:[["who","Кто изображен"],["doing","Что делают персонажи"],["support","Общение и поддержка"],["quotes","Дословные пояснения ребенка"],["facts","Наблюдаемые факты"],["hypotheses","Рабочие гипотезы (не диагноз)"],["next","Что уточнить"]],
  sociogram:[["who","Кого изобразил участник"],["distance","Кто ближе и дальше"],["positions","Размеры и расположение"],["quotes","Дословные пояснения участника"],["facts","Наблюдаемые факты"],["hypotheses","Рабочие гипотезы (не диагноз)"],["next","Что уточнить"]]
 };
 function xml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]))}
 function paragraph(txt,heading){
  return '<w:p><w:pPr><w:spacing w:after="100"/></w:pPr><w:r><w:rPr>'+(heading?'<w:b/><w:sz w:val="26"/>':'<w:sz w:val="20"/>')+'</w:rPr><w:t xml:space="preserve">'+xml(txt)+'</w:t></w:r></w:p>';
 }
 function documentXML(type){
  const form=document.getElementById(type+"Form");
  let body=paragraph(names[type]+" – качественный протокол",true);
  body+=paragraph("Материал «Психотеки» на основе рабочего комплекта архива. Не вводить персональные данные несовершеннолетних.");
  body+=paragraph("Код участника: __________________   Дата: __________   Возраст: ______");
  for(const [key,label] of fields[type]){
   const val=form.querySelector('[name="'+key+'"]').value.trim();
   body+=paragraph(label,true)+paragraph(val||"____________________________________________________________________________");
   if(!val)body+=paragraph("____________________________________________________________________________");
  }
  body+=paragraph("Отдельные элементы рисунка не являются диагнозом. Выводы требуют беседы и дополнительных данных.");
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="900" w:bottom="900" w:left="930" w:right="930"/></w:sectPr></w:body></w:document>';
 }
 function zip(files){
  const enc=new TextEncoder(),local=[],central=[];let size=0,cs=0;
  function crc(input){let c=0xffffffff;for(const b of input){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^0xffffffff)>>>0}
  for(const {name,content} of files){
   const n=enc.encode(name),b=enc.encode(content),c=crc(b);
   const head=new Uint8Array(30+n.length),h=new DataView(head.buffer);
   h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x800,true);h.setUint32(14,c,true);h.setUint32(18,b.length,true);h.setUint32(22,b.length,true);h.setUint16(26,n.length,true);head.set(n,30);local.push(head,b);
   const record=new Uint8Array(46+n.length),v=new DataView(record.buffer);
   v.setUint32(0,0x02014b50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);v.setUint16(8,0x800,true);v.setUint32(16,c,true);v.setUint32(20,b.length,true);v.setUint32(24,b.length,true);v.setUint16(28,n.length,true);v.setUint32(42,size,true);record.set(n,46);
   central.push(record);size+=head.length+b.length;cs+=record.length;
  }
  const end=new Uint8Array(22),z=new DataView(end.buffer);
  z.setUint32(0,0x06054b50,true);z.setUint16(8,files.length,true);z.setUint16(10,files.length,true);z.setUint32(12,cs,true);z.setUint32(16,size,true);
  return new Blob([...local,...central,end],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
 }
 function docx(type){
  const ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
  const rel='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
  return zip([{name:"[Content_Types].xml",content:ct},{name:"_rels/.rels",content:rel},{name:"word/document.xml",content:documentXML(type)}]);
 }
 document.querySelectorAll("[data-family-docx]").forEach(btn=>btn.addEventListener("click",()=>{
  const type=btn.dataset.familyDocx;
  const blob=docx(type);
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=type==="drawing"?"psyteka_risunok_semi_protokol.docx":"psyteka_semeinaya_sotsiogramma_protokol.docx";document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
 }));
})();
