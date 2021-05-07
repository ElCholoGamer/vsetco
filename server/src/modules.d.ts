declare global {
	module 'passport-local' {
		interface IVerifyOptions {
			status: number;
		}
	}
}

declare module 'country-codes-list' {
	export function all(): { countryCode: string }[];
}
