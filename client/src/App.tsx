import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Header from '@components/Header';
import User from '@structures/user';
import NotFoundPage from '@pages/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@scss/App.scss';

const HomePage = lazy(() => import('@pages/HomePage'));
const LoginPage = lazy(() => import('@pages/LoginPage'));
const RegisterPage = lazy(() => import('@pages/RegisterPage'));
const UserPage = lazy(() => import('@pages/UserPage'));
const CreatePostPage = lazy(() => import('@pages/CreatePostPage'));

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
		<>
			<Header user={user} />
			<Suspense fallback={null}>
				{loaded && (
					<Switch>
						<Route exact path="/" render={() => <HomePage user={user} />} />
						<Route
							exact
							path="/login"
							render={() => <LoginPage user={user} />}
						/>
						<Route
							exact
							path="/register"
							render={() => <RegisterPage user={user} />}
						/>
						<Route exact path="/user/:id" component={UserPage} />
						<Route
							exact
							path="/post"
							render={() => <CreatePostPage user={user} />}
						/>

						<Route exact path="/*" component={NotFoundPage} />
					</Switch>
				)}
			</Suspense>
		</>
	);
};

export default App;
