import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

export type DB = Awaited<ReturnType<typeof getDB>>;

export const getDB = async (env: Env) => {
  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });

  return drizzle(client, { schema });
};
