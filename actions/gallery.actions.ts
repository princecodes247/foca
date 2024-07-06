"use server";

import type { Gallery } from "@prisma/client";
import { z } from "zod";
import {
  putFileInCloudinaryServer,
  putFilesInCloudinaryServer,
  removeFileFromCloudinaryServer,
} from "./upload.actions";

const gallerySchema = z.object({
  title: z.string({
    invalid_type_error: "Invalid Title",
  }),
  // slug: z.string({
  //   invalid_type_error: "Invalid Slug",
  // }),
});

export async function createGallery({ name }: { name: string }) {
  // const parsedData = gallerySchema.safeParse(newGallery);
  // if (!parsedData.success) {
  //   const errors = {
  //     errors: parsedData.error.flatten().fieldErrors,
  //   };
  //   console.log({ errors });
  //   return errors;
  // }
  const slug = name
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // Remove non-word characters except hyphens
    .replace(/\-\-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "") // Remove leading hyphens
    .replace(/-+$/, ""); // Remove trailing hyphens
  const newGallery = await prisma?.gallery.create({
    data: {
      name,
      slug,
    },
  });
  return newGallery;
}

export async function uploadImagesToGallery(formData: FormData) {
  const rawFormData = {
    files: [] as File[],
    id: formData.get("id"),
  };

  // Extract files from the FormData
  formData.forEach((value, key) => {
    if (key === "files[]" && value instanceof File) {
      rawFormData.files.push(value);
    }
  });

  if (typeof rawFormData?.id !== "string" || rawFormData.files.length === 0) {
    return;
  }

  const gallery = await prisma?.gallery.findFirst({
    where: {
      id: rawFormData.id,
    },
  });
  if (!gallery) return;

  const result = await putFilesInCloudinaryServer({
    files: rawFormData.files,
  });

  const images = await prisma?.image.createMany({
    data: result.data.map((file, index) => ({
      url: file.url,
      galleryId: gallery.id,
      public_id: file.public_id,
      order: index + 1,
    })),
  });

  return { ...gallery, images };
}

export async function removeImageFromGallery(imageId: string) {
  if (typeof imageId !== "string") {
    throw new Error("Invalid image ID");
  }

  // Find the image to ensure it exists and get its gallery ID
  const image = await prisma?.image.findUnique({
    where: {
      id: imageId,
    },
  });

  if (!image) {
    throw new Error("Image not found");
  }
  try {
    // Update gallery in the database by removing the file URL
    await removeFileFromCloudinaryServer({ photoId: image.url });

    // Remove the image
    await prisma?.image.delete({
      where: {
        id: imageId,
      },
    });

    console.log("File removed successfully");
    // return updatedGallery;

    return { message: "Image removed successfully" };
  } catch (error) {
    console.error("Error removing file from Cloudinary", error);
    throw error;
  }
}

export async function changeImageOrderInGallery(
  galleryId: string,
  imageOrders: { id: string; order: number }[]
) {
  if (typeof galleryId !== "string" || !Array.isArray(imageOrders)) {
    throw new Error("Invalid input");
  }

  // Check if the gallery exists
  const gallery = await prisma?.gallery.findUnique({
    where: {
      id: galleryId,
    },
  });

  if (!gallery) {
    throw new Error("Gallery not found");
  }

  console.log({ imageOrders });
  // Update the order of each image
  const updatePromises = imageOrders.map(({ id, order }) =>
    prisma?.image.update({
      where: {
        id,
      },
      data: {
        order: order,
      },
    })
  );

  await Promise.all(updatePromises);

  return { message: "Image order updated successfully" };
}

export async function markImageAsCoverImage(imageId: string, markValue = true) {
  if (typeof imageId !== "string") {
    throw new Error("Invalid image ID");
  }

  // Find the image to ensure it exists and get its gallery ID
  const image = await prisma?.image.findUnique({
    where: {
      id: imageId,
    },
  });

  if (!image) {
    throw new Error("Image not found");
  }

  const galleryId = image.galleryId;
  if (!galleryId) {
    throw new Error("Image does not belong to any gallery");
  }

  // Unmark the existing cover image in the gallery
  await prisma?.image.updateMany({
    where: {
      galleryId: galleryId,
      isCoverImage: true,
    },
    data: {
      isCoverImage: false,
    },
  });

  // Mark the specified image as the cover image
  await prisma?.image.update({
    where: {
      id: imageId,
    },
    data: {
      isCoverImage: markValue,
    },
  });

  return { message: "Image marked as cover image successfully" };
}

export async function setImageHiddenStatus(imageId: string, hide = true) {
  if (typeof imageId !== "string") {
    throw new Error("Invalid image ID");
  }

  // Find the image to ensure it exists
  const image = await prisma?.image.findUnique({
    where: {
      id: imageId,
    },
  });

  if (!image) {
    throw new Error("Image not found");
  }

  // Update the isHidden status of the image
  await prisma?.image.update({
    where: {
      id: imageId,
    },
    data: {
      isHidden: hide,
    },
  });

  return { message: `Image ${hide ? "hidden" : "unhidden"} successfully` };
}

export async function updateGallery(id: string, newGallery: Partial<Gallery>) {
  const gallery = await prisma?.gallery.update({
    where: {
      id,
    },
    data: newGallery,
  });
  if (!gallery) return;

  return gallery;
}

export async function hideGallery(id: string, isPublished = true) {
  const gallery = await prisma?.gallery.update({
    where: {
      id,
    },
    data: {
      isPublished,
    },
  });
  if (!gallery) return;

  return gallery;
}

export async function deleteGallery(id: string) {
  const gallery = await prisma?.gallery.delete({
    where: {
      id,
    },
  });
  console.log({ gallery });
  if (!gallery) return;

  return gallery;
}

export async function updateImageViews(imageId: string) {
  const updatedImage = await prisma?.image.update({
    where: {
      id: imageId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  if (!updatedImage) {
    throw new Error("Image not found");
  }

  return updatedImage;
}
