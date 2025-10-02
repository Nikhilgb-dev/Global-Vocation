import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";
import fs from "fs";

// ========== Cloudinary Config ==========
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ========== Multer Config (store files in /tmp locally) ==========
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tmp/"); // you can use OS tmp dir
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

export const uploadToCloudinary = async (
  filePath,
  folder = "jobportal_uploads"
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto", // supports images, pdf, docs, videos
    });

    // remove file from local tmp after upload
    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (err) {
    throw new Error("Cloudinary upload failed: " + err.message);
  }
};

export default cloudinary;
