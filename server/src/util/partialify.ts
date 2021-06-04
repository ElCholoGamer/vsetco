import { IPost } from '../models/post';

function partialify(posts: IPost[]) {
	const partials = posts.map(post => {
		const json: any = post.toJSON();

		delete json.contacts;
		delete json.description;

		if (json.images.length > 0) {
			json.thumbnail = json.images[0];
		}

		delete json.images;

		return json;
	});

	return partials;
}

export default partialify;
