import express from 'express';
import { sequelize } from './models';
import metricsRouter from './routes/metrics';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/metrics', metricsRouter);

app.listen(PORT, async () => {
  await sequelize.authenticate();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
