/**
 * useRazorpay — loads Razorpay's checkout.js script on demand and
 * exposes a typed `openRazorpay(options)` helper that spawns the
 * secure payment modal.
 *
 * Usage:
 *   const { isLoaded, loadError, openRazorpay } = useRazorpay();
 */

import { useEffect, useState } from 'react';

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
const SCRIPT_ID  = 'razorpay-sdk';

export function useRazorpay() {
  const [isLoaded,  setIsLoaded]  = useState(() => !!window.Razorpay);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    // Already loaded by a previous mount
    if (window.Razorpay) { setIsLoaded(true); return; }

    // Avoid injecting the script twice (e.g., strict-mode double-mount)
    if (document.getElementById(SCRIPT_ID)) return;

    const script       = document.createElement('script');
    script.id          = SCRIPT_ID;
    script.src         = SCRIPT_URL;
    script.async       = true;
    script.crossOrigin = 'anonymous';

    script.onload  = () => setIsLoaded(true);
    script.onerror = () =>
      setLoadError('Could not load Razorpay SDK. Check your internet connection.');

    document.body.appendChild(script);
  }, []);

  /**
   * Opens the Razorpay checkout modal.
   *
   * @param {Object} options  - Standard Razorpay options object.
   *   Required: key, amount (in paise), currency, name, handler
   *   Optional: description, image, prefill, notes, theme, modal
   */
  const openRazorpay = (options) => {
    if (!window.Razorpay) {
      console.error('[useRazorpay] SDK not loaded yet.');
      return;
    }

    const rzp = new window.Razorpay({
      ...options,
      // Wrap the handler so callers don't need to manually close
      handler: (response) => {
        rzp.close();
        if (options.handler) options.handler(response);
      },
    });

    rzp.on('payment.failed', (response) => {
      if (options.onPaymentFailed) options.onPaymentFailed(response.error);
    });

    rzp.open();
  };

  return { isLoaded, loadError, openRazorpay };
}
