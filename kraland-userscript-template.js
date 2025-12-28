// Main script code - CSS bundled inline
(function(){
  'use strict';

  const BUNDLED_CSS = `__CSS_CONTENT__`;
  const ENABLE_KEY = 'kr-theme-enabled';
  const VARIANT_KEY = 'kr-theme-variant';
  const STYLE_ID = 'kraland-theme-style';
  // known theme slugs for persistence and class management
  const THEME_VARIANTS = ['kraland','empire-brun','paladium','theocratie-seelienne','paradigme-vert','khanat-elmerien','confederation-libre','royaume-ruthvenie','high-contrast'];

  async function applyThemeInline(cssText){
    try{
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

      // tag activity icons (members / characters / online) so we can style them
      try{ markActiveIcons(); }catch(e){/*ignore*/}
      try{ replaceMcAnchors(); }catch(e){/*ignore*/}
      try{ replaceSImages(); }catch(e){/*ignore*/}
      try{ reorderBtnGroupXs(); }catch(e){/*ignore*/}
      try{ ensureSexStrong(); }catch(e){/*ignore*/}

      // Ensure dropdown menu anchors remain readable even if other styles override
      try{
        let sd = document.getElementById('kr-dropdown-fix');
        const txt = `#navbar .dropdown-menu > li > a { color: var(--kr-text) !important; }\n#navbar .dropdown-menu > li > a:hover, #navbar .dropdown-menu > li > a:focus { color: var(--kr-primary) !important; background-color: rgba(0,0,0,0.03); }`;
        if(sd) sd.textContent = txt; else { sd = document.createElement('style'); sd.id='kr-dropdown-fix'; sd.textContent = txt; document.head.appendChild(sd); }
      }catch(e){/*ignore*/}

      console.log('✓ Theme applied, CSS length:', cssText.length);
      return true;
    }catch(e){ console.error('Kraland theme apply failed', e); return false; }
  }

  async function ensureTheme(){
    const enabled = localStorage.getItem(ENABLE_KEY);
    if(enabled === 'false') return; // user disabled
    await applyThemeInline(BUNDLED_CSS);
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

  // Ensure footer is fixed and back-to-top button is placed inside it
  function ensureFooterSticky(){
    try{
      const footer = document.querySelector('footer, .footer, .contentinfo');
      if(!footer) return;
      const selectors = ['a[href="#top"]', 'a.to-top', '.back-to-top', '.scroll-top', 'a.well.well-sm'];
      let back = null;
      for(const s of selectors){ back = document.querySelector(s); if(back) break; }
      if(back && back.parentElement !== footer){
        footer.appendChild(back);
        back.classList.add('kraland-back-to-top');
        if(!back.getAttribute('aria-label')) back.setAttribute('aria-label','Remonter en haut');
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

  // Reapply if removed, and on navigation (SPA)
  function startObservers(){
    // MutationObserver to watch for removal of our style element
    const mo = new MutationObserver((mutations)=>{
      const enabled = localStorage.getItem(ENABLE_KEY);
      if(enabled === 'false') return;
      const present = !!document.getElementById(STYLE_ID);
      if(!present){
        applyThemeInline(BUNDLED_CSS).catch(()=>{});
      }
      // DOM changes might affect the sidebar composition
      try{ markActiveIcons(); }catch(e){}
      try{ replaceMcAnchors(); }catch(e){}
      try{ reorderBtnGroupXs(); }catch(e){}
      try{ ensureSexStrong(); }catch(e){}
      try{ ensureFooterSticky(); }catch(e){}
      try{ relocateKramailToLeft(); }catch(e){}
      // style dynamically inserted signature editors
      try{ styleSignatureEditors(); }catch(e){}
      try{ ensureEditorClasses(); }catch(e){}
      try{ aggressiveScanEditors(); }catch(e){}
      // ensure page-scoped classes (e.g., members page) are kept in sync
      try{ ensurePageScoping(); }catch(e){}
    });
    mo.observe(document.documentElement || document, { childList: true, subtree: true });

    // catch SPA navigations
    const wrap = (orig) => function(){ const ret = orig.apply(this, arguments); setTimeout(()=> ensureTheme(), 250); return ret; };
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', ()=> setTimeout(()=> ensureTheme(), 250));
  }

  // Ensure page-specific scoping classes (members page, etc.)
  function ensurePageScoping(){
    try{
      const isMembers = (location && ( (location.pathname && location.pathname.indexOf('/communaute/membres') === 0) || (location.href && location.href.indexOf('/communaute/membres') !== -1) ));
      document.documentElement.classList.toggle('kr-page-members', !!isMembers);
    }catch(e){/*ignore*/}
  }

  // Apply a theme variant chosen by the user via Tampermonkey UI
  function applyThemeVariant(variant){
    try{
      // Known variants (shared constant)
      const variants = THEME_VARIANTS.slice();

      if(!variant || variant === 'disable'){
        // Disable theme: clear enabled flag and remove our style element
        localStorage.setItem(ENABLE_KEY, 'false');
        localStorage.removeItem(VARIANT_KEY);
        const st = document.getElementById(STYLE_ID);
        if(st && st.parentElement) st.parentElement.removeChild(st);
        document.documentElement.classList.remove('kr-theme-enabled');
        // remove any variant classes we previously set
        variants.forEach(v => document.documentElement.classList.remove('kr-theme-variant-'+v));
        return;
      }

      // enable
      localStorage.setItem(ENABLE_KEY, 'true');
      // store the exact slug so it persists across page loads
      localStorage.setItem(VARIANT_KEY, variant);

      // remove all variant classes then add the requested one
      THEME_VARIANTS.forEach(v => document.documentElement.classList.remove('kr-theme-variant-'+v));
      try{ document.documentElement.classList.add('kr-theme-variant-'+variant); }catch(e){}

      // Reapply inline style and theme variables
      try{ applyThemeInline(BUNDLED_CSS); }catch(e){}

      // ensure any remaining theme markers are correct
      document.documentElement.classList.add('kr-theme-enabled');
    }catch(e){console.log('applyThemeVariant error', e);}  
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
            <h4>Thème Tampermonkey</h4>
            <form id="kr-tamper-theme-form" class="form-horizontal">
              <div class="form-group">
                <label class="col-sm-3 control-label">Choix</label>
                <div class="col-sm-9">
                  <div class="radio"><label><input type="radio" name="kr-theme" value="disable"> Désactiver la surcharge CSS</label></div>
                  <div class="radio"><label><input type="radio" name="kr-theme" value="kraland"> Kraland (courant)</label></div>
                  <div class="radio"><label><input type="radio" name="kr-theme" value="empire-brun"> Empire brun</label></div>
                  <div class="radio"><label><input type="radio" name="kr-theme" value="paladium"> Paladium</label></div>
                  <div class="radio"><label><input type="radio" name="kr-theme" value="theocratie-seelienne"> Théocratie Seelienne</label></div>
                  <div class="radio"><label><input type="radio" name="kr-theme" value="paradigme-vert"> Paradigme vert</label></div>
                  <div class="radio"><label><input type="radio" name="kr-theme" value="khanat-elmerien"> Khanat Elmerien</label></div>
                  <div class="radio"><label><input type="radio" name="kr-theme" value="confederation-libre"> Confédération libre</label></div>
                  <div class="radio"><label><input type="radio" name="kr-theme" value="royaume-ruthvenie"> Royaume de Ruthvénie</label></div>
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
            const mapped = v === 'urss' ? 'kraland' : v;
            const el = form.querySelector('input[value="'+mapped+'"]');
            if(el) el.checked = true;
          }

          form.addEventListener('change', function(e){
            try{
              const sel = form.querySelector('input[name="kr-theme"]:checked');
              if(!sel) return;
              const val = sel.value;
              if(val === 'disable') applyThemeVariant('disable'); else applyThemeVariant(val);
              try{ const t = document.createElement('div'); t.className='alert alert-success'; t.textContent='Thème appliqué: '+val; container.appendChild(t); setTimeout(()=> t.parentElement && t.parentElement.removeChild(t), 1400); }catch(e){}
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

    console.log('=== FOOTER DEBUG ===');
    console.log('Footer element:', footer.tagName, footer.className);

    let parent = footer.parentElement;
    let depth = 0;
    while(parent && depth < 5){
      console.log(`Parent ${depth}:`, parent.tagName, parent.className, parent.id);
      parent = parent.parentElement;
      depth++;
    }

    console.log('Body children:', Array.from(document.body.children).map(el => ({
      tag: el.tagName,
      class: el.className,
      id: el.id
    })));
    console.log('===================');
  }

  // Initial bootstrap
  (async function init(){
    try{
      // Apply immediately if enabled
      if(localStorage.getItem(ENABLE_KEY) === null) localStorage.setItem(ENABLE_KEY,'true');
      console.log('Kraland theme initializing...');
      await ensureTheme();
      startObservers();
      try{ ensureFooterSticky(); }catch(e){}
      try{ relocateKramailToLeft(); }catch(e){}
      try{ styleSignatureEditors(); }catch(e){}
      try{ aggressiveScanEditors(); }catch(e){}
      try{ observeEditorInsertions(); }catch(e){}
      try{ injectPageContextScript(); }catch(e){}

      // Ensure page-scoped classes are applied after initial load
      try{ ensurePageScoping(); }catch(e){}
      try{ insertTampermonkeyThemeUI(); }catch(e){}

      // DEBUG
      setTimeout(debugPageStructure, 1000);
      // Start periodic editor checks for first 60s to catch late AJAX inserts or missed wrappers
      try{ startPeriodicEditorChecks(); }catch(e){}
      // Move our style element to the end of the <head> after a short delay so it takes precedence over late-loading site CSS
      try{ setTimeout(()=>{ const st = document.getElementById(STYLE_ID); if(st && st.parentElement) st.parentElement.appendChild(st); }, 1000); }catch(e){}      // ensure color pickers show correctly after init
      try{ setTimeout(fixColorButtons, 500); }catch(e){};
      // wrap AJAX update helpers used by the site so we can re-style dynamic inserts
      try{
        // If updateAjax exists now, wrap immediately; otherwise poll until defined
        function wrapUpdateFns(){
          try{
            if(window.updateAjax && typeof window.updateAjax === 'function' && !window._kr_wrapped_updateAjax){
              const _u = window.updateAjax;
              window.updateAjax = function(){ const r = _u.apply(this, arguments); setTimeout(styleSignatureEditors, 50); setTimeout(styleSignatureEditors, 200); setTimeout(styleSignatureEditors, 600); setTimeout(ensureEditorClasses, 60); setTimeout(ensureEditorClasses, 220); setTimeout(ensureEditorClasses, 620); setTimeout(aggressiveScanEditors, 80); setTimeout(aggressiveScanEditors, 240); setTimeout(aggressiveScanEditors, 640); return r; };
              window._kr_wrapped_updateAjax = true;
            }
            if(window.updateAjaxPost && typeof window.updateAjaxPost === 'function' && !window._kr_wrapped_updateAjaxPost){
              const _up = window.updateAjaxPost;
              window.updateAjaxPost = function(){ const r=_up.apply(this, arguments); setTimeout(styleSignatureEditors, 50); setTimeout(styleSignatureEditors, 200); setTimeout(styleSignatureEditors, 600); setTimeout(ensureEditorClasses, 60); setTimeout(ensureEditorClasses, 220); setTimeout(ensureEditorClasses, 620); setTimeout(aggressiveScanEditors, 80); setTimeout(aggressiveScanEditors, 240); setTimeout(aggressiveScanEditors, 640); return r; };
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
            if(a){ setTimeout(styleSignatureEditors, 60); setTimeout(styleSignatureEditors, 200); setTimeout(styleSignatureEditors, 600); setTimeout(aggressiveScanEditors, 80); setTimeout(aggressiveScanEditors, 240); setTimeout(aggressiveScanEditors, 640); }
          }catch(er){}
        }, true);
      }catch(e){}

    }catch(e){ console.error('Kraland theme init failed', e); }
  })();

  // Apply inline styles to signature editor toolbars inserted by AJAX so buttons are white with red text
  function styleSignatureEditors(){
    try{
      // Find editors inserted by AJAX as well as editors present directly on the page (Kramail new post)
      const editors = Array.from(document.querySelectorAll('[id^="ajax-"] form#msg, form#msg, form[name="post_msg"], form'))
        .filter(f => f && (f.querySelector('.btn-toolbar') || f.querySelector('textarea#message, textarea[name="message"], textarea[name="msg"], textarea#msg, textarea')));
      console.log('styleSignatureEditors: found editors', editors.length);
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
            try{ setTimeout(fixColorButtons, 20); }catch(e){}
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
            try{ setTimeout(fixColorButtons, 20); }catch(e){}
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
          try{ setTimeout(fixColorButtons, 20); }catch(e){}
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
              try{ setTimeout(fixColorButtons, 20); }catch(e){}
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
    }catch(e){console.log('injectPageContextScript error', e);} 
  }  }

  // Tag any editor containers with `.editeur-text` so CSS can target them uniformly
  function ensureEditorClasses(){
    try{
      const candidates = Array.from(document.querySelectorAll('[id^="ajax-"] form#msg, [id^="ajax-"] textarea, .col-sm-10 form#msg, .col-sm-10 textarea#message, form[name="post_msg"], textarea#message'));
      console.log('ensureEditorClasses: candidates', candidates.length);
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
  

})();
