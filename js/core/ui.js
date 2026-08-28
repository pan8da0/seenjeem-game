/**
 * Small shared UI helpers used across pages: modal dialogs, toasts and a
 * lightweight confetti burst. No dependencies.
 */
(function () {
  'use strict';

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      if (key === 'className') node.className = attrs[key];
      else if (key === 'text') node.textContent = attrs[key];
      else if (key === 'html') node.innerHTML = attrs[key];
      else if (key.indexOf('on') === 0 && typeof attrs[key] === 'function') {
        node.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
      } else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (c) {
      if (c) node.appendChild(c);
    });
    return node;
  }

  // ---- Confirm modal (replaces browser confirm() with an on-brand dialog) ----
  function confirmDialog(opts) {
    return new Promise(function (resolve) {
      var overlay = el('div', { className: 'modal-overlay', role: 'presentation' });
      var titleId = 'confirm-title-' + Date.now();
      var box = el('div', { className: 'modal-box modal-box--confirm', role: 'alertdialog', 'aria-modal': 'true', 'aria-labelledby': titleId });

      var title = el('h3', { className: 'modal-title', id: titleId, text: opts.title || I18n.t('confirmGeneric') });
      var msg = el('p', { className: 'modal-message', text: opts.message || '' });
      var actions = el('div', { className: 'modal-actions' });

      var cancelBtn = el('button', {
        className: 'btn btn--ghost',
        type: 'button',
        text: opts.cancelLabel || I18n.t('cancel'),
        onClick: function () {
          close(false);
        }
      });
      var confirmBtn = el('button', {
        className: 'btn ' + (opts.danger ? 'btn--danger' : 'btn--primary'),
        type: 'button',
        text: opts.confirmLabel || I18n.t('confirm'),
        onClick: function () {
          close(true);
        }
      });

      actions.appendChild(cancelBtn);
      actions.appendChild(confirmBtn);
      box.appendChild(title);
      if (opts.message) box.appendChild(msg);
      box.appendChild(actions);
      overlay.appendChild(box);

      function close(result) {
        overlay.classList.add('modal-overlay--closing');
        setTimeout(function () {
          overlay.remove();
        }, 150);
        resolve(result);
      }

      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close(false);
      });
      document.addEventListener(
        'keydown',
        function esc(e) {
          if (e.key === 'Escape') {
            close(false);
            document.removeEventListener('keydown', esc);
          }
        }
      );

      document.body.appendChild(overlay);
      confirmBtn.focus();
    });
  }

  // ---- Toast ----
  var toastTimer = null;
  function toast(message) {
    var existing = document.getElementById('ui-toast');
    if (existing) existing.remove();
    var node = el('div', { id: 'ui-toast', className: 'toast', text: message });
    document.body.appendChild(node);
    requestAnimationFrame(function () {
      node.classList.add('toast--visible');
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      node.classList.remove('toast--visible');
      setTimeout(function () {
        node.remove();
      }, 250);
    }, 2200);
  }

  // ---- Confetti ----
  function confettiBurst(container) {
    var colors = ['#7C5CFF', '#FF8A3D', '#22D3EE', '#FB7185', '#FFD166', '#34D399'];
    var host = container || document.body;
    var layer = el('div', { className: 'confetti-layer', 'aria-hidden': 'true' });
    var count = 90;
    for (var i = 0; i < count; i++) {
      var piece = el('span', { className: 'confetti-piece' });
      var left = Math.random() * 100;
      var delay = Math.random() * 0.6;
      var duration = 2.2 + Math.random() * 1.6;
      var color = colors[Math.floor(Math.random() * colors.length)];
      var rotate = Math.random() * 360;
      var drift = (Math.random() - 0.5) * 160;
      piece.style.left = left + '%';
      piece.style.background = color;
      piece.style.animationDelay = delay + 's';
      piece.style.animationDuration = duration + 's';
      piece.style.setProperty('--rotate', rotate + 'deg');
      piece.style.setProperty('--drift', drift + 'px');
      if (Math.random() > 0.5) piece.style.borderRadius = '50%';
      layer.appendChild(piece);
    }
    host.appendChild(layer);
    setTimeout(function () {
      layer.remove();
    }, 4200);
  }

  function renderIcons(root) {
    root = root || document;
    var nodes = root.querySelectorAll('[data-icon]');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var key = node.getAttribute('data-icon');
      var size = node.getAttribute('data-icon-size') || 20;
      node.innerHTML = Icons.render(key, { size: parseInt(size, 10) });
    }
  }

  window.UI = {
    el: el,
    confirmDialog: confirmDialog,
    toast: toast,
    confettiBurst: confettiBurst,
    renderIcons: renderIcons
  };
})();
