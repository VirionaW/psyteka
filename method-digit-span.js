"use strict";
(function(){
const NAME="Повторение цифровых рядов (прямой и обратный порядок)";
const sets=[
["f",2,"62","94"],["f",3,"381","725"],["f",4,"4927","8163"],["f",5,"27491","63825"],["f",6,"841739","529461"],["f",7,"3851729","6194285"],["f",8,"72591483","48163927"],
["b",2,"27","53"],["b",3,"418","692"],["b",4,"3851","7294"],["b",5,"61835","29471"],["b",6,"582714","936182"],["b",7,"4816925","7259316"]];
const SERIES=sets.flatMap(([direction,length,a,b])=>[a,b].map((digits,i)=>({id:direction+length+(i+1),direction,length,digits,expected:direction==="f"?digits:digits.split("").reverse().join("")})));
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clean=x=>String(x??"").replace(/[^0-9]/g,"");
const meta=[["f","В прямом порядке"],["b","В обратном порядке"]];
function inspect(raw){
const data={};
for(const [dir,name] of meta){let longest=null,correct=0,attempted=0,stop=null;
 for(const level of sets.filter(x=>x[0]===dir)){const entries=SERIES.filter(s=>s.direction===dir&&s.length===level[1]);let errors=0;
 for(const s of entries){const answer=String(raw?.[s.id]??"").trim();if(answer){attempted++;if(clean(answer)===s.expected){correct++;longest=s.length}else errors++}}
 if(errors===2){stop=level[1];break}
 }
 data[dir]={longest,correct,attempted,stop,name};
}return data;
}
const D=window.PSY_FULL_METHODS||{};
D[NAME]={
 author:"Классическая проба объёма цифровых рядов (J. Jacobs; D. Wechsler — в психометрических батареях). Собственные стимулы Психотеки",
 age:"Школьники и взрослые, способные воспринимать числа на слух; возрастные нормы для этих рядов отсутствуют",
 kind:"Диагностическая слухоречевая проба внимания и рабочей памяти",
 count:"26 рядов: 14 прямых (2–8 цифр) и 12 обратных (2–7 цифр), по 2 попытки",
 goal:"Исследовать непосредственное удержание числовых последовательностей и их мысленное воспроизведение в обратном порядке.",
 instructions:"Слушай числа. Когда я закончу, повтори их в том же порядке. Потом я попрошу повторять ряды наоборот — от последнего числа к первому.",
 questions:["Прямое воспроизведение: 2–8 цифр","Обратное воспроизведение: 2–7 цифр"],options:[],
 scoring:"В каждом условии оцениваются максимальная длина ряда, воспроизведённого правильно хотя бы в одной из двух попыток, и число правильных попыток. На уровне двух ошибок подряд в двух предъявленных рядах условие прекращается. Пустой ответ не считается проведённой попыткой.",
 interpret:"Сравнивайте прямое и обратное воспроизведение внутри обследования, отмечайте типы ошибок, слух, понимание инструкции и усталость. Не используйте нормы батарей Векслера для самостоятельно составленных рядов.",
 source:"https://pmc.ncbi.nlm.nih.gov/articles/PMC2978794/",sourceScoring:"https://pmc.ncbi.nlm.nih.gov/articles/PMC8922997/",
 license:"Процедура общеизвестной пробы; стимульные ряды составлены заново. Это не официальная форма WAIS/WISC или их стандартизированное сокращение.",
 workflow:"digitSpanPsy",calculator:true,
 guideFile:"downloads/digit_span_guide.html",guideWithBlankFile:"downloads/digit_span_guide_with_protocol.html",answerFile:"downloads/digit_span_protocol.html",
 processingFile:"downloads/digit_span_scoring.html",stimulusFile:"downloads/digit_span_examiner.html",
 indicators:["Объём прямого ряда","Объём обратного ряда","Верные попытки","Характер ошибок и уровень помощи"]
};
function instruction(d){return '<h3>Назначение и проведение</h3><p>'+esc(d.goal)+'</p><ol><li>Индивидуально проверьте понимание чисел и слуховое восприятие.</li><li>Покажите отдельные тренировочные примеры: 4–1 → 4–1; 5–2 → 2–5. Они не оцениваются.</li><li>Читайте одну цифру в секунду ровным голосом; не показывайте ряд и не повторяйте его.</li><li>На каждом уровне дайте две разные попытки. При двух неверных ответах на одном уровне прекратите соответствующую часть.</li><li>Записывайте дословный ответ и условия проведения, затем переходите к обратному порядку.</li></ol><blockquote>'+esc(d.instructions)+'</blockquote><p class="notice">Внесённые на сайт ряды являются новой рабочей редакцией без возрастных норм.</p>';}
function materials(d){return '<h3>Стимульный материал и протокол</h3><p>Числовые ряды предъявляет специалист устно. Ребёнку не выдаётся страница с правильными рядами.</p><div class="actions"><a class="btn" href="'+d.stimulusFile+'" target="_blank">Стимулы психолога · А4</a><a class="btn" href="'+d.answerFile+'" target="_blank">Протокол ответов · А4</a></div><h3>Проба</h3><p>'+esc(d.instructions)+'</p>';}
function processing(d){return '<h3>Ключ</h3><p>'+esc(d.scoring)+'</p><p>Пример: на уровне 4 цифр одна попытка верна, на уровне 5 обе неверны. Для этого условия максимальная воспроизведённая длина — 4. Прямое и обратное воспроизведение рассчитываются раздельно.</p><p>В калькуляторе поле пусто, если ряд не предъявлялся. Для проведённого ряда без ответа введите «—». Ряды после остановки не учитываются.</p><p>'+esc(d.interpret)+'</p><a href="'+d.processingFile+'" target="_blank">Обработка для печати · А4</a>';}
function summary(raw){const stats=inspect(raw);return '<h3>Результаты</h3><table class="questions-table"><thead><tr><th>Условие</th><th>Максимум цифр</th><th>Верных попыток</th><th>Предъявлено</th></tr></thead><tbody>'+meta.map(([key,label])=>{const s=stats[key];return '<tr><td>'+label+'</td><td>'+(s.longest===null?'Нет верного ряда':s.longest)+'</td><td>'+s.correct+'</td><td>'+s.attempted+'</td></tr>'}).join("")+'</tbody></table>'+meta.filter(([k])=>stats[k].stop!==null).map(([k,label])=>'<p>Остановка «'+label+'» после двух ошибок на длине '+stats[k].stop+'.</p>').join("")+'<p class="notice">Показатели описательные, без нормативных уровней или диагноза.</p>';}
function calculator(d,ctx){const row=ctx.rows[ctx.rowIndex]||{},raw=row.digitSpanData||{};return '<h3>Протокол психолога</h3><p>Впишите услышанный ответ; пробелы и дефисы игнорируются. «—» означает проведённую попытку без правильного ответа, пусто — не предъявлялась.</p>'+meta.map(([dir,label])=>'<h3>'+label+'</h3>'+sets.filter(x=>x[0]===dir).map(([_,n])=>'<fieldset style="margin:10px 0;padding:8px;border:1px solid #c4d4c9;border-radius:8px"><legend>'+n+' цифр</legend>'+SERIES.filter(x=>x.direction===dir&&x.length===n).map((item,i)=>'<label style="display:inline-block;margin:6px">Попытка '+(i+1)+'<input data-digit-span="'+item.id+'" autocomplete="off" value="'+esc(raw[item.id]??"")+'" placeholder="Ответ или —" style="display:block;min-width:140px;max-width:180px"></label>').join("")+'</fieldset>').join("") ).join("")+'<section id="digitSpanSummary" aria-live="polite">'+summary(raw)+'</section>';}
function bind(d,ctx){const row=ctx.rows[ctx.rowIndex];if(!row)return;row.digitSpanData??={};document.querySelectorAll("[data-digit-span]").forEach(el=>el.addEventListener("input",()=>{row.digitSpanData[el.dataset.digitSpan]=el.value;const out=document.getElementById("digitSpanSummary");if(out)out.innerHTML=summary(row.digitSpanData)}));}
window.PSY_DIGIT_SPAN={SERIES,inspect,instruction,materials,processing,calculator,bind};
})();