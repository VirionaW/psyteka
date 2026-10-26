
"use strict";
/* ПМПК: самостоятельный качественный маршрут, без вымышленных нормативов. */
(function(){
 const root=document.getElementById("pmpkRoot");
 if(!root)return;
 const AGE_LABELS=["3-5 лет","5-7 лет","7-11 лет","11-18 лет"];
 const SCHEDULE=[8,6,5,5,4,5,3];
 const HELP=["Без помощи","Повторение инструкции","Словесная подсказка","Показ образца","Пошаговая помощь","Помощь не принята"];
 const RESULTS=["Самостоятельно","С помощью","Не выполнил","Отказался"];
 const TASKS=[
 {title:"Мышление",goal:"Обобщение, сравнение, классификация, причинно-следственные связи.",versions:[
 {name:"Сортировка по одному признаку",materials:"Набор знакомых предметов или карточек двух цветов и двух форм.",procedure:["Разложить перед ребенком 6-8 предметов и предложить сгруппировать похожие.","После первой сортировки попросить объяснить признак. При затруднении показать один пример.","Изменить основание группировки и предложить выполнить перенос."],stimuli:["Подготовить 3 круглых и 3 квадратных предмета двух разных цветов. Предъявлять только доступные ребенку безопасные предметы.","Попросить: «Покажи, какие вместе. Почему? А можно разложить по-другому?»"]},
 {name:"Четвертый лишний и порядок событий",materials:"4 предмета или картинки и 3 сюжетных эпизода.",procedure:["Предложить найти предмет, который не подходит к трем другим, и объяснить выбор.","Предложить расположить три знакомых действия в правильном порядке.","При необходимости дать одну нейтральную подсказку и отметить ее."],stimuli:["Словесный ряд для предъявления: яблоко, груша, слива, мяч.","Последовательность для раскладывания специалистом: посадили семя; появился росток; вырос цветок. Для детей, которым нужен зрительный материал, подготовить три отдельные картинки этих действий."]},
 {name:"Исключение лишнего и простая аналогия",materials:"Карточки с 4 словами, устное предъявление.",procedure:["Прочитать ряд предметов, попросить назвать лишний и объяснить принцип.","Предложить закончить одну простую смысловую аналогию.","Уточнить основания выбора, зарегистрировать помощь и альтернативное объяснение."],stimuli:["Ряд: чашка, тарелка, ложка, ботинок. Возможная категория: посуда и столовые приборы; принять аргументированный альтернативный ответ.","Аналогия: птица – летает; рыба – ... . Оценивать и логическую связь, и обоснование."]},
 {name:"Сравнение понятий и смысл высказывания",materials:"Устные вопросы без готовых ответов.",procedure:["Предложить назвать сходства и различия двух понятий.","Спросить о возможных причинах события и способах проверки предположения.","Выяснить, сохраняется ли логика рассуждения при уточняющем вопросе."],stimuli:["Сравнить понятия «река» и «озеро»: сходства, различия, существенные признаки.","Ситуация: «На улице мокрый асфальт. Что могло произойти? Как узнать точнее?» Оценивать несколько обоснованных гипотез, не один ключ."]}
 ]},
 {title:"Память",goal:"Слухоречевое запоминание, способы воспроизведения и удержание материала.",versions:[
 {name:"Запоминание трех слов",materials:"Список слов специалиста, протокол повторений.",procedure:["Спокойно произнести слова с интервалом около секунды.","Предложить повторить любые запомнившиеся слова, не подсказывая содержание.","После других заданий при возможности попросить вспомнить слова и отметить фактическую задержку."],stimuli:["Список специалиста: дом, мяч, кот.","Не выдавать список ребенку. Зафиксировать дословные ответы и привнесенные слова."]},
 {name:"Запоминание пяти слов",materials:"Список слов специалиста, протокол.",procedure:["Один раз прочитать список, предложить свободное воспроизведение.","По необходимости выполнить второе предъявление; отметить число предъявлений.","В конце обследования провести отсроченное воспроизведение, указать реальное время задержки."],stimuli:["Список специалиста: солнце, машина, лес, ложка, кошка.","В протокол занести порядок и ошибки воспроизведения."]},
 {name:"Рабочая проба из шести слов",materials:"Список специалиста, протокол предъявлений.",procedure:["Предъявить слова в фиксированном порядке, предложить свободное воспроизведение.","При необходимости повторить список до трех раз; каждую попытку регистрировать отдельно.","После других блоков спросить слова повторно и записать реальное время отсрочки."],stimuli:["Рабочая серия Психотеки: лампа, сад, вода, ключ, чашка, дерево.","Это не стандартизированный список «10 слов Лурии». Не применять к нему чужие нормативы."]},
 {name:"Рабочая проба из восьми слов",materials:"Список специалиста, протокол предъявлений.",procedure:["Предъявить слова ровным темпом и предложить воспроизвести.","При необходимости повторить до трех раз с раздельной записью ответов.","В конце провести отсроченное воспроизведение; описать стратегию и ошибки."],stimuli:["Рабочая серия Психотеки: сапог, утро, река, конверт, огонь, этаж, зеркало, перо.","Нормативные баллы других версий не использовать."]}
 ]},
 {title:"Внимание",goal:"Избирательность, устойчивость, темп, понимание и удержание правила.",versions:[
 {name:"Поиск фигур",materials:"Лист с кругами, треугольниками и квадратами.",procedure:["Показать нужную фигуру на отдельном примере.","Предложить находить только такую фигуру в строках рабочего листа.","Зарегистрировать способ поиска, пропуски, отвлечения и помощь."],stimuli:["Цель – найти все круги. Использовать распечатанный лист ребенка из вкладки «Бланк»."]},
 {name:"Отметь фигуру по правилу",materials:"Печатный ряд геометрических фигур.",procedure:["Сначала объяснить правило и выполнить тренировочный пример.","Предложить отмечать все треугольники.","Зарегистрировать время, пропуски, ложные отметки и самокоррекцию."],stimuli:["Цель – все треугольники. Лист создан Психотекой, опубликованных возрастных норм для него нет."]},
 {name:"Поиск буквы",materials:"Рабочая буквенная таблица.",procedure:["На тренировочной строке показать букву-цель.","В основном листе попросить зачеркивать все буквы А, не пропуская строк.","Записать фактическое время, пропуски и ошибочные зачеркивания."],stimuli:["Целевая буква – А. Это авторская рабочая таблица, не стандартизированная корректурная проба."]},
 {name:"Избирательное внимание с двумя целями",materials:"Рабочая буквенная таблица.",procedure:["Объяснить и показать разницу между двумя правилами.","Просить зачеркивать А и подчеркивать О.","Зафиксировать время, пропуски, путаницу правил и самопроверку."],stimuli:["Зачеркивать А; подчеркивать О. Лист Психотеки без возрастных нормативов."]}
 ]},
 {title:"Восприятие и моторика",goal:"Зрительный анализ, пространственная организация и графомоторная координация.",versions:[
 {name:"Повторение формы и расположения",materials:"Простые фигуры и карандаш.",procedure:["Показать круг и квадрат отдельно, предложить скопировать.","Предложить расположить две фигуры рядом в том же порядке.","Отметить захват карандаша, координацию, понимание положения и зрительный контроль."],stimuli:["Образцы фигур размещены на отдельном листе ребенка; при необходимости разрешено выкладывание предметами."]},
 {name:"Копирование геометрического образца",materials:"Лист с геометрическими фигурами.",procedure:["Предложить внимательно рассмотреть и скопировать одну фигуру.","Затем предложить скопировать последовательность из трех фигур.","Отметить пропорции, взаимное расположение, направление линий и помощь."],stimuli:["Образцы для копирования находятся на отдельном рабочем листе ребенка."]},
 {name:"Зрительно-пространственное копирование",materials:"Лист с простыми взаимосвязанными фигурами.",procedure:["Предъявить образец, попросить его скопировать без обведения.","Попросить словесно объяснить расположение частей.","Зафиксировать повороты, пропуски, ошибки взаимного расположения."],stimuli:["Использовать авторские простые фигуры из рабочего листа, не выдавать их за тест Бендер."]},
 {name:"Копирование и пространственное объяснение",materials:"Лист с пересекающимися и вложенными фигурами.",procedure:["Попросить воспроизвести расположение фигур по образцу.","Предложить объяснить, что находится внутри, слева или пересекается.","Зафиксировать стратегию, ошибки пространственных отношений и корректировку."],stimuli:["Фигуры для копирования подготовлены на рабочем листе ребенка."]}
 ]},
 {title:"Речь и инструкции",goal:"Понимание обращенной речи, последовательных команд, связность высказывания.",versions:[
 {name:"Двухшаговая инструкция",materials:"Два знакомых предмета.",procedure:["Попросить выполнить два последовательных действия с предметами.","Уточнить понимание вопросов «кто», «что делает».","При необходимости разделить команду на части и отметить эффект."],stimuli:["Положить мяч на стол и дать карандаш взрослому. При отсутствии мяча допустима знакомая игрушка; замену записать.","Вопрос: «Что ты сделал сначала?»"]},
 {name:"Рассказ по знакомой ситуации",materials:"Короткая устная история.",procedure:["Прочитать историю один раз.","Задать два вопроса о последовательности событий.","Предложить пересказать историю своими словами."],stimuli:["История: «Маша вышла во двор и увидела, что начался дождь. Она вернулась домой и взяла зонт».","Вопросы: что произошло во дворе? Зачем Маша вернулась домой?"]},
 {name:"Понимание причинной связи",materials:"Короткий рассказ, устные вопросы.",procedure:["Один раз прочитать рассказ.","Спросить о фактах и причине поступка.","Предложить передать суть рассказа своими словами."],stimuli:["История: «Петя собирался гулять, но заметил темные тучи. Он взял дождевик. Через несколько минут пошел дождь».","Вопросы: что заметил Петя? Почему он взял дождевик?"]},
 {name:"Понимание сложного сообщения",materials:"Короткий устный текст.",procedure:["Прочитать ситуацию, не показывая текст заранее.","Попросить выделить факты, причину и возможное следствие.","Уточнить, чем факт отличается от предположения."],stimuli:["Ситуация: «На тренировку пришло меньше ребят, чем обычно. Тренер предположил, что это связано с дождем, но некоторые участники сообщили о переносе автобуса».","Вопросы: что известно точно? Что остается предположением? Как проверить причины?"]}
 ]},
 {title:"Обучаемость и саморегуляция",goal:"Принятие помощи, усвоение правила, перенос и самопроверка.",versions:[
 {name:"Обучение сортировке",materials:"Предметы двух цветов и двух форм.",procedure:["Предложить сгруппировать предметы по одному признаку.","При затруднении последовательно дать инструкцию, затем показ одного примера.","Заменить материалы и предложить выполнить сходную сортировку без помощи."],stimuli:["Исходное правило: «собери предметы одного цвета». Перенос: «а теперь одинаковой формы».","Для замены использовать другие предметы тех же двух признаков."]},
 {name:"Смена основания классификации",materials:"Карточки цветов и фигур.",procedure:["Попросить отсортировать по цвету.","Показать новое правило на одном образце и затем убрать образец.","Попросить самостоятельно применить новое правило к оставшимся карточкам."],stimuli:["Первое правило – цвет, второе – форма. Не оценивать только скорость выполнения."]},
 {name:"Освоение нового правила",materials:"Набор чисел или карточек.",procedure:["Объяснить правило на одном примере.","Предложить 3 новых задания; при ошибке дать подсказку и повторно проверить перенос.","Отметить количество и вид помощи, самоконтроль."],stimuli:["Правило: «к названному числу прибавь 2». Тренировка: 3 → 5. Перенос: 4, 7, 10.","При трудностях счета заменить числовую пробу на сортировку по новому правилу и описать замену."]},
 {name:"Гибкость и перенос способа",materials:"Словесные закономерности.",procedure:["Объяснить первую логическую закономерность.","Предложить применить ее к новому материалу, затем изменить правило.","Описать ошибки переключения, принятие подсказок и самостоятельное исправление."],stimuli:["Правило 1: к каждому числу прибавить 3, начиная с 2.","Правило 2: к каждому числу прибавить 2, начиная с 4.","Не сравнивать с нормативами стандартизированных тестов."]}
 ]},
 {title:"Эмоциональное состояние и контакт",goal:"Контакт, реакции на трудности, субъективное отношение к обследованию.",versions:[
 {name:"Игровая беседа и наблюдение",materials:"Без специальных стимулов.",procedure:["Поддержать контакт и предложить показать, что ребенку нравится.","Наблюдать эмоциональные реакции при успехе, ошибке и помощи.","Не делать выводов о тревожности по одному ответу."],stimuli:["Вопросы: «Что тебе нравится делать?», «Что ты делаешь, если трудно?»"]},
 {name:"Беседа об уверенности",materials:"Нейтральные вопросы.",procedure:["Спросить, какие задания были легкими и сложными.","Уточнить отношение к своей ошибке и к помощи.","Записать прямые высказывания без приписывания скрытых мотивов."],stimuli:["Вопросы: «Что сегодня получилось?», «Что было трудно?», «Что помогает тебе учиться?»"]},
 {name:"Самоописание трудностей",materials:"Короткая беседа.",procedure:["Попросить назвать удавшееся и трудное задание.","Уточнить, как ребенок просит помощь и реагирует на ошибку.","Сопоставить слова с наблюдениями, не ставить диагноз."],stimuli:["Вопросы: «Что было интереснее всего?», «Что ты сделал, когда не получилось?», «Что помогло?»"]},
 {name:"Рефлексия и мотивация",materials:"Короткая беседа.",procedure:["Обсудить отношение к учебным трудностям и успехам.","Спросить о предпочитаемых способах помощи.","Зафиксировать высказывания дословно и наблюдаемые реакции."],stimuli:["Вопросы: «Какие задания тебе обычно даются легче?», «Как ты поступаешь, когда не понимаешь инструкцию?», «Какую помощь считаешь полезной?»"]}
 ]}
 ];
 const state={age:2,tab:"portfolio",data:AGE_LABELS.map(()=>({code:"",date:new Date().toISOString().slice(0,10),conditions:"",summary:"",items:TASKS.map(()=>({status:"",result:"",help:"",notes:"",reason:"",duration:""}))}))};
 const esc=s=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 const rec=()=>state.data[state.age];
 const route=i=>TASKS[i].versions[state.age];
 function valid(item){
  return (item.status==="done"&&!!item.result&&!!item.help&&!!item.notes.trim())||(item.status==="skip"&&!!item.reason.trim());
 }
 function progress(){return rec().items.filter(valid).length}
 function routeReady(){return progress()===TASKS.length&&rec().items.some(x=>x.status==="done")&&!!rec().summary.trim()}
 function facts(){
  return '<div class="pmpk-facts"><div class="pmpk-fact"><small>Возраст</small><strong>'+AGE_LABELS[state.age]+'</strong></div><div class="pmpk-fact"><small>Планирование</small><strong>До 40 минут</strong></div><div class="pmpk-fact"><small>Формат</small><strong>7 заданий</strong></div><div class="pmpk-fact"><small>Оценка</small><strong>Качественная</strong></div></div>';
 }
 function header(){
  return '<div class="pmpk-hero"><div><div class="pmpk-eyebrow">Самостоятельный раздел · Комплексное обследование</div><h1>ПМПК – маршрут психолога</h1><p>Возрастные задания, рабочие бланки специалиста и единый протокол. Время ориентировочное; состав и продолжительность специалист адаптирует под ребенка.</p></div><div class="pmpk-hero-time"><strong>40</strong><span>минут · ориентир</span></div></div>'+
  '<div class="pmpk-card pmpk-toolbar"><div><label>Возраст обследуемого</label><div class="pmpk-ages" role="group" aria-label="Возраст">'+AGE_LABELS.map((a,i)=>'<button type="button" data-age="'+i+'" aria-pressed="'+(state.age===i)+'">'+a+'</button>').join("")+'</div></div><p class="pmpk-note">Программа индивидуальная. Для детей младше 3 лет и при выраженных особенностях развития нужен отдельный возрастной маршрут.</p></div>'+
  '<div class="pmpk-tabs" role="tablist" aria-label="Материалы ПМПК">'+[["portfolio","Портфолио"],["guide","Методика / руководство"],["blank","Бланк"]].map(a=>'<button role="tab" type="button" data-tab="'+a[0]+'" aria-selected="'+(state.tab===a[0])+'">'+a[1]+'</button>').join("")+'</div>';
 }
 function portfolio(){
  return '<div class="pmpk-card"><h2>Общие сведения</h2>'+facts()+
  '<p><strong>Цель:</strong> краткое описание особенностей познавательной деятельности, обучаемости, саморегуляции и эмоционального контакта при индивидуальном обследовании.</p>'+
  '<p class="pmpk-note">Это авторский рабочий маршрут наблюдения и диагностических проб Психотеки, а не стандартизированная батарея ПМПК. Нормативные таблицы, суммарный IQ, уровень развития и диагностические категории для него не установлены. Он не заменяет заключение комиссии, обследование логопеда, дефектолога и врача.</p></div>'+
  '<div class="pmpk-card"><h2>Задания по выбранному возрасту</h2><div class="pmpk-list">'+TASKS.map((t,i)=>'<div class="pmpk-task"><div class="pmpk-task-head"><div class="pmpk-titleline"><span class="pmpk-number">'+(i+1)+'</span><h3>'+esc(t.title)+'</h3></div><span class="pmpk-minutes">'+SCHEDULE[i]+' мин</span></div><p><strong>'+esc(route(i).name)+'</strong></p><p class="pmpk-meta">'+esc(t.goal)+'</p></div>').join("")+'</div><p class="pmpk-note">Дополнительно: примерно 2 минуты на контакт и 2 минуты резерва. При перегрузке или усталости этапы можно переносить либо пропускать с указанием причины.</p></div>'+
  '<div class="pmpk-card"><h2>Методические основания</h2><p>Примерные возрастные направления содержатся в рекомендациях Минобрнауки от 23.05.2016 № ВК-1074/07, приложение 8. Действующее положение о ПМПК утверждено приказом Минпросвещения от 01.11.2024 № 763. Эти документы не задают данной рабочей батарее стандартных норм.</p><p class="pmpk-note"><a href="https://base.garant.ru/71462034/38d0e20d10a9099ed1e190abf152a12a/" target="_blank" rel="noopener noreferrer">Примерный пакет методик психолога</a> · <a href="https://docs.edu.gov.ru/document/b4b4effded15d5ace08f738188fc46c3" target="_blank" rel="noopener noreferrer">Положение о ПМПК</a></p><p class="pmpk-note">Тест Люшера не включен в базовый маршрут: по цветовым предпочтениям нельзя делать достоверное диагностическое заключение о ребенке.</p></div>';
 }
 function guide(){
  return '<div class="pmpk-card"><div class="pmpk-toolbar"><h2>Методика и руководство</h2><div class="pmpk-actions"><button type="button" class="pmpk-mini" data-print="guide">Без бланка</button><button type="button" class="pmpk-action primary" data-print="guide-blank">С бланком</button></div></div><p>Перед началом уточнить запрос и состояние ребенка, проверить доступность инструкций, возможности слуха, зрения и двигательной активности. Начать с контакта; наблюдение ведется на протяжении всех заданий. Не применять чужие нормативные пороги.</p><p class="pmpk-note">В этом разделе порядок проведения. Предъявляемые слова и другие стимулы размещены отдельно в разделе «Бланк» и материалах специалиста.</p></div>'+
  '<div class="pmpk-list">'+TASKS.map((t,i)=>{const v=route(i);return '<section class="pmpk-card"><div class="pmpk-task-head"><div class="pmpk-titleline"><span class="pmpk-number">'+(i+1)+'</span><h2>'+esc(t.title)+'</h2></div><span class="pmpk-minutes">'+SCHEDULE[i]+' мин</span></div><p><strong>Вариант:</strong> '+esc(v.name)+'</p><p><strong>Оборудование:</strong> '+esc(v.materials)+'</p><ol class="pmpk-procedure">'+v.procedure.map(p=>'<li>'+esc(p)+'</li>').join("")+'</ol><p><strong>Регистрировать:</strong> '+esc(t.goal)+' самостоятельность, виды помощи, ошибки, самокоррекцию и признаки утомления.</p></section>'}).join("")+'</div>'+
  '<div class="pmpk-card"><h2>Обработка и ограничения</h2><p>По каждому блоку отмечаются факт проведения, способ выполнения, полученная помощь, наблюдения и, при необходимости, время. Пропуск фиксируется с причиной. Итог – описательный протокол, а не сумма баллов. Отсроченное воспроизведение слов проводится ближе к завершению, с фактическим указанием задержки.</p></div>';
 }
 function blank(){
  return '<div class="pmpk-card"><div class="pmpk-toolbar"><h2>Протокол специалиста</h2><div class="pmpk-actions"><button type="button" class="pmpk-action primary" data-print="blank">Посмотреть и распечатать</button><button type="button" class="pmpk-mini" data-docx="blank">Скачать Word</button></div></div><p class="pmpk-note">Лист заполняет специалист. Он не выдается ребенку. Печать – А4, без ответов и нормативных таблиц.</p><div class="pmpk-blank-grid"><div>Участник / код<span></span></div><div>Дата обследования<span></span></div><div>Возраст<span></span></div><div>Условия проведения<span></span></div></div><table class="pmpk-table"><thead><tr><th>Задание</th><th>Наблюдения, помощь и ошибки</th><th>Время</th></tr></thead><tbody>'+TASKS.map((t,i)=>'<tr><td>'+(i+1)+'. '+esc(t.title)+'<br><small>'+esc(route(i).name)+'</small></td><td>________________________________________<br>________________________________________</td><td>_____</td></tr>').join("")+'</tbody></table></div>'+
  '<div class="pmpk-card"><h2>Отдельные рабочие материалы</h2><p>Стимульные подсказки специалиста и рабочий лист ребенка печатаются раздельно. В руководство стимулы не включаются.</p><div class="pmpk-actions"><button type="button" class="pmpk-mini" data-print="stimuli">Стимулы специалиста · А4</button><button type="button" class="pmpk-mini" data-print="child">Рабочий лист ребенка · А4</button></div><p class="pmpk-note">Для предметной классификации нужны реальные предметы или отдельные картинки. Буквенная таблица и графические образцы на листе ребенка – оригинальные рабочие задания Психотеки, не стандартизированные тесты.</p></div>';
 }
 function oneProcess(t,i){
  const item=rec().items[i];
  return '<section class="pmpk-card pmpk-process-task"><div class="pmpk-task-head"><div class="pmpk-titleline"><span class="pmpk-number">'+(i+1)+'</span><h2>'+esc(t.title)+'</h2></div><span class="pmpk-status '+(valid(item)?"is-done":"")+'" data-status="'+i+'">'+(valid(item)?"Заполнено":"Не заполнено")+'</span></div><p class="pmpk-meta">'+esc(route(i).name)+'</p><div class="pmpk-formgrid"><div class="pmpk-field"><label for="pmpk-status-'+i+'">Проведение *</label><select id="pmpk-status-'+i+'" data-task="'+i+'" data-field="status"><option value="">Выберите</option><option value="done" '+(item.status==="done"?"selected":"")+'>Проведено</option><option value="skip" '+(item.status==="skip"?"selected":"")+'>Не проводилось</option></select></div>'+
  (item.status==="done"?
   '<div class="pmpk-field"><label for="pmpk-result-'+i+'">Выполнение *</label><select id="pmpk-result-'+i+'" data-task="'+i+'" data-field="result"><option value="">Выберите</option>'+RESULTS.map(x=>'<option '+(item.result===x?"selected":"")+'>'+esc(x)+'</option>').join("")+'</select></div><div class="pmpk-field"><label for="pmpk-help-'+i+'">Вид помощи *</label><select id="pmpk-help-'+i+'" data-task="'+i+'" data-field="help"><option value="">Выберите</option>'+HELP.map(x=>'<option '+(item.help===x?"selected":"")+'>'+esc(x)+'</option>').join("")+'</select></div><div class="pmpk-field"><label for="pmpk-duration-'+i+'">Время, секунд (если измерялось)</label><input id="pmpk-duration-'+i+'" type="number" min="0" max="3600" step="1" data-task="'+i+'" data-field="duration" value="'+esc(item.duration)+'"></div><div class="pmpk-field wide"><label for="pmpk-notes-'+i+'">Ответы, ошибки, динамика, самопроверка, эффект помощи *</label><textarea id="pmpk-notes-'+i+'" data-task="'+i+'" data-field="notes" rows="3" placeholder="Запишите наблюдаемые факты. Для памяти – ответы по предъявлениям и время отсрочки.">'+esc(item.notes)+'</textarea></div>':
   item.status==="skip"?'<div class="pmpk-field wide"><label for="pmpk-reason-'+i+'">Причина пропуска *</label><textarea id="pmpk-reason-'+i+'" data-task="'+i+'" data-field="reason" rows="2" placeholder="Например, утомление или недоступность задания">'+esc(item.reason)+'</textarea></div>':
   '<div class="pmpk-field wide"><p class="pmpk-skipline">Выберите «Проведено» или «Не проводилось» для регистрации результата.</p></div>')+'</div></section>';
 }
 function processing(){
  const count=progress(),ready=routeReady();
  return '<div class="pmpk-card"><div class="pmpk-toolbar"><div><h2>Обработка результатов</h2><p class="pmpk-note">Индивидуальный протокол. Никакие результаты не отправляются и не сохраняются на сервере. Перед закрытием страницы скачайте отчет.</p></div><span class="pmpk-status '+(ready?"is-done":"")+'" data-main-status>'+ (ready?"Обработка заполнена":"Нужно заполнить")+'</span></div><div class="pmpk-progress" aria-hidden="true"><div id="pmpkProgressFill" style="width:'+(count/TASKS.length*100)+'%"></div></div><p class="pmpk-steps-count" id="pmpkProgressLabel">Заполнено '+count+' из 7</p><div class="pmpk-formgrid"><div class="pmpk-field"><label for="pmpk-code">Имя или код обследуемого (по выбору)</label><input id="pmpk-code" data-meta="code" autocomplete="off" value="'+esc(rec().code)+'"></div><div class="pmpk-field"><label for="pmpk-date">Дата обследования</label><input id="pmpk-date" type="date" data-meta="date" value="'+esc(rec().date)+'"></div><div class="pmpk-field wide"><label for="pmpk-conditions">Условия проведения и общее наблюдение</label><textarea id="pmpk-conditions" data-meta="conditions" rows="2">'+esc(rec().conditions)+'</textarea></div></div></div>'+
  '<div class="pmpk-list">'+TASKS.map(oneProcess).join("")+'</div>'+
  '<div class="pmpk-card"><h2>Описание результата</h2><p class="pmpk-note">Это поле заполняет специалист. Не используйте автоматические диагностические ярлыки и выводы по единственной пробе.</p><div class="pmpk-field"><label for="pmpk-summary">Качественное заключение, условия и рекомендации *</label><textarea id="pmpk-summary" data-meta="summary" rows="5">'+esc(rec().summary)+'</textarea></div></div>';
 }
 function bottom(){
  const ready=routeReady();
  if(state.tab==="processing"){
   return '<div class="pmpk-bottom"><span class="pmpk-status '+(ready?"is-done":"")+'" data-main-status>'+(ready?"Обработка заполнена":"Заполнено "+progress()+" из 7")+'</span><button type="button" class="pmpk-mini" data-action="back">К портфолио</button><button type="button" class="pmpk-action primary" data-print="report" '+(!ready?"disabled":"")+'>Распечатать отчет</button><button type="button" class="pmpk-action primary" data-docx="report" '+(!ready?"disabled":"")+'>Скачать отчет Word</button><button type="button" class="pmpk-action danger" data-action="clear">Очистить ответы</button></div>';
  }
  return '<div class="pmpk-bottom"><span class="pmpk-status '+(ready?"is-done":"")+'" data-main-status>'+(ready?"Обработка заполнена":"Обработка не заполнена")+'</span><button type="button" class="pmpk-action primary" data-action="processing">Обработка результатов</button></div>';
 }
 function render(){
  root.innerHTML=header()+(state.tab==="portfolio"?portfolio():state.tab==="guide"?guide():state.tab==="blank"?blank():processing())+bottom();
 }
 function syncProgress(){
  const ready=routeReady(),count=progress();
  root.querySelectorAll("[data-main-status]").forEach(el=>{el.classList.toggle("is-done",ready);el.textContent=ready?"Обработка заполнена":(state.tab==="processing"?"Заполнено "+count+" из 7":"Обработка не заполнена")});
  root.querySelectorAll("[data-status]").forEach(el=>{const ok=valid(rec().items[Number(el.dataset.status)]);el.classList.toggle("is-done",ok);el.textContent=ok?"Заполнено":"Не заполнено"});
  const fill=root.querySelector("#pmpkProgressFill");if(fill)fill.style.width=(count/7*100)+"%";
  const lab=root.querySelector("#pmpkProgressLabel");if(lab)lab.textContent="Заполнено "+count+" из 7";
  root.querySelectorAll('[data-print="report"],[data-docx="report"]').forEach(b=>b.disabled=!ready);
 }
 function blankLines(){
  const x=["ПРОТОКОЛ СПЕЦИАЛИСТА · ПМПК", "Возраст: "+AGE_LABELS[state.age], "Участник / код: _____________________________________", "Дата: __________________  Условия: ______________________", "Оценка качественная. Нормативные уровни не предусмотрены.",""];
  TASKS.forEach((t,i)=>{x.push((i+1)+". "+t.title+" – "+route(i).name);x.push("Выполнение: __________________  Помощь: __________________");x.push("Время: ______  Наблюдения: _____________________________");x.push("______________________________________________________");x.push("");});
  x.push("Наблюдение за контактом и утомляемостью: __________________");x.push("______________________________________________________");
  x.push("Качественное заключение специалиста: ____________________");x.push("______________________________________________________");
  return x;
 }
 function reportLines(){
  const d=rec(),x=["ПМПК · КАЧЕСТВЕННЫЙ ПРОТОКОЛ", "Возраст: "+AGE_LABELS[state.age],"Имя / код: "+(d.code||"не указан"),"Дата: "+(d.date||"не указана"),"Условия: "+(d.conditions||"не указаны"),"Рабочий маршрут Психотеки без нормативных порогов",""];
  TASKS.forEach((t,i)=>{const y=d.items[i];x.push((i+1)+". "+t.title+" · "+route(i).name);if(y.status==="skip")x.push("Не проводилось. Причина: "+y.reason);else {x.push("Выполнение: "+y.result+"; помощь: "+y.help+(y.duration?" · "+y.duration+" сек":""));x.push("Наблюдения: "+y.notes)}x.push("");});
  x.push("Качественное заключение специалиста: "+(d.summary||"Не заполнено"));
  x.push("Автоматическое диагностическое заключение не формировалось.");
  return x;
 }
 function printHTML(type){
  const title=type==="report"?"Качественный протокол":type==="stimuli"?"Стимулы специалиста":type==="child"?"Рабочий лист":type==="blank"?"Протокол специалиста":"Методика и руководство";
  const head='<h1>'+esc(title)+'</h1><p>Возраст: '+AGE_LABELS[state.age]+' · Психотека · Рабочий нестандартизированный маршрут</p>';
  const list=lines=>lines.map(x=>x===""?'<div style="height:13px"></div>':'<p>'+esc(x)+'</p>').join("");
  let html="";
  if(type==="blank")html=head+list(blankLines());
  else if(type==="report")html=head+list(reportLines());
  else if(type==="stimuli")html=head+'<p><strong>Только для специалиста. Не выдавать ребенку.</strong></p>'+TASKS.map((t,i)=>'<section class="task"><h2>'+(i+1)+'. '+esc(t.title)+'</h2>'+route(i).stimuli.map(s=>'<p>'+esc(s)+'</p>').join("")+'</section>').join("");
  else if(type==="child")html=childSheet();
  else {
   html=head+'<p>Авторская рабочая серия Психотеки. Проводится индивидуально с качественной регистрацией, без нормативных уровней. План до 40 минут; корректируйте по утомляемости и состоянию.</p>'+
    TASKS.map((t,i)=>{const v=route(i);return '<section class="task"><h2>'+(i+1)+'. '+esc(t.title)+' · '+SCHEDULE[i]+' мин</h2><p>Цель: '+esc(t.goal)+'</p><p>Вариант: '+esc(v.name)+'. Материалы: '+esc(v.materials)+'</p><ol>'+v.procedure.map(s=>'<li>'+esc(s)+'</li>').join("")+'</ol><p>Регистрация: самостоятельность, помощь, ошибки, утомление, самокоррекция.</p></section>'}).join("");
   if(type==="guide-blank")html+='<div class="page-break"></div>'+list(blankLines());
  }
  return '<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>'+esc(title)+'</title><style>@page{size:A4;margin:16mm 17mm}body{font:11pt/1.42 Arial,sans-serif;color:#202b27}h1{font-size:17pt;margin:0 0 12pt}h2{font-size:12pt;margin:16pt 0 5pt}p{margin:4pt 0;overflow-wrap:break-word}li{margin:4pt 0}ol{padding-left:22px}.task{break-inside:avoid;page-break-inside:avoid;margin-bottom:13pt}.page-break{break-before:page;page-break-before:always}.shapes{display:grid;grid-template-columns:repeat(10,1fr);gap:5px;margin:16pt 0}.shapes svg{width:22px;height:22px}.letter-grid{display:grid;grid-template-columns:repeat(20,1fr);gap:3px;margin:14pt 0}.letter-grid span{text-align:center;font:16pt/1.5 monospace;border-bottom:1px solid #ddd}.copy-area{min-height:95pt;border:1px solid #ddd;margin-top:8pt;padding:9pt}.copy-area svg{width:90px;height:70px;vertical-align:middle;margin-right:25pt}.empty-area{height:120pt;border:1px solid #bbb;margin:8pt 0 20pt}</style></head><body>'+html+'</body></html>';
 }
 function shapeSvg(kind){
  const shape=kind===0?'<circle cx="15" cy="15" r="10" fill="none" stroke="#111" stroke-width="2.4"/>':kind===1?'<path d="M15 4 L27 25 L3 25 Z" fill="none" stroke="#111" stroke-width="2.4"/>':'<rect x="5" y="5" width="20" height="20" fill="none" stroke="#111" stroke-width="2.4"/>';
  return '<svg viewBox="0 0 30 30" aria-hidden="true">'+shape+'</svg>';
 }
 function childSheet(){
  const letters="АОМКНРЛТСПЕВУХЗИ";
  let cells="";
  if(state.age<2){for(let i=0;i<90;i++)cells+=shapeSvg((i*7+Math.floor(i/3))%3);}
  else {for(let i=0;i<200;i++)cells+='<span>'+letters[(i*7+Math.floor(i/11)+i*i)%letters.length]+'</span>';}
  return '<h1>Рабочий лист</h1><p>Код: _____________________ Дата: _______________</p><h2>Задание 1</h2><p>'+(state.age===0?"Найди все круги.":state.age===1?"Отметь все треугольники.":state.age===2?"Зачеркни все буквы А.":"Зачеркни все буквы А, подчеркни все буквы О.")+'</p><div class="'+(state.age<2?"shapes":"letter-grid")+'">'+cells+'</div><div class="page-break"></div><h2>Задание 2</h2><p>Рассмотри образец и нарисуй так же на свободном поле.</p><div class="copy-area">'+shapeSvg(0)+shapeSvg(1)+shapeSvg(2)+'</div><div class="empty-area"></div><h2>Задание 3</h2><p>Повтори расположение фигур.</p><div class="copy-area">'+(state.age<2?shapeSvg(0)+shapeSvg(2):'<svg viewBox="0 0 110 70" style="width:120px"><rect x="8" y="10" width="64" height="45" stroke="black" fill="none" stroke-width="2"/><circle cx="59" cy="28" r="20" stroke="black" fill="none" stroke-width="2"/></svg>')+'</div><div class="empty-area"></div>';
 }
 function openPrint(type){
  if(type==="report"&&!routeReady())return;
  const win=window.open("","_blank");
  if(!win){window.alert("Разрешите открытие окна для печати в браузере.");return}
  win.document.open();win.document.write(printHTML(type));win.document.close();
  win.focus();win.setTimeout(()=>win.print(),350);
 }
 function xml(s){return esc(s).replace(/&#39;/g,"&apos;");}
 function xmlDoc(lines){
  const paragraph=s=>'<w:p><w:pPr><w:spacing w:after="130"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">'+xml(s)+'</w:t></w:r></w:p>';
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+lines.map(paragraph).join("")+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850"/></w:sectPr></w:body></w:document>';
 }
 function zipStore(entries){
  const encoder=new TextEncoder();let local=[],central=[],offset=0;
  const u16=n=>[n&255,(n>>>8)&255],u32=n=>[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];
  function crc(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^0xffffffff)>>>0;}
  for(const [name,value] of Object.entries(entries)){
   const path=encoder.encode(name),bytes=encoder.encode(value),sum=crc(bytes);
   const head=[...u32(0x04034b50),...u16(20),...u16(0x800),...u16(0),...u16(0),...u16(0),...u32(sum),...u32(bytes.length),...u32(bytes.length),...u16(path.length),...u16(0),...path];
   local.push(new Uint8Array(head),bytes);
   central.push(new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0x800),...u16(0),...u16(0),...u16(0),...u32(sum),...u32(bytes.length),...u32(bytes.length),...u16(path.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...path]));
   offset+=head.length+bytes.length;
  }
  const centralLength=central.reduce((n,x)=>n+x.length,0);
  const end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(central.length),...u16(central.length),...u32(centralLength),...u32(offset),...u16(0)]);
  return new Blob([...local,...central,end],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
 }
 function downloadDocx(type){
  if(type==="report"&&!routeReady())return;
  const rows=type==="report"?reportLines():blankLines();
  const files={
   "[Content_Types].xml":'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
   "_rels/.rels":'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
   "word/document.xml":xmlDoc(rows)
  };
  const url=URL.createObjectURL(zipStore(files)),a=document.createElement("a");
  a.href=url;a.download="pmpk-"+(type==="report"?"report":"protocol")+"-"+["3-5","5-7","7-11","11-18"][state.age]+".docx";document.body.appendChild(a);a.click();a.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),60000);
 }
 root.addEventListener("click",e=>{
  const button=e.target.closest("button");if(!button||!root.contains(button))return;
  if(button.hasAttribute("data-age")){state.age=Number(button.dataset.age);state.tab="portfolio";render();}
  else if(button.dataset.tab){state.tab=button.dataset.tab;render();}
  else if(button.dataset.action==="processing"){state.tab="processing";render();}
  else if(button.dataset.action==="back"){state.tab="portfolio";render();}
  else if(button.dataset.action==="clear"){if(window.confirm("Очистить введенные результаты для возраста "+AGE_LABELS[state.age]+"?")){state.data[state.age]={code:"",date:new Date().toISOString().slice(0,10),conditions:"",summary:"",items:TASKS.map(()=>({status:"",result:"",help:"",notes:"",reason:"",duration:""}))};render()}}
  else if(button.dataset.print)openPrint(button.dataset.print);
  else if(button.dataset.docx)downloadDocx(button.dataset.docx);
 });
 function storeValue(el){
  if(el.dataset.meta){rec()[el.dataset.meta]=el.value;syncProgress();return}
  if(el.dataset.task===undefined)return;
  const item=rec().items[Number(el.dataset.task)],key=el.dataset.field;
  if(key==="duration"&&el.value!==""&&(!Number.isInteger(Number(el.value))||Number(el.value)<0||Number(el.value)>3600)){el.setCustomValidity("Введите целое число секунд от 0 до 3600.");el.reportValidity();return}
  el.setCustomValidity("");item[key]=el.value;
  if(key==="status"){item.result="";item.help="";item.notes="";item.reason="";item.duration="";render()}else syncProgress();
 }
 root.addEventListener("input",e=>{const el=e.target;if(el.matches("[data-meta],[data-task]"))storeValue(el)});
 root.addEventListener("change",e=>{const el=e.target;if(el.matches("[data-meta],[data-task]"))storeValue(el)});
 render();
 const navButton=document.querySelector('.navgroup[data-view="pmpk"]');
 if(navButton){
  navButton.addEventListener("click",()=>{if(location.hash!=="#pmpk")history.replaceState(null,"",location.pathname+location.search+"#pmpk")});
  document.querySelectorAll('.navgroup[data-view]:not([data-view="pmpk"])').forEach(btn=>btn.addEventListener("click",()=>{if(location.hash==="#pmpk")history.replaceState(null,"",location.pathname+location.search)}));
  if(location.hash==="#pmpk")navButton.click();
  window.addEventListener("hashchange",()=>{if(location.hash==="#pmpk")navButton.click()});
 }
 window.PSY_PMPK_TEST={ready:routeReady,progress:progress,ageLabels:AGE_LABELS.slice(),taskCount:TASKS.length};
})();
