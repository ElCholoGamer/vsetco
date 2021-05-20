import { MutableRefObject, useState, useEffect } from 'react';
import FormControl from 'react-bootstrap/FormControl';

interface Props {
	sortRef: MutableRefObject<string>;
}

const PostSorter: React.FC<Props> = ({ sortRef: ref }) => {
	const [selected, setSelected] = useState(ref.current);

	useEffect(() => {
		ref.current = selected;
	}, [ref, selected]);

	return (
		<div className="d-flex align-items-center">
			Ordernar por:
			<FormControl
				className="p-0 ml-2 sort-selector"
				as="select"
				value={selected}
				onChange={e => setSelected(e.target.value)}>
				<option value="hot">Populares</option>
				<option value="new">Nuevos</option>
				<option value="top">Más votados</option>
			</FormControl>
		</div>
	);
};

export default PostSorter;
