declare module '@env' {
  export const API_URL: string;
  export const MAX_BOT_DEEP_LINK: string;
  /** Firebase Sender ID (project_number из google-services.json) */
  export const FCM_SENDER_ID: string;
  /** EAS Project ID для Expo Push Tokens */
  export const EAS_PROJECT_ID: string;
  export const PRIVACY_POLICY_URL: string | undefined;
}
