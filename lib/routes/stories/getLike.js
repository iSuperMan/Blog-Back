import waterfall from 'async/waterfall';
import authControl from '../../middlewares/authControl';

export default [
	authControl,

	(req, res, next) => {
		waterfall([
			cb => req.story.likeBy(req._auth, cb),
			cb => req.story.formatToClient(cb),
		], (err, story) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ story });
		});
	},
];
