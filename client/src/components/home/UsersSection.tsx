import {
	useEffect,
	useState,
	Dispatch,
	SetStateAction,
	ComponentProps,
} from 'react';
import axios from 'axios';
import User from '@structures/user';

interface Props extends ComponentProps<'div'> {
	user: User | null;
	setFailed: Dispatch<SetStateAction<boolean>>;
}

const UsersSection: React.FC<Props> = ({
	user: self,
	setFailed,
	...divProps
}) => {
	const [users, setUsers] = useState<User[] | null>(null);

	useEffect(() => {
		axios
			.get('/api/users/@popular')
			.then(res =>
				setUsers(res.data.filter((user: User) => user.id !== self?.id))
			)
			.catch(err => {
				setFailed(true);
				console.error(err);
			});
	}, [setFailed, self]);

	return (
		<div className="home-users p-3 m-2 bg-porpl rounded" {...divProps}>
			<h4>Usuarios populares</h4>
			<hr />

			{!users ? (
				<p>Cargando...</p>
			) : !users.length ? (
				<small>Parece que no hay nada aquí</small>
			) : (
				<ul>
					{users.map(user => (
						<li key={user.id}>{user.username}</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default UsersSection;
