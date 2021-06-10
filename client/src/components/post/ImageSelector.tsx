import {
	ChangeEvent,
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import Button from 'react-bootstrap/Button';

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
		const file = e.target.files?.[0];
		if (!file) return;

		setImages(prev => [...prev, file]);
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
			<div className="overflow-auto">
				{sources?.map((src, index) => (
					<span key={src} className="position-relative d-inline-block">
						<img src={src} alt="" height="200" />
						<Button
							variant="dark"
							className="btn-delete-image rounded-circle text-light border-0 position-absolute"
							onClick={() => deleteImage(index)}>
							X
						</Button>
					</span>
				))}
			</div>

			<input
				onChange={onImageAdded}
				type="file"
				accept="image/*"
				ref={inputRef}
				className="d-none"
			/>
			<Button variant="porpl" className="mt-3" onClick={addImage}>
				+
			</Button>

			<hr />
		</div>
	);
};

export default ImageSelector;
