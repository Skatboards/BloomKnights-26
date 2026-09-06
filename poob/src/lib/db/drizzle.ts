import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

import { openPoobDatabase } from "@/lib/db/bootstrap";
import { runPoobMigrations } from "@/lib/db/migrate";
import { authSchema } from "@/lib/db/schema/auth";

export type PoobDrizzleDatabase = BetterSQLite3Database<typeof authSchema>;

let cachedDrizzleDb: PoobDrizzleDatabase | null = null;
let initialized = false;

/**
 * Returns the Drizzle database backed by the application's shared SQLite
 * connection.
 */
export function getDrizzleDatabase() {
  const sqlite = openPoobDatabase();

  if (!initialized) {
    initialized = true;
    runPoobMigrations(sqlite);
  }

  if (!cachedDrizzleDb) {
    cachedDrizzleDb = drizzle({ client: sqlite, schema: authSchema });
  }

  return cachedDrizzleDb;
}

/**
 * Clears the Drizzle wrapper after the shared SQLite connection is reset in a
 * test. Production code should not call this function.
 *
 * @internal Used by resetDatabaseForTests after the SQLite connection resets. */
export function resetDrizzleDatabaseStateForTests() {
  cachedDrizzleDb = null;
  initialized = false;
}
