import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';
import { PRIVATE_WEBHOOK_SECRET } from '$env/static/private';
import { stripe } from '$lib/server/stripe';
import { updateUserInDb, updateUserByField } from '$lib/server/firebase';
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
            if (session.client_reference_id) {
                await updateUserInDb(session.client_reference_id, {
                    subscriptionId: session.subscription,
                    planActive: true,
                    planExpires: null,
                    credits: FieldValue.increment(100)
                });
            }
            break;
        }

        case 'customer.subscription.updated': {
            const subscription = data as Stripe.Subscription;
            await updateUserByField('subscriptionId', subscription.id, {
                planExpires: subscription.cancel_at
            });
            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = data as Stripe.Subscription;
            await updateUserByField('subscriptionId', subscription.id, {
                planActive: false,
                subscriptionId: null
            });
            break;
        }

        default:
            console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return json({ received: true });
};