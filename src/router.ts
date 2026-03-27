import { z } from "zod";

import { getRedisClient } from "./redis";
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
    }),
  setTestKv: publicProcedure
    .input(
      z.object({
        key: z.string().min(1),
        value: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const redis = await getRedisClient();
      await redis.set(input.key, input.value);

      return {
        ok: true,
        key: input.key,
        value: input.value
      };
    }),
  getTestKv: publicProcedure
    .input(
      z.object({
        key: z.string().min(1)
      })
    )
    .query(async ({ input }) => {
      const redis = await getRedisClient();
      const value = await redis.get(input.key);

      return {
        key: input.key,
        value
      };
    })
});

export type AppRouter = typeof appRouter;
