import { defineEventHandler } from 'h3';
import { db } from '../../../db';

export default defineEventHandler(async () => {
  const [details] = await db.query.tournamentDetails.findMany({ limit: 1 });
  return { tournament: details || null };
});
