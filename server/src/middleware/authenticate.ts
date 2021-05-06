import { RequestHandler } from 'express';

function authenticate(): RequestHandler {
	return (req, res, next) => {
		if (!req.isAuthenticated()) {
			return res.status(401).json({
				status: 401,
				message: 'Unauthenticated request',
			});
		}

		next();
	};
}

export default authenticate;
