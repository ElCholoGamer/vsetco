import { Router, Request, Response } from 'express';
import { IVerifyOptions } from 'passport-local';
import passport from 'passport';
import { IUser } from '../models/user';

const router = Router();

const authCallback = (req: Request, res: Response) => (
	err: any,
	user: IUser,
	info: IVerifyOptions | undefined
) => {
	if (err) {
		console.error(err);
		return res.status(500).json({ status: 500, error: err });
	}

	if (!user) {
		return res.status(401).json({
			status: info?.status || 401,
			message: info?.message || '[No message provided]',
		});
	}

	req.login(user, err => {
		if (err) {
			console.error(err);
			res.status(500).json({ status: 500, error: err });
		} else {
			res.json(user);
		}
	});
};

router.post('/register', (req, res, next) => {
	passport.authenticate('local-register', authCallback(req, res))(
		req,
		res,
		next
	);
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local-login', authCallback(req, res))(req, res, next);
});

// Log out user session
router.post('/logout', (req, res) => {
	req.logout();

	res.json({
		status: 200,
		message: 'Logged out.',
	});
});

export default router;
