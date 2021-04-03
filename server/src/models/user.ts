import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
	_id: string;
	username: string;
	password: string;
}

const UserSchema = new Schema({
	username: { type: String, trim: true, minLength: 2 },
	password: { type: String },
});

const User = model<IUser>('User', UserSchema);

export default User;
