import type { SpotifyPayload } from "@/types/spotify";
import { TrackList } from "@/components/TrackList/TrackList";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { ARTIST_ID, SPOTIFY_ARTIST_URL } from "@/config/artist";
import { FEATURED_TRACK_IDS } from "@/config/featuredTracks";

type Props = {
  loading: boolean;
  error?: string;
  data?: SpotifyPayload | null;
};

export function TracksSection({ loading, error, data }: Props) {
  const tracks = (data?.tracks ?? []).filter((t) => t.artistIds.includes(ARTIST_ID));

  const highlighted =
    FEATURED_TRACK_IDS.length > 0
      ? FEATURED_TRACK_IDS.map((id) => tracks.find((t) => t.id === id)).filter(
          (t): t is NonNullable<typeof t> => Boolean(t && t.artistIds.includes(ARTIST_ID)),
        )
      : tracks.slice(0, 5);

  return (
    <section id="tracks" className="section" aria-labelledby="tracks-title">
      <div className="container">
        <p className="section-label">06 / Parçalar</p>
        <h2
          id="tracks-title"
          className="display"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", margin: "0 0 0.75rem" }}
        >
          Parçalar
        </h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: "1.5rem", maxWidth: "36rem" }}>
          Yalnızca Spotify artist ID doğrulamasından geçmiş parçalar listelenir.
        </p>

        {highlighted.length > 0 && !loading && !error ? (
          <div style={{ marginBottom: "2rem" }}>
            <h3 className="display" style={{ fontSize: "1.6rem", margin: "0 0 0.75rem" }}>
              Öne çıkan
            </h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.5rem" }}>
              {highlighted.map((track) => (
                <li
                  key={track.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    padding: "0.7rem 0",
                    minHeight: 44,
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{track.name}</strong>
                    <div className="muted" style={{ fontSize: "0.85rem" }}>
                      {track.albumName}
                    </div>
                  </div>
                  {track.externalUrl ? (
                    <a
                      className="btn btn-spotify"
                      href={track.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding: "0.5rem 0.85rem" }}
                    >
                      Spotify&apos;da aç
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {loading ? <p className="muted">Yükleniyor…</p> : null}
        {!loading && error ? (
          <ErrorState message={error} spotifyUrl={SPOTIFY_ARTIST_URL} />
        ) : null}
        {!loading && !error ? <TrackList tracks={tracks} /> : null}
      </div>
    </section>
  );
}
