import { IPost } from '../models/post';

function partialify(posts: IPost[]) {
	const partials = posts.map(post => {
		const json: any = post.toJSON();

		delete json.contacts;
		delete json.description;

		return json;
	});

	return partials;
}

export default partialify;
