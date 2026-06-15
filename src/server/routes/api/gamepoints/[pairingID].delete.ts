import { defineEventHandler, getRouterParam, createError } from 'h3';
import { requireAdmin } from '../../../session';
import { MatchRegistry } from '../../../match-registry';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const pairingID = Number(getRouterParam(event, 'pairingID'));
  if (!pairingID) throw createError({ statusCode: 400, statusMessage: 'Invalid pairingID' });

  return MatchRegistry.deleteGamePoint(undefined, pairingID);
});
