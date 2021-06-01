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

const TEMP_IMAGES = 'temp/posts/';

const upload = multer({ dest: TEMP_IMAGES });

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

router.get('/@image/:id', (req, res) => {
	const url = req.app.images.getPostImage(req.params.id);
	res.redirect(url);
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

		const imageIds: string[] = [];
		const fileList = Array.isArray(files) ? files : Object.values(files)[0];

		for (const file of fileList) {
			if (file.size > 10 ** 7) {
				return res.status(400).json({
					status: 400,
					message: 'Una de las imágenes pesa más de 10MB',
				});
			}

			const url = await req.app.images.uploadPostImage(file.path);
			await unlink(file.path);

			imageIds.push(url);
		}

		const post = new Post({
			title,
			author: req.user!._id,
			description,
			images: imageIds,
			contacts,
		});
		await post.save();

		res.json(post);
	}
);

router.use('/:id', idRouter);

export default router;
