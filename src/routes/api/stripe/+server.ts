import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';
import { PRICE_ID, PRIVATE_STRIPE_KEY } from '$env/static/private';
import { stripe } from '$lib/server/stripe';
import { adminAuth, adminDb } from '$lib/server/firebase';


export const POST: RequestHandler = async ({ request, url, cookies, locals }) => {
    const { email } = await request.json();

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [
            {
                price: PRICE_ID,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${url.origin}/success`,
        cancel_url: `${url.origin}`,
    });

    return json(session);
};