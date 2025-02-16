import { Request, Response, NextFunction } from "express";
import db from "./models";
import dotenv from "dotenv";
import { ControllerType } from "./types/controller";
import { Op } from "sequelize";
import { hashPassword, comparePassword } from "./utils/hashing";
import jwt from "jsonwebtoken";
import path from "path";


dotenv.config();

const controller: ControllerType = {};

const JWT_SECRET = process.env.JWT_SECRET_KEY!;
const JWT_EXPIRE = "1h";

const BASE_URL = "http://localhost:3000";

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
  


  const tok = req.headers['token'] as string;
  
  // if (!tok || !tok.startsWith('Bearer ')) {
  //   return res.status(400).json({ error: "Token not provided or invalid format" });
  // }

  const token = tok.split(' ')[1];
  

  try {
    jwt.verify(token, JWT_SECRET!);
    const decoded = jwt.decode(token);
    
    if (decoded && typeof decoded !== "string") {
      const user = await db.User.findAll({
        where: {
          userID: decoded.id,
        },
      });
      if (user && decoded.id === user[0].dataValues.userID) {
        res.status(201).json({ validator: true });  
        return;  
      } else {
        res.status(401).json({ error: "Decoded User not matching User ID IN DB OR USER NOT FOUND" });
        
        return; 
      }
    } else {
      console.log("Invalid token");
      res.status(402).json({ error: "Invalid Token" });
      return;  
    }
  } catch (e: any) {
    console.log(`Encountered error on USER TOKEN VERIFY API: ${e.message}`);
    res.status(403).json({ error: "Unauthorized or expired token", message: e.message });
    return;  
  }
};

controller.createEventController = async (req: any, res: Response): Promise<void> => {
  try {
    console.log("----- createEventController invoked -----");

    /** Extract Authenticated User */
    const user = req.user; // Authenticated user from authMiddleware

    /** Extract Fields from Body & Files */
    const { eventTitle, description, location, eventDate, thumbnailIndex, eventTypes } = req.body;
    const files: any = req.files;
    console.log("Request body:", req.body);
    console.log("Files received:", files);

    /** Validate Inputs */
    const errors: string[] = [];
    if (!eventTitle) errors.push("Event title is required.");
    if (!description) errors.push("Description is required.");
    if (!location) errors.push("Location is required.");
    if (!eventDate) errors.push("Event date is required.");
    
    let eventTypesArr: any;
    try {
      eventTypesArr = typeof eventTypes === "string" ? JSON.parse(eventTypes) : eventTypes;
    } catch (e) {
      errors.push("Invalid format for event types.");
    }
    if (!eventTypesArr || !Array.isArray(eventTypesArr) || eventTypesArr.length === 0) {
      errors.push("At least one event type is required.");
    }
    if (!files || files.length === 0) {
      errors.push("At least one event image is required.");
    }
    if (
      thumbnailIndex === undefined ||
      isNaN(thumbnailIndex) ||
      parseInt(thumbnailIndex, 10) >= files.length
    ) {
      errors.push("Invalid or missing thumbnail index.");
    }
    if (errors.length > 0) {
      console.error("Validation errors:", errors);
      res.status(400).json({ error: errors.join(", ") });
      return;
    }

    /** Generate Full Image URLs */
    const imageUrls = files.map((file: any) => `${BASE_URL}/uploads/events/${file.filename}`);

    /** Create the Event */
    const newEvent: any = await db.Event.create({
      hostID: user.userID,
      eventTitle,
      description,
      location,
      eventDate,
      thumbnail: imageUrls[parseInt(thumbnailIndex, 10)], // Save full URL as thumbnail
    });
    console.log("New event created:", newEvent);
    const eventID = newEvent.eventID;

    /** Store Event Images in DB */
    const eventImagesData = imageUrls.map((url: string) => ({
      eventID,
      image: url,
    }));
    const imagesResult = await db.EventImage.bulkCreate(eventImagesData);

    /** Store Event Types in DB */
    const eventTypesData: any[] = [];
    for (const typeName of eventTypesArr) {
      const [eventType]: any = await db.EventType.findOrCreate({
        where: { eventType: typeName },
        defaults: { eventType: typeName },
      });
      if (!eventType.eventTypeID) {
        console.error("Event type not created properly for:", typeName);
      }
      eventTypesData.push({ eventID, eventTypeID: eventType.eventTypeID });
    }
    const eventTypesResult = await db.EventTypeOfEvent.bulkCreate(eventTypesData);

    /** Add Host as Attendee */
    const attendeeResult = await db.EventAttendance.create({
      eventID,
      userID: user.userID,
      status: "Going",
    });

    /** Return Success Response */
    res.status(201).json({ event: newEvent, message: "Event created successfully!" });
    console.log("----- createEventController completed successfully -----");
  } catch (error: any) {
    console.error("Error in createEventController:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

controller.getPaginatedEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("----- getPaginatedEvents invoked -----");

    // Parse limit and offset from query params, default to 9 events per request
    const limit = parseInt(req.query.limit as string) || 9;
    const offset = parseInt(req.query.offset as string) || 0; // Defaults to 0 if not provided

    // Fetch events sorted by createdAt (newest first), with limit & offset
    const events = await db.Event.findAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    // total count of events for frontend pagination
    const totalEvents = await db.Event.count();

    console.log(`Events retrieved: ${events.length}, Offset: ${offset}, Total: ${totalEvents}`);

    res.status(200).json({
      events,
      totalEvents, 
      hasMore: offset + events.length < totalEvents, 
    });
  } catch (error: any) {
    console.error("Error in getPaginatedEvents:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

controller.getEventDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("----- getEventDetails invoked -----");

    // 1. Get eventID from URL params
    const { eventID } = req.params;
    // console.log("Event ID from params:", eventID);
    if (!eventID) {
      console.error("Event ID is missing.");
      res.status(400).json({ error: "Event ID is required" });
      return;
    }

    // 2. Fetch event details from the Events table.
    const event = await db.Event.findOne({ where: { eventID } });
    if (!event) {
      console.error("No event found for ID:", eventID);
      res.status(404).json({ error: "Event not found" });
      return;
    }
    // console.log("Fetched event details:", event.dataValues);

    
    const hostID = event.dataValues.hostID
    const host = await db.User.findOne({ where: { userID: hostID } });


    // 3. Fetch all event images from the EventImages table.
    const images = await db.EventImage.findAll({ where: { eventID } });
    // console.log("Fetched event images:", images.map((img: any) => img.dataValues));

    // 4. Fetch attendees with status "Going" including basic user details.
    const attendees = await db.EventAttendance.findAll({
      where: { eventID, status: "Going" },
      include: [
        {
          model: db.User,
          attributes: ["userID", "username", "email"],
        },
      ],
    });
    // console.log("Fetched attendees (Going):", attendees.map((att: any) => att.dataValues));

    // 5. Count how many people are "Going" and "Interested".
    const goingCount = await db.EventAttendance.count({ where: { eventID, status: "Going" } });
    const interestedCount = await db.EventAttendance.count({ where: { eventID, status: "Interested" } });
    // console.log("Going count:", goingCount);
    // console.log("Interested count:", interestedCount);

    // 6. Comments placeholder (for now, an empty array)
    const comments: any[] = [];
    // console.log("Comments placeholder:", comments);

    // 7. Return the consolidated response.
    res.status(200).json({
      event,
      images,
      attendees,
      goingCount,
      interestedCount,
      comments,
      host
    });
    console.log("----- getEventDetails completed successfully -----");
  } catch (error: any) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

controller.getUserRSVPStatus = async (req: any, res: Response) => {

  const userID = req.query.userID as string;
  const eventID = req.query.eventID as string;
  console.log(userID, eventID);

  try {
    // Find the event attendance record for the given user and event
    const eventAttendance:any = await db.EventAttendance.findOne({
      where: {
        eventID: eventID,
        userID: userID,
      },
    });

    if (!eventAttendance) {
      res.status(404).json({
        message: 'RSVP status not found for this user and event.',
      });
      return;
    }

    
    res.status(200).json({
      userID: eventAttendance.userID,
      eventID: eventAttendance.eventID,
      status: eventAttendance.status, // Going, Interested, Not Going
    });
    return;
  } catch (error:any) {
    console.error('Error fetching RSVP status:', error);
    res.status(500).json({
      message: 'Error fetching RSVP status.',
      error: error.message,
    });
    return;
  }
};

export default controller;



