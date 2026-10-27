"use strict";
(function () {
  // Until reproduction and commercial distribution rights are documented,
  // entries are kept in the reference list (suggest-method.html) but not
  // in the active general diagnostic catalog.
  const keep = new Set([
    "Шкала самооценки Розенберга (RSES)",
    "PHQ-9 - опросник депрессивных симптомов",
    "GAD-7 - краткая шкала тревожных симптомов",
    "Таблицы Шульте",
    "Заучивание 10 слов",
    "Повторение цифровых рядов (прямой и обратный порядок)",
    "Парные ассоциации (смысловая и механическая память)",
    "Простые аналогии (словесно-логическое мышление)",
    "Проба на динамический праксис «Кулак – ребро – ладонь»",
    "Классификация предметов (словесный вариант)",
    "Исключение четвертого лишнего (словесный вариант)",
    "Социометрическое исследование класса"
  ]);
  const original = window.PSY_CATALOG || [];
  window.PSY_RIGHTS_EXCLUDED = original.filter(m => m.theme !== "Программы" && !keep.has(m.name));
  window.PSY_CATALOG = original.filter(m => m.theme === "Программы" || keep.has(m.name));
})();
