interface Post {
	id: string;
	title: string;
	description: string;
	author: string;
	category?: string;
	upvotes: number;
	downvotes: number;
	contacts: {
		email?: string;
		phone?: string;
		address?: string;
	};
}

export default Post;
