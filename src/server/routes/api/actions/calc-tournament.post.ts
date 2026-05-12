import { defineEventHandler } from 'h3';
import { eq, inArray } from 'drizzle-orm';
import { db, competitors, pairings, gamePoints } from '../../../db';
import { requireAdmin } from '../../../session';
import { CalcMostGamesPerCompetitorPlan, type CalcCompetitor, type CalcTournamentDetails } from 'calc-tournament';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const allCompetitors = await db.select().from(competitors);
  const [details] = await db.query.tournamentDetails.findMany({ limit: 1 });
  if (!details) return { ok: false, error: 'No tournament details' };

  const plan = CalcMostGamesPerCompetitorPlan(
    allCompetitors.map((c) => ({ ...c, drawNumber: c.drawNumber ?? 0, groupID: c.groupID ?? 0, diff: 0 }) as CalcCompetitor),
    details as CalcTournamentDetails
  );

  // Delete gamePoints first (avoid orphans), then all pairings
  await db.delete(gamePoints);
  await db.delete(pairings);

  if (plan.pairings.length > 0) {
    await db.insert(pairings).values(
      plan.pairings.map((p) => ({
        competitor1ID: p.competitor1ID,
        competitor2ID: p.competitor2ID,
        round: p.round,
        groupID: p.groupID,
        startTime: p.startTime,
        court: p.court,
        gamenumber: p.gamenumber,
      }))
    );
  }

  await Promise.all(
    plan.groups.flatMap((group) =>
      group.competitors.map((c) =>
        db.update(competitors).set({ groupID: group.id }).where(eq(competitors.id, c.id))
      )
    )
  );

  return { ok: true };
});
