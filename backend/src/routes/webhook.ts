import { Router } from 'express';
import { processWebhook } from '../controllers/webhook';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/webhook', protect, processWebhook);

export default router;