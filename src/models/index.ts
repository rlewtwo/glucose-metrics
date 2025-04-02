import { Sequelize } from 'sequelize';
import { MemberFactory, Member as MemberModel } from './member';
import { GlucoseLevelFactory, GlucoseLevel as GlucoseLevelModel } from './glucoseLevel';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'glucose.sqlite',
});

const Member = MemberFactory(sequelize);
const GlucoseLevel = GlucoseLevelFactory(sequelize);

Member.hasMany(GlucoseLevel, {
  foreignKey: 'memberId',
  as: 'glucoseLevels',
});

GlucoseLevel.belongsTo(Member, {
  foreignKey: 'memberId',
  as: 'member',
});

// ✅ Export models and their types
export {
  sequelize,
  Member,
  GlucoseLevel,
  MemberModel,
  GlucoseLevelModel,
};