import waterfall from 'async/waterfall';
import parallel from 'async/parallel';
import authControl from '../../middlewares/authControl';

export default [
	authControl,

	({ _auth, user }, res, next) => {
		waterfall([
			cb => _auth.unfollowTo(user, cb),

			cb => parallel([
				cd1 => _auth.formatToClient(cd1),
				cd1 => user.formatToClient(cd1),
			], cb),
		], (err, users) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ users });
		});
	},
];
