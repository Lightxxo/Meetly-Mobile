import { Request, Response, NextFunction } from "express";
import db from "./models";
import dotenv from "dotenv";
import { ControllerType } from "./types/controller";
import { Op } from "sequelize";
import { hashPassword, comparePassword } from "./utils/hashing";
import jwt from "jsonwebtoken";
dotenv.config();

const controller: ControllerType = {};

const JWT_SECRET = process.env.JWT_SECRET_KEY!;
const JWT_EXPIRE = "1h";

controller.testDbConnectionController = async (req: Request, res: Response) => {
  try {
    await db.sequelize.authenticate();
    res.status(200).send("Database connection successful!");
  } catch (error: any) {
    res.status(500).send("Unable to connect to the database: " + error.message);
  }
};

controller.testServerUpController = async (req: Request, res: Response) => {
  res.send("Meetly Server up and running!!");
};

controller.signupController = async (req: Request, res: Response) => {
  const { username, email, password } = req.body[0];
  const hashedPassword = await hashPassword(password);

  try {
    const [user, created] = await db.User.findOrCreate({
      where: {
        [Op.or]: [{ username }, { email }],
      },
      defaults: {
        username: username,
        password: hashedPassword,
        email: email,
      },
    });

    if (created) {
      const token = jwt.sign({ id: user.dataValues.userID }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
      });

      res.status(201).json({
        ...user.dataValues,
        token: token,
      });
      console.log("User Signed Up!", user.dataValues);
    } else {
      res.status(409).json({ error: "User Credentials In Use", user: user });
      console.log("User Sign up Failed, Credentials In Use", user.dataValues);
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Error while signing up", message: error.message });
  }
};

controller.loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body[0];

  try {
    const user = await db.User.findAll({
      where: {
        email: email,
      },
    });

    if (user.length) {
      console.log(
        `Login request received, DB replied with user: ${user[0].dataValues.userID} OF TYPE: ${typeof user}`
      );
      const isValidPassword = await comparePassword(
        password,
        user[0].dataValues.password
      );
      if (isValidPassword) {
        const token = jwt.sign({ id: user[0].dataValues.userID }, JWT_SECRET, {
          expiresIn: JWT_EXPIRE,
        });

        res.status(201).json({
          ...user[0].dataValues,
          token: token,
        });
        return;
      } else {
        res.status(401).json({ error: "Invalid Login, Password mismatch" });
        return;
      }
    } else {
      res.status(401).json({ error: "Invalid Login, E-mail not found" });
    }
  } catch (e: any) {
    console.log(
      `Encountered error on LOGIN API when getting response back from server: ${e.message}`
    );
    res
      .status(500)
      .json({ error: "Internal Server Error", message: e.message });
  }
};



controller.userTokenVerifyController = async (req: Request, res: Response) => {
  const { userID } = req.body;

  const tok = req.headers['token'] as string;
  
  // if (!tok || !tok.startsWith('Bearer ')) {
  //   return res.status(400).json({ error: "Token not provided or invalid format" });
  // }

  const token = tok.split(' ')[1];
  

  try {
    jwt.verify(token, JWT_SECRET!);
    const decoded = jwt.decode(token);

    const user = await db.User.findAll({
      where: {
        userID: userID,
      },
    });

    
    if (decoded && typeof decoded !== "string") {
      if (decoded.id === userID && userID === user[0].dataValues.userID) {
        res.status(201).json({ validator: true });  
        return;  
      } else {
        res.status(401).json({ error: "Decoded User not matching User ID" });
        console.log("Decoded User not matching User ID", decoded.id, userID)
        return;  // Early return
      }
    } else {
      console.log("Invalid token");
      res.status(402).json({ error: "Invalid Token" });
      return;  // Early return
    }
  } catch (e: any) {
    console.log(`Encountered error on USER TOKEN VERIFY API: ${e.message}`);
    res.status(403).json({ error: "Unauthorized or expired token", message: e.message });
    return;  // Early return
  }
};



export default controller;
