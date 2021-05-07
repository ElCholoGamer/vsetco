import { useEffect, useState, MouseEvent } from 'react';
import { Redirect, useParams } from 'react-router';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { customList } from 'country-codes-list';
import Layout from '@components/Layout';
import LazyImage from '@components/LazyImage';
import User from '@structures/user';

const countries = customList('countryCode', '{countryNameEn}');

interface Props {
	user: User | null;
}

const UserPage: React.FC<Props> = ({ user: self }) => {
	const { id } = useParams<{ id?: string }>();
	const [loaded, setLoaded] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const finalId = id || self?.id;
		if (!finalId) return;

		axios
			.get(`/api/users/${finalId}`)
			.then(res => setUser(res.data))
			.catch(console.error)
			.finally(() => setLoaded(true));
	}, [id, self]);

	if (!id && !self) {
		return <Redirect to={`/login?r=${encodeURIComponent('/account')}`} />;
	}

	const logOut = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
		const btn = e.currentTarget;
		btn.disabled = true;

		axios
			.post('/auth/logout')
			.then(() => {
				localStorage.removeItem('logged_in');
				window.location.href = '/';
			})
			.catch(err => {
				console.error(err);
				btn.disabled = false;
			});
	};

	return (
		<Layout>
			{!loaded ? (
				<p>Loading...</p>
			) : !user ? (
				<h2>User not found :(</h2>
			) : (
				<>
					<h2>{user.username}</h2>
					<p>
						<LazyImage
							src={`https://www.countryflags.io/${user.country.toLowerCase()}/flat/32.png`}
							fallback={null}
						/>{' '}
						{countries[user.country]}
					</p>
					<hr />

					{user.id === self?.id && (
						<Button variant="outline-danger" onClick={logOut}>
							Cerrar Sesión
						</Button>
					)}
				</>
			)}
		</Layout>
	);
};

export default UserPage;
