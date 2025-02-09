import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class User extends Model {}

  User.init(
    {
      userID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Users',
      timestamps: false,
    }
  );

  return User;
};
