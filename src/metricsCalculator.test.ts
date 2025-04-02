import { calculateMetrics, MetricResult } from './services/metricsCalculator';
import { GlucoseLevel } from './models';

jest.mock('./models', () => ({
  GlucoseLevel: {
    findAll: jest.fn(),
  },
}));

describe('calculateMetrics', () => {
  const mockData = (values: number[]) =>
    values.map((v) => ({ value: v }));

  beforeEach(() => {
    (GlucoseLevel.findAll as jest.Mock).mockReset();
  });

  it('calculates averages and ranges correctly', async () => {
    const mockCurrent = mockData([100, 200, 190, 60, 50]);
    const mockPrevious = mockData([120, 180, 170]);

    (GlucoseLevel.findAll as jest.Mock)
      .mockResolvedValueOnce(mockCurrent)   // current
      .mockResolvedValueOnce(mockPrevious); // previous

    const result = await calculateMetrics(1, 'last7');

    expect(result.averageGlucose).toBeCloseTo(120);
    expect(result.timeAboveRange).toBeCloseTo(40); // 2 out of 5
    expect(result.timeBelowRange).toBeCloseTo(40); // 2 out of 5
    expect(result.deltas.avgDelta).toBeCloseTo(120 - 156.67, 1);
  });
});
