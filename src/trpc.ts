import { initTRPC } from "@trpc/server";

export type Context = {
  requestId: string;
};

export const createContext = (requestId: string): Context => ({ requestId });

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
