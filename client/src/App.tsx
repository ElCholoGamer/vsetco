import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.scss';

const App: React.FC = () => {
	const [number, setNumber] = useState(NaN);

	useEffect(() => {
		axios
			.get('/random')
			.then(res => setNumber(Number(res.data.number)))
			.catch(console.error);
	}, []);

	return (
		<>
			<h1>Hello, world!</h1>
			{isNaN(number) ? (
				<p>Loading number...</p>
			) : (
				<p>
					Random number: <strong>{number}</strong>
				</p>
			)}
		</>
	);
};

export default App;
