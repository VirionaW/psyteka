"use strict";
/* Разграничение общего школьного каталога и специализированных программ ОВЗ.
 * Не меняем ID, исходные методические записи и ссылки на источники.
 * Эту вставку загрузить после catalog.js, но до app.js и experience.js.
 */
(function(){
 const catalog=window.PSY_CATALOG;
 if(!Array.isArray(catalog))return;
 const specialOnly=new Set([
  "Ступени развития",
  "Сенсорная интеграция для обучающихся с РАС и ТМНР"
 ]);
 const moved=catalog.filter(m=>m&&specialOnly.has(m.name));
 if(moved.length!==2||new Set(moved.map(m=>m.name)).size!==2){
  // При параллельных изменениях не исключаем карточки, пока нет всех записей.
  return;
 }
 window.PSY_SPECIAL_CATALOG=moved.map(m=>Object.assign({},m));
 window.PSY_CATALOG=catalog.filter(m=>!specialOnly.has(m.name));
})();
