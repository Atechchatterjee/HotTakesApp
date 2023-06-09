import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { getUser } from "./user-route";

export const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  getUsers: getUser(),
});

export type AppRouter = typeof appRouter;
