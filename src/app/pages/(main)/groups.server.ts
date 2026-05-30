import { PageServerLoad } from '@analogjs/router';
import { db } from '../../../server/db';
import { TournamentStandings } from '../../../server/tournament-standings';

export const load = async ({ event }: PageServerLoad) => {
  return TournamentStandings.getGroupsStandings(db, 0);
};
