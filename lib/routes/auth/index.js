import express from 'express';
import postSignup from './postSignup';
import postLogin from './postLogin';
import getMe from './getMe';

const router = express.Router();

router.post('/signup', postSignup);
router.post('/login', postLogin);
router.get('/me', getMe);

export default router;
