import { IUser } from './models/user';
import { IPost } from './models/post';
import ImageManager from './util/image-manager';

declare global {
	namespace Express {
		interface User extends IUser {}

		interface Request {
			channel: IChannel;
			message: IMessage;
			wss: WSServer;

			post: IPost;
		}

		interface Application {
			images: ImageManager;
		}
	}
}
