import { Router } from 'express';
import { title } from 'node:process';
import authenticate from '../../../middleware/authenticate';
import Post from '../../../models/post';
import escapeRegex from '../../../util/escape-regex';
import partialify from '../../../util/partialify';
import sortFunctions from '../../../util/post-sorters';
import validateEmail from '../../../util/validate-email';
import idRouter from './[id]';

const router = Router();

router.use('/:id', idRouter);

router.get('/', async (req, res) => {
	const search = req.query.search?.toString() || '';
	const sort = req.query.sort?.toString() || '';

	const sortFunc = sortFunctions[sort] || sortFunctions.hot;

	const posts = await Post.find({
		title: { $regex: new RegExp(`^${escapeRegex(search)}`, 'i') },
	});
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

export default router;
