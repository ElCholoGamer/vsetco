import { hash } from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import * as countryCodes from 'country-codes-list';
import User from '../models/user';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;

const validCountries = countryCodes.all().map(data => data.countryCode);

const registerStrategy = new LocalStrategy(
	{
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true,
	},
	async (req, username, password, done) => {
		let { email, country } = req.body;

		username = username.trim();
		email = email.toLowerCase().trim();

		// Validate country
		if (!validCountries.includes(country)) {
			return done(null, false, {
				message: 'El país es inválido',
				status: 400,
			});
		}

		// Validate email
		if (!EMAIL_REGEX.test(email)) {
			return done(null, false, {
				message: 'El correo electrónico es inválido',
				status: 400,
			});
		}

		// Check if user with email already exists
		let existing = await User.findOne({ email });
		if (existing) {
			return done(null, false, {
				message: 'El correo electrónico ya está en uso',
				status: 400,
			});
		}

		// Check if username already exists
		existing = await User.findOne({ username });
		if (existing) {
			return done(null, false, {
				message: 'El nombre de usuario ya está en uso',
				status: 400,
			});
		}

		// Validate username
		if (username.length > 20) {
			return done(null, false, {
				message: 'El nombre de usuario es demasiado largo',
				status: 400,
			});
		}

		// Validate password
		if (password.length < 4) {
			return done(null, false, {
				message: 'La contraseña debe tener un mínimo de 4 caracteres',
				status: 400,
			});
		}

		// Create user document
		password = await hash(password, 10);
		const user = new User({
			country,
			email,
			username,
			password,
		});
		await user.save();

		done(null, user);
	}
);

export default registerStrategy;
