import express, { Request, Response } from 'express';
import db from './models'; 
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send('Meetly Server Running!!');
});


app.get('/test-db', async (req: Request, res: Response) => {
  try {

    await db.sequelize.authenticate();
    res.status(200).send('Database connection successful!');
  } catch (error:any) {
    res.status(500).send('Unable to connect to the database: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
