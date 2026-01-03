// Main script code - CSS bundled inline
(function(){
  'use strict';

  const BUNDLED_CSS = `__CSS_CONTENT__`;
  const ENABLE_KEY = 'kr-theme-enabled';
  const VARIANT_KEY = 'kr-theme-variant';
  const STYLE_ID = 'kraland-theme-style';
  // known theme slugs for persistence and class management
  const THEME_VARIANTS = ['kraland','empire-brun','paladium','theocratie-seelienne','paradigme-vert','khanat-elmerien','confederation-libre','royaume-ruthvenie','high-contrast'];

  // ============================================
  // IMMEDIATE CSS INJECTION (before any async code)
  // Runs at document-idle, so no FOUC risk
  // ============================================
  // ============================================
  // IMMEDIATE CSS INJECTION (before any async code)
  // Runs at document-idle, so no FOUC risk
  // ============================================
  (function injectCSSImmediately(){
    try{
      const enabled = localStorage.getItem(ENABLE_KEY);
      if(enabled !== 'true') return; // Theme disabled, don't inject
      
      // Create style element and inject CSS immediately
      const st = document.createElement('style');
      st.id = STYLE_ID;
      st.textContent = BUNDLED_CSS;
      
      // Inject into <head>
      const target = document.head || document.documentElement;
      if(target){
        target.appendChild(st);
      }
      
      // Add variant class immediately
      const variant = localStorage.getItem(VARIANT_KEY) || 'kraland';
      document.documentElement.classList.add('kr-theme-enabled');
      document.documentElement.classList.add('kr-theme-variant-' + variant);
      if(variant === 'high-contrast'){
        document.documentElement.classList.add('kr-theme-high-contrast');
      }
    }catch(e){
      console.error('CSS injection failed', e);
    }
  })();

  async function applyThemeInline(cssText){
    try{
      // Check if theme is enabled before injecting CSS
      const enabled = localStorage.getItem(ENABLE_KEY);
      if(enabled !== 'true'){
        // Theme is disabled, don't inject CSS
        return false;
      }

      let st = document.getElementById(STYLE_ID);
      if(st){ st.textContent = cssText; }
      else{ st = document.createElement('style'); st.id = STYLE_ID; st.textContent = cssText; document.head.appendChild(st); }
      // add marker class to html so we can scope variants later
      document.documentElement.classList.add('kr-theme-enabled');
      const variant = (localStorage.getItem(VARIANT_KEY) || 'kraland');
      // apply high contrast flag if requested
      document.documentElement.classList.toggle('kr-theme-high-contrast', variant === 'high-contrast');
      // ensure variant class is present and others removed so persistence works across pages
      try{
        THEME_VARIANTS.forEach(v => document.documentElement.classList.remove('kr-theme-variant-'+v));
        if(variant && variant !== 'disable') document.documentElement.classList.add('kr-theme-variant-'+variant);
      }catch(e){}

      // Page-specific class: members list (/communaute/membres) - robust check
      const isMembers = (location && ( (location.pathname && location.pathname.indexOf('/communaute/membres') === 0) || (location.href && location.href.indexOf('/communaute/membres') !== -1) ));
      document.documentElement.classList.toggle('kr-page-members', !!isMembers);

      // Ensure dropdown menu anchors remain readable even if other styles override
      try{
        let sd = document.getElementById('kr-dropdown-fix');
        const txt = `#navbar .dropdown-menu > li > a { color: var(--kr-text) !important; }\n#navbar .dropdown-menu > li > a:hover, #navbar .dropdown-menu > li > a:focus { color: var(--kr-primary) !important; background-color: rgba(0,0,0,0.03); }`;
        if(sd) sd.textContent = txt; else { sd = document.createElement('style'); sd.id='kr-dropdown-fix'; sd.textContent = txt; document.head.appendChild(sd); }
      }catch(e){/*ignore*/}

      // Disable Bootstrap tooltips completely
      try{ disableTooltips(); }catch(e){/*ignore*/}

      console.log('✓ Theme CSS injected, length:', cssText.length);
      return true;
    }catch(e){ console.error('Kraland theme apply failed', e); return false; }
  }

  // Apply all DOM transformations (called after DOM is stable)
  function applyDOMTransformations(){
    try{
      const enabled = localStorage.getItem(ENABLE_KEY);
      if(enabled !== 'true') return;
      
      // tag activity icons (members / characters / online) so we can style them
      try{ markActiveIcons(); }catch(e){/*ignore*/}
      try{ replaceMcAnchors(); }catch(e){/*ignore*/}
      try{ replaceSImages(); }catch(e){/*ignore*/}
      try{ replaceNavbarBrand(); }catch(e){/*ignore*/}
      try{ reorderBtnGroupXs(); }catch(e){/*ignore*/}
      try{ ensureSexStrong(); }catch(e){/*ignore*/}
      try{ ensureFooterSticky(); }catch(e){/*ignore*/}
      try{ relocateKramailToLeft(); }catch(e){/*ignore*/}
      try{ restructurePlatoColumns(); }catch(e){/*ignore*/}
      try{ moveBtnGroupToCols(); }catch(e){/*ignore*/}
      try{ moveSkillsPanelToCols(); }catch(e){/*ignore*/}
      try{ transformToBootstrapGrid(); }catch(e){/*ignore*/}
      try{ nameLeftSidebarDivs(); }catch(e){/*ignore*/}
      try{ transformSkillsToIcons(); }catch(e){/*ignore*/}
      try{ transformStatsToNotifications(); }catch(e){/*ignore*/}
      try{ styleSignatureEditors(); }catch(e){/*ignore*/}
      try{ ensureEditorClasses(); }catch(e){/*ignore*/}
      try{ aggressiveScanEditors(); }catch(e){/*ignore*/}
      try{ ensurePageScoping(); }catch(e){/*ignore*/}
      try{ ensurePlayerMainPanelRows(); }catch(e){/*ignore*/}
      
      console.log('✓ DOM transformations applied');
    }catch(e){ console.error('DOM transformations failed', e); }
  }

  async function ensureTheme(){
    const enabled = localStorage.getItem(ENABLE_KEY);
    // Theme disabled by default, only load if explicitly enabled
    if(enabled !== 'true') return;
    await applyThemeInline(BUNDLED_CSS);
  }

  // Disable Bootstrap tooltips by removing data-toggle attributes
  function disableTooltips(){
    try{
      // Remove all tooltip data-toggle attributes to prevent Bootstrap from creating them
      const elements = document.querySelectorAll('[data-toggle="tooltip"]');
      elements.forEach(el => {
        el.removeAttribute('data-toggle');
        el.removeAttribute('data-placement');
        el.removeAttribute('title');
        el.removeAttribute('data-original-title');
      });
      // Also prevent any dynamically added tooltips by blocking the tooltip plugin
      if(window.$ && window.$.fn && window.$.fn.tooltip){
        window.$.fn.tooltip = function(){ return this; };
      }
      console.log('[Kraland Dev] Tooltips disabled, removed attributes from', elements.length, 'elements');
    }catch(e){
      console.warn('[Kraland Dev] Failed to disable tooltips:', e);
    }
  }

  // tag activity icons by text so we can color them correctly
  function markActiveIcons(){
    const map = [
      {text: 'Membres actifs', cls: 'kr-icon-members'},
      {text: 'Personnages actifs', cls: 'kr-icon-characters'},
      {text: 'Personnes en ligne', cls: 'kr-icon-online'},
      // Section headers that should reflect theme color
      {text: 'Présentation', cls: 'kr-icon-presentation'},
      {text: 'Médailles', cls: 'kr-icon-medals'}
    ];
    // clear previous marks
    for(const m of map) Array.from(document.querySelectorAll('.'+m.cls)).forEach(n=>n.classList.remove(m.cls));

    // find specific candidate elements (prefer small elements near the text)
    const all = Array.from(document.querySelectorAll('*'));
    for(const m of map){
      let best = null;
      for(const el of all){
        const txt = (el.textContent||'').trim();
        if(!txt || !txt.includes(m.text)) continue;
        // prefer elements that are not large containers
        const len = txt.length;
        const hasIcon = !!el.querySelector('i.fa, i.falarge, .glyphicon, svg');
        // score: prefer small length and having an icon
        const score = (hasIcon?100:0) + Math.max(0, 200 - Math.min(len,200));
        if(!best || score > best.score) best = {el, score};
      }
      if(best && best.el){ best.el.classList.add(m.cls); }
    }
  }

  // Replace 'MC' anchors with an accessible chat-bubble icon (visual only)
  function replaceMcAnchors(){
    try{
      const anchors = Array.from(document.querySelectorAll('a'))
        .filter(a => (a.textContent||'').trim() === 'MC');
      for(const a of anchors){
        a.classList.add('kr-mc-icon');
        const title = a.getAttribute('data-original-title') || a.getAttribute('title') || (a.classList.contains('open') ? 'ouvrir le mini-chat' : 'fermer le mini-chat');
        if(title) a.setAttribute('aria-label', title);
        // ensure the control is reachable by assistive tech
        a.removeAttribute('aria-hidden');
      }
    }catch(e){/*ignore*/}
  }

  // Map theme variant slug to logo index used on img7 (logo1.gif..logo8.gif)
  function getLogoIndexForVariant(variant){
    try{
      const map = {
        'kraland': 1,
        'empire-brun': 2,
        'paladium': 3,
        'theocratie-seelienne': 4,
        'paradigme-vert': 5,
        'khanat-elmerien': 6,
        'confederation-libre': 7,
        'royaume-ruthvenie': 8
      };
      return map[variant] || 1;
    }catch(e){ return 1; }
  }

  // Replace the navbar brand text with the themed logo image (logoX.gif)
  function replaceNavbarBrand(){
    try{
      const brand = document.querySelector('.navbar-default .navbar-brand, .navbar .navbar-brand, #navbar .navbar-brand, .navbar-brand');
      if(!brand) return;
      const variant = (localStorage.getItem(VARIANT_KEY) || 'kraland');
      const idx = getLogoIndexForVariant(variant);
      const url = 'http://img7.kraland.org/2/world/logo' + idx + '.gif';
      const existing = brand.querySelector('img.kr-logo');
      if(existing && existing.src && existing.src.indexOf('logo'+idx+'.gif') !== -1) return; // already set
      // remove existing content but keep attributes
      try{ while(brand.firstChild) brand.removeChild(brand.firstChild); }catch(e){}
      const img = document.createElement('img');
      img.className = 'kr-logo';
      img.src = url;
      img.alt = 'Kraland';
      img.style.height = '28px';
      img.style.verticalAlign = 'middle';
      brand.appendChild(img);
    }catch(e){/*ignore*/}
  }

  // Replace small s1/s2/s3 images with equivalent Unicode characters for accessibility
  function replaceSImages(){
    try{
      const map = { 's1.gif': '♂', 's2.gif': '♀', 's3.gif': '⚧' };
      const imgs = Array.from(document.querySelectorAll('img'))
        .filter(i => /img7\.kraland\.org\/.+\/(s[123]\.gif)$/.test(i.src));
      for(const img of imgs){
        const m = img.src.match(/(s[123]\.gif)$/);
        const key = m ? m[1] : null;
        const ch = map[key] || '';
        const span = document.createElement('span');
        span.className = 'kr-symbol kr-symbol-' + (key || 's');
        span.setAttribute('aria-hidden', 'true');
        span.textContent = ch;
        if(img.alt){ const sr = document.createElement('span'); sr.className = 'kr-sr-only'; sr.textContent = img.alt; span.appendChild(sr); }
        // If this image represents the sex value, wrap in <strong>
        const sexAncestor = img.closest('[id^="ajax-sex"]') || img.closest('[id*="_sex"]') || img.closest('[id*="sex"]');
        if(sexAncestor){
          const strong = document.createElement('strong');
          strong.appendChild(span);
          img.replaceWith(strong);
        }else{
          img.replaceWith(span);
        }
      }
    }catch(e){/*ignore*/}
  }
  // Move .btn-group-xs before the parent text in member blocks for cleaner layout
  // Specifically: if the parent contains a <strong> label (eg. "Nom:") place the button BEFORE that <strong> element.
  function reorderBtnGroupXs(){
    try{
      const candidates = Array.from(document.querySelectorAll('span.btn-group-xs'));
      candidates.forEach(btn => {
        const parent = btn.parentElement;
        if(!parent) return;
        // If a <strong> label exists, place the btn before it (per design requirement)
        const strong = parent.querySelector('strong');
        if(strong && strong.parentElement === parent){
          if(btn.nextElementSibling !== strong){
            parent.insertBefore(btn, strong);
            // If some other script immediately reorders, try again next tick to ensure placement before <strong>
            setTimeout(()=>{ try{ if(btn.nextElementSibling !== strong) parent.insertBefore(btn, parent.firstChild); }catch(e){} }, 50);
          }
          return;
        }
        // prefer moving before the first meaningful text node
        const textNode = Array.from(parent.childNodes).find(n => n.nodeType === 3 && n.textContent && n.textContent.trim().length > 0);
        if(textNode){
          if(btn.nextSibling !== textNode && parent.firstChild !== btn){
            parent.insertBefore(btn, textNode);
          }
          return;
        }
        // fallback: before first child element that contains visible text
        const elWithText = Array.from(parent.children).find(ch => (ch.innerText||'').trim().length > 0 && ch !== btn);
        if(elWithText){
          if(parent.firstElementChild !== btn){
            parent.insertBefore(btn, elWithText);
          }
          return;
        }
        // otherwise don't change (avoid moving before avatars/images)
      });
    }catch(e){/*ignore*/ }
  }

  // Ensure that sex values are wrapped in a <strong> for consistent styling and semantics
  function ensureSexStrong(){
    try{
      const sexEls = Array.from(document.querySelectorAll('[id*="ajax-sex"]'));
      sexEls.forEach(el => {
        // if strong exists already, nothing to do
        if(el.querySelector('strong')) return;
        // prefer to wrap existing .kr-symbol
        const sym = el.querySelector('.kr-symbol');
        if(sym){
          const strong = document.createElement('strong');
          // replace the symbol node with a <strong> that contains it (preserve position)
          sym.parentElement.replaceChild(strong, sym);
          strong.appendChild(sym);
          return;
        }
        // fallback: find a text node with non-space content and wrap it (replace the text node)
        const tn = Array.from(el.childNodes).find(n=>n.nodeType===3 && n.textContent && n.textContent.trim().length>0);
        if(tn){
          const txt = tn.textContent.trim();
          const strong = document.createElement('strong');
          strong.textContent = txt;
          tn.textContent = tn.textContent.replace(txt, '');
          // insert strong where the text node was
          tn.parentElement.insertBefore(strong, tn.nextSibling);
        }
      });
    }catch(e){/*ignore*/ }
  }

  // Ensure footer is fixed and back-to-top button is placed inside the white container
  function ensureFooterSticky(){
    try{
      const footer = document.querySelector('footer, .footer, .contentinfo');
      if(!footer) return;
      const selectors = ['a[href="#top"]', 'a.to-top', '.back-to-top', '.scroll-top', 'a.well.well-sm'];
      let back = null;
      for(const s of selectors){ back = document.querySelector(s); if(back) break; }
      if(back){
        back.classList.add('kraland-back-to-top');
        if(!back.getAttribute('aria-label')) back.setAttribute('aria-label','Remonter en haut');
        // Try to place it inside the white container
        const whiteContainer = footer.querySelector('.container.white');
        if(whiteContainer){
          // Force move to white container
          whiteContainer.appendChild(back);
        } else if(back.parentElement !== footer){
          footer.appendChild(back);
        }
      }
      if(!document.body.style.paddingBottom) document.body.style.paddingBottom = '60px';
    }catch(e){/*ignore*/}
  }

  // Move Kramail counts (members/characters/online) from right column to end of left column
  // Idempotent: will not duplicate elements if already moved, and will remove the kramail block
  function relocateKramailToLeft(){
    try{
      const colT = document.getElementById('col-t');
      const colLeft = document.getElementById('col-left');
      if(!colT || !colLeft) return;

      // Remove Kramail block(s) (links to /kramail) but avoid removing the entire column
      const kramailAnchors = Array.from(colT.querySelectorAll('a[href*="kramail"]'));
      kramailAnchors.forEach(a => {
        let container = a.closest('div,section,li,article');
        if(container && container !== colT && container.id !== 'col-t'){
          if(container.parentElement) container.parentElement.removeChild(container);
        } else {
          // fallback: remove only the anchor itself
          if(a.parentElement) a.parentElement.removeChild(a);
        }
      });

      // Select anchors to move by class, falling back to matching text
      const selectors = ['a.ds_users','a.ds_characters','a.ds_online','a.list-group-item.ds_users','a.list-group-item.ds_characters','a.list-group-item.ds_online'];
      let toMove = [];
      selectors.forEach(sel => toMove.push(...Array.from(colT.querySelectorAll(sel))));

      if(toMove.length < 3){
        const texts = ['Membres actifs','Personnages actifs','Personnes en ligne'];
        for(const txt of texts){
          const el = Array.from(colT.querySelectorAll('a, li, div, p')).find(n => (n.textContent||'').includes(txt));
          if(el && !toMove.includes(el)) toMove.push(el);
        }
      }

      // Filter out already moved items
      toMove = toMove.filter(el => el && !colLeft.contains(el));
      if(!toMove.length) return;

      // Ensure a container exists at the end of col-left
      let container = colLeft.querySelector('.kraland-metrics');
      if(!container){
        container = document.createElement('div');
        container.className = 'kraland-metrics list-group';
        colLeft.appendChild(container);
      }

      toMove.forEach(el => container.appendChild(el));
    }catch(e){/*ignore*/}
  }

  // Helper function to check if we're on the plato page (/jouer)
  function isPlatoPage(){
    try{
      const path = (location && location.pathname) || '';
      // Check if we're on /jouer page (but not /jouer/communaute, etc.)
      return path.indexOf('/jouer') === 0 && path !== '/jouer/communaute' && path !== '/jouer/communaute/membres';
    }catch(e){ return false; }
  }

  // Restructure plateau columns: create col-leftest (col-md-1) and adjust col-right to col-md-8
  function restructurePlatoColumns(){
    try{
      // Only apply on plato pages
      if(!isPlatoPage()) return;
      
      const colLeft = document.getElementById('col-left');
      const colRight = document.getElementById('col-right');
      if(!colLeft || !colRight) return;

      const parent = colLeft.parentElement;
      if(!parent || !parent.classList.contains('row')) return;

      // Create col-leftest if it doesn't exist
      let colLeftest = document.getElementById('col-leftest');
      if(!colLeftest){
        colLeftest = document.createElement('div');
        colLeftest.id = 'col-leftest';
        colLeftest.className = 'col-md-1';
        parent.insertBefore(colLeftest, colLeft);
      }

      // Update col-right class from col-md-9 to col-md-8 if needed
      if(colRight.classList.contains('col-md-9')){
        colRight.classList.remove('col-md-9');
        colRight.classList.add('col-md-8');
      }
    }catch(e){/*ignore*/}
  }

  // Move btn-group-xs.center to col-leftest and wrap it in a named container
  function moveBtnGroupToCols(){
    try{
      // Only apply on plato pages
      if(!isPlatoPage()) return;
      
      const btnGroupXs = document.querySelector('.btn-group-xs.center');
      const colLeftest = document.getElementById('col-leftest');
      if(!btnGroupXs || !colLeftest) return;

      // Check if already moved
      if(colLeftest.contains(btnGroupXs)) return;

      // Create wrapper container with ID
      let wrapper = document.getElementById('col-leftest-stats');
      if(!wrapper){
        wrapper = document.createElement('div');
        wrapper.id = 'col-leftest-stats';
        wrapper.className = 'panel panel-body';
        colLeftest.appendChild(wrapper);
      }

      // Move btn-group-xs to wrapper if it's not already there
      if(!wrapper.contains(btnGroupXs)){
        wrapper.appendChild(btnGroupXs);
      }
    }catch(e){/*ignore*/}
  }

  // Transform col-leftest-stats and skills-panel to use Bootstrap grid
  function transformToBootstrapGrid(){
    try{
      const colLeftestStats = document.getElementById('col-leftest-stats');
      const skillsPanel = document.getElementById('skills-panel');
      
      // Transform col-leftest-stats: create a row with a column for each button
      if(colLeftestStats && !colLeftestStats.classList.contains('grid-transformed')){
        // Get the btn-group-xs
        const btnGroup = colLeftestStats.querySelector('.btn-group-xs');
        if(btnGroup){
          const buttons = Array.from(btnGroup.querySelectorAll('a.btn'));
          
          if(buttons.length > 0){
            // Clear the container
            colLeftestStats.innerHTML = '';
            
            // Create a row
            const row = document.createElement('div');
            row.className = 'row';
            
            // Create a column for each button
            buttons.forEach((btn) => {
              const col = document.createElement('div');
              col.className = 'col-md-6'; // 2 columns = 2 per row (12/6=2)
              col.appendChild(btn);
              row.appendChild(col);
            });
            
            colLeftestStats.appendChild(row);
            colLeftestStats.classList.add('grid-transformed');
          }
        }
      }
      
      // Transform skills-panel: create a row with a column for each skill item
      if(skillsPanel && !skillsPanel.classList.contains('grid-transformed')){
        const items = Array.from(skillsPanel.querySelectorAll('a.list-group-item'));
        
        if(items.length > 0){
          // Clear the container
          skillsPanel.innerHTML = '';
          
          // Create a row
          const row = document.createElement('div');
          row.className = 'row';
          
          // Create a column for each item
          items.forEach((item) => {
            const col = document.createElement('div');
            col.className = 'col-md-6'; // 2 columns per row (12/6=2)
            col.appendChild(item);
            row.appendChild(col);
          });
          
          skillsPanel.appendChild(row);
          skillsPanel.classList.add('grid-transformed');
        }
      }
    }catch(e){/*ignore*/}
  }

  // Move skills panel body to col-leftest and rename it
  function moveSkillsPanelToCols(){
    try{
      const colLeft = document.getElementById('col-left');
      const colLeftest = document.getElementById('col-leftest');
      if(!colLeft || !colLeftest) return;

      // Find the old skills-panel div.panel.panel-default
      const skillsPanelOld = colLeft.querySelector('.panel.panel-default');
      if(!skillsPanelOld) return;

      // Find the panel-body inside it
      const panelBody = skillsPanelOld.querySelector('.panel-body');
      if(!panelBody) return;

      // If not already done, set the ID on panel-body and move it
      if(!panelBody.id){
        panelBody.id = 'skills-panel';
        // Move panel-body to col-leftest
        colLeftest.appendChild(panelBody);
        // Remove the now-empty skills-panel container
        skillsPanelOld.remove();
      }
    }catch(e){/*ignore*/}
  }

  // Name the sidebar divs in col-left for better CSS targeting and JS manipulation
  function nameLeftSidebarDivs(){
    try{
      const colLeft = document.getElementById('col-left');
      if(!colLeft) return;

      // 1. Find and name player-main-panel: the main div.panel.panel-body inside col-left
      let mainPanel = colLeft.querySelector('.panel.panel-body');
      if(mainPanel && !mainPanel.id){
        mainPanel.id = 'player-main-panel';
      }

      // 2. Find and name player-header-section: the list-group element (portrait section)
      const headerSection = colLeft.querySelector('.list-group');
      if(headerSection && !headerSection.id){
        headerSection.id = 'player-header-section';
      }

      // 4. Find and name player-vitals-section: div.t.row
      const vitalsSection = colLeft.querySelector('div.t.row');
      if(vitalsSection && !vitalsSection.id){
        vitalsSection.id = 'player-vitals-section';
      }

      // 5. Find and name player-actions-section: div.t that contains action buttons (Dormir, Prier, etc)
      // It should be the last div.t element and contain btn-primary links
      const allTDivs = Array.from(colLeft.querySelectorAll('div.t'));
      if(allTDivs.length > 0){
        const actionsSection = allTDivs[allTDivs.length - 1];
        if(!actionsSection.id && actionsSection.querySelector('a.btn-primary')){
          actionsSection.id = 'player-actions-section';
        }
      }
    }catch(e){/*ignore*/}
  }

  // Transform skills items to show icons with badges instead of text
  function transformSkillsToIcons(){
    try{
      const skillsPanel = document.getElementById('skills-panel');
      if(!skillsPanel || skillsPanel.dataset.iconsTransformed) return;

      const skillIcons = {
        'Baratin': 'http://img7.kraland.org/2/mat/94/9401.gif',
        'Combat Mains Nues': 'http://img7.kraland.org/2/mat/94/9402.gif',
        'Combat Contact': 'http://img7.kraland.org/2/mat/94/9403.gif',
        'Combat Distance': 'http://img7.kraland.org/2/mat/94/9404.gif',
        'Commerce': 'http://img7.kraland.org/2/mat/94/9405.gif',
        'Démolition': 'http://img7.kraland.org/2/mat/94/9406.gif',
        'Discrétion': 'http://img7.kraland.org/2/mat/94/9407.gif',
        'Éloquence': 'http://img7.kraland.org/2/mat/94/9408.gif',
        'Falsification': 'http://img7.kraland.org/2/mat/94/9409.gif',
        'Foi': 'http://img7.kraland.org/2/mat/94/9410.gif',
        'Informatique': 'http://img7.kraland.org/2/mat/94/9411.gif',
        'Médecine': 'http://img7.kraland.org/2/mat/94/9412.gif',
        'Observation': 'http://img7.kraland.org/2/mat/94/9413.gif',
        'Organisation': 'http://img7.kraland.org/2/mat/94/9414.gif',
        'Pouvoir': 'http://img7.kraland.org/2/mat/94/9415.gif',
        'Séduction': 'http://img7.kraland.org/2/mat/94/9416.gif',
        'Survie': 'http://img7.kraland.org/2/mat/94/9417.gif',
        'Vol': 'http://img7.kraland.org/2/mat/94/9418.gif'
      };

      skillsPanel.querySelectorAll('.list-group-item').forEach(item => {
        const heading = item.querySelector('.list-group-item-heading');
        const skillName = heading?.querySelector('.mini')?.textContent || '';
        const level = item.querySelector('.mention')?.textContent || '0';
        const iconUrl = skillIcons[skillName];
        if(!iconUrl) return;

        // Preserve original classes and add Bootstrap styling for white background
        // This gives skills the same white background appearance as stats
        const originalClasses = item.className;
        item.className = originalClasses + ' btn btn-default mini';

        item.innerHTML = '';
        
        const iconContainer = document.createElement('div');
        iconContainer.style.position = 'relative';
        iconContainer.style.display = 'inline-block';
        iconContainer.style.width = '32px';
        iconContainer.style.height = '32px';

        const img = document.createElement('img');
        img.src = iconUrl;
        img.alt = skillName;
        img.title = skillName;
        iconContainer.appendChild(img);

        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = level;
        badge.style.position = 'absolute';
        badge.style.bottom = '-5px';
        badge.style.right = '-5px';
        badge.style.backgroundColor = '#d9534f';
        badge.style.color = '#fff';
        badge.style.borderRadius = '50%';
        badge.style.width = '19px';
        badge.style.height = '19px';
        badge.style.display = 'flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.style.fontSize = '11px';
        badge.style.fontWeight = 'bold';
        badge.style.border = '2px solid #fff';
        iconContainer.appendChild(badge);

        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'center';
        item.style.padding = '8px';
        item.appendChild(iconContainer);
      });

      skillsPanel.dataset.iconsTransformed = '1';
    }catch(e){/*ignore*/}
  }

  // Transform stats to show with badges - same structure as skills
  function transformStatsToNotifications(){
    try{
      const colLeftestStats = document.getElementById('col-leftest-stats');
      if(!colLeftestStats || colLeftestStats.dataset.badgesTransformed) return;

      // Stat icons mapping
      const statIcons = {
        'FOR': 'http://img7.kraland.org/2/mat/94/9402.gif',
        'VOL': 'http://img7.kraland.org/2/mat/94/9415.gif',
        'CHA': 'http://img7.kraland.org/2/mat/94/9416.gif',
        'INT': 'http://img7.kraland.org/2/mat/94/9412.gif',
        'GES': 'http://img7.kraland.org/2/mat/94/9405.gif',
        'PER': 'http://img7.kraland.org/2/mat/94/9413.gif'
      };

      colLeftestStats.querySelectorAll('.col-md-6 > a.btn').forEach(statBtn => {
        // Get the text content BEFORE we modify the DOM
        const text = statBtn.textContent.trim();
        // Extract stat name: first 3-4 chars (FOR, CHA, INT, etc.)
        const match = text.match(/^([A-Z]+)/);
        const cleanStatName = match ? match[1] : text;
        
        // Extract the level number from text (last part after the stat name)
        const levelMatch = text.match(/(\d+)$/);
        const number = levelMatch ? levelMatch[1] : '0';
        
        // **KEY FIX**: Instead of clearing innerHTML, we'll use while loop to remove all children
        // This PRESERVES the <a> element itself and all its event listeners
        while (statBtn.firstChild) {
          statBtn.removeChild(statBtn.firstChild);
        }
        
        // PRESERVE original classes and ADD thème classes
        // Keep the original 'btn', 'btn-default', 'mini', 'alert12X' classes
        // Only add 'list-group-item' and 'ds_game' from the theme
        const originalClasses = statBtn.className;
        statBtn.className = originalClasses + ' list-group-item ds_game';
        statBtn.setAttribute('style', 'padding: 8px; display: flex; align-items: center; justify-content: center;');
        statBtn.title = cleanStatName;
        
        // Create a container for position relative (same as skills)
        const statContainer = document.createElement('div');
        statContainer.setAttribute('style', 'position: relative; display: inline-block; width: 32px; height: 32px;');
        
        // Get the icon URL for this stat, or fallback to first 2 letters in SVG
        const iconUrl = statIcons[cleanStatName];
        
        if(iconUrl){
          // Use image icon
          const img = document.createElement('img');
          img.src = iconUrl;
          img.alt = cleanStatName;
          img.title = cleanStatName;
          img.style.width = '32px';
          img.style.height = '32px';
          img.style.display = 'block';
          statContainer.appendChild(img);
        }else{
          // Fallback: Create an SVG with the two letters (for stats without icons)
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('width', '32');
          svg.setAttribute('height', '32');
          svg.setAttribute('viewBox', '0 0 32 32');
          svg.style.display = 'block';
          
          // Background rectangle
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('width', '32');
          rect.setAttribute('height', '32');
          rect.setAttribute('fill', '#f0f0f0');
          rect.setAttribute('stroke', '#ccc');
          rect.setAttribute('stroke-width', '1');
          svg.appendChild(rect);
          
          // Text with stat abbreviation
          const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          svgText.setAttribute('x', '16');
          svgText.setAttribute('y', '20');
          svgText.setAttribute('text-anchor', 'middle');
          svgText.setAttribute('font-size', '14');
          svgText.setAttribute('font-weight', 'bold');
          svgText.setAttribute('font-family', 'Arial, sans-serif');
          svgText.setAttribute('fill', '#333');
          svgText.textContent = cleanStatName.substring(0, 2).toUpperCase();
          svg.appendChild(svgText);
          
          statContainer.appendChild(svg);
        }
        
        // Create the badge for the number (same as skills)
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = number;
        badge.setAttribute('style', 'position: absolute; bottom: -5px; right: -5px; background-color: rgb(217, 83, 79); color: rgb(255, 255, 255); border-radius: 50%; width: 19px; height: 19px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border: 2px solid rgb(255, 255, 255);');
        statContainer.appendChild(badge);
        
        statBtn.appendChild(statContainer);
      });

      colLeftestStats.dataset.badgesTransformed = '1';
    }catch(e){/*ignore*/}
  }

  // Reapply if removed, and on navigation (SPA)
  function startObservers(){
    // Flag to track if initial DOM transformations have been applied
    let domTransformationsApplied = false;
    
    // MutationObserver to watch for removal of our style element and AJAX content
    const mo = new MutationObserver((mutations)=>{
      const enabled = localStorage.getItem(ENABLE_KEY);
      
      // Only apply theme if enabled
      if(enabled === 'true'){
        // Check if our style element was removed
        const present = !!document.getElementById(STYLE_ID);
        if(!present){
          applyThemeInline(BUNDLED_CSS).catch(()=>{});
        }
        
        // Apply DOM transformations only once (they persist)
        if(!domTransformationsApplied){
          applyDOMTransformations();
          domTransformationsApplied = true;
        }
        
        // Check for new AJAX content that needs styling (editors)
        const hasNewAjaxContent = mutations.some(m => 
          Array.from(m.addedNodes || []).some(n => 
            n.nodeType === 1 && (
              (n.id && n.id.indexOf('ajax-') === 0) ||
              (n.querySelector && n.querySelector('[id^="ajax-"]'))
            )
          )
        );
        
        if(hasNewAjaxContent){
          try{ styleSignatureEditors(); }catch(e){}
          try{ ensureEditorClasses(); }catch(e){}
        }
      }
      
      // Always update toggle button (user needs to see it regardless of theme state)
      try{ insertToggleCSSButton(); }catch(e){}
    });
    mo.observe(document.documentElement || document, { childList: true, subtree: true });

    // catch SPA navigations
    const wrap = (orig) => function(){ const ret = orig.apply(this, arguments); setTimeout(()=> ensureTheme(), 250); return ret; };
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', ()=> setTimeout(()=> ensureTheme(), 250));
  }

  // Ensure all direct child divs of #player-main-panel have the 'row' class
  function ensurePlayerMainPanelRows(){
    try{
      const panel = document.getElementById('player-main-panel');
      if(!panel) return;
      
      // Get all direct child divs
      const childDivs = Array.from(panel.children).filter(child => child.tagName && child.tagName.toLowerCase() === 'div');
      
      childDivs.forEach(div => {
        if(!div.classList.contains('row')){
          div.classList.add('row');
        }
      });
    }catch(e){/*ignore*/}
  }

  // Ensure page-specific scoping classes (members page, etc.)
  function ensurePageScoping(){
    try{
      const isMembers = (location && ( (location.pathname && location.pathname.indexOf('/communaute/membres') === 0) || (location.href && location.href.indexOf('/communaute/membres') !== -1) ));
      document.documentElement.classList.toggle('kr-page-members', !!isMembers);
    }catch(e){/*ignore*/}
  }

  // Apply a theme variant chosen by the user via Tampermonkey UI
  function applyThemeVariant(variant, skipReload = false){
    try{
      // Known variants (shared constant)
      const variants = THEME_VARIANTS.slice();

      if(!variant || variant === 'disable'){
        // Disable theme: clear enabled flag
        localStorage.setItem(ENABLE_KEY, 'false');
        // NOTE: We do NOT remove VARIANT_KEY so we can remember the previous theme choice
        // when re-enabling later
        
        // Reload page to get a clean DOM state (transformations are not reversible)
        if(!skipReload){
          location.reload();
        }
        return;
      }

      // Check if we're enabling from a disabled state (needs reload to apply DOM transformations)
      const wasDisabled = localStorage.getItem(ENABLE_KEY) !== 'true';

      // enable
      localStorage.setItem(ENABLE_KEY, 'true');
      // store the exact slug so it persists across page loads
      localStorage.setItem(VARIANT_KEY, variant);

      // If enabling from disabled state, reload to apply DOM transformations cleanly
      if(wasDisabled && !skipReload){
        location.reload();
        return;
      }

      // If already enabled, just switch variant (no reload needed)
      // remove all variant classes then add the requested one
      THEME_VARIANTS.forEach(v => document.documentElement.classList.remove('kr-theme-variant-'+v));
      try{ document.documentElement.classList.add('kr-theme-variant-'+variant); }catch(e){}

      // Reapply inline style and theme variables
      try{ applyThemeInline(BUNDLED_CSS); }catch(e){}

      // Update navbar logo for the new variant
      try{ replaceNavbarBrand(); }catch(e){}

      // ensure any remaining theme markers are correct
      document.documentElement.classList.add('kr-theme-enabled');
    }catch(e){console.log('applyThemeVariant error', e);}  
  }

  // Insert toggle CSS button in navbar, left of globe button
  function insertToggleCSSButton(){
    try{
      // Check if button already exists to avoid duplication
      if(document.getElementById('kr-toggle-css-btn')) return;

      // Find the openMap button: <a href="" onclick="javascript:openMap();return false;"><i class="fa fa-globe"></i></a>
      const mapBtn = Array.from(document.querySelectorAll('a')).find(a => 
        a.getAttribute('onclick') && a.getAttribute('onclick').indexOf('openMap') !== -1
      );
      if(!mapBtn) return;

      const mapLi = mapBtn.closest('li');
      if(!mapLi || !mapLi.parentElement) return;

      // Create new <li> for the toggle button
      const newLi = document.createElement('li');
      const togglBtn = document.createElement('a');
      togglBtn.href = '';
      togglBtn.id = 'kr-toggle-css-btn';
      togglBtn.innerHTML = '<i class="fa fa-palette"></i>';
      
      // Function to update button title based on current state
      function updateButtonTitle(){
        const enabled = localStorage.getItem(ENABLE_KEY);
        if(enabled === 'false'){
          togglBtn.setAttribute('title', 'Activer la surcharge CSS');
        }else{
          togglBtn.setAttribute('title', 'Désactiver la surcharge CSS');
        }
      }
      
      // Initialize title
      updateButtonTitle();
      
      // Click handler: toggle CSS surcharge state
      togglBtn.addEventListener('click', function(e){
        e.preventDefault();
        const enabled = localStorage.getItem(ENABLE_KEY);
        
        if(enabled !== 'true'){
          // CSS is disabled, re-enable with previous theme (or default to 'kraland')
          applyThemeVariant(localStorage.getItem(VARIANT_KEY) || 'kraland');
        }else{
          // CSS is enabled, disable it (will reload page)
          applyThemeVariant('disable');
        }
        
        return false;
      });

      newLi.appendChild(togglBtn);
      // Insert new <li> before the map <li>
      mapLi.parentElement.insertBefore(newLi, mapLi);
    }catch(e){ console.log('insertToggleCSSButton error', e); }
  }

  // Insert a small UI control on /profil/interface to let the user choose a Tampermonkey theme
  function insertTampermonkeyThemeUI(){
    try{
      if(!(location && location.href && location.href.indexOf('/profil/interface') !== -1)) return;
      // attempt immediate insertion, falling back to polling/observer if the page builds content later
      function tryInsert(){
        try{
          const headings = Array.from(document.querySelectorAll('h4, h3, h2'));
          const target = headings.find(h => (h.textContent||'').trim().toLowerCase().indexOf('thème de base') !== -1);
          if(!target) return false;
          if(document.getElementById('kr-tamper-theme')) return true; // already present

          const container = document.createElement('div');
          container.id = 'kr-tamper-theme';
          container.className = 'well kr-tamper-theme';
          container.innerHTML = `
            <h4>Thème Tampermonkey (Activez le thème de base officiel pour éviter les conflits)</h4>
            <form id="kr-tamper-theme-form" class="form-horizontal">
              <div class="form-group">
                <label class="col-sm-3 control-label">Choix</label>
                <div class="col-sm-9">
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f0.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="disable"> Désactiver la surcharge CSS</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f1.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="kraland"> République de Kraland</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f2.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="empire-brun"> Empire Brun</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f3.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="paladium"> Paladium Corporation</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f4.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="theocratie-seelienne"> Théocratie Seelienne</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f5.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="paradigme-vert"> Paradigme Vert</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f6.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="khanat-elmerien"> Khanat Elmérien</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f7.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="confederation-libre"> Confédération Libre</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f8.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="royaume-ruthvenie"> Royaume de Ruthvénie</label></div>
                </div>
              </div>
            </form>
          `;

          target.parentElement.insertBefore(container, target);

          const form = container.querySelector('#kr-tamper-theme-form');
          function syncUI(){
            const enabled = localStorage.getItem(ENABLE_KEY);
            if(enabled === 'false'){
              const d = form.querySelector('input[value="disable"]'); if(d) d.checked = true;
              return;
            }
            const v = (localStorage.getItem(VARIANT_KEY) || 'kraland');
            const mapped = v;
            const el = form.querySelector('input[value="'+mapped+'"]');
            if(el) el.checked = true;
          }

          form.addEventListener('change', function(e){
            try{
              const sel = form.querySelector('input[name="kr-theme"]:checked');
              if(!sel) return;
              const val = sel.value;
              
              // Show feedback before reload
              try{ 
                const t = document.createElement('div'); 
                t.className='alert alert-success'; 
                t.textContent = val === 'disable' ? 'Désactivation du thème...' : 'Application du thème: '+val; 
                container.appendChild(t); 
              }catch(e){}
              
              // Apply variant (will trigger reload)
              setTimeout(() => {
                if(val === 'disable') applyThemeVariant('disable'); 
                else applyThemeVariant(val);
              }, 300);
            }catch(er){console.log('kr-theme form change error', er);}        
          });

          // initialize UI
          syncUI();
          return true;
        }catch(e){ return false; }
      }

      if(!tryInsert()){
        // try a few times
        let attempts = 0;
        const id = setInterval(()=>{
          attempts++;
          if(tryInsert() || attempts > 25) clearInterval(id);
        }, 200);
      }

    }catch(e){console.log('insertTampermonkeyThemeUI error', e);}  
  }

  // DEBUG: Log page structure
  function debugPageStructure(){
    const footer = document.querySelector('footer, .footer, .contentinfo');
    if(!footer) return;
  }



  // Apply inline styles to signature editor toolbars inserted by AJAX so buttons are white with red text
  function styleSignatureEditors(){
    try{
      // Find editors inserted by AJAX as well as editors present directly on the page (Kramail new post)
      const editors = Array.from(document.querySelectorAll('[id^="ajax-"] form#msg, form#msg, form[name="post_msg"], form'))
        .filter(f => f && (f.querySelector('.btn-toolbar') || f.querySelector('textarea#message, textarea[name="message"], textarea[name="msg"], textarea#msg, textarea')));
      if(editors.length > 0) console.log('styleSignatureEditors: found editors', editors.length);
      editors.forEach(form => {
        if(form.getAttribute('data-kr-styled') === '1') { console.log('styleSignatureEditors: already styled'); return; }
        form.setAttribute('data-kr-styled', '0');
        let attempts = 0;
        const apply = () => {
          attempts++;
          const btns = Array.from(form.querySelectorAll('.btn-toolbar .btn'));
          console.log('styleSignatureEditors: attempt', attempts, 'btns', btns.length);
          if(btns.length){
            btns.forEach(b => {
              try{
                // Skip buttons that appear to be color swatches/pickers: either they or their descendants already have a non-transparent background color.
                const isColorButton = (function(){ try{ const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || ''; const m = href.match(/addtag\('\s*([^']+?)\s*'/i); return !!(m && /^(yellow|orange|fuchsia|red|olive|lightgreen|green|teal|lightblue|blue|navy|purple|indigo|maroon|brown|gray|darkgray|black|white)$/i.test(m[1])); }catch(e){return false;} })();
                const btnHasBg = (function(){
                  try{
                    const cs = getComputedStyle(b);
                    if(cs && cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent' && cs.backgroundColor !== 'rgb(255, 255, 255)') return true;
                    const child = Array.from(b.querySelectorAll('*')).find(el=>{
                      const c = getComputedStyle(el);
                      return c && c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent';
                    });
                    return !!child;
                  }catch(e){ return false; }
                })();
                // If this is a known color-button, remove any white background we may have previously set so the palette shows correctly
                if(isColorButton){
                  try{
                    // Restore or enforce the color swatch background (read from inline 'background' or from addtag color name)
                    const inlineBg = b.style.getPropertyValue('background') || b.style.getPropertyValue('background-color') || '';
                    const mRgb = inlineBg.match(/rgb\([^)]*\)/);
                    if(mRgb){
                      b.style.setProperty('background-color', mRgb[0], 'important');
                      b.style.removeProperty('background-image');
                    }else{
                      // fallback: map common color names to approximate rgb
                      const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || '';
                      const mm = href.match(/addtag\('\s*([^']+?)\s*'/i);
                      const map = { yellow:'rgb(244,172,0)', orange:'rgb(247,116,0)', fuchsia:'rgb(237,97,97)', red:'rgb(213,0,0)', olive:'rgb(128,128,0)', lightgreen:'rgb(33,156,90)', green:'rgb(0,111,0)', teal:'rgb(0,128,128)', lightblue:'rgb(85,119,188)', blue:'rgb(43,43,228)', navy:'rgb(0,0,128)', purple:'rgb(128,0,128)', indigo:'rgb(75,0,130)', maroon:'rgb(128,0,0)', brown:'rgb(94,67,45)', gray:'rgb(128,128,128)', darkgray:'rgb(90,90,90)', black:'rgb(0,0,0)' };
                      if(mm && map[mm[1].toLowerCase()]){
                        b.style.setProperty('background-color', map[mm[1].toLowerCase()], 'important');
                        b.style.removeProperty('background-image');
                      }
                    }
                  }catch(e){}
                }
                if(!btnHasBg && !isColorButton){
                  b.style.setProperty('background-color', getComputedStyle(document.documentElement).getPropertyValue('--kr-surface') || '#fff', 'important');
                  b.style.setProperty('background-image', 'none', 'important');
                }
                b.style.setProperty('color', getComputedStyle(document.documentElement).getPropertyValue('--kr-primary') || '#8b0f0e', 'important');
                b.style.setProperty('border', '1px solid rgba(0,0,0,0.06)', 'important');
                b.style.setProperty('box-shadow', 'none', 'important');
                const icons = b.querySelectorAll('i, .fa, .fas, .far');
                icons.forEach(i => i.style.setProperty('color', 'inherit', 'important'));
              }catch(e){ console.log('styleSignatureEditors: apply error', e); }
            });
            // ensure the form is tagged so CSS rules for editors apply
            try{ form.classList.add('editeur-text'); }catch(e){}
            form.setAttribute('data-kr-styled', '1');
            console.log('styleSignatureEditors: applied to form', form.id || form.parentElement.id);
            try{ setTimeout(() => fixColorButtons(), 20); }catch(e){}
            return;
          }
          if(attempts < 8) setTimeout(apply, 150);
          else console.log('styleSignatureEditors: giving up after attempts', attempts);
        };
        apply();
      });
      // Also apply to standalone toolbars that are not inside a form (e.g., Kramail new post)
      try{
        const pageToolbars = Array.from(document.querySelectorAll('.btn-toolbar'));
        pageToolbars.forEach(tb => {
          try{
            // Consider only toolbars that appear near a message input/textarea
            const nearInput = tb.closest('form') || tb.closest('[id^="ajax-"]') || (tb.nextElementSibling && (tb.nextElementSibling.matches && tb.nextElementSibling.matches('textarea, input'))) || (tb.parentElement && /(message|Votre message|Message)/i.test(tb.parentElement.textContent || ''));
            if(!nearInput) return;
            const btns = Array.from(tb.querySelectorAll('.btn'));
            if(!btns.length) return;
            btns.forEach(b => {
              try{
                const isColorButton = (function(){ try{ const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || ''; const m = href.match(/addtag\('\s*([^']+?)\s*'/i); return !!(m && /^(yellow|orange|fuchsia|red|olive|lightgreen|green|teal|lightblue|blue|navy|purple|indigo|maroon|brown|gray|darkgray|black|white)$/i.test(m[1])); }catch(e){return false;} })();
                const btnHasBg = (function(){ try{ const cs = getComputedStyle(b); if(cs && cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent' && cs.backgroundColor !== 'rgb(255, 255, 255)') return true; const child = Array.from(b.querySelectorAll('*')).find(el=>{ const c = getComputedStyle(el); return c && c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent'; }); return !!child; }catch(e){ return false; } })();
                if(isColorButton){
                  try{
                    const inlineBg = b.style.getPropertyValue('background') || b.style.getPropertyValue('background-color') || '';
                    const mRgb = inlineBg.match(/rgb\([^)]*\)/);
                    if(mRgb){ b.style.setProperty('background-color', mRgb[0], 'important'); b.style.removeProperty('background-image'); }
                    else{
                      const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || '';
                      const mm = href.match(/addtag\('\s*([^']+?)\s*'/i);
                      const map = { yellow:'rgb(244,172,0)', orange:'rgb(247,116,0)', fuchsia:'rgb(237,97,97)', red:'rgb(213,0,0)', olive:'rgb(128,128,0)', lightgreen:'rgb(33,156,90)', green:'rgb(0,111,0)', teal:'rgb(0,128,128)', lightblue:'rgb(85,119,188)', blue:'rgb(43,43,228)', navy:'rgb(0,0,128)', purple:'rgb(128,0,128)', indigo:'rgb(75,0,130)', maroon:'rgb(128,0,0)', brown:'rgb(94,67,45)', gray:'rgb(128,128,128)', darkgray:'rgb(90,90,90)', black:'rgb(0,0,0)' };
                      if(mm && map[mm[1].toLowerCase()]){ b.style.setProperty('background-color', map[mm[1].toLowerCase()], 'important'); b.style.removeProperty('background-image'); }
                    }
                  }catch(e){}
                }
                if(!btnHasBg && !isColorButton){
                  b.style.setProperty('background-color', getComputedStyle(document.documentElement).getPropertyValue('--kr-surface') || '#fff', 'important');
                  b.style.setProperty('background-image', 'none', 'important');
                }
                b.style.setProperty('color', getComputedStyle(document.documentElement).getPropertyValue('--kr-primary') || '#8b0f0e', 'important');
                b.style.setProperty('border', '1px solid rgba(0,0,0,0.06)', 'important');
                b.style.setProperty('box-shadow', 'none', 'important');
                b.setAttribute('data-kr-styled','1');
                const f = b.closest('form'); if(f) f.classList.add('editeur-text');
                const icons = b.querySelectorAll('i, .fa, .fas, .far'); icons.forEach(i=> i.style.setProperty('color','inherit','important'));
              }catch(e){}
            });
            try{ setTimeout(() => fixColorButtons(), 20); }catch(e){}
          }catch(e){}
        });
      }catch(e){}
    }catch(e){console.log('styleSignatureEditors: error', e);}  

  // After styling passes, ensure color selector buttons show their real colors (override any earlier white !important)
  function fixColorButtons(){
    try{
      const map = { yellow:'rgb(244,172,0)', orange:'rgb(247,116,0)', fuchsia:'rgb(237,97,97)', red:'rgb(213,0,0)', olive:'rgb(128,128,0)', lightgreen:'rgb(33,156,90)', green:'rgb(0,111,0)', teal:'rgb(0,128,128)', lightblue:'rgb(85,119,188)', blue:'rgb(43,43,228)', navy:'rgb(0,0,128)', purple:'rgb(128,0,128)', indigo:'rgb(75,0,130)', maroon:'rgb(128,0,0)', brown:'rgb(94,67,45)', gray:'rgb(128,128,128)', darkgray:'rgb(90,90,90)', black:'rgb(0,0,0)', white:'rgb(255,255,255)'};
      const els = Array.from(document.querySelectorAll('a[href*="addtag("]'));
      els.forEach(b => {
        try{
          const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || '';
          const mm = href.match(/addtag\('\s*([^']+?)\s*'/i);
          if(mm && map[mm[1].toLowerCase()]){
            b.style.setProperty('background-color', map[mm[1].toLowerCase()], 'important');
            b.style.setProperty('background-image', 'none', 'important');
            b.setAttribute('data-kr-styled','1');
          }
        }catch(e){}
      });
    }catch(e){}
  }

  // Ensure aggressive scans and observers call fixColorButtons as well


  // Aggressive interval-based scan to catch editors inserted by AJAX when other hooks miss them
  function aggressiveScanEditors(){
    try{
      console.log('aggressiveScanEditors: start');
      let attempts = 0;
      const maxAttempts = 30; // ~6s at 200ms interval
      const id = setInterval(() => {
        attempts++;
        const newBtns = Array.from(document.querySelectorAll('[id^="ajax-"] .btn-toolbar .btn:not([data-kr-styled])'));
        if(newBtns.length){
          console.log('aggressiveScanEditors: found', newBtns.length);
          newBtns.forEach(b => {
            try{
              // Detect known color buttons and skip forcing their background; also remove any white bg we previously applied
              const isColorButton = (function(){ try{ const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || ''; const m = href.match(/addtag\('\s*([^']+?)\s*'/i); return !!(m && /^(yellow|orange|fuchsia|red|olive|lightgreen|green|teal|lightblue|blue|navy|purple|indigo|maroon|brown|gray|darkgray|black|white)$/i.test(m[1])); }catch(e){return false;} })();
              const btnHasBg = (function(){
                  try{
                    const cs = getComputedStyle(b);
                    if(cs && cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent' && cs.backgroundColor !== 'rgb(255, 255, 255)') return true;
                    const child = Array.from(b.querySelectorAll('*')).find(el=>{
                      const c = getComputedStyle(el);
                      return c && c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent';
                    });
                    return !!child;
                  }catch(e){ return false; }
                })();
              if(isColorButton){
                try{
                  const inlineBg = b.style.getPropertyValue('background') || b.style.getPropertyValue('background-color') || '';
                  const mRgb = inlineBg.match(/rgb\([^)]*\)/);
                  if(mRgb){
                    b.style.setProperty('background-color', mRgb[0], 'important');
                    b.style.removeProperty('background-image');
                  }else{
                    const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || '';
                    const mm = href.match(/addtag\('\s*([^']+?)\s*'/i);
                    const map = { yellow:'rgb(244,172,0)', orange:'rgb(247,116,0)', fuchsia:'rgb(237,97,97)', red:'rgb(213,0,0)', olive:'rgb(128,128,0)', lightgreen:'rgb(33,156,90)', green:'rgb(0,111,0)', teal:'rgb(0,128,128)', lightblue:'rgb(85,119,188)', blue:'rgb(43,43,228)', navy:'rgb(0,0,128)', purple:'rgb(128,0,128)', indigo:'rgb(75,0,130)', maroon:'rgb(128,0,0)', brown:'rgb(94,67,45)', gray:'rgb(128,128,128)', darkgray:'rgb(90,90,90)', black:'rgb(0,0,0)' };
                    if(mm && map[mm[1].toLowerCase()]){ b.style.setProperty('background-color', map[mm[1].toLowerCase()], 'important'); b.style.removeProperty('background-image'); }
                  }
                }catch(e){}
              }
              if(!btnHasBg && !isColorButton){
                b.style.setProperty('background-color', getComputedStyle(document.documentElement).getPropertyValue('--kr-surface') || '#fff', 'important');
                b.style.setProperty('background-image', 'none', 'important');
              }
              b.style.setProperty('color', getComputedStyle(document.documentElement).getPropertyValue('--kr-primary') || '#8b0f0e', 'important');
              b.style.setProperty('border', '1px solid rgba(0,0,0,0.06)', 'important');
              b.style.setProperty('box-shadow', 'none', 'important');
              b.setAttribute('data-kr-styled', '1');
              const f = b.closest('form'); if(f) f.classList.add('editeur-text');
              const icons = b.querySelectorAll('i, .fa, .fas, .far');
              icons.forEach(i => i.style.setProperty('color', 'inherit', 'important'));
            }catch(e){console.log('aggressiveScanEditors: apply error', e);} 
          });
          try{ setTimeout(() => fixColorButtons(), 20); }catch(e){}
        }
        if(attempts >= maxAttempts || newBtns.length === 0 && attempts > 3) { console.log('aggressiveScanEditors: clearing after attempts', attempts, 'found', newBtns.length); clearInterval(id); }
      }, 200);
    }catch(e){console.log('aggressiveScanEditors: error', e);} 
  }

  // Periodic starter to re-run scans for a short period to catch late updates
  function startPeriodicEditorChecks(){
    try{
      let ticks = 0;
      const pid = setInterval(()=>{
        ticks++;
        try{ aggressiveScanEditors(); }catch(e){}
        if(ticks > 60) clearInterval(pid);
      }, 1000);
    }catch(e){}
  }

  // Observer that reacts to inserted nodes with id^="ajax-" and immediately applies inline styles
  function observeEditorInsertions(){
    try{
      const applyImmediate = (root)=>{
        try{
          const containers = [];
          if(root.matches && root.matches('[id^="ajax-"]')) containers.push(root);
          containers.push(...Array.from(root.querySelectorAll('[id^="ajax-"]')));
          containers.forEach(c => {
            try{
              const btns = Array.from(c.querySelectorAll('.btn-toolbar .btn'));
              if(btns.length){
                btns.forEach(b => {
                  try{
                    // Detect known color buttons and skip forcing their background; also remove any white bg we previously applied
                    const isColorButton = (function(){ try{ const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || ''; const m = href.match(/addtag\('\s*([^']+?)\s*'/i); return !!(m && /^(yellow|orange|fuchsia|red|olive|lightgreen|green|teal|lightblue|blue|navy|purple|indigo|maroon|brown|gray|darkgray|black|white)$/i.test(m[1])); }catch(e){return false;} })();
                    const btnHasBg = (function(){
                      try{
                        const cs = getComputedStyle(b);
                        if(cs && cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent' && cs.backgroundColor !== 'rgb(255, 255, 255)') return true;
                        const child = Array.from(b.querySelectorAll('*')).find(el=>{
                          const c = getComputedStyle(el);
                          return c && c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent';
                        });
                        return !!child;
                      }catch(e){ return false; }
                    })();
                    if(isColorButton){ try{ b.style.removeProperty('background-color'); b.style.removeProperty('background-image'); }catch(e){} }
                    if(!btnHasBg && !isColorButton){
                      b.style.setProperty('background-color', getComputedStyle(document.documentElement).getPropertyValue('--kr-surface') || '#fff', 'important');
                      b.style.setProperty('background-image', 'none', 'important');
                    }
                    b.style.setProperty('color', getComputedStyle(document.documentElement).getPropertyValue('--kr-primary') || '#8b0f0e', 'important');
                    b.style.setProperty('border', '1px solid rgba(0,0,0,0.06)', 'important');
                    b.style.setProperty('box-shadow', 'none', 'important');
                    b.setAttribute('data-kr-styled','1');
                    const f = b.closest('form'); if(f) f.classList.add('editeur-text');
                    const icons = b.querySelectorAll('i, .fa, .fas, .far');
                    icons.forEach(i => i.style.setProperty('color', 'inherit', 'important'));
                  }catch(e){}
                });
              }
            }catch(e){}
          });
        }catch(e){}
      };

      const m = new MutationObserver((mutations)=>{
        for(const mu of mutations){
          for(const n of Array.from(mu.addedNodes || [])){
            if(n.nodeType !== 1) continue;
            try{ applyImmediate(n); }catch(e){}
          }
        }
      });
      m.observe(document.body || document.documentElement, { childList: true, subtree: true });
      // apply to existing ajax containers on load
      try{ applyImmediate(document); }catch(e){}
    }catch(e){/*ignore*/}
  }
  // Inject a small script into the page context so we can apply inline '!important' styles
  // at the exact moment the site inserts AJAX content (more robust: retry + append to multiple roots)
  function injectPageContextScript(){
    try{
      if(document.getElementById('kr-injected-editor-style')) return;

      function makeScript(){
        const s = document.createElement('script');
        s.id = 'kr-injected-editor-style';
        s.type = 'text/javascript';
        s.textContent = `(function(){
          try{
            window.__kr_editor_injected = true;
            console.log('kr: page-context script initialized');
          }catch(e){}

          function applyToContainer(c){
            try{
              if(!c) return;
              const btns = c.querySelectorAll('.btn-toolbar .btn');
              if(!btns || !btns.length) return;
              btns.forEach(function(b){
                try{
                  // Detect known color buttons and skip forcing their background; also remove any white bg we may have previously set
                  const isColorButton = (function(){ try{ const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || ''; const m = href.match(/addtag\('\s*([^']+?)\s*'/i); return !!(m && /^(yellow|orange|fuchsia|red|olive|lightgreen|green|teal|lightblue|blue|navy|purple|indigo|maroon|brown|gray|darkgray|black|white)$/i.test(m[1])); }catch(e){return false;} })();
                  const btnHasBg = (function(){
                      try{
                        const cs = getComputedStyle(b);
                        if(cs && cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent' && cs.backgroundColor !== 'rgb(255, 255, 255)') return true;
                        const child = Array.from(b.querySelectorAll('*')).find(function(el){
                          const c = getComputedStyle(el);
                          return c && c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent';
                        });
                        return !!child;
                      }catch(e){ return false; }
                    })();
                  if(isColorButton){
                    try{
                      const inlineBg = b.style.getPropertyValue('background') || b.style.getPropertyValue('background-color') || '';
                      const mRgb = inlineBg.match(/rgb\([^)]*\)/);
                      if(mRgb){
                        b.style.setProperty('background-color', mRgb[0], 'important');
                        b.style.removeProperty('background-image');
                      }else{
                        const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || '';
                        const mm = href.match(/addtag\('\s*([^']+?)\s*'/i);
                        const map = { yellow:'rgb(244,172,0)', orange:'rgb(247,116,0)', fuchsia:'rgb(237,97,97)', red:'rgb(213,0,0)', olive:'rgb(128,128,0)', lightgreen:'rgb(33,156,90)', green:'rgb(0,111,0)', teal:'rgb(0,128,128)', lightblue:'rgb(85,119,188)', blue:'rgb(43,43,228)', navy:'rgb(0,0,128)', purple:'rgb(128,0,128)', indigo:'rgb(75,0,130)', maroon:'rgb(128,0,0)', brown:'rgb(94,67,45)', gray:'rgb(128,128,128)', darkgray:'rgb(90,90,90)', black:'rgb(0,0,0)' };
                        if(mm && map[mm[1].toLowerCase()]){ b.style.setProperty('background-color', map[mm[1].toLowerCase()], 'important'); b.style.removeProperty('background-image'); }
                      }
                    }catch(e){}
                  }
                  if(!btnHasBg && !isColorButton){
                    b.style.setProperty('background-color', getComputedStyle(document.documentElement).getPropertyValue('--kr-surface') || '#fff', 'important');
                    b.style.setProperty('background-image', 'none', 'important');
                  }
                  b.style.setProperty('color', getComputedStyle(document.documentElement).getPropertyValue('--kr-primary') || '#8b0f0e', 'important');
                  b.style.setProperty('border', '1px solid rgba(0,0,0,0.06)', 'important');
                  b.style.setProperty('box-shadow', 'none', 'important');
                  b.setAttribute('data-kr-styled','1');
                  try{ var f = b.closest('form'); if(f) f.classList.add('editeur-text'); }catch(e){}
                  const icons = b.querySelectorAll('i, .fa, .fas, .far');
                  icons.forEach(function(i){ try{ i.style.setProperty('color','inherit','important'); }catch(e){} });
                }catch(e){/*ignore*/}
              });
              try{ setTimeout(() => fixColorButtons(), 20); }catch(e){}
            }catch(e){/*ignore*/}
          }

          function wrap(fnName){
            try{
              if(window[fnName] && !window['_kr_wrapped_'+fnName]){
                const orig = window[fnName];
                window[fnName] = function(){
                  const r = orig.apply(this, arguments);
                  setTimeout(function(){
                    try{
                      var id = arguments && arguments[0] ? arguments[0] : null;
                      if(id){ var c = document.getElementById(id); if(c) applyToContainer(c); }
                    }catch(e){}
                    try{ Array.from(document.querySelectorAll('[id^="ajax-"]')).forEach(applyToContainer); }catch(e){}
                  }, 10);
                  return r;
                };
                window['_kr_wrapped_'+fnName] = true;
                console.log('kr: wrapped', fnName);
              }
            }catch(e){/*ignore*/}
          }

          wrap('updateAjax');
          wrap('updateAjaxPost');

          var mo = new MutationObserver(function(muts){
            for(var mu of muts){
              for(var n of Array.from(mu.addedNodes || [])){
                try{
                  if(n && n.nodeType === 1){
                    if(n.id && n.id.indexOf('ajax-') === 0) applyToContainer(n);
                    else if(n.querySelector && n.querySelector('[id^="ajax-"]')) Array.from(n.querySelectorAll('[id^="ajax-"]')).forEach(applyToContainer);
                  }
                }catch(e){}
              }
            }
          });
          mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

          // initial pass
          try{ Array.from(document.querySelectorAll('[id^="ajax-"]')).forEach(applyToContainer); }catch(e){}
        })();`;
        return s;
      }

      // Try to append immediately and retry a few times if needed
      let attempts = 0;
      const maxAttempts = 40; // ~10s
      const tryAppend = () => {
        try{
          if(document.getElementById('kr-injected-editor-style')) return true;
          const s = makeScript();
          try{ (document.head || document.documentElement).appendChild(s); }catch(e){ try{ document.documentElement.appendChild(s); }catch(e){} }
          if(document.getElementById('kr-injected-editor-style')){ console.log('kr: injected script into page context'); return true; }
        }catch(e){/*ignore*/}
        return false;
      };

      if(tryAppend()) return;
      const int = setInterval(()=>{
        attempts++;
        if(tryAppend()){ clearInterval(int); }
        else if(attempts >= maxAttempts){ clearInterval(int); console.log('kr: failed to inject page-context script after attempts'); }
      }, 250);
    }catch(e){console.log('injectPageContextScript error', e);}} 
  }

  // Tag any editor containers with `.editeur-text` so CSS can target them uniformly
  function ensureEditorClasses(){
    try{
      const candidates = Array.from(document.querySelectorAll('[id^="ajax-"] form#msg, [id^="ajax-"] textarea, .col-sm-10 form#msg, .col-sm-10 textarea#message, form[name="post_msg"], textarea#message'));
      if(candidates.length > 0) console.log('ensureEditorClasses: candidates', candidates.length);
      candidates.forEach(el => {
        try{
          const root = el.tagName && el.tagName.toLowerCase() === 'form' ? el : (el.closest('form') || el.parentElement);
          if(root && !root.classList.contains('editeur-text')){
            root.classList.add('editeur-text');
            // also mark to avoid reprocessing
            root.setAttribute('data-kr-styled', root.getAttribute('data-kr-styled') || '0');
            console.log('ensureEditorClasses: tagged', root.id || root.parentElement && root.parentElement.id || 'no-id');
          }
        }catch(e){}
      });
    }catch(e){ console.log('ensureEditorClasses error', e); }
  }

  // ensureSignatureEditors is also invoked from the MutationObserver to catch dynamic insertions
  // Add to startObservers' MO callback earlier (we already trigger styleSignatureEditors() on init)
  

  // Get theme state - single source of truth
  // Initializes localStorage if needed and returns boolean
  function getThemeState(){
    if(localStorage.getItem(ENABLE_KEY) === null){
      localStorage.setItem(ENABLE_KEY, 'false');
    }
    return localStorage.getItem(ENABLE_KEY) === 'true';
  }

  // Initial bootstrap
  (async function init(){
    try{
      // ============================================
      // PHASE 1: INITIALIZATION & CLEANUP
      // ============================================
      // Get the definitive theme state before any modifications
      const themeEnabled = getThemeState();
      console.log('Kraland theme initializing... (enabled:', themeEnabled, ')');
      
      // Clean up any orphaned CSS before page becomes visible
      const existingStyle = document.getElementById(STYLE_ID);
      if(!themeEnabled && existingStyle && existingStyle.parentElement){
        existingStyle.parentElement.removeChild(existingStyle);
      }
      
      // ============================================
      // PHASE 2: UI CONTROLS (always needed)
      // ============================================
      // These are safe to always inject - they allow the user to toggle the theme
      try{ insertToggleCSSButton(); }catch(e){}
      try{ insertTampermonkeyThemeUI(); }catch(e){}
      
      // ============================================
      // PHASE 3: CONDITIONAL THEME SETUP
      // ============================================
      // Only apply theme if explicitly enabled
      if(themeEnabled){
        // Inject CSS first (document-start timing)
        await ensureTheme();
        
        // Wait for DOM to be ready before applying transformations
        if(document.readyState === 'loading'){
          document.addEventListener('DOMContentLoaded', ()=>{
            applyDOMTransformations();
          }, { once: true });
        } else {
          // DOM already loaded
          applyDOMTransformations();
        }
        
        // Extra transforms not covered by applyDOMTransformations
        try{ observeEditorInsertions(); }catch(e){}
        try{ injectPageContextScript(); }catch(e){}
        
        // Set up observers to maintain theme on SPA navigation and DOM changes
        startObservers();
      } else {
        // Theme is disabled - still set up basic observers but they won't apply transformations
        startObservers();
      }

      // DEBUG
      setTimeout(debugPageStructure, 1000);
      // Start periodic editor checks for first 60s to catch late AJAX inserts or missed wrappers
      try{ startPeriodicEditorChecks(); }catch(e){}
      // Move our style element to the end of the <head> after a short delay so it takes precedence over late-loading site CSS
      // BUT ONLY if the theme is enabled
      try{ setTimeout(()=>{ 
        const st = document.getElementById(STYLE_ID); 
        const themeEnabled = localStorage.getItem(ENABLE_KEY) === 'true';
        if(themeEnabled && st && st.parentElement){
          st.parentElement.appendChild(st);
        } else if(!themeEnabled && st && st.parentElement){
          // Remove it if theme is disabled
          st.parentElement.removeChild(st);
        }
      }, 1000); }catch(e){}
      // ensure color pickers show correctly after init
      try{ await new Promise(r => setTimeout(r, 500)); fixColorButtons(); }catch(e){}
      // wrap AJAX update helpers used by the site so we can re-style dynamic inserts
      try{
        // If updateAjax exists now, wrap immediately; otherwise poll until defined
        function wrapUpdateFns(){
          try{
            if(window.updateAjax && typeof window.updateAjax === 'function' && !window._kr_wrapped_updateAjax){
              const _u = window.updateAjax;
              window.updateAjax = function(){ const r = _u.apply(this, arguments); setTimeout(() => styleSignatureEditors(), 50); setTimeout(() => styleSignatureEditors(), 200); setTimeout(() => styleSignatureEditors(), 600); setTimeout(() => ensureEditorClasses(), 60); setTimeout(() => ensureEditorClasses(), 220); setTimeout(() => ensureEditorClasses(), 620); setTimeout(() => aggressiveScanEditors(), 80); setTimeout(() => aggressiveScanEditors(), 240); setTimeout(() => aggressiveScanEditors(), 640); return r; };
              window._kr_wrapped_updateAjax = true;
            }
            if(window.updateAjaxPost && typeof window.updateAjaxPost === 'function' && !window._kr_wrapped_updateAjaxPost){
              const _up = window.updateAjaxPost;
              window.updateAjaxPost = function(){ const r=_up.apply(this, arguments); setTimeout(() => styleSignatureEditors(), 50); setTimeout(() => styleSignatureEditors(), 200); setTimeout(() => styleSignatureEditors(), 600); setTimeout(() => ensureEditorClasses(), 60); setTimeout(() => ensureEditorClasses(), 220); setTimeout(() => ensureEditorClasses(), 620); setTimeout(() => aggressiveScanEditors(), 80); setTimeout(() => aggressiveScanEditors(), 240); setTimeout(() => aggressiveScanEditors(), 640); return r; };
              window._kr_wrapped_updateAjaxPost = true;
            }
          }catch(e){}
        }
        wrapUpdateFns();
        const _wrapInterval = setInterval(()=>{ wrapUpdateFns(); if(window._kr_wrapped_updateAjax && window._kr_wrapped_updateAjaxPost) clearInterval(_wrapInterval); }, 200);
      }catch(e){}

      // click delegation fallback: when anchors with inline updateAjax are clicked, schedule the styling
      try{
        document.addEventListener('click', function(e){
          try{
            const a = e.target.closest && e.target.closest('a[href^="javascript:updateAjax"], a[href^="javascript:updateAjaxPost"]');
            if(a){ setTimeout(() => styleSignatureEditors(), 60); setTimeout(() => styleSignatureEditors(), 200); setTimeout(() => styleSignatureEditors(), 600); setTimeout(() => aggressiveScanEditors(), 80); setTimeout(() => aggressiveScanEditors(), 240); setTimeout(() => aggressiveScanEditors(), 640); }
          }catch(er){}
        }, true);
      }catch(e){}

      // Periodically disable tooltips to catch dynamically added elements
      try{
        setInterval(() => { disableTooltips(); }, 1000);
      }catch(e){}

    }catch(e){ console.error('Kraland theme init failed', e); }
  })();
})();
