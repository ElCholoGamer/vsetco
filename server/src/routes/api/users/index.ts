import { Router } from 'express';
import authenticate from '../../../middleware/authenticate';
import Post from '../../../models/post';
import User, { IUser } from '../../../models/user';
import sortFunctions from '../../../util/post-sorters';
import idRouter from './[id]';

const router = Router();

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

router.use('/@me', authenticate());

router.use('/:id', idRouter);

export default router;
