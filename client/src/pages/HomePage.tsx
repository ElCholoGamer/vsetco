import { useState } from 'react';
import Layout from '@components/Layout';
import User from '@structures/user';
import '@scss/HomePage.scss';
import ErrorMessage from '@components/ErrorMessage';
import PostsSection from '@components/home/PostsSection';
import UsersSection from '@components/home/UsersSection';

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
				<div className="d-flex justify-content-center">
					<PostsSection
						user={user}
						setFailed={setFailed}
						style={{ flexGrow: 4 }}
					/>
					<UsersSection
						user={user}
						setFailed={setFailed}
						style={{ flexGrow: 1 }}
					/>
				</div>
			)}
		</Layout>
	);
};

export default HomePage;
