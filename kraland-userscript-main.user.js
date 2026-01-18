// ==UserScript==
// @name         Kraland Theme (Bundled)
// @namespace    http://www.kraland.org/
// @version      1.0.1768731287784
// @description  Injects the Kraland CSS theme (bundled) - Works with Tampermonkey & Violentmonkey
// @match        http://www.kraland.org/*
// @run-at       document-start
// @grant        none
// @grant        GM.xmlHttpRequest
// @connect      raw.githubusercontent.com
// @compatible   chrome tampermonkey
// @compatible   firefox tampermonkey
// @compatible   edge tampermonkey
// @compatible   firefox violentmonkey
// @compatible   chrome violentmonkey
// ==/UserScript==

// Main script code - CSS bundled inline
(function (){
  'use strict';

  // Version du userscript (sera remplacée par le build)
  const CURRENT_VERSION = '1.0.1768731287784';

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

      const isMobile = document.body.classList.contains('mobile-mode');
      // console.log(`[InitQueue] Démarrage initialisation séquentielle (${isMobile ? 'mobile' : 'desktop'})`);
      // console.log('[InitQueue] Ordre:', this._queue.map(m => `${m.name}(${m.priority})`).join(' → '));

      // Exécuter séquentiellement
      this._queue.forEach(({ name, fn }) => {
        try {
          fn();
          // console.log(`[InitQueue] ✓ ${name}`);
        } catch (e) {
          console.error(`[InitQueue] ✗ ${name}:`, e);
        }
      });

      // console.log('[InitQueue] Initialisation terminée');
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

      // Applique immédiatement et après un court délai (pour le contenu chargé dynamiquement)
      applyStyles();
      setTimeout(applyStyles, 100);
      setTimeout(applyStyles, 500);
    }

    /**
     * Gère le resize de la fenêtre
     */
    let resizeTimeout;
    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initMobileMode();
      }, 150);
    }

    // Initialisation au chargement
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMobileMode);
    } else {
      initMobileMode();
    }

    // Écoute du resize
    window.addEventListener('resize', handleResize);

    // Export global pour debug
    window.KralandMobile = {
      isMobile: isMobileDevice,
      reinit: initMobileMode
    };
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
  // TASK-2.5 - DÉPLACER LE LOGO AU-DESSUS DU BLOC BIENVENU
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

      // Nom du joueur (dans le header)
      const nameElement = profileSection.querySelector('.list-group-item.active');
      const playerName = nameElement ? nameElement.textContent.replace('×', '').trim() : 'Joueur';

      // Avatar (dans la première row)
      const avatarLink = mainPanel.querySelector('.btn.alert100 img, a[href*="perso"] img, img[src*="avatar"]');
      const avatarSrc = avatarLink ? avatarLink.src : null;

      // Argent (chercher div.mini.t avec icône fa-coins)
      let moneyElement = null;
      const moneyContainers = document.querySelectorAll('div.mini.t');
      for (const container of moneyContainers) {
        if (container.querySelector('i.fa.fa-coins') && container.textContent.includes('MØ')) {
          moneyElement = container;
          break;
        }
      }
      const money = moneyElement ? moneyElement.textContent.trim() : '0 MØ';

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

      const gaugesPV = findGaugeInSection(vitalsSection, 'PV');
      const gaugesPM = findGaugeInSection(vitalsSection, 'PM');
      const gaugesPP = findGaugeInSection(vitalsSection, 'PP');

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
      miniProfile.appendChild(header);

      // Jauges compactes (toujours visibles)
      const gaugesCompact = document.createElement('div');
      gaugesCompact.className = 'mobile-mini-profile-gauges-compact';

      ['pv', 'pm', 'pp'].forEach(type => {
        const gauge = profileData.gauges[type];
        if (!gauge) {return;}

        const el = document.createElement('div');
        el.className = 'mobile-gauge-compact';
        el.innerHTML = `
          <span class="mobile-gauge-compact-label">${type.toUpperCase()}</span>
          <div class="mobile-gauge-compact-bar">
            <div class="mobile-gauge-compact-fill ${type}" style="width: ${gauge.percent}%"></div>
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
        el.innerHTML = `
          <div class="mobile-gauge-full-header">
            <span>${type.toUpperCase()}</span>
            <span>${gauge.current}/${gauge.max}</span>
          </div>
          <div class="mobile-gauge-full-bar">
            <div class="mobile-gauge-full-fill ${type}" style="width: ${gauge.percent}%"></div>
          </div>
        `;
        gaugesFull.appendChild(el);
      });

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
            charClone.style.cssText = 'min-width: 44px; min-height: 44px; margin: 4px;';
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
            skillClone.style.cssText = 'min-height: 44px; margin: 4px; display: flex; align-items: center; justify-content: center;';
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
      console.log('  - PV:', profileData.gauges.pv ? `${profileData.gauges.pv.current}/${profileData.gauges.pv.max}` : 'N/A');
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
  // TASK-1.6 - HOMEPAGE CAROUSEL REMOVAL (Mobile)
  // ============================================
  (function () {
    /**
     * Supprime le carousel Bootstrap sur la page d'accueil en mode mobile
     * Le carousel prend trop de place et n'est pas adapté aux petits écrans
     */
    function removeHomepageCarousel() {
      // Ne s'exécute qu'en mode mobile
      if (!document.body.classList.contains('mobile-mode')) {return;}

      // Ne s'exécute que sur la page d'accueil
      const isHomePage = window.location.pathname === '/' ||
                         window.location.pathname === '/accueil' ||
                         window.location.pathname.endsWith('/');

      if (!isHomePage) {return;}

      // Sélectionner le carousel Bootstrap (.carousel)
      const carousel = document.querySelector('.carousel');

      if (!carousel) {
        console.log('[Homepage Carousel] Carousel non trouvé sur la page');
        return;
      }

      // Supprimer le carousel du DOM
      carousel.remove();

      console.log('[Homepage Carousel] Carousel supprimé en mode mobile');
    }

    // Attendre le chargement du DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', removeHomepageCarousel);
    } else {
      removeHomepageCarousel();
    }

    // Exposer pour debug
    if (window.KralandMobile) {
      window.KralandMobile.removeHomepageCarousel = removeHomepageCarousel;
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

      tabBar.addEventListener('scroll', checkScroll);

      // Check initial
      setTimeout(checkScroll, 100);

      // Re-check au resize
      window.addEventListener('resize', checkScroll);
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
     */
    function getDismissedAlerts() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.warn('[Alerts Memory] Erreur lecture localStorage:', e);
        return [];
      }
    }

    /**
     * Sauvegarde une alerte fermée dans le localStorage
     */
    function saveDismissedAlert(alertId) {
      try {
        const dismissed = getDismissedAlerts();
        if (!dismissed.includes(alertId)) {
          dismissed.push(alertId);
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
      const dismissedAlerts = getDismissedAlerts();
      if (dismissedAlerts.length === 0) {return;}

      const alerts = document.querySelectorAll('.alert.alert-dismissible');
      let hiddenCount = 0;

      alerts.forEach(alert => {
        const alertId = getAlertId(alert);
        if (dismissedAlerts.includes(alertId)) {
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
          saveDismissedAlert(alertId);
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

      // Attendre que le formulaire Tampermonkey soit présent
      const checkForm = setInterval(() => {
        const tamperForm = document.querySelector('#kr-tamper-theme-form');
        if (!tamperForm) {return;}

        clearInterval(checkForm);

        // Créer une section dédiée pour le bouton
        const section = document.createElement('div');
        section.className = 'form-group';
        section.style.marginTop = '20px';
        section.style.paddingTop = '15px';
        section.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';

        // Créer le label
        const label = document.createElement('label');
        label.className = 'col-sm-3 control-label';
        label.style.paddingLeft = '0px';
        label.style.paddingRight = '0px';
        label.textContent = 'Alertes';

        // Créer le conteneur du bouton
        const btnContainer = document.createElement('div');
        btnContainer.className = 'col-sm-9';
        btnContainer.style.paddingLeft = '0px';

        // Créer le bouton de réinitialisation
        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'btn btn-warning btn-block';

        // Ajouter l'icône et le texte
        const icon = document.createElement('span');
        icon.className = 'glyphicon glyphicon-refresh';
        icon.style.marginRight = '5px';

        const text = document.createTextNode('Réinitialiser les alertes fermées');

        resetBtn.appendChild(icon);
        resetBtn.appendChild(text);

        // Action au clic
        resetBtn.addEventListener('click', function () {
          const dismissed = getDismissedAlerts();
          const count = dismissed.length;

          if (count === 0) {
            alert('Aucune alerte fermée à réinitialiser.');
            return;
          }

          if (confirm(`Voulez-vous vraiment réinitialiser ${count} alerte(s) fermée(s) ? Elles réapparaîtront lors du prochain chargement de page.`)) {
            localStorage.removeItem(STORAGE_KEY);
            console.log('[Alerts Memory] Alertes mémorisées effacées');

            // Feedback visuel
            icon.className = 'glyphicon glyphicon-ok';
            resetBtn.textContent = '';
            resetBtn.appendChild(icon);
            resetBtn.appendChild(document.createTextNode(` ${count} alerte(s) réinitialisée(s) !`));
            resetBtn.className = 'btn btn-success btn-block';

            setTimeout(() => {
              icon.className = 'glyphicon glyphicon-refresh';
              resetBtn.textContent = '';
              resetBtn.appendChild(icon);
              resetBtn.appendChild(document.createTextNode(' Réinitialiser les alertes fermées'));
              resetBtn.className = 'btn btn-warning btn-block';
            }, 3000);
          }
        });

        // Ajouter une description
        const helpText = document.createElement('p');
        helpText.className = 'help-block';
        helpText.style.marginTop = '10px';
        helpText.style.fontSize = '12px';
        helpText.style.opacity = '0.7';
        helpText.textContent = `${getDismissedAlerts().length} alerte(s) actuellement masquée(s)`;

        // Assembler la section
        btnContainer.appendChild(resetBtn);
        btnContainer.appendChild(helpText);
        section.appendChild(label);
        section.appendChild(btnContainer);

        // Insérer après le formulaire Tampermonkey
        tamperForm.parentNode.insertBefore(section, tamperForm.nextSibling);

        console.log('[Alerts Memory] Bouton de réinitialisation ajouté');
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
     * Ajoute "Bienvenu " avant le nom de l'utilisateur sur la page d'accueil
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

      // Vérifier que "Bienvenu" n'est pas déjà présent
      if (userName.startsWith('Bienvenu')) {
        return;
      }

      // Ajouter "Bienvenu " avant le nom
      userNameH4.textContent = 'Bienvenu ' + userName;

      console.log('[Welcome Message] Message de bienvenue ajouté pour:', userName);
    }

    // Initialiser au chargement du DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addWelcomeMessage);
    } else {
      addWelcomeMessage();
    }
  })();

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

      // Gérer le clic
      header.style.cursor = 'pointer';
      header.addEventListener('click', (e) => {
        // Ne pas intercepter les clics sur les boutons d'action
        if (e.target.closest('.dashboard-group-buttons')) {return;}

        // Toggle l'état
        const isNowExpanded = !cardsGrid.classList.contains('collapsed');
        cardsGrid.classList.toggle('collapsed', isNowExpanded);
        header.classList.toggle('expanded', !isNowExpanded);

        console.log('[Group Accordion]',
          section.querySelector('.dashboard-group-title')?.textContent,
          isNowExpanded ? 'collapsed' : 'expanded'
        );
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
  (function initCommerceAccordion() {
    if (!document.body.classList.contains('mobile-mode')) {return;}
    if (!window.location.href.includes('jouer/plateau')) {return;}

    const categories = ['Nourriture', 'Repas', 'Boissons', 'Bons d\'état / Loterie', 'Services'];
    const categoryDivs = [];

    // Trouver tous les divs de catégorie
    document.querySelectorAll('h4.list-group-item-heading').forEach(h4 => {
      const categoryName = h4.textContent.trim();
      if (categories.includes(categoryName)) {
        const categoryDiv = h4.parentElement;
        if (categoryDiv && categoryDiv.classList.contains('list-group-item')) {
          categoryDivs.push({
            name: categoryName,
            div: categoryDiv,
            h4: h4
          });
        }
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

      // État initial : première catégorie (Nourriture) ouverte
      const isExpanded = index === 0;
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
  })();

  // ============================================================================
  // TASK-2.4 : Section bâtiment collapsible
  // ============================================================================
  (function initBuildingCollapse() {
    if (!document.body.classList.contains('mobile-mode')) {return;}

    const batimentHeader = Array.from(document.querySelectorAll('h3.panel-title')).find(h =>
      h.textContent.includes('Bâtiment')
    );

    if (!batimentHeader) {return;}

    const panelHeading = batimentHeader.parentElement;
    if (!panelHeading) {return;}

    const panelBody = panelHeading.nextElementSibling;

    if (!panelBody || !panelBody.classList.contains('panel-body')) {return;}

    // Ajouter les classes
    panelHeading.classList.add('building-section-header');
    panelBody.classList.add('building-section-content');

    // Ajouter l'icône chevron
    const icon = document.createElement('i');
    icon.className = 'fa fa-chevron-down accordion-icon';
    panelHeading.appendChild(icon);

    // État initial : ouvert
    panelHeading.classList.add('expanded');

    // Gestionnaire de clic
    panelHeading.style.cursor = 'pointer';
    panelHeading.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isNowExpanded = !panelBody.classList.contains('collapsed');
      panelBody.classList.toggle('collapsed', isNowExpanded);
      panelHeading.classList.toggle('collapsed', isNowExpanded);
      panelHeading.classList.toggle('expanded', !isNowExpanded);

      console.log(`[Building Section] ${isNowExpanded ? 'fermé' : 'ouvert'}`);
    });

    console.log('[Building Section] Initialisé - section collapsible');
  })();

  // ============================================================================
  // TASK-2.1: CROIX DIRECTIONNELLE ET ACCÈS AUX PIÈCES EN LIGNE
  // Afficher la croix (4 directions) et les accès aux pièces sur une ligne
  // ============================================================================
  (function () {
    function initNavigationRow() {
      if (!document.body.classList.contains('mobile-mode')) {return;}

      // Utiliser un élément DOM préexistant comme ancre (pas .mobile-quick-actions créé par le script)
      const navbar = document.querySelector('.navbar');
      if (!navbar) {return;}

      // Trouver l'image "Sortir" avec la croix directionnelle
      const exitImg = document.querySelector('img[alt="Sortir"]');
      if (!exitImg || !exitImg.parentElement) {return;}

      const parent = exitImg.parentElement;
      const map = parent.querySelector('map[name="exitmap"]');

      // Trouver toutes les images bat*.gif (accès aux pièces)
      const allBatImages = Array.from(document.querySelectorAll('img[src*="/bat/bat"]'));
      if (allBatImages.length === 0) {return;}

      // Trouver les images qui ne sont PAS déjà dans notre ligne créée
      const originalImages = allBatImages.filter(img => {
        let current = img;
        while (current && current !== document.body) {
          if (current.classList && current.classList.contains('kr-navigation-row')) {
            return false;
          }
          current = current.parentElement;
        }
        return true;
      });

      // Trier les images par leur numéro (bat0, bat1, bat2, bat3, etc.)
      originalImages.sort((a, b) => {
        const numA = parseInt(a.src.match(/bat(\d+)\.gif/)?.[1] || '999');
        const numB = parseInt(b.src.match(/bat(\d+)\.gif/)?.[1] || '999');
        return numA - numB;
      });

      if (originalImages.length === 0) {return;}

      // Trouver et masquer le conteneur d'origine (div.row.center)
      const originalContainer = parent.closest('.row.center');
      if (originalContainer) {
        originalContainer.style.display = 'none';
      }

      // Récupérer les liens parents des images
      const roomLinks = originalImages.map(img => img.closest('a')).filter(link => link !== null);
      if (roomLinks.length === 0) {return;}

      // Créer le conteneur de la ligne de navigation
      const navRow = document.createElement('div');
      navRow.className = 'kr-navigation-row';
      navRow.setAttribute('role', 'group');

      // Créer la croix directionnelle en premier
      if (exitImg && map) {
        const directionGroup = document.createElement('div');
        directionGroup.className = 'btn-group kr-direction-cross';
        directionGroup.setAttribute('role', 'group');

        // Créer un lien style btn pour la croix
        const directionLink = document.createElement('div');
        directionLink.className = 'btn btn-default alert11 mini kr-direction-link';

        // Cloner l'image et la map
        const exitImgClone = exitImg.cloneNode(true);
        exitImgClone.style.width = '60px';
        exitImgClone.style.height = '60px';
        exitImgClone.style.display = 'block';

        const mapClone = map.cloneNode(true);

        // En desktop, l'interaction se fait via les areas de la map
        // En mobile, on doit intercepter les clics sur le conteneur et les rediriger vers les areas
        directionLink.addEventListener('click', (e) => {
          // Calculer les coordonnées relatives du clic
          const rect = directionLink.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // Trouver l'area qui correspond à ces coordonnées
          const areas = mapClone.querySelectorAll('area');
          for (const area of areas) {
            if (area.shape === 'rect') {
              const coords = area.coords.split(',').map(c => parseInt(c));
              const [x1, y1, x2, y2] = coords;
              if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
                e.preventDefault();
                e.stopPropagation();
                const url = area.href;
                if (url && url !== '#') {
                  window.location.href = url;
                }
                return;
              }
            }
          }
        });

        directionLink.appendChild(exitImgClone);
        directionLink.appendChild(mapClone);
        directionGroup.appendChild(directionLink);
        navRow.appendChild(directionGroup);
      }

      // Créer une carte pour chaque accès aux pièces
      roomLinks.forEach(link => {
        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group kr-room-access-card';
        btnGroup.setAttribute('role', 'group');

        // Cloner le lien pour ne pas modifier l'original
        const linkClone = link.cloneNode(true);
        // Utiliser les mêmes classes que les actions rapides
        linkClone.className = 'btn btn-default alert11 mini kr-room-link';

        // Forcer la navigation pour éviter l'interception par Kraland
        linkClone.addEventListener('click', (e) => {
          e.stopPropagation();
          const url = linkClone.href;
          if (url && url !== '#') {
            window.location.href = url;
          }
        });

        btnGroup.appendChild(linkClone);

        navRow.appendChild(btnGroup);
      });

      // Insérer la nouvelle ligne après la navbar (élément préexistant)
      // Note: On utilise .navbar (DOM original) et non .mobile-quick-actions (créé par le script)
      navbar.parentNode.insertBefore(navRow, navbar.nextSibling);

      console.log(`[Navigation Row] Initialisée avec croix directionnelle et ${roomLinks.length} accès aux pièces`);
    }

    // Enregistrer dans la queue d'initialisation mobile (priorité 60 - après quick actions)
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
    BUNDLED_CSS: `/* ============================================================================
   1. CSS VARIABLES
   ============================================================================ */

:root {
  --kr-primary: #8b0f0e;
  --kr-primary-dark: #700b09;
  --kr-gold: #C69100;
  --kr-highlight: #c41e3a;
  --kr-highlight-reverse: #f9d9de;
  --kr-surface: #fff;
  --kr-text: #0f1724;
  --kr-muted: #6b7280;
  --kr-navbar-bg: #111315;
  --kr-radius: .5rem;
  --kr-avatar-size: 120px;

  /* Variables pour le dark mode */
  --kr-bg-page: #f5f5f5;
  --kr-bg-surface: #fff;
  --kr-bg-elevated: #fff;
  --kr-bg-hover: rgb(0,0,0,0.02);
  --kr-bg-active: rgb(0,0,0,0.05);
  --kr-text-primary: #0f1724;
  --kr-text-secondary: #6b7280;
  --kr-text-muted: #9ca3af;
  --kr-text-inverse: #fff;
  --kr-border-default: rgb(0,0,0,0.08);
  --kr-border-strong: rgb(0,0,0,0.15);
  --kr-shadow-sm: 0 1px 2px rgb(0,0,0,0.05);
  --kr-shadow-md: 0 4px 6px rgb(0,0,0,0.07);
  --kr-shadow-lg: 0 10px 15px rgb(0,0,0,0.1);

  /* Couleurs spécifiques */
  --kr-white: #fff;
  --kr-focus-ring: rgb(164,18,13,0.22);
  --kr-focus-ring-light: rgb(164,18,13,0.18);
  --kr-alert-info-bg: rgb(164,18,13,0.06);
  --kr-alert-info-border: rgb(164,18,13,0.14);
  --kr-btn-shadow: rgb(165,18,13,0.12);
  --kr-badge-danger: #dc3545;
  --kr-badge-danger-border: #bd2130;
  --kr-badge-pnj: #d9534f;
  --kr-bootstrap-blue: #337ab7;
  
  /* Couleurs nations (.f1-.f9) */
  --kr-nation-1: #C41E3A;
  --kr-nation-2: #C69100;
  --kr-nation-3: #FF0;
  --kr-nation-4: #0033A0;
  --kr-nation-5: #0B6623;
  --kr-nation-6: #6A0DAD;
  --kr-nation-7: #6B7280;
  --kr-nation-8: #0A6B2D;
  --kr-nation-9: #a70;
  
  /* Couleurs nations fonds (.c1-.c10) */
  --kr-nation-bg-1: rgb(255, 128, 128, 0.2);
  --kr-nation-bg-2: rgb(170, 112, 0, 0.3);
  --kr-nation-bg-3: rgb(255, 255, 128, 0.15);
  --kr-nation-bg-4: rgb(128, 128, 255, 0.2);
  --kr-nation-bg-5: rgb(128, 255, 128, 0.15);
  --kr-nation-bg-6: rgb(204, 128, 255, 0.2);
  --kr-nation-bg-7: rgb(170, 170, 170, 0.2);
  --kr-nation-bg-8: rgb(115, 151, 115, 0.2);
  --kr-nation-bg-9: rgb(170, 170, 68, 0.2);
  --kr-nation-bg-10: rgb(204, 255, 255, 0.15);
  
  /* ============================================
     MOBILE ADAPTATION - VARIABLES (TASK-1.1)
     ============================================ */

  /* Hauteurs fixes mobile */
  --mobile-header-height: 56px;
  --mobile-tab-bar-height: 48px;
  --mobile-touch-target: 44px;
  
  /* Espacements */
  --mobile-spacing-xs: 4px;
  --mobile-spacing-sm: 8px;
  --mobile-spacing-md: 12px;
  --mobile-spacing-lg: 16px;
  --mobile-spacing-xl: 24px;
  
  /* Bordures */
  --mobile-radius: 8px;
  --mobile-radius-lg: 16px;
  
  /* Z-index */
  --z-header: 1000;
  --z-tab-bar: 999;
  --z-bottom-sheet: 998;
  --z-drawer: 1001;
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
  
  /* Couleurs des jauges (Bootstrap success/info/warning) */
  --kr-gauge-pv: #28a745; /* Vert Bootstrap success */
  --kr-gauge-pm: #007bff; /* Bleu Bootstrap info */
  --kr-gauge-pp: #ffc107; /* Jaune Bootstrap warning */
  
  /* Overlays et transparence pour navbar sombre */
  --kr-overlay-light-10: rgba(255, 255, 255, 0.1);
  --kr-overlay-light-05: rgba(255, 255, 255, 0.05);
  --kr-overlay-light-20: rgba(255, 255, 255, 0.2);
  --kr-overlay-dark-20: rgba(0, 0, 0, 0.2);
  --kr-overlay-dark-30: rgba(0, 0, 0, 0.3);
  --kr-overlay-dark-125: rgba(0, 0, 0, 0.125);
}

html.kr-theme-variant-empire-brun {
  --kr-primary: #5E3B2D;
  --kr-highlight: #C69100;
}

html.kr-theme-variant-paladium {
  --kr-primary: #D4AF37; 
  --kr-highlight: #044c17; 
}

html.kr-theme-variant-theocratie-seelienne {
  --kr-primary: #0033A0;
  --kr-highlight: #2d5fcb;
}

html.kr-theme-variant-paradigme-vert {
  --kr-primary: #0B6623;
  --kr-highlight: #063803;
}

html.kr-theme-variant-khanat-elmerien {
  --kr-primary: #6A0DAD;
  --kr-highlight: #7b4c9c;
}

html.kr-theme-variant-confederation-libre {
  --kr-primary: #6B7280;
  --kr-highlight: #475369;
}

html.kr-theme-variant-royaume-ruthvenie {
  --kr-primary: #0A6B2D;
  --kr-highlight: #C41E3A; 
}

html.kr-theme-variant-empire-brun-dark {
  --kr-primary: #7a5240;
  --kr-primary-dark: #5E3B2D;
  --kr-highlight: #d4a574;
  --kr-highlight-reverse: #1a0f0a;

  /* Dark mode surfaces */
  --kr-bg-page: #12100d;
  --kr-bg-surface: #1e1a15;
  --kr-bg-elevated: #2a251f;
  --kr-bg-hover: rgba(255, 255, 255, 0.03);
  --kr-bg-active: rgba(255, 255, 255, 0.06);

  /* Color scheme */
  color-scheme: dark;

  /* Dark mode texte */
  --kr-text-primary: #f5f1ed;
  --kr-text-secondary: #b8a997;
  --kr-text-muted: #8a7968;
  --kr-text-inverse: #12100d;

  /* Dark mode bordures */
  --kr-border-default: rgb(255,255,255,0.08);
  --kr-border-strong: rgb(255,255,255,0.15);

  /* Dark mode ombres */
  --kr-shadow-sm: 0 1px 3px rgb(0,0,0,0.4);
  --kr-shadow-md: 0 4px 8px rgb(0,0,0,0.5);
  --kr-shadow-lg: 0 10px 20px rgb(0,0,0,0.6);
  
  /* Dark mode form controls */
  --kr-form-bg: #3a332b;
  --kr-form-bg-focus: #423a31;
  
  /* Couleurs nations mode sombre (.f1-.f9) */
  --kr-nation-1: #ff8080;
  --kr-nation-2: #d4a574;
  --kr-nation-3: #ffe066;
  --kr-nation-4: #74b9ff;
  --kr-nation-5: #55efc4;
  --kr-nation-6: #a29bfe;
  --kr-nation-7: #b2bec3;
  --kr-nation-8: #81c784;
  --kr-nation-9: #c4b958;
}

html.kr-theme-variant-paladium-dark {
  --kr-primary: #e6c76e;
  --kr-primary-dark: #D4AF37;
  --kr-highlight: #4a9d5f;
  --kr-highlight-reverse: #021a0a;

  /* Dark mode surfaces */
  --kr-bg-page: #0f0e0a;
  --kr-bg-surface: #1a1810;
  --kr-bg-elevated: #252015;
  --kr-bg-hover: rgba(255, 255, 255, 0.03);
  --kr-bg-active: rgba(255, 255, 255, 0.06);

  /* Color scheme */
  color-scheme: dark;

  /* Dark mode texte */
  --kr-text-primary: #f5f3e8;
  --kr-text-secondary: #c4b896;
  --kr-text-muted: #938567;
  --kr-text-inverse: #0f0e0a;

  /* Dark mode bordures */
  --kr-border-default: rgb(255,255,255,0.08);
  --kr-border-strong: rgb(255,255,255,0.15);

  /* Dark mode ombres */
  --kr-shadow-sm: 0 1px 3px rgb(0,0,0,0.4);
  --kr-shadow-md: 0 4px 8px rgb(0,0,0,0.5);
  --kr-shadow-lg: 0 10px 20px rgb(0,0,0,0.6);
  
  /* Dark mode form controls */
  --kr-form-bg: #3a3420;
  --kr-form-bg-focus: #43392a;
  
  /* Couleurs nations mode sombre (.f1-.f9) */
  --kr-nation-1: #ff8080;
  --kr-nation-2: #e6c76e;
  --kr-nation-3: #ffe066;
  --kr-nation-4: #74b9ff;
  --kr-nation-5: #55efc4;
  --kr-nation-6: #a29bfe;
  --kr-nation-7: #b2bec3;
  --kr-nation-8: #81c784;
  --kr-nation-9: #c4b958;
}

html.kr-theme-variant-theocratie-seelienne-dark {
  --kr-primary: #5a8fd9;
  --kr-primary-dark: #2d5fcb;
  --kr-highlight: #80b3ff;
  --kr-highlight-reverse: #000d1f;

  /* Dark mode surfaces */
  --kr-bg-page: #0a0e15;
  --kr-bg-surface: #12182a;
  --kr-bg-elevated: #1a2438;
  --kr-bg-hover: rgba(255, 255, 255, 0.03);
  --kr-bg-active: rgba(255, 255, 255, 0.06);

  /* Color scheme */
  color-scheme: dark;

  /* Dark mode texte */
  --kr-text-primary: #e8f0ff;
  --kr-text-secondary: #9db5d6;
  --kr-text-muted: #6b7f9e;
  --kr-text-inverse: #0a0e15;

  /* Dark mode bordures */
  --kr-border-default: rgb(255,255,255,0.08);
  --kr-border-strong: rgb(255,255,255,0.15);

  /* Dark mode ombres */
  --kr-shadow-sm: 0 1px 3px rgb(0,0,0,0.4);
  --kr-shadow-md: 0 4px 8px rgb(0,0,0,0.5);
  --kr-shadow-lg: 0 10px 20px rgb(0,0,0,0.6);
  
  /* Dark mode form controls */
  --kr-form-bg: #2a3447;
  --kr-form-bg-focus: #323d54;
  
  /* Couleurs nations mode sombre (.f1-.f9) */
  --kr-nation-1: #ff8080;
  --kr-nation-2: #d4a574;
  --kr-nation-3: #ffe066;
  --kr-nation-4: #80b3ff;
  --kr-nation-5: #55efc4;
  --kr-nation-6: #a29bfe;
  --kr-nation-7: #b2bec3;
  --kr-nation-8: #81c784;
  --kr-nation-9: #c4b958;
}

html.kr-theme-variant-paradigme-vert-dark {
  --kr-primary: #4d9c61;
  --kr-primary-dark: #2a7a3d;
  --kr-highlight: #70c784;
  --kr-highlight-reverse: #021508;

  /* Dark mode surfaces */
  --kr-bg-page: #0a120d;
  --kr-bg-surface: #0f1a13;
  --kr-bg-elevated: #1a2820;
  --kr-bg-hover: rgba(255, 255, 255, 0.03);
  --kr-bg-active: rgba(255, 255, 255, 0.06);

  /* Color scheme */
  color-scheme: dark;

  /* Dark mode texte */
  --kr-text-primary: #e8f5ed;
  --kr-text-secondary: #a0c4ab;
  --kr-text-muted: #6d8a75;
  --kr-text-inverse: #0a120d;

  /* Dark mode bordures */
  --kr-border-default: rgb(255,255,255,0.08);
  --kr-border-strong: rgb(255,255,255,0.15);

  /* Dark mode ombres */
  --kr-shadow-sm: 0 1px 3px rgb(0,0,0,0.4);
  --kr-shadow-md: 0 4px 8px rgb(0,0,0,0.5);
  --kr-shadow-lg: 0 10px 20px rgb(0,0,0,0.6);
  
  /* Dark mode form controls */
  --kr-form-bg: #2a3d30;
  --kr-form-bg-focus: #324539;
  
  /* Couleurs nations mode sombre (.f1-.f9) */
  --kr-nation-1: #ff8080;
  --kr-nation-2: #d4a574;
  --kr-nation-3: #ffe066;
  --kr-nation-4: #74b9ff;
  --kr-nation-5: #70c784;
  --kr-nation-6: #a29bfe;
  --kr-nation-7: #b2bec3;
  --kr-nation-8: #81c784;
  --kr-nation-9: #c4b958;
}

html.kr-theme-variant-khanat-elmerien-dark {
  --kr-primary: #96c;
  --kr-primary-dark: #7b4c9c;
  --kr-highlight: #b794d9;
  --kr-highlight-reverse: #1a0425;

  /* Dark mode surfaces */
  --kr-bg-page: #0f0a15;
  --kr-bg-surface: #1a121f;
  --kr-bg-elevated: #251a2d;
  --kr-bg-hover: rgba(255, 255, 255, 0.03);
  --kr-bg-active: rgba(255, 255, 255, 0.06);

  /* Color scheme */
  color-scheme: dark;

  /* Dark mode texte */
  --kr-text-primary: #f0e8ff;
  --kr-text-secondary: #bba0d6;
  --kr-text-muted: #857299;
  --kr-text-inverse: #0f0a15;

  /* Dark mode bordures */
  --kr-border-default: rgb(255,255,255,0.08);
  --kr-border-strong: rgb(255,255,255,0.15);

  /* Dark mode ombres */
  --kr-shadow-sm: 0 1px 3px rgb(0,0,0,0.4);
  --kr-shadow-md: 0 4px 8px rgb(0,0,0,0.5);
  --kr-shadow-lg: 0 10px 20px rgb(0,0,0,0.6);
  
  /* Dark mode form controls */
  --kr-form-bg: #3a2f47;
  --kr-form-bg-focus: #443854;
  
  /* Couleurs nations mode sombre (.f1-.f9) */
  --kr-nation-1: #ff8080;
  --kr-nation-2: #d4a574;
  --kr-nation-3: #ffe066;
  --kr-nation-4: #74b9ff;
  --kr-nation-5: #55efc4;
  --kr-nation-6: #b794d9;
  --kr-nation-7: #b2bec3;
  --kr-nation-8: #81c784;
  --kr-nation-9: #c4b958;
}

html.kr-theme-variant-confederation-libre-dark {
  --kr-primary: #9ca3af;
  --kr-primary-dark: #6b7280;
  --kr-highlight: #c2c9d6;
  --kr-highlight-reverse: #0f1115;

  /* Dark mode surfaces */
  --kr-bg-page: #0e1013;
  --kr-bg-surface: #16181c;
  --kr-bg-elevated: #1f2228;
  --kr-bg-hover: rgba(255, 255, 255, 0.03);
  --kr-bg-active: rgba(255, 255, 255, 0.06);

  /* Color scheme */
  color-scheme: dark;

  /* Dark mode texte */
  --kr-text-primary: #e8eaed;
  --kr-text-secondary: #b8bcc4;
  --kr-text-muted: #7e8591;
  --kr-text-inverse: #0e1013;

  /* Dark mode bordures */
  --kr-border-default: rgb(255,255,255,0.08);
  --kr-border-strong: rgb(255,255,255,0.15);

  /* Dark mode ombres */
  --kr-shadow-sm: 0 1px 3px rgb(0,0,0,0.4);
  --kr-shadow-md: 0 4px 8px rgb(0,0,0,0.5);
  --kr-shadow-lg: 0 10px 20px rgb(0,0,0,0.6);
  
  /* Dark mode form controls */
  --kr-form-bg: #2d3139;
  --kr-form-bg-focus: #363a43;
  
  /* Couleurs nations mode sombre (.f1-.f9) */
  --kr-nation-1: #ff8080;
  --kr-nation-2: #d4a574;
  --kr-nation-3: #ffe066;
  --kr-nation-4: #74b9ff;
  --kr-nation-5: #55efc4;
  --kr-nation-6: #a29bfe;
  --kr-nation-7: #c2c9d6;
  --kr-nation-8: #81c784;
  --kr-nation-9: #c4b958;
}

html.kr-theme-variant-royaume-ruthvenie-dark {
  --kr-primary: #4a9d61;
  --kr-primary-dark: #2a7a3d;
  --kr-highlight: #ff6b85;
  --kr-highlight-reverse: #1a0408;

  /* Dark mode surfaces */
  --kr-bg-page: #0d1210;
  --kr-bg-surface: #141a16;
  --kr-bg-elevated: #1d2621;
  --kr-bg-hover: rgba(255, 255, 255, 0.03);
  --kr-bg-active: rgba(255, 255, 255, 0.06);

  /* Color scheme */
  color-scheme: dark;

  /* Dark mode texte */
  --kr-text-primary: #ecf5f0;
  --kr-text-secondary: #a5c4b0;
  --kr-text-muted: #708a79;
  --kr-text-inverse: #0d1210;

  /* Dark mode bordures */
  --kr-border-default: rgb(255,255,255,0.08);
  --kr-border-strong: rgb(255,255,255,0.15);

  /* Dark mode ombres */
  --kr-shadow-sm: 0 1px 3px rgb(0,0,0,0.4);
  --kr-shadow-md: 0 4px 8px rgb(0,0,0,0.5);
  --kr-shadow-lg: 0 10px 20px rgb(0,0,0,0.6);
  
  /* Dark mode form controls */
  --kr-form-bg: #2d3d33;
  --kr-form-bg-focus: #36463b;
  
  /* Couleurs nations mode sombre (.f1-.f9) */
  --kr-nation-1: #ff8080;
  --kr-nation-2: #d4a574;
  --kr-nation-3: #ffe066;
  --kr-nation-4: #74b9ff;
  --kr-nation-5: #55efc4;
  --kr-nation-6: #a29bfe;
  --kr-nation-7: #b2bec3;
  --kr-nation-8: #70c784;
  --kr-nation-9: #c4b958;
}


/* ============================================================================
   2. LAYOUT OVERRIDES
   ============================================================================ */

/* Hide top header with Kraland logo */
#top {
  display: none !important;
}


html {
  height: auto !important; /* Force HTML à grandir avec le contenu */
}

body {
  min-height: 100vh !important; /* Le body fait au moins la hauteur du viewport pour les pages courtes */
  height: auto !important; /* Laisser le body grandir avec le contenu */
  display: flex;
  flex-direction: column;
  margin: 0 !important; /* Pas de margin pour éviter le décalage de 60px */
  padding-top: 60px; /* Compenser la navigation fixe (60px) */
}

/* La navigation en haut est en position fixed, donc elle sort du flux */
nav.navbar {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1030 !important; /* Au-dessus du contenu */
  height: auto !important; /* Laisser la hauteur s'adapter au contenu */
  max-height: 60px !important; /* Limiter la hauteur maximale */
}

/* Le contenu principal occupe l'espace disponible */
#content {
  flex: 1 0 auto;
}

footer {
  /* Footer en position normale, collé en bas grâce au flexbox */
  flex-shrink: 0;
  width: 100%;
}

/* Option pour masquer la citation du footer */
html.kr-hide-footer-quote .footer-quote {
  display: none !important;
}

/* Increase container width: remove 150px from each side */
.container {
  max-width: 1608px !important;
  width: 1608px !important;
}



/* Show skills panel (no longer collapsed by default) */
#skills-panel {
  display: block !important;
  border: 1px solid rgb(0, 0, 0, 0.06) !important;
  border-radius: 5px !important;
  background-color: var(--kr-white) !important;
}


/* ============================================================================
   3. NAVIGATION
   ============================================================================ */

/* Navbar brand (logo) alignment */
.navbar-brand {
  display: flex !important;
  align-items: center !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.navbar-brand img.kr-logo {
  height: 28px;
  vertical-align: middle;
}

.navbar-nav > li > a{
  color: var(--kr-white) !important;
}


/* ============================================================================
   4. FORMS
   ============================================================================ */

.form-control.form-control {
  border-radius: .4rem;
  border: 1px solid rgb(0,0,0,0.08);
  padding: .6rem .8rem;
  font-size: .95rem;
}

.form-control:focus {
  box-shadow: 0 0 0 .18rem var(--kr-focus-ring);
  border-color: var(--kr-primary);
  outline: none;
}

textarea.form-control.form-control {
  font-size: 1.4rem !important;
  line-height: 1.6 !important;
}

.form-group label {
  color: var(--kr-text);
  font-weight: 600;
}



input[type="checkbox"],
input[type="radio"] {
  accent-color: var(--kr-primary) !important;
}

input[type="checkbox"]:focus,
input[type="radio"]:focus {
  outline: none;
  box-shadow: 0 0 0 .12rem var(--kr-focus-ring-light) !important;
}

input[type="checkbox"]:checked {
  border-color: var(--kr-primary) !important;
}

/* ============================================================================
   5. BADGES, LABELS & ALERTS
   Consolidated color remapping for theme
   ============================================================================ */

/* Badges & labels - info/primary variants use red */
.label,
.badge {
  background-color: var(--kr-primary);
  color: var(--kr-white);
  border-color: var(--kr-primary-dark);
}

.bg-info {
  background-color: var(--kr-primary);
  color: var(--kr-white);
}

/* Badge danger - notification alert always red on all themes */
.badge-danger {
  background-color: var(--kr-badge-danger) !important;
  color: var(--kr-white) !important;
  border-color: var(--kr-badge-danger-border) !important;
}

/* Alerts - info variant */
.alert.alert-info {
  background-color: var(--kr-alert-info-bg);
  border-color: var(--kr-alert-info-border);
  color: var(--kr-text);
}

.alert strong,
.alert p {
  color: var(--kr-text);
}


/* ============================================================================
   6. LIST GROUPS
   ============================================================================ */

.list-group-item {
  border: none;
  padding: .6rem .75rem;
}

.list-group-item.btn {
  border: none !important;
}

.list-group-item.active,
.list-group-item.active:focus,
.list-group-item.active:hover,
.list-group-item.active a {
  background-color: var(--kr-primary) !important;
  border-color: var(--kr-primary-dark) !important;
  color: var(--kr-surface) !important;
}

/* Keep hover for non-active items subtle and themed */
.list-group-item:hover {
  color: var(--kr-primary-dark);
  background-color: rgb(0,0,0,0.02);
}

/* ============================================================================
   7. AVATARS
   Ensure avatars are displayed at least the configured size and crop nicely
   ============================================================================ */
.img-circle {
  width: var(--kr-avatar-size);
  height: var(--kr-avatar-size);
  min-width: var(--kr-avatar-size);
  min-height: var(--kr-avatar-size);
  object-fit: cover;
  display: inline-block;
  border-radius: 50%;
}

/* Fix: Override Bootstrap .img-responsive on avatars to prevent stretching */
.img-circle.img-responsive,
.img-circle.img-thumbnail {
  max-width: none !important;
  width: var(--kr-avatar-size);
  height: var(--kr-avatar-size);
}


/* Ensure layout doesn't break: allow the author column to accommodate larger avatars */
.col-md-3.sidebar .avatar,
.col-md-2.sidebar .avatar {
  margin-bottom: 0.5rem;
}

/* Align list-group user items with their avatar to prevent overflow */
.list-group a.list-group-item.ds_user,
.list-group-item.ds_user {
  position: relative;
  min-height: var(--kr-avatar-size) !important;
  padding-right: calc(var(--kr-avatar-size) + 1rem) !important;
  display: flex !important;
  align-items: center !important;
}

.list-group-item.ds_user .pull-right {
  position: absolute !important;
  right: .75rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

/* ============================================================================
   7.1 PLAYER HEADER SECTION - FIX BOOTSTRAP GRID
   
   Le HTML utilise des classes .nopadding qui cassent le système de grille Bootstrap.
   On restaure ici les paddings standards pour que les .row et .col- fonctionnent correctement.
   ============================================================================ */

/* Restaurer le padding Bootstrap standard (15px) pour toutes les colonnes dans le header */
#player-header-section .nopadding,
#player-header-section .nopadding-right,
#player-main-panel .nopadding,
#player-main-panel .nopadding-right,
#player-vitals-section .nopadding,
#player-vitals-section .nopadding-right {
  padding-left: 15px !important;
  padding-right: 15px !important;
}

/* Exception : le bouton avatar peut avoir moins de padding pour rester centré */
#player-main-panel > .row > .nopadding:first-child {
  padding-left: 10px !important;
  padding-right: 10px !important;
}

/* Corriger le padding-left inline sur player-vitals-section */
#player-vitals-section[style*="padding-left"] {
  padding-left: 0 !important;
}

/* Structurer correctement player-actions-section qui contient des boutons sans colonnes */
#player-actions-section {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 15px !important;
}

/* Espacement entre les lignes de boutons d'accès rapide */
.kr-quick-access-buttons .col-xs-6 {
  margin-bottom: 10px;
}

#player-actions-section hr {
  width: 100%;
  margin: 0.5rem 0;
}



/* ============================================================================
   8. CAROUSEL
   ============================================================================ */

.carousel-caption {
  background: linear-gradient(180deg, rgb(0,0,0,0.55), rgb(0,0,0,0.35));
  padding: 1.4rem;
  padding-bottom: 56px;
  border-radius: .6rem;
  color: var(--kr-white);
}

.item img[class*="-slide"] {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
}

a.carousel-control.left,
a.carousel-control.right{
   background-image: none;
}


/* ============================================================================
   9. MODALS
   Fix modal overflow - prevent modals from extending beyond viewport
   Allow clicking outside to close
   ============================================================================ */

/* Conteneur modal - empêcher le scroll du conteneur */
.modal {
  display: flex !important;
  position: fixed !important; /* Nécessaire pour que la modal reste par-dessus le contenu */
  align-items: flex-start; /* Évite le scroll automatique */
  justify-content: center;
  overflow-y: hidden !important; /* Pas de scroll sur le conteneur modal */
  pointer-events: auto;
  padding-top: 30px; /* Espacement du haut */
}

.modal.in {
  /* Force le scroll à rester en haut lors de l'ouverture */
  overflow-y: hidden !important;
}

/* Dialog avec contraintes de hauteur et son propre scroll */
.modal-dialog {
  width: 900px;
  max-width: 90vw;
  margin: 0 auto 30px; /* Pas de margin-top car géré par padding du parent */
  max-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  overflow-y: auto; /* Le dialog peut scroller si nécessaire */
}

/* Content avec structure flex */
.modal-content {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow: hidden;
}

/* Body scrollable - le contenu peut scroller si trop grand */
.modal-body {
  overflow-y: auto;
  flex: 1 1 auto;
}

/* Header et footer restent fixes et toujours visibles */
.modal-header,
.modal-footer {
  flex-shrink: 0;
}

/* ============================================================================
   9b. BOOTBOX ORDER MODAL - MOBILE UX OPTIMIZATION
   Améliore l'utilisabilité mobile de la modale d'ordre
   - Zones tactiles 44px minimum (WCAG 2.1)
   - Grille responsive pour les actions
   - Footer sticky
   - Prévention zoom iOS (font-size 16px+)
   
   ⚠️ MOBILE ONLY - Ne s'applique QUE sur mobile (<768px)
   ============================================================================ */

@media (width <= 767px) {
  /* 1. SELECT PERSONNAGE */
  .bootbox-confirm .modal-body > select:first-of-type,
  .bootbox-confirm select.form-control {
  min-height: var(--mobile-touch-target);
  font-size: 16px !important; /* Évite zoom iOS */
  padding: 8px 12px;
  margin-bottom: var(--mobile-spacing-lg);
  border-radius: var(--mobile-radius);
}

/* 2. ACTIONS PRIMAIRES/SECONDAIRES EN GRILLE */
.bootbox-confirm .panel-heading ul.nav-tabs {
  display: grid !important; /* Override Bootstrap flex */
  grid-template-columns: repeat(2, 1fr); /* 2 colonnes sur mobile */
  gap: var(--mobile-spacing-md) !important;
  padding-left: 0;
  margin-bottom: var(--mobile-spacing-md);
  border-bottom: none !important; /* Retire la bordure des nav-tabs Bootstrap */
}

.bootbox-confirm .panel-heading ul.nav-tabs > li {
  margin: 0 !important;
  padding: 0;
  display: block;
  float: none !important; /* Override Bootstrap float */
}

.bootbox-confirm .panel-heading ul.nav-tabs > li > a {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--mobile-touch-target);
  padding: 12px 16px;
  text-align: center;
  background: var(--kr-bg-elevated);
  border: 1px solid var(--kr-border-default) !important;
  border-radius: var(--mobile-radius) !important;
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all var(--transition-fast);
  margin: 0 !important; /* Override Bootstrap margin */
}

.bootbox-confirm .panel-heading ul.nav-tabs > li.active > a {
  background: var(--kr-primary);
  color: white;
  border-color: var(--kr-primary) !important;
}

.bootbox-confirm .panel-heading ul.nav-tabs > li > a:hover,
.bootbox-confirm .panel-heading ul.nav-tabs > li > a:focus {
  background: var(--kr-bg-hover);
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: var(--kr-shadow-sm);
  border-color: var(--kr-primary) !important;
}

.bootbox-confirm .panel-heading ul.nav-tabs > li > a:active {
  transform: translateY(0);
  background: var(--kr-bg-active);
}

/* Icônes dans les actions (si présentes) */
.bootbox-confirm .list-inline > li > a > .fa,
.bootbox-confirm .list-inline > li > a > .glyphicon {
  margin-right: 6px;
  font-size: 1.1em;
}

/* 3. TABLEAU RADIO BUTTONS */

/* 3. PANEL ACTIONS - Layout Grid Compact */
.bootbox-confirm .panel-actions {
  padding: var(--mobile-spacing-md);
  background: var(--kr-bg-surface);
  border-radius: var(--mobile-radius);
}

/* Headers "Actions / Diff. / Jet" */
.bootbox-confirm .panel-actions::before {
  content: "Actions";
  display: block;
  font-weight: 600;
  font-size: 0.8125rem;
  color: var(--kr-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--mobile-spacing-sm);
  padding-bottom: var(--mobile-spacing-sm);
  border-bottom: 1px solid var(--kr-border-default);
}

/* ACTIONS GRID - Layout compact à 4 colonnes */
.bootbox-confirm .panel-actions .row.form-group {
  display: grid !important;
  grid-template-columns: 44px 1fr 60px 70px;
  gap: 0;
  padding: 0 !important;
  margin: 0 0 2px !important;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.2s ease;
}

/* Hover sur row */
.bootbox-confirm .panel-actions .row.form-group:hover {
  background: rgba(212, 165, 116, 0.05);
  border-color: rgba(212, 165, 116, 0.3);
  transform: translateX(2px);
}

/* Row checked - highlight fort */
.bootbox-confirm .panel-actions .row.form-group:has(input[type="radio"]:checked) {
  background: rgba(212, 165, 116, 0.12);
  border-color: var(--kr-primary);
  box-shadow: 0 0 0 1px rgba(212, 165, 116, 0.2);
}

/* Cellules du grid */
.bootbox-confirm .panel-actions .row.form-group > div {
  padding: 8px 6px !important;
  margin: 0 !important;
  display: flex !important;
  align-items: center;
  min-height: 44px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.bootbox-confirm .panel-actions .row.form-group > div:last-child {
  border-right: none;
}

/* Colonne 1 : Radio button (centré) */
.bootbox-confirm .panel-actions .row.form-group > div:nth-child(1) {
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
}

/* Colonne 2 : Label (aligné à gauche) */
.bootbox-confirm .panel-actions .row.form-group > div:nth-child(2) {
  padding-left: 12px !important;
}

/* Colonnes 3 & 4 : Diff et Jet (alignés à droite, font compact) */
.bootbox-confirm .panel-actions .row.form-group > div:nth-child(3),
.bootbox-confirm .panel-actions .row.form-group > div:nth-child(4) {
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--kr-text-secondary);
  background: rgba(0, 0, 0, 0.15);
}

/* Radio buttons - Style custom */
.bootbox-confirm .panel-actions input[type="radio"] {
  width: 20px !important;
  height: 20px !important;
  min-width: 20px !important;
  min-height: 20px !important;
  cursor: pointer;
  accent-color: var(--kr-primary);
  margin: 0 !important;
  flex-shrink: 0;
}

/* Labels - Style clickable */
.bootbox-confirm .panel-actions label {
  cursor: pointer;
  margin: 0 !important;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--kr-text-primary);
  transition: color 0.2s ease;
  user-select: none;
}

.bootbox-confirm .panel-actions label:hover {
  color: var(--kr-primary);
}

/* TABLE OBJETS - Style normal conservé */
.bootbox-confirm table {
  width: 100%;
  margin-bottom: var(--mobile-spacing-lg);
  border-collapse: separate;
  border-spacing: 0;
}

.bootbox-confirm table td,
.bootbox-confirm table th {
  padding: 12px 8px;
  vertical-align: middle;
  border-bottom: 1px solid var(--kr-border-default);
}

.bootbox-confirm table th {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--kr-text-secondary);
  background: var(--kr-bg-elevated);
}

/* 4. CHECKBOXES & BONUS - Ligne horizontale unifiée */
.bootbox-confirm input[type="checkbox"] {
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  cursor: pointer;
  accent-color: var(--kr-primary);
  margin: 0;
}

/* Groupes de formulaire en ligne */
.bootbox-confirm .form-group:has(input[type="checkbox"]),
.bootbox-confirm .form-group:has(select[name="bonus"]) {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  width: auto;
  margin-right: var(--mobile-spacing-md);
  margin-bottom: var(--mobile-spacing-md);
}

.bootbox-confirm .modal-body label {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  margin-bottom: 0;
  padding: 10px 0;
}

/* Select Bonus optimisé */
.bootbox-confirm select[name="bonus"] {
  min-height: 44px;
  padding: 10px 12px;
  font-size: 0.9375rem;
  border: 1px solid var(--kr-border-default);
  border-radius: 8px;
  background: var(--kr-bg-surface);
  color: var(--kr-text-primary);
  cursor: pointer;
}

.bootbox-confirm .form-group {
  margin-bottom: var(--mobile-spacing-lg);
}

/* 5. TOOLBAR BBCODE */
.bootbox-confirm .btn-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: var(--mobile-spacing-md);
}

.bootbox-confirm .btn-toolbar .btn-group {
  margin-right: 0;
  margin-bottom: 4px;
}

.bootbox-confirm .btn-toolbar .btn {
  min-height: var(--mobile-touch-target);
  min-width: var(--mobile-touch-target);
  padding: 8px 12px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.bootbox-confirm .btn-toolbar .btn:hover {
  background: var(--kr-bg-hover);
  border-color: var(--kr-primary);
}

/* 6. TEXTAREA MESSAGE */
.bootbox-confirm textarea.form-control {
  min-height: 120px;
  font-size: 16px !important; /* Évite zoom iOS */
  line-height: 1.5;
  resize: vertical;
}

/* ============================================================================
   9c. MODAL ORDRE - OPTIMISATION MOBILE (MOBILE ONLY)
   Structure sticky, zones identifiées, grille d'actions (nav-tabs)
   ============================================================================ */

/* GARDE-FOU : Tous les styles dans media query mobile uniquement */
@media (width <= 768px) {
  /* === STRUCTURE FLEXBOX STICKY === */

  /* IMPORTANT: Cibler uniquement .modal-content, pas .modal-dialog */
  .bootbox-confirm > .modal-dialog {
    display: block !important; /* Annuler tout flex sur modal-dialog */
  }
  
  .bootbox-confirm .modal-content {
    display: flex !important;
    flex-direction: column !important;
    max-height: 90vh !important;
  }
  
  /* Header zone (select + title) - sticky */
  .bootbox-confirm .kraland-modal-header,
  .bootbox-confirm .kraland-character-title {
    position: sticky !important;
    top: 0 !important;
    z-index: 110 !important;
    background: white !important;
    flex-shrink: 0 !important;
  }
  
  .bootbox-confirm .kraland-modal-header {
    padding: 12px 16px 8px !important;
    border-bottom: 1px solid #e0e0e0 !important;
  }
  
  .bootbox-confirm .kraland-character-title {
    padding: 8px 16px !important;
    margin: 0 !important;
    font-size: 18px !important;
  }
  
  /* Actions zone (panel-heading avec nav-tabs) - sticky */
  .bootbox-confirm .kraland-actions-zone {
    position: sticky !important;
    top: 0 !important;
    z-index: 100 !important;
    background: white !important;
    padding: 12px 16px !important;
    border-bottom: 2px solid #f0f0f0 !important;
  }
  
  /* Body scrollable */
  .bootbox-confirm .modal-body {
    flex: 1 !important;
    overflow: hidden auto !important;
    padding: 0 !important;
  }
  
  /* Zone de formulaire (panel-body) - scrollable */
  .bootbox-confirm .kraland-form-zone {
    padding: 16px !important;
  }
  
  /* Footer du panel (coût/durée) - sticky avant footer modal */
  .bootbox-confirm .kraland-action-footer {
    position: sticky !important;
    bottom: 72px !important; /* Hauteur du footer modal */
    z-index: 90 !important;
    background: #f8f8f8 !important;
    padding: 12px 16px !important;
    border-top: 1px solid #e0e0e0 !important;
  }
  
  .bootbox-confirm .kraland-action-footer p {
    margin: 0 !important;
    font-size: 13px !important;
    color: #666 !important;
  }
  
  /* Footer modal sticky (boutons OK/Cancel) */
  .bootbox-confirm .kraland-modal-footer {
    position: sticky !important;
    bottom: 0 !important;
    z-index: 110 !important;
    background: white !important;
    flex-shrink: 0 !important;
    padding: 12px 16px !important;
    border-top: 2px solid #e0e0e0 !important;
    display: flex !important;
    gap: 12px !important;
  }
  
  .bootbox-confirm .kraland-modal-footer .btn {
    flex: 1 !important;
    min-height: 56px !important;
    font-size: 16px !important;
    border-radius: 8px !important;
  }
  
  /* === OPTIMISATION DES NAV-TABS (déjà en grid par forceOrderModalGridLayout) === */

  /* Les nav-tabs sont déjà stylés en grid 2 colonnes par le JS */

  /* On améliore juste le spacing et les couleurs */
  
  .bootbox-confirm .nav.nav-tabs li a {
    font-size: 15px !important;
    font-weight: 500 !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
    transition: all 0.2s ease !important;
  }
  
  /* Hover sur les nav-tabs */
  .bootbox-confirm .nav.nav-tabs li a:hover {
    background: #f0f8ff !important;
    text-decoration: none !important;
  }
  
  /* État actif des nav-tabs */
  .bootbox-confirm .nav.nav-tabs li.active a {
    background: #428bca !important;
    border-color: #428bca !important;
    color: white !important;
  }
  
  /* === OPTIMISATIONS FORMULAIRE === */
  
  /* IMPORTANT: Annuler les flex indésirables sur certains éléments Bootstrap SAUF les panels avec tableau */
  .bootbox-confirm .row,
  .bootbox-confirm [class*="col-"],
  .bootbox-confirm .form-group,
  .bootbox-confirm .tab-content {
    display: block !important;
  }
  
  /* EXCEPTION CRITIQUE: Les panels de type info (tableaux Actions) doivent utiliser flexbox */
  .bootbox-confirm .panel-info .panel-heading,
  .bootbox-confirm .panel-info .panel-body,
  .bootbox-confirm .panel-info .panel-footer {
    display: block !important; /* Garder block pour le container */
  }
  
  /* Les ROWS à l'intérieur des panels doivent être en flex pour l'alignement horizontal */
  .bootbox-confirm .panel-info .panel-heading .row,
  .bootbox-confirm .panel-info .panel-body .row,
  .bootbox-confirm .panel-info .panel-footer .row {
    display: flex !important;
    flex-flow: row nowrap !important;
    align-items: center !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  
  /* Les colonnes dans ces rows doivent avoir leur largeur Bootstrap */
  .bootbox-confirm .panel-info .row > [class*="col-"] {
    flex-shrink: 0 !important;
  }
  
  /* Largeurs spécifiques: Nouvelle répartition sm-0 / sm-7 / sm-3 / sm-3 */

  /* IMPORTANT: Définir les largeurs AVANT les paddings pour éviter les écrasements */
  .bootbox-confirm .panel-info .panel-heading .row > .col-sm-1,
  .bootbox-confirm .panel-info .panel-body .row > .col-sm-1 {
    flex: 0 0 0% !important;
    max-width: 0% !important;
    padding: 0 !important; /* Masquer complètement */
    overflow: hidden !important;
    width: 0 !important;
  }
  
  .bootbox-confirm .panel-info .panel-heading .row > .col-sm-7,
  .bootbox-confirm .panel-info .panel-body .row > .col-sm-7 {
    flex: 0 0 46% !important; /* 46% pour Actions */
    max-width: 46% !important;
  }
  
  /* Premier col-sm-2 (Diff.) devient col-sm-3 visuellement */
  .bootbox-confirm .panel-info .panel-heading .row > .col-sm-2:nth-child(3),
  .bootbox-confirm .panel-info .panel-body .row > .col-sm-2:nth-child(3) {
    flex: 0 0 27% !important; /* 27% pour Diff. */
    max-width: 27% !important;
  }
  
  /* Deuxième col-sm-2 (Jet) devient col-sm-3 visuellement */
  .bootbox-confirm .panel-info .panel-heading .row > .col-sm-2:nth-child(4),
  .bootbox-confirm .panel-info .panel-body .row > .col-sm-2:nth-child(4) {
    flex: 0 0 27% !important; /* 27% pour Jet */
    max-width: 27% !important;
  }
  
  /* ESPACEMENT: Padding pour éviter que les colonnes soient collées (APRÈS les largeurs) */
  .bootbox-confirm .panel-info .panel-heading .row > [class*="col-"]:not(.col-sm-1),
  .bootbox-confirm .panel-info .panel-body .row > [class*="col-"]:not(.col-sm-1) {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
  
  /* === FOOTER: Layout spécifique pour Maladresse + Bonus === */
  
  /* Footer: Groupement visuel avec widths fixes (proportions: 15% + 25% | 20% + 40%) */

  /* Groupe 1: Checkbox (15%) + Maladresse (25%) = 40% */
  .bootbox-confirm .panel-info .panel-footer .row > .col-sm-1 {
    flex: 0 0 15% !important;
    max-width: 15% !important;
    padding-left: 8px !important;
    padding-right: 4px !important;
  }
  
  .bootbox-confirm .panel-info .panel-footer .row > .col-sm-7 {
    flex: 0 0 25% !important;
    max-width: 25% !important;
    padding-left: 0 !important;
    padding-right: 12px !important; /* Gap avant groupe 2 */
  }
  
  /* Groupe 2: Bonus (20%) + Select (40%) = 60% */
  .bootbox-confirm .panel-info .panel-footer .row > .col-sm-2:nth-child(3) {
    flex: 0 0 20% !important;
    max-width: 20% !important;
    padding-left: 12px !important; /* Gap après groupe 1 */
    padding-right: 4px !important;
  }
  
  .bootbox-confirm .panel-info .panel-footer .row > .col-sm-2:nth-child(4) {
    flex: 0 0 40% !important;
    max-width: 40% !important;
    padding-left: 0 !important;
    padding-right: 8px !important;
  }
  
  /* === Alignement vertical des éléments du footer === */
  .bootbox-confirm .panel-info .panel-footer .row {
    align-items: center !important;
  }
  
  .bootbox-confirm .panel-info .panel-footer input[type="checkbox"],
  .bootbox-confirm .panel-info .panel-footer select,
  .bootbox-confirm .panel-info .panel-footer label {
    vertical-align: middle !important;
  }
  
  /* IMPORTANT: Préserver le comportement normal des tableaux Bootstrap */
  .bootbox-confirm table {
    display: table !important;
    width: 100% !important;
    table-layout: auto !important;
  }
  
  .bootbox-confirm table tbody {
    display: table-row-group !important;
  }
  
  .bootbox-confirm table tr {
    display: table-row !important;
  }
  
  .bootbox-confirm table td,
  .bootbox-confirm table th {
    display: table-cell !important;
    vertical-align: middle !important;
  }
  
  /* Select personnage */
  .bootbox-confirm .kraland-modal-header select {
    width: 100% !important;
    height: 48px !important;
    font-size: 16px !important;
    border-radius: 8px !important;
  }
  
  /* Image personnage dans title */
  .bootbox-confirm .kraland-character-title img {
    width: 60px !important;
    height: 60px !important;
    border-radius: 8px !important;
    object-fit: cover !important;
    margin-right: 12px !important;
  }
  
  /* Panel formulaire */
  .bootbox-confirm .kraland-form-zone .panel {
    border-radius: 8px !important;
    margin-bottom: 16px !important;
  }
  
  /* Inputs et textarea */
  .bootbox-confirm .kraland-form-zone input[type="text"],
  .bootbox-confirm .kraland-form-zone textarea,
  .bootbox-confirm .kraland-form-zone select {
    font-size: 16px !important; /* Évite zoom iOS */
    border-radius: 6px !important;
  }
  
  .bootbox-confirm .kraland-form-zone textarea {
    min-height: 120px !important;
  }
  
}

.bootbox-confirm textarea.form-control:focus {
  border-color: var(--kr-primary);
  box-shadow: 0 0 0 3px var(--kr-focus-ring);
  outline: none;
}

/* ============================================================================
   9d. AMÉLIORATIONS UX MODAL ORDRE (MOBILE ONLY)
   ============================================================================ */

@media (width <= 768px) {
  /* === UX #1: ALERTE REPLIABLE === */
  .bootbox-confirm .kr-alert-collapsible {
    padding: 0 !important;
    margin-bottom: 12px !important;
    border-radius: 8px !important;
    overflow: hidden !important;
  }
  
  .bootbox-confirm .kr-alert-toggle {
    width: 100% !important;
    padding: 12px 16px !important;
    background: #e3f2fd !important;
    border: none !important;
    color: #1565c0 !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    text-align: left !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    cursor: pointer !important;
    transition: background 0.2s ease !important;
  }
  
  .bootbox-confirm .kr-alert-toggle:active {
    background: #bbdefb !important;
  }
  
  .bootbox-confirm .kr-alert-toggle i {
    font-size: 18px !important;
  }
  
  .bootbox-confirm .kr-alert-content {
    padding: 12px 16px !important;
    background: white !important;
    border-top: 1px solid #e0e0e0 !important;
    animation: slide-down 0.2s ease !important;
  }
  
  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* === UX #2: NAV-TABS ÉTAT ACTIF RENFORCÉ === */
  .bootbox-confirm .nav.nav-tabs li.active a {
    background: linear-gradient(135deg, #428bca 0%, #3071a9 100%) !important;
    border-color: #428bca !important;
    color: white !important;
    font-weight: 600 !important;
    box-shadow: 0 2px 8px rgba(66, 139, 202, 0.4) !important;
    transform: translateY(-1px) !important;
  }
  
  .bootbox-confirm .nav.nav-tabs li a:active {
    transform: translateY(0) !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
  }
  
  /* === UX #3: TEXTAREA AGRANDI === */
  .bootbox-confirm .kraland-form-zone textarea#message {
    min-height: 160px !important;
    resize: vertical !important;
    font-size: 16px !important;
    line-height: 1.5 !important;
    padding: 12px !important;
  }
  
  /* === UX #4: FOOTER EN BADGES === */
  .bootbox-confirm .kr-action-badges {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 8px !important;
    align-items: center !important;
  }
  
  .bootbox-confirm .kr-badge {
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    padding: 6px 12px !important;
    border-radius: 16px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    white-space: nowrap !important;
  }
  
  .bootbox-confirm .kr-badge i {
    font-size: 14px !important;
  }
  
  .bootbox-confirm .kr-badge-cost {
    background: #fff3cd !important;
    color: #856404 !important;
    border: 1px solid #ffeaa7 !important;
  }
  
  .bootbox-confirm .kr-badge-duration {
    background: #d1ecf1 !important;
    color: #0c5460 !important;
    border: 1px solid #b8daff !important;
  }
  
  .bootbox-confirm .kr-badge-potential {
    background: #f8d7da !important;
    color: #721c24 !important;
    border: 1px solid #f5c6cb !important;
  }
  
  /* === UX #5: BOUTON OK RENFORCÉ === */
  .bootbox-confirm .kr-btn-primary-enhanced {
    background: linear-gradient(135deg, #5cb85c 0%, #449d44 100%) !important;
    border-color: #449d44 !important;
    color: white !important;
    font-weight: 700 !important;
    font-size: 18px !important;
    box-shadow: 0 4px 12px rgba(92, 184, 92, 0.4) !important;
    transition: all 0.2s ease !important;
  }
  
  .bootbox-confirm .kr-btn-primary-enhanced:active {
    transform: translateY(2px) !important;
    box-shadow: 0 2px 6px rgba(92, 184, 92, 0.3) !important;
  }
  
  .bootbox-confirm .kr-btn-secondary-subtle {
    background: #f5f5f5 !important;
    border-color: #ddd !important;
    color: #666 !important;
    font-weight: 500 !important;
  }
  
  .bootbox-confirm .kr-btn-secondary-subtle:active {
    background: #e0e0e0 !important;
  }
  
  /* === UX #6: SELECT GROUPÉ === */
  .bootbox-confirm .kraland-modal-header select optgroup {
    font-weight: 700 !important;
    font-size: 14px !important;
    color: #428bca !important;
    padding: 8px 0 !important;
  }
  
  .bootbox-confirm .kraland-modal-header select option {
    padding: 8px 12px !important;
    font-size: 15px !important;
  }
  
}

/* 7. ALERT D'AIDE */
.bootbox-confirm .alert {
  font-size: 0.875rem;
  padding: 12px;
  margin-bottom: var(--mobile-spacing-lg);
  border-radius: var(--mobile-radius);
  background: var(--kr-alert-info-bg);
  border: 1px solid var(--kr-alert-info-border);
}

.bootbox-confirm .alert .close {
  font-size: 1.5rem;
  line-height: 1;
  opacity: 0.5;
}

/* 8. FOOTER STICKY */
.bootbox-confirm .modal-footer {
  position: sticky;
  bottom: 0;
  background: var(--kr-bg-surface);
  border-top: 2px solid var(--kr-border-strong);
  padding: var(--mobile-spacing-lg);
  z-index: 100;
  box-shadow: 0 -4px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: var(--mobile-spacing-md);
}

/* Info coût/durée/potentiel */
.bootbox-confirm .modal-footer p {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--kr-text-primary);
  margin-bottom: 0;
  padding: var(--mobile-spacing-sm) var(--mobile-spacing-md);
  background: var(--kr-bg-elevated);
  border-radius: var(--mobile-radius);
  border-left: 3px solid var(--kr-primary);
}

/* Boutons footer */
.bootbox-confirm .modal-footer .btn {
  min-height: var(--mobile-touch-target);
  min-width: 100px;
  font-size: 1rem;
  padding: 10px 24px;
  border-radius: var(--mobile-radius);
  font-weight: 500;
}

.bootbox-confirm .modal-footer > div {
  display: flex;
  gap: var(--mobile-spacing-md);
  justify-content: flex-end;
}
} /* Fin @media (width < 768px) pour BOOTBOX ORDER MODAL */

/*
  Pagination est utilisé dans les rapports
*/
.pagination > li.active > a{
  color: var(--kr-surface);
  background-color: var(--kr-primary-dark);
  border-color: var(--kr-primary-dark);
}

.pagination > li > a{
  color: var(--kr-primary);
}

.pagination > li.active > a:hover{
  color: var(--kr-surface);
  background-color: var(--kr-primary);
  border-color: var(--kr-primary);
}

.pagination > li > a:hover{
  color: var(--kr-primary);
}

/*
  .bg-primary est utilisé dans les rapports
*/
.bg-primary {
  background-color: var(--kr-primary) !important;
  color: var(--kr-surface) !important;
}

a:link,
a:visited {
  color: var(--kr-highlight);
  text-decoration: none;
  transition: color .12s ease, opacity .12s ease;
}

a:hover,
a:focus {
  color: var(--kr-primary-dark);
  text-decoration: underline;
  outline: none;
}

button.btn-primary,
a.btn-primary {
  background-color: var(--kr-primary);
  border-color: var(--kr-primary-dark);
  color: var(--kr-highlight-reverse);
  box-shadow: 0 6px 18px var(--kr-btn-shadow);
}

button.btn-primary:hover,
button.btn-primary:focus,
a.btn-primary:hover,
a.btn-primary:focus {
  background-color: var(--kr-primary-dark);
}

/* ============================================================================
   HIDE UNWANTED HR ELEMENT
   Supprime la ligne horizontale bleue dans le liste des ordres de la fiche de personnage
   ============================================================================ */

hr[style*="border-top: 1px solid"][style*="337ab7"] {
  display: none !important;
}

/* ============================================================================
   10. FOOTER - BACK TO TOP
   Position the back-to-top button on the right side of the footer
   ============================================================================ */

footer .container.white {
  position: relative;
}

.container.white .kraland-back-to-top {
  position: fixed; /* Fixed au lieu d'absolute pour ne pas ajouter de hauteur au footer */
  right: 20px;
  bottom: 20px;
  z-index: 1000;
  transform: none; /* Pas de transform nécessaire avec fixed */
}

/* ============================================================================
   11. DASHBOARD FLEX CARDS - Groupes de joueurs
   Système de cartes en grid avec toutes les informations visibles
   ============================================================================ */

.dashboard.dashboard-flex {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Sections (Mon groupe / Autres personnages) */
.dashboard-section {
  background: var(--kr-surface);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgb(0,0,0,0.08);
}

.dashboard-section-header {
  background: var(--kr-primary);
  color: var(--kr-white);
  padding: 3px 8px;
  font-size: 9px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Boutons de groupe dans l'en-tête */
.dashboard-group-buttons {
  display: flex;
  gap: 6px;
}

.dashboard-group-buttons .btn {
  background-color: rgb(255, 255, 255, 0.15);
  border: 1px solid rgb(255, 255, 255, 0.25);
  color: var(--kr-white);
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.dashboard-group-buttons .btn:hover {
  background-color: rgb(255, 255, 255, 0.25);
  border-color: rgb(255, 255, 255, 0.4);
  transform: scale(1.05);
}

.dashboard-group-buttons .btn i {
  font-size: 12px;
}

/* Titre du groupe */
.dashboard-group-title {
  flex: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Grilles de cartes */
.dashboard-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
  padding: 12px;
}

.dashboard-cards-large {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

/* Cartes individuelles */
.dashboard-card {
  background: var(--kr-white);
  border: 1px solid rgb(0,0,0,0.08);
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgb(0,0,0,0.12);
  border-color: var(--kr-primary);
}

.dashboard-card-large {
  min-height: 90px;
}

/* Lien wrapper */
.dashboard-card-link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  flex: 1;
}

.dashboard-card-link:hover {
  text-decoration: none;
}

/* Header avec avatar et nom */
.dashboard-card-header {
  display: flex;
  align-items: center;
  background: rgb(0,0,0,0.02);
}

/* Wrapper pour l'avatar avec cercle de PV */
.dashboard-card-avatar-wrapper {
  position: relative;
  width: 82px;
  height: 82px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Cercle SVG de progression des PV */
.dashboard-card-hp-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 82px;
  height: 82px;
  pointer-events: none;
  z-index: 1;
}

.dashboard-card-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--kr-primary);
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.dashboard-card-large .dashboard-card-avatar {
  width: 70px;
  height: 70px;
}

/* Conteneur pour le drapeau et le nom */
.dashboard-card-name-container {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

/* Drapeau de nationalité dans le header */
.dashboard-card-world {
  width: 20px;
  height: 10px;
  object-fit: contain;
  flex-shrink: 0;
}

.dashboard-card-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--kr-text);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex: 1;
}

.dashboard-card-large .dashboard-card-name {
  font-size: 13px;
}

/* Body avec statut uniquement (monde dans les actions) */
.dashboard-card-body {
  padding: 0 8px 5px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-height: 0;
}

.dashboard-card-status {
  font-size: 9px;
  color: var(--kr-muted);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.dashboard-card-large .dashboard-card-status {
  font-size: 11px;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Barre de HP */
.dashboard-card-hp {
  height: 6px;
  background: rgb(0,0,0,0.08);
  position: relative;
  margin: 0;
}

.dashboard-card-hp-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
  border-radius: 0;
}

/* Badge PNJ */
.dashboard-card-pnj {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--kr-badge-pnj);
  color: var(--kr-white);
  font-size: 8px;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  z-index: 1;
}

/* Boutons d'actions individuelles par personnage */
.dashboard-card-actions {
  position: absolute;
  bottom: 4px;
  right: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  z-index: 2;
}

.dashboard-card:hover .dashboard-card-actions {
  opacity: 1;
}

/* Adapter les divs internes pour qu'elles soient empilées verticalement */
.dashboard-card-actions > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0 !important;
  padding: 0 !important;
  height: auto !important;
}

.dashboard-card-actions > div > div {
  margin: 0 !important;
  padding: 0 !important;
  height: auto !important;
}

/* Liens d'action compacts */
.dashboard-card-actions a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 6px !important;
  background-color: rgb(0, 0, 0, 0.6);
  border-radius: 3px;
  transition: background-color 0.2s ease;
  min-width: 24px;
  height: 24px;
}

.dashboard-card-actions a:hover {
  background-color: rgb(0, 0, 0, 0.8);
}

.dashboard-card-actions a i {
  color: var(--kr-white);
  font-size: 12px;
  margin: 0;
}

/* Responsive */
@media (width <= 768px) {
  .dashboard-cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
  }
  
  .dashboard-cards-large {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}


/* ============================================================================
   12. EDITEUR DE TEXTE
   Styles pour les boutons de l'éditeur BBCode
   ============================================================================ */

/* Style de base pour tous les boutons de l'éditeur, sauf la palette de couleurs */
.btn-toolbar .btn:not(.dropdown-menu *) {
  background-color: var(--kr-surface) !important;
  background-image: none !important;
  color: var(--kr-primary) !important;
  border: 1px solid rgb(0,0,0,0.06) !important;
  box-shadow: none !important;
}

.btn-toolbar .btn:not(.dropdown-menu *) i,
.btn-toolbar .btn:not(.dropdown-menu *) .fa,
.btn-toolbar .btn:not(.dropdown-menu *) .fas,
.btn-toolbar .btn:not(.dropdown-menu *) .far {
  color: inherit !important;
}

/* ============================================================================
   13. DARK MODE (Tous les thèmes)
   Styles mutualisés pour tous les thèmes en mode sombre
   ============================================================================ */

/* === BODY & BACKGROUNDS === */
html[class*="-dark"] body {
  background-color: var(--kr-bg-page);
  color: var(--kr-text-primary);
}

/* === PANELS === */
html[class*="-dark"] .panel,
html[class*="-dark"] .panel-default {
  background-color: var(--kr-bg-surface);
  border-color: var(--kr-border-default);
}

html[class*="-dark"] .panel-heading {
  background-color: var(--kr-bg-elevated);
  border-color: var(--kr-border-default);
  color: var(--kr-text-primary);
}

html[class*="-dark"] .panel-body {
  background-color: var(--kr-bg-surface);
  color: var(--kr-text-primary);
}

html[class*="-dark"] .panel-footer {
  background-color: var(--kr-bg-elevated);
  border-color: var(--kr-border-default);
}

/* === WELLS === */
html[class*="-dark"] .well {
  background-color: var(--kr-bg-elevated);
  border-color: var(--kr-border-default);
  color: var(--kr-text-primary);
}

/* === THEME SELECTOR TAMPERMONKEY === */
html[class*="-dark"] .kr-tamper-theme label {
  color: var(--kr-text-primary);
}

html[class*="-dark"] .kr-tamper-theme .control-label {
  color: var(--kr-text-secondary);
}

html[class*="-dark"] .kr-tamper-theme h4 {
  color: var(--kr-text-primary);
}

/* === MODALS === */
html[class*="-dark"] .modal-content {
  background-color: var(--kr-bg-surface);
  border-color: var(--kr-border-default);
}

html[class*="-dark"] .modal-header,
html[class*="-dark"] .modal-body,
html[class*="-dark"] .modal-footer {
  background-color: var(--kr-bg-surface);
  color: var(--kr-text-primary);
  border-color: var(--kr-border-default);
}

/* === FORMS === */
html[class*="-dark"] .form-control {
  background-color: var(--kr-form-bg);
  border-color: var(--kr-border-default);
  color: var(--kr-text-primary);
}

html[class*="-dark"] .form-control::placeholder {
  color: var(--kr-text-muted);
}

html[class*="-dark"] .form-control:focus {
  background-color: var(--kr-form-bg-focus);
  border-color: var(--kr-primary);
  color: var(--kr-text-primary);
}

html[class*="-dark"] .form-group label,
html[class*="-dark"] label {
  color: var(--kr-text-primary);
}

html[class*="-dark"] .input-group-addon {
  background-color: var(--kr-bg-elevated);
  border-color: var(--kr-border-default);
  color: var(--kr-text-primary);
}

/* === BUTTONS === */
html[class*="-dark"] .btn-primary {
  background-color: var(--kr-primary);
  border-color: var(--kr-primary-dark);
  color: var(--kr-text-primary);
}

html[class*="-dark"] .btn-primary:hover,
html[class*="-dark"] .btn-primary:focus,
html[class*="-dark"] .btn-primary:active {
  background-color: var(--kr-primary-dark);
  border-color: var(--kr-primary-dark);
  color: var(--kr-text-primary);
}

html[class*="-dark"] .btn-default {
  background-color: var(--kr-bg-elevated);
  border-color: var(--kr-border-default);
  color: var(--kr-text-primary);
}

html[class*="-dark"] .btn-default:hover {
  background-color: var(--kr-bg-active);
  border-color: var(--kr-border-strong);
}

html[class*="-dark"] .btn-default:focus,
html[class*="-dark"] .btn-default:active {
  background-color: var(--kr-bg-hover);
  border-color: var(--kr-border-strong);
  color: var(--kr-text-primary);
}

/* === LIST GROUPS === */
html[class*="-dark"] .list-group-item {
  background-color: var(--kr-bg-surface);
  border-color: var(--kr-border-default);
  color: var(--kr-text-primary);
}

html[class*="-dark"] .list-group-item:hover {
  background-color: var(--kr-bg-hover);
}

html[class*="-dark"] .list-group-item-heading {
  color: var(--kr-text-primary);
}

html[class*="-dark"] .list-group-item-text {
  color: var(--kr-text-secondary);
}

/* === TABLES === */
html[class*="-dark"] .table {
  color: var(--kr-text-primary);
}

html[class*="-dark"] .table > thead > tr > th,
html[class*="-dark"] .table > tbody > tr > th,
html[class*="-dark"] .table > tfoot > tr > th {
  background-color: var(--kr-bg-elevated);
  border-color: var(--kr-border-default);
  color: var(--kr-text-primary);
}

html[class*="-dark"] .table > tbody > tr > td {
  border-color: var(--kr-border-default);
}

html[class*="-dark"] .table-striped > tbody > tr:nth-of-type(odd) {
  background-color: var(--kr-bg-hover);
}

html[class*="-dark"] .table-hover > tbody > tr:hover {
  background-color: var(--kr-bg-active);
}

/* === DROPDOWNS === */
html[class*="-dark"] .dropdown-menu {
  background-color: var(--kr-bg-elevated);
  border-color: var(--kr-border-strong);
}

html[class*="-dark"] .dropdown-menu > li > a {
  color: var(--kr-text-primary);
}

html[class*="-dark"] .dropdown-menu > li > a:hover,
html[class*="-dark"] .dropdown-menu > li > a:focus {
  background-color: var(--kr-bg-hover);
  color: var(--kr-text-primary);
}

html[class*="-dark"] .dropdown-menu > .active > a,
html[class*="-dark"] .dropdown-menu > .active > a:hover,
html[class*="-dark"] .dropdown-menu > .active > a:focus {
  background-color: var(--kr-primary);
  color: var(--kr-text-inverse);
}

/* === NAVIGATION === */
html[class*="-dark"] .nav-tabs {
  border-color: var(--kr-border-default);
}

html[class*="-dark"] .nav-tabs > li > a {
  color: var(--kr-text-primary);
}

html[class*="-dark"] .nav-tabs > li > a:hover {
  background-color: var(--kr-bg-hover);
  border-color: var(--kr-border-default);
}

html[class*="-dark"] .nav-tabs > li.active > a,
html[class*="-dark"] .nav-tabs > li.active > a:hover,
html[class*="-dark"] .nav-tabs > li.active > a:focus {
  background-color: var(--kr-bg-surface);
  border-color: var(--kr-border-default) var(--kr-border-default) transparent;
  color: var(--kr-text-primary);
}

/* === ALERTS === */
html[class*="-dark"] .alert {
  border-color: var(--kr-border-default);
  color: var(--kr-text-primary) !important;
}

html[class*="-dark"] .alert * {
  color: inherit !important;
}

html[class*="-dark"] .alert a {
  color: var(--kr-primary) !important;
  text-decoration: underline;
}

html[class*="-dark"] .alert-info {
  background-color: rgb(122, 82, 64, 0.15);
  border-color: rgb(122, 82, 64, 0.3);
  color: var(--kr-text-primary);
}

html[class*="-dark"] .alert-success {
  background-color: rgb(34, 197, 94, 0.15);
  border-color: rgb(34, 197, 94, 0.3);
  color: var(--kr-text-primary);
}

html[class*="-dark"] .alert-warning {
  background-color: rgb(245, 158, 11, 0.15);
  border-color: rgb(245, 158, 11, 0.3);
  color: var(--kr-text-primary);
}

html[class*="-dark"] .alert-danger {
  background-color: rgb(239, 68, 68, 0.15);
  border-color: rgb(239, 68, 68, 0.3);
  color: var(--kr-text-primary);
}

/* === PROGRESS === */
html[class*="-dark"] .progress {
  background-color: var(--kr-bg-elevated);
}

/* === DASHBOARD CARDS === */
html[class*="-dark"] .dashboard-card {
  background: var(--kr-bg-surface);
  border-color: var(--kr-border-default);
}

html[class*="-dark"] .dashboard-card:hover {
  box-shadow: var(--kr-shadow-md);
}

html[class*="-dark"] .dashboard-card-header {
  background: var(--kr-bg-hover);
}

html[class*="-dark"] .dashboard-card-name {
  color: var(--kr-text-primary);
}

html[class*="-dark"] .dashboard-card-status {
  color: var(--kr-text-muted);
}

html[class*="-dark"] .dashboard-section {
  background: var(--kr-bg-surface);
}

html[class*="-dark"] .dashboard-card-hp {
  background: var(--kr-bg-elevated);
}

/* === MINI-CHAT === */
html[class*="-dark"] .chat li {
  border-bottom-color: var(--kr-border-default);
}

html[class*="-dark"] .panel-body-scroll {
  background-color: var(--kr-bg-surface);
}

html[class*="-dark"] #flap {
  background-color: var(--kr-bg-elevated);
}

html[class*="-dark"] #flap a.open,
html[class*="-dark"] #flap a.closed {
  background: var(--kr-bg-elevated);
  color: var(--kr-text-primary);
}

/* === MAP === */
html[class*="-dark"] .map-box {
  background-color: var(--kr-bg-surface);
  border-color: var(--kr-border-default);
}

html[class*="-dark"] .map-box-title {
  background-color: var(--kr-primary);
  color: var(--kr-text-inverse);
}

html[class*="-dark"] .map-box-content {
  color: var(--kr-text-primary);
}

html[class*="-dark"] .map-box-bottom {
  background-color: var(--kr-primary);
  color: var(--kr-text-inverse);
}

/* === CLASSES KRALAND .f1-.f9 (couleurs nations) === */
html[class*="-dark"] .f1 { color: var(--kr-nation-1); }
html[class*="-dark"] .f2 { color: var(--kr-nation-2); }
html[class*="-dark"] .f3 { color: var(--kr-nation-3); }
html[class*="-dark"] .f4 { color: var(--kr-nation-4); }
html[class*="-dark"] .f5 { color: var(--kr-nation-5); }
html[class*="-dark"] .f6 { color: var(--kr-nation-6); }
html[class*="-dark"] .f7 { color: var(--kr-nation-7); }
html[class*="-dark"] .f8 { color: var(--kr-nation-8); }
html[class*="-dark"] .f9 { color: var(--kr-nation-9); }

/* === CLASSES KRALAND .c1-.c10 (fonds nations) === */
html[class*="-dark"] .c1  { background-color: var(--kr-nation-bg-1); }
html[class*="-dark"] .c2  { background-color: var(--kr-nation-bg-2); }
html[class*="-dark"] .c3  { background-color: var(--kr-nation-bg-3); }
html[class*="-dark"] .c4  { background-color: var(--kr-nation-bg-4); }
html[class*="-dark"] .c5  { background-color: var(--kr-nation-bg-5); }
html[class*="-dark"] .c6  { background-color: var(--kr-nation-bg-6); }
html[class*="-dark"] .c7  { background-color: var(--kr-nation-bg-7); }
html[class*="-dark"] .c8  { background-color: var(--kr-nation-bg-8); }
html[class*="-dark"] .c9  { background-color: var(--kr-nation-bg-9); }
html[class*="-dark"] .c10 { background-color: var(--kr-nation-bg-10); }

/* === COULEURS HTML KRALAND (balises <font color="">) === */
/* Surcharge des couleurs spécifiques utilisées par Kraland pour le dark mode */
/* Ajustement minimal pour conserver les teintes d'origine */

html[class*="-dark"] font[color="#f4ac00"],
html[class*="-dark"] font[color="f4ac00"] {
  color: #ffbe33 !important; /* yellow - Légèrement éclairci, garde la teinte or */
}

html[class*="-dark"] font[color="#f77400"],
html[class*="-dark"] font[color="f77400"] {
  color: #ff8833 !important; /* orange - Éclairci mais garde l'orange vif */
}

html[class*="-dark"] font[color="#ed6161"],
html[class*="-dark"] font[color="ed6161"] {
  color: #ff7a7a !important; /* fuchsia - Légèrement éclairci, garde le rose-rouge */
}

html[class*="-dark"] font[color="#d50000"],
html[class*="-dark"] font[color="d50000"] {
  color: #ff3333 !important; /* red - Rouge vif éclairci */
}

html[class*="-dark"] font[color="olive"] {
  color: #b3b333 !important; /* olive - Éclairci mais garde le jaune-vert olive */
}

html[class*="-dark"] font[color="#219c5a"],
html[class*="-dark"] font[color="219c5a"] {
  color: #33cc77 !important; /* lightgreen - Éclairci, garde le vert vif */
}

html[class*="-dark"] font[color="#006f00"],
html[class*="-dark"] font[color="006f00"] {
  color: #00bb00 !important; /* green - Vert pur éclairci */
}

html[class*="-dark"] font[color="teal"] {
  color: #33cccc !important; /* teal - Teal éclairci */
}

html[class*="-dark"] font[color="#5577bc"],
html[class*="-dark"] font[color="5577bc"] {
  color: #7799dd !important; /* lightblue - Légèrement éclairci, garde le bleu */
}

html[class*="-dark"] font[color="#2b2be4"],
html[class*="-dark"] font[color="2b2be4"] {
  color: #5555ff !important; /* blue - Bleu vif éclairci */
}

html[class*="-dark"] font[color="navy"] {
  color: #5555cc !important; /* navy - Navy éclairci mais garde le bleu foncé */
}

html[class*="-dark"] font[color="purple"] {
  color: #cc55cc !important; /* purple - Violet éclairci */
}

html[class*="-dark"] font[color="#4B0082"],
html[class*="-dark"] font[color="4B0082"],
html[class*="-dark"] font[color="4b0082"] {
  color: #8855cc !important; /* indigo - Indigo éclairci, garde le violet-bleu */
}

html[class*="-dark"] font[color="maroon"] {
  color: #cc5555 !important; /* maroon - Bordeaux éclairci */
}

html[class*="-dark"] font[color="#5e432d"],
html[class*="-dark"] font[color="5e432d"] {
  color: #aa7755 !important; /* brown - Marron éclairci, garde la teinte chaude */
}

html[class*="-dark"] font[color="gray"] {
  color: #aaaaaa !important; /* gray - Gris éclairci */
}

html[class*="-dark"] font[color="#5a5a5a"],
html[class*="-dark"] font[color="5a5a5a"] {
  color: #999999 !important; /* darkgray - Éclairci mais garde le gris moyen */
}

html[class*="-dark"] font[color="#000000"],
html[class*="-dark"] font[color="000000"] {
  color: #cccccc !important; /* black - Gris clair (noir impossible en dark) */
}

/* === COULEURS PALETTE DE SÉLECTION (boutons background-color) === */
/* Surcharge des background-color des boutons de la palette de couleurs */

html[class*="-dark"] [style*="background-color:#f4ac00"],
html[class*="-dark"] [style*="background-color: #f4ac00"] {
  background-color: #ffbe33 !important; /* yellow */
}

html[class*="-dark"] [style*="background-color:#f77400"],
html[class*="-dark"] [style*="background-color: #f77400"] {
  background-color: #ff8833 !important; /* orange */
}

html[class*="-dark"] [style*="background-color:#ed6161"],
html[class*="-dark"] [style*="background-color: #ed6161"] {
  background-color: #ff7a7a !important; /* fuchsia */
}

html[class*="-dark"] [style*="background-color:#d50000"],
html[class*="-dark"] [style*="background-color: #d50000"] {
  background-color: #ff3333 !important; /* red */
}

html[class*="-dark"] [style*="background-color:#808000"],
html[class*="-dark"] [style*="background-color: #808000"] {
  background-color: #b3b333 !important; /* olive */
}

html[class*="-dark"] [style*="background-color:#219c5a"],
html[class*="-dark"] [style*="background-color: #219c5a"] {
  background-color: #33cc77 !important; /* lightgreen */
}

html[class*="-dark"] [style*="background-color:#006f00"],
html[class*="-dark"] [style*="background-color: #006f00"] {
  background-color: #00bb00 !important; /* green */
}

html[class*="-dark"] [style*="background-color:#008080"],
html[class*="-dark"] [style*="background-color: #008080"] {
  background-color: #33cccc !important; /* teal */
}

html[class*="-dark"] [style*="background-color:#5577bc"],
html[class*="-dark"] [style*="background-color: #5577bc"] {
  background-color: #7799dd !important; /* lightblue */
}

html[class*="-dark"] [style*="background-color:#2b2be4"],
html[class*="-dark"] [style*="background-color: #2b2be4"] {
  background-color: #5555ff !important; /* blue */
}

html[class*="-dark"] [style*="background-color:#000080"],
html[class*="-dark"] [style*="background-color: #000080"] {
  background-color: #5555cc !important; /* navy */
}

html[class*="-dark"] [style*="background-color:#800080"],
html[class*="-dark"] [style*="background-color: #800080"] {
  background-color: #cc55cc !important; /* purple */
}

html[class*="-dark"] [style*="background-color:#4B0082"],
html[class*="-dark"] [style*="background-color: #4B0082"],
html[class*="-dark"] [style*="background-color:#4b0082"],
html[class*="-dark"] [style*="background-color: #4b0082"] {
  background-color: #8855cc !important; /* indigo */
}

html[class*="-dark"] [style*="background-color:#800000"],
html[class*="-dark"] [style*="background-color: #800000"] {
  background-color: #cc5555 !important; /* maroon */
}

html[class*="-dark"] [style*="background-color:#5e432d"],
html[class*="-dark"] [style*="background-color: #5e432d"] {
  background-color: #aa7755 !important; /* brown */
}

html[class*="-dark"] [style*="background-color:#808080"],
html[class*="-dark"] [style*="background-color: #808080"] {
  background-color: #aaaaaa !important; /* gray */
}

html[class*="-dark"] [style*="background-color:#5a5a5a"],
html[class*="-dark"] [style*="background-color: #5a5a5a"] {
  background-color: #999999 !important; /* darkgray */
}

html[class*="-dark"] [style*="background-color:#000000"],
html[class*="-dark"] [style*="background-color: #000000"] {
  background-color: #cccccc !important; /* black */
}

/* === SCROLLBARS === */
html[class*="-dark"] ::-webkit-scrollbar-track {
  background-color: var(--kr-bg-page);
}

html[class*="-dark"] ::-webkit-scrollbar-thumb {
  background-color: var(--kr-text-muted);
}

html[class*="-dark"] ::-webkit-scrollbar-thumb:hover {
  background-color: var(--kr-text-secondary);
}

/* === SELECTION === */
html[class*="-dark"] ::selection {
  background-color: var(--kr-primary);
  color: var(--kr-text-inverse);
}

/* === FOOTER === */
html[class*="-dark"] footer {
  background-color: var(--kr-bg-elevated);
  border-top: 1px solid var(--kr-border-default);
}

html[class*="-dark"] .footer-quote {
  color: var(--kr-text-secondary);
}

/* === SKILLS PANEL === */
html[class*="-dark"] #skills-panel {
  background-color: var(--kr-bg-surface) !important;
  border-color: var(--kr-border-default) !important;
}

/* === SEPARATORS === */
html[class*="-dark"] hr {
  display: none;
}

/* === CAROUSEL === */
html[class*="-dark"] .carousel-control {
  color: var(--kr-primary);
  opacity: 0.7;
}

html[class*="-dark"] .carousel-control:hover,
html[class*="-dark"] .carousel-control:focus {
  color: var(--kr-highlight);
  opacity: 0.9;
}

html[class*="-dark"] .carousel-indicators li {
  background-color: var(--kr-border-default);
  border-color: var(--kr-border-default);
}

html[class*="-dark"] .carousel-indicators .active {
  background-color: var(--kr-primary);
  border-color: var(--kr-primary);
}

/* === LIENS === */
html[class*="-dark"] a:link,
html[class*="-dark"] a:visited {
  color: var(--kr-highlight);
}

html[class*="-dark"] a:hover,
html[class*="-dark"] a:focus {
  color: var(--kr-primary);
}

/* === BOUTONS DE NAVIGATION PREV/NEXT === */
html[class*="-dark"] a.prev,
html[class*="-dark"] a.next {
  background-color: var(--kr-bg-elevated) !important;
  border-color: var(--kr-border-default) !important;
  color: var(--kr-text-primary) !important;
}

html[class*="-dark"] a.prev:hover,
html[class*="-dark"] a.next:hover {
  background-color: var(--kr-bg-hover) !important;
  border-color: var(--kr-border-strong) !important;
  color: var(--kr-highlight) !important;
}

/* === BOUTONS WARNING === */

/* Adaptation des boutons warning pour le thème sombre */
html[class*="-dark"] .btn-warning {
  background-color: var(--kr-primary) !important;
  border-color: var(--kr-primary-dark) !important;
  color: var(--kr-text-inverse) !important;
}

html[class*="-dark"] .btn-warning:hover {
  background-color: var(--kr-highlight) !important;
  border-color: var(--kr-primary) !important;
}

/* === ICÔNES DE COMPÉTENCES ET CARACTÉRISTIQUES === */

/* Réduction du contraste des icônes blanches */
html[class*="-dark"] img[src*="/mat/94/"] {
  filter: none;
  opacity: 0.85;
}

html[class*="-dark"] img[src*="/mat/94/"]:hover {
  filter: none;
  opacity: 1;
}

/* === ICÔNES DE BÂTIMENTS === */

/* Réduction du contraste des icônes blanches */
html[class*="-dark"] img[src*="/bat/bat"] {
  filter: none;
  opacity: 0.85;
}

html[class*="-dark"] img[src*="/bat/bat"]:hover {
  filter: none;
  opacity: 1;
}

/* === ICÔNES DE VOCATIONS === */

/* Réduction du contraste des icônes blanches */
html[class*="-dark"] img[src*="/voc/"] {
  filter: none;
  opacity: 0.85;
}

html[class*="-dark"] img[src*="/voc/"]:hover {
  filter: none;
  opacity: 1;
}

/* ============================================================================
   HORLOGE À DOUBLE TOUR (0-48H)
   ============================================================================ */

/* Système d'horloge circulaire qui supporte jusqu'à 48 heures avec deux tours de cadran.
   Le premier tour (0-24h) s'affiche sur le cercle principal.
   Le deuxième tour (24-48h) s'affiche sur un cercle extérieur plus visible.
*/

/* Container de l'horloge */
.c100 {
  position: relative !important;
  width: 80px !important;
  height: 80px !important;
  border-radius: 50% !important;
  background-color: var(--kr-bg-elevated, #f5f5f5) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: visible !important;
}

/* Masquer l'ancien système à base de .slice, .bar, .fill */
.c100 .slice,
.c100 .bar,
.c100 .fill {
  display: none !important;
}

/* Texte de l'heure au centre */
.c100 > span {
  position: relative !important;
  z-index: 10 !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  color: var(--kr-text-primary, #333) !important;
  text-align: center !important;
}

/* Fond circulaire après */
.c100::after {
  content: '' !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 68px !important;
  height: 68px !important;
  border-radius: 50% !important;
  background-color: var(--kr-bg-elevated, #f5f5f5) !important;
  z-index: 5 !important;
}

/* Cercle de progression - Premier tour (0-24h) */
.c100::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  border-radius: 50% !important;
  background: conic-gradient(
    var(--clock-color, #8B0000) 0deg,
    var(--clock-color, #8B0000) calc(var(--clock-deg, 0) * 1deg),
    transparent calc(var(--clock-deg, 0) * 1deg),
    transparent 360deg
  ) !important;
  z-index: 1 !important;
  transition: none !important;
}

/* Deuxième tour (24-48h) - Cercle extérieur avec bordure reprenant la couleur de l'horloge */
.c100[data-second-lap="true"]::before {
  box-shadow: 
    0 0 0 1px var(--kr-bg-elevated, #f5f5f5),
    0 0 0 5px var(--clock-color, #32CD32),
    inset 0 0 0 2px var(--clock-color, #32CD32) !important;
}

/* Classes de pourcentage p0 à p100 pour la compatibilité */
.c100.p0 { --clock-deg: 0; }
.c100.p1 { --clock-deg: 3.6; }
.c100.p2 { --clock-deg: 7.2; }
.c100.p3 { --clock-deg: 10.8; }
.c100.p4 { --clock-deg: 14.4; }
.c100.p5 { --clock-deg: 18; }
.c100.p6 { --clock-deg: 21.6; }
.c100.p7 { --clock-deg: 25.2; }
.c100.p8 { --clock-deg: 28.8; }
.c100.p9 { --clock-deg: 32.4; }
.c100.p10 { --clock-deg: 36; }
.c100.p11 { --clock-deg: 39.6; }
.c100.p12 { --clock-deg: 43.2; }
.c100.p13 { --clock-deg: 46.8; }
.c100.p14 { --clock-deg: 50.4; }
.c100.p15 { --clock-deg: 54; }
.c100.p16 { --clock-deg: 57.6; }
.c100.p17 { --clock-deg: 61.2; }
.c100.p18 { --clock-deg: 64.8; }
.c100.p19 { --clock-deg: 68.4; }
.c100.p20 { --clock-deg: 72; }
.c100.p21 { --clock-deg: 75.6; }
.c100.p22 { --clock-deg: 79.2; }
.c100.p23 { --clock-deg: 82.8; }
.c100.p24 { --clock-deg: 86.4; }
.c100.p25 { --clock-deg: 90; }
.c100.p26 { --clock-deg: 93.6; }
.c100.p27 { --clock-deg: 97.2; }
.c100.p28 { --clock-deg: 100.8; }
.c100.p29 { --clock-deg: 104.4; }
.c100.p30 { --clock-deg: 108; }
.c100.p31 { --clock-deg: 111.6; }
.c100.p32 { --clock-deg: 115.2; }
.c100.p33 { --clock-deg: 118.8; }
.c100.p34 { --clock-deg: 122.4; }
.c100.p35 { --clock-deg: 126; }
.c100.p36 { --clock-deg: 129.6; }
.c100.p37 { --clock-deg: 133.2; }
.c100.p38 { --clock-deg: 136.8; }
.c100.p39 { --clock-deg: 140.4; }
.c100.p40 { --clock-deg: 144; }
.c100.p41 { --clock-deg: 147.6; }
.c100.p42 { --clock-deg: 151.2; }
.c100.p43 { --clock-deg: 154.8; }
.c100.p44 { --clock-deg: 158.4; }
.c100.p45 { --clock-deg: 162; }
.c100.p46 { --clock-deg: 165.6; }
.c100.p47 { --clock-deg: 169.2; }
.c100.p48 { --clock-deg: 172.8; }
.c100.p49 { --clock-deg: 176.4; }
.c100.p50 { --clock-deg: 180; }
.c100.p51 { --clock-deg: 183.6; }
.c100.p52 { --clock-deg: 187.2; }
.c100.p53 { --clock-deg: 190.8; }
.c100.p54 { --clock-deg: 194.4; }
.c100.p55 { --clock-deg: 198; }
.c100.p56 { --clock-deg: 201.6; }
.c100.p57 { --clock-deg: 205.2; }
.c100.p58 { --clock-deg: 208.8; }
.c100.p59 { --clock-deg: 212.4; }
.c100.p60 { --clock-deg: 216; }
.c100.p61 { --clock-deg: 219.6; }
.c100.p62 { --clock-deg: 223.2; }
.c100.p63 { --clock-deg: 226.8; }
.c100.p64 { --clock-deg: 230.4; }
.c100.p65 { --clock-deg: 234; }
.c100.p66 { --clock-deg: 237.6; }
.c100.p67 { --clock-deg: 241.2; }
.c100.p68 { --clock-deg: 244.8; }
.c100.p69 { --clock-deg: 248.4; }
.c100.p70 { --clock-deg: 252; }
.c100.p71 { --clock-deg: 255.6; }
.c100.p72 { --clock-deg: 259.2; }
.c100.p73 { --clock-deg: 262.8; }
.c100.p74 { --clock-deg: 266.4; }
.c100.p75 { --clock-deg: 270; }
.c100.p76 { --clock-deg: 273.6; }
.c100.p77 { --clock-deg: 277.2; }
.c100.p78 { --clock-deg: 280.8; }
.c100.p79 { --clock-deg: 284.4; }
.c100.p80 { --clock-deg: 288; }
.c100.p81 { --clock-deg: 291.6; }
.c100.p82 { --clock-deg: 295.2; }
.c100.p83 { --clock-deg: 298.8; }
.c100.p84 { --clock-deg: 302.4; }
.c100.p85 { --clock-deg: 306; }
.c100.p86 { --clock-deg: 309.6; }
.c100.p87 { --clock-deg: 313.2; }
.c100.p88 { --clock-deg: 316.8; }
.c100.p89 { --clock-deg: 320.4; }
.c100.p90 { --clock-deg: 324; }
.c100.p91 { --clock-deg: 327.6; }
.c100.p92 { --clock-deg: 331.2; }
.c100.p93 { --clock-deg: 334.8; }
.c100.p94 { --clock-deg: 338.4; }
.c100.p95 { --clock-deg: 342; }
.c100.p96 { --clock-deg: 345.6; }
.c100.p97 { --clock-deg: 349.2; }
.c100.p98 { --clock-deg: 352.8; }
.c100.p99 { --clock-deg: 356.4; }
.c100.p100 { --clock-deg: 360; }

/* === INDICATEUR CIRCULAIRE DE TEMPS === */

/* Adaptation pour le thème sombre */
html[class*="-dark"] .c100 {
  background-color: var(--kr-bg-elevated) !important;
  border-color: var(--kr-border-default) !important;
  color: var(--kr-text-primary) !important;
}

html[class*="-dark"] .c100::after {
  background-color: var(--kr-bg-elevated) !important;
}

html[class*="-dark"] .c100 > span {
  color: var(--kr-text-primary) !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  line-height: 80px !important;
  width: 80px !important;
  height: 80px !important;
}

html[class*="-dark"] .c100 .slice {
  border-color: var(--kr-bg-elevated) !important;
}

html[class*="-dark"] .c100 .bar {
  border-color: var(--kr-primary) !important;
}

html[class*="-dark"] .c100 .fill {
  border-color: var(--kr-bg-elevated) !important;
}

/* Pagination */
html[class*="-dark"] .pagination {
  background-color: transparent !important;
}

html[class*="-dark"] .pagination > li > a,
html[class*="-dark"] .pagination > li > span {
  background-color: var(--kr-bg-elevated) !important;
  border-color: var(--kr-border-default) !important;
  color: var(--kr-text-primary) !important;
}

html[class*="-dark"] .pagination > li.disabled > a,
html[class*="-dark"] .pagination > li.disabled > span {
  background-color: var(--kr-bg-surface) !important;
  border-color: var(--kr-border-default) !important;
  color: var(--kr-text-muted) !important;
  opacity: 0.6 !important;
}

html[class*="-dark"] .pagination > li > a:hover,
html[class*="-dark"] .pagination > li > span:hover {
  background-color: var(--kr-bg-hover) !important;
  border-color: var(--kr-border-strong) !important;
  color: var(--kr-primary) !important;
}

html[class*="-dark"] .pagination > .active > a,
html[class*="-dark"] .pagination > .active > span {
  background-color: var(--kr-primary) !important;
  border-color: var(--kr-primary) !important;
  color: var(--kr-text-inverse) !important;
}

html[class*="-dark"] .pagination > .active > a:hover,
html[class*="-dark"] .pagination > .active > span:hover {
  background-color: var(--kr-primary) !important;
  border-color: var(--kr-primary) !important;
  color: var(--kr-text-inverse) !important;
}

/* DataTables Pagination */
html[class*="-dark"] .dataTables_paginate {
  background-color: transparent !important;
}

html[class*="-dark"] .dataTables_paginate .paginate_button {
  background-color: var(--kr-bg-elevated) !important;
  border: 1px solid var(--kr-border-default) !important;
  color: var(--kr-text-primary) !important;
  background-image: none !important;
  box-shadow: none !important;
}

html[class*="-dark"] .dataTables_paginate .paginate_button.current {
  background-color: var(--kr-primary) !important;
  border-color: var(--kr-primary) !important;
  color: var(--kr-text-inverse) !important;
}

html[class*="-dark"] .dataTables_paginate .paginate_button.disabled,
html[class*="-dark"] .dataTables_paginate .paginate_button.disabled:hover {
  background-color: var(--kr-bg-surface) !important;
  border-color: var(--kr-border-default) !important;
  color: var(--kr-text-muted) !important;
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

html[class*="-dark"] .dataTables_paginate .paginate_button:not(.disabled):hover {
  background-color: var(--kr-bg-hover) !important;
  border-color: var(--kr-border-strong) !important;
  color: var(--kr-primary) !important;
}

html[class*="-dark"] .dataTables_paginate .paginate_button.current:hover {
  background-color: var(--kr-primary) !important;
  border-color: var(--kr-primary) !important;
  color: var(--kr-text-inverse) !important;
}

/* DataTables - Wrapper et conteneur */
html[class*="-dark"] .dataTables_wrapper {
  color: var(--kr-text-primary);
}

/* DataTables - Info, Filter, Length */
html[class*="-dark"] .dataTables_info,
html[class*="-dark"] .dataTables_filter,
html[class*="-dark"] .dataTables_length {
  color: var(--kr-text-secondary) !important;
}

html[class*="-dark"] .dataTables_filter label,
html[class*="-dark"] .dataTables_length label {
  color: var(--kr-text-secondary);
}

/* DataTables - Inputs et Selects */
html[class*="-dark"] .dataTables_filter input,
html[class*="-dark"] .dataTables_length select {
  background-color: var(--kr-bg-elevated) !important;
  border-color: var(--kr-border-default) !important;
  color: var(--kr-text-primary) !important;
}

html[class*="-dark"] .dataTables_filter input:focus,
html[class*="-dark"] .dataTables_length select:focus {
  background-color: var(--kr-bg-elevated) !important;
  border-color: var(--kr-primary) !important;
  outline: none !important;
}

/* DataTables - Table principale */
html[class*="-dark"] table.dataTable {
  background-color: transparent !important;
  color: var(--kr-text-primary) !important;
}

/* DataTables - En-têtes */
html[class*="-dark"] table.dataTable thead th,
html[class*="-dark"] table.dataTable thead td {
  background-color: var(--kr-bg-elevated) !important;
  border-color: var(--kr-border-default) !important;
  color: var(--kr-text-primary) !important;
}

html[class*="-dark"] table.dataTable thead th.sorting,
html[class*="-dark"] table.dataTable thead th.sorting_asc,
html[class*="-dark"] table.dataTable thead th.sorting_desc {
  background-color: var(--kr-bg-elevated) !important;
}

html[class*="-dark"] table.dataTable thead th.sorting:hover,
html[class*="-dark"] table.dataTable thead th.sorting_asc:hover,
html[class*="-dark"] table.dataTable thead th.sorting_desc:hover {
  background-color: var(--kr-bg-hover) !important;
}

/* DataTables - Corps de table (lignes) */
html[class*="-dark"] table.dataTable tbody tr {
  background-color: var(--kr-bg-surface) !important;
}

html[class*="-dark"] table.dataTable tbody tr.odd {
  background-color: var(--kr-bg-surface) !important;
}

html[class*="-dark"] table.dataTable tbody tr.even {
  background-color: var(--kr-bg-hover) !important;
}

html[class*="-dark"] table.dataTable tbody tr:hover {
  background-color: var(--kr-bg-active) !important;
}

/* DataTables - Cellules */
html[class*="-dark"] table.dataTable tbody td {
  border-color: var(--kr-border-default) !important;
  color: var(--kr-text-primary) !important;
}

/* DataTables - Message "Aucune donnée" */
html[class*="-dark"] table.dataTable tbody td.dataTables_empty {
  background-color: var(--kr-bg-surface) !important;
  color: var(--kr-text-secondary) !important;
}

/* DataTables - Footer */
html[class*="-dark"] table.dataTable tfoot th,
html[class*="-dark"] table.dataTable tfoot td {
  background-color: var(--kr-bg-elevated) !important;
  border-color: var(--kr-border-default) !important;
  color: var(--kr-text-primary) !important;
}




/* ============================================================================
   MAP PAGE FIX - Carte au dessus des tableaux
   ============================================================================ */

/* Donner une hauteur au conteneur de la carte pour que le contenu en dessous 
   ne se superpose pas. La carte utilise des éléments en position absolue. */
body > div:has([id^="c"]) {
  display: block;
  position: relative;
  min-height: 550px; /* Hauteur de la carte + marge */
}

/* La balise MAP vide ne doit pas prendre de place */
body > map {
  display: none;
}


/* ============================================================================
   MOBILE RESPONSIVE - Compatibilité mobile (<768px)
   Ces styles ne s'appliquent QUE sur mobile et ne modifient PAS le desktop
   ============================================================================ */

@media (width <= 767px) {
  /* ==========================================================================
     FIX : Empêcher le scroll automatique vers les ancres au chargement
     ========================================================================== */
  
  html {
    overflow-anchor: none !important; /* Désactive l'ancrage automatique du scroll */
  }
  
  /* ==========================================================================
     PHASE 1 : CONTAINER RESPONSIVE
     Supprime le débordement horizontal causé par la largeur fixe
     ========================================================================== */
  
  .container {
    max-width: 100% !important;
    width: 100% !important;
    padding-left: 15px !important;
    padding-right: 15px !important;
  }
  
  
  /* ==========================================================================
     PHASE 2 : NAVBAR MOBILE AMÉLIORÉE
     Améliore l'ergonomie du menu hamburger et des icônes
     ========================================================================== */
  
  /* Fix du layout du header pour que logo et hamburger soient bien alignés */
  .navbar-header {
    display: flex !important;
    justify-content: center !important; /* Logo au centre */
    align-items: center !important;
    width: 100vw !important; /* Prend toute la largeur du viewport */
    position: relative !important; /* Pour positionner le toggle en absolu */
    margin-left: calc(-50vw + 50%) !important; /* Centre par rapport au viewport */
    margin-right: calc(-50vw + 50%) !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    height: 60px !important; /* Hauteur fixe pour centrage vertical */
  }
  
  .navbar-brand {
    float: none !important;
    margin: 0 !important; /* Centré par flexbox */
    display: flex !important;
    align-items: center !important;
    padding: 15px !important; /* Ajout d'un padding pour ne pas coller aux bords */
  }
  
  /* Boutons plus grands pour touch (minimum 44x44px recommandé) */
  .navbar-toggle {
    position: absolute !important; /* Position absolue pour le placer en haut à droite */
    right: 15px !important; /* Aligné à droite avec espacement */
    top: 50% !important;
    transform: translateY(-50%) !important; /* Centrage vertical parfait */
    padding: 8px !important;
    min-width: 48px !important;
    min-height: 48px !important;
    width: 48px !important;
    height: 48px !important;
    float: none !important;
    margin: 0 !important;
    border-radius: 12px !important; /* Coins plus arrondis, style moderne */
    border: none !important; /* Pas de bordure pour un style épuré */
    background: rgba(255, 255, 255, 0.15) !important;
    backdrop-filter: blur(10px) !important; /* Effet de flou moderne */
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 4px !important; /* Espacement réduit entre les barres */
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; /* Animation fluide */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important; /* Ombre légère */
  }
  
  .navbar-toggle:hover,
  .navbar-toggle:focus {
    background: rgba(255, 255, 255, 0.25) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
    transform: translateY(-50%) scale(1.05) !important; /* Léger effet de zoom */
  }
  
  .navbar-toggle:active {
    transform: translateY(-50%) scale(0.98) !important; /* Effet d'appui */
  }
  
  /* Barres du hamburger plus stylées et modernes */
  .navbar-toggle .icon-bar {
    width: 22px !important;
    height: 2px !important; /* Plus fines pour un look moderne */
    border-radius: 2px !important;
    background-color: #fff !important;
    display: block !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  /* Animation subtile au hover - Les barres s'écartent légèrement */
  .navbar-toggle:hover .icon-bar:nth-child(2) {
    width: 18px !important;
    margin-left: 4px !important;
  }
  
  .navbar-toggle:hover .icon-bar:nth-child(4) {
    width: 18px !important;
  }
  
  /* Menu déroulant pleine largeur - Respecte le comportement Bootstrap */
  .navbar-collapse {
    width: 100% !important;
    border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  }
  
  /* Quand le menu est ouvert (classe .in ajoutée par Bootstrap) */
  .navbar-collapse.in {
    overflow-y: auto !important;
    max-height: calc(100vh - 60px) !important;
  }
  
  /* Items de navigation plus espacés */
  .navbar-nav > li > a {
    padding: 15px 20px !important;
    font-size: 16px !important;
  }
  
  /* Icônes de la barre (notifications, messages) */
  .navbar-nav.navbar-right > li > a {
    padding: 15px 12px !important;
  }
  
  /* Logo plus petit sur mobile */
  .navbar-brand img.kr-logo {
    height: 24px !important;
  }
  
  
  /* ==========================================================================
     PHASE 3 : PAGE D'ACCUEIL MOBILE
     Réorganise les blocs pour une lecture verticale fluide
     ========================================================================== */
  
  /* Empiler les colonnes verticalement (sauf dans les modales) */
  body.mobile-mode > .container > .row > [class*="col-md-"],
  body.mobile-mode > .container > .row > [class*="col-sm-"],
  body.mobile-mode .container:not(.bootbox) > .row > [class*="col-md-"],
  body.mobile-mode .container:not(.bootbox) > .row > [class*="col-sm-"] {
    width: 100% !important;
    float: none !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
    margin-bottom: 15px !important;
  }
  
  /* Carousel responsive */
  .carousel {
    margin-bottom: 20px !important;
  }
  
  .carousel .carousel-caption {
    position: relative !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background: rgba(0, 0, 0, 0.7) !important;
    padding: 15px !important;
  }
  
  .carousel .carousel-caption h1 {
    font-size: 1.5rem !important;
    line-height: 1.3 !important;
  }
  
  .carousel .carousel-caption p {
    font-size: 0.95rem !important;
  }
  
  /* Images du carousel */
  .carousel-inner > .item > img {
    width: 100% !important;
    height: auto !important;
  }
  
  /* Masquer les statistiques (Membres actifs, Personnages actifs, etc.) en mobile */
  a.list-group-item.ds_users,
  a.list-group-item.ds_characters,
  a.list-group-item.ds_online {
    display: none !important;
  }
  
  /* N'afficher qu'une seule nouvelle en mode mobile */
  .panel-body.panel-news ul.demo li.news-item:nth-child(n+2) {
    display: none !important;
  }
  
  /* Réduire la taille des flèches de navigation dans la section nouvelles */
  .panel-default ul.pagination.pull-right > li > a {
    font-size: 12px !important;
    padding: 6px 10px !important;
    min-width: 32px !important;
    min-height: 32px !important;
    line-height: 1.2 !important;
  }
  
  /* Header "Nouvelles" avec croix à droite */
  .list-group-item.active {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 10px 15px !important;
  }
  
  #slide-submenu {
    flex-shrink: 0 !important;
    margin-left: 10px !important;
    cursor: pointer !important;
    font-size: 18px !important;
    line-height: 1 !important;
    padding: 4px 8px !important;
    background: transparent !important;
    border: none !important;
    color: inherit !important;
    transition: opacity 0.2s ease !important;
  }
  
  #slide-submenu:hover {
    opacity: 0.7 !important;
  }
  
  /* Masquer le contenu quand replié */
  #player-header-section.kr-news-collapsed .panel.panel-default {
    display: none !important;
  }
  
  /* Stats cards en grille 3 colonnes */
  .dashboard-cards-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 8px !important;
  }
  
  /* Cartes de dashboard plus compactes */
  .dashboard-card {
    padding: 10px !important;
  }
  
  .dashboard-card h4 {
    font-size: 1.1rem !important;
  }
  
  /* Panels responsive */
  .panel {
    margin-bottom: 15px !important;
  }
  
  .panel-heading {
    padding: 10px 15px !important;
    display: flex !important;
    align-items: center !important;
    flex-wrap: wrap !important;
    gap: 10px !important;
  }
  
  .panel-heading .pull-right {
    float: none !important;
    margin-left: auto !important;
    display: flex !important;
    align-items: center !important;
  }
  
  .panel-body {
    padding: 15px !important;
  }
  
  /* Réduire l'espace entre pagination et messages sur les pages de forum */
  .pagination {
    margin: 10px 0 !important;
  }
  
  /* Uniformiser la taille des boutons de pagination */
  .pagination > li > a,
  .pagination > li > span {
    width: 44px !important;
    height: 44px !important;
    min-width: 44px !important;
    min-height: 44px !important;
    max-width: 44px !important;
    max-height: 44px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 !important;
    line-height: 1 !important;
    box-sizing: border-box !important;
  }
  
  /* Réduire l'espace sous le h1 sur les pages de thread */
  h1.page-header {
    margin-bottom: 10px !important;
  }
  
  /* Ancres de messages ne doivent pas prendre d'espace */
  a[name^="msg"] {
    position: absolute !important;
    width: 0 !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }
  
  /* Wells plus compacts */
  .well {
    padding: 15px !important;
    margin-bottom: 15px !important;
  }
  
  /* Alerts responsive */
  .alert {
    padding: 12px 15px !important;
    margin-bottom: 15px !important;
  }
  
  /* Mini-chat : masqué par défaut sur mobile, accessible via bouton flottant */
  #flap {
    position: fixed !important;
    top: 0 !important;
    right: -100% !important;
    width: 85% !important;
    max-width: 320px !important;
    height: 100vh !important;
    z-index: 1050 !important;
    transition: right 0.3s ease !important;
    overflow-y: auto !important;
    background: var(--kr-bg-surface) !important;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3) !important;
  }
  
  #flap.mobile-open {
    right: 0 !important;
  }
  
  /* Bouton MC visible pour ouvrir le chat */
  a[href*="#flap"] {
    display: flex !important;
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    z-index: 1000 !important;
    background: var(--kr-primary) !important;
    color: white !important;
    border-radius: 50% !important;
    width: 56px !important;
    height: 56px !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    box-shadow: var(--kr-shadow-lg) !important;
    font-size: 18px !important;
    font-weight: bold !important;
    text-decoration: none !important;
  }
  
  
  /* ==========================================================================
     PHASE 4 : PAGE PLATEAU DE JEU MOBILE
     Réorganise l'interface de jeu pour le mobile
     ========================================================================== */
  
  /* === PANNEAU DE COMPÉTENCES === */

  /* Masquer le panneau latéral, accessible via bouton */
  #skills-panel {
    position: fixed !important;
    top: 0 !important;
    left: -100% !important;
    width: 85% !important;
    max-width: 320px !important;
    height: 100vh !important;
    z-index: 1050 !important;
    transition: left 0.3s ease !important;
    overflow-y: auto !important;
    background: var(--kr-bg-surface) !important;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3) !important;
    padding: 15px !important;
  }
  
  #skills-panel.mobile-open {
    left: 0 !important;
  }
  
  /* Conteneur parent du skills-panel */
  .col-md-1:has(#skills-panel) {
    position: static !important;
    width: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  /* Grille des compétences plus compacte sur mobile */
  #skills-panel .grid-transformed {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 8px !important;
  }
  
  /* === PANNEAU PERSONNAGE === */

  /* Toutes les colonnes en pleine largeur (page principale uniquement, pas les modales) */
  body.mobile-mode > .container > .row > .col-md-3,
  body.mobile-mode > .container > .row > .col-md-6,
  body.mobile-mode > .container > .row > .col-md-8,
  body.mobile-mode > .container > .row > .col-md-1 {
    width: 100% !important;
    float: none !important;
    padding-left: 15px !important;
    padding-right: 15px !important;
  }
  
  /* Avatar réduit */
  .panel-heading img {
    max-width: 60px !important;
    max-height: 60px !important;
  }
  
  /* Stats du personnage */
  .panel-body > div {
    margin-bottom: 10px !important;
  }
  
  /* Barres de progression */
  .progress {
    height: 24px !important;
    margin-bottom: 8px !important;
  }
  
  .progress-bar {
    font-size: 12px !important;
    line-height: 24px !important;
  }
  
  /* === CARTE DU JEU === */

  /* Carte avec scroll horizontal si nécessaire */
  .panel-body:has(map),
  .panel-body:has([id^="c"]) {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    padding: 10px !important;
  }
  
  /* Conteneur de carte */
  body > div:has([id^="c"]) {
    min-height: 400px !important;
  }
  
  /* Images de la carte */
  map + img,
  [id^="c"] img {
    max-width: none !important;
    height: auto !important;
  }
  
  /* === LISTE DES PERSONNAGES === */

  /* En liste verticale compacte */
  .list-group {
    margin-bottom: 15px !important;
  }
  
  .list-group-item {
    padding: 10px 12px !important;
    min-height: 44px !important;
    justify-content: space-between !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
  }
  
  /* Avatars de la liste réduits */
  .list-group-item img {
    width: 40px !important;
    height: 40px !important;
    flex-shrink: 0 !important;
  }
  
  /* Texte des items */
  .list-group-item-heading {
    font-size: 14px !important;
    margin-bottom: 4px !important;
  }
  
  .list-group-item-text {
    font-size: 12px !important;
  }
  
  /* === PANNEAU COMMERCE === */

  /* Items du commerce en liste compacte */
  .panel-body h4 {
    font-size: 1rem !important;
    margin-top: 15px !important;
    margin-bottom: 10px !important;
  }
  
  /* Items de commerce */
  .panel-body a {
    display: flex !important;
    align-items: center !important;
    padding: 8px !important;
    gap: 10px !important;
    font-size: 14px !important;
    margin-bottom: 5px !important;
    border-radius: 4px !important;
  }
  
  .panel-body a:hover {
    background-color: var(--kr-bg-hover) !important;
  }
  
  .panel-body a img {
    width: 32px !important;
    height: 32px !important;
    flex-shrink: 0 !important;
  }
  
  /* Tables responsive */
  .table-responsive {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    margin-bottom: 15px !important;
  }
  
  /* Tables plus compactes */
  .table > thead > tr > th,
  .table > tbody > tr > th,
  .table > tfoot > tr > th,
  .table > thead > tr > td,
  .table > tbody > tr > td,
  .table > tfoot > tr > td {
    padding: 8px !important;
    font-size: 13px !important;
  }
  
  
  /* ==========================================================================
     PHASE 5 : ÉLÉMENTS TOUCH-FRIENDLY
     Assure que tous les éléments interactifs sont cliquables facilement
     ========================================================================== */
  
  /* Taille minimale des zones cliquables (44x44px minimum recommandé) */
  a:not(.list-group-item), 
  button, 
  .btn,
  input[type="button"],
  input[type="submit"],
  input[type="reset"] {
    min-height: 44px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  /* Boutons de formulaire */
  .btn {
    padding: 12px 20px !important;
    font-size: 16px !important;
  }
  
  .btn-xs {
    min-height: 32px !important;
    padding: 6px 12px !important;
    font-size: 14px !important;
  }
  
  .btn-sm {
    min-height: 38px !important;
    padding: 8px 16px !important;
    font-size: 14px !important;
  }
  
  .btn-lg {
    min-height: 50px !important;
    padding: 14px 24px !important;
    font-size: 18px !important;
  }
  
  /* Formulaires */
  .form-control {
    height: 44px !important;
    font-size: 16px !important; /* Évite le zoom iOS */
    padding: 10px 12px !important;
  }
  
  textarea.form-control {
    height: auto !important;
    min-height: 100px !important;
  }
  
  select.form-control {
    height: 44px !important;
  }
  
  /* Checkboxes et radios plus grands */
  input[type="checkbox"],
  input[type="radio"] {
    width: 20px !important;
    height: 20px !important;
    margin: 4px !important;
  }
  
  /* Labels cliquables */
  label {
    display: inline-block !important;
    padding: 5px 0 !important;
    cursor: pointer !important;
  }
  
  /* Espacement entre éléments cliquables */
  .btn + .btn {
    margin-top: 8px !important;
    margin-left: 0 !important;
  }
  
  .btn-group-vertical > .btn {
    margin-top: 0 !important;
    margin-bottom: 8px !important;
  }
  
  /* Boutons groupés en colonne sur mobile */
  .btn-group {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
  }
  
  .btn-group > .btn {
    width: 100% !important;
    margin-bottom: 8px !important;
  }
  
  /* Pagination plus grande */
  .pagination > li > a,
  .pagination > li > span {
    padding: 12px 16px !important;
    font-size: 16px !important;
  }
  
  /* Breadcrumb responsive */
  .breadcrumb {
    padding: 10px 15px !important;
    font-size: 14px !important;
  }
  
  /* Tabs plus grandes */
  .nav-tabs > li > a {
    padding: 12px 16px !important;
    font-size: 16px !important;
  }
  
  /* Dropdown menu */
  .dropdown-menu > li > a {
    padding: 12px 20px !important;
    font-size: 16px !important;
  }
  
  /* Modal responsive */
  .modal-dialog {
    width: auto !important;
    margin: 10px !important;
  }
  
  .modal-content {
    border-radius: 8px !important;
  }
  
  .modal-header {
    padding: 15px !important;
  }
  
  .modal-body {
    padding: 15px !important;
  }
  
  .modal-footer {
    padding: 15px !important;
  }
  
  /* Popover et tooltip responsive */
  .popover {
    max-width: calc(100vw - 40px) !important;
  }
  
  .tooltip {
    font-size: 14px !important;
  }
  
  /* Footer responsive */
  .footer {
    padding: 15px !important;
    font-size: 14px !important;
  }
  
  /* Typographie mobile */
  h1 { font-size: 1.75rem !important; }
  h2 { font-size: 1.5rem !important; }
  h3 { font-size: 1.25rem !important; }
  h4 { font-size: 1.1rem !important; }
  h5 { font-size: 1rem !important; }
  h6 { font-size: 0.9rem !important; }
  
  /* Espacement vertical */
  .row {
    margin-left: -10px !important;
    margin-right: -10px !important;
  }
  
  /* Masquer les éléments non essentiels sur mobile */
  .hidden-xs {
    display: none !important;
  }
  
  /* Afficher les éléments mobile uniquement */
  .visible-xs,
  .visible-xs-block,
  .visible-xs-inline,
  .visible-xs-inline-block {
    display: block !important;
  }
  
  .visible-xs-inline {
    display: inline !important;
  }
  
  .visible-xs-inline-block {
    display: inline-block !important;
  }
}


/* ==========================================================================
   OVERLAY MOBILE - Pour fermer les panneaux latéraux
   ========================================================================== */

.kr-mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.kr-mobile-overlay.active {
  display: block;
  opacity: 1;
}

/* Bouton de fermeture dans les panneaux mobiles */
.kr-mobile-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background: var(--kr-primary);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  font-size: 20px;
}

.kr-mobile-close:hover {
  background: var(--kr-primary-dark);
}

/* Bouton pour ouvrir le panneau de compétences sur mobile */
.kr-mobile-skills-toggle {
  position: fixed !important;
  bottom: 90px !important;
  right: 20px !important;
  z-index: 1000 !important;
  width: 56px !important;
  height: 56px !important;
  border-radius: 50% !important;
  padding: 0 !important;
  display: none !important;
  box-shadow: var(--kr-shadow-lg) !important;
}

@media (width <= 767px) {
  .kr-mobile-skills-toggle {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
}

/* ============================================
   TASK-1.1 - BREAKPOINTS (Bootstrap 3)
   ============================================ */

/* Bootstrap 3 utilise ces breakpoints précis :
   - xs: < 768px (mobile)
   - sm: >= 768px (tablet)
   - md: >= 992px (desktop)
   - lg: >= 1200px (large desktop)
*/

/* Mobile First approach */

/* Default styles = mobile (< 768px) */

/* Small devices (tablets, >= 768px) */
@media (width >= 768px) {
  /* Retour progressif au layout desktop */
  body.mobile-mode {
    /* Désactiver progressivement les adaptations mobiles */
  }
}

/* Medium devices (desktops, >= 992px) */
@media (width >= 992px) {
  /* Layout desktop complet */
  body.mobile-mode {
    /* Annuler complètement les adaptations mobiles */
  }
}

/* Large devices (large desktops, >= 1200px) */
@media (width >= 1200px) {
  /* Layout large desktop si nécessaire */
}

/* ============================================
   TASK-1.1 - CLASSES UTILITAIRES MOBILE
   ============================================ */

/* Masquer certains éléments en mode mobile */
@media (width <= 767px) {
  body.mobile-mode .desktop-only,
  body.mobile-mode .mobile-hidden {
    display: none;
  }
}

/* Masquer certains éléments en mode desktop */
@media (width >= 768px) {
  body.mobile-mode .mobile-only {
    display: none;
  }
}

/* Classes utilitaires supplémentaires compatibles BS3 */
@media (width < 768px) {
  .visible-xs-block { display: block; }
  .visible-xs-inline { display: inline; }
  .visible-xs-inline-block { display: inline-block; }
  .hidden-xs { display: none; }
}

/* ============================================
   TASK-1.4 - MINI-PROFIL COLLAPSIBLE
   ============================================ */

@media (width <= 767px) {
  body.mobile-mode {
    /* Container du mini-profil */
    .mobile-mini-profile {
      position: relative;
      background: var(--kr-bg-surface) !important;
      border-bottom: 1px solid var(--kr-border-default) !important;
      padding: 12px;
      cursor: pointer;
      transition: all var(--transition-normal);
    }
    
    .mobile-mini-profile:active {
      background: var(--kr-bg-hover) !important;
    }
    
    /* État replié (défaut) */
    .mobile-mini-profile.collapsed {
      min-height: 72px;
    }
    
    /* État déplié */
    .mobile-mini-profile.expanded {
      min-height: 200px;
    }
    
    /* Header toujours visible */
    .mobile-mini-profile-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    
    /* Avatar */
    .mobile-mini-profile .avatar {
      width: 48px !important;
      height: 48px !important;
      border-radius: 4px;
      flex-shrink: 0;
      transition: all var(--transition-normal);
      object-fit: cover;
    }
    
    .mobile-mini-profile.expanded .avatar {
      width: 64px !important;
      height: 64px !important;
    }
    
    /* Info principale */
    .mobile-mini-profile-info {
      flex: 1;
      min-width: 0;
    }
    
    .mobile-mini-profile-name-row {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 8px !important;
      margin-bottom: 2px !important;
    }
    
    .mobile-mini-profile-name {
      font-weight: 600 !important;
      font-size: 14px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      color: var(--kr-text-primary) !important;
      flex: 1 !important;
    }
    
    .mobile-mini-profile-manage-btn {
      min-width: 44px !important;
      min-height: 44px !important;
      padding: 8px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 20px !important;
      flex-shrink: 0 !important;
      border: none !important;
      background: var(--kr-bg-surface) !important;
    }
    
    .mobile-mini-profile-manage-btn:active {
      background: var(--kr-bg-hover) !important;
    }
    
    .mobile-mini-profile-money {
      display: flex !important;
      align-items: center !important;
      gap: 4px !important;
      font-size: 13px !important;
      color: var(--kr-text-secondary) !important;
    }
    
    .mobile-mini-profile-clock {
      font-size: 12px !important;
      color: var(--kr-text-muted) !important;
      margin-left: 8px !important;
    }
    
    /* Bouton settings */
    .mobile-mini-profile-settings {
      position: absolute !important;
      top: 12px !important;
      right: 12px !important;
      width: 32px !important;
      height: 32px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: var(--kr-bg-hover) !important;
      border-radius: 50% !important;
      cursor: pointer !important;
      font-size: 16px !important;
      z-index: 10 !important;
      text-decoration: none !important;
    }
    
    .mobile-mini-profile-settings:hover {
      background: var(--kr-bg-active) !important;
    }
    
    /* Jauges compactes (toujours visibles) */
    .mobile-mini-profile-gauges-compact {
      display: flex !important;
      gap: 8px !important;
      font-size: 11px !important;
      margin-top: 4px !important;
    }
    
    .mobile-gauge-compact {
      flex: 1 !important;
      display: flex !important;
      align-items: center !important;
      gap: 2px !important;
    }
    
    .mobile-gauge-compact-label {
      font-weight: 600 !important;
      min-width: 20px !important;
      font-size: 10px !important;
    }
    
    .mobile-gauge-compact-bar {
      flex: 1 !important;
      height: 6px !important;
      background: var(--kr-border-default) !important;
      border-radius: 3px !important;
      overflow: hidden !important;
      position: relative !important;
    }
    
    .mobile-gauge-compact-fill {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      height: 100% !important;
      transition: width var(--transition-normal) !important;
    }
    
    .mobile-gauge-compact-fill.pv {
      background: var(--kr-gauge-pv) !important;
    }
    
    .mobile-gauge-compact-fill.pm {
      background: var(--kr-gauge-pm) !important;
    }
    
    .mobile-gauge-compact-fill.pp {
      background: var(--kr-gauge-pp) !important;
    }
    
    .mobile-gauge-compact-value {
      font-size: 10px !important;
      color: var(--kr-text-secondary) !important;
      white-space: nowrap !important;
      min-width: 20px !important;
      text-align: right !important;
    }
    
    /* Détails (visibles uniquement si déplié) */
    .mobile-mini-profile-details {
      max-height: 0 !important;
      overflow: hidden !important;
      transition: max-height var(--transition-normal) !important;
    }
    
    .mobile-mini-profile.expanded .mobile-mini-profile-details {
      max-height: 1200px !important;
    }
    
    /* Jauges détaillées */
    .mobile-mini-profile-gauges-full {
      margin: 12px 0 !important;
      padding: 12px !important;
      background: var(--kr-bg-surface) !important;
      border: 1px solid var(--kr-border-default) !important;
      border-radius: 4px !important;
    }
    
    .mobile-gauge-full {
      margin-bottom: 8px !important;
    }
    
    .mobile-gauge-full:last-child {
      margin-bottom: 0 !important;
    }
    
    .mobile-gauge-full-header {
      display: flex !important;
      justify-content: space-between !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      margin-bottom: 4px !important;
    }
    
    .mobile-gauge-full-bar {
      height: 12px !important;
      background: var(--kr-border-default) !important;
      border-radius: 6px !important;
      overflow: hidden !important;
      position: relative !important;
    }
    
    .mobile-gauge-full-fill {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      height: 100% !important;
      transition: width var(--transition-normal) !important;
    }
    
    .mobile-gauge-full-fill.pv {
      background: var(--kr-gauge-pv) !important;
    }
    
    .mobile-gauge-full-fill.pm {
      background: var(--kr-gauge-pm) !important;
    }
    
    .mobile-gauge-full-fill.pp {
      background: var(--kr-gauge-pp) !important;
    }
    
    /* Caractéristiques */
    .mobile-mini-profile-characteristics {
      display: grid !important;
      grid-template-columns: repeat(6, 1fr) !important;
      gap: 0 !important;
      margin: 12px 0 !important;
      padding: 12px !important;
      background: var(--kr-bg-surface) !important;
      border: 1px solid var(--kr-border-default) !important;
      border-radius: 4px !important;
    }
    
    .mobile-characteristic-badge {
      min-width: 44px !important;
      min-height: 44px !important;
      margin: 4px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    .mobile-characteristic-badge:active {
      background: var(--kr-bg-hover) !important;
    }
    
    /* Compétences */
    .mobile-mini-profile-skills {
      max-height: 350px !important;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch !important;
      margin: 12px 0 !important;
      padding: 12px !important;
      background: var(--kr-bg-surface) !important;
      border: 1px solid var(--kr-border-default) !important;
      border-radius: 4px !important;
      display: grid !important;
      grid-template-columns: repeat(auto-fill, minmax(44px, 1fr)) !important;
      gap: 8px !important;
    }
    
    .mobile-skill-item {
      min-height: 44px !important;
      margin: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    .mobile-skill-item:active {
      background: var(--kr-bg-hover) !important;
    }
    
    /* Masquer le profil original en mobile */
    #player-header-section {
      display: none !important;
    }
    
    /* Masquer la section actions originale en mobile */
    #player-actions-section {
      display: none !important;
    }
  }
}

/* ============================================
   TASK-1.6 - MASQUER 18 COMPÉTENCES
   ============================================ */

@media (width <= 767px) {
  body.mobile-mode {
    /* Masquer le panel des 18 compétences */

    /* Les compétences sont accessibles via l'onglet "Personnage" (/jouer/perso) */
    .panel-body.grid-transformed {
      display: none !important;
    }
    
    /* Masquer le bouton "Afficher les compétences" */
    .kr-mobile-skills-toggle {
      display: none !important;
    }
    
    /* Masquer l'overlay des compétences si présent */
    .kr-mobile-overlay {
      display: none !important;
    }
  }
}

/* ============================================
   TASK-1.5 - ACTIONS RAPIDES (Bootstrap 3)
   ============================================ */

@media (width <= 767px) {
  body.mobile-mode {
    /* Container actions - Utilise btn-group-justified BS3 */
    .mobile-quick-actions.btn-group-justified {
      display: flex !important;
      flex-direction: row !important;
      width: 100% !important;
      border-bottom: 1px solid var(--kr-border-default) !important;
      background: var(--kr-bg-surface) !important;
    }
    
    /* Wrapper btn-group requis par BS3 justified */
    .mobile-quick-actions .btn-group {
      flex: 1 1 0 !important;
      display: flex !important;
    }
    
    /* Bouton d'action individuel - Réutilise btn BS3 */
    .mobile-quick-action.btn {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      flex: 1 !important;
      width: 100% !important;
      min-height: 60px !important;
      padding: 8px 4px !important;
      background: var(--kr-bg-surface) !important;
      color: var(--kr-text-primary) !important;
      border-radius: 0 !important;
      border-left: none !important;
      border-right: 1px solid var(--kr-border-default) !important;
      border-top: none !important;
      border-bottom: none !important;
      transition: all var(--transition-fast) !important;
    }
    
    .mobile-quick-action.btn:first-child {
      border-left: 1px solid var(--kr-border-default) !important;
    }
    
    .mobile-quick-action.btn:last-child {
      border-right: 1px solid var(--kr-border-default) !important;
    }
    
    .mobile-quick-action.btn:active {
      box-shadow: inset 0 3px 5px var(--kr-overlay-dark-125) !important;
      transform: scale(0.95) !important;
    }
    
    .mobile-quick-action.btn.disabled,
    .mobile-quick-action.btn[disabled] {
      opacity: 0.65 !important;
      cursor: not-allowed !important;
    }
    
    /* Icône */
    .mobile-quick-action-icon {
      font-size: 20px !important;
      margin-bottom: 2px !important;
      display: block !important;
    }
    
    .mobile-quick-action.btn i {
      font-size: 20px !important;
      margin-bottom: 2px !important;
      display: block !important;
    }
    
    /* Label */
    .mobile-quick-action-label {
      font-size: 11px !important;
      display: block !important;
      line-height: 1.2 !important;
      margin-top: 2px !important;
    }
  }
}

/* ============================================
   TASK-1.3 - TAB BAR NAVIGATION (Bootstrap 3)
   ============================================ */

@media (width <= 767px) {
  body.mobile-mode {
    /* Tab bar container - Utilise nav-tabs BS3 */
    .mobile-tab-bar.nav-tabs {
      position: sticky;
      top: var(--mobile-header-height);
      z-index: calc(var(--z-header) - 1);
      background: var(--kr-bg-surface) !important;
      border-bottom: 2px solid var(--kr-border-default) !important;
      margin-bottom: 0;
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      
      /* Masquer scrollbar */
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE/Edge */
    }
    
    .mobile-tab-bar.nav-tabs::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }
    
    /* Tabs individuels - Utilise les styles BS3 */
    .mobile-tab-bar.nav-tabs > li {
      flex: 1 1 0; /* Répartition égale */
      float: none;
      min-width: 0; /* Permet le shrink */
    }
    
    .mobile-tab-bar.nav-tabs > li > a {
      min-height: var(--mobile-touch-target);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px 4px;
      margin-right: 0;
      border-radius: 0;
      border: none;
      border-bottom: 3px solid transparent;
      transition: all var(--transition-fast);
      color: var(--kr-text-primary) !important;
      background: transparent !important;
    }
    
    /* Icône de tab */
    .mobile-tab-icon {
      font-size: 18px !important;
      margin-bottom: 4px !important;
      display: block !important;
    }
    
    /* Label de tab */
    .mobile-tab-label {
      font-size: 10px !important;
      display: block !important;
      line-height: 1.2 !important;
      text-align: center !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      max-width: 100% !important;
    }
    
    .mobile-tab-bar.nav-tabs > li > a:hover {
      background: var(--kr-bg-hover) !important;
      border-color: transparent;
    }
    
    .mobile-tab-bar.nav-tabs > li.active > a,
    .mobile-tab-bar.nav-tabs > li.active > a:hover,
    .mobile-tab-bar.nav-tabs > li.active > a:focus {
      color: var(--kr-primary);
      background: transparent;
      border-bottom-color: var(--kr-primary);
      font-weight: 600;
    }
    
    /* Badge notifications (utilise badge BS3) */
    .mobile-tab-bar.nav-tabs .badge {
      margin-left: var(--mobile-spacing-xs);
    }
    
    /* Indicateur de scroll (optionnel) */
    .mobile-tab-bar.nav-tabs::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 20px;
      background: linear-gradient(to right, transparent, var(--kr-bg-surface));
      pointer-events: none;
    }
    
    .mobile-tab-bar.nav-tabs.scrolled-end::after {
      display: none;
    }
  }
}

/* ============================================
   TASK-1.2 - HEADER RESPONSIVE (Bootstrap 3)
   ============================================ */

@media (width <= 767px) {
  body.mobile-mode {
    /* Header principal - Utilise les classes BS3 */
    .navbar,
    .navbar-default,
    .navbar-inverse {
      position: sticky;
      top: 0;
      z-index: var(--z-header);
      background: var(--kr-navbar-bg);
      border-bottom: 1px solid var(--kr-overlay-light-10);
      box-shadow: 0 2px 4px var(--kr-overlay-dark-30);
      margin-bottom: 0;
      min-height: var(--mobile-header-height);
    }
    
    .navbar .container {
      padding-left: 10px;
      padding-right: 10px;
    }
    
    /* Zone gauche - Hamburger (réutilise navbar-toggle BS3) */
    .navbar-toggle {
      display: block;
      margin: 8px 10px;
      padding: 9px 10px;
      border: 1px solid var(--kr-overlay-light-20);
      order: 1;
      margin-right: 0;
      margin-left: auto;
      border-radius: 4px;
      background: transparent;
    }
    
    .navbar-toggle:hover,
    .navbar-toggle:focus {
      background: var(--kr-overlay-light-10);
    }
    
    .navbar-toggle .icon-bar {
      background-color: var(--kr-white);
    }
    
    /* Logo visible dans la navbar à gauche */
    .navbar-header .navbar-brand {
      display: flex !important;
      align-items: center;
      padding: 8px 12px !important;
      margin-right: auto !important;
      height: var(--mobile-header-height);
      min-width: 44px; /* Zone tactile minimum WCAG 2.5.5 */
    }
    
    .navbar-header .navbar-brand img {
      max-height: 32px;
      width: auto;
    }
    
    /* Feedback tactile */
    .navbar-header .navbar-brand:active {
      background: var(--kr-overlay-dark-20);
      transform: scale(0.95);
    }
    
    /* Cacher le logo déplacé sous la navbar */
    .navbar-brand[data-moved-below-navbar] {
      display: none !important;
    }
    
    /* Boutons déplacés dans le header */
    .navbar-header-buttons-left,
    .navbar-header-buttons-right {
      display: flex;
      align-items: center;
      height: var(--mobile-header-height);
    }
    
    .navbar-header-buttons-left {
      order: -1; /* Place à gauche avant le toggle */
      padding-left: 8px;
    }
    
    .navbar-header-buttons-right {
      order: 2; /* Avant le logo */
      margin-left: auto; /* Pousse à droite */
      padding-right: 8px;
    }
    
    .navbar-header-buttons-left li,
    .navbar-header-buttons-right li {
      list-style: none;
      display: inline-block;
      margin: 0 2px;
    }
    
    .navbar-header-buttons-left li a,
    .navbar-header-buttons-right li a {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 44px !important;
      min-height: 44px !important;
      padding: 10px !important;
      font-size: 18px;
      color: var(--kr-white) !important;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 150ms ease;
      position: relative;
    }
    
    .navbar-header-buttons-left li a:active,
    .navbar-header-buttons-right li a:active {
      background-color: var(--kr-overlay-light-10);
    }
    
    /* Badge dans le header */
    .navbar-header-buttons-left .badge,
    .navbar-header-buttons-right .badge {
      position: absolute !important;
      top: 6px !important;
      right: 6px !important;
      min-width: 16px !important;
      height: 16px !important;
      padding: 2px 4px !important;
      font-size: 10px !important;
      line-height: 12px !important;
      border-radius: 8px !important;
    }
    
    /* Réorganiser l'ordre des éléments du header */
    .navbar-header {
      display: flex;
      align-items: center;
      width: 100%;
    }
    
    /* Zone droite - Icônes (conservées telles quelles) */
    .navbar-right {
      margin: 0 !important;
      padding: 8px 0 !important;
      border-top: 1px solid var(--kr-overlay-light-10) !important;
    }
    
    .navbar-right > li > a {
      padding: 15px 10px;
    }
    
    /* Menu mobile - Utilise navbar-collapse BS3 */
    .navbar-collapse {
      border-top: 1px solid var(--kr-overlay-light-10);
      box-shadow: inset 0 1px 0 var(--kr-overlay-light-05);
      max-height: calc(100vh - var(--mobile-header-height));
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    
    .navbar-collapse.in,
    .navbar-collapse.collapsing {
      overflow-y: auto;
      height: auto !important; /* Force hauteur auto pour éviter les problèmes de collapse.js */
    }
    
    /* Navigation dans le collapse */
    .navbar-nav {
      margin: 0;
      padding: 8px 0;
    }
    
    /* Liens principaux du menu - optimisés pour le tactile */
    .navbar-nav > li > a {
      min-height: 44px !important; /* WCAG 2.5.5 - zone tactile minimum */
      padding: 14px 20px !important;
      font-size: 16px !important; /* Évite le zoom automatique iOS */
      line-height: 1.5 !important;
      display: flex !important;
      align-items: center !important;
      border-bottom: 1px solid var(--kr-overlay-light-05) !important;
      transition: background-color 150ms ease !important;
    }
    
    /* Feedback tactile au toucher */
    .navbar-nav > li > a:active {
      background: var(--kr-overlay-light-10) !important;
      transition: none !important;
    }
    
    /* Masquer les carets (chevrons) en mobile - navigation directe */
    .navbar-nav > li > a .caret {
      display: none !important;
    }
    
    /* Dropdowns dans le menu mobile - masqués par défaut car navigation directe */
    .navbar-nav .dropdown-menu {
      display: none !important; /* Masquer les sous-menus en mobile */
    }
    
    .navbar-right > li {
      display: inline-block !important;
    }
    
    .navbar-right > li > a,
    .navbar-right > li > button {
      min-width: 44px !important; /* Zone tactile minimum */
      min-height: 44px !important;
      padding: 12px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 18px !important; /* Icônes plus grandes */
      border-radius: 4px !important;
      margin: 0 4px !important;
    }
    
    .navbar-right > li > a:active,
    .navbar-right > li > button:active {
      background: var(--kr-overlay-light-10) !important;
    }
    
    /* Badge de notification */
    .navbar-right .badge {
      position: absolute !important;
      top: 8px !important;
      right: 8px !important;
      min-width: 18px !important;
      height: 18px !important;
      padding: 2px 5px !important;
      font-size: 11px !important;
      line-height: 14px !important;
    }
  }
}

/* ============================================
   TASK-2.2 - ACCORDÉON GROUPES (Base)
   ============================================ */

@media (width <= 767px) {
  body.mobile-mode {
    /* Header de groupe avec accordéon */
    .dashboard-section-header-accordion {
      position: relative;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      transition: background-color var(--transition-fast);
    }
    
    .dashboard-section-header-accordion:active {
      background-color: var(--kr-overlay-light-05);
    }
    
    /* Icône chevron pour l'accordéon */
    .dashboard-section-header-accordion .accordion-icon {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%) rotate(0deg);
      transition: transform var(--transition-normal);
      color: var(--kr-text-secondary);
      font-size: 14px;
      pointer-events: none;
    }
    
    /* Rotation de l'icône quand le groupe est ouvert */
    .dashboard-section-header-accordion.expanded .accordion-icon {
      transform: translateY(-50%) rotate(-180deg);
    }
    
    /* Grille de membres collapsible */
    .dashboard-cards-grid {
      overflow: hidden;
      transition: max-height var(--transition-normal) ease-in-out,
                  opacity var(--transition-normal) ease-in-out,
                  margin var(--transition-fast);
      max-height: 5000px; /* Grande valeur pour le contenu étendu */
      opacity: 1;
    }
    
    /* État collapsed */
    .dashboard-cards-grid.collapsed {
      max-height: 0;
      opacity: 0;
      margin: 0;
      pointer-events: none;
    }
    
    /* Espacement pour les groupes */
    .dashboard-section {
      margin-bottom: 10px;
    }
    
    /* Mon groupe - style spécial */
    .dashboard-section-mygroup .dashboard-section-header {
      background: var(--kr-bg-hover);
      border-left: 3px solid var(--kr-primary);
    }
  }
}

/* ============================================
   TASK-2.3 - CARDS PERSOS (Mobile Optimized)
   ============================================ */

@media (width <= 767px) {
  body.mobile-mode {
    /* Grille de cartes compacte */
    .dashboard-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: 8px;
      padding: 10px;
      background: var(--kr-bg-surface);
    }
    
    /* Carte de personnage compacte */
    .dashboard-card {
      position: relative;
      width: 100%;
      min-height: 140px;
      margin: 0;
    }
    
    /* Lien principal de la carte */
    .dashboard-card-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 4px;
      background: var(--kr-bg-hover);
      border: 1px solid var(--kr-border-default);
      border-radius: 8px;
      text-decoration: none;
      transition: all var(--transition-fast);
    }
    
    .dashboard-card-link:hover,
    .dashboard-card-link:active {
      background: var(--kr-bg-active);
      border-color: var(--kr-primary);
      transform: translateY(-1px);
    }
    
    /* Header avec avatar */
    .dashboard-card-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin-bottom: 6px;
    }
    
    /* Wrapper d'avatar avec cercle HP */
    .dashboard-card-avatar-wrapper {
      position: relative;
      width: 60px;
      height: 60px;
      margin-bottom: 4px;
    }
    
    /* Cercle de vie (HP) */
    .dashboard-card-hp-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px !important;
      height: 60px !important;
    }
    
    .dashboard-card-hp-circle circle {
      stroke-width: 2 !important;
    }
    
    /* Avatar du personnage */
    .dashboard-card-avatar {
      position: relative;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      margin: 5px;
      z-index: 1;
    }
    
    /* Container du nom */
    .dashboard-card-name-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      gap: 2px;
    }
    
    /* Icône du monde */
    .dashboard-card-world {
      width: 14px;
      height: 14px;
      opacity: 0.6;
    }
    
    /* Nom du personnage */
    .dashboard-card-name {
      font-size: 11px;
      font-weight: 500;
      color: var(--kr-text-primary);
      text-align: center;
      line-height: 1.2;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
    
    /* Body avec statut */
    .dashboard-card-body {
      width: 100%;
      padding: 0 2px;
    }
    
    /* Statut du personnage */
    .dashboard-card-status {
      font-size: 9px;
      color: var(--kr-text-secondary);
      text-align: center;
      font-style: italic;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    /* Badge PNJ */
    .dashboard-card-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      background: var(--kr-primary);
      color: var(--kr-text-primary);
      font-size: 8px;
      font-weight: 600;
      padding: 2px 4px;
      border-radius: 4px;
      text-transform: uppercase;
      z-index: 2;
    }
    
    /* Actions (profil, message) */
    .dashboard-card-actions {
      display: flex;
      gap: 8px;
      justify-content: center;
      padding: 6px 4px 4px;
      border-top: 1px solid var(--kr-border-default);
      margin-top: 6px;
    }
    
    .dashboard-card-actions a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: var(--kr-bg-surface);
      border: 1px solid var(--kr-border-default);
      border-radius: 6px;
      color: var(--kr-text-secondary);
      transition: all var(--transition-fast);
      text-decoration: none;
    }
    
    .dashboard-card-actions a:hover {
      background: var(--kr-primary);
      border-color: var(--kr-primary);
      color: var(--kr-text-primary);
      transform: scale(1.1);
    }
    
    .dashboard-card-actions i {
      font-size: 13px;
    }
  }
}

/* ============================================================================
 * TASK-2.5 : Commerce - Accordéon catégories
 * ============================================================================
 */

/* Header de catégorie cliquable */
body.mobile-mode .commerce-category-header {
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  transition: background-color var(--transition-fast);
}

body.mobile-mode .commerce-category-header:hover {
  background-color: var(--kr-bg-hover);
}

body.mobile-mode .commerce-category-header:active {
  background-color: var(--kr-bg-active);
}

/* Icône chevron */
body.mobile-mode .commerce-category-header .accordion-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  transition: transform var(--transition-normal);
  font-size: 14px;
  color: var(--kr-text-secondary);
}

body.mobile-mode .commerce-category-header.expanded .accordion-icon {
  transform: translateY(-50%) rotate(-180deg);
}

/* Conteneur de produits collapsible */
body.mobile-mode .commerce-products-container {
  max-height: 5000px;
  opacity: 1;
  overflow: hidden;
  transition: max-height var(--transition-normal), opacity var(--transition-normal);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  padding: 8px 0;
}

body.mobile-mode .commerce-products-container.collapsed {
  max-height: 0 !important;
  opacity: 0;
}

/* ============================================================================
 * TASK-2.6 : Commerce - Cards produits compactes
 * ============================================================================
 */

/* Carte produit compacte */
body.mobile-mode .commerce-products-container > a.list-group-item {
  display: flex !important;
  flex-direction: column;
  padding: 8px !important;
  min-height: 120px;
  border-radius: 8px;
  background-color: var(--kr-bg-surface);
  border: 1px solid var(--kr-border-default);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

body.mobile-mode .commerce-products-container > a.list-group-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Prix en haut à droite */
body.mobile-mode .commerce-products-container > a.list-group-item .mention {
  position: absolute;
  top: 4px;
  right: 4px;
  float: none !important;
  font-size: 10px;
  line-height: 1.2;
  text-align: right;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 2px 4px;
  border-radius: 4px;
}

body.mobile-mode .commerce-products-container > a.list-group-item .mention .xmini {
  font-size: 9px;
  opacity: 0.8;
}

/* Image centrée */
body.mobile-mode .commerce-products-container > a.list-group-item img {
  float: none !important;
  display: block;
  margin: 0 auto 8px;
  width: 40px;
  height: 40px;
}

/* Titre du produit */
body.mobile-mode .commerce-products-container > a.list-group-item h4 {
  font-size: 11px;
  line-height: 1.3;
  margin: 0 0 4px;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

/* Description (optionnel, peut être masquée sur mobile) */
body.mobile-mode .commerce-products-container > a.list-group-item p {
  font-size: 9px;
  line-height: 1.2;
  margin: 0;
  text-align: center;
  color: var(--kr-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Masquer l'icône carré de la description */
body.mobile-mode .commerce-products-container > a.list-group-item p i {
  display: none;
}

/* ============================================================================
 * TASK-2.4 : Section bâtiment collapsible
 * ============================================================================
 */

/* Header de section bâtiment cliquable */
body.mobile-mode .building-section-header {
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  transition: background-color var(--transition-fast);
}

body.mobile-mode .building-section-header:hover {
  background-color: var(--kr-bg-hover);
}

body.mobile-mode .building-section-header:active {
  background-color: var(--kr-bg-active);
}

/* Icône chevron */
body.mobile-mode .building-section-header .accordion-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  transition: transform var(--transition-normal);
  font-size: 14px;
  color: var(--kr-text-secondary);
}

body.mobile-mode .building-section-header.expanded .accordion-icon {
  transform: translateY(-50%) rotate(-180deg);
}

/* Contenu collapsible */
body.mobile-mode .building-section-content {
  max-height: 5000px;
  opacity: 1;
  overflow: hidden;
  transition: max-height var(--transition-normal), opacity var(--transition-normal);
}

body.mobile-mode .building-section-content.collapsed {
  max-height: 0 !important;
  opacity: 0;
}

/* ============================================================================
 * TASK-2.1 : Accès aux pièces en ligne horizontale avec croix directionnelle
 * Style identique aux actions rapides (Dormir, Prier, etc.)
 * ============================================================================ */

/* Conteneur principal : table layout comme mobile-quick-actions */
body.mobile-mode .kr-navigation-row {
  display: table !important;
  width: 100%;
  table-layout: fixed;
  margin-bottom: 5px;
  border-collapse: separate;
  border-spacing: 0;
}

/* Réduire l'espacement du container suivant */
body.mobile-mode .kr-navigation-row + .container {
  padding-top: 10px !important;
}

/* Groupes (croix + cartes) - affichage en cellules de table */
body.mobile-mode .kr-navigation-row > .btn-group {
  display: table-cell !important;
  width: 1%;
  vertical-align: middle;
  float: none !important;
}

/* Croix directionnelle - même style que les actions rapides */
body.mobile-mode .kr-direction-link {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px !important;
  padding: 0 !important;
  text-align: center;
  position: relative;
}

body.mobile-mode .kr-direction-link img {
  width: 60px;
  height: 60px;
  display: block;
}

body.mobile-mode .kr-direction-link map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Cases des accès aux pièces - même style que mobile-quick-action */
body.mobile-mode .kr-room-link {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px !important;
  padding: 0 !important;
  text-align: center;
  font-size: 10px;
  line-height: 1.2;
}

body.mobile-mode .kr-room-link img {
  width: 60px;
  height: 60px;
  display: block;
}

/* Premier élément : bordures arrondies à gauche */
body.mobile-mode .kr-navigation-row > .btn-group:first-child .kr-direction-link,
body.mobile-mode .kr-navigation-row > .btn-group:first-child .kr-room-link {
  border-radius: 4px 0 0 4px;
}

/* Dernier élément : bordures arrondies à droite */
body.mobile-mode .kr-navigation-row > .btn-group:last-child .kr-room-link {
  border-radius: 0 4px 4px 0;
}

/* Éléments du milieu : pas de bordure gauche pour éviter le doublon */
body.mobile-mode .kr-navigation-row > .btn-group:not(:first-child) .kr-direction-link,
body.mobile-mode .kr-navigation-row > .btn-group:not(:first-child) .kr-room-link {
  border-left: none;
}

/* Si un seul élément : bordures arrondies partout */
body.mobile-mode .kr-navigation-row > .btn-group:only-child .kr-direction-link,
body.mobile-mode .kr-navigation-row > .btn-group:only-child .kr-room-link {
  border-radius: 4px;
}

/* ============================================
   GROUPES DE PERSONNAGES - STYLE BARRE
   ============================================ */

@media (width <= 767px) {
  body.mobile-mode {
    /* Mode mobile activé */
  }
  
  /* Retrait padding conteneurs et colonnes Bootstrap en mobile */
  body.mobile-mode .container,
  body.mobile-mode .container-fluid,
  body.mobile-mode [class*="col-"] {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  
  body.mobile-mode .row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  
  /* Conteneur dashboard pleine largeur */
  body.mobile-mode .dashboard {
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100% !important;
    padding: 0 !important;
  }
    
    /* Style du panel-group pour ressembler aux barres du dessus */
    .panel-group {
      background: var(--kr-bg-surface) !important;
      border: 1px solid var(--kr-border-default) !important;
      border-left: none !important;
      border-right: none !important;
      border-radius: 0 !important;
      margin-bottom: 5px !important;
      margin-left: -15px !important;
      margin-right: -15px !important;
      width: calc(100% + 30px) !important;
    }
    
    /* Panel individuel */
    .panel-group .panel {
      background: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      margin-bottom: 0 !important;
      box-shadow: none !important;
    }
    
    /* Séparateur entre les panels */
    .panel-group .panel + .panel {
      border-top: 1px solid var(--kr-border-default) !important;
    }
    
    /* Header du groupe - style barre */
    .panel-group .panel-heading {
      background: var(--kr-bg-surface) !important;
      border: none !important;
      border-radius: 0 !important;
      padding: 12px 0 !important;
      margin: 0 !important;
      align-items: center !important;
      transition: background-color var(--transition-fast) !important;
    }
    
    .panel-group .panel-heading:active {
      background: var(--kr-bg-hover) !important;
    }
    
    /* Contenu du groupe */
    .panel-group .panel-collapse {
      border: none !important;
    }
    
    .panel-group .panel-body {
      background: var(--kr-bg-surface) !important;
      border: none !important;
      padding: 10px 0 !important;
    }
    
    /* Titre du groupe */
    .panel-group .panel-title {
      font-size: 14px !important;
      font-weight: 500 !important;
      color: var(--kr-text-primary) !important;
    }
    
    .panel-group .panel-title a {
      display: block !important;
      color: var(--kr-text-primary) !important;
      text-decoration: none !important;
    }
    
    .panel-group .panel-title a:hover {
      color: var(--kr-text-primary) !important;
    }
    
    /* ========================================================================
       MODAL / DIALOG MOBILE OPTIMIZATIONS
       ======================================================================== */
    
    /* Modal backdrop - assombrir légèrement */
    body.mobile-mode .modal-backdrop {
      background-color: rgba(0, 0, 0, 0.6) !important;
    }
    
    /* Modal dialog - pleine largeur avec marges minimales */
    body.mobile-mode .modal-dialog {
      width: 100% !important;
      max-width: calc(100vw - 20px) !important;
      margin: 10px !important;
      max-height: calc(100vh - 20px) !important;
    }
    
    /* Modal content - optimiser l'espace */
    body.mobile-mode .modal-content {
      border-radius: 8px !important;
    }
    
    /* Modal header - plus compact */
    body.mobile-mode .modal-header {
      padding: 15px !important;
    }
    
    body.mobile-mode .modal-header h3 {
      font-size: 18px !important;
      margin: 0 !important;
    }
    
    /* Close button - plus grand pour touch */
    body.mobile-mode .modal-header .close,
    body.mobile-mode .bootbox-close-button {
      width: 44px !important;
      height: 44px !important;
      padding: 10px !important;
      font-size: 28px !important;
      line-height: 24px !important;
      opacity: 0.7 !important;
    }
    
    /* Modal body - plus de padding */
    body.mobile-mode .modal-body {
      padding: 15px !important;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch !important;
    }
    
    /* Select dropdown - pleine largeur et plus grand */
    body.mobile-mode .modal-body select {
      width: 100% !important;
      height: 44px !important;
      font-size: 16px !important;
      padding: 10px !important;
      margin-bottom: 15px !important;
      border-radius: 6px !important;
    }
    
    /* Nav tabs (actions buttons) - layout vertical pour mobile */
    body.mobile-mode .modal-body .nav-tabs {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 10px !important;
      border: none !important;
      margin-bottom: 20px !important;
    }
    
    body.mobile-mode .modal-body .nav-tabs > li {
      flex: 1 1 calc(50% - 5px) !important;
      min-width: 0 !important;
      margin: 0 !important;
      border: none !important;
    }
    
    body.mobile-mode .modal-body .nav-tabs > li > a {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 44px !important;
      padding: 12px 10px !important;
      font-size: 15px !important;
      font-weight: 500 !important;
      border: 1px solid var(--kr-border-default) !important;
      border-radius: 6px !important;
      background: var(--kr-bg-secondary) !important;
      color: var(--kr-text-primary) !important;
      text-align: center !important;
      overflow-wrap: break-word !important;
      transition: all 0.2s ease !important;
    }
    
    body.mobile-mode .modal-body .nav-tabs > li.active > a,
    body.mobile-mode .modal-body .nav-tabs > li > a:hover,
    body.mobile-mode .modal-body .nav-tabs > li > a:focus {
      background: var(--kr-primary) !important;
      color: var(--kr-surface) !important;
      border-color: var(--kr-primary) !important;
    }
    
    /* Form groups - meilleur espacement */
    body.mobile-mode .modal-body .form-group {
      margin-bottom: 20px !important;
    }
    
    body.mobile-mode .modal-body label {
      font-size: 15px !important;
      font-weight: 500 !important;
      margin-bottom: 8px !important;
      display: block !important;
    }
    
    /* Inputs et textareas - plus grands */
    body.mobile-mode .modal-body input[type="text"],
    body.mobile-mode .modal-body input[type="number"],
    body.mobile-mode .modal-body textarea {
      width: 100% !important;
      min-height: 44px !important;
      font-size: 16px !important;
      padding: 10px !important;
      border-radius: 6px !important;
    }
    
    body.mobile-mode .modal-body textarea {
      min-height: 120px !important;
      resize: vertical !important;
    }
    
    /* Checkboxes et radios - plus grands touch targets */
    body.mobile-mode .modal-body input[type="checkbox"],
    body.mobile-mode .modal-body input[type="radio"] {
      width: 20px !important;
      height: 20px !important;
      margin-right: 10px !important;
    }
    
    body.mobile-mode .modal-body .checkbox label,
    body.mobile-mode .modal-body .radio label {
      display: flex !important;
      align-items: center !important;
      min-height: 44px !important;
      padding: 8px 0 !important;
      cursor: pointer !important;
    }
    
    /* Tables - améliorer lisibilité */
    body.mobile-mode .modal-body table {
      font-size: 14px !important;
    }
    
    body.mobile-mode .modal-body table td,
    body.mobile-mode .modal-body table th {
      padding: 10px 8px !important;
    }
    
    body.mobile-mode .modal-body table th {
      text-align: center !important;
    }
    
    /* Modal footer - sticky en bas avec boutons pleine largeur */
    body.mobile-mode .modal-footer {
      padding: 15px !important;
      display: flex !important;
      gap: 10px !important;
      border-top: 1px solid var(--kr-border-default) !important;
      background: var(--kr-bg-surface) !important;
    }
    
    body.mobile-mode .modal-footer .btn {
      flex: 1 !important;
      min-height: 48px !important;
      max-height: 48px !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      border-radius: 6px !important;
      padding: 12px 20px !important;
      box-sizing: border-box !important;
      line-height: 1.2 !important;
    }
    
    body.mobile-mode .modal-footer .btn-primary {
      order: 2 !important;
    }
    
    body.mobile-mode .modal-footer .btn-default {
      order: 1 !important;
    }
    
    /* Alert dans modal - meilleur affichage */
    body.mobile-mode .modal-body .alert {
      padding: 12px !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
      margin-bottom: 15px !important;
      border-radius: 6px !important;
    }
    
    /* Avatar/Image dans header - optimiser */
    body.mobile-mode .modal-header img {
      max-width: 60px !important;
      max-height: 60px !important;
      border-radius: 4px !important;
    }
  }

  /* ========================================================================
     MODAL PERSONNAGE MOBILE - UX/UI OPTIMISÉE POUR STRUCTURE RÉELLE
     ======================================================================== */
  @media (width <= 767px) {
    /* ===== 1. SELECT PERSONNAGE - visible, zone tactile agrandie ===== */
    body.mobile-mode .bootbox.modal select[name="top"].form-control {
      min-height: 56px !important;
      font-size: 16px !important;
      padding: 12px 16px !important;
      border-radius: 8px !important;
      border: 2px solid var(--kr-border-default) !important;
      background-color: var(--kr-bg-elevated) !important;
      transition: border-color 0.2s ease !important;
    }
    
    body.mobile-mode .bootbox.modal select[name="top"].form-control:focus {
      border-color: var(--kr-primary) !important;
      outline: none !important;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1) !important;
    }
    
    /* Conteneur du select avec marges */
    body.mobile-mode .bootbox.modal select[name="top"].form-control + br,
    body.mobile-mode .bootbox.modal .row:has(> .col-md-6 > select[name="top"]) {
      margin-bottom: 16px !important;
    }
    
    /* ===== 2. HEADER H3 - avatar + nom compact ===== */
    body.mobile-mode .bootbox.modal h3 {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      padding: 12px 16px !important;
      margin: 0 0 16px !important;
      background: var(--kr-bg-surface) !important;
      border-radius: 8px !important;
      font-size: 18px !important;
      line-height: 1.3 !important;
    }
    
    /* Avatar 48px */
    body.mobile-mode .bootbox.modal h3 img[width="80"] {
      width: 48px !important;
      height: 48px !important;
      max-width: 48px !important;
      max-height: 48px !important;
      border-radius: 6px !important;
      flex-shrink: 0 !important;
      order: -1 !important;
    }
    
    /* Wrapper pull-right dans h3 */
    body.mobile-mode .bootbox.modal h3 .pull-right {
      float: none !important;
      order: -1 !important;
      margin: 0 !important;
    }
    
    /* Liens mini (profil + kramail) */
    body.mobile-mode .bootbox.modal h3 .mini.center {
      display: flex !important;
      gap: 8px !important;
      margin: 0 !important;
      justify-content: flex-start !important;
    }
    
    body.mobile-mode .bootbox.modal h3 .mini.center a {
      min-width: 44px !important;
      min-height: 44px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    /* Bouton groupe (user-friends) */
    body.mobile-mode .bootbox.modal h3 .btn.btn-xs {
      min-width: 44px !important;
      min-height: 44px !important;
      padding: 8px !important;
      margin-left: auto !important;
    }
    
    /* ===== 3. NAVIGATION TABS - fusionner les deux listes en une seule ===== */

    /* Conteneur des listes */
    body.mobile-mode .bootbox.modal .panel.with-nav-tabs .panel-heading {
      display: flex !important;
      flex-flow: row nowrap !important;
      overflow: hidden auto !important;
      -webkit-overflow-scrolling: touch !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
      border-bottom: 2px solid var(--kr-border-default) !important;
      padding: 0 !important;
      margin: 0 !important;
      background: var(--kr-bg-surface) !important;
    }
    
    body.mobile-mode .bootbox.modal .panel.with-nav-tabs .panel-heading::-webkit-scrollbar {
      display: none !important;
    }
    
    /* Chaque liste .nav-tabs inline */
    body.mobile-mode .bootbox.modal .panel.with-nav-tabs .nav-tabs {
      display: flex !important;
      flex-wrap: nowrap !important;
      flex-shrink: 0 !important;
      border: none !important;
      padding: 0 !important;
      gap: 0 !important;
      margin: 0 !important;
      background: transparent !important;
      position: relative !important;
    }
    
    body.mobile-mode .bootbox.modal .panel.with-nav-tabs .nav-tabs::-webkit-scrollbar {
      display: none !important;
    }
    
    /* Tabs individuels - min 88px tactiles */
    body.mobile-mode .bootbox.modal .panel.with-nav-tabs .nav-tabs > li {
      flex: 0 0 auto !important;
      min-width: 88px !important;
      width: auto !important;
      height: 44px !important;
      margin: 0 !important;
      border: none !important;
    }
    
    body.mobile-mode .bootbox.modal .panel.with-nav-tabs .nav-tabs > li > a {
      padding: 10px 16px !important;
      min-height: 44px !important;
      height: 44px !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      line-height: 1.2 !important;
      white-space: nowrap !important;
      border-radius: 0 !important;
      border: none !important;
      border-bottom: 3px solid transparent !important;
      background: transparent !important;
      color: var(--kr-text-secondary) !important;
      transition: all 0.2s ease !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
      margin: 0 !important;
    }
    
    /* Tab active */
    body.mobile-mode .bootbox.modal .panel.with-nav-tabs .nav-tabs > li.active > a,
    body.mobile-mode .bootbox.modal .panel.with-nav-tabs .nav-tabs > li.active > a:hover,
    body.mobile-mode .bootbox.modal .panel.with-nav-tabs .nav-tabs > li.active > a:focus {
      background: var(--kr-bg-elevated) !important;
      color: var(--kr-primary) !important;
      border: none !important;
      border-bottom: 3px solid var(--kr-primary) !important;
      font-weight: 600 !important;
      height: 44px !important;
    }
    
    /* Feedback tactile tabs */
    body.mobile-mode .bootbox.modal .panel.with-nav-tabs .nav-tabs > li > a:active {
      transform: scale(0.96) !important;
      background: var(--kr-bg-active) !important;
    }
    
    /* ===== 4. PANEL BODY - padding optimisé ===== */
    body.mobile-mode .bootbox.modal .panel-body.panel-order {
      padding: 16px !important;
    }
    
    /* ===== 5. COLONNES FUSIONNÉES EN MODE MOBILE ===== */

    /* Les colonnes sont fusionnées en une seule div par JavaScript */
    body.mobile-mode .bootbox.modal .merged-columns {
      padding: 12px !important;
      font-size: 14px !important;
      line-height: 1.6 !important;
    }
    
    /* Styles pour l'en-tête du tableau */
    body.mobile-mode .bootbox.modal .panel-heading {
      background: var(--kr-bg-elevated) !important;
      border-bottom: 2px solid var(--kr-border-default) !important;
      padding: 0 !important;
      font-weight: 600 !important;
    }
    
    body.mobile-mode .bootbox.modal .panel-heading .merged-columns {
      font-size: 13px !important;
      color: var(--kr-text-secondary) !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
    }
    
    /* Footer (ligne Maladresse/Bonus) et Boutons */
    body.mobile-mode .bootbox.modal .panel-footer {
      background: var(--kr-bg-elevated) !important;
      border-top: 1px solid var(--kr-border-default) !important;
      padding: 0 !important;
      display: flex !important;
      gap: 6px !important;
      border: none !important;
    }
    
    body.mobile-mode .bootbox.modal .panel-footer label {
      margin: 0 !important;
      font-size: 14px !important;
    }

    
    body.mobile-mode .bootbox.modal .panel-footer select {
      padding: 6px 8px !important;
      border-radius: 6px !important;
      border: 1px solid var(--kr-border-default) !important;
      font-size: 14px !important;
    }
    
    body.mobile-mode .bootbox.modal .panel-actions .row.form-group {
      margin: 0 0 8px !important;
      background: var(--kr-bg-elevated) !important;
      border: 2px solid var(--kr-border-default) !important;
      border-radius: 8px !important;
      min-height: 56px !important;
      transition: all 0.2s ease !important;
    }
    
    /* Row checked */
    body.mobile-mode .bootbox.modal .panel-actions .row.form-group:has(input[type="radio"]:checked) {
      border-color: var(--kr-primary) !important;
      background: var(--kr-alert-info-bg) !important;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1) !important;
    }
    
    /* Feedback tactile sur la row */
    body.mobile-mode .bootbox.modal .panel-actions .row.form-group:active {
      transform: scale(0.98) !important;
      background: var(--kr-bg-active) !important;
    }
    
    body.mobile-mode .bootbox.modal .panel-actions .row.form-group > div {
      padding: 0 8px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    /* Colonne du radio button - aligné à gauche */
    body.mobile-mode .bootbox.modal .panel-actions .row.form-group > div.col-sm-1 {
      justify-content: flex-start !important;
    }
    
    /* Colonne du label - aligné à gauche */
    body.mobile-mode .bootbox.modal .panel-actions .row.form-group > div.col-sm-7 {
      justify-content: flex-start !important;
    }
    
    /* Radio inputs cachés */
    body.mobile-mode .bootbox.modal .panel-actions input[type="radio"] {
      position: absolute !important;
      opacity: 0 !important;
      width: 0 !important;
      height: 0 !important;
    }
    
    /* Labels comme boutons */
    body.mobile-mode .bootbox.modal .panel-actions label {
      cursor: pointer !important;
      font-weight: normal !important;
      font-size: 15px !important;
      margin: 0 !important;
      padding: 14px 0 !important;
      display: block !important;
      width: 100% !important;
    }
    
    /* Label checked */
    body.mobile-mode .bootbox.modal .panel-actions input[type="radio"]:checked + label {
      font-weight: 600 !important;
    }
    
    /* Colonnes diff/jet plus compactes */
    body.mobile-mode .bootbox.modal .panel-actions .center {
      font-size: 14px !important;
      font-weight: 600 !important;
    }
    
    /* ===== 6. TOOLBAR - boutons tactiles optimisés ===== */
    body.mobile-mode .bootbox.modal .btn-toolbar {
      display: grid !important;
      grid-template-columns: repeat(6, 1fr) !important;
      gap: 4px !important;
      margin: 0 0 16px !important;
      padding: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
    }
    
    body.mobile-mode .bootbox.modal .btn-toolbar .btn-group {
      display: contents !important;
    }
    
    /* Supprimer COMPLÈTEMENT les pseudo-éléments clearfix de Bootstrap 3 */
    body.mobile-mode .bootbox.modal .btn-toolbar::before,
    body.mobile-mode .bootbox.modal .btn-toolbar::after,
    body.mobile-mode .bootbox.modal .btn-toolbar .btn-group::before,
    body.mobile-mode .bootbox.modal .btn-toolbar .btn-group::after,
    body.mobile-mode .bootbox.modal .btn-toolbar .dropdown::before,
    body.mobile-mode .bootbox.modal .btn-toolbar .dropdown::after,
    body.mobile-mode .bootbox.modal .btn-toolbar span.dropdown::before,
    body.mobile-mode .bootbox.modal .btn-toolbar span.dropdown::after {
      content: none !important;
      display: none !important;
      width: 0 !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    /* Tous les boutons directs et liens dans la toolbar */
    body.mobile-mode .bootbox.modal .btn-toolbar > .btn,
    body.mobile-mode .bootbox.modal .btn-toolbar .btn-group > a.btn,
    body.mobile-mode .bootbox.modal .btn-toolbar .btn-group > button.btn,
    body.mobile-mode .bootbox.modal .btn-toolbar .btn-group > .dropdown {
      min-width: 44px !important;
      max-width: none !important;
      width: 100% !important;
      min-height: 44px !important;
      max-height: 44px !important;
      height: 44px !important;
      padding: 8px !important;
      margin: 0 !important;
      font-size: 18px !important;
      line-height: 1 !important;
      border-radius: 4px !important;
      border-width: 1px !important;
      display: grid !important;
      place-items: center !important;
      transition: all 0.2s ease !important;
      box-sizing: border-box !important;
    }
    
    /* Dropdown wrapper - ne pas appliquer de style sur le span dropdown */
    body.mobile-mode .bootbox.modal .btn-toolbar .dropdown {
      display: contents !important;
      position: relative !important;
    }
    
    /* Le lien dropdown-toggle à l'intérieur du span dropdown */
    body.mobile-mode .bootbox.modal .btn-toolbar .dropdown > a.dropdown-toggle {
      min-width: 44px !important;
      width: 100% !important;
      min-height: 44px !important;
      height: 44px !important;
      padding: 0 !important;
      margin: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border: none !important;
      background: transparent !important;
      text-decoration: none !important;
    }
    
    /* Le bouton à l'intérieur du dropdown-toggle */
    body.mobile-mode .bootbox.modal .btn-toolbar .dropdown > a.dropdown-toggle > .btn {
      min-width: 44px !important;
      width: 100% !important;
      min-height: 44px !important;
      height: 44px !important;
      padding: 8px !important;
      margin: 0 !important;
      font-size: 18px !important;
      line-height: 1 !important;
      border-radius: 4px !important;
      border-width: 1px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-sizing: border-box !important;
    }
    
    /* Feedback tactile sur tous les boutons */
    body.mobile-mode .bootbox.modal .btn-toolbar .btn:active,
    body.mobile-mode .bootbox.modal .btn-toolbar .btn-group > a.btn:active,
    body.mobile-mode .bootbox.modal .btn-toolbar .dropdown > a.dropdown-toggle:active,
    body.mobile-mode .bootbox.modal .btn-toolbar .dropdown > a.dropdown-toggle > .btn:active {
      transform: scale(0.95) !important;
      background: var(--kr-bg-active) !important;
      opacity: 0.8 !important;
    }
    
    /* Dropdown smiley/couleurs - doit apparaître PAR-DESSUS la modal */

    /* NOTE CRITIQUE: Bootstrap JS force position:fixed dynamiquement */

    /* Solution: Sélecteur ultra-spécifique + !important pour override Bootstrap */
    body.mobile-mode .bootbox.modal .btn-toolbar .dropdown .dropdown-menu,
    body.mobile-mode .bootbox.modal .btn-toolbar .dropdown-menu {
      max-width: 90vw !important;
      max-height: 50vh !important;
      overflow-y: auto !important;
      padding: 12px !important;

      /* CRITIQUE: Garder position: absolute pour le positionnement relatif Bootstrap */

      /* Bootstrap JS essaie de forcer position:fixed - on l'override ici */
      position: absolute !important;

      /* z-index élevé pour passer au-dessus du footer modal */
      z-index: 10000 !important;

      /* Forcer l'affichage VERS LE HAUT (dropup behavior) */
      bottom: 100% !important;
      top: auto !important;

      /* Petit espace entre le bouton et le dropdown */
      margin-bottom: 4px !important;
    }
    
    /* CRITIQUE: Forcer display: block quand le dropdown est ouvert */
    body.mobile-mode .bootbox.modal .btn-toolbar .dropdown.open .dropdown-menu,
    body.mobile-mode .bootbox.modal .btn-toolbar .dropdown:has([aria-expanded="true"]) .dropdown-menu {
      display: block !important;
    }
    
    /* SOLUTION: Forcer tous les parents à ne PAS créer de contexte d'empilement */

    /* Cela permet au dropdown avec z-index: 10000 de passer au-dessus du footer */
    body.mobile-mode .bootbox.modal .modal-dialog,
    body.mobile-mode .bootbox.modal .modal-content,
    body.mobile-mode .bootbox.modal .modal-body,
    body.mobile-mode .bootbox.modal .modal-footer,
    body.mobile-mode .bootbox.modal .btn-toolbar,
    body.mobile-mode .bootbox.modal .dropdown {
      /* Enlever TOUTES les propriétés qui créent un nouveau contexte d'empilement */
      transform: none !important;
      filter: none !important;
      perspective: none !important;
      will-change: auto !important;
      contain: none !important;

      /* NE PAS mettre de z-index ici, sinon ça crée un nouveau contexte */
      z-index: auto !important;
    }
    
    /* CRITIQUE: Forcer overflow: visible sur les parents pour ne PAS couper le dropdown */
    body.mobile-mode .bootbox.modal .modal-content,
    body.mobile-mode .bootbox.modal .modal-body,
    body.mobile-mode .bootbox.modal .panel-body {
      overflow: visible !important;
    }
    
    /* La modal racine doit garder son z-index pour le backdrop */
    body.mobile-mode .bootbox.modal {
      z-index: 1050 !important;
    }
    
    body.mobile-mode .bootbox.modal .btn-toolbar .dropdown-menu table {
      width: 100% !important;
    }
    
    body.mobile-mode .bootbox.modal .btn-toolbar .dropdown-menu table td a {
      min-width: 44px !important;
      min-height: 44px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    /* Backdrop du dropdown sous le dropdown lui-même */
    body.mobile-mode .bootbox.modal .dropdown-backdrop {
      z-index: 1049 !important;
    }
    
    /* ===== 7. TEXTAREA - 120px min + compteur visible ===== */
    body.mobile-mode .bootbox.modal textarea#message,
    body.mobile-mode .bootbox.modal textarea.form-control {
      font-size: 16px !important;
      line-height: 1.5 !important;
      padding: 12px !important;
      border-radius: 8px !important;
      min-height: 120px !important;
      border: 2px solid var(--kr-border-default) !important;
      transition: border-color 0.2s ease !important;
    }
    
    body.mobile-mode .bootbox.modal textarea#message:focus,
    body.mobile-mode .bootbox.modal textarea.form-control:focus {
      border-color: var(--kr-primary) !important;
      outline: none !important;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1) !important;
    }
    
    /* Compteur */
    body.mobile-mode .bootbox.modal .pull-right:has(#car),
    body.mobile-mode .bootbox.modal #car {
      font-size: 13px !important;
      font-weight: 500 !important;
      color: var(--kr-text-secondary) !important;
      margin-top: 4px !important;
    }
    
    /* ===== 8. FOOTER - sticky avec bouton OK 2x ===== */
    body.mobile-mode .bootbox.modal .modal-footer {
      position: sticky !important;
      bottom: 0 !important;
      display: flex !important;
      gap: 10px !important;
      padding: 12px 16px !important;
      padding-bottom: max(12px, env(safe-area-inset-bottom)) !important;
      background: var(--kr-bg-surface) !important;
      border-top: 1px solid var(--kr-border-default) !important;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.08) !important;
      flex-shrink: 0 !important;
      margin: 0 !important;
      z-index: 100 !important; /* Sous le dropdown (z-index: 1050) */
    }
    
    body.mobile-mode .bootbox.modal .modal-footer .btn {
      margin: 0 !important;
      min-height: 50px !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      border-radius: 8px !important;
      transition: all 0.2s ease !important;
      border: none !important;
    }
    
    /* Bouton Cancel - 1x */
    body.mobile-mode .bootbox.modal .modal-footer .btn-default {
      flex: 1 !important;
      order: 1 !important;
    }
    
    /* Bouton OK - 2x plus large */
    body.mobile-mode .bootbox.modal .modal-footer .btn-primary {
      flex: 2 !important;
      order: 2 !important;
      min-height: 52px !important;
    }
    
    body.mobile-mode .bootbox.modal .modal-footer .btn:active {
      transform: scale(0.97) !important;
    }
  }

/* ============================================================================
   MOBILE - PAGE PROFIL/INTERFACE
   ============================================================================ */
@media (width <= 767px) {
  /* Correction de l'affichage des sélecteurs de thème */
  body.mobile-mode #kr-tamper-theme-form .form-group {
    margin-bottom: 20px;
  }
  
  /* Grid pour les options de thème avec images */
  body.mobile-mode #kr-tamper-theme-form .form-group > div[style*="padding-left"] {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 12px !important;
    padding: 0 !important;
  }
  
  /* Chaque option de thème (conteneur label + image) */
  body.mobile-mode #kr-tamper-theme-form .form-group > div > div {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 8px !important;
    padding: 12px !important;
    background: rgba(255, 255, 255, 0.05) !important;
    border-radius: 8px !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  
  /* Cacher l'icône float left qui crée un conflit */
  body.mobile-mode #kr-tamper-theme-form .form-group .lefticon {
    display: none !important;
  }
  
  /* Image de prévisualisation du thème */
  body.mobile-mode #kr-tamper-theme-form .form-group img {
    width: 100% !important;
    height: auto !important;
    display: block !important;
    border-radius: 4px !important;
    margin: 0 !important;
  }
  
  /* Label du thème */
  body.mobile-mode #kr-tamper-theme-form .form-group label {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    width: 100% !important;
    margin: 0 !important;
    cursor: pointer !important;
    font-size: 14px !important;
    line-height: 1.4 !important;
  }
  
  /* Radio button */
  body.mobile-mode #kr-tamper-theme-form .form-group input[type="radio"] {
    position: static !important;
    flex-shrink: 0 !important;
    margin: 0 !important;
    width: 20px !important;
    height: 20px !important;
  }
  
  /* Checkbox */
  body.mobile-mode #kr-tamper-theme-form .form-group input[type="checkbox"] {
    position: static !important;
    flex-shrink: 0 !important;
    margin: 0 !important;
    width: 20px !important;
    height: 20px !important;
  }
  
  /* Label principal de la section */
  body.mobile-mode #kr-tamper-theme-form .form-group > label.control-label {
    font-size: 16px !important;
    font-weight: 600 !important;
    margin-bottom: 12px !important;
    display: block !important;
    width: 100% !important;
  }

  /* ============================================================================
     FORUM RP - TRANSFORMATION EN CARDS STYLE REDDIT EXPLORE
     Inspiré de la section "Recommandées pour toi" de Reddit
     ============================================================================ */
  
  /* Conteneur principal du forum */
  body.mobile-mode .panel-default {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  /* Header du panel - titre "Jeu (RP)" */
  body.mobile-mode .panel-default > .panel-heading {
    background: var(--kr-bg-surface) !important;
    border: none !important;
    border-radius: var(--mobile-radius) !important;
    padding: var(--mobile-spacing-lg) !important;
    margin-bottom: var(--mobile-spacing-md) !important;
    align-items: center !important;
  }
  
  body.mobile-mode .panel-default > .panel-heading h3 {
    font-size: 20px !important;
    font-weight: 700 !important;
    margin: 0 !important;
    color: var(--kr-text-primary) !important;
  }
  
  /* Cacher le header du tableau (colonnes) */
  body.mobile-mode .panel-default .table > thead {
    display: none !important;
  }
  
  /* Transformer le tbody en container flex vertical */
  body.mobile-mode .panel-default .table > tbody {
    display: flex !important;
    flex-direction: column !important;
    gap: 4px !important;
  }
  
  /* Chaque ligne devient une card avec CSS Grid pour contrôler l'ordre d'affichage */
  body.mobile-mode .panel-default .table > tbody > tr {
    display: grid !important;
    grid-template-columns: 1fr !important;
    grid-template-rows: auto !important;
    background: var(--kr-bg-surface) !important;
    border: 1px solid var(--kr-border-default) !important;
    border-radius: 8px !important;
    padding: 6px !important;
    box-shadow: var(--kr-shadow-sm) !important;
    transition: all var(--transition-fast) !important;
    position: relative !important;
    min-height: auto !important;
  }
  
  /* Effet au tap sur la card */
  body.mobile-mode .panel-default .table > tbody > tr:active {
    background: var(--kr-bg-hover) !important;
    transform: scale(0.98) !important;
  }
  
  /* === RÉORGANISATION DES CELLULES AVEC GRID === */

  /* Utiliser grid-row pour contrôler l'ordre d'affichage */
  body.mobile-mode .panel-default .table > tbody > tr > td {
    display: block !important;
    border: none !important;
    padding: 0 !important;
    width: 100% !important;
  }
  
  /* td:first-child à la ligne 1 (contient titre, mods, description) */

  /* === CELLULE 1 : Titre, Modérateurs, (Description cachée ici) === */

  /* Cette cellule contient 3 éléments dont on doit cacher la description pour la réafficher plus tard */
  body.mobile-mode .panel-default .table > tbody > tr > td:first-child {
    display: flex !important;
    flex-direction: column !important;
    grid-row: 1 !important;
  }
  
  /* td:nth-child(2) et td:nth-child(3) (stats) à la ligne 2 */
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(2),
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(3) {
    grid-row: 2 !important;
  }
  
  /* td:nth-child(4) (dernier message) à la ligne 4 */
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(4) {
    grid-row: 4 !important;
  }
  
  /* === TITRE DU FORUM === */
  body.mobile-mode .panel-default .table > tbody > tr > td:first-child > p:first-child {
    order: 1 !important;
    margin: 0 !important;
    font-size: 0 !important; /* Masquer le texte brut "→" */
  }
  
  body.mobile-mode .panel-default .table > tbody > tr > td:first-child > p:first-child > a {
    font-size: 15px !important;
    font-weight: 700 !important;
    color: var(--kr-text-primary) !important;
    text-decoration: none !important;
    line-height: 1.1 !important;
    display: block !important;
  }
  
  body.mobile-mode .panel-default .table > tbody > tr > td:first-child > p:first-child > a:active {
    color: var(--kr-primary) !important;
  }
  
  /* === MODÉRATEURS === */

  /* Afficher les modérateurs juste après le titre */
  body.mobile-mode .panel-default .table > tbody > tr > td:first-child > span.tagforum {
    order: 2 !important;
    margin: 0 !important;
    font-size: 11px !important;
    color: var(--kr-text-secondary) !important;
    line-height: 1.2 !important;
  }
  
  body.mobile-mode .panel-default .table > tbody > tr > td:first-child > span.tagforum > .lefticon {
    display: none !important;
  }
  
  body.mobile-mode .panel-default .table > tbody > tr > td:first-child > span.tagforum a {
    color: var(--kr-text-secondary) !important;
    text-decoration: none !important;
    font-weight: 500 !important;
  }
  
  body.mobile-mode .panel-default .table > tbody > tr > td:first-child > span.tagforum a:active {
    color: var(--kr-primary) !important;
    text-decoration: underline !important;
  }
  
  /* === DESCRIPTION === */

  /* La description est maintenant dans un wrapper créé par JavaScript */
  body.mobile-mode .panel-default .table > tbody > tr > td:first-child > p:nth-child(2),
  body.mobile-mode .panel-default .table > tbody > tr > .forum-description-wrapper > p {
    order: 999 !important;
    font-size: 12px !important;
    color: var(--kr-text-secondary) !important;
    line-height: 1.2 !important;
    margin: 0 !important;
  }
  
  /* Description wrapper */
  body.mobile-mode .panel-default .table > tbody > tr > .forum-description-wrapper {
    margin: 0 0 6px !important;
  }
  
  /* === CELLULE 2 & 3 : Stats (Sujets et Messages) === */

  /* Les stats sont maintenant dans un wrapper créé par JavaScript */
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(2),
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(3),
  body.mobile-mode .panel-default .table > tbody > tr > .forum-stats-wrapper > td {
    display: inline !important;
    font-size: 11px !important;
    color: var(--kr-text-secondary) !important;
    order: 2 !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Stats wrapper */
  body.mobile-mode .panel-default .table > tbody > tr > .forum-stats-wrapper {
    margin: 0 0 2px !important;
  }
  
  /* Ajouter "sujets · " après le premier nombre */
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(2)::after,
  body.mobile-mode .panel-default .table > tbody > tr > .forum-stats-wrapper > td:first-child::after {
    content: " sujets · " !important;
  }
  
  /* Ajouter "messages" après le second nombre */
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(3)::after,
  body.mobile-mode .panel-default .table > tbody > tr > .forum-stats-wrapper > td:nth-child(2)::after {
    content: " messages" !important;
  }
  
  /* === CELLULE 4 : Dernier message === */

  /* Maintenant que le DOM est réorganisé, la cellule du dernier message est à la fin */
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(4),
  body.mobile-mode .panel-default .table > tbody > tr > td:last-child {
    order: 5 !important;
    padding-top: 3px !important;
    border-top: 1px solid var(--kr-border-default) !important;
    margin-top: 0 !important;
    font-size: 11px !important;
    color: var(--kr-text-secondary) !important;
    display: block !important;
  }
  
  /* Préfixe "→" avant l'auteur */
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(4)::before,
  body.mobile-mode .panel-default .table > tbody > tr > td:last-child::before {
    content: "→ " !important;
    color: var(--kr-text-secondary) !important;
    font-weight: 400 !important;
    margin-right: 4px !important;
  }
  
  /* Auteur du dernier message - inline */
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(4) > a,
  body.mobile-mode .panel-default .table > tbody > tr > td:last-child > a {
    font-size: 12px !important;
    font-weight: 500 !important;
    color: var(--kr-text-primary) !important;
    text-decoration: none !important;
    display: inline !important;
  }
  
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(4) > a:active,
  body.mobile-mode .panel-default .table > tbody > tr > td:last-child > a:active {
    color: var(--kr-primary) !important;
    text-decoration: underline !important;
  }
  
  /* Séparateur avant le timestamp */
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(4) > a::after,
  body.mobile-mode .panel-default .table > tbody > tr > td:last-child > a::after {
    content: " · " !important;
    color: var(--kr-text-muted) !important;
    font-weight: 400 !important;
  }
  
  /* Timestamp et lien vers le message - inline, pas de bouton */
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(4) > p,
  body.mobile-mode .panel-default .table > tbody > tr > td:last-child > p {
    display: inline !important;
    margin: 0 !important;
    font-size: 13px !important;
    color: var(--kr-text-secondary) !important;
  }
  
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(4) > p > a,
  body.mobile-mode .panel-default .table > tbody > tr > td:last-child > p > a {
    color: var(--kr-text-secondary) !important;
    text-decoration: none !important;
    display: inline-flex !important;
    align-items: center !important;
    background: none !important;
    border: none !important;
    padding: 0 !important;
    box-shadow: none !important;
    min-width: 20px !important;
    min-height: 20px !important;
  }
  
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(4) > p > a:active,
  body.mobile-mode .panel-default .table > tbody > tr > td:last-child > p > a:active {
    color: var(--kr-primary) !important;
  }
  
  /* Icône flèche dans le lien vers le message - 20x20px */
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(4) > p > a .glyphicon,
  body.mobile-mode .panel-default .table > tbody > tr > td:last-child > p > a .glyphicon {
    display: inline-block !important;
    width: 20px !important;
    height: 20px !important;
    font-size: 14px !important;
    line-height: 20px !important;
    vertical-align: middle !important;
  }
  
  /* Badges/images dans les noms d'utilisateurs */
  body.mobile-mode .panel-default .table > tbody > tr > td:nth-child(4) img {
    vertical-align: middle !important;
    margin: 0 2px !important;
    max-height: 16px !important;
  }
}

/* ============================================================================
   MOBILE MENU DROPDOWNS - Bootstrap 3 native handling
   ============================================================================ */
@media (width <= 767px) {
  /* EN MOBILE : Afficher les dropdown-menu avec la structure Bootstrap 3 */
  
  /* Les dropdown-menu doivent être visibles quand le parent a la classe 'open' */
  .navbar-collapse .dropdown.open > .dropdown-menu {
    display: block !important;
    position: static !important;
    float: none !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;
    background-color: transparent !important;
  }
  
  /* Styling des items dans le dropdown */
  .navbar-collapse .dropdown.open > .dropdown-menu > li > a {
    display: block !important;
    padding: 10px 15px 10px 25px !important;
    clear: both !important;
    font-weight: 400 !important;
    line-height: 1.4286 !important;
    color: var(--kr-text-primary) !important;
    white-space: nowrap !important;
    background-color: transparent !important;
    border-left: 4px solid transparent !important;
  }
  
  .navbar-collapse .dropdown.open > .dropdown-menu > li > a:hover,
  .navbar-collapse .dropdown.open > .dropdown-menu > li > a:focus {
    color: var(--kr-text-primary) !important;
    background-color: rgba(0, 0, 0, 0.05) !important;
    border-left-color: var(--kr-primary) !important;
  }
  
  .navbar-collapse .dropdown.open > .dropdown-menu > li > a:active {
    color: var(--kr-primary) !important;
    background-color: rgba(0, 0, 0, 0.08) !important;
    border-left-color: var(--kr-primary) !important;
  }
  
  /* Dividers dans le dropdown */
  .navbar-collapse .dropdown.open > .dropdown-menu > .divider {
    height: 1px !important;
    margin: 9px 0 !important;
    background-color: var(--kr-border-default) !important;
  }
  
  /* Dropdown headers */
  .navbar-collapse .dropdown.open > .dropdown-menu > .dropdown-header {
    display: block !important;
    padding: 3px 15px 3px 25px !important;
    font-size: 12px !important;
    line-height: 1.4286 !important;
    color: var(--kr-text-muted) !important;
    white-space: nowrap !important;
    text-transform: uppercase !important;
    font-weight: 600 !important;
  }
  
  /* Active items in dropdown */
  .navbar-collapse .dropdown.open > .dropdown-menu > .active > a,
  .navbar-collapse .dropdown.open > .dropdown-menu > .active > a:hover,
  .navbar-collapse .dropdown.open > .dropdown-menu > .active > a:focus {
    color: var(--kr-primary) !important;
    background-color: rgba(0, 0, 0, 0.1) !important;
    border-left-color: var(--kr-primary) !important;
  }
  
  /* Bootstrap 3 collapse pour les items principaux du menu */
  .navbar-collapse .navbar-nav > li > a {
    padding: 15px !important;
  }
  
  /* Assurer que le caret du dropdown-toggle est visible */
  .navbar-collapse .dropdown > a.dropdown-toggle .caret {
    border-top-color: currentcolor !important;
    border-bottom-color: transparent !important;
  }
  
  /* Quand ouvert, inverser le caret */
  .navbar-collapse .dropdown.open > a.dropdown-toggle .caret {
    border-top-color: transparent !important;
    border-bottom-color: currentcolor !important;
    transform: rotate(180deg) !important;
  }
}


/* ========================================
   FORUM CARDS MOBILE
   Design cards-based pour liste des forums
   ======================================== */

/* Container des cards */
.forums-cards-container {
  display: none; /* Caché par défaut (desktop) */
  padding: 12px 8px;
  background: var(--kr-bg-page);
}

/* Affichage mobile uniquement */
.mobile-mode .forums-cards-container {
  display: block;
}

/* Masquer le tableau sur mobile */
.mobile-mode table[data-mobile-hidden="true"] {
  display: none !important;
}

/* === CARD COMPONENT === */

.forum-card {
  background: var(--kr-bg-surface);
  border-radius: 12px;
  margin: 0 12px 12px;
  box-shadow: var(--kr-shadow-sm);
  transition: box-shadow 0.2s ease, transform 0.1s ease;
  overflow: hidden;
  border: 1px solid var(--kr-border-default);
}

/* Forcer l'alignement à gauche pour TOUS les descendants */
.forum-card *,
.forum-card-link *,
.forum-card-header *,
.forum-footer * {
  text-align: left !important;
}

.forum-card:active {
  transform: scale(0.98);
  box-shadow: var(--kr-shadow-md);
}

.forum-card-link {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  padding: 16px;
  text-decoration: none;
  color: inherit;
  
  /* Touch target minimum 44px */
  min-height: 100px;
  
  /* Active state feedback */
  -webkit-tap-highlight-color: rgba(139, 15, 14, 0.05);
}

.forum-card-link:hover,
.forum-card-link:focus {
  text-decoration: none;
  color: inherit;
}

/* === HEADER === */

.forum-card-header {
  margin-bottom: 8px;
  text-align: left;
}

.forum-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--kr-text-primary);
  line-height: 1.3;
  margin: 0;
  padding: 0;
  text-align: left !important;
}

/* === DESCRIPTION === */

.forum-description {
  font-size: 14px;
  color: var(--kr-text-secondary);
  line-height: 1.5;
  margin: 0 0 8px;
  text-align: left !important;
  
  /* Limitation à 2 lignes */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* === MODERATEURS === */

.forum-moderators {
  font-size: 12px;
  color: var(--kr-text-muted);
  margin: 0 0 10px;
  font-style: normal;
  font-weight: 400;
  text-align: left !important;
}

/* === FOOTER (Stats + Dernière activité) === */

.forum-footer {
  border-top: 1px solid var(--kr-border-default);
  padding-top: 10px;
  margin-top: auto;
  text-align: left !important;
}

.forum-stats {
  font-size: 13px;
  color: var(--kr-text-muted);
  margin-bottom: 6px;
  white-space: nowrap;
  text-align: left !important;
}

.forum-topics,
.forum-messages {
  font-weight: 600;
  color: var(--kr-text-secondary);
}

.forum-separator {
  margin: 0 4px;
  color: var(--kr-text-muted);
}

.forum-last-activity {
  font-size: 13px;
  color: var(--kr-text-secondary);
  line-height: 1.5;
  text-align: left !important;
}

.last-user {
  font-weight: 600;
  color: var(--kr-text-primary);
}

.last-time {
  color: var(--kr-text-muted);
  font-size: 12px;
}

/* === ÉTATS SPÉCIAUX === */

/* Forum sans activité */
.forum-card:has(.forum-topics:empty) {
  opacity: 0.6;
}

/* Accessibilité: focus visible */
.forum-card-link:focus {
  outline: 2px solid #2196F3;
  outline-offset: 2px;
}

/* === MINI-CHAT FAB === */

.mini-chat-fab {
  position: fixed;
  bottom: 80px;
  right: 16px;
  width: 56px;
  height: 56px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.3s ease;
}

.mini-chat-fab:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.mini-chat-fab.active {
  background: #f44336;
}

.mini-chat-fab .fab-text {
  display: block;
  line-height: 1;
}

/* Mini-chat en overlay fullscreen */
.mobile-mode .mini-chat-overlay {
  position: fixed !important;
  inset: 56px 0 0 !important; /* Sous le header */
  width: 100% !important;
  height: auto !important;
  z-index: 999 !important;
  background: white;
}

/* === RESPONSIVE === */

/* Tablettes en mode portrait */
@media (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .forum-card {
    margin: 12px 24px;
  }
  
  .forum-card-link {
    padding: 20px;
  }
}

/* Desktop: désactiver les cards */
@media (width >= 768px) {
  .forums-cards-container {
    display: none !important;
  }
  
  table[data-mobile-hidden="true"] {
    display: table !important;
  }
  
  .mini-chat-fab {
    display: none;
  }
}

/* ============================================================================
   MOBILE OPTIMISATION - FORUM SUJETS (DataTables)
   ============================================================================ */

@media (max-width: 767px) {
  
  /* === CONTRÔLES DATATABLE (Recherche, Affichage, Pagination) === */
  
  /* Wrapper général */
  .dataTables_wrapper {
    padding: 0 !important;
  }
  
  /* Section contrôles haut (Afficher X lignes + Recherche) */
  .dataTables_length,
  .dataTables_filter {
    display: block !important;
    width: 100% !important;
    margin: 0 0 var(--mobile-spacing-md) !important;
    text-align: left !important;
    float: none !important;
  }
  
  /* Label "Afficher lignes" */
  .dataTables_length label {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    font-size: 14px !important;
    margin: 0 !important;
  }
  
  /* Dropdown "Afficher X lignes" - WCAG 2.5.5 (44px min) */
  .dataTables_length select {
    min-height: var(--mobile-touch-target) !important;
    padding: 10px 32px 10px 12px !important;
    font-size: 16px !important; /* Évite zoom iOS */
    border: 1px solid var(--kr-border-default) !important;
    border-radius: var(--mobile-radius) !important;
    background-color: var(--kr-bg-surface) !important;
    flex: 0 0 auto !important;
    min-width: 80px !important;
  }
  
  /* Label recherche */
  .dataTables_filter label {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    width: 100% !important;
    margin: 0 !important;
    font-size: 14px !important;
  }
  
  /* Input recherche - WCAG 2.5.5 (44px min) */
  .dataTables_filter input {
    flex: 1 !important;
    min-height: var(--mobile-touch-target) !important;
    padding: 10px 16px !important;
    font-size: 16px !important; /* Évite zoom iOS */
    border: 1px solid var(--kr-border-default) !important;
    border-radius: var(--mobile-radius) !important;
    background-color: var(--kr-bg-surface) !important;
    width: 100% !important;
  }
  
  /* Focus sur inputs */
  .dataTables_filter input:focus,
  .dataTables_length select:focus {
    outline: 2px solid var(--kr-primary) !important;
    outline-offset: 2px !important;
    border-color: var(--kr-primary) !important;
  }
  
  /* === TABLEAU → CARDS === */
  
  /* Masquer le header du tableau */
  table.dataTable thead {
    display: none !important;
  }
  
  /* Transformer tbody en flex vertical */
  table.dataTable tbody {
    display: flex !important;
    flex-direction: column !important;
    gap: var(--mobile-spacing-md) !important;
  }
  
  /* Chaque <tr> devient une card */
  table.dataTable tbody tr {
    display: flex !important;
    flex-direction: column !important;
    background: var(--kr-bg-surface) !important;
    border: 1px solid var(--kr-border-default) !important;
    border-radius: var(--mobile-radius) !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: var(--kr-shadow-sm) !important;
    overflow: hidden !important;
    transition: box-shadow var(--transition-fast) !important;
  }
  
  /* Hover effect sur card (optionnel, pas prioritaire sur tactile) */
  table.dataTable tbody tr:hover {
    box-shadow: var(--kr-shadow-md) !important;
  }
  
  /* === COLONNES VISIBLES === */
  
  /* Masquer colonnes Msg, Vus, Auteur, Dernier Message (affichées autrement) */
  table.dataTable tbody td:nth-child(2), /* Msg */
  table.dataTable tbody td:nth-child(3), /* Vus */
  table.dataTable tbody td:nth-child(4), /* Auteur */
  table.dataTable tbody td:nth-child(5) /* Dernier Message */ {
    display: none !important;
  }
  
  /* Colonne Sujet (zone unique, comme Sujets permanents) */
  table.dataTable tbody td:nth-child(1) {
    display: flex !important;
    flex-direction: column !important;
    padding: var(--mobile-spacing-md) !important;
    min-height: var(--mobile-touch-target) !important;
    gap: var(--mobile-spacing-sm) !important;
  }
  
  /* === ZONE 1 : TITRE DU SUJET === */
  
  /* Conteneur titre + icône non-lu */
  table.dataTable tbody td:nth-child(1) p {
    display: flex !important;
    align-items: flex-start !important;
    gap: 8px !important;
    margin: 0 !important;
  }
  
  /* Titre du sujet (lien principal vers page 1) */
  table.dataTable tbody td:nth-child(1) p a {
    flex: 1 !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    line-height: 1.4 !important;
    color: var(--kr-text-primary) !important;
    text-decoration: none !important;
    display: block !important;
    padding: 4px 0 !important;
  }
  
  /* Feedback tactile sur titre */
  table.dataTable tbody td:nth-child(1) p a:active {
    color: var(--kr-primary) !important;
    background-color: rgba(139, 15, 14, 0.05) !important;
  }
  
  /* === ICÔNES ET PAGINATION : MASQUÉES === */
  
  /* Masquer l'icône folder-open (1ère UL) */
  table.dataTable tbody td:nth-child(1) > ul:first-of-type {
    display: none !important;
  }
  
  /* Masquer la pagination (2ème UL) */
  table.dataTable tbody td:nth-child(1) > ul:nth-of-type(2) {
    display: none !important;
  }
  
  /* === ZONE 1 : TITRE DU SUJET === */
  
  /* Titre du sujet */
  table.dataTable tbody td:nth-child(1) p {
    margin: 0 0 8px 0 !important;
    padding: 0 !important;
  }
  
  /* Lien titre */
  table.dataTable tbody td:nth-child(1) p a {
    font-size: 16px !important;
    font-weight: 600 !important;
    line-height: 1.4 !important;
    color: var(--kr-text-primary) !important;
    text-decoration: none !important;
    display: block !important;
  }
  
  /* Feedback tactile sur titre */
  table.dataTable tbody td:nth-child(1) p a:active {
    color: var(--kr-primary) !important;
    opacity: 0.7 !important;
  }
  
  /* Tags */
  table.dataTable tbody td:nth-child(1) .forum-tags {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 3px !important;
    margin-top: 6px !important;
  }
  
  table.dataTable tbody td:nth-child(1) .forum-tags .glyphicon {
    color: var(--kr-text-muted) !important;
    font-size: 8px !important;
  }
  
  table.dataTable tbody td:nth-child(1) .forum-tags a {
    display: inline-flex !important;
    align-items: center !important;
    padding: 1px 4px !important;
    font-size: 9px !important;
    color: var(--kr-text-secondary) !important;
    background: var(--kr-bg-hover) !important;
    border-radius: 2px !important;
    text-decoration: none !important;
    transition: all var(--transition-fast) !important;
  }
  
  table.dataTable tbody td:nth-child(1) .forum-tags a:active {
    background: var(--kr-bg-active) !important;
  }
  
  /* === BADGES STATS (Msg + Vus) === */
  
  .forum-topic-stats-mobile {
    display: flex !important;
    gap: 8px !important;
    margin-top: 8px !important;
    flex-wrap: wrap !important;
  }
  
  .badge-stat {
    display: inline-flex !important;
    align-items: center !important;
    gap: 5px !important;
    padding: 5px 10px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    color: var(--kr-text-secondary) !important;
    border-radius: 6px !important;
    transition: all var(--transition-fast) !important;
  }
  
  .badge-stat i {
    font-size: 12px !important;
  }
  
  .badge-messages {
    background: rgba(33, 150, 243, 0.1) !important;
    border: 1px solid rgba(33, 150, 243, 0.2) !important;
    color: #1976d2 !important;
  }
  
  .badge-views {
    background: rgba(76, 175, 80, 0.1) !important;
    border: 1px solid rgba(76, 175, 80, 0.2) !important;
    color: #388e3c !important;
  }
  
  /* === ZONE 2 : DERNIER MESSAGE === */
  
  /* Lien auteur */
  table.dataTable tbody td:nth-child(5) a:first-child {
    font-size: 14px !important;
    font-weight: 600 !important;
    color: var(--kr-text-primary) !important;
    text-decoration: none !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
  }
  
  /* Image nation dans auteur */
  table.dataTable tbody td:nth-child(5) a:first-child img {
    width: 16px !important;
    height: 16px !important;
    vertical-align: middle !important;
  }
  
  /* Paragraphe date/heure */
  table.dataTable tbody td:nth-child(5) p {
    font-size: 13px !important;
    color: var(--kr-text-muted) !important;
    margin: 0 !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
  }
  
  /* Icône lien vers message */
  table.dataTable tbody td:nth-child(5) p a .glyphicon {
    font-size: 12px !important;
    color: var(--kr-primary) !important;
  }
  
  /* Feedback tactile zone dernier message */
  table.dataTable tbody td:nth-child(5):active {
    background: var(--kr-bg-active) !important;
  }
  
  /* === AFFICHER STATS (Msg + Vus) EN BADGES === */
  
  /* Créer un conteneur pour stats après le titre */
  table.dataTable tbody td:nth-child(1)::after {
    content: '';
    display: none; /* On va gérer ça avec JS si besoin */
  }
  
  /* === PAGINATION === */
  
  /* Wrapper pagination */
  .dataTables_paginate {
    display: flex !important;
    justify-content: center !important;
    gap: var(--mobile-spacing-sm) !important;
    margin-top: var(--mobile-spacing-lg) !important;
    padding: 0 !important;
  }
  
  /* Boutons Précédent/Suivant - WCAG 2.5.5 (44px min) */
  .dataTables_paginate .paginate_button {
    min-height: var(--mobile-touch-target) !important;
    min-width: var(--mobile-touch-target) !important;
    padding: 10px 16px !important;
    font-size: 16px !important;
    border: 1px solid var(--kr-border-default) !important;
    border-radius: var(--mobile-radius) !important;
    background: var(--kr-bg-surface) !important;
    color: var(--kr-text-primary) !important;
    text-decoration: none !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: all var(--transition-fast) !important;
  }
  
  /* État actif */
  .dataTables_paginate .paginate_button.current {
    background: var(--kr-primary) !important;
    color: white !important;
    border-color: var(--kr-primary) !important;
    font-weight: 600 !important;
  }
  
  /* État désactivé */
  .dataTables_paginate .paginate_button.disabled {
    opacity: 0.4 !important;
    cursor: not-allowed !important;
    pointer-events: none !important;
  }
  
  /* Feedback tactile */
  .dataTables_paginate .paginate_button:not(.disabled):not(.current):active {
    background: var(--kr-bg-active) !important;
    transform: scale(0.95) !important;
  }
  
  /* === INFO PAGINATION (Affiche X à Y de Z lignes) === */
  
  .dataTables_info {
    text-align: center !important;
    font-size: 14px !important;
    color: var(--kr-text-secondary) !important;
    margin-top: var(--mobile-spacing-md) !important;
    padding: 0 var(--mobile-spacing-md) !important;
  }
  
  /* === DARK MODE === */
  
  html[class*="-dark"] table.dataTable tbody tr {
    background: var(--kr-bg-surface) !important;
    border-color: var(--kr-border-default) !important;
  }
  
  html[class*="-dark"] table.dataTable tbody td:nth-child(1) {
    border-bottom-color: var(--kr-border-default) !important;
  }
  
  html[class*="-dark"] table.dataTable tbody td:nth-child(5) {
    background: rgba(255, 255, 255, 0.03) !important;
  }
  
  html[class*="-dark"] .dataTables_filter input,
  html[class*="-dark"] .dataTables_length select {
    background: var(--kr-bg-surface) !important;
    border-color: var(--kr-border-default) !important;
    color: var(--kr-text-primary) !important;
  }
  
  html[class*="-dark"] .dataTables_paginate .paginate_button {
    background: var(--kr-bg-surface) !important;
    border-color: var(--kr-border-default) !important;
    color: var(--kr-text-primary) !important;
  }
  
  /* ============================================================================
     MOBILE OPTIMISATION - MESSAGES DE FORUM (THREAD)
     Structure restructurée par JS:
     - Row 1: col-xs-4 (user) + col-xs-8 (boutons)
     - Row 2: col-xs-12 (contenu message)
     ============================================================================ */
  
  /* === STRUCTURE PRINCIPALE === */
  
  /* Container du post restructuré */
  ul.media-list.forum > li.media.forum-post-restructured {
    display: block !important;
    padding: 12px 8px !important;
    margin-bottom: 24px !important;
    list-style: none !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  
  /* Row 1: Header (user + boutons) */
  ul.media-list.forum > li.media .forum-header {
    margin-bottom: 12px !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    display: flex !important;
    flex-wrap: nowrap !important;
  }
  
  /* Row 2: Contenu */
  ul.media-list.forum > li.media .forum-content-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  
  /* === COLONNE 1: USER INFO === */
  
  .forum-user-section {
    padding: 0 8px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
  }
  
  /* Avatar */
  .forum-user-section img.avatar,
  .forum-user-section .user-info img:first-child {
    max-width: 80px !important;
    height: auto !important;
    border-radius: 4px !important;
    margin-bottom: 8px !important;
  }
  
  /* Nom d'utilisateur - sans ellipsis, wrap autorisé */
  .forum-user-section .cartouche strong,
  .forum-user-section strong a {
    font-size: 13px !important;
    line-height: 1.2 !important;
    display: block !important;
    white-space: normal !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    hyphens: auto !important;
    overflow: visible !important;
    text-overflow: clip !important;
    max-width: 100% !important;
    min-height: 0 !important;
  }
  
  /* Conteneur icône de rang + titre (inline) */
  .forum-user-section [data-kr-rank-title] {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 4px !important;
    flex-wrap: nowrap !important;
    margin-top: 4px !important;
    max-width: 100% !important;
  }
  
  .forum-user-section [data-kr-rank-title] img {
    flex-shrink: 0 !important;
    margin: 0 !important;
    max-width: 24px !important;
    max-height: 24px !important;
  }
  
  /* Titre de rang : inline sans ellipsis */
  .forum-user-section [data-kr-rank-title] strong {
    font-size: 10px !important;
    color: #bbb !important;
    font-weight: normal !important;
    white-space: normal !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    hyphens: auto !important;
    overflow: visible !important;
    text-overflow: clip !important;
    max-width: none !important;
    line-height: 1.3 !important;
    text-align: center !important;
    flex: 1 1 auto !important;
    min-width: 0 !important;
  }
  
  /* Date mobile ajoutée par JS */
  .forum-user-section .post-date-mobile {
    font-size: 11px !important;
    color: #999 !important;
    margin-top: 4px !important;
    text-align: center !important;
  }
  
  /* Titre/fonction - ellipsis */
  .forum-user-section strong:not(.cartouche strong):not([data-kr-rank-title] strong) {
    font-size: 10px !important;
    color: #bbb !important;
    font-weight: normal !important;
    margin-top: 4px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    max-width: 100% !important;
  }
  
  /* === COLONNE 2: BOUTONS D'ACTION === */
  
  .forum-actions-section {
    padding: 0 8px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-end !important;
    gap: 8px !important;
  }
  
  /* Container des boutons */
  .forum-actions-section .pull-right {
    float: none !important;
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 8px !important;
    width: 100% !important;
  }
  
  /* Groupes de boutons inline */
  .forum-actions-section .btn-group {
    display: inline-flex !important;
    flex-direction: row !important;
    gap: 0 !important;
    flex-wrap: nowrap !important;
  }
  
  /* Boutons carrés 44x44px (WCAG touch target) */
  .forum-actions-section .btn {
    width: 44px !important;
    height: 44px !important;
    min-width: 44px !important;
    max-width: 44px !important;
    padding: 0 !important;
    margin: 0 !important;
    font-size: 14px !important;
    line-height: 44px !important;
    border: none !important;
    border-radius: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  /* Override Bootstrap min-width */
  .forum-actions-section .btn-group-xs > .btn,
  .forum-actions-section .btn-group-xs .btn {
    min-width: 44px !important;
  }
  
  /* Icônes des boutons */
  .forum-actions-section .btn i {
    font-size: 11px !important;
    line-height: 24px !important;
  }
  
  /* === ROW 2: CONTENU DU MESSAGE === */
  
  .forum-content-row {
    margin-top: 0 !important;
  }
  
  .forum-content-section {
    padding: 12px 8px !important;
    border-top: 1px dashed rgba(255, 255, 255, 0.15) !important;
    font-size: 15px !important;
    line-height: 1.6 !important;
    width: 100% !important;
  }
  
  /* Contenu du message */
  .forum-content-section .forum-msg,
  .forum-content-section > div {
    width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  /* Citations et blockquotes */
  .forum-content-section blockquote {
    margin: 8px 0 !important;
    padding: 8px 12px !important;
    border-left: 3px solid rgba(255, 255, 255, 0.2) !important;
    font-size: 14px !important;
  }
  
  /* Images dans le contenu */
  .forum-content-section img {
    max-width: 100% !important;
    height: auto !important;
  }
  
  /* Spoilers */
  .forum-content-section .spoiler {
    margin: 8px 0 !important;
  }
  
  /* Signature */
  .forum-content-section hr,
  .forum-content-section .signature {
    margin-top: 16px !important;
    padding-top: 16px !important;
    border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
    font-size: 12px !important;
    color: #999 !important;
}

/* ============================================================================
   11. NOUVEAU SUJET - MOBILE OPTIMIZATION
   Optimise la page "Poster un nouveau sujet" pour mobile
   - Toolbar BBCode horizontale scrollable
   - Inputs/buttons 44px minimum (touch target)
   - Font 16px pour éviter zoom iOS
   - Feedback visuel clair
   ============================================================================ */

@media (width <= 768px) {
  /* 0. LAYOUT - Fix Bootstrap grid overflow */
  
  /* Ajouter padding latéral pour ne pas coller au bord */
  .container,
  .container-fluid {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  
  /* Réinitialiser les colonnes Bootstrap pour mobile */
  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6,
  .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {
    float: none !important;
    width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  /* Réinitialiser les form-group qui contiennent les colonnes */
  .form-group {
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
    margin-bottom: var(--mobile-spacing-lg);
  }

  /* Réinitialiser input-group */
  .input-group {
    display: block !important;
    width: 100% !important;
  }

  /* CRÍTICA: Contenir les débordements de la toolbar dans le form-group */
  .form-group {
    overflow: hidden;
    width: 100%;
  }

  .form-group .col-md-10,
  .form-group .col-sm-10 {
    overflow: hidden;
  }

  /* 1. TOOLBAR BBCODE - Horizontal scrollable */
  
  .btn-toolbar {
    display: flex !important;           /* Override Bootstrap */
    flex-wrap: nowrap;                  /* Pas de wrapping */
    overflow-x: auto;                   /* Scrollbar horizontale */
    overflow-y: hidden;                 /* Pas de scrollbar verticale */
    gap: 4px;
    padding: 8px;
    margin-bottom: var(--mobile-spacing-md);
    background: rgba(0,0,0,0.02);
    border: 1px solid var(--kr-border-default);
    border-radius: var(--mobile-radius);
    -webkit-overflow-scrolling: touch;  /* iOS smooth scrolling */
    white-space: nowrap;                /* Empêche wrap des groupes */
  }

  /* Scrollbar styling (webkit browsers) */
  .btn-toolbar::-webkit-scrollbar {
    height: 4px;
  }

  .btn-toolbar::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.05);
    border-radius: 2px;
  }

  .btn-toolbar::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.15);
    border-radius: 2px;
  }

  /* Groupes de boutons - Layout horizontal */
  .btn-toolbar .btn-group {
    display: flex !important;           /* Override Bootstrap flex-column */
    flex-direction: row !important;
    flex-shrink: 0;                     /* Empêche compression */
    gap: 0;
    margin: 0 !important;
    margin-right: 8px;
    padding-right: 8px;
    border-right: 1px solid var(--kr-border-default);
  }

  .btn-toolbar .btn-group:last-child {
    margin-right: 0;
    padding-right: 0;
    border-right: none;
  }

  /* Boutons BBCode - Touch targets 44px */
  .btn-toolbar .btn {
    min-width: var(--mobile-touch-target) !important;
    width: var(--mobile-touch-target);
    height: var(--mobile-touch-target);
    padding: 0 !important;
    margin: 0 !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    font-size: 16px;                    /* Visible sur petit écran */
    border-radius: 6px;
    transition: all var(--transition-fast);
    flex-shrink: 0;
  }

  .btn-toolbar .btn:hover {
    background: rgba(139, 15, 14, 0.1);
    border-color: var(--kr-primary);
    color: var(--kr-primary);
  }

  .btn-toolbar .btn:active {
    background: rgba(139, 15, 14, 0.2);
    transform: scale(0.95);
  }

  .btn-toolbar .btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 15, 14, 0.1);
    border-color: var(--kr-primary);
  }

  /* 2. FORM CONTROLS - Inputs, textareas, selects */

  .form-control {
    font-size: 16px !important;         /* iOS zoom prevention - CRITIQUE */
    min-height: var(--mobile-touch-target) !important;
    padding: 12px var(--mobile-spacing-md) !important;
    border-radius: var(--mobile-radius) !important;
    line-height: 1.5;
  }

  .form-control:focus {
    outline: none;
    border-color: var(--kr-primary);
    box-shadow: 0 0 0 3px rgba(139, 15, 14, 0.1);
  }

  /* Textarea - Priorité message */
  textarea.form-control {
    min-height: 150px !important;
    font-family: monospace;
    resize: vertical;
    line-height: 1.6;
  }

  /* Select - Styled au même niveau */
  select.form-control {
    height: auto;
    min-height: var(--mobile-touch-target);
  }

  /* 3. FORM GROUPS - Stack vertical */

  .form-group {
    margin-bottom: var(--mobile-spacing-lg);
  }

  .form-group label {
    display: block;
    margin-bottom: var(--mobile-spacing-sm);
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--kr-text);
  }

  .form-group label .required {
    color: var(--kr-primary);
  }

  /* 4. CHECKBOXES - Inline avec spacing tactile */

  .form-group .checkbox {
    display: inline-flex;
    align-items: center;
    gap: var(--mobile-spacing-md);
    min-height: var(--mobile-touch-target);
    margin-right: var(--mobile-spacing-lg);
    margin-bottom: 0;
    padding: 8px 0;
  }

  .form-group .checkbox input[type="checkbox"] {
    width: 20px !important;
    height: 20px !important;
    min-width: 20px;
    min-height: 20px;
    margin: 0 !important;
    cursor: pointer;
    accent-color: var(--kr-primary);
    flex-shrink: 0;
  }

  .form-group .checkbox label {
    display: inline;
    margin: 0;
    font-weight: 500;
    cursor: pointer;
    font-size: 16px;
    text-transform: none;
    letter-spacing: normal;
    padding: 8px 0;
  }

  /* 5. BOUTON ENVOYER - Sticky footer */

  button.btn-primary.pull-right {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 90;
    width: 100% !important;
    height: 56px !important;
    margin: 0 !important;
    padding: 12px 16px !important;
    border-radius: 0 !important;
    font-size: 16px;
    font-weight: 600;
    border: none !important;
  }

  button.btn-primary.pull-right:active {
    background: var(--kr-primary-dark);
    transform: scale(0.98);
  }

  /* Padding au dernier form-group pour éviter overlap avec footer */
  .form-group:last-of-type {
    padding-bottom: 60px;
  }

  /* 6. ACCORDION/COLLAPSE - Options & Sondage */

  .panel-group {
    overflow: hidden;
    width: 100%;
  }

  .panel-title {
    font-size: 16px;
    margin: 0;
  }

  .accordion-toggle,
  a[data-toggle="collapse"] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--mobile-spacing-md) var(--mobile-spacing-lg);
    background: rgba(0,0,0,0.02);
    border: 1px solid var(--kr-border-default);
    border-radius: var(--mobile-radius);
    cursor: pointer;
    transition: all var(--transition-fast);
    min-height: var(--mobile-touch-target);
    text-decoration: none;
    color: var(--kr-text);
    font-weight: 500;
  }

  .accordion-toggle:hover,
  a[data-toggle="collapse"]:hover {
    background: rgba(139, 15, 14, 0.05);
    border-color: var(--kr-primary);
    color: var(--kr-primary);
  }

  .panel-collapse {
    border: 1px solid var(--kr-border-default);
    border-radius: var(--mobile-radius);
    margin-top: -1px;
  }

  .panel-body {
    padding: var(--mobile-spacing-lg);
  }
}
/* ============================================================================
   FORUM THREAD DETAIL - Hide tags
   ============================================================================ */

/* Masquer les tags dans la vue détail du fil (sujet) */
.forum-thread-detail > div:nth-of-type(2) {
  display: none;
}

/* Alternative: Cibler via la structure de la page forum */
.page-forum-sujet [role="main"] > div > div:nth-of-type(2) > div:nth-of-type(3) {
  display: none;
}

/* Fallback: Masquer les sections de tags générales dans les fils */
.forum-thread-metadata + div:has(a[href*="/forum/tags/"]) {
  display: none;
}`,
    ENABLE_KEY: 'kr-theme-enabled',
    VARIANT_KEY: 'kr-theme-variant',
    STATS_DISPLAY_KEY: 'kr-stats-display',
    STYLE_ID: 'kraland-theme-style',
    THEME_VARIANTS: ['kraland','empire-brun','paladium','theocratie-seelienne','paradigme-vert','khanat-elmerien','confederation-libre','royaume-ruthvenie','empire-brun-dark','paladium-dark','theocratie-seelienne-dark','paradigme-vert-dark','khanat-elmerien-dark','confederation-libre-dark','royaume-ruthvenie-dark','high-contrast'],
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
    }
  };

  // ============================================================================
  // UTILITAIRES
  // ============================================================================

  /** Exécute une fonction en silence (catch les erreurs) */
  function safeCall(fn) {
    try { fn(); } catch (_e) { /* ignore */ }
  }

  /** Vérifie si le thème est activé */
  function isThemeEnabled() {
    return localStorage.getItem(CONFIG.ENABLE_KEY) === 'true';
  }

  /** Récupère la variante de thème actuelle */
  function getVariant() {
    return localStorage.getItem(CONFIG.VARIANT_KEY) || 'kraland';
  }

  /** Récupère le mode d'affichage des caractéristiques ('icon' ou 'text') */
  function getStatsDisplayMode() {
    return localStorage.getItem(CONFIG.STATS_DISPLAY_KEY) || 'icon';
  }

  /** Vérifie si on est sur la page /jouer */
  function isPlatoPage() {
    const path = location?.pathname || '';
    return path.indexOf('/jouer') === 0 &&
           path !== '/jouer/communaute' &&
           path !== '/jouer/communaute/membres';
  }

  /** Crée un badge numérique pour les icônes de compétences (rouge, à droite) */
  function createBadge(text) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = text;
    Object.assign(badge.style, {
      position: 'absolute', top: '25px', right: '-8px',
      backgroundColor: '#d9534f', color: '#fff',
      borderRadius: '50%', width: '19px', height: '19px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: 'bold', border: '2px solid #fff'
    });
    return badge;
  }

  /** Crée un badge numérique pour les caractéristiques (bleu, en haut à gauche) */
  function createStatBadge(text) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = text;
    Object.assign(badge.style, {
      position: 'absolute', top: '25px', right: '-8px',
      backgroundColor: '#007bff', color: '#fff',
      borderRadius: '50%', width: '19px', height: '19px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: 'bold', border: '2px solid #fff'
    });
    return badge;
  }

  /** Crée un conteneur d'icône avec badge */
  function createIconContainer(iconUrl, altText, badgeText) {
    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'relative', display: 'inline-block',
      width: '32px', height: '32px'
    });

    const img = document.createElement('img');
    img.src = iconUrl;
    img.alt = altText;
    img.title = altText;
    Object.assign(img.style, { width: '32px', height: '32px', display: 'block' });
    container.appendChild(img);

    container.appendChild(createBadge(badgeText));
    return container;
  }

  /** Crée un conteneur d'icône avec badge pour caractéristiques */
  function _createStatIconContainer(iconUrl, altText, badgeText) {
    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'relative', display: 'inline-block',
      width: '32px', height: '32px'
    });

    const img = document.createElement('img');
    img.src = iconUrl;
    img.alt = altText;
    img.title = altText;
    Object.assign(img.style, { width: '32px', height: '32px', display: 'block' });
    container.appendChild(img);

    container.appendChild(createStatBadge(badgeText));
    return container;
  }

  // ============================================================================
  // INJECTION CSS IMMÉDIATE (avant tout code async)
  // ============================================================================
  (function injectCSSImmediately(){
    try {
      if (!isThemeEnabled()) {return;}

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
  // GESTION DU THÈME
  // ============================================================================

  async function applyThemeInline(cssText) {
    if (!isThemeEnabled()) {return false;}

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

      return true;
    } catch(e) {
      console.error('Theme apply failed', e);
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
        localStorage.setItem(CONFIG.ENABLE_KEY, 'false');
        if (!skipReload) {location.reload();}
        return;
      }

      const wasDisabled = !isThemeEnabled();
      localStorage.setItem(CONFIG.ENABLE_KEY, 'true');
      localStorage.setItem(CONFIG.VARIANT_KEY, variant);

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
    if (localStorage.getItem(CONFIG.ENABLE_KEY) === null) {
      localStorage.setItem(CONFIG.ENABLE_KEY, 'false');
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

  function applyDOMTransformations() {
    if (!isThemeEnabled()) {return;}

    const transforms = [
      markActiveIcons, replaceMcAnchors, replaceSImages, replaceNavbarBrand,
      reorderBtnGroupXs, ensureSexStrong, ensureFooterSticky, displayVersionInfo,
      relocateKramailToLeft, restructurePlatoColumns, moveBtnGroupToCols, moveSkillsPanelToCols,
      transformToBootstrapGrid, nameLeftSidebarDivs, transformSkillsToIcons,
      transformStatsToNotifications, ensureEditorClasses, ensurePageScoping,
      ensurePlayerMainPanelRows, addQuickAccessButtons, addRankTitles,
      disableTooltips, modifyNavigationMenus, window.updateForumRPMenu,
      window.updateForumHRPMenu, transformDashboardToFlexCards,
      applyFooterQuoteOption, handleDualLapClock
    ];

    transforms.forEach(fn => safeCall(fn));
  }

  function disableTooltips() {
    // Désactiver les tooltips:
    // 1. Sur mobile
    // 2. Si enfant de col-leftest ou panel-body grid-transformed

    document.querySelectorAll('[data-toggle="tooltip"]').forEach(el => {
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
    nameDiv.textContent = memberData.name;
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

      if (group.isMyGroup) {
        // Extraire le nom sans les icônes
        const titleText = group.title.replace(/\s*Groupe\s+/i, '');
        titleSpan.textContent = titleText || 'Mon groupe';
      } else {
        // Extraire le nom du groupe
        const titleText = group.title.replace(/\s*Groupe\s+/i, '');
        titleSpan.textContent = titleText || `Groupe de ${group.members[0]?.name || 'Inconnu'}`;
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
    const EXCLUDED_FORUMS = ['taverne', 'marché', 'monde'];

    /**
     * Extrait les forums de la page /forum/rp et les stocke dans localStorage
     * Exclut Taverne, Marché et Monde
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

    if (!document.body.classList.contains('mobile-mode')) {
      console.log('[Forum Cards] Mode desktop détecté, transformation annulée');
      return;
    }

    function transformTableToCards() {
      const forumTable = document.querySelector('table.table tbody');
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

    if (!document.body.classList.contains('mobile-mode')) {return;}

    function createChatFAB() {
      const miniChat = document.getElementById('flap');
      if (!miniChat) {return;}

      // Masquer le mini-chat par défaut sur mobile
      miniChat.style.display = 'none';
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
        const isOpen = miniChat.style.display === 'block';

        if (isOpen) {
          miniChat.style.display = 'none';
          fab.classList.remove('active');
          document.body.style.overflow = '';
        } else {
          miniChat.style.display = 'block';
          fab.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });

      // Bouton fermeture dans le chat
      const closeBtn = miniChat.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          miniChat.style.display = 'none';
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
  // MOBILE FORUM TOPICS - Stats + Smart Navigation
  // Layout identique aux "Sujets permanents" (simple et épuré)
  // Ajoute les stats (Msg · Vus) en texte simple sous le titre
  // Adapte le lien du titre selon l'état (non lu → premier non lu, lu → dernier message)
  // Rend toute la card cliquable (comme les Sujets permanents)
  // ============================================================================
  (function () {
    function enrichForumTopicsCards() {
      // N'exécuter qu'en mode mobile
      if (!document.body.classList.contains('mobile-mode')) {return;}

      // Cibler uniquement les DataTables de forum (pas les "Sujets permanents")
      const forumTable = document.querySelector('table.dataTable');
      if (!forumTable) {return;}

      const rows = forumTable.querySelectorAll('tbody tr');
      if (rows.length === 0) {return;}

      rows.forEach(row => {
        // Éviter le double traitement
        if (row.hasAttribute('data-stats-added')) {return;}
        row.setAttribute('data-stats-added', 'true');

        // Récupérer les cellules
        const titleCell = row.querySelector('td:nth-child(1)');
        const msgCell = row.querySelector('td:nth-child(2)');
        const viewsCell = row.querySelector('td:nth-child(3)');

        if (!titleCell || !msgCell || !viewsCell) {return;}

        // === SMART NAVIGATION ===
        // Détecter si l'icône "premier message non lu" existe
        const unreadIconLink = titleCell.querySelector('ul:first-of-type li a');
        const titleLink = titleCell.querySelector('p > a');
        
        if (unreadIconLink && titleLink) {
          // Sujet NON LU : rediriger le titre vers le premier message non lu
          titleLink.href = unreadIconLink.href;
          titleLink.setAttribute('data-smart-redirect', 'first-unread');
        }
        // Si pas d'icône (sujet lu), le titre garde son URL d'origine (page 1)

        // === CARD CLIQUABLE (comme Sujets permanents) ===
        if (titleLink) {
          row.style.cursor = 'pointer';
          
          row.addEventListener('click', (e) => {
            // Ne pas intercepter les clics sur les liens de tags
            if (e.target.tagName === 'A' || e.target.closest('a')) {
              return;
            }
            // Simuler le clic sur le titre
            titleLink.click();
          });
        }

        // === STATS SIMPLES (style "Sujets permanents") ===
        
        // Extraire les valeurs
        const msgCount = msgCell.textContent.trim();
        const viewsCount = viewsCell.textContent.trim();

        // Créer les stats avec icônes pour clarté
        const statsContainer = document.createElement('div');
        statsContainer.className = 'forum-topic-stats-mobile';
        statsContainer.innerHTML = `
          <i class="fa fa-comment" aria-hidden="true"></i> ${msgCount}
          <span style="margin: 0 4px;">·</span>
          <i class="fa fa-eye" aria-hidden="true"></i> ${viewsCount}
        `;
        statsContainer.style.cssText = `
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: var(--kr-text-secondary);
          margin-bottom: 8px;
        `;

        // Insérer après le titre
        const titleParagraph = titleCell.querySelector('p');
        if (titleParagraph) {
          titleParagraph.after(statsContainer);
        }
      });

      console.log(`[Forum Topics Mobile] ${rows.length} sujets enrichis`);
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

      console.log(`[Permanent Topics Mobile] Icônes ajoutées`);
    }

    InitQueue.register('PermanentTopics:Icons', enrichPermanentTopicsStats, 25);

  })();

  // ============================================================================
  // MODULE : ForumHeader:MobileBreadcrumb
  // Transforme le header forum en fil d'ariane + FAB button
  // ============================================================================
  (function() {
    'use strict';

    function transformForumHeader() {
      // Uniquement en mode mobile
      if (!document.body.classList.contains('mobile-mode')) {
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
      fab.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.92)';
        this.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.3)';
      });

      fab.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      });

      breadcrumbWrapper.appendChild(breadcrumbLeft);
      breadcrumbWrapper.appendChild(fab);

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
  // MODULE : ForumThread:MobileBreadcrumb
  // Transforme le header des threads de forum en fil d'ariane + FAB button
  // ============================================================================
  (function() {
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

      // Extraire le titre du thread (ignorer les nœuds texte vides)
      const threadTitle = Array.from(forumHeading.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        .map(node => node.textContent.trim())
        [0];

      if (!threadTitle) {
        console.warn('[Forum Thread Mobile] Titre du thread non trouvé');
        return;
      }

      // Trouver les liens dans le premier .forum-top
      const firstForumTop = forumTops[0];
      const taverneLink = firstForumTop.querySelector('a[href*="forum/rp/"], a[href*="forum/hrp/"]'); // Lien vers le forum parent
      const newTopicLink = firstForumTop.querySelector('a[href*="nouveau-sujet"]');

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
        threadTitleSpan.textContent = threadTitle;
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

        // Partie droite : bouton (+)
        const fab = document.createElement('a');
        fab.href = newTopicLink.href;
        fab.className = 'forum-new-topic-fab';
        fab.setAttribute('aria-label', 'Nouveau sujet');
        fab.innerHTML = '<span style="font-size: 24px; font-weight: 300; line-height: 1;">+</span>';
        fab.style.cssText = `
          width: 44px;
          height: 44px;
          min-width: 44px;
          flex-shrink: 0;
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
        fab.addEventListener('touchstart', function() {
          this.style.transform = 'scale(0.92)';
          this.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.3)';
        });

        fab.addEventListener('touchend', function() {
          this.style.transform = 'scale(1)';
          this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        });

        breadcrumbWrapper.appendChild(breadcrumbLeft);
        breadcrumbWrapper.appendChild(fab);

        return breadcrumbWrapper;
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
        forumTop.appendChild(createBreadcrumb(true));
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
      const forumTopActions = document.querySelectorAll('.forum-top a[href*="nouveau-sujet"], .forum-top a[href*="repondre"]');
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
  (function() {
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
  // MODULE : ForumPosts:Restructure
  // Restructure complètement le DOM des posts pour une mise en page Bootstrap propre
  // Row 1: col-xs-4 (user-info) + col-xs-8 (boutons)
  // Row 2: col-xs-12 (contenu message)
  // ============================================================================
  (function() {
    'use strict';

    const MOBILE_BREAKPOINT = 768;

    function restructureForumPosts() {
      // Uniquement en mode mobile (basé sur la largeur de l'écran)
      if (window.innerWidth >= MOBILE_BREAKPOINT) {
        return;
      }

      // Vérifier qu'on est sur une page de thread
      if (!window.location.pathname.includes('/forum/sujet/')) {
        return;
      }

      // Sélectionner tous les posts non-restructurés
      const posts = document.querySelectorAll('ul.media-list.forum > li.media:not([data-restructured])');
      
      if (posts.length === 0) {
        return;
      }

      posts.forEach(post => {
        // 1. Récupérer les éléments existants
        const userInfo = post.querySelector('.pull-left, .user-info');
        const pullRight = post.querySelector('.pull-right');
        const mediaBody = post.querySelector('.media-body');
        
        if (!userInfo || !mediaBody) {
          return;
        }
        
        // Sauvegarder TOUT le contenu de media-body avant modification
        const originalMediaBodyHTML = mediaBody.innerHTML;
        
        // 2. Créer Row 1 (header: user + boutons)
        const headerRow = document.createElement('div');
        headerRow.className = 'row forum-header';
        
        // Colonne 1: User info
        const userCol = document.createElement('div');
        userCol.className = 'col-xs-8 forum-user-section';
        
        // Cloner le userInfo pour le déplacer
        const userInfoClone = userInfo.cloneNode(true);
        userCol.appendChild(userInfoClone);
        
        // Extraire et ajouter la date depuis le bouton de date
        const dateButton = mediaBody.querySelector('.btn-group.btn-group-xs:first-child, div.btn-group.btn-group-xs:first-child');
        if (dateButton) {
          const dateText = dateButton.textContent.replace('posté', '').replace('modifié', '').trim();
          const dateElement = document.createElement('div');
          dateElement.className = 'post-date-mobile';
          dateElement.textContent = dateText;
          userCol.appendChild(dateElement);
        }
        
        // Colonne 2: Boutons d'action
        const actionsCol = document.createElement('div');
        actionsCol.className = 'col-xs-4 forum-actions-section';
        if (pullRight) {
          const pullRightClone = pullRight.cloneNode(true);
          actionsCol.appendChild(pullRightClone);
        }
        
        headerRow.appendChild(userCol);
        headerRow.appendChild(actionsCol);
        
        // 3. Créer Row 2 (contenu du message)
        const contentRow = document.createElement('div');
        contentRow.className = 'row forum-content-row';
        
        const contentCol = document.createElement('div');
        contentCol.className = 'col-xs-12 forum-content-section';
        
        // Créer un nouveau mediaBody temporaire pour extraire le contenu
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalMediaBodyHTML;
        
        // Retirer userInfo, pullRight, dateButton du tempDiv
        const tempUserInfo = tempDiv.querySelector('.pull-left, .user-info');
        const tempPullRight = tempDiv.querySelector('.pull-right');
        const tempDateButton = tempDiv.querySelector('.btn-group.btn-group-xs:first-child');
        
        if (tempUserInfo) tempUserInfo.remove();
        if (tempPullRight) tempPullRight.remove();
        if (tempDateButton) tempDateButton.remove();
        
        // Tout ce qui reste est le contenu du message
        contentCol.innerHTML = tempDiv.innerHTML;
        
        contentRow.appendChild(contentCol);
        
        // 4. Vider le post et reconstruire
        // Supprimer le .pull-left original (avatar dupliqué)
        if (userInfo && userInfo.parentElement === post) {
          userInfo.remove();
        }
        
        // Vider le mediaBody complètement
        mediaBody.innerHTML = '';
        
        // Insérer les nouvelles rows
        mediaBody.appendChild(headerRow);
        mediaBody.appendChild(contentRow);
        
        // 5. Marquer comme restructuré
        post.setAttribute('data-restructured', 'true');
        post.classList.add('forum-post-restructured');
      });

      console.log(`[Forum Restructure] ${posts.length} posts restructurés avec nouveau layout`);
    }

    InitQueue.register('ForumPosts:Restructure', restructureForumPosts, 26);

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
    const isMobileMode = document.body.classList.contains('mobile-mode');

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
        if (!isMobileMode) {
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
      if (!isMobileMode) {
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
    }

    // Ajout du menu Statistiques (une seule fois)
    const communauteItem = Array.from(document.querySelectorAll('.navbar-nav > li.dropdown'))
      .find(li => li.querySelector('a.dropdown-toggle')?.textContent.includes('Communauté'));

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
      if (!isMobileMode) {
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

    const all = Array.from(document.querySelectorAll('*'));
    markers.forEach(m => {
      let best = null;
      for (const el of all) {
        const txt = (el.textContent || '').trim();
        if (!txt.includes(m.text)) {continue;}
        const hasIcon = !!el.querySelector('i.fa, i.falarge, .glyphicon, svg');
        const score = (hasIcon ? 100 : 0) + Math.max(0, 200 - Math.min(txt.length, 200));
        if (!best || score > best.score) {best = { el, score };}
      }
      if (best?.el) {best.el.classList.add(m.cls);}
    });
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
    versionDiv.innerHTML = `<span>CSS : version courante <strong>${currentVersion}</strong>, dernière version <span id="latest-version">chargement...</span></span>`;

    // Déterminer l'URL du fichier version.json (serveur local en dev, GitHub en prod)
    const versionUrl = currentVersion === 'dev'
      ? 'http://localhost:4848/version.json'
      : 'https://raw.githubusercontent.com/arnaudroubinet/kraland-css/refs/heads/main/version.json';

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
          if (currentVersion !== 'dev' && data.version !== currentVersion) {
            latestSpan.innerHTML += ' <span style="color: #d9534f;">⚠️ (mise à jour disponible)</span>';
          } else if (currentVersion === 'dev') {
            latestSpan.innerHTML += ' <span style="color: #5bc0de;">ℹ️ (mode développement)</span>';
          }
        }
      })
      .catch(error => {
        console.error('[Version Info] Erreur lors de la récupération de la version:', error);
        const latestSpan = document.getElementById('latest-version');
        if (latestSpan) {
          if (currentVersion === 'dev') {
            latestSpan.innerHTML = '<em>serveur local requis (localhost:4848)</em>';
          } else {
            latestSpan.textContent = 'erreur';
          }
        }
      });
  }

  function relocateKramailToLeft() {
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
    if (headerSection && !headerSection.id) {headerSection.id = 'player-header-section';}

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
      item.className = originalClasses + ' btn btn-default mini';
      item.innerHTML = '';

      const iconContainer = createIconContainer(iconUrl, skillName, level);
      Object.assign(item.style, {
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '8px',
        width: '40px', height: '40px',
        minWidth: '40px', minHeight: '40px'
      });
      item.appendChild(iconContainer);
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
      statBtn.className = originalClasses + ' list-group-item ds_game';
      Object.assign(statBtn.style, {
        padding: '8px', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        width: '40px', height: '40px',
        minWidth: '40px', minHeight: '40px'
      });
      statBtn.title = cleanStatName;

      const displayMode = getStatsDisplayMode();

      // Créer le conteneur principal (toujours avec badge)
      const container = document.createElement('div');
      Object.assign(container.style, {
        position: 'relative', display: 'inline-block',
        width: '32px', height: '32px'
      });

      if (displayMode === 'text') {
        // Mode texte : afficher uniquement l'abréviation (3 lettres)
        const textSpan = document.createElement('span');
        textSpan.textContent = cleanStatName.substring(0, 3).toUpperCase();
        Object.assign(textSpan.style, {
          fontWeight: 'bold',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px'
        });
        container.appendChild(textSpan);
      } else {
        // Mode icône (par défaut)
        const iconCode = CONFIG.STAT_ICONS[cleanStatName];
        if (iconCode) {
          const iconUrl = `http://img7.kraland.org/2/mat/94/${iconCode}.gif`;
          const img = document.createElement('img');
          img.src = iconUrl;
          img.alt = cleanStatName;
          img.title = cleanStatName;
          Object.assign(img.style, {
            display: 'block', width: '32px', height: '32px'
          });
          container.appendChild(img);
        } else {
          // Fallback SVG
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('width', '32');
          svg.setAttribute('height', '32');
          svg.setAttribute('viewBox', '0 0 32 32');
          svg.style.display = 'block';

          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('width', '32');
          rect.setAttribute('height', '32');
          rect.setAttribute('fill', '#f0f0f0');
          rect.setAttribute('stroke', '#ccc');
          svg.appendChild(rect);

          const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          svgText.setAttribute('x', '16');
          svgText.setAttribute('y', '20');
          svgText.setAttribute('text-anchor', 'middle');
          svgText.setAttribute('font-size', '14');
          svgText.setAttribute('font-weight', 'bold');
          svgText.setAttribute('fill', '#333');
          svgText.textContent = cleanStatName.substring(0, 2).toUpperCase();
          svg.appendChild(svgText);

          container.appendChild(svg);
        }
      }

      // Toujours ajouter le badge de notification
      container.appendChild(createStatBadge(number));
      statBtn.appendChild(container);
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

    // Créer le conteneur principal avec le système de grille Bootstrap
    const container = document.createElement('div');
    container.className = 'kr-quick-access-buttons';
    container.style.marginTop = '10px';

    const row = document.createElement('div');
    row.className = 'row';

    // Créer chaque bouton avec une colonne Bootstrap (2 par ligne)
    buttons.forEach(btn => {
      const col = document.createElement('div');
      col.className = 'col-xs-6 col-sm-6';

      const link = document.createElement('a');
      link.href = btn.url;
      link.className = 'btn btn-default btn-block mini';

      const icon = document.createElement('i');
      icon.className = `fa ${btn.icon}`;

      link.appendChild(icon);
      link.appendChild(document.createTextNode(' ' + btn.label));

      col.appendChild(link);
      row.appendChild(col);
    });

    container.appendChild(row);

    // Ajouter les boutons à la fin du panneau
    panel.appendChild(container);
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
        <h4>Thème Tampermonkey (Activez le thème de base officiel pour éviter les conflits)</h4>
        <form id="kr-tamper-theme-form" class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-3 control-label">Choix du thème</label>
            <div class="col-sm-9">${radios}</div>
          </div>
          <div class="form-group">
            <label class="col-sm-3 control-label">Affichage des caractéristiques</label>
            <div class="col-sm-9">${statsDisplayRadios}</div>
          </div>
          <div class="form-group">
            <label class="col-sm-3 control-label">Options du footer</label>
            <div class="col-sm-9">${hideQuoteCheckbox}</div>
          </div>
        </form>
      `;

      if (target.parentElement) {
        target.parentElement.insertBefore(container, target);
      }

      const form = container.querySelector('#kr-tamper-theme-form');

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

          localStorage.setItem(CONFIG.STATS_DISPLAY_KEY, val);

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
    let domTransformationsApplied = false;

    const mo = new MutationObserver(() => {
      if (isThemeEnabled()) {
        if (!document.getElementById(CONFIG.STYLE_ID)) {
          applyThemeInline(CONFIG.BUNDLED_CSS).catch(() => {});
        }
        if (!domTransformationsApplied) {
          applyDOMTransformations();
          domTransformationsApplied = true;
        }
      }
      safeCall(insertToggleCSSButton);
    });

    mo.observe(document.documentElement || document, { childList: true, subtree: true });

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

    modalObserver.observe(document.body, { childList: true, subtree: false });
  }

  /**
   * Scroll automatiquement vers l'onglet actif dans les modals personnage
   * Surveille les mises à jour AJAX et maintient le scroll sur le bon onglet
   */
  function initModalTabScroll() {
    // Observer les changements dans les modals pour détecter les mises à jour AJAX
    const tabScrollObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Vérifier si c'est un changement de contenu dans une modal
        const modal = mutation.target.closest('.bootbox.modal');
        if (!modal) {return;}

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

    // Observer le body pour détecter les changements dans les modals
    tabScrollObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
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

    // Forcer le grid layout inline (contourner les règles Bootstrap)
    toolbar.style.setProperty('display', 'grid', 'important');
    toolbar.style.setProperty('grid-template-columns', 'repeat(6, 1fr)', 'important');
    toolbar.style.setProperty('gap', '4px', 'important');

    // Forcer display: contents sur TOUS les wrappers (.btn-group ET .dropdown)
    toolbar.querySelectorAll('.btn-group, .dropdown, span.dropdown').forEach(wrapper => {
      wrapper.style.setProperty('display', 'contents', 'important');
    });

    // Forcer les boutons (y compris ceux dans les dropdowns) à remplir leur cellule
    toolbar.querySelectorAll('.btn, span.dropdown > a > .btn, .dropdown > a > .btn, span.dropdown button, .dropdown button').forEach(btn => {
      btn.style.setProperty('width', '100%', 'important');
      btn.style.setProperty('min-width', '0', 'important');
      btn.style.setProperty('max-width', 'none', 'important');
    });

    console.log('[Order Modal] Toolbar grid forcé et whitespace nettoyé');
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
   * CRITIQUE: Force position:absolute sur les dropdowns pour contrer Bootstrap JS
   * Bootstrap 3 applique dynamiquement position:fixed sur les dropdowns, ce qui les
   * positionne en dehors du contexte de la modal. On force position:absolute pour
   * qu'ils restent relatifs à leur parent .dropdown et apparaissent au bon endroit.
   */
  function fixDropdownPosition(modal) {
    if (!modal) {return;}

    // Observer les dropdowns qui s'ouvrent
    const dropdownObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Vérifier si un dropdown a été ouvert (classe .open ajoutée)
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const dropdown = mutation.target;
          if (dropdown.classList.contains('dropdown') && dropdown.classList.contains('open')) {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            if (dropdownMenu) {
              // FORCE position:absolute pour override Bootstrap JS
              dropdownMenu.style.setProperty('position', 'absolute', 'important');
              dropdownMenu.style.setProperty('bottom', '100%', 'important');
              dropdownMenu.style.setProperty('top', 'auto', 'important');
              dropdownMenu.style.setProperty('left', '0', 'important');
              dropdownMenu.style.setProperty('margin-bottom', '4px', 'important');
              dropdownMenu.style.setProperty('z-index', '10000', 'important');
              console.log('[Order Modal] Dropdown position forcée à absolute');
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

    // NOUVELLE TRANSFORMATION : Optimiser la structure pour mobile
    transformOrderModalStructure(modal);

    // CRITIQUE: Fixer la position des dropdowns (couleurs/smileys)
    fixDropdownPosition(modal);

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
    enhanceTabsWithSwipe(modal);

    // Ajouter compteur de caractères aux textarea
    addCharCounterToTextareas(modal);

    // Ajouter feedback tactile
    addTouchFeedback(modal);
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
  function enhanceTabsWithSwipe(modal) {
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
    modalObserver.observe(document.body, { childList: true, subtree: false });
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

    // Gérer le redimensionnement de la fenêtre
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const nowMobile = window.innerWidth < 768;
        if (nowMobile !== isMobile) {
          location.reload(); // Recharger si on passe desktop <-> mobile
        }
      }, 250);
    });
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
  // INITIALISATION
  // ============================================================================

  (async function init() {
    try {
      const themeEnabled = getThemeState();

      // Nettoyage CSS orphelin
      const existingStyle = document.getElementById(CONFIG.STYLE_ID);
      if (!themeEnabled && existingStyle?.parentElement) {
        existingStyle.parentElement.removeChild(existingStyle);
      }

      // UI Controls (toujours)
      safeCall(insertToggleCSSButton);
      safeCall(insertTampermonkeyThemeUI);

      // Theme setup (si activé)
      if (themeEnabled) {
        await ensureTheme();

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', applyDOMTransformations, { once: true });
        } else {
          applyDOMTransformations();
        }
      }

      startObservers();

      // Activer le clic sur backdrop pour fermer les modals
      enableModalBackdropClick();

      // Initialiser les améliorations mobiles des modals personnage
      initCharacterModalMobile();

      // Gestion mobile : détection et fonctionnalités spécifiques
      initMobileFeatures();

      // Exécuter la queue d'initialisation mobile (ordre garanti)
      // Doit être appelé après DOMContentLoaded et après que mobile-mode soit défini
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => InitQueue.run(), { once: true });
      } else {
        InitQueue.run();
      }

      // Déplacer le style à la fin du head pour la priorité
      setTimeout(() => {
        const st = document.getElementById(CONFIG.STYLE_ID);
        if (isThemeEnabled() && st?.parentElement) {
          st.parentElement.appendChild(st);
        } else if (!isThemeEnabled() && st?.parentElement) {
          st.parentElement.removeChild(st);
        }
      }, 1000);

      // Désactiver les tooltips périodiquement
      setInterval(disableTooltips, 2000);

    } catch(e) {
      console.error('Kraland theme init failed', e);
    }
  })();
})();
