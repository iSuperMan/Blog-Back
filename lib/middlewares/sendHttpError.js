export default (req, res, next) => {
	res.sendHttpError = (httpError) => {
		res.status(httpError.status);
		res.json({ error: httpError.message, status: httpError.status });
	};

	next();
};
