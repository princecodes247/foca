"use server";
import { match } from "ts-pattern";

import { newId } from "@/lib/id-helper";
import path from "node:path";
import { convertToSlug } from "@/lib/utils";
import { getCloudinaryClient } from "@/lib/files/cloudinary-client";
import { readFileAsBase64 } from "@/lib/utils/read-file-as-base64";

export const putFileServer = async (formData: FormData) => {
  const NEXT_PUBLIC_UPLOAD_TRANSPORT = process.env.NEXT_PUBLIC_UPLOAD_TRANSPORT;
  // console.log({ test });

  const rawFormData = {
    file: formData.get("file"),
  };
  const { data } = await match(NEXT_PUBLIC_UPLOAD_TRANSPORT)
    .with("cloudinary", async () =>
      putFileInCloudinaryServer({ file: rawFormData.file as File })
    )
    .otherwise(() => {
      return {
        data: null,
      };
    });

  return { data };
};

const putFileInCloudinaryServer = async ({
  file,
  photoId,
}: {
  file: File;
  photoId?: string;
}) => {
  if (!photoId) {
    photoId = newId("photo");
  }

  const client = getCloudinaryClient();
  const { name, ext } = path.parse(file.name);
  const key = `${photoId}-${convertToSlug(name)}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const base64data = buffer.toString("base64");

  console.log({ key, ext });
  try {
    const result = await client.uploader.upload(
      `data:image/${ext.slice(1)};base64,${base64data}`,
      {
        public_id: key,
        resource_type: "auto",
        folder: "albums",
        // Add more options as needed
      }
    );

    console.log("Upload successful", result);
    return {
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    };
  } catch (error) {
    console.error("Error uploading file to Cloudinary", error);
    throw error;
  }
};
