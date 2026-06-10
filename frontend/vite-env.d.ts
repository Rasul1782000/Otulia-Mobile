/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_BACKEND_URL: string;
  VITE_GOOGLE_CLIENT_ID: string;
  VITE_PAYPAL_CLIENT_ID: string;
  VITE_CLOUDINARY_CLOUD_NAME: string;
  VITE_GA_PROPERTY_ID: string;
  VITE_WHATSAPP_NUMBER: string;
  VITE_APPLE_CLIENT_ID: string;
  VITE_FACEBOOK_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
