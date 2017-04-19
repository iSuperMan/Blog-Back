import validate from 'express-validation';
import joi from 'joi';
import bodyClean from '../../middlewares/bodyClean';
import Story from '../../models/story';
import authControl from '../../middlewares/authControl';

const validationSchema = {
	name: joi.string(),
	text: joi.string(),
};

export default [
	authControl,
	validate({ body: validationSchema }),
	bodyClean(Object.keys(validationSchema)),

	(req, res, next) => {
		Story.createInstance({ ...req.body, author: req._auth }, (err, story) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ story: story.toObject({}) });
		});
	},
];
