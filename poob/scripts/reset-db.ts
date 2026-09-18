import path from "node:path";

import { resetDatabaseForTests } from "@/lib/db/reset";
import { getAllMediaCards } from "@/lib/media/mediaDb";

const dataDir = process.env.POOB_DATA_DIR ?? path.join(process.cwd(), "data");
const databasePath = path.join(dataDir, "poob.sqlite");

resetDatabaseForTests({ deleteFile: true });

const mediaCount = getAllMediaCards().length;
const seedingEnabled = process.env.POOB_SEED_DEMO_DATA === "true"
  || (process.env.POOB_SEED_DEMO_DATA !== "false" && process.env.NODE_ENV !== "production");

console.log(`Reset database at ${databasePath}.`);
console.log(`Database schema recreated${seedingEnabled ? `; ${mediaCount} demo media items seeded` : "; demo seeding disabled"}.`);
