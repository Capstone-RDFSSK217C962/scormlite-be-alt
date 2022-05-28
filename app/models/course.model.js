module.exports = (mongoose) => {
	var schema = mongoose.Schema(
		{
			author: String,
			title: String,
			desc: String,
			duration: String,
			code: String,
			package_url: String,
			published: Boolean,
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
