import { Redis } from "@upstash/redis";

let cached: Redis | null = null;

/** Upstash Redis client, or null if not configured (lets the UI show a friendly state). */
export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!cached) cached = new Redis({ url, token });
  return cached;
}

export type User = {
  email: string;
  passwordHash: string;
  stripeCustomerId?: string;
  createdAt: number;
};

const userKey = (email: string) => `user:${email.trim().toLowerCase()}`;

export async function getUser(email: string): Promise<User | null> {
  const redis = getRedis();
  if (!redis) return null;
  return (await redis.get<User>(userKey(email))) ?? null;
}

export async function createUser(user: User): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error("DB not configured");
  await redis.set(userKey(user.email), user);
}
