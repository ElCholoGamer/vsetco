import { Router } from 'express';
import multer from 'multer';
import { unlink } from 'fs/promises';
import authenticate from '../../../middleware/authenticate';
import Post from '../../../models/post';

const upload = multer({ dest: 'temp/posts' });

const router = Router({ mergeParams: true });

router.use(async (req, res, next) => {
	const post = await Post.findById(req.params.id);

	if (!post) {
		return res.status(404).json({
			status: 404,
			message: 'Post not found',
		});
	}

	req.post = post;
	next();
});

router.get('/', (req, res) => res.json(req.post));

router.use(authenticate());

router.get('/votestatus', (req, res) => {
	const user = req.user!.id;
	const { upvotes, downvotes } = req.post;

	const voteStatus = upvotes.includes(user)
		? 1
		: downvotes.includes(user)
		? -1
		: 0;

	res.json({
		status: 200,
		voteStatus,
	});
});

router.post('/upvote', async (req, res) => {
	const { post, user } = req;
	let newStatus: number;

	if (!post.upvotes.includes(user!.id)) {
		// Add upvote
		post.upvotes.push(user!.id);
		newStatus = 1;

		// Remove possible downvote
		post.downvotes = post.downvotes.filter(id => id !== user!.id);
	} else {
		// Remove upvote
		post.upvotes = post.upvotes.filter(id => id !== user!.id);
		newStatus = 0;
	}

	await post.save();

	res.json({
		status: 200,
		newStatus,
	});
});

router.post('/downvote', async (req, res) => {
	const { post, user } = req;
	let newStatus: number;

	if (!post.downvotes.includes(user!.id)) {
		// Add downvote
		post.downvotes.push(user!.id);
		newStatus = -1;

		// Remove possible upvote
		post.upvotes = post.upvotes.filter(id => id !== user!.id);
	} else {
		// Remove downvote
		post.downvotes = post.downvotes.filter(id => id !== user!.id);
		newStatus = 0;
	}

	await post.save();
	res.json({
		status: 200,
		newStatus,
	});
});

router.use((req, res, next) => {
	if (req.post.author !== req.user!._id) {
		return res.status(403).json({
			status: 403,
			message: 'Unauthorized request',
		});
	}

	next();
});

router.put('/', upload.array('images', 10), async (req, res) => {
	const { title, description, category, contacts: jsonContacts } = req.body;
	let contacts;

	try {
		contacts = JSON.parse(jsonContacts);
	} catch {
		return res.status(400).json({
			status: 400,
			message: 'JSON de contactos inválido',
		});
	}

	const fileList = Array.isArray(req.files)
		? req.files
		: Object.values(req.files)[0];

	if (fileList.some(file => file.size > 10 ** 7)) {
		return res.status(400).json({
			status: 400,
			message: 'Una de las imágenes pesa más de 10MB',
		});
	}

	for (const image of fileList) {
		await req.app.images.pwnImage('post_images/' + req.post._id + '/' + image);
	}

	if (title) req.post.title = title;
	if (description) req.post.description = description;
	if (category) req.post.category = category;
	if (contacts && Object.keys(contacts).length > 0)
		req.post.contacts = contacts;

	const imageIds: string[] = [];

	for (const file of fileList) {
		const url = await req.app.images.uploadPostImage(req.post._id, file.path);
		await unlink(file.path);

		imageIds.push(url);
	}

	req.post.images = imageIds;

	await req.post.save();
	res.json(req.post);
});

router.delete('/', async (req, res) => {
	for (const image of req.post.images) {
		await req.app.images.pwnImage(image);
	}

	await req.post.delete();
	res.json({
		status: 200,
		message: 'Post deleted successfully',
	});
});

export default router;
