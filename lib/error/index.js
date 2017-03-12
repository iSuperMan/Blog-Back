import http from 'http';
import util from 'util';

const HttpError = function bar(status, message, ...rest) {
	Error.apply(this, [message, ...rest]);
	Error.captureStackTrace(this, HttpError);

	this.status = status;
	this.message = message || http.STATUS_CODES[status] || 'Error';
};

util.inherits(HttpError, Error);

HttpError.prototype.name = 'HttpError';

export default { HttpError };
