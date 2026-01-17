import { initializeApp } from "firebase/app";
import { collection, doc, DocumentReference, getDoc, getDocs, getFirestore, limit, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInWithEmailLink, signInWithPopup, signOut, type User } from "firebase/auth";
import { browser } from "$app/environment";
import { goto, invalidateAll } from "$app/navigation";
import { writable } from "svelte/store";
import { page } from "$app/state";
import { initiateCheckout } from "./stripe";

const firebaseConfig = {
    apiKey: "AIzaSyAFPXvqefQ5fYRdjEKlKLuws74FdC5tQmk",
    authDomain: "manblink-fc10d.firebaseapp.com",
    projectId: "manblink-fc10d",
    storageBucket: "manblink-fc10d.firebasestorage.app",
    messagingSenderId: "475445669621",
    appId: "1:475445669621:web:b5c76e791950f3ff9d1fbc"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore()

export const getUserData = async (uid: string) => (await getDoc(doc(db, 'users', uid))).data();

export const authLoading = writable(false);


export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    const user = credential.user;
    if (user) {
        authLoading.set(true);
        const idToken = await user.getIdToken();
        await serverSignIn(idToken);
    }
}

async function serverSignIn(idToken: string) {
    const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
    });
    const { redirectUrl } = await response.json();

    if (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://')) {
        window.location.href = redirectUrl;
    } else {
        console.log('goto', redirectUrl)
        await goto(redirectUrl);
        // await invalidateAll(); if we stay on the same page this needs to be called
        authLoading.set(false);
    }
}

export async function serverSignOut() {
    authLoading.set(true);
    await fetch("/api/auth", { method: "DELETE" });
    await signOut(auth);
    await invalidateAll();
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
        const idToken = await user.getIdToken();
        await serverSignIn(idToken);
    }
}


