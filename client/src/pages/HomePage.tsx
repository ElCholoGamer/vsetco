import { useState } from 'react';
import Layout from '@components/Layout';
import User from '@structures/user';
import '@scss/HomePage.scss';
import ErrorMessage from '@components/ErrorMessage';
import PostsSection from '@components/home/PostsSection';

interface Props {
	user: User | null;
}

const HomePage: React.FC<Props> = ({ user }) => {
	const [failed, setFailed] = useState(false);

	return (
		<Layout>
			{failed ? (
				<ErrorMessage />
			) : (
				<PostsSection user={user} setFailed={setFailed} />
			)}
		</Layout>
	);
};

export default HomePage;
