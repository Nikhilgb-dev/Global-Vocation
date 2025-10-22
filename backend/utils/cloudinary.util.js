import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadToCloudinary = async (
  file,
  folder = "jobportal_uploads"
) => {
  if (!file) throw new Error("No file provided for upload.");

  const ext = path.extname(file.originalname).toLowerCase();
  const base = path.basename(file.originalname, ext);
  const mime = file.mimetype;

  // ✅ always treat non-images as raw binary
  const isBinary = !mime.startsWith("image/");
  const resourceType = isBinary ? "raw" : "image";

  // 🔒 create a unique temporary file
  const tempDir = path.join(process.cwd(), "tmp");
  fs.mkdirSync(tempDir, { recursive: true });
  const tempPath = path.join(tempDir, `${Date.now()}-${base}${ext}`);

  // write exact bytes from memory
  fs.writeFileSync(tempPath, file.buffer);

  try {
    const result = await cloudinary.uploader.upload(tempPath, {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    });

    fs.unlinkSync(tempPath); // clean up temp file
    return result.secure_url; // ✅ valid, viewable PDF URL
  } catch (err) {
    fs.unlinkSync(tempPath);
    console.error("❌ Cloudinary upload failed:", err);
    throw new Error("Cloudinary upload failed: " + err.message);
  }
};
