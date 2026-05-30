import { PageServerLoad } from '@analogjs/router';
import { db } from '../../../server/db';
import { PairingReads } from '../../../server/pairing-reads';

export const load = async ({ event }: PageServerLoad) => {
  return PairingReads.findPairings(db);
};
