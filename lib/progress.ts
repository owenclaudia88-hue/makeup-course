import { getRedis } from "./db";

const COMPLETED = (email: string) => `progress:completed:${email.toLowerCase()}`;
const LAST = (email: string, slug: string) =>
  `progress:last:${email.toLowerCase()}:${slug}`;
const STREAK = (email: string) => `progress:streak:${email.toLowerCase()}`;
// Tracks which course slugs the user has touched (mark-complete or
// navigation). Used by the dashboard's "Continue watching" section.
const ACTIVE = (email: string) => `progress:active:${email.toLowerCase()}`;

export type LessonPos = { m: number; l: number };
export type Streak = { count: number; lastDate: string };

const idOf = (slug: string, m: number, l: number) => `${slug}::${m}::${l}`;
const today = () => new Date().toISOString().slice(0, 10);
const yesterday = () => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
};

export async function getCompletedSet(email: string): Promise<Set<string>> {
  const redis = getRedis();
  if (!redis) return new Set();
  const ids = (await redis.smembers(COMPLETED(email))) as string[];
  return new Set(ids);
}

export async function getCourseCompleted(
  email: string,
  slug: string,
): Promise<LessonPos[]> {
  const all = await getCompletedSet(email);
  const prefix = `${slug}::`;
  const out: LessonPos[] = [];
  for (const s of all) {
    if (!s.startsWith(prefix)) continue;
    const [, m, l] = s.split("::");
    out.push({ m: parseInt(m, 10), l: parseInt(l, 10) });
  }
  return out;
}

export async function getLastLesson(
  email: string,
  slug: string,
): Promise<LessonPos | null> {
  const redis = getRedis();
  if (!redis) return null;
  return (await redis.get<LessonPos>(LAST(email, slug))) ?? null;
}

export async function setLastLesson(
  email: string,
  slug: string,
  pos: LessonPos,
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(LAST(email, slug), pos);
  await redis.sadd(ACTIVE(email), slug);
}

export async function markComplete(
  email: string,
  slug: string,
  m: number,
  l: number,
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.sadd(COMPLETED(email), idOf(slug, m, l));
  await redis.set(LAST(email, slug), { m, l });
  await redis.sadd(ACTIVE(email), slug);
  await bumpStreak(email);
}

/** Slugs of courses the user has touched (started or completed any lesson in). */
export async function getActiveCourseSlugs(email: string): Promise<string[]> {
  const redis = getRedis();
  if (!redis) return [];
  return (await redis.smembers(ACTIVE(email))) as string[];
}

export async function unmarkComplete(
  email: string,
  slug: string,
  m: number,
  l: number,
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.srem(COMPLETED(email), idOf(slug, m, l));
}

async function bumpStreak(email: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const cur = await redis.get<Streak>(STREAK(email));
  const t = today();
  if (cur?.lastDate === t) return;
  const next: Streak =
    cur?.lastDate === yesterday()
      ? { count: cur.count + 1, lastDate: t }
      : { count: 1, lastDate: t };
  await redis.set(STREAK(email), next);
}

export async function getStreak(email: string): Promise<Streak> {
  const redis = getRedis();
  if (!redis) return { count: 0, lastDate: "" };
  const cur = await redis.get<Streak>(STREAK(email));
  if (!cur) return { count: 0, lastDate: "" };
  // The streak is only "live" if last activity was today or yesterday.
  if (cur.lastDate !== today() && cur.lastDate !== yesterday()) {
    return { count: 0, lastDate: cur.lastDate };
  }
  return cur;
}
