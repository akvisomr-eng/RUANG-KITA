import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function safePublicHttpsUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const episodes: Record<string, string | null> = {};
  for (const id of [1, 2, 3]) episodes[String(id)] = safePublicHttpsUrl(process.env[`PODCAST_EPISODE_${id}_AUDIO_URL`]);
  const platformKeys = [
    ["spotify", "PODCAST_SPOTIFY_URL"],
    ["apple", "PODCAST_APPLE_URL"],
    ["youtube", "PODCAST_YOUTUBE_URL"],
    ["instagram", "PODCAST_INSTAGRAM_URL"],
    ["x", "PODCAST_X_URL"],
    ["website", "PODCAST_OFFICIAL_URL"],
  ] as const;
  const platforms = platformKeys.map(([label, env]) => ({ label, url: safePublicHttpsUrl(process.env[env]) }));
  return NextResponse.json({ episodes, platforms }, {
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}
