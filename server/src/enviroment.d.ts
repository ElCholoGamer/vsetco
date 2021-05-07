import { IUser } from './models/user';
import { IPost } from './models/post';

declare global {
	namespace Express {
		interface User extends IUser {}

		interface Request {
			channel: IChannel;
			message: IMessage;
			wss: WSServer;

			post: IPost;
		}
	}
}
