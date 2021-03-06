import express from 'express';
import postAvailableEmail from './postAvailableEmail';
import postAvailableUsername from './postAvailableUsername';
import get from './get';
import put from './put';
import paramId from './paramId';
import paramUsername from './paramUsername';
import follow from './getFollow';
import unfollow from './getUnfollow';

const router = express.Router();

router.param('id', paramId);
router.param('username', paramUsername);

router.post('/available-email', postAvailableEmail);
router.post('/available-username', postAvailableUsername);

router.get('/by-username/:username', get);
router.get('/:id/follow', follow);
router.get('/:id/unfollow', unfollow);
router.get('/:id', get);

router.put('/:id', put);

export default router;
