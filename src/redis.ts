import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";

const redis = createClient({ url: redisUrl });

redis.on("error", (error) => {
  // Keep the process alive and surface connection issues in logs.
  console.error("Redis error:", error);
});

let connectPromise: Promise<unknown> | null = null;

export const getRedisClient = async () => {
  if (!redis.isOpen) {
    connectPromise ??= redis.connect();
    await connectPromise;
  }

  return redis;
};
