declare global {
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