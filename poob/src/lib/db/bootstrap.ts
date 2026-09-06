import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

export type PoobDatabaseOptions = {
  dataDir?: string;
  fileName?: string;
};

let cachedDb: Database.Database | null = null;

function resolveDataDir(options: PoobDatabaseOptions = {}) {
  return options.dataDir ?? process.env.POOB_DATA_DIR ?? path.join(process.cwd(), "data");
}

function resolveDatabasePath(options: PoobDatabaseOptions = {}) {
  return path.join(resolveDataDir(options), options.fileName ?? "poob.sqlite");
}

export function applyPoobPragmas(db: Database.Database) {
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");
  db.pragma("synchronous = NORMAL");
}

export function openPoobDatabase(options: PoobDatabaseOptions = {}) {
  if (!cachedDb) {
    const databasePath = resolveDatabasePath(options);
    mkdirSync(path.dirname(databasePath), { recursive: true });
    cachedDb = new Database(databasePath);
    applyPoobPragmas(cachedDb);
  }

  return cachedDb;
}

export function shouldSeedDemoData() {
  const explicitSetting = process.env.POOB_SEED_DEMO_DATA;

  if (explicitSetting === "true") {
    return true;
  }

  if (explicitSetting === "false") {
    return false;
  }

  return process.env.NODE_ENV !== "production";
}

/** @internal Used by resetDatabaseForTests to close the shared connection. */
export function closePoobDatabaseForTests() {
  cachedDb?.close();
  cachedDb = null;
}

/**
 * Deletes the configured SQLite database and its SQLite sidecar files.
 * This is intentionally separate from the test connection reset helper.
 *
 * @internal Used by resetDatabaseForTests when a file reset is requested. */
export function deletePoobDatabaseForTests(options: PoobDatabaseOptions = {}) {
  const databasePath = resolveDatabasePath(options);

  closePoobDatabaseForTests();

  for (const pathToRemove of [databasePath, `${databasePath}-wal`, `${databasePath}-shm`]) {
    if (existsSync(pathToRemove)) {
      unlinkSync(pathToRemove);
    }
  }
}
