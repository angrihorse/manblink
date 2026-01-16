import { adminAuth } from '$lib/server/firebase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get('__session');

    if (sessionCookie) {
        try {
            const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
            event.locals.user = {
                id: decodedClaims.uid,
                email: decodedClaims.email,
                displayName: decodedClaims.name
            };
        } catch (error) {
            event.cookies.delete('__session', { path: '/' });
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }

    return resolve(event);
};