import { Router } from "express";
import multer from "multer";
import cloudinary from "../clouldinary/cloudinary.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// console.log("cloudinary.config()", cloudinary.config());

function ensureImage(req, res, next) {
  const isImage = (req.file?.mimetype || "").startsWith("image/");
  if (!isImage)
    return res.status(400).json({ message: "Only image files allowed" });
  next();
}

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const tenantId =
      (req.tenant && String(req.tenant)) ||
      (req.user?.tenant && String(req.user.tenant)) ||
      (req.role?.tenant && String(req.role.tenant)) ||
      "public";

    const folder = `instaclass/homework/${tenantId}`;

    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto", // accept any file type
          use_filename: true,
          unique_filename: true,
          filename_override: req.file.originalname,
        },
        (err, file) => (err ? reject(err) : resolve(file))
      );
      stream.end(req.file.buffer);
    });

    // match your UI: const { data } = await res.json();
    return res.json({
      data: {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        filename: req.file.originalname || uploaded.original_filename,
        mimeType: req.file.mimetype || uploaded.resource_type,
        sizeBytes: req.file.size ?? undefined,
      },
    });
  } catch (err) {
    console.error("Generic upload failed:", err);
    return res.status(500).json({ message: err.message || "Upload failed" });
  }
});

router.post("/student-photo", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    // optional: folder per-tenant
    const folder = `instaclass/students/${req.tenant}`;
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            { width: 300, height: 300, crop: "fill", gravity: "face" },
          ],
        },
        (err, uploaded) => (err ? reject(err) : resolve(uploaded))
      );
      stream.end(req.file.buffer);
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Upload failed" });
  }
});

router.post(
  "/teacher-photo",
  upload.single("file"),
  ensureImage,
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No file provided" });

      const tenantFolder = req.tenant ? String(req.tenant) : "public";
      const folder = `instaclass/teachers/${tenantFolder}`;

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "image",
            transformation: [
              { width: 300, height: 300, crop: "fill", gravity: "face" },
            ],
          },
          (err, uploaded) => (err ? reject(err) : resolve(uploaded))
        );
        stream.end(req.file.buffer);
      });

      res.json({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      });
    } catch (err) {
      res.status(500).json({ message: err.message || "Upload failed" });
    }
  }
);

export default router;
