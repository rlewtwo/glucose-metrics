import express, { Router, Request, Response } from 'express';
import { calculateMetrics } from '../services/metricsCalculator';

const router = express.Router();

/**
 * @swagger
 * /api/metrics/{memberId}:
 *   get:
 *     summary: Get glucose metrics for a specific member
 *     parameters:
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the member
 *     responses:
 *       200:
 *         description: Metrics calculated
 *         content:
 *           application/json:
 *             example:
 *               last7Days:
 *                 averageGlucose: 112
 *                 timeAboveRange: 20
 *                 timeBelowRange: 10
 *                 deltas:
 *                   avgDelta: -4
 *                   aboveDelta: 5
 *                   belowDelta: -3
 *               currentMonth:
 *                 averageGlucose: 118
 *                 timeAboveRange: 30
 *                 timeBelowRange: 5
 *                 deltas:
 *                   avgDelta: 6
 *                   aboveDelta: 10
 *                   belowDelta: -5
 */

router.get('/:memberId', async (req, res) => {
  const memberId = parseInt(req.params.memberId);
  const last7 = await calculateMetrics(memberId, 'last7');
  const month = await calculateMetrics(memberId, 'month');

  res.json({ last7Days: last7, currentMonth: month });
});

export default router;
