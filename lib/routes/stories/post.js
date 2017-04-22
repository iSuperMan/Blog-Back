import validate from 'express-validation';
import joi from 'joi';
import joiObjectId from 'joi-objectid';
import parallel from 'async/parallel';
import waterfall from 'async/waterfall';
import bodyClean from '../../middlewares/bodyClean';
import Story from '../../models/story';
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

	(req, res, next) => {
		waterfall([
			callback => Story.createInstance({ ...req.body, author: req._auth }, callback),

			(story, callback) => parallel({
				user: cb => req._auth.addNewDraft(cb),
				story: cb => story.formatToClient(cb),
			}, callback),
		], (err, { story }) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ story });
		});
	},
];
