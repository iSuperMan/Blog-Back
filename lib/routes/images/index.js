import express from 'express';
import post from './post';

const router = express.Router();

router.post('/', post);

export default router;
