/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_MODE?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_BASE_PATH?: string;
  readonly VITE_SITE_IS_OFFICIAL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
