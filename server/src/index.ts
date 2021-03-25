import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello, world!');
});

app.get('/random', (req, res) => {
	const randomNumber = Math.floor(Math.random() * 100);
	res.json({ number: randomNumber });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
