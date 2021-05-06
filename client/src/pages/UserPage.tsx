import Layout from '@components/Layout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import User from '@structures/user';
import { customList } from 'country-codes-list';
import LazyImage from '@components/LazyImage';

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

	return (
		<Layout>
			{!loaded ? (
				<p>Loading...</p>
			) : !user ? (
				<h2>User not found :(</h2>
			) : (
				<>
					<h1>{user.username}</h1>
					<p>
						<LazyImage
							src={`https://www.countryflags.io/${user.country.toLowerCase()}/flat/32.png`}
							fallback={null}
						/>{' '}
						{countries[user.country]}
					</p>
				</>
			)}
		</Layout>
	);
};

export default UserPage;
