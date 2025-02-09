import { Dialect, Sequelize } from 'sequelize';
import dotenv from 'dotenv';


dotenv.config();

const sequelize = new Sequelize({    
  dialect: process.env.postgresql_dialect! as Dialect,
  database: process.env.postgresql_database!,
  username: process.env.postgresql_username!,
  password: process.env.postgresql_password!,
  host: process.env.postgresql_host!,
  port: parseInt(process.env.postgresql_port!),
});


// const db = {
//   User: UserModel(sequelize),
//   
// };

// export default db;
