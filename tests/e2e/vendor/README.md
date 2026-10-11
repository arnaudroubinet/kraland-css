# Bootstrap et jQuery embarqués pour les tests e2e

Ces trois fichiers servent uniquement aux tests e2e (passe « vrai Bootstrap » de la fixture forum). Ils ne sont ni modifiés, ni livrés avec le userscript : `build.js` ne lit que `kraland-theme.css` et `kraland-userscript-template.js`, rien sous `tests/` n'entre dans le bundle.

Le lanceur (`tests/e2e/run.mjs`) et `forum-mobile.mjs` les utilisent par défaut, sans configuration. `KR_BOOTSTRAP_DIR=/autre/dossier` permet de pointer vers d'autres copies (même noms de fichiers). Si le dossier est incomplet, le lanceur sort en exit 2 (jamais un faux vert).

## Origine

Le site Kraland charge :

- `lib/bootstrap-3.3.7/css/bootstrap1.min.css`
- `lib/bootstrap-3.3.7/js/bootstrap.min.js`
- `lib/jquery-3.3.1/jquery-3.3.1.min.js`

| Fichier ici | Version | Licence | SHA-256 |
|---|---|---|---|
| `bootstrap.min.css` | Bootstrap 3.3.7 | MIT | `f75e846cc83bd11432f4b1e21a45f31bc85283d11d372f7b19accd1bf6a2635c` |
| `bootstrap.min.js` | Bootstrap 3.3.7 | MIT | `53964478a7c634e8dad34ecc303dd8048d00dce4993906de1bacf67f663486ef` |
| `jquery.min.js` | jQuery 3.3.1 | MIT | `160a426ff2894252cd7cebbdd6d6b7da8fcd319c65b70468f10b6690c45d02ef` |

Les en-têtes de licence MIT d'origine sont conservés tels quels. Empreintes calculées avec `shasum -a 256`.

## Réserve de provenance

Le CSS du site s'appelle `bootstrap1.min.css` ; il n'a pas été comparé octet pour octet à `bootstrap.min.css` (le site ne l'a pas servi à la vérification). Version identique, contenu non prouvé identique.

## Non utilisés

newsbox 1.0.1 et bootbox 4.4.0, également chargés par le site, ne sont pas utilisés par les tests et ne sont pas embarqués.

## Lint

`tests/e2e/vendor/` est exclu d'ESLint (`eslint.config.js`) et de Stylelint (`.stylelintignore`).
