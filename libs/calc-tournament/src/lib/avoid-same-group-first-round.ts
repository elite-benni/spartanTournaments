import { CalcCompetitor } from '../models/models';

/**
 * Best-effort: reorder a seeded finalist list (in bracket / finalPosition order)
 * so that no first-round pair (indices 0/1, 2/3, …) contains two teams from the
 * same group. For each clashing pair the *lower* seed is swapped with the nearest
 * finalist whose move resolves the clash without creating a new one, keeping the
 * seeding disturbance minimal. If a clash cannot be resolved (e.g. too many
 * finalists from one group) it is left as is.
 */
export function avoidSameGroupFirstRound(finalists: CalcCompetitor[]): void {
  for (let pair = 0; 2 * pair + 1 < finalists.length; pair++) {
    const a = 2 * pair;
    const b = a + 1;
    if (finalists[a].groupID !== finalists[b].groupID) continue;

    let swapWith = -1;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let j = 0; j < finalists.length; j++) {
      if (j === a || j === b) continue;
      const partner = j % 2 === 0 ? j + 1 : j - 1;
      if (partner < 0 || partner >= finalists.length) continue;
      // After swapping b <-> j: pair `a` becomes (a, j); j's pair becomes (partner, b).
      if (finalists[a].groupID === finalists[j].groupID) continue;
      if (finalists[partner].groupID === finalists[b].groupID) continue;

      const distance = Math.abs(j - b);
      if (distance < bestDistance) {
        bestDistance = distance;
        swapWith = j;
      }
    }

    if (swapWith !== -1) {
      const tmp = finalists[b];
      finalists[b] = finalists[swapWith];
      finalists[swapWith] = tmp;
    }
  }
}
