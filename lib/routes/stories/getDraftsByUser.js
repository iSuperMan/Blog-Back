import Story from '../../models/story';
import authControl from '../../middlewares/authControl';

export default [
	authControl,

	({ _auth, params }, res, next) => {
		if (_auth._id.toString() !== params.userId.toString()) {
			return next(403);
		}

		return next();
	},

	({ params }, res, next) => {
		Story.getDraftsByAuthorId(params.userId, (err, stories) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({
				stories: stories.map(story => story.toObject({})),
			});
		});
	},
];
