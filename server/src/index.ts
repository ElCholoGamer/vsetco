import express from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';
import jsonReplacer from './util/json-replacer';
import db from './util/db';
import authRouter from './routes/auth';
import apiRouter from './routes/api';
import mainRouter from './routes/main';
import initPassport from './passport';

console.log(process.cwd());
config();

const { MONGO_URI, PORT = 8080 } = process.env;
if (!MONGO_URI) throw new Error('MongoDB URI missing');

const app = express();
initPassport();

// Options
app.enable('trust proxy');
app.set('json replacer', jsonReplacer);

(async () => {
	await db(MONGO_URI);
	console.log('Mongo client connected');

	// Middleware
	app.use(morgan('dev'));
	app.use(express.json());
	app.use(
		session({
			resave: false,
			saveUninitialized: false,
			secret: process.env.SESSION_SECRET || 'supersecretkey',
			name: 'sessionId',
			store: new MongoStore({ client: mongoose.connection.getClient() }),
			cookie: {
				httpOnly: true,
			},
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());

	// Routes
	app.use('/auth', authRouter);
	app.use('/api', apiRouter);
	if (process.env.NODE_ENV === 'development') app.use(mainRouter);
	app.use((req, res) =>
		res.status(404).json({ status: 404, message: 'Not found' })
	);

	app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
})();
