import { AppLoadContext } from "@remix-run/cloudflare";

import * as schema from "~/lib/db/schema";
import { UserInsert } from "~/lib/db/schema";

export const createUser = async (ctx: AppLoadContext, input: UserInsert) => {
  return ctx.db.insert(schema.users).values(input).returning();
};
