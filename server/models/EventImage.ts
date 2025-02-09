import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class EventImage extends Model {}

  EventImage.init(
    {
      eventID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      
      sequelize,
      tableName: 'EventImages',
      timestamps: false,
    }
  );

  EventImage.removeAttribute('id');

  return EventImage;
};
