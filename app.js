(function () {
  "use strict";

  const APP_ROOT = document.getElementById("app");
  const STORAGE_KEY = "impostor_app_players_v1";

  /** @type {{
   *  screen: string,
   *  players: string[],
   *  impostorMin: number,
   *  impostorMax: number,
   *  round: null | {
   *    order: string[],
   *    impostors: Set<string>,
   *    impostorCount: number,
   *    pair: {category: string, crew: string, impostor: string},
   *    turnIndex: number,
   *    revealed: boolean,
   *    answers: {name: string, answer: string}[]
   *  },
   *  newPlayerDraft: string
   * }}
   */
  const state = {
    screen: "setup",
    players: loadPlayers(),
    impostorMin: 1,
    impostorMax: 1,
    round: null,
    newPlayerDraft: "",
  };

  function loadPlayers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  }

  function savePlayers() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.players));
    } catch (e) {}
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function maxImpostors() {
    return Math.max(1, state.players.length - 2);
  }

  function randomInRange(min, max) {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    return lo + Math.floor(Math.random() * (hi - lo + 1));
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === "class") node.className = v;
        else if (k === "html") node.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") {
          node.addEventListener(k.slice(2), v);
        } else {
          node.setAttribute(k, v);
        }
      }
    }
    (children || []).forEach((c) => {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function render() {
    APP_ROOT.innerHTML = "";
    APP_ROOT.appendChild(buildScreen());
  }

  function buildScreen() {
    switch (state.screen) {
      case "setup":
        return screenSetup();
      case "briefing":
        return screenBriefing();
      case "passing":
        return screenPassing();
      case "results":
        return screenResults();
      case "reveal":
        return screenReveal();
      default:
        return screenSetup();
    }
  }

  // ---------- SCREEN: Setup ----------
  function screenSetup() {
    const wrap = el("div", { class: "screen screen-setup" });

    wrap.appendChild(header("AKTE // IMPOSTOR", "SPIELER ERFASSEN"));

    const card = el("div", { class: "folder" });
    card.appendChild(el("div", { class: "folder-tab" }, ["TEILNEHMERLISTE"]));

    const list = el("div", { class: "player-list" });
    if (state.players.length === 0) {
      list.appendChild(el("p", { class: "hint" }, ["Noch keine Spieler erfasst. Trage unten Namen ein."]));
    }
    state.players.forEach((name, idx) => {
      const row = el("div", { class: "player-row" }, [
        el("span", { class: "player-index" }, [String(idx + 1).padStart(2, "0")]),
        el("span", { class: "player-name" }, [name]),
        el("button", {
          class: "btn-icon",
          "aria-label": "Entfernen",
          onclick: () => {
            state.players.splice(idx, 1);
            savePlayers();
            render();
          },
        }, ["✕"]),
      ]);
      list.appendChild(row);
    });
    card.appendChild(list);

    const addRow = el("form", { class: "add-row" });
    const input = el("input", {
      type: "text",
      placeholder: "Name eingeben …",
      class: "text-input",
      maxlength: "20",
      autocomplete: "off",
    });
    addRow.appendChild(input);
    addRow.appendChild(el("button", { class: "btn btn-small", type: "submit" }, ["+ HINZU"]));
    addRow.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = input.value.trim();
      if (!name) return;
      if (state.players.includes(name)) {
        input.value = "";
        return;
      }
      state.players.push(name);
      savePlayers();
      input.value = "";
      render();
    });
    card.appendChild(addRow);
    wrap.appendChild(card);

    // Impostor count range
    const countCard = el("div", { class: "folder" });
    countCard.appendChild(el("div", { class: "folder-tab folder-tab-amber" }, ["ANZAHL IMPOSTOR"]));
    const canPlay = state.players.length >= 3;
    const cap = maxImpostors();
    if (state.impostorMin > cap) state.impostorMin = 1;
    if (state.impostorMax > cap) state.impostorMax = cap;
    if (state.impostorMin > state.impostorMax) state.impostorMax = state.impostorMin;

    const rangeRow = el("div", { class: "range-row" });

    const minBlock = el("div", { class: "range-block" }, [
      el("span", { class: "range-label" }, ["MIN"]),
      el("div", { class: "counter counter-small" }, [
        el("button", {
          class: "btn-icon btn-counter",
          onclick: () => {
            if (state.impostorMin > 1) state.impostorMin--;
            render();
          },
        }, ["−"]),
        el("div", { class: "counter-value" }, [String(state.impostorMin)]),
        el("button", {
          class: "btn-icon btn-counter",
          onclick: () => {
            if (state.impostorMin < cap) { state.impostorMin++; if (state.impostorMax < state.impostorMin) state.impostorMax = state.impostorMin; }
            render();
          },
        }, ["+"]),
      ]),
    ]);

    const maxBlock = el("div", { class: "range-block" }, [
      el("span", { class: "range-label" }, ["MAX"]),
      el("div", { class: "counter counter-small" }, [
        el("button", {
          class: "btn-icon btn-counter",
          onclick: () => {
            if (state.impostorMax > state.impostorMin) state.impostorMax--;
            render();
          },
        }, ["−"]),
        el("div", { class: "counter-value" }, [String(state.impostorMax)]),
        el("button", {
          class: "btn-icon btn-counter",
          onclick: () => {
            if (state.impostorMax < cap) state.impostorMax++;
            render();
          },
        }, ["+"]),
      ]),
    ]);

    rangeRow.appendChild(minBlock);
    rangeRow.appendChild(el("span", { class: "range-sep" }, ["–"]));
    rangeRow.appendChild(maxBlock);
    countCard.appendChild(rangeRow);

    const rangeHint = state.impostorMin === state.impostorMax
      ? `Immer genau ${state.impostorMin} Impostor.`
      : `Zufällig zwischen ${state.impostorMin} und ${state.impostorMax} Impostor pro Runde.`;
    countCard.appendChild(el("p", { class: "hint" }, [
      canPlay ? `${rangeHint} (von ${state.players.length} Spielern, max. ${cap})` : "Mindestens 3 Spieler nötig, um zu starten.",
    ]));
    wrap.appendChild(countCard);

    const startBtn = el("button", {
      class: "btn btn-primary btn-large" + (canPlay ? "" : " btn-disabled"),
      onclick: () => {
        if (!canPlay) return;
        startRound();
      },
    }, ["RUNDE STARTEN →"]);
    wrap.appendChild(startBtn);

    return wrap;
  }

  // ---------- Round setup ----------
  function startRound() {
    const order = shuffle(state.players);
    const impostorCount = Math.min(randomInRange(state.impostorMin, state.impostorMax), maxImpostors());
    const impostors = new Set(shuffle(state.players).slice(0, impostorCount));
    const pair = pickRandomQuestionPair();
    state.round = {
      order,
      impostors,
      impostorCount,
      pair,
      turnIndex: 0,
      revealed: false,
      answers: [],
    };
    state.screen = "briefing";
    render();
  }

  // ---------- SCREEN: Briefing (Handy weiterreichen) ----------
  function screenBriefing() {
    const r = state.round;
    const currentPlayer = r.order[r.turnIndex];
    const wrap = el("div", { class: "screen screen-briefing" });
    wrap.appendChild(header("VERHÖR LÄUFT", `AUSSAGE ${r.turnIndex + 1} / ${r.order.length}`));

    const stamp = el("div", { class: "stamp-corner" }, ["VERTRAULICH"]);

    if (!r.revealed) {
      const card = el("div", { class: "folder folder-pass" }, [
        stamp,
        el("div", { class: "folder-tab" }, ["HANDY WEITERGEBEN"]),
        el("p", { class: "pass-name" }, [currentPlayer]),
        el("p", { class: "hint" }, ["Nur diese Person darf jetzt auf den Bildschirm schauen."]),
        el("button", {
          class: "btn btn-primary btn-large",
          onclick: () => {
            r.revealed = true;
            render();
          },
        }, ["ICH BIN " + currentPlayer.toUpperCase() + " — AUFDECKEN"]),
      ]);
      wrap.appendChild(card);
      return wrap;
    }

    const isImpostor = r.impostors.has(currentPlayer);
    const question = isImpostor ? r.pair.impostor : r.pair.crew;

    const card = el("div", { class: "folder folder-question" }, [
      stamp,
      el("div", { class: "folder-tab folder-tab-amber" }, ["DEINE FRAGE, " + currentPlayer.toUpperCase()]),
      el("p", { class: "category-label" }, ["Kategorie: " + r.pair.category]),
      el("p", { class: "question-text" }, [question]),
    ]);

    const answerForm = el("form", { class: "answer-form" });
    const answerInput = el("input", {
      type: "text",
      class: "text-input",
      placeholder: "Deine Antwort (kurz)…",
      maxlength: "40",
      autocomplete: "off",
    });
    answerForm.appendChild(answerInput);
    answerForm.appendChild(el("button", { class: "btn btn-primary btn-large", type: "submit" }, ["ANTWORT SPEICHERN"]));
    answerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = answerInput.value.trim();
      if (!val) return;
      r.answers.push({ name: currentPlayer, answer: val });
      if (r.turnIndex < r.order.length - 1) {
        r.turnIndex++;
        r.revealed = false;
        render();
      } else {
        state.screen = "results";
        render();
      }
    });

    card.appendChild(answerForm);
    wrap.appendChild(card);
    wrap.appendChild(el("p", { class: "hint hint-center" }, ["Antwort laut sagen und hier eintippen. Handy danach verdeckt weitergeben."]));
    return wrap;
  }

  // ---------- SCREEN: Results ----------
  function screenResults() {
    const r = state.round;
    const wrap = el("div", { class: "screen screen-results" });
    wrap.appendChild(header("ALLE AUSSAGEN LIEGEN VOR", "DISKUSSIONSPHASE"));

    const card = el("div", { class: "folder" });
    card.appendChild(el("div", { class: "folder-tab folder-tab-amber" }, ["FRAGE DER MEHRHEIT"]));
    card.appendChild(el("p", { class: "category-label" }, ["Kategorie: " + r.pair.category]));
    card.appendChild(el("p", { class: "question-text" }, [r.pair.crew]));
    wrap.appendChild(card);

    const answersCard = el("div", { class: "folder" });
    answersCard.appendChild(el("div", { class: "folder-tab" }, ["PROTOKOLL DER ANTWORTEN"]));
    const list = el("div", { class: "answer-list" });
    r.answers.forEach((a) => {
      list.appendChild(el("div", { class: "answer-row" }, [
        el("span", { class: "answer-name" }, [a.name]),
        el("span", { class: "answer-value" }, ["„" + a.answer + "\u201C"]),
      ]));
    });
    answersCard.appendChild(list);
    wrap.appendChild(answersCard);

    wrap.appendChild(el("p", { class: "hint hint-center" }, [
      "Diskutiert jetzt gemeinsam, wer die andere Frage bekommen hat. Wenn ihr euch einig seid:",
    ]));

    wrap.appendChild(el("button", {
      class: "btn btn-danger btn-large",
      onclick: () => {
        state.screen = "reveal";
        render();
      },
    }, ["IMPOSTOR AUFDECKEN"]));

    return wrap;
  }

  // ---------- SCREEN: Reveal ----------
  function screenReveal() {
    const r = state.round;
    const wrap = el("div", { class: "screen screen-reveal" });
    wrap.appendChild(header("AUFGEDECKT", r.impostorCount === 1 ? "1 IMPOSTOR" : r.impostorCount + " IMPOSTOR"));

    const list = el("div", { class: "reveal-list" });
    r.order.forEach((name) => {
      const isImpostor = r.impostors.has(name);
      const rowCard = el("div", { class: "reveal-card" + (isImpostor ? " reveal-card-impostor" : "") }, [
        el("span", { class: "reveal-name" }, [name]),
        isImpostor ? el("span", { class: "stamp-mark" }, ["IMPOSTOR"]) : el("span", { class: "clear-mark" }, ["UNSCHULDIG"]),
      ]);
      list.appendChild(rowCard);
    });
    wrap.appendChild(list);

    const btnRow = el("div", { class: "btn-row" });
    btnRow.appendChild(el("button", {
      class: "btn btn-primary btn-large",
      onclick: () => {
        startRound();
      },
    }, ["NEUE RUNDE (GLEICHE SPIELER)"]));
    btnRow.appendChild(el("button", {
      class: "btn btn-secondary",
      onclick: () => {
        state.round = null;
        state.screen = "setup";
        render();
      },
    }, ["ZURÜCK ZUR SPIELERLISTE"]));
    wrap.appendChild(btnRow);

    return wrap;
  }

  // ---------- shared ----------
  function header(title, subtitle) {
    return el("div", { class: "app-header" }, [
      el("h1", { class: "app-title" }, [title]),
      subtitle ? el("p", { class: "app-subtitle" }, [subtitle]) : null,
    ]);
  }

  render();
})();
