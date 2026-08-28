/**
 * Tiny synthesized sound effects using the Web Audio API — no audio files to
 * download or license. Every call is a no-op if audio is unavailable or the
 * user has sound turned off, so the game always works without sound.
 */
(function () {
  'use strict';

  var ctx = null;

  function getCtx() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch (e) {
      ctx = null;
    }
    return ctx;
  }

  function isEnabled() {
    var settings = Storage_.read(Storage_.KEYS.SETTINGS, {});
    return settings.sound !== false;
  }

  function tone(freq, startTime, duration, type, gainPeak) {
    var audioCtx = getCtx();
    if (!audioCtx) return;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(gainPeak || 0.18, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  function play(sequence) {
    if (!isEnabled()) return;
    var audioCtx = getCtx();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function () {});
    }
    var now = audioCtx.currentTime;
    sequence.forEach(function (step) {
      tone(step.freq, now + step.at, step.dur, step.type, step.gain);
    });
  }

  var SoundFx = {
    openQuestion: function () {
      play([{ freq: 520, at: 0, dur: 0.12, type: 'triangle' }, { freq: 720, at: 0.09, dur: 0.14, type: 'triangle' }]);
    },
    correct: function () {
      play([
        { freq: 523.25, at: 0, dur: 0.12, type: 'sine' },
        { freq: 659.25, at: 0.1, dur: 0.12, type: 'sine' },
        { freq: 783.99, at: 0.2, dur: 0.22, type: 'sine' }
      ]);
    },
    noOne: function () {
      play([{ freq: 300, at: 0, dur: 0.18, type: 'sine' }, { freq: 220, at: 0.14, dur: 0.22, type: 'sine' }]);
    },
    timeUp: function () {
      play([
        { freq: 220, at: 0, dur: 0.16, type: 'sawtooth', gain: 0.14 },
        { freq: 196, at: 0.16, dur: 0.16, type: 'sawtooth', gain: 0.14 },
        { freq: 164, at: 0.32, dur: 0.28, type: 'sawtooth', gain: 0.14 }
      ]);
    },
    tick: function () {
      play([{ freq: 880, at: 0, dur: 0.05, type: 'square', gain: 0.06 }]);
    },
    winner: function () {
      play([
        { freq: 523.25, at: 0, dur: 0.16, type: 'triangle' },
        { freq: 659.25, at: 0.15, dur: 0.16, type: 'triangle' },
        { freq: 783.99, at: 0.3, dur: 0.16, type: 'triangle' },
        { freq: 1046.5, at: 0.45, dur: 0.4, type: 'triangle' }
      ]);
    },
    click: function () {
      play([{ freq: 660, at: 0, dur: 0.05, type: 'sine', gain: 0.08 }]);
    }
  };

  window.SoundFx = SoundFx;
})();
