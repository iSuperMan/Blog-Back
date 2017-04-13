import User from '../../models/user';

export default (req, res, next, username) => {
	User.findByUsername(username, (err, user) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			return next(404);
		}

		req.user = user;
		return next();
	});
};
