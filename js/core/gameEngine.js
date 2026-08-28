/**
 * Settings + Game state machine. Pure logic, no DOM access, so it can be
 * unit-reasoned about and reused identically by game.js.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // Settings
  // ---------------------------------------------------------------------
  var DEFAULT_SETTINGS = {
    timerSeconds: 30,
    categoriesPerGame: 6,
    sound: true,
    language: 'ar'
  };
  var VALID_TIMERS = [15, 30, 45, 60];
  var VALID_CATEGORY_COUNTS = [4, 5, 6];

  function getSettings() {
    var stored = Storage_.read(Storage_.KEYS.SETTINGS, {});
    var merged = Object.assign({}, DEFAULT_SETTINGS, stored);
    if (VALID_TIMERS.indexOf(merged.timerSeconds) === -1) merged.timerSeconds = DEFAULT_SETTINGS.timerSeconds;
    if (VALID_CATEGORY_COUNTS.indexOf(merged.categoriesPerGame) === -1) {
      merged.categoriesPerGame = DEFAULT_SETTINGS.categoriesPerGame;
    }
    return merged;
  }

  function saveSettings(partial) {
    var merged = Object.assign({}, getSettings(), partial);
    Storage_.write(Storage_.KEYS.SETTINGS, merged);
    return merged;
  }

  window.Settings = {
    DEFAULTS: DEFAULT_SETTINGS,
    VALID_TIMERS: VALID_TIMERS,
    VALID_CATEGORY_COUNTS: VALID_CATEGORY_COUNTS,
    get: getSettings,
    save: saveSettings
  };

  // ---------------------------------------------------------------------
  // Game state machine
  // ---------------------------------------------------------------------
  var DIFFICULTIES = ['easy', 'medium', 'hard'];
  var QUESTIONS_PER_DIFFICULTY = 2;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function getCurrentGame() {
    return Storage_.read(Storage_.KEYS.CURRENT_GAME, null);
  }

  function saveGame(state) {
    state.updatedAt = Date.now();
    Storage_.write(Storage_.KEYS.CURRENT_GAME, state);
    return state;
  }

  function clearCurrentGame() {
    Storage_.remove(Storage_.KEYS.CURRENT_GAME);
  }

  function hasResumableGame() {
    var g = getCurrentGame();
    return !!(g && !g.finished);
  }

  function createTeamSetupState(team1Name, team2Name) {
    var t = I18n.t;
    var state = {
      stage: 'categories',
      settingsSnapshot: getSettings(),
      teams: [
        { id: 'team1', name: (team1Name || '').trim() || t('team1Default'), score: 0 },
        { id: 'team2', name: (team2Name || '').trim() || t('team2Default'), score: 0 }
      ],
      selectedCategories: [],
      board: {},
      currentQuestion: null,
      finished: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    return saveGame(state);
  }

  function toggleCategorySelection(state, categoryId) {
    var max = state.settingsSnapshot.categoriesPerGame;
    var idx = state.selectedCategories.indexOf(categoryId);
    if (idx !== -1) {
      state.selectedCategories.splice(idx, 1);
    } else if (state.selectedCategories.length < max) {
      state.selectedCategories.push(categoryId);
    }
    return saveGame(state);
  }

  // ---- Recency-aware question picking ----
  function getRecentMap() {
    return Storage_.read(Storage_.KEYS.RECENT_QUESTIONS, {});
  }

  function markQuestionsUsedRecently(categoryId, questionIds) {
    var all = getRecentMap();
    if (!all[categoryId]) all[categoryId] = {};
    var now = Date.now();
    questionIds.forEach(function (qid, i) {
      all[categoryId][qid] = now + i; // preserve pick order in ties
    });
    Storage_.write(Storage_.KEYS.RECENT_QUESTIONS, all);
  }

  function pickQuestionsForCategory(categoryId) {
    var pool = Catalog.getQuestions(categoryId);
    var recentForCat = getRecentMap()[categoryId] || {};

    function leastRecentFirst(list) {
      return shuffle(list).sort(function (a, b) {
        return (recentForCat[a.id] || 0) - (recentForCat[b.id] || 0);
      });
    }

    var byDifficulty = {};
    DIFFICULTIES.forEach(function (d) {
      byDifficulty[d] = leastRecentFirst(pool.filter(function (q) { return q.difficulty === d; }));
    });

    var picked = [];
    var pickedIds = {};
    DIFFICULTIES.forEach(function (d) {
      byDifficulty[d].slice(0, QUESTIONS_PER_DIFFICULTY).forEach(function (q) {
        picked.push(q);
        pickedIds[q.id] = true;
      });
    });

    // Fallback: if a difficulty bucket was short (small/custom category),
    // top up from whatever is left in the pool so a board always has 6.
    if (picked.length < 6) {
      var remaining = leastRecentFirst(pool.filter(function (q) { return !pickedIds[q.id]; }));
      for (var i = 0; picked.length < 6 && i < remaining.length; i++) {
        picked.push(remaining[i]);
      }
    }

    markQuestionsUsedRecently(categoryId, picked.map(function (q) { return q.id; }));

    // Present as 100,100,200,200,300,300 (ascending points).
    return picked.sort(function (a, b) { return a.points - b.points; });
  }

  function startBoard(state) {
    var board = {};
    state.selectedCategories.forEach(function (categoryId) {
      board[categoryId] = pickQuestionsForCategory(categoryId).map(function (q) {
        return { questionId: q.id, points: q.points, difficulty: q.difficulty, used: false, wonBy: null };
      });
    });
    state.board = board;
    state.stage = 'board';
    return saveGame(state);
  }

  function openQuestion(state, categoryId, questionId) {
    state.currentQuestion = {
      categoryId: categoryId,
      questionId: questionId,
      timerRemaining: state.settingsSnapshot.timerSeconds,
      timerRunning: true,
      lastTickAt: Date.now(),
      revealed: false
    };
    state.stage = 'question';
    return saveGame(state);
  }

  function getLiveTimerRemaining(currentQuestion) {
    if (!currentQuestion) return 0;
    if (!currentQuestion.timerRunning) return currentQuestion.timerRemaining;
    var elapsed = Math.floor((Date.now() - currentQuestion.lastTickAt) / 1000);
    return Math.max(0, currentQuestion.timerRemaining - elapsed);
  }

  function pauseTimer(state) {
    var cq = state.currentQuestion;
    if (!cq || !cq.timerRunning) return state;
    cq.timerRemaining = getLiveTimerRemaining(cq);
    cq.timerRunning = false;
    return saveGame(state);
  }

  function resumeTimer(state) {
    var cq = state.currentQuestion;
    if (!cq || cq.timerRunning || cq.timerRemaining <= 0) return state;
    cq.lastTickAt = Date.now();
    cq.timerRunning = true;
    return saveGame(state);
  }

  function freezeTimerAtZero(state) {
    var cq = state.currentQuestion;
    if (!cq) return state;
    cq.timerRemaining = 0;
    cq.timerRunning = false;
    return saveGame(state);
  }

  function revealAnswer(state) {
    var cq = state.currentQuestion;
    if (!cq) return state;
    cq.timerRemaining = getLiveTimerRemaining(cq);
    cq.timerRunning = false;
    cq.revealed = true;
    return saveGame(state);
  }

  function isComplete(state) {
    return Object.keys(state.board).every(function (catId) {
      return state.board[catId].every(function (item) {
        return item.used;
      });
    });
  }

  function computeResult(state) {
    var t1 = state.teams[0];
    var t2 = state.teams[1];
    if (t1.score === t2.score) return { tie: true, team1: t1, team2: t2 };
    var winner = t1.score > t2.score ? t1 : t2;
    var loser = t1.score > t2.score ? t2 : t1;
    return { tie: false, winner: winner, loser: loser, team1: t1, team2: t2 };
  }

  function scoreQuestion(state, winnerKey) {
    var cq = state.currentQuestion;
    if (!cq) return state;
    var boardItem = state.board[cq.categoryId].filter(function (item) {
      return item.questionId === cq.questionId;
    })[0];
    if (boardItem && !boardItem.used) {
      boardItem.used = true;
      boardItem.wonBy = winnerKey;
      if (winnerKey === 'team1') state.teams[0].score += boardItem.points;
      if (winnerKey === 'team2') state.teams[1].score += boardItem.points;
    }
    state.currentQuestion = null;
    state.stage = 'board';

    if (isComplete(state)) {
      state.stage = 'winner';
      state.finished = true;
      state.result = computeResult(state);
    }
    return saveGame(state);
  }

  function backToBoardWithoutScoring(state) {
    state.currentQuestion = null;
    state.stage = 'board';
    return saveGame(state);
  }

  function endGameEarly(state) {
    state.currentQuestion = null;
    state.stage = 'winner';
    state.finished = true;
    state.result = computeResult(state);
    return saveGame(state);
  }

  function playAgain(state) {
    var next = {
      stage: 'categories',
      settingsSnapshot: getSettings(),
      teams: [
        { id: 'team1', name: state.teams[0].name, score: 0 },
        { id: 'team2', name: state.teams[1].name, score: 0 }
      ],
      selectedCategories: [],
      board: {},
      currentQuestion: null,
      finished: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    return saveGame(next);
  }

  window.Game = {
    getCurrentGame: getCurrentGame,
    saveGame: saveGame,
    clearCurrentGame: clearCurrentGame,
    hasResumableGame: hasResumableGame,
    createTeamSetupState: createTeamSetupState,
    toggleCategorySelection: toggleCategorySelection,
    startBoard: startBoard,
    openQuestion: openQuestion,
    getLiveTimerRemaining: getLiveTimerRemaining,
    pauseTimer: pauseTimer,
    resumeTimer: resumeTimer,
    freezeTimerAtZero: freezeTimerAtZero,
    revealAnswer: revealAnswer,
    scoreQuestion: scoreQuestion,
    backToBoardWithoutScoring: backToBoardWithoutScoring,
    endGameEarly: endGameEarly,
    isComplete: isComplete,
    computeResult: computeResult,
    playAgain: playAgain
  };
})();
