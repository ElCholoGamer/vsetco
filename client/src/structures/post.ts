export interface PartialPost {
	id: string;
	title: string;
	author: string;
	category?: string;
	thumbnail?: string;
	upvotes: number;
	downvotes: number;
	createdAt: string;
	updatedAt: string;
}

interface Post extends PartialPost {
	description: string;
	images: string[];
	contacts: {
		email?: string;
		phone?: string;
		address?: string;
	};
}

export default Post;
