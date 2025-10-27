import dotenv from "dotenv";
dotenv.config();

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from 'cloudinary'
// 1️⃣ Check if environment variables are set
const { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error(
    "Cloudinary environment variables are missing! Please check .env file."
  );
}

// 2️⃣ Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
console.log("dt env ",CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET)
console.log("Cloudinary config loaded successfully!");
console.log("Cloud Name:", CLOUD_NAME);

// 3️⃣ Create Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_avatar",
    format: async (req, file) => 'jpg', // supports promises as well
    public_id: (req, file) => 'computed-filename-using-request',
  },
//   folder: "user_avatar",
//   allowedFormats: ["jpg", "png", "jpeg", "webp"],
});

// 4️⃣ Create multer middleware


const upload = multer({ storage });

// 5️⃣ Export
export default upload;
