import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '@components/Layout';
import PostPreview from '@components/home/PostPreview';
import Post from '@structures/post';
import User from '@structures/user';
import '@scss/HomePage.scss';
import ErrorMessage from '@components/ErrorMessage';
import PostSorter from '@components/home/PostSorter';

interface Props {
	user: User | null;
}

const HomePage: React.FC<Props> = ({ user }) => {
	const sortRef = useRef('hot');

	const [failed, setFailed] = useState(false);
	const [posts, setPosts] = useState<Post[] | null>(null);

	useEffect(() => {
		setPosts(null);
		setFailed(false);

		axios
			.get(`/api/posts?sort=${sortRef.current}`)
			.then(res => setPosts(res.data))
			.catch(err => {
				console.error(err);
				setFailed(true);
			});
	}, []);

	return (
		<Layout>
			{failed ? (
				<ErrorMessage />
			) : (
				<>
					<PostSorter sortRef={sortRef} />
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
