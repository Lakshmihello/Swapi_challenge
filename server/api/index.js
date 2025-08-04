import { Router } from 'express';
import starWarsRoutes from './starWars.js';

const router = Router();

router.use('/starWars', starWarsRoutes);
router.get('/*', render404);

export default router;

function render404(req, res) {
  res.status(404).json({ error: 'not found' });
}