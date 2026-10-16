/**
 * Dynamically ensures the Razorpay Checkout script is loaded in the DOM
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay Checkout SDK script.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Opens the Razorpay Test Mode Checkout Modal
 * @param {Object} params
 * @param {string} params.key - Razorpay public key ID
 * @param {number} params.amount - Amount in paise
 * @param {string} params.currency - "INR"
 * @param {string} params.orderId - Razorpay order ID (e.g. order_XXXXX)
 * @param {string} params.name - Store name
 * @param {string} params.description - Order description
 * @param {Object} params.prefill - { name, email, contact }
 * @param {Function} params.onSuccess - Callback receiving { razorpay_payment_id, razorpay_order_id, razorpay_signature }
 * @param {Function} params.onDismiss - Callback when customer closes modal without paying
 * @param {Function} params.onFailure - Callback when payment fails
 */
export const launchRazorpayCheckout = async ({
  key,
  amount,
  currency = 'INR',
  orderId,
  name = 'AeroTech Store',
  description = 'Order Payment',
  prefill = {},
  onSuccess,
  onDismiss,
  onFailure,
}) => {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded) {
    throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
  }

  const options = {
    key,
    amount,
    currency,
    name,
    description,
    order_id: orderId,
    prefill: {
      name: prefill.name || '',
      email: prefill.email || '',
      contact: prefill.contact || '',
    },
    notes: {
      address: prefill.address || '',
    },
    theme: {
      color: '#2563eb', // Primary brand color
    },
    handler: function (response) {
      if (typeof onSuccess === 'function') {
        onSuccess(response);
      }
    },
    modal: {
      ondismiss: function () {
        if (typeof onDismiss === 'function') {
          onDismiss();
        }
      },
    },
  };

  const razorpayInstance = new window.Razorpay(options);

  razorpayInstance.on('payment.failed', function (response) {
    console.error('[Razorpay Payment Failed Event]:', response.error);
    if (typeof onFailure === 'function') {
      onFailure(response.error);
    }
  });

  razorpayInstance.open();
};
