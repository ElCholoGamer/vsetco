import { ComponentProps } from 'react';

interface Props extends ComponentProps<'svg'> {
	size: string | number;
	direction: 'up' | 'down';
	gray?: boolean;
}

const colors = {
	up: '#8bd47d',
	down: '#ed4c4c',
	gray: '#c2c2c2',
};

const rectProps = {
	up: { y: 40, height: 100 },
	down: { y: 0, height: 60 },
};

const ArrowIcon: React.FC<Props> = ({
	direction,
	size,
	gray = false,
	...props
}) => {
	return (
		<svg
			className={gray ? '' : 'active-arrow'}
			width={size}
			height={size}
			viewBox="0 0 100 100"
			{...props}>
			<polygon
				points={direction === 'up' ? '0,50 50,0 100,50' : '0,50 50,100 100,50'}
				fill={gray ? colors.gray : colors[direction]}
			/>
			<rect
				x="30"
				width="40"
				{...rectProps[direction]}
				fill={gray ? colors.gray : colors[direction]}
			/>
		</svg>
	);
};

export default ArrowIcon;
