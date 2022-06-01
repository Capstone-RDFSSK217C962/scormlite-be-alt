const db = require('../models');
const Course = db.courses;

exports.create = (req, res) => {
	if (!req.body.title) {
		res.status(400).send({ message: 'title cannot be empty' });
		return;
	}

	const course = new Course({
		author: req.userId,
		title: req.body.title,
		desc: req.body.desc,
		duration: req.body.duration,
		code: req.body.code,
		package_url: req.body.package_url,
		published: req.body.published ? req.body.published : false,
	});

	course
		.save(course)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'error creating course',
			});
		});
};

exports.findByTitle = (req, res) => {
	const title = req.query.title;
	const user = req.userId;

	var condition = title
		? { title: { $regex: new RegExp(title), $options: 'i' }, author: user }
		: { author: user };

	Course.find(condition)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'error retrieving courses',
			});
		});
};

exports.findAll = (req, res) => {
	const user = req.userId;

	Course.find({ author: user })
		.then((data) => {

			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'error retrieving courses',
			});
		});
};

exports.findOne = (req, res) => {
	const id = req.params.id;

	Course.findById(id)
		.then((data) => {
			if (!data || data.author !== req.userId)
				res.status(404).send({ message: `course with id ${id} not found` });
			else res.send(data);
		})
		.catch((err) => {
			res
				.status(500)
				.send({ message: `error retrieving course with id ${id}` });
		});
};

exports.update = (req, res) => {
	if (!req.body) {
		return res.status(400).send({
			message: 'data to update cannot be empty',
		});
	}

	const id = req.params.id;

	Course.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `cannot update course with id ${id}, maybe course is not found`,
				});
			} else res.send({ message: 'course successfully updated' });
		})
		.catch((err) => {
			res.status(500).send({
				message: `error updating course with id ${id}`,
			});
		});
};

exports.delete = (req, res) => {
	const id = req.params.id;

	Course.findByIdAndRemove(id, { useFindAndModify: false })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `cannot delete course with id ${id}, maybe course is not found`,
				});
			} else {
				res.send({
					message: 'course successfully deleted',
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: `cannot delete course with ${id}`,
			});
		});
};

exports.deleteAll = (req, res) => {
	const user = req.userId;

	Course.deleteMany({ author: user })
		.then((data) => {
			res.send({
				message: `${data.deletedCount} course(s) successfully deleted`,
			});
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'error deleting all courses',
			});
		});
};

exports.findAllPublished = (req, res) => {
	const user = req.userId;

	Course.find({ published: true, author: user })
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'error retrieving published courses',
			});
		});
};
