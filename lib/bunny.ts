import crypto from "crypto";

/**
 * Builds a token-secured Bunny Stream embed URL for a video, valid for `ttl`
 * seconds. Requires Token Authentication to be enabled on the Bunny library.
 * Returns null if Bunny isn't configured yet (env vars missing).
 *
 * Token format (Bunny embed view token):
 *   sha256_hex( tokenAuthenticationKey + videoId + expires )
 * appended as ?token=...&expires=...
 */
export function bunnyEmbedUrl(videoId: string, ttlSeconds = 6 * 3600): string | null {
  const libraryId = process.env.BUNNY_LIBRARY_ID;
  const key = process.env.BUNNY_TOKEN_KEY;
  if (!libraryId || !key || !videoId) return null;

  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const token = crypto.createHash("sha256").update(key + videoId + expires).digest("hex");
  return (
    `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}` +
    `?token=${token}&expires=${expires}&autoplay=false&preload=false`
  );
}
