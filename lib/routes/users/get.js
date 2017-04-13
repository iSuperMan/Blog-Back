
export default [
	({ user }, res, next) => {
		user.formatToClient((err, formattingUser) => {
			if (err) {
				return next(err);
			}

			return res.sendResponse({ user: formattingUser });
		});
	},
];
