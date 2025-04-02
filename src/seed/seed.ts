import fs from 'fs';
import csv from 'csv-parser';
import { sequelize, Member, GlucoseLevel } from '../models';

const seed = async () => {
  await sequelize.sync({ force: true });

  const results: any[] = [];
  fs.createReadStream('data/glucose.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const row of results) {
        await Member.findOrCreate({ where: { id: row.member_id } });
        await GlucoseLevel.create({
          memberId: parseInt(row.member_id),
          value: parseInt(row.value),
          testedAt: new Date(row.tested_at),
          tzOffset: row.tz_offset,
        });
      }
      console.log('Seeding complete');
      process.exit();
    });
};

seed();
