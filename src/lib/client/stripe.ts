export async function initiateCheckout(email: string, nextUrl: string) {
    const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to create checkout session');
    }

    const session = await response.json();
    window.location.href = session.url;
}

export async function manageSubscription() {
    const response = await fetch('/api/stripe/manage-billing', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Failed to create billing portal');
    }

    const body = await response.json();
    window.location.href = body.url;
}