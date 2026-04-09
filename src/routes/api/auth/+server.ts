import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminAuth, adminDb } from '$lib/server/firebase';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { idToken } = await request.json();

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const decodedIdToken = await adminAuth.verifyIdToken(idToken);

    if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
        const firebaseUser = await adminAuth.getUser(decodedIdToken.uid);
        const email = firebaseUser.email;
        if (!email) throw error(400, 'User has no email');

        // User doc ID = email — webhook also writes to this doc, no race condition
        await adminDb.collection('users').doc(email).set({
            displayName: firebaseUser.displayName ?? null,
            email,
        }, { merge: true });

        const cookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
        cookies.set('__session', cookie, { maxAge: expiresIn, httpOnly: true, path: '/' });

        return json({ success: true });
    } else {
        throw error(401, 'Recent sign in required!');
    }
};

export const DELETE: RequestHandler = async ({ cookies }) => {
    cookies.delete('__session', { path: '/' });
    return json({ received: true });
}
