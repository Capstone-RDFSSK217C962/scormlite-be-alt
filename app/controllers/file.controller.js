let fs = require('fs');
let path = require('path');

var PATH = 'files/';

exports.deleteFile = (req, res, next) => {
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


exports.uploadFile =  (req, res, next) => {
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