import { Router } from 'express';
import authenticate from '../../../middleware/authenticate';
import Post from '../../../models/post';
import partialify from '../../../util/partialify';
import sortFunctions from '../../../util/post-sorters';
import validateEmail from '../../../util/validate-email';
import idRouter from './[id]';

const router = Router();

router.get('/', async (req, res) => {
	const sort = req.query.sort?.toString() || '';
	const sortFunc = sortFunctions[sort] || sortFunctions.hot;

	const posts = await Post.find();
	posts.sort(sortFunc);

	res.json(partialify(posts));
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

router.use('/:id', idRouter);

export default router;
