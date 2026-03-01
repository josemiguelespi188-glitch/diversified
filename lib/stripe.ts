import { loadStripe } from '@stripe/stripe-js';

// Set VITE_STRIPE_PUBLISHABLE_KEY in your .env file.
// Test key starts with pk_test_... (no real charges, use card 4242 4242 4242 4242)
// Live key starts with pk_live_... (real charges)
const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

export const stripePromise = key ? loadStripe(key) : null;
