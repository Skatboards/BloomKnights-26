import {
  closePoobDatabaseForTests,
  deletePoobDatabaseForTests,
  type PoobDatabaseOptions,
} from "@/lib/db/bootstrap";
import { resetAuthDatabaseStateForTests } from "@/lib/auth/authDb";
import { resetDrizzleDatabaseStateForTests } from "@/lib/db/drizzle";
import { resetMediaDatabaseStateForTests } from "@/lib/media/mediaDb";

export type ResetDatabaseOptions = PoobDatabaseOptions & {
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
    deletePoobDatabaseForTests(options);
    return;
  }

  closePoobDatabaseForTests();
}
