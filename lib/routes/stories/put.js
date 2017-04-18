import validate from 'express-validation';
import joi from 'joi';
import bodyClean from '../../middlewares/bodyClean';
import Story from '../../models/story';
import authControl from '../../middlewares/authControl';

const validationSchema = {
	name: joi.string().required(),
	text: joi.string().required(),
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
		Story.updateInstance(req.story, req.body, (err, story) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ story: story.toObject({}) });
		});
	},
];
