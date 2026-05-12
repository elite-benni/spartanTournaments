import { getIronSession } from 'iron-session';
import { createError } from 'h3';
import type { H3Event } from 'h3';

export interface SessionData {
  role?: 'admin' | 'referee';
}

const sessionOptions = {
  password: process.env['SESSION_SECRET'] ?? 'change-me-in-production-min-32-chars!!',
  cookieName: 'spartan-tournament-session',
  cookieOptions: {
    secure: process.env['NODE_ENV'] === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
  },
};

export async function getSession(event: H3Event) {
  return getIronSession<SessionData>(event.node.req, event.node.res, sessionOptions);
}

export async function requireAdmin(event: H3Event) {
  const session = await getSession(event);
  if (session.role !== 'admin') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  return session;
}

export async function requireReferee(event: H3Event) {
  const session = await getSession(event);
  if (session.role !== 'admin' && session.role !== 'referee') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  return session;
}
