// Numéro de version figé pour les comparaisons au bundle de base.
//
// build.js horodate chaque bundle (« 1.0.<horodatage> ») et le pied de page l'affiche (« CSS : version courante 1.0.… »). La police du
// pied a des chiffres proportionnels : deux horodatages de même longueur n'ont pas la même largeur, et la ligne centrée se décale de
// quelques pixels. Les contrôles « textes égaux au bundle de base » échouaient donc selon l'horodatage du build, sans écart réel.
// figerVersion remplace l'horodatage de tout bundle par celui du bundle testé (KR_SCRIPT, sinon kraland-userscript-main.user.js) : le
// bundle testé reste inchangé, les bundles de base affichent le même numéro.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const VERSION = /(["'])1\.0\.\d{6,}\1/g;

let reference = null;
function versionTestee() {
  if (reference === null) {
    const src = fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8');
    const m = src.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '').match(/(["'])(1\.0\.\d{6,})\1/);
    reference = m ? m[2] : '';
  }
  return reference;
}

export function figerVersion(src) {
  const v = versionTestee();
  return v ? src.replace(VERSION, (_m, q) => `${q}${v}${q}`) : src;
}
