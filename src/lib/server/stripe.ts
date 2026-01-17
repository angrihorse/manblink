import Stripe from 'stripe';
import { error, json } from '@sveltejs/kit';
import { PRICE_ID, PRIVATE_STRIPE_KEY } from '$env/static/private';
import { adminAuth, adminDb, getUserDataByEmail, getUserFromDb, updateUserInDb } from '$lib/server/firebase';

export const stripe = new Stripe(PRIVATE_STRIPE_KEY);

export async function createCheckoutSession(userId: string, email: string, origin: string) {
    const userData = await getUserFromDb(userId);
    let stripeCustomerId = userData?.stripeCustomerId;
    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email,
            metadata: { firebaseUserId: userId }
        });
        stripeCustomerId = customer.id;
        await updateUserInDb(userId, { stripeCustomerId });
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: PRICE_ID, quantity: 1 }],
        mode: 'subscription',
        success_url: `${origin}/app`,
        cancel_url: origin,
        client_reference_id: userId,
        customer: stripeCustomerId,
    });

    return session.url!;
}