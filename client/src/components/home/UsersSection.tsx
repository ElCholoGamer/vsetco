import {
	useEffect,
	useState,
	Dispatch,
	SetStateAction,
	ComponentProps,
} from 'react';
import axios from 'axios';
import User from '@structures/user';
import LazyImage from '@components/LazyImage';
import DefaultProfile from '@assets/img/default_profile.svg';
import { Link } from 'react-router-dom';

interface Props extends ComponentProps<'div'> {
	user: User | null;
	setFailed: Dispatch<SetStateAction<boolean>>;
}

// const mockUsers: User[] = [...Array(5)].map((e, index) => {
// 	return {
// 		id: index.toString(),
// 		username: `Mock user #${index}`,
// 		contacts: {},
// 		email: `mockuser${index}@gmail.com`,
// 		country: 'PE',
// 	};
// });

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
		<div
			className="home-users p-3 m-2 bg-porpl rounded align-self-baseline"
			{...divProps}
		>
			<h4>Usuarios populares</h4>
			<hr />

			{!users ? (
				<p>Cargando...</p>
			) : !users.length ? (
				<small>Parece que no hay nada por aquí.</small>
			) : (
				<div>
					{users.map(user => {
						const imageProps = {
							className: 'rounded-circle mr-2',
							width: '40',
						};

						return (
							<Link
								to={`/user/${user.id}`}
								key={user.id}
								className="bg-porpl popular-user d-flex align-items-center my-1 p-2 rounded"
							>
								<LazyImage
									src={`/api/images/user/${user.id}`}
									fallback={<img src={DefaultProfile} alt="" {...imageProps} />}
									{...imageProps}
								/>
								{user.username}
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default UsersSection;
