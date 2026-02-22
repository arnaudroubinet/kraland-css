// Main script code - CSS bundled inline
(function (){
  'use strict';

  // Version du userscript (sera remplacée par le build)
  const CURRENT_VERSION = '__USERSCRIPT_VERSION__';

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

      const isMobile = isMobileMode();
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

    // === Classe page-type basée sur l'URL ===
    // Utilisée en CSS pour scoper les règles kramail vs forum
    function addPageTypeClass() {
      if (!document.body) return;
      const path = window.location.pathname;
      if (path.includes('/kramail')) {
        document.body.classList.add('page-kramail');
        if (path.match(/\/kramail\/post\/nouveau/)) {
          document.body.classList.add('page-kramail-compose');
        }
      } else if (path.startsWith('/forum/')) {
        document.body.classList.add('page-forum');
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addPageTypeClass);
    } else {
      addPageTypeClass();
    }
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
      if (!isMobileMode()) {return;}

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

    // Enregistrer dans InitQueue avec priorité 5 (après initMobileMode à priorité 0)
    InitQueue.register('removeHomepageCarousel', removeHomepageCarousel, 5);

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
        // Taille réduite : 1/3 de largeur, affichage inline pour ne pas être full-width
        resetBtn.className = 'btn btn-warning kr-reset-alerts-btn';
        resetBtn.style.width = '33.333%';
        resetBtn.style.display = 'inline-block';

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
            resetBtn.appendChild(document.createTextNode(' ' + (count === 1 ? '1 alerte réinitialisée !' : `${count} alertes réinitialisées !`)));
            // Conserver la classe utilitaire pour garder la largeur réduite
            resetBtn.className = 'btn btn-success kr-reset-alerts-btn';
            // Mettre à jour le texte d'aide pour refléter le nouvel état
            updateHelpText();

            setTimeout(() => {
              icon.className = 'glyphicon glyphicon-refresh';
              resetBtn.textContent = '';
              resetBtn.appendChild(icon);
              resetBtn.appendChild(document.createTextNode(' Réinitialiser les alertes fermées'));
              resetBtn.className = 'btn btn-warning btn-block';
            }, 3000);
          }
        });

        // Ajouter une description (placée sur la même ligne que le bouton)
        const helpText = document.createElement('p');
        helpText.className = 'help-block';
        // Afficher sur la même ligne que le bouton et aligner verticalement
        helpText.style.display = 'inline-block';
        helpText.style.marginTop = '0';
        helpText.style.marginLeft = '10px';
        helpText.style.verticalAlign = 'middle';
        helpText.style.fontSize = '12px';
        helpText.style.opacity = '0.7';

        // Helper pour la gestion du singulier/pluriel
        function formatDismissedCount(n) {
          if (n === 0) return 'Aucune alerte actuellement masquée';
          if (n === 1) return '1 alerte actuellement masquée';
          return `${n} alertes actuellement masquées`;
        }

        function updateHelpText() {
          helpText.textContent = formatDismissedCount(getDismissedAlerts().length);
        }

        // Initialiser le texte
        updateHelpText();

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
  // Enregistrer l'initialisation du Commerce Accordion dans la queue pour éviter l'accès à document.body avant DOMContentLoaded
  InitQueue.register('Commerce Accordion', function initCommerceAccordion() {
    if (!isMobileMode()) {return;}
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
  });

  // ============================================================================
  // TASK-2.4 : Section bâtiment collapsible
  // ============================================================================
  InitQueue.register('Building Collapse', function initBuildingCollapse() {
    if (!isMobileMode()) {return;}

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
  });

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
    BUNDLED_CSS: '__CSS_CONTENT__',
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

    MEDIEVAL_SEPIA: '85%'
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

  /** Vérifie si la carte médiévale est activée */
  function isMedievalMapEnabled() {
    return localStorage.getItem(CONFIG.MEDIEVAL_MAP_KEY) === 'true';
  }

  // ---------------------------------------------------------------------------
  // Carte médiévale (remplacement d'images via JS)
  // - On n'utilise plus le CSS distant à la volée
  // - Règle générale: /2/map/1/ ou /2/map/1b/ -> /2/map/5/
  // - Exceptions: CONFIG.MEDIEVAL_MAP_OVERRIDES
  // ---------------------------------------------------------------------------

  function extractUrl(bg) {
    if (!bg) return null;
    const m = bg.match(/url\((?:'|")?(.*?)(?:'|")?\)/);
    return m ? m[1] : null;
  }

  function computeReplacement(src) {
    if (!src) return null;
    const overrides = CONFIG.MEDIEVAL_MAP_OVERRIDES || {};
    if (overrides[src]) { return overrides[src]; }
    if (src.indexOf('/2/map/1b/') !== -1) {
      return src.replace('/2/map/1b/', '/2/map/5/');
    }
    if (src.indexOf('/2/map/1/') !== -1) {
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
      function testImageExists(url) {
        if (_krTestCache.hasOwnProperty(url)) return Promise.resolve(!!_krTestCache[url]);
        return new Promise(resolve => {
          try {
            const img = new Image();
            img.onload = () => { _krTestCache[url] = true; resolve(true); };
            img.onerror = () => { _krTestCache[url] = false; resolve(false); };
            img.src = url;
          } catch (e) { _krTestCache[url] = false; resolve(false); }
        });
      }

      function processElement(el) {
        if (!el || (el.getAttribute && el.getAttribute(appliedAttr) === 'true') || (el.getAttribute && el.getAttribute('data-kr-medieval-pending') === 'true')) return;
        let src = null;
        if (el.tagName === 'IMG') {
          src = el.src || el.getAttribute('src');
        } else {
          const inlineBg = el.style && el.style.getPropertyValue('background-image') || '';
          const computedBg = inlineBg || (window.getComputedStyle && getComputedStyle(el).backgroundImage) || '';
          src = extractUrl(inlineBg) || extractUrl(computedBg);
        }
        if (!src) return;
        // Ne pas remplacer les URLs explicitement exclues
        if (CONFIG.MEDIEVAL_NO_REPLACE && CONFIG.MEDIEVAL_NO_REPLACE[src]) return;
        const target = computeReplacement(src);
        if (!target) return;

        // Marquer comme pending pour éviter les re-tests simultanés
        el.setAttribute && el.setAttribute('data-kr-medieval-pending', 'true');
        // sauvegarde des valeurs originales
        if (!el.hasAttribute || !el.hasAttribute(originalBgAttr)) {
          el.setAttribute(originalBgAttr, src);
        }
        const origFilter = (el.style && el.style.getPropertyValue('filter')) || '';
        if (!el.hasAttribute || !el.hasAttribute(originalFilterAttr)) {
          el.setAttribute(originalFilterAttr, origFilter);
        }

        // tester l'existence de la ressource cible avant d'appliquer
        testImageExists(target).then(exists => {
          if (exists) {
            if (el.tagName === 'IMG') {
              try { el.src = target; } catch (e) { el.setAttribute('src', target); }
            } else {
              el.style && el.style.setProperty && el.style.setProperty('background-image', 'url("' + target + '")', 'important');
            }
            if (src.indexOf('/2/map/1b/') !== -1) {
              el.style && el.style.setProperty && el.style.setProperty('filter', 'sepia(' + CONFIG.MEDIEVAL_SEPIA + ')', 'important');
            }
            el.setAttribute && el.setAttribute(appliedAttr, 'true');
          } else {
            // fallback: restaurer l'original si nécessaire (ne rien changer autrement)
            const elemOrig = el.getAttribute(originalBgAttr);
            if (el.tagName === 'IMG') {
              if (elemOrig) { try { el.src = elemOrig; } catch (e) { el.setAttribute('src', elemOrig); } }
            } else {
              if (elemOrig) { el.style && el.style.setProperty && el.style.setProperty('background-image', 'url("' + elemOrig + '")', 'important'); } else { el.style && el.style.removeProperty && el.style.removeProperty('background-image'); }
            }
            const origFilterAttrVal = el.getAttribute(originalFilterAttr);
            if (origFilterAttrVal) { el.style && el.style.setProperty && el.style.setProperty('filter', origFilterAttrVal, 'important'); } else { el.style && el.style.removeProperty && el.style.removeProperty('filter'); }
          }
          el.removeAttribute && el.removeAttribute('data-kr-medieval-pending');
        }).catch(_ => { el.removeAttribute && el.removeAttribute('data-kr-medieval-pending'); });
      }

      function restoreAll() {
        const els = document.querySelectorAll('[' + appliedAttr + '="true"]');
        els.forEach(el => {
          const origBg = el.getAttribute(originalBgAttr);
          if (el.tagName === 'IMG') {
            if (origBg) {
              try { el.src = origBg; } catch (e) { el.setAttribute('src', origBg); }
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
          el.removeAttribute && el.removeAttribute(originalBgAttr);
          el.removeAttribute && el.removeAttribute(originalFilterAttr);
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
                  if (n.nodeType !== 1) return;
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
  // INJECTION CSS IMMÉDIATE (avant le parsing du DOM)
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

  // Appliquer la carte médiévale si activée (asynchrone, non bloquant)
  safeCall(() => applyMedievalMapOption());

  // ============================================================================
  // GESTION DU THÈME
  // ============================================================================

  function applyThemeInline(cssText) {
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

  function ensureTheme() {
    if (!isThemeEnabled()) {return;}
    applyThemeInline(CONFIG.BUNDLED_CSS);
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
      window.updateForumHRPMenu, window.updateForumCommunauteMenu,
      window.updateForumDebatsMenu, window.updateForumStaffMenu,
      transformDashboardToFlexCards, applyFooterQuoteOption, handleDualLapClock
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
      // N'exécuter qu'en mode mobile et uniquement sur les pages forum
      if (!document.body.classList.contains('mobile-mode')) {return;}
      if (!document.body.classList.contains('page-forum')) {return;}

      // Cibler la table #topics (DataTable)
      const forumTable = document.getElementById('topics');
      if (!forumTable) {return;}

      function processRows() {
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

          // === STATS SIMPLES ===
          const msgCount = msgCell.textContent.trim();
          const viewsCount = viewsCell.textContent.trim();

          const statsContainer = document.createElement('div');
          statsContainer.className = 'forum-topic-stats-mobile';
          statsContainer.innerHTML = `
            <i class="fa fa-comment" aria-hidden="true"></i> ${msgCount}
            <span class="stats-sep">·</span>
            <i class="fa fa-eye" aria-hidden="true"></i> ${viewsCount}
          `;

          // Insérer après le titre
          const titleParagraph = titleCell.querySelector('p');
          if (titleParagraph) {
            titleParagraph.after(statsContainer);
          }
        });

        console.log(`[Forum Topics Mobile] Sujets enrichis`);
      }

      // Exécuter immédiatement
      processRows();

      // Ré-exécuter à chaque draw DataTables (pagination, tri, recherche)
      if (typeof jQuery !== 'undefined') {
        jQuery(forumTable).on('draw.dt', function() {
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
  // MODULE : Kramail:CharacterSwitcher
  // Ajoute un dropdown pour changer de personnage dans les kramails (mobile)
  // ============================================================================
  (function() {
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

      // Extraire le nom du personnage actuel depuis h1
      const currentCharName = Array.from(h1.childNodes)
        .find(node => node.nodeType === Node.TEXT_NODE)
        ?.textContent.trim();

      if (!currentCharName) {
        console.warn('[Kramail Character Switcher] Nom du personnage non trouvé');
        return;
      }

      // Extraire les personnages depuis col-left
      const characterLinks = Array.from(colLeft.querySelectorAll('a[href*="kramail/"]'))
        .filter(a => {
          // Filtrer uniquement les liens vers les kramails de personnages
          const href = a.getAttribute('href');
          return href && href.match(/kramail\/[^\/]+-\d+-\d+$/);
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
        nameSpan.textContent = char.name;

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
      nameSpan.textContent = currentCharName;
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
  (function() {
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
        toggleBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          clone.classList.toggle('open');
        });

        // Fermer le dropdown quand on clique ailleurs
        document.addEventListener('click', function(e) {
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
            boxes.forEach(function(cb) { cb.checked = checked; });
            // Synchroniser aussi la checkbox originale du thead
            const original = document.querySelector('#allbox');
            if (original) original.checked = checked;
          }

          allboxClone.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleAllMessages(allboxClone.checked);
          });

          // Rendre le label cliquable aussi
          const label = allboxClone.closest('a');
          if (label) {
            label.addEventListener('click', function(e) {
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
          item.addEventListener('click', function() {
            // Fermer le dropdown après action
            setTimeout(function() {
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
  (function() {
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
      primaryButtons.forEach(function(btn) {
        // Masquer le texte (le bouton Réception a du texte "Réception")
        var textNodes = Array.from(btn.childNodes).filter(function(n) { return n.nodeType === 3; });
        textNodes.forEach(function(t) { t.textContent = ''; });
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

      secondaryButtons.forEach(function(btn) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = btn.getAttribute('href') || '#';

        var icon = btn.querySelector('i');
        var iconClass = icon ? icon.className : '';
        var labelText = '';

        // Récupérer le label via la map
        Object.keys(labels).forEach(function(key) {
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
      kebabToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        kebab.classList.toggle('open');
      });

      document.addEventListener('click', function(e) {
        if (!kebab.contains(e.target)) {
          kebab.classList.remove('open');
        }
      });

      // Fermer le dropdown après action
      kebabMenu.querySelectorAll('a').forEach(function(item) {
        item.addEventListener('click', function() {
          setTimeout(function() { kebab.classList.remove('open'); }, 200);
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
      msgHeader.innerHTML =
        '<img class="kramail-msg-avatar" src="' + avatarSrc + '" alt="' + avatarAlt + '">' +
        '<div class="kramail-msg-header-info">' +
          '<div class="kramail-msg-sender"><a href="' + senderHref + '">' + senderName + '</a></div>' +
          '<div class="kramail-msg-date"><i class="fa fa-clock-o"></i> ' + dateText + '</div>' +
        '</div>';

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
        if (!isMobileMode) {
          const menusToUpdate = [forumCommunauteLi, forumDebatsLi];
          if (forumStaffLi) menusToUpdate.push(forumStaffLi);
          
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
          if (forumStaffLi) menusToUpdate.push(forumStaffLi);
          
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
          <div class="form-group">
            <label class="col-sm-3 control-label">Carte</label>
            <div class="col-sm-9">
              <div class="checkbox">
                <label><input type="checkbox" name="kr-medieval-map" id="kr-medieval-map-checkbox"> Carte médiévale — remplace les tuiles de la carte</label>
                <p class="help-block" style="margin-top:6px">Merci <a href="http://www.kraland.org/communaute/membres/sylke-1-3335" target="_blank" rel="noopener noreferrer">Sylke</a></p>
              </div>
            </div>
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

        // Synchroniser l'option Carte médiévale
        const medieval = localStorage.getItem(CONFIG.MEDIEVAL_MAP_KEY) === 'true';
        const medievalEl = form.querySelector('#kr-medieval-map-checkbox');
        if (medievalEl) { medievalEl.checked = medieval; }
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

        // Gestion de la Carte médiévale
        if (e.target.name === 'kr-medieval-map') {
          const isChecked = e.target.checked;
          localStorage.setItem(CONFIG.MEDIEVAL_MAP_KEY, isChecked.toString());

          const feedback = document.createElement('div');
          feedback.className = 'alert alert-success';
          feedback.textContent = isChecked ? 'Carte médiévale activée. Application...' : 'Carte médiévale désactivée.';
          container.appendChild(feedback);

          // Appliquer immédiatement
          applyMedievalMapOption();
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
    let domTransformationsApplied = false;

    const mo = new MutationObserver(() => {
      if (isThemeEnabled()) {
        if (!document.getElementById(CONFIG.STYLE_ID)) {
          applyThemeInline(CONFIG.BUNDLED_CSS);
        }
        if (!domTransformationsApplied) {
          applyDOMTransformations();
          domTransformationsApplied = true;
        }
      }
      // S'assurer que la carte médiévale est appliquée si l'option est active
      safeCall(() => applyMedievalMapOption());
      safeCall(insertToggleCSSButton);
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
    // Vérifier que document.body existe avant d'utiliser le MutationObserver
    if (document.body) {
      tabScrollObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
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
        return new Promise((resolve, reject) => {
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
      const originalClose = closeModal;
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

      // Ajouter un bouton sur la page profil/interface
      this.addChangelogButton();
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

      // Chercher un endroit pour ajouter le bouton
      // Généralement dans le panel de contenu
      const container = document.querySelector('.panel-body') ||
                       document.querySelector('.content') ||
                       document.querySelector('main') ||
                       document.querySelector('.container');

      if (!container) {
        console.log('[Changelog] Conteneur profil non trouvé');
        return;
      }

      // Vérifier que le bouton n'existe pas déjà
      if (document.getElementById('kr-changelog-btn')) {
        return;
      }

      // Créer le bouton
      const btn = document.createElement('button');
      btn.id = 'kr-changelog-btn';
      btn.className = 'btn btn-info kr-changelog-btn';
      btn.innerHTML = '📝 Voir l\'historique des changements';

      // Si la section "Alertes" est présente, utiliser un style compact mais lisible (texte inline)
      const krAlertsBtnLocal = document.querySelector('.kr-reset-alerts-btn');
      const krAlertsHelpLocal = krAlertsBtnLocal && krAlertsBtnLocal.parentNode && krAlertsBtnLocal.parentNode.querySelector('.help-block');
      if (krAlertsHelpLocal) {
        btn.className = 'btn btn-link kr-changelog-btn kr-changelog-inline';
        btn.innerHTML = '📝 Voir l\'historique des changements';
        btn.setAttribute('title', 'Voir l\'historique des changements');
        btn.setAttribute('aria-label', 'Voir l\'historique des changements');
        // Styles minimaux pour rester inline et lisible
        btn.style.display = 'inline';
        btn.style.marginLeft = '8px';
        btn.style.fontSize = '13px';
        btn.style.padding = '0';
        btn.style.verticalAlign = 'middle';
      }

      btn.addEventListener('click', () => {
        this.showFullChangelog();
      });

      // Si la section "Alertes" est présente, insérer le bouton *dans* le paragraphe d'aide
      if (krAlertsHelpLocal) {
        // On l'ajoute à l'intérieur du <p> pour éviter qu'il soit poussé hors écran sur mobile
        krAlertsHelpLocal.appendChild(btn);
      } else {
        // Insérer le bouton au début du conteneur ou comme dernier élément (fallback)
        const insertPoint = container.querySelector('h1') || container.querySelector('h2');
        if (insertPoint) {
          insertPoint.parentNode.insertBefore(btn, insertPoint.nextSibling);
        } else {
          container.insertBefore(btn, container.firstChild);
        }
      }

      console.log('[Changelog] Bouton ajouté sur la page profil');
    }
  };

  // ============================================================================
  // INITIALISATION
  // ============================================================================

  (function init() {
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
        ensureTheme();

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

      // Initialiser le gestionnaire de changelog
      safeCall(() => ChangelogManager.init());

    } catch(e) {
      console.error('Kraland theme init failed', e);
    }
  })();
})();
