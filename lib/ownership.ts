import { getRedis } from "./db";

/**
 * Per-user course ownership. When a user buys a course outright — either the
 * legacy intro bundle on /checkout or a future per-course funnel (an ad → its
 * dedicated landing page → purchase) — the course's slug is added to their
 * `owned:<email>` Redis Set. Owned courses stay accessible forever, even if
 * the user lets their membership lapse.
 *
 * Backward compatibility: courses still marked `core: true` in lib/courses.ts
 * are also treated as "yours forever" everywhere ownership is checked. So an
 * existing intro customer doesn't lose access if their data isn't backfilled.
 */

const OWNED = (email: string) => `owned:${email.toLowerCase()}`;

export async function getOwnedSlugs(email: string): Promise<Set<string>> {
  const redis = getRedis();
  if (!redis) return new Set();
  const slugs = (await redis.smembers(OWNED(email))) as string[];
  return new Set(slugs);
}

export async function ownsCourse(email: string, slug: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  const r = await redis.sismember(OWNED(email), slug);
  return r === 1;
}

/** Grant the user lifetime access to one or more courses. Idempotent. */
export async function grantCourses(
  email: string,
  slugs: string[],
): Promise<void> {
  const redis = getRedis();
  if (!redis || slugs.length === 0) return;
  await redis.sadd(OWNED(email), ...slugs);
}

/** Revoke ownership of a specific course (refunds, manual admin actions). */
export async function revokeCourse(email: string, slug: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.srem(OWNED(email), slug);
}
