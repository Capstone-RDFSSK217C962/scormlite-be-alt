let fs = require('fs');
let path = require('path');

// local env
// var PATH = 'files/';
// prod env
var PATH = 'https://scormlite-be.herokuapp.com/files/';

// www.api.scormlite.tech/api/file/delete?file=0bc13abc582b0aef4d13007ef67b9876.png
// http://localhost:3000/api/file/delete?file=5c174cc30cd904cc51c03688b0c5f6d7.png

exports.delete = (req, res, next) => {
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
};


exports.upload =  (req, res, next) => {
	let name = req.file.originalname || req.file.filename;
	let url = req.protocol + 's://' + req.headers.host + '/' + req.file.filename;
	let mimetype =
		req.file.mimetype && req.file.mimetype !== ''
			? req.file.mimetype
			: path.extname(req.file.originalname);
	if (req.file && req.file.filename) {
		res.send(JSON.stringify({ name, url, mimetype }));
	}
	res.status(500);
}