import { useHistory } from 'react-router';
import Post from '@structures/post';
import '@scss/PostPreview.scss';

interface Props {
	post: Post;
}

const PostPreview: React.FC<Props> = ({ post }) => {
	const history = useHistory();
	const votes = post.upvotes - post.downvotes;

	return (
		<div
			className="post-preview my-3 p-2"
			onClick={() => history.push(`/post/${post.id}`)}>
			<p className="m-0">
				{votes} voto{Math.abs(votes) !== 1 && 's'}
			</p>
			<h3>{post.title}</h3>
		</div>
	);
};

export default PostPreview;
