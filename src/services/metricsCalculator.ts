import dayjs from 'dayjs';
import { GlucoseLevel } from '../models';
import NodeCache from 'node-cache';
import { Op } from 'sequelize';

const cache = new NodeCache({ stdTTL: 300 }); // cache for 5 minutes

export interface MetricResult {
  averageGlucose: number;
  timeAboveRange: number;
  timeBelowRange: number;
  deltas: {
    avgDelta: number;
    aboveDelta: number;
    belowDelta: number;
  };
}

export async function calculateMetrics(memberId: number, period: 'last7' | 'month'): Promise<MetricResult> {
  const key = `${memberId}-${period}`;
  const cached = cache.get<MetricResult>(key);
  if (cached) return cached;

  // Get the latest testedAt date from the database
  const latest = await GlucoseLevel.findOne({
    where: { memberId },
    order: [['testedAt', 'DESC']],
  });

  const now = latest ? dayjs(latest.testedAt) : dayjs(); // fallback to now if no data

  const ranges = {
    last7: {
      current: [now.subtract(6, 'day').startOf('day'), now.endOf('day')],
      previous: [now.subtract(13, 'day').startOf('day'), now.subtract(7, 'day').endOf('day')],
    },
    month: {
      current: [now.startOf('month'), now.endOf('month')],
      previous: [now.subtract(1, 'month').startOf('month'), now.subtract(1, 'month').endOf('month')],
    },
  };

  const [startCurrent, endCurrent] = ranges[period].current;
  const [startPrev, endPrev] = ranges[period].previous;

  const [currentValues, previousValues] = await Promise.all([
    GlucoseLevel.findAll({
      where: {
        memberId,
        testedAt: {
          [Op.between]: [startCurrent.toDate(), endCurrent.toDate()],
        },
      },
    }),
    GlucoseLevel.findAll({
      where: {
        memberId,
        testedAt: {
          [Op.between]: [startPrev.toDate(), endPrev.toDate()],
        },
      },
    }),
  ]);

  const calc = (values: number[]) => {
    if (values.length === 0) return { avg: 0, above: 0, below: 0 };
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const above = (values.filter((v) => v > 180).length / values.length) * 100;
    const below = (values.filter((v) => v < 70).length / values.length) * 100;
    return { avg, above, below };
  };

  const current = calc(currentValues.map(r => r.value));
  const previous = calc(previousValues.map(r => r.value));

  const result: MetricResult = {
    averageGlucose: parseFloat(current.avg.toFixed(2)),
    timeAboveRange: parseFloat(current.above.toFixed(2)),
    timeBelowRange: parseFloat(current.below.toFixed(2)),
    deltas: {
      avgDelta: parseFloat((current.avg - previous.avg).toFixed(2)),
      aboveDelta: parseFloat((current.above - previous.above).toFixed(2)),
      belowDelta: parseFloat((current.below - previous.below).toFixed(2)),
    },
  };

  cache.set(key, result);
  return result;
}
