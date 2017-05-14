import validate from 'express-validation';
import joi from 'joi';
import waterfall from 'async/waterfall';
import bodyClean from '../../middlewares/bodyClean';
import authControl from '../../middlewares/authControl';

const validationSchema = {
	body: joi.string().required(),
};

export default [
	authControl,
	validate({ body: validationSchema }),
	bodyClean(Object.keys(validationSchema)),

	(req, res, next) => {
		waterfall([
			cb => req.story.pushCommentary({ ...req.body, author: req._auth }, cb),
			(story, stuff, cb) => story.formatToClient(cb),
		], (err, story) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ story });
		});
	},
];
