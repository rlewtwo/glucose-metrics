import fs from 'fs';
import csv from 'csv-parser';
import { sequelize, Member, GlucoseLevel } from '../models';
import path from 'path';
import dayjs from 'dayjs';

const seed = async () => {
  await sequelize.sync({ force: true });

  // Create one test member (you can create more if needed)
  const member = await Member.create({ name: 'Test Member' });

  const results: any[] = [];
  const csvPath = path.join(__dirname, '../../data/glucose.csv');

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const row of results) {
        const parsedDate = dayjs(row.tested_at, 'M/D/YY H:mm').toDate();
        const value = parseInt(row.value);
        const tzOffset = row.tzOffset?.replace(/["“”]/g, '') || '-00:00';

        if (!isNaN(value) && parsedDate) {
          await GlucoseLevel.create({
            memberId: member.id,
            value,
            testedAt: parsedDate,
            tzOffset,
          });
        }
      }
      console.log('✅ Seeding complete');
      process.exit();
    });
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
