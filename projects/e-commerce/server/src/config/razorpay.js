import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

let razorpayInstance = null;

export const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  const currentKeyId = key_id || 'rzp_test_placeholder';
  const currentKeySecret = key_secret || 'placeholder_secret';

  if (!razorpayInstance || razorpayInstance._configuredKeyId !== currentKeyId || razorpayInstance._configuredSecret !== currentKeySecret) {
    if (!key_id || !key_secret || key_id.includes('placeholder')) {
      console.warn('[Razorpay Warning] Valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are not set in server/.env.');
      console.warn('[Razorpay Tip] Obtain your test keys at: https://dashboard.razorpay.com/app/keys');
    }

    razorpayInstance = new Razorpay({
      key_id: currentKeyId,
      key_secret: currentKeySecret,
    });
    razorpayInstance._configuredKeyId = currentKeyId;
    razorpayInstance._configuredSecret = currentKeySecret;
  }

  return razorpayInstance;
};
