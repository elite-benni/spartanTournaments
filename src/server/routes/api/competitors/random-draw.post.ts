import { defineEventHandler } from 'h3';
import { eq } from 'drizzle-orm';
import { db, competitors } from '../../../db';
import { requireAdmin } from '../../../session';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const all = await db.select().from(competitors);
  const used = new Set<number>();

  for (const c of all) {
    let n: number;
    do { n = Math.floor(Math.random() * all.length * 100) + 1; } while (used.has(n));
    used.add(n);
    await db.update(competitors).set({ drawNumber: n }).where(eq(competitors.id, c.id));
  }
  return { ok: true };
});
