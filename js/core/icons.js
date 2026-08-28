/**
 * Original, hand-authored inline SVG icon set (24x24, stroke-based line icons).
 * Nothing here is copied from any icon library or third-party brand asset.
 * Usage: Icons.render('football', {size: 28, className: 'icon'})
 */
(function () {
  'use strict';

  // Each entry is the INNER markup of a 24x24 viewBox <svg>.
  var ICONS = {
    // ---- Category icons ----
    football:
      '<circle cx="12" cy="12" r="9"/><path d="M12 8.5l2.4 1.8-.9 2.8h-3l-.9-2.8z"/><path d="M12 8.5V4M14.4 10.3l3.1-1.3M13.5 13.1l1.5 3.4M10.5 13.1L9 16.5M9.6 10.3L6.5 9"/>',
    capitals:
      '<circle cx="10" cy="10" r="7"/><path d="M3 10h14M10 3c2.4 2 2.4 12 0 14M10 3c-2.4 2-2.4 12 0 14"/><path d="M18 13c2 0 3.5 1.6 3.5 3.4S18 21.5 18 21.5s-3.5-2.7-3.5-5.1S16 13 18 13z"/><circle cx="18" cy="16.2" r="1" fill="currentColor" stroke="none"/>',
    history:
      '<path d="M6 3h12M6 21h12M7 3c0 5 4 6 5 8-1 2-5 3-5 8M17 3c0 5-4 6-5 8 1 2 5 3 5 8"/>',
    geography:
      '<path d="M4 6l6-2 6 2 4-2v14l-4 2-6-2-6 2V6z"/><path d="M10 4v14M16 6v14"/>',
    islamic:
      '<path d="M15.5 4.5c-4.3.3-7.7 3.9-7.7 8.3s3.4 8 7.7 8.3a8.3 8.3 0 1 1 0-16.6z"/><path d="M19 3l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
    quran:
      '<path d="M12 6.2c-2.1-1.6-5-2.1-8-1.1v13c3-1 5.9-.5 8 1.1 2.1-1.6 5-2.1 8-1.1v-13c-3-1-5.9-.5-8 1.1z"/><path d="M12 6.2v13"/>',
    prophet_biography:
      '<path d="M4 21V13a8 8 0 0 1 16 0v8"/><path d="M3 21h18"/><path d="M12 4.2v3"/><circle cx="12" cy="3.1" r="1" fill="currentColor" stroke="none"/><path d="M9 21v-5a3 3 0 0 1 6 0v5"/>',
    companions:
      '<circle cx="8.5" cy="8" r="3"/><circle cx="16" cy="9.2" r="2.4"/><path d="M2.8 21v-1.6a5 5 0 0 1 5-5h1.4a5 5 0 0 1 5 5V21"/><path d="M15 14.4a4.4 4.4 0 0 1 6 4.1V21"/>',
    science:
      '<path d="M9.5 3h5M10 3v6.2l-5 9a1.8 1.8 0 0 0 1.6 2.6h10.8a1.8 1.8 0 0 0 1.6-2.6l-5-9V3"/><path d="M7.5 15h9"/>',
    human_body:
      '<path d="M12 20.5S3.5 15.4 3.5 9.6C3.5 6.5 5.8 4.3 8.5 4.3c1.6 0 3 .8 3.5 2 .5-1.2 1.9-2 3.5-2 2.7 0 5 2.2 5 5.3 0 5.8-8.5 10.9-8.5 10.9z"/><path d="M4.5 12h3l1.6-3 2 5 1.5-3h6.9"/>',
    space:
      '<path d="M12 2.5c3 2 4.6 6 4 10.3l-4 3.9-4-3.9c-.6-4.3 1-8.3 4-10.3z"/><circle cx="12" cy="9.5" r="1.4" fill="currentColor" stroke="none"/><path d="M8.6 14.8l-2.6 4.7 4.6-2M15.4 14.8l2.6 4.7-4.6-2"/>',
    animals:
      '<ellipse cx="7.8" cy="8.2" rx="1.8" ry="2.3"/><ellipse cx="12.4" cy="6" rx="1.8" ry="2.3"/><ellipse cx="16.6" cy="8.6" rx="1.6" ry="2.1"/><path d="M12.5 11.6c3 0 5.3 2 5.3 4.5s-2.6 4.7-5.8 4.7-5.8-2.2-5.8-4.7 2.5-4.5 5.5-4.5z"/>',
    technology:
      '<rect x="7" y="7" width="10" height="10" rx="1.6"/><rect x="9.6" y="9.6" width="4.8" height="4.8" rx=".6"/><path d="M9 3v4M12 3v4M15 3v4M9 17v4M12 17v4M15 17v4M3 9h4M3 12h4M3 15h4M17 9h4M17 12h4M17 15h4"/>',
    inventions:
      '<path d="M9.2 18.2h5.6M10 21h4"/><path d="M12 3a6.2 6.2 0 0 0-3.6 11.2c.7.5 1.1 1.3 1.1 2.1h5c0-.8.4-1.6 1.1-2.1A6.2 6.2 0 0 0 12 3z"/>',
    arab_cities:
      '<path d="M3 21V9.5l4-3 4 3V21M11 21V6l4-3 4 3v15M3 21h18M6.5 12h1M6.5 15h1M14.5 9h1M14.5 12h1M14.5 15h1"/>',
    food:
      '<path d="M6.2 2v8.3a1.9 1.9 0 0 0 1.9 1.9V22M6.2 2v4.3M9 2v4.3M6.2 6.3H9"/><path d="M17.3 2c-1.6 0-3.1 2-3.1 4.6S15.7 11.7 17.3 11.7V22"/>',
    general_knowledge:
      '<path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v16H7.5A2.5 2.5 0 0 0 5 20.5z"/><path d="M5 4.5v16"/><path d="M9.3 6.5h7M9.3 9.5h7"/>',
    riddles:
      '<path d="M4.5 4.5h5.7v1.9a1.9 1.9 0 1 1 0 3.8v3.3H4.5V9.7h1.9a1.9 1.9 0 1 0 0-3.8H4.5V4.5z"/><path d="M13.8 4.5h5.7v5.2h-1.9a1.9 1.9 0 1 0 0 3.8h1.9v5.2h-5.7v-1.9a1.9 1.9 0 1 0-3.8 0v1.9h-1.9v-5.7h1.9a1.9 1.9 0 1 0 0-3.8h-1.9V9z"/>',
    landmarks:
      '<path d="M12 2.2l3.6 7.3h-2.6l2.6 5.2h-2.6l1.7 5.1H9.3L11 14.7H8.4L11 9.5H8.4z"/><path d="M4.5 21.8h15"/>',
    civilizations:
      '<path d="M12 3.5l9 15.8H3z"/><path d="M8 13.6h8M6.2 16.8h11.6M9.4 10.3h5.2"/>',
    sports_general:
      '<path d="M7.5 3.5h9v4.2a4.5 4.5 0 0 1-9 0V3.5z"/><path d="M5.2 4.6H3.4A3.1 3.1 0 0 0 6.5 7.7M18.8 4.6h1.8a3.1 3.1 0 0 1-3.1 3.1"/><path d="M9.3 15.3v2.9h5.4v-2.9M8.2 21.5h7.6M12 18.2v3.3"/>',

    // ---- UI icons ----
    settings:
      '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    soundOn:
      '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.2a5 5 0 0 1 0 7.6M19 5.5a9 9 0 0 1 0 13"/>',
    soundOff:
      '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M15.5 9.5l5 5M20.5 9.5l-5 5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
    play: '<path d="M7 4.2l13 7.8-13 7.8V4.2z"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16M9 7V4.8A1.8 1.8 0 0 1 10.8 3h2.4A1.8 1.8 0 0 1 15 4.8V7M6.5 7l.8 12.4A2 2 0 0 0 9.3 21h5.4a2 2 0 0 0 2-1.6L18.5 7"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    star: '<path d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.6-6-3.2-6 3.2 1.2-6.6-4.8-4.6 6.6-.8z"/>',
    trophy:
      '<path d="M7.5 3.5h9v4.2a4.5 4.5 0 0 1-9 0V3.5z"/><path d="M5.2 4.6H3.4A3.1 3.1 0 0 0 6.5 7.7M18.8 4.6h1.8a3.1 3.1 0 0 1-3.1 3.1"/><path d="M9.3 15.3v2.9h5.4v-2.9M8.2 21.5h7.6M12 18.2v3.3"/>'
  };

  var FALLBACK_ICON = 'star';

  function render(key, opts) {
    opts = opts || {};
    var inner = ICONS[key] || ICONS[FALLBACK_ICON];
    var size = opts.size || 24;
    var cls = opts.className ? ' class="' + opts.className + '"' : '';
    return (
      '<svg' + cls + ' width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      inner + '</svg>'
    );
  }

  function has(key) {
    return Object.prototype.hasOwnProperty.call(ICONS, key);
  }

  window.Icons = { render: render, has: has, keys: Object.keys(ICONS) };
})();
