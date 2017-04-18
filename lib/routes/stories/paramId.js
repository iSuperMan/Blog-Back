import Story from '../../models/story';

export default (req, res, next, id) => {
	Story.findById(id, (err, story) => {
		if (err) {
			return next(err);
		}

		if (!story) {
			return next(404);
		}

		req.story = story;
		return next();
	});
};
