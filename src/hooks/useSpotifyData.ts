import { useEffect, useState } from "react";
import { loadSpotifyData, type DataLoadState } from "@/services/spotifyData";

export function useSpotifyData(): DataLoadState {
  const [state, setState] = useState<DataLoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    loadSpotifyData().then((result) => {
      if (!cancelled) setState(result);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
