(function () {
  'use strict';

  var currentState = null;
  var allCategoriesCache = null;
  var timerLoopHandle = null;
  var timeUpHandled = false;

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function displayName(entity) {
    return I18n.getLang() === 'ar' ? entity.nameAr : entity.nameEn;
  }
  function displayDesc(entity) {
    return I18n.getLang() === 'ar' ? entity.descriptionAr : entity.descriptionEn;
  }

  function showView(name) {
    document.querySelectorAll('.view').forEach(function (el) {
      el.hidden = el.id !== 'view-' + name;
    });
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  // ---------------------------------------------------------------------
  // Top bar: language switch + settings modal (same pattern as home.js)
  // ---------------------------------------------------------------------
  function openModal(id) { document.getElementById(id).hidden = false; }
  function closeModal(id) { document.getElementById(id).hidden = true; }

  function wireModals() {
    document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeModal(btn.getAttribute('data-close-modal'));
      });
    });
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) overlay.hidden = true;
      });
    });
    document.getElementById('btn-game-settings').addEventListener('click', function () {
      openModal('modal-settings');
    });
  }

  function updateLangSwitchUI() {
    var lang = I18n.getLang();
    document.querySelectorAll('#lang-switch [data-lang]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
    });
    document.querySelectorAll('#settings-language-chips [data-settings-lang]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-settings-lang') === lang);
    });
  }

  function refreshCurrentView() {
    if (!currentState) return;
    if (currentState.stage === 'categories') renderCategoriesView(currentState);
    else if (currentState.stage === 'board') renderBoardView(currentState);
    else if (currentState.stage === 'question') renderQuestionView(currentState);
    else if (currentState.stage === 'winner') renderWinnerView(currentState);
  }

  function wireLangSwitch() {
    function pick(lang) {
      I18n.setLang(lang);
      updateLangSwitchUI();
      UI.renderIcons(document);
      refreshCurrentView();
    }
    document.querySelectorAll('#lang-switch [data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () { pick(btn.getAttribute('data-lang')); });
    });
    document.querySelectorAll('#settings-language-chips [data-settings-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () { pick(btn.getAttribute('data-settings-lang')); });
    });
  }

  function buildChips(containerId, values, currentValue, unitKey, onPick) {
    var container = document.getElementById(containerId);
    container.innerHTML = '';
    values.forEach(function (v) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip' + (v === currentValue ? ' is-active' : '');
      chip.textContent = unitKey ? v + ' ' + I18n.t(unitKey) : String(v);
      chip.addEventListener('click', function () {
        onPick(v);
        container.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
      });
      container.appendChild(chip);
    });
  }

  function setupSettingsModal() {
    var settings = Settings.get();
    buildChips('settings-timer-chips', Settings.VALID_TIMERS, settings.timerSeconds, 'settingsSeconds', function (v) {
      Settings.save({ timerSeconds: v });
    });
    buildChips('settings-categories-chips', Settings.VALID_CATEGORY_COUNTS, settings.categoriesPerGame, null, function (v) {
      Settings.save({ categoriesPerGame: v });
    });
    var soundToggle = document.getElementById('settings-sound-toggle');
    soundToggle.checked = settings.sound !== false;
    soundToggle.addEventListener('change', function () {
      Settings.save({ sound: soundToggle.checked });
      if (soundToggle.checked) SoundFx.click();
    });
  }

  // ---------------------------------------------------------------------
  // Team setup
  // ---------------------------------------------------------------------
  function wireTeamSetup() {
    document.getElementById('btn-teams-next').addEventListener('click', function () {
      var t1 = document.getElementById('input-team1').value;
      var t2 = document.getElementById('input-team2').value;
      currentState = Game.createTeamSetupState(t1, t2);
      renderCategoriesView(currentState);
      showView('categories');
    });
  }

  // ---------------------------------------------------------------------
  // Category selection
  // ---------------------------------------------------------------------
  function renderCategoriesView(state) {
    currentState = state;
    if (!allCategoriesCache) allCategoriesCache = Catalog.getCategories();
    renderCategoryGrid(document.getElementById('category-search').value);
    updateSelectedCountBadge();
  }

  function renderCategoryGrid(query) {
    var grid = document.getElementById('categories-grid');
    grid.innerHTML = '';
    var q = (query || '').trim().toLowerCase();
    var filtered = !q
      ? allCategoriesCache
      : allCategoriesCache.filter(function (c) {
          var hay = [c.nameAr, c.nameEn, c.descriptionAr, c.descriptionEn].join(' ').toLowerCase();
          return hay.indexOf(q) !== -1;
        });

    if (!filtered.length) {
      var empty = document.createElement('p');
      empty.className = 'empty-note';
      empty.textContent = I18n.t('noCategoriesFound');
      grid.appendChild(empty);
      return;
    }
    filtered.forEach(function (cat) {
      grid.appendChild(buildCategoryCard(cat));
    });
  }

  function buildCategoryCard(cat) {
    var selected = currentState.selectedCategories.indexOf(cat.id) !== -1;
    var atMax = currentState.selectedCategories.length >= currentState.settingsSnapshot.categoriesPerGame;
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'category-card' + (selected ? ' is-selected' : '');
    card.style.setProperty('--cat-color', cat.color);
    card.disabled = !selected && atMax;

    var qCount = Catalog.getQuestions(cat.id).length;
    card.innerHTML =
      '<span class="category-card-icon">' + Icons.render(cat.icon, { size: 26 }) + '</span>' +
      '<span class="category-card-name">' + escapeHtml(displayName(cat)) + '</span>' +
      '<span class="category-card-desc">' + escapeHtml(displayDesc(cat) || '') + '</span>' +
      '<span class="category-card-count">' + escapeHtml(I18n.t('questionsCount', { count: qCount })) + '</span>' +
      '<span class="category-card-check">' + Icons.render('check', { size: 15 }) + '</span>';

    card.addEventListener('click', function () {
      currentState = Game.toggleCategorySelection(currentState, cat.id);
      SoundFx.click();
      renderCategoryGrid(document.getElementById('category-search').value);
      updateSelectedCountBadge();
    });
    return card;
  }

  function updateSelectedCountBadge() {
    var max = currentState.settingsSnapshot.categoriesPerGame;
    var n = currentState.selectedCategories.length;
    document.getElementById('selected-count-badge').textContent = I18n.t('selectedCount', { selected: n, total: max });
    document.getElementById('btn-start-game').disabled = n !== max;
  }

  function wireCategoriesView() {
    document.getElementById('category-search').addEventListener('input', function (e) {
      renderCategoryGrid(e.target.value);
    });
    document.getElementById('btn-start-game').addEventListener('click', function () {
      currentState = Game.startBoard(currentState);
      renderBoardView(currentState);
      showView('board');
    });
  }

  // ---------------------------------------------------------------------
  // Board
  // ---------------------------------------------------------------------
  function renderBoardView(state) {
    currentState = state;
    document.getElementById('board-team1-name').textContent = state.teams[0].name;
    document.getElementById('board-team1-points').textContent = state.teams[0].score + ' ' + I18n.t('scoreLabel');
    document.getElementById('board-team2-name').textContent = state.teams[1].name;
    document.getElementById('board-team2-points').textContent = state.teams[1].score + ' ' + I18n.t('scoreLabel');

    var container = document.getElementById('board-categories');
    container.innerHTML = '';
    state.selectedCategories.forEach(function (catId) {
      var cat = Catalog.getCategory(catId);
      if (!cat || !state.board[catId]) return;
      container.appendChild(buildBoardCategoryPanel(cat, state.board[catId]));
    });
  }

  function buildBoardCategoryPanel(cat, items) {
    var panel = document.createElement('div');
    panel.className = 'board-category';
    panel.style.setProperty('--cat-color', cat.color);

    var header = document.createElement('div');
    header.className = 'board-category-header';
    header.innerHTML =
      '<span class="board-category-icon">' + Icons.render(cat.icon, { size: 20 }) + '</span>' +
      '<span>' + escapeHtml(displayName(cat)) + '</span>';
    panel.appendChild(header);

    var qGrid = document.createElement('div');
    qGrid.className = 'board-category-questions';
    items.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'board-question' + (item.used ? ' is-used' : '');
      btn.disabled = item.used;
      btn.textContent = item.points;
      if (item.used) {
        var dot = document.createElement('span');
        dot.className = 'board-question-dot board-question-dot--' + (item.wonBy || 'none');
        btn.appendChild(dot);
      } else {
        btn.addEventListener('click', function () {
          currentState = Game.openQuestion(currentState, cat.id, item.questionId);
          SoundFx.openQuestion();
          renderQuestionView(currentState);
          showView('question');
          startTimerLoop();
        });
      }
      qGrid.appendChild(btn);
    });
    panel.appendChild(qGrid);
    return panel;
  }

  function wireBoardView() {
    document.getElementById('btn-end-game-early').addEventListener('click', function () {
      UI.confirmDialog({
        title: I18n.t('endGameConfirmTitle'),
        message: I18n.t('endGameConfirmMessage'),
        danger: true
      }).then(function (ok) {
        if (!ok) return;
        currentState = Game.endGameEarly(currentState);
        renderWinnerView(currentState);
        showView('winner');
      });
    });
  }

  // ---------------------------------------------------------------------
  // Question + timer
  // ---------------------------------------------------------------------
  var TIMER_CIRCUMFERENCE = 2 * Math.PI * 54;

  function renderQuestionView(state) {
    currentState = state;
    timeUpHandled = false;
    var cq = state.currentQuestion;
    var cat = Catalog.getCategory(cq.categoryId);
    var q = Catalog.getQuestion(cq.categoryId, cq.questionId);
    if (!cat || !q) return;

    document.querySelector('.question-view').style.setProperty('--cat-color', cat.color);
    document.getElementById('question-category-icon').innerHTML = Icons.render(cat.icon, { size: 18 });
    document.getElementById('question-category-name').textContent = displayName(cat);
    document.getElementById('question-points-value').textContent = q.points;
    document.getElementById('question-text').textContent = q.question;

    var img = document.getElementById('question-image');
    if (q.image) {
      img.src = q.image;
      img.hidden = false;
      img.onerror = function () { img.hidden = true; };
    } else {
      img.hidden = true;
      img.removeAttribute('src');
    }

    document.getElementById('question-actions-reveal').hidden = cq.revealed;
    document.getElementById('question-answer-block').hidden = !cq.revealed;
    document.getElementById('answer-text').textContent = q.answer;

    document.getElementById('btn-score-team1').textContent = I18n.t('scoreCorrect', { team: state.teams[0].name });
    document.getElementById('btn-score-team2').textContent = I18n.t('scoreCorrect', { team: state.teams[1].name });

    updateTimerDisplay();
    updatePauseResumeButton();
  }

  function updateTimerDisplay() {
    var cq = currentState.currentQuestion;
    if (!cq) return;
    var remaining = Game.getLiveTimerRemaining(cq);
    var total = currentState.settingsSnapshot.timerSeconds;
    document.getElementById('timer-number').textContent = remaining;
    var pct = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
    document.getElementById('timer-ring-progress').style.strokeDashoffset = String(TIMER_CIRCUMFERENCE * (1 - pct));
    var label = document.getElementById('timer-status-label');
    label.hidden = remaining > 0;
  }

  function updatePauseResumeButton() {
    var cq = currentState.currentQuestion;
    if (!cq) return;
    var btn = document.getElementById('btn-timer-toggle');
    var running = cq.timerRunning;
    var remaining = Game.getLiveTimerRemaining(cq);
    btn.innerHTML = Icons.render(running ? 'pause' : 'play', { size: 16 }) +
      '<span>' + I18n.t(running ? 'pauseTimer' : 'resumeTimer') + '</span>';
    btn.disabled = !running && remaining <= 0;
  }

  function startTimerLoop() {
    stopTimerLoop();
    timerLoopHandle = setInterval(tickTimer, 250);
  }
  function stopTimerLoop() {
    if (timerLoopHandle) { clearInterval(timerLoopHandle); timerLoopHandle = null; }
  }
  function tickTimer() {
    if (!currentState || !currentState.currentQuestion) { stopTimerLoop(); return; }
    updateTimerDisplay();
    var cq = currentState.currentQuestion;
    var remaining = Game.getLiveTimerRemaining(cq);
    if (remaining <= 0 && cq.timerRunning && !timeUpHandled) {
      timeUpHandled = true;
      currentState = Game.freezeTimerAtZero(currentState);
      SoundFx.timeUp();
      updatePauseResumeButton();
    }
  }

  function scoreAndReturn(winnerKey) {
    if (winnerKey === 'none') SoundFx.noOne(); else SoundFx.correct();
    stopTimerLoop();
    currentState = Game.scoreQuestion(currentState, winnerKey);
    if (currentState.stage === 'winner') {
      renderWinnerView(currentState);
      showView('winner');
    } else {
      renderBoardView(currentState);
      showView('board');
    }
  }

  function wireQuestionView() {
    document.getElementById('btn-timer-toggle').addEventListener('click', function () {
      var cq = currentState.currentQuestion;
      if (!cq) return;
      if (cq.timerRunning) currentState = Game.pauseTimer(currentState);
      else if (Game.getLiveTimerRemaining(cq) > 0) currentState = Game.resumeTimer(currentState);
      updatePauseResumeButton();
      updateTimerDisplay();
    });

    document.getElementById('btn-reveal-answer').addEventListener('click', function () {
      currentState = Game.revealAnswer(currentState);
      document.getElementById('question-actions-reveal').hidden = true;
      document.getElementById('question-answer-block').hidden = false;
      updatePauseResumeButton();
      updateTimerDisplay();
    });

    document.getElementById('btn-score-team1').addEventListener('click', function () { scoreAndReturn('team1'); });
    document.getElementById('btn-score-team2').addEventListener('click', function () { scoreAndReturn('team2'); });
    document.getElementById('btn-score-none').addEventListener('click', function () { scoreAndReturn('none'); });
  }

  // ---------------------------------------------------------------------
  // Winner
  // ---------------------------------------------------------------------
  function renderWinnerView(state) {
    currentState = state;
    var result = state.result || Game.computeResult(state);
    var titleEl = document.getElementById('winner-title');
    var nameEl = document.getElementById('winner-team-name');
    var pointsEl = document.getElementById('winner-team-points');
    var otherEl = document.getElementById('winner-other-score');

    if (result.tie) {
      titleEl.textContent = I18n.t('tieTitle');
      nameEl.textContent = I18n.t('tieMessage');
      pointsEl.textContent = result.team1.score + ' ' + I18n.t('scoreLabel');
      otherEl.textContent = '';
    } else {
      titleEl.textContent = I18n.t('winnerTitle');
      nameEl.textContent = result.winner.name;
      pointsEl.textContent = result.winner.score + ' ' + I18n.t('scoreLabel');
      otherEl.textContent = result.loser.name + ' — ' + result.loser.score + ' ' + I18n.t('scoreLabel');
    }

    SoundFx.winner();
    UI.confettiBurst();
  }

  function wireWinnerView() {
    document.getElementById('btn-play-again').addEventListener('click', function () {
      currentState = Game.playAgain(currentState);
      renderCategoriesView(currentState);
      showView('categories');
    });
    document.getElementById('btn-winner-new-game').addEventListener('click', function () {
      Game.clearCurrentGame();
      currentState = null;
      resetTeamInputs();
      showView('teams');
    });
    document.getElementById('btn-winner-home').addEventListener('click', function () {
      window.location.href = 'index.html';
    });
  }

  function resetTeamInputs() {
    document.getElementById('input-team1').value = '';
    document.getElementById('input-team2').value = '';
  }

  // ---------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------
  function hydrate() {
    var params = new URLSearchParams(window.location.search);
    var forceNew = params.get('new') === '1';
    if (forceNew) {
      // Strip ?new=1 immediately so a later refresh (even mid-game or on the
      // winner screen) resumes the saved game instead of forcing a restart.
      window.history.replaceState({}, '', window.location.pathname);
    }
    var state = forceNew ? null : Game.getCurrentGame();

    if (!state) {
      showView('teams');
      return;
    }

    currentState = state;
    if (state.stage === 'categories') { renderCategoriesView(state); showView('categories'); }
    else if (state.stage === 'board') { renderBoardView(state); showView('board'); }
    else if (state.stage === 'question') { renderQuestionView(state); showView('question'); startTimerLoop(); }
    else if (state.stage === 'winner') { renderWinnerView(state); showView('winner'); }
    else showView('teams');
  }

  document.addEventListener('DOMContentLoaded', function () {
    I18n.apply(document);
    UI.renderIcons(document);
    updateLangSwitchUI();
    wireLangSwitch();
    wireModals();
    setupSettingsModal();

    document.getElementById('btn-go-home').addEventListener('click', function () {
      window.location.href = 'index.html';
    });

    wireTeamSetup();
    wireCategoriesView();
    wireBoardView();
    wireQuestionView();
    wireWinnerView();

    hydrate();
  });
})();
