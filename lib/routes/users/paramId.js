import User from '../../models/user';

export default (req, res, next, id) => {
	User.findById(id, (err, user) => {
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
