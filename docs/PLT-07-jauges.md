# PLT-07 — Jauges PV / PM / PP du plateau

## Décision produit

**Choix A, validé par Arnaud : harmonisation visuelle qui conserve les deux segments natifs.**
Ni la jauge « valeur / maximum » à un segment (B) ni un affichage neutre pour PP (C) n'ont été retenus.
La lecture « 0 = vide » était une interprétation, pas la décision d'Arnaud : elle est abandonnée.

## Ce que fait le site d'origine (relevé réel, t_e7e97b55)

Chaque jauge est un `.progress` Bootstrap 3 à deux segments empilés :

- `progress-bar-success` : largeur = part de la valeur, texte caché (`sr-only`) = valeur ;
- `progress-bar-warning` : texte caché = maximum − valeur (« reste jusqu'au maximum »).

Observations réelles : PV 27 (reste 0), PM 25 (reste 0), PP 0 (reste 150, orange plein à 100 %).
Le maximum de PP (150 ?) n'est confirmé nulle part : il n'est donc jamais affiché.

## Ce qui change

| Élément | Avant | Après |
| --- | --- | --- |
| Jauges natives (desktop) | couleurs Bootstrap natives | valeur = `--kr-gauge-pv/pm/pp`, reste = hachures `--kr-gauge-rest` |
| Jauges natives (mobile) | idem | rendu identique au desktop |
| Mini-profil mobile | un seul segment, `max = valeur` (faux) | deux segments aux proportions natives, « valeur · reste N » |
| Sens des segments | aucun | légende visible + infobulle `title` / `aria-label` |
| PP à 0 | orange plein natif | reste plein (hachuré) conservé, valeur à 0 |

Le reste est hachuré (et non uni) pour ne pas se confondre avec la jauge PP, dont la couleur de thème est jaune.

Fichiers : `kraland-userscript-template.js` (`readNativeGauge`, `normalizeNativeGauges`, mini-profil),
`kraland-theme.css` (blocs PLT-07 desktop `min-width: 768px` et mobile `max-width: 767px`).

## Tests : synthétique ou réel ?

`npm run build && npm run test:transitions` : 70 contrôles, tous passés dont 30 pour les jauges (section « Jauges PV/PM/PP »).

- **Observation réelle** : structure DOM, PM 25 reste 0, PP 0 reste 150 (fixture `plateau-minimal.html`).
- **Synthétique** : **PV 20 avec reste 7** (valeur intermédiaire jamais observée sur le site réel). La règle
  « largeur = valeur / maximum » pour une valeur intermédiaire reste donc **non vérifiée sur le site réel**.
- La fixture embarque un extrait de Bootstrap 3 (jauges seulement) ; elle ne remplace pas une vérification
  sur page réelle avec la peau active.
- Captures comparables : `KR_SHOTS=<dossier> npm run test:transitions` écrit `jauges-1512.png` et `jauges-375.png`.

## Reste à faire

- Validation UX du rendu final (captures desktop / mobile) par @ux.
- Vérification sur le site réel avec une valeur intermédiaire, dès qu'un personnage blessé est disponible.
