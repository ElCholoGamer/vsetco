import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import axios from 'axios';
import Layout from '@components/Layout';
import Post from '@structures/post';
import User from '@structures/user';

interface Props {
	user: User | null;
}

const PostPage: React.FC<Props> = ({ user }) => {
	const { id } = useParams<{ id: string }>();
	const [failed, setFailed] = useState(false);
	const [author, setAuthor] = useState<User | null>(null);
	const [post, setPost] = useState<Post | null>(null);

	useEffect(() => {
		axios
			.get(`/api/posts/${id}`)
			.then(res => setPost(res.data))
			.catch(err => {
				console.error(err);
				setFailed(true);
			});
	}, [id]);

	useEffect(() => {
		if (!post) return;

		if (post.author === user?.id) {
			return setAuthor(user);
		}

		axios
			.get(`/api/users/${post.author}`)
			.then(res => setAuthor(res.data))
			.catch(err => {
				console.error(err);
				setFailed(true);
			});
	}, [post, user]);

	return (
		<Layout>
			{failed ? (
				<>
					<h3>Ocurrió un error :(</h3>
					<p>Intenta de nuevo más tarde</p>
				</>
			) : !post || !author ? (
				<p>Cargando...</p>
			) : (
				<>
					<h2>{post.title}</h2>
					<hr />

					<div>
						<ReactMarkdown remarkPlugins={[gfm]}>
							{post.description}
						</ReactMarkdown>
					</div>
				</>
			)}
		</Layout>
	);
};

export default PostPage;
