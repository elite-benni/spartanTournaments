import { PageServerLoad } from '@analogjs/router';
import { db, gamePoints } from '../../../../server/db';
import { eq } from 'drizzle-orm';
import { PairingReads } from '../../../../server/pairing-reads';

export const load = async ({ params }: PageServerLoad) => {
  const id = Number(params?.['id']);
  if (!id) return { pairing: null, gamepoint: null };

  const p = (await PairingReads.findPairings(db, { pairingId: id }))[0];

  if (!p) {
    return { pairing: null, gamepoint: null };
  }

  const gp = (await db.select().from(gamePoints).where(eq(gamePoints.pairingID, id)))[0] ?? null;

  return { pairing: p, gamepoint: gp };
};
