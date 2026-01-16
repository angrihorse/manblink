import { initializeApp } from "firebase/app";
import { doc, DocumentReference, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInWithEmailLink, signInWithPopup, signOut, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { derived, get, writable, type Readable } from "svelte/store";
import { browser } from "$app/environment";
import { getAnalytics, isSupported } from "firebase/analytics";
import { invalidateAll } from "$app/navigation";
import { initiateCheckout } from "./stripe";

const firebaseConfig = {
    apiKey: "AIzaSyCrKrp-9qBjlBo2uwkTtQ1bO2P6HQ4FjgA",
    authDomain: "newathlete-ddf49.firebaseapp.com",
    projectId: "newathlete-ddf49",
    storageBucket: "newathlete-ddf49.firebasestorage.app",
    messagingSenderId: "1021442517962",
    appId: "1:1021442517962:web:4fe2dcad05f14cf2f1fd33",
    measurementId: "G-1PWQKHYMMX"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();

export const loadingAuth = writable(false);

export interface UserData {
    id: string;
    email: string;
    displayName: string;
}

export async function signInWithGoogle() {
    if (!browser) return null;

    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    const user = credential.user;

    loadingAuth.set(true);
    const idToken = await user.getIdToken();
    await serverSignIn(idToken);
    await invalidateAll();
    loadingAuth.set(false);

    return user;
}

async function serverSignIn(idToken: string) {
    await fetch("/api/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
    });
}

export async function signInWithEmail(email: string) {
    await initiateCheckout(email)
}