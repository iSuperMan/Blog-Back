import express from 'express';
import postAvailableEmail from './postAvailableEmail';
import postAvailableUsername from './postAvailableUsername';

const router = express.Router();

router.post('/available-email', postAvailableEmail);
router.post('/available-username', postAvailableUsername);

export default router;
