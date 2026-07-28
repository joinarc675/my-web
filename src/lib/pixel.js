export const PIXEL_ID = '912342494595214';

/**
 * Tracks a standard PageView event.
 */
export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Tracks a standard Lead event (form submission, booking, counselling request).
 * @param {Object} [data] - Optional metadata (e.g. { content_name, value, currency })
 */
export const trackLead = (data = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', data);
  }
};

/**
 * Tracks any custom Meta Pixel event.
 * @param {string} eventName - Standard or custom event name (e.g. 'Contact', 'Schedule', 'SubmitApplication')
 * @param {Object} [data] - Optional metadata
 */
export const trackCustomEvent = (eventName, data = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
  }
};
