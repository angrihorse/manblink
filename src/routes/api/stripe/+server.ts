import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';
import { PRICE_ID, PRIVATE_STRIPE_KEY } from '$env/static/private';
import { stripe } from '$lib/server/stripe';
import { adminAuth, adminDb, getUserDataByEmail, getUserFromDb } from '$lib/server/firebase';

// Create a checkout session for existing Firebase user.
export const POST: RequestHandler = async ({ request, url, locals }) => {
    const { email, nextUrl } = await request.json();
    const userData = await getUserDataByEmail(email);

    const userHasToPay = userData !== null;
    if (!userHasToPay) {
        return json({ url: nextUrl });
    }

    const sessionOptions: any = {
        payment_method_types: ['card'],
        line_items: [{ price: PRICE_ID, quantity: 1 }],
        mode: 'subscription',
        success_url: `${url.origin}/app`,
        cancel_url: `${url.origin}`,
        client_reference_id: userData?.id // Will be null if there's no Firebase user
    };

    let customerId = userData?.stripeCustomerId;
    if (customerId) {
        // Reference existing Stripe customer.
        sessionOptions.customer = customerId;
    } else {
        // Create new Stripe customer by email.
        sessionOptions.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);
    return json({
        url: session.url
    });
};