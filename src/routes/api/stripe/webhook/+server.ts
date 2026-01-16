import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';
import { PRIVATE_WEBHOOK_SECRET } from '$env/static/private';
import { stripe } from '$lib/server/stripe';
import { adminAuth, adminDb, getUserFromDb, updateOrCreateUserByEmail, updateUserInDb } from '$lib/server/firebase'; // Import your admin database

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
        const firebaseUserId = session.client_reference_id;
        const email = session.customer_email;
        const stripeCustomerId = session.customer as string;

        // Option 2: Email - first auth(recommended)
        // Yes, you can redirect to Stripe checkout after email confirmation:
        // User enters email → Firebase sends verification email
        // Verification link redirects to your app with auth token
        // Your app immediately redirects to Stripe checkout with the authenticated user's ID
        // Webhook can now use the proper Firebase user ID


    } else {
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return json({ received: true });
};