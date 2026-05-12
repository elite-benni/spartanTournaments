import { defineEventHandler } from 'h3';
import { lt, inArray } from 'drizzle-orm';
import { db, pairings, gamePoints } from '../../../db';
import { requireAdmin } from '../../../session';
import { calcFinals } from 'calc-tournament';
import { getGroups } from '../competitors/groups.get';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const groups = await getGroups(0);
  const allPairings = await db.select().from(pairings);
  const allGamePoints = await db.select().from(gamePoints);
  const [details] = await db.query.tournamentDetails.findMany({ limit: 1 });
  if (!details) return { ok: false };

  const finalPairings = calcFinals(
    groups, allPairings, allGamePoints,
    details.finalistCount, details.finalsStartTime,
    details.numberOfParallelGames, details.minutesPerGame
  );

  const finalsPairingIds = allPairings.filter((p) => p.groupID < 0).map((p) => p.id);
  if (finalsPairingIds.length > 0) {
    await db.delete(gamePoints).where(inArray(gamePoints.pairingID, finalsPairingIds));
  }
  await db.delete(pairings).where(lt(pairings.groupID, 0));

  if (finalPairings.length > 0) {
    await db.insert(pairings).values(
      finalPairings.map((p) => ({
        competitor1ID: p.competitor1ID,
        competitor2ID: p.competitor2ID,
        round: p.round,
        groupID: p.groupID,
        startTime: p.startTime,
        court: p.court,
        gamenumber: p.gamenumber ?? 0,
      }))
    );
  }
  return { ok: true };
});
