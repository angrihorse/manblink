import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';
import { PRIVATE_WEBHOOK_SECRET } from '$env/static/private';
import { stripe } from '$lib/server/stripe';
import { adminDb, getUserFromDb, updateUserInDb } from '$lib/server/firebase'; // Import your admin database

export const POST: RequestHandler = async ({ request }) => {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        throw error(400, 'Missing stripe-signature header');
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            PRIVATE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        throw error(400, err.message);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;

        const stripeCustomerId = session.customer as string;
        if (stripeCustomerId) {
            await updateUserInDb(userId!, {
                stripeCustomerId: stripeCustomerId,
            });
        }
    } else {
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return json({ received: true });
};