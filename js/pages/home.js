(function () {
  'use strict';

  function openModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.hidden = false;
    requestAnimationFrame(function () {
      var focusable = el.querySelector('button, input, [tabindex]');
      if (focusable) focusable.focus();
    });
  }

  function closeModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.hidden = true;
  }

  function wireModalCloseButtons() {
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

  function wireLangSwitch() {
    document.querySelectorAll('#lang-switch [data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        I18n.setLang(btn.getAttribute('data-lang'));
        updateLangSwitchUI();
        UI.renderIcons(document);
      });
    });
    document.querySelectorAll('#settings-language-chips [data-settings-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        I18n.setLang(btn.getAttribute('data-settings-lang'));
        updateLangSwitchUI();
        UI.renderIcons(document);
      });
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
        container.querySelectorAll('.chip').forEach(function (c) {
          c.classList.remove('is-active');
        });
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

  function updateContinueButtonVisibility() {
    var btn = document.getElementById('btn-continue-game');
    btn.hidden = !Game.hasResumableGame();
  }

  function goNewGame() {
    Game.clearCurrentGame();
    window.location.href = 'game.html?new=1';
  }

  function wireActionButtons() {
    document.getElementById('btn-new-game').addEventListener('click', function () {
      if (Game.hasResumableGame()) {
        UI.confirmDialog({
          title: I18n.t('homeOverwriteTitle'),
          message: I18n.t('homeOverwriteMessage'),
          confirmLabel: I18n.t('homeOverwriteConfirm'),
          danger: true
        }).then(function (ok) {
          if (ok) goNewGame();
        });
      } else {
        goNewGame();
      }
    });

    document.getElementById('btn-continue-game').addEventListener('click', function () {
      window.location.href = 'game.html';
    });

    document.getElementById('btn-how-to-play').addEventListener('click', function () {
      openModal('modal-how-to-play');
    });

    document.getElementById('btn-settings').addEventListener('click', function () {
      openModal('modal-settings');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    I18n.apply(document);
    UI.renderIcons(document);
    updateLangSwitchUI();
    wireLangSwitch();
    wireModalCloseButtons();
    setupSettingsModal();
    updateContinueButtonVisibility();
    wireActionButtons();
  });
})();
