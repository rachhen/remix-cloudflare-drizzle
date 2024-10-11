import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: ".dev.vars" });

export default defineConfig({
  dialect: "turso",
  schema: "./app/lib/db/schema",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  out: "./app/lib/db/migrations",
});
