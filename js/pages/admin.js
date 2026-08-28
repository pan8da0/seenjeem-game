(function () {
  'use strict';

  var CATEGORY_ICON_CHOICES = [
    'football', 'capitals', 'history', 'geography', 'islamic', 'quran',
    'prophet_biography', 'companions', 'science', 'human_body', 'space',
    'animals', 'technology', 'inventions', 'arab_cities', 'food',
    'general_knowledge', 'riddles', 'landmarks', 'civilizations',
    'sports_general', 'trophy', 'star'
  ];

  var editingCategoryId = null; // null => adding new
  var editingQuestionId = null; // null => adding new
  var selectedQuestionCategoryId = null;

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function displayName(entity) { return I18n.getLang() === 'ar' ? entity.nameAr : entity.nameEn; }

  function openModal(id) { document.getElementById(id).hidden = false; }
  function closeModal(id) { document.getElementById(id).hidden = true; }

  function wireModals() {
    document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () { closeModal(btn.getAttribute('data-close-modal')); });
    });
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.hidden = true; });
    });
  }

  function updateLangSwitchUI() {
    var lang = I18n.getLang();
    document.querySelectorAll('#lang-switch [data-lang]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
    });
  }
  function wireLangSwitch() {
    document.querySelectorAll('#lang-switch [data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        I18n.setLang(btn.getAttribute('data-lang'));
        updateLangSwitchUI();
        UI.renderIcons(document);
        refreshAll();
      });
    });
  }

  // ---------------------------------------------------------------------
  // Tabs
  // ---------------------------------------------------------------------
  function wireTabs() {
    document.querySelectorAll('.admin-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.admin-tab').forEach(function (t) { t.classList.remove('is-active'); });
        document.querySelectorAll('.admin-panel').forEach(function (p) { p.classList.remove('is-active'); });
        tab.classList.add('is-active');
        document.getElementById('panel-' + tab.getAttribute('data-tab')).classList.add('is-active');
      });
    });
  }

  // ---------------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------------
  function renderCategoryList() {
    var query = document.getElementById('category-admin-search').value.trim().toLowerCase();
    var list = document.getElementById('category-list');
    list.innerHTML = '';
    var cats = Catalog.getCategories().filter(function (c) {
      if (!query) return true;
      return (c.nameAr + c.nameEn + (c.descriptionAr || '') + (c.descriptionEn || '')).toLowerCase().indexOf(query) !== -1;
    });
    if (!cats.length) {
      list.innerHTML = '<p class="admin-empty">' + I18n.t('noCategoriesFound') + '</p>';
      return;
    }
    cats.forEach(function (cat) {
      var qCount = Catalog.getQuestions(cat.id).length;
      var row = document.createElement('div');
      row.className = 'admin-row';
      row.style.setProperty('--row-color', cat.color);
      row.innerHTML =
        '<span class="admin-row-icon">' + Icons.render(cat.icon, { size: 20 }) + '</span>' +
        '<div class="admin-row-body">' +
          '<div class="admin-row-title">' + escapeHtml(displayName(cat)) + '</div>' +
          '<div class="admin-row-sub">' + escapeHtml(cat.id) + ' · ' + I18n.t('questionsCount', { count: qCount }) + '</div>' +
        '</div>' +
        '<div class="admin-row-actions">' +
          '<button type="button" class="btn btn--secondary btn--sm" data-action="edit">' + escapeHtml(I18n.t('edit')) + '</button>' +
          '<button type="button" class="btn btn--danger btn--sm" data-action="delete">' + escapeHtml(I18n.t('delete')) + '</button>' +
        '</div>';
      row.querySelector('[data-action="edit"]').addEventListener('click', function () { openCategoryForm(cat); });
      row.querySelector('[data-action="delete"]').addEventListener('click', function () { confirmDeleteCategory(cat); });
      list.appendChild(row);
    });
  }

  function populateIconSelect(selectEl, selectedValue) {
    selectEl.innerHTML = '';
    CATEGORY_ICON_CHOICES.forEach(function (key) {
      var opt = document.createElement('option');
      opt.value = key;
      opt.textContent = key;
      if (key === selectedValue) opt.selected = true;
      selectEl.appendChild(opt);
    });
  }

  function updateCategoryPreview() {
    var color = document.getElementById('cat-field-color-hex').value || '#7C5CFF';
    var icon = document.getElementById('cat-field-icon').value;
    var name = document.getElementById('cat-field-name-ar').value || document.getElementById('cat-field-name-en').value || '...';
    var badge = document.getElementById('cat-preview-icon');
    badge.style.background = color;
    badge.innerHTML = Icons.render(icon, { size: 20 });
    document.getElementById('cat-preview-name').textContent = name;
  }

  function openCategoryForm(cat) {
    editingCategoryId = cat ? cat.id : null;
    document.getElementById('category-form-title').textContent = cat ? I18n.t('adminEditCategory') : I18n.t('adminAddCategory');
    document.getElementById('cat-field-id').value = cat ? cat.id : '';
    document.getElementById('cat-field-id').disabled = !!cat;
    document.getElementById('cat-field-name-ar').value = cat ? cat.nameAr : '';
    document.getElementById('cat-field-name-en').value = cat ? cat.nameEn : '';
    document.getElementById('cat-field-desc-ar').value = cat ? cat.descriptionAr || '' : '';
    document.getElementById('cat-field-desc-en').value = cat ? cat.descriptionEn || '' : '';
    var color = cat ? cat.color : '#7C5CFF';
    document.getElementById('cat-field-color-picker').value = color;
    document.getElementById('cat-field-color-hex').value = color;
    populateIconSelect(document.getElementById('cat-field-icon'), cat ? cat.icon : CATEGORY_ICON_CHOICES[0]);
    updateCategoryPreview();
    openModal('modal-category-form');
  }

  function confirmDeleteCategory(cat) {
    UI.confirmDialog({
      title: I18n.t('adminDeleteConfirmTitle'),
      message: I18n.t('adminDeleteConfirmMessage'),
      danger: true
    }).then(function (ok) {
      if (!ok) return;
      Catalog.deleteCategory(cat.id);
      UI.toast(I18n.t('adminSavedNotice'));
      refreshAll();
    });
  }

  function wireCategoriesPanel() {
    document.getElementById('category-admin-search').addEventListener('input', renderCategoryList);
    document.getElementById('btn-add-category').addEventListener('click', function () { openCategoryForm(null); });

    document.getElementById('cat-field-color-picker').addEventListener('input', function (e) {
      document.getElementById('cat-field-color-hex').value = e.target.value;
      updateCategoryPreview();
    });
    document.getElementById('cat-field-color-hex').addEventListener('input', function (e) {
      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
        document.getElementById('cat-field-color-picker').value = e.target.value;
      }
      updateCategoryPreview();
    });
    document.getElementById('cat-field-icon').addEventListener('change', updateCategoryPreview);
    document.getElementById('cat-field-name-ar').addEventListener('input', updateCategoryPreview);
    document.getElementById('cat-field-name-en').addEventListener('input', updateCategoryPreview);

    document.getElementById('category-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var nameAr = document.getElementById('cat-field-name-ar').value.trim();
      var nameEn = document.getElementById('cat-field-name-en').value.trim();
      if (!nameAr || !nameEn) { UI.toast(I18n.t('adminFieldRequired')); return; }
      var colorHex = document.getElementById('cat-field-color-hex').value.trim() || '#7C5CFF';
      Catalog.saveCategory({
        id: editingCategoryId || document.getElementById('cat-field-id').value.trim(),
        nameAr: nameAr,
        nameEn: nameEn,
        descriptionAr: document.getElementById('cat-field-desc-ar').value.trim(),
        descriptionEn: document.getElementById('cat-field-desc-en').value.trim(),
        color: colorHex,
        icon: document.getElementById('cat-field-icon').value
      });
      UI.toast(I18n.t('adminSavedNotice'));
      closeModal('modal-category-form');
      refreshAll();
    });
  }

  // ---------------------------------------------------------------------
  // Questions
  // ---------------------------------------------------------------------
  function populateQuestionCategorySelect() {
    var select = document.getElementById('question-category-select');
    var cats = Catalog.getCategories();
    var keepSelection = cats.some(function (c) { return c.id === selectedQuestionCategoryId; });
    if (!keepSelection) selectedQuestionCategoryId = cats.length ? cats[0].id : null;

    select.innerHTML = '';
    cats.forEach(function (cat) {
      var opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = displayName(cat);
      if (cat.id === selectedQuestionCategoryId) opt.selected = true;
      select.appendChild(opt);
    });
  }

  function renderQuestionList() {
    var list = document.getElementById('question-list');
    list.innerHTML = '';
    if (!selectedQuestionCategoryId) {
      list.innerHTML = '<p class="admin-empty">' + I18n.t('adminNoQuestions') + '</p>';
      return;
    }
    var cat = Catalog.getCategory(selectedQuestionCategoryId);
    var query = document.getElementById('question-admin-search').value.trim().toLowerCase();
    var questions = Catalog.getQuestions(selectedQuestionCategoryId).filter(function (q) {
      if (!query) return true;
      return (q.question + ' ' + q.answer).toLowerCase().indexOf(query) !== -1;
    });

    if (!questions.length) {
      list.innerHTML = '<p class="admin-empty">' + I18n.t('adminNoQuestions') + '</p>';
      return;
    }

    var difficultyLabelKey = { easy: 'adminDifficultyEasy', medium: 'adminDifficultyMedium', hard: 'adminDifficultyHard' };

    questions.forEach(function (q) {
      var row = document.createElement('div');
      row.className = 'admin-row';
      row.style.setProperty('--row-color', cat ? cat.color : '#7C5CFF');
      row.innerHTML =
        '<div class="admin-row-body">' +
          '<div class="admin-row-title">' + escapeHtml(q.question) + '</div>' +
          '<div class="admin-row-sub">' + escapeHtml(I18n.t(difficultyLabelKey[q.difficulty]) || q.difficulty) + ' · ' + q.points + ' ' + escapeHtml(I18n.t('points')) + '</div>' +
        '</div>' +
        '<div class="admin-row-actions">' +
          '<button type="button" class="btn btn--secondary btn--sm" data-action="edit">' + escapeHtml(I18n.t('edit')) + '</button>' +
          '<button type="button" class="btn btn--danger btn--sm" data-action="delete">' + escapeHtml(I18n.t('delete')) + '</button>' +
        '</div>';
      row.querySelector('[data-action="edit"]').addEventListener('click', function () { openQuestionForm(q); });
      row.querySelector('[data-action="delete"]').addEventListener('click', function () { confirmDeleteQuestion(q); });
      list.appendChild(row);
    });
  }

  function openQuestionForm(question) {
    editingQuestionId = question ? question.id : null;
    document.getElementById('question-form-title').textContent = question ? I18n.t('adminEditQuestion') : I18n.t('adminAddQuestion');
    document.getElementById('q-field-text').value = question ? question.question : '';
    document.getElementById('q-field-answer').value = question ? question.answer : '';
    document.getElementById('q-field-difficulty').value = question ? question.difficulty : 'easy';
    document.getElementById('q-field-image').value = question && question.image ? question.image : '';
    document.getElementById('question-preview-box').hidden = true;
    openModal('modal-question-form');
  }

  function confirmDeleteQuestion(q) {
    UI.confirmDialog({
      title: I18n.t('adminDeleteConfirmTitle'),
      message: I18n.t('adminDeleteConfirmMessage'),
      danger: true
    }).then(function (ok) {
      if (!ok) return;
      Catalog.deleteQuestion(selectedQuestionCategoryId, q.id);
      UI.toast(I18n.t('adminSavedNotice'));
      renderQuestionList();
      renderCategoryList();
      updateStatsLine();
    });
  }

  function renderQuestionPreview() {
    var cat = Catalog.getCategory(selectedQuestionCategoryId);
    var difficulty = document.getElementById('q-field-difficulty').value;
    var points = Catalog.POINTS_BY_DIFFICULTY[difficulty];
    var text = document.getElementById('q-field-text').value.trim() || '—';
    var answer = document.getElementById('q-field-answer').value.trim() || '—';
    var image = document.getElementById('q-field-image').value.trim();
    var difficultyLabelKey = { easy: 'adminDifficultyEasy', medium: 'adminDifficultyMedium', hard: 'adminDifficultyHard' }[difficulty];

    var box = document.getElementById('question-preview-box');
    box.innerHTML =
      '<div class="qp-badges">' +
        '<span class="qp-badge" style="background:' + (cat ? cat.color : '#7C5CFF') + ';color:#fff;">' + escapeHtml(cat ? displayName(cat) : '') + '</span>' +
        '<span class="qp-badge">' + points + ' ' + escapeHtml(I18n.t('points')) + '</span>' +
        '<span class="qp-badge">' + escapeHtml(I18n.t(difficultyLabelKey)) + '</span>' +
      '</div>' +
      '<div class="qp-question">' + escapeHtml(text) + '</div>' +
      '<div class="qp-answer">' + escapeHtml(I18n.t('answerLabel')) + ': ' + escapeHtml(answer) + '</div>';

    if (image) {
      var img = document.createElement('img');
      img.src = image;
      img.alt = '';
      img.onerror = function () {
        img.remove();
        var err = document.createElement('div');
        err.className = 'qp-image-error';
        err.textContent = '⚠ ' + image;
        box.appendChild(err);
      };
      box.appendChild(img);
    }
    box.hidden = false;
  }

  function wireQuestionsPanel() {
    document.getElementById('question-category-select').addEventListener('change', function (e) {
      selectedQuestionCategoryId = e.target.value;
      renderQuestionList();
    });
    document.getElementById('question-admin-search').addEventListener('input', renderQuestionList);
    document.getElementById('btn-add-question').addEventListener('click', function () {
      if (!selectedQuestionCategoryId) { UI.toast(I18n.t('adminSelectCategory')); return; }
      openQuestionForm(null);
    });
    document.getElementById('btn-preview-question').addEventListener('click', renderQuestionPreview);

    document.getElementById('question-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var text = document.getElementById('q-field-text').value.trim();
      var answer = document.getElementById('q-field-answer').value.trim();
      if (!text || !answer) { UI.toast(I18n.t('adminFieldRequired')); return; }
      var difficulty = document.getElementById('q-field-difficulty').value;
      Catalog.saveQuestion(selectedQuestionCategoryId, {
        id: editingQuestionId || undefined,
        question: text,
        answer: answer,
        difficulty: difficulty,
        points: Catalog.POINTS_BY_DIFFICULTY[difficulty],
        image: document.getElementById('q-field-image').value.trim() || null
      });
      UI.toast(I18n.t('adminSavedNotice'));
      closeModal('modal-question-form');
      renderQuestionList();
      renderCategoryList();
      updateStatsLine();
    });
  }

  // ---------------------------------------------------------------------
  // Import / Export
  // ---------------------------------------------------------------------
  function updateStatsLine() {
    var cats = Catalog.getCategories();
    var total = cats.reduce(function (sum, c) { return sum + Catalog.getQuestions(c.id).length; }, 0);
    document.getElementById('stats-line').textContent = I18n.t('adminTotalQuestions', { count: total, categories: cats.length });
  }

  function wireImportExportPanel() {
    document.getElementById('btn-export-json').addEventListener('click', function () {
      var data = Catalog.exportJSON();
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'eshtebak-questions.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });

    document.getElementById('import-file-input').addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var parsed;
        try {
          parsed = JSON.parse(reader.result);
        } catch (err) {
          UI.toast(I18n.t('errorGeneric'));
          e.target.value = '';
          return;
        }
        UI.confirmDialog({
          title: I18n.t('adminImportJson'),
          message: I18n.t('adminImportWarning'),
          danger: true
        }).then(function (ok) {
          e.target.value = '';
          if (!ok) return;
          try {
            Catalog.importJSON(parsed);
            UI.toast(I18n.t('adminSavedNotice'));
            refreshAll();
          } catch (err) {
            UI.toast(I18n.t('errorGeneric'));
          }
        });
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-reset-defaults').addEventListener('click', function () {
      UI.confirmDialog({
        title: I18n.t('adminResetToDefaults'),
        message: I18n.t('adminResetConfirmMessage'),
        danger: true
      }).then(function (ok) {
        if (!ok) return;
        Catalog.resetToDefaults();
        UI.toast(I18n.t('adminSavedNotice'));
        refreshAll();
      });
    });
  }

  // ---------------------------------------------------------------------
  function refreshAll() {
    renderCategoryList();
    populateQuestionCategorySelect();
    renderQuestionList();
    updateStatsLine();
  }

  document.addEventListener('DOMContentLoaded', function () {
    I18n.apply(document);
    UI.renderIcons(document);
    updateLangSwitchUI();
    wireLangSwitch();
    wireModals();
    wireTabs();
    wireCategoriesPanel();
    wireQuestionsPanel();
    wireImportExportPanel();
    refreshAll();
  });
})();
