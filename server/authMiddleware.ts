import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from "./models"; // Adjust this path based on your project structure

const JWT_SECRET = process.env.JWT_SECRET_KEY || "your-secret-key";
const authMiddleware = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("----- authMiddleware invoked -----");

    /** 1️⃣ Extract Authorization Header */
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Authorization header missing or invalid.");
      res.status(400).json({ error: "Token not provided or invalid format" });
      return 
    }

    /** 2️⃣ Extract Token */
    const token = authHeader.split(" ")[1];

    let processedToken;
    try {
      processedToken = JSON.parse(token);
    } catch (error) {
      console.error("Token parsing error:", error);
      res.status(400).json({ error: "Invalid token format" });
      return 
    }

    /** 3️⃣ Verify JWT */
    let decoded: any;
    try {
      decoded = jwt.verify(processedToken.token, JWT_SECRET);
      console.log("JWT decoded:", decoded);
    } catch (jwtErr: any) {
      console.error("JWT verification error:", jwtErr.message);
      res.status(403).json({ error: "Unauthorized or expired token", message: jwtErr.message });
      return 
    }

    /** 4️⃣ Fetch User from Database */
    const user: any = await db.User.findOne({ where: { userID: decoded.id } });
    if (!user) {
      console.error("User not found for id:", decoded.id);
      res.status(401).json({ error: "User not found" });
      return 
    }

    console.log("Authenticated user:", user);

    /** 5️⃣ Attach User to Request Object */
    req.user = user; // This allows the controller to access the authenticated user

    /** 6️⃣ Proceed to Next Middleware */
    next();
  } catch (error: any) {
    console.error("Error in authMiddleware:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
    return 
  }
};

export default authMiddleware;
