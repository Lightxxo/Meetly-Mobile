import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class EventTypeOfEvent extends Model {}

  EventTypeOfEvent.init(
    {
      eventTypeID: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true, 
      },
      eventID: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true, 
      },
    },
    {
      sequelize,
      tableName: 'EventTypeOfEvents',
      timestamps: false,
    }
  );

  return EventTypeOfEvent;
};
