import { IUser } from './models/user';

declare global {
	namespace Express {
		export interface User extends IUser {}

		export interface Request {
			channel: IChannel;
			message: IMessage;
			wss: WSServer;
		}
	}
}

declare module 'passport-local' {
	export interface IVerifyOptions {
		status: number;
	}
}
