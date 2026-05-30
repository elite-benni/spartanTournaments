import { PageServerLoad } from '@analogjs/router';
import { eq } from 'drizzle-orm';
import { db, gamePoints, competitors } from '../../../../server/db';
import { PairingReads } from '../../../../server/pairing-reads';
import { TournamentStandings } from '../../../../server/tournament-standings';

export const load = async ({ event, params }: PageServerLoad) => {
  const id = Number(params?.['id']);
  if (!id) return { competitor: null, pairings: [], gamepoints: [], groups: [] };

  const competitor = (await db.select().from(competitors).where(eq(competitors.id, id)))[0];
  if (!competitor) {
    return { competitor: null, pairings: [], gamepoints: [], groups: [] };
  }

  const groupId = competitor.groupID ?? 0;

  const [joinedPairings, allGps, groups] = await Promise.all([
    PairingReads.findPairings(db, { competitorId: id }),
    db.select().from(gamePoints),
    groupId > 0 ? TournamentStandings.getGroupsStandings(db, id) : Promise.resolve([]),
  ]);

  return {
    competitor,
    pairings: joinedPairings,
    gamepoints: allGps,
    groups,
  };
};
