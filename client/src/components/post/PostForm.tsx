import { useState, ChangeEvent, MouseEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { PostInput } from 'src/utils';
import categories from '@structures/categories';

interface Props {
	defaultInput?: PostInput;
	submit(input: PostInput): Promise<void>;
}

const PostForm: React.FC<Props> = ({
	submit,
	defaultInput = {
		title: '',
		description: '',
		category: '',
		contacts: {},
	},
}) => {
	const [input, setInput] = useState({
		title: defaultInput.title,
		description: defaultInput.description,
		category: defaultInput.category,
	});
	const [contacts, setContacts] = useState(defaultInput.contacts);

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
		btn.disabled = true;

		submit({ ...input, contacts: { ...contacts } }).finally(() => {
			btn.disabled = false;
		});
	};

	return (
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
		</Form>
	);
};

export default PostForm;