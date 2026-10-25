"use strict";
(function(){
 const page=document.body;
 const available=['school','preschool','adults','special','documents','spt','prevention'];
 const params=new URLSearchParams(location.search);
 const source=params.get('area');
 let now=available.includes(source)?source:'school';
 const title={school:['Школа','Диагностика и сопровождение'],preschool:['Детский сад','Дошкольные материалы'],adults:['Взрослые','Работа со взрослыми'],special:['ОВЗ и инвалидность','Сопровождение и доступность'],documents:['Документация','Рабочие формы'],spt:['СПТ в России','О процедуре и порядке проведения'],prevention:['Профилактика и просвещение','Конспекты, памятки, занятия']};
 const heroTitle=document.querySelector('.hero h1'),heroLead=document.querySelector('.hero p'),heroLabel=document.querySelector('.hero .eyebrow');
 function apply(area){
  if(!available.includes(area))return;now=area;page.dataset.area=area;
  document.querySelectorAll('[data-view]').forEach(btn=>btn.classList.toggle('area-current',btn.dataset.view===area));
  if(heroTitle)heroTitle.textContent=area==='school'?'Школа: методики для работы':area==='preschool'?'Детский сад':area==='adults'?'Материалы для работы со взрослыми':title[area][0];
  if(heroLabel)heroLabel.textContent=area==='school'?'Школьные материалы · диагностика и сопровождение':title[area][1];
  if(heroLead)heroLead.textContent=area==='school'?'Возраст, цель, инструкции, материалы и рабочие бланки. Отдельный онлайн-подсчет – только для проверенных ключей.':area==='preschool'?'Материалы для дошкольного возраста: игровая диагностика, наблюдение и адаптация.':area==='adults'?'Для психологов, педагогов и родителей: беседы, наблюдение и материалы сопровождения.':area==='special'?'Организация доступной среды, наблюдения, поддержка и индивидуальный маршрут.':area==='documents'?'Протоколы, характеристики, журналы и справки для практической работы.':area==='spt'?'Справочная информация о социально-психологическом тестировании в России.':'Практические конспекты встреч, занятия для детей и родителей, памятки и профилактические материалы.';
  if(area==='documents'||area==='spt'||area==='special'||area==='prevention'){
   const titleNode=document.querySelector('#resourceTitle'),leadNode=document.querySelector('#resourceLead'),container=document.querySelector('#resourceCards');
   const groups={
     documents:{lead:'Шаблоны для ежедневной работы специалиста: обезличенные протоколы, характеристики, журналы, справки и документы сопровождения.',rows:[['Протоколы','Структура наблюдения, обследования и фиксация результатов.'],['Психологические характеристики','Оформление характеристики с учетом цели обращения и конфиденциальности.'],['Журналы','Учет консультаций, профилактических мероприятий и работы с группой.'],['ППк и ПМПК','Представления, рекомендации и сопровождение.'],['Аналитические справки','Распределение результатов по уровням, количество и доля обследованных.']]},
     spt:{lead:'Социально-психологическое тестирование (СПТ) в России - отдельная информационная тема. Здесь нет тестовых бланков и файлов согласий.',rows:[['Что такое СПТ','Информация о целях профилактической процедуры и ее месте в образовательной среде.'],['Как проводится','Основные организационные этапы и необходимость сверяться с действующими официальными документами.'],['Результаты и конфиденциальность','Результаты СПТ не равны клиническому диагнозу. Подробные правила и порядок использования нужно проверять по действующим нормативным источникам.']]},
     special:{lead:'Материалы по ОВЗ и инвалидности. Выбор формы обследования и помощи определяется возможностями человека и требованиями доступности.',rows:[['Общее','Адаптация инструкций, темпа и способов предъявления.'],['Нарушения слуха','Письменные и визуальные способы подачи информации.'],['Нарушения зрения','Доступность шрифта, контраста, устных инструкций и материалов.'],['РАС','Предсказуемая структура встречи, визуальная поддержка и индивидуальный подход.'],['Двигательные нарушения','Организация пространства, моторная доступность бланков.'],['Инвалидность','Учет индивидуальных ограничений и необходимых условий.']]},
     prevention:{lead:'Практические конспекты занятий и короткие памятки для родителей, детей, подростков и специалистов.',rows:[['Для родителей','Поддержка ребенка при тревоге и разговор о чувствах.'],['Для детей','Как замечать волнение и обращаться за помощью.'],['Для подростков','Личные границы и безопасность в сети.'],['Для специалистов','Планы встреч, памятки и материалы для обсуждения.']]}
   };
   const item=groups[area];if(titleNode)titleNode.textContent=title[area][0];if(leadNode)leadNode.textContent=item.lead;
   if(container)container.innerHTML=item.rows.map(([t,d])=>'<article class="resource-card"><h3>'+t+'</h3><p>'+d+'</p></article>').join('');
  }
  page.style.setProperty('--active-area',area);
 }
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>apply(b.dataset.view),0)));
 if(typeof selectView==='function'){selectView(now)}
 apply(now);
 // Профиль и настройки - символы вместо подписей.
 try{const p=JSON.parse(localStorage.getItem('psy-profile-demo')||'{}');const a=document.querySelector('.header-avatar');if(a)a.textContent=(p.name||'Специалист').trim().slice(0,1).toUpperCase()||'С'}catch{}
 // Простые тематические иллюстрации из базовых SVG-форм.
 const shapes={
 ladder:'<path d="M15 5v37M36 5v37M15 13h21M15 23h21M15 33h21"/>',
 smile:'<circle cx="25" cy="24" r="18"/><path d="M17 21h1M32 21h1M17 29q8 9 16 0"/>',
 brain:'<path d="M25 10C15 4 7 14 11 23c-8 7 1 21 13 17M25 10c10-8 18 4 15 13 9 8 0 20-15 17M25 10v30M15 19q8 4 6 11M36 19q-8 5-6 12"/>',
 chat:'<path d="M5 9h40v28H21L10 45v-8H5zM13 19h24M13 27h16"/>',
 family:'<circle cx="15" cy="15" r="6"/><circle cx="35" cy="15" r="6"/><circle cx="25" cy="30" r="5"/><path d="M3 42v-11q2-9 12-9M47 42v-11q-2-9-12-9M15 46v-5q2-9 10-9t10 9v5"/>',
 shield:'<path d="M25 4L43 11v13q0 15-18 23Q7 39 7 24V11zM16 24l6 6 13-14"/>',
 tree:'<path d="M25 46V24m0 12L14 24m11 7 11-10"/><circle cx="25" cy="15" r="12"/><circle cx="14" cy="23" r="10"/><circle cx="36" cy="23" r="10"/>',
 book:'<path d="M5 10h18q3 0 3 4v30q-6-5-21-4zM45 10H28q-3 0-3 4v30q6-5 20-4z"/><path d="M11 18h9m-9 8h9m10-8h9m-9 8h9"/>',
 target:'<circle cx="25" cy="25" r="20"/><circle cx="25" cy="25" r="12"/><circle cx="25" cy="25" r="4"/>'
 };
 function kind(t){
 t=String(t).toLowerCase();
 if(/лесенка|готовност|адаптац|школьн.*мотивац/.test(t))return 'ladder';
 if(/самооцен|розенберг|настроен|депресс|эмоци/.test(t))return 'smile';
 if(/тревожност|страх|суицид|риск|scared|cmas/.test(t))return 'shield';
 if(/вниман|мышлен|памят|сдвг|шульте|равен|коннер|vanderbilt/.test(t))return 'brain';
 if(/семь|родител/.test(t))return 'family';
 if(/общен|социометр|поддержк/.test(t))return 'chat';
 if(/рисунок|дерево|проектив/.test(t))return 'tree';
 if(/программ|руковод|докумен|профилактик/.test(t))return 'book';
 return 'target';
 }
 const alerts=[
  [/^последовательные картинки$/i,'Используются две новые сюжетные серии Психотеки, а не авторские стандартизированные наборы. Возрастные нормативы отсутствуют; обработчик сопоставляет порядок и отдельно записывает рассказ и оказанную помощь.'],
  [/^корректурная проба бурдона - анфимова$/i,'Приложенный буквенный лист 30×30 - рабочая модификация, а не авторский стандартизированный бланк. Возрастные нормы не установлены. Количественный подсчет рассчитан строго на этот лист и не подходит для других таблиц.'],
  [/^краткий опросник настроения \(SMFQ\)$/i,"Доступен оригинальный детский опросник на английском языке. Проверенная русская адаптация и универсальный нормативный порог не установлены. Обработчик считает только сырую сумму 0-26 баллов; диагноз не формируется."],
  [/^оценка школьной мотивации$/i, "Есть разночтение в опубликованных редакциях ключа: для третьего ответа вопроса № 6 встречаются 0 и 1 балл. Обработчик использует строго выбранный первоисточник и ключ 1 / 3 / 0. Не смешивайте варианты."],
 [/прихожан|шкала личностной тревожности/i,'Для нормативной интерпретации нужно сверить таблицы перевода сырых баллов в стены с подтвержденным источником.'],
 [/таблицы шульте/i,'Возрастные нормативы в текущем комплекте не подтверждены.'],
 [/^заучивание 10 слов$/i,'Рабочий список слов не является стандартизированным нормативным комплектом. Не переносите возрастные пороги и указывайте фактическую отсрочку.'],
 [/CMAS|явной тревожности/i,'Для проведения необходим полный оригинальный стимульный материал и проверенные возрастные нормы.'],
 [/SCARED/i,'Для проведения требуется оригинальная форма соответствующей версии.'],
 [/кубики косса|прогрессивные матрицы/i,'Нужно проверить оригинальный комплект стимульных материалов и условия использования.']
 ];
 function decorate(){
  document.querySelectorAll('#catalog article.method').forEach(card=>{
   if(card.dataset.siteV2)return;card.dataset.siteV2='1';
   const h=card.querySelector('h3');const label=h?.textContent||'';const icon=card.querySelector('.glyph');
   const categoryText=(card.querySelector('.tags')?.textContent||'')+' '+label;
   card.dataset.visualKind=/рисуночн|проектив|рисунок семьи|дерево|школа зверей|что мне нравится/i.test(categoryText)?'draw':/графичес|шульте|10 слов|лурия|матриц|проба|память|внимание|лесенка|дембо/i.test(categoryText)?'graph':'scale';
   if(icon&&!icon.querySelector('.method-art-tile')){const k=kind(label+' '+(card.textContent||''));icon.innerHTML='<svg viewBox="0 0 50 50" aria-hidden="true">'+shapes[k]+'</svg>'}
   const kit=/^Социометрическое исследование класса$/i.test(label)?'sociometry':/^Корректурная проба Бурдона - Анфимова$/i.test(label)?'bourdon':null;
   const selfesteem=label==='Лесенка'?'ladder':/^Самооценка Дембо - Рубинштейн$/i.test(label)?'dembo':null;
   const cognitive=label==='Таблицы Шульте'?'schulte':label==='Заучивание 10 слов'?'memory':null;
   const family=label==='Рисунок семьи'?'drawing':label==='Семейная социограмма'?'sociogram':null;
   const adaptation=label==='Школа зверей'?'animals':label==='Что мне нравится в школе'?'likes':null;
   // Методику открываем внутри библиотеки, не создавая переход к отдельной странице.
   const issue=alerts.find(([re])=>re.test(label));
   const incomplete=!kit&&!selfesteem&&!cognitive&&!family&&!adaptation&&!window.PSY_FULL_METHODS?.[label]&&!issue;
   if(issue||incomplete){
    const btn=document.createElement('button');btn.className='method-warning';btn.type='button';btn.textContent='!';btn.setAttribute('aria-label','Замечание к комплекту методики');btn.title='Посмотреть замечание';
    btn.addEventListener('click',()=>showWarning(label,issue?issue[1]:'В открытом каталоге есть описание методики, но нет проверенного полного комплекта с оригинальным бланком, ключом и условиями использования. Для проведения обратитесь к первоисточнику.'));
    card.appendChild(btn)
   }
  });
 }
 function showWarning(name,reason){const overlay=document.createElement('div');overlay.className='warning-overlay';overlay.innerHTML='<section class="warning-dialog" role="dialog" aria-modal="true"><h2>⚠ Замечание к методике</h2><strong></strong><p></p><button type="button">Понятно</button></section>';overlay.querySelector('strong').textContent=name;overlay.querySelector('p').textContent=reason;const close=()=>{overlay.remove();document.removeEventListener('keydown',key)};const key=e=>{if(e.key==='Escape')close()};document.addEventListener('keydown',key);overlay.querySelector('button').onclick=close;overlay.addEventListener('click',e=>{if(e.target===overlay)close()});document.body.appendChild(overlay);overlay.querySelector('button').focus()}
 const root=document.querySelector('#catalog');if(root){const watch=new MutationObserver(()=>decorate());watch.observe(root,{childList:true});decorate()}
})();