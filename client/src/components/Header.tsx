import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';
import User from '@structures/user';
import Logo from '@assets/img/logo.svg';
import DefaultProfile from '@assets/img/default_profile.svg';
import CreatePostIcon from '@assets/img/create_post_icon.svg';
import '@scss/Header.scss';

interface Props {
	user: User | null;
}

const Header: React.FC<Props> = ({ user }) => {
	const profilePicProps = {
		className: 'mx-2 rounded-circle',
		width: 40,
		height: 40,
	};

	return (
		<Navbar expand="sm" bg="secondary">
			<Navbar.Brand as={Link} to="/">
				<img src={Logo} alt="Logo" height={35} /> Vsětco
			</Navbar.Brand>

			<Navbar.Toggle aria-controls="navbar" />
			<Navbar.Collapse id="navbar">
				<Nav className="mr-auto">
					<Nav.Link as={Link} to="/search">
						Buscar
					</Nav.Link>
				</Nav>
				{user ? (
					<div className="d-flex align-items-center">
						<Button
							className="post-btn d-flex align-items-center justify-content-middle mx-3"
							variant="secondary"
							as={Link}
							to="/post"
						>
							<img height="20" src={CreatePostIcon} alt="Create Post" />
						</Button>
						<Link to={`/account`} className="header-profile">
							{user.username}
							<LazyImage
								src={`/api/images/user/${user.id}`}
								{...profilePicProps}
								fallback={
									<img
										src={DefaultProfile}
										alt="Profile"
										{...profilePicProps}
									/>
								}
							/>
						</Link>
					</div>
				) : (
					<ButtonGroup>
						<Button as={Link} to="/login" variant="dark-orange">
							Ingresar
						</Button>
						<Button as={Link} to="/register" variant="dark-orange">
							Registrarte
						</Button>
					</ButtonGroup>
				)}
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
