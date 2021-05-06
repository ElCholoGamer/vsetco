import { IUser } from './models/user';
import { IPost } from './models/post';

declare global {
	namespace Express {
		export interface User extends IUser {}

		export interface Request {
			channel: IChannel;
			message: IMessage;
			wss: WSServer;

			post: IPost;
		}
	}
}

declare module 'passport-local' {
	export interface IVerifyOptions {
		status: number;
	}
}

declare module 'country-codes-list' {
	declare function all(): { countryCode: string }[];
}
