import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import axios, { AxiosError } from 'axios';
import Post from '@structures/post';
import PostSorter from './PostSorter';
import User from '@structures/user';
import { Link } from 'react-router-dom';
import PostPreview from './PostPreview';

interface Props {
	user: User | null;
	setFailed: Dispatch<SetStateAction<boolean>>;
}

const PostsSection: React.FC<Props> = ({ user, setFailed }) => {
	const [sort, setSort] = useState('hot');
	const [posts, setPosts] = useState<Post[] | null>(null);

	useEffect(() => {
		setPosts(null);
		setFailed(false);

		axios
			.get(`/api/posts?sort=${sort}`)
			.then(res => setPosts(res.data))
			.catch((err: AxiosError) => {
				console.error(err);
				setFailed(true);
			});
	}, [sort, setFailed]);

	return (
		<div className="home-posts bg-porpl p-3 rounded">
			<PostSorter sort={sort} setSort={setSort} />
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
				posts.map(post => (
					<>
						<PostPreview key={post.id} post={post} />
						<hr />
					</>
				))
			)}
		</div>
	);
};

export default PostsSection;
