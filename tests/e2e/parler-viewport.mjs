// Sonde INERTE : vrai Bootbox 4.4.0 / Bootstrap 3.3.7, intérieur synthétique NON natif Parler.
// Aucun réseau sortant, aucun clic de confirmation. Gestes CDP tactiles, jamais scrollTop/scrollIntoView.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fixture = path.join(root, 'tests/e2e/fixtures/parler');
const vendor = path.join(root, 'tests/e2e/vendor/parler');
const out = process.env.KR_SHOTS || fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'parler-'));
fs.mkdirSync(out, { recursive: true });
const src = fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const form = fs.readFileSync(path.join(fixture, 'model-form.html'), 'utf8');
const text = 'Saisie synthétique conservée : éà [b]test[/b]';
const results = []; let failures = 0; let checks = 0;
function check(value, label) { checks++; console.log(`${value ? 'ok' : 'FAIL'} ${label}`); if (!value) failures++; }
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
async function open({ fallback = false, desktop = false, delayed = false } = {}) {
  const ctx = await browser.newContext({ viewport: desktop ? { width: 1280, height: 720 } : { width: 390, height: 844 }, isMobile: !desktop, hasTouch: !desktop, deviceScaleFactor: 1 });
  const blocked = []; const errors = [];
  await ctx.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === 'http://fixture.invalid' && route.request().method() === 'GET') {
      if (url.pathname === '/jouer/plateau') return route.fulfill({ contentType: 'text/html', path: path.join(fixture, 'model-page.html') });
      if (/^\/native\/[\w.-]+$/.test(url.pathname) && fs.existsSync(path.join(vendor, path.basename(url.pathname)))) return route.fulfill({ path: path.join(vendor, path.basename(url.pathname)) });
    }
    blocked.push(route.request().method() + ' ' + url.href); return route.abort();
  });
  await ctx.addInitScript(({ src, fallback }) => {
    if (fallback) Object.defineProperty(window, 'visualViewport', { value: undefined });
    window.__submits = 0; window.__confirmations = 0;
    window.GM = { xmlHttpRequest: () => {} };
    HTMLFormElement.prototype.submit = () => { window.__submits++; };
    HTMLFormElement.prototype.requestSubmit = () => { window.__submits++; };
    document.addEventListener('submit', e => { e.preventDefault(); window.__submits++; }, true);
    document.addEventListener('click', e => { if (e.target.closest('a')) e.preventDefault(); }, true);
    localStorage.setItem('kr-theme-enabled', 'true'); localStorage.setItem('kr-theme-variant', 'empire-brun-dark');
    new MutationObserver((m, observer) => { if (document.body) { observer.disconnect(); (0, eval)(src); } }).observe(document, { childList: true, subtree: true });
  }, { src, fallback });
  const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message));
  const cdp = await ctx.newCDPSession(page);
  await page.goto('http://fixture.invalid/jouer/plateau'); await page.waitForTimeout(900);
  await page.evaluate(form => { bootbox.confirm({ message: form, buttons: { confirm: { label: 'Valider' }, cancel: { label: 'Annuler' } }, callback: () => { window.__confirmations++; return false; } }); }, delayed ? 'Chargement local inerte' : form);
  await page.waitForTimeout(900);
  if (delayed) {
    check(await page.evaluate(() => !document.querySelector('.bootbox').classList.contains('kr-order-viewport')), 'Ajax : modale vide non ciblée');
    await page.evaluate(form => { document.querySelector('.bootbox-body').innerHTML = form; }, form);
    await page.waitForTimeout(400);
    check(await page.evaluate(() => document.querySelector('.bootbox').classList.contains('kr-order-viewport')), 'Ajax : ordre avec saisie détecté après insertion');
  }
  await page.locator('#message').fill(text);
  await page.evaluate(() => { window.__refs = [document.querySelector('#message'), document.querySelector('form[name=post_msg]'), document.querySelector('[data-bb-handler=confirm]')]; window.__handlers = $._data(window.__refs[2].closest('.bootbox'), 'events').click.map(h => h.handler); });
  const native = await page.evaluate(() => { const f = document.querySelector('form[name=post_msg]'); return { action: f.getAttribute('action'), method: f.method, fields: [...f.elements].map(x => [x.name, x.type, x.required, x.getAttribute('onchange'), x.getAttribute('onclick')]) }; });
  async function snap(label) {
    await page.waitForTimeout(250);
    const measure = ({ label, text, native }) => {
      const b = document.querySelector('[data-bb-handler=confirm]'); const r = b.getBoundingClientRect(); const v = window.visualViewport;
      const top = v?.offsetTop || 0; const height = v?.height || window.innerHeight;
      const x = (r.left + r.right) / 2; const y = (r.top + r.bottom) / 2; const hit = document.elementFromPoint(x, y);
      const nodes = ['.bootbox', '.modal-dialog', '.modal-content', '.modal-body', '.modal-footer'].map(s => { const e = document.querySelector('.bootbox' + (s === '.bootbox' ? '' : ' ' + s)); const rr = e.getBoundingClientRect(); const st = getComputedStyle(e); return { selector: s, top: rr.top, bottom: rr.bottom, height: rr.height, clientHeight: e.clientHeight, scrollHeight: e.scrollHeight, scrollTop: e.scrollTop, overflowY: st.overflowY, maxHeight: st.maxHeight }; });
      const f = document.querySelector('form[name=post_msg]');
      const current = { action: f.getAttribute('action'), method: f.method, fields: [...f.elements].map(x => [x.name, x.type, x.required, x.getAttribute('onchange'), x.getAttribute('onclick')]) };
      const probe = document.createElement('div'); probe.style.cssText = 'position:fixed;visibility:hidden;height:100vh'; document.body.appendChild(probe); const vh = probe.getBoundingClientRect().height; probe.remove();
      return { label, width: innerWidth, innerHeight, viewport: { top, height, width: v?.width || innerWidth, scale: v?.scale || 1, api: !!v }, vh, button: { top: r.top, bottom: r.bottom, height: r.height }, fullyInside: r.top >= top && r.bottom <= top + height && r.left >= 0 && r.right <= (v?.width || innerWidth), hit: hit === b || b.contains(hit), nodes, inputPreserved: document.querySelector('#message').value === text && document.querySelector('#message') === window.__refs[0], nativePreserved: JSON.stringify(current) === JSON.stringify(native) && f === window.__refs[1] && b === window.__refs[2] && $._data(b.closest('.bootbox'), 'events').click.every((h, i) => h.handler === window.__handlers[i]), submits: window.__submits, confirmations: window.__confirmations };
    };
    const raw = await cdp.send('Runtime.evaluate', { expression: '(' + measure.toString() + ')(' + JSON.stringify({ label, text, native }) + ')', returnByValue: true });
    if (raw.exceptionDetails) throw new Error(JSON.stringify(raw.exceptionDetails));
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
  async function gestures() {
    const raw = await cdp.send('Runtime.evaluate', { expression: '({ w: innerWidth, h: window.visualViewport?.height || innerHeight })', returnByValue: true });
    const size = raw.result.value;
    // Hors textarea : body, dialog et gouttière. Gestes tactiles transmis au navigateur.
    for (const x of [20, 15, 2]) {
      await cdp.send('Input.synthesizeScrollGesture', { x, y: Math.min(150, size.h - 20), yDistance: -1200, gestureSourceType: desktop ? 'mouse' : 'touch', speed: 1200 });
    }
    await page.waitForTimeout(200);
  }
  return { ctx, page, cdp, snap, gestures, errors, blocked };
}
try {
  const p = await open();
  // Même expérience CDP que le diagnostic, mais bundle HEAD courant, sans insets artificiels.
  await p.cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true, screenWidth: 390, screenHeight: 600, viewport: { x: 0, y: 0, width: 390, height: 600, scale: 1 } });
  await p.cdp.send('Emulation.setVisibleSize', { width: 390, height: 400 });
  await p.cdp.send('Emulation.clearDeviceMetricsOverride');
  await p.cdp.send('Emulation.setSmallViewportHeightDifferenceOverride', { difference: 200 });
  await p.snap('barres-avant-gestes'); await p.gestures();
  let s = await p.snap('barres-apres-gestes');
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
  await p.page.evaluate(() => { window.__closedModal = document.querySelector('.bootbox'); $('.bootbox').modal('hide'); }); await p.page.waitForTimeout(500);
  await p.cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 320, deviceScaleFactor: 1, mobile: true });
  await p.page.waitForTimeout(250);
  check(await p.page.evaluate(() => !window.__closedModal.classList.contains('kr-order-viewport') && !window.__closedModal.style.getPropertyValue('--kr-order-visible-height')), 'fermeture : marquage/propriétés retirés et listeners déconnectés');
  await p.ctx.close();
  const f = await open({ fallback: true });
  for (const height of [600, 200, 844]) {
    await f.cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height, deviceScaleFactor: 1, mobile: true });
    await f.gestures(); s = await f.snap(`fallback-${height}`);
    check(!s.viewport.api && s.fullyInside && s.hit, `fallback ${height} : sans API visualViewport, bouton atteignable`);
  }
  check(f.errors.length === 0, 'fallback : aucune erreur JavaScript');
  await f.page.evaluate(() => bootbox.alert('Autre modale sans formulaire d’ordre')); await f.page.waitForTimeout(400);
  check(await f.page.evaluate(() => !document.querySelector('.bootbox-alert').classList.contains('kr-order-viewport') && getComputedStyle(document.querySelector('.bootbox-alert')).paddingTop === '30px'), 'autre Bootbox mobile : géométrie historique non ciblée');
  await f.ctx.close();
  const a = await open({ delayed: true });
  await a.cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 320, deviceScaleFactor: 1, mobile: true });
  await a.gestures(); s = await a.snap('ajax-320');
  check(s.fullyInside && s.hit && a.errors.length === 0, 'Ajax : bouton atteignable sans erreur'); await a.ctx.close();
  const d = await open({ desktop: true });
  await d.cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  s = await d.snap('bureau');
  check(s.fullyInside && s.hit, 'bureau : bouton visible');
  check(await d.page.evaluate(() => getComputedStyle(document.querySelector('.bootbox')).paddingTop === '30px'), 'bureau : géométrie historique hors correctif mobile');
  await d.page.evaluate(() => bootbox.alert('Autre modale sans formulaire d’ordre'));
  await d.page.waitForTimeout(400);
  check(await d.page.evaluate(() => !document.querySelector('.bootbox-alert').classList.contains('kr-order-viewport')), 'autre Bootbox : non ciblée');
  check(d.errors.length === 0, 'bureau/autre modale : aucune erreur JavaScript'); await d.ctx.close();
} catch (e) { check(false, e.stack); }
finally { await browser.close(); fs.writeFileSync(path.join(out, 'mesures.json'), JSON.stringify({ checks, failures, results }, null, 2)); console.log(`Parler : ${checks - failures} ok, ${failures} FAIL ; preuves : ${out}`); }
process.exitCode = failures ? 1 : 0;
