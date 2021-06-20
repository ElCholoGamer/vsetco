import { MouseEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { useHistory } from 'react-router-dom';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import gfm from 'remark-gfm';
import axios, { AxiosError } from 'axios';
import Layout from '@components/Layout';
import Post from '@structures/post';
import User from '@structures/user';
import VoteSelector from '@components/post/VoteSelector';
import ErrorMessage from '@components/ErrorMessage';
import ImageCarousel from '@components/post/ImageCarousel';
import Popup from '@components/Popup';
import '@scss/PostPage.scss';

interface Props {
	user: User | null;
}

const PostPage: React.FC<Props> = ({ user }) => {
	const history = useHistory();

	const { id } = useParams<{ id: string }>();
	const [failed, setFailed] = useState(false);
	const [author, setAuthor] = useState<User | null>(null);
	const [post, setPost] = useState<Post | null>(null);
	const [warning, setWarning] = useState(false);

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

	const confirmDeletion = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		if (!post) return;

		const btn = e.currentTarget;
		btn.disabled = true;

		axios
			.delete(`/api/posts/${post.id}`)
			.then(() => history.push('/'))
			.catch((err: AxiosError) => {
				console.error(err);
				setWarning(false);
			});
	};

	return (
		<Layout>
			{failed ? (
				<ErrorMessage />
			) : !post || !author ? (
				<p>Cargando...</p>
			) : (
				<>
					<div className="d-flex justify-content-between">
						<h2>{post.title}</h2>

						{post.author === user?.id && (
							<ButtonGroup style={{ height: '50%' }}>
								<Button
									className="p-1"
									onClick={() => history.push(`/post/${post.id}/edit`)}
									variant="secondary"
								>
									Editar
								</Button>
								<Button
									className="p-1"
									variant="outline-danger"
									onClick={() => setWarning(true)}
								>
									Eliminar
								</Button>
							</ButtonGroup>
						)}
					</div>
					<VoteSelector user={user} post={post} setFailed={setFailed} />
					<hr />

					{post.images.length && <ImageCarousel post={post} />}

					<div>
						<ReactMarkdown remarkPlugins={[gfm]}>
							{post.description}
						</ReactMarkdown>
					</div>
				</>
			)}

			<Popup hidden={!warning} className="bg-porpl p-3 rounded">
				¿Está seguro de que quiere eliminar este anuncio? ¡Esta acción es
				irreversible!
				<div className="d-flex mt-3">
					<Button variant="secondary" onClick={() => setWarning(false)}>
						Atrás
					</Button>
					<Button
						variant="outline-danger"
						className="ml-3"
						onClick={confirmDeletion}
					>
						Eliminar
					</Button>
				</div>
			</Popup>
		</Layout>
	);
};

export default PostPage;
