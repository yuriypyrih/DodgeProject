import express from 'express';
import * as gameController from '../controllers/gameController';
import * as authController from '../controllers/authController';

const router = express.Router();

// Protect all routes from this point on
router.use(authController.protect);
router.post('/unlockLevel', gameController.unlockLevel);
router.post('/beatLevel', gameController.beatLevel);
router.post('/unlockAugment', gameController.unlockAugment);
router.post('/selectAugment', gameController.selectAugment);
router.get('/leaderboards', gameController.getLeaderBoards);

export default router;
