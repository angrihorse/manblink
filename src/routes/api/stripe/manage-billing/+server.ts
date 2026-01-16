import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';
import { PRIVATE_STRIPE_KEY } from '$env/static/private';
import { adminDb, getUserFromDb } from '$lib/server/firebase';
import { stripe } from '$lib/server/stripe';

// Create a billing portal for existing Firebase user.
export const POST: RequestHandler = async ({ request, url, cookies, locals }) => {
    const userId = locals.user?.id;
    if (!userId) {
        throw error(401, 'Unauthenticated');
    }

    const userData = await getUserFromDb(userId);
    const customerId = userData?.stripeCustomerId;
    if (!customerId) {
        throw error(402, 'Payment Required');
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${url.origin}`,
    });
    return json({
        url: session.url
    });
};