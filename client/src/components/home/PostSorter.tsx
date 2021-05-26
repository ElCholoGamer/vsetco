import { Dispatch, SetStateAction } from 'react';

interface Props {
	sort: string;
	setSort: Dispatch<SetStateAction<string>>;
}

const sortOptions: Record<string, string> = {
	hot: 'Populares',
	new: 'Nuevos',
	top: 'Más votados',
};

const PostSorter: React.FC<Props> = ({ sort, setSort }) => {
	return (
		<div className="d-flex align-items-center">
			Ordernar por:
			<div className="d-flex align-items-center ">
				{Object.keys(sortOptions).map(key => (
					<option
						className={
							'sort-option my-0 mx-2 cursor-pointer' +
							(key === sort ? ' font-weight-bold' : '')
						}
						key={key}
						value={key}
						onClick={e => setSort(e.currentTarget.value)}>
						{sortOptions[key]}
					</option>
				))}
			</div>
		</div>
	);
};

export default PostSorter;
