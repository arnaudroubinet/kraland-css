// Main script code - CSS bundled inline
(function(){
  'use strict';

  const BUNDLED_CSS = `__CSS_CONTENT__`;
  const ENABLE_KEY = 'kr-theme-enabled';
  const VARIANT_KEY = 'kr-theme-variant';
  const STYLE_ID = 'kraland-theme-style';

  async function applyThemeInline(cssText){
    try{
      let st = document.getElementById(STYLE_ID);
      if(st){ st.textContent = cssText; }
      else{ st = document.createElement('style'); st.id = STYLE_ID; st.textContent = cssText; document.head.appendChild(st); }
      // add marker class to html so we can scope variants later
      document.documentElement.classList.add('kr-theme-enabled');
      const variant = localStorage.getItem(VARIANT_KEY) || 'urss';
      document.documentElement.classList.toggle('kr-theme-high-contrast', variant === 'high-contrast');

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
        const txt = `#navbar .dropdown-menu > li > a { color: var(--kr-text) !important; }\n#navbar .dropdown-menu > li > a:hover, #navbar .dropdown-menu > li > a:focus { color: var(--kr-red) !important; background-color: rgba(0,0,0,0.03); }`;
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

      // Ensure page-scoped classes are applied after initial load
      try{ ensurePageScoping(); }catch(e){}

      // DEBUG
      setTimeout(debugPageStructure, 1000);
    }catch(e){ console.error('Kraland theme init failed', e); }
  })();

})();
