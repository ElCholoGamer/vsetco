import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Header from '@components/Header';
import User from './structures/user';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@scss/App.scss';

const Home = lazy(() => import('@pages/Home'));
const Login = lazy(() => import('@pages/Login'));
const Register = lazy(() => import('@pages/Register'));

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
			<Header user={user} setLoaded={setLoaded} />
			<Suspense fallback={null}>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
				</Switch>
			</Suspense>
		</>
	);
};

export default App;
