import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';
import { PRIVATE_WEBHOOK_SECRET } from '$env/static/private';
import { stripe } from '$lib/server/stripe';
import { updateUserInDb } from '$lib/server/firebase';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: RequestHandler = async ({ request }) => {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) throw error(400, 'Missing stripe-signature header');

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, PRIVATE_WEBHOOK_SECRET);
    } catch (err: any) {
        throw error(400, `Webhook Error: ${err.message}`);
    }

    const data = event.data.object;
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = data as Stripe.Checkout.Session;
            if (session.client_reference_id && session.payment_status === 'paid') {
                await updateUserInDb(session.client_reference_id, {
                    credits: FieldValue.increment(100)
                });
            }
            break;
        }

        default:
            console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return json({ received: true });
};
