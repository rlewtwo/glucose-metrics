// models/Member.ts
import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

// Define the attributes for the Member model
interface MemberAttributes {
  id: number;
  name: string;
}

// This type is used when creating a new member (id is optional)
export type MemberCreationAttributes = Optional<MemberAttributes, 'id'>;

export class Member extends Model<MemberAttributes, MemberCreationAttributes> implements MemberAttributes {
  // Declare the model's attributes
  public id!: number;
  public name!: string;
  // Timestamps (createdAt and updatedAt) are auto-managed by Sequelize
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Factory function to initialize the Member model
export const MemberFactory = (sequelize: Sequelize) => {
  Member.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Member',
    }
  );

  return Member;
};
