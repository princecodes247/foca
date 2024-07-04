"use client";
import { Logo } from "@/components/icons";
import { title } from "@/components/primitives";
import Image from "next/image";
import Link from "next/link";
import testImg from "@/public/test.png";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useEffect, useRef, useState } from "react";
import type { Gallery } from "@prisma/client";
import type { GalleryWithImages } from "@/types";

export default function AlbumPage({
	gallery,
}: {
	gallery: GalleryWithImages;
}) {
	const galleryImages = gallery?.images
		?.sort((prevImage, currImage) => prevImage.order - currImage.order)
		?.map((image, index) => (
			<Link
				key={image.id}
				href={`/photo/${image.id}`}
				// ref={id === Number(`lastViewedPhoto`) ? lastViewedPhotoRef : null}
				// shallow
				className="relative block w-full mb-5 after:content group cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
			>
				<img
					alt="Event"
					className="w-full transition transform brightness-90 will-change-auto group-hover:brightness-110"
					style={{ transform: "translate3d(0, 0, 0)" }}
					// placeholder="blur"
					// blurDataURL={blurDataUrl}
					// src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
					src={image.url}
				// width={720}
				// height={480}
				// sizes="(max-width: 640px) 100vw,
				//   (max-width: 1280px) 50vw,
				//   (max-width: 1536px) 33vw,
				//   25vw"
				/>
			</Link>
		));
	const coverImage = gallery.images.find((image) => image.isCoverImage)?.url
		? gallery.images.find((image) => image.isCoverImage)?.url
		: gallery.images[0]
			? gallery.images[0].url
			: "";
	return (
		<main className="">
			{/* <h1 className={title()}>Gallery - {gallery?.name}</h1> */}
			<section className="relative h-[70svh] ">
				<img
					alt="Event cover"
					className="object-cover w-full h-full transition transform brightness-50"
					placeholder="blur"
					src={coverImage}
				/>
				{/* <h1 className={title()}>Gallery - {gallery?.name}</h1> */}
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<h1
						className={title({
							class: "text-white"
							//   "z-10 absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2",
						})}
					>
						{gallery?.name}
					</h1>
				</div>
			</section>
			{/* {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )} */}
			<section className="px-6 py-12 pt-16 mx-auto max-w-7xl">
				<ResponsiveMasonry columnsCountBreakPoints={{ 300: 2, 500: 3, 700: 4 }}>
					<Masonry gutter="4px">{galleryImages}</Masonry>
				</ResponsiveMasonry>
			</section>
		</main>
	);
}
