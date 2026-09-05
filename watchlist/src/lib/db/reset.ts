import {
  closeWatchlistDatabaseForTests,
  deleteWatchlistDatabaseForTests,
  type WatchlistDatabaseOptions,
} from "@/lib/db/bootstrap";
import { resetAuthDatabaseStateForTests } from "@/lib/authDb";
import { resetDrizzleDatabaseStateForTests } from "@/lib/db/drizzle";
import { resetMediaDatabaseStateForTests } from "@/lib/mediaDb";

export type ResetDatabaseOptions = WatchlistDatabaseOptions & {
  deleteFile?: boolean;
};

/**
 * Resets all database-related module state for tests and local development.
 * Set deleteFile to true to remove the SQLite database and sidecar files.
 */
export function resetDatabaseForTests(options: ResetDatabaseOptions = {}) {
  resetMediaDatabaseStateForTests();
  resetAuthDatabaseStateForTests();
  resetDrizzleDatabaseStateForTests();

  if (options.deleteFile) {
    deleteWatchlistDatabaseForTests(options);
    return;
  }

  closeWatchlistDatabaseForTests();
}
