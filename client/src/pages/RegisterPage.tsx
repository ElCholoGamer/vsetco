import Layout from '@components/Layout';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import React, { ChangeEvent, MouseEvent, useState } from 'react';
import { Redirect } from 'react-router';
import axios, { AxiosError } from 'axios';
import { customList } from 'country-codes-list';
import User from '@structures/user';
import { useQuery } from '../utils';

interface Props {
	user: User | null;
}

const countries = customList('countryCode', '{countryNameEn}');

const RegisterPage: React.FC<Props> = ({ user }) => {
	const redirect = useQuery().get('r') || '/';
	const [alert, setAlert] = useState<string | null>(null);
	const [input, setInput] = useState({
		email: '',
		username: '',
		password: '',
		passwordConfirm: '',
		country: '',
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInput(prev => ({ ...prev, [name]: value.trim() }));
	};

	const handleSubmit = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		let { email, username, password, passwordConfirm, country } = input;

		email = email.trim();
		username = username.trim();
		password = password.trim();
		passwordConfirm = passwordConfirm.trim();

		if (password !== passwordConfirm) {
			return setAlert('La contraseñas ingresadas son diferentes');
		}

		if (username.length < 2) {
			return setAlert('El nombre de usuario es muy corto');
		}

		setAlert(null);
		const btn = e.currentTarget;
		btn.disabled = true;

		axios
			.post('/auth/register', {
				email,
				username,
				password,
				country: Object.keys(countries).find(
					code => countries[code] === country
				),
			})
			.then(() => {
				window.localStorage.setItem('logged_in', '1');
				window.location.href = redirect;
			})
			.catch((err: AxiosError) => {
				setAlert(
					err.response?.data?.message ||
						'Ocurrió un error, por favor intente más tarde'
				);
				btn.disabled = false;
			});
	};

	if (user) return <Redirect to={redirect} />;

	return (
		<Layout>
			<Form>
				<Form.Group>
					<Form.Label>Correo electrónico</Form.Label>
					<Form.Control
						name="email"
						value={input.email}
						onChange={handleChange}
						type="email"
						placeholder="Ingresa tu correo aquí"
					/>
				</Form.Group>

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

				<Form.Group>
					<Form.Label>Contraseña (de nuevo)</Form.Label>
					<Form.Control
						name="passwordConfirm"
						value={input.passwordConfirm}
						onChange={handleChange}
						type="password"
						placeholder="Repite tu contraseña aquí"
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>País</Form.Label>
					<Form.Control
						as="select"
						name="country"
						value={input.country}
						onChange={handleChange}>
						<option value="" disabled>
							(Seleccionar)
						</option>
						{Object.keys(countries).map(code => (
							<option key={code}>{countries[code]}</option>
						))}
					</Form.Control>
				</Form.Group>

				<Button
					variant="secondary"
					onClick={handleSubmit}
					disabled={Object.values(input).some(
						value => value.trim().length === 0
					)}>
					Registrar
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

export default RegisterPage;
