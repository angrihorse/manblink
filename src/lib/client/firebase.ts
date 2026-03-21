import { initializeApp } from "firebase/app";
import { collection, doc, DocumentReference, getDoc, getDocs, getFirestore, limit, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInAnonymously, signInWithEmailLink, signInWithPopup, signOut, type User } from "firebase/auth";
import { browser } from "$app/environment";
import { goto, invalidateAll } from "$app/navigation";
import { writable } from "svelte/store";
import { page } from "$app/state";
import { initiateCheckout } from "./stripe";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

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
// const analytics = getAnalytics(app);
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

export async function signInWithGoogle(redirectUrl = '/app') {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    const user = credential.user;
    if (user) {
        authLoading.set(true);
        await syncQuizData(user.uid);
        const idToken = await user.getIdToken();
        await serverSignIn(idToken, redirectUrl);
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
    authLoading.set(true);
    await fetch("/api/auth", { method: "DELETE" });
    await signOut(auth);
    await goto('/');
    authLoading.set(false);
}

export async function signInWithEmail(email: string) {
    const actionCodeSettings = {
        url: `${page.url.origin}/app`,
        handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
}

export async function handleEmailLinkSignIn() {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
        return null;
    }
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
        email = window.prompt('Please provide your email for confirmation');
    }
    if (!email) {
        throw new Error('Email is required for sign-in');
    }

    authLoading.set(true);
    const credential = await signInWithEmailLink(auth, email);
    const user = credential.user;
    if (user) {
        window.localStorage.removeItem('emailForSignIn');
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('email');
        window.history.replaceState({}, '', cleanUrl.toString());
        await syncQuizData(user.uid);
        const idToken = await user.getIdToken();
        await serverSignIn(idToken);
    }
}


