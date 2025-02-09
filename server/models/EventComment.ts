import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class EventComment extends Model {}

  EventComment.init(
    {
      eventID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
        validate: { min: 1.0, max: 5.0 },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'EventComments',
      timestamps: false,
    }
  );

  EventComment.removeAttribute('id');
  return EventComment;
};
