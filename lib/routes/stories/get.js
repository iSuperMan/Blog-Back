
export default [
	({ story }, res, next) => story.formatToClient((err) => {
		if (err) {
			return next(err);
		}

		return res.sendResponse({ story });
	}),
];
