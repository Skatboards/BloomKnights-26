import type Database from "better-sqlite3";
import * as initialMigration from "@/lib/db/migrations/0001_initial";
import * as authMigration from "@/lib/db/migrations/0002_auth";
import * as authjsMigration from "@/lib/db/migrations/0003_authjs_schema";

type Migration = {
  version: number;
  name: string;
  up: (db: Database.Database) => void;
};

const migrations: Migration[] = [initialMigration, authMigration, authjsMigration];

function ensureMigrationsTable(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export function runWatchlistMigrations(db: Database.Database) {
  ensureMigrationsTable(db);

  const appliedVersions = new Set(getAppliedWatchlistMigrationVersions(db));

  const pendingMigrations = migrations
    .slice()
    .sort((left, right) => left.version - right.version)
    .filter((migration) => !appliedVersions.has(migration.version));

  const applyPending = db.transaction(() => {
    for (const migration of pendingMigrations) {
      migration.up(db);
      db.prepare(
        "INSERT INTO schema_migrations (version, name) VALUES (?, ?)",
      ).run(migration.version, migration.name);
    }
  });

  applyPending();
}

export function getAppliedWatchlistMigrationVersions(db: Database.Database) {
  return db
    .prepare("SELECT version FROM schema_migrations ORDER BY version ASC")
    .all()
    .map((row) => Number((row as { version: number }).version));
}
