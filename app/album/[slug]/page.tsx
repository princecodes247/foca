import { notFound } from "next/navigation";
import AlbumPage from "./AlbumPage";

export default async function SingleGalleryPage({
	params,
}: {
	params: { slug: string };
}) {
	const gallery = await prisma?.gallery.findFirst({
		where: {
			slug: params?.slug,
			isPublished: true,
		},
		include: {
			images: true,
		},
	});

	if (!gallery) return notFound();
	await prisma?.gallery.update({
		where: { id: gallery.id },
		data: { views: { increment: 1 } },
	});

	return <AlbumPage gallery={gallery} />;
}
