import { Router } from 'express';
import authenticate from '../../middleware/authenticate';
import Post from '../../models/post';
import sortFunctions from '../../util/post-sorters';
import validateEmail from '../../util/validate-email';

const router = Router();

router.get('/', async (req, res) => {
	const { sort } = req.params;
	const sortFunc = sortFunctions[sort] || sortFunctions.hot;

	const posts = await Post.find();
	posts.sort(sortFunc);

	res.json(posts);
});

router.post('/', authenticate(), async (req, res) => {
	const { title, description, contacts } = req.body;

	if (contacts.email && !validateEmail(contacts.email)) {
		return res.status(400).json({
			status: 400,
			message: 'El correo electrónico es inválido',
		});
	}

	const post = new Post({
		title,
		author: req.user!._id,
		description,
		contacts,
	});
	await post.save();

	res.json(post);
});

const idRouter = Router({ mergeParams: true });

idRouter.use(async (req, res, next) => {
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

idRouter.get('/', (req, res) => res.json(req.post));

idRouter.use(authenticate());

idRouter.post('/upvote', async (req, res) => {
	const { post, user } = req;
	let newValue: boolean;

	if (!post.upvotes.includes(user!.id)) {
		// Add upvote
		post.upvotes.push(user!.id);
		newValue = true;

		// Remove possible downvote
		post.downvotes = post.downvotes.filter(id => id !== user!.id);
	} else {
		// Remove upvote
		post.upvotes.filter(id => id !== user!.id);
		newValue = false;
	}

	res.json({
		status: 200,
		newValue,
	});
});

idRouter.post('/downvote', async (req, res) => {
	const { post, user } = req;
	let newValue: boolean;

	if (!post.downvotes.includes(user!.id)) {
		// Add downvote
		post.downvotes.push(user!.id);
		newValue = true;

		// Remove possible upvote
		post.upvotes = post.upvotes.filter(id => id !== user!.id);
	} else {
		// Remove downvote
		post.downvotes.filter(id => id !== user!.id);
		newValue = false;
	}

	res.json({
		status: 200,
		newValue,
	});
});

idRouter.use((req, res, next) => {
	if (req.post.author !== req.user!._id) {
		return res.status(403).json({
			status: 403,
			message: 'Unauthorized request',
		});
	}

	next();
});

idRouter.delete('/', async (req, res) => {
	await req.post.delete();
	res.json({
		status: 200,
		message: 'Post deleted successfully',
	});
});

router.use('/:id', idRouter);

export default router;
