/**
 * Catalog: the single source of truth for categories + questions at runtime.
 *
 * It merges the built-in data shipped in /data (window.QUIZ_CATEGORIES,
 * window.QUIZ_QUESTIONS) with a LocalStorage overlay of admin edits
 * (added/edited/deleted). GitHub Pages is static and can't let the browser
 * rewrite repo files, so admin changes live in the overlay until exported
 * as JSON and manually placed back into /data (see README).
 */
(function () {
  'use strict';

  var POINTS_BY_DIFFICULTY = { easy: 100, medium: 200, hard: 300 };

  function readOverlay() {
    return {
      customCategories: Storage_.read(Storage_.KEYS.CUSTOM_CATEGORIES, {}),
      customQuestions: Storage_.read(Storage_.KEYS.CUSTOM_QUESTIONS, {}),
      deletedCategoryIds: Storage_.read(Storage_.KEYS.DELETED_CATEGORY_IDS, []),
      deletedQuestionIds: Storage_.read(Storage_.KEYS.DELETED_QUESTION_IDS, {})
    };
  }

  function builtInCategories() {
    return window.QUIZ_CATEGORIES || [];
  }

  function builtInQuestions(categoryId) {
    return (window.QUIZ_QUESTIONS && window.QUIZ_QUESTIONS[categoryId]) || [];
  }

  function normalizeQuestion(q) {
    var out = {
      id: q.id,
      question: q.question || '',
      answer: q.answer || '',
      difficulty: q.difficulty || 'easy',
      image: q.image || null
    };
    out.points = q.points || POINTS_BY_DIFFICULTY[out.difficulty] || 100;
    return out;
  }

  function getCategories() {
    var overlay = readOverlay();
    var byId = {};
    var order = [];

    builtInCategories().forEach(function (c) {
      byId[c.id] = Object.assign({}, c);
      order.push(c.id);
    });

    Object.keys(overlay.customCategories).forEach(function (id) {
      if (byId[id]) {
        byId[id] = Object.assign({}, byId[id], overlay.customCategories[id]);
      } else {
        byId[id] = Object.assign({}, overlay.customCategories[id]);
        order.push(id);
      }
    });

    return order
      .filter(function (id) {
        return overlay.deletedCategoryIds.indexOf(id) === -1;
      })
      .map(function (id) {
        return byId[id];
      });
  }

  function getCategory(id) {
    var found = getCategories().filter(function (c) {
      return c.id === id;
    });
    return found[0] || null;
  }

  function getQuestions(categoryId) {
    var overlay = readOverlay();
    var byId = {};
    var order = [];

    builtInQuestions(categoryId).forEach(function (q) {
      byId[q.id] = normalizeQuestion(q);
      order.push(q.id);
    });

    var customForCat = overlay.customQuestions[categoryId] || {};
    Object.keys(customForCat).forEach(function (qid) {
      var merged = byId[qid] ? Object.assign({}, byId[qid], customForCat[qid]) : customForCat[qid];
      byId[qid] = normalizeQuestion(Object.assign({ id: qid }, merged));
      if (order.indexOf(qid) === -1) order.push(qid);
    });

    var deletedForCat = overlay.deletedQuestionIds[categoryId] || [];

    return order
      .filter(function (qid) {
        return deletedForCat.indexOf(qid) === -1;
      })
      .map(function (qid) {
        return byId[qid];
      });
  }

  function getQuestion(categoryId, questionId) {
    var found = getQuestions(categoryId).filter(function (q) {
      return q.id === questionId;
    });
    return found[0] || null;
  }

  function slugify(text) {
    return String(text || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9؀-ۿ]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'category';
  }

  function saveCategory(categoryData) {
    var overlay = readOverlay();
    var id = categoryData.id && String(categoryData.id).trim();
    if (!id) {
      id = slugify(categoryData.nameEn || categoryData.nameAr) + '_' + Date.now().toString(36);
    }
    var idx = overlay.deletedCategoryIds.indexOf(id);
    if (idx !== -1) overlay.deletedCategoryIds.splice(idx, 1);

    overlay.customCategories[id] = Object.assign({}, categoryData, { id: id });
    Storage_.write(Storage_.KEYS.CUSTOM_CATEGORIES, overlay.customCategories);
    Storage_.write(Storage_.KEYS.DELETED_CATEGORY_IDS, overlay.deletedCategoryIds);
    return id;
  }

  function deleteCategory(id) {
    var overlay = readOverlay();
    if (overlay.deletedCategoryIds.indexOf(id) === -1) {
      overlay.deletedCategoryIds.push(id);
    }
    delete overlay.customCategories[id];
    delete overlay.customQuestions[id];
    delete overlay.deletedQuestionIds[id];
    Storage_.write(Storage_.KEYS.DELETED_CATEGORY_IDS, overlay.deletedCategoryIds);
    Storage_.write(Storage_.KEYS.CUSTOM_CATEGORIES, overlay.customCategories);
    Storage_.write(Storage_.KEYS.CUSTOM_QUESTIONS, overlay.customQuestions);
    Storage_.write(Storage_.KEYS.DELETED_QUESTION_IDS, overlay.deletedQuestionIds);
  }

  function saveQuestion(categoryId, questionData) {
    var overlay = readOverlay();
    var id = questionData.id && String(questionData.id).trim();
    if (!id) {
      id = categoryId + '_custom_' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
    }
    if (!overlay.customQuestions[categoryId]) overlay.customQuestions[categoryId] = {};

    var deletedForCat = overlay.deletedQuestionIds[categoryId] || [];
    var dIdx = deletedForCat.indexOf(id);
    if (dIdx !== -1) deletedForCat.splice(dIdx, 1);
    overlay.deletedQuestionIds[categoryId] = deletedForCat;

    overlay.customQuestions[categoryId][id] = Object.assign({}, questionData, { id: id });
    Storage_.write(Storage_.KEYS.CUSTOM_QUESTIONS, overlay.customQuestions);
    Storage_.write(Storage_.KEYS.DELETED_QUESTION_IDS, overlay.deletedQuestionIds);
    return id;
  }

  function deleteQuestion(categoryId, questionId) {
    var overlay = readOverlay();
    if (!overlay.deletedQuestionIds[categoryId]) overlay.deletedQuestionIds[categoryId] = [];
    if (overlay.deletedQuestionIds[categoryId].indexOf(questionId) === -1) {
      overlay.deletedQuestionIds[categoryId].push(questionId);
    }
    if (overlay.customQuestions[categoryId]) {
      delete overlay.customQuestions[categoryId][questionId];
    }
    Storage_.write(Storage_.KEYS.DELETED_QUESTION_IDS, overlay.deletedQuestionIds);
    Storage_.write(Storage_.KEYS.CUSTOM_QUESTIONS, overlay.customQuestions);
  }

  function resetToDefaults() {
    Storage_.write(Storage_.KEYS.CUSTOM_CATEGORIES, {});
    Storage_.write(Storage_.KEYS.CUSTOM_QUESTIONS, {});
    Storage_.write(Storage_.KEYS.DELETED_CATEGORY_IDS, []);
    Storage_.write(Storage_.KEYS.DELETED_QUESTION_IDS, {});
  }

  function exportJSON() {
    var categories = getCategories().map(function (c) {
      var withQuestions = Object.assign({}, c);
      withQuestions.questions = getQuestions(c.id);
      return withQuestions;
    });
    return { version: 1, exportedAt: new Date().toISOString(), categories: categories };
  }

  function importJSON(data) {
    var categories = Array.isArray(data) ? data : data && data.categories;
    if (!Array.isArray(categories)) {
      throw new Error('Invalid JSON: expected an array of categories or {categories: [...]}');
    }

    var newCustomCategories = {};
    var newCustomQuestions = {};
    var newDeletedQuestionIds = {};
    var importedIds = [];

    categories.forEach(function (cat) {
      if (!cat || !cat.id) return;
      importedIds.push(cat.id);
      var catCopy = Object.assign({}, cat);
      var questions = Array.isArray(catCopy.questions) ? catCopy.questions : [];
      delete catCopy.questions;
      newCustomCategories[cat.id] = catCopy;

      newCustomQuestions[cat.id] = {};
      var importedQIds = [];
      questions.forEach(function (q) {
        if (!q || !q.id) return;
        importedQIds.push(q.id);
        newCustomQuestions[cat.id][q.id] = normalizeQuestion(q);
      });

      var builtInQIds = builtInQuestions(cat.id).map(function (q) {
        return q.id;
      });
      newDeletedQuestionIds[cat.id] = builtInQIds.filter(function (qid) {
        return importedQIds.indexOf(qid) === -1;
      });
    });

    var deletedCategoryIds = builtInCategories()
      .map(function (c) {
        return c.id;
      })
      .filter(function (id) {
        return importedIds.indexOf(id) === -1;
      });

    Storage_.write(Storage_.KEYS.CUSTOM_CATEGORIES, newCustomCategories);
    Storage_.write(Storage_.KEYS.CUSTOM_QUESTIONS, newCustomQuestions);
    Storage_.write(Storage_.KEYS.DELETED_QUESTION_IDS, newDeletedQuestionIds);
    Storage_.write(Storage_.KEYS.DELETED_CATEGORY_IDS, deletedCategoryIds);
  }

  window.Catalog = {
    POINTS_BY_DIFFICULTY: POINTS_BY_DIFFICULTY,
    getCategories: getCategories,
    getCategory: getCategory,
    getQuestions: getQuestions,
    getQuestion: getQuestion,
    saveCategory: saveCategory,
    deleteCategory: deleteCategory,
    saveQuestion: saveQuestion,
    deleteQuestion: deleteQuestion,
    resetToDefaults: resetToDefaults,
    exportJSON: exportJSON,
    importJSON: importJSON
  };
})();
