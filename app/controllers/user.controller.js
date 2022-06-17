const db = require('../models');
const User = db.user;

exports.allAccess = (req, res) => {
	res.status(200).send('Public Content.');
};

exports.userBoard = (req, res) => {
	res.status(200).send('User Content.');
};

exports.adminBoard = (req, res) => {
	res.status(200).send('Admin Content.');
};

exports.instructorBoard = (req, res) => {
	res.status(200).send('Instructor Content.');
};

exports.findAll = (req, res) => {
	User.find({})
		.then((data) => {
			res.status(200).send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'error retrieving users',
			});
		});
};
