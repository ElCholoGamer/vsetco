import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Header from '@components/Header';
import User from '@structures/user';
import NotFoundPage from '@pages/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@scss/App.scss';
import Footer from '@components/Footer';
import SearchPage from '@pages/SearchPage';

const HomePage = lazy(() => import('@pages/HomePage'));
const LoginPage = lazy(() => import('@pages/LoginPage'));
const RegisterPage = lazy(() => import('@pages/RegisterPage'));
const UserPage = lazy(() => import('@pages/UserPage'));
const CreatePostPage = lazy(() => import('@pages/post/CreatePostPage'));
const PostPage = lazy(() => import('@pages/post/PostPage'));
const EditPostPage = lazy(() => import('@pages/post/EditPostPage'));

const App: React.FC = () => {
	const [loaded, setLoaded] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		if (localStorage.getItem('logged_in') !== '1') {
			setUser(null);
			return setLoaded(true);
		}

		if (loaded) return;

		axios
			.get('/api/users/@me')
			.then(res => setUser(res.data))
			.catch(err => {
				localStorage.removeItem('logged_in');
				setUser(null);

				if (err.response?.status !== 401) {
					console.error(err);
				}
			})
			.finally(() => setLoaded(true));
	}, [loaded]);

	return (
		<div
			id="main-wrapper"
			className="d-flex flex-column justify-content-between">
			<div id="content-wrapper">
				<Header user={user} />
				<Suspense fallback={null}>
					{loaded && (
						<Switch>
							<Route exact path="/">
								<HomePage user={user} />
							</Route>

							<Route exact path="/login" children={<LoginPage user={user} />} />
							<Route exact path="/register">
								<RegisterPage user={user} />
							</Route>

							<Route exact path="/search">
								<SearchPage />
							</Route>

							<Route exact path="/account">
								<UserPage user={user} />
							</Route>
							<Route exact path="/user/:id">
								<UserPage user={user} />
							</Route>

							<Route exact path="/post">
								<CreatePostPage user={user} />
							</Route>
							<Route exact path="/post/:id">
								<PostPage user={user} />
							</Route>
							<Route exact path="/post/:id/edit">
								<EditPostPage user={user} />
							</Route>

							<Route exact path="/*">
								<NotFoundPage />
							</Route>
						</Switch>
					)}
				</Suspense>
			</div>
			<Footer />
		</div>
	);
};

export default App;
