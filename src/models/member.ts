import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface MemberAttributes {
  id?: number;
  name?: string;
}

export type MemberCreationAttributes = Optional<MemberAttributes, 'id'>;

export class Member extends Model<MemberAttributes, MemberCreationAttributes>
  implements MemberAttributes {
  public id!: number;
  public name!: string;
}

export const MemberFactory = (sequelize: Sequelize) => {
  Member.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Member',
  });

  return Member;
};
