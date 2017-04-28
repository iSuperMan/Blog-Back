
export default [
	({ story }, res, next) => {
		if (!story.isPublished) {
			return next(404);
		}

		return story.formatToClient((err) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ story });
		});
	},
];
