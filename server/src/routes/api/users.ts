import { Router } from 'express';
import authenticate from '../../middleware/authenticate';
import User from '../../models/user';

const router = Router();

router.use(authenticate());

router.get('/@me', (req, res) => res.json(req.user));

router.get('/:id', async (req, res) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return res.status(404).json({
			status: 404,
			message: 'User not found',
		});
	}

	res.json(user);
});

export default router;
