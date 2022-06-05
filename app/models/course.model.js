module.exports = (mongoose) => {

	const TextSchema = mongoose.Schema({
		title: String,
		content: String,
	});

	const ReferenceSchema = mongoose.Schema({
		content: String,
	});
	  
	const VideoSchema = mongoose.Schema({
		title: String,
		url: String
	});
	  
	const QuizSchema = mongoose.Schema({
		title: String,
		question: String,
		answer_option: Array,
		answer: String,
		message: String,
	});

	const ComponentSchema = mongoose.Schema({
		type: String,
		text: TextSchema,
		reference: ReferenceSchema,
		video: VideoSchema,
		quiz: QuizSchema,
	});
	  
	const ModuleSchema = mongoose.Schema({
		title: String,
		component: ComponentSchema
	});

	var schema = mongoose.Schema(
		{
			author: String,
			title: String,
			desc: String,
			duration: String,
			code: String,
			package_url: String,
			published: Boolean,
			module: {}
		},
		{ timestamps: true }
	);

	schema.method('toJSON', function () {
		const { __v, _id, ...object } = this.toObject();
		object.id = _id;
		return object;
	});

	const Course = mongoose.model('course', schema);
	return Course;
};
