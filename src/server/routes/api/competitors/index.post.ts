import { defineEventHandler, readBody, createError } from 'h3';
import { db, competitors } from '../../../db';
import { requireAdmin } from '../../../session';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const { name } = await readBody<{ name: string }>(event);
  if (!name?.trim()) throw createError({ statusCode: 400, statusMessage: 'Name required' });

  const [created] = await db.insert(competitors).values({ name: name.trim() }).returning();
  return created;
});
