import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const computeFileHash = (filePath: string): string => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/events/");
  },
  filename: (req, file, cb) => {
    const tempPath = `uploads/events/temp_${file.originalname}`;
    
    // Save file temporarily
    cb(null, `temp_${file.originalname}`);

    setTimeout(() => {
      if (fs.existsSync(tempPath)) {
        const fileHash = computeFileHash(tempPath);
        const ext = path.extname(file.originalname);
        const finalPath = `uploads/events/${fileHash}${ext}`;

        // If file already exists, delete temp file
        if (fs.existsSync(finalPath)) {
          fs.unlinkSync(tempPath);
          console.log(`Duplicate detected: ${finalPath}`);
        } else {
          // Rename temp file to final hashed name
          fs.renameSync(tempPath, finalPath);
        }
      }
    }, 500); // Delay to ensure the file is saved before processing
  },
});

const upload = multer({ storage });

export default upload;
