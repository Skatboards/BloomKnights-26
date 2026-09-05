import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

import { openWatchlistDatabase } from "@/lib/db/bootstrap";
import { runWatchlistMigrations } from "@/lib/db/migrate";
import { authSchema } from "@/lib/db/schema/auth";

export type WatchlistDrizzleDatabase = BetterSQLite3Database<typeof authSchema>;

let cachedDrizzleDb: WatchlistDrizzleDatabase | null = null;
let initialized = false;

/**
 * Returns the Drizzle database backed by the application's shared SQLite
 * connection. The existing migration runner remains the source of truth
 * until the authentication schema is migrated in a later stage.
 */
export function getDrizzleDatabase() {
  const sqlite = openWatchlistDatabase();

  if (!initialized) {
    initialized = true;
    runWatchlistMigrations(sqlite);
  }

  if (!cachedDrizzleDb) {
    cachedDrizzleDb = drizzle({ client: sqlite, schema: authSchema });
  }

  return cachedDrizzleDb;
}

/**
 * Clears the Drizzle wrapper after the shared SQLite connection is reset in a
 * test. Production code should not call this function.
 */
export function resetDrizzleDatabaseForTests() {
  cachedDrizzleDb = null;
  initialized = false;
}
