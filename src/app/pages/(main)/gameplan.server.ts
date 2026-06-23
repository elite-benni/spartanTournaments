import { PageServerLoad } from '@analogjs/router';
import { getSession } from '../../../server/session';
import { db } from '../../../server/db';
import { PairingReads } from '../../../server/pairing-reads';

export const load = async ({ event }: PageServerLoad) => {
  const session = await getSession(event);

  // Pairings come enriched with their result in `points`.
  const pairings = await PairingReads.findPairings(db);

  return {
    pairings,
    role: session.role ?? null,
  };
};
