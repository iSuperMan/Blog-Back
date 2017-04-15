import validate from 'express-validation';
import joi from 'joi';
import joiObjectId from 'joi-objectid';
import async from 'async';
import bodyClean from '../../middlewares/bodyClean';
import authControl from '../../middlewares/authControl';
import User from '../../models/user';

joi.objectId = joiObjectId(joi);

/* eslint-disable newline-per-chained-call */
const validationSchema = {
	email: joi.string().email(),
	username: joi.string().alphanum().min(5).max(30),
	fullName: joi.string(),
	avatar: joi.objectId(),
	bio: joi.string(),
};
/* eslint-enable newline-per-chained-call */

export default [
	authControl,
	validate({ body: validationSchema }),
	bodyClean(Object.keys(validationSchema)),

	(req, res, next) => {
		if (req.user._id.toString() !== req._auth._id.toString()) {
			return next(403);
		}

		return next();
	},

	(req, res, next) => {
		async.waterfall([
			cb => User.updateInstance(req.user, req.body, cb),
			(user, cb) => user.formatToClient(cb),
		], (err, formattingUser) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ user: formattingUser });
		});
	},
];
