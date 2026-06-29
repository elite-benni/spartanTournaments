import { db, gamePoints, pairings } from '../../../server/db';
import { PairingReads } from '../../../server/pairing-reads';

export const load = async () => {
  const [active, gamepoints, pairingsExist] = await Promise.all([
    PairingReads.findActivePairings(db),
    db.select().from(gamePoints),
    db.select({ id: pairings.id }).from(pairings).limit(1),
  ]);

  return { active, gamepoints, hasPairings: pairingsExist.length > 0 };
};
