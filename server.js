const express = require('express');
const cors = require('cors');
const dbConfig = require('./app/config/db.config');
let multer = require('multer');
var PATH = 'files/';
let path = require('path');
var crypto = require('crypto');
let fs = require('fs');

const app = express();

var corsOptions = {
	origin: ["http://scormlite-fe.herokuapp.com", "https://scormlite-fe.herokuapp.com", "http://localhost:8080", ],
	optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.static('files'));

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

// file handler
let storage = multer.diskStorage({
	destination: function (req, data, func) {
		func(null, PATH);
	},
	filename: function (req, file, cb) {
		crypto.randomBytes(16, function (err, raw) {
			if (err) {
				return cb(err);
			}

			cb(null, raw.toString('hex') + path.extname(file.originalname));
		});
	},
});

let upload = multer({ storage: storage });

app.post('/api/delete', function (req, res, next) {
	let fileId = req.body.id;
	try {
		fs.unlink(PATH + fileId, function (err) {
			if (err) {
				res.status(404).end();
				return console.log(err);
			}
			res.status(200).end();
		});
	} catch (e) {
		res.status(404).end();
	}
});

app.post('/api/upload', upload.single('file'), function (req, res, next) {
	let name = req.file.originalname || req.file.filename;
	let url = req.protocol + '://' + req.headers.host + '/' + req.file.filename;
	let mimetype =
		req.file.mimetype && req.file.mimetype !== ''
			? req.file.mimetype
			: path.extname(req.file.originalname);
	if (req.file && req.file.filename) {
		res.send(JSON.stringify({ name, url, mimetype }));
	}
	res.status(500);
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
