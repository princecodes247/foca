import { Logo } from "@/components/icons";
import { title } from "@/components/primitives";
import Image from "next/image";
import Link from "next/link";
import testImg from "@/public/test.png";
import { useEffect, useRef, useState } from "react";

export default async function SingleGalleryPage({
  params,
}: {
  params: { slug: string };
}) {
  console.log({ params });
  // const gallery = await prisma?.gallery.findFirst({
  //   where: {
  //     slug: params?.slug,
  //     isPublished: true
  //   }
  // })
  const photoId = "router.query";
  // const [lastViewedPhoto, setLastViewedPhoto] = useState(null);

  // const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  // useEffect(() => {
  //   // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
  //   if (lastViewedPhotoRef.current && lastViewedPhoto && !photoId) {
  //     lastViewedPhotoRef?.current.scrollIntoView({ block: "center" });
  //     setLastViewedPhoto(null);
  //   }
  // }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <main className="">
      {/* <h1 className={title()}>Gallery - {gallery?.name}</h1> */}
      <section className="relative border">
        <Image
          alt="Event photo"
          className="transition transform rounded-lg brightness-50"
          style={{ transform: "translate3d(0, 0, 0)" }}
          placeholder="blur"
          // blurDataURL={blurDataUrl}
          // src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
          src={testImg}
        />
        {/* <h1 className={title()}>Gallery - {gallery?.name}</h1> */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1
            className={title({
              // class:
              //   "z-10 absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2",
            })}
          >
            Album
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
      <section className="py-12">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {[0, 0, 0, 0].map((data, index) => (
            <Link
              key={index}
              href={`/?photoId=${0}`}
              as={`/p/${0}`}
              // ref={id === Number(`lastViewedPhoto`) ? lastViewedPhotoRef : null}
              shallow
              className="relative block w-full mb-5 after:content group cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Event photo"
                className="transition transform rounded-lg brightness-90 will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                // blurDataURL={blurDataUrl}
                // src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                src={testImg}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
