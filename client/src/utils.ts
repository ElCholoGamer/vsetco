import Post from '@structures/post';
import { useLocation } from 'react-router-dom';

export type PostInput = Omit<Post, 'id' | 'author' | 'upvotes' | 'downvotes'>;

export function useQuery() {
	return new URLSearchParams(useLocation().search);
}
