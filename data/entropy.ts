export const entropyConfig = {
  enabled: false,
  total: 5 as number,
  iconSrc: "",
  collectSoundSrc: "",
  completionVideoSrc: "",
  completionPosterSrc: "",
  toastDurationMs: 1700,
  collectAnimationMs: 320,
  showMenuProgressAfterFirstCollect: true,
  collectVolume: 0.42,
  keys: {
    seed: "aly-entropy-seed-v1",
    collected: "aly-entropy-collected-v1",
    completed: "aly-entropy-completed-v1",
    videoShown: "aly-entropy-video-shown-v1",
    achievement: "aly-entropy-achievement-v1",
  },
};

export function getEntropyToastCopy(count: number, total: number = entropyConfig.total) {
  if (count >= total) {
    return {
      title: "TÜM ENTROPİLER TOPLANDI",
      counter: `${count}/${total}`,
      subtitle: "Kapı açılıyor.",
    };
  }

  if (count === total - 1) {
    return {
      title: "ENTROPİ TOPLANDI",
      counter: `${count}/${total}`,
      subtitle: "Az kaldı. Yapabilirsin.",
    };
  }

  const subtitles: Record<number, string> = {
    1: "Bir şeyler uyanıyor.",
    2: "İzleri takip et.",
    3: "Yolun yarısını geçtin.",
  };

  return {
    title: "ENTROPİ TOPLANDI",
    counter: `${count}/${total}`,
    subtitle: subtitles[count] || "İzleri takip et.",
  };
}
