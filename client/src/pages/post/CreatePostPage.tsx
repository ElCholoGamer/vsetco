import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Redirect, useHistory } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import Layout from '@components/Layout';
import PostForm from '@components/post/PostForm';
import User from '@structures/user';
import { PostInput } from 'src/utils';

interface Props {
	user: User | null;
}

const CreatePostPage: React.FC<Props> = ({ user }) => {
	const history = useHistory();
	const [alert, setAlert] = useState<string | null>(null);

	const handleSubmit = async (input: PostInput) => {
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

		setAlert('');

		const data = new FormData();
		data.append('title', title);
		data.append('description', description);
		if (category) data.append('category', category);
		data.append('contacts', JSON.stringify(validContacts));

		for (const image of images) {
			data.append('images', image);
		}

		try {
			const res = await axios.post('/api/posts', data);
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

	if (!user) return <Redirect to={`/login?r=${encodeURIComponent('/post')}`} />;

	return (
		<Layout>
			<h2>Publicar un anuncio</h2>
			<hr />

			<PostForm
				submit={handleSubmit}
				defaultInput={{
					title: '',
					description: '',
					category: '',
					images: [],
					contacts: {
						email: user?.email || '',
						phone: user?.contacts.phone || '',
						address: user?.contacts.address || '',
					},
				}}
			/>
			{alert && (
				<Alert variant="danger" className="mt-3">
					{alert}
				</Alert>
			)}
		</Layout>
	);
};

export default CreatePostPage;
