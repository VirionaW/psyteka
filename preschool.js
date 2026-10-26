"use strict";
(function(){
 const root=document.getElementById("preschoolView");
 const tree=document.getElementById("preschoolTree");
 if(!root||!tree)return;
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const subjects=[
  {group:"Диагностика",topic:"Адаптация",title:"Карта наблюдения за адаптацией к детскому саду",age:"2-7",goal:"Проследить изменения поведения и самочувствия ребенка в период привыкания к ДОУ.",audience:"Педагог-психолог совместно с воспитателем",steps:"Наблюдайте ребенка в обычные режимные моменты на протяжении нескольких дней. Сопоставляйте наблюдения с беседой с родителем. Не оценивайте адаптацию по одному дню.",items:["Затрудняется расставаться с сопровождающим взрослым","Ищет поддержку воспитателя при волнении","Включается в свободную игру","Обращается к сверстникам по собственной инициативе","Участвует в привычных режимных моментах","Проявляет выраженное напряжение в течение дня"],recommend:"Описывайте динамику по датам, отмечайте особенности распорядка и способы поддержки. Не выводите диагноз или степень адаптации из числа отмеченных пунктов."},
  {group:"Диагностика",topic:"Тревожность",title:"Карта наблюдения признаков тревоги",age:"3-7",goal:"Зафиксировать ситуации, в которых у ребенка возникает заметное напряжение, и доступные способы поддержки.",audience:"Педагог-психолог",steps:"Наблюдайте в знакомой обстановке. При необходимости уточните у воспитателя, когда реакция проявлялась и что ей предшествовало. Это не стандартизированный тест тревожности.",items:["Напрягается перед незнакомым заданием или событием","Часто ищет подтверждения и поддержки взрослого","Избегает отдельных ситуаций в группе","Рассказывает о беспокойстве или страхе","Успокаивается после предсказуемого объяснения","Возвращается к игре после поддержки"],recommend:"Отделяйте фактическое наблюдение от гипотез. Для вывода о тревожности нужна профессиональная оценка с учетом возраста, условий и нескольких источников."},
  {group:"Диагностика",topic:"Страхи",title:"Протокол беседы о детских страхах",age:"4-7",goal:"Бережно выяснить, чего опасается ребенок, в каких ситуациях и что помогает ему чувствовать безопасность.",audience:"Педагог-психолог",steps:"Проводите добровольную беседу без внушающих формулировок. Не требуйте рассказывать о пугающих событиях и не используйте этот лист как шкалу выраженности страха.",items:["Ребенок самостоятельно называет пугающую ситуацию","Может описать, что происходит перед страхом","Называет взрослого, к которому обратится","Указывает безопасное место или действие, помогающее ему","Предпочитает не обсуждать отдельные темы"],recommend:"Отразите дословные слова ребенка отдельно от предположений специалиста. Не делайте выводов о травме только по ответам."},
  {group:"Диагностика",topic:"Эмоциональная сфера",title:"Карта эмоционального благополучия",age:"3-7",goal:"Исследовать повседневное выражение эмоций и доступность поддержки ребенку.",audience:"Педагог-психолог, воспитатель",steps:"Фиксируйте поведение в игре, на занятиях и в переходных моментах. Ориентируйтесь на индивидуальные особенности и повторные наблюдения.",items:["Выражает радость в игре","Может обратиться за помощью при огорчении","Различает основные чувства в понятной ситуации","Принимает поддержку при сильных переживаниях","Пробует доступный способ успокоения","Восстанавливает участие в общей деятельности после затруднения"],recommend:"Отметьте обстоятельства каждого наблюдения. Частота и выраженность признаков здесь не имеют стандартизированных нормативов."},
  {group:"Диагностика",topic:"Поведение",title:"Протокол наблюдения поведения в группе",age:"3-7",goal:"Выявить ситуации затруднений, сильные стороны и эффективные способы организации среды.",audience:"Педагог-психолог и воспитатель",steps:"Разделите описание на ситуацию до поведения, наблюдаемое действие и последствие. Не присваивайте ребенку ярлыки.",items:["Соблюдает понятное правило при поддержке взрослого","Прерывает занятие при неожиданной перемене условий","Принимает помощь в конфликтной ситуации","Может вернуться к занятию после паузы","Обращается за помощью вместо физического действия","Участвует в согласовании правил игры"],recommend:"Описывайте конкретные эпизоды, факторы среды и динамику. Отдельные отметки не являются диагностикой расстройства поведения."},
  {group:"Диагностика",topic:"Общение",title:"Карта взаимодействия со сверстниками",age:"3-7",goal:"Зафиксировать участие ребенка в совместной игре и способы общения.",audience:"Педагог-психолог, воспитатель",steps:"Понаблюдайте за несколькими свободными и организованными играми. Не проводите публичного ранжирования детей.",items:["Проявляет интерес к совместной игре","Предлагает сверстникам игровое действие","Откликается на приглашение в игру","Может договариваться о роли с поддержкой","Обращается к взрослому при конфликте","Помогает или принимает помощь сверстника"],recommend:"Результат описательный. Не называйте ребенка изолированным или отвергаемым на основании единичного эпизода."},
  {group:"Диагностика",topic:"Внимание",title:"Наблюдение за вниманием в игре",age:"3-7",goal:"Описать удержание внимания и условия, помогающие выполнять возрастное задание.",audience:"Педагог-психолог",steps:"Используйте привычную возрастную игру, не задавайте универсальный норматив времени. Отмечайте мотивацию, утомление и помощь.",items:["Включается в предложенную деятельность","Удерживает цель при понятной инструкции","Переключается между действиями по сигналу","Возвращается к задаче после отвлечения","Пользуется напоминанием взрослого"],recommend:"Этот протокол не заменяет стандартизированную диагностику внимания и не дает балльную норму."},
  {group:"Диагностика",topic:"Память",title:"Карта наблюдения памяти в бытовых заданиях",age:"4-7",goal:"Описать запоминание и воспроизведение знакомых игровых правил и последовательностей.",audience:"Педагог-психолог",steps:"Используйте повседневные игровые ситуации; не подменяйте ими авторскую методику заучивания слов.",items:["Помнит знакомое правило игры","Воспроизводит недавнюю последовательность игровых действий","Вспоминает поручение после небольшой паузы","Использует зрительную подсказку при необходимости","Уточняет инструкцию вместо случайного ответа"],recommend:"Сохраняйте описание конкретной задачи и объема помощи без самостоятельных возрастных порогов."},
  {group:"Диагностика",topic:"Мышление",title:"Карта познавательных действий в игре",age:"4-7",goal:"Описать, как ребенок группирует предметы, сравнивает и объясняет свои решения.",audience:"Педагог-психолог",steps:"Используйте доступные игрушки и предметные карточки в игровой ситуации. В протоколе укажите, какие материалы предъявлялись.",items:["Группирует предметы по заметному признаку","Объясняет выбор доступным способом","Находит сходство двух предметов","Находит различие в знакомых ситуациях","Меняет способ решения после подсказки"],recommend:"Не используйте универсальные баллы или показатели интеллекта для этой авторской карты."},
  {group:"Диагностика",topic:"Саморегуляция",title:"Карта произвольности и саморегуляции",age:"4-7",goal:"Отметить особенности следования инструкции и управления действиями в привычной деятельности.",audience:"Педагог-психолог",steps:"Понаблюдайте за ребенком в нескольких нестрессовых ситуациях и при разном объеме помощи.",items:["Слушает короткую инструкцию до начала действия","Останавливается по понятному сигналу","Может подождать своей очереди с поддержкой","Корректирует действие после напоминания","Сообщает о затруднении","Завершает доступное задание"],recommend:"Отмечайте, какая помощь была нужна. Не отождествляйте поведенческие особенности с диагнозом."},
  {group:"Диагностика",topic:"Семья",title:"Протокол беседы о семейной поддержке",age:"4-7",goal:"Выяснить представления ребенка о доступной поддержке и способах обращения к близким.",audience:"Педагог-психолог",steps:"Используйте открытые вопросы без давления, не делайте выводы о семейных отношениях по одному рисунку или высказыванию.",items:["Может назвать значимого взрослого","Описывает приятное совместное занятие","Понимает, как попросить помощи","Сообщает, с кем ему комфортно общаться","Может отказаться от ответа без давления"],recommend:"Уважайте границы ребенка и не фиксируйте в публичном сервисе фамилии, адреса или другие персональные данные."},
  {group:"Диагностика",topic:"Готовность к школе",title:"Карта предпосылок готовности к школе",age:"5-7",goal:"Описать учебно-значимые навыки без подмены комплексного обследования единым баллом.",audience:"Педагог-психолог",steps:"Используйте доступные возрастные задания и беседу. Уточняйте данные у воспитателя и родителей.",items:["Проявляет интерес к новому познавательному заданию","Понимает короткую инструкцию","Удерживает цель задания с доступной помощью","Может работать по образцу","Принимает обратную связь без сильного напряжения","Обращается за разъяснением"],recommend:"Готовность к школе многокомпонентна. Эта карта не является основанием для отбора, отказа в зачислении или постановки диагноза."},
  {group:"Работа с воспитателями",topic:"Наблюдение",title:"Совместный лист наблюдения воспитателя и психолога",age:"2-7",goal:"Собрать фактические наблюдения о благополучии и участии ребенка в жизни группы.",audience:"Воспитатель с сопровождением педагога-психолога",steps:"Согласуйте ситуации наблюдения и используйте нейтральные описания. Обсудите результат индивидуально, без оценок ребенка перед группой.",items:["Отмечены ситуации успешного взаимодействия","Зафиксированы условия, вызывающие затруднение","Описана помощь, которая сработала","Согласован единый подход взрослых","Назначено повторное наблюдение"],recommend:"Обсуждайте наблюдаемые факты, не медицинские гипотезы. Лист предназначен для командного сопровождения."},
  {group:"Работа с воспитателями",topic:"Адаптация группы",title:"План поддержки адаптации вместе с воспитателем",age:"2-7",goal:"Организовать согласованные ежедневные действия взрослых при адаптации детей.",audience:"Педагог-психолог и воспитатель",steps:"Обсудите индивидуальные особенности детей и доступные меры поддержки без ранжирования группы по диагностическим категориям.",items:["Определен понятный ритуал встречи","Предусмотрено безопасное место для паузы","Взрослые согласовали способ реагирования на плач","Родителям разъяснен порядок обратной связи","Назначен срок обсуждения динамики"],recommend:"Изменения адаптации оценивайте по повторным фактическим наблюдениям и самочувствию ребенка."},
  {group:"Работа с воспитателями",topic:"Консультации",title:"Консультация воспитателя: эмоции и поведение",age:"3-7",goal:"Разобрать трудную ситуацию без обвинений и составить реалистичный план поддержки.",audience:"Педагог-психолог и воспитатель",steps:"Сначала определите одну конкретную ситуацию, затем факторы среды, помощь и критерии улучшения.",items:["Описана конкретная ситуация без ярлыков","Выявлены возможные триггеры в обстановке","Названы сильные стороны ребенка","Выбраны один-два способа поддержки","Согласована дата повторного обсуждения"],recommend:"Не передавайте персональные записи другим семьям и не оформляйте психологический диагноз по чек-листу."},
  {group:"Работа с родителями",topic:"Адаптация семьи",title:"Беседа с родителями перед началом детского сада",age:"2-7",goal:"Уточнить привычный режим и способы поддерживать ребенка при переходе в ДОУ.",audience:"Педагог-психолог и законный представитель",steps:"Предложите обсудить распорядок, привычные способы успокоения и ожидания от начала посещения. Ответы добровольны.",items:["Обсужден привычный распорядок дня","Выяснены понятные ребенку ритуалы расставания","Определен способ связи с педагогами","Уточнено, что помогает ребенку успокоиться","Согласовано, когда обсудить первые наблюдения"],recommend:"Не обещайте универсальный срок адаптации. Сосредоточьтесь на предсказуемости и сотрудничестве семьи с ДОУ."},
  {group:"Работа с родителями",topic:"Рекомендации",title:"План беседы: как поддержать ребенка при тревоге",age:"3-7",goal:"Подготовить короткие конкретные рекомендации семье без запугивания и оценок.",audience:"Педагог-психолог и законный представитель",steps:"Спросите о конкретных ситуациях и повседневных способах поддержки. Уточните, что уже помогало.",items:["Названы ситуации, когда ребенок тревожится","Родитель получил примеры поддерживающих фраз","Обсуждены предсказуемые ритуалы и режим","Определены признаки, требующие дополнительной консультации","Согласован небольшой следующий шаг"],recommend:"Не предлагайте принуждение к пугающим ситуациям. При стойком выраженном нарушении повседневной жизни рекомендована очная консультация профильного специалиста."},
  {group:"Коррекционно-развивающая работа",topic:"Эмоции и страхи",title:"План игрового занятия «Узнаем свои чувства»",age:"4-7",goal:"Упражнять безопасное распознавание эмоций и обращение за поддержкой.",audience:"Педагог-психолог",steps:"Начните с эмоциональных карточек или игрушек, разберите вымышленную ситуацию, предложите выбрать способ поддержки, завершите спокойной игрой.",items:["Подготовлены нейтральные игровые ситуации","Обозначено право ребенка не рассказывать личные истории","Ребенок получил доступную альтернативу речи","Потренирована просьба о помощи","Отмечено самочувствие после занятия"],recommend:"Это развивающее занятие, а не тест. Нельзя делать выводы о причинах страха по отдельным игровым ответам."},
  {group:"Коррекционно-развивающая работа",topic:"Общение и игра",title:"План занятия «Играем и договариваемся»",age:"3-7",goal:"Развивать очередность действий, просьбы и сотрудничество в совместной игре.",audience:"Педагог-психолог, малая группа",steps:"Выберите короткую кооперативную игру, покажите образец просьбы, организуйте смену ролей и обсудите успешное взаимодействие.",items:["Подобрана посильная совместная игра","Правила показаны визуально или действием","Дети потренировали просьбы и предложения","Предусмотрена помощь взрослого в конфликте","Зафиксирован удачный способ сотрудничества"],recommend:"Не сравнивайте детей публично и не присваивайте участникам рейтинги."},
  {group:"Коррекционно-развивающая работа",topic:"Индивидуальные занятия",title:"Конструктор короткого индивидуального занятия",age:"3-7",goal:"Составить понятную структуру развивающего занятия по актуальному запросу.",audience:"Педагог-психолог",steps:"Задайте одну цель, выберите короткое вступление, игровое упражнение, паузу и завершение. Учитывайте желание и утомляемость ребенка.",items:["Сформулирована одна достижимая цель","Упражнение соответствует возрасту","Предусмотрен игровой способ включения","Предусмотрена пауза или альтернативное действие","Отмечена реакция ребенка после занятия"],recommend:"Индивидуальная программа строится после изучения запроса, а не только по этому шаблону."},
  {group:"Работа с воспитателями",topic:"Динамика адаптации",title:"Сравнение наблюдений адаптации по датам",age:"2-7",goal:"Сопоставлять фактические наблюдения в разные периоды сопровождения.",audience:"Педагог-психолог и воспитатель",steps:"Проведите наблюдение по одинаковым ориентирам в разные дни, отмечая произошедшие изменения и влияющие обстоятельства.",items:["Есть исходное наблюдение с датой","Есть повторное наблюдение с датой","Описаны изменения поведения без балльных норм","Уточнены изменившиеся условия в группе","Согласован следующий шаг сопровождения"],recommend:"Одна заполненная карта не подтверждает положительную или отрицательную динамику. Для выводов необходимы повторные наблюдения."},
 ];
 const reuse=[
  {group:"Диагностика",topic:"Самооценка",title:"Лесенка",age:"5-7",goal:"Изучение представлений ребенка о себе в рамках выбранной редакции методики.",existing:"Лесенка"},
  {group:"Диагностика",topic:"Готовность к школе",title:"Графический диктант",age:"6-7",goal:"Оценка выполнения графической инструкции в условиях конкретной версии методики.",existing:"Графический диктант"},
  {group:"Диагностика",topic:"Мышление",title:"Методика классификации предметов",age:"5-7",goal:"Используйте только доступный комплект Психотеки с указанными ограничениями.",existing:"Методика классификации предметов"}
 ];

 const portfolioDetails={
  "Карта наблюдения за адаптацией к детскому саду":{
   format:"Карта повторного наблюдения",
   goal:"Описать освоение ребенком обстановки группы: расставание с близкими, обращение за поддержкой, игру, общение и участие в режиме дня. Выявить подходящие способы сопровождения.",
   conditions:"Естественные ситуации в группе: утренний приход, свободная игра, общение с воспитателем и сверстниками, переходы между занятиями. Возраст 2-7 лет ориентировочный, при поступлении или смене группы.",
   indicators:["Расставание с сопровождающим взрослым","Контакт с воспитателем и принятие помощи","Включение в свободную игру","Инициатива общения со сверстниками","Участие в режимных моментах","Напряжение и восстановление спокойствия"],
   materials:["Протокол с датой и ситуацией наблюдения","Сведения о привычных ритуалах от семьи и воспитателя"],
   steps:[
    "Уточните обстоятельства поступления и согласуйте наблюдение с ответственными взрослыми.",
    "В обычных ситуациях без провоцирования стресса зафиксируйте действия ребенка и помощь воспитателя.",
    "Отметьте пункты протокола с указанием даты, контекста и того, что реально наблюдалось.",
    "Повторите наблюдение в сопоставимых ситуациях в другие дни.",
    "Обсудите изменения с воспитателем и семьей; выберите небольшие конкретные способы поддержки."
   ],
   registration:"«Отмечено» означает, что действие наблюдалось в данном эпизоде. «Не отмечено» – что его не наблюдали в указанной ситуации; это не характеристика ребенка во всех условиях. Пустое поле означает отсутствие данных.",
   reading:"Сопоставьте записи в разные дни. Опишите, какие условия помогают включаться в игру, обращаться к взрослым и выдерживать переходы. Учитывайте ритуалы семьи, темп привыкания и конкретную помощь.",
   limits:"Рабочая форма не имеет стандартизированных норм, баллов или порогов. Одно наблюдение не определяет «степень адаптации» и не позволяет ставить диагноз.",
   outcome:"Качественная характеристика динамики, сильных сторон ребенка, затрудняющих ситуаций и согласованной поддержки."
  },
  "Карта наблюдения признаков тревоги":{
   format:"Качественная карта наблюдения",
   goal:"Описать ситуации заметного беспокойства у дошкольника и то, какие объяснения, действия и формы поддержки помогают вернуться к обычной деятельности.",
   conditions:"Наблюдение детей ориентировочно 3-7 лет в привычной группе: при начале незнакомого задания, смене обстановки, ожидании, обращении ко взрослому и в свободной игре.",
   indicators:["Реакция на новое событие","Поиск поддержки и подтверждения взрослого","Избегание конкретных ситуаций","Слова ребенка о тревоге или страхе","Реакция на спокойное объяснение","Возвращение к игре после помощи"],
   materials:["Рабочий протокол психолога","Описание ситуации и комментарии воспитателя по фактическим наблюдениям"],
   steps:[
    "Уточните конкретные повседневные ситуации, которые вызывают затруднения; не организуйте намеренно пугающих испытаний.",
    "Наблюдайте за реальными действиями и, если уместно, дословными словами ребенка.",
    "Записывайте, что предшествовало эпизоду, как реагировал ребенок, что сделал взрослый и как завершилась ситуация.",
    "При повторных наблюдениях сравнивайте условия и эффективность помощи, а не только количество отмеченных пунктов.",
    "Предложите предсказуемые способы поддержки; при стойком нарушении обычной жизни рекомендуйте очное профильное обследование."
   ],
   registration:"Отметки относятся к конкретному наблюдаемому эпизоду. Пустое поле – данных нет. Избегайте интерпретаций вроде «тревожный характер» вместо описания фактов.",
   reading:"Определите повторяющиеся ситуации, доступность помощи, возможность самостоятельно возвращаться к занятию и изменения после поддержки. Оценивайте вместе с возрастом и обстановкой.",
   limits:"Не является шкалой тревожности, не имеет нормативов или диагностических порогов. Для психологического заключения необходима профессиональная оценка с несколькими источниками данных.",
   outcome:"Перечень ситуаций напряжения, эффективных способов поддержки и следующих шагов наблюдения."
  }
 };
 const verified=window.PSY_PRESCHOOL_VERIFIED?.catalog||[];
 const data=subjects.concat(reuse,verified).map((m,i)=>Object.assign({
  id:"preschool-"+String(i+1).padStart(2,"0"),
  format:m.existing?"Диагностическая методика":m.group==="Диагностика"?"Карта наблюдения / протокол":"Рабочий материал",
  author:m.existing?"":"Психотека"
 },m));
 const detailById=new Map(data.filter(m=>!m.existing).map(m=>[m.id,m]));
 // Все 21 рабочие записи ДОУ должны иметь портфолио, а не пустую вкладку.
 const derivedDetails=m=>({
  format:m.title.startsWith("Протокол беседы")?"Протокол беседы специалиста":m.group==="Диагностика"?"Карта качественного наблюдения":"Рабочая карта сопровождения",
  goal:m.goal,
  conditions:"Возраст выбранной рабочей формы: "+m.age+" лет. Наблюдение и беседа проводятся в доступной ребенку, безопасной и привычной ситуации. Запишите конкретные условия наблюдения.",
  indicators:(m.items||[]).slice(),
  materials:["Регистрационный протокол специалиста","Реальные материалы группы или беседы, предусмотренные описанной процедурой"],
  steps:[m.steps],
  registration:"Пункты фиксируются отдельно. «Отмечено» – действие наблюдалось в указанной ситуации; «Не отмечено» – в данной ситуации не наблюдалось; пустое поле – данных нет. Ни один вариант не заменяет заметки о контексте и помощи.",
  reading:m.recommend,
  limits:"Это описательный рабочий протокол без опубликованных возрастных нормативов и клинических порогов. Отметки нельзя переводить в диагноз или уровень развития.",
  outcome:"Качественная запись с датой, ситуацией, наблюдаемыми действиями и следующим шагом сопровождения."
 });
 for(const m of detailById.values())m.detailed=portfolioDetails[m.title]||derivedDetails(m);
 for(const m of detailById.values()){
  if(m.verified){window.PSY_FULL_METHODS[m.title]={workflow:"preschoolSheet",preschoolId:m.id,verified:true,verifiedKey:m.verifiedKey,portfolioFilled:true,author:m.author,age:m.age+" лет",kind:m.format,goal:m.goal,count:m.verifiedKey==="mittens"?"5 критериев":"3 выбора",source:m.source,calculator:true};continue;}
  window.PSY_FULL_METHODS[m.title]={
   workflow:"preschoolSheet",preschoolId:m.id,author:"Психотека",age:m.age+" лет",portfolioFilled:!!m.detailed,
   kind:m.format,goal:m.goal,count:m.items.length+" наблюдаемых пунктов",
   indicators:m.items.slice(0,5),indicatorsTitle:"Области наблюдения и работы",
   calculator:true,scoring:"Описательная регистрация без баллов и нормативных порогов.",
   interpret:m.recommend
  };
 }
 const ages=[["","Все возрастные группы"],["2-3","2-3 года"],["3-4","3-4 года"],["4-5","4-5 лет"],["5-6","5-6 лет"],["6-7","6-7 лет"]];
 const stateMap=new Map();
 let group="",topic="",query="",age="";
 const ownedState=d=>{const m=detailById.get(d.preschoolId);if(!m)throw Error("Не найдена форма");if(!stateMap.has(m.id))stateMap.set(m.id,{values:Array(m.items.length).fill(""),note:""});return stateMap.get(m.id)};
 const complete=d=>ownedState(d).values.every(v=>v==="Отмечено"||v==="Не отмечено");
 const summary=d=>{
  if(!complete(d))return null;
  const m=detailById.get(d.preschoolId),values=ownedState(d).values;
  return {yes:m.items.filter((_,i)=>values[i]==="Отмечено"),no:m.items.filter((_,i)=>values[i]==="Не отмечено")};
 };
 const ageMatch=m=>{if(!age)return true;const [a,b]=age.split("-").map(Number),[lo,hi]=m.age.replace(",",".").split("-").map(Number);return m.verified?(lo<=b&&hi>=a):(lo<=a&&hi>=b)};
 const themeName=m=>{
  const map={"Эмоциональная сфера":"Настроение","Поведение":"Агрессия","Страхи":"Тревожность","Саморегуляция":"Внимание","Готовность к школе":"Мышление","Адаптация группы":"Адаптация"};
  return map[m.topic]||(["Адаптация","Тревожность","Самооценка","Внимание","Память","Мышление","Семья","Общение","Агрессия","Настроение"].includes(m.topic)?m.topic:"Программы");
 };
 function picture(m){
  if(m.existing&&typeof artForMethod==="function")return artForMethod({name:m.existing,theme:themeName(m)});
  return typeof iconSvg==="function"?iconSvg(themeName(m)):"";
 }
 function show(){
  const out=data.filter(m=>(!group||m.group===group)&&(!topic||m.topic===topic)&&ageMatch(m)&&(!query||[m.title,m.goal,m.topic,m.author,m.group].join(" ").toLowerCase().includes(query.toLowerCase())));
  root.querySelector("#preschoolHeading").textContent=topic||group||"Материалы для детского сада";
  root.querySelector("#preschoolCount").textContent="Найдено: "+out.length;
  const guidance=root.querySelector("#preschoolGuidance");
  if(guidance)guidance.hidden=group!=="Работа с воспитателями";
  root.querySelector("#preschoolCards").innerHTML=out.map(m=>{
   const realAuthor=m.existing?(window.PSY_CATALOG||[]).find(x=>x.name===m.existing)?.author||"":"";
   const displayedAuthor=m.verified?m.author:realAuthor;
   const credit=displayedAuthor&&!/сведения об авторе уточняются/i.test(displayedAuthor)?'<p class="method-card-author">'+esc(displayedAuthor)+'</p>':"";
   return '<article class="method preschool-method" data-kind="'+(m.verifiedKey==="mittens"?"drawing":m.existing?"graphic":"other")+'"><div class="head"><div class="glyph">'+picture(m)+'</div><div><h3>'+esc(m.title)+'</h3>'+credit+'</div></div><div class="tags"><span class="tag">'+esc(m.format)+'</span><span class="tag">'+esc(m.age)+' лет</span></div><p class="method-card-summary">'+esc(m.goal)+'</p><div class="actions"><button class="btn primary" type="button" data-preschool-open="'+esc(m.id)+'">Открыть методику</button></div></article>';
  }).join("")||'<p class="preschool-empty">По выбранным параметрам материалов нет. Попробуйте другое направление или возраст.</p>';
  tree.querySelectorAll("[data-preschool-topic]").forEach(b=>b.classList.toggle("active",!!topic&&b.dataset.preschoolTopic===topic&&b.dataset.preschoolGroup===group));
  tree.querySelectorAll("[data-preschool-all]").forEach(b=>b.classList.toggle("active",!topic&&!group));
 }
 function selectCategory(g,t){
  group=g||"";topic=t||"";query="";
  root.querySelector("#preschoolSearch").value="";
  if(typeof selectView==="function")selectView("preschool");
  show();root.scrollIntoView({block:"start",behavior:"auto"});
 }
 tree.addEventListener("click",e=>{
  const toggle=e.target.closest("[data-preschool-toggle]");
  if(toggle){const target=document.getElementById(toggle.dataset.preschoolToggle);if(!target)return;target.hidden=!target.hidden;toggle.setAttribute("aria-expanded",String(!target.hidden));return}
  if(e.target.closest("[data-preschool-all]")){selectCategory("","");return}
  const b=e.target.closest("[data-preschool-topic]");if(b)selectCategory(b.dataset.preschoolGroup,b.dataset.preschoolTopic||"");
 });
 document.querySelector('[data-view="preschool"]')?.addEventListener("click",()=>{if(!tree.hidden)show()});
 root.innerHTML='<div class="filters preschool-filters"><label class="search-wrap"><span aria-hidden="true">⌕</span><input id="preschoolSearch" type="search" placeholder="Название методики, направление..." aria-label="Поиск дошкольных материалов"></label><label class="preschool-age-field"><select id="preschoolAge" aria-label="Возрастная группа">'+ages.map(([v,label])=>'<option value="'+esc(v)+'">'+esc(label)+'</option>').join("")+'</select></label></div><div class="subbar preschool-subbar"><h2 id="preschoolHeading">Материалы для детского сада</h2><span id="preschoolCount"></span></div><p class="preschool-educator-guidance" id="preschoolGuidance" hidden>Педагогическая диагностика проводится по решению ДОО, а формы и периодичность определяются самой организацией. Карта наблюдения не является обязательным федеральным бланком. <a href="https://docs.edu.gov.ru/document/0e6ad380fc69dd72b6065672830540ac/" target="_blank" rel="noopener noreferrer">ФОП ДО, раздел 16</a>.</p><div class="preschool-cards catalog" id="preschoolCards"></div>';
 root.querySelector("#preschoolSearch").addEventListener("input",e=>{query=e.target.value;show()});
 root.querySelector("#preschoolAge").addEventListener("change",e=>{age=e.target.value;show()});
 root.addEventListener("click",e=>{
  const b=e.target.closest("[data-preschool-open]");if(!b)return;
  const m=data.find(x=>x.id===b.dataset.preschoolOpen);
  if(!m||typeof window.openMethod!=="function")return;
  const found=m.existing?(window.PSY_CATALOG||[]).find(x=>x.name===m.existing):null;
  window.openMethod(found||{id:m.id,name:m.title,theme:m.topic,author:m.author,format:m.format,age:m.age+" лет",goal:m.goal});
 });
 function rowTable(m,values){
  return '<table class="preschool-table"><thead><tr><th>Наблюдение / действие</th><th>Отмечено</th><th>Не отмечено</th></tr></thead><tbody>'+
   m.items.map((v,i)=>'<tr><td>'+(i+1)+'. '+esc(v)+'</td><td>'+(values?.[i]==="Отмечено"?"Да":"")+'</td><td>'+(values?.[i]==="Не отмечено"?"Да":"")+'</td></tr>').join("")+'</tbody></table>';
 }
 function summaryMarkup(d){
  const s=summary(d);return s?'<h3>Описательное резюме</h3><p><b>Отмечено:</b> '+(s.yes.length?esc(s.yes.join("; ")):"нет отмеченных пунктов")+'.</p><p><b>Не отмечено:</b> '+(s.no.length?esc(s.no.join("; ")):"нет пунктов")+'.</p><p>Отметки фиксируют наблюдения, а не являются суммой баллов или диагнозом.</p>':'<p>Заполните все наблюдения для получения описательного резюме. Пустой ответ не равен «Не отмечено».</p>';
 }
 function portfolio(d){
  if(d.verified)return window.PSY_PRESCHOOL_VERIFIED.profile(d);
  const m=detailById.get(d.preschoolId),p=m?.detailed;
  if(!m||!p)return "";
  const rows=[["Материал",m.title],["Составитель","Психотека"],["Возраст",m.age+" лет"],["Вид",p.format],["Количество пунктов",String(m.items.length)],["Заполняет",m.audience]];
  const fields=rows.map(([label,value])=>'<div class="psy-profile-row"><strong>'+esc(label)+'</strong><span>'+esc(value)+'</span></div>').join("");
  const indicators=p.indicators.map(value=>'<div class="psy-profile-indicator"><span>'+esc(value)+'</span></div>').join("");
  return '<section class="psy-portfolio-reference psy-portfolio-unified">'+
   '<h3>Общие сведения</h3><div class="psy-profile-lines">'+fields+'</div>'+
   '<h3>Цель</h3><p class="psy-profile-description">'+esc(p.goal)+'</p>'+
   '<h3>Области наблюдения</h3><div class="psy-profile-indicators">'+indicators+'</div>'+
   '<h3>Условия применения</h3><p class="psy-profile-description">'+esc(p.conditions)+'</p>'+
   '<h3>Результат работы</h3><p class="psy-profile-description">'+esc(p.outcome)+'</p>'+
   '<h3>Ограничения</h3><p class="psy-profile-description">'+esc(p.limits)+'</p></section>';
 }
 function guideContent(m){
  const p=m.detailed;
  if(!p)return '<div class="psy-preschool-guide"><h3>Цель</h3><p>'+esc(m.goal)+'</p><h3>Для кого предназначено</h3><p>'+esc(m.audience)+'. Возраст: '+esc(m.age)+' лет.</p><h3>Порядок проведения</h3><p>'+esc(m.steps)+'</p><h3>Регистрация результатов</h3><p>Пункты отмечаются по наблюдаемому действию, без суммарного балла. Отдельно фиксируйте обстоятельства и помощь.</p><h3>Интерпретация и ограничения</h3><p>'+esc(m.recommend)+'</p></div>';
  return '<div class="psy-preschool-guide">'+
   '<h3>Назначение</h3><p>'+esc(p.goal)+'</p>'+
   '<h3>Условия проведения</h3><p>'+esc(p.conditions)+'</p>'+
   '<h3>Инструкция ребенку / условия предъявления</h3>'+
   (m.title.startsWith("Протокол беседы")?
     '<blockquote class="kid-instruction">Я хочу немного поговорить с тобой. Ты можешь отвечать своими словами, не отвечать на вопрос или попросить меня повторить его. Правильных и неправильных ответов здесь нет.</blockquote><p>Это вводная реплика специалиста; содержательные вопросы берутся из выбранного протокола беседы.</p>':
     '<p>Это карта наблюдения, а не задания, которые нужно предъявлять ребенку. Пункты протокола ребенку не зачитываются. При необходимости объясните наблюдение доступными словами и получите предусмотренное согласие.</p>')+
   '<h3>Подготовка и материалы</h3><ul>'+p.materials.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>'+
   '<h3>Порядок проведения для специалиста</h3><ol>'+p.steps.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol>'+
   '<h3>Регистрация и обработка</h3><p>'+esc(p.registration)+'</p>'+
   '<h3>Интерпретация</h3><p>'+esc(p.reading)+'</p>'+
   '<h3>Ограничения</h3><p>'+esc(p.limits)+'</p>'+
   '<h3>Итоговая запись</h3><p>'+esc(p.outcome)+'</p></div>';
 }
 function instruction(d){
  if(d.verified)return window.PSY_PRESCHOOL_VERIFIED.instruction(d);
  const m=detailById.get(d.preschoolId);
  return '<div class="psy-common-guide-head"><h3>Методика / руководство</h3><div class="psy-common-guide-actions"><button class="btn" type="button" data-preschool-print="guide">Без бланка</button><button class="btn primary" type="button" data-preschool-print="combined">С бланком</button></div></div>'+guideContent(m);
 }
 function materials(d){
  if(d.verified)return window.PSY_PRESCHOOL_VERIFIED.materials(d);
  const m=detailById.get(d.preschoolId);
  return '<div class="psy-common-guide-head"><h3>Протокол специалиста</h3><div class="psy-common-guide-actions"><button class="btn primary" type="button" data-preschool-print="blank">Посмотреть и распечатать</button></div></div><p>Дата: ___________________　Группа: ___________________</p>'+
  rowTable(m,null)+'<p class="preschool-paper-lines">Ситуация: ____________________________________________________________</p><p class="preschool-paper-lines">Помощь и следующий шаг: ____________________________________________________________</p><p class="privacy-inline">Протокол заполняет специалист. Не вписывайте ФИО детей на публичном сайте.</p>';
 }
 function calculator(d){
  if(d.verified)return window.PSY_PRESCHOOL_VERIFIED.calculator(d);
  const m=detailById.get(d.preschoolId),s=ownedState(d),ready=complete(d);
  return '<section class="psy-preschool-calc"><div class="preschool-results-head"><div><h3>Обработка результатов</h3><p>Описательная фиксация наблюдений без числовых норм</p></div><span class="preschool-status '+(ready?"complete":"pending")+'">'+(ready?"Данные заполнены":"Требуется заполнение")+'</span></div>'+
   '<div class="preschool-answer-list">'+m.items.map((x,i)=>'<label class="preschool-answer"><span>'+(i+1)+'. '+esc(x)+'</span><select data-preschool-answer="'+i+'" aria-label="'+esc(x)+'"><option value="">Нет ответа</option><option value="Отмечено" '+(s.values[i]==="Отмечено"?"selected":"")+'>Отмечено</option><option value="Не отмечено" '+(s.values[i]==="Не отмечено"?"selected":"")+'>Не отмечено</option></select></label>').join("")+'</div>'+
   '<label class="preschool-note-label">Контекст наблюдения (без персональных данных)<textarea id="preschoolContext" rows="3" placeholder="Условия, помощь, особенности ситуации...">'+esc(s.note)+'</textarea></label>'+
   '<div id="preschoolSummary" class="preschool-summary">'+summaryMarkup(d)+'</div>'+
   '<div class="preschool-result-actions"><button type="button" class="btn" id="preschoolClear">Очистить ответы</button><button type="button" class="btn primary" id="preschoolReport" '+(!ready?"disabled":"")+'>Печать результата</button></div></section>';
 }
 function updateFooter(d){
  if(d.verified)return window.PSY_PRESCHOOL_VERIFIED.updateFooter(d);
  const badge=document.getElementById("preschoolFooterStatus");
  if(!badge)return;
  const ready=complete(d);badge.className="psy-preschool-footer-state "+(ready?"complete":"pending");
  badge.textContent=ready?"Данные заполнены":"Требуется заполнение";
 }
 function bind(d){
  if(d.verified)return window.PSY_PRESCHOOL_VERIFIED.bind(d);
  const body=document.getElementById("modalBody");if(!body)return;
  const refresh=()=>{
   const ready=complete(d);const badge=body.querySelector(".preschool-status");
   if(badge){badge.className="preschool-status "+(ready?"complete":"pending");badge.textContent=ready?"Данные заполнены":"Требуется заполнение";}
   const summary=body.querySelector("#preschoolSummary");if(summary)summary.innerHTML=summaryMarkup(d);
   const report=body.querySelector("#preschoolReport");if(report)report.disabled=!ready;
   updateFooter(d);
  };
  body.querySelectorAll("[data-preschool-answer]").forEach(el=>el.addEventListener("change",()=>{
   ownedState(d).values[Number(el.dataset.preschoolAnswer)]=el.value;refresh();
  }));
  body.querySelector("#preschoolContext")?.addEventListener("input",e=>{ownedState(d).note=e.target.value;});
  body.querySelector("#preschoolClear")?.addEventListener("click",()=>{
   if(!window.confirm("Очистить все введенные ответы и примечание?"))return;
   const m=detailById.get(d.preschoolId);stateMap.set(m.id,{values:Array(m.items.length).fill(""),note:""});
   body.querySelectorAll("[data-preschool-answer]").forEach(el=>el.value="");
   const note=body.querySelector("#preschoolContext");if(note)note.value="";
   refresh();
  });
  body.querySelector("#preschoolReport")?.addEventListener("click",()=>print(d,"result"));
  body.querySelectorAll("[data-preschool-print]").forEach(btn=>btn.addEventListener("click",()=>print(d,btn.dataset.preschoolPrint)));
 }
 function print(d,mode){
  if(d.verified)return window.PSY_PRESCHOOL_VERIFIED.print(d,mode);
  const m=detailById.get(d.preschoolId);if(!m)return;
  if(mode==="result"&&!complete(d))return;
  const s=ownedState(d),printGuide='<section><h2>'+esc(m.title)+'</h2><p><b>Возраст:</b> '+esc(m.age)+' лет</p>'+guideContent(m)+'</section>';
  const printBlank='<section class="print-blank"><h2>Протокол специалиста</h2><p>Дата: _____________________　Группа: _____________________</p>'+rowTable(m,mode==="result"?s.values:null)+'<p>Контекст: '+(mode==="result"?esc(s.note||"Не указан"):"____________________________")+'</p><p>Следующий шаг: ___________________________________________</p></section>';
  const result=mode==="result"?'<section>'+summaryMarkup(d)+'</section>':"";
  const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>'+esc(m.title)+'</title><style>@page{size:A4 portrait;margin:16mm}*{box-sizing:border-box}body{font:11pt/1.45 Arial,sans-serif;color:#212121}h2{font-size:17pt}h3{font-size:12pt}table{border-collapse:collapse;width:100%;table-layout:fixed;font-size:9pt}td,th{border:1px solid #777;padding:6px;text-align:left;overflow-wrap:anywhere;vertical-align:top}th:first-child{width:65%}tr{break-inside:avoid}.print-blank:not(:first-child){break-before:page}p{margin:8px 0}</style></head><body>'+(mode==="guide"||mode==="combined"?printGuide:"")+(mode==="guide"?"":printBlank)+result+'</body></html>';
  const frame=document.createElement("iframe");frame.title="Печать протокола";frame.style.cssText="position:fixed;width:0;height:0;border:0";
  document.body.appendChild(frame);
  frame.onload=()=>{try{frame.contentWindow.focus();frame.contentWindow.print()}finally{setTimeout(()=>frame.remove(),1800)}};
  frame.srcdoc=html;
 }
 window.PSY_PRESCHOOL={portfolio,instruction,materials,calculator,bind,updateFooter,print};
 if(document.body.dataset.area==="preschool"){tree.hidden=false;document.querySelector('[data-view="preschool"]')?.setAttribute("aria-expanded","true")}
 show();
})();
