import { Request, Response } from 'express';
import db from './models'; 
import { ControllerType } from './types/controller'; 
import { Op } from 'sequelize';

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


controller.signupController = async (req: Request, res:Response)=>{
  const { username, email, password } = req.body[0];
  

  const [user, created] = await db.User.findOrCreate({
    where: {
      [Op.or]: [
        { username },
        { email }
      ]
    },
    defaults: {
      username: username,
      password:password,
      email:email
    },
  });
  if(created){
    res.status(201).json({user});
    console.log('User Signed Up!', user.dataValues);
  } else {
    res.status(409).json({error: 'User Credentials In Use', user:user});
    console.log('User Sign in Failed, Credentials In Use', user.dataValues)
  }
}

export default controller;