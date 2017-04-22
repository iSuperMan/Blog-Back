import validate from 'express-validation';
import joi from 'joi';
import joiObjectId from 'joi-objectid';
import waterfall from 'async/waterfall';
import bodyClean from '../../middlewares/bodyClean';
import authControl from '../../middlewares/authControl';

joi.objectId = joiObjectId(joi);

const validationSchema = {
	name: joi.string(),
	text: joi.string(),
	tags: joi.array().items(joi.string()),
	cover: joi.objectId(),
};

export default [
	authControl,
	validate({ body: validationSchema }),
	bodyClean(Object.keys(validationSchema)),

	({ story, _auth }, res, next) => {
		if (!story.checkAuthor(_auth)) {
			return next(403);
		}

		return next();
	},

	(req, res, next) => {
		waterfall([
			cb => req.story.edit(req.body, cb),
			(story, cb) => story.formatToClient(cb),
		], (err, story) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ story });
		});
	},
];
