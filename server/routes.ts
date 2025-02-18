
import { Router } from 'express';
import controller from './controllers';
import upload from './multerconfig';
import authMiddleware from './authMiddleware';

const router = Router();

router.get('/test-db', controller.testDbConnectionController);
router.get('/test-server-up', controller.testServerUpController);
router.post('/signup', controller.signupController);
router.post('/login', controller.loginController);
router.post('/user-token-verify', controller.userTokenVerifyController);
router.post("/create-event", authMiddleware, upload.array("images", 10), controller.createEventController);
router.get('/events', controller.getPaginatedEvents);
router.get('/event/:eventID', controller.getEventDetails);
router.get('/rsvp-status', authMiddleware, controller.getUserRSVPStatus)
router.post('/rsvp-status', authMiddleware, controller.postUserRSVPStatus)
router.post('/event-comment', authMiddleware, controller.postComment)
router.delete('/delete-comment', authMiddleware, controller.deleteComment)
router.put('/update-comment', authMiddleware, controller.updateComment)
router.get('/user', authMiddleware, controller.getUserEvents)
router.get('/user/my', authMiddleware, controller.getMyEvents)
router.get('/user/interested', authMiddleware, controller.getInterestedEvents)
router.get('/user/attending', authMiddleware, controller.getAttendingEvents)
export default router;  
