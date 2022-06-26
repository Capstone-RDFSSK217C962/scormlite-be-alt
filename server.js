const express = require('express');
const cors = require('cors');
const dbConfig = require('./app/config/db.config');

const app = express();

var corsOptions = {
	origin: ["http://scormlite-fe.herokuapp.com", "https://scormlite-fe.herokuapp.com", "http://localhost:8080", ],
	optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require('./app/models');
const Role = db.role;

db.mongoose
	.connect(
		`mongodb+srv://scormlite:${dbConfig.PASSWORD}@cluster0.vyudx.mongodb.net/${dbConfig.DB_NAME}?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log('Successfully connect to MongoDB.');
		initial();
	})
	.catch((err) => {
		console.error('Connection error', err);
		process.exit();
	});

// simple route
app.get('/', (req, res) => {
	res.json({ message: 'scormlite API' });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/course.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});

function initial() {
	Role.estimatedDocumentCount((err, count) => {
		if (!err && count === 0) {
			new Role({
				name: 'user',
			}).save((err) => {
				if (err) {
					console.log('error', err);
				}

				console.log("added 'user' to roles collection");
			});

			new Role({
				name: 'instructor',
			}).save((err) => {
				if (err) {
					console.log('error', err);
				}

				console.log("added 'instructor' to roles collection");
			});

			new Role({
				name: 'admin',
			}).save((err) => {
				if (err) {
					console.log('error', err);
				}

				console.log("added 'admin' to roles collection");
			});
		}
	});
}
