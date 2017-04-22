import express from 'express';
import paramId from './paramId';
import post from './post';
import put from './put';
import get from './get';
import getPublish from './getPublish';
import deleteStory from './delete';
import getByUser from './getByUser';
import getDraftsByUser from './getDraftsByUser';

const router = express.Router();

router.param('id', paramId);
router.get('/:id/publish', getPublish);
router.get('/:id', get);
router.get('/by-user/:userId/drafts', getDraftsByUser);
router.get('/by-user/:userId', getByUser);
router.put('/:id', put);
router.post('/', post);
router.delete('/:id', deleteStory);

export default router;
