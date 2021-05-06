import Navbar from 'react-bootstrap/Navbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Logo from '@assets/img/logo.svg';
import DefaultProfile from '@assets/img/default_profile.svg';
import User from 'src/structures/user';
import axios from 'axios';
import { Dispatch, MouseEvent, SetStateAction } from 'react';
import LazyImage from './LazyImage';
import '@scss/Header.scss';

interface Props {
	setLoaded: Dispatch<SetStateAction<boolean>>;
	user: User | null;
}

const Header: React.FC<Props> = ({ user, setLoaded }) => {
	const logOut = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
		const btn = e.currentTarget;
		btn.disabled = true;

		axios
			.post('/auth/logout')
			.then(() => {
				localStorage.removeItem('logged_in');
				window.location.reload();
			})
			.catch(err => {
				console.error(err);
				btn.disabled = false;
			});
	};

	const profilePicProps = {
		className: 'profile-picture mx-2',
		width: 40,
		height: 40,
	};

	return (
		<Navbar bg="secondary">
			<Navbar.Brand as={Link} to="/">
				<img src={Logo} alt="Logo" height={30} /> Vsetko
			</Navbar.Brand>

			<Navbar.Collapse className="justify-content-end">
				{user ? (
					<>
						{user.username}
						<LazyImage
							src="/api/users/@me/picture"
							{...profilePicProps}
							fallback={
								<img src={DefaultProfile} alt="Profile" {...profilePicProps} />
							}
						/>
						<Button variant="outline-danger" onClick={logOut}>
							Cerrar Sesión
						</Button>
					</>
				) : (
					<ButtonGroup>
						<Button as={Link} to="/login" variant="secondary">
							Acceder
						</Button>
						<Button as={Link} to="/register" variant="secondary">
							Registrarte
						</Button>
					</ButtonGroup>
				)}
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
