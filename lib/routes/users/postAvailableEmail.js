import validate from 'express-validation';
import joi from 'joi';
import User from '../../models/user';

export default [
	validate({ body: { email: joi.string().required() } }),

	(req, res, next) => {
		const { email } = req.body;

		User.findOne({ email }, (err, user) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ result: !user });
		});
	},
];
