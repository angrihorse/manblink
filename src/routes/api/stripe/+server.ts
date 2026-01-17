import { error, json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';
import { PRICE_ID, PRIVATE_STRIPE_KEY } from '$env/static/private';
import { createCheckoutSession, stripe } from '$lib/server/stripe';
import { adminAuth, adminDb, getUserDataByEmail, getUserFromDb, updateUserInDb } from '$lib/server/firebase';

export const POST: RequestHandler = async ({ request, locals, url }) => {
    const userId = locals.user?.id;
    if (!userId) {
        throw error(401, 'Unauthenticated');
    }

    const sessionUrl = await createCheckoutSession(
        userId,
        locals.user!.email!,
        url.origin
    );

    return json({ sessionUrl });
};