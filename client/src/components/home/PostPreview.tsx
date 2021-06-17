import { useHistory } from 'react-router';
import { PartialPost } from '@structures/post';
import '@scss/PostPreview.scss';

interface Props {
	post: PartialPost;
}

const PostPreview: React.FC<Props> = ({ post }) => {
	const history = useHistory();
	const votes = post.upvotes - post.downvotes;

	return (
		<div
			className="post-preview my-3 p-2"
			onClick={() => history.push(`/post/${post.id}`)}
		>
			<p className="m-0">
				{votes} voto{Math.abs(votes) !== 1 && 's'}
			</p>
			<h3>{post.title}</h3>

			{post.thumbnail && (
				<img
					className="my-3 rounded shadow mw-100"
					src={`/api/images/post/${post.id}/${post.thumbnail}`}
					alt=""
					style={{ maxHeight: 400 }}
				/>
			)}
		</div>
	);
};

export default PostPreview;
