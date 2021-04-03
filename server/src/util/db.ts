import mongoose from 'mongoose';

function db(uri: string) {
	return mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	});
}

export default db;
