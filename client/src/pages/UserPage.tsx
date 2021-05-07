import { useEffect, useState, MouseEvent } from 'react';
import { useParams } from 'react-router';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { customList } from 'country-codes-list';
import Layout from '@components/Layout';
import LazyImage from '@components/LazyImage';
import User from '@structures/user';

const countries = customList('countryCode', '{countryNameEn}');

const UserPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [loaded, setLoaded] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		axios
			.get(`/api/users/${id}`)
			.then(res => setUser(res.data))
			.catch(console.error)
			.finally(() => setLoaded(true));
	}, [id]);

	const logOut = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
		const btn = e.currentTarget;
		btn.disabled = true;

		axios
			.post('/auth/logout')
			.then(() => {
				localStorage.removeItem('logged_in');
				window.location.reload();
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

					<Button variant="outline-danger" onClick={logOut}>
						Cerrar Sesión
					</Button>
				</>
			)}
		</Layout>
	);
};

export default UserPage;
