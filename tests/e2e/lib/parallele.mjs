// Scénarios indépendants d'un même fragment lancés en parallèle (lot D de l'accélération des tests).
// Chaque scénario ouvre SON propre contexte de navigateur (aucun état partagé, aucune horloge partagée : page.clock est par contexte).
// Les résultats reviennent dans l'ordre des entrées : la suite affiche ensuite ses vérifications dans l'ordre de déclaration, à
// l'identique d'une exécution en série (mêmes libellés, même ordre dans le journal).
// Concurrence : KR_SCENARIOS (défaut 4) ; KR_SCENARIOS=1 rejoue en série (diagnostic).
export const SCENARIOS_CONC = Math.max(1, Number(process.env.KR_SCENARIOS) || 4);

/** Applique `fn(item, index)` à chaque entrée, au plus `conc` à la fois ; résultats dans l'ordre des entrées. */
export async function mapLimit(items, fn, conc = SCENARIOS_CONC) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(conc, items.length) }, async () => {
    while (next < items.length) {
      const i = next;
      next += 1;
      results[i] = await fn(items[i], i);
    }
  }));
  return results;
}
