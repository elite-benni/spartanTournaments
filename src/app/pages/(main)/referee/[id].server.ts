import { PageServerLoad } from '@analogjs/router';
import { db, gamePoints } from '../../../../server/db';
import { eq } from 'drizzle-orm';
import { PairingReads } from '../../../../server/pairing-reads';
import { getSession } from '../../../../server/session';

export const load = async ({ params, event }: PageServerLoad) => {
  const session = await getSession(event);
  const role = session.role ?? null;

  const id = Number(params?.['id']);
  if (!id) return { pairing: null, gamepoint: null, role };

  const p = (await PairingReads.findPairings(db, { pairingId: id }))[0];

  if (!p) {
    return { pairing: null, gamepoint: null, role };
  }

  const gp = (await db.select().from(gamePoints).where(eq(gamePoints.pairingID, id)))[0] ?? null;

  return { pairing: p, gamepoint: gp, role };
};
