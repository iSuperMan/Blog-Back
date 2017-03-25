import errorhandler from 'errorhandler';
import ev from 'express-validation';
import mongoose from 'mongoose';
import { HttpError } from '../error';

module.exports = (err, req, res, next) => {
	let error = err;

	if (typeof error === 'number') {
		error = new HttpError(error);
	}

	if (error instanceof HttpError) {
		res.sendHttpError(error);
	} else if (error instanceof mongoose.Error.ValidationError) {
		res.sendHttpError(new HttpError(400));
	} else if (error instanceof ev.ValidationError) {
		res.sendHttpError(new HttpError(400));
	} else if (error.name === 'UnauthorizedError') {
		res.sendHttpError(new HttpError(401));
	} else if (process.env.NODE_ENV === 'development') {
		errorhandler()(error, req, res, next);
	} else {
		res.sendHttpError(new HttpError(500));
	}
};
