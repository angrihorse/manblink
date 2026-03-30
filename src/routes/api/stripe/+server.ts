import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createCheckoutSession } from '$lib/server/stripe';

export const POST: RequestHandler = async ({ request, locals, url }) => {
    const { priceId } = await request.json();

    const sessionUrl = await createCheckoutSession(
        priceId,
        locals.user?.id ?? null,
        locals.user?.email ?? null,
        url.origin
    );

    return json({ url: sessionUrl });
};
