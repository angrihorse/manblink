import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { FB_CLIENT_EMAIL, FB_PRIVATE_KEY, FB_PROJECT_ID } from '$env/static/private';

try {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: FB_PROJECT_ID,
            clientEmail: FB_CLIENT_EMAIL,
            privateKey: FB_PRIVATE_KEY
        }),
    });
} catch (err) {
    if (!/already exists/u.test(err.message)) {
        console.error('Firebase Admin Error: ', err.stack);
    }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();

export const getUserFromDb = async (userId: string) =>
    (await adminDb.collection('users').doc(userId).get()).data();

export const updateUserInDb = async (userId: string, data: object) => {
    await adminDb.collection('users').doc(userId).update(data);
};

export const getUserDataByEmail = async (email: string) => (await adminDb.collection('users').where('email', '==', email).limit(1).get()).docs.map(d => ({ id: d.id, ...d.data() }))[0];