import express from 'express';
import { calculateMetrics } from '../services/metricsCalculator';

const router = express.Router();

router.get('/:memberId', async (req, res) => {
  const memberId = parseInt(req.params.memberId);
  const last7 = await calculateMetrics(memberId, 'last7');
  const month = await calculateMetrics(memberId, 'month');

  res.json({ last7Days: last7, currentMonth: month });
});

export default router;
