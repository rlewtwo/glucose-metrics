import request from 'supertest';
import express from 'express';
import { sequelize } from '../models';
import metricsRouter from './metrics';
import { Member, MemberModel } from '../models';

const app = express();
app.use(express.json());
app.use('/api/metrics', metricsRouter);

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Optionally seed the database with a known member + values here
  const [member] = await Member.findOrCreate({ where: { name: 'Test' } });
  const typedMember = member as InstanceType<typeof MemberModel>;
  await sequelize.models.GlucoseLevel.bulkCreate([
    {
      memberId: member.id,
      value: 100,
      testedAt: new Date(),
      tzOffset: '-04:00',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      memberId: member.id,
      value: 190,
      testedAt: new Date(),
      tzOffset: '-04:00',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      memberId: member.id,
      value: 65,
      testedAt: new Date(),
      tzOffset: '-04:00',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/metrics/:memberId', () => {
  it('returns glucose metrics for valid member', async () => {
    const res = await request(app).get('/api/metrics/1');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('last7Days');
    expect(res.body.last7Days).toHaveProperty('averageGlucose');
    expect(res.body.last7Days).toHaveProperty('timeAboveRange');
    expect(res.body.last7Days).toHaveProperty('timeBelowRange');
    expect(res.body.last7Days).toHaveProperty('deltas');
  });

  it('returns 500 for invalid member ID', async () => {
    const res = await request(app).get('/api/metrics/abc');
    expect(res.status).toBe(500);
  });
});
