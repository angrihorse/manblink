import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createCheckoutSession } from '$lib/server/stripe';

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

    return json({ url: sessionUrl });
};