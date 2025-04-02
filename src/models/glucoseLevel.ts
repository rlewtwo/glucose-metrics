import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface GlucoseLevelAttributes {
  id?: number;
  memberId: number;
  value: number;
  testedAt: Date;
  tzOffset: string;
}

type GlucoseLevelCreationAttributes = Optional<GlucoseLevelAttributes, 'id'>;

export class GlucoseLevel extends Model<GlucoseLevelAttributes, GlucoseLevelCreationAttributes>
  implements GlucoseLevelAttributes {
  public id!: number;
  public memberId!: number;
  public value!: number;
  public testedAt!: Date;
  public tzOffset!: string;
}

export const GlucoseLevelFactory = (sequelize: Sequelize) => {
  GlucoseLevel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      testedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      tzOffset: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'GlucoseLevel',
      tableName: 'GlucoseLevels',
    }
  );

  return GlucoseLevel;
};


