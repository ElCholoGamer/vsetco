import { Schema, model, Document } from 'mongoose';

export interface IContacts {
	phone?: string;
	email?: string;
	address?: string;
}

export const ContactsSchema = new Schema(
	{
		phone: { type: String, trim: true },
		email: { type: String, trim: true },
		address: { type: String, trim: true },
	},
	{ _id: false }
);

export interface IUser extends Document {
	_id: string;
	email: string;
	username: string;
	password: string;
	contacts: IContacts;
	country: string;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema(
	{
		_id: String,
		email: { type: String, trim: true },
		username: { type: String, trim: true, minLength: 2 },
		password: { type: String, required: true },
		country: { type: String, required: true, trim: true },
		description: { type: String, minLength: 1, trim: true },
		contacts: { type: ContactsSchema, default: {} },
	},
	{ timestamps: true }
);

UserSchema.pre('save', async function (done) {
	if (this._id) return done();

	let id;
	do {
		const length = 12;
		const num = Math.floor(Math.random() * 10 ** length);

		id = num.toString().padStart(length, '0');
	} while (await (this.constructor as any).findById(id));

	this._id = id;
	done();
});

const User = model<IUser>('User', UserSchema);

export default User;
