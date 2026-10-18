// Chargeur du cœur pur (lot F, décision d'Elisabeth sur R3 : option A).
// Le code pur vit dans kraland-userscript-template.js, entre « // @kr-pure-begin <nom> » et « // @kr-pure-end » (indentation de l'IIFE).
// loadPure(nom) extrait CE bloc et l'exécute avec node:vm dans un contexte vide : ni window, ni document, ni stockage, ni console.
// Une référence au navigateur échoue donc au chargement ou à l'appel (ReferenceError), et la lecture statique la refuse aussi.
// Échec franc si le bloc est absent, dupliqué, non fermé, ou si deux blocs s'imbriquent.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export const TEMPLATE = path.join(root, 'kraland-userscript-template.js');

const BEGIN = /^\s*\/\/ @kr-pure-begin\s+(\S+)\s*$/;
const END = /^\s*\/\/ @kr-pure-end\s*$/;
// Globals du navigateur ou du gestionnaire de scripts interdits dans un bloc pur (lecture statique, commentaires et chaînes exclus).
const FORBIDDEN = ['window', 'document', 'localStorage', 'sessionStorage', 'location', 'navigator', 'performance', 'console', 'GM', 'unsafeWindow',
  'jQuery', '$', 'setTimeout', 'setInterval', 'requestAnimationFrame', 'fetch', 'Date', 'Math.random', 'CONFIG', 'InitQueue'];

/** Blocs du texte : Map nom -> { start, end (lignes 1-based des balises), code }. Lève une erreur sur toute balise incohérente. */
export function pureBlocks(text) {
  const lines = text.split('\n');
  const blocks = new Map();
  let open = null;
  lines.forEach((line, i) => {
    const b = line.match(BEGIN);
    if (b) {
      if (open) { throw new Error(`bloc pur « ${b[1]} » ouvert ligne ${i + 1} dans le bloc « ${open.name} » non fermé (ligne ${open.start})`); }
      if (blocks.has(b[1])) { throw new Error(`bloc pur « ${b[1]} » dupliqué (lignes ${blocks.get(b[1]).start} et ${i + 1})`); }
      open = { name: b[1], start: i + 1 };
      return;
    }
    if (/^\s*\/\/\s*@kr-pure-(begin|end)\b/.test(line) && !END.test(line)) { throw new Error(`balise de bloc pur illisible ligne ${i + 1} : ${line.trim()}`); }
    if (END.test(line)) {
      if (!open) { throw new Error(`balise de fermeture sans ouverture ligne ${i + 1}`); }
      blocks.set(open.name, { start: open.start, end: i + 1, code: lines.slice(open.start, i).join('\n') });
      open = null;
    }
  });
  if (open) { throw new Error(`bloc pur « ${open.name} » ouvert ligne ${open.start} et jamais fermé`); }
  return blocks;
}

// Code sans commentaires ni chaînes (approximation suffisante pour le style du template : pas de gabarit imbriqué dans le cœur pur).
function stripCommentsAndStrings(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/.*$/gm, ' ')
    .replace(/'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`/g, "''")
    .replace(/\/(?![*/])(?:\\.|\[(?:\\.|[^\]\\\n])*\]|[^/\\\n[])+\/[gimsuy]*/g, '/r/');
}

/** Références interdites (globals du navigateur) dans le code d'un bloc. */
export function forbiddenRefs(code) {
  const bare = stripCommentsAndStrings(code);
  return FORBIDDEN.filter(name => new RegExp(`(^|[^\\w$.])${name.replace(/[.$]/g, '\\$&')}(?![\\w$])`).test(bare));
}

/** Noms déclarés au premier niveau du bloc (fonctions et constantes, indentation de l'IIFE : 2 espaces). */
export function declaredNames(code) {
  const names = [];
  for (const m of code.matchAll(/^ {2}(?:function\s+([A-Za-z_$][\w$]*)|const\s+([A-Za-z_$][\w$]*))/gm)) { names.push(m[1] || m[2]); }
  return names;
}

const cache = new Map();

/** Copie dans le domaine de Node (tableaux, objets, Set) d'une valeur créée dans le contexte vm : comparable par deepStrictEqual. */
export function plain(value) {
  return globalThis.structuredClone(value);
}

/**
 * Charge le bloc pur `name` du template (ou du texte fourni) : objet { nom: valeur } de ses déclarations de premier niveau.
 * @param {string} name
 * @param {{ text?: string }} [opts] text : contenu à lire à la place du template (contre-preuves)
 */
export function loadPure(name, opts = {}) {
  const text = opts.text ?? fs.readFileSync(TEMPLATE, 'utf8');
  if (!opts.text && cache.has(name)) { return cache.get(name); }
  const block = pureBlocks(text).get(name);
  if (!block) { throw new Error(`bloc pur « ${name} » absent de ${path.basename(TEMPLATE)}`); }
  const bad = forbiddenRefs(block.code);
  if (bad.length) { throw new Error(`bloc pur « ${name} » impur : référence(s) à ${bad.join(', ')}`); }
  const names = declaredNames(block.code);
  if (!names.length) { throw new Error(`bloc pur « ${name} » vide (aucune fonction ni constante de premier niveau)`); }
  const context = vm.createContext(Object.create(null));
  const api = vm.runInContext(`'use strict';\n${block.code}\n;({ ${names.join(', ')} });`, context, { filename: `${path.basename(TEMPLATE)}#${name}`, lineOffset: block.start - 1, timeout: 1000 });
  if (!opts.text) { cache.set(name, api); }
  return api;
}
