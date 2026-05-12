import { defineEventHandler, getRouterParam, createError } from 'h3';
import { eq } from 'drizzle-orm';
import { db, competitors } from '../../../db';
import { requireAdmin } from '../../../session';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid id' });

  await db.delete(competitors).where(eq(competitors.id, id));
  return { ok: true };
});
