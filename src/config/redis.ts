import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(redisUrl);

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (error) => {
  console.error("Redis error:", error);
});

export async function getCachedImage(key: string): Promise<Buffer | null> {
  try {
    const cached = await redis.getBuffer(key);

    return cached ?? null;
  } catch (error) {
    console.error("Redis get error:", error);

    return null;
  }
}

export async function setCachedImage(
  key: string,
  buffer: Buffer,
  ttl = 3600,
): Promise<void> {
  try {
    await redis.setex(key, ttl, buffer);
  } catch (error) {
    console.error("Redis set error:", error);
  }
}
