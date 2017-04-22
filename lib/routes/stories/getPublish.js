import parallel from 'async/parallel';
import waterfall from 'async/waterfall';
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
		waterfall([
			callback => parallel({
				/* eslint-disable no-confusing-arrow */
				user: cb => !req.story.isPublished ? req._auth.addNewPublication(cb) : cb(),
				/* eslint-enable no-confusing-arrow */

				story: cb => req.story.publish(cb),
			}, callback),

			({ story }, callback) => story.formatToClient(callback),
		], (err, story) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ story });
		});
	},
];
