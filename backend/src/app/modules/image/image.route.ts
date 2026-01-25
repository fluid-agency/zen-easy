import express from "express";
import multer from "multer";
import { imageControllers } from "./image.controller";

const router = express.Router();

/* ---------- Multer Configuration ---------- */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image or PDF files are allowed"));
    }
  },
});

/* ---------- Routes ---------- */
router.post(
  "/upload-properties",
  upload.array("propertyImage", 5),
  imageControllers.uploadPropertyImages
);

router.post(
  "/upload-profile",
  upload.single("profileImage"),
  imageControllers.uploadProfileImage
);

router.post(
  "/upload-services",
  upload.array("serviceImages", 3),
  imageControllers.uploadServiceImages
);

router.post(
  "/upload-certificate",
  upload.single("certificate"),
  imageControllers.uploadCertificate
);

export const imageRoutes = router;
