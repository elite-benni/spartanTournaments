import { defineEventHandler } from 'h3';
import { eq } from 'drizzle-orm';
import { db, pairings, gamePoints } from '../../../db';
import { requireAdmin } from '../../../session';
import { calcNextFinalRound } from 'calc-tournament';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const finalsPairings = (await db.select().from(pairings)).filter((p) => p.groupID < 0);
  const allGamePoints = await db.select().from(gamePoints);
  const [details] = await db.query.tournamentDetails.findMany({ limit: 1 });
  if (!details) return { ok: false };

  const nextRound = calcNextFinalRound(finalsPairings, allGamePoints, details.minutesPerGame);

  await Promise.all(
    nextRound.map((p) =>
      p.id
        ? db.update(pairings).set({ competitor1ID: p.competitor1ID, competitor2ID: p.competitor2ID, startTime: p.startTime, court: p.court }).where(eq(pairings.id, p.id))
        : db.insert(pairings).values({ competitor1ID: p.competitor1ID, competitor2ID: p.competitor2ID, round: p.round, groupID: p.groupID, startTime: p.startTime, court: p.court, gamenumber: p.gamenumber ?? 0 })
    )
  );
  return { ok: true };
});
