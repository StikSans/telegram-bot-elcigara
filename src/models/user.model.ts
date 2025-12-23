import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index";

export class User extends Model {
  declare id: number;
  declare telegramId: number;
  declare username?: string;
  declare name: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    telegramId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  },
);
