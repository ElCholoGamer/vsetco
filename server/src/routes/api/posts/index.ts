import { Router } from 'express';
import multer from 'multer';
import { unlink } from 'fs/promises';
import authenticate from '../../../middleware/authenticate';
import Post from '../../../models/post';
import escapeRegex from '../../../util/escape-regex';
import partialify from '../../../util/partialify';
import sortFunctions from '../../../util/post-sorters';
import validateEmail from '../../../util/validate-email';
import idRouter from './[id]';

const upload = multer({ dest: 'temp/posts/' });

const router = Router();

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

router.post(
	'/',
	authenticate(),
	upload.array('images', 10),
	async (req, res) => {
		const { title, description, contacts: rawContacts } = req.body;
		const { files } = req;

		let contacts;
		try {
			contacts = JSON.parse(rawContacts);
		} catch {
			res.status(400).json({
				status: 400,
				message: 'JSON de contactos inválido',
			});
		}

		if (contacts.email && !validateEmail(contacts.email)) {
			return res.status(400).json({
				status: 400,
				message: 'El correo electrónico es inválido',
			});
		}

		const fileList = Array.isArray(files) ? files : Object.values(files)[0];
		if (fileList.some(file => file.size > 10 ** 7)) {
			return res.status(400).json({
				status: 400,
				message: 'Una de las imágenes pesa más de 10MB',
			});
		}

		const post = new Post({
			title,
			author: req.user!._id,
			description,
			contacts,
		});
		await post.save();

		const imageIds: string[] = [];

		for (const file of fileList) {
			const url = await req.app.images.uploadPostImage(post._id, file.path);
			await unlink(file.path);

			imageIds.push(url);
		}

		post.images = imageIds;
		await post.save();

		res.json(post);
	}
);

router.use('/:id', idRouter);

export default router;
