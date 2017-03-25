import validate from 'express-validation';
import joi from 'joi';
import bodyClean from '../../middlewares/bodyClean';
import User from '../../models/user';
import generateJWT from '../../helpers/generateJWT';

/* eslint-disable newline-per-chained-call */
const validationSchema = {
	email: joi.string().email().required(),
	username: joi.string().alphanum().min(5).max(30).required(),
	fullName: joi.string().required(),
	password: joi.string().min(5).max(20).required(),
};
/* eslint-enable newline-per-chained-call */

export default [
	validate({ body: validationSchema }),
	bodyClean(Object.keys(validationSchema)),

	(req, res, next) => {
		User.create(req.body, (err, user) => {
			if (err) {
				return next(err);
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
