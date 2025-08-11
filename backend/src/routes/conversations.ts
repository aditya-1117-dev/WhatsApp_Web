import { Router } from 'express';
import { getConversations, getMessagesByWaId, sendMessage } from '../controllers/conversations';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/conversations', protect, getConversations);
router.get('/conversations/:wa_id', protect, getMessagesByWaId);
router.post('/messages', protect, sendMessage);

export default router;