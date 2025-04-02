import { Sequelize } from 'sequelize';
import { MemberFactory } from './member';
import { GlucoseLevelFactory } from './glucoseLevel';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'glucose.sqlite',
});

const Member = MemberFactory(sequelize);
const GlucoseLevel = GlucoseLevelFactory(sequelize);

// ✅ Explicit foreign key definition
Member.hasMany(GlucoseLevel, {
  foreignKey: 'memberId',
  as: 'glucoseLevels',
});

GlucoseLevel.belongsTo(Member, {
  foreignKey: 'memberId',
  as: 'member',
});

export { sequelize, Member, GlucoseLevel };
