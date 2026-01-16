import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';
import { PRIVATE_WEBHOOK_SECRET } from '$env/static/private';
import { stripe } from '$lib/server/stripe';

// stripe listen --events checkout.session.completed --forward-to http://localhost:5173/api/stripe/webhook

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

    switch (event.type) {
        case 'checkout.session.completed':
            const session: Stripe.Checkout.Session = event.data.object;

            // await userDoc.update({
            //     stripeCustomerId: session.customer,
            //     paidTimestamp: Date.now()
            // });

            console.log('Order fulfilled for user');
            break;

        default:
            console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return json({ received: true });
};
