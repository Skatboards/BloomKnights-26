import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

export type WatchlistDatabaseOptions = {
  dataDir?: string;
  fileName?: string;
};

let cachedDb: Database.Database | null = null;

function resolveDataDir(options: WatchlistDatabaseOptions = {}) {
  return options.dataDir ?? process.env.WATCHLIST_DATA_DIR ?? path.join(process.cwd(), "data");
}

function resolveDatabasePath(options: WatchlistDatabaseOptions = {}) {
  return path.join(resolveDataDir(options), options.fileName ?? "watchlist.sqlite");
}

export function applyWatchlistPragmas(db: Database.Database) {
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");
  db.pragma("synchronous = NORMAL");
}

export function openWatchlistDatabase(options: WatchlistDatabaseOptions = {}) {
  if (!cachedDb) {
    const databasePath = resolveDatabasePath(options);
    mkdirSync(path.dirname(databasePath), { recursive: true });
    cachedDb = new Database(databasePath);
    applyWatchlistPragmas(cachedDb);
  }

  return cachedDb;
}

export function shouldSeedDemoData() {
  const explicitSetting = process.env.WATCHLIST_SEED_DEMO_DATA;

  if (explicitSetting === "true") {
    return true;
  }

  if (explicitSetting === "false") {
    return false;
  }

  return process.env.NODE_ENV !== "production";
}

export function resetWatchlistDatabaseForTests() {
  cachedDb?.close();
  cachedDb = null;
}
