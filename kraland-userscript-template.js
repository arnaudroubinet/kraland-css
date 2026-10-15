// Main script code - CSS bundled inline
(function (){
  'use strict';

  // Version du userscript (sera remplacée par le build)
  const CURRENT_VERSION = '__USERSCRIPT_VERSION__';

  // ============================================================================
  // PERFORMANCE LOGGING
  // ============================================================================
  const PerfLog = {
    _t0: performance.now(),
    _marks: [],
    bootTime: 0,

    /** Marque le début d'une phase */
    start(label) {
      performance.mark('kr-' + label + '-start');
    },

    /** Marque la fin d'une phase et enregistre la durée */
    end(label) {
      const startMark = 'kr-' + label + '-start';
      const endMark = 'kr-' + label + '-end';
      performance.mark(endMark);
      try {
        const measure = performance.measure('kr-' + label, startMark, endMark);
        this._marks.push({ label: label, duration: measure.duration });
      } catch (_e) {
        // mark manquant — ignorer
      }
    },

    /** Finalise les mesures et affiche le rapport (appelé en fin d'init) */
    report() {
      this.bootTime = performance.now() - this._t0;
      this.print();
    },

    /**
     * Retourne un tableau formaté des résultats (à appeler depuis la console)
     * Usage : KralandPerf.results()
     */
    results() {
      return {
        bootTime: +this.bootTime.toFixed(1),
        phases: this._marks.map(m => ({
          phase: m.label,
          ms: +m.duration.toFixed(2)
        })),
        entries: performance.getEntriesByType('measure')
          .filter(e => e.name.startsWith('kr-'))
          .map(e => ({ name: e.name.replace('kr-', ''), ms: +e.duration.toFixed(2) }))
      };
    },

    /** Affiche un rapport lisible dans la console */
    print() {
      const r = this.results();
      const w = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
      const c = w['cons' + 'ole'];
      c.groupCollapsed('[Kraland Perf] Boot total : ' + r.bootTime + ' ms');
      c.debug(r.phases);
      c.groupEnd();
    }
  };

  // Exposer globalement pour accès console
  // unsafeWindow nécessaire car @grant GM.xmlHttpRequest active le sandbox Tampermonkey
  // Activer : localStorage.setItem('kr-perf-log', 'true') puis recharger
  // Lire :   KralandPerf.print()  ou  KralandPerf.results()
  try {
    (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window).KralandPerf = PerfLog;
  } catch (_e) {
    window.KralandPerf = PerfLog;
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  /**
   * Vérifie de manière sûre si le mode mobile est activé
   * Protège contre l'accès à document.body avant son initialisation
   */
  function isMobileMode() {
    return document.body && document.body.classList && document.body.classList.contains('mobile-mode');
  }

  // PLT-07 — Jauges PV/PM/PP : lecture du DOM natif (Bootstrap 3).
  // Natif : .progress contient deux segments empilés.
  //   - progress-bar-success : largeur = part de la valeur, texte caché = valeur ;
  //   - progress-bar-warning : texte caché = maximum - valeur (écart au maximum).
  // Décision d'Arnaud (choix A) : on conserve les DEUX segments natifs en desktop et en mobile
  // (même sens, mêmes variables --kr-gauge-pv/pm/pp pour la valeur, une couleur unique pour l’écart au max).
  // Aucun maximum n'est affiché : celui de PP (150 ?) n'est confirmé nulle part, seul l’écart au max l'est.
  var GAUGE_BUTTONS = { pv: 'alert141', pm: 'alert142', pp: 'alert143' };
  var GAUGE_LABELS = { pv: 'PV', pm: 'PM', pp: 'PP' };

  function findNativeGaugeProgress(type) {
    var button = document.querySelector('#col-left a.' + GAUGE_BUTTONS[type] + ', a.btn.' + GAUGE_BUTTONS[type]);
    if (!button) {return null;}
    var node = button;
    for (var depth = 0; node && depth < 4; depth++, node = node.parentElement) {
      var sibling = node.nextElementSibling;
      while (sibling) {
        if (sibling.matches('.progress')) {return sibling;}
        var inner = sibling.querySelector(':scope > .progress');
        if (inner) {return inner;}
        if (sibling.querySelector('[class*="alert14"]')) {break;}
        sibling = sibling.nextElementSibling;
      }
    }
    return null;
  }

  function readNativeGauge(type) {
    var progress = findNativeGaugeProgress(type);
    if (!progress) {return null;}
    var success = progress.querySelector('.progress-bar-success');
    var warning = progress.querySelector('.progress-bar-warning');
    if (!success) {return null;}
    var hiddenNumber = function (el) {
      var hidden = el ? el.querySelector('.sr-only') : null;
      var value = hidden ? parseInt(hidden.textContent, 10) : NaN;
      return isNaN(value) ? null : value;
    };
    var clamp = function (n) {return Math.min(100, Math.max(0, n));};
    var current = hiddenNumber(success);
    var rest = hiddenNumber(warning);
    var fillWidth = parseFloat(success.style.width);
    var restWidth = warning ? parseFloat(warning.style.width) : NaN;
    var percent = !isNaN(fillWidth) ? clamp(fillWidth) : 0;
    var restPercent = !isNaN(restWidth) ? clamp(restWidth) : clamp(100 - percent);
    return {
      type: type,
      current: current === null ? 0 : current,
      rest: rest,
      percent: percent,
      restPercent: restPercent,
      progress: progress
    };
  }

  function describeGauge(gauge) {
    var name = GAUGE_LABELS[gauge.type];
    var text = name + ' : ' + gauge.current + ' (valeur, segment coloré)';
    if (gauge.rest !== null) {
      text += ' · écart au max : ' + gauge.rest + ' (segment hachuré)';
    }
    return text;
  }

  function normalizeNativeGauges() {
    var last = null;
    Object.keys(GAUGE_BUTTONS).forEach(function (type) {
      var gauge = readNativeGauge(type);
      if (!gauge) {return;}
      var text = describeGauge(gauge);
      gauge.progress.setAttribute('data-kr-gauge', type);
      gauge.progress.setAttribute('title', text);
      gauge.progress.setAttribute('aria-label', text);
      last = gauge.progress;
    });
    // Légende visible unique (le sens des segments ne dépend pas de l'infobulle)
    if (last && !document.querySelector('.kr-gauge-legend')) {
      var legend = document.createElement('div');
      legend.className = 'kr-gauge-legend';
      legend.innerHTML = '<span class="kr-gauge-legend-item"><i class="kr-gauge-legend-swatch value"></i>valeur</span>' +
        '<span class="kr-gauge-legend-item"><i class="kr-gauge-legend-swatch rest"></i>écart au maximum</span>';
      last.insertAdjacentElement('afterend', legend);
    }
  }

  /**
   * Clone le contenu visible d'un élément en préservant les <img> (smileys).
   * Retourne un DocumentFragment contenant les nœuds texte et <img> clonés.
   */
  function cloneVisibleContent(el) {
    var fragment = document.createDocumentFragment();
    el.childNodes.forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        fragment.appendChild(node.cloneNode(false));
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IMG') {
        fragment.appendChild(node.cloneNode(true));
      }
    });
    return fragment;
  }

  /**
   * Remplace le contenu d'un élément par un fragment riche (texte + <img>).
   */
  function setRichContent(el, fragment) {
    el.textContent = '';
    el.appendChild(fragment);
  }

  /**
   * Gestionnaire centralisé de resize — un seul listener pour tous les modules
   * Chaque callback est debouncé individuellement selon le délai spécifié
   */
  const ResizeManager = {
    _callbacks: [],
    _listening: false,

    /**
     * Enregistre un callback à appeler lors du resize
     * @param {Function} callback - Fonction à exécuter
     * @param {number} debounceMs - Délai de debounce en ms (0 = pas de debounce)
     */
    add(callback, debounceMs = 200) {
      let timer;
      const wrapped = () => {
        if (debounceMs > 0) {
          clearTimeout(timer);
          timer = setTimeout(callback, debounceMs);
        } else {
          callback();
        }
      };
      this._callbacks.push(wrapped);

      if (!this._listening) {
        this._listening = true;
        window.addEventListener('resize', () => {
          this._callbacks.forEach(cb => cb());
        });
      }
    }
  };

  // ============================================================================
  // INITIALIZATION ORCHESTRATOR
  // Garantit l'ordre d'exécution séquentiel de tous les modules
  // Chaque module décide lui-même s'il doit s'exécuter (mobile/desktop/page)
  // ============================================================================
  const InitQueue = {
    _queue: [],
    _initialized: false,

    /**
     * Enregistre une fonction d'initialisation avec sa priorité
     * @param {string} name - Nom du module (pour debug)
     * @param {Function} fn - Fonction d'initialisation
     * @param {number} priority - Priorité (plus petit = exécuté en premier)
     */
    register(name, fn, priority = 100) {
      this._queue.push({ name, fn, priority });
    },

    /**
     * Exécute toutes les fonctions enregistrées dans l'ordre de priorité
     * Appelé une seule fois après le DOMContentLoaded
     */
    run() {
      if (this._initialized) {return;}

      this._initialized = true;

      // Trier par priorité (plus petit en premier)
      this._queue.sort((a, b) => a.priority - b.priority);

      // console.log(`[InitQueue] Démarrage initialisation séquentielle (${isMobileMode() ? 'mobile' : 'desktop'})`);
      // console.log('[InitQueue] Ordre:', this._queue.map(m => `${m.name}(${m.priority})`).join(' → '));

      PerfLog.start('InitQueue');

      // Exécuter séquentiellement
      this._queue.forEach(({ name, fn }) => {
        try {
          PerfLog.start('module:' + name);
          fn();
          PerfLog.end('module:' + name);
        } catch (e) {
          PerfLog.end('module:' + name);
          console.error(`[InitQueue] ✗ ${name}:`, e);
        }
      });

      PerfLog.end('InitQueue');
    }
  };

  // ============================================================================
  // TASK-1.1 - MOBILE DETECTION & INITIALIZATION
  // ============================================================================
  (function () {
    // Configuration
    const MOBILE_BREAKPOINT = 768; // px

    // État mémorisé pour éviter les logs redondants lors des multiples appels
    let previousMobileState = null;

    /**
     * Détecte si on est sur mobile
     */
    function isMobileDevice() {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }

    /**
     * Initialise le mode mobile avec détection intelligente
     * Évite les logs redondants en mémorisant l'état précédent
     */
    function initMobileMode() {
      const currentIsMobile = isMobileDevice();

      // Vérifier que document.body existe avant d'y accéder
      if (!document.body) {
        console.warn('[Kraland Mobile] document.body n\'est pas disponible');
        return;
      }

      // Ne log et ne process que si l'état a changé
      if (previousMobileState === currentIsMobile) {
        return; // État inchangé, pas besoin de retraiter
      }

      previousMobileState = currentIsMobile;

      if (currentIsMobile) {
        document.body.classList.add('mobile-mode');
        console.log('[Kraland Mobile] Mode mobile activé');
        // Applique les styles critiques via JavaScript (fix Bootstrap)
        applyMobileCriticalStyles();
      } else {
        document.body.classList.remove('mobile-mode');
        console.log('[Kraland Mobile] Mode desktop');
      }
    }

    /**
     * Applique les styles critiques qui doivent surcharger Bootstrap
     * Cette fonction force les styles inline pour contrer la spécificité CSS de Bootstrap
     */
    function applyMobileCriticalStyles() {
      // Attendre que le DOM soit prêt
      const applyStyles = () => {
        // Retrait padding de toutes les colonnes Bootstrap
        const cols = document.querySelectorAll('[class*="col-"]');
        cols.forEach(col => {
          col.style.setProperty('padding-left', '0px', 'important');
          col.style.setProperty('padding-right', '0px', 'important');
        });

        // Retrait margin des rows
        const rows = document.querySelectorAll('.row');
        rows.forEach(row => {
          row.style.setProperty('margin-left', '0px', 'important');
          row.style.setProperty('margin-right', '0px', 'important');
        });

        // Fix des containers
        const containers = document.querySelectorAll('.container, .container-fluid');
        containers.forEach(container => {
          container.style.setProperty('padding-left', '0px', 'important');
          container.style.setProperty('padding-right', '0px', 'important');
        });

        // Dashboard pleine largeur
        const dashboards = document.querySelectorAll('.dashboard');
        dashboards.forEach(dashboard => {
          dashboard.style.setProperty('margin-left', '0px', 'important');
          dashboard.style.setProperty('margin-right', '0px', 'important');
          dashboard.style.setProperty('width', '100%', 'important');
          dashboard.style.setProperty('padding', '0px', 'important');
        });
      };

      // Applique immédiatement (le MutationObserver de startObservers gérera les ajouts dynamiques)
      applyStyles();
    }

    // Initialisation au chargement
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMobileMode);
    } else {
      initMobileMode();
    }

    // E2 : le mode mobile n'est plus (ré)appliqué au redimensionnement. Le rechargement
    // (checkBreakpointCrossing) s'en charge ; sans lui, des styles inline mobiles resteraient
    // après un aller-retour avec une saisie en cours.

    // === Bascule mobile/desktop : règle unique et symétrique (PLT-01/02/03) ===
    // Les modules (barre d'onglets, mini-profil, styles inline...) ne se construisent
    // qu'au chargement : au franchissement du seuil, dans un sens comme dans l'autre,
    // on recharge la page (défilement restauré), sauf si une saisie est en cours.
    const RELOAD_KEY = 'kr-breakpoint-reload';
    const RELOAD_MAX_AGE_MS = 15000;
    const RESIZE_SETTLE_MS = 400;
    // G-01 : au tout début du document (bundle @run-at document-start), window.innerWidth vaut la largeur
    // par défaut (980) tant que la meta viewport n'est pas analysée. On ne fixe donc l'état « chargé en mobile/desktop »
    // qu'une fois le <head> analysé (DOMContentLoaded, ou immédiatement si le script s'exécute plus tard) ;
    // avant, aucun franchissement de seuil n'est pris en compte.
    let loadedAsMobile = null;
    // Garde-fou : jamais plus de RELOAD_MAX_COUNT rechargements par fenêtre de RELOAD_WINDOW_MS, ni deux à moins de
    // RELOAD_MIN_GAP_MS d'écart (même si la mesure reste fausse, la page ne peut pas recharger en boucle).
    const RELOAD_LOG_KEY = 'kr-breakpoint-reload-log';
    const RELOAD_WINDOW_MS = 60000;
    const RELOAD_MAX_COUNT = 10;
    const RELOAD_MIN_GAP_MS = 1200;

    function settleLoadedState() {
      if (loadedAsMobile === null) {
        loadedAsMobile = isMobileDevice();
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', settleLoadedState);
    } else {
      settleLoadedState();
    }

    function readReloadLog() {
      try {
        const log = JSON.parse(sessionStorage.getItem(RELOAD_LOG_KEY) || '[]');
        const now = Date.now();
        return Array.isArray(log) ? log.filter(function (t) { return typeof t === 'number' && now - t >= 0 && now - t < RELOAD_WINDOW_MS; }) : [];
      } catch (_e) { return []; }
    }

    // Sans sessionStorage le plafond ne peut pas être suivi : aucun rechargement automatique (bandeau manuel)
    // (lecture ET écriture : un stockage lisible mais en écriture refusée, QuotaExceededError, ne tiendrait pas le journal)
    const RELOAD_PROBE_KEY = 'kr-breakpoint-probe';
    function reloadStorageAvailable() {
      try {
        sessionStorage.getItem(RELOAD_LOG_KEY);
        // Sonde d'écriture sur une clé dédiée, aussitôt retirée : aucune autre donnée n'est touchée
        sessionStorage.setItem(RELOAD_PROBE_KEY, '1');
        sessionStorage.removeItem(RELOAD_PROBE_KEY);
        return true;
      } catch (_e) { return false; }
    }

    function reloadAllowed() {
      if (!reloadStorageAvailable()) {return false;}
      const log = readReloadLog();
      if (log.length >= RELOAD_MAX_COUNT) {return false;}
      return !log.length || Date.now() - log[log.length - 1] >= RELOAD_MIN_GAP_MS;
    }

    function recordReload() {
      const log = readReloadLog();
      log.push(Date.now());
      try { sessionStorage.setItem(RELOAD_LOG_KEY, JSON.stringify(log)); } catch (_e) { /* sessionStorage indisponible */ }
    }

    function hasPendingInput() {
      const active = document.activeElement;
      if (active && (active.isContentEditable || (active.matches && active.matches('textarea, input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="hidden"])')))) {
        return true;
      }
      const fields = document.querySelectorAll('textarea, input[type="text"], input[type="search"], input[type="email"], input[type="number"], input[type="url"], input[type="tel"]');
      return Array.prototype.some.call(fields, function (field) {
        return field.value !== field.defaultValue;
      });
    }

    const RELOAD_BANNER_TEXT = {
      input: 'La mise en page s\'adaptera au prochain rechargement. Terminez votre saisie avant de recharger. ',
      guard: 'La mise en page s\'adaptera au prochain rechargement. Rechargez la page quand vous le souhaitez. '
    };

    function showReloadBanner(reason) {
      const message = RELOAD_BANNER_TEXT[reason] || RELOAD_BANNER_TEXT.guard;
      const existing = document.getElementById('kr-resize-banner');
      if (existing) {
        const label = existing.querySelector('span');
        if (label && label.textContent !== message) {label.textContent = message;}
        return;
      }
      if (!document.body) {return;}
      const banner = document.createElement('div');
      banner.id = 'kr-resize-banner';
      banner.setAttribute('role', 'status');
      const text = document.createElement('span');
      text.textContent = message;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Recharger';
      button.addEventListener('click', function () {
        reloadKeepingScroll();
      });
      banner.appendChild(text);
      banner.appendChild(button);
      document.body.appendChild(banner);
    }

    function hideReloadBanner() {
      const banner = document.getElementById('kr-resize-banner');
      if (banner) {banner.remove();}
    }

    function reloadKeepingScroll() {
      recordReload();
      try {
        sessionStorage.setItem(RELOAD_KEY, JSON.stringify({
          y: window.scrollY,
          url: location.pathname + location.search,
          at: Date.now()
        }));
      } catch (_e) { /* sessionStorage indisponible : rechargement sans restauration */ }
      location.reload();
    }

    function checkBreakpointCrossing() {
      if (!document.body || loadedAsMobile === null) {return;}
      if (isMobileDevice() === loadedAsMobile) {
        hideReloadBanner();
        return;
      }
      if (hasPendingInput()) {
        showReloadBanner('input');
        return;
      }
      if (!reloadAllowed()) {
        // Garde-fou atteint (ou stockage inaccessible) : pas de rechargement automatique, le joueur décide
        showReloadBanner('guard');
        return;
      }
      reloadKeepingScroll();
    }

    function restoreScrollAfterReload() {
      let saved = null;
      try {
        saved = JSON.parse(sessionStorage.getItem(RELOAD_KEY) || 'null');
        sessionStorage.removeItem(RELOAD_KEY);
      } catch (_e) { return; }
      if (!saved || Date.now() - saved.at > RELOAD_MAX_AGE_MS || saved.url !== location.pathname + location.search) {return;}
      // Le contenu s'allonge pendant l'initialisation des modules : plusieurs tentatives
      [0, 150, 400, 900, 1800].forEach(function (delay) {
        setTimeout(function () {
          window.scrollTo(0, saved.y);
        }, delay);
      });
    }

    ResizeManager.add(checkBreakpointCrossing, RESIZE_SETTLE_MS);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', restoreScrollAfterReload);
    } else {
      restoreScrollAfterReload();
    }

    // Export global pour debug
    window.KralandMobile = {
      isMobile: isMobileDevice,
      reinit: initMobileMode
    };

    // === Classe page-type basée sur l'URL ===
    // Utilisée en CSS pour scoper les règles kramail vs forum
    function addPageTypeClass() {
      if (!document.body) {return;}
      const path = window.location.pathname;
      if (path.includes('/kramail')) {
        document.body.classList.add('page-kramail');
        if (path.match(/\/kramail\/post\/nouveau/)) {
          document.body.classList.add('page-kramail-compose');
        }
      } else if (path.startsWith('/forum/')) {
        document.body.classList.add('page-forum');
      } else if (path === '/' || path === '/accueil') {
        document.body.classList.add('page-accueil');
      } else if (path.startsWith('/monde/evenements')) {
        document.body.classList.add('page-evenements');
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addPageTypeClass);
    } else {
      addPageTypeClass();
    }
  })();

  // Redirection : pages index vides (/regles, /monde)
  (function () {
    'use strict';
    var redirects = {
      '/regles': '/regles/avancees',
      '/monde': '/monde/evenements'
    };
    if (redirects[window.location.pathname]) {
      window.location.replace(redirects[window.location.pathname]);
    }
  })();

  // ============================================================================
  // FIX - NAVBAR PADDING (pages avec sous-navigation map)
  // ============================================================================
  // Sur les pages /map/*, la navbar a 2 lignes (logo + sous-nav) qui débordent
  // au-delà du max-height CSS. Ce module ajuste le padding-top du body.
  (function () {
    // E1 : recalculé au chargement ET à chaque redimensionnement (anti-rebond), car la
    // hauteur de barre dépend de la largeur (60 px < 992, 106 à 206 px de 992 à 1359).
    function applyNavbarPadding() {
      var nav = document.querySelector('nav.navbar');
      if (!nav || !document.body) {return;}

      // 1. Repartir de la hauteur déterminée par la feuille de style
      nav.style.removeProperty('max-height');
      document.body.style.removeProperty('padding-top');

      // 2. Mode compact / burger (< 992 px) : la feuille de style fixe la barre à 60 px
      if (isMobileMode() || window.innerWidth < 992) {return;}

      // 3. Remesurer la position basse réelle des éléments visibles de la navbar
      var items = nav.querySelectorAll('.navbar-nav > li');
      var maxBottom = 0;
      for (var i = 0; i < items.length; i++) {
        var rect = items[i].getBoundingClientRect();
        if (rect.height > 0 && rect.bottom > maxBottom) {
          maxBottom = rect.bottom;
        }
      }

      // Si les éléments débordent du navbar, ajuster la hauteur et le padding
      var navHeight = nav.offsetHeight;
      if (maxBottom > navHeight + 5) {
        var newHeight = Math.ceil(maxBottom) + 5;
        nav.style.setProperty('max-height', newHeight + 'px', 'important');
        // Le body réserve exactement la hauteur réelle de la barre
        document.body.style.setProperty('padding-top', Math.ceil(nav.getBoundingClientRect().height) + 'px', 'important');
      }
    }

    function fixNavbarPadding() {
      // Attendre que le CSS soit appliqué (chargé de manière asynchrone en mode dev)
      requestAnimationFrame(function () {
        setTimeout(applyNavbarPadding, 200);
      });
    }

    InitQueue.register('fixNavbarPadding', fixNavbarPadding, 3);
    ResizeManager.add(applyNavbarPadding, 150);

    // E6 : Échap referme le panneau du menu (burger)
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') {return;}
      var panel = document.querySelector('nav.navbar .navbar-collapse.in');
      var toggle = document.querySelector('nav.navbar .navbar-toggle');
      if (panel && toggle) {
        toggle.click();
        toggle.focus();
      }
    });
  })();

  // ============================================================================
  // TASK-1.2 - HEADER RESPONSIVE (Bootstrap 3)
  // ============================================================================
  (function () {
    /**
     * Initialise le comportement mobile du header Bootstrap 3
     * Utilise les composants natifs .navbar-toggle et .navbar-collapse
     */
    function initMobileHeader() {
      if (!document.body.classList.contains('mobile-mode')) {return;}

      // Vérifier que Bootstrap JS est chargé
      if (typeof jQuery === 'undefined' || typeof jQuery.fn.collapse === 'undefined') {
        console.warn('[Mobile Header] Bootstrap JS non chargé, utilisation du fallback');
        initFallbackToggle();
        return;
      }

      // Bootstrap 3 gère automatiquement le toggle via data-toggle="collapse"
      // On s'assure juste que le markup est correct

      const toggle = document.querySelector('.navbar-toggle');
      const collapse = document.querySelector('.navbar-collapse');

      if (!toggle || !collapse) {
        console.log('[Mobile Header] Éléments navbar-toggle ou navbar-collapse non trouvés');
        return;
      }

      // Vérifier/ajouter les attributs data nécessaires pour BS3
      if (!toggle.getAttribute('data-toggle')) {
        toggle.setAttribute('data-toggle', 'collapse');
      }
      if (!toggle.getAttribute('data-target')) {
        const collapseId = collapse.id || 'navbar-collapse-mobile';
        collapse.id = collapseId;
        toggle.setAttribute('data-target', '#' + collapseId);
      }

      // Auto-close menu au clic sur un lien
      initMenuAutoClose();

      console.log('[Mobile Header] Header Bootstrap 3 initialisé');
    }

    /**
     * Fallback manuel si Bootstrap JS n'est pas disponible
     */
    function initFallbackToggle() {
      const toggle = document.querySelector('.navbar-toggle');
      const collapse = document.querySelector('.navbar-collapse');

      if (!toggle || !collapse) {return;}

      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        collapse.classList.toggle('in');

        const expanded = collapse.classList.contains('in');
        toggle.setAttribute('aria-expanded', expanded);

        // Gestion du scroll
        if (expanded) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });

      console.log('[Mobile Header] Fallback toggle initialisé');
    }

    /**
     * Ferme le menu au clic sur un lien
     */
    function initMenuAutoClose() {
      const collapse = document.querySelector('.navbar-collapse');
      if (!collapse) {return;}

      const links = collapse.querySelectorAll('a:not(.dropdown-toggle)');
      links.forEach(link => {
        link.addEventListener('click', function () {
          // Fermer le menu après un court délai
          setTimeout(() => {
            if (typeof jQuery !== 'undefined' && jQuery.fn.collapse) {
              jQuery(collapse).collapse('hide');
            } else {
              collapse.classList.remove('in');
              document.body.style.overflow = '';
            }
          }, 150);
        });
      });
    }

    // Enregistrer dans la queue d'initialisation mobile (priorité 10)
    InitQueue.register('initMobileHeader', initMobileHeader, 10);

    // Export pour debug
    if (window.KralandMobile) {
      window.KralandMobile.reinitHeader = initMobileHeader;
    }
  })();


  // ============================================================================
  // TASK-2.4 - DÉPLACER BOUTONS DANS HEADER MOBILE
  // ============================================================================
  (function () {
    'use strict';

    /**
     * Déplace les boutons notification, kramail, palette, profil et carte dans le header mobile
     * - Notification, Kramail et Palette à gauche du hamburger
     * - Profil et Carte à droite du header
     */
    function moveHeaderButtons() {
      if (!document.body.classList.contains('mobile-mode')) {return;}

      const navbarHeader = document.querySelector('.navbar-header');
      const navRight = document.querySelector('.navbar-right');

      if (!navbarHeader || !navRight) {
        console.log('[Mobile Header Buttons] Éléments non trouvés');
        return;
      }

      // Identifier les boutons
      const allButtons = Array.from(navRight.querySelectorAll('li'));

      // Trouver les boutons spécifiques par leur icône
      const notificationBtn = allButtons.find(li => {
        const icon = li.querySelector('.fa-bell');
        return icon && !li.querySelector('.dropdown-menu');
      });

      const kramailBtn = allButtons.find(li => {
        const icon = li.querySelector('.fa-envelope');
        return icon && !li.querySelector('.dropdown-menu');
      });

      const mapBtn = allButtons.find(li => {
        const icon = li.querySelector('.fa-globe');
        return icon && !li.querySelector('.dropdown-menu');
      });

      if (!notificationBtn && !kramailBtn && !mapBtn) {
        console.log('[Mobile Header Buttons] Aucun bouton trouvé');
        return;
      }

      // Vérifier si déjà déplacés
      if (notificationBtn && notificationBtn.hasAttribute('data-moved-to-header')) {
        return;
      }

      // Créer le conteneur pour tous les boutons (à gauche)
      const leftButtonsContainer = document.createElement('div');
      leftButtonsContainer.className = 'navbar-header-buttons-left';

      if (notificationBtn) {
        notificationBtn.setAttribute('data-moved-to-header', 'true');
        leftButtonsContainer.appendChild(notificationBtn.cloneNode(true));
      }

      if (kramailBtn) {
        kramailBtn.setAttribute('data-moved-to-header', 'true');
        leftButtonsContainer.appendChild(kramailBtn.cloneNode(true));
      }

      if (mapBtn) {
        mapBtn.setAttribute('data-moved-to-header', 'true');
        leftButtonsContainer.appendChild(mapBtn.cloneNode(true));
      }

      // Insérer le conteneur dans le header
      if (leftButtonsContainer.children.length > 0) {
        navbarHeader.insertBefore(leftButtonsContainer, navbarHeader.firstChild);
      }

      // Cacher le logo en mobile
      const navbarBrand = document.querySelector('.navbar-brand');
      if (navbarBrand) {
        navbarBrand.style.display = 'none';
      }

      console.log('[Mobile Header Buttons] Boutons déplacés (notification, kramail, map)');
    }

    // Enregistrer dans la queue d'initialisation mobile (priorité 20)
    InitQueue.register('moveHeaderButtons', moveHeaderButtons, 20);
  })();

  // ============================================================================
  // TASK-2.5 - DÉPLACER LE LOGO AU-DESSUS DU BLOC Bienvenue
  // ============================================================================
  (function () {
    'use strict';

    /**
     * [DÉSACTIVÉ] Le logo reste maintenant dans la navbar à gauche
     * Ancienne fonction qui déplaçait le logo sous la navbar
     */
    /*
    function moveLogoToWelcomeBlock() {
      if (!document.body.classList.contains('mobile-mode')) return;

      // Trouver le logo
      const logo = document.querySelector('.navbar-brand');
      if (!logo) {
        console.log('[Mobile Logo] Logo non trouvé');
        return;
      }

      // Vérifier si déjà déplacé
      if (document.querySelector('[data-moved-below-navbar]')) {
        return;
      }

      // Trouver la navbar
      const navbar = document.querySelector('.navbar');
      if (!navbar) {
        console.log('[Mobile Logo] Navbar non trouvée');
        return;
      }

      // Cloner le logo et le rendre visible
      const logoClone = logo.cloneNode(true);
      logoClone.style.display = 'flex';
      logoClone.setAttribute('data-moved-below-navbar', 'true');

      // Insérer le logo juste après la navbar
      if (navbar.parentElement) {
        navbar.parentElement.insertBefore(logoClone, navbar.nextSibling);
      }

      console.log('[Mobile Logo] Logo déplacé sous la navbar');
    }

    // Initialiser au chargement du DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(moveLogoToWelcomeBlock, 200);
      });
    } else {
      setTimeout(moveLogoToWelcomeBlock, 200);
    }
    */
  })();

  // ============================================
  // TASK-1.4 - MINI-PROFIL COLLAPSIBLE
  // ============================================

  (function () {
    'use strict';

    /**
     * Extrait les données d'une jauge (valeur/max)
     */
    function extractGaugeData(element, type) {
      const text = element.textContent;
      const match = text.match(/(\d+)\s*\/\s*(\d+)|(\d+)\s+\/\s+(\d+)/);

      if (!match) {
        // Chercher juste le nombre si pas de format complet
        const numMatch = text.match(/\d+/);
        if (numMatch) {
          const val = parseInt(numMatch[0]);
          return { type, current: val, max: val, percent: 100 };
        }
        return { type, current: 0, max: 1, percent: 0 };
      }

      const current = parseInt(match[1] || match[3]);
      const max = parseInt(match[2] || match[4]);
      const percent = Math.min(100, (current / max) * 100);

      return { type, current, max, percent };
    }

    /**
     * Trouve les données du profil joueur
     */
    function findProfileData() {
      // Container principal
      const profileSection = document.getElementById('player-header-section');
      const mainPanel = document.getElementById('player-main-panel');

      if (!profileSection || !mainPanel) {
        console.warn('[Mobile Mini-Profile] Sections profil non trouvées');
        return null;
      }

      // Nom du joueur — valeur fixe car le sélecteur .list-group-item.active
      // retourne l'onglet de navigation actif (ex: "Employés") au lieu du nom
      const playerName = 'Personnage';

      // Avatar (dans la première row)
      const avatarLink = mainPanel.querySelector('.btn.alert100 img, a[href*="perso"] img, img[src*="avatar"]');
      const avatarSrc = avatarLink ? avatarLink.src : null;

      // Argent (chercher div.mini.t avec icône fa-coins)
      let moneyElement = null;
      const moneyContainers = document.querySelectorAll('div.mini.t');
      for (const container of moneyContainers) {
        if (container.querySelector('i.fa.fa-coins')) {
          moneyElement = container;
          break;
        }
      }
      const money = moneyElement ? moneyElement.textContent.trim() : '0 FK';

      // Horloge (dans player-vitals-section)
      const vitalsSection = document.getElementById('player-vitals-section');
      const clockElement = vitalsSection ? vitalsSection.querySelector('.c100') : null;
      const clock = clockElement ? clockElement.textContent.trim() : '--:--';

      // Jauges PV/PM/PP - Nouvelle approche
      // Chercher les éléments contenant "PV", "PM", "PP" avec leur valeur
      const findGaugeInSection = (section, type) => {
        if (!section) {return null;}

        // Chercher l'élément contenant le type (PV, PM, PP)
        const elements = Array.from(section.querySelectorAll('*'));
        const gaugeEl = elements.find(el => {
          const text = el.textContent.trim();
          const hasType = text.startsWith(type) || text.includes(` ${type} `);
          const hasNumber = /\d+/.test(text);
          return hasType && hasNumber && el.children.length <= 2;
        });

        if (!gaugeEl) {return null;}

        // Extraire la valeur actuelle et max
        const text = gaugeEl.textContent.trim();
        const match = text.match(/(\d+)\s*\/\s*(\d+)/);

        if (match) {
          // Format "27 / 27"
          return extractGaugeData(gaugeEl, type.toLowerCase());
        } else {
          // Format "PV 27" sans max - chercher la barre de progression pour le max
          const valueMatch = text.match(/\d+/);
          if (!valueMatch) {return null;}

          const current = parseInt(valueMatch[0]);

          // Chercher la barre de progression associée
          const progressBar = gaugeEl.querySelector('.progress-bar, [class*="bar"]');
          let max = current; // Par défaut, considérer que c'est plein

          if (progressBar) {
            const width = progressBar.style.width;
            if (width && width.includes('%')) {
              const percent = parseInt(width);
              if (percent > 0) {
                max = Math.round(current * 100 / percent);
              }
            }
          }

          const percent = max > 0 ? Math.min(100, (current / max) * 100) : 0;
          return { type: type.toLowerCase(), current, max, percent };
        }
      };

      // PLT-07 : le DOM natif fait foi (valeur + écart au max). L'ancienne lecture (qui confondait
      // maximum et valeur) ne sert que de secours, sans segment « écart au max » (rest: null).
      const legacyGauge = (section, type) => {
        const g = findGaugeInSection(section, type);
        return g ? { type: g.type, current: g.current, rest: null, percent: g.percent, restPercent: 0 } : null;
      };
      const gaugesPV = readNativeGauge('pv') || legacyGauge(vitalsSection, 'PV');
      const gaugesPM = readNativeGauge('pm') || legacyGauge(vitalsSection, 'PM');
      const gaugesPP = readNativeGauge('pp') || legacyGauge(vitalsSection, 'PP');

      return {
        name: playerName,
        avatar: avatarSrc,
        money: money,
        clock: clock,
        gauges: {
          pv: gaugesPV,
          pm: gaugesPM,
          pp: gaugesPP
        }
      };
    }

    /**
     * Crée le mini-profil mobile
     */
    function createMiniProfile() {
      if (!document.body.classList.contains('mobile-mode')) {return;}
      if (document.querySelector('.mobile-mini-profile')) {return;}

      const profileData = findProfileData();
      if (!profileData) {
        console.warn('[Mobile Mini-Profile] Données profil non trouvées');
        return;
      }

      // Container principal
      const miniProfile = document.createElement('div');
      miniProfile.className = 'mobile-mini-profile collapsed';
      miniProfile.setAttribute('data-task', '1.4');

      // Header (toujours visible)
      const header = document.createElement('div');
      header.className = 'mobile-mini-profile-header';

      if (profileData.avatar) {
        const avatar = document.createElement('img');
        avatar.src = profileData.avatar;
        avatar.className = 'avatar';
        avatar.alt = 'Avatar';
        header.appendChild(avatar);
      }

      const info = document.createElement('div');
      info.className = 'mobile-mini-profile-info';

      const nameRow = document.createElement('div');
      nameRow.className = 'mobile-mini-profile-name-row';

      const name = document.createElement('div');
      name.className = 'mobile-mini-profile-name';
      name.textContent = profileData.name;
      nameRow.appendChild(name);

      // Bouton Gestion du personnage
      const manageBtn = document.createElement('a');
      manageBtn.href = '#';
      manageBtn.className = 'btn btn-default alert100 mobile-mini-profile-manage-btn';
      manageBtn.innerHTML = '<span>⚙️</span>';
      manageBtn.setAttribute('data-toggle', 'tooltip');
      manageBtn.setAttribute('data-placement', 'bottom');
      manageBtn.setAttribute('title', 'Gestion du personnage');
      nameRow.appendChild(manageBtn);

      info.appendChild(nameRow);

      const moneyRow = document.createElement('div');
      moneyRow.className = 'mobile-mini-profile-money';
      moneyRow.innerHTML = `
        <span>${profileData.money}</span>
        <span class="mobile-mini-profile-clock">⏱️ ${profileData.clock}</span>
      `;
      info.appendChild(moneyRow);

      header.appendChild(info);

      // Chevron indicateur expand/collapse
      const chevron = document.createElement('i');
      chevron.className = 'fa fa-chevron-down mobile-mini-profile-chevron';
      header.appendChild(chevron);

      miniProfile.appendChild(header);

      // Jauges compactes (toujours visibles)
      const gaugesCompact = document.createElement('div');
      gaugesCompact.className = 'mobile-mini-profile-gauges-compact';

      ['pv', 'pm', 'pp'].forEach(type => {
        const gauge = profileData.gauges[type];
        if (!gauge) {return;}

        const el = document.createElement('div');
        el.className = 'mobile-gauge-compact';
        el.title = describeGauge(gauge);
        el.innerHTML = `
          <span class="mobile-gauge-compact-label">${type.toUpperCase()}</span>
          <div class="mobile-gauge-compact-bar">
            <div class="mobile-gauge-compact-fill ${type}" style="width: ${gauge.percent}%"></div>
            <div class="mobile-gauge-compact-rest" style="left: ${gauge.percent}%; width: ${gauge.restPercent}%"></div>
          </div>
          <span class="mobile-gauge-compact-value">${gauge.current}</span>
        `;
        gaugesCompact.appendChild(el);
      });

      miniProfile.appendChild(gaugesCompact);

      // Détails (masqués par défaut)
      const details = document.createElement('div');
      details.className = 'mobile-mini-profile-details';

      // Jauges détaillées
      const gaugesFull = document.createElement('div');
      gaugesFull.className = 'mobile-mini-profile-gauges-full';

      ['pv', 'pm', 'pp'].forEach(type => {
        const gauge = profileData.gauges[type];
        if (!gauge) {return;}

        const el = document.createElement('div');
        el.className = 'mobile-gauge-full';
        el.title = describeGauge(gauge);
        const restText = gauge.rest !== null ? ` · écart au max ${gauge.rest}` : '';
        el.innerHTML = `
          <div class="mobile-gauge-full-header">
            <span>${type.toUpperCase()}</span>
            <span>${gauge.current}${restText}</span>
          </div>
          <div class="mobile-gauge-full-bar">
            <div class="mobile-gauge-full-fill ${type}" style="width: ${gauge.percent}%"></div>
            <div class="mobile-gauge-full-rest" style="left: ${gauge.percent}%; width: ${gauge.restPercent}%"></div>
          </div>
        `;
        gaugesFull.appendChild(el);
      });

      const gaugesLegend = document.createElement('div');
      gaugesLegend.className = 'kr-gauge-legend';
      gaugesLegend.innerHTML = '<span class="kr-gauge-legend-item"><i class="kr-gauge-legend-swatch value"></i>valeur</span>' +
        '<span class="kr-gauge-legend-item"><i class="kr-gauge-legend-swatch rest"></i>écart au maximum</span>';
      gaugesFull.appendChild(gaugesLegend);

      details.appendChild(gaugesFull);

      // Caractéristiques (FOR, VOL, CHA, GES, INT, PER)
      const characteristicsContainer = document.createElement('div');
      characteristicsContainer.className = 'mobile-mini-profile-characteristics';

      const statsSection = document.getElementById('col-leftest-stats');
      if (statsSection) {
        // Chercher les 6 premières caractéristiques (alert121 à alert126)
        const charElements = [];
        for (let i = 121; i <= 126; i++) {
          const char = statsSection.querySelector(`.alert${i}`);
          if (char) {
            charElements.push(char);
          }
        }

        if (charElements.length > 0) {
          charElements.forEach(charEl => {
            const charClone = charEl.cloneNode(true);
            charClone.className = charEl.className + ' mobile-characteristic-badge';
            characteristicsContainer.appendChild(charClone);
          });

          details.appendChild(characteristicsContainer);
        }
      }

      // Compétences
      const skillsContainer = document.createElement('div');
      skillsContainer.className = 'mobile-mini-profile-skills';

      const skillsPanel = document.getElementById('skills-panel');
      if (skillsPanel) {
        // Récupérer toutes les compétences (alert111 à alert1118)
        const skills = skillsPanel.querySelectorAll('.ds_game[class*="alert11"]');

        if (skills.length > 0) {
          skills.forEach(skillEl => {
            const skillClone = skillEl.cloneNode(true);
            skillClone.className = skillEl.className + ' mobile-skill-item';
            skillsContainer.appendChild(skillClone);
          });

          details.appendChild(skillsContainer);
        }
      }

      miniProfile.appendChild(details);

      // Toggle expand/collapse
      miniProfile.addEventListener('click', (e) => {
        // Ne pas toggler si on clique sur un élément interactif (bouton, lien)
        if (e.target.closest('.mobile-mini-profile-avatar-btn, .mobile-characteristic-badge, .mobile-skill-item')) {
          return;
        }

        miniProfile.classList.toggle('collapsed');
        miniProfile.classList.toggle('expanded');

        console.log('[Mobile Mini-Profile] État:',
          miniProfile.classList.contains('expanded') ? 'déplié' : 'replié'
        );
      });

      // Insérer après la navbar (élément préexistant) ou au début du body
      // Note: On utilise .navbar (DOM original) et non .mobile-tab-bar (créé par le script)
      const navbar = document.querySelector('.navbar');
      const container = document.getElementById('content') || document.body;

      if (navbar && navbar.nextSibling) {
        navbar.parentNode.insertBefore(miniProfile, navbar.nextSibling);
      } else {
        container.insertBefore(miniProfile, container.firstChild);
      }

      console.log('[Mobile Mini-Profile] Créé avec succès');
      console.log('  - Nom:', profileData.name);
      console.log('  - Argent:', profileData.money);
      console.log('  - Horloge:', profileData.clock);
      console.log('  - PV:', profileData.gauges.pv ? `${profileData.gauges.pv.current} (écart au max ${profileData.gauges.pv.rest})` : 'N/A');
    }

    /**
     * Initialise le mini-profil
     */
    function initMiniProfile() {
      if (!document.body.classList.contains('mobile-mode')) {return;}

      createMiniProfile();
    }

    // Enregistrer dans la queue d'initialisation mobile (priorité 40 - après tab bar)
    InitQueue.register('initMiniProfile', initMiniProfile, 40);

    // Exposer pour debug
    if (window.KralandMobile) {
      window.KralandMobile.initMiniProfile = initMiniProfile;
    }
  })();

  // ============================================
  // TASK-1.5 - ACTIONS RAPIDES HORIZONTALES (Bootstrap 3)
  // ============================================

  (function () {
    'use strict';

    /**
     * Crée la barre d'actions rapides mobile avec Bootstrap 3
     */
    function createQuickActions() {
      if (!document.body.classList.contains('mobile-mode')) {return;}
      if (document.querySelector('.mobile-quick-actions')) {return;}

      // Vérifier qu'on est bien sur une page /jouer/*
      if (!window.location.pathname.startsWith('/jouer/')) {
        return;
      }

      // Trouver la section actions originale
      const actionsSection = document.getElementById('player-actions-section');
      if (!actionsSection) {
        console.warn('[Mobile Quick Actions] Section actions non trouvée');
        return;
      }

      // Récupérer les boutons originaux
      const originalButtons = actionsSection.querySelectorAll('a.btn, button.btn');
      if (originalButtons.length === 0) {
        console.warn('[Mobile Quick Actions] Aucun bouton trouvé');
        return;
      }

      // Container avec btn-group-justified Bootstrap 3
      const container = document.createElement('div');
      container.className = 'btn-group btn-group-justified mobile-quick-actions';
      container.setAttribute('role', 'group');
      container.setAttribute('data-task', '1.5');

      // Cloner chaque bouton avec structure Bootstrap 3 justified
      originalButtons.forEach((originalBtn) => {
        // Wrapper btn-group requis par BS3 justified
        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        btnGroup.setAttribute('role', 'group');

        // Cloner le bouton
        const btn = originalBtn.cloneNode(true);
        btn.classList.add('mobile-quick-action');

        // Extraire l'icône et le label
        const icon = btn.querySelector('i');
        const label = btn.textContent.trim();

        // Reconstruire le contenu avec structure mobile
        btn.innerHTML = '';

        if (icon) {
          const iconClone = icon.cloneNode(true);
          iconClone.classList.add('mobile-quick-action-icon');
          btn.appendChild(iconClone);
        }

        const labelSpan = document.createElement('span');
        labelSpan.className = 'mobile-quick-action-label';
        labelSpan.textContent = label;
        btn.appendChild(labelSpan);

        btnGroup.appendChild(btn);
        container.appendChild(btnGroup);
      });

      // Insérer après la navbar (élément préexistant)
      // Note: On utilise .navbar (DOM original) et non .mobile-mini-profile/.mobile-tab-bar (créés par le script)
      const navbar = document.querySelector('.navbar');

      if (navbar && navbar.nextSibling) {
        navbar.parentNode.insertBefore(container, navbar.nextSibling);
      } else {
        document.body.insertBefore(container, document.body.firstChild);
      }

      console.log('[Mobile Quick Actions] Créées avec', originalButtons.length, 'actions');
    }

    /**
     * Initialise les actions rapides
     */
    function initQuickActions() {
      if (!document.body.classList.contains('mobile-mode')) {return;}

      createQuickActions();
    }

    // Enregistrer dans la queue d'initialisation mobile (priorité 50 - après mini-profil)
    InitQueue.register('initQuickActions', initQuickActions, 50);

    // Exposer pour debug
    if (window.KralandMobile) {
      window.KralandMobile.initQuickActions = initQuickActions;
    }
  })();

  // ============================================
  // TASK-1.3 - TAB BAR NAVIGATION (Bootstrap 3)
  // ============================================

  (function () {
    'use strict';

    /**
     * Trouve les liens du menu navigation jeu
     */
    function findNavigationLinks() {
      // Patterns à chercher avec icônes Font Awesome
      const patterns = [
        { pattern: '/jouer/plateau', href: '/jouer/plateau', label: 'Agir', icon: 'fa-bolt' },
        { pattern: '/jouer/materiel', href: '/jouer/materiel', label: 'Matériel', icon: 'fa-cube' },
        { pattern: '/jouer/perso', href: '/jouer/perso', label: 'Personnage', icon: 'fa-user' },
        { pattern: '/jouer/bat', href: '/jouer/bat', label: 'Bâtiments', icon: 'fa-home' },
        { pattern: '/jouer/pnj', href: '/jouer/pnj', label: 'Employés', icon: 'fa-users' }
      ];

      const links = [];

      patterns.forEach(item => {
        const link = document.querySelector(`a[href*="${item.pattern}"]`);
        // Créer le lien même s'il n'existe pas sur la page actuelle
        links.push({
          href: link ? link.getAttribute('href') : item.href,
          text: link ? (link.textContent.trim() || item.label) : item.label,
          pattern: item.pattern,
          icon: item.icon
        });
      });

      return links;
    }

    /**
     * Crée la tab bar avec structure Bootstrap 3
     */
    function createTabBar() {
      if (!document.body.classList.contains('mobile-mode')) {return;}
      if (document.querySelector('.mobile-tab-bar')) {return;} // Déjà créé

      // Vérifier qu'on est bien sur une page /jouer/*
      if (!window.location.pathname.startsWith('/jouer/')) {
        return;
      }

      // Trouver les liens
      const navLinks = findNavigationLinks();

      if (navLinks.length === 0) {
        console.warn('[Mobile Tab Bar] Aucun lien de navigation disponible');
        return;
      }

      // Créer la tab bar avec structure Bootstrap 3 (ul.nav.nav-tabs)
      const tabBar = document.createElement('ul');
      tabBar.className = 'nav nav-tabs mobile-tab-bar';
      tabBar.setAttribute('role', 'tablist');

      // Créer les tabs (li > a comme dans BS3) avec icônes + texte
      navLinks.forEach(linkData => {
        const li = document.createElement('li');
        li.setAttribute('role', 'presentation');

        const a = document.createElement('a');
        a.href = linkData.href;
        a.setAttribute('role', 'tab');

        // Créer structure icône + texte
        const icon = document.createElement('i');
        icon.className = `fa ${linkData.icon} mobile-tab-icon`;

        const label = document.createElement('span');
        label.className = 'mobile-tab-label';
        label.textContent = linkData.text;

        a.appendChild(icon);
        a.appendChild(label);

        // Marquer l'onglet actif (classe sur le li comme dans BS3)
        const currentPath = window.location.pathname;
        if (currentPath.includes(linkData.pattern)) {
          li.classList.add('active');
          a.setAttribute('aria-selected', 'true');
        } else {
          a.setAttribute('aria-selected', 'false');
        }

        li.appendChild(a);
        tabBar.appendChild(li);
      });

      // Insérer après le header
      const header = document.querySelector('.navbar') ||
                     document.querySelector('header') ||
                     document.body.firstElementChild;

      if (header && header.nextSibling) {
        header.parentNode.insertBefore(tabBar, header.nextSibling);
      } else {
        document.body.insertBefore(tabBar, document.body.firstChild);
      }

      // Gérer l'indicateur de scroll
      handleTabBarScroll(tabBar);

      // Scroll automatique vers l'onglet actif
      setTimeout(() => scrollToActiveTab(tabBar), 100);

      console.log('[Mobile Tab Bar] Créée avec', navLinks.length, 'onglets');
    }

    /**
     * Gère l'indicateur de scroll de la tab bar
     */
    function handleTabBarScroll(tabBar) {
      const checkScroll = () => {
        const isAtEnd = tabBar.scrollLeft + tabBar.clientWidth >= tabBar.scrollWidth - 5;
        tabBar.classList.toggle('scrolled-end', isAtEnd);
      };

      tabBar.addEventListener('scroll', checkScroll, { passive: true });

      // Check initial
      setTimeout(checkScroll, 100);

      // Re-check au resize via le gestionnaire centralisé
      ResizeManager.add(checkScroll, 100);
    }

    /**
     * Scroll automatique vers l'onglet actif
     */
    function scrollToActiveTab(tabBar) {
      const activeTab = tabBar.querySelector('li.active > a');
      if (!activeTab) {return;}

      // Scroll smooth vers l'onglet actif
      const tabBarRect = tabBar.getBoundingClientRect();
      const activeRect = activeTab.getBoundingClientRect();

      const scrollLeft = activeRect.left - tabBarRect.left - (tabBarRect.width / 2) + (activeRect.width / 2);

      tabBar.scrollTo({
        left: tabBar.scrollLeft + scrollLeft,
        behavior: 'smooth'
      });
    }

    /**
     * Initialise la tab bar
     */
    function initTabBar() {
      if (!document.body.classList.contains('mobile-mode')) {return;}

      createTabBar();
    }

    // Ajouter la fonction à l'API globale
    if (window.KralandMobile) {
      window.KralandMobile.initTabBar = initTabBar;
    }

    // Enregistrer dans la queue d'initialisation mobile (priorité 30 - après header buttons)
    InitQueue.register('initTabBar', initTabBar, 30);
  })();

  // ============================================================================
  // TASK-2.1 - MÉMORISATION DES ALERTES FERMÉES
  // ============================================================================
  (function () {
    const STORAGE_KEY = 'kraland_dismissed_alerts';

    /**
     * Génère un hash simple à partir d'une chaîne
     */
    function simpleHash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(36);
    }

    /**
     * Récupère la liste des alertes fermées depuis le localStorage
     * Format : [{id, preview}] — rétrocompatible avec l'ancien format [string]
     */
    function getDismissedAlerts() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {return [];}
        const parsed = JSON.parse(stored);
        // Migration : ancien format (tableau de strings) → nouveau format (tableau d'objets)
        return parsed.map(function (entry) {
          if (typeof entry === 'string') {
            return {id: entry, preview: ''};
          }
          return entry;
        });
      } catch (e) {
        console.warn('[Alerts Memory] Erreur lecture localStorage:', e);
        return [];
      }
    }

    /**
     * Récupère la liste des IDs d'alertes fermées (pour les comparaisons)
     */
    function getDismissedAlertIds() {
      return getDismissedAlerts().map(function (entry) { return entry.id; });
    }

    /**
     * Extrait un aperçu textuel d'une alerte (80 caractères max)
     */
    function getAlertPreview(alert) {
      var text = alert.textContent.trim().replace(/\s+/g, ' ').replace(/^×\s*/, '');
      return text.length > 80 ? text.substring(0, 80) + '…' : text;
    }

    /**
     * Sauvegarde une alerte fermée dans le localStorage
     */
    function saveDismissedAlert(alertId, preview) {
      try {
        var dismissed = getDismissedAlerts();
        var exists = dismissed.some(function (entry) { return entry.id === alertId; });
        if (!exists) {
          dismissed.push({id: alertId, preview: preview || ''});
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed));
          console.log('[Alerts Memory] Alerte mémorisée:', alertId);
        }
      } catch (e) {
        console.warn('[Alerts Memory] Erreur sauvegarde localStorage:', e);
      }
    }

    /**
     * Génère un identifiant unique pour une alerte basé sur son contenu
     */
    function getAlertId(alert) {
      // Essayer d'utiliser un ID existant
      if (alert.id) {return alert.id;}

      // Sinon, créer un hash du contenu texte (sans les espaces multiples)
      const text = alert.textContent.trim().replace(/\s+/g, ' ');
      return 'alert_' + simpleHash(text);
    }

    /**
     * Cache automatiquement les alertes déjà fermées
     */
    function hideRememberedAlerts() {
      const dismissedIds = getDismissedAlertIds();
      if (dismissedIds.length === 0) {return;}

      const alerts = document.querySelectorAll('.alert.alert-dismissible');
      let hiddenCount = 0;

      alerts.forEach(alert => {
        const alertId = getAlertId(alert);
        if (dismissedIds.includes(alertId)) {
          alert.style.display = 'none';
          hiddenCount++;
        }
      });

      if (hiddenCount > 0) {
        console.log(`[Alerts Memory] ${hiddenCount} alerte(s) masquée(s) automatiquement`);
      }
    }

    /**
     * Écoute les fermetures d'alertes et les mémorise
     */
    function watchAlertDismissal() {
      const alerts = document.querySelectorAll('.alert.alert-dismissible');

      alerts.forEach(alert => {
        // Trouver le bouton de fermeture
        const closeBtn = alert.querySelector('.close, [data-dismiss="alert"]');
        if (!closeBtn) {return;}

        // Écouter le clic sur le bouton de fermeture
        closeBtn.addEventListener('click', function () {
          const alertId = getAlertId(alert);
          const preview = getAlertPreview(alert);
          saveDismissedAlert(alertId, preview);
        });
      });

      console.log(`[Alerts Memory] Surveillance activée pour ${alerts.length} alerte(s)`);
    }

    /**
     * Initialise la mémorisation des alertes
     */
    function initAlertsMemory() {
      // D'abord cacher les alertes déjà fermées
      hideRememberedAlerts();

      // Puis surveiller les nouvelles fermetures
      watchAlertDismissal();
    }

    // Initialiser au chargement du DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAlertsMemory);
    } else {
      initAlertsMemory();
    }

    /**
     * Ajoute un bouton de réinitialisation dans la page profil/interface
     */
    function addResetButtonToInterfacePage() {
      // Vérifier qu'on est sur la bonne page
      if (!window.location.pathname.includes('/profil/interface')) {return;}

      // Attendre que le placeholder Alertes soit présent
      const checkForm = setInterval(() => {
        const alertsSection = document.querySelector('#kr-alerts-section');
        if (!alertsSection) {return;}

        clearInterval(checkForm);

        // Créer une section dédiée
        const section = document.createElement('div');
        section.className = 'form-group';

        // Créer le label
        const label = document.createElement('label');
        label.className = 'col-sm-3 control-label';
        label.textContent = 'Mémorisation';

        // Créer le conteneur
        const btnContainer = document.createElement('div');
        btnContainer.className = 'col-sm-9';

        // Conteneur de la liste des alertes masquées
        var alertsList = document.createElement('div');
        alertsList.className = 'kr-dismissed-alerts-list';
        alertsList.style.marginTop = '4px';

        function updateHelpText() {
          var dismissed = getDismissedAlerts();

          // Mettre à jour la liste des alertes masquées
          alertsList.innerHTML = '';
          if (dismissed.length === 0) {return;}

          var list = document.createElement('ul');
          list.style.cssText = 'list-style:none;padding:0;margin:0;font-size:12px;opacity:0.8;';
          dismissed.forEach(function (entry) {
            var li = document.createElement('li');
            li.style.cssText = 'padding:3px 0;border-bottom:1px solid rgba(128,128,128,0.15);display:flex;align-items:center;gap:6px;';

            var restoreBtn = document.createElement('button');
            restoreBtn.type = 'button';
            restoreBtn.className = 'btn btn-xs btn-default';
            restoreBtn.style.cssText = 'padding:1px 5px;font-size:11px;line-height:1.4;flex-shrink:0;';
            restoreBtn.innerHTML = '<span class="glyphicon glyphicon-eye-open"></span>';
            restoreBtn.title = 'Réafficher cette alerte';
            restoreBtn.addEventListener('click', function () {
              var current = getDismissedAlerts();
              var filtered = current.filter(function (e) { return e.id !== entry.id; });
              localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
              updateHelpText();
            });

            var text = document.createElement('span');
            text.textContent = '- ' + (entry.preview || '(aperçu non disponible)');

            li.appendChild(restoreBtn);
            li.appendChild(text);
            list.appendChild(li);
          });
          alertsList.appendChild(list);
        }

        // Initialiser la liste
        updateHelpText();

        // Assembler la section
        btnContainer.appendChild(alertsList);
        section.appendChild(label);
        section.appendChild(btnContainer);

        // Insérer dans le placeholder Alertes
        alertsSection.appendChild(section);

        console.log('[Alerts Memory] Section mémorisation ajoutée');
      }, 100);
    }

    // Initialiser au chargement du DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAlertsMemory);
      document.addEventListener('DOMContentLoaded', addResetButtonToInterfacePage);
    } else {
      initAlertsMemory();
      addResetButtonToInterfacePage();
    }

    // Exposer une fonction pour réinitialiser (debug)
    if (window.KralandMobile) {
      window.KralandMobile.clearDismissedAlerts = function () {
        localStorage.removeItem(STORAGE_KEY);
        console.log('[Alerts Memory] Alertes mémorisées effacées');
      };
    }
  })();

  // ============================================================================
  // TASK-2.3 - MESSAGE DE BIENVENUE SUR PAGE D'ACCUEIL
  // ============================================================================
  (function () {
    'use strict';

    /**
     * Ajoute "Bienvenue " avant le nom de l'utilisateur sur la page d'accueil
     */
    function addWelcomeMessage() {
      // Vérifier qu'on est sur la page d'accueil
      const path = window.location.pathname;
      if (path !== '/' && path !== '/accueil' && !path.startsWith('/accueil')) {
        return;
      }

      // Chercher le h4 qui contient le nom de l'utilisateur
      // C'est un h4.list-group-item-heading.count qui n'est pas un nombre
      const allH4 = Array.from(document.querySelectorAll('h4.list-group-item-heading.count'));
      const userNameH4 = allH4.find(h4 => {
        const text = h4.textContent.trim();
        // Le nom d'utilisateur n'est pas un nombre
        return !/^\d+$/.test(text) && text.length > 0;
      });

      if (!userNameH4) {
        console.log('[Welcome Message] Nom d\'utilisateur non trouvé');
        return;
      }

      const userName = userNameH4.textContent.trim();

      // Vérifier que "Bienvenue" n'est pas déjà présent
      if (userName.startsWith('Bienvenue')) {
        return;
      }

      // Ajouter "Bienvenue " avant le nom en préservant les smileys <img>
      var nameFragment = cloneVisibleContent(userNameH4);
      userNameH4.textContent = '';
      userNameH4.appendChild(document.createTextNode('Bienvenue '));
      userNameH4.appendChild(nameFragment);

      console.log('[Welcome Message] Message de Bienvenue ajouté pour:', userName);
    }

    // Initialiser au chargement du DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addWelcomeMessage);
    } else {
      addWelcomeMessage();
    }
  })();

  // ============================================================================
  // ACCUEIL - AMÉLIORATION COLONNE DROITE
  // Supprime les <hr>, ajoute un bouton "Jouer", et wrappe la section Forum
  // ============================================================================
  InitQueue.register('Homepage:RightColumn', function enhanceHomeRightColumn() {
    if (!document.body.classList.contains('page-accueil')) {return;}

    var rightCol = document.querySelector('.container > .row > .col-md-3:last-child');
    if (!rightCol) {return;}

    // Supprimer les <hr> superflus
    var hrs = rightCol.querySelectorAll('hr');
    for (var i = 0; i < hrs.length; i++) {
      hrs[i].remove();
    }

    // Ajouter bouton "Jouer" après .ds_user
    var dsUser = rightCol.querySelector('.ds_user');
    if (dsUser) {
      var playBtn = document.createElement('a');
      playBtn.href = '/jouer/plateau';
      playBtn.className = 'accueil-play-btn';
      playBtn.innerHTML = '<i class="fa fa-play"></i> Jouer';
      dsUser.insertAdjacentElement('afterend', playBtn);
    }

    // Wrapper les éléments forum dans un conteneur
    // Cibler le h4 "Forum" (enfant direct) et non le h4 du nom d'utilisateur (dans .ds_user)
    var forumTitle = rightCol.querySelector(':scope > h4');
    var forumLinks = rightCol.querySelectorAll(':scope > .ds_forum');
    if (forumTitle && forumLinks.length) {
      var wrapper = document.createElement('div');
      wrapper.className = 'accueil-forum-section';
      forumTitle.parentNode.insertBefore(wrapper, forumTitle);
      wrapper.appendChild(forumTitle);
      for (var j = 0; j < forumLinks.length; j++) {
        wrapper.appendChild(forumLinks[j]);
      }
    }

    console.log('[Homepage:RightColumn] Colonne droite améliorée');
  }, 85);

  // ============================================================================
  // TASK-2.2 - ACCORDÉON GROUPES (Base)
  // ============================================================================
  (function () {
    /**
     * Transforme les sections de groupes en accordéon collapsible
     * Structure DOM identifiée :
     * - .dashboard-section : Container de chaque groupe
     * - .dashboard-section-mygroup : Mon groupe (toujours visible)
     * - .dashboard-section-header : Header avec titre du groupe
     * - .dashboard-group-title : Nom du leader
     * - .dashboard-cards-grid : Grille des membres (à masquer/afficher)
     */

    /**
     * Rend un groupe collapsible
     */
    function makeGroupCollapsible(section, isMyGroup) {
      const header = section.querySelector('.dashboard-section-header');
      const cardsGrid = section.querySelector('.dashboard-cards-grid');

      if (!header || !cardsGrid) {return;}

      // Ajouter la classe accordion au header
      header.classList.add('dashboard-section-header-accordion');

      // État initial : mon groupe ouvert, autres fermés
      const isExpanded = isMyGroup;
      cardsGrid.classList.toggle('collapsed', !isExpanded);
      header.classList.toggle('expanded', isExpanded);

      // Ajouter l'icône d'expansion
      const icon = document.createElement('i');
      icon.className = 'fa fa-chevron-down accordion-icon';
      header.appendChild(icon);

      // Gérer le clic (et le clavier : Entrée / Espace sur l'en-tête focalisé)
      header.style.cursor = 'pointer';
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.setAttribute('aria-expanded', String(isExpanded));

      const toggleGroup = () => {
        const isNowExpanded = !cardsGrid.classList.contains('collapsed');
        cardsGrid.classList.toggle('collapsed', isNowExpanded);
        header.classList.toggle('expanded', !isNowExpanded);
        header.setAttribute('aria-expanded', String(!isNowExpanded));

        console.log('[Group Accordion]',
          section.querySelector('.dashboard-group-title')?.textContent,
          isNowExpanded ? 'collapsed' : 'expanded'
        );
      };

      header.addEventListener('click', (e) => {
        // Ne pas intercepter les clics sur les boutons d'action
        if (e.target.closest('.dashboard-group-buttons')) {return;}
        toggleGroup();
      });

      header.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') {return;}
        // Les boutons d'action du groupe gardent leur propre comportement clavier
        if (e.target.closest('.dashboard-group-buttons')) {return;}
        e.preventDefault();
        toggleGroup();
      });

      console.log('[Group Accordion] Groupe configuré:',
        section.querySelector('.dashboard-group-title')?.textContent,
        'état initial:', isExpanded ? 'ouvert' : 'fermé'
      );
    }

    /**
     * Initialise l'accordéon pour tous les groupes
     */
    function initGroupsAccordion() {
      if (!document.body.classList.contains('mobile-mode')) {return;}

      const sections = document.querySelectorAll('.dashboard-section');
      let count = 0;

      sections.forEach(section => {
        const header = section.querySelector('.dashboard-section-header');
        const title = section.querySelector('.dashboard-group-title');

        // Vérifier que c'est bien un groupe (a un header avec titre)
        if (header && title) {
          const isMyGroup = section.classList.contains('dashboard-section-mygroup');
          makeGroupCollapsible(section, isMyGroup);
          count++;
        }
      });

      console.log('[Groups Accordion] Initialisé pour', count, 'groupes');
    }

    // Ajouter la fonction à l'API globale
    if (window.KralandMobile) {
      window.KralandMobile.initGroupsAccordion = initGroupsAccordion;
    }

    // Enregistrer dans la queue d'initialisation mobile (priorité 70)
    InitQueue.register('initGroupsAccordion', initGroupsAccordion, 70);
  })();

  // ============================================================================
  // TASK-2.5 : Commerce - Accordéon catégories
  // ============================================================================
  // Enregistrer l'initialisation du Commerce Accordion dans la queue pour éviter l'accès à document.body avant DOMContentLoaded
  InitQueue.register('Commerce Accordion', function initCommerceAccordion() {
    if (!window.location.href.includes('jouer/plateau')) {return;}

    // Trouver le panel Commerce
    var commerceHeader = Array.from(document.querySelectorAll('h3.panel-title')).find(function (h) {
      return h.textContent.trim() === 'Commerce';
    });
    if (!commerceHeader) {return;}

    var commercePanel = commerceHeader.closest('.panel');
    if (!commercePanel) {return;}

    // Détecter dynamiquement les catégories : div.list-group-item.ds_forum avec un h4
    const categoryDivs = [];
    commercePanel.querySelectorAll('div.list-group-item.ds_forum').forEach(div => {
      const h4 = div.querySelector('h4.list-group-item-heading');
      if (h4) {
        categoryDivs.push({
          name: h4.textContent.trim(),
          div: div,
          h4: h4
        });
      }
    });

    if (categoryDivs.length === 0) {return;}

    console.log(`[Commerce Accordion] Trouvé ${categoryDivs.length} catégories`);

    // Pour chaque catégorie, trouver ses produits (les <a> qui suivent jusqu'à la prochaine catégorie)
    categoryDivs.forEach((category, index) => {
      const products = [];
      let currentElement = category.div.nextElementSibling;

      // Parcourir les éléments suivants jusqu'à la prochaine catégorie
      while (currentElement) {
        // Vérifier que l'élément a bien une propriété classList (éléments HTML uniquement)
        if (!currentElement.classList) {
          currentElement = currentElement.nextElementSibling;
          continue;
        }

        // Si on trouve une autre catégorie, on s'arrête
        if (currentElement.classList.contains('ds_forum') &&
            currentElement.querySelector('h4.list-group-item-heading')) {
          break;
        }

        // Si c'est un produit (lien avec classe ds_game)
        if (currentElement.tagName === 'A' && currentElement.classList.contains('ds_game')) {
          products.push(currentElement);
        }

        currentElement = currentElement.nextElementSibling;
      }

      // Créer un conteneur pour les produits
      const productsContainer = document.createElement('div');
      productsContainer.className = 'commerce-products-container';

      // Déplacer les produits dans le conteneur
      products.forEach(product => {
        productsContainer.appendChild(product);
      });

      // Vérifier que le div de catégorie a bien un parent et que les éléments existent
      if (!category.div || !category.div.parentElement || !category.h4) {
        console.warn(`[Commerce Accordion] ${category.name}: éléments manquants`);
        return;
      }

      // Insérer le conteneur après le div de catégorie
      category.div.parentElement.insertBefore(productsContainer, category.div.nextSibling);

      // Ajouter la classe accordion au div de catégorie
      category.div.classList.add('commerce-category-header');

      // État initial : sur desktop toujours ouvert, sur mobile plié sauf option ou 1ère catégorie
      const isExpanded = !isMobileMode() || isCommerceExpandedEnabled() || index === 0;
      if (!isExpanded) {
        productsContainer.classList.add('collapsed');
        category.div.classList.add('collapsed');
      } else {
        category.div.classList.add('expanded');
      }

      // Ajouter l'icône chevron
      const icon = document.createElement('i');
      icon.className = 'fa fa-chevron-down accordion-icon';

      // Vérification de sécurité avant d'ajouter l'icône
      if (category.h4 && category.h4.appendChild) {
        category.h4.appendChild(icon);
      }

      // Ajouter le gestionnaire de clic
      category.div.style.cursor = 'pointer';
      category.div.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isNowExpanded = !productsContainer.classList.contains('collapsed');
        productsContainer.classList.toggle('collapsed', isNowExpanded);
        category.div.classList.toggle('collapsed', isNowExpanded);
        category.div.classList.toggle('expanded', !isNowExpanded);

        console.log(`[Commerce Accordion] ${category.name}: ${isNowExpanded ? 'fermé' : 'ouvert'}`);
      });

      console.log(`[Commerce Accordion] ${category.name}: ${products.length} produits, état initial: ${isExpanded ? 'ouvert' : 'fermé'}`);
    });
  });

  // ============================================================================
  // Commerce Name Swap : nom personnalisé en titre, type+stock en sous-titre
  // ============================================================================
  InitQueue.register('Commerce Name Swap', function initCommerceNameSwap() {
    // Trouver le panel Commerce
    var commerceHeader = Array.from(document.querySelectorAll('h3.panel-title')).find(function (h) {
      return h.textContent.trim() === 'Commerce';
    });
    if (!commerceHeader) {return;}

    var commercePanel = commerceHeader.closest('.panel');
    if (!commercePanel) {return;}

    var items = commercePanel.querySelectorAll('a.list-group-item');
    var swapCount = 0;

    items.forEach(function (item) {
      var h4 = item.querySelector('h4.list-group-item-heading');
      var p = item.querySelector('p.list-group-item-text');
      if (!h4 || !p) {return;}

      // Vérifier que le h4 contient un pattern stock (X/Y) → exclut la Caisse
      var stockPattern = /\(\d+\/\d+\)/;
      if (!stockPattern.test(h4.textContent)) {return;}

      // Extraire le texte du p sans l'icône <i>
      var pClone = p.cloneNode(true);
      var icon = pClone.querySelector('i');
      if (icon) {icon.remove();}
      var customName = pClone.textContent.trim();

      // Vérifier que le sous-titre est significatif (pas vide, pas &nbsp;)
      if (!customName || customName === '\u00A0') {return;}

      // Swap : h4 reçoit le nom personnalisé, p conserve l'icône + reçoit le type+stock
      var oldH4Text = h4.textContent;
      h4.textContent = customName;

      // Conserver l'icône <i> existante, remplacer uniquement le texte
      var existingIcon = p.querySelector('i');
      p.textContent = '';
      if (existingIcon) {
        p.appendChild(existingIcon);
        p.appendChild(document.createTextNode(' '));
      }
      p.appendChild(document.createTextNode(oldH4Text));

      item.classList.add('kr-commerce-name-swapped');
      swapCount++;
    });

    console.log('[Commerce Name Swap] ' + swapCount + ' produits inversés');
  }, 101);

  // ============================================================================
  // TASK-2.4 : Section bâtiment collapsible
  // ============================================================================
  InitQueue.register('Panel Sections Collapse', function initPanelSectionsCollapse() {
    if (!isMobileMode()) {return;}

    var sectionNames = ['Bâtiment', 'Commerce', 'Matériel'];

    sectionNames.forEach(function (sectionName) {
      var sectionHeader = Array.from(document.querySelectorAll('h3.panel-title')).find(function (h) {
        return h.textContent.includes(sectionName);
      });

      if (!sectionHeader) {return;}

      var panelHeading = sectionHeader.parentElement;
      if (!panelHeading) {return;}

      var panelBody = panelHeading.nextElementSibling;

      if (!panelBody || !panelBody.classList.contains('panel-body')) {return;}

      // Ajouter les classes
      panelHeading.classList.add('building-section-header');
      panelBody.classList.add('building-section-content');

      // Masquer le chevron original s'il existe
      var originalChevron = panelHeading.querySelector('span.pull-right.clickable');
      if (originalChevron) {
        originalChevron.style.display = 'none';
      }

      // Ajouter l'icône chevron FA
      var icon = document.createElement('i');
      icon.className = 'fa fa-chevron-down accordion-icon';
      panelHeading.appendChild(icon);

      // État initial : ouvert
      panelHeading.classList.add('expanded');

      // Gestionnaire de clic
      panelHeading.style.cursor = 'pointer';
      panelHeading.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var isNowExpanded = !panelBody.classList.contains('collapsed');
        panelBody.classList.toggle('collapsed', isNowExpanded);
        panelHeading.classList.toggle('collapsed', isNowExpanded);
        panelHeading.classList.toggle('expanded', !isNowExpanded);

        console.log('[Panel Section] ' + sectionName + ': ' + (isNowExpanded ? 'fermé' : 'ouvert'));
      });

      console.log('[Panel Section] ' + sectionName + ' initialisé - section collapsible');
    });
  });

  // ============================================================================
  // CX2 : CROIX DIRECTIONNELLE V2 ET ACCÈS TACTILE AUX PIÈCES (mobile, < 768 px)
  // Remplace la ligne « image map clonée » : une vraie croix de 4 liens (50×50) et une liste
  // de pièces (>= 44 px de haut). Destinations, onclick et états viennent strictement du DOM natif.
  // Si la transformation est impossible ou ambiguë, le natif reste visible et fonctionnel.
  // ============================================================================
  (function () {
    const BLOCK_CLASS = 'kr-nav-v2';
    const DIRECTIONS = ['Nord', 'Ouest', 'Est', 'Sud'];
    const ARM_CLASS = { Nord: 'kr-n', Ouest: 'kr-w', Est: 'kr-e', Sud: 'kr-s' };
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const SKIPPED_ATTRS = ['class', 'style', 'id', 'name', 'usemap', 'alt', 'shape', 'coords'];
    let lastWarning = '';

    function warnOnce(msg) {
      if (msg !== lastWarning) {
        lastWarning = msg;
        console.warn('[Navigation Croix] ' + msg + ' : croix native conservée');
      }
    }

    function normalise(text) {
      return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    // Direction d'après le texte natif (alt/title) ; null si absent, 'ambigu' si plusieurs directions
    function directionFromText(area) {
      const found = new Set();
      [area.getAttribute('alt'), area.getAttribute('title')].forEach(txt => {
        const words = normalise(txt).match(/[a-z]+/g) || [];
        words.forEach(w => {
          if (w === 'nord') { found.add('Nord'); }
          else if (w === 'sud') { found.add('Sud'); }
          else if (w === 'est') { found.add('Est'); }
          else if (w === 'ouest') { found.add('Ouest'); }
        });
      });
      if (found.size === 0) { return null; }
      return found.size === 1 ? Array.from(found)[0] : 'ambigu';
    }

    // Direction d'après la géométrie (image 60×60) : quadrant dominant net, sinon null
    function directionFromGeometry(area) {
      const c = (area.getAttribute('coords') || '').split(',').map(v => parseFloat(v));
      if (c.length !== 4 || c.some(v => Number.isNaN(v))) { return null; }
      const dx = (c[0] + c[2]) / 2 - 30;
      const dy = (c[1] + c[3]) / 2 - 30;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      if (Math.max(ax, ay) < 8) { return null; }
      if (ax > ay * 1.5) { return dx < 0 ? 'Ouest' : 'Est'; }
      if (ay > ax * 1.5) { return dy < 0 ? 'Nord' : 'Sud'; }
      return null;
    }

    function usableHref(el) {
      const href = (el.getAttribute('href') || '').trim();
      return href !== '' && href !== '#';
    }

    // Lit le DOM natif. Retourne { container, areas: {dir: area|null}, rooms: [...] } ou null (+ journal)
    function readNative() {
      const exitImg = Array.from(document.querySelectorAll('img[alt="Sortir"]')).find(i => !i.closest('.' + BLOCK_CLASS));
      if (!exitImg || !exitImg.parentElement) { return null; }
      const map = exitImg.parentElement.querySelector('map[name="exitmap"]') || document.querySelector('map[name="exitmap"]');
      if (!map) { warnOnce('map exitmap absente'); return null; }

      const areas = { Nord: null, Ouest: null, Est: null, Sud: null };
      for (const area of Array.from(map.querySelectorAll('area'))) {
        if ((area.getAttribute('shape') || 'rect').toLowerCase() !== 'rect') { warnOnce('area non rectangulaire'); return null; }
        let dir = directionFromText(area);
        if (dir === 'ambigu') { warnOnce('area à plusieurs directions'); return null; }
        if (!dir) { dir = directionFromGeometry(area); }
        if (!dir) { warnOnce('direction d\'une area indéterminée (alt=' + area.getAttribute('alt') + ')'); return null; }
        if (areas[dir]) { warnOnce('deux areas pour la direction ' + dir); return null; }
        areas[dir] = area;
      }

      // Ordre natif du DOM conservé tel quel (décision d'Arnaud) : pas de tri, les pièces verrouillées restent à leur place
      const batImages = Array.from(document.querySelectorAll('img[src*="/bat/bat"]')).filter(img => !img.closest('.' + BLOCK_CLASS));
      const links = [];
      batImages.forEach(img => {
        const link = img.closest('a');
        if (link && !links.includes(link)) { links.push(link); }
      });
      if (links.length === 0) { return null; }

      // Sur le site réel, le lien de pièce ne contient QUE l'image (le nom et le cadenas sont dessinés dans le GIF, ni texte ni alt ni title) :
      // sans nom natif, on montre l'image entière (tuile) et on ne fabrique aucun nom ; l'étiquette accessible n'est qu'un rang (« Pièce 2 sur 5 »)
      const rooms = links.map((link, i) => {
        const text = (link.textContent || '').replace(/\s+/g, ' ').trim();
        const img = link.querySelector('img[src*="/bat/bat"]');
        const nativeName = text || (img && (img.getAttribute('title') || img.getAttribute('alt'))) || link.getAttribute('title') || '';
        const locked = Array.from(link.querySelectorAll('img')).some(im => /lock/i.test(im.getAttribute('src') || ''));
        return { link, rank: i + 1, total: links.length, name: nativeName.trim(), named: nativeName.trim() !== '', locked, current: link.classList.contains('btn-warning') };
      });
      // Sans conteneur .row.center, on ne saurait pas masquer le natif : deux commandes seraient visibles → repli natif sûr (rien ajouté)
      const container = exitImg.parentElement.closest('.row.center');
      if (!container) { warnOnce('conteneur .row.center introuvable'); return null; }
      return { container, areas, rooms, tiles: rooms.every(r => !r.named) };
    }

    function signature(model) {
      const attr = (el, n) => el ? el.getAttribute(n) : null;
      return JSON.stringify({
        d: DIRECTIONS.map(d => model.areas[d] ? [attr(model.areas[d], 'href'), attr(model.areas[d], 'target'), attr(model.areas[d], 'onclick')] : null),
        r: model.rooms.map(r => [attr(r.link, 'href'), attr(r.link, 'onclick'), r.name, r.current, r.locked, r.link.querySelectorAll('img').length]),
        t: model.tiles
      });
    }

    // Copie les attributs natifs utiles (href, target, onclick, title, rel...) sur le nouveau lien
    function copyNativeAttributes(from, to) {
      Array.from(from.attributes).forEach(a => {
        if (!SKIPPED_ATTRS.includes(a.name)) { to.setAttribute(a.name, a.value); }
      });
    }

    function makeArrow() {
      const svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('viewBox', '0 0 16 14');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', 'M8 1.5 15 12.5H1z');
      path.setAttribute('fill', 'currentColor');
      svg.appendChild(path);
      return svg;
    }

    function buildArm(dir, area) {
      const arm = document.createElement('a');
      arm.className = 'kr-arm ' + ARM_CLASS[dir];
      arm.setAttribute('data-dir', dir);
      if (area && usableHref(area)) {
        copyNativeAttributes(area, arm);
        arm.setAttribute('aria-label', dir);
        // Même chemin que le natif : le lien navigue lui-même ; on évite seulement l'interception par les délégués du site
        arm.addEventListener('click', e => { e.stopPropagation(); });
      } else {
        arm.setAttribute('aria-disabled', 'true');
        arm.setAttribute('aria-label', dir + ' (indisponible)');
        arm.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });
      }
      arm.appendChild(makeArrow());
      const label = document.createElement('span');
      label.textContent = dir;
      arm.appendChild(label);
      return arm;
    }

    function buildRoom(room, tile) {
      const li = document.createElement('li');
      li.setAttribute('role', 'listitem');
      const a = document.createElement('a');
      a.className = 'kr-room' + (tile ? ' kr-room-tile' : '');
      copyNativeAttributes(room.link, a);
      a.addEventListener('click', e => { e.stopPropagation(); });

      const thumb = document.createElement('span');
      thumb.className = 'kr-room-thumb';
      Array.from(room.link.querySelectorAll('img')).forEach((img, idx) => {
        const clone = img.cloneNode(true);
        clone.removeAttribute('style');
        clone.removeAttribute('width');
        clone.removeAttribute('height');
        if (idx === 0) { clone.setAttribute('alt', ''); }
        thumb.appendChild(clone);
      });
      a.appendChild(thumb);

      let here = null;
      if (room.current) {
        a.setAttribute('aria-current', 'true');
        a.classList.add('kr-room-current');
        here = document.createElement('span');
        here.className = 'kr-room-here';
        here.setAttribute('aria-hidden', 'true');
        here.textContent = 'ici';
      }

      if (tile) {
        // Image seule (nom dessiné dans le GIF) : étiquette accessible = rang, sans nom inventé
        a.setAttribute('aria-label', 'Pièce ' + room.rank + ' sur ' + room.total + (room.locked ? ', verrouillée' : ''));
        if (here) { a.appendChild(here); }
      } else {
        const text = document.createElement('span');
        text.className = 'kr-room-text';
        const name = document.createElement('span');
        name.className = 'kr-room-name';
        name.textContent = room.named ? room.name : 'Pièce ' + room.rank;
        text.appendChild(name);
        if (here) { text.appendChild(here); }
        a.appendChild(text);
      }
      li.appendChild(a);
      return li;
    }

    function buildBlock(model, sig) {
      const block = document.createElement('section');
      block.className = BLOCK_CLASS + (model.tiles ? ' kr-nav-tiles' : ' kr-nav-rows');
      block.setAttribute('aria-labelledby', 'kr-nav-v2-title');
      block.setAttribute('data-sig', sig);

      const title = document.createElement('h2');
      title.id = 'kr-nav-v2-title';
      title.className = 'kr-nav-v2-title';
      title.textContent = 'Se déplacer';
      block.appendChild(title);

      const pad = document.createElement('div');
      pad.className = 'kr-pad';
      pad.setAttribute('role', 'group');
      pad.setAttribute('aria-label', 'Directions');
      DIRECTIONS.forEach(dir => { pad.appendChild(buildArm(dir, model.areas[dir])); });
      const hub = document.createElement('span');
      hub.className = 'kr-hub';
      hub.setAttribute('aria-hidden', 'true');
      pad.appendChild(hub);
      block.appendChild(pad);

      const list = document.createElement('ul');
      list.className = 'kr-rooms';
      list.setAttribute('role', 'list');
      list.setAttribute('aria-label', 'Pièces');
      model.rooms.forEach(room => { list.appendChild(buildRoom(room, model.tiles)); });
      block.appendChild(list);
      return block;
    }

    // L'état de masquage vit sur l'élément (data-*) : plusieurs instances du script (réinjection) restent cohérentes
    function restoreNative(except) {
      document.querySelectorAll('[data-kr-nav-hidden]').forEach(el => {
        if (el === except) { return; }
        const prev = el.getAttribute('data-kr-nav-prev') || '';
        const priority = el.getAttribute('data-kr-nav-prio') || '';
        if (prev === '') { el.style.removeProperty('display'); } else { el.style.setProperty('display', prev, priority); }
        el.removeAttribute('data-kr-nav-hidden');
        el.removeAttribute('data-kr-nav-prev');
        el.removeAttribute('data-kr-nav-prio');
      });
    }

    function hideNative(container) {
      restoreNative(container);
      if (!container) { return; }
      if (!container.hasAttribute('data-kr-nav-hidden')) {
        container.setAttribute('data-kr-nav-prev', container.style.getPropertyValue('display'));
        container.setAttribute('data-kr-nav-prio', container.style.getPropertyPriority('display'));
        container.setAttribute('data-kr-nav-hidden', '1');
      }
      if (container.style.getPropertyValue('display') !== 'none') { container.style.setProperty('display', 'none'); }
    }

    function removeBlocks() {
      document.querySelectorAll('.' + BLOCK_CLASS).forEach(b => b.remove());
      restoreNative();
    }

    // Idempotent : appelé à l'init, à chaque mutation, au changement de classe du body et au redimensionnement
    function syncNavigation() {
      if (!document.body || !isThemeEnabled() || !document.body.classList.contains('mobile-mode') || window.innerWidth >= 768) {
        removeBlocks();
        return;
      }
      const navbar = document.querySelector('.navbar');
      if (!navbar) { return; }
      const model = readNative();
      if (!model) {
        removeBlocks();
        return;
      }
      const sig = signature(model);
      const existing = Array.from(document.querySelectorAll('.' + BLOCK_CLASS));
      if (existing.length === 1 && existing[0].getAttribute('data-sig') === sig) {
        hideNative(model.container);
        return;
      }
      existing.forEach(b => b.remove());
      lastWarning = '';
      navbar.parentNode.insertBefore(buildBlock(model, sig), navbar.nextSibling);
      hideNative(model.container);
      console.log('[Navigation Croix] Bloc initialisé : ' + DIRECTIONS.filter(d => model.areas[d]).length + ' direction(s), ' + model.rooms.length + ' pièce(s)');
    }

    function initNavigationRow() {
      if (!document.body) { return; }
      syncNavigation();
      let timer = null;
      const schedule = () => {
        clearTimeout(timer);
        timer = setTimeout(syncNavigation, 120);
      };
      // Mutations utiles : classe du body (mobile-mode), ajout/retrait de nœuds, href/onclick/target des liens et areas natifs
      const relevant = m => {
        if (m.target.closest && m.target.closest('.' + BLOCK_CLASS)) { return false; }
        if (m.type === 'childList') { return true; }
        return m.target === document.body || (m.target.matches && m.target.matches('area, a'));
      };
      new MutationObserver(records => { if (records.some(relevant)) { schedule(); } })
        .observe(document.body, { attributes: true, attributeFilter: ['class', 'href', 'onclick', 'target'], childList: true, subtree: true });
      window.addEventListener('resize', schedule);
    }

    // Enregistrer dans la queue d'initialisation (priorité 60 - après quick actions)
    InitQueue.register('initNavigationRow', initNavigationRow, 60);
  })();

  // ============================================================================
  // FIX MOBILE : Empêcher le scroll automatique vers #flap ou autres ancres
  // ============================================================================
  if (window.innerWidth < 768 && window.location.hash && window.location.hash !== '#top') {
    // Sauvegarder la position actuelle avant que le navigateur ne scrolle
    const initialScrollRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';

    // Supprimer l'ancre de l'URL
    const cleanUrl = window.location.pathname + window.location.search;
    history.replaceState(null, '', cleanUrl);

    // Forcer le scroll en haut immédiatement et après le chargement
    const forceScrollTop = () => window.scrollTo(0, 0);
    forceScrollTop();

    // S'assurer que le scroll reste en haut même après le chargement complet
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', forceScrollTop);
    }
    window.addEventListener('load', forceScrollTop);

    // Restaurer le comportement par défaut après 500ms
    setTimeout(() => {
      history.scrollRestoration = initialScrollRestoration;
    }, 500);
  }

  // ============================================================================
  // NOUVELLES : Gestion du repliement/dépliement (mobile uniquement)
  // ============================================================================
  (function () {
    function initNewsToggle() {
      if (!document.body.classList.contains('mobile-mode')) {return;}

      const newsToggle = document.getElementById('slide-submenu');
      const newsContainer = document.getElementById('player-header-section');

      if (newsToggle && newsContainer) {
        // Fonction pour mettre à jour le bouton
        function updateButton(isCollapsed) {
          newsToggle.innerHTML = isCollapsed ? '▼' : '×';
          newsToggle.setAttribute('aria-label', isCollapsed ? 'Déplier les nouvelles' : 'Replier les nouvelles');
          newsToggle.setAttribute('title', isCollapsed ? 'Déplier' : 'Replier');
        }

        // Charger l'état depuis localStorage
        const isCollapsed = localStorage.getItem('kr-news-collapsed') === 'true';
        if (isCollapsed) {
          newsContainer.classList.add('kr-news-collapsed');
        }
        updateButton(isCollapsed);

        // Gérer le clic (capturer en premier pour empêcher Bootstrap)
        newsToggle.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation(); // Empêche les autres handlers Bootstrap
          newsContainer.classList.toggle('kr-news-collapsed');

          // Sauvegarder l'état et mettre à jour le bouton
          const collapsed = newsContainer.classList.contains('kr-news-collapsed');
          localStorage.setItem('kr-news-collapsed', collapsed);
          updateButton(collapsed);
        }, { capture: true }); // Capture phase pour intercepter avant Bootstrap

        console.log('[News Toggle] Initialisé');
      }
    }

    // Enregistrer dans la queue d'initialisation mobile (priorité 80)
    InitQueue.register('initNewsToggle', initNewsToggle, 80);
  })();

  // ============================================================================
  // CONFIGURATION
  // ============================================================================
  const CONFIG = {
    BUNDLED_CSS: '__CSS_CONTENT__',
    ENABLE_KEY: 'kr-theme-enabled',
    VARIANT_KEY: 'kr-theme-variant',
    STATS_DISPLAY_KEY: 'kr-stats-display',
    STYLE_ID: 'kraland-theme-style',
    THEME_VARIANTS: ['kraland','kraland-dark','empire-brun','paladium','theocratie-seelienne','paradigme-vert','khanat-elmerien','confederation-libre','royaume-ruthvenie','empire-brun-dark','paladium-dark','theocratie-seelienne-dark','paradigme-vert-dark','khanat-elmerien-dark','confederation-libre-dark','royaume-ruthvenie-dark','high-contrast'],
    LOGO_MAP: {
      'kraland': 1, 'empire-brun': 2, 'empire-brun-dark': 2, 'paladium': 3, 'paladium-dark': 3,
      'theocratie-seelienne': 4, 'theocratie-seelienne-dark': 4, 'paradigme-vert': 5, 'paradigme-vert-dark': 5,
      'khanat-elmerien': 6, 'khanat-elmerien-dark': 6, 'confederation-libre': 7, 'confederation-libre-dark': 7,
      'royaume-ruthvenie': 8, 'royaume-ruthvenie-dark': 8
    },
    SKILL_ICONS: {
      'Baratin': '9401', 'Combat Mains Nues': '9402', 'Combat Contact': '9403',
      'Combat Distance': '9404', 'Commerce': '9405', 'Démolition': '9406',
      'Discrétion': '9407', 'Éloquence': '9408', 'Falsification': '9409',
      'Foi': '9410', 'Informatique': '9411', 'Médecine': '9412',
      'Observation': '9413', 'Organisation': '9414', 'Pouvoir': '9415',
      'Séduction': '9416', 'Survie': '9417', 'Vol': '9418'
    },
    STAT_ICONS: {
      'FOR': '9402', 'VOL': '9415', 'CHA': '9416',
      'INT': '9412', 'GES': '9405', 'PER': '9413'
    },

    // Carte Médiévale
    MEDIEVAL_MAP_KEY: 'kr-medieval-map',
    MEDIEVAL_MAP_STYLE_ID: 'kr-medieval-map-style',
    // Exceptions où l'image de remplacement ne suit pas la règle /1/ -> /5/
    MEDIEVAL_MAP_OVERRIDES: {
      // remplacements spécifiques (source -> cible)
      'http://img7.kraland.org/2/map/1/54.gif': 'https://i.imgur.com/yQaUb2q.png',
      'http://img7.kraland.org/2/map/1/123.gif': 'https://i.imgur.com/zeD5Q3m.gif',
      'http://img7.kraland.org/2/map/1/124.gif': 'https://i.imgur.com/kT1NcMR.gif',
      'http://img7.kraland.org/2/map/1/125.gif': 'https://i.imgur.com/OZcbEpv.gif',
      'http://img7.kraland.org/2/map/1/126.gif': 'https://i.imgur.com/pnNPvQa.gif',
      'http://img7.kraland.org/2/map/1/127.gif': 'https://i.imgur.com/AWDyET8.gif',
      'http://img7.kraland.org/2/map/1/128.gif': 'https://i.imgur.com/v9BUsFz.gif',
      'http://img7.kraland.org/2/map/1/129.gif': 'https://i.imgur.com/F3hWy6L.gif',
      'http://img7.kraland.org/2/map/1/130.gif': 'https://i.imgur.com/dQ1eAgR.gif',
      'http://img7.kraland.org/2/map/1/131.gif': 'https://i.imgur.com/hQzJHvq.gif',
      'http://img7.kraland.org/2/map/1/150.gif': 'https://i.imgur.com/b4gCbux.png',
      'http://img7.kraland.org/2/map/1/160.gif': 'https://i.imgur.com/u3pxKOO.gif',
      'http://img7.kraland.org/2/map/1/161.gif': 'https://i.imgur.com/SptXelD.gif',
      'http://img7.kraland.org/2/map/1/162.gif': 'https://i.imgur.com/r9AajUr.gif',
      'http://img7.kraland.org/2/map/1/163.gif': 'https://i.imgur.com/j0E8T1P.gif',
      'http://img7.kraland.org/2/map/1/164.gif': 'https://i.imgur.com/ogaiUqe.gif',
      'http://img7.kraland.org/2/map/1/165.gif': 'https://i.imgur.com/qe3sdQF.gif',
      'http://img7.kraland.org/2/map/1/166.gif': 'https://i.imgur.com/Z6QHBzh.gif',
      'http://img7.kraland.org/2/map/1/167.gif': 'https://i.imgur.com/DtNeOzd.gif',
      'http://img7.kraland.org/2/map/1/168.gif': 'https://i.imgur.com/bowPMN6.gif',
      'http://img7.kraland.org/2/map/1/169.gif': 'https://i.imgur.com/o7CILuq.gif',
      'http://img7.kraland.org/2/map/1/170.gif': 'https://i.imgur.com/y9U0dYl.gif',

      // variantes 1b
      'http://img7.kraland.org/2/map/1b/54.gif': 'https://i.imgur.com/06sWizC.png',
      'http://img7.kraland.org/2/map/1b/123.gif': 'https://i.imgur.com/AVfs5gP.gif',
      'http://img7.kraland.org/2/map/1b/124.gif': 'https://i.imgur.com/5EXjAMq.gif',
      'http://img7.kraland.org/2/map/1b/125.gif': 'https://i.imgur.com/2W8B2Dt.gif',
      'http://img7.kraland.org/2/map/1b/126.gif': 'https://i.imgur.com/4bBE651.gif',
      'http://img7.kraland.org/2/map/1b/127.gif': 'https://i.imgur.com/MlV4iYC.gif',
      'http://img7.kraland.org/2/map/1b/128.gif': 'https://i.imgur.com/rmU5dY2.gif',
      'http://img7.kraland.org/2/map/1b/129.gif': 'https://i.imgur.com/YeujdJG.gif',
      'http://img7.kraland.org/2/map/1b/130.gif': 'https://i.imgur.com/PqDVOX3.gif',
      'http://img7.kraland.org/2/map/1b/131.gif': 'https://i.imgur.com/W8FRpdH.gif',
      'http://img7.kraland.org/2/map/1b/150.gif': 'https://i.imgur.com/w6yVuNX.png',
      'http://img7.kraland.org/2/map/1b/160.gif': 'https://i.imgur.com/bHKR6EJ.gif',
      'http://img7.kraland.org/2/map/1b/161.gif': 'https://i.imgur.com/yrfMXwl.gif',
      'http://img7.kraland.org/2/map/1b/162.gif': 'https://i.imgur.com/qfSfUkX.gif',
      'http://img7.kraland.org/2/map/1b/163.gif': 'https://i.imgur.com/MR7miUh.gif',
      'http://img7.kraland.org/2/map/1b/164.gif': 'https://i.imgur.com/MMunrUy.gif',
      'http://img7.kraland.org/2/map/1b/165.gif': 'https://i.imgur.com/Kqs7t39.gif',
      'http://img7.kraland.org/2/map/1b/166.gif': 'https://i.imgur.com/6FoA0Hi.gif',
      'http://img7.kraland.org/2/map/1b/167.gif': 'https://i.imgur.com/Jgu5rX9.gif',
      'http://img7.kraland.org/2/map/1b/168.gif': 'https://i.imgur.com/KCPBL3T.gif',
      'http://img7.kraland.org/2/map/1b/169.gif': 'https://i.imgur.com/uBJObWh.gif',
      'http://img7.kraland.org/2/map/1b/170.gif': 'https://i.imgur.com/FfpTfLi.gif'
    },

    MEDIEVAL_SEPIA: '85%',
    MEDIEVAL_PRETEST_TIMEOUT_MS: 3000,

    // Images sans équivalent /5/ ni override — ne pas tenter le remplacement
    MEDIEVAL_NO_REPLACE: {
      'http://img7.kraland.org/2/map/1/109.gif': true,
      'http://img7.kraland.org/2/map/1/134.gif': true,
      'http://img7.kraland.org/2/map/1/197.gif': true,
      'http://img7.kraland.org/2/map/1/198.gif': true,
      'http://img7.kraland.org/2/map/1/199.gif': true,
      'http://img7.kraland.org/2/map/1/5015.gif': true,
      'http://img7.kraland.org/2/map/1/5021.gif': true,
      'http://img7.kraland.org/2/map/1/5022.gif': true,
      'http://img7.kraland.org/2/map/1/5023.gif': true,
      'http://img7.kraland.org/2/map/1/5024.gif': true,
      'http://img7.kraland.org/2/map/1/231129.gif': true,
      'http://img7.kraland.org/2/map/1/231229.gif': true,
      'http://img7.kraland.org/2/map/1/231329.gif': true,
      'http://img7.kraland.org/2/map/1/231429.gif': true,
      'http://img7.kraland.org/2/map/1b/109.gif': true,
      'http://img7.kraland.org/2/map/1b/134.gif': true,
      'http://img7.kraland.org/2/map/1b/197.gif': true,
      'http://img7.kraland.org/2/map/1b/198.gif': true,
      'http://img7.kraland.org/2/map/1b/199.gif': true,
      'http://img7.kraland.org/2/map/1b/5015.gif': true,
      'http://img7.kraland.org/2/map/1b/5021.gif': true,
      'http://img7.kraland.org/2/map/1b/5022.gif': true,
      'http://img7.kraland.org/2/map/1b/5023.gif': true,
      'http://img7.kraland.org/2/map/1b/5024.gif': true,
      'http://img7.kraland.org/2/map/1b/231129.gif': true,
      'http://img7.kraland.org/2/map/1b/231229.gif': true,
      'http://img7.kraland.org/2/map/1b/231329.gif': true,
      'http://img7.kraland.org/2/map/1b/231429.gif': true
    },

    // Noms dont la cible /2/map/5/ est ABSENTE ou invalide (audit réseau reproductible :
    // `node tests/e2e/audit-map-images.mjs --online`, rapport docs/AUDIT-MAP-IMAGES.md). Évite des requêtes
    // vouées à l'échec ; le repli d'exécution (retour à l'URL d'origine) reste actif pour tout le reste.
    MEDIEVAL_ABSENT_IN_TARGET: {
      '1': [
        '109.gif', '123.gif', '124.gif', '125.gif', '126.gif', '127.gif', '128.gif', '129.gif', '130.gif',
        '134.gif', '150.gif', '160.gif', '161.gif', '162.gif', '163.gif', '164.gif', '165.gif', '166.gif',
        '167.gif', '168.gif', '169.gif', '170.gif', '197.gif', '198.gif', '199.gif', '231129.gif', '231229.gif',
        '231329.gif', '231429.gif', '3527.gif', '5015.gif', '5021.gif', '5022.gif', '5023.gif', '5024.gif',
        '51_1.gif', '51_2.gif', '51_3.gif', '51_4.gif', '51_5.gif', '51_6.gif', '51_7.gif', '51_8.gif',
        '51_9.gif', '52_0.gif', '53_0.gif', '54.gif', '54_0.gif', '55_0.gif', '55_1.gif', '55_2.gif', '55_3.gif',
        '55_4.gif', '55_5.gif', '55_6.gif', '55_7.gif', '55_8.gif', '55_9.gif', '56_1.gif', '56_2.gif',
        '56_3.gif', '56_4.gif', '56_5.gif', '56_6.gif', '56_7.gif', '56_8.gif', '56_9.gif', 'blank.gif',
        'c1w.gif', 'hex.gif', 'hex2.gif', 'hex3.gif', 'm1w.gif', 'm2w.gif', 'm3w.gif', 'm4w.gif', 'p1w.gif',
        'p2w.gif', 'p3w.gif', 'p4w.gif'
      ],
      '1b': [
        '109.gif', '123.gif', '124.gif', '125.gif', '126.gif', '127.gif', '128.gif', '129.gif', '130.gif',
        '134.gif', '150.gif', '160.gif', '161.gif', '162.gif', '163.gif', '164.gif', '165.gif', '166.gif',
        '167.gif', '168.gif', '169.gif', '170.gif', '197.gif', '198.gif', '199.gif', '231129.gif', '231229.gif',
        '231329.gif', '231429.gif', '3527.gif', '5015.gif', '5021.gif', '5022.gif', '5023.gif', '5024.gif',
        '51_1.gif', '51_2.gif', '51_3.gif', '51_4.gif', '51_5.gif', '51_6.gif', '51_7.gif', '51_8.gif',
        '51_9.gif', '52_0.gif', '53_0.gif', '54.gif', '54_0.gif', '55_0.gif', '55_1.gif', '55_2.gif', '55_3.gif',
        '55_4.gif', '55_5.gif', '55_6.gif', '55_7.gif', '55_8.gif', '55_9.gif', '56_1.gif', '56_2.gif',
        '56_3.gif', '56_4.gif', '56_5.gif', '56_6.gif', '56_7.gif', '56_8.gif', '56_9.gif', 'hex.gif', 'hex2.gif',
        'hex3.gif'
      ]
    },

    // Commerce - affichage liste/tuiles
    COMMERCE_LIST_KEY: 'kr-commerce-list-mode',

    // Commerce - accordéons ouverts par défaut
    COMMERCE_EXPANDED_KEY: 'kr-commerce-expanded',

    // Matériel - déplacement dans la colonne gauche
    MATERIEL_MOVE_KEY: 'kr-materiel-move',

    // Carrousel d'accueil - masquage
    CAROUSEL_HIDE_KEY: 'kr-carousel-hide'
  };

  // ============================================================================
  // UTILITAIRES
  // ============================================================================

  /** Exécute une fonction en silence (catch les erreurs) */
  function safeCall(fn) {
    try { fn(); } catch (_e) { /* ignore */ }
  }

  // Cache localStorage — évite les lectures répétées de localStorage
  const _lsCache = {};

  /** Lit une clé localStorage avec cache */
  function _lsGet(key) {
    if (!(key in _lsCache)) {
      _lsCache[key] = localStorage.getItem(key);
    }
    return _lsCache[key];
  }

  /** Écrit une clé localStorage et met à jour le cache */
  function _lsSet(key, value) {
    _lsCache[key] = value;
    localStorage.setItem(key, value);
  }

  /** Vérifie si le thème est activé */
  function isThemeEnabled() {
    return _lsGet(CONFIG.ENABLE_KEY) === 'true';
  }

  /** Récupère la variante de thème actuelle */
  function getVariant() {
    return _lsGet(CONFIG.VARIANT_KEY) || 'kraland';
  }

  /** Récupère le mode d'affichage des caractéristiques ('icon' ou 'text') */
  function getStatsDisplayMode() {
    return _lsGet(CONFIG.STATS_DISPLAY_KEY) || 'icon';
  }

  /** Vérifie si la carte médiévale est activée */
  function isMedievalMapEnabled() {
    return _lsGet(CONFIG.MEDIEVAL_MAP_KEY) === 'true';
  }

  /** Vérifie si le commerce est en mode liste (desktop) */
  function isCommerceListEnabled() {
    return _lsGet(CONFIG.COMMERCE_LIST_KEY) === 'true';
  }

  /** Vérifie si les accordéons commerce sont ouverts par défaut */
  function isCommerceExpandedEnabled() {
    return _lsGet(CONFIG.COMMERCE_EXPANDED_KEY) === 'true';
  }

  /** Vérifie si le déplacement du matériel dans col-left est activé (activé par défaut) */
  function isMaterielMoveEnabled() {
    var val = _lsGet(CONFIG.MATERIEL_MOVE_KEY);
    return val === null || val === 'true';
  }

  /** Vérifie si le carrousel d'accueil est masqué (masqué par défaut) */
  function isCarouselHidden() {
    var val = _lsGet(CONFIG.CAROUSEL_HIDE_KEY);
    return val === null || val === 'true';
  }

  // ---------------------------------------------------------------------------
  // Carte médiévale (remplacement d'images via JS)
  // - On n'utilise plus le CSS distant à la volée
  // - Règle générale: /2/map/1/ ou /2/map/1b/ -> /2/map/5/
  // - Exceptions: CONFIG.MEDIEVAL_MAP_OVERRIDES
  // ---------------------------------------------------------------------------

  function extractUrl(bg) {
    if (!bg) {return null;}
    const m = bg.match(/url\((?:'|")?(.*?)(?:'|")?\)/);
    return m ? m[1] : null;
  }

  // Suivi des remplacements d'images (carte médiévale). Règle commune : la source d'origine est
  // mémorisée AVANT tout remplacement et on y revient si la cible ne charge pas (404, décodage).
  const KR_IMG = {
    applied: 'data-kr-medieval-applied',
    original: 'data-kr-medieval-original-bg',
    filter: 'data-kr-medieval-original-filter',
    target: 'data-kr-medieval-target',
    failed: 'data-kr-medieval-failed',
    pending: 'data-kr-medieval-pending'
  };
  // Cibles connues pour ne pas charger : on ne les retente pas (évite requêtes 404 en rafale)
  const krBadTargets = Object.create(null);

  /** Remet le filtre inline d'origine (celui mémorisé avant le remplacement) */
  function krRestoreFilter(el) {
    if (!el.hasAttribute(KR_IMG.filter) || !el.style) {return;}
    const f = el.getAttribute(KR_IMG.filter);
    if (f) { el.style.setProperty('filter', f, 'important'); } else { el.style.removeProperty('filter'); }
  }

  /** Retour à la source d'origine d'une <img> dont le remplacement a échoué (une seule fois, sans boucle) */
  function krRevertImg(img) {
    const target = img.getAttribute(KR_IMG.target);
    if (target) { krBadTargets[target] = true; }
    const orig = img.getAttribute(KR_IMG.original);
    img.removeAttribute(KR_IMG.applied);
    img.removeAttribute(KR_IMG.pending);
    img.setAttribute(KR_IMG.failed, 'true');
    krRestoreFilter(img);
    if (orig !== null && img.getAttribute('src') !== orig) { img.setAttribute('src', orig); }
  }

  /** Écouteurs de repli, posés une seule fois par image (idempotent) ; lisent l'état à l'événement */
  function krGuardImg(img) {
    if (img.__krImgGuard) {return;}
    img.__krImgGuard = true;
    const check = function () {
      if (img.getAttribute(KR_IMG.applied) !== 'true') {return;}
      // Seul un échec de la cible remplacée déclenche le repli ; l'original en erreur ne relance rien
      if (img.getAttribute('src') !== img.getAttribute(KR_IMG.target)) {return;}
      if (img.__krFailEvent || img.naturalWidth === 0) { krRevertImg(img); }
    };
    img.addEventListener('error', function () { img.__krFailEvent = true; check(); img.__krFailEvent = false; });
    img.addEventListener('load', check);
  }

  /** Remplace la source d'une <img> par `target`, avec repli garanti sur l'originale */
  function krSwapImg(img, target, withSepia) {
    if (!img.hasAttribute(KR_IMG.original)) { img.setAttribute(KR_IMG.original, img.getAttribute('src') || ''); }
    if (!img.hasAttribute(KR_IMG.filter)) { img.setAttribute(KR_IMG.filter, img.style ? img.style.getPropertyValue('filter') || '' : ''); }
    krGuardImg(img);
    img.removeAttribute(KR_IMG.failed);
    img.setAttribute(KR_IMG.target, target);
    img.setAttribute(KR_IMG.applied, 'true');
    img.setAttribute('src', target);
    if (withSepia && img.style) { img.style.setProperty('filter', 'sepia(' + CONFIG.MEDIEVAL_SEPIA + ')', 'important'); }
    // Image déjà en erreur de décodage/chargement (cache) : repli immédiat
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src') === target && img.currentSrc) { krRevertImg(img); }
  }

  /** Une <img> remplacée dont la source a été changée par le site ou un autre script : on repart de zéro */
  function krResyncImg(img) {
    if (img.getAttribute(KR_IMG.applied) !== 'true' && img.getAttribute(KR_IMG.failed) !== 'true') {return;}
    const cur = img.getAttribute('src');
    if (cur === img.getAttribute(KR_IMG.target) || cur === img.getAttribute(KR_IMG.original)) {return;}
    krRestoreFilter(img);
    [KR_IMG.applied, KR_IMG.failed, KR_IMG.pending, KR_IMG.target, KR_IMG.original, KR_IMG.filter].forEach(function (a) { img.removeAttribute(a); });
  }

  /** Noms (sans chemin ni paramètres) connus pour être absents de la variante cible /2/map/5/ */
  const krAbsentInTargetSets = {};
  function isAbsentInTarget(variant, src) {
    if (!krAbsentInTargetSets[variant]) {
      krAbsentInTargetSets[variant] = new Set((CONFIG.MEDIEVAL_ABSENT_IN_TARGET || {})[variant] || []);
    }
    const name = String(src).split('?')[0].split('#')[0].split('/').pop();
    return krAbsentInTargetSets[variant].has(name);
  }

  function computeReplacement(src) {
    if (!src) {return null;}
    const overrides = CONFIG.MEDIEVAL_MAP_OVERRIDES || {};
    if (overrides[src]) { return overrides[src]; }
    if (src.indexOf('/2/map/1b/') !== -1) {
      if (isAbsentInTarget('1b', src)) {return null;}
      return src.replace('/2/map/1b/', '/2/map/5/');
    }
    if (src.indexOf('/2/map/1/') !== -1) {
      if (isAbsentInTarget('1', src)) {return null;}
      return src.replace('/2/map/1/', '/2/map/5/');
    }
    return null;
  }

  /** Applique ou retire le remplacement d'images pour la carte médiévale */
  function applyMedievalMapOption() {
    try {
      const appliedAttr = 'data-kr-medieval-applied';
      const originalBgAttr = 'data-kr-medieval-original-bg';
      const originalFilterAttr = 'data-kr-medieval-original-filter';

      const _krTestCache = {};
      // Résout true (chargée), false (échec confirmé par le navigateur) ou null (délai dépassé : INCONNU).
      // Un délai sur réseau lent ne prouve rien : la cible n'est ni mémorisée ni bannie, le repli d'exécution
      // (krSwapImg → retour à l'original si le chargement échoue vraiment) protège les <img>.
      function testImageExists(url) {
        if (Object.hasOwn(_krTestCache, url)) {return Promise.resolve(!!_krTestCache[url]);}
        return new Promise(resolve => {
          try {
            var settled = false;
            var img = new Image();
            var timeout = setTimeout(function () {
              if (!settled) {
                settled = true;
                img.onload = null;
                img.onerror = null;
                resolve(null);
              }
            }, CONFIG.MEDIEVAL_PRETEST_TIMEOUT_MS);
            img.onload = function () {
              if (!settled) {
                settled = true;
                clearTimeout(timeout);
                _krTestCache[url] = true;
                resolve(true);
              }
            };
            img.onerror = function () {
              if (!settled) {
                settled = true;
                clearTimeout(timeout);
                _krTestCache[url] = false;
                resolve(false);
              }
            };
            img.src = url;
          } catch (_e) { _krTestCache[url] = false; resolve(false); }
        });
      }

      function processElement(el) {
        if (el && el.tagName === 'IMG') { krResyncImg(el); }
        if (!el || (el.getAttribute && el.getAttribute(appliedAttr) === 'true') || (el.getAttribute && el.getAttribute('data-kr-medieval-pending') === 'true') || (el.getAttribute && el.getAttribute('data-kr-medieval-failed') === 'true')) {return;}
        let src = null;
        if (el.tagName === 'IMG') {
          src = el.src || el.getAttribute('src');
        } else {
          const inlineBg = el.style && el.style.getPropertyValue('background-image') || '';
          const computedBg = inlineBg || (window.getComputedStyle && getComputedStyle(el).backgroundImage) || '';
          src = extractUrl(inlineBg) || extractUrl(computedBg);
        }
        if (!src) {return;}
        // Ne pas remplacer les URLs explicitement exclues
        if (CONFIG.MEDIEVAL_NO_REPLACE && CONFIG.MEDIEVAL_NO_REPLACE[src]) {return;}
        const target = computeReplacement(src);
        if (!target || krBadTargets[target]) {return;}

        // Marquer comme pending pour éviter les re-tests simultanés
        el.setAttribute && el.setAttribute('data-kr-medieval-pending', 'true');
        // sauvegarde des valeurs originales (attribut src tel quel pour une <img>)
        if (!el.hasAttribute || !el.hasAttribute(originalBgAttr)) {
          el.setAttribute(originalBgAttr, el.tagName === 'IMG' ? (el.getAttribute('src') || src) : src);
        }
        const origFilter = (el.style && el.style.getPropertyValue('filter')) || '';
        if (!el.hasAttribute || !el.hasAttribute(originalFilterAttr)) {
          el.setAttribute(originalFilterAttr, origFilter);
        }

        // tester l'existence de la ressource cible avant d'appliquer
        testImageExists(target).then(exists => {
          if (exists === null) {
            // Délai dépassé : cible inconnue (ni bannie ni marquée en échec). <img> : remplacement gardé par le repli
            // d'exécution ; fond CSS : original conservé, nouvel essai possible à la prochaine mutation.
            if (el.tagName === 'IMG') {
              krSwapImg(el, target, src.indexOf('/2/map/1b/') !== -1);
            }
          } else if (exists) {
            if (el.tagName === 'IMG') {
              // Remplacement gardé : repli sur l'original si la cible échoue après coup
              krSwapImg(el, target, src.indexOf('/2/map/1b/') !== -1);
            } else {
              el.style && el.style.setProperty && el.style.setProperty('background-image', 'url("' + target + '")', 'important');
              if (src.indexOf('/2/map/1b/') !== -1) {
                el.style && el.style.setProperty && el.style.setProperty('filter', 'sepia(' + CONFIG.MEDIEVAL_SEPIA + ')', 'important');
              }
              el.setAttribute && el.setAttribute(appliedAttr, 'true');
            }
          } else {
            krBadTargets[target] = true;
            // fallback: restaurer l'original si nécessaire (ne rien changer autrement)
            const elemOrig = el.getAttribute(originalBgAttr);
            if (el.tagName === 'IMG') {
              if (elemOrig && el.getAttribute('src') !== elemOrig) { el.setAttribute('src', elemOrig); }
            } else {
              if (elemOrig) { el.style && el.style.setProperty && el.style.setProperty('background-image', 'url("' + elemOrig + '")', 'important'); } else { el.style && el.style.removeProperty && el.style.removeProperty('background-image'); }
            }
            const origFilterAttrVal = el.getAttribute(originalFilterAttr);
            if (origFilterAttrVal) { el.style && el.style.setProperty && el.style.setProperty('filter', origFilterAttrVal, 'important'); } else { el.style && el.style.removeProperty && el.style.removeProperty('filter'); }
            el.setAttribute && el.setAttribute('data-kr-medieval-failed', 'true');
          }
          el.removeAttribute && el.removeAttribute('data-kr-medieval-pending');
        }).catch(_ => { el.setAttribute && el.setAttribute('data-kr-medieval-failed', 'true'); el.removeAttribute && el.removeAttribute('data-kr-medieval-pending'); });
      }

      function restoreAll() {
        const els = document.querySelectorAll('[' + appliedAttr + '="true"], [data-kr-medieval-failed="true"]');
        els.forEach(el => {
          const origBg = el.getAttribute(originalBgAttr);
          if (el.tagName === 'IMG') {
            if (origBg) {
              if (el.getAttribute('src') !== origBg) { el.setAttribute('src', origBg); }
            } else {
              el.removeAttribute && el.removeAttribute('src');
            }
          } else {
            if (origBg) {
              el.style && el.style.setProperty && el.style.setProperty('background-image', 'url("' + origBg + '")', 'important');
            } else {
              el.style && el.style.removeProperty && el.style.removeProperty('background-image');
            }
          }
          const origFilter = el.getAttribute(originalFilterAttr);
          if (origFilter) {
            el.style && el.style.setProperty && el.style.setProperty('filter', origFilter, 'important');
          } else {
            el.style && el.style.removeProperty && el.style.removeProperty('filter');
          }
          el.removeAttribute && el.removeAttribute(appliedAttr);
          el.removeAttribute && el.removeAttribute('data-kr-medieval-failed');
          el.removeAttribute && el.removeAttribute(originalBgAttr);
          el.removeAttribute && el.removeAttribute(originalFilterAttr);
          el.removeAttribute && el.removeAttribute(KR_IMG.target);
          el.removeAttribute && el.removeAttribute(KR_IMG.pending);
        });
      }

      if (isMedievalMapEnabled()) {
        document.documentElement.classList.add('kr-medieval-map-enabled');
        // traitement initial des tuiles existantes (div background-image et imgs)
        const candidates = document.querySelectorAll('div[style*="/2/map/1/"], div[style*="/2/map/1b/"], img[src*="/2/map/1/"], img[src*="/2/map/1b/"]');
        candidates.forEach(processElement);

        // observer les modifications dynamiques (nouveaux éléments ou changement d'attribut style/src)
        if (!applyMedievalMapOption._observer) {
          const mo = new MutationObserver(mutations => {
            mutations.forEach(m => {
              if (m.type === 'attributes' && (m.attributeName === 'style' || m.attributeName === 'src') && m.target && m.target.nodeType === 1) {
                processElement(m.target);
              } else if (m.type === 'childList') {
                m.addedNodes.forEach(n => {
                  if (n.nodeType !== 1) {return;}
                  if (n.matches && (n.matches('div[style*="/2/map/1/"]') || n.matches('div[style*="/2/map/1b/"]') || n.matches('img[src*="/2/map/1/"]') || n.matches('img[src*="/2/map/1b/"]'))) {
                    processElement(n);
                  }
                  n.querySelectorAll && n.querySelectorAll('div[style*="/2/map/1/"], div[style*="/2/map/1b/"], img[src*="/2/map/1/"], img[src*="/2/map/1b/"]').forEach(processElement);
                });
              }
            });
          });
          mo.observe(document.body || document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style','src'] });
          applyMedievalMapOption._observer = mo;
        }
      } else {
        document.documentElement.classList.remove('kr-medieval-map-enabled');
        restoreAll();
        if (applyMedievalMapOption._observer) {
          applyMedievalMapOption._observer.disconnect();
          applyMedievalMapOption._observer = null;
        }
      }
      return true;
    } catch (e) {
      console.error('applyMedievalMapOption error', e);
      return false;
    }
  }

  /** Vérifie si on est sur la page /jouer */
  function isPlatoPage() {
    const path = location?.pathname || '';
    return path.indexOf('/jouer') === 0 &&
           path !== '/jouer/communaute' &&
           path !== '/jouer/communaute/membres';
  }

  /** Crée la pastille de niveau d'une compétence : couleurs et position portées par le CSS (jetons du thème) */
  function createBadge(text) {
    const badge = document.createElement('span');
    badge.className = 'badge kr-skill-badge ' + (Number(text) > 0 ? 'is-level' : 'is-zero');
    badge.textContent = text;
    return badge;
  }

  /** Crée la pastille d'une caractéristique : même famille visuelle que celle des compétences */
  function createStatBadge(text) {
    const badge = document.createElement('span');
    badge.className = 'badge kr-stat-badge ' + (Number(text) > 0 ? 'is-level' : 'is-zero');
    badge.textContent = text;
    return badge;
  }

  /** Si l'icône ne charge pas, on garde le nom lisible (3 lettres) au lieu d'une case vide */
  function bindIconFallback(img, container, name) {
    img.addEventListener('error', function () {
      if (container.querySelector('.kr-icon-fallback')) {return;}
      img.hidden = true;
      const fb = document.createElement('span');
      fb.className = 'kr-icon-fallback';
      fb.setAttribute('aria-hidden', 'true');
      fb.textContent = String(name || '').substring(0, 3).toUpperCase();
      container.insertBefore(fb, img);
    });
  }

  /** Crée un conteneur d'icône avec badge (dimensions et position dans le CSS) */
  function createIconContainer(iconUrl, altText, badgeText) {
    const container = document.createElement('div');
    container.className = 'kr-skill-icon';

    const img = document.createElement('img');
    img.className = 'kr-skill-img';
    img.src = iconUrl;
    img.alt = altText;
    bindIconFallback(img, container, altText);
    container.appendChild(img);

    container.appendChild(createBadge(badgeText));
    return container;
  }

  // ============================================================================
  // INJECTION CSS IMMÉDIATE (avant tout code async)
  // ============================================================================
  (function injectCSSImmediately(){
    try {
      if (!isThemeEnabled()) {return;}

      // Masquer la page immédiatement pour éviter le FOUC
      // Seulement si on est assez tôt (document encore en cours de parsing)
      if (document.readyState === 'loading') {
        document.documentElement.style.opacity = '0';
      }

      const st = document.createElement('style');
      st.id = CONFIG.STYLE_ID;
      st.textContent = CONFIG.BUNDLED_CSS;
      (document.head || document.documentElement).appendChild(st);

      const variant = getVariant();
      document.documentElement.classList.add('kr-theme-enabled', 'kr-theme-variant-' + variant);
      if (variant === 'high-contrast') {
        document.documentElement.classList.add('kr-theme-high-contrast');
      }
    } catch(e) { console.error('CSS injection failed', e); }
  })();

  // ============================================================================
  // OBSERVATION DE LA POSITION DU <style> DANS <head> (anti-FOUC)
  // ============================================================================
  // Le navigateur ajoute les <link> du site APRÈS notre <style> injecté à document-start.
  // À spécificité égale, les feuilles plus tardives dans le DOM gagnent → flash du thème original.
  // L'observer déplace notre <style> à la fin de <head> dès qu'un nouveau stylesheet apparaît.

  function startHeadPositionObserver() {
    if (!isThemeEnabled()) { return; }

    const styleId = CONFIG.STYLE_ID;
    let observer = null;

    function moveStyleToEnd() {
      const head = document.head;
      if (!head) { return; }
      const st = document.getElementById(styleId);
      if (st && head.lastElementChild !== st) {
        head.appendChild(st);
      }
    }

    function revealPage() {
      const docEl = document.documentElement;
      // Rien à révéler si on n'a pas masqué
      if (docEl.style.opacity !== '0') { return; }
      // Dernière passe : s'assurer que notre style est bien en fin de <head>
      moveStyleToEnd();
      // Double rAF pour garantir que les styles sont calculés avant le paint
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          docEl.style.transition = 'opacity 0.15s ease-in';
          docEl.style.opacity = '1';
          // Nettoyer les styles inline après la transition
          setTimeout(function () {
            docEl.style.transition = '';
            docEl.style.opacity = '';
          }, 200);
        });
      });
    }

    function observeHead() {
      const head = document.head;
      if (!head) { return; }

      observer = new MutationObserver(function (mutations) {
        for (let i = 0; i < mutations.length; i++) {
          const added = mutations[i].addedNodes;
          for (let j = 0; j < added.length; j++) {
            const node = added[j];
            // Ignorer notre propre <style> pour éviter les boucles
            if (node.id === styleId) { continue; }
            // Réagir uniquement aux <link> et <style> (stylesheets du site)
            if (node.nodeName === 'LINK' || node.nodeName === 'STYLE') {
              moveStyleToEnd();
              return;
            }
          }
        }
      });

      observer.observe(head, { childList: true });
      // Positionnement initial au cas où des stylesheets sont déjà présents
      moveStyleToEnd();
    }

    // Si <head> existe déjà, observer directement
    if (document.head) {
      observeHead();
    } else {
      // Sinon, attendre que <head> apparaisse (cas document-start très précoce)
      const docObserver = new MutationObserver(function () {
        if (document.head) {
          docObserver.disconnect();
          observeHead();
        }
      });
      docObserver.observe(document.documentElement, { childList: true });
    }

    // Révéler la page et déconnecter l'observer après DOMContentLoaded
    function cleanup() {
      revealPage();
      setTimeout(function () {
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }, 2000);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', cleanup, { once: true });
    } else {
      cleanup();
    }

    // Sécurité : révéler la page après 3s max quoi qu'il arrive
    setTimeout(function () {
      if (document.documentElement.style.opacity === '0') {
        document.documentElement.style.opacity = '';
        document.documentElement.style.transition = '';
      }
    }, 3000);
  }

  safeCall(startHeadPositionObserver);

  // Interception précoce des images de la carte médiévale (document-start)
  // Remplace les src synchroniquement avant que le navigateur charge les originales
  function startEarlyMedievalInterception() {
    if (!isMedievalMapEnabled()) {return;}

    var earlyObserver = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType !== 1) {continue;}
          if (node.tagName === 'IMG') {
            processImgEarly(node);
          }
          if (node.querySelectorAll) {
            var imgs = node.querySelectorAll('img[src*="/2/map/1/"], img[src*="/2/map/1b/"]');
            for (var k = 0; k < imgs.length; k++) {
              processImgEarly(imgs[k]);
            }
          }
        }
      }
    });

    function processImgEarly(img) {
      krResyncImg(img);
      if (img.getAttribute(KR_IMG.applied) === 'true' || img.getAttribute(KR_IMG.failed) === 'true') {return;}
      var src = img.getAttribute('src');
      if (!src) {return;}
      if (src.indexOf('/2/map/1/') === -1 && src.indexOf('/2/map/1b/') === -1) {return;}
      if (CONFIG.MEDIEVAL_NO_REPLACE && CONFIG.MEDIEVAL_NO_REPLACE[src]) {return;}
      var target = computeReplacement(src);
      if (!target || krBadTargets[target]) {return;}
      // Source d'origine mémorisée AVANT remplacement ; repli automatique si la cible ne charge pas
      krSwapImg(img, target, src.indexOf('/2/map/1b/') !== -1);
    }

    earlyObserver.observe(document.documentElement, { childList: true, subtree: true });

    function cleanupEarly() {
      earlyObserver.disconnect();
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', cleanupEarly, { once: true });
    } else {
      cleanupEarly();
    }
  }

  safeCall(startEarlyMedievalInterception);

  // Appliquer la carte médiévale si activée (asynchrone, non bloquant)
  safeCall(() => applyMedievalMapOption());

  // ============================================================================
  // GESTION DU THÈME
  // ============================================================================

  async function applyThemeInline(cssText) {
    if (!isThemeEnabled()) {return false;}
    PerfLog.start('css:inject');

    try {
      let st = document.getElementById(CONFIG.STYLE_ID);
      if (st) {
        st.textContent = cssText;
      } else {
        st = document.createElement('style');
        st.id = CONFIG.STYLE_ID;
        st.textContent = cssText;
        document.head.appendChild(st);
      }
      PerfLog.end('css:inject');

      PerfLog.start('css:applyVariant');
      document.documentElement.classList.add('kr-theme-enabled');
      const variant = getVariant();

      // High contrast
      document.documentElement.classList.toggle('kr-theme-high-contrast', variant === 'high-contrast');

      // Variant classes
      CONFIG.THEME_VARIANTS.forEach(v =>
        document.documentElement.classList.remove('kr-theme-variant-' + v)
      );
      if (variant && variant !== 'disable') {
        document.documentElement.classList.add('kr-theme-variant-' + variant);
      }

      // Page members
      const isMembers = location?.pathname?.indexOf('/communaute/membres') === 0;
      document.documentElement.classList.toggle('kr-page-members', isMembers);
      PerfLog.end('css:applyVariant');

      return true;
    } catch(e) {
      console.error('Theme apply failed', e);
      PerfLog.end('css:inject');
      return false;
    }
  }

  async function ensureTheme() {
    if (!isThemeEnabled()) {return;}
    await applyThemeInline(CONFIG.BUNDLED_CSS);
  }

  function applyThemeVariant(variant, skipReload = false) {
    try {
      if (!variant || variant === 'disable') {
        _lsSet(CONFIG.ENABLE_KEY, 'false');
        if (!skipReload) {location.reload();}
        return;
      }

      const wasDisabled = !isThemeEnabled();
      _lsSet(CONFIG.ENABLE_KEY, 'true');
      _lsSet(CONFIG.VARIANT_KEY, variant);

      if (wasDisabled && !skipReload) {
        location.reload();
        return;
      }

      // Switch variant sans reload
      CONFIG.THEME_VARIANTS.forEach(v =>
        document.documentElement.classList.remove('kr-theme-variant-' + v)
      );
      document.documentElement.classList.add('kr-theme-variant-' + variant);
      document.documentElement.classList.add('kr-theme-enabled');

      safeCall(() => applyThemeInline(CONFIG.BUNDLED_CSS));
      safeCall(() => replaceNavbarBrand());
    } catch(e) { console.error('applyThemeVariant error', e); }
  }

  function getThemeState() {
    if (_lsGet(CONFIG.ENABLE_KEY) === null) {
      _lsSet(CONFIG.ENABLE_KEY, 'false');
    }
    return isThemeEnabled();
  }

  // ============================================================================
  // TRANSFORMATIONS DOM
  // ============================================================================

  /**
   * Applique l'option de masquage de la citation du footer
   */
  function applyFooterQuoteOption() {
    const hideQuote = localStorage.getItem('kr-hide-footer-quote') === 'true';
    if (hideQuote) {
      document.documentElement.classList.add('kr-hide-footer-quote');
    } else {
      document.documentElement.classList.remove('kr-hide-footer-quote');
    }
  }

  /**
   * Applique l'option de masquage du carrousel d'accueil
   */
  function applyCarouselOption() {
    if (isCarouselHidden()) {
      document.documentElement.classList.add('kr-hide-carousel');
    } else {
      document.documentElement.classList.remove('kr-hide-carousel');
    }
  }

  /**
   * Transforme l'alerte ministérielle en carte stylisée
   * - Remplace "Ce message a été modifié le" par "Dernière publication du ministère le"
   * - Retire le bouton de fermeture et les classes alert
   * - Ajoute la classe kr-ministerial-card
   */
  function transformMinisterialAlert() {
    var alerts = document.querySelectorAll('.page-accueil .alert.alert-dismissible');
    alerts.forEach(function (alert) {
      if (alert.textContent.indexOf('Ministre') === -1) {return;}

      // Retirer le bouton de fermeture
      var closeBtn = alert.querySelector('.close, [data-dismiss="alert"]');
      if (closeBtn) {closeBtn.remove();}

      // Remplacer le texte "Ce message a été modifié le"
      var walker = document.createTreeWalker(alert, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        var node = walker.currentNode;
        if (node.nodeValue.indexOf('Ce message a été modifié le') !== -1) {
          node.nodeValue = node.nodeValue.replace(
            'Ce message a été modifié le',
            'Dernière publication du ministère le'
          );
        }
      }

      // Remplacer les classes alert par la classe dédiée
      alert.classList.remove('alert', 'alert-info', 'alert-dismissible');
      alert.classList.add('kr-ministerial-card');
    });
  }

  /**
   * Applique l'option de mode liste commerce (desktop)
   */
  function applyCommerceListOption() {
    if (isCommerceListEnabled()) {
      document.documentElement.classList.add('kr-commerce-list-mode');
    } else {
      document.documentElement.classList.remove('kr-commerce-list-mode');
    }
  }

  function applyDOMTransformations() {
    if (!isThemeEnabled()) {return;}
    PerfLog.start('dom:transformations');

    const transforms = [
      markActiveIcons, replaceMcAnchors, replaceSImages, replaceNavbarBrand,
      reorderBtnGroupXs, ensureSexStrong, ensureFooterSticky, displayVersionInfo,
      relocateKramailToLeft, restructurePlatoColumns, moveBtnGroupToCols, moveSkillsPanelToCols,
      transformToBootstrapGrid, nameLeftSidebarDivs, normalizeNativeGauges, transformSkillsToIcons,
      transformStatsToNotifications, ensureEditorClasses, ensurePageScoping,
      ensurePlayerMainPanelRows, addQuickAccessButtons, ensureActionGrid, moveMaterielToColLeft, moveClefsSectionAboveFabriquer, addRankTitles,
      disableTooltips, modifyNavigationMenus, window.updateForumRPMenu,
      window.updateForumHRPMenu, window.updateForumCommunauteMenu,
      window.updateForumDebatsMenu, window.updateForumStaffMenu,
      transformDashboardToFlexCards, applyFooterQuoteOption, applyCarouselOption,
      transformMinisterialAlert, applyCommerceListOption, handleDualLapClock
    ];

    transforms.forEach(fn => {
      const fnName = (fn && fn.name) || 'anonymous';
      PerfLog.start('dom:' + fnName);
      safeCall(fn);
      PerfLog.end('dom:' + fnName);
    });

    PerfLog.end('dom:transformations');
  }

  function disableTooltips() {
    // Désactiver les tooltips:
    // 1. Sur mobile
    // 2. Si enfant de col-leftest ou panel-body grid-transformed

    document.querySelectorAll('[data-toggle="tooltip"]').forEach(el => {
      // Les cellules d'icônes (compétences, caractéristiques) portent leur nom dans title/aria-label : on les garde
      if (el.classList.contains('kr-icon-cell')) {
        ['data-toggle', 'data-placement', 'data-original-title'].forEach(a => el.removeAttribute(a));
        return;
      }
      const isMobile = document.body.classList.contains('mobile-mode');
      const isInColLeftest = el.closest('.col-leftest');
      const isInGridTransformed = el.closest('.panel-body.grid-transformed');

      if (isMobile || isInColLeftest || isInGridTransformed) {
        el.removeAttribute('data-toggle');
        el.removeAttribute('data-placement');
        el.removeAttribute('title');
        el.removeAttribute('data-original-title');
      }
    });

    if (window.$ && window.$.fn && window.$.fn.tooltip) {
      window.$.fn.tooltip = function () { return this; };
    }
  }

  /** Observe les ajouts DOM pour désactiver les tooltips sur les nouveaux éléments */
  function observeTooltips() {
    // Appel initial
    disableTooltips();

    // Observer les ajouts de contenu pour traiter les nouveaux tooltips (AJAX, etc.)
    if (document.body) {
      const tooltipObserver = new MutationObserver((mutations) => {
        let hasNewNodes = false;
        for (const mutation of mutations) {
          if (mutation.addedNodes.length > 0) {
            hasNewNodes = true;
            break;
          }
        }
        if (hasNewNodes) {
          disableTooltips();
        }
      });
      tooltipObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  /**
   * Ajoute les titres des rangs du forum dans des divs soeurs
   */
  function addRankTitles() {
    // Ne s'exécuter que sur les pages du forum
    if (!window.location.pathname.startsWith('/forum/')) {return;}

    // Trouver toutes les images de rang
    document.querySelectorAll('img[src*="img7.kraland.org/2/rank/"]').forEach(img => {
      // Récupérer le contenu de data-original-title ou title
      let title = img.getAttribute('data-original-title') || img.getAttribute('title');
      if (!title) {return;}

      // Trouver la div parente contenant l'image
      let parentDiv = img.closest('div');
      if (!parentDiv || !parentDiv.parentElement) {return;}

      // Chercher une <strong> qui contient un lien avec "charlie-2-82045"
      // La strong devrait être dans le même cartouche (div parente du parent)
      let cartouche = parentDiv.closest('.cartouche') || parentDiv.closest('div[class="cartouche"]');
      if (!cartouche) {
        cartouche = parentDiv.parentElement;
      }

      if (cartouche) {
        const strongWithLink = cartouche.querySelector('strong a[href*="charlie-2-82045"]');
        if (strongWithLink) {
          // C'est Charlie (ou un compte avec charlie-2-82045), remplacer "Empereur" par "Emperatrice"
          if (title === 'Empereur') {
            title = 'Emperatrice';
          }
        }
      }

      // Remplacements pour Mystisie
      if (title === 'Gouverneure Mystisie') {
        title = 'Sultane Eternelle de Mystisie';
      } else if (title === 'Gouverneur Mystisie') {
        title = 'Sultan Eternel de Mystisie';
      }

      // Vérifier si une div soeur avec ce titre existe déjà (pour éviter les doublons)
      const nextSiblings = parentDiv.parentElement.querySelectorAll('div');
      let titleAlreadyExists = false;
      for (let sibling of nextSiblings) {
        if (sibling.textContent.trim() === title && sibling !== parentDiv) {
          titleAlreadyExists = true;
          break;
        }
      }

      // Si le titre existe déjà, ne rien faire
      if (titleAlreadyExists) {return;}

      // Vérifier aussi si on a déjà créé cette div (avec le data-kr-rank-title)
      const nextSibling = parentDiv.nextElementSibling;
      if (nextSibling && nextSibling.hasAttribute('data-kr-rank-title')) {return;}

      // Créer un conteneur flex pour l'icône + titre
      const rankContainer = document.createElement('div');
      rankContainer.setAttribute('data-kr-rank-title', 'true');
      rankContainer.style.display = 'flex';
      rankContainer.style.alignItems = 'center';
      rankContainer.style.justifyContent = 'center';
      rankContainer.style.gap = '4px';
      rankContainer.style.marginTop = '4px';

      // Déplacer l'image dans ce conteneur
      const rankImg = parentDiv.querySelector('img[src*="/rank/"]');
      if (rankImg) {
        rankContainer.appendChild(rankImg.cloneNode(true));
      }

      // Ajouter le titre
      const strong = document.createElement('strong');
      strong.textContent = title;
      rankContainer.appendChild(strong);

      // Remplacer la div parente par le nouveau conteneur
      if (parentDiv.parentElement) {
        parentDiv.parentElement.replaceChild(rankContainer, parentDiv);
      }
    });
  }

  /**
   * Extrait les données d'un membre depuis son élément DOM
   */
  /**
   * Extrait les données d'un groupe complet (boutons de groupe + membres avec actions)
   */
  function extractGroupData(panel) {
    const groupData = {
      title: '',
      groupButtons: [],
      members: []
    };

    // Extraire le titre et les boutons du panel-heading
    const panelHeading = panel.querySelector('.panel-heading');
    if (panelHeading) {
      const panelTitle = panelHeading.querySelector('.panel-title');
      if (panelTitle) {
        // Extraire le texte du titre (sans les boutons)
        groupData.title = panelTitle.textContent.trim();

        // Cloner le contenu riche du titre (texte + <img>) sans les boutons
        var titleFragment = document.createDocumentFragment();
        panelTitle.childNodes.forEach(function (node) {
          if (node.nodeType === Node.TEXT_NODE) {
            titleFragment.appendChild(node.cloneNode(false));
          } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IMG') {
            titleFragment.appendChild(node.cloneNode(true));
          } else if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('badge')) {
            titleFragment.appendChild(node.cloneNode(true));
          }
        });
        groupData.titleFragment = titleFragment;

        // Extraire les boutons de groupe (avec cloneNode pour préserver événements)
        const buttons = panelTitle.querySelectorAll('a.btn');
        buttons.forEach(btn => {
          groupData.groupButtons.push(btn.cloneNode(true));
        });
      }
    }

    // Extraire les membres et leurs actions individuelles
    const panelBody = panel.querySelector('.panel-body');
    if (!panelBody) {return groupData;}

    const table = panelBody.querySelector('table');
    if (!table) {return groupData;}

    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const td1 = row.querySelector('td:first-child');
      const td2 = row.querySelector('td:last-child');

      if (!td1 || !td2) {return;}

      // Récupérer les liens membres (TD1)
      const memberLinks = td1.querySelectorAll('a.list-group-item.ds_game');

      // Récupérer les divs d'actions (TD2) - une div de 59px par personnage
      const actionsDivs = td2.querySelectorAll('div[style*="height:59px"]');

      // Associer chaque membre à sa div d'actions par index
      memberLinks.forEach((memberLink, index) => {
        const actionsDiv = actionsDivs[index] || null;
        const memberData = extractMemberData(memberLink, actionsDiv);
        groupData.members.push(memberData);
      });
    });

    return groupData;
  }

  /**
   * Extrait les données d'un membre individuel
   */
  function extractMemberData(memberLink, actionsDiv) {
    const data = {
      originalLink: memberLink, // Garder le lien original pour préserver classes et événements
      avatar: null,
      name: '',
      status: '',
      isPNJ: false,
      worldImage: null,
      hpInfo: null,
      pvLevel: null, // Niveau de PV de 1 à 5 (pdv1.png à pdv5.png)
      profileUrl: '',
      actionsDiv: null // Div contenant les actions de CE personnage uniquement
    };

    // Avatar
    const avatar = memberLink.querySelector('img.pull-left');
    if (avatar) {
      data.avatar = avatar.src;
    }

    // Nom et statut
    const heading = memberLink.querySelector('.list-group-item-heading');
    const text = memberLink.querySelector('.list-group-item-text');
    if (heading) {
      data.name = heading.textContent.trim();
      data.nameFragment = cloneVisibleContent(heading);
    }
    if (text) {
      data.status = text.textContent.trim();
    }

    // PNJ button
    const pnjButton = memberLink.querySelector('.btn-danger.xmini');
    if (pnjButton) {
      data.isPNJ = true;
    }

    // Icône de monde et HP
    const mention = memberLink.querySelector('.mention.pull-right');
    if (mention) {
      const worldImg = mention.querySelector('img[src*="world"]');
      if (worldImg) {
        data.worldImage = worldImg.src;
      }

      // Extraire le niveau de PV depuis l'image pdv1.png à pdv5.png
      const pvImg = mention.querySelector('img[src*="pdv"]');
      if (pvImg) {
        const match = pvImg.src.match(/pdv(\d)\.png/);
        if (match) {
          data.pvLevel = parseInt(match[1], 10); // 1 à 5
        }
      }

      // Extraire les HP depuis l'image de barre (fallback)
      const hpDiv = mention.querySelector('div[style*="background"]');
      if (hpDiv) {
        const style = hpDiv.getAttribute('style') || '';
        const match = style.match(/width:\s*(\d+)%/);
        if (match) {
          data.hpInfo = parseInt(match[1], 10);
        }
      }
    }

    // URL du profil
    data.profileUrl = memberLink.href;

    // Cloner la div d'actions de CE personnage uniquement
    if (actionsDiv) {
      data.actionsDiv = actionsDiv.cloneNode(true);
    }

    return data;
  }

  /**
   * Crée un cercle SVG de progression pour les PV
   */
  function createHPCircle(pvLevel) {
    if (!pvLevel) {return null;}

    // Correspondance niveau PV -> couleur et pourcentage
    // pdv1 = 100% (pleine santé), pdv5 = 20% (presque mort)
    const pvConfig = {
      1: { color: '#32CD32', percentage: 100 },  // Vert lime - Pleine santé
      2: { color: '#FFD700', percentage: 80 },   // Jaune/or
      3: { color: '#FF8C00', percentage: 60 },   // Orange foncé
      4: { color: '#DC143C', percentage: 40 },   // Rouge crimson
      5: { color: '#8B0000', percentage: 20 }    // Rouge foncé - Presque mort
    };

    const config = pvConfig[pvLevel] || pvConfig[1];
    const radius = 37; // Rayon pour un avatar de 70px (35px) + bordure
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (circumference * config.percentage / 100);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dashboard-card-hp-circle');
    svg.setAttribute('width', '82');
    svg.setAttribute('height', '82');
    svg.setAttribute('viewBox', '0 0 82 82');

    // Cercle de fond (gris)
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', '41');
    bgCircle.setAttribute('cy', '41');
    bgCircle.setAttribute('r', radius);
    bgCircle.setAttribute('fill', 'none');
    bgCircle.setAttribute('stroke', 'rgba(0,0,0,0.1)');
    bgCircle.setAttribute('stroke-width', '3');

    // Cercle de progression (coloré)
    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressCircle.setAttribute('cx', '41');
    progressCircle.setAttribute('cy', '41');
    progressCircle.setAttribute('r', radius);
    progressCircle.setAttribute('fill', 'none');
    progressCircle.setAttribute('stroke', config.color);
    progressCircle.setAttribute('stroke-width', '4');
    progressCircle.setAttribute('stroke-linecap', 'round');
    progressCircle.setAttribute('stroke-dasharray', circumference);
    progressCircle.setAttribute('stroke-dashoffset', strokeDashoffset);
    progressCircle.setAttribute('transform', 'rotate(-90 41 41)');

    svg.appendChild(bgCircle);
    svg.appendChild(progressCircle);

    return svg;
  }

  /**
   * Crée une card pour un membre
   */
  function buildCard(memberData, isLargeCard = false) {
    const card = document.createElement('div');
    card.className = isLargeCard ? 'dashboard-card dashboard-card-large' : 'dashboard-card';

    // Cloner le lien original pour préserver toutes les classes et événements
    const cardLink = memberData.originalLink.cloneNode(false);
    cardLink.classList.add('dashboard-card-link');
    // Vider le contenu pour reconstruire

    // Header avec avatar, drapeau et nom
    const header = document.createElement('div');
    header.className = 'dashboard-card-header';

    if (memberData.avatar) {
      // Créer un wrapper pour l'avatar avec le cercle de PV
      const avatarWrapper = document.createElement('div');
      avatarWrapper.className = 'dashboard-card-avatar-wrapper';

      // Ajouter le cercle SVG si on a l'info des PV
      if (memberData.pvLevel) {
        const hpCircle = createHPCircle(memberData.pvLevel);
        if (hpCircle) {
          avatarWrapper.appendChild(hpCircle);
        }
      }

      // Ajouter l'avatar
      const avatarImg = document.createElement('img');
      avatarImg.src = memberData.avatar;
      avatarImg.className = 'dashboard-card-avatar';
      avatarImg.alt = memberData.name;

      // Appliquer un filtre gris si le personnage est KO (pdv5)
      if (memberData.pvLevel === 5) {
        avatarImg.style.filter = 'grayscale(100%)';
        avatarImg.style.opacity = '0.7';
      }

      avatarWrapper.appendChild(avatarImg);

      header.appendChild(avatarWrapper);
    }

    // Conteneur pour le drapeau et le nom
    const nameContainer = document.createElement('div');
    nameContainer.className = 'dashboard-card-name-container';

    if (memberData.worldImage) {
      const worldImg = document.createElement('img');
      worldImg.src = memberData.worldImage;
      worldImg.className = 'dashboard-card-world';
      worldImg.alt = 'World';
      nameContainer.appendChild(worldImg);
    }

    const nameDiv = document.createElement('div');
    nameDiv.className = 'dashboard-card-name';
    if (memberData.nameFragment) {
      setRichContent(nameDiv, memberData.nameFragment);
    } else {
      nameDiv.textContent = memberData.name;
    }
    nameContainer.appendChild(nameDiv);

    header.appendChild(nameContainer);
    cardLink.appendChild(header);

    // Body avec statut uniquement (pas de monde, il sera dans les actions)
    const body = document.createElement('div');
    body.className = 'dashboard-card-body';

    if (memberData.status) {
      const statusDiv = document.createElement('div');
      statusDiv.className = 'dashboard-card-status';
      statusDiv.textContent = memberData.status;
      body.appendChild(statusDiv);
    }

    cardLink.appendChild(body);
    card.appendChild(cardLink);

    // Barre de HP
    if (memberData.hpInfo !== null) {
      const hpBar = document.createElement('div');
      hpBar.className = 'dashboard-card-hp';

      const hpFill = document.createElement('div');
      hpFill.className = 'dashboard-card-hp-fill';
      hpFill.style.width = memberData.hpInfo + '%';

      // Couleur selon le pourcentage
      if (memberData.hpInfo > 70) {
        hpFill.style.backgroundColor = '#5cb85c'; // vert
      } else if (memberData.hpInfo > 30) {
        hpFill.style.backgroundColor = '#f0ad4e'; // jaune
      } else {
        hpFill.style.backgroundColor = '#d9534f'; // rouge
      }

      hpBar.appendChild(hpFill);
      card.appendChild(hpBar);
    }

    // Bouton PNJ
    if (memberData.isPNJ) {
      const pnjBadge = document.createElement('span');
      pnjBadge.className = 'dashboard-card-pnj';
      pnjBadge.textContent = 'PNJ';
      card.appendChild(pnjBadge);
    }

    // Actions individuelles de CE personnage
    if (memberData.actionsDiv) {
      const actionsWrapper = document.createElement('div');
      actionsWrapper.className = 'dashboard-card-actions';

      // Extraire les liens d'action individuels (ignorer les divs conteneurs)
      const actionLinks = memberData.actionsDiv.querySelectorAll('a');
      actionLinks.forEach(link => {
        actionsWrapper.appendChild(link.cloneNode(true));
      });

      card.appendChild(actionsWrapper);
    }

    return card;
  }

  /**
   * Transforme le dashboard en système de flex cards
   */
  function transformDashboardToFlexCards() {
    if (!isPlatoPage()) {return;}

    const dashboard = document.querySelector('.dashboard');
    if (!dashboard) {return;}

    const panels = dashboard.querySelectorAll(':scope > .panel');
    if (!panels.length) {return;}

    // Créer le nouveau conteneur flex
    const flexContainer = document.createElement('div');
    flexContainer.className = 'dashboard-flex';

    // Tableau de groupes avec leurs données complètes
    const groups = [];
    let firstPlayerPanelFound = false;

    // Extraire toutes les données par groupe
    panels.forEach(panel => {
      const panelBody = panel.querySelector('.panel-body');
      if (!panelBody) {return;}

      const table = panelBody.querySelector('table');
      if (!table) {return;}

      // Vérifier si c'est un panel de groupe de personnages (titre contient "Groupe")
      const panelTitle = panel.querySelector('.panel-heading .panel-title');
      const titleText = panelTitle ? panelTitle.textContent.trim() : '';
      if (!titleText.toLowerCase().includes('groupe')) {return;}

      // Extraire toutes les données du groupe (titre, boutons, membres)
      const groupData = extractGroupData(panel);

      if (groupData.members.length === 0) {return;}

      // Le premier panel avec des personnages = Mon groupe
      const isMyGroup = !firstPlayerPanelFound;
      if (titleText.toLowerCase().includes('groupe')) {firstPlayerPanelFound = true;}

      groups.push({
        isMyGroup: isMyGroup,
        title: groupData.title,
        titleFragment: groupData.titleFragment,
        groupButtons: groupData.groupButtons,
        members: groupData.members
      });
    });

    // Ne transformer que si on a trouvé au moins un groupe
    if (groups.length === 0) {return;}

    // Construire les sections pour chaque groupe
    groups.forEach((group, _index) => {
      const groupSection = document.createElement('div');
      groupSection.className = group.isMyGroup
        ? 'dashboard-section dashboard-section-mygroup'
        : 'dashboard-section dashboard-section-others';

      // En-tête de section avec titre et boutons de groupe
      const header = document.createElement('div');
      header.className = 'dashboard-section-header';

      // Ajouter les boutons de groupe en premier
      if (group.groupButtons && group.groupButtons.length > 0) {
        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.className = 'dashboard-group-buttons';
        group.groupButtons.forEach(btn => {
          buttonsWrapper.appendChild(btn);
        });
        header.appendChild(buttonsWrapper);
      }

      // Ajouter le titre du groupe
      const titleSpan = document.createElement('span');
      titleSpan.className = 'dashboard-group-title';

      var titleText = group.title.replace(/\s*Groupe\s+/i, '');
      if (group.titleFragment && titleText) {
        // Utiliser le fragment riche pour préserver les smileys <img>
        // Retirer le préfixe "Groupe " du premier nœud texte
        var richFragment = group.titleFragment.cloneNode(true);
        var firstText = richFragment.firstChild;
        if (firstText && firstText.nodeType === Node.TEXT_NODE) {
          firstText.textContent = firstText.textContent.replace(/\s*Groupe\s+/i, '');
          if (!firstText.textContent) {
            richFragment.removeChild(firstText);
          }
        }
        setRichContent(titleSpan, richFragment);
      } else if (group.isMyGroup) {
        titleSpan.textContent = titleText || 'Mon groupe';
      } else if (titleText) {
        titleSpan.textContent = titleText;
      } else if (group.members[0] && group.members[0].nameFragment) {
        titleSpan.appendChild(document.createTextNode('Groupe de '));
        titleSpan.appendChild(group.members[0].nameFragment.cloneNode(true));
      } else {
        titleSpan.textContent = 'Groupe de ' + (group.members[0] && group.members[0].name || 'Inconnu');
      }

      header.appendChild(titleSpan);
      groupSection.appendChild(header);

      // Grille des cartes
      const cardsContainer = document.createElement('div');
      cardsContainer.className = group.isMyGroup
        ? 'dashboard-cards-grid dashboard-cards-large'
        : 'dashboard-cards-grid';

      group.members.forEach(member => {
        cardsContainer.appendChild(buildCard(member, group.isMyGroup));
      });

      groupSection.appendChild(cardsContainer);
      flexContainer.appendChild(groupSection);
    });

    // Remplacer le contenu du dashboard
    dashboard.innerHTML = '';
    dashboard.appendChild(flexContainer);
  }

  // ============================================
  // DYNAMIC FORUM RP MENU FROM PAGE CONTENT
  // ============================================
  (function () {
    'use strict';

    const STORAGE_KEY = 'kr-forums-rp';
    const EXCLUDED_FORUMS = ['taverne', 'marché', 'monde', 'communauté', 'débats', 'staff'];

    /**
     * Extrait les forums de la page /forum/rp et les stocke dans localStorage
     * Exclut Taverne, Marché, Monde, Communauté, Débats et Staff
     */
    function extractAndStoreForumsRP() {
      // Ne s'exécuter que sur /forum/rp
      if (window.location.pathname !== '/forum/rp') {
        return;
      }

      console.log('[Forums RP] Extraction des forums depuis la page...');

      const forums = [];

      // Sélectionner toutes les lignes du tableau des forums
      const forumRows = document.querySelectorAll('table.table tbody tr');

      forumRows.forEach(row => {
        const linkCell = row.querySelector('td:first-child a');
        if (!linkCell) {return;}

        const forumName = linkCell.textContent.trim();
        const forumUrl = linkCell.getAttribute('href');

        // Exclure les forums de la liste noire (insensible à la casse)
        const isExcluded = EXCLUDED_FORUMS.some(excluded =>
          forumName.toLowerCase().includes(excluded)
        );

        if (!isExcluded && forumUrl) {
          forums.push({
            name: forumName,
            url: forumUrl
          });
          console.log(`[Forums RP] Ajouté: ${forumName} (${forumUrl})`);
        } else {
          console.log(`[Forums RP] Exclu: ${forumName}`);
        }
      });

      // Stocker dans localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(forums));
        console.log(`[Forums RP] ${forums.length} forums stockés dans localStorage`);
      } catch (e) {
        console.error('[Forums RP] Erreur sauvegarde localStorage:', e);
      }
    }

    /**
     * Récupère les forums RP depuis le localStorage
     */
    function getStoredForumsRP() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.warn('[Forums RP] Erreur lecture localStorage:', e);
        return [];
      }
    }

    /**
     * Met à jour le menu Forum RP avec les forums stockés
     */
    window.updateForumRPMenu = function () {
      const forumRpDropdown = document.querySelector('[data-forums-added="rp"] .dropdown-menu');
      if (!forumRpDropdown) {
        // Menu pas encore créé ou page sans navigation - normal
        return;
      }

      const forums = getStoredForumsRP();
      console.log(`[Forums RP] Mise à jour du menu avec ${forums.length} forums`);

      // Conserver les 3 premiers liens (Taverne, Marché, Monde) et le divider
      const staticItems = Array.from(forumRpDropdown.children).slice(0, 4); // 3 liens + 1 divider

      // Vider le menu
      forumRpDropdown.innerHTML = '';

      // Remettre les items statiques
      staticItems.forEach(item => forumRpDropdown.appendChild(item));

      // Ajouter les forums dynamiques
      if (forums.length > 0) {
        forums.forEach(forum => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = forum.url;
          a.textContent = forum.name;
          li.appendChild(a);
          forumRpDropdown.appendChild(li);
        });
      } else {
        // Si aucun forum stocké, afficher un lien vers la page /forum/rp
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = 'forum/rp';
        a.textContent = 'Autre';
        li.appendChild(a);
        forumRpDropdown.appendChild(li);
      }
    };

    // Enregistrer l'extraction dans InitQueue (priorité haute pour s'exécuter dès que possible)
    InitQueue.register('ForumsRP:Extract', extractAndStoreForumsRP, 5);
  })();

  // ============================================
  // DYNAMIC FORUM HRP MENU FROM PAGE CONTENT
  // ============================================
  (function () {
    'use strict';

    const STORAGE_KEY = 'kr-forums-hrp';

    /**
     * Extrait les forums de la page /forum/hrp et les stocke dans localStorage
     */
    function extractAndStoreForumsHRP() {
      // Ne s'exécuter que sur /forum/hrp
      if (window.location.pathname !== '/forum/hrp') {
        return;
      }

      console.log('[Forums HRP] Extraction des forums depuis la page...');

      const forums = [];

      // Sélectionner toutes les lignes du tableau des forums
      const forumRows = document.querySelectorAll('table.table tbody tr');

      forumRows.forEach(row => {
        const linkCell = row.querySelector('td:first-child a');
        if (!linkCell) {return;}

        const forumName = linkCell.textContent.trim();
        const forumUrl = linkCell.getAttribute('href');

        if (forumUrl) {
          forums.push({
            name: forumName,
            url: forumUrl
          });
          console.log(`[Forums HRP] Ajouté: ${forumName} (${forumUrl})`);
        }
      });

      // Stocker dans localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(forums));
        console.log(`[Forums HRP] ${forums.length} forums stockés dans localStorage`);
      } catch (e) {
        console.error('[Forums HRP] Erreur sauvegarde localStorage:', e);
      }
    }

    /**
     * Récupère les forums HRP depuis le localStorage
     */
    function getStoredForumsHRP() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.warn('[Forums HRP] Erreur lecture localStorage:', e);
        return [];
      }
    }

    /**
     * Met à jour le menu Forum HRP avec les forums stockés
     */
    window.updateForumHRPMenu = function () {
      const forumHrpDropdown = document.querySelector('[data-forums-added="hrp"] .dropdown-menu');
      if (!forumHrpDropdown) {
        // Menu pas encore créé ou page sans navigation - normal
        return;
      }

      const forums = getStoredForumsHRP();
      console.log(`[Forums HRP] Mise à jour du menu avec ${forums.length} forums`);

      // Vider le menu
      forumHrpDropdown.innerHTML = '';

      // Ajouter tous les forums dynamiques
      if (forums.length > 0) {
        forums.forEach(forum => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = forum.url;
          a.textContent = forum.name;
          li.appendChild(a);
          forumHrpDropdown.appendChild(li);
        });
      } else {
        // Si aucun forum stocké, afficher un lien vers la page /forum/hrp
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = 'forum/hrp';
        a.textContent = 'Voir tous les forums';
        li.appendChild(a);
        forumHrpDropdown.appendChild(li);
      }
    };

    // Enregistrer l'extraction dans InitQueue (priorité haute pour s'exécuter dès que possible)
    InitQueue.register('ForumsHRP:Extract', extractAndStoreForumsHRP, 5);
  })();

  // ============================================
  // DYNAMIC FORUM COMMUNAUTE MENU FROM PAGE CONTENT
  // ============================================
  (function () {
    'use strict';

    const STORAGE_KEY = 'kr-forums-communaute';
    const EXCLUDED_FORUMS = ['taverne', 'marché', 'monde', 'communauté', 'débats', 'staff'];

    function extractAndStoreForumsCommunaute() {
      if (window.location.pathname !== '/forum/communaute') {
        return;
      }

      console.log('[Forums Communauté] Extraction des forums depuis la page...');

      const forums = [];
      const forumRows = document.querySelectorAll('table.table tbody tr');

      forumRows.forEach(row => {
        const linkCell = row.querySelector('td:first-child a');
        if (!linkCell) {return;}

        const forumName = linkCell.textContent.trim();
        const forumUrl = linkCell.getAttribute('href');

        const isExcluded = EXCLUDED_FORUMS.some(excluded =>
          forumName.toLowerCase().includes(excluded)
        );

        if (!isExcluded && forumUrl) {
          forums.push({
            name: forumName,
            url: forumUrl
          });
          console.log(`[Forums Communauté] Ajouté: ${forumName} (${forumUrl})`);
        }
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(forums));
        console.log(`[Forums Communauté] ${forums.length} forums stockés dans localStorage`);
      } catch (e) {
        console.error('[Forums Communauté] Erreur sauvegarde localStorage:', e);
      }
    }

    function getStoredForumsCommunaute() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.warn('[Forums Communauté] Erreur lecture localStorage:', e);
        return [];
      }
    }

    window.updateForumCommunauteMenu = function () {
      const forumCommunauteDropdown = document.querySelector('[data-forums-added="forum-communaute"] .dropdown-menu');
      if (!forumCommunauteDropdown) {
        return;
      }

      const forums = getStoredForumsCommunaute();
      console.log(`[Forums Communauté] Mise à jour du menu avec ${forums.length} forums`);

      forumCommunauteDropdown.innerHTML = '';

      if (forums.length > 0) {
        forums.forEach(forum => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = forum.url;
          a.textContent = forum.name;
          li.appendChild(a);
          forumCommunauteDropdown.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = 'forum/communaute';
        a.textContent = 'Voir tous les forums';
        li.appendChild(a);
        forumCommunauteDropdown.appendChild(li);
      }
    };

    InitQueue.register('ForumsCommunaute:Extract', extractAndStoreForumsCommunaute, 5);
  })();

  // ============================================
  // DYNAMIC FORUM DEBATS MENU FROM PAGE CONTENT
  // ============================================
  (function () {
    'use strict';

    const STORAGE_KEY = 'kr-forums-debats';
    const EXCLUDED_FORUMS = ['taverne', 'marché', 'monde', 'communauté', 'débats', 'staff'];

    function extractAndStoreForumsDebats() {
      if (window.location.pathname !== '/forum/debats') {
        return;
      }

      console.log('[Forums Débats] Extraction des forums depuis la page...');

      const forums = [];
      const forumRows = document.querySelectorAll('table.table tbody tr');

      forumRows.forEach(row => {
        const linkCell = row.querySelector('td:first-child a');
        if (!linkCell) {return;}

        const forumName = linkCell.textContent.trim();
        const forumUrl = linkCell.getAttribute('href');

        const isExcluded = EXCLUDED_FORUMS.some(excluded =>
          forumName.toLowerCase().includes(excluded)
        );

        if (!isExcluded && forumUrl) {
          forums.push({
            name: forumName,
            url: forumUrl
          });
          console.log(`[Forums Débats] Ajouté: ${forumName} (${forumUrl})`);
        }
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(forums));
        console.log(`[Forums Débats] ${forums.length} forums stockés dans localStorage`);
      } catch (e) {
        console.error('[Forums Débats] Erreur sauvegarde localStorage:', e);
      }
    }

    function getStoredForumsDebats() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.warn('[Forums Débats] Erreur lecture localStorage:', e);
        return [];
      }
    }

    window.updateForumDebatsMenu = function () {
      const forumDebatsDropdown = document.querySelector('[data-forums-added="forum-debats"] .dropdown-menu');
      if (!forumDebatsDropdown) {
        return;
      }

      const forums = getStoredForumsDebats();
      console.log(`[Forums Débats] Mise à jour du menu avec ${forums.length} forums`);

      forumDebatsDropdown.innerHTML = '';

      if (forums.length > 0) {
        forums.forEach(forum => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = forum.url;
          a.textContent = forum.name;
          li.appendChild(a);
          forumDebatsDropdown.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = 'forum/debats';
        a.textContent = 'Voir tous les forums';
        li.appendChild(a);
        forumDebatsDropdown.appendChild(li);
      }
    };

    InitQueue.register('ForumsDebats:Extract', extractAndStoreForumsDebats, 5);
  })();

  // ============================================
  // DYNAMIC FORUM STAFF MENU FROM PAGE CONTENT
  // ============================================
  (function () {
    'use strict';

    const STORAGE_KEY = 'kr-forums-staff';
    const EXCLUDED_FORUMS = ['taverne', 'marché', 'monde', 'communauté', 'débats', 'staff'];

    function extractAndStoreForumsStaff() {
      if (window.location.pathname !== '/forum/staff') {
        return;
      }

      console.log('[Forums Staff] Extraction des forums depuis la page...');

      const forums = [];
      const forumRows = document.querySelectorAll('table.table tbody tr');

      forumRows.forEach(row => {
        const linkCell = row.querySelector('td:first-child a');
        if (!linkCell) {return;}

        const forumName = linkCell.textContent.trim();
        const forumUrl = linkCell.getAttribute('href');

        const isExcluded = EXCLUDED_FORUMS.some(excluded =>
          forumName.toLowerCase().includes(excluded)
        );

        if (!isExcluded && forumUrl) {
          forums.push({
            name: forumName,
            url: forumUrl
          });
          console.log(`[Forums Staff] Ajouté: ${forumName} (${forumUrl})`);
        }
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(forums));
        console.log(`[Forums Staff] ${forums.length} forums stockés dans localStorage`);
      } catch (e) {
        console.error('[Forums Staff] Erreur sauvegarde localStorage:', e);
      }
    }

    function getStoredForumsStaff() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.warn('[Forums Staff] Erreur lecture localStorage:', e);
        return [];
      }
    }

    window.updateForumStaffMenu = function () {
      const forumStaffDropdown = document.querySelector('[data-forums-added="forum-staff"] .dropdown-menu');
      if (!forumStaffDropdown) {
        return;
      }

      const forums = getStoredForumsStaff();
      console.log(`[Forums Staff] Mise à jour du menu avec ${forums.length} forums`);

      forumStaffDropdown.innerHTML = '';

      if (forums.length > 0) {
        forums.forEach(forum => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = forum.url;
          a.textContent = forum.name;
          li.appendChild(a);
          forumStaffDropdown.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = 'forum/staff';
        a.textContent = 'Voir tous les forums';
        li.appendChild(a);
        forumStaffDropdown.appendChild(li);
      }
    };

    InitQueue.register('ForumsStaff:Extract', extractAndStoreForumsStaff, 5);
  })();

  /**
   * MODULE: Forum Cards Mobile
   * Transforme le tableau des forums en cards tactiles sur mobile
   */
  (function initForumCardsMobile() {
    'use strict';

    // Ne s'exécuter que sur les pages du forum
    if (!window.location.pathname.startsWith('/forum/')) {
      return;
    }

    // L0 (sous-forum) : un tableau dont la 1re colonne contient des liens vers des sujets (forum/sujet/) est une liste de sujets, pas un
    // index de forums (l'index peut, lui, porter des liens « dernier message » vers des sujets dans une autre colonne).
    // Sans ce garde-fou, le 1er tableau de la page (les sujets permanents) était doublé par des cartes forum aux chiffres faux.
    const isTopicsTable = table => table.querySelector('tbody td:first-child a[href*="forum/sujet/"]') !== null;
    function findForumsTable() {
      return Array.from(document.querySelectorAll('table.table')).find(table => table.querySelector('tbody') && !isTopicsTable(table)) || null;
    }

    function transformTableToCards() {
      const forumTable = findForumsTable()?.querySelector('tbody');
      if (!forumTable) {
        console.warn('[Forum Cards] Tableau forums introuvable');
        return;
      }

      const rows = Array.from(forumTable.querySelectorAll('tr'));
      if (rows.length === 0) {
        console.warn('[Forum Cards] Aucun forum trouvé');
        return;
      }

      const cardsContainer = document.createElement('div');
      cardsContainer.className = 'forums-cards-container';
      cardsContainer.setAttribute('role', 'list');

      rows.forEach((row, index) => {
        try {
          const card = createForumCard(row, index);
          if (card) {
            cardsContainer.appendChild(card);
          }
        } catch (error) {
          console.error('[Forum Cards] Erreur création carte:', error);
        }
      });

      // Remplacement du tableau par les cards
      const tableElement = forumTable.closest('table');
      if (tableElement && tableElement.parentNode) {
        tableElement.parentNode.insertBefore(cardsContainer, tableElement);
        tableElement.style.display = 'none';
        tableElement.setAttribute('data-mobile-hidden', 'true');
      }

      console.log(`[Forum Cards] ${rows.length} forums transformés en cards`);
    }

    function createForumCard(row, index) {
      const cells = row.querySelectorAll('td');
      if (cells.length < 3) {return null;}

      // === EXTRACTION DES DONNÉES ===

      // Cellule 1: Titre, description, modérateurs
      const titleCell = cells[0];
      const titleLink = titleCell.querySelector('p:first-child a');
      if (!titleLink) {return null;}

      const title = titleLink.textContent.trim();
      const forumUrl = titleLink.getAttribute('href');

      // Description (2e paragraphe)
      const descriptionP = titleCell.querySelector('p:nth-child(2)');
      const description = descriptionP ? descriptionP.textContent.trim() : '';

      // Modérateurs (div avec classe contenant "mod" ou texte "Modérateurs")
      const moderators = [];
      const modElements = titleCell.querySelectorAll('div, span');
      modElements.forEach(el => {
        const text = el.textContent;
        if (text.includes('Modérateur')) {
          const links = el.querySelectorAll('a');
          links.forEach(link => {
            const name = link.textContent.trim();
            if (name && !name.includes('[mod]')) {
              moderators.push({
                name: name.replace(/\[.*?\]/g, '').trim(),
                url: link.getAttribute('href')
              });
            }
          });
        }
      });

      // Cellule 2: Nombre de sujets
      const topicsText = cells[1]?.textContent.trim().replace('·', '').trim() || '0 sujets';

      // Cellule 3: Nombre de messages
      const messagesText = cells[2]?.textContent.trim() || '0 messages';

      // Cellule 4: Dernière activité
      let lastActivity = '';
      let lastUser = '';
      let lastTime = '';
      if (cells[3]) {
        const activityText = cells[3].textContent.trim();
        const userLink = cells[3].querySelector('a');
        if (userLink) {
          lastUser = userLink.textContent.trim();
          // Extraire le timestamp (format "Aujourd'hui (HH:MM)")
          const timeMatch = activityText.match(/(\w+.*?\(\d{2}:\d{2}\))/);
          lastTime = timeMatch ? timeMatch[1] : '';
        }
        lastActivity = activityText.replace('→', '').trim();
      }

      // === CRÉATION DE LA CARTE ===

      const card = document.createElement('article');
      card.className = 'forum-card';
      card.setAttribute('role', 'listitem');
      card.setAttribute('data-forum-index', index);

      // Lien englobant (accessibility)
      const cardLink = document.createElement('a');
      cardLink.href = forumUrl;
      cardLink.className = 'forum-card-link';
      cardLink.setAttribute('aria-label', `Accéder au forum ${title}`);

      // Contenu de la carte
      let cardHTML = `
        <div class="forum-card-header">
          <h3 class="forum-title">${title}</h3>
        </div>
      `;

      if (description) {
        cardHTML += `<p class="forum-description">${description}</p>`;
      }

      if (moderators.length > 0) {
        const modText = moderators.length > 2
          ? `${moderators[0].name}, ${moderators[1].name}...`
          : moderators.map(m => m.name).join(', ');
        cardHTML += `<p class="forum-moderators">Mod: ${modText}</p>`;
      }

      cardHTML += '<div class="forum-footer">';

      // Stats
      cardHTML += `
        <div class="forum-stats">
          <span class="forum-topics">${topicsText}</span>
          <span class="forum-separator">·</span>
          <span class="forum-messages">${messagesText}</span>
        </div>
      `;

      // Dernière activité
      if (lastActivity && lastUser) {
        cardHTML += `
          <div class="forum-last-activity">
            <span class="last-user">${lastUser}</span>
            <span class="last-time"> · ${lastTime}</span>
          </div>
        `;
      }

      cardHTML += '</div>'; // Fermeture forum-footer

      cardLink.innerHTML = cardHTML;

      // FORCER les styles inline avec !important pour contourner Bootstrap
      cardLink.style.setProperty('display', 'flex', 'important');
      cardLink.style.setProperty('flex-direction', 'column', 'important');
      cardLink.style.setProperty('align-items', 'flex-start', 'important');
      cardLink.style.setProperty('justify-content', 'flex-start', 'important');
      cardLink.style.setProperty('width', '100%', 'important');

      card.appendChild(cardLink);

      return card;
    }

    // === ENREGISTREMENT DANS InitQueue ===

    function init() {
      // Vérifier le mode mobile - doit être fait ici pour éviter d'accéder à document.body avant DOMContentLoaded
      if (!document.body.classList.contains('mobile-mode')) {
        console.log('[Forum Cards] Mode desktop détecté, transformation annulée');
        return;
      }

      // Attendre que le DOM soit prêt
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', transformTableToCards);
      } else {
        transformTableToCards();
      }
    }

    // Priorité 15: après navigation menus (10) mais avant autres transformations
    InitQueue.register('ForumCards:MobileTransform', init, 15);

  })();

  /**
   * MODULE: Mini-Chat FAB (Floating Action Button)
   * Transforme le mini-chat latéral en overlay fullscreen sur mobile
   */
  (function initMiniChatFAB() {
    'use strict';

    function createChatFAB() {
      if (!document.body.classList.contains('mobile-mode')) {return;}
      const miniChat = document.getElementById('flap');
      if (!miniChat) {return;}

      // Masquer le mini-chat par défaut sur mobile (visibility au lieu de display
      // pour que le code AJAX natif du site puisse toujours accéder aux enfants du #flap)
      miniChat.style.visibility = 'hidden';
      miniChat.style.position = 'fixed';
      miniChat.style.left = '-9999px';
      miniChat.classList.add('mini-chat-overlay');

      // Créer le bouton flottant
      const fab = document.createElement('button');
      fab.className = 'mini-chat-fab';
      fab.innerHTML = '<span class="fab-text">MC</span>';
      fab.setAttribute('aria-label', 'Ouvrir le mini-chat');
      fab.setAttribute('type', 'button');

      // Toggle du mini-chat
      fab.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = miniChat.style.visibility === 'visible';

        if (isOpen) {
          miniChat.style.visibility = 'hidden';
          miniChat.style.left = '-9999px';
          fab.classList.remove('active');
          document.body.style.overflow = '';
        } else {
          miniChat.style.visibility = 'visible';
          miniChat.style.position = '';
          miniChat.style.left = '';
          miniChat.style.display = 'block';
          fab.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });

      // Bouton fermeture dans le chat
      const closeBtn = miniChat.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          miniChat.style.visibility = 'hidden';
          miniChat.style.left = '-9999px';
          fab.classList.remove('active');
          document.body.style.overflow = '';
        });
      }

      document.body.appendChild(fab);
      console.log('[Mini-Chat FAB] Initialisé');
    }

    InitQueue.register('MiniChat:FAB', createChatFAB, 20);

  })();

  // ============================================================================
  // FORUM TOPICS - Afficher les titres complets
  // Remplace les titres abrégés (...) par le texte complet du span invisible
  // ============================================================================
  (function () {
    function useFullTopicTitles() {
      // Cibler tous les sujets avec span.invisible
      const topics = document.querySelectorAll('p.nomargin');

      topics.forEach(topic => {
        const invisibleSpan = topic.querySelector('span.invisible');
        const link = topic.querySelector('a');

        if (invisibleSpan && link) {
          const fullTitle = invisibleSpan.textContent.trim();
          const currentTitle = link.textContent.trim();

          // Remplacer seulement si le titre est abrégé (contient ...)
          if (currentTitle.includes('(...)') && fullTitle) {
            link.textContent = fullTitle;
          }
        }
      });
    }

    InitQueue.register('ForumTopics:FullTitles', useFullTopicTitles, 5);

  })();

  // ============================================================================
  // SOUS-FORUM — statuts des sujets (refonte variante A, lot L1)
  // Le site ne donne qu'un état lu / non lu par sujet (icône dossier), un cadenas pour les sujets verrouillés et une liste de pages.
  // Ces états sont reportés en classes sur chaque <tr> (kr-topic-unread, kr-topic-locked, kr-topic-pages + data-kr-pages) et le non lu
  // reçoit une pastille « NON LU » en toutes lettres : le statut ne repose jamais sur la couleur seule.
  // Ne JAMAIS s'appuyer sur l'attribut title (Bootstrap le déplace vers data-original-title) : les marqueurs fiables sont les classes d'icônes.
  // Idempotent : relancé à chaque draw.dt (DataTables réutilise les mêmes <tr> et les déplace à chaque page, tri ou recherche).
  // ============================================================================
  (function () {
    'use strict';

    const isTopicsListTable = table => table.id === 'topics' || table.querySelector('tbody td:first-child a[href*="forum/sujet/"]') !== null;

    function processRow(row) {
      const cell = row.cells[0];
      const title = cell ? cell.querySelector('p') : null;
      if (!title || !title.querySelector('a')) {return;} // ligne « Aucun élément à afficher »

      const unread = cell.querySelector('i.fa.fa-folder') !== null;
      const locked = title.querySelector('i.fa-lock') !== null;
      const pageLists = cell.querySelectorAll('ul.pagination');
      const pages = pageLists.length > 1 ? pageLists[1].querySelectorAll('li').length : 0;

      row.classList.toggle('kr-topic-unread', unread);
      row.classList.toggle('kr-topic-locked', locked);
      row.classList.toggle('kr-topic-pages', pages > 0);
      if (pages > 0) {
        row.setAttribute('data-kr-pages', String(pages));
      } else {
        row.removeAttribute('data-kr-pages');
      }

      const badge = title.querySelector(':scope > .kr-topic-badge');
      if (unread && !badge) {
        // Le libellé vit dans un attribut et s'affiche par CSS (::before) : DataTables lit le texte des cellules (recherche, tri) et,
        // si le plug-in s'initialise après le userscript, un vrai texte « NON LU » ferait remonter tous les sujets non lus à la recherche « lu ».
        const chip = document.createElement('span');
        chip.className = 'kr-topic-badge';
        chip.setAttribute('data-kr-label', 'NON LU');
        title.appendChild(chip);
      } else if (!unread && badge) {
        badge.remove();
      }
    }

    function processAll() {
      Array.from(document.querySelectorAll('table')).filter(isTopicsListTable).forEach(table => {
        Array.from(table.tBodies).forEach(body => Array.from(body.rows).forEach(processRow));
      });
    }

    function initTopicStatus() {
      if (!document.body.classList.contains('page-forum')) {return;}
      const topics = document.getElementById('topics');
      if (!topics) {return;} // pas un sous-forum (index des forums, sujet, kramail)
      document.body.classList.add('kr-subforum');
      processAll();
      if (typeof jQuery !== 'undefined') {
        jQuery(topics).on('draw.dt', processAll);
      }
    }

    InitQueue.register('ForumTopics:Status', initTopicStatus, 24);
  })();

  // ============================================================================
  // SOUS-FORUM — pagination mobile (refonte variante A, lot L5)
  // DataTables affiche « Précédent 1 2 3 4 5 … 15 Suivant » (9 éléments) : trop large pour 375 px. On garde la première page, la dernière, la page
  // courante et, près des bords, les pages voisines ; les autres boutons natifs reçoivent .kr-page-hidden (masqués en CSS, jamais retirés) et un
  // « … » .kr-page-gap est inséré à chaque saut. Les boutons natifs (clics, aria-controls) ne sont pas touchés. Relancé à chaque draw.dt.
  // ============================================================================
  (function () {
    'use strict';

    function compactPagination(topics) {
      const pag = document.querySelector('#' + topics.id + '_wrapper .dataTables_paginate');
      if (!pag) {return;}
      pag.querySelectorAll('.kr-page-gap').forEach(gap => gap.remove());
      const numbered = Array.from(pag.querySelectorAll('a.paginate_button')).filter(a => /^\d+$/.test(a.textContent.trim()));
      if (numbered.length === 0) {return;}
      const mobile = document.body.classList.contains('mobile-mode');
      if (!mobile) {
        // Bureau : pagination native conservée telle quelle (un seul « … » natif par saut) ; on retire ce que le mode mobile aurait posé.
        pag.querySelectorAll('.kr-page-hidden').forEach(a => a.classList.remove('kr-page-hidden'));
        return;
      }
      // M-2 : le « … » natif de DataTables 1.10.5 est un <span> SANS classe (la classe .ellipsis n'existe que dans les versions récentes). On le repère
      // donc par son contenu (span feuille « … », hors .kr-page-gap) et on le masque comme les boutons : un seul « … » (le .kr-page-gap) par saut.
      // Le bureau retire tous les .kr-page-hidden ci-dessus, donc le « … » natif y est rétabli.
      pag.querySelectorAll('span').forEach(s => {
        if (s.children.length === 0 && !s.classList.contains('kr-page-gap') && s.textContent.trim() === '…') { s.classList.add('kr-page-hidden'); }
      });
      const nums = numbered.map(a => Number(a.textContent.trim()));
      const first = nums[0] === 1 ? nums[0] : 1;
      const last = nums[nums.length - 1];
      const currentButton = numbered.find(a => a.classList.contains('current'));
      const current = currentButton ? Number(currentButton.textContent.trim()) : first;
      const keep = new Set([first, last, current]);
      if (current <= 2) { [1, 2, 3].forEach(n => keep.add(n)); }
      if (current >= last - 1) { [last - 2, last - 1, last].forEach(n => keep.add(n)); }
      let previousShown = null;
      numbered.forEach((a, i) => {
        const hide = mobile && !keep.has(nums[i]);
        a.classList.toggle('kr-page-hidden', hide);
        if (hide) {return;}
        if (previousShown !== null && nums[i] - previousShown > 1) {
          const gap = document.createElement('span');
          gap.className = 'kr-page-gap';
          gap.setAttribute('aria-hidden', 'true');
          gap.textContent = '…';
          a.parentNode.insertBefore(gap, a);
        }
        previousShown = nums[i];
      });
    }

    function initPagination() {
      const topics = document.getElementById('topics');
      if (!topics || !document.body.classList.contains('page-forum') || typeof jQuery === 'undefined') {return;}
      compactPagination(topics);
      jQuery(topics).on('draw.dt', () => compactPagination(topics));
    }

    InitQueue.register('ForumTopics:Pagination', initPagination, 26);
  })();

  // ============================================================================
  // MOBILE FORUM TOPICS - libellés, navigation et ligne cliquable (sous-forum, lot L3)
  // - Chaque chiffre a son mot : « 13 messages · 75 vues · 2 pages ». Le mot est posé en attribut (data-kr-unit sur les cellules Msg et Vus,
  //   data-kr-pages-label sur la 1re cellule) et affiché par CSS (::after) : le texte des cellules reste celui du site (DataTables s'en sert
  //   pour la recherche et le tri, y compris s'il s'initialise après ce module). Singulier / pluriel écrits ici, à l'init et à chaque draw.dt.
  // - Le bouton → natif « aller au dernier message » reçoit un nom accessible (le title est déplacé par l'infobulle Bootstrap).
  // - Recherche et « Afficher » reçoivent un placeholder et un nom accessible (leurs libellés visibles sont masqués par CSS pour tenir sur une ligne).
  // - Navigation intelligente et ligne cliquable (comme avant) : le titre d'un sujet non lu suit le lien de l'icône dossier.
  // ============================================================================
  (function () {
    const plural = (n, one, many) => (n > 1 ? many : one);

    function labelRow(row) {
      const msgCell = row.querySelector('td:nth-child(2)');
      const viewsCell = row.querySelector('td:nth-child(3)');
      if (!msgCell || !viewsCell) {return;}
      const msg = parseInt(msgCell.textContent, 10);
      const views = parseInt(viewsCell.textContent, 10);
      if (!Number.isNaN(msg)) {msgCell.setAttribute('data-kr-unit', plural(msg, 'message', 'messages'));}
      if (!Number.isNaN(views)) {viewsCell.setAttribute('data-kr-unit', plural(views, 'vue', 'vues'));}

      const titleCell = row.querySelector('td:nth-child(1)');
      const pages = parseInt(row.getAttribute('data-kr-pages') || '0', 10);
      if (titleCell) {
        if (pages > 0) {
          titleCell.setAttribute('data-kr-pages-label', pages + ' ' + plural(pages, 'page', 'pages'));
        } else {
          titleCell.removeAttribute('data-kr-pages-label');
        }
      }

      const arrow = row.querySelector('td:nth-child(5) a.btn');
      if (arrow && !arrow.hasAttribute('aria-label')) {
        arrow.setAttribute('aria-label', arrow.getAttribute('data-original-title') || arrow.getAttribute('title') || 'aller au dernier message');
      }
    }

    function nameControls() {
      const search = document.querySelector('.dataTables_filter input');
      if (search) {
        if (!search.getAttribute('placeholder')) {search.setAttribute('placeholder', 'Rechercher…');}
        if (!search.hasAttribute('aria-label')) {search.setAttribute('aria-label', 'Rechercher dans les sujets');}
      }
      const length = document.querySelector('.dataTables_length select');
      if (length && !length.hasAttribute('aria-label')) {length.setAttribute('aria-label', 'Nombre de sujets par page');}
    }

    function enrichForumTopicsCards() {
      // N'exécuter qu'en mode mobile et uniquement sur les pages forum
      if (!document.body.classList.contains('mobile-mode')) {return;}
      if (!document.body.classList.contains('page-forum')) {return;}

      // Cibler la table #topics (DataTable)
      const forumTable = document.getElementById('topics');
      if (!forumTable) {return;}

      function processRows() {
        const rows = forumTable.querySelectorAll('tbody tr');
        if (rows.length === 0) {return;}
        nameControls();

        rows.forEach(row => {
          labelRow(row);

          // Éviter le double traitement des écouteurs (DataTables réutilise les mêmes <tr>)
          if (row.hasAttribute('data-stats-added')) {return;}
          row.setAttribute('data-stats-added', 'true');

          const titleCell = row.querySelector('td:nth-child(1)');
          if (!titleCell) {return;}

          // === SMART NAVIGATION ===
          // Détecter si l'icône "premier message non lu" existe
          const unreadIconLink = titleCell.querySelector('ul:first-of-type li a');
          const titleLink = titleCell.querySelector('p > a');

          if (unreadIconLink && titleLink) {
            // Sujet NON LU : rediriger le titre vers le lien de l'icône dossier
            titleLink.href = unreadIconLink.href;
            titleLink.setAttribute('data-smart-redirect', 'first-unread');
          }

          // === CARD CLIQUABLE ===
          if (titleLink) {
            row.style.cursor = 'pointer';

            row.addEventListener('click', (e) => {
              if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
              }
              titleLink.click();
            });
          }
        });

        console.log('[Forum Topics Mobile] Sujets enrichis');
      }

      // Exécuter immédiatement
      processRows();

      // Ré-exécuter à chaque draw DataTables (pagination, tri, recherche, y compris l'initialisation tardive du plug-in)
      if (typeof jQuery !== 'undefined') {
        jQuery(forumTable).on('draw.dt', function () {
          processRows();
        });
      }
    }

    InitQueue.register('ForumTopics:MobileStats', enrichForumTopicsCards, 25);

  })();

  // ============================================================================
  // MOBILE FORUM PERMANENT TOPICS - Stats avec icônes
  // Ajoute les icônes aux stats des "Sujets permanents"
  // ============================================================================
  (function () {
    function enrichPermanentTopicsStats() {
      // N'exécuter qu'en mode mobile
      if (!document.body.classList.contains('mobile-mode')) {return;}

      // L4 (sous-forum) : sur la page de liste des sujets (table#topics), les permanents tiennent sur une ligne (titre, non lu, date) :
      // compteurs, auteur et pages restent dans le sujet. Aucun bloc de statistiques n'est ajouté, les cellules natives ne sont pas masquées en JS.
      if (document.getElementById('topics')) {return;}
      // Cibler les panel-default (Sujets permanents)
      const panels = document.querySelectorAll('.panel-default');
      if (panels.length === 0) {return;}

      panels.forEach(panel => {
        const rows = panel.querySelectorAll('.table tbody tr');

        rows.forEach(row => {
          // Éviter le double traitement
          if (row.hasAttribute('data-permanent-icons-added')) {return;}
          row.setAttribute('data-permanent-icons-added', 'true');

          // Chercher les cellules de stats
          const cells = row.querySelectorAll('td');
          if (cells.length < 2) {return;}

          // Les stats sont dans les cellules 2 et 3 (index 1 et 2)
          const msgCell = cells[1];
          const viewsCell = cells[2];

          if (!msgCell || !viewsCell) {return;}

          // Extraire les valeurs
          const msgCount = msgCell.textContent.trim();
          const viewsCount = viewsCell.textContent.trim();

          // Créer un wrapper pour les stats avec icônes
          const statsWrapper = document.createElement('div');
          statsWrapper.className = 'permanent-topic-stats';
          statsWrapper.innerHTML = `
            <i class="fa fa-comment" aria-hidden="true"></i> ${msgCount}
            <span style="margin: 0 4px;">·</span>
            <i class="fa fa-eye" aria-hidden="true"></i> ${viewsCount}
          `;
          statsWrapper.style.cssText = `
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            color: var(--kr-text-secondary);
            order: 2;
            margin: 0 0 2px 0;
          `;

          // Remplacer les cellules originales par le wrapper
          msgCell.style.display = 'none';
          viewsCell.style.display = 'none';

          // Insérer le wrapper après la première cellule
          const firstCell = cells[0];
          if (firstCell) {
            firstCell.after(statsWrapper);
          }
        });
      });

      console.log('[Permanent Topics Mobile] Icônes ajoutées');
    }

    InitQueue.register('PermanentTopics:Icons', enrichPermanentTopicsStats, 25);

  })();

  // ============================================================================
  // MODULE : ForumHeader:MobileBreadcrumb
  // Transforme le header forum en fil d'ariane + FAB button
  // ============================================================================
  (function () {
    'use strict';

    // L2 : action « + Nouveau sujet » libellée (composant PR12 : .forum-thread-action-new). Le href est recopié tel quel du lien natif du h1.
    function createNewTopicAction(newTopicLink, extraClass) {
      const bar = document.createElement('div');
      bar.className = 'forum-thread-actions ' + extraClass;
      const action = document.createElement('a');
      action.setAttribute('href', newTopicLink.getAttribute('href'));
      action.className = 'forum-thread-action forum-thread-action-new';
      const icon = document.createElement('i');
      icon.className = 'fa fa-plus';
      icon.setAttribute('aria-hidden', 'true');
      action.appendChild(icon);
      action.appendChild(document.createTextNode(' Nouveau sujet'));
      bar.appendChild(action);
      return bar;
    }

    // L2 : en-tête du sous-forum (mobile). Fil d'Ariane « ◀◀ Jeu (HRP) › Débuter », titre en 24 px et « + Nouveau sujet » à droite ;
    // le même bouton est répété sous la pagination DataTables (hors du wrapper : DataTables ne le redessine pas).
    function transformSubforumHeader(forumHeading, backLink, newTopicLink, titleText) {
      const crumb = document.createElement('div');
      crumb.className = 'forum-mobile-breadcrumb';
      const back = backLink.cloneNode(true);
      back.className = 'forum-mobile-breadcrumb-link';
      ['data-toggle', 'data-placement', 'data-original-title', 'title', 'style'].forEach(attr => back.removeAttribute(attr));
      const separator = document.createElement('span');
      separator.className = 'forum-mobile-breadcrumb-sep';
      separator.setAttribute('aria-hidden', 'true');
      separator.textContent = '›';
      const current = document.createElement('span');
      current.className = 'forum-mobile-breadcrumb-current';
      current.textContent = titleText;
      crumb.append(back, separator, current);

      const head = document.createElement('div');
      head.className = 'forum-subforum-head';
      const title = document.createElement('span');
      title.className = 'forum-subforum-title';
      title.textContent = titleText;
      head.append(title, createNewTopicAction(newTopicLink, 'forum-subforum-actions-top'));

      forumHeading.innerHTML = '';
      forumHeading.style.cssText = `
        margin: 12px 16px !important;
        padding: 0 !important;
        background: transparent !important;
      `;
      forumHeading.append(crumb, head);

      if (!document.querySelector('.forum-subforum-actions-bottom')) {
        const anchor = document.getElementById('topics_wrapper') || document.getElementById('topics');
        anchor.insertAdjacentElement('afterend', createNewTopicAction(newTopicLink, 'forum-thread-actions-bottom forum-subforum-actions-bottom'));
      }
      console.log('[Forum Header Mobile] En-tête du sous-forum créé');
    }

    function transformForumHeader() {
      // Uniquement en mode mobile
      if (!document.body.classList.contains('mobile-mode')) {
        return;
      }

      // Ne pas exécuter sur les pages kramails (structure différente)
      if (window.location.pathname.includes('/kramail')) {
        return;
      }

      // Cibler le h1 qui contient "Taverne" et les liens
      const forumHeading = document.querySelector('.container h1');
      if (!forumHeading) {
        console.warn('[Forum Header Mobile] h1 non trouvé');
        return;
      }

      // Extraire le titre du forum (texte direct du h1)
      const titleText = Array.from(forumHeading.childNodes)
        .find(node => node.nodeType === Node.TEXT_NODE)
        ?.textContent.trim();

      if (!titleText) {
        return;
      }

      // Trouver les liens "Jeu (RP)" et "nouveau sujet"
      const links = forumHeading.querySelectorAll('a');
      if (links.length < 2) {
        return;
      }

      const backLink = links[0]; // Lien "Jeu (RP)"
      const newTopicLink = links[1]; // Lien "nouveau sujet"

      // L2 (sous-forum) : la page de liste des sujets (table#topics) a son propre en-tête : fil d'Ariane, titre, « + Nouveau sujet » libellé
      if (document.getElementById('topics') && !/\/forum\/post\//.test(window.location.pathname)) {
        transformSubforumHeader(forumHeading, backLink, newTopicLink, titleText);
        return;
      }
      // ========================================
      // 1. CRÉER LE FIL D'ARIANE AVEC BOUTON (+)
      // ========================================
      const breadcrumbWrapper = document.createElement('div');
      breadcrumbWrapper.className = 'forum-mobile-breadcrumb';
      breadcrumbWrapper.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
        font-size: 13px;
        color: var(--kr-text-secondary);
      `;

      // Partie gauche : breadcrumb
      const breadcrumbLeft = document.createElement('div');
      breadcrumbLeft.style.cssText = `
        display: flex;
        align-items: center;
        gap: 6px;
      `;

      // Cloner le lien "Jeu (RP)"
      const breadcrumbLink = backLink.cloneNode(true);
      breadcrumbLink.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: var(--kr-text-secondary);
        text-decoration: none;
        font-weight: 400;
        background: none;
        padding: 0;
        border: none;
        border-radius: 0;
      `;

      // Ajouter le séparateur ">"
      const separator = document.createElement('span');
      separator.textContent = '›';
      separator.style.cssText = `
        color: var(--kr-text-secondary);
        font-size: 13px;
        margin: 0 2px;
      `;

      // Titre actuel (Taverne)
      const currentTitle = document.createElement('span');
      currentTitle.textContent = titleText;
      currentTitle.style.cssText = `
        color: var(--kr-text-secondary);
        font-weight: 400;
      `;

      breadcrumbLeft.appendChild(breadcrumbLink);
      breadcrumbLeft.appendChild(separator);
      breadcrumbLeft.appendChild(currentTitle);

      // Partie droite : bouton (+)
      // F-01 : pas de « + » sur les pages d'édition (/forum/post/...) : il mènerait à « nouveau sujet » et ferait quitter la saisie
      const fab = document.createElement('a');
      fab.href = newTopicLink.href;
      fab.className = 'forum-new-topic-fab';
      fab.setAttribute('aria-label', 'Nouveau sujet');
      fab.innerHTML = '<span style="font-size: 24px; font-weight: 300; line-height: 1;">+</span>';
      fab.style.cssText = `
        width: 44px;
        height: 44px;
        min-width: 44px;
        border-radius: 50%;
        background: var(--kr-primary);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        text-decoration: none;
        transition: all 0.2s ease;
      `;

      // Feedback tactile
      fab.addEventListener('touchstart', function () {
        this.style.transform = 'scale(0.92)';
        this.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.3)';
      });

      fab.addEventListener('touchend', function () {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      });

      breadcrumbWrapper.appendChild(breadcrumbLeft);
      if (!/\/forum\/post\//.test(window.location.pathname)) {
        breadcrumbWrapper.appendChild(fab);
      }

      // ========================================
      // 2. REMPLACER LE CONTENU DU H1
      // ========================================
      forumHeading.innerHTML = '';
      forumHeading.style.cssText = `
        margin: 12px 16px !important;
        padding: 0 !important;
        background: transparent !important;
      `;

      forumHeading.appendChild(breadcrumbWrapper);

      console.log('[Forum Header Mobile] Fil d\'ariane + FAB créés');
    }

    InitQueue.register('ForumHeader:MobileBreadcrumb', transformForumHeader, 25);

  })();

  // ============================================================================
  // MODULE : Kramail:CharacterSwitcher
  // Ajoute un dropdown pour changer de personnage dans les kramails (mobile)
  // ============================================================================
  (function () {
    'use strict';

    function initKramailCharacterSwitcher() {
      // Uniquement en mode mobile
      if (!document.body.classList.contains('mobile-mode')) {
        return;
      }

      // Uniquement sur les pages kramails
      if (!window.location.pathname.includes('/kramail')) {
        return;
      }

      const h1 = document.querySelector('h1.page-header');
      const colLeft = document.getElementById('col-left');

      if (!h1 || !colLeft) {
        console.warn('[Kramail Character Switcher] h1 ou col-left non trouvé');
        return;
      }

      // Extraire le nom du personnage actuel depuis h1 (texte pour comparaisons)
      const currentCharName = Array.from(h1.childNodes)
        .find(node => node.nodeType === Node.TEXT_NODE)
        ?.textContent.trim();

      if (!currentCharName) {
        console.warn('[Kramail Character Switcher] Nom du personnage non trouvé');
        return;
      }

      // Fragment riche du nom (préserve les smileys <img>)
      const currentCharFragment = cloneVisibleContent(h1);

      // Extraire les personnages depuis col-left
      const characterLinks = Array.from(colLeft.querySelectorAll('a[href*="kramail/"]'))
        .filter(a => {
          // Filtrer uniquement les liens vers les kramails de personnages
          const href = a.getAttribute('href');
          return href && href.match(/kramail\/[^/]+-\d+-\d+$/);
        })
        .map(a => {
          // Trouver la catégorie (Compte Membre, Plateau, etc.)
          let category = '';
          let sibling = a.previousElementSibling;
          while (sibling) {
            if (sibling.classList && sibling.classList.contains('list-group-subtitle')) {
              category = sibling.textContent.trim();
              break;
            }
            sibling = sibling.previousElementSibling;
          }

          return {
            name: a.textContent.trim(),
            nameFragment: cloneVisibleContent(a),
            href: a.href,
            category: category,
            isActive: a.textContent.trim() === currentCharName
          };
        });

      if (characterLinks.length === 0) {
        console.warn('[Kramail Character Switcher] Aucun personnage trouvé');
        return;
      }

      // Si un seul personnage, pas besoin de dropdown
      if (characterLinks.length === 1) {
        return;
      }

      // Créer le dropdown
      const dropdown = document.createElement('div');
      dropdown.className = 'kramail-character-dropdown';
      dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--kr-bg-surface);
        border: 1px solid var(--kr-border-default);
        border-radius: var(--mobile-radius);
        box-shadow: var(--kr-shadow-lg);
        margin-top: 8px;
        z-index: 1000;
        display: none;
        overflow: hidden;
      `;

      // Créer les options
      characterLinks.forEach(char => {
        const option = document.createElement('a');
        option.href = char.href;
        option.className = 'kramail-character-option';
        option.style.cssText = `
          display: flex;
          flex-direction: column;
          padding: 12px 16px;
          min-height: 44px;
          text-decoration: none;
          color: var(--kr-text-primary);
          border-bottom: 1px solid var(--kr-border-default);
          transition: background var(--transition-fast);
        `;

        // Nom du personnage
        const nameSpan = document.createElement('div');
        nameSpan.style.cssText = `
          font-size: 16px;
          font-weight: ${char.isActive ? '600' : '400'};
          display: flex;
          align-items: center;
          gap: 8px;
        `;
        setRichContent(nameSpan, char.nameFragment);

        // Icône check si actif
        if (char.isActive) {
          const checkIcon = document.createElement('span');
          checkIcon.textContent = '✓';
          checkIcon.style.cssText = `
            color: var(--kr-primary);
            font-weight: 700;
          `;
          nameSpan.insertBefore(checkIcon, nameSpan.firstChild);
        }

        option.appendChild(nameSpan);

        // Catégorie (si disponible)
        if (char.category) {
          const categorySpan = document.createElement('div');
          categorySpan.style.cssText = `
            font-size: 13px;
            color: var(--kr-text-muted);
            margin-top: 2px;
          `;
          categorySpan.textContent = `(${char.category})`;
          option.appendChild(categorySpan);
        }

        // Feedback tactile
        option.addEventListener('touchstart', () => {
          option.style.background = 'var(--kr-bg-active)';
        }, { passive: true });

        option.addEventListener('touchend', () => {
          option.style.background = '';
        }, { passive: true });

        option.addEventListener('mouseenter', () => {
          option.style.background = 'var(--kr-bg-hover)';
        });

        option.addEventListener('mouseleave', () => {
          option.style.background = '';
        });

        dropdown.appendChild(option);
      });

      // Wrapper pour le titre + icône
      const titleWrapper = document.createElement('div');
      titleWrapper.className = 'kramail-character-selector';
      titleWrapper.style.cssText = `
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        user-select: none;
        padding: 8px 12px;
        margin: -8px -12px;
        border-radius: var(--mobile-radius);
        transition: background var(--transition-fast);
      `;

      // Remplacer le texte du nom par le wrapper
      const textNode = Array.from(h1.childNodes).find(node =>
        node.nodeType === Node.TEXT_NODE && node.textContent.trim() === currentCharName
      );

      if (!textNode) {
        console.warn('[Kramail Character Switcher] Nœud texte non trouvé');
        return;
      }

      // Créer les éléments du titre
      const nameSpan = document.createElement('span');
      setRichContent(nameSpan, currentCharFragment);
      nameSpan.style.fontWeight = '700';

      const iconSpan = document.createElement('span');
      iconSpan.textContent = '▼';
      iconSpan.className = 'kramail-dropdown-icon';
      iconSpan.style.cssText = `
        font-size: 12px;
        transition: transform var(--transition-fast);
        color: var(--kr-text-secondary);
      `;

      titleWrapper.appendChild(nameSpan);
      titleWrapper.appendChild(iconSpan);
      titleWrapper.appendChild(dropdown);

      // Remplacer le texte par le wrapper
      h1.insertBefore(titleWrapper, textNode);
      textNode.remove();

      // Gérer l'ouverture/fermeture du dropdown
      let isOpen = false;

      const toggleDropdown = () => {
        isOpen = !isOpen;
        dropdown.style.display = isOpen ? 'block' : 'none';
        iconSpan.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        titleWrapper.style.background = isOpen ? 'var(--kr-bg-hover)' : '';
      };

      const closeDropdown = () => {
        if (isOpen) {
          isOpen = false;
          dropdown.style.display = 'none';
          iconSpan.style.transform = 'rotate(0deg)';
          titleWrapper.style.background = '';
        }
      };

      titleWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
      });

      // Fermer si on clique ailleurs
      document.addEventListener('click', (e) => {
        if (!titleWrapper.contains(e.target)) {
          closeDropdown();
        }
      });

      // Fermer lors de la navigation (au cas où)
      dropdown.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          closeDropdown();
        });
      });

      console.log('[Kramail Character Switcher] Dropdown créé avec', characterLinks.length, 'personnages');
    }

    // Observer les changements de mode mobile/desktop pour réinitialiser le dropdown
    function observeMobileMode() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            const isMobile = document.body.classList.contains('mobile-mode');
            const dropdownExists = document.querySelector('.kramail-character-selector');

            // Si on est en mobile ET que le dropdown n'existe pas, le créer
            if (isMobile && !dropdownExists && window.location.pathname.includes('/kramail')) {
              console.log('[Kramail Character Switcher] Réinitialisation du dropdown (changement de mode)');
              initKramailCharacterSwitcher();
            }
          }
        });
      });

      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    InitQueue.register('Kramail:CharacterSwitcher', initKramailCharacterSwitcher, 30);
    InitQueue.register('Kramail:CharacterSwitcher:Observer', observeMobileMode, 31);

  })();

  // ============================================================================
  // MODULE : Kramail:MobileEnhancer
  // Clone le bouton d'actions "+" (sélection/suppression) du thead
  // vers la barre de boutons pour accès mobile
  // ============================================================================
  (function () {
    'use strict';

    function initKramailMobileEnhancer() {
      // Uniquement en mode mobile
      if (!document.body.classList.contains('mobile-mode')) {
        return;
      }

      // Uniquement sur les pages kramails
      if (!window.location.pathname.includes('/kramail')) {
        return;
      }

      const pullRight = document.querySelector('h1.page-header .pull-right');
      if (!pullRight) {
        console.warn('[Kramail Mobile Enhancer] .pull-right non trouvé');
        return;
      }

      // Cloner le .btn-group (bouton "+" avec dropdown) du thead
      const originalBtnGroup = document.querySelector('#topics thead .btn-group');
      if (!originalBtnGroup) {
        console.warn('[Kramail Mobile Enhancer] .btn-group non trouvé dans le thead');
        return;
      }

      const clone = originalBtnGroup.cloneNode(true);
      clone.classList.add('kramail-actions-mobile');
      pullRight.appendChild(clone);

      // Remplacer l'icône "+" par un menu kebab (⋮)
      const toggleBtn = clone.querySelector('.dropdown-toggle');
      if (toggleBtn) {
        toggleBtn.innerHTML = '<i class="fas fa-ellipsis-v"></i>';
      }

      // Gérer le toggle dropdown manuellement (car les handlers Bootstrap ne sont pas clonés)
      const dropdownMenu = clone.querySelector('.dropdown-menu');

      if (toggleBtn && dropdownMenu) {
        toggleBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          clone.classList.toggle('open');
        });

        // Fermer le dropdown quand on clique ailleurs
        document.addEventListener('click', function (e) {
          if (!clone.contains(e.target)) {
            clone.classList.remove('open');
          }
        });

        // Rebrancher les onclick des items du menu
        // 1) "Tout sélectionner" — toggle toutes les checkboxes directement
        const allboxClone = clone.querySelector('#allbox');
        if (allboxClone) {
          allboxClone.removeAttribute('id');
          allboxClone.setAttribute('name', 'allbox-mobile');
          allboxClone.removeAttribute('onclick');

          function toggleAllMessages(checked) {
            const boxes = document.querySelectorAll('input[type="checkbox"][name="c[]"]');
            boxes.forEach(function (cb) { cb.checked = checked; });
            // Synchroniser aussi la checkbox originale du thead
            const original = document.querySelector('#allbox');
            if (original) {original.checked = checked;}
          }

          allboxClone.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleAllMessages(allboxClone.checked);
          });

          // Rendre le label cliquable aussi
          const label = allboxClone.closest('a');
          if (label) {
            label.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              allboxClone.checked = !allboxClone.checked;
              toggleAllMessages(allboxClone.checked);
            });
          }
        }

        // 2) Marquer lu/non lu — inline onclick appelle flagKramail(...)
        // 3) Marquer important — inline onclick appelle flagKramail(...)
        // 4) Supprimer — classe .alertdel
        // Ces handlers utilisent des fonctions globales, les inline onclick sont clonés
        // mais il faut aussi fermer le dropdown après action
        const menuItems = clone.querySelectorAll('.dropdown-menu li a');
        menuItems.forEach(item => {
          item.addEventListener('click', function () {
            // Fermer le dropdown après action
            setTimeout(function () {
              clone.classList.remove('open');
            }, 200);
          });
        });
      }

      console.log('[Kramail Mobile Enhancer] Bouton "+" cloné dans la barre de navigation');
    }

    InitQueue.register('Kramail:MobileEnhancer', initKramailMobileEnhancer, 32);

  })();

  // ============================================================================
  // MODULE : Kramail:PostMobileEnhancer
  // Restructure la page de lecture d'un message kramail pour mobile :
  //   - Déplace les boutons dans h1 .pull-right (harmonisation inbox)
  //   - Crée un menu kebab pour les actions secondaires
  //   - Restructure le message (header horizontal, corps pleine largeur)
  // ============================================================================
  (function () {
    'use strict';

    function initKramailPostMobileEnhancer() {
      // Uniquement en mode mobile
      if (!document.body.classList.contains('mobile-mode')) {
        return;
      }

      // Uniquement sur les pages kramail/post/*
      if (!window.location.pathname.match(/\/kramail\/post\//)) {
        return;
      }

      const h1 = document.querySelector('h1.page-header');
      const forumTop = document.querySelector('.forum-top');
      if (!h1 || !forumTop) {
        console.warn('[Kramail Post Mobile] h1 ou .forum-top non trouvé');
        return;
      }

      const originalPullRight = forumTop.querySelector('.pull-right');
      if (!originalPullRight) {
        console.warn('[Kramail Post Mobile] .pull-right non trouvé dans .forum-top');
        return;
      }

      // --- 1. Déplacer les boutons dans h1 ---
      const buttons = Array.from(originalPullRight.querySelectorAll('a.btn'));
      if (buttons.length === 0) {
        console.warn('[Kramail Post Mobile] Aucun bouton trouvé');
        return;
      }

      // Créer un span.pull-right dans h1 (comme l'inbox)
      const newPullRight = document.createElement('span');
      newPullRight.className = 'pull-right';

      // Boutons principaux (4 premiers) : Réception, Reply, Reply All, Forward
      // Boutons secondaires (les 4 restants) : Report, Delete, New, Contacts
      const primaryButtons = buttons.slice(0, 4); // backward, reply, reply-all, share
      const secondaryButtons = buttons.slice(4);   // exclamation, times, envelope, user

      // Ajouter les boutons principaux (icon-only)
      primaryButtons.forEach(function (btn) {
        // Masquer le texte (le bouton Réception a du texte "Réception")
        var textNodes = Array.from(btn.childNodes).filter(function (n) { return n.nodeType === 3; });
        textNodes.forEach(function (t) { t.textContent = ''; });
        // Marquer le bouton Réception comme btn-primary (retour inbox = onglet actif)
        if (btn.querySelector('.fa-backward')) {
          btn.classList.add('btn-primary');
        }
        newPullRight.appendChild(btn);
      });

      // Créer le menu kebab pour les actions secondaires
      var kebab = document.createElement('div');
      kebab.className = 'btn-group kramail-post-kebab';

      var kebabToggle = document.createElement('button');
      kebabToggle.className = 'btn btn-default dropdown-toggle';
      kebabToggle.type = 'button';
      kebabToggle.innerHTML = '<i class="fas fa-ellipsis-v"></i>';

      var kebabMenu = document.createElement('ul');
      kebabMenu.className = 'dropdown-menu dropdown-menu-right';
      kebabMenu.setAttribute('role', 'menu');

      // Labels pour les icônes secondaires
      var labels = {
        'fa-exclamation-triangle': 'Signaler',
        'fa-times': 'Supprimer',
        'fa-envelope': 'Nouveau message',
        'fa-user': 'Contacts'
      };

      secondaryButtons.forEach(function (btn) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = btn.getAttribute('href') || '#';

        var icon = btn.querySelector('i');
        var iconClass = icon ? icon.className : '';
        var labelText = '';

        // Récupérer le label via la map
        Object.keys(labels).forEach(function (key) {
          if (iconClass.indexOf(key) !== -1) {
            labelText = labels[key];
          }
        });

        a.innerHTML = '<i class="' + iconClass + '"></i> <span class="label-simple">' + labelText + '</span>';

        // Copier les classes spéciales (alertdel)
        if (btn.classList.contains('alertdel')) {
          a.classList.add('alertdel');
        }

        // Copier le onclick si présent
        var onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr) {
          a.setAttribute('onclick', onclickAttr);
        }

        li.appendChild(a);
        kebabMenu.appendChild(li);
      });

      kebab.appendChild(kebabToggle);
      kebab.appendChild(kebabMenu);
      newPullRight.appendChild(kebab);

      h1.appendChild(newPullRight);

      // Gérer le toggle dropdown manuellement
      kebabToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        kebab.classList.toggle('open');
      });

      document.addEventListener('click', function (e) {
        if (!kebab.contains(e.target)) {
          kebab.classList.remove('open');
        }
      });

      // Fermer le dropdown après action
      kebabMenu.querySelectorAll('a').forEach(function (item) {
        item.addEventListener('click', function () {
          setTimeout(function () { kebab.classList.remove('open'); }, 200);
        });
      });

      // Marquer forum-top comme déplacé (pour le cacher en CSS)
      originalPullRight.classList.add('kramail-actions-moved');

      // --- 2. Restructurer le message ---
      var well = document.querySelector('ul.media-list.forum > li.media.well');
      if (!well) {
        console.warn('[Kramail Post Mobile] .media.well non trouvé');
        return;
      }

      well.classList.add('kramail-post-restructured');

      // Extraire les données depuis le DOM original
      var pullLeft = well.querySelector('.pull-left');
      var mediaBody = well.querySelector('.media-body');
      if (!pullLeft || !mediaBody) {
        console.warn('[Kramail Post Mobile] pull-left ou media-body manquant');
        return;
      }

      // Avatar
      var avatarImg = pullLeft.querySelector('img.avatar');
      var avatarSrc = avatarImg ? avatarImg.src : '';
      var avatarAlt = avatarImg ? avatarImg.alt : '';

      // Nom de l'expéditeur
      var senderLink = pullLeft.querySelector('.cartouche strong a');
      var senderName = senderLink ? senderLink.textContent : avatarAlt;
      var senderNameFragment = senderLink ? cloneVisibleContent(senderLink) : null;
      var senderHref = senderLink ? senderLink.href : '#';

      // Date
      var dateSpan = mediaBody.querySelector('.btn-group-xs .btn');
      var dateText = '';
      if (dateSpan) {
        dateText = dateSpan.textContent.replace('posté', '').trim();
      }

      // Destinataires (le paragraphe "Envoyé à :")
      var recipientsP = mediaBody.querySelector('p');
      var recipientsHTML = recipientsP ? recipientsP.innerHTML : '';

      // Corps du message
      var contentDiv = mediaBody.querySelector('.t');
      var contentHTML = contentDiv ? contentDiv.innerHTML : '';

      // Signature (tout ce qui est après .t dans media-body)
      // C'est le texte après la div.t : <br>___<br><br> + font + texte
      var signatureHTML = '';
      if (contentDiv) {
        var sibling = contentDiv.nextSibling;
        var sigParts = [];
        while (sibling) {
          if (sibling.nodeType === 1) {
            sigParts.push(sibling.outerHTML);
          } else if (sibling.nodeType === 3 && sibling.textContent.trim()) {
            sigParts.push(sibling.textContent);
          }
          sibling = sibling.nextSibling;
        }
        signatureHTML = sigParts.join('');
        // Nettoyer le séparateur ___
        signatureHTML = signatureHTML.replace(/^(<br\s*\/?>)*\s*___\s*(<br\s*\/?>)*/i, '').trim();
      }

      // --- 3. Construire la nouvelle structure ---
      // Header : avatar + nom + date
      var msgHeader = document.createElement('div');
      msgHeader.className = 'kramail-msg-header';
      var avatarImgEl = document.createElement('img');
      avatarImgEl.className = 'kramail-msg-avatar';
      avatarImgEl.src = avatarSrc;
      avatarImgEl.alt = avatarAlt;

      var headerInfo = document.createElement('div');
      headerInfo.className = 'kramail-msg-header-info';

      var senderDiv = document.createElement('div');
      senderDiv.className = 'kramail-msg-sender';
      var senderA = document.createElement('a');
      senderA.href = senderHref;
      if (senderNameFragment) {
        senderA.appendChild(senderNameFragment);
      } else {
        senderA.textContent = senderName;
      }
      senderDiv.appendChild(senderA);

      var dateDiv = document.createElement('div');
      dateDiv.className = 'kramail-msg-date';
      var clockIcon = document.createElement('i');
      clockIcon.className = 'fa fa-clock-o';
      dateDiv.appendChild(clockIcon);
      dateDiv.appendChild(document.createTextNode(' ' + dateText));

      headerInfo.appendChild(senderDiv);
      headerInfo.appendChild(dateDiv);
      msgHeader.appendChild(avatarImgEl);
      msgHeader.appendChild(headerInfo);

      // Destinataires
      var msgRecipients = document.createElement('div');
      msgRecipients.className = 'kramail-msg-recipients';
      msgRecipients.innerHTML = recipientsHTML;

      // Corps du message
      var msgBody = document.createElement('div');
      msgBody.className = 'kramail-msg-body';
      msgBody.innerHTML = contentHTML;

      // Signature (si non vide)
      if (signatureHTML.length > 5) {
        var msgSig = document.createElement('div');
        msgSig.className = 'kramail-msg-signature';
        msgSig.innerHTML = signatureHTML;
        msgBody.appendChild(msgSig);
      }

      // Ajouter les nouveaux éléments au well
      well.appendChild(msgHeader);
      well.appendChild(msgRecipients);
      well.appendChild(msgBody);

      console.log('[Kramail Post Mobile] Page message restructurée');
    }

    InitQueue.register('Kramail:PostMobileEnhancer', initKramailPostMobileEnhancer, 33);

  })();

  // ============================================================================
  // MODULE : ForumThread:MobileBreadcrumb
  // Transforme le header des threads de forum en fil d'ariane + FAB button
  // ============================================================================
  (function () {
    'use strict';

    function transformForumThreadHeader() {
      // Uniquement en mode mobile
      if (!document.body.classList.contains('mobile-mode')) {
        return;
      }

      // Vérifier qu'on est sur une page de thread (pas la liste des topics)
      if (!window.location.pathname.includes('/forum/sujet/')) {
        return;
      }

      // Cibler le h1 et tous les div.forum-top qui contiennent les boutons
      const forumHeading = document.querySelector('.container h1.page-header');
      const forumTops = document.querySelectorAll('.forum-top');

      if (!forumHeading || forumTops.length === 0) {
        console.warn('[Forum Thread Mobile] h1 ou .forum-top non trouvé');
        return;
      }

      // Extraire le titre du thread (texte pour vérification, fragment pour affichage)
      const threadTitle = Array.from(forumHeading.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        .map(node => node.textContent.trim())[0];

      if (!threadTitle) {
        console.warn('[Forum Thread Mobile] Titre du thread non trouvé');
        return;
      }

      // Fragment riche du titre (préserve les smileys <img>)
      const threadTitleFragment = cloneVisibleContent(forumHeading);

      // Trouver les liens dans le premier .forum-top
      const firstForumTop = forumTops[0];
      const taverneLink = firstForumTop.querySelector('a[href*="forum/rp/"], a[href*="forum/hrp/"]'); // Lien vers le forum parent
      const newTopicLink = firstForumTop.querySelector('a[href*="nouveau-sujet"]');
      // Lien natif « répondre » du sujet (absent si le sujet est fermé) : lu avant que les .forum-top soient vidés
      const replyLink = firstForumTop.querySelector('a[href*="post/repondre"]');

      if (!taverneLink || !newTopicLink) {
        console.warn('[Forum Thread Mobile] Liens non trouvés', { taverneLink: !!taverneLink, newTopicLink: !!newTopicLink });
        return;
      }

      // Extraire le nom du forum parent (Taverne, etc.)
      const forumName = taverneLink.textContent.trim();

      // Déterminer la catégorie parente (RP/HRP) depuis l'URL
      const forumUrl = taverneLink.href;
      let categoryName = 'Jeu (RP)';
      let categoryUrl = 'forum/rp';

      if (forumUrl.includes('/forum/hrp/')) {
        categoryName = 'Jeu (HRP)';
        categoryUrl = 'forum/hrp';
      }

      // ========================================
      // FONCTION HELPER : Créer un fil d'ariane
      // ========================================
      function createBreadcrumb(isBottom = false) {
        const breadcrumbWrapper = document.createElement('div');
        breadcrumbWrapper.className = isBottom ? 'forum-thread-mobile-breadcrumb-bottom' : 'forum-thread-mobile-breadcrumb';
        breadcrumbWrapper.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          ${isBottom ? 'margin-top: 16px; margin-bottom: 16px; padding: 12px 16px;' : 'margin-bottom: 16px;'}
          font-size: 13px;
          color: var(--kr-text-secondary);
        `;

        // Partie gauche : breadcrumb
        const breadcrumbLeft = document.createElement('div');
        breadcrumbLeft.style.cssText = `
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
          min-width: 0;
        `;

        // Lien catégorie (Jeu RP)
        const categoryLink = document.createElement('a');
        categoryLink.href = categoryUrl;
        categoryLink.textContent = categoryName;
        categoryLink.style.cssText = `
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--kr-text-secondary);
          text-decoration: none;
          font-weight: 400;
          white-space: nowrap;
        `;

        // Séparateur 1
        const separator1 = document.createElement('span');
        separator1.textContent = '›';
        separator1.style.cssText = `
          color: var(--kr-text-secondary);
          font-size: 13px;
          margin: 0 2px;
          flex-shrink: 0;
        `;

        // Lien forum (Taverne)
        const forumLink = document.createElement('a');
        forumLink.href = taverneLink.href;
        forumLink.textContent = forumName;
        forumLink.style.cssText = `
          color: var(--kr-text-secondary);
          text-decoration: none;
          font-weight: 400;
          white-space: nowrap;
        `;

        // Séparateur 2
        const separator2 = document.createElement('span');
        separator2.textContent = '›';
        separator2.style.cssText = `
          color: var(--kr-text-secondary);
          font-size: 13px;
          margin: 0 2px;
          flex-shrink: 0;
        `;

        // Titre du thread (tronqué si nécessaire)
        const threadTitleSpan = document.createElement('span');
        setRichContent(threadTitleSpan, threadTitleFragment);
        threadTitleSpan.style.cssText = `
          color: var(--kr-text-secondary);
          font-weight: 400;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        `;

        breadcrumbLeft.appendChild(categoryLink);
        breadcrumbLeft.appendChild(separator1);
        breadcrumbLeft.appendChild(forumLink);
        breadcrumbLeft.appendChild(separator2);
        breadcrumbLeft.appendChild(threadTitleSpan);

        breadcrumbWrapper.appendChild(breadcrumbLeft);

        return breadcrumbWrapper;
      }

      // ========================================
      // FONCTION HELPER : actions du sujet (F-01)
      // « Répondre » (action principale) et « Nouveau sujet » (secondaire), libellés visibles,
      // en haut ET en bas du sujet. Les href sont ceux du site (attribut recopié tel quel).
      // ========================================
      function createThreadActions(isBottom) {
        const bar = document.createElement('div');
        bar.className = 'forum-thread-actions' + (isBottom ? ' forum-thread-actions-bottom' : '');
        function makeAction(link, className, iconClass, label) {
          const a = document.createElement('a');
          a.setAttribute('href', link.getAttribute('href'));
          a.className = 'forum-thread-action ' + className;
          const icon = document.createElement('i');
          icon.className = 'fa ' + iconClass;
          icon.setAttribute('aria-hidden', 'true');
          a.appendChild(icon);
          a.appendChild(document.createTextNode(' ' + label));
          return a;
        }
        if (replyLink) {
          bar.appendChild(makeAction(replyLink, 'forum-thread-action-reply', 'fa-reply', 'Répondre'));
        }
        bar.appendChild(makeAction(newTopicLink, 'forum-thread-action-new', 'fa-plus', 'Nouveau sujet'));
        return bar;
      }

      // ========================================
      // 1. REMPLACER LE CONTENU DU H1
      // ========================================
      forumHeading.innerHTML = '';
      forumHeading.style.cssText = `
        margin: 12px 16px !important;
        padding: 0 !important;
        background: transparent !important;
      `;
      forumHeading.appendChild(createBreadcrumb(false));
      forumHeading.appendChild(createThreadActions(false));

      // ========================================
      // 2. TRANSFORMER LES .forum-top (sauf le premier si c'est le même que le h1)
      // ========================================
      forumTops.forEach((forumTop, index) => {
        // Sauter le premier si on a déjà modifié le h1
        if (index === 0) {
          return;
        }
        forumTop.innerHTML = '';
        forumTop.style.cssText = `
          margin: 0 !important;
          padding: 0 !important;
          background: transparent !important;
          border: none !important;
        `;
        forumTop.appendChild(createThreadActions(true));
      });

      // ========================================
      // 3. NETTOYER LES ÉLÉMENTS SUPERFLUS
      // ========================================
      // Masquer les vieux boutons Bootstrap du milieu (actions redondantes)
      const actionButtons = document.querySelector('.container h1.page-header + .row + .row .btn-group');
      if (actionButtons) {
        actionButtons.style.display = 'none';
      }

      // Masquer les liens d'actions redondants (nouveau sujet, répondre, etc.)
      const forumTopActions = document.querySelectorAll('.forum-top a[href*="nouveau-sujet"]:not(.forum-thread-action), .forum-top a[href*="repondre"]:not(.forum-thread-action)');
      forumTopActions.forEach(action => {
        action.parentElement.style.display = 'none';
      });

      console.log('[Forum Thread Mobile] Fil d\'ariane + FAB créés (haut et bas) - Éléments superflus masqués');
    }

    InitQueue.register('ForumThread:MobileBreadcrumb', transformForumThreadHeader, 25);

  })();

  // ============================================================================
  // MODULE : ForumThread:HideTags
  // Masque les tags dans la vue détail du fil (ils sont inutiles et gênent la mise en page)
  // ============================================================================
  (function () {
    'use strict';

    function hideForumThreadTags() {
      console.log('[Forum Thread:HideTags] Function called');

      // Vérifier qu'on est sur une page de thread détail
      const pathname = window.location.pathname;
      if (!pathname.includes('/forum/sujet/')) {
        console.log('[Forum Thread:HideTags] Not on a forum thread page');
        return;
      }

      console.log('[Forum Thread:HideTags] On forum thread page, hiding tags after delay');

      // Les tags sont ajoutés dynamiquement, donc on doit attendre un peu
      // Utiliser un délai pour s'assurer qu'ils sont présents
      setTimeout(() => {
        console.log('[Forum Thread:HideTags] setTimeout fired');

        // Chercher tous les liens de tags (sans slash initial dans le href)
        const tagLinks = Array.from(document.querySelectorAll('a[href*="forum/tags"]'));
        console.log('[Forum Thread:HideTags] Found', tagLinks.length, 'tag links');

        if (tagLinks.length === 0) {
          console.log('[Forum Thread:HideTags] No tag links found');
          return;
        }

        // Chercher le conteneur parent qui contient TOUS les tags
        let current = tagLinks[0];
        while (current && current !== document.body) {
          current = current.parentElement;
          if (current && current.querySelectorAll('a[href*="forum/tags"]').length === tagLinks.length) {
            // Vérifier que ce n'est pas trop large
            const allLinks = current.querySelectorAll('a');
            console.log('[Forum Thread:HideTags] Found container with', allLinks.length, 'total links');
            if (allLinks.length < 50) { // Éviter de masquer la page entière
              current.style.display = 'none';
              console.log('[Forum Thread] Tags masqués (' + tagLinks.length + ' tag(s))');
              return;
            }
          }
        }

        // Fallback: masquer les éléments parents directs des tags
        tagLinks.forEach(link => {
          const parent = link.parentElement;
          if (parent && !parent.className.includes('forum')) {
            parent.style.display = 'none';
          }
        });

        console.log('[Forum Thread] Tags masqués (fallback)');
      }, 500); // 500ms devrait suffire
    }

    InitQueue.register('ForumThread:HideTags', hideForumThreadTags, 26);

  })();

  // ============================================================================
  // MODULE : Messages:V3 — messages du forum, lecture / rédaction / édition (mobile, maquette v3 validée)
  // Aucun nœud natif n'est cloné, recréé ni déplacé : la mise en page est faite en CSS (grille, ordre) sur les classes posées ici, les
  // liens, boutons, href, onclick et le texte du message restent ceux du site. La peau ajoute seulement deux boutons à elle
  // (« ••• » sur chaque message, « Plus » dans l'éditeur) et des classes/étiquettes. Kramail n'est pas concerné (chemin /forum/ seulement).
  // ============================================================================
  (function () {
    'use strict';

    const SECONDARY_LABELS = { profil: 'Profil', kramail: 'Kramail', signaler: 'Signaler', lien: 'Lien du message' };
    // Outils BBCode courants gardés en barre ; les 13 autres (souligné, barré, image, vidéo, spoiler, pré-formaté, couleurs, alignements, flottants, prévisualisation) sous « Plus »
    const COMMON_TOOLS = ['b', 'i', 'url', 'quote', 'smileys'];

    function isMessagesView() {
      return !!document.body && document.body.classList.contains('mobile-mode') && window.innerWidth < 768 && window.location.pathname.indexOf('/forum/') === 0;
    }

    function nativeTitle(el) {
      return (el.getAttribute('data-original-title') || el.getAttribute('title') || '').trim().toLowerCase();
    }

    function enhancePosts() {
      if (!window.location.pathname.includes('/forum/sujet/')) {return;}
      document.querySelectorAll('ul.media-list.forum > li.media:not(.kr-msg)').forEach(post => {
        const bar = post.querySelector(':scope > .media-body > .pull-right');
        if (!bar) {return;}
        const mark = (el, role) => {
          if (!el) {return;}
          el.classList.add('kr-msg-secondary');
          el.setAttribute('data-kr-label', SECONDARY_LABELS[role]);
        };
        mark(bar.querySelector('a[href*="communaute/membres/"]'), 'profil');
        const mails = Array.from(bar.querySelectorAll('a[href*="kramail/post/"]'));
        const reportIndex = mails.findIndex(a => nativeTitle(a).includes('signal'));
        mails.forEach((a, i) => mark(a, (reportIndex >= 0 ? i === reportIndex : i === 1) ? 'signaler' : 'kramail'));
        mark(bar.querySelector('button.btn'), 'lien');

        const more = document.createElement('button');
        more.type = 'button';
        more.className = 'btn btn-default kr-msg-more';
        more.setAttribute('aria-expanded', 'false');
        more.setAttribute('aria-label', 'Autres actions');
        const dots = document.createElement('span');
        dots.setAttribute('aria-hidden', 'true');
        dots.textContent = '•••';
        more.appendChild(dots);
        more.addEventListener('click', () => {
          const open = post.classList.toggle('kr-msg-open');
          more.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        bar.appendChild(more);
        post.classList.add('kr-msg');
      });
    }

    function toolKey(item) {
      if (item.classList.contains('dropdown')) {
        return item.querySelector('table') ? 'smileys' : 'couleurs';
      }
      const m = (item.getAttribute('href') || '').match(/addtag\('([^']+)'/);
      return m ? m[1] : 'autre';
    }

    function enhanceEditors() {
      document.querySelectorAll('form[name="post_msg"]').forEach(form => {
        const bar = form.querySelector('.btn-toolbar');
        if (!bar || bar.classList.contains('kr-tools-ready')) {return;}
        form.classList.add('kr-editor');
        const groups = Array.from(form.querySelectorAll('.form-group'));
        const sender = groups.find(g => g.querySelector('.input-group') && g.querySelector('select, input'));
        if (sender) {sender.classList.add('kr-sender-row');}
        const messageRow = groups.find(g => g.contains(bar));
        if (messageRow) {messageRow.classList.add('kr-message-row');}

        bar.querySelectorAll(':scope > .btn-group > a.btn, :scope > .btn-group > .dropdown').forEach(item => {
          const key = toolKey(item);
          item.setAttribute('data-kr-tool', key);
          if (!COMMON_TOOLS.includes(key)) {item.classList.add('kr-tool-extra');}
        });

        const spacer = document.createElement('span');
        spacer.className = 'kr-tools-break';
        spacer.setAttribute('aria-hidden', 'true');
        bar.appendChild(spacer);
        const plus = document.createElement('button');
        plus.type = 'button';
        plus.className = 'btn btn-default kr-tools-plus';
        plus.setAttribute('aria-expanded', 'false');
        plus.textContent = 'Plus';
        plus.addEventListener('click', () => {
          const open = bar.classList.toggle('kr-tools-open');
          plus.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        bar.appendChild(plus);
        bar.classList.add('kr-tools-ready');
      });
    }

    function initMessagesV3() {
      if (!isMessagesView()) {return;}
      enhancePosts();
      enhanceEditors();
    }

    InitQueue.register('Messages:V3', initMessagesV3, 27);

  })();

  function modifyNavigationMenus() {
    // Modification des liens des boutons principaux du menu
    const menuLinks = {
      'Jouer': 'jouer/plateau',
      'Règles': 'regles/avancees',
      'Monde': 'monde/evenements',
      'Communauté': 'communaute/membres'
    };

    let forumOriginalItem = null;

    // Vérifier si on est en mode mobile
    const isMobile = document.body.classList.contains('mobile-mode');

    // Modification des liens existants et ajout du comportement de redirection
    document.querySelectorAll('.navbar-nav .dropdown > a.dropdown-toggle').forEach(link => {
      const text = link.textContent.trim().replace(/\s*\n.*$/, '');

      // Traiter le menu Forum séparément (le menu original avant transformation)
      if (text.startsWith('Forum') && !text.includes('HRP') && !text.includes('RP')) {
        forumOriginalItem = link.closest('li.dropdown');
        return;
      }

      const menuKey = Object.keys(menuLinks).find(key => text.includes(key));
      if (menuKey && menuLinks[menuKey]) {
        link.href = menuLinks[menuKey];

        // EN DESKTOP UNIQUEMENT : Supprimer data-toggle pour empêcher le dropdown et forcer la navigation
        // EN MOBILE : Garder data-toggle pour permettre l'affichage du sous-menu
        if (!isMobile) {
          link.removeAttribute('data-toggle');

          // Marquer comme modifié pour éviter de ré-ajouter l'événement
          if (!link.hasAttribute('data-nav-modified')) {
            link.setAttribute('data-nav-modified', 'true');

            // S'assurer que le clic navigue vers la nouvelle URL
            link.addEventListener('click', function (e) {
              e.preventDefault();
              window.location.href = this.href;
              return false;
            });
          }
        } else {
          // EN MOBILE : Conserver/restaurer data-toggle="dropdown" pour Bootstrap 3
          link.setAttribute('data-toggle', 'dropdown');
        }
      }
    });

    // Remplacer le menu Forum original par Forum RP et Forum HRP
    if (forumOriginalItem && !document.querySelector('[data-forums-added]')) {
      // Récupérer le dropdown menu original pour le cloner
      const originalDropdown = forumOriginalItem.querySelector('.dropdown-menu');

      // Créer Forum RP
      const forumRpLi = document.createElement('li');
      forumRpLi.className = 'dropdown';
      forumRpLi.setAttribute('data-forums-added', 'rp');
      forumRpLi.innerHTML = `
        <a href="forum/rp" class="dropdown-toggle" role="button" aria-expanded="false" data-nav-modified="true">
          Forum RP <span class="caret"></span>
        </a>
        <ul class="dropdown-menu" role="menu">
          <li><a href="forum/rp/taverne-10101">Taverne</a></li>
          <li><a href="forum/rp/marche-10102">Marché</a></li>
          <li><a href="forum/rp/monde-10103">Monde</a></li>
          <li class="divider"></li>
          <li><a href="forum/rp">Autre</a></li>
        </ul>
      `;

      // Créer Forum HRP en clonant le dropdown original
      const forumHrpLi = document.createElement('li');
      forumHrpLi.className = 'dropdown';
      forumHrpLi.setAttribute('data-forums-added', 'hrp');
      forumHrpLi.innerHTML = `
        <a href="forum/hrp" class="dropdown-toggle" role="button" aria-expanded="false" data-nav-modified="true">
          Forum HRP <span class="caret"></span>
        </a>
      `;

      // Cloner le dropdown original et supprimer uniquement le lien "Jeu (RP)"
      if (originalDropdown) {
        const clonedDropdown = originalDropdown.cloneNode(true);
        // Supprimer le lien "Jeu (RP)" du dropdown cloné
        const rpLink = Array.from(clonedDropdown.querySelectorAll('li > a'))
          .find(a => a.textContent.includes('Jeu (RP)'));
        if (rpLink && rpLink.parentElement) {
          rpLink.parentElement.remove();
        }
        forumHrpLi.appendChild(clonedDropdown);
      }

      // Insérer Forum RP avant le Forum original
      if (forumOriginalItem.parentElement) {
        forumOriginalItem.parentElement.insertBefore(forumRpLi, forumOriginalItem);
        // Insérer Forum HRP après Forum RP (donc avant l'original aussi)
        forumOriginalItem.parentElement.insertBefore(forumHrpLi, forumOriginalItem);
      }
      // Supprimer le menu Forum original
      forumOriginalItem.remove();

      // EN DESKTOP UNIQUEMENT : Ajouter les comportements de navigation directe
      if (!isMobile) {
        const forumRpLink = forumRpLi.querySelector('a.dropdown-toggle');
        if (forumRpLink) {
          forumRpLink.removeAttribute('data-toggle');
          forumRpLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = this.href;
            return false;
          });
        }

        const forumHrpLink = forumHrpLi.querySelector('a.dropdown-toggle');
        if (forumHrpLink) {
          forumHrpLink.removeAttribute('data-toggle');
          forumHrpLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = this.href;
            return false;
          });
        }
      } else {
        // EN MOBILE : Garder data-toggle pour les dropdowns
        const forumRpLink = forumRpLi.querySelector('a.dropdown-toggle');
        if (forumRpLink) {
          forumRpLink.setAttribute('data-toggle', 'dropdown');
        }

        const forumHrpLink = forumHrpLi.querySelector('a.dropdown-toggle');
        if (forumHrpLink) {
          forumHrpLink.setAttribute('data-toggle', 'dropdown');
        }
      }

      // Créer les trois nouveaux menus : Forum Communauté, Forum Débats, Forum Staff

      const forumMenuParent = forumRpLi.parentElement;
      if (forumMenuParent && !document.querySelector('[data-forums-added="forum-communaute"]')) {
        // Vérifier si Staff existe dans le dropdown-menu original
        let staffExists = false;
        if (originalDropdown) {
          const staffLink = Array.from(originalDropdown.querySelectorAll('li > a'))
            .find(a => a.textContent.toLowerCase().includes('staff'));
          staffExists = !!staffLink;
        }

        // Menu Forum Communauté
        const forumCommunauteLi = document.createElement('li');
        forumCommunauteLi.className = 'dropdown';
        forumCommunauteLi.setAttribute('data-forums-added', 'forum-communaute');
        forumCommunauteLi.innerHTML = `
          <a href="forum/communaute" class="dropdown-toggle" role="button" aria-expanded="false" data-nav-modified="true">
            Forum Communauté <span class="caret"></span>
          </a>
          <ul class="dropdown-menu" role="menu">
            <li><a href="forum/communaute">Voir tous les sujets</a></li>
          </ul>
        `;

        // Menu Forum Débats
        const forumDebatsLi = document.createElement('li');
        forumDebatsLi.className = 'dropdown';
        forumDebatsLi.setAttribute('data-forums-added', 'forum-debats');
        forumDebatsLi.innerHTML = `
          <a href="forum/debats" class="dropdown-toggle" role="button" aria-expanded="false" data-nav-modified="true">
            Forum Débats <span class="caret"></span>
          </a>
          <ul class="dropdown-menu" role="menu">
            <li><a href="forum/debats">Voir tous les sujets</a></li>
          </ul>
        `;

        // Menu Forum Staff (uniquement si Staff existe dans le menu original)
        let forumStaffLi = null;
        if (staffExists) {
          forumStaffLi = document.createElement('li');
          forumStaffLi.className = 'dropdown';
          forumStaffLi.setAttribute('data-forums-added', 'forum-staff');
          forumStaffLi.innerHTML = `
            <a href="forum/staff" class="dropdown-toggle" role="button" aria-expanded="false" data-nav-modified="true">
              Forum Staff <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" role="menu">
              <li><a href="forum/staff">Voir tous les sujets</a></li>
            </ul>
          `;
        }

        // Insérer les nouveaux menus après Forum HRP
        forumMenuParent.insertBefore(forumCommunauteLi, forumHrpLi.nextSibling);
        forumMenuParent.insertBefore(forumDebatsLi, forumCommunauteLi.nextSibling);
        if (forumStaffLi) {
          forumMenuParent.insertBefore(forumStaffLi, forumDebatsLi.nextSibling);
        }

        // EN DESKTOP UNIQUEMENT : Ajouter les comportements de navigation directe
        if (!isMobile) {
          const menusToUpdate = [forumCommunauteLi, forumDebatsLi];
          if (forumStaffLi) {menusToUpdate.push(forumStaffLi);}

          menusToUpdate.forEach(li => {
            const link = li.querySelector('a.dropdown-toggle');
            if (link) {
              link.removeAttribute('data-toggle');
              link.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = this.href;
                return false;
              });
            }
          });
        } else {
          // EN MOBILE : Garder data-toggle pour les dropdowns
          const menusToUpdate = [forumCommunauteLi, forumDebatsLi];
          if (forumStaffLi) {menusToUpdate.push(forumStaffLi);}

          menusToUpdate.forEach(li => {
            const link = li.querySelector('a.dropdown-toggle');
            if (link) {
              link.setAttribute('data-toggle', 'dropdown');
            }
          });
        }
      }
    }

    // Ajout du menu Statistiques (une seule fois)
    const communauteItem = Array.from(document.querySelectorAll('.navbar-nav > li.dropdown'))
      .find(li => li.querySelector('a.dropdown-toggle')?.textContent.includes('Communauté') && !li.getAttribute('data-forums-added'));

    if (communauteItem && !document.querySelector('[data-stats-menu-added]')) {
      const statsLi = document.createElement('li');
      statsLi.className = 'dropdown';
      statsLi.setAttribute('data-stats-menu-added', 'true');
      statsLi.innerHTML = `
        <a href="monde/citoyens" class="dropdown-toggle" role="button" aria-expanded="false" data-nav-modified="true">
          Statistiques <span class="caret"></span>
        </a>
        <ul class="dropdown-menu" role="menu">
          <li><a href="communaute/stats">Communautés</a></li>
          <li><a href="monde/citoyens">Citoyens</a></li>
        </ul>
      `;

      if (communauteItem.parentElement) {
        communauteItem.parentElement.insertBefore(statsLi, communauteItem.nextSibling);
      }

      // EN DESKTOP UNIQUEMENT : Ajouter le comportement de navigation directe
      if (!isMobile) {
        const statsLink = statsLi.querySelector('a.dropdown-toggle');
        if (statsLink) {
          statsLink.removeAttribute('data-toggle');
          statsLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = this.href;
            return false;
          });
        }
      } else {
        // EN MOBILE : Garder data-toggle pour le dropdown
        const statsLink = statsLi.querySelector('a.dropdown-toggle');
        if (statsLink) {
          statsLink.setAttribute('data-toggle', 'dropdown');
        }
      }
    }
  }

  function markActiveIcons() {
    const markers = [
      { text: 'Membres actifs', cls: 'kr-icon-members' },
      { text: 'Personnages actifs', cls: 'kr-icon-characters' },
      { text: 'Personnes en ligne', cls: 'kr-icon-online' },
      { text: 'Présentation', cls: 'kr-icon-presentation' },
      { text: 'Médailles', cls: 'kr-icon-medals' }
    ];

    markers.forEach(m =>
      document.querySelectorAll('.' + m.cls).forEach(n => n.classList.remove(m.cls))
    );

    // Passe unique sur un sous-ensemble ciblé au lieu de querySelectorAll('*')
    const best = new Array(markers.length).fill(null);
    let found = 0;
    const candidates = document.querySelectorAll('a, p, h3, h4, div, span, li, td');

    for (const el of candidates) {
      const txt = (el.textContent || '').trim();
      if (!txt) {continue;}
      const len = txt.length;

      for (let i = 0; i < markers.length; i++) {
        if (!txt.includes(markers[i].text)) {continue;}
        const hasIcon = !!el.querySelector('i.fa, i.falarge, .glyphicon, svg');
        const score = (hasIcon ? 100 : 0) + Math.max(0, 200 - Math.min(len, 200));
        if (!best[i] || score > best[i].score) {
          if (!best[i]) {found++;}
          best[i] = { el, score };
        }
      }
      // Sortie anticipée si tous les marqueurs sont trouvés avec un score élevé
      if (found >= markers.length) {break;}
    }

    for (let i = 0; i < markers.length; i++) {
      if (best[i]?.el) {best[i].el.classList.add(markers[i].cls);}
    }
  }

  function replaceMcAnchors() {
    Array.from(document.querySelectorAll('a'))
      .filter(a => (a.textContent || '').trim() === 'MC')
      .forEach(a => {
        a.classList.add('kr-mc-icon');
        const title = a.getAttribute('data-original-title') || a.getAttribute('title') ||
                      (a.classList.contains('open') ? 'ouvrir le mini-chat' : 'fermer le mini-chat');
        if (title) {a.setAttribute('aria-label', title);}
        a.removeAttribute('aria-hidden');
      });
  }

  function replaceNavbarBrand() {
    const brand = document.querySelector('.navbar-brand');
    if (!brand) {return;}

    const variant = getVariant();
    const idx = CONFIG.LOGO_MAP[variant] || 1;
    const url = `http://img7.kraland.org/2/world/logo${idx}.gif`;

    const existing = brand.querySelector('img.kr-logo');
    if (existing?.src?.includes(`logo${idx}.gif`)) {return;}

    brand.innerHTML = '';
    const img = document.createElement('img');
    img.className = 'kr-logo';
    img.src = url;
    img.alt = 'Kraland';
    img.style.height = '28px';
    img.style.verticalAlign = 'middle';
    brand.appendChild(img);
  }

  function replaceSImages() {
    const map = { 's1.gif': '♂', 's2.gif': '♀', 's3.gif': '⚧' };
    const imgs = Array.from(document.querySelectorAll('img'))
      .filter(i => /img7\.kraland\.org\/.+\/(s[123]\.gif)$/.test(i.src));

    imgs.forEach(img => {
      const m = img.src.match(/(s[123]\.gif)$/);
      const key = m?.[1];
      const ch = map[key] || '';

      const span = document.createElement('span');
      span.className = 'kr-symbol kr-symbol-' + (key || 's');
      span.setAttribute('aria-hidden', 'true');
      span.textContent = ch;

      if (img.alt) {
        const sr = document.createElement('span');
        sr.className = 'kr-sr-only';
        sr.textContent = img.alt;
        span.appendChild(sr);
      }

      const sexAncestor = img.closest('[id*="sex"]');
      if (sexAncestor) {
        const strong = document.createElement('strong');
        strong.appendChild(span);
        img.replaceWith(strong);
      } else {
        img.replaceWith(span);
      }
    });
  }

  function reorderBtnGroupXs() {
    document.querySelectorAll('span.btn-group-xs').forEach(btn => {
      const parent = btn.parentElement;
      if (!parent) {return;}

      const strong = parent.querySelector('strong');
      if (strong && strong.parentElement === parent && btn.nextElementSibling !== strong) {
        parent.insertBefore(btn, strong);
        return;
      }

      const textNode = Array.from(parent.childNodes)
        .find(n => n.nodeType === 3 && n.textContent?.trim().length > 0);
      if (textNode && btn.nextSibling !== textNode) {
        parent.insertBefore(btn, textNode);
      }
    });
  }

  function ensureSexStrong() {
    document.querySelectorAll('[id*="ajax-sex"]').forEach(el => {
      if (el.querySelector('strong')) {return;}

      const sym = el.querySelector('.kr-symbol');
      if (sym && sym.parentElement) {
        const strong = document.createElement('strong');
        sym.parentElement.replaceChild(strong, sym);
        strong.appendChild(sym);
        return;
      }

      const tn = Array.from(el.childNodes)
        .find(n => n.nodeType === 3 && n.textContent?.trim().length > 0);
      if (tn && tn.parentElement) {
        const txt = tn.textContent.trim();
        const strong = document.createElement('strong');
        strong.textContent = txt;
        tn.textContent = tn.textContent.replace(txt, '');
        tn.parentElement.insertBefore(strong, tn.nextSibling);
      }
    });
  }

  function ensureFooterSticky() {
    const footer = document.querySelector('footer, .footer, .contentinfo');
    if (!footer) {return;}

    // Déplacer le footer à la fin du body pour que le flexbox fonctionne correctement
    if (footer.nextSibling !== null) {
      document.body.appendChild(footer);
    }

    const selectors = ['a[href="#top"]', 'a.to-top', '.back-to-top', '.scroll-top', 'a.well.well-sm'];
    let back = null;
    for (const s of selectors) {
      back = document.querySelector(s);
      if (back) {break;}
    }

    if (back) {
      back.classList.add('kraland-back-to-top');
      if (!back.getAttribute('aria-label')) {back.setAttribute('aria-label', 'Remonter en haut');}
      const whiteContainer = footer.querySelector('.container.white');
      if (whiteContainer) {
        whiteContainer.appendChild(back);
      } else if (back.parentElement !== footer) {
        footer.appendChild(back);
      }

      // PLT-09 : le bouton n'apparaît qu'une fois la page défilée (il ne masque plus le haut de page)
      const updateBackVisibility = () => {
        back.classList.toggle('kr-btt-visible', window.scrollY > 400);
      };
      window.addEventListener('scroll', updateBackVisibility, { passive: true });
      updateBackVisibility();
    }

    // Bootstrap 3.3 sticky footer: use margin-bottom on body
    if (!document.body.style.marginBottom) {
      document.body.style.marginBottom = '60px';
    }
  }

  /**
   * Affiche les informations de version du CSS dans le footer
   * - Version actuelle du userscript chargé
   * - Dernière version disponible sur GitHub (ou serveur local en dev)
   */
  function displayVersionInfo() {
    const footer = document.querySelector('footer, .footer, .contentinfo');
    if (!footer) {return;}

    // Créer l'élément de version s'il n'existe pas
    let versionDiv = footer.querySelector('.kraland-css-version');
    if (!versionDiv) {
      versionDiv = document.createElement('div');
      versionDiv.className = 'kraland-css-version';
      versionDiv.style.cssText = 'text-align: center; padding: 10px; font-size: 12px; color: #666;';

      const container = footer.querySelector('.container.white') || footer;
      container.appendChild(versionDiv);
    }

    // Afficher la version actuelle
    const currentVersion = CURRENT_VERSION !== '__USERSCRIPT_VERSION__' ? CURRENT_VERSION : 'dev';

    // En mode dev, afficher simplement "dev" sans essayer de fetch
    if (currentVersion === 'dev') {
      versionDiv.innerHTML = `<span>CSS : version courante <strong>${currentVersion}</strong> <span style="color: #5bc0de;">ℹ️ (mode développement)</span></span>`;
      return;
    }

    versionDiv.innerHTML = `<span>CSS : version courante <strong>${currentVersion}</strong>, dernière version <span id="latest-version">chargement...</span></span>`;

    // Déterminer l'URL du fichier version.json (GitHub en prod)
    const versionUrl = 'https://raw.githubusercontent.com/arnaudroubinet/kraland-css/refs/heads/main/version.json';

    // Récupérer la dernière version disponible
    fetch(versionUrl)
      .then(response => {
        if (!response.ok) {throw new Error('Fetch failed');}
        return response.json();
      })
      .then(data => {
        const latestSpan = document.getElementById('latest-version');
        if (latestSpan) {
          latestSpan.innerHTML = `<strong>${data.version}</strong>`;

          // Comparer les versions et afficher un indicateur si mise à jour disponible
          if (data.version !== currentVersion) {
            latestSpan.innerHTML += ' <span style="color: #d9534f;">⚠️ (mise à jour disponible)</span>';
          }
        }
      })
      .catch(error => {
        console.error('[Version Info] Erreur lors de la récupération de la version:', error);
        const latestSpan = document.getElementById('latest-version');
        if (latestSpan) {
          latestSpan.textContent = 'erreur';
        }
      });
  }

  function relocateKramailToLeft() {
    // Ne pas exécuter sur les pages kramails (préserver navigation Réception/Envoi/Corbeille)
    if (window.location.pathname.includes('/kramail')) {
      return;
    }

    const colT = document.getElementById('col-t');
    const colLeft = document.getElementById('col-left');
    if (!colT || !colLeft) {return;}

    // Supprimer les blocs Kramail
    colT.querySelectorAll('a[href*="kramail"]').forEach(a => {
      const container = a.closest('div,section,li,article');
      if (container && container !== colT && container.id !== 'col-t') {
        container.remove();
      } else {
        a.remove();
      }
    });

    // Sélectionner les éléments à déplacer
    const selectors = ['.ds_users', '.ds_characters', '.ds_online'].map(c => `a${c}`);
    let toMove = [];
    selectors.forEach(sel => toMove.push(...colT.querySelectorAll(sel)));

    if (toMove.length < 3) {
      const texts = ['Membres actifs', 'Personnages actifs', 'Personnes en ligne'];
      texts.forEach(txt => {
        const el = Array.from(colT.querySelectorAll('a, li, div, p'))
          .find(n => n.textContent?.includes(txt));
        if (el && !toMove.includes(el)) {toMove.push(el);}
      });
    }

    toMove = toMove.filter(el => el && !colLeft.contains(el));
    if (!toMove.length) {return;}

    let container = colLeft.querySelector('.kraland-metrics');
    if (!container) {
      container = document.createElement('div');
      container.className = 'kraland-metrics list-group';
      colLeft.appendChild(container);
    }

    toMove.forEach(el => container.appendChild(el));
  }

  function restructurePlatoColumns() {
    if (!isPlatoPage()) {return;}

    const colLeft = document.getElementById('col-left');
    const colRight = document.getElementById('col-right');
    if (!colLeft || !colRight) {return;}

    const parent = colLeft.parentElement;
    if (!parent || !parent.classList.contains('row')) {return;}

    let colLeftest = document.getElementById('col-leftest');
    if (!colLeftest) {
      colLeftest = document.createElement('div');
      colLeftest.id = 'col-leftest';
      colLeftest.className = 'col-md-1';
      parent.insertBefore(colLeftest, colLeft);
    }

    if (colRight.classList.contains('col-md-9')) {
      colRight.classList.remove('col-md-9');
      colRight.classList.add('col-md-8');
    }
  }

  function moveBtnGroupToCols() {
    if (!isPlatoPage()) {return;}

    const btnGroupXs = document.querySelector('.btn-group-xs.center');
    const colLeftest = document.getElementById('col-leftest');
    if (!btnGroupXs || !colLeftest || colLeftest.contains(btnGroupXs)) {return;}

    let wrapper = document.getElementById('col-leftest-stats');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = 'col-leftest-stats';
      wrapper.className = 'panel panel-body';
      colLeftest.appendChild(wrapper);
    }

    if (!wrapper.contains(btnGroupXs)) {
      wrapper.appendChild(btnGroupXs);
    }
  }

  function transformToBootstrapGrid() {
    const colLeftestStats = document.getElementById('col-leftest-stats');
    const skillsPanel = document.getElementById('skills-panel');

    if (colLeftestStats && !colLeftestStats.classList.contains('grid-transformed')) {
      const btnGroup = colLeftestStats.querySelector('.btn-group-xs');
      if (btnGroup) {
        const buttons = Array.from(btnGroup.querySelectorAll('a.btn'));
        if (buttons.length > 0) {
          colLeftestStats.innerHTML = '';
          const row = document.createElement('div');
          row.className = 'row';
          buttons.forEach(btn => {
            const col = document.createElement('div');
            col.className = 'col-md-6';
            col.style.display = 'flex';
            col.style.justifyContent = 'center';
            col.style.alignItems = 'center';
            col.style.marginBottom = '8px';
            col.appendChild(btn);
            row.appendChild(col);
          });
          colLeftestStats.appendChild(row);
          colLeftestStats.classList.add('grid-transformed');
        }
      }
    }

    if (skillsPanel && !skillsPanel.classList.contains('grid-transformed')) {
      const items = Array.from(skillsPanel.querySelectorAll('a.list-group-item'));
      if (items.length > 0) {
        skillsPanel.innerHTML = '';
        const row = document.createElement('div');
        row.className = 'row';
        items.forEach(item => {
          const col = document.createElement('div');
          col.className = 'col-md-6';
          col.style.display = 'flex';
          col.style.justifyContent = 'center';
          col.style.alignItems = 'center';
          col.style.marginBottom = '8px';
          col.appendChild(item);
          row.appendChild(col);
        });
        skillsPanel.appendChild(row);
        skillsPanel.classList.add('grid-transformed');
      }
    }
  }

  function moveSkillsPanelToCols() {
    const colLeft = document.getElementById('col-left');
    const colLeftest = document.getElementById('col-leftest');
    if (!colLeft || !colLeftest) {return;}

    const skillsPanelOld = colLeft.querySelector('.panel.panel-default');
    if (!skillsPanelOld) {return;}

    const panelBody = skillsPanelOld.querySelector('.panel-body');
    if (!panelBody || panelBody.id) {return;}

    panelBody.id = 'skills-panel';
    colLeftest.appendChild(panelBody);
    skillsPanelOld.remove();
  }

  function nameLeftSidebarDivs() {
    const colLeft = document.getElementById('col-left');
    if (!colLeft) {return;}

    const mainPanel = colLeft.querySelector('.panel.panel-body');
    if (mainPanel && !mainPanel.id) {mainPanel.id = 'player-main-panel';}

    const headerSection = colLeft.querySelector('.list-group');
    if (headerSection && !headerSection.id && !headerSection.querySelector('form')) {headerSection.id = 'player-header-section';}

    const vitalsSection = colLeft.querySelector('div.t.row');
    if (vitalsSection && !vitalsSection.id) {vitalsSection.id = 'player-vitals-section';}

    const allTDivs = Array.from(colLeft.querySelectorAll('div.t'));
    if (allTDivs.length > 0) {
      const actionsSection = allTDivs[allTDivs.length - 1];
      if (!actionsSection.id && actionsSection.querySelector('a.btn-primary')) {
        actionsSection.id = 'player-actions-section';
      }
    }
  }

  /** Ajoute à une cellule d'icône son nom accessible (aria-label), l'infobulle native et l'étiquette de survol/focus */
  function labelIconCell(el, name, value, ariaLabel) {
    el.classList.add('kr-icon-cell');
    // Bootstrap tooltip retiré : l'infobulle native (title) prend le relais
    ['data-toggle', 'data-placement', 'data-original-title'].forEach(a => el.removeAttribute(a));
    el.setAttribute('aria-label', ariaLabel);
    el.title = ariaLabel;
    el.setAttribute('data-kr-label', name + ' · ' + value);
  }

  function transformSkillsToIcons() {
    const skillsPanel = document.getElementById('skills-panel');
    if (!skillsPanel || skillsPanel.dataset.iconsTransformed) {return;}

    skillsPanel.querySelectorAll('.list-group-item').forEach(item => {
      const heading = item.querySelector('.list-group-item-heading');
      const skillName = heading?.querySelector('.mini')?.textContent || '';
      const level = item.querySelector('.mention')?.textContent || '0';
      const iconCode = CONFIG.SKILL_ICONS[skillName];
      if (!iconCode) {return;}

      const iconUrl = `http://img7.kraland.org/2/mat/94/${iconCode}.gif`;
      const originalClasses = item.className;
      item.className = originalClasses + ' btn btn-default mini kr-skill';
      item.innerHTML = '';

      const iconContainer = createIconContainer(iconUrl, skillName, level);
      labelIconCell(item, skillName, level, skillName + ' — niveau ' + level);
      item.appendChild(iconContainer);

      // Légende lisible sans survol (tactile, tablette) : affichée par le CSS selon le type de pointeur
      const caption = document.createElement('span');
      caption.className = 'kr-skill-caption';
      caption.setAttribute('aria-hidden', 'true');
      caption.textContent = skillName;
      item.appendChild(caption);
    });

    skillsPanel.dataset.iconsTransformed = '1';
  }

  function transformStatsToNotifications() {
    const colLeftestStats = document.getElementById('col-leftest-stats');
    if (!colLeftestStats || colLeftestStats.dataset.badgesTransformed) {return;}

    colLeftestStats.querySelectorAll('.col-md-6 > a.btn').forEach(statBtn => {
      const text = statBtn.textContent.trim();
      const match = text.match(/^([A-Z]+)/);
      const cleanStatName = match ? match[1] : text;
      const levelMatch = text.match(/(\d+)$/);
      const number = levelMatch ? levelMatch[1] : '0';

      while (statBtn.firstChild) {statBtn.removeChild(statBtn.firstChild);}

      const originalClasses = statBtn.className;
      statBtn.className = originalClasses + ' list-group-item ds_game kr-stat';
      labelIconCell(statBtn, cleanStatName, number, cleanStatName + ' : ' + number);

      const displayMode = getStatsDisplayMode();

      // Créer le conteneur principal (toujours avec badge)
      const container = document.createElement('div');
      container.className = 'kr-skill-icon kr-stat-icon';

      if (displayMode === 'text') {
        // Mode texte : afficher uniquement l'abréviation (3 lettres)
        const textSpan = document.createElement('span');
        textSpan.className = 'kr-stat-text';
        textSpan.textContent = cleanStatName.substring(0, 3).toUpperCase();
        container.appendChild(textSpan);
      } else {
        // Mode icône (par défaut)
        const iconCode = CONFIG.STAT_ICONS[cleanStatName];
        if (iconCode) {
          const iconUrl = `http://img7.kraland.org/2/mat/94/${iconCode}.gif`;
          const img = document.createElement('img');
          img.className = 'kr-skill-img';
          img.src = iconUrl;
          img.alt = cleanStatName;
          bindIconFallback(img, container, cleanStatName);
          container.appendChild(img);
        } else {
          // Fallback SVG (couleurs héritées du thème via currentColor)
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('class', 'kr-skill-img');
          svg.setAttribute('viewBox', '0 0 32 32');

          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('width', '32');
          rect.setAttribute('height', '32');
          rect.setAttribute('fill', 'currentColor');
          rect.setAttribute('fill-opacity', '0.15');
          rect.setAttribute('stroke', 'currentColor');
          svg.appendChild(rect);

          const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          svgText.setAttribute('x', '16');
          svgText.setAttribute('y', '20');
          svgText.setAttribute('text-anchor', 'middle');
          svgText.setAttribute('font-size', '14');
          svgText.setAttribute('font-weight', 'bold');
          svgText.setAttribute('fill', 'currentColor');
          svgText.textContent = cleanStatName.substring(0, 2).toUpperCase();
          svg.appendChild(svgText);

          container.appendChild(svg);
        }
      }

      // Toujours ajouter le badge de notification
      container.appendChild(createStatBadge(number));
      statBtn.appendChild(container);

      // Légende visible sans survol (tactile) ; inutile en mode texte où l'abréviation est déjà affichée
      if (displayMode !== 'text') {
        const caption = document.createElement('span');
        caption.className = 'kr-skill-caption';
        caption.setAttribute('aria-hidden', 'true');
        caption.textContent = cleanStatName;
        statBtn.appendChild(caption);
      }
    });

    colLeftestStats.dataset.badgesTransformed = '1';
  }

  function ensureEditorClasses() {
    const selectors = [
      '[id^="ajax-"] form#msg', '[id^="ajax-"] textarea',
      '.col-sm-10 form#msg', '.col-sm-10 textarea#message',
      'form[name="post_msg"]', 'textarea#message'
    ];

    document.querySelectorAll(selectors.join(',')).forEach(el => {
      const root = el.tagName?.toLowerCase() === 'form' ? el : (el.closest('form') || el.parentElement);
      if (root && !root.classList.contains('editeur-text')) {
        root.classList.add('editeur-text');
      }
    });
  }

  function ensurePageScoping() {
    const isMembers = location?.pathname?.indexOf('/communaute/membres') === 0;
    document.documentElement.classList.toggle('kr-page-members', isMembers);
  }

  function ensurePlayerMainPanelRows() {
    const panel = document.getElementById('player-main-panel');
    if (!panel) {return;}

    Array.from(panel.children)
      .filter(child => child.tagName?.toLowerCase() === 'div')
      .filter(div => !div.classList.contains('kr-quick-access-buttons'))
      .forEach(div => {
        if (!div.classList.contains('row')) {div.classList.add('row');}
      });
  }

  function addQuickAccessButtons() {
    const panel = document.getElementById('player-main-panel');
    if (!panel) {return;}

    // Vérifier si les boutons ont déjà été ajoutés
    if (panel.querySelector('.kr-quick-access-buttons')) {return;}

    // Définir les boutons
    const buttons = [
      { label: 'Agir', url: '/jouer/plateau', icon: 'fa-map' },
      { label: 'Matériel', url: '/jouer/materiel', icon: 'fa-box' },
      { label: 'Personnage', url: '/jouer/perso', icon: 'fa-user' },
      { label: 'Bâtiments', url: '/jouer/bat', icon: 'fa-building' },
      { label: 'Employés', url: '/jouer/pnj', icon: 'fa-users' }
    ];

    // Conteneur en grille CSS (2 colonnes, même gouttière que la grille d'actions) : plus de row/col imbriqués
    const container = document.createElement('div');
    container.className = 'kr-quick-access-buttons';

    buttons.forEach(btn => {
      const link = document.createElement('a');
      link.href = btn.url;
      link.className = 'btn btn-default btn-block mini';

      const icon = document.createElement('i');
      icon.className = `fa ${btn.icon}`;

      link.appendChild(icon);
      link.appendChild(document.createTextNode(' ' + btn.label));

      container.appendChild(link);
    });

    // Ajouter les boutons à la fin du panneau
    panel.appendChild(container);
  }

  /**
   * Range les actions de jeu natives (Dormir, Prier, Pouvoir, Fouiller…) de #player-actions-section
   * dans une grille à 2 colonnes égales. Les nœuds sont DÉPLACÉS (jamais recréés) : liens,
   * attributs et gestionnaires d'origine restent intacts. Les nœuds qui ne sont pas des boutons
   * (séparateur, texte) restent hors grille. Le nombre d'actions est celui du DOM réel.
   */
  function ensureActionGrid() {
    const section = document.getElementById('player-actions-section');
    if (!section) {return;}

    let grid = section.querySelector(':scope > .kr-action-grid');
    const buttons = Array.from(section.children).filter(el => el.matches('a.btn, button.btn'));
    if (buttons.length === 0) {return;}

    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'kr-action-grid';
      section.insertBefore(grid, buttons[0]);
    }
    buttons.forEach(btn => grid.appendChild(btn));
  }

  // ============================================================================
  // Déplacement Matériel vers col-left (desktop uniquement)
  // ============================================================================

  function moveMaterielToColLeft() {
    if (!isPlatoPage()) {return;}
    if (!isMaterielMoveEnabled()) {return;}

    var materielHeader = Array.from(document.querySelectorAll('#col-right h3.panel-title')).find(function (h) {
      return h.textContent.trim() === 'Matériel';
    });
    if (!materielHeader) {return;}

    var materielPanel = materielHeader.closest('.panel.panel-default');
    if (!materielPanel) {return;}

    materielPanel.classList.add('kr-materiel-moved');

    // Déplacer dans col-left uniquement en desktop
    if (!isMobileMode()) {
      var colLeft = document.getElementById('col-left');
      if (colLeft) {
        colLeft.appendChild(materielPanel);
        console.log('[moveMaterielToColLeft] Panel Matériel déplacé dans col-left');
      }
    } else {
      console.log('[moveMaterielToColLeft] Panel Matériel marqué (mobile, pas déplacé)');
    }
  }

  /**
   * Déplace la section Clefs au-dessus de Fabriquer sur /jouer/materiel
   */
  function moveClefsSectionAboveFabriquer() {
    if (location.pathname !== '/jouer/materiel') {return;}

    var colRight = document.getElementById('col-right');
    if (!colRight) {return;}

    var dashboards = colRight.querySelectorAll('.dashboard');
    if (dashboards.length < 2) {return;}

    // Trouver le panel Clefs dans le premier dashboard
    var clefsPanel = null;
    var panels = dashboards[0].querySelectorAll(':scope > .panel');
    for (var i = 0; i < panels.length; i++) {
      var title = panels[i].querySelector('h3.panel-title');
      if (title && title.textContent.trim() === 'Clefs') {
        clefsPanel = panels[i];
        break;
      }
    }
    if (!clefsPanel) {return;}

    // Trouver le panel Fabriquer dans le second dashboard
    var fabriquerPanel = null;
    var panels2 = dashboards[1].querySelectorAll(':scope > .panel');
    for (var j = 0; j < panels2.length; j++) {
      var title2 = panels2[j].querySelector('h3.panel-title');
      if (title2 && title2.textContent.trim() === 'Fabriquer') {
        fabriquerPanel = panels2[j];
        break;
      }
    }
    if (!fabriquerPanel) {return;}

    // Insérer Clefs avant Fabriquer dans le second dashboard
    dashboards[1].insertBefore(clefsPanel, fabriquerPanel);

    console.log('[moveClefsSectionAboveFabriquer] Section Clefs déplacée au-dessus de Fabriquer');
  }

  // ============================================================================
  // UI CONTROLS
  // ============================================================================

  function insertToggleCSSButton() {
    if (document.getElementById('kr-toggle-css-btn')) {return;}

    const mapBtn = Array.from(document.querySelectorAll('a'))
      .find(a => a.getAttribute('onclick')?.includes('openMap'));
    if (!mapBtn) {return;}

    const mapLi = mapBtn.closest('li');
    if (!mapLi?.parentElement) {return;}

    const newLi = document.createElement('li');
    const toggleBtn = document.createElement('a');
    toggleBtn.href = '';
    toggleBtn.id = 'kr-toggle-css-btn';
    toggleBtn.innerHTML = '<i class="fa fa-palette"></i>';

    function updateTitle() {
      toggleBtn.title = isThemeEnabled()
        ? 'Désactiver la surcharge CSS'
        : 'Activer la surcharge CSS';
    }
    updateTitle();

    toggleBtn.addEventListener('click', e => {
      e.preventDefault();
      if (isThemeEnabled()) {
        applyThemeVariant('disable');
      } else {
        applyThemeVariant(getVariant());
      }
      return false;
    });

    newLi.appendChild(toggleBtn);
    if (mapLi.parentElement) {
      mapLi.parentElement.insertBefore(newLi, mapLi);
    }
  }

  function insertTampermonkeyThemeUI() {
    if (!location?.href?.includes('/profil/interface')) {return;}

    function tryInsert() {
      const headings = Array.from(document.querySelectorAll('h4, h3, h2'));
      const target = headings.find(h =>
        h.textContent?.trim().toLowerCase().includes('thème de base')
      );
      if (!target) {return false;}
      if (document.getElementById('kr-tamper-theme')) {return true;}

      const themeOptions = [
        { value: 'disable', flag: 'f0', label: 'Désactiver la surcharge CSS' },
        { value: 'kraland', flag: 'f1', label: 'République de Kraland' },
        { value: 'kraland-dark', flag: 'f1', label: 'République de Kraland (Dark Mode)' },
        { value: 'empire-brun', flag: 'f2', label: 'Empire Brun' },
        { value: 'empire-brun-dark', flag: 'f2', label: 'Empire Brun (Dark Mode)' },
        { value: 'paladium', flag: 'f3', label: 'Paladium Corporation' },
        { value: 'paladium-dark', flag: 'f3', label: 'Paladium Corporation (Dark Mode)' },
        { value: 'theocratie-seelienne', flag: 'f4', label: 'Théocratie Seelienne' },
        { value: 'theocratie-seelienne-dark', flag: 'f4', label: 'Théocratie Seelienne (Dark Mode)' },
        { value: 'paradigme-vert', flag: 'f5', label: 'Paradigme Vert' },
        { value: 'paradigme-vert-dark', flag: 'f5', label: 'Paradigme Vert (Dark Mode)' },
        { value: 'khanat-elmerien', flag: 'f6', label: 'Khanat Elmérien' },
        { value: 'khanat-elmerien-dark', flag: 'f6', label: 'Khanat Elmérien (Dark Mode)' },
        { value: 'confederation-libre', flag: 'f7', label: 'Confédération Libre' },
        { value: 'confederation-libre-dark', flag: 'f7', label: 'Confédération Libre (Dark Mode)' },
        { value: 'royaume-ruthvenie', flag: 'f8', label: 'Royaume de Ruthvénie' },
        { value: 'royaume-ruthvenie-dark', flag: 'f8', label: 'Royaume de Ruthvénie (Dark Mode)' }
      ];

      const radios = themeOptions.map(opt => `
        <div class="radio">
          <span class="lefticon"><img src="http://img7.kraland.org/2/world/${opt.flag}.png" width="15" height="10"></span>
          <label><input type="radio" name="kr-theme" value="${opt.value}"> ${opt.label}</label>
        </div>
      `).join('');

      const statsDisplayRadios = `
        <div class="radio">
          <label><input type="radio" name="kr-stats-display" value="icon"> Icônes</label>
        </div>
        <div class="radio">
          <label><input type="radio" name="kr-stats-display" value="text"> Texte</label>
        </div>
      `;

      const hideQuoteCheckbox = `
        <div class="checkbox">
          <label><input type="checkbox" name="kr-hide-quote" id="kr-hide-quote"> Masquer la citation du footer</label>
        </div>
      `;

      const container = document.createElement('div');
      container.id = 'kr-tamper-theme';
      container.className = 'well kr-tamper-theme';
      container.innerHTML = `
        <h4>Configuration du thème</h4>
        <form id="kr-tamper-theme-form" class="form-horizontal">
          <h5 class="kr-options-section-title"><span>Thème</span> <i class="fa fa-chevron-down kr-section-icon"></i></h5>
          <div class="kr-options-section-content collapsed">
            <div class="form-group">
              <label class="col-sm-3 control-label">Choix du thème</label>
              <div class="col-sm-9">${radios}</div>
            </div>
          </div>
          <h5 class="kr-options-section-title"><span>Plateau</span> <i class="fa fa-chevron-down kr-section-icon"></i></h5>
          <div class="kr-options-section-content collapsed">
            <div class="form-group">
              <label class="col-sm-3 control-label">Carte</label>
              <div class="col-sm-9">
                <div class="checkbox">
                  <label><input type="checkbox" name="kr-medieval-map" id="kr-medieval-map-checkbox"> Carte médiévale — remplace les tuiles de la carte</label>
                  <p class="help-block" style="margin-top:6px">Merci <a href="http://www.kraland.org/communaute/membres/sylke-1-3335" target="_blank" rel="noopener noreferrer">Sylke</a></p>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">Commerce</label>
              <div class="col-sm-9">
                <div class="checkbox">
                  <label><input type="checkbox" name="kr-commerce-list" id="kr-commerce-list-checkbox"> Affichage en liste — affiche les produits en lignes au lieu de tuiles</label>
                  <p class="help-block" style="margin-top:6px">Desktop uniquement. Sur mobile, l'affichage en liste est toujours actif.</p>
                </div>
                <div class="checkbox">
                  <label><input type="checkbox" name="kr-commerce-expanded" id="kr-commerce-expanded-checkbox"> Catégories ouvertes par défaut — ouvre tous les accordéons au chargement</label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">Matériel</label>
              <div class="col-sm-9">
                <div class="checkbox">
                  <label><input type="checkbox" name="kr-materiel-move" id="kr-materiel-move-checkbox"> Déplacer dans la colonne gauche — déplace le panneau Matériel à gauche sur le plateau</label>
                </div>
              </div>
            </div>
          </div>
          <h5 class="kr-options-section-title"><span>Affichage</span> <i class="fa fa-chevron-down kr-section-icon"></i></h5>
          <div class="kr-options-section-content collapsed">
            <div class="form-group">
              <label class="col-sm-3 control-label">Caractéristiques</label>
              <div class="col-sm-9">${statsDisplayRadios}</div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">Accueil</label>
              <div class="col-sm-9">
                <div class="checkbox">
                  <label><input type="checkbox" name="kr-carousel-hide" id="kr-carousel-hide-checkbox"> Masquer le carrousel — désactive le diaporama de la page d'accueil</label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">Footer</label>
              <div class="col-sm-9">${hideQuoteCheckbox}</div>
            </div>
          </div>
          <h5 class="kr-options-section-title"><span>Sauvegarde</span> <i class="fa fa-chevron-down kr-section-icon"></i></h5>
          <div id="kr-sync-section" class="kr-options-section-content collapsed">
            <div class="form-group">
              <label class="col-sm-3 control-label">Configuration</label>
              <div class="col-sm-9">
                <p class="help-block" style="margin-top:0;margin-bottom:8px">
                  Sauvegardez votre configuration dans vos notes Kraland
                  pour la retrouver sur un autre navigateur.
                </p>
                <button type="button" class="btn btn-primary btn-sm" id="kr-config-export-btn">
                  <i class="fa fa-cloud-upload-alt"></i> Sauvegarder
                </button>
                <button type="button" class="btn btn-default btn-sm" id="kr-config-import-btn" style="margin-left:6px">
                  <i class="fa fa-cloud-download-alt"></i> Importer
                </button>
                <div id="kr-sync-feedback" style="margin-top:8px"></div>
              </div>
            </div>
          </div>
          <h5 class="kr-options-section-title"><span>Alertes</span> <i class="fa fa-chevron-down kr-section-icon"></i></h5>
          <div id="kr-alerts-section" class="kr-options-section-content collapsed"></div>
          <h5 class="kr-options-section-title"><span>Historique</span> <i class="fa fa-chevron-down kr-section-icon"></i></h5>
          <div id="kr-changelog-section" class="kr-options-section-content collapsed"></div>
        </form>
      `;

      if (target.parentElement) {
        target.parentElement.insertBefore(container, target);
      }

      const form = container.querySelector('#kr-tamper-theme-form');

      // Toggle des sections pliables
      container.querySelectorAll('.kr-options-section-title').forEach(title => {
        title.addEventListener('click', () => {
          const content = title.nextElementSibling;
          if (!content) {return;}
          const isExpanded = !content.classList.contains('collapsed');
          content.classList.toggle('collapsed', isExpanded);
          title.classList.toggle('expanded', !isExpanded);
        });
      });

      function syncUI() {
        if (!isThemeEnabled()) {
          const d = form.querySelector('input[value="disable"]');
          if (d) {d.checked = true;}
        } else {
          const v = getVariant();
          const el = form.querySelector(`input[value="${v}"]`);
          if (el) {el.checked = true;}
        }

        // Synchroniser l'affichage des caractéristiques
        const statsMode = getStatsDisplayMode();
        const statsEl = form.querySelector(`input[name="kr-stats-display"][value="${statsMode}"]`);
        if (statsEl) {statsEl.checked = true;}

        // Synchroniser l'option de masquage de la citation
        const hideQuote = localStorage.getItem('kr-hide-footer-quote') === 'true';
        const hideQuoteEl = form.querySelector('#kr-hide-quote');
        if (hideQuoteEl) {hideQuoteEl.checked = hideQuote;}

        // Synchroniser l'option Carte médiévale
        const medieval = _lsGet(CONFIG.MEDIEVAL_MAP_KEY) === 'true';
        const medievalEl = form.querySelector('#kr-medieval-map-checkbox');
        if (medievalEl) { medievalEl.checked = medieval; }

        // Synchroniser l'option Commerce mode liste
        const commerceList = _lsGet(CONFIG.COMMERCE_LIST_KEY) === 'true';
        const commerceListEl = form.querySelector('#kr-commerce-list-checkbox');
        if (commerceListEl) { commerceListEl.checked = commerceList; }

        // Synchroniser l'option Commerce accordéons ouverts
        const commerceExpanded = _lsGet(CONFIG.COMMERCE_EXPANDED_KEY) === 'true';
        const commerceExpandedEl = form.querySelector('#kr-commerce-expanded-checkbox');
        if (commerceExpandedEl) { commerceExpandedEl.checked = commerceExpanded; }

        // Synchroniser l'option Matériel déplacement
        const materielMove = isMaterielMoveEnabled();
        const materielMoveEl = form.querySelector('#kr-materiel-move-checkbox');
        if (materielMoveEl) { materielMoveEl.checked = materielMove; }

        // Synchroniser l'option Masquer le carrousel
        const carouselHide = isCarouselHidden();
        const carouselHideEl = form.querySelector('#kr-carousel-hide-checkbox');
        if (carouselHideEl) { carouselHideEl.checked = carouselHide; }
      }

      form.addEventListener('change', (e) => {
        // Gestion du changement de thème
        if (e.target.name === 'kr-theme') {
          const sel = form.querySelector('input[name="kr-theme"]:checked');
          if (!sel) {return;}
          const val = sel.value;

          const feedback = document.createElement('div');
          feedback.className = 'alert alert-success';
          feedback.textContent = val === 'disable'
            ? 'Désactivation du thème...'
            : 'Application du thème: ' + val;
          container.appendChild(feedback);

          setTimeout(() => applyThemeVariant(val), 300);
        }

        // Gestion du changement d'affichage des caractéristiques
        if (e.target.name === 'kr-stats-display') {
          const sel = form.querySelector('input[name="kr-stats-display"]:checked');
          if (!sel) {return;}
          const val = sel.value;

          _lsSet(CONFIG.STATS_DISPLAY_KEY, val);

          const feedback = document.createElement('div');
          feedback.className = 'alert alert-success';
          feedback.textContent = val === 'icon'
            ? 'Affichage en icônes activé. Rechargez la page pour voir les changements.'
            : 'Affichage en texte activé. Rechargez la page pour voir les changements.';
          container.appendChild(feedback);

          setTimeout(() => {
            feedback.remove();
          }, 5000);
        }

        // Gestion du masquage de la citation
        if (e.target.name === 'kr-hide-quote') {
          const isChecked = e.target.checked;
          localStorage.setItem('kr-hide-footer-quote', isChecked.toString());

          // Appliquer immédiatement le changement
          if (isChecked) {
            document.documentElement.classList.add('kr-hide-footer-quote');
          } else {
            document.documentElement.classList.remove('kr-hide-footer-quote');
          }

          const feedback = document.createElement('div');
          feedback.className = 'alert alert-success';
          feedback.textContent = isChecked
            ? 'Citation du footer masquée.'
            : 'Citation du footer affichée.';
          container.appendChild(feedback);

          setTimeout(() => {
            feedback.remove();
          }, 3000);
        }

        // Gestion de la Carte médiévale
        if (e.target.name === 'kr-medieval-map') {
          const isChecked = e.target.checked;
          _lsSet(CONFIG.MEDIEVAL_MAP_KEY, isChecked.toString());

          const feedback = document.createElement('div');
          feedback.className = 'alert alert-success';
          feedback.textContent = isChecked ? 'Carte médiévale activée. Application...' : 'Carte médiévale désactivée.';
          container.appendChild(feedback);

          // Appliquer immédiatement
          applyMedievalMapOption();
          setTimeout(() => feedback.remove(), 3000);
        }

        // Gestion du mode liste commerce
        if (e.target.name === 'kr-commerce-list') {
          const isChecked = e.target.checked;
          _lsSet(CONFIG.COMMERCE_LIST_KEY, isChecked.toString());
          applyCommerceListOption();

          const feedback = document.createElement('div');
          feedback.className = 'alert alert-success';
          feedback.textContent = isChecked
            ? 'Commerce en mode liste activé.'
            : 'Commerce en mode tuiles rétabli.';
          container.appendChild(feedback);
          setTimeout(() => feedback.remove(), 3000);
        }

        // Gestion des accordéons commerce ouverts par défaut
        if (e.target.name === 'kr-commerce-expanded') {
          const isChecked = e.target.checked;
          _lsSet(CONFIG.COMMERCE_EXPANDED_KEY, isChecked.toString());

          const feedback = document.createElement('div');
          feedback.className = 'alert alert-success';
          feedback.textContent = isChecked
            ? 'Catégories commerce ouvertes par défaut.'
            : 'Catégories commerce fermées par défaut (sauf Nourriture).';
          container.appendChild(feedback);
          setTimeout(() => feedback.remove(), 3000);
        }

        // Gestion du déplacement du matériel
        if (e.target.name === 'kr-materiel-move') {
          const isChecked = e.target.checked;
          _lsSet(CONFIG.MATERIEL_MOVE_KEY, isChecked.toString());

          const feedback = document.createElement('div');
          feedback.className = 'alert alert-success';
          feedback.textContent = isChecked
            ? 'Matériel déplacé à gauche (rechargement nécessaire).'
            : 'Matériel laissé à droite (rechargement nécessaire).';
          container.appendChild(feedback);
          setTimeout(() => feedback.remove(), 3000);
        }

        // Gestion du masquage du carrousel
        if (e.target.name === 'kr-carousel-hide') {
          const isChecked = e.target.checked;
          _lsSet(CONFIG.CAROUSEL_HIDE_KEY, isChecked.toString());

          if (isChecked) {
            document.documentElement.classList.add('kr-hide-carousel');
          } else {
            document.documentElement.classList.remove('kr-hide-carousel');
          }

          const feedback = document.createElement('div');
          feedback.className = 'alert alert-success';
          feedback.textContent = isChecked
            ? 'Carrousel masqué.'
            : 'Carrousel affiché.';
          container.appendChild(feedback);
          setTimeout(() => feedback.remove(), 3000);
        }
      });

      syncUI();
      return true;
    }

    if (!tryInsert()) {
      let attempts = 0;
      const id = setInterval(() => {
        attempts++;
        if (tryInsert() || attempts > 25) {clearInterval(id);}
      }, 200);
    }
  }

  // ============================================================================
  // OBSERVERS
  // ============================================================================

  function startObservers() {
    let moTimer;
    const mo = new MutationObserver(() => {
      // Vérification immédiate du CSS (critique, pas de debounce)
      if (isThemeEnabled() && !document.getElementById(CONFIG.STYLE_ID)) {
        applyThemeInline(CONFIG.BUNDLED_CSS).catch(() => {});
      }
      // Debounce les callbacks non-critiques (carte médiévale, toggle button)
      clearTimeout(moTimer);
      moTimer = setTimeout(() => {
        safeCall(() => applyMedievalMapOption());
        safeCall(insertToggleCSSButton);
      }, 150);
    });

    if (document.documentElement || document) {
      mo.observe(document.documentElement || document, { childList: true, subtree: true });
    }

    // SPA navigation
    const wrap = orig => function () {
      const ret = orig.apply(this, arguments);
      setTimeout(() => ensureTheme(), 250);
      return ret;
    };
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', () => setTimeout(() => ensureTheme(), 250));
  }

  // ============================================================================
  // MODAL PERSONNAGE MOBILE - INTERACTIONS UX/UI
  // ============================================================================

  /**
   * Améliore l'UX mobile du modal de sélection personnage
   * - Navigation carousel pour sélecteur personnages (prev/next)
   * - Description collapsible dans le header
   * - Tabs swipeable avec détection de geste
   * - Indicateurs de navigation (dots)
   * - Compteur de caractères pour textarea
   * - Feedback tactile sur les interactions
   */
  function initCharacterModalMobile() {
    // Observer l'apparition des modals Bootbox
    const modalObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          // Vérifier si c'est une modal Bootbox
          if (node.nodeType === 1 && node.classList?.contains('bootbox')) {
            setTimeout(() => {
              enhanceCharacterModal(node);
            }, 150);
          }
        });
      });
    });

    // Vérifier que document.body existe avant d'utiliser le MutationObserver
    if (document.body) {
      modalObserver.observe(document.body, { childList: true, subtree: false });
    }
  }

  /**
   * Scroll automatiquement vers l'onglet actif dans les modals personnage
   * Surveille les mises à jour AJAX et maintient le scroll sur le bon onglet
   */
  function initModalTabScroll() {
    // Fonction qui installe un observer ciblé sur une modal spécifique
    function observeModalTabs(modal) {
      const tabScrollObserver = new MutationObserver((mutations) => {
        mutations.forEach((_mutation) => {
          // Chercher le panel-heading avec les tabs
          const panelHeading = modal.querySelector('.panel.with-nav-tabs .panel-heading');
          if (!panelHeading) {return;}

          // Chercher l'onglet actif
          const activeTab = panelHeading.querySelector('.nav-tabs > li.active');
          if (!activeTab) {return;}

          // Scroller vers l'onglet actif
          setTimeout(() => {
            const tabRect = activeTab.getBoundingClientRect();
            const containerRect = panelHeading.getBoundingClientRect();

            // Calculer la position de scroll pour centrer l'onglet
            const scrollLeft = activeTab.offsetLeft - (containerRect.width / 2) + (tabRect.width / 2);

            panelHeading.scrollTo({
              left: Math.max(0, scrollLeft),
              behavior: 'smooth'
            });
          }, 100);
        });
      });

      tabScrollObserver.observe(modal, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });

      // Nettoyer l'observer quand la modal se ferme
      $(modal).one('hidden.bs.modal', function () {
        tabScrollObserver.disconnect();
      });
    }

    // Observer l'ajout de modals dans le body (scope réduit : childList seul, pas subtree)
    if (document.body) {
      const bodyObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.classList?.contains('bootbox')) {
              observeModalTabs(node);
            }
          });
        });
      });
      bodyObserver.observe(document.body, { childList: true, subtree: false });
    }
  }

  /**
   * Fusionne les colonnes d'une row en une seule div pour le mode mobile
   * Remplace les changements de div par des espaces
   */
  function mergeColumnsInMobile(modal) {
    if (!modal) {return;}

    // Trouver tous les panneaux avec des colonnes Bootstrap
    const panels = modal.querySelectorAll('.panel-info, .panel-primary, .panel-default');

    panels.forEach(panel => {
      // Cibler les lignes dans panel-heading, panel-body, panel-footer
      const rows = panel.querySelectorAll('.panel-heading .row, .panel-body .row, .panel-actions .row, .panel-footer .row');

      rows.forEach(row => {
        // Récupérer toutes les colonnes de cette row
        const columns = row.querySelectorAll('[class*="col-"]');

        if (columns.length > 0) {
          // Collecter le contenu de toutes les colonnes avec des espaces entre elles
          const contents = [];
          columns.forEach(col => {
            const text = col.textContent.trim();
            const html = col.innerHTML.trim();

            // Si la colonne contient des éléments (pas juste du texte), garder le HTML
            if (col.children.length > 0) {
              contents.push(html);
            } else if (text) {
              contents.push(text);
            }
          });

          // Créer une nouvelle div unique avec tout le contenu
          const mergedDiv = document.createElement('div');
          mergedDiv.className = 'col-xs-12 merged-columns';
          mergedDiv.innerHTML = contents.join(' ');

          // Supprimer toutes les colonnes existantes
          columns.forEach(col => col.remove());

          // Ajouter la div fusionnée
          row.appendChild(mergedDiv);
        }
      });
    });
  }

  /**
   * Force le layout grid pour les actions de la modal d'ordre
   * Contourne le display:flex de Bootstrap 3 qui empêche grid de fonctionner
   */
  function forceOrderModalGridLayout(modal) {
    if (!modal) {return;}

    // Vérifier si c'est une modal d'ordre (avec .bootbox-confirm)
    if (!modal.classList.contains('bootbox-confirm')) {return;}

    // Forcer le .panel-heading en colonne pour empiler les grilles verticalement
    const panelHeading = modal.querySelector('.panel-heading');
    if (panelHeading) {
      panelHeading.style.setProperty('display', 'block', 'important');
    }

    // Chercher tous les ul.nav-tabs dans .panel-heading
    const navTabsElements = modal.querySelectorAll('.panel-heading ul.nav-tabs');
    if (navTabsElements.length === 0) {return;}

    console.log('[Order Modal] Forçage du layout grid pour', navTabsElements.length, 'nav-tabs');

    // Appliquer les styles grid via JavaScript (contourne Bootstrap)
    navTabsElements.forEach((ul, index) => {
      // Force display grid avec !important via setProperty
      ul.style.setProperty('display', 'grid', 'important');

      // Tous les groupes en 2 colonnes - grille homogène continue
      ul.style.setProperty('grid-template-columns', 'repeat(2, 1fr)', 'important');

      ul.style.setProperty('gap', '12px', 'important');
      ul.style.setProperty('padding-left', '0', 'important');

      // Force l'alignement des grid items au début (gauche)
      ul.style.setProperty('justify-items', 'start', 'important');
      ul.style.setProperty('align-items', 'stretch', 'important');

      // Grille continue - même espacement partout (pas de séparation visuelle)
      ul.style.setProperty('margin-bottom', '12px', 'important');
      ul.style.setProperty('border-bottom', 'none', 'important');
      ul.style.setProperty('border-top', 'none', 'important');
      ul.style.setProperty('padding-top', '0', 'important');

      // Désactiver les pseudo-éléments clearfix de Bootstrap qui deviennent grid items
      // Créer/mettre à jour un élément <style> pour cibler les pseudo-éléments
      let styleId = 'grid-pseudo-fix-' + index;
      let styleEl = document.getElementById(styleId);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      // Générer un ID unique pour ce UL
      if (!ul.id) {ul.id = 'order-modal-nav-' + index;}
      styleEl.textContent = `
        #${ul.id}::before,
        #${ul.id}::after {
          display: none !important;
          content: none !important;
        }
      `;

      // Force les li à être des grid items
      const listItems = ul.querySelectorAll('li');
      listItems.forEach(li => {
        li.style.setProperty('margin', '0', 'important');
        li.style.setProperty('padding', '0', 'important');
        li.style.setProperty('float', 'none', 'important');
        li.style.setProperty('display', 'block', 'important');
        li.style.setProperty('position', 'static', 'important');
        li.style.setProperty('width', '100%', 'important'); // Force largeur complète de la colonne
        li.style.setProperty('grid-column', 'auto', 'important');
        li.style.setProperty('grid-row', 'auto', 'important');
        li.style.setProperty('justify-self', 'stretch', 'important');
        li.style.setProperty('align-self', 'stretch', 'important');

        // Style les liens
        const link = li.querySelector('a');
        if (link) {
          link.style.setProperty('display', 'block', 'important');
          link.style.setProperty('width', '100%', 'important');
          link.style.setProperty('min-height', '44px', 'important');
          link.style.setProperty('padding', '12px 16px', 'important');
          link.style.setProperty('text-align', 'center', 'important');
          link.style.setProperty('border-radius', '8px', 'important');
          link.style.setProperty('margin', '0', 'important');
          link.style.setProperty('box-sizing', 'border-box', 'important');
        }
      });

      console.log(`[Order Modal] Grid appliqué sur nav-tabs #${index + 1} (${listItems.length} items)`);
    });

    // Appliquer un second coup après un délai pour contrer les réinitialisations Bootstrap
    setTimeout(() => {
      navTabsElements.forEach(ul => {
        ul.style.setProperty('display', 'grid', 'important');
      });
    }, 100);
  }

  /**
   * NOUVELLE FONCTION - Optimise la structure de la modal pour mobile
   */
  function transformOrderModalStructure(modal) {
    if (!modal) {return;}
    if (!document.body.classList.contains('mobile-mode')) {return;}
    if (modal.dataset.structureTransformed) {return;}

    console.log('[Order Modal] Optimisation structure mobile');

    const modalBody = modal.querySelector('.bootbox-body, .modal-body');
    if (!modalBody) {return;}

    // === 1. Optimiser le header (select + h3) ===
    const selectRow = modalBody.querySelector('.row');
    const h3Title = modalBody.querySelector('h3');

    if (selectRow && h3Title) {
      // Marquer pour styling sticky
      selectRow.classList.add('kraland-modal-header');
      h3Title.classList.add('kraland-character-title');
      console.log('[Order Modal] Header marqué');
    }

    // === 2. Identifier la zone d'actions (panel-heading avec nav-tabs) ===
    const panelWithTabs = modalBody.querySelector('.panel.with-nav-tabs');
    if (panelWithTabs) {
      const panelHeading = panelWithTabs.querySelector('.panel-heading');
      if (panelHeading) {
        panelHeading.classList.add('kraland-actions-zone');
        console.log('[Order Modal] Zone actions identifiée');
      }

      // === 3. Identifier la zone de formulaire (panel-body) ===
      const panelBody = panelWithTabs.querySelector('.panel-body.panel-order');
      if (panelBody) {
        panelBody.classList.add('kraland-form-zone');
        console.log('[Order Modal] Zone formulaire identifiée');
      }

      // === 4. Identifier le footer du panel ===
      const panelFooter = panelWithTabs.querySelector('.panel-footer');
      if (panelFooter) {
        panelFooter.classList.add('kraland-action-footer');
        console.log('[Order Modal] Footer action identifié');
      }
    }

    // === 5. Marquer le footer de la modal (boutons OK/Cancel) ===
    const modalFooter = modal.querySelector('.modal-footer');
    if (modalFooter) {
      modalFooter.classList.add('kraland-modal-footer');
      console.log('[Order Modal] Footer modal identifié');
    }

    // === 6. Nettoyer les styles inline du panel-info (tableau Actions) ===
    const panelInfo = modalBody.querySelector('.panel-info');
    if (panelInfo) {
      // Retirer les styles inline sur les rows et colonnes
      const rows = panelInfo.querySelectorAll('.row');
      rows.forEach(row => {
        row.style.marginLeft = '';
        row.style.marginRight = '';
      });

      const cols = panelInfo.querySelectorAll('[class*="col-"]');
      cols.forEach(col => {
        col.style.paddingLeft = '';
        col.style.paddingRight = '';
      });

      console.log('[Order Modal] Styles inline nettoyés du panel-info');
    }

    modal.dataset.structureTransformed = 'true';
    console.log('[Order Modal] Structure optimisée pour mobile');
  }

  /**
   * Nettoie les whitespace text nodes de la toolbar et force le grid layout
   */
  function cleanToolbarWhitespace(modal) {
    if (!modal) {return;}
    if (!document.body.classList.contains('mobile-mode')) {return;}

    const toolbar = modal.querySelector('.btn-toolbar');
    if (!toolbar) {return;}

    // Supprimer tous les text nodes qui ne contiennent que des espaces
    const childNodes = Array.from(toolbar.childNodes);
    childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && /^\s*$/.test(node.textContent)) {
        toolbar.removeChild(node);
      }
    });

    console.log('[Order Modal] Toolbar whitespace nettoyé');
  }

  /**
   * Améliore le feedback visuel des nav-tabs
   */
  function enhanceNavTabsFeedback(modal) {
    if (!modal) {return;}
    if (!document.body.classList.contains('mobile-mode')) {return;}

    // Ajouter un meilleur feedback au clic sur les nav-tabs
    const navTabs = modal.querySelectorAll('.nav.nav-tabs li a');
    navTabs.forEach(link => {
      // Ajouter classe pour feedback tactile
      link.classList.add('kr-touch-feedback');

      // UX AMÉLIORATION #2: Meilleur feedback visuel sur l'état actif
      link.addEventListener('click', function () {
        // Retirer classe active de tous les onglets
        modal.querySelectorAll('.nav.nav-tabs li').forEach(li => li.classList.remove('active'));
        // Ajouter à l'onglet cliqué
        this.parentElement.classList.add('active');
      });
    });

    console.log('[Order Modal] Feedback tactile ajouté aux nav-tabs');
  }

  /**
   * UX AMÉLIORATION #1: Rend l'alerte d'aide repliable
   */
  function makeAlertCollapsible(modal) {
    if (!modal) {return;}
    if (!document.body.classList.contains('mobile-mode')) {return;}

    const alert = modal.querySelector('.alert');
    if (!alert) {return;}

    // Créer le bouton toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'kr-alert-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-question-circle"></i> Aide';
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Afficher/masquer l\'aide');

    // Wrapper pour le contenu de l'alerte
    const alertContent = document.createElement('div');
    alertContent.className = 'kr-alert-content';
    alertContent.style.display = 'none';

    // Déplacer le contenu dans le wrapper
    while (alert.firstChild) {
      alertContent.appendChild(alert.firstChild);
    }

    // Ajouter le bouton et le contenu
    alert.appendChild(toggleBtn);
    alert.appendChild(alertContent);
    alert.classList.add('kr-alert-collapsible');

    // Gérer le toggle
    toggleBtn.addEventListener('click', function () {
      const isExpanded = alertContent.style.display !== 'none';
      alertContent.style.display = isExpanded ? 'none' : 'block';
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      toggleBtn.innerHTML = isExpanded ?
        '<i class="fas fa-question-circle"></i> Aide' :
        '<i class="fas fa-times-circle"></i> Masquer l\'aide';
    });

    console.log('[Order Modal] Alerte rendue repliable');
  }

  /**
   * UX AMÉLIORATION #3: Agrandit le textarea pour meilleur confort
   */
  function enlargeTextarea(modal) {
    if (!modal) {return;}
    if (!document.body.classList.contains('mobile-mode')) {return;}

    const textarea = modal.querySelector('textarea#message');
    if (!textarea) {return;}

    // Passer de 5 à 8 rows minimum
    textarea.rows = 8;

    // Ajouter auto-resize
    textarea.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });

    console.log('[Order Modal] Textarea agrandi (8 rows + auto-resize)');
  }

  /**
   * UX AMÉLIORATION #4: Formate le footer en badges visuels
   */
  function formatFooterAsBadges(modal) {
    if (!modal) {return;}
    if (!document.body.classList.contains('mobile-mode')) {return;}

    const actionFooter = modal.querySelector('.kraland-action-footer p');
    if (!actionFooter) {return;}

    const text = actionFooter.textContent;

    // Parser le texte: "Coût: 0 MØ | Durée: 00:00 | Potentiel: PER + Discrétion = 1"
    const costMatch = text.match(/Coût:\s*([^|]+)/);
    const durationMatch = text.match(/Durée:\s*([^|]+)/);
    const potentialMatch = text.match(/Potentiel:\s*(.+)$/);

    if (!costMatch && !durationMatch && !potentialMatch) {return;}

    // Créer les badges
    const badgesHTML = `
      <div class="kr-action-badges">
        ${costMatch ? `<span class="kr-badge kr-badge-cost"><i class="fas fa-coins"></i> ${costMatch[1].trim()}</span>` : ''}
        ${durationMatch ? `<span class="kr-badge kr-badge-duration"><i class="far fa-clock"></i> ${durationMatch[1].trim()}</span>` : ''}
        ${potentialMatch ? `<span class="kr-badge kr-badge-potential"><i class="fas fa-dice-d20"></i> ${potentialMatch[1].trim()}</span>` : ''}
      </div>
    `;

    actionFooter.innerHTML = badgesHTML;
    console.log('[Order Modal] Footer formaté en badges');
  }

  /**
   * UX AMÉLIORATION #5: Renforce visuellement le bouton OK
   */
  function enhanceOkButton(modal) {
    if (!modal) {return;}
    if (!document.body.classList.contains('mobile-mode')) {return;}

    const modalFooter = modal.querySelector('.kraland-modal-footer');
    if (!modalFooter) {return;}

    const okButton = modalFooter.querySelector('.btn-primary');
    const cancelButton = modalFooter.querySelector('.btn-default');

    if (okButton) {
      okButton.classList.add('kr-btn-primary-enhanced');
    }

    if (cancelButton) {
      cancelButton.classList.add('kr-btn-secondary-subtle');
    }

    console.log('[Order Modal] Boutons OK/Cancel améliorés');
  }

  /**
   * UX AMÉLIORATION #6: Groupe les options du select par type (PJ/PNJ)
   */
  function groupSelectOptions(modal) {
    if (!modal) {return;}
    if (!document.body.classList.contains('mobile-mode')) {return;}

    const select = modal.querySelector('.kraland-modal-header select');
    if (!select) {return;}

    // Récupérer toutes les options
    const options = Array.from(select.options);
    if (options.length === 0) {return;}

    // Séparer PJ et PNJ (PNJ contiennent souvent "PNJ" dans le texte ou ont des patterns spécifiques)
    const pjOptions = [];
    const pnjOptions = [];

    options.forEach(option => {
      const text = option.textContent;
      // Détecter PNJ par patterns communs
      if (text.includes('PNJ') || text.includes('[') || text.match(/\d+ /) || text.includes('Garde') || text.includes('Esclave')) {
        pnjOptions.push(option);
      } else {
        pjOptions.push(option);
      }
    });

    // Ne grouper que s'il y a les deux types
    if (pjOptions.length === 0 || pnjOptions.length === 0) {return;}

    // Vider le select
    select.innerHTML = '';

    // Créer les optgroups
    if (pjOptions.length > 0) {
      const pjGroup = document.createElement('optgroup');
      pjGroup.label = 'Personnages Joueurs';
      pjOptions.forEach(opt => pjGroup.appendChild(opt));
      select.appendChild(pjGroup);
    }

    if (pnjOptions.length > 0) {
      const pnjGroup = document.createElement('optgroup');
      pnjGroup.label = 'Personnages Non-Joueurs';
      pnjOptions.forEach(opt => pnjGroup.appendChild(opt));
      select.appendChild(pnjGroup);
    }

    console.log(`[Order Modal] Select groupé (${pjOptions.length} PJ, ${pnjOptions.length} PNJ)`);
  }

  /**
   * Force position:fixed bottom-sheet sur les dropdowns pour contrer Bootstrap JS.
   * Bootstrap 3 applique dynamiquement position:fixed avec des coordonnées calculées.
   * On force le bottom-sheet (position:fixed en bas de l'écran) comme sur kramail.
   */
  function fixDropdownPosition(modal, observers) {
    if (!modal) {return;}

    // Observer les dropdowns qui s'ouvrent
    const dropdownObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const dropdown = mutation.target;
          if (dropdown.classList.contains('dropdown') && dropdown.classList.contains('open')) {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            if (dropdownMenu) {
              // Bottom-sheet fixe en bas de l'écran
              dropdownMenu.style.setProperty('position', 'fixed', 'important');
              dropdownMenu.style.setProperty('inset', 'auto 8px 60px', 'important');
              dropdownMenu.style.setProperty('top', 'auto', 'important');
              dropdownMenu.style.setProperty('left', '8px', 'important');
              dropdownMenu.style.setProperty('right', '8px', 'important');
              dropdownMenu.style.setProperty('bottom', '60px', 'important');
              dropdownMenu.style.setProperty('border-radius', 'var(--mobile-radius) var(--mobile-radius) 0 0', 'important');
              dropdownMenu.style.setProperty('box-shadow', '0 -4px 24px rgba(0,0,0,0.4)', 'important');
              dropdownMenu.style.setProperty('z-index', '1050', 'important');
              dropdownMenu.style.setProperty('background', 'var(--kr-bg-surface)', 'important');
              console.log('[Order Modal] Dropdown positionné en bottom-sheet');
            }
          }
        }
      });
    });

    // Observer tous les dropdowns dans la toolbar
    const toolbar = modal.querySelector('.btn-toolbar');
    if (toolbar) {
      const dropdowns = toolbar.querySelectorAll('.dropdown');
      dropdowns.forEach(dropdown => {
        dropdownObserver.observe(dropdown, {
          attributes: true,
          attributeFilter: ['class']
        });
      });
      if (observers) {observers.push(dropdownObserver);}
      console.log(`[Order Modal] Observateur dropdown installé sur ${dropdowns.length} dropdowns`);
    }
  }

  /**
   * Applique toutes les améliorations mobiles à une modal de personnage
   */
  function enhanceCharacterModal(modal) {
    if (!modal) {return;}

    // Vérifier qu'on est bien en mode mobile
    if (!document.body.classList.contains('mobile-mode')) {return;}

    // Tableau pour collecter les observers à nettoyer à la fermeture
    const modalObservers = [];

    // NOUVELLE TRANSFORMATION : Optimiser la structure pour mobile
    transformOrderModalStructure(modal);

    // CRITIQUE: Fixer la position des dropdowns (couleurs/smileys)
    fixDropdownPosition(modal, modalObservers);

    // Nettoyer les whitespace nodes de la toolbar pour le grid
    cleanToolbarWhitespace(modal);

    // === AMÉLIORATIONS UX ===
    // #1: Alerte repliable
    makeAlertCollapsible(modal);

    // #2: Améliorer le feedback des nav-tabs (avec état actif)
    enhanceNavTabsFeedback(modal);

    // #3: Agrandir le textarea
    enlargeTextarea(modal);

    // #4: Footer en badges
    formatFooterAsBadges(modal);

    // #5: Bouton OK renforcé
    enhanceOkButton(modal);

    // #6: Select groupé
    groupSelectOptions(modal);

    // Force le layout grid pour les modals d'ordre (initial)
    forceOrderModalGridLayout(modal);

    // Observer les changements dans le body de la modal pour réappliquer le grid après Ajax
    const modalBody = modal.querySelector('.bootbox-body, .modal-body');
    if (modalBody) {
      const contentObserver = new MutationObserver(() => {
        console.log('[Order Modal] Contenu Ajax détecté - réapplication du grid');
        forceOrderModalGridLayout(modal);
        cleanToolbarWhitespace(modal);
      });

      contentObserver.observe(modalBody, {
        childList: true,
        subtree: true
      });
      modalObservers.push(contentObserver);

      console.log('[Order Modal] Observer Ajax installé sur modal body');
    }

    // Fusionner les colonnes en une seule div pour simplifier le layout mobile
    mergeColumnsInMobile(modal);

    // Chercher le select de personnages
    const charSelect = modal.querySelector('select[onchange*="perso"]');
    if (charSelect) {
      createCharacterCarousel(modal, charSelect);
    }

    // Rendre la description collapsible
    makeDescriptionCollapsible(modal);

    // Améliorer les tabs avec swipe
    enhanceTabsWithSwipe(modal, modalObservers);

    // Ajouter compteur de caractères aux textarea
    addCharCounterToTextareas(modal);

    // Ajouter feedback tactile
    addTouchFeedback(modal);

    // Nettoyer tous les observers quand la modal se ferme
    $(modal).one('hidden.bs.modal', function () {
      modalObservers.forEach(obs => obs.disconnect());
      console.log('[Order Modal] ' + modalObservers.length + ' observers nettoyés');
    });
  }

  /**
   * Crée un carousel de navigation pour le sélecteur de personnages
   */
  function createCharacterCarousel(modal, select) {
    // Récupérer toutes les options
    const options = Array.from(select.options);
    if (options.length <= 1) {return;} // Pas besoin de carousel avec 1 seul perso

    const currentIndex = select.selectedIndex;

    // Créer le wrapper carousel
    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = 'kr-char-selector';

    // Bouton précédent
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'kr-char-nav-btn';
    prevBtn.innerHTML = '‹';
    prevBtn.disabled = currentIndex === 0;
    prevBtn.setAttribute('aria-label', 'Personnage précédent');

    // Affichage du personnage actuel
    const currentDisplay = document.createElement('div');
    currentDisplay.className = 'kr-selector-current';

    const currentAvatar = document.createElement('img');
    currentAvatar.src = modal.querySelector('.modal-header img')?.src || '';
    currentAvatar.alt = 'Avatar';

    const currentName = document.createElement('span');
    currentName.className = 'kr-selector-current-name';
    currentName.textContent = options[currentIndex].text;

    const currentCount = document.createElement('span');
    currentCount.className = 'kr-selector-current-count';
    currentCount.textContent = `${currentIndex + 1}/${options.length}`;

    currentDisplay.appendChild(currentAvatar);
    currentDisplay.appendChild(currentName);
    currentDisplay.appendChild(currentCount);

    // Bouton suivant
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'kr-char-nav-btn';
    nextBtn.innerHTML = '›';
    nextBtn.disabled = currentIndex === options.length - 1;
    nextBtn.setAttribute('aria-label', 'Personnage suivant');

    // Assembler
    carouselWrapper.appendChild(prevBtn);
    carouselWrapper.appendChild(currentDisplay);
    carouselWrapper.appendChild(nextBtn);

    // Insérer après le select (ou à la place visuellement)
    select.parentNode.insertBefore(carouselWrapper, select.nextSibling);

    // Handlers de navigation
    prevBtn.addEventListener('click', () => {
      if (select.selectedIndex > 0) {
        select.selectedIndex--;
        select.dispatchEvent(new Event('change'));
        // Modal va se recharger, pas besoin de mettre à jour manuellement
      }
    });

    nextBtn.addEventListener('click', () => {
      if (select.selectedIndex < options.length - 1) {
        select.selectedIndex++;
        select.dispatchEvent(new Event('change'));
      }
    });
  }

  /**
   * Rend la description du personnage collapsible dans le header
   */
  function makeDescriptionCollapsible(modal) {
    const header = modal.querySelector('.modal-header');
    if (!header) {return;}

    // Chercher le texte de description (souvent après le nom)
    const headerDiv = header.querySelector('div');
    if (!headerDiv) {return;}

    // Séparer le nom et la description
    const contentNodes = Array.from(headerDiv.childNodes);
    const textNodes = contentNodes.filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());

    if (textNodes.length === 0) {return;}

    // Wrapper pour la description
    const descWrapper = document.createElement('div');
    descWrapper.className = 'kr-char-description collapsed';

    // Mettre les nœuds texte dans le wrapper (sauf le premier qui est le nom)
    textNodes.slice(1).forEach(node => {
      descWrapper.appendChild(node.cloneNode(true));
      node.remove();
    });

    if (descWrapper.textContent.trim()) {
      headerDiv.appendChild(descWrapper);

      // Bouton toggle
      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'kr-char-expand-btn';
      toggleBtn.innerHTML = '▼';
      toggleBtn.setAttribute('aria-label', 'Afficher/masquer description');
      toggleBtn.setAttribute('aria-expanded', 'false');

      header.appendChild(toggleBtn);

      toggleBtn.addEventListener('click', () => {
        const isCollapsed = descWrapper.classList.contains('collapsed');

        if (isCollapsed) {
          descWrapper.classList.remove('collapsed');
          descWrapper.classList.add('expanded');
          toggleBtn.classList.add('expanded');
          toggleBtn.setAttribute('aria-expanded', 'true');
        } else {
          descWrapper.classList.remove('expanded');
          descWrapper.classList.add('collapsed');
          toggleBtn.classList.remove('expanded');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /**
   * Améliore les tabs avec swipe et indicateurs
   */
  function enhanceTabsWithSwipe(modal, observers) {
    const tabsContainer = modal.querySelector('.nav-tabs');
    if (!tabsContainer) {return;}

    const tabs = Array.from(tabsContainer.querySelectorAll('li'));
    if (tabs.length === 0) {return;}

    // Créer indicateurs de navigation (dots)
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'kr-tabs-indicator';

    tabs.forEach((tab, _index) => {
      const dot = document.createElement('span');
      dot.className = 'kr-tab-dot';
      if (tab.classList.contains('active')) {
        dot.classList.add('active');
      }
      dotsContainer.appendChild(dot);
    });

    // Insérer les dots après les tabs
    tabsContainer.parentNode.insertBefore(dotsContainer, tabsContainer.nextSibling);

    // Observer les changements d'onglet actif pour mettre à jour les dots
    const updateDots = () => {
      const activeDot = tabs.findIndex(tab => tab.classList.contains('active'));
      dotsContainer.querySelectorAll('.kr-tab-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeDot);
      });
    };

    // Observer avec MutationObserver
    const tabObserver = new MutationObserver(updateDots);
    tabs.forEach(tab => {
      tabObserver.observe(tab, { attributes: true, attributeFilter: ['class'] });
    });
    if (observers) {observers.push(tabObserver);}

    // Détecter le swipe horizontal sur les tabs
    let touchStartX = 0;
    let touchEndX = 0;

    tabsContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    tabsContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50; // pixels minimum pour détecter un swipe
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) < swipeThreshold) {return;}

      const activeIndex = tabs.findIndex(tab => tab.classList.contains('active'));

      if (diff > 0 && activeIndex < tabs.length - 1) {
        // Swipe left → onglet suivant
        tabs[activeIndex + 1].querySelector('a')?.click();
      } else if (diff < 0 && activeIndex > 0) {
        // Swipe right → onglet précédent
        tabs[activeIndex - 1].querySelector('a')?.click();
      }
    }

    // Scroll automatique vers l'onglet actif
    const scrollToActiveTab = () => {
      // Chercher l'onglet actif dans TOUTES les listes .nav-tabs du modal
      const currentModal = tabsContainer.closest('.bootbox.modal');
      const allNavTabs = currentModal?.querySelectorAll('.nav-tabs') || [tabsContainer];
      let activeTab = null;

      for (const navTab of allNavTabs) {
        activeTab = navTab.querySelector('li.active');
        if (activeTab) {
          activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          break;
        }
      }
    };

    // Scroll initial
    setTimeout(scrollToActiveTab, 100);

    // Scroll lors des changements d'onglet - pour TOUTES les listes de tabs du modal
    const parentModal = tabsContainer.closest('.bootbox.modal');
    const allNavTabsLists = parentModal?.querySelectorAll('.nav-tabs') || [tabsContainer];

    allNavTabsLists.forEach(navTab => {
      const allTabs = Array.from(navTab.querySelectorAll('li'));
      allTabs.forEach(tab => {
        tab.querySelector('a')?.addEventListener('click', () => {
          setTimeout(scrollToActiveTab, 100);
        });
      });
    });
  }

  /**
   * Ajoute un compteur de caractères aux textarea
   */
  function addCharCounterToTextareas(modal) {
    const textareas = modal.querySelectorAll('textarea');

    textareas.forEach(textarea => {
      const maxLength = textarea.getAttribute('maxlength');
      if (!maxLength) {return;}

      const counter = document.createElement('div');
      counter.className = 'kr-char-counter';

      const updateCounter = () => {
        const remaining = maxLength - textarea.value.length;
        counter.textContent = `${remaining} caractères restants`;

        // Code couleur selon le seuil
        counter.classList.remove('warning', 'error');
        if (remaining <= 0) {
          counter.classList.add('error');
        } else if (remaining <= 20) {
          counter.classList.add('warning');
        }
      };

      textarea.parentNode.insertBefore(counter, textarea.nextSibling);
      textarea.addEventListener('input', updateCounter);
      updateCounter();
    });
  }

  /**
   * Ajoute un feedback tactile (ripple effect) sur les éléments interactifs
   */
  function addTouchFeedback(modal) {
    const interactiveElements = modal.querySelectorAll(
      '.kr-char-nav-btn, .kr-char-expand-btn, .nav-tabs a, .btn, .radio label'
    );

    interactiveElements.forEach(el => {
      el.classList.add('kr-touch-feedback');

      el.addEventListener('touchstart', () => {
        el.classList.add('active');

        // Vibration haptique si disponible
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }, { passive: true });

      el.addEventListener('touchend', () => {
        setTimeout(() => {
          el.classList.remove('active');
        }, 600);
      }, { passive: true });

      el.addEventListener('touchcancel', () => {
        el.classList.remove('active');
      }, { passive: true });
    });
  }

  // ============================================================================
  // MODAL BACKDROP CLICK TO CLOSE
  // ============================================================================

  /**
   * Active la fermeture des modals Bootbox en cliquant à l'extérieur
   * Par défaut, Kraland configure Bootbox avec backdrop: "static"
   * qui empêche la fermeture par clic extérieur
   *
   * AMÉLIORATION: Détecte un vrai clic (mousedown + mouseup au même endroit)
   * et non pas juste un relâchement de bouton (redimensionnement fenêtre)
   *
   * Empêche également le scroll automatique de la page lors de l'ouverture
   */
  function enableModalBackdropClick() {
    // Sauvegarder la position avant chaque modal
    let scrollBeforeModal = { x: 0, y: 0 };

    // Map pour tracker les position mousedown par modal
    const mousedownPositions = new WeakMap();

    const modalObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          // Vérifier si c'est une modal Bootbox
          if (node.nodeType === 1 && node.classList?.contains('bootbox')) {
            // Sauvegarder immédiatement la position actuelle
            scrollBeforeModal.x = window.scrollX;
            scrollBeforeModal.y = window.scrollY;

            setTimeout(() => {
              // Récupérer les données Bootstrap de la modal
              const modalData = $(node).data('bs.modal');
              if (modalData && modalData.options.backdrop === 'static') {
                // Changer backdrop de "static" à true pour permettre fermeture par clic
                modalData.options.backdrop = true;

                // Handler pour tracker le mousedown sur le backdrop
                $(node).on('mousedown.backdrop.track', function (e) {
                  // Ne tracker que si on clique sur le backdrop lui-même (pas sur la modal)
                  if (e.target === this) {
                    mousedownPositions.set(this, { x: e.clientX, y: e.clientY });
                  }
                });

                // Réattacher le handler de clic sur backdrop avec détection de vrai clic
                $(node).off('click.dismiss.bs.modal').on('click.dismiss.bs.modal', function (e) {
                  // Vérifier que c'est un clic sur le backdrop lui-même
                  if (e.target !== this) {
                    return;
                  }

                  // Vérifier qu'il y a eu un mousedown au même endroit
                  // Cela élimine les faux clics dus au relâchement du bouton lors du redimensionnement
                  const downPos = mousedownPositions.get(this);
                  if (!downPos) {
                    // Pas de mousedown préalable = pas de vrai clic, ignorer
                    return;
                  }

                  // Vérifier que le mousedown et mouseup sont au même endroit (tolérance 5px)
                  const tolerance = 5;
                  const distance = Math.sqrt(
                    Math.pow(e.clientX - downPos.x, 2) + Math.pow(e.clientY - downPos.y, 2)
                  );
                  if (distance > tolerance) {
                    // Le curseur a bougé significativement = action de redimensionnement
                    return;
                  }

                  // Vrai clic détecté: fermer la modal
                  $(this).modal('hide');

                  // Nettoyer la position trackée
                  mousedownPositions.delete(this);
                });

                // Nettoyer la position trackée quand la modal se ferme
                $(node).one('hidden.bs.modal', function () {
                  mousedownPositions.delete(this);
                });
              }

              // Restaurer la position de scroll
              window.scrollTo(scrollBeforeModal.x, scrollBeforeModal.y);
            }, 100); // Augmenter le délai à 100ms pour laisser Bootstrap terminer

            // Ajouter aussi un handler sur l'événement 'shown.bs.modal' pour être sûr
            $(node).one('shown.bs.modal', function () {
              window.scrollTo(scrollBeforeModal.x, scrollBeforeModal.y);
            });
          }
        });
      });
    });

    // Observer le body pour détecter l'ajout de modals
    // Vérifier que document.body existe avant d'utiliser le MutationObserver
    if (document.body) {
      modalObserver.observe(document.body, { childList: true, subtree: false });
    }
  }

  // ============================================================================
  // HORLOGE À DOUBLE TOUR
  // ============================================================================

  /**
   * Gère l'affichage de l'horloge à double tour (0-48h)
   * Le HTML contient une classe .c100 avec .pXX (pourcentage 0-100) et <span>HH:MM</span>
   * Pour les heures >24h, on ajoute data-second-lap="true" et on ajuste la classe
   * Applique également un code couleur selon les paliers d'heures (comme les PV)
   */
  function handleDualLapClock() {
    const clockEl = document.querySelector('.c100');
    if (!clockEl) {return;}

    const timeSpan = clockEl.querySelector('span');
    if (!timeSpan) {return;}

    // Extraire l'heure du format "HH:MM"
    const timeText = timeSpan.textContent.trim();
    const match = timeText.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) {return;}

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);

    // Calculer le total en minutes depuis le début de la journée Kraland
    const _totalMinutes = hours * 60 + minutes;

    // Système de couleurs par palier d'heures (inspiré des PV)
    // 0-6h   → Rouge foncé (#8B0000) - "Critique"
    // 6-12h  → Orange (#FF8C00) - "Attention"
    // 12-18h → Jaune/or (#FFD700) - "Moyen"
    // 18-24h → Vert clair (#90EE90) - "Bon"
    // 24-48h → Vert lime (#32CD32) - "Excellent" (second tour)
    let clockColor;
    if (hours >= 24) {
      clockColor = '#32CD32'; // Vert lime - Second tour
    } else if (hours >= 18) {
      clockColor = '#90EE90'; // Vert clair
    } else if (hours >= 12) {
      clockColor = '#FFD700'; // Jaune/or
    } else if (hours >= 6) {
      clockColor = '#FF8C00'; // Orange
    } else {
      clockColor = '#8B0000'; // Rouge foncé
    }

    // Appliquer la couleur via CSS custom property
    clockEl.style.setProperty('--clock-color', clockColor);

    // Une journée Kraland = 24h = 1440 minutes
    // Si on dépasse 24h, on est sur le deuxième tour
    if (hours >= 24) {
      clockEl.setAttribute('data-second-lap', 'true');

      // Calculer le nouveau pourcentage pour 24-48h
      // On mappe 24-48h sur 0-100% du deuxième tour
      const hoursInSecondLap = hours - 24;
      const percentInSecondLap = Math.floor(((hoursInSecondLap * 60 + minutes) / 1440) * 100);

      // Retirer l'ancienne classe pXX
      clockEl.className = clockEl.className.replace(/\bp\d{1,3}\b/g, '');
      // Ajouter la nouvelle classe
      clockEl.className += ' p' + percentInSecondLap;
    } else {
      // Premier tour (0-24h) - rien à changer, le serveur fournit déjà le bon pourcentage
      clockEl.removeAttribute('data-second-lap');
    }
  }

  // ============================================================================
  // MOBILE FEATURES
  // Fonctionnalités spécifiques au mobile (Phase 6)
  // ============================================================================

  /**
   * Initialise les fonctionnalités mobiles
   * - Overlay pour fermer les panneaux latéraux
   * - Bouton pour ouvrir le panneau de compétences
   * - Gestion du mini-chat mobile
   */
  function initMobileFeatures() {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {return;}

    // Créer l'overlay pour fermer les panneaux
    createMobileOverlay();

    // Initialiser le panneau de compétences mobile
    initMobileSkillsPanel();

    // Initialiser le mini-chat mobile
    initMobileMiniChat();

    // Initialiser les améliorations UX pour les modals personnages
    initCharacterModalMobile();

    // Initialiser le scroll automatique des tabs dans les modals
    initModalTabScroll();

    // Le franchissement du seuil mobile/desktop est géré dans les deux sens
    // par checkBreakpointCrossing (voir TASK-1.1).
  }

  /**
   * Crée l'overlay mobile pour fermer les panneaux latéraux
   */
  function createMobileOverlay() {
    if (document.querySelector('.kr-mobile-overlay')) {return;}

    const overlay = document.createElement('div');
    overlay.className = 'kr-mobile-overlay';
    overlay.addEventListener('click', () => {
      // Fermer le panneau de compétences
      const skillsPanel = document.getElementById('skills-panel');
      if (skillsPanel) {
        skillsPanel.classList.remove('mobile-open');
      }

      // Fermer le mini-chat
      const miniChat = document.getElementById('flap');
      if (miniChat) {
        miniChat.classList.remove('mobile-open');
      }

      // Masquer l'overlay
      overlay.classList.remove('active');
    });

    document.body.appendChild(overlay);
  }

  /**
   * Initialise le panneau de compétences pour mobile
   */
  function initMobileSkillsPanel() {
    if (!isPlatoPage()) {return;}

    const skillsPanel = document.getElementById('skills-panel');
    if (!skillsPanel) {return;}

    // Créer le bouton pour ouvrir le panneau de compétences
    const skillsToggle = document.createElement('button');
    skillsToggle.className = 'kr-mobile-skills-toggle btn btn-primary';
    skillsToggle.innerHTML = '<i class="fa fa-chart-bar"></i>';
    skillsToggle.setAttribute('aria-label', 'Afficher les compétences');
    skillsToggle.onclick = () => {
      skillsPanel.classList.toggle('mobile-open');
      const overlay = document.querySelector('.kr-mobile-overlay');
      if (overlay) {
        overlay.classList.toggle('active');
      }
    };

    document.body.appendChild(skillsToggle);

    // Créer le bouton de fermeture dans le panneau
    const closeBtn = document.createElement('button');
    closeBtn.className = 'kr-mobile-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Fermer');
    closeBtn.onclick = () => {
      skillsPanel.classList.remove('mobile-open');
      const overlay = document.querySelector('.kr-mobile-overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }
    };

    skillsPanel.insertBefore(closeBtn, skillsPanel.firstChild);
  }

  /**
   * Initialise le mini-chat pour mobile
   */
  function initMobileMiniChat() {
    const miniChat = document.getElementById('flap');
    if (!miniChat) {return;}

    // Bouton pour ouvrir le mini-chat
    const chatButton = document.querySelector('a[href*="#flap"]');
    if (chatButton) {
      chatButton.addEventListener('click', (e) => {
        e.preventDefault();
        miniChat.classList.toggle('mobile-open');
        const overlay = document.querySelector('.kr-mobile-overlay');
        if (overlay) {
          overlay.classList.toggle('active');
        }
      });
    }

    // Créer le bouton de fermeture dans le mini-chat
    if (!miniChat.querySelector('.kr-mobile-close')) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'kr-mobile-close';
      closeBtn.innerHTML = '×';
      closeBtn.setAttribute('aria-label', 'Fermer le mini-chat');
      closeBtn.onclick = () => {
        miniChat.classList.remove('mobile-open');
        const overlay = document.querySelector('.kr-mobile-overlay');
        if (overlay) {
          overlay.classList.remove('active');
        }
      };

      // Trouver le header du mini-chat pour y insérer le bouton
      const chatHeader = miniChat.querySelector('.panel-heading') ||
                        miniChat.querySelector('.modal-header') ||
                        miniChat.firstElementChild;

      if (chatHeader) {
        chatHeader.style.position = 'relative';
        chatHeader.appendChild(closeBtn);
      } else {
        miniChat.insertBefore(closeBtn, miniChat.firstChild);
      }
    }
  }

  // ============================================================================
  // SAUVEGARDE CLOUD DE LA CONFIGURATION (via Notes Kraland)
  // Permet de sauvegarder/importer la config du thème dans les notes du profil
  // ============================================================================

  const ConfigCloudSync = {
    MARKER_START: '[KR-CONFIG-V1]',
    MARKER_END: '[/KR-CONFIG-V1]',
    NOTES_URL: '/profil/notes',
    NOTES_ADD_URL: '/profil/notes/ajouter',

    CONFIG_KEYS: [
      CONFIG.ENABLE_KEY,
      CONFIG.VARIANT_KEY,
      CONFIG.STATS_DISPLAY_KEY,
      'kr-hide-footer-quote',
      CONFIG.MEDIEVAL_MAP_KEY,
      CONFIG.COMMERCE_LIST_KEY,
      CONFIG.COMMERCE_EXPANDED_KEY,
      CONFIG.MATERIEL_MOVE_KEY,
      CONFIG.CAROUSEL_HIDE_KEY
    ],

    /** Sérialise la config localStorage en texte avec marqueurs */
    exportConfig() {
      var config = {};
      this.CONFIG_KEYS.forEach(function (key) {
        var value = localStorage.getItem(key);
        if (value !== null) {
          config[key] = value;
        }
      });
      config._exportDate = new Date().toISOString();
      config._version = CURRENT_VERSION;
      return this.MARKER_START + '\n' + JSON.stringify(config) + '\n' + this.MARKER_END;
    },

    /** Extrait et parse le JSON de config depuis un texte */
    parseConfigFromText(text) {
      var startIdx = text.indexOf(this.MARKER_START);
      var endIdx = text.indexOf(this.MARKER_END);
      if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
        return null;
      }
      var jsonStr = text.substring(startIdx + this.MARKER_START.length, endIdx).trim();
      try {
        var data = JSON.parse(jsonStr);
        var hasValidKey = this.CONFIG_KEYS.some(function (key) { return key in data; });
        return hasValidKey ? data : null;
      } catch (_e) {
        return null;
      }
    },

    /** Récupère le token CSRF depuis la page d'ajout de notes */
    async fetchCsrfToken() {
      var response = await fetch(this.NOTES_ADD_URL, {
        credentials: 'same-origin'
      });
      if (!response.ok) {
        throw new Error('Impossible d\'accéder à la page d\'ajout de notes');
      }
      var html = await response.text();
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var form = doc.querySelector('form[action*="profil/notes"]');
      if (!form) {
        throw new Error('Formulaire de notes non trouvé');
      }
      var tokenInput = form.querySelector('input[name="t"]');
      if (!tokenInput) {
        throw new Error('Token CSRF non trouvé');
      }
      return tokenInput.value;
    },

    /** Crée une note avec le contenu donné */
    async createNote(content) {
      var csrfToken = await this.fetchCsrfToken();

      var body = new URLSearchParams();
      body.append('a', '1');
      body.append('t', csrfToken);
      body.append('n[1]', '0');
      body.append('message', content);

      var response = await fetch(this.NOTES_URL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la note (HTTP ' + response.status + ')');
      }
      return true;
    },

    /** Met à jour une note existante par son ID */
    async updateNote(noteId, content) {
      var editUrl = '/profil/notes/modifier-' + noteId;
      var response = await fetch(editUrl, {
        credentials: 'same-origin'
      });
      if (!response.ok) {
        throw new Error('Impossible d\'accéder à la page de modification de la note');
      }
      var html = await response.text();
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var form = doc.querySelector('form[action*="profil/notes"]');
      if (!form) {
        throw new Error('Formulaire de modification non trouvé');
      }
      var tokenInput = form.querySelector('input[name="t"]');
      if (!tokenInput) {
        throw new Error('Token CSRF non trouvé sur la page de modification');
      }

      var body = new URLSearchParams();
      body.append('a', '1');
      body.append('t', tokenInput.value);
      body.append('n[1]', noteId);
      body.append('message', content);

      var postResponse = await fetch(this.NOTES_URL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      });

      if (!postResponse.ok) {
        throw new Error('Erreur lors de la modification de la note (HTTP ' + postResponse.status + ')');
      }
      return true;
    },

    /** Récupère le HTML de la page des notes */
    async fetchNotes() {
      var response = await fetch(this.NOTES_URL, {
        credentials: 'same-origin'
      });
      if (!response.ok) {
        throw new Error('Impossible d\'accéder à la page des notes');
      }
      return response.text();
    },

    /** Cherche l'ID d'une note existante contenant la config, ou null */
    findExistingConfigNoteId(notesHtml) {
      var doc = new DOMParser().parseFromString(notesHtml, 'text/html');
      var editLinks = doc.querySelectorAll('a[href*="profil/notes/modifier-"]');

      for (var i = 0; i < editLinks.length; i++) {
        var link = editLinks[i];
        var row = link.closest('tr');
        if (!row) { continue; }
        var cells = row.querySelectorAll('td');
        // Le contenu de la note est dans la 2e cellule
        var contentCell = cells.length >= 2 ? cells[1] : null;
        var text = contentCell ? contentCell.textContent : '';
        if (text.indexOf(this.MARKER_START) !== -1) {
          var href = link.getAttribute('href') || '';
          var match = href.match(/modifier-(\d+)/);
          if (match) {
            return match[1];
          }
        }
      }
      return null;
    },

    /** Cherche la config la plus récente dans le HTML des notes */
    findLatestConfig(notesHtml) {
      var doc = new DOMParser().parseFromString(notesHtml, 'text/html');
      var allText = doc.body.textContent || '';

      var configs = [];
      var searchFrom = 0;
      while (true) {
        var startIdx = allText.indexOf(this.MARKER_START, searchFrom);
        if (startIdx === -1) { break; }
        var endIdx = allText.indexOf(this.MARKER_END, startIdx);
        if (endIdx === -1) { break; }
        var parsed = this.parseConfigFromText(
          allText.substring(startIdx, endIdx + this.MARKER_END.length)
        );
        if (parsed) {
          configs.push(parsed);
        }
        searchFrom = endIdx + this.MARKER_END.length;
      }

      if (configs.length === 0) {
        return null;
      }

      // Retourner la plus récente
      configs.sort(function (a, b) {
        var dateA = a._exportDate || '';
        var dateB = b._exportDate || '';
        return dateB.localeCompare(dateA);
      });

      return configs[0];
    },

    /** Applique la config importée dans localStorage */
    applyImportedConfig(configData) {
      var appliedCount = 0;
      this.CONFIG_KEYS.forEach(function (key) {
        if (key in configData) {
          localStorage.setItem(key, configData[key]);
          _lsCache[key] = configData[key];
          appliedCount++;
        }
      });
      return appliedCount;
    },

    /** Sauvegarde la config dans une note (crée ou met à jour) */
    async saveConfigToCloud() {
      var noteContent = this.exportConfig();

      // Chercher si une note de config existe déjà
      var notesHtml = await this.fetchNotes();
      var existingNoteId = this.findExistingConfigNoteId(notesHtml);

      if (existingNoteId) {
        await this.updateNote(existingNoteId, noteContent);
      } else {
        await this.createNote(noteContent);
      }
    },

    /** Importe la config depuis les notes */
    async loadConfigFromCloud() {
      var notesHtml = await this.fetchNotes();
      var config = this.findLatestConfig(notesHtml);
      if (!config) {
        throw new Error('Aucune configuration sauvegardée trouvée dans vos notes');
      }
      return config;
    },

    /** Affiche un message de feedback */
    showFeedback(container, message, type) {
      var div = document.createElement('div');
      div.className = 'alert alert-' + type;
      div.style.cssText = 'margin-bottom:0;padding:8px 12px;font-size:13px;';
      div.textContent = message;
      container.innerHTML = '';
      container.appendChild(div);
      if (type === 'success') {
        setTimeout(function () { div.remove(); }, 8000);
      }
    },

    /** Branche les event listeners sur les boutons de la section Sauvegarde */
    insertSyncSection() {
      if (!window.location.href.includes('/profil/interface')) { return; }

      var self = this;
      var checkSection = setInterval(function () {
        var syncSection = document.querySelector('#kr-sync-section');
        if (!syncSection) { return; }
        clearInterval(checkSection);

        var exportBtn = document.getElementById('kr-config-export-btn');
        var importBtn = document.getElementById('kr-config-import-btn');
        var feedbackDiv = document.getElementById('kr-sync-feedback');

        if (exportBtn) {
          exportBtn.addEventListener('click', async function () {
            exportBtn.disabled = true;
            exportBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sauvegarde...';
            feedbackDiv.innerHTML = '';

            try {
              await self.saveConfigToCloud();
              self.showFeedback(feedbackDiv, 'Configuration sauvegardée dans vos notes !', 'success');
            } catch (e) {
              console.error('[ConfigSync] Erreur export:', e);
              self.showFeedback(feedbackDiv, 'Erreur : ' + e.message, 'danger');
            } finally {
              exportBtn.disabled = false;
              exportBtn.innerHTML = '<i class="fa fa-cloud-upload-alt"></i> Sauvegarder';
            }
          });
        }

        if (importBtn) {
          importBtn.addEventListener('click', async function () {
            importBtn.disabled = true;
            importBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Importation...';
            feedbackDiv.innerHTML = '';

            try {
              var config = await self.loadConfigFromCloud();
              var count = self.applyImportedConfig(config);
              var dateStr = config._exportDate
                ? new Date(config._exportDate).toLocaleString('fr-FR')
                : 'inconnue';
              self.showFeedback(
                feedbackDiv,
                count + ' paramètre(s) importé(s) (sauvegarde du ' + dateStr + '). Rechargement...',
                'success'
              );
              setTimeout(function () { location.reload(); }, 2000);
            } catch (e) {
              console.error('[ConfigSync] Erreur import:', e);
              self.showFeedback(feedbackDiv, 'Erreur : ' + e.message, 'danger');
            } finally {
              importBtn.disabled = false;
              importBtn.innerHTML = '<i class="fa fa-cloud-download-alt"></i> Importer';
            }
          });
        }
      }, 100);
    },

    /** Initialise le module */
    init() {
      this.insertSyncSection();
    }
  };

  // ============================================================================
  // CHANGELOG MODAL
  // Gère l'affichage de la modale de changelog au premier chargement
  // ============================================================================

  const ChangelogManager = {
    STORAGE_KEY: 'kr-changelog-viewed',
    CHANGELOG_URL: 'https://raw.githubusercontent.com/arnaudroubinet/kraland-css/main/changelog.json',
    changelog: null, // Sera chargé dynamiquement

    /**
     * Charge le changelog depuis le fichier JSON externe
     */
    async loadChangelog() {
      if (this.changelog !== null) {
        return this.changelog; // Déjà chargé
      }

      try {
        // Utiliser GM.xmlHttpRequest ou fetch si disponible
        return new Promise((resolve, _reject) => {
          if (typeof GM !== 'undefined' && GM.xmlHttpRequest) {
            GM.xmlHttpRequest({
              method: 'GET',
              url: this.CHANGELOG_URL,
              timeout: 5000,
              onload: (response) => {
                try {
                  const data = JSON.parse(response.responseText);
                  this.changelog = this.parseChangelogData(data);
                  resolve(this.changelog);
                } catch (e) {
                  console.warn('[Changelog] Erreur parsing JSON:', e);
                  this.changelog = {}; // Fallback vide
                  resolve(this.changelog);
                }
              },
              onerror: (error) => {
                console.warn('[Changelog] Erreur chargement:', error);
                this.changelog = {}; // Fallback vide
                resolve(this.changelog);
              }
            });
          } else {
            // Fallback: fetch ou pas de chargement
            fetch(this.CHANGELOG_URL, { cache: 'no-store' })
              .then(r => r.json())
              .then(data => {
                this.changelog = this.parseChangelogData(data);
                resolve(this.changelog);
              })
              .catch(e => {
                console.warn('[Changelog] Erreur fetch:', e);
                this.changelog = {}; // Fallback vide
                resolve(this.changelog);
              });
          }
        });
      } catch (e) {
        console.warn('[Changelog] Erreur loadChangelog:', e);
        return {};
      }
    },

    /**
     * Parse les données du changelog JSON
     */
    parseChangelogData(data) {
      const result = {};
      if (data.versions && Array.isArray(data.versions)) {
        data.versions.forEach(v => {
          if (v.version && Array.isArray(v.changes)) {
            result[v.version] = v.changes;
          }
        });
      }
      return result;
    },

    /**
     * Récupère la version actuelle du userscript
     */
    getCurrentVersion() {
      return CURRENT_VERSION;
    },

    /**
     * Récupère la dernière version visitée
     */
    getLastViewedVersion() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        console.warn('[Changelog] Erreur lecture localStorage:', e);
        return null;
      }
    },

    /**
     * Enregistre qu'on a vu cette version
     */
    markVersionAsViewed(version) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(version));
      } catch (e) {
        console.warn('[Changelog] Erreur sauvegarde localStorage:', e);
      }
    },

    /**
     * Récupère les changements entre deux versions
     */
    getChangesBetweenVersions(oldVersion, newVersion) {
      // Vérifier que le changelog a bien été chargé
      if (!this.changelog || typeof this.changelog !== 'object') {
        return [];
      }

      // Si c'est la première visite ou version inconnue, montrer la version actuelle
      if (!oldVersion || !this.changelog[newVersion]) {
        return this.changelog[newVersion] || [];
      }

      // Sinon, montrer uniquement le delta
      const versionKeys = Object.keys(this.changelog)
        .sort((a, b) => {
          // Tri simplifié: considère que les versions sont décroissantes
          return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' });
        });

      const oldIndex = versionKeys.indexOf(oldVersion);
      const newIndex = versionKeys.indexOf(newVersion);

      if (oldIndex === -1 || newIndex === -1 || oldIndex <= newIndex) {
        return this.changelog[newVersion] || [];
      }

      // Récupérer tous les changements entre oldVersion et newVersion (exclu)
      const changes = [];
      for (let i = newIndex; i < oldIndex; i++) {
        const version = versionKeys[i];
        if (this.changelog[version]) {
          changes.push(...this.changelog[version]);
        }
      }
      return changes;
    },

    /**
     * Crée la modale HTML
     */
    createModal(changes) {
      const modal = document.createElement('div');
      modal.className = 'kr-changelog-modal';
      modal.id = 'kr-changelog-modal';

      const isFirstVisit = changes.length === 0 || changes === this.changelog[this.getCurrentVersion()];
      const title = isFirstVisit ? 'Bienvenue dans Kraland Thème!' : 'Mise à jour disponible';
      const subtitle = isFirstVisit ? 'Découvrez les améliorations' : 'Voici les changements de cette version';

      modal.innerHTML = `
        <div class="kr-changelog-overlay" tabindex="-1"></div>
        <div class="kr-changelog-content" role="dialog" aria-modal="true" aria-label="${title}">
          <div class="kr-changelog-header">
            <h2>${title}</h2>
          </div>
          <div class="kr-changelog-body">
            <p class="kr-changelog-subtitle">${subtitle}</p>
            <ul class="kr-changelog-list">
              ${changes.map(change => `<li>${change}</li>`).join('')}
            </ul>
          </div>
          <div class="kr-changelog-footer">
            <button class="kr-changelog-view-all">Voir tous les changements</button>
            <button class="kr-changelog-close-btn">Fermer</button>
          </div>
        </div>
      `;

      // Forcer au cas où une autre feuille de style neutraliserait les règles CSS
      const content = modal.querySelector('.kr-changelog-content');
      if (content) {
        content.style.position = 'fixed';
        content.style.top = '50%';
        content.style.left = '50%';
        content.style.transform = 'translate(-50%, -50%)';
        content.style.width = '90%';
        content.style.maxWidth = '600px';
        // Forcer le fond noir et le texte blanc pour garantir la lisibilité
        content.style.background = 'rgba(0,0,0,0.95)';
        content.style.color = '#ffffff';
      }

      // S'assurer que l'overlay couvre bien l'écran et est cliquable
      const overlay = modal.querySelector('.kr-changelog-overlay');
      if (overlay) {
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0, 0, 0, 0.5)';
        overlay.style.cursor = 'pointer';
        overlay.tabIndex = -1;
      }

      return modal;
    },

    /**
     * Affiche la modale de changelog
     */
    showModal(changes) {
      // Supprimer une modale existante
      const existing = document.getElementById('kr-changelog-modal');
      if (existing) {
        existing.remove();
      }

      const modal = this.createModal(changes);
      document.body.appendChild(modal);

      // Ajouter les event listeners (utiliser uniquement le bouton footer comme contrôle principal)
      const closeBtnFooter = modal.querySelector('.kr-changelog-close-btn');
      const overlay = modal.querySelector('.kr-changelog-overlay');
      const viewAllBtn = modal.querySelector('.kr-changelog-view-all');

      let closeModal = () => {
        modal.remove();
        this.markVersionAsViewed(this.getCurrentVersion());
        document.removeEventListener('keydown', onKeyDown);
      };

      // Fermer avec la touche Échap
      const onKeyDown = (e) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      };
      document.addEventListener('keydown', onKeyDown);

      closeBtnFooter.addEventListener('click', closeModal);
      overlay.addEventListener('click', closeModal);

      // Bouton pour voir tous les changements
      viewAllBtn.addEventListener('click', () => {
        this.showFullChangelog();
      });

      // Forcer le modal à être visible puis donner le focus au bouton Fermer (footer) pour l'accessibilité
      setTimeout(() => {
        modal.classList.add('active');
        const footerClose = modal.querySelector('.kr-changelog-close-btn');
        if (footerClose) {
          footerClose.focus();
        }
      }, 50);

      // Nettoyage des listeners lors de la fermeture
      closeModal = () => {
        modal.remove();
        this.markVersionAsViewed(this.getCurrentVersion());
        document.removeEventListener('keydown', onKeyDown);
      };
    },

    /**
     * Affiche le changelog complet
     */
    showFullChangelog() {
      // Fermer la modale d'alerte d'abord
      const modal = document.getElementById('kr-changelog-modal');
      if (modal) {
        modal.remove();
      }

      // Créer une modale avec tous les changements
      const fullModal = document.createElement('div');
      fullModal.className = 'kr-changelog-modal kr-changelog-full';
      fullModal.id = 'kr-changelog-full-modal';

      const allChanges = Object.keys(this.changelog)
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }))
        .map(version => `
          <div class="kr-changelog-version">
            <h3>Version ${version}</h3>
            <ul>
              ${this.changelog[version].map(change => `<li>${change}</li>`).join('')}
            </ul>
          </div>
        `)
        .join('');

      fullModal.innerHTML = `
        <div class="kr-changelog-overlay" tabindex="-1"></div>
        <div class="kr-changelog-content kr-changelog-content-full" role="dialog" aria-modal="true" aria-label="Historique complet des changements">
          <div class="kr-changelog-header">
            <h2>Historique complet des changements</h2>
          </div>
          <div class="kr-changelog-body kr-changelog-body-full">
            ${allChanges}
          </div>
          <div class="kr-changelog-footer">
            <button class="kr-changelog-close-btn">Fermer</button>
          </div>
        </div>
      `;

      // Forcer styles inline au cas où le CSS serait neutralisé
      const fullContent = fullModal.querySelector('.kr-changelog-content');
      if (fullContent) {
        fullContent.style.position = 'fixed';
        fullContent.style.top = '50%';
        fullContent.style.left = '50%';
        fullContent.style.transform = 'translate(-50%, -50%)';
        fullContent.style.width = '90%';
        fullContent.style.maxWidth = '800px';
        // Forcer le fond noir et le texte blanc pour garantir la lisibilité
        fullContent.style.background = 'rgba(0,0,0,0.95)';
        fullContent.style.color = '#ffffff';
      }

      // S'assurer que l'overlay couvre bien l'écran et est cliquable
      const fullOverlay = fullModal.querySelector('.kr-changelog-overlay');
      if (fullOverlay) {
        fullOverlay.style.position = 'fixed';
        fullOverlay.style.top = '0';
        fullOverlay.style.left = '0';
        fullOverlay.style.width = '100%';
        fullOverlay.style.height = '100%';
        fullOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
        fullOverlay.style.cursor = 'pointer';
        fullOverlay.tabIndex = -1;
      }

      document.body.appendChild(fullModal);

      // Event listeners (utiliser uniquement le bouton footer comme contrôle principal)
      const closeBtnFooter = fullModal.querySelector('.kr-changelog-close-btn');
      const overlay = fullModal.querySelector('.kr-changelog-overlay');

      const closeFullModal = () => {
        fullModal.remove();
        document.removeEventListener('keydown', onFullKeyDown);
      };

      closeBtnFooter.addEventListener('click', closeFullModal);
      overlay.addEventListener('click', closeFullModal);

      // Fermer avec Échap pour la modale complète
      const onFullKeyDown = (e) => {
        if (e.key === 'Escape') {
          closeFullModal();
        }
      };
      document.addEventListener('keydown', onFullKeyDown);

      setTimeout(() => {
        fullModal.classList.add('active');
        const footerClose = fullModal.querySelector('.kr-changelog-close-btn');
        if (footerClose) {
          footerClose.focus();
        }
      }, 50);
    },

    /**
     * Initialise le gestionnaire de changelog
     */
    async init() {
      const currentVersion = this.getCurrentVersion();
      const lastViewedVersion = this.getLastViewedVersion();

      // Ajouter le bouton sur la page profil/interface immédiatement
      // (avant tout await pour ne pas bloquer si le réseau est lent)
      this.addChangelogButton();

      // Charger le changelog UNIQUEMENT si nouvelle version détectée
      if (lastViewedVersion !== currentVersion) {
        console.log('[Changelog] Nouvelle version détectée, chargement du changelog...');
        await this.loadChangelog();

        const changes = this.getChangesBetweenVersions(lastViewedVersion, currentVersion);
        if (changes.length > 0) {
          // Attendre que le DOM soit prêt
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
              setTimeout(() => this.showModal(changes), 1000);
            });
          } else {
            setTimeout(() => this.showModal(changes), 1000);
          }
        }
      } else {
        console.log('[Changelog] Version identique, pas de chargement');
      }
    },

    /**
     * Ajoute un bouton sur la page profil pour voir le changelog
     */
    addChangelogButton() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.insertChangelogButton();
        });
      } else {
        setTimeout(() => this.insertChangelogButton(), 500);
      }
    },

    /**
     * Insère le bouton dans la page profil
     */
    async insertChangelogButton() {
      // Vérifier qu'on est sur la page interface du profil
      if (!window.location.href.includes('/profil/interface')) {
        return;
      }

      // Charger le changelog si pas encore chargé (pour l'historique complet)
      if (this.changelog === null) {
        console.log('[Changelog] Chargement changelog pour page profil...');
        await this.loadChangelog();
      }

      // Vérifier que le bouton n'existe pas déjà
      if (document.getElementById('kr-changelog-btn')) {
        return;
      }

      // Chercher le placeholder dédié dans le formulaire
      const changelogSection = document.querySelector('#kr-changelog-section');
      if (!changelogSection) {
        console.log('[Changelog] Placeholder #kr-changelog-section non trouvé');
        return;
      }

      // Créer le form-group
      const section = document.createElement('div');
      section.className = 'form-group';

      const label = document.createElement('label');
      label.className = 'col-sm-3 control-label';
      label.textContent = 'Changements';

      const btnContainer = document.createElement('div');
      btnContainer.className = 'col-sm-9';

      // Créer le bouton
      const btn = document.createElement('button');
      btn.id = 'kr-changelog-btn';
      btn.type = 'button';
      btn.className = 'btn btn-info kr-changelog-btn';
      btn.style.display = 'inline-block';
      btn.innerHTML = '📝 Voir l\'historique des changements';

      btn.addEventListener('click', () => {
        this.showFullChangelog();
      });

      btnContainer.appendChild(btn);
      section.appendChild(label);
      section.appendChild(btnContainer);
      changelogSection.appendChild(section);

      console.log('[Changelog] Bouton ajouté sur la page profil');
    }
  };

  // ============================================================================
  // INITIALISATION
  // ============================================================================

  (async function init() {
    try {
      PerfLog.start('init:total');

      PerfLog.start('init:themeState');
      const themeEnabled = getThemeState();
      PerfLog.end('init:themeState');

      // Nettoyage CSS orphelin
      const existingStyle = document.getElementById(CONFIG.STYLE_ID);
      if (!themeEnabled && existingStyle?.parentElement) {
        existingStyle.parentElement.removeChild(existingStyle);
      }

      // UI Controls (toujours)
      PerfLog.start('init:uiControls');
      safeCall(insertToggleCSSButton);
      safeCall(insertTampermonkeyThemeUI);
      PerfLog.end('init:uiControls');

      // Theme setup (si activé)
      if (themeEnabled) {
        PerfLog.start('init:ensureTheme');
        await ensureTheme();
        PerfLog.end('init:ensureTheme');

        // DOM transformations exécutées une seule fois au DOMContentLoaded
        const runDOMTransforms = () => {
          PerfLog.start('init:domTransformations');
          applyDOMTransformations();
          PerfLog.end('init:domTransformations');
        };

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', runDOMTransforms, { once: true });
        } else {
          runDOMTransforms();
        }
      }

      PerfLog.start('init:observers');
      startObservers();
      PerfLog.end('init:observers');

      // Activer le clic sur backdrop pour fermer les modals
      PerfLog.start('init:modalBackdrop');
      enableModalBackdropClick();
      PerfLog.end('init:modalBackdrop');

      // Initialiser les améliorations mobiles des modals personnage
      PerfLog.start('init:charModalMobile');
      initCharacterModalMobile();
      PerfLog.end('init:charModalMobile');

      // Gestion mobile : détection et fonctionnalités spécifiques
      PerfLog.start('init:mobileFeatures');
      initMobileFeatures();
      PerfLog.end('init:mobileFeatures');

      // Exécuter la queue d'initialisation mobile (ordre garanti)
      // Doit être appelé après DOMContentLoaded et après que mobile-mode soit défini
      const runInitQueue = () => {
        InitQueue.run();
        PerfLog.end('init:total');
        PerfLog.report();
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInitQueue, { once: true });
      } else {
        runInitQueue();
      }

      // Désactiver les tooltips (observer au lieu de setInterval)
      safeCall(observeTooltips);

      // Initialiser le gestionnaire de changelog
      safeCall(() => ChangelogManager.init());

      // Initialiser la sauvegarde cloud de la configuration
      safeCall(() => ConfigCloudSync.init());

    } catch(e) {
      console.error('Kraland theme init failed', e);
    }
  })();
})();
