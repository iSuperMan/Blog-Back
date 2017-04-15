import authControl from '../../middlewares/authControl';

export default [
	authControl,
	(req, res) => req._auth.formatToClient(
		(err, user) => res.sendResponse({ user }),
	),
];
