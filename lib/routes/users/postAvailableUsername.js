import validate from 'express-validation';
import joi from 'joi';
import User from '../../models/user';

export default [
	validate({ body: { username: joi.string().required() } }),

	(req, res, next) => {
		const { username } = req.body;

		User.findOne({ username }, (err, user) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ result: !user });
		});
	},
];
