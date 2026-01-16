import { doc, getDoc } from "firebase/firestore";
import { authLoading, db, getUserData, signInWithEmail, signInWithGoogle } from "./firebase";
import { initiateCheckout } from "./stripe";
import { goto } from "$app/navigation";
import { page } from "$app/state";


export async function routeGoogleSignin() {
    const user = await signInWithGoogle(true);
    if (user) {
        const userData = getUserData(user.uid)
        const userHasToPay = userData !== null;
        if (userHasToPay) {
            await initiateCheckout(user.email!, '/app');
        } else {
            goto('/app')
            authLoading.set(false)
        }
    }
}

export async function routeEmailSignin(email: string) {
    authLoading.set(true)
    signInWithEmail(email, page.url.href);
    initiateCheckout(email, '/email');
}