---
description: "Guide pour travailler sur le projet"
applyTo: "**"
---

# Instructions pour contribuer au projet

Le projet est en français, tu dois échanger en français.

kraland-userscript-main.js ne doit pas être modifié directement, il est généré par build.js

Tu peux modifier kraland-userscript-template.js et kraland-theme.css pour faire tes modifications.

Ce userscript tampermonkey est destiné à être utilisé avec le site http://www.kraland.org uniquement.
Tu ne peux pas modifier le html et le css du site directement, mais uniquement via ce userscript et ce css de surcharge.

Tu dois toujours utiliser playwright mcp tools pour analyser le site et tester les modifications.
Si tu veux tester une modificcation tu dois toujours attendre cinq secondes entre ta modification et le rechargement de la page, pour être sûr que le userscript a bien été mis à jour dans tampermonkey.

Tu en dois pas écrire ou executer de test avec playwright qui s'execute avec NPM. Tu ne peux que tester avec playwright MCP tools.

Tu as interdiction d'utiliser git pour autre chose que reset tes changements.

Tu dois demander l'autorisation avant de prendre un screenshot.

## Stack technique
- Userscript tampermonkey
- CSS de surcharge
- Bootstrap 3

## Workflow
1. Toujours capturer le réel (HTML et CSS) en utilisant playwright mcp tools.
2. Analyser, l'existant et bien définir le changement a apporter.
3. Utiliser context7 pour récupérer la documentation nécessaire.
4. Proposer un plan de modification.
5. Si le plan est validé, faire les modifications.
6. Tester avec playwright mcp tools les changements.
7. Réitérer si nécessaire.