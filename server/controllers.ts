import { Request, Response } from 'express';
import db from './models'; 

import { ControllerType } from './types/controller'; 

const controller: ControllerType = {};



controller.testDbConnectionController = async (req:Request, res:Response) => {
    try {
        await db.sequelize.authenticate();
        res.status(200).send('Database connection successful!');
      } catch (error:any) {
        res.status(500).send('Unable to connect to the database: ' + error.message);
      }
};

controller.testServerUpController = async (req: Request, res:Response) =>{
    res.send('Meetly Server up and running!!')
}


export default controller;