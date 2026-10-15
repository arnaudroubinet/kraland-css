# PLT-07 — Jauges PV / PM / PP du plateau

## Décision produit

**Choix A, validé par Arnaud : harmonisation visuelle qui conserve les deux segments natifs.**
Ni la jauge « valeur / maximum » à un segment (B) ni un affichage neutre pour PP (C) n'ont été retenus.
La lecture « 0 = vide » était une interprétation, pas la décision d'Arnaud : elle est abandonnée.

## Ce que fait le site d'origine (relevé réel, t_e7e97b55)

Chaque jauge est un `.progress` Bootstrap 3 à deux segments empilés :

- `progress-bar-success` : largeur = part de la valeur, texte caché (`sr-only`) = valeur ;
- `progress-bar-warning` : texte caché = maximum − valeur (« écart au maximum »).

Observations réelles : PV 27 (écart au max 0), PM 25 (écart au max 0), PP 0 (écart au max 150, orange plein à 100 %).
Le maximum de PP (150 ?) n'est confirmé nulle part : il n'est donc jamais affiché.

## Vocabulaire (revue UX, C1)

Le terme « reste » est proscrit : en français de jeu il se lit comme « ce qu'il me reste » (la valeur). Le segment hachuré s'appelle
« **écart au max** » (en-tête du mini-profil, infobulle, `aria-label`) et « écart au maximum » (légendes). Le nombre est affiché même à 0.
La légende desktop est à 12 px (C2). Le contrôle de légende teste l'affichage réel, en desktop et en mobile après dépliage du mini-profil (C3).

## Ce qui change

| Élément | Avant | Après |
| --- | --- | --- |
| Jauges natives (desktop) | couleurs Bootstrap natives | valeur = `--kr-gauge-pv/pm/pp`, écart au max = hachures `--kr-gauge-rest` |
| Jauges natives (mobile) | idem | rendu identique au desktop |
| Mini-profil mobile | un seul segment, `max = valeur` (faux) | deux segments aux proportions natives, « valeur · écart au max N » |
| Sens des segments | aucun | légende visible + infobulle `title` / `aria-label` |
| PP à 0 | orange plein natif | écart au max plein (hachuré) conservé, valeur à 0 |

L'écart au max est hachuré (et non uni) pour ne pas se confondre avec la jauge PP, dont la couleur de thème est jaune.

Fichiers : `kraland-userscript-template.js` (`readNativeGauge`, `normalizeNativeGauges`, mini-profil),
`kraland-theme.css` (blocs PLT-07 desktop `min-width: 768px` et mobile `max-width: 767px`).

## Tests : synthétique ou réel ?

`npm run build && npm run test:transitions` : 70 contrôles, tous passés dont 30 pour les jauges (section « Jauges PV/PM/PP »).

- **Observation réelle** : structure DOM, PM 25 écart au max 0, PP 0 écart au max 150 (fixture `plateau-minimal.html`).
- **Synthétique** : **PV 20 avec écart au max 7** (valeur intermédiaire jamais observée sur le site réel). La règle
  « largeur = valeur / maximum » pour une valeur intermédiaire reste donc **non vérifiée sur le site réel**.
- La fixture embarque un extrait de Bootstrap 3 (jauges seulement) ; elle ne remplace pas une vérification
  sur page réelle avec la peau active.
- Captures comparables : `KR_SHOTS=<dossier> npm run test:transitions` écrit `jauges-1512.png` et `jauges-375.png`.

## Reste à faire

- Validation UX du rendu final (captures desktop / mobile) par @ux.
- Vérification sur le site réel avec une valeur intermédiaire, dès qu'un personnage blessé est disponible.
