import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';
import { PRICE_ID, PRIVATE_STRIPE_KEY } from '$env/static/private';
import { stripe } from '$lib/server/stripe';
import { adminAuth, adminDb, getUserDataByEmail, getUserFromDb, updateUserInDb } from '$lib/server/firebase';

// Create a checkout session for existing Firebase user.
export const POST: RequestHandler = async ({ request, url, locals }) => {
    const userId = locals.user?.id;
    if (!userId) {
        throw error(401, 'Unauthenticated');
    }

    const userData = await getUserFromDb(userId);
    let stripeCustomerId = userData?.stripeCustomerId
    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: locals.user!.email,
            metadata: { firebaseUserId: userId }
        });
        stripeCustomerId = customer.id;
        updateUserInDb(userId, { stripeCustomerId });
    }

    const sessionOptions: any = {
        payment_method_types: ['card'],
        line_items: [{ price: PRICE_ID, quantity: 1 }],
        mode: 'subscription',
        success_url: `${url.origin}/app`,
        cancel_url: `${url.origin}`,
        client_reference_id: userId,
        customer: stripeCustomerId,
    };

    const session = await stripe.checkout.sessions.create(sessionOptions);
    return json({
        url: session.url
    });
};