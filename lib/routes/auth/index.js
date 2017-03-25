import express from 'express';
import postSignup from './postSignup';
import postLogin from './postLogin';

const router = express.Router();

router.post('/signup', postSignup);
router.post('/login', postLogin);

export default router;
