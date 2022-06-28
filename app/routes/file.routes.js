var crypto = require('crypto');
let multer = require('multer');
let path = require('path');

const files = require('../controllers/file.controller.js');
var PATH = 'files/';

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

module.exports = (app) => {
	var router = require('express').Router();

	router.post('/upload', upload.single('file'),  files.uploadFile);
	router.post('/delete', files.deleteFile);

	app.use('/api', router);
};
