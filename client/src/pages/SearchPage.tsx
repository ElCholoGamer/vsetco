import React, { ChangeEvent, useState, KeyboardEventHandler } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Layout from '@components/Layout';
import LoadingDots from '@components/LoadingDots';
import Post from '@structures/post';
import PostPreview from '@components/home/PostPreview';

const SearchPage: React.FC = () => {
	const [dialog, setDialog] = useState('Busca un anuncio');
	const [input, setInput] = useState('');
	const [posts, setPosts] = useState<Post[] | null>(null);
	const [loading, setLoading] = useState(false);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value.trimStart());
	};

	const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
		if (e.key === 'Enter') doSearchThing();
	};

	const doSearchThing = async () => {
		if (!input) return;

		setLoading(true);

		try {
			const res = await axios.get(`/api/posts?search=${input}`);
			setDialog('Resultados:');
			setPosts(res.data);
			setLoading(false);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Layout>
			<div className="d-flex">
				<FormControl
					onSubmit={() => console.log('Submit')}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					value={input}
				/>
				<Button
					disabled={loading}
					onClick={doSearchThing}
					className="ml-3 px-4"
					variant="porpl">
					Buscar
				</Button>
			</div>

			<h2 className="my-3">{loading ? <LoadingDots /> : dialog}</h2>
			{posts && (
				<>
					<hr />
					<div>
						{posts.map(post => (
							<PostPreview key={post.id} post={post} />
						))}
					</div>
				</>
			)}
		</Layout>
	);
};

export default SearchPage;
