// ==UserScript==
// @name         Kraland Red Theme (USSR) - Auto Apply
// @namespace    http://www.kraland.org/
// @match        http://www.kraland.org/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function(){
  'use strict';

  const CSS_URL = 'http://localhost:4848/workspace/kraland-css/kraland-theme.css';
  const CACHE_KEY = 'kr_theme_css';
  const ENABLE_KEY = 'kr-theme-enabled';
  const VARIANT_KEY = 'kr-theme-variant';
  const STYLE_ID = 'kraland-theme-style';
  const CHECK_INTERVAL = 2500; // ms

  async function fetchCss(){
    try{
      const r = await fetch(CSS_URL, { cache: 'no-cache' });
      if(r.ok){
        const text = await r.text();
        localStorage.setItem(CACHE_KEY, text);
        console.debug('Kraland theme: fetched css from', CSS_URL);
        return text;
      }
    }catch(e){
      // ignore
    }
    const cached = localStorage.getItem(CACHE_KEY);
    if(cached) return cached;
    return null;
  }

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

      return true;
    }catch(e){ console.error('Kraland theme apply failed', e); return false; }
  }

  function removeTheme(){
    const s = document.getElementById(STYLE_ID); if(s) s.remove(); document.documentElement.classList.remove('kr-theme-enabled');
  }

  async function ensureTheme(){
    const enabled = localStorage.getItem(ENABLE_KEY);
    if(enabled === 'false') return; // user disabled
    const css = await fetchCss();
    if(css) await applyThemeInline(css);
  }

  // Setup toggler UI + variant switcher
  function installToggler(){
    if(document.getElementById('kr-theme-toggle')) return;

    const container = document.createElement('div');
    container.id = 'kr-theme-toggle-container';
    container.style.cssText = 'position:fixed;right:12px;bottom:116px;z-index:999999;padding:8px;border-radius:8px;display:flex;flex-direction:column;gap:6px;align-items:flex-end;';

    const btn = document.createElement('button');
    btn.id = 'kr-theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label','Toggle Kraland theme');
    btn.style.cssText = 'padding:.5rem .9rem;background:#a6120d;color:#fff;border:none;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,.16);font-weight:600;cursor:pointer';
    const updateText = () => { btn.textContent = localStorage.getItem(ENABLE_KEY) === 'false' ? 'Kraland theme: OFF' : 'Kraland theme: ON'; btn.setAttribute('aria-pressed', localStorage.getItem(ENABLE_KEY) === 'false' ? 'false' : 'true'); };
    btn.onclick = () => {
      const off = localStorage.getItem(ENABLE_KEY) !== 'false';
      if(off){ localStorage.setItem(ENABLE_KEY,'false'); removeTheme(); }
      else{ localStorage.setItem(ENABLE_KEY,'true'); ensureTheme(); }
      updateText();
    };

    // Variant selector
    const sel = document.createElement('select');
    sel.id = 'kr-theme-variant';
    sel.style.cssText = 'background:rgba(0,0,0,0.6);color:#fff;border:none;padding:.4rem .6rem;border-radius:6px;font-weight:600;';
    const opt1 = document.createElement('option'); opt1.value = 'urss'; opt1.textContent = 'URSS red';
    const opt2 = document.createElement('option'); opt2.value = 'high-contrast'; opt2.textContent = 'High-contrast';
    sel.appendChild(opt1); sel.appendChild(opt2);
    sel.onchange = () => {
      localStorage.setItem(VARIANT_KEY, sel.value);
      // apply class immediately
      document.documentElement.classList.toggle('kr-theme-high-contrast', sel.value === 'high-contrast');
      // reapply style from cache to ensure variables take effect
      const css = localStorage.getItem(CACHE_KEY);
      if(css) applyThemeInline(css);
    };

    // init
    if(localStorage.getItem(VARIANT_KEY) === null) localStorage.setItem(VARIANT_KEY,'urss');
    sel.value = localStorage.getItem(VARIANT_KEY) || 'urss';

    document.addEventListener('DOMContentLoaded', ()=> updateText());
    updateText();

    container.appendChild(btn);
    container.appendChild(sel);
    document.body.appendChild(container);
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
  // Reapply if removed, and on navigation (SPA)
  function startObservers(){
    // MutationObserver to watch for removal of our style element
    const mo = new MutationObserver((mutations)=>{
      const enabled = localStorage.getItem(ENABLE_KEY);
      if(enabled === 'false') return;
      const present = !!document.getElementById(STYLE_ID);
      if(!present){
        // reapply from cache
        const css = localStorage.getItem(CACHE_KEY);
        if(css) applyThemeInline(css).catch(()=>{});
        else ensureTheme();
      }
      // DOM changes might affect the sidebar composition
      try{ markActiveIcons(); }catch(e){}
      try{ replaceMcAnchors(); }catch(e){}
      try{ ensureFooterPosition(); }catch(e){}
    });
    mo.observe(document.documentElement || document, { childList: true, subtree: true });

    // Polling safety (in case MutationObserver misses)
    setInterval(()=>{
      const enabled = localStorage.getItem(ENABLE_KEY);
      if(enabled === 'false') return;
      if(!document.getElementById(STYLE_ID)){
        const css = localStorage.getItem(CACHE_KEY);
        if(css) applyThemeInline(css).catch(()=>{});
      }
    }, CHECK_INTERVAL);

    // catch SPA navigations
    const wrap = (orig) => function(){ const ret = orig.apply(this, arguments); setTimeout(()=> ensureTheme(), 250); return ret; };
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', ()=> setTimeout(()=> ensureTheme(), 250));
  }

  // Initial bootstrap
  (async function init(){
    try{
      // Apply immediately if enabled
      if(localStorage.getItem(ENABLE_KEY) === null) localStorage.setItem(ENABLE_KEY,'true');
      installToggler();
      await ensureTheme();
      startObservers();
      // initial footer placement
      try{ ensureFooterPosition(); }catch(e){}
      window.addEventListener('resize', ()=> { try{ ensureFooterPosition(); }catch(e){} });

      // Periodically refresh CSS from source (in case of updates)
      setInterval(async ()=>{ if(localStorage.getItem(ENABLE_KEY) === 'false') return; const newCss = await fetchCss(); if(newCss && newCss !== localStorage.getItem(CACHE_KEY)){ applyThemeInline(newCss); console.debug('Kraland theme: updated from source'); } }, 60*1000); // every 60s
    }catch(e){ console.error('Kraland theme init failed', e); }
  })();

})();