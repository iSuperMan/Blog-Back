import User from '../../models/user';

export default [
	(req, res, next) => {
		const { email, password } = req.body;

		User.findOne({ email }, (err, user) => {
			if (err) {
				return next(err);
			}

			if (user && user.checkPassword(password)) {
				return res.sendResponse({ success: true, user });
			}

			return res.sendResponse({ success: false });
		});
	},
];
