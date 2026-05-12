import { defineEventHandler } from 'h3';
import { db, gamePoints } from '../../../db';

export default defineEventHandler(async () => {
  return db.select().from(gamePoints);
});
