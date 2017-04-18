import express from 'express';
import paramId from './paramId';
import post from './post';
import put from './put';
import get from './get';

const router = express.Router();

router.param('id', paramId);
router.get('/:id', get);
router.put('/:id', put);
router.post('/', post);

export default router;
