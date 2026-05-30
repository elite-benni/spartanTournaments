import { defineEventHandler } from 'h3';
import { PairingReads } from '../../../pairing-reads';

export default defineEventHandler(async () => {
  return PairingReads.findPairings();
});
