import express from 'express';
import jwt from 'express-jwt';
import sendResponse from '../middlewares/sendResponse';
import sendHttpError from '../middlewares/sendHttpError';
import errorHandler from '../middlewares/errorHandler';
import auth from './auth';
import config from '../config';

const router = express.Router();

router.use(sendResponse);
router.use(sendHttpError);

router.use(jwt({
	secret: config.get('secretToken'),
	requestProperty: 'auth',
	credentialsRequired: false,
}));

router.use('/auth', auth);
router.use((req, res, next) => next(404)); // Not Found response

router.use(errorHandler);

export default router;
