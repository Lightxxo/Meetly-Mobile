import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class EventType extends Model {}

  EventType.init(
    {
      eventTypeID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      eventType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: 'EventType',
      timestamps: false,
    }
  );

  return EventType;
};
