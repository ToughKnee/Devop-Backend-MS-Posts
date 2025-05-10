import { Router, RequestHandler } from 'express';
import { getUserPostsController } from '../controllers/userPosts.controller';
import { authenticateJWT } from '../../middleware/authenticate.middleware';

const router = Router();

router.get('/posts/reported', authenticateJWT, getUserPostsController as RequestHandler);

export default router;