import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals }) => {
    const isEmailLink = url.searchParams.has('apiKey') &&
        url.searchParams.has('oobCode') &&
        url.searchParams.get('mode') === 'signIn';
    const isHomePage = url.pathname === '/'

    return {
        user: locals.user,
        isEmailLink,
        isHomePage
    };
};