import express from 'express';
import { join, resolve } from 'path';

const router = express.Router();

const buildPath = resolve(process.cwd(), '../client/build');

router.use(express.static(buildPath));

router.get('/*', (req, res, next) => {
	if (req.headers.accept?.includes('text/html')) {
		res.sendFile(join(buildPath, 'index.html'));
	} else {
		next();
	}
});

export default router;
