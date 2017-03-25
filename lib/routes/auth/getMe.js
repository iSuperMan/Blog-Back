import authControl from '../../middlewares/authControl';

export default [
	authControl,
	(req, res) => res.sendResponse({ user: req._auth.toObject() }),
];
