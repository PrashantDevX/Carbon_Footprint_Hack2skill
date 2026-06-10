export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (import.meta.env.DEV) {
    console.info(`[analytics] ${name}`, properties ?? {});
  }
}
