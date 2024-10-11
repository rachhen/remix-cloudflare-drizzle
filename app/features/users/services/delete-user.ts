import { AppLoadContext } from "@remix-run/cloudflare";
import { eq } from "drizzle-orm";

import * as schema from "~/lib/db/schema";

export const deleteUser = async (ctx: AppLoadContext, id: number) => {
  return ctx.db.delete(schema.users).where(eq(schema.users.id, id)).returning();
};
