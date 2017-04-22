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
			cb => req.story.remove(cb),

			/* eslint-disable no-confusing-arrow */
			(story, cb) => story.isPublished
				? req._auth.removePublication(cb)
				: req._auth.removeDraft(cb),
			/* eslint-enable no-confusing-arrow */
		], (err) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ success: true });
		});
	},
];
