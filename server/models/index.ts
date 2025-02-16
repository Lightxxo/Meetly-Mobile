import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './User';
import EventTypeModel from './EventType';
import EventModel from './Event';
import EventCommentModel from './EventComment';
import EventAttendanceModel from './EventAttendance';
import EventImageModel from './EventImage';
import EventTypeOfEventModel from './EventTypeOfEvent';

dotenv.config();

const sequelize = new Sequelize({    
  dialect: "postgres",
  database: process.env.POSTGRESQL_DATABASE!,
  username: process.env.POSTGRESQL_USER!,
  password: process.env.POSTGRESQL_PASSWORD!,
  host: process.env.POSTGRESQL_HOST!,
  port: parseInt(process.env.POSTGRESQL_PORT!),
  logging: false,
});

const db = {
  sequelize,
  User: UserModel(sequelize),
  EventType: EventTypeModel(sequelize),
  Event: EventModel(sequelize),
  EventComment: EventCommentModel(sequelize),
  EventAttendance: EventAttendanceModel(sequelize),
  EventImage: EventImageModel(sequelize),
  EventTypeOfEvent: EventTypeOfEventModel(sequelize),
};


db.User.hasMany(db.Event, { foreignKey: 'hostID', onDelete: 'CASCADE' });
db.Event.belongsTo(db.User, { foreignKey: 'hostID', onDelete: 'CASCADE' });

db.Event.hasMany(db.EventComment, { foreignKey: 'eventID', onDelete: 'CASCADE' });
db.EventComment.belongsTo(db.Event, { foreignKey: 'eventID', onDelete: 'CASCADE' });

db.User.hasMany(db.EventComment, { foreignKey: 'userID', onDelete: 'CASCADE' });
db.EventComment.belongsTo(db.User, { foreignKey: 'userID', onDelete: 'CASCADE' });

db.Event.hasMany(db.EventAttendance, { foreignKey: 'eventID', onDelete: 'CASCADE' });
db.EventAttendance.belongsTo(db.Event, { foreignKey: 'eventID', onDelete: 'CASCADE' });

db.User.hasMany(db.EventAttendance, { foreignKey: 'userID', onDelete: 'CASCADE' });
db.EventAttendance.belongsTo(db.User, { foreignKey: 'userID', onDelete: 'CASCADE' });

db.Event.hasMany(db.EventImage, { foreignKey: 'eventID', onDelete: 'CASCADE' });
db.EventImage.belongsTo(db.Event, { foreignKey: 'eventID', onDelete: 'CASCADE' });

db.Event.belongsToMany(db.EventType, { through: db.EventTypeOfEvent, foreignKey: 'eventID', onDelete: 'CASCADE' });
db.EventType.belongsToMany(db.Event, { through: db.EventTypeOfEvent, foreignKey: 'eventTypeID', onDelete: 'NO ACTION' });


const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Database synchronization failed:", error);
  }
};

syncDatabase();

export default db;