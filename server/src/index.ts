import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import jsonReplacer from './util/json-replacer';
import db from './util/db';
import authRouter from './routes/auth';
import passport from 'passport';

config();

const { MONGO_URI, PORT = 8080 } = process.env;
if (!MONGO_URI) throw new Error('MongoDB URI missing');

const app = express();

// Options
app.enable('trust proxy');
app.set('json replacer', jsonReplacer);

(async () => {
	await db(MONGO_URI);
	console.log('Mongo client connected');

	// Middleware
	app.use(cors());
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

	app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
})();
