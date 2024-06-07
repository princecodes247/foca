import { v2 as CloudinaryClient } from "cloudinary";

export const getCloudinaryClient = () => {
  const NEXT_PUBLIC_UPLOAD_TRANSPORT = process.env.NEXT_PUBLIC_UPLOAD_TRANSPORT;

  if (NEXT_PUBLIC_UPLOAD_TRANSPORT !== "cloudinary") {
    throw new Error("Invalid upload transport");
  }

  const hasCredentials =
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_CLOUD_NAME;

  CloudinaryClient.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return CloudinaryClient;
};
