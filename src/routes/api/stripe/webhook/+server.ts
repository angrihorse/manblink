import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';
import { PRIVATE_WEBHOOK_SECRET } from '$env/static/private';
import { stripe } from '$lib/server/stripe';
import { adminDb } from '$lib/server/firebase';
import { FieldValue } from 'firebase-admin/firestore';
import { sendPurchaseEvent } from '$lib/server/capi';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '$lib/client/firebase';

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
            if (session.payment_status !== 'paid') break;

            const credits = parseInt(session.metadata?.credits ?? '0', 10);
            if (!credits) break;

            const email = session.customer_details?.email;
            if (email) {
                // User doc ID = email — works whether user signs in before or after payment
                await adminDb.collection('users').doc(email).set(
                    { credits: FieldValue.increment(credits) },
                    { merge: true }
                );

                // Only send magic link for unauthenticated purchases (no client_reference_id)
                if (!session.client_reference_id) {
                    const origin = session.metadata?.origin ?? 'https://manblink.com';
                    const continueUrl = new URL(`${origin}/app/loading`);
                    continueUrl.searchParams.set('email', email);
                    continueUrl.searchParams.set('redirectAfterAuth', '/app/loading');
                    await sendSignInLinkToEmail(auth, email, {
                        url: continueUrl.toString(),
                        handleCodeInApp: true,
                    });
                }
            }

            await sendPurchaseEvent({
                email: email ?? null,
                valueCents: session.amount_total ?? 0,
                currency: session.currency ?? 'usd',
                eventSourceUrl: 'https://manblink.com/app/topup',
                clientIp: request.headers.get('x-forwarded-for'),
                clientUserAgent: request.headers.get('user-agent'),
                eventId: session.id
            });

            break;
        }

        default:
            console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return json({ received: true });
};
