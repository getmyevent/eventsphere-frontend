/**
 * Utility to aggressively clean up any lingering Google Identity Services (GIS)
 * One-Tap dialogs, FedCM prompts, iframe backdrops, or orphaned overlay elements.
 *
 * This prevents the persistent translucent gray layer and blocked tap interactions
 * caused by GIS elements persisting in document.body during client-side route transitions.
 */
export function cleanupLingeringOverlays(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 1. Cancel active Google Identity Services prompt
  try {
    const google = (window as any).google;
    if (google?.accounts?.id?.cancel) {
      google.accounts.id.cancel();
    }
  } catch (err) {
    // Non-fatal, proceed with DOM cleanup
  }

  // 2. Remove Google One-Tap / FedCM picker containers and iframes from document.body
  try {
    const selectors = [
      '#credential_picker_container',
      '#credential_picker_iframe',
      'iframe[src*="accounts.google.com/gsi"]',
      'div[id*="credential_picker"]',
      'div[class*="credential_picker"]',
      'div[class*="gsi_"]',
      'div[id*="gsi_"]',
    ];

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        try {
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        } catch {
          // Ignore removal errors
        }
      });
    });
  } catch (err) {
    // Ignore DOM query errors
  }
}
