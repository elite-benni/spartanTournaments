import { defineEventHandler } from 'h3';
import { getSession } from '../../../session';

export default defineEventHandler(async (event) => {
  const session = await getSession(event);
  session.destroy();
  return { ok: true };
});
