import { Link } from 'react-router-dom';
import Post from '@structures/post';
import '@scss/PostPreview.scss';

interface Props {
	post: Post;
}

const PostPreview: React.FC<Props> = ({ post }) => {
	return (
		<Link className="post-preview" to={`/post/${post.id}`}>
			<h3>{post.title}</h3>
		</Link>
	);
};

export default PostPreview;
