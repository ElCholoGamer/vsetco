import { Router } from 'express';
import authenticate from '../../middleware/authenticate';
import Post from '../../models/post';
import User, { IUser } from '../../models/user';
import sortFunctions from '../../util/post-sorters';

const router = Router();

router.get('/@me', authenticate(), (req, res) => res.json(req.user));

router.get('/@popular', async (req, res) => {
	const posts = await Post.find();
	posts.sort(sortFunctions.hot);

	const users: IUser[] = [];

	for (const post of posts) {
		if (users.length >= 10) break;

		if (post.getVotes() > 10 && !users.some(user => user._id === post.author)) {
			const userAuthor = await User.findById(post.author);
			if (userAuthor) users.push(userAuthor);
		}
	}

	res.json(users);
});

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
