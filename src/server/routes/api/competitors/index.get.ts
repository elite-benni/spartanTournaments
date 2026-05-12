import { defineEventHandler } from 'h3';
import { db, competitors } from '../../../db';

export default defineEventHandler(async () => {
  return db.select().from(competitors).orderBy(competitors.name);
});
