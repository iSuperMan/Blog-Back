export default (req, res, next) => {
	res.sendResponse = data => res.json({ response: data });
	next();
};
