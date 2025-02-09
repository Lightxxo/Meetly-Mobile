import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class EventTypeOfEvent extends Model {}

  EventTypeOfEvent.init(
    {
      eventTypeID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      eventID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'EventTypeOfEvents',
      timestamps: false,
    }
  );

  EventTypeOfEvent.removeAttribute('id');
  return EventTypeOfEvent;
};
