import Fastify from "fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import type { FastifyRequest } from "fastify";

import { appRouter } from "./router";
import { createContext } from "./trpc";

const app = Fastify({
  logger: true
});

app.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext({ req }: { req: FastifyRequest }) {
      const requestId =
        typeof req.headers["x-request-id"] === "string"
          ? req.headers["x-request-id"]
          : req.id;

      return createContext(requestId);
    }
  }
});

app.get("/", async () => {
  return {
    name: "fastify-trpc-server",
    trpcEndpoint: "/trpc",
    exampleQueries: [
      "/trpc/health",
      "/trpc/greet?input=%7B%22name%22%3A%22Bun%22%7D",
      "/trpc/getTestKv?input=%7B%22key%22%3A%22demo%22%7D"
    ],
    exampleMutations: [
      "POST /trpc/setTestKv with body {\"input\":{\"key\":\"demo\",\"value\":\"hello\"}}"
    ]
  };
});

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

const start = async () => {
  try {
    await app.listen({ port, host });
    app.log.info(`Server listening at http://${host}:${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
