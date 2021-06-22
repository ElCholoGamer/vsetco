import {
	ChangeEvent,
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import Button from 'react-bootstrap/Button';
import ImageSelectorItem from './ImageSelectorItem';

interface Props {
	setImages: Dispatch<SetStateAction<[number, File][]>>;
	images: [number, File][];
	maxImages: number;
}

const ImageSelector: React.FC<Props> = ({ setImages, images, maxImages }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [sources, setSources] = useState<string[] | null>(null);

	useEffect(() => {
		for (let i = 0; i < images.length; i++) {
			const reader = new FileReader();

			reader.onload = () => {
				setSources(prev => {
					const out = [...(prev || [])];
					out[i] = reader.result as string;

					return out;
				});
			};

			reader.readAsDataURL(images[i][1]);
		}
	}, [images]);

	const onImageAdded = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (!files?.length) return;

		const now = Date.now();
		const out = Array.from(files).map<[number, File]>(file => [now, file]);

		setImages(prev => [...prev, ...out].slice(0, 10));
	};

	const deleteImage = (index: number) => {
		const removeIndex: SetStateAction<any[]> = prev => {
			const out = [...prev];
			out.splice(index, 1);
			return out;
		};

		setImages(removeIndex);
		setSources(prev => removeIndex(prev || []));
	};

	return (
		<div className="w-100">
			<div className="bg-secondary rounded p-3">
				{sources && sources.length > 0 ? (
					<div className="d-flex overflow-auto">
						{sources.map((src, index) => (
							<ImageSelectorItem
								key={`${index}:${src}`}
								index={index}
								src={src}
								deleteImage={deleteImage}
								images={images}
								setImages={setImages}
							/>
						))}
					</div>
				) : (
					<div className="text-gray">¡Inserta una imagen o dos!</div>
				)}

				<hr />
				<input
					onChange={onImageAdded}
					type="file"
					accept="image/png, image/jpeg"
					multiple
					ref={inputRef}
					className="d-none"
				/>
				<Button
					disabled={images.length >= maxImages}
					variant="porpl"
					onClick={() => inputRef.current?.click()}
				>
					Añadir imágenes
				</Button>
				{images.length >= maxImages && (
					<span className="ml-2">
						Límite de imágenes alcanzado ({maxImages})
					</span>
				)}
			</div>

			<hr />
		</div>
	);
};

export default ImageSelector;
