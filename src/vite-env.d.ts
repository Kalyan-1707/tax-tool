/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB3_FORMS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
