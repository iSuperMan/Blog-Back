import _ from 'lodash';

export default cleanProps => (req, res, next) => {
	req.body = _.pick(req.body, cleanProps);
	next();
};
