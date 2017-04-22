import waterfall from 'async/waterfall';
import map from 'async/map';
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
		waterfall([
			cb => Story.getDraftsByAuthorId(params.userId, cb),

			(stories, cb) => map(
				stories,
				(story, callback) => story.formatToClient(callback),
				cb,
			),
		], (err, stories) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ stories });
		});
	},
];
