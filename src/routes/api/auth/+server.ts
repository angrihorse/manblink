import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { adminAuth, adminDb, updateUserInDb } from '$lib/server/firebase';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { idToken } = await request.json();

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const decodedIdToken = await adminAuth.verifyIdToken(idToken);

    if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
        const firebaseUser = await adminAuth.getUser(decodedIdToken.uid);
        const userRef = adminDb.collection('users').doc(firebaseUser.uid);
        await userRef.set({
            displayName: firebaseUser.displayName ?? null,
            email: firebaseUser.email,
        }, { merge: true });

        if (firebaseUser.email) {
            const pendingRef = adminDb.collection('pendingCredits').doc(firebaseUser.email);
            const pending = await pendingRef.get();
            if (pending.exists) {
                await userRef.set({ credits: FieldValue.increment(pending.data()!.credits) }, { merge: true });
                await pendingRef.delete();
            }
        }

        const cookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
        const options = {
            maxAge: expiresIn,
            httpOnly: true,
            path: '/'
        };
        cookies.set('__session', cookie, options);

        return json({ success: true });
    } else {
        throw error(401, 'Recent sign in required!');
    }
};

export const DELETE: RequestHandler = async ({ cookies }) => {
    cookies.delete('__session', { path: '/' });
    return json({ received: true });
}