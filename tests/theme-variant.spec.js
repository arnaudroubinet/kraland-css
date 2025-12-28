const { chromium } = require('playwright');

(async ()=>{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try{
    await page.goto('http://www.kraland.org/profil/interface', { waitUntil: 'domcontentloaded' });
    // Wait for the Tampermonkey theme UI
    await page.waitForSelector('#kr-tamper-theme', { timeout: 10000 });

    // select 'Empire brun'
    await page.click('#kr-tamper-theme input[value="empire-brun"]');
    // small delay for the script to apply
    await page.waitForTimeout(300);
    // assert localStorage updated
    const ls = await page.evaluate(()=> ({ enabled: localStorage.getItem('kr-theme-enabled'), variant: localStorage.getItem('kr-theme-variant'), classes: Array.from(document.documentElement.classList) }));
    console.log('localStorage after empire-brun:', ls);
    if(ls.enabled !== 'true' || ls.variant !== 'empire-brun') throw new Error('Empire brun not applied');

    // Check that css variable was set (computed style)
    const color = await page.evaluate(()=> getComputedStyle(document.documentElement).getPropertyValue('--kr-red'));
    console.log('--kr-red computed:', color);

    // Navigate away and back to ensure persistence across pages
    await page.goto('http://www.kraland.org/');
    await page.waitForTimeout(200);
    const afterNav = await page.evaluate(()=> ({ variant: localStorage.getItem('kr-theme-variant'), krRed: getComputedStyle(document.documentElement).getPropertyValue('--kr-red'), classes: Array.from(document.documentElement.classList) }));
    console.log('after nav:', afterNav);
    if(afterNav.variant !== 'empire-brun' || !afterNav.classes.some(c => c.indexOf('kr-theme-variant-empire-brun') !== -1)) throw new Error('Theme did not persist across navigation');

    // go back to /profil/interface and ensure the radio is still checked
    await page.goto('http://www.kraland.org/profil/interface');
    await page.waitForSelector('#kr-tamper-theme', { timeout: 10000 });
    const checked = await page.evaluate(()=> { const el = document.querySelector('#kr-tamper-theme input[value="empire-brun"]'); return !!(el && el.checked); });
    if(!checked) throw new Error('Radio not checked after navigation');

    // disable theme
    await page.click('#kr-tamper-theme input[value="disable"]');
    await page.waitForTimeout(200);
    const ls2 = await page.evaluate(()=> ({ enabled: localStorage.getItem('kr-theme-enabled'), variant: localStorage.getItem('kr-theme-variant'), hasStyle: !!document.getElementById('kraland-theme-style') }));
    console.log('localStorage after disable:', ls2);
    if(ls2.enabled !== 'false') throw new Error('disable failed');

    console.log('Theme variant test: OK');
  }catch(e){ console.error('Test failed', e); process.exitCode = 2; }
  finally{ await browser.close(); }
})();