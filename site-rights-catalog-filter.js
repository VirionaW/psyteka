"use strict";
(function(){
  // Only explicitly selected restricted/licensable instruments are excluded.
  // Other methods still require their own content and translation rights checks.
  const blocked = new Set([
    "RCADS-47",
    "Сильные стороны и трудности (SDQ)",
    "Conners Rating Scales",
    "Reynolds Adolescent Depression Scale (RADS-2)",
    "BRIEF-2",
    "Стандартные прогрессивные матрицы Равена",
    "Coopersmith Self-Esteem Inventory",
    "Piers-Harris Children Self-Concept Scale",
    "Индекс хорошего самочувствия WHO-5"
  ]);
  const original = window.PSY_CATALOG || [];
  window.PSY_RIGHTS_EXCLUDED = original.filter(m => blocked.has(m.name));
  window.PSY_CATALOG = original.filter(m => !blocked.has(m.name));
})();
