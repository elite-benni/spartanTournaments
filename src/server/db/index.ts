import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const url = process.env['DATABASE_URL'] ?? '';
console.log(`[DB] Initializing connection. URL present: ${!!url} (Length: ${url.length})`);
const client = postgres(url);
export const db = drizzle(client, { schema });

/** The Drizzle database handle. */
export type Database = typeof db;
/** A Drizzle transaction handle, as passed to `db.transaction(tx => ...)`. */
export type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0];
/** Accept either the root db or an open transaction for read/query helpers. */
export type DbOrTx = Database | Transaction;

export * from './schema';
