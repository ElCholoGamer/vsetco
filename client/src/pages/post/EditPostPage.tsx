import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Redirect, useHistory } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import axios, { AxiosError } from 'axios';
import Layout from '@components/Layout';
import User from '@structures/user';
import Post from '@structures/post';
import ErrorMessage from '@components/ErrorMessage';
import PostForm from '@components/post/PostForm';
import { PostInput } from 'src/utils';

interface Props {
	user: User | null;
}

const EditPostPage: React.FC<Props> = ({ user }) => {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const history = useHistory();

	const [failed, setFailed] = useState(false);
	const [post, setPost] = useState<Post | null>(null);
	const [imageFiles, setImageFiles] = useState<File[] | null>(null);
	const [alert, setAlert] = useState<string | null>(null);

	useEffect(() => {
		if (!user) return;

		axios
			.get(`/api/posts/${id}`)
			.then(res => {
				setPost(res.data);
			})
			.catch(err => {
				console.error(err);
				setFailed(true);
			});
	}, [id, user]);

	useEffect(() => {
		if (!post) return;

		(async () => {
			const newImageFiles: File[] = [];
			for (const imageId of post.images) {
				try {
					const res = await axios.get(
						`/api/images/post/${post.id}/${imageId}`,
						{
							responseType: 'arraybuffer',
						}
					);
					const blob = new Blob([new Uint8Array(res.data)]);

					newImageFiles.push(new File([blob], imageId));
				} catch (err) {
					console.error(err);
					setFailed(true);
				}
			}

			setImageFiles(newImageFiles);
		})();
	}, [post]);

	const submit = async (input: PostInput) => {
		if (!post) return;

		const { title, description, category, contacts, images } = input;
		const validContacts: Record<string, string> = {};

		for (const contactName in contacts) {
			const key = contactName as keyof typeof contacts;
			const contact = contacts[key];
			if (contact) validContacts[key] = contact;
		}

		if (Object.keys(validContacts).length === 0) {
			return setAlert('Debes introducir al menos un contacto');
		}

		const data = new FormData();
		data.append('title', title);
		data.append('description', description);
		data.append('category', category || '');
		data.append('contacts', JSON.stringify(validContacts));

		for (const image of images) {
			data.append('images', image);
		}

		setAlert('');

		try {
			const res = await axios.put(`/api/posts/${post.id}`, data);
			history.push(`/post/${res.data.id}`);
		} catch (unknownErr: unknown) {
			const err = unknownErr as AxiosError;

			console.error(err);
			setAlert(
				err.response?.data?.message ||
					'Ocurrió un error, por favor intente más tarde.'
			);
		}
	};

	if (!user) {
		return (
			<Redirect to={`/login?r=${encodeURIComponent(location.pathname)}`} />
		);
	}

	if (post && post.author !== user.id) return <Redirect to={`/post/${id}`} />;

	return (
		<Layout>
			{post && imageFiles ? (
				failed ? (
					<ErrorMessage />
				) : (
					<>
						<h2>Editar anuncio</h2>
						<hr />

						<PostForm
							defaultInput={{
								title: post.title,
								description: post.description,
								category: post.category,
								contacts: post.contacts,
								images: imageFiles,
							}}
							submit={submit}
						/>
						{alert && (
							<Alert variant="danger" className="mt-3">
								{alert}
							</Alert>
						)}
					</>
				)
			) : (
				<>
					<h3>Cargando...</h3>
				</>
			)}
		</Layout>
	);
};

export default EditPostPage;
