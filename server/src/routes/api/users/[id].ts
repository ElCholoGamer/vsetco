import { Router } from 'express';
import multer from 'multer';
import { unlink } from 'fs/promises';
import User from '../../../models/user';

const upload = multer({ dest: 'temp/users/' });

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
	if (req.params.id === '@me') {
		return res.json(req.user);
	}

	const user = await User.findById(req.params.id);

	if (!user) {
		return res.status(404).json({
			status: 404,
			message: 'User not found',
		});
	}

	res.json(user);
});

router.get('/picture', (req, res) => {
	const { id } = req.params;
	const url = req.app.images.getProfilePicture(
		id === '@me' ? req.user!.id : id
	);

	res.proxyImage(url);
});

router.post('/picture', upload.single('image'), async (req, res) => {
	const { file, params, app, user } = req;

	if (params.id !== '@me') {
		return res.status(403).json({
			status: 403,
			message: 'Unauthorized',
		});
	}

	if (file.size > 10 ** 7) {
		return res.status(400).json({
			status: 400,
			message: 'La imagen debe tener un peso máximo de 10MB',
		});
	}

	await app.images.uploadProfilePicture(user!.id, file.path);
	await unlink(file.path);

	res.json({
		status: 200,
		message: 'Foto de perfil cambiada.',
	});
});

export default router;
