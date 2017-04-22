import authControl from '../../middlewares/authControl';

export default [
	authControl,

	({ story, _auth }, res, next) => {
		if (!story.checkAuthor(_auth)) {
			return next(403);
		}

		return next();
	},

	(req, res, next) => {
		req.story.publish((err, story) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ story: story.toObject({}) });
		});
	},
];
