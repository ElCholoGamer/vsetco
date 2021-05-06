import { useState, ComponentProps } from 'react';

interface Props extends ComponentProps<'img'> {
	fallback: any;
}

const LazyImage: React.FC<Props> = ({ fallback, alt, style, ...props }) => {
	const [loaded, setLoaded] = useState(false);

	return (
		<>
			{!loaded && fallback}
			<img
				alt={alt}
				{...props}
				style={{
					...style,
					display: !loaded ? 'none' : style?.display,
				}}
				onLoad={() => setLoaded(true)}
			/>
		</>
	);
};

export default LazyImage;
