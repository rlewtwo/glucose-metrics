import dayjs from 'dayjs';
import { GlucoseLevel } from '../models';

export async function calculateMetrics(memberId: number, period: 'last7' | 'month') {
  const now = dayjs();

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

  const currentValues = await GlucoseLevel.findAll({
    where: {
      memberId,
      testedAt: {
        $between: [startCurrent.toDate(), endCurrent.toDate()],
      },
    },
  });

  const previousValues = await GlucoseLevel.findAll({
    where: {
      memberId,
      testedAt: {
        $between: [startPrev.toDate(), endPrev.toDate()],
      },
    },
  });

  const calc = (values: number[]) => {
    if (values.length === 0) return { avg: 0, above: 0, below: 0 };
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const above = (values.filter((v) => v > 180).length / values.length) * 100;
    const below = (values.filter((v) => v < 70).length / values.length) * 100;
    return { avg, above, below };
  };

  const currVals = currentValues.map((r) => r.value);
  const prevVals = previousValues.map((r) => r.value);

  const current = calc(currVals);
  const previous = calc(prevVals);

  return {
    averageGlucose: current.avg,
    timeAboveRange: current.above,
    timeBelowRange: current.below,
    deltas: {
      avgDelta: current.avg - previous.avg,
      aboveDelta: current.above - previous.above,
      belowDelta: current.below - previous.below,
    },
  };
}
