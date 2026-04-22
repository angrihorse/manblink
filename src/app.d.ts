declare global {
	function fbq(action: string, event: string, params?: Record<string, unknown>): void;

	namespace App {
		interface Locals {
			user: {
				id: string;
				email: string | undefined;
				displayName: string;
			} | null;
		}
	}
}

export { };