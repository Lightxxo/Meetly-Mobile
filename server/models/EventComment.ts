import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class EventComment extends Model {}

  EventComment.init(
    {
      commentID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull:false,
        primaryKey:true
      },
      eventID: {
        type: DataTypes.UUID,
        allowNull: false,

      },
      username:{
        type: DataTypes.STRING(50),
        allowNull:false
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
        allowNull: false, 
      },
    },
    {
      sequelize,
      tableName: 'EventComments',
      timestamps: false,
    }
  );

  return EventComment;
};
