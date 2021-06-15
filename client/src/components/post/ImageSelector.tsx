import {
	ChangeEvent,
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import Button from 'react-bootstrap/Button';
import CrossIcon from '@assets/img/cross_icon.svg';

interface Props {
	setImages: Dispatch<SetStateAction<File[]>>;
	images: File[];
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

			reader.readAsDataURL(images[i]);
		}
	}, [images]);

	const addImage = () => {
		if (images.length >= maxImages) {
			return alert(`El límite de imágenes por anuncio es ${maxImages}.`);
		}

		inputRef.current?.click();
	};

	const onImageAdded = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (!files?.length) return;

		setImages(prev => [...prev, ...files]);
	};

	const deleteImage = (index: number) => {
		const f: SetStateAction<any[]> = prev => {
			const out = [...(prev || [])];
			out.splice(index, 1);
			return out;
		};

		setImages(f);
		setSources(prev => f(prev || []));
	};

	return (
		<div className="w-100">
			<div className="bg-secondary rounded p-3">
				{sources && sources.length > 0 ? (
					<div className="d-flex overflow-auto">
						{sources.map((src, index) => (
							<div key={src} className="position-relative d-inline-blockm mx-2">
								<img src={src} alt="" height="200" className="rounded shadow" />
								<img
									src={CrossIcon}
									alt="Quitar"
									width="25"
									className="btn-delete-image rounded-circle position-absolute"
									onClick={() => deleteImage(index)}
								/>
							</div>
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
				<Button variant="porpl" onClick={addImage}>
					Añadir imagen
				</Button>
			</div>

			<hr />
		</div>
	);
};

export default ImageSelector;
