---
title: "Note d'options de cascade (P1)"
type: 'chore'
ticket: '7'
created: '2026-10-21'
status: 'built'
baseline_revision: '4488aa7b744505bb013cf18dda83ad9b4dc3f87a'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Les règles transverses des épopées 3, 4, 5 et 9 (palette, typographie, rayons, grille, en-têtes) perdront contre les sections mobiles sans garde de page, presque toutes en `!important` (notes-implementation.md, préalable 1). Arnaud doit choisir la stratégie avant ces épopées.

**Approach:** Une note d'options courte, fondée sur des mesures du code, qui présente chaque stratégie avec son coût et son risque, recommande une option et pose une seule question ; la décision d'Arnaud est consignée dans la note et en ligne `Decision:` de l'initiative.

</frozen-after-approval>

## Implementation Notes

Oneshot : un document, aucun code. Mesures relevées le 2026-10-21 en lecture seule (script de comptage des déclarations, grep), reprises dans la note.

## Verification

**Manual checks (if no CLI):**
- La note existe dans le dossier de l'épopée, chaque chiffre renvoie à une mesure, la décision d'Arnaud y est consignée ainsi qu'en ligne `Decision:` de `initiative-harmonisation-ux.md`.

## Review Triage Log

Passe quick du 2026-10-21, toutes corrigées dans la note :
- medium — recommandation fondée sur un lot 1 présenté comme option 4 : il a pratiqué l'option 2 (garde, rien retiré) ; argument réécrit.
- medium — `@layer` écarté sans exposer l'option « couche en `!important` » : ajoutée (option 5) avec son vrai coût.
- medium — garde `:where(body.page-x)` contraire à `:where(html.x)` d'AGENTS.md : classes nouvelles sur `html`, écart du lot 1 signalé.
- low — l.14856 attribuée au lot 1 (vient de « Messages v3 ») ; classes `kr-page-members` et `kr-page-report` omises ; 65 au lieu de 78 styles en ligne ; NOUVEAU SUJET 22 % (134 déclarations) et en-tête « 100 % » contradictoire ; sélecteur de PHASE 5 trop large et `display: inline-flex` omis ; « tout le rendu mobile repose sur PHASE 1-5 » (311 déclarations sur 4 090) ; exemple de spécificité hors du cas transverse ; trois requêtes d'ordinateur en `max-width` omises ; méthode de mesure absente.
- low — aucune question posée, décision non consignée : la question est posée à Arnaud, la décision sera consignée (étape hitl).

Décision d'Arnaud consignée le 2026-10-21 : option 4 (note, initiative, spec).
