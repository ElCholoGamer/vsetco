import { Dispatch, SetStateAction, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import LazyImage from '@components/LazyImage';
import CrossIcon from '@assets/img/cross_icon.svg';
import SideArrow from '@assets/img/side_arrow.svg';

interface Props {
	src: string;
	index: number;
	deleteImage: (index: number) => void;
	images: [number, File][];
	setImages: Dispatch<SetStateAction<[number, File][]>>;
}

const ImageSelectorItem: React.FC<Props> = ({
	src,
	index,
	deleteImage,
	images,
	setImages,
}) => {
	const [loaded, setLoaded] = useState(false);

	const moveImage = (to: 1 | -1) => {
		const newIndex = index + to;
		const newImages = [...images];

		[newImages[index], newImages[newIndex]] = [
			[...newImages[newIndex]],
			[...newImages[index]],
		];

		setImages(newImages);
	};

	return (
		<div className="position-relative d-inline-blockm m-2">
			<LazyImage
				src={src}
				height="200"
				className="rounded shadow"
				onLoad={() => setLoaded(true)}
				fallback={
					<div
						style={{ height: 200, width: 200 }}
						className="rounded d-flex align-items-center justify-content-center bg-dark"
					>
						<Spinner animation="border" role="status" variant="light" />
					</div>
				}
			/>
			{loaded && (
				<>
					<img
						src={CrossIcon}
						alt="Quitar"
						width="25"
						className="btn-delete-image rounded-circle position-absolute"
						onClick={() => deleteImage(index)}
					/>
					{index > 0 && (
						<img
							src={SideArrow}
							alt="Mover"
							width="20"
							height="20"
							className="btn-move-image-left position-absolute"
							onClick={() => moveImage(-1)}
						/>
					)}
					{index < images.length - 1 && (
						<img
							src={SideArrow}
							alt="Mover"
							width="20"
							height="20"
							className="btn-move-image-right position-absolute"
							onClick={() => moveImage(1)}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default ImageSelectorItem;
