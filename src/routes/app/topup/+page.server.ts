import type { PageServerLoad } from './$types';
import { PRICE_ID_30, PRICE_ID_60 } from '$env/static/private';

export const load: PageServerLoad = () => {
    return {
        prices: [
            { priceId: PRICE_ID_30, credits: 30 },
            { priceId: PRICE_ID_60, credits: 60 },
        ]
    };
};
