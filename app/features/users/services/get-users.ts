import { AppLoadContext } from "@remix-run/cloudflare";

export const getUsers = async (ctx: AppLoadContext) => {
  return ctx.db.query.users.findMany();
};
