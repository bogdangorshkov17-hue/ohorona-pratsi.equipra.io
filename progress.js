(function () {
  var MODULES = [
    { id: 1, file: 'modul-1-osnovni-pryncypy.html', title: 'Основні принципи охорони праці' },
    { id: 2, file: 'modul-2-ziz.html', title: 'Засоби індивідуального захисту (ЗІЗ)' },
    { id: 3, file: 'modul-3-roboty-na-vysoti.html', title: 'Роботи на висоті' },
    { id: 4, file: 'modul-4-vognevi-roboty.html', title: 'Вогневі роботи' },
    { id: 5, file: 'modul-5-pidyomni-roboty.html', title: 'Підйомні роботи' },
    { id: 6, file: 'modul-6-zamknenyi-prostir.html', title: 'Робота в замкненому просторі' },
    { id: 7, file: 'modul-7-elektrobezpeka.html', title: 'Електробезпека' }
  ];
  var KEY = 'equipra-op-progress';

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function setComplete(id) {
    var p = getProgress();
    p[id] = true;
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch (e) {
      /* localStorage unavailable — progress just won't persist, no crash */
    }
  }

  function isComplete(id) {
    return !!getProgress()[id];
  }

  function completedCount() {
    var p = getProgress();
    var n = 0;
    MODULES.forEach(function (m) {
      if (p[m.id]) n++;
    });
    return n;
  }

  window.EquipraProgress = {
    MODULES: MODULES,
    getProgress: getProgress,
    setComplete: setComplete,
    isComplete: isComplete,
    completedCount: completedCount
  };

  document.addEventListener('DOMContentLoaded', function () {
    // Homepage: fill in progress bar + per-module checkmarks
    var bar = document.getElementById('progress-bar-fill');
    var label = document.getElementById('progress-label');
    if (bar && label) {
      var done = completedCount();
      var total = MODULES.length;
      bar.style.width = (total ? (done / total * 100) : 0) + '%';
      label.textContent = done === 0
        ? 'Ще не розпочато · 0 з ' + total + ' модулів'
        : done + ' з ' + total + ' модулів пройдено';

      MODULES.forEach(function (m) {
        if (isComplete(m.id)) {
          var row = document.querySelector('.module-row[data-module="' + m.id + '"]');
          if (row) {
            var titleEl = row.querySelector('.title');
            if (titleEl && !titleEl.querySelector('.module-done-badge')) {
              var badge = document.createElement('span');
              badge.className = 'module-done-badge';
              badge.textContent = '✓ Пройдено';
              titleEl.appendChild(badge);
            }
          }
        }
      });
    }

    // Module page: wire up "mark complete + go next" button
    var completeBtn = document.getElementById('mark-complete-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', function () {
        var currentId = parseInt(completeBtn.getAttribute('data-current'), 10);
        var next = completeBtn.getAttribute('data-next');
        setComplete(currentId);
        window.location.href = next;
      });
    }
  });
})();
