import Story from '../../models/story';

export default [
	({ params }, res, next) => {
		Story.getPublicationsByAuthorId(params.userId, (err, stories) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({
				stories: stories.map(story => story.toObject({})),
			});
		});
	},
];
