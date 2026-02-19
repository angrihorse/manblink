import Stripe from 'stripe';
import { PRICE_ID, PRIVATE_STRIPE_KEY } from '$env/static/private';

export const stripe = new Stripe(PRIVATE_STRIPE_KEY);

export async function createCheckoutSession(userId: string, email: string, origin: string) {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: PRICE_ID, quantity: 1 }],
        mode: 'payment',
        success_url: `${origin}/app`,
        cancel_url: origin,
        client_reference_id: userId,
        customer_email: email,
    });

    return session.url!;
}
