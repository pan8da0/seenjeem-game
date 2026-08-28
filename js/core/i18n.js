/**
 * Language state, RTL handling and DOM translation.
 * Usage: I18n.t('key', {placeholder: 'value'}), I18n.setLang('en'), I18n.apply()
 */
(function () {
  'use strict';

  var DEFAULT_LANG = 'ar';
  var currentLang = null;

  function detectInitialLang() {
    var stored = Storage_.read(Storage_.KEYS.LANGUAGE, null);
    if (stored === 'ar' || stored === 'en') return stored;
    var settings = Storage_.read(Storage_.KEYS.SETTINGS, null);
    if (settings && (settings.language === 'ar' || settings.language === 'en')) {
      return settings.language;
    }
    return DEFAULT_LANG;
  }

  function getLang() {
    if (!currentLang) currentLang = detectInitialLang();
    return currentLang;
  }

  function t(key, vars) {
    var dict = window.TRANSLATIONS[getLang()] || window.TRANSLATIONS[DEFAULT_LANG];
    var str = dict[key];
    if (str === undefined) {
      str = (window.TRANSLATIONS[DEFAULT_LANG] || {})[key];
    }
    if (str === undefined) return key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
      });
    }
    return str;
  }

  function updateDocumentDir() {
    var lang = getLang();
    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.body && document.body.classList.toggle('lang-en', lang === 'en');
    document.body && document.body.classList.toggle('lang-ar', lang === 'ar');
  }

  function apply(root) {
    root = root || document;
    updateDocumentDir();

    var textEls = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < textEls.length; i++) {
      var el = textEls[i];
      el.textContent = t(el.getAttribute('data-i18n'));
    }

    var htmlEls = root.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlEls.length; j++) {
      var elH = htmlEls[j];
      elH.innerHTML = t(elH.getAttribute('data-i18n-html'));
    }

    var placeholderEls = root.querySelectorAll('[data-i18n-placeholder]');
    for (var k = 0; k < placeholderEls.length; k++) {
      var elP = placeholderEls[k];
      elP.setAttribute('placeholder', t(elP.getAttribute('data-i18n-placeholder')));
    }

    var ariaEls = root.querySelectorAll('[data-i18n-aria-label]');
    for (var m = 0; m < ariaEls.length; m++) {
      var elA = ariaEls[m];
      elA.setAttribute('aria-label', t(elA.getAttribute('data-i18n-aria-label')));
    }

    var titleEl = root.querySelector('title[data-i18n]');
    if (titleEl) document.title = t(titleEl.getAttribute('data-i18n'));
  }

  function setLang(lang) {
    if (lang !== 'ar' && lang !== 'en') return;
    currentLang = lang;
    Storage_.write(Storage_.KEYS.LANGUAGE, lang);
    var settings = Storage_.read(Storage_.KEYS.SETTINGS, {});
    settings.language = lang;
    Storage_.write(Storage_.KEYS.SETTINGS, settings);
    apply(document);
    document.dispatchEvent(new CustomEvent('eshtebak:langchange', { detail: { lang: lang } }));
  }

  window.I18n = {
    t: t,
    getLang: getLang,
    setLang: setLang,
    apply: apply
  };
})();
