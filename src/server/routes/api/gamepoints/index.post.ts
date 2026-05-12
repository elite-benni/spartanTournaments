import { defineEventHandler, readBody } from 'h3';
import { eq } from 'drizzle-orm';
import { db, gamePoints } from '../../../db';
import { requireReferee } from '../../../session';

export default defineEventHandler(async (event) => {
  await requireReferee(event);
  const { competitor1Points, competitor2Points, pairingID } = await readBody<{
    competitor1Points: number;
    competitor2Points: number;
    pairingID: number;
  }>(event);

  const existing = await db.select().from(gamePoints).where(eq(gamePoints.pairingID, pairingID));
  if (existing.length === 0) {
    const [created] = await db.insert(gamePoints).values({ competitor1Points, competitor2Points, pairingID }).returning();
    return created;
  }
  const [updated] = await db
    .update(gamePoints)
    .set({ competitor1Points, competitor2Points, updatedAt: new Date() })
    .where(eq(gamePoints.pairingID, pairingID))
    .returning();
  return updated;
});
