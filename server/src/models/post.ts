import { Schema, model, Document } from 'mongoose';
import { ContactsSchema, IContacts } from './user';

export interface IPost extends Document {
	_id: string;
	title: string;
	author: string;
	category: string;
	description: string;
	images: string[];
	contacts: IContacts;
	upvotes: string[];
	downvotes: string[];
	createdAt: Date;
	updatedAt: Date;

	getVotes(): number;
}

const PostSchema = new Schema(
	{
		title: { type: String, trim: true, required: true },
		author: { type: String, required: true },
		category: { type: String, trim: true },
		description: { type: String, trim: true, required: true },
		images: { type: [String], required: true },
		contacts: { type: ContactsSchema, required: true },
		upvotes: { type: [String], required: true },
		downvotes: { type: [String], required: true },
	},
	{ timestamps: true }
);

PostSchema.methods.getVotes = function (this: IPost) {
	return this.upvotes.length - this.downvotes.length;
} as any;

PostSchema.pre('save', function (this: IPost, done) {
	let check1 = this.upvotes;
	let check2 = this.downvotes;

	if (this.upvotes.length > this.downvotes.length) {
		[check1, check2] = [check2, check1];
	}

	for (const user of check1) {
		if (check2.includes(user)) {
			return done(new Error(`User ${user} is on both vote lists`));
		}
	}

	done();
});

const Post = model<IPost>('Post', PostSchema);

export default Post;
