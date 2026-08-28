/**
 * Thin, safe LocalStorage wrapper. Every key is namespaced so this app never
 * collides with anything else that might live on the same origin.
 */
(function () {
  'use strict';

  var PREFIX = 'eshtebak:';
  var KEYS = {
    SETTINGS: PREFIX + 'settings',
    CURRENT_GAME: PREFIX + 'currentGame',
    RECENT_QUESTIONS: PREFIX + 'recentQuestions',
    LANGUAGE: PREFIX + 'language',
    CUSTOM_CATEGORIES: PREFIX + 'customCategories',
    CUSTOM_QUESTIONS: PREFIX + 'customQuestions',
    DELETED_CATEGORY_IDS: PREFIX + 'deletedCategoryIds',
    DELETED_QUESTION_IDS: PREFIX + 'deletedQuestionIds'
  };

  var memoryFallback = {};
  var storageAvailable = (function () {
    try {
      var testKey = PREFIX + '__test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  })();

  function read(key, fallback) {
    try {
      var raw = storageAvailable ? window.localStorage.getItem(key) : memoryFallback[key];
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      var raw = JSON.stringify(value);
      if (storageAvailable) {
        window.localStorage.setItem(key, raw);
      } else {
        memoryFallback[key] = raw;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function remove(key) {
    try {
      if (storageAvailable) {
        window.localStorage.removeItem(key);
      } else {
        delete memoryFallback[key];
      }
    } catch (e) {
      /* ignore */
    }
  }

  window.Storage_ = {
    KEYS: KEYS,
    read: read,
    write: write,
    remove: remove,
    isAvailable: function () {
      return storageAvailable;
    }
  };
})();
