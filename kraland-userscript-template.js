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

      // tag activity icons (members / characters / online) so we can style them
      try{ markActiveIcons(); }catch(e){/*ignore*/}
      try{ replaceMcAnchors(); }catch(e){/*ignore*/}

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
      {text: 'Personnes en ligne', cls: 'kr-icon-online'}
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
      try{ ensureFooterSticky(); }catch(e){}
      try{ relocateKramailToLeft(); }catch(e){}
    });
    mo.observe(document.documentElement || document, { childList: true, subtree: true });

    // catch SPA navigations
    const wrap = (orig) => function(){ const ret = orig.apply(this, arguments); setTimeout(()=> ensureTheme(), 250); return ret; };
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', ()=> setTimeout(()=> ensureTheme(), 250));
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

      // DEBUG
      setTimeout(debugPageStructure, 1000);
    }catch(e){ console.error('Kraland theme init failed', e); }
  })();

})();
