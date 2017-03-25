import User from '../../models/user';
import generateJWT from '../../helpers/generateJWT';

export default [
	(req, res, next) => {
		const { email, password } = req.body;

		User.findOne({ email }, (err, user) => {
			if (err) {
				return next(err);
			}

			if (!user || !user.checkPassword(password)) {
				return res.sendResponse({ success: false });
			}

			return generateJWT(user, (err, token) => {
				if (err) {
					return next(err);
				}

				return res.sendResponse({
					user: user.toObject(),
					token,
				});
			});
		});
	},
];
