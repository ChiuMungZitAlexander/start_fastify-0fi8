import { z } from "zod";

import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  health: publicProcedure.query(() => {
    return {
      ok: true,
      service: "fastify-trpc",
      timestamp: new Date().toISOString()
    };
  }),
  greet: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).default("world")
      })
    )
    .query(({ input, ctx }) => {
      return {
        message: `Hello, ${input.name}!`,
        requestId: ctx.requestId
      };
    })
});

export type AppRouter = typeof appRouter;
