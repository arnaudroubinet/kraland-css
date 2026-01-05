// Main script code - CSS bundled inline
(function(){
  'use strict';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================
  const CONFIG = {
    BUNDLED_CSS: `__CSS_CONTENT__`,
    ENABLE_KEY: 'kr-theme-enabled',
    VARIANT_KEY: 'kr-theme-variant',
    STYLE_ID: 'kraland-theme-style',
    THEME_VARIANTS: ['kraland','empire-brun','paladium','theocratie-seelienne','paradigme-vert','khanat-elmerien','confederation-libre','royaume-ruthvenie','empire-brun-dark','high-contrast'],
    LOGO_MAP: {
      'kraland': 1, 'empire-brun': 2, 'empire-brun-dark': 2, 'paladium': 3, 'theocratie-seelienne': 4,
      'paradigme-vert': 5, 'khanat-elmerien': 6, 'confederation-libre': 7, 'royaume-ruthvenie': 8
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
    try { fn(); } catch(e) { /* ignore */ }
  }

  /** Vérifie si le thème est activé */
  function isThemeEnabled() {
    return localStorage.getItem(CONFIG.ENABLE_KEY) === 'true';
  }

  /** Récupère la variante de thème actuelle */
  function getVariant() {
    return localStorage.getItem(CONFIG.VARIANT_KEY) || 'kraland';
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
      position: 'absolute', top: '20px', right: '-5px',
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
      position: 'absolute', top: '20px', right: '-5px',
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
  function createStatIconContainer(iconUrl, altText, badgeText) {
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
      if (!isThemeEnabled()) return;
      
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
    if (!isThemeEnabled()) return false;

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
    if (!isThemeEnabled()) return;
    await applyThemeInline(CONFIG.BUNDLED_CSS);
  }

  function applyThemeVariant(variant, skipReload = false) {
    try {
      if (!variant || variant === 'disable') {
        localStorage.setItem(CONFIG.ENABLE_KEY, 'false');
        if (!skipReload) location.reload();
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

  function applyDOMTransformations() {
    if (!isThemeEnabled()) return;

    const transforms = [
      markActiveIcons, replaceMcAnchors, replaceSImages, replaceNavbarBrand,
      reorderBtnGroupXs, ensureSexStrong, ensureFooterSticky, relocateKramailToLeft,
      restructurePlatoColumns, moveBtnGroupToCols, moveSkillsPanelToCols,
      transformToBootstrapGrid, nameLeftSidebarDivs, transformSkillsToIcons,
      transformStatsToNotifications, ensureEditorClasses, ensurePageScoping,
      ensurePlayerMainPanelRows, disableTooltips, modifyNavigationMenus,
      transformDashboardToFlexCards
    ];

    transforms.forEach(fn => safeCall(fn));
  }

  function disableTooltips() {
    document.querySelectorAll('[data-toggle="tooltip"]').forEach(el => {
      el.removeAttribute('data-toggle');
      el.removeAttribute('data-placement');
      el.removeAttribute('title');
      el.removeAttribute('data-original-title');
    });
    if (window.$ && window.$.fn && window.$.fn.tooltip) {
      window.$.fn.tooltip = function() { return this; };
    }
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
    if (!panelBody) return groupData;

    const table = panelBody.querySelector('table');
    if (!table) return groupData;

    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const td1 = row.querySelector('td:first-child');
      const td2 = row.querySelector('td:last-child');
      
      if (!td1 || !td2) return;

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
    if (!pvLevel) return null;
    
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
    if (!isPlatoPage()) return;

    const dashboard = document.querySelector('.dashboard');
    if (!dashboard) return;

    const panels = dashboard.querySelectorAll(':scope > .panel');
    if (!panels.length) return;

    // Créer le nouveau conteneur flex
    const flexContainer = document.createElement('div');
    flexContainer.className = 'dashboard-flex';

    // Tableau de groupes avec leurs données complètes
    const groups = [];
    let firstPlayerPanelFound = false;

    // Extraire toutes les données par groupe
    panels.forEach(panel => {
      const panelBody = panel.querySelector('.panel-body');
      if (!panelBody) return;

      const table = panelBody.querySelector('table');
      if (!table) return;

      // Vérifier si c'est un panel de groupe de personnages (titre contient "Groupe")
      const panelTitle = panel.querySelector('.panel-heading .panel-title');
      const titleText = panelTitle ? panelTitle.textContent.trim() : '';
      if (!titleText.toLowerCase().includes('groupe')) return;

      // Extraire toutes les données du groupe (titre, boutons, membres)
      const groupData = extractGroupData(panel);
      
      if (groupData.members.length === 0) return;

      // Le premier panel avec des personnages = Mon groupe
      const isMyGroup = !firstPlayerPanelFound;
      if (titleText.toLowerCase().includes('groupe')) firstPlayerPanelFound = true;

      groups.push({
        isMyGroup: isMyGroup,
        title: groupData.title,
        groupButtons: groupData.groupButtons,
        members: groupData.members
      });
    });

    // Ne transformer que si on a trouvé au moins un groupe
    if (groups.length === 0) return;

    // Construire les sections pour chaque groupe
    groups.forEach((group, index) => {
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

  function modifyNavigationMenus() {
    // Modification des liens des boutons principaux du menu
    const menuLinks = {
      'Jouer': 'jouer/plateau',
      'Règles': 'regles/avancees',
      'Monde': 'monde/evenements',
      'Communauté': 'communaute/membres'
    };
    
    let forumOriginalItem = null;
    
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
        
        // Supprimer data-toggle pour empêcher le dropdown et forcer la navigation
        link.removeAttribute('data-toggle');
        
        // Marquer comme modifié pour éviter de ré-ajouter l'événement
        if (!link.hasAttribute('data-nav-modified')) {
          link.setAttribute('data-nav-modified', 'true');
          
          // S'assurer que le clic navigue vers la nouvelle URL
          link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = this.href;
            return false;
          });
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
        if (rpLink) {
          rpLink.parentElement.remove();
        }
        forumHrpLi.appendChild(clonedDropdown);
      }
      
      // Insérer Forum RP avant le Forum original
      forumOriginalItem.parentElement.insertBefore(forumRpLi, forumOriginalItem);
      // Insérer Forum HRP après Forum RP (donc avant l'original aussi)
      forumOriginalItem.parentElement.insertBefore(forumHrpLi, forumOriginalItem);
      // Supprimer le menu Forum original
      forumOriginalItem.remove();
      
      // Ajouter les comportements de navigation directe
      const forumRpLink = forumRpLi.querySelector('a.dropdown-toggle');
      if (forumRpLink) {
        forumRpLink.addEventListener('click', function(e) {
          e.preventDefault();
          window.location.href = this.href;
          return false;
        });
      }
      
      const forumHrpLink = forumHrpLi.querySelector('a.dropdown-toggle');
      if (forumHrpLink) {
        forumHrpLink.addEventListener('click', function(e) {
          e.preventDefault();
          window.location.href = this.href;
          return false;
        });
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
      
      communauteItem.parentElement.insertBefore(statsLi, communauteItem.nextSibling);
      
      // Ajouter le comportement de navigation directe pour le menu Statistiques
      const statsLink = statsLi.querySelector('a.dropdown-toggle');
      if (statsLink) {
        statsLink.addEventListener('click', function(e) {
          e.preventDefault();
          window.location.href = this.href;
          return false;
        });
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
        if (!txt.includes(m.text)) continue;
        const hasIcon = !!el.querySelector('i.fa, i.falarge, .glyphicon, svg');
        const score = (hasIcon ? 100 : 0) + Math.max(0, 200 - Math.min(txt.length, 200));
        if (!best || score > best.score) best = { el, score };
      }
      if (best?.el) best.el.classList.add(m.cls);
    });
  }

  function replaceMcAnchors() {
    Array.from(document.querySelectorAll('a'))
      .filter(a => (a.textContent || '').trim() === 'MC')
      .forEach(a => {
        a.classList.add('kr-mc-icon');
        const title = a.getAttribute('data-original-title') || a.getAttribute('title') || 
                      (a.classList.contains('open') ? 'ouvrir le mini-chat' : 'fermer le mini-chat');
        if (title) a.setAttribute('aria-label', title);
        a.removeAttribute('aria-hidden');
      });
  }

  function replaceNavbarBrand() {
    const brand = document.querySelector('.navbar-brand');
    if (!brand) return;

    const variant = getVariant();
    const idx = CONFIG.LOGO_MAP[variant] || 1;
    const url = `http://img7.kraland.org/2/world/logo${idx}.gif`;
    
    const existing = brand.querySelector('img.kr-logo');
    if (existing?.src?.includes(`logo${idx}.gif`)) return;

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
      if (!parent) return;

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
      if (el.querySelector('strong')) return;

      const sym = el.querySelector('.kr-symbol');
      if (sym) {
        const strong = document.createElement('strong');
        sym.parentElement.replaceChild(strong, sym);
        strong.appendChild(sym);
        return;
      }

      const tn = Array.from(el.childNodes)
        .find(n => n.nodeType === 3 && n.textContent?.trim().length > 0);
      if (tn) {
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
    if (!footer) return;

    const selectors = ['a[href="#top"]', 'a.to-top', '.back-to-top', '.scroll-top', 'a.well.well-sm'];
    let back = null;
    for (const s of selectors) {
      back = document.querySelector(s);
      if (back) break;
    }

    if (back) {
      back.classList.add('kraland-back-to-top');
      if (!back.getAttribute('aria-label')) back.setAttribute('aria-label', 'Remonter en haut');
      const whiteContainer = footer.querySelector('.container.white');
      if (whiteContainer) {
        whiteContainer.appendChild(back);
      } else if (back.parentElement !== footer) {
        footer.appendChild(back);
      }
    }

    if (!document.body.style.paddingBottom) {
      document.body.style.paddingBottom = '60px';
    }
  }

  function relocateKramailToLeft() {
    const colT = document.getElementById('col-t');
    const colLeft = document.getElementById('col-left');
    if (!colT || !colLeft) return;

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
        if (el && !toMove.includes(el)) toMove.push(el);
      });
    }

    toMove = toMove.filter(el => el && !colLeft.contains(el));
    if (!toMove.length) return;

    let container = colLeft.querySelector('.kraland-metrics');
    if (!container) {
      container = document.createElement('div');
      container.className = 'kraland-metrics list-group';
      colLeft.appendChild(container);
    }

    toMove.forEach(el => container.appendChild(el));
  }

  function restructurePlatoColumns() {
    if (!isPlatoPage()) return;

    const colLeft = document.getElementById('col-left');
    const colRight = document.getElementById('col-right');
    if (!colLeft || !colRight) return;

    const parent = colLeft.parentElement;
    if (!parent?.classList.contains('row')) return;

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
    if (!isPlatoPage()) return;

    const btnGroupXs = document.querySelector('.btn-group-xs.center');
    const colLeftest = document.getElementById('col-leftest');
    if (!btnGroupXs || !colLeftest || colLeftest.contains(btnGroupXs)) return;

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
    if (!colLeft || !colLeftest) return;

    const skillsPanelOld = colLeft.querySelector('.panel.panel-default');
    if (!skillsPanelOld) return;

    const panelBody = skillsPanelOld.querySelector('.panel-body');
    if (!panelBody || panelBody.id) return;

    panelBody.id = 'skills-panel';
    colLeftest.appendChild(panelBody);
    skillsPanelOld.remove();
  }

  function nameLeftSidebarDivs() {
    const colLeft = document.getElementById('col-left');
    if (!colLeft) return;

    const mainPanel = colLeft.querySelector('.panel.panel-body');
    if (mainPanel && !mainPanel.id) mainPanel.id = 'player-main-panel';

    const headerSection = colLeft.querySelector('.list-group');
    if (headerSection && !headerSection.id) headerSection.id = 'player-header-section';

    const vitalsSection = colLeft.querySelector('div.t.row');
    if (vitalsSection && !vitalsSection.id) vitalsSection.id = 'player-vitals-section';

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
    if (!skillsPanel || skillsPanel.dataset.iconsTransformed) return;

    skillsPanel.querySelectorAll('.list-group-item').forEach(item => {
      const heading = item.querySelector('.list-group-item-heading');
      const skillName = heading?.querySelector('.mini')?.textContent || '';
      const level = item.querySelector('.mention')?.textContent || '0';
      const iconCode = CONFIG.SKILL_ICONS[skillName];
      if (!iconCode) return;

      const iconUrl = `http://img7.kraland.org/2/mat/94/${iconCode}.gif`;
      const originalClasses = item.className;
      item.className = originalClasses + ' btn btn-default mini';
      item.innerHTML = '';

      const iconContainer = createIconContainer(iconUrl, skillName, level);
      Object.assign(item.style, {
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '8px'
      });
      item.appendChild(iconContainer);
    });

    skillsPanel.dataset.iconsTransformed = '1';
  }

  function transformStatsToNotifications() {
    const colLeftestStats = document.getElementById('col-leftest-stats');
    if (!colLeftestStats || colLeftestStats.dataset.badgesTransformed) return;

    colLeftestStats.querySelectorAll('.col-md-6 > a.btn').forEach(statBtn => {
      const text = statBtn.textContent.trim();
      const match = text.match(/^([A-Z]+)/);
      const cleanStatName = match ? match[1] : text;
      const levelMatch = text.match(/(\d+)$/);
      const number = levelMatch ? levelMatch[1] : '0';

      while (statBtn.firstChild) statBtn.removeChild(statBtn.firstChild);

      const originalClasses = statBtn.className;
      statBtn.className = originalClasses + ' list-group-item ds_game';
      Object.assign(statBtn.style, {
        padding: '8px', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      });
      statBtn.title = cleanStatName;

      const iconCode = CONFIG.STAT_ICONS[cleanStatName];
      if (iconCode) {
        const iconUrl = `http://img7.kraland.org/2/mat/94/${iconCode}.gif`;
        const iconContainer = createStatIconContainer(iconUrl, cleanStatName, number);
        statBtn.appendChild(iconContainer);
      } else {
        // Fallback SVG
        const container = document.createElement('div');
        Object.assign(container.style, {
          position: 'relative', display: 'inline-block',
          width: '32px', height: '32px'
        });

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
        container.appendChild(createStatBadge(number));
        statBtn.appendChild(container);
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
    if (!panel) return;

    Array.from(panel.children)
      .filter(child => child.tagName?.toLowerCase() === 'div')
      .forEach(div => {
        if (!div.classList.contains('row')) div.classList.add('row');
      });
  }

  // ============================================================================
  // UI CONTROLS
  // ============================================================================

  function insertToggleCSSButton() {
    if (document.getElementById('kr-toggle-css-btn')) return;

    const mapBtn = Array.from(document.querySelectorAll('a'))
      .find(a => a.getAttribute('onclick')?.includes('openMap'));
    if (!mapBtn) return;

    const mapLi = mapBtn.closest('li');
    if (!mapLi?.parentElement) return;

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
    mapLi.parentElement.insertBefore(newLi, mapLi);
  }

  function insertTampermonkeyThemeUI() {
    if (!location?.href?.includes('/profil/interface')) return;

    function tryInsert() {
      const headings = Array.from(document.querySelectorAll('h4, h3, h2'));
      const target = headings.find(h => 
        h.textContent?.trim().toLowerCase().includes('thème de base')
      );
      if (!target) return false;
      if (document.getElementById('kr-tamper-theme')) return true;

      const themeOptions = [
        { value: 'disable', flag: 'f0', label: 'Désactiver la surcharge CSS' },
        { value: 'kraland', flag: 'f1', label: 'République de Kraland' },
        { value: 'empire-brun', flag: 'f2', label: 'Empire Brun' },
        { value: 'empire-brun-dark', flag: 'f2', label: 'Empire Brun (Dark Mode)' },
        { value: 'paladium', flag: 'f3', label: 'Paladium Corporation' },
        { value: 'theocratie-seelienne', flag: 'f4', label: 'Théocratie Seelienne' },
        { value: 'paradigme-vert', flag: 'f5', label: 'Paradigme Vert' },
        { value: 'khanat-elmerien', flag: 'f6', label: 'Khanat Elmérien' },
        { value: 'confederation-libre', flag: 'f7', label: 'Confédération Libre' },
        { value: 'royaume-ruthvenie', flag: 'f8', label: 'Royaume de Ruthvénie' }
      ];

      const radios = themeOptions.map(opt => `
        <div class="radio">
          <span class="lefticon"><img src="http://img7.kraland.org/2/world/${opt.flag}.png" width="15" height="10"></span>
          <label><input type="radio" name="kr-theme" value="${opt.value}"> ${opt.label}</label>
        </div>
      `).join('');

      const container = document.createElement('div');
      container.id = 'kr-tamper-theme';
      container.className = 'well kr-tamper-theme';
      container.innerHTML = `
        <h4>Thème Tampermonkey (Activez le thème de base officiel pour éviter les conflits)</h4>
        <form id="kr-tamper-theme-form" class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-3 control-label">Choix</label>
            <div class="col-sm-9">${radios}</div>
          </div>
        </form>
      `;

      target.parentElement.insertBefore(container, target);

      const form = container.querySelector('#kr-tamper-theme-form');
      
      function syncUI() {
        if (!isThemeEnabled()) {
          const d = form.querySelector('input[value="disable"]');
          if (d) d.checked = true;
          return;
        }
        const v = getVariant();
        const el = form.querySelector(`input[value="${v}"]`);
        if (el) el.checked = true;
      }

      form.addEventListener('change', () => {
        const sel = form.querySelector('input[name="kr-theme"]:checked');
        if (!sel) return;
        const val = sel.value;

        const feedback = document.createElement('div');
        feedback.className = 'alert alert-success';
        feedback.textContent = val === 'disable' 
          ? 'Désactivation du thème...' 
          : 'Application du thème: ' + val;
        container.appendChild(feedback);

        setTimeout(() => applyThemeVariant(val), 300);
      });

      syncUI();
      return true;
    }

    if (!tryInsert()) {
      let attempts = 0;
      const id = setInterval(() => {
        attempts++;
        if (tryInsert() || attempts > 25) clearInterval(id);
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
    const wrap = orig => function() {
      const ret = orig.apply(this, arguments);
      setTimeout(() => ensureTheme(), 250);
      return ret;
    };
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', () => setTimeout(() => ensureTheme(), 250));
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
