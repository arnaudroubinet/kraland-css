# Galerie de captures

Ouvrir `snapshot/index.html` dans un navigateur (double-clic suffit, aucun serveur nécessaire).

## Organisation

```
snapshot/<thème>/<dimension>/<écran>.png
```

- **16 thèmes** : les choix du panneau d'options (8 nations, chacune en clair et en sombre).
- **7 dimensions**, les paliers que la peau et le script distinguent réellement :

| Dossier | Fenêtre | Ce qui change |
|---|---|---|
| `1-mobile-etroit` | 320 × 640, tactile | mode mobile + règles sous 360 px (boutons réduits à l'icône, etc.) |
| `2-mobile` | 360 × 800, tactile (Galaxy S21) | mode mobile (`body.mobile-mode`, `max-width: 767px`) |
| `3-tablette` | 768 × 1024, tactile | mise en page ordinateur, règles `hover: none` / `pointer: coarse` |
| `4-ordinateur` | 1280 × 720, souris | mise en page ordinateur standard |
| `5-full-hd` | 1920 × 1080 | conteneur élargi à 1860 px |
| `6-qhd` | 2560 × 1440 | conteneur 2400 px, colonnes du plateau resserrées |
| `7-4k` | 3840 × 2160 | conteneur 3200 px, typographie agrandie |

QHD et 4K sont rendus avec un facteur de pixels réduit (0,75 et 0,5) : la mise en page est bien celle de la largeur annoncée, seules les images sont plus légères.

- **Écrans** : accueil, menu ouvert (mobile seulement), plateau (cartes et objets), personnage, matériel, bâtiments, employés, kramail (réception, lecture, rédaction), forums (racine, sous-forum, sujet, réponse), cybermonde, événements, membres, règles, aide, options d'interface. Les pages longues sont coupées à quatre hauteurs d'écran.

## Navigation dans `index.html`

- Quatre vues : une capture, tous les écrans d'un thème, tous les thèmes pour un écran, toutes les dimensions pour un écran.
- Clavier : ← → écran précédent / suivant, ↑ ↓ thème, 1 à 7 dimension. Clic sur une capture : taille réelle.
- L'adresse garde la sélection (`#vue=…&theme=…`) : un lien copié rouvre la même vue.

## Régénérer

```bash
npm ci
npm run snapshot                                     # tout, puis le manifeste
npm run snapshot -- --themes kraland,paladium-dark   # filtres : --themes, --paliers, --ecrans (ids ou suffixes)
npm run snapshot -- --index                          # seulement snapshot/manifest.js
```

Variables : `KR_SNAPSHOT_JOBS` (captures en parallèle, 6 par défaut), `KR_CHROMIUM` (autre binaire Chromium si Playwright n'a pas le sien).

Le banc n'accède jamais au site réel : les pages sont les fixtures synthétiques de `tests/e2e/fixtures` servies à leurs vraies adresses, avec les feuilles natives du site (`tests/e2e/vendor/parler`), Font Awesome 5.6.3 et les polices Lato, Reenie Beanie et Roboto (devDependencies). Les images du jeu sont remplacées par des carrés gris. Le bundle injecté est `kraland-userscript-main.user.js` : lancer `npm run build` avant si les sources ont changé.
