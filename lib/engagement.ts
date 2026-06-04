import { getRedis } from "./db";

/**
 * Per-lesson engagement state: a private reflection (emoji + free text) the
 * user writes for themselves. Stored per (email, slug, m, l) — only visible
 * to the user. Used by the CoursePlayer's "Reflect on this lesson" panel.
 */

const KEY = (email: string, slug: string, m: number, l: number) =>
  `engagement:reflection:${email.toLowerCase()}:${slug}:${m}:${l}`;

export type Reflection = {
  feeling?: string; // e.g. "inspired", "hopeful", "processing"
  text?: string; // free-form, private
  updatedAt?: number; // ms epoch
};

export async function getReflection(
  email: string,
  slug: string,
  m: number,
  l: number,
): Promise<Reflection | null> {
  const redis = getRedis();
  if (!redis) return null;
  return (await redis.get<Reflection>(KEY(email, slug, m, l))) ?? null;
}

export async function setReflection(
  email: string,
  slug: string,
  m: number,
  l: number,
  r: Reflection,
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  // Drop empty payloads — keeps Redis tidy.
  if (!r.feeling && !r.text?.trim()) {
    await redis.del(KEY(email, slug, m, l));
    return;
  }
  await redis.set(KEY(email, slug, m, l), {
    ...r,
    updatedAt: Date.now(),
  });
}

/**
 * Soft, brand-voiced affirmations shown as a strip between lessons. Picked
 * deterministically per lesson position so the same lesson always shows the
 * same affirmation (no whiplash on re-render).
 */
export const AFFIRMATIONS: string[] = [
  "You're doing something good for yourself right now.",
  "Tiny rituals, real change.",
  "Five minutes counts.",
  "Be patient with the process.",
  "Consistency is the work.",
  "Small steps, kept up, beat big plans abandoned.",
  "The point isn't to be perfect. It's to come back tomorrow.",
  "This is care, not a chore.",
];

export function affirmationFor(m: number, l: number): string {
  const idx = Math.abs(m * 13 + l * 7) % AFFIRMATIONS.length;
  return AFFIRMATIONS[idx];
}
