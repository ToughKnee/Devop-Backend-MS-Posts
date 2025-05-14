import { Router ,RequestHandler} from 'express';
import { authenticateJWT } from '../../middleware/authenticate.middleware';
import { deleteOwnPostController } from '../controllers/post.controller';

const router = Router();

// Delete own post route (protected by JWT)
router.delete('/user/posts/delete', authenticateJWT, deleteOwnPostController as RequestHandler);

export default router;
