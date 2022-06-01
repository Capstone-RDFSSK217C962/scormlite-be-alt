const { authJwt } = require('../middlewares');
const courses = require('../controllers/course.controller.js');

module.exports = (app) => {
	var router = require('express').Router();

	router.post('/', courses.create);
	router.get('/', courses.findAll);
	router.get('/title', courses.findByTitle);
	router.get('/published', courses.findAllPublished);
	router.get('/:id', courses.findOne);
	router.put('/:id', courses.update);
	router.delete('/:id', courses.delete);
	router.delete('/', courses.deleteAll);

	app.use('/api/courses', [authJwt.verifyToken], router);
};
