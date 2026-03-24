declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const META_PIXEL_ID = "957723226741904";

export function trackPageView() {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "PageView");
}

export function trackMetaEvent(
  eventName: string,
  data?: Record<string, any>
) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", eventName, data || {});
}