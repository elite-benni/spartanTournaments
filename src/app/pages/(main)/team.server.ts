import { db, competitors } from '../../../server/db';

export const load = async () => {
  const teams = await db
    .select({ id: competitors.id, name: competitors.name })
    .from(competitors)
    .orderBy(competitors.name);

  return { teams };
};
