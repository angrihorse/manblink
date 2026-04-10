import Stripe from 'stripe';
import { PRIVATE_STRIPE_KEY } from '$env/static/private';
import { PUBLIC_PRICE_ID_30, PUBLIC_PRICE_ID_60 } from '$env/static/public';

export const stripe = new Stripe(PRIVATE_STRIPE_KEY);

const PRICE_CREDITS: Record<string, number> = {
    [PUBLIC_PRICE_ID_30]: 30,
    [PUBLIC_PRICE_ID_60]: 60,
};

export function creditsForPrice(priceId: string): number {
    return PRICE_CREDITS[priceId] ?? 0;
}

export async function createCheckoutSession(
    priceId: string,
    userId: string | null,
    email: string | null,
    origin: string
) {
    const credits = creditsForPrice(priceId);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        success_url: userId ? `${origin}/app/loading` : `${origin}/app/claimed`,
        cancel_url: `${origin}/app/topup`,
        metadata: { credits: String(credits), origin },
        ...(userId ? { client_reference_id: userId, customer_email: email ?? undefined } : { customer_creation: 'always' }),
    });

    return session.url!;
}
