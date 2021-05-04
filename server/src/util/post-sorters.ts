import { IPost } from '../models/post';

interface SortFunctions {
	[key: string]: (a: IPost, b: IPost) => number;
}

const sortFunctions: SortFunctions = {
	top: (a, b) => b.getVotes() - a.getVotes(),
	new: (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
	hot: (a, b) => {
		const now = Date.now();
		const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

		const aRecent = a.createdAt.getTime() > monthAgo;
		const bRecent = b.createdAt.getTime() > monthAgo;

		if (aRecent && !bRecent) return 1;
		if (bRecent && !aRecent) return -1;

		const diffVotes = b.getVotes() - a.getVotes();
		if (diffVotes !== 0) {
			return diffVotes;
		} else {
			return b.createdAt.getTime() - a.createdAt.getTime();
		}
	},
};

export default sortFunctions;
