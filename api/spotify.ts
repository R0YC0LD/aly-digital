import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildSpotifyPayload, HttpError } from "./_lib/spotify";

const CACHE_CONTROL = "public, s-maxage=21600, stale-while-revalidate=86400";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method && req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: "Missing Spotify credentials on server",
    });
  }

  try {
    const payload = await buildSpotifyPayload(clientId, clientSecret);
    res.setHeader("Cache-Control", CACHE_CONTROL);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      if (error.retryAfter) {
        res.setHeader("Retry-After", String(Math.ceil(error.retryAfter / 1000)));
      }

      if (error.status === 401 || error.status === 403) {
        return res.status(error.status).json({
          error: "Spotify authorization failed",
        });
      }

      if (error.status === 429) {
        return res.status(429).json({
          error: "Spotify rate limit exceeded",
        });
      }

      if (error.message.includes("identity mismatch")) {
        return res.status(422).json({
          error: "Spotify artist identity mismatch",
        });
      }

      return res.status(error.status || 502).json({
        error: "Spotify API request failed",
      });
    }

    console.error("Unexpected Spotify handler error", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
