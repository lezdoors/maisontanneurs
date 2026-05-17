import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export const getStripe = () => {
  if (!stripeInstance) {
    // Return null if Stripe not configured (optional for now)
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("STRIPE_SECRET_KEY not set - payment features disabled");
      return null;
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia",
    });
  }
  return stripeInstance;
};

// For backwards compatibility - returns null if not configured
export const stripe = new Proxy({} as Stripe, {
  get: (_, prop) => {
    const instance = getStripe();
    return instance ? (instance as any)[prop] : null;
  },
});
