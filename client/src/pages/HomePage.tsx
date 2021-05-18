import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormControl from 'react-bootstrap/FormControl';
import axios from 'axios';
import Layout from '@components/Layout';
import PostPreview from '@components/home/PostPreview';
import Post from '@structures/post';
import User from '@structures/user';
import '@scss/HomePage.scss';
import ErrorMessage from '@components/ErrorMessage';

interface Props {
	user: User | null;
}

const HomePage: React.FC<Props> = ({ user }) => {
	const [failed, setFailed] = useState(false);
	const [posts, setPosts] = useState<Post[] | null>(null);
	const [sort, setSort] = useState('hot');

	useEffect(() => {
		setPosts(null);
		setFailed(false);

		axios
			.get(`/api/posts?sort=${sort}`)
			.then(res => setPosts(res.data))
			.catch(err => {
				console.error(err);
				setFailed(true);
			});
	}, [sort]);

	return (
		<Layout>
			{failed ? (
				<ErrorMessage />
			) : (
				<>
					{/* Sort selector */}
					<div className="d-flex align-items-center">
						Ordernar por:
						<FormControl
							className="p-0 ml-2 sort-selector"
							as="select"
							value={sort}
							onChange={e => setSort(e.target.value)}>
							<option value="hot">Populares</option>
							<option value="new">Nuevos</option>
							<option value="top">Más votados</option>
						</FormControl>
					</div>
					<hr />

					{posts === null ? (
						<p>Cargando...</p>
					) : posts.length === 0 ? (
						<em>
							Parece que no hay nada por aquí.
							{user && (
								<>
									{' '}
									<Link className="text-info" to="/post">
										Crea el primer anuncio!
									</Link>
								</>
							)}
						</em>
					) : (
						posts.map(post => <PostPreview key={post.id} post={post} />)
					)}
				</>
			)}
		</Layout>
	);
};

export default HomePage;
