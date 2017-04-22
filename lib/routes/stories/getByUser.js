import waterfall from 'async/waterfall';
import map from 'async/map';
import Story from '../../models/story';

export default [
	({ params }, res, next) => {
		waterfall([
			cb => Story.getPublicationsByAuthorId(params.userId, cb),

			(stories, cb) => map(
				stories,
				(story, callback) => story.formatToClient(callback),
				cb,
			),
		], (err, stories) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ stories });
		});
	},
];
