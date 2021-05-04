import Navbar from 'react-bootstrap/Navbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Logo from '@assets/img/logo.svg';

const Header: React.FC = () => {
	return (
		<Navbar bg="secondary">
			<Navbar.Brand as={Link} to="/">
				<img src={Logo} alt="Logo" height={30} /> Vsetko
			</Navbar.Brand>
			<Navbar.Collapse className="justify-content-end">
				<ButtonGroup>
					<Button variant="secondary">Acceder</Button>
					<Button variant="secondary">Registrarte</Button>
				</ButtonGroup>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
