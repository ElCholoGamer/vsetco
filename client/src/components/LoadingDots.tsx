import { useEffect, useState } from 'react';

interface Props {
	delay?: number;
}

const LoadingDots: React.FC<Props> = ({ delay = 500 }) => {
	const [time, setTime] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => setTime(time => time + 1), delay);
		return () => clearTimeout(timer);
	}, [time, delay]);

	return <>{'.'.repeat(time % 4)}</>;
};

export default LoadingDots;
