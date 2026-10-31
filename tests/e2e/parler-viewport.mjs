// Sonde INERTE : vrai Bootbox 4.4.0 / Bootstrap 3.3.7, intérieur synthétique NON natif Parler.
// Aucun réseau sortant, aucun clic de confirmation. Gestes CDP tactiles, jamais scrollTop/scrollIntoView.
// Navigateur : le Chromium de Playwright de la suite (lot C ; avant : Chrome système). Même preuve rouge : le bundle d'avant le
// correctif (ac0e638) échoue sur les 7 mêmes vérifications (barres, 390x240/180/160, 667x200, repli 200, Ajax).
// Attentes : conditions observables (marqueur data-kr-ready, modale affichée et mise en forme, propriétés de hauteur à jour,
// bandeau de rechargement dans l'état attendu) au lieu de délais fixes. Gestes à 6 000 px/s (×5), sauf le témoin lent
// « barres-apres-gestes » (1 200 px/s, vitesse d'origine), qui garde la physique du geste tactile du diagnostic.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, URL } from 'node:url';
import { Buffer } from 'node:buffer';
import { launchBrowser } from './lib/navigateur.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fixture = path.join(root, 'tests/e2e/fixtures/parler');
const vendor = path.join(root, 'tests/e2e/vendor/parler');
const out = process.env.KR_SHOTS || fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'parler-'));
fs.mkdirSync(out, { recursive: true });
const src = fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const form = fs.readFileSync(path.join(fixture, 'model-form.html'), 'utf8');
const text = 'Saisie synthétique conservée : éà [b]test[/b]';
const results = []; let failures = 0; let checks = 0;
function check(value, label) { checks++; console.log(`${value ? 'ok' : 'FAIL'} ${label}`); if (!value) { failures++; } }
const browser = await launchBrowser();
const FAST = 6000; const SLOW = 1200;
// Condition bornée, sans erreur : la vérification qui suit mesure l'état réel et tranche (une condition jamais atteinte coûte maxMs).
const until = (page, fn, arg, maxMs = 5000) => page.waitForFunction(fn, arg, { timeout: maxMs, polling: 'raf' }).then(() => true, () => false);
const frames = page => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r()))));
// Document-start (bug 6, option debut) : bundle évalué dès que <html> existe, comme modale-ordre.mjs. La page est servie avec un script
// en tête de <head>, avant la balise viewport (le parseur ne livre l'observateur qu'à son premier script) : <body> absent et largeur
// par défaut (≈ 980 px) à l'injection ; l'état relevé à l'injection (window.__krInjection) le prouve.
const pageDebut = fs.readFileSync(path.join(fixture, 'model-page.html'), 'utf8').replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <script>window.__krScriptTete = true;</script>');
if (!pageDebut.includes('__krScriptTete')) { throw new Error('fixture Parler : balise charset introuvable'); }
async function open({ fallback = false, desktop = false, delayed = false, debut = false } = {}) {
  const ctx = await browser.newContext({ viewport: desktop ? { width: 1280, height: 720 } : { width: 390, height: 844 }, isMobile: !desktop, hasTouch: !desktop, deviceScaleFactor: 1 });
  const blocked = []; const errors = [];
  await ctx.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === 'http://fixture.invalid' && route.request().method() === 'GET') {
      if (url.pathname === '/jouer/plateau') { return debut ? route.fulfill({ contentType: 'text/html', body: pageDebut }) : route.fulfill({ contentType: 'text/html', path: path.join(fixture, 'model-page.html') }); }
      if (/^\/native\/[\w.-]+$/.test(url.pathname) && fs.existsSync(path.join(vendor, path.basename(url.pathname)))) { return route.fulfill({ path: path.join(vendor, path.basename(url.pathname)) }); }
    }
    blocked.push(route.request().method() + ' ' + url.href); return route.abort();
  });
  await ctx.addInitScript(({ source, hasFallback, start }) => {
    if (hasFallback) { Object.defineProperty(window, 'visualViewport', { value: undefined }); }
    window.__submits = 0; window.__confirmations = 0; window.__shown = [];
    window.GM = { xmlHttpRequest: () => {} };
    window.HTMLFormElement.prototype.submit = () => { window.__submits++; };
    window.HTMLFormElement.prototype.requestSubmit = () => { window.__submits++; };
    document.addEventListener('submit', e => { e.preventDefault(); window.__submits++; }, true);
    document.addEventListener('click', e => { if (e.target.closest('a')) { e.preventDefault(); } }, true);
    localStorage.setItem('kr-theme-enabled', 'true'); localStorage.setItem('kr-theme-variant', 'empire-brun-dark');
    const go = () => { window.__krInjection = { body: !!document.body, largeur: window.innerWidth }; const script = document.createElement('script'); script.textContent = source; document.documentElement.appendChild(script); script.remove(); };
    const pret = () => (start ? !!document.documentElement : !!document.body);
    if (pret()) { go(); return; }
    new MutationObserver((m, observer) => { if (pret()) { observer.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, { source: src, hasFallback: fallback, start: debut });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message));
  const cdp = await ctx.newCDPSession(page);
  await page.goto('http://fixture.invalid/jouer/plateau');
  // Fin d'initialisation du userscript (html[data-kr-ready]) et Bootbox chargé, au lieu de 900 ms
  await until(page, () => document.documentElement.hasAttribute('data-kr-ready') && !!window.bootbox && !!window.jQuery, null, 15000);
  await page.evaluate(() => { window.jQuery(document).on('shown.bs.modal', e => window.__shown.push(e.target)); });
  await page.evaluate(markup => { window.bootbox.confirm({ message: markup, buttons: { confirm: { label: 'Valider' }, cancel: { label: 'Annuler' } }, callback: () => { window.__confirmations++; return false; } }); }, delayed ? 'Chargement local inerte' : form);
  // Modale affichée (shown.bs.modal, fin du fondu) et mise en forme mobile faite (data-structure-transformed, posé 150 ms après
  // l'insertion par enhanceCharacterModal), au lieu de 900 ms
  await until(page, () => { const m = document.querySelector('.bootbox'); return !!m && window.__shown.includes(m) && (!document.body.classList.contains('mobile-mode') || m.dataset.structureTransformed === 'true'); });
  await frames(page);
  if (delayed) {
    check(await page.evaluate(() => !document.querySelector('.bootbox').classList.contains('kr-order-viewport')), 'Ajax : modale vide non ciblée');
    await page.evaluate(markup => { document.querySelector('.bootbox-body').innerHTML = markup; }, form);
    // Contenu Ajax : l'observateur du userscript marque la modale (condition attendue au lieu de 400 ms)
    await until(page, () => document.querySelector('.bootbox').classList.contains('kr-order-viewport'), null, 3000);
    await frames(page);
    check(await page.evaluate(() => document.querySelector('.bootbox').classList.contains('kr-order-viewport')), 'Ajax : ordre avec saisie détecté après insertion');
  }
  await page.locator('#message').fill(text);
  await page.evaluate(() => { window.__refs = [document.querySelector('#message'), document.querySelector('form[name=post_msg]'), document.querySelector('[data-bb-handler=confirm]')]; window.__handlers = $._data(window.__refs[2].closest('.bootbox'), 'events').click.map(h => h.handler); });
  const native = await page.evaluate(() => { const f = document.querySelector('form[name=post_msg]'); return { action: f.getAttribute('action'), method: f.method, fields: [...f.elements].map(x => [x.name, x.type, x.required, x.getAttribute('onchange'), x.getAttribute('onclick')]) }; });
  // État posé avant une mesure (au lieu de 250 ms) : les redimensionnements ont été distribués (2 images), la hauteur visible
  // reportée sur la modale d'ordre correspond au viewport visible, et le bandeau de rechargement (anti-rebond de 400 ms du
  // userscript, saisie en cours) est dans l'état attendu : présent si la largeur a franchi 768 px depuis le chargement, absent sinon.
  const loadedMobile = !desktop;
  async function settled() {
    await frames(page);
    await until(page, mob => {
      const m = document.querySelector('.bootbox'); const v = window.visualViewport;
      const heightOk = !m || !m.classList.contains('kr-order-viewport') || m.style.getPropertyValue('--kr-order-visible-height') === (v ? v.height : window.innerHeight) + 'px';
      const banner = !!document.getElementById('kr-resize-banner');
      return heightOk && banner === ((window.innerWidth < 768) !== mob);
    }, loadedMobile, 3000);
    await frames(page);
  }
  async function snap(label) {
    await settled();
    const measure = ({ lbl, txt, nat }) => {
      const b = document.querySelector('[data-bb-handler=confirm]'); const r = b.getBoundingClientRect(); const v = window.visualViewport;
      const top = v?.offsetTop || 0; const height = v?.height || window.innerHeight;
      const x = (r.left + r.right) / 2; const y = (r.top + r.bottom) / 2; const hit = document.elementFromPoint(x, y);
      const nodes = ['.bootbox', '.modal-dialog', '.modal-content', '.modal-body', '.modal-footer'].map(s => { const e = document.querySelector('.bootbox' + (s === '.bootbox' ? '' : ' ' + s)); const rr = e.getBoundingClientRect(); const st = getComputedStyle(e); return { selector: s, top: rr.top, bottom: rr.bottom, height: rr.height, clientHeight: e.clientHeight, scrollHeight: e.scrollHeight, scrollTop: e.scrollTop, overflowY: st.overflowY, maxHeight: st.maxHeight }; });
      const f = document.querySelector('form[name=post_msg]');
      const current = { action: f.getAttribute('action'), method: f.method, fields: [...f.elements].map(el => [el.name, el.type, el.required, el.getAttribute('onchange'), el.getAttribute('onclick')]) };
      const probe = document.createElement('div'); probe.style.cssText = 'position:fixed;visibility:hidden;height:100vh'; document.body.appendChild(probe); const vh = probe.getBoundingClientRect().height; probe.remove();
      return { label: lbl, width: window.innerWidth, innerHeight: window.innerHeight, viewport: { top, height, width: v?.width || window.innerWidth, scale: v?.scale || 1, api: !!v }, vh, button: { top: r.top, bottom: r.bottom, height: r.height }, fullyInside: r.top >= top && r.bottom <= top + height && r.left >= 0 && r.right <= (v?.width || window.innerWidth), hit: hit === b || b.contains(hit), nodes, inputPreserved: document.querySelector('#message').value === txt && document.querySelector('#message') === window.__refs[0], nativePreserved: JSON.stringify(current) === JSON.stringify(nat) && f === window.__refs[1] && b === window.__refs[2] && $._data(b.closest('.bootbox'), 'events').click.every((h, i) => h.handler === window.__handlers[i]), submits: window.__submits, confirmations: window.__confirmations };
    };
    const raw = await cdp.send('Runtime.evaluate', { expression: '(' + measure.toString() + ')(' + JSON.stringify({ lbl: label, txt: text, nat: native }) + ')', returnByValue: true });
    if (raw.exceptionDetails) { throw new Error(JSON.stringify(raw.exceptionDetails)); }
    const state = raw.result.value;
    // Capture CDP brute : page.screenshot réappliquerait les métriques Playwright après clear.
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const bytes = Buffer.from(shot.data, 'base64'); fs.writeFileSync(path.join(out, label + '.png'), bytes);
    state.screenshot = { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
    results.push(state);
    check(state.inputPreserved && state.nativePreserved, label + ' : saisie, nœuds, action, champs et handlers conservés');
    check(state.submits === 0 && state.confirmations === 0, label + ' : aucun envoi/confirmation');
    check(Math.abs(state.screenshot.height - state.viewport.height * state.viewport.scale) <= 1, label + ' : capture brute et viewport cohérents ' + JSON.stringify({ screenshot: state.screenshot, viewport: state.viewport }));
    return state;
  }
  async function gestures(speed = FAST) {
    await settled();
    const raw = await cdp.send('Runtime.evaluate', { expression: '({ w: innerWidth, h: window.visualViewport?.height || innerHeight })', returnByValue: true });
    const size = raw.result.value;
    // Hors textarea : body, dialog et gouttière. Gestes tactiles transmis au navigateur.
    for (const x of [20, 15, 2]) {
      await cdp.send('Input.synthesizeScrollGesture', { x, y: Math.min(150, size.h - 20), yDistance: -1200, gestureSourceType: desktop ? 'mouse' : 'touch', speed });
    }
  }
  return { ctx, page, cdp, snap, gestures, errors, blocked };
}
// Fragmentation (lot H, exécution parallèle) : KR_FRAG = transitions, fallback, ajax, bureau, debut, vivaldi ; vide = tout jouer. Chaque scénario ouvre
// SON contexte (open()) : aucun état partagé. « transitions » garde la séquence barres -> transitions -> fermeture d'un seul tenant (même
// page, chaque taille part de la précédente).
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const frag = id => FRAG.length === 0 || FRAG.includes(id);
let s;
try {
  if (frag('transitions')) {
    const p = await open();
    // Même expérience CDP que le diagnostic, mais bundle HEAD courant, sans insets artificiels.
    await p.cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true, screenWidth: 390, screenHeight: 600, viewport: { x: 0, y: 0, width: 390, height: 600, scale: 1 } });
    await p.cdp.send('Emulation.setVisibleSize', { width: 390, height: 400 });
    await p.cdp.send('Emulation.clearDeviceMetricsOverride');
    await p.cdp.send('Emulation.setSmallViewportHeightDifferenceOverride', { difference: 200 });
    await p.snap('barres-avant-gestes'); await p.gestures(SLOW); // témoin lent : vitesse d'origine du diagnostic
    s = await p.snap('barres-apres-gestes');
    check(s.vh > s.viewport.height + 100, 'écart grand/visible réellement reproduit');
    check(s.fullyInside && s.hit, 'barres : Valider intégralement visible et touchable après gestes');
    for (const [width, height] of [[390, 600], [390, 320], [390, 240], [390, 180], [390, 160], [667, 200], [844, 390], [390, 844], [1280, 720], [390, 600]]) {
      await p.cdp.send('Emulation.setSmallViewportHeightDifferenceOverride', { difference: 0 });
      await p.cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 768 });
      await p.gestures(); s = await p.snap(`transition-${width}x${height}`);
      check(s.fullyInside && s.hit, `${width}x${height} : Valider intégralement visible ou atteint par gestes`);
    }
    check(p.errors.length === 0, 'séquence transitions : aucune erreur JavaScript');
    check(!p.blocked.some(x => x.startsWith('POST ')), 'séquence transitions : aucune requête POST');
    await p.page.evaluate(() => { window.__closedModal = document.querySelector('.bootbox'); $('.bootbox').modal('hide'); });
    // Fermeture terminée : Bootbox retire la modale du document après hidden.bs.modal (au lieu de 500 ms)
    await until(p.page, () => !document.body.contains(window.__closedModal));
    await p.cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 320, deviceScaleFactor: 1, mobile: true });
    await frames(p.page); // redimensionnement distribué : un écouteur resté branché aurait remis ses propriétés
    check(await p.page.evaluate(() => !window.__closedModal.classList.contains('kr-order-viewport') && !window.__closedModal.style.getPropertyValue('--kr-order-visible-height')), 'fermeture : marquage/propriétés retirés et listeners déconnectés');
    await p.ctx.close();
  }
  if (frag('fallback')) {
    const f = await open({ fallback: true });
    for (const height of [600, 200, 844]) {
      await f.cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height, deviceScaleFactor: 1, mobile: true });
      await f.gestures(); s = await f.snap(`fallback-${height}`);
      check(!s.viewport.api && s.fullyInside && s.hit, `fallback ${height} : sans API visualViewport, bouton atteignable`);
    }
    check(f.errors.length === 0, 'fallback : aucune erreur JavaScript');
    await f.page.evaluate(() => window.bootbox.alert('Autre modale sans formulaire d’ordre'));
    await until(f.page, () => { const m = document.querySelector('.bootbox-alert'); return !!m && window.__shown.includes(m); }); await frames(f.page);
    check(await f.page.evaluate(() => !document.querySelector('.bootbox-alert').classList.contains('kr-order-viewport') && getComputedStyle(document.querySelector('.bootbox-alert')).paddingTop === '30px'), 'autre Bootbox mobile : géométrie historique non ciblée');
    await f.ctx.close();
  }
  if (frag('ajax')) {
    const a = await open({ delayed: true });
    await a.cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 320, deviceScaleFactor: 1, mobile: true });
    await a.gestures(); s = await a.snap('ajax-320');
    check(s.fullyInside && s.hit && a.errors.length === 0, 'Ajax : bouton atteignable sans erreur'); await a.ctx.close();
  }
  if (frag('bureau')) {
    const d = await open({ desktop: true });
    await d.cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
    s = await d.snap('bureau');
    check(s.fullyInside && s.hit, 'bureau : bouton visible');
    check(await d.page.evaluate(() => getComputedStyle(document.querySelector('.bootbox')).paddingTop === '30px'), 'bureau : géométrie historique hors correctif mobile');
    await d.page.evaluate(() => window.bootbox.alert('Autre modale sans formulaire d’ordre'));
    await until(d.page, () => { const m = document.querySelector('.bootbox-alert'); return !!m && window.__shown.includes(m); }); await frames(d.page);
    check(await d.page.evaluate(() => !document.querySelector('.bootbox-alert').classList.contains('kr-order-viewport')), 'autre Bootbox : non ciblée');
    check(d.errors.length === 0, 'bureau/autre modale : aucune erreur JavaScript'); await d.ctx.close();
  }
  if (frag('debut')) {
    // Bug 6 : bundle évalué avant <body> (document-start), viewport pas encore lue ; la modale de Parler doit être suivie (fenêtre
    // visible reportée) et mise en forme comme quand le bundle est évalué après <body>.
    const b = await open({ debut: true });
    const etat = await b.page.evaluate(() => { const m = document.querySelector('.bootbox'); const v = window.visualViewport; return { injection: window.__krInjection, mobile: document.body.classList.contains('mobile-mode'), transformee: m.dataset.structureTransformed === 'true', suivie: m.classList.contains('kr-order-viewport'), hauteur: m.style.getPropertyValue('--kr-order-visible-height'), attendue: (v ? v.height : window.innerHeight) + 'px' }; });
    check(etat.injection && etat.injection.body === false && etat.injection.largeur >= 768, 'document-start : bundle évalué avant <body>, viewport pas encore lue ' + JSON.stringify(etat.injection));
    check(etat.mobile && etat.transformee, 'document-start : mise en forme mobile de la modale de Parler faite ' + JSON.stringify(etat));
    check(etat.suivie && etat.hauteur === etat.attendue, 'document-start : fenêtre visible suivie (kr-order-viewport, --kr-order-visible-height) ' + JSON.stringify(etat));
    await b.cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 320, deviceScaleFactor: 1, mobile: true });
    await b.gestures(); s = await b.snap('debut-390x320');
    check(s.fullyInside && s.hit, 'document-start 390x320 : Valider intégralement visible ou atteint par gestes');
    check(b.errors.length === 0, 'document-start : aucune erreur JavaScript ' + b.errors.join(' | '));
    await b.ctx.close();
  }
  if (frag('vivaldi')) {
    // Vivaldi mobile : à la fermeture du clavier, la barre d'adresse réapparaît sans resize fiable ; la hauteur mesurée par le JS reste
    // celle d'avant (plus grande que la zone visible). 100dvh borne alors la modale, et focusout relance la mesure.
    const v = await open();
    await v.cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 500, deviceScaleFactor: 1, mobile: true });
    await frames(v.page);
    const inside = () => v.page.evaluate(() => { const b = document.querySelector('[data-bb-handler=confirm]'); const r = b.getBoundingClientRect(); const vv = window.visualViewport; const top = vv?.offsetTop || 0; const h = vv?.height || window.innerHeight; return r.top >= top && r.bottom <= top + h; });
    // Mesure périmée (hauteur sans barre) posée à la main : aucun événement ne la corrige avant la vérification
    await v.page.evaluate(() => document.querySelector('.bootbox').style.setProperty('--kr-order-visible-height', '844px'));
    await frames(v.page);
    check(await inside(), 'vivaldi : mesure JS périmée (844 px pour 500 px visibles), Valider reste dans la zone visible (borne 100dvh)');
    await v.page.evaluate(() => { const m = document.querySelector('#message'); m.dispatchEvent(new window.FocusEvent('focusout', { bubbles: true })); });
    const remesure = await until(v.page, () => document.querySelector('.bootbox').style.getPropertyValue('--kr-order-visible-height') === (window.visualViewport ? window.visualViewport.height : window.innerHeight) + 'px', null, 2000);
    check(remesure, 'vivaldi : fermeture du clavier (focusout), hauteur visible remesurée');
    // Clavier ouvert (champ focalisé, zone visible réduite) : mode compact, pied sur une ligne, plus de place pour la saisie
    await v.cdp.send('Emulation.setDeviceMetricsOverride', { width: 360, height: 380, deviceScaleFactor: 1, mobile: true });
    await v.page.evaluate(() => document.querySelector('#message').focus());
    await until(v.page, () => document.querySelector('.bootbox').classList.contains('kr-keyboard-open'), null, 2000);
    await frames(v.page);
    const compact = await v.page.evaluate(() => { const m = document.querySelector('.bootbox'); const f = m.querySelector('.modal-footer').getBoundingClientRect(); const bd = m.querySelector('.modal-body').getBoundingClientRect(); const b = m.querySelector('[data-bb-handler=confirm]').getBoundingClientRect(); const c = m.querySelector('[data-bb-handler=cancel]').getBoundingClientRect(); const h = window.visualViewport ? window.visualViewport.height : window.innerHeight; return { compact: m.classList.contains('kr-keyboard-open'), pied: f.height, corps: bd.height, ligne: Math.abs(b.top - c.top) < 2, dedans: b.bottom <= h && b.top >= 0, h }; });
    check(compact.compact && compact.ligne && compact.pied <= 70 && compact.corps >= compact.h * 0.75 && compact.dedans, 'vivaldi : clavier ouvert à 360x380, pied compact sur une ligne et corps ≥ 75 % de la zone visible ' + JSON.stringify(compact));
    await v.page.evaluate(() => document.querySelector('#message').blur());
    check(await until(v.page, () => !document.querySelector('.bootbox').classList.contains('kr-keyboard-open'), null, 2000), 'vivaldi : clavier fermé (blur), mode compact retiré');
    await v.page.evaluate(() => { window.__closedModal = document.querySelector('.bootbox'); $('.bootbox').modal('hide'); });
    await until(v.page, () => !document.body.contains(window.__closedModal));
    // Autre Bootbox avec un champ texte (pas textarea#message) : suivie aussi
    await v.page.evaluate(() => window.bootbox.dialog({ message: '<form onsubmit="return false"><p>' + 'Ligne de test. '.repeat(120) + '</p><input type="text" name="nom" class="form-control"></form>', buttons: { confirm: { label: 'Valider', className: 'btn-primary', callback: () => false } } }));
    await until(v.page, () => { const m = document.querySelector('.bootbox'); return !!m && window.__shown.includes(m); });
    await v.cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 320, deviceScaleFactor: 1, mobile: true });
    await frames(v.page); await v.gestures(); await frames(v.page);
    const autre = await v.page.evaluate(() => { const m = document.querySelector('.bootbox'); const b = m.querySelector('[data-bb-handler=confirm]'); const r = b.getBoundingClientRect(); const vv = window.visualViewport; const top = vv?.offsetTop || 0; const h = vv?.height || window.innerHeight; const hit = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2); return { suivie: m.classList.contains('kr-order-viewport'), dedans: r.top >= top && r.bottom <= top + h, touche: hit === b || b.contains(hit) }; });
    check(autre.suivie && autre.dedans && autre.touche, 'vivaldi : Bootbox avec champ texte suivie, Valider visible et touchable à 390x320 ' + JSON.stringify(autre));
    check(v.errors.length === 0, 'vivaldi : aucune erreur JavaScript ' + v.errors.join(' | '));
    await v.ctx.close();
  }
  // Fragment inconnu : aucun scénario joué ne doit pas passer pour un succès.
  if (checks === 0) { check(false, `KR_FRAG=${FRAG.join(',')} : aucun scénario joué (fragments : transitions, fallback, ajax, bureau, debut, vivaldi)`); }
} catch (e) { check(false, e.stack); }
finally { await browser.close(); fs.writeFileSync(path.join(out, 'mesures.json'), JSON.stringify({ checks, failures, results }, null, 2)); console.log(`Parler : ${checks - failures} ok, ${failures} FAIL ; preuves : ${out}`); }
process.exitCode = failures ? 1 : 0;
