import { Router } from 'express';
import postsRouter from './posts';
import usersRouter from './users';
import imagesRouter from './images';

const router = Router();

router.get('/', (req, res) => {
	res.json({ hello: 'world' });
});

router.use('/posts', postsRouter);
router.use('/users', usersRouter);
router.use('/images', imagesRouter);

export default router;
