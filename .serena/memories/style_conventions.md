# Style et conventions

## Langue
- Le projet est en français : commentaires, documentation, échanges

## Fichiers à modifier
- `kraland-userscript-template.js` : Pour les modifications JavaScript du userscript
- `kraland-theme.css` : Pour les modifications CSS

## Fichiers générés (NE PAS MODIFIER)
- `kraland-userscript-main.js` : Généré automatiquement par build.js

## CSS
- Utilise Bootstrap 3
- Linting avec stylelint (config standard)
- Règles de style appliquées via `npm run lint:css`

## JavaScript
- Vanilla JavaScript (pas de framework)
- Code pour Tampermonkey uniquement
- Doit fonctionner sur http://www.kraland.org uniquement

## Contraintes techniques
- Impossibilité de modifier le HTML/CSS du site directement (site externe)
- Toutes les modifications doivent se faire en surcharge côté client
- Utilisation obligatoire de Playwright MCP tools pour tests (pas NPM test)
