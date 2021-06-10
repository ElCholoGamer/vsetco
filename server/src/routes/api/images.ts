import { Router } from 'express';

const router = Router();

router.get('/posts/:postId/:imageId', (req, res) => {
	const { postId, imageId } = req.params;
	const url = req.app.images.getPostImage(postId, imageId);
	res.redirect(url);
});

router.get('/user/:id', (req, res) => {
	res.redirect(`/api/users/${req.params.id}/picture`);
});

export default router;
