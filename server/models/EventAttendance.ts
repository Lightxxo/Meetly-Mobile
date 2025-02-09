import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class EventAttendance extends Model {}

  EventAttendance.init(
    {
      eventID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Going', 'Interested', 'Not Going'),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'EventAttendance',
      timestamps: false,
    }
  );
  EventAttendance.removeAttribute('id');
  return EventAttendance;
};
