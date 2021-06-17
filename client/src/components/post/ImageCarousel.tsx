import Carousel from 'react-bootstrap/Carousel';
import Post from '@structures/post';
import LazyImage from '@components/LazyImage';

interface Props {
	post: Post;
}

const ImageCarousel: React.FC<Props> = ({ post }) => {
	return (
		<Carousel
			id="post-carousel"
			interval={null}
			wrap={false}
			className="bg-dark rounded"
		>
			{post.images.map(id => (
				<Carousel.Item key={id} className="text-center">
					<div className="post-carousel-image-wrapper d-flex align-items-center justify-content-center">
						<LazyImage
							className="post-carousel-image"
							src={`/api/images/post/${post.id}/${id}`}
							fallback={<>test</>}
						/>
					</div>
				</Carousel.Item>
			))}
		</Carousel>
	);
};

export default ImageCarousel;
