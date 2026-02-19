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
