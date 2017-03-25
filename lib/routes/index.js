import express from 'express';
import sendResponse from '../middlewares/sendResponse';
import sendHttpError from '../middlewares/sendHttpError';
import errorHandler from '../middlewares/errorHandler';
import auth from './auth';

const router = express.Router();

router.use(sendResponse);
router.use(sendHttpError);

router.use('/auth', auth);
router.use((req, res, next) => next(404)); // Not Found response

router.use(errorHandler);

export default router;
