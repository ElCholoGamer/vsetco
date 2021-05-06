import { Router } from 'express';
import postsRouter from './posts';
import usersRouter from './users';

const router = Router();

router.get('/', (req, res) => {
	res.json({ hello: 'world' });
});

router.use('/posts', postsRouter);
router.use('/users', usersRouter);

export default router;
