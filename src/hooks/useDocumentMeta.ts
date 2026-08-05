import { useEffect } from "react";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/config/artist";
import { assetUrl } from "@/utils/formatting";

function ensureMeta(selector: string, attr: string, value: string): void {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const match = selector.match(/\[([^=]+)="([^"]+)"\]/);
    if (match) el.setAttribute(match[1], match[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function useDocumentMeta(): void {
  useEffect(() => {
    document.title = SITE_TITLE;

    ensureMeta('meta[name="description"]', "content", SITE_DESCRIPTION);
    ensureMeta('meta[property="og:title"]', "content", SITE_TITLE);
    ensureMeta('meta[property="og:description"]', "content", SITE_DESCRIPTION);
    ensureMeta('meta[name="twitter:title"]', "content", SITE_TITLE);
    ensureMeta('meta[name="twitter:description"]', "content", SITE_DESCRIPTION);

    if (!SITE_URL) return;

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", SITE_URL);

    ensureMeta('meta[property="og:url"]', "content", SITE_URL);

    const imagePath = assetUrl("media/aly/aly-profile.webp").replace(/^\//, "");
    ensureMeta("meta[property=\"og:image\"]", "content", `${SITE_URL}/${imagePath}`);
  }, []);
}
