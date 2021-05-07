import { ChangeEvent, MouseEvent, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Redirect, useHistory } from 'react-router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Layout from '@components/Layout';
import User from '@structures/user';
import categories from '@structures/categories';

interface Props {
	user: User | null;
}

const CreatePostPage: React.FC<Props> = ({ user }) => {
	const history = useHistory();
	const [alert, setAlert] = useState<string | null>(null);
	const [input, setInput] = useState({
		title: '',
		description: '',
		category: '',
	});
	const [contacts, setContacts] = useState({
		email: user?.email || '',
		phone: user?.contacts.phone || '',
		address: user?.contacts.address || '',
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInput(prev => ({ ...prev, [name]: value.trimStart() }));
	};

	const handleContactChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setContacts(prev => ({ ...prev, [name]: value.trimStart() }));
	};

	const inputProps = (name: keyof typeof input) => {
		return {
			name,
			onChange: handleChange,
			value: input[name],
		};
	};

	const contactProps = (name: keyof typeof contacts) => {
		return {
			name,
			onChange: handleContactChange,
			value: contacts[name],
		};
	};

	const handleSubmit = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		const btn = e.currentTarget;

		const { title, description, category } = input;
		const validContacts: Record<string, string> = {};

		for (const contactName in contacts) {
			const key = contactName as keyof typeof contacts;
			if (contacts[key]) validContacts[key] = contacts[key];
		}

		if (Object.keys(validContacts).length === 0) {
			return setAlert('Debes introducir al menos un contacto');
		}

		setAlert('');
		btn.disabled = true;

		axios
			.post('/api/posts', {
				title,
				description,
				category: category || undefined,
				contacts: validContacts,
			})
			.then(res => history.push(`/post/${res.data.id}`))
			.catch((err: AxiosError) => {
				btn.disabled = false;
				console.error(err);
				setAlert(
					err.response?.data?.message ||
						'Ocurrió un error, por favor intente más tarde.'
				);
			});
	};

	if (!user) {
		return <Redirect to="/" />;
	}

	return (
		<Layout>
			<h2>Publicar un anuncio</h2>
			<hr />

			<Form>
				<Form.Group>
					<Form.Label>Título del anuncio</Form.Label>
					<Form.Control
						{...inputProps('title')}
						type="text"
						placeholder="Título aquí"
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Descripción del anuncio</Form.Label>
					<Form.Control
						{...inputProps('description')}
						as="textarea"
						placeholder="Una descripción acerca del anuncio"
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Categoría (opcional)</Form.Label>
					<Form.Control as="select" {...inputProps('category')}>
						<option value="">(Sin categoría)</option>
						{categories.map(category => (
							<option>{category.name}</option>
						))}
					</Form.Control>
				</Form.Group>

				<Form.Group>
					<Form.Label>
						<strong>Contactos</strong>
					</Form.Label>

					<Form.Group>
						<Form.Label>Correo Electrónico</Form.Label>
						<Form.Control type="text" {...contactProps('email')} />
					</Form.Group>

					<Form.Group>
						<Form.Label>Teléfono</Form.Label>
						<Form.Control type="text" {...contactProps('phone')} />
					</Form.Group>

					<Form.Group>
						<Form.Label>Dirección</Form.Label>
						<Form.Control type="text" {...contactProps('address')} />
					</Form.Group>
				</Form.Group>

				<Button
					variant="secondary"
					disabled={!input.title || !input.description}
					onClick={handleSubmit}>
					Publicar
				</Button>

				{alert && (
					<Alert variant="danger" className="mt-3">
						{alert}
					</Alert>
				)}
			</Form>
		</Layout>
	);
};

export default CreatePostPage;
