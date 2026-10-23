---
title: 'Protocole et vérifications sur un vrai téléphone (P2)'
type: 'chore'
ticket: '1'
created: '2026-10-22'
status: done
baseline_revision: '71d2acd02ba76cbdc39be809bcefe62847178f6b'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: 'none'
review_source: 'auto'
lenses_ran: []
review_loop_iteration: 0
context: []
blocked_at: ""
blocked_reason: ""
---

## Implementation Notes

Protocole écrit le 2026-10-22 : `protocole-p2-vrai-telephone.md` (installation du bundle servi sur le réseau local, points A à G repris de Q17, consigne « annuler, ne rien envoyer »). L'exécution et les résultats reviennent à Arnaud (hitl) ; le ticket est bloqué en attendant.

Résultat (2026-10-23) : point E vérifié par Arnaud sur Vivaldi Android (capture) : la barre « Envoyer » fixe couvre le champ clavier ouvert. Décision d'Arnaud (option B) : ne pas attendre C, D ni les autres points ; même défaut supposé pour « Valider » et « Envoyer » du forum, corrigé par le bouton dans le flux sous le champ (CAP-3, CAP-8). Points A, B, F, G non vérifiés sur téléphone : vérifiés sur fixtures seulement, écarts éventuels traités en bogues. Ticket clos sur décision d'Arnaud.
