import Layout from '@components/Layout';
import React, { ChangeEvent, useState, MouseEvent } from 'react';
import axios, { AxiosError } from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import User from '@structures/user';
import { Redirect } from 'react-router';

interface Props {
	user: User | null;
}

const LoginPage: React.FC<Props> = ({ user }) => {
	const [alert, setAlert] = useState<string | null>(null);
	const [input, setInput] = useState({
		username: '',
		password: '',
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInput(prev => ({ ...prev, [name]: value.trim() }));
	};

	const handleSubmit = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		let { username, password } = input;

		username = username.trim();
		password = password.trim();

		setAlert(null);
		const btn = e.currentTarget;
		btn.disabled = true;

		axios
			.post('/auth/login', { username, password })
			.then(() => {
				localStorage.setItem('logged_in', '1');
				window.location.href = '/';
			})
			.catch((err: AxiosError) => {
				setAlert(
					err.response?.data?.message ||
						'Ocurrió un error, por favor intente más tarde'
				);
				btn.disabled = false;
			});
	};

	if (user) return <Redirect to="/" />;

	return (
		<Layout>
			<Form>
				<Form.Group>
					<Form.Label>Nombre de usuario</Form.Label>
					<Form.Control
						name="username"
						value={input.username}
						onChange={handleChange}
						type="text"
						placeholder="Ingresa tu nombre de usuario aquí"
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Contraseña</Form.Label>
					<Form.Control
						name="password"
						value={input.password}
						onChange={handleChange}
						type="password"
						placeholder="Ingresa tu contraseña aquí"
					/>
				</Form.Group>

				<Button
					variant="secondary"
					onClick={handleSubmit}
					disabled={Object.values(input).some(
						value => value.trim().length === 0
					)}>
					Acceder
				</Button>
			</Form>

			{alert && (
				<Alert className="mt-4" variant="danger">
					{alert}
				</Alert>
			)}
		</Layout>
	);
};

export default LoginPage;
