import { initializeApp } from "firebase/app";
import { collection, doc, DocumentReference, getDoc, getDocs, getFirestore, limit, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { getAuth, getRedirectResult, GoogleAuthProvider, isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInAnonymously, signInWithEmailLink, signInWithPopup, signInWithRedirect, signOut, type User } from "firebase/auth";
import { browser, dev } from "$app/environment";
import { goto, invalidateAll } from "$app/navigation";
import { writable } from "svelte/store";
import { initiateCheckout } from "./stripe";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import Clarity from "@microsoft/clarity";

const firebaseConfig = {
    apiKey: "AIzaSyAFPXvqefQ5fYRdjEKlKLuws74FdC5tQmk",
    authDomain: "manblink.com",
    projectId: "manblink-fc10d",
    storageBucket: "manblink-fc10d.firebasestorage.app",
    messagingSenderId: "475445669621",
    appId: "1:475445669621:web:b5c76e791950f3ff9d1fbc",
    measurementId: "G-NT083H48C6"
};

export const app = initializeApp(firebaseConfig);
export let analytics;
if (browser) {
    analytics = getAnalytics(app);
    Clarity.init("w4r3edffyr");
}
export const auth = getAuth();
export const db = getFirestore()
export const storage = getStorage();


export const getUserData = async (uid: string) => (await getDoc(doc(db, 'users', uid))).data();

export const authLoading = writable(false);
export const customRender = writable(false);


async function syncQuizData(uid: string) {
    const quizData = localStorage.getItem('manblink_quiz');
    if (!quizData) return;
    try {
        await setDoc(doc(db, 'users', uid), { quiz: JSON.parse(quizData) }, { merge: true });
        localStorage.removeItem('manblink_quiz');
    } catch { }
}

const REDIRECT_URL_KEY = 'auth_redirect_url';

export async function signInWithGoogle(redirectUrl = '/app') {
    const provider = new GoogleAuthProvider();
    sessionStorage.setItem(REDIRECT_URL_KEY, redirectUrl);
    await signInWithRedirect(auth, provider);
}

export async function handleGoogleRedirectResult() {
    const redirectUrl = sessionStorage.getItem(REDIRECT_URL_KEY);
    if (!redirectUrl) return;
    authLoading.set(true);
    try {
        const result = await getRedirectResult(auth);
        if (!result) {
            sessionStorage.removeItem(REDIRECT_URL_KEY);
            authLoading.set(false);
            return;
        }
        sessionStorage.removeItem(REDIRECT_URL_KEY);
        await syncQuizData(result.user.uid);
        const idToken = await result.user.getIdToken();
        await serverSignIn(idToken, redirectUrl);
    } catch {
        sessionStorage.removeItem(REDIRECT_URL_KEY);
        authLoading.set(false);
    }
}

async function serverSignIn(idToken: string, redirectUrl = '/app') {
    await fetch("/api/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
    });

    window.location.href = redirectUrl;
}

export async function signInAsGuest() {
    authLoading.set(true);
    const credential = await signInAnonymously(auth);
    const idToken = await credential.user.getIdToken();
    await serverSignIn(idToken);
}

export async function serverSignOut() {
    await fetch("/api/auth", { method: "DELETE" });
    await signOut(auth);
    await goto('/');
}

export async function signInWithEmail(email: string, redirectUrl = '/app') {
    const continueUrl = new URL(window.location.href);
    continueUrl.searchParams.set('email', email);
    continueUrl.searchParams.set('redirectAfterAuth', redirectUrl);

    await sendSignInLinkToEmail(auth, email, {
        url: continueUrl.toString(),
        handleCodeInApp: true,
    });
    window.localStorage.setItem('emailForSignIn', email);
}

export async function handleEmailLinkSignIn() {
    if (!browser) return null;
    if (!isSignInWithEmailLink(auth, window.location.href)) return null;

    const email =
        window.localStorage.getItem('emailForSignIn') ??
        new URL(window.location.href).searchParams.get('email');
    if (!email) return null;

    authLoading.set(true);
    let firebaseSignedIn = false;
    try {
        const credential = await signInWithEmailLink(auth, email, window.location.href);
        firebaseSignedIn = true;
        await syncQuizData(credential.user.uid);
        const idToken = await credential.user.getIdToken();
        const redirectAfterAuth = new URL(window.location.href).searchParams.get('redirectAfterAuth') ?? '/app';
        await serverSignIn(idToken, redirectAfterAuth);
        window.localStorage.removeItem('emailForSignIn');
        return credential.user;
    } catch (err) {
        if (firebaseSignedIn) {
            try { await signOut(auth); } catch { }
        }
        throw err;
    } finally {
        const cleanUrl = new URL(window.location.href);
        ['email', 'redirectAfterAuth', 'apiKey', 'oobCode', 'mode', 'lang'].forEach((p) =>
            cleanUrl.searchParams.delete(p)
        );
        window.history.replaceState({}, '', cleanUrl.toString());
        await invalidateAll();
        authLoading.set(false);
    }
}


