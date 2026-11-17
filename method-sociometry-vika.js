"use strict";
/* Метолария: самостоятельный протокол Вики. Только регистрация и сохранение ответов.
   Никогда не применяем к этим вопросам ключи или расчеты других вариантов социометрии. */
(function () {
  const api = window.PSY_NEW_METHODS;
  const versions = window.PSY_SOCIO_VARIANTS;
  if (!api || !versions) return;

  const KIND = "sociometry";
  const VIKA = "vika6";
  const PRIMARY = versions.PRIMARY;
  const RELATIONS = versions.VARIANT;
  const NONE = "__none__";
  const Q = [
    "С кем из своего класса ты бы отправился в поход?",
    "С кем бы из своего класса ты бы не отправился в поход?",
    "Кого из своих одноклассников ты бы пригласил на свой день рождения?",
    "Кого из своих одноклассников ты бы не пригласил на свой день рождения?",
    "С кем из своих одноклассников ты бы пошел писать олимпиаду?",
    "С кем из своих одноклассников ты бы не пошел писать олимпиаду?"
  ];
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c =>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const people = rows => (rows || []).filter(r => String(r?.name || "").trim());
  const absent = row => row?.socioVikaAbsent === true;
  const isVika = d => d?.methodType === KIND && selected === VIKA;
  const dirty = () => window.dispatchEvent(new Event("psy-assessment-dirty"));
  const uuid = () => typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID() : "socio-" + Date.now() + "-" + Math.random().toString(36).slice(2);

  const original = {
    activate: versions.activate,
    setVariant: versions.setVariant,
    controls: versions.controls,
    details: versions.details,
    calculator: api.calculator,
    bind: api.bind,
    materials: api.materials,
    instruction: api.instruction,
    processing: api.processing,
    score: api.score
  };
  let selected = versions.getVariant();
  const known = [PRIMARY, RELATIONS, VIKA];
  const storedVariant = rows => {
    const saved = (rows || []).find(r => known.includes(r?.socioVariant));
    return saved?.socioVariant || PRIMARY;
  };
  versions.activate = rows => {
    selected = storedVariant(rows);
    if (selected !== VIKA) original.activate(rows);
    return selected;
  };
  versions.getVariant = () => selected;
  versions.setVariant = (next, rows) => {
    selected = known.includes(next) ? next : PRIMARY;
    if (selected !== VIKA) original.setVariant(selected, rows);
    else if (Array.isArray(rows)) rows.forEach(r => {
      if (r && typeof r === "object") r.socioVariant = VIKA;
    });
    dirty();
  };
  const labels = [
    [PRIMARY, "6 вопросов: положительные и отрицательные выборы"],
    [RELATIONS, "6 вопросов: отношения и поддержка"],
    [VIKA, "6 вопросов Вики: поход, день рождения, олимпиада"]
  ];
  versions.controls = () =>
    '<section class="psy-socio-version-picker" aria-label="Варианты социометрии">' +
      '<div><strong>Вариант социометрии</strong><small>Выберите бланк для текущего обследования</small></div>' +
      '<div class="psy-socio-version-options">' +
      labels.map(([value, label]) =>
        '<button type="button" class="psy-socio-version-option ' + (selected === value ? "is-selected" : "") +
        '" data-socio-variant="' + value + '" aria-pressed="' + (selected === value) + '">' + esc(label) + '</button>'
      ).join("") + '</div>' +
      '<p>' + (selected === VIKA
        ? 'Вариант Вики – 6 вопросов, из них 3 положительных и 3 отрицательных. Сейчас доступен только ввод и сохранение. Результаты: «Не готово».'
        : selected === RELATIONS
          ? 'Вариант отношений и поддержки – отдельные вопросы и обработка.'
          : 'Вариант Метоларии – 3 положительных и 3 отрицательных вопроса.') +
      '</p></section>';
  versions.details = d => selected === VIKA ? {
    ...d,
    author: "Вопросы предоставлены Викой; авторство методики не установлено",
    kind: "Групповая социометрическая анкета – вариант Вики",
    count: "6 вопросов: 3 положительных и 3 отрицательных",
    goal: "Регистрация выборов одноклассников в ситуациях похода, дня рождения и олимпиады.",
    instructions: "Ответь на шесть вопросов об одноклассниках. Не выбирай себя. Ответы конфиденциальны.",
    scoring: "Не готово",
    interpret: "Не готово",
    warning: "Для этого набора вопросов ключ и обработка еще не установлены. Ответы сохраняются без расчета.",
    version: "SOCIOMETRY-VIKA-ENTRY-6-2026",
    indicators: ["Ответы на 6 вопросов", "Участие учеников", "Результаты – Не готово"]
  } : original.details(d);

  const ensureIds = rows => {
    let changed = false;
    people(rows).forEach(r => {
      if (!r.socioId) { r.socioId = uuid(); changed = true; }
    });
    if (changed) dirty();
  };
  const answers = (row, q) => [0, 1, 2].map(i =>
    String(Array.isArray(row?.socioVikaAnswers?.[q]) ? (row.socioVikaAnswers[q][i] || "") : ""));
  const answered = (row, q) => !absent(row) && answers(row, q).some(Boolean);
  const count = row => Q.filter((_, i) => answered(row, i)).length;
  const response = (id, roster) => id === NONE ? "Никого" :
    (roster.find(r => r.socioId === id)?.name || "");
  const type = i => i % 2 ? "Отрицательный выбор" : "Положительный выбор";

  function calculator(d, ctx) {
    if (ctx.calcMode !== "class")
      return '<section class="psy-new-work psy-socio psy-socio-vika">' +
        '<h3>Социометрия – вариант Вики</h3>' +
        '<p>Для ввода ответов всех учеников переключитесь в режим «Группа / класс».</p>' +
        '<div class="calc-mode"><button type="button" class="btn primary" data-cmode="class">Группа / класс</button></div>' +
        '<p class="psy-vika-pending"><strong>Результаты: Не готово</strong></p></section>';
    ensureIds(ctx.rows);
    const roster = people(ctx.rows), row = ctx.rows[ctx.rowIndex] || ctx.rows[0];
    const active = roster.includes(row);
    const allRows = ctx.rows.map((r, i) => String(r.name || "").trim()
      ? '<option value="' + i + '" ' + (i === ctx.rowIndex ? "selected" : "") + '>' +
        esc(r.name) + (absent(r) ? " (отсутствовал)" : "") + '</option>'
      : "").join("");
    const qCards = active && !absent(row) ? Q.map((question, q) => {
      const chosen = answers(row, q);
      const status = answered(row, q) ? "Ответ внесен" : "Не заполнено";
      const fields = [0, 1, 2].map(slot => {
        const id = "psyVikaPick" + q + "_" + slot;
        const options = [
          '<option value="">Не указан</option>',
          ...(slot === 0 ? ['<option value="' + NONE + '" ' +
            (chosen[0] === NONE ? "selected" : "") + '>Никого</option>'] : []),
          ...roster.filter(r => r !== row).map(r =>
            '<option value="' + esc(r.socioId) + '" ' +
            (chosen[slot] === r.socioId ? "selected" : "") + '>' + esc(r.name) + '</option>')
        ].join("");
        return '<label class="psy-vika-pick" for="' + id + '">' +
          (slot + 1) + ' выбор<select id="' + id + '" data-vika-q="' + q +
          '" data-vika-slot="' + slot + '" ' +
          (chosen[0] === NONE && slot > 0 ? "disabled" : "") + '>' + options + '</select></label>';
      }).join("");
      return '<article class="psy-socio-question ' + (q % 2 ? "is-negative" : "is-positive") + '">' +
        '<div class="psy-socio-question-heading"><span class="psy-socio-number">' + (q + 1) + '</span>' +
        '<h4>' + esc(question) + '<small class="psy-vika-kind">' + type(q) + '</small></h4>' +
        '<span class="psy-socio-question-status">' + status + '</span></div>' +
        '<div class="psy-vika-picks">' + fields + '</div></article>';
    }).join("") : "";
    const completed = roster.filter(r => !absent(r) && count(r) === 6).length;
    return '<section class="psy-new-work psy-socio psy-socio-vika">' +
      '<div class="psy-socio-intro"><h3>Социометрия – вопросы Вики</h3>' +
      '<p>В каждом вопросе внесите до 3 одноклассников. Можно указать меньше трех или выбрать «Никого». Пустой ответ не означает «Никого». Сначала внесите состав класса.</p></div>' +
      '<div class="psy-socio-roster"><div class="psy-socio-roster-head"><strong>Состав класса</strong>' +
      '<span>' + roster.length + ' учеников</span></div>' +
      '<details class="psy-socio-add" ' + (!roster.length ? "open" : "") + '>' +
      '<summary>Добавить учеников списком</summary>' +
      '<p class="psy-socio-note">По одному имени или условному коду в строке. Уже внесенные ученики сохраняются.</p>' +
      '<textarea id="psyVikaNames" rows="4" placeholder="Ученик 01&#10;Ученик 02&#10;Ученик 03"></textarea>' +
      '<div class="class-actions"><button type="button" class="btn primary" id="psyVikaAdd">Добавить в класс</button></div></details>' +
      '<div id="psyVikaMessage" class="psy-socio-message" role="status"></div>' +
      (roster.length ? '<div class="psy-socio-student-picker"><label>Выбранный ученик' +
      '<select id="psyVikaPerson">' + allRows + '</select></label>' +
      '<button type="button" class="btn" id="psyVikaNext">Следующий ученик</button></div>' : "") +
      '</div>' +
      (active ? '<div class="psy-vika-student-head"><div><strong>' + esc(row.name) +
        '</strong><span>' + count(row) + ' из 6 вопросов заполнено</span></div>' +
        '<button type="button" class="btn" id="psyVikaAbsent">' +
        (absent(row) ? "Вернуть к обследованию" : "Отметить: отсутствовал") +
        '</button></div>' : "") +
      (active && !absent(row) ? '<div class="psy-socio-questions">' + qCards + '</div>' :
        active ? '<p class="psy-socio-note">Ученик отмечен как отсутствовавший. Ранее введенные ответы не удаляются.</p>' :
        '<p class="psy-socio-note">Добавьте учеников и выберите первого ребенка.</p>') +
      '<section class="psy-socio-results psy-vika-results"><h3>Результаты</h3>' +
      '<p class="psy-vika-pending"><strong>Не готово</strong></p>' +
      '<p class="psy-socio-note">Анкеты сохраните сейчас, анализ по этим вопросам будет подготовлен отдельно. Заполнено полностью: ' +
      completed + ' из ' + roster.filter(r => !absent(r)).length + ' участвующих учеников.</p>' +
      '<div class="class-actions"><button type="button" class="btn" id="psyVikaCSV">Скачать ответы CSV</button>' +
      '<button type="button" class="btn primary psy-socio-save" id="psyVikaSave">Сохранить</button></div>' +
      '<p class="psy-socio-note">Сохранение выполняется в вашем профиле. Данные детей не следует публиковать в открытом доступе.</p>' +
      '</section></section>';
  }

  function rawCSV(rows) {
    const roster = people(rows);
    const csvRows = [["Ученик","Статус","Вопрос","Тип выбора","Формулировка","1 выбор","2 выбор","3 выбор"]];
    roster.forEach(row => Q.forEach((question, q) => csvRows.push([
      row.name, absent(row) ? "Отсутствовал" : answered(row, q) ? "Ответ внесен" : "Не заполнено",
      q + 1, type(q), question, ...answers(row, q).map(id => response(id, roster))
    ])));
    const safe = value => {
      let s = String(value ?? "");
      if (/^\s*[=+\-@]/.test(s)) s = "'" + s;
      return '"' + s.replace(/"/g, '""') + '"';
    };
    return "\uFEFF" + csvRows.map(r => r.map(safe).join(";")).join("\r\n");
  }
  function bind(d, ctx) {
    if (ctx.calcMode !== "class") return;
    const roster = () => people(ctx.rows);
    const current = () => ctx.rows[ctx.rowIndex];
    const message = text => {
      const el = document.getElementById("psyVikaMessage");
      if (el) el.textContent = text;
    };
    document.getElementById("psyVikaPerson")?.addEventListener("change", e =>
      ctx.onSelect?.(Number(e.target.value)));
    document.getElementById("psyVikaNext")?.addEventListener("click", () => ctx.onNext?.());
    document.getElementById("psyVikaAdd")?.addEventListener("click", () => {
      const input = document.getElementById("psyVikaNames");
      const values = (input?.value || "").split(/\r?\n|;/)
        .map(s => s.trim().slice(0, 120)).filter(Boolean);
      const existing = new Set(roster().map(r => r.name.trim().toLocaleLowerCase("ru")));
      const unique = values.filter(s => {
        const k = s.toLocaleLowerCase("ru");
        if (existing.has(k)) return false;
        existing.add(k);
        return true;
      });
      if (!unique.length) { message("Введите новые имена или условные коды учеников."); return; }
      ctx.onBulkAdd?.(unique);
    });
    document.getElementById("psyVikaAbsent")?.addEventListener("click", () => {
      if (!current()) return;
      current().socioVikaAbsent = !absent(current());
      dirty();
      ctx.onSelect?.(ctx.rowIndex);
    });
    document.querySelectorAll("[data-vika-q]").forEach(el => el.addEventListener("change", () => {
      const row = current(), q = Number(el.dataset.vikaQ), slot = Number(el.dataset.vikaSlot);
      if (!row || !Number.isInteger(q) || !Number.isInteger(slot)) return;
      const next = answers(row, q), value = el.value;
      if (value && value !== NONE && value === row.socioId) {
        message("Нельзя выбирать самого себя."); el.value = next[slot]; return;
      }
      if (value && value !== NONE && next.some((id, i) => id === value && i !== slot)) {
        message("Одного одноклассника нельзя выбрать дважды в одном вопросе.");
        el.value = next[slot]; return;
      }
      if (slot === 0 && value === NONE) {
        next.splice(0, 3, NONE, "", "");
      } else {
        if (next[0] === NONE) next[0] = "";
        next[slot] = value;
      }
      if (!Array.isArray(row.socioVikaAnswers)) row.socioVikaAnswers = [];
      row.socioVikaAnswers[q] = next;
      dirty();
      ctx.onSelect?.(ctx.rowIndex);
    }));
    document.getElementById("psyVikaSave")?.addEventListener("click", () => ctx.onSave?.());
    document.getElementById("psyVikaCSV")?.addEventListener("click", () => {
      const blob = new Blob([rawCSV(ctx.rows)], {type:"text/csv;charset=utf-8"});
      const url = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = url;
      a.download = "Метолария_социометрия_вопросы_Вики_ответы.csv";
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1200);
    });
  }
  function blank() {
    return '<section class="psy-new-print psy-socio-print"><h3>Лист ответов – вариант Вики</h3>' +
      '<p>Класс: ____________________ Дата: __________ Код ученика: __________</p>' +
      '<p>Ответь на вопросы, выбирая одноклассников, но не себя. Можно указать до трех человек или никого.</p>' +
      Q.map((q, i) => '<div class="psy-socio-print-q"><strong>' + (i + 1) + '. ' + esc(q) +
        '</strong><p>1. ______________________________________</p>' +
        '<p>2. ______________________________________</p><p>3. ______________________________________</p></div>').join("") +
      '</section>';
  }
  api.calculator = (d, ctx) => isVika(d) ? calculator(d, ctx) : original.calculator(d, ctx);
  api.bind = (d, ctx) => isVika(d) ? bind(d, ctx) : original.bind(d, ctx);
  api.materials = (d, flag) => isVika(d) ? blank() : original.materials(d, flag);
  api.instruction = d => isVika(d)
    ? '<h3>Инструкция ученику</h3><p>Назови от 0 до 3 одноклассников в ответ на каждый вопрос. Не выбирай себя. Ответы никому из одноклассников не показывай.</p>' +
      '<h3>Вопросы</h3><ol>' + Q.map(q => '<li>' + esc(q) + '</li>').join("") + '</ol>' +
      '<p>Вариант Вики. Ключ и правила обработки пока не установлены.</p>'
    : original.instruction(d);
  api.processing = d => isVika(d)
    ? '<h3>Результаты</h3><p><strong>Не готово</strong></p>' +
      '<p>Сейчас доступны ввод ответов и сохранение анкет. Расчет по этому набору вопросов не производится.</p>'
    : original.processing(d);
  api.score = (d, ...rest) => isVika(d) ? null : original.score?.(d, ...rest);
  window.PSY_SOCIO_VIKA = {questions: Q.slice(), version: VIKA, rawCSV};
})();