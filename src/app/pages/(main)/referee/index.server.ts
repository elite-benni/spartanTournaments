import { db } from '../../../../server/db';
import { PairingReads } from '../../../../server/pairing-reads';

export const load = async () => {
  const openPairings = await PairingReads.findPairings(db, {
    bothCompetitorsAssigned: true,
    unplayedOnly: true,
  });

  return { pairings: openPairings };
};
