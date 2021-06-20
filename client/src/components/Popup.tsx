import { ComponentProps } from 'react';
import '@scss/Popup.scss';

interface Props extends ComponentProps<'div'> {
	hidden: boolean;
}

const Popup: React.FC<Props> = ({ hidden, children, ...props }) => {
	return (
		<div className="popup-wrapper" style={hidden ? { display: 'none' } : {}}>
			<div className="popup-background"></div>
			<div {...props} className={`popup ${props.className || ''}`}>
				{children}
			</div>
		</div>
	);
};

export default Popup;
