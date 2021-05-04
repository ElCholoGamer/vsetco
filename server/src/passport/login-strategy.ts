import { Strategy as LocalStrategy } from 'passport-local';
import { compare } from 'bcrypt';
import User from '../models/user';

const loginStrategy = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
	},
	async (email, password, done) => {
		email = email.trim().toLowerCase();

		const user = await User.findOne({ email });
		if (!user) {
			return done(null, false, { message: 'User not found', status: 404 });
		}

		const match = await compare(password, user.password);
		if (!match) {
			return done(null, false, { message: 'Invalid password', status: 401 });
		}

		done(null, user);
	}
);

export default loginStrategy;
