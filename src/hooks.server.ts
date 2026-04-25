import { adminAuth } from '$lib/server/firebase';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Firebase's signInWithRedirect POST-backs arrive as POST to the originating page.
    // SvelteKit rejects them with 405 (no form actions). Redirect to GET so the client
    // can call getRedirectResult() and complete the sign-in normally.
    if (event.request.method === 'POST' && !event.route.id?.includes('api')) {
        throw redirect(303, event.url.pathname + event.url.search);
    }

    const sessionCookie = event.cookies.get('__session');

    if (sessionCookie) {
        try {
            const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, false);

            event.locals.user = {
                id: decodedClaims.uid,
                email: decodedClaims.email,
                displayName: decodedClaims.name
            };
        } catch {
            event.cookies.delete('__session', { path: '/' });
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }

    return resolve(event);
};