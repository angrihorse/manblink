import { createHash } from 'crypto';
import { META_CONVERSION_API_KEY, META_PIXEL_ID, META_TEST_EVENT_CODE } from '$env/static/private';

function sha256(value: string): string {
    return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export async function sendPurchaseEvent(opts: {
    email: string | null;
    valueCents: number;
    currency: string;
    eventSourceUrl: string;
    clientIp: string | null;
    clientUserAgent: string | null;
    eventId: string;
}) {
    const userData: Record<string, string> = {};
    if (opts.email) userData.em = sha256(opts.email);
    if (opts.clientIp) userData.client_ip_address = opts.clientIp;
    if (opts.clientUserAgent) userData.client_user_agent = opts.clientUserAgent;

    const payload: Record<string, unknown> = {
        ...(META_TEST_EVENT_CODE ? { test_event_code: META_TEST_EVENT_CODE } : {}),
        data: [
            {
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000),
                event_id: opts.eventId,
                action_source: 'website',
                event_source_url: opts.eventSourceUrl,
                user_data: userData,
                custom_data: {
                    value: opts.valueCents / 100,
                    currency: opts.currency.toUpperCase()
                }
            }
        ]
    };

    const res = await fetch(
        `https://graph.facebook.com/v22.0/${META_PIXEL_ID}/events?access_token=${META_CONVERSION_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }
    );

    const body = await res.text();
    if (!res.ok) {
        console.error('CAPI error:', body);
    } else {
        console.log('CAPI purchase sent:', body);
    }
}
