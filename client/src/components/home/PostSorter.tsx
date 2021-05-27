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
		<div className="d-flex align-items-center justifty-content-start flex-wrap">
			<div className="my-1">Ordernar por:</div>
			<div className="d-flex align-items-center my-1">
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
