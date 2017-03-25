import User from '../models/user';

export default (req, res, next) => {
	if (!req.auth) {
		return next(401);
	}

	return User.findById(req.auth._id, (err, user) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			return next(401);
		}

		req._auth = user;
		return next();
	});
};
