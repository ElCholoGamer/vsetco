import { v2 as cloudinary } from 'cloudinary';

export interface FolderNames {
	PROFILE_PICTURES: string;
	POST_IMAGES: string;
}

class ImageManager {
	private readonly PROFILE_SIZE = 512;

	public readonly folders: Readonly<FolderNames> = {
		PROFILE_PICTURES: 'profile_pictures',
		POST_IMAGES: 'post_images',
	};

	public init() {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_NAME,
			api_key: process.env.CLOUDINARY_KEY,
			api_secret: process.env.CLOUDINARY_SECRET,
		});
	}

	public async uploadPostImage(postId: string, file: string): Promise<string> {
		const uploadResponse = await cloudinary.uploader.upload(file, {
			folder: `post_images/${postId}`,
		});

		return uploadResponse.public_id.split('/').slice(-1)[0];
	}

	public async uploadProfilePicture(
		userId: string,
		file: string
	): Promise<string> {
		const res = await cloudinary.uploader.upload(file, {
			folder: 'profile_pictures',
			public_id: userId,
			transformation: {
				width: this.PROFILE_SIZE,
				height: this.PROFILE_SIZE,
				crop: 'fill',
			},
			invalidate: true,
		});

		return res.public_id.split('/')[1];
	}

	public getPostImage(postId: string, imageId: string) {
		return cloudinary.url(
			this.folders.POST_IMAGES + '/' + postId + '/' + imageId
		);
	}

	public getProfilePicture(id: string) {
		return cloudinary.url(this.folders.PROFILE_PICTURES + '/' + id);
	}

	public async pwnImage(id: string) {
		await cloudinary.uploader.destroy(id);
	}
}

export default ImageManager;
