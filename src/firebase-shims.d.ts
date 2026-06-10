declare module 'firebase/app' {
  export interface FirebaseApp {
    readonly __firebaseAppBrand?: never;
  }
  export function initializeApp(options: Record<string, unknown>): FirebaseApp;
}

declare module 'firebase/analytics' {
  import type { FirebaseApp } from 'firebase/app';
  export interface Analytics {
    readonly __analyticsBrand?: never;
  }
  export function getAnalytics(app: FirebaseApp): Analytics;
  export function isSupported(): Promise<boolean>;
}

declare module 'firebase/auth' {
  import type { FirebaseApp } from 'firebase/app';
  export interface Auth {
    readonly __authBrand?: never;
  }
  export function getAuth(app: FirebaseApp): Auth;
}

declare module 'firebase/firestore' {
  import type { FirebaseApp } from 'firebase/app';
  export interface Firestore {
    readonly __firestoreBrand?: never;
  }
  export function initializeFirestore(app: FirebaseApp, settings: Record<string, unknown>): Firestore;
  export function persistentLocalCache(): unknown;
}

declare module 'firebase/functions' {
  import type { FirebaseApp } from 'firebase/app';
  export interface Functions {
    readonly __functionsBrand?: never;
  }
  export function getFunctions(app: FirebaseApp): Functions;
}

declare module 'firebase/performance' {
  import type { FirebaseApp } from 'firebase/app';
  export interface FirebasePerformance {
    readonly __performanceBrand?: never;
  }
  export interface PerformanceTrace {
    start(): void;
    stop(): void;
    putAttribute(name: string, value: string): void;
  }
  export function getPerformance(app: FirebaseApp): FirebasePerformance;
  export function trace(performance: FirebasePerformance, name: string): PerformanceTrace;
}

declare module 'firebase/storage' {
  import type { FirebaseApp } from 'firebase/app';
  export interface FirebaseStorage {
    readonly __storageBrand?: never;
  }
  export function getStorage(app: FirebaseApp): FirebaseStorage;
}

declare module 'firebase/app-check' {
  import type { FirebaseApp } from 'firebase/app';
  export class ReCaptchaV3Provider {
    constructor(siteKey: string);
  }
  export function initializeAppCheck(
    app: FirebaseApp,
    options: { provider: ReCaptchaV3Provider; isTokenAutoRefreshEnabled: boolean }
  ): unknown;
}
